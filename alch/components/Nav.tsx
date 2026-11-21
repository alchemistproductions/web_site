'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect,useState} from 'react'
import {VOLUMES,pad} from '@/lib/data'
export default function Nav(){
 const [o,setO]=useState(false),p=usePathname()
 useEffect(()=>setO(false),[p])
 return(<header className="fixed inset-x-0 top-0 z-50 bg-[#0a0d12]/85 backdrop-blur">
 <div className="flex items-center justify-between px-5 py-3"><Link href="/" className="h text-2xl">Alchemist</Link>
 <button aria-expanded={o} onClick={()=>setO(!o)} className="h text-lg">{o?'Close':'Menu'}</button></div>
 {o&&<nav aria-label="Main" className="max-h-[85vh] overflow-auto border-t border-white/10 p-6">
 <div className="h mb-6 flex flex-wrap gap-x-6 gap-y-2 text-xl">{[['/#who','Who we are'],['/#roles','Roles'],['/#genres','Genres'],['/join','Join us'],['/login','Account']].map(([u,t])=><Link key={u} href={u}>{t}</Link>)}</div>
 <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{VOLUMES.map(v=><Link key={v.n} href={`/volumes/${v.n}`} style={{color:v.c}} className="h text-lg">VOL. {pad(v.n)} <span className="text-white/60">{v.art}</span></Link>)}</div></nav>}</header>)}
