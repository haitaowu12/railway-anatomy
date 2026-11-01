import {createEquipmentDetails} from './equipment-details.js';
/* Generic teaching geometry. Dimensions and timing are authored for legibility.
 * The physical edge, sensing example and mechanism in focus are independent. */
import { normalizePlatformState, platformDoorPose, platformDetectionPose, platformGatePose } from './platform-config.js';

export const PLATFORM_VIEWS = {
  'platform-interface': { camera: [27, 20, 29], target: [0, 2, 3.2], distance: 46 },
};
export const PLATFORM_FOCUS = {
  'open-platform': { camera: [25, 19, 28], target: [-1.5, 1.8, 3.2], distance: 44, group: 'platform-teaching-scene' },
  'platform-doors': { camera: [16, 10, 21], target: [0, 2.7, 1.8], distance: 30, group: 'platform-boarding-focus', bounds: {min:[-5.6,1.35,1.25],max:[5.6,4.5,2.5]} },
  interspace: { camera: [16, 13, 20], target: [0, 2.45, 1.65], distance: 30, group: 'platform-interspace-focus' },
  'platform-end': { camera: [24, 12, 20], target: [10.8, 2.4, 4.5], distance: 22, group: 'platform-end-focus' },
};
export const PLATFORM_GEOMETRY = Object.freeze({
  floor: 1.5, railTop: .28, trainHalfWidth: 1.4, trainSide: 1.425, edge: 1.85,
  facade: 1.94, platformRear: 7.25, platformLength: 26, doorCenters: [-3.6, 3.6],
  aperture: 1.8, travel: .91, trainLength: 19.6,
});

