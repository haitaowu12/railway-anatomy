/* Original educational geometry: fictional control room and depot. Paths and
 * animations explain functional relationships, not a layout, maintenance method,
 * isolation sequence, movement authority or performance prediction. */
export const OPERATIONS_VIEWS = {
  'operations-centre': { camera: [17, 14, 20], target: [0, 1.4, 0], distance: 38 },
  'depot-overview': { camera: [26, 24, 29], target: [0, 1, 0], distance: 59 },
  'depot-maintenance': { camera: [20, 17.3, 24], target: [0, 3, 0], distance: 44 },
  'depot-wash': { camera: [16, 12, 20], target: [0, 1.3, .7], distance: 36 },
  'depot-protection': { camera: [17, 13, 22], target: [0, 1.1, 0], distance: 40 },
};
const VARIANTS = {
  'operations-centre': ['service', 'incident'],
  'depot-overview': ['layout', 'night'],
  'depot-maintenance': ['inspection', 'lifting', 'wheel-lathe'],
  'depot-wash': ['wash', 'recovery'],
  'depot-protection': ['work-zone', 'indication'],
};
export function buildOperationsView(id, api) {
  if (!OPERATIONS_VIEWS[id]) return null;
  const { THREE, C, M, mat, startModel, group, part, mesh, box, cylinder,
    roundedPanel, tube, shell, explode, registerAnimator } = api;
  const root = startModel(id), animations = [], paths = [], alternatives = [];
  const P = {
    floor: mat(0x596c72,.9,.03), pale: mat(0xe2e6db,.8,.04), blue: mat(0x44677b,.7,.2),
    water: mat(0x77bdd1,.4,.2), brush: mat(0x508e94,.8,.05), red: mat(0xd37f65,.6,.1),
    yellow: mat(0xe1bd63,.6,.06), dark: mat(0x152834,.7,.1), green: mat(0x8ec6a6,.7,.1),
  };
  const chosen = state => VARIANTS[id].includes(state.variant) ? state.variant : VARIANTS[id][0];
  function foundation(parent, size, at=[0,0,0]) {
    const b = box(parent,size,M.deck,at); b.renderOrder=-105; return b;
  }
  function screen(parent,w,h,at,mode='rows',color=C.signal) {
    const g=group(parent,'schematic-screen',at);
    roundedPanel(g,w,h,.07,P.dark,[0,0,0],.04);
    box(g,[w*.9,h*.81,.015],M.glass,[0,0,.045]);
    const ink=new THREE.MeshBasicMaterial({color});
    if(mode==='track') {
      for(const y of [-.16,.16]) box(g,[w*.76,.022,.01],ink,[0,y*h,.062]);
      box(g,[w*.28,.022,.01],ink,[.03,0,.062],[0,0,.45]);
      for(const x of [-.27,.25]) box(g,[w*.12,.06,.013],M.yellow,[x*w,.16*h,.069]);
    } else if(mode==='power') {
      box(g,[w*.7,.02,.01],ink,[0,.15*h,.062]);
      for(const x of [-.28,0,.28]) {box(g,[.018,h*.48,.01],ink,[x*w,0,.062]);box(g,[.07,.07,.014],M.yellow,[x*w,.03,.07]);}
    } else for(let i=0;i<4;i++) {
      box(g,[w*(.64-i*.07),.02,.01],ink,[-w*i*.035,h*(.27-i*.17),.062]);
      box(g,[.035,.035,.012],M.service,[w*.34,h*(.27-i*.17),.066]);
    }
    return g;
  }
  function consoleUnit(parent,component,at,mode='rows') {
    const p=part(parent,component,at);
    for(const x of [-.83,.83]) {box(p,[.14,.95,.63],M.core,[x,.48,0]);box(p,[.4,.08,.9],M.steel,[x,.06,.03]);}
    box(p,[2.15,.12,1.15],P.blue,[0,1.01,0]);
    for(const x of [-.53,.53]) {
      cylinder(p,.035,.35,M.steel,[x,1.22,-.3],null,8);
      screen(p,.94,.64,[x,1.57,-.3],mode);
      box(p,[.68,.025,.23],P.dark,[x,1.09,.22]);
      for(let row=0;row<3;row++)for(let k=0;k<8;k++)box(p,[.042,.008,.035],M.core,[x-.25+k*.07,1.108,.14+row*.065]);
    }
    const chair=group(p,'operator-chair',[0,0,.95]);
    cylinder(chair,.35,.1,P.dark,[0,.69,0],null,14);
    box(chair,[.64,.61,.12],P.dark,[0,1.02,.3]);
    cylinder(chair,.045,.55,M.steel,[0,.36,0],null,10);
    for(let i=0;i<5;i++){const leg=group(chair,'chair-leg');leg.rotation.y=i*Math.PI*2/5;box(leg,[.065,.06,.45],M.steel,[0,.1,.2]);}
    return p;
  }
  function rack(parent,component,at) {
    const p=part(parent,component,at);
    box(p,[.95,2.6,.8],P.dark,[0,1.3,0]);
    for(let i=0;i<8;i++) {
      box(p,[.8,.19,.055],M.core,[0,.3+i*.27,.43]);
      for(let j=0;j<4;j++)box(p,[.045,.028,.012],M.service,[-.28+j*.14,.3+i*.27,.47]);
      for(let j=0;j<6;j++)box(p,[.035,.055,.018],P.dark,[-.25+j*.1,.27+i*.27,.473]);
    }
    const cover=group(p,'removable-rack-side');box(cover,[.07,2.6,.84],P.blue,[.5,1.3,0]);shell(cover);explode(cover,[.7,0,0]);
    return p;
  }
  function pipe(parent,points,color=P.water,r=.055) {return tube(parent,points,r,color,{segments:12});}
  function path(parent,points,color=C.signal,showFor=null) {
    const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));
    const ps=[];for(let i=0;i<24;i+=2)ps.push(curve.getPoint(i/24),curve.getPoint((i+1)/24));
    const line=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ps),new THREE.LineBasicMaterial({color,transparent:true,opacity:.65,depthTest:false}));
    line.name='illustrative-information-or-service-path';line.renderOrder=15;parent.add(line);
    const dots=[];for(let i=0;i<3;i++){const d=new THREE.Mesh(new THREE.OctahedronGeometry(.07),new THREE.MeshBasicMaterial({color,depthTest:false}));d.renderOrder=16;parent.add(d);dots.push(d);}
    paths.push({curve,line,dots,showFor});
  }
  function track(parent,length,at=[0,0,0],{sleeperGap=null,railGap=null}={}) {
    const g=group(parent,'unpowered-depot-track',at), rails=part(g,'running-rail');
    const spans=railGap?[[-length/2,railGap[0]],[railGap[1],length/2]]:[[-length/2,length/2]];
    for(const z of [-.58,.58]) for(const [a,b] of spans) {
      const length=b-a,cx=(a+b)/2;
      if(length<=0)continue;
      box(rails,[length,.075,.14],M.steel,[cx,.15,z]);box(rails,[length,.09,.045],M.core,[cx,.23,z]);box(rails,[length,.045,.09],M.aluminum,[cx,.295,z]);
    }
    for(let x=-length/2+.3;x<length/2;x+=.72)if(!sleeperGap||x<sleeperGap[0]||x>sleeperGap[1])box(g,[.15,.12,1.8],P.floor,[x,.06,0]);
    return g;
  }
  function vehicle(parent,at=[0,0,0],scale=1,{omitBogieAt=null}={}) {
    const g=group(parent,'fictional-depot-vehicle',at);g.scale.setScalar(scale);
    const body=part(g,'carbody');
    roundedPanel(body,10.6,1.8,2.0,P.pale,[0,1.82,0],.25);
    box(body,[10.8,.18,2.12],M.core,[0,.85,0]);
    for(const side of [-1,1]) {
      for(let x=-4.2;x<4.5;x+=1.2)box(body,[.95,.65,.035],M.glass,[x,2.08,side*1.02]);
      box(body,[10.45,.1,.04],M.teal,[0,1.43,side*1.035]);
      for(const x of [-2.6,2.6]) {
        const doors=part(body,'doors',[x,1.67,side*1.05]);
        box(doors,[1.06,1.42,.035],M.steel);for(const dx of [-.26,.26])box(doors,[.4,.59,.025],M.glass,[dx,.22,side*.025]);
      }
    }
    for(const x of [-3.1,3.1]) {
      if(x===omitBogieAt)continue;
      const bogie=part(g,'bogie',[x,.5,0]);
      bogie.name='attached-vehicle-bogie';bogie.userData.vehicleBogieX=x*scale;
      box(bogie,[1.9,.2,1.45],M.core);
      for(const dx of [-.63,.63])for(const z of [-.69,.69])cylinder(bogie,.3,.13,M.steel,[dx,-.05,z],[Math.PI/2,0,0],14);
    }
    return g;
  }
  function shed(parent,component,at,width,depth,height=4.8,{floor=true}={}) {
    const g=part(parent,component,at);
    if(floor)foundation(g,[width,.16,depth],[0,0,0]);
    for(const x of [-width/2+.13,width/2-.13])for(const z of [-depth/2+.15,0,depth/2-.15])box(g,[.16,height,.16],P.blue,[x,height/2,z]);
    const roof=group(g,'removable-building-roof');box(roof,[width+.3,.18,depth+.3],P.blue,[0,height,0]);shell(roof);explode(roof,[0,2,0]);
    return g;
  }
  // Four disjoint slab pieces leave a real open cavity. No hidden complete
  // floor remains beneath the variant. Depth makes this a cutaway foundation.
  function serviceFloor(parent,{x=0,z=0,width,depth}) {
    const left=-10.5,right=10.5,back=-6,front=6,thickness=1.12;
    const ax=x-width/2,bx=x+width/2,az=z-depth/2,bz=z+depth/2;
    const g=group(parent,'open-service-floor');
    const slab=(w,d,cx,cz)=>{if(w>0&&d>0)foundation(g,[w,thickness,d],[cx,.08-thickness/2,cz]);};
    slab(right-left,az-back,0,(back+az)/2);
    slab(right-left,front-bz,0,(bz+front)/2);
    slab(ax-left,depth,(left+ax)/2,z);
    slab(right-bx,depth,(bx+right)/2,z);
    return g;
  }
  function zoneFence(parent,component,at,width=4) {
    const p=part(parent,component,at);
    for(const x of [-width/2,width/2])cylinder(p,.055,1.3,M.yellow,[x,.65,0],null,8);
    for(const y of [.45,1.1])box(p,[width,.065,.045],M.yellow,[0,y,0]);
    for(let x=-width/2+.2;x<width/2;x+=.3)box(p,[.12,.34,.05],P.red,[x,.77,.01],[0,0,.4]);
    return p;
  }
  function infoBoard(parent,component,at,mode='rows') {
    const p=part(parent,component,at);box(p,[.11,1.75,.16],M.steel,[0,.88,0]);screen(p,1.6,1.05,[0,1.5,.1],mode);return p;
  }
  function alt(name){const node=group(root,`alternative-${name}`);alternatives.push({node,name});return node;}

  if(id==='operations-centre') {
    const room=part(root,'operations-centre');foundation(room,[17,.18,13]);
    box(room,[17,3.6,.12],P.blue,[0,1.8,-5.5]);
    for(const x of [-4.8,-1.6,1.6,4.8])screen(room,2.95,1.65,[x,2.4,-5.4],'track');
    const overhead=group(room,'removable-control-room-ceiling');box(overhead,[17,.12,13],P.pale,[0,4.5,0]);shell(overhead);explode(overhead,[0,1.7,0]);
    consoleUnit(room,'operations-traffic-supervision',[-4.2,.1,-2],'track');
    consoleUnit(room,'operations-signalling-workstation',[-1.35,.1,-2],'track');
    consoleUnit(room,'operations-power-control',[1.5,.1,-2],'power');
    consoleUnit(room,'operations-station-supervision',[4.35,.1,-2],'rows');
    const dispatch=consoleUnit(room,'operations-radio-dispatch',[-3,.1,2.0]);
    box(dispatch,[.23,.26,.3],M.core,[.8,1.2,.2]);
    pipe(dispatch,[[.7,1.2,.2],[.65,1.6,.25],[.78,1.77,.15]],M.steel,.022);
    const handset=group(dispatch,'radio-handset');box(handset,[.13,.47,.12],P.dark,[.95,1.28,.18]);
    const recording=rack(room,'operations-event-recording',[.5,.1,3]);
    const equipment=part(room,'operations-equipment-room',[4.8,.1,3]);
    for(const x of [-.65,.65])rack(equipment,'operations-equipment-room',[x,0,0]);
    box(equipment,[3.2,.08,2.5],P.floor,[0,.02,0]);
    const enclosure=group(equipment,'removable-equipment-room-wall');box(enclosure,[.1,3,3.1],P.pale,[1.7,1.5,0]);shell(enclosure);explode(enclosure,[1,0,0]);
    path(room,[[4.8,1.6,3],[5,3.2,1],[1.5,3.2,-2],[1.5,1.5,-2]],C.signal);
    path(room,[[.5,1.9,3],[-1,2.6,2],[-3,1.5,2]],C.service);
    const incident=group(room,'authored-event-attention-cue');
    const attention=new THREE.MeshBasicMaterial({color:C.warning});
    for(let i=0;i<3;i++)box(incident,[.16,.12,.016],attention,[-1.35+i*.28,1.75,-2.23]);
    animations.push(state=>{incident.visible=chosen(state)==='incident';});
  }
  if(id==='depot-overview') {
    const site=part(root,'depot-layout');foundation(site,[31,.2,22]);
    const storage=part(site,'depot-stabling',[1,.14,-5]);
    for(const z of [-3,0,3]) {track(storage,26,[0,0,z]);vehicle(storage,[-2,.05,z],.74);}
    const throat=part(site,'depot-throat',[-10,.16,5.3]);
    track(throat,9);for(const end of [-8,-5,-2])for(const rail of [-.58,.58])pipe(throat,[[-3,.28,rail],[.3,.28,rail-.5],[6,.28,end]],M.steel,.06);
    const maintenance=shed(site,'depot-inspection-pit',[5,.15,5.6],13,6,4.5);
    track(maintenance,12);vehicle(maintenance,[0,.03,0],.72);
    const wash=shed(site,'depot-wash-plant',[-5,.15,7.8],5,3.8,3.3);track(wash,5);
    for(const x of [-1.5,1.5])cylinder(wash,.25,1.9,P.brush,[x,1.2,.95],null,14);
    infoBoard(site,'depot-controller',[-12,.2,8],'track');
    const stores=shed(site,'depot-stores',[12,.15,.7],4,4,3);
    for(const x of [-.9,.9])for(const y of [.4,1.2,2])box(stores,[.7,.45,.7],P.yellow,[x,y,0]);
    const light=part(site,'depot-stabling');
    for(const x of [-11,0,11])for(const z of [-10,1]) {
      cylinder(light,.05,4,M.steel,[x,2,z],null,8);box(light,[.7,.08,.3],P.pale,[x,4,z]);
      const pool=box(light,[2.3,.012,2],new THREE.MeshBasicMaterial({color:0xd3c996,transparent:true,opacity:.25}),[x,.25,z]);
      animations.push(state=>{pool.visible=chosen(state)==='night';});
    }
    path(site,[[-12,1.8,8],[-12,2.5,4],[-9,1.2,4]],C.signal);
  }
  if(id==='depot-maintenance') {
    // Raise the section above the viewer's global backdrop so the below-floor
    // equipment is not buried behind that unrelated ground plane.
    root.position.y=1.3;
    const hall=shed(root,'depot-layout',[0,0,0],21,12,5.4,{floor:false});
    const inspection=alt('inspection');
    serviceFloor(inspection,{width:12,depth:1.6});
    // Pit cavity is represented by its floor and walls, without a slab over it.
    const pit=part(inspection,'depot-inspection-pit');
    foundation(pit,[12,.15,1.24],[0,-1.1,0]);
    for(const z of [-.73,.73])box(pit,[12,1.05,.16],P.floor,[0,-.55,z]);
    for(const x of [-5.5,5.5])for(let step=0;step<5;step++)box(pit,[.25,.12,.9],P.pale,[x-(x>0?1:-1)*step*.22,-.98+step*.22,0]);
    track(pit,13,[0,0,0],{sleeperGap:[-6,6]});vehicle(inspection,[0,.13,0],.95);
    const access=part(inspection,'depot-roof-access');
    for(const z of [-2.15,2.15]) {
      box(access,[11,.13,.95],P.floor,[0,3.15,z]);
      for(const x of [-5,0,5]) {cylinder(access,.035,1.1,M.steel,[x,3.76,z+(z>0?.45:-.45)],null,8);box(access,[.12,3.15,.12],M.steel,[x,1.57,z]);}
      pipe(access,[[-5,4.3,z+(z>0?.45:-.45)],[5,4.3,z+(z>0?.45:-.45)]],M.yellow,.035);
    }
    const stores=part(inspection,'depot-stores',[7,.15,3.5]);
    for(const y of [.2,1,1.8]) {box(stores,[2.4,.07,1],M.steel,[0,y,0]);for(const x of [-.7,.7])box(stores,[.55,.48,.65],P.blue,[x,y+.28,0]);}
    for(const x of [-1.2,1.2])box(stores,[.07,2.1,1],M.core,[x,1.1,0]);
    const lifting=alt('lifting');
    const removedBogieX=-3.1*.95;
    serviceFloor(lifting,{x:removedBogieX,width:4.3,depth:3.1});
    // The left vehicle bogie is omitted from the car assembly and represented
    // once, lowered in a drop at that same longitudinal position.
    const lifted=vehicle(lifting,[0,1.5,0],.95,{omitBogieAt:-3.1});
    lifted.name='supported-vehicle-one-bogie-removed';
    lifted.userData.removedBogieX=removedBogieX;explode(lifted,[0,1.3,0]);
    const jacks=part(lifting,'depot-lifting-jacks');
    for(const x of [-3.8,3.8])for(const z of [-1.65,1.65]) {
      const jack=group(jacks,'synchronized-lifting-column',[x,0,z]);box(jack,[.9,.16,.9],M.core,[0,.12,0]);box(jack,[.36,3.1,.4],P.red,[0,1.7,0]);
      cylinder(jack,.055,2.8,M.steel,[0,1.7,z>0?-.24:.24],null,10);box(jack,[.48,.3,.8],M.yellow,[0,2.25,z>0?-.28:.28]);
      for(const yy of [.6,1.2,1.8,2.4])box(jack,[.12,.03,.015],P.pale,[.19,yy,.21]);
    }
    const drop=part(lifting,'depot-bogie-drop',[removedBogieX,-.7,0]);
    drop.name='aligned-bogie-drop-aperture';drop.userData.vehicleBogieX=removedBogieX;
    foundation(drop,[4,.12,2.8]);
    for(const x of [-1.5,1.5])box(drop,[.14,1,.14],M.steel,[x,.3,0]);
    const bogie=part(drop,'bogie');bogie.name='lowered-vehicle-bogie';
    bogie.userData.removedFromVehicleX=removedBogieX;
    box(bogie,[2.1,.2,1.5],M.core,[0,.3,0]);
    for(const x of [-.75,.75])for(const z of [-.7,.7])cylinder(bogie,.35,.13,M.steel,[x,.2,z],[Math.PI/2,0,0],14);
    track(lifting,13,[0,0,0],{sleeperGap:[removedBogieX-2.15,removedBogieX+2.15],railGap:[removedBogieX-2.15,removedBogieX+2.15]});infoBoard(lifting,'depot-lifting-jacks',[6,.15,2.7]);
    const lathe=alt('wheel-lathe');
    serviceFloor(lathe,{x:-3,width:3.8,depth:3.3});
    track(lathe,13,[0,0,0],{sleeperGap:[-4.9,-1.1],railGap:[-4.1,-1.9]});vehicle(lathe,[0,.13,0],.95);
    const machine=part(lathe,'depot-wheel-lathe',[-3,.0,0]);foundation(machine,[3.3,.2,3.3],[0,-.55,0]);
    for(const z of [-.7,.7]) {
      box(machine,[1.4,.75,.65],P.blue,[0,-.3,z]);
      for(const x of [-.45,.45])cylinder(machine,.21,.3,M.steel,[x,.02,z],[Math.PI/2,0,0],14);
      box(machine,[.4,.3,.36],P.red,[.15,-.05,z+(z>0?.5:-.5)]);
    }
    infoBoard(lathe,'depot-wheel-lathe',[.5,.15,2.6]);
    alternatives.forEach(a=>a.node.visible=a.name==='inspection');
  }
  if(id==='depot-wash') {
    foundation(root,[20,.2,13]);track(root,18,[0,.12,0]);
    const wash=shed(root,'depot-wash-plant',[-2,.2,0],6,4.5,4.3);
    vehicle(root,[-2,.18,0],.86);
    const brushes=[];
    for(const x of [-3.9,-.1])for(const z of [-1.35,1.35]) {
      const rotor=group(wash,'rotary-side-brush',[x+2,1.8,z]);
      cylinder(rotor,.27,2.9,P.brush,[0,0,0],null,16);
      for(let i=0;i<12;i++){const tuft=group(rotor,'brush-strip');tuft.rotation.y=i*Math.PI/6;box(tuft,[.045,2.7,.2],P.green,[0,0,.25]);}
      cylinder(wash,.055,3.4,M.steel,[x+2,1.8,z],null,8);brushes.push(rotor);
    }
    pipe(wash,[[-2.2,.3,-2],[-2.2,3.8,-2],[2.2,3.8,-2],[2.2,.3,-2]],P.water,.09);
    for(const x of [-1.6,-.8,0,.8,1.6])for(const z of [-1.7,1.7])cylinder(wash,.06,.14,M.steel,[x,3.5,z],[Math.PI/2,0,0],8);
    const recovery=part(root,'depot-water-recovery',[5,.2,4.2]);
    for(const x of [-1.6,0,1.6]) {
      cylinder(recovery,.65,1.9,P.blue,[x,1,0],null,18);cylinder(recovery,.68,.12,P.pale,[x,2,0],null,18);
      pipe(recovery,[[x,1.6,0],[x,2.5,0],[x+.7,2.5,0]],M.steel,.055);
      box(recovery,[.26,.24,.08],M.glass,[x,1.1,.66]);
    }
    const sump=part(root,'depot-water-recovery',[-2,.12,2.75]);foundation(sump,[9,.2,1]);
    for(let x=-6;x<2.1;x+=.3)box(sump,[.065,.04,.88],M.steel,[x+2,.12,0]);
    pipe(root,[[-2,.3,2.75],[2,.3,3],[3.4,.3,4.2],[3.4,1.4,4.2]],P.water,.08);
    pipe(root,[[6.6,1.5,4.2],[7.7,1.5,4.2],[7.7,.4,-2],[-4.2,.4,-2]],P.water,.08);
    path(root,[[-4,3.5,-1.7],[-4,1.5,-1.7],[-2,.3,2.75],[3.4,.8,4.2]],C.negative,['wash']);
    path(root,[[3.4,1.6,4.2],[5,2.5,4.2],[6.6,1.6,4.2],[7.7,.6,-2],[-4,.6,-2]],C.negative,['recovery']);
    animations.push(state=>{for(const brush of brushes)brush.rotation.y=chosen(state)==='wash'?state.phase*.45:0;});
  }
  if(id==='depot-protection') {
    foundation(root,[20,.2,12]);track(root,18,[0,.12,0]);vehicle(root,[2,.16,0],.8);
    const protection=part(root,'depot-personnel-protection');
    zoneFence(protection,'depot-personnel-protection',[-4,.3,0],3);
    for(const z of [-2.2,2.2])for(const x of [-1,2,5,8])box(protection,[2.6,.025,.1],M.yellow,[x,.23,z]);
    const stop=part(protection,'depot-personnel-protection',[-5,.25,0]);
    for(const z of [-.58,.58]) {box(stop,[.5,.22,.24],P.red,[0,.28,z]);box(stop,[.75,.12,.4],M.steel,[0,.12,z]);}
    infoBoard(root,'depot-controller',[-7,.2,3],'track');
    const isolation=part(root,'depot-energy-isolation',[5,.2,3.7]);
    box(isolation,[1.8,2.2,.75],P.blue,[0,1.1,0]);
    const panel=group(isolation,'removable-isolation-cabinet-door');box(panel,[1.85,2.25,.06],P.pale,[0,1.1,.42]);shell(panel);explode(panel,[.6,0,.6]);
    for(const x of [-.45,0,.45]) {
      cylinder(isolation,.08,.08,M.copper,[x,1.7,.45],[Math.PI/2,0,0],10);
      box(isolation,[.07,.4,.055],M.steel,[x,1.32,.47],[0,0,-.5]);
      box(isolation,[.06,.16,.05],P.red,[x,.8,.46]);
    }
    const tag=group(isolation,'illustrative-lock-and-tag');roundedPanel(tag,.33,.48,.035,M.yellow,[.6,.72,.47],.03);cylinder(tag,.06,.2,P.red,[.6,1.03,.46],null,10);
    const local=rack(root,'depot-personnel-protection',[-7,.2,-3]);
    const display=infoBoard(root,'depot-controller',[-7,.2,5]);
    // Status and physical controls are kept visible in both modes. No green
    // permission, automatic release or software-derived safe-to-touch cue exists.
    path(root,[[-7,1.7,-3],[-7,2.5,0],[-7,1.7,3]],C.signal,['indication']);
    path(root,[[5,1.6,3.7],[1,2.5,4.5],[-7,1.7,5]],C.signal,['indication']);
    animations.push(state=>{display.scale.setScalar(chosen(state)==='indication'?1.1:1);});
  }
  alternatives.forEach(a=>a.node.visible=a.name===VARIANTS[id][0]);
  registerAnimator(state=>{
    const safe={...state,phase:Number.isFinite(state.phase)?state.phase:0};
    const current=chosen(safe);
    alternatives.forEach(a=>a.node.visible=a.name===current);
    animations.forEach(fn=>fn(safe));
    for(const p of paths) {
      const visible=state.signals!==false && (state.exploded||0)<.2 && (!p.showFor||p.showFor.includes(current));
      p.line.visible=visible;
      p.dots.forEach((dot,i)=>{dot.visible=visible;dot.position.copy(p.curve.getPointAt((safe.phase/9+i/3)%1));});
    }
  });
  return root;
}
