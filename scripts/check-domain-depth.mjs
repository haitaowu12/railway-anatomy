import assert from 'node:assert/strict';
import {studyHarness,THREE,visible} from './study-harness.mjs';
import {buildCommunicationsView} from '../dist/communications-models.js';
import {buildOccView} from '../dist/occ-models.js';
import {buildStationView} from '../dist/station-models.js';
import {buildPlatformView,PLATFORM_GEOMETRY} from '../dist/platform-models.js';
import {buildOperationsView} from '../dist/operations-models.js';
import {buildPowerView} from '../dist/electrification-models.js';
import {buildAssemblyIndex,assemblyFunctionalPaths} from '../dist/assembly-contract.js';
import {applySeparation,restoreSeparation} from '../dist/exploration.js';
import {DEPTH_SOURCES,DEPTH_LESSONS,ASSEMBLY_DEPENDENCIES,evaluateDependencyScenario,buildPointTrace} from '../dist/depth-content.js';
import {CONCEPTS,SOURCES} from '../dist/catalog.js';
import {VIEWS} from '../dist/model.js';

const h=await studyHarness(),concepts=new Set(CONCEPTS.map(n=>n.id)),sources=new Set([...SOURCES,...DEPTH_SOURCES].map(n=>n.id));
for(const [build,views]of [[buildCommunicationsView,['communications-network','communications-scada','communications-passenger']],[buildOccView,['occ-workplace','occ-equipment']],[buildStationView,['station-plant','ventilation-unit','station']],[buildPlatformView,['platform-interface']],[buildOperationsView,['depot-components']],[buildPowerView,['power-transformer','power-rectifier','power-switchgear']]])for(const view of views){build(view,h.api);buildAssemblyIndex(h.models.get(view));}
function set(view,variant,phase=0,options={}){const r=h.models.get(view);restoreSeparation(r);for(const record of h.models.values())record.root.visible=record===r;for(const e of r.exploded)e.node.position.copy(e.base);for(const shell of r.shells)shell.visible=options.cutaway===false;
 const state={view,variant,phase,playing:false,mode:'coasting',signals:true,cutaway:true,exploded:0,platformEdge:'full-height',platformSensor:'lidar',...options};r.animators.forEach(fn=>fn(state));r.root.updateWorldMatrix(true,true);return r;}
const named=(r,name)=>{const a=[];r.root.traverse(n=>{if(n.name===name&&visible(n))a.push(n);});return a;};
const one=(r,name)=>{const node=named(r,name)[0];assert(node,'Missing visible '+name);return node;};
let passed=0;const check=(name,fn)=>{fn();passed++;console.log('PASS '+name);};

