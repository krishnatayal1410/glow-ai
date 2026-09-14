import React,{useEffect,useLayoutEffect,useMemo,useRef,useState}from'react';
import gsap from'gsap';
import{ScrollTrigger}from'gsap/ScrollTrigger';
import{ArrowRight,ChefHat,CircleDollarSign,Hotel,Menu,PackageCheck,Store,UtensilsCrossed,X,Zap}from'lucide-react';
import{activeOrder,metrics,rupees}from'@munaffa/core';
import{useRestaurant}from'../store';
import CinematicCanvas from'./CinematicCanvas';
import{routeStories,storyChapters}from'./story';

gsap.registerPlugin(ScrollTrigger);
const publicRoutes=[['story','Story',Store],['restaurants','Restaurants',UtensilsCrossed],['cafes','Cafés',Zap],['hotel-fb','Hotel F&B',Hotel],['qsr','QSR',ChefHat],['operations','Operations',ChefHat],['inventory','Inventory',PackageCheck],['profit','Profit OS',CircleDollarSign]];
const go=r=>{location.hash=r;scrollTo({top:0,behavior:'instant'})};

function useProgress(key){
 const[p,setP]=useState(0);useEffect(()=>{let raf=0;const read=()=>{raf=0;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);setP(Math.max(0,Math.min(1,scrollY/max)))};const on=()=>{if(!raf)raf=requestAnimationFrame(read)};addEventListener('scroll',on,{passive:true});addEventListener('resize',on);read();return()=>{removeEventListener('scroll',on);removeEventListener('resize',on);cancelAnimationFrame(raf)}},[key]);return p;
}
function useTextMotion(key){
 const scope=useRef(null);useLayoutEffect(()=>{const ctx=gsap.context(()=>{
  gsap.utils.toArray('.cine-copy').forEach((el)=>{const title=el.querySelector('h2'),body=el.querySelector('p'),eyebrow=el.querySelector('small');gsap.fromTo([eyebrow,title,body],{y:54,opacity:0},{y:0,opacity:1,stagger:.08,ease:'none',scrollTrigger:{trigger:el,start:'top 82%',end:'top 52%',scrub:true}})});
  gsap.utils.toArray('.cine-word').forEach(el=>gsap.fromTo(el,{yPercent:110,rotateX:-12},{yPercent:0,rotateX:0,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top 88%',end:'top 54%',scrub:true}}));
 },scope);return()=>ctx.revert()},[key]);return scope;
}

function AnimatedTitle({children}){return <span className="cine-mask">{String(children).split(' ').map((w,i)=><span className="cine-word" key={i}>{w}&nbsp;</span>)}</span>}
function Nav({route}){const[open,setOpen]=useState(false);return <><header className="cine-nav"><button className="cine-brand" onClick={()=>go('story')}><i>M</i><b>Munaffa</b></button><nav>{publicRoutes.slice(1,6).map(([r,label])=><button className={route===r?'active':''} onClick={()=>go(r)} key={r}>{label}</button>)}</nav><div><button className="signin" onClick={()=>go('app/owner')}>Product demo</button><button className="start" onClick={()=>go('app/guest')}>Start at Table 12 <ArrowRight/></button><button className="menu" onClick={()=>setOpen(true)}><Menu/></button></div></header><div className={'cine-menu '+(open?'open':'')}><button className="close" onClick={()=>setOpen(false)}><X/></button><aside><small>MUNAFFA</small><h2>Hospitality in front.<br/>Operational truth underneath.</h2><p>Each chapter uses a different environment because restaurants, cafés, hotels and QSRs do not operate the same way.</p></aside><nav>{publicRoutes.map(([r,label,I],i)=><button key={r} onClick={()=>{setOpen(false);go(r)}}><small>{String(i+1).padStart(2,'0')}</small><I/><span>{label}</span><em>↗</em></button>)}</nav></div></>}

function LiveEvidence({route,index}){
 const state=useRestaurant(s=>s.state),m=metrics(state),order=activeOrder(state);const paneer=state.ingredients.paneer;
 if(route==='story'&&index===1)return <div className="cine-evidence"><span><small>TABLE</small><b>T12</b></span><span><small>ORDER</small><b>{order?.id||'not placed'}</b></span><button onClick={()=>go('app/guest')}>{order?'Open guest view':'Place the order'} <ArrowRight/></button></div>;
 if(route==='story'&&index===3)return <div className="cine-evidence"><span><small>KITCHEN</small><b>{order?.items.filter(x=>x.status==='preparing').length||0} preparing</b></span><span><small>PANEER</small><b>{(paneer.qty/1000).toFixed(2)}kg</b></span><button onClick={()=>go('app/kitchen')}>Open KDS <ArrowRight/></button></div>;
 if(route==='story'&&index>=5)return <div className="cine-evidence"><span><small>SALES</small><b>{rupees(m.revenue)}</b></span><span><small>CONTRIBUTION</small><b>{rupees(m.contribution)}</b></span><span><small>LEAKAGE</small><b>{rupees(m.potentialLeakage)}</b></span><button onClick={()=>go('app/owner')}>Owner view <ArrowRight/></button></div>;
 if(route==='operations')return <div className="cine-evidence"><span><small>TABLE 12</small><b>{state.tables.T12.status}</b></span><span><small>ORDER</small><b>{order?.status||'none'}</b></span><button onClick={()=>go('app/manager')}>Live outlet <ArrowRight/></button></div>;
 if(route==='inventory')return <div className="cine-evidence"><span><small>PANEER</small><b>{(paneer.qty/1000).toFixed(2)}kg</b></span><span><small>MOVEMENTS</small><b>{state.stockMovements.length}</b></span><button onClick={()=>go('app/stock')}>Open ledger <ArrowRight/></button></div>;
 if(route==='profit')return <div className="cine-evidence"><span><small>SALES</small><b>{rupees(m.revenue)}</b></span><span><small>FOOD COST</small><b>{m.foodCostPct.toFixed(1)}%</b></span><span><small>CONTRIBUTION</small><b>{rupees(m.contribution)}</b></span><button onClick={()=>go('app/owner')}>See evidence <ArrowRight/></button></div>;
 return null;
}

function Intro({route,chapters}){const first=chapters[0];const copy={story:['RESTAURANT PROFIT & OPERATIONS OS','One order. One restaurant. One truth.','Scroll through one real service journey. Then open any role and change the same restaurant state.'],restaurants:['FOR RESTAURANTS','Built around the dining room, not around software.','Tables, service, kitchen, stock and margin stay connected without forcing staff into one oversized dashboard.'],cafes:['FOR CAFÉS','Speed without losing the guest.','Counter, pickup, table service, direct ordering and repeat visits share one operational memory.'],'hotel-fb':['FOR HOTEL F&B','One operating truth across every outlet.','Dining, café, bar and banquet keep their identity while food-and-beverage economics roll up cleanly.'],qsr:['FOR QSR','Throughput without operational blindness.','Counter, pickup, kitchen and stock move fast without losing traceability.'],operations:['OPERATIONS','Service and kitchen move as one.','The order state the guest creates becomes the production state the kitchen executes.'],inventory:['INVENTORY','Stock should move for a reason.','Every deduction, purchase and wastage entry leaves an explainable movement behind.'],profit:['PROFIT OS','Know where every rupee goes.','Contribution is calculated from the same operational events that created the sale.']}[route];return <section className="cine-intro"><div><small>{copy[0]}</small><h1><AnimatedTitle>{copy[1]}</AnimatedTitle></h1><p>{copy[2]}</p><div className="cine-actions"><button onClick={()=>scrollTo({top:innerHeight*.95,behavior:'smooth'})}>Enter the story <ArrowRight/></button><button className="secondary" onClick={()=>go('app/guest')}>Run Table 12 demo</button></div></div><LiveEvidence route={route} index={0}/><span className="scrollmark">SCROLL ↓</span></section>}

export default function CinematicSite({route}){
 const chapters=useMemo(()=>route==='story'?storyChapters:(routeStories[route]||storyChapters),[route]),progress=useProgress(route),scope=useTextMotion(route);
 return <div className={'cine-site route-'+route} ref={scope}><CinematicCanvas chapters={chapters} progress={progress}/><Nav route={route}/><div className="cine-gradient"/><main className="cine-story"><Intro route={route} chapters={chapters}/>{chapters.slice(1).map((chapter,i)=><section className={'cine-chapter '+(i%2?'right':'left')} key={chapter.id}><article className="cine-copy"><small>{chapter.eyebrow}</small><h2><AnimatedTitle>{chapter.title}</AnimatedTitle></h2><p>{chapter.body}</p><LiveEvidence route={route} index={i+1}/></article><strong className="chapter-num">{String(i+2).padStart(2,'0')}</strong></section>)}<section className="cine-close"><small>ONE RESTAURANT STATE</small><h2><AnimatedTitle>Know where every rupee goes.</AnimatedTitle></h2><p>Run the Table 12 flow yourself. Place the order, move it through kitchen, settle the bill, log waste, then watch the owner view recompute from the same events.</p><div className="cine-actions"><button onClick={()=>go('app/guest')}>Start with the guest <ArrowRight/></button><button className="secondary" onClick={()=>go('app/owner')}>Open Owner Command Center</button></div></section></main></div>
}
