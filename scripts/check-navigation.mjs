import {representationFor} from '../dist/representation-guidance.js';
import {CONTROL_DOMAINS,CONTROL_ARCHITECTURES,CONTROL_SCENARIOS,normalizeControlState,getInterfaceContext,evaluateControlInterface} from '../dist/control-interfaces-data.js';
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
import {processFor,processStepFor,PROCESS_REDIRECTS} from '../dist/process-ui.js';
import {technologyFromUrl,technologyForView,technologyForComponent,normalizeTechnology} from '../dist/technology.js';
import {applyAnatomyQuery,writeAnatomyQuery} from '../dist/learning-workspaces.js';
import {buildNavigationIndex,searchNavigation} from '../dist/navigation-search.js';

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
const dependencies={PROCESS_REDIRECTS,representationFor,normalizeControlState,getInterfaceContext,processStepFor,applyAnatomyQuery,writeAnatomyQuery,normalizePlatformState,platformForComponent,createBrowserEnvironment,DEFAULT_ELECTRIFICATION,normalizeElectrification,electrificationForComponent,PROCESS_VIEWS,PEOPLE_ROLES,processFor,DOMAINS,VIEWS,MODES,CONCEPTS,TOURS,variantFor,defaultVariant,cutawayFor,domainForView,routeState,technologyFromUrl,technologyForView,technologyForComponent,normalizeTechnology};
const harness=new Function(...Object.keys(dependencies),`
  const {window,matchMedia,processMenu,querySelector:$}=createBrowserEnvironment();
  const parts=new Map(CONCEPTS.map(c=>[c.id,c]));
  const savedTechnology={};
  let state={},historyMode='replace',returnContext=null,lastReadUrl='',configurationEffect='',allComponents=false,lastExplorationContext='';
  let location=new URL('https://example.test/railway-anatomy/');
  const history={state:null,pushState(value,title,url){this.state=value;location=new URL(url,location);},replaceState(value,title,url){this.state=value;location=new URL(url,location);}};
  const localStorage={setItem(){}};
  function announce(){}
  function orientToView(){}
  ${source.slice(source.indexOf('function applyLesson('),source.indexOf('function updateSensor()'))}
  function render(){writeHash();}
  ${source.slice(source.indexOf('const preferredPresentation='),source.indexOf('function equipmentInView'))}
  ${source.slice(begin,end)}
  ${source.slice(restoreBegin,restoreEnd)}
  return {
    roundTrip(value){state=structuredClone(value);writeHash();const url=location.href;state={};readHash();return {url,state:structuredClone(state)};},
    parse(url){location=new URL(url);state={};readHash();return structuredClone(state);},
    lesson(id,prior){state=structuredClone(prior);state.lesson=TOURS.findIndex(t=>t.id===id);assertLesson();applyLesson(false);return structuredClone(state);},
    restore(url,saved,current){location=new URL(url);history.state={railway:structuredClone(saved),returnContext:null};state=structuredClone(current);lastReadUrl='';restoreNavigation();return structuredClone(state);},
    resize(width){const before=structuredClone(state);window.innerWidth=width;window.dispatchEvent(new Event('resize'));return {menuOpen:processMenu.open,before,state:structuredClone(state)};},
    returnTo(saved,current){returnContext=structuredClone(saved);state=structuredClone(current);lastExplorationContext='departing-view';const b={id:'return-context'};
      ${source.slice(returnBegin+5,returnEnd)}
      return {state:structuredClone(state),context:lastExplorationContext};
    }
  };
  function assertLesson(){if(state.lesson<0)throw new Error('Unknown tour');}
`)(...Object.values(dependencies));

const base={page:'explore',domain:'vehicle',view:'vehicle',component:'carbody',variant:'default',technology:{propulsion:'lim',control:'loop'},mode:'coasting',scenario:'nominal',sink:'train',cutaway:false,exploded:0,explodeScope:'all',playing:false,labels:true,labelMode:'nearby',lesson:0};

