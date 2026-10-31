#!/usr/bin/env node
// Exercise the production URL reader/writer, not a second implementation of
// their rules. Browser history and viewport behavior still need browser QA.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DOMAINS,VIEWS,MODES,variantFor,defaultVariant,cutawayFor} from '../dist/model.js';
import {CONCEPTS} from '../dist/catalog.js';
import {TOURS} from '../dist/tours.js';
import {domainForView,routeState,viewTrail} from '../dist/navigation.js';
import {technologyFromUrl,technologyForView,technologyForComponent} from '../dist/technology.js';

const source=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
const begin=source.indexOf('function writeHash(){'),end=source.indexOf('function activeDomain(){',begin);
assert(begin>=0&&end>begin,'Navigation implementation markers changed');
const restoreBegin=source.indexOf('function restoreNavigation()'),restoreEnd=source.indexOf("window.addEventListener('hashchange'",restoreBegin);
assert(restoreBegin>=0&&restoreEnd>restoreBegin,'History restoration markers changed');
const dependencies={DOMAINS,VIEWS,MODES,CONCEPTS,TOURS,variantFor,defaultVariant,cutawayFor,domainForView,routeState,technologyFromUrl,technologyForView,technologyForComponent};
const harness=new Function(...Object.keys(dependencies),`
  const parts=new Map(CONCEPTS.map(c=>[c.id,c]));
  const savedTechnology={};
  let state={},historyMode='replace',returnContext=null,lastReadUrl='',configurationEffect='',allComponents=false;
  let location=new URL('https://example.test/railway-anatomy/');
  const history={state:null,pushState(value,title,url){this.state=value;location=new URL(url,location);},replaceState(value,title,url){this.state=value;location=new URL(url,location);}};
  const localStorage={setItem(){}};
  function applyLesson(){throw new Error('This bounded harness exercises explorer URLs only');}
  function render(){writeHash();}
  ${source.slice(begin,end)}
  ${source.slice(restoreBegin,restoreEnd)}
  return {
    roundTrip(value){state=structuredClone(value);writeHash();const url=location.href;state={};readHash();return {url,state:structuredClone(state)};},
    parse(url){location=new URL(url);state={};readHash();return structuredClone(state);},
    restore(url,saved,current){location=new URL(url);history.state={railway:structuredClone(saved),returnContext:null};state=structuredClone(current);lastReadUrl='';restoreNavigation();return structuredClone(state);}
  };
`)(...Object.values(dependencies));

const base={page:'explore',domain:'vehicle',view:'vehicle',component:'carbody',variant:'default',technology:{propulsion:'lim',control:'loop'},mode:'coasting',scenario:'nominal',sink:'train',cutaway:false,exploded:0,playing:false,labels:true,lesson:0};
let routes=0;
for(const [view,config]of Object.entries(VIEWS)){
  const domain=domainForView(view,DOMAINS)?.id;assert(domain,`No area owns ${view}`);
  const variants=config.variants?.map(v=>v.id)||['default'];
  for(const variant of variants)for(const mode of ['coasting','motoring']){
    const component=config.variants?.find(v=>v.id===variant)?.component||config.component;
    const technology=technologyForView(technologyForComponent(base.technology,component),view,variant);
    const expected={...base,view,domain,component,variant,mode,technology};
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
const invalid=harness.parse('https://example.test/railway-anatomy/?propulsion=invalid&control=invalid&mode=invalid#explore/invalid/invalid/invalid');
assert.equal(invalid.view,'railway');assert.equal(invalid.component,'network-overview');
assert.deepEqual(invalid.technology,{propulsion:'lim',control:'loop'});
const previous={...base,page:'reference',domain:'control',view:'etcs',component:'etcs-level-2',variant:'level-2',technology:{propulsion:'rotary',control:'etcs2'},cutaway:true,exploded:.35,labels:false};
const later={...base,view:'lim',component:'lim-primary'};
const restored=harness.restore('https://example.test/railway-anatomy/?propulsion=rotary&control=etcs2#reference',previous,later);
for(const key of ['page','domain','view','component','variant','cutaway','exploded','labels'])assert.equal(restored[key],previous[key],`Back to the field guide lost its explorer ${key}`);
assert.deepEqual(restored.technology,previous.technology,'Back to the field guide let a later component overwrite its technology');
for(const view of Object.keys(VIEWS)){
  const trail=viewTrail(view,VIEWS);
  assert.equal(trail.at(-1),view,`${view} disappeared from its own trail`);
  assert.equal(new Set(trail).size,trail.length,`${view} contains a navigation cycle`);
}
console.log(`PASS production route round trips: ${routes} view/variant/mode routes, 40 independent vehicle configurations, ETCS radio bookmarks, malformed-route fallback and parent trails`);