// The station overview reuses only these contextual assemblies. They contain no
// propulsion, train-control or electrification equipment and no train cutaway.
export function createPlatformAssemblies(api) {
  const { THREE, M, mat, group, part, box, cylinder, shell, explode } = api;
  const D = PLATFORM_GEOMETRY, E=createEquipmentDetails(api);
  const P = {
    pale: mat(0xd5ddd5, .72, .08), dark: mat(0x253c44, .72, .16),
    floor: mat(0x9aa9a5, .88, .03), trim: mat(0x66858a, .60, .28),
    board: mat(0x48796d, .78, .08), amber: new THREE.MeshBasicMaterial({color:0xd6ae67}),
    cyan: new THREE.MeshBasicMaterial({color:0x80c2cb}), muted: mat(0x506267, .80, .07),
    glass: new THREE.MeshStandardMaterial({color:0xa6c8c8,roughness:.24,metalness:.08,transparent:true,opacity:.28,side:THREE.DoubleSide}),
  };
  const anchor = (node, at) => { node.userData.labelAnchor = new THREE.Vector3(...at); return node; };
  const separate=(node,delta,label)=>E.separate(node,label,delta,{sources:['N04','N05'],stage:/cover/i.test(label)?'Open drive enclosure':/controller|contact|bolt/i.test(label)?'Control and feedback':'Transmission and leaf',range:/cover/i.test(label)?[0,.3]:/controller|contact|bolt/i.test(label)?[.3,.65]:[.6,1]});
  function indicator(parent, name, at, material = P.cyan, radius=.055) {
    const g = group(parent, name, at);
    const off = cylinder(g, radius, .022, P.muted, [0,0,0], [Math.PI/2,0,0], 10);
    const on = cylinder(g, radius, .026, material, [0,0,.005], [Math.PI/2,0,0], 10);
    return {node:g,set(value){on.visible=Boolean(value);off.visible=!value;}};
  }
  function track(parent, length = 28, at = [0,0,0]) {
    const g = group(parent, 'context-running-track', at);
    box(g,[length,.14,2.6],M.deck,[0,.02,0]);
    for(let x=-length/2+.4;x<length/2;x+=.8)box(g,[.21,.10,2.15],P.floor,[x,.14,0]);
    const rails=anchor(part(g,'running-rail'),[-length*.35,D.railTop,.75]);
    for(const z of [-.75,.75]){
      box(rails,[length,.035,.16],M.steel,[0,.19,z]);
      box(rails,[length,.06,.045],M.steel,[0,.23,z]);
      box(rails,[length,.04,.085],M.steel,[0,.26,z]);
    }
    return g;
  }
  function train(parent, {at=[0,0,0], platformSide=1} = {}) {
    const g=anchor(part(parent,'carbody',at),[-7,D.floor+1.7,platformSide*D.trainHalfWidth]);
    g.name='closed-context-train';g.userData.boardingFloor=D.floor;
    const floor=box(g,[19.3,.13,2.68],M.core,[0,D.floor-.065,0]);floor.name='context-train-floor';
    box(g,[19.5,.18,2.8],P.pale,[0,D.floor+2.48,0]);
    for(const side of [-1,1]){
      const z=side*D.trainHalfWidth;
      for(const [a,b]of [[-9.65,-4.5],[-2.7,2.7],[4.5,9.65]]){
        box(g,[b-a,2.32,.09],P.pale,[(a+b)/2,D.floor+1.17,z]);
        box(g,[b-a-.15,.12,.045],P.trim,[(a+b)/2,D.floor+.55,z+side*.055]);
        for(let x=a+.85;x<b-.45;x+=1.45){
          box(g,[1.05,.80,.045],M.glass,[x,D.floor+1.62,z+side*.055]);
          box(g,[1.1,.035,.05],P.trim,[x,D.floor+1.19,z+side*.08]);
        }
      }
      for(const cx of D.doorCenters){
        box(g,[D.aperture,.13,.09],P.pale,[cx,D.floor+2.39,z]);
        const sill=box(g,[D.aperture,.06,.21],M.steel,[cx,D.floor-.03,z]);
        sill.name='train-threshold-'+side+'-'+cx;
      }
    }
    for(const x of [-9.77,9.77]){
      box(g,[.11,2.4,2.72],P.pale,[x,D.floor+1.18,0]);
      for(const z of [-.69,.69])box(g,[.025,.95,1.13],M.glass,[x+Math.sign(x)*.07,D.floor+1.66,z]);
      box(g,[.18,.13,2.7],P.trim,[x,D.floor+.53,0]);
      for(const z of [-.93,.93])box(g,[.035,.15,.24],P.pale,[x+Math.sign(x)*.10,D.floor+.67,z]);
    }
    const cab=group(g,'driver-cab-at-car-end',[-8.9,D.floor+.03,0]);
    box(cab,[.10,2.2,2.5],P.dark,[.67,1.1,0]);
    box(cab,[.6,.13,2.2],P.dark,[-.27,.88,0]);
    const bogie=anchor(part(g,'bogie'),[-6.25,.82,platformSide*.9]);
    for(const bx of [-6.25,6.25]){
      box(bogie,[2.75,.22,1.75],P.trim,[bx,.97,0]);
      for(const dx of [-.88,.88]){
        cylinder(bogie,.08,1.72,M.steel,[bx+dx,.72,0],[Math.PI/2,0,0],12);
        for(const z of [-.75,.75]){
          cylinder(bogie,.44,.17,M.steel,[bx+dx,.72,z],[Math.PI/2,0,0],22);
          cylinder(bogie,.31,.19,P.dark,[bx+dx,.72,z],[Math.PI/2,0,0],18);
          cylinder(bogie,.12,.205,M.steel,[bx+dx,.72,z],[Math.PI/2,0,0],12);
        }
      }
    }
    const leaves=[];
    for(const side of [-1,1])for(const cx of D.doorCenters)for(const direction of [-1,1]){
      const x=cx+direction*.45;
      const leaf=anchor(part(g,'doors',[x,D.floor+1.14,side*D.trainSide]),[0,.35,side*.055]);
      leaf.name='context-train-door-'+side+'-'+cx+'-'+direction;
      box(leaf,[.88,2.26,.065],P.pale);
      box(leaf,[.52,.72,.02],M.glass,[0,.47,side*.044]);
      box(leaf,[.028,2.25,.075],P.dark,[-direction*.435,0,0]);
      leaves.push({node:leaf,x,direction,side,cx});
    }
    return {node:g,leaves,setOpening(value){for(const leaf of leaves)leaf.node.position.x=leaf.x+(leaf.side===platformSide?leaf.direction*D.travel*value:0);}};
  }
  function drive(parent,cx,height,side,detailed=true) {
    const z=side*D.facade, full=height>2;
    const g=anchor(part(parent,'platform-door-drive',[cx,D.floor+(full?2.46:1.04),z]),[full?-.62:-1.25,.08,side*.2]);
    g.userData.explorationAssembly='platform-door-drive';
    const pulleys=[], racks=[];
    if(full){
      const guide=E.inspect(group(g,'door-fixed-hanger-track',[0,-.10,-side*.13]),'Fixed hanger track',{sources:['N04'],description:'The fixed guide supports the moving carriages; it does not travel with the leaf.'});box(guide,[2.65,.055,.08],M.steel);
      box(g,[2.5,.16,.18],P.dark);
      const transmission=group(g,'door-belt-and-pulleys');
      for(const x of [-1.02,1.02]){
        const wheel=group(transmission,'door-drive-pulley',[x,.04,side*.16]);
        cylinder(wheel,.105,.06,M.steel,[0,0,0],[Math.PI/2,0,0],16);
        box(wheel,[.14,.022,.018],P.amber,[0,0,side*.043]);
        pulleys.push(wheel);
      }
      for(const y of [-.065,.145])box(transmission,[2.04,.018,.025],P.dark,[0,y,side*.16]);
      if(detailed)separate(transmission,[0,.35,side*.45],'Belt and pulleys');
      const motor=group(g,'door-drive-motor',[-.87,.08,-side*.08]);
      cylinder(motor,.13,.4,M.core,[0,0,0],[0,0,Math.PI/2],14);
      for(const x of [-.16,.16])box(motor,[.025,.27,.26],M.steel,[x,0,0]);
      if(detailed)separate(motor,[-.3,.35,-side*.25],'Drive motor');
      const board=group(g,'door-control-board',[.46,.11,0]);
      box(board,[.55,.04,.17],P.board);box(board,[.15,.05,.13],P.dark,[0,.04,0]);
      if(detailed)separate(board,[.3,.6,side*.2],'Local door controller');
      const cover=group(g,'removable-door-header-cover');
      box(cover,[2.6,.37,.045],P.pale,[0,.03,side*.25]);
      box(cover,[2.6,.045,.44],P.pale,[0,.22,0]);
      if(detailed){shell(cover);separate(cover,[0,.8,side*.65],'Header cover');}
    }else{
      // This selected half-height mechanism has a pinion at each fixed post.
      // No header crosses the passenger opening at waist height.
      for(const direction of [-1,1]){
        const x=direction*1.23, motor=group(g,'half-height-side-post-drive',[x,0,0]);
        box(motor,[.38,.31,.30],M.core);
        const pinion=group(motor,'half-height-door-pinion',[0,.01,side*.19]);
        cylinder(pinion,.085,.06,M.steel,[0,0,0],[Math.PI/2,0,0],14);
        box(pinion,[.12,.018,.018],P.amber,[0,0,side*.042]);pulleys.push(pinion);
        const rack=group(g,'half-height-leaf-rack',[direction*.75,-.10,side*.19]);
        box(rack,[1.5,.035,.035],M.steel);
        for(let j=0;j<12;j++)box(rack,[.025,.024,.035],P.dark,[-.68+j*.12,.03,0]);
        racks.push({node:rack,x:direction*.75,direction});
        if(detailed){separate(motor,[direction*.5,.2,side*.5],'Side-post drive');separate(rack,[0,.25,side*.35],'Moving rack');}
        const cover=group(g,'removable-side-drive-cover',[x,0,side*.25]);
        box(cover,[.45,.41,.035],P.pale);
        if(detailed){shell(cover);separate(cover,[direction*.55,.5,side*.7],'Side-post cover');}
      }
    }
    const terminalBank=E.terminalStrip(g,{name:'door-controller-terminals',at:[full?.57:-1.23,full?.14:.25,-side*.19],labels:['Supply','Request','Position return','Lock return'],kind:'information',sources:['N04','N05']});if(!full)terminalBank.scale.setScalar(.32);
    E.paths(g,[{id:'door-actuation',label:'Request to leaf motion',description:full?'The controller drives the motor, belt and pulley transmission; fixed guides support the moving leaves.':'The selected half-height facade uses side-post drives, with no header across the opening.',steps:[{label:'Interface terminals',nodeName:'door-controller-terminals'},{label:'Drive',nodeName:full?'door-drive-motor':'half-height-side-post-drive'},{label:'Transmission',nodeName:full?'door-belt-and-pulleys':'half-height-leaf-rack'}],sources:['N04','N05']}]);
    const request=indicator(g,'door-open-request',[full?.88:-1.23,full?.11:.2,side*.29],P.amber);
    return {node:g,pulleys,racks,request,set(pose){
      for(const p of pulleys)p.rotation.z=-pose.opening*D.travel/(full?.105:.085);
      for(const r of racks)r.node.position.x=r.x+r.direction*D.travel*pose.opening;
      request.set(pose.request);
    }};
  }
  function proof(parent,cx,height,side,detailed=true) {
    const full=height>2, keeperDirection=full?1:-1;
    const g=anchor(part(parent,'platform-door-proof',[cx+(full?0:-1.23),D.floor+(full?2.39:1.07),side*(D.facade+.035)]),[.13,.02,side*.15]);
    g.userData.explorationAssembly='platform-door-proof';
    const frame=group(g,'door-contact-frame');box(frame,[.14,.24,.15],M.steel);
    const bolt=group(g,'door-lock-bolt',[.12,.03,0]);box(bolt,[.065,.22,.09],P.amber);
    const keeper=group(g,'door-lock-keeper',[.12,-.10,0]);box(keeper,[.14,.065,.13],P.dark);
    const contact=group(g,'door-closed-contact');box(contact,[.065,.09,.08],P.board,[-.09,-.09,0]);
    const magnet=group(g,'door-leaf-contact-target',[-.15,-.09,0]);box(magnet,[.045,.09,.065],M.steel);
    const closed=indicator(g,'door-closed-indication',[-.25,.02,side*.13]);
    const locked=indicator(g,'door-locked-indication',[.30,.02,side*.13],P.amber);
    if(detailed){separate(contact,[-.35,.25,side*.4],'Closed-position contact');separate(bolt,[.2,.45,side*.35],'Lock bolt');}
    E.inspect(magnet,'Leaf-mounted position target',{sources:['N05'],description:'The target travels with leaf position; the contact is mounted to the fixed frame.'});E.inspect(keeper,'Lock keeper',{sources:['N05']});
    E.paths(g,[{id:'door-evidence',label:'Position and lock evidence',description:'The target/contact pair describes closed position; the bolt and locking indication are separate.',steps:[{label:'Moving target',nodeName:'door-leaf-contact-target'},{label:'Closed contact',nodeName:'door-closed-contact'},{label:'Lock bolt',nodeName:'door-lock-bolt'},{label:'Keeper',nodeName:'door-lock-keeper'},{label:'Returned indication',nodeName:'door-locked-indication'}],sources:['N05']}]);
    return {node:g,bolt,magnet,closed,locked,set(pose){
      bolt.position.y=.03+(1-pose.lock)*.23;
      keeper.position.x=.12+keeperDirection*pose.opening*D.travel;
      magnet.position.x=-.15-pose.opening*D.travel;
      closed.set(pose.closed);locked.set(pose.lockedReported);
    }};
  }
  function barrier(parent,{edge='full-height',at=[0,0,0],side=1,length=25.6,doorCenters=D.doorCenters,detailed=true}={}) {
    const height=edge==='half-height'?1.25:2.85;
    const g=group(parent,'platform-facade-'+edge,at),facade=anchor(part(g,'platform-screen-door'),[doorCenters[0]-.95,D.floor+height*.55,side*D.facade]);
    facade.userData.explorationAssembly='platform-screen-door';
    const leafHeight=height>2?2.28:1.12, leaves=[],drives=[],proofs=[];
    let left=-length/2;
    const spans=[];
    for(const cx of [...doorCenters].sort((a,b)=>a-b)){spans.push([left,cx-D.aperture/2]);left=cx+D.aperture/2;}
    spans.push([left,length/2]);
    for(const[a,b]of spans){
      if(b<=a)continue;
      box(facade,[b-a,height-.12,.045],P.glass,[(a+b)/2,D.floor+height/2,side*D.facade]);
      for(const y of [D.floor+.08,D.floor+height])box(facade,[b-a,.07,.11],M.steel,[(a+b)/2,y,side*D.facade]);
      const pieces=Math.max(1,Math.ceil((b-a)/2));
      for(let j=0;j<=pieces;j++){const x=a+(b-a)*j/pieces;box(facade,[.07,height,.12],M.steel,[x,D.floor+height/2,side*D.facade]);
        const mount=E.inspect(group(facade,'facade-post-base',[Math.max(a+.08,Math.min(b-.08,x)),D.floor+.025,side*D.facade]),'Fixed post base and anchors',{sources:['N03'],description:'Mounting stays within the fixed panel span; no anchor pattern or structural design is prescribed.'});box(mount,[.16,.045,.20],M.steel);for(const dx of [-.05,.05])for(const dz of [-.06,.06])cylinder(mount,.013,.05,M.core,[dx,.025,dz],null,8);
      }
    }
    for(const cx of doorCenters){
      if(height>2){
        box(facade,[D.aperture,height-2.5,.055],P.glass,[cx,D.floor+2.5+(height-2.5)/2,side*D.facade]);
        box(facade,[D.aperture,.07,.12],M.steel,[cx,D.floor+height,side*D.facade]);
      }
      const sill=box(facade,[D.aperture,.035,.2],M.steel,[cx,D.floor-.0175,side*D.facade]);sill.name='platform-door-sill-'+edge+'-'+cx;
      for(const direction of [-1,1]){
        const x=cx+direction*.45,leaf=group(facade,'platform-sliding-leaf',[x,D.floor+.03+leafHeight/2,side*(D.facade-.035)]);
        box(leaf,[.88,leafHeight,.045],P.glass);
        for(const dx of [-.44,.44])box(leaf,[.035,leafHeight+.035,.075],M.steel,[dx,0,0]);
        for(const y of [-leafHeight/2,leafHeight/2])box(leaf,[.9,.045,.075],M.steel,[0,y,0]);
        box(leaf,[.035,leafHeight,.08],P.dark,[-direction*.44,0,0]);
        if(height>2){const hanger=E.inspect(group(leaf,'door-leaf-hanger',[0,leafHeight/2+.07,-side*.09]),'Moving leaf hanger and rollers',{sources:['N04'],description:'The carriage follows the leaf along the fixed guide.'});box(hanger,[.36,.08,.10],M.steel);for(const dx of [-.12,.12])cylinder(hanger,.045,.05,P.trim,[dx,.045,0],[Math.PI/2,0,0],12);}
        E.inspect(leaf,'Sliding door leaf',{stage:'Transmission and leaf',range:[.6,1],sources:['N03','N04']});
        if(detailed)separate(leaf,[direction*.2,.15,side*.45],'Sliding leaf');
        leaves.push({node:leaf,x,direction,cx});
      }
      if(detailed){drives.push(drive(g,cx,height,side,true));proofs.push(proof(g,cx,height,side,true));}
      else if(height>2)box(facade,[2.5,.27,.30],P.pale,[cx,D.floor+2.46,side*D.facade]);
    }
    return {node:g,facade,leaves,drives,proofs,edge,set(pose){
      for(const leaf of leaves)leaf.node.position.x=leaf.x+leaf.direction*D.travel*pose.opening;
      drives.forEach(d=>d.set(pose));proofs.forEach(p=>p.set(pose));
    }};
  }
  return {P,anchor,indicator,track,train,barrier};
}

