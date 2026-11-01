import assert from 'node:assert/strict';
import { viewerHarness, THREE } from './viewer-test-harness.mjs';
import { buildAssemblyIndex, assemblyTree } from '../dist/assembly-contract.js';
import { assemblyRoots, within, nodeVisible, visibleBounds } from '../dist/exploration.js';
import { studyHarness } from './study-harness.mjs';
import { buildTrackView } from '../dist/track-models.js';
import { createEquipmentDetails } from '../dist/equipment-details.js';
import { MECHANICAL_SOURCES, MECHANICAL_LESSONS } from '../dist/mechanical-content.js';

let passed=0;
function check(name,fn){fn();passed++;console.log('PASS '+name);}
const selected=[];
const h=await viewerHarness({onSelect:(concept,meta)=>selected.push({concept,...meta})}),v=h.viewer;
const root=()=>h.root();
const node=(name,from=root())=>{const result=from.getObjectByName(name);assert(result,'Missing '+name);return result;};
const nodes=(name,from=root())=>{const result=[];from.traverse(n=>{if(n.name===name)result.push(n);});return result;};
const world=n=>n.getWorldPosition(new THREE.Vector3());
function motorSurfaceEnvelope(part,motor){
  motor.updateWorldMatrix(true,true);const inverse=motor.matrixWorld.clone().invert(),vertices=[];let minRadius=Infinity;
  const edgeRadius=(a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,-(a.x*dx+a.y*dy)/length)):0;return Math.hypot(a.x+t*dx,a.y+t*dy);};
  const cross=(a,b)=>a.x*b.y-a.y*b.x;
  part.traverse(n=>{if(!n.isMesh)return;const p=n.geometry.attributes.position,index=n.geometry.index,transform=inverse.clone().multiply(n.matrixWorld),points=Array.from({length:p.count},(_,i)=>new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(transform));vertices.push(...points);
    for(let i=0;i<(index?.count||p.count);i+=3){const [a,b,c]=[0,1,2].map(k=>points[index?index.getX(i+k):i+k]),s=[cross(a,b),cross(b,c),cross(c,a)],area=s[0]+s[1]+s[2],inside=Math.abs(area)>1e-15&&(s.every(x=>x>=0)||s.every(x=>x<=0));minRadius=Math.min(minRadius,inside?0:Math.min(edgeRadius(a,b),edgeRadius(b,c),edgeRadius(c,a)));}
  });
  return {vertices,minRadius,maxRadius:Math.max(...vertices.map(p=>Math.hypot(p.x,p.y))),maxAbsZ:Math.max(...vertices.map(p=>Math.abs(p.z)))};
}
const sh=await studyHarness();
for(const id of ['rail-fastening','switch-drive'])buildTrackView(id,sh.api);
const brakeRoot=sh.api.startModel('brake-contract');brakeRoot.visible=true;
const brakeHarness={detail:createEquipmentDetails(sh.api).discBrake(brakeRoot,{context:'depot'})};

check('Physical identity is deterministic and each picked primitive resolves to its own ancestor',()=>{
  v.setView('vehicle');h.draw();
  const before=v.getInspectionState().tree.map(n=>n.instanceId),set=new Set(before);
  assert.equal(set.size,before.length);assert(before.length>20);
  root().traverse(n=>{if(!n.isMesh||!n.userData.component)return;const id=n.userData.pickInstanceId;assert(id&&set.has(id),n.name+' has no physical identity');let p=n;while(p&&p.userData.instanceId!==id)p=p.parent;assert(p,'Pick identity points at a different branch');});
  const recreated=awaitIndex(root());assert.deepEqual(recreated,before);
  assert(before.every(id=>!/[0-9a-f]{8}-[0-9a-f]{4}/.test(id)),'UUID leaked into persistent identity');
});
function awaitIndex(r){const pseudo={root:r,parts:new Map(),exploded:[]};r.traverse(n=>{if(n.isGroup&&n.userData.component){const id=n.userData.component;if(!pseudo.parts.has(id))pseudo.parts.set(id,[]);pseudo.parts.get(id).push(n);}});buildAssemblyIndex(pseudo);return assemblyTree(pseudo).map(n=>n.instanceId);}

