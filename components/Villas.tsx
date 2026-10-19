import Link from 'next/link';
import {ArrowUpRight,ArrowDown,Plus} from 'lucide-react';
import type {Entry} from '@/lib/content';
import {isMediaUrl} from '@/lib/validation';
import {brochureFor} from '@/lib/villas';
import BrochureButton from '@/components/BrochureButton';
import {facilityIcon} from '@/components/facilityIcons';

const LEGACY=/^\/images\/((forest|woods|cabin|architecture)|discover\/villa-(private|duplex))\.jpg$/;
const FALLBACK=['/images/villas/private.jpg','/images/villas/duplex.jpg'];
export const villaImage=(v:Entry,i:number)=>isMediaUrl(v.data.image)&&!LEGACY.test(v.data.image)?v.data.image:FALLBACK[i%FALLBACK.length];
export const villaFeatures=(v:Entry):string[]=>{const f=Array.isArray(v.data.features)?v.data.features.map((x:string)=>String(x).trim()).filter(Boolean):[];return f.length?f:['Private swimming pool','Forest setting','Registered Sub-Kabala ownership'];};
export const hasBrochure=(v:Entry)=>!!brochureFor(v.slug,v.data);
const pad=(n:number)=>String(n).padStart(2,'0');
const STEPS=[['Enquire','Share your interest with the team.'],['Converse','A private conversation about the villas.'],['Review','Study the approved project documents.'],['Understand','Rights, obligations and ownership terms.'],['Own','Complete the registered legal process.']];

export default function Villas({page,villas,faqs,statements}:{page:Entry;villas:Entry[];faqs:Entry[];statements:Entry[]}){
 const title=page.title==='Own a part of the extraordinary.'?<>Own a part of<br/><em>the extraordinary.</em></>:page.title;
 const heroImage=isMediaUrl(page.data.image)&&!LEGACY.test(page.data.image)?page.data.image:'/images/villas/hero.jpg';
 return <>
  <section className="vo-hero">
   <div className="vo-hero-media df-parallax"><img src={heroImage} alt="Private pool villas set within the forest canopy" fetchPriority="high"/></div>
   <div className="vo-hero-shade"/>
   <div className="vo-hero-content">
    <p className="eyebrow">VILLAS & OWNERSHIP <span>·</span> BHAWAL FOREST</p>
    <h1>{title}</h1>
    {page.data.body&&<p className="vo-hero-body">{page.data.body}</p>}
    <nav className="vo-hero-index" aria-label="The villas">
     {villas.map((v,i)=><a key={v.id} href={`#${v.slug}`}><span>{pad(i+1)}</span>{v.title}<ArrowDown size={14}/></a>)}
    </nav>
   </div>
  </section>

  <section className="vo-facts">
   <div><strong>{pad(villas.length)}</strong><span>Villa collections</span></div>
   <div><strong>Private</strong><span>Pool with every villa</span></div>
   <div><strong>Registered</strong><span>Sub-Kabala ownership</span></div>
   <div><strong>Transferable</strong><span>Across generations</span></div>
  </section>

  <section className="vo-collection">
   {villas.map((v,i)=>{const features=villaFeatures(v);return <article key={v.id} id={v.slug} className={`vo-villa ${i%2?'vo-villa-flip':''}`}>
    <figure className="vo-villa-media df-reveal">
     <div className="vo-frame"><img src={villaImage(v,i)} alt={v.title} loading={i===0?'eager':'lazy'}/></div>
     <figcaption>{v.data.imageLabel||'Illustrative reference'}</figcaption>
    </figure>
    <div className="vo-villa-copy df-reveal">
     <span className="vo-villa-n">{pad(i+1)} <i>/ {pad(villas.length)}</i></span>
     <h2>{v.title}</h2>
     <p className="vo-villa-lead">{v.data.description}</p>
     <ul className="vo-features">{features.map(f=>{const Icon=facilityIcon(f);return <li key={f}><span><Icon size={17} strokeWidth={1.4}/></span>{f}</li>})}</ul>
     {v.data.statusLabel&&<p className="vo-status">{v.data.statusLabel}{v.data.specifications?` · ${v.data.specifications}`:''}</p>}
     <div className="vo-actions">
      <BrochureButton villa={v.slug} title={v.title} available={hasBrochure(v)}/>
      <Link href={`/villas/${v.slug}`} className="vo-explore">Explore this villa <ArrowUpRight size={16}/></Link>
     </div>
    </div>
   </article>})}
  </section>

  <section className="vo-journey">
   <header className="df-reveal">
    <p className="eyebrow">YOUR OWNERSHIP JOURNEY</p>
    <h2>Five calm steps<br/><em>to a place of your own.</em></h2>
   </header>
   <ol>
    {STEPS.map(([t,d],i)=><li key={t} className="df-reveal">
     <span className="vo-journey-node">{pad(i+1)}</span>
     <strong>{t}</strong>
     <small>{d}</small>
    </li>)}
   </ol>
   <p className="vo-journey-note">Illustrative process. Final legal and commercial procedures are confirmed with the team.</p>
  </section>

  {statements.map(s=><section key={s.id} className="vo-statement df-reveal">
   <p className="eyebrow">{s.data.eyebrow||'UNDERSTANDING OWNERSHIP'}</p>
   <h2>{s.title}</h2>
   {s.data.body&&<p>{s.data.body}</p>}
  </section>)}

  {faqs.length>0&&<section className="vo-faq">
   <div className="vo-faq-head df-reveal">
    <p className="eyebrow">GOOD TO KNOW</p>
    <h2>Questions,<br/><em>answered.</em></h2>
   </div>
   <div className="vo-faq-list">
    {faqs.map(f=><details key={f.id}><summary>{f.title}<span><Plus size={18} strokeWidth={1.4}/></span></summary><p>{f.data.answer}</p></details>)}
   </div>
  </section>}

  <section className="vo-cta df-reveal" id="enquire">
   <div><p className="eyebrow">LET’S BEGIN</p><h2>Explore your<br/><em>possibilities.</em></h2></div>
   <div className="vo-cta-side">
    <p>Request ownership details and a private conversation with the team.</p>
    <div className="vo-cta-actions"><Link href="/get-in-touch?interest=Villa%20Ownership" className="vo-cta-link">Request ownership details <i><ArrowUpRight size={18}/></i></Link></div>
   </div>
  </section>
 </>;
}
