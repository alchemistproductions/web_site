import {notFound,redirect} from 'next/navigation'
import {revalidatePath} from 'next/cache'
import {server} from '@/lib/server'
import {ROLES,slug} from '@/lib/data'
import MediaUpload from '@/components/MediaUpload'
const log=async(s:any,a:string,d:string)=>{const {data:{user}}=await s.auth.getUser();await s.from('activity_log').insert({actor:user?.id,action:a,detail:d})}
const done=()=>revalidatePath('/admin/content')
async function addMember(fd:FormData){'use server'
 const s=server(),r=String(fd.get('role')),name=String(fd.get('name')).trim().slice(0,100);if(!ROLES.some(x=>slug(x)===r)||!name)return
 const {error}=await s.from('members').insert({role_slug:r,name});if(!error)await log(s,'add_member',`${name} / ${r}`);done()}
async function delMember(fd:FormData){'use server'
 const s=server(),id=String(fd.get('id'));const {error}=await s.from('members').delete().eq('id',id);if(!error)await log(s,'remove_member',id);done()}
async function delComment(fd:FormData){'use server'
 const s=server(),id=String(fd.get('id'));const {error}=await s.from('comments').delete().eq('id',id);if(!error)await log(s,'delete_comment',id);done()}
async function toggle(fd:FormData){'use server'
 const s=server(),v=+String(fd.get('volume')),on=fd.get('on')==='1';const {error}=await s.from('volume_settings').update({comments_enabled:!on}).eq('volume',v);if(!error)await log(s,'toggle_comments',`vol ${v} -> ${!on}`);done()}
async function delMedia(fd:FormData){'use server'
 const s=server(),n=String(fd.get('name'));const {error}=await s.storage.from('media').remove([n]);if(!error)await log(s,'delete_media',n);done()}
export default async function Content(){
 const s=server(),{data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
 const {data:me}=await s.from('admins').select('role').eq('user_id',user.id).maybeSingle();if(!me||me.role==='recruitment_manager')notFound()
 const [m,c,v,f]=await Promise.all([s.from('members').select('*').order('role_slug'),s.from('comments').select('id,volume,body,created_at,profiles(display_name)').order('created_at',{ascending:false}).limit(50),s.from('volume_settings').select('*').order('volume'),s.storage.from('media').list('',{limit:100,sortBy:{column:'created_at',order:'desc'}})])
 const H=({children}:any)=><h2 className="h mb-3 mt-12 text-3xl">{children}</h2>
 return(<main className="mx-auto max-w-4xl px-5 pb-16 pt-24"><h1 className="h text-5xl">Content &amp; moderation</h1>
 <H>Department members</H>
 <form action={addMember} className="mb-3 flex flex-wrap gap-2"><select name="role" className="in max-w-[14rem]" aria-label="Role">{ROLES.map(r=><option key={r} value={slug(r)}>{r}</option>)}</select><input name="name" required maxLength={100} placeholder="Member name" className="in max-w-xs" aria-label="Name"/><button className="h bg-white px-4 text-black">Add</button></form>
 {m.data?.map(x=><form key={x.id} action={delMember} className="flex justify-between border-b border-white/10 py-1"><input type="hidden" name="id" value={x.id}/><span>{x.name} <span className="text-white/50">({x.role_slug})</span></span><button className="text-xs uppercase text-red-400">Remove</button></form>)}
 <H>Comments by volume</H>
 <div className="mb-4 flex flex-wrap gap-2">{v.data?.map(x=><form key={x.volume} action={toggle}><input type="hidden" name="volume" value={x.volume}/><input type="hidden" name="on" value={x.comments_enabled?'1':'0'}/><button className="border border-white/30 px-3 py-1 text-xs">Vol {x.volume}: {x.comments_enabled?'on':'off'}</button></form>)}</div>
 {c.data?.map((x:any)=><form key={x.id} action={delComment} className="mb-1 flex items-start justify-between gap-3 bg-white/5 p-2"><input type="hidden" name="id" value={x.id}/><p className="min-w-0 break-words text-sm"><b>Vol {x.volume}</b> · {x.profiles?.display_name} — {x.body}</p><button className="shrink-0 text-xs uppercase text-red-400">Delete</button></form>)}
 <H>Media</H><MediaUpload/>
 <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">{f.data?.filter(o=>o.name!=='.emptyFolderPlaceholder').map(o=>{const u=s.storage.from('media').getPublicUrl(o.name).data.publicUrl;return(<form key={o.name} action={delMedia} className="text-xs"><input type="hidden" name="name" value={o.name}/><a href={u} target="_blank" rel="noopener noreferrer" className="block break-all underline">{o.name}</a><button className="mt-1 uppercase text-red-400">Delete</button></form>)})}</div></main>)}