check('Selecting one repeated bogie leaves the other assembled and survives same-concept synchronization',()=>{
  const bogies=nodes('bogie-assembly'),first=bogies[0],second=bogies[1];assert.equal(bogies.length,2);
  const secondFrame=node('bogie-frame-and-suspension',second),firstFrame=node('bogie-frame-and-suspension',first);
  const firstPosition=world(firstFrame),secondPosition=world(secondFrame),datum=world(first);
  assert(v.selectInstance(first.userData.instanceId));v.setSelected('bogie');
  assert.equal(v.getInspectionState().selectedInstanceId,first.userData.instanceId);
  v.setExplodeScope('selected');v.setExploded(1);
  assert(world(firstFrame).distanceTo(firstPosition)>.5);assert(world(secondFrame).distanceTo(secondPosition)<1e-9);
  assert(world(first).distanceTo(datum)<1e-9,'Inspection moved its retained datum');
  v.setAllInstances(true);assert(world(secondFrame).distanceTo(secondPosition)>.5);
  v.setAllInstances(false);assert(world(secondFrame).distanceTo(secondPosition)<1e-9);
  v.setExploded(0);assert(world(firstFrame).distanceTo(firstPosition)<1e-9);
});

check('Selection APIs preserve the camera, isolate the selected instance and support silent restoration',()=>{
  h.draw();const camera=h.renderer.camera.position.clone(),bogies=nodes('bogie-assembly');
  const count=selected.length;assert(v.selectInstance(bogies[1].userData.instanceId,{notify:false}));assert.equal(selected.length,count);
  assert(h.renderer.camera.position.distanceTo(camera)<1e-9);assert(!v.selectInstance('missing-instance'));
  assert(v.setIsolation('bogie'));assert(nodeVisible(bogies[1])&&!nodeVisible(bogies[0]));
  const bearing=node('axle-bearing',bogies[1]);assert(v.selectInstance(bearing.userData.instanceId));assert.equal(v.getExplorationState().isolation,'bogie');
  assert.equal(v.getInspectionState().selected.label,'Roller bearing unit');assert(v.getInspectionState().ancestors.some(a=>a.label==='Bogie assembly'));
  const after=h.renderer.camera.position.clone();v.setAllInstances(false);assert(h.renderer.camera.position.distanceTo(after)<1e-9);
  v.restoreExploration();
});

check('Bearing races, rollers, cage and seals have real distinct geometry and shaft clearance',()=>{
  v.setView('bogie');v.setTechnology({propulsion:'lim',control:'loop'});h.draw();
  const b=node('axle-bearing'),inner=node('bearing-inner-race',b),outer=node('bearing-outer-race',b),seal=node('bearing-end-seal',b);
  const radial=n=>n.children.find(x=>x.geometry?.type==='LatheGeometry').geometry.parameters.points.map(p=>p.x);
  assert(Math.min(...radial(inner))>.075);assert(Math.max(...radial(inner))<Math.min(...radial(outer)));
  assert(Math.min(...radial(seal))>.075);assert(node('bearing-roller-and-cage-set',b).children.length>=10);
  const axlebox=node('axlebox-near'),position=world(axlebox);v.setPhase(4);assert(world(axlebox).distanceTo(position)<1e-9,'Stationary housing rotated with the axle');
  assert(v.selectInstance(b.userData.instanceId));assert(v.setInspectionMode('inspection'));
  v.setAllInstances(true);const repeated=v.getInspectionState().tree.filter(n=>n.selected);assert.equal(repeated.length,4);assert(repeated.every(n=>n.label==='Roller bearing unit'),'Show all widened a bearing to its whole catalogue concept');v.setAllInstances(false);
  const final=world(seal);for(const exposure of [0,.4,1,.2,1])v.setExploded(exposure);assert(world(seal).distanceTo(final)<1e-9);
  v.setInspectionMode('assembled');assert.equal(v.getExplorationState().exploded,0);
});

check('Architecture availability keeps active cutaway covers while excluding incompatible hardware',()=>{
  v.restoreExploration();v.selectInstance(node('bogie-assembly').userData.instanceId,{notify:false});v.setCutaway(true);let tree=v.getInspectionState().tree;
  const cover=tree.find(n=>n.label==='Axlebox end cover');assert(cover?.available&&!cover.visible);
  assert(tree.filter(n=>n.conceptId==='rotary-traction-motor').every(n=>!n.available));
  v.setIsolation('bogie');tree=v.getInspectionState().tree;assert(tree.some(n=>n.conceptId==='running-rail'&&n.available&&!n.visible),'Isolation was mistaken for architecture incompatibility');
  v.restoreExploration();v.setTechnology({propulsion:'rotary',control:'radio'});tree=v.getInspectionState().tree;
  assert(tree.some(n=>n.conceptId==='rotary-traction-motor'&&n.available));assert(tree.filter(n=>n.conceptId==='lim-primary').every(n=>!n.available));
  v.setTechnology({propulsion:'lim',control:'loop'});
});

