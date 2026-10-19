import { z } from 'zod';
export const roles = ['Super Admin','Content Administrator','Sales Manager','Sales Executive','Analyst / Viewer'] as const;
export const statuses = ['New','Contacted','Qualified','Consultation Scheduled','Follow-up Required','Converted','Not Interested','Invalid / Spam'] as const;
export const kinds = ['pages','sections','navigation','settings','villas','experiences','facilities','masterplan','gallery','articles','brochures','faqs'] as const;
const text = (max:number) => z.string().trim().max(max).transform(v=>v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,''));
export const leadSchema = z.object({
 submissionKey:z.string().uuid(), fullName:text(120).pipe(z.string().min(2,'Please enter your full name.')),
 mobile:z.string().trim().regex(/^\+?[\d\s()-]{8,20}$/,'Enter a valid phone number.'),email:z.string().trim().email().max(254),
 interest:z.enum(['Villa Ownership','Investment','Resort Stay','Project Information']),villa:z.enum(['Duplex Villa','Single Villa','Private Villa']).optional(),
 purpose:z.enum(['Personal Use','Investment','Vacation']).optional(),contactMethod:z.enum(['Phone','WhatsApp','Email']),contactTime:text(120).optional(),message:text(4000),
 consent:z.literal(true),source:text(300),campaign:text(500).optional(),website:z.string().max(0).optional()
});
export const contentSchema=z.object({kind:z.enum(kinds),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),title:text(250).pipe(z.string().min(1)),status:z.enum(['Draft','In Review','Scheduled','Published','Archived']),sortOrder:z.number().int().min(0).max(9999),data:z.record(z.unknown()),publishAt:z.string().datetime().nullable().optional(),approved:z.boolean().optional()});
export function safeUrl(v:unknown) { return typeof v==='string' && (/^\/(?!\/)/.test(v)||/^https:\/\//.test(v)||/^(tel:|mailto:)/.test(v)) ? v : '#'; }
