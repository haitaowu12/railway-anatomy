import {OCC_READING_GUIDES} from './occ-data.js';
import {DEPOT_READING_GUIDES} from './depot-data.js';
import {STUDY_GUIDES} from './studies-learning.js';
import {PROCESS_READING_GUIDES} from './process-data.js';
import {COMMUNICATIONS_READING_GUIDES} from './communications-data.js';

export const READING_GUIDES = [
  ...OCC_READING_GUIDES.map(guide=>({...guide,domain:'operations'})),
  ...DEPOT_READING_GUIDES.map(guide=>({...guide,domain:'depot'})),
  ...STUDY_GUIDES,
  ...PROCESS_READING_GUIDES,
  ...COMMUNICATIONS_READING_GUIDES,
];
