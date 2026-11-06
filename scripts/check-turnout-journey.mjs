import assert from 'node:assert/strict';
import {studyHarness,THREE,visible} from './study-harness.mjs';
import {buildTrackView} from '../dist/track-models.js';
import {turnoutGuide,turnoutPosition,turnoutState,CROSSING_X,CROSSING_PARAMETER} from '../dist/turnout-journey.js';
import {viewerHarness} from './viewer-test-harness.mjs';
const h=await studyHarness();buildTrackView('turnout',h.api);
const record=h.models.get('turnout');record.root.visible=true;
const update=(route,phase,detail=false)=>{
  record.animators.forEach(f=>f({variant:route,phase:phase*5,turnoutDetail:detail,signals:true,exploded:0,cutaway:true,technology:{propulsion:'lim',control:'loop'}}));
  record.root.updateWorldMatrix(true,true);
};
const running=[];
for(const id of ['track-stock-rail','track-switch-rail','track-closure-rail','track-frog'])for(const root of record.parts.get(id)||[])root.traverse(n=>{if(n.isMesh)running.push(n);});
const train=record.root.getObjectByName('turnout-running-wheelset');
const wheels=train.children.filter(n=>n.name==='wheel');assert.equal(wheels.length,2);
const ray=new THREE.Raycaster();
for(const route of ['straight','diverging'])for(const detail of [false,true]){
  const guide=turnoutGuide(route,detail);assert.equal(guide.steps[0].at,0);assert.equal(guide.steps.at(-1).at,1);
  assert(guide.steps.every((s,i)=>!i||s.at>guide.steps[i-1].at));
  for(let i=0;i<=40;i++){
    const phase=i/40;update(route,phase,detail);
    const activeRails=running.filter(visible);
    for(const [side,wheel] of wheels.entries()){
      const at=wheel.getWorldPosition(new THREE.Vector3());
      let support=false;
      // The tread extends outward from the flange. Sample its actual width;
      // a flange passage need not lie beneath the tread's centre line.
      const sign=side?1:-1;
      for(let j=0;j<=24;j++){
        const offset=sign*.04-.12+j*.24/24;
        const local=new THREE.Vector3(0,0,offset).applyQuaternion(train.getWorldQuaternion(new THREE.Quaternion()));
        ray.set(new THREE.Vector3(at.x+local.x,2,at.z+local.z),new THREE.Vector3(0,-1,0));
        if(ray.intersectObjects(activeRails,false).some(hit=>Math.abs(hit.point.y-1.023)<.018)){support=true;break;}
      }
      assert(support,`${route}/${detail?'crossing':'whole'} at ${phase}: wheel ${side} has no rail-head support within its tread`);
      if(side===(route==='straight'?1:0)&&Math.abs(at.x-CROSSING_X)<.35){
        for(const face of [-.012,0,.012]){
          const local=new THREE.Vector3(0,0,-sign*.09+face).applyQuaternion(train.getWorldQuaternion(new THREE.Quaternion()));
          ray.set(new THREE.Vector3(at.x+local.x,1.024,at.z+local.z),new THREE.Vector3(0,-1,0));
          assert(!ray.intersectObjects(activeRails,false).some(hit=>hit.point.y>1.023-.044),`${route}: a rail head obstructs the crossing wheel flange`);
        }
      }

    }
  }
  const cross=route==='straight'?CROSSING_X:CROSSING_PARAMETER;
  const phase=(cross-(detail?cross-1.25:-5.7))/((detail?cross+1.5:5.7)-(detail?cross-1.25:-5.7));
  update(route,phase,detail);
  const checkRails=record.parts.get('track-check-rail').filter(visible);assert.equal(checkRails.length,2);
  const branches=[];for(const rail of checkRails)rail.traverse(n=>{if(n.isMesh)branches.push(n);});
  const checkedWheel=wheels[route==='straight'?0:1];
  const wheelAt=checkedWheel.getWorldPosition(new THREE.Vector3());
  const near=branches.some(n=>new THREE.Box3().setFromObject(n).distanceToPoint(new THREE.Vector3(wheelAt.x,1,wheelAt.z))<.25);
  assert(near,`${route}: the opposite wheel has no check rail`);
}
assert(turnoutPosition(1,'diverging').distance>turnoutPosition(1,'straight').distance,'Curve travel must use arc length rather than x alone');
assert.equal(turnoutState(0,'straight').blades,'A · locked');assert.equal(turnoutState(1,'diverging').blades,'B · locked');
console.log('PASS Both routes retain two supported wheel treads, an opposite check rail, ordered stages and matching locked settings');
const vh=await viewerHarness(),v=vh.viewer;v.setView('turnout');v.setVariant('diverging');v.setTurnoutDetail(true);v.setPhase(2.5);v.frameTurnout(true);vh.draw();
for(const wheel of vh.root().getObjectByName('turnout-running-wheelset').children.filter(n=>n.name==='wheel')){
 const p=wheel.getWorldPosition(new THREE.Vector3()).project(vh.renderer.camera);assert(Math.abs(p.x)<.95&&Math.abs(p.y)<.95,'Crossing framing cropped one of the paired wheels');
}
v.dispose();console.log('PASS Crossing close-up retains both wheels in the actual viewer camera');

// A real cross-page defect used to capture the origin after changing page,
// and the role view offered no way back to the process stage.
import {readFile} from 'node:fs/promises';
import {routeState} from '../dist/navigation.js';
import {PROCESS_VIEWS} from '../dist/process-data.js';
const app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
const between=(a,b)=>app.slice(app.indexOf(a),app.indexOf(b,app.indexOf(a)));
const navigation=new Function('routeState','PROCESS_VIEWS',`
 let state={page:'learn',lesson:31,domain:'track',view:'turnout',component:'track-wheelset',variant:'diverging',turnoutPhase:.73,turnoutDetail:true,technology:{propulsion:'lim',control:'loop'},processId:'configuration-change'},returnContext=null,configurationEffect='',lastExplorationContext='';
 const $=()=>({setAttribute(){},focus(){},scrollIntoView(){}}),requestAnimationFrame=f=>f(),render=()=>{},announce=()=>{},routeLabel=()=>'',viewer=null;
 const processFor=()=>null,openInterfaces=()=>{},setDomain=()=>{},applyLesson=()=>{},isProcessPage=()=>['people','processes'].includes(state.page);
 ${between('function returnToContext(){','function activeDomain(){')}
 ${between('function openProcess(','function renderSystemContext(){')}
 ${between('function setPage(','function setDomain(')}
 return {setPage,openPeople,returnToContext,step(id){state.processStep=id;},snapshot(){return structuredClone({state,returnContext});}};
`)(routeState,PROCESS_VIEWS);
navigation.setPage('processes');
assert.equal(navigation.snapshot().returnContext.view,'turnout');assert.equal(navigation.snapshot().returnContext.page,'learn');
navigation.step('verify');navigation.openPeople('traffic-coordinator');
assert.equal(navigation.snapshot().returnContext.processStep,'verify');
navigation.returnToContext();assert.equal(navigation.snapshot().state.page,'processes');assert.equal(navigation.snapshot().state.processStep,'verify');
navigation.returnToContext();const restored=navigation.snapshot().state;
assert.equal(restored.page,'learn');assert.equal(restored.turnoutPhase,.73);assert.equal(restored.turnoutDetail,true);assert.equal(restored.variant,'diverging');
console.log('PASS Process and role returns preserve the originating turnout route, close-up and stage');
