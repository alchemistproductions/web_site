import {notFound} from 'next/navigation'
import {server} from '@/lib/server'
import {ROLES,slug} from '@/lib/data'
export default async function Role({params}:{params:{slug:string}}){
 const name=ROLES.find(r=>slug(r)===params.slug);if(!name)notFound()
 const {data}=await server().from('members').select('id,name').eq('role_slug',params.slug)
 return(<main className="mx-auto max-w-4xl px-5 pb-20 pt-28"><h1 className="h text-7xl md:text-9xl">{name}</h1>
 <ul className="mt-10 space-y-2 text-2xl">{data?.length?data.map(m=><li key={m.id}>{m.name}</li>):<li className="text-white/70">for hire</li>}</ul></main>)}
