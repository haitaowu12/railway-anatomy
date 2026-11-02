#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SOURCES,CONCEPTS} from '../dist/catalog.js';
import {VIEWS,cutawayFor} from '../dist/model.js';
import {OCC_APPLICATIONS,OCC_APPLICATION_SOURCES,OCC_DEVICE_POINTS,normalizeOccState,evaluateOccPoint,occContextFor,occStateFromQuery,writeOccQuery,occExampleForDomain} from '../dist/occ-applications-data.js';
import {occApplicationsMarkup,createOccApplicationExplorer} from '../dist/occ-applications-ui.js';
import {getInterfaceContext} from '../dist/control-interfaces-data.js';
const knownSources=new Set(SOURCES.map(x=>x.id)),knownConcepts=new Set(CONCEPTS.map(x=>x.id));
let passed=0;const failures=[];
function check(name,fn){try{fn();passed++;console.log(`PASS ${name}`);}catch(e){failures.push(name);console.error(`FAIL ${name}: ${e.message}`);}}

check('OCC applications use named, sourced, distinct device and service interfaces',()=>{
 assert.equal(new Set(OCC_APPLICATIONS.map(a=>a.id)).size,OCC_APPLICATIONS.length);assert.equal(new Set(OCC_DEVICE_POINTS.map(p=>p.id)).size,OCC_DEVICE_POINTS.length);
 for(const a of OCC_APPLICATIONS){assert(knownConcepts.has(a.component),a.component);assert(a.description&&a.boundary&&a.points.length);a.sources.forEach(id=>assert(knownSources.has(id),id));for(const id of a.points)assert.equal(OCC_DEVICE_POINTS.find(p=>p.id===id)?.app,a.id);}
 for(const p of OCC_DEVICE_POINTS){assert(knownConcepts.has(p.component),p.id);for(const key of ['asset','site','source','native','normal','fault','acquisition','payload','evidence','quality'])assert(p[key],p.id+'/'+key);p.sources.forEach(id=>assert(knownSources.has(id),p.id+'/'+id));}
 for(const s of OCC_APPLICATION_SOURCES){assert.equal(SOURCES.filter(x=>x.id===s.id).length,1);assert(/^https:\/\//.test(s.url));assert(s.scope&&s.description);}
 assert.equal(occExampleForDomain('tunnel').point,'tunnel-fan');assert.equal(occExampleForDomain('fire'),null,'An uncovered responsibility must not point to an unrelated fan');
 assert.equal(getInterfaceContext('telecom-scada').domain,'telecom');assert.equal(getInterfaceContext('tunnel-fan').domain,'tunnel');assert.equal(getInterfaceContext('hvac-air-handler').domain,'building');assert.deepEqual(getInterfaceContext('unrelated-part'),{});
 const telecom=OCC_APPLICATIONS.find(a=>a.id==='telecom');assert(telecom.sources.includes('OC10')&&telecom.sources.includes('OC11')&&telecom.sources.includes('OC14'));
});

check('Telecom SCADA is a named optional application, separate from native managers and service payloads',()=>{
 for(const id of ['pa-health','camera-health','radio-site']){
  const native=evaluateOccPoint({app:'telecom',point:id,integration:'native',trace:'request'}),monitor=evaluateOccPoint({app:'telecom',point:id,integration:'monitor',trace:'request'}),control=evaluateOccPoint({app:'telecom',point:id,integration:'control',trace:'request'});
  assert.equal(native.requestEnabled,false);assert.match(native.supervisor,/No telecom SCADA interface/);assert.match(native.displayValue,/Not shared/);assert.match(native.steps[0].text,/No telecom SCADA interface/);
  assert.equal(monitor.supervisor,'Communications SCADA');assert.equal(monitor.requestEnabled,false);assert.match(monitor.steps[1].text,/No command leaves/);
  assert.equal(control.requestEnabled,true);assert.match(control.steps[0].text,/configured|Configured/);
  const nms=evaluateOccPoint({...control.state,acquisition:'nms'});assert.match(nms.acquisition,/NMS/);assert.equal(nms.supervisor,'Communications SCADA');assert.notEqual(nms.acquisition,control.acquisition);
  const html=occApplicationsMarkup(native.state);assert.match(html,/No telecom SCADA link/);assert.match(html,/occ-no-integration/);assert.match(html,/Service payload/);assert.match(html,/Condition monitoring/);
 }
});

check('Loss, refusal and missing feedback cannot be mistaken for device recovery',()=>{
 for(const p of OCC_DEVICE_POINTS.filter(p=>p.request&&p.sharedRequest!==false)){
  const base={app:p.app,point:p.id,integration:'control',trace:'request',step:4};
  const lost=evaluateOccPoint({...base,condition:'link-loss'});assert.match(lost.quality,/Stale/);assert.match(lost.requestStatus,/unconfirmed/);assert.match(lost.steps[2].text,/No endpoint action/);assert.match(lost.steps[4].text,/unconfirmed delivery/);
  const local=evaluateOccPoint({...base,condition:'local'});assert.match(local.requestStatus,/rejected/);assert.match(local.steps[2].text,/rejects/);assert.match(local.steps[3].text,/does not infer a changed/);
  const missing=evaluateOccPoint({...base,condition:'feedback-missing'});assert.match(missing.requestStatus,/Outcome unconfirmed/);assert.match(missing.steps[3].text,/may have been accepted/);assert.match(missing.steps[4].text,/unconfirmed outcome/);
  assert.notEqual(lost.requestStatus,local.requestStatus);assert.notEqual(local.requestStatus,missing.requestStatus);
 }
});

check('An indication-only point cannot become a command by editing a URL',()=>{
 for(const p of OCC_DEVICE_POINTS.filter(p=>!p.request)){
  for(const integration of ['native','monitor','control']){const m=evaluateOccPoint({app:p.app,point:p.id,integration,trace:'request'});assert.equal(m.requestEnabled,false);assert.notEqual(m.state.integration,'control');assert.match(m.steps[0].text,/No command/);}
 }
 const radio=evaluateOccPoint({app:'radio',point:'radio-call',integration:'control',trace:'request'});assert.equal(radio.requestEnabled,false,'A native voice capability does not establish a common integration');assert.equal(evaluateOccPoint({app:'radio',point:'radio-call',integration:'native'}).requestEnabled,true);
 const malformed=normalizeOccState({app:'invalid',point:'breaker-position',integration:'operate',condition:'force',acquisition:'arbitrary',step:999,trace:'execute'});assert.deepEqual(malformed,{app:'telecom',point:'pa-health',integration:'monitor',acquisition:'direct',condition:'normal',trace:'indication',step:4});
});

check('Every example renders a bounded trace with real evidence, no undefined value and accessible point controls',()=>{
 let states=0;
 for(const p of OCC_DEVICE_POINTS)for(const integration of ['native','monitor','control'])for(const condition of ['normal','fault','link-loss','local','feedback-missing'])for(const trace of ['indication','request']){
  const m=evaluateOccPoint({app:p.app,point:p.id,integration,condition,trace,step:4});assert.equal(m.steps.length,5);assert.equal(m.active,m.steps[4]);assert(m.steps.every(s=>s.label&&s.actor&&s.text));
  const html=occApplicationsMarkup(m.state);assert(!/undefined|NaN/.test(html));assert.match(html,/for="occ-point"/);assert.match(html,/id="occ-integration"/);assert.match(html,/id="occ-condition"/);assert.match(html,/aria-live="polite"/);assert.match(html,/Sources, examples and scope/);assert.equal((html.match(/data-occ-step="\d"/g)||[]).length,5);assert.match(html,/No|no|not|selected|configured/);states++;
 }
 assert.equal(states,OCC_DEVICE_POINTS.length*3*5*2);
});

check('Shareable state preserves the selected example, optional NMS and degraded conclusion',()=>{
 for(const p of OCC_DEVICE_POINTS){
  const expected=normalizeOccState({app:p.app,point:p.id,integration:'control',acquisition:'nms',condition:'feedback-missing',trace:'request',step:4}),url=new URL('https://example.test/?occCondition=local&occStep=2');writeOccQuery(url,expected);const actual=occStateFromQuery(p.app,p.id,url.searchParams);assert.deepEqual(actual,expected);assert.equal(evaluateOccPoint(actual).active.text,evaluateOccPoint(expected).active.text);
  writeOccQuery(url,null);assert(![...url.searchParams.keys()].some(k=>k.startsWith('occ')));
 }
 for(const id of ['operations-signalling-workstation','operations-traffic-supervision','operations-power-control','operations-station-supervision','occ-alarm-queue','occ-information-quality','occ-supervisory-request','occ-field-indication','occ-record-timeline','occ-cctv-assessment','occ-passenger-communications','occ-access-supervision'])assert(occContextFor(id),id+' has no application route');
 assert.equal(occContextFor('operations-radio-dispatch'),null,'The physical radio terminal must remain inspectable');
});

check('Actual application controls preserve event ownership, choices and teardown',()=>{
 const listeners=new Map(),nodes=new Map(),changes=[],navigation=[];
 const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{textContent:'',disabled:false,open:false,setAttribute(){},focus(){}});return nodes.get(selector);};
 const host={innerHTML:'',querySelector:node,contains:()=>true,addEventListener(type,fn){listeners.set(type,fn);},removeEventListener(type,fn){if(listeners.get(type)===fn)listeners.delete(type);}};
 const app=createOccApplicationExplorer(host,{onStateChange:(s,o)=>changes.push([s,o]),onNavigate:(action,m)=>navigation.push([action,m.point.id])});
 const fire=(type,dataset,value)=>{let stopped=false;const target={dataset,value,closest(){return this;}};listeners.get(type)({target,stopPropagation(){stopped=true;}});assert(stopped,'A child control must not be handled twice by the document router');};
 fire('change',{occField:'integration'},'control');assert.equal(app.getState().integration,'control');assert.equal(changes.at(-1)[1].push,false);
 fire('click',{occApp:'facilities'});assert.equal(app.getState().app,'facilities');assert.equal(changes.at(-1)[1].push,true);
 fire('change',{occField:'point'},'tunnel-fan');assert.equal(app.getState().point,'tunnel-fan');assert.equal(changes.at(-1)[1].push,true);
 fire('click',{occTrace:'request'});fire('change',{occField:'condition'},'feedback-missing');fire('click',{occStep:'4'});assert.equal(app.getState().step,4);assert.match(host.innerHTML,/Outcome unconfirmed/);
 fire('click',{occNav:'hardware'});assert.deepEqual(navigation.at(-1),['hardware','tunnel-fan']);app.destroy();assert.equal(listeners.size,0);
});

check('Physical OCC contexts start assembled and no longer promise removed playback',()=>{
 for(const view of ['operations-centre','occ-workplace','occ-equipment']){assert.equal(cutawayFor(view),false);for(const variant of VIEWS[view].variants){assert.equal(variant.motion,false);assert(!variant.animation);assert(!/playback|play the|information reaches/i.test(variant.description));}}
 assert.deepEqual(VIEWS['occ-equipment'].variants.map(v=>v.id),['normal']);
});
const index=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
check('The OCC page has a direct navigation entry and labelled view selector',()=>{assert.match(index,/data-page="occ"/);assert.match(index,/id="occ-application-explorer"/);assert.match(index,/occ-applications\.css/);assert.match(index,/id="view-choice" aria-label="Jump to a view"/);});
console.log(`\n${passed} OCC application checks passed; ${failures.length} failed.`);if(failures.length)process.exitCode=1;
