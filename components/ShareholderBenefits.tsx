import {ScrollText,Calendar,Percent,Hotel,TrendingUp,LineChart,Users,TreePine,Sparkles,Landmark,ArrowUpRight} from 'lucide-react';
import Link from 'next/link';
import type {Entry} from '@/lib/content';

const DEFAULT_BENEFITS=[
 'An opportunity to become a shareholder in a premium forest eco-resort in Gazipur.',
 'Legally recognized and transferable ownership through Sub-Kabala (registered deed of conveyance).',
 'Enjoy 3 complimentary days and 2 nights at the resort annually for each share.',
 'Special discounts of up to 50–60% on resort stays and selected facilities throughout the year.',
 'Exclusive discounted vacation opportunities at other resorts operated by NEXCENT GROUP.',
 'Long-term ownership and potential profit opportunities through a one-time investment.',
 "Potential appreciation in share value in line with the project's development and prevailing market conditions.",
 'The opportunity to transfer ownership across generations, subject to applicable laws and terms.',
 'The potential to enjoy personal accommodation and leisure in the lush, scenic surroundings of Gazipur.',
 'A unique combination of investment, asset ownership, leisure, and premium lifestyle benefits.',
];

const ICONS=[Landmark,ScrollText,Calendar,Percent,Hotel,TrendingUp,LineChart,Users,TreePine,Sparkles];
const SHORT_TITLES=[
 'Shareholder opportunity',
 'Legally secured ownership',
 'Annual complimentary stay',
 'Up to 50–60% discounts',
 'Access to NEXCENT resorts',
 'One-time, long-term stake',
 'Appreciation potential',
 'Generational transfer',
 'Private escape in Gazipur',
 'A complete value package',
];

const PILLARS=[
 {eyebrow:'OWNERSHIP',title:'A tangible, legally secured stake.',description:'Registered Sub-Kabala, generational transfer rights, and long-term asset ownership — not just a membership.',refs:[1,2,6,8]},
 {eyebrow:'LIFESTYLE',title:'A retreat you can actually use.',description:'Annual complimentary nights, 50–60% member rates, and discounted stays across NEXCENT GROUP properties.',refs:[3,4,5,9]},
 {eyebrow:'INVESTMENT',title:'Participation in a maturing destination.',description:'A one-time entry with potential appreciation in step with project development and market conditions.',refs:[6,7,10]},
];

export default function ShareholderBenefits({page}:{page:Entry}){
 const raw=Array.isArray(page.data.benefits)?page.data.benefits.map((b:string)=>String(b).trim()).filter(Boolean):DEFAULT_BENEFITS;
 const benefits=raw.length?raw:DEFAULT_BENEFITS;
 return <>
  <section className="section benefits-intro">
   <div className="benefits-intro-copy">
    <p className="eyebrow">SHAREHOLDER BENEFITS</p>
    <h2>Ownership that lives<br/><em>beyond a weekend.</em></h2>
    <p className="wide-copy">{page.data.body||'A Forest Eco Resort share is more than an investment — it is registered ownership, an annual escape into Gazipur, and member access across the NEXCENT GROUP portfolio.'}</p>
   </div>
   <div className="benefits-stats">
    <div><strong>03 days<br/>+ 02 nights</strong><small>Complimentary stay per share, every year</small></div>
    <div><strong>50–60%</strong><small>Member discount on stays & facilities</small></div>
    <div><strong>Sub-Kabala</strong><small>Registered, transferable ownership</small></div>
   </div>
  </section>
  <section className="section dark benefits-pillars">
   <div className="section-heading"><div><p className="eyebrow">THREE PILLARS</p><h2>Why shareholders<br/>stay with us.</h2></div><p>Each share bundles three things most ownership products pick only one of — a secured asset, a repeating retreat, and participation in a growing destination.</p></div>
   <div className="pillar-grid">
    {PILLARS.map(p=><article key={p.eyebrow} className="pillar-card">
     <span className="pillar-eyebrow">{p.eyebrow}</span>
     <h3>{p.title}</h3>
     <p>{p.description}</p>
     <ul>{p.refs.map(n=>benefits[n-1]&&<li key={n}><span>{String(n).padStart(2,'0')}</span>{SHORT_TITLES[n-1]||benefits[n-1]}</li>)}</ul>
    </article>)}
   </div>
  </section>
  <section className="section benefits-grid-section">
   <div className="section-heading"><div><p className="eyebrow">THE FULL LIST</p><h2>Ten reasons,<br/>one commitment.</h2></div><p>Each shareholder benefit, exactly as it appears in your approved documentation. Nothing abstract — every line is a right or a service you can plan around.</p></div>
   <div className="benefits-grid">
    {benefits.map((text,i)=>{const Icon=ICONS[i%ICONS.length];const title=SHORT_TITLES[i]||`Benefit ${i+1}`;return <article className="benefit-card" key={i}>
     <div className="benefit-head">
      <span className="benefit-number">{String(i+1).padStart(2,'0')}</span>
      <span className="benefit-icon"><Icon size={20} strokeWidth={1.4}/></span>
     </div>
     <h3>{title}</h3>
     <p>{text}</p>
    </article>})}
   </div>
  </section>
  <section className="section benefits-legal">
   <p className="caption"><strong>Important.</strong> Benefits are subject to the approved shareholder agreement, applicable laws, prevailing market conditions and development progress of the project. Share value appreciation, resort availability and inter-property stays are illustrative possibilities, not guarantees. Request current approved documentation before any commitment.</p>
  </section>
  <section className="section inquiry-section benefits-cta">
   <div>
    <p className="eyebrow">BECOME A SHAREHOLDER</p>
    <h2>Request the<br/>full brief.</h2>
    <p>Our team will share the approved shareholder documentation, the current share structure, and arrange a conversation on how the benefits apply to you.</p>
    <Link className="action" href="/contact?interest=Villa%20Ownership">Request shareholder details <ArrowUpRight size={18}/></Link>
   </div>
   <div className="benefits-cta-highlights">
    <div><strong>One-time investment</strong><p>No recurring membership fees. Ownership is yours.</p></div>
    <div><strong>Transferable asset</strong><p>Pass it on across generations under applicable law.</p></div>
    <div><strong>Lifestyle, not just paperwork</strong><p>Annual nights, member rates, access to NEXCENT GROUP.</p></div>
   </div>
  </section>
 </>;
}
