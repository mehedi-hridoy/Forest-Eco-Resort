'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Download,X,Check,FileText} from 'lucide-react';

type Done={name:string;mobile:string;url:string|null};

export default function BrochureButton({villa,title,available,variant='dark'}:{villa:string;title:string;available:boolean;variant?:'dark'|'light'}){
 const [open,setOpen]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [done,setDone]=useState<Done|null>(null);
 const firstField=useRef<HTMLInputElement>(null);
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
  window.addEventListener('keydown',onKey);
  setTimeout(()=>firstField.current?.focus(),60);
  return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKey)};
 },[open]);
 const close=()=>{setOpen(false);setTimeout(()=>{setDone(null);setError('')},300)};
 const submit=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();setError('');setBusy(true);
  const form=new FormData(e.currentTarget);const name=String(form.get('name')||'').trim(),mobile=String(form.get('mobile')||'').trim();
  try{
   const res=await fetch('/api/v1/brochure-requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({villa,name,mobile,source:location.pathname})});
   const data=await res.json();
   if(!res.ok){const field=data.error?.fields;throw new Error((field&&(field.name?.[0]||field.mobile?.[0]))||data.error?.message||'Something went wrong. Please try again.');}
   setDone({name,mobile,url:data.brochureUrl});
   if(data.brochureUrl){const a=document.createElement('a');a.href=data.brochureUrl;a.download='';a.rel='noopener';if(!data.brochureUrl.startsWith('/'))a.target='_blank';document.body.appendChild(a);a.click();a.remove();}
  }catch(err){setError((err as Error).message)}finally{setBusy(false)}
 };
 return <>
  <button type="button" className={`brochure-btn brochure-btn-${variant}`} onClick={()=>setOpen(true)}>
   {available?<Download size={16} strokeWidth={1.6}/>:<FileText size={16} strokeWidth={1.6}/>}
   {available?'Download brochure':'Request brochure'}
  </button>
  {open&&createPortal(<div className="brochure-modal" role="dialog" aria-modal="true" aria-label={`${title} brochure`} onClick={close}>
   <div className="brochure-card" onClick={e=>e.stopPropagation()}>
    <button className="brochure-close" onClick={close} aria-label="Close"><X size={18}/></button>
    {!done?<form onSubmit={submit}>
     <p className="brochure-eyebrow">{title}</p>
     <h3>{available?<>Your brochure,<br/><em>one step away.</em></>:<>Request the<br/><em>brochure.</em></>}</h3>
     <p className="brochure-note">{available?'Share your name and mobile number and the brochure will download instantly.':'The brochure for this villa is being finalised. Leave your details and our team will send it to you.'}</p>
     <label>Your name<input ref={firstField} name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Full name"/></label>
     <label>Mobile number<input name="mobile" required inputMode="tel" autoComplete="tel" pattern="\+?[\d\s()\-]{8,20}" placeholder="01XXXXXXXXX"/></label>
     {error&&<p className="brochure-error" role="alert">{error}</p>}
     <button className="brochure-submit" disabled={busy}>{busy?'Please wait…':available?<><Download size={16}/> Download brochure</>:'Send me the brochure'}</button>
     <small>By continuing you agree that our team may contact you about Forest Eco Resort.</small>
    </form>:<div className="brochure-done" role="status">
     <span className="brochure-check"><Check size={26} strokeWidth={1.6}/></span>
     <h3>Thank you, <em>{done.name.split(' ')[0]}.</em></h3>
     <p>{done.url?`Thank you for showing interest in ${title}. Your brochure is downloading now. Our team will get back to you on ${done.mobile} with more details.`:`Thank you for showing interest in ${title}. Our team will send you the brochure and get back to you on ${done.mobile} with more details.`}</p>
     {done.url&&<a className="brochure-submit" href={done.url} download target={done.url.startsWith('/')?undefined:'_blank'} rel="noopener"><Download size={16}/> Download again</a>}
     <button type="button" className="brochure-link" onClick={close}>Close</button>
    </div>}
   </div>
  </div>,document.body)}
 </>;
}
