import {getImageProps} from 'next/image';
import type {ImgHTMLAttributes} from 'react';
import {MEDIA_WIDTHS,dbMediaId,mediaImg} from '@/lib/media';

type Props=Omit<ImgHTMLAttributes<HTMLImageElement>,'src'|'srcSet'>&{src?:string|null;sizes?:string};

// Drop-in replacement for <img>: same element and CSS, but the browser gets a responsive WebP srcset
// from the Next.js image optimizer, so phones no longer download desktop-sized files.
// Sizing still comes from the page CSS; the width/height below only feed the optimizer.
const OPTIMIZABLE=/^(\/(?!\/)|https:\/\/([a-z0-9-]+\.)*public\.blob\.vercel-storage\.com\/)/i;

export default function Img({src,sizes='100vw',alt='',...rest}:Props){
 if(src){const id=dbMediaId(src);if(id)return <img src={mediaImg(id,1280)} srcSet={MEDIA_WIDTHS.map(w=>`${mediaImg(id,w)} ${w}w`).join(', ')} sizes={sizes} alt={alt} decoding="async" {...rest}/>;}
 if(!src||!OPTIMIZABLE.test(src)||/\.(svg|gif)(\?|$)/i.test(src))return <img src={src||undefined} alt={alt} {...rest}/>;
 const {props}=getImageProps({src,alt,width:2400,height:1600,sizes});
 const {width:_w,height:_h,style:_s,loading:_l,fetchPriority:_f,decoding,...img}=props as typeof props&{fetchPriority?:string};
 return <img {...img} decoding={decoding} alt={alt} {...rest}/>;
}
