import React,{Suspense,useEffect,useMemo,useRef,useState}from'react';
import{Canvas,useFrame,useThree}from'@react-three/fiber';
import{Preload,useTexture}from'@react-three/drei';
import{EffectComposer,Noise,Vignette}from'@react-three/postprocessing';
import*as THREE from'three';
import gsap from'gsap';
import{ScrollTrigger}from'gsap/ScrollTrigger';
import Lenis from'lenis';
import{ArrowRight,BarChart3,ChefHat,ChevronDown,MapPin,Menu,PackageCheck,QrCode,Search,ShieldCheck,Sparkles,X}from'lucide-react';
import{go}from'../App';
import'../cinematic.css';

gsap.registerPlugin(ScrollTrigger);

const pages={
 home:{eyebrow:'RESTAURANT PROFIT OS',title:'Hospitality in the front. Intelligence underneath.',body:'Munaffa connects discovery, tables, kitchen, stock, payment and profit without turning your restaurant into a machine.',accent:'#d9ff92'},
 platform:{eyebrow:'ONE CONNECTED RESTAURANT',title:'One service journey. One operational truth.',body:'Customer, waiter, kitchen, stock, supplier and owner work from the same live restaurant state.',accent:'#ffd399'},
 profit:{eyebrow:'PROFIT OS',title:'See where every rupee actually goes.',body:'Sales separate into ingredients, waste, discounts, fees and contribution. Every alert keeps its evidence attached.',accent:'#d9ff92'},
 operations:{eyebrow:'LIVE OPERATIONS',title:'The dining room becomes a living system.',body:'Tables, KDS, waiter requests, approvals and service timing stay synchronized without slowing staff down.',accent:'#9ee8ff'},
 inventory:{eyebrow:'INVENTORY INTELLIGENCE',title:'From delivery crate to plated dish.',body:'Recipe theory meets counts, receiving, waste and purchasing so the numbers reflect a real kitchen, not an imaginary one.',accent:'#ffd08a'},
 guest:{eyebrow:'GUEST EXPERIENCE',title:'Digital when it helps. Human when it matters.',body:'Discover, book, browse, scan, order, call a waiter or pay. QR is an option, never a prison.',accent:'#ffb19e'},
 ai:{eyebrow:'MUNAFFA INTELLIGENCE',title:'AI that shows its working.',body:'Forecast demand, explain variance, surface churn risk and recommend actions without hiding uncertainty.',accent:'#c7b8ff'},
 discovery:{eyebrow:'DISCOVERY',title:'Find great places without breaking the restaurant relationship.',body:'Restaurants, cafés and hotel dining can be discovered, booked and ordered from directly in one experience.',accent:'#9af0d2'},
 pricing:{eyebrow:'PRICING',title:'Software should earn its seat at the table.',body:'Start small, measure operational impact, then expand only when Munaffa is creating value.',accent:'#d9ff92'},
 about:{eyebrow:'WHY MUNAFFA',title:'Better margins. Better hospitality. Both.',body:'Built for the messy reality of restaurants: approximate recipes, rush hours, staff handoffs, changing supplier prices and human guests.',accent:'#ead1a7'}
};

