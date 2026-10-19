import type {Metadata} from 'next';
import {content,entry} from '@/lib/content';
import {Navigation,Footer,PrivacyPreferences} from '@/components/SiteChrome';
import Motion from '@/components/Motion';
import './globals.css';
import {siteUrl} from '@/lib/site';
export const dynamic='force-dynamic';
export const metadata:Metadata={metadataBase:new URL(siteUrl()),title:{default:'Forest Eco Resort — Where Nature Becomes an Experience',template:'%s | Forest Eco Resort'},description:'Explore the Forest Eco Resort destination vision in Bhabanipur, Rajendrapur, Gazipur.',openGraph:{type:'website',siteName:'Forest Eco Resort',images:['/images/forest.jpg']}};
export default async function RootLayout({children}:{children:React.ReactNode}){const [nav,settings]=await Promise.all([content('navigation'),entry('settings','global')]);const links=nav.map(n=>({title:n.title,url:n.data.url}));return <html lang="en"><body id="top" style={{'--brand-font':settings?.data.fontFamily||'Arial, sans-serif'} as React.CSSProperties}><Navigation links={links}/>{children}<Footer settings={settings?.data||{}} links={links}/><PrivacyPreferences/><Motion/></body></html>}
