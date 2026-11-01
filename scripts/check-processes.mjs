#!/usr/bin/env node
// Data/relationship checks for the public 2D learning interface. No procedural
// state machine is run: this suite cannot approve a change or authorize work.
import assert from 'node:assert/strict';
import {CONCEPTS,SOURCES} from '../dist/catalog.js';
import {VIEWS} from '../dist/model.js';
import {PUBLIC_PROCESS_SOURCES,PROCESS_VIEWS,PEOPLE_ROLES,GOA_COMPARISON,TRAIN_CONTROL_TAXONOMY,PROCESS_READING_GUIDES} from '../dist/process-data.js';

const concepts=new Set(CONCEPTS.map(c=>c.id));
const sources=new Set([...SOURCES,...PUBLIC_PROCESS_SOURCES].map(s=>s.id));
const roles=new Map(PEOPLE_ROLES.map(r=>[r.id,r]));
const nonempty=(value,where)=>assert(typeof value==='string'&&value.trim(),`Missing text: ${where}`);
function refs(items,known,where){assert(Array.isArray(items)&&items.length,`No references: ${where}`);for(const id of items)assert(known.has(id),`${where}: unknown ${id}`);}
const checks=[];
function check(name,fn){try{fn();console.log(`PASS ${name}`);checks.push(true);}catch(error){console.error(`FAIL ${name}: ${error.message}`);checks.push(false);}}

function graphProblems(process){
 const errors=[],nodes=new Set(process.steps.map(s=>s.id)),order=new Map(process.steps.map((s,i)=>[s.id,i]));
 if(nodes.size!==process.steps.length)errors.push('duplicate step identity');
 const adjacency=new Map([...nodes].map(id=>[id,[]]));
 const edgeKeys=new Set();
 for(const e of process.edges){
  if(!nodes.has(e.from)||!nodes.has(e.to)){errors.push('edge endpoint absent');continue;}
  if(e.from===e.to)errors.push('self-loop obscures the return question');
  const key=`${e.from}:${e.to}`;if(edgeKeys.has(key))errors.push('duplicate relationship');edgeKeys.add(key);
  if(!['handoff','conditional','rework','parallel'].includes(e.kind))errors.push('unrecognized relationship kind');
  if(!e.label?.trim())errors.push('unlabelled relationship');
  if(order.get(e.to)<order.get(e.from)&&e.kind!=='rework')errors.push('backward relationship lacks rework meaning');
  if(e.kind!=='rework')adjacency.get(e.from).push(e.to);
 }
 const seen=new Set(),queue=[process.steps[0]?.id];while(queue.length){const id=queue.shift();if(seen.has(id)||!nodes.has(id))continue;seen.add(id);queue.push(...adjacency.get(id));}
 if(seen.size!==nodes.size)errors.push('a step is unreachable without rework');
 for(const b of process.branches){
  if(!nodes.has(b.from)||!nodes.has(b.to))errors.push('branch endpoint absent');
  if(!b.when?.trim()||!b.outcome?.trim())errors.push('branch hides its condition or consequence');
  for(const target of [b.to,...(b.also||[])])if(!edgeKeys.has(`${b.from}:${target}`))errors.push('branch prose and diagram disagree');
 }
 return [...new Set(errors)];
}

