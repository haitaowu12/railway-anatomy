const TAU = Math.PI * 2;
const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));
const clean = value => Math.abs(value) < .00001 ? 0 : value;
export const ELECTRICAL_SOURCES = [
  {id:'EM01',title:'Electromagnetic Field Theory — Chapter 6, ideal transformers',publisher:'MIT OpenCourseWare',url:'https://ocw.mit.edu/courses/res-6-002-electromagnetic-field-theory-a-problem-solving-approach-spring-2008/097c0d0ffd19513067e485f2b4d50ef7_MITRES_6_002S08_chapter6.pdf',description:'Pages 413–416 relate winding voltage to the rate of change of shared magnetic flux and to the turns ratio.',scope:'The animation uses an ideal one-phase principle, with illustrative normalized values and a 2:1 turns ratio. It does not model losses, saturation or a three-phase winding connection.'},
  {id:'EM02',title:'Three-Phase Diode Bridge Rectifier',publisher:'Plexim',url:'https://docs.plexim.com/plecs-demos/basic-topologies/three-phase-diode-bridge-rectifier/',description:'An original simulation example explaining a three-phase bridge, six output pulses and the effects of load and commutation.',scope:'The atlas draws its own ideal bridge with zero source inductance and continuous conduction. Filter, load dynamics and commutation overlap are outside the illustration.'},
];

