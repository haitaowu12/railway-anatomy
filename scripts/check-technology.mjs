import * as electrificationHelpers from '../dist/electrification.js';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as THREE from '../dist/vendor/three.module.js';
import { TRACK_VIEWS, buildTrackView } from '../dist/track-models.js';
import { SIGNALLING_VIEWS, buildSignallingView } from '../dist/signalling-models.js';
import { PLATFORM_VIEWS, buildPlatformView } from '../dist/platform-models.js';
import { VIEWS } from '../dist/model.js';
import {normalizeTechnology,technologyFromUrl,technologyForView,technologyForComponent,controlRoute,technologyFlow,technologyNote} from '../dist/technology.js';
assert.deepEqual(normalizeTechnology(),{propulsion:'lim',control:'loop'});
assert.deepEqual(technologyFromUrl('?propulsion=rotary&control=loop',{propulsion:'lim',control:'radio'}),{propulsion:'rotary',control:'loop'});
assert.deepEqual(technologyFromUrl('?propulsion=bad&control=bad'),{propulsion:'lim',control:'loop'});
for(const propulsion of ['lim','rotary'])for(const control of ['loop','radio','fixed','etcs1','etcs2']){
 const technology={propulsion,control};assert.deepEqual(normalizeTechnology(technology),technology);
 const route=controlRoute(control);assert.deepEqual(technologyForView(technology,route.view,route.variant),technology);
}
assert.deepEqual(technologyForView({propulsion:'rotary',control:'loop'},'cbtc-network','normal'),{propulsion:'rotary',control:'radio'});
assert.deepEqual(technologyForComponent({propulsion:'rotary',control:'radio'},'loop-pickup'),{propulsion:'rotary',control:'loop'});
for(const component of ['train-radio','wayside-radio'])assert.deepEqual(technologyForComponent({propulsion:'rotary',control:'etcs2'},component),{propulsion:'rotary',control:'etcs2'},'Inspecting an ETCS radio must not replace ETCS with CBTC');
assert.equal(controlRoute('fixed').view,'signalling');
assert.match(technologyNote({view:'bogie',technology:{propulsion:'rotary',control:'loop'}},''),/gearboxes/);
const base={description:'base',nodes:[],sources:[]};
assert.equal(technologyFlow({view:'lim',domain:'vehicle',technology:{propulsion:'rotary',control:'loop'}},base),base);
assert.match(technologyFlow({view:'system',domain:'power',mode:'motoring',technology:{propulsion:'rotary',control:'loop'}},base).description,/Wheel–rail adhesion/);
assert.match(technologyFlow({view:'system',domain:'power',mode:'regeneration',sink:'resistor',technology:{propulsion:'rotary',control:'loop'}},base).description,/diode/);
console.log('PASS technology defaults, invalid URL handling, 10 independent combinations, specialist scope and rotary energy narratives');

assert.deepEqual(technologyFromUrl('',null),{propulsion:'lim',control:'loop'});

