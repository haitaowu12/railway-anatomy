import {STATION_PLATFORM_READING_GUIDES} from './station-platform-data.js';
import {OCC_READING_GUIDES} from './occ-data.js';
import {DEPOT_READING_GUIDES} from './depot-data.js';
import {STUDY_GUIDES} from './studies-learning.js';
import {PROCESS_READING_GUIDES} from './process-data.js';
import {COMMUNICATIONS_READING_GUIDES} from './communications-data.js';

export const READING_GUIDES = [
  {
    id:'point-machine', title:'From point movement to returned indication', domain:'track', component:'track-point-machine',
    summary:'Follow a schematic point machine from the blade movement to the indication received by the interlocking.',
    sections:[
      {heading:'Move and retain the blades',text:'In Guided tours, choose Follow a point machine. The complete throw starts locked at end A, releases the lock, moves the blades to end B and engages the lock there. The motor, blade linkage and lock have different roles. Point-operating systems use different internal or external locking arrangements; this illustration shows one schematic mechanism.',sources:['K17']},
      {heading:'Read the returned indication',text:'The blade position, lock and end-B indication readouts follow the illustrated mechanism. At the lock stage, end B is held but its indication has not yet returned. The final stage shows that returned indication. Compare Stopped short: the blades remain between the ends, the lock stays released and no end-B indication returns.',sources:['K17']},
      {heading:'Follow the input to the interlocking',text:'Choose Follow the indication to see the selected outcome in its route context. The point condition is one input. Train detection and conflicting-route checks are also required before the interlocking can establish the route conditions.',sources:['S10']},
    ],
    sources:['K17','S10'],
  },
  ...OCC_READING_GUIDES.map(guide=>({...guide,domain:'operations'})),
  ...DEPOT_READING_GUIDES.map(guide=>({...guide,domain:'depot'})),
  ...STUDY_GUIDES,
  ...STATION_PLATFORM_READING_GUIDES,
  ...PROCESS_READING_GUIDES,
  ...COMMUNICATIONS_READING_GUIDES,
];
