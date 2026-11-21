import {notFound} from 'next/navigation'
import {GENRES,slug} from '@/lib/data'
export default function Genre({params}:{params:{slug:string}}){
 const g=GENRES.find(x=>slug(x.name)===params.slug);if(!g)notFound()
 return(<main className="min-h-screen px-5 pt-28" style={{background:`radial-gradient(circle at 20% 0%,${g.c}55,transparent 60%)`}}><h1 className="h text-7xl md:text-9xl" style={{color:g.c}}>{g.name}</h1><p className="mt-10 text-2xl">Films under progress</p></main>)}
