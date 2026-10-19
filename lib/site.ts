export function siteUrl(){
 const explicit=process.env.NEXT_PUBLIC_SITE_URL;
 const vercel=process.env.VERCEL_PROJECT_PRODUCTION_URL;
 return (explicit||(vercel?`https://${vercel}`:'http://127.0.0.1:3000')).replace(/\/$/,'');
}
export const WHATSAPP_NUMBER='8801897660045';
