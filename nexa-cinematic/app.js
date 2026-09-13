import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=THREE.MathUtils.lerp;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap=window.gsap, ScrollTrigger=window.ScrollTrigger;
if(gsap&&ScrollTrigger)gsap.registerPlugin(ScrollTrigger);

/* Smooth scroll: progressively enhanced; the site still works without Lenis. */
let lenis=null;
if(!reduce&&window.Lenis&&gsap){
  lenis=new window.Lenis({duration:1.05,smoothWheel:true,touchMultiplier:1.1,wheelMultiplier:.9});
  lenis.on('scroll',()=>ScrollTrigger?.update());
  gsap.ticker.add(t=>lenis.raf(t*1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=$(a.getAttribute('href'));if(el){e.preventDefault();lenis.scrollTo(el,{offset:-24});}}));
}

const canvas=$('#nexa-canvas');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.5:2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.2;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.background=new THREE.Color('#050608');scene.fog=new THREE.FogExp2(0x050608,.046);
const camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);camera.position.set(0,.3,9);
const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;pmrem.dispose();
const hemi=new THREE.HemisphereLight(0xc8e6ff,0x18131a,1.25);scene.add(hemi);
const key=new THREE.DirectionalLight(0xffffff,4.8);key.position.set(5,7,6);key.castShadow=true;scene.add(key);
const rim=new THREE.PointLight(0x8bcaff,70,20,2);rim.position.set(-5,2,-3);scene.add(rim);
const warm=new THREE.PointLight(0xd49b6c,52,18,2);warm.position.set(5,-1,4);scene.add(warm);

