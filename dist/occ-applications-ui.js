import {SOURCES} from './catalog.js';
import {OCC_APPLICATIONS,OCC_DEVICE_POINTS,OCC_INTEGRATIONS,occIntegrationsFor,OCC_CONDITIONS,normalizeOccState,evaluateOccPoint} from './occ-applications-data.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sources=new Map(SOURCES.map(s=>[s.id,s]));
const points=new Map(OCC_DEVICE_POINTS.map(p=>[p.id,p]));
const references=ids=>[...new Set(ids)].map(id=>{const s=sources.get(id);return s?`<article><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.publisher)}<span>${esc(s.title)}</span></a><p>${esc(s.description)}</p><p class="occ-source-scope">${esc(s.scope)}</p></article>`:'';}).join('');

export function occApplicationsMarkup(input={}){
  const m=evaluateOccPoint(input),s=m.state,p=m.point,a=m.application;
  const node=(id,kicker,title,body)=>`<article class="occ-path-node ${m.active.actor===id?'is-active':''}" data-occ-node="${id}"><span class="occ-node-kicker">${esc(kicker)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`;
  const integrations=occIntegrationsFor(a.id);
  const available=integrations.filter(x=>p.request&&p.sharedRequest!==false||x.id!=='control');
  return `<div class="occ-applications" data-occ-root>
    <header class="occ-app-heading"><div><p class="eyebrow">Control centre / applications & connected devices</p><h1>From railway equipment to the OCC</h1><p>Choose an application, inspect a named point, then follow its information or permitted request. These functional views complement the physical room and equipment.</p></div><nav aria-label="Control-centre study"><button type="button" data-occ-nav="room">Room & equipment</button><button type="button" data-occ-nav="processes">People & processes</button></nav></header>
    <div class="occ-app-layout"><aside class="occ-app-list"><h2>Applications at the OCC</h2><p>One workstation may access several applications. One application may span several hosts.</p><nav aria-label="Choose an OCC application">${OCC_APPLICATIONS.map(x=>`<button type="button" data-occ-app="${x.id}" aria-pressed="${x.id===a.id}"><strong>${esc(x.label)}</strong><span>${esc(x.short)}</span></button>`).join('')}</nav><div class="occ-definition"><h3>SCADA is broader than power</h3><p>Power, facilities and communications SCADA are possible application scopes. Products may combine them; functions and permissions still need definition.</p></div></aside>
    <div class="occ-app-main"><section class="occ-selected-app"><p class="eyebrow">${esc(a.short)}</p><h2>${esc(a.label)}</h2><p>${esc(a.description)}</p><div class="occ-app-actions"><button type="button" data-occ-nav="interfaces">Compare control responsibilities</button><button type="button" data-occ-nav="hardware">Inspect physical equipment</button></div></section>
      <section class="occ-point-workbench" aria-labelledby="occ-point-heading"><div class="occ-point-heading"><div><span class="eyebrow">Illustrative asset / ${esc(p.site)}</span><h2 id="occ-point-heading">${esc(p.asset)}</h2></div><label for="occ-point">Choose a device point<select id="occ-point" data-occ-field="point" aria-label="Choose a device point">${a.points.map(id=>`<option value="${id}" ${id===p.id?'selected':''}>${esc(points.get(id).label)}</option>`).join('')}</select></label></div>
      <div class="occ-point-controls"><label for="occ-integration">${a.id==='telecom'?'Telecom SCADA interface':'Additional common-HMI integration'}<select id="occ-integration" data-occ-field="integration" aria-label="${a.id==='telecom'?'Telecom SCADA interface':'Additional common-HMI integration'}">${available.map(x=>`<option value="${x.id}" ${s.integration===x.id?'selected':''}>${esc(x.label)}</option>`).join('')}</select></label>${p.supportsNms?`<label for="occ-acquisition">Acquire diagnostics through<select id="occ-acquisition" data-occ-field="acquisition" aria-label="Acquire diagnostics through"><option value="direct" ${s.acquisition==='direct'?'selected':''}>Device / subsystem interface</option><option value="nms" ${s.acquisition==='nms'?'selected':''}>Native equipment manager / NMS</option></select></label>`:`<p class="occ-fixed-interface"><span>Acquisition interface</span>${esc(p.acquisition)}</p>`}<label for="occ-condition">Compare a condition<select id="occ-condition" data-occ-field="condition" aria-label="Compare a condition">${OCC_CONDITIONS.map(x=>`<option value="${x.id}" ${s.condition===x.id?'selected':''}>${esc(x.label)}</option>`).join('')}</select></label></div>
      <div class="occ-point-status" aria-live="polite"><div><span>Displayed point</span><strong>${esc(m.displayValue)}</strong></div><div><span>Information quality</span><strong>${esc(a.id==='telecom'&&!m.shared?'No telecom SCADA point':m.quality)}</strong></div><div><span>Request capability</span><strong>${esc(m.requestStatus)}</strong></div></div>
      <div class="occ-path ${a.id==='telecom'&&!m.shared?'occ-no-integration':''}" aria-label="Selected point interfaces">
        ${node('field',p.site,p.asset,p.source)}
        <div class="occ-path-arrow" aria-hidden="true">→</div>
        ${node('acquisition','Acquisition / native system',m.acquisition,s.acquisition==='nms'?`Selected management data is forwarded from ${p.native}; the native manager can retain more detail.`:`The selected point comes through this equipment or subsystem interface. Native service: ${p.native}.`)}
        <div class="occ-transport ${s.condition==='link-loss'?'is-lost':''} ${m.active.actor==='transport'?'is-active':''}" data-occ-node="transport"><span class="occ-node-kicker">Communications transport</span><strong>${s.condition==='link-loss'?'× Selected data path unavailable':'Defined data and request paths'}</strong><p>Transport carries exchanges; the receiving applications decide what they mean and whether a request is permitted.</p></div>
        ${node('supervision',a.id==='telecom'?'Telecom supervisory application':'OCC / operator application',m.supervisor,a.id==='telecom'?(m.shared?'The telecom SCADA application acquires the selected point and exposes only configured requests. Its operator presentation may share an HMI with other applications.':'No telecom SCADA connection is included. Native equipment/service diagnostics retain their own paths; their availability is not assumed.'):(m.shared?'The common HMI exchanges selected points and permitted requests with the native application.':'This view uses the native application; there is no additional common-HMI integration.'))}
        <div class="occ-path-arrow" aria-hidden="true">→</div>
        ${node('record','Presentation & retained evidence',a.id==='telecom'&&!m.shared?'No telecom SCADA record':'Point display, alarms & history',a.id==='telecom'&&!m.shared?'Native service records, if provided, belong to that service.':'Identity, value, quality and time stay together. Display and storage may share infrastructure; they are not necessarily separate racks.')}
      </div>
      <p class="occ-path-caption">Functional interfaces; box positions do not prescribe cabinet location, server count or a wiring layout. ${esc(integrations.find(x=>x.id===s.integration).description)}</p>
      <section class="occ-trace" aria-labelledby="occ-trace-heading"><div class="occ-trace-heading"><h3 id="occ-trace-heading">Follow ${s.trace==='request'?'the request and its evidence':'one observation'}</h3><div class="occ-trace-switch" aria-label="Trace type"><button type="button" data-occ-trace="indication" aria-pressed="${s.trace==='indication'}">Indication</button><button type="button" data-occ-trace="request" aria-pressed="${s.trace==='request'}">Request & feedback</button></div></div><ol class="occ-trace-steps">${m.steps.map((x,i)=>`<li><button type="button" data-occ-step="${i}" ${i===s.step?'aria-current="step"':''}><span>${i+1}</span>${esc(x.label)}</button></li>`).join('')}</ol><div class="occ-step-detail" aria-live="polite"><strong>${s.step+1}. ${esc(m.active.label)}</strong><p>${esc(m.active.text)}</p></div><div class="occ-trace-play"><button type="button" data-occ-action="previous" ${s.step===0?'disabled':''}>Previous</button><button type="button" data-occ-action="play" aria-pressed="false">Play trace</button><button type="button" data-occ-action="next" ${s.step===4?'disabled':''}>Next</button><span>Illustrative exchanges; no equipment is operated.</span></div></section>
      </section>
      <section class="occ-interface-meaning"><h2>Three exchanges to keep distinct</h2><table><thead><tr><th scope="col">Exchange</th><th scope="col">What it contains</th><th scope="col">Where responsibility sits</th></tr></thead><tbody><tr><th scope="row">Service payload</th><td>${esc(p.payload)}</td><td>${esc(p.native)}</td></tr><tr><th scope="row">Condition monitoring</th><td>${esc(p.label)}; ${esc(p.unit.toLowerCase())}; source quality and time.</td><td>${esc(p.source)} → ${esc(m.supervisor)}</td></tr><tr><th scope="row">Permitted request</th><td>${p.request?esc(p.request):'This point has no control output.'}</td><td>${esc(m.requestEnabled?'The configured interface and receiving equipment/function retain permission and completion checks.':'No request output from the selected common integration.')}</td></tr></tbody></table><p>${esc(a.boundary)}</p></section>
      <section class="occ-device-register"><h2>Points in this example</h2><p>These are example interface definitions, not a full installed point list.</p><div class="occ-register-table"><table><thead><tr><th scope="col">Asset / point</th><th scope="col">Observation source</th><th scope="col">Native application</th><th scope="col">Control example</th></tr></thead><tbody>${a.points.map(id=>{const q=points.get(id);return `<tr class="${id===p.id?'is-selected':''}"><th scope="row"><button type="button" data-occ-point="${id}">${esc(q.asset)}<span>${esc(q.label)}</span></button></th><td>${esc(q.source)}</td><td>${esc(q.native)}</td><td>${esc(q.request||'Indication only')}</td></tr>`;}).join('')}</tbody></table></div></section>
      <details class="occ-sources"><summary>Sources, examples and scope</summary><p>The diagram and named assets are original teaching material. Source examples establish that these allocations and interface types are possible; a project’s point list, command rights and deployment define its actual arrangement.</p><div>${references([...a.sources,...p.sources])}</div></details>
    </div></div></div>`;
}

