import type {Prisma} from '@prisma/client';
import {db} from '@/server/db';
export type Entry={id:string;kind:string;slug:string;title:string;sortOrder:number;data:Record<string,any>;createdAt:Date;updatedAt:Date};
export const liveWhere=():Prisma.ContentWhereInput=>({OR:[{status:'Published'},{status:'Scheduled',publishAt:{lte:new Date()}}]});
export async function content(kind:string):Promise<Entry[]>{return await db.content.findMany({where:{kind,...liveWhere()},orderBy:[{sortOrder:'asc'},{createdAt:'desc'}]}) as unknown as Entry[];}
export async function entry(kind:string,slug:string){return (await content(kind)).find(i=>i.slug===slug);}
