import assert from 'node:assert/strict';
import {viewerHarness,THREE} from './viewer-test-harness.mjs';
import {VIEWS} from '../dist/model.js';
import {animationFor,canAnimate} from '../dist/comparisons.js';
import {representationFor,representationInventory} from '../dist/representation-guidance.js';
import {nodeVisible,within} from '../dist/exploration.js';

let passed=0;const check=(label,fn)=>{fn();passed++;console.log('PASS '+label);};
const h=await viewerHarness(),v=h.viewer;
const root=()=>h.root(),one=(name,from=root())=>{const n=from.getObjectByName(name);assert(n,'Missing '+name);return n;};
const all=(name,from=root())=>{const nodes=[];from.traverse(n=>{if(n.name===name)nodes.push(n);});return nodes;};
const close=(a,b,label='values differ')=>assert(Math.abs(a-b)<1e-7,`${label}: ${a} / ${b}`);
const world=n=>n.getWorldPosition(new THREE.Vector3());
const state=(view,component,phase=0,variant)=>{v.restoreExploration();v.setView(view);if(variant)v.setVariant(variant);v.setSelected(component);v.setPhase(phase);h.draw();};

check('Every route and comparison has an explicit learning representation',()=>{
  const inventory=representationInventory(VIEWS);
  assert.equal(inventory.length,Object.values(VIEWS).reduce((n,v)=>n+(v.variants?.length||1),0));
  for(const entry of inventory){assert(entry.classified,entry.view);assert(entry.reason.length>30);assert(entry.label);}
  for(const id of ['infrastructure-care','occ-incident','depot-protection'])assert.equal(representationFor(id).kind,'process');
  assert.equal(representationFor('change-evidence').kind,'evidence');
  assert.equal(representationFor('accessible-journey').kind,'journey');assert.equal(representationFor('dependencies').kind,'dependencies');
  assert.equal(representationFor('station-networks').equipmentContext,false);
  assert.equal(representationFor('depot-yard','reception').kind,'equipment');assert.equal(representationFor('depot-yard','handover').kind,'process');
});
check('Motion is discoverable by component without giving the whole vehicle fictitious motion',()=>{
  assert.equal(canAnimate(VIEWS.vehicle,'default','carbody'),false);
  for(const component of ['doors','door-control','hvac','compressor','brakes','bogie','tachometer','rotary-traction-motor','traction-gearbox']){
    assert.equal(canAnimate(VIEWS.vehicle,'default',component),true);
    const guide=animationFor(VIEWS.vehicle,'default',component);assert(guide.steps.length>=5);assert.equal(guide.steps[0].at,0);assert.equal(guide.steps.at(-1).at,1);
  }
  assert.equal(canAnimate(VIEWS['rail-fastening'],'sleeper'),false);
});
check('Bearing ring, cage and roller speeds satisfy both no-slip contacts in the authored radial example',()=>{
  state('bogie','bogie',0);const b=one('axle-bearing',one('axlebox-near')),data=b.userData.bearingKinematics;
  const {innerRadius:ri,outerRadius:ro,orbitRadius:rc,rollerRadius:r,cageRatio:c,spinRatio:w}=data;
  close(rc-r,ri);close(rc+r,ro);close(c*rc+w*r,0,'stationary outer contact');close(c*rc-w*r,ri,'inner contact speed');
  v.setPhase(1.7);h.draw();const angle=1.7/5*Math.PI*2;
  close(one('bearing-inner-race',b).rotation.z,angle);close(one('bearing-roller-and-cage-set',b).rotation.z,angle*c);
  close(one('bearing-outer-race',b).rotation.z,0);
  const near=one('bearing-inner-race',one('axlebox-near')),far=one('bearing-inner-race',one('axlebox-far'));
  const radial=new THREE.Vector3(1,0,0),nearDirection=radial.clone().applyQuaternion(near.getWorldQuaternion(new THREE.Quaternion())),farDirection=radial.clone().applyQuaternion(far.getWorldQuaternion(new THREE.Quaternion())).negate();
  assert(nearDirection.distanceTo(farDirection)<1e-8,'Mirrored bearing turns opposite to its axle');
});
check('Information timelines no longer spin unrelated wheelsets',()=>{
  state('control','atp',0);const wheel=one('wheel-near'),angle=wheel.rotation.z;
  v.setPhase(4);close(wheel.rotation.z,angle);
  state('services','doors',2);for(const n of all('wheel-near'))close(n.rotation.z,0);
});
check('The installed doorway has a real opening and retains machinery through a body cutaway',()=>{
  state('services','doors',2);v.setCutaway(true);h.draw();
  const doors=all('doors').filter(n=>n.userData.component==='doors');assert.equal(doors.length,4);
  for(const d of doors){assert(nodeVisible(one('sliding-door-leaf',d)));close(d.userData.doorPose.opening,1);}
  v.setCutaway(false);h.draw();const doorway=doors.find(d=>world(d).z>0),origin=doorway.localToWorld(new THREE.Vector3(0,0,.4));
  const ray=new THREE.Raycaster(origin,new THREE.Vector3(0,0,-1),0,.5),meshes=[];
  doorway.traverseVisible(n=>{if(n.isMesh)meshes.push(n);});assert.equal(ray.intersectObjects(meshes,false).length,0,'A solid backdrop blocks the open doorway');
});
check('Door pulley travel, leaf hangers, fixed guide, lock and reported proof remain distinct',()=>{
  state('services','doors',0);const d=all('doors')[0],guide=one('vehicle-door-guide-rail',d),datum=world(guide);
  for(const [phase,opening,locked,reported]of [[0,0,true,true],[.8,0,false,false],[2,1,false,false],[4,0,false,false],[4.6,0,true,false],[5,0,true,true]]){
    v.setPhase(phase);h.draw();const pose=d.userData.doorPose;close(pose.opening,opening);assert.equal(pose.locked,locked);assert.equal(pose.reported,reported);
    close(one('vehicle-door-drive-pulley',d).rotation.z*.075,.66*opening);
    const leaves=all('sliding-door-leaf',d),hangers=all('vehicle-door-hanger',d);for(let i=0;i<2;i++)close(leaves[i].position.x,hangers[i].position.x);
    assert(world(guide).distanceTo(datum)<1e-9);
  }
});
check('Component selection changes the mechanism rather than animating every supporting load',()=>{
  state('services','hvac',1.25);close(one('hvac-supply-fan').rotation.x,Math.PI);close(one('compressor-crankshaft').rotation.z,0);close(all('doors')[0].userData.doorPose.opening,0);
  v.setSelected('compressor');v.setPhase(1.25);close(one('hvac-supply-fan').rotation.x,0);close(one('compressor-crankshaft').rotation.z,Math.PI);
});
check('The compressor has a constant-length rod, piston clearance and a distinct installed air-supply envelope',()=>{
  state('services','compressor',0);const g=one('compressor'),piston=one('compressor-piston',g),rod=one('compressor-connecting-rod',g);
  const {rodLength,boreRadius,pistonRadius}=g.userData.sliderCrank;assert(pistonRadius<boreRadius);
  for(let i=0;i<=32;i++){
    v.setPhase(i*5/32);const [a,b]=g.userData.rodEndpoints.map(p=>new THREE.Vector3(...p));close(a.distanceTo(b),rodLength);
    const axis=new THREE.Vector3(0,1,0).applyQuaternion(rod.quaternion),first=rod.position.clone().addScaledVector(axis,-rodLength/2),last=rod.position.clone().addScaledVector(axis,rodLength/2);
    assert(first.distanceTo(a)<1e-8);assert(last.distanceTo(b)<1e-8);close(piston.position.y,b.y);assert(piston.position.y+.06<1.06);
  }
  v.setPhase(0);h.draw();const bounds=new THREE.Box3().setFromObject(g);assert(bounds.max.y<1.3);assert(bounds.min.z>.65);assert(bounds.max.z<1.3);
});
check('Brake study applies opposed pads at rest and restores the release gap',()=>{
  state('bogie','brakes',0);const b=one('shared-disc-brake'),pad=one('brake-pad-carrier-1',b),released=pad.position.z;
  v.setPhase(1.25);close(b.userData.applicationFraction,1);assert(pad.position.z<released);close(one('wheel-near').rotation.z,0);
  v.setPhase(5);close(b.userData.applicationFraction,0);close(pad.position.z,released);
});
check('Plant pump shaft and impeller move together while enclosure and control conclusions remain fixed',()=>{
  state('station-plant','fire-pump',0,'water');const shaft=one('pump-drive-shaft'),impeller=one('pump-impeller'),casing=one('pump-hydraulic-section'),datum=world(casing);
  for(const phase of [1,2.7,5]){v.setPhase(phase);h.draw();close(shaft.rotation.x,impeller.rotation.x);close(shaft.rotation.x,phase/5*Math.PI*4);assert(world(casing).distanceTo(datum)<1e-9);}
  assert(canAnimate(VIEWS['fire-systems'],'water'));assert.match(animationFor(VIEWS['fire-systems'],'water').steps[3].description,/has not started/);
});
check('Lift suspension wraps the sheave and preserves total car-to-counterweight rope length',()=>{
  state('station','station-lift',0,'passenger');const lift=one('station-lift'),car=one('lift-carriage',lift),weight=one('lift-counterweight',lift),sheave=one('lift-traction-sheave',lift);
  const baseline=lift.userData.suspensionLengths,total=baseline.car+baseline.counterweight+baseline.wrap,positionSum=car.position.y+weight.position.y;
  assert.equal(all('lift-car-suspension-rope',lift).length,2);assert.equal(all('lift-counterweight-suspension-rope',lift).length,2);assert.equal(all('lift-sheave-rope-wrap',lift).length,2);
  for(const phase of [0,1,2,3,4,5]){v.setPhase(phase);const lengths=lift.userData.suspensionLengths;close(lengths.car+lengths.counterweight+lengths.wrap,total);close(car.position.y+weight.position.y,positionSum);close(sheave.rotation.x*.36,-car.position.y);assert(lengths.car>0&&lengths.counterweight>0);}
});
check('Infrastructure anatomy retains real openings and supported load interfaces without 3D work records',()=>{
  state('infrastructure-assets','route-bridge',0,'assets');v.setCutaway(false);h.draw();
  for(const name of ['route-record','route-work-boundary','bearing-observation','observation-record','check-outstanding'])assert(!root().getObjectByName(name),name+' must remain in the process view');
  assert(one('culvert-crown'));assert(one('culvert-invert'));assert(one('bridge-deck'));assert.equal(all('bridge-longitudinal-girder').length,2);
  const bearing=one('bridge-bearing-0-0'),upper=new THREE.Box3().setFromObject(one('bridge-bearing-upper-plate',bearing)),girder=new THREE.Box3().setFromObject(one('bridge-longitudinal-girder'));
  close(upper.max.y,girder.min.y,'bearing-to-girder contact');
  const bearingBounds=new THREE.Box3().setFromObject(bearing),abutment=new THREE.Box3().setFromObject(one('bridge-abutment-0'));
  close(bearingBounds.min.y,abutment.max.y,'bearing-to-abutment contact');
  const drain=one('route-drainage'),origin=drain.localToWorld(new THREE.Vector3(0,0,4)),ray=new THREE.Raycaster(origin,new THREE.Vector3(0,0,-1),0,8),meshes=[];
  drain.traverseVisible(n=>{if(n.isMesh)meshes.push(n);});assert.equal(ray.intersectObjects(meshes,false).length,0,'Culvert barrel is filled by geometry');
});
check('Depot vehicle travel and wash-gantry travel now rotate their running wheels at the contact radius',()=>{
  for(const [view,variant,name,component]of [['depot-condition','roll-by','inspection-passage-vehicle','depot-condition-monitoring'],['depot-testing','movement','separate-test-road-vehicle','depot-test-track'],['depot-wash','wash','drive-through-moving-train','depot-wash-plant']]){
    state(view,component,1.5,variant);const train=one(name),axle=one('depot-mounted-axle',train);
    close(axle.rotation.z*.3*train.scale.y,-train.userData.rollingDisplacement);
  }
  state('depot-wash','depot-wash-gantry',1.5,'mobile');const gantry=one('travelling-wash-gantry'),wheel=one('gantry-running-wheel',gantry),still=one('gantry-stationary-train');
  close(wheel.rotation.z*.14,-(gantry.position.x+4.5));close(wheel.position.y-.14,.215,'gantry wheel meets rail top');close(one('depot-mounted-axle',still).rotation.z,0);
});
check('Removed-door fixture now retains physical pulley, clamp, hanger and rail relationships',()=>{
  state('depot-components','depot-door-service',0,'doors');const guide=one('bench-door-fixed-guide'),datum=world(guide),pulley=one('bench-door-belt-pulley');
  v.setPhase(2.5);h.draw();close(pulley.rotation.z*.16,1.25);assert(world(guide).distanceTo(datum)<1e-9);
  const leaves=all('bench-door-leaf'),clamps=all('bench-door-belt-clamp');for(let i=0;i<2;i++){close(world(leaves[i]).x,world(clamps[i]).x);close(world(one('bench-door-guide-roller',leaves[i])).y-.08,3.54+.1);}
});
v.dispose();
console.log(`${passed} component-motion and representation contracts passed (shipping geometry; GPU rendering not assessed).`);