check('Processes and people resolve to actual public evidence and component identities',()=>{
 assert.equal(roles.size,PEOPLE_ROLES.length,'Repeated role identity');
 for(const r of PEOPLE_ROLES){
  for(const key of ['id','label','area','summary','boundary'])nonempty(r[key],`${r.id}.${key}`);
  for(const key of ['responsibilities','receives','produces']){assert(r[key]?.length,`${r.id}: empty ${key}`);r[key].forEach(v=>nonempty(v,`${r.id}.${key}`));}
  refs(r.links,concepts,r.id);refs(r.sources,sources,r.id);
 }
 for(const [id,p]of Object.entries(PROCESS_VIEWS)){
  assert.equal(p.id,id);for(const key of ['title','summary','question','introduction','limits'])nonempty(p[key],`${id}.${key}`);
  refs(p.sources,sources,id);refs(p.links,concepts,id);assert(p.steps.length>=2,`${id}: no useful process`);
  for(const s of p.steps){
   assert(roles.has(s.owner),`${id}/${s.id}: owner is not a defined role`);
   for(const actor of s.participants)assert(roles.has(actor),`${id}/${s.id}: unknown participant ${actor}`);
   for(const key of ['title','action','check'])nonempty(s[key],`${id}/${s.id}.${key}`);
   for(const key of ['inputs','outputs']){assert(s[key]?.length,`${id}/${s.id}: empty ${key}`);s[key].forEach(v=>nonempty(v,`${id}/${s.id}.${key}`));}
   refs(s.links,concepts,`${id}/${s.id}`);refs(s.sources,sources,`${id}/${s.id}`);
  }
 }
});

check('Every diagram preserves labelled handoffs and reachable rework branches',()=>{
 for(const p of Object.values(PROCESS_VIEWS))assert.deepEqual(graphProblems(p),[],`${p.id}: broken diagram`);
 // The checker must reject actual routing defects, not merely count authored
 // objects. These mutations reproduce the failures that a renderer would hide.
 const base=PROCESS_VIEWS['configuration-change'];
 const broken=structuredClone(base);broken.edges[0].to='missing-step';assert(graphProblems(broken).includes('edge endpoint absent'));
 const mislabeled=structuredClone(base);mislabeled.edges.find(e=>e.kind==='rework').kind='handoff';assert(graphProblems(mislabeled).includes('backward relationship lacks rework meaning'));
 const detached=structuredClone(base);detached.edges=detached.edges.filter(e=>e.to!=='verify');assert(graphProblems(detached).includes('a step is unreachable without rework'));
});

check('Coordination retains parallel responsibilities instead of a false serialized response',()=>{
 const p=PROCESS_VIEWS['incident-coordination'],parallel=p.edges.filter(e=>e.kind==='parallel');
 assert(parallel.length>=2,'No genuine parallel interface');assert.equal(new Set(parallel.map(e=>e.from)).size,1,'Parallel paths do not share the assessment');
 const branches=new Set(parallel.map(e=>e.to));assert.equal(branches.size,parallel.length,'Parallel paths repeat one recipient');
 const ownerKinds=new Set(p.steps.filter(s=>branches.has(s.id)).map(s=>s.owner));assert(ownerKinds.size>1,'Parallel responsibilities collapse to one owner');
 const sharedReturn=new Map();for(const e of p.edges)if(branches.has(e.from))sharedReturn.set(e.to,(sharedReturn.get(e.to)||0)+1);
 assert([...sharedReturn.values()].some(n=>n===branches.size),'Separate updates do not reunite in a review');
 assert(p.edges.some(e=>e.kind==='rework'&&sharedReturn.has(e.from)),'Review loses the continuing assessment loop');
});

check(`Process outputs distinguish ${Object.keys(PROCESS_VIEWS).length} boundaries and grant no operational authority`,()=>{
 const outcomes=Object.values(PROCESS_VIEWS).map(p=>p.outcome);
 assert.equal(new Set(outcomes.map(o=>o.kind)).size,outcomes.length,'Different processes collapse to one outcome');
 const forbidden=new Set(['movement-authority','electrical-isolation','incident-resolution','automatic-control-transfer']);
 for(const p of Object.values(PROCESS_VIEWS)){
  nonempty(p.outcome.label,p.id);assert(!forbidden.has(p.outcome.kind),`${p.id}: diagram grants an operational state`);
  assert(p.outcome.doesNotGrant?.length,`${p.id}: no boundary explanation`);
  assert(p.branches.length&&p.edges.some(e=>e.kind==='rework'),`${p.id}: unresolved matters disappear`);
 }
 const handover=PROCESS_VIEWS['duty-handover'];assert(new Set(handover.steps.map(s=>s.ownerContext).filter(Boolean)).size>=2,'Outgoing/incoming duty holders cannot be distinguished');
});

