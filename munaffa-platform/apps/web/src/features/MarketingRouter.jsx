import React,{useEffect,useState}from'react';
import ImmersiveMarketing from'./ImmersiveMarketing';
import SketchfabWorld from'./SketchfabWorld';

const ROOM_ROUTES=new Set(['home','operations','discovery']);
function usePageProgress(){const[p,setP]=useState(0);useEffect(()=>{let frame=0;const read=()=>{if(frame)return;frame=requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;setP(max?scrollY/max:0);frame=0})};addEventListener('scroll',read,{passive:true});read();return()=>{removeEventListener('scroll',read);cancelAnimationFrame(frame)}},[]);return p}
export default function MarketingRouter(){const route=decodeURIComponent((location.hash||'#home').slice(1)).split('/')[0]||'home',progress=usePageProgress();return <><ImmersiveMarketing/>{ROOM_ROUTES.has(route)&&<SketchfabWorld key={route} route={route} progress={progress}/>}</>}
