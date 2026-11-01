import assert from 'node:assert/strict';
import {studyHarness,THREE,visible} from './study-harness.mjs';
import {buildPlatformView,PLATFORM_GEOMETRY as D} from '../dist/platform-models.js';
import {buildStationView,STATION_GEOMETRY as S} from '../dist/station-models.js';
import {normalizePlatformState,platformForComponent,PLATFORM_EDGES,PLATFORM_SENSORS} from '../dist/platform-config.js';
import {platformAnimationFor,STATION_PLATFORM_VIEW_DATA} from '../dist/station-platform-data.js';
import {explorationCapabilities,applySeparation,restoreSeparation} from '../dist/exploration.js';

// Construct and animate the shipping geometry. These checks inspect actual
// meshes, transforms and visibility, not a digest or a parallel mock model.
const h=await studyHarness();
buildPlatformView('platform-interface',h.api);buildStationView('station',h.api);buildStationView('ventilation-unit',h.api);
const set=(view,variant,phase=0,options={})=>{
  const record=h.models.get(view);
  restoreSeparation(record);
  for(const r of h.models.values())r.root.visible=r===record;
  const state={view,variant,phase,platformEdge:'open',platformSensor:'lidar',cutaway:true,scenario:'nominal',signals:true,exploded:0,...options};
  for(const entry of record.exploded)entry.node.position.copy(entry.base);
  for(const shell of record.shells)shell.visible=!state.cutaway;
  record.animators.forEach(fn=>fn(state));record.root.updateWorldMatrix(true,true);
  return record;
};
const names=(r,name)=>{const out=[];r.root.traverse(n=>{if(n.name===name&&visible(n))out.push(n);});return out;};
const node=(r,name)=>{const n=names(r,name)[0];assert(n,'Missing visible '+name);return n;};
const ids=r=>new Set([...r.parts].filter(([,nodes])=>nodes.some(visible)).map(([id])=>id));
const bounds=n=>new THREE.Box3().setFromObject(n);
const world=n=>n.getWorldPosition(new THREE.Vector3());
const light=(r,name)=>node(r,name).children[1].visible;
const close=(a,b,message,tolerance=1e-6)=>assert(Math.abs(a-b)<tolerance,message+': '+a+' vs '+b);
let passed=0;
function check(label,fn){fn();passed++;console.log('PASS '+label);}

check('Legacy migration preserves explicit infrastructure and primary component intent',()=>{
  assert.equal(normalizePlatformState({variant:'platform-doors'}).platformEdge,'full-height');
  assert.equal(normalizePlatformState({variant:'interspace'}).platformEdge,'full-height');
  for(const {id:platformEdge}of PLATFORM_EDGES){
    assert.equal(normalizePlatformState({variant:'platform-end',platformEdge}).platformEdge,platformEdge);
    assert.equal(normalizePlatformState({variant:'platform-doors',platformEdge}).platformEdge,platformEdge);
  }
  const incompatible=normalizePlatformState({variant:'interspace',platformEdge:'open'});
  assert.equal(incompatible.platformEdge,'open');assert.equal(incompatible.variant,'open-platform');assert(incompatible.notice);
  assert.equal(platformForComponent('platform-radar',{platformEdge:'half-height'}).platformEdge,'half-height');
  assert.equal(platformForComponent('platform-radar',{}).platformSensor,'radar');
  assert.equal(platformForComponent('platform-gap-detector',{platformEdge:'open'}).platformEdge,'full-height');
  assert.notDeepEqual(platformAnimationFor({variant:'platform-doors',platformEdge:'open'}),platformAnimationFor({variant:'platform-doors',platformEdge:'full-height'}));
});

check('Physical edge is independent of lesson; sensors replace rather than accumulate',()=>{
  for(const {id:platformEdge}of PLATFORM_EDGES)for(const variant of ['open-platform','platform-doors','platform-end'])for(const {id:platformSensor}of PLATFORM_SENSORS){
    const r=set('platform-interface',variant,2,{platformEdge,platformSensor}),parts=ids(r);
    for(const id of ['platform-screen-door','platform-door-drive','platform-door-proof'])assert.equal(parts.has(id),platformEdge!=='open',variant+' '+platformEdge+' '+id);
    assert.equal(parts.has('platform-lidar'),variant==='open-platform'&&platformSensor==='lidar');
    assert.equal(parts.has('platform-radar'),variant==='open-platform'&&platformSensor==='radar');
    assert.equal(parts.has('platform-end-gate'),variant==='platform-end');
  }
  for(const variant of ['all','passenger','equipment'])for(const {id:platformEdge}of PLATFORM_EDGES){
    const r=set('station',variant,2,{platformEdge});
    assert.equal(ids(r).has('platform-screen-door'),platformEdge!=='open','Station edge was coupled to focus');
  }
});

