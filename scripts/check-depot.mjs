#!/usr/bin/env node
import * as electrificationHelpers from '../dist/electrification.js';
/**
 * Headless scene/content contract check using Three.js and the actual shared
 * primitive functions from viewer.js. No DOM, renderer, browser or package
 * installation is needed. This does not replace visual presentation review.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(repo, 'dist');
const load = file => import(pathToFileURL(path.join(dist, file)).href);
const [THREE, operations, catalog, model] = await Promise.all([
  load('vendor/three.module.js'), load('operations-models.js'), load('catalog.js'), load('model.js'),
]);
const source = await readFile(path.join(dist, 'viewer.js'), 'utf8');
function between(start, end) {
  const a = source.indexOf(start), b = source.indexOf(end, a + start.length);
  assert(a >= 0 && b > a, `Shared geometry marker changed: ${start}; update this harness`);
  return source.slice(a, b);
}
const colors = between('const C = {', '\nconst VIEW');
const materials = between('  const materials = new Map();', '  const ground = ');
// This range includes the shared primitives and the original base scene builds.
// Using the implementation itself catches missing helpers and actual geometry
// failures instead of passing because a mock silently accepts the wrong call.
const shared = between('  function startModel(', '  function registerAnimator(');
const createHarness = new Function('THREE', 'electrificationHelpers', `
 const {${Object.keys(electrificationHelpers).join(',')}}=electrificationHelpers;
  ${colors}
  const compatibility = true;
  const scene = new THREE.Scene();
  const models = new Map();
  let building;
  ${materials}
  ${shared}
  function registerAnimator(fn) { building.animators.push(fn); }
  return { models, api: { THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,
    torus,tube,roundedPanel,explode,shell,foot,makeTrack,makeTrain,makePrimary,
    makeBogie,makeSubstation,makePowerTransformer,makePowerRectifier,makePowerSwitchgear,powerTrace,cabinet,registerAnimator } };
`);
const { models, api } = createHarness(THREE,electrificationHelpers);
const failures = [];
let passed = 0;
const check = (name, fn) => {
  try { fn(); passed++; console.log(`PASS ${name}`); }
  catch (error) { failures.push(name); console.error(`FAIL ${name}: ${error.message}`); }
};
const visible = node => {
  for (let p = node; p; p = p.parent) if (!p.visible) return false;
  return true;
};
const variantsFor = view => model.VIEWS[view]?.variants?.map(v => v.id) || ['default'];
function setScene(view, variant, { cutaway = true, phase = 1, playing = false, scenario = 'nominal', signals = true, technology = {propulsion:'lim',control:'loop'} } = {}) {
  const record = models.get(view);
  assert(record, `Missing constructed scene ${view}`);
  for (const candidate of models.values()) candidate.root.visible = candidate === record;
  for (const shell of record.shells) shell.visible = !cutaway;
  for (const e of record.exploded) e.node.position.copy(e.base);
  const state = { view, variant, phase, playing, scenario, signals, cutaway, technology, exploded: 0, mode: 'coasting', receptivity: 'train', selected: null };
  for (const animate of record.animators) animate(state);
  record.root.updateWorldMatrix(true, true);
  return record;
}


const depotData=await load('depot-data.js');
const atlas=await load('atlas-config.js');
for(const id of Object.keys(operations.OPERATIONS_VIEWS).filter(id=>id.startsWith('depot-')))operations.buildOperationsView(id,api);
const known=new Set(catalog.CONCEPTS.map(c=>c.id));
const recordFor=(view,variant)=>setScene(view,variant);
const namedVisible=(record,name)=>{
  const matches=[];record.root.traverse(n=>{if(n.name===name&&visible(n))matches.push(n);});return matches;
};
check('Every depot scene has finite geometry and declared concepts',()=>{
  for(const [view,record]of models)if(view.startsWith('depot-')){
    for(const id of record.parts.keys())assert(known.has(id),`${view} unknown ${id}`);
    for(const variant of variantsFor(view)){
      const active=recordFor(view,variant);
      active.root.traverse(n=>{
        if(n.geometry?.attributes.position)for(const v of n.geometry.attributes.position.array)assert(Number.isFinite(v),`${view}/${variant}: invalid vertex`);
        if(visible(n))for(const v of [...n.position.toArray(),...n.scale.toArray()])assert(Number.isFinite(v),`${view}/${variant}: invalid transform`);
      });
    }
  }
});
check('Every depot primary has visible selectable meshes in its promised variant',()=>{
 for(const [id,[view,variant]]of Object.entries(depotData.DEPOT_PRIMARY)){
  const record=recordFor(view,variant);const nodes=record.parts.get(id)||[];
  assert(nodes.some(n=>visible(n)),`${id} absent ${view}/${variant}`);
  const own=record.picks.filter(n=>n.userData.component===id&&visible(n));
  assert(own.length,`${id} has no selectable own geometry in ${view}/${variant}`);
 }
});
check('All advertised depot context variants contain the promised part',()=>{
 for(const id of Object.keys(depotData.DEPOT_PRIMARY))for(const [view,variants]of Object.entries(atlas.PART_VIEW_VARIANTS[id]))for(const variant of variants){
  const record=recordFor(view,variant);assert((record.parts.get(id)||[]).some(visible),`${id} unavailable in ${view}/${variant}`);
 }
});
check('Bogie drop removes exactly one attached bogie at the aligned aperture',()=>{
 const record=setScene('depot-maintenance','lifting',{phase:0});
 const attached=namedVisible(record,'attached-vehicle-bogie');
 assert.equal(attached.length,1);
 const body=namedVisible(record,'supported-vehicle-one-bogie-removed')[0];
 const lowered=namedVisible(record,'lowered-vehicle-bogie')[0];
 const aperture=namedVisible(record,'aligned-bogie-drop-aperture')[0];
 assert(body&&lowered&&aperture);
 assert.equal(body.userData.removedBogieX,lowered.userData.removedFromVehicleX);
 assert.equal(body.userData.removedBogieX,aperture.userData.vehicleBogieX);
 assert(body.position.y<.2,'Bogie-drop body must remain at normal running height');
 const floor=record.root.getObjectByName('alternative-lifting').getObjectByName('open-service-floor');
 const origin=new THREE.Vector3(body.userData.removedBogieX,5,0).applyMatrix4(record.root.matrixWorld);
 assert.equal(new THREE.Raycaster(origin,new THREE.Vector3(0,-1,0)).intersectObject(floor,true).length,0);
});
check('Bogie transfer lowers before traversing through an open channel with fixed body supports',()=>{
 const record=setScene('depot-maintenance','lifting',{phase:0});
 const carrier=namedVisible(record,'bogie-drop-transfer-carrier')[0];assert(carrier);
 const deck=namedVisible(record,'bogie-drop-lift-deck')[0];assert(deck);
 const deckSlab=namedVisible(record,'bogie-drop-deck-slab')[0];
 const carrierFrame=namedVisible(record,'bogie-carrier-base-frame')[0];
 const wheels=namedVisible(record,'bogie-carrier-wheel');assert.equal(wheels.length,4);
 const guideRails=namedVisible(record,'bogie-transfer-guide-rail');assert.equal(guideRails.length,2);
 const body=namedVisible(record,'supported-vehicle-one-bogie-removed')[0];
 const fixedPose=body.position.clone(),startY=deck.position.y,carrierY=carrier.position.y;
 assert.equal(carrier.position.z,0,'Initial bogie position is not aligned below the vehicle');
 const floor=record.root.getObjectByName('alternative-lifting').getObjectByName('open-service-floor');
 const guides=namedVisible(record,'transverse-bogie-transfer-guides')[0];assert(guides);
 for(const phase of [0,.5,1,2.5,4,5,6.5,8,9]){
  setScene('depot-maintenance','lifting',{phase});
  assert.equal(namedVisible(record,'lowered-vehicle-bogie').length,1,'Transfer duplicates the removed bogie');
  assert.equal(namedVisible(record,'attached-vehicle-bogie').length,1,'Transfer changes the remaining attached bogie');
  assert.deepEqual(body.position.toArray(),fixedPose.toArray(),'The supported body moves with the transfer table');
  assert.equal(carrier.position.y,carrierY,'Carrier leaves the transverse guides during deck lowering');
  if(carrier.position.z>0)assert(Math.abs(deck.position.y-.22)<.00001,'Carrier traverses before its deck has lowered');
  const deckBounds=new THREE.Box3().setFromObject(deckSlab);
  for(const wheel of wheels){
   const center=wheel.getWorldPosition(new THREE.Vector3());
   assert(guideRails.some(rail=>{
    const bounds=new THREE.Box3().setFromObject(rail);
    return Math.abs(center.y-wheel.userData.wheelRadius-bounds.max.y)<.00001&&center.x>=bounds.min.x&&center.x<=bounds.max.x&&center.z>=bounds.min.z&&center.z<=bounds.max.z;
   }),'A carrier wheel is not in contact with its guide');
   assert(!deckBounds.intersectsBox(new THREE.Box3().setFromObject(wheel)),'The lowered deck intersects a carrier wheel');
  }
  const frameBounds=new THREE.Box3().setFromObject(carrierFrame);
  for(const guide of [...guideRails,...namedVisible(record,'bogie-transfer-guide-support')]){
   assert(!frameBounds.intersectsBox(new THREE.Box3().setFromObject(guide)),'Carrier frame intersects a fixed guide or its support');
  }
  const outerStages=namedVisible(record,'bogie-deck-outer-stage'),middleStages=namedVisible(record,'bogie-deck-middle-stage');
  for(const inner of namedVisible(record,'bogie-deck-support')){
   const matching=stage=>stage.position.x===inner.position.x&&stage.position.z===inner.position.z;
   const outerBounds=new THREE.Box3().setFromObject(outerStages.find(matching));
   const middleBounds=new THREE.Box3().setFromObject(middleStages.find(matching));
   const innerBounds=new THREE.Box3().setFromObject(inner);
   assert(Math.abs(outerBounds.min.y-frameBounds.max.y)<.00001,'Lift support loses contact with the grounded carrier frame');
   assert(middleBounds.min.y<outerBounds.max.y&&innerBounds.min.y<middleBounds.max.y,'Telescoping support stages separate');
   assert(Math.abs(innerBounds.max.y-deckBounds.min.y)<.00001,'Lift support loses contact with the moving deck');
  }
 }
 setScene('depot-maintenance','lifting',{phase:1});assert(deck.position.y<startY);assert.equal(carrier.position.z,0);
 setScene('depot-maintenance','lifting',{phase:4});assert(Math.abs(carrier.position.z-4.2)<.00001);
 for(const z of [0,1.5,3,4.5,5.8]){
  const origin=new THREE.Vector3(body.userData.removedBogieX,5,z).applyMatrix4(record.root.matrixWorld);
  assert.equal(new THREE.Raycaster(origin,new THREE.Vector3(0,-1,0)).intersectObject(floor,true).length,0,'Floor blocks the transverse transfer section');
 }
 const carbody=body.children.find(n=>n.userData.component==='carbody');
 const bodyBounds=new THREE.Box3().setFromObject(carbody);
 for(const base of namedVisible(record,'carbody-support-base')){
  const bounds=new THREE.Box3().setFromObject(base);
  for(const x of [bounds.min.x,bounds.max.x])for(const z of [bounds.min.z,bounds.max.z]){
   assert(new THREE.Raycaster(new THREE.Vector3(x,10,z),new THREE.Vector3(0,-1,0)).intersectObject(floor,true).length,'A carbody support foot is over the open channel');
  }
 }
 for(const head of namedVisible(record,'carbody-support-head')){
  const bounds=new THREE.Box3().setFromObject(head);
  assert(Math.abs(bounds.max.y-bodyBounds.min.y)<.00001,'Support head misses the underside of the body');
  assert(bounds.max.x>bodyBounds.min.x&&bounds.min.x<bodyBounds.max.x&&bounds.max.z>bodyBounds.min.z&&bounds.min.z<bodyBounds.max.z,'Support head has no plan overlap with the body');
 }
});
check('Vehicle lifting raises only the body while both bogies remain at rail level',()=>{
 const record=recordFor('depot-maintenance','jacks');
 const raised=namedVisible(record,'raised-body-with-bogies-at-rail-level')[0];assert(raised);
 const body=raised.children.find(n=>n.userData.component==='carbody');assert(body.position.y>1.8);
 const bogies=namedVisible(record,'attached-vehicle-bogie');assert.equal(bogies.length,2);
 for(const b of bogies)assert.equal(b.position.y,.5);
 assert.equal(namedVisible(record,'lowered-vehicle-bogie').length,0);
});
check('Vehicle lifting columns clear the fixed roof-access platforms',()=>{
 const record=recordFor('depot-maintenance','jacks');
 const columns=namedVisible(record,'vehicle-lifting-column'),decks=namedVisible(record,'roof-access-deck');
 assert.equal(columns.length,4);assert.equal(decks.length,2);
 for(const column of columns)for(const deck of decks)assert(!new THREE.Box3().setFromObject(column).intersectsBox(new THREE.Box3().setFromObject(deck)),'Lifting column penetrates a roof-access deck');
});
check('Wheelshop alternatives add and remove the train instead of relabelling it',()=>{
 const installed=recordFor('depot-workshop','lathe');assert(namedVisible(installed,'fictional-depot-vehicle').length);
 const removed=recordFor('depot-workshop','wheelset');assert.equal(namedVisible(removed,'fictional-depot-vehicle').length,0);
 assert((removed.parts.get('depot-wheelset')||[]).some(visible));
 const bogie=recordFor('depot-workshop','bogie');assert.equal(namedVisible(bogie,'fictional-depot-vehicle').length,0);
 assert(!(bogie.parts.get('depot-wheelset')||[]).some(visible));
});
check('Wash alternatives move different bodies and expose different geometry',()=>{
 let record=setScene('depot-wash','wash',{phase:0});
 const train=namedVisible(record,'drive-through-moving-train')[0];assert(train);const start=train.position.x;
 setScene('depot-wash','wash',{phase:3});assert.notEqual(train.position.x,start);
 assert.equal(namedVisible(record,'travelling-wash-gantry').length,0);
 record=setScene('depot-wash','mobile',{phase:0});
 const gantry=namedVisible(record,'travelling-wash-gantry')[0],stationary=namedVisible(record,'gantry-stationary-train')[0];assert(gantry&&stationary);
 const gx=gantry.position.x,sx=stationary.position.x;
 setScene('depot-wash','mobile',{phase:3});assert.notEqual(gantry.position.x,gx);assert.equal(stationary.position.x,sx);
 assert.equal(namedVisible(record,'drive-through-moving-train').length,0);
});

check('Compact depot vehicles retain rail gauge and wheel contact height',()=>{
 for(const [view,variant,datum]of [['depot-yard','reception',.1],['depot-yard','handover',.1],['depot-condition','roll-by',.1],['depot-condition','stationary',.1],['depot-testing','stationary',.1],['depot-testing','movement',.1],['depot-maintenance','inspection',0],['depot-maintenance','jacks',0],['depot-wash','wash',.12],['depot-protection','work-zone',.12]]){
  const record=recordFor(view,variant);
  const wheels=namedVisible(record,'depot-mounted-wheel');assert(wheels.length,view);
  for(const wheel of wheels){
    let train=wheel.parent;while(train&&!train.name.includes('vehicle')&&!train.name.includes('train')&&!train.name.includes('body'))train=train.parent;
    assert(train,'Mounted wheel has no train parent');
    const centre=wheel.getWorldPosition(new THREE.Vector3()),scale=wheel.getWorldScale(new THREE.Vector3()),origin=record.root.getWorldPosition(new THREE.Vector3());
    assert(Math.abs(centre.y-.3*scale.x-(origin.y+datum+.295))<.00001,`${view} wheel floats or sinks into rail`);
    const trainOrigin=train.getWorldPosition(new THREE.Vector3());
    assert(Math.abs(Math.abs(centre.z-trainOrigin.z)-.58)<.00001,`${view} compaction changes rail gauge`);
  }
 }
});
check('Underfloor lathe aligns with one installed axle and leaves the adjacent axle on rail',()=>{
 const record=recordFor('depot-workshop','lathe');
 const machine=namedVisible(record,'lathe-at-installed-axle')[0];assert(machine);
 const axleX=machine.getWorldPosition(new THREE.Vector3()).x;
 const wheels=namedVisible(record,'depot-mounted-wheel').filter(w=>Math.abs(w.getWorldPosition(new THREE.Vector3()).x-axleX)<.00001);
 assert.equal(wheels.length,2,'Lathe is not centred on an installed axle');
 const rails=(record.parts.get('running-rail')||[]).filter(visible);
 const origin=record.root.getWorldPosition(new THREE.Vector3());
 const ray=x=>new THREE.Raycaster(new THREE.Vector3(x,origin.y+5,.58),new THREE.Vector3(0,-1,0)).intersectObjects(rails,true);
 assert.equal(ray(axleX).length,0,'Rail passes through lathe machining position');
 assert(ray((-3.1+.63)*.95).length>0,'Adjacent axle loses rail support');
 for(const roller of namedVisible(record,'lathe-drive-roller')){
  const r=roller.getWorldPosition(new THREE.Vector3());
  const wheel=wheels.find(w=>Math.abs(w.getWorldPosition(new THREE.Vector3()).z-r.z)<.01);assert(wheel);
  const distance=r.distanceTo(wheel.getWorldPosition(new THREE.Vector3()));
  assert(Math.abs(distance-(.21+.3*.95))<.01,'Drive roller misses the wheel tread');
 }
});
check('Roll-by measurement uses fixed sensors and activates only during vehicle overlap',()=>{
 const record=setScene('depot-condition','roll-by',{phase:0});
 const train=namedVisible(record,'inspection-passage-vehicle')[0];assert(train);
 const scan=record.root.getObjectByName('roll-by-measurement-plane');assert(scan);
 const sensors=namedVisible(record,'roll-by-wheel-sensor');assert.equal(sensors.length,2);
 const sensorPositions=sensors.map(n=>n.getWorldPosition(new THREE.Vector3()).toArray());
 const startX=train.position.x;assert(!scan.visible,'Measurement plane is active before the vehicle arrives');
 setScene('depot-condition','roll-by',{phase:2.5});assert(scan.visible);assert.equal(train.position.x,0);
 setScene('depot-condition','roll-by',{phase:5});assert(!scan.visible);assert(train.position.x>startX);
 assert.deepEqual(sensors.map(n=>n.getWorldPosition(new THREE.Vector3()).toArray()),sensorPositions,'Trackside sensors move with the train');
 const endX=train.position.x;
 setScene('depot-condition','roll-by',{phase:5,playing:true});assert.equal(train.position.x,startX,'Playback does not restart the five-unit passage');
 assert.notEqual(endX,startX,'Manual endpoint wraps instead of showing the completed passage');
 const stationary=setScene('depot-condition','stationary',{phase:0});
 assert.equal(namedVisible(stationary,'inspection-passage-vehicle').length,0);
 const stopped=namedVisible(stationary,'stationary-diagnostic-vehicle')[0];const pose=stopped.position.clone();
 assert(namedVisible(stationary,'manual-wheel-profile-gauge').length);
 setScene('depot-condition','stationary',{phase:5});assert.deepEqual(stopped.position.toArray(),pose.toArray());
});
check('Yard work handover changes the destination and retains a separate stationary work boundary',()=>{
 const record=setScene('depot-yard','reception',{phase:0});
 const blades=namedVisible(record,'yard-switch-blade');assert.equal(blades.length,6);
 assert(blades.every(n=>n.rotation.y===0));
 setScene('depot-yard','handover',{phase:0});
 const selected=blades.filter(n=>n.rotation.y!==0);assert.equal(selected.length,2);assert(selected.every(n=>n.userData.roadIndex===1));
 const train=namedVisible(record,'handover-stationary-vehicle')[0];assert(train);
 const pose=train.position.clone();assert(namedVisible(record,'separate-work-road-boundary').length);
 assert((record.parts.get('depot-personnel-protection')||[]).some(visible));
 setScene('depot-yard','handover',{phase:5});assert.deepEqual(train.position.toArray(),pose.toArray());
 setScene('depot-yard','dispatch');assert.equal(namedVisible(record,'handover-stationary-vehicle').length,0);
 assert(blades.filter(n=>n.rotation.y!==0).every(n=>n.userData.roadIndex===0),'Departure uses the handover destination');
});
check('Brake test pads contact both disc faces, stay connected to their actuators, and release',()=>{
 const record=setScene('depot-components','brakes',{phase:0});
 const disc=namedVisible(record,'bench-brake-disc')[0],pads=namedVisible(record,'bench-brake-pad'),rods=namedVisible(record,'brake-test-pushrod');
 assert(disc);assert.equal(pads.length,2);assert.equal(rods.length,2);
 const discPosition=disc.getWorldPosition(new THREE.Vector3()).toArray();
 const gap=pad=>{
  const p=new THREE.Box3().setFromObject(pad),d=new THREE.Box3().setFromObject(disc);
  return pad.userData.side>0?p.min.z-d.max.z:d.min.z-p.max.z;
 };
 assert(pads.every(p=>gap(p)>.19));
 for(const phase of [0,.625,1.25,1.875,2.5,3.125,3.75,4.375,5]){
  setScene('depot-components','brakes',{phase});
  assert(pads.every(p=>gap(p)>-.00001),'Pad penetrates the stationary disc');
  for(const pad of pads){
   const side=pad.userData.side,rod=rods.find(n=>Math.sign(n.position.z)===side);
   const p=new THREE.Box3().setFromObject(pad),r=new THREE.Box3().setFromObject(rod);
   assert(Math.abs(side>0?r.min.z-p.max.z:r.max.z-p.min.z)<.00001,'Pushrod loses contact with pad');
   assert(Math.abs(side>0?r.max.z-.615:r.min.z+.615)<.00001,'Pushrod leaves its fixed actuator face');
  }
  assert.deepEqual(disc.getWorldPosition(new THREE.Vector3()).toArray(),discPosition);
 }
 setScene('depot-components','brakes',{phase:2.5});assert(pads.every(p=>Math.abs(gap(p))<.00001));
 setScene('depot-components','brakes',{phase:5});assert(pads.every(p=>gap(p)>.19));
});
check('Door leaves clear the doorway and closed feedback follows physical position',()=>{
 const record=setScene('depot-components','doors',{phase:0});
 const leaves=namedVisible(record,'bench-door-leaf');assert.equal(leaves.length,2);
 const rig=(record.parts.get('depot-door-service')||[]).find(n=>Object.hasOwn(n.userData,'closedPosition'));assert(rig);
 assert.equal(rig.userData.closedPosition,true);
 const initial=leaves.map(n=>n.position.x);
 setScene('depot-components','doors',{phase:2.5});assert.equal(rig.userData.closedPosition,false);
 for(const leaf of leaves){
  const b=new THREE.Box3().setFromObject(leaf);
  assert(leaf.userData.side>0?b.min.x>1.2:b.max.x< -1.2,'An open leaf still obstructs the doorway');
  const carriage=leaf.getObjectByName('door-operator-carriage');assert(carriage);
  assert(Math.abs(carriage.getWorldPosition(new THREE.Vector3()).x-leaf.getWorldPosition(new THREE.Vector3()).x)<.00001);
 }
 setScene('depot-components','doors',{phase:5});assert.equal(rig.userData.closedPosition,true);assert.deepEqual(leaves.map(n=>n.position.x),initial);
 setScene('depot-components','doors',{phase:7.5,playing:true});assert.equal(rig.userData.closedPosition,false,'Playback cycle and phase captions disagree');
});
check('HVAC and traction alternatives expose distinct serviceable assemblies and meaningful traces',()=>{
 const record=setScene('depot-components','hvac',{phase:0});
 const filter=namedVisible(record,'hvac-removable-filter')[0],fan=namedVisible(record,'hvac-supply-fan')[0];assert(filter&&fan);
 const filterPose=filter.position.clone(),fanAngle=fan.rotation.x;
 const air=namedVisible(record,'hvac-supply-air-sample')[0];const start=air.position.x;
 setScene('depot-components','hvac',{phase:1.25});assert.notEqual(fan.rotation.x,fanAngle);assert.deepEqual(filter.position.toArray(),filterPose.toArray(),'Filter is removed while the fan is operating');
 setScene('depot-components','hvac',{phase:5});assert(air.position.x>start);
 assert(record.exploded.some(e=>e.node===filter),'Filter is not available for selected component separation');
 setScene('depot-components','traction',{phase:0});
 assert.equal(namedVisible(record,'hvac-supply-fan').length,0);
 const modules=namedVisible(record,'converter-power-module');assert.equal(modules.length,3);
 assert(namedVisible(record,'converter-control-board').length);
 assert(modules.every(node=>record.exploded.some(e=>e.node===node)),'Converter power modules have no separation transform');
 const trace=namedVisible(record,'traction-diagnostic-response-sample')[0],traceStart=trace.position.clone();
 setScene('depot-components','traction',{phase:5});assert(trace.position.distanceTo(traceStart)>5);
});
check('Wheelset inspection keeps the fixed axial probe aligned and the turning wheelset on rollers',()=>{
 const record=setScene('depot-workshop','ndt',{phase:0});
 const axle=namedVisible(record,'workshop-wheelset-axle')[0],tip=namedVisible(record,'wheelset-probe-tip')[0];assert(axle&&tip);
 const probePosition=tip.getWorldPosition(new THREE.Vector3()).toArray();
 const wheels=namedVisible(record,'workshop-wheel-disc'),rollers=namedVisible(record,'wheelset-support-roller');assert.equal(wheels.length,2);assert.equal(rollers.length,4);
 const assembly=namedVisible(record,'inspection-wheelset')[0],initialAngle=assembly.rotation.z;
 for(const phase of [0,1.25,2.5,3.75,5]){
  setScene('depot-workshop','ndt',{phase});
  const a=axle.getWorldPosition(new THREE.Vector3()),p=tip.getWorldPosition(new THREE.Vector3());
  assert(Math.abs(a.x-p.x)<.00001&&Math.abs(a.y-p.y)<.00001,'Probe misses the axle axis');
  assert.deepEqual(p.toArray(),probePosition,'Probe rotates with the wheelset');
  const axleBounds=new THREE.Box3().setFromObject(axle),tipBounds=new THREE.Box3().setFromObject(tip);
  assert(Math.abs(tipBounds.min.z-axleBounds.max.z)<.00001,'Axial probe loses its illustrated contact');
  for(const roller of rollers){
   const r=roller.getWorldPosition(new THREE.Vector3());const w=wheels.find(n=>Math.abs(n.getWorldPosition(new THREE.Vector3()).z-r.z)<.00001);assert(w);
   assert(Math.abs(r.distanceTo(w.getWorldPosition(new THREE.Vector3()))-.96)<.00001,'Wheelset floats above or intersects a support roller');
  }
 }
 setScene('depot-workshop','ndt',{phase:1.25});assert.notEqual(assembly.rotation.z,initialAngle);
 assert(rollers.every(n=>n.rotation.y<0),'Rollers do not turn opposite the wheelset');
});
check('Functional-check alternatives distinguish a fixed vehicle from movement on a separate bounded road',()=>{
 const record=setScene('depot-testing','stationary',{phase:0});
 const stopped=namedVisible(record,'functional-test-stationary-vehicle')[0];const pose=stopped.position.clone();
 const sample=namedVisible(record,'functional-test-measurement-sample')[0],start=sample.position.clone();
 setScene('depot-testing','stationary',{phase:5});assert.deepEqual(stopped.position.toArray(),pose.toArray());assert(sample.position.distanceTo(start)>5);
 setScene('depot-testing','movement',{phase:0});assert.equal(namedVisible(record,'functional-test-stationary-vehicle').length,0);
 const moving=namedVisible(record,'separate-test-road-vehicle')[0],origin=moving.position.x;assert.equal(namedVisible(record,'test-road-end-stop').length,2);
 for(const phase of [0,1.25,2.5,3.75,5]){
  setScene('depot-testing','movement',{phase});const b=new THREE.Box3().setFromObject(moving);
  assert(b.min.x> -15.9&&b.max.x<15.9,'Illustrative movement crosses a test-road end stop');
  assert((record.parts.get('depot-maintenance-release')||[]).some(visible),'Test arrangement hides its separate record position');
 }
 setScene('depot-testing','movement',{phase:2.5});assert(moving.position.x>origin);
 setScene('depot-testing','movement',{phase:5});assert(Math.abs(moving.position.x-origin)<.00001);
});
check('New motion descriptions and maintenance article have valid public-source contracts',()=>{
 const sources=new Set(catalog.SOURCES.map(s=>s.id));
 for(const id of ['depot-condition','depot-components','depot-testing'])for(const variant of model.VIEWS[id].variants){
  const steps=variant.animation?.steps;assert(steps?.length>=3,`${id}/${variant.id} has no explanatory phases`);
  assert.equal(steps[0].at,0);assert.equal(steps.at(-1).at,1);
  steps.forEach((s,i)=>{assert(s.label&&s.description);if(i)assert(s.at>steps[i-1].at);});
  variant.sources.forEach(source=>assert(sources.has(source),`${id} missing source ${source}`));
 }
 const guide=depotData.DEPOT_READING_GUIDES[0];assert(guide.title&&guide.sections.length>=5);
 const words=guide.sections.map(s=>s.text).join(' ').split(/\s+/).length;assert(words>=600&&words<=900);
 guide.sources.forEach(source=>assert(sources.has(source),`Maintenance article missing source ${source}`));
});
console.log(`${passed} checks passed, ${failures.length} failed.`);
if(failures.length)process.exitCode=1;
