import assert from 'node:assert/strict';
import {PHYSICAL_LABS,PHYSICAL_LAB_SOURCES,solveElectricalSections,solveFanWorkingPoint,simulateWheelRailResponse} from '../dist/physical-labs.js';
import {CONCEPTS,SOURCES} from '../dist/catalog.js';
import {VIEWS} from '../dist/model.js';
import {LEARNING_WORKSPACES} from '../dist/learning-workspaces.js';

let passed=0;const check=(label,fn)=>{fn();passed++;console.log('PASS '+label);};
const close=(a,b,tolerance=1e-10)=>assert(Math.abs(a-b)<tolerance,`${a} differs from ${b}`);
const lab=id=>PHYSICAL_LABS.find(l=>l.id===id);
const finite=value=>{if(typeof value==='number')assert(Number.isFinite(value));else if(Array.isArray(value))value.forEach(finite);else if(value&&typeof value==='object')Object.values(value).forEach(finite);};

check('Every lab has a reachable equipment target, declared controls and explicit source/scope boundaries',()=>{
  assert.equal(PHYSICAL_LABS.length,3);assert.equal(new Set(PHYSICAL_LABS.map(l=>l.id)).size,3);
  const sources=new Set([...SOURCES,...PHYSICAL_LAB_SOURCES].map(s=>s.id));
  for(const l of PHYSICAL_LABS){
    assert(VIEWS[l.view],l.view);assert(CONCEPTS.some(c=>c.id===l.conceptId));assert(LEARNING_WORKSPACES.some(w=>w.id===l.workspace));
    if(l.variant)assert(VIEWS[l.view].variants.some(v=>v.id===l.variant));
    assert(l.question&&l.boundary&&l.sources.length);l.sources.forEach(id=>assert(sources.has(id),id));
    for(const control of l.controls){assert(control.label&&['range','select'].includes(control.type));if(control.type==='range')assert(control.min<=control.default&&control.default<=control.max&&control.step>0);else assert(control.options.some(o=>o.value===control.default));}
  }
});

check('Evaluators are deterministic, preserve input and emit finite chart points at default and adversarial inputs',()=>{
  for(const l of PHYSICAL_LABS){
    for(const values of [{},Object.fromEntries(l.controls.map(c=>[c.id,c.min??c.options[0].value])),Object.fromEntries(l.controls.map(c=>[c.id,c.max??c.options.at(-1).value])),Object.fromEntries(l.controls.map(c=>[c.id,'invalid'])),Object.fromEntries(l.controls.map(c=>[c.id,Infinity]))]){
      const frozen=Object.freeze({...values}),a=l.evaluate(frozen),b=l.evaluate(frozen);assert.deepEqual(a,b);finite(a);assert(a.summary&&a.explanation&&a.xLabel&&a.yLabel);assert(a.metrics.every(m=>m.label&&m.unit));
      for(const series of a.series||[]){assert(series.label&&series.color);assert(series.points.length>0&&series.points.length<=160);for(let i=1;i<series.points.length;i++)assert(series.points[i].x>=series.points[i-1].x);}
    }
  }
});

check('Electrical node voltages match the closed-form single-source load case',()=>{
  const a=solveElectricalSections({condition:'normal',arrangement:'separated'}),b=solveElectricalSections({condition:'normal',arrangement:'coupled'});
  close(a.voltageA,4/4.1);close(a.currentA,1/4.1);close(a.voltageA,a.voltageB);close(b.tieCurrent,0);close(b.voltageA,a.voltageA);
});

check('All section arrangements conserve current and energy with the explicit return',()=>{
  for(const arrangement of ['separated','coupled'])for(const condition of ['normal','fault','local-open'])for(const resistance of [.02,.12,1]){
    const r=solveElectricalSections({arrangement,condition,resistance});close(r.residualA,0);close(r.residualB,0);close(r.sourcePower,r.lossPower,1e-9);
    assert(r.voltageA>=0&&r.voltageA<=1&&r.voltageB>=0&&r.voltageB<=1);assert(r.currentA>=0&&r.currentB>=0);
  }
});

check('An assumed local opening does not remove the second feed through an electrically coupled boundary',()=>{
  const separate=solveElectricalSections({arrangement:'separated',condition:'local-open'}),coupled=solveElectricalSections({arrangement:'coupled',condition:'local-open'});
  close(separate.currentA,0);close(separate.voltageA,0);close(separate.faultCurrent,0);close(separate.tieCurrent,0);
  close(coupled.currentA,0);assert(coupled.voltageA>0&&coupled.faultCurrent>0&&coupled.tieCurrent>0&&coupled.currentB>separate.currentB);
  const normal=solveElectricalSections({condition:'normal',resistance:.02});close(normal.faultCurrent,0);
});

