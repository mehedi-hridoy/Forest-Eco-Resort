'use client';
import {useEffect,useRef,useState} from 'react';
import {X} from 'lucide-react';

export default function PopupBanner({id,image,version}:{id:string;image:string;version:string}){
 const [open,setOpen]=useState(false);
 const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  // sessionStorage is per tab: the banner shows once per newly opened tab, never again on in-tab navigation, scroll or reload.
  const key=`forest-popup:${id}:${version}`;
  try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,'1');}catch{}
  const timer=setTimeout(()=>setOpen(true),700);
  return()=>clearTimeout(timer);
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
   <img src={image} alt="Forest Eco Resort announcement"/>
  </div>
 </div>;
}
