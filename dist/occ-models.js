/* Original public teaching geometry. Room dimensions, equipment quantities and
 * software deployment are illustrative. This module builds physical workplace
 * equipment; application behaviour belongs in the readable OCC workspace. */
import {createEquipmentDetails} from './equipment-details.js';
import {createCommunicationsAssemblies} from './communications-models.js';
import {plateWithOpenings,perforatedPanel} from './precision-geometry.js';
export const OCC_VIEWS = {
  'operations-centre':{camera:[18,13,22],target:[0,1.3,0],distance:39},
  'occ-workplace':{camera:[7,5.4,10],target:[0,1.6,.2],distance:20},
  'occ-equipment':{camera:[13,9.5,17],target:[0,1.8,0],distance:30},
  'occ-supervision':{camera:[8,6.4,10],target:[0,1.7,.1],distance:19},
  // Compatibility only: this route opens People & processes.
  'occ-incident':{camera:[8,6.4,10],target:[0,1.7,.1],distance:19},
};
export function buildOccView(id,api){
  if(!OCC_VIEWS[id])return null;
  const {THREE,M,mat,startModel,group,part,mesh,box,cylinder,tube,roundedPanel,shell,explode,registerAnimator}=api;
  const root=startModel(id),updates=[],F=createCommunicationsAssemblies(api),E=createEquipmentDetails(api);
  const P={dark:mat(0x1c303b,.8,.08),frame:mat(0x526b74,.76,.18),pale:mat(0xcbd7d4,.82,.08),
    blue:mat(0x496e7d,.76,.13),board:mat(0x42746c,.8,.1),muted:mat(0x52616a,.85,.03),
    cyan:new THREE.MeshBasicMaterial({color:0x84bdc7}),amber:new THREE.MeshBasicMaterial({color:0xd7b36d}),
    white:new THREE.MeshBasicMaterial({color:0xd5dfd9}),red:new THREE.MeshBasicMaterial({color:0xc78b78})};
  const separate=(node,delta,label)=>E.separate(node,label,delta,{sources:['OC08','OC09','DP03'],stage:/cover|enclosure/i.test(label)?'Open enclosure':/keyboard|pointing|handset/i.test(label)?'Workplace interfaces':'Display and computing electronics',range:/cover|enclosure/i.test(label)?[0,.3]:[.35,1]});
  const physicalNames={'operations-centre':'Control-room layout','operations-equipment-room':'Technical equipment room','occ-console':'Control-room console','occ-task-display':'Task display','occ-shared-display':'Shared display wall','occ-workstation-input':'Keyboard and pointing device','operations-radio-dispatch':'Radio dispatch terminal','occ-client-computer':'Local workstation computer','occ-kvm-interface':'Remote workplace receiver','occ-display-controller':'Display distribution controller','occ-equipment-cabinet':'Equipment rack','occ-field-gateway':'Field interface gateway','occ-uninterruptible-power':'Uninterruptible power supply','occ-cable-route':'Cable containment and supply routes','occ-workplace-environment':'Room lighting and enclosure'};
  const assembly=(parent,component,at=[0,0,0],scale=1)=>{const p=part(parent,component,at);p.userData.explorationAssembly=component;p.scale.setScalar(scale);E.inspect(p,physicalNames[component]||'Installed equipment',{sources:['OC08','OC09']});return p;};
  const floor=(parent,w,d)=>box(parent,[w,.15,d],M.deck,[0,-.08,0]);
  const indicator=(parent,name,at,size=.1)=>F.indicator(parent,name,at,size);
  const cable=(parent,points,material=P.dark,radius=.027)=>tube(parent,points,radius,material,{segments:12});
  const enclosed=(...nodes)=>nodes.forEach(node=>node.traverse(o=>{if(o.isMesh)o.userData.concealedWhenAssembled=true;}));

  // Display content is a single non-interactive image surface. No alarm,
  // authority, request or recording concept becomes a tiny physical component.
  // Select the application workspace to read those functions at useful scale.
  function displaySurface(parent,w,h){
    const p=group(parent,'illustrative-screen-image');p.userData.decorativeScreen=true;
    mesh(p,new THREE.PlaneGeometry(w,h,12,8),new THREE.MeshBasicMaterial({color:0x233d48}),[0,0,.014]);
    return {node:p,set(_t,{available=true}={}){p.visible=available;}};
  }
  function monitor(parent,component,at=[0,0,0],w=2.3,h=1.3,mode='traffic',options={}){
    const p=assembly(parent,component,at),back=group(p,'monitor-back-enclosure');
    const bezel=group(p,'fixed-display-bezel');
    for(const y of [-h/2,h/2])box(bezel,[w+.06,.065,.12],P.dark,[0,y,.075]);
    for(const x of [-w/2,w/2])box(bezel,[.065,h,.12],P.dark,[x,0,.075]);
    const vents=mesh(back,perforatedPanel(THREE,{width:w-.035,height:h-.035,thickness:.04,columns:8,rows:2,holeRadius:.018,openingWidth:w*.52,openingHeight:h*.12,openingOffset:[0,h*.32]}),P.frame,[0,0,-.15]);vents.name='display-vent-panel';
    for(const y of [-h/2+.035,h/2-.035])box(back,[w-.035,.035,.22],P.frame,[0,y,-.025]);
    for(const x of [-w/2+.035,w/2-.035])box(back,[.035,h-.035,.22],P.frame,[x,0,-.025]);
    // Rear heat vents and the VESA-sized mounting boss give the enclosure a
    // physical front/back distinction without inventing a software component.
    box(back,[.29,.29,.055],P.dark,[0,0,-.19]);
    for(const x of [-.105,.105])for(const y of [-.105,.105])cylinder(back,.018,.015,M.steel,[x,y,-.224],[Math.PI/2,0,0],8);
    shell(back);separate(back,[0,0,-.65],'Monitor rear enclosure');
    const pcb=F.board(p,'monitor-controller-board',w*.49,h*.56,[w*.12,0,-.065]);separate(pcb,[w*.45,0,-.45],'Monitor controller board');
    const supply=group(p,'monitor-power-board',[-w*.3,-h*.13,-.03]);box(supply,[w*.21,h*.42,.055],P.board);
    for(const y of [-.12,.12])cylinder(supply,.055,.13,M.copper,[0,y,.07],[Math.PI/2,0,0],10);separate(supply,[-w*.4,.1,-.45],'Monitor power board');
    const panel=group(p,'monitor-lcd-panel');box(panel,[w*.97,h*.95,.035],P.dark,[0,0,.1]);separate(panel,[0,0,.44],'LCD panel');
    const display=displaySurface(panel,w*.91,h*.87);display.node.position.z=.125;
    if(options.wallMounted){
      const mount=group(p,'display-wall-bracket');
      for(const x of [-w*.28,w*.28])box(mount,[.09,h*.72,.065],M.steel,[x,0,-.25]);
      for(const y of [-h*.25,h*.25])box(mount,[w*.69,.075,.07],M.steel,[0,y,-.3]);
    }else{
      const stand=group(p,'monitor-stand');
      box(stand,[.13,h/2+.43,.105],M.steel,[0,-h/4-.21,-.29]);
      cylinder(stand,.095,.25,P.dark,[0,-.02,-.2],[Math.PI/2,0,0],12);
      const base=mesh(stand,plateWithOpenings(THREE,{width:w*.36,depth:.48,thickness:.045,radius:.12}),P.dark,[0,-h/2-.45,-.15]);base.name='weighted-monitor-foot';
    }
    E.port(p,{name:'monitor-video-input',label:'Monitor video input',at:[-w*.25,-h*.34,-.19],kind:'data',sources:['OC08','OC09']});
    E.port(p,{name:'monitor-power-input',label:'Monitor electrical supply',at:[w*.24,-h*.34,-.19],kind:'power',sources:['DP03']});
    const videoLead=E.route(p,{name:'monitor-video-controller',label:'Video input to display controller',points:[[-w*.25,-h*.34,-.19],[-w*.25,0,-.08],[w*.12,0,-.065]],kind:'data',from:'Video input',to:'Display controller board',sources:['OC08','OC09']});
    const supplyLead=E.route(p,{name:'monitor-supply-board',label:'Supply to monitor power board',points:[[w*.24,-h*.34,-.19],[w*.24,-h*.4,-.08],[-w*.3,-h*.4,-.08],[-w*.3,-h*.13,-.03]],kind:'power',from:'Supply inlet',to:'Power board',sources:['DP03']});
    enclosed(pcb,supply,videoLead,supplyLead);
    E.paths(p,[{id:'display-frame',label:'Video to visible frame',description:'A video interface, controller and panel are distinct from the display power supply.',steps:[{label:'Video input',nodeName:'monitor-video-input'},{label:'Controller',nodeName:'monitor-controller-board'},{label:'Panel',nodeName:'monitor-lcd-panel'}],sources:['OC08','OC09']},{id:'display-supply',label:'Display supply',description:'The power inlet supplies the power board independently of the video signal.',steps:[{label:'Power inlet',nodeName:'monitor-power-input'},{label:'Power board',nodeName:'monitor-power-board'}],sources:['DP03']}]);
    return {node:p,display,pcb,panel,supply};
  }
  function chair(parent,at){
    const p=group(parent,'empty-console-chair',at);
    mesh(p,plateWithOpenings(THREE,{width:.73,depth:.67,thickness:.11,radius:.2}),P.blue,[0,.72,0]);
    roundedPanel(p,.69,.63,.13,P.blue,[0,1.08,.29],.12);box(p,[.13,.44,.1],P.dark,[0,.82,.36]);
    cylinder(p,.065,.49,M.steel,[0,.4,0],null,12);cylinder(p,.11,.22,P.dark,[0,.25,0],null,12);
    for(const x of [-.41,.41]){box(p,[.055,.31,.055],P.dark,[x,.78,.08]);box(p,[.12,.065,.43],P.dark,[x,.96,-.04]);}
    for(let i=0;i<5;i++){
      const leg=group(p,'chair-leg');leg.rotation.y=i*Math.PI*2/5;
      box(leg,[.075,.055,.48],M.steel,[0,.13,.2]);
      for(const x of [-.045,.045])cylinder(leg,.06,.035,P.dark,[x,.075,.43],[0,0,Math.PI/2],10);
    }return p;
  }
  function clientComputer(parent,at=[0,0,0],remote=false){
    const p=assembly(parent,remote?'occ-kvm-interface':'occ-client-computer',at),w=remote?.78:1.1,h=remote?.25:.55,d=remote?.55:.8;
    box(p,[w,.045,d],M.steel,[0,-h/2,0]);for(const x of [-w/2,w/2])box(p,[.035,h,d],P.frame,[x,0,0]);
    const lid=group(p,remote?'kvm-receiver-cover':'client-computer-cover');box(lid,[w,.04,d],P.blue,[0,h/2,0]);shell(lid);separate(lid,[0,.5,0],remote?'KVM receiver cover':'Client computer cover');
    const pcb=F.board(p,remote?'kvm-interface-board':'client-computer-board',w*.8,d*.7,[0,-h*.3,0]);pcb.rotation.x=-Math.PI/2;separate(pcb,[0,.3,.2],remote?'KVM interface board':'Client computer board');
    enclosed(pcb);
    for(let i=0;i<3;i++)box(p,[w*.16,h*.3,.045],P.dark,[-w*.27+i*w*.27,0,d/2+.01]);
    const active=indicator(p,remote?'kvm-received-frame':'client-rendered-frame',[-w*.35,h*.2,d/2+.04],.065);
    for(const [i,label,kind]of [[0,'Input devices','data'],[1,remote?'Remote workplace link':'Application network','data'],[2,'Display video','data'],[3,'Equipment supply','power']])E.port(p,{name:'client-interface-'+i,label,at:[-w*.35+i*w*.23,0,-d/2-.06],kind,scale:remote?.6:.8,sources:kind==='power'?['DP03']:['OC08']});
    E.paths(p,[{id:'workplace-computing',label:remote?'Remote workplace interfaces':'Local computer interfaces',description:remote?'The receiver transports input and video; the remote host executes the application.':'The local computer accepts inputs and renders a frame for the display.',steps:[{label:'Input',nodeName:'client-interface-0'},{label:remote?'Remote link':'Network',nodeName:'client-interface-1'},{label:'Electronics',nodeName:remote?'kvm-interface-board':'client-computer-board'},{label:'Video',nodeName:'client-interface-2'}],sources:['OC08']}]);
    return {node:p,active};
  }
  function consoleAssembly(parent,at=[0,0,0],scale=1,{mode='traffic',information=false,legacy=false,remote=false}={}){
    const p=assembly(parent,'occ-console',at,scale);p.name='physical-console';
    const desktop=mesh(p,plateWithOpenings(THREE,{width:4.8,depth:1.95,thickness:.13,radius:.24,holes:[[-1.65,-.72,.11],[1.5,-.72,.11]]}),P.blue,[0,1.25,0]);desktop.name='desktop-with-cable-grommets';
    for(const x of [-1.95,1.95]){
      box(p,[.14,1.12,.78],M.core,[x,.62,0]);
      mesh(p,plateWithOpenings(THREE,{width:.5,depth:1.6,thickness:.075,radius:.12}),M.steel,[x,.08,0]);
      for(const z of [-.65,.65])cylinder(p,.07,.055,P.dark,[x,.025,z],null,10);
    }
    box(p,[3.9,.22,.08],M.core,[0,1.06,-.62]);
    const cableChannel=group(p,'under-desk-cable-channel');
    box(cableChannel,[3.25,.04,.3],M.steel,[.12,1.06,-.76]);box(cableChannel,[3.25,.18,.035],M.steel,[.12,1.13,-.9]);
    const tray=group(p,'client-computer-mounting-tray');tray.visible=!remote;
    box(tray,[1.24,.045,.9],M.steel,[-1.74,.49,-.24]);
    for(const x of [-2.34,-1.14])box(tray,[.04,.68,.44],M.steel,[x,.825,-.24]);
    for(const x of [-1.65,1.5])cable(p,[[x,1.08,-.72],[x,1.36,-.72],[x+.22,1.44,-.57]],P.dark,.022);
    const controls=assembly(p,'occ-workstation-input');
    const keyboard=group(controls,'removable-keyboard',[-.63,1.37,.4]);box(keyboard,[1.26,.055,.4],P.dark);
    for(let j=0;j<4;j++)for(let i=0;i<9;i++)box(keyboard,[.09,.014,.044],P.muted,[-.49+i*.12,.035,-.13+j*.08]);separate(keyboard,[0,.4,.4],'Keyboard');
    const pointing=group(controls,'pointing-device',[.43,1.38,.4]);box(pointing,[.37,.025,.41],P.frame);box(pointing,[.14,.07,.22],P.dark,[0,.05,0]);separate(pointing,[.4,.4,.4],'Pointing device');
    const radio=assembly(p,'operations-radio-dispatch',[1.75,1.4,.25]);box(radio,[.5,.16,.51],P.dark);box(radio,[.29,.14,.27],P.blue,[0,.12,-.04]);
    const hand=group(radio,'communications-handset',[.35,.19,0]);box(hand,[.14,.52,.14],P.dark);
    for(const y of [-.22,.22])box(hand,[.21,.13,.19],P.blue,[0,y,0]);separate(hand,[.35,.4,.2],'Communications handset');cable(radio,[[.3,0,0],[.2,-.07,.3],[-.12,.1,.16]],P.dark,.017);
    const main=monitor(p,'occ-task-display',[-.73,2.48,-.47],2.45,1.37,mode,{information,legacy});main.node.name='task-monitor';
    const side=monitor(p,'occ-task-display',[1.35,2.42,-.45],1.42,1.25,'station');side.node.name='event-monitor';
    const local=clientComputer(p,[-1.74,.8,-.24],false),receiver=clientComputer(p,[-1.65,1.48,-.44],true);
    local.node.visible=!remote;receiver.node.visible=remote;
    const hostAt=remote?[-1.65,1.48,-.44]:[-1.74,.8,-.24],hostWidth=remote?.78:1.1,hostDepth=remote?.55:.8;
    E.route(p,{name:'console-video-cable',label:remote?'KVM receiver to task display':'Local computer to task display',points:remote?[[hostAt[0]+hostWidth*.11,hostAt[1],hostAt[2]-hostDepth/2-.06],[-1.42,1.67,-.72],[-1.3425,2.0142,-.66]]:[[hostAt[0]+hostWidth*.11,hostAt[1],hostAt[2]-hostDepth/2-.06],[-1.65,1.02,-.72],[-1.65,1.42,-.72],[-1.3425,2.0142,-.66]],kind:'data',from:remote?'KVM video output':'Computer video output',to:'Task monitor video input',sources:['OC08']});
    E.route(p,{name:'console-input-cable',label:'Keyboard input connection',points:remote?[[-.63,1.38,.2],[-.63,1.42,-.49],[hostAt[0]-hostWidth*.35,hostAt[1],hostAt[2]-hostDepth/2-.06]]:[[-.63,1.38,.2],[-1.65,1.42,-.72],[-1.65,1.02,-.72],[hostAt[0]-hostWidth*.35,hostAt[1],hostAt[2]-hostDepth/2-.06]],kind:'data',from:'Keyboard',to:remote?'KVM input':'Computer input',sources:['OC08']});
    const powerStrip=group(p,'console-supply-distribution',[.65,.92,-.71]);E.inspect(powerStrip,'Console power distribution',{sources:['DP03']});
    box(powerStrip,[1.1,.12,.17],P.dark);
    for(let i=0;i<3;i++){
      const socket=group(powerStrip,'console-supply-socket-'+i,[(i-1)*.3,-.065,0]);
      box(socket,[.18,.014,.12],P.pale);for(const x of [-.035,.035])box(socket,[.018,.018,.04],P.dark,[x,-.01,0]);
    }
    E.route(p,{name:'console-display-supply',label:'Task monitor supply lead',points:[[.65,.85,-.71],[.65,1.05,-.87],[-.142,1.05,-.87],[-.142,2.0142,-.66]],kind:'power',from:'Console power distribution',to:'Task monitor supply',sources:['DP03']});
    E.paths(p,[{id:'console-input-to-frame',label:remote?'Remote workstation path':'Local workstation path',description:'Select the individual input device, computing interface and monitor while keeping their physical identities.',steps:[{label:'Keyboard',nodeName:'removable-keyboard'},{label:'Input lead',nodeName:'console-input-cable'},{label:remote?'KVM receiver':'Local computer',conceptId:remote?'occ-kvm-interface':'occ-client-computer',nodeName:remote?'occ-kvm-interface':'occ-client-computer'},{label:'Video lead',nodeName:'console-video-cable'},{label:'Task monitor',nodeName:'task-monitor'}],sources:['OC08','OC09']}]);
    chair(p,[-.65,0,1.65]);
    return {node:p,main,side,local,receiver,set(){main.display.set(0);side.display.set(0);local.active.set(true);receiver.active.set(true);}};
  }
  function sharedWall(parent,at=[0,0,0],scale=1){
    const p=assembly(parent,'occ-shared-display',at,scale);
    for(const x of [-2.7,2.7])box(p,[.14,3.4,.2],M.steel,[x,1.7,0]);box(p,[6.5,2.5,.18],P.frame,[0,2.4,0]);
    const displays=[];for(const [x,mode]of [[-1.6,'traffic'],[1.6,'power']]){const m=monitor(p,'occ-shared-display',[x,2.5,.38],3.02,1.9,mode,{wallMounted:true});m.node.name='shared-display-panel';displays.push({...m,mode});}
    const controllerOwner=assembly(p,'occ-display-controller',[0,.65,.05]);
    box(controllerOwner,[.92,.035,.68],P.frame,[0,-.15,0]);
    const controller=clientComputer(controllerOwner,[0,0,0],true);
    return {node:p,set(){for(const m of displays)m.display.set(0);controller.active.set(true);}};
  }
  function cabinet(parent,at=[0,0,0],scale=1){
    const p=assembly(parent,'occ-equipment-cabinet',at,scale);
    for(const x of [-1.35,1.35])for(const z of [-.85,.85])box(p,[.09,5.35,.09],M.steel,[x,2.73,z]);
    for(const y of [.08,5.4])box(p,[2.85,.12,1.85],P.frame,[0,y,0]);
    const side=group(p,'rack-side-enclosure');box(side,[.045,5.3,1.8],P.blue,[-1.43,2.72,0]);box(side,[2.85,5.3,.045],P.frame,[0,2.72,-.93]);shell(side);separate(side,[-.65,.1,-.5],'Rack side and rear enclosure');E.rackServices(p,{width:2.85,height:5.4,depth:1.85});return p;
  }
  function systems(parent,{at=[0,0,0],scale=1}={}){
    const p=assembly(parent,'operations-equipment-room',at,scale);
    box(p,[9.65,.06,2.08],M.deck,[0,-.02,0]);
    const compute=cabinet(p,[-3.3,0,0]),network=cabinet(p,[0,0,0]),power=cabinet(p,[3.3,0,0]);
    const a=F.server(compute,'occ-application-service',[0,.35,0],.9);a.node.name='application-host-a';
    const b=F.server(compute,'occ-alternate-service',[0,2.8,0],.9);b.node.name='application-host-b';
    const sw=F.networkSwitch(network,[0,4.6,0],2.6,'occ-supervisory-network');
    const gatewayOwner=assembly(network,'occ-field-gateway',[0,3.5,0]),gateway=F.router(gatewayOwner,[0,0,0]);
    for(const x of [-1.36,1.36])box(gatewayOwner,[.16,.48,.12],M.steel,[x,0,.6]);
    const patch=F.patchPanel(network,[0,2.55,0]),recorder=F.server(network,'operations-event-recording',[0,.25,0],.9,true);recorder.node.name='event-recorder-hardware';
    const ups=assembly(power,'occ-uninterruptible-power',[0,1.05,0]),unit=F.powerUnit(ups);unit.node.name='ups-conversion-and-storage';
    box(ups,[2.72,.08,1.38],P.frame,[0,-.5,0]);
    const displayOwner=assembly(power,'occ-display-controller',[0,3.05,.05]),controller=clientComputer(displayOwner,[0,0,0],true);
    box(displayOwner,[.92,.035,.68],P.frame,[0,-.15,0]);
    const supply=part(power,'occ-cable-route');for(const yy of [1.2,3,4.7])cable(supply,[[1.05,.55,-.4],[1.12,yy,-.5],[.35,yy,-.5]],M.copper,.035);
    cable(network,[[-1.1,4.6,.65],[-1.24,4.3,1.02],[-.8,3.5,.65]],P.cyan,.025);cable(network,[[.6,3.5,.65],[1.12,3.1,1.03],[.7,2.55,.75]],P.amber,.025);
    return {node:p,a,b,recorder,sw,gateway,patch,ups,unit,set(){
      a.state.set(true);b.state.set(true);recorder.state.set(true);controller.active.set(true);
    }};
  }
  function cableTray(parent,points){
    const p=assembly(parent,'occ-cable-route');
    for(let i=1;i<points.length;i++){
      const a=new THREE.Vector3(...points[i-1]),b=new THREE.Vector3(...points[i]),mid=a.clone().add(b).multiplyScalar(.5),delta=b.clone().sub(a),length=delta.length();
      const rail=group(p,'cable-tray-section',mid.toArray());rail.rotation.y=-Math.atan2(delta.z,delta.x);box(rail,[length,.06,.38],P.frame);
      for(const z of [-.18,.18])box(rail,[length,.15,.025],M.steel,[0,.065,z]);
      for(const z of [-.08,0,.08])box(rail,[length,.025,.025],z?P.dark:M.copper,[0,.052,z]);
    }return p;
  }
  if(id==='operations-centre'){
    const room=assembly(root,'operations-centre');floor(room,18,12.6);
    const enclosure=group(room,'room-cutaway-enclosure');box(enclosure,[18,3.6,.12],P.frame,[0,1.8,-6.3]);box(enclosure,[.12,3.6,12.6],P.frame,[-9,1.8,0]);shell(enclosure);separate(enclosure,[0,.6,-.5],'Room enclosure');
    const wall=sharedWall(room,[-3.1,0,-4.5],.95);
    const desks=[[-5.7,0,-.6],[-.7,0,-.6],[-5.7,0,3.3],[-.7,0,3.3]].map((at,i)=>consoleAssembly(room,at,.78,{mode:['traffic','power','station','traffic'][i],remote:true}));
    const technical=systems(room,{at:[5.5,0,-1.8],scale:.53});
    const boundary=group(room,'technical-room-boundary');box(boundary,[.13,1,8.8],P.frame,[2.45,.5,-1.6]);for(const z of [-4.6,2.1])box(boundary,[.12,3.5,.12],P.frame,[2.45,1.75,z]);
    cableTray(room,[[5.5,.1,2.0],[1.2,.1,2.0],[1.2,.1,-2.2],[-5.7,.1,-2.2]]);
    updates.push(()=>{desks.forEach(d=>d.set());wall.set();technical.set();});
  }else if(id==='occ-equipment'){
    const room=assembly(root,'operations-equipment-room');floor(room,14.7,8.1);
    const technical=systems(room,{at:[1.2,0,-.75]}),console=consoleAssembly(room,[-5.2,0,1.8],.58,{remote:true});
    cableTray(room,[[-5.2,.13,.3],[-5.2,.13,-2.2],[4.4,.13,-2.2]]);
    updates.push(()=>{technical.set();console.set();});
  }else{
    const workplace=id==='occ-workplace',legacy=id==='occ-incident';
    const environment=assembly(root,'occ-workplace-environment');floor(environment,8.8,6.8);
    const variants=group(environment,'fixed-workplace-equipment'),desks={};
    for(const mode of workplace?['task','shared']:['shared']){const g=group(variants,'workplace-arrangement-'+mode);desks[mode]=consoleAssembly(g,[0,0,.45],1,{remote:mode==='shared'});}
    const wall=sharedWall(environment,[0,0,-2.85],.72);
    const light=group(environment,'room-lighting-and-enclosure');E.inspect(light,'Room lighting and enclosure',{sources:['OC02','OC06']});for(const x of [-3.9,3.9]){box(light,[.1,3.6,.1],P.frame,[x,1.8,-1.8]);box(light,[.75,1.8,.12],P.muted,[x,2.1,-1.9]);}box(light,[7.9,.1,.25],P.pale,[0,3.6,-1.8]);
    updates.push(s=>{
      const mode=workplace&&s.variant!=='shared'?'task':'shared';
      for(const [key,d]of Object.entries(desks)){d.node.parent.visible=key===mode;d.set();}
      wall.node.visible=workplace&&mode==='shared';wall.set();
    });
  }
  registerAnimator(s=>{for(const update of updates)update(s);});
  for(const update of updates)update({phase:0,variant:id==='occ-workplace'?'task':id==='occ-equipment'?'normal':'traffic'});
  return root;
}

