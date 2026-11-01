#!/usr/bin/env node
import {createMechanicalDetails} from '../dist/mechanical-details.js';
import {createEquipmentDetails} from '../dist/equipment-details.js';
const detailFactories={createMechanicalDetails,createEquipmentDetails};
import {normalizePlatformState,platformForComponent} from '../dist/platform-config.js';
import * as electrificationHelpers from '../dist/electrification.js';
import {CONTROL_INTERFACE_CONCEPTS,CONTROL_DOMAINS,getInterfaceContext} from '../dist/control-interfaces-data.js';
import {representationFor} from '../dist/representation-guidance.js';
/**
 * Headless scene/content contract check using Three.js and the actual shared
 * primitive functions from viewer.js. No DOM, renderer, browser or package
 * installation is needed. This does not replace visual presentation review.
 * Optional: --navigation-report=/absolute/path/navigation-audit.json
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(repo, 'dist');
const load = file => import(pathToFileURL(path.join(dist, file)).href);
const [THREE, track, signalling, station, operations, platform, network, networkData, occ, catalog, model, { TOURS }] = await Promise.all([
  load('vendor/three.module.js'), load('track-models.js'), load('signalling-models.js'),
  load('station-models.js'), load('operations-models.js'), load('platform-models.js'),
  load('network-model.js'), load('network-data.js'), load('occ-models.js'), load('catalog.js'), load('model.js'), load('tours.js'),
]);
const source = await readFile(path.join(dist, 'viewer.js'), 'utf8');
const appSource = await readFile(path.join(dist, 'app.js'), 'utf8');
const studies = await load('studies-models.js');
const power=await load('electrification-models.js'),comms=await load('communications-models.js');
function between(start, end) {
  const a = source.indexOf(start), b = source.indexOf(end, a + start.length);
  assert(a >= 0 && b > a, `Shared geometry marker changed: ${start}; update this harness`);
  return source.slice(a, b);
}
const colors = between('const C = {', '\nconst VIEW');
const materials = between('  const materials = new Map();', '  const ground = ');
// This range includes the shared primitives and the original base scene builds.
// Using the implementation itself catches missing helpers and actual geometry
// failures instead of passing because a mock silently accepts the wrong call.
const shared = between('  function startModel(', '  function registerAnimator(');
const createHarness = new Function('THREE', 'electrificationHelpers','detailFactories',`
 const {createMechanicalDetails,createEquipmentDetails}=detailFactories;
 const {${Object.keys(electrificationHelpers).join(',')}}=electrificationHelpers;
  ${colors}
  const compatibility = true;
  const scene = new THREE.Scene();
  const models = new Map();
  let building;
  ${materials}
  ${shared}
  function registerAnimator(fn) { building.animators.push(fn); }
  return { models, api: { THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,
    torus,tube,roundedPanel,explode,shell,foot,makeTrack,makeTrain,makePrimary,
    makeBogie,makeSubstation,makePowerTransformer,makePowerRectifier,makePowerSwitchgear,powerTrace,cabinet,registerAnimator } };
`);
const { models, api } = createHarness(THREE,electrificationHelpers,detailFactories);
const failures = [];
let passed = 0;
const check = (name, fn) => {
  try { fn(); passed++; console.log(`PASS ${name}`); }
  catch (error) { failures.push(name); console.error(`FAIL ${name}: ${error.message}`); }
};
const visible = node => {
  for (let p = node; p; p = p.parent) if (!p.visible) return false;
  return true;
};
const variantsFor = view => model.VIEWS[view]?.variants?.map(v => v.id) || ['default'];
function setScene(view, variant, { cutaway = true, phase = 1, scenario = 'nominal', signals = true, platformEdge, platformSensor='lidar', electrification = electrificationHelpers.DEFAULT_ELECTRIFICATION, technology = {propulsion:'lim',control:'loop'} } = {}) {
  const record = models.get(view);
  assert(record, `Missing constructed scene ${view}`);
  for (const candidate of models.values()) candidate.root.visible = candidate === record;
  for (const shell of record.shells) shell.visible = !cutaway;
  for (const e of record.exploded) e.node.position.copy(e.base);
  const platformState=normalizePlatformState({variant,platformEdge,platformSensor});
  const state = { view, variant, phase, scenario, signals, cutaway, technology, electrification, platformEdge:platformState.platformEdge, platformSensor, exploded: 0, mode: 'coasting', receptivity: 'train', selected: null };
  for (const animate of record.animators) animate(state);
  record.root.updateWorldMatrix(true, true);
  return record;
}
const visibleParts = record => [...record.parts].filter(([, nodes]) => nodes.some(visible)).map(([id]) => id);

check('Expanded scenes construct one requested view at a time', () => {
  const registry = [
    [track.TRACK_VIEWS, track.buildTrackView],
    [signalling.SIGNALLING_VIEWS, signalling.buildSignallingView],
    [station.STATION_VIEWS, station.buildStationView],
    [Object.fromEntries(Object.entries(operations.OPERATIONS_VIEWS).filter(([id])=>!occ.OCC_VIEWS[id])), operations.buildOperationsView],
    [occ.OCC_VIEWS, occ.buildOccView],
    [studies.STUDY_CAMERAS, studies.buildStudyView],
    [power.POWER_CAMERAS,power.buildPowerView],
    [comms.COMMUNICATIONS_VIEWS,comms.buildCommunicationsView],
    [platform.PLATFORM_VIEWS, platform.buildPlatformView],
    [network.NETWORK_VIEWS, network.buildNetworkView],
  ];
  for (const [views, build] of registry) for (const id of Object.keys(views)) {
    assert(model.VIEWS[id], `Renderer exposes an unregistered view ${id}`);
    assert(!models.has(id), `Duplicate scene ID ${id}`);
    const count = models.size;
    build(id, api);
    assert.equal(models.size, count + 1, `${id} constructed unrelated scenes`);
    assert(models.has(id), `${id} did not register its scene`);
  }
  assert.deepEqual([...models.keys()].sort(), Object.keys(model.VIEWS).sort(), 'The view registry and renderer disagree');
});

const known = new Set(catalog.CONCEPTS.map(c => c.id));
const availability = {};
check('Every scene variant animates with finite geometry and known component IDs', () => {
  for (const [view, record] of models) {
    assert(record.picks.length > 0, `${view} has no selectable geometry`);
    for (const id of record.parts.keys()) assert(known.has(id), `${view} registers unknown component ${id}`);
    record.root.traverse(node => {
      if (!node.isMesh) return;
      const values = node.geometry.attributes.position?.array;
      assert(values?.length, `${view} has an empty mesh`);
      for (const value of values) assert(Number.isFinite(value), `${view} has a non-finite vertex`);
    });
    availability[view] = {};
    for (const variant of variantsFor(view)) {
      const ids = new Set();
      // Some explanatory skins are intentionally only visible when assembled.
      // The union represents equipment reachable with the exposed cutaway toggle.
      for (const cutaway of [false, true]) for(const propulsion of ['lim','rotary']) for(const control of ['loop','radio']) for(const electrification of electrificationHelpers.ELECTRIFICATION_CHOICES.map(x=>x.id)) for(const platformEdge of ['station','platform-interface'].includes(view)?['open','half-height','full-height']:[undefined]) for(const platformSensor of view==='platform-interface'?['lidar','radar']:['lidar']) {
        const active = setScene(view, variant, { cutaway, electrification, platformEdge, platformSensor, technology:{propulsion,control} });
        visibleParts(active).forEach(id => ids.add(id));
        active.root.traverse(node => {
          if (visible(node)) assert([...node.position.toArray(), ...node.scale.toArray()].every(Number.isFinite), `${view}/${variant} has an invalid pose`);
        });
      }
      availability[view][variant] = [...ids].sort();
    }
  }
});
function available(view, variant, component, target = model.targetFor(component)) {
  return availability[view]?.[variant]?.includes(target) || false;
}
function preferredVariant(view, component) {
  return variantsFor(view).includes(model.variantFor(component)) ? model.variantFor(component) : model.defaultVariant(view);
}
check('Every concept has a reachable physical anchor or an explicit functional interface route', () => {
  const interfaceIds=new Set(CONTROL_INTERFACE_CONCEPTS.map(c=>c.id));
  const start=appSource.indexOf('function selectComponent('),end=appSource.indexOf('function applyLesson(',start);
  assert(start>=0&&end>start,'The actual component-routing implementation must be exercised');
  // Run the real early routing branch. A function gets a functional destination,
  // not a fabricated selectable mesh solely to satisfy a geometry contract.
  const route=new Function('parts','interfaceConceptIds','getInterfaceContext',`
    let state={page:'explore'};const events=[];
    function openInterfaces(context){events.push({kind:'interfaces',context});}
    function showInterfaceConcept(id){events.push({kind:'concept',id});}
    ${appSource.slice(start,end)}
    return id=>{events.length=0;selectComponent(id);return events.slice();};
  `)(new Map(catalog.CONCEPTS.map(c=>[c.id,c])),interfaceIds,getInterfaceContext);
  for(const concept of CONTROL_INTERFACE_CONCEPTS){
    assert(known.has(concept.id),`Unknown interface function ${concept.id}`);
    assert.equal(model.viewFor(concept.id),'station-networks',`${concept.id} lacks its legacy interface destination`);
    assert.equal(representationFor(model.viewFor(concept.id)).equipmentContext,false,`${concept.id} is falsely described as physical equipment`);
    const events=route(concept.id),context=getInterfaceContext(concept.id);
    assert.deepEqual(events,[{kind:'interfaces',context},{kind:'concept',id:concept.id}],`${concept.id} is not rendered and explained on its actual interface route`);
    const domain=CONTROL_DOMAINS.find(d=>d.id===context.domain);
    assert(domain,`${concept.id} points to an unknown functional owner`);
    const specific=CONTROL_DOMAINS.filter(d=>d.components.includes(concept.id));
    if(specific.length)assert(specific.includes(domain),`${concept.id} opens another function's controls`);
  }
  const missing = catalog.CONCEPTS.filter(c => !interfaceIds.has(c.id)&&!available(model.viewFor(c.id), preferredVariant(model.viewFor(c.id), c.id), c.id));
  assert.equal(missing.length, 0, missing.map(c => `${c.id} → ${model.viewFor(c.id)}/${preferredVariant(model.viewFor(c.id), c.id)} (${model.targetFor(c.id)})`).join('; '));
});
check('Every view opens with a reachable default selection', () => {
  const missing = Object.entries(model.VIEWS).filter(([view, config]) => !available(view, model.defaultVariant(view), config.component));
  assert.equal(missing.length, 0, missing.map(([view, config]) => `${view}/${model.defaultVariant(view)} → ${config.component}`).join('; '));
});
check('Railway overlays change visible paths while preserving their physical context', () => {
  const expectedParts = networkData.NETWORK_CONCEPTS.map(c => c.id).sort();
  const shapes = new Set();
  let physicalBaseline;
  for (const variant of ['movement', 'power', 'information']) {
    const record = setScene('railway', variant, {cutaway:false, phase:0});
    assert.deepEqual(visibleParts(record).sort(), expectedParts, `${variant} loses a selectable railway area`);
    const layers = record.root.children.filter(node => node.userData.networkLayer);
    assert.deepEqual(layers.filter(visible).map(node => node.userData.networkLayer), [variant], `${variant} mixes relationship overlays`);
    const hash = createHash('sha256');
    let renderedPaths = 0;
    // Inspect actual render geometry and world transforms, not the layer's
    // name: relabelling an identical path cannot satisfy this regression.
    layers.filter(visible).forEach(layer => layer.traverse(node => {
      if (!visible(node) || (!node.isMesh && !node.isLineSegments)) return;
      const positions = node.geometry.attributes.position;
      assert(positions?.count, `${variant} contains an empty path`);
      for (const value of positions.array) assert(Number.isFinite(value), `${variant} contains a non-finite path`);
      hash.update(Buffer.from(positions.array.buffer, positions.array.byteOffset, positions.array.byteLength));
      hash.update(JSON.stringify(node.matrixWorld.elements));
      renderedPaths++;
    }));
    assert(renderedPaths > 0, `${variant} has no visible connection geometry`);
    shapes.add(hash.digest('hex'));
    const physical = record.picks.filter(visible).map(node => [...node.matrixWorld.elements]);
    if (physicalBaseline) assert.deepEqual(physical, physicalBaseline, `${variant} unexpectedly changes the stationary railway`);
    else physicalBaseline = physical;
  }
  assert.equal(shapes.size, 3, 'Movement, power and information must have different visible path geometries');
});
check('Every railway area drills down to reachable equipment in its destination', () => {
  const destinations = networkData.NETWORK_DESTINATIONS;
  const areas = networkData.NETWORK_CONCEPTS.filter(c => c.id !== 'network-overview');
  assert.deepEqual(Object.keys(destinations).sort(), areas.map(c => c.id).sort(), 'A selectable railway area lacks its drilldown');
  for (const area of areas) {
    const destination = destinations[area.id], config = model.VIEWS[destination.view];
    assert(config, `${area.id} points to an unknown view`);
    const domain = model.DOMAINS.find(d => d.id === destination.domain);
    assert(domain?.views.includes(destination.view), `${area.id} points to a view outside its destination area`);
    const variant = destination.variant || model.defaultVariant(destination.view);
    assert(variantsFor(destination.view).includes(variant), `${area.id} points to an unknown variant`);
    const record = setScene(destination.view, variant, {cutaway:model.cutawayFor(destination.view)});
    assert((record.parts.get(model.targetFor(destination.component)) || []).some(visible), `${area.id} opens equipment absent from its destination`);
  }
});
check('Every lesson action opens its selected component in a real variant', () => {
  const missing = [];
  for (const lesson of TOURS) {
    const action = lesson.action, view = action.view || lesson.view;
    const variant = action.variant || model.defaultVariant(view), component = action.component || lesson.component;
    const record = setScene(view, variant, { cutaway: action.cutaway ?? model.cutawayFor(view), scenario: action.scenario || 'nominal',...platformForComponent(component,{variant}),technology:action.technology||{propulsion:'lim',control:'radio'} });
    if (!(record.parts.get(model.targetFor(component)) || []).some(visible)) missing.push(`${lesson.id} → ${view}/${variant} (${component})`);
  }
  assert.equal(missing.length, 0, missing.join('; '));
});
check('Incomplete route proof never enables the custom movement-permission trace', () => {
  for (const variant of ['proved', 'unproved']) {
    const record = setScene('interlocking', variant);
    const paths = record.root.children.filter(node => node.name === 'movement-authority-information-path');
    assert(paths.length, 'Interlocking permission trace is missing');
    for (const node of paths) assert.equal(visible(node), variant === 'proved', `${variant} has the wrong permission cue`);
  }
});
check('Architecture overlays do not mix incompatible variants', () => {
  const only = (view, variants, component, selected) => {
    for (const variant of variants) {
      const record = setScene(view, variant);
      assert.equal((record.parts.get(component) || []).some(visible), variant === selected, `${view}/${variant} exposes the wrong ${component} arrangement`);
    }
  };
  only('etcs', ['level-1', 'level-2'], 'rbc', 'level-2');
  only('etcs', ['level-1', 'level-2'], 'leu', 'level-1');
  only('seltrac', ['loop', 'radio', 'g9'], 'seltrac-loop', 'loop');
  only('seltrac', ['loop', 'radio', 'g9'], 'seltrac-g9', 'g9');
});

check('Independent technology selections change actual geometry',()=>{
  const parts=(view,tech)=>visibleParts(setScene(view,'default',{technology:tech}));
  const lim=parts('bogie',{propulsion:'lim',control:'loop'});
  assert(lim.includes('lim-primary')&&!lim.includes('rotary-traction-motor'));
  assert(lim.includes('loop-pickup'));
  const rotaryLoop=parts('bogie',{propulsion:'rotary',control:'loop'});
  assert(rotaryLoop.includes('rotary-traction-motor')&&rotaryLoop.includes('traction-gearbox'));
  assert(!rotaryLoop.includes('lim-primary')&&!rotaryLoop.includes('reaction-rail'));
  assert(rotaryLoop.includes('loop-pickup'));
  const radioLim=parts('guideway',{propulsion:'lim',control:'radio'});
  assert(radioLim.includes('reaction-rail'));assert(!radioLim.includes('seltrac-loop'));assert(!radioLim.includes('loop-interface'));
  const loopLim=parts('guideway',{propulsion:'lim',control:'loop'});assert(loopLim.includes('seltrac-loop')&&loopLim.includes('loop-interface'));
  const loopComms=parts('communications',{propulsion:'lim',control:'loop'});assert(!loopComms.includes('train-radio')&&!loopComms.includes('wayside-radio'));assert(loopComms.includes('radio-antenna')&&loopComms.includes('passenger-info'));
  const radioComms=parts('communications',{propulsion:'rotary',control:'radio'});assert(radioComms.includes('train-radio')&&radioComms.includes('wayside-radio'));assert(!radioComms.includes('loop-pickup'));
});

check('Maintenance apertures remain open and a removed bogie matches its vehicle position',()=>{
  const record=models.get('depot-maintenance');record.root.updateWorldMatrix(true,true);
  for(const [variant,cx] of [['inspection',0],['lifting',-2.945],['wheel-lathe',-3]]){
    const node=record.root.getObjectByName('alternative-'+variant);
    const floor=node.getObjectByName('open-service-floor');assert(floor);
    const origin=new THREE.Vector3(cx,5,0).applyMatrix4(record.root.matrixWorld);
    assert.equal(new THREE.Raycaster(origin,new THREE.Vector3(0,-1,0)).intersectObject(floor,true).length,0,variant+' covers its service aperture');
    const solid=new THREE.Vector3(9,5,4).applyMatrix4(record.root.matrixWorld);
    assert(new THREE.Raycaster(solid,new THREE.Vector3(0,-1,0)).intersectObject(floor,true).length>0,variant+' lacks surrounding floor');
  }
  const lifting=record.root.getObjectByName('alternative-lifting');
  const removed=lifting.getObjectByName('lowered-vehicle-bogie');
  const body=lifting.getObjectByName('supported-vehicle-one-bogie-removed');
  const drop=lifting.getObjectByName('aligned-bogie-drop-aperture');
  assert(removed&&body&&drop,'Bogie-drop mechanism anchors missing');
  assert.equal(removed.userData.removedFromVehicleX,body.userData.removedBogieX);
  assert.equal(drop.userData.vehicleBogieX,body.userData.removedBogieX);
  const attached=[];lifting.traverse(n=>{if(n.name==='attached-vehicle-bogie')attached.push(n);});
  assert.equal(attached.length,1,'Removing one bogie must leave only one attached bogie');
  assert.notEqual(attached[0].userData.vehicleBogieX,removed.userData.removedFromVehicleX);
});

const reportArgument = process.argv.find(argument => argument.startsWith('--navigation-report='));
if (reportArgument) {
  const proposedTargets = {
    'moving-block': 'movement-authority', 'braking-curve': 'atp',
    'train-integrity': 'train-control', 'etcs-level-1': 'leu',
    'etcs-level-2': 'rbc', 'station-hvac': 'hvac-air-handler',
  };
  const proposedViews = { 'station-radio': 'station-networks' };
  const proposedVariants = { 'track-baseplate': 'direct', 'station-radio': 'station', 'smoke-control': 'smoke-objective' };
  const candidatesFor = target => Object.fromEntries(Object.entries(availability).flatMap(([view, variants]) => {
    const matches = Object.entries(variants).filter(([, ids]) => ids.includes(target)).map(([variant]) => variant);
    return matches.length ? [[view, matches]] : [];
  }));
  const primary = {}, contexts = {}, contextVariants = {}, removedContexts = {};
  for (const concept of catalog.CONCEPTS) {
    const id = concept.id, target = proposedTargets[id] || model.targetFor(id);
    const candidates = candidatesFor(target), view = proposedViews[id] || model.viewFor(id);
    const variant = proposedVariants[id] || preferredVariant(view, id);
    primary[id] = { target, view, variant, reachable: available(view, variant, id, target), available: candidates };
    if (model.PART_CONTEXTS[id]) {
      contexts[id] = model.PART_CONTEXTS[id].filter(candidate => candidates[candidate]);
      contextVariants[id] = Object.fromEntries(contexts[id].map(candidate => [candidate, candidates[candidate]]));
      removedContexts[id] = model.PART_CONTEXTS[id].filter(candidate => !candidates[candidate]);
    }
  }
  const report = {
    note: 'Generated from actual model geometry. Proposed aliases are conceptual anchors, not claims that these are the same physical equipment. Context variants list where the target is visible; choose one before preserving selection.',
    proposedTargets, proposedViews, proposedVariants, primary,
    suggestedValidContexts: contexts, contextVariants, removedContexts, availability,
  };
  await writeFile(reportArgument.slice('--navigation-report='.length), JSON.stringify(report, null, 2) + '\n');
  console.log('Wrote navigation availability report.');
}
export const GEOMETRY_CHECK_RESULT = { passed, failures };
console.log(`\n${passed} geometry checks passed; ${failures.length} failed.`);
if (failures.length) process.exitCode = 1;


