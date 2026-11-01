import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {VIEWS,defaultVariant,cutawayFor} from '../dist/model.js';
import {CONCEPTS} from '../dist/catalog.js';
import {TOURS} from '../dist/tours.js';
import {PROCESS_VIEWS} from '../dist/process-data.js';
import {PROCESS_REDIRECTS,processFor,processStepFor,renderProcessPage} from '../dist/process-ui.js';
import {representationFor} from '../dist/representation-guidance.js';
import {systemDiagram} from '../dist/system-diagrams.js';
import {electricalStudy} from '../dist/electrical-explainers.js';
import {getInterfaceContext,normalizeControlState} from '../dist/control-interfaces-data.js';
import {normalizeTechnology,technologyForView,technologyForComponent} from '../dist/technology.js';
import {normalizeElectrification} from '../dist/electrification.js';
import {canAnimate,animationFor} from '../dist/comparisons.js';
import {platformAnimationFor} from '../dist/station-platform-data.js';

// Exercise the actual render dispatch and lesson markup. The narrow DOM and
// interface mount stand-ins measure routing/lifecycle; browser QA owns layout,
// focus visibility and the interface explorer's own interaction/rendering.
const source=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
function between(start,end){const a=source.indexOf(start),b=source.indexOf(end,a+start.length);assert(a>=0&&b>a,`Production marker changed: ${start}`);return source.slice(a,b);}
const dependencies={VIEWS,defaultVariant,cutawayFor,CONCEPTS,TOURS,PROCESS_VIEWS,PROCESS_REDIRECTS,processFor,processStepFor,renderProcessPage,representationFor,systemDiagram,electricalStudy,getInterfaceContext,normalizeControlState,normalizeTechnology,technologyForView,technologyForComponent,normalizeElectrification,canAnimate,animationFor,platformAnimationFor};
const harness=new Function(...Object.keys(dependencies),`
  let state={page:'explore',view:'vehicle',domain:'vehicle',component:'carbody',variant:'default',technology:{propulsion:'lim',control:'radio'},sink:'train'},returnContext=null,interfaceExplorer=null,historyMode='replace',loadingViewer=false;
  let mounts=0,destroys=0,feedback=null;const writes=[],viewerCalls=[];
  const viewer={setPlaying(value){viewerCalls.push(['setPlaying',value]);},resize(){throw new Error('A nonphysical tour resized the 3D renderer');}};
  const parts=new Map(CONCEPTS.map(c=>[c.id,c])),lessonAnswers={},quizSelections={},lessonAttempts={};
  const nodes=new Map(),node=selector=>{if(!nodes.has(selector))nodes.set(selector,{hidden:false,innerHTML:'',textContent:'',replaceChildren(){this.innerHTML='';},insertAdjacentHTML(where,value){this.innerHTML=where==='afterbegin'?value+this.innerHTML:this.innerHTML+value;}});return nodes.get(selector);};
  const $=selector=>node(selector),$$=selector=>selector==='#lesson-detail,#process-lesson,#interface-lesson'?['#lesson-detail','#process-lesson','#interface-lesson'].map(node):[];
  const document={activeElement:null};const safe=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  function sourceChips(){return '';}
  function writeHash(){writes.push(structuredClone(state));}
  function renderNavigation(){node('#explorer-page').hidden=isInterfacePage()||isProcessPage();node('#interfaces-page').hidden=!isInterfacePage();node('#processes-page').hidden=!isProcessPage();}
  function showFeedback(correct){feedback=correct;}
  function syncPlatform(){}
  function showInterfaceConcept(){}
  function routeLabel(){return 'previous context';}
  function focusVisible(){}
  function startViewer(){throw new Error('A nonphysical tour tried to mount the 3D renderer');}
  function syncViewer(){throw new Error('A nonphysical tour tried to synchronize a 3D proxy');}
  function createControlInterfaceExplorer(host,options){
    mounts++;let current=normalizeControlState(options.initialState),destroyed=false;
    return {getState(){return structuredClone(current);},change(value){if(destroyed)throw new Error('Destroyed explorer changed state');current=normalizeControlState(value);options.onStateChange(structuredClone(current));},destroy(){if(destroyed)throw new Error('Explorer destroyed twice');destroyed=true;destroys++;}};
  }
  ${between('const isProcessPage=','const preferredPresentation=')}
  ${between('const preferredPresentation=','function syncPlatform(')}
  ${between('function isInterfaceTour()','function routeLabel(')}
  ${between('function tourNavigationMarkup(','function renderNavigation(')}
  ${between('function renderLesson(){','function showFeedback(')}
  ${between('function render(changedView=','function setPage(')}
  ${between('function applyLesson(','function updateSensor()')}
  return {
    enter(id,priorStep='verify'){state.lesson=TOURS.findIndex(t=>t.id===id);state.processId='configuration-change';state.processStep=priorStep;applyLesson(false);render(true);return this.snapshot();},
    changeInterface(value){interfaceExplorer.change(value);return this.snapshot();},
    complete(id,choice){lessonAnswers[id]=true;quizSelections[id]=choice;renderLesson();return this.snapshot();},
    snapshot(){return {state:structuredClone(state),mounts,destroys,feedback,writes:structuredClone(writes),viewerCalls:structuredClone(viewerCalls),html:Object.fromEntries([...nodes].map(([key,value])=>[key,value.innerHTML]))};},
  };
`)(...Object.values(dependencies));

