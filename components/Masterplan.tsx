import Link from 'next/link';
import {ArrowUpRight,LandPlot,Ruler,Banknote,LayoutGrid} from 'lucide-react';
import type {Entry} from '@/lib/content';
import {isMediaUrl} from '@/lib/validation';
import {PhaseProgress} from '@/components/Explorers';
import {facilityIcon} from '@/components/facilityIcons';

const FALLBACK_IMAGES=['/images/masterplan/phase-1.jpg','/images/masterplan/phase-2.jpg','/images/masterplan/phase-3.jpg','/images/masterplan/phase-4.jpg'];
const ROMAN=['I','II','III','IV','V','VI','VII','VIII'];
const lakh=(sft:number)=>`${(sft/100000).toLocaleString('en-IN',{maximumFractionDigits:1})} lakh`;
const pad=(n:number)=>String(n).padStart(2,'0');

export default function Masterplan({phases}:{phases:Entry[]}){
 const image=(p:Entry,i:number)=>isMediaUrl(p.data.image)&&!/^\/images\/(forest|woods|cabin|architecture)\.jpg$/.test(p.data.image)?p.data.image:FALLBACK_IMAGES[i%FALLBACK_IMAGES.length];
 const totalLand=phases.reduce((s,p)=>s+(Number(p.data.landValue)||0),0);
 const totalArea=phases.reduce((s,p)=>s+(Number(p.data.areaValue)||0),0);
 return <>
  <section className="mp-overview">
   <div className="mp-overview-head">
    <p className="eyebrow">THE MASTERPLAN AT A GLANCE</p>
    <h2>Built in four phases.<br/><em>Each one adds a new layer.</em></h2>
   </div>
   <dl className="mp-totals">
    <div><dt>{pad(phases.length)}</dt><dd>Development phases</dd></div>
    {totalLand>0&&<div><dt>{totalLand}</dt><dd>Bigha of land, combined</dd></div>}
    {totalArea>0&&<div><dt>{lakh(totalArea)}</dt><dd>SFT planned development</dd></div>}
    <div><dt>01</dt><dd>Connected destination</dd></div>
   </dl>
   <ol className="mp-road">
    {phases.map((p,i)=><li key={p.id}>
     <a href={`#phase-${i+1}`} className="mp-road-card">
      <span className="mp-road-node">{pad(i+1)}</span>
      <div className="mp-index-media"><img src={image(p,i)} alt="" loading="lazy"/></div>
      <span className="mp-index-n">{i===0?'Where it begins':i===phases.length-1?'The destination':'Then'}</span>
      <strong>{p.title}</strong>
      <small>{p.data.concept}</small>
     </a>
    </li>)}
   </ol>
   <p className="mp-disclaimer">Development vision supplied by the project owner. Areas are planning targets; timelines and final specifications are subject to approvals.</p>
  </section>

  <PhaseProgress/>

  <section className="mp-timeline">
   <header className="mp-timeline-head df-reveal">
    <p className="eyebrow">THE JOURNEY</p>
    <h2>Four chapters,<br/><em>one destination.</em></h2>
   </header>
   <div className="mp-spine" aria-hidden="true"><span className="mp-spine-fill"/></div>
   {phases.map((p,i)=>{
    const facilities:string[]=Array.isArray(p.data.facilities)?p.data.facilities.filter(Boolean):[];
    const facts=[
     p.data.landValue>0&&{icon:LandPlot,value:<>{p.data.landValue}</>,label:`${p.data.landUnit||'Bigha'} of land`},
     p.data.areaValue>0&&{icon:Ruler,value:<>{lakh(p.data.areaValue)}</>,label:`${p.data.areaUnit||'SFT'} development`},
     p.data.costValue>0&&{icon:Banknote,value:<><span className="mp-cur">৳</span>{(p.data.costValue/10000000).toLocaleString('en-IN',{maximumFractionDigits:0})} crore</>,label:'Indicative investment'},
     {icon:LayoutGrid,value:<>{facilities.length}</>,label:'Planned facilities'},
    ].filter(Boolean) as {icon:typeof LandPlot;value:React.ReactNode;label:string}[];
    return <article key={p.id} id={`phase-${i+1}`} data-phase className={`mp-stop ${i%2?'mp-stop-flip':''}`}>
     <span className="mp-node" aria-hidden="true"><span>{ROMAN[i]||i+1}</span></span>
     <figure className="mp-stop-media">
      <div className="mp-frame"><img src={image(p,i)} alt={`${p.title} — illustrative reference`} loading="lazy"/></div>
      <figcaption>Illustrative reference</figcaption>
     </figure>
     <div className="mp-stop-copy df-reveal">
      <span className="mp-ghost" aria-hidden="true">{pad(i+1)}</span>
      <p className="mp-kicker">Phase {ROMAN[i]||i+1}<i/>Chapter {pad(i+1)} of {pad(phases.length)}</p>
      <h2>{p.title}</h2>
      {p.data.concept&&<p className="mp-concept">{p.data.concept}</p>}
      <p className="mp-lead">{p.data.summary||p.data.description}</p>
      <dl className="mp-ledger">
       {facts.map(f=>{const Icon=f.icon;return <div key={f.label}>
        <dt><Icon size={17} strokeWidth={1.3}/>{f.label}</dt>
        <dd>{f.value}</dd>
       </div>})}
      </dl>
      <div className="mp-amenities">
       <p>What this chapter brings</p>
       <ul>{facilities.map(f=>{const Icon=facilityIcon(f);return <li key={f}><Icon size={15} strokeWidth={1.3}/>{f}</li>})}</ul>
      </div>
     </div>
    </article>})}
   <div className="mp-spine-end df-reveal">
    <span className="mp-node mp-node-final" aria-hidden="true"><span>✦</span></span>
    <p className="eyebrow">WHERE THE JOURNEY LEADS</p>
    <strong>One connected destination</strong>
   </div>
  </section>

  <section className="mp-end" id="journey-end">
   <p className="eyebrow">ONE CONTINUOUS VISION</p>
   <h2>One destination.<br/><em>An evolving experience.</em></h2>
   <p>Request the full masterplan brief, phase timelines and ownership options from the team.</p>
   <div className="mp-end-actions">
    <Link className="action" href="/get-in-touch?interest=Project%20Information">Request project information <ArrowUpRight size={18}/></Link>
    <Link className="quiet-link" href="/shareholder-benefits">Shareholder benefits <ArrowUpRight size={16}/></Link>
   </div>
  </section>
 </>;
}
