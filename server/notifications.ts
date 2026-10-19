import nodemailer from 'nodemailer';
import { db } from './db';
let processing=false;
export async function processNotifications(){
 if(processing || !process.env.SMTP_HOST || !process.env.SMTP_FROM)return;
 processing=true;
 try {
 const mail=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_PORT==='465',auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}:undefined});
 const jobs=await db.notification.findMany({where:{status:{in:['Pending','Retry']},nextAttemptAt:{lte:new Date()}},take:20});
 for(const job of jobs){try{await mail.sendMail({from:process.env.SMTP_FROM,to:job.recipient,subject:job.subject,text:job.body});await db.notification.update({where:{id:job.id},data:{status:'Sent',attempts:{increment:1},lastError:null}});}catch{await db.notification.update({where:{id:job.id},data:{status:job.attempts>=4?'Failed':'Retry',attempts:{increment:1},lastError:'Provider delivery failed; inspect provider logs.',nextAttemptAt:new Date(Date.now()+Math.min(3600000,60000*2**job.attempts))}});}}
 } finally{processing=false;}
}
