import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as THREE from '../dist/vendor/three.module.js';
import * as exploration from '../dist/exploration.js';
import { VIEWS, targetFor } from '../dist/model.js';
import { canAnimate } from '../dist/comparisons.js';

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

viewer.setView('bogie'); viewer.setSelected('bogie');
let capabilities = viewer.getExplorationCapabilities();
assert(capabilities.canFocus && capabilities.canIsolate && capabilities.canExplodeSelected);
assert(capabilities.pieceNames.includes('Frame and suspension') && capabilities.pieceNames.includes('Winding groups'));
assert.equal(capabilities.instanceCount, 1);
const railBefore = position('running-rail'), frameBefore = position('bogie-frame-and-suspension');
viewer.setExplodeScope('selected'); viewer.setExploded(.8);
assert(position('running-rail').distanceTo(railBefore) < 1e-8, 'Selected bogie separation moved the running rail');
assert(position('bogie-frame-and-suspension').distanceTo(frameBefore) > .5, 'Selected bogie did not physically separate');
const separated = position('primary-winding-groups');
for (let i = 0; i < 8; i++) { viewer.setPhase(i / 4); viewer.setExploded(.8); }
assert(position('primary-winding-groups').distanceTo(separated) < 1e-8, 'Repeated phase/separation updates accumulated displacement');

assert(viewer.setIsolation('bogie'));
let ids = viewer.getVisibleComponentIds();
assert(ids.includes('bogie') && ids.includes('lim-primary') && ids.includes('brakes') && ids.includes('collector'));
assert(!ids.includes('running-rail') && !ids.includes('seltrac-loop') && !ids.includes('rotary-traction-motor'));
assert(viewer.getExplorationCapabilities().internalSeparationCount > 3, 'Isolated bogie lost its real internal separations');
viewer.setSelected('brakes');
assert.equal(viewer.getExplorationState().isolation, 'bogie', 'Drilling into an isolated assembly unexpectedly restored all surroundings');
assert.equal(viewer.getExplorationState().exploded, 0, 'A new selected scope inherited the old separation amount');
viewer.setSelected('running-rail');
assert.equal(viewer.getExplorationState().isolation, null, 'Selecting outside an isolation left the requested component hidden');
assert(viewer.getVisibleComponentIds().includes('running-rail'));

viewer.setTechnology({ propulsion: 'rotary', control: 'etcs2' });
viewer.setSelected('bogie'); viewer.setIsolation('bogie'); viewer.setExplodeScope('selected'); viewer.setExploded(.6);
viewer.setTechnology({ propulsion: 'rotary', control: 'etcs2' });
viewer.setVariant('default'); viewer.setSelected('bogie');
assert.equal(viewer.getExplorationState().isolation, 'bogie', 'Idempotent UI synchronization discarded exploration state');
for (const phase of [0, 1, 4, 5]) {
  viewer.setPhase(phase); viewer.setMode('coasting');
  ids = viewer.getVisibleComponentIds();
  assert(ids.includes('rotary-traction-motor') && ids.includes('traction-gearbox') && !ids.includes('lim-primary'), 'Isolation revealed hidden propulsion geometry');
}
viewer.setTechnology({ propulsion: 'lim', control: 'loop' });
assert.deepEqual({ ...viewer.getExplorationState(), canRestoreFrame: false },
  { explodeScope: 'all', isolation: null, focused: null, exploded: 0, canRestoreFrame: false });
assert(viewer.getVisibleComponentIds().includes('lim-primary') && !viewer.getVisibleComponentIds().includes('rotary-traction-motor'));
viewer.setSelected(null);
assert.equal(viewer.getExplorationCapabilities().canExplodeSelected, false, 'An empty selection offered selected-component separation');
assert.equal(viewer.setExplodeScope('selected'), 'all');

viewer.setView('etcs'); viewer.setVariant('level-2'); viewer.setSelected('rbc');
assert(viewer.setIsolation('rbc'));
viewer.setVariant('level-1');
assert.equal(viewer.getExplorationState().isolation, null, 'A variant change retained a stale equipment mask');
viewer.setSelected('balise'); assert(viewer.frameSelection());
viewer.setView('lim');
assert.equal(viewer.getExplorationState().focused, null);
assert.equal(viewer.restoreFrame(), false, 'A frame from a different scene remained restorable');
viewer.setSelected('lim-primary'); viewer.setIsolation('lim-primary');
assert(viewer.getExplorationCapabilities().internalSeparationCount >= 3);
viewer.setExplodeScope('selected'); viewer.setExploded(1);
const primary = activeRoot().getObjectByName('lim-primary');
assert.equal(primary.position.y, .92, 'An isolated primary translated as a whole instead of separating its interior');
assert(viewer.getVisibleComponentIds().every(id => id === 'lim-primary'));
viewer.setPhase(5); assert.equal(viewer.getPhase(), 5, 'The manual end-of-cycle position wrapped to zero');
viewer.setIsolation(null);
assert(viewer.getVisibleComponentIds().includes('reaction-rail'));

