import Link from 'next/link';
import {ArrowUpRight,Compass,Gem,Briefcase,Building2,Plane,ConciergeBell,Map as MapIcon,Sparkles,TrendingUp,Leaf} from 'lucide-react';
import {content,entry} from '@/lib/content';
import {isMediaUrl} from '@/lib/validation';
import {experienceImage} from '@/lib/experiences';
import PopupBanner from '@/components/PopupBanner';
import BrochureButton from '@/components/BrochureButton';
import HomeHero,{type HeroSlide} from '@/components/home/HomeHero';
import HomeMotion from '@/components/home/HomeMotion';
import {villaImage,villaFeatures,hasBrochure} from '@/components/Villas';

const pad=(n:number)=>String(n).padStart(2,'0');

const SECTORS=[
 {icon:Building2,title:'Real Estate',text:'Considered developments, built on clear planning and quality that lasts.'},
 {icon:Plane,title:'Tourism',text:'Destinations that give people a reason to travel — and to return.'},
 {icon:ConciergeBell,title:'Hospitality',text:'Places to stay, dine and gather, run with professional care.'},
 {icon:MapIcon,title:'Destination Development',text:'Whole places planned as one, where nature, leisure and living meet.'},
];
const PRINCIPLES=[
 {icon:Compass,title:'Strategic planning',text:'Every project begins with a clear long-term vision and a phased path to reach it.'},
 {icon:Gem,title:'Quality execution',text:'Thoughtful architecture and careful construction, held to a consistent standard.'},
 {icon:Briefcase,title:'Professional management',text:'Operations run with the discipline that keeps a destination at its best.'},
];
const VALUES=[
 {icon:Sparkles,title:'Elevate lifestyles',text:'Private retreats and shared spaces designed around a slower, more meaningful way to spend time.'},
 {icon:TrendingUp,title:'Unlock opportunity',text:'Registered villa ownership in a destination planned to grow across four phases.'},
 {icon:Leaf,title:'Build enduring value',text:'Development that protects the forest it depends on — sustainable by intent, not by slogan.'},
];
const CHAPTERS=[
 {n:'01',title:'More than a resort',text:'Five distinct projects, planned together as one destination.',image:'/images/discover/destination.jpg'},
 {n:'02',title:'Nature leads',text:'Every plan begins with the green of Bhawal. The trees lead; the buildings follow.',image:'/images/discover/canopy.jpg'},
 {n:'03',title:'Already underway',text:'Two of the five projects are nearing completion. Phase one begins now.',image:'/images/discover/underway.jpg'},
];
const MARQUEE=[
 ['/images/home/huts.jpg','Thatched retreats in a tropical garden'],['/images/villas/retreat.jpg','A pool among palms and forest'],['/images/masterplan/phase-4.jpg','Water courts and palms'],['/images/facilities/dining.jpg','Dining by the water'],['/images/discover/trails.jpg','A forest trail at golden hour'],
 ['/images/villas/twilight.jpg','A villa at twilight'],['/images/home/celebrate.jpg','Lights strung through a tree'],['/images/discover/golf.jpg','Greens from above'],['/images/masterplan/phase-1.jpg','A resort pool in the trees'],['/images/discover/closing.jpg','Sunlit leaves'],
];

function Words({text}:{text:string}){return <>{text.split(/\s+/).map((w,i)=><span key={i} className="hm-w">{w} </span>)}</>}

