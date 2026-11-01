import {LEARNING_WORKSPACES,FOUNDATION_STUDIES,workspaceFor,assemblyTreeRows} from './learning-workspaces.js';
import {DEPTH_LESSONS,ASSEMBLY_DEPENDENCIES,evaluateDependencyScenario,buildPointTrace} from './depth-content.js';
import {createLearningLabs} from './labs-ui.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const ANATOMY_STUDIES=[...FOUNDATION_STUDIES,...DEPTH_LESSONS];
export function workspaceNavigation(state,views){
 const current=workspaceFor(state.view,state.domain,state.workspace);
 return `<p class="workspace-nav-label">Connected studies</p><button data-domain="network" class="workspace-home ${state.view==='railway'?'active':''}" ${state.view==='railway'?'aria-current="location"':''}>Whole railway</button>`+LEARNING_WORKSPACES.map(w=>`<div class="study-nav-group"><button data-workspace="${w.id}" class="workspace-link ${current?.id===w.id?'active':''}" aria-expanded="${current?.id===w.id}">${esc(w.label)}</button>${current?.id===w.id?`<div class="workspace-routes">${w.groups.map(g=>`<details ${g.views.includes(state.view)?'open':''}><summary>${esc(g.label)}</summary>${g.views.filter(id=>views[id]).map(id=>`<button data-workspace-view="${id}" data-workspace-owner="${w.id}" ${state.view===id?'aria-current="location"':''}>${esc(views[id].label)}</button>`).join('')}</details>`).join('')}</div>`:''}</div>`).join('');
}
export function workspaceOrientation(state,views){
 const current=workspaceFor(state.view,state.domain,state.workspace);
 if(!current)return `<div class="study-intro"><p class="eyebrow">Anatomy, mechanism & evidence</p><h2>Choose a connected study.</h2><p>Start with a place or system, inspect its assemblies, then follow the relationships that make it work.</p></div><div class="workspace-cards">${LEARNING_WORKSPACES.map(w=>`<button data-workspace="${w.id}"><strong>${esc(w.label)}</strong><span>${esc(w.question)}</span><small>Open study →</small></button>`).join('')}</div>`;
 return `<div class="workspace-orientation"><div><p class="eyebrow">${esc(current.label)}</p><p>${esc(current.question)}</p></div><details><summary>Study route</summary><p>${esc(current.summary)}</p><div class="study-route-links">${current.groups.flatMap(g=>g.views).filter(id=>views[id]).map(id=>`<button data-workspace-view="${id}" data-workspace-owner="${current.id}" ${state.view===id?'aria-current="location"':''}>${esc(views[id].label)}</button>`).join('')}</div></details></div>`;
}

