import {notFound,redirect} from 'next/navigation'
import {revalidatePath} from 'next/cache'
import {server} from '@/lib/server'
const R=['admin','recruitment_manager','content_manager']
const log=async(s:any,a:string,d:string)=>{const {data:{user}}=await s.auth.getUser();await s.from('activity_log').insert({actor:user?.id,action:a,detail:d})}
async function add(fd:FormData){'use server'
 const {error}=await server().rpc('add_admin',{p_email:String(fd.get('email')),p_role:String(fd.get('role'))})
 revalidatePath('/admin/team');if(error)redirect('/admin/team?e='+encodeURIComponent(error.message))}
async function setRole(fd:FormData){'use server'
 const s=server(),r=String(fd.get('role')),id=String(fd.get('id'));if(!R.includes(r))return
 const {error}=await s.from('admins').update({role:r}).eq('user_id',id);if(!error)await log(s,'set_role',`${id} -> ${r}`);revalidatePath('/admin/team')}
async function remove(fd:FormData){'use server'
 const s=server(),id=String(fd.get('id'));const {error}=await s.from('admins').delete().eq('user_id',id) // RLS blocks Super Admin rows
 if(!error)await log(s,'remove_admin',id);revalidatePath('/admin/team')}
export default async function Team({searchParams}:{searchParams:{e?:string}}){
 const s=server(),{data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:me}=await s.from('admins').select('role').eq('user_id',user.id).maybeSingle();if(me?.role!=='super_admin')notFound()
 const {data:admins}=await s.rpc('list_admins'),{data:logs}=await s.from('activity_log').select('*').order('created_at',{ascending:false}).limit(50)
 return(<main className="mx-auto max-w-4xl px-5 pb-16 pt-24"><h1 className="h text-5xl">Team &amp; activity</h1>
 <form action={add} className="my-6 flex flex-wrap gap-2"><input name="email" type="email" required placeholder="Verified account email" className="in max-w-xs" aria-label="Email"/>
  <select name="role" className="in max-w-[12rem]" aria-label="Role">{R.map(r=><option key={r} value={r}>{r.replace('_',' ')}</option>)}</select><button className="h bg-white px-4 text-black">Add admin</button></form>
 {searchParams.e&&<p role="alert" className="mb-4 text-red-400">{searchParams.e}</p>}
 {admins?.map((a:any)=><div key={a.user_id} className="mb-2 flex flex-wrap items-center justify-between gap-2 bg-white/5 p-3"><span>{a.email}</span>
  {a.role==='super_admin'?<span className="h">Super Admin</span>:<div className="flex gap-2"><form action={setRole} className="flex gap-2"><input type="hidden" name="id" value={a.user_id}/>
   <select name="role" defaultValue={a.role} className="in" aria-label="Role">{R.map(r=><option key={r} value={r}>{r.replace('_',' ')}</option>)}</select><button className="border border-white/30 px-3 text-xs uppercase">Save</button></form>
   <form action={remove}><input type="hidden" name="id" value={a.user_id}/><button className="border border-red-400 px-3 py-2 text-xs uppercase text-red-400">Remove</button></form></div>}</div>)}
 <h2 className="h mb-3 mt-10 text-3xl">Activity log</h2>
 {logs?.map((l:any)=><p key={l.id} className="text-sm text-white/70">{new Date(l.created_at).toLocaleString('en-IN')} · {l.action} · {l.detail}</p>)}</main>)}
