import {representationFor} from './representation-guidance.js';
import {systemDiagram,DIAGRAM_VIEWS} from './system-diagrams.js';
import {createOccApplicationExplorer} from './occ-applications-ui.js';
import {OCC_APPLICATIONS,normalizeOccState,occStateFromQuery,writeOccQuery,occContextFor,occExampleForDomain} from './occ-applications-data.js';
import {createControlInterfaceExplorer} from './control-interfaces-ui.js';
import {CONTROL_DOMAINS,CONTROL_INTERFACE_CONCEPTS,getInterfaceContext,normalizeControlState} from './control-interfaces-data.js';
import {buildNavigationIndex,createNavigationSearch} from './navigation-search.js';
import {SHORT_LABELS as shortLabels} from './labels.js';
import {DEFAULT_TECHNOLOGY,PROPULSION_CHOICES,CONTROL_CHOICES,normalizeTechnology,technologyFromUrl,technologyForView,technologyForComponent,controlRoute,technologyNote,technologyFlow} from './technology.js';
import {NAVIGATION_GROUPS,VIEW_GROUPS,VIEW_PARENTS,domainForView,viewTrail,routeState,PROPULSION_EFFECTS,CONTROL_EFFECTS} from './navigation.js';
import {NETWORK_DESTINATIONS} from './network-data.js';
import {technologyControlsFor,comparisonLabel,animationFor,canAnimate} from './comparisons.js';
import {phaseFraction,motionStep,placeModelPins} from './interaction-state.js';
import {PLATFORM_EDGES,PLATFORM_SENSORS,normalizePlatformState,platformForComponent,platformVariantAvailable} from './platform-config.js';
import {OCC_EQUIPMENT_BY_VIEW,OCC_INFORMATION_BY_VIEW} from './occ-data.js';
import {platformAnimationFor} from './station-platform-data.js';
import {electricalStudy,electricalMarkup,updateElectricalDiagram} from './electrical-explainers.js';
import {DEFAULT_ELECTRIFICATION,ELECTRIFICATION_CHOICES,normalizeElectrification,electrificationForComponent,electrificationProfile,electrificationNote,electrificationFlow} from './electrification.js';
import {PROCESS_VIEWS,PEOPLE_ROLES,TRAIN_CONTROL_TAXONOMY} from './process-data.js';
import {PROCESS_REDIRECTS,PROCESS_COMPONENTS,processFor,processStepFor,renderProcessPage,renderPeoplePage} from './process-ui.js';
import {topologyMarkup} from './topology-ui.js';
import {ABOUT_HTML} from './project-about.js';
import {READING_GUIDES} from './reading-guides.js';
import {SOURCES,CONCEPTS,ARCHITECTURES} from './catalog.js';
import {TOURS} from './tours.js';
import {LEARNING_WORKSPACES,workspaceRoute,workspaceFor,applyAnatomyQuery,writeAnatomyQuery} from './learning-workspaces.js';
import {createDepthPanel,workspaceNavigation,workspaceOrientation,ANATOMY_STUDIES} from './depth-ui.js';
import {DOMAINS,VIEWS,RELATED,MODES,EXPERIMENTS,targetFor,domainFor,viewFor,applyExperiment,describeFlow,wheelEstimate,variantFor,variantsFor,defaultVariant,cutawayFor,PART_CONTEXTS} from './model.js';

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parts=new Map(CONCEPTS.map(c=>[c.id,c]));
const sources=new Map(SOURCES.map(s=>[s.id,s]));
const domainIcons={network:'map-trifold',station:'buildings',vehicle:'train',depot:'wrench',operations:'monitor',track:'path',power:'lightning',control:'traffic-signal',communications:'broadcast'};
const domainIcon=id=>`<img class="domain-icon" src="./assets/icons/${domainIcons[id]}.svg" width="22" height="22" alt="">`;
let savedTechnology={};try{savedTechnology=JSON.parse(localStorage.getItem('railway-anatomy-technology-v1')||'{}');}catch{}
let state={technology:technologyFromUrl(location.search,savedTechnology),electrification:normalizeElectrification(new URLSearchParams(location.search).get('electrification')),platformEdge:'open',platformSensor:'lidar',presentation:'equipment',processId:'configuration-change',processStep:'',roleId:'traffic-coordinator',page:'explore',domain:'network',view:'railway',component:'network-overview',mode:'coasting',scenario:'nominal',variant:'movement',sink:'train',cutaway:true,exploded:0,explodeScope:'all',playing:false,loop:false,labels:true,labelMode:'nearby',lesson:0};
let historyMode='replace',returnContext=null,lastReadUrl='',allComponents=false,configurationEffect='',lastDetailKey='';
let viewer=null, rendererStatus='', loadingViewer=false, labelFrame=0,lastLabelTime=0,lastExplorationContext='';
let lessonAnswers={}, lessonAttempts={}, quizSelections={};
let depthPanel=null,depthFrame=0,interfaceExplorer=null,occExplorer=null;
const interfaceConceptIds=new Set(CONTROL_INTERFACE_CONCEPTS.map(c=>c.id));
const hasInterfaceContext=id=>Boolean(getInterfaceContext(id,state.view,state.variant).domain);
const progressKey='railway-anatomy-learning-v2';
try{const saved=JSON.parse(localStorage.getItem(progressKey)||'{}');for(const t of TOURS){if(saved.completed?.[t.id]===true)lessonAnswers[t.id]=true;if(Number.isInteger(saved.choices?.[t.id])&&saved.choices[t.id]>=0&&saved.choices[t.id]<t.choices.length)quizSelections[t.id]=saved.choices[t.id];if(Number.isFinite(saved.attempts?.[t.id]))lessonAttempts[t.id]=Math.max(0,saved.attempts[t.id]);}}catch{}
function saveProgress(){try{localStorage.setItem(progressKey,JSON.stringify({completed:lessonAnswers,choices:quizSelections,attempts:lessonAttempts}));}catch{}}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const wideSearch=matchMedia('(min-width:741px)');
const searchPanel=$('#equipment-search-panel');if(searchPanel){searchPanel.open=wideSearch.matches;wideSearch.addEventListener('change',e=>{searchPanel.open=e.matches;});}
const labelElements=new Map();
let labelLayoutKey='',lastSequenceKey='',lastTopologyStep='';
const isProcessPage=()=>state.page==='processes'||state.page==='people'||state.page==='learn'&&Boolean(processFor(state.view,state.component,state.variant));
const currentTopology=()=>VIEWS[state.view]?.variants?.find(v=>v.id===state.variant)?.topology||systemDiagram(state,VIEWS[state.view])||null;
const isConnections=()=>state.presentation==='connections'&&Boolean(currentTopology()||electricalStudy(state.view));
const guideForState=()=>state.view==='platform-interface'?platformAnimationFor(state):animationFor(VIEWS[state.view],state.variant,state.component);
const doorClosureComparison=()=>state.scenario==='door-open'&&['vehicle','services'].includes(state.view)&&guideForState()===VIEWS[state.view]?.componentAnimations?.doors;
const equipmentInformationOnly=()=>!isConnections()&&(representationFor(state.view,state.variant).motionKind==='information'||state.view==='depot-testing'&&state.variant==='stationary');
const canAnimateState=()=>!isOccPage()&&!isInterfacePage()&&!isProcessPage()&&!doorClosureComparison()&&!equipmentInformationOnly()&&!(isConnections()&&systemDiagram(state,VIEWS[state.view]))&&canAnimate(VIEWS[state.view],state.variant,state.component);
const preferredPresentation=(view,variant)=>VIEWS[view]?.variants?.find(v=>v.id===variant)?.defaultPresentation||VIEWS[view]?.defaultPresentation||(['connections','journey','dependencies','evidence'].includes(representationFor(view,variant).kind)&&!PROCESS_REDIRECTS[view]?'connections':'equipment');
function syncPlatform({fromComponent=false,legacy=false}={}){
  if(state.view!=='platform-interface')return;
  const input={...state,platformEdge:legacy?new URLSearchParams(location.search).get('platformEdge'):state.platformEdge};
  const next=fromComponent?platformForComponent(state.component,input):normalizePlatformState(input);
  Object.assign(state,{platformEdge:next.platformEdge,platformSensor:next.platformSensor,variant:next.variant});
  if(next.notice)configurationEffect=next.notice;
}
function equipmentInView(id){const allowed=OCC_EQUIPMENT_BY_VIEW[state.view];return !allowed||allowed.includes(id);}
const flowFor=()=>{
  const base=electrificationFlow(state,technologyFlow(state,describeFlow(state)));
  if(state.view==='platform-interface'&&state.variant==='platform-doors'&&state.platformEdge==='open')return {...base,title:'Train doors at an open boarding edge',nodes:['Train-door request','Platform-facing leaves','Boarding opening','Leaves close'],description:'The contextual train shows one-sided leaf movement beside an open edge. No platform-door drive, lock or returned platform locking indication is fitted. Train locking and departure logic are outside this mechanism.',sources:['P09']};
  if(isConnections()&&electricalStudy(state.view))return {...base,title:electricalStudy(state.view).title,nodes:state.view==='power-transformer'?['Primary voltage','Changing shared flux','Secondary voltage']:['Three AC phases','Highest / lowest pair','Conducting diodes','DC output with ripple'],description:state.view==='power-transformer'?'The electrically separate winding circuits link the same changing magnetic flux. Compare the waveforms, then switch to Equipment to inspect the core and windings.':'The highlighted diode pair connects the highest instantaneous phase to the positive bus and the lowest to the return. The resulting voltage remains positive and contains six pulses per input cycle.',sources:electricalStudy(state.view).sources};
  return base;
};
const modelNote=()=>electrificationNote(state)||technologyNote(state,VIEWS[state.view].note);