const photographs=[
 {id:'arrival',title:'Arrival',image:'https://images.unsplash.com/photo-1668543773511-209c687e4361?auto=format&fit=crop&fm=jpg&q=88&w=2400',credit:'Le Salama Marrakech · Unsplash',source:'https://unsplash.com/photos/uPSRGpkqxIw'},
 {id:'cafe',title:'Discovery',image:'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2400&q=88',credit:'Hospitality photography · Unsplash',source:'https://unsplash.com'},
 {id:'hotel',title:'Table',image:'https://images.unsplash.com/photo-1768397003905-a202ea6325f5?auto=format&fit=crop&fm=jpg&q=88&w=2400',credit:'Andy Wang · Unsplash',source:'https://unsplash.com/photos/DKxbjOa4hd0'},
 {id:'kitchen',title:'Kitchen',image:'https://images.unsplash.com/photo-1764408182167-043042cb086e?auto=format&fit=crop&fm=jpg&q=88&w=2400',credit:'Huy Phan · Unsplash',source:'https://unsplash.com/photos/sQg28nQnCTA'},
 {id:'ingredients',title:'Ingredients',image:'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2400&q=88',credit:'Food market photography · Unsplash',source:'https://unsplash.com'},
 {id:'dish',title:'Dish economics',image:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2400&q=88',credit:'Fine dining photography · Unsplash',source:'https://unsplash.com'},
 {id:'service',title:'Service',image:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=88',credit:'Restaurant photography · Unsplash',source:'https://unsplash.com'},
 {id:'coffee',title:'Repeat',image:'https://images.unsplash.com/photo-1770739538932-433941c1267e?auto=format&fit=crop&fm=jpg&q=88&w=2400',credit:'clement proust · Unsplash',source:'https://unsplash.com/photos/nD2kZmE6dMQ'}
];

const chapterCopy=[
 {n:'01',tag:'DISCOVER',title:'Start with a real place, not a dashboard.',body:'A guest discovers a restaurant, café or hotel dining room and sees the actual atmosphere before opening the menu.',ui:'discover'},
 {n:'02',tag:'THE TABLE',title:'The digital layer disappears into service.',body:'Booking, waiter service, optional QR ordering and direct payments all become one table session.',ui:'table'},
 {n:'03',tag:'THE KITCHEN',title:'The order enters a working kitchen.',body:'Tickets route by station, timers reflect actual preparation and the waiter sees readiness without shouting across the floor.',ui:'kitchen'},
 {n:'04',tag:'THE INGREDIENTS',title:'Every plate has a cost trail.',body:'Recipe assumptions, batch yields and actual stock movement connect the dish back to ingredient economics.',ui:'recipe'},
 {n:'05',tag:'THE STOCK',title:'Reality wins over perfect spreadsheets.',body:'Receiving, physical counts, wastage and supplier changes explain where theoretical stock diverges from actual stock.',ui:'stock'},
 {n:'06',tag:'THE MARGIN',title:'Revenue becomes a transparent money story.',body:'Munaffa separates recorded cost, calculated contribution and estimated leakage instead of calling everything “profit”.',ui:'profit'},
 {n:'07',tag:'THE OWNER',title:'Decisions, not dashboard clutter.',body:'The owner sees what changed, the rupee impact, confidence level and the next best action.',ui:'owner'},
 {n:'08',tag:'THE LOOP',title:'A better visit becomes a better business.',body:'Guest feedback, repeat visits, demand, purchasing and menu decisions improve together over time.',ui:'loop'}
];

const routeOrder={
 home:[0,1,2,3,4,5,6,7],platform:[6,2,3,4,5,0,1,7],profit:[5,3,4,6,2,0,1,7],operations:[6,2,3,1,4,5,0,7],inventory:[4,3,5,2,6,0,1,7],guest:[0,1,6,2,7,5,3,4],ai:[5,4,3,6,2,7,0,1],discovery:[0,1,7,6,2,3,4,5],pricing:[6,5,0,1,2,3,4,7],about:[0,3,6,1,2,4,5,7]
};

const clamp=v=>Math.max(0,Math.min(1,v));

function useScrollProgress(){
 const[p,setP]=useState(0);
 useEffect(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis,raf;
  if(!reduce&&innerWidth>900){
   lenis=new Lenis({duration:1.05,wheelMultiplier:.86,smoothWheel:true});
   const loop=t=>{lenis.raf(t);raf=requestAnimationFrame(loop)};
   raf=requestAnimationFrame(loop);
  }
  return()=>{cancelAnimationFrame(raf);lenis?.destroy()};
 },[]);
 useEffect(()=>{
  let frame=0;
  const update=()=>{
   if(frame)return;
   frame=requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;setP(max?scrollY/max:0);frame=0});
  };
  addEventListener('scroll',update,{passive:true});update();
  return()=>{removeEventListener('scroll',update);cancelAnimationFrame(frame)};
 },[]);
 return p;
}

function useCinematicMotion(key){
 useEffect(()=>{
  const ctx=gsap.context(()=>{
   gsap.utils.toArray('.cinematic-reveal').forEach(el=>gsap.fromTo(el,{yPercent:115,rotateX:-18,opacity:0,filter:'blur(14px)'},{yPercent:0,rotateX:0,opacity:1,filter:'blur(0px)',ease:'none',scrollTrigger:{trigger:el,start:'top 94%',end:'top 58%',scrub:true}}));
   gsap.utils.toArray('.scene-copy').forEach((el,i)=>gsap.fromTo(el,{x:i%2?90:-90,opacity:.08},{x:0,opacity:1,ease:'none',scrollTrigger:{trigger:el,start:'top 82%',end:'top 48%',scrub:true}}));
   gsap.utils.toArray('.spatial-ui').forEach(el=>gsap.fromTo(el,{y:70,scale:.92,opacity:0},{y:0,scale:1,opacity:1,ease:'none',scrollTrigger:{trigger:el.closest('.cinematic-section'),start:'top 66%',end:'center 54%',scrub:true}}));
   gsap.to('.marquee-track',{xPercent:-48,ease:'none',scrollTrigger:{trigger:'.cinematic-marquee',start:'top bottom',end:'bottom top',scrub:true}});
  });
  return()=>ctx.revert();
 },[key]);
}

