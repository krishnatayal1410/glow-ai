import React,{useEffect,useRef,useState}from'react';

const ROOMS={
 home:{uid:'f65dab077a2944cebbf7959b5b41cc98',label:'Fully furnished restaurant environment',credit:'Katydid · Sketchfab · CC BY'},
 operations:{uid:'fd59924f45e14539959e95b86399e6b1',label:'Kitchen interior environment',credit:'mehta2155 · Sketchfab · CC BY'},
 discovery:{uid:'0c4d6d98c48c46e6b71f2914fd049c8e',label:'Modern café environment',credit:'dylanheyes · Sketchfab · CC BY'}
};

function loadSketchfab(){return new Promise((resolve,reject)=>{if(window.Sketchfab)return resolve(window.Sketchfab);const old=document.querySelector('script[data-munaffa-sketchfab]');if(old){old.addEventListener('load',()=>resolve(window.Sketchfab),{once:true});return}const s=document.createElement('script');s.src='https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';s.async=true;s.dataset.munaffaSketchfab='1';s.onload=()=>resolve(window.Sketchfab);s.onerror=reject;document.head.appendChild(s)})}

export default function SketchfabWorld({route,progress,onFallback}){
 const room=ROOMS[route],frame=useRef(null),apiRef=useRef(null),base=useRef(null),last=useRef(-1),[ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{let dead=false;if(!room)return;loadSketchfab().then(Sketchfab=>{if(dead||!frame.current)return;const client=new Sketchfab('1.12.1',frame.current);client.init(room.uid,{autostart:1,preload:0,camera:0,scrollwheel:0,dnt:1,ui_infos:0,ui_help:0,ui_hint:0,ui_settings:0,ui_vr:0,ui_fullscreen:0,ui_inspector:0,success(api){if(dead)return;apiRef.current=api;api.start();api.addEventListener('viewerready',()=>{if(dead)return;api.setUserInteraction(false);api.setCameraEasing('easeLinear');api.getCameraLookAt((err,camera)=>{if(!err){base.current=camera;setReady(true)}})})},error(){if(!dead){setFailed(true);onFallback?.()}}})}).catch(()=>{if(!dead){setFailed(true);onFallback?.()}});return()=>{dead=true;apiRef.current?.stop?.();apiRef.current=null;base.current=null}},[room?.uid]);
 useEffect(()=>{const api=apiRef.current,b=base.current;if(!api||!b||!ready||Math.abs(progress-last.current)<.002)return;last.current=progress;const p=Math.max(0,Math.min(1,progress)),v=[b.position[0]-b.target[0],b.position[1]-b.target[1],b.position[2]-b.target[2]],scale=1-.26*p,phase=(p-.5)*.34,c=Math.cos(phase),s=Math.sin(phase);let x=v[0]*c-v[1]*s,y=v[0]*s+v[1]*c,z=v[2];const pos=[b.target[0]+x*scale,b.target[1]+y*scale,b.target[2]+z*scale];const target=[b.target[0]+Math.sin(p*Math.PI)*.08,b.target[1],b.target[2]+Math.sin(p*Math.PI*1.7)*.05];api.setCameraLookAt(pos,target,0);api.setFov(46-p*8)},[progress,ready]);
 if(!room||failed)return null;
 return <div className={`sf-world sf-${route} ${ready?'ready':''}`}><iframe ref={frame} title={room.label} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen/><div className="sf-shade"/><div className="sf-credit"><span>{room.label}</span><small>{room.credit}</small></div>{!ready&&<div className="sf-loading"><i/><span>Entering 3D environment…</span></div>}</div>
}
