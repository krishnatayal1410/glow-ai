import {createClient} from '@supabase/supabase-js';
import {distanceKm,demoVenues} from './data';

const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase=url&&key?createClient(url,key):null;
const STORE='munaffa:v2';
export const loadLocal=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}};
export const saveLocal=patch=>{const next={...loadLocal(),...patch};localStorage.setItem(STORE,JSON.stringify(next));return next};
export const clearLocal=()=>localStorage.removeItem(STORE);

export async function signUpUser({name,email,password,phone}){
 if(supabase){const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name,phone}}});if(error)throw error;return {user:data.user,session:data.session,needsEmailConfirmation:!data.session};}
 const user={id:'demo-'+Date.now(),email,user_metadata:{full_name:name,phone}};saveLocal({demoUser:user});return {user,session:{user},demo:true};
}
export async function signInUser({email,password}){
 if(supabase){const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;return data;}
 const existing=loadLocal().demoUser||{id:'demo-returning',email,user_metadata:{full_name:'Demo User'}};saveLocal({demoUser:existing});return {user:existing,session:{user:existing},demo:true};
}
export async function signOutUser(){if(supabase)await supabase.auth.signOut();clearLocal();}
export async function getInitialSession(){if(supabase){const {data}=await supabase.auth.getSession();return data.session;}const u=loadLocal().demoUser;return u?{user:u}:null;}
export async function persistProfile(profile){
 saveLocal({profile});
 if(supabase){const {data:{user}}=await supabase.auth.getUser();if(user){await supabase.from('profiles').upsert({id:user.id,full_name:profile.name,phone:profile.phone||null,default_mode:profile.mode,preferences:profile.preferences||{},updated_at:new Date().toISOString()});}}
 return profile;
}
export async function getSavedProfile(){const local=loadLocal().profile;if(local)return local;if(!supabase)return null;const {data:{user}}=await supabase.auth.getUser();if(!user)return null;const {data}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();return data?{name:data.full_name,phone:data.phone,mode:data.default_mode,preferences:data.preferences||{},onboarded:true}:null;}
export function requestLocation(){return new Promise(resolve=>{if(!navigator.geolocation)return resolve(null);navigator.geolocation.getCurrentPosition(p=>resolve({lat:p.coords.latitude,lng:p.coords.longitude,accuracy:p.coords.accuracy}),()=>resolve(null),{enableHighAccuracy:false,timeout:7000,maximumAge:300000});});}
export function nearbyVenues(location,query='',type='all',radius=25){const q=query.trim().toLowerCase();return demoVenues.map(v=>({...v,distance:location?distanceKm(location,v):null})).filter(v=>(type==='all'||v.type===type)&&(!q||[v.name,v.area,...v.cuisines,...v.tags].join(' ').toLowerCase().includes(q))&&(v.distance==null||v.distance<=radius)).sort((a,b)=>(a.distance??999)-(b.distance??999)||b.rating-a.rating);}
export function money(v){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(v)}
export function uid(prefix='id'){return `${prefix}_${Math.random().toString(36).slice(2,9)}${Date.now().toString(36).slice(-4)}`}
