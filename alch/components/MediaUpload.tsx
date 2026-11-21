'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {sb} from '@/lib/browser'
export default function MediaUpload(){
 const r=useRouter(),[st,setSt]=useState('')
 async function up(e:any){const f=e.target.files?.[0];if(!f)return;setSt('Uploading…')
  const {error}=await sb().storage.from('media').upload(`${Date.now()}-${f.name.replace(/[^\w.\-]/g,'_')}`,f)
  setSt(error?'Upload failed. Use JPG, PNG, WebP or MP4 under 20 MB.':'Uploaded.');if(!error)r.refresh()}
 return(<div><input type="file" accept="image/jpeg,image/png,image/webp,video/mp4" onChange={up} aria-label="Upload media" className="in"/><p role="status" className="mt-1 text-sm text-white/70">{st}</p></div>)}
