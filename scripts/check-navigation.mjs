#!/usr/bin/env node
// Exercise the production URL reader/writer, not a second implementation of
// their rules. Browser history and viewport behavior still need browser QA.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizePlatformState,platformForComponent} from '../dist/platform-config.js';
import {DOMAINS,VIEWS,MODES,variantFor,defaultVariant,cutawayFor} from '../dist/model.js';
import {CONCEPTS} from '../dist/catalog.js';
import {TOURS} from '../dist/tours.js';
import {domainForView,routeState,viewTrail} from '../dist/navigation.js';
import {DEFAULT_ELECTRIFICATION,normalizeElectrification,electrificationForComponent} from '../dist/electrification.js';
import {PROCESS_VIEWS,PEOPLE_ROLES} from '../dist/process-data.js';
import {processFor} from '../dist/process-ui.js';
import {technologyFromUrl,technologyForView,technologyForComponent} from '../dist/technology.js';

const source=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
const begin=source.indexOf('function writeHash(){'),end=source.indexOf('function activeDomain(){',begin);
assert(begin>=0&&end>begin,'Navigation implementation markers changed');
const restoreBegin=source.indexOf('function restoreNavigation()'),restoreEnd=source.indexOf("window.addEventListener('hashchange'",restoreBegin);
assert(restoreBegin>=0&&restoreEnd>restoreBegin,'History restoration markers changed');
const returnBegin=source.indexOf("else if(b.id==='return-context')"),returnEnd=source.indexOf('\n  else if(b.dataset.destination)',returnBegin);
assert(returnBegin>=0&&returnEnd>returnBegin,'Context restoration handler markers changed');
function createBrowserEnvironment(){
  // The captured history block also registers the process-menu resize handler.
  // Provide real event dispatch and width queries, without emulating layout.
  const window=new EventTarget();window.innerWidth=1280;
  const processMenu={open:true};
  const matchMedia=query=>{
    const constraint=/^\(\s*(min|max)-width:\s*(\d+)px\s*\)$/.exec(query);
    assert.ok(constraint,`The bounded navigation harness does not model ${query}`);
    const result=new EventTarget(),limit=Number(constraint[2]);
    Object.defineProperties(result,{media:{value:query},matches:{get:()=>constraint[1]==='min'?window.innerWidth>=limit:window.innerWidth<=limit}});
    return result;
  };
  window.matchMedia=matchMedia;
  return {window,matchMedia,processMenu,querySelector:selector=>{
    assert.equal(selector,'.process-menu','Unexpected DOM dependency in the navigation harness');
    return processMenu;
  }};
}
const dependencies={normalizePlatformState,platformForComponent,createBrowserEnvironment,DEFAULT_ELECTRIFICATION,normalizeElectrification,electrificationForComponent,PROCESS_VIEWS,PEOPLE_ROLES,processFor,DOMAINS,VIEWS,MODES,CONCEPTS,TOURS,variantFor,defaultVariant,cutawayFor,domainForView,routeState,technologyFromUrl,technologyForView,technologyForComponent};
const harness=new Function(...Object.keys(dependencies),`
  const {window,matchMedia,processMenu,querySelector:$}=createBrowserEnvironment();
  const parts=new Map(CONCEPTS.map(c=>[c.id,c]));
  const savedTechnology={};
  let state={},historyMode='replace',returnContext=null,lastReadUrl='',configurationEffect='',allComponents=false,lastExplorationContext='';
  let location=new URL('https://example.test/railway-anatomy/');
  const history={state:null,pushState(value,title,url){this.state=value;location=new URL(url,location);},replaceState(value,title,url){this.state=value;location=new URL(url,location);}};
  const localStorage={setItem(){}};
  function announce(){}
  function applyLesson(){throw new Error('This bounded harness exercises explorer URLs only');}
  function render(){writeHash();}
  ${source.slice(source.indexOf('const preferredPresentation='),source.indexOf('function equipmentInView'))}
  ${source.slice(begin,end)}
  ${source.slice(restoreBegin,restoreEnd)}
  return {
    roundTrip(value){state=structuredClone(value);writeHash();const url=location.href;state={};readHash();return {url,state:structuredClone(state)};},
    parse(url){location=new URL(url);state={};readHash();return structuredClone(state);},
    restore(url,saved,current){location=new URL(url);history.state={railway:structuredClone(saved),returnContext:null};state=structuredClone(current);lastReadUrl='';restoreNavigation();return structuredClone(state);},
    resize(width){const before=structuredClone(state);window.innerWidth=width;window.dispatchEvent(new Event('resize'));return {menuOpen:processMenu.open,before,state:structuredClone(state)};},
    returnTo(saved,current){returnContext=structuredClone(saved);state=structuredClone(current);lastExplorationContext='departing-view';const b={id:'return-context'};
      ${source.slice(returnBegin+5,returnEnd)}
      return {state:structuredClone(state),context:lastExplorationContext};
    }
  };
`)(...Object.values(dependencies));