// Build the actual procedural geometry without requiring a GPU or DOM. This
// catches the reported no-op failure at the rendered scene level; text changes
// or different state IDs alone cannot make these assertions pass.
const source=await readFile(new URL('../dist/viewer.js',import.meta.url),'utf8');
function section(start,end){
  const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
  assert(a>=0&&b>a,`Shared scene marker changed: ${start}`);return source.slice(a,b);
}
const harness=new Function('THREE','electrificationHelpers',`
 const {${Object.keys(electrificationHelpers).join(',')}}=electrificationHelpers;
  ${section('const C = {','\nconst VIEW')}
  const compatibility=true,scene=new THREE.Scene(),models=new Map();let building;
  ${section('  const materials = new Map();','  const ground = ')}
  ${section('  function startModel(','  function registerAnimator(')}
  function registerAnimator(fn){building.animators.push(fn);}
  return {models,api:{THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,torus,tube,roundedPanel,explode,shell,foot,makeTrack,makeTrain,makePrimary,makeBogie,makeSubstation,makePowerTransformer,makePowerRectifier,makePowerSwitchgear,powerTrace,cabinet,registerAnimator}};
`)(THREE,electrificationHelpers);
for(const [registry,build]of [[TRACK_VIEWS,buildTrackView],[SIGNALLING_VIEWS,buildSignallingView],[PLATFORM_VIEWS,buildPlatformView]])for(const view of Object.keys(registry))build(view,harness.api);
const visible=node=>{for(let n=node;n;n=n.parent)if(!n.visible)return false;return true;};
function scene(view,variant,technology,cutaway=true){
  const record=harness.models.get(view);assert(record,`Missing ${view}`);
  for(const candidate of harness.models.values())candidate.root.visible=candidate===record;
  for(const node of record.shells)node.visible=!cutaway;
  for(const item of record.exploded)item.node.position.copy(item.base);
  const state={view,variant,technology,phase:0,scenario:'nominal',signals:true,exploded:0,cutaway,mode:'coasting',receptivity:'train'};
  for(const animate of record.animators)animate(state);
  record.root.updateWorldMatrix(true,true);return record;
}
function parts(record){return new Set([...record.parts].filter(([,nodes])=>nodes.some(visible)).map(([id])=>id));}
function fingerprint(record){
  const rows=[];
  record.root.traverseVisible(node=>{
    if(!node.geometry)return;
    if(!node.geometry.boundingBox)node.geometry.computeBoundingBox();
    const materials=Array.isArray(node.material)?node.material:[node.material];
    rows.push([node.geometry.type,node.geometry.attributes.position.count,
      node.geometry.boundingBox?.min.toArray(),node.geometry.boundingBox?.max.toArray(),
      node.matrixWorld.elements.map(n=>Number(n.toFixed(6))),
      materials.map(m=>[m.color?.getHex(),m.opacity])]);
  });
  return createHash('sha256').update(JSON.stringify(rows)).digest('hex');
}
const expectedControl={loop:'seltrac-loop',radio:'wayside-radio',fixed:'lineside-signal',etcs1:'leu',etcs2:'rbc'};
for(const view of ['system','guideway','bogie','vehicle','control','communications']){
  const signatures=new Set();
  for(const propulsion of ['lim','rotary'])for(const control of Object.keys(expectedControl)){
    const record=scene(view,'default',{propulsion,control}),ids=parts(record);
    assert(ids.has(expectedControl[control]),`${view}/${propulsion}/${control} lacks replacement control equipment`);
    assert.equal(ids.has('reaction-rail'),propulsion==='lim',`${view} reaction rail disagrees with propulsion`);
    assert.equal(ids.has('lim-primary'),propulsion==='lim',`${view} primary disagrees with propulsion`);
    if(view!=='guideway')assert.equal(ids.has('rotary-traction-motor'),propulsion==='rotary',`${view} rotary motor disagrees with propulsion`);
    assert.equal(ids.has('seltrac-loop'),control==='loop',`${view} retained a hidden control alternative`);
    assert.equal(ids.has('rbc'),control==='etcs2',`${view} RBC disagrees with control`);
    assert.equal(ids.has('leu'),control==='etcs1',`${view} LEU disagrees with control`);
    if(view!=='guideway')assert.equal(ids.has('loop-pickup'),control==='loop',`${view} loop pickup disagrees with control`);
    signatures.add(fingerprint(record));
  }
  assert.equal(signatures.size,10,`${view}: independent choices produced an identical visible scene`);
}
for(const propulsion of ['lim','rotary'])for(const control of ['loop','radio','fixed','etcs1','etcs2']){
  const route=controlRoute(control),record=scene(route.view,route.variant,{propulsion,control}),ids=parts(record);
  assert.equal(ids.has('lim-primary'),propulsion==='lim',`${control} lost the independent LIM context`);
  assert.equal(ids.has('reaction-rail'),propulsion==='lim',`${control} depicts LIM without its secondary`);
  assert.equal(ids.has('rotary-traction-motor'),propulsion==='rotary',`${control} lost the independent rotary context`);
  assert(ids.has('collector')&&ids.has('positive-rail')&&ids.has('negative-rail'),`${control} unexpectedly changed the DC supply`);
}
let compared=0;
for(const view of [...Object.keys(TRACK_VIEWS),...Object.keys(SIGNALLING_VIEWS),...Object.keys(PLATFORM_VIEWS)]){
  const variants=VIEWS[view]?.variants||[];
  if(variants.length<2)continue;
  for(const cutaway of [false,true]){
    const signatures=variants.map(v=>fingerprint(scene(view,v.id,{propulsion:'lim',control:'loop'},cutaway)));
    assert.equal(new Set(signatures).size,variants.length,`${view}: a variant is a visual no-op with cutaway=${cutaway}`);
  }
  compared+=variants.length;
}
console.log(`PASS actual geometry: 60 independent technology scenes, 10 architecture/propulsion combinations, ${compared} track/signalling/platform variants in assembled and cutaway states`);

