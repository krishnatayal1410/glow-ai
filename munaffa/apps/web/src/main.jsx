import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import App from'./App';
import'./styles.css';
const read=()=>decodeURIComponent((location.hash||'#story').slice(1));
function Root(){const[route,setRoute]=useState(read());useEffect(()=>{const f=()=>setRoute(read());addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);return <App route={route}/>}
createRoot(document.getElementById('root')).render(<Root/>);
