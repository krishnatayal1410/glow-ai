import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import{ImmersiveSite,navigate}from'./ImmersiveSite';
import{OperatingOS}from'./OperatingOS';
import{isHosted,supabase}from'./supabase';
import{SITE_PAGES}from'./config';
import'./styles.css';
function routeNow(){return(location.hash||'#home').slice(1)}
function useRoute(){const[r,setR]=useState(routeNow());useEffect(()=>{const f=()=>setR(routeNow());addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);return r}
function Login(){const[email,setEmail]=useState('owner@demo.munaffa.in'),[status,setStatus]=useState('');const enter=async()=>{if(!supabase){setStatus('Demo mode — opening Owner Command Center.');setTimeout(()=>navigate('app/owner'),450);return}const{error}=await supabase.auth.signInWithOtp({email});setStatus(error?error.message:'Magic link sent. Check your inbox.')};return <div className="login-v2"><button className="cin-brand dark" onClick={()=>navigate('home')}><span>M</span><b>Munaffa</b></button><section><small>{isHosted?'SUPABASE AUTH CONNECTED':'DEMO AUTH MODE'}</small><h1>Run the restaurant.<br/>Know the profit.</h1><p>Production authentication uses Supabase magic links and role memberships. Demo mode opens the product without external credentials.</p><label>Email<input value={email} onChange={e=>setEmail(e.target.value)}/></label><button onClick={enter}>Continue</button><em>{status}</em></section></div>}
function App(){const route=useRoute();if(route==='login')return <Login/>;if(route.startsWith('app/'))return <OperatingOS role={route.split('/')[1]||'owner'}/>;return <><div className="route-curtain-v2"/><ImmersiveSite route={SITE_PAGES[route]?route:'home'}/></>}
createRoot(document.getElementById('root')).render(<App/>);
