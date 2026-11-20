import type {Metadata} from 'next';
import {content,entry} from '@/lib/content';
import {Navigation,Footer,PrivacyPreferences} from '@/components/SiteChrome';
import Motion from '@/components/Motion';
import './globals.css';
import {siteUrl} from '@/lib/site';
// Pages are cached and re-rendered in the background at most once a minute; admin saves refresh them immediately.
export const revalidate=60;
const GTM_ID='GTM-KM3W924B';
export const metadata:Metadata={metadataBase:new URL(siteUrl()),title:{default:'Forest Eco Resort — Where Nature Becomes an Experience',template:'%s | Forest Eco Resort'},description:'Explore the Forest Eco Resort destination vision in Bhabanipur, Rajendrapur, Gazipur.',openGraph:{type:'website',siteName:'Forest Eco Resort',images:['/images/forest.jpg']}};
export default async function RootLayout({children}:{children:React.ReactNode}){const [nav,settings]=await Promise.all([content('navigation'),entry('settings','global')]);const links=nav.map(n=>n.data.url==='/contact'||n.data.url==='/get-in-touch'?{title:'Get in Touch',url:'/get-in-touch'}:{title:n.title,url:n.data.url});return <html lang="en"><head>
{/* Google Tag Manager */}
<script dangerouslySetInnerHTML={{__html:`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}}/>
{/* End Google Tag Manager */}
</head><body id="top" style={{'--brand-font':settings?.data.fontFamily||'Arial, sans-serif'} as React.CSSProperties}>
{/* Google Tag Manager (noscript) */}
<noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{display:'none',visibility:'hidden'}}/></noscript>
{/* End Google Tag Manager (noscript) */}
<Navigation links={links}/>{children}<Footer settings={settings?.data||{}} links={links}/><PrivacyPreferences/><Motion/></body></html>}
