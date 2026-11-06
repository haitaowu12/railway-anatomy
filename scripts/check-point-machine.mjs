import assert from 'node:assert/strict';
import {pointMachineState, pointIndicationDiagram, pointCorrespondence} from '../dist/point-machine.js';

const start=pointMachineState(0);
assert.equal(start.movement,0);
assert.equal(start.lock,1);
assert.equal(start.proof,false);assert.equal(start.indication,'A');assert.equal(pointMachineState(.001).indication,'Neither','A indication must drop when unlocking begins');
const moving=pointMachineState(.45);
assert(Math.abs(moving.movement-.5)<1e-12);
assert.equal(moving.lock,0);
assert.equal(moving.proof,false);
assert.equal(pointMachineState(.72).movement,1);
assert.equal(pointMachineState(.72).lock,0,'Arrival and locking are distinct stages');
const locked=pointMachineState(.9);
assert.equal(locked.lock,1);
assert.equal(locked.proof,true,'Do not invent a separate delay after the lock and detection conditions are met');
const complete=pointMachineState(1);
assert.equal(complete.proof,true);
assert.equal(complete.movement,1);
assert.equal(complete.lock,1);
const stopped=pointMachineState(1,'unproved');
assert.equal(stopped.movement,.52);
assert.equal(stopped.lock,0);
assert.equal(stopped.proof,false);
assert.deepEqual(pointMachineState(9,'unproved'),stopped,'A stopped throw must not keep moving');
for(const variant of ['proved','unproved','detector-missing'])for(const phase of [0,.15,.45,.72,.76,.86,.9,.95,.96,1]){
  const current=pointMachineState(phase,variant);
  if(current.proof){assert.equal(current.movement,1);assert.equal(current.lock,1);}
  if(variant==='unproved')assert.equal(current.proof,false);
}
for(const variant of ['proved','unproved','detector-missing']){
  const diagram=pointIndicationDiagram(variant);
  const ids=new Set(diagram.nodes.map(n=>n.id));
  for(const edge of diagram.edges)assert(ids.has(edge.from)&&ids.has(edge.to));
  const returned=diagram.edges.find(e=>e.from==='detector'&&e.to==='logic');
  assert.equal(returned.status,variant==='proved'?'available':'unavailable');
  const output=diagram.nodes.find(n=>n.id==='output');
  assert.equal(output.status,variant==='proved'?'unknown':'unavailable','Point indication alone must not complete all route conditions');
}
console.log('PASS point-machine stages: movement, locking, returned proof and incomplete travel; indication path preserves other route conditions');

const missing=pointMachineState(1,'detector-missing');
assert.equal(missing.position,'End B');assert.equal(missing.lock,1);assert.equal(missing.indication,'Neither');
assert.equal(missing.near.closed,true);assert.equal(missing.far.open,true);assert.equal(missing.far.available,false);
for(const side of ['near','far'])for(const field of ['available','locked',side==='near'?'closed':'open']){
  const evidence=structuredClone({near:complete.near,far:complete.far});evidence[side][field]=false;
  assert.equal(pointCorrespondence(evidence),'Neither',`B indication survived missing ${side} ${field}`);
}
const inconsistent=structuredClone({near:complete.near,far:complete.far});inconsistent.near.open=true;
assert.equal(pointCorrespondence(inconsistent),'Neither','Contradictory blade inputs must not return an end indication');
