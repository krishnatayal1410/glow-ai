import * as THREE from 'three';

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=THREE.MathUtils.lerp;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=matchMedia('(max-width: 760px)').matches;
const coarse=matchMedia('(pointer: coarse)').matches;
const cores=navigator.hardwareConcurrency||4;
const memory=navigator.deviceMemory||4;
const lowDevice=mobile||cores<=4||memory<=4;

const preloadBar=$('#preloaderBar'), preloadText=$('#preloaderText'), preloader=$('#preloader');
function loadStep(p,label){if(preloadBar)preloadBar.style.width=`${p}%`;if(preloadText)preloadText.textContent=`${label} · ${p}%`}
loadStep(18,'Preparing sound space');

const canvas=$('#nexa-canvas');
let qualityMode='AUTO';
let dpr=lowDevice?1:1.3;
const renderer=new THREE.WebGLRenderer({canvas,antialias:!lowDevice,powerPreference:'high-performance',alpha:false});
renderer.setPixelRatio(dpr);renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;
const scene=new THREE.Scene();scene.background=new THREE.Color('#050608');scene.fog=new THREE.FogExp2(0x050608,.045);
const camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.1,80);camera.position.set(0,.35,8.8);

const ambient=new THREE.HemisphereLight(0xd7e8f7,0x18120e,1.45);scene.add(ambient);
const key=new THREE.DirectionalLight(0xffffff,3.3);key.position.set(5,6,7);scene.add(key);
const rim=new THREE.PointLight(0x83cdfa,34,18,2);rim.position.set(-5,2,-2);scene.add(rim);
const warm=new THREE.PointLight(0xd09b68,26,15,2);warm.position.set(5,-1,4);scene.add(warm);
loadStep(42,'Building product');

const metal=new THREE.MeshStandardMaterial({color:'#171a1f',metalness:.82,roughness:.22});
const trim=new THREE.MeshStandardMaterial({color:'#7a8592',metalness:.92,roughness:.18});
const cushion=new THREE.MeshStandardMaterial({color:'#0a0b0e',metalness:.02,roughness:.86});
const dark=new THREE.MeshStandardMaterial({color:'#08090b',metalness:.3,roughness:.55});
const driverMat=new THREE.MeshStandardMaterial({color:'#a86e42',metalness:.82,roughness:.26});
const copper=new THREE.MeshStandardMaterial({color:'#92552f',metalness:.9,roughness:.22});
const meshMat=new THREE.MeshStandardMaterial({color:'#bddff0',transparent:true,opacity:.18,metalness:.15,roughness:.28,depthWrite:false});
const product=new THREE.Group();scene.add(product);
const explodeParts=[],partMap=new Map();
const seg=lowDevice?36:56;
function tube(points,r,mat){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),seg,r,10,false),mat)}
function reg(mesh,name,vector=null){mesh.userData.partName=name;if(vector){mesh.userData.base=mesh.position.clone();mesh.userData.vector=new THREE.Vector3(...vector);explodeParts.push(mesh)}partMap.set(name,mesh);return mesh}

