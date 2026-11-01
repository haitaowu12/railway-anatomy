import {SOURCES} from './catalog.js';
import {CONTROL_DOMAINS,CONTROL_ARCHITECTURES,CONTROL_SCENARIOS,CONTROL_PROJECT_EXAMPLES,CONTROL_INTERFACE_SOURCES,normalizeControlState,connectionModesFor,connectionFor,evaluateControlInterface} from './control-interfaces-data.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sourceMap=new Map([...SOURCES,...CONTROL_INTERFACE_SOURCES].map(s=>[s.id,s]));
const modeLabel={absent:'Not connected',monitor:'Monitoring only',supervisory:'Selected requests + monitoring'};
const sourceLinks=ids=>`<span class="ci-source-links">${[...new Set(ids)].map(id=>{const s=sourceMap.get(id);return s?`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" title="${esc(s.title)}">${esc(s.publisher)} · ${esc(id)}</a>`:`<span>${esc(id)}</span>`;}).join('')}</span>`;
function textLines(value,width=32){const lines=[''];for(const word of String(value).split(' ')){const last=lines.length-1;if((lines[last]+' '+word).trim().length>width)lines.push(word);else lines[last]=(lines[last]+' '+word).trim();}return lines;}

/** A functional dependency diagram, not equipment geometry or a wiring plan. */
export function controlInterfaceDiagram(model){
  const {domain:d,mode,state,active}=model;
  const lost=state.scenario==='link-loss',request=state.trace==='request',activeId=active.actor;
  const nodes=[
    {id:'field',x:24,y:48,w:260,h:132,title:'Physical equipment',text:d.field,kind:'Physical state / energy'},
    {id:'local',x:334,y:48,w:260,h:132,title:'Local function',text:d.local,kind:'Control + acquisition'},
    {id:'transport',x:334,y:250,w:260,h:116,title:'Communications transport',text:lost?'Selected link unavailable':'Configured field / supervisory path',kind:'Carries defined messages'},
    {id:'native',x:644,y:250,w:260,h:132,title:'Native supervision',text:d.supervisor,kind:'Assigned operator / maintainer'},
    {id:'common',x:644,y:48,w:260,h:132,title:'Common station view',text:modeLabel[mode],kind:mode==='absent'?'No integration included':'Selected contract only'},
  ];
  const nodeMarkup=nodes.map(n=>`<g class="ci-node ${n.id===activeId?'is-active':''} ${n.id==='common'&&mode==='absent'?'is-absent':''}" data-ci-actor="${n.id}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="8"/><text class="ci-node-heading" x="${n.x+16}" y="${n.y+28}">${esc(n.title)}</text>${textLines(n.text,32).slice(0,3).map((l,i)=>`<text x="${n.x+16}" y="${n.y+52+i*17}">${esc(l)}</text>`).join('')}<text class="ci-node-kind" x="${n.x+16}" y="${n.y+n.h-13}">${esc(n.kind)}</text></g>`).join('');
  const line=(path,label,x,y,kind='monitor',show=true)=>show?`<g class="ci-edge ci-edge-${kind} ${lost&&kind==='network'?'is-lost':''}"><path d="${path}" marker-end="url(#ci-arrow-${kind==='command'?'command':'monitor'})"/><text x="${x}" y="${y}" text-anchor="middle">${esc(label)}</text></g>`:'';
  const edges=[
    line('M 284 95 H 334','Observe',309,82),
    line('M 334 148 H 284','Local output',309,198,'command'),
    line('M 419 180 V 250','Data',395,217,'network'),
    line('M 510 250 V 180','Requests',550,217,'command',!!(d.nativeRequest||d.request)),
    line('M 594 290 H 644','Data',619,278,'network'),
    line('M 644 343 H 594','Request',619,367,'command',!!(d.nativeRequest||d.request)),
    line('M 726 250 V 180',mode==='absent'?'No link':'Selected points',687,217,'monitor',mode!=='absent'),
    line('M 830 180 V 250','Allowed request',861,217,'command',mode==='supervisory'),
  ].join('');
  const noLink=mode==='absent'?'<path class="ci-no-link" d="M 755 204 l 14 14 m 0 -14 l -14 14"/><text class="ci-no-link-label" x="779" y="216">No common link</text>':'';
  return `<div class="ci-diagram-scroll"><svg class="ci-diagram" viewBox="0 0 928 450" role="img" aria-labelledby="ci-diagram-title ci-diagram-desc"><title id="ci-diagram-title">${esc(d.label)}: responsibilities and information paths</title><desc id="ci-diagram-desc">Physical equipment connects to its local control and acquisition function. A separate transport path connects native supervision. Common station integration is ${esc(modeLabel[mode].toLowerCase())}. ${esc(model.active.text)}</desc><defs><marker id="ci-arrow-monitor" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z"/></marker><marker id="ci-arrow-command" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${edges}${nodeMarkup}${noLink}<text class="ci-diagram-footnote" x="24" y="414">Logical interfaces · functional boxes may be distributed or combined in real equipment</text><text class="ci-diagram-footnote" x="24" y="434">Solid cyan: indications / data · dashed amber: permitted requests or local outputs</text></svg></div>`;
}

