import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main(){const email=process.env.ADMIN_EMAIL?.toLowerCase(),password=process.env.ADMIN_PASSWORD;if(!email||!password||password.length<14)throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 14 characters) in the environment.');await db.user.create({data:{email,name:'Administrator',passwordHash:await bcrypt.hash(password,12),role:'Super Admin'}});console.log('Administrator provisioned. Remove provisioning variables from your environment.');}
main().finally(()=>db.$disconnect());
