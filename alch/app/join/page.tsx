'use client'
import {useState} from 'react'
import {sb} from '@/lib/browser'
import {JOIN_ROLES} from '@/lib/data'
const F:[string,string,string][]=[['full_name','Full Name','text'],['age','Age','number'],['grade','Grade / Qualification / Year','text'],['institution','School / College / Institution','text'],['email','Email Address','email'],['phone','Phone Number','tel'],['city','City','text'],['role','Department / Role Applying For','select'],['experience','Previous Experience','area'],['skills','Skills','area'],['portfolio','Portfolio / Work Samples Link','url'],['intro','Short Introduction / Why do you want to join Alchemist Productions?','area']]
const L:any={full_name:100,grade:100,institution:150,phone:20,city:80,portfolio:300,skills:500,email:200}
export default function Join(){
 const [st,setSt]=useState<'idle'|'busy'|'done'|'error'>('idle')
 async function submit(e:any){e.preventDefault();setSt('busy');const d:any=Object.fromEntries(new FormData(e.target));d.age=+d.age
  const {error}=await sb().from('applications').insert(d);setSt(error?'error':'done')}
 return(<main className="min-h-screen px-4 pb-16 pt-24" style={{background:'repeating-linear-gradient(90deg,#7a0f12 0 28px,#5e0a0d 28px 56px)'}}>
 <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[260px_1fr]">
  <img src="/v/hiring.jpg" alt="ALCHEMIST PRODUCTIONS — We are hiring" className="hidden w-full md:block"/>
  <div className="paper p-6 text-[#5e0a0d] md:p-8" style={{background:'#f3ead7'}}>
  <h1 className="h text-5xl">Join Alchemist Productions</h1>
  {st==='done'?<p role="status" className="mt-6 text-xl">Application received. We'll be in touch by email.</p>:
  <form onSubmit={submit} className="mt-6 grid gap-4">{F.map(([k,l,t])=><label key={k} className="grid gap-1 text-sm font-bold">{l}
   {t==='select'?<select name={k} required className="in" defaultValue=""><option value="" disabled>Select a department</option>{JOIN_ROLES.map(r=><option key={r}>{r}</option>)}</select>:
    t==='area'?<textarea name={k} required rows={3} maxLength={1500} className="in font-normal"/>:
    <input name={k} type={t} required maxLength={L[k]} min={t==='number'?5:undefined} max={t==='number'?100:undefined} className="in font-normal"/>}</label>)}
   <button disabled={st==='busy'} className="h bg-[#a3201f] py-3 text-2xl text-white disabled:opacity-50">{st==='busy'?'Submitting…':'Apply now'}</button>
   {st==='error'&&<p role="alert" className="text-[#a3201f]">Could not submit your application. Check every field and try again.</p>}</form>}</div></div></main>)}
