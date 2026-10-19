'use client';
import {useEffect,useRef,useState,useCallback} from 'react';
import {ArrowDown,ChevronLeft,ChevronRight} from 'lucide-react';
import type {Entry} from '@/lib/content';
import {isMediaUrl as isValidMedia} from '@/lib/validation';
export default function Slider({slides}:{slides:Entry[]}){
 const [index,setIndex]=useState(0);const [paused,setPaused]=useState(false);
 const count=slides.length;
 const go=useCallback((n:number)=>setIndex(i=>(i+n+count)%count),[count]);
 const to=useCallback((n:number)=>setIndex(((n%count)+count)%count),[count]);
 useEffect(()=>{if(paused||count<2)return;const current=slides[index];const dur=current?.data.video?12000:7000;const timer=setTimeout(()=>go(1),dur);return()=>clearTimeout(timer)},[index,paused,count,slides,go]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[go]);
 const touch=useRef(0);
 const slide=slides[index];if(!slide)return null;
 const eyebrow=slide.data.eyebrow||'FOREST ECO RESORT — RAJENDRAPUR, GAZIPUR';
 const headline=slide.data.headline||slide.title;
 const description=slide.data.description||'';
 return <section className="hero home-hero slider-hero" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onTouchStart={e=>{touch.current=e.touches[0].clientX}} onTouchEnd={e=>{const d=touch.current-e.changedTouches[0].clientX;if(Math.abs(d)>40)go(d>0?1:-1)}} aria-roledescription="carousel" aria-label="Forest Eco Resort featured">
  <div className="slider-stage">
   {slides.map((s,i)=>{const sv=isValidMedia(s.data.video)?s.data.video:'';const si=isValidMedia(s.data.image)?s.data.image:'/images/forest.jpg';return <div key={s.id} className={`slider-slide ${i===index?'active':''}`} aria-hidden={i!==index}>{sv?<video src={sv} autoPlay muted loop playsInline poster={si}/>:<img src={si} alt={s.title||'Forest Eco Resort'} loading={i===0?'eager':'lazy'}/>}<div className="slider-shade"/></div>})}
  </div>
  <div className="hero-content slider-content">
   <p className="eyebrow">{eyebrow}</p>
   <h1>{headline}</h1>
   {description&&<p className="hero-description">{description}</p>}
  </div>
  {count>1&&<>
   <div className="slider-controls">
    <button onClick={()=>go(-1)} aria-label="Previous slide"><ChevronLeft size={22}/></button>
    <button onClick={()=>go(1)} aria-label="Next slide"><ChevronRight size={22}/></button>
   </div>
   <div className="slider-dots" role="tablist">
    {slides.map((s,i)=><button key={s.id} role="tab" aria-selected={i===index} aria-label={`Go to slide ${i+1}`} className={i===index?'active':''} onClick={()=>to(i)}>
     <span className="slider-dot-track"><span className="slider-dot-fill" style={{animationDuration:`${slide?.data.video?12:7}s`,animationPlayState:i===index&&!paused?'running':'paused'}}/></span>
    </button>)}
   </div>
  </>}
  <a className="scroll-hint" href="#discover"><ArrowDown size={18}/> SCROLL TO DISCOVER</a>
  <div className="hero-side">NATURE. HOSPITALITY. POSSIBILITY.</div>
 </section>;
}
