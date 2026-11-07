'use client';
import {useEffect,useRef,useState} from 'react';
import {X} from 'lucide-react';
import Img from '@/components/Img';

export default function PopupBanner({id,image,version}:{id:string;image:string;version:string}){
 const [open,setOpen]=useState(false);
 const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  // sessionStorage is per tab: the banner shows once per newly opened tab, never again on in-tab navigation, scroll or reload.
  const key=`forest-popup:${id}:${version}`;
  try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1');}catch{}
  // Open once the page has finished loading, so the banner never competes with the hero image.
  let timer:ReturnType<typeof setTimeout>|undefined;
  const start=()=>{timer=setTimeout(()=>setOpen(true),1500)};
  if(document.readyState==='complete')start();else window.addEventListener('load',start,{once:true});
  return()=>{window.removeEventListener('load',start);if(timer)clearTimeout(timer)};
 },[id,version]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  closeRef.current?.focus();
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
  window.addEventListener('keydown',onKey);
  return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKey)};
 },[open]);
 if(!open)return null;
 return <div className="popup-banner" role="dialog" aria-modal="true" aria-label="Announcement" onClick={()=>setOpen(false)}>
  <div className="popup-banner-frame" onClick={e=>e.stopPropagation()}>
   <button ref={closeRef} className="popup-banner-close" onClick={()=>setOpen(false)} aria-label="Close announcement"><X size={20}/></button>
   <Img src={image} sizes="(max-width: 940px) 92vw, 860px" alt="Forest Eco Resort announcement"/>
  </div>
 </div>;
}