check('Context vehicle keeps doors and removes unrelated railway subsystems',()=>{
  const forbidden=['traction-inverter','lim-primary','reaction-rail','rotary-traction-motor','pantograph','overhead-contact-wire','positive-rail','negative-rail','seltrac-loop','loop-interface','onboard-braking-resistor'];
  for(const cutaway of [false,true])for(const view of ['station','platform-interface']){
    const r=set(view,view==='station'?'all':'platform-doors',0,{cutaway}),parts=ids(r);
    assert(parts.has('doors')&&parts.has('carbody')&&parts.has('bogie'));
    forbidden.forEach(id=>assert(!parts.has(id),'Unrelated equipment in contextual vehicle: '+id));
    assert.equal(names(r,'closed-context-train')[0].children.filter(n=>n.userData.component==='doors').filter(visible).length,8);
  }
});

check('Platform, train floor and facade sills share the boarding datum and door centres',()=>{
  for(const platformEdge of ['half-height','full-height']){
    const r=set('platform-interface','platform-doors',0,{platformEdge});
    close(bounds(node(r,'context-train-floor')).max.y,D.floor,'Train floor');
    for(const surface of names(r,'platform-surface-tile'))close(bounds(surface).max.y,D.floor,'Platform top');
    for(const cx of D.doorCenters){
      close(bounds(node(r,'train-threshold-1-'+cx)).max.y,D.floor,'Train threshold');
      const sill=node(r,'platform-door-sill-'+platformEdge+'-'+cx);
      close(bounds(sill).max.y,D.floor,'Facade sill');
      close(world(sill).x,cx,'Facade opening centre');
      const pair=names(r,'platform-sliding-leaf').filter(n=>Math.abs(n.position.x-cx)<1);
      assert.equal(pair.length,2);close((pair[0].position.x+pair[1].position.x)/2,cx,'Pair centre');
    }
  }
});

check('Only platform-side doors move and the transmissions follow leaf travel',()=>{
  for(const platformEdge of ['open','half-height','full-height']){
    let r=set('platform-interface','platform-doors',0,{platformEdge});
    const trainDoors=[...r.parts.get('doors')],start=new Map(trainDoors.map(n=>[n,world(n).clone()]));
    r=set('platform-interface','platform-doors',2.3,{platformEdge});
    for(const n of trainDoors){
      const motion=Math.abs(world(n).x-start.get(n).x);
      close(motion,n.position.z>0?D.travel:0,'Platform-side door motion');
    }
    if(platformEdge!=='open'){
      const pulley=node(r,platformEdge==='full-height'?'door-drive-pulley':'half-height-door-pinion');
      close(Math.abs(pulley.rotation.z)*(platformEdge==='full-height'?.105:.085),D.travel,'Transmission surface travel');
      for(const leaf of names(r,'platform-sliding-leaf')){
        const nearest=Math.min(...D.doorCenters.map(x=>Math.abs(leaf.position.x-x)));
        close(nearest,.45+D.travel,'Facade opening movement');
      }
    }
  }
});

check('Half-height door opening is clear after the leaves retract',()=>{
  const r=set('platform-interface','platform-doors',2.3,{platformEdge:'half-height'});
  const facade=node(r,'platform-facade-half-height');
  for(const cx of D.doorCenters){
    const clear=new THREE.Box3(new THREE.Vector3(cx-.78,D.floor+.2,D.facade-.30),new THREE.Vector3(cx+.78,D.floor+1.95,D.facade+.31));
    facade.traverse(n=>{if(n.isMesh&&visible(n))assert(!bounds(n).intersectsBox(clear),'Half-height fixed or moving hardware blocks the open boarding aperture: '+n.parent.name);});
  }
});

