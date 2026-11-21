'use client'
import {useEffect,useState} from 'react'
import {sb} from '@/lib/browser'
type M='in'|'up'|'forgot'|'reset'|'me'
export default function Login(){
 const s=sb(),[mode,setMode]=useState<M>('in'),[f,setF]=useState({email:'',password:'',name:''}),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false),[user,setUser]=useState<any>(null)
 useEffect(()=>{s.auth.getUser().then(async({data})=>{if(!data.user)return;setUser(data.user)
  const {data:p}=await s.from('profiles').select('display_name').eq('id',data.user.id).maybeSingle();setF(x=>({...x,name:p?.display_name??''}))
  setMode(new URLSearchParams(location.search).get('reset')?'reset':'me')})},[])
 const set=(k:string)=>(e:any)=>setF({...f,[k]:e.target.value})
 async function go(e:any){e.preventDefault();setBusy(true);setMsg('');let r:any;const o=location.origin
  if(mode==='in'){r=await s.auth.signInWithPassword({email:f.email,password:f.password});if(!r.error){location.href='/';return}}
  else if(mode==='up'){r=await s.auth.signUp({email:f.email,password:f.password,options:{data:{display_name:f.name},emailRedirectTo:`${o}/auth/callback`}});if(!r.error)setMsg('Check your inbox and verify your email to finish signing up.')}
  else if(mode==='forgot'){r=await s.auth.resetPasswordForEmail(f.email,{redirectTo:`${o}/auth/callback?next=${encodeURIComponent('/login?reset=1')}`});if(!r.error)setMsg('Password reset link sent. Check your inbox.')}
  else if(mode==='reset'){r=await s.auth.updateUser({password:f.password});if(!r.error)setMsg('Password updated.')}
  else{r=await s.from('profiles').update({display_name:f.name.trim()}).eq('id',user.id);if(!r.error)setMsg('Profile saved.')}
  if(r?.error)setMsg(r.error.message);setBusy(false)}
 const T={in:'Sign in',up:'Create account',forgot:'Reset password',reset:'Set new password',me:'Your profile'}[mode]
 return(<main className="mx-auto max-w-md px-5 pb-20 pt-28"><h1 className="h text-6xl">{T}</h1>
 <form onSubmit={go} className="mt-6 space-y-3">
  {(mode==='up'||mode==='me')&&<input className="in" required minLength={1} maxLength={40} placeholder="Display name" value={f.name} onChange={set('name')} aria-label="Display name"/>}
  {['in','up','forgot'].includes(mode)&&<input className="in" type="email" required placeholder="Email address" value={f.email} onChange={set('email')} aria-label="Email address"/>}
  {['in','up','reset'].includes(mode)&&<input className="in" type="password" required minLength={8} placeholder="Password (8+ characters)" value={f.password} onChange={set('password')} aria-label="Password"/>}
  {mode==='me'&&<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Profile picture" className="in" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;const p=`${user.id}/avatar-${Date.now()}`;const {error}=await s.storage.from('avatars').upload(p,file);if(error)return setMsg('Upload failed. Use a JPG, PNG or WebP under 2 MB.');await s.from('profiles').update({avatar_url:s.storage.from('avatars').getPublicUrl(p).data.publicUrl}).eq('id',user.id);setMsg('Profile picture updated.')}}/>}
  <button disabled={busy} className="h w-full bg-white py-3 text-2xl text-black disabled:opacity-50">{busy?'Please wait…':mode==='me'?'Save profile':T}</button>
  {msg&&<p role="status" className="text-sm text-white/80">{msg}</p>}</form>
 <div className="mt-6 flex flex-wrap gap-4 text-sm underline">
  {mode==='me'?<button onClick={async()=>{await s.auth.signOut();location.href='/'}}>Sign out</button>:<>
  {mode!=='in'&&<button onClick={()=>setMode('in')}>Sign in</button>}{mode!=='up'&&<button onClick={()=>setMode('up')}>Create account</button>}{mode!=='forgot'&&mode!=='reset'&&<button onClick={()=>setMode('forgot')}>Forgot password?</button>}</>}</div></main>)}
