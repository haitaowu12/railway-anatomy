import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as THREE from '../dist/vendor/three.module.js';
import * as exploration from '../dist/exploration.js';
import {electrificationForComponent} from '../dist/electrification.js';

// The renderer and DOM are the only substitutes. All scene construction,
// animation, selection, masking and camera code below is the shipping viewer.
const source = await readFile(new URL('../dist/viewer.js', import.meta.url), 'utf8');
const dependencies = { THREE: { ...THREE } };
for (const [, exports, file] of source.matchAll(/^import\s+\{([^}]+)\}\s+from\s+'([^']+)';/gm)) {
  if (file.includes('vendor/')) continue;
  const module = await import(new URL(`../dist/${file.replace('./', '')}`, import.meta.url));
  for (const name of exports.split(',').map(s => s.trim())) dependencies[name] = module[name];
}
let renderer, nextFrame;
class GeometryRenderer {
  constructor() {
    renderer = this; this.shadowMap = {};
    this.domElement = { style: {}, setAttribute() {}, addEventListener() {}, removeEventListener() {}, remove() {},
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 1100, height: 700 }) };
  }
  setClearColor() {} setPixelRatio() {} setSize() {} dispose() {}
  render(scene, camera) { this.scene = scene; this.camera = camera; }
}
class CameraControls {
  constructor(camera) { this.camera = camera; this.target = new THREE.Vector3(); }
  update() { this.camera.lookAt(this.target); this.camera.updateMatrixWorld(true); }
  addEventListener() {} dispose() {}
}
dependencies.THREE.WebGLRenderer = GeometryRenderer;
dependencies.OrbitControls = CameraControls;
dependencies.SVGRenderer = GeometryRenderer;
dependencies.window = { devicePixelRatio: 1, matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) };
dependencies.document = { hidden: false, addEventListener() {}, removeEventListener() {} };
dependencies.ResizeObserver = class { observe() {} disconnect() {} };
dependencies.requestAnimationFrame = callback => { nextFrame = callback; return 1; };
dependencies.cancelAnimationFrame = () => {};
const executable = source.replace(/^import\s+[\s\S]*?;\n/gm, '').replace('export function createViewer', 'function createViewer');
const createViewer = new Function(...Object.keys(dependencies), `${executable}\nreturn createViewer;`)(...Object.values(dependencies));
const viewer = createViewer({ clientWidth: 1100, clientHeight: 700, appendChild() {} });
nextFrame(0);
const activeRoot = () => renderer.scene.children.find(node => node.name.startsWith('view-') && node.visible);
const position = name => activeRoot().getObjectByName(name).getWorldPosition(new THREE.Vector3());


const visible=node=>{for(let n=node;n;n=n.parent)if(!n.visible)return false;return true;};
const find=id=>{const result=[];activeRoot().traverse(node=>{if(node.userData.component===id&&node.isGroup&&visible(node))result.push(node);});return result;};
const bounds=id=>exploration.visibleBounds(find(id));
const has=id=>viewer.getVisibleComponentIds().includes(id);
const profiles=['fourth-rail-dc','third-rail-dc','overhead-dc','overhead-ac'];
const views=['system','substation','guideway','vehicle','bogie','electrification'];
let cases=0;
for(const view of views)for(const propulsion of ['lim','rotary'])for(const profile of profiles){
  viewer.setView(view);viewer.setElectrification(profile);viewer.setTechnology({propulsion,control:'loop'});viewer.setCutaway(true);viewer.setMode('motoring');
  const overhead=profile.startsWith('overhead'),ac=profile==='overhead-ac',fourth=profile==='fourth-rail-dc';
  if(view!=='substation'){
    assert.equal(has('positive-rail'),!overhead,`${view}/${profile}: supply conductor`);
    assert.equal(has('negative-rail'),fourth,`${view}/${profile}: separate return conductor`);
    assert.equal(has('overhead-contact-wire'),overhead,`${view}/${profile}: overhead contact wire`);
    assert.equal(has('pantograph'),overhead,`${view}/${profile}: pantograph`);
    assert.equal(has('collector-positive-shoe'),!overhead,`${view}/${profile}: supply shoe`);
    assert.equal(has('collector-return-shoe'),fourth,`${view}/${profile}: return shoe`);
    assert.equal(has('running-rail-return'),!fourth,`${view}/${profile}: running-rail bond`);
    assert.equal(has('wheel-return'),!fourth,`${view}/${profile}: wheelset return connection`);
    assert.equal(has('reaction-rail'),propulsion==='lim',`${view}/${profile}: profile silently changed propulsion`);
  }
  if(['system','vehicle','electrification'].includes(view)){
    assert.equal(has('onboard-transformer'),ac,`${view}/${profile}: onboard transformer`);
    assert.equal(has('line-converter'),ac,`${view}/${profile}: AC line converter`);
    assert.equal(has('onboard-braking-resistor'),ac,`${view}/${profile}: onboard resistor`);
    assert(has('dc-link')&&has('traction-inverter'),`${view}/${profile}: common DC link / motor inverter missing`);
  }
  if(['system','substation','electrification'].includes(view)){
    assert.equal(has('rectifier'),!ac,`${view}/${profile}: wayside diode rectifier`);
    assert.equal(has('dc-switchgear'),!ac,`${view}/${profile}: DC feeders`);
    assert.equal(has('ac-feeder-switchgear'),ac,`${view}/${profile}: AC feeders`);
    assert.equal(has('wayside-resistor'),!ac,`${view}/${profile}: wayside resistor`);
    assert(has('transformer')&&has('supply-return-terminal'),`${view}/${profile}: incomplete wayside circuit`);
  }
  cases++;
}

