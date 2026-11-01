#!/usr/bin/env node
// Exercise the actual builders with the viewer primitives. These checks protect
// information/physical-state distinctions, authored separation and data links;
// they do not certify an installation, device or operating procedure.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(repo,'dist');
const load=file=>import(pathToFileURL(path.join(dist,file)).href);
const [THREE,model,data,catalog,station]=await Promise.all([load('vendor/three.module.js'),load('communications-models.js'),load('communications-data.js'),load('catalog.js'),load('station-models.js')]);
const sources=catalog.SOURCES.map(s=>({...s})),concepts=catalog.CONCEPTS.map(c=>({...c}));data.applyCommsCatalog(sources,concepts);
const source=await readFile(path.join(dist,'viewer.js'),'utf8');
const between=(a,b)=>{const x=source.indexOf(a),y=source.indexOf(b,x+a.length);assert(x>=0&&y>x,`Viewer helper marker changed: ${a}`);return source.slice(x,y);};
const harness=new Function('THREE',`
 ${between('const C = {','\nconst VIEW')}
 const compatibility=true,scene=new THREE.Scene(),models=new Map();let building;
 ${between('  const materials = new Map();','  const ground = ')}
 ${between('  function startModel(','  function registerAnimator(')}
 function registerAnimator(fn){building.animators.push(fn);}
 return {models,api:{THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,torus,tube,roundedPanel,explode,shell,foot,makeTrack,makeTrain,makePrimary,makeBogie,cabinet,registerAnimator}};
`);
const {models,api}=harness(THREE);
for(const id of Object.keys(model.COMMUNICATIONS_VIEWS))model.buildCommunicationsView(id,api);
for(const id of ['station','station-networks','fire-systems','ventilation-unit'])station.buildStationView(id,api);
const visible=node=>{for(let p=node;p;p=p.parent)if(!p.visible)return false;return true;};
function set(view,variant,{phase=0,playing=false,cutaway=true}={}){
 const r=models.get(view);assert(r,`Missing ${view}`);for(const candidate of models.values())candidate.root.visible=candidate===r;
 for(const n of r.shells)n.visible=!cutaway;for(const e of r.exploded)e.node.position.copy(e.base);
 for(const update of r.animators)update({view,variant,phase,playing,cutaway,signals:true,scenario:'nominal',mode:'coasting',exploded:0,selected:null,receptivity:'train',technology:{propulsion:'lim',control:'loop'}});
 r.root.updateWorldMatrix(true,true);return r;
}
const nodes=(r,name,onlyVisible=true)=>{const out=[];r.root.traverse(n=>{if(n.name===name&&(!onlyVisible||visible(n)))out.push(n);});return out;};
const one=(r,name)=>{const a=nodes(r,name);assert.equal(a.length,1,`${name}: expected one visible node, found ${a.length}`);return a[0];};
const world=n=>n.getWorldPosition(new THREE.Vector3());
function digest(root){const h=createHash('sha256');root.updateWorldMatrix(true,true);root.traverse(n=>{if(!n.isMesh||!visible(n))return;h.update(n.geometry.type);const a=n.geometry.attributes.position?.array;if(a)h.update(Buffer.from(a.buffer,a.byteOffset,a.byteLength));h.update(JSON.stringify(n.matrixWorld.elements));h.update(String(n.material?.color?.getHex()));});return h.digest('hex');}
const failures=[];let passed=0;
function check(name,fn){try{fn();passed++;console.log(`PASS ${name}`);}catch(e){failures.push(name);console.error(`FAIL ${name}: ${e.message}`);}}

