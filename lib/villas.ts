import {isMediaUrl} from './validation';
// The brochure is whatever is set on the villa in the admin (Content → Villas → Brochure).
// Removing it there removes the download from the site; uploading a new PDF replaces it.
export function brochureFor(_slug:string,data:unknown):string|null{
 const uploaded=(data as {brochure?:unknown}|null)?.brochure;
 return isMediaUrl(uploaded)?uploaded:null;
}
