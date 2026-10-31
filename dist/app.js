import {DEFAULT_TECHNOLOGY,PROPULSION_CHOICES,CONTROL_CHOICES,normalizeTechnology,technologyFromUrl,technologyForView,technologyForComponent,controlRoute,technologyScope,technologyNote,technologyFlow} from './technology.js';
import {SOURCES,CONCEPTS,ARCHITECTURES} from './catalog.js';
import {TOURS} from './tours.js';
import {DOMAINS,VIEWS,RELATED,MODES,EXPERIMENTS,targetFor,domainFor,viewFor,applyExperiment,describeFlow,wheelEstimate,variantFor,variantsFor,defaultVariant,cutawayFor,PART_CONTEXTS} from './model.js';

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parts=new Map(CONCEPTS.map(c=>[c.id,c]));
const sources=new Map(SOURCES.map(s=>[s.id,s]));
let savedTechnology={};try{savedTechnology=JSON.parse(localStorage.getItem('railway-anatomy-technology-v1')||'{}');}catch{}
let state={technology:technologyFromUrl(location.search,savedTechnology),page:'explore',domain:'station',view:'station',component:'station-pa',mode:'coasting',scenario:'nominal',variant:'all',sink:'train',cutaway:true,exploded:0,playing:false,labels:true,lesson:0};
let viewer=null, rendererStatus='', loadingViewer=false, labelFrame=0,lastLabelTime=0;
let lessonAnswers={}, lessonAttempts={}, quizSelections={};
const progressKey='railway-anatomy-learning-v1';
try{const saved=JSON.parse(localStorage.getItem(progressKey)||'{}');for(const t of TOURS){if(saved.completed?.[t.id]===true)lessonAnswers[t.id]=true;if(Number.isInteger(saved.choices?.[t.id])&&saved.choices[t.id]>=0&&saved.choices[t.id]<t.choices.length)quizSelections[t.id]=saved.choices[t.id];if(Number.isFinite(saved.attempts?.[t.id]))lessonAttempts[t.id]=Math.max(0,saved.attempts[t.id]);}}catch{}
function saveProgress(){try{localStorage.setItem(progressKey,JSON.stringify({completed:lessonAnswers,choices:quizSelections,attempts:lessonAttempts}));}catch{}}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const labelElements=new Map();
const shortLabels={utility:'AC supply','ac-switchgear':'AC switchgear',transformer:'Transformer',rectifier:'Rectifier','dc-switchgear':'DC distribution',breaker:'DC breaker','wayside-resistor':'Braking resistor',grounding:'Bonding / return','facility-transformer':'Facility supply',disconnect:'Isolation boundary','positive-rail':'+ DC conductor','negative-rail':'Return conductor','running-rail':'Running rails','reaction-rail':'Reaction rail',collector:'Collector',carbody:'Carbody',bogie:'Bogie','traction-inverter':'Traction inverter','lim-primary':'LIM primary',apu:'Auxiliary converter','vehicle-battery':'Auxiliary battery',hvac:'HVAC',brakes:'Friction brakes',compressor:'Air supply',doors:'Doors','control-battery':'Control battery','substation-control':'Station control',atp:'ATP protection',ato:'ATO driving',ats:'ATS supervision','train-control':'Control computer',tcms:'TCMS','train-radio':'Control radio','radio-antenna':'Antenna','wayside-radio':'Wayside radio','zone-controller':'Zone controller',balise:'Position reference',tachometer:'Wheel-speed sensor',accelerometer:'Inertial sensor','door-control':'Door controller','passenger-info':'Passenger display','pa-intercom':'PA / intercom',cctv:'CCTV','train-network':'Onboard network'};

