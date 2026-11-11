import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {searchReading,mountReadingSearch} from '../dist/reading-search.js';
import {CONCEPTS,SOURCES} from '../dist/catalog.js';
import {READING_GUIDES} from '../dist/reading-guides.js';

const html=await readFile(new URL('../dist/reading.html',import.meta.url),'utf8');
const decode=value=>value.replace(/&(amp|lt|gt|quot|#39);/g,(_,name)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[name]));
const plain=value=>decode(value.replace(/<[^>]*>/g,' '));
const normalized=value=>value.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const entries=[...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)].filter(([,attrs])=>attrs.includes('data-reading-kind')).map(([,attrs,body])=>{
 const attr=name=>decode(attrs.match(new RegExp(`\\b${name}="([^"]+)"`))[1]);
 const id=attr('id'),title=attr('data-reading-title');
 return {id,title,kind:attr('data-reading-kind'),section:attr('data-reading-section'),textContent:plain(body),titleKey:normalized(title),search:normalized(id+' '+plain(body))};
});
assert.equal(entries.filter(entry=>entry.kind==='concept').length,CONCEPTS.length);
assert.equal(entries.filter(entry=>entry.kind==='guide').length,READING_GUIDES.length);
assert.equal(entries.filter(entry=>entry.kind==='source').length,new Set(SOURCES.map(source=>source.url)).size);
assert.equal(new Set(entries.map(entry=>entry.id)).size,entries.length);
assert.equal(searchReading(entries,'point machine')[0].id,'concept-track-point-machine');
assert(searchReading(entries,'SCADA','concept').some(entry=>entry.id==='concept-power-scada'));
assert(searchReading(entries,'handover','guide').length>0);
assert(searchReading(entries,'Alstom','source').length>0);
assert(searchReading(entries,'Alstom','source').every(entry=>entry.kind==='source'));
assert.equal(searchReading(entries,'qzxv-unlisted-part').length,0);
assert.equal(searchReading(entries,'   ').length,0);
assert.match(html,/<section id="reading-search"[^>]* hidden>/,'No-JavaScript readers should not encounter an inactive control');
assert.match(html,/<article id="concept-track-point-machine"[^>]*><details><summary>/,'The full reading edition must remain present without search');
for(const result of searchReading(entries,'ventilation'))assert(html.includes(`id="${result.id}"`),'Each result must have an existing destination');

// Execute the shipping pagination handler with articles from the generated
// reading edition. This bounded DOM fixture tracks focus, not browser layout.
const controls=new Map();
const doc={activeElement:null,getElementById:id=>controls.get(id),querySelectorAll(selector){assert.equal(selector,'article[data-reading-kind]');return entries.map(entry=>({id:entry.id,textContent:entry.textContent,dataset:{readingKind:entry.kind,readingTitle:entry.title,readingSection:entry.section}}));}};
class Control extends EventTarget{
 constructor(id){super();this.id=id;this.hidden=false;this.value='';this.links=[];}
 focus(){doc.activeElement=this;}
 set innerHTML(value){this.links=[...value.matchAll(/<a href="([^"]+)"/g)].map(([,href])=>({href,focus(){doc.activeElement=this;}}));}
 querySelectorAll(selector){assert.equal(selector,'a');return this.links;}
}
for(const id of ['reading-search','reading-query','reading-kind','reading-results','reading-status','reading-more','reading-clear']){
 assert(html.includes(`id="${id}"`),`Missing generated control: ${id}`);controls.set(id,new Control(id));
}
controls.get('reading-kind').value='all';
const win=Object.assign(new EventTarget(),{location:new URL('https://example.test/reading.html')});
mountReadingSearch(doc,win);
const input=controls.get('reading-query'),more=controls.get('reading-more'),results=controls.get('reading-results');
input.value='point';input.dispatchEvent(new Event('input'));
assert.equal(results.links.length,12);assert.equal(more.hidden,false);
let expansions=0;
while(!more.hidden){
 const previousCount=results.links.length;more.focus();more.dispatchEvent(new Event('click'));
 assert.equal(doc.activeElement,results.links[previousCount],'Show more must focus the first newly added result, including when its button disappears');
 expansions++;
}
assert(expansions>0);assert.equal(results.links.length,searchReading(entries,'point').length);
console.log(`PASS Reading lookup: ${entries.length} real entries; exact-title ranking, part/function/guide/source queries, filtering, empty results and retained static destinations.`);
console.log(`PASS Reading pagination focus: ${expansions} expansions retain forward keyboard access through the final results.`);
