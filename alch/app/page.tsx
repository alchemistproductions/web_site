import Link from 'next/link'
import {VOLUMES,ROLES,GENRES,slug,pad} from '@/lib/data'
export default function Home(){
 return(<main>
 <section className="flex min-h-screen flex-col justify-center overflow-hidden px-5 pt-20 text-center">
  <p className="up italic tracking-widest">Welcome to a new era</p>
  <h1 className="h up"><span className="block text-[18vw]">ALCHEMIST</span><span className="block text-[7vw] text-white/80"> PRODUCTIONS</span></h1>
  <p className="up mt-4 text-lg" style={{animationDelay:'.3s'}}>Making cinema better than ever</p>
 </section>
 <div className="overflow-hidden border-y border-white/10 py-3"><div className="mq h flex w-max gap-10 text-2xl">{[...VOLUMES,...VOLUMES].map((v,i)=><span key={i} style={{color:v.c}}>{v.art}</span>)}</div></div>
 <section id="volumes" className="p-5"><h2 className="h mb-4 text-4xl">Volumes</h2>
  <div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-6">{VOLUMES.map(v=>
   <Link key={v.n} href={`/volumes/${v.n}`} className="group aspect-[3/4] overflow-hidden"><img src={`/v/${pad(v.n)}.jpg`} alt={`ALCHEMIST VOL. ${pad(v.n)} ${v.edition}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110"/></Link>)}</div></section>
 <section id="who" className="mx-auto max-w-3xl space-y-5 px-5 py-20 text-lg leading-relaxed">
  <h2 className="h text-6xl">WHO WE ARE</h2>
  <p>We are a student production house based in Hyderabad, Telangana, dedicated to bringing ideas to life through films, photography, cinematography, and creative media production. We are a growing community of student creators, storytellers, and dreamers who believe in the power of visual storytelling.</p>
  <p>As young creators, we see the world differently. We experiment, explore, learn, and push creative boundaries with every project we take on. From the first spark of an idea to the final frame, we work together to turn visions into visuals and moments into stories.</p>
  <p>We believe that great stories don't need big budgets or experience. They need imagination, courage, and a team willing to create something extraordinary. That is why we are Alchemist Productions, born to create something unique.</p>
  <p className="h text-3xl">And this is just the beginning of our story.</p></section>
 <section id="roles" className="p-5"><h2 className="h mb-4 text-4xl">Roles &amp; Departments</h2>
  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{ROLES.map(r=>
   <Link key={r} href={`/roles/${slug(r)}`} className="h flex aspect-[4/3] items-end border border-white/20 p-4 text-3xl transition hover:bg-white hover:text-black">{r}</Link>)}</div></section>
 <section id="genres" className="p-5"><h2 className="h mb-4 text-4xl">WHAT WE WORK WITH</h2>
  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{GENRES.map(g=>
   <Link key={g.name} href={`/genres/${slug(g.name)}`} style={{'--c':g.c} as any} className="h flex aspect-[4/3] items-end border-2 border-[color:var(--c)] p-4 text-3xl text-[color:var(--c)] transition hover:bg-[color:var(--c)] hover:text-black">{g.name}</Link>)}</div></section>
 <section className="mx-auto max-w-3xl space-y-2 px-5 py-20 text-xl">
  <h2 className="h text-5xl">THE CORE TEAM</h2>
  <p>Founding Director- Divyanka</p><p>Producer- Rishikesh</p><p>Head of Talent and Casting- Nathan</p>
  <p className="pt-8"><Link href="/join" className="h bg-white px-5 py-3 text-2xl text-black">We are open for hire, join us!</Link></p>
  <p className="pt-8">Follow our social media</p><p>Instagram: <a className="underline" href="https://www.instagram.com/alchemist__productions/" target="_blank" rel="noopener noreferrer">https://www.instagram.com/alchemist__productions/</a></p></section>
 </main>)}
