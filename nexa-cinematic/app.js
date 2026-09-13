import * as THREE from 'three';

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=THREE.MathUtils.lerp;
const smooth=t=>t*t*(3-2*t);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse=matchMedia('(pointer:coarse)').matches;
const cores=navigator.hardwareConcurrency||4;
const memory=navigator.deviceMemory||4;
const lowPower=coarse||cores<=4||memory<=4||innerWidth<760;
const gsap=window.gsap, ScrollTrigger=window.ScrollTrigger;
if(gsap&&ScrollTrigger)gsap.registerPlugin(ScrollTrigger);

const quality={low:lowPower,label:lowPower?'Balanced 30':'Adaptive 45',fps:lowPower?30:45,dprCap:lowPower?1:1.25,particles:lowPower?70:170,segments:lowPower?28:44};
$('#qualityBadge').textContent=quality.label;

/* Smooth scrolling is desktop-only. Native scrolling is intentionally kept on touch devices. */
let lenis=null;
if(!reduce&&!coarse&&window.Lenis&&gsap){
  lenis=new window.Lenis({duration:.82,smoothWheel:true,wheelMultiplier:.9});
  lenis.on('scroll',()=>ScrollTrigger?.update());
  gsap.ticker.add(t=>lenis.raf(t*1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=$(a.getAttribute('href'));if(el){e.preventDefault();lenis.scrollTo(el,{offset:-18,duration:.75});}}));
}

const preloader=$('#preloader'), preloaderBar=$('#preloaderBar'), preloaderText=$('#preloaderText');
function loadStep(p,text){if(preloaderBar)preloaderBar.style.width=`${p}%`;if(preloaderText)preloaderText.textContent=text}
loadStep(28,'Building audio system');

