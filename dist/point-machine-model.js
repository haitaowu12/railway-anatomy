import {createMechanicalDetails} from './mechanical-details.js';

export const POINT_PLATE_FRAME = {
  parts: ['track-point-machine', 'track-point-detection'],
  direction: [3.8, 8, -1.8],
};

// Four external rods: each blade has its own operating and detector connection.
// The exposed actuator and positive locks explain functions, not a vendor's internals.
export function buildPointMachine(parent, api, {position, railY, bladeAt}) {
  const {M,part,group,box,cylinder,shell}=api, D=createMechanicalDetails(api);
  const sources=['PM01','PM02','PM03','PM04'];
  const machine=part(parent,'track-point-machine',position);
  D.mark(machine,'Two operating rods and positive locks',{sources,function:'Two operating rods move the blades. Separate detector rods follow each blade; locking holds the selected end position.'});
  const rodY=railY-.12-position[1], bladeY=railY+.10-position[1];
  box(machine,[1.28,.08,.85],M.core,[0,rodY-.09,-.16]);
  const housing=group(machine,'removable-machine-housing');shell(housing);
  box(housing,[1.28,.045,.88],M.teal,[0,rodY+.34,-.16]);
  for(const x of [-.62,.62])box(housing,[.04,.42,.88],M.teal,[x,rodY+.11,-.16]);
  box(housing,[1.20,.42,.04],M.teal,[0,rodY+.11,-.58]);
  // The plate moves the cover clear of the locks while the normal cutaway keeps its own pose.
  housing.userData.plateSeparation = [0, .7, -1.04];
  D.mark(housing,'Machine enclosure',{sources});D.move(housing,[0,.7,0],'Open the enclosure',[0,.3]);
  const drive=D.piece(machine,'point-drive-unit','Electromechanical drive unit',[0,rodY+.13,-.39],{sources:['PM01','PM04'],function:'The electromechanical drive supplies force to the two operating rods.'});
  box(drive,[.78,.19,.24],M.aluminum);
  const detection=part(parent,'track-point-detection',position);
  D.mark(detection,'Two blade detector rods and lock contacts',{sources:['PM01','PM03'],function:'Each detector rod follows its own blade. The indication requires the closed blade, open blade and locking conditions together.'});
  const contacts=D.piece(detection,'point-detector-contacts','Blade and lock contact functions',[.24,rodY+.16,-.38],{sources:['PM01','PM03'],function:'The contacts indicate A or B when the required blade and lock conditions are met; otherwise neither end is indicated.'});
  box(contacts,[.52,.045,.20],M.signal,[0,-.04,0]);
  const pairs=['A','B'].map((end,i)=>{
    const g=D.piece(contacts,'point-contact-'+end,end+' indication contact',[-.12+i*.24,0,0],{sources:['PM01']});
    box(g,[.035,.035,.14],M.copper,[-.045,0,0]);
    const finger=group(g,'contact-finger',[.045,0,0]);box(finger,[.095,.02,.035],M.aluminum,[-.035,0,.04]);return finger;
  });
  const rods=[], locks=[];
  for(const [index,kind,side,x] of [[0,'operating',-1,-.30],[1,'operating',1,-.10],[2,'detector',-1,.10],[3,'detector',1,.30]]){
    const owner=kind==='operating'?machine:detection, worldX=position[0]+x;
    const initial=bladeAt(side,worldX,0), final=bladeAt(side,worldX,1);
    const endZ=initial[2]-position[2], travel=final[2]-initial[2];
    const g=D.piece(owner,`point-${kind}-rod-${side<0?'near':'far'}`,`${side<0?'Near':'Far'} blade ${kind} rod`,[x,rodY,0],{sources:kind==='operating'?['PM01']:['PM01','PM03'],interfaces:['Machine slide',`${side<0?'Near':'Far'} switch blade`],function:kind==='operating'?'Transfers push/pull force to one blade.':'Follows this blade independently of the operating rod.'});
    Object.assign(g.userData,{rodKind:kind,bladeSide:side,attachmentX:worldX,initialBladeZ:initial[2],rodEndZ:endZ});
    g.userData.inspectionAnchor = [0, kind==='operating' ? .025 : .017, endZ * .66];
    if(kind==='operating'){
      // Continuous side strips and bridges leave two real lock openings.
      const a=-.17,b=a-travel,half=.039,back=-.46,front=endZ;
      for(const dx of [-.041,.041])box(g,[.022,.05,front-back],M.steel,[dx,0,(front+back)/2]);
      const holes=[a,b].sort((p,q)=>p-q),spans=[[back,holes[0]-half],[holes[0]+half,holes[1]-half],[holes[1]+half,front]];
      for(const [z0,z1]of spans)if(z1>z0)box(g,[.06,.05,z1-z0],M.aluminum,[0,0,(z0+z1)/2]);
      const bolt=D.piece(machine,'point-lock-'+(side<0?'near':'far'),`${side<0?'Near':'Far'} operating-slide lock`,[x,rodY+.19,a],{sources:['PM01'],function:'The illustrated bolt enters the aligned opening in its operating slide; withdrawn bolts leave the slide free.'});
      bolt.userData.inspectionAnchor = [0, .06, 0];
      box(bolt,[.032,.12,.05],M.yellow);box(machine,[.14,.04,.14],M.core,[x,rodY+.29,a]);
      Object.assign(bolt.userData,{notches:[a,b],slide:g.name,boltZ:a,clearY:rodY+.19,engagedY:rodY+.04});locks.push(bolt);
    }else cylinder(g,.017,endZ+.46,M.steel,[0,0,(endZ-.46)/2],[Math.PI/2,0,0],10);
    const attachment=D.piece(g,`point-${kind}-attachment-${side<0?'near':'far'}`,'Blade clevis and attachment',[0,0,endZ],{sources:['PM01','PM03']});
    box(attachment,[.085,bladeY-rodY,.07],kind==='operating'?M.aluminum:M.signal,[0,(bladeY-rodY)/2,0]);
    cylinder(attachment,.027,.115,M.steel,[0,bladeY-rodY,0],[0,0,Math.PI/2],10);
    D.ring(owner,kind==='operating'?.075:.023,kind==='operating'?.105:.055,.10,M.core,[x,rodY,.29]);
    rods.push({node:g,side,worldX,initial,attachment});
  }
  machine.userData.functionalPaths=[{id:'point-drive',label:'Move, lock and detect both blades',description:'Two operating rods move the blades. Each detector rod follows its own blade, and positive locking is a separate condition.',steps:[{label:'Drive unit',nodeName:'point-drive-unit'},{label:'Operating rods',nodeName:'point-operating-rod-near'},{label:'Blades',conceptId:'track-switch-rail'},{label:'Locks',nodeName:'point-lock-near'},{label:'Detector rods',conceptId:'track-point-detection'}],sources}];
  return {update(movement,state){
    const lock=state.pointLockFraction??1,indication=state.pointIndication??(movement<.001?'A':'B');
    for(const rod of rods){const p=bladeAt(rod.side,rod.worldX,movement);rod.node.position.z=p[2]-rod.initial[2];}
    for(const bolt of locks)bolt.position.y=rodY+.19-.15*lock;
    pairs.forEach((finger,i)=>finger.rotation.z=indication===['A','B'][i]?0:-.65);
    Object.assign(machine.userData,{targetProved:indication==='B',lockEngaged:lock>=.999,indication});
    Object.assign(detection.userData,{indication,nearInput:true,farInput:state.variant!=='detector-missing'});
  }};
}