// A functional tour keeps its own lesson identity while sharing the real
// interface explorer. Its selected conditions must survive a copied URL.
const interfaceLesson=harness.lesson('supervisory-boundaries',base);
assert.equal(interfaceLesson.page,'learn');assert.equal(interfaceLesson.controlInterface.domain,'building');
const selectedInterfaceLesson={...interfaceLesson,controlInterface:normalizeControlState({domain:'tunnel',architecture:'integrated',scenario:'feedback-missing',trace:'request',step:4,connections:{tunnel:'supervisory',building:'absent'}})};
const reopenedInterfaceLesson=harness.roundTrip(selectedInterfaceLesson);
assert.equal(new URL(reopenedInterfaceLesson.url).hash,'#learn/supervisory-boundaries','An interface comparison replaced the lesson route');
assert.equal(reopenedInterfaceLesson.state.page,'learn');
assert.deepEqual(reopenedInterfaceLesson.state.controlInterface,selectedInterfaceLesson.controlInterface,'The interface tour lost its chosen responsibility or evidence condition');
assert.equal(harness.parse('https://example.test/railway-anatomy/#learn/supervisory-boundaries').controlInterface.domain,'building','A plain tour URL must start at its declared BAS example');
for(const [id,process,step]of [['depot-energy','work-protection','movement'],['infrastructure-follow-up','infrastructure-maintenance','review'],['configuration-evidence','configuration-change','verify']]){
  const lesson=harness.lesson(id,{...base,processId:'configuration-change',processStep:'verify'});
  assert.equal(lesson.page,'learn');assert.equal(lesson.processId,process);assert.equal(lesson.processStep,step,`${id} retained an unrelated earlier process step`);
  const parsed=harness.roundTrip(lesson).state;assert.equal(parsed.processStep,step);assert.equal(parsed.page,'learn');
}
let routes=0,processRoutes=0,interfaceRoutes=0;
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
for(const [id,p]of Object.entries(PROCESS_VIEWS))for(const step of p.steps){const actual=harness.parse(`https://example.test/railway-anatomy/#processes/${id}/${step.id}`);assert.equal(actual.page,'processes');assert.equal(actual.processId,id);assert.equal(actual.processStep,step.id);processRoutes++;}
for(const [hash,process]of [['explore/depot/change-evidence/change-baseline/installed','configuration-change'],['explore/operations/occ-incident/occ-alarm-queue/reported','incident-coordination'],['explore/operations/operations-centre/operations-centre/handover','duty-handover']]){const actual=harness.parse(`https://example.test/railway-anatomy/#${hash}`);assert.equal(actual.page,'processes','A legacy process route returned to a physical model');assert.equal(actual.processId,process);}
for(const [legacy,profile]of [['ac','overhead-ac'],['dc','fourth-rail-dc']]){const actual=harness.parse(`https://example.test/railway-anatomy/#explore/power/electrification/supply-conversion/${legacy}`);assert.equal(actual.electrification,profile);assert.equal(actual.variant,'chain');}
const map=harness.roundTrip({...base,domain:'communications',view:'communications-overview',component:'communications-system',variant:'supervision',presentation:'connections'}).state;assert.equal(map.presentation,'connections');
for(const exploded of [.25,.65,1]){
 const expected={...base,view:'bogie',component:'bogie',technology:{propulsion:'rotary',control:'etcs2'},instanceId:'view-bogie/group:2/axlebox:1',functionalPath:'view-bogie/load-path',workspace:'maintenance',studyId:'brake-unit-to-test',allInstances:true,cutaway:false,explodeScope:'selected',exploded};
 const actual=harness.roundTrip(expected).state;
 for(const key of ['instanceId','functionalPath','workspace','studyId','allInstances','cutaway','explodeScope','exploded'])assert.equal(actual[key],expected[key],'An anatomy bookmark lost '+key);
 assert.deepEqual(actual.technology,expected.technology,'Inspection changed independent train control');
}
for(const [mode,cutaway]of [['assembled',false],['section',true]]){
 const actual=harness.parse('https://example.test/railway-anatomy/?inspect='+mode+'#explore/vehicle/bogie/bogie/default');assert.equal(actual.cutaway,cutaway);assert.equal(actual.exploded,0);
}
const malformedAnatomy=harness.parse('https://example.test/railway-anatomy/?inspect=staged&exposure=NaN&workspace=missing&instance=%00#explore/vehicle/bogie/bogie/default');
assert.equal(malformedAnatomy.exploded,1);assert.equal(malformedAnatomy.workspace,null);assert.equal(malformedAnatomy.instanceId,null);
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
assert.equal(harness.parse('https://example.test/railway-anatomy/?presentation=equipment#explore/operations/occ-supervision/occ-supervisory-request/traffic').presentation,'connections');
assert.equal(harness.parse('https://example.test/railway-anatomy/#explore/power/power-transformer/transformer/default').presentation,'connections');