check('The whole bogie has a coherent owner recipe while bearing inspections retain their local sequence',()=>{
  const bogie=node('bogie-assembly');v.selectInstance(bogie.userData.instanceId,{notify:false});assert.equal(v.getInspectionState().stages.length,3);
  const roller=node('bearing-roller-and-cage-set'),start=roller.position.clone();v.setExplodeScope('selected');v.setExploded(.65);assert(roller.position.distanceTo(start)<1e-9,'The whole-bogie working stage began early');v.setExploded(1);assert(roller.position.distanceTo(start)>.19);
  v.restoreExploration();const bearing=node('axle-bearing');v.selectInstance(bearing.userData.instanceId,{notify:false});assert(v.getInspectionState().stages.some(s=>s.label==='Expose rolling elements'));assert(!v.getInspectionState().stages.some(s=>s.label==='Open covers and locate the frame'));
  v.restoreExploration();
});

check('Both axlebox inspections face outward and reveal the rolling set beyond the displaced cover',()=>{
  for(const side of ['near','far']){
    v.restoreExploration();const axlebox=node('axlebox-'+side),rollers=node('bearing-roller-and-cage-set',axlebox),cover=node('axlebox-end-cover',axlebox);
    v.selectInstance(axlebox.userData.instanceId,{notify:false});assert(v.setInspectionMode('inspection'));h.draw();
    const facing=h.renderer.camera.getWorldDirection(new THREE.Vector3()).negate(),outward=new THREE.Vector3(side==='near'?.8:-.8,.6,side==='near'?1:-1).normalize();assert(facing.dot(outward)>.999);
    assert(nodeVisible(rollers)&&nodeVisible(cover));const meshes=[];root().traverseVisible(n=>{if(n.isMesh)meshes.push(n);});
    const cylinders=rollers.children.filter(n=>n.geometry?.type==='CylinderGeometry'),origin=h.renderer.camera.position,ray=new THREE.Raycaster();let exposed=0;
    for(const cylinder of cylinders){ray.set(origin,world(cylinder).sub(origin).normalize());const hit=ray.intersectObjects(meshes,false)[0];if(hit&&within(hit.object,rollers))exposed++;}
    assert(exposed>=6,side+' axlebox leaves the rolling set hidden behind its removed parts');
  }
  v.restoreExploration();
});

check('A physical ray click selects the actual hit part and returns its persistent instance identity',()=>{
  v.setSelected('brakes');v.setIsolation('brakes');v.frameSelection();h.draw();
  const candidates=[];root().traverse(n=>{if(n.isMesh&&n.userData.component&&nodeVisible(n))candidates.push(n);});
  const pad=node('brake-friction-pad'),target=world(pad),screen=target.clone().project(h.renderer.camera);
  const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(screen.x,screen.y),h.renderer.camera);
  const hit=ray.intersectObjects(candidates,false)[0];assert(hit,'Expected a physical brake intersection');
  const event={clientX:(screen.x+1)*550,clientY:(1-screen.y)*350};h.renderer.listeners.get('pointerdown')(event);h.renderer.listeners.get('pointerup')(event);
  assert.equal(v.getInspectionState().selectedInstanceId,hit.object.userData.pickInstanceId);assert.equal(selected.at(-1).instanceId,hit.object.userData.pickInstanceId);
  v.restoreExploration();
});

check('Primary and secondary suspension remain distinct, supported interfaces',()=>{
  const bogie=node('bogie-assembly'),springs=[];bogie.traverse(n=>{if(n.name.startsWith('primary-spring-'))springs.push(n);});assert.equal(springs.length,4);
  for(const s of springs){assert(Math.abs(Math.abs(s.position.x)-1.02)<1e-9);assert(Math.abs(Math.abs(s.position.z)-.99)<1e-9);assert.equal(s.position.y,.76);}
  assert.equal(nodes('air-spring-emergency-spring',bogie).length,2);assert.equal(nodes('air-spring-body-interface',bogie).length,2);
  const air=node('secondary-air-spring-near');assert(node('air-spring-body-interface',air).position.y>node('air-spring-lower-plate',air).position.y);
  assert(v.selectInstance(bogie.userData.instanceId));const path=v.getInspectionState().functionalPaths.find(p=>p.id.endsWith('::vertical-load'));assert(path&&path.steps.length>=7&&path.sources.includes('MD01'));assert(path.steps.every(s=>s.instanceId||s.conceptId));
});

