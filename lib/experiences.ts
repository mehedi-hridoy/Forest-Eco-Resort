import {isMediaUrl} from './validation';
import type {Entry} from './content';

// Curated imagery for the seeded experiences. The original seed pointed at alpine stock photos that do not
// read as Bhawal forest, so those legacy paths are swapped out; anything uploaded in the admin is kept as-is.
const CURATED:Record<string,string>={stay:'/images/discover/stay.jpeg',dine:'/images/discover/dine.jpg',explore:'/images/discover/explore.jpg',reconnect:'/images/discover/reconnect.jpg',celebrate:'/images/discover/celebrate.jpeg',unwind:'/images/discover/unwind.jpg'};
const LEGACY=/^\/images\/(forest|woods|cabin|architecture)\.jpg$/;
const FALLBACK=Object.values(CURATED);

export function experienceImage(e:Pick<Entry,'slug'|'data'>,index=0):string{
 const image=e.data.image;
 if(isMediaUrl(image)&&!LEGACY.test(image))return image;
 return CURATED[e.slug]??FALLBACK[index%FALLBACK.length];
}
