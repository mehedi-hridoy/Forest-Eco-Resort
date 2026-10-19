import Link from 'next/link';
import {ArrowUpRight,ArrowDown} from 'lucide-react';
import type {Entry} from '@/lib/content';

const IMG='/images/discover';

const FIGURES=[
 {value:'05',label:'Projects, one destination'},
 {value:'02',label:'Nearing completion'},
 {value:'01',label:'Phase now beginning'},
 {value:'∞',label:'Shades of green'},
];

const CHAPTERS=[
 {n:'01',title:'More than a resort',text:'Five distinct projects, planned together as one mega tourism destination.',image:`${IMG}/destination.jpg`,alt:'Aerial view of a road curving through dense forest',layout:'wide'},
 {n:'02',title:'Nature at its purest',text:'Every plan begins with the green of Bhawal Forest. The trees lead; the buildings follow.',image:`${IMG}/canopy.jpg`,alt:'Mist rising over a forest canopy',layout:'tall'},
 {n:'03',title:'Already underway',text:'Two of the five projects are nearly complete. The first phase of Forest Eco Resort begins now.',image:`${IMG}/underway.jpg`,alt:'A modern residence among trees at dusk',layout:'wide'},
];

const STAYS=[
 {title:'Private Pool Villas',text:'Standalone and private, with a pool of your own.',image:'/images/villas/private.jpg'},
 {title:'Duplex Pool Villas',text:'Two storeys and a private pool, made for family.',image:'/images/villas/duplex.jpg'},
 {title:'Five-Star Lodge',text:'Nine storeys, crowned by an infinity pool.',image:`${IMG}/lodge.jpg`},
 {title:'Luxury Guest House',text:'Six storeys, boutique in spirit.',image:`${IMG}/guest-house.jpg`},
];

const PLAYS=[
 {key:'water',title:'Water Park',text:'Slides, pools and long family afternoons.',image:`${IMG}/water-park.jpg`},
 {key:'golf',title:'Golf Recreation',text:'A practice range and greens among the trees.',image:`${IMG}/golf.jpg`},
 {key:'cable',title:'Cable Car',text:'The long view, above the treetops.',image:`${IMG}/cable-car.jpg`},
 {key:'trails',title:'Forest Trails',text:'Shaded paths through preserved groves.',image:`${IMG}/trails.jpg`},
];

export default function DiscoverForest({page,facilityCount}:{page:Entry;facilityCount:number}){
 const tagline=page.data.body||'Five projects. One forest. A destination made to return to.';
 const statement=page.data.visionBody||'Not a resort — a destination. Luxury, nature, recreation and family life, sharing one forest address.';
 return <>
  <section className="df-hero">
   <div className="df-hero-media df-parallax"><img src={`${IMG}/hero.jpg`} alt="Sunlight through tall forest trunks" fetchPriority="high"/></div>
   <div className="df-hero-shade"/>
   <div className="df-hero-content">
    <p className="eyebrow">BHAWAL FOREST <span>·</span> GAZIPUR</p>
    <h1>Discover<br/><em>Forest Eco Resort.</em></h1>
    <p className="df-hero-tagline">{tagline}</p>
   </div>
   <a className="df-scroll" href="#destination" aria-label="Scroll to the destination"><ArrowDown size={16}/></a>
  </section>

  <section className="df-intro" id="destination">
   <p className="eyebrow df-reveal">THE DESTINATION</p>
   <p className="df-statement df-reveal">{statement}</p>
   <dl className="df-figures df-reveal">
    {FIGURES.map(f=><div key={f.label}><dt>{f.value}</dt><dd>{f.label}</dd></div>)}
   </dl>
  </section>

  <section className="df-chapters">
   {CHAPTERS.map((c,i)=><article key={c.n} className={`df-chapter df-chapter-${c.layout} ${i%2?'df-flip':''}`}>
    <figure className="df-chapter-media df-parallax"><img src={c.image} alt={c.alt} loading="lazy"/></figure>
    <div className="df-chapter-copy df-reveal">
     <span className="df-chapter-n">{c.n}</span>
     <h2>{c.title}</h2>
     <p>{c.text}</p>
    </div>
   </article>)}
  </section>

  <section className="df-stay">
   <header className="df-head df-reveal">
    <p className="eyebrow">WHERE YOU’LL STAY</p>
    <h2>Four ways<br/><em>to stay.</em></h2>
   </header>
   <div className="df-stay-row">
    {STAYS.map(s=><figure key={s.title} className="df-stay-item df-reveal">
     <div className="df-stay-media"><img src={s.image} alt={s.title} loading="lazy"/></div>
     <figcaption><strong>{s.title}</strong><span>{s.text}</span></figcaption>
    </figure>)}
   </div>
  </section>

  <section className="df-interlude">
   <div className="df-interlude-media df-parallax"><img src={`${IMG}/river.jpg`} alt="A quiet river between forested banks" loading="lazy"/></div>
   <p className="df-reveal">Walk beneath the canopy.<br/><em>Glide above it.</em></p>
  </section>

  <section className="df-play">
   <header className="df-head df-reveal">
    <p className="eyebrow">WHAT YOU’LL DO</p>
    <h2>Days that<br/><em>fill themselves.</em></h2>
   </header>
   <div className="df-play-grid">
    {PLAYS.map(p=><figure key={p.key} className={`df-play-item df-play-${p.key}`}>
     <img src={p.image} alt={p.title} loading="lazy"/>
     <figcaption><strong>{p.title}</strong><span>{p.text}</span></figcaption>
    </figure>)}
   </div>
  </section>

  <Link href="/facilities" className="df-facilities">
   <div className="df-facilities-count df-reveal"><strong>{facilityCount}</strong><span>facilities</span></div>
   <div className="df-facilities-copy df-reveal">
    <p className="eyebrow">EVERYTHING, IN ONE PLACE</p>
    <h2>Seven ways to<br/><em>spend a day.</em></h2>
    <ul>{['Stay','Dine','Restore','Play','Explore','Wander','Gather'].map(v=><li key={v}>{v}</li>)}</ul>
    <span className="df-facilities-cta">Explore all facilities <ArrowUpRight size={18}/></span>
   </div>
  </Link>

  <section className="df-close">
   <div className="df-close-media df-parallax"><img src={`${IMG}/closing.jpg`} alt="Sunlit leaves" loading="lazy"/></div>
   <div className="df-close-shade"/>
   <div className="df-close-content df-reveal">
    <p className="eyebrow">A PLACE TO BEGIN AGAIN</p>
    <h2>Your next chapter<br/><em>begins in nature.</em></h2>
    <p>Villa plans, share details and the development roadmap — shared on request.</p>
    <div className="df-close-actions">
     <Link className="action light" href="/get-in-touch?interest=Project%20Information">Request details <ArrowUpRight size={18}/></Link>
     <Link className="quiet-link" href="/facilities">All facilities <ArrowUpRight size={16}/></Link>
    </div>
   </div>
  </section>
 </>;
}