const band=tube([[-2.12,.68,0],[-1.9,2.25,0],[-1.02,3.12,0],[0,3.42,0],[1.02,3.12,0],[1.9,2.25,0],[2.12,.68,0]],.19,metal);reg(band,'Headband');product.add(band);
product.add(tube([[-1.88,.8,.02],[-1.68,2.1,.02],[-.88,2.85,.02],[0,3.05,.02],[.88,2.85,.02],[1.68,2.1,.02],[1.88,.8,.02]],.135,cushion));
function addCup(side){
  const g=new THREE.Group();g.position.set(side*2.05,.02,0);product.add(g);
  const shell=new THREE.Mesh(new THREE.CylinderGeometry(.91,.91,.43,seg),metal);shell.rotation.z=Math.PI/2;reg(shell,'Outer shell',[side*.68,0,0]);g.add(shell);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.81,.048,12,seg),trim);ring.rotation.y=Math.PI/2;ring.position.x=side*.23;reg(ring,'Machined ring',[side*.94,0,0]);g.add(ring);
  const plate=new THREE.Mesh(new THREE.CylinderGeometry(.70,.70,.018,seg),dark);plate.rotation.z=Math.PI/2;plate.position.x=side*.225;reg(plate,'Outer plate',[side*1.15,0,0]);g.add(plate);
  const pad=new THREE.Mesh(new THREE.TorusGeometry(.67,.17,16,seg),cushion);pad.rotation.y=Math.PI/2;pad.scale.y=1.08;pad.position.x=-side*.26;reg(pad,'Memory foam cushion',[-side*.92,0,0]);g.add(pad);
  const chamber=new THREE.Mesh(new THREE.CylinderGeometry(.58,.58,.055,seg),dark);chamber.rotation.z=Math.PI/2;chamber.position.x=-side*.17;reg(chamber,'Acoustic chamber',[-side*1.28,0,0]);g.add(chamber);
  const driver=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.042,seg),driverMat);driver.rotation.z=Math.PI/2;driver.position.x=-side*.11;reg(driver,'40 mm driver',[-side*1.66,0,0]);g.add(driver);
  const coil=new THREE.Mesh(new THREE.TorusGeometry(.30,.042,10,seg),copper);coil.rotation.y=Math.PI/2;coil.position.x=-side*.06;reg(coil,'Voice coil',[-side*1.98,0,0]);g.add(coil);
  const magnet=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.12,seg),trim);magnet.rotation.z=Math.PI/2;magnet.position.x=-side*.01;reg(magnet,'Magnet array',[-side*2.28,0,0]);g.add(magnet);
  const grille=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.012,seg),meshMat);grille.rotation.z=Math.PI/2;grille.position.x=-side*.22;reg(grille,'Acoustic mesh',[-side*1.08,0,0]);g.add(grille);
  product.add(tube([[side*1.94,.25,0],[side*2.25,.72,0],[side*2.15,1.26,0],[side*1.88,1.62,0]],.07,trim));
  const hinge=new THREE.Mesh(new THREE.BoxGeometry(.3,.38,.25),trim);hinge.position.set(side*1.92,1.61,0);hinge.rotation.z=-side*.17;product.add(hinge);
}
addCup(-1);addCup(1);
const floorGlow=new THREE.Mesh(new THREE.CircleGeometry(3.0,48),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28,depthWrite:false}));floorGlow.rotation.x=-Math.PI/2;floorGlow.scale.set(1.8,.42,1);floorGlow.position.y=-2.0;scene.add(floorGlow);
const halo=new THREE.Mesh(new THREE.TorusGeometry(3.0,.008,6,72),new THREE.MeshBasicMaterial({color:0x8ed3ff,transparent:true,opacity:.14,depthWrite:false}));halo.rotation.x=Math.PI/2;halo.position.y=-1.84;scene.add(halo);
const starCount=lowDevice?38:90;const starArr=new Float32Array(starCount*3);for(let i=0;i<starCount;i++){starArr[i*3]=(Math.random()-.5)*18;starArr[i*3+1]=(Math.random()-.5)*12;starArr[i*3+2]=(Math.random()-.5)*10-3}const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starArr,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xcdeaff,size:.018,transparent:true,opacity:.33,depthWrite:false}));scene.add(stars);
loadStep(68,'Mapping scroll choreography');