viewer.setView('station-networks'); viewer.setVariant('building'); viewer.setCutaway(false);
viewer.setSelected('bas-controller'); assert(viewer.setIsolation('bas-controller'));
assert(viewer.getViewCapabilities().explode, 'The closed controller lost its removable cover');
viewer.setCutaway(true);
assert.equal(viewer.getViewCapabilities().explode, false, 'A hidden cutaway cover offered a no-op separation slider');
assert.equal(viewer.getExplorationCapabilities().canExplodeSelected, false);
viewer.setCutaway(false);
assert(viewer.getViewCapabilities().explode, 'Restoring the visible cover did not restore separation capability');

// Execute the application's production synchronization order against the real
// viewer. A saved selected cover must be restored after its cutaway state,
// otherwise it silently falls back to separating the whole scene.
const appSource = await readFile(new URL('../dist/app.js', import.meta.url), 'utf8');
const syncStart = appSource.indexOf('function syncViewer('), syncEnd = appSource.indexOf('function syncControls()', syncStart);
assert(syncStart >= 0 && syncEnd > syncStart, 'Viewer synchronization markers changed');
const synchronize = new Function('viewer', 'VIEWS', 'targetFor', 'canAnimate', `
  let state, lastExplorationContext = '';
  function syncControls() {}
  ${appSource.slice(syncStart, syncEnd)}
  return (value, restoring = false) => {
    state = structuredClone(value);
    if (restoring) lastExplorationContext = '';
    syncViewer(true);
    return structuredClone(state);
  };
`)(viewer, VIEWS, targetFor, canAnimate);
const savedController = { view: 'station-networks', domain: 'station', component: 'bas-controller', variant: 'building',
  technology: { propulsion: 'lim', control: 'loop' }, mode: 'coasting', scenario: 'nominal', sink: 'train',
  cutaway: false, exploded: .6, explodeScope: 'selected', playing: false };
const laterScene = { ...savedController, view: 'lim', domain: 'vehicle', component: 'lim-primary', variant: 'default',
  cutaway: true, exploded: 0, explodeScope: 'all' };
synchronize(laterScene);
const restoredController = synchronize(savedController, true);
assert.equal(restoredController.explodeScope, 'selected', 'Restoring a covered assembly changed selected scope into whole-scene separation');
assert.equal(viewer.getExplorationState().exploded, .6);
assert(Math.abs(activeRoot().getObjectByName('automation-panel-cover').position.z - .48) < 1e-8,
  'The restored BAS cover did not receive its saved physical displacement');
const hiddenCover = synchronize({ ...savedController, cutaway: true });
assert.equal(hiddenCover.explodeScope, 'all');
assert.equal(viewer.getExplorationState().exploded, 0, 'Removing the only selected separator promoted its amount to whole-scene separation');

// Hidden descendants and duplicate instances must not distort the frame or
// anchor a tag in empty space between two occurrences of a component.
const scene = new THREE.Scene(), root = new THREE.Group(); scene.add(root);
const near = new THREE.Group(), far = new THREE.Group(); near.userData.component = far.userData.component = 'repeat';
near.position.set(-4, 0, 0); far.position.set(4, 0, 0); root.add(near, far);
for (const node of [near, far]) node.add(new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial()));
const hidden = new THREE.Mesh(new THREE.BoxGeometry(200, 200, 200), new THREE.MeshBasicMaterial()); hidden.visible = false; near.add(hidden);
const record = { root, parts: new Map([['repeat', [near, far]]]), exploded: [] };
assert(exploration.visibleBounds(near).getSize(new THREE.Vector3()).equals(new THREE.Vector3(1, 2, 1)), 'Hidden descendants enlarged a component frame');
const camera = new THREE.PerspectiveCamera(36, 1.5, .03, 250); camera.position.set(0, 7, 16); camera.lookAt(0, 0, 0); camera.updateMatrixWorld(true);
const projected = exploration.screenPositions(exploration.componentBounds(record), camera)[0];
assert(projected && Math.abs(projected.x - .5) > .1, 'A repeated-component label was placed between its instances');
assert.equal(projected.instanceCount, 2);

// Check the actual perspective inequalities at portrait/landscape widths and
// near-top/side angles, for off-centre and rotated bounds.
root.rotation.y = .6; root.position.set(30, 4, -17); root.updateWorldMatrix(true, true);
const bounds = exploration.visibleBounds(root);
for (const aspect of [.32, .8, 1.6, 3]) for (const direction of [new THREE.Vector3(1, .7, 1), new THREE.Vector3(.001, 1, .001), new THREE.Vector3(0, .17, 1)]) {
  const fit = exploration.fitPerspectiveBounds(bounds, { direction, fov: 36, aspect });
  camera.aspect = aspect; camera.position.copy(fit.position); camera.lookAt(fit.target); camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
  for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
    const point = new THREE.Vector3(x, y, z).project(camera);
    assert(Math.abs(point.x) < .99 && Math.abs(point.y) < .99 && point.z > -1 && point.z < 1, `Visible geometry clipped at aspect ${aspect}`);
  }
}
viewer.dispose();
console.log('PASS exploration: actual selected-assembly geometry, isolation/technology visibility, production restore order, phase composition, stale-state resets, visible bounds, duplicate-instance tags and 12 perspective fits');