const metal=new THREE.MeshPhysicalMaterial({color:'#171a1f',metalness:.8,roughness:.18,clearcoat:1,clearcoatRoughness:.1,envMapIntensity:1.8});
const trim=new THREE.MeshPhysicalMaterial({color:'#7c8794',metalness:.92,roughness:.14,clearcoat:.75});
const cushion=new THREE.MeshPhysicalMaterial({color:'#090a0d',roughness:.9,sheen:.7,sheenColor:new THREE.Color('#59616d')});
const dark=new THREE.MeshPhysicalMaterial({color:'#08090b',roughness:.64,metalness:.12});
const driverMat=new THREE.MeshPhysicalMaterial({color:'#b17a49',metalness:.82,roughness:.23,clearcoat:.5});
const copper=new THREE.MeshPhysicalMaterial({color:'#9e6138',metalness:.9,roughness:.23});
const glass=new THREE.MeshPhysicalMaterial({color:'#cce8ff',transparent:true,opacity:.12,transmission:.55,roughness:.08});
const product=new THREE.Group();scene.add(product);
const colorMeshes=[],explodeParts=[],clickables=[];
function tube(points,r,mat,segs=100){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),segs,r,16,false),mat)}
function reg(mesh,name,vector=null,colorable=false){mesh.userData.name=name;clickables.push(mesh);if(vector){mesh.userData.base=mesh.position.clone();mesh.userData.vector=new THREE.Vector3(...vector);explodeParts.push(mesh)}if(colorable)colorMeshes.push(mesh);return mesh}
const band=reg(tube([[-2.15,.7,0],[-1.92,2.35,0],[-1.05,3.28,0],[0,3.56,0],[1.05,3.28,0],[1.92,2.35,0],[2.15,.7,0]],.2,metal,150),'Headband',null,true);product.add(band);
product.add(tube([[-1.9,.83,.02],[-1.72,2.18,.02],[-.9,2.98,.02],[0,3.15,.02],[.9,2.98,.02],[1.72,2.18,.02],[1.9,.83,.02]],.145,cushion,130));
function cup(side){
  const g=new THREE.Group();g.position.set(side*2.08,.05,0);product.add(g);
  const shell=reg(new THREE.Mesh(new THREE.CylinderGeometry(.93,.93,.46,96,4),metal),`${side<0?'Left':'Right'} outer shell`,[side*.7,0,0],true);shell.rotation.z=Math.PI/2;g.add(shell);
  const ring=reg(new THREE.Mesh(new THREE.TorusGeometry(.84,.052,22,96),trim),'Machined ring',[side*1.05,0,0]);ring.rotation.y=Math.PI/2;ring.position.x=side*.24;g.add(ring);
  const badge=reg(new THREE.Mesh(new THREE.CylinderGeometry(.72,.72,.018,96),dark),'Outer plate',[side*1.3,0,0]);badge.rotation.z=Math.PI/2;badge.position.x=side*.235;g.add(badge);
  const pad=reg(new THREE.Mesh(new THREE.TorusGeometry(.69,.18,28,96),cushion),'Memory foam cushion',[-side*.95,0,0]);pad.rotation.y=Math.PI/2;pad.scale.y=1.08;pad.position.x=-side*.27;g.add(pad);
  const chamber=reg(new THREE.Mesh(new THREE.CylinderGeometry(.61,.61,.06,80),dark),'Acoustic chamber',[-side*1.35,0,0]);chamber.rotation.z=Math.PI/2;chamber.position.x=-side*.19;g.add(chamber);
  const driver=reg(new THREE.Mesh(new THREE.CylinderGeometry(.47,.47,.045,80),driverMat),'40 mm driver',[-side*1.8,0,0]);driver.rotation.z=Math.PI/2;driver.position.x=-side*.13;g.add(driver);
  const coil=reg(new THREE.Mesh(new THREE.TorusGeometry(.32,.046,16,72),copper),'Voice coil',[-side*2.15,0,0]);coil.rotation.y=Math.PI/2;coil.position.x=-side*.08;g.add(coil);
  const magnet=reg(new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.14,64),trim),'Magnet array',[-side*2.5,0,0]);magnet.rotation.z=Math.PI/2;magnet.position.x=-side*.02;g.add(magnet);
  const mesh=reg(new THREE.Mesh(new THREE.CylinderGeometry(.52,.52,.016,72),glass),'Acoustic mesh',[-side*1.05,0,0]);mesh.rotation.z=Math.PI/2;mesh.position.x=-side*.24;g.add(mesh);
  product.add(tube([[side*1.95,.28,0],[side*2.31,.75,0],[side*2.2,1.32,0],[side*1.9,1.7,0]],.075,trim,60));
  const hinge=new THREE.Mesh(new RoundedBoxGeometry(.34,.44,.28,4,.08),trim);hinge.position.set(side*1.94,1.7,0);hinge.rotation.z=-side*.18;product.add(hinge);
}
cup(-1);cup(1);
const floorGlow=new THREE.Mesh(new THREE.CircleGeometry(3.3,96),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28,depthWrite:false}));floorGlow.rotation.x=-Math.PI/2;floorGlow.scale.set(1.9,.5,1);floorGlow.position.y=-2.05;scene.add(floorGlow);
const halo=new THREE.Mesh(new THREE.TorusGeometry(3.15,.009,8,180),new THREE.MeshBasicMaterial({color:0x9cd8ff,transparent:true,opacity:.18}));halo.rotation.x=Math.PI/2;halo.position.y=-1.9;scene.add(halo);
const pCount=innerWidth<700?200:520,pArr=new Float32Array(pCount*3);for(let i=0;i<pCount;i++){pArr[i*3]=(Math.random()-.5)*24;pArr[i*3+1]=(Math.random()-.5)*15;pArr[i*3+2]=(Math.random()-.5)*17-5}const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pArr,3));const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0xc9e8ff,size:.018,transparent:true,opacity:.42,depthWrite:false}));scene.add(particles);

