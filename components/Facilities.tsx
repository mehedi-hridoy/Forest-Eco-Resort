'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {motion,AnimatePresence,MotionConfig,useReducedMotion,useInView,animate} from 'framer-motion';
import {ArrowUpRight,ArrowLeft,Search,X} from 'lucide-react';
import {facilityIcon} from '@/components/facilityIcons';

export type FacilityItem={id:string;title:string;phase:number;category:string};

const WORLDS=[
 {key:'Accommodation',verb:'Stay',line:'Villas, suites and rooms',image:'/images/discover/villa-private.jpg'},
 {key:'Dining',verb:'Dine',line:'From café to fine dining',image:'/images/facilities/dining.jpg'},
 {key:'Wellness',verb:'Restore',line:'Spa, sauna and stillness',image:'/images/facilities/wellness.jpg'},
 {key:'Golf & Sports',verb:'Play',line:'Range, greens and sport',image:'/images/discover/golf.jpg'},
 {key:'Recreation & Services',verb:'Explore',line:'Pools, play and adventure',image:'/images/discover/water-park.jpg'},
 {key:'Nature & Leisure',verb:'Wander',line:'Gardens, trails and water',image:'/images/discover/trails.jpg'},
 {key:'Events & Business',verb:'Gather',line:'Events, meetings, celebrations',image:'/images/facilities/events.jpg'},
];
const ROMAN=['I','II','III','IV','V','VI'];
const EASE=[0.2,0.7,0.2,1] as const;

function CountUp({to}:{to:number}){
 const ref=useRef<HTMLSpanElement>(null);const inView=useInView(ref,{once:true});const reduced=useReducedMotion();
 const [n,setN]=useState(0);
 useEffect(()=>{if(!inView)return;if(reduced){setN(to);return;}const c=animate(0,to,{duration:1.8,ease:EASE,onUpdate:v=>setN(Math.round(v))});return()=>c.stop();},[inView,to,reduced]);
 return <span ref={ref}>{n}</span>;
}

