#!/usr/bin/env node
import assert from 'node:assert/strict';
import {systemDiagram,DIAGRAM_VIEWS,dependencyState,journeyState} from '../dist/system-diagrams.js';
import {topologyMarkup} from '../dist/topology-ui.js';
import {VIEWS} from '../dist/model.js';
import {CONCEPTS,SOURCES} from '../dist/catalog.js';
import {ELECTRIFICATION_CHOICES} from '../dist/electrification.js';
const knownConcepts=new Set(CONCEPTS.map(c=>c.id)),knownSources=new Set(SOURCES.map(s=>s.id));
const failures=[];let passed=0;
function check(name,fn){try{fn();passed++;console.log(`PASS ${name}`);}catch(e){failures.push(name);console.error(`FAIL ${name}: ${e.message}`);}}
function validate(d,key){
  assert(d&&d.title&&d.description,`${key}: missing teaching context`);
  const ids=new Set(d.nodes.map(n=>n.id));assert.equal(ids.size,d.nodes.length,`${key}: repeated node`);
  for(const n of d.nodes){assert(knownConcepts.has(n.component),`${key}: unknown ${n.component}`);assert(n.label&&n.role&&n.location);if(n.status){assert(['available','unavailable','unknown'].includes(n.status));assert(n.statusLabel);}}
  for(const e of d.edges){assert(ids.has(e.from)&&ids.has(e.to),`${key}: unknown edge endpoint`);assert(e.label);if(e.direction)assert(['forward','both'].includes(e.direction));if(e.status)assert(e.statusLabel);}
  for(const id of d.sources||[])assert(knownSources.has(id),`${key}: unknown source ${id}`);
  const html=topologyMarkup(d,null);assert(!html.includes('undefined'));assert(!html.includes('NaN'));assert(!html.includes('Infinity'));
}

check('Every native system diagram and supply profile resolves real endpoints and sources',()=>{
  for(const view of DIAGRAM_VIEWS)for(const v of VIEWS[view].variants||[{id:'default'}])validate(systemDiagram({view,variant:v.id},VIEWS[view]),`${view}/${v.id}`);
  for(const p of ELECTRIFICATION_CHOICES)validate(systemDiagram({view:'electrification',electrification:p.id},VIEWS.electrification),`electrification/${p.id}`);
  validate(systemDiagram({view:'tunnel-ventilation',variant:'smoke-objective'},VIEWS['tunnel-ventilation']),'tunnel/smoke-objective');
});

check('Supply diagrams distinguish overhead contact and a fourth-rail return shoe',()=>{
  for(const p of ELECTRIFICATION_CHOICES){
    const d=systemDiagram({view:'electrification',electrification:p.id},VIEWS.electrification);
    if(p.id.startsWith('overhead')){assert(d.nodes.some(n=>n.component==='overhead-contact-wire'));assert(d.nodes.some(n=>n.component==='pantograph'));}
    else assert(d.nodes.some(n=>n.component==='collector-positive-shoe'));
    if(p.id==='fourth-rail-dc')assert(d.nodes.some(n=>n.component==='collector-return-shoe'));
    if(p.supply==='AC')assert.match(d.edges.find(e=>e.to==='return').label,/primary return; secondary circuit remains separate/);
  }
});

check('Automatic driving does not hide protection intervention behind a universal TCMS route',()=>{
  const d=systemDiagram({view:'control'},VIEWS.control);
  assert(d.edges.some(e=>e.from==='protection'&&e.to==='vehicle'));
  assert(d.edges.some(e=>e.from==='driving'&&e.to==='vehicle'));
  assert.match(d.nodes.find(n=>n.id==='vehicle').role,/TCMS allocation varies/);
  assert(d.sources.includes('CI13'));
  const c=systemDiagram({view:'communications'},VIEWS.communications);
  assert(!c.edges.some(e=>['radio','train'].includes(e.from)&&['network','vehicle','passenger'].includes(e.to)),'No undeclared convergence of train-control and service networks');
});

