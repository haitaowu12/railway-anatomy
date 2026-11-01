#!/usr/bin/env node
import {createMechanicalDetails} from '../dist/mechanical-details.js';
import {createEquipmentDetails} from '../dist/equipment-details.js';
const detailFactories={createMechanicalDetails,createEquipmentDetails};
import * as electrificationHelpers from '../dist/electrification.js';
// Exercise actual OCC builders with the viewer's primitives, without a DOM.
// These checks verify teaching distinctions and geometry, not rendering quality
// or the correctness of an operational control system.
import assert from 'node:assert/strict';
import {explorationCapabilities,separationEntries} from '../dist/exploration.js';
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
const harness=new Function('THREE','electrificationHelpers','detailFactories',`
 const {createMechanicalDetails,createEquipmentDetails}=detailFactories;
 const {${Object.keys(electrificationHelpers).join(',')}}=electrificationHelpers;
 ${between('const C = {','\nconst VIEW')}
 const compatibility=true,scene=new THREE.Scene(),models=new Map();let building;
 ${between('  const materials = new Map();','  const ground = ')}
 ${between('  function startModel(','  function registerAnimator(')}
 function registerAnimator(fn){building.animators.push(fn);}
 return {models,api:{THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,torus,tube,roundedPanel,explode,shell,foot,makeTrack,makeTrain,makePrimary,makeBogie,makeSubstation,makePowerTransformer,makePowerRectifier,makePowerSwitchgear,powerTrace,cabinet,registerAnimator}};
`);
const {models,api}=harness(THREE,electrificationHelpers,detailFactories);
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
function check(name,fn){try{fn();passed++;console.log('PASS '+name);}catch(e){failures.push(name);console.error('FAIL '+name+': '+e.message);}}
const byId=new Map(concepts.map(c=>[c.id,c]));
check('OCC builders, legacy routes and public references form a complete contract',()=>{
 assert.deepEqual(Object.keys(occ.OCC_VIEWS).sort(),Object.keys(data.OCC_VIEW_DATA).sort());
 const knownSources=new Set(sources.map(s=>s.id)),knownConcepts=new Set(concepts.map(c=>c.id));
 for(const view of Object.values(data.OCC_VIEW_DATA))for(const v of view.variants){assert(knownConcepts.has(v.component));for(const ref of v.sources)assert(knownSources.has(ref),'Unknown source '+ref);}
 for(const c of data.OCC_CONCEPTS){for(const ref of c.sources)assert(knownSources.has(ref),c.id+': '+ref);for(const related of c.related)assert(knownConcepts.has(related),c.id+': '+related);}
 for(const [id,camera]of Object.entries(occ.OCC_VIEWS)){assert(camera.camera.every(Number.isFinite));for(const component of models.get(id).parts.keys())assert(knownConcepts.has(component),id+': unknown '+component);}
 for(const s of data.OCC_SOURCES){assert(/^https:\/\//.test(s.url));assert(s.scope&&s.description);}
 for(const guide of data.OCC_READING_GUIDES){assert(guide.sections.reduce((n,s)=>n+s.text.split(/\s+/).length,0)<=900);for(const section of guide.sections)for(const ref of section.sources)assert(knownSources.has(ref));}
});
check('Every promised OCC primary/context has visible equipment or a deliberate process-context alias',()=>{
 for(const [component,contexts]of Object.entries(data.OCC_CONTEXTS))for(const [view,variants]of Object.entries(contexts))for(const variant of variants){
  const target=data.OCC_CONTEXT_TARGETS[component]||component,r=set(view,variant,{phase:1});
  assert(r.picks.some(n=>n.userData.component===target&&visible(n)),component+' → '+view+'/'+variant+' ('+target+')');
 }
});
check('Equipment sidebar lists only physical equipment or places',()=>{
 for(const [view,ids]of Object.entries(data.OCC_EQUIPMENT_BY_VIEW))for(const id of ids)assert(['equipment','place'].includes(byId.get(id)?.kind),view+': '+id+' is not physical');
 for(const [view,ids]of Object.entries(data.OCC_INFORMATION_BY_VIEW))for(const id of ids)assert.equal(byId.get(id)?.kind,'information',view+': '+id);
 assert.equal(data.OCC_VIEW_DATA['occ-supervision'].defaultPresentation,'connections');
 assert(data.OCC_VIEW_DATA['occ-incident'].variants.every(v=>v.presentation==='process'));
});
check('OCC geometry contains no people, paper process forms or freestanding logical timelines',()=>{
 for(const [view,r]of models){r.root.traverse(n=>{
  assert(!n.userData.role,view+': role figure survived');
  assert(!/role-figure|person-head|coordination-record|outgoing-record|incoming-record|record-table|persistent-coordination-position/.test(n.name),view+': '+n.name);
 });}
 for(const view of ['occ-workplace','occ-supervision','occ-equipment']){
  const r=set(view,view==='occ-workplace'?'task':view==='occ-equipment'?'normal':'traffic',{phase:5});
  for(const n of r.parts.get('occ-record-timeline')||[])if(visible(n)){let p=n,screen=false;while(p){if(p.name==='monitor-lcd-panel')screen=true;p=p.parent;}assert(screen,'History must be on a display surface');}
 }
});
check('Room furniture stays fixed across legacy activity links',()=>{
 const r=set('operations-centre','service',{phase:0}),before=geometryDigest(r.root);
 for(const variant of ['incident','handover']){set('operations-centre',variant,{phase:0});assert.equal(geometryDigest(r.root),before);}
});
check('Local and remote console arrangements change actual computing hardware',()=>{
 const r=set('occ-workplace','task');one(r,'client-computer-board');assert.equal(nodes(r,'kvm-interface-board').length,0);assert.equal(nodes(r,'shared-display-panel').length,0);
 set('occ-workplace','shared');assert.equal(nodes(r,'client-computer-board').length,0);assert(nodes(r,'kvm-interface-board').length>0);assert.equal(nodes(r,'shared-display-panel').length,2);
});
check('A returned observation appears at its captioned stage and stays present at phase5',()=>{
 for(const variant of ['traffic','power','station']){
  const r=set('occ-supervision',variant,{phase:0});assert.equal(nodes(r,'received-state-glyph').length,0);
  set('occ-supervision',variant,{phase:2.8});assert.equal(nodes(r,'received-state-glyph').length,0);
  set('occ-supervision',variant,{phase:3.6});assert.equal(nodes(r,'received-state-glyph').length,1);
  set('occ-supervision',variant,{phase:5});assert.equal(nodes(r,'received-state-glyph').length,2);
  const end=geometryDigest(r.root);set('occ-supervision',variant,{phase:5,playing:true});assert.equal(geometryDigest(r.root),end,'Playing must not wrap phase5 unexpectedly');
 }
});
check('Logical field systems are located in topology rather than placed inside the console model',()=>{
 for(const variant of ['traffic','power','station']){
  const r=set('occ-supervision',variant);
  for(const id of ['interlocking','breaker','power-scada','station-scada','tunnel-fan'])assert(!r.parts.has(id),variant+': field equipment incorrectly colocated');
  const v=data.OCC_VIEW_DATA['occ-supervision'].variants.find(v=>v.id===variant),topology=v.topology,known=new Set(topology.nodes.map(n=>n.id));
  assert(topology.nodes.find(n=>n.id==='field').location!=='Control room');
  assert(topology.nodes.find(n=>n.id==='application').location==='Technical room');
  for(const edge of topology.edges){assert(known.has(edge.from));assert(known.has(edge.to));}
  for(const step of v.animation.steps){for(const id of step.activeNodes||[])assert(known.has(id));for(const i of step.activeEdges||[])assert(topology.edges[i]);for(const id of Object.keys(step.states||{}))assert(known.has(id));}
  const received=v.animation.steps.find(s=>s.label==='Received at interface');assert.match(received.states.field,/unconfirmed/);
 }
});
check('Display loss retains application and recording outcome without inventing a field failure',()=>{
 const r=set('occ-equipment','display-loss',{phase:0});one(r,'display-unavailable-symbol');
 set('occ-equipment','display-loss',{phase:5});one(r,'display-unavailable-symbol');
 const host=one(r,'application-host-a'),recorder=one(r,'event-recorder-hardware');
 const enabled=n=>n.children.some(c=>c.visible);
 assert(enabled(host)&&enabled(recorder));
 assert.equal(nodes(r,'recording-state').filter(n=>n.children[1].visible).length,1,'Recorder receives despite unavailable task display');
 const task=one(r,'task-monitor');assert.equal(nodes({root:task},'received-state-glyph').length,0,'Unavailable task picture must remain unavailable');
});
check('Alternate host selection is fixed before the information trace',()=>{
 const r=set('occ-equipment','alternate',{phase:0}),rooms=[];r.root.traverse(n=>{if(n.userData.selectedHost)rooms.push(n);});assert(rooms.length);
 for(const phase of [0,2.5,5]){set('occ-equipment','alternate',{phase});assert(rooms.every(n=>n.userData.selectedHost==='B'));}
});
check('Every enabled OCC motion has finite stages, outcome and duration',()=>{
 for(const [view,v]of Object.entries(data.OCC_VIEW_DATA))for(const option of v.variants.filter(v=>v.motion)){
  const guide=option.animation||v.animation;assert(guide&&guide.duration>=8,view+'/'+option.id);
  assert.equal(guide.steps[0].at,0);assert.equal(guide.steps.at(-1).at,1);
  const r=set(view,option.id,{phase:0}),before=geometryDigest(r.root);set(view,option.id,{phase:5});assert.notEqual(geometryDigest(r.root),before,view+'/'+option.id+': idle sequence');
 }
});
check('Monitor, computing, network and UPS assemblies have independently movable internal parts',()=>{
 for(const [view,variant,names]of [
 ['occ-workplace','task',['monitor-controller-board','monitor-power-board','monitor-lcd-panel','removable-keyboard','client-computer-board']],
 ['occ-equipment','normal',['application-server-board','server-storage-carrier','router-interface-board','recorder-main-board','removable-recording-disk','ups-battery-cassette','ups-conversion-board']]
 ]){
  const r=set(view,variant);
  for(const name of names){const n=nodes(r,name)[0];assert(n,view+': '+name);const registration=r.exploded.find(e=>e.node===n);assert(registration&&registration.delta.length()>.1,name+': no authored separation');}
 }
});
check('OCC inspection names removable hardware and distinguishes local and remote computing',()=>{
 for(const [view,config]of Object.entries(data.OCC_VIEW_DATA))for(const variant of config.variants){
  const r=set(view,variant.id,{cutaway:false});
  for(const {node}of separationEntries(r))assert(node.userData.explorationLabel?.trim(),`${view}/${variant.id}: unnamed removable piece ${node.name}`);
 }
 const local=set('occ-workplace','task',{cutaway:false});
 assert.deepEqual(explorationCapabilities(local,'occ-client-computer').pieceNames,['Client computer cover','Client computer board']);
 const monitor=explorationCapabilities(local,'occ-task-display').pieceNames;
 for(const name of ['Monitor rear enclosure','Monitor controller board','Monitor power board','LCD panel'])assert(monitor.includes(name));
 const remote=set('occ-workplace','shared',{cutaway:false});
 assert.deepEqual(explorationCapabilities(remote,'occ-kvm-interface').pieceNames,['KVM receiver cover','KVM interface board']);
 assert(!explorationCapabilities(remote,'occ-console').pieceNames.includes('Client computer board'),'Remote console exposes hidden local-computer contents');
});
console.log('\n'+passed+' passed; '+failures.length+' failed.');if(failures.length)process.exitCode=1;

