/* Original educational geometry: fictional control room and depot. Paths and
 * animations explain functional relationships, not a layout, maintenance method,
 * isolation sequence, movement authority or performance prediction. */
export const OPERATIONS_VIEWS = {
  'operations-centre': { camera: [17, 14, 20], target: [0, 1.4, 0], distance: 38 },
  'depot-overview': { camera: [34, 31, 38], target: [0, .8, 1], distance: 68 },
  'depot-yard': { camera: [23, 22, 29], target: [0, .8, 0], distance: 53 },
  'depot-workshop': { camera: [19, 16, 22], target: [0, 1.4, 0], distance: 42 },
  'depot-utilities': { camera: [17, 15, 21], target: [0, 1.2, 0], distance: 37 },
  'depot-support': { camera: [19, 16, 23], target: [0, 1, 0], distance: 43 },
  'depot-maintenance': { camera: [20, 17.3, 24], target: [0, 3, 0], distance: 44 },
  'depot-wash': { camera: [16, 12, 20], target: [0, 1.3, .7], distance: 36 },
  'depot-protection': { camera: [17, 13, 22], target: [0, 1.1, 0], distance: 40 },
};
const VARIANTS = {
  'operations-centre': ['service', 'incident'],
  'depot-overview': ['layout', 'night'],
  'depot-yard': ['reception', 'dispatch'],
  'depot-workshop': ['lathe', 'wheelset', 'bogie'],
  'depot-utilities': ['services', 'water'],
  'depot-support': ['materials', 'planning'],
  'depot-maintenance': ['inspection', 'lifting', 'jacks', 'wheel-lathe'],
  'depot-wash': ['wash', 'mobile', 'recovery'],
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
    const g=group(parent,'fictional-depot-vehicle',at);
    // Compact the teaching vehicle longitudinally while retaining the track
    // gauge. The supplied y coordinate is the track datum, not a wheel centre.
    g.scale.set(scale,scale,1);g.position.y=at[1]+.295-.15*scale;
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
      for(const dx of [-.63,.63])for(const z of [-.58,.58]){
        const wheel=cylinder(bogie,.3,.13,M.steel,[dx,-.05,z],[Math.PI/2,0,0],14);
        wheel.name='depot-mounted-wheel';wheel.userData.wheelRadius=.3;
      }
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
  // Depot equipment uses shared geometry throughout: close views and the site
  // overview refer to the same concepts, rather than invented screen-only nodes.
  function railBranch(parent, points, component='depot-yard-points') {
    const g=part(parent,component);
    for(const offset of [-.58,.58])pipe(g,points.map(([x,y,z])=>[x,y+.29,z+offset]),M.steel,.05);
    const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));
    const count=Math.ceil(curve.getLength()/.75);
    for(let i=0;i<=count;i++) {
      const t=i/count,p=curve.getPoint(t),d=curve.getTangent(t);
      box(g,[.15,.1,1.8],P.floor,[p.x,p.y+.06,p.z],[0,-Math.atan2(d.z,d.x),0]);
    }
    return g;
  }
  function signal(parent,at) {
    const p=part(parent,'depot-shunt-signal',at);
    cylinder(p,.06,1.1,M.steel,[0,.55,0],null,8);
    box(p,[.42,.52,.16],P.dark,[0,1.28,0]);
    for(const x of [-.1,.1])cylinder(p,.055,.03,P.pale,[x,1.3,.1],[Math.PI/2,0,0],8);
    box(p,[.5,.08,.4],M.core,[0,.04,0]);
    return p;
  }
  function buffer(parent,at) {
    const p=part(parent,'depot-stabling',at);
    for(const z of [-.58,.58])box(p,[.8,.18,.14],M.core,[0,.3,z],[0,0,.5]);
    box(p,[.15,.24,1.65],P.red,[.25,.72,0]);
  }
  function walkway(parent,at,length,component='depot-staff-access') {
    const p=part(parent,component,at);box(p,[length,.035,.72],P.floor);
    for(const z of [-.34,.34])box(p,[length,.012,.045],M.yellow,[0,.025,z]);
    return p;
  }
  function boundary(parent,x,z,width) {
    const p=part(parent,'depot-network-boundary',[x,.19,z]);
    for(let zz=-width/2;zz<width/2;zz+=.55)box(p,[.12,.035,.3],P.pale,[0,0,zz]);
    for(const zz of [-width/2,width/2]){
      box(p,[.1,1.8,.1],M.steel,[0,.9,zz]);box(p,[.7,.45,.06],P.blue,[0,1.6,zz]);
      box(p,[.4,.06,.075],P.pale,[0,1.6,zz+.01]);
    }
  }
  function shelves(parent,at,component='depot-stores',width=3.4) {
    const p=part(parent,component,at);
    for(const x of [-width/2,width/2])box(p,[.07,2.65,1.05],P.blue,[x,1.3,0]);
    for(const y of [.2,1,1.8,2.6]) {
      box(p,[width,.08,1.05],M.steel,[0,y,0]);
      if(y<2.6)for(let x=-width/2+.4;x<width/2;x+=.85){
        box(p,[.64,.51,.65],(Math.round(x*7)%2?P.pale:P.yellow),[x,y+.3,.03]);
        box(p,[.26,.12,.012],P.dark,[x,y+.36,.37]);
      }
    }
    return p;
  }
  function bogieAssembly(parent,at=[0,0,0],component='bogie') {
    const p=part(parent,component,at);
    for(const z of [-.74,.74])box(p,[2.25,.26,.18],M.core,[0,.5,z]);
    for(const x of [-.8,.8]) {
      cylinder(p,.065,1.65,M.steel,[x,.3,0],[Math.PI/2,0,0],10);
      for(const z of [-.58,.58]){
        cylinder(p,.32,.14,M.steel,[x,.3,z],[Math.PI/2,0,0],16);
        cylinder(p,.13,.16,P.dark,[x,.3,z+(z>0?.085:-.085)],[Math.PI/2,0,0],10);
        cylinder(p,.12,.19,P.yellow,[x,.68,z],null,10);
      }
    }
    box(p,[.42,.24,1.5],M.steel,[0,.6,0]);
    cylinder(p,.3,.12,M.core,[0,.81,0],null,14);
    return p;
  }
  function overheadHandling(parent,at=[0,0,0]) {
    const p=part(parent,'depot-material-handling',at);
    for(const x of [-5.8,5.8])for(const z of [-3.3,3.3])box(p,[.16,4.8,.16],P.blue,[x,2.4,z]);
    for(const z of [-3.3,3.3])box(p,[12,.22,.18],P.blue,[0,4.8,z]);
    box(p,[.23,.3,6.8],M.yellow,[1.8,4.65,0]);
    box(p,[.55,.24,.5],P.dark,[1.8,4.44,.3]);
    pipe(p,[[1.8,4.3,.3],[1.8,3.2,.3]],M.steel,.025);
    pipe(p,[[1.8,3.2,.3],[1.8,3,.3],[2,2.96,.3],[2.05,3.1,.3]],M.steel,.04);
    return p;
  }
  function trolley(parent,at=[0,0,0]) {
    const p=part(parent,'depot-material-handling',at);box(p,[2.2,.14,1.35],M.yellow,[0,.35,0]);
    for(const x of [-.85,.85])for(const z of [-.55,.55])cylinder(p,.17,.1,M.core,[x,.19,z],[Math.PI/2,0,0],10);
    pipe(p,[[-1,.4,-.5],[-1,1.1,-.5],[-1,1.1,.5],[-1,.4,.5]],M.steel,.04);
    return p;
  }
  function liftingColumn(parent,x,z,head=2.76) {
    const p=part(parent,'depot-lifting-jacks',[x,0,z]);
    box(p,[.8,.16,.85],M.core,[0,.1,0]);
    const column=box(p,[.32,3.25,.36],P.red,[0,1.75,0]);column.name='vehicle-lifting-column';
    cylinder(p,.045,3.1,M.steel,[0,1.7,z>0?-.23:.23],null,10);
    box(p,[.48,.22,.82],M.yellow,[0,head,z>0?-.28:.28]);
    return p;
  }
  function roofAccess(parent) {
    const access=part(parent,'depot-roof-access');
    for(const z of [-2.05,2.05]) {
      const deck=box(access,[11.8,.13,1],P.floor,[0,3.15,z]);deck.name='roof-access-deck';
      for(const x of [-5.6,-2.8,0,2.8,5.6]) {
        // The near platform spans the illustrated transverse transfer channel.
        // A column is not placed through that opening.
        if(!(x===-2.8&&z>0))box(access,[.12,3.15,.12],M.steel,[x,1.57,z]);
        cylinder(access,.035,1.12,M.steel,[x,3.77,z+(z>0?.47:-.47)],null,8);
      }
      for(const yy of [3.72,4.31])pipe(access,[[-5.7,yy,z+(z>0?.47:-.47)],[5.7,yy,z+(z>0?.47:-.47)]],M.yellow,.03);
      for(let n=0;n<8;n++)box(access,[.35,.1,.8],P.floor,[5.8+n*.28,.22+n*.4,z]);
    }
    return access;
  }
  function workshopLathe(parent,offset=(-3.1-.63)*.95) {
    const p=part(parent,'depot-wheel-lathe',[offset,0,0]);
    p.name='lathe-at-installed-axle';p.userData.vehicleAxleX=offset;
    foundation(p,[3.45,.18,3.05],[0,-.84,0]);
    for(const z of [-.58,.58]) {
      box(p,[1.65,.6,.62],P.blue,[0,-.45,z]);
      for(const x of [-.28,.28]){const roller=cylinder(p,.21,.28,M.steel,[x,.17,z],[Math.PI/2,0,0],14);roller.name='lathe-drive-roller';}
      const tool=group(p,'wheel-profile-cutting-tool',[.06,.23,z+(z>0?.47:-.47)]);
      box(tool,[.5,.23,.4],P.red);box(tool,[.1,.1,.45],M.steel,[0,.14,z>0?-.3:.3]);
    }
    const chips=group(p,'swarf-removal-tray');box(chips,[2.6,.13,.48],M.core,[0,-.65,1.28]);
    for(let i=0;i<10;i++)box(chips,[.08,.04,.055],M.steel,[-1+i*.22,-.55,1.28]);
    infoBoard(parent,'depot-wheel-lathe',[.9,.12,3.6]);
    return p;
  }
  function plantCabinet(parent,component,at,size=[1.4,2.1,.8]) {
    const p=part(parent,component,at);box(p,size,P.blue,[0,size[1]/2,0]);
    box(p,[size[0]*.7,.38,.025],P.dark,[0,size[1]*.73,size[2]/2+.02]);
    for(const x of [-.3,0,.3])cylinder(p,.035,.02,P.pale,[x,size[1]*.55,size[2]/2+.04],[Math.PI/2,0,0],8);
    for(let y=.25;y<size[1]*.45;y+=.14)box(p,[size[0]*.65,.025,.015],M.core,[0,y,size[2]/2+.025]);
    return p;
  }
  function waterTank(parent,at,r=.65,h=1.9,component='depot-water-recovery') {
    const p=part(parent,component,at);
    mesh(p,new THREE.CylinderGeometry(r,r,h,16,1,true),P.blue,[0,h/2,0]);
    const inside=P.blue.clone();inside.side=THREE.BackSide;
    mesh(p,new THREE.CylinderGeometry(r-.055,r-.055,h,16,1,true),inside,[0,h/2,0]);
    cylinder(p,r,.06,P.blue,[0,.03,0],null,16);
    const lid=cylinder(p,r+.035,.09,P.pale,[0,h+.03,0],null,16);
    cylinder(p,r*.86,.035,P.water,[0,h-.16,0],null,16);
    box(p,[.15,h*.6,.035],P.dark,[0,h*.5,r+.02]);
    box(p,[.06,h*.36,.04],P.water,[0,h*.4,r+.045]);
    return {p,lid};
  }

  if(id==='depot-overview') {
    const site=part(root,'depot-layout');foundation(site,[40,.22,31],[0,0,1]);
    const mainline=part(site,'depot-network-boundary');
    for(const z of [-12,-9.5])track(mainline,39,[0,.13,z]);
    railBranch(site,[[-18,.13,-9.5],[-15,.13,-8.5],[-11,.13,-5],[18,.13,-5]],'depot-reception');
    boundary(site,-14.5,-6.9,4.5);
    const throat=part(site,'depot-throat');
    for(const [n,z]of [-.8,2.6,6].entries()) {
      railBranch(throat,[[-11+n*2,.13,-5],[-8+n*2,.13,-3],[3,.13,z],[4,.13,z]],'depot-yard-points');
      const road=part(site,'depot-stabling');track(road,14,[11,.13,z]);vehicle(road,[9,.13,z],.64);buffer(road,[18,.13,z]);
    }
    const reception=part(site,'depot-reception');vehicle(reception,[-4,.13,-5],.64);
    const hall=shed(site,'depot-maintenance-road',[7,.13,12],18,5.5,4.6);
    railBranch(site,[[-11,.13,-5],[-10,.13,2],[-7,.13,11],[0,.13,12]],'depot-throat');
    track(hall,18);vehicle(hall,[1,0,0],.72);
    for(const z of [-1.8,1.8])box(hall,[15,.1,.7],P.floor,[0,2.8,z]);
    const wash=shed(site,'depot-wash-plant',[-12,.13,7],5,4,3.4);
    track(wash,6);for(const x of [-1.5,1.5])for(const z of [-1.3,1.3])cylinder(wash,.23,2.4,P.brush,[x,1.5,z],null,12);
    railBranch(site,[[-11,.13,-5],[-15,.13,-1],[-17,.13,6],[-15,.13,7]],'depot-throat');
    const store=shed(site,'depot-stores',[-10,.13,13],6,4,3.2);shelves(store,[0,0,0]);
    const planning=shed(site,'depot-work-planning',[-2,.13,1.4],4,3.3,2.7);screen(planning,1.1,.7,[0,1.4,0]);box(planning,[2,.12,.8],P.pale,[0,.9,.1]);
    plantCabinet(site,'depot-facility-power',[18,.13,11],[1.3,2.4,1.7]);
    infoBoard(site,'depot-controller',[-17,.2,-2.4],'track');
    signal(site,[-9,.2,-6.5]);
    walkway(site,[7,.2,8.4],19,'depot-layout');
    const emphasis=group(site,'stabling-emphasis');
    for(const z of [-.8,2.6,6])box(emphasis,[14,.03,2.35],new THREE.MeshBasicMaterial({color:C.service,transparent:true,opacity:.12,depthWrite:false}),[11,.26,z]);
    animations.push(state=>{emphasis.visible=chosen(state)==='night';});
    path(site,[[-17,1.4,-2.4],[-10,1.4,-5],[0,1.4,-5]],C.signal);
  }
  if(id==='depot-yard') {
    const site=part(root,'depot-throat');foundation(site,[31,.18,21],[0,0,-.5]);
    track(site,31,[0,.1,-7.6]);
    railBranch(site,[[-14,.1,-7.6],[-11,.1,-7],[-6,.1,-4.2],[14,.1,-4.2]],'depot-reception');
    boundary(site,-10,-5.8,5);
    const yard=part(site,'depot-stabling');
    for(const [i,z]of [-.8,2.5,5.8].entries()) {
      railBranch(site,[[-7+i*2,.1,-4.2],[-4+i*2,.1,-2],[0,.1,z],[1,.1,z]]);
      track(yard,13,[7.5,.1,z]);buffer(yard,[14,.1,z]);
      const machine=part(site,'depot-yard-points',[-5+i*2,.1,-3.2]);
      box(machine,[.72,.28,.55],P.blue);pipe(machine,[[0,.12,0],[0,.12,-1.1]],M.steel,.025);
      walkway(site,[7.3,.17,z+1.3],13,'depot-stabling');
    }
    vehicle(yard,[6,.1,5.8],.75);
    infoBoard(site,'depot-controller',[-10,.2,3.2],'track');
    signal(site,[-8,.15,-5.4]);signal(site,[-1,.15,.5]);
    const arrival=alt('reception');
    const incoming=part(arrival,'depot-reception');vehicle(incoming,[4,.1,-4.2],.75);
    const departure=alt('dispatch');
    const outbound=part(departure,'depot-dispatch');vehicle(outbound,[5,.1,-.8],.75);
    infoBoard(departure,'depot-dispatch',[10,.2,.7],'rows');
    path(arrival,[[-14,.8,-7.6],[-10,.8,-6],[-6,.8,-4.2],[5,.8,-4.2]],C.service);
    path(departure,[[8,.8,-.8],[1,.8,-.8],[-5,.8,-3.3],[-9,.8,-5.5],[-14,.8,-7.6]],C.signal);
  }
  if(id==='depot-maintenance') {
    root.position.y=1.3;
    const hall=shed(root,'depot-maintenance-road',[0,0,0],21,12,5.6,{floor:false});
    roofAccess(hall);
    plantCabinet(hall,'depot-energy-isolation',[-8,0,-4.4],[1.1,1.7,.7]);
    infoBoard(hall,'depot-personnel-protection',[-8,0,4.4]);
    for(const z of [-5.4,5.4])box(hall,[20,.045,.08],M.yellow,[0,.16,z]);
    const inspection=alt('inspection');
    serviceFloor(inspection,{width:12,depth:1.6});
    const pit=part(inspection,'depot-inspection-pit');
    foundation(pit,[12,.14,1.24],[0,-1.1,0]);
    for(const z of [-.74,.74]) {
      box(pit,[12,1.05,.13],P.floor,[0,-.55,z]);
      pipe(pit,[[-5.6,-.35,z*.8],[5.6,-.35,z*.8]],P.water,.025);
      for(const x of [-4,-1,2,5])box(pit,[.5,.08,.03],P.pale,[x,-.35,z*.87]);
    }
    for(const side of [-1,1])for(let step=0;step<5;step++)box(pit,[.27,.12,.9],P.pale,[side*(5.65-step*.23),-.98+step*.22,0]);
    track(pit,13,[0,0,0],{sleeperGap:[-6,6]});
    vehicle(inspection,[0,0,0],.95);
    const tools=part(inspection,'depot-maintenance-road',[6.6,.1,2.2]);
    box(tools,[1,.9,.7],P.red,[0,.45,0]);for(const y of [.2,.4,.6])box(tools,[.7,.035,.035],M.steel,[0,y,.37]);
    const lifting=alt('lifting');
    const removedBogieX=-3.1*.95;
    // The front section is removed so the learner can see the lowered bogie
    // and transverse carrier. This is a section through the facility floor.
    serviceFloor(lifting,{x:removedBogieX,z:2.225,width:4.3,depth:7.55});
    track(lifting,13,[0,0,0],{sleeperGap:[removedBogieX-2.15,removedBogieX+2.15],railGap:[removedBogieX-2.15,removedBogieX+2.15]});
    const supported=vehicle(lifting,[0,0,0],.95,{omitBogieAt:-3.1});
    supported.name='supported-vehicle-one-bogie-removed';supported.userData.removedBogieX=removedBogieX;
    const supports=part(lifting,'depot-bogie-drop');
    supports.name='stationary-carbody-supports';
    for(const x of [-5.45,-.42])for(const z of [-1.35,1.35]) {
      const base=box(supports,[.6,.14,.65],M.core,[x,.1,z]);base.name='carbody-support-base';
      box(supports,[.25,.65,.28],P.yellow,[x,.45,z]);
      const head=box(supports,[.8,.14,.65],M.steel,[x+(x<-3?.35:-.23),.8045,z>0?1.15:-1.15]);
      head.name='carbody-support-head';
    }
    const aperture=part(lifting,'depot-bogie-drop',[removedBogieX,0,0]);
    aperture.name='aligned-bogie-drop-aperture';aperture.userData.vehicleBogieX=removedBogieX;
    foundation(aperture,[4.3,.12,7.5],[0,-1.13,2.2]);
    const guides=group(aperture,'transverse-bogie-transfer-guides');
    for(const x of [-1.7,1.7]){const rail=box(guides,[.1,.08,7.1],M.steel,[x,-.98,2.2]);rail.name='bogie-transfer-guide-rail';}
    for(const z of [-1.25,0,1.5,3,4.5,5.6]){const tie=box(guides,[3.8,.08,.16],P.floor,[0,-1.05,z]);tie.name='bogie-transfer-guide-support';}
    const carrier=group(aperture,'bogie-drop-transfer-carrier',[0,-.86,0]);
    const carrierFrame=foundation(carrier,[3.1,.06,2.65],[0,-.095,0]);carrierFrame.name='bogie-carrier-base-frame';
    for(const z of [-1.1,1.1]){
      box(carrier,[3.5,.1,.18],M.core,[0,-.025,z]);
      cylinder(carrier,.04,3.4,M.steel,[0,.04,z],[0,0,Math.PI/2],10);
    }
    for(const x of [-1.7,1.7])for(const z of [-1.1,1.1]){
      box(carrier,[.17,.13,.17],M.core,[x,-.005,z]);
      const wheel=cylinder(carrier,.12,.1,M.steel,[x,.04,z],[0,0,Math.PI/2],10);
      wheel.name='bogie-carrier-wheel';wheel.userData.wheelRadius=.12;
    }
    const deck=group(carrier,'bogie-drop-lift-deck',[0,.61,0]);
    const deckSlab=foundation(deck,[3.1,.13,2.65]);deckSlab.name='bogie-drop-deck-slab';
    for(const z of [-.58,.58])box(deck,[3,.08,.1],M.steel,[0,.12,z]);
    const liftStages=[];
    for(const x of [-1.12,1.12])for(const z of [-.9,.9]){
      const outer=cylinder(carrier,.115,.22,P.blue,[x,.045,z],null,10);outer.name='bogie-deck-outer-stage';
      const middle=cylinder(carrier,.085,.22,M.steel,[x,.045,z],null,10);
      const inner=cylinder(carrier,.055,.22,M.aluminum,[x,.045,z],null,10);
      middle.name='bogie-deck-middle-stage';inner.name='bogie-deck-support';
      liftStages.push({middle,inner});
    }
    const lowered=bogieAssembly(deck,[0,.18,0]);lowered.name='lowered-vehicle-bogie';lowered.userData.removedFromVehicleX=removedBogieX;
    zoneFence(lifting,'depot-bogie-drop',[removedBogieX,.15,-2],4.6);
    animations.push(state=>{
      // Start with a separated, supported bogie below its original position.
      // The rail-borne carrier stays on its guides as its deck lowers. Only
      // then does the carrier traverse; the return completes before raising.
      const t=state.phase%10;
      const loweredFraction=t<=1?t:t<=8?1:t<=9?9-t:0;
      carrier.position.set(0,-.86,0);
      deck.position.y=.61-.39*loweredFraction;
      if(t>1&&t<=4)carrier.position.z=(t-1)*1.4;
      else if(t>4&&t<=5)carrier.position.z=4.2;
      else if(t>5&&t<=8)carrier.position.z=4.2-(t-5)*1.4;
      const extension=deck.position.y-.22;
      for(const {middle,inner}of liftStages){middle.position.y=.045+extension/2;inner.position.y=.045+extension;}
    });
    const jacks=alt('jacks');foundation(jacks,[21,.18,12]);track(jacks,13,[0,0,0]);
    const raised=vehicle(jacks,[0,0,0],.95);raised.name='raised-body-with-bogies-at-rail-level';
    raised.children.find(n=>n.userData.component==='carbody').position.y=1.8/.95;
    for(const x of [-4.5,4.5])for(const z of [-1.35,1.35])liftingColumn(jacks,x,z);
    infoBoard(jacks,'depot-lifting-jacks',[7,.1,2.5]);
    const lathe=alt('wheel-lathe');serviceFloor(lathe,{x:-3,width:3.8,depth:3.3});
    track(lathe,13,[0,0,0],{sleeperGap:[-4.9,-1.1],railGap:[-3.9635,-3.1235]});vehicle(lathe,[0,0,0],.95);workshopLathe(lathe);
  }
  if(id==='depot-workshop') {
    root.position.y=1.3;
    shed(root,'depot-bogie-workshop',[0,0,0],21,12,5.9,{floor:false});
    overheadHandling(root);
    trolley(root,[7,.1,3.6]);
    const lathe=alt('lathe');serviceFloor(lathe,{x:-3,width:3.8,depth:3.3});
    track(lathe,15,[0,0,0],{sleeperGap:[-4.9,-1.1],railGap:[-3.9635,-3.1235]});vehicle(lathe,[0,0,0],.95);workshopLathe(lathe);
    const removed=alt('wheelset');foundation(removed,[21,.18,12]);
    const wheel=part(removed,'depot-wheelset',[0,.1,0]);
    cylinder(wheel,.12,3.8,M.steel,[0,1.1,0],[Math.PI/2,0,0],12);
    for(const z of [-1.15,1.15]) {
      cylinder(wheel,.8,.3,M.steel,[0,1.1,z],[Math.PI/2,0,0],24);
      cylinder(wheel,.28,.32,P.dark,[0,1.1,z],[Math.PI/2,0,0],16);
      box(wheel,[1.5,.2,.65],P.blue,[0,.2,z]);
      for(const x of [-.5,.5])box(wheel,[.15,.6,.55],M.core,[x,.58,z],[0,0,x>0?.4:-.4]);
    }
    const gauge=part(removed,'depot-wheelset',[1.4,.1,1.15]);
    box(gauge,[.6,.1,.8],M.core,[0,.06,0]);box(gauge,[.12,1.8,.15],P.blue,[0,.95,0]);
    box(gauge,[1,.12,.15],M.steel,[-.45,1.8,0]);box(gauge,[.18,.28,.2],P.red,[-.9,1.65,0]);
    infoBoard(removed,'depot-wheelset',[3.5,.1,2.7]);
    const bogies=alt('bogie');foundation(bogies,[21,.18,12]);
    const stand=part(bogies,'depot-bogie-workshop',[-2,.1,0]);
    box(stand,[3.3,.18,2.4],P.blue,[0,.9,0]);
    for(const x of [-1.2,1.2])for(const z of [-.85,.85])box(stand,[.18,.9,.18],M.steel,[x,.45,z]);
    bogieAssembly(stand,[0,1,0]);
    const spare=part(bogies,'depot-bogie-workshop',[4,.1,-2.3]);bogieAssembly(spare);box(spare,[2.8,.1,2],P.floor,[0,.05,0]);
    const bench=part(bogies,'depot-bogie-workshop',[-5,.1,3.4]);
    box(bench,[3,.13,1.3],P.pale,[0,1.1,0]);for(const x of [-1.25,1.25])box(bench,[.1,1.1,1],M.core,[x,.55,0]);
    cylinder(bench,.24,.45,M.steel,[.7,1.41,0],[Math.PI/2,0,0],14);box(bench,[.55,.28,.5],P.red,[-.7,1.3,0]);
    for(const x of [-7,-3,1,5])box(bogies,[2.5,.03,.07],M.yellow,[x,.22,4.6]);
  }
  if(id==='depot-wash') {
    foundation(root,[23,.2,14]);track(root,22,[0,.12,0]);
    const wash=part(root,'depot-wash-plant');
    const drive=alt('wash'),mobile=alt('mobile'),recoveryView=alt('recovery');
    function brushUnit(parent,x,z,height=2.8) {
      const rotor=group(parent,'wash-brush-rotor',[x,1.72,z]);cylinder(rotor,.28,height,P.brush,[0,0,0],null,14);
      for(let i=0;i<8;i++){const row=group(rotor,'brush-row');row.rotation.y=i*Math.PI/4;box(row,[.055,height-.12,.18],P.green,[0,0,.27]);}
      return rotor;
    }
    const fixed=part(drive,'depot-wash-plant');
    for(const x of [-3,3]){
      for(const z of [-1.55,1.55])box(fixed,[.14,3.6,.14],P.blue,[x,1.8,z]);
      box(fixed,[.18,.18,3.3],P.blue,[x,3.6,0]);
    }
    const fixedBrushes=[];for(const x of [-2.7,2.7])for(const z of [-1.3,1.3])fixedBrushes.push(brushUnit(fixed,x,z));
    const movingTrain=vehicle(drive,[-1.4,.12,0],.86);movingTrain.name='drive-through-moving-train';
    const still=vehicle(mobile,[0,.12,0],.86);still.name='gantry-stationary-train';
    const gantry=part(mobile,'depot-wash-gantry');gantry.name='travelling-wash-gantry';
    for(const z of [-1.85,1.85]) {
      box(gantry,[1.1,.2,.5],M.core,[0,.3,z]);box(gantry,[.18,3.4,.16],P.blue,[0,1.9,z]);
      for(const x of [-.35,.35])cylinder(gantry,.14,.1,M.steel,[x,.15,z],[Math.PI/2,0,0],10);
      box(mobile,[14,.09,.075],M.steel,[0,.17,z]);
    }
    box(gantry,[.2,.2,3.8],P.blue,[0,3.6,0]);
    const mobileBrushes=[brushUnit(gantry,0,-1.3),brushUnit(gantry,0,1.3)];
    const fixedCopy=part(recoveryView,'depot-wash-plant');
    for(const z of [-1.55,1.55])box(fixedCopy,[.14,3.4,.14],P.blue,[-3,1.7,z]);
    box(fixedCopy,[.15,.15,3.3],P.blue,[-3,3.4,0]);vehicle(recoveryView,[-1.4,.12,0],.86);
    const spray=part(wash,'depot-wash-pump');
    pipe(spray,[[-4.2,.35,-2],[-4.2,3.4,-2],[-4.2,3.4,2],[-4.2,.35,2]],P.water,.075);
    for(const z of [-1.25,0,1.25])cylinder(spray,.065,.15,M.steel,[-4.2,3.2,z],null,8);
    const pump=part(root,'depot-wash-pump',[6,.2,-3.8]);box(pump,[2.8,.15,1.5],M.core,[0,.1,0]);
    for(const x of [-.75,.65]){cylinder(pump,.24,.55,P.blue,[x,.5,0],[0,0,Math.PI/2],14);box(pump,[.5,.16,.6],M.steel,[x,.23,0]);}
    plantCabinet(pump,'depot-wash-pump',[1.1,.2,.5],[.55,1.1,.45]);
    const tanks=[];for(const x of [-2,0,2])tanks.push(waterTank(root,[x+5,.2,4.4]));
    const drain=part(root,'depot-drainage',[0,.12,2.65]);box(drain,[15,.17,.7],P.dark);
    for(let x=-7.2;x<7.3;x+=.35)box(drain,[.055,.035,.63],M.steel,[x,.1,0]);
    pipe(root,[[-4.2,.35,2],[0,.35,2.65],[3,.35,4.4],[3,1.4,4.4]],P.water,.08);
    pipe(root,[[7,1.4,4.4],[9,1.4,4.4],[9,.35,-3.8],[6,.35,-3.8]],P.water,.075);
    pipe(root,[[6,.65,-3.8],[-4.2,.65,-3.8],[-4.2,.65,-2]],P.water,.07);
    const fresh=part(root,'depot-wash-pump',[9,.2,-5.7]);box(fresh,[1.1,.08,1.1],P.floor);pipe(fresh,[[0,0,0],[0,1.1,0],[-3,1.1,1.9]],M.steel,.055);
    const residual=part(root,'depot-drainage',[7,.25,4.4]);pipe(residual,[[0,.3,0],[3,.3,0],[3,-.25,1.9]],P.red,.06);
    animations.push(state=>{
      const phase=Number.isFinite(state.phase)?state.phase:0;
      movingTrain.position.x=-1.4+Math.sin(phase*.32)*2;
      gantry.position.x=Math.sin(phase*.35)*4.5;
      for(const brush of [...fixedBrushes,...mobileBrushes])brush.rotation.y=phase*.7;
      for(const {lid}of tanks)lid.visible=chosen(state)!=='recovery';
    });
    path(root,[[3,1.5,4.4],[5,2.6,4.4],[7,1.5,4.4],[9,.6,-3.8],[6,.6,-3.8]],C.negative,['recovery']);
    path(root,[[-4.2,3,-1.7],[-4.2,.6,1.8],[0,.6,2.65],[3,.6,4.4]],C.negative,['wash','recovery']);
  }
  if(id==='depot-utilities') {
    foundation(root,[21,.2,14]);
    const electrical=part(root,'depot-facility-power',[-6,.15,-2]);
    plantCabinet(electrical,'depot-facility-power',[0,0,0],[1.4,2.6,1]);
    plantCabinet(electrical,'depot-facility-power',[1.8,0,0],[1.4,2.6,1]);
    box(electrical,[4,.13,.65],M.core,[.9,2.9,0]);
    for(const x of [-.3,.3,1.5,2.1])pipe(electrical,[[x,2.6,0],[x,3.4,0],[x,3.4,2.2]],M.copper,.035);
    const air=part(root,'depot-compressed-air',[.7,.15,-2]);
    cylinder(air,.65,2.5,P.blue,[0,1.35,0],null,16);cylinder(air,.68,.1,M.steel,[0,2.63,0],null,16);
    box(air,[1.5,1,1.1],P.dark,[2,.6,0]);cylinder(air,.24,.6,M.steel,[2,1.2,0],[0,0,Math.PI/2],12);
    box(air,[.7,1.2,.7],P.pale,[3.5,.7,0]);
    pipe(air,[[2,1.1,0],[1.2,1.4,0],[0,1.4,0],[0,2.9,0],[3.5,2.9,0],[3.5,1.4,0]],P.water,.06);
    pipe(air,[[3.5,1.4,0],[3.5,3.4,0],[3.5,3.4,6.2],[-7,3.4,6.2]],P.water,.055);
    const vent=part(root,'depot-ventilation',[-4,.15,3.4]);
    box(vent,[2.5,.2,1.8],P.floor,[0,2.4,0]);box(vent,[.6,1,.6],M.steel,[0,3,0]);
    box(vent,[5,.6,.6],M.steel,[2.4,3.5,0]);
    const fan=cylinder(vent,.5,.35,P.dark,[5,3.5,0],[0,0,Math.PI/2],16);
    for(let i=0;i<4;i++)box(vent,[.05,.7,.13],M.steel,[5.2,3.5,0],[i*Math.PI/4,0,0]);
    const safety=part(root,'depot-fire-security',[-8,.15,4.6]);
    plantCabinet(safety,'depot-fire-security',[0,0,0],[.7,1.1,.35]);box(safety,[.11,3,.11],M.steel,[0,1.5,0]);
    cylinder(safety,.13,.07,P.pale,[.5,3,0],null,12);box(safety,[.42,.18,.2],P.dark,[-.25,2.8,0],[0,.35,0]);
    const drain=part(root,'depot-drainage',[2,.17,4.8]);box(drain,[12,.16,.8],P.dark);
    for(let x=-5.7;x<6;x+=.4)box(drain,[.06,.035,.7],M.steel,[x,.1,0]);
    pipe(drain,[[4,-.05,0],[4,-.45,0],[7,-.45,0],[7,-.45,-3]],P.red,.09);
    const supply=part(root,'depot-drainage',[6,.1,2]);waterTank(supply,[0,0,0],.5,1.5,'depot-drainage');
    pipe(supply,[[0,1,0],[1.5,1,0],[1.5,.2,-4.7]],P.water,.065);
    path(root,[[-6,2,-2],[-6,3.6,-2],[-6,3.6,4],[-3,1.2,4]],C.positive,['services']);
    path(root,[[6,1.1,2],[6,1.1,4.8],[4,.4,4.8],[9,.4,4.8]],C.negative,['water']);
  }
  if(id==='depot-support') {
    const room=shed(root,'depot-stores',[0,0,0],22,14,4.8);
    shelves(room,[-6,.1,-3.8]);shelves(room,[-1,.1,-3.8]);shelves(room,[-6,.1,.1]);
    const receiving=part(room,'depot-stores',[-8,.1,4]);
    for(const x of [-.65,0,.65])box(receiving,[.15,.18,1.6],M.core,[x,.13,0]);
    box(receiving,[1.8,.12,1.6],P.floor,[0,.28,0]);box(receiving,[1.3,.8,1.1],P.pale,[0,.74,0]);
    walkway(room,[0,.15,4.9],19);walkway(room,[3,.15,.9],5);
    trolley(room,[-3,.1,2.7]);
    const plan=consoleUnit(room,'depot-work-planning',[5,.1,-3.2],'rows');
    const record=part(room,'depot-maintenance-release',[6,.1,2.4]);
    box(record,[3,.12,1.4],P.pale,[0,1.05,0]);
    for(const x of [-1.2,1.2])box(record,[.12,1,.8],M.core,[x,.5,0]);
    for(const x of [-.75,.65]) {
      box(record,[.75,.04,.9],P.blue,[x,1.14,0]);
      box(record,[.65,.025,.75],P.pale,[x,1.18,0]);
      for(let row=0;row<5;row++)box(record,[.48,.007,.018],P.dark,[x,1.197,-.25+row*.1]);
    }
    infoBoard(room,'depot-maintenance-release',[8,.1,-.1],'rows');
    const passage=part(room,'depot-staff-access',[.5,.1,5.5]);
    for(const x of [-1.1,1.1])box(passage,[.12,2.6,.12],P.blue,[x,1.3,0]);box(passage,[2.3,.13,.12],P.blue,[0,2.6,0]);
    const materialsCue=group(room,'materials-path');
    for(const x of [-7,-5,-3,-1])box(materialsCue,[.45,.025,.08],M.yellow,[x,.25,2.4]);
    animations.push(state=>{materialsCue.visible=chosen(state)==='materials';});
    path(room,[[-6,1.4,-3.8],[-2,2.8,-3.8],[5,1.5,-3.2]],C.signal,['planning']);
    path(room,[[5,1.5,-3.2],[6,2.2,-1],[6,1.4,2.4],[8,1.5,-.1]],C.service,['planning']);
  }
  if(id==='depot-protection') {
    foundation(root,[20,.2,12]);track(root,18,[0,.12,0]);vehicle(root,[2,.12,0],.8);
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

