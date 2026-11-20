// Exports every table of the database in DATABASE_URL to a gzipped JSON file
// (Bytes columns as base64), for import on a host without shell access — see deploy/cpanel/setup-db.js.
// Usage: pnpm exec tsx scripts/export-db.ts <output.json.gz>
import {createDb} from '../server/prisma-client';
import {writeFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';

const MODELS=['user','session','passwordReset','lead','leadActivity','content','media','mediaFile','notification','auditLog','event'] as const;
const pack=(v:unknown):unknown=>v instanceof Uint8Array?{$bytes:Buffer.from(v).toString('base64')}:v;

async function main(){
 const out=process.argv[2];if(!out)throw new Error('Usage: export-db.ts <output.json.gz>');
 const db=createDb();
 const tables:Record<string,unknown[]>={};
 for(const m of MODELS){
  const rows=await (db as any)[m].findMany();
  tables[m]=rows.map((r:Record<string,unknown>)=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,pack(v)])));
  console.log(`${m}: ${rows.length}`);
 }
 await db.$disconnect();
 writeFileSync(out,gzipSync(JSON.stringify({exportedAt:new Date().toISOString(),tables})));
 console.log(`Wrote ${out}`);
}
main().catch(e=>{console.error(e);process.exit(1)});
