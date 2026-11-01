import assert from 'node:assert/strict';
import {phaseFraction,advancePlayback,placeModelPins,motionStep} from '../dist/interaction-state.js';
import {electricalState} from '../dist/electrical-explainers.js';
import {VIEWS} from '../dist/model.js';
import {animationFor,canAnimate} from '../dist/comparisons.js';

// A manual final frame and a completed timed run must land on the same authored
// endpoint, including when a browser delivers a frame beyond the endpoint.
let playback={phase:0,playing:true};
for(let i=0;i<242&&playback.playing;i++)playback=advancePlayback(playback.phase,.05,{duration:12});
assert.deepEqual(playback,{phase:5,playing:false});
assert.equal(phaseFraction(playback.phase),1);
assert.deepEqual(advancePlayback(4.95,.2,{duration:10}),{phase:5,playing:false});
assert(Math.abs(advancePlayback(4.95,.2,{duration:10,loop:true}).phase-.05)<1e-8);
assert.equal(phaseFraction(-1),0);assert.equal(phaseFraction(50),1);

let animated=0;
for(const [view,config]of Object.entries(VIEWS))for(const variant of config.variants||[{id:'default'}]){
  if(variant.presentation==='process'||!canAnimate(config,variant.id))continue;
  const guide=animationFor(config,variant.id);
  assert(guide?.steps?.length>=2,`${view}/${variant.id} exposes playback without an explanation`);
  assert.equal(motionStep(guide.steps,1),guide.steps.length-1,'The end of a sequence returned to its first caption');animated++;
}

// Dense equipment anchors must not produce overlapping badges, long leaders,
// labels clamped to a viewport edge, or a pin showing through an occluder.
for(const width of [320,375,768,1100]){
  const points=[{id:'selection',x:.5,y:.5},...Array.from({length:20},(_,i)=>({id:`part-${i}`,x:.49+i*.002,y:.5})),{id:'outside',x:1.1,y:.3},{id:'behind',x:.2,y:.3,occluded:true}];
  const pins=placeModelPins(points,{width,height:450});
  assert.equal(pins[0].id,'selection');assert.equal(pins.length,1);
  assert.equal(pins[0].x,width*.5);assert.equal(pins[0].y,225);
}

// Faraday's relation: winding voltage follows d(flux)/dt, with a quarter-cycle
// separation between peak flux and peak voltage. The chosen turns ratio is2:1.
for(const p of [.125,.25,.375,.5,.625,.75,.875]){
  const s=electricalState('power-transformer',p),h=1e-5;
  const derivative=(electricalState('power-transformer',p+h).flux-electricalState('power-transformer',p-h).flux)/(2*h*Math.PI*2);
  assert(Math.abs(derivative-s.primary)<1e-7);assert(Math.abs(s.secondary-s.primary/2)<1e-10);
}
assert.equal(electricalState('power-transformer',.25).primary,0);
assert.equal(electricalState('power-transformer',.25).flux,1);

// Six-pulse circuit invariant: a complete pair uses distinct phases; the load
// sees max(phase)-min(phase), stays positive and repeats every60 electrical degrees.
const pairs=new Set();let peaks=0,prior=0,increasing=false;
for(let i=0;i<=720;i++){
  const p=i/720,s=electricalState('power-rectifier',p),values=s.values.map(v=>v.value);
  pairs.add(s.high+s.low);assert.notEqual(s.high,s.low);assert(s.dc>.86&&s.dc<=1.00000001);
  assert(Math.abs(s.dc-(Math.max(...values)-Math.min(...values))/Math.sqrt(3))<1e-10);
  const up=s.dc>prior+1e-8;if(increasing&&!up)peaks++;increasing=up;prior=s.dc;
  if(p<=5/6)assert(Math.abs(s.dc-electricalState('power-rectifier',p+1/6).dc)<1e-7);
}
assert.equal(pairs.size,6);assert.equal(peaks,6);
console.log(`PASS interaction contracts: ${animated} explained animated states, finite/repeat playback, four crowded-pin viewports, transformer voltage/flux relation and six rectifier conducting intervals`);
