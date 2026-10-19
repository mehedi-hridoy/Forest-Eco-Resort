'use client';
import {useState,useRef,useEffect} from 'react';
import {ArrowUpRight,Check,ChevronDown,Loader2} from 'lucide-react';
import {leadSchema} from '@/lib/validation';
import {uid} from '@/lib/uid';

const INTERESTS=['Villa Ownership','Investment','Resort Stay','Project Information'];
const VILLAS=['Private Villa','Duplex Villa','Single Villa'];
const MAX_MESSAGE=4000;

export default function InquiryForm({defaultInterest='Project Information'}:{defaultInterest?:string}){
 const [interest,setInterest]=useState(defaultInterest),[villa,setVilla]=useState(VILLAS[0]),[messageLength,setMessageLength]=useState(0);
 const [busy,setBusy]=useState(false),[result,setResult]=useState<{id:string;name:string}|null>(null),[errors,setErrors]=useState<Record<string,string[]|undefined>>({}),[failure,setFailure]=useState('');
 const key=useRef(''),form=useRef<HTMLFormElement>(null),message=useRef<HTMLDivElement>(null);
 useEffect(()=>{key.current=uid();const q=new URLSearchParams(window.location.search);const i=q.get('interest'),v=q.get('villa');if(i&&INTERESTS.includes(i))setInterest(i);if(v&&VILLAS.includes(v))setVilla(v)},[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();if(busy)return;setFailure('');
  const values=Object.fromEntries(new FormData(e.currentTarget));
  const data={...values,consent:values.consent==='on',source:window.location.pathname,campaign:['utm_source','utm_medium','utm_campaign'].map(k=>new URLSearchParams(location.search).get(k)||'').join(' / '),submissionKey:key.current};
  const parsed=leadSchema.safeParse(data);
  if(!parsed.success){const fields=parsed.error.flatten().fieldErrors;setErrors(fields);const first=Object.keys(fields)[0];form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();return;}
  setErrors({});setBusy(true);
  try{
   const res=await fetch('/api/v1/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsed.data)});
   const j=await res.json();
   if(!res.ok){setErrors(j.error?.fields||{});throw new Error(j.error?.message||'Could not send your inquiry. Please try again.');}
   setResult({id:j.id,name:parsed.data.fullName.split(' ')[0]});setTimeout(()=>message.current?.focus(),0);
  }catch(e){setFailure((e as Error).message)}finally{setBusy(false)}
 }
 const clear=(name:string)=>errors[name]&&setErrors(x=>({...x,[name]:undefined}));
 const error=(name:string)=>errors[name]&&<span className="field-error" id={`${name}-error`}>{errors[name]![0]}</span>;
 const field=(name:string,label:string,type='text',required=false,auto?:string)=><label className={`iq-field ${errors[name]?'has-error':''}`}>
  <span>{label}{required?' *':''}</span>
  <input name={name} type={type} required={required} autoComplete={auto} maxLength={254} aria-invalid={!!errors[name]} aria-describedby={errors[name]?`${name}-error`:undefined} onInput={()=>clear(name)}/>
  {error(name)}
 </label>;
 const select=(name:string,label:string,options:string[],value?:string,onChange?:(v:string)=>void)=><label className="iq-field iq-select">
  <span>{label}</span>
  <span className="iq-select-box"><select name={name} {...(onChange?{value,onChange:e=>onChange(e.target.value)}:{})}>{options.map(o=><option key={o}>{o}</option>)}</select><ChevronDown size={16}/></span>
 </label>;
 if(result)return <div className="iq-success" tabIndex={-1} ref={message} role="status">
  <span className="iq-success-mark"><Check size={30} strokeWidth={1.6}/></span>
  <p className="eyebrow">INQUIRY RECEIVED</p>
  <h3>Thank you, <em>{result.name}.</em></h3>
  <p>Your inquiry has been received and saved. Our team will review your request and get back to you.</p>
  <small>Reference · {result.id}</small>
  <a href="/" className="iq-back">Return to Forest <ArrowUpRight size={16}/></a>
 </div>;
 return <form className="iq-form" ref={form} onSubmit={submit} noValidate>
  <div className="iq-grid">
   {field('fullName','Full name','text',true,'name')}
   {field('mobile','Mobile number','tel',true,'tel')}
   {field('email','Email address','email',true,'email')}
   {select('interest','Area of interest',INTERESTS,interest,setInterest)}
   {['Villa Ownership','Investment'].includes(interest)&&<>
    <div className="iq-reveal">{select('villa','Preferred villa / unit',VILLAS,villa,setVilla)}</div>
    <div className="iq-reveal">{select('purpose','Purpose of interest',['Personal Use','Investment','Vacation'])}</div>
   </>}
   {select('contactMethod','Preferred contact method',['Phone','WhatsApp','Email'])}
   {field('contactTime','Preferred contact time')}
  </div>
  <label className={`iq-field ${errors.message?'has-error':''}`}>
   <span>Message / specific requirement</span>
   <textarea name="message" rows={4} maxLength={MAX_MESSAGE} onInput={e=>{setMessageLength(e.currentTarget.value.length);clear('message')}}/>
   <small className="iq-count">{messageLength} / {MAX_MESSAGE}</small>
   {error('message')}
  </label>
  <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
  <label className={`iq-consent ${errors.consent?'has-error':''}`}>
   <input type="checkbox" name="consent" onChange={()=>clear('consent')}/><i><Check size={13} strokeWidth={2.5}/></i>
   <span>I agree to the <a href="/privacy">privacy notice</a> and consent to being contacted about this inquiry.</span>
  </label>
  {errors.consent&&<p className="field-error">Please consent to the privacy notice before submitting.</p>}
  {failure&&<p role="alert" className="field-error iq-failure">{failure}</p>}
  <button className="iq-submit" type="submit" disabled={busy}>
   <span>{busy?'Sending your inquiry…':'Start a conversation'}</span>
   <i>{busy?<Loader2 size={18} className="iq-spin"/>:<ArrowUpRight size={18}/>}</i>
  </button>
  <small className="iq-note">We use your details to respond to your inquiry. No online booking or purchase takes place through this form.</small>
 </form>;
}
