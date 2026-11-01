import assert from 'node:assert/strict';
import {EVIDENCE_LAB_SOURCES,EVIDENCE_LABS} from '../dist/evidence-labs.js';
import {SOURCES,CONCEPTS} from '../dist/catalog.js';
import {VIEWS} from '../dist/model.js';

const labs=new Map(EVIDENCE_LABS.map(lab=>[lab.id,lab])),sourceIds=new Set([...SOURCES,...EVIDENCE_LAB_SOURCES].map(s=>s.id)),conceptIds=new Set(CONCEPTS.map(c=>c.id));
const evaluate=(id,values={})=>labs.get(id).evaluate(values);
const getMetric=(result,label)=>{const record=result.metrics.find(m=>m.label===label);assert(record,'Missing metric '+label);return record.value;};
const getRow=(result,label)=>{const record=result.rows.find(r=>r.label===label);assert(record,'Missing evidence row '+label);return record;};
const near=(a,b,tolerance=.0011)=>assert(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
let checks=0;function check(label,fn){fn();checks++;console.log('PASS '+label);}

check('Every lab has an actual explorer destination, independent controls and scoped primary sources',()=>{
  assert.equal(labs.size,5);assert.equal(new Set(EVIDENCE_LAB_SOURCES.map(s=>s.id)).size,EVIDENCE_LAB_SOURCES.length);
  for(const source of EVIDENCE_LAB_SOURCES){assert.equal(new URL(source.url).protocol,'https:');assert(source.title&&source.publisher&&source.description&&source.scope);const existing=SOURCES.find(s=>s.id===source.id);if(existing){assert.equal(existing.url,source.url,'Source identity collision: '+source.id);assert.equal(existing.title,source.title,'Source title collision: '+source.id);}}
  for(const lab of EVIDENCE_LABS){
    assert(['vehicle','energy','track','station','information','maintenance'].includes(lab.workspace));assert(VIEWS[lab.view],lab.view);assert(conceptIds.has(lab.conceptId),lab.conceptId);
    const variant=VIEWS[lab.view].variants.find(v=>v.id===lab.variant);assert(variant,lab.variant);assert.notEqual(variant.presentation,'process',lab.id+' redirects away from explorer');
    assert(lab.question&&lab.boundary&&lab.sources.length);lab.sources.forEach(id=>assert(sourceIds.has(id),id));assert.equal(new Set(lab.controls.map(c=>c.id)).size,lab.controls.length);
    for(const control of lab.controls){assert(control.label);if(control.type==='range'){assert(control.min<control.max&&control.step>0);assert(control.default>=control.min&&control.default<=control.max);}else{assert.equal(control.type,'select');assert(control.options.some(o=>o.value===control.default));assert.equal(new Set(control.options.map(o=>o.value)).size,control.options.length);}}
  }
});

check('Uncertainty of a difference accounts for shared calibration covariance without shrinking each record',()=>{
  const independent=evaluate('measurement-evidence'),shared=evaluate('measurement-evidence',{calibrationRelation:'shared'});
  near(getMetric(independent,'Standard uncertainty of difference'),.12);
  near(getMetric(shared,'Standard uncertainty of difference'),Math.sqrt(2)*.12/2);
  assert.equal(getRow(independent,'Difference interval').status,'zero included');assert.equal(getRow(shared,'Difference interval').status,'zero excluded');
  assert.deepEqual(independent.series,shared.series,'Shared calibration cancels only from difference, not individual mean intervals');
});

check('Additional repeats reduce random uncertainty while an independent calibration floor remains',()=>{
  const first=evaluate('measurement-evidence',{repeatCount:2,repeatability:.12,calibration:.15}),last=evaluate('measurement-evidence',{repeatCount:16,repeatability:.12,calibration:.15});
  assert(getMetric(last,'Standard uncertainty of difference')<getMetric(first,'Standard uncertainty of difference'));
  assert(getMetric(last,'Standard uncertainty of difference')>=Math.sqrt(2)*.15-.0011);
  const changed=evaluate('measurement-evidence',{context:'fixture'}),unknown=evaluate('measurement-evidence',{context:'identity'});
  assert.deepEqual(changed.metrics,evaluate('measurement-evidence').metrics);assert.equal(getRow(changed,'Difference interval').status,'interpretation withheld');assert.equal(getRow(unknown,'Measurement context').status,'unresolved');
});

check('The acoustic curve decays exactly 60 dB per chosen RT60 and keeps noise independent',()=>{
  const short=evaluate('announcement-acoustics',{decayTime:.3}),long=evaluate('announcement-acoustics',{decayTime:3});
  for(const result of [short,long]){const p=result.series[0].points;near(p[0].y-p.at(-1).y,60,1e-6);near(p.at(-1).x,getMetric(result,'Chosen RT60'),1e-6);assert(result.series[1].points.every(p=>p.y===60));}
  assert(getMetric(long,'Tail at selected gap')>getMetric(short,'Tail at selected gap'));assert.equal(getMetric(short,'Speech level − background level'),getMetric(long,'Speech level − background level'));
  const shifted=evaluate('announcement-acoustics',{speechLevel:80,noiseLevel:70});assert.equal(getMetric(shifted,'Speech level − background level'),10);near(getMetric(shifted,'Tail − background at gap'),getMetric(evaluate('announcement-acoustics'),'Tail − background at gap'));
  assert.equal(getRow(short,'Intelligibility result').status,'not calculated');
});

check('A documented radio transfer cannot replace missing access or interrupted fixed transport',()=>{
  const normal=evaluate('radio-moving-timeline'),gap=evaluate('radio-moving-timeline',{access:'gap',time:30}),transport=evaluate('radio-moving-timeline',{transport:'interrupted',time:20}),both=evaluate('radio-moving-timeline',{access:'gap',transport:'interrupted'});
  assert.equal(getMetric(normal,'All declared prerequisites documented'),60);assert.equal(getMetric(gap,'Missing or unverified prerequisites'),10);assert.equal(getMetric(transport,'Missing or unverified prerequisites'),16);assert.equal(getMetric(both,'Missing or unverified prerequisites'),17);
  assert.equal(getRow(transport,'Fixed transport').status,'declared absent');assert.equal(getRow(transport,'Serving-cell association').status,'recorded');assert.equal(getRow(normal,'End-to-end voice').status,'unresolved');
  const unchanged=evaluate('radio-moving-timeline',{time:60});assert.deepEqual(normal.series,unchanged.series);assert.equal(getMetric(unchanged,'Fictional position'),720);
});

check('An absent transfer record stays unverified despite observed access, with exact event boundaries',()=>{
  const missing=evaluate('radio-moving-timeline',{transfer:'missing',time:40});assert.equal(getMetric(missing,'Missing or unverified prerequisites'),30);assert.equal(getRow(missing,'Serving-cell association').status,'unverified');assert(getRow(missing,'Radio access observations').detail.includes('cell B present'));
  for(const [time,status]of [[17,'declared present'],[18,'declared absent'],[33,'declared absent'],[34,'declared present']])assert.equal(getRow(evaluate('radio-moving-timeline',{transport:'interrupted',time}),'Fixed transport').status,status);
  const transport=evaluate('radio-moving-timeline',{transport:'interrupted'}).series[1].points;assert.deepEqual(transport.filter(p=>p.x===18),[{x:18,y:1},{x:18,y:0}]);assert.deepEqual(transport.filter(p=>p.x===34),[{x:34,y:0},{x:34,y:1}]);
});

check('The collection balance conserves volume without negative storage or an impossible discharge',()=>{
  for(const inflow of [0,14,30])for(const outlet of [0,8,30])for(const duration of [1,10,20]){
    const result=evaluate('drainage-observations',{inflow,outlet,duration}),stored=getMetric(result,'Stored at end'),discharged=getMetric(result,'Discharged through outlet'),overflow=getMetric(result,'Accumulated overflow');
    near(100+inflow*duration,stored+discharged+overflow,.011);assert(stored>=0&&stored<=200&&discharged>=0&&discharged<=outlet*duration+.011&&overflow>=0);
  }
  const dry=evaluate('drainage-observations',{inflow:0,outlet:30,duration:20});assert.equal(getMetric(dry,'Stored at end'),0);assert.equal(getMetric(dry,'Discharged through outlet'),100);
  const flood=evaluate('drainage-observations',{inflow:30,outlet:0,duration:20});assert.equal(getMetric(flood,'Accumulated overflow'),500);
});

check('Improving drainage cannot erase structural observations or validate an unverified survey datum',()=>{
  for(const survey of ['missing','small-change','changing','datum']){
    const wet=evaluate('drainage-observations',{survey,inflow:30,outlet:0,duration:20}),dry=evaluate('drainage-observations',{survey,inflow:0,outlet:30,duration:20});
    assert.deepEqual(getRow(wet,'Independent movement record'),getRow(dry,'Independent movement record'));assert.equal(getRow(dry,'Unobserved ground conditions').status,'unresolved');
  }
  assert.equal(getRow(evaluate('drainage-observations',{survey:'datum'}),'Independent movement record').status,'unresolved');
});

check('Change impact follows declared edges and distinguishes local evidence from downstream records',()=>{
  const sensor=evaluate('change-impact-evidence',{change:'sensor',evidence:'local'}),application=evaluate('change-impact-evidence',{change:'application'}),display=evaluate('change-impact-evidence',{change:'display'});
  assert.equal(getMetric(sensor,'Affected items'),7);assert.equal(getMetric(sensor,'Matching evidence records'),1);assert.equal(getMetric(sensor,'Missing or old records'),5);
  assert.equal(getMetric(application,'Affected items'),3);assert.equal(getMetric(display,'Affected items'),1);assert.equal(getMetric(display,'Missing or old records'),1);
  assert(sensor.rows.some(r=>r.label.includes('Point identity and scaling → Consuming application')));assert(!display.rows.some(r=>r.label==='DEMO.PHYSICAL'));
});

check('A matching evidence packet does not close an open issue or grant change authority',()=>{
  const open=evaluate('change-impact-evidence',{evidence:'coordinated'}),addressed=evaluate('change-impact-evidence',{evidence:'coordinated',issue:'disposition'}),old=evaluate('change-impact-evidence',{issue:'disposition'});
  assert.equal(getMetric(open,'Missing or old records'),0);assert.equal(getMetric(open,'Open fictional issue'),1);assert.equal(getMetric(addressed,'Open fictional issue'),0);assert.equal(getMetric(old,'Missing or old records'),6);
  for(const result of [open,addressed,old])assert.equal(getRow(result,'Authority').status,'outside exercise');assert.equal(getRow(old,'DEMO.POINT').status,'revision mismatch');
});

check('Every declared option and numeric endpoint evaluates deterministically without mutating input or producing non-finite values',()=>{
  const validate=result=>{assert(result.summary&&result.explanation);assert(result.metrics.length&&result.rows.length);for(const m of result.metrics){assert(m.label);assert(Number.isFinite(m.value),m.label);}for(const r of result.rows)assert(r.label&&r.status&&r.detail);for(const s of result.series||[]){assert(s.label&&s.color&&s.points.length);let x=-Infinity;for(const p of s.points){assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(p.x>=x);x=p.x;}}};
  for(const lab of EVIDENCE_LABS){const defaults=Object.fromEntries(lab.controls.map(c=>[c.id,c.default])),cases=[defaults,Object.fromEntries(lab.controls.map(c=>[c.id,c.type==='range'?NaN:'unknown']))];for(const c of lab.controls)for(const value of c.type==='range'?[c.min,c.max]:c.options.map(o=>o.value))cases.push({...defaults,[c.id]:value});for(const values of cases){const frozen=Object.freeze({...values}),result=lab.evaluate(frozen);validate(result);assert.deepEqual(lab.evaluate(frozen),result);}}
});

console.log(`Evidence labs: ${checks} checks passed.`);
