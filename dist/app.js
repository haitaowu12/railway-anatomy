import {SHORT_LABELS as shortLabels} from './labels.js';
import {DEFAULT_TECHNOLOGY,PROPULSION_CHOICES,CONTROL_CHOICES,normalizeTechnology,technologyFromUrl,technologyForView,technologyForComponent,controlRoute,technologyNote,technologyFlow} from './technology.js';
import {NAVIGATION_GROUPS,VIEW_GROUPS,VIEW_PARENTS,domainForView,viewTrail,routeState,PROPULSION_EFFECTS,CONTROL_EFFECTS} from './navigation.js';
import {NETWORK_DESTINATIONS} from './network-data.js';
import {technologyControlsFor,comparisonLabel,animationFor,canAnimate,placeModelLabels} from './comparisons.js';
import {DEFAULT_ELECTRIFICATION,ELECTRIFICATION_CHOICES,normalizeElectrification,electrificationForComponent,electrificationProfile,electrificationNote,electrificationFlow} from './electrification.js';
import {PROCESS_VIEWS,PEOPLE_ROLES,TRAIN_CONTROL_TAXONOMY} from './process-data.js';
import {PROCESS_REDIRECTS,PROCESS_COMPONENTS,processFor,renderProcessPage,renderPeoplePage} from './process-ui.js';
import {topologyMarkup} from './topology-ui.js';
import {ABOUT_HTML} from './project-about.js';
import {READING_GUIDES} from './reading-guides.js';
import {SOURCES,CONCEPTS,ARCHITECTURES} from './catalog.js';
import {TOURS} from './tours.js';
import {DOMAINS,VIEWS,RELATED,MODES,EXPERIMENTS,targetFor,domainFor,viewFor,applyExperiment,describeFlow,wheelEstimate,variantFor,variantsFor,defaultVariant,cutawayFor,PART_CONTEXTS} from './model.js';

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parts=new Map(CONCEPTS.map(c=>[c.id,c]));
const sources=new Map(SOURCES.map(s=>[s.id,s]));
let savedTechnology={};try{savedTechnology=JSON.parse(localStorage.getItem('railway-anatomy-technology-v1')||'{}');}catch{}
let state={technology:technologyFromUrl(location.search,savedTechnology),electrification:normalizeElectrification(new URLSearchParams(location.search).get('electrification')),presentation:'equipment',processId:'configuration-change',processStep:'',roleId:'traffic-coordinator',page:'explore',domain:'network',view:'railway',component:'network-overview',mode:'coasting',scenario:'nominal',variant:'movement',sink:'train',cutaway:true,exploded:0,explodeScope:'all',playing:false,labels:true,labelMode:'nearby',lesson:0};
let historyMode='replace',returnContext=null,lastReadUrl='',allComponents=false,configurationEffect='',lastDetailKey='';
let viewer=null, rendererStatus='', loadingViewer=false, labelFrame=0,lastLabelTime=0,lastExplorationContext='';
let lessonAnswers={}, lessonAttempts={}, quizSelections={};
const progressKey='railway-anatomy-learning-v2';
try{const saved=JSON.parse(localStorage.getItem(progressKey)||'{}');for(const t of TOURS){if(saved.completed?.[t.id]===true)lessonAnswers[t.id]=true;if(Number.isInteger(saved.choices?.[t.id])&&saved.choices[t.id]>=0&&saved.choices[t.id]<t.choices.length)quizSelections[t.id]=saved.choices[t.id];if(Number.isFinite(saved.attempts?.[t.id]))lessonAttempts[t.id]=Math.max(0,saved.attempts[t.id]);}}catch{}
function saveProgress(){try{localStorage.setItem(progressKey,JSON.stringify({completed:lessonAnswers,choices:quizSelections,attempts:lessonAttempts}));}catch{}}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const labelElements=new Map();
let labelLayoutKey='',stableLabelPositions=[];
const isProcessPage=()=>state.page==='processes'||state.page==='people'||state.page==='learn'&&Boolean(processFor(state.view,state.component));
const currentTopology=()=>VIEWS[state.view]?.variants?.find(v=>v.id===state.variant)?.topology||null;
const flowFor=()=>electrificationFlow(state,technologyFlow(state,describeFlow(state)));
const modelNote=()=>electrificationNote(state)||technologyNote(state,VIEWS[state.view].note);


function sourceChips(ids){return `<div class="source-chips">${[...new Set(ids)].filter(id=>sources.has(id)).map(id=>`<button data-source="${id}" title="${safe(sources.get(id).title)}">${safe(sources.get(id).publisher)} ↗</button>`).join('')}</div>`;}
function announce(text){$('#announce').textContent=text;}
function focusVisible(selector){const node=$$(selector).find(el=>!el.closest('[hidden]')&&el.getClientRects().length);if(node){node.focus({preventScroll:true});return;}const heading=$$('h1').find(el=>!el.closest('[hidden]')&&el.getClientRects().length);if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}}
function rememberCurrentEntry(){history.replaceState({railway:routeState(state),returnContext},'',location.href);}
function writeHash(){
  const value=state.page==='people'?`people/${state.roleId||'traffic-coordinator'}`:state.page==='processes'?`processes/${state.processId}/${state.processStep||''}`:state.page==='reference'?'reference':state.page==='learn'?`learn/${TOURS[state.lesson].id}`:`explore/${state.domain}/${state.view}/${state.component}${state.variant!=='default'?'/'+state.variant:''}`;
  const url=new URL(location.href);url.searchParams.set('propulsion',state.technology.propulsion);url.searchParams.set('control',state.technology.control);if(state.electrification&&state.electrification!==DEFAULT_ELECTRIFICATION)url.searchParams.set('electrification',state.electrification);else url.searchParams.delete('electrification');if(state.presentation==='connections')url.searchParams.set('presentation','connections');else url.searchParams.delete('presentation');url.hash=value;
  for(const [key,value,initial] of [['mode',state.mode,['power','vehicle'].includes(state.domain)?'motoring':'coasting'],['scenario',state.scenario,'nominal'],['sink',state.sink,'train']]){
    if(value!==initial)url.searchParams.set(key,value);else url.searchParams.delete(key);
  }
  const next=url.pathname+url.search+url.hash,current=location.pathname+location.search+location.hash;
  if(next!==current||historyMode==='replace')history[historyMode==='push'&&next!==current?'pushState':'replaceState']({railway:routeState(state),returnContext},'',next);
  historyMode='replace';lastReadUrl=location.href;
  try{localStorage.setItem('railway-anatomy-technology-v1',JSON.stringify(state.technology));}catch{}
}
function readHash(){
  const [page,a,b,c,v]=location.hash.slice(1).split('/');
  state.technology=technologyFromUrl(location.search,savedTechnology);
  state.electrification=normalizeElectrification(new URLSearchParams(location.search).get('electrification'));
  state.presentation=new URLSearchParams(location.search).get('presentation')==='connections'?'connections':'equipment';
  if(page==='people'){state.page='people';state.roleId=PEOPLE_ROLES.some(r=>r.id===a)?a:PEOPLE_ROLES[0].id;}
  else if(page==='processes'){state.page='processes';state.processId=PROCESS_VIEWS[a]?a:'configuration-change';state.processStep=PROCESS_VIEWS[state.processId].steps.some(s=>s.id===b)?b:PROCESS_VIEWS[state.processId].steps[0].id;}
  else if(page==='reference'){state.page='reference';}
  else if(page==='learn'){
    state.page='learn';state.lesson=Math.max(0,TOURS.findIndex(t=>t.id===a));applyLesson(false);
  }else{
    state.page='explore';
    const domain=DOMAINS.find(d=>d.id===a)||DOMAINS.find(d=>d.id==='network');
    Object.assign(state,{domain:domain.id,view:domain.view,component:domain.component});
    if(VIEWS[b])state.view=b;if(state.view==='electrification'&&['dc','ac'].includes(v))state.electrification=normalizeElectrification(v);
    state.domain=domainForView(state.view,DOMAINS,domain.id)?.id||domain.id;
    if(parts.has(c))state.component=c;else state.component=VIEWS[state.view].component;
    state.variant=VIEWS[state.view].variants?.some(x=>x.id===v)?v:variantFor(state.component,state.view);
    if(state.variant!=='default'&&!VIEWS[state.view].variants?.some(x=>x.id===state.variant))state.variant=defaultVariant(state.view);
    state.cutaway=cutawayFor(state.view);state.exploded=0;state.explodeScope='all';
    const q=new URLSearchParams(location.search);
    state.mode=MODES.some(x=>x.id===q.get('mode'))?q.get('mode'):['power','vehicle'].includes(state.domain)?'motoring':'coasting';
    state.scenario=['nominal','radio-loss','door-open','wheel-slip','regen-limited'].includes(q.get('scenario'))?q.get('scenario'):'nominal';
    state.sink=q.get('sink')==='resistor'?'resistor':'train';
  }
  state.technology=technologyForView(technologyForComponent(state.technology,state.component),state.view,state.variant);
  if(!state.view?.startsWith('power-'))state.electrification=electrificationForComponent(state.electrification,state.component);
  const redirected=(state.view==='depot-support'&&state.variant==='planning'?'maintenance-release':null)||(['operations-centre','occ-workplace'].includes(state.view)&&state.variant==='handover'?'duty-handover':state.view==='operations-centre'&&state.variant==='incident'?'incident-coordination':null)||processFor(state.view,state.component);if(state.page==='explore'&&redirected){state.page='processes';state.processId=redirected;state.processStep=PROCESS_VIEWS[redirected].steps[0].id;}
  configurationEffect='';allComponents=false;
}

