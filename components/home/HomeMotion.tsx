'use client';
import {useEffect} from 'react';

// Homepage-only scroll choreography. Everything renders complete without it (reduced motion, no JS),
// so each effect only enhances markup that is already readable.
export default function HomeMotion(){
 useEffect(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ctx:{revert:()=>void}|undefined,cancelled=false;
  // Phase switching is useful even without animation, so it does not depend on GSAP.
  const stops=[...document.querySelectorAll<HTMLElement>('.hp-stop')],frames=[...document.querySelectorAll<HTMLElement>('.hp-frame')];
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const i=Number((e.target as HTMLElement).dataset.index);stops.forEach((s,k)=>s.classList.toggle('is-active',k===i));frames.forEach((f,k)=>f.classList.toggle('is-active',k===i));}),{rootMargin:'-45% 0px -45% 0px'});
  stops.forEach(s=>io.observe(s));
  const counters=[...document.querySelectorAll<HTMLElement>('[data-count]')];
  const cio=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target as HTMLElement,to=Number(el.dataset.count),pad=el.dataset.pad?Number(el.dataset.pad):0,suffix=el.dataset.suffix||'';if(reduce){el.textContent=String(to).padStart(pad,'0')+suffix;return;}const start=performance.now(),dur=1600;const tick=(t:number)=>{const p=Math.min(1,(t-start)/dur),v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=String(v).padStart(pad,'0')+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);}),{threshold:.6});
  counters.forEach(c=>cio.observe(c));
  if(!reduce)Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
   if(cancelled)return;gsap.registerPlugin(ScrollTrigger);
   ctx=gsap.context(()=>{
    // Manifesto: words brighten as the paragraph scrolls through the viewport.
    gsap.utils.toArray<HTMLElement>('.hm-words').forEach(block=>{gsap.fromTo(block.querySelectorAll('.hm-w'),{opacity:.14},{opacity:1,stagger:.08,ease:'none',scrollTrigger:{trigger:block,start:'top 80%',end:'bottom 45%',scrub:.5}})});
    // Images unveil from the bottom edge.
    gsap.utils.toArray<HTMLElement>('.hm-clip').forEach(el=>{gsap.fromTo(el,{clipPath:'inset(18% 0% 0% 0%)',opacity:.4},{clipPath:'inset(0% 0% 0% 0%)',opacity:1,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}})});
    gsap.utils.toArray<HTMLElement>('[data-speed]').forEach(el=>{const s=Number(el.dataset.speed)||0;gsap.fromTo(el,{yPercent:-s},{yPercent:s,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true}})});
    gsap.utils.toArray<HTMLElement>('.hm-rise').forEach(el=>{gsap.from(el.children,{y:40,opacity:0,duration:1,stagger:.09,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',once:true}})});
    gsap.utils.toArray<HTMLElement>('.hg-line').forEach(el=>{gsap.fromTo(el,{scaleX:0},{scaleX:1,duration:1.2,ease:'power3.inOut',scrollTrigger:{trigger:el,start:'top 90%',once:true}})});
    // Experiences: vertical scroll drives a horizontal gallery on wide screens.
    const mm=gsap.matchMedia();
    mm.add('(min-width: 1000px)',()=>{
     const track=document.querySelector<HTMLElement>('.he-track'),pin=document.querySelector<HTMLElement>('.he');
     if(!track||!pin)return;
     const distance=()=>Math.max(0,track.scrollWidth-window.innerWidth+parseFloat(getComputedStyle(track).paddingLeft));
     const tween=gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:pin,start:'top top',end:()=>`+=${distance()}`,pin:true,scrub:.6,invalidateOnRefresh:true,anticipatePin:1,onUpdate:self=>{const bar=document.querySelector<HTMLElement>('.he-progress span');if(bar)bar.style.transform=`scaleX(${self.progress})`;}}});
     gsap.utils.toArray<HTMLElement>('.he-card img').forEach(img=>{gsap.fromTo(img,{xPercent:-8},{xPercent:8,ease:'none',scrollTrigger:{trigger:img.closest('.he-card'),containerAnimation:tween,start:'left right',end:'right left',scrub:true}})});
    });
   });
   requestAnimationFrame(()=>ScrollTrigger.refresh());
  });
  return()=>{cancelled=true;io.disconnect();cio.disconnect();ctx?.revert();};
 },[]);
 return null;
}
