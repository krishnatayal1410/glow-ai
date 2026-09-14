import React,{Suspense,useEffect,useMemo}from'react';
import{Canvas,useFrame}from'@react-three/fiber';
import{useGLTF}from'@react-three/drei';
import*as THREE from'three';
import{cinematicAssets}from'./assets';

const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>v*v*(3-2*v);

function normalizeScene(source){
 const scene=source.clone(true);
 scene.traverse(o=>{
  if(o.isMesh){
   o.castShadow=true;o.receiveShadow=true;
   if(o.material){
    const list=Array.isArray(o.material)?o.material:[o.material];
    o.material=list.map(m=>{const c=m.clone();c.transparent=true;c.depthWrite=true;return c});
    if(!Array.isArray(source.material)&&o.material.length===1)o.material=o.material[0];
   }
  }
 });
 const bounds=new THREE.Box3().setFromObject(scene),size=new THREE.Vector3(),center=new THREE.Vector3();bounds.getSize(size);bounds.getCenter(center);
 const max=Math.max(size.x,size.y,size.z)||1;const scale=4.8/max;scene.scale.setScalar(scale);scene.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
 return scene;
}

function opacityScene(scene,value){
 scene.traverse(o=>{if(o.isMesh&&o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{m.opacity=value;m.transparent=value<.999})}})
}

function Asset({assetId,opacity=1}){
 const cfg=cinematicAssets[assetId],gltf=useGLTF(cfg.url);const scene=useMemo(()=>normalizeScene(gltf.scene),[gltf.scene]);
 useEffect(()=>opacityScene(scene,opacity),[scene,opacity]);
 return <primitive object={scene}/>;
}

function CameraRail({chapter,local,nextChapter,blend}){
 const cameraCurve=useMemo(()=>new THREE.CatmullRomCurve3(chapter.camera.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.35),[chapter]);
 const lookCurve=useMemo(()=>new THREE.CatmullRomCurve3(chapter.look.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.35),[chapter]);
 const nextCam=useMemo(()=>nextChapter?new THREE.Vector3(...nextChapter.camera[0]):null,[nextChapter]);
 const nextLook=useMemo(()=>nextChapter?new THREE.Vector3(...nextChapter.look[0]):null,[nextChapter]);
 const pos=new THREE.Vector3(),target=new THREE.Vector3();
 useFrame(({camera})=>{
  cameraCurve.getPointAt(clamp(local),pos);lookCurve.getPointAt(clamp(local),target);
  if(nextCam&&blend>0){pos.lerp(nextCam,smooth(blend));target.lerp(nextLook,smooth(blend))}
  camera.position.copy(pos);camera.lookAt(target);camera.updateProjectionMatrix();
 });
 return null;
}

function World({chapters,progress}){
 const scaled=clamp(progress)*(chapters.length-1),index=Math.min(chapters.length-1,Math.floor(scaled+.00001)),local=index===chapters.length-1?1:scaled-index;
 const current=chapters[index],next=chapters[Math.min(index+1,chapters.length-1)];
 const transition=next!==current?clamp((local-.78)/.22):0;
 const sameScene=next.scene===current.scene;
 return <>
  <color attach="background" args={['#161915']}/>
  <hemisphereLight intensity={1.15} color="#fff4df" groundColor="#44382c"/>
  <directionalLight position={[4,7,5]} intensity={2.2} color="#fff0d3" castShadow shadow-mapSize={[1024,1024]}/>
  <directionalLight position={[-5,3,-2]} intensity={.7} color="#9fc6b0"/>
  <Suspense fallback={null}>
   <group position={[0,-1.25,0]}><Asset assetId={current.scene} opacity={sameScene?1:1-transition}/></group>
   {!sameScene&&transition>.02&&<group position={[0,-1.25,0]}><Asset assetId={next.scene} opacity={transition}/></group>}
  </Suspense>
  <CameraRail chapter={current} local={local} nextChapter={!sameScene?next:null} blend={transition}/>
 </>
}

export default function CinematicCanvas({chapters,progress}){
 return <div className="cinematic-canvas" aria-hidden="true"><Canvas camera={{position:[0,1.2,4.5],fov:48,near:.05,far:100}} dpr={[1,1.5]} shadows gl={{antialias:true,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,outputColorSpace:THREE.SRGBColorSpace}}><World chapters={chapters} progress={progress}/></Canvas></div>
}

Object.values(cinematicAssets).forEach(a=>useGLTF.preload(a.url));