const vertexShader=`uniform float uWarp;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;float bowl=sin(uv.x*3.1415926)*sin(uv.y*3.1415926);p.z+=bowl*uWarp*1.35;p.x+=(uv.y-.5)*uWarp*.16;p.y+=(uv.x-.5)*uWarp*.07;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`;
const fragmentShader=`uniform sampler2D uMap;uniform vec2 uImage;uniform float uOpacity;uniform float uShade;varying vec2 vUv;void main(){float planeAspect=1.7777778;float imageAspect=uImage.x/max(uImage.y,1.0);vec2 uv=vUv;if(imageAspect>planeAspect){float s=planeAspect/imageAspect;uv.x=(uv.x-.5)*s+.5;}else{float s=imageAspect/planeAspect;uv.y=(uv.y-.5)*s+.5;}vec4 c=texture2D(uMap,uv);float edge=smoothstep(.9,.18,distance(vUv,vec2(.5)));c.rgb*=mix(.62,1.0,edge);c.rgb*=1.0-uShade;gl_FragColor=vec4(c.rgb,uOpacity);}`;

function PhotoScene({scene,z,index}){
 const texture=useTexture(scene.image);const material=useRef();const{camera}=useThree();
 useEffect(()=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;texture.needsUpdate=true},[texture]);
 const uniforms=useMemo(()=>({uMap:{value:texture},uImage:{value:new THREE.Vector2(texture.image?.width||1920,texture.image?.height||1080)},uOpacity:{value:0},uWarp:{value:0},uShade:{value:.04}}),[texture]);
 useFrame((state,dt)=>{
  if(!material.current)return;
  const d=camera.position.z-z;const target=clamp(1-Math.abs(d-7)/17);
  material.current.uniforms.uOpacity.value=THREE.MathUtils.damp(material.current.uniforms.uOpacity.value,target,6,dt);
  material.current.uniforms.uWarp.value=THREE.MathUtils.damp(material.current.uniforms.uWarp.value,Math.max(0,1-Math.abs(d-6)/13)*.75,4,dt);
  material.current.uniforms.uShade.value=THREE.MathUtils.damp(material.current.uniforms.uShade.value,index===0?.02:.06,4,dt);
 });
 return <mesh position={[index%2===0?-.28:.28,0,z]} rotation={[0,index%2===0?.016:-.016,0]} frustumCulled={false}><planeGeometry args={[18.4,10.35,72,42]}/><shaderMaterial ref={material} transparent depthWrite={false} side={THREE.DoubleSide} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader}/></mesh>;
}

function CameraRig({progress,count}){
 const{camera,pointer}=useThree();
 useFrame((state,dt)=>{
  const distance=16,max=(count-1)*distance,z=9-progress*(max+8),stage=progress*(count-1),wave=Math.sin(stage*Math.PI*.72),x=wave*.56+pointer.x*.18,y=1.05+Math.sin(stage*1.15)*.24-pointer.y*.1;
  camera.position.x=THREE.MathUtils.damp(camera.position.x,x,4.6,dt);camera.position.y=THREE.MathUtils.damp(camera.position.y,y,4.6,dt);camera.position.z=THREE.MathUtils.damp(camera.position.z,z,5.2,dt);camera.lookAt(x*.12,.12,z-10);
 });return null;
}

function PhotoWorld({progress,order}){
 const scenes=order.map(i=>photographs[i]);
 return <Canvas className="cinematic-canvas" camera={{position:[0,1,9],fov:48,near:.1,far:220}} dpr={[1,1.35]} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}><color attach="background" args={['#070806']}/><CameraRig progress={progress} count={scenes.length}/><Suspense fallback={null}>{scenes.map((scene,i)=><PhotoScene key={`${scene.id}-${i}`} scene={scene} index={i} z={-i*16}/>)}</Suspense><EffectComposer multisampling={0}><Noise opacity={.025}/><Vignette eskil={false} offset={.18} darkness={.72}/></EffectComposer><Preload all/></Canvas>;
}

