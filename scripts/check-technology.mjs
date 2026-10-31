import assert from 'node:assert/strict';
import {normalizeTechnology,technologyFromUrl,technologyForView,technologyForComponent,controlRoute,technologyFlow,technologyNote} from '../dist/technology.js';
assert.deepEqual(normalizeTechnology(),{propulsion:'lim',control:'loop'});
assert.deepEqual(technologyFromUrl('?propulsion=rotary&control=loop',{propulsion:'lim',control:'radio'}),{propulsion:'rotary',control:'loop'});
assert.deepEqual(technologyFromUrl('?propulsion=bad&control=bad'),{propulsion:'lim',control:'loop'});
for(const propulsion of ['lim','rotary'])for(const control of ['loop','radio','fixed','etcs1','etcs2']){
 const technology={propulsion,control};assert.deepEqual(normalizeTechnology(technology),technology);
 const route=controlRoute(control);assert.deepEqual(technologyForView(technology,route.view,route.variant),technology);
}
assert.deepEqual(technologyForView({propulsion:'rotary',control:'loop'},'cbtc-network','normal'),{propulsion:'rotary',control:'radio'});
assert.deepEqual(technologyForComponent({propulsion:'rotary',control:'radio'},'loop-pickup'),{propulsion:'rotary',control:'loop'});
assert.equal(controlRoute('fixed').view,'signalling');
assert.match(technologyNote({view:'bogie',technology:{propulsion:'rotary',control:'loop'}},''),/gearboxes/);
const base={description:'base',nodes:[],sources:[]};
assert.equal(technologyFlow({view:'lim',domain:'vehicle',technology:{propulsion:'rotary',control:'loop'}},base),base);
assert.match(technologyFlow({view:'system',domain:'power',mode:'motoring',technology:{propulsion:'rotary',control:'loop'}},base).description,/Wheel–rail adhesion/);
assert.match(technologyFlow({view:'system',domain:'power',mode:'regeneration',sink:'resistor',technology:{propulsion:'rotary',control:'loop'}},base).description,/diode/);
console.log('PASS technology defaults, invalid URL handling, 10 independent combinations, specialist scope and rotary energy narratives');

assert.deepEqual(technologyFromUrl('',null),{propulsion:'lim',control:'loop'});
