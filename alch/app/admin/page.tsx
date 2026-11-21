import Link from 'next/link'
import {notFound,redirect} from 'next/navigation'
import {revalidatePath} from 'next/cache'
import {server} from '@/lib/server'
const ST=['pending','shortlisted','accepted','rejected']
async function setStatus(fd:FormData){'use server'
 const s=server(),{data:{user}}=await s.auth.getUser();if(!user)return
 const id=String(fd.get('id')),st=String(fd.get('status'));if(!ST.includes(st))return
 const {error}=await s.from('applications').update({status:st}).eq('id',id) // RLS: only admin roles can do this
 if(!error)await s.from('activity_log').insert({actor:user.id,action:'application_status',detail:`${id} -> ${st}`})
 revalidatePath('/admin')}
export default async function Admin({searchParams}:{searchParams:{q?:string;status?:string}}){
 const s=server(),{data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:me}=await s.from('admins').select('role').eq('user_id',user.id).maybeSingle();if(!me)notFound()
 let q=s.from('applications').select('*').order('created_at',{ascending:false})
 if(ST.includes(searchParams.status??''))q=q.eq('status',searchParams.status)
 const t=(searchParams.q??'').replace(/[^\w @.\-]/g,'');if(t)q=q.or(`full_name.ilike.%${t}%,email.ilike.%${t}%`)
 const {data:apps}=await q
 return(<main className="mx-auto max-w-5xl px-5 pb-16 pt-24"><h1 className="h text-5xl">Admin · {me.role.replace('_',' ')}</h1>
 <nav className="mt-4 flex gap-5 text-sm underline"><Link href="/admin/content">Content &amp; moderation</Link>{me.role==='super_admin'&&<Link href="/admin/team">Team &amp; activity</Link>}</nav>
 <form className="my-6 flex flex-wrap gap-2"><input name="q" defaultValue={searchParams.q} placeholder="Search name or email" className="in max-w-xs" aria-label="Search"/>
  <select name="status" defaultValue={searchParams.status??''} className="in max-w-[10rem]" aria-label="Status"><option value="">All</option>{ST.map(x=><option key={x}>{x}</option>)}</select><button className="h bg-white px-4 text-black">Filter</button></form>
 {!apps?.length&&<p className="text-white/60">No applications to show.</p>}
 {apps?.map(a=><details key={a.id} className="mb-2 bg-white/5 p-4"><summary className="flex cursor-pointer justify-between gap-3"><span>{a.full_name} — {a.role}</span><span className="h">{a.status}</span></summary>
  <dl className="mt-3 grid gap-1 text-sm">{Object.entries(a).map(([k,v])=><div key={k}><dt className="inline text-white/50">{k}: </dt><dd className="inline whitespace-pre-wrap">{String(v)}</dd></div>)}</dl>
  <form action={setStatus} className="mt-3 flex flex-wrap gap-2"><input type="hidden" name="id" value={a.id}/>{ST.map(x=><button key={x} name="status" value={x} className="border border-white/30 px-3 py-1 text-xs uppercase">{x}</button>)}</form></details>)}</main>)}
