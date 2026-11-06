import 'dotenv/config';
import {PrismaClient} from '@prisma/client';

// One-off: registers the bundled photos in public/images/gallery as gallery entries.
// Only the URL, title and category are stored (a few hundred bytes per row); the image files stay in /public.
// Safe to re-run: existing entries (including ones edited in the admin) are left untouched.
// Note: re-running re-creates any bundled photo that was deleted in the admin.
const PHOTOS=[
 {
  "n": "01",
  "title": "Villa bedroom with ocean artwork",
  "category": "Villas",
  "assetType": "Render",
  "width": 1800,
  "height": 2400
 },
 {
  "n": "02",
  "title": "Thatched villa with a plunge pool",
  "category": "Villas",
  "assetType": "Render",
  "width": 1800,
  "height": 2400
 },
 {
  "n": "03",
  "title": "Thatched cottage, hammock and pool",
  "category": "Villas",
  "assetType": "Render",
  "width": 1800,
  "height": 2400
 },
 {
  "n": "04",
  "title": "Open pavilion lounge",
  "category": "Architecture",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "05",
  "title": "Bright villa bedroom",
  "category": "Villas",
  "assetType": "Render",
  "width": 1800,
  "height": 2400
 },
 {
  "n": "06",
  "title": "Pavilion across the lawn",
  "category": "Architecture",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "07",
  "title": "Dining hall beneath woven lanterns",
  "category": "Lifestyle",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "08",
  "title": "Lounge under a timber ceiling",
  "category": "Lifestyle",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "09",
  "title": "Kitchen island and bar stools",
  "category": "Lifestyle",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "10",
  "title": "Spa treatment room",
  "category": "Experience",
  "assetType": "Render",
  "width": 1932,
  "height": 2400
 },
 {
  "n": "11",
  "title": "Open-plan pavilion by the water",
  "category": "Architecture",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "12",
  "title": "Timber sauna",
  "category": "Experience",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "13",
  "title": "Sunken lounge and fireplace",
  "category": "Lifestyle",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "14",
  "title": "Twin spa suite",
  "category": "Experience",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "15",
  "title": "Guest bedroom with pendant lights",
  "category": "Villas",
  "assetType": "Render",
  "width": 1920,
  "height": 2400
 },
 {
  "n": "16",
  "title": "Garden villa and plunge pool at dusk",
  "category": "Villas",
  "assetType": "Render",
  "width": 1934,
  "height": 2400
 },
 {
  "n": "17",
  "title": "Pool deck and sun loungers",
  "category": "Architecture",
  "assetType": "Render",
  "width": 1934,
  "height": 2400
 },
 {
  "n": "18",
  "title": "Bar beneath paper lanterns",
  "category": "Lifestyle",
  "assetType": "Render",
  "width": 1934,
  "height": 2400
 },
 {
  "n": "19",
  "title": "Bar counter and stools",
  "category": "Lifestyle",
  "assetType": "Render",
  "width": 1934,
  "height": 2400
 },
 {
  "n": "20",
  "title": "Stepping stones over water",
  "category": "Architecture",
  "assetType": "Render",
  "width": 1934,
  "height": 2400
 },
 {
  "n": "21",
  "title": "Timber verandah walkway",
  "category": "Architecture",
  "assetType": "Render",
  "width": 1934,
  "height": 2400
 },
 {
  "n": "22",
  "title": "Garden path and benches",
  "category": "Nature",
  "assetType": "Photograph",
  "width": 1448,
  "height": 1086
 },
 {
  "n": "23",
  "title": "Forest villa with an infinity pool",
  "category": "Villas",
  "assetType": "Render",
  "width": 1297,
  "height": 1212
 },
 {
  "n": "24",
  "title": "Lawn and lookout tower",
  "category": "Nature",
  "assetType": "Photograph",
  "width": 1448,
  "height": 1086
 },
 {
  "n": "25",
  "title": "Hotel tower with a rooftop pool",
  "category": "Architecture",
  "assetType": "Render",
  "width": 1193,
  "height": 1318
 },
 {
  "n": "26",
  "title": "Swimming pool and clubhouse",
  "category": "Experience",
  "assetType": "Photograph",
  "width": 1448,
  "height": 1086
 },
 {
  "n": "27",
  "title": "The resort from above",
  "category": "Masterplan",
  "assetType": "Render",
  "width": 2400,
  "height": 2400
 }
];

const db=new PrismaClient();
async function main(){
 let created=0;
 for(const [i,p] of PHOTOS.entries()){
  const slug=`bundled-${p.n}`;
  const exists=await db.content.findUnique({where:{kind_slug:{kind:'gallery',slug}}});
  if(exists)continue;
  await db.content.create({data:{kind:'gallery',slug,title:p.title,status:'Published',sortOrder:100+i,data:{image:`/images/gallery/full/${p.n}.jpg`,alt:p.title,category:p.category,assetType:p.assetType,width:p.width,height:p.height}}});
  created++;
 }
 console.log(`Gallery: ${created} added, ${PHOTOS.length-created} already present.`);
}
main().finally(()=>db.$disconnect());