check('Motor rotor clearance, coaxial coupling and 24:12 gear ratio agree with geometry and motion',()=>{
  v.setTechnology({propulsion:'rotary',control:'loop'});v.setCutaway(true);h.draw();
  const motor=node('rotary-traction-motor'),rotor=node('motor-rotor',motor),stator=node('motor-stator-core',motor),shaft=node('straight-motor-pinion-shaft',motor);
  const bore=Math.min(...stator.children.flatMap(n=>n.geometry.parameters.points.map(p=>p.x)));const rotorRadius=rotor.children.find(n=>n.geometry?.type==='CylinderGeometry').geometry.parameters.radiusTop;assert.equal(bore,.166);assert(rotorRadius<bore);
  const winding=node('motor-stator-windings',motor),conductors=motorSurfaceEnvelope(winding,motor),sweep=motorSurfaceEnvelope(rotor,motor);
  assert(conductors.minRadius>sweep.maxRadius+.005,'An actual winding triangle enters the rotor/cage swept envelope');
  assert(conductors.maxAbsZ<.3025-.002,'An end turn intersects the end-shield plane');
  const pitch=Math.PI/6;
  for(const p of conductors.vertices.filter(p=>Math.abs(p.z)<=.25)){
    const offset=((Math.atan2(p.y,p.x)+Math.PI/2+pitch/2)%(pitch)+pitch)%pitch-pitch/2;
    assert(Math.abs(offset)<.09,'An axial conductor leaves its open stator slot');assert(Math.hypot(p.x,p.y)<.202,'An axial conductor enters the stator back iron');
  }
  const gears=nodes('illustrative-gear');assert.deepEqual(gears.map(g=>g.userData.gearToothCount),[24,12]);
  const pinion=world(gears[1]),coupling=world(shaft);assert(Math.abs(pinion.x-coupling.x)<1e-9&&Math.abs(pinion.y-coupling.y)<1e-9);
  v.setPhase(0);const initial=gears.map(g=>g.rotation.z),r0=rotor.rotation.z;v.setPhase(2);const delta=gears.map((g,i)=>g.rotation.z-initial[i]);assert(Math.abs(delta[1]/delta[0]+2)<1e-9);assert(Math.abs(rotor.rotation.z-r0-delta[1])<1e-9);
  assert(nodeVisible(rotor)&&nodeVisible(stator));assert(!nodeVisible(node('motor-removable-housing-sector',motor)));
  v.setCutaway(false);v.setPhase(0);
});

check('LIM input phases, slot insulation and passive reaction layers remain separated by an air gap',()=>{
  v.setTechnology({propulsion:'lim',control:'radio'});h.draw();
  const primary=node('lim-primary'),reaction=node('reaction-rail');assert(visibleBounds(primary).min.y>visibleBounds(reaction).max.y);
  assert.equal(nodes('primary-input-terminals',primary).length,1);assert.equal(primary.getObjectByName('primary-winding-groups').children.filter(n=>n.name.startsWith('primary-phase-')).length,3);
  assert(node('primary-slot-insulation',primary).children.length>0);assert(node('reaction-conducting-cap',reaction).children.length>0);assert(node('reaction-backing-iron',reaction).children.length>0);
  v.setSelected('lim-primary');v.setExplodeScope('selected');const wind=node('primary-winding-groups');const base=world(wind);v.setExploded(.65);assert(world(wind).distanceTo(base)<1e-9);v.setExploded(1);assert(world(wind).distanceTo(base)>.7);v.restoreExploration();
});

