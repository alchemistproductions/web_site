import './globals.css'
import {Anton,Playfair_Display} from 'next/font/google'
import Nav from '@/components/Nav'
const h=Anton({weight:'400',subsets:['latin'],variable:'--f-head'})
const s=Playfair_Display({subsets:['latin'],variable:'--f-serif'})
export const metadata={title:'ALCHEMIST PRODUCTIONS',description:'Making cinema better than ever. A student production house based in Hyderabad, Telangana.'}
export default function Layout({children}:{children:React.ReactNode}){
 return(<html lang="en" className={`${h.variable} ${s.variable}`}><body className="font-serif"><Nav/>{children}</body></html>)}
