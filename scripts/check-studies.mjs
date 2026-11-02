import assert from 'node:assert/strict';
import {studyHarness,THREE,visible} from './study-harness.mjs';
import {STUDY_VIEWS,STUDY_CONCEPTS} from '../dist/studies-data.js';
import {PART_VIEW_VARIANTS} from '../dist/atlas-config.js';
import {describeFlow,VIEWS,viewFor} from '../dist/model.js';
import {ELECTRIFICATION_CHOICES,electrificationFlow} from '../dist/electrification.js';
import {componentBounds} from '../dist/exploration.js';
import {technologyFlow} from '../dist/technology.js';
const {set}=await studyHarness();let passed=0;
const studyViews=Object.fromEntries([...Object.keys(STUDY_VIEWS),'infrastructure-assets'].map(id=>[id,VIEWS[id]]));
const has=(record,id)=>componentBounds(record).has(id);
const check=(name,fn)=>{fn();passed++;console.log(`PASS ${name}`);};
const node=(r,name)=>{const n=r.root.getObjectByName(name);assert(n,`Missing geometry ${name}`);return n;};
const on=(r,name)=>visible(node(r,name));
const pos=(r,name)=>node(r,name).getWorldPosition(new THREE.Vector3());
const bounds=(r,name)=>new THREE.Box3().setFromObject(node(r,name));