check('Leaf closure, bolt engagement and reported lock have distinct physical states',()=>{
  for(const platformEdge of ['half-height','full-height']){
    let r=set('platform-interface','platform-doors',0,{platformEdge});
    const engaged=node(r,'door-lock-bolt').position.y;
    assert(light(r,'door-closed-indication')&&light(r,'door-locked-indication'));
    r=set('platform-interface','platform-doors',.95,{platformEdge});
    assert(node(r,'door-lock-bolt').position.y>engaged+.17);
    assert(light(r,'door-closed-indication')&&!light(r,'door-locked-indication'));
    r=set('platform-interface','platform-doors',2.3,{platformEdge});
    assert(!light(r,'door-closed-indication')&&!light(r,'door-locked-indication'));
    r=set('platform-interface','platform-doors',3.9,{platformEdge});
    assert(light(r,'door-closed-indication')&&!light(r,'door-locked-indication'));
    assert(node(r,'door-lock-bolt').position.y>engaged+.20,'Closed leaves falsely engaged the lock');
    r=set('platform-interface','platform-doors',4.70,{platformEdge});
    close(node(r,'door-lock-bolt').position.y,engaged,'Physical lock engagement');
    assert(!light(r,'door-locked-indication'),'Reported lock updated before its authored feedback step');
    r=set('platform-interface','platform-doors',4.9,{platformEdge});
    assert(light(r,'door-locked-indication'));
  }
});

check('Sensor evidence, local report and associated camera change in order without deleting the object',()=>{
  for(const platformSensor of ['lidar','radar']){
    let r=set('platform-interface','open-platform',1.3,{platformSensor});
    assert(!light(r,'sensor-evidence-indicator')&&!light(r,'detection-report-indicator'));
    const occupied=world(node(r,'trainway-object')).clone();
    if(platformSensor==='radar'){
      const object=bounds(node(r,'trainway-object'));
      assert(object.min.x<-11.4&&object.max.x>-11.4&&object.min.y<.60&&object.max.y>.60,'Radar plane does not intersect the represented object');
    }
    r=set('platform-interface','open-platform',2.1,{platformSensor});
    assert(light(r,'sensor-evidence-indicator')&&!light(r,'detection-report-indicator'));
    r=set('platform-interface','open-platform',3.4,{platformSensor});
    assert(light(r,'detection-report-indicator')&&!light(r,'associated-video-event'));
    const path=node(r,platformSensor+'-to-local-processor');
    const source=new THREE.Vector3().fromBufferAttribute(path.geometry.attributes.position,0);
    close(source.y,platformSensor==='radar'?.60:2.39,'Report trace begins at selected sensor');
    r=set('platform-interface','open-platform',4.5,{platformSensor});
    assert(light(r,'associated-video-event'));assert(world(node(r,'trainway-object')).distanceTo(occupied)<1e-8);
    r=set('platform-interface','open-platform',4.5,{platformSensor,scenario:'sensor-unavailable'});
    assert(light(r,'sensing-unavailable-indicator')&&!light(r,'sensor-evidence-indicator')&&!light(r,'detection-report-indicator'));
    assert(visible(node(r,'trainway-object')));
  }
  const r=set('platform-interface','open-platform');
  assert(bounds(node(r,'local-platform-service-alcove')).min.z>D.platformRear,'Processor alcove occupies passenger circulation');
  assert(!ids(r).has('occ-workstation'),'Remote workstation was placed on the platform');
});

check('Interspace object fits the real train/facade separation and remains after reporting',()=>{
  for(const platformEdge of ['half-height','full-height']){
    let r=set('platform-interface','interspace',0,{platformEdge});
    const object=bounds(node(r,'interspace-object')),train=bounds(node(r,'closed-context-train'));
    const facade=bounds([...r.parts.get('platform-screen-door')].find(visible));
    assert(object.min.z>train.max.z&&object.max.z<facade.min.z,'Interspace proxy intersects a physical boundary');
    const initial=world(node(r,'interspace-object')).clone();
    r=set('platform-interface','interspace',4.5,{platformEdge});
    assert(light(r,'interspace-report'));assert(world(node(r,'interspace-object')).distanceTo(initial)<1e-8);
  }
});

