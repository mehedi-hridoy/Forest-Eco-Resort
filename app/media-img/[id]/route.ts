import sharp from 'sharp';
import {db} from '@/server/db';
import {MEDIA_WIDTHS} from '@/lib/media';

// Resized WebP copies of images uploaded through the admin (stored in the database).
// Each size is generated once and then cached by the browser and Vercel's CDN for a year,
// so visitors never wait on the database for these images.
export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const asked=Number(new URL(request.url).searchParams.get('w'))||1280;
 const width=MEDIA_WIDTHS.find(w=>w>=asked)??MEDIA_WIDTHS[MEDIA_WIDTHS.length-1];
 const item=await db.media.findUnique({where:{id}});
 if(!item||item.status!=='Published'||!item.mimeType.startsWith('image/'))return new Response('Not found',{status:404});
 // Files kept outside the database (Blob storage, disk) are served by the regular media route.
 if(!item.storageKey.startsWith('db:'))return Response.redirect(new URL(`/api/v1/media/${id}`,request.url),302);
 const stored=await db.mediaFile.findUnique({where:{mediaId:id}});
 if(!stored)return new Response('Not found',{status:404});
 const out=await sharp(Buffer.from(stored.data)).rotate().resize({width,withoutEnlargement:true}).webp({quality:72}).toBuffer();
 return new Response(new Uint8Array(out),{headers:{'Content-Type':'image/webp','Cache-Control':'public, max-age=31536000, immutable','Content-Length':String(out.length)}});
}
