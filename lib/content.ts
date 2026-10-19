import {PrismaClient} from '@prisma/client';
const globalDb=globalThis as unknown as {forestDb?:PrismaClient};
export const db=globalDb.forestDb||new PrismaClient();
if(process.env.NODE_ENV!=='production')globalDb.forestDb=db;
export type Entry={id:string;kind:string;slug:string;title:string;sortOrder:number;data:Record<string,any>;createdAt:Date;updatedAt:Date};
export async function content(kind:string):Promise<Entry[]>{return await db.content.findMany({where:{kind,status:'Published'},orderBy:[{sortOrder:'asc'},{createdAt:'desc'}]}) as unknown as Entry[];}
export async function entry(kind:string,slug:string){return (await content(kind)).find(i=>i.slug===slug);}