check('Loss of path A changes power requests while retaining the declared station alternative',()=>{
  const s=dependencyState('network-loss');assert.equal(s.stationLive,true);assert.equal(s.powerLive,false);assert.equal(s.stationRequests,true);assert.equal(s.powerRequests,false);
  assert(!dependencyState('normal').rows.some(row=>row[2].includes('failed path A')),'A normal case must not describe an active failed path');
  assert.match(s.rows.find(row=>row[0]==='Historical record')[1],/No earlier gap modeled/);
  const d=systemDiagram({view:'dependencies',variant:'network-loss'},VIEWS.dependencies);
  assert.equal(d.nodes.find(n=>n.id==='a').status,'unavailable');assert.equal(d.nodes.find(n=>n.id==='b').status,'available');
  assert.equal(d.edges.find(e=>e.from==='a'&&e.to==='powerapp').status,'unavailable');
  assert(!d.edges.some(e=>e.from==='b'&&e.to==='powerapp'));
  assert.equal(d.edges.find(e=>e.from==='powerapp'&&e.to==='record').status,'unavailable','An available recorder cannot make an unavailable source current');
  assert.equal(d.edges.find(e=>e.from==='station'&&e.to==='record').status,'available');
});

check('Common supply, identity, configuration and recording are separate failure claims',()=>{
  const supply=dependencyState('power-loss');assert(!supply.stationLive&&!supply.powerLive&&!supply.stationRequests&&!supply.powerRequests);
  const identity=dependencyState('identity-loss');assert(identity.stationLive&&identity.powerLive);assert(!identity.stationRequests&&!identity.powerRequests);
  const recording=dependencyState('record-loss');assert(recording.stationLive&&recording.powerLive);assert(!recording.recorder&&recording.historyGap);
  const restored=dependencyState('restored'),checked=dependencyState('checked');assert(!restored.configuration&&checked.configuration);assert(restored.historyGap&&checked.historyGap);
});

check('Lift outage and a boarding gap visibly break different journey interfaces',()=>{
  const outage=journeyState('outage'),aid=journeyState('aid-required'),alternate=journeyState('alternative');
  assert(!outage.platform&&!outage.boarding);assert(aid.platform&&!aid.boarding);assert(!alternate.mainLift&&alternate.alternate&&alternate.platform&&alternate.boarding);
  const d=variant=>systemDiagram({view:'accessible-journey',variant},VIEWS['accessible-journey']);
  assert.equal(d('outage').edges.find(e=>e.from==='near'&&e.to==='platform').status,'unavailable');
  assert.equal(d('outage').edges.find(e=>e.from==='alternate'&&e.to==='platform').status,'unknown');
  assert.equal(d('alternative').edges.find(e=>e.from==='alternate'&&e.to==='platform').status,'available');
  assert.equal(d('aid-required').edges.find(e=>e.from==='platform'&&e.to==='boarding').status,'unavailable');
  assert.equal(d('aid-placed').edges.find(e=>e.from==='platform'&&e.to==='boarding').status,'available');
});

check('Case status is conveyed by text and symbol as well as node/path styling',()=>{
  const d=systemDiagram({view:'dependencies',variant:'network-loss'},VIEWS.dependencies),html=topologyMarkup(d,null);
  assert(html.includes('class="topology-status-legend"'));assert(html.includes('Path lost'));assert(html.includes('is-unavailable'));assert(html.includes('path-state-symbol'));assert(html.includes('×'));
  assert.match(html,/aria-label="Inspect Network path A — Path lost"/);
  const plain=topologyMarkup(systemDiagram({view:'control'},VIEWS.control),null);
  assert(!plain.includes('topology-status-legend'),'Unannotated existing graphs must not acquire invented availability');
});

check('A lost OCC task picture does not remove the selected application or recording branch',()=>{
  const d=systemDiagram({view:'occ-equipment',variant:'display-loss'},VIEWS['occ-equipment']);
  assert.equal(d.nodes.find(n=>n.id==='display').status,'unavailable');assert.equal(d.nodes.find(n=>n.id==='record').status,'available');
  assert.equal(d.edges.find(e=>e.to==='display').status,'unavailable');assert.equal(d.edges.find(e=>e.to==='record').status,'available');
  const alternate=systemDiagram({view:'occ-equipment',variant:'alternate'},VIEWS['occ-equipment']);
  assert.equal(alternate.nodes.find(n=>n.id==='alternate').status,'available');assert.equal(alternate.nodes.find(n=>n.id==='service').status,'unknown');
  assert.match(alternate.rows[0][2],/no failover detection/);
});

console.log(`\n${passed} system-diagram checks passed; ${failures.length} failed.`);
if(failures.length)process.exitCode=1;