const states={
 hero:{p:[1.7,-.2,0],r:[.03,-.5,-.03],s:1,c:[0,.35,8.8],t:[.9,.5,0],ex:0,bg:'#050608',fog:.046,halo:.2},
 story:{p:[2.25,-.08,-.6],r:[0,-1.05,.02],s:.78,c:[-.15,.45,9.1],t:[.6,.45,0],ex:0,bg:'#08090d',fog:.05,halo:.1},
 products:{p:[1.9,-.15,0],r:[.03,-.2,.02],s:.84,c:[0,.3,8.7],t:[.9,.4,0],ex:0,bg:'#06080b',fog:.045,halo:.14},
 detail:{p:[-1.7,-.1,0],r:[.02,.55,-.02],s:1.04,c:[0,.35,8.2],t:[-.65,.35,0],ex:0,bg:'#050608',fog:.043,halo:.2},
 explode:{p:[1.6,-.05,0],r:[.02,-.1,0],s:.96,c:[0,.25,9.5],t:[1.0,.25,0],ex:1,bg:'#030609',fog:.038,halo:.34},
 technology:{p:[-1.7,-.1,-.2],r:[-.03,.78,.03],s:.94,c:[0,.2,8.8],t:[-.72,.3,0],ex:.25,bg:'#03070b',fog:.039,halo:.3},
 sound:{p:[1.65,-.1,0],r:[.03,-.55,-.03],s:.9,c:[0,.3,9.2],t:[.85,.3,0],ex:0,bg:'#05070a',fog:.047,halo:.24},
 sustainability:{p:[-1.65,-.12,0],r:[.01,.45,0],s:.88,c:[0,.5,9.3],t:[-.8,.5,0],ex:0,bg:'#06100d',fog:.052,halo:.1},
 reviews:{p:[2.2,-.18,-.4],r:[.04,-1,0],s:.72,c:[0,.3,9.1],t:[.7,.35,0],ex:0,bg:'#07070a',fog:.05,halo:.12},
 life:{p:[-1.95,-.2,-.5],r:[.03,.75,0],s:.68,c:[0,.35,9.4],t:[-.7,.4,0],ex:0,bg:'#060709',fog:.052,halo:.12},
 stories:{p:[2.3,-.3,-1],r:[.03,-1.1,0],s:.55,c:[0,.25,9.4],t:[.5,.2,0],ex:0,bg:'#05070a',fog:.055,halo:.08},
 support:{p:[-2.4,-.3,-1],r:[.03,.9,0],s:.52,c:[0,.2,9.5],t:[-.5,.2,0],ex:0,bg:'#06070a',fog:.057,halo:.07},
 newsletter:{p:[0,-.9,-3],r:[0,0,0],s:.38,c:[0,.3,9.6],t:[0,.2,0],ex:0,bg:'#060a11',fog:.06,halo:.03},
 footer:{p:[0,-1.4,-5],r:[0,0,0],s:.25,c:[0,.2,9.8],t:[0,0,0],ex:0,bg:'#030405',fog:.065,halo:0}
};
let visual={...states.hero,p:[...states.hero.p],r:[...states.hero.r],c:[...states.hero.c],t:[...states.hero.t]};
let modelScale=1,activeModel='pro',activeColor='#171a1f',activeColorName='Midnight Black',explodeOverride=null;
function blend(a,b,t){t=t*t*(3-2*t);return{p:a.p.map((v,i)=>lerp(v,b.p[i],t)),r:a.r.map((v,i)=>lerp(v,b.r[i],t)),s:lerp(a.s,b.s,t),c:a.c.map((v,i)=>lerp(v,b.c[i],t)),t:a.t.map((v,i)=>lerp(v,b.t[i],t)),ex:lerp(a.ex,b.ex,t),bg:new THREE.Color(a.bg).lerp(new THREE.Color(b.bg),t),fog:lerp(a.fog,b.fog,t),halo:lerp(a.halo,b.halo,t)}}
const chapters=$$('.chapter');let activeChapter=0;
function setVisual(v){visual=v}
if(ScrollTrigger){chapters.forEach((el,i)=>{const a=states[el.dataset.scene],b=states[chapters[Math.min(i+1,chapters.length-1)].dataset.scene];ScrollTrigger.create({trigger:el,start:'top top',end:'bottom top',scrub:true,onUpdate:self=>{setVisual(blend(a,b,self.progress));activeChapter=i;updateRail(i,self.progress);if(el.id==='explode')explodeOverride=self.progress;else if(activeChapter!==4)explodeOverride=null},onEnter:()=>reveal(el),onEnterBack:()=>reveal(el)});});}
function reveal(el){if(reduce||!gsap)return;gsap.fromTo(el.querySelectorAll('.copy>*'),{y:24,opacity:.15},{y:0,opacity:1,stagger:.045,duration:.55,ease:'power2.out',overwrite:true})}
function updateRail(i,p){$('#chapterIndex').textContent=String(i+1).padStart(2,'0');$('#chapterLabel').textContent=chapters[i]?.dataset.label||'';$('#railProgress').style.height=`${((i+p)/(chapters.length-1))*100}%`}