check('Every study arrangement has finite geometry and all advertised component contexts',()=>{
  for(const [view,v]of Object.entries(studyViews))for(const variant of v.variants){
    const profiles=view==='electrification'?ELECTRIFICATION_CHOICES.map(choice=>choice.id):['fourth-rail-dc'];
    for(const electrification of profiles){
      const r=set(view,variant.id,2.5,{electrification});assert(r.picks.length);
      r.root.traverse(n=>{if(n.isMesh)for(const x of n.geometry.attributes.position.array)assert(Number.isFinite(x),`${view}/${variant.id}: invalid vertex`);assert([...n.position.toArray(),...n.rotation.toArray().slice(0,3),...n.scale.toArray()].every(Number.isFinite));});
      // Use the shipping route after deliberate representation migrations. The
      // structures/drainage asset is now a physical section, while its former
      // infrastructure-care route opens the maintenance evidence process.
      for(const c of STUDY_CONCEPTS.filter(c=>viewFor(c.id)===view))if(PART_VIEW_VARIANTS[c.id][view].includes(variant.id)){
        const expected=c.id!=='study-onboard-transformer'||electrification==='overhead-ac';
        assert.equal(has(r,c.id),expected,`${view}/${variant.id}/${electrification}: geometry for ${c.id}`);
      }
    }
  }
});
check('Four independent profiles replace collection, conversion and return without replacing propulsion',()=>{
  assert.deepEqual(studyViews.electrification.variants.map(variant=>variant.id),['chain'],'Electrification exposes a second conflicting supply selector');
  const expectations={
    'fourth-rail-dc':{rail:true,separateReturn:true,overhead:false,ac:false},
    'third-rail-dc':{rail:true,separateReturn:false,overhead:false,ac:false},
    'overhead-dc':{rail:false,separateReturn:false,overhead:true,ac:false},
    'overhead-ac':{rail:false,separateReturn:false,overhead:true,ac:true},
  };
  for(const [electrification,expected]of Object.entries(expectations))for(const propulsion of ['lim','rotary']){
    const r=set('electrification','chain',2.5,{electrification,technology:{propulsion,control:'loop'}});
    for(const [id,present]of Object.entries({'collector-positive-shoe':expected.rail,'positive-rail':expected.rail,'collector-return-shoe':expected.separateReturn,'negative-rail':expected.separateReturn,'running-rail-return':!expected.separateReturn,'wheel-return':!expected.separateReturn,pantograph:expected.overhead,'overhead-contact-wire':expected.overhead,rectifier:!expected.ac,'ac-feeder-switchgear':expected.ac,'onboard-transformer':expected.ac,'line-converter':expected.ac})){
      assert.equal(has(r,id),present,`${electrification}/${propulsion}: incorrect ${id}`);
    }
    assert.equal(has(r,'lim-primary'),propulsion==='lim');assert.equal(has(r,'reaction-rail'),propulsion==='lim');
    assert.equal(has(r,'rotary-traction-motor'),propulsion==='rotary');assert(has(r,'study-drive')&&has(r,'dc-link'));
    assert(on(r,`${electrification}-study-supply`)&&on(r,`${electrification}-study-return`),'Selected topology is not connected to the supply');
    for(const other of Object.keys(expectations).filter(value=>value!==electrification))assert(!on(r,`${other}-study-supply`)&&!on(r,`${other}-study-return`),'An obsolete profile retained ghost supply traces');
  }
  const r=set('electrification','chain',0,{electrification:'overhead-ac'});
  for(const name of ['pantograph-to-transformer-primary','ac-primary-wheel-return','transformer-secondary-to-line-converter','transformer-secondary-return'])assert(on(r,name));
  const primary=node(r,'pantograph-to-transformer-primary'),secondary=node(r,'transformer-secondary-to-line-converter');
  assert.notEqual(primary,secondary,'Transformer circuits share one path object');
  assert(bounds(r,'pantograph-to-transformer-primary').max.y>bounds(r,'transformer-secondary-to-line-converter').max.y+2,'Primary collection and transformed secondary were flattened into one path');
});
check('Rolling, spin and slide differ at the wheel while the travel reference is preserved',()=>{
  const rate={};let travel;
  for(const v of ['rolling','spin','slide']){
    let r=set('adhesion',v,0),x=pos(r,'travelling-wheel-centre').x;
    r=set('adhesion',v,4);rate[v]=Math.abs(node(r,'contact-wheelset').rotation.z);
    const dx=pos(r,'travelling-wheel-centre').x-x;
    assert(Math.abs(pos(r,'fixed-travel-reference').x)<1e-9,'Independent reference moved with the wheel');
    if(travel===undefined)travel=dx;else assert(Math.abs(dx-travel)<1e-9);
    if(v==='rolling')assert(Math.abs(rate[v]-dx/.75)<1e-9,'Rolling marker disagrees with wheel radius and travel');
    const axis=new THREE.Vector3(0,1,0).applyQuaternion(node(r,'rotating-brake-disc').children[0].getWorldQuaternion(new THREE.Quaternion()));
    assert(Math.abs(axis.z)>.999,'The spinning brake disc tilted away from the axle');
  }
  assert(rate.spin>rate.rolling&&rate.slide<rate.rolling);
});
check('Protection modulates the brake; sanding grains arrive from a separate nozzle without forced adhesion recovery',()=>{
  let r=set('adhesion','protection',0),pad=node(r,'front-friction-pad'),z=pad.position.z;
  r=set('adhesion','protection',.8);assert(Math.abs(pad.position.z-z)>.01);assert(on(r,'wheel-slide-controller'));assert(!on(r,'sand-delivery-grains'));
  r=set('adhesion','sanding',2.5);assert(on(r,'sand-delivery-grains'));assert(Math.abs(node(r,'contact-wheelset').rotation.z)<.5);
  const wheel=pos(r,'travelling-wheel-centre');
  for(const g of node(r,'sand-delivery-grains').children){const p=g.getWorldPosition(new THREE.Vector3());assert(p.x>wheel.x&&p.y>=.19&&p.y<=.34);assert(Math.abs(p.z+1.2)<1e-9);}
});
check('Brake pads contact opposing disc faces without penetrating the rotor and release in rolling',()=>{
  let r=set('adhesion','slide',2.5),disc=bounds(r,'rotating-brake-disc'),front=bounds(r,'front-friction-pad'),rear=bounds(r,'rear-friction-pad');
  assert(Math.abs(front.min.z-disc.max.z)<1e-8&&Math.abs(rear.max.z-disc.min.z)<1e-8);
  r=set('adhesion','rolling',2.5);assert(bounds(r,'front-friction-pad').min.z>disc.max.z+.1&&bounds(r,'rear-friction-pad').max.z<disc.min.z-.1);
});
check('Infrastructure intervention changes the drain while preserving a real opening, boundary and bearing observation',()=>{
  let r=set('infrastructure-care','inspect');assert(on(r,'drain-obstruction'));
  const opening=new THREE.Vector3(-3,-.8,0);
  for(const n of node(r,'route-formation').children.filter(n=>n.isMesh))assert(!new THREE.Box3().setFromObject(n).containsPoint(opening),'Formation fills the culvert opening');
  const boundary=pos(r,'route-work-boundary');
  r=set('infrastructure-care','work');assert(!on(r,'drain-obstruction'));assert(on(r,'drain-cleaning-equipment'));
  r=set('infrastructure-care','complete');assert(!on(r,'drain-cleaning-equipment'));assert(on(r,'open-follow-up'));assert(!on(r,'follow-up-drainage-check'));
  r=set('infrastructure-care','check');assert(on(r,'follow-up-drainage-check'));assert(!on(r,'open-follow-up'));assert(on(r,'bearing-observation'));assert(pos(r,'route-work-boundary').distanceTo(boundary)<1e-9);
});
check('Path loss, shared power loss and identity loss affect different real service connections',()=>{
  let r=set('dependencies','network-loss');assert(!on(r,'station-path-A'));assert(on(r,'station-path-B'));assert(!on(r,'power-supervision-path-A'));
  const field=pos(r,'station-field-interface');
  r=set('dependencies','power-loss');for(const name of ['station-path-A','station-path-B','power-supervision-path-A'])assert(!on(r,name));assert(on(r,'station-field-interface'));assert(on(r,'power-field-interface'));assert(pos(r,'station-field-interface').distanceTo(field)<1e-9);
  r=set('dependencies','identity-loss');assert(!on(r,'new-operator-request'));assert(on(r,'station-path-A'));assert(on(r,'station-path-B'));
});
check('A recording gap survives restored connectivity and separate evidence checks',()=>{
  let r=set('dependencies','record-loss');assert(!on(r,'recording-branch'));assert(on(r,'station-path-A'));assert(on(r,'historical-record-gap'));
  r=set('dependencies','restored');assert(on(r,'recording-branch'));assert(on(r,'configuration-unconfirmed'));assert(!on(r,'separate-restoration-checks'));assert(on(r,'historical-record-gap'));
  r=set('dependencies','checked');assert(!on(r,'configuration-unconfirmed'));assert(on(r,'separate-restoration-checks'));assert(on(r,'historical-record-gap'));
});
check('A lift outage interrupts the selected route and a separate lift supplies the alternative',()=>{
  let r=set('accessible-journey','outage');assert(!on(r,'near-step-free-route'));assert(!on(r,'alternate-step-free-route'));assert(on(r,'route-before-unavailable-lift'));assert(on(r,'stairs-retained'));assert(on(r,'help-information-path'));
  const failedCabin=pos(r,'near-lift-cabin');
  r=set('accessible-journey','alternative');assert(on(r,'alternate-step-free-route'));assert(!on(r,'near-step-free-route'));assert(on(r,'near-lift-outage'));assert(pos(r,'near-lift-cabin').distanceTo(failedCabin)<1e-9);assert(pos(r,'alternate-lift-cabin').y>3);
});
check('Boarding aid fills the actual platform-to-doorway gap and extends the route',()=>{
  let r=set('accessible-journey','aid-required');assert(on(r,'boarding-gap-marker'));assert(!on(r,'assisted-boarding-route'));assert(!on(r,'level-boarding-route'));
  const b=node(r,'access-boarding'),plate=b.getObjectByName('boarding-bridge-plate');assert(plate?.isMesh&&!visible(plate));
  r=set('accessible-journey','aid-placed');assert(visible(plate));assert(on(r,'assisted-boarding-route'));assert(!on(r,'boarding-gap-marker'));
  const p=new THREE.Box3().setFromObject(plate),door=node(r,'vehicle-doorway'),front=door.getWorldPosition(new THREE.Vector3()).z+.8;
  assert(p.max.z>=-2.75&&p.min.z<=front,'The plate does not bridge the gap');
  assert(Math.abs(p.max.y-3.45)<1e-8,'The plate is not aligned with the platform surface');
});
check('Configuration matching, test subject and issue disposition change separately',()=>{
  let r=set('change-evidence','installed');assert(on(r,'baseline-version-A'));assert(on(r,'test-subject-A'));assert(!on(r,'reviewed-decision'));const equipment=pos(r,'installed-version-B');
  r=set('change-evidence','baseline');assert(on(r,'baseline-version-B'));assert(on(r,'test-subject-A'));assert(!on(r,'two-channel-test-evidence'));
  r=set('change-evidence','tested');assert(on(r,'test-subject-B'));assert(on(r,'two-channel-test-evidence'));assert(!on(r,'issue-disposition-record'));assert(!on(r,'reviewed-decision'));
  r=set('change-evidence','reviewed');assert(on(r,'reviewed-decision'));assert(on(r,'issue-disposition-record'));assert(pos(r,'installed-version-B').distanceTo(equipment)<1e-9);
});
check('Narrative wrappers preserve specialist boundaries and explain the selected electrification profile',()=>{
  for(const [view,v]of Object.entries(studyViews))for(const variant of v.variants)for(const propulsion of ['lim','rotary'])for(const control of ['loop','radio','fixed','etcs1','etcs2']){
    const state={view,domain:v.domain,variant:variant.id,technology:{propulsion,control},scenario:'nominal',mode:'motoring'};
    const base=describeFlow(state);assert.deepEqual(technologyFlow(state,base),base,`${view}/${variant.id}: unrelated technology overwrote the explanation`);
    for(const choice of ELECTRIFICATION_CHOICES){
      const contextual=electrificationFlow({...state,electrification:choice.id},base);
      if(view!=='electrification')assert.deepEqual(contextual,base,`${view}: electrification overwrote an unrelated study`);
      else {
        assert(contextual.nodes.includes(choice.collection)&&contextual.nodes.includes(choice.returnPath),'The narrative retained a collection or return from another profile');
        assert(contextual.nodes.some(text=>text.includes(propulsion==='rotary'?'rotary motor':'LIM primary')),'The narrative contradicts the selected propulsion');
        assert.equal(contextual.nodes.some(text=>text.includes('Onboard transformer')),choice.supply==='AC','The narrative confuses overhead collection with AC conversion');
      }
    }
  }
});
console.log(`${passed} study checks passed.`);