function SpatialUI({type}){
 if(type==='discover')return <div className="spatial-ui discovery-glass"><div className="ui-kicker"><Search/> NEAR YOU</div><strong>Tonight, without the aggregator wall.</strong><div className="venue-mini"><span>Fine dining</span><b>4.9 ★</b><em>12 min</em></div><div className="venue-mini"><span>Specialty café</span><b>4.8 ★</b><em>7 min</em></div><div className="venue-mini"><span>Hotel dining</span><b>4.7 ★</b><em>Book</em></div></div>;
 if(type==='table')return <div className="spatial-ui table-session"><div className="ui-kicker"><QrCode/> TABLE 12</div><strong>One table. Any service style.</strong><div className="service-choice"><span>Waiter</span><span>QR</span><span>POS</span><span>Pay</span></div><small>QR optional · no forced login to browse</small></div>;
 if(type==='kitchen')return <div className="spatial-ui kitchen-ticket"><div className="ui-kicker"><ChefHat/> KITCHEN LIVE</div><div className="ticket-line"><b>T12</b><span>04:18</span></div><p>2 × Paneer Tikka <em>TANDOOR</em></p><p>1 × Butter Chicken <em>CURRY</em></p><div className="ticket-status">PREPARING</div></div>;
 if(type==='recipe')return <div className="spatial-ui recipe-stack"><div className="ui-kicker"><Sparkles/> DISH COST</div><strong>Paneer Tikka · ₹349</strong><div><span>Ideal ingredients</span><b>₹112</b></div><div><span>Packaging / variable</span><b>₹8</b></div><div><span>Contribution</span><b>₹229</b></div><small>Calculated · recipe confidence 86%</small></div>;
 if(type==='stock')return <div className="spatial-ui stock-ledger"><div className="ui-kicker"><PackageCheck/> STOCK REALITY</div><strong>Ideal 11.4 kg → Actual 13.8 kg</strong><div className="ledger-flow"><span>Received +15kg</span><span>Recipes −11.4kg</span><span>Waste −0.7kg</span><span>Count correction −2.1kg</span></div><b>Variance impact ₹816</b></div>;
 if(type==='profit')return <div className="spatial-ui profit-stream"><div className="ui-kicker"><BarChart3/> MONEY FLOW</div><strong>₹92,480 sales</strong><div className="money-row"><span>Ingredients</span><i style={{'--w':'72%'}}/><b>₹29,410</b></div><div className="money-row"><span>Waste</span><i style={{'--w':'26%'}}/><b>₹1,480</b></div><div className="money-row"><span>Discounts</span><i style={{'--w':'34%'}}/><b>₹2,120</b></div><div className="money-row healthy"><span>Contribution</span><i style={{'--w':'88%'}}/><b>₹56,320</b></div></div>;
 if(type==='owner')return <div className="spatial-ui owner-brief"><div className="ui-kicker"><ShieldCheck/> OWNER BRIEF</div><strong>3 things deserve attention.</strong><button>Ingredient variance <b>₹1,820</b></button><button>Supplier increase <b>₹620</b></button><button>Table 17 delay <b>8 min</b></button><small>Evidence first. Recommendation second.</small></div>;
 return <div className="spatial-ui loyalty-loop"><div className="ui-kicker"><Sparkles/> GROWTH LOOP</div><strong>Visit → feedback → repeat → better forecast.</strong><div className="loop-metrics"><span><b>+14%</b> repeat guests</span><span><b>−9%</b> waste</span><span><b>+6%</b> contribution</span></div></div>;
}

function FullMenu({open,onClose,onHover}){
 const links=[['01','Platform','platform'],['02','Profit OS','profit'],['03','Operations','operations'],['04','Inventory','inventory'],['05','Guest experience','guest'],['06','AI intelligence','ai'],['07','Discover','discovery'],['08','Pricing','pricing'],['09','About','about']];
 return <div className={open?'photo-menu open':'photo-menu'}><button className="menu-close" onClick={onClose}><X/></button><div className="menu-manifesto"><p className="eyebrow">MUNAFFA</p><h2>The restaurant is the interface.</h2><p>Move from guest experience to operations to money without leaving the same connected system.</p><button className="primary" onClick={()=>go('signup')}>Build your restaurant <ArrowRight/></button></div><nav>{links.map(([n,label,route])=><button key={route} onMouseEnter={()=>onHover(route)} onClick={()=>{go(route);onClose()}}><small>{n}</small><span>{label}</span><ArrowRight/></button>)}</nav></div>;
}

