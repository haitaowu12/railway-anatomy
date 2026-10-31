import {OCC_READING_GUIDES} from './occ-data.js';
import {DEPOT_READING_GUIDES} from './depot-data.js';

export const READING_GUIDES = [
  ...OCC_READING_GUIDES.map(guide=>({...guide,domain:'operations'})),
  ...DEPOT_READING_GUIDES.map(guide=>({...guide,domain:'depot'})),
];
