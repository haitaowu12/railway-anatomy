// Comparisons belong to the model in focus. Stored vehicle choices remain
// independent, but their controls do not follow the visitor into other systems.
export const COMPARISON_LABELS = {
  electrification:'Complete electrification arrangement',adhesion:'Wheel–rail response','infrastructure-care':'Infrastructure work and evidence',dependencies:'Shared dependency or restoration state','accessible-journey':'Passenger route and boarding interface','change-evidence':'Configuration and evidence state',
  railway:'Trace a railway connection',
  'track-support':'Track construction',
  'rail-fastening':'Rail fastening arrangement',
  turnout:'Track connection and route',
  'switch-drive':'Position indication',
  crossing:'Crossing geometry',
  'cbtc-network':'Control responsibilities',
  signalling:'Track-section state',
  etcs:'ETCS information architecture',
  seltrac:'SelTrac architecture example',
  interlocking:'Route conditions',
  'train-detection':'Detection or reference technology',
  station:'Station area in focus',
  'station-plant':'Plant system',
  'tunnel-ventilation':'Ventilation objective',
  'ventilation-unit':'Air-system equipment',
  'station-networks':'Supervisory system',
  'fire-systems':'Fire and life-safety function',
  'platform-interface':'Explore this interface',
  'operations-centre':'Equipment in focus',
  'occ-supervision':'System under supervision',
  'occ-incident':'Event coordination state',
  'occ-equipment':'Equipment arrangement',
  'occ-workplace':'Console equipment in focus',
  'depot-overview':'Depot activity',
  'depot-yard':'Yard movement and handover',
  'depot-maintenance':'Maintenance equipment',
  'depot-workshop':'Wheel and bogie work',
  'depot-wash':'Washing arrangement',
  'depot-utilities':'Facility service',
  'depot-support':'Work and material flow',
  'depot-protection':'Protection boundary',
  'depot-condition':'Condition assessment',
  'depot-components':'Component maintenance',
  'depot-testing':'Functional check',
};

export function technologyControlsFor(view) {
  return {
    propulsion:['vehicle','bogie','guideway'].includes(view),
    control:view==='control',
    electrification:['system','substation','guideway','vehicle','bogie','electrification'].includes(view),
  };
}

export function comparisonLabel(view, hasVariants, electrical) {
  return COMPARISON_LABELS[view] || (hasVariants?'Arrangement in focus':electrical?'Energy condition':'System behaviour');
}

export function animationFor(view, variant, component) {
  return view?.componentAnimations?.[component] || view?.variants?.find(v=>v.id===variant)?.animation || view?.animation || null;
}
export function canAnimate(view, variant, component) {
  if(view?.componentAnimations?.[component])return true;
  return view?.variants?.find(v=>v.id===variant)?.motion ?? view?.motion ?? Boolean(animationFor(view,variant,component));
}