const models={pro:{name:'NEXA Pro',tag:'Precision. In Every Detail.',price:'₹24,999',scale:1,color:'#171a1f'},go:{name:'NEXA Go',tag:'Light. Portable. Powerful.',price:'₹17,999',scale:.93,color:'#b59b7a'},air:{name:'NEXA Air',tag:'Freedom in Every Beat.',price:'₹9,999',scale:.87,color:'#193e5e'}};
function setModel(id){const m=models[id];activeModel=id;modelScale=m.scale;activeColor=m.color;activeColorName=id==='go'?'Desert Gold':id==='air'?'Deep Blue':'Midnight Black';metal.color.set(activeColor);$('#productName').textContent=m.name;$('#productTagline').textContent=m.tag;$('#productPrice').textContent=m.price;$('#cartProductName').textContent=m.name;$('#cartPrice').textContent=$('#cartTotal').textContent=m.price;$('#cartColorName').textContent=activeColorName;$$('.product-tab').forEach(b=>{const on=b.dataset.model===id;b.classList.toggle('active',on);b.setAttribute('aria-selected',on)});showTip(`${m.name} selected`)}
$$('.product-tab').forEach(b=>b.addEventListener('click',()=>setModel(b.dataset.model)));
$$('.color-swatch').forEach(b=>b.addEventListener('click',()=>{activeColor=b.dataset.color;activeColorName=b.dataset.name;metal.color.set(activeColor);$$('.color-swatch').forEach(x=>x.classList.toggle('active',x===b));$('#cartColorName').textContent=activeColorName;showTip(activeColorName)}));

function showTip(text){const t=$('#partTooltip');t.textContent=text;t.classList.add('show');clearTimeout(showTip.timer);showTip.timer=setTimeout(()=>t.classList.remove('show'),1500)}
$$('#componentList button').forEach(b=>b.addEventListener('click',()=>{$$('#componentList button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#partReadout').textContent=`Focused: ${b.dataset.part}`;explodeOverride=1;const found=clickables.find(x=>x.userData.name.includes(b.dataset.part)||b.dataset.part.includes(x.userData.name));if(found)flashPart(found);showTip(b.dataset.part)}));
function flashPart(mesh){const m=mesh.material;if(!m?.emissive)return;const old=m.emissive.clone(),oldI=m.emissiveIntensity;m.emissive.set('#5db8ff');m.emissiveIntensity=1.4;setTimeout(()=>{m.emissive.copy(old);m.emissiveIntensity=oldI},650)}

const techColors={anc:'#5da9df',spatial:'#a985e6',ai:'#67cfaf',battery:'#dbb06f'};
$$('.tech-item').forEach(b=>b.addEventListener('click',()=>{$$('.tech-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');rim.color.set(techColors[b.dataset.tech]);showTip(b.querySelector('span').textContent)}));
const envMap={city:{rim:'#7ab9e9',warm:'#d28b63',bg:'#05070a'},office:{rim:'#b8d6e9',warm:'#b7a38a',bg:'#07090b'},travel:{rim:'#73a5ff',warm:'#e6a56f',bg:'#04070c'},home:{rim:'#c29be7',warm:'#e2a376',bg:'#09070b'}};
$$('.env').forEach(b=>b.addEventListener('click',()=>{$$('.env').forEach(x=>x.classList.remove('active'));b.classList.add('active');const e=envMap[b.dataset.env];rim.color.set(e.rim);warm.color.set(e.warm);scene.background.set(e.bg);showTip(`${b.querySelector('b').textContent} mode`)}));

