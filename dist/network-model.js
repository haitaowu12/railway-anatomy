/* Original schematic railway. The stable physical scene is shared by three
 * relationship overlays. Routes, circuits and links are explanatory, not a
 * surveyed layout, signalling design or quantitative operating simulation. */
export const NETWORK_VIEWS = {
  railway: {camera: [45, 47, 55], target: [0, .6, 1.2], distance: 83}
};

export function buildNetworkView(id, api) {
  if (!Object.hasOwn(NETWORK_VIEWS, id)) return null;
  const {THREE, M, mat, startModel, group, part, box, cylinder, roundedPanel, tube, shell, explode, registerAnimator} = api;
  const root = startModel(id);
  const palette = {
    land: mat(0xd8ded7, .95, 0), roadbed: mat(0x697778, .95, 0), rail: mat(0xa9b3af, .45, .4),
    platform: mat(0xe5e1d4, .9, 0), roof: mat(0xf2f0e7, .85, .05), building: mat(0x6e8990, .8, .1),
    glass: mat(0x244b5a, .45, .2), edge: mat(0xb9a46a, .85, 0), concrete: mat(0xaeb9b3, .95, 0),
    teal: mat(0x228c83, .7, .1), steel: mat(0x3c5058, .65, .2), amber: mat(0xc58d32, .7, .1)
  };
  const layers = Object.fromEntries(['movement','power','information'].map(name => {
    const node = group(root, `network-layer-${name}`); node.userData.networkLayer = name;
    node.visible = name === 'movement'; return [name, node];
  }));
  const movingMarks = [];
  const foundation = part(root, 'network-overview');
  const base = box(foundation, [63, .32, 33], palette.land, [0,-.3,1]); base.renderOrder=-110;
  // A restrained diagram board: the areas and tracks, rather than decorative
  // landscape, carry the hierarchy at this viewing scale.
  box(foundation,[63,.08,.12],palette.concrete,[0,-.1,-15.5]);
  box(foundation,[63,.08,.12],palette.concrete,[0,-.1,17.5]);

  function line(parent, points, material, radius=.065) {
    return tube(parent, points, radius, material, {segments:Math.max(8,points.length*6)});
  }
  function straightTrack(parent, length, x, z) {
    box(parent,[length,.12,1.33],palette.roadbed,[x,.015,z]);
    for(let t=-length/2+.25;t<length/2;t+=.83)box(parent,[.12,.06,1.1],palette.concrete,[x+t,.1,z]);
    for(const dz of [-.34,.34])box(parent,[length,.07,.065],palette.rail,[x,.16,z+dz]);
  }
  function curveTrack(parent, points) {
    const route=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.12);
    for(let i=0;i<24;i++) {
      const a=route.getPoint(i/24), b=route.getPoint((i+1)/24), middle=a.clone().add(b).multiplyScalar(.5);
      box(parent,[a.distanceTo(b)+.06,.11,1.1],palette.roadbed,[middle.x,.015,middle.z],[0,-Math.atan2(b.z-a.z,b.x-a.x),0]);
    }
    for(const dz of [-.34,.34])line(parent,points.map(([x,y,z])=>[x,y,z+dz]),palette.rail,.045);
  }
  function buffers(parent,x,z) {
    for(const dz of [-.45,.45])box(parent,[.14,.7,.13],palette.steel,[x,.42,z+dz]);
    box(parent,[.14,.17,1.18],palette.edge,[x,.7,z]);
  }
  function train(parent, at, length=5.7) {
    const vehicle=group(parent,'overview-train-silhouette',at);
    roundedPanel(vehicle,length,1.0,1.13,palette.roof,[0,.96,0],.18);
    box(vehicle,[length,.15,1.15],palette.steel,[0,.41,0]);
    for(const side of [-1,1]) {
      box(vehicle,[length-.24,.1,.025],palette.teal,[0,.73,side*.575]);
      for(let x=-length/2+.52;x<length/2-.2;x+=.65)box(vehicle,[.43,.34,.025],palette.glass,[x,1.12,side*.578]);
      for(const x of [-length*.3,length*.3]) {
        cylinder(vehicle,.2,.08,palette.steel,[x,.31,side*.49],[Math.PI/2,0,0],8);
      }
    }
    for(const end of [-1,1])box(vehicle,[.025,.4,.82],palette.glass,[end*(length/2-.015),1.09,0]);
    return vehicle;
  }
  function station(x) {
    const stop=part(root,'network-station',[x,0,-3.5]);
    stop.userData.labelAnchor=[0,2.2,0];
    box(stop,[9,.37,1.6],palette.platform,[0,.22,0]);
    for(const z of [-.72,.72])box(stop,[8.8,.025,.09],palette.edge,[0,.42,z]);
    for(const dx of [-3,0,3])box(stop,[.09,1.65,.1],palette.steel,[dx,1.25,0]);
    const canopy=group(stop,'station-canopy');
    box(canopy,[8.8,.13,1.8],palette.roof,[0,2.1,0]);
    shell(canopy);explode(canopy,[0,1.7,0]);
    // A compact access bridge makes the station a place, not just a platform.
    box(stop,[1.35,.15,5.6],palette.building,[-2.65,2.45,-2.7]);
    for(const z of [-.5,-5])box(stop,[1.3,2.45,1.05],palette.building,[-2.65,1.23,z]);
    box(stop,[3.5,1.4,2.1],palette.building,[-2.65,.8,-5.6]);
    box(stop,[2.5,.63,.025],palette.glass,[-2.65,1.0,-4.54]);
    return stop;
  }
  function building(parent,at,size,{roof=true}={}) {
    const b=group(parent,'overview-building',at),[w,h,d]=size;
    box(b,[w,.16,d],palette.concrete,[0,.08,0]);
    for(const x of [-w/2,w/2])box(b,[.15,h,d],palette.building,[x,h/2,0]);
    for(const z of [-d/2,d/2])box(b,[w,h,.15],palette.building,[0,h/2,z]);
    box(b,[w-.5,.52,.025],palette.glass,[0,h*.63,d/2+.02]);
    if(roof) {
      const top=group(b,'removable-building-roof');box(top,[w+.3,.16,d+.25],palette.roof,[0,h+.09,0]);
      shell(top);explode(top,[0,1.5,0]);
    }
    return b;
  }
  function overlayPath(layerName, name, points, color, {dashed=false, radius=.11, direction=1}={}) {
    const parent=group(layers[layerName],name), curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.12);
    parent.userData.pathKind=layerName;
    if(dashed) {
      const segments=[];
      for(let i=0;i<80;i+=2)segments.push(curve.getPoint(i/80),curve.getPoint((i+1)/80));
      const mesh=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segments),new THREE.LineBasicMaterial({color,depthTest:false}));
      mesh.renderOrder=14;parent.add(mesh);
    } else {
      const visible=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(20,points.length*8),radius,5,false),new THREE.MeshBasicMaterial({color,depthTest:false}));
      visible.renderOrder=12;parent.add(visible);
    }
    const marks=[];
    for(let i=0;i<3;i++) {
      const mark=new THREE.Mesh(new THREE.ConeGeometry(.2,.5,4),new THREE.MeshBasicMaterial({color,depthTest:false}));
      mark.renderOrder=16;parent.add(mark);marks.push(mark);
    }
    movingMarks.push({curve,marks,direction});
    return parent;
  }
  const running=part(root,'network-route');
  for(const z of [-5,-2])straightTrack(running,52,-2,z);
  for(const x of [-18,0,18])station(x);

  const turnback=part(root,'network-turnback');
  for(const z of [-5,-2])curveTrack(turnback,[[24,.16,z],[26,.16,z],[28,.16,-3.5]]);
  straightTrack(turnback,2.5,29.1,-3.5);buffers(turnback,30.2,-3.5);
  // Separate running-rail and train silhouettes preserve useful selection at
  // the overview scale without pretending to show propulsion hardware here.
  const vehicles=part(root,'network-train');
  const trainA=train(vehicles,[-8,.03,-5]), trainB=train(vehicles,[8,.03,-2]);

  const depot=part(root,'network-depot');
  const depotPad=box(depot,[28,.16,13],palette.concrete,[15,-.015,9.8]);depotPad.renderOrder=-102;
  const access=[[-10,.16,-2],[-6,.16,-.6],[-2,.16,4.6],[3,.16,7.8],[7,.16,8]];
  curveTrack(depot,access);
  // Each fan is attached to the access road. Spaces between the roads reveal
  // the separate maintenance, wash and stabling functions at a glance.
  for(const z of [6,10,12.5,15])curveTrack(depot,[[5,.16,8],[7,.16,8],[10,.16,z],[13,.16,z]]);
  for(const z of [6,10])straightTrack(depot,15,20.5,z);
  for(const x of [3,8,13,18,23,28])box(depot,[.07,.58,.07],palette.steel,[x,.34,16.3]);
  box(depot,[25,.07,.06],palette.steel,[15.5,.63,16.3]);
  building(depot,[4,.08,11.6],[2.4,1.45,2.2]);

  const maintenance=part(root,'network-maintenance');
  const hall=group(maintenance,'maintenance-hall',[21,0,6]);
  for(const x of [-5.3,0,5.3])for(const z of [-1.75,1.75])box(hall,[.13,2.75,.13],palette.building,[x,1.42,z]);
  box(hall,[11,.18,3.7],palette.concrete,[0,.06,0]);
  const hallRoof=group(hall,'removable-maintenance-roof');box(hallRoof,[11.8,.15,4.2],palette.roof,[0,2.9,0]);shell(hallRoof);explode(hallRoof,[0,2,0]);
  train(hall,[0,.03,0],5.7);
  for(const x of [-4.6,4.6])box(hall,[.25,1.6,.25],palette.amber,[x,.9,1.3]);
  const wash=group(maintenance,'wash-gantry',[17,0,10]);
  for(const x of [-1.7,1.7])for(const z of [-1,1])box(wash,[.15,2.1,.15],palette.building,[x,1.13,z]);
  box(wash,[3.7,.15,2.4],palette.roof,[0,2.25,0]);
  for(const z of [-.85,.85])cylinder(wash,.2,1.6,palette.teal,[0,1.05,z],null,8);

  const stabling=part(root,'network-stabling');
  for(const z of [12.5,15]){straightTrack(stabling,15,20.5,z);buffers(stabling,27.7,z);}
  train(stabling,[17,.03,12.5],5.1);train(stabling,[23,.03,15],5.1);

  const operations=part(root,'network-control-centre',[-22,0,8]);
  building(operations,[0,0,0],[8.2,2.5,5]);
  for(const x of [-2.5,0,2.5]) {
    box(operations,[1.6,.65,.65],palette.steel,[x,.7,1.2]);
    box(operations,[1.4,.7,.09],palette.glass,[x,1.35,1.1]);
  }
  // The front strip reads as an operations room from the distant camera.
  box(operations,[7,.55,.04],palette.glass,[0,1.5,2.53]);

  const supply=part(root,'network-substation',[-10,0,9]);
  const supplyPad=box(supply,[8,.18,6],palette.concrete,[0,.05,0]);supplyPad.renderOrder=-101;
  for(const x of [-2.4,-1.2,0]){
    box(supply,[.9,2.1,1.3],palette.building,[x,1.15,-1.2]);
    box(supply,[.6,.28,.02],palette.glass,[x,1.55,-.54]);
  }
  box(supply,[2.4,1.4,2.4],palette.steel,[1.5,.9,1]);
  for(let x=.45;x<2.6;x+=.24)box(supply,[.07,1.2,2.7],palette.rail,[x,.95,1]);
  for(const x of [.8,1.5,2.2])cylinder(supply,.09,.6,palette.amber,[x,1.85,1],null,8);
  for(const z of [-3,3])box(supply,[8,.04,.07],palette.steel,[0,.4,z]);

  const telecom=part(root,'network-telecommunications');
  for(const [x,z] of [[-14,-8.3],[4,-8.3],[22,-8.3],[-18,8],[5,10]]) {
    box(telecom,[.85,1.5,.7],palette.building,[x,.8,z]);
    for(const y of [.55,.85,1.15])box(telecom,[.58,.12,.025],palette.glass,[x,y,z+.36]);
    box(telecom,[1.2,.1,1],palette.concrete,[x,.06,z]);
  }

  overlayPath('movement','passenger-route-out',[[-27,.64,-5],[0,.64,-5],[24,.64,-5],[27,.64,-3.5]],0x208b80);
  overlayPath('movement','passenger-route-back',[[27,.64,-3.5],[24,.64,-2],[0,.64,-2],[-27,.64,-2]],0x208b80);
  overlayPath('movement','depot-access',access.map(([x,y,z])=>[x,.66,z]),0x208b80,{radius:.095});
  overlayPath('movement','workshop-road',[[7,.66,8],[10,.66,6],[26,.66,6]],0x208b80,{radius:.075});

  overlayPath('power','outgoing-dc-feeder',[[-10,1.7,8],[-12,1.0,5],[-12,.95,.1],[-23,.95,.1],[-23,.95,-6.4],[25,.95,-6.4]],0xd39a35);
  overlayPath('power','return-circuit',[[25,.85,-.65],[-16,.85,-.65],[-16,.85,3.2],[-10,1.4,8]],0x43a7b0);
  for(const [x,z] of [[-8,-5],[8,-2]])overlayPath('power',`vehicle-supply-${x}`,[[x,.95,-6.4],[x,1.15,-5.8],[x,1.15,z]],0xd39a35,{radius:.07});
  overlayPath('power','vehicle-return',[[-8,1.05,-5],[-9,1.1,-3.6],[-9,.85,-.65]],0x43a7b0,{radius:.07});
  overlayPath('power','second-vehicle-return',[[8,1.05,-2],[9,1.1,-1.5],[9,.85,-.65]],0x43a7b0,{radius:.07});

  overlayPath('information','railway-backbone',[[-22,2.5,8],[-27,2.5,5],[-27,1.35,-10.5],[-14,1.35,-10.5],[4,1.35,-10.5],[22,1.35,-10.5]],0x8c79bf,{dashed:true});
  for(const x of [-14,4,22])overlayPath('information',`station-link-${x}`,[[x,1.35,-10.5],[x,1.2,-8.3],[x-3,1.7,-6]],0x8c79bf,{dashed:true});
  overlayPath('information','power-supervision',[[-22,2.2,8],[-17,2.2,7],[-10,2.1,9]],0x8c79bf,{dashed:true});
  overlayPath('information','depot-supervision',[[-22,2.4,8],[-17,2.4,15],[-5,2.4,16],[5,1.9,10]],0x8c79bf,{dashed:true});

  function update(state) {
    const variant=Object.hasOwn(layers,state.variant)?state.variant:'movement';
    for(const [key,node] of Object.entries(layers))node.visible=key===variant;
    const phase=Number.isFinite(state.phase)?state.phase:0;
    for(const item of movingMarks)item.marks.forEach((mark,i)=>{
      const t=(phase/20+i/3+.08)%1, p=item.curve.getPointAt(t), tangent=item.curve.getTangentAt(t).multiplyScalar(item.direction);
      mark.position.copy(p);mark.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),tangent);
    });
    // Vehicle motion is deliberately bounded to free track between platforms;
    // no train passes through another train or the depot facilities.
    trainA.position.x=-8+(variant==='movement'?Math.sin(phase*.25)*1.5:0);
    trainB.position.x=8-(variant==='movement'?Math.sin(phase*.25)*1.5:0);
  }
  update({variant:'movement',phase:0});
  registerAnimator(update);
  return root;
}
