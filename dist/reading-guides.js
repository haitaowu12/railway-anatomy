import {STATION_PLATFORM_READING_GUIDES} from './station-platform-data.js';
import {OCC_READING_GUIDES} from './occ-data.js';
import {DEPOT_READING_GUIDES} from './depot-data.js';
import {STUDY_GUIDES} from './studies-learning.js';
import {PROCESS_READING_GUIDES} from './process-data.js';
import {COMMUNICATIONS_READING_GUIDES} from './communications-data.js';

export const READING_GUIDES = [
  {
    id:'point-machine',tour:'point-proof', title:'From point movement to returned indication', domain:'track', view:'switch-drive', component:'track-point-machine',
    summary:'Follow two operating rods, two blade detector rods and positive locking in a four-rod point-machine study.',
    sections:[
      {heading:'Four rods, four connections',text:'Choose Guided tours → Follow a point machine. Each blade has its own operating rod and its own detector rod. The near blade is the one closest to the machine. The short connections reach it; the long connections pass beneath the near stock rail to the far blade. Operating rods transmit force; detector rods follow blade position. Two detector rods cover two different blades, rather than duplicating the same input.',sources:['PM01','PM03']},
      {heading:'One arrangement among several',text:'Alstom’s December 2015 P80 brochure describes two independent operating rods and two detection rods, with locking of both open and closed blades. The study uses that four-rod arrangement; its actuator, lock openings and contacts are functional illustrations. Other families differ: voestalpine UNISTAR HR separates power from drive/locking/detection modules and supports installations with or without stretcher bars; Vossloh MCEM91 uses internal locking; Siemens offers internal and external locking families. A stretcher bar couples blades; it is a different component from a detector rod or a separate lock rod.',sources:['PM01','PM02','PM04','K17']},
      {heading:'Read A, neither and B',text:'At A, the near blade is open and the far blade closed. The locks withdraw before the blades move, and neither end is indicated during travel. At B, the near blade is closed against its stock rail and the far blade is open for flange clearance. B is indicated only when both blade conditions and the locks are established. Use the stage buttons to inspect movement, locking and indication separately. The final step follows the returned indication to the interlocking.',sources:['PM01','PM03']},
      {heading:'Compare missing conditions',text:'In Stopped short, neither blade reaches its end position and the locks stay released. In One detector missing, both blades reach B and both locks engage. The far-blade input is unavailable, so B is still not indicated. Choose Follow the indication to see how the interlocking checks the point condition alongside train detection and conflicting-route checks.',sources:['PM01','PM03','S10']},
    ],
    sources:['PM01','PM02','PM03','PM04','K17','S10'],
  },
  ...OCC_READING_GUIDES.map(guide=>({...guide,domain:'operations'})),
  ...DEPOT_READING_GUIDES.map(guide=>({...guide,domain:'depot'})),
  ...STUDY_GUIDES,
  ...STATION_PLATFORM_READING_GUIDES,
  ...PROCESS_READING_GUIDES,
  ...COMMUNICATIONS_READING_GUIDES,
];

READING_GUIDES.push({id:'turnout-wheels',tour:'turnout-wheels',title:'Follow both wheels through a turnout',domain:'track',view:'turnout',component:'track-wheelset',summary:'Connect the point-machine setting to the switch, closure rails and fixed crossing.',sections:[
 {heading:'Set the route before passage',text:'Open Guided tours → Follow wheels through a turnout. A selects the straight route: near blade open, far blade closed. B selects the diverging route: near blade closed, far blade open. These are the same ends as the point-machine study. The blades remain locked while the wheelset passes. Changing route returns the wheelset to its approach.',sources:['TW01','PM01']},
 {heading:'Follow the pair of rails',text:'The closed blade and its stock rail establish the selected entry path. Closure rails connect the switch to the crossing. Follow both wheels on the same axle: on the straight route the far wheel passes the crossing, while on the diverging route the near wheel does. The other wheel runs beside that route’s check rail.',sources:['TW01','TW02','K12']},
 {heading:'Separate support from guidance',text:'In Crossing close-up, look at the wheel passing the fixed crossing first. Its tread receives support from the wing rail and crossing nose, and their contact regions can overlap. The flangeway provides clearance for the flange on the intersecting path. Now look across the axle: the opposite check rail can guide the back of the other wheel’s flange, keeping the crossing wheel on the intended side of the nose.',sources:['TW01','K14','K15']},
 {heading:'Recognise different crossing families',text:'This study has a fixed common crossing. Bane NOR and Vossloh also describe movable crossings. In voestalpine’s movable-point example the nose is set against a wing rail to provide a continuous running edge; it has separate setting and locking needs. That is a different mechanism from the fixed crossing shown here. Some fixed frogs are self-guarded: raised casting features provide the guidance instead of separate opposite check rails. A fixed diamond has two common and two obtuse crossings; its separate view marks their layout without animating wheel contact. A crossover uses two turnouts.',sources:['TW01','TW02','TW03']},
 {heading:'Read the illustration at its intended scale',text:'Rail spacing and curves are simplified so the parts remain visible. The wheelset follows the selected route; its rotation illustrates travel rather than calculating wheel–rail contact forces. Point indication is one of several conditions checked by the interlocking.',sources:['TW01','S10']}
],sources:['TW01','TW02','TW03','K12','K14','K15','PM01','S10']});

Object.assign(READING_GUIDES.find(g=>g.id==='infrastructure-work'),{view:'infrastructure-assets',component:'route-formation'});

READING_GUIDES.find(g=>g.id==='turnout-wheels').sections.find(s=>s.heading==='Separate support from guidance').sources.push('TW05');
READING_GUIDES.find(g=>g.id==='turnout-wheels').sections.find(s=>s.heading==='Recognise different crossing families').sources.push('TW04');
READING_GUIDES.find(g=>g.id==='turnout-wheels').sources.push('TW04','TW05');