const base={page:'explore',domain:'vehicle',view:'vehicle',component:'carbody',variant:'default',technology:{propulsion:'lim',control:'loop'},mode:'coasting',scenario:'nominal',sink:'train',cutaway:false,exploded:0,explodeScope:'all',playing:false,labels:true,labelMode:'nearby',lesson:0};
let routes=0;
for(const [view,config]of Object.entries(VIEWS)){
  const domain=domainForView(view,DOMAINS)?.id;assert(domain,`No area owns ${view}`);
  const variants=config.variants?.map(v=>v.id)||['default'];
  for(const variant of variants)for(const mode of ['coasting','motoring']){
    const component=config.variants?.find(v=>v.id===variant)?.component||config.component;
    const technology=technologyForView(technologyForComponent(base.technology,component),view,variant);
    const expected={...base,view,domain,component,variant,mode,technology,...(view==='platform-interface'?normalizePlatformState({variant}):{})};
    const result=harness.roundTrip(expected);
    for(const key of ['view','domain','component','variant','mode'])assert.equal(result.state[key],expected[key],`${view}/${variant}: ${key} changed after reopening ${result.url}`);
    assert.deepEqual(result.state.technology,technology,`${view}/${variant}: technology changed after URL round trip`);
    routes++;
  }
}
for(const propulsion of ['lim','rotary'])for(const control of ['loop','radio','fixed','etcs1','etcs2'])for(const mode of MODES.map(m=>m.id)){
  const expected={...base,technology:{propulsion,control},mode,scenario:mode==='regeneration'?'regen-limited':'nominal',sink:mode==='regeneration'?'resistor':'train'};
  const actual=harness.roundTrip(expected).state;
  for(const key of ['mode','scenario','sink'])assert.equal(actual[key],expected[key],`Vehicle ${propulsion}/${control} lost ${key}`);
  assert.deepEqual(actual.technology,expected.technology);
}
for(const component of ['train-radio','wayside-radio']){
  const parsed=harness.parse(`https://example.test/railway-anatomy/?propulsion=rotary&control=etcs2#explore/control/control/${component}`);
  assert.equal(parsed.technology.control,'etcs2','An ETCS radio bookmark must remain ETCS');
}
for(const electrification of ['third-rail-dc','fourth-rail-dc','overhead-dc','overhead-ac'])for(const propulsion of ['lim','rotary']){
 const saved={...base,electrification,technology:{propulsion,control:'etcs2'}};const actual=harness.roundTrip(saved).state;
 assert.equal(actual.electrification,electrification,'A supply profile changed on reopening its URL');assert.equal(actual.technology.propulsion,propulsion,'A supply profile changed propulsion');
}
for(const [id,p]of Object.entries(PROCESS_VIEWS))for(const step of p.steps){const actual=harness.parse(`https://example.test/railway-anatomy/#processes/${id}/${step.id}`);assert.equal(actual.page,'processes');assert.equal(actual.processId,id);assert.equal(actual.processStep,step.id);}
for(const [hash,process]of [['explore/depot/change-evidence/change-baseline/installed','configuration-change'],['explore/operations/occ-incident/occ-alarm-queue/reported','incident-coordination'],['explore/operations/operations-centre/operations-centre/handover','duty-handover']]){const actual=harness.parse(`https://example.test/railway-anatomy/#${hash}`);assert.equal(actual.page,'processes','A legacy process route returned to a physical model');assert.equal(actual.processId,process);}
for(const [legacy,profile]of [['ac','overhead-ac'],['dc','fourth-rail-dc']]){const actual=harness.parse(`https://example.test/railway-anatomy/#explore/power/electrification/supply-conversion/${legacy}`);assert.equal(actual.electrification,profile);assert.equal(actual.variant,'chain');}
const map=harness.roundTrip({...base,domain:'communications',view:'communications-overview',component:'communications-system',variant:'supervision',presentation:'connections'}).state;assert.equal(map.presentation,'connections');
for(const platformEdge of ['open','half-height','full-height'])for(const platformSensor of ['lidar','radar'])for(const focus of ['open-platform','platform-doors','interspace','platform-end']){
 const normalized=normalizePlatformState({platformEdge,platformSensor,variant:focus});
 const expected={...base,...normalized,domain:'station',view:'platform-interface',component:'platform-intrusion',presentation:'equipment'};
 const actual=harness.roundTrip(expected).state;
 for(const key of ['platformEdge','platformSensor','variant'])assert.equal(actual[key],expected[key],`Platform bookmark lost ${key}`);
}
const oldDoors=harness.parse('https://example.test/railway-anatomy/#explore/station/platform-interface/platform-screen-door/platform-doors');
assert.equal(oldDoors.platformEdge,'full-height','A legacy door bookmark silently removed the facade');
const openEnd=harness.parse('https://example.test/railway-anatomy/?platformEdge=open#explore/station/platform-interface/platform-end-gate/platform-end');
assert.equal(openEnd.platformEdge,'open','End access added platform doors');
assert.equal(harness.parse('https://example.test/railway-anatomy/#explore/operations/occ-supervision/occ-supervisory-request/traffic').presentation,'connections');
assert.equal(harness.parse('https://example.test/railway-anatomy/?presentation=equipment#explore/operations/occ-supervision/occ-supervisory-request/traffic').presentation,'equipment');
assert.equal(harness.parse('https://example.test/railway-anatomy/#explore/power/power-transformer/transformer/default').presentation,'connections');
const invalid=harness.parse('https://example.test/railway-anatomy/?propulsion=invalid&control=invalid&mode=invalid#explore/invalid/invalid/invalid');
assert.equal(invalid.view,'railway');assert.equal(invalid.component,'network-overview');
assert.deepEqual(invalid.technology,{propulsion:'lim',control:'loop'});
const previous={...base,page:'reference',domain:'control',view:'etcs',component:'etcs-level-2',variant:'level-2',technology:{propulsion:'rotary',control:'etcs2'},cutaway:true,exploded:.35,explodeScope:'selected',labels:false,labelMode:'off'};
const later={...base,view:'lim',component:'lim-primary'};
const restored=harness.restore('https://example.test/railway-anatomy/?propulsion=rotary&control=etcs2#reference',previous,later);
for(const key of ['page','domain','view','component','variant','cutaway','exploded','explodeScope','labels','labelMode'])assert.equal(restored[key],previous[key],`Back to the field guide lost its explorer ${key}`);
assert.deepEqual(restored.technology,previous.technology,'Back to the field guide let a later component overwrite its technology');
for(const explodeScope of ['all','selected'])for(const labelMode of ['nearby','selected','off']){
  const saved={...base,domain:'station',view:'station-networks',component:'bas-controller',variant:'building',
    cutaway:false,exploded:.6,explodeScope,labels:labelMode!=='off',labelMode};
  const historyRestored=harness.restore('https://example.test/railway-anatomy/?propulsion=lim&control=loop#explore/station/station-networks/bas-controller/building',saved,later);
  for(const key of ['cutaway','exploded','explodeScope','labels','labelMode'])assert.equal(historyRestored[key],saved[key],`History restoration lost ${key} for ${explodeScope}/${labelMode}`);
  const contextRestored=harness.returnTo(saved,later);
  assert.equal(contextRestored.context,'','Context return retained the departing view and would reset saved separation');
  for(const key of ['cutaway','exploded','explodeScope','labels','labelMode'])assert.equal(contextRestored.state[key],saved[key],`Context return lost ${key} for ${explodeScope}/${labelMode}`);
}
for(const view of Object.keys(VIEWS)){
  const trail=viewTrail(view,VIEWS);
  assert.equal(trail.at(-1),view,`${view} disappeared from its own trail`);
  assert.equal(new Set(trail).size,trail.length,`${view} contains a navigation cycle`);
}
for(const [width,open]of [[390,false],[740,false],[741,true],[1280,true]]){
  const result=harness.resize(width);
  assert.equal(result.menuOpen,open,`Process navigation has the wrong disclosure state at ${width}px`);
  assert.deepEqual(result.state,result.before,'Resizing process navigation changed the active route');
}
console.log(`PASS production route round trips: ${routes} view/variant/mode routes, 40 independent vehicle configurations, 8 electrical/propulsion bookmarks, 31 process-step routes, legacy process/electrification redirects, connection-mode bookmarks, ETCS radio bookmarks, 6 history/context presentation combinations, malformed-route fallback, parent trails and process-menu resize events`);