check('Stale supervisory data changes the record while leaving the physical circuit and diagram unchanged',()=>{
  const values={condition:'local-open',arrangement:'coupled',resistance:.1};
  const a=lab('electrical-sections').evaluate({...values,telemetry:'current'}),b=lab('electrical-sections').evaluate({...values,telemetry:'stale'});
  assert.deepEqual(a.metrics,b.metrics);assert.deepEqual(a.series,b.series);assert.deepEqual(a.diagram,b.diagram);
  assert.notDeepEqual(a.rows.find(r=>r.label==='Supervisory record'),b.rows.find(r=>r.label==='Supervisory record'));
  assert.deepEqual(a.diagram,{type:'dc-sections',coupled:true,feederAOpen:true,faultAtA:true});
});

check('Fan working point balances all component losses and responds to each selected resistance',()=>{
  for(const speed of [.4,1,1.2])for(const filter of [20,200])for(const damper of [10,300])for(const coil of [20,150]){
    const s=solveFanWorkingPoint({speed,filter,damper,coil});close(s.shutoff-s.fanSlope*s.flow**2,s.pressure,1e-8);close(Object.values(s.losses).reduce((a,b)=>a+b,0),s.pressure,1e-8);close(s.airPower,s.flow*s.pressure);assert(s.flow>0&&s.flow<s.freeFlow);
  }
  const baseline=solveFanWorkingPoint({});for(const key of ['filter','damper','coil']){const changed=solveFanWorkingPoint({[key]:baseline[key]+20});assert(changed.flow<baseline.flow&&changed.pressure>baseline.pressure);}
});

check('At unchanged resistance, speed, pressure and air power obey the authored similarity relationships',()=>{
  const full=solveFanWorkingPoint({speed:1}),reduced=solveFanWorkingPoint({speed:.8});close(reduced.flow/full.flow,.8);close(reduced.pressure/full.pressure,.8**2);close(reduced.airPower/full.airPower,.8**3);
});

check('With zero braking demand the dimensionless wheelset retains pure rolling and constant energy',()=>{
  const r=simulateWheelRailResponse({demand:0});for(const p of r.samples){close(p.velocity,1);close(p.wheel,1);close(p.slip,0);close(p.force,0);close(p.brake,0);}for(const e of r.energy)close(e,r.energy[0]);assert(!r.locked);
});

check('Wheel/rail traces respect the force ceiling, nonnegative speeds and dissipative energy balance',()=>{
  for(const mu of [.04,.12,.35])for(const demand of [.1,.4])for(const inertia of [.02,.2])for(const programme of ['hold','release']){
    const r=simulateWheelRailResponse({mu,demand,inertia,programme});finite(r);assert.equal(r.samples.length,101);for(const p of r.samples){assert(Math.abs(p.force)<=mu+1e-12);assert(p.velocity>.29&&p.velocity<=1+1e-9&&p.wheel>=0);assert(p.brake>=0&&p.brake<=demand);}
    for(let i=1;i<r.energy.length;i++)assert(r.energy[i]<=r.energy[i-1]+1e-9,'Numerical integration created mechanical energy');
  }
});

check('High demand can lock the wheel while the mass moves; the separate release input permits recovery',()=>{
  const held=simulateWheelRailResponse({mu:.12,demand:.22,inertia:.06,programme:'hold'}),released=simulateWheelRailResponse({mu:.12,demand:.22,inertia:.06,programme:'release'});
  assert(held.locked&&held.final.velocity>0&&held.final.wheel<1e-8);assert(released.locked&&released.final.wheel>held.final.wheel);assert(released.final.slip<held.final.slip);close(released.final.brake,0);
  const mild=simulateWheelRailResponse({mu:.35,demand:.08,programme:'hold'});assert(!mild.locked&&mild.final.slip<.03);
});

check('Displayed wheel response is stable under a halved integration step without adding distance predictions',()=>{
  for(const programme of ['hold','release']){const a=simulateWheelRailResponse({programme},{step:.0005}),b=simulateWheelRailResponse({programme},{step:.00025});for(const field of ['velocity','wheel','slip','force'])close(a.final[field],b.final[field],.001);}
  const result=lab('wheel-rail-response').evaluate({});assert(result.metrics.every(m=>!m.label.toLowerCase().includes('distance')));assert(result.xLabel.includes('τ=tg/v₀'));
});
console.log(`PASS ${passed} physical-lab contracts: circuit conservation, topology/telemetry independence, fan balance/similarity, bounded wheel dynamics and deterministic accessible data`);