check('The common brake builder is used on vehicle and has opposed pads that stop at rotor faces',()=>{
  const brakes=nodes('shared-disc-brake');assert.equal(brakes.length,4);assert(brakes.every(n=>n.userData.detailContext==='vehicle'));
  root().updateWorldMatrix(true,true);const beams=node('bogie-frame-and-suspension').children.filter(n=>n.geometry?.type==='BoxGeometry'&&n.geometry.parameters.width===2.65).map(n=>new THREE.Box3().setFromObject(n));
  for(const brake of brakes){const actuator=new THREE.Box3().setFromObject(node('brake-actuator',brake));assert(beams.every(beam=>!beam.intersectsBox(actuator)),'Brake actuator intersects a structural frame beam');assert(node('brake-frame-reaction-bracket',brake));}
  const sh=awaitBrakeHarness(),detail=sh.detail,d=detail.node.userData.brakeDimensions;
  for(const amount of [0,.3,1,2,0]){detail.apply(amount);for(const pad of detail.pads){const gap=Math.abs(pad.position.z)-d.padDepth/2-d.discThickness/2;assert(gap>=-1e-12);if(amount===1||amount===2)assert(Math.abs(gap)<1e-12);}}
});
function awaitBrakeHarness(){assert(brakeHarness,'Brake harness initialization');return brakeHarness;}

check('Fastening inspection removes springs while retaining shoulders on the rail seat datum',()=>{
  v.setView('rail-fastening');v.setVariant('sleeper');v.setSelected('track-rail-clip');h.draw();
  const seat=node('rail-seat'),shoulder=node('retained-shoulder-1',seat),clip=node('elastic-clip-1',seat),a=world(shoulder),b=world(clip),datum=world(seat);
  v.setExplodeScope('selected');v.setExploded(.35);assert(world(shoulder).distanceTo(a)<1e-9);assert(world(clip).distanceTo(b)>.55);assert(world(seat).distanceTo(datum)<1e-9);
  assert(v.getInspectionState().stages.some(s=>s.label==='Expose the insulating interfaces'));v.restoreExploration();
});

check('Point-drive rack travel and pinion rotation share pitch, while lock and proof retain independent states',()=>{
  let r=sh.set('switch-drive','normal',0),gear=node('illustrative-drive-gear',r.root),rack=node('point-drive-rack',r.root),output=node('linear-output-rod',r.root);
  const z=output.position.z,a=gear.rotation.x;sh.set('switch-drive','normal',3.2);assert(Math.abs(output.position.z-z)>.01);assert(Math.abs(output.position.z-z+gear.userData.gearPitchRadius*(gear.rotation.x-a))<1e-9);
  assert(Math.abs(gear.userData.rackPitch-2*Math.PI*gear.userData.gearPitchRadius/12)<1e-12);assert(rack.children.length>=14);
  r=sh.set('switch-drive','unproved',5);const machine=(r.parts.get('track-point-machine')||[])[0];assert.equal(machine.userData.targetProved,false);assert.equal(machine.userData.lockEngaged,false);
});

check('Every new authored lesson resolves its explicit primary references',()=>{
  const ids=new Set(MECHANICAL_SOURCES.map(s=>s.id));assert.equal(ids.size,MECHANICAL_SOURCES.length);for(const s of MECHANICAL_SOURCES)assert(s.url.startsWith('https://')&&s.scope);
  for(const lesson of MECHANICAL_LESSONS)for(const id of lesson.sources)assert(ids.has(id)||['P02','P03','P10'].includes(id));
});

check('Functional paths in a repeated assembly retain local physical targets',()=>{
  v.setView('vehicle');v.setTechnology({propulsion:'lim',control:'loop'});h.draw();const bogie=nodes('bogie-assembly')[1],primary=node('lim-primary',bogie);v.selectInstance(primary.userData.instanceId,{notify:false});
  const state=v.getInspectionState(),path=state.functionalPaths.find(p=>p.id.endsWith('::lim-coupling'));assert(path);
  for(const step of path.steps.filter(s=>['Input terminals','Winding groups','Laminated core'].includes(s.label)))assert(step.instanceId.startsWith(primary.userData.instanceId+'/'),'Trace jumped to the other bogie');
});

check('A complete functional path remains available at its explicit external interface',()=>{
  v.setView('bogie');v.setSelected('bogie');const path=v.getInspectionState().functionalPaths.find(p=>p.id.endsWith('::vertical-load'));assert(path);
  const rail=path.steps.at(-1);assert.equal(rail.conceptId,'running-rail');assert(v.selectInstance(rail.instanceId,{notify:false}));
  assert.equal(v.setFunctionalPath(path.id),path.id);assert(v.getInspectionState().functionalPaths.some(p=>p.id===path.id));
});

