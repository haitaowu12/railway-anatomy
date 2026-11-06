import {STATION_PLATFORM_READING_GUIDES} from './station-platform-data.js';
import {OCC_READING_GUIDES} from './occ-data.js';
import {DEPOT_READING_GUIDES} from './depot-data.js';
import {STUDY_GUIDES} from './studies-learning.js';
import {PROCESS_READING_GUIDES} from './process-data.js';
import {COMMUNICATIONS_READING_GUIDES} from './communications-data.js';

export const READING_GUIDES = [
  {
    id:'point-machine', title:'From point movement to returned indication', domain:'track', view:'switch-drive', component:'track-point-machine',
    summary:'Follow two operating rods, two blade detector rods and positive locking in a four-rod point-machine study.',
    sections:[
      {heading:'Four rods, four connections',text:'Choose Guided tours → Follow a point machine. Each blade has its own operating rod and its own detector rod. The near blade is the one closest to the machine. The short connections reach it; the long connections pass beneath the near stock rail to the far blade. Operating rods transmit force; detector rods follow blade position. Two detector rods cover two different blades, rather than duplicating the same input.',sources:['PM01','PM03']},
      {heading:'One arrangement among several',text:'Alstom’s December 2015 P80 brochure describes two independent operating rods and two detection rods, with locking of both open and closed blades. The study uses that four-rod arrangement; its actuator, lock openings and contacts are functional illustrations. Other families differ: voestalpine UNISTAR HR separates power from drive/locking/detection modules and supports installations with or without stretcher bars; Vossloh MCEM91 uses internal locking; Siemens offers internal and external locking families. A stretcher bar couples blades; it is a different component from a detector rod or a separate lock rod.',sources:['PM01','PM02','PM04','K17']},
      {heading:'Read A, neither and B',text:'At A, the near blade is open and the far blade closed. The locks withdraw before the blades move, and neither end is indicated during travel. At B, the near blade is closed against its stock rail and the far blade is open for flange clearance. B is indicated only when both blade conditions and the locks are established. The stage buttons pause these functions for explanation; the final step follows the same indication to the interlocking, without adding an equipment timing delay.',sources:['PM01','PM03']},
      {heading:'Compare missing conditions',text:'Stopped short leaves the blades between the ends and the locks released. One detector missing lets both blades reach B and both locks engage, but the unavailable far-blade input prevents a B indication. Choose Follow the indication to inspect the same case at the interlocking. The point condition is one input alongside train detection and conflicting-route checks.',sources:['PM01','PM03','S10']},
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
