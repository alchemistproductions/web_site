'use client'
import {useCallback,useEffect,useState} from 'react'
import Link from 'next/link'
import {sb} from '@/lib/browser'
const when=(d:string)=>new Date(d).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})
export default function Comments({volume,enabled,color}:{volume:number;enabled:boolean;color:string}){
 const s=sb()
 const [me,setMe]=useState<string|null>(null),[adm,setAdm]=useState(false),[list,setList]=useState<any[]|null>(null)
 const [text,setText]=useState(''),[reply,setReply]=useState<string|null>(null),[edit,setEdit]=useState<string|null>(null),[err,setErr]=useState(''),[busy,setBusy]=useState(false)
 const load=useCallback(async()=>{const {data}=await s.from('comments').select('*,profiles(display_name,avatar_url)').eq('volume',volume).order('created_at');setList(data??[])},[volume])
 useEffect(()=>{load();s.auth.getUser().then(async({data})=>{setMe(data.user?.id??null);if(data.user){const {data:a}=await s.from('admins').select('role').eq('user_id',data.user.id).maybeSingle();setAdm(!!a&&a.role!=='recruitment_manager')}})},[load])
 async function send(e:any){e.preventDefault();const body=text.trim();if(!body||busy)return;setBusy(true);setErr('')
  const {error}=edit?await s.from('comments').update({body,edited_at:new Date().toISOString()}).eq('id',edit):await s.from('comments').insert({volume,body,parent_id:reply,user_id:me})
  setBusy(false);if(error)return setErr(error.message.includes('Slow')?'Too many comments in a minute. Wait a moment and try again.':'Could not post your comment. Try again.')
  setText('');setReply(null);setEdit(null);load()}
 const del=async(id:string)=>{if(confirm('Delete this comment?')){await s.from('comments').delete().eq('id',id);load()}}
 const item=(c:any,sub=false)=>(<article key={c.id} className={`flex gap-3 bg-white/5 p-4 ${sub?'ml-8 mt-2':'mt-3'}`} style={{borderLeft:`3px solid ${color}`}}>
  {c.profiles?.avatar_url?<img src={c.profiles.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover"/>:<div className="h grid h-10 w-10 shrink-0 place-items-center rounded-full text-black" style={{background:color}}>{(c.profiles?.display_name??'?')[0]}</div>}
  <div className="min-w-0 flex-1"><p className="text-sm"><b>{c.profiles?.display_name??'Member'}</b> <span className="text-white/50">{when(c.created_at)}{c.edited_at&&' (edited)'}</span></p>
  <p className="mt-1 whitespace-pre-wrap break-words">{c.body}</p>
  <div className="mt-2 flex gap-4 text-xs uppercase tracking-widest text-white/60">
   {me&&enabled&&<button onClick={()=>{setReply(c.parent_id??c.id);setEdit(null);setText('')}}>Reply</button>}
   {c.user_id===me&&<button onClick={()=>{setEdit(c.id);setText(c.body);setReply(null)}}>Edit</button>}
   {(c.user_id===me||adm)&&<button onClick={()=>del(c.id)}>Delete</button>}</div></div></article>)
 return(<section className="mx-auto mt-20 max-w-3xl"><div className="flex items-end justify-between"><h2 className="h text-4xl">Discussion</h2>
  {adm&&<button className="text-xs uppercase underline" onClick={async()=>{await s.from('volume_settings').update({comments_enabled:!enabled}).eq('volume',volume);location.reload()}}>{enabled?'Disable':'Enable'} comments</button>}</div>
  {list===null?<p className="mt-4 animate-pulse text-white/50">Loading comments…</p>:list.length===0?<p className="mt-4 text-white/50">No comments yet. Start the conversation.</p>:
   list.filter(c=>!c.parent_id).map(c=><div key={c.id}>{item(c)}{list.filter(r=>r.parent_id===c.id).map(r=>item(r,true))}</div>)}
  {!enabled?<p className="mt-6 text-white/60">Comments are turned off for this volume.</p>:me?
  <form onSubmit={send} className="mt-6">{(reply||edit)&&<p className="mb-1 text-sm text-white/60">{edit?'Editing your comment':'Replying'} · <button type="button" className="underline" onClick={()=>{setReply(null);setEdit(null);setText('')}}>cancel</button></p>}
   <textarea className="in" rows={3} maxLength={1000} required value={text} onChange={e=>setText(e.target.value)} placeholder="Share your thoughts on this volume" aria-label="Comment"/>
   <button disabled={busy} className="h mt-2 px-6 py-2 text-black disabled:opacity-50" style={{background:color}}>{busy?'Posting…':edit?'Save changes':'Post comment'}</button>
   {err&&<p role="alert" className="mt-2 text-red-400">{err}</p>}</form>:
  <p className="mt-6"><Link href="/login" className="underline">Sign in</Link> to join the discussion.</p>}</section>)}
