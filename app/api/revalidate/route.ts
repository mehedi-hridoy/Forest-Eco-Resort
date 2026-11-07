import {revalidatePath} from 'next/cache';
import {createHash} from 'node:crypto';
import {db} from '@/server/db';

export const dynamic='force-dynamic';

// Called by the admin after content is saved, so cached pages show the change immediately
// instead of after the regular one-minute refresh. Only signed-in content editors can trigger it.
async function canRevalidate(request:Request){
 const cookie=request.headers.get('cookie')||'';
 const token=cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('forest_session='))?.slice('forest_session='.length);
 if(!token)return false;
 const session=await db.session.findUnique({where:{id:createHash('sha256').update(decodeURIComponent(token)).digest('hex')},include:{user:true}});
 if(!session||session.expiresAt<new Date()||!session.user.active)return false;
 if(request.headers.get('x-csrf-token')!==session.csrf)return false;
 return ['Super Admin','Content Administrator'].includes(session.user.role);
}

export async function POST(request:Request){
 if(!(await canRevalidate(request)))return Response.json({error:'Unauthorized'},{status:401});
 revalidatePath('/','layout');
 return Response.json({ok:true});
}
