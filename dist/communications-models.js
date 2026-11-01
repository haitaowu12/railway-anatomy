/* Original generic equipment geometry. Internal arrangements are explanatory,
 * not vendor drawings. Motion illustrates relationships with invented timing;
 * it does not implement railway operating rules or equipment safety functions. */
export const COMMUNICATIONS_VIEWS={
  'communications-overview':{camera:[20,17,23],target:[0,1.4,0],distance:39},
  'communications-network':{camera:[11,8,14],target:[0,2,0],distance:25},
  'communications-scada':{camera:[18,12,20],target:[0,1.6,.1],distance:34},
  'communications-telephony':{camera:[16,11,19],target:[0,1.4,0],distance:31},
  'communications-passenger':{camera:[16,11,20],target:[0,1.3,0],distance:31},
  'communications-security':{camera:[14,11,18],target:[0,1.4,0],distance:29},
};
const VARIANTS={
  'communications-overview':['supervision','passenger','voice'],
  'communications-network':['station','onboard'],
  'communications-scada':['status','command','stale'],
  'communications-telephony':['help-point','operational-radio'],
  'communications-passenger':['information','announcement'],
  'communications-security':['video','access'],
};

// Shared by the focused communications views and the existing station scenes.
// Each assembly has real removable descendants, not a translated root alone.
export function createCommunicationsAssemblies(api){
  const {THREE,C,M,mat,group,part,mesh,box,cylinder,tube,roundedPanel,shell,explode}=api;
  const P={metal:mat(0x7f9198,.58,.45),pale:mat(0xcbd6d3,.7,.12),dark:mat(0x1c313b,.8,.1),blue:mat(0x4c6f7b,.72,.13),board:mat(0x467971,.82,.08),chip:mat(0x243e44,.85,.08),copper:mat(0xbb9670,.55,.4),amber:new THREE.MeshBasicMaterial({color:0xd5b171}),cyan:new THREE.MeshBasicMaterial({color:0x80bdc8}),muted:mat(0x596970,.83,.08),red:new THREE.MeshBasicMaterial({color:0xc98975}),white:new THREE.MeshBasicMaterial({color:0xd7dfd8})};
  const assembly=(parent,id,at=[0,0,0],scale=1)=>{const g=part(parent,id,at);g.userData.explorationAssembly=id;g.scale.setScalar(scale);return g;};
  function board(parent,name,w,h,at=[0,0,0]){
    const g=group(parent,name,at);box(g,[w,h,.045],P.board);
    for(const [x,y]of [[-.23,.19],[.18,.16],[-.18,-.18],[.22,-.18]])box(g,[w*.2,h*.19,.045],P.chip,[x*w,y*h,.045]);
    for(let i=0;i<4;i++)box(g,[w*.15,.018,.015],P.copper,[-w*.26+i*w*.17,-h*.43,.032]);
    for(const x of [-w*.42,w*.42])for(const y of [-h*.4,h*.4])cylinder(g,.026,.012,M.steel,[x,y,.032],[Math.PI/2,0,0],6);
    return g;
  }
  function indicator(parent,name,at,size=.09){
    const g=group(parent,name,at),off=box(g,[size,size,.025],P.muted),on=box(g,[size,size,.03],P.cyan,[0,0,.004]);on.visible=false;
    return {node:g,off,on,set(value){on.visible=Boolean(value);off.visible=!value;}};
  }
  function picture(parent,w,h,at,kind='rows'){
    const g=group(parent,`screen-${kind}`,at);roundedPanel(g,w,h,.08,P.dark,[0,0,0],.04);
    box(g,[w*.91,h*.81,.012],M.glass,[0,0,.05]);
    const oldPattern=group(g,'display-earlier-pattern'),newPattern=group(g,'display-updated-pattern');
    const rows=(p,change)=>{for(let i=0;i<3;i++)box(p,[w*(change?.66-i*.09:.72-i*.13),h*.055,.018],change?P.cyan:P.amber,[-w*.06-i*w*.025,h*(.23-i*.23),.063]);};
    if(kind==='position'||kind==='door'){
      for(const p of [oldPattern,newPattern]){for(const x of [-.28,.28])box(p,[w*.025,h*.62,.018],P.pale,[x*w,0,.063]);box(p,[w*.58,h*.025,.018],P.pale,[0,h*.31,.063]);}
      if(kind==='position'){
        for(let i=0;i<3;i++){box(oldPattern,[w*.5,h*.1,.02],P.amber,[0,h*(.18-i*.18),.068]);box(newPattern,[w*.5,h*.025,.02],P.cyan,[0,h*(.18-i*.18),.068]);}
      }else{
        box(oldPattern,[w*.49,h*.56,.018],P.blue,[0,0,.068]);box(newPattern,[w*.44,h*.54,.018],P.cyan,[-w*.15,0,.068],[0,0,-.35]);
      }
    }else if(kind==='video'){
      for(const p of [oldPattern,newPattern]){box(p,[w*.73,h*.19,.015],P.blue,[0,-h*.24,.063]);box(p,[w*.12,h*.5,.02],P.pale,[-w*.24,0,.066]);box(p,[w*.13,h*.4,.02],P.pale,[w*.2,-h*.05,.066]);box(p,[w*.72,h*.025,.02],P.cyan,[0,h*.27,.067]);}
    }else rows(oldPattern,false),rows(newPattern,true);
    newPattern.visible=false;
    return {node:g,oldPattern,newPattern,set(value){oldPattern.visible=!value;newPattern.visible=Boolean(value);}};
  }
  function screenTerminal(parent,component,at=[0,0,0],scale=1,kind='rows'){
    const g=assembly(parent,component,at,scale);
    box(g,[2.1,.13,1.1],P.blue,[0,.9,0]);for(const x of [-.8,.8])box(g,[.1,.85,.68],P.metal,[x,.45,0]);
    const monitor=group(g,'terminal-monitor',[0,1.62,-.16]);const display=picture(monitor,1.62,.96,[0,0,0],kind);
    box(monitor,[.1,.45,.12],M.steel,[0,-.58,-.04]);explode(monitor,[0,.55,-.1]);
    const keyboard=group(g,'terminal-keyboard',[0,1.0,.3]);box(keyboard,[1.05,.04,.3],P.dark);for(let i=0;i<3;i++)box(keyboard,[.88,.008,.023],P.pale,[0,.025,-.09+i*.08]);explode(keyboard,[0,.25,.35]);
    const request=indicator(g,'operator-request-marker',[-.82,1.05,.38],.15);
    const handset=group(g,'answering-handset',[1.17,1.04,.05]);box(handset,[.15,.55,.15],P.dark);box(handset,[.23,.14,.2],P.blue,[0,.22,0]);box(handset,[.23,.14,.2],P.blue,[0,-.22,0]);explode(handset,[.35,.35,.2]);
    return {node:g,display,request,handset};
  }
  function networkSwitch(parent,at=[0,0,0],width=2.6,component='network-switch',rugged=false){
    const g=assembly(parent,component,at,width/2.6),w=2.6,d=1.25,h=rugged?.55:.42;
    box(g,[w,.045,d],P.metal,[0,-h/2,0]);for(const x of [-w/2,w/2])box(g,[.045,h,d],P.metal,[x,0,0]);
    box(g,[w,h,.06],P.blue,[0,0,d/2]);box(g,[w,h,.045],P.metal,[0,0,-d/2]);
    const lid=group(g,rugged?'onboard-module-cover':'switch-cover');box(lid,[w+.04,.045,d+.02],P.blue,[0,h/2,0]);shell(lid);explode(lid,[0,.8,-.05]);
    const pcb=board(g,rugged?'onboard-network-board':'switch-circuit-board',1.85,.82,[0,-.03,0]);pcb.rotation.x=-Math.PI/2;explode(pcb,[0,.55,.12]);
    const supply=group(g,'switch-supply-module',[-1.01,0,-.2]);box(supply,[.34,.2,.57],P.dark);for(let j=0;j<3;j++)box(supply,[.04,.18,.4],P.metal,[-.1+j*.1,.05,0]);explode(supply,[-.55,.2,-.1]);
    const connectors=group(g,rugged?'onboard-connector-bank':'copper-port-bank');
    for(let i=0;i<4;i++){
      const x=-.93+i*.42;
      if(rugged){cylinder(connectors,.12,.09,M.steel,[x,0,.67],[Math.PI/2,0,0],12);cylinder(connectors,.075,.095,P.dark,[x,0,.69],[Math.PI/2,0,0],8);for(let j=0;j<4;j++)cylinder(connectors,.012,.012,P.copper,[x+(j%2?1:-1)*.028,(j<2?1:-1)*.028,.745],[Math.PI/2,0,0],5);}
      else{box(connectors,[.28,.16,.1],P.dark,[x,-.02,.665]);for(let j=0;j<4;j++)box(connectors,[.025,.028,.01],P.copper,[x-.075+j*.05,-.05,.723]);}
      box(g,[.055,.035,.02],P.cyan,[x,h*.32,.665]);
    }
    explode(connectors,[0,.2,.55]);
    if(!rugged){
      const sfp=assembly(g,'optical-transceiver',[.91,-.025,.55]);sfp.name='removable-optical-transceiver';box(sfp,[.36,.16,.47],M.steel);
      box(sfp,[.3,.12,.035],P.dark,[0,0,.25]);for(const x of [-.073,.073])box(sfp,[.085,.065,.045],P.cyan,[x,0,.276]);
      box(sfp,[.25,.04,.13],P.board,[0,0,-.29]);explode(sfp,[0,0,.85]);
      box(g,[.46,.22,.05],P.dark,[.91,-.025,.63]);
    }else for(let i=0;i<7;i++)box(g,[.032,h+.035,d*.82],P.metal,[-.98+i*.32,0,-.04]);
    return {node:g,pcb,lid};
  }
  function patchPanel(parent,at=[0,0,0]){
    const g=assembly(parent,'fiber-patch-panel',at);box(g,[2.65,.25,.06],P.pale,[0,0,.66]);
    const tray=group(g,'fibre-management-tray');box(tray,[2.5,.035,1.2],P.metal,[0,-.1,0]);
    for(const x of [-.62,.62]){const loop=mesh(tray,new THREE.TorusGeometry(.31,.018,5,20),P.amber,[x,-.065,0],[Math.PI/2,0,0]);loop.scale.z=.65;}
    for(let i=0;i<5;i++){const x=-1+i*.5;box(g,[.19,.12,.11],P.blue,[x,0,.73]);tube(tray,[[x,-.06,.6],[x*.7,-.06,.23],[x<0?-.6:.6,-.06,-.22]],.012,P.amber,{segments:8});}
    explode(tray,[0,.45,-.8]);
    const backbone=assembly(g,'fiber-backbone');tube(backbone,[[-1.2,0,-.5],[-1.6,-.15,-.65],[-1.65,-.5,-.85]],.045,P.amber,{segments:8});return {node:g,tray};
  }
  function router(parent,at=[0,0,0],component='communications-router'){
    const g=assembly(parent,component,at);box(g,[2.55,.045,1.15],P.metal,[0,-.23,0]);for(const x of [-1.27,1.27])box(g,[.04,.48,1.15],P.metal,[x,0,0]);
    box(g,[2.55,.46,.07],P.dark,[0,0,.59]);for(let i=0;i<3;i++)box(g,[.3,.16,.025],P.pale,[-.79+i*.49,0,.64]);
    const pcb=board(g,'router-interface-board',1.95,.85,[0,-.12,0]);pcb.rotation.x=-Math.PI/2;explode(pcb,[0,.6,.2]);
    const lid=group(g,'router-cover');box(lid,[2.6,.04,1.2],P.blue,[0,.25,0]);shell(lid);explode(lid,[0,.75,0]);
    const port=group(g,'router-uplink-module',[.88,0,.45]);box(port,[.38,.22,.34],M.steel);box(port,[.3,.14,.025],P.cyan,[0,0,.19]);explode(port,[.35,.1,.55]);return {node:g,pcb};
  }
  function powerUnit(parent,at=[0,0,0],scale=1){
    const g=assembly(parent,'communications-power',at,scale);box(g,[2.6,.05,1.25],P.metal,[0,-.45,0]);for(const x of [-1.3,1.3])box(g,[.04,.94,1.25],P.metal,[x,0,0]);
    const front=group(g,'ups-front-cover');box(front,[2.6,.94,.045],P.blue,[0,0,.65]);picture(front,.54,.28,[-.79,.14,.69]);for(let i=0;i<5;i++)box(front,[.85,.025,.02],P.dark,[.39,-.3+i*.13,.69]);shell(front);explode(front,[0,0,.85]);
    const battery=group(g,'ups-battery-cassette',[.42,-.08,0]);box(battery,[1.4,.63,.89],P.dark);for(const x of [-.36,.36]){box(battery,[.59,.57,.8],P.muted,[x,.05,0]);box(battery,[.05,.05,.1],P.copper,[x,.36,.2]);}box(battery,[1.2,.07,.05],P.metal,[0,.02,.5]);explode(battery,[.6,0,1]);
    const pcb=board(g,'ups-conversion-board',.64,.8,[-.87,0,0]);pcb.rotation.y=Math.PI/2;explode(pcb,[-.65,.3,0]);return {node:g,battery,pcb};
  }
  function networkCabinet(parent,at=[0,0,0],scale=1){
    const g=assembly(parent,'telecom-rack',at,scale);
    for(const x of [-1.5,1.5])for(const z of [-.77,.77])box(g,[.09,5.05,.09],M.steel,[x,2.62,z]);
    for(const y of [.1,5.13])box(g,[3.12,.12,1.68],P.metal,[0,y,0]);
    const side=group(g,'network-rack-enclosure');box(side,[.05,5,1.64],P.blue,[-1.56,2.62,0]);box(side,[3.1,5,.045],P.muted,[0,2.62,-.83]);shell(side);explode(side,[-.75,.2,-.5]);
    patchPanel(g,[0,4.57,0]);networkSwitch(g,[0,3.65,0]);router(g,[0,2.6,0]);powerUnit(g,[0,.94,0]);
    for(const x of [-1,-.5,.0,.5,1])tube(g,[[x,4.57,.78],[x+.08,4.32,1.0],[x*.8,3.62,.77]],.018,P.amber,{segments:9});
    tube(g,[[.91,3.6,.84],[1.32,3.25,1.02],[.87,2.61,.8]],.025,P.cyan,{segments:9});
    tube(g,[[-1.25,.95,-.3],[-1.35,1.4,-.45],[-1.35,3.5,-.45],[-1.08,3.63,-.4]],.035,P.copper,{segments:10});
    return {node:g};
  }
  function rtuPanel(parent,at=[0,0,0],scale=1,component='scada-rtu'){
    const g=assembly(parent,component,at,scale);box(g,[3.05,3.75,.08],P.metal,[0,2,-.25]);
    for(const y of [.55,1.5,2.6,3.5])box(g,[2.77,.08,.09],M.steel,[0,y,-.1]);
    for(const x of [-1.46,1.46])box(g,[.08,3.75,.7],P.metal,[x,2,.07]);
    const cover=group(g,'rtu-cabinet-cover');box(cover,[3.03,3.75,.045],P.pale,[0,2,.65]);shell(cover);explode(cover,[1.1,.2,1]);
    const cpu=group(g,'rtu-processor-module',[-.99,2.53,.17]);box(cpu,[.57,1.04,.42],P.blue);picture(cpu,.38,.31,[0,.15,.25]);explode(cpu,[-.7,.2,.5]);
    const inputs=assembly(g,'scada-input-module',[-.27,2.47,.18]);
    for(let i=0;i<2;i++){const m=group(inputs,i?'analogue-input-card':'digital-input-card',[i*.48,0,0]);box(m,[.38,1.1,.42],P.pale);for(let j=0;j<3;j++)box(m,[.24,.1,.025],P.dark,[0,-.32+j*.23,.23]);explode(m,[i*.15,.1,.65]);}
    const input=indicator(inputs,'scada-acquired-input',[.24,.4,.25],.12);
    const outputs=assembly(g,'scada-output-module',[.87,2.47,.18]);box(outputs,[.53,1.1,.42],P.blue);
    const relay=group(outputs,'scada-output-relay-armature',[0,-.04,.26]);box(relay,[.26,.04,.035],P.copper,[-.09,0,0]);box(outputs,[.07,.06,.07],P.metal,[.14,-.04,.28]);
    const output=indicator(outputs,'scada-output-indication',[0,.4,.25],.13);explode(outputs,[.5,.1,.6]);
    const ps=group(g,'rtu-power-module',[-.98,1.05,.15]);box(ps,[.55,.64,.4],P.dark);for(let i=0;i<4;i++)box(ps,[.025,.42,.04],P.metal,[-.17+i*.11,0,.23]);explode(ps,[-.7,0,.5]);
    const terminals=group(g,'rtu-field-terminal-strip',[.34,.94,.18]);for(let i=0;i<8;i++){box(terminals,[.18,.33,.23],P.blue,[-.8+i*.24,0,0]);cylinder(terminals,.035,.025,M.steel,[-.8+i*.24,.08,.14],[Math.PI/2,0,0],6);}explode(terminals,[0,-.35,.65]);
    for(let i=0;i<5;i++)tube(g,[[-.5+i*.31,1.09,.23],[-.5+i*.31,1.52,.16],[-.33+i*.26,1.93,.25]],.012,i<3?P.cyan:P.amber,{segments:7});
    return {node:g,input,output,relay};
  }
  function speaker(parent,at=[0,0,0],scale=1,component='station-pa'){
    const g=assembly(parent,component,at,scale);
    box(g,[.82,1.04,.055],P.blue,[0,0,-.22]);for(const x of [-.41,.41])box(g,[.04,1.04,.5],P.pale,[x,0,0]);for(const y of [-.52,.52])box(g,[.82,.04,.5],P.pale,[0,y,0]);
    const grille=group(g,'loudspeaker-grille');for(let j=0;j<9;j++)box(grille,[.74,.025,.025],P.metal,[0,-.42+j*.105,.29]);shell(grille);explode(grille,[.55,0,.65]);
    const basket=group(g,'loudspeaker-driver-basket');cylinder(basket,.32,.08,P.metal,[0,0,.08],[Math.PI/2,0,0],18);cylinder(basket,.27,.085,P.dark,[0,0,.115],[Math.PI/2,0,0],18);
    const cone=group(basket,'loudspeaker-moving-cone',[0,0,.18]);mesh(cone,new THREE.CylinderGeometry(.25,.10,.12,18),P.muted,[0,0,0],[Math.PI/2,0,0]);cylinder(cone,.09,.035,P.dark,[0,0,.075],[Math.PI/2,0,0],16);explode(basket,[0,0,.65]);
    const magnet=group(g,'loudspeaker-magnet');cylinder(magnet,.18,.18,P.dark,[0,0,-.08],[Math.PI/2,0,0],14);box(magnet,[.13,.08,.04],P.copper,[.19,0,-.1]);explode(magnet,[0,0,-.4]);
    box(g,[.13,.15,.22],M.steel,[0,.62,-.1]);return {node:g,cone};
  }
  function display(parent,at=[0,0,0],scale=1,component='station-pis'){
    const g=assembly(parent,component,at,scale),w=2.6,h=1.0;
    const casing=group(g,'display-rear-cover');
    box(casing,[w,h,.05],P.metal,[0,0,-.22]);for(const x of [-w/2,w/2])box(casing,[.05,h,.43],P.blue,[x,0,0]);for(const y of [-h/2,h/2])box(casing,[w,.05,.43],P.blue,[0,y,0]);
    shell(casing);explode(casing,[0,.2,-.8]);
    const pcb=board(g,'display-controller-board',1.4,.61,[0,0,-.13]);explode(pcb,[.35,0,-.6]);
    // The LCD is functional equipment, not an enclosure: cutaway must keep the
    // displayed content visible while separation can still remove the panel.
    const front=group(g,'removable-display-panel',[0,0,.24]);const pic=picture(front,w-.08,h-.08,[0,0,0]);explode(front,[0,.15,.7]);
    for(const x of [-.81,.81])box(g,[.05,.64,.07],M.steel,[x,.8,-.09]);
    return {node:g,picture:pic,pcb,front};
  }
  function cameraDevice(parent,at=[0,0,0],scale=1,component='station-cctv'){
    const g=assembly(parent,component,at,scale);box(g,[.85,.64,.045],P.metal,[0,0,-.43]);
    box(g,[.14,.7,.16],M.steel,[0,-.52,-.3]);box(g,[.55,.08,.52],M.steel,[0,-.87,-.26]);
    const cover=group(g,'camera-protective-cover');box(cover,[.88,.045,1.06],P.pale,[0,.35,.02]);for(const x of [-.44,.44])box(cover,[.045,.7,1.06],P.pale,[x,0,.02]);shell(cover);explode(cover,[0,.65,-.1]);
    const optics=assembly(g,'camera-imager');
    const lens=group(optics,'camera-lens-barrel',[0,0,.33]);cylinder(lens,.24,.38,P.dark,[0,0,0],[Math.PI/2,0,0],18);cylinder(lens,.19,.025,M.glass,[0,0,.205],[Math.PI/2,0,0],18);explode(lens,[0,0,.65]);
    const sensor=board(optics,'camera-sensor-board',.62,.5,[0,0,-.03]);box(sensor,[.22,.17,.028],P.cyan,[0,0,.05]);explode(sensor,[0,0,-.45]);
    const encoder=board(g,'camera-network-board',.64,.49,[0,-.1,-.28]);encoder.rotation.x=-Math.PI/2;explode(encoder,[.6,-.1,-.1]);box(g,[.22,.16,.1],P.dark,[.21,0,-.49]);
    return {node:g,lens,sensor};
  }
  function helpPoint(parent,at=[0,0,0],scale=1){
    const g=assembly(parent,'emergency-intercom',at,scale);box(g,[1.1,2.85,.06],P.metal,[0,1.48,-.22]);for(const x of [-.55,.55])box(g,[.05,2.85,.52],P.blue,[x,1.48,.03]);
    const cover=group(g,'help-point-front-panel');box(cover,[1.1,2.85,.045],P.pale,[0,1.48,.35]);for(let i=0;i<5;i++)box(cover,[.55,.023,.018],P.dark,[0,1.91+i*.09,.381]);shell(cover);explode(cover,[.65,.1,.75]);
    const electronics=assembly(g,'help-point-electronics');
    const pcb=board(electronics,'help-point-audio-board',.79,.65,[0,2.12,-.1]);explode(pcb,[0,.2,-.5]);
    const speakerDriver=group(electronics,'help-point-speaker-driver',[0,1.97,.2]);cylinder(speakerDriver,.23,.13,P.dark,[0,0,0],[Math.PI/2,0,0],16);cylinder(speakerDriver,.17,.035,P.muted,[0,0,.09],[Math.PI/2,0,0],16);explode(speakerDriver,[0,.3,.65]);
    const mic=group(electronics,'help-point-microphone',[0,.79,.21]);cylinder(mic,.055,.08,P.dark,[0,0,0],[Math.PI/2,0,0],12);box(mic,[.18,.12,.03],P.board,[0,0,-.065]);explode(mic,[-.3,-.15,.55]);
    const button=group(g,'help-point-moving-button',[0,1.24,.41]);cylinder(button,.14,.065,P.amber,[0,0,0],[Math.PI/2,0,0],18);
    const contact=group(electronics,'help-point-button-contact',[0,1.24,.15]);box(contact,[.21,.18,.1],P.dark);const arm=box(contact,[.2,.027,.025],P.copper,[0,.08,.08]);explode(contact,[.35,0,.5]);
    const state=indicator(g,'help-point-call-state',[0,2.66,.4],.15);return {node:g,button,contactArm:arm,state,speakerDriver};
  }
  function server(parent,component,at=[0,0,0],scale=1,recording=false){
    const g=assembly(parent,component,at,scale);box(g,[2.3,.07,1.4],P.metal,[0,.2,0]);for(const x of [-1.16,1.16])box(g,[.06,1.7,1.4],P.metal,[x,1.05,0]);box(g,[2.3,1.7,.045],P.metal,[0,1.05,-.72]);
    const cover=group(g,recording?'recorder-cover':'application-server-cover');box(cover,[2.4,.05,1.45],P.blue,[0,1.93,0]);box(cover,[2.3,.65,.045],P.blue,[0,1.56,.72]);shell(cover);explode(cover,[0,.7,.3]);
    const pcb=board(g,recording?'recorder-main-board':'application-server-board',1.8,1.1,[0,.35,0]);pcb.rotation.x=-Math.PI/2;explode(pcb,[0,.6,-.2]);
    const drive=group(g,recording?'removable-recording-disk':'server-storage-carrier',[0,.88,.12]);box(drive,[1.85,.12,1.15],P.metal);for(const x of [-.52,.52]){box(drive,[.79,.23,.85],P.dark,[x,.15,0]);cylinder(drive,.24,.025,M.steel,[x,.28,0],null,18);}box(drive,[1.75,.2,.05],P.blue,[0,.06,.62]);explode(drive,[0,0,1.0]);
    for(let i=0;i<3;i++)box(g,[.24,.15,.04],P.dark,[-.76+i*.44,1.56,.76]);const state=indicator(g,recording?'recording-state':'application-state',[.8,1.56,.77],.13);
    return {node:g,drive,pcb,state};
  }
  function amplifier(parent,at=[0,0,0],scale=1){
    const g=assembly(parent,'pa-amplifier',at,scale);box(g,[3,.05,1.65],P.metal,[0,.2,0]);for(const x of [-1.5,1.5])box(g,[.05,.88,1.65],P.metal,[x,.66,0]);
    const cover=group(g,'amplifier-cover');box(cover,[3.05,.045,1.7],P.blue,[0,1.12,0]);box(cover,[3,.86,.04],P.blue,[0,.66,.87]);for(let i=0;i<5;i++)box(cover,[.05,.51,.02],P.dark,[-1.08+i*.18,.64,.9]);shell(cover);explode(cover,[0,.7,.2]);
    const control=board(g,'amplifier-input-board',.9,1.1,[-.92,.35,-.1]);control.rotation.x=-Math.PI/2;explode(control,[-.6,.4,0]);
    const power=board(g,'amplifier-power-stage',1.3,1.15,[.44,.35,-.05]);power.rotation.x=-Math.PI/2;explode(power,[.45,.5,0]);
    const sink=group(g,'amplifier-heat-sink',[.52,.66,-.3]);box(sink,[1.15,.07,.65],P.metal);for(let i=0;i<7;i++)box(sink,[.055,.34,.63],P.metal,[-.5+i*.17,.2,0]);explode(sink,[.35,.8,-.25]);
    const output=group(g,'amplifier-loudspeaker-terminals',[.55,.61,-.9]);for(const x of [-.3,0,.3]){box(output,[.23,.25,.18],P.blue,[x,0,0]);cylinder(output,.035,.025,P.copper,[x,.14,0],null,6);}explode(output,[.35,.15,-.55]);
    const level=indicator(g,'amplifier-active-channel',[.85,.68,.91],.18);return {node:g,level,output};
  }
  function cabRadio(parent,at=[0,0,0],scale=1){
    const g=assembly(parent,'operational-cab-radio',at,scale);
    const head=group(g,'cab-radio-control-head',[0,1.1,.6]);roundedPanel(head,1.7,.62,.22,P.blue,[0,0,0],.06);picture(head,.7,.32,[-.26,.04,.15]);for(let i=0;i<3;i++)box(head,[.15,.12,.035],P.pale,[.35+i*.2,-.05,.15]);explode(head,[0,.35,.65]);
    const hand=group(g,'cab-radio-handset',[-1.2,1.05,.65]);box(hand,[.18,.8,.17],P.dark);for(const y of [-.33,.33])box(hand,[.32,.23,.24],P.dark,[0,y,0]);explode(hand,[-.35,.2,.45]);
    box(g,[1.9,.05,1.15],P.metal,[0,.25,-.1]);const pcb=board(g,'cab-radio-transceiver-board',1.55,.85,[0,.32,-.1]);pcb.rotation.x=-Math.PI/2;explode(pcb,[0,.5,-.25]);
    const cover=group(g,'cab-radio-transceiver-cover');box(cover,[1.95,.04,1.2],P.blue,[0,.72,-.1]);for(const x of [-.97,.97])box(cover,[.04,.46,1.2],P.blue,[x,.48,-.1]);shell(cover);explode(cover,[0,.85,-.3]);
    cylinder(g,.045,1.6,P.dark,[1.1,1.2,-.4],null,10);cylinder(g,.13,.08,M.steel,[1.1,.4,-.4],null,12);
    tube(g,[[-.86,1,.62],[-.97,.68,.55],[-.84,.4,.35]],.025,P.dark,{segments:9});return {node:g,pcb,hand};
  }
  function accessDoor(parent,at=[0,0,0],scale=1){
    const g=assembly(parent,'access-controller',at,scale),door=assembly(g,'access-door-interface');
    for(const x of [-1.22,1.22])box(door,[.15,3.15,.24],P.metal,[x,1.63,0]);box(door,[2.6,.15,.24],P.metal,[0,3.19,0]);
    const hinge=group(door,'access-door-hinge',[-1.1,0,.03]);const leaf=group(hinge,'access-door-leaf');box(leaf,[2.13,3,.09],P.pale,[1.065,1.6,0]);box(leaf,[.12,.48,.12],M.steel,[1.85,1.52,.12]);
    const magnet=group(leaf,'door-contact-magnet',[1.92,3.02,.13]);box(magnet,[.17,.08,.08],P.dark);
    const contact=group(door,'door-frame-contact',[.82,3.17,.15]);box(contact,[.2,.08,.11],P.dark);
    const lock=group(door,'door-lock-case',[1.24,1.56,0]);box(lock,[.18,.39,.2],P.blue);
    const bolt=group(lock,'retracting-lock-bolt',[-.15,0,0]);box(bolt,[.3,.08,.08],M.steel);explode(lock,[.6,0,.2]);
    const reader=group(door,'access-reader',[-1.65,1.58,.16]);box(reader,[.3,.52,.18],P.dark);const readerState=indicator(reader,'access-reader-event',[0,.12,.11],.09);explode(reader,[-.4,.15,.3]);
    const control=group(g,'door-controller-enclosure',[-2.28,1.6,0]);box(control,[.7,1.05,.055],P.metal,[0,0,-.13]);
    const pcb=board(control,'access-relay-board',.6,.88,[0,0,-.04]);const relay=group(pcb,'access-output-relay',[.13,-.16,.08]);box(relay,[.22,.2,.13],P.dark);const arm=box(relay,[.18,.02,.02],P.copper,[0,.12,.08]);explode(pcb,[-.45,.1,.5]);
    const terminals=group(control,'access-field-terminals');for(let i=0;i<4;i++)box(terminals,[.12,.17,.13],P.blue,[-.24+i*.16,-.36,.12]);explode(terminals,[0,-.3,.4]);
    const cover=group(control,'door-controller-cover');box(cover,[.74,1.09,.03],P.pale,[0,0,.21]);shell(cover);explode(cover,[-.45,.15,.65]);
    const command=indicator(g,'access-lock-output-marker',[-2.25,2.3,.14],.14),contactState=indicator(g,'access-door-contact-marker',[-1.92,2.3,.14],.14);
    tube(door,[[-2.02,1.26,.17],[-1.6,.9,-.2],[1.25,.9,-.2],[1.25,1.4,-.09]],.018,P.amber,{segments:10});
    tube(door,[[.82,3.17,.12],[-1.5,3.35,-.12],[-2.25,2.7,-.12],[-2.25,2.1,.05]],.018,P.cyan,{segments:10});
    return {node:g,hinge,leaf,magnet,contact,bolt,relayArm:arm,readerState,command,contactState};
  }
  return {P,assembly,board,indicator,picture,screenTerminal,networkSwitch,patchPanel,router,powerUnit,networkCabinet,rtuPanel,speaker,display,cameraDevice,helpPoint,server,amplifier,cabRadio,accessDoor};
}

