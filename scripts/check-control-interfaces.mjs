#!/usr/bin/env node
import assert from 'node:assert/strict';
import {CONTROL_DOMAINS,CONTROL_ARCHITECTURES,CONTROL_SCENARIOS,CONTROL_INTERFACE_SOURCES,CONTROL_INTERFACE_CONCEPTS,CROSS_SYSTEM_INTERFACES,CONTROL_PROJECT_EXAMPLES,normalizeControlState,connectionFor,connectionModesFor,evaluateControlInterface,getInterfaceContext} from '../dist/control-interfaces-data.js';
import {controlInterfacesMarkup,controlInterfaceDiagram} from '../dist/control-interfaces-ui.js';
import {SOURCES,CONCEPTS} from '../dist/catalog.js';
import {COMMUNICATION_TOPOLOGIES,COMMUNICATIONS_SCENE_PARTS} from '../dist/communications-data.js';
const failures=[];let passed=0;
function check(name,fn){try{fn();passed++;console.log(`PASS ${name}`);}catch(e){failures.push(name);console.error(`FAIL ${name}: ${e.message}`);}}
const knownSources=new Set(SOURCES.map(s=>s.id)),knownConcepts=new Set(CONCEPTS.map(c=>c.id));

check('All responsibility domains have real catalog endpoints and explicit information/control boundaries',()=>{
  assert.equal(new Set(CONTROL_DOMAINS.map(d=>d.id)).size,CONTROL_DOMAINS.length);
  for(const d of CONTROL_DOMAINS){
    for(const key of ['label','field','local','supervisor','role','localAction','feedback','boundary','loss','examplePoint','pointType','unit'])assert(d[key]?.trim(),`${d.id}/${key}`);
    assert(d.monitor.length>=2);assert(knownConcepts.has(d.component),`${d.id}: component ${d.component}`);
    d.components.forEach(id=>assert(knownConcepts.has(id),`${d.id}: unknown map ${id}`));
    d.sources.forEach(id=>assert(knownSources.has(id),`${d.id}: unknown evidence ${id}`));
  }
  for(const item of [...CONTROL_INTERFACE_CONCEPTS,...CROSS_SYSTEM_INTERFACES,...CONTROL_PROJECT_EXAMPLES])item.sources.forEach(id=>assert(knownSources.has(id),`${item.id||item.title}: ${id}`));
  for(const s of CONTROL_INTERFACE_SOURCES){assert.equal(SOURCES.filter(x=>x.id===s.id).length,1,`Source ID collision ${s.id}`);assert(/^https:\/\//.test(s.url));assert(s.scope&&s.description);}
  for(const e of CROSS_SYSTEM_INTERFACES){assert(CONTROL_DOMAINS.some(d=>d.id===e.from));assert(CONTROL_DOMAINS.some(d=>d.id===e.to));assert(e.example&&e.absent&&e.kind);}
});

check('Separate, shared-status and integrated patterns change actual interface capability',()=>{
  for(const d of CONTROL_DOMAINS){
    assert.equal(connectionFor({domain:d.id,architecture:'separate'}),'absent');
    assert.equal(connectionFor({domain:d.id,architecture:'summaries'}),'monitor');
    assert.equal(connectionFor({domain:d.id,architecture:'integrated'}),d.request?'supervisory':'monitor');
    const absent=evaluateControlInterface({domain:d.id,architecture:'integrated',connections:{[d.id]:'absent'}});
    assert.equal(absent.mode,'absent');assert.equal(absent.canRequest,false);
    assert.match(absent.steps[4].text,/No common supervisory interface/);
  }
});

check('Selected fire, PSD, signalling, voice and network summaries retain native control boundaries',()=>{
  for(const id of ['fire','platform','signalling','network','radio']){
    assert(!connectionModesFor(id).includes('supervisory'));
    const m=evaluateControlInterface({domain:id,architecture:'integrated',connections:{[id]:'supervisory'},trace:'request'});
    assert.equal(m.canRequest,false);assert.equal(m.mode,'monitor');
    for(const step of m.steps)assert(!/originates at the configured|accept.*complete/i.test(step.text));
    assert.match(m.steps[2].text,/No local action/);
  }
  const signalling=evaluateControlInterface({domain:'signalling'});
  assert(signalling.domain.nativeRequest,'ATS/signalling still has its own native request role');
  assert.match(controlInterfaceDiagram(signalling),/ci-edge-command/,'Monitoring-only station integration must not erase native/local functions');
});

check('Lost link, local authority and missing feedback give different conclusions',()=>{
  for(const d of CONTROL_DOMAINS.filter(d=>d.request)){
    const base={domain:d.id,architecture:'integrated',trace:'request'};
    const lost=evaluateControlInterface({...base,scenario:'link-loss'});
    assert.equal(lost.commandState,'Delivery unavailable');assert.match(lost.steps[2].text,/No local action/);assert.match(lost.steps[4].text,/unconfirmed/);
    const local=evaluateControlInterface({...base,scenario:'local-mode'});
    assert.equal(local.commandState,'Rejected in selected local mode');assert.match(local.steps[2].text,/rejected/);assert.match(local.steps[4].text,/monitoring can continue/);
    const missing=evaluateControlInterface({...base,scenario:'feedback-missing'});
    assert.equal(missing.commandState,'Outcome unconfirmed');assert.match(missing.steps[3].text,/does not establish/);assert.match(missing.steps[4].text,/Accepted does not mean completed/);
    assert.notEqual(lost.remoteQuality,local.remoteQuality);assert.notEqual(local.remoteQuality,missing.remoteQuality);
  }
});

check('An absent integration remains absent in every degraded scenario',()=>{
  for(const d of CONTROL_DOMAINS)for(const scenario of CONTROL_SCENARIOS){
    const m=evaluateControlInterface({domain:d.id,architecture:'separate',scenario:scenario.id,trace:'request'});
    assert.equal(m.commandState,'No common-display command interface');
    assert.match(m.steps[0].text,/No common-display interface/);
    assert.match(m.steps[2].text,/No local action/);
  }
});

check('Per-function custom allocations preserve all other functions and reject invalid external state',()=>{
  const custom={domain:'building',architecture:'integrated',connections:{building:'absent',tunnel:'monitor',fire:'supervisory',unknown:'monitor'}};
  assert.equal(connectionFor(custom,'building'),'absent');assert.equal(connectionFor(custom,'tunnel'),'monitor');assert.equal(connectionFor(custom,'traction'),'supervisory');assert.equal(connectionFor(custom,'fire'),'monitor');
  const s=normalizeControlState({domain:'x',architecture:'x',connections:['unsafe'],scenario:'x',step:-100});
  assert.equal(s.domain,'telecom');assert.equal(s.step,0);assert.deepEqual(s.connections,{});
  assert.equal(normalizeControlState({step:Infinity}).step,4);assert.equal(normalizeControlState({step:'no'}).step,0);
});

check('Every domain/pattern/condition produces a bounded five-stage explanation and usable markup',()=>{
  let states=0;
  for(const d of CONTROL_DOMAINS)for(const a of CONTROL_ARCHITECTURES)for(const scenario of CONTROL_SCENARIOS)for(const trace of ['indication','request']){
    const m=evaluateControlInterface({domain:d.id,architecture:a.id,scenario:scenario.id,trace,step:4});assert.equal(m.steps.length,5);assert.equal(m.active,m.steps[4]);assert(m.steps.every(step=>step.text&&step.label&&step.actor));
    const html=controlInterfacesMarkup(m.state);assert(!html.includes('undefined'));assert(!html.includes('NaN'));assert.equal((html.match(/id="ci-connection"/g)||[]).length,1);assert(html.includes('aria-live="polite"'));assert(html.includes('data-ci-inspect='));
    assert.equal((html.match(/data-ci-step="\d"/g)||[]).length,5);states++;
  }
  assert.equal(states,CONTROL_DOMAINS.length*3*4*2);
});

check('Context links select the appropriate functional owner instead of bundling BAS and ventilation',()=>{
  assert.equal(getInterfaceContext('bas-actuator').domain,'building');
  assert.equal(getInterfaceContext('tunnel-damper').domain,'tunnel');
  assert.equal(getInterfaceContext('tvcs-controller').domain,'tunnel');
  assert.equal(getInterfaceContext('fire-panel').domain,'fire');
  assert.equal(getInterfaceContext('station-smoke-controller').domain,'station-smoke');
  assert.equal(getInterfaceContext('tvcs-controller','station-networks','power').domain,'tunnel','A cross-system concept must override the originating page context');
  assert.equal(getInterfaceContext('station-lift').domain,'vertical');
  assert.equal(getInterfaceContext('operational-cab-radio').domain,'radio');
  assert.equal(getInterfaceContext(null,'communications-security','video').domain,'security');
  assert.equal(getInterfaceContext(null,'station-networks','power').domain,'traction');
});

check('Legacy I/O lesson identifies a building actuator and preserves an intervening local controller',()=>{
  for(const variant of ['status','command','stale']){
    const key=`communications-scada/${variant}`,t=COMMUNICATION_TOPOLOGIES[key];
    assert(t.nodes.some(n=>n.id==='local-control'&&n.component==='local-plant-controller'));
    assert(t.edges.some(e=>e.from==='output'&&e.to==='local-control'));
    assert(!t.edges.some(e=>e.from==='output'&&e.to==='plant'));
    assert(!COMMUNICATIONS_SCENE_PARTS[key].includes('tunnel-damper'));
    assert(COMMUNICATIONS_SCENE_PARTS[key].includes('bas-actuator'));
  }
});


check('Communications equipment SCADA has explicit optional request capabilities and source scope',()=>{
 const domain=CONTROL_DOMAINS.find(d=>d.id==='telecom');assert(domain);assert.match(domain.supervisor,/telecom SCADA/);assert(domain.sources.includes('OC10'));assert(domain.sources.includes('OC11'));assert(domain.sources.includes('OC14'));assert.match(domain.boundary,/NMS/);assert.match(domain.boundary,/mandatory/);
 for(const id of ['telecom','security','passenger']){assert(connectionModesFor(id).includes('supervisory'));const enabled=evaluateControlInterface({domain:id,architecture:'integrated',trace:'request'});assert(enabled.canRequest);assert.match(enabled.steps[0].text,/configured common interface/);const disabled=evaluateControlInterface({domain:id,architecture:'summaries',trace:'request'});assert.equal(disabled.canRequest,false);assert.match(disabled.steps[1].text,/No request is sent/);}
 assert.equal(getInterfaceContext('telecom-scada').domain,'telecom');assert.deepEqual(getInterfaceContext('unrecognised-asset','unrelated-view'),{});assert.notEqual(getInterfaceContext('scada-rtu','communications-scada').domain,'traction','Generic field acquisition must not silently become traction SCADA');
});
if(failures.length)process.exitCode=1;
console.log(`\n${passed} control-interface checks passed; ${failures.length} failed.`);
if(failures.length)process.exitCode=1;