export default function ImmersiveMarketing(){
 const hash=(location.hash||'#home').slice(1).split('/')[0]||'home';const key=pages[hash]?hash:'home';const page=pages[key];const progress=useScrollProgress();const[menuOpen,setMenuOpen]=useState(false);const[,setHover]=useState(null);useCinematicMotion(key);const order=routeOrder[key]||routeOrder.home;const active=Math.min(7,Math.floor(progress*8));
 return <div className="marketing cinematic-marketing" style={{'--accent':page.accent}}><div className="cinematic-world"><PhotoWorld progress={progress} order={order}/><div className="film-grade"/><div className="world-shadow"/></div><header className="site-nav cinematic-nav"><button className="brand-button" onClick={()=>go('home')}><b>M</b><strong>Munaffa</strong></button><nav><button onClick={()=>go('platform')}>Platform</button><button onClick={()=>go('profit')}>Profit</button><button onClick={()=>go('operations')}>Operations</button><button onClick={()=>go('inventory')}>Inventory</button><button onClick={()=>go('discovery')}>Discover</button><button onClick={()=>go('pricing')}>Pricing</button></nav><div><button className="nav-sign" onClick={()=>go('auth')}>Sign in</button><button className="nav-cta" onClick={()=>go('signup')}>Get started</button><button className="round-menu" onClick={()=>setMenuOpen(true)}><Menu/></button></div></header><main className="cinematic-story"><section className="cinematic-hero"><div className="hero-copy cinematic-hero-copy"><p className="eyebrow">{page.eyebrow}</p><div className="headline-mask"><h1 className="cinematic-reveal">{page.title}</h1></div><p className="lead">{page.body}</p><div className="hero-actions"><button className="primary" onClick={()=>go('signup')}>Start with Munaffa <ArrowRight/></button><button className="secondary" onClick={()=>go('consumer')}>Explore as a guest <MapPin/></button></div><div className="hero-proof"><span><b>One shared state</b>Guest → kitchen → stock → owner</span><span><b>QR optional</b>Hospitality stays human</span><span><b>Evidence labelled</b>Recorded · calculated · estimated</span></div></div><div className="scroll-cue"><span>SCROLL THROUGH THE RESTAURANT</span><ChevronDown/></div></section>{chapterCopy.map((chapter,i)=><section className={`cinematic-section ${i%2?'right':'left'}`} key={chapter.n} data-scene={i}><div className="scene-copy"><p className="scene-index">{chapter.n} / 08</p><p className="eyebrow">{chapter.tag}</p><div className="headline-mask"><h2 className="cinematic-reveal">{chapter.title}</h2></div><p>{chapter.body}</p></div><SpatialUI type={chapter.ui}/></section>)}<section className="cinematic-marquee"><div className="marquee-track">NO FLOATING CUBES · REAL HOSPITALITY · REAL SERVICE FLOWS · REAL COST LOGIC · REAL GUESTS · REAL OPERATIONS · </div></section><section className="cinematic-final"><p className="eyebrow">FROM FIRST VISIT TO BOTTOM LINE</p><div className="headline-mask"><h2 className="cinematic-reveal">Run the restaurant people love. Understand the business underneath it.</h2></div><p>Use Munaffa as a guest, owner, manager, cashier, waiter, kitchen team, stock operator or platform administrator — all connected to the same restaurant state.</p><div className="hero-actions"><button className="primary" onClick={()=>go('signup')}>Create your workspace <ArrowRight/></button><button className="secondary" onClick={()=>go('consumer')}>Find a place <Search/></button></div></section><footer className="cinematic-footer"><div><strong>Munaffa</strong><span>The Profit OS for Restaurants</span></div><p>Demo venue names are fictional. Hospitality photography is used as visual reference under the respective Unsplash licenses; no partnership with photographed venues is implied.</p></footer></main><button className="cinematic-progress" aria-label="scroll progress"><small>{String(active+1).padStart(2,'0')}</small><span style={{height:`${Math.max(3,progress*100)}%`}}/></button><FullMenu open={menuOpen} onClose={()=>setMenuOpen(false)} onHover={setHover}/></div>;
}
