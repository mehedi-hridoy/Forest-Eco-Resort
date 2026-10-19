import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft,ArrowUpRight} from 'lucide-react';
import {content} from '@/lib/content';
import BrochureButton from '@/components/BrochureButton';
import {facilityIcon} from '@/components/facilityIcons';
import {villaImage,villaFeatures,hasBrochure} from '@/components/Villas';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const v=(await content('villas')).find(x=>x.slug===slug);return {title:v?.data.seoTitle||v?.title||'Villa',description:v?.data.description,alternates:{canonical:`/villas/${slug}`}};}

export default async function Villa({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const villas=await content('villas');
 const index=villas.findIndex(x=>x.slug===slug);
 if(index<0)notFound();
 const v=villas[index];
 const others=villas.filter(x=>x.id!==v.id);
 const features=villaFeatures(v);
 return <main id="main">
  <section className="vd-hero">
   <div className="vo-hero-media df-parallax"><img src={villaImage(v,index)} alt={v.title} fetchPriority="high"/></div>
   <div className="vo-hero-shade"/>
   <div className="vd-hero-content">
    <Link href="/villas-ownership" className="fx-back"><ArrowLeft size={15}/> All villas</Link>
    <p className="eyebrow">{v.data.statusLabel||'THE VILLA COLLECTION'}</p>
    <h1>{v.title}</h1>
    {v.data.description&&<p className="vo-hero-body">{v.data.description}</p>}
    <div className="vd-hero-actions">
     <BrochureButton villa={v.slug} title={v.title} available={hasBrochure(v)} variant="light"/>
     <Link href={`/get-in-touch?interest=Villa%20Ownership&villa=${encodeURIComponent(v.title.replace(/^The /,''))}`} className="vo-explore vo-explore-light">Enquire about this villa <ArrowUpRight size={16}/></Link>
    </div>
   </div>
  </section>

  <section className="vd-body">
   <div className="vd-features df-reveal">
    <p className="eyebrow">WHAT DEFINES IT</p>
    <ul className="vo-features vd-feature-list">{features.map(f=>{const Icon=facilityIcon(f);return <li key={f}><span><Icon size={18} strokeWidth={1.4}/></span>{f}</li>})}</ul>
   </div>
   <dl className="vd-specs df-reveal">
    <div><dt>Category</dt><dd>{v.data.statusLabel||'Proposed villa category'}</dd></div>
    {v.data.phase&&<div><dt>Phase</dt><dd>{v.data.phase}</dd></div>}
    {v.data.specifications&&<div><dt>Specifications</dt><dd>{v.data.specifications}</dd></div>}
    <div><dt>Brochure</dt><dd>{hasBrochure(v)?'Available to download':'Being finalised — request a copy'}</dd></div>
   </dl>
  </section>

  {others.length>0&&<section className="vd-others">
   <p className="eyebrow">ALSO IN THE COLLECTION</p>
   <div>{others.map(o=><Link key={o.id} href={`/villas/${o.slug}`} className="vd-other">
    <div className="vd-other-media"><img src={villaImage(o,villas.indexOf(o))} alt="" loading="lazy"/></div>
    <span><strong>{o.title}</strong><small>{o.data.description}</small></span>
    <ArrowUpRight size={20}/>
   </Link>)}</div>
  </section>}

  <section className="vo-cta df-reveal" id="enquire">
   <div><p className="eyebrow">{v.title.toUpperCase()}</p><h2>A private<br/><em>conversation.</em></h2></div>
   <div className="vo-cta-side">
    <p>Ask the team about availability, floor plans and the ownership process for this villa.</p>
    <div className="vo-cta-actions">
     <Link href={`/get-in-touch?interest=Villa%20Ownership&villa=${encodeURIComponent(v.title.replace(/^The /,''))}`} className="vo-cta-link">Enquire about this villa <i><ArrowUpRight size={18}/></i></Link>
     <Link href="/villas-ownership" className="vo-cta-quiet">All villas <ArrowUpRight size={15}/></Link>
    </div>
   </div>
  </section>
 </main>;
}