// Contact geometry is shared rather than visually approximated: the carbon
// strips meet the wire, and the two fourth-rail shoes meet their two conductors.
viewer.setView('vehicle');viewer.setTechnology({propulsion:'rotary',control:'loop'});viewer.setElectrification('overhead-dc');viewer.setExploded(0);
const head=bounds('pantograph-head'),wire=bounds('overhead-contact-wire');
assert(Math.abs(head.max.y-5.2)<1e-5,'Pantograph contact surface does not meet the contact-wire height');
assert(wire.min.y<=head.max.y&&wire.max.y>=head.max.y,'Overhead wire and pantograph do not intersect at the collection interface');
viewer.setElectrification('fourth-rail-dc');
for(const [shoe,rail]of [['collector-positive-shoe','positive-rail'],['collector-return-shoe','negative-rail']]){
  const rb=bounds(rail);for(const node of find(shoe)){const sb=exploration.visibleBounds(node);assert(sb.max.z>=rb.min.z&&sb.min.z<=rb.max.z,`${shoe} misses its conductor laterally`);}
}

// The AC primary and secondary are distinct, named connection geometries.
viewer.setElectrification('overhead-ac');
for(const name of ['pantograph-to-transformer-primary','ac-primary-wheel-return','transformer-secondary-to-line-converter','transformer-secondary-return']){
  assert(visible(activeRoot().getObjectByName(name)),`${name} is absent from the AC circuit`);
}
assert(!visible(activeRoot().getObjectByName('separate-return-shoe-path')),'The AC train retained a ghost fourth-rail return');

const assertTerminal=(pathName,index,transformerId,rowName)=>{
  const trace=activeRoot().getObjectByName(pathName),points=trace.userData.circuitPath;
  const local=new THREE.Vector3(...points[index<0?points.length+index:index]);
  const point=trace.parent.localToWorld(local);
  const tx=find(transformerId)[0],row=tx.getObjectByName(rowName),terminalBounds=exploration.visibleBounds(row).expandByScalar(.025);
  assert(terminalBounds.containsPoint(point),`${pathName} does not terminate at its own transformer winding terminals`);
};
assertTerminal('pantograph-to-transformer-primary',-1,'onboard-transformer','transformer-primary-terminal-row');
assertTerminal('ac-primary-wheel-return',0,'onboard-transformer','transformer-primary-terminal-row');
assertTerminal('transformer-secondary-to-line-converter',0,'onboard-transformer','transformer-secondary-terminal-row');
assertTerminal('transformer-secondary-return',-1,'onboard-transformer','transformer-secondary-terminal-row');
for(const [left,right]of [['traction-inverter','line-converter'],['line-converter','onboard-transformer'],['onboard-transformer','apu']])assert(!bounds(left).intersectsBox(bounds(right)),`${left} intersects ${right} in the assembled AC underframe`);
assert(bounds('onboard-transformer').max.y<1.3,'Onboard transformer penetrates the vehicle floor');
viewer.setView('substation');viewer.setElectrification('overhead-ac');viewer.setCutaway(true);
assertTerminal('ac-transformer-to-feeder',0,'transformer','transformer-secondary-terminal-row');
assertTerminal('ac-transformer-return',-1,'transformer','transformer-secondary-terminal-row');
viewer.setView('vehicle');viewer.setElectrification('overhead-ac');viewer.setCutaway(true);

viewer.setMode('regeneration');viewer.setReceptivity('resistor');
assert(visible(activeRoot().getObjectByName('resistor-heat-destination')),'Limited AC receptivity has no onboard heat destination');
viewer.setElectrification('overhead-dc');
assert(!visible(activeRoot().getObjectByName('resistor-heat-destination')),'DC profile retained an AC onboard resistor heat cue');