const canvas=$('#nexa-canvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:!lowPower,powerPreference:'high-performance',alpha:false});
let pixelRatio=Math.min(devicePixelRatio||1,quality.dprCap);
renderer.setPixelRatio(pixelRatio);renderer.setSize(innerWidth,innerHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=false;
const scene=new THREE.Scene();scene.background=new THREE.Color('#050608');scene.fog=new THREE.FogExp2(0x050608,.043);
const camera=new THREE.PerspectiveCamera(lowPower?38:35,innerWidth/innerHeight,.1,80);camera.position.set(0,.25,8.8);
const targetVec=new THREE.Vector3(.8,.4,0), bgTarget=new THREE.Color('#050608');

scene.add(new THREE.HemisphereLight(0xc9dff1,0x171319,1.25));
const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(4.5,6,5);scene.add(key);
const rim=new THREE.PointLight(0x7ebff0,35,16,2);rim.position.set(-4,1.8,-2.5);scene.add(rim);
const warm=new THREE.PointLight(0xd79a66,27,14,2);warm.position.set(4,-1,3);scene.add(warm);

const metal=new THREE.MeshStandardMaterial({color:'#171a1f',metalness:.76,roughness:.24});
const trim=new THREE.MeshStandardMaterial({color:'#74808e',metalness:.88,roughness:.2});
const cushion=new THREE.MeshStandardMaterial({color:'#090a0d',metalness:.04,roughness:.82});
const dark=new THREE.MeshStandardMaterial({color:'#08090b',metalness:.18,roughness:.55});
const driverMat=new THREE.MeshStandardMaterial({color:'#b17847',metalness:.72,roughness:.28});
const copper=new THREE.MeshStandardMaterial({color:'#9b5e36',metalness:.82,roughness:.25});
const glass=new THREE.MeshBasicMaterial({color:'#87b7d7',transparent:true,opacity:.16,depthWrite:false});
const product=new THREE.Group();scene.add(product);
const explodeParts=[],clickables=[];
function tube(points,r,mat,segs=quality.segments){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return new THREE.Mesh(new THREE.TubeGeometry(curve,segs,r,lowPower?6:8,false),mat)}
function reg(mesh,name,vector=null){mesh.userData.name=name;clickables.push(mesh);if(vector){mesh.userData.base=mesh.position.clone();mesh.userData.vector=new THREE.Vector3(...vector);explodeParts.push(mesh)}return mesh}

const band=tube([[-2.1,.68,0],[-1.86,2.22,0],[-1.0,3.12,0],[0,3.38,0],[1.0,3.12,0],[1.86,2.22,0],[2.1,.68,0]],.2,metal,quality.segments+12);band.userData.name='Headband';clickables.push(band);product.add(band);
product.add(tube([[-1.87,.78,.02],[-1.68,2.04,.02],[-.86,2.78,.02],[0,2.96,.02],[.86,2.78,.02],[1.68,2.04,.02],[1.87,.78,.02]],.14,cushion,quality.segments));
function buildCup(side){
  const g=new THREE.Group();g.position.set(side*2.02,.02,0);product.add(g);
  const shell=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.43,quality.segments,1),metal);shell.rotation.z=Math.PI/2;g.add(shell);reg(shell,`${side<0?'Left':'Right'} outer shell`,[side*.65,0,0]);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.81,.05,lowPower?8:10,quality.segments),trim);ring.rotation.y=Math.PI/2;ring.position.x=side*.22;g.add(ring);reg(ring,'Machined ring',[side*.95,0,0]);
  const badge=new THREE.Mesh(new THREE.CylinderGeometry(.69,.69,.018,quality.segments),dark);badge.rotation.z=Math.PI/2;badge.position.x=side*.215;g.add(badge);reg(badge,'Outer plate',[side*1.15,0,0]);
  const pad=new THREE.Mesh(new THREE.TorusGeometry(.66,.17,lowPower?9:12,quality.segments),cushion);pad.rotation.y=Math.PI/2;pad.scale.y=1.08;pad.position.x=-side*.25;g.add(pad);reg(pad,'Memory foam cushion',[-side*.85,0,0]);
  const chamber=new THREE.Mesh(new THREE.CylinderGeometry(.58,.58,.055,quality.segments),dark);chamber.rotation.z=Math.PI/2;chamber.position.x=-side*.18;g.add(chamber);reg(chamber,'Acoustic chamber',[-side*1.18,0,0]);
  const driver=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.04,quality.segments),driverMat);driver.rotation.z=Math.PI/2;driver.position.x=-side*.12;g.add(driver);reg(driver,'40 mm driver',[-side*1.52,0,0]);
  const coil=new THREE.Mesh(new THREE.TorusGeometry(.3,.04,8,quality.segments),copper);coil.rotation.y=Math.PI/2;coil.position.x=-side*.07;g.add(coil);reg(coil,'Voice coil',[-side*1.82,0,0]);
  const magnet=new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.12,quality.segments),trim);magnet.rotation.z=Math.PI/2;magnet.position.x=-side*.02;g.add(magnet);reg(magnet,'Magnet array',[-side*2.08,0,0]);
  const acousticMesh=new THREE.Mesh(new THREE.CircleGeometry(.5,quality.segments),glass);acousticMesh.rotation.y=Math.PI/2;acousticMesh.position.x=-side*.245;g.add(acousticMesh);reg(acousticMesh,'Acoustic mesh',[-side*.98,0,0]);
  product.add(tube([[side*1.9,.26,0],[side*2.2,.72,0],[side*2.12,1.25,0],[side*1.84,1.58,0]],.072,trim,lowPower?22:30));
  const hinge=new THREE.Mesh(new THREE.BoxGeometry(.32,.4,.25),trim);hinge.position.set(side*1.88,1.58,0);hinge.rotation.z=-side*.16;product.add(hinge);
}
buildCup(-1);buildCup(1);
const halo=new THREE.Mesh(new THREE.TorusGeometry(3.0,.009,5,lowPower?64:96),new THREE.MeshBasicMaterial({color:0x8bcaff,transparent:true,opacity:.14}));halo.rotation.x=Math.PI/2;halo.position.y=-1.86;scene.add(halo);
const floorGlow=new THREE.Mesh(new THREE.CircleGeometry(3.0,lowPower?32:48),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28,depthWrite:false}));floorGlow.rotation.x=-Math.PI/2;floorGlow.scale.set(1.8,.45,1);floorGlow.position.y=-2.02;scene.add(floorGlow);
const pArr=new Float32Array(quality.particles*3);for(let i=0;i<quality.particles;i++){pArr[i*3]=(Math.random()-.5)*20;pArr[i*3+1]=(Math.random()-.5)*12;pArr[i*3+2]=(Math.random()-.5)*14-4}const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pArr,3));const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0xb9d9ef,size:lowPower?.017:.02,transparent:true,opacity:.28,depthWrite:false}));scene.add(particles);
loadStep(62,'Tuning motion');