const states={
 hero:{p:[1.6,-.22,0],r:[.02,-.48,-.02],s:1.02,c:[0,.34,8.8],t:[.9,.45,0],ex:0,bg:'#050608',rim:'#83cdfa',warm:'#d09b68',halo:.14},
 manifesto:{p:[-1.95,-.05,-.35],r:[.02,.82,.01],s:.88,c:[0,.35,8.9],t:[-.72,.4,0],ex:0,bg:'#060709',rim:'#759bc6',warm:'#c78c58',halo:.09},
 products:{p:[1.95,-.12,0],r:[.03,-.25,0],s:.85,c:[0,.28,8.6],t:[.92,.34,0],ex:0,bg:'#05070a',rim:'#8ed3ff',warm:'#a88062',halo:.13},
 detail:{p:[-1.7,-.08,0],r:[.02,.52,-.02],s:1.06,c:[0,.32,8.25],t:[-.65,.32,0],ex:0,bg:'#050608',rim:'#a7dcff',warm:'#d5a06b',halo:.18},
 explode:{p:[1.45,-.04,0],r:[.02,-.1,0],s:.93,c:[0,.22,9.15],t:[.9,.22,0],ex:1,bg:'#030608',rim:'#79d4ff',warm:'#c48652',halo:.28},
 soundlab:{p:[-1.9,-.12,-.2],r:[.04,.8,.02],s:.76,c:[0,.25,9.0],t:[-.72,.3,0],ex:.12,bg:'#04080c',rim:'#63c7ff',warm:'#6d91aa',halo:.23},
 anc:{p:[1.8,-.1,0],r:[.02,-.58,0],s:.88,c:[0,.25,8.9],t:[.82,.28,0],ex:0,bg:'#04080c',rim:'#6bd4ff',warm:'#55718b',halo:.3},
 context:{p:[-1.75,-.1,-.1],r:[.02,.56,0],s:.88,c:[0,.32,9],t:[-.78,.35,0],ex:0,bg:'#06080a',rim:'#75c9ff',warm:'#d09a66',halo:.18},
 comfort:{p:[1.75,-.1,-.15],r:[.1,-.75,.03],s:.92,c:[0,.46,8.5],t:[.78,.62,0],ex:0,bg:'#070709',rim:'#c2d9ee',warm:'#caa27f',halo:.11},
 package:{p:[-1.8,-.25,-.6],r:[.02,.62,0],s:.68,c:[0,.25,9.3],t:[-.65,.25,0],ex:0,bg:'#060708',rim:'#9ccce8',warm:'#c88d5d',halo:.08},
 sustainability:{p:[1.75,-.15,-.4],r:[.02,-.62,0],s:.72,c:[0,.4,9.4],t:[.7,.4,0],ex:0,bg:'#06100b',rim:'#7ad0a0',warm:'#8d9a62',halo:.08},
 compare:{p:[0,-1.0,-3.3],r:[0,0,0],s:.38,c:[0,.2,9.4],t:[0,.2,0],ex:0,bg:'#050608',rim:'#7792a8',warm:'#94775f',halo:.03},
 reviews:{p:[-2.35,-.4,-1.8],r:[.02,.9,0],s:.5,c:[0,.25,9.3],t:[-.45,.2,0],ex:0,bg:'#07070a',rim:'#8fb4cf',warm:'#b48e68',halo:.05},
 support:{p:[2.4,-.35,-2],r:[.02,-.92,0],s:.48,c:[0,.2,9.45],t:[.48,.2,0],ex:0,bg:'#06070a',rim:'#789fb9',warm:'#9c7d62',halo:.04},
 finale:{p:[0,-.45,-.35],r:[0,-.06,0],s:.82,c:[0,.3,9.1],t:[0,.35,0],ex:0,bg:'#030405',rim:'#9fdcff',warm:'#d09b68',halo:.16}
};
function blendState(a,b,t){t=t*t*(3-2*t);return{p:a.p.map((v,i)=>lerp(v,b.p[i],t)),r:a.r.map((v,i)=>lerp(v,b.r[i],t)),s:lerp(a.s,b.s,t),c:a.c.map((v,i)=>lerp(v,b.c[i],t)),t:a.t.map((v,i)=>lerp(v,b.t[i],t)),ex:lerp(a.ex,b.ex,t),bg:new THREE.Color(a.bg).lerp(new THREE.Color(b.bg),t),rim:new THREE.Color(a.rim).lerp(new THREE.Color(b.rim),t),warm:new THREE.Color(a.warm).lerp(new THREE.Color(b.warm),t),halo:lerp(a.halo,b.halo,t)}}
const chapters=$$('.chapter');let layout=[];let activeIndex=0;let targetState=states.hero;let pointerX=0,pointerY=0;let manualExplode=null;let needsMotion=1;
function measure(){layout=chapters.map(el=>({el,top:el.offsetTop,height:el.offsetHeight,state:states[el.dataset.scene]}));updateScroll(true)}
function updateScroll(){const y=scrollY+innerHeight*.48;let idx=0;for(let i=0;i<layout.length;i++){if(y>=layout[i].top)idx=i;else break}activeIndex=idx;const cur=layout[idx],next=layout[Math.min(idx+1,layout.length-1)];const p=clamp((y-cur.top)/Math.max(cur.height,1));targetState=blendState(cur.state,next.state,p);const overall=clamp(scrollY/Math.max(document.documentElement.scrollHeight-innerHeight,1));$('#railProgress').style.height=`${overall*100}%`;$('#chapterIndex').textContent=String(idx+1).padStart(2,'0');$('#chapterLabel').textContent=cur.el.dataset.label||'';if(cur.el.id!=='engineering')manualExplode=null;needsMotion=1}
addEventListener('scroll',updateScroll,{passive:true});