// A shared interface URL must preserve its actual connection capability and
// evidence condition, not merely reopen the same headline. Exercise the real
// production reader/writer with multi-function overrides and independent train
// configuration, then evaluate the reconstructed state.
const customConnections={tunnel:'supervisory',building:'absent',vertical:'monitor',platform:'monitor',security:'absent'};
for(const d of CONTROL_DOMAINS)for(const architecture of CONTROL_ARCHITECTURES)for(const scenario of CONTROL_SCENARIOS)for(const trace of ['indication','request']){
  const controlInterface=normalizeControlState({domain:d.id,architecture:architecture.id,scenario:scenario.id,trace,step:4,connections:customConnections});
  const saved={...base,page:'interfaces',controlInterface,technology:{propulsion:'rotary',control:'etcs2'},electrification:'overhead-ac',instanceId:'old-physical-instance',functionalPath:'old-physical-path',studyId:'brake-unit-to-test',workspace:'maintenance',explodeScope:'selected',exploded:1};
  const result=harness.roundTrip(saved),url=new URL(result.url),actual=result.state;
  assert.equal(actual.page,'interfaces');assert.equal(url.hash,`#interfaces/${d.id}/${architecture.id}`);
  assert.deepEqual(actual.controlInterface,controlInterface,`${d.id}/${architecture.id}/${scenario.id}/${trace}: interface contract lost in bookmark`);
  assert.deepEqual(actual.technology,saved.technology,'Opening a controls diagram changed the independent train-control/propulsion choice');
  assert.equal(actual.electrification,'overhead-ac');
  assert.equal(url.searchParams.get('ciLinks'),'building:absent,platform:monitor,security:absent,tunnel:supervisory,vertical:monitor','Custom links must be serialized deterministically');
  for(const key of ['instance','trace','study','workspace','inspect','instances','exposure','presentation'])assert.equal(url.searchParams.has(key),false,`${key}: stale physical-inspection query escaped into interface link`);
  const expected=evaluateControlInterface(controlInterface),reopened=evaluateControlInterface(actual.controlInterface);
  for(const key of ['mode','canRequest','commandState','remoteQuality'])assert.equal(reopened[key],expected[key],`${d.id}: reopened ${key} changed meaning`);
  assert.equal(reopened.active.text,expected.active.text,'A final trace conclusion changed on reopening');
  interfaceRoutes++;
}