const states={
 hero:{p:[1.62,-.18,0],r:[.03,-.5,-.02],s:1,c:[0,.3,8.8],t:[.85,.45,0],ex:0,bg:'#050608',fog:.043,halo:.16},story:{p:[2.15,-.08,-.6],r:[0,-1.0,.02],s:.77,c:[-.15,.42,9],t:[.55,.42,0],ex:0,bg:'#08090d',fog:.047,halo:.08},products:{p:[1.85,-.15,0],r:[.03,-.2,.02],s:.82,c:[0,.28,8.65],t:[.85,.4,0],ex:0,bg:'#06080b',fog:.043,halo:.12},detail:{p:[-1.62,-.1,0],r:[.02,.54,-.02],s:1.02,c:[0,.32,8.2],t:[-.62,.34,0],ex:0,bg:'#050608',fog:.041,halo:.17},explode:{p:[1.48,-.04,0],r:[.02,-.08,0],s:.92,c:[0,.22,9.25],t:[.9,.22,0],ex:1,bg:'#030609',fog:.036,halo:.26},technology:{p:[-1.55,-.08,-.15],r:[-.03,.74,.03],s:.9,c:[0,.18,8.75],t:[-.68,.28,0],ex:.18,bg:'#03070b',fog:.037,halo:.24},sound:{p:[1.55,-.08,0],r:[.03,-.52,-.03],s:.86,c:[0,.28,9],t:[.8,.28,0],ex:0,bg:'#05070a',fog:.044,halo:.2},control:{p:[-1.8,-.18,-.5],r:[.02,.82,0],s:.67,c:[0,.28,9.25],t:[-.6,.3,0],ex:0,bg:'#05070b',fog:.047,halo:.1},sustainability:{p:[1.85,-.16,-.5],r:[.01,-.75,0],s:.7,c:[0,.42,9.3],t:[.6,.4,0],ex:0,bg:'#06100d',fog:.05,halo:.07},reviews:{p:[-2.05,-.18,-.7],r:[.04,.9,0],s:.6,c:[0,.28,9.25],t:[-.55,.3,0],ex:0,bg:'#07070a',fog:.049,halo:.08},life:{p:[1.95,-.22,-.8],r:[.03,-.86,0],s:.6,c:[0,.3,9.3],t:[.6,.36,0],ex:0,bg:'#060709',fog:.05,halo:.08},stories:{p:[-2.1,-.3,-1],r:[.03,.95,0],s:.5,c:[0,.24,9.4],t:[-.5,.2,0],ex:0,bg:'#05070a',fog:.052,halo:.05},support:{p:[2.1,-.34,-1.3],r:[.03,-1,0],s:.46,c:[0,.18,9.45],t:[.5,.18,0],ex:0,bg:'#06070a',fog:.054,halo:.04},newsletter:{p:[0,-.85,-3],r:[0,0,0],s:.34,c:[0,.28,9.55],t:[0,.2,0],ex:0,bg:'#060a11',fog:.057,halo:.02},footer:{p:[0,-1.3,-5],r:[0,0,0],s:.22,c:[0,.18,9.7],t:[0,0,0],ex:0,bg:'#030405',fog:.06,halo:0}
};
Object.values(states).forEach(s=>s.bgColor=new THREE.Color(s.bg));
const visual={p:[...states.hero.p],r:[...states.hero.r],c:[...states.hero.c],t:[...states.hero.t],s:states.hero.s,ex:0,fog:states.hero.fog,halo:states.hero.halo,bgColor:states.hero.bgColor.clone()};
function blendInto(a,b,p){const t=smooth(p);for(let i=0;i<3;i++){visual.p[i]=lerp(a.p[i],b.p[i],t);visual.r[i]=lerp(a.r[i],b.r[i],t);visual.c[i]=lerp(a.c[i],b.c[i],t);visual.t[i]=lerp(a.t[i],b.t[i],t)}visual.s=lerp(a.s,b.s,t);visual.ex=lerp(a.ex,b.ex,t);visual.fog=lerp(a.fog,b.fog,t);visual.halo=lerp(a.halo,b.halo,t);visual.bgColor.copy(a.bgColor).lerp(b.bgColor,t)}
const chapters=$$('.chapter');let activeChapter=0,explodeOverride=null;
function updateRail(i,p=0){$('#chapterIndex').textContent=String(i+1).padStart(2,'0');$('#chapterLabel').textContent=chapters[i]?.dataset.label||'';$('#railProgress').style.height=`${clamp((i+p)/(chapters.length-1))*100}%`}
function reveal(el){if(reduce||!gsap)return;gsap.fromTo(el.querySelectorAll('.copy>*'),{y:18,opacity:.35},{y:0,opacity:1,stagger:.025,duration:.42,ease:'power2.out',overwrite:true})}
if(ScrollTrigger){chapters.forEach((el,i)=>{const a=states[el.dataset.scene],b=states[chapters[Math.min(i+1,chapters.length-1)].dataset.scene];ScrollTrigger.create({trigger:el,start:'top 58%',end:'bottom 42%',scrub:lowPower?.18:.35,onEnter:()=>{activeChapter=i;reveal(el);updateRail(i)},onEnterBack:()=>{activeChapter=i;reveal(el);updateRail(i)},onUpdate:self=>{activeChapter=i;blendInto(a,b,self.progress);updateRail(i,self.progress);explodeOverride=el.id==='explode'?self.progress:null}})});}else{blendInto(states.hero,states.hero,0)}
const activeObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('is-active',e.isIntersecting)),{rootMargin:'-25% 0px -25% 0px',threshold:.01});chapters.forEach(c=>activeObserver.observe(c));

