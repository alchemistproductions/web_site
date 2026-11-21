import {NextResponse} from 'next/server'
import {server} from '@/lib/server'
export async function GET(req:Request){
 const u=new URL(req.url),code=u.searchParams.get('code'),n=u.searchParams.get('next')??'/'
 if(code)await server().auth.exchangeCodeForSession(code)
 return NextResponse.redirect(new URL(n.startsWith('/')&&!n.startsWith('//')?n:'/',u.origin))}