let cartCount=0;function openCart(){const d=$('#cartDrawer'),back=$('#cartBackdrop');d.classList.add('open');d.setAttribute('aria-hidden','false');back.hidden=false}function closeCart(){const d=$('#cartDrawer'),back=$('#cartBackdrop');d.classList.remove('open');d.setAttribute('aria-hidden','true');back.hidden=true}
$$('.add-cart').forEach(b=>b.addEventListener('click',()=>{cartCount=1;$('#cartCount').textContent='1';openCart();showTip(`${models[activeModel].name} added`)}));$('#headerShop').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);$('#cartBackdrop').addEventListener('click',closeCart);$('#checkoutBtn').addEventListener('click',()=>{$('#cartNote').textContent='Prototype checkout completed — no payment processed.';showTip('Prototype checkout complete')});
$('#filmBtn').addEventListener('click',()=>{$('#filmModal').classList.add('open');$('#filmModal').setAttribute('aria-hidden','false')});$('#filmClose').addEventListener('click',()=>{$('#filmModal').classList.remove('open');$('#filmModal').setAttribute('aria-hidden','true')});$('#filmModal').addEventListener('click',e=>{if(e.target.id==='filmModal')$('#filmClose').click()});
let soundOn=false;$('#soundToggle').addEventListener('click',e=>{soundOn=!soundOn;e.currentTarget.setAttribute('aria-pressed',String(soundOn));document.body.classList.toggle('sound-on',soundOn);showTip(soundOn?'Visualizer intensified':'Visualizer normal')});

$('#supportInput').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();let hits=0;$$('#supportLinks button').forEach(b=>{const yes=q&&b.dataset.keywords.includes(q);b.classList.toggle('match',yes);hits+=yes?1:0});$('#supportResult').textContent=!q?'Popular topics are ready.':hits?`${hits} support topic${hits>1?'s':''} matched “${q}”.`:`No exact shortcut for “${q}” — try “pairing”, “warranty”, “ANC” or “return”.`});
$$('#supportLinks button').forEach(b=>b.addEventListener('click',()=>{$('#supportResult').textContent=`${b.textContent}: demo help article opened.`;showTip(b.textContent)}));
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#emailInput'),status=$('#newsletterStatus'),ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());status.textContent=ok?'You’re on the NEXA early-access list.':'Enter a valid email address.';status.style.color=ok?'#8fd7aa':'#e99b9b';if(ok)input.value=''});

/* 3D direct inspection. */
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
canvas.addEventListener('pointerdown',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight*2-1);ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects(clickables,false)[0]?.object;if(hit){showTip(hit.userData.name);flashPart(hit)}});

let pointerX=0,pointerY=0;addEventListener('pointermove',e=>{pointerX=e.clientX/innerWidth-.5;pointerY=e.clientY/innerHeight-.5});
function applyExplode(amount){explodeParts.forEach(m=>{const base=m.userData.base,vec=m.userData.vector;if(base&&vec)m.position.copy(base).addScaledVector(vec,amount)})}
function frame(t){requestAnimationFrame(frame);const v=visual;product.position.x+=(v.p[0]-product.position.x)*.065;product.position.y+=(v.p[1]-product.position.y)*.065;product.position.z+=(v.p[2]-product.position.z)*.065;product.rotation.x+=(v.r[0]+(reduce?0:pointerY*.035)-product.rotation.x)*.055;product.rotation.y+=(v.r[1]+(reduce?0:pointerX*.06)-product.rotation.y)*.055;product.rotation.z+=(v.r[2]-product.rotation.z)*.055;const ds=v.s*modelScale;product.scale.x+=(ds-product.scale.x)*.065;product.scale.y+=(ds-product.scale.y)*.065;product.scale.z+=(ds-product.scale.z)*.065;camera.position.x+=(v.c[0]-camera.position.x)*.06;camera.position.y+=(v.c[1]-camera.position.y)*.06;camera.position.z+=(v.c[2]-camera.position.z)*.06;camera.lookAt(new THREE.Vector3(...v.t));const ex=explodeOverride==null?v.ex:Math.max(v.ex,explodeOverride);applyExplode(clamp(ex));if(v.bg?.isColor)scene.background.lerp(v.bg,.045);scene.fog.density+=(v.fog-scene.fog.density)*.05;halo.material.opacity+=(v.halo-halo.material.opacity)*.05;particles.rotation.y+=reduce?0:.00018;halo.rotation.z+=reduce?0:.001;renderer.render(scene,camera)}
frame(0);

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.5:2));renderer.setSize(innerWidth,innerHeight);ScrollTrigger?.refresh()});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();$('#filmModal').classList.remove('open')}});
updateRail(0,0);