export function createDepthPanel(host,actions){
 let context=null,tab='parts',filter='',lessonId='',pointScenario='current',lastInstance=null,lastRoot=null;
 const expanded=new Set();
 const graphScenarios=new Map();let reviewed={};
 try{const saved=JSON.parse(localStorage.getItem('railway-anatomy-studies-v1')||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))reviewed=saved;}catch{}
 host.innerHTML=`<header class="depth-heading"><div><p class="eyebrow">Assembly anatomy</p><h2 id="depth-title">Inspect the selected equipment</h2></div><div class="depth-modes" role="group" aria-label="Anatomy view"><button data-depth-mode="assembled">Assembled</button><button data-depth-mode="section">Section</button><button data-depth-mode="inspection">Inspect</button></div></header><p id="depth-context" class="depth-context"></p><div class="depth-tabs" role="group" aria-label="Assembly learning tools"><button data-depth-tab="parts" aria-pressed="true">Parts & interfaces</button><button data-depth-tab="paths" aria-pressed="false">Paths & dependencies</button><button data-depth-tab="learn" aria-pressed="false">Study & check</button></div>
 <section data-depth-page="parts"><div class="depth-parts-grid"><div class="depth-browser"><label for="anatomy-search">Find a physical part</label><input id="anatomy-search" type="search" placeholder="Bearing, terminal, casing…" autocomplete="off"><div class="depth-tree-tools"><label><input type="checkbox" id="anatomy-all-instances"> Select all matching physical parts</label><span id="anatomy-count"></span></div><ul id="anatomy-tree" class="anatomy-tree" aria-label="Physical assembly hierarchy"></ul></div><div class="depth-part-card"><div id="depth-part-detail"></div><div class="depth-part-actions"><button data-depth-focus>Frame this part</button><button data-depth-parent>Parent assembly</button></div><div id="depth-stage-controls" class="depth-stage-controls"></div><p class="depth-fidelity-note">Separation reveals construction. The motion and split lines are instructional.</p></div></div></section>
 <section data-depth-page="paths" hidden><div id="depth-paths"></div><div id="depth-dependencies"></div><div id="depth-point"></div></section>
 <section data-depth-page="learn" hidden><label for="anatomy-study">A question to investigate</label><select id="anatomy-study"></select><div id="depth-study"></div><section id="learning-labs" class="learning-labs" aria-label="Applied calculations and evidence studies"></section></section>`;
 const $=selector=>host.querySelector(selector),$$=selector=>[...host.querySelectorAll(selector)];
 const labs=createLearningLabs($('#learning-labs'),{locate:lab=>actions.lab(lab)});
 const html=(selector,markup)=>{const el=$(selector);if(el&&el.dataset.markup!==markup){el.innerHTML=markup;el.dataset.markup=markup;}};
 const chips=ids=>context?.sourceChips(ids||[])||'';
 function setTab(next){tab=next;$$('[data-depth-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.depthTab===tab)));$$('[data-depth-page]').forEach(p=>p.hidden=p.dataset.depthPage!==tab);}
 function renderTree(){
  const inspection=context?.inspection;if(!inspection)return;
  const tree=inspection.tree||[],root=tree[0]?.instanceId;
  if(root!==lastRoot){expanded.clear();lastRoot=root;lastInstance=null;filter='';$('#anatomy-search').value='';}
  if(lastInstance!==inspection.selectedInstanceId){for(const n of inspection.ancestors||[])expanded.add(n.instanceId);lastInstance=inspection.selectedInstanceId;}
  const rows=assemblyTreeRows(inspection,{expanded,filter}),available=tree.filter(n=>n.conceptId&&n.available!==false);
  const markup=rows.map(n=>`<li style="--part-depth:${Math.min(5,Math.max(0,(n.depth||1)-1))}">${n.hasChildren?`<button class="part-toggle" data-anatomy-toggle="${esc(n.instanceId)}" aria-expanded="${n.expanded}" aria-label="${n.expanded?'Collapse':'Expand'} ${esc(n.label)}">${n.expanded?'−':'+'}</button>`:'<span class="part-toggle-placeholder" aria-hidden="true"></span>'}<button class="part-select" data-anatomy-instance="${esc(n.instanceId)}"><span>${esc(n.label)}${n.visible?'':'<small>Covered or outside isolated context</small>'}</span></button></li>`).join('')||'<li class="empty-depth">No authored part matches this search.</li>';
  html('#anatomy-tree',markup);$('#anatomy-count').textContent=filter?`${rows.filter(n=>n.matches).length} matches · context retained`:`${available.length} named parts · expand an assembly`;
  $$('[data-anatomy-instance]').forEach(b=>{const entry=tree.find(n=>n.instanceId===b.dataset.anatomyInstance);b.setAttribute('aria-pressed',String(Boolean(entry?.selected)));b.classList.toggle('selected',Boolean(entry?.selected));});
  $('#anatomy-all-instances').checked=Boolean(inspection.allInstances);
 }
 function renderSelected(){
  const inspection=context.inspection,selected=inspection.selected||inspection.tree?.find(n=>n.instanceId===inspection.selectedInstanceId),concept=context.parts.get(selected?.conceptId||context.state.component);
  $('#depth-title').textContent=selected?.label||concept?.label||'Inspect the selected equipment';
  const ancestors=inspection.ancestors||[];
  $('#depth-context').textContent=ancestors.filter(n=>n.conceptId).map(n=>n.label).join(' / ')||'Select a part in the model or hierarchy. Its context stays with it.';
  const interfaces=selected?.interfaces||[];
  html('#depth-part-detail',`<p class="depth-part-kind">${esc(selected?.role||concept?.label||'Selected assembly')}</p><h3>${esc(selected?.label||concept?.label||'Physical construction')}</h3><p>${esc(selected?.function||concept?.summary||'Choose a named part to see its construction and interfaces.')}</p>${interfaces.length?`<h4>Interfaces</h4><ul>${interfaces.map(item=>`<li>${esc(typeof item==='string'?item:item.label||item.description)}</li>`).join('')}</ul>`:''}<p class="depth-fidelity">${esc(selected?.fidelity||'Original schematic geometry; proportions are illustrative.')}</p>${chips(selected?.sources?.length?selected.sources:concept?.sources)}`);
  $('[data-depth-parent]').disabled=!ancestors.slice(0,-1).some(n=>n.conceptId);$('[data-depth-focus]').disabled=!selected;
  const stages=inspection.stages||[];
  html('#depth-stage-controls',stages.length?`<p class="eyebrow">Inspection stages</p><div>${stages.map((stage,i)=>`<button data-depth-exposure="${stage.end}">${i+1}. ${esc(stage.label)}</button>`).join('')}</div>`:'');
  $$('[data-depth-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.depthMode===inspection.mode)));
  $('[data-depth-mode="inspection"]').disabled=!inspection.tree?.some(n=>n.selected&&n.canInspect)&&!stages.length;
  $$('[data-depth-exposure]').forEach(b=>b.setAttribute('aria-pressed',String(Math.abs(Number(b.dataset.depthExposure)-(context.exploration?.exploded||0))<.001)));
 }
 function renderPaths(){
  const paths=context.inspection.functionalPaths||[],selected=paths.find(p=>p.id===context.inspection.functionalPath),path=selected||paths[0];
  html('#depth-paths',paths.length?`<div class="depth-path-heading"><div><p class="eyebrow">Physical relationship</p><h3>Follow a complete path</h3></div><button data-depth-clear-path ${context.inspection.functionalPath?'':'disabled'}>Clear trace</button></div><div class="depth-path-choices">${paths.map(p=>`<button data-depth-path="${esc(p.id)}" aria-pressed="${p.id===context.inspection.functionalPath}">${esc(p.label)}</button>`).join('')}</div>${path?`<p>${esc(path.description)}</p><ol class="depth-path-steps">${path.steps.map((s,i)=>`<li><button data-depth-path-step="${i}" data-depth-path-owner="${esc(path.id)}"><span>${i+1}</span><strong>${esc(s.label)}</strong></button><p>${esc(s.description)}</p></li>`).join('')}</ol>${chips(path.sources)}`:''}`:`<h3>Follow the system relationships</h3><p>Choose an assembly with an authored physical path, or use the selected system’s connection diagram and explanation.</p>${context.hasConnections?'<button data-depth-connections class="depth-open-diagram">Open the linked diagram →</button>':''}`);
  const workspace=workspaceFor(context.state.view,context.state.domain,context.state.workspace),graphs=ASSEMBLY_DEPENDENCIES.filter(g=>g.view===context.state.view||(workspace?.id==='information'&&g.id==='station-information-service')||(context.state.view==='station-plant'&&context.state.variant==='air'&&g.id==='station-air-treatment'));
  html('#depth-dependencies',graphs.map(graph=>{
   const scenarioId=graphScenarios.get(graph.id)||'normal',scenario=graph.scenarios.find(s=>s.id===scenarioId)||graph.scenarios[0],result=evaluateDependencyScenario(graph,scenario.id);
   return `<section class="dependency-study"><header><p class="eyebrow">Declared dependency example</p><h3>${esc(graph.label)}</h3></header><label for="dependency-${graph.id}">Change one condition</label><select id="dependency-${graph.id}" data-depth-dependency="${graph.id}">${graph.scenarios.map(s=>`<option value="${s.id}" ${s.id===scenario.id?'selected':''}>${esc(s.label)}</option>`).join('')}</select><p class="dependency-result" role="status">${esc(scenario.description)}</p><div class="depth-table-scroll"><table><thead><tr><th scope="col">Function / equipment</th><th scope="col">State in this example</th><th scope="col">Required inputs</th></tr></thead><tbody>${result.map(n=>`<tr class="${n.available?'dependency-present':'dependency-missing'}"><th scope="row"><button data-depth-concept="${esc(n.conceptId)}">${esc(n.label)}</button><small>${esc(n.kind)}</small></th><td><strong>${n.available?'Prerequisites present':'Unavailable'}</strong><span>${esc(n.reason)}</span></td><td>${graph.edges.filter(e=>e.to===n.id).map(e=>`${esc(graph.nodes.find(x=>x.id===e.from)?.label)} <small>(${esc(e.label)})</small>`).join('<br>')||'Origin of this example'}</td></tr>`).join('')}</tbody></table></div><p class="depth-boundary">${esc(graph.boundary)}</p>${chips(graph.sources)}</section>`;
  }).join(''));
  const showPoint=['communications-scada','station-networks','occ-supervision'].includes(context.state.view);$('#depth-point').hidden=!showPoint;
  if(showPoint){const trace=buildPointTrace(pointScenario);html('#depth-point',`<section class="point-study"><p class="eyebrow">Invented observation record</p><h3>A value keeps its identity, time and quality</h3><label for="point-example">Inspect the record</label><select id="point-example"><option value="current" ${pointScenario==='current'?'selected':''}>Matching record</option><option value="delayed" ${pointScenario==='delayed'?'selected':''}>Delayed delivery</option><option value="mismatched" ${pointScenario==='mismatched'?'selected':''}>Different source identity</option><option value="uncertain" ${pointScenario==='uncertain'?'selected':''}>Qualified observation</option></select><div class="point-record-stages"><div><span>1 · Source</span><strong>${trace.source.value}${esc(trace.source.units)}</strong><small>${esc(trace.source.pointId)}</small><p>Observed at ${trace.source.sourceTime.toFixed(1)} s<br>${esc(trace.source.quality)}</p></div><div><span>2 · Received</span><strong>${trace.received.receivedTime.toFixed(1)} s</strong><p>Source time remains ${trace.source.sourceTime.toFixed(1)} s.<br>Identity ${trace.identityMatches?'matches':'differs from'} the expected point.</p></div><div><span>3 · Display</span><strong>${trace.age.toFixed(1)} s old</strong><p>Displayed at ${trace.displayTime.toFixed(1)} s.<br>No freshness limit is prescribed.</p></div></div><p role="status">${esc(trace.interpretation)}</p><p class="depth-boundary">${esc(trace.boundary)}</p>${chips(['DP05'])}</section>`);}
 }
 function renderStudy(){
  const workspace=workspaceFor(context.state.view,context.state.domain,context.state.workspace);
  const candidates=ANATOMY_STUDIES.filter(s=>s.view===context.state.view||s.workspace===workspace?.id);
  const preferred=context.state.studyId||lessonId;
  const study=candidates.find(s=>s.id===preferred)||candidates.find(s=>s.view===context.state.view)||candidates[0];lessonId=study?.id||'';
  html('#anatomy-study',candidates.map(s=>`<option value="${s.id}">${reviewed[s.id]?'✓ ':''}${esc(s.title)}</option>`).join(''));$('#anatomy-study').value=lessonId;
  html('#depth-study',study?`<div class="depth-study-intro"><h3>${esc(study.question)}</h3><p>${esc(study.explanation)}</p><button data-depth-open-study="${study.id}">Open this study in context →</button></div><ol class="depth-lesson-steps">${study.steps.map((s,i)=>`<li><button data-depth-study-step="${i}"><span>${i+1}</span><strong>${esc(s.label)}</strong></button><p>${esc(s.text)}</p></li>`).join('')}</ol><details class="depth-check"><summary>Explain it, then compare</summary><p>${esc(study.answer||study.explanation)}</p><p>Locate the evidence in the model or diagram and identify what the example leaves unresolved.</p></details><label class="depth-review"><input type="checkbox" data-depth-reviewed="${study.id}" ${reviewed[study.id]?'checked':''}> I reviewed this study and its limits</label><p class="depth-boundary">${esc(study.boundary)}</p>${chips(study.sources)}`:'<p>Choose one of the connected studies to inspect its parts, paths and evidence.</p>');
 }
 host.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;let handled=true;
  if(b.dataset.depthTab){setTab(b.dataset.depthTab);}
  else if(b.dataset.anatomyToggle){const id=b.dataset.anatomyToggle;if(expanded.has(id))expanded.delete(id);else expanded.add(id);renderTree();$$('[data-anatomy-toggle]').find(el=>el.dataset.anatomyToggle===id)?.focus({preventScroll:true});}
  else if(b.dataset.anatomyInstance){actions.instance(b.dataset.anatomyInstance);}
  else if(b.dataset.depthMode){actions.mode(b.dataset.depthMode);}
  else if(b.hasAttribute('data-depth-focus')){actions.focus();}
  else if(b.hasAttribute('data-depth-parent')){const parent=context.inspection.ancestors?.slice(0,-1).reverse().find(n=>n.conceptId);if(parent)actions.instance(parent.instanceId);}
  else if(b.dataset.depthExposure){actions.exposure(Number(b.dataset.depthExposure));}
  else if(b.dataset.depthPath){actions.path(b.dataset.depthPath);}
  else if(b.hasAttribute('data-depth-clear-path')){actions.path(null);}
  else if(b.dataset.depthPathStep!==undefined){const path=context.inspection.functionalPaths.find(p=>p.id===b.dataset.depthPathOwner),step=path?.steps[Number(b.dataset.depthPathStep)];if(step){step.instanceId?actions.instance(step.instanceId):step.conceptId&&actions.concept(step.conceptId);actions.path(path.id);}}
  else if(b.dataset.depthConcept){actions.concept(b.dataset.depthConcept);}
  else if(b.hasAttribute('data-depth-connections')){actions.connections();}
  else if(b.dataset.depthOpenStudy){const study=ANATOMY_STUDIES.find(s=>s.id===b.dataset.depthOpenStudy);if(study)actions.study(study);}
  else if(b.dataset.depthStudyStep!==undefined){const study=ANATOMY_STUDIES.find(s=>s.id===lessonId),step=study?.steps[Number(b.dataset.depthStudyStep)];if(step)actions.studyStep(study,step);}
  else handled=false;
  if(handled){event.preventDefault();event.stopPropagation();}
 });
 host.addEventListener('input',event=>{if(event.target.id==='anatomy-search'){filter=event.target.value;renderTree();}});
 host.addEventListener('change',event=>{
  const input=event.target;
  if(input.id==='anatomy-all-instances')actions.allInstances(input.checked);
  else if(input.id==='anatomy-study'){lessonId=input.value;actions.studyChoice(lessonId);renderStudy();}
  else if(input.dataset.depthDependency){graphScenarios.set(input.dataset.depthDependency,input.value);renderPaths();$('#dependency-'+input.dataset.depthDependency)?.focus({preventScroll:true});}
  else if(input.id==='point-example'){pointScenario=input.value;renderPaths();$('#point-example')?.focus({preventScroll:true});}
  else if(input.dataset.depthReviewed){reviewed[input.dataset.depthReviewed]=input.checked;try{localStorage.setItem('railway-anatomy-studies-v1',JSON.stringify(reviewed));}catch{}}
 });
 return {render(next){context=next;host.hidden=!next.inspection||next.state.view==='railway'||next.state.page==='learn';if(host.hidden)return;renderTree();renderSelected();renderPaths();renderStudy();labs.render(next);setTab(tab);},setTab};
}
