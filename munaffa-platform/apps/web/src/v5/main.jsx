import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import PublicSite from'./PublicSite';
import{ROUTES}from'./worlds';
import'./styles.css';
const read=()=>decodeURIComponent((location.hash||'#home').slice(1));
function App(){const[route,setRoute]=useState(read());useEffect(()=>{const f=()=>{setRoute(read());scrollTo({top:0,behavior:'instant'})};addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);return <PublicSite key={route} route={ROUTES[route]?route:'home'}/>}
createRoot(document.getElementById('root')).render(<App/>);