check('Six views, public sources, concepts and topology endpoints form a complete contract',()=>{
 assert.deepEqual(Object.keys(model.COMMUNICATIONS_VIEWS).sort(),Object.keys(data.COMMUNICATIONS_VIEW_DATA).sort());
 const knownSources=new Set(sources.map(s=>s.id)),knownConcepts=new Set(concepts.map(c=>c.id));
 for(const c of [...data.COMMUNICATIONS_CONCEPTS,...data.COMMUNICATIONS_CONCEPT_UPDATES]){for(const ref of c.sources)assert(knownSources.has(ref),`${c.id}: ${ref}`);for(const id of c.related||[])assert(knownConcepts.has(id),`${c.id}: unknown relation ${id}`);}
 for(const [view,config]of Object.entries(data.COMMUNICATIONS_VIEW_DATA))for(const v of config.variants){
  assert(knownConcepts.has(v.component));assert(v.sources.length);v.sources.forEach(ref=>assert(knownSources.has(ref)));
  const t=v.topology;assert(t&&t.nodes.length>=4&&t.edges.length>=3,`${view}/${v.id}: empty topology`);const ids=new Set(t.nodes.map(n=>n.id));assert.equal(ids.size,t.nodes.length);
  for(const n of t.nodes)assert(knownConcepts.has(n.component)&&n.location&&n.role,`${view}/${v.id}: incomplete endpoint ${n.id}`);
  for(const e of t.edges){assert(ids.has(e.from)&&ids.has(e.to));assert(e.label&&['forward','both'].includes(e.direction));}
  if(v.motion){assert(v.animation?.steps.length>=3);assert(v.animation.steps[0].at===0);for(let i=0;i<v.animation.steps.length;i++){const step=v.animation.steps[i];assert(step.at>=0&&step.at<=1&&step.label&&step.description);if(i)assert(step.at>v.animation.steps[i-1].at);}}
 }
 for(const r of models.values())for(const component of r.parts.keys())assert(knownConcepts.has(component),`Unknown selectable geometry ${component}`);
 for(const s of data.COMMUNICATIONS_SOURCES)assert(/^https:\/\//.test(s.url)&&s.description&&s.scope);
 for(const guide of data.COMMUNICATIONS_READING_GUIDES){assert(guide.sections.reduce((n,s)=>n+s.text.split(/\s+/).length,0)<=900);for(const section of guide.sections)section.sources.forEach(ref=>assert(knownSources.has(ref)));}
});
check('Every new concept and advertised scene context has visible selectable geometry',()=>{
 for(const [id,[view,variant]]of Object.entries(data.COMMUNICATIONS_PRIMARY)){const r=set(view,variant);assert(r.picks.some(n=>n.userData.component===id&&visible(n)),`${id}: missing primary geometry`);}
 for(const [key,ids]of Object.entries(data.COMMUNICATIONS_SCENE_PARTS)){const [view,variant]=key.split('/'),r=set(view,variant);for(const id of ids)assert(r.picks.some(n=>n.userData.component===id&&visible(n)),`${key}: missing ${id}`);}
});
check('Every alternative changes physical geometry and all vertices remain finite',()=>{
 for(const [view,config]of Object.entries(data.COMMUNICATIONS_VIEW_DATA)){
  const hashes=[];for(const v of config.variants){const r=set(view,v.id);hashes.push(digest(r.root));r.root.traverse(n=>{for(const f of [...n.position.toArray(),...n.scale.toArray()])assert(Number.isFinite(f));if(n.geometry?.attributes.position)for(const f of n.geometry.attributes.position.array)assert(Number.isFinite(f));});}
  assert.equal(new Set(hashes).size,config.variants.length,`${view}: unchanged alternative`);
 }
});
check('Static alternatives stay static and motion examples change the visible result',()=>{
 for(const [view,config]of Object.entries(data.COMMUNICATIONS_VIEW_DATA))for(const v of config.variants){
  const hashes=[0,1.1,2.6,4.2,5].map(phase=>digest(set(view,v.id,{phase,cutaway:false}).root));
  if(v.motion)assert(new Set(hashes).size>1,`${view}/${v.id}: decorative or absent motion`);else assert.equal(new Set(hashes).size,1,`${view}/${v.id}: unadvertised motion`);
 }
});
check('Station rack separates passive fibre, optical module, active board and supply internals',()=>{
 const r=set('communications-network','station');
 for(const name of ['fibre-management-tray','removable-optical-transceiver','switch-circuit-board','switch-supply-module','router-interface-board','ups-battery-cassette','ups-conversion-board']){
  const n=one(r,name),e=r.exploded.find(e=>e.node===n);assert(e&&e.delta.length()>.3,`${name}: not physically separable`);assert(n.children.some(c=>c.isMesh),`${name}: empty decorative group`);
  const before=world(n);n.position.copy(e.base).add(e.delta);r.root.updateWorldMatrix(true,true);assert(world(n).distanceTo(before)>.3);
 }
 const sfp=one(r,'removable-optical-transceiver');assert.equal(sfp.userData.component,'optical-transceiver');assert(one(r,'fibre-management-tray').parent.userData.component==='fiber-patch-panel');
});
check('Onboard backbone has two consist interfaces and separate local device spurs',()=>{
 const r=set('communications-network','onboard');assert.equal(r.parts.get('onboard-ethernet-gateway').filter(visible).length,2);assert.equal(nodes(r,'onboard-network-board').length,2);
 const backbone=one(r,'inter-consist-backbone-route'),display=one(r,'local-passenger-display-spur-route'),camera=one(r,'local-camera-spur-route');assert.notEqual(digest(backbone),digest(display));assert.notEqual(digest(backbone),digest(camera));
 assert.equal(r.parts.get('telecom-rack')?.filter(visible).length||0,0);
});
check('SCADA indication comes from physical position before input and HMI changes',()=>{
 const r=set('communications-scada','status');const blade=one(r,'scada-damper-blade-0'),input=one(r,'scada-acquired-input'),hmi=r.parts.get('station-scada')[0];
 const earlier=digest(hmi);assert.equal(blade.rotation.x,0);assert.equal(input.children[1].visible,false);
 set('communications-scada','status',{phase:1.6});assert(blade.rotation.x>.5);assert.equal(input.children[1].visible,false);assert.equal(digest(hmi),earlier);
 set('communications-scada','status',{phase:2.5});assert(input.children[1].visible);assert.equal(digest(hmi),earlier);
 set('communications-scada','status',{phase:4.2});assert.notEqual(digest(hmi),earlier);one(r,'scada-retained-record');
});
check('SCADA request and relay do not prematurely prove physical position or feedback',()=>{
 const r=set('communications-scada','command',{phase:1.8});const blade=one(r,'scada-damper-blade-0'),relay=one(r,'scada-output-relay-armature'),input=one(r,'scada-acquired-input');
 assert.equal(blade.rotation.x,0);assert(relay.rotation.z<0);assert.equal(input.children[1].visible,false);const hmi=r.parts.get('station-scada')[0],before=digest(hmi);
 set('communications-scada','command',{phase:3.1});assert(blade.rotation.x>.5);assert.equal(input.children[1].visible,false);assert.equal(digest(hmi),before);
 set('communications-scada','command',{phase:4.1});assert(input.children[1].visible);assert.equal(digest(hmi),before);
 set('communications-scada','command',{phase:4.8});assert.notEqual(digest(hmi),before);
});
check('Stale SCADA leaves plant open, interrupts the link and retains a visibly qualified display',()=>{
 const r=set('communications-scada','stale');assert(one(r,'scada-damper-blade-0').rotation.x>1);one(r,'scada-stale-quality-marker');one(r,'scada-unavailable-link');assert.equal(nodes(r,'scada-uplink').length,0);
 const hmi=r.parts.get('station-scada')[0],before=digest(hmi);for(const phase of [1,3,5,11]){set('communications-scada','stale',{phase});assert.equal(digest(hmi),before);assert(one(r,'scada-damper-blade-0').rotation.x>1);}
});
check('Help-point button, pending call and answered audio are visibly distinct states',()=>{
 const r=set('communications-telephony','help-point');const button=one(r,'help-point-moving-button'),z=button.position.z;assert.equal(nodes(r,'established-two-way-audio').length,0);
 set('communications-telephony','help-point',{phase:1});assert(button.position.z<z);assert.equal(nodes(r,'established-two-way-audio').length,0);
 set('communications-telephony','help-point',{phase:2});assert.equal(button.position.z,z);assert(one(r,'help-point-call-state').children[1].visible);assert.equal(nodes(r,'established-two-way-audio').length,0);
 set('communications-telephony','help-point',{phase:4});one(r,'established-two-way-audio');
 for(const name of ['help-point-audio-board','help-point-speaker-driver','help-point-microphone','help-point-button-contact'])assert(r.exploded.some(e=>e.node===one(r,name)&&e.delta.length()>.25));
});
check('Operational voice changes the equipment without reusing train-control radio IDs',()=>{
 const r=set('communications-telephony','operational-radio');one(r,'cab-radio-control-head');one(r,'cab-radio-transceiver-board');one(r,'cab-radio-handset');one(r,'illustrative-radio-access-route');
 assert(!r.parts.get('train-radio')&&!r.parts.get('wayside-radio'));assert.equal(r.parts.get('emergency-intercom').filter(visible).length,0);
});
check('Passenger source, player and screen update in separate stages',()=>{
 const r=set('communications-passenger','information',{cutaway:false});const end=r.parts.get('station-pis')[0],earlier=digest(end);const player=one(r,'application-state');
 set('communications-passenger','information',{phase:1.3,cutaway:false});assert.equal(digest(end),earlier);assert.equal(player.children[1].visible,false);
 set('communications-passenger','information',{phase:2.8,cutaway:false});assert(player.children[1].visible);assert.equal(digest(end),earlier);
 set('communications-passenger','information',{phase:4.2,cutaway:false});assert.notEqual(digest(end),earlier);
 set('communications-passenger','information',{phase:4.2,cutaway:true});one(r,'removable-display-panel');assert.equal(nodes(r,'display-rear-cover').length,0);assert(r.exploded.some(e=>e.node===one(r,'removable-display-panel')),'Cutaway visibility must not remove authored panel separation');
});
check('PA has a distinct powered output and a physically moving speaker cone',()=>{
 const r=set('communications-passenger','announcement');const cone=one(r,'loudspeaker-moving-cone'),idle=cone.position.z;one(r,'loudspeaker-powered-circuit-route');one(r,'pa-network-audio-route');one(r,'amplifier-supply-route');
 set('communications-passenger','announcement',{phase:2.3});assert(one(r,'amplifier-active-channel').children[1].visible);assert.equal(cone.position.z,idle);
 set('communications-passenger','announcement',{phase:3.8});assert(Math.abs(cone.position.z-idle)>.01);
 for(const name of ['amplifier-input-board','amplifier-power-stage','amplifier-heat-sink','amplifier-loudspeaker-terminals','loudspeaker-driver-basket','loudspeaker-magnet'])assert(r.exploded.some(e=>e.node===one(r,name)&&e.delta.length()>.25));
});
check('Video capture, removable storage and live/retrieved branches remain distinct',()=>{
 const r=set('communications-security','video');for(const name of ['camera-lens-barrel','camera-sensor-board','camera-network-board','removable-recording-disk','recorder-main-board'])assert(r.exploded.some(e=>e.node===one(r,name)&&e.delta.length()>.25));
 assert.notEqual(digest(one(r,'live-view-branch-route')),digest(one(r,'recorded-view-branch-route')));
 const lens=world(one(r,'camera-lens-barrel')),sensor=world(one(r,'camera-sensor-board'));assert(lens.z>sensor.z);assert(Math.abs(lens.x-sensor.x)<1e-6);
});
check('Lock release precedes leaf motion and only leaf motion separates the door contact',()=>{
 const r=set('communications-security','access');const hinge=one(r,'access-door-hinge'),bolt=one(r,'retracting-lock-bolt'),magnet=one(r,'door-contact-magnet'),contact=one(r,'door-frame-contact');const closedGap=world(magnet).distanceTo(world(contact));assert(closedGap<.25);const locked=bolt.position.x;
 set('communications-security','access',{phase:2.2});assert(Math.abs(hinge.rotation.y)<1e-9);assert(bolt.position.x>locked+.25);assert.equal(world(magnet).distanceTo(world(contact)),closedGap);assert.equal(one(r,'access-door-contact-marker').children[1].visible,false);
 const boltBounds=new THREE.Box3().setFromObject(bolt),leafBounds=new THREE.Box3().setFromObject(one(r,'access-door-leaf'));assert(boltBounds.min.x>leafBounds.max.x,'Retracted bolt still obstructs the closed leaf');
 set('communications-security','access',{phase:3.65});assert(hinge.rotation.y<-.5);assert(world(magnet).distanceTo(world(contact))>closedGap+1);assert(one(r,'access-door-contact-marker').children[1].visible);
});
check('Manual end state remains visible and playback wraps new teaching cycles at five',()=>{
 for(const [view,variant]of [['communications-scada','command'],['communications-telephony','help-point'],['communications-passenger','information'],['communications-security','access']]){
  const start=digest(set(view,variant,{phase:0,cutaway:false}).root),end=digest(set(view,variant,{phase:5,cutaway:false}).root);assert.notEqual(start,end);assert.equal(digest(set(view,variant,{phase:5,playing:true,cutaway:false}).root),start);
 }
});
check('Station contexts retain real internally separable communication and plant assemblies',()=>{
 const names=[
  ['station','all',['help-point-audio-board','help-point-speaker-driver','camera-lens-barrel','camera-sensor-board','display-controller-board','loudspeaker-magnet']],
  ['station-networks','station',['switch-circuit-board','switch-supply-module']],
  ['fire-systems','detect',['fire-panel-processor-module','fire-panel-input-module','fire-panel-output-module','fire-panel-battery']],
  ['ventilation-unit','fan',['axial-impeller','fan-drive-motor']],
  ['ventilation-unit','damper',['damper-blade','damper-actuator-reduction']],
  ['ventilation-unit','air-handler',['air-filter-section','air-handler-coil','supply-air-impeller']],
 ];
 for(const [view,variant,required]of names){const r=set(view,variant);for(const name of required){const found=nodes(r,name);assert(found.length,`${view}/${variant}: ${name} absent`);for(const n of found)assert(r.exploded.some(e=>e.node===n&&e.delta.length()>.25),`${name}: no meaningful separation`);}}
 const r=set('fire-systems','detect');const module=one(r,'fire-panel-processor-module'),bounds=new THREE.Box3().setFromObject(module);const panel=module.parent;
 const fixedBackplates=panel.children.filter(n=>n.isMesh&&n.geometry.type==='BoxGeometry'&&n.geometry.parameters.depth<.06);assert(fixedBackplates.length);for(const p of fixedBackplates)assert(new THREE.Box3().setFromObject(p).max.z<bounds.min.z,'Fire-panel backplate occludes the board after cutaway');
});

console.log(`\n${passed} passed; ${failures.length} failed.`);if(failures.length)process.exitCode=1;
