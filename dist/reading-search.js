// Progressive lookup for the static reading edition. Every result still points
// to the original article, so source links and no-JavaScript reading stay intact.
const normalize=value=>String(value||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function searchReading(entries,query,kind='all'){
 const words=normalize(query).split(' ').filter(Boolean),phrase=words.join(' ');
 if(!words.length)return[];
 return entries.filter(entry=>(kind==='all'||entry.kind===kind)&&words.every(word=>entry.search.includes(word)))
  .map(entry=>({entry,score:(entry.titleKey===phrase?100:0)+(entry.titleKey.startsWith(phrase)?40:0)+(entry.titleKey.includes(phrase)?20:0)}))
  .sort((a,b)=>b.score-a.score||a.entry.title.localeCompare(b.entry.title)).map(({entry})=>entry);
}

export function mountReadingSearch(doc= document,win= window){
 const panel=doc.getElementById('reading-search');if(!panel)return;
 const input=doc.getElementById('reading-query'),kind=doc.getElementById('reading-kind'),results=doc.getElementById('reading-results'),status=doc.getElementById('reading-status'),more=doc.getElementById('reading-more'),clear=doc.getElementById('reading-clear');
 const entries=[...doc.querySelectorAll('article[data-reading-kind]')].map(article=>({id:article.id,kind:article.dataset.readingKind,title:article.dataset.readingTitle,section:article.dataset.readingSection,titleKey:normalize(article.dataset.readingTitle),search:normalize(article.id+' '+article.textContent)}));
 const labels={concept:'Component / function',guide:'System guide',source:'Public source'};
 let limit=12,matches=[];
 function render(reset=true){
  if(reset)limit=12;
  matches=searchReading(entries,input.value,kind.value);
  clear.hidden=!input.value;
  results.innerHTML=matches.slice(0,limit).map(entry=>`<li><a href="#${escape(entry.id)}"><span class="reading-result-kind">${labels[entry.kind]}</span><strong>${escape(entry.title)}</strong><small>${escape(entry.section)}</small><span class="reading-result-arrow" aria-hidden="true">→</span></a></li>`).join('');
  more.hidden=matches.length<=limit;
  if(!input.value.trim())status.textContent='Search by a part, function, mechanism or publisher.';
  else if(!matches.length)status.textContent='No matches. Try a shorter term or choose all entries.';
  else status.textContent=`${matches.length} ${matches.length===1?'entry':'entries'} found${matches.length>limit?`; showing ${limit}`:''}.`;
 }
 function reveal(){
  let id;try{id=decodeURIComponent(win.location.hash.slice(1));}catch{return;}
  const target=doc.getElementById(id);if(!target)return;
  const article=target.closest('article');if(!article)return;
  const details=article.querySelector('details');if(details)details.open=true;
  target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'instant'});
 }
 input.addEventListener('input',()=>render());
 kind.addEventListener('change',()=>render());
 more.addEventListener('click',()=>{const previousCount=results.querySelectorAll('a').length;limit+=12;render(false);results.querySelectorAll('a')[previousCount]?.focus();});
 clear.addEventListener('click',()=>{input.value='';render();input.focus();});
 // Clicking an already-current fragment does not emit hashchange.
 results.addEventListener('click',event=>{const link=event.target.closest('a');if(link&&link.hash===win.location.hash)reveal();});
 win.addEventListener('hashchange',reveal);
 panel.hidden=false;render();reveal();
}

if(typeof document!=='undefined')mountReadingSearch();
