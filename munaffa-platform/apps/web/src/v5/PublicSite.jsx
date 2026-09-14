import React,{useEffect,useMemo,useRef,useState}from'react';
import gsap from'gsap';
import{ScrollTrigger}from'gsap/ScrollTrigger';
import Lenis from'lenis';
import{ArrowRight,ChefHat,ChevronDown,MapPin,Menu,PackageCheck,QrCode,Search,TrendingUp,UtensilsCrossed,X}from'lucide-react';
import SketchWorld from'./SketchWorld';
import{NAV_PRIMARY,ROUTES}from'./worlds';

gsap.registerPlugin(ScrollTrigger);
const clamp=v=>Math.max(0,Math.min(1,v));
export const go=r=>{location.hash=r;scrollTo({top:0,behavior:'instant'})};

function useRouteMotion(route){
 useEffect(()=>{
  let lenis,raf;
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&innerWidth>860){
   lenis=new Lenis({duration:1.0,wheelMultiplier:.9,smoothWheel:true});
   const loop=t=>{lenis.raf(t);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  }
  const ctx=gsap.context(()=>{
   gsap.utils.toArray('.m5-reveal-line').forEach(line=>{
    const words=line.querySelectorAll('span');
    gsap.fromTo(words,{yPercent:115,rotateX:-16,opacity:0},{yPercent:0,rotateX:0,opacity:1,stagger:.035,ease:'none',scrollTrigger:{trigger:line,start:'top 93%',end:'top 58%',scrub:true}})
   });
   gsap.utils.toArray('.m5-copy').forEach((el,i)=>gsap.fromTo(el,{x:i%2?56:-56,opacity:.15},{x:0,opacity:1,ease:'none',scrollTrigger:{trigger:el,start:'top 84%',end:'top 52%',scrub:true}}));
   gsap.to('.m5-kinetic-track',{xPercent:-38,ease:'none',scrollTrigger:{trigger:'.m5-kinetic',start:'top bottom',end:'bottom top',scrub:true}});
  });
  return()=>{ctx.revert();cancelAnimationFrame(raf);lenis?.destroy();ScrollTrigger.getAll().forEach(x=>x.kill())}
 },[route]);
}
function Words({children,className=''}){return <span className={'m5-reveal-line '+className}>{String(children).split(' ').map((w,i)=><span key={i}>{w}&nbsp;</span>)}</span>}

function useSceneTracker(sceneCount){
 const[active,setActive]=useState(0),[local,setLocal]=useState(0);const raf=useRef(0);
 useEffect(()=>{
  const calc=()=>{raf.current=0;const els=[...document.querySelectorAll('[data-m5-scene]')];if(!els.length)return;let best=0,bestD=1e9,bestLocal=0;els.forEach((el,i)=>{const r=el.getBoundingClientRect(),center=r.top+r.height*.5,d=Math.abs(center-innerHeight*.5);if(d<bestD){bestD=d;best=i;bestLocal=clamp((innerHeight*.78-r.top)/(r.height+innerHeight*.55))}});setActive(Math.min(best,sceneCount-1));setLocal(bestLocal)};
  const on=()=>{if(!raf.current)raf.current=requestAnimationFrame(calc)};addEventListener('scroll',on,{passive:true});addEventListener('resize',on);calc();return()=>{removeEventListener('scroll',on);removeEventListener('resize',on);cancelAnimationFrame(raf.current)}
 },[sceneCount]);
 return{active,local};
}

function Nav({route,onMenu}){return <header className="m5-nav">
 <button className="m5-brand" onClick={()=>go('home')}><i>M</i><b>Munaffa</b></button>
 <nav>{['restaurants','cafes','hotels','profit','operations'].map(r=><button key={r} className={route===r?'active':''} onClick={()=>go(r)}>{ROUTES[r].label}</button>)}</nav>
 <div><button className="m5-sign" onClick={()=>location.href='/app.html#login'}>Sign in</button><button className="m5-start" onClick={()=>location.href='/app.html#login'}>Get started <ArrowRight/></button><button className="m5-menu-btn" onClick={onMenu}><Menu/></button></div>
 </header>}

function MenuOverlay({open,onClose,route}){return <div className={'m5-menu-overlay '+(open?'open':'')}>
 <button className="m5-menu-close" onClick={onClose}><X/></button>
 <aside><small>MUNAFFA</small><h2>One restaurant.<br/>One operational truth.</h2><p>Choose a chapter. Every route uses a different physical environment and a different product story.</p><button onClick={()=>location.href='/app.html#app/owner'}>Open owner demo <ArrowRight/></button></aside>
 <nav>{NAV_PRIMARY.map((r,i)=><button key={r} className={route===r?'active':''} onClick={()=>{onClose();go(r)}}><small>{String(i+1).padStart(2,'0')}</small><span>{ROUTES[r].label}</span><em>↗</em></button>)}</nav>
 </div>}

function SceneDeck({route,scenes,active,local}){
 const visible=useMemo(()=>new Set([active,Math.min(active+1,scenes.length-1),Math.max(active-1,0)]),[active,scenes.length]);
 return <div className="m5-scene-deck">{scenes.map((s,i)=>visible.has(i)&&<SketchWorld key={`${route}-${i}-${s.model}`} modelKey={s.model} camera={s.camera} progress={i===active?local:i<active?1:0} active={i===active}/>)}</div>
}

