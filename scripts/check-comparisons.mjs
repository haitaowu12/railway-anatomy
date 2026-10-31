import assert from 'node:assert/strict';
import {VIEWS} from '../dist/model.js';
import {technologyControlsFor,placeModelLabels,animationFor} from '../dist/comparisons.js';

for(const id of Object.keys(VIEWS)) {
  const actual=technologyControlsFor(id);
  assert.equal(actual.propulsion,['vehicle','bogie','guideway'].includes(id),`${id}: drive comparison leaked into an unrelated study`);
  assert.equal(actual.control,id==='control',`${id}: control-architecture comparison leaked into an unrelated study`);
  for(const variant of VIEWS[id].variants||[{id:'default'}]) {
    const guide=animationFor(VIEWS[id],variant.id);if(!guide)continue;
    assert(guide.label&&guide.steps.length>=2,`${id}/${variant.id}: incomplete interaction guide`);
    let last=-1;
    for(const step of guide.steps){assert(step.at>=0&&step.at<=1&&step.at>last,`${id}/${variant.id}: invalid or unordered phase`);assert(step.label&&step.description);last=step.at;}
  }
}

for(const width of [320,375,700,1100])for(const height of [390,540,780]) {
  const points=Array.from({length:16},(_,i)=>({id:`part-${i}`,x:.48+(i%3)*.018,y:.48+Math.floor(i/3)*.012,width:90+(i%4)*20,height:26}));
  const result=placeModelLabels(points,{width,height,top:100,bottom:65,limit:6,gap:12});
  assert(result.length>0&&result.length<=6);
  assert.equal(result[0].id,'part-0','The highest-priority selected label must be retained');
  for(const p of result){assert(p.rect.left>=11.9&&p.rect.right<=width-11.9);assert(p.rect.top>=99.9&&p.rect.bottom<=height-64.9);}
  for(let i=0;i<result.length;i++)for(let j=i+1;j<result.length;j++) {
    const a=result[i].rect,b=result[j].rect;
    assert(a.right+12<b.left||a.left-12>b.right||a.bottom+12<b.top||a.top-12>b.bottom,'Measured labels overlap or lose their clear gap');
  }
}
console.log('PASS contextual comparisons, authored animation steps, and measured label clearance across 12 viewport sizes');