const models={
 pro:{name:'NEXA Pro',tag:'Precision. In Every Detail.',price:'₹24,999',scale:1,color:'#171a1f',anc:'Adaptive · 4 mic',battery:'50 hours',weight:'238 g',best:'Travel + focused work'},
 go:{name:'NEXA Go',tag:'Light. Portable. Powerful.',price:'₹17,999',scale:.94,color:'#b59b7a',anc:'Hybrid · 2 mic',battery:'38 hours',weight:'212 g',best:'Commuting + everyday'},
 air:{name:'NEXA Air',tag:'Freedom in Every Beat.',price:'₹9,999',scale:.88,color:'#193e5e',anc:'Passive + aware',battery:'30 hours',weight:'198 g',best:'Casual + lightweight'}
};
let modelScale=1,activeModel='pro',activeColorName='Midnight Black';
function setModel(id){const m=models[id];activeModel=id;modelScale=m.scale;metal.color.set(m.color);activeColorName=id==='go'?'Desert Gold':id==='air'?'Deep Blue':'Midnight Black';$('#productName').textContent=m.name;$('#productTagline').textContent=m.tag;$('#productPrice').textContent=m.price;$('#phoneProduct').textContent=m.name;$('#cartProductName').textContent=m.name;$('#cartPrice').textContent=$('#cartTotal').textContent=m.price;$('#cartColorName').textContent=activeColorName;$('#compareModel').textContent=m.name;$('#compareAnc').textContent=m.anc;$('#compareBattery').textContent=m.battery;$('#compareWeight').textContent=m.weight;$('#compareBest').textContent=m.best;$$('.product-tab').forEach(b=>{const on=b.dataset.model===id;b.classList.toggle('active',on);b.setAttribute('aria-selected',on)});showTip(`${m.name} selected`)}
$$('.product-tab').forEach(b=>b.addEventListener('click',()=>setModel(b.dataset.model)));
$$('.color-swatch').forEach(b=>b.addEventListener('click',()=>{metal.color.set(b.dataset.color);activeColorName=b.dataset.name;$$('.color-swatch').forEach(x=>x.classList.toggle('active',x===b));$('#cartColorName').textContent=activeColorName;showTip(activeColorName)}));

