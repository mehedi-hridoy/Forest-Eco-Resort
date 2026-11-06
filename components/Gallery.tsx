'use client';
import {useMemo,useState} from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';

type Item={id:string;slug:string;title:string;data:Record<string,any>};

// Bundled gallery photos live in /public as a full-size file plus a light thumbnail for the grid.
const thumbOf=(src:string)=>src.startsWith('/images/gallery/full/')?src.replace('/images/gallery/full/','/images/gallery/thumb/'):src;

export function Gallery({items}:{items:Item[]}){
 const [category,setCategory]=useState('All');
 const [index,setIndex]=useState(-1);
 const categories=useMemo(()=>['All',...new Set(items.map(i=>i.data.category||'Nature'))],[items]);
 const filtered=useMemo(()=>items.filter(i=>i.data.image&&(category==='All'||(i.data.category||'Nature')===category)),[items,category]);
 const slides=useMemo(()=>filtered.map(i=>({src:i.data.image as string,alt:i.data.alt||i.title,title:i.title,description:i.data.caption||undefined,...(i.data.width&&i.data.height?{width:Number(i.data.width),height:Number(i.data.height)}:{}),thumbnail:thumbOf(i.data.image)})),[filtered]);

 if(!items.length)return <div className="empty-editorial"><h3>The official collection is taking shape.</h3><p>Approved project photographs and architectural renders will be added here as they become available.</p></div>;

 return <>
  {categories.length>2&&<div className="filter-bar">{categories.map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)}>{c}</button>)}</div>}
  <div className="gx-grid">
   {filtered.map((i,n)=><button key={i.id} className="gx-item" onClick={()=>setIndex(n)} aria-label={`View ${i.title} full screen`}>
    <img src={thumbOf(i.data.image)} alt={i.data.alt||i.title} loading={n<6?'eager':'lazy'} {...(i.data.width&&i.data.height?{width:i.data.width,height:i.data.height}:{})}/>
    <span>{i.title}</span>
   </button>)}
  </div>
  <Lightbox
   open={index>=0}
   index={index}
   close={()=>setIndex(-1)}
   slides={slides}
   plugins={[Zoom,Fullscreen,Thumbnails,Counter,Captions]}
   zoom={{maxZoomPixelRatio:3,scrollToZoom:true}}
   thumbnails={{width:96,height:64,border:0,borderRadius:4,gap:10,padding:0}}
   captions={{descriptionTextAlign:'center'}}
   controller={{closeOnBackdropClick:true}}
   styles={{container:{backgroundColor:'rgba(8,24,18,.97)'},thumbnailsContainer:{backgroundColor:'rgba(8,24,18,.97)'}}}
  />
 </>;
}
