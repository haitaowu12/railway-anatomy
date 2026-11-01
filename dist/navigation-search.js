import {CONTROL_DOMAINS} from './control-interfaces-data.js';
import {PROCESS_REDIRECTS} from './process-ui.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalized=text=>String(text||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function buildNavigationIndex({views,concepts,tours,processes,domains}){
 const result=[];
 for(const [id,v]of Object.entries(views))if(!PROCESS_REDIRECTS[id])result.push({kind:'view',id,title:v.label,subtitle:domains.find(d=>d.views.includes(id))?.label||'Railway',search:[id,v.label,v.title,v.note,...(v.variants||[]).map(x=>x.label)].join(' ')});
 for(const c of concepts)result.push({kind:'component',id:c.id,title:c.label,subtitle:'Component or function',search:[c.label,c.id,c.summary].join(' ')});
 for(const [id,p]of Object.entries(processes))result.push({kind:'process',id,title:p.title,subtitle:'People, decisions and evidence',search:[id,p.title,p.summary,p.question].join(' ')});
 for(const [index,t]of tours.entries())result.push({kind:'tour',id:String(index),title:t.label,subtitle:'Guided tour',search:[t.label,t.question,t.title].join(' ')});
 for(const d of CONTROL_DOMAINS)result.push({kind:'interface',id:d.id,title:d.label,subtitle:'Control responsibilities and optional interfaces',search:[d.label,d.short,d.local,d.supervisor,d.role,...d.monitor,...d.components].join(' ')});
 return result.map(e=>({...e,normalized:normalized(e.search),normalizedTitle:normalized(e.title)}));
}
export function searchNavigation(index,query,limit=24){
 const q=normalized(query),tokens=q.split(' ').filter(Boolean);if(!tokens.length)return[];
 return index.filter(e=>tokens.every(token=>e.normalized.includes(token))).map(e=>({e,score:(e.normalizedTitle===q?100:0)+(e.normalizedTitle.startsWith(q)?40:0)+(e.normalizedTitle.includes(q)?20:0)+(e.kind==='interface'?8:e.kind==='process'?5:0)})).sort((a,b)=>b.score-a.score||a.e.title.localeCompare(b.e.title)).slice(0,limit).map(x=>x.e);
}
export function createNavigationSearch(dialog,{index,onNavigate}){
 const input=dialog.querySelector('input'),results=dialog.querySelector('[data-navigation-results]');
 let matches=[];
 function render(){matches=searchNavigation(index,input.value);results.innerHTML=input.value.trim()?`<p class="search-count" role="status">${matches.length}${matches.length===24?'+':''} matches</p>`+(matches.length?matches.map((e,i)=>`<button data-navigation-result="${i}"><span class="search-kind">${esc(e.kind==='interface'?'Interface':e.kind==='view'?'View':e.kind==='component'?'Part / function':e.kind==='tour'?'Tour':'Process')}</span><span><strong>${esc(e.title)}</strong><small>${esc(e.subtitle)}</small></span></button>`).join(''):'<p>No match. Try a system, function or part such as “BAS”, “door”, “bearing” or “handover”.</p>'):'<p>Find a view, component, process or guided tour. Try “SCADA”, “ventilation”, “bearing”, “drainage” or “handover”.</p>';}
 function choose(i){const item=matches[i];if(!item)return;dialog.close();onNavigate(item);}
 input.addEventListener('input',render);
 input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();results.querySelector('button')?.focus();}if(event.key==='Enter'&&matches.length){event.preventDefault();choose(0);}});
 dialog.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;event.stopPropagation();if(b.dataset.navigationResult!==undefined)choose(Number(b.dataset.navigationResult));else if(b.hasAttribute('data-navigation-close'))dialog.close();});
 results.addEventListener('keydown',event=>{const buttons=[...results.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();const next=i+(event.key==='ArrowDown'?1:-1);if(next<0)input.focus();else buttons[Math.min(buttons.length-1,next)]?.focus();}});
 return {open(query=''){input.value=query;render();dialog.showModal();input.focus();}};
}
