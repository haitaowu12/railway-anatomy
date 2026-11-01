#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CONCEPTS,SOURCES} from '../dist/catalog.js';
import {DOMAINS,VIEWS} from '../dist/model.js';
import {PROCESS_VIEWS,PEOPLE_ROLES} from '../dist/process-data.js';
import {CONTROL_DOMAINS,CONTROL_ARCHITECTURES} from '../dist/control-interfaces-data.js';

// Read the committed artifact. Importing the generator would silently repair a
// stale directory and hide the defect this check is meant to catch.
const html=await readFile(new URL('../dist/reading.html',import.meta.url),'utf8');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decode=value=>value.replace(/&(amp|lt|gt|quot|#39);/g,(_,name)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[name]));
const articles=[...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)].map(([,attrs,body])=>({id:attrs.match(/\bid="([^"]+)"/)?.[1],body}));
const byId=new Map(articles.filter(a=>a.id).map(a=>[a.id,a.body]));
const conceptIds=new Set(CONCEPTS.map(c=>c.id));
const domains=new Map(DOMAINS.map(d=>[d.id,new Set(d.parts)]));
const roles=new Map(PEOPLE_ROLES.map(r=>[r.id,r.label]));
const links=[...html.matchAll(/\bhref="(\.\/index\.html#[^"]+)"/g)].map(m=>decode(m[1]));
const destination=id=>{
  const body=byId.get(`concept-${id}`);
  assert(body,`Missing reading article for ${id}`);
  const targets=[...body.matchAll(/\bhref="(\.\/index\.html#[^"]+)"/g)].map(m=>decode(m[1]));
  assert.equal(targets.length,1,`${id} needs exactly one app destination`);
  return targets[0];
};
let passed=0;const failures=[];
function check(name,fn){try{fn();passed++;console.log(`PASS ${name}`);}catch(e){failures.push(name);console.error(`FAIL ${name}: ${e.message}`);}}

check('Every static-reading app destination names a real view, function, role or process stage',()=>{
  assert(links.length>=CONCEPTS.length,'The directory lost its exploration links');
  for(const href of links){
    const url=new URL(href,'https://example.org/railway-anatomy/reading.html');
    assert.equal(url.pathname,'/railway-anatomy/index.html','Reading links must retain a repository subpath');
    const [page,a,b,c,d,...extra]=url.hash.slice(1).split('/');
    assert.equal(extra.length,0,`Unexpected destination segments: ${href}`);
    if(page==='explore'){
      assert(domains.get(a)?.has(c),`Wrong domain/component in ${href}`);
      assert(conceptIds.has(c),`Unknown component in ${href}`);
      assert(VIEWS[b],`Unknown view in ${href}`);
      assert(d==='default'||VIEWS[b].variants?.some(v=>v.id===d),`Unknown comparison in ${href}`);
    }else if(page==='processes'){
      const process=PROCESS_VIEWS[a];assert(process,`Unknown process in ${href}`);
      assert(!b||process.steps.some(s=>s.id===b),`Unknown stage in ${href}`);
    }else if(page==='interfaces'){
      assert(CONTROL_DOMAINS.some(x=>x.id===a),`Unknown interface function in ${href}`);
      assert(CONTROL_ARCHITECTURES.some(x=>x.id===b),`Unknown architecture in ${href}`);
    }else if(page==='people'){
      assert(roles.has(a),`Unknown role in ${href}`);
    }else assert.fail(`Unrecognized reading destination: ${href}`);
  }
  for(const concept of CONCEPTS)destination(concept.id);
});

check('SCADA, BAS, TVCS and other new control concepts open their distinct Interfaces function',()=>{
  const expected={
    'power-scada':'traction','station-scada':'building','bas-controller':'building',
    'tvcs-controller':'tunnel','station-smoke-controller':'station-smoke',
    'drainage-controller':'drainage','network-management':'network',
    'control-responsibilities':'building','local-plant-controller':'building','interface-contract':'building',
  };
  for(const [id,functionId]of Object.entries(expected)){
    assert.equal(destination(id),`./index.html#interfaces/${functionId}/summaries`,`${id} lost its responsibility context`);
    assert(byId.get(`concept-${id}`).includes('Explore the interfaces'),`${id} is mislabeled as equipment or a process`);
  }
});

check('Work and release concepts leave 3D while bridge, drainage and plant anatomy remain physical',()=>{
  const expected={
    'route-inspection':'infrastructure-maintenance','route-work-boundary':'infrastructure-maintenance','route-record':'infrastructure-maintenance',
    'depot-personnel-protection':'work-protection','depot-energy-isolation':'work-protection',
    'depot-work-handover':'maintenance-release','depot-dispatch':'maintenance-release',
    'change-test':'configuration-change','change-acceptance':'asset-handover','occ-duty-handover':'duty-handover',
  };
  for(const [id,processId]of Object.entries(expected)){
    assert(destination(id).startsWith(`./index.html#processes/${processId}/`),`${id} returned to a 3D proxy`);
    assert(byId.get(`concept-${id}`).includes('Explore the process'),`${id} lost its process label`);
  }
  assert.equal(destination('change-test'),'./index.html#processes/configuration-change/verify');
  for(const id of ['route-bridge','route-drainage'])assert.equal(destination(id),`./index.html#explore/track/infrastructure-assets/${id}/assets`);
  assert.equal(destination('bas-actuator'),'./index.html#explore/station/ventilation-unit/bas-actuator/damper');
  assert.equal(destination('tunnel-damper'),'./index.html#explore/station/ventilation-unit/tunnel-damper/damper');
  assert.equal(destination('fire-pump'),'./index.html#explore/station/fire-systems/fire-pump/water');
});

check('All process reading summaries retain the actual stage titles and human-readable responsible roles',()=>{
  const section=html.match(/<section id="processes">([\s\S]*?)<\/section>/)?.[1];
  assert(section,'Missing process reading section');
  const records=[...section.matchAll(/<article>([\s\S]*?)<\/article>/g)].map(m=>m[1]);
  assert.equal(records.length,Object.keys(PROCESS_VIEWS).length);
  for(const process of Object.values(PROCESS_VIEWS)){
    const record=records.find(body=>body.includes(`<h3>${esc(process.title)}</h3>`));
    assert(record,`Missing process summary: ${process.id}`);
    assert(record.includes(esc(process.summary)),`Stale process scope: ${process.id}`);
    assert.equal([...record.matchAll(/<li>/g)].length,process.steps.length,`Stale stages: ${process.id}`);
    for(const step of process.steps){
      assert(roles.has(step.owner),`Unresolved owner for ${process.id}/${step.id}`);
      assert(record.includes(`<strong>${esc(step.title)}</strong> — ${esc(roles.get(step.owner))}`),`Stale stage/role in ${process.id}/${step.id}`);
    }
    assert(record.includes(`./index.html#processes/${process.id}/${process.steps[0].id}`),`Missing process entry destination: ${process.id}`);
  }
});

check('The generated source directory retains publisher, explanation and public-use scope for every record',()=>{
  assert(html.includes(`Explore ${CONCEPTS.length} concepts and ${SOURCES.length} public references`),'Reading headline has stale release counts');
  for(const source of SOURCES){
    const article=byId.get(source.id);assert(article,`Missing source ${source.id}`);
    for(const field of ['publisher','title','description','scope'])assert(article.includes(esc(source[field])),`Stale ${field} for ${source.id}`);
    assert(article.includes(`href="${esc(source.url)}"`),`Wrong public URL for ${source.id}`);
  }
});

check('Reading anchors remain unique and every guide, concept and source jump resolves',()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  const known=new Set(ids);assert.equal(ids.length,known.size,'Duplicate static reading IDs');
  for(const [,id]of html.matchAll(/\bhref="#([^"]+)"/g))assert(known.has(id),`Broken reading anchor #${id}`);
});

console.log(`\nStatic reading: ${passed} checks passed; ${failures.length} failed. ${CONCEPTS.length} concepts, ${SOURCES.length} source scopes, ${links.length} app destinations.`);
if(failures.length)process.exitCode=1;