export function controlInterfacesMarkup(input={}){
  const m=evaluateControlInterface(input),{state:s,domain:d,mode}=m;
  return `<div class="control-interfaces" data-ci-root>
    <header class="ci-intro"><p class="eyebrow">System responsibilities & interfaces</p><h2>Who controls what?</h2><p>Compare local control, supervisory requests and information sharing. These teaching patterns show possible allocations; each railway defines its own.</p></header>
    <div class="ci-function-picker"><label for="ci-domain">Choose a function<select id="ci-domain" data-ci-field="domain" aria-label="Choose a function">${CONTROL_DOMAINS.map(t=>`<option value="${t.id}" ${t.id===d.id?'selected':''}>${esc(t.label)} · ${esc(t.short)}</option>`).join('')}</select></label><details class="ci-domain-browse"><summary>Browse all ${CONTROL_DOMAINS.length} functions</summary><nav class="ci-domain-nav" aria-label="Control-system responsibilities">${CONTROL_DOMAINS.map(t=>`<button type="button" data-ci-domain="${t.id}" aria-pressed="${t.id===d.id}"><strong>${esc(t.label)}</strong><span>${esc(t.short)}</span></button>`).join('')}</nav></details></div>
    <div class="ci-section-head"><div><h3>${esc(d.label)}</h3><p>${esc(d.role)}</p></div><button type="button" class="ci-inspect" data-ci-inspect="${esc(d.component)}">Read component details</button></div>
    <div class="ci-controls">
      <label for="ci-architecture">Teaching architecture<select id="ci-architecture" data-ci-field="architecture" aria-label="Teaching architecture">${CONTROL_ARCHITECTURES.map(a=>`<option value="${a.id}" ${a.id===s.architecture?'selected':''}>${esc(a.label)}</option>`).join('')}</select></label>
      <label for="ci-connection">This function → common station view<select id="ci-connection" data-ci-field="connection" aria-label="This function → common station view">${connectionModesFor(d.id).map(v=>`<option value="${v}" ${mode===v?'selected':''}>${esc(modeLabel[v])}</option>`).join('')}</select></label>
      <label for="ci-scenario">Compare an information condition<select id="ci-scenario" data-ci-field="scenario" aria-label="Compare an information condition">${CONTROL_SCENARIOS.map(v=>`<option value="${v.id}" ${s.scenario===v.id?'selected':''}>${esc(v.label)}</option>`).join('')}</select></label>
    </div>
    <div class="ci-pattern-note"><details class="ci-pattern-explanation"><summary>About this pattern${Object.keys(s.connections).length?' · customized':''}</summary><p>${esc(m.architecture.description)} ${Object.keys(s.connections).length?'Individual connections have been customized.':''}</p></details><button type="button" data-ci-action="reset-pattern">Reset this pattern</button></div>
    <div class="ci-diagram-card">${controlInterfaceDiagram(m)}<div class="ci-status-row"><p><span>Native supervision</span><strong>${esc(m.remoteQuality)}</strong></p><p><span>Common-display command</span><strong>${esc(m.commandState)}</strong></p></div></div>
    <p class="ci-boundary"><strong>Responsibility boundary</strong> ${esc(d.boundary)}</p>
    <section class="ci-trace" aria-labelledby="ci-trace-title"><header><div><p class="eyebrow">Follow one information chain</p><h3 id="ci-trace-title">${s.trace==='request'?'Request is not completion':'Observation is not the whole system'}</h3></div><div class="ci-trace-toggle" aria-label="Information trace"><button type="button" data-ci-trace="indication" aria-pressed="${s.trace==='indication'}">Indication</button><button type="button" data-ci-trace="request" aria-pressed="${s.trace==='request'}">Request & feedback</button></div></header>
      <ol class="ci-trace-steps">${m.steps.map((step,i)=>`<li><button type="button" data-ci-step="${i}" ${s.step===i?'aria-current="step"':''}><span>${i+1}</span>${esc(step.label)}</button></li>`).join('')}</ol>
      <div class="ci-trace-current" aria-live="polite" aria-atomic="true"><strong>${s.step+1}. ${esc(m.active.label)}</strong><p>${esc(m.active.text)}</p></div>
      <div class="ci-trace-controls"><button type="button" data-ci-action="previous" ${s.step===0?'disabled':''}>Previous step</button><button type="button" data-ci-action="play" aria-pressed="false">Play trace</button><button type="button" data-ci-action="next" ${s.step===4?'disabled':''}>Next step</button><span>Illustrative sequence; no equipment is operated.</span></div>
    </section>
    <div class="ci-responsibilities"><section><h3>What is monitored?</h3><ul>${d.monitor.map(v=>`<li>${esc(v)}</li>`).join('')}</ul><p><strong>Example point:</strong> ${esc(d.examplePoint)} · ${esc(d.pointType)} · ${esc(d.unit)}.</p></section><section><h3>Where is control performed?</h3><p><strong>${esc(d.local)}</strong></p><p>${esc(d.localAction)}</p><p>${d.nativeRequest||d.request?`Native application function: ${esc((d.nativeRequest||d.request).toLowerCase())}.`:'The selected common integration exposes no control output; the native subsystem retains its designed functions.'}</p></section><section><h3>What does communication loss mean?</h3><p>${esc(d.loss)}</p><p>A stale value retains its last observation time. It must not silently become a new normal indication.</p></section></div>
    <details class="ci-contract"><summary>Read the interface contract and point definition</summary><dl><dt>Origin and owner</dt><dd>${esc(d.local)}</dd><dt>Native recipient</dt><dd>${esc(d.supervisor)}</dd><dt>Optional common recipient</dt><dd>${esc(modeLabel[mode])}${mode==='absent'?' — no points or requests exchanged.':' — only named points; not every internal value.'}</dd><dt>Information direction</dt><dd>Physical/source condition → acquisition → native supervision → selected common presentation, if included.</dd><dt>Request direction</dt><dd>${mode==='supervisory'?`Authorized common request → native/function interface → local decision. ${esc(d.request)}.`:'No request from the common view in this configuration.'}</dd><dt>Point meaning</dt><dd>${esc(d.examplePoint)}; ${esc(d.pointType)}; ${esc(d.unit)}. Specify the asset, location and source instead of relying on a screen label alone.</dd><dt>Quality and time</dt><dd>Distinguish current, invalid, unavailable and last-known values. State source/receipt time and clock basis; the teaching example assigns no update period.</dd><dt>Completion evidence</dt><dd>${esc(d.feedback)}</dd><dt>Transport</dt><dd>Direct I/O, subsystem links and shared or separate networks are different spans. No address plan, protocol, network separation or redundant route is inferred.</dd><dt>Authority and failure response</dt><dd>Define permitted users, modes, local/remote priority, acknowledgement, rejection, timeout and loss-of-interface behaviour for the actual system.</dd></dl></details>
    <section class="ci-cross-system"><h3>Other interfaces to consider</h3><p>These are possible functional relationships. An omitted optional integration can be valid; a required safety or operational duty still needs an engineered implementation.</p>${m.interfaces.length?m.interfaces.map(e=>`<details><summary>${esc(e.label)} <span>${esc(e.kind)}</span></summary><p>${esc(e.example)}</p><p><strong>If this interface is absent:</strong> ${esc(e.absent)}</p><button type="button" data-ci-domain="${e.from===d.id?e.to:e.from}">Explore the other function</button>${sourceLinks(e.sources)}</details>`).join(''):'<p>Compare the electrical, communications and operating dependencies for the actual allocation.</p>'}</section>
    <details class="ci-allocation"><summary>Compare all ${CONTROL_DOMAINS.length} function allocations in this pattern</summary><div class="ci-table-scroll"><table><caption>Common station integration is separate from native/local control</caption><thead><tr><th scope="col">Function</th><th scope="col">Native responsibility</th><th scope="col">Common station interface</th></tr></thead><tbody>${CONTROL_DOMAINS.map(t=>`<tr><th scope="row"><button type="button" data-ci-domain="${t.id}">${esc(t.label)}</button></th><td>${esc(t.supervisor)}</td><td>${esc(modeLabel[connectionFor(s,t.id)])}</td></tr>`).join('')}</tbody></table></div></details>
    <details class="ci-examples"><summary>Why there is no single universal railway architecture</summary><div class="ci-example-grid">${CONTROL_PROJECT_EXAMPLES.map(e=>`<article><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p>${sourceLinks(e.sources)}</article>`).join('')}</div></details>
    <footer class="ci-references"><h3>Evidence for this function</h3>${sourceLinks(d.sources)}<p>The functional patterns, point examples and trace states are original teaching material. The linked sources establish distinctions and project variation; no diagram claims to reproduce an installed railway.</p></footer>
  </div>`;
}

