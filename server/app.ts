import express, { Request,Response,NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import {randomBytes,createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';
import {z,ZodError} from 'zod';
import {db} from './db';
import {leadSchema,contentSchema,roles,statuses,kinds} from '../lib/validation';
import type {User,Prisma} from '@prisma/client';

declare global { namespace Express { interface Request { user?:User; sessionId?:string; } } }
const app=express();
app.disable('x-powered-by');
app.use(helmet());app.use(express.json({limit:'512kb'}));app.use(cookieParser());
app.use('/api',(_req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
const origin=()=>process.env.APP_ORIGIN||'http://127.0.0.1:3000';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const audit=async(actorId:string|undefined,action:string,resourceId?:string,detail='')=>{await db.auditLog.create({data:{actorId,action,resourceId,detail}});};
function fail(res:Response,status:number,message:string){return res.status(status).json({error:{message}});}
app.use('/api/v1',async(req,res,next)=>{
 if(req.cookies.forest_session){const sess=await db.session.findUnique({where:{id:hash(req.cookies.forest_session)},include:{user:true}});if(sess&&sess.expiresAt>new Date()&&sess.user.active){req.user=sess.user;req.sessionId=sess.id;}}
 if(!['GET','HEAD','OPTIONS'].includes(req.method)){
  if(req.headers.origin!==origin())return fail(res,403,'Unrecognized request origin.');
  if(req.user){const sess=await db.session.findUnique({where:{id:req.sessionId}});if(!sess||req.headers['x-csrf-token']!==sess.csrf)return fail(res,403,'Session verification failed. Reload and try again.');}
 }
 next();
});
const auth=(req:Request,res:Response,next:NextFunction)=>req.user?next():fail(res,401,'Please sign in.');
const permit=(...allowed:string[])=>(req:Request,res:Response,next:NextFunction)=>{if(!req.user)return fail(res,401,'Please sign in.');if(req.user.role==='Super Admin'||allowed.includes(req.user.role))return next();return fail(res,403,'Your role does not permit this action.');};
const contentWrite=permit('Content Administrator');
const contentRead=permit('Content Administrator','Analyst / Viewer');
const leadRead=permit('Sales Manager','Sales Executive','Analyst / Viewer');
const leadWrite=permit('Sales Manager','Sales Executive');
const authLimit=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:true,legacyHeaders:false,message:{error:{message:'Too many attempts. Please try again later.'}}});
app.get('/api/v1/health',async(_req,res)=>{await db.$queryRaw`SELECT 1`;res.json({ok:true});});
app.post('/api/v1/auth/login',authLimit,async(req,res)=>{
 const {email,password}=z.object({email:z.string().email().max(254),password:z.string().max(200)}).parse(req.body);
 const user=await db.user.findUnique({where:{email:email.toLowerCase()}});
 const valid=await bcrypt.compare(password,user?.passwordHash||'$2b$12$GvMSjBEc7wfAhoF2T3dx6uB67ZJAbQ5p0nCgA7SUH3l10zXk.q3fa');
 if(!user||!valid||!user.active){await audit(undefined,'login.failed');return fail(res,401,'Email or password is incorrect.');}
 const token=randomBytes(32).toString('hex'),csrf=randomBytes(32).toString('hex');
 await db.session.create({data:{id:hash(token),userId:user.id,csrf,expiresAt:new Date(Date.now()+8*3600000)}});
 res.cookie('forest_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',maxAge:8*3600000,path:'/'});
 await audit(user.id,'login');res.json({user:{id:user.id,name:user.name,role:user.role,email:user.email},csrf});
});
app.get('/api/v1/auth/me',auth,async(req,res)=>{const s=await db.session.findUnique({where:{id:req.sessionId}});res.json({user:{id:req.user!.id,name:req.user!.name,role:req.user!.role,email:req.user!.email},csrf:s!.csrf});});
app.post('/api/v1/auth/logout',auth,async(req,res)=>{await db.session.deleteMany({where:{id:req.sessionId}});res.clearCookie('forest_session',{path:'/'});res.json({ok:true});});
app.post('/api/v1/auth/forgot-password',authLimit,async(req,res)=>{
 const {email}=z.object({email:z.string().email().max(254)}).parse(req.body);
 if(!process.env.SMTP_HOST||!process.env.SMTP_FROM)return fail(res,503,'Email recovery is not configured. Contact your administrator.');
 const user=await db.user.findUnique({where:{email:email.toLowerCase()}});
 if(user&&user.active){const token=randomBytes(32).toString('hex');await db.$transaction([db.passwordReset.create({data:{id:hash(token),userId:user.id,expiresAt:new Date(Date.now()+30*60000)}}),db.notification.create({data:{recipient:user.email,subject:'Reset your Forest Eco Resort password',body:`Use this link within 30 minutes: ${origin()}/admin?reset=${token}`}})]);}
 res.json({message:'If an active account exists, a reset link will be emailed.'});
});
app.post('/api/v1/auth/reset-password',authLimit,async(req,res)=>{
 const {token,password}=z.object({token:z.string().length(64),password:z.string().min(14).max(200)}).parse(req.body);
 const passwordHash=await bcrypt.hash(password,12);
 await db.$transaction(async tx=>{const reset=await tx.passwordReset.findUnique({where:{id:hash(token)}});if(!reset||reset.usedAt||reset.expiresAt<new Date())throw new Error('INVALID_RESET');const used=await tx.passwordReset.updateMany({where:{id:reset.id,usedAt:null},data:{usedAt:new Date()}});if(!used.count)throw new Error('INVALID_RESET');await tx.user.update({where:{id:reset.userId},data:{passwordHash}});await tx.session.deleteMany({where:{userId:reset.userId}});});res.json({ok:true});
});
app.post('/api/v1/leads',rateLimit({windowMs:3600000,limit:12,standardHeaders:true,legacyHeaders:false}),async(req,res)=>{
 const input=leadSchema.parse(req.body);
 const existing=await db.lead.findUnique({where:{submissionKey:input.submissionKey}});if(existing)return res.json({id:existing.id,message:'Your inquiry has been received.'});
 const {consent,website,...data}=input;
 const lead=await db.$transaction(async tx=>{
  const l=await tx.lead.create({data:{...data,consentAt:new Date(),activities:{create:{kind:'Created',text:'Inquiry received with privacy consent.'}}}});
  await tx.notification.create({data:{leadId:l.id,recipient:process.env.SALES_NOTIFICATION_EMAIL||'',subject:'New Forest Eco Resort inquiry',body:`A new ${l.interest} inquiry is available in the secure dashboard: ${origin()}/admin`,status:process.env.SMTP_HOST&&process.env.SALES_NOTIFICATION_EMAIL?'Pending':'Unconfigured'}});return l;
 });res.status(201).json({id:lead.id,message:'Your inquiry has been received.'});
});
function leadWhere(req:Request):Prisma.LeadWhereInput{
 const q=typeof req.query.q==='string'?req.query.q.slice(0,200):'';
 return {...(req.user!.role==='Sales Executive'?{assignedTo:req.user!.id}:req.query.assignedTo?{assignedTo:String(req.query.assignedTo)}:{}),...(req.query.status?{status:String(req.query.status)}:{}),...(req.query.interest?{interest:String(req.query.interest)}:{}),...(req.query.source?{source:{contains:String(req.query.source)}}:{}),...(req.query.from||req.query.to?{createdAt:{...(req.query.from?{gte:z.coerce.date().parse(req.query.from)}:{}),...(req.query.to?{lte:z.coerce.date().parse(req.query.to)}:{})}}:{}),...(q?{OR:['fullName','email','mobile','id'].map(k=>({[k]:{contains:q}}))}:{})};
}
const pagination=(req:Request)=>({page:Math.max(1,Number(req.query.page)||1),limit:Math.min(100,Math.max(1,Number(req.query.limit)||20))});
app.get('/api/v1/admin/leads',leadRead,async(req,res)=>{const {page,limit}=pagination(req),where=leadWhere(req);const [items,total]=await Promise.all([db.lead.findMany({where,include:{assignee:{select:{name:true}}},orderBy:req.query.sort==='priority'?{priority:'asc'}:{createdAt:'desc'},skip:(page-1)*limit,take:limit}),db.lead.count({where})]);res.json({items,total,page,limit});});
app.get('/api/v1/admin/leads/export',permit('Sales Manager'),async(req,res)=>{
 const leads=await db.lead.findMany({where:leadWhere(req),orderBy:{createdAt:'desc'},take:10000});const cols=['id','fullName','email','mobile','interest','status','priority','source','createdAt'];
 const csv=(v:unknown)=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"' $&").replace(/"/g,'""')+'"';
 await audit(req.user!.id,'leads.export',undefined,`${leads.length} records`);res.setHeader('Content-Type','text/csv; charset=utf-8');res.attachment('forest-leads.csv');res.send('\uFEFF'+[cols.join(','),...leads.map(l=>cols.map(c=>csv((l as any)[c])).join(','))].join('\r\n'));
});
async function permittedLead(req:Request){return db.lead.findFirst({where:{id:String(req.params.id),...(req.user!.role==='Sales Executive'?{assignedTo:req.user!.id}:{})},include:{activities:{orderBy:{createdAt:'desc'}},assignee:{select:{name:true}}}});}
app.get('/api/v1/admin/leads/:id',leadRead,async(req,res)=>{const l=await permittedLead(req);if(!l)return fail(res,404,'Lead not found.');res.json(l);});
app.patch('/api/v1/admin/leads/:id',leadWrite,async(req,res)=>{
 const old=await permittedLead(req);if(!old)return fail(res,404,'Lead not found.');
 const input=z.object({status:z.enum(statuses).optional(),priority:z.enum(['Low','Normal','High','Urgent']).optional(),assignedTo:z.string().nullable().optional(),followUpAt:z.string().datetime().nullable().optional(),lastContactAt:z.string().datetime().nullable().optional(),note:z.string().trim().min(1).max(4000).optional()}).strict().parse(req.body);
 if(input.assignedTo!==undefined&&!['Super Admin','Sales Manager'].includes(req.user!.role))return fail(res,403,'Only sales managers can assign leads.');
 if(input.assignedTo){const staff=await db.user.findUnique({where:{id:input.assignedTo}});if(!staff?.active||!['Super Admin','Sales Manager','Sales Executive'].includes(staff.role))return fail(res,400,'Choose an active sales staff member.');}
 const {note,...data}=input;
 const lead=await db.$transaction(async tx=>{const l=await tx.lead.update({where:{id:old.id},data});await tx.leadActivity.create({data:{leadId:old.id,actorId:req.user!.id,kind:note?'Note':'Updated',text:note||JSON.stringify(data)}});await tx.auditLog.create({data:{actorId:req.user!.id,action:'lead.updated',resourceId:old.id,detail:Object.keys(input).join(',')}});return l;});res.json(lead);
});
app.get('/api/v1/admin/analytics',permit('Sales Manager','Analyst / Viewer','Sales Executive'),async(req,res)=>{
 const where=leadWhere(req);const leads=await db.lead.findMany({where,select:{status:true,createdAt:true,source:true,followUpAt:true}});const count=(status:string)=>leads.filter(l=>l.status===status).length;
 const trends:Record<string,number>={},sources:Record<string,number>={};for(const l of leads){const day=l.createdAt.toISOString().slice(0,10);trends[day]=(trends[day]||0)+1;sources[l.source]=(sources[l.source]||0)+1;}
 const activities=await db.leadActivity.findMany({where:{lead:where},orderBy:{createdAt:'desc'},take:10});res.json({total:leads.length,new:count('New'),qualified:count('Qualified'),converted:count('Converted'),followUps:leads.filter(l=>l.followUpAt&&l.followUpAt<=new Date()).length,trends,sources,activities});
});
app.get(['/api/v1/content/:kind','/api/v1/pages','/api/v1/settings','/api/v1/villas','/api/v1/facilities','/api/v1/experiences','/api/v1/masterplan','/api/v1/gallery','/api/v1/articles'],async(req,res)=>{
 const kind=z.enum(kinds).parse(req.params.kind||req.path.split('/').pop());const {page,limit}=pagination(req);
 const where:Prisma.ContentWhereInput={kind,status:'Published',...(req.query.slug?{slug:String(req.query.slug)}:{})};
 const [items,total]=await Promise.all([db.content.findMany({where,orderBy:[{sortOrder:'asc'},{createdAt:'desc'}],take:limit,skip:(page-1)*limit,select:{id:true,kind:true,slug:true,title:true,data:true,sortOrder:true,updatedAt:true,createdAt:true}}),db.content.count({where})]);res.json({items,total,page});
});
app.get('/api/v1/admin/content/:kind',contentRead,async(req,res)=>{const kind=z.enum(kinds).parse(req.params.kind);res.json({items:await db.content.findMany({where:{kind},orderBy:{sortOrder:'asc'}})});});
app.post('/api/v1/admin/content',contentWrite,async(req,res)=>{
 const {approved,...data}=contentSchema.parse(req.body);if(['Published','Scheduled'].includes(data.status)&&data.data.sensitive===true&&(!approved||req.user!.role!=='Super Admin'))return fail(res,403,'Sensitive ownership claims require Super Admin approval.');
 validateContent(data);
 const item=await db.content.create({data:{...data,data:data.data as Prisma.InputJsonValue,...(approved&&req.user!.role==='Super Admin'?{approvedBy:req.user!.id,approvedAt:new Date()}:{} )}});await audit(req.user!.id,'content.created',item.id);res.status(201).json(item);
});
function validateContent(data:z.infer<typeof contentSchema>){if(data.status==='Scheduled'&&!data.publishAt)throw new Error('SCHEDULE_REQUIRED');const serialized=JSON.stringify(data.data);if(serialized.length>150000)throw new Error('CONTENT_TOO_LARGE');if(data.kind==='settings'){const keys=Object.keys(data.data);if(keys.some(k=>/secret|password|token|api.?key|smtp|notification/i.test(k)))throw new Error('PRIVATE_SETTINGS');}if(data.kind==='masterplan'&&data.status==='Published'&&!data.data.narrative)throw new Error('PHASE_NARRATIVE_REQUIRED');}
app.put('/api/v1/admin/content/:id',contentWrite,async(req,res)=>{
 const {approved,...data}=contentSchema.parse(req.body);const old=await db.content.findUnique({where:{id:String(req.params.id)}});if(!old)return fail(res,404,'Content not found.');
 if(old.kind==='masterplan'&&old.status==='Published'&&data.status==='Archived')return fail(res,409,'Unpublish this phase before archiving it.');
 if(['Published','Scheduled'].includes(data.status)&&data.data.sensitive===true&&(!approved||req.user!.role!=='Super Admin'))return fail(res,403,'Sensitive ownership claims require Super Admin approval.');validateContent(data);
 const item=await db.content.update({where:{id:old.id},data:{...data,data:data.data as Prisma.InputJsonValue,approvedBy:approved&&req.user!.role==='Super Admin'?req.user!.id:null,approvedAt:approved&&req.user!.role==='Super Admin'?new Date():null}});await audit(req.user!.id,'content.updated',item.id,`${old.status} → ${data.status}`);res.json(item);
});
const mediaDir=()=>path.resolve(process.env.MEDIA_DIRECTORY||'./data/media');
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:12*1024*1024,files:1}});
app.post('/api/v1/admin/media',contentWrite,upload.single('file'),async(req,res)=>{
 const file=req.file;if(!file)return fail(res,400,'Choose a file.');const b=file.buffer;
 const detected=b.subarray(0,5).toString()==='%PDF-'?'application/pdf':b[0]===0xff&&b[1]===0xd8&&b[2]===0xff?'image/jpeg':b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP'?'image/webp':null;
 if(!detected)return fail(res,400,'Only genuine JPEG, PNG, WebP and PDF files are accepted.');
 const fields=z.object({alt:z.string().min(1).max(500),caption:z.string().max(1000).default(''),assetType:z.enum(['Photograph','Render','Concept image','Illustration','Document']),association:z.string().max(200).optional()}).parse(req.body);
 const storageKey=randomBytes(24).toString('hex');await fs.mkdir(mediaDir(),{recursive:true});await fs.writeFile(path.join(mediaDir(),storageKey),b,{flag:'wx'});
 const item=await db.media.create({data:{storageKey,originalName:path.basename(file.originalname),mimeType:detected,size:file.size,...fields}});await audit(req.user!.id,'media.uploaded',item.id);res.status(201).json(item);
});
app.get('/api/v1/admin/media',contentRead,async(req,res)=>{res.json({items:await db.media.findMany({where:{...(req.query.q?{alt:{contains:String(req.query.q)}}:{}),...(req.query.status?{status:String(req.query.status)}:{})},orderBy:{createdAt:'desc'},take:200})});});
app.patch('/api/v1/admin/media/:id',contentWrite,async(req,res)=>{const data=z.object({alt:z.string().min(1).max(500).optional(),caption:z.string().max(1000).optional(),status:z.enum(['Draft','Published','Archived']).optional(),assetType:z.enum(['Photograph','Render','Concept image','Illustration','Document']).optional()}).strict().parse(req.body);const item=await db.media.update({where:{id:String(req.params.id)},data});await audit(req.user!.id,'media.updated',item.id);res.json(item);});
app.get('/api/v1/media/:id',async(req,res)=>{const item=await db.media.findUnique({where:{id:String(req.params.id)}});if(!item||item.status!=='Published'&&(!req.user||!['Super Admin','Content Administrator'].includes(req.user.role)))return fail(res,404,'File not found.');res.type(item.mimeType);if(item.mimeType==='application/pdf')res.attachment(item.originalName);res.sendFile(path.join(mediaDir(),item.storageKey));});
app.get('/api/v1/brochures/:id/download',async(req,res)=>{const c=await db.content.findFirst({where:{id:String(req.params.id),kind:'brochures',status:'Published'}});if(!c)return fail(res,404,'Document unavailable.');const d=c.data as any;if(d.private)return fail(res,404,'Document unavailable.');if(d.expiresAt&&new Date(d.expiresAt)<new Date())return fail(res,410,'This document has expired.');const media=await db.media.findFirst({where:{id:d.mediaId||'',status:'Published',mimeType:'application/pdf'}});if(!media)return fail(res,404,'Approved document file unavailable.');await db.event.create({data:{name:'brochure.downloaded',resource:c.id}});res.type('application/pdf').attachment(media.originalName).sendFile(path.join(mediaDir(),media.storageKey));});
app.get('/api/v1/admin/staff',leadRead,async(_req,res)=>res.json({items:await db.user.findMany({where:{active:true,role:{in:['Super Admin','Sales Manager','Sales Executive']}},select:{id:true,name:true,role:true}})}));
app.get('/api/v1/admin/users',permit(),async(_req,res)=>res.json({items:await db.user.findMany({select:{id:true,email:true,name:true,role:true,active:true,createdAt:true}})}));
app.post('/api/v1/admin/users',permit(),async(req,res)=>{const input=z.object({email:z.string().email().max(254),name:z.string().min(1).max(120),password:z.string().min(14).max(200),role:z.enum(roles)}).parse(req.body);const {password,...data}=input;const u=await db.user.create({data:{...data,email:data.email.toLowerCase(),passwordHash:await bcrypt.hash(password,12)}});await audit(req.user!.id,'user.created',u.id);res.status(201).json({id:u.id});});
app.patch('/api/v1/admin/users/:id',permit(),async(req,res)=>{const data=z.object({role:z.enum(roles).optional(),active:z.boolean().optional()}).strict().parse(req.body);if(req.user!.id===req.params.id)return fail(res,400,'You cannot change your own access.');const u=await db.user.update({where:{id:String(req.params.id)},data});await db.session.deleteMany({where:{userId:u.id}});await audit(req.user!.id,'user.updated',u.id);res.json({id:u.id});});
app.get('/api/v1/admin/audit',permit('Analyst / Viewer'),async(_req,res)=>res.json({items:await db.auditLog.findMany({orderBy:{createdAt:'desc'},take:100})}));
app.get('/api/v1/admin/notifications',permit('Sales Manager'),async(_req,res)=>res.json({configured:!!(process.env.SMTP_HOST&&process.env.SMTP_FROM&&process.env.SALES_NOTIFICATION_EMAIL),whatsapp:false,items:await db.notification.findMany({select:{id:true,leadId:true,status:true,attempts:true,lastError:true,createdAt:true},orderBy:{createdAt:'desc'},take:100})}));
app.post('/api/v1/admin/notifications/:id/retry',permit('Sales Manager'),async(req,res)=>{if(!process.env.SMTP_HOST||!process.env.SALES_NOTIFICATION_EMAIL)return fail(res,503,'Configure the email provider first.');await db.notification.update({where:{id:String(req.params.id)},data:{status:'Pending',attempts:0,nextAttemptAt:new Date(),recipient:process.env.SALES_NOTIFICATION_EMAIL}});await audit(req.user!.id,'notification.retry',String(req.params.id));res.json({ok:true});});
app.post('/api/v1/events',rateLimit({windowMs:60000,limit:30}),async(req,res)=>{const data=z.object({name:z.enum(['inquiry.opened','inquiry.submitted','villa.viewed','phase.viewed','phone.clicked','email.clicked','contact.clicked']),resource:z.string().regex(/^[a-z0-9\-/]{0,120}$/).optional(),consent:z.literal(true)}).parse(req.body);await db.event.create({data:{name:data.name,resource:data.resource}});res.status(204).end();});
app.use('/api',(_req,res)=>fail(res,404,'Endpoint not found.'));
app.use((err:any,_req:Request,res:Response,_next:NextFunction)=>{if(err instanceof ZodError)return res.status(422).json({error:{message:'Please check the highlighted fields.',fields:err.flatten().fieldErrors}});if(err.code==='P2002')return fail(res,409,'This record already exists.');if(err.code==='P2025')return fail(res,404,'Record not found.');if(err instanceof multer.MulterError)return fail(res,400,'File exceeds the upload limits.');if(err.message==='INVALID_RESET')return fail(res,400,'Reset link is invalid or expired.');if(['SCHEDULE_REQUIRED','PRIVATE_SETTINGS','CONTENT_TOO_LARGE','PHASE_NARRATIVE_REQUIRED'].includes(err.message))return fail(res,422,err.message.replaceAll('_',' ').toLowerCase());console.error('Request failed:',err.name,err.code||'');return fail(res,500,'Something went wrong. Your input has been preserved; please retry.');});
export default app;