function showTip(text){const t=$('#partTooltip');t.textContent=text;t.classList.add('show');clearTimeout(showTip.timer);showTip.timer=setTimeout(()=>t.classList.remove('show'),1200)}
$$('#componentList button').forEach(b=>b.addEventListener('click',()=>{$$('#componentList button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#partReadout').textContent=`Focused: ${b.dataset.part}`;explodeOverride=1;const found=clickables.find(x=>x.userData.name.includes(b.dataset.part)||b.dataset.part.includes(x.userData.name));if(found)flashPart(found);showTip(b.dataset.part)}));
function flashPart(mesh){const m=mesh.material;if(!m?.emissive)return;const old=m.emissive.clone(),oldI=m.emissiveIntensity||0;m.emissive.set('#4a91c0');m.emissiveIntensity=.9;setTimeout(()=>{m.emissive.copy(old);m.emissiveIntensity=oldI},450)}

const techData={anc:{color:'#5da9df',kicker:'NOISE CONTROL',metric:'-42 dB',desc:'Peak low-frequency attenuation target in supported conditions.',response:'12 ms',mode:'Adaptive',meter:78},spatial:{color:'#a985e6',kicker:'SPATIAL ENGINE',metric:'360°',desc:'Head-aware virtual sound field for supported spatial content.',response:'48 kHz',mode:'Head-aware',meter:88},ai:{color:'#67cfaf',kicker:'PERSONAL TUNING',metric:'8 band',desc:'Context-sensitive equalization with user-selectable listening profiles.',response:'On-device',mode:'Private',meter:64},battery:{color:'#dbb06f',kicker:'CRYSTAL CELL',metric:'50 h',desc:'Rated playback target with rapid top-up support.',response:'10m → 5h',mode:'Efficient',meter:92}};
$$('.tech-item').forEach(b=>b.addEventListener('click',()=>{const d=techData[b.dataset.tech];$$('.tech-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');rim.color.set(d.color);$('#techKicker').textContent=d.kicker;$('#techMetric').textContent=d.metric;$('#techDescription').textContent=d.desc;$('#techResponse').textContent=d.response;$('#techMode').textContent=d.mode;$('#techMeter').style.width=`${d.meter}%`;showTip(b.querySelector('span').textContent)}));

const envData={city:{rim:'#7ab9e9',warm:'#d28b63',profile:'Urban Focus',anc:'86%',spatial:'72%'},office:{rim:'#b8d6e9',warm:'#a99279',profile:'Deep Work',anc:'64%',spatial:'58%'},travel:{rim:'#73a5ff',warm:'#e6a56f',profile:'Flight Quiet',anc:'94%',spatial:'66%'},home:{rim:'#c29be7',warm:'#e2a376',profile:'Open Room',anc:'28%',spatial:'92%'}};
$$('.env').forEach(b=>b.addEventListener('click',()=>{const d=envData[b.dataset.env];$$('.env').forEach(x=>x.classList.remove('active'));b.classList.add('active');rim.color.set(d.rim);warm.color.set(d.warm);$('#envProfile').textContent=d.profile;$('#envAnc').textContent=d.anc;$('#envSpatial').textContent=d.spatial;showTip(`${b.querySelector('b').textContent} profile`)}));

