'use client';
import {Fragment,useCallback,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,ArrowDown} from 'lucide-react';

export type HeroSlide={id:string;image:string;video?:string;eyebrow:string;headline:string;description?:string};

const DURATION=8000;

function Headline({text}:{text:string}){
 const words=text.trim().split(/\s+/);
 // The closing word carries the serif italic accent used across the site.
 return <h1 className="hh-title" aria-label={text}>{words.map((w,i)=><Fragment key={i}><span className="hh-word" aria-hidden="true"><span style={{animationDelay:`${.15+i*.07}s`}}>{i===words.length-1?<em>{w}</em>:w}</span></span>{i<words.length-1?' ':''}</Fragment>)}</h1>;
}

export default function HomeHero({slides}:{slides:HeroSlide[]}){
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[ready,setReady]=useState(false);
 const count=slides.length,touch=useRef(0);
 const go=useCallback((n:number)=>setIndex(i=>(i+n+count)%count),[count]);
 useEffect(()=>{setReady(true)},[]);
 useEffect(()=>{if(paused||count<2)return;const t=setTimeout(()=>go(1),DURATION);return()=>clearTimeout(t)},[index,paused,count,go]);
 const slide=slides[index];
 return <section className={`hh ${ready?'is-ready':''}`} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onTouchStart={e=>{touch.current=e.touches[0].clientX}} onTouchEnd={e=>{const d=touch.current-e.changedTouches[0].clientX;if(Math.abs(d)>40)go(d>0?1:-1)}} aria-roledescription="carousel" aria-label="Forest Eco Resort">
  <div className="hh-stage">
   {slides.map((s,i)=><div key={s.id} className={`hh-slide ${i===index?'is-active':''}`} aria-hidden={i!==index}>
    {s.video?<video src={s.video} autoPlay muted loop playsInline poster={s.image}/>:<img src={s.image} alt="" fetchPriority={i===0?'high':'low'} loading={i===0?'eager':'lazy'}/>}
   </div>)}
   <div className="hh-shade"/>
   <div className="hh-grain"/>
  </div>

  <div className="hh-content" key={slide.id}>
   <p className="hh-eyebrow"><span/>{slide.eyebrow}</p>
   <Headline text={slide.headline}/>
   {slide.description&&<p className="hh-desc">{slide.description}</p>}
   <div className="hh-actions">
    <Link href="/discover-forest" className="hh-cta">Discover the destination <i><ArrowUpRight size={18}/></i></Link>
    <Link href="/get-in-touch?interest=Villa%20Ownership" className="hh-quiet">Become an owner <ArrowUpRight size={16}/></Link>
   </div>
  </div>

  {count>1&&<div className="hh-controls" role="tablist" aria-label="Choose slide">
   {slides.map((s,i)=><button key={s.id} role="tab" aria-selected={i===index} aria-label={`Slide ${i+1}: ${s.headline}`} className={i===index?'is-active':''} onClick={()=>setIndex(i)}>
    <span className="hh-n">{String(i+1).padStart(2,'0')}</span>
    <span className="hh-bar"><span style={{animationDuration:`${DURATION}ms`,animationPlayState:paused?'paused':'running'}}/></span>
   </button>)}
  </div>}

  <a className="hh-scroll" href="#manifesto" aria-label="Scroll to discover"><span/><ArrowDown size={14}/></a>
  <p className="hh-side">BHAWAL FOREST · RAJENDRAPUR · GAZIPUR</p>
 </section>;
}