export const ELECTRICAL_STUDIES = {
  'power-transformer': {title:'Changing flux links two winding circuits',sources:['EM01'],animation:{label:'One AC cycle through an ideal transformer',duration:14,steps:[
    {at:0,label:'Flux is changing',description:'The primary voltage is at its positive peak while flux passes through zero. Voltage depends on how quickly flux changes, not simply on its magnitude.'},
    {at:.25,label:'Flux reaches a peak',description:'Flux is momentarily at its positive peak and its rate of change is zero. Both winding voltages cross zero.'},
    {at:.5,label:'Polarity reverses',description:'Flux passes through zero in the opposite direction. The winding voltages reach their negative peaks; the two circuits remain electrically separate.'},
    {at:.75,label:'Opposite flux peak',description:'Flux reaches its negative peak. Its rate of change and the winding voltages are again momentarily zero.'},
    {at:1,label:'Cycle complete',description:'The waveforms repeat. The illustrated 2:1 turns ratio gives half the primary voltage at the secondary, using matching terminal-polarity conventions.'},
  ]}},
  'power-rectifier': {title:'Six diodes select the instantaneous phase pair',sources:['EM02'],animation:{label:'One three-phase cycle through a diode bridge',duration:18,steps:[
    {at:0,label:'A → C',description:'A is the highest phase and C is the lowest. The highlighted upper and lower diodes form a complete path through the DC load.'},
    {at:1/6,label:'B → C',description:'B takes over the positive bus as it becomes the highest phase. C remains the return phase.'},
    {at:2/6,label:'B → A',description:'A becomes the lowest phase, so the lower conducting diode changes. The output polarity stays the same.'},
    {at:3/6,label:'C → A',description:'C is now the highest phase. Compare the conducting pair with the three AC waveforms.'},
    {at:4/6,label:'C → B',description:'B becomes the return phase. The DC voltage is the difference between the highest and lowest instantaneous phase voltages.'},
    {at:5/6,label:'A → B',description:'A returns to the positive bus. This is the sixth conducting interval in one AC cycle.'},
    {at:1,label:'Six-pulse cycle',description:'The same phase pair is reached again. The output remains positive but has ripple: six pulses for one input cycle in this ideal bridge.'},
  ]}},
};
export const electricalStudy = view => ELECTRICAL_STUDIES[view] || null;
export function electricalState(view, fraction) {
  const p = clamp(fraction), angle = TAU * p;
  if (view === 'power-transformer') return {fraction:p,primary:clean(Math.cos(angle)),flux:clean(Math.sin(angle)),secondary:clean(.5*Math.cos(angle))};
  const values = ['A','B','C'].map((id,i)=>({id,value:Math.cos(angle+1e-8-i*TAU/3)}));
  const ranked=[...values].sort((a,b)=>b.value-a.value),high=ranked[0],low=ranked[2];
  return {fraction:p,values,high:high.id,low:low.id,dc:(high.value-low.value)/Math.sqrt(3)};
}
export function applyElectricalStudies(views) {
  for(const [id,study] of Object.entries(ELECTRICAL_STUDIES)){
    const view=views[id];view.motion=true;view.animation=study.animation;view.defaultPresentation='connections';
    for(const variant of view.variants||[]){variant.motion=true;variant.animation=study.animation;variant.sources=[...new Set([...variant.sources,...study.sources])];}
  }
}
export function applyElectricalCatalog(sources,concepts) {
  for(const source of ELECTRICAL_SOURCES)if(!sources.some(s=>s.id===source.id))sources.push(source);
  for(const id of ['transformer','transformer-core','transformer-primary-winding','transformer-secondary-winding']){
    const c=concepts.find(c=>c.id===id);if(c&&!c.sources.includes('EM01'))c.sources.push('EM01');
  }
  const rectifier=concepts.find(c=>c.id==='rectifier');rectifier.sources.push('EM02');
  rectifier.details.push('The electrical-principle view follows an ideal six-diode bridge for one three-phase cycle. The phase at the highest voltage feeds the positive bus; the lowest phase provides the return. The DC output has six ripple pulses per input cycle.');
}
function pathFor(fn,{x=130,y=84,w=670,h=32}={}){return Array.from({length:181},(_,i)=>`${i?'L':'M'}${(x+w*i/180).toFixed(2)},${(y-h*fn(i/180)).toFixed(2)}`).join(' ');}
const axes=(y)=>`<path class="wave-axis" d="M130 ${y} H800"/><text class="wave-zero" x="112" y="${y+4}">0</text>`;
const cursor=(height)=>`<g class="electrical-cursor"><path d="M130 20 V${height}"/><text x="137" y="17">0°</text></g>`;
function transformerMarkup(){
  const coils=(x,turns)=>Array.from({length:turns},(_,i)=>`<ellipse cx="${x}" cy="${85+i*15}" rx="32" ry="7"/>`).join('');
  return `<div class="electrical-principle"><div class="principle-circuit"><svg viewBox="0 0 510 270" role="img" aria-label="Two electrically separate windings link the same magnetic core"><path class="transformer-core" d="M145 60 H365 V220 H145 Z"/><path class="flux-path" d="M145 60 H365 V220 H145 Z"/><path class="flux-direction" d="M245 60 l-13 -8 v16 Z"/><g class="primary-coil">${coils(145,8)}</g><g class="secondary-coil">${coils(365,4)}</g><text x="48" y="38">Primary · N₁</text><text x="350" y="38">Secondary · N₂</text><text x="203" y="143">Shared flux</text><text x="206" y="165" class="flux-value">0.00</text></svg><p class="turns-ratio">Illustrative turns ratio N₁:N₂ = 2:1</p><div class="principle-parts"><button data-component="transformer-primary-winding">Primary winding</button><button data-component="transformer-core">Magnetic core</button><button data-component="transformer-secondary-winding">Secondary winding</button></div></div><div class="principle-waveforms"><svg viewBox="0 0 830 320" role="img" aria-label="Primary voltage, shared flux and secondary voltage over one AC cycle"><text x="10" y="72">Primary V</text>${axes(80)}<path class="wave-primary" d="${pathFor(p=>Math.cos(TAU*p),{y:80})}"/><text x="10" y="167">Flux Φ</text>${axes(175)}<path class="wave-flux" d="${pathFor(p=>Math.sin(TAU*p),{y:175})}"/><text x="10" y="262">Secondary</text>${axes(270)}<path class="wave-secondary" d="${pathFor(p=>.5*Math.cos(TAU*p),{y:270})}"/>${cursor(300)}<text class="wave-zero" x="130" y="318">0°</text><text class="wave-zero" x="453" y="318">180°</text><text class="wave-zero" x="776" y="318">360°</text></svg><p class="electrical-reading" id="electrical-reading"></p></div></div><p class="principle-note">One-phase principle, with normalized waveforms and matching voltage polarities. A steady-state idealization; the 3D assembly shows the physical parts.</p>`;
}
function rectifierMarkup(){
  const legs=['A','B','C'].map((id,i)=>{const x=130+i*135;return `<g class="bridge-phase" data-phase="${id}"><text x="${x-5}" y="144">${id}</text><circle cx="${x}" cy="125" r="6"/><g data-diode="${id}+"><path class="bridge-wire" d="M${x} 125 V43"/><path class="diode-symbol" d="M${x-12} 94 H${x+12} L${x} 70 Z M${x-14} 69 H${x+14}"/></g><g data-diode="${id}-"><path class="bridge-wire" d="M${x} 155 V230"/><path class="diode-symbol" d="M${x-12} 202 H${x+12} L${x} 178 Z M${x-14} 177 H${x+14}"/><path class="bridge-wire" d="M${x} 155 V125"/></g></g>`;}).join('');
  const phasePaths=['A','B','C'].map((id,i)=>`<path class="wave-phase phase-${id}" d="${pathFor(p=>Math.cos(TAU*p-i*TAU/3),{y:90,h:55})}"/>`).join('');
  return `<div class="electrical-principle"><div class="principle-circuit"><svg viewBox="0 0 590 275" role="img" aria-label="Three-phase bridge with three upper and three lower diodes and a DC load"><path class="bridge-bus" d="M105 43 H530 V100 M105 230 H530 V174"/>${legs}<rect class="bridge-load" x="516" y="100" width="28" height="74"/><text x="548" y="142">Load</text><text x="448" y="31">+ DC</text><text x="448" y="253">− DC</text><text x="87" y="262">AC phases</text></svg><div class="principle-parts"><button data-component="rectifier-diode-stack">Diode stacks</button><button data-component="rectifier-busbar">DC busbars</button><button data-component="rectifier-cooling">Cooling assembly</button></div></div><div class="principle-waveforms"><svg viewBox="0 0 830 320" role="img" aria-label="Three sinusoidal phase voltages and the positive six-pulse DC output"><text x="10" y="70">AC phases</text><text class="phase-A" x="10" y="95">A</text><text class="phase-B" x="35" y="95">B</text><text class="phase-C" x="60" y="95">C</text>${axes(90)}${phasePaths}<text x="10" y="218">DC output</text><path class="wave-axis" d="M130 280 H800"/><text class="wave-zero" x="112" y="284">0</text><path class="wave-dc" d="${pathFor(p=>electricalState('power-rectifier',p).dc,{y:280,h:80})}"/>${cursor(293)}<text class="wave-zero" x="130" y="318">0°</text><text class="wave-zero" x="453" y="318">180°</text><text class="wave-zero" x="776" y="318">360°</text></svg><p class="electrical-reading" id="electrical-reading"></p></div></div><p class="principle-note">Ideal six-pulse bridge with continuous conduction and zero source inductance. The curves omit filtering and commutation overlap; no equipment rating is implied.</p>`;
}
export function electricalMarkup(view){const study=electricalStudy(view);return study?`<header class="topology-heading"><p class="eyebrow">Electrical principle</p><h2>${study.title}</h2><p>Use the sequence controls to connect the changing quantities with the equipment.</p></header>${view==='power-transformer'?transformerMarkup():rectifierMarkup()}<div class="source-chips">${study.sources.map(id=>`<button data-source="${id}">Read the public explanation ↗</button>`).join('')}</div>`:'';}
export function updateElectricalDiagram(host,view,fraction){
  if(!host||!electricalStudy(view))return;const state=electricalState(view,fraction),x=130+670*state.fraction;
  const cursor=host.querySelector('.electrical-cursor');if(cursor){cursor.setAttribute('transform',`translate(${x-130} 0)`);const label=cursor.querySelector('text');label.textContent=`${Math.round(state.fraction*360)}°`;label.setAttribute('text-anchor',state.fraction>.85?'end':'start');label.setAttribute('x',state.fraction>.85?'123':'137');}
  const reading=host.querySelector('#electrical-reading');if(!reading)return;
  if(view==='power-transformer'){
    host.querySelector('.flux-path').style.opacity=String(.18+.82*Math.abs(state.flux));
    host.querySelector('.flux-direction').setAttribute('transform',state.flux<0?'rotate(180 245 60)':'');
    host.querySelector('.flux-direction').style.opacity=String(Math.abs(state.flux)<.04?0:1);
    host.querySelector('.flux-value').textContent=state.flux.toFixed(2);
    reading.textContent=`Normalized values · Primary ${state.primary.toFixed(2)} · Flux ${state.flux.toFixed(2)} · Secondary ${state.secondary.toFixed(2)}`;
  }else{
    host.querySelectorAll('[data-diode]').forEach(node=>node.classList.toggle('conducting',node.dataset.diode===state.high+'+'||node.dataset.diode===state.low+'-'));
    reading.textContent=`Conducting pair · ${state.high} feeds + DC · ${state.low} returns − DC · Output ${(state.dc*100).toFixed(0)}% of its illustrated peak`;
  }
}
