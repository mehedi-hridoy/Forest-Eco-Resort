import {handleUpload,type HandleUploadBody} from '@vercel/blob/client';
import {createHash} from 'node:crypto';
import {db} from '@/server/db';

export const dynamic='force-dynamic';

const ALLOWED_TYPES=['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/webm'];
const MAX_BYTES=200*1024*1024;

async function canUpload(request:Request){
 const cookie=request.headers.get('cookie')||'';
 const token=cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('forest_session='))?.slice('forest_session='.length);
 if(!token)return false;
 const session=await db.session.findUnique({where:{id:createHash('sha256').update(decodeURIComponent(token)).digest('hex')},include:{user:true}});
 if(!session||session.expiresAt<new Date()||!session.user.active)return false;
 if(request.headers.get('x-csrf-token')!==session.csrf)return false;
 return ['Super Admin','Content Administrator'].includes(session.user.role);
}

export async function POST(request:Request){
 if(!process.env.BLOB_READ_WRITE_TOKEN)return Response.json({error:'Blob storage is not configured.'},{status:501});
 const body=(await request.json()) as HandleUploadBody;
 if(body.type==='blob.generate-client-token'&&!(await canUpload(request)))return Response.json({error:'Unauthorized'},{status:401});
 try{
  const result=await handleUpload({
   body,request,
   onBeforeGenerateToken:async()=>({allowedContentTypes:ALLOWED_TYPES,maximumSizeInBytes:MAX_BYTES,addRandomSuffix:true}),
  });
  return Response.json(result);
 }catch(error){
  return Response.json({error:(error as Error).message},{status:400});
 }
}
