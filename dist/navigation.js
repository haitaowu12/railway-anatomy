// Navigation describes containment separately from cross-system interfaces.
export const NAVIGATION_GROUPS = [
  {label:'Places & fleet', ids:['station','vehicle','depot','operations']},
  {label:'Systems across the railway', ids:['track','power','control','communications']}
];

export const VIEW_GROUPS = {
  control:[{label:'Functions & architecture',views:['control','cbtc-network','signalling','etcs']},{label:'Shared detection & routes',views:['interlocking','train-detection']},{label:'Supplier example',views:['seltrac']}],
  power:[{label:'Supply & collection',views:['system','electrification','guideway']},{label:'Substation assemblies',views:['substation','power-transformer','power-rectifier','power-switchgear']}],
  communications:[{label:'Architecture',views:['communications-overview','communications-network']},{label:'Services & equipment',views:['communications-scada','communications-telephony','communications-passenger','communications-security']},{label:'Vehicle interface',views:['communications']}],
  operations:[{label:'Equipment & locations',views:['operations-centre','occ-workplace','occ-equipment']},{label:'Information & dependencies',views:['occ-supervision','dependencies']}],
  depot:[{label:'Site & servicing',views:['depot-overview','depot-yard','depot-wash','depot-utilities']},{label:'Workshops & equipment',views:['depot-maintenance','depot-workshop','depot-components','depot-support']},{label:'Protection & assessment',views:['depot-protection','depot-condition','depot-testing']}],
  station:[{label:'Passenger areas',views:['station','platform-interface','accessible-journey']},{label:'Station plant & services',views:['station-plant','ventilation-unit','tunnel-ventilation','station-networks','fire-systems']}],
};

export const VIEW_PARENTS = {
  electrification:'system',adhesion:'bogie','infrastructure-care':'track-support',dependencies:'occ-equipment','accessible-journey':'station','change-evidence':'depot-testing',
  'platform-interface':'station','station-plant':'station','tunnel-ventilation':'station',
  'ventilation-unit':'station-plant','station-networks':'station','fire-systems':'station',
  bogie:'vehicle',lim:'bogie',services:'vehicle',
  'depot-yard':'depot-overview','depot-maintenance':'depot-overview',
  'depot-workshop':'depot-maintenance','depot-wash':'depot-overview',
  'depot-protection':'depot-maintenance','depot-utilities':'depot-overview','depot-support':'depot-overview',
  'depot-condition':'depot-overview','depot-components':'depot-maintenance','depot-testing':'depot-maintenance',
  'occ-supervision':'operations-centre','occ-incident':'operations-centre','occ-equipment':'operations-centre','occ-workplace':'operations-centre',
  'rail-fastening':'track-support','switch-drive':'turnout',crossing:'turnout',
  substation:'system',interlocking:'control','train-detection':'control'
};
Object.assign(VIEW_PARENTS,{'power-transformer':'substation','power-rectifier':'substation','power-switchgear':'substation','communications-network':'communications-overview','communications-scada':'communications-overview','communications-telephony':'communications-overview','communications-passenger':'communications-overview','communications-security':'communications-overview'});

export function domainForView(view, domains, preferred) {
  return domains.find(d=>d.id===preferred&&d.views.includes(view)) || domains.find(d=>d.views.includes(view));
}

export function viewTrail(view, views) {
  const chain=[],seen=new Set();
  for(let id=view;id&&views[id]&&!seen.has(id);id=VIEW_PARENTS[id]){chain.unshift(id);seen.add(id);}
  return chain;
}

export function routeState(state) {
  return {page:state.page,domain:state.domain,view:state.view,component:state.component,variant:state.variant,
    technology:{...state.technology},electrification:state.electrification,platformEdge:state.platformEdge||'open',platformSensor:state.platformSensor||'lidar',presentation:state.presentation,processId:state.processId,processStep:state.processStep,roleId:state.roleId,mode:state.mode,scenario:state.scenario,sink:state.sink,
    cutaway:state.cutaway,exploded:state.exploded,explodeScope:state.explodeScope||'all',playing:false,labels:state.labels,labelMode:state.labelMode||(state.labels===false?'off':'nearby'),lesson:state.lesson,
    instanceId:state.instanceId||null,functionalPath:state.functionalPath||null,allInstances:Boolean(state.allInstances),workspace:state.workspace||null,studyId:state.studyId||null};
}

export const PROPULSION_EFFECTS = {
  lim:'LIM primary and passive reaction rail are shown. The wheels support and guide the vehicle.',
  rotary:'Rotary motors and axle gearboxes replace the LIM. The passive reaction rail is removed.'
};
export const CONTROL_EFFECTS = {
  loop:'An insulated track loop and undercar pickup carry the illustrated control messages.',
  radio:'Wayside radios and an onboard antenna replace the inductive data-loop path.',
  fixed:'Lineside signals and detected track sections show the conventional fixed-block arrangement.',
  etcs1:'Balises and a lineside electronic unit show the Level 1 information path.',
  etcs2:'A radio block centre, train radio and balise references show the Level 2 information path.'
};