const requestCases=[
  {domain:'building',scenario:'link-loss',links:'building:absent',mode:'absent',command:'No common-display command interface',conclusion:/Monitoring capability does not grant/},
  {domain:'tunnel',scenario:'link-loss',links:'tunnel:supervisory',mode:'supervisory',command:'Delivery unavailable',conclusion:/delivery and present field state are unconfirmed/},
  {domain:'tunnel',scenario:'local-mode',links:'tunnel:supervisory',mode:'supervisory',command:'Rejected in selected local mode',conclusion:/Rejected remote request/},
  {domain:'building',scenario:'feedback-missing',links:'building:supervisory',mode:'supervisory',command:'Outcome unconfirmed',conclusion:/Accepted does not mean completed/},
  {domain:'fire',scenario:'normal',links:'fire:supervisory',mode:'monitor',command:'No common-display command interface',conclusion:/Monitoring capability does not grant/},
  {domain:'signalling',scenario:'normal',links:'signalling:supervisory',mode:'monitor',command:'No common-display command interface',conclusion:/Monitoring capability does not grant/},
];
for(const c of requestCases){
  const url=new URL('https://example.test/railway-anatomy/');url.hash=`interfaces/${c.domain}/integrated`;url.searchParams.set('ciLinks',c.links);url.searchParams.set('ciScenario',c.scenario);url.searchParams.set('ciTrace','request');url.searchParams.set('ciStep','4');
  const parsed=harness.parse(url.href),m=evaluateControlInterface(parsed.controlInterface);
  assert.equal(m.mode,c.mode);assert.equal(m.commandState,c.command);assert.match(m.active.text,c.conclusion);
}

const malformedInterface=harness.parse('https://example.test/railway-anatomy/?ciLinks=building%3Aabsent%2Cfire%3Asupervisory%2Cunknown%3Amonitor%2Cnetwork%3Aadministrate&ciScenario=operate&ciTrace=execute&ciStep=999#interfaces/missing/missing');
assert.deepEqual(malformedInterface.controlInterface,{domain:'traction',architecture:'summaries',connections:{building:'absent'},scenario:'normal',trace:'indication',step:4},'External links may not invent domains, outputs or conditions');
const minimalInterface=harness.roundTrip({...base,page:'interfaces',controlInterface:normalizeControlState({domain:'building',architecture:'separate'})});
for(const key of ['ciLinks','ciScenario','ciTrace','ciStep'])assert.equal(new URL(minimalInterface.url).searchParams.has(key),false,`Default ${key} should not survive from a previous custom URL`);
const leftInterface=harness.roundTrip({...base,controlInterface:normalizeControlState({domain:'tunnel',scenario:'link-loss'})});
for(const key of ['ciLinks','ciScenario','ciTrace','ciStep'])assert.equal(new URL(leftInterface.url).searchParams.has(key),false,`Leaving Interfaces retained irrelevant ${key}`);
for(const [component,variant,domain]of [['bas-controller','building','building'],['power-scada','power','traction'],['tvcs-controller','power','tunnel']]){
  const redirected=harness.parse(`https://example.test/railway-anatomy/#explore/station/station-networks/${component}/${variant}`);
  assert.equal(redirected.page,'interfaces');assert.equal(redirected.controlInterface.domain,domain,'Legacy shared view must resolve the selected functional owner');
}
const savedInterface={...base,page:'interfaces',controlInterface:normalizeControlState({domain:'tunnel',architecture:'integrated',scenario:'local-mode',trace:'request',step:2,connections:customConnections})};
const remembered=routeState(savedInterface);savedInterface.controlInterface.connections.tunnel='absent';
assert.equal(remembered.controlInterface.connections.tunnel,'supervisory','A saved history entry aliases later edited interface connections');
const interfaceHistoryUrl='https://example.test/railway-anatomy/?ciScenario=local-mode&ciTrace=request&ciStep=2&ciLinks=tunnel%3Asupervisory#interfaces/tunnel/integrated';
const restoredInterface=harness.restore(interfaceHistoryUrl,remembered,{...base,page:'interfaces',controlInterface:normalizeControlState({domain:'building',architecture:'separate'})});
assert.deepEqual(restoredInterface.controlInterface,remembered.controlInterface,'Back restored the title but lost the saved interface conditions');

