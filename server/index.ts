import 'dotenv/config';
import app from './app';
import {db} from './db';
import {processNotifications} from './notifications';
const port=Number(process.env.API_PORT||4000);
const host='0.0.0.0';
const server=app.listen(port,host,()=>console.log(`Forest API http://${host}:${port}`));
const timer=setInterval(async()=>{try{await processNotifications();await db.content.updateMany({where:{status:'Scheduled',publishAt:{lte:new Date()}},data:{status:'Published'}});await db.session.deleteMany({where:{expiresAt:{lt:new Date()}}});}catch{console.error('Background job failed; will retry.');}},30000);
process.on('SIGTERM',()=>{clearInterval(timer);server.close(()=>db.$disconnect());});
// reload 1792421191