const controlData={focus:{label:'FOCUS MODE',value:'Adaptive',copy:'Balances isolation and awareness based on the environment.'},spatial:{label:'SPATIAL AUDIO',value:'Immersive',copy:'Expands the field while keeping voices anchored and stable.'},eq:{label:'PERSONAL EQ',value:'Warm Detail',copy:'A five-point curve tuned for detail without harsh upper frequencies.'}};
$$('.control-tab').forEach(b=>b.addEventListener('click',()=>{const d=controlData[b.dataset.control];$$('.control-tab').forEach(x=>x.classList.toggle('active',x===b));$('#controlLabel').textContent=d.label;$('#controlValue').textContent=d.value;$('#controlCopy').textContent=d.copy}));

let cartCount=0,checkoutStep=0;function openCart(){const d=$('#cartDrawer'),back=$('#cartBackdrop');d.classList.add('open');d.setAttribute('aria-hidden','false');back.hidden=false}function closeCart(){const d=$('#cartDrawer'),back=$('#cartBackdrop');d.classList.remove('open');d.setAttribute('aria-hidden','true');back.hidden=true}
$$('.add-cart').forEach(b=>b.addEventListener('click',()=>{cartCount=1;$('#cartCount').textContent='1';openCart();showTip(`${models[activeModel].name} added`)}));$('#headerShop').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);$('#cartBackdrop').addEventListener('click',closeCart);$('#checkoutBtn').addEventListener('click',()=>{checkoutStep++;const steps=$$('.checkout-progress span');steps.forEach((s,i)=>s.classList.toggle('active',i<=checkoutStep));if(checkoutStep===1){$('#checkoutBtn').textContent='Continue to Payment';$('#cartNote').textContent='Delivery step simulated.'}else{$('#checkoutBtn').textContent='Prototype Complete';$('#cartNote').textContent='Checkout flow completed — no payment processed.';$('#checkoutBtn').disabled=true}showTip('Checkout step updated')});
$('#filmBtn').addEventListener('click',()=>{$('#filmModal').classList.add('open');$('#filmModal').setAttribute('aria-hidden','false')});$('#filmClose').addEventListener('click',()=>{$('#filmModal').classList.remove('open');$('#filmModal').setAttribute('aria-hidden','true')});$('#filmModal').addEventListener('click',e=>{if(e.target.id==='filmModal')$('#filmClose').click()});
let soundOn=false;$('#soundToggle').addEventListener('click',e=>{soundOn=!soundOn;e.currentTarget.setAttribute('aria-pressed',String(soundOn));document.body.classList.toggle('sound-on',soundOn);showTip(soundOn?'Visualizer intensified':'Visualizer normal')});
$('#supportInput').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();let hits=0;$$('#supportLinks button').forEach(b=>{const yes=q&&b.dataset.keywords.includes(q);b.classList.toggle('match',yes);hits+=yes?1:0});$('#supportResult').textContent=!q?'Popular topics are ready.':hits?`${hits} support topic${hits>1?'s':''} matched “${q}”.`:`No exact shortcut for “${q}” — try “pairing”, “warranty”, “ANC” or “return”.`});
$$('#supportLinks button').forEach(b=>b.addEventListener('click',()=>{$('#supportResult').textContent=`${b.textContent}: demo help article opened.`;showTip(b.textContent)}));
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#emailInput'),status=$('#newsletterStatus'),ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());status.textContent=ok?'You’re on the NEXA early-access list.':'Enter a valid email address.';status.style.color=ok?'#8fd7aa':'#e99b9b';if(ok)input.value=''});

