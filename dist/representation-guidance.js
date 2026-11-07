// Choose a representation for the learning question, independently of whether
// a legacy route happens to have a Three.js scene. Equipment context is optional
// on logical/process pages; it is never the mechanism of a human decision.
const entries = Object.create(null);
const set = (views, kind, label, reason, equipmentContext = true, motionKind = 'static') => {
  for (const view of views.split(' ')) entries[view] = {kind,label,reason,equipmentContext,motionKind};
};

set('system substation guideway vehicle track-support rail-fastening depot-overview depot-maintenance depot-workshop depot-utilities depot-support railway station station-plant fire-systems power-switchgear communications-network', 'equipment', 'Equipment and spatial context', 'Inspect the enclosure, supports, working parts and connections. Open sections and follow paths to see how fixed components fit together.');
set('bogie lim turnout switch-drive crossing train-detection ventilation-unit platform-interface adhesion depot-wash depot-components services', 'equipment', 'Mechanical or physical illustration', 'Follow the moving parts and compare their motion with the parts that stay fixed. Timing and proportions are simplified for inspection.', true, 'mechanism');
set('control communications signalling cbtc-network etcs seltrac interlocking station-networks communications-overview occ-supervision communications-scada', 'connections', 'Responsibilities and interfaces', 'Follow information from its source through the communication path to the function that uses it. Returned feedback shows what the receiving system reports.', true, 'information');
set('communications-telephony communications-passenger communications-security operations-centre occ-workplace occ-equipment', 'equipment', 'Hardware and its information interfaces', 'Inspect the hardware, then follow its information paths to see how messages, status and records reach the people or systems that use them.', true, 'information');
set('tunnel-ventilation', 'equipment', 'Ventilation equipment and air paths', 'Inspect the fan, damper and duct. The control view explains who requests ventilation and which system carries it out.');
set('depot-yard', 'equipment', 'Depot entry and spatial boundary', 'Locate the yard tracks, access points and facilities, then follow the separate handover or dispatch view.');
set('depot-condition', 'equipment', 'Measurement arrangement', 'Locate the sensor and inspected asset. Read the item identity, measurement conditions and time alongside the result.', true, 'information');
set('depot-testing', 'evidence', 'Test conditions and evidence', 'Connect the tested asset and test conditions with the observations and acceptance criteria.', true);
set('depot-protection infrastructure-care occ-incident', 'process', 'People, conditions and decisions', 'Follow the responsible people, the information they need, and the records and decisions they pass on.', true);
set('change-evidence', 'evidence', 'Configuration and evidence', 'Compare the installed item with its configuration record, matching test evidence and release decision.', false);
set('dependencies', 'dependencies', 'Service dependencies', 'Follow the connections to see which functions depend on a supply, network, application or record.', false);
set('accessible-journey', 'journey', 'Passenger journey and assistance', 'Follow a passenger journey through route availability, boarding and assistance. The station view shows where each part of the journey takes place.', true);
set('electrification', 'connections', 'Supply and return architecture', 'Follow the complete supply, collection, conversion and return paths in a diagram; compare physical arrangements only within the selected architecture.', true);
set('power-transformer power-rectifier', 'connections', 'Electrical principle', 'The time-varying electrical relationship belongs in the circuit diagram. The core, windings and semiconductor hardware remain physically stationary.', true, 'electrical');
set('infrastructure-assets', 'equipment', 'Structures and drainage anatomy', 'Inspect the bridge load path and the open water passage through a culvert. Follow Infrastructure care for inspection, work and handback.', true);
entries['occ-equipment']={kind:'equipment',label:'Technical equipment anatomy',reason:'Inspect computing, network, storage and power hardware. Use the dependency diagram to connect those devices with the services they support.',equipmentContext:true,motionKind:'static'};
for(const id of ['control','communications','signalling','cbtc-network','etcs','seltrac','occ-supervision','station-networks','communications-scada'])entries[id].equipmentContext=false;

const overrides = {
  'crossing/diamond':{label:'Diamond crossing layout',motionKind:'static'},
  'station/passenger':{motionKind:'mechanism'},
  'station-plant/air':{motionKind:'mechanism'},
  'station-plant/water':{motionKind:'mechanism'},
  'fire-systems/water':{motionKind:'mechanism'},
  'tunnel-ventilation/smoke-objective':{kind:'connections',label:'Ventilation objective and control boundary',reason:'An emergency ventilation objective depends on the tunnel zone and incident. Follow the responsible controller and its interfaces with supervision and local equipment.'},
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
  const base=entries[view] || {kind:'equipment',label:'Equipment anatomy',reason:'Inspect the selected arrangement, working parts and connections.',equipmentContext:true,motionKind:'static'};
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