let activeModel='pro',modelScale=1,activeColorName='Midnight Black';
const models={pro:{name:'NEXA Pro',tag:'Precision in every detail.',price:'₹24,999',scale:1,color:'#171a1f'},go:{name:'NEXA Go',tag:'Light enough to move.',price:'₹17,999',scale:.92,color:'#b69774'},air:{name:'NEXA Air',tag:'Everyday freedom.',price:'₹9,999',scale:.86,color:'#173b5b'}};
function setModel(id){const m=models[id];activeModel=id;modelScale=m.scale;activeColorName=id==='pro'?'Midnight Black':id==='go'?'Desert Gold':'Deep Blue';metal.color.set(m.color);$('#productName').textContent=m.name;$('#productTagline').textContent=m.tag;$('#productPrice').textContent=m.price;$('#finishName').textContent=activeColorName;$('#cartProductName').textContent=m.name;$('#cartColorName').textContent=activeColorName;$('#cartPrice').textContent=$('#cartSubtotal').textContent=$('#cartTotal').textContent=m.price;$$('.product-option').forEach(b=>{const on=b.dataset.model===id;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))});showToast(`${m.name} selected`);needsMotion=1}
$$('.product-option').forEach(b=>b.addEventListener('click',()=>setModel(b.dataset.model)));
$$('.color-swatch').forEach(b=>b.addEventListener('click',()=>{activeColorName=b.dataset.name;metal.color.set(b.dataset.color);$('#finishName').textContent=activeColorName;$('#cartColorName').textContent=activeColorName;$$('.color-swatch').forEach(x=>x.classList.toggle('active',x===b));showToast(activeColorName);needsMotion=1}));