const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();canvas.addEventListener('pointerdown',e=>{if(activeChapter<3||activeChapter>6)return;mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight*2-1);ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects(clickables,false)[0]?.object;if(hit){showTip(hit.userData.name);flashPart(hit)}});
let pointerX=0,pointerY=0;if(!coarse)addEventListener('pointermove',e=>{pointerX=e.clientX/innerWidth-.5;pointerY=e.clientY/innerHeight-.5},{passive:true});
function applyExplode(amount){for(const m of explodeParts){const base=m.userData.base,vec=m.userData.vector;if(base&&vec)m.position.set(base.x+vec.x*amount,base.y+vec.y*amount,base.z+vec.z*amount)}}

let lastRender=0,renderedFrames=0,frameCostTotal=0,lastQualityTune=performance.now(),firstFrame=true;
function tuneQuality(now){if(lowPower||now-lastQualityTune<2500||renderedFrames<35)return;const avg=frameCostTotal/renderedFrames;if(avg>22&&pixelRatio>.85){pixelRatio=Math.max(.85,pixelRatio-.1);renderer.setPixelRatio(pixelRatio);renderer.setSize(innerWidth,innerHeight,false);$('#qualityBadge').textContent=`Adaptive ${pixelRatio.toFixed(1)}×`}else if(avg<13&&pixelRatio<quality.dprCap){pixelRatio=Math.min(quality.dprCap,pixelRatio+.05);renderer.setPixelRatio(pixelRatio);renderer.setSize(innerWidth,innerHeight,false)}renderedFrames=0;frameCostTotal=0;lastQualityTune=now}
function frame(now){requestAnimationFrame(frame);if(document.hidden)return;const interval=1000/quality.fps;if(now-lastRender<interval)return;lastRender=now;const start=performance.now();const v=visual;product.position.x+=(v.p[0]-product.position.x)*.09;product.position.y+=(v.p[1]-product.position.y)*.09;product.position.z+=(v.p[2]-product.position.z)*.09;product.rotation.x+=(v.r[0]+(reduce?0:pointerY*.024)-product.rotation.x)*.075;product.rotation.y+=(v.r[1]+(reduce?0:pointerX*.04)-product.rotation.y)*.075;product.rotation.z+=(v.r[2]-product.rotation.z)*.075;const ds=v.s*modelScale;product.scale.x+=(ds-product.scale.x)*.09;product.scale.y+=(ds-product.scale.y)*.09;product.scale.z+=(ds-product.scale.z)*.09;camera.position.x+=(v.c[0]-camera.position.x)*.08;camera.position.y+=(v.c[1]-camera.position.y)*.08;camera.position.z+=(v.c[2]-camera.position.z)*.08;targetVec.set(v.t[0],v.t[1],v.t[2]);camera.lookAt(targetVec);const ex=explodeOverride==null?v.ex:Math.max(v.ex,explodeOverride);applyExplode(clamp(ex));bgTarget.copy(v.bgColor);scene.background.lerp(bgTarget,.08);scene.fog.density+=(v.fog-scene.fog.density)*.08;halo.material.opacity+=(v.halo-halo.material.opacity)*.08;if(!reduce&&!lowPower){particles.rotation.y+=.00022;halo.rotation.z+=.0009}renderer.render(scene,camera);const cost=performance.now()-start;renderedFrames++;frameCostTotal+=cost;tuneQuality(now);if(firstFrame){firstFrame=false;loadStep(100,'Ready');setTimeout(()=>preloader?.classList.add('done'),240)}}
requestAnimationFrame(frame);

let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);ScrollTrigger?.refresh()},120)},{passive:true});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();$('#filmModal').classList.remove('open')}});updateRail(0,0);loadStep(82,quality.low?'Optimizing for this device':'Loading cinematic profile');