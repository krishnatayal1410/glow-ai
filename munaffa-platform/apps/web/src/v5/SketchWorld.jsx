import React,{useEffect,useRef,useState}from'react';
import{WORLD_MODELS}from'./worlds';

let apiPromise;
function loadViewer(){
 if(window.Sketchfab)return Promise.resolve(window.Sketchfab);
 if(apiPromise)return apiPromise;
 apiPromise=new Promise((resolve,reject)=>{
  const found=document.querySelector('script[data-munaffa-sketchfab]');
  if(found){found.addEventListener('load',()=>resolve(window.Sketchfab),{once:true});found.addEventListener('error',reject,{once:true});return}
  const s=document.createElement('script');s.src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';s.async=true;s.dataset.munaffaSketchfab='1';s.onload=()=>resolve(window.Sketchfab);s.onerror=reject;document.head.appendChild(s);
 });
 return apiPromise;
}
const clamp=v=>Math.max(0,Math.min(1,v));

export default function SketchWorld({modelKey,progress=0,active=true,camera={}}){
 const model=WORLD_MODELS[modelKey];
 const iframeRef=useRef(null),apiRef=useRef(null),baseRef=useRef(null),lastRef=useRef(-1);
 const[ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{
  let dead=false;
  setReady(false);setFailed(false);apiRef.current=null;baseRef.current=null;lastRef.current=-1;
  if(!model)return;
  loadViewer().then(Sketchfab=>{
   if(dead||!iframeRef.current)return;
   const client=new Sketchfab('1.12.1',iframeRef.current);
   client.init(model.uid,{
    autostart:1,preload:1,camera:0,scrollwheel:0,dnt:1,
    ui_infos:0,ui_help:0,ui_hint:0,ui_settings:0,ui_vr:0,ui_fullscreen:0,ui_inspector:0,ui_watermark_link:0,
    success(api){
     if(dead)return;apiRef.current=api;api.start();api.addEventListener('viewerready',()=>{
      if(dead)return;api.setUserInteraction(false);api.getCameraLookAt((err,value)=>{if(!err&&value){baseRef.current=value;setReady(true)}})
     })
    },
    error(){if(!dead)setFailed(true)}
   });
  }).catch(()=>!dead&&setFailed(true));
  return()=>{dead=true;try{apiRef.current?.stop?.()}catch{}apiRef.current=null;baseRef.current=null};
 },[modelKey]);
 useEffect(()=>{
  const api=apiRef.current,b=baseRef.current;if(!api||!b||!ready||!active)return;
  const p=clamp(progress);if(Math.abs(p-lastRef.current)<.003)return;lastRef.current=p;
  const v=[b.position[0]-b.target[0],b.position[1]-b.target[1],b.position[2]-b.target[2]];
  const orbit=(camera.orbit??.14)*(p-.5)*2,dolly=(camera.dolly??.2)*p,lift=(camera.lift??.04)*Math.sin(p*Math.PI);
  const c=Math.cos(orbit),s=Math.sin(orbit);const x=v[0]*c-v[2]*s,z=v[0]*s+v[2]*c,scale=1-dolly;
  const pos=[b.target[0]+x*scale,b.target[1]+v[1]*scale+lift,b.target[2]+z*scale];
  const target=[b.target[0]+Math.sin(p*Math.PI)*.035,b.target[1]+lift*.2,b.target[2]];
  try{api.setCameraLookAt(pos,target,0);api.setFov(47-p*5)}catch{}
 },[progress,ready,active,camera.orbit,camera.dolly,camera.lift]);
 if(!model)return null;
 return <div className={'m5-world '+(active?'is-active':'')} aria-hidden={!active}>
  {!failed&&<iframe ref={iframeRef} title={model.name} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen/>}
  {!ready&&!failed&&<div className="m5-loader"><i/><span>Entering {model.kind} environment</span></div>}
  {failed&&<div className="m5-scene-failed"><strong>3D environment unavailable.</strong><span>The product UI remains usable; refresh to retry the live scene.</span></div>}
  <div className="m5-credit"><span>{model.name}</span><small>{model.credit} · prototype environment</small></div>
 </div>
}