check('End gate rotates about its hinge and contact separation precedes the report',()=>{
  let r=set('platform-interface','platform-end',0,{platformEdge:'open'});
  const hinge=world(node(r,'end-gate-hinge')).clone(),target=world(node(r,'end-gate-contact-target')).clone();
  const radius=target.distanceTo(hinge),initialContact=target.distanceTo(world(node(r,'end-gate-position-contact')));
  assert(light(r,'end-gate-closed-indication')&&!light(r,'end-access-report'));
  r=set('platform-interface','platform-end',2.4,{platformEdge:'open'});
  assert(world(node(r,'end-gate-hinge')).distanceTo(hinge)<1e-8);
  close(world(node(r,'end-gate-contact-target')).distanceTo(hinge),radius,'True hinge rotation');
  assert(world(node(r,'end-gate-contact-target')).distanceTo(world(node(r,'end-gate-position-contact')))>initialContact+.5);
  assert(!light(r,'end-gate-closed-indication')&&!light(r,'end-access-report'));
  r=set('platform-interface','platform-end',4.1,{platformEdge:'open'});
  assert(light(r,'end-access-report'));assert(!ids(r).has('platform-screen-door'));
});

check('Station landings, stairs and cabin align; the moving cabin clears the concourse',()=>{
  let r=set('station','passenger',0);
  close(bounds(node(r,'station-platform-surface')).max.y,S.platform,'Island platform');
  close(bounds(node(r,'context-train-floor')).max.y,S.platform,'Station train floor');
  close(bounds(node(r,'lift-cabin-floor')).max.y,S.platform,'Initial cabin landing');
  close(bounds(node(r,'stair-tread-15')).max.y,S.concourse,'Top stair tread');
  close(bounds(node(r,'lift-landing-sill-0')).max.y,S.platform,'Lower sill');
  close(bounds(node(r,'lift-landing-sill-1')).max.y,S.concourse,'Upper sill');
  const slabs=node(r,'concourse-slabs-with-lift-opening').children.map(bounds);
  for(const phase of [1.4,2.0,2.6,3.1,3.5]){
    r=set('station','passenger',phase);
    const car=node(r,'lift-carriage'),carBox=bounds(car);
    slabs.forEach(slab=>assert(!carBox.intersectsBox(slab),'Cabin intersects an uncut concourse slab'));
    for(const n of names(r,'lift-car-door'))close(Math.abs(n.position.x),.25,'Car door open during travel');
    for(const name of ['lift-landing-door-0','lift-landing-door-1'])for(const n of names(r,name))close(Math.abs(n.position.x),.25,'Landing door open during travel');
  }
  r=set('station','passenger',5);
  close(bounds(node(r,'lift-cabin-floor')).max.y,S.concourse,'Final cabin landing');
  for(const n of names(r,'lift-landing-door-0'))close(Math.abs(n.position.x),.25,'Lower landing reopened without cabin');
  for(const n of names(r,'lift-landing-door-1'))assert(Math.abs(n.position.x)>.7);
  assert(STATION_PLATFORM_VIEW_DATA.station.variants.find(v=>v.id==='passenger').animation);
});

check('Equipment room is supported and its access opening is not blocked by wall geometry',()=>{
  const r=set('station','equipment',0,{cutaway:false}),room=node(r,'supported-equipment-room');
  const floor=bounds(node(r,'equipment-room-floor')),support=bounds(node(r,'east-concourse'));
  close(floor.max.y,support.max.y,'Equipment room floor datum');
  assert(floor.min.x>=support.min.x&&floor.max.x<=support.max.x&&floor.min.z>=support.min.z&&floor.max.z<=support.max.z,'Room overhangs the supporting concourse');
  const opening=new THREE.Box3(new THREE.Vector3(7.60,S.concourse+.1,-.02),new THREE.Vector3(8.70,S.concourse+2.2,.02));
  room.getObjectByName('station-equipment-room-shell').traverse(n=>{if(n.isMesh)assert(!bounds(n).intersectsBox(opening),'Equipment access door sits in a solid wall');});
});

