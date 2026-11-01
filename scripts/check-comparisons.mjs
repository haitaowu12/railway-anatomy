import assert from 'node:assert/strict';
import {VIEWS} from '../dist/model.js';
import {technologyControlsFor,animationFor} from '../dist/comparisons.js';

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

console.log('PASS contextual comparisons and ordered authored animation stages');