function sourceChips(ids){return `<div class="source-chips">${[...new Set(ids)].filter(id=>sources.has(id)).map(id=>`<button data-source="${id}" title="${safe(sources.get(id).title)}">${safe(sources.get(id).publisher)} ↗</button>`).join('')}</div>`;}
function announce(text){$('#announce').textContent=text;}
function focusVisible(selector){const node=$$(selector).find(el=>!el.closest('[hidden]')&&el.getClientRects().length);if(node){node.focus({preventScroll:true});return;}const heading=$$('h1').find(el=>!el.closest('[hidden]')&&el.getClientRects().length);if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}}
function rememberCurrentEntry(){history.replaceState({railway:routeState(state),returnContext},'',location.href);}
function writeHash(){
  const value=state.page==='occ'?`occ/${state.occ?.app||'telecom'}/${state.occ?.point||'pa-health'}`:state.page==='interfaces'?`interfaces/${state.controlInterface?.domain||'telecom'}/${state.controlInterface?.architecture||'summaries'}`:state.page==='people'?`people/${state.roleId||'traffic-coordinator'}`:state.page==='processes'?`processes/${state.processId}/${state.processStep||''}`:state.page==='reference'?'reference':state.page==='learn'?`learn/${TOURS[state.lesson].id}`:`explore/${state.domain}/${state.view}/${state.component}${state.variant!=='default'?'/'+state.variant:''}`;
  const url=new URL(location.href);url.searchParams.set('propulsion',state.technology.propulsion);url.searchParams.set('control',state.technology.control);if(state.electrification&&state.electrification!==DEFAULT_ELECTRIFICATION)url.searchParams.set('electrification',state.electrification);else url.searchParams.delete('electrification');
  if(state.presentation!==preferredPresentation(state.view,state.variant))url.searchParams.set('presentation',state.presentation);else url.searchParams.delete('presentation');
  for(const key of ['platformEdge','platformSensor']){if(state.view==='platform-interface'||state[key]!==({platformEdge:'open',platformSensor:'lidar'})[key])url.searchParams.set(key,state[key]);else url.searchParams.delete(key);}
  url.hash=value;writeAnatomyQuery(url,state,cutawayFor(state.view));
  for(const key of ['ciDomain','ciArchitecture','ciScenario','ciTrace','ciStep','ciLinks'])url.searchParams.delete(key);
  if(isInterfacePage()){
    const ci=normalizeControlState(state.controlInterface);
    if(isInterfaceTour()){url.searchParams.set('ciDomain',ci.domain);url.searchParams.set('ciArchitecture',ci.architecture);}
    if(ci.scenario!=='normal')url.searchParams.set('ciScenario',ci.scenario);
    if(ci.trace!=='indication')url.searchParams.set('ciTrace',ci.trace);
    if(ci.step)url.searchParams.set('ciStep',String(ci.step));
    if(Object.keys(ci.connections).length)url.searchParams.set('ciLinks',Object.entries(ci.connections).sort(([a],[b])=>a.localeCompare(b)).map(([id,mode])=>id+':'+mode).join(','));
    for(const key of ['instance','trace','study','workspace','inspect','instances','exposure','presentation'])url.searchParams.delete(key);
  }
  writeOccQuery(url,isOccPage()?state.occ:null);
  for(const key of ['occApp','occPoint'])url.searchParams.delete(key);
  if(isOccPage()){
    if(isOccTour()){url.searchParams.set('occApp',state.occ.app);url.searchParams.set('occPoint',state.occ.point);}
    for(const key of ['instance','trace','study','workspace','inspect','instances','exposure','presentation'])url.searchParams.delete(key);
  }
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
  const query=new URLSearchParams(location.search);
  state.platformSensor=query.get('platformSensor')||'lidar';state.platformEdge=query.get('platformEdge')||'open';
  if(page==='occ'){
    state.page='occ';state.domain='operations';state.view='occ-supervision';state.variant='traffic';state.occ=occStateFromQuery(a,b,query);state.component=OCC_APPLICATIONS.find(x=>x.id===state.occ.app).component;
  }else if(page==='interfaces'){
    state.page='interfaces';
    const connections=Object.fromEntries((query.get('ciLinks')||'').split(',').filter(x=>x.includes(':')).map(x=>x.split(':')));
    state.controlInterface=normalizeControlState({domain:a,architecture:b,scenario:query.get('ciScenario'),trace:query.get('ciTrace'),step:query.get('ciStep'),connections});
  }else if(page==='people'){state.page='people';state.roleId=PEOPLE_ROLES.some(r=>r.id===a)?a:PEOPLE_ROLES[0].id;}
  else if(page==='processes'){state.page='processes';state.processId=PROCESS_VIEWS[a]?a:'configuration-change';state.processStep=PROCESS_VIEWS[state.processId].steps.some(s=>s.id===b)?b:PROCESS_VIEWS[state.processId].steps[0].id;}
  else if(page==='reference'){state.page='reference';}
  else if(page==='learn'){
    state.page='learn';state.lesson=Math.max(0,TOURS.findIndex(t=>t.id===a));applyLesson(false);
    if(isOccTour())state.occ=occStateFromQuery(query.get('occApp')||state.occ.app,query.get('occPoint')||state.occ.point,query);
    if(isInterfaceTour()){
      const connections=Object.fromEntries((query.get('ciLinks')||'').split(',').filter(x=>x.includes(':')).map(x=>x.split(':')));
      state.controlInterface=normalizeControlState({domain:query.get('ciDomain')||state.controlInterface.domain,architecture:query.get('ciArchitecture')||state.controlInterface.architecture,scenario:query.get('ciScenario'),trace:query.get('ciTrace'),step:query.get('ciStep'),connections});
    }
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
  const redirected=processFor(state.view,state.component,state.variant);
  if(state.page==='explore'&&state.view==='station-networks'){state.page='interfaces';state.controlInterface=normalizeControlState(getInterfaceContext(state.component,state.view,state.variant));}
  if(state.page==='explore'&&!redirected&&(state.view==='occ-supervision'||occContextFor(state.component))){state.page='occ';state.occ=occContextFor(state.component,state.variant)||normalizeOccState();state.domain='operations';state.view='occ-supervision';state.component=OCC_APPLICATIONS.find(x=>x.id===state.occ.app).component;}
  if(state.page==='explore'&&redirected){state.page='processes';state.processId=redirected;state.processStep=processStepFor(state.view,state.variant)||PROCESS_VIEWS[redirected].steps[0].id;}
  configurationEffect='';allComponents=false;state.playing=false;state.loop=false;
  syncPlatform({legacy:true});
  state.presentation=['connections','equipment'].includes(query.get('presentation'))?query.get('presentation'):preferredPresentation(state.view,state.variant);
  if(!representationFor(state.view,state.variant).equipmentContext)state.presentation='connections';
  applyAnatomyQuery(state,query);
}

function isOccTour(){return state.page==='learn'&&state.view==='occ-supervision';}
function isOccPage(){return state.page==='occ'||isOccTour();}
function isInterfaceTour(){return state.page==='learn'&&state.view==='station-networks';}
function isInterfacePage(){return state.page==='interfaces'||isInterfaceTour();}
function routeLabel(route){if(route?.page==='learn')return TOURS[route.lesson]?.label||'Guided tour';return route?.page==='occ'?'OCC applications':route?.page==='interfaces'?'Control interfaces':route?.page==='processes'?PROCESS_VIEWS[route.processId]?.title||'processes':route?.page==='people'?'People and responsibilities':route?.page==='reference'?'Field guide':VIEWS[route?.view]?.label||'previous context';}
function learningViewSequence(){
  const workspace=workspaceFor(state.view,state.domain,state.workspace);
  return [...new Set([...(workspace?workspace.groups.flatMap(g=>g.views):activeDomain().views),state.view])].filter(id=>VIEWS[id]);
}
function renderRepresentationSummary(){
  const rep=representationFor(state.view,state.variant),guide=guideForState();
  const mechanical=canAnimateState()&&!isConnections();
  let title=isConnections()?rep.label:'Equipment anatomy';
  let message=isConnections()?'Select an endpoint for its explanation. Compare the cases to see which relationship or evidence changes.':mechanical?`Use Play or the steps below to examine ${guide?.label||'the mechanism'}.`:'This view locates physical equipment. Use sections, individual parts and interface links where a mechanism is not animated.';
  if(mechanical&&guide?.steps?.length)message+=` ${guide.steps.length} stages can also be inspected without autoplay.`;
  if(equipmentInformationOnly())message=currentTopology()?'The hardware remains stationary. Open the diagram to examine the information path and its evidence.':'This view locates physical equipment. Data, diagnosis and acceptance are explained separately; the hardware has no invented mechanical cycle.';
  if(!isConnections()&&rep.motionKind==='electrical')message='The core, windings and semiconductor hardware remain stationary. Play opens the electrical principle diagram to examine the time-varying relationship.';
  if(doorClosureComparison())message='This comparison holds the door open to show unconfirmed closure. Select Supporting loads to study the normal unlock, movement and returned-proof sequence.';
  const diagnosticContext=state.view==='depot-condition'&&state.variant==='stationary'||state.view==='depot-components'&&state.variant==='traction';
  $('#representation-summary').innerHTML=`<p><strong>${safe(title)}.</strong> ${safe(message)}</p>`+(diagnosticContext?'<button data-inspect-view="depot-testing">Evidence & diagnostic interpretation →</button>':'')+(['operations-centre','occ-workplace','occ-equipment'].includes(state.view)?'<button data-open-occ>Applications & connected devices →</button>':'')+(hasInterfaceContext(state.component)?`<button data-open-interfaces="${getInterfaceContext(state.component,state.view,state.variant).domain}">Control interfaces →</button>`:'');
}
function openOcc(context={}){
  if(!isOccPage())returnContext=routeState(state);
  state.page='occ';state.domain='operations';state.view='occ-supervision';state.variant='traffic';state.playing=false;state.occ=normalizeOccState({...state.occ,...context});
  state.component=OCC_APPLICATIONS.find(x=>x.id===state.occ.app).component;
  state.instanceId=null;state.functionalPath=null;state.studyId=null;state.allInstances=false;state.exploded=0;state.explodeScope='all';
  render();$('#workspace').scrollIntoView({block:'start',behavior:'instant'});announce('OCC applications and connected devices');
}
function openInterfaces(context={}){
  if(state.page!=='interfaces')returnContext=routeState(state);
  state.page='interfaces';state.playing=false;state.controlInterface=normalizeControlState({...state.controlInterface,...context});
  $('#interface-concept-detail').replaceChildren();render();$('#workspace').scrollIntoView({block:'start',behavior:'instant'});announce('Control responsibilities and optional interfaces');
}
function showInterfaceConcept(id){
  const c=parts.get(id);if(!c)return;
  const host=$('#interface-concept-detail');host.innerHTML=`<p class="eyebrow">Connected component or function</p><h2 tabindex="-1">${safe(c.label)}</h2><p><strong>${safe(c.summary)}</strong></p>${c.details.map(p=>`<p>${safe(p)}</p>`).join('')}${c.caveat?`<p>${safe(c.caveat)}</p>`:''}${sourceChips(c.sources)}<div class="context-jump"><button data-reference="${c.id}">Read in the field guide →</button>${!interfaceConceptIds.has(c.id)&&!PROCESS_COMPONENTS[c.id]&&viewFor(c.id)!=='station-networks'?`<button data-explore-component="${c.id}">Locate the equipment or system →</button>`:''}</div>`;host.querySelector('h2').focus({preventScroll:true});host.scrollIntoView({block:'start',behavior:'instant'});
}
function returnToContext(){
  if(!returnContext){setDomain('network');return;}
  const destination=returnContext;returnContext=null;state={...state,...destination,playing:false};configurationEffect='';lastExplorationContext='';render(true);if(state.page==='explore')orientToView();else $('#workspace').scrollIntoView({block:'start',behavior:'instant'});announce(`Returned to ${routeLabel(state)}`);
}

function activeDomain(){return DOMAINS.find(d=>d.id===state.domain);}
function syncViewer(changedView=false){
  if(!viewer)return;
  if(isProcessPage()||isInterfacePage()||isOccPage()||state.page==='reference'){viewer.setPlaying(false);return;}
  if(!canAnimateState())state.playing=false;
  const context=[state.view,state.variant,state.component,state.technology.propulsion,state.technology.control,state.electrification,state.platformEdge,state.platformSensor].join('/');
  if(lastExplorationContext&&context!==lastExplorationContext&&state.explodeScope==='selected'){state.exploded=0;state.explodeScope='all';}
  lastExplorationContext=context;
  viewer.setTechnology(state.technology);viewer.setElectrification?.(state.electrification);viewer.setPlatform?.(state);
  if(changedView||viewer.getView?.()!==state.view)viewer.setView(state.view);
  viewer.setVariant(state.variant);viewer.setMode(state.mode);viewer.setScenario(state.scenario);viewer.setReceptivity(state.sink);
  viewer.setSelected(['network-overview','depot-layout','operations-centre'].includes(state.component)?null:targetFor(state.component));
  if(state.instanceId){const entry=viewer.getInspectionState?.().tree?.find(n=>n.instanceId===state.instanceId&&n.conceptId===targetFor(state.component)&&n.available!==false);if(entry)viewer.selectInstance?.(state.instanceId,{notify:false});else state.instanceId=null;}
  viewer.setAllInstances?.(Boolean(state.allInstances));
  viewer.setCutaway(state.cutaway);
  const requestedScope=state.explodeScope||'all',requestedExposure=state.exploded,priorInspection=viewer.getExplorationState?.();
  if(requestedScope==='selected'&&requestedExposure>0&&(changedView||priorInspection?.explodeScope!=='selected'||!priorInspection?.exploded)){viewer.setInspectionMode?.('inspection');viewer.setCutaway(state.cutaway);}
  state.explodeScope=viewer.setExplodeScope?.(requestedScope)||'all';
  if(requestedScope==='selected'&&state.explodeScope!=='selected')state.exploded=0;
  viewer.setExploded(state.explodeScope==='selected'?requestedExposure:state.exploded);viewer.setSignals(['track','control','communications','station','operations','depot'].includes(state.domain));
  const sequenceKey=[state.view,state.variant,state.component,state.platformEdge,state.platformSensor].join('/');
  if(sequenceKey!==lastSequenceKey){state.playing=false;state.loop=Boolean(guideForState()?.loop);viewer.setPhase(0);lastSequenceKey=sequenceKey;lastTopologyStep='';}
  viewer.setPlayback({duration:guideForState()?.duration||12,loop:state.loop});
  state.playing=viewer.setPlaying(state.playing);if(state.functionalPath)state.functionalPath=viewer.setFunctionalPath?.(state.functionalPath)||null;syncControls();
}
function syncControls(){
  if(isOccPage())return;
  const presentation=viewer?.getExplorationState?.();
  if(presentation){state.exploded=presentation.exploded;state.explodeScope=presentation.explodeScope;}
  $('#cutaway').checked=state.cutaway;$('#explode').value=state.exploded;$('#label-density').value=state.labels?(state.labelMode||'nearby'):'off';
  state.playing=viewer?.getPlaying?.()||false;
  $('#play').textContent=state.playing?'Ⅱ Pause':viewer?.getPhase?.()>=5?'↻ Replay':'▶ Play sequence';$('#play').setAttribute('aria-pressed',String(state.playing));
  $('#play').disabled=reducedMotion.matches;
  $('.animation').hidden=!canAnimateState();
  if($('.sequence-panel'))$('.sequence-panel').hidden=!canAnimateState();
  if($('#motion-loop'))$('#motion-loop').checked=Boolean(state.loop);
  $('#play').title=reducedMotion.matches?'Reduced motion is enabled. Use the steps or slider to inspect each state.':'Play the illustrated sequence';
  if($('#quick-play')){const quick=$('#quick-play');quick.hidden=!canAnimateState()||isConnections();quick.textContent=$('#play').textContent;quick.disabled=reducedMotion.matches;quick.setAttribute('aria-pressed',String(state.playing));}
  if($('#diagram-quick-play')){const quick=$('#diagram-quick-play');quick.hidden=!canAnimateState();quick.textContent=$('#play').textContent;quick.disabled=reducedMotion.matches;quick.setAttribute('aria-pressed',String(state.playing));}
  const capabilities=viewer?.getViewCapabilities();
  const occPhysical=['operations-centre','occ-workplace','occ-equipment'].includes(state.view);
  $('#cutaway').closest('label').hidden=occPhysical||state.view==='railway'||capabilities?.cutaway===false;$('#separation-controls').hidden=occPhysical||state.view==='railway'||capabilities?.explode===false;
  const selected=targetFor(state.component),overview=['network-overview','depot-layout','operations-centre'].includes(selected);
  const exploration=viewer?.getExplorationCapabilities?.(selected),current=viewer?.getExplorationState?.();
  $('#exploration-selection').hidden=overview;
  $('#exploration-selection').textContent=overview?'Explore the model':`Selected: ${shortLabels[state.component]||parts.get(state.component)?.label||''}`;
  $('#focus-selection').hidden=overview||!exploration?.canFocus;
  $('#isolate-selection').hidden=overview||!exploration?.canIsolate;
  $('#isolate-selection').setAttribute('aria-pressed',String(Boolean(current?.isolation)));
  $('#isolate-selection').textContent=current?.isolation?'Assembly isolated':'Isolate assembly';
  const inspecting=current?.explodeScope==='selected'&&current?.exploded>0;
  $('#inspect-assembly').hidden=occPhysical||overview||!exploration?.canExplodeSelected;
  $('#inspect-assembly').textContent=inspecting?'Reassemble':'Inspect inside';
  $('#inspect-assembly').setAttribute('aria-pressed',String(inspecting));
  $('#restore-context').hidden=!current?.isolation&&!current?.canRestoreFrame&&!current?.exploded;
  $('#explode-scope').value=current?.explodeScope||'all';
  $('#explode-scope option[value="selected"]').disabled=!exploration?.canExplodeSelected;
  $('#exploration-note').hidden=!(current?.isolation||current?.explodeScope==='selected');
  const names=exploration?.pieceNames||[],instances=exploration?.instanceCount||1;
  $('#exploration-note').textContent=current?.explodeScope==='selected'?`${exploration?.internalSeparationCount||0} movable pieces${instances>1?` across ${instances} instances of this assembly`:''}. ${names.length?`Named groups: ${names.join('; ')}. `:''}Separation is a teaching layout; it is not a maintenance removal sequence. Other equipment stays assembled.`:current?.isolation?'Showing the selected assembly. Restore the scene to see its surrounding equipment.':'';
  const inspectionStages=inspecting?(exploration?.inspectionStages||[]):[];
  $('#inspection-stages').hidden=!inspectionStages.length;
  const inspectionKey=JSON.stringify(inspectionStages);
  if($('#inspection-stages').dataset.recipe!==inspectionKey){
    $('#inspection-stages').innerHTML=inspectionStages.map((stage,index)=>`<button data-inspection-progress="${stage.end}" aria-pressed="false">${index+1}. ${safe(stage.label)}</button>`).join('');
    $('#inspection-stages').dataset.recipe=inspectionKey;
  }
  // Keep the existing buttons while scrubbing or stepping so keyboard focus
  // remains on the learner's chosen stage.
  $$('#inspection-stages button').forEach((button,index)=>button.setAttribute('aria-pressed',String(current.exploded>=inspectionStages[index].end&&(index===inspectionStages.length-1||current.exploded<inspectionStages[index+1].end))));
  updateMotionGuide();
  $('#render-badge').textContent=isConnections()?(electricalStudy(state.view)?'Electrical principle':'Information diagram'):rendererStatus==='svg'?'Schematic teaching model · SVG':'Schematic teaching model';
  const anatomy=viewer?.getInspectionState?.();if(anatomy){if(state.instanceId)state.instanceId=anatomy.selectedInstanceId;state.functionalPath=anatomy.functionalPath;state.allInstances=anatomy.allInstances;}
  if(!depthFrame)depthFrame=requestAnimationFrame(()=>{depthFrame=0;renderDepth();});
}
function refreshDepthState(){
  const current=viewer?.getExplorationState?.();if(current){state.exploded=current.exploded;state.explodeScope=current.explodeScope;}
  state.cutaway=viewer?.getCutaway?.()??state.cutaway;state.playing=viewer?.getPlaying?.()||false;
  syncControls();updateLabels();writeHash();rememberCurrentEntry();
}
function openDepthStudy(study,step=null){
  if(!study||!VIEWS[study.view])return;
  const prior=routeState(state);historyMode='push';
  state={...state,page:'explore',view:study.view,domain:domainForView(study.view,DOMAINS)?.id||state.domain,component:study.conceptIds[0],variant:study.variant||defaultVariant(study.view),workspace:study.workspace,studyId:study.id,instanceId:null,functionalPath:null,allInstances:false,exploded:0,explodeScope:'all',cutaway:true,playing:false,scenario:'nominal',presentation:'equipment',...study.configuration};
  if(study.technology)state.technology=normalizeTechnology({...state.technology,...study.technology});
  syncPlatform({fromComponent:true});returnContext=prior;render(true);
  if(step?.conceptId)selectStudyStep(study,step);
  depthPanel?.setTab('learn');$('#anatomy-panel')?.scrollIntoView({block:'nearest'});
}
function selectStudyStep(study,step){
  if(state.studyId!==study.id){openDepthStudy(study,step);return;}
  if(step.view&&VIEWS[step.view]){
    if(step.view!==state.view)setView(step.view);
    if(step.variant&&VIEWS[state.view].variants?.some(v=>v.id===step.variant))state.variant=step.variant;
    state.workspace=study.workspace;state.studyId=study.id;render(true);
  }
  historyMode='push';selectComponent(step.conceptId);
  if(step.partLabel){const inspection=viewer?.getInspectionState?.(),entry=inspection?.tree?.find(n=>n.available!==false&&n.label===step.partLabel);if(entry)viewer.selectInstance(entry.instanceId);}
  depthPanel?.setTab('learn');refreshDepthState();
}
function renderDepth(){
  const host=$('#anatomy-panel');if(!host)return;if(isConnections()||isProcessPage()||isInterfacePage()||isOccPage()){host.hidden=true;return;}host.hidden=false;
  if(!depthPanel)depthPanel=createDepthPanel(host,{
    instance:id=>{historyMode='push';if(viewer?.selectInstance?.(id)){state.instanceId=id;refreshDepthState();}},
    mode:mode=>{historyMode='replace';if(viewer?.setInspectionMode?.(mode)){refreshDepthState();if(mode==='inspection')$('#viewer').scrollIntoView({block:'center',behavior:'instant'});}},
    allInstances:value=>{viewer?.setAllInstances?.(value);refreshDepthState();},
    exposure:value=>{if(viewer?.getExplorationState?.().explodeScope!=='selected')viewer?.setInspectionMode?.('inspection');viewer?.setExplodeScope?.('selected');viewer?.setExploded(value);viewer?.setPlaying(false);refreshDepthState();},
    focus:()=>{viewer?.frameSelection?.(targetFor(state.component));refreshDepthState();$('#viewer').scrollIntoView({block:'center',behavior:'instant'});},
    path:id=>{state.functionalPath=viewer?.setFunctionalPath?.(id)||null;refreshDepthState();},
    concept:id=>{historyMode='push';selectComponent(id);},
    connections:()=>{state.presentation='connections';render();},
    study:study=>openDepthStudy(study),studyStep:selectStudyStep,
    lab:lab=>{if(!lab||!VIEWS[lab.view])return;historyMode='push';setView(lab.view);state.workspace=lab.workspace;if(lab.variant&&VIEWS[lab.view].variants?.some(v=>v.id===lab.variant))state.variant=lab.variant;render(true);selectComponent(lab.conceptId);depthPanel?.setTab('learn');$('#anatomy-panel').scrollIntoView({block:'start',behavior:'instant'});},
    studyChoice:id=>{const study=ANATOMY_STUDIES.find(s=>s.id===id);if(study)openDepthStudy(study);}
  });
  depthPanel.render({inspection:viewer?.getInspectionState?.(),exploration:viewer?.getExplorationState?.(),state,parts,sourceChips,hasConnections:Boolean(currentTopology()||electricalStudy(state.view))});
}
function tourNavigationMarkup(id='tour-select'){
  return `<label for="${id}">Guided tour</label><select id="${id}" data-tour-select>${TOURS.map((t,i)=>`<option value="${i}" ${state.lesson===i?'selected':''}>${lessonAnswers[t.id]?'✓ ':''}${safe(t.label)}</option>`).join('')}</select><span>${Object.keys(lessonAnswers).length} of ${TOURS.length} checked</span>`;
}
function renderNavigation(){
  const contentTarget=isOccPage()?'#occ-page':isInterfacePage()?'#interfaces-page':isProcessPage()?'#processes-page':state.page==='reference'?'#reference-page':'#explorer-page';
  const skip=$('.skip');skip.setAttribute('href',contentTarget);skip.dataset.contentTarget=contentTarget;skip.textContent=isOccPage()?'Skip to OCC applications':isInterfacePage()?'Skip to control interfaces':isProcessPage()?'Skip to people and processes':state.page==='reference'?'Skip to the field guide':'Skip to the explorer';
  $$('.main-nav [data-page]').forEach(b=>{if(b.dataset.page===(state.page==='people'?'processes':state.page))b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  $('#explorer-page').hidden=state.page==='reference'||isInterfacePage()||isOccPage()||isProcessPage();$('#occ-page').hidden=!isOccPage();$('#reference-page').hidden=state.page!=='reference';$('#processes-page').hidden=!isProcessPage();$('#interfaces-page').hidden=!isInterfacePage();
  const d=activeDomain(),network=DOMAINS.find(x=>x.id==='network');
  $('#intro-copy').textContent=state.page==='learn'?'Inspect the model, then check your understanding.':state.domain==='network'?'Select a place in this schematic railway to explore its systems.':'Select equipment in the model or browse the components below.';
  $('#intro-copy').hidden=state.page!=='learn';
  const viewButtons=ids=>ids.filter(id=>VIEWS[id]).map(id=>`<button data-view="${id}" class="${id===state.view?'active':''}" ${id===state.view?'aria-current="location"':''}>${safe(VIEWS[id].label)}</button>`).join('');
  const domainViews=item=>{const groups=VIEW_GROUPS[item.id];if(!groups)return viewButtons(item.views);const grouped=new Set(groups.flatMap(g=>g.views));return groups.map(g=>`<div class="view-subgroup"><h3>${safe(g.label)}</h3>${viewButtons(g.views)}</div>`).join('')+(item.id==='communications'?'':viewButtons(item.views.filter(id=>!grouped.has(id))));};
  const domainButton=item=>`<button data-domain="${item.id}" class="domain-button ${item.id===state.domain?'active':''}" aria-pressed="${item.id===state.domain}">${domainIcon(item.id)}<strong>${safe(item.label)}</strong></button>${item.id===state.domain&&item.views.length>1?`<div class="area-views">${domainViews(item)}</div>`:''}`;
  $('#domains').innerHTML=`<button class="network-home ${state.domain==='network'?'active':''}" data-domain="network" aria-pressed="${state.domain==='network'}">${domainIcon(network.id)}<strong>Whole railway</strong></button>`+NAVIGATION_GROUPS.map(g=>`<div class="navigation-group"><h2>${safe(g.label)}</h2>${g.ids.map(id=>DOMAINS.find(x=>x.id===id)).filter(Boolean).map(domainButton).join('')}</div>`).join('');
  $('#navigator-current').textContent=d.label;
  $('#study-workspaces').innerHTML=workspaceNavigation(state,VIEWS);$('#study-orientation').innerHTML=workspaceOrientation(state,VIEWS);$('#study-orientation').hidden=state.page!=='explore';
  const trail=viewTrail(state.view,VIEWS).filter(id=>id!==network.view);
  $('#location-trail').innerHTML=`<button data-domain="network" ${state.domain==='network'?'aria-current="location"':''}>Whole railway</button>`+(state.domain==='network'?'':`<span aria-hidden="true">/</span><button data-domain="${d.id}">${safe(d.label)}</button>`)+trail.filter(id=>id!==d.view).map(id=>`<span aria-hidden="true">/</span><button data-view="${id}" ${id===state.view?'aria-current="location"':''}>${safe(VIEWS[id].label)}</button>`).join('');
  $('#return-context').hidden=!returnContext;
  if(returnContext)$('#return-context').textContent=`← Return to ${routeLabel(returnContext)}`;
  const viewIds=learningViewSequence();
  $('.scene-toolbar').hidden=viewIds.length<=1;
  $('#view-choice').innerHTML=viewIds.map(id=>`<option value="${id}">${safe(VIEWS[id].label)}</option>`).join('');
  $('#view-choice').value=state.view;
  const sequence=viewIds;const index=sequence.indexOf(state.view);
  $('#previous-view').disabled=index<=0;$('#next-view').disabled=index<0||index>=sequence.length-1;
  $('#previous-view').title=index>0?VIEWS[sequence[index-1]].label:'First view in this area';$('#next-view').title=index>=0&&index<sequence.length-1?VIEWS[sequence[index+1]].label:'Last view in this area';
  renderRepresentationSummary();
  $('#scene-index').textContent=`${d.label} / ${VIEWS[state.view].level||'System & equipment'}`;
  $('#scene-title').textContent=VIEWS[state.view].label;
  const controls=technologyControlsFor(state.view);
  $('#technology-panel').hidden=!controls.propulsion&&!controls.control;
  $('#electrification-context').hidden=!controls.electrification;$('#electrification-choice').value=state.electrification;
  $('#propulsion-context').hidden=!controls.propulsion;$('#control-context').hidden=!controls.control;
  $('#propulsion-choice').disabled=!controls.propulsion;$('#control-choice').disabled=!controls.control;
  $('#propulsion-choice').value=state.technology.propulsion;$('#control-choice').value=state.technology.control;
  $('#propulsion-context label').textContent=state.view==='guideway'?'Guideway propulsion interface':'Drive arrangement';
  if($('#platform-context')){
    $('#platform-context').hidden=!['platform-interface','station'].includes(state.view);
    $('#platform-edge-choice').value=state.platformEdge;$('#platform-sensor-choice').value=state.platformSensor;
    $('#platform-sensor-context').hidden=state.view!=='platform-interface'||state.variant!=='open-platform';
  }
  $('#configuration-effect').hidden=!configurationEffect;$('#configuration-effect').textContent=configurationEffect;
  $('#model-key').textContent=modelNote()+(state.exploded>=.5?' Message paths are hidden while parts are separated.':'');
  $('#tour-bar').hidden=state.page!=='learn';
  $('#tour-bar').innerHTML=tourNavigationMarkup();
  $('#interface-tour-bar').hidden=!isInterfaceTour();$('#interface-tour-bar').innerHTML=isInterfaceTour()?tourNavigationMarkup('interface-tour-select'):'';
  $('#interface-tour-intro').hidden=!isInterfaceTour();$('#interface-tour-intro').innerHTML=isInterfaceTour()?`<p><strong>${safe(TOURS[state.lesson].title)}</strong> Compare the selected responsibilities and interfaces, then check your understanding.</p><button data-tour-lesson>Tour task & self-check ↓</button>`:'';
  $('#interface-lesson').hidden=!isInterfaceTour();
  $('#occ-tour-bar').hidden=!isOccTour();$('#occ-tour-bar').innerHTML=isOccTour()?tourNavigationMarkup('occ-tour-select'):'';
  $('#occ-tour-intro').hidden=!isOccTour();$('#occ-tour-intro').innerHTML=isOccTour()?`<p><strong>${safe(TOURS[state.lesson].title)}</strong> Inspect the named point and configured request, then check your understanding.</p><button data-tour-lesson>Tour task & self-check ↓</button>`:'';
  $('#occ-lesson').hidden=!isOccTour();
  if($('#process-tour-bar'))$('#process-tour-bar').innerHTML=state.page==='learn'?tourNavigationMarkup('process-tour-select'):'';
}

function renderDetail(){
  const c=parts.get(state.component);
  if(lastDetailKey!==state.component)lastDetailKey=state.component;
  const related=(RELATED[c.id]||activeDomain().parts.filter(id=>id!==c.id).slice(0,3)).filter(id=>parts.has(id));
  const contexts=[...new Set([viewFor(c.id),...(PART_CONTEXTS[c.id]||[])])].filter(id=>VIEWS[id]&&id!==state.view&&!PROCESS_REDIRECTS[id]);
  const level=({'network-overview':'Railway','network-route':'Route','network-station':'Place','network-turnback':'Track connection','network-train':'Vehicle','network-depot':'Facility','network-maintenance':'Facility','network-stabling':'Area','network-control-centre':'Facility','network-substation':'Subsystem','network-telecommunications':'System','depot-layout':'Facility','operations-centre':'Facility'})[c.id]||'Equipment';
  const destination=NETWORK_DESTINATIONS[c.id];
  $('#selection-summary').innerHTML=`<div><strong>${safe(shortLabels[c.id]||c.label)}</strong><p>${safe(c.summary)}</p></div><div class="selection-actions">${destination?`<button class="open-area" data-destination="${c.id}">Explore ${safe(shortLabels[c.id]||'area')} →</button>`:''}${state.page==='learn'?`<button data-explore-component="${c.id}">Explore this equipment</button>`:'<button id="read-selection">Read explanation</button>'}</div>`;
  const drilldown=destination?`<button class="open-area" data-destination="${c.id}">Explore ${safe(VIEWS[destination.view]?.label||c.label)} →</button>`:'';
  const anchor=!isConnections()&&targetFor(c.id)!==c.id?`<p class="practice-note">Model anchor: ${safe(parts.get(targetFor(c.id))?.label||targetFor(c.id))}. This concept is shown in its equipment context.</p>`:'';
  $('#component-detail').innerHTML=`<p class="part-kicker">${safe(domainFor(c.id).label)} / ${level}</p><h2 class="part-title">${safe(c.label)}</h2><p class="part-summary">${safe(c.summary)}</p>${drilldown}${anchor}<h3 class="detail-heading">How it works</h3>${c.details.map(p=>`<p class="part-detail">${safe(p)}</p>`).join('')}${c.caveat?`<details class="part-scope"><summary>Scope of this example</summary><p class="part-note">${safe(c.caveat)}</p></details>`:''}<h3 class="detail-heading">Interfaces & connected equipment</h3><div class="related">${related.map(id=>`<button data-component="${id}">${safe(shortLabels[id]||parts.get(id).label)}</button>`).join('')}</div>${contexts.length?`<h3 class="detail-heading">Inspect at another scale</h3><div class="related">${contexts.map(id=>`<button data-inspect-view="${id}">${safe(VIEWS[id].label)}</button>`).join('')}</div>`:''}${sourceChips(c.sources)}${c.sources.length?'':'<p class="practice-note">A declared teaching-model choice; no equipment specification is implied.</p>'}<div class="inspector-links">${!isConnections()?`<button data-focus="${targetFor(c.id)}">Locate in model</button>`:''}${hasInterfaceContext(c.id)?`<button data-open-interfaces="${getInterfaceContext(c.id,state.view,state.variant).domain}">Control & supervision interfaces →</button>`:''}<button data-reference="${c.id}">Read in field guide →</button></div>`;
  const guides=READING_GUIDES.filter(g=>g.domain===state.domain&&(!g.view||g.view===state.view));
  if(guides.length)$('#component-detail').insertAdjacentHTML('beforeend',`<div class="system-reading">${guides.map(g=>`<button data-reading-guide="${g.id}">${safe(g.title)} →</button>`).join('')}</div>`);
  $('#component-detail').hidden=state.page==='learn';$('#lesson-detail').hidden=state.page!=='learn';
  if($('#component-explanation'))$('#component-explanation').hidden=state.page==='learn';
  const visible=new Set(viewer?.getVisibleComponentIds()||[]);
  const candidates=allComponents||!viewer?activeDomain().parts:[...new Set([...activeDomain().parts,...CONCEPTS.map(c=>c.id)])];
  const information=new Set(currentTopology()?.nodes.map(n=>n.component)||(electricalStudy(state.view)?viewer?.getComponentIds(state.view):OCC_INFORMATION_BY_VIEW[state.view])||[]);
  const current=candidates.filter(id=>!PROCESS_COMPONENTS[id]&&(allComponents||(isConnections()?information.has(id):equipmentInView(id)&&(!viewer||visible.has(targetFor(id))))));
  $('#component-eyebrow').textContent=`${activeDomain().label} / ${current.length} ${allComponents?'components':'in this view'}`;
  $('#component-heading').textContent=allComponents?'Equipment in this area':isConnections()?'Information and connected equipment':'Equipment in this view';
  $('#component-scope').textContent=allComponents?'Show this view only':'Browse the whole area';$('#component-scope').setAttribute('aria-pressed',String(allComponents));
  $('#component-grid').innerHTML=current.map((id,i)=>{const p=parts.get(id);return `<button data-component="${id}" class="${id===c.id?'active':''}" aria-pressed="${id===c.id}"><span class="component-number">${modelNumber(id)}</span><span><strong>${safe(p.label)}</strong><small>${safe(p.summary)}</small></span><span class="row-arrow" aria-hidden="true">↗</span></button>`;}).join('');
}
function renderScenario(){
  const flow=flowFor(),variants=VIEWS[state.view].variants?.filter(v=>v.presentation!=='process'&&(state.view!=='platform-interface'||platformVariantAvailable(v.id,state.platformEdge))),electrical=!variants&&(['power','vehicle'].includes(state.domain)&&state.view!=='services'||state.view==='guideway');
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
  const guide=canAnimateState()?guideForState():null,phase=viewer?.getPhase?.()||0;
  const fraction=phaseFraction(phase);
  const playing=viewer?.getPlaying?.()||false;
  if(state.playing!==playing){state.playing=playing;$('#play').textContent=playing?'Ⅱ Pause':phase>=5?'↻ Replay':'▶ Play sequence';$('#play').setAttribute('aria-pressed',String(playing));for(const quick of $$('#quick-play,#diagram-quick-play')){quick.textContent=$('#play').textContent;quick.setAttribute('aria-pressed',String(playing));}}
  if(document.activeElement!==$('#phase'))$('#phase').value=String(fraction);
  $('#phase-value').value=`${Math.round(fraction*100)}%`;
  $('#motion-guide').hidden=!guide;
  if(!guide)return;
  $('#motion-title').textContent=guide.label;
  const steps=guide.steps||[],index=motionStep(steps,fraction);
  $('#phase-value').value=`${index+1} / ${steps.length}`;$('#phase').setAttribute('aria-valuetext',`${steps[index]?.label||'Sequence'}; ${Math.round(fraction*100)} percent`);
  const key=[state.view,state.variant,state.platformEdge,state.platformSensor,guide.label].join('/');
  if($('#motion-steps').dataset.guide!==key){
    $('#motion-steps').dataset.guide=key;
    $('#motion-steps').innerHTML=steps.map((step,i)=>`<button data-motion-phase="${step.at}" data-motion-step="${i}">${safe(step.label)}</button>`).join('');
  }
  $$('#motion-steps button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});
  $('#motion-caption').textContent=steps[index]?.description||'';
  if($('#motion-previous'))$('#motion-previous').disabled=fraction<=0;
  if($('#motion-next'))$('#motion-next').disabled=fraction>=1;
  if(isConnections()&&currentTopology())updateTopologyStep(steps[index],`${key}/${index}`);
  if(electricalStudy(state.view))updateElectricalDiagram($('#connections-view'),state.view,fraction);
}
function seekSequence(fraction){if(!canAnimateState())return;if(electricalStudy(state.view)&&!isConnections()){state.presentation='connections';render();}state.playing=false;viewer?.setPlaying(false);viewer?.setPhase(Math.max(0,Math.min(1,fraction))*5);syncControls();updateLabels();}
function stepSequence(direction){const guide=guideForState(),fraction=phaseFraction(viewer?.getPhase?.()||0),steps=guide?.steps||[];
  const next=direction>0?steps.find(s=>s.at>fraction+.001):[...steps].reverse().find(s=>s.at<fraction-.001);seekSequence(next?.at??(direction>0?1:0));}
function updateTopologyStep(step,key){
  if(!step||key===lastTopologyStep)return;lastTopologyStep=key;
  const nodes=new Set(step.activeNodes||[]),edges=new Set(step.activeEdges||[]);
  $$('#connections-view [data-topology-node]').forEach(node=>{const id=node.dataset.topologyNode;node.classList.toggle('active-step',nodes.has(id));const out=node.querySelector('.node-state');if(out)out.textContent=step.states?.[id]||'';});
  $$('#connections-view [data-topology-edge]').forEach(edge=>edge.classList.toggle('active-step',edges.has(Number(edge.dataset.topologyEdge))));
  const out=$('#connection-state');if(out){out.textContent=step.description;out.hidden=false;}
}
function renderLesson(){
  if(state.page!=='learn')return;
  const t=TOURS[state.lesson];
  const lessonHost=isOccTour()?$('#occ-lesson'):isInterfaceTour()?$('#interface-lesson'):isProcessPage()?$('#process-lesson'):$('#lesson-detail');if(!lessonHost)return;
  for(const host of $$('#lesson-detail,#process-lesson,#interface-lesson,#occ-lesson'))if(host!==lessonHost)host.replaceChildren();
  const actionContext=isOccTour()?'Explore the application and point':isInterfaceTour()?'Explore the interfaces':isProcessPage()?'Explore the process':isConnections()?'Explore the diagram':'Try it in the model';
  lessonHost.innerHTML=`<div class="lesson-body"><button class="back-guide" data-explore-component="${state.component}">← Explore freely</button><p class="part-kicker">Guided tour ${state.lesson+1} / ${TOURS.length}</p><h3 tabindex="-1">${safe(t.title)}</h3><p>${safe(t.explanation)}</p>${state.component!==t.component?`<div class="selected-in-tour"><strong>${safe(parts.get(state.component).label)}</strong><p>${safe(parts.get(state.component).summary)}</p><button data-explore-component="${state.component}">Open component explanation →</button></div>`:''}<div class="try-action"><strong>${actionContext}</strong>${safe(t.actionText)}<button id="lesson-action">${safe(t.actionLabel)} ↗</button></div><div class="question"><h4 id="quiz-title">${safe(t.question)}</h4><fieldset aria-labelledby="quiz-title">${t.choices.map((v,i)=>`<label class="answer-choice"><input type="radio" name="quiz-answer" value="${i}" ${quizSelections[t.id]===i?'checked':''}><span>${safe(v)}</span></label>`).join('')}</fieldset><button class="check-answer" id="check-answer">Check understanding</button><div id="quiz-feedback" role="status" tabindex="-1" hidden></div><p class="practice-note">Optional self-check. Retry or move on at any time. Progress stays on this device.</p></div>${sourceChips([...new Set(t.sourceConcepts.flatMap(id=>parts.get(id).sources))])}<div class="lesson-nav"><button id="previous-lesson" ${state.lesson===0?'disabled':''}>← Previous</button><button id="next-lesson">${state.lesson===TOURS.length-1?'Finish & explore':'Next tour →'}</button></div></div>`;
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
    return `<section class="reference-group"><h3>${d.label}</h3>${items.map(c=>`<details class="reference-card" id="reference-${c.id}"><summary>${safe(c.label)}</summary><div><p><strong>${safe(c.summary)}</strong></p>${c.details.map(p=>`<p>${safe(p)}</p>`).join('')}${c.caveat?`<p class="part-note">${safe(c.caveat)}</p>`:''}${sourceChips(c.sources)}<button class="open-in-model" data-explore-component="${c.id}">${processFor(viewFor(c.id),c.id)?'Open the process':occContextFor(c.id)?'Explore the OCC application':interfaceConceptIds.has(c.id)?'Explore control interfaces':representationFor(viewFor(c.id),variantFor(c.id)).kind==='connections'?'Explore the system':'Explore this equipment'} ↗</button></div></details>`).join('')}</section>`;
  }).join('')||'<p>No components match. Try a shorter term or another system.</p>';
}
function openProcess(id,step=''){
  if(!PROCESS_VIEWS[id])return;
  if(!isProcessPage())returnContext=routeState(state);
  state.page='processes';state.processId=id;state.processStep=step||PROCESS_VIEWS[id].steps[0].id;state.playing=false;
  render();announce(PROCESS_VIEWS[id].title);requestAnimationFrame(()=>{$('#processes-page h1')?.setAttribute('tabindex','-1');$('#processes-page h1')?.focus({preventScroll:true});$('#workspace').scrollIntoView({block:'start',behavior:'instant'});});
}
function renderSystemContext(){
  const orientation=$('#control-orientation'),taxonomy=TRAIN_CONTROL_TAXONOMY;
  orientation.hidden=state.domain!=='control'||state.view!=='control';
  if(!orientation.hidden)orientation.innerHTML=`<h2>Three routes into train control</h2><p>Choose an architecture family, then examine the functions and equipment it uses. Detection and interlocking connect several families.</p><div class="control-families">${taxonomy.families.map(f=>`<section><h3>${safe(f.label)}</h3><p>${safe(f.summary)}</p><button data-view="${f.views[0]}">Explore ${safe(f.label)} →</button></section>`).join('')}</div><details class="control-taxonomy"><summary>Functions, shared equipment & supplier examples</summary><h3>Functions are questions, not necessarily separate computers</h3>${taxonomy.functions.map(f=>`<p><strong>${safe(f.label)}</strong> — ${safe(f.question)} ${safe(f.qualification)}</p>`).join('')}<h3>Equipment shared across arrangements</h3><div class="shared-device-list">${taxonomy.sharedDevices.map(d=>`<section><button data-component="${d.id}">${safe(d.label)} ↗</button><p>${safe(d.use)}</p></section>`).join('')}</div><h3>Public supplier examples</h3>${taxonomy.supplierExamples.map(e=>`<section class="supplier-example"><h4>${safe(e.supplier)} / ${safe(e.label)}</h4><p>${safe(e.scope)} ${safe(e.lineage||'')}</p>${sourceChips(e.sources)}</section>`).join('')}<button data-people="all" class="text-link">Explore automation and people’s responsibilities →</button></details>`;
  // Roles, responsibilities and work sequences have their own top-level tab.
  const context=$('#people-context');context.hidden=true;context.replaceChildren();
}
function renderConnections(){
  const topology=currentTopology(),electrical=electricalStudy(state.view),show=isConnections(),rep=representationFor(state.view,state.variant);
  $('#presentation-switch').hidden=(!topology&&!electrical)||!rep.equipmentContext;
  $('#presentation-switch [data-presentation="equipment"]').textContent=['journey','dependencies','evidence'].includes(rep.kind)?'Physical context':'Equipment anatomy';
  $('#presentation-switch [data-presentation="connections"]').textContent=electrical?'Electrical principle':rep.kind==='journey'?'Journey & assistance':rep.kind==='dependencies'?'Dependencies':rep.kind==='evidence'?'Evidence & conditions':'Responsibilities & connections';
  $$('#presentation-switch button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.presentation===(show?'connections':'equipment'))));
  $('.workspace-grid').classList.toggle('connections-mode',show);$('#connections-view').hidden=!show;
  if(show){
    const chosen=VIEWS[state.view].variants?.find(v=>v.id===state.variant);
    const rows=topology?.rows;
    $('#connections-view').innerHTML='<button id="diagram-quick-play" class="diagram-quick-play" aria-pressed="false" hidden>Play sequence</button>'+(electrical?electricalMarkup(state.view):topologyMarkup(topology,state.component))+(topology?.result?`<p class="diagram-result">${safe(topology.result)}</p>`:'')+(rows?`<section class="diagram-outcomes"><h3>What the selected case establishes</h3><table><thead><tr><th>Interface or claim</th><th>Selected condition</th><th>Meaning and limit</th></tr></thead><tbody>${rows.map(row=>`<tr><th>${safe(row[0])}</th><td>${safe(row[1])}</td><td>${safe(row[2])}</td></tr>`).join('')}</tbody></table></section>`:'')+sourceChips(topology?.sources||chosen?.sources||flowFor().sources||[])+(hasInterfaceContext(state.component)||topology?.interfaceDomain?`<div class="context-jump"><button data-open-interfaces="${safe(topology?.interfaceDomain||getInterfaceContext(state.component,state.view,state.variant).domain)}">Compare control responsibilities & optional interfaces →</button></div>`:'');
    lastTopologyStep='';
  }
  for(const selector of ['.stage','.selection-tools','.model-tools','.model-notes','#exploration-note','.model-parts-key']){
    const element=$(selector);if(!element)continue;if(show){if(element.dataset.beforeConnections===undefined)element.dataset.beforeConnections=String(element.hidden);element.hidden=true;}else if(element.dataset.beforeConnections!==undefined){element.hidden=element.dataset.beforeConnections==='true';delete element.dataset.beforeConnections;}
  }
  syncControls();
}
function render(changedView=false){
  if(state.page==='explore'){
    if(!processFor(state.view,state.component,state.variant)&&(state.view==='occ-supervision'||occContextFor(state.component))){state.page='occ';state.occ=occContextFor(state.component,state.variant)||normalizeOccState(state.occ);state.view='occ-supervision';state.domain='operations';state.component=OCC_APPLICATIONS.find(x=>x.id===state.occ.app).component;}
    else if(state.view==='station-networks'){state.page='interfaces';state.controlInterface=normalizeControlState({...state.controlInterface,...getInterfaceContext(state.component,state.view,state.variant)});}
    else{const process=processFor(state.view,state.component,state.variant);if(process){state.page='processes';state.processId=process;state.processStep=processStepFor(state.view,state.variant)||PROCESS_VIEWS[process].steps[0].id;}}
  }
  if(isOccPage()){
    state.occ=normalizeOccState(state.occ);state.playing=false;viewer?.setPlaying(false);
    if(interfaceExplorer){interfaceExplorer.destroy();interfaceExplorer=null;}
    if(occExplorer)occExplorer.destroy();
    renderNavigation();
    occExplorer=createOccApplicationExplorer($('#occ-application-explorer'),{initialState:state.occ,onStateChange:(next,{push=false}={})=>{if(push)rememberCurrentEntry();state.occ=next;state.component=OCC_APPLICATIONS.find(x=>x.id===next.app).component;historyMode=push?'push':'replace';writeHash();},onNavigate:(action,model)=>{rememberCurrentEntry();historyMode='push';if(action==='room'){returnContext=routeState(state);state.page='explore';setView('operations-centre');}else if(action==='processes')openProcess('incident-coordination');else if(action==='interfaces')openInterfaces({domain:model.application.id==='telecom'?'telecom':getInterfaceContext(model.point.component)?.domain||model.application.domain});else if(action==='hardware')selectComponent(model.point.component,{explore:true,primary:true});}});
    $('#occ-context-return').hidden=!returnContext;$('#occ-context-return').textContent='← Return to '+routeLabel(returnContext);
    if(isOccTour())renderLesson();else $('#occ-lesson').replaceChildren();
    writeHash();return;
  }
  if(occExplorer){occExplorer.destroy();occExplorer=null;}
  if(isInterfacePage()){
    state.playing=false;viewer?.setPlaying(false);renderNavigation();
    if(interfaceExplorer)interfaceExplorer.destroy();
    interfaceExplorer=createControlInterfaceExplorer($('#control-interface-explorer'),{initialState:state.controlInterface,onInspect:showInterfaceConcept,onOcc:domain=>{const example=occExampleForDomain(domain);if(!example)return;rememberCurrentEntry();historyMode='push';openOcc(example);},onStateChange:next=>{state.controlInterface=next;historyMode='replace';writeHash();}});
    state.controlInterface=interfaceExplorer.getState();$('#interface-context-return').hidden=!returnContext;$('#interface-context-return').textContent='← Return to '+routeLabel(returnContext);
    if(isInterfaceTour())renderLesson();else $('#interface-lesson').replaceChildren();
    writeHash();return;
  }
  if(interfaceExplorer){interfaceExplorer.destroy();interfaceExplorer=null,occExplorer=null;}
  if(currentTopology()&&!representationFor(state.view,state.variant).equipmentContext)state.presentation='connections';
  if(!isProcessPage()&&state.page!=='reference'&&!currentTopology()&&!electricalStudy(state.view))state.presentation='equipment';
  const focused=document.activeElement;
  const focusScope=focused?.closest('#model-key-list')?'#model-key-list ':focused?.closest('#component-grid')?'#component-grid ':'';
  const focusKey=focused?.matches('#domains button,#scenario-buttons button,#location-trail button,#model-key-list button,#component-grid button,[data-topology-component],[data-process-step],[data-process],[data-role],[data-people],[data-presentation]')?['domain','view','variant','experiment','sink','processStep','process','role','people','presentation','component','topologyComponent'].find(key=>focused.dataset[key]):null;
  const focusValue=focusKey?focused.dataset[focusKey]:null;
  const restoreFocus=()=>{if(focusKey)focusVisible(`${focusScope}[data-${focusKey.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}="${focusValue}"]`);};
  if(isProcessPage()){
    state.playing=false;viewer?.setPlaying(false);renderNavigation();$('#lesson-detail').innerHTML='';
    if(state.page==='people')renderPeoplePage($('#processes-page'),state,{sourceChips});
    else{if(state.page==='learn'){state.processId=processFor(state.view,state.component,state.variant);state.processStep=state.processStep||PROCESS_VIEWS[state.processId].steps[0].id;}renderProcessPage($('#processes-page'),state,{sourceChips,parts});if(state.page==='learn'){$('#processes-page .process-content').insertAdjacentHTML('afterbegin',`<div id="process-tour-bar" class="tour-bar">${tourNavigationMarkup('process-tour-select')}</div>`);$('#processes-page .process-content').insertAdjacentHTML('beforeend','<section id="process-lesson" class="process-lesson"></section>');renderLesson();}}
    const content=$('#processes-page .process-content');if(content)content.insertAdjacentHTML('afterbegin',`<button class="process-return" data-return-explore>← ${returnContext?'Return to '+safe(routeLabel(returnContext)):'Explore the railway'}</button>`);
    writeHash();restoreFocus();return;
  }
  const returningToPhysical=$('#explorer-page').hidden&&state.page!=='reference';
  // A hidden canvas has no usable viewport. Expose it before any camera fit;
  // then fit once more after layout when returning from a functional surface.
  if(state.page!=='reference')$('#explorer-page').hidden=false;
  $('#processes-page').innerHTML='';if(!viewer&&!loadingViewer&&state.page!=='reference')queueMicrotask(startViewer);syncViewer(changedView);chooseVisibleRepresentative();renderNavigation();renderDetail();renderScenario();renderLesson();renderSystemContext();if(state.page==='reference')renderReference();syncControls();renderConnections();rebuildLabels();writeHash();
  if(returningToPhysical){const openedView=state.view;requestAnimationFrame(()=>{if(viewer&&state.view===openedView&&!isOccPage()&&!isInterfacePage()&&!isProcessPage()&&state.page!=='reference'){viewer.resize();viewer.frameModel?.();updateLabels();}});}
  restoreFocus();
}
function setPage(page){
  if(page==='occ'){openOcc();return;}
  if(page==='explore'&&isOccPage()){state.page='explore';setView('operations-centre');return;}
  if(page==='interfaces'){openInterfaces();return;}
  if(page==='explore'&&processFor(state.view,state.component,state.variant)){setDomain('network');return;}
  state.page=page;if(page==='processes'){openProcess(state.processId);return;}
  if(page==='learn')applyLesson(true);
  else {render();if(page!=='reference')requestAnimationFrame(()=>viewer?.resize());$('#workspace').scrollIntoView({block:'start',behavior:'instant'});}
}
function setDomain(id){
  const d=DOMAINS.find(d=>d.id===id);if(!d)return;
  returnContext=null;configurationEffect='';allComponents=false;state.instanceId=null;state.functionalPath=null;state.workspace=null;state.studyId=null;state.allInstances=false;
  state={...state,page:'explore',domain:id,view:d.view,component:d.component,scenario:'nominal',mode:['power','vehicle'].includes(id)?'motoring':'coasting',cutaway:cutawayFor(d.view),variant:defaultVariant(d.view),exploded:0,explodeScope:'all'};
  state.presentation=preferredPresentation(state.view,state.variant);syncPlatform();
  state.technology=technologyForView(state.technology,state.view,state.variant);render(true);orientToView();announce(d.label);
}
function setView(id){
  if(!VIEWS[id])return;
  if(id==='occ-supervision'){openOcc();return;}
  if(id!==state.view){state.instanceId=null;state.functionalPath=null;state.studyId=null;state.allInstances=false;state.exploded=0;state.explodeScope='all';}
  if(id==='station-networks'){openInterfaces({domain:'building'});return;}if(PROCESS_REDIRECTS[id]){openProcess(PROCESS_REDIRECTS[id]);return;}state.page=state.page==='learn'?'learn':'explore';
  state.domain=domainForView(id,DOMAINS,state.domain)?.id||state.domain;allComponents=false;configurationEffect='';
  state.view=id;state.variant=defaultVariant(id);state.scenario='nominal';state.mode=['power','vehicle'].includes(state.domain)?'motoring':'coasting';state.exploded=0;state.cutaway=cutawayFor(id);
  state.presentation=preferredPresentation(id,state.variant);state.component=VIEWS[id].component;syncPlatform();
  state.technology=technologyForView(state.technology,id,state.variant);viewer?.setTechnology(state.technology);
  const candidates=viewer?.getComponentIds(id)||[];
  if(!candidates.includes(targetFor(state.component)))state.component=VIEWS[id].component;
  viewer?.setView(id);viewer?.setInspectionMode?.('assembled');viewer?.setCutaway(state.cutaway);viewer?.setVariant(state.variant);chooseVisibleRepresentative();render(!viewer);orientToView();
}
function orientToView(){if($('#component-explanation'))$('#component-explanation').open=false;requestAnimationFrame(()=>{const title=$('#scene-title');title?.setAttribute('tabindex','-1');title?.focus({preventScroll:true});$('#workspace')?.scrollIntoView({block:'start',behavior:'instant'});});}
function chooseVisibleRepresentative(){
  if(isConnections()&&currentTopology()?.nodes.some(n=>n.component===state.component))return;
  if(!viewer)return;const visible=viewer.getVisibleComponentIds();if(equipmentInView(state.component)&&visible.includes(targetFor(state.component)))return;
  const config=VIEWS[state.view],variant=config.variants?.find(x=>x.id===state.variant);
  const candidates=[variant?.component,config.component,...activeDomain().parts,...CONCEPTS.map(c=>c.id)];
  const candidate=candidates.find(id=>parts.has(id)&&equipmentInView(id)&&visible.includes(targetFor(id)));if(candidate){state.component=candidate;viewer.setSelected(targetFor(candidate));}
}
function selectComponent(id,{explore=state.page!=='learn',focus=false,primary=false,instanceId=null}={}){
  if(!parts.has(id))return;const occContext=occContextFor(id);if(occContext){openOcc(occContext);return;}if(interfaceConceptIds.has(id)){openInterfaces(getInterfaceContext(id));showInterfaceConcept(id);return;}const process=processFor(primary?viewFor(id):null,id);if(process){openProcess(process);return;}
  if(instanceId)state.instanceId=instanceId;else if(id!==state.component){state.instanceId=null;state.allInstances=false;}
  const origin=routeState(state),oldView=state.view,oldDomain=state.domain;
  const staysInDiagram=!primary&&isConnections()&&Boolean(currentTopology()?.nodes.some(n=>n.component===id)||electricalStudy(state.view)&&viewer?.getComponentIds(state.view).includes(targetFor(id)));
  const destinationView=primary||!staysInDiagram&&!viewer?.getComponentIds(state.view).includes(targetFor(id))?viewFor(id):state.view;
  if(!destinationView.startsWith('power-'))state.electrification=electrificationForComponent(state.electrification,id);viewer?.setElectrification?.(state.electrification);
  state.technology=technologyForComponent(state.technology,id);viewer?.setTechnology(state.technology);
  const wasVisible=viewer?.getVisibleComponentIds().includes(targetFor(id));
  if(explore)state.page='explore';state.component=id;
  state.view=destinationView;
  if(state.view==='station'&&id==='platform-screen-door'&&state.platformEdge==='open')state.platformEdge='full-height';
  if(state.view!==oldView){state.exploded=0;state.explodeScope='all';state.functionalPath=null;state.studyId=null;state.allInstances=false;state.domain=domainForView(state.view,DOMAINS,domainFor(id).id)?.id||domainFor(id).id;returnContext=origin;allComponents=false;}
  if(!staysInDiagram&&(oldView!==state.view||!wasVisible)){const desired=variantFor(id,state.view);state.variant=VIEWS[state.view].variants?.some(x=>x.id===desired)?desired:defaultVariant(state.view);}
  syncPlatform({fromComponent:true});if(oldView!==state.view)state.presentation=preferredPresentation(state.view,state.variant);
  state.technology=technologyForView(state.technology,state.view,state.variant);
  if(oldDomain!==state.domain&&state.page!=='learn'){state.scenario='nominal';state.mode=['power','vehicle'].includes(state.domain)?'motoring':'coasting';}
  if(oldView!==state.view||!wasVisible&&!staysInDiagram)state.cutaway=cutawayFor(state.view)||state.view==='vehicle';
  render(oldView!==state.view);
  if(focus)viewer?.focusComponent(targetFor(id));if(oldView!==state.view)orientToView();
  $('#search-results').hidden=true;$('#component-search').value='';
  announce(parts.get(id).label);
}
function applyLesson(doRender=true){
  const t=TOURS[state.lesson],a=t.action;
  state={...state,presentation:a.presentation||preferredPresentation(a.view||t.view,a.variant||defaultVariant(a.view||t.view)),page:'learn',domain:t.domain,view:a.view||t.view,component:a.component||t.component,mode:a.mode||'motoring',scenario:a.scenario||'nominal',cutaway:a.cutaway??cutawayFor(t.view),variant:a.variant||defaultVariant(a.view||t.view),exploded:typeof a.exploded==='number'?a.exploded:a.exploded ? 0.35 : 0};
  if(a.platformEdge)state.platformEdge=a.platformEdge;if(a.platformSensor)state.platformSensor=a.platformSensor;syncPlatform({fromComponent:true});
  state.technology=technologyForView(technologyForComponent(normalizeTechnology(a.technology||{},state.technology),state.component),state.view,state.variant);
  if(state.scenario==='radio-loss'&&!['loop','radio'].includes(state.technology.control))state.technology={...state.technology,control:'radio'};
  if(state.scenario==='regen-limited')state.sink='resistor';
  const lessonProcess=processFor(state.view,state.component,state.variant);
  if(lessonProcess){state.processId=lessonProcess;state.processStep=a.processStep||processStepFor(state.view,state.variant)||PROCESS_VIEWS[lessonProcess].steps[0].id;}
  if(isOccTour()){state.occ=normalizeOccState({...occContextFor(state.component,state.variant),...a.occ});state.instanceId=null;state.functionalPath=null;state.allInstances=false;state.studyId=null;state.workspace=null;state.exploded=0;state.explodeScope='all';}
  if(isInterfaceTour()){
    state.controlInterface=normalizeControlState({...getInterfaceContext(state.component,state.view,state.variant),...a.interfaces});
    state.instanceId=null;state.functionalPath=null;state.allInstances=false;state.studyId=null;state.workspace=null;state.exploded=0;
  }
  if(t.id==='configuration-evidence'){state.processId='configuration-change';state.processStep='verify';}
  if(a.electrification)state.electrification=normalizeElectrification(a.electrification);
  if(t.id==='odometry-error'){$('#sensor-error').value=10;updateSensor();}
  if(doRender){render(true);requestAnimationFrame(()=>{if(!isProcessPage()&&!isInterfacePage()&&!isOccPage())viewer?.resize();const heading=$(isOccTour()?'#occ-page h1':isInterfaceTour()?'#interfaces-page h2':isProcessPage()?'#processes-page h1':'#scene-title');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});$('#workspace').scrollIntoView({block:'start',behavior:'instant'});});}
}
function updateSensor(){const error=Number($('#sensor-error').value);$('#sensor-error-value').textContent=`${error>0?'+':''}${error}%`;$('#wheel-estimate').textContent=`${wheelEstimate(error).toFixed(0)} m`;}
function searchViews(){
  const q=$('#view-search').value.trim().toLowerCase(),results=$('#view-results');
  $('#domains').hidden=Boolean(q);results.hidden=!q;
  if(!q){results.replaceChildren();return;}
  const matches=Object.entries(VIEWS).filter(([id,view])=>!PROCESS_REDIRECTS[id]&&`${view.label} ${domainForView(id,DOMAINS)?.label||''}`.toLowerCase().includes(q));
  results.innerHTML=matches.length?`<p class="view-search-count" role="status">${matches.length} matching ${matches.length===1?'view':'views'}</p>`+matches.map(([id,view])=>`<button data-view="${id}"><strong>${safe(view.label)}</strong><small>${safe(domainForView(id,DOMAINS)?.label||'')}</small></button>`).join(''):'<p role="status">No views found. Try a place or system name.</p>';
}
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

function pinIds(){return viewer?.getComponentIds(state.view).filter(id=>parts.has(id)&&equipmentInView(id)&&!['network-overview','depot-layout','operations-centre'].includes(id))||[];}
function modelNumber(id){const index=pinIds().indexOf(targetFor(id));return index<0?'·':String(index+1).padStart(2,'0');}

// Label nodes remain stable between frames so keyboard focus survives camera motion.
function rebuildLabels(){
  if(!viewer)return;
  const layer=$('#model-labels'),ids=pinIds();
  for(const [id,nodes] of labelElements){if(!ids.includes(id)){nodes.button.remove();labelElements.delete(id);}}
  for(const [index,id] of ids.entries()){
    let nodes=labelElements.get(id);
    if(!nodes){const button=document.createElement('button');button.className='model-pin';button.dataset.component=id;button.title=parts.get(id).label;layer.append(button);nodes={button};labelElements.set(id,nodes);}
    nodes.number=index+1;nodes.button.textContent=String(index+1).padStart(2,'0');nodes.button.setAttribute('aria-label',`${index+1}. Inspect ${parts.get(id).label}`);
  }
  const visible=new Set(viewer.getVisibleComponentIds()),selected=targetFor(state.component);
  const visibleIds=ids.filter(id=>visible.has(id));
  $('#equipment-choice').innerHTML='<option value="">Choose a part</option>'+visibleIds.map(id=>`<option value="${id}">${String(labelElements.get(id).number).padStart(2,'0')}  ${safe(shortLabels[id]||parts.get(id).label)}</option>`).join('');
  $('#equipment-choice').value=visibleIds.includes(selected)?selected:'';
  if($('#model-key-list'))$('#model-key-list').innerHTML=visibleIds.map(id=>`<button class="part-key-item" data-component="${id}" aria-pressed="${id===selected}"><span class="part-key-number" aria-hidden="true">${String(labelElements.get(id).number).padStart(2,'0')}</span><span class="part-key-label">${safe(shortLabels[id]||parts.get(id).label)}</span></button>`).join('');
  updateLabels();
}
function updateLabels(){
  if(!viewer||state.page==='reference'||isProcessPage()||isInterfacePage()||isConnections())return;
  const width=$('#viewer').clientWidth,height=$('#viewer').clientHeight;
  const selected=targetFor(state.component),preferred=new Set(activeDomain().parts.map(targetFor));
  const priorities=state.view==='railway'?new Set(['network-station','network-depot','network-control-centre','network-substation','network-train','network-turnback']):state.view==='operations-centre'?new Set(['operations-equipment-room','occ-shared-display','occ-console','occ-communications','occ-cable-route']):preferred;
  const points=viewer.getComponentScreenPositions()
    .filter(p=>labelElements.has(p.id)&&(state.labelMode!=='selected'||p.id===selected))
    .sort((a,b)=>(a.id===selected?-1000:priorities.has(a.id)?-100:0)-(b.id===selected?-1000:priorities.has(b.id)?-100:0)||labelElements.get(a.id).number-labelElements.get(b.id).number);
  const positions=state.labels?placeModelPins(points,{width,height,top:$('#quick-play')?.getClientRects().length?58:12,bottom:(getComputedStyle($('.stage-footer')).position==='absolute'?$('.stage-footer').getBoundingClientRect().height:0)+10,radius:matchMedia('(pointer:coarse)').matches?18:15,limit:state.labelMode==='selected'?1:width<500?5:12}):[];
  const placed=new Set(positions.map(p=>p.id));
  for(const [id,{button}] of labelElements)button.hidden=!placed.has(id);
  for(const p of positions){const {button}=labelElements.get(p.id);button.hidden=false;button.style.left=`${p.x}px`;button.style.top=`${p.y}px`;button.classList.toggle('selected',p.id===selected);button.setAttribute('aria-pressed',String(p.id===selected));}
  $$('#model-key-list button').forEach(button=>{
    button.setAttribute('aria-pressed',String(button.dataset.component===selected));button.classList.toggle('pin-visible',placed.has(button.dataset.component));
  });
  if($('#model-key-note')){
    const selectedVisible=placed.has(selected);
    $('#model-key-note').textContent=!state.labels?'Pins are off. Select equipment in the key or model.':selectedVisible?'Numbers stay attached to visible equipment. Select any name for its explanation.':'Some pins are hidden by equipment or overlap. Use the key to select a part, then Frame selection to locate it.';
  }
}
function labelLoop(time){labelFrame=requestAnimationFrame(labelLoop);if(!document.hidden&&state.page!=='reference'&&!isInterfacePage()&&!isOccPage()&&!isProcessPage()&&time-lastLabelTime>150){updateLabels();updateMotionGuide();lastLabelTime=time;}}
async function startViewer(){
  if(loadingViewer||viewer||isInterfacePage()||isOccPage()||isProcessPage()||state.page==='reference')return;loadingViewer=true;$('#model-error').hidden=true;
  try{
    const {createViewer}=await import('./viewer.js?v=anatomy-depth-8');
    viewer=createViewer($('#viewer'),{onSelect:(id,metadata={})=>{rememberCurrentEntry();historyMode='push';selectComponent(id,{instanceId:metadata.instanceId});},onReady:info=>{rendererStatus=info.renderer;$('#loading')?.remove();},onError:()=>{$('#model-error').hidden=false;}});
    syncViewer(true);chooseVisibleRepresentative();render();rebuildLabels();syncControls();if(!labelFrame)labelFrame=requestAnimationFrame(labelLoop);
  }catch(error){$('#loading')?.remove();$('#model-error').hidden=false;console.error('The 3D renderer could not start.',error);}
  finally{loadingViewer=false;}
}

document.addEventListener('click',event=>{
  const skip=event.target.closest('a.skip');if(skip){event.preventDefault();const page=$(skip.dataset.contentTarget||'#workspace');const target=page?.querySelector('h1,h2')||page;target?.setAttribute('tabindex','-1');target?.focus({preventScroll:true});target?.scrollIntoView({block:'start',behavior:'instant'});return;}
  const diagramNode=event.target.closest('[data-topology-component]');if(diagramNode){const nodeId=diagramNode.dataset.topologyNode;rememberCurrentEntry();historyMode='push';selectComponent(diagramNode.dataset.topologyComponent);focusVisible(`[data-topology-node="${nodeId}"]`);return;}
  const b=event.target.closest('button');if(!b)return;
  rememberCurrentEntry();
  historyMode=b.matches('[data-open-occ],[data-open-interfaces],[data-return-explore],#occ-context-return,#interface-context-return,#previous-view,#next-view,[data-process],[data-process-step],[data-role],[data-people],[data-presentation],[data-page],[data-domain],[data-view],[data-workspace],[data-workspace-view],[data-inspect-view],[data-variant],[data-component],[data-explore-component],[data-reference],[data-reading-guide],[data-lesson],[data-experiment],[data-sink],[data-destination],#return-context,#inspect-propulsion,#inspect-control,#lesson-action,#previous-lesson,#next-lesson')?'push':'replace';
  if(b.matches('[data-domain],[data-view],[data-workspace],[data-workspace-view]')){$('.railway-navigation').classList.remove('is-open');$('#navigator-toggle').setAttribute('aria-expanded','false');$('#view-search').value='';searchViews();}
  if(b.id==='open-navigator'||b.id==='sidebar-find'){navigationSearch.open();}
  else if(b.hasAttribute('data-tour-lesson')){const heading=$(isOccTour()?'#occ-lesson h3':'#interface-lesson h3');heading?.focus({preventScroll:true});heading?.scrollIntoView({block:'start',behavior:'instant'});}
  else if(b.hasAttribute('data-open-occ')){openOcc({app:b.dataset.openOcc||'telecom'});}
  else if(b.dataset.openInterfaces){openInterfaces({domain:b.dataset.openInterfaces});}
  else if(b.id==='occ-context-return'||b.id==='interface-context-return'||b.hasAttribute('data-return-explore')){returnToContext();}
  else if(b.id==='previous-view'||b.id==='next-view'){const sequence=learningViewSequence(),i=sequence.indexOf(state.view),next=sequence[i+(b.id==='next-view'?1:-1)];if(next)setView(next);}
  else if(b.dataset.workspace){const route=workspaceRoute(b.dataset.workspace);if(route){state.workspace=b.dataset.workspace;state.studyId=null;setView(route);}}
  else if(b.dataset.workspaceView){const origin=routeState(state),selected=state.component;state.workspace=b.dataset.workspaceOwner;setView(b.dataset.workspaceView);returnContext=origin;if(viewer?.getComponentIds(state.view).includes(targetFor(selected)))selectComponent(selected);else render();}
  else if(b.id==='navigator-toggle'){const open=$('.railway-navigation').classList.toggle('is-open');b.setAttribute('aria-expanded',String(open));}
  else if(b.id==='read-selection'){if($('#component-explanation'))$('#component-explanation').open=true;const heading=$('#component-detail h2');heading?.setAttribute('tabindex','-1');heading?.focus();heading?.scrollIntoView({block:'start',behavior:'instant'});}
  else if(b.id==='component-scope'){allComponents=!allComponents;renderDetail();}
  else if(b.id==='focus-selection'){labelLayoutKey='';viewer?.frameSelection?.(targetFor(state.component));syncControls();updateLabels();}
  else if(b.id==='isolate-selection'){const current=viewer?.getExplorationState?.();viewer?.setIsolation?.(current?.isolation?null:targetFor(state.component));renderDetail();syncControls();rebuildLabels();}
  else if(b.id==='inspect-assembly'){const current=viewer?.getExplorationState?.();if(current?.explodeScope==='selected'&&current?.exploded>0)viewer?.restoreExploration?.();else viewer?.inspectAssembly?.(targetFor(state.component));state.cutaway=viewer?.getCutaway?.()||false;state.playing=false;renderDetail();syncControls();rebuildLabels();rememberCurrentEntry();}
  else if(b.dataset.inspectionProgress){viewer?.setExploded(Number(b.dataset.inspectionProgress));syncControls();updateLabels();rememberCurrentEntry();}
  else if(b.id==='restore-context'){viewer?.restoreExploration?.();state.cutaway=viewer?.getCutaway?.()||false;renderDetail();syncControls();rebuildLabels();rememberCurrentEntry();}
  else if(b.id==='larger-model'){const expanded=$('.explorer-shell').classList.toggle('model-expanded');b.setAttribute('aria-pressed',String(expanded));b.textContent=expanded?'Standard model size':'Larger model';requestAnimationFrame(()=>{viewer?.resize();viewer?.frameModel?.();syncControls();updateLabels();});}
  else if(b.id==='return-context'){returnToContext();}
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
  else if(b.dataset.variant){const process=processFor(state.view,null,b.dataset.variant);if(process){openProcess(process,processStepFor(state.view,b.dataset.variant));return;}if((state.view==='operations-centre'||state.view==='occ-workplace')&&b.dataset.variant==='handover'){openProcess('duty-handover');return;}if(state.view==='operations-centre'&&b.dataset.variant==='incident'){openProcess('incident-coordination');return;}configurationEffect='';state.variant=b.dataset.variant;syncPlatform();const representative=VIEWS[state.view].variants?.find(x=>x.id===state.variant)?.component;if(parts.has(representative))state.component=representative;state.technology=technologyForView(state.technology,state.view,state.variant);state.scenario='nominal';viewer?.setTechnology(state.technology);viewer?.setVariant(state.variant);chooseVisibleRepresentative();render();viewer?.frameVariant?.();}
  else if(b.dataset.component){const nodeId=b.dataset.connectionNode;selectComponent(b.dataset.component,{primary:Boolean(b.closest('#search-results'))});if(nodeId)focusVisible(`[data-connection-node="${nodeId}"]`);}
  else if(b.dataset.source)openSources(b.dataset.source);
  else if(b.dataset.camera){labelLayoutKey='';viewer?.setCameraPreset(b.dataset.camera);syncControls();updateLabels();}
  else if(b.dataset.motionPhase!==undefined)seekSequence(Number(b.dataset.motionPhase));
  else if(b.id==='motion-previous')stepSequence(-1);
  else if(b.id==='motion-next')stepSequence(1);
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
  else if(b.id==='play'||b.id==='quick-play'||b.id==='diagram-quick-play'){if(!canAnimateState())return;if(electricalStudy(state.view)&&!isConnections()){state.presentation='connections';render();}state.playing=viewer?.setPlaying(!state.playing)||false;syncControls();}
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
  state.presentation=preferredPresentation(state.view,state.variant);syncPlatform();state.technology=technologyForView(state.technology,state.view,state.variant);render(true);orientToView();announce(VIEWS[state.view].label);
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
$('#platform-edge-choice').innerHTML=PLATFORM_EDGES.map(x=>`<option value="${x.id}">${safe(x.label)}</option>`).join('');
$('#platform-sensor-choice').innerHTML=PLATFORM_SENSORS.map(x=>`<option value="${x.id}">${safe(x.label)}</option>`).join('');
for(const [selector,key] of [['#platform-edge-choice','platformEdge'],['#platform-sensor-choice','platformSensor']])$(selector).addEventListener('change',e=>{rememberCurrentEntry();historyMode='push';state[key]=e.target.value;state.exploded=0;state.playing=false;configurationEffect='';syncPlatform();viewer?.setPlatform?.(state);viewer?.setVariant(state.variant);chooseVisibleRepresentative();render();});
$('#electrification-choice').addEventListener('change',e=>{rememberCurrentEntry();historyMode='push';state.electrification=normalizeElectrification(e.target.value);state.exploded=0;configurationEffect=electrificationProfile(state.electrification).description;viewer?.setElectrification?.(state.electrification);chooseVisibleRepresentative();render();});
$('#propulsion-choice').innerHTML=PROPULSION_CHOICES.map(x=>`<option value="${x.id}">${safe(x.label)}</option>`).join('');
$('#control-choice').innerHTML=CONTROL_CHOICES.map(x=>`<option value="${x.id}">${safe(x.label)}</option>`).join('');
$('#view-choice').addEventListener('change',e=>{rememberCurrentEntry();historyMode='push';setView(e.target.value);announce(VIEWS[state.view].label);});
$('#propulsion-choice').addEventListener('change',e=>changeTechnology('propulsion',e.target.value));
$('#control-choice').addEventListener('change',e=>changeTechnology('control',e.target.value));
$('#view-search').addEventListener('input',searchViews);
$('#view-search').addEventListener('keydown',e=>{if(e.key==='Escape'){$('#view-search').value='';searchViews();}if(e.key==='ArrowDown'){e.preventDefault();$('#view-results button')?.focus();}if(e.key==='Enter'){$('#view-results button')?.click();}});
$('#equipment-choice').addEventListener('change',e=>{if(!e.target.value)return;rememberCurrentEntry();historyMode='push';selectComponent(e.target.value);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('.railway-navigation').classList.contains('is-open')){$('.railway-navigation').classList.remove('is-open');$('#navigator-toggle').setAttribute('aria-expanded','false');$('#navigator-toggle').focus();}});
$('#component-search').addEventListener('input',searchComponents);
$('#component-search').addEventListener('keydown',e=>{if(e.key==='Escape')$('#search-results').hidden=true;if(e.key==='ArrowDown'){$('#search-results button')?.focus();e.preventDefault();}if(e.key==='Enter'){$('#search-results button')?.click();}});
document.addEventListener('click',e=>{if(!e.target.closest('.inspector-search'))$('#search-results').hidden=true;});
$('#reference-search').addEventListener('input',renderReference);$('#reference-domain').addEventListener('change',renderReference);
$('#cutaway').addEventListener('change',e=>{state.cutaway=e.target.checked;syncViewer();rememberCurrentEntry();});
$('#explode').addEventListener('input',e=>{state.exploded=Number(e.target.value);syncViewer();rememberCurrentEntry();$('#model-key').textContent=modelNote()+(state.exploded>=.5?' Message paths are hidden while parts are separated.':'');});
$('#explode-scope').addEventListener('change',e=>{state.explodeScope=viewer?.setExplodeScope?.(e.target.value)||'all';viewer?.setExploded(state.exploded);syncControls();updateLabels();rememberCurrentEntry();});
$('#label-density').addEventListener('change',e=>{state.labels=e.target.value!=='off';state.labelMode=e.target.value;updateLabels();rememberCurrentEntry();});
$('#phase').addEventListener('input',e=>seekSequence(Number(e.target.value)));
$('#motion-loop').addEventListener('change',e=>{state.loop=e.target.checked;viewer?.setPlayback({duration:guideForState()?.duration||12,loop:state.loop});});
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
document.addEventListener('change',e=>{if(e.target.hasAttribute('data-tour-select')){rememberCurrentEntry();historyMode='push';state.lesson=Number(e.target.value);applyLesson();}});
document.addEventListener('keydown',e=>{const n=e.target.closest?.('[data-topology-component]');if(n&&['Enter',' '].includes(e.key)){e.preventDefault();n.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
const navigationSearch=createNavigationSearch($('#navigator-dialog'),{index:buildNavigationIndex({views:VIEWS,concepts:CONCEPTS,tours:TOURS,processes:PROCESS_VIEWS,domains:DOMAINS}),onNavigate:item=>{
  rememberCurrentEntry();historyMode='push';returnContext=routeState(state);
  if(item.kind==='view')setView(item.id);else if(item.kind==='component')selectComponent(item.id,{explore:true,primary:true});else if(item.kind==='process')openProcess(item.id);else if(item.kind==='occ')openOcc({app:item.id});else if(item.kind==='interface')openInterfaces({domain:item.id});else if(item.kind==='tour'){state.lesson=Number(item.id);applyLesson();}
}});
document.addEventListener('keydown',event=>{if((event.key==='/'||event.key.toLowerCase()==='k'&&(event.ctrlKey||event.metaKey))&&!event.target.closest('input,textarea,select,[contenteditable="true"]')){event.preventDefault();if(!$('#navigator-dialog').open)navigationSearch.open();}});

$('.main-nav [data-page="learn"] span').textContent=TOURS.length;
$('#reference-domain').insertAdjacentHTML('beforeend','<option value="processes">Processes & evidence</option><option value="people">People & automation</option>');
$('#reference-domain').insertAdjacentHTML('beforeend',DOMAINS.map(d=>`<option value="${d.id}">${d.label}</option>`).join(''));
readHash();render();startViewer();