let current=harness.enter('supervisory-boundaries');
assert.equal(current.state.page,'learn');assert.equal(current.state.controlInterface.domain,'building');
assert.equal(current.mounts,1);assert.equal(current.destroys,0);
assert.match(current.html['#interface-lesson'],/id="check-answer"/);
assert.match(current.html['#interface-lesson'],/id="previous-lesson"/);
assert.match(current.html['#interface-lesson'],/id="next-lesson"/);
assert.match(current.html['#interface-lesson'],/Explore the interfaces/);
assert.doesNotMatch(current.html['#interface-lesson'],/Try it in the model/);
assert.equal(current.html['#lesson-detail'],'','A hidden earlier lesson retained a competing quiz');
current=harness.changeInterface({domain:'tunnel',architecture:'integrated',scenario:'feedback-missing',trace:'request',step:4});
assert.equal(current.state.page,'learn','Changing interface conditions abandoned the tour');
assert.equal(current.state.controlInterface.scenario,'feedback-missing');
assert.equal(current.writes.at(-1).controlInterface.domain,'tunnel');
current=harness.complete('supervisory-boundaries',0);
assert.equal(current.feedback,true);assert.match(current.html['#interface-lesson'],/value="0" checked/);

current=harness.enter('depot-energy');
assert.equal(current.mounts,1);assert.equal(current.destroys,1,'Leaving the interface tour did not tear down its explorer');
assert.equal(current.state.processId,'work-protection');assert.equal(current.state.processStep,'movement');
assert.match(current.html['#process-lesson'],/id="check-answer"/);
assert.match(current.html['#process-lesson'],/Explore the process/);
assert.equal(current.html['#interface-lesson'],'','A hidden interface quiz competed with the process quiz');
assert.match(current.html['#processes-page'],/Examine the movement-protection interface/);
assert.doesNotMatch(current.html['#process-lesson'],/Trainway sensing|Platform edge/);
current=harness.enter('infrastructure-follow-up');
assert.equal(current.state.processStep,'review');assert.equal(current.state.processId,'infrastructure-maintenance');
assert.match(current.html['#process-lesson'],/Review evidence and continuing actions/);
assert.doesNotMatch(current.html['#process-lesson'],/bearing marker|Work complete with Check recorded/);
current=harness.enter('supervisory-boundaries');
assert.equal(current.mounts,2);assert.equal(current.destroys,1);
assert.equal(current.html['#process-lesson'],'');
assert.match(current.html['#interface-lesson'],/value="0" checked/,'Returning to the tour lost its saved self-check');
assert(current.viewerCalls.every(([name,value])=>name==='setPlaying'&&value===false),'A functional surface started physical animation');
console.log('PASS learning surfaces: production interface-tour mount/teardown, retained lesson and interface state, single active self-check, progress restoration, intended process steps and nonphysical rendering dispatch');