export default function Facilities({items,phaseTitles}:{items:FacilityItem[];phaseTitles:Record<number,string>}){
 const reduced=useReducedMotion();
 const [world,setWorld]=useState<string>('All');
 const [phase,setPhase]=useState<number>(0);
 const [query,setQuery]=useState('');
 const [open,setOpen]=useState(0);
 const explorer=useRef<HTMLElement>(null);
 const worlds=WORLDS.map(w=>({...w,count:items.filter(i=>i.category===w.key).length})).filter(w=>w.count>0);
 const phases=[...new Set(items.map(i=>i.phase))].sort((a,b)=>a-b);
 const results=useMemo(()=>items.filter(i=>(world==='All'||i.category===world)&&(!phase||i.phase===phase)&&i.title.toLowerCase().includes(query.trim().toLowerCase())),[items,world,phase,query]);
 const verbOf=(cat:string)=>WORLDS.find(w=>w.key===cat)?.verb||cat;
 const choose=(key:string)=>{setWorld(key);explorer.current?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});};
 const perPhase=phases.map(p=>{const list=items.filter(i=>i.phase===p);const mix=worlds.map(w=>({verb:w.verb,n:list.filter(i=>i.category===w.key).length})).filter(m=>m.n>0).sort((a,b)=>b.n-a.n);return {phase:p,count:list.length,mix};});
 return <MotionConfig reducedMotion="user">
  <section className="fx-hero">
   <img src="/images/discover/canopy.jpg" alt="" className="fx-hero-bg"/>
   <div className="fx-hero-inner">
    <Link href="/discover-forest" className="fx-back"><ArrowLeft size={15}/> Discover Forest Eco Resort</Link>
    <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:1.2,ease:EASE}}>
     <p className="fx-count"><CountUp to={items.length}/></p>
     <h1>facilities,<br/><em>seven ways to spend a day.</em></h1>
    </motion.div>
    <motion.ul className="fx-verbs" initial="hide" animate="show" variants={{show:{transition:{staggerChildren:.08,delayChildren:.6}}}}>
     {worlds.map(w=><motion.li key={w.key} variants={{hide:{opacity:0,y:12},show:{opacity:1,y:0,transition:{duration:.6,ease:EASE}}}}><button onClick={()=>choose(w.key)}>{w.verb}</button></motion.li>)}
    </motion.ul>
   </div>
  </section>

  <section className="fx-worlds" aria-label="Facility worlds">
   {worlds.map((w,i)=><button key={w.key} className={`fx-world ${open===i?'open':''}`} onMouseEnter={()=>setOpen(i)} onFocus={()=>setOpen(i)} onClick={()=>choose(w.key)}>
    <img src={w.image} alt="" loading="lazy"/>
    <span className="fx-world-shade"/>
    <span className="fx-world-tab">{w.verb}</span>
    <span className="fx-world-body">
     <span className="fx-world-n">{String(w.count).padStart(2,'0')}</span>
     <strong>{w.verb}</strong>
     <small>{w.line}</small>
     <em>View {w.count} facilities <ArrowUpRight size={14}/></em>
    </span>
   </button>)}
  </section>

  <section className="fx-explorer" ref={explorer}>
   <div className="fx-toolbar">
    <div className="fx-chips" role="tablist" aria-label="Filter by world">
     <button role="tab" aria-selected={world==='All'} onClick={()=>setWorld('All')}>All <i>{items.length}</i></button>
     {worlds.map(w=><button key={w.key} role="tab" aria-selected={world===w.key} onClick={()=>setWorld(w.key)}>{w.verb} <i>{w.count}</i></button>)}
    </div>
    <div className="fx-tools">
     <div className="fx-phases" role="group" aria-label="Filter by phase">
      <button aria-pressed={phase===0} onClick={()=>setPhase(0)}>All phases</button>
      {phases.map(p=><button key={p} aria-pressed={phase===p} onClick={()=>setPhase(p)} title={phaseTitles[p]}>{ROMAN[p-1]||p}</button>)}
     </div>
     <label className="fx-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search" aria-label="Search facilities"/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear search"><X size={14}/></button>}</label>
    </div>
   </div>
   <div className="fx-status">
    <strong>{results.length}</strong>
    <span>{world==='All'?'facilities':verbOf(world).toLowerCase()+' facilities'}{phase?` · Phase ${ROMAN[phase-1]}`:''}</span>
   </div>
   <motion.ul className="fx-grid" layout>
    <AnimatePresence mode="popLayout" initial={false}>
     {results.map((f,i)=>{const Icon=facilityIcon(f.title);return <motion.li key={f.id} layout initial={{opacity:0,y:18,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,scale:.95,transition:{duration:.18}}} transition={{duration:.45,ease:EASE,delay:Math.min(i*.018,.35)}} className="fx-tile">
      <span className="fx-tile-icon"><Icon size={20} strokeWidth={1.3}/></span>
      <strong>{f.title}</strong>
      <small><span>{verbOf(f.category)}</span>Phase {ROMAN[f.phase-1]||f.phase}</small>
     </motion.li>})}
    </AnimatePresence>
   </motion.ul>
   {!results.length&&<p className="fx-empty">Nothing matches that search. <button onClick={()=>{setQuery('');setWorld('All');setPhase(0)}}>Reset filters</button></p>}
  </section>

  <section className="fx-arrival">
   <div className="fx-arrival-head">
    <p className="eyebrow">WHEN THEY ARRIVE</p>
    <h2>Every phase<br/><em>adds to the day.</em></h2>
   </div>
   <div className="fx-phase-cols">
    {perPhase.map(p=><div key={p.phase} className="df-reveal">
     <Link href={`/masterplan#phase-${p.phase}`} className="fx-phase-col">
      <span className="fx-phase-roman">{ROMAN[p.phase-1]||p.phase}</span>
      <small className="fx-phase-name">{phaseTitles[p.phase]}</small>
      <strong>+{p.count}</strong>
      <ul>{p.mix.slice(0,3).map(m=><li key={m.verb}><span>{m.verb}</span><i>{m.n}</i></li>)}</ul>
     </Link>
    </div>)}
   </div>
  </section>

  <section className="fx-close">
   <p className="eyebrow">THE BIGGER PICTURE</p>
   <h2>One forest.<br/><em>Everything within reach.</em></h2>
   <div className="fx-close-actions">
    <Link className="action light" href="/discover-forest">Discover Forest Eco Resort <ArrowUpRight size={18}/></Link>
    <Link className="quiet-link" href="/masterplan">The Masterplan <ArrowUpRight size={16}/></Link>
   </div>
  </section>
 </MotionConfig>;
}
