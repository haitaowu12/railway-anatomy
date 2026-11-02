#!/usr/bin/env node
import {createMechanicalDetails} from '../dist/mechanical-details.js';
import {createEquipmentDetails} from '../dist/equipment-details.js';
import {occContextFor,OCC_APPLICATIONS,OCC_DEVICE_POINTS} from '../dist/occ-applications-data.js';
import {drawWithEnclosureOcclusion} from '../dist/precision-geometry.js';
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
  if(view==='occ-supervision'){
   const context=occContextFor(component,variant);assert(context,component+': missing readable application route');
   assert(OCC_APPLICATIONS.some(a=>a.id===context.app));assert(OCC_DEVICE_POINTS.some(p=>p.id===context.point));continue;
  }
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
check('OCC geometry contains physical hardware without people or software component proxies',()=>{
 const informationIds=new Set(['occ-information-quality','occ-supervisory-request','occ-field-indication','occ-record-timeline','occ-cctv-assessment','occ-passenger-communications','occ-access-supervision','occ-alarm-queue','operations-signalling-workstation','operations-power-control','operations-station-supervision','operations-traffic-supervision','telecom-scada']);
 for(const [view,r]of models){r.root.traverse(n=>{
  assert(!n.userData.role,view+': role figure survived');
  assert(!/role-figure|person-head|coordination-record|outgoing-record|incoming-record|record-table|persistent-coordination-position/.test(n.name),view+': '+n.name);
  assert(!informationIds.has(n.userData.component),view+': software drawn as hardware '+n.userData.component);
  assert(!/received-state-glyph|issued-request-glyph|history-glyph/.test(n.name),view+': obsolete message glyph');
 });}
});
check('Room furniture stays fixed across legacy activity links',()=>{
 const r=set('operations-centre','service',{phase:0}),before=geometryDigest(r.root);
 for(const variant of ['incident','handover']){set('operations-centre',variant,{phase:0});assert.equal(geometryDigest(r.root),before);}
});
check('Local and remote console arrangements change actual computing hardware',()=>{
 const r=set('occ-workplace','task');one(r,'client-computer-board');assert.equal(nodes(r,'kvm-interface-board').length,0);assert.equal(nodes(r,'shared-display-panel').length,0);
 set('occ-workplace','shared');assert.equal(nodes(r,'client-computer-board').length,0);assert(nodes(r,'kvm-interface-board').length>0);assert.equal(nodes(r,'shared-display-panel').length,2);
});
check('Physical OCC configurations do not animate application traces or assert failover outcomes',()=>{
 for(const view of ['operations-centre','occ-workplace','occ-equipment'])for(const option of data.OCC_VIEW_DATA[view].variants){
  assert(!option.motion,view+'/'+option.id+': process playback on a physical room');
  const r=set(view,option.id,{phase:0}),before=geometryDigest(r.root);set(view,option.id,{phase:5,playing:true});assert.equal(geometryDigest(r.root),before,view+': physical hardware changed with process time');
 }
 const r=set('occ-equipment','normal',{cutaway:false});one(r,'application-host-a');one(r,'application-host-b');one(r,'event-recorder-hardware');
 for(const variant of ['alternate','display-loss']){const before=geometryDigest(r.root);set('occ-equipment',variant,{cutaway:false});assert.equal(geometryDigest(r.root),before,'retired availability link changed hardware outcome');}
 for(const id of ['interlocking','breaker','power-scada','station-scada','telecom-scada','tunnel-fan'])assert(!r.parts.has(id),'Remote field/application system incorrectly colocated: '+id);
});
check('Desktop cable openings are actual holes and the computer has an installed mounting tray',()=>{
 const r=set('occ-workplace','task',{cutaway:false}),desktop=one(r,'desktop-with-cable-grommets'),tray=one(r,'client-computer-mounting-tray');
 const ray=new THREE.Raycaster();
 for(const [x,z]of [[-1.65,-.72],[1.5,-.72]]){
  const origin=desktop.localToWorld(new THREE.Vector3(x,1,z)),direction=new THREE.Vector3(0,-1,0).transformDirection(desktop.matrixWorld);ray.set(origin,direction);assert.equal(ray.intersectObject(desktop,false).length,0,'Cable grommet is a painted circle');
 }
 ray.set(desktop.localToWorld(new THREE.Vector3(0,1,0)),new THREE.Vector3(0,-1,0));assert(ray.intersectObject(desktop,false).length>0,'Desktop solid surface disappeared');
 const computer=one(r,'occ-client-computer'),tb=new THREE.Box3().setFromObject(tray),cb=new THREE.Box3().setFromObject(computer);
 assert(tb.min.y<cb.min.y&&tb.max.y>cb.max.y,'Computer is not captured by the mounting cradle');
 const supply=one(r,'console-supply-distribution');assert.equal(supply.userData.explorationLabel,'Console power distribution');assert.equal(nodes(r,'console-supply-socket-0').length,1);
 assert(!nodes(r,'physical-console')[0].children.some(n=>n.userData.explorationLabel==='Named field terminal strip'));
});
check('Wall-mounted display panels have hardware brackets and no desktop stands',()=>{
 const r=set('occ-workplace','shared',{cutaway:false});
 for(const display of nodes(r,'shared-display-panel')){
  assert(display.getObjectByName('display-wall-bracket'));assert(!display.getObjectByName('monitor-stand'));assert(display.getObjectByName('fixed-display-bezel'));assert(display.getObjectByName('display-vent-panel'));
 }
 assert.equal(nodes(r,'shared-display-panel').length,2);
 for(const n of nodes(r,'illustrative-screen-image')){assert(n.userData.decorativeScreen);assert(!n.userData.component,'Screen picture must inherit physical display identity');}
});
check('Assembled SVG display occlusion preserves inspection geometry and restores visibility after every draw',()=>{
 const r=set('occ-workplace','task',{cutaway:false}),internals=[];
 r.root.traverseVisible(n=>{if(n.isMesh&&n.userData.concealedWhenAssembled)internals.push(n);});assert(internals.length>10);
 const original=geometryDigest(r.root);
 drawWithEnclosureOcclusion(r.root,{cutaway:false,exploded:0},()=>{assert(internals.every(n=>!n.visible),'Closed electronics could paint through opaque display');for(const screen of nodes(r,'illustrative-screen-image'))assert.equal(screen.children.length,1,'Neutral display contains obsolete placeholder graphics');});
 assert.equal(geometryDigest(r.root),original,'SVG rendering mutated the inspection model');
 for(const state of [{cutaway:true,exploded:0},{cutaway:false,exploded:.6}])drawWithEnclosureOcclusion(r.root,state,()=>assert(internals.every(n=>n.visible),'Section or separation lost internal electronics'));
 assert.throws(()=>drawWithEnclosureOcclusion(r.root,{cutaway:false,exploded:0},()=>{throw new Error('expected drawing failure');}),/expected drawing failure/);
 assert.equal(geometryDigest(r.root),original,'A renderer exception left hidden inspectable parts');
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

