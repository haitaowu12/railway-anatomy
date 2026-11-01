#!/usr/bin/env node
import * as electrificationHelpers from '../dist/electrification.js';
// Exercise finite equipment mechanisms using the actual viewer primitives.
// These checks verify teaching distinctions and geometry, not rendering quality
// or the correctness of an operational control system.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(repo,'dist');
const load=file=>import(pathToFileURL(path.join(dist,file)).href);
const [THREE,occ,data,catalog]=await Promise.all([load('vendor/three.module.js'),load('occ-models.js'),load('occ-data.js'),load('catalog.js')]);
const sources=catalog.SOURCES.map(s=>({...s})),concepts=catalog.CONCEPTS.map(c=>({...c}));
data.applyOccCatalog(sources,concepts);
const source=await readFile(path.join(dist,'viewer.js'),'utf8');
const between=(a,b)=>{const x=source.indexOf(a),y=source.indexOf(b,x+a.length);assert(x>=0&&y>x,`Viewer helper marker changed: ${a}`);return source.slice(x,y);};
const harness=new Function('THREE','electrificationHelpers',`
 const {${Object.keys(electrificationHelpers).join(',')}}=electrificationHelpers;
 ${between('const C = {','\nconst VIEW')}
 const compatibility=true,scene=new THREE.Scene(),models=new Map();let building;
 ${between('  const materials = new Map();','  const ground = ')}
 ${between('  function startModel(','  function registerAnimator(')}
 function registerAnimator(fn){building.animators.push(fn);}
 return {models,api:{THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,torus,tube,roundedPanel,explode,shell,foot,makeTrack,makeTrain,makePrimary,makeBogie,makeSubstation,makePowerTransformer,makePowerRectifier,makePowerSwitchgear,powerTrace,cabinet,registerAnimator}};
`);
const {models,api}=harness(THREE,electrificationHelpers);
for(const id of Object.keys(occ.OCC_VIEWS))occ.buildOccView(id,api);
const visible=node=>{for(let p=node;p;p=p.parent)if(!p.visible)return false;return true;};
function set(view,variant,{phase=0,playing=false,signals=true,cutaway=true}={}){
 const record=models.get(view);assert(record,`Missing ${view}`);
 for(const candidate of models.values())candidate.root.visible=candidate===record;
 for(const shell of record.shells)shell.visible=!cutaway;
 for(const e of record.exploded)e.node.position.copy(e.base);
 const state={view,variant,phase,playing,signals,cutaway,scenario:'nominal',mode:'coasting',exploded:0,selected:null,receptivity:'train',technology:{propulsion:'lim',control:'loop'}};
 for(const update of record.animators)update(state);
 record.root.updateWorldMatrix(true,true);return record;
}
function nodes(record,name,{onlyVisible=true}={}){const found=[];record.root.traverse(n=>{if(n.name===name&&(!onlyVisible||visible(n)))found.push(n);});return found;}
function one(record,name){const found=nodes(record,name);assert.equal(found.length,1,`${name}: expected one visible node`);return found[0];}
function geometryDigest(node){
 const hash=createHash('sha256');node.updateWorldMatrix(true,true);
 node.traverse(n=>{if(!n.isMesh||!visible(n))return;hash.update(n.geometry.type);const a=n.geometry.attributes.position?.array;if(a)hash.update(Buffer.from(a.buffer,a.byteOffset,a.byteLength));hash.update(JSON.stringify(n.matrixWorld.elements));hash.update(String(n.material?.color?.getHex()));});return hash.digest('hex');
}

