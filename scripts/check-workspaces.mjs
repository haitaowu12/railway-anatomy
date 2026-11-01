import assert from 'node:assert/strict';
import {LEARNING_WORKSPACES,FOUNDATION_STUDIES,workspaceFor,assemblyTreeRows} from '../dist/learning-workspaces.js';
import {DEPTH_LESSONS} from '../dist/depth-content.js';
import {LEARNING_LABS,labChart} from '../dist/labs-ui.js';
import {VIEWS,defaultVariant} from '../dist/model.js';
import {CONCEPTS,SOURCES} from '../dist/catalog.js';
import {viewerHarness} from './viewer-test-harness.mjs';
const studies=[...FOUNDATION_STUDIES,...DEPTH_LESSONS],concepts=new Set(CONCEPTS.map(c=>c.id)),sources=new Set(SOURCES.map(s=>s.id));
assert.equal(LEARNING_WORKSPACES.length,6);assert.equal(new Set(LEARNING_WORKSPACES.map(w=>w.id)).size,6);
assert.equal(new Set(studies.map(s=>s.id)).size,studies.length);
for(const workspace of LEARNING_WORKSPACES){
 assert(studies.some(s=>s.workspace===workspace.id),workspace.id+' has no study');
 assert(workspace.groups.some(g=>g.views.includes(workspace.view)),workspace.id+' omits its starting view');
 for(const view of workspace.groups.flatMap(g=>g.views)){assert(VIEWS[view],workspace.id+': missing '+view);assert.equal(workspaceFor(view,null,workspace.id)?.id,workspace.id);}
}
const h=await viewerHarness(),v=h.viewer;
for(const s of studies){
 assert(VIEWS[s.view],s.id+': invalid view');
 assert(LEARNING_WORKSPACES.some(w=>w.id===s.workspace&&w.groups.some(g=>g.views.includes(s.view))),s.id+': study loses workspace');
 if(s.variant)assert((VIEWS[s.view].variants||[{id:'default'}]).some(x=>x.id===s.variant),s.id+': invalid variant '+s.variant);
 for(const id of [...s.conceptIds,...s.steps.map(step=>step.conceptId)])assert(concepts.has(id),s.id+': missing concept '+id);
 for(const step of s.steps)if(step.view){assert(VIEWS[step.view],s.id+': missing step view');if(step.variant)assert(VIEWS[step.view].variants?.some(v=>v.id===step.variant),s.id+': invalid step variant');}
 assert(s.sources.length,s.id+': no primary references');for(const id of s.sources)assert(sources.has(id),s.id+': missing source '+id);
 assert(s.boundary&&s.question&&s.explanation&&s.steps.length>=3,s.id+': incomplete learning contract');
 v.setTechnology({propulsion:'lim',control:'loop',...s.technology});v.setPlatform({platformEdge:'open',platformSensor:'lidar',...s.configuration});v.setView(s.view);v.setVariant(s.variant||defaultVariant(s.view));v.setCutaway(true);v.setExploded(0);h.draw();
 const available=v.getComponentIds(s.view);assert(available.includes(s.conceptIds[0]),s.id+': starting concept has no physical instance in its view');
 const tree=v.getInspectionState().tree;for(const step of s.steps)if(step.partLabel)assert(tree.some(n=>n.label===step.partLabel&&n.available!==false),s.id+': missing authored step '+step.partLabel);
}
assert.equal(LEARNING_LABS.length,8);assert.equal(new Set(LEARNING_LABS.map(l=>l.id)).size,8);
for(const lab of LEARNING_LABS){
 assert(LEARNING_WORKSPACES.some(w=>w.id===lab.workspace&&w.groups.some(g=>g.views.includes(lab.view))),lab.id+': lab loses workspace');
 assert(concepts.has(lab.conceptId),lab.id+': missing concept');for(const id of lab.sources)assert(sources.has(id),lab.id+': missing source '+id);
 if(lab.variant)assert(VIEWS[lab.view].variants?.some(x=>x.id===lab.variant),lab.id+': invalid variant');
 v.setView(lab.view);v.setVariant(lab.variant||defaultVariant(lab.view));h.draw();assert(v.getComponentIds(lab.view).includes(lab.conceptId),lab.id+': lab has no physical context');
 const result=lab.evaluate(Object.fromEntries(lab.controls.map(c=>[c.id,c.default])));
 if(result.series?.length){assert(result.xLabel&&result.yLabel,lab.id+': missing units/axis labels');assert.match(labChart(result,lab.title),/role="img"/,lab.id+': missing accessible plot');}
}
const dot=labChart({series:[{label:'Operating point',points:[{x:2,y:4}]}],xLabel:'Flow',yLabel:'Pressure'},'Example');assert.match(dot,/<circle /,'Single operating point disappears from the fan plot');
// Hidden architecture alternatives must not masquerade as internal parts;
// search must still discover covered internals in a collapsed assembly.
v.setView('vehicle');v.setTechnology({propulsion:'lim',control:'loop'});v.setElectrification('fourth-rail-dc');v.setCutaway(false);h.draw();
let inspection=v.getInspectionState(),rows=assemblyTreeRows(inspection);
assert(rows.length<inspection.tree.filter(n=>n.conceptId).length/2,'Initial tree fails to progressively disclose its parts');
assert(!rows.some(n=>n.conceptId==='rotary-traction-motor'),'Unavailable rotary drive leaked into the LIM tree');
const bearing=inspection.tree.find(n=>n.label==='Roller bearing unit'&&n.available!==false);assert(bearing);
assert(!rows.some(n=>n.instanceId===bearing.instanceId),'Deep bearing unexpectedly opens at the root');
rows=assemblyTreeRows(inspection,{filter:'Roller bearing unit'});assert(rows.some(n=>n.instanceId===bearing.instanceId&&n.matches));assert(rows.some(n=>n.label==='Bogie assembly'&&!n.matches),'Search discarded construction context');
v.selectInstance(bearing.instanceId,{notify:false});inspection=v.getInspectionState();rows=assemblyTreeRows(inspection,{expanded:new Set(inspection.ancestors.map(n=>n.instanceId))});
assert(rows.some(n=>n.label==='Inner race'));assert(rows.some(n=>n.label==='Bearing seal'));
v.setTechnology({propulsion:'rotary',control:'etcs2'});h.draw();rows=assemblyTreeRows(v.getInspectionState(),{filter:'Motor housing'});assert(rows.some(n=>n.matches&&n.available),'Active motor cannot be discovered');
v.dispose();
console.log(`PASS connected studies: six workspaces, ${studies.length} sourced study routes, real starting geometry, stable cross-context membership, architecture-aware hierarchy and searching covered parts`);
console.log('PASS applied-study integration: eight physical-context destinations, source records, readable plot axes and single-point operating marker');