function RouteSpecific({route,index}){
 if(route==='profit')return <div className="m5-live-data"><span><small>SELLING PRICE</small><b>₹449</b></span><i>−</i><span><small>INGREDIENTS</small><b>₹163</b></span><i>−</i><span><small>VARIABLE COST</small><b>₹34</b></span><i>=</i><span className="good"><small>CONTRIBUTION</small><b>₹252</b></span></div>;
 if(route==='operations')return <div className="m5-live-data"><span><small>TABLE 12</small><b>24m</b></span><i>→</i><span><small>KITCHEN</small><b>PREP</b></span><i>→</i><span><small>EXPO</small><b>2/3 READY</b></span></div>;
 if(route==='inventory')return <div className="m5-live-data"><span><small>PANEER</small><b>13.2kg</b></span><i>→</i><span><small>RUNOUT</small><b>2.9d</b></span><i>→</i><span className="warn"><small>ACTION</small><b>BUY 12kg</b></span></div>;
 if(route==='discover')return <div className="m5-discover-bar"><Search/><span>Nearby hospitality</span><button onClick={()=>location.href='/app.html#app/guest'}><MapPin/> Open consumer demo</button></div>;
 if(route==='restaurants')return <div className="m5-live-data"><span><small>DINING ROOM</small><b>27 / 38</b></span><i>→</i><span><small>KDS</small><b>12 PREP</b></span><i>→</i><span><small>LEAKAGE</small><b>₹4,820</b></span></div>;
 if(route==='cafes')return <div className="m5-live-data"><span><small>COUNTER</small><b>18 ORDERS</b></span><i>+</i><span><small>PICKUP</small><b>7 READY</b></span><i>+</i><span><small>REPEAT</small><b>31%</b></span></div>;
 if(route==='hotels')return <div className="m5-live-data"><span><small>DINING</small><b>₹1.84L</b></span><i>+</i><span><small>CAFÉ</small><b>₹74K</b></span><i>+</i><span><small>BANQUET</small><b>₹2.6L</b></span></div>;
 if(route==='pricing')return <div className="m5-plan-strip"><span>Launch <b>₹999</b></span><span>Growth <b>₹2,499</b></span><span>Profit <b>₹4,999</b></span></div>;
 return index===0?<div className="m5-flowline"><span>guest</span><i>→</i><span>table</span><i>→</i><span>kitchen</span><i>→</i><span>stock</span><i>→</i><span>money</span></div>:null;
}

export default function PublicSite({route='home'}){
 const page=ROUTES[route]||ROUTES.home,scenes=page.scenes;const{active,local}=useSceneTracker(scenes.length);const[menu,setMenu]=useState(false);
 useRouteMotion(route);
 return <main className={'m5-site m5-'+route} style={{'--accent':page.accent}}>
  <SceneDeck route={route} scenes={scenes} active={active} local={local}/><Nav route={route} onMenu={()=>setMenu(true)}/><MenuOverlay open={menu} onClose={()=>setMenu(false)} route={route}/>
  <div className="m5-progress"><span style={{height:`${((active+local)/scenes.length)*100}%`}}/><small>{String(active+1).padStart(2,'0')} / {String(scenes.length).padStart(2,'0')}</small></div>
  <div className="m5-story">
   <section className="m5-hero" data-m5-scene>
    <div className="m5-hero-copy"><p className="m5-eyebrow">{page.label.toUpperCase()} · REAL-TIME 3D STORY</p><h1><Words>{page.headline}</Words></h1><p className="m5-lead">{page.sub}</p><div className="m5-actions"><button onClick={()=>scrollTo({top:innerHeight*.9,behavior:'smooth'})}>Enter the story <ChevronDown/></button><button className="outline" onClick={()=>location.href='/app.html#app/owner'}>Open product demo <ArrowRight/></button></div></div>
    <RouteSpecific route={route} index={0}/>
   </section>
   {scenes.slice(1).map((scene,i)=><section className={'m5-chapter '+(i%2?'right':'left')} data-m5-scene key={`${route}-${i}`}>
    <article className="m5-copy"><p className="m5-kicker">{scene.kicker}</p><h2><Words>{scene.title}</Words></h2><p>{scene.copy}</p>{i===0&&<RouteSpecific route={route} index={i+1}/>}</article><strong className="m5-index">{String(i+2).padStart(2,'0')}</strong>
   </section>)}
   <section className="m5-kinetic"><div className="m5-kinetic-track">SERVICE → KITCHEN → STOCK → GUEST → MONEY → MUNAFFA → SERVICE → KITCHEN → STOCK → GUEST → MONEY → MUNAFFA</div></section>
   <section className="m5-final"><p className="m5-eyebrow">THE PROFIT & OPERATIONS OS</p><h2><Words>Know where every rupee goes.</Words></h2><p>Keep hospitality human. Make the operation measurable. Connect every order to the truth underneath it.</p><div className="m5-actions"><button onClick={()=>location.href='/app.html#login'}>Build your outlet <ArrowRight/></button><button className="outline" onClick={()=>go('profit')}>Explore Profit OS <TrendingUp/></button></div><small className="m5-legal">3D environments shown here are prototype reference scenes and are credited to their creators. They are not represented as Munaffa customers. Production launch assets should be owned or appropriately licensed.</small></section>
  </div>
 </main>
}