const invalid=harness.parse('https://example.test/railway-anatomy/?propulsion=invalid&control=invalid&mode=invalid#explore/invalid/invalid/invalid');
assert.equal(invalid.view,'railway');assert.equal(invalid.component,'network-overview');
assert.deepEqual(invalid.technology,{propulsion:'lim',control:'loop'});
const previous={...base,page:'reference',domain:'control',view:'etcs',component:'etcs-level-2',variant:'level-2',technology:{propulsion:'rotary',control:'etcs2'},cutaway:true,exploded:.35,explodeScope:'selected',labels:false,labelMode:'off'};
const later={...base,view:'lim',component:'lim-primary'};
const restored=harness.restore('https://example.test/railway-anatomy/?propulsion=rotary&control=etcs2#reference',previous,later);
for(const key of ['page','domain','view','component','variant','cutaway','exploded','explodeScope','labels','labelMode'])assert.equal(restored[key],previous[key],`Back to the field guide lost its explorer ${key}`);
assert.deepEqual(restored.technology,previous.technology,'Back to the field guide let a later component overwrite its technology');
for(const explodeScope of ['all','selected'])for(const labelMode of ['nearby','selected','off']){
  const saved={...base,domain:'station',view:'ventilation-unit',component:'tunnel-fan',variant:'fan',
    cutaway:false,exploded:.6,explodeScope,labels:labelMode!=='off',labelMode};
  const historyRestored=harness.restore('https://example.test/railway-anatomy/?propulsion=lim&control=loop#explore/station/ventilation-unit/tunnel-fan/fan',saved,later);
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

// Real discovery regressions: the first finder indexed nonexistent interface
// fields and returned no result for "BMS". Verify actual terms and destinations,
// including that process discovery does not resurrect a legacy 3D workflow.
const navigationIndex=buildNavigationIndex({views:VIEWS,concepts:CONCEPTS,tours:TOURS,processes:PROCESS_VIEWS,domains:DOMAINS});
const finderCases=[[' BMS ','interface','building'],['TVCS','interface','tunnel'],['pump level','interface','drainage'],['ATP','interface','signalling'],['duty handover','process','duty-handover']];
for(const [query,kind,id]of finderCases)assert(searchNavigation(navigationIndex,query).some(item=>item.kind===kind&&item.id===id),`Finder cannot reach ${kind}/${id} using ${query}`);
assert.equal(searchNavigation(navigationIndex,' BMS ')[0].id,'building','An exact acronym should find the correct owner, not a similarly labelled system');
assert.equal(searchNavigation(navigationIndex,'duty handover')[0].kind,'process','The decision/evidence destination should precede a physical proxy');
assert.deepEqual(searchNavigation(navigationIndex,'BMS nonexistentzz'),[],'Multiword queries must not silently ignore the missing term');
assert.deepEqual(searchNavigation(navigationIndex,'  '),[]);
assert(!navigationIndex.some(item=>item.kind==='view'&&PROCESS_REDIRECTS[item.id]),'Finder exposes a legacy process-only 3D destination');
for(const item of navigationIndex){
  const known=item.kind==='view'?Boolean(VIEWS[item.id]):item.kind==='component'?CONCEPTS.some(c=>c.id===item.id):item.kind==='process'?Boolean(PROCESS_VIEWS[item.id]):item.kind==='interface'?CONTROL_DOMAINS.some(d=>d.id===item.id):item.kind==='tour'?Boolean(TOURS[Number(item.id)]):false;
  assert(known,`Finder points to a missing destination: ${item.kind}/${item.id}`);
}
console.log(`PASS production route round trips: ${routes} view/variant/mode routes, 40 independent vehicle configurations, 8 electrical/propulsion bookmarks, ${processRoutes} process-step routes across ${Object.keys(PROCESS_VIEWS).length} processes, legacy process/electrification redirects, connection-mode bookmarks, ETCS radio bookmarks, 6 history/context presentation combinations, malformed-route fallback, parent trails and process-menu resize events`);
console.log('PASS anatomy bookmark contracts: physical instance, path, workspace, study, all instances and three staged exposures preserve independent train-control selection; invalid inputs are bounded');
console.log(`PASS interface bookmark contracts: ${interfaceRoutes} custom domain/architecture/condition/trace round trips, ${requestCases.length} independent authority/degraded conclusions, malformed-link rejection, default/exit cleanup, legacy-owner redirects and immutable history restoration`);
console.log(`PASS global finder: ${finderCases.length} functional acronym/task queries, complete destination integrity and exclusion of legacy process-only views`);

