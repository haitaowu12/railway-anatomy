// Choose a representation for the learning question, independently of whether
// a legacy route happens to have a Three.js scene. Equipment context is optional
// on logical/process pages; it is never the mechanism of a human decision.
const entries = Object.create(null);
const set = (views, kind, label, reason, equipmentContext = true, motionKind = 'static') => {
  for (const view of views.split(' ')) entries[view] = {kind,label,reason,equipmentContext,motionKind};
};

set('system substation guideway vehicle track-support rail-fastening depot-overview depot-maintenance depot-workshop depot-utilities depot-support railway station station-plant fire-systems power-switchgear communications-network', 'equipment', 'Equipment and spatial context', 'Inspect physical containment, supports, working sections and interfaces. A static part is studied by section, trace or comparison rather than invented motion.');
set('bogie lim turnout switch-drive crossing train-detection ventilation-unit platform-interface adhesion depot-wash depot-components services', 'equipment', 'Mechanical or physical illustration', 'Motion demonstrates an authored mechanism or physical relationship. It does not establish an operating sequence, rated performance or permission to operate.', true, 'mechanism');
set('control communications signalling cbtc-network etcs seltrac interlocking station-networks communications-overview occ-supervision communications-scada', 'connections', 'Responsibilities and interfaces', 'A diagram separates the producer, transport, decision owner and returned evidence. Physical equipment is available as context without making a logical function a universal hardware box.', true, 'information');
set('communications-telephony communications-passenger communications-security operations-centre occ-workplace occ-equipment', 'equipment', 'Hardware and its information interfaces', 'Inspect the physical assembly, then use information paths for messages, availability and evidence. Electronics and records do not need fictitious moving parts.', true, 'information');
set('tunnel-ventilation', 'equipment', 'Ventilation equipment and air paths', 'Fan, damper and duct anatomy is physical context. Objectives and control responsibilities are separate from a calculated smoke or airflow result.');
set('depot-yard', 'equipment', 'Depot entry and spatial boundary', 'The yard layout locates tracks, access and facilities. A spatial model does not authorize a movement or perform a handover.');
set('depot-condition', 'equipment', 'Measurement arrangement', 'The spatial view locates the sensor and observed asset. Identity, sampling conditions, timing and interpretation are separate evidence questions.', true, 'information');
set('depot-testing', 'evidence', 'Test conditions and evidence', 'A check needs an identified asset, declared conditions, observations and an assessment. An animated vehicle or indicator alone cannot demonstrate acceptance.', true);
set('depot-protection infrastructure-care occ-incident', 'process', 'People, conditions and decisions', 'Use explicit roles, prerequisites, records and decision boundaries. An arrangement of 3D objects cannot prove protection, completion or authority.', true);
set('change-evidence', 'evidence', 'Configuration and evidence', 'An installed item, its identity, test evidence and reviewed release are different records and claims. Their relationship belongs in a traceable evidence view.', false);
set('dependencies', 'dependencies', 'Service dependencies', 'Show the dependency graph and observable consequence. Loss of a network, supply, identity or record is not a mechanical teardown.', false);
set('accessible-journey', 'journey', 'Passenger journey and assistance', 'Use an ordered journey with route availability, boarding interfaces and assistance needs. The station model supplies spatial context, not a universal accessible route.', true);
set('electrification', 'connections', 'Supply and return architecture', 'Follow the complete supply, collection, conversion and return paths in a diagram; compare physical arrangements only within the selected architecture.', true);
set('power-transformer power-rectifier', 'connections', 'Electrical principle', 'The time-varying electrical relationship belongs in the circuit diagram. The core, windings and semiconductor hardware remain physically stationary.', true, 'electrical');
set('infrastructure-assets', 'equipment', 'Structures and drainage anatomy', 'A physical section retains bridge load-transfer interfaces and an open culvert passage. Inspection evidence, work boundaries and release decisions belong in the separate process.', true);
entries['occ-equipment']={kind:'equipment',label:'Technical equipment anatomy',reason:'Inspect representative computing, network, storage and power hardware. The optional dependency diagram names functions without inferring service availability.',equipmentContext:true,motionKind:'static'};
for(const id of ['control','communications','signalling','cbtc-network','etcs','seltrac','occ-supervision','station-networks','communications-scada'])entries[id].equipmentContext=false;

const overrides = {
  'station/passenger':{motionKind:'mechanism'},
  'station-plant/air':{motionKind:'mechanism'},
  'station-plant/water':{motionKind:'mechanism'},
  'fire-systems/water':{motionKind:'mechanism'},
  'tunnel-ventilation/smoke-objective':{kind:'connections',label:'Ventilation objective and control boundary',reason:'An emergency ventilation objective depends on the railway, zone and incident. Show the responsible controller and optional supervisory interfaces without an automatic fan/damper recipe.'},
  'depot-yard/handover':{kind:'process',label:'Yard handover'},
  'depot-yard/dispatch':{kind:'process',label:'Dispatch readiness'},
  'depot-support/planning':{kind:'process',label:'Planning and release evidence'},
  'operations-centre/incident':{kind:'process',label:'Event coordination'},
  'operations-centre/handover':{kind:'process',label:'Operational handover'},
  'occ-workplace/handover':{kind:'process',label:'Workplace handover'},
  'occ-equipment/display-loss':{kind:'connections',label:'Display dependency'},
  'occ-equipment/alternate':{kind:'connections',label:'Alternative workplace dependency'},
  'depot-workshop/lathe':{motionKind:'mechanism'},
  'depot-workshop/ndt':{motionKind:'mechanism'},
  'depot-condition/roll-by':{motionKind:'mechanism'},
  'depot-components/traction':{motionKind:'information'},
  'depot-maintenance/lifting':{motionKind:'mechanism'},
  'depot-maintenance/jacks':{motionKind:'mechanism'},
  'depot-maintenance/wheel-lathe':{motionKind:'mechanism'},
  'depot-wash/recovery':{motionKind:'static'},
  'communications-telephony/operational-radio':{motionKind:'static'},
  'communications-security/video':{motionKind:'static'},
  'communications-scada/stale':{motionKind:'static'},
};

export function representationFor(view, variant='default') {
  const base=entries[view] || {kind:'equipment',label:'Equipment anatomy',reason:'Inspect the selected physical arrangement and its stated limits.',equipmentContext:true,motionKind:'static'};
  const result={...base,...overrides[`${view}/${variant}`]};
  if(['process','journey','dependencies','evidence'].includes(result.kind))result.motionKind='static';
  return result;
}

export function representationInventory(views) {
  return Object.entries(views).flatMap(([view,definition])=>(definition.variants?.length?definition.variants:[{id:'default'}]).map(option=>({
    view,variant:option.id,title:definition.label,variantLabel:option.label||option.id,
    ...representationFor(view,option.id),
    animation:Boolean(option.motion??definition.motion??(option.animation||definition.animation)),
    componentAnimations:Object.keys(definition.componentAnimations||{}),
    guide:(option.animation||definition.animation)?.label||null,
    classified:Object.hasOwn(entries,view),
  })));
}
