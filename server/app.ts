import express, { Request,Response,NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import {randomBytes,createHash,timingSafeEqual,randomUUID} from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import {z,ZodError} from 'zod';
import {db} from './db';
import {leadSchema,contentSchema,roles,statuses,kinds,REMOTE_MEDIA} from '../lib/validation';
import {siteUrl} from '../lib/site';
import {brochureFor} from '../lib/villas';
import {processNotifications} from './notifications';
import type {User,Prisma} from '@prisma/client';

declare global { namespace Express { interface Request { user?:User; sessionId?:string; } } }
const app=express();
app.disable('x-powered-by');
app.set('trust proxy',1);
app.use(helmet());app.use(express.json({limit:'512kb'}));app.use(cookieParser());
app.use('/api',(_req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
const configuredOrigins=()=>new Set((process.env.APP_ORIGIN||'').split(',').map(s=>s.trim().replace(/\/$/,'')).filter(Boolean));
const origin=()=>siteUrl();
function isAllowedOrigin(req:Request){
 const o=req.headers.origin;if(!o)return false;
 if(configuredOrigins().has(o))return true;
 const host=String(req.headers['x-forwarded-host']||req.headers.host||'').split(',')[0].trim();
 return !!host&&(o===`https://${host}`||o===`http://${host}`);
}
const uploadMode=()=>process.env.BLOB_READ_WRITE_TOKEN?'blob':'database';
const MAX_DB_FILE=4*1024*1024;
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const audit=async(actorId:string|undefined,action:string,resourceId?:string,detail='')=>{await db.auditLog.create({data:{actorId,action,resourceId,detail}});};
function fail(res:Response,status:number,message:string){return res.status(status).json({error:{message}});}
app.use('/api/v1',async(req,res,next)=>{
 if(req.cookies.forest_session){const sess=await db.session.findUnique({where:{id:hash(req.cookies.forest_session)},include:{user:true}});if(sess&&sess.expiresAt>new Date()&&sess.user.active){req.user=sess.user;req.sessionId=sess.id;}}
 if(!['GET','HEAD','OPTIONS'].includes(req.method)){
  if(!isAllowedOrigin(req))return fail(res,403,'Unrecognized request origin.');
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
const sameSecret=(a:string,b:string)=>timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest());
async function envAdminLogin(email:string,password:string){
 const envEmail=process.env.ADMIN_EMAIL?.trim().toLowerCase(),envPassword=process.env.ADMIN_PASSWORD;
 if(!envEmail||!envPassword||envPassword.length<8||email!==envEmail||!sameSecret(password,envPassword))return null;
 const existing=await db.user.findUnique({where:{email}});
 if(existing&&existing.active&&existing.role==='Super Admin'&&await bcrypt.compare(password,existing.passwordHash))return existing;
 const passwordHash=await bcrypt.hash(password,12);
 return db.user.upsert({where:{email},update:{passwordHash,role:'Super Admin',active:true},create:{email,name:'Administrator',role:'Super Admin',passwordHash}});
}
const authLimit=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:true,legacyHeaders:false,message:{error:{message:'Too many attempts. Please try again later.'}}});
app.get('/api/v1/health',async(_req,res)=>{await db.$queryRaw`SELECT 1`;res.json({ok:true});});
app.post('/api/v1/auth/login',authLimit,async(req,res)=>{
 const {email,password}=z.object({email:z.string().email().max(254),password:z.string().max(200)}).parse(req.body);
 const normalized=email.toLowerCase();
 const envUser=await envAdminLogin(normalized,password);
 const user=envUser||await db.user.findUnique({where:{email:normalized}});
 const valid=envUser?true:await bcrypt.compare(password,user?.passwordHash||'$2b$12$GvMSjBEc7wfAhoF2T3dx6uB67ZJAbQ5p0nCgA7SUH3l10zXk.q3fa');
 if(!user||!valid||!user.active){await audit(undefined,'login.failed');return fail(res,401,'Email or password is incorrect.');}
 const token=randomBytes(32).toString('hex'),csrf=randomBytes(32).toString('hex');
 await db.session.create({data:{id:hash(token),userId:user.id,csrf,expiresAt:new Date(Date.now()+8*3600000)}});
 res.cookie('forest_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',maxAge:8*3600000,path:'/'});
 await audit(user.id,'login');res.json({user:{id:user.id,name:user.name,role:user.role,email:user.email},csrf,uploads:uploadMode()});
});
app.get('/api/v1/auth/me',auth,async(req,res)=>{const s=await db.session.findUnique({where:{id:req.sessionId}});res.json({user:{id:req.user!.id,name:req.user!.name,role:req.user!.role,email:req.user!.email},csrf:s!.csrf,uploads:uploadMode()});});
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
 });
 try{await processNotifications();}catch{console.error('Notification delivery failed; it will be retried.');}
 res.status(201).json({id:lead.id,message:'Your inquiry has been received.'});
});
app.post('/api/v1/brochure-requests',rateLimit({windowMs:3600000,limit:20,standardHeaders:true,legacyHeaders:false,message:{error:{message:'Too many requests. Please try again later.'}}}),async(req,res)=>{
 const input=z.object({villa:z.string().min(1).max(120),name:z.string().trim().min(2,'Please enter your name.').max(120),mobile:z.string().trim().regex(/^\+?[\d\s()-]{8,20}$/,'Enter a valid mobile number.'),source:z.string().max(300).optional()}).parse(req.body);
 const villa=await db.content.findFirst({where:{kind:'villas',slug:input.villa,OR:[{status:'Published'},{status:'Scheduled',publishAt:{lte:new Date()}}]}});
 if(!villa)return fail(res,404,'This villa is not available.');
 const brochureUrl=brochureFor(villa.slug,villa.data);
 const note=`Brochure requested for ${villa.title}.${brochureUrl?'':' No brochure is uploaded yet; please send it manually.'}`;
 const recent=await db.lead.findFirst({where:{mobile:input.mobile,villa:villa.title,createdAt:{gte:new Date(Date.now()-3600000)}}});
 if(!recent){
  await db.$transaction(async tx=>{
   const l=await tx.lead.create({data:{submissionKey:randomUUID(),fullName:input.name,mobile:input.mobile,email:'',interest:'Villa Ownership',villa:villa.title,contactMethod:'Phone',message:note,source:input.source?.slice(0,300)||'/villas-ownership',consentAt:new Date(),activities:{create:{kind:'Brochure',text:note}}}});
   await tx.notification.create({data:{leadId:l.id,recipient:process.env.SALES_NOTIFICATION_EMAIL||'',subject:`Brochure request: ${villa.title}`,body:`${input.name} (${input.mobile}) requested the ${villa.title} brochure. Details: ${origin()}/admin`,status:process.env.SMTP_HOST&&process.env.SALES_NOTIFICATION_EMAIL?'Pending':'Unconfigured'}});
  });
  try{await processNotifications();}catch{console.error('Notification delivery failed; it will be retried.');}
 }
 res.json({brochureUrl,villa:villa.title});
});
function leadWhere(req:Request):Prisma.LeadWhereInput{
 const q=typeof req.query.q==='string'?req.query.q.slice(0,200):'';
 return {...(req.user!.role==='Sales Executive'?{assignedTo:req.user!.id}:req.query.assignedTo?{assignedTo:String(req.query.assignedTo)}:{}),...(req.query.status?{status:String(req.query.status)}:{}),...(req.query.interest?{interest:String(req.query.interest)}:{}),...(req.query.source?{source:{contains:String(req.query.source)}}:{}),...(req.query.from||req.query.to?{createdAt:{...(req.query.from?{gte:z.coerce.date().parse(req.query.from)}:{}),...(req.query.to?{lte:z.coerce.date().parse(req.query.to)}:{})}}:{}),...(q?{OR:['fullName','email','mobile','id'].map(k=>({[k]:{contains:q}}))}:{})};
}
const pagination=(req:Request)=>({page:Math.max(1,Number(req.query.page)||1),limit:Math.min(100,Math.max(1,Number(req.query.limit)||20))});
app.get('/api/v1/admin/leads',leadRead,async(req,res)=>{const {page,limit}=pagination(req),where=leadWhere(req);const [items,total]=await Promise.all([db.lead.findMany({where,include:{assignee:{select:{name:true}}},orderBy:req.query.sort==='priority'?{priority:'asc'}:{createdAt:'desc'},skip:(page-1)*limit,take:limit}),db.lead.count({where})]);res.json({items,total,page,limit});});
app.get('/api/v1/admin/leads/export',permit('Sales Manager'),async(req,res)=>{
 const leads=await db.lead.findMany({where:leadWhere(req),include:{assignee:{select:{name:true}}},orderBy:{createdAt:'desc'},take:10000});
 const cols:[string,string,number][]=[['Received','createdAt',20],['Name','fullName',24],['Mobile','mobile',18],['Email','email',30],['Interest','interest',18],['Villa','villa',16],['Purpose','purpose',14],['Contact method','contactMethod',15],['Contact time','contactTime',14],['Status','status',20],['Priority','priority',10],['Assigned to','assignee',18],['Message','message',50],['Source','source',22],['Campaign','campaign',22],['Reference','id',28]];
 const value=(l:any,k:string)=>k==='assignee'?l.assignee?.name??'':k==='createdAt'?new Date(l.createdAt).toISOString().replace('T',' ').slice(0,16):l[k]??'';
 const format=req.query.format==='xlsx'?'xlsx':'csv',stamp=new Date().toISOString().slice(0,10);
 await audit(req.user!.id,'leads.export',undefined,`${leads.length} records (${format})`);
 if(format==='xlsx'){
  const {default:ExcelJS}=await import('exceljs');
  const book=new ExcelJS.Workbook();book.creator='Forest Eco Resort';book.created=new Date();
  const sheet=book.addWorksheet('Leads',{views:[{state:'frozen',ySplit:1}]});
  sheet.columns=cols.map(([header,key,width])=>({header,key,width}));
  // Every cell is written as text, so values such as "=cmd" are never evaluated as formulas.
  leads.forEach(l=>sheet.addRow(Object.fromEntries(cols.map(([,k])=>[k,String(value(l,k))]))));
  const head=sheet.getRow(1);head.font={bold:true,color:{argb:'FFFFFFFF'}};head.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF173A2C'}};head.height=22;
  sheet.autoFilter={from:{row:1,column:1},to:{row:1,column:cols.length}};
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');res.attachment(`forest-leads-${stamp}.xlsx`);
  return res.send(Buffer.from(await book.xlsx.writeBuffer()));
 }
 // Neutralise spreadsheet formulas, but leave phone numbers such as +8801… readable.
 const csv=(v:unknown)=>{const t=String(v??'');return '"'+(/^\+?\d[\d\s()-]*$/.test(t)?t:t.replace(/^[=+@\-\t\r]/,"'$&")).replace(/"/g,'""')+'"';};
 res.setHeader('Content-Type','text/csv; charset=utf-8');res.attachment(`forest-leads-${stamp}.csv`);
 res.send('\uFEFF'+[cols.map(([h])=>h).join(','),...leads.map(l=>cols.map(([,k])=>csv(value(l,k))).join(','))].join('\r\n'));
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
 const where:Prisma.ContentWhereInput={kind,OR:[{status:'Published'},{status:'Scheduled',publishAt:{lte:new Date()}}],...(req.query.slug?{slug:String(req.query.slug)}:{})};
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
app.delete('/api/v1/admin/content/:id',contentWrite,async(req,res)=>{
 const old=await db.content.findUnique({where:{id:String(req.params.id)}});if(!old)return fail(res,404,'Content not found.');
 if(old.kind==='masterplan'&&old.status==='Published')return fail(res,409,'Unpublish this phase before deleting it.');
 await db.content.delete({where:{id:old.id}});await audit(req.user!.id,'content.deleted',old.id,`${old.kind}/${old.slug}`);res.json({ok:true});
});
const mediaDir=()=>path.resolve(process.env.MEDIA_DIRECTORY||'./data/media');
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:MAX_DB_FILE,files:1}});
function detectMime(b:Buffer):string|null{
 if(b.subarray(0,5).toString()==='%PDF-')return 'application/pdf';
 if(b[0]===0xff&&b[1]===0xd8&&b[2]===0xff)return 'image/jpeg';
 if(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'image/png';
 if(b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP')return 'image/webp';
 if(b.subarray(4,8).toString()==='ftyp')return 'video/mp4';
 if(b.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3])))return 'video/webm';
 return null;
}
app.post('/api/v1/admin/media',contentWrite,upload.single('file'),async(req,res)=>{
 const file=req.file;if(!file)return fail(res,400,'Choose a file.');const b=file.buffer;
 const detected=detectMime(b);
 if(!detected)return fail(res,400,'Only JPEG, PNG, WebP, PDF, MP4 or WebM files are accepted.');
 const fields=z.object({alt:z.string().max(500).default('Uploaded media'),caption:z.string().max(1000).default(''),assetType:z.enum(['Photograph','Render','Concept image','Illustration','Document','Video']).default(detected.startsWith('video/')?'Video':'Photograph'),association:z.string().max(200).optional(),publish:z.union([z.literal('true'),z.literal('false'),z.boolean()]).optional()}).parse(req.body);
 const status=(fields.publish===true||fields.publish==='true')?'Published':'Draft';
 const {publish:_,...data}=fields;
 const item=await db.media.create({data:{storageKey:'db:'+randomBytes(24).toString('hex'),originalName:path.basename(file.originalname),mimeType:detected,size:file.size,status,...data,alt:data.alt||'Uploaded media',file:{create:{data:new Uint8Array(b)}}}});await audit(req.user!.id,'media.uploaded',item.id);res.status(201).json({...item,url:`/api/v1/media/${item.id}`});
});
app.get('/api/v1/admin/media',contentRead,async(req,res)=>{res.json({items:await db.media.findMany({where:{...(req.query.q?{alt:{contains:String(req.query.q)}}:{}),...(req.query.status?{status:String(req.query.status)}:{})},orderBy:{createdAt:'desc'},take:200})});});
app.post('/api/v1/admin/media/cloud',contentWrite,async(req,res)=>{
 const fields=z.object({url:z.string().url().max(2000).regex(REMOTE_MEDIA),name:z.string().max(500).default('upload'),alt:z.string().max(500).default('Uploaded media'),caption:z.string().max(1000).default(''),assetType:z.enum(['Photograph','Render','Concept image','Illustration','Document','Video']).default('Photograph'),size:z.number().int().min(0).default(0),mimeType:z.enum(['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/webm']),publish:z.boolean().optional()}).parse(req.body);
 const item=await db.media.create({data:{storageKey:fields.url,originalName:fields.name,mimeType:fields.mimeType,size:fields.size,alt:fields.alt||'Uploaded media',caption:fields.caption,assetType:fields.assetType,status:fields.publish?'Published':'Draft'}});await audit(req.user!.id,'media.cloud.uploaded',item.id);res.status(201).json({...item,url:item.storageKey});
});
app.patch('/api/v1/admin/media/:id',contentWrite,async(req,res)=>{const data=z.object({alt:z.string().min(1).max(500).optional(),caption:z.string().max(1000).optional(),status:z.enum(['Draft','Published','Archived']).optional(),assetType:z.enum(['Photograph','Render','Concept image','Illustration','Document','Video']).optional()}).strict().parse(req.body);const item=await db.media.update({where:{id:String(req.params.id)},data});await audit(req.user!.id,'media.updated',item.id);res.json(item);});
app.get('/api/v1/media/:id',async(req,res)=>{const item=await db.media.findUnique({where:{id:String(req.params.id)}});if(!item||item.status!=='Published'&&(!req.user||!['Super Admin','Content Administrator'].includes(req.user.role)))return fail(res,404,'File not found.');if(item.storageKey.startsWith('http'))return res.redirect(302,item.storageKey);if(item.mimeType==='application/pdf')res.attachment(item.originalName);if(item.status==='Published')res.setHeader('Cache-Control','public, max-age=3600, s-maxage=86400');await sendStoredFile(res,item);});
async function sendStoredFile(res:Response,item:{id:string;storageKey:string;mimeType:string}){
 res.type(item.mimeType);
 const stored=await db.mediaFile.findUnique({where:{mediaId:item.id}});
 if(stored)return res.send(Buffer.from(stored.data));
 res.sendFile(path.join(mediaDir(),item.storageKey),err=>{if(err&&!res.headersSent)fail(res,404,'File not found.');});
}
app.get('/api/v1/brochures/:id/download',async(req,res)=>{const c=await db.content.findFirst({where:{id:String(req.params.id),kind:'brochures',status:'Published'}});if(!c)return fail(res,404,'Document unavailable.');const d=c.data as any;if(d.private)return fail(res,404,'Document unavailable.');if(d.expiresAt&&new Date(d.expiresAt)<new Date())return fail(res,410,'This document has expired.');const media=await db.media.findFirst({where:{id:d.mediaId||'',status:'Published',mimeType:'application/pdf'}});if(!media)return fail(res,404,'Approved document file unavailable.');await db.event.create({data:{name:'brochure.downloaded',resource:c.id}});if(media.storageKey.startsWith('http'))return res.redirect(302,media.storageKey);res.attachment(media.originalName);await sendStoredFile(res,media);});
app.get('/api/v1/admin/staff',leadRead,async(_req,res)=>res.json({items:await db.user.findMany({where:{active:true,role:{in:['Super Admin','Sales Manager','Sales Executive']}},select:{id:true,name:true,role:true}})}));
app.get('/api/v1/admin/users',permit(),async(_req,res)=>res.json({items:await db.user.findMany({select:{id:true,email:true,name:true,role:true,active:true,createdAt:true}})}));
app.post('/api/v1/admin/users',permit(),async(req,res)=>{const input=z.object({email:z.string().email().max(254),name:z.string().min(1).max(120),password:z.string().min(14).max(200),role:z.enum(roles)}).parse(req.body);const {password,...data}=input;const u=await db.user.create({data:{...data,email:data.email.toLowerCase(),passwordHash:await bcrypt.hash(password,12)}});await audit(req.user!.id,'user.created',u.id);res.status(201).json({id:u.id});});
app.patch('/api/v1/admin/users/:id',permit(),async(req,res)=>{const data=z.object({role:z.enum(roles).optional(),active:z.boolean().optional()}).strict().parse(req.body);if(req.user!.id===req.params.id)return fail(res,400,'You cannot change your own access.');const u=await db.user.update({where:{id:String(req.params.id)},data});await db.session.deleteMany({where:{userId:u.id}});await audit(req.user!.id,'user.updated',u.id);res.json({id:u.id});});
app.get('/api/v1/admin/audit',permit('Analyst / Viewer'),async(_req,res)=>res.json({items:await db.auditLog.findMany({orderBy:{createdAt:'desc'},take:100})}));
app.get('/api/v1/admin/notifications',permit('Sales Manager'),async(_req,res)=>res.json({configured:!!(process.env.SMTP_HOST&&process.env.SMTP_FROM&&process.env.SALES_NOTIFICATION_EMAIL),whatsapp:false,items:await db.notification.findMany({select:{id:true,leadId:true,status:true,attempts:true,lastError:true,createdAt:true},orderBy:{createdAt:'desc'},take:100})}));
app.post('/api/v1/admin/notifications/:id/retry',permit('Sales Manager'),async(req,res)=>{if(!process.env.SMTP_HOST||!process.env.SALES_NOTIFICATION_EMAIL)return fail(res,503,'Configure the email provider first.');await db.notification.update({where:{id:String(req.params.id)},data:{status:'Pending',attempts:0,nextAttemptAt:new Date(),recipient:process.env.SALES_NOTIFICATION_EMAIL}});await audit(req.user!.id,'notification.retry',String(req.params.id));res.json({ok:true});});
app.post('/api/v1/events',rateLimit({windowMs:60000,limit:30}),async(req,res)=>{const data=z.object({name:z.enum(['inquiry.opened','inquiry.submitted','villa.viewed','phase.viewed','phone.clicked','email.clicked','contact.clicked']),resource:z.string().regex(/^[a-z0-9\-/]{0,120}$/).optional(),consent:z.literal(true)}).parse(req.body);await db.event.create({data:{name:data.name,resource:data.resource}});res.status(204).end();});
app.use('/api',(_req,res)=>fail(res,404,'Endpoint not found.'));
app.use((err:any,_req:Request,res:Response,_next:NextFunction)=>{if(err instanceof ZodError)return res.status(422).json({error:{message:'Please check the highlighted fields.',fields:err.flatten().fieldErrors}});if(err.code==='P2002')return fail(res,409,'This record already exists.');if(err.code==='P2025')return fail(res,404,'Record not found.');if(err instanceof multer.MulterError)return fail(res,400,err.code==='LIMIT_FILE_SIZE'?'Files over 4 MB need Vercel Blob storage. Connect a Blob store, or upload a smaller file.':'File exceeds the upload limits.');if(err.message==='INVALID_RESET')return fail(res,400,'Reset link is invalid or expired.');if(['SCHEDULE_REQUIRED','PRIVATE_SETTINGS','CONTENT_TOO_LARGE','PHASE_NARRATIVE_REQUIRED'].includes(err.message))return fail(res,422,err.message.replaceAll('_',' ').toLowerCase());console.error('Request failed:',err.name,err.code||'');return fail(res,500,'Something went wrong. Your input has been preserved; please retry.');});
export default app;
