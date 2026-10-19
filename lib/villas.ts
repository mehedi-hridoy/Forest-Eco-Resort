import {isMediaUrl} from './validation';
// Ready-made brochures shipped in /public/brochures; a PDF uploaded in the admin always takes precedence.
const DEFAULT_BROCHURES:Record<string,string>={'private-villa':'/brochures/private-villa.pdf','duplex-villa':'/brochures/duplex-villa.pdf'};
export function brochureFor(slug:string,data:unknown):string|null{
 const uploaded=(data as {brochure?:unknown}|null)?.brochure;
 return isMediaUrl(uploaded)?uploaded:DEFAULT_BROCHURES[slug]??null;
}