export function buildPlatformView(id,api) {
  if(!PLATFORM_VIEWS[id])return null;
  const {THREE,C,M,mat,startModel,group,part,box,cylinder,tube,roundedPanel,explode,shell,registerAnimator}=api;
  const A=createPlatformAssemblies(api),{P,anchor,indicator}=A,D=PLATFORM_GEOMETRY;
  const root=startModel(id),scene=group(root,'platform-teaching-scene');
  const concrete=mat(0x7f9293,.88,.02),yellow=mat(0xd8b66c,.68,.04);
  A.track(scene,29);
  const context=group(scene,'platform-boarding-focus'),train=A.train(context);
  const platform=group(scene,'passenger-platform');
  for(let x=-12.5;x<=12.5;x+=1){
    box(platform,[1,D.floor-.12,D.platformRear-D.edge],M.deck,[x,(D.floor-.12)/2,(D.platformRear+D.edge)/2]);
    const tile=box(platform,[1,.12,D.platformRear-D.edge],concrete,[x,D.floor-.06,(D.platformRear+D.edge)/2]);tile.name='platform-surface-tile';
    box(platform,[1,.018,.32],yellow,[x,D.floor+.009,D.edge+.28]);
    box(platform,[1,.014,.035],P.pale,[x,D.floor+.011,D.edge+.66]);
  }
  for(let x=-12.4;x<12.6;x+=.32)for(const z of [D.edge+.17,D.edge+.28,D.edge+.39])
    cylinder(platform,.016,.012,P.dark,[x,D.floor+.025,z],null,6);
  for(const x of [-7.7,7.4]){
    box(platform,[2.4,.12,.52],P.trim,[x,D.floor+.48,6.35]);
    box(platform,[2.4,.50,.07],P.trim,[x,D.floor+.78,6.58]);
    for(const dx of [-.85,.85])box(platform,[.07,.43,.46],M.steel,[x+dx,D.floor+.23,6.35]);
  }
  for(const x of [-11.8,10.8]){
    cylinder(platform,.055,2.6,M.steel,[x,D.floor+1.3,6.95],null,10);
    box(platform,[1.2,.55,.065],P.dark,[x,D.floor+2.35,6.95]);
    box(platform,[.8,.045,.018],P.pale,[x,D.floor+2.36,6.994]);
  }
  const barriers=['half-height','full-height'].map(edge=>A.barrier(context,{edge}));
  const trainway=group(scene,'platform-trainway-focus'),interspace=group(scene,'platform-interspace-focus'),end=group(scene,'platform-end-focus');
  const traces=[];
  function trace(parent,name,points,color,stage=0){
    const geometry=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));
    const line=new THREE.Line(geometry,new THREE.LineBasicMaterial({color,transparent:true,opacity:.55}));
    line.name=name;parent.add(line);traces.push({line,stage});return line;
  }
  function volume(parent,component,name,w,h,d,at,color){
    const g=anchor(part(parent,component,at),[-w/2,h*.45,d/2]);g.name=name;
    const material=new THREE.MeshBasicMaterial({color});
    for(const y of [0,h])tube(g,[[-w/2,y,-d/2],[w/2,y,-d/2],[w/2,y,d/2],[-w/2,y,d/2],[-w/2,y,-d/2]],.014,material,{straight:true,segments:8});
    for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])box(g,[.014,h,.014],material,[x,h/2,z]);
    return g;
  }
  function object(parent,name,at,depth=.32){
    const g=group(parent,name,at);roundedPanel(g,.42,.4,depth,yellow,[0,.23,0],.05);
    tube(g,[[-.11,.43,0],[-.11,.56,0],[.11,.56,0],[.11,.43,0]],.018,P.dark,{straight:true,segments:8});
    return g;
  }
  volume(trainway,'platform-intrusion','defined-trainway-zone',2.65,.62,2.55,[-11.55,.30,0],0xd6ae67);
  const intrusion=object(trainway,'trainway-object',[-14,.29,0]);
  const lidar=anchor(part(trainway,'platform-lidar',[-11.6,D.floor,2.5]),[0,.88,0]);
  cylinder(lidar,.055,.74,M.steel,[0,.37,0],null,10);
  cylinder(lidar,.16,.26,P.dark,[0,.87,0],null,14);
  cylinder(lidar,.165,.05,P.cyan,[0,.9,0],null,14);
  const lidarScan=group(lidar,'lidar-sampled-volume');
  for(const[x,z]of [[-1.1,-1.1],[0,-1.1],[1.1,-1.1],[-1.1,1.1],[1.1,1.1]])
    trace(lidarScan,'lidar-sample',[[0,.88,0],[x,-1.1,z-2.5]],0x80c2cb,1);
  const radar=anchor(part(trainway,'platform-radar'),[-11.4,.60,1.5]);
  for(const z of [-1.52,1.52]){
    box(radar,[.3,.3,.15],P.pale,[-11.4,.60,z]);
    box(radar,[.22,.21,.02],P.dark,[-11.4,.60,z-Math.sign(z)*.085]);
    box(radar,[.055,.39,.055],M.steel,[-11.4,.30,z]);
  }
  trace(radar,'paired-radar-plane',[[-11.4,.60,-1.43],[-11.4,.60,1.43]],0xd6ae67,1);
  // A local equipment alcove sits beyond the passenger circulation space.
  const service=group(scene,'local-platform-service-alcove',[8.7,D.floor,8.55]);
  box(service,[3.2,.12,2.35],M.deck,[0,-.06,0]);
  box(scene,[1.0,.12,.35],M.deck,[7.5,D.floor-.06,7.35]);
  const canopy=group(service,'service-alcove-shell');
  box(canopy,[3.2,2.65,.12],P.pale,[0,1.325,-1.13]);
  box(canopy,[.12,2.65,2.35],P.pale,[1.54,1.325,0]);
  box(canopy,[3.2,.10,2.35],P.pale,[0,2.7,0]);shell(canopy);
  for(const x of [-1.52,.4])cylinder(service,.035,1.05,M.steel,[x,.525,-1.13],null,8);
  tube(service,[[-1.52,1.05,-1.13],[.4,1.05,-1.13]],.035,M.steel,{straight:true,segments:4});
  const processor=anchor(part(service,'platform-response',[0,.04,.15]),[0,1.1,.50]);
  processor.userData.explorationAssembly='platform-response';
  box(processor,[1.14,.10,.85],M.steel,[0,.05,0]);
  box(processor,[1.1,1.6,.08],P.dark,[0,.9,-.42]);
  for(const x of [-.53,.53])box(processor,[.05,1.6,.85],P.dark,[x,.9,0]);
  for(let i=0;i<3;i++){
    const board=group(processor,'intrusion-processor-module-'+i,[0,.43+i*.41,0]);
    box(board,[.90,.15,.66],P.board);box(board,[.21,.055,.22],P.dark,[-.18,.1,0]);
    box(board,[.86,.11,.045],P.trim,[0,0,.36]);board.userData.explorationLabel='Processing module';explode(board,[i===0?-.35:.2,.15+i*.14,.65]);
  }
  const cover=group(processor,'processor-front-cover');box(cover,[1.14,1.66,.045],P.pale,[0,.9,.46]);cover.userData.explorationLabel='Processor cover';shell(cover);explode(cover,[.7,.2,.85]);
  const evidence=indicator(processor,'sensor-evidence-indicator',[-.32,1.48,.50],P.cyan,.09);
  const report=indicator(processor,'detection-report-indicator',[0,1.48,.50],P.amber,.09);
  const unavailable=indicator(processor,'sensing-unavailable-indicator',[.32,1.48,.50],P.amber,.09);
  const associated=anchor(part(scene,'platform-alarm-video',[-9.1,D.floor,6.95]),[.32,2.65,-.15]);
  cylinder(associated,.045,2.9,M.steel,[0,1.45,0],null,10);
  box(associated,[.50,.055,.08],M.steel,[.22,2.72,0]);
  box(associated,[.33,.22,.55],P.pale,[.42,2.62,-.19],[-.15,0,0]);
  cylinder(associated,.075,.035,P.dark,[.42,2.66,-.48],[Math.PI/2,0,0],12);
  const videoEvent=indicator(associated,'associated-video-event',[.42,2.83,-.12],P.amber,.09);
  const lidarLink=group(trainway,'lidar-local-report-path'),radarLink=group(trainway,'radar-local-report-path');
  trace(lidarLink,'lidar-to-local-processor',[[-11.6,2.39,2.5],[-11.6,1.57,6.85],[7.5,1.57,6.85],[8.7,2.98,8.1]],C.signal,2);
  trace(radarLink,'radar-to-local-processor',[[-11.4,.60,1.52],[-11.4,1.57,6.85],[7.5,1.57,6.85],[8.7,2.98,8.1]],C.signal,2);
  trace(trainway,'reported-location-to-associated-camera',[[8.7,2.98,8.1],[8.7,4.1,8.1],[-9.1,4.1,6.95]],C.signal,3);
  const gap=volume(interspace,'platform-gap-detector','monitored-interspace',17.4,1.55,.34,[0,D.floor+.04,1.68],0x80c2cb);
  gap.userData.labelAnchor=new THREE.Vector3(-8.5,1.55,0);
  for(const x of [-8.5,8.5]){
    box(gap,[.15,.21,.08],P.dark,[x,1.53,0]);
    cylinder(gap,.045,.025,P.cyan,[x,1.53,-.055],[Math.PI/2,0,0],10);
  }
  const gapObject=object(interspace,'interspace-object',[.3,D.floor+.04,1.68],.16);
  trace(gap,'interspace-evidence',[[-8.5,1.53,0],[.3,.4,0],[8.5,1.53,0]],0x80c2cb,1);
  const gapReport=indicator(gap,'interspace-report',[-8.5,1.70,.03],P.amber);
  const gate=anchor(part(end,'platform-end-gate',[12.05,D.floor,4.55]),[0,1.05,1.1]);
  gate.userData.explorationAssembly='platform-end-gate';
  for(const z of [-2.55,2.55]){
    box(gate,[.13,1.65,.13],M.steel,[0,.825,z]);
    box(gate,[.28,.08,.28],M.steel,[0,.04,z]);
  }
  for(const y of [.18,1.52])box(gate,[.075,.075,2.75],M.steel,[0,y,1.125]);
  for(let z=-.15;z<=2.55;z+=.45)box(gate,[.055,1.35,.055],M.steel,[0,.85,z]);
  const hinge=group(gate,'end-gate-hinge',[0,0,-2.55]),leaf=group(hinge,'end-gate-leaf');
  for(const y of [.18,1.52])box(leaf,[.09,.075,2.3],M.steel,[0,y,1.15]);
  for(let z=.1;z<2.3;z+=.43)box(leaf,[.07,1.35,.055],M.steel,[0,.85,z]);
  box(leaf,[.12,.08,.62],yellow,[.12,.95,1.86]);
  const latch=group(leaf,'end-gate-latch',[0,1.07,2.25]);box(latch,[.13,.13,.22],P.amber);latch.userData.explorationLabel='Gate latch';explode(latch,[.45,.25,.15]);
  const contact=group(gate,'end-gate-position-contact',[0,1.4,-.18]);box(contact,[.16,.12,.15],P.dark);
  const magnet=group(leaf,'end-gate-contact-target',[0,1.4,2.27]);box(magnet,[.12,.1,.11],M.steel);contact.userData.explorationLabel='Gate position contact';explode(contact,[.45,.3,0]);
  const closed=indicator(gate,'end-gate-closed-indication',[.12,1.65,-.2]);closed.node.rotation.y=Math.PI/2;
  const gateReport=indicator(gate,'end-access-report',[.12,1.82,-.2],P.amber);gateReport.node.rotation.y=Math.PI/2;
  for(const z of [2.75,3.45])box(end,[.55,.016,.28],yellow,[11.45,D.floor+.013,z]);
  volume(end,'platform-intrusion','restricted-end-access-zone',1.0,.65,2.15,[12.65,D.floor+.04,3.12],0xd6ae67);

  const update=state=>{
    const configuration=normalizePlatformState(state),{variant,platformEdge,platformSensor}=configuration;
    const doors=variant==='platform-doors'?platformDoorPose(state):platformDoorPose({phase:0});
    const detection=platformDetectionPose(state),gatePose=platformGatePose(state);
    for(const barrier of barriers){barrier.node.visible=barrier.edge===platformEdge;barrier.set(doors);}
    train.setOpening(doors.opening);
    trainway.visible=variant==='open-platform';interspace.visible=variant==='interspace';end.visible=variant==='platform-end';
    lidar.visible=lidarLink.visible=platformSensor==='lidar';radar.visible=radarLink.visible=platformSensor==='radar';
    service.visible=associated.visible=variant==='open-platform';
    intrusion.position.x=-14+detection.entry*2.6;intrusion.visible=true;
    gapObject.visible=true;
    evidence.set(detection.evidence);report.set(detection.report);unavailable.set(detection.unavailable);
    videoEvent.set(detection.associatedVideo);gapReport.set(detection.report);
    hinge.rotation.y=-gatePose.opening*Math.PI*.43;latch.position.z=2.25-(1-gatePose.latch)*.18;
    closed.set(gatePose.closed);gateReport.set(gatePose.report);
    for(const {line,stage}of traces){
      const stageVisible=stage===0||stage===1&&detection.evidence||stage===2&&detection.report||stage===3&&detection.associatedVideo;
      line.visible=state.signals!==false&&(state.exploded||0)<.2&&stageVisible;
    }
    root.userData.platformState={...configuration,doors,detection,gate:gatePose};
  };
  registerAnimator(update);update({variant:'open-platform',phase:0,platformEdge:'open',platformSensor:'lidar',signals:true});
  return root;
}


