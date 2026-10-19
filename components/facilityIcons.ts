import {DoorOpen,ConciergeBell,Hotel,BedDouble,Home,Utensils,Coffee,Waves,Droplets,Flower2,Trees,Leaf,Footprints,Baby,Route,Car,ShieldCheck,Flag,GraduationCap,Armchair,Building2,ShoppingBag,Landmark,Presentation,Mountain,Trophy,PartyPopper,Gamepad2,Wine,Crown,Gem,Sparkles,Dumbbell,Bath,CircleCheck,type LucideIcon} from 'lucide-react';

// First match wins, so specific phrases come before generic ones.
const RULES:[RegExp,LucideIcon][]=[
 [/entrance|reception/i,DoorOpen],
 [/lobby|concierge/i,ConciergeBell],
 [/presidential|signature villa/i,Crown],
 [/club|vip/i,Gem],
 [/lounge/i,Armchair],
 [/academy/i,GraduationCap],
 [/clubhouse/i,Building2],
 [/pro shop|equipment/i,ShoppingBag],
 [/golf|driving range|putting/i,Flag],
 [/café|cafe/i,Coffee],
 [/fine dining|banquet/i,Wine],
 [/restaurant|dining/i,Utensils],
 [/spa|wellness centre/i,Sparkles],
 [/fitness|gym/i,Dumbbell],
 [/sauna|steam/i,Bath],
 [/convention/i,Landmark],
 [/meeting|corporate/i,Presentation],
 [/event|lawn/i,PartyPopper],
 [/sports/i,Trophy],
 [/indoor|games|entertainment/i,Gamepad2],
 [/children|kids|play/i,Baby],
 [/adventure|outdoor|recreation zone/i,Mountain],
 [/pool|water recreation/i,Waves],
 [/lake|waterbody|water feature/i,Droplets],
 [/garden|landscape/i,Flower2],
 [/forest|nature/i,Trees],
 [/eco/i,Leaf],
 [/walking|jogging|trail/i,Footprints],
 [/road/i,Route],
 [/parking/i,Car],
 [/security|service/i,ShieldCheck],
 [/tower|hotel block|hotel facilities/i,Hotel],
 [/villa/i,Home],
 [/room|suite/i,BedDouble],
 [/recreation/i,Mountain],
];

export function facilityIcon(name:string):LucideIcon{
 return RULES.find(([re])=>re.test(name))?.[1]||CircleCheck;
}