$$('#componentList button').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.part;manualExplode=.92;$$('#componentList button').forEach(x=>x.classList.toggle('active',x===b));$('#partReadout').textContent=`Focused: ${key}`;const part=partMap.get(key);if(part)part.userData.flash=1;showToast(key);needsMotion=1}));
const profiles={reference:{label:'NEXA Reference',path:'M40,156 C85,125 120,112 160,118 S250,152 300,137 S385,100 430,112 S505,147 555,129 S625,91 680,108'},warm:{label:'Warm Focus',path:'M40,138 C90,102 135,100 175,112 S245,145 300,140 S390,118 445,122 S525,142 575,133 S635,114 680,121'},detail:{label:'Detail Focus',path:'M40,166 C90,145 130,132 175,130 S250,144 305,126 S390,92 450,101 S530,122 580,104 S640,78 680,91'}};
$$('.profile').forEach(b=>b.addEventListener('click',()=>{const p=profiles[b.dataset.profile];$$('.profile').forEach(x=>x.classList.toggle('active',x===b));$('.freq-line').setAttribute('d',p.path);$('.freq-fill').setAttribute('d',`${p.path} L680,230 L40,230 Z`);$('#soundProfile').textContent=p.label;showToast(p.label)}));
$$('.anc-mode').forEach(b=>b.addEventListener('click',()=>{$$('.anc-mode').forEach(x=>x.classList.toggle('active',x===b));$('#ancLabel').textContent=b.dataset.label;$('#ancDb').textContent=b.dataset.db;const aware=b.dataset.anc==='aware';$('#ancStage').style.setProperty('--ringOpacity',aware ? '.08' : '.28');showToast(b.dataset.label)}));
const contexts={city:84,work:68,flight:94,home:52};
$$('.context-card').forEach(b=>b.addEventListener('click',()=>{const v=contexts[b.dataset.env];$$('.context-card').forEach(x=>x.classList.toggle('active',x===b));$('#contextMeter').style.width=`${v}%`;$('#contextValue').textContent=`${v}%`;showToast(`${b.querySelector('b').textContent} profile`)}));

const supportInput=$('#supportInput');supportInput?.addEventListener('input',()=>{const q=supportInput.value.trim().toLowerCase();let matches=0;$$('#supportLinks button').forEach(b=>{const hit=q&&b.dataset.keywords.includes(q);b.classList.toggle('match',!!hit);if(hit)matches++});$('#supportResult').textContent=q?(matches?`${matches} matched topic${matches>1?'s':''}.`:'No exact match — try “battery”, “ANC”, “pairing” or “warranty”.'):'Popular help topics are ready.'});

const cart=$('#cartDrawer'),backdrop=$('#cartBackdrop');let cartCount=0;
function openCart(){cart.classList.add('open');cart.setAttribute('aria-hidden','false');backdrop.hidden=false}
function closeCart(){cart.classList.remove('open');cart.setAttribute('aria-hidden','true');backdrop.hidden=true}
$$('.add-cart').forEach(b=>b.addEventListener('click',()=>{cartCount=1;$('#cartCount').textContent='1';openCart()}));$('#headerShop').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);backdrop.addEventListener('click',closeCart);$('#checkoutBtn').addEventListener('click',()=>{$('#cartNote').textContent='Checkout is intentionally disabled in this concept prototype.';showToast('Prototype checkout only')});
$('#newsletterForm')?.addEventListener('submit',e=>{e.preventDefault();const input=$('#emailInput');const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);$('#newsletterStatus').textContent=ok?'You’re on the NEXA early-access list.':'Enter a valid email address.';if(ok)input.value=''});

let toastTimer;function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1400)}

function applyQuality(mode,announce=true){qualityMode=mode;dpr=mode==='HIGH'?Math.min(devicePixelRatio,1.55):mode==='ECO'?1:(lowDevice?1:1.3);renderer.setPixelRatio(dpr);renderer.setSize(innerWidth,innerHeight,false);stars.visible=mode!=='ECO'&&!lowDevice;$('#qualityToggle').textContent=mode;if(announce)showToast(`Visual quality: ${mode}`);window.__NEXA_METRICS__.dpr=dpr;window.__NEXA_METRICS__.quality=mode;needsMotion=1}
$('#qualityToggle').addEventListener('click',()=>applyQuality(qualityMode==='AUTO'?'HIGH':qualityMode==='HIGH'?'ECO':'AUTO'));
if(!coarse)addEventListener('pointermove',e=>{pointerX=(e.clientX/innerWidth-.5)*.16;pointerY=(e.clientY/innerHeight-.5)*.10;needsMotion=1},{passive:true});