// A selected assembly actually opens into different pieces. Its root stays
// fixed, so isolation does not merely translate the same closed enclosure.
for(const [view,id,pieces]of [
  ['power-transformer','transformer',['transformer-core','transformer-primary-winding','transformer-secondary-winding','transformer-tank','transformer-bushing']],
  ['power-rectifier','rectifier',['rectifier-diode-stack','rectifier-cooling','rectifier-busbar']],
  ['power-switchgear','dc-switchgear',['switchgear-pole','switchgear-busbar','switchgear-drive','breaker-arc-chute']],
]){
  viewer.setView(view);viewer.setVariant(view==='power-switchgear'?'dc':'default');viewer.setCutaway(true);viewer.setSelected(id);viewer.setMode('coasting');
  const cap=viewer.getExplorationCapabilities();assert(cap.canExplodeSelected&&cap.internalSeparationCount>=pieces.length,`${view}: no real internal assembly`);
  const assembly=find(id)[0],origin=assembly.getWorldPosition(new THREE.Vector3());
  const before=new Map(pieces.map(piece=>[piece,find(piece)[0].getWorldPosition(new THREE.Vector3())]));
  viewer.setExplodeScope('selected');viewer.setExploded(.7);
  assert(assembly.getWorldPosition(new THREE.Vector3()).distanceTo(origin)<1e-8,`${view}: selected assembly root translated`);
  for(const piece of pieces)assert(find(piece)[0].getWorldPosition(new THREE.Vector3()).distanceTo(before.get(piece))>.15,`${view}: ${piece} did not separate`);
  viewer.setIsolation(id);assert(viewer.getViewCapabilities().internalParts>=pieces.length,`${view}: isolated internals vanished`);
  viewer.setExploded(0);viewer.setIsolation(null);
}
viewer.setView('power-switchgear');viewer.setVariant('ac');viewer.setCutaway(true);
assert(!has('breaker-arc-chute')&&has('ac-switchgear')&&!has('dc-switchgear'),'AC detail retained the DC arc-chute assembly');

// Profile replacement clears exploration masks and selected-scope offsets.
viewer.setView('vehicle');viewer.setElectrification('overhead-ac');viewer.setSelected('pantograph');viewer.setIsolation('pantograph');viewer.setExplodeScope('selected');viewer.setExploded(.8);
viewer.setElectrification('third-rail-dc');
assert.equal(viewer.getExplorationState().isolation,null);assert.equal(viewer.getExplorationState().explodeScope,'all');assert.equal(viewer.getExplorationState().exploded,0);
assert(has('collector-positive-shoe')&&!has('pantograph'),'Profile change left a stale isolated collector mask');

// Explicit inspection of DC-only feeder hardware from an existing AC scene
// must materialize that hardware; the current scene registers both branches.
for(const id of ['dc-switchgear','breaker','breaker-arc-chute']){
  viewer.setView('substation');viewer.setElectrification('overhead-ac');viewer.setCutaway(true);
  assert(!has(id),`${id} should start hidden in the selected AC feeder chain`);
  viewer.setElectrification(electrificationForComponent(viewer.getElectrification(),id));
  assert(has(id)&&has('rectifier')&&!has('ac-feeder-switchgear'),`Inspecting ${id} did not replace the incompatible feeder branch`);
  assert.equal(electrificationForComponent('overhead-dc',id),'overhead-dc','Inspecting shared DC hardware changed a compatible overhead-DC collection choice');
}
viewer.setElectrification('overhead-ac');viewer.setView('power-switchgear');viewer.setVariant('dc');viewer.setCutaway(true);
assert(has('dc-switchgear')&&has('breaker-arc-chute'),'The independent component study lost its DC assembly');
assert.equal(viewer.getElectrification(),'overhead-ac','An independent power detail view changed the stored railway supply profile');

// A fixture with just one translated enclosure must not advertise an internal
// inspection capability, either globally or for its selected component.
const root=new THREE.Group(),enclosure=new THREE.Group();root.add(enclosure);enclosure.userData.component='enclosure';
const cube=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial());enclosure.add(cube);
const record={root,parts:new Map([['enclosure',[enclosure]]]),exploded:[{node:enclosure,delta:new THREE.Vector3(0,1,0)}]};
assert.equal(exploration.viewSeparationCapabilities(record).explode,false);
assert.equal(exploration.explorationCapabilities(record,'enclosure').canExplodeSelected,false);
const internal=new THREE.Group();internal.name='real-removable-module';internal.add(new THREE.Mesh(new THREE.BoxGeometry(.4,.4,.4),cube.material));enclosure.add(internal);record.exploded.push({node:internal,delta:new THREE.Vector3(.5,0,0)});
assert.equal(exploration.viewSeparationCapabilities(record).internalParts,1);
internal.visible=false;assert.equal(exploration.viewSeparationCapabilities(record).explode,false,'A hidden internal part created a no-op separator control');

// Repeated instances keep their physical anchor even if projection size changes.
const camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.set(0,0,10);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
const a=new THREE.Group(),b=new THREE.Group(),anchors=new Map();
const box=(x,half)=>new THREE.Box3(new THREE.Vector3(x-half,-half,0),new THREE.Vector3(x+half,half,.2));
let map=new Map([['repeated',[{node:a,bounds:box(-1,.5)},{node:b,bounds:box(1,.25)}]]]);
const first=exploration.screenPositions(map,camera,anchors)[0];
map=new Map([['repeated',[{node:a,bounds:box(-1,.25)},{node:b,bounds:box(1,.6)}]]]);
assert.equal(exploration.screenPositions(map,camera,anchors)[0].instanceId,first.instanceId,'Label anchor jumped to a different physical instance');
viewer.dispose();
console.log(`PASS electrification: ${cases} profile/propulsion/view cases; contact alignment; separate AC circuits; braking destination; real internal separation; profile resets; stable anchors.`);