export function buildCommunicationsView(id,api){
  if(!Object.hasOwn(COMMUNICATIONS_VIEWS,id))return null;
  const {THREE,M,group,part,mesh,box,cylinder,tube,explode,shell,startModel,registerAnimator}=api;
  const root=startModel(id),A=createCommunicationsAssemblies(api),P=A.P,updates=[],alternatives=[];
  const selected=s=>VARIANTS[id].includes(s.variant)?s.variant:VARIANTS[id][0];
  const phase=s=>{const p=Number.isFinite(s.phase)?Math.max(0,s.phase):0;return(!s.playing&&p===5?5:p%5)/5;};
  const clamp=x=>Math.max(0,Math.min(1,x));
  const foundation=(parent,w,d,at=[0,0,0])=>{const n=box(parent,[w,.12,d],M.deck,at);n.renderOrder=-105;return n;};
  const alt=name=>{const g=group(root,`communications-alternative-${name}`);alternatives.push({name,node:g});return g;};
  function link(parent,name,points,kind='data'){
    const g=group(parent,name);const {m}=tube(g,points,kind==='optical'?.035:.026,kind==='power'?P.copper:kind==='audio'?P.amber:P.cyan,{segments:12});m.name=`${name}-route`;return g;
  }
  function bay(parent,name,at,w,d){const g=group(parent,name,at);foundation(g,w,d);box(g,[w,.08,.08],P.blue,[0,.1,-d/2]);return g;}
  function vehicleSection(parent,at,w=5){const g=group(parent,'illustrative-vehicle-section',at);box(g,[w,.18,2.4],P.metal,[0,.2,0]);for(const x of [-w/2,w/2]){box(g,[.1,2.7,2.4],P.pale,[x,1.55,0]);}const side=group(g,'vehicle-cutaway-enclosure');box(side,[w,1.45,.1],P.pale,[0,1.05,-1.2]);shell(side);explode(side,[0,.4,-.65]);return g;}
  function fieldDamper(parent,at=[0,0,0],scale=1){
    const g=A.assembly(parent,'tunnel-damper',at,scale);for(const x of [-1.1,1.1])box(g,[.14,2.3,.75],P.metal,[x,1.35,0]);for(const y of [.2,2.5])box(g,[2.35,.14,.75],P.metal,[0,y,0]);
    const blades=[];for(let i=0;i<4;i++){const blade=group(g,`scada-damper-blade-${i}`,[0,.54+i*.52,0]);box(blade,[2.05,.47,.055],P.blue);cylinder(blade,.035,2.24,M.steel,[0,0,0],[0,0,Math.PI/2],10);blades.push(blade);}
    const actuator=group(g,'scada-local-actuator',[1.4,1.36,0]);box(actuator,[.44,.74,.46],P.dark);const shaft=group(actuator,'scada-actuator-shaft');cylinder(shaft,.075,.3,M.steel,[-.22,0,0],[0,0,Math.PI/2],10);box(shaft,[.04,.34,.04],P.copper,[-.22,.15,0]);explode(actuator,[.65,0,0]);
    const sensor=A.assembly(g,'bas-sensor',[1.4,2.15,.17]);box(sensor,[.3,.26,.18],P.pale);const arm=group(sensor,'scada-position-contact-arm',[0,0,.12]);box(arm,[.23,.035,.025],P.copper,[.05,0,0]);
    return {node:g,blades,shaft,contact:arm,set(v){blades.forEach(b=>b.rotation.x=v*Math.PI*.46);shaft.rotation.x=v*Math.PI*.46;arm.rotation.z=v>.92?-.55:0;}};
  }
  function headEnd(parent,at=[0,0,0],scale=1){
    const g=group(parent,'scada-head-end-cluster',at);g.scale.setScalar(scale);A.server(g,'scada-head-end',[0,0,-.65]);const hmi=A.screenTerminal(g,'station-scada',[0,0,1.45],.9,'position');
    const quality=A.assembly(g,'scada-information-quality',[1.26,1.8,1.35]);const crossed=group(quality,'scada-stale-quality-marker');for(const a of [-.7,.7])box(crossed,[.45,.045,.025],P.red,[0,0,0],[0,0,a]);crossed.visible=false;
    const current=box(quality,[.2,.17,.025],P.cyan);const record=group(g,'scada-retained-record',[-1.55,1.0,-.4]);for(let i=0;i<3;i++)box(record,[.7,.045,.55],P.pale,[0,i*.12,0]);const recordMarker=box(record,[.35,.025,.12],P.cyan,[0,.28,0]);recordMarker.visible=false;
    return {node:g,hmi,crossed,current,recordMarker};
  }
  function radioSite(parent,at=[0,0,0],scale=1){
    const g=A.assembly(parent,'station-radio',at,scale);box(g,[1.6,.15,1.4],P.metal,[0,.1,0]);cylinder(g,.07,3.8,M.steel,[0,2,0],null,10);for(const x of [-.32,.32])box(g,[.22,1.2,.14],P.pale,[x,3.25,0]);
    box(g,[.95,1.35,.7],P.blue,[0,.82,-.3]);const inside=A.board(g,'radio-access-interface-board',.65,.85,[0,.86,.1]);explode(inside,[.5,.1,.6]);return g;
  }
  if(id==='communications-overview'){
    for(const name of VARIANTS[id]){
      const g=alt(name);const map=A.assembly(g,'communications-system');foundation(map,17.4,10.0);const train=vehicleSection(g,[-5,.1,2.5],5.3),wayside=bay(g,'wayside-location',[-5,.1,-2.8],4.6,3.8),station=bay(g,'station-location',[3,.1,2.2],6.4,4.1),head=bay(g,'head-end-location',[4.6,.1,-2.8],4.4,3.8);
      const fibre=A.assembly(g,'fiber-backbone');link(fibre,'location-backbone',[[-5,.28,-2.3],[-1.6,.28,-2.3],[-1.6,.28,1.5],[2.1,.28,1.5],[4.6,.28,-2.3]],'optical');A.networkSwitch(station,[-1.7,.8,-.6],1.8);
      if(name==='supervision'){
        fieldDamper(wayside,[-1,0,0],.8);A.rtuPanel(station,[.5,0,-.4],.75);const h=headEnd(head,[0,0,0],.7);A.assembly(train,'bas-sensor',[0,.7,0]);box(train,[1,.65,.65],P.blue,[0,.7,0]);h.current.visible=true;
      }else if(name==='passenger'){
        A.display(train,[0,1.75,-.7],.9,'passenger-info');A.networkSwitch(train,[-1.2,.6,.2],1.2,'onboard-ethernet-gateway',true);A.display(station,[1.1,2.25,-.7],1.0);A.speaker(station,[2.1,1.0,.2],.8);A.server(head,'pis-controller',[0,0,-.3],.8);A.router(wayside,[0,1,0]);
      }else{
        A.cabRadio(train,[0,.3,0],.8);radioSite(wayside,[0,0,0],.8);A.helpPoint(station,[1,0,.3],.85);A.server(head,'voice-call-server',[0,0,-.5],.75);A.screenTerminal(head,'voice-call-server',[0,0,1],.65);
      }
    }
  }else if(id==='communications-network'){
    const station=alt('station');foundation(station,7.5,5.3);A.networkCabinet(station,[0,.08,0],1);
    // Detached fibre entry and equipment spur make the terminations readable.
    const fibre=A.assembly(station,'fiber-backbone');link(fibre,'installed-fibre-entry',[[-3.3,.2,-1.4],[-2,.2,-1.4],[-1.65,4.1,-.85]],'optical');
    const onboard=alt('onboard');foundation(onboard,11.8,5.6);const a=vehicleSection(onboard,[-3,0,0],5.2),b=vehicleSection(onboard,[3,0,0],5.2);
    A.networkSwitch(a,[0,.7,.35],2.3,'onboard-ethernet-gateway',true);A.networkSwitch(b,[0,.7,.35],2.3,'onboard-ethernet-gateway',true);
    A.display(a,[-.5,2.05,-.85],.7,'passenger-info');A.cameraDevice(a,[1.45,1.65,-.7],.5,'cctv');
    const backbone=A.assembly(onboard,'train-network');link(backbone,'inter-consist-backbone',[[-1.8,.7,1.08],[-.6,.7,1.35],[.6,.7,1.35],[1.8,.7,1.08]],'data');
    link(a,'local-passenger-display-spur',[[0,.7,.3],[-.8,1,-.6],[-.5,1.8,-.8]],'data');
    link(a,'local-camera-spur',[[.3,.7,.3],[1.45,1,-.5],[1.45,1.5,-.7]],'data');
  }else if(id==='communications-scada'){
    foundation(root,15.8,7.8);const field=fieldDamper(root,[-5.45,.05,0]);const rtu=A.rtuPanel(root,[-1.9,.05,0],.88);A.router(root,[1.25,1.1,-.05],'scada-gateway');const head=headEnd(root,[5.25,.02,-.6],.95);
    const out=link(root,'scada-control-interface',[[-1,1.9,.5],[-2.5,1.7,1.1],[-4.1,1.4,.2]],'audio');const input=link(root,'scada-indication-interface',[[-4.05,2.18,.2],[-3.6,2.6,-.2],[-2,2.5,.2]]);
    const uplink=link(root,'scada-uplink',[[-.55,2.25,.2],[.1,1.4,.1],[1.25,1.2,.3],[3.55,1.2,-.8],[4.8,1.3,-1.2]]);
    const breakMark=group(root,'scada-unavailable-link');for(const a of [-.65,.65])box(breakMark,[.75,.065,.045],P.red,[2.8,1.32,-.3],[0,0,a]);
    const commandPlate=group(root,'scada-request-context');box(commandPlate,[.55,.07,.4],P.amber,[3.5,.17,1.5]);
    const inputPlate=group(root,'scada-indication-context');box(inputPlate,[.55,.07,.4],P.cyan,[-3.7,.17,1.5]);
    updates.push(s=>{
      const v=selected(s),u=phase(s),stale=v==='stale',command=v==='command';
      const position=stale?1:command?clamp((u-.48)/.22):clamp((u-.18)/.23);
      field.set(position);const acquired=stale?true:command?u>=.76:u>=.46;const shown=!stale&&(command?u>=.9:u>=.78);
      rtu.input.set(acquired);rtu.output.set(command&&u>=.32);rtu.relay.rotation.z=command&&u>=.32?-.32:0;
      head.hmi.request.set(command&&u>=.16);head.hmi.display.set(shown);head.recordMarker.visible=shown;head.current.visible=!stale;head.crossed.visible=stale;
      uplink.visible=!stale;breakMark.visible=stale;commandPlate.visible=command;inputPlate.visible=v==='status';out.visible=command;input.visible=true;
    });
  }else if(id==='communications-telephony'){
    const help=alt('help-point');foundation(help,13.2,6);const hp=A.helpPoint(help,[-4.7,.08,.55],1.3);A.networkSwitch(help,[-1.3,1.03,-.55],2.1);A.server(help,'voice-call-server',[1.4,.1,-.9],.85);const desk=A.screenTerminal(help,'voice-call-server',[4.5,.1,.7]);
    link(help,'help-point-network',[[-4.5,.8,.2],[-3,.6,-.2],[-1.3,1.1,-.4],[1.4,1,-.6]]);link(help,'call-manager-terminal',[[1.4,1.2,-.5],[2.8,.9,.0],[4.5,1.4,.8]]);
    const audio=link(help,'established-two-way-audio',[[-4.2,2.6,1.05],[-2.2,3.6,.8],[2.1,3.6,.8],[4.4,2.4,1.0]],'audio');
    updates.push(s=>{const u=phase(s),pressed=u>=.16&&u<.3;hp.button.position.z=.41-(pressed?.045:0);hp.contactArm.rotation.z=pressed?-.2:0;hp.state.set(u>=.32);desk.request.set(u>=.32&&u<.62);desk.display.set(u>=.62);audio.visible=u>=.62;hp.speakerDriver.scale.z=u>=.62?1+.05*Math.sin(u*70):1;});
    const radio=alt('operational-radio');foundation(radio,13.2,6);const cab=vehicleSection(radio,[-4.1,0,.1],3.5);A.cabRadio(cab,[0,.15,0],1.1);radioSite(radio,[0,.08,-.65]);A.screenTerminal(radio,'operations-radio-dispatch',[4.5,.1,.65]);
    link(radio,'illustrative-radio-access',[[-2.8,1.9,-.34],[-1.5,3.3,-.5],[0,3.3,-.65]],'audio');const fixed=A.assembly(radio,'fiber-backbone');link(fixed,'fixed-radio-service',[[0,.8,-.6],[2.2,.7,-.6],[4.5,1.2,.4]]);
  }else if(id==='communications-passenger'){
    const info=alt('information');foundation(info,13.8,5.8);const editor=A.screenTerminal(info,'pis-controller',[-4.8,.08,.2]);const player=A.server(info,'pis-controller',[.25,.1,-.3],.85);A.networkSwitch(info,[-1.9,.72,-.4],1.6);const endpoint=A.display(info,[4.5,2.4,0],1.32);
    for(const x of [3.7,5.3])box(info,[.09,1.65,.1],M.steel,[x,1.05,-.13]);link(info,'information-delivery',[[-4.1,1,.0],[-2.6,.8,-.1],[-1.9,.75,-.3],[.25,1,-.2],[4.5,2.4,-.2]]);
    updates.push(s=>{const u=phase(s);editor.display.set(u>=.18);player.state.set(u>=.48);endpoint.picture.set(u>=.78);});
    const pa=alt('announcement');foundation(pa,13.8,6.4);const source=A.screenTerminal(pa,'pa-controller',[-4.8,.08,.0],.85);
    const mic=group(source.node,'gooseneck-microphone',[.65,1.02,.2]);cylinder(mic,.09,.04,P.dark,[0,0,0],null,12);tube(mic,[[0,0,0],[0,.45,0],[.12,.65,0]],.025,P.dark,{segments:8});cylinder(mic,.045,.19,P.dark,[.16,.66,0],[0,0,-.6],10);explode(mic,[.4,.35,.25]);
    const amp=A.amplifier(pa,[-.55,.5,.15],1.03);A.server(pa,'pa-controller',[-1,.08,-2.0],.65);A.powerUnit(pa,[2.2,.6,-1.9],.65);const sp=A.speaker(pa,[4.9,1.85,.2],1.8);
    box(pa,[.13,1.2,.15],M.steel,[4.9,.65,-.12]);link(pa,'pa-network-audio',[[-3.9,1.0,.2],[-2.75,.7,-.3],[-1.0,1.1,-1.8],[-.8,1.0,-.1]]);
    link(pa,'loudspeaker-powered-circuit',[[0,1.15,-.75],[1.2,1.0,-.45],[3,1.0,.0],[4.9,1.85,-.05]],'audio');link(pa,'amplifier-supply',[[2.2,.6,-1.8],[1.4,.38,-1.3],[.3,.8,-.4]],'power');
    updates.push(s=>{const u=phase(s);source.request.set(u>=.2);amp.level.set(u>=.42);sp.cone.position.z=.18+(u>=.62?.045*Math.sin((u-.62)*100):0);});
  }else if(id==='communications-security'){
    const video=alt('video');foundation(video,12.4,6.2);A.cameraDevice(video,[-4.4,2.1,.25],1.7);A.networkSwitch(video,[-1.9,.83,-.45],1.8);A.server(video,'cctv-recording',[.8,.1,-.5],1,true);A.screenTerminal(video,'occ-cctv-assessment',[4.4,.08,.7],1,'video');
    link(video,'camera-video-stream',[[-4.4,2,-.6],[-3.5,.9,-.7],[-1.9,.85,-.4],[.8,1,-.3]]);link(video,'live-view-branch',[[-1.9,.8,-.45],[-1.3,.6,1.9],[2.4,.6,1.9],[4.4,1.5,.8]]);link(video,'recorded-view-branch',[[.8,1.3,-.1],[2.4,1.2,.2],[4.4,1.5,.8]],'audio');
    const access=alt('access');foundation(access,10.9,6.1,[-.4,0,.6]);const door=A.accessDoor(access,[-1,.08,0],1.2),hmi=A.screenTerminal(access,'station-scada',[3.5,.08,.6],1,'door');
    link(access,'access-supervisory-interface',[[-3.6,2.1,0],[-2.7,3.5,-.6],[1.1,3.5,-.6],[3.5,1.6,.6]]);
    updates.push(s=>{const u=phase(s),release=u>=.38,opened=clamp((u-.6)/.18);door.readerState.set(u>=.2);door.command.set(release);door.relayArm.rotation.z=release?-.28:0;door.bolt.position.x=-.15+(release?.31:0);door.hinge.rotation.y=-opened*.95;door.contactState.set(opened>.08);hmi.request.set(release);hmi.display.set(u>=.84);});
  }
  for(const a of alternatives)a.node.visible=a.name===VARIANTS[id][0];
  registerAnimator(state=>{const v=selected(state);for(const a of alternatives)a.node.visible=a.name===v;for(const update of updates)update(state);});
  for(const update of updates)update({variant:VARIANTS[id][0],phase:0,playing:false});
  return root;
}
