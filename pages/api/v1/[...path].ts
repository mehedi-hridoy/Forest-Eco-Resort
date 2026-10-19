import type {NextApiRequest,NextApiResponse} from 'next';
import app from '@/server/app';

export const config={api:{bodyParser:false,externalResolver:true,responseLimit:false}};

// Next attaches its own res.status/json/send/redirect helpers; remove them so Express's own response methods run unchanged.
const NEXT_RES_HELPERS=['status','send','json','redirect','setDraftMode','setPreviewData','clearPreviewData','revalidate'];

export default function handler(req:NextApiRequest,res:NextApiResponse){
 for(const key of NEXT_RES_HELPERS)delete (res as any)[key];
 return new Promise<void>(resolve=>{
  res.once('finish',()=>resolve());
  res.once('close',()=>resolve());
  app(req as any,res as any);
 });
}
