#!/usr/bin/env node
import * as electrificationHelpers from '../dist/electrification.js';
// Exercise actual OCC builders with the viewer's primitives, without a DOM.
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
const failures=[];let passed=0;
function check(name,fn){try{fn();passed++;console.log(`PASS ${name}`);}catch(e){failures.push(name);console.error(`FAIL ${name}: ${e.message}`);}}

check('OCC builders, data, variants and public references form a complete contract',()=>{
 assert.deepEqual(Object.keys(occ.OCC_VIEWS).sort(),Object.keys(data.OCC_VIEW_DATA).sort());
 const knownSources=new Set(sources.map(s=>s.id)),knownConcepts=new Set(concepts.map(c=>c.id));
 for(const view of Object.values(data.OCC_VIEW_DATA))for(const v of view.variants){assert(knownConcepts.has(v.component));for(const ref of v.sources)assert(knownSources.has(ref),`Unknown source ${ref}`);}
 for(const c of [...data.OCC_CONCEPTS,...data.OCC_CONCEPT_UPDATES]){for(const s of c.sources||[])assert(knownSources.has(s),`${c.id}: unknown ${s}`);for(const r of c.related||[])assert(knownConcepts.has(r),`${c.id}: unknown relation ${r}`);}
 for(const [id,camera]of Object.entries(occ.OCC_VIEWS)){assert(camera.camera.every(Number.isFinite));assert(camera.target.every(Number.isFinite));for(const component of models.get(id).parts.keys())assert(knownConcepts.has(component),`${id}: unknown geometry ${component}`);}
 for(const s of data.OCC_SOURCES){assert(/^https:\/\//.test(s.url));assert(s.scope&&s.description);}
 for(const guide of data.OCC_READING_GUIDES){assert(guide.sections.reduce((n,s)=>n+s.text.split(/\s+/).length,0)<=900);for(const section of guide.sections)for(const ref of section.sources)assert(knownSources.has(ref));}
});
check('All OCC alternatives have finite geometry and visibly different meshes or paths',()=>{
 for(const [view,config]of Object.entries(data.OCC_VIEW_DATA)){
  const hashes=[];
  for(const variant of config.variants.filter(v=>v.presentation!=='process')){const r=set(view,variant.id);r.root.traverse(n=>{if(n.geometry?.attributes.position)for(const f of n.geometry.attributes.position.array)assert(Number.isFinite(f),`${view}: invalid vertex`);for(const f of [...n.position.toArray(),...n.scale.toArray()])assert(Number.isFinite(f),`${view}: invalid transform`);});hashes.push(geometryDigest(r.root));}
  assert.equal(new Set(hashes).size,config.variants.filter(v=>v.presentation!=='process').length,`${view}: alternatives do not change visible geometry`);
 }
});
check('Every OCC primary and advertised context contains selectable visible equipment',()=>{
 for(const [id,[view,variant]]of Object.entries(data.OCC_PRIMARY)){
  const r=set(view,variant);assert(r.picks.some(n=>n.userData.component===id&&visible(n)),`${id}: no primary geometry in ${view}/${variant}`);
 }
 for(const [id,contexts]of Object.entries({...data.OCC_CONTEXTS,...data.OCC_SHARED_CONTEXTS}))for(const [view,variants]of Object.entries(contexts))for(const variant of variants){
  assert(data.OCC_VIEW_DATA[view].variants.some(v=>v.id===variant));const r=set(view,variant);
  assert(r.picks.some(n=>n.userData.component===id&&visible(n)),`${id}: promised context absent in ${view}/${variant}`);
 }
});
check('Control-room furniture persists across all legacy activity links',()=>{
 const names=['persistent-coordination-position','operations-traffic-supervision','operations-signalling-workstation','operations-power-control','operations-station-supervision','operations-radio-dispatch'];
 const r=set('operations-centre','service');const original=names.map(name=>geometryDigest(one(r,name)));
 for(const variant of ['incident','handover']){set('operations-centre',variant);assert.deepEqual(names.map(name=>geometryDigest(one(r,name))),original,`${variant}: furniture appeared, disappeared or moved`);}
});
check('Request receipt and returned indication have different geometry and phase endpoints',()=>{
 for(const variant of ['traffic','power','station']){
  const r=set('occ-supervision',variant),request=one(r,'supervisory-request-token');
  const start=request.getWorldPosition(new THREE.Vector3());assert.equal(nodes(r,'field-indication-token').length,0);
  assert.equal(nodes(r,'request-receipt-marker').length,0);
  set('occ-supervision',variant,{phase:1.8});const received=request.getWorldPosition(new THREE.Vector3());assert(received.distanceTo(start)>10);one(r,'request-receipt-marker');assert.equal(nodes(r,'field-indication-token').length,0);
  set('occ-supervision',variant,{phase:3.5});const feedback=one(r,'field-indication-token');const fieldEnd=feedback.getWorldPosition(new THREE.Vector3());assert(fieldEnd.distanceTo(received)>1);
  assert.equal(nodes(r,'returned-indication-at-display').length,0);
  set('occ-supervision',variant,{phase:5});const returned=feedback.getWorldPosition(new THREE.Vector3());assert(returned.distanceTo(start)<.3);one(r,'returned-indication-at-display');
  const out=one(r,'supervisory-request-route'),back=one(r,'field-indication-route');assert.notEqual(geometryDigest(out),geometryDigest(back));
  set('occ-supervision',variant,{phase:5,playing:true});assert.equal(nodes(r,'field-indication-token').length,0);assert(request.getWorldPosition(new THREE.Vector3()).distanceTo(start)<1e-9);
 }
});
check('The information animation never moves the point, breaker or fan',()=>{
 for(const [variant,name]of [['traffic','stationary-traffic-plant'],['power','stationary-power-plant'],['station','stationary-station-plant']]){
  const r=set('occ-supervision',variant),plant=one(r,name),before=geometryDigest(plant);
  for(const phase of [1,1.8,3.5,5,7.8]){set('occ-supervision',variant,{phase});assert.equal(geometryDigest(plant),before,`${variant}: message animation changes field equipment`);}
 }
});
check('Acknowledgement and coordination retain the reported condition',()=>{
 const r=set('occ-incident','reported'),marker=one(r,'reported-condition-marker'),field=one(r,'persistent-field-condition');
 const original=[geometryDigest(marker),geometryDigest(field)];assert.equal(nodes(r,'acknowledgement-panel').length,0);
 for(const variant of ['acknowledged','coordinated']){
  set('occ-incident',variant,{phase:5});one(r,'acknowledgement-panel');assert.deepEqual([geometryDigest(marker),geometryDigest(field)],original,`${variant}: condition was cleared`);
 }
 const fieldToken=one(r,'field-communication-token'),passengerToken=one(r,'passenger-communication-token');assert(fieldToken.getWorldPosition(new THREE.Vector3()).distanceTo(passengerToken.getWorldPosition(new THREE.Vector3()))>6,'Recipients collapse to one destination');
});
check('Display loss interrupts presentation while preserving services and field equipment',()=>{
 const r=set('occ-equipment','normal'),field=one(r,'unchanged-remote-field-equipment'),service=one(r,'application-path-a');
 const before=[geometryDigest(field),geometryDigest(service)];one(r,'application-a-client');one(r,'available-client-picture');
 set('occ-equipment','display-loss');assert.equal(nodes(r,'application-a-client').length,0);assert.equal(nodes(r,'available-client-picture').length,0);one(r,'unavailable-client-picture');one(r,'application-a-network');one(r,'network-field');
 assert.deepEqual([geometryDigest(field),geometryDigest(service)],before);
});
check('Alternative service connects B and disconnects A without a timed recovery claim',()=>{
 const r=set('occ-equipment','alternate');one(r,'application-b-client');one(r,'application-b-network');assert.equal(nodes(r,'application-a-client').length,0);assert.equal(nodes(r,'application-a-network').length,0);one(r,'network-field');
 const before=geometryDigest(r.root);for(const phase of [0,1,5,11]){set('occ-equipment','alternate',{phase});assert.equal(geometryDigest(r.root),before);}
});
check('Both handover records retain the outstanding item throughout the exchange',()=>{
 for(const view of ['operations-centre','occ-workplace']){
  const r=set(view,'handover');one(r,'outgoing-record');one(r,'incoming-record');const markers=nodes(r,'retained-outstanding-item');assert.equal(markers.length,2);const before=markers.map(geometryDigest);
  for(const phase of [0,2.5,5]){set(view,'handover',{phase});assert.deepEqual(markers.map(geometryDigest),before);}
 }
});
check('Workplace and equipment assemblies contain real independently movable pieces',()=>{
 for(const [view,variant,names]of [['occ-workplace','task',['removable-task-monitor','removable-keyboard','pointing-device']],['occ-equipment','normal',['removable-equipment-module','removable-power-module']]]){
  const r=set(view,variant);
  for(const name of names){const n=nodes(r,name)[0];assert(n,`${view}: ${name} absent`);const registration=r.exploded.find(e=>e.node===n);assert(registration&&registration.delta.length()>0,`${name}: no physical separation`);const before=new THREE.Box3().setFromObject(n).getCenter(new THREE.Vector3());n.position.copy(registration.base).add(registration.delta);n.updateWorldMatrix(true,true);const after=new THREE.Box3().setFromObject(n).getCenter(new THREE.Vector3());assert(after.distanceTo(before)>.1,`${name}: separation does not move actual geometry`);}
 }
});

console.log(`\n${passed} passed; ${failures.length} failed.`);
if(failures.length)process.exitCode=1;