export default async function Home(){
 const [page,sections,experiences,villas,phases,facilities,articles,sliders,popups,settings]=await Promise.all([entry('pages','home'),content('sections'),content('experiences'),content('villas'),content('masterplan'),content('facilities'),content('articles'),content('sliders'),content('popup'),entry('settings','global')]);
 const popup=popups.find(p=>isMediaUrl(p.data.image));
 const intro=sections.find(s=>s.data.page==='home');
 const introBody=String(intro?.data.body||'Some places invite you to visit. Others invite you to feel differently. In the natural surroundings of Bhawal, Forest Eco Resort is envisioned as a place for peaceful escapes, meaningful experiences and private retreats.');
 const sentences=introBody.match(/[^.!?]+[.!?]+/g)||[introBody];
 const statement=sentences.slice(0,2).join(' ').trim(),introRest=sentences.slice(2).join(' ').trim();
 const s=settings?.data??{};

 // Slides published in the admin drive the hero; until there are any, the curated set below is shown.
 const adminSlides:HeroSlide[]=sliders.slice(0,3).filter(x=>isMediaUrl(x.data.image)||isMediaUrl(x.data.video)).map(x=>({id:x.id,image:isMediaUrl(x.data.image)?x.data.image:'/images/home/hero.jpg',video:isMediaUrl(x.data.video)?x.data.video:undefined,eyebrow:x.data.eyebrow||'FOREST ECO RESORT · BHAWAL FOREST',headline:x.data.headline||x.title,description:x.data.description||''}));
 const slides:HeroSlide[]=adminSlides.length?adminSlides:[
  {id:'nature',image:'/images/home/hero.jpg',eyebrow:'A NEXCENT GROUP DESTINATION · BHAWAL FOREST',headline:'Where nature becomes an experience.',description:page?.data.body||'A premium destination where nature, luxury, hospitality, adventure and leisure come together in one extraordinary setting.'},
  {id:'phases',image:'/images/masterplan/hero.jpg',eyebrow:'THE MASTERPLAN · FOUR PHASES',headline:'One forest. One evolving destination.',description:'Hospitality, recreation, lifestyle and wellness — planned together and delivered phase by phase.'},
  {id:'villas',image:'/images/villas/hero.jpg',eyebrow:'VILLAS & OWNERSHIP',headline:'A private sanctuary, shaped by the trees.',description:'Pool villas set within the green of Bhawal, with registered Sub-Kabala ownership.'},
 ];

 return <main id="main" className="hm">
  {popup&&<PopupBanner id={popup.id} image={popup.data.image} version={popup.updatedAt.toISOString()}/>}
  <HomeHero slides={slides}/>

  {/* Manifesto */}
  <section className="hm-manifesto" id="manifesto">
   <p className="hm-eyebrow"><span/>{(intro?.data.eyebrow||'THE FOREST WAY OF LIFE').toUpperCase()}</p>
   <p className="hm-statement hm-words"><Words text={statement}/></p>
   <div className="hm-manifesto-foot">
    <div className="hm-manifesto-img hm-clip"><img src="/images/discover/closing.jpg" alt="Sunlight through young leaves" loading="lazy" data-speed="6"/></div>
    <div className="hm-rise">
     <h2>{intro?.title||'A destination shaped by nature.'}</h2>
     {introRest&&<p>{introRest}</p>}
     <Link href="/discover-forest" className="hm-link">Discover the destination <ArrowUpRight size={16}/></Link>
    </div>
   </div>
  </section>

  {/* The developer */}
  <section className="hg">
   <div className="hg-head">
    <div className="hm-rise">
     <p className="hm-eyebrow hm-eyebrow-light"><span/>THE DEVELOPER · NEXCENT GROUP</p>
     <h2>From promising ideas<br/>to <em>meaningful destinations.</em></h2>
    </div>
    <div className="hg-intro hm-rise">
     <p>NEXCENT GROUP is a privately owned, real estate-focused business group dedicated to transforming promising ideas into meaningful developments across real estate, tourism, hospitality and contemporary destination development.</p>
     <p>Our vision extends beyond construction. Through strategic planning, quality execution and professional management, we create distinctive projects that elevate lifestyles, unlock investment opportunities and generate sustainable, long-term value.</p>
    </div>
   </div>
   <ol className="hg-sectors">
    {SECTORS.map(({icon:Icon,title,text},i)=><li key={title} className="df-reveal">
     <span className="hg-line"/>
     <span className="hg-n">{pad(i+1)}</span>
     <h3>{title}</h3>
     <p>{text}</p>
     <span className="hg-icon"><Icon size={22} strokeWidth={1.3}/></span>
    </li>)}
   </ol>
   <div className="hg-principles">
    {PRINCIPLES.map(({icon:Icon,title,text})=><div key={title} className="hg-principle df-reveal"><Icon size={26} strokeWidth={1.2}/><h3>{title}</h3><p>{text}</p></div>)}
   </div>
   <blockquote className="hg-quote df-reveal">
    <p>“Every project represents more than a business initiative — it is a thoughtfully envisioned opportunity for the future, a distinctive identity, and <em>a foundation built on lasting trust.</em>”</p>
    <footer>NEXCENT GROUP</footer>
   </blockquote>
  </section>

  {/* The destination */}
  <section className="hd">
   <div className="hd-head hm-rise">
    <div><p className="hm-eyebrow"><span/>FOREST ECO RESORT</p>
    <h2>Not a resort.<br/><em>A destination.</em></h2></div>
    <p>Luxury, nature, recreation and family life, sharing one forest address — conceived by NEXCENT GROUP as a new kind of getaway, within easy reach of the city.</p>
   </div>
   <div className="hd-stats">
    <div><strong data-count="5" data-pad="2">05</strong><span>Projects in one destination</span></div>
    <div><strong data-count="2" data-pad="2">02</strong><span>Nearing completion</span></div>
    <div><strong data-count={phases.length} data-pad="2">{pad(phases.length)}</strong><span>Phases of development</span></div>
    <div><strong data-count={facilities.length}>{facilities.length}</strong><span>Planned facilities</span></div>
   </div>
   <div className="hd-chapters">
    {CHAPTERS.map((c,i)=><article key={c.n} className={`hd-chapter hd-chapter-${i}`}>
     <div className="hd-media hm-clip"><img src={c.image} alt="" loading="lazy" data-speed="5"/></div>
     <div className="hd-copy df-reveal"><span>{c.n}</span><h3>{c.title}</h3><p>{c.text}</p></div>
    </article>)}
   </div>
   <Link href="/discover-forest" className="hm-pill">Discover Forest Eco Resort <i><ArrowUpRight size={18}/></i></Link>
  </section>

  {/* Experiences */}
  <section className="he" aria-label="Experiences">
   <div className="he-track">
    <div className="he-intro">
     <p className="hm-eyebrow hm-eyebrow-light"><span/>ROOM FOR EVERY SIDE OF YOU</p>
     <h2>Find your<br/><em>own rhythm.</em></h2>
     <p>A quiet morning. A shared table. A little adventure. Six ways to spend your time at Forest.</p>
     <div className="he-progress" aria-hidden="true"><span/></div>
     <Link href="/experience" className="hm-link hm-link-light">All experiences <ArrowUpRight size={16}/></Link>
    </div>
    {experiences.map((e,i)=><Link key={e.id} href={`/experience#${e.slug}`} className="he-card">
     <div className="he-media"><img src={experienceImage(e,i)} alt={`${e.title} — illustrative reference`} loading="lazy"/></div>
     <div className="he-copy">
      <span>{pad(i+1)} / {pad(experiences.length)}</span>
      <h3>{e.title}</h3>
      <p>{e.data.description}</p>
      <i><ArrowUpRight size={20}/></i>
     </div>
    </Link>)}
   </div>
  </section>

  {/* Villas */}
  <section className="hv">
   <div className="hv-head hm-rise">
    <p className="hm-eyebrow"><span/>A SANCTUARY TO CALL YOUR OWN</p>
    <h2>Closer to nature.<br/><em>Closer to you.</em></h2>
    <p>Private pool villas set within the forest, each held through registered Sub-Kabala ownership that can pass across generations.</p>
    <Link href="/villas-ownership" className="hm-link">Explore villas &amp; ownership <ArrowUpRight size={16}/></Link>
   </div>
   <div className="hv-grid">
    {villas.map((v,i)=><article key={v.id} className={`hv-card hv-card-${i%2}`}>
     <Link href={`/villas/${v.slug}`} className="hv-media hm-clip">
      <img src={villaImage(v,i)} alt={v.title} loading="lazy"/>
      <span className="hv-tag">{pad(i+1)} · {v.data.statusLabel||'Proposed villa category'}</span>
     </Link>
     <div className="hv-copy">
      <h3><Link href={`/villas/${v.slug}`}>{v.title}</Link></h3>
      <p>{v.data.description}</p>
      <ul>{villaFeatures(v).slice(0,3).map(f=><li key={f}>{f}</li>)}</ul>
      <div className="hv-actions">
       <BrochureButton villa={v.slug} title={v.title} available={hasBrochure(v)}/>
       <Link href={`/villas/${v.slug}`} className="hm-link">Explore <ArrowUpRight size={16}/></Link>
      </div>
     </div>
    </article>)}
   </div>
  </section>

  {/* Masterplan */}
  <section className="hp">
   <div className="hp-head hm-rise">
    <p className="hm-eyebrow hm-eyebrow-light"><span/>THE LONG VIEW</p>
    <h2>{pad(phases.length)} phases.<br/><em>One evolving destination.</em></h2>
   </div>
   <div className="hp-body">
    <div className="hp-sticky" aria-hidden="true">
     {phases.map((p,i)=><div key={p.id} className={`hp-frame ${i===0?'is-active':''}`}><img src={isMediaUrl(p.data.image)?p.data.image:'/images/masterplan/hero.jpg'} alt="" loading="lazy"/><span>{p.data.eyebrow||`PHASE ${pad(i+1)}`}</span></div>)}
    </div>
    <ol className="hp-stops">
     {phases.map((p,i)=><li key={p.id} className={`hp-stop ${i===0?'is-active':''}`} data-index={i}>
      <img className="hp-inline" src={isMediaUrl(p.data.image)?p.data.image:'/images/masterplan/hero.jpg'} alt="" loading="lazy"/>
      <span className="hp-n">{pad(i+1)}</span>
      <p className="hp-concept">{p.data.concept}</p>
      <h3>{p.title}</h3>
      {p.data.summary&&<p className="hp-summary">{String(p.data.summary).length>220?String(p.data.summary).slice(0,220).replace(/\s+\S*$/,'')+'…':p.data.summary}</p>}
      <Link href={`/masterplan#${p.slug}`} className="hm-link hm-link-light">Explore phase {i+1} <ArrowUpRight size={16}/></Link>
     </li>)}
    </ol>
   </div>
  </section>

  {/* Value */}
  <section className="hx">
   <div className="hx-head hm-rise">
    <p className="hm-eyebrow"><span/>DEVELOPMENT · EXPERIENCE · ENDURING VALUE</p>
    <h2>A connection worth<br/><em>building on.</em></h2>
   </div>
   <div className="hx-grid">
    {VALUES.map(({icon:Icon,title,text},i)=><div key={title} className="hx-card df-reveal">
     <span className="hx-n">{pad(i+1)}</span><Icon size={30} strokeWidth={1.2}/><h3>{title}</h3><p>{text}</p>
    </div>)}
   </div>
   <div className="hx-foot">
    <Link href="/shareholder-benefits" className="hm-pill">See shareholder benefits <i><ArrowUpRight size={18}/></i></Link>
    <small>Aspirations of the developer. Ownership terms and benefits are confirmed in approved documentation; no return or appreciation is guaranteed.</small>
   </div>
  </section>

  {/* Gallery */}
  <section className="hq" aria-label="A sense of Forest">
   <div className="hq-head hm-rise">
    <p className="hm-eyebrow"><span/>A WINDOW INTO THE VISION</p>
    <h2>A sense of <em>Forest.</em></h2>
    <Link href="/gallery" className="hm-link">Explore the gallery <ArrowUpRight size={16}/></Link>
   </div>
   {[MARQUEE.slice(0,5),MARQUEE.slice(5)].map((row,r)=><div key={r} className={`hq-row ${r?'hq-row-reverse':''}`}>
    <div className="hq-track">{[...row,...row].map(([src,alt],i)=><figure key={i} aria-hidden={i>=row.length}><img src={src} alt={i<row.length?alt:''} loading="lazy"/></figure>)}</div>
   </div>)}
  </section>

  {articles.length>0&&<section className="hj">
   <div className="hj-head"><p className="hm-eyebrow"><span/>THE JOURNAL</p><h2>Stories <em>taking root.</em></h2></div>
   <div>{articles.slice(0,3).map(a=><Link className="hj-row" key={a.id} href={`/journal/${a.slug}`}><span>{a.data.category}</span><h3>{a.title}</h3><ArrowUpRight size={22}/></Link>)}</div>
  </section>}

  {/* Closing */}
  <section className="hc">
   <div className="hc-media"><img src="/images/home/hero.jpg" alt="" loading="lazy" data-speed="8"/></div>
   <div className="hc-shade"/>
   <div className="hc-content hm-rise">
    <p className="hm-eyebrow hm-eyebrow-light"><span/>A PLACE TO BEGIN AGAIN</p>
    <h2>Your next chapter<br/><em>begins in nature.</em></h2>
    <div className="hc-actions">
     <Link href="/get-in-touch?interest=Villa%20Ownership" className="hm-pill hm-pill-light">Request ownership details <i><ArrowUpRight size={18}/></i></Link>
     <Link href="/masterplan" className="hm-link hm-link-light">Explore the masterplan <ArrowUpRight size={16}/></Link>
    </div>
    {(s.phones?.length||s.email)&&<p className="hc-contact">{s.phones?.[0]&&<a href={`tel:+88${s.phones[0]}`}>{s.phones[0]}</a>}{s.email&&<a href={`mailto:${s.email}`}>{s.email}</a>}</p>}
   </div>
  </section>
  <HomeMotion/>
 </main>;
}