function sourceChips(ids){return `<div class="source-chips">${[...new Set(ids)].filter(id=>sources.has(id)).map(id=>`<button data-source="${id}" title="${safe(sources.get(id).title)}">${safe(sources.get(id).publisher)} ↗</button>`).join('')}</div>`;}
function announce(text){$('#announce').textContent=text;}
function writeHash(){
  const value=state.page==='reference'?'reference':state.page==='learn'?`learn/${TOURS[state.lesson].id}`:`explore/${state.domain}/${state.view}/${state.component}${state.variant!=='default'?'/'+state.variant:''}`;
  const url=new URL(location.href);url.searchParams.set('propulsion',state.technology.propulsion);url.searchParams.set('control',state.technology.control);url.hash=value;history.replaceState(null,'',url.pathname+url.search+url.hash);
  try{localStorage.setItem('railway-anatomy-technology-v1',JSON.stringify(state.technology));}catch{}
}
function readHash(){
  const [page,a,b,c,v]=location.hash.slice(1).split('/');
  if(page==='reference'){state.page='reference';}
  else if(page==='learn'){
    state.page='learn';const index=TOURS.findIndex(t=>t.id===a);state.lesson=Math.max(0,index); applyLesson(false);
  }else if(page==='explore'){
    state.page='explore';
    const domain=DOMAINS.find(d=>d.id===a);if(domain){state.domain=a;state.view=domain.view;state.component=domain.component;}
    if(VIEWS[b])state.view=b;
    if(parts.has(c)){state.component=c;state.domain=domainFor(c).id;}
    if(parts.has(c)&&!variantsFor(c,state.view).length)state.view=viewFor(c);
    const visibleVariants=variantsFor(state.component,state.view);
    state.variant=visibleVariants.includes(v)?v:variantFor(state.component,state.view);
    if(!VIEWS[state.view].variants?.some(x=>x.id===state.variant))state.variant=defaultVariant(state.view);
    state.cutaway=cutawayFor(state.view);
    state.mode=['power','vehicle'].includes(state.domain)?'motoring':'coasting';
  }
  state.technology=technologyForView(technologyForComponent(state.technology,state.component),state.view,state.variant);
}
function activeDomain(){return DOMAINS.find(d=>d.id===state.domain);}
function syncViewer(changedView=false){
  if(!viewer)return;
  viewer.setTechnology(state.technology);
  if(changedView)viewer.setView(state.view);
  viewer.setVariant(state.variant);viewer.setMode(state.mode);viewer.setScenario(state.scenario);viewer.setReceptivity(state.sink);
  viewer.setExploded(state.exploded);viewer.setCutaway(state.cutaway);viewer.setSignals(['track','control','communications','station','operations','depot'].includes(state.domain));
  viewer.setSelected(targetFor(state.component));
  state.playing=viewer.setPlaying(state.playing);syncControls();
}
function syncControls(){
  $('#cutaway').checked=state.cutaway;$('#explode').value=state.exploded;$('#labels').checked=state.labels;
  $('#play').textContent=state.playing?'Ⅱ Pause':'▶ Animate';$('#play').setAttribute('aria-pressed',String(state.playing));
  $('#play').disabled=reducedMotion.matches;
  $('#play').title=reducedMotion.matches?'Reduced motion is enabled. Use the phase slider to inspect each state.':'Animate the model';
  $('#render-badge').textContent=rendererStatus==='svg'?'3D · COMPATIBILITY VIEW':'SCHEMATIC 3D';
}
function renderNavigation(){
  $$('.main-nav [data-page]').forEach(b=>{if(b.dataset.page===state.page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  $('#explorer-page').hidden=state.page==='reference';$('#reference-page').hidden=state.page!=='reference';
  $('#intro-copy').textContent=state.page==='learn'?'Choose a short tour, inspect the mechanism, then check your understanding.':state.page==='reference'?'A searchable guide to the components and their public references.':'From rail clips to control centres. Explore the mechanisms and the systems around them.';
  $('#domains').innerHTML=DOMAINS.map(d=>`<button data-domain="${d.id}" class="${d.id===state.domain?'active':''}" aria-pressed="${d.id===state.domain}"><span>${d.number}</span><div><strong>${d.label}</strong><small>${d.description}</small></div></button>`).join('');
  const viewIds=[...new Set([...activeDomain().views,state.view])];
  $('#view-nav').innerHTML=viewIds.map(id=>`<button data-view="${id}" class="${id===state.view?'active':''}" aria-pressed="${id===state.view}">${VIEWS[id].label}</button>`).join('');
  $('#scene-index').textContent=`${activeDomain().number} / ${activeDomain().label.toUpperCase()} · ${VIEWS[state.view].level||'SYSTEM / ASSEMBLY'}`;
  $('#scene-title').textContent=state.view==='guideway'&&state.technology.propulsion==='rotary'?'Power, data and wheel guidance':VIEWS[state.view].title;
  $('#propulsion-choice').value=state.technology.propulsion;$('#control-choice').value=state.technology.control;$('#technology-scope').textContent=technologyScope(state.technology,state.view);
  $('#model-key').textContent=technologyNote(state,VIEWS[state.view].note)+(state.exploded>=.5?' Message paths are hidden while parts are separated.':'');
  $('#tour-bar').hidden=state.page!=='learn';
  $('#tour-bar').innerHTML=`<label for="tour-select">CHOOSE A TOUR</label><select id="tour-select">${TOURS.map((t,i)=>`<option value="${i}" ${state.lesson===i?'selected':''}>${lessonAnswers[t.id]?'✓ ':''}${safe(t.label)}</option>`).join('')}</select><span>${Object.keys(lessonAnswers).length} of ${TOURS.length} checked</span>`;
}
function renderDetail(){
  const c=parts.get(state.component);
  const related=(RELATED[c.id]||activeDomain().parts.filter(id=>id!==c.id).slice(0,3)).filter(id=>parts.has(id));
  const contexts=(PART_CONTEXTS[c.id]||[]).filter(id=>VIEWS[id]&&id!==state.view);
  const anchor=targetFor(c.id)!==c.id?`<p class="practice-note">Model anchor: ${safe(parts.get(targetFor(c.id))?.label||targetFor(c.id))}. This concept is shown in its equipment context.</p>`:'';
  $('#component-detail').innerHTML=`<p class="part-kicker">${safe(domainFor(c.id).label)} / Component</p><h2 class="part-title">${safe(c.label)}</h2><p class="part-summary">${safe(c.summary)}</p>${anchor}<h3 class="detail-heading">How it works</h3>${c.details.map(p=>`<p class="part-detail">${safe(p)}</p>`).join('')}${c.caveat?`<p class="part-note">${safe(c.caveat)}</p>`:''}<h3 class="detail-heading">Connect it to</h3><div class="related">${related.map(id=>`<button data-component="${id}">${safe(shortLabels[id]||parts.get(id).label)}</button>`).join('')}</div>${contexts.length?`<h3 class="detail-heading">Inspect at another scale</h3><div class="related">${contexts.map(id=>`<button data-inspect-view="${id}">${safe(VIEWS[id].label)} ↗</button>`).join('')}</div>`:''}${sourceChips(c.sources)}${c.sources.length?'':'<p class="practice-note">A declared teaching-model choice; no equipment specification is implied.</p>'}<div class="inspector-links"><button data-focus="${targetFor(c.id)}">Focus in 3D ↗</button><button data-reference="${c.id}">Open in field guide →</button></div>`;
  $('#component-detail').hidden=state.page==='learn';$('#lesson-detail').hidden=state.page!=='learn';
  $('#component-eyebrow').textContent=`${activeDomain().label.toUpperCase()} / ${activeDomain().parts.length} CONCEPTS`;
  $('#component-heading').textContent=`Explore ${activeDomain().short.toLowerCase()}.`;
  $('#component-grid').innerHTML=activeDomain().parts.map((id,i)=>{const p=parts.get(id);return `<button data-component="${id}" class="${id===c.id?'active':''}" aria-pressed="${id===c.id}"><span class="component-number">${String(i+1).padStart(2,'0')}</span><strong>${safe(p.label)}</strong><small>${safe(p.summary)}</small></button>`;}).join('');
}
function renderScenario(){
  const flow=technologyFlow(state,describeFlow(state)),variants=VIEWS[state.view].variants,electrical=!variants&&(['power','vehicle'].includes(state.domain)&&state.view!=='services'||state.view==='guideway');
  $('#scenario-heading').textContent=variants?'Explore this arrangement':electrical?'Follow the energy':state.domain==='control'?'Trace the decisions':state.domain==='communications'?'Follow the messages':'Explore the supporting systems';
  $('#scenario-buttons').innerHTML=variants?variants.map(x=>`<button data-variant="${x.id}" class="${x.id===state.variant?'active':''}" aria-pressed="${x.id===state.variant}">${x.label}</button>`).join(''):(electrical?MODES:EXPERIMENTS[state.view==='services'?'services':state.domain]||MODES).filter(x=>x.id!=='radio-loss'||['loop','radio','etcs2'].includes(state.technology.control)).map(x=>`<button data-experiment="${x.id}" class="${x.id===(electrical?state.mode:state.scenario)?'active':''}" aria-pressed="${x.id===(electrical?state.mode:state.scenario)}">${x.id==='radio-loss'&&state.technology.control==='loop'?'Hold loop update':x.label}</button>`).join('');
  $('#receptivity').hidden=!(electrical&&state.mode==='regeneration');
  $$('[data-sink]').forEach(b=>{b.classList.toggle('active',b.dataset.sink===state.sink);b.setAttribute('aria-pressed',String(b.dataset.sink===state.sink));});
  $('#flow-path').innerHTML=flow.nodes.map((n,i)=>`${i?`<span class="flow-arrow" aria-hidden="true">${flow.parallel?'·':'→'}</span>`:''}<span class="flow-node ${flow.kind||''}">${safe(n)}</span>`).join('');
  $('#scenario-title').textContent=flow.title;$('#scenario-description').textContent=flow.description;$('#scenario-sources').innerHTML=sourceChips(flow.sources);
  $('#sensor-lab').hidden=!(state.domain==='control'&&(state.scenario==='wheel-slip'||['tachometer','accelerometer','balise'].includes(state.component)));
}
function renderLesson(){
  if(state.page!=='learn')return;
  const t=TOURS[state.lesson];
  $('#lesson-detail').innerHTML=`<div class="lesson-body"><button class="back-guide" data-explore-component="${state.component}">← Explore freely</button><p class="part-kicker">Guided tour ${state.lesson+1} / ${TOURS.length}</p><h3>${safe(t.title)}</h3><p>${safe(t.explanation)}</p>${state.component!==t.component?`<div class="selected-in-tour"><strong>${safe(parts.get(state.component).label)}</strong><p>${safe(parts.get(state.component).summary)}</p><button data-explore-component="${state.component}">Open component explanation →</button></div>`:''}<div class="try-action"><strong>Try it in the model</strong>${safe(t.actionText)}<button id="lesson-action">${safe(t.actionLabel)} ↗</button></div><div class="question"><h4 id="quiz-title">${safe(t.question)}</h4><fieldset aria-labelledby="quiz-title">${t.choices.map((v,i)=>`<label class="answer-choice"><input type="radio" name="quiz-answer" value="${i}" ${quizSelections[t.id]===i?'checked':''}><span>${safe(v)}</span></label>`).join('')}</fieldset><button class="check-answer" id="check-answer">Check understanding</button><div id="quiz-feedback" role="status" tabindex="-1" hidden></div><p class="practice-note">Optional self-check. Retry or move on at any time. Progress stays on this device.</p></div>${sourceChips([...new Set(t.sourceConcepts.flatMap(id=>parts.get(id).sources))])}<div class="lesson-nav"><button id="previous-lesson" ${state.lesson===0?'disabled':''}>← Previous</button><button id="next-lesson">${state.lesson===TOURS.length-1?'Finish & explore':'Next tour →'}</button></div></div>`;
  if(quizSelections[t.id]!==undefined)showFeedback(quizSelections[t.id]===t.answer);
}
function showFeedback(correct,choice=quizSelections[TOURS[state.lesson].id]){
  const t=TOURS[state.lesson],out=$('#quiz-feedback');if(!out)return;
  out.hidden=false;out.className=`feedback ${correct?'':'incorrect'}`;
  out.textContent=choice===undefined?'Select an answer to check it.':`${t.feedback[choice]}${correct?(lessonAttempts[t.id]>1?' Completed with a retry.':' Understanding checked.'):' Try another choice or revisit the model.'}`;
}
function renderReference(){
  const q=$('#reference-search').value.trim().toLowerCase(),filter=$('#reference-domain').value;
  const match=c=>(filter==='all'||domainFor(c.id).id===filter)&&[c.label,c.summary,...c.details,...c.sources.map(id=>sources.get(id).title)].join(' ').toLowerCase().includes(q);
  const found=CONCEPTS.filter(match);$('#reference-count').textContent=`${found.length} concepts`;
  $('#reference-results').innerHTML=DOMAINS.filter(d=>filter==='all'||d.id===filter).map(d=>{
    const items=found.filter(c=>d.parts.includes(c.id));if(!items.length)return '';
    return `<section class="reference-group"><h3>${d.label}</h3>${items.map(c=>`<details class="reference-card" id="reference-${c.id}"><summary>${safe(c.label)}</summary><div><p><strong>${safe(c.summary)}</strong></p>${c.details.map(p=>`<p>${safe(p)}</p>`).join('')}${c.caveat?`<p class="part-note">${safe(c.caveat)}</p>`:''}${sourceChips(c.sources)}<button class="open-in-model" data-explore-component="${c.id}">Open this component in 3D ↗</button></div></details>`).join('')}</section>`;
  }).join('')||'<p>No components match. Try a shorter term or another system.</p>';
}
function render(changedView=false){
  const focused=document.activeElement;
  const focusKey=focused?.matches('#domains button,#view-nav button,#scenario-buttons button')?['domain','view','variant','experiment','sink'].find(key=>focused.dataset[key]):null;
  const focusValue=focusKey?focused.dataset[focusKey]:null;
  syncViewer(changedView);chooseVisibleRepresentative();renderNavigation();renderDetail();renderScenario();renderLesson();if(state.page==='reference')renderReference();syncControls();rebuildLabels();writeHash();
  if(focusKey)document.querySelector(`[data-${focusKey}="${focusValue}"]`)?.focus({preventScroll:true});
  const nav=$('#view-nav'),active=nav.querySelector('.active');
  if(active&&nav.scrollWidth>nav.clientWidth){const left=active.offsetLeft-nav.offsetLeft;if(left<nav.scrollLeft||left+active.offsetWidth>nav.scrollLeft+nav.clientWidth)nav.scrollLeft=Math.max(0,left-(nav.clientWidth-active.offsetWidth)/2);}
}
function setPage(page){
  state.page=page;
  if(page==='learn')applyLesson(true);
  else {render();if(page!=='reference')requestAnimationFrame(()=>viewer?.resize());}
}
function setDomain(id){
  const d=DOMAINS.find(d=>d.id===id);if(!d)return;
  state={...state,page:'explore',domain:id,view:d.view,component:d.component,scenario:'nominal',mode:['power','vehicle'].includes(id)?'motoring':'coasting',cutaway:cutawayFor(d.view),variant:defaultVariant(d.view),exploded:0};
  if(id==='control')Object.assign(state,controlRoute(state.technology.control));
  state.technology=technologyForView(state.technology,state.view,state.variant);render(true);announce(d.label);
}
function setView(id){
  if(!VIEWS[id])return;
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
function selectComponent(id,{explore=state.page!=='learn',focus=false}={}){
  if(!parts.has(id))return;
  const oldView=state.view,oldDomain=state.domain;
  state.technology=technologyForComponent(state.technology,id);viewer?.setTechnology(state.technology);
  const wasVisible=viewer?.getVisibleComponentIds().includes(targetFor(id));
  if(explore)state.page='explore';state.component=id;state.domain=domainFor(id).id;
  if(!viewer?.getComponentIds(state.view).includes(targetFor(id)))state.view=viewFor(id);
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
  state={...state,page:'learn',domain:t.domain,view:a.view||t.view,component:a.component||t.component,mode:a.mode||'motoring',scenario:a.scenario||'nominal',cutaway:a.cutaway??cutawayFor(t.view),variant:a.variant||defaultVariant(a.view||t.view),exploded:typeof a.exploded==='number'?a.exploded:a.exploded ? 0.35 : 0};
  state.technology=technologyForView(technologyForComponent(normalizeTechnology(a.technology||{},state.technology),state.component),state.view,state.variant);
  if(state.scenario==='radio-loss'&&!['loop','radio'].includes(state.technology.control))state.technology={...state.technology,control:'radio'};
  if(state.scenario==='regen-limited')state.sink='resistor';
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
  $('#dialog-body').innerHTML=(sourceId?'':`<p><strong>Railway Anatomy connects the components of an urban railway.</strong> Explore freely, compare selected architectures, follow the guided tours, or search the field guide.</p><p><button id="reset-progress" class="open-in-model">Reset guided-tour progress on this device</button></p><h3>The examples we chose</h3><p>The vehicle example can use LIM propulsion with a passive reaction rail, or rotary motors driving axles, with the same selected DC supply. Track sections compare support and fastening arrangements. Control views distinguish radio CBTC, loop-based SelTrac examples, Hitachi’s published SelTrac G9 description, conventional signalling and ETCS examples. Station models connect passenger devices, platform protection, plant, fire and life safety, ventilation and supervision. Control-centre and depot views add operations, stabling, maintenance and washing.</p><p>Propulsion and train-control technology are independent choices. The selected combinations are educational examples, not assertions that every combination is commissioned. The DC supply example remains unchanged when an ETCS study is opened. Geometry, equipment positions, proportions and behaviour cues are schematic. No fleet ratings, installation drawings, radio configurations, operating procedures or quantitative performance predictions are supplied. Logical function boxes do not prescribe physical computer count.</p><h3>Sources and further reading</h3><p>The explanations use the public references below. Supplier pages illustrate available approaches; the atlas does not imply that their products share one architecture. All 3D geometry is generated in code. No tracking or external content is loaded when using the atlas; reading links open the publisher’s site.</p><p><a href="./reading.html">Open the complete reading directory →</a></p>`)+records.map(s=>`<section class="source-record ${sourceId?'highlight':''}"><span class="source-id">${safe(s.publisher)}</span><h3>${safe(s.title)}</h3><p>${safe(s.description)}</p><p><small>${safe(s.scope)}</small></p><a href="${safe(s.url)}" target="_blank" rel="noopener">Read the public source ↗</a></section>`).join('');
  $('#about-dialog').showModal();$('#dialog-body').scrollTop=0;
}

// Label nodes remain stable between frames so keyboard focus survives camera motion.
function rebuildLabels(){
  if(!viewer)return;
  const layer=$('#model-labels'),ids=viewer.getComponentIds(state.view);
  for(const [id,nodes] of labelElements){if(!ids.includes(id)){nodes.button.remove();nodes.line.remove();labelElements.delete(id);}}
  let svg=layer.querySelector('svg');if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('model-leaders');svg.setAttribute('aria-hidden','true');layer.prepend(svg);}
  for(const id of ids){if(!parts.has(id)||labelElements.has(id))continue;
    const button=document.createElement('button');button.className='model-label';button.dataset.component=id;button.textContent=shortLabels[id]||parts.get(id).label;button.setAttribute('aria-label',`Inspect ${parts.get(id).label}`);layer.append(button);
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');svg.append(line);labelElements.set(id,{button,line});
  }
  updateLabels();
}
function updateLabels(){
  if(!viewer||state.page==='reference')return;
  const width=$('#viewer').clientWidth,height=$('#viewer').clientHeight,limit=width<450?5:width<700?7:10;
  for(const {button,line} of labelElements.values()){button.hidden=true;line.style.display='none';}
  if(!state.labels)return;
  const selected=targetFor(state.component),preferred=new Set(activeDomain().parts.map(targetFor));
  const pts=viewer.getComponentScreenPositions().filter(p=>labelElements.has(p.id)).sort((a,b)=>(a.id===selected?-1000:preferred.has(a.id)?-100:0)-(b.id===selected?-1000:preferred.has(b.id)?-100:0));
  const occupied=[];let count=0;
  for(const p of pts){if(count>=limit)break;
    const nodes=labelElements.get(p.id),bw=Math.min(width-30,Math.max(65,nodes.button.textContent.length*5.5+18)),bh=25,x0=p.x*width,y0=p.y*height;
    let placed=null;
    for(const [dx,dy] of [[0,-24],[0,35],[-65,-20],[65,-20],[-80,35],[80,35],[0,-58],[0,70],[-100,-58],[100,-58]]){
      const x=Math.min(width-bw/2-10,Math.max(bw/2+10,x0+dx)),y=Math.min(height-56,Math.max(105,y0+dy));
      const rect={left:x-bw/2-5,right:x+bw/2+5,top:y-bh-5,bottom:y+5};
      if(occupied.every(r=>rect.right<r.left||rect.left>r.right||rect.bottom<r.top||rect.top>r.bottom)){placed={x,y,rect};break;}
    }
    if(!placed)continue;
    occupied.push(placed.rect);nodes.button.hidden=false;nodes.button.style.left=`${placed.x}px`;nodes.button.style.top=`${placed.y}px`;nodes.button.classList.toggle('selected',p.id===selected);
    nodes.button.setAttribute('aria-pressed',String(p.id===selected));
    nodes.line.style.display='';nodes.line.setAttribute('x1',String(x0));nodes.line.setAttribute('y1',String(y0));nodes.line.setAttribute('x2',String(placed.x));nodes.line.setAttribute('y2',String(placed.y-10));count++;
  }
}
function labelLoop(time){labelFrame=requestAnimationFrame(labelLoop);if(!document.hidden&&time-lastLabelTime>150){updateLabels();lastLabelTime=time;}}
async function startViewer(){
  if(loadingViewer||viewer)return;loadingViewer=true;$('#model-error').hidden=true;
  try{
    const {createViewer}=await import('./viewer.js');
    viewer=createViewer($('#viewer'),{onSelect:id=>selectComponent(id),onReady:info=>{rendererStatus=info.renderer;$('#loading')?.remove();},onError:()=>{$('#model-error').hidden=false;}});
    syncViewer(true);chooseVisibleRepresentative();render();rebuildLabels();syncControls();if(!labelFrame)labelFrame=requestAnimationFrame(labelLoop);
  }catch(error){$('#loading')?.remove();$('#model-error').hidden=false;console.error('The 3D renderer could not start.',error);}
  finally{loadingViewer=false;}
}

document.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.page)setPage(b.dataset.page);
  else if(b.dataset.domain)setDomain(b.dataset.domain);
  else if(b.dataset.view)setView(b.dataset.view);
  else if(b.dataset.inspectView){const selected=state.component;setView(b.dataset.inspectView);if(viewer?.getComponentIds(state.view).includes(targetFor(selected)))selectComponent(selected,{explore:state.page!=='learn'});}
  else if(b.dataset.variant){state.variant=b.dataset.variant;state.technology=technologyForView(state.technology,state.view,state.variant);state.scenario='nominal';viewer?.setTechnology(state.technology);viewer?.setVariant(state.variant);chooseVisibleRepresentative();render();}
  else if(b.dataset.component)selectComponent(b.dataset.component);
  else if(b.dataset.source)openSources(b.dataset.source);
  else if(b.dataset.camera)viewer?.setCameraPreset(b.dataset.camera);
  else if(b.dataset.focus)viewer?.focusComponent(b.dataset.focus);
  else if(b.dataset.exploreComponent){selectComponent(b.dataset.exploreComponent,{focus:false});$('#workspace').scrollIntoView({block:'start'});}
  else if(b.dataset.reference){state.page='reference';$('#reference-search').value='';$('#reference-domain').value='all';render();const entry=$(`#reference-${b.dataset.reference}`);entry.open=true;entry.scrollIntoView({block:'center'});}
  else if(b.dataset.lesson!==undefined){state.lesson=Number(b.dataset.lesson);applyLesson();}
  else if(b.dataset.experiment){state=applyExperiment(state,b.dataset.experiment);renderScenario();syncViewer();announce(technologyFlow(state,describeFlow(state)).title);}
  else if(b.dataset.sink){state.sink=b.dataset.sink;state.scenario=b.dataset.sink==='resistor'?'regen-limited':'nominal';renderScenario();syncViewer();}
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
  else if(b.id==='reset-scene'){state.exploded=0;state.cutaway=cutawayFor(state.view);viewer?.resetCamera();syncViewer();}
  else if(b.id==='about-button')openSources();
  else if(b.id==='close-dialog')$('#about-dialog').close();
  else if(b.id==='reset-progress'){lessonAnswers={};lessonAttempts={};quizSelections={};saveProgress();$('#about-dialog').close();render();announce('Learning progress reset on this device.');}
  else if(b.id==='retry-model')startViewer();
});
function openTechnologyModel(kind){
  const route=kind==='control'?controlRoute(state.technology.control):{view:'bogie',variant:'default',component:state.technology.propulsion==='rotary'?'rotary-traction-motor':'lim-primary'};
  state={...state,...route,page:'explore',domain:domainFor(route.component).id,scenario:'nominal',mode:'coasting',exploded:0,cutaway:cutawayFor(route.view)};render(true);
}
function changeTechnology(kind,value){
  state.technology=normalizeTechnology({...state.technology,[kind]:value});
  if(kind==='control'&&['seltrac','cbtc-network','signalling','etcs'].includes(state.view)){openTechnologyModel('control');return;}
  state.scenario='nominal';viewer?.setTechnology(state.technology);
  const hidden=viewer&&!viewer.getVisibleComponentIds().includes(targetFor(state.component));
  if(hidden&&kind==='propulsion'&&state.view==='bogie')state.component=state.technology.propulsion==='rotary'?'rotary-traction-motor':'lim-primary';
  chooseVisibleRepresentative();render();announce('Example arrangement updated.');
}
$('#propulsion-choice').innerHTML=PROPULSION_CHOICES.map(x=>`<option value="${x.id}">${safe(x.label)}</option>`).join('');
$('#control-choice').innerHTML=CONTROL_CHOICES.map(x=>`<option value="${x.id}">${safe(x.label)}</option>`).join('');
$('#propulsion-choice').addEventListener('change',e=>changeTechnology('propulsion',e.target.value));
$('#control-choice').addEventListener('change',e=>changeTechnology('control',e.target.value));
$('#component-search').addEventListener('input',searchComponents);
$('#component-search').addEventListener('keydown',e=>{if(e.key==='Escape')$('#search-results').hidden=true;if(e.key==='ArrowDown'){$('#search-results button')?.focus();e.preventDefault();}if(e.key==='Enter'){$('#search-results button')?.click();}});
document.addEventListener('click',e=>{if(!e.target.closest('.inspector-search'))$('#search-results').hidden=true;});
$('#reference-search').addEventListener('input',renderReference);$('#reference-domain').addEventListener('change',renderReference);
$('#cutaway').addEventListener('change',e=>{state.cutaway=e.target.checked;syncViewer();});
$('#explode').addEventListener('input',e=>{state.exploded=Number(e.target.value);syncViewer();$('#model-key').textContent=technologyNote(state,VIEWS[state.view].note)+(state.exploded>=.5?' Message paths are hidden while parts are separated.':'');});
$('#labels').addEventListener('change',e=>{state.labels=e.target.checked;updateLabels();});
$('#phase').addEventListener('input',e=>{state.playing=false;viewer?.setPlaying(false);viewer?.setPhase(Number(e.target.value)*5);syncControls();});
$('#sensor-error').addEventListener('input',updateSensor);
document.addEventListener('visibilitychange',()=>{if(document.hidden){state.playing=false;syncControls();}});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){state.playing=false;viewer?.setPlaying(false);}syncControls();});
window.addEventListener('hashchange',()=>{readHash();render(true);});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(labelFrame);labelFrame=0;state.playing=false;viewer?.setPlaying(false);});
window.addEventListener('pageshow',event=>{if(event.persisted){syncControls();viewer?.resize();if(!labelFrame)labelFrame=requestAnimationFrame(labelLoop);}});
document.addEventListener('change',e=>{if(e.target.id==='tour-select'){state.lesson=Number(e.target.value);applyLesson();}});
$('.main-nav [data-page="learn"] span').textContent=TOURS.length;
$('#reference-domain').insertAdjacentHTML('beforeend',DOMAINS.map(d=>`<option value="${d.id}">${d.label}</option>`).join(''));
readHash();render();startViewer();
