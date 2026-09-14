import React,{useMemo,useState}from'react';
import{ArrowRight,BriefcaseBusiness,ChefHat,Coffee,CreditCard,Hotel,PackageCheck,ShieldCheck,Store,UserRound,Users,UtensilsCrossed}from'lucide-react';
import{supabase,supabaseConfigured}from'../lib/supabase';

const go=r=>location.hash=r;
const PROFILE_KEY='munaffa:profile:v1';
export const readProfile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE_KEY))}catch{return null}};
export const saveProfile=p=>localStorage.setItem(PROFILE_KEY,JSON.stringify(p));

function AuthCard(){
 const[mode,setMode]=useState('signup'),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const submit=async e=>{e.preventDefault();setBusy(true);setMessage('');try{
  if(supabaseConfigured){
   if(mode==='signup'){
    const{data,error}=await supabase.auth.signUp({email,password,options:{data:{name}}});if(error)throw error;
    localStorage.setItem('munaffa:pending-user',JSON.stringify({id:data.user?.id,email,name}));go('onboarding');
   }else{
    const{data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;
    const profile=readProfile();go(profile?destination(profile):'onboarding');
   }
  }else{
   const demo={id:'local-demo-user',email,name:name||email.split('@')[0]||'Demo user'};localStorage.setItem('munaffa:pending-user',JSON.stringify(demo));
   if(mode==='signup')go('onboarding');else{const profile=readProfile();go(profile?destination(profile):'onboarding')}
  }
 }catch(err){setMessage(err.message||'Unable to continue.')}finally{setBusy(false)}};
 return <div className="auth-card"><div className="auth-tabs"><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Create account</button><button className={mode==='signin'?'active':''} onClick={()=>setMode('signin')}>Sign in</button></div><small>{supabaseConfigured?'SECURE SUPABASE AUTH':'LOCAL DEMO MODE · ADD SUPABASE KEYS FOR PRODUCTION AUTH'}</small><h1>{mode==='signup'?'Start with the role you actually have.':'Welcome back.'}</h1><p>{mode==='signup'?'Munaffa changes completely depending on whether you are a guest, owner, manager or staff member.':'Sign in to continue into your last Munaffa workspace.'}</p><form onSubmit={submit}>{mode==='signup'&&<label>Name<input value={name} onChange={e=>setName(e.target.value)} required placeholder="Your name"/></label>}<label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="you@example.com"/></label><label>Password<input value={password} onChange={e=>setPassword(e.target.value)} required type="password" minLength={6} placeholder="Minimum 6 characters"/></label>{message&&<div className="auth-error">{message}</div>}<button className="auth-submit" disabled={busy}>{busy?'Working…':mode==='signup'?'Create account':'Sign in'} <ArrowRight/></button></form><button className="auth-back" onClick={()=>go('story')}>← Back to Munaffa story</button></div>
}

const roleChoices=[
 ['customer','I’m here to discover & order',UserRound,'Find restaurants, cafés and hotel dining. Browse, book, order and manage direct restaurant relationships.'],
 ['owner','I own or operate a business',BriefcaseBusiness,'Set up an outlet and open the Owner Command Center, Profit OS, inventory and guest intelligence.'],
 ['manager','I manage an outlet',Store,'Run today’s floor, approvals, kitchen exceptions, stock alerts and shift controls.'],
 ['staff','I’m restaurant staff',Users,'Choose the task app you actually use: POS, waiter, kitchen or stock.']
];
const businessChoices=[['restaurant','Restaurant',UtensilsCrossed],['cafe','Café',Coffee],['qsr','QSR',Store],['hotel-fb','Hotel F&B',Hotel]];
const staffChoices=[['pos','Cashier / POS',CreditCard],['waiter','Waiter / Service',Users],['kitchen','Kitchen / KDS',ChefHat],['stock','Stock / Inventory',PackageCheck]];

function destination(profile){if(profile.mode==='customer')return'discover';if(profile.mode==='owner')return'app/owner';if(profile.mode==='manager')return'app/manager';if(profile.mode==='staff')return`app/${profile.staffRole||'waiter'}`;return'story'}

function Onboarding(){
 const[mode,setMode]=useState(null),[businessType,setBusinessType]=useState('restaurant'),[staffRole,setStaffRole]=useState('waiter'),[businessName,setBusinessName]=useState('The Spice Room');
 const pending=useMemo(()=>{try{return JSON.parse(localStorage.getItem('munaffa:pending-user'))||{}}catch{return{}}},[]);
 const complete=async()=>{if(!mode)return;const profile={userId:pending.id||'local-demo-user',name:pending.name||'Demo user',email:pending.email||'',mode,businessType:mode==='owner'?businessType:null,businessName:mode==='owner'?businessName:null,staffRole:mode==='staff'?staffRole:null,createdAt:new Date().toISOString()};saveProfile(profile);
  if(supabaseConfigured&&pending.id){await supabase.from('profiles').upsert({id:pending.id,display_name:profile.name,default_mode:mode,business_type:profile.businessType,staff_role:profile.staffRole})}
  go(destination(profile));
 };
 return <div className="onboarding"><small>PERSONALIZE MUNAFFA</small><h1>What should Munaffa open as?</h1><p>This choice controls the product you see after login. You can switch authorized roles later.</p><div className="role-grid">{roleChoices.map(([id,label,I,copy])=><button key={id} className={mode===id?'selected':''} onClick={()=>setMode(id)}><I/><b>{label}</b><span>{copy}</span></button>)}</div>{mode==='owner'&&<div className="onboarding-detail"><h2>What do you operate?</h2><div className="choice-row">{businessChoices.map(([id,label,I])=><button className={businessType===id?'selected':''} onClick={()=>setBusinessType(id)} key={id}><I/>{label}</button>)}</div><label>Business name<input value={businessName} onChange={e=>setBusinessName(e.target.value)} placeholder="Restaurant / café name"/></label></div>}{mode==='staff'&&<div className="onboarding-detail"><h2>Which staff app do you need?</h2><div className="choice-row">{staffChoices.map(([id,label,I])=><button className={staffRole===id?'selected':''} onClick={()=>setStaffRole(id)} key={id}><I/>{label}</button>)}</div></div>}<button className="onboarding-submit" disabled={!mode} onClick={complete}>Open my Munaffa <ArrowRight/></button><div className="privacy-note"><ShieldCheck/> Your selected role controls interface access; production permissions are enforced server-side with Supabase RLS.</div></div>
}

export default function AuthFlow({route}){return <main className="auth-shell"><div className="auth-visual"><button className="cine-brand" onClick={()=>go('story')}><i>M</i><b>Munaffa</b></button><div><small>THE PROFIT & OPERATIONS OS</small><h2>Hospitality in front.<br/>Operational truth underneath.</h2><p>One connected restaurant state from the guest’s table to the owner’s contribution.</p></div></div><section>{route==='onboarding'?<Onboarding/>:<AuthCard/>}</section></main>}