check('New moving assemblies contain finite geometry throughout their authored phases',()=>{
  for(const[view,variants]of [['station',['all','passenger','equipment']],['platform-interface',['open-platform','platform-doors','interspace','platform-end']]])
    for(const variant of variants)for(const phase of [0,.95,2.3,3.9,4.7,5]){
      const r=set(view,variant,phase,{platformEdge:variant==='interspace'?'full-height':'half-height'});
      r.root.traverse(n=>{if(visible(n))assert([...n.position.toArray(),...n.scale.toArray(),...n.quaternion.toArray()].every(Number.isFinite));});
    }
});
check('Inspection separates actual internal parts without translating the whole mechanism',()=>{
  for(const[view,variant,component,partName,options]of [
    ['platform-interface','platform-doors','platform-door-drive','door-belt-and-pulleys',{platformEdge:'full-height'}],
    ['platform-interface','platform-doors','platform-door-drive','half-height-side-post-drive',{platformEdge:'half-height'}],
    ['platform-interface','platform-doors','platform-door-proof','door-lock-bolt',{platformEdge:'full-height'}],
    ['platform-interface','open-platform','platform-response','intrusion-processor-module-0',{}],
    ['platform-interface','platform-end','platform-end-gate','end-gate-latch',{}],
    ['station','passenger','station-lift-drive','lift-traction-sheave',{}],
  ]){
    const r=set(view,variant,2.4,options),assembly=[...r.parts.get(component)].find(visible);
    const rootBefore=world(assembly).clone(),partBefore=world(node(r,partName)).clone(),trainBefore=world(node(r,'closed-context-train')).clone();
    const capabilities=explorationCapabilities(r,component);
    assert(capabilities.canExplodeSelected&&capabilities.internalSeparationCount>0&&capabilities.pieceNames.length>0,component+' lacks inspectable internal pieces');
    applySeparation(r,{amount:.8,scope:'selected',componentId:component});r.root.updateWorldMatrix(true,true);
    assert(world(assembly).distanceTo(rootBefore)<1e-8,'Inspection translated the whole assembly');
    assert(world(node(r,partName)).distanceTo(partBefore)>.2,'Registered part did not separate');
    assert(world(node(r,'closed-context-train')).distanceTo(trainBefore)<1e-8,'Selected mechanism separation moved train context');
    restoreSeparation(r);r.root.updateWorldMatrix(true,true);
    assert(world(node(r,partName)).distanceTo(partBefore)<1e-8,'Inspection failed to restore the current animated pose');
  }
});
check('Damper common linkage stays attached through full travel and proof follows the end position',()=>{
  for(const phase of [0,1.25,2.25,4.5]){
    const r=set('ventilation-unit','damper',phase),blades=names(r,'damper-blade'),link=node(r,'damper-common-link'),crank=node(r,'damper-output-crank');
    assert.equal(blades.length,6);
    for(const blade of blades){
      close(blade.rotation.x,crank.rotation.x,'Parallel blade and output crank angle');
      const tip=blade.localToWorld(new THREE.Vector3(1.28,.20,0));
      close(tip.z,world(link).z,'Blade crank detached from common link');
      assert(tip.y>=bounds(link).min.y&&tip.y<=bounds(link).max.y,'Crank outside common-link length');
    }
    assert(!r.root.getObjectByName('damper-open-indication').visible,'Open indication preceded end-travel feedback');
    assert.equal(r.root.getObjectByName('damper-open-path').visible,phase>=4.5,'Closed damper depicts an open airflow path');
  }
  const r=set('ventilation-unit','damper',5);
  close(node(r,'damper-blade').rotation.x,Math.PI/2,'Full open blade position');
  assert(r.root.getObjectByName('damper-open-indication').visible);
});
check('Focused fan and AHU rotations loop without an orientation jump',()=>{
  for(const[variant,name]of [['fan','axial-impeller'],['air-handler','supply-air-impeller']]){
    let r=set('ventilation-unit',variant,0);const start=node(r,name).quaternion.clone();
    r=set('ventilation-unit',variant,.6);assert(start.angleTo(node(r,name).quaternion)>.5,'Rotor does not physically turn');
    r=set('ventilation-unit',variant,5);assert(start.angleTo(node(r,name).quaternion)<1e-7,'Loop resets to a different rotor orientation');
  }
});
console.log('PASS station/platform geometry: '+passed+' physical, configuration and mechanism contracts');
