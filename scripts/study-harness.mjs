import {createMechanicalDetails} from '../dist/mechanical-details.js';
import {createEquipmentDetails} from '../dist/equipment-details.js';
const detailFactories={createMechanicalDetails,createEquipmentDetails};
import * as electrificationHelpers from '../dist/electrification.js';
// Execute shipping geometry and animations without a browser or renderer.
import {readFile} from 'node:fs/promises';
import * as THREE from '../dist/vendor/three.module.js';
import {buildStudyView} from '../dist/studies-models.js';

export {THREE};
export async function studyHarness(){
  const source=await readFile(new URL('../dist/viewer.js',import.meta.url),'utf8');
  const between=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)+a.length));
  const create=new Function('THREE','electrificationHelpers','detailFactories',`
 const {createMechanicalDetails,createEquipmentDetails}=detailFactories;
 const {${Object.keys(electrificationHelpers).join(',')}}=electrificationHelpers;${between('const C = {','\nconst VIEW')}
    const compatibility=true,scene=new THREE.Scene(),models=new Map();let building;
    ${between('  const materials = new Map();','  const ground = ')}
    ${between('  function startModel(','  function registerAnimator(')}
    function registerAnimator(fn){building.animators.push(fn);}
    return {scene,models,api:{THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,torus,tube,roundedPanel,explode,shell,foot,makeTrack,makeTrain,makePrimary,makeBogie,makeSubstation,makePowerTransformer,makePowerRectifier,makePowerSwitchgear,powerTrace,cabinet,registerAnimator}};`);
  const harness=create(THREE,electrificationHelpers,detailFactories);
  const set=(view,variant,phase=0,options={})=>{
    if(!harness.models.has(view))buildStudyView(view,harness.api);
    const record=harness.models.get(view);
    for(const candidate of harness.models.values())candidate.root.visible=candidate===record;
    for(const node of record.shells)node.visible=false;
    const state={view,variant,phase,playing:false,mode:'coasting',scenario:'nominal',cutaway:true,exploded:0,signals:true,electrification:electrificationHelpers.DEFAULT_ELECTRIFICATION,technology:{propulsion:'lim',control:'loop'},...options};
    record.animators.forEach(fn=>fn(state));record.root.updateWorldMatrix(true,true);return record;
  };
  return {...harness,set};
}
export const visible=node=>{for(let n=node;n;n=n.parent)if(!n.visible)return false;return true;};

