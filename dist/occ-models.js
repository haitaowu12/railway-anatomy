/* Original public educational geometry. Logical relationships, role allocation,
 * equipment quantities and room layout are fictional. Message animation does
 * not implement operating rules, interlocking, isolation or incident response. */
export const OCC_VIEWS = {
  'operations-centre':{camera:[21,20,27],target:[0,1.5,0],distance:45},
  'occ-supervision':{camera:[22,17,26],target:[0,1.2,.4],distance:42},
  'occ-incident':{camera:[20,18,25],target:[0,1.2,0],distance:40},
  'occ-equipment':{camera:[21,18,25],target:[0,1.4,0],distance:41},
  'occ-workplace':{camera:[12,11,16],target:[0,1.6,0],distance:27},
};
const VARIANTS={
  'operations-centre':['service','incident','handover'],
  'occ-supervision':['traffic','power','station'],
  'occ-incident':['reported','acknowledged','coordinated'],
  'occ-equipment':['normal','display-loss','alternate'],
  'occ-workplace':['task','shared','handover'],
};

import {addRoleFigure} from './people-models.js';
export function buildOccView(id,api){
  if(!OCC_VIEWS[id])return null;
  const {THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,roundedPanel,tube,shell,explode,registerAnimator}=api;
  const root=startModel(id),updates=[];
  const P={
    dark:mat(0x182e3b,.78,.08),blue:mat(0x466776,.74,.12),pale:mat(0xd5dedc,.85,.04),
    panel:mat(0x6e858a,.85,.04),request:mat(0xd5af65,.65,.08),feedback:mat(0x75bac9,.6,.1),
    alert:mat(0xc98267,.75,.04),paper:mat(0xdce2d6,.85,.02),muted:mat(0x4b5b65,.85,.02),
    ink:new THREE.MeshBasicMaterial({color:0x8fc1c9}),white:new THREE.MeshBasicMaterial({color:0xd5dfd6}),
    amber:new THREE.MeshBasicMaterial({color:0xe4bb6b}),red:new THREE.MeshBasicMaterial({color:0xce836b}),
  };
  const selected=s=>VARIANTS[id].includes(s.variant)?s.variant:VARIANTS[id][0];
  const phase=s=>{
    const raw=Number.isFinite(s.phase)?Math.max(0,s.phase):0;
    return (!s.playing&&raw===5?5:raw%5)/5;
  };
  function foundation(parent,w,d,at=[0,0,0]){const p=box(parent,[w,.16,d],M.deck,at);p.renderOrder=-105;return p;}
  function assembly(parent,name,at=[0,0,0],component=name){const g=group(parent,name,at);g.userData.explorationAssembly=component;return g;}
  function alternative(parent,name,variants){const g=group(parent,name);updates.push(s=>g.visible=variants.includes(selected(s)));return g;}
  function screen(parent,w,h,at,mode='rows',color=P.ink){
    const g=group(parent,`display-${mode}`,at);
    roundedPanel(g,w,h,.11,P.dark,[0,0,0],.05);
    box(g,[w*.91,h*.81,.015],M.glass,[0,0,.065]);
    if(mode==='track'){
      for(const y of [-.16,.16])box(g,[w*.8,.032,.02],color,[0,y*h,.083]);
      box(g,[w*.29,.034,.02],color,[.02,0,.086],[0,0,.45]);
      for(const x of [-.27,.25])box(g,[w*.14,h*.08,.025],P.amber,[x*w,.16*h,.093]);
    }else if(mode==='power'){
      box(g,[w*.78,.028,.02],color,[0,.19*h,.085]);
      for(const x of [-.28,0,.28]){box(g,[.028,h*.51,.02],color,[x*w,-.04*h,.085]);box(g,[.11,.12,.02],P.amber,[x*w,.01,.1]);}
    }else if(mode==='video'){
      box(g,[w*.74,h*.12,.025],P.panel,[0,-.2*h,.085]);
      for(const x of [-.3,.12])box(g,[w*.14,h*.45,.025],P.pale,[x*w,0,.09]);
      box(g,[w*.7,.035,.025],color,[0,.19*h,.09]);
    }else if(mode==='queue'){
      for(let i=0;i<3;i++){
        box(g,[w*.62,h*.035,.02],color,[-w*.06,h*(.22-i*.22),.085]);
        box(g,[w*.09,h*.1,.025],i===0?P.red:P.muted,[-w*.37,h*(.22-i*.22),.09]);
      }
    }else for(let i=0;i<4;i++)box(g,[w*(.7-i*.09),h*.035,.02],color,[-w*i*.04,h*(.28-i*.18),.085]);
    return g;
  }
  function chair(parent,at=[0,0,0]){
    const g=group(parent,'operator-chair',at);
    cylinder(g,.37,.11,P.dark,[0,.71,0],null,12);box(g,[.68,.65,.13],P.blue,[0,1.05,.3]);
    cylinder(g,.045,.57,M.steel,[0,.37,0],null,8);
    for(let i=0;i<5;i++){const leg=group(g,'chair-leg');leg.rotation.y=i*Math.PI*2/5;box(leg,[.07,.06,.47],M.steel,[0,.1,.2]);}
    return g;
  }
  function desk(parent,component,at=[0,0,0],mode='rows',scale=1){
    const p=part(parent,component,at);p.scale.setScalar(scale);
    const structural=assembly(p,'desk-frame',[0,0,0],component);
    box(structural,[2.7,.13,1.4],P.blue,[0,1.08,0]);
    for(const x of [-1,1]){box(structural,[.13,1,.7],M.core,[x,.5,0]);box(structural,[.44,.08,1.02],M.steel,[x,.055,0]);}
    for(const x of [-.62,.62]){
      const monitor=group(p,'removable-monitor',[x,1.72,-.35]);
      box(monitor,[.09,.34,.09],M.steel,[0,-.35,0]);screen(monitor,1.12,.73,[0,0,0],mode);
      explode(monitor,[x*.55,.55,0]);
    }
    const input=group(p,'keyboard-and-pointing-surface');box(input,[.85,.035,.28],P.dark,[-.33,1.17,.3]);box(input,[.22,.03,.26],P.panel,[.42,1.17,.31]);
    for(let i=0;i<3;i++)box(input,[.68,.009,.023],P.muted,[-.33,1.194,.21+i*.075]);
    chair(p,[0,0,1.28]);return p;
  }
  function radio(parent,at=[0,0,0],size=1){
    const g=group(parent,'radio-and-handset',at);g.scale.setScalar(size);
    box(g,[.35,.17,.42],P.dark);box(g,[.2,.14,.2],P.blue,[0,.13,-.04]);
    const handset=group(g,'handset',[.34,.13,.02]);box(handset,[.12,.46,.12],P.dark);explode(handset,[.35,.35,0]);
    tube(g,[[.3,-.05,.03],[.1,-.1,.26],[-.08,.08,.16]],.018,P.muted,{segments:10});
    cylinder(g,.03,.34,M.steel,[-.16,.29,-.1],null,6);return g;
  }
  function rack(parent,component,at=[0,0,0],height=3,slots=6){
    const p=part(parent,component,at);
    p.userData.explorationAssembly=component;
    box(p,[1.35,.12,1.1],P.dark,[0,.06,0]);
    for(const x of [-.6,.6])box(p,[.08,height,.09],M.steel,[x,height/2,.46]);
    for(const z of [-.46,.46])box(p,[1.28,.09,.09],M.steel,[0,height,z]);
    const modules=group(p,'service-modules');
    for(let i=0;i<slots;i++){
      const y=.37+i*(height-.55)/slots;
      const module=group(modules,'removable-equipment-module',[0,y,0]);
      box(module,[1.11,.25,.84],P.panel);box(module,[1.07,.18,.025],P.dark,[0,0,.44]);
      box(module,[.12,.03,.02],P.ink,[-.36,0,.46]);
      for(let j=0;j<3;j++)box(module,[.075,.08,.02],P.muted,[.08+j*.18,0,.46]);
      explode(module,[0,0,.35+i*.1]);
    }
    const side=group(p,'removable-rack-enclosure');
    box(side,[.065,height,1.1],P.blue,[-.67,height/2,0]);box(side,[.065,height,1.1],P.blue,[.67,height/2,0]);box(side,[1.35,height,.065],P.blue,[0,height/2,-.55]);
    shell(side);explode(side,[0,0,-.7]);return p;
  }
  function board(parent,component,at=[0,0,0],mode='queue',w=2.8,h=1.8){
    const p=part(parent,component,at);for(const x of [-w*.32,w*.32])box(p,[.1,1.6,.12],M.steel,[x,.8,0]);
    screen(p,w,h,[0,2.1,0],mode);return p;
  }
  function recordTable(parent,component,at=[0,0,0],handover=false){
    const p=part(parent,component,at);
    box(p,[3.2,.12,1.8],P.blue,[0,1.05,0]);for(const x of [-1.25,1.25])box(p,[.12,1,.9],M.core,[x,.51,0]);
    for(const x of handover?[-.8,.8]:[0]){
      const sheet=group(p,handover?(x<0?'outgoing-record':'incoming-record'):'coordination-record',[x,1.14,0]);
      box(sheet,[1.1,.025,1.3],P.paper);for(let j=0;j<4;j++)box(sheet,[.72,.016,.035],P.blue,[0,.02,-.36+j*.19]);
      const outstanding=box(sheet,[.18,.04,.13],P.alert,[.33,.04,.4]);outstanding.name='retained-outstanding-item';
      explode(sheet,[x*.3,.5,.5]);
    }
    chair(p,[0,0,1.6]);if(handover)chair(p,[0,0,-1.6]).rotation.y=Math.PI;
    return p;
  }
  function trace(parent,name,points,material,component=null,{moving=true}={}){
    const g=component?part(parent,component):group(parent,name);g.name=name;
    const {m,curve}=tube(g,points,.042,material,{segments:22});m.name=`${name}-route`;
    const end=curve.getPoint(.89),direction=curve.getTangent(.89);
    const arrow=mesh(g,new THREE.ConeGeometry(.13,.34,6),material,end.toArray());arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);
    let token=null;if(moving){token=mesh(g,new THREE.OctahedronGeometry(.15),material,points[0]);token.name=`${name}-token`;}
    return {node:g,curve,token,route:m};
  }
  function cross(parent,at,size=1){const g=group(parent,'unavailable-cross',at);for(const a of [-.72,.72])box(g,[size,.1,.065],P.alert,[0,0,0],[0,0,a]);return g;}
  function fieldCabinet(parent,at=[0,0,0]){
    const g=group(parent,'field-controller-cabinet',at);box(g,[1.5,2.4,1.05],P.blue,[0,1.2,0]);
    const front=group(g,'local-controller-panel',[0,1.45,.56]);screen(front,.9,.55,[0,.15,0],'rows');box(front,[.12,.17,.1],P.request,[.42,-.45,.06]);
    for(const x of [-.3,.3])box(g,[.08,.4,.035],P.dark,[x,.45,.55]);return g;
  }
  function trafficPlant(parent){
    const g=part(parent,'interlocking');g.name='stationary-traffic-plant';foundation(g,5,4);
    fieldCabinet(g,[-1.65,.1,-.8]);
    const track=part(g,'track-point-machine',[.5,0,.6]);track.name='unchanged-point-and-signal';
    for(const z of [-.44,.44])box(track,[4.1,.09,.07],M.steel,[0,.22,z]);
    for(let x=-1.8;x<2;x+=.48)box(track,[.13,.11,1.25],P.panel,[x,.1,0]);
    box(track,[2.2,.08,.07],M.steel,[.7,.22,1.0],[0,-.32,0]);
    box(track,[.6,.17,.4],P.blue,[-.8,.24,1]);box(track,[.06,.055,.7],M.steel,[-.8,.23,.52]);
    cylinder(track,.055,2.3,M.steel,[1.5,1.15,-.95],null,8);
    box(track,[.4,.78,.2],P.dark,[1.5,2.35,-.95]);
    for(const y of [2.1,2.35,2.6])cylinder(track,.085,.06,y===2.6?P.alert:P.muted,[1.5,y,-.81],[Math.PI/2,0,0],8);
    return g;
  }
  function powerPlant(parent){
    const g=part(parent,'power-scada');g.name='stationary-power-plant';foundation(g,5,4);fieldCabinet(g,[-1.55,.1,-.9]);
    const breaker=part(g,'breaker',[.75,.1,.2]);breaker.name='unchanged-breaker';
    box(breaker,[2.1,.16,1.35],P.blue,[0,.12,0]);
    for(const x of [-.68,.68]){cylinder(breaker,.16,1.12,P.pale,[x,.75,0],null,10);box(breaker,[.4,.09,.4],M.steel,[x,1.34,0]);}
    box(breaker,[.9,.09,.12],M.copper,[-.07,1.58,0],[0,0,.4]);
    box(breaker,[.45,.5,.5],P.dark,[0,.48,.3]);
    tube(breaker,[[-1.15,1.4,0],[-.68,1.4,0]],.055,M.copper,{segments:4});tube(breaker,[[.68,1.4,0],[1.15,1.4,0]],.055,M.copper,{segments:4});
    return g;
  }
  function stationPlant(parent){
    const g=part(parent,'station-scada');g.name='stationary-station-plant';foundation(g,5,4);fieldCabinet(g,[-1.6,.1,-.9]);
    const fan=part(g,'tunnel-fan',[.9,1.05,.3]);fan.name='unchanged-station-fan';
    box(fan,[2.15,1.9,1.15],P.blue);
    cylinder(fan,.77,.12,P.dark,[0,0,.63],[Math.PI/2,0,0],18);
    cylinder(fan,.15,.19,M.steel,[0,0,.72],[Math.PI/2,0,0],10);
    for(let i=0;i<5;i++){const blade=group(fan,'stationary-fan-blade');blade.rotation.z=i*Math.PI*2/5;box(blade,[.26,.58,.06],P.pale,[0,.38,.73],[0,0,.28]);}
    for(const x of [-.65,.65])box(g,[.13,.3,.75],M.steel,[.9+x,.15,.3]);
    box(g,[1.5,.8,1.1],P.panel,[.9,1.1,-.75]);return g;
  }

  if(id==='operations-centre'){
    const room=part(root,'operations-centre');foundation(room,21,15);
    const wall=part(room,'occ-shared-display',[0,0,-5.9]);
    box(wall,[14.8,3.8,.14],P.blue,[-2,1.95,0]);
    screen(wall,6.9,1.7,[-5.2,2.3,.1],'track');screen(wall,2.8,1.7,[.15,2.3,.1],'power');screen(wall,2.5,1.7,[3,2.3,.1],'queue');
    const ceiling=group(room,'removable-control-room-ceiling');box(ceiling,[21,.14,15],P.pale,[0,4.8,0]);shell(ceiling);explode(ceiling,[0,2,0]);
    const roles=[['operations-traffic-supervision',[-6,.1,-2.8],'track'],['operations-signalling-workstation',[-2,.1,-2.8],'track'],['operations-power-control',[2,.1,-2.8],'power'],['operations-station-supervision',[-6,.1,1.5],'queue'],['operations-radio-dispatch',[-2,.1,1.5],'rows']];
    for(const [component,at,mode]of roles){const d=desk(room,component,at,mode);if(component==='operations-radio-dispatch')radio(d,[.95,1.25,.3]);addRoleFigure(d,api,[0,0,1.6],{seated:true,role:component});}
    const eq=part(room,'operations-equipment-room',[7.1,.1,-.8]);foundation(eq,4.8,8.3);
    box(eq,[.09,2.8,8.3],P.panel,[-2.3,1.4,0]);box(eq,[4.8,2.8,.09],P.panel,[0,1.4,-4.1]);
    rack(eq,'operations-event-recording',[-.85,0,-2.5],2.7,5);
    const service=group(eq,'control-room-application-cabinets');for(const z of [.2,2.8]){box(service,[1.25,2.7,1.0],P.dark,[.55,1.35,z]);for(let y=.45;y<2.6;y+=.4)box(service,[1.07,.18,.03],P.panel,[.55,y,z+.52]);}
    // The coordination position is permanent room furniture. Activity changes
    // must never add or remove a desk. Processes live in the dedicated 2D view.
    const coordination=part(room,'occ-incident-coordination');coordination.name='persistent-coordination-position';
    const h=recordTable(coordination,'occ-duty-handover',[2,.1,2.1],true);addRoleFigure(h,api,[0,0,1.6],{seated:true,role:'incident-coordinator'});
    const coordinationPanel=box(coordination,[.42,.07,.72],P.dark,[2,1.32,2.1]);coordinationPanel.name='permanent-coordination-panel';
    const incident=alternative(room,'incident-coordination-links',['incident']);
    for(const points of [[[2,1.35,2.1],[-2,1.4,1.6]],[[2,1.35,2.1],[-6,1.4,1.6]],[[2,1.35,2.1],[5,1.7,1.4],[6.25,1.5,-3.3]]]){
      const path=trace(incident,'coordination-link',points,P.feedback,null);updates.push(s=>{path.node.visible=!!s.signals;path.token.position.copy(path.curve.getPoint(phase(s)));});
    }
    // Persistent area markings expose circulation without copying a real plan.
    for(const x of [-8.4,4.6])box(room,[.055,.02,11.2],P.panel,[x,.1,.1]);
  }

  if(id==='occ-supervision'){
    foundation(root,23,11,[0,-.08,.4]);
    const request=trace(root,'supervisory-request',[[-8,1.8,.25],[-5.1,2.7,-2.45],[.1,2.7,-2.45],[6.3,1.5,-1.25]],P.request,'occ-supervisory-request');
    const feedback=trace(root,'field-indication',[[6.3,1.2,1], [2.8,.65,3.15],[-4.5,.65,3.15],[-8,1.8,.5]],P.feedback,'occ-field-indication');
    const app=rack(root,'occ-application-service',[-2.7,.1,0],2.7,5);app.name='supervisory-application';
    const gateway=rack(root,'occ-field-gateway',[2.2,.1,0],2.25,4);gateway.name='supervision-field-gateway';
    const receipt=group(gateway,'request-receipt-marker',[0,2.4,.1]);box(receipt,[.25,.25,.1],P.request);
    const updated=group(root,'returned-indication-at-display',[-8,2.15,.55]);box(updated,[.25,.25,.1],P.feedback);
    for(const [name,component,mode,make]of [['traffic','operations-signalling-workstation','track',trafficPlant],['power','operations-power-control','power',powerPlant],['station','operations-station-supervision','queue',stationPlant]]){
      const alt=alternative(root,`supervision-${name}`,[name]);desk(alt,component,[-8,.1,.1],mode,1.1);
      const field=group(alt,'supervised-field-assembly',[7.1,.1,0]);make(field);field.userData.explorationAssembly='occ-field-gateway';
    }
    updates.push(s=>{
      const p=phase(s),show=s.signals!==false;
      request.node.visible=show;feedback.node.visible=show;
      request.token.position.copy(request.curve.getPoint(Math.min(1,p/.34)));
      feedback.token.visible=show&&p>=.68;feedback.token.position.copy(feedback.curve.getPoint(Math.min(1,Math.max(0,(p-.68)/.32))));
      receipt.visible=p>=.34;updated.visible=p>=.999;
    });
  }

  if(id==='occ-incident'){
    foundation(root,21,14);
    const queue=board(root,'occ-alarm-queue',[-1.1,.1,-2.7],'queue',4.3,2.6);
    const active=group(queue,'reported-condition-marker',[-1.4,2.6,.22]);mesh(active,new THREE.ConeGeometry(.19,.34,3),P.alert);box(active,[.04,.13,.03],P.dark,[0,.03,.18]);
    const ack=alternative(root,'acknowledgement-added',['acknowledged','coordinated']);
    const acknowledgement=board(ack,'occ-alarm-acknowledgement',[2.15,.1,-2.3],'rows',1.6,.95);acknowledgement.name='acknowledgement-panel';
    const camera=part(root,'occ-cctv-assessment',[-6,.1,-.2]);
    cylinder(camera,.06,3.35,M.steel,[-.9,1.68,0],null,8);box(camera,[.65,.31,.43],P.pale,[-.65,3.32,.12]);cylinder(camera,.1,.04,P.dark,[-.65,3.31,.36],[Math.PI/2,0,0],8);
    screen(camera,2.5,1.6,[.2,1.7,.4],'video');box(camera,[.1,1.1,.12],M.steel,[.2,.55,.4]);
    const fieldCondition=group(camera,'persistent-field-condition',[-1.9,.1,1.25]);cylinder(fieldCondition,.22,.07,P.alert,[0,.08,0],null,3);box(fieldCondition,[.06,.4,.05],P.alert,[0,.31,0]);
    const comm=desk(root,'operations-radio-dispatch',[-3.3,.1,3.2],'rows');radio(comm,[1,1.27,.25],1.2);
    const fieldRadio=group(comm,'field-radio',[-3.2,.25,0]);box(fieldRadio,[.5,.85,.3],P.dark,[0,.55,0]);box(fieldRadio,[.32,.23,.02],P.ink,[0,.62,.17]);cylinder(fieldRadio,.027,.55,M.steel,[.14,1.2,0],null,6);
    const passenger=part(root,'occ-passenger-communications',[6,.1,1.8]);
    for(const x of [-1.15,1.15])box(passenger,[.1,2.6,.1],M.steel,[x,1.3,0]);screen(passenger,2.8,1.0,[0,2.5,0],'rows',P.amber);
    const horn=mesh(passenger,new THREE.ConeGeometry(.33,.65,10,1,true),P.pale,[-1.4,2.15,.1],[Math.PI/2,0,0]);horn.name='passenger-loudspeaker';box(passenger,[.11,.35,.15],M.steel,[-1.4,2.25,-.3]);
    const security=part(root,'occ-access-supervision',[6.5,.1,-3.6]);
    for(const x of [-.8,.8])box(security,[.16,2.8,.2],P.blue,[x,1.4,0]);box(security,[1.75,.16,.2],P.blue,[0,2.8,0]);box(security,[1.35,2.5,.08],P.panel,[0,1.3,.03]);
    box(security,[.24,.4,.18],P.dark,[1.05,1.25,.1]);box(security,[.2,.11,.13],P.request,[.55,2.67,.15]);
    const coordinated=alternative(root,'coordination-added',['coordinated']);recordTable(coordinated,'occ-incident-coordination',[1.1,.1,2.8]);
    const report=trace(root,'incident-report',[[-6.4,2.25,.4],[-4,2.8,-1.2],[-1.4,2.6,-2.5]],P.request);
    const call=trace(coordinated,'field-communication',[[1.1,1.45,2.8],[-.7,2,3],[-3.3,1.9,3.2]],P.feedback);
    const pa=trace(coordinated,'passenger-communication',[[1.1,1.45,2.8],[3.4,1.9,3.2],[6,2.3,1.95]],P.feedback);
    const context=trace(root,'access-event',[[7.4,1.4,-3.5],[4.6,1.6,-4.5],[-.8,2.5,-2.5]],P.muted,null,{moving:false});
    updates.push(s=>{
      const p=phase(s),show=s.signals!==false;report.node.visible=show;context.node.visible=show;
      report.token.position.copy(report.curve.getPoint(Math.min(1,p/.34)));
      for(const path of [call,pa]){path.node.visible=show;path.token.visible=p>=.68;path.token.position.copy(path.curve.getPoint(Math.min(1,Math.max(0,(p-.68)/.32))));}
    });
  }

  if(id==='occ-equipment'){
    const room=part(root,'operations-equipment-room');foundation(room,22,13);
    const ceiling=group(room,'removable-equipment-room-ceiling');box(ceiling,[14,.14,11],P.panel,[3,4.7,-.5]);shell(ceiling);explode(ceiling,[0,2,0]);
    const display=part(room,'occ-information-quality',[-8.3,.1,.3]);
    const deskBody=group(display,'operator-client');box(deskBody,[2.7,.14,1.5],P.blue,[0,1.1,0]);for(const x of [-1,1])box(deskBody,[.12,1.1,.8],M.core,[x,.55,0]);chair(deskBody,[0,0,1.4]);
    const picture=screen(display,2.25,1.35,[0,2,-.3],'track');picture.name='available-client-picture';
    const missing=group(display,'unavailable-client-picture',[0,2,-.3]);roundedPanel(missing,2.25,1.35,.12,P.dark);cross(missing,[0,0,.12],1.2);
    const a=rack(room,'occ-application-service',[-3.9,.1,-2.1],3.1,6);a.name='application-path-a';
    const b=rack(room,'occ-alternate-service',[-.5,.1,-2.1],3.1,6);b.name='application-path-b';
    const unavailableA=cross(a,[0,2.75,.63],.7),inactiveB=group(b,'inactive-alternative-marker',[0,2.75,.65]);box(inactiveB,[.65,.08,.04],P.muted);
    rack(room,'occ-supervisory-network',[3,.1,-2.1],2.7,5);
    rack(room,'occ-field-gateway',[6.5,.1,-2.1],2.7,4);
    const plant=group(room,'unchanged-remote-field-equipment',[8,.1,2.2]);fieldCabinet(plant);
    const recorder=rack(room,'operations-event-recording',[3,.1,2.3],2.7,5);
    const timeline=part(room,'occ-record-timeline',[5.5,.1,4.7]);
    box(timeline,[5.7,.15,1.25],P.blue,[0,.85,0]);for(const x of [-2.3,2.3])box(timeline,[.09,.8,.65],M.steel,[x,.42,0]);
    box(timeline,[5,.035,.06],P.pale,[0,.95,0]);for(const [x,material]of [[-1.8,P.request],[0,P.feedback],[1.8,P.panel]])box(timeline,[.35,.14,.55],material,[x,1,0]);
    const ups=part(room,'occ-uninterruptible-power',[-2,.1,2.7]);box(ups,[2.35,1.8,1.5],P.dark,[0,.9,0]);screen(ups,.65,.42,[-.55,1.35,.78],'power');for(let i=0;i<4;i++)box(ups,[1.8,.055,.04],P.panel,[0,.32+i*.19,.79]);
    const battery=group(ups,'removable-power-module');box(battery,[1.65,.6,1],P.panel,[0,.6,0]);explode(battery,[0,0,1.1]);
    const dataA=trace(room,'application-a-client',[[-8.3,1.7,-.15],[-6.2,1.3,-1.2],[-3.9,1.4,-1.5]],P.feedback,null,{moving:false});
    const dataB=trace(room,'application-b-client',[[-8.3,1.7,-.15],[-5.8,1.4,.7],[-.5,1.4,-1.5]],P.feedback,null,{moving:false});
    const outA=trace(room,'application-a-network',[[-3.9,1.4,-2.7],[-.3,1.1,-4.2],[3,1.3,-2.7]],P.feedback,null,{moving:false});
    const outB=trace(room,'application-b-network',[[-.5,1.4,-2.7],[1,1.1,-3.3],[3,1.3,-2.7]],P.feedback,null,{moving:false});
    const fieldLink=trace(room,'network-field',[[3,1.4,-1.5],[4.7,1.35,-.9],[6.5,1.4,-1.5],[8,1.3,1.7]],P.feedback,null,{moving:false});
    trace(room,'recorder-link',[[3,1.4,-1.4],[3,1.4,1.7]],P.panel,null,{moving:false});
    trace(room,'equipment-power-dependency',[[-2,.45,1.9],[-2,.35,0],[1,.35,-.6],[6.5,.35,-1.5]],P.request,'occ-uninterruptible-power',{moving:false});
    updates.push(s=>{
      const variant=selected(s),show=s.signals!==false;
      picture.visible=variant!=='display-loss';missing.visible=variant==='display-loss';
      dataA.node.visible=show&&variant==='normal';dataB.node.visible=show&&variant==='alternate';
      outA.node.visible=show&&variant!=='alternate';outB.node.visible=show&&variant==='alternate';fieldLink.node.visible=show;
      unavailableA.visible=variant==='alternate';inactiveB.visible=variant!=='alternate';
    });
  }

  if(id==='occ-workplace'){
    const env=part(root,'occ-workplace-environment');foundation(env,13,11);
    const deskAssembly=assembly(env,'operator-workplace',[0,.1,.9],'occ-task-display');
    const controls=part(deskAssembly,'occ-workstation-input');
    box(controls,[5.2,.16,2.1],P.blue,[0,1.38,0]);for(const x of [-2.1,2.1]){box(controls,[.15,1.3,1.2],M.core,[x,.65,0]);box(controls,[.55,.09,1.6],M.steel,[x,.05,0]);}
    const keyboard=group(controls,'removable-keyboard',[-.5,1.5,.49]);box(keyboard,[1.42,.06,.45],P.dark);for(let i=0;i<4;i++)box(keyboard,[1.2,.015,.03],P.muted,[0,.04,-.15+i*.1]);explode(keyboard,[0,.45,.5]);
    const pointing=group(controls,'pointing-device',[.6,1.51,.5]);box(pointing,[.42,.045,.45],P.panel);box(pointing,[.13,.06,.2],P.dark,[0,.05,0]);explode(pointing,[.4,.45,.5]);
    radio(controls,[1.8,1.55,.38],1.4);
    const displays=part(deskAssembly,'occ-task-display');
    for(const [x,w,mode]of [[-.9,2.5,'track'],[1.5,1.5,'queue']]){
      const monitor=group(displays,'removable-task-monitor',[x,2.45,-.5]);box(monitor,[.12,.65,.1],M.steel,[0,-.64,0]);screen(monitor,w,1.45,[0,0,0],mode);explode(monitor,[x*.35,.7,-.3]);
    }
    chair(controls,[-.5,0,2]);addRoleFigure(controls,api,[-.5,0,2],{seated:true,role:'signalling-controller',scale:1.13});
    // Light and acoustic panels are visible dependencies, not measured design.
    for(const x of [-5.5,5.5]){box(env,[.15,3.8,.15],P.blue,[x,1.9,-1.9]);box(env,[.9,2.1,.18],P.panel,[x,2.05,-2.3]);}
    box(env,[11.2,.12,.35],P.pale,[0,3.85,-1.9]);box(env,[8.7,.025,.16],P.white,[0,3.77,-1.9]);
    const shared=alternative(env,'shared-overview-present',['shared']);const wall=part(shared,'occ-shared-display',[0,0,-4]);
    box(wall,[9.3,3.5,.15],P.blue,[0,1.8,0]);screen(wall,5.4,1.55,[-1.7,2,.12],'track');screen(wall,2.6,1.55,[2.5,2,.12],'queue');
    const handover=alternative(env,'handover-records-present',['handover']);const records=part(handover,'occ-duty-handover');
    for(const x of [-4.2,4.2]){
      box(records,[1.6,.1,1.8],P.blue,[x,1.18,.3]);for(const z of [-.3,.9])box(records,[.08,1.1,.08],M.steel,[x,.6,z]);
      const sheet=group(records,x<0?'outgoing-record':'incoming-record',[x,1.25,.3]);box(sheet,[1.2,.03,1.35],P.paper);
      for(let i=0;i<4;i++)box(sheet,[.86,.015,.035],P.blue,[0,.035,-.4+i*.2]);
      const item=box(sheet,[.2,.035,.15],P.alert,[.35,.04,.4]);item.name='retained-outstanding-item';explode(sheet,[x*.1,.5,.2]);
    }
    const transfer=trace(records,'handover-exchange',[[-4.2,1.45,.3],[-3,1.65,2.2],[3,1.65,2.2],[4.2,1.45,.3]],P.feedback);
    updates.push(s=>{transfer.node.visible=s.signals!==false;transfer.token.position.copy(transfer.curve.getPoint(phase(s)));});
  }

  registerAnimator(state=>{for(const update of updates)update(state);});
  return root;
}