check('GoA distinguishes onboard operating allocation without inferring station staffing',()=>{
 assert.equal(new Set(GOA_COMPARISON.grades.map(g=>g.id)).size,GOA_COMPARISON.grades.length);
 for(const g of GOA_COMPARISON.grades){refs(g.sources,sources,g.id);assert.equal(g.stationStaffing,'not-determined');assert.equal(typeof g.requiresOnboardOperatingStaff,'boolean');}
 const g4=GOA_COMPARISON.grades.find(g=>g.id==='goa4');assert(g4);assert.equal(g4.requiresOnboardOperatingStaff,false);assert.equal(g4.onboardServiceStaff,'may-be-present');
 for(const duty of GOA_COMPARISON.continuingResponsibilities){refs(duty.roles,roles,duty.title);refs(duty.links,concepts,duty.title);refs(duty.sources,sources,duty.title);}
 assert(GOA_COMPARISON.continuingResponsibilities.some(d=>d.roles.includes('station-team')),'Passenger responsibilities disappear at GoA4');
 assert(GOA_COMPARISON.continuingResponsibilities.some(d=>d.roles.includes('maintenance-work')),'Field responsibilities disappear at GoA4');
});

check('Train-control routes separate families, functions, devices and current supplier examples',()=>{
 const t=TRAIN_CONTROL_TAXONOMY,families=new Set(t.families.map(f=>f.id));
 assert.equal(families.size,t.families.length);
 for(const f of t.families){assert.equal(f.parent,null,`${f.id}: peer architecture nested beneath another family`);refs(f.components,concepts,f.id);refs(f.sources,sources,f.id);for(const view of f.views)assert(VIEWS[view],`${f.id}: missing view ${view}`);}
 for(const f of t.functions){refs(f.families,families,f.id);refs(f.components,concepts,f.id);refs(f.sources,sources,f.id);nonempty(f.qualification,f.id);}
 for(const d of t.sharedDevices){assert(concepts.has(d.id),`${d.id}: shared device lost canonical identity`);refs(d.families,families,d.id);assert(d.families.length>1,`${d.id}: not a cross-family link`);refs(d.sources,sources,d.id);}
 for(const s of t.supplierExamples){assert(families.has(s.family));refs(s.components,concepts,s.id);refs(s.sources,sources,s.id);nonempty(s.scope,s.id);}
 assert.equal(t.rules.automationIsSeparate,true);assert.equal(t.rules.detectionIsShared,true);assert.equal(t.rules.supplierListIsExhaustive,false);
 const seltrac=t.supplierExamples.filter(s=>s.components.includes('seltrac'));assert.equal(seltrac.length,1,'Legacy and current names duplicate a supplier branch');assert.equal(seltrac[0].supplier,'Hitachi Rail');
});

check('Reading guides and new source records preserve public provenance and declared scope',()=>{
 const ids=new Set();for(const s of PUBLIC_PROCESS_SOURCES){assert(!ids.has(s.id),`Duplicate source ${s.id}`);ids.add(s.id);const url=new URL(s.url);assert.equal(url.protocol,'https:');assert(!url.username&&!url.password);for(const k of ['title','publisher','description','scope'])nonempty(s[k],`${s.id}.${k}`);}
 for(const g of PROCESS_READING_GUIDES){refs(g.sources,sources,g.id);assert(g.sections.length);for(const s of g.sections){nonempty(s.heading,g.id);nonempty(s.text,g.id);refs(s.sources,sources,`${g.id}/${s.heading}`);}}
});

const failed=checks.filter(x=>!x).length;console.log(`\n${checks.length-failed} process/people checks passed; ${failed} failed. Reviewed ${Object.keys(PROCESS_VIEWS).length} processes and ${Object.values(PROCESS_VIEWS).reduce((total,p)=>total+p.steps.length,0)} steps.`);
if(failed)process.exitCode=1;
