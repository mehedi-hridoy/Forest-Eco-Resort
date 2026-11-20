'use client';
import {useEffect,useRef,useState} from 'react';
import {X} from 'lucide-react';
import Img from '@/components/Img';

// Short pause after the page appears, so the hero is seen first and the banner doesn't feel abrupt.
const MIN_DELAY_MS=900;
const SIZES='(max-width: 940px) 92vw, 860px';

export default function PopupBanner({id,image,version}:{id:string;image:string;version:string}){
 const [pending,setPending]=useState(false); // banner is due this tab: its image is downloading
 const [open,setOpen]=useState(false);
 const [imageReady,setImageReady]=useState(false);
 const [delayDone,setDelayDone]=useState(false);
 const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  // sessionStorage is per tab: the banner shows once per newly opened tab, never again on in-tab navigation, scroll or reload.
  const key=`forest-popup:${id}:${version}`;
  try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1');}catch{}
  // Start downloading the banner image right away (not after the whole page has loaded),
  // and open as soon as it is ready and the short delay has passed, so it appears complete.
  setPending(true);
  const timer=setTimeout(()=>setDelayDone(true),MIN_DELAY_MS);
  return()=>clearTimeout(timer);
 },[id,version]);
 useEffect(()=>{if(pending&&imageReady&&delayDone){setOpen(true);setPending(false);}},[pending,imageReady,delayDone]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  closeRef.current?.focus();
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
  window.addEventListener('keydown',onKey);
  return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKey)};
 },[open]);
 // Hidden preload with the same srcset/sizes as the banner, so the visible image comes from the browser cache instantly.
 if(pending)return <Img src={image} sizes={SIZES} alt="" aria-hidden="true" className="popup-banner-preload" onLoad={()=>setImageReady(true)} onError={()=>setPending(false)}/>;
 if(!open)return null;
 return <div className="popup-banner" role="dialog" aria-modal="true" aria-label="Announcement" onClick={()=>setOpen(false)}>
  <div className="popup-banner-frame" onClick={e=>e.stopPropagation()}>
   <button ref={closeRef} className="popup-banner-close" onClick={()=>setOpen(false)} aria-label="Close announcement"><X size={20}/></button>
   <Img src={image} sizes={SIZES} alt="Forest Eco Resort announcement"/>
  </div>
 </div>;
}