function activeDomain(){return DOMAINS.find(d=>d.id===state.domain);}
function syncViewer(changedView=false){
  if(!viewer)return;
  if(isProcessPage()||state.page==='reference'){viewer.setPlaying(false);return;}
  if(!canAnimate(VIEWS[state.view],state.variant))state.playing=false;
  const context=[state.view,state.variant,state.component,state.technology.propulsion,state.technology.control,state.electrification].join('/');
  if(lastExplorationContext&&context!==lastExplorationContext&&state.explodeScope==='selected'){state.exploded=0;state.explodeScope='all';}
  lastExplorationContext=context;
  viewer.setTechnology(state.technology);viewer.setElectrification?.(state.electrification);
  if(changedView||viewer.getView?.()!==state.view)viewer.setView(state.view);
  viewer.setVariant(state.variant);viewer.setMode(state.mode);viewer.setScenario(state.scenario);viewer.setReceptivity(state.sink);
  viewer.setSelected(['network-overview','depot-layout','operations-centre'].includes(state.component)?null:targetFor(state.component));
  viewer.setCutaway(state.cutaway);
  const requestedScope=state.explodeScope||'all';
  state.explodeScope=viewer.setExplodeScope?.(requestedScope)||'all';
  if(requestedScope==='selected'&&state.explodeScope!=='selected')state.exploded=0;
  viewer.setExploded(state.exploded);viewer.setSignals(['track','control','communications','station','operations','depot'].includes(state.domain));
  state.playing=viewer.setPlaying(state.playing);syncControls();
}
function syncControls(){
  const presentation=viewer?.getExplorationState?.();
  if(presentation){state.exploded=presentation.exploded;state.explodeScope=presentation.explodeScope;}
  $('#cutaway').checked=state.cutaway;$('#explode').value=state.exploded;$('#label-density').value=state.labels?(state.labelMode||'nearby'):'off';
  $('#play').textContent=state.playing?'Ⅱ Pause':'▶ Animate';$('#play').setAttribute('aria-pressed',String(state.playing));
  $('#play').disabled=reducedMotion.matches;
  $('.animation').hidden=!canAnimate(VIEWS[state.view],state.variant);
  $('#play').title=reducedMotion.matches?'Reduced motion is enabled. Use the phase slider to inspect each state.':'Animate the model';
  const capabilities=viewer?.getViewCapabilities();
  $('#cutaway').closest('label').hidden=state.view==='railway'||capabilities?.cutaway===false;$('#separation-controls').hidden=state.view==='railway'||capabilities?.explode===false;
  const selected=targetFor(state.component),overview=['network-overview','depot-layout','operations-centre'].includes(selected);
  const exploration=viewer?.getExplorationCapabilities?.(selected),current=viewer?.getExplorationState?.();
  $('#exploration-selection').textContent=overview?'Explore the model':`Selected: ${shortLabels[state.component]||parts.get(state.component)?.label||''}`;
  $('#focus-selection').hidden=overview||!exploration?.canFocus;
  $('#isolate-selection').hidden=overview||!exploration?.canIsolate;
  $('#isolate-selection').setAttribute('aria-pressed',String(Boolean(current?.isolation)));
  $('#isolate-selection').textContent=current?.isolation?'Assembly isolated':'Isolate assembly';
  $('#restore-context').hidden=!current?.isolation&&!current?.canRestoreFrame;
  $('#explode-scope').value=current?.explodeScope||'all';
  $('#explode-scope option[value="selected"]').disabled=!exploration?.canExplodeSelected;
  $('#exploration-note').hidden=!(current?.isolation||current?.explodeScope==='selected');
  $('#exploration-note').textContent=current?.explodeScope==='selected'?`${exploration?.internalSeparationCount||exploration?.separatedPartCount||0} separable internal parts in this assembly. Other equipment stays assembled.`:current?.isolation?'Showing the selected assembly. Restore the scene to see its surrounding equipment.':'';
  updateMotionGuide();
  $('#render-badge').textContent=rendererStatus==='svg'?'Schematic · SVG':'Schematic · 3D';
}
function renderNavigation(){
  $$('.main-nav [data-page]').forEach(b=>{if(b.dataset.page===(state.page==='people'?'processes':state.page))b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  $('#explorer-page').hidden=state.page==='reference'||isProcessPage();$('#reference-page').hidden=state.page!=='reference';$('#processes-page').hidden=!isProcessPage();
  const d=activeDomain(),network=DOMAINS.find(x=>x.id==='network');
  $('#intro-copy').textContent=state.page==='learn'?'Inspect the model, then check your understanding.':state.domain==='network'?'Select an area to see its equipment and connections.':'Select equipment in the model or browse the components below.';
  $('#intro-copy').hidden=state.page!=='learn'&&state.domain!=='network';
  const viewButtons=ids=>ids.filter(id=>VIEWS[id]&&!PROCESS_REDIRECTS[id]).map(id=>`<button data-view="${id}" class="${id===state.view?'active':''}" ${id===state.view?'aria-current="location"':''}>${safe(VIEWS[id].label)}</button>`).join('');
  const domainViews=item=>{const groups=VIEW_GROUPS[item.id];if(!groups)return viewButtons(item.views);const grouped=new Set(groups.flatMap(g=>g.views));return groups.map(g=>`<div class="view-subgroup"><h3>${safe(g.label)}</h3>${viewButtons(g.views)}</div>`).join('')+(item.id==='communications'?'':viewButtons(item.views.filter(id=>!grouped.has(id))));};
  const domainButton=item=>`<button data-domain="${item.id}" class="domain-button ${item.id===state.domain?'active':''}" aria-pressed="${item.id===state.domain}"><strong>${safe(item.label)}</strong></button>${item.id===state.domain&&item.views.length>1?`<div class="area-views">${domainViews(item)}</div>`:''}`;
  $('#domains').innerHTML=`<button class="network-home ${state.domain==='network'?'active':''}" data-domain="network" aria-pressed="${state.domain==='network'}"><span class="network-mark" aria-hidden="true">00</span><strong>Whole railway</strong><small>Network & connections</small></button>`+NAVIGATION_GROUPS.map(g=>`<div class="navigation-group"><h2>${safe(g.label)}</h2>${g.ids.map(id=>DOMAINS.find(x=>x.id===id)).filter(Boolean).map(domainButton).join('')}</div>`).join('');
  $('#navigator-current').textContent=d.label;
  const trail=viewTrail(state.view,VIEWS).filter(id=>id!==network.view);
  $('#location-trail').innerHTML=`<button data-domain="network">Railway</button>`+(state.domain==='network'?'':`<span aria-hidden="true">/</span><button data-domain="${d.id}">${safe(d.label)}</button>`)+trail.filter(id=>id!==d.view).map(id=>`<span aria-hidden="true">/</span><button data-view="${id}" ${id===state.view?'aria-current="location"':''}>${safe(VIEWS[id].label)}</button>`).join('');
  $('#return-context').hidden=!returnContext;
  if(returnContext)$('#return-context').textContent=`← Return to ${VIEWS[returnContext.view]?.label||'previous view'}`;
  const viewIds=[...new Set([...d.views,state.view])].filter(id=>!PROCESS_REDIRECTS[id]);
  $('.scene-toolbar').hidden=viewIds.length<=1;
  $('#view-choice').innerHTML=viewIds.map(id=>`<option value="${id}">${safe(VIEWS[id].label)}</option>`).join('');
  $('#view-choice').value=state.view;
  $('#scene-index').textContent=`${d.label} / ${VIEWS[state.view].level||'System & equipment'}`;
  $('#scene-title').textContent=VIEWS[state.view].label;
  const controls=technologyControlsFor(state.view);
  $('#technology-panel').hidden=!controls.propulsion&&!controls.control;
  $('#electrification-context').hidden=!controls.electrification;$('#electrification-choice').value=state.electrification;
  $('#propulsion-context').hidden=!controls.propulsion;$('#control-context').hidden=!controls.control;
  $('#propulsion-choice').disabled=!controls.propulsion;$('#control-choice').disabled=!controls.control;
  $('#propulsion-choice').value=state.technology.propulsion;$('#control-choice').value=state.technology.control;
  $('#propulsion-context label').textContent=state.view==='guideway'?'Guideway propulsion interface':'Drive arrangement';
  $('#configuration-effect').hidden=!configurationEffect;$('#configuration-effect').textContent=configurationEffect;
  $('#model-key').textContent=modelNote()+(state.exploded>=.5?' Message paths are hidden while parts are separated.':'');
  $('#tour-bar').hidden=state.page!=='learn';
  $('#tour-bar').innerHTML=`<label for="tour-select">Guided tour</label><select id="tour-select">${TOURS.map((t,i)=>`<option value="${i}" ${state.lesson===i?'selected':''}>${lessonAnswers[t.id]?'✓ ':''}${safe(t.label)}</option>`).join('')}</select><span>${Object.keys(lessonAnswers).length} of ${TOURS.length} checked</span>`;
}

function renderDetail(){
  const c=parts.get(state.component);
  if(lastDetailKey!==state.component){$('.inspector').scrollTop=0;lastDetailKey=state.component;}
  const related=(RELATED[c.id]||activeDomain().parts.filter(id=>id!==c.id).slice(0,3)).filter(id=>parts.has(id));
  const contexts=[...new Set([viewFor(c.id),...(PART_CONTEXTS[c.id]||[])])].filter(id=>VIEWS[id]&&id!==state.view&&!PROCESS_REDIRECTS[id]);
  const level=({'network-overview':'Railway','network-route':'Route','network-station':'Place','network-turnback':'Track connection','network-train':'Vehicle','network-depot':'Facility','network-maintenance':'Facility','network-stabling':'Area','network-control-centre':'Facility','network-substation':'Subsystem','network-telecommunications':'System','depot-layout':'Facility','operations-centre':'Facility'})[c.id]||'Equipment';
  const destination=NETWORK_DESTINATIONS[c.id];
  $('#selection-summary').innerHTML=`<strong>${safe(shortLabels[c.id]||c.label)}</strong><button id="read-selection">Read explanation</button>${destination?`<button data-destination="${c.id}">Explore area →</button>`:''}`;
  const drilldown=destination?`<button class="open-area" data-destination="${c.id}">Explore ${safe(VIEWS[destination.view]?.label||c.label)} →</button>`:'';
  const anchor=targetFor(c.id)!==c.id?`<p class="practice-note">Model anchor: ${safe(parts.get(targetFor(c.id))?.label||targetFor(c.id))}. This concept is shown in its equipment context.</p>`:'';
  $('#component-detail').innerHTML=`<p class="part-kicker">${safe(domainFor(c.id).label)} / ${level}</p><h2 class="part-title">${safe(c.label)}</h2><p class="part-summary">${safe(c.summary)}</p>${drilldown}${anchor}<h3 class="detail-heading">How it works</h3>${c.details.map(p=>`<p class="part-detail">${safe(p)}</p>`).join('')}${c.caveat?`<details class="part-scope"><summary>Scope of this example</summary><p class="part-note">${safe(c.caveat)}</p></details>`:''}<h3 class="detail-heading">Interfaces & connected equipment</h3><div class="related">${related.map(id=>`<button data-component="${id}">${safe(shortLabels[id]||parts.get(id).label)}</button>`).join('')}</div>${contexts.length?`<h3 class="detail-heading">Inspect at another scale</h3><div class="related">${contexts.map(id=>`<button data-inspect-view="${id}">${safe(VIEWS[id].label)}</button>`).join('')}</div>`:''}${sourceChips(c.sources)}${c.sources.length?'':'<p class="practice-note">A declared teaching-model choice; no equipment specification is implied.</p>'}<div class="inspector-links"><button data-focus="${targetFor(c.id)}">Locate in model</button><button data-reference="${c.id}">Read in field guide →</button></div>`;
  const guides=READING_GUIDES.filter(g=>g.domain===state.domain&&(!g.view||g.view===state.view));
  if(guides.length)$('#component-detail').insertAdjacentHTML('beforeend',`<div class="system-reading">${guides.map(g=>`<button data-reading-guide="${g.id}">${safe(g.title)} →</button>`).join('')}</div>`);
  $('#component-detail').hidden=state.page==='learn';$('#lesson-detail').hidden=state.page!=='learn';
  const visible=new Set(viewer?.getVisibleComponentIds()||[]);
  const candidates=allComponents?activeDomain().parts:[...new Set([...activeDomain().parts,...CONCEPTS.map(c=>c.id)])];
  const current=candidates.filter(id=>!PROCESS_COMPONENTS[id]&&(allComponents||!viewer||visible.has(targetFor(id))));
  $('#component-eyebrow').textContent=`${activeDomain().label} / ${current.length} ${allComponents?'components':'in this view'}`;
  $('#component-heading').textContent=allComponents?'Equipment in this area':'Equipment in this view';
  $('#component-scope').textContent=allComponents?'Show this view only':'Browse the whole area';$('#component-scope').setAttribute('aria-pressed',String(allComponents));
  $('#component-grid').innerHTML=current.map((id,i)=>{const p=parts.get(id);return `<button data-component="${id}" class="${id===c.id?'active':''}" aria-pressed="${id===c.id}"><span class="component-number">${String(i+1).padStart(2,'0')}</span><span><strong>${safe(p.label)}</strong><small>${safe(p.summary)}</small></span><span class="row-arrow" aria-hidden="true">↗</span></button>`;}).join('');
}
function renderScenario(){
  const flow=flowFor(),variants=VIEWS[state.view].variants?.filter(v=>v.presentation!=='process'),electrical=!variants&&(['power','vehicle'].includes(state.domain)&&state.view!=='services'||state.view==='guideway');
  $('.arrangement-bar').hidden=variants?.length===1;
  $('#arrangement-label').textContent=comparisonLabel(state.view,Boolean(variants),electrical);
  $('#scenario-heading').textContent=variants?'How this arrangement works':electrical?'Follow the energy':state.domain==='control'?'Trace the decisions':state.domain==='communications'?'Follow the messages':'Explore the supporting systems';
  $('#scenario-buttons').innerHTML=variants?variants.map(x=>`<button data-variant="${x.id}" class="${x.id===state.variant?'active':''}" aria-pressed="${x.id===state.variant}">${x.label}</button>`).join(''):(electrical?MODES:EXPERIMENTS[state.view==='services'?'services':state.domain]||MODES).filter(x=>x.id!=='radio-loss'||['loop','radio','etcs2'].includes(state.technology.control)).map(x=>`<button data-experiment="${x.id}" class="${x.id===(electrical?state.mode:state.scenario)?'active':''}" aria-pressed="${x.id===(electrical?state.mode:state.scenario)}">${x.id==='radio-loss'&&state.technology.control==='loop'?'Hold loop update':x.label}</button>`).join('');
  $('#receptivity [data-sink="resistor"]').textContent=electrificationProfile(state.electrification).resistorLocation==='onboard'?'Onboard resistor':'Wayside resistor';
  $('#receptivity').hidden=!(electrical&&state.mode==='regeneration');
  $$('[data-sink]').forEach(b=>{b.classList.toggle('active',b.dataset.sink===state.sink);b.setAttribute('aria-pressed',String(b.dataset.sink===state.sink));});
  $('#flow-path').innerHTML=flow.nodes.map((n,i)=>`${i?`<span class="flow-arrow" aria-hidden="true">${flow.parallel?'·':'→'}</span>`:''}<span class="flow-node ${flow.kind||''}">${safe(n)}</span>`).join('');
  $('#scenario-title').textContent=flow.title;$('#scenario-description').textContent=flow.description;$('#scenario-sources').innerHTML=sourceChips(flow.sources);
  $('#sensor-lab').hidden=!(state.domain==='control'&&(state.scenario==='wheel-slip'||['tachometer','accelerometer','balise'].includes(state.component)));
}
function updateMotionGuide(){
  const guide=animationFor(VIEWS[state.view],state.variant),phase=viewer?.getPhase?.()||0;
  const fraction=!state.playing&&phase===5?1:((phase%5)+5)%5/5;
  if(document.activeElement!==$('#phase'))$('#phase').value=String(fraction);
  $('#phase-value').value=`${Math.round(fraction*100)}%`;
  $('#motion-guide').hidden=!guide;
  if(!guide)return;
  $('#motion-title').textContent=guide.label;
  const steps=guide.steps||[],index=steps.reduce((best,step,i)=>fraction+.001>=step.at?i:best,0);
  const key=`${state.view}/${state.variant}`;
  if($('#motion-steps').dataset.guide!==key){
    $('#motion-steps').dataset.guide=key;
    $('#motion-steps').innerHTML=steps.map((step,i)=>`<button data-motion-phase="${step.at}" data-motion-step="${i}">${safe(step.label)}</button>`).join('');
  }
  $$('#motion-steps button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});
  $('#motion-caption').textContent=steps[index]?.description||'';
}
function renderLesson(){
  if(state.page!=='learn')return;
  const t=TOURS[state.lesson];
  const lessonHost=isProcessPage()?$('#process-lesson'):$('#lesson-detail');if(!lessonHost)return;lessonHost.innerHTML=`<div class="lesson-body"><button class="back-guide" data-explore-component="${state.component}">← Explore freely</button><p class="part-kicker">Guided tour ${state.lesson+1} / ${TOURS.length}</p><h3>${safe(t.title)}</h3><p>${safe(t.explanation)}</p>${state.component!==t.component?`<div class="selected-in-tour"><strong>${safe(parts.get(state.component).label)}</strong><p>${safe(parts.get(state.component).summary)}</p><button data-explore-component="${state.component}">Open component explanation →</button></div>`:''}<div class="try-action"><strong>${isProcessPage()?'Explore the process':'Try it in the model'}</strong>${safe(t.actionText)}<button id="lesson-action">${safe(t.actionLabel)} ↗</button></div><div class="question"><h4 id="quiz-title">${safe(t.question)}</h4><fieldset aria-labelledby="quiz-title">${t.choices.map((v,i)=>`<label class="answer-choice"><input type="radio" name="quiz-answer" value="${i}" ${quizSelections[t.id]===i?'checked':''}><span>${safe(v)}</span></label>`).join('')}</fieldset><button class="check-answer" id="check-answer">Check understanding</button><div id="quiz-feedback" role="status" tabindex="-1" hidden></div><p class="practice-note">Optional self-check. Retry or move on at any time. Progress stays on this device.</p></div>${sourceChips([...new Set(t.sourceConcepts.flatMap(id=>parts.get(id).sources))])}<div class="lesson-nav"><button id="previous-lesson" ${state.lesson===0?'disabled':''}>← Previous</button><button id="next-lesson">${state.lesson===TOURS.length-1?'Finish & explore':'Next tour →'}</button></div></div>`;
  if(quizSelections[t.id]!==undefined)showFeedback(quizSelections[t.id]===t.answer);
}
function showFeedback(correct,choice=quizSelections[TOURS[state.lesson].id]){
  const t=TOURS[state.lesson],out=$('#quiz-feedback');if(!out)return;
  out.hidden=false;out.className=`feedback ${correct?'':'incorrect'}`;
  out.textContent=choice===undefined?'Select an answer to check it.':`${t.feedback[choice]}${correct?(lessonAttempts[t.id]>1?' Completed with a retry.':' Understanding checked.'):' Try another choice or revisit the model.'}`;
}
function renderReference(){
  const q=$('#reference-search').value.trim().toLowerCase(),filter=$('#reference-domain').value;
  const guides=READING_GUIDES.filter(g=>(filter==='all'||g.domain===filter)&&[g.title,g.summary,...g.sections.map(s=>s.text)].join(' ').toLowerCase().includes(q));
  $('#reading-guides').hidden=!guides.length;
  $('#reading-guides').innerHTML=`<h3>Systems in context</h3>${guides.map(g=>`<details id="reading-${g.id}" class="reading-guide"><summary>${safe(g.title)}</summary><div><p class="reading-summary">${safe(g.summary)}</p>${g.sections.map(s=>`<h4>${safe(s.heading)}</h4><p>${safe(s.text)}</p>${s.sources?sourceChips(s.sources):''}`).join('')}${sourceChips(g.sources)}<button class="open-in-model" ${g.domain==='processes'?`data-process="configuration-change"`:g.domain==='people'?`data-people="all"`:g.component?`data-explore-component="${g.component}"`:`data-domain="${g.domain}"`}>Open the study →</button></div></details>`).join('')}`;
  const match=c=>(filter==='all'||domainFor(c.id).id===filter)&&[c.label,c.summary,...c.details,...c.sources.map(id=>sources.get(id).title)].join(' ').toLowerCase().includes(q);
  const found=CONCEPTS.filter(match);$('#reference-count').textContent=`${found.length} concepts`;
  $('#reference-results').innerHTML=DOMAINS.filter(d=>filter==='all'||d.id===filter).map(d=>{
    const items=found.filter(c=>d.parts.includes(c.id));if(!items.length)return '';
    return `<section class="reference-group"><h3>${d.label}</h3>${items.map(c=>`<details class="reference-card" id="reference-${c.id}"><summary>${safe(c.label)}</summary><div><p><strong>${safe(c.summary)}</strong></p>${c.details.map(p=>`<p>${safe(p)}</p>`).join('')}${c.caveat?`<p class="part-note">${safe(c.caveat)}</p>`:''}${sourceChips(c.sources)}<button class="open-in-model" data-explore-component="${c.id}">${processFor(viewFor(c.id),c.id)?'Open the process':'Explore this equipment'} ↗</button></div></details>`).join('')}</section>`;
  }).join('')||'<p>No components match. Try a shorter term or another system.</p>';
}
function openProcess(id,step=''){
  if(!PROCESS_VIEWS[id])return;
  state.page='processes';state.processId=id;state.processStep=step||PROCESS_VIEWS[id].steps[0].id;state.playing=false;
  render();announce(PROCESS_VIEWS[id].title);
}
function renderSystemContext(){
  const orientation=$('#control-orientation'),taxonomy=TRAIN_CONTROL_TAXONOMY;
  orientation.hidden=state.domain!=='control'||state.view!=='control';
  if(!orientation.hidden)orientation.innerHTML=`<h2>Three routes into train control</h2><p>Choose an architecture family, then examine the functions and equipment it uses. Detection and interlocking connect several families.</p><div class="control-families">${taxonomy.families.map(f=>`<section><h3>${safe(f.label)}</h3><p>${safe(f.summary)}</p><button data-view="${f.views[0]}">Explore ${safe(f.label)} →</button></section>`).join('')}</div><details class="control-taxonomy"><summary>Functions, shared equipment & supplier examples</summary><h3>Functions are questions, not necessarily separate computers</h3>${taxonomy.functions.map(f=>`<p><strong>${safe(f.label)}</strong> — ${safe(f.question)} ${safe(f.qualification)}</p>`).join('')}<h3>Equipment shared across arrangements</h3><div class="shared-device-list">${taxonomy.sharedDevices.map(d=>`<section><button data-component="${d.id}">${safe(d.label)} ↗</button><p>${safe(d.use)}</p></section>`).join('')}</div><h3>Public supplier examples</h3>${taxonomy.supplierExamples.map(e=>`<section class="supplier-example"><h4>${safe(e.supplier)} / ${safe(e.label)}</h4><p>${safe(e.scope)} ${safe(e.lineage||'')}</p>${sourceChips(e.sources)}</section>`).join('')}<button data-people="all" class="text-link">Explore automation and people’s responsibilities →</button></details>`;
  const roleIds={operations:['traffic-coordinator','signalling-controller','power-controller','incident-coordinator'],depot:['depot-coordinator','fleet-maintenance','maintenance-work'],station:['station-team'],vehicle:['onboard-operator'],power:['power-controller'],control:['signalling-controller']}[state.domain]||[];
  const processIds={operations:['incident-coordination','duty-handover'],depot:['maintenance-release','worksite-handback'],track:['worksite-handback'],station:['incident-coordination'],power:['configuration-change']}[state.domain]||[];
  const context=$('#people-context');context.hidden=!roleIds.length&&!processIds.length;
  context.innerHTML=`<h3>People using this equipment</h3><div class="role-links">${roleIds.map(id=>`<button data-role="${id}">${safe(PEOPLE_ROLES.find(r=>r.id===id)?.label||id)} →</button>`).join('')}</div>${processIds.length?`<details><summary>Related processes</summary>${processIds.map(id=>`<button data-process="${id}">${safe(PROCESS_VIEWS[id].title)} →</button>`).join('')}</details>`:''}`;
}
function renderConnections(){
  const topology=currentTopology(),show=Boolean(topology&&state.presentation==='connections');
  $('#presentation-switch').hidden=!topology;
  $$('#presentation-switch button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.presentation===(show?'connections':'equipment'))));
  $('.workspace-grid').classList.toggle('connections-mode',show);$('#connections-view').hidden=!show;
  if(show)$('#connections-view').innerHTML=topologyMarkup(topology,state.component);
  for(const selector of ['.stage','.selection-tools','.model-tools','.model-notes','#exploration-note','.animation','#motion-guide']){
    const element=$(selector);if(show){if(element.dataset.beforeConnections===undefined)element.dataset.beforeConnections=String(element.hidden);element.hidden=true;}else if(element.dataset.beforeConnections!==undefined){element.hidden=element.dataset.beforeConnections==='true';delete element.dataset.beforeConnections;}
  }
  if(!show)syncControls();
}
function render(changedView=false){
  if(!isProcessPage()&&state.page!=='reference'&&!currentTopology())state.presentation='equipment';
  const focused=document.activeElement;
  const focusKey=focused?.matches('#domains button,#scenario-buttons button,#location-trail button,[data-process-step],[data-process],[data-role],[data-people],[data-presentation]')?['domain','view','variant','experiment','sink','processStep','process','role','people','presentation'].find(key=>focused.dataset[key]):null;
  const focusValue=focusKey?focused.dataset[focusKey]:null;
  const restoreFocus=()=>{if(focusKey)focusVisible(`[data-${focusKey.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}="${focusValue}"]`);};
  if(isProcessPage()){
    state.playing=false;viewer?.setPlaying(false);renderNavigation();$('#lesson-detail').innerHTML='';
    if(state.page==='people')renderPeoplePage($('#processes-page'),state,{sourceChips});
    else{if(state.page==='learn'){state.processId=processFor(state.view,state.component);state.processStep=state.processStep||PROCESS_VIEWS[state.processId].steps[0].id;}renderProcessPage($('#processes-page'),state,{sourceChips,parts});if(state.page==='learn'){$('#processes-page .process-content').insertAdjacentHTML('beforeend','<section id="process-lesson" class="process-lesson"></section>');renderLesson();}}
    writeHash();restoreFocus();return;
  }
  $('#processes-page').innerHTML='';syncViewer(changedView);chooseVisibleRepresentative();renderNavigation();renderDetail();renderScenario();renderLesson();renderSystemContext();if(state.page==='reference')renderReference();syncControls();renderConnections();rebuildLabels();writeHash();
  restoreFocus();
}
function setPage(page){
  if(page==='explore'&&processFor(state.view,state.component)){setDomain('network');return;}
  state.page=page;if(page==='processes'){openProcess(state.processId);return;}
  if(page==='learn')applyLesson(true);
  else {render();if(page!=='reference')requestAnimationFrame(()=>viewer?.resize());}
}
function setDomain(id){
  const d=DOMAINS.find(d=>d.id===id);if(!d)return;
  returnContext=null;configurationEffect='';allComponents=false;
  state={...state,page:'explore',domain:id,view:d.view,component:d.component,scenario:'nominal',mode:['power','vehicle'].includes(id)?'motoring':'coasting',cutaway:cutawayFor(d.view),variant:defaultVariant(d.view),exploded:0};
  state.presentation=id==='communications'?'connections':'equipment';
  state.technology=technologyForView(state.technology,state.view,state.variant);render(true);announce(d.label);
}
function setView(id){
  if(!VIEWS[id])return;if(PROCESS_REDIRECTS[id]){openProcess(PROCESS_REDIRECTS[id]);return;}state.page=state.page==='learn'?'learn':'explore';state.presentation=id==='communications-overview'?'connections':'equipment';
  state.domain=domainForView(id,DOMAINS,state.domain)?.id||state.domain;allComponents=false;configurationEffect='';
  state.view=id;state.variant=defaultVariant(id);state.scenario='nominal';state.mode=['power','vehicle'].includes(state.domain)?'motoring':'coasting';state.exploded=0;state.cutaway=cutawayFor(id);
  state.technology=technologyForView(state.technology,id,state.variant);viewer?.setTechnology(state.technology);
  const candidates=viewer?.getComponentIds(id)||[];
  if(!candidates.includes(targetFor(state.component)))state.component=VIEWS[id].component;
  viewer?.setView(id);viewer?.setVariant(state.variant);chooseVisibleRepresentative();render(!viewer);
}
function chooseVisibleRepresentative(){
  if(!viewer)return;const visible=viewer.getVisibleComponentIds();if(visible.includes(targetFor(state.component)))return;
  const config=VIEWS[state.view],variant=config.variants?.find(x=>x.id===state.variant);
  const candidates=[variant?.component,config.component,...activeDomain().parts,...CONCEPTS.map(c=>c.id)];
  const candidate=candidates.find(id=>parts.has(id)&&visible.includes(targetFor(id)));if(candidate){state.component=candidate;viewer.setSelected(targetFor(candidate));}
}
function selectComponent(id,{explore=state.page!=='learn',focus=false,primary=false}={}){
  if(!parts.has(id))return;const process=processFor(primary?viewFor(id):null,id);if(process){openProcess(process);return;}
  const origin=routeState(state),oldView=state.view,oldDomain=state.domain;
  const destinationView=primary||!viewer?.getComponentIds(state.view).includes(targetFor(id))?viewFor(id):state.view;
  if(!destinationView.startsWith('power-'))state.electrification=electrificationForComponent(state.electrification,id);viewer?.setElectrification?.(state.electrification);
  state.technology=technologyForComponent(state.technology,id);viewer?.setTechnology(state.technology);
  const wasVisible=viewer?.getVisibleComponentIds().includes(targetFor(id));
  if(explore)state.page='explore';state.component=id;
  if(primary||!viewer?.getComponentIds(state.view).includes(targetFor(id)))state.view=viewFor(id);
  if(state.view!==oldView){state.exploded=0;state.domain=domainForView(state.view,DOMAINS,domainFor(id).id)?.id||domainFor(id).id;returnContext=origin;allComponents=false;}
  if(oldView!==state.view||!wasVisible){const desired=variantFor(id,state.view);state.variant=VIEWS[state.view].variants?.some(x=>x.id===desired)?desired:defaultVariant(state.view);}
  state.technology=technologyForView(state.technology,state.view,state.variant);
  if(oldDomain!==state.domain&&state.page!=='learn'){state.scenario='nominal';state.mode=['power','vehicle'].includes(state.domain)?'motoring':'coasting';}
  if(oldView!==state.view||['control','communications','station'].includes(state.domain))state.cutaway=cutawayFor(state.view)||state.view==='vehicle';
  render(oldView!==state.view);
  if(focus)viewer?.focusComponent(targetFor(id));
  $('#search-results').hidden=true;$('#component-search').value='';
  announce(parts.get(id).label);
}
function applyLesson(doRender=true){
  const t=TOURS[state.lesson],a=t.action;
  state={...state,presentation:a.presentation||(a.view==='communications-overview'?'connections':'equipment'),page:'learn',domain:t.domain,view:a.view||t.view,component:a.component||t.component,mode:a.mode||'motoring',scenario:a.scenario||'nominal',cutaway:a.cutaway??cutawayFor(t.view),variant:a.variant||defaultVariant(a.view||t.view),exploded:typeof a.exploded==='number'?a.exploded:a.exploded ? 0.35 : 0};
  state.technology=technologyForView(technologyForComponent(normalizeTechnology(a.technology||{},state.technology),state.component),state.view,state.variant);
  if(state.scenario==='radio-loss'&&!['loop','radio'].includes(state.technology.control))state.technology={...state.technology,control:'radio'};
  if(state.scenario==='regen-limited')state.sink='resistor';
  if(t.id==='configuration-evidence'){state.processId='configuration-change';state.processStep='verify';}
  if(a.electrification)state.electrification=normalizeElectrification(a.electrification);
  if(t.id==='odometry-error'){$('#sensor-error').value=10;updateSensor();}
  if(doRender){render(true);requestAnimationFrame(()=>viewer?.resize());}
}
function updateSensor(){const error=Number($('#sensor-error').value);$('#sensor-error-value').textContent=`${error>0?'+':''}${error}%`;$('#wheel-estimate').textContent=`${wheelEstimate(error).toFixed(0)} m`;}
function searchComponents(){
  const q=$('#component-search').value.trim().toLowerCase();
  if(!q){$('#search-results').hidden=true;return;}
  const matches=CONCEPTS.filter(c=>`${c.label} ${c.summary} ${c.id}`.toLowerCase().includes(q)).slice(0,8);
  $('#search-results').innerHTML=matches.map(c=>`<button data-component="${c.id}"><strong>${safe(c.label)}</strong><small>${safe(domainFor(c.id).label)}</small></button>`).join('')||'<p style="padding:10px;font-size:12px">No matches. Try a component name.</p>';
  $('#search-results').hidden=false;
}
function openSources(sourceId){
  $('#dialog-title').textContent=sourceId?'Public reference':'About this atlas';
  const records=sourceId?[sources.get(sourceId)].filter(Boolean):SOURCES;
  $('#dialog-body').innerHTML=(sourceId?'':ABOUT_HTML+`<p><button id="reset-progress" class="open-in-model">Reset guided-tour progress on this device</button></p><h3>Public references</h3><p><a href="./reading.html">Open the complete reading directory →</a></p>`)+records.map(s=>`<section class="source-record ${sourceId?'highlight':''}"><span class="source-id">${safe(s.publisher)}</span><h3>${safe(s.title)}</h3><p>${safe(s.description)}</p><p><small>${safe(s.scope)}</small></p><a href="${safe(s.url)}" target="_blank" rel="noopener">Read the public source ↗</a></section>`).join('');
  $('#about-dialog').showModal();$('#dialog-body').scrollTop=0;
}

// Label nodes remain stable between frames so keyboard focus survives camera motion.
function rebuildLabels(){
  if(!viewer)return;
  const layer=$('#model-labels'),ids=viewer.getComponentIds(state.view);
  for(const [id,nodes] of labelElements){if(!ids.includes(id)){nodes.button.remove();nodes.line.remove();labelElements.delete(id);}}
  let svg=layer.querySelector('svg');if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('model-leaders');svg.setAttribute('aria-hidden','true');layer.prepend(svg);}
  for(const id of ids){if(!parts.has(id)||labelElements.has(id))continue;
    const button=document.createElement('button');button.className='model-label';button.dataset.component=id;button.textContent=shortLabels[id]||parts.get(id).label;button.setAttribute('aria-label',`Inspect ${parts.get(id).label}`);button.title=parts.get(id).label;layer.append(button);
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');svg.append(line);labelElements.set(id,{button,line});
  }
  updateLabels();
}
function updateLabels(){
  if(!viewer||state.page==='reference'||isProcessPage()||state.presentation==='connections'&&currentTopology())return;
  const stage=$('.stage'),width=$('#viewer').clientWidth,height=$('#viewer').clientHeight;
  for(const {button,line} of labelElements.values()){button.hidden=true;line.style.display='none';}
  if(!state.labels)return;
  const selected=targetFor(state.component),preferred=new Set(activeDomain().parts.map(targetFor));
  const priorities=state.view==='railway'?new Set(['network-station','network-depot','network-control-centre','network-substation','network-train','network-turnback']):state.view==='operations-centre'?new Set(['operations-equipment-room','occ-shared-display','operations-traffic-supervision','operations-power-control','operations-station-supervision','occ-duty-handover']):preferred;
  const points=viewer.getComponentScreenPositions()
    .filter(p=>labelElements.has(p.id)&&!['network-overview','depot-layout','operations-centre'].includes(p.id)&&(state.labelMode!=='selected'||p.id===selected))
    .sort((a,b)=>(a.id===selected?-1000:priorities.has(a.id)?-100:0)-(b.id===selected?-1000:priorities.has(b.id)?-100:0));
  const limit=state.labelMode==='selected'?1:width<450?3:width<850?5:6;
  const measured=points.slice(0,Math.max(limit*2,12)).map(point=>{
    const button=labelElements.get(point.id).button;
    button.hidden=false;button.style.visibility='hidden';
    const rect=button.getBoundingClientRect();button.hidden=true;button.style.visibility='';
    return {...point,width:rect.width,height:rect.height};
  });
  const top=$('.stage-heading').getBoundingClientRect().bottom-stage.getBoundingClientRect().top+18;
  const bottom=$('.stage-footer').getBoundingClientRect().height+20;
  const key=[state.view,state.variant,state.component,state.technology.propulsion,state.technology.control,state.electrification,state.labelMode,width,height,Boolean(viewer.getExplorationState?.().isolation)].join('/');
  if(key!==labelLayoutKey||!stableLabelPositions.length&&measured.length){stableLabelPositions=placeModelLabels(measured,{width,height,top,bottom,limit,gap:14});labelLayoutKey=key;}
  const anchors=new Map(points.map(p=>[p.id,p]));
  const positions=stableLabelPositions.filter(p=>anchors.has(p.id)).map(p=>({...p,anchorX:anchors.get(p.id).x*width,anchorY:anchors.get(p.id).y*height}));
  for(const p of positions){
    const nodes=labelElements.get(p.id);nodes.button.hidden=false;
    nodes.button.style.left=`${p.x}px`;nodes.button.style.top=`${p.y}px`;
    nodes.button.classList.toggle('selected',p.id===selected);nodes.button.setAttribute('aria-pressed',String(p.id===selected));
    nodes.line.style.display='';nodes.line.setAttribute('x1',String(p.anchorX));nodes.line.setAttribute('y1',String(p.anchorY));
    nodes.line.setAttribute('x2',String(p.x));nodes.line.setAttribute('y2',String(p.y-p.height/2));
  }
}
function labelLoop(time){labelFrame=requestAnimationFrame(labelLoop);if(!document.hidden&&time-lastLabelTime>150){updateLabels();updateMotionGuide();lastLabelTime=time;}}
async function startViewer(){
  if(loadingViewer||viewer)return;loadingViewer=true;$('#model-error').hidden=true;
  try{
    const {createViewer}=await import('./viewer.js');
    viewer=createViewer($('#viewer'),{onSelect:id=>{rememberCurrentEntry();historyMode='push';selectComponent(id);},onReady:info=>{rendererStatus=info.renderer;$('#loading')?.remove();},onError:()=>{$('#model-error').hidden=false;}});
    syncViewer(true);chooseVisibleRepresentative();render();rebuildLabels();syncControls();if(!labelFrame)labelFrame=requestAnimationFrame(labelLoop);
  }catch(error){$('#loading')?.remove();$('#model-error').hidden=false;console.error('The 3D renderer could not start.',error);}
  finally{loadingViewer=false;}
}

document.addEventListener('click',event=>{
  const diagramNode=event.target.closest('[data-topology-component]');if(diagramNode){const nodeId=diagramNode.dataset.topologyNode;rememberCurrentEntry();historyMode='push';selectComponent(diagramNode.dataset.topologyComponent);focusVisible(`[data-topology-node="${nodeId}"]`);return;}
  const b=event.target.closest('button');if(!b)return;
  rememberCurrentEntry();
  historyMode=b.matches('[data-process],[data-process-step],[data-role],[data-people],[data-presentation],[data-page],[data-domain],[data-view],[data-inspect-view],[data-variant],[data-component],[data-explore-component],[data-reference],[data-reading-guide],[data-lesson],[data-experiment],[data-sink],[data-destination],#return-context,#inspect-propulsion,#inspect-control,#lesson-action,#previous-lesson,#next-lesson')?'push':'replace';
  if(b.matches('[data-domain],[data-view]')){$('.railway-navigation').classList.remove('is-open');$('#navigator-toggle').setAttribute('aria-expanded','false');}
  if(b.id==='navigator-toggle'){const open=$('.railway-navigation').classList.toggle('is-open');b.setAttribute('aria-expanded',String(open));}
  else if(b.id==='read-selection'){const heading=$('#component-detail h2');heading?.setAttribute('tabindex','-1');heading?.focus();heading?.scrollIntoView({block:'start',behavior:'instant'});}
  else if(b.id==='component-scope'){allComponents=!allComponents;renderDetail();}
  else if(b.id==='focus-selection'){labelLayoutKey='';viewer?.frameSelection?.(targetFor(state.component));syncControls();updateLabels();}
  else if(b.id==='isolate-selection'){const current=viewer?.getExplorationState?.();viewer?.setIsolation?.(current?.isolation?null:targetFor(state.component));renderDetail();syncControls();rebuildLabels();}
  else if(b.id==='restore-context'){viewer?.setIsolation?.(null);viewer?.restoreFrame?.();state.exploded=viewer?.getExplorationState?.().exploded||0;renderDetail();syncControls();rebuildLabels();}
  else if(b.id==='larger-model'){const expanded=$('.explorer-shell').classList.toggle('model-expanded');b.setAttribute('aria-pressed',String(expanded));b.textContent=expanded?'Standard model size':'Larger model';requestAnimationFrame(()=>{viewer?.resize();viewer?.frameModel?.();syncControls();updateLabels();});}
  else if(b.id==='return-context'){if(returnContext){const destination=returnContext;returnContext=null;state={...state,...destination};configurationEffect='';lastExplorationContext='';render(true);announce(`Returned to ${VIEWS[state.view].label}`);}}
  else if(b.dataset.process)openProcess(b.dataset.process);
  else if(b.dataset.processStep){state.processStep=b.dataset.processStep;render();}
  else if(b.dataset.role){state.page='people';state.roleId=b.dataset.role;render();}
  else if(b.dataset.people){state.page='people';render();}
  else if(b.dataset.presentation){state.presentation=b.dataset.presentation;state.playing=false;viewer?.setPlaying(false);render();if(state.presentation==='equipment')requestAnimationFrame(()=>viewer?.resize());}
  else if(b.id==='inspect-electrification'){returnContext=routeState(state);setView('electrification');}
  else if(b.dataset.destination)openDestination(b.dataset.destination);
  else if(b.dataset.page)setPage(b.dataset.page);
  else if(b.dataset.domain)setDomain(b.dataset.domain);
  else if(b.dataset.view)setView(b.dataset.view);
  else if(b.dataset.inspectView){const origin=routeState(state),selected=state.component;setView(b.dataset.inspectView);returnContext=origin;if(viewer?.getComponentIds(state.view).includes(targetFor(selected)))selectComponent(selected,{explore:state.page!=='learn'});else render();}
  else if(b.dataset.variant){if((state.view==='operations-centre'||state.view==='occ-workplace')&&b.dataset.variant==='handover'){openProcess('duty-handover');return;}if(state.view==='operations-centre'&&b.dataset.variant==='incident'){openProcess('incident-coordination');return;}configurationEffect='';state.variant=b.dataset.variant;const representative=VIEWS[state.view].variants?.find(x=>x.id===state.variant)?.component;if(parts.has(representative))state.component=representative;state.technology=technologyForView(state.technology,state.view,state.variant);state.scenario='nominal';viewer?.setTechnology(state.technology);viewer?.setVariant(state.variant);chooseVisibleRepresentative();render();}
  else if(b.dataset.component){const nodeId=b.dataset.connectionNode;selectComponent(b.dataset.component,{primary:Boolean(b.closest('#search-results'))});if(nodeId)focusVisible(`[data-connection-node="${nodeId}"]`);}
  else if(b.dataset.source)openSources(b.dataset.source);
  else if(b.dataset.camera){labelLayoutKey='';viewer?.setCameraPreset(b.dataset.camera);syncControls();updateLabels();}
  else if(b.dataset.motionPhase!==undefined){state.playing=false;viewer?.setPlaying(false);viewer?.setPhase(Number(b.dataset.motionPhase)*5);syncControls();updateLabels();}
  else if(b.dataset.focus){if(state.presentation==='connections'){state.presentation='equipment';render();requestAnimationFrame(()=>{viewer?.resize();viewer?.focusComponent(b.dataset.focus);syncControls();labelLayoutKey='';updateLabels();});}else{viewer?.focusComponent(b.dataset.focus);syncControls();labelLayoutKey='';updateLabels();}}
  else if(b.dataset.exploreComponent){selectComponent(b.dataset.exploreComponent,{explore:true,focus:false,primary:true});$('#workspace').scrollIntoView({block:'start'});}
  else if(b.dataset.reference){state.page='reference';$('#reference-search').value='';$('#reference-domain').value='all';render();const entry=$(`#reference-${b.dataset.reference}`);entry.open=true;entry.scrollIntoView({block:'center'});}
  else if(b.dataset.readingGuide){state.page='reference';$('#reference-search').value='';$('#reference-domain').value='all';render();const entry=$(`#reading-${b.dataset.readingGuide}`);if(entry){entry.open=true;entry.scrollIntoView({block:'start'});}}
  else if(b.dataset.lesson!==undefined){state.lesson=Number(b.dataset.lesson);applyLesson();}
  else if(b.dataset.experiment){state=applyExperiment(state,b.dataset.experiment);if(b.dataset.experiment==='door-open')state.component='door-control';render();announce(flowFor().title);}
  else if(b.dataset.sink){state.sink=b.dataset.sink;state.scenario=b.dataset.sink==='resistor'?'regen-limited':'nominal';render();}
  else if(b.id==='inspect-propulsion')openTechnologyModel('propulsion');
  else if(b.id==='inspect-control')openTechnologyModel('control');
  else if(b.id==='lesson-action')applyLesson();
  else if(b.id==='check-answer'){
    const t=TOURS[state.lesson],checked=$('input[name="quiz-answer"]:checked');
    if(!checked){showFeedback(false);return;}
    const choice=Number(checked.value),correct=choice===t.answer;quizSelections[t.id]=choice;lessonAttempts[t.id]=(lessonAttempts[t.id]||0)+1;
    if(correct)lessonAnswers[t.id]=true;saveProgress();showFeedback(correct,choice);$('#quiz-feedback').focus();renderNavigation();
  }else if(b.id==='previous-lesson'){state.lesson=Math.max(0,state.lesson-1);applyLesson();}
  else if(b.id==='next-lesson'){if(state.lesson<TOURS.length-1){state.lesson++;applyLesson();}else setPage('explore');}
  else if(b.id==='play'){state.playing=viewer?.setPlaying(!state.playing)||false;syncControls();}
  else if(b.id==='reset-scene'){labelLayoutKey='';viewer?.resetCamera();syncControls();}
  else if(b.id==='about-button')openSources();
  else if(b.id==='close-dialog')$('#about-dialog').close();
  else if(b.id==='reset-progress'){lessonAnswers={};lessonAttempts={};quizSelections={};saveProgress();$('#about-dialog').close();render();announce('Learning progress reset on this device.');}
  else if(b.id==='retry-model')startViewer();
});
function openDestination(id){
  const route=NETWORK_DESTINATIONS[id];if(!route)return;
  returnContext=routeState(state);allComponents=false;configurationEffect='';
  state={...state,...route,page:'explore',scenario:'nominal',mode:'coasting',variant:route.variant||defaultVariant(route.view),exploded:0,cutaway:cutawayFor(route.view)};
  state.technology=technologyForView(state.technology,state.view,state.variant);render(true);announce(VIEWS[state.view].label);
}
function openTechnologyModel(kind){
  const route=kind==='control'?controlRoute(state.technology.control):{view:'bogie',variant:'default',component:state.technology.propulsion==='rotary'?'rotary-traction-motor':'lim-primary'};
  if(route.view!==state.view)returnContext=routeState(state);
  allComponents=false;
  state={...state,...route,page:'explore',domain:domainFor(route.component).id,scenario:'nominal',mode:'coasting',exploded:0,cutaway:cutawayFor(route.view)};render(true);
}
function changeTechnology(kind,value){
  if(!technologyControlsFor(state.view)[kind])return;
  rememberCurrentEntry();historyMode='push';
  state.technology=normalizeTechnology({...state.technology,[kind]:value});
  configurationEffect=(kind==='propulsion'?PROPULSION_EFFECTS:CONTROL_EFFECTS)[value];
  state.scenario='nominal';viewer?.setTechnology(state.technology);
  const hidden=viewer&&!viewer.getVisibleComponentIds().includes(targetFor(state.component));
  if(hidden&&kind==='propulsion')state.component=state.technology.propulsion==='rotary'?'rotary-traction-motor':'lim-primary';
  chooseVisibleRepresentative();render();announce(configurationEffect);
}

$('#electrification-choice').innerHTML=ELECTRIFICATION_CHOICES.map(x=>`<option value="${x.id}">${safe(x.label)}</option>`).join('');
$('#electrification-choice').addEventListener('change',e=>{rememberCurrentEntry();historyMode='push';state.electrification=normalizeElectrification(e.target.value);state.exploded=0;configurationEffect=electrificationProfile(state.electrification).description;viewer?.setElectrification?.(state.electrification);chooseVisibleRepresentative();render();});
$('#propulsion-choice').innerHTML=PROPULSION_CHOICES.map(x=>`<option value="${x.id}">${safe(x.label)}</option>`).join('');
$('#control-choice').innerHTML=CONTROL_CHOICES.map(x=>`<option value="${x.id}">${safe(x.label)}</option>`).join('');
$('#view-choice').addEventListener('change',e=>{rememberCurrentEntry();historyMode='push';setView(e.target.value);announce(VIEWS[state.view].label);});
$('#propulsion-choice').addEventListener('change',e=>changeTechnology('propulsion',e.target.value));
$('#control-choice').addEventListener('change',e=>changeTechnology('control',e.target.value));
$('#component-search').addEventListener('input',searchComponents);
$('#component-search').addEventListener('keydown',e=>{if(e.key==='Escape')$('#search-results').hidden=true;if(e.key==='ArrowDown'){$('#search-results button')?.focus();e.preventDefault();}if(e.key==='Enter'){$('#search-results button')?.click();}});
document.addEventListener('click',e=>{if(!e.target.closest('.inspector-search'))$('#search-results').hidden=true;});
$('#reference-search').addEventListener('input',renderReference);$('#reference-domain').addEventListener('change',renderReference);
$('#cutaway').addEventListener('change',e=>{state.cutaway=e.target.checked;syncViewer();rememberCurrentEntry();});
$('#explode').addEventListener('input',e=>{state.exploded=Number(e.target.value);syncViewer();rememberCurrentEntry();$('#model-key').textContent=modelNote()+(state.exploded>=.5?' Message paths are hidden while parts are separated.':'');});
$('#explode-scope').addEventListener('change',e=>{state.explodeScope=viewer?.setExplodeScope?.(e.target.value)||'all';viewer?.setExploded(state.exploded);syncControls();updateLabels();rememberCurrentEntry();});
$('#label-density').addEventListener('change',e=>{state.labels=e.target.value!=='off';state.labelMode=e.target.value;updateLabels();rememberCurrentEntry();});
$('#phase').addEventListener('input',e=>{state.playing=false;viewer?.setPlaying(false);viewer?.setPhase(Number(e.target.value)*5);syncControls();});
$('#sensor-error').addEventListener('input',updateSensor);
document.addEventListener('visibilitychange',()=>{if(document.hidden){state.playing=false;viewer?.setPlaying(false);syncControls();}});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){state.playing=false;viewer?.setPlaying(false);}syncControls();});
function restoreNavigation(){
  if(location.href===lastReadUrl)return;
  historyMode='replace';const stored=history.state;returnContext=stored?.returnContext||null;readHash();
  const saved=stored?.railway;
  if(saved&&VIEWS[saved.view]&&parts.has(saved.component)&&DOMAINS.some(d=>d.id===saved.domain)&&saved.page===state.page){
    const variant=VIEWS[saved.view].variants?.some(x=>x.id===saved.variant)?saved.variant:defaultVariant(saved.view);
    state={...state,...routeState(saved),variant,technology:technologyFromUrl(location.search,saved.technology),playing:false};
    state.exploded=Number.isFinite(saved.exploded)?Math.max(0,Math.min(1,saved.exploded)):0;
  }
  lastExplorationContext='';
  render(true);
}
window.addEventListener('resize',()=>{const menu=$('.process-menu');if(menu)menu.open=matchMedia('(min-width:741px)').matches;});
window.addEventListener('hashchange',restoreNavigation);window.addEventListener('popstate',restoreNavigation);
window.addEventListener('pagehide',()=>{cancelAnimationFrame(labelFrame);labelFrame=0;state.playing=false;viewer?.setPlaying(false);});
window.addEventListener('pageshow',event=>{if(event.persisted){syncControls();viewer?.resize();if(!labelFrame)labelFrame=requestAnimationFrame(labelLoop);}});
document.addEventListener('change',e=>{if(e.target.id==='tour-select'){rememberCurrentEntry();historyMode='push';state.lesson=Number(e.target.value);applyLesson();}});
document.addEventListener('keydown',e=>{const n=e.target.closest?.('[data-topology-component]');if(n&&['Enter',' '].includes(e.key)){e.preventDefault();n.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
$('.main-nav [data-page="learn"] span').textContent=TOURS.length;
$('#reference-domain').insertAdjacentHTML('beforeend','<option value="processes">Processes & evidence</option><option value="people">People & automation</option>');
$('#reference-domain').insertAdjacentHTML('beforeend',DOMAINS.map(d=>`<option value="${d.id}">${d.label}</option>`).join(''));
readHash();render();startViewer();

