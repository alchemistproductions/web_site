import Link from 'next/link'
import {notFound} from 'next/navigation'
import {server} from '@/lib/server'
import {VOLUMES,pad} from '@/lib/data'
import Comments from '@/components/Comments'
export function generateMetadata({params}:{params:{n:string}}){const v=VOLUMES.find(x=>x.n===+params.n);return{title:v?`VOL. ${pad(v.n)} ${v.edition} | ALCHEMIST PRODUCTIONS`:'Volume'}}
export default async function Page({params}:{params:{n:string}}){
 const n=+params.n,v=VOLUMES.find(x=>x.n===n);if(!v)notFound()
 const {data}=await server().from('volume_settings').select('comments_enabled').eq('volume',n).maybeSingle()
 const pv=VOLUMES.find(x=>x.n===n-1),nx=VOLUMES.find(x=>x.n===n+1)
 return(<main className="px-5 pb-20 pt-24">
 <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(0,420px)_1fr]">
  <img src={`/v/${pad(n)}.jpg`} alt={`ALCHEMIST VOL. ${pad(n)} ${v.edition}`} className="up w-full" style={{boxShadow:`0 0 90px ${v.c}44`}}/>
  <div className="up flex flex-col justify-between gap-10">
   <div><h1 className="h text-[16vw] md:text-9xl" style={{color:v.c}}>ALCHEMIST</h1><p className="text-3xl">VOL. {pad(n)}</p><p className="mt-6 text-right text-2xl">{v.edition}</p></div>
   <p className="text-3xl">{v.line}</p>
   <p className="h text-5xl md:text-7xl">{v.art}</p>
   <div className="h flex justify-between text-xl">{pv?<Link href={`/volumes/${pv.n}`}>← VOL. {pad(pv.n)}</Link>:<span/>}{nx&&<Link href={`/volumes/${nx.n}`}>VOL. {pad(nx.n)} →</Link>}</div></div></div>
 <Comments volume={n} enabled={data?.comments_enabled??true} color={v.c}/></main>)}