const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&!reduced&&!entry.target.dataset.revealed){entry.target.dataset.revealed='1';entry.target.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:560,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'})}}},{threshold:.16});$$('.copy').forEach(el=>observer.observe(el));

let last=performance.now(),fpsFrames=0,fpsStart=last,visible=true;const current={p:new THREE.Vector3(...states.hero.p),r:new THREE.Vector3(...states.hero.r),s:states.hero.s,c:new THREE.Vector3(...states.hero.c),t:new THREE.Vector3(...states.hero.t),ex:0};const camTarget=new THREE.Vector3();
window.__NEXA_METRICS__={quality:qualityMode,dpr,fps:0,drawCalls:0,triangles:0,scrollEngine:'native',libraries:['three'],adaptiveDrop:false};
function damp(a,b,k){return lerp(a,b,k)}
function animate(now){requestAnimationFrame(animate);if(!visible)return;const frameBudget=qualityMode==='ECO'||lowDevice?30:16.7;if(now-last<frameBudget)return;const dt=Math.min((now-last)/16.67,2);last=now;const k=reduced?1:Math.min(.16*dt,.35);const ts=targetState;
  current.p.x=damp(current.p.x,ts.p[0],k);current.p.y=damp(current.p.y,ts.p[1],k);current.p.z=damp(current.p.z,ts.p[2],k);
  current.r.x=damp(current.r.x,ts.r[0],k);current.r.y=damp(current.r.y,ts.r[1]+pointerX,k);current.r.z=damp(current.r.z,ts.r[2],k);
  current.s=damp(current.s,ts.s*modelScale,k);current.c.x=damp(current.c.x,ts.c[0],k);current.c.y=damp(current.c.y,ts.c[1]+pointerY,k);current.c.z=damp(current.c.z,ts.c[2],k);current.t.x=damp(current.t.x,ts.t[0],k);current.t.y=damp(current.t.y,ts.t[1],k);current.t.z=damp(current.t.z,ts.t[2],k);current.ex=damp(current.ex,manualExplode??ts.ex,k);
  product.position.copy(current.p);product.rotation.set(current.r.x,current.r.y,current.r.z);product.scale.setScalar(current.s);camera.position.copy(current.c);camTarget.set(current.t.x,current.t.y,current.t.z);camera.lookAt(camTarget);
  for(const part of explodeParts){const base=part.userData.base,vec=part.userData.vector;part.position.set(base.x+vec.x*current.ex,base.y+vec.y*current.ex,base.z+vec.z*current.ex);if(part.userData.flash>0){part.userData.flash=Math.max(0,part.userData.flash-.06*dt);part.scale.setScalar(1+part.userData.flash*.08)}else part.scale.setScalar(1)}
  scene.background.lerp(ts.bg,.08);scene.fog.color.copy(scene.background);rim.color.lerp(ts.rim,.08);warm.color.lerp(ts.warm,.08);halo.material.opacity=damp(halo.material.opacity,ts.halo,.1);halo.rotation.z+=.0009*dt;
  renderer.render(scene,camera);fpsFrames++;window.__NEXA_METRICS__.drawCalls=renderer.info.render.calls;window.__NEXA_METRICS__.triangles=renderer.info.render.triangles;
  if(now-fpsStart>2500){const fps=Math.round(fpsFrames*1000/(now-fpsStart));window.__NEXA_METRICS__.fps=fps;if(qualityMode==='AUTO'&&fps<44&&dpr>1){dpr=1;renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight,false);stars.visible=false;window.__NEXA_METRICS__.dpr=1;window.__NEXA_METRICS__.adaptiveDrop=true}fpsFrames=0;fpsStart=now}
}
requestAnimationFrame(animate);

document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible){last=performance.now();needsMotion=1}});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(dpr);renderer.setSize(innerWidth,innerHeight,false);measure()},{passive:true});
addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});

measure();applyQuality('AUTO',false);loadStep(88,'Optimizing for this device');
setTimeout(()=>{loadStep(100,'Ready');setTimeout(()=>preloader?.classList.add('done'),180)},260);