check('Depth lessons and explicit dependency graphs use valid sources, concepts and destinations',()=>{
 for(const source of DEPTH_SOURCES){assert.equal(new URL(source.url).protocol,'https:');assert(source.description&&source.scope);}
 for(const lesson of DEPTH_LESSONS){assert(VIEWS[lesson.view],lesson.view);if(lesson.variant)assert(VIEWS[lesson.view].variants.some(v=>v.id===lesson.variant),lesson.id);assert(['vehicle','energy','track','station','information','maintenance'].includes(lesson.workspace));assert(lesson.question&&lesson.boundary&&lesson.steps.length>=3);for(const id of [...lesson.conceptIds,...lesson.steps.map(s=>s.conceptId)])assert(concepts.has(id),id);lesson.sources.forEach(id=>assert(sources.has(id),id));}
 for(const graph of ASSEMBLY_DEPENDENCIES){const ids=new Set(graph.nodes.map(n=>n.id));assert.equal(ids.size,graph.nodes.length);for(const n of graph.nodes)assert(concepts.has(n.conceptId));for(const e of graph.edges)assert(ids.has(e.from)&&ids.has(e.to));for(const scenario of graph.scenarios){scenario.unavailable.forEach(id=>assert(ids.has(id)));evaluateDependencyScenario(graph,scenario.id);}graph.sources.forEach(id=>assert(sources.has(id)));}
});
check('Power, network, viewing and recording failures remain distinct',()=>{
 const graph=ASSEMBLY_DEPENDENCIES.find(g=>g.id==='station-information-service'),state=id=>Object.fromEntries(evaluateDependencyScenario(graph,id).map(n=>[n.id,n.available]));
 assert(Object.values(state('normal')).every(Boolean));let s=state('network-loss');assert(s.camera&&s.pdu&&!s.live&&!s.record);
 s=state('recording-loss');assert(s.live&&!s.record&&s.camera);s=state('application-loss');assert(!s.live&&s.record);assert(Object.values(state('supply-loss')).every(v=>!v));
 const cyclic={...graph,edges:[...graph.edges,{from:'live',to:'supply'}]};assert.throws(()=>evaluateDependencyScenario(cyclic),/cycle/);
});
check('Point identity, units, source time and qualified status survive the invented exchange',()=>{
 const current=buildPointTrace(),delayed=buildPointTrace('delayed'),mismatch=buildPointTrace('mismatched'),uncertain=buildPointTrace('uncertain');
 assert(current.identityMatches);assert.equal(current.source.units,'%');assert.equal(delayed.source.sourceTime,current.source.sourceTime);assert(delayed.age>current.age);assert.equal(delayed.received.value,current.source.value);assert.equal(mismatch.identityMatches,false);assert(uncertain.source.quality.includes('Uncertain'));assert.throws(()=>buildPointTrace('invented-status'),/Unknown/);
});
check('RTU opening precedes module separation and repeated reassembly retains physical datum',()=>{
 const r=set('communications-scada','status',0,{cutaway:false}),cover=one(r,'rtu-cabinet-cover'),cpu=one(r,'rtu-processor-module'),owner=cpu.parent,coverStart=cover.position.clone(),cpuStart=cpu.position.clone(),ownerStart=owner.position.clone();
 applySeparation(r,{amount:.25,scope:'selected',componentId:'scada-rtu'});assert(cover.position.distanceTo(coverStart)>.5);assert.equal(cpu.position.distanceTo(cpuStart),0);
 for(let i=0;i<20;i++){applySeparation(r,{amount:1,scope:'selected',componentId:'scada-rtu'});assert(cpu.position.distanceTo(cpuStart)>.5);restoreSeparation(r);assert(cpu.position.distanceTo(cpuStart)<1e-9);assert(cover.position.distanceTo(coverStart)<1e-9);}assert.deepEqual(owner.position.toArray(),ownerStart.toArray());
 const roles=Array.from({length:8},(_,i)=>one(r,'rtu-terminal-'+i).userData.explorationLabel);assert(roles.includes('Digital input')&&roles.includes('Analogue input')&&roles.includes('Control output')&&roles.includes('Supply positive'));
});
check('Network connectors have individual identities and power routes do not masquerade as data',()=>{
 const r=set('communications-network','station',0,{cutaway:false}),port=one(r,'switch-data-port-1'),power=one(r,'switch-dc-inlet');assert(port.userData.instanceId&&power.userData.instanceId);assert.notEqual(port.userData.instanceId,power.userData.instanceId);
 assert.equal(one(r,'switch-power-board-route').userData.interfaceRoute.kind,'power');assert.equal(one(r,'switch-port-board-0').userData.interfaceRoute.kind,'data');assert(one(r,'rack-power-distribution'));assert(one(r,'rack-bonding-bar'));
 for(const mesh of port.children.filter(n=>n.isMesh))assert.equal(mesh.userData.pickInstanceId,port.userData.instanceId);
});
check('Every newly authored physical path resolves to actual local geometry or an existing external concept',()=>{
 for(const [view,variant]of [['communications-network','station'],['communications-network','onboard'],['communications-scada','status'],['communications-passenger','announcement'],['occ-workplace','task'],['occ-equipment','normal'],['station-plant','water'],['station-plant','electrical'],['ventilation-unit','air-handler'],['platform-interface','platform-doors'],['depot-components','brakes'],['depot-components','hvac'],['power-transformer','default'],['power-rectifier','default'],['power-switchgear','ac'],['power-switchgear','dc']]){
  const r=set(view,variant);let paths=0;r.root.traverse(n=>{if(!visible(n))return;for(const path of n.userData.functionalPaths||[]){paths++;assert(path.label&&path.description&&path.sources.length);path.sources.forEach(id=>assert(sources.has(id),id));for(const step of path.steps){if(step.nodeName)assert(n.getObjectByName(step.nodeName),`${view}: ${path.id}/${step.nodeName}`);else assert(concepts.has(step.conceptId),`${view}: missing path destination`);}}});assert(paths>0,view);
 }
});
check('Each OCC console follows its own input and display hardware',()=>{
 const r=set('occ-workplace','task');for(const console of named(r,'physical-console')){const paths=assemblyFunctionalPaths(r,console.userData.instanceId).filter(p=>p.id.startsWith(console.userData.instanceId+'::'));assert(paths.length);for(const path of paths)for(const step of path.steps)if(step.instanceId)assert(step.instanceId.startsWith(console.userData.instanceId+'/'),step.label+' escaped its console');}
 const power=one(r,'console-display-supply'),video=one(r,'console-video-cable');assert.equal(power.userData.interfaceRoute.kind,'power');assert.equal(video.userData.interfaceRoute.kind,'data');
});
check('Removed pump cover reveals real impeller geometry through a clear hydraulic passage',()=>{
 const r=set('station-plant','water',0,{cutaway:false}),hydraulic=one(r,'pump-hydraulic-section'),cover=one(r,'pump-cover'),impeller=one(r,'pump-impeller');
 const origin=hydraulic.localToWorld(new THREE.Vector3(1.2,.23,0)),direction=new THREE.Vector3(-1,0,0).transformDirection(hydraulic.matrixWorld),ray=new THREE.Raycaster(origin,direction);
 const first=()=>ray.intersectObject(hydraulic,true).find(hit=>visible(hit.object));let hit=first();assert(hit);assert(hit.object===cover||hit.object.parent===cover,'Closed cover does not enclose the working section');
 cover.visible=false;hit=first();assert(hit);let node=hit.object;while(node&&node!==impeller)node=node.parent;assert.equal(node,impeller,'A solid casing still hides the impeller');
 assert.equal(named(r,'pump-curved-impeller-vane').length,6);assert(one(r,'pump-shaft-seal'));assert.equal(one(r,'pump-inlet-interface').userData.interfaceKind,'fluid');
});
check('Supply fan has a real open annular passage, a fixed drive and separate condensate path',()=>{
 const r=set('depot-components','hvac'),fan=one(r,'hvac-supply-fan'),motor=one(r,'hvac-fan-motor'),filter=one(r,'hvac-removable-filter'),coil=one(r,'hvac-heat-exchanger');assert(filter.position.x<coil.position.x&&coil.position.x<fan.position.x);
 const start=fan.localToWorld(new THREE.Vector3(1,.4*Math.cos(Math.PI/12),.4*Math.sin(Math.PI/12))),dir=new THREE.Vector3(-1,0,0).transformDirection(fan.matrixWorld),ray=new THREE.Raycaster(start,dir);assert.equal(ray.intersectObject(fan,true).filter(hit=>visible(hit.object)).length,0,'Solid geometry fills the claimed airflow passage between blades');
 const angle=fan.rotation.x,motorPose=motor.rotation.toArray();set('depot-components','hvac',1);assert.notEqual(fan.rotation.x,angle);assert.deepEqual(motor.rotation.toArray(),motorPose);assert.equal(one(r,'hvac-condensate-drain').userData.interfaceRoute.kind,'fluid');
});
check('Facade anchors stay outside boarding apertures and fixed guides stay fixed during leaf travel',()=>{
 const r=set('platform-interface','platform-doors',0,{platformEdge:'full-height'}),D=PLATFORM_GEOMETRY;for(const base of named(r,'facade-post-base')){const bounds=new THREE.Box3().setFromObject(base);for(const cx of D.doorCenters)assert(bounds.max.x<=cx-D.aperture/2+1e-7||bounds.min.x>=cx+D.aperture/2-1e-7,'Post anchor intrudes into the boarding aperture');}
 const guide=one(r,'door-fixed-hanger-track'),position=guide.getWorldPosition(new THREE.Vector3()).toArray(),hanger=one(r,'door-leaf-hanger'),start=hanger.getWorldPosition(new THREE.Vector3()).x;set('platform-interface','platform-doors',2,{platformEdge:'full-height'});assert.deepEqual(guide.getWorldPosition(new THREE.Vector3()).toArray(),position);assert.notEqual(hanger.getWorldPosition(new THREE.Vector3()).x,start);
});
check('Electrical variants preserve phase count and distinct supervisory interfaces',()=>{
 const ac=set('power-switchgear','ac');assert.equal(named(ac,'switchgear-cable-termination-0').length,1);assert.equal(named(ac,'switchgear-cable-termination-2').length,1);assert.equal(one(ac,'switchgear-incoming-link-0').userData.interfaceRoute.kind,'power');assert.equal(one(ac,'switchgear-position-feedback').userData.interfaceRoute.kind,'information');
 const dc=set('power-switchgear','dc');assert.equal(named(dc,'switchgear-cable-termination-2').length,0);assert(one(dc,'breaker-arc-chute'));
 const transformer=set('power-transformer','default');assert.equal(one(transformer,'transformer-primary-terminal-0').parent.name,'transformer-primary-terminal-row');assert.equal(one(transformer,'transformer-secondary-terminal-0').parent.name,'transformer-secondary-terminal-row');assert(one(transformer,'transformer-primary-lead-0').parent!==one(transformer,'transformer-secondary-lead-0').parent);
});
console.log(`${passed} domain depth contracts passed.`);
