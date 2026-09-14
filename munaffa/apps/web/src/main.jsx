import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import Router from'./Router';
import'./styles.css';
import'./flows.css';
import'./cinematic/cinematic.css';
const read=()=>decodeURIComponent((location.hash||'#story').slice(1));
function Root(){const[route,setRoute]=useState(read());useEffect(()=>{const f=()=>{setRoute(read());scrollTo({top:0,behavior:'instant'})};addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);return <Router route={route}/>}
createRoot(document.getElementById('root')).render(<Root/>);
