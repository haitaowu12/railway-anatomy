import assert from 'node:assert/strict';
import {pointMachineState, pointIndicationDiagram} from '../dist/point-machine.js';

const start=pointMachineState(0);
assert.equal(start.movement,0);
assert.equal(start.lock,1);
assert.equal(start.proof,false,'An initial-end lock must not prove the requested end');
const moving=pointMachineState(.45);
assert(Math.abs(moving.movement-.5)<1e-12);
assert.equal(moving.lock,0);
assert.equal(moving.proof,false);
assert.equal(pointMachineState(.72).movement,1);
assert.equal(pointMachineState(.72).lock,0,'Arrival and locking are distinct stages');
const locked=pointMachineState(.9);
assert.equal(locked.lock,1);
assert.equal(locked.proof,false,'The lock stage must remain visible before the returned indication');
const complete=pointMachineState(1);
assert.equal(complete.proof,true);
assert.equal(complete.movement,1);
assert.equal(complete.lock,1);
const stopped=pointMachineState(1,'unproved');
assert.equal(stopped.movement,.52);
assert.equal(stopped.lock,0);
assert.equal(stopped.proof,false);
assert.deepEqual(pointMachineState(9,'unproved'),stopped,'A stopped throw must not keep moving');
for(const variant of ['proved','unproved'])for(const phase of [0,.15,.45,.72,.76,.86,.9,.95,.96,1]){
  const current=pointMachineState(phase,variant);
  if(current.proof){assert.equal(current.movement,1);assert.equal(current.lock,1);}
  if(variant==='unproved')assert.equal(current.proof,false);
}
for(const variant of ['proved','unproved']){
  const diagram=pointIndicationDiagram(variant);
  const ids=new Set(diagram.nodes.map(n=>n.id));
  for(const edge of diagram.edges)assert(ids.has(edge.from)&&ids.has(edge.to));
  const returned=diagram.edges.find(e=>e.from==='detector'&&e.to==='logic');
  assert.equal(returned.status,variant==='proved'?'available':'unavailable');
  const output=diagram.nodes.find(n=>n.id==='output');
  assert.equal(output.status,variant==='proved'?'unknown':'unavailable','Point indication alone must not complete all route conditions');
}
console.log('PASS point-machine stages: movement, locking, returned proof and incomplete travel; indication path preserves other route conditions');