check('Physical selection rejects inactive arrangements while retaining covered and isolation-hidden active parts',()=>{
  v.setView('bogie');v.setTechnology({propulsion:'lim',control:'loop'});v.restoreExploration();v.setCutaway(true);
  let tree=v.getInspectionState().tree;
  const cover=tree.find(n=>n.label==='Axlebox end cover'&&n.available&&!n.visible);assert(cover);assert(v.selectInstance(cover.instanceId,{notify:false}));assert.equal(v.getInspectionState().selectedInstanceId,cover.instanceId);
  const motor=tree.find(n=>n.conceptId==='rotary-traction-motor'&&!n.available);assert(motor);assert.equal(v.selectInstance(motor.instanceId),false);assert.equal(v.getInspectionState().selectedInstanceId,cover.instanceId);
  v.selectInstance(node('bogie-assembly').userData.instanceId,{notify:false});v.setIsolation('bogie');tree=v.getInspectionState().tree;
  const rail=tree.find(n=>n.conceptId==='running-rail'&&n.available&&!n.visible);assert(rail);assert(v.selectInstance(rail.instanceId,{notify:false}));assert.equal(v.getInspectionState().selectedInstanceId,rail.instanceId);assert.equal(v.getExplorationState().isolation,null);
  v.setView('occ-workplace');v.setVariant('task');h.draw();tree=v.getInspectionState().tree;
  const inactive=tree.find(n=>n.conceptId==='occ-console'&&!n.available),active=tree.find(n=>n.conceptId==='occ-console'&&n.available);assert(inactive&&active,'The regression requires distinct active and inactive occurrences of the same concept');
  assert(v.selectInstance(active.instanceId,{notify:false}));v.setAllInstances(true);
  const before=v.getInspectionState(),notifications=selected.length,camera=h.renderer.camera.position.clone();
  assert.equal(v.selectInstance(inactive.instanceId),false);const after=v.getInspectionState();
  assert.equal(after.selectedInstanceId,before.selectedInstanceId);assert.equal(after.allInstances,true);assert.equal(selected.length,notifications);assert(h.renderer.camera.position.distanceTo(camera)<1e-9);
});

const desktopFrame=await viewerHarness({}, {width:1052,height:516,footerHeight:104,footerPosition:'absolute'});
check('Explicit near/far axlebox framing keeps exposed geometry above the measured desktop controls',()=>{
  const framed=desktopFrame.viewer;framed.setView('bogie');framed.setTechnology({propulsion:'lim',control:'loop'});
  for(const side of ['near','far']){
    framed.restoreExploration();const assembly=desktopFrame.root().getObjectByName('axlebox-'+side);assert(assembly);
    assert(framed.selectInstance(assembly.userData.instanceId,{notify:false}));assert(framed.setInspectionMode('inspection'));assert(framed.frameSelection());desktopFrame.draw();
    const camera=desktopFrame.renderer.camera,points=[];assembly.updateWorldMatrix(true,true);
    assembly.traverseVisible(n=>{if(!n.isMesh)return;const p=n.geometry.attributes.position;for(let i=0;i<p.count;i++)points.push(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(n.matrixWorld).project(camera));});
    assert(points.length>0);const top=Math.min(...points.map(p=>(1-p.y)*516/2)),bottom=Math.max(...points.map(p=>(1-p.y)*516/2));
    assert(top>=0,side+' inspection clipped the top of the model');assert(bottom<=516-desktopFrame.footer.offsetHeight-12+1e-7,side+' exposed parts were fitted beneath the toolbar');assert(points.every(p=>Math.abs(p.x)<1),'The footer correction clipped the horizontal frame');assert(camera.zoom<=1,'Selection framing enlarged the model unnecessarily');
    camera.position.add(new THREE.Vector3(.13,.04,-.07));camera.lookAt(visibleBounds(assembly).getCenter(new THREE.Vector3()));camera.updateMatrixWorld(true);
    const orbitPosition=camera.position.clone(),orbitRotation=camera.quaternion.clone();framed.setPhase(.5);desktopFrame.draw();
    assert(camera.position.distanceTo(orbitPosition)<1e-9&&camera.quaternion.angleTo(orbitRotation)<1e-7,'Rendering or phase changes overrode a manually chosen camera');
  }
  desktopFrame.footer.position='static';assert(framed.frameSelection());desktopFrame.draw();
  assert(!desktopFrame.renderer.camera.view?.enabled,'A static mobile-style footer reserved part of the canvas');assert.equal(desktopFrame.renderer.camera.zoom,1);
});
desktopFrame.viewer.dispose();
v.dispose();console.log(`PASS ${passed} mechanical-depth and physical-inspection contracts (GPU rendering not assessed)`);