const [track,signalling,operations,application]=await Promise.all([load('track-models.js'),load('signalling-models.js'),load('operations-models.js'),load('model.js')]);
for(const id of ['turnout','switch-drive','crossing'])track.buildTrackView(id,api);
signalling.buildSignallingView('train-detection',api);
for(const id of ['depot-maintenance','depot-workshop'])operations.buildOperationsView(id,api);
const failures=[];let passed=0;
function check(name,fn){try{fn();passed++;console.log('PASS '+name);}catch(e){failures.push(name);console.error('FAIL '+name+': '+e.message);}}
const variants={turnout:['straight','diverging','crossover'],'switch-drive':['proved','unproved'],crossing:['frog','diamond'],'train-detection':['track-circuit','axle-counter','balise'],'depot-maintenance':['lifting','jacks','wheel-lathe'],'depot-workshop':['lathe']};
check('Every new mechanical sequence has finite captions aligned with the player range',()=>{
 for(const [view,options]of Object.entries(variants))for(const id of options){
  const option=application.VIEWS[view].variants.find(v=>v.id===id),guide=option.animation||application.VIEWS[view].animation;
  assert.equal(option.motion,true,view+'/'+id);assert(guide&&guide.duration>=8);
  assert.equal(guide.loop,false);assert.equal(guide.steps[0].at,0);assert.equal(guide.steps.at(-1).at,1);
  for(let i=1;i<guide.steps.length;i++)assert(guide.steps[i].at>guide.steps[i-1].at);
 }
});
check('Mechanical motion changes geometry, retains the phase5 endpoint and clamps overrun',()=>{
 for(const [view,options]of Object.entries(variants))for(const id of options){
  const r=set(view,id,{phase:0,signals:false}),start=geometryDigest(r.root);
  set(view,id,{phase:2.5,signals:false});const middle=geometryDigest(r.root);
  set(view,id,{phase:5,signals:false});const end=geometryDigest(r.root);
  assert.notEqual(start,middle,view+'/'+id+': no mechanical change');assert.notEqual(start,end,view+'/'+id+': endpoint resets to start');
  set(view,id,{phase:5,playing:true,signals:false});assert.equal(geometryDigest(r.root),end,view+'/'+id+': playback wraps the endpoint');
  set(view,id,{phase:12,signals:false});assert.equal(geometryDigest(r.root),end,view+'/'+id+': overrun escapes the finite trace');
 }
});
check('Selected turnout routes carry one wheelset along the corresponding alignment',()=>{
 for(const variant of ['straight','diverging','crossover']){
  const r=set('turnout',variant,{phase:0}),name=variant==='crossover'?'crossover-running-wheelset':'turnout-running-wheelset',train=one(r,name),start=train.position.clone();
  let previous=start.x;
  for(const phase of [1,2.5,4,5]){set('turnout',variant,{phase});assert(train.position.x>previous);previous=train.position.x;assert.equal(train.position.y,start.y);assert(Number.isFinite(train.rotation.y));}
  if(variant==='straight')assert.equal(train.position.z,0);
  if(variant==='diverging')assert(train.position.z>2.5);
  if(variant==='crossover'){assert(Math.abs(start.z+3.1)<1e-8);assert(Math.abs(train.position.z-3.1)<1e-8);}
  assert.equal(nodes(r,name).length,1);
 }
});
check('Fixed-crossing examples move the wheelset without moving a switch',()=>{
 for(const [variant,name]of [['frog','crossing-running-wheelset'],['diamond','diamond-running-wheelset']]){
  const r=set('crossing',variant,{phase:0}),train=one(r,name),height=train.position.y;
  assert.equal(train.position.x,-2.8);set('crossing',variant,{phase:2.5});assert(Math.abs(train.position.x)<1e-8);
  set('crossing',variant,{phase:5});assert.equal(train.position.x,2.8);assert.equal(train.position.y,height);
 }
});
check('Point drive separates unlock, blade movement and target position proof',()=>{
 for(const variant of ['proved','unproved']){
  const r=set('switch-drive',variant,{phase:0}),machine=(r.parts.get('track-point-machine')||[]).find(visible),gear=one(r,'illustrative-drive-gear');
  assert.equal(machine.userData.lockEngaged,true);assert.equal(machine.userData.targetProved,false);assert.equal(gear.rotation.x,0);
  set('switch-drive',variant,{phase:2.5});assert.equal(machine.userData.lockEngaged,false);assert.equal(machine.userData.targetProved,false);assert(gear.rotation.x>0);
  set('switch-drive',variant,{phase:5});assert.equal(machine.userData.lockEngaged,variant==='proved');assert.equal(machine.userData.targetProved,variant==='proved');
  assert(Math.abs(gear.rotation.x-(variant==='proved'?1:.52)*1.4)<1e-8);
  const atEnd=geometryDigest(r.root);set('switch-drive',variant,{phase:9});assert.equal(geometryDigest(r.root),atEnd,'Unproved example must not hunt');
 }
});
check('Track circuit responds to wheelset shunt and retains occupation until the rear axle clears',()=>{
 const r=set('train-detection','track-circuit',{phase:0});
 const receiver=(r.parts.get('track-circuit')||[]).find(n=>Object.hasOwn(n.userData,'energized'));assert(receiver);
 const section=one(r,'section-occupancy-indication');
 for(const [p,occupied]of [[0,false],[.18,true],[.32,true],[.72,true],[.86,false],[1,false]]){
  set('train-detection','track-circuit',{phase:p*5});
  assert.equal(section.userData.occupied,occupied);assert.equal(receiver.userData.energized,!occupied);
  assert.equal(nodes(r,'wheelset-conductive-shunt').length,occupied?1:0);
 }
});
check('Axle-counter illustration retains cumulative entries and exits after balanced passage',()=>{
 const r=set('train-detection','axle-counter',{phase:0});
 const panel=(r.parts.get('train-detection')||[]).find(n=>Object.hasOwn(n.userData,'entryCount'));assert(panel);
 for(const [p,entered,exited,remaining]of [[0,0,0,0],[.18,1,0,1],[.32,2,0,2],[.72,2,1,1],[.86,2,2,0],[1,2,2,0]]){
  set('train-detection','axle-counter',{phase:p*5});
  assert.deepEqual([panel.userData.entryCount,panel.userData.exitCount,panel.userData.remainingCount],[entered,exited,remaining]);
 }
});
check('Balise reference persists after leaving the localized coupling region',()=>{
 const r=set('train-detection','balise',{phase:0});assert.equal(nodes(r,'retained-balise-reference').length,0);assert.equal(nodes(r,'localized-balise-coupling').length,0);
 set('train-detection','balise',{phase:2.5});one(r,'retained-balise-reference');one(r,'localized-balise-coupling');
 set('train-detection','balise',{phase:5});one(r,'retained-balise-reference');assert.equal(nodes(r,'localized-balise-coupling').length,0);
 assert.equal(nodes(r,'section-occupancy-indication').length,0,'Balise example must not imply track-section occupancy detection');
});
console.log('\n'+passed+' passed; '+failures.length+' failed.');if(failures.length)process.exitCode=1;
