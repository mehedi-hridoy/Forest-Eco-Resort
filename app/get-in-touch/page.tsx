import {MapPin,Phone,Mail,MessageCircle,ArrowUpRight,Navigation,Clock} from 'lucide-react';
import {entry} from '@/lib/content';
import {safeUrl} from '@/lib/validation';
import InquiryForm from '@/components/InquiryForm';
import {WHATSAPP_NUMBER} from '@/lib/site';

export const metadata={title:'Get in Touch',description:'Talk to the Forest Eco Resort team about villa ownership, investment or a visit to Bhawal forest.',alternates:{canonical:'/get-in-touch'}};

const DEFAULT_MAP='https://share.google/d7AFZ0qrYmK0XDSn2';

export default async function GetInTouch(){
 const s=(await entry('settings','global'))?.data??{};
 const phones:string[]=s.phones||[];
 const location:string=s.location||'Bhabanipur, Rajendrapur, Gazipur, Bangladesh';
 const mapUrl=safeUrl(s.mapUrl||DEFAULT_MAP);
 const embed=`https://maps.google.com/maps?q=${encodeURIComponent(`Forest Eco Resort, ${location}`)}&z=14&output=embed`;
 const whatsapp=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello, I would like to know more about Forest Eco Resort.')}`;
 return <main id="main" className="git">
  <section className="git-hero">
   <p className="eyebrow">GET IN TOUCH</p>
   <h1>Find your way<br/><em>to Forest.</em></h1>
   <p>Whether you are exploring a private retreat or simply want to know more, the team would love to hear from you.</p>
  </section>

  <section className="git-body">
   <aside className="git-aside">
    <div className="git-cards">
     <a className="git-card" href={mapUrl} target="_blank" rel="noreferrer">
      <span className="git-icon"><MapPin size={20} strokeWidth={1.5}/></span>
      <span><small>Visit</small><strong>{location}</strong><em>Get directions <ArrowUpRight size={14}/></em></span>
     </a>
     <div className="git-card">
      <span className="git-icon"><Phone size={20} strokeWidth={1.5}/></span>
      <span><small>Call</small>{phones.map(p=><a key={p} href={`tel:+88${p}`} className="git-line">{p}</a>)}</span>
     </div>
     {s.email&&<a className="git-card" href={`mailto:${s.email}`}>
      <span className="git-icon"><Mail size={20} strokeWidth={1.5}/></span>
      <span><small>Write</small><strong className="git-email">{String(s.email).split('@')[0]}<wbr/>@{String(s.email).split('@')[1]}</strong><em>Send an email <ArrowUpRight size={14}/></em></span>
     </a>}
     <a className="git-card git-card-whatsapp" href={whatsapp} target="_blank" rel="noreferrer noopener">
      <span className="git-icon"><MessageCircle size={20} strokeWidth={1.5}/></span>
      <span><small>Chat</small><strong>WhatsApp the team</strong><em>Usually replies within the day <ArrowUpRight size={14}/></em></span>
     </a>
    </div>

    <figure className="git-map">
     <iframe src={embed} title="Forest Eco Resort location on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>
     <figcaption>
      <span><Clock size={14}/> Visits by appointment. Confirm the meeting point before travelling.</span>
      <a href={mapUrl} target="_blank" rel="noreferrer"><Navigation size={14}/> Open in Google Maps</a>
     </figcaption>
    </figure>
   </aside>

   <div className="git-form">
    <p className="eyebrow">START A CONVERSATION</p>
    <h2>Tell us what<br/><em>you’re looking for.</em></h2>
    <p className="git-form-lead">Share a few details and the right person from our team will get back to you.</p>
    <InquiryForm/>
   </div>
  </section>
 </main>;
}
