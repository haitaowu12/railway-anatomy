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
  'platform-interface':'Platform protection arrangement',
  'operations-centre':'Control-centre activity',
  'occ-supervision':'System under supervision',
  'occ-incident':'Event coordination state',
  'occ-equipment':'Information-service availability',
  'occ-workplace':'Operator task and information',
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
  };
}

export function comparisonLabel(view, hasVariants, electrical) {
  return COMPARISON_LABELS[view] || (hasVariants?'Arrangement in focus':electrical?'Energy condition':'System behaviour');
}

export function animationFor(view, variant) {
  return view?.variants?.find(v=>v.id===variant)?.animation || view?.animation || null;
}
export function canAnimate(view, variant) {
  return view?.variants?.find(v=>v.id===variant)?.motion ?? view?.motion ?? true;
}

// The label layout uses the measured DOM dimensions, not a character-count
// estimate. A clear band is reserved for the title and camera controls.
export function placeModelLabels(points, {width,height,top=100,bottom=60,limit=6,gap=12}) {
  const placed=[];
  for(const point of points) {
    if(placed.length>=limit)break;
    const w=Math.min(point.width,width-24),h=point.height;
    if(w<=0||h<=0||height-top-bottom<h)continue;
    const px=point.x*width,py=point.y*height,side=point.x<.5?-1:1;
    const gutter=side<0?12+w/2:width-12-w/2;
    const candidates=[
      [px+side*(w/2+28),py-30],[px+side*(w/2+28),py+44],
      [gutter,py-42],[gutter,py+48],[gutter,py-90],[gutter,py+96],
      [px,py-76],[px,py+96],
      [width-gutter,py-42],[width-gutter,py+48],
    ];
    for(const [cx,cy] of candidates) {
      const x=Math.max(12+w/2,Math.min(width-12-w/2,cx));
      const y=Math.max(top+h,Math.min(height-bottom,cy));
      const rect={left:x-w/2,top:y-h,right:x+w/2,bottom:y};
      if(placed.some(p=>!(rect.right+gap<p.rect.left||rect.left-gap>p.rect.right||rect.bottom+gap<p.rect.top||rect.top-gap>p.rect.bottom)))continue;
      placed.push({...point,x,y,width:w,height:h,anchorX:px,anchorY:py,rect});break;
    }
  }
  return placed;
}
