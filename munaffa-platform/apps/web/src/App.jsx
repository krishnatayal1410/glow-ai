import React,{createContext,useContext,useEffect,useMemo,useState}from'react';
import ImmersiveMarketing from './features/ImmersiveMarketing';
import AuthOnboarding from './features/AuthOnboarding';
import ConsumerExperience from './features/ConsumerExperience';
import RestaurantOS from './features/RestaurantOS';
import {getInitialSession,getSavedProfile,signOutUser,saveLocal,loadLocal} from './lib/platform';
import './styles.css';

const Ctx=createContext(null);
export const useMunaffa=()=>useContext(Ctx);
const readRoute=()=>decodeURIComponent((location.hash||'#home').slice(1));
export function go(route){location.hash=route;window.scrollTo({top:0,behavior:'instant'});}

export default function App(){
 const[route,setRoute]=useState(readRoute());const[session,setSession]=useState(null);const[profile,setProfile]=useState(null);const[cart,setCart]=useState(loadLocal().cart||[]);const[activeVenue,setActiveVenue]=useState(null);const[order,setOrder]=useState(loadLocal().order||null);const[online,setOnline]=useState(navigator.onLine);const[ready,setReady]=useState(false);
 useEffect(()=>{const f=()=>setRoute(readRoute());addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
 useEffect(()=>{(async()=>{const s=await getInitialSession();setSession(s);setProfile(await getSavedProfile());setReady(true)})()},[]);
 useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);addEventListener('online',on);addEventListener('offline',off);return()=>{removeEventListener('online',on);removeEventListener('offline',off)}},[]);
 useEffect(()=>saveLocal({cart}),[cart]);useEffect(()=>saveLocal({order}),[order]);
 const value=useMemo(()=>({route,session,setSession,profile,setProfile,cart,setCart,activeVenue,setActiveVenue,order,setOrder,online,logout:async()=>{await signOutUser();setSession(null);setProfile(null);setCart([]);setOrder(null);go('home')}}),[route,session,profile,cart,activeVenue,order,online]);
 if(!ready)return <div className="boot"><div className="boot-orbit"/><strong>Munaffa</strong><span>Connecting the restaurant...</span></div>;
 let view;if(route==='auth'||route==='signup'||route==='onboarding')view=<AuthOnboarding/>;else if(route.startsWith('consumer'))view=<ConsumerExperience/>;else if(route.startsWith('app/'))view=<RestaurantOS key={route}/>;else view=<ImmersiveMarketing key={route}/>;
 return <Ctx.Provider value={value}><div className={!online?'offline app-root':'app-root'}>{!online&&<div className="offline-bar">Offline mode · actions are queued locally</div>}{view}</div></Ctx.Provider>;
}
