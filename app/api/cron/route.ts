import {db} from '@/server/db';
import {processNotifications} from '@/server/notifications';

export const dynamic='force-dynamic';

export async function GET(request:Request){
 const secret=process.env.CRON_SECRET;
 if(!secret||request.headers.get('authorization')!==`Bearer ${secret}`)return Response.json({error:'Unauthorized'},{status:401});
 const now=new Date();
 const [published,sessions]=await Promise.all([
  db.content.updateMany({where:{status:'Scheduled',publishAt:{lte:now}},data:{status:'Published'}}),
  db.session.deleteMany({where:{expiresAt:{lt:now}}}),
 ]);
 await processNotifications();
 return Response.json({ok:true,published:published.count,expiredSessions:sessions.count});
}