/** Keeps event ownership local. Call destroy when leaving the view. */
export function createControlInterfaceExplorer(host,{initialState={},onInspect=()=>{},onStateChange=()=>{}}={}){
  let state=normalizeControlState(initialState),timer=null,playing=false,destroyed=false;
  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function pause(){if(timer!==null)clearTimeout(timer);timer=null;playing=false;}
  function render(focusKey){
    if(destroyed)return;
    const scrollTop=host.scrollTop;
    const openDetails=[...host.querySelectorAll('details[open]')].map(el=>el.className||el.querySelector('summary')?.textContent);
    host.innerHTML=controlInterfacesMarkup(state);
    for(const el of host.querySelectorAll('details'))if(openDetails.includes(el.className||el.querySelector('summary')?.textContent))el.open=true;
    host.scrollTop=scrollTop;
    const play=host.querySelector('[data-ci-action="play"]');
    if(play){play.textContent=playing?'Pause trace':'Play trace';play.setAttribute('aria-pressed',String(playing));if(reduced){play.disabled=true;play.title='Use the numbered steps when reduced motion is preferred.';}}
    if(focusKey){const match=host.querySelector(focusKey);match?.focus({preventScroll:true});}
  }
  function commit(next,focusKey){state=normalizeControlState({...state,...next});render(focusKey);onStateChange({...state,connections:{...state.connections}});}
  function tick(){if(!playing||destroyed)return;if(state.step===4){pause();render('[data-ci-action="play"]');return;}commit({step:state.step+1});timer=setTimeout(tick,1900);}
  function click(event){
    const target=event.target?.closest?.('button');if(!target||!host.contains(target))return;
    if(target.dataset.ciInspect){pause();onInspect(target.dataset.ciInspect);return;}
    if(target.dataset.ciDomain){pause();const id=target.dataset.ciDomain;const browse=host.querySelector('.ci-domain-browse');if(browse)browse.open=false;commit({domain:id,step:0},'#ci-domain');host.scrollIntoView({block:'start',behavior:'instant'});return;}
    if(target.dataset.ciTrace){pause();commit({trace:target.dataset.ciTrace,step:0},`[data-ci-trace="${target.dataset.ciTrace}"]`);return;}
    if(target.dataset.ciStep!==undefined){pause();commit({step:Number(target.dataset.ciStep)},`[data-ci-step="${target.dataset.ciStep}"]`);return;}
    const action=target.dataset.ciAction;
    if(action==='play'){if(playing)pause();else if(!reduced){playing=true;if(state.step===4)state={...state,step:0};timer=setTimeout(tick,1900);}render('[data-ci-action="play"]');return;}
    if(action==='previous'||action==='next'){pause();commit({step:state.step+(action==='next'?1:-1)},`[data-ci-action="${action}"]`);return;}
    if(action==='reset-pattern'){pause();commit({connections:{},step:0},'[data-ci-action="reset-pattern"]');}
  }
  function change(event){
    const target=event.target,key=target?.dataset?.ciField;if(!key)return;pause();
    if(key==='domain')commit({domain:target.value,step:0},'#ci-domain');
    else if(key==='connection')commit({connections:{...state.connections,[state.domain]:target.value},step:0},'#ci-connection');
    else if(key==='architecture')commit({architecture:target.value,connections:{},step:0},'#ci-architecture');
    else if(key==='scenario')commit({scenario:target.value,step:0},'#ci-scenario');
  }
  host.addEventListener('click',click);host.addEventListener('change',change);render();
  return {getState:()=>({...state,connections:{...state.connections}}),setState(next){pause();commit(next);},destroy(){pause();destroyed=true;host.removeEventListener('click',click);host.removeEventListener('change',change);}};
}