export function createOccApplicationExplorer(host,{initialState={},onStateChange=()=>{},onNavigate=()=>{}}={}){
  let state=normalizeOccState(initialState),timer=null,playing=false,destroyed=false;
  const motionPreference=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reduced=Boolean(motionPreference?.matches);
  function pause(){if(timer!==null)clearTimeout(timer);timer=null;playing=false;}
  function render(focus){
    if(destroyed)return;
    const sourcesOpen=host.querySelector('.occ-sources')?.open;
    host.innerHTML=occApplicationsMarkup(state);
    if(sourcesOpen)host.querySelector('.occ-sources').open=true;
    const b=host.querySelector('[data-occ-action="play"]');
    b.textContent=playing?'Pause trace':'Play trace';b.setAttribute('aria-pressed',String(playing));
    if(reduced){b.disabled=true;b.title='Use the numbered steps with reduced motion.';}
    if(focus)host.querySelector(focus)?.focus({preventScroll:true});
  }
  function commit(next,focus,push=false){state=normalizeOccState({...state,...next});render(focus);onStateChange({...state},{push});}
  function tick(){if(!playing||destroyed)return;if(state.step===4){pause();render('[data-occ-action="play"]');return;}commit({step:state.step+1});timer=setTimeout(tick,1700);}
  function click(event){
    const b=event.target?.closest?.('button');if(!b||!host.contains(b))return;
    event.stopPropagation();
    if(b.dataset.occNav){pause();onNavigate(b.dataset.occNav,evaluateOccPoint(state));return;}
    if(b.dataset.occApp){pause();commit({app:b.dataset.occApp,point:null,step:0},`[data-occ-app="${b.dataset.occApp}"]`,true);return;}
    if(b.dataset.occPoint){pause();commit({point:b.dataset.occPoint,step:0},'#occ-point',true);return;}
    if(b.dataset.occTrace){pause();commit({trace:b.dataset.occTrace,step:0},`[data-occ-trace="${b.dataset.occTrace}"]`);return;}
    if(b.dataset.occStep!==undefined){pause();commit({step:Number(b.dataset.occStep)},`[data-occ-step="${b.dataset.occStep}"]`);return;}
    const action=b.dataset.occAction;
    if(action==='previous'||action==='next'){pause();commit({step:state.step+(action==='next'?1:-1)},`[data-occ-action="${action}"]`);}
    if(action==='play'){if(playing)pause();else if(!reduced){playing=true;if(state.step===4)commit({step:0});timer=setTimeout(tick,1700);}render('[data-occ-action="play"]');}
  }
  function change(event){const key=event.target?.dataset?.occField;if(!key)return;event.stopPropagation();pause();commit({[key]:event.target.value,step:0},`[data-occ-field="${key}"]`,key==='point');}
  function motionChanged(event){reduced=event.matches;if(reduced)pause();render();}
  motionPreference?.addEventListener?.('change',motionChanged);
  function visibility(){if(globalThis.document?.hidden){pause();render();}}
  host.addEventListener('click',click);host.addEventListener('change',change);globalThis.document?.addEventListener('visibilitychange',visibility);render();
  return{getState:()=>({...state}),destroy(){pause();destroyed=true;host.removeEventListener('click',click);host.removeEventListener('change',change);globalThis.document?.removeEventListener('visibilitychange',visibility);motionPreference?.removeEventListener?.('change',motionChanged);}};
}
