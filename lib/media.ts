// Widths generated for images uploaded through the admin (see app/media-img/[id]/route.ts).
export const MEDIA_WIDTHS=[640,828,1080,1280,1600,1920] as const;
const DB_MEDIA=/^\/api\/v1\/media\/([A-Za-z0-9]+)$/;
export const dbMediaId=(src:string)=>src.match(DB_MEDIA)?.[1]??null;
export const mediaImg=(id:string,w:number)=>`/media-img/${id}?w=${w}`;
