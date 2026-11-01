import {PHYSICAL_LABS} from './physical-labs.js';
import {EVIDENCE_LABS} from './evidence-labs.js';
import {workspaceFor} from './learning-workspaces.js';
export const LEARNING_LABS=[...PHYSICAL_LABS,...EVIDENCE_LABS];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=value=>typeof value==='number'?Number.isFinite(value)?new Intl.NumberFormat('en',{maximumFractionDigits:3}).format(value):'—':String(value??'');
const colors=['#3159c4','#ae571e','#247565','#7b4f9b','#9b4653'];
function labSchematic(diagram){
 if(diagram?.type!=='dc-sections')return '';
 const {coupled,feederAOpen,faultAtA}=diagram;
 const feederA=feederAOpen?'<path d="M160 120V132m0 21v12m0-33 15 17"/>':'<path d="M160 120V165"/>';
 return `<figure class="lab-single-line"><svg viewBox="0 0 600 300" role="img" aria-label="Two DC sections: ${coupled?'coupled boundary':'open boundary'}, feeder A ${feederAOpen?'open':'connected'}${faultAtA?', shunt at section A':''}"><title>Declared two-section DC circuit</title><g class="circuit-wire"><path d="M160 53V84m0 27v9M440 53V84m0 27v54M160 165v37m0 26v36M440 165v37m0 26v36M70 264H475"/>${feederA}${coupled?'<path d="M160 165H280m20 0H440"/><rect x="280" y="156" width="20" height="18"/>':'<path d="M160 165H273m54 0H440"/><path d="M273 165l39-17"/>'}${faultAtA?'<path d="M160 165H70v29m0 34v36"/><rect x="60" y="194" width="20" height="34"/>':''}<rect x="150" y="84" width="20" height="27"/><rect x="430" y="84" width="20" height="27"/><rect x="150" y="202" width="20" height="26"/><rect x="430" y="202" width="20" height="26"/></g><g class="circuit-source"><rect x="117" y="15" width="86" height="38" rx="3"/><rect x="397" y="15" width="86" height="38" rx="3"/></g><g class="circuit-node"><circle cx="160" cy="165" r="4"/><circle cx="440" cy="165" r="4"/></g><g class="circuit-text"><text x="160" y="39" text-anchor="middle">Source A</text><text x="440" y="39" text-anchor="middle">Source B</text><text x="184" y="101">Feeder A</text><text x="464" y="101">Feeder B</text><text x="174" y="188">Section A</text><text x="454" y="188">Section B</text><text x="300" y="133" text-anchor="middle">${coupled?'Coupled boundary':'Open boundary'}</text><text x="184" y="220">Load A</text><text x="464" y="220">Load B</text><text x="300" y="286" text-anchor="middle">Common 0 reference</text>${feederAOpen?'<text x="105" y="144">Open</text>':''}${faultAtA?'<text x="18" y="245">Shunt at A</text>':''}</g></svg><figcaption>One-line representation of the solved example. Both sources use the common zero reference. A supervisory snapshot is separate from this circuit.</figcaption></figure>`;
}
export function labChart(result,title){
 const series=(result.series||[]).map((s,i)=>({...s,color:/^#[\da-f]{3,8}$/i.test(s.color||'')?s.color:colors[i%colors.length],points:s.points.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))})).filter(s=>s.points.length);
 if(!series.length)return '';
 const points=series.flatMap(s=>s.points),xs=points.map(p=>p.x),ys=points.map(p=>p.y),xmin=Math.min(0,...xs),xmax=Math.max(...xs),ymin=Math.min(0,...ys),ymax=Math.max(...ys),dx=xmax-xmin||1,dy=ymax-ymin||1;
 const x=v=>58+(v-xmin)/dx*510,y=v=>224-(v-ymin)/dy*176;
 let axes='';for(let i=0;i<=4;i++){const xx=xmin+dx*i/4,yy=ymin+dy*i/4;axes+=`<path d="M58 ${y(yy).toFixed(2)}H568" class="lab-grid-line"/><text x="49" y="${(y(yy)+4).toFixed(2)}" text-anchor="end">${esc(number(yy))}</text><text x="${x(xx).toFixed(2)}" y="244" text-anchor="middle">${esc(number(xx))}</text>`;}
 const paths=series.map(s=>s.points.length===1?`<circle cx="${x(s.points[0].x).toFixed(2)}" cy="${y(s.points[0].y).toFixed(2)}" r="4.5" fill="${s.color}"/>`:`<path d="${s.points.map((p,i)=>(i?'L':'M')+x(p.x).toFixed(2)+' '+y(p.y).toFixed(2)).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2.6"/>`).join('');
 return `<figure class="lab-chart"><svg viewBox="0 0 610 278" role="img" aria-label="${esc(title)}: ${esc(result.xLabel||'Input')} against ${esc(result.yLabel||'Response')}"><title>${esc(title)}</title><text x="58" y="23" class="lab-axis-title">${esc(result.yLabel||'Response')}</text>${axes}<path d="M58 48V224H568" class="lab-axis"/>${paths}<text x="313" y="272" text-anchor="middle" class="lab-axis-title">${esc(result.xLabel||'Input')}</text></svg><figcaption>${series.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.label)}</span>`).join('')}</figcaption></figure>`;
}
export function createLearningLabs(host,actions){
 let context=null,chosen='',lastView=null;const saved=new Map();
 const html=(selector,text)=>{const el=host.querySelector(selector);if(el&&el.dataset.markup!==text){el.innerHTML=text;el.dataset.markup=text;}};
 host.innerHTML='<div class="lab-heading"><p class="eyebrow">Apply the relationships</p><h3>Change one assumption. Inspect the consequence.</h3></div><label for="learning-lab">A calculation or evidence case</label><select id="learning-lab"></select><div id="learning-lab-intro"></div><div id="learning-lab-controls" class="lab-controls"></div><div id="learning-lab-result"></div><details class="lab-data"><summary>Inspect the plotted values</summary><div id="learning-lab-data" class="depth-table-scroll"></div></details><div id="learning-lab-scope"></div>';
 const current=()=>LEARNING_LABS.find(l=>l.id===chosen);
 const values=lab=>{if(!saved.has(lab.id))saved.set(lab.id,Object.fromEntries(lab.controls.map(c=>[c.id,c.default])));return saved.get(lab.id);};
 function results(){
  const lab=current();if(!lab)return;const state=values(lab),r=lab.evaluate({...state});
  for(const c of lab.controls){const out=host.querySelector(`[data-lab-output="${c.id}"]`);if(out)out.textContent=number(state[c.id])+(c.unit?' '+c.unit:'');}
  html('#learning-lab-result',`<p class="lab-result-summary" role="status">${esc(r.summary)}</p>${r.metrics?.length?`<div class="lab-metrics">${r.metrics.map(m=>`<div><span>${esc(m.label)}</span><strong>${esc(number(m.value))}${m.unit?` <small>${esc(m.unit)}</small>`:''}</strong></div>`).join('')}</div>`:''}${labSchematic(r.diagram)}${labChart(r,lab.title)}${r.rows?.length?`<div class="depth-table-scroll"><table class="lab-evidence-table"><thead><tr><th scope="col">Item / observation</th><th scope="col">State</th><th scope="col">What it establishes</th></tr></thead><tbody>${r.rows.map(row=>`<tr><th scope="row">${esc(row.label)}</th><td>${esc(row.status)}</td><td>${esc(row.detail)}</td></tr>`).join('')}</tbody></table></div>`:''}<p class="lab-explanation">${esc(r.explanation)}</p>`);
  const series=r.series||[],data=host.querySelector('.lab-data');data.hidden=!series.length;
  html('#learning-lab-data',series.map(s=>`<table><caption>${esc(s.label)}</caption><thead><tr><th scope="col">${esc(r.xLabel||'Input')}</th><th scope="col">${esc(r.yLabel||'Response')}</th></tr></thead><tbody>${s.points.map(p=>`<tr><td>${esc(number(p.x))}</td><td>${esc(number(p.y))}</td></tr>`).join('')}</tbody></table>`).join(''));
 }
 function render(next){
  context=next;const workspace=workspaceFor(next.state.view,next.state.domain,next.state.workspace),labs=LEARNING_LABS.filter(l=>l.view===next.state.view||l.workspace===workspace?.id);
  host.hidden=!labs.length;if(host.hidden)return;
  if(lastView!==next.state.view||!labs.some(l=>l.id===chosen)){chosen=labs.find(l=>l.view===next.state.view)?.id||labs[0].id;lastView=next.state.view;}
  html('#learning-lab',labs.map(l=>`<option value="${l.id}">${esc(l.title)}</option>`).join(''));host.querySelector('#learning-lab').value=chosen;
  const lab=current(),state=values(lab);
  html('#learning-lab-intro',`<h4>${esc(lab.question)}</h4><button data-lab-locate>Locate the equipment for this case →</button>`);
  html('#learning-lab-controls',lab.controls.map(c=>c.type==='select'?`<label for="lab-${c.id}">${esc(c.label)}<select id="lab-${c.id}" data-lab-control="${c.id}">${c.options.map(o=>`<option value="${esc(o.value)}" ${String(state[c.id])===String(o.value)?'selected':''}>${esc(o.label)}</option>`).join('')}</select></label>`:`<label for="lab-${c.id}"><span>${esc(c.label)}</span><output data-lab-output="${c.id}" for="lab-${c.id}">${esc(number(state[c.id]))} ${esc(c.unit||'')}</output><input id="lab-${c.id}" data-lab-control="${c.id}" type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${state[c.id]}"></label>`).join(''));
  html('#learning-lab-scope',`<p class="depth-boundary">${esc(lab.boundary)}</p>${next.sourceChips(lab.sources)}`);results();
 }
 host.addEventListener('input',event=>{const control=event.target.dataset.labControl,lab=current();if(!control||!lab)return;const spec=lab.controls.find(c=>c.id===control);values(lab)[control]=spec.type==='range'?Number(event.target.value):event.target.value;results();});
 host.addEventListener('change',event=>{if(event.target.id==='learning-lab'){chosen=event.target.value;render(context);}});
 host.addEventListener('click',event=>{const button=event.target.closest('[data-lab-locate]');if(!button)return;event.preventDefault();event.stopPropagation();actions.locate(current());});
 return {render};
}
