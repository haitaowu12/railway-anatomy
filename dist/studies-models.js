import { buildElectrificationView } from './electrification-models.js';
// Original geometry: qualitative mechanisms, fictional records and interfaces.
export const STUDY_CAMERAS = {
  electrification:{camera:[24,20,29],target:[0,1.7,0],distance:44},
  adhesion:{camera:[11,9,14],target:[0,1.5,0],distance:25},
  'infrastructure-care':{camera:[20,17,23],target:[0,.5,0],distance:37,groundY:-1.8},
  'infrastructure-assets':{camera:[16,11,20],target:[0,-.35,.3],distance:31,groundY:-1.8},
  dependencies:{camera:[21,21,27],target:[0,1,0],distance:43},
  'accessible-journey':{camera:[20,20,26],target:[0,2,0],distance:43},
  'change-evidence':{camera:[18,19,25],target:[0,1,0],distance:39},
};

export function buildStudyView(id,api){
  if(!STUDY_CAMERAS[id])return null;
  if(id==='electrification')return buildElectrificationView(api);
  const {THREE,M,mat,startModel,group,part,mesh,box,cylinder,tube,shell,explode,registerAnimator}=api;
  const root=startModel(id),updates=[];
  const P={amber:mat(0xe3b65c),cyan:mat(0x78c9d6),green:mat(0x77bda6),violet:mat(0xb7a7df),red:mat(0xd58d78),paper:mat(0xd8dfd5),earth:mat(0x70654d),ballast:mat(0x69746d),dark:mat(0x263f4a),blue:mat(0x507785),copper:mat(0xbd8759)};
  const phase=s=>!s.playing&&s.phase===5?1:((s.phase||0)%5)/5;
  function deck(w,d,at=[0,-.2,0]){return box(root,[w,.2,d],M.deck,at);}
  function link(parent,name,points,material,r=.045){const g=group(parent,name);tube(g,points,r,material,{straight:true});return g;}
  function crossed(parent,name,at,size=1){const g=group(parent,name,at);for(const sign of [-1,1])box(g,[size,.09,.1],P.red,[0,0,0],[0,0,sign*Math.PI/4]);return g;}
  function card(parent,name,at,w=1.8,h=1.2){const g=group(parent,name,at);box(g,[w,.12,h],P.paper);return g;}
  function mark(parent,at,color=P.green){return box(parent,[.22,.12,.22],color,at);}
  function letter(parent,char,at,size=.5){
    const strokes={A:[[[0,1],[.5,0],[1,1]],[[.2,.6],[.8,.6]]],B:[[[0,1],[0,0],[.7,0],[1,.25],[.7,.5],[0,.5]],[[.7,.5],[1,.75],[.7,1],[0,1]]],R:[[[0,1],[0,0],[.7,0],[1,.25],[.7,.5],[0,.5]],[[.5,.5],[1,1]]],M:[[[0,1],[0,0],[.5,.6],[1,0],[1,1]]],S:[[[1,0],[0,0],[0,.5],[1,.5],[1,1],[0,1]]]};
    const g=group(parent,`record-letter-${char}`,at);
    for(const stroke of strokes[char]||[])link(g,'letter-stroke',stroke.map(([x,z])=>[(x-.5)*size,0,(z-.5)*size]),M.dark,.025);
    return g;
  }
  function cabinet(parent,name,at,w=1.1,h=1.8){const g=group(parent,name,at);box(g,[w,h,.75],P.blue,[0,h/2,0]);for(let y=.45;y<h;y+=.36)box(g,[w*.72,.06,.04],M.dark,[0,y,.4]);return g;}
  function rail(parent,x,z,length=12,y=.4){box(parent,[length,.18,.12],M.steel,[x,y,z]);}
  function axle(parent,name,at,r=.75){const g=group(parent,name,at);cylinder(g,.1,2.65,M.steel,[0,0,0],[Math.PI/2,0,0]);for(const z of [-1.2,1.2]){cylinder(g,r,.2,M.steel,[0,0,z],[Math.PI/2,0,0]);box(g,[.1,r*.84,.04],P.amber,[0,r*.42,z+.12]);}return g;}
  function trace(parent,name,points,material,{active=()=>true,moving=false}={}){
    const g=link(parent,name,points,material),dot=box(g,[.15,.15,.15],material);
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'catmullrom',.01);
    updates.push(s=>{g.visible=active(s);dot.visible=moving;dot.position.copy(curve.getPoint(phase(s)));});return g;
  }

  if(id==='adhesion'){
    deck(12,8);const contact=part(root,'adhesion-contact');
    rail(contact,0,-1.2,11,.1);rail(contact,0,1.2,11,.1);
    const travelling=group(contact,'travelling-wheel-centre');
    const wheel=axle(travelling,'contact-wheelset',[0,.94,0],.75);
    const axleFrame=group(travelling,'axle-support');for(const z of [-1.4,1.4])box(axleFrame,[1.5,.25,.35],P.blue,[0,1.2,z]);
    const demand=part(root,'adhesion-demand',[-4.5,0,-2.8]);box(demand,[1.5,.12,1],M.edge);
    const demandBar=box(demand,[.25,1.7,.25],P.amber,[0,.9,0]);
    const ref=part(root,'adhesion-reference',[0,0,2.6]);ref.name='fixed-travel-reference';
    for(let x=-5;x<=5;x+=.5)box(ref,[.08,.12,.6],P.paper,[x,.15,0]);
    const travelMarker=box(ref,[.3,.3,.85],P.cyan,[0,.35,0]);
    box(part(travelling,'adhesion-reference',[0,1.2,1.7]),[.3,.3,.3],P.violet);
    cabinet(ref,'fixed-reference-sensor',[-4.8,0,1],.65,1);
    const wsp=part(root,'adhesion-wsp',[-3.5,0,0]);cabinet(wsp,'wheel-slide-controller',[0,0,-2],1.1,1.6);
    const wspLamp=mark(wsp,[0,1.8,-2],P.green);
    const brake=part(travelling,'adhesion-brake');
    const disc=group(brake,'rotating-brake-disc',[0,.94,.65]);cylinder(disc,.5,.12,P.copper,[0,0,0],[Math.PI/2,0,0]);
    const pads=[];
    for(const side of [-1,1]){
      const assembly=group(brake,side<0?'rear-caliper':'front-caliper',[.25,.94,.65]);
      cylinder(assembly,.17,.45,P.blue,[0,0,side*.5],[Math.PI/2,0,0]);
      const pad=box(assembly,[.28,.45,.12],M.dark,[0,0,side*.12]);pad.name=side<0?'rear-friction-pad':'front-friction-pad';
      const piston=cylinder(assembly,.06,1,M.steel,[0,0,0],[Math.PI/2,0,0]);
      pads.push({side,pad,piston});
    }
    const sander=part(root,'adhesion-sander',[0,0,-2.6]);
    box(sander,[1,1.4,.9],P.paper,[2.7,2,0]);
    link(sander,'sand-hose',[[2.7,1.3,0],[2,1.1,.5],[.7,.34,1.4]],M.dark,.07);
    const grains=group(sander,'sand-delivery-grains');for(let n=0;n<12;n++)box(grains,[.055,.055,.055],P.amber,[.7-n*.035,.34-n*.012,1.4]);
    updates.push(s=>{
      const t=phase(s),v=s.variant,slide=['slide','sanding'].includes(v),protection=v==='protection';
      const x=-1.6+t*3.2;travelling.position.x=x;travelMarker.position.x=x;
      const rotation=v==='spin'?t*12:slide?t*.45:protection?t*3.8:t*3.2/.75;
      wheel.rotation.z=-rotation;disc.rotation.z=-rotation;
      const effort=protection?.45+.3*Math.cos(t*Math.PI*6):v==='rolling'||v==='spin'?.3:1;
      demandBar.scale.y=effort;demandBar.position.y=.1+.85*effort;
      const brakeEffort=['rolling','spin'].includes(v)?0:effort;
      for(const {side,pad,piston}of pads){const offset=.12+.13*(1-brakeEffort),end=offset+.06;pad.position.z=side*offset;piston.position.z=side*(.5+end)/2;piston.scale.y=.5-end;}
      wspLamp.visible=protection;grains.visible=v==='sanding';
      sander.position.x=x;
      grains.children.forEach((g,n)=>{const q=(t*3+n/12)%1;g.position.set(.7-q*.25,.34-.15*q,1.4);});
    });
  }

  if(id==='infrastructure-assets'){
    const identify=(node,label,sources,description)=>{Object.assign(node.userData,{inspectionPart:true,explorationLabel:label,inspectionSources:sources,inspectionFunction:description,fidelity:'Original physical section; dimensions and load capacity are not specified'});return node;};
    const piece=(parent,name,label,at,sources,description)=>identify(group(parent,name,at),label,sources,description);
    deck(19,10,[0,-1.6,0]);
    const formation=identify(part(root,'route-formation'),'Track and earthwork section',['I01'],'Rail, sleepers, support layers and embankment are separate load interfaces. The drawing makes no stability assessment.');formation.userData.explorationAssembly='route-formation';
    const section=new THREE.Shape();section.moveTo(-3,-1.5);section.lineTo(-1.8,-.2);section.lineTo(1.8,-.2);section.lineTo(3,-1.5);section.closePath();
    const embankment=new THREE.ExtrudeGeometry(section,{depth:4.2,bevelEnabled:false});embankment.translate(0,0,-2.1);
    for(const [i,x]of [-5.9,-.1].entries()){const block=piece(formation,'formation-earthwork-'+i,'Earthwork beside the culvert',[x,0,0],['I01'],'The formation leaves an actual opening for the culvert barrel.');mesh(block,embankment,P.earth,[0,0,0],[0,Math.PI/2,0]);}
    const ballast=piece(formation,'formation-support-layer','Granular support layer',[-3,0,0],['I01'],'The support layer spreads track load above the earthwork and culvert crown.');box(ballast,[10,.35,3.5],P.ballast,[0,-.025,0]);
    for(const [x,length]of [[2.5,1],[7.75,1.5]]){const approach=piece(formation,'bridge-approach-support','Bridge approach formation',[x,0,0],['I01','I03'],'The approach supports the track up to the deck boundary.');const geo=new THREE.ExtrudeGeometry(section,{depth:length,bevelEnabled:false});geo.translate(0,0,-length/2);mesh(approach,geo,P.earth,[0,0,0],[0,Math.PI/2,0]);box(approach,[length,.35,3.5],P.ballast,[0,-.025,0]);}
    const sleepers=piece(formation,'formation-sleepers','Sleepers across the section',[0,0,0],['I01'],'Sleeper support is continuous across the chosen earthwork and bridge arrangement.');
    for(let x=-8;x<8;x+=.65)box(sleepers,[.2,.16,3],M.aluminum,[x,.2,0]);
    const profile=[[-.09,0],[.09,0],[.09,.035],[.025,.045],[.025,.12],[.055,.13],[.055,.18],[-.055,.18],[-.055,.13],[-.025,.12],[-.025,.045],[-.09,.035]],shape=new THREE.Shape(profile.map(p=>new THREE.Vector2(...p)));
    const railGeometry=new THREE.ExtrudeGeometry(shape,{depth:17,bevelEnabled:false});railGeometry.translate(0,0,-8.5);railGeometry.rotateY(Math.PI/2);
    for(const z of [-1.1,1.1]){const running=piece(formation,'structure-running-rail','Rail head, web and foot',[0,.28,z],['I01'],'An illustrative rail profile retains the foot-to-sleeper contact.');mesh(running,railGeometry,M.steel);}
    const bridge=identify(part(root,'route-bridge',[5,0,0]),'Bridge deck and supports',['I03','MD09'],'A selected short-span deck and girder arrangement transfers load through bearings into two abutments. Other structural systems and bearing types exist.');bridge.userData.explorationAssembly='route-bridge';
    const deckPlate=piece(bridge,'bridge-deck','Bridge deck',[0,-.01,0],['I03'],'The deck transfers the track load into two longitudinal girders.');box(deckPlate,[4,.22,3.4],P.blue);
    const surface=piece(bridge,'bridge-track-support','Deck track-support layer',[0,.11,0],['I03'],'This shallow support course meets the sleeper underside; its material and design are illustrative.');box(surface,[4,.02,3.0],P.ballast);
    for(const z of [-1.1,1.1]){
      const girder=piece(bridge,'bridge-longitudinal-girder','Longitudinal girder',[0,0,z],['I03'],'Flanges and web transfer deck load toward the bearing seats.');
      for(const y of [-.145,-.435])box(girder,[4,.05,.28],M.steel,[0,y,0]);box(girder,[4,.24,.065],M.steel,[0,-.29,0]);
    }
    for(const [end,x]of [-1.65,1.65].entries()){
      const abutment=piece(bridge,'bridge-abutment-'+end,'Abutment and bearing seat',[x,-1.08,0],['I03'],'A fixed substructure supports the bearing underside.');box(abutment,[.65,.84,3.7],P.earth);
      for(const [side,z]of [-1.1,1.1].entries()){
        const bearing=piece(bridge,`bridge-bearing-${end}-${side}`,'Laminated elastomeric bearing',[x,-.56,z],['MD09'],'A selected elastomeric bearing separates deck rotation/movement accommodation from the vertical load-transfer interfaces. No allowable movement or force is assigned.');
        box(bearing,[.45,.035,.45],M.steel,[0,-.0825,0]);
        const block=piece(bearing,'bridge-bearing-elastomer','Elastomer with embedded reinforcement',[0,.005,0],['MD09'],'The selected layered construction is shown in a section, not as freely separating operational layers.');for(const [lo,hi]of [[-.07,-.048],[-.042,-.003],[.003,.042],[.048,.07]])box(block,[.38,hi-lo,.38],M.dark,[0,(lo+hi)/2,0]);for(const y of [-.045,0,.045])box(block,[.36,.006,.36],M.steel,[0,y,0]);
        const topPlate=piece(bearing,'bridge-bearing-upper-plate','Upper bearing load plate',[0,.0875,0],['MD09'],'The upper plate meets the girder underside in the assembled view.');box(topPlate,[.45,.025,.45],M.steel);explode(topPlate,[0,.35,side? .35:-.35]);Object.assign(topPlate.userData,{inspectionStage:'Separate the load interfaces',inspectionRange:[.35,1]});
      }
    }
    bridge.userData.functionalPaths=[{id:'bridge-load',label:'Track to structural supports',description:'The deck and girder transfer load through the bearing into the abutment. This traces interfaces without computing force or deflection.',steps:[{label:'Deck',nodeName:'bridge-deck'},{label:'Girder',nodeName:'bridge-longitudinal-girder'},{label:'Bearing',nodeName:'bridge-bearing-0-0'},{label:'Abutment',nodeName:'bridge-abutment-0'}],sources:['I03','MD09']}];
    const drain=identify(part(root,'route-drainage',[-3,-.8,0]),'Open culvert and drainage passage',['I01','I02'],'An open barrel crosses beneath the formation. A visible passage is not proof of hydraulic capacity or asset condition.');drain.userData.explorationAssembly='route-drainage';
    for(const side of [-1,1]){const wall=piece(drain,'culvert-sidewall','Culvert sidewall',[side*.7,0,0],['I02'],'The sidewall retains a real clear opening, rather than filling the culvert with a solid primitive.');box(wall,[.15,1,7],P.paper);}
    const invert=piece(drain,'culvert-invert','Culvert invert',[0,-.55,0],['I02'],'The invert supports the open water passage.');box(invert,[1.55,.15,7],P.paper);
    const crown=piece(drain,'culvert-crown','Culvert crown',[0,.55,0],['I02'],'The crown carries the material above the open barrel.');box(crown,[1.55,.15,7],P.paper);shell(crown);explode(crown,[0,.7,0]);Object.assign(crown.userData,{inspectionStage:'Open the culvert section',inspectionRange:[0,.4]});
    for(const z of [-3.5,3.5]){const apron=piece(drain,'culvert-apron','Inlet / outlet apron',[0,-.55,z],['I02'],'The opening connects to the surrounding drainage path. Direction and hydraulic performance require site-specific conditions.');box(apron,[2.2,.15,.8],P.paper);}
    const path=piece(drain,'culvert-open-passage','Open drainage passage',[0,-.35,0],['I01','I02'],'A stationary blue centreline identifies passage continuity, without implying discharge or flood capacity.');link(path,'drainage-continuity',[[0,0,-4],[0,0,4]],P.cyan,.035);
    drain.userData.functionalPaths=[{id:'culvert-passage',label:'Opening beneath the formation',description:'The apron, invert, sidewalls and crown preserve a clear physical passage. Inspection evidence and work decisions remain in the separate process view.',steps:[{label:'Apron',nodeName:'culvert-apron'},{label:'Invert',nodeName:'culvert-invert'},{label:'Sidewall',nodeName:'culvert-sidewall'},{label:'Crown',nodeName:'culvert-crown'},{label:'Passage',nodeName:'culvert-open-passage'}],sources:['I01','I02']}];
  }

  if(id==='infrastructure-care'){
    deck(19,11,[0,-1.6,0]);const formation=part(root,'route-formation');
    const section=new THREE.Shape();section.moveTo(-3,-1.4);section.lineTo(-1.8,-.2);section.lineTo(1.8,-.2);section.lineTo(3,-1.4);section.closePath();
    const embankment=new THREE.ExtrudeGeometry(section,{depth:4.2,bevelEnabled:false});embankment.translate(0,0,-2.1);
    for(const x of [-5.9,-.1])mesh(formation,embankment,P.earth,[x,0,0],[0,Math.PI/2,0]);box(formation,[10,.3,3.5],P.ballast,[-3,0,0]);
    for(const z of [-1.1,1.1])rail(formation,0,z,17,.45);
    for(let x=-8;x<8;x+=.65)box(formation,[.2,.16,3],M.aluminum,[x,.2,0]);
    const bridge=part(root,'route-bridge',[5,0,0]);
    box(bridge,[4,.4,3.4],P.blue,[0,-.1,0]);
    for(const x of [-1.65,1.65]){box(bridge,[.5,1.4,4],P.earth,[x,-1,0]);for(const z of [-1,1])box(bridge,[.4,.22,.4],M.dark,[x,-.42,z]);}
    const bearingFlag=crossed(bridge,'bearing-observation',[1.65,.1,1.7],.7);
    const drain=part(root,'route-drainage',[-3,-.8,0]);
    // Four walls leave a real open culvert section rather than a solid cylinder.
    for(const x of [-.7,.7])box(drain,[.15,1,7],P.paper,[x,0,0]);
    for(const y of [-.55,.55])box(drain,[1.55,.15,7],P.paper,[0,y,0]);
    const blocked=group(drain,'drain-obstruction');for(let n=0;n<7;n++)box(blocked,[.25,.3,.4],P.earth,[-.45+(n%3)*.4,-.2+(n%2)*.2,2.7+(n%2)*.3]);
    link(drain,'visible-water-path',[[0,-.35,-4],[0,-.35,4]],P.cyan,.06);
    const inspection=part(root,'route-inspection',[-3,-.9,4]);
    box(inspection,[.08,.8,.08],P.amber,[1,.3,0]);const probe=group(inspection,'culvert-probe');box(probe,[.7,.25,.45],P.blue);cylinder(probe,.12,.16,M.dark,[0,.05,-.28],[Math.PI/2,0,0]);
    const boundary=part(root,'route-work-boundary');
    for(const x of [-5,-1])for(const z of [-4,4]){box(boundary,[.1,1,.1],P.amber,[x,-.5,z]);}
    for(const z of [-4,4])link(boundary,'fixed-work-limit',[[-5,0,z],[-1,0,z]],P.amber,.04);
    const work=group(boundary,'drain-cleaning-equipment');
    cylinder(work,.6,.45,P.blue,[-1.5,-.5,4],[Math.PI/2,0,0]);
    link(work,'cleaning-hose',[[-1.5,-.5,4],[-2,-.6,4],[-3,-.8,3.3],[-3,-.8,1]],M.dark,.08);
    const record=part(root,'route-record',[1,.5,4]);card(record,'observation-record',[0,0,0],2.4,1.5);
    const check=group(record,'follow-up-drainage-check');mark(check,[-.7,.15,0]);
    const open=group(record,'open-follow-up');crossed(open,'check-outstanding',[-.7,.16,0],.5);
    const bearing=mark(record,[.7,.15,0],P.red);
    trace(record,'observation-connection',[[-4,-1.2,0],[-2,-.3,0],[0,.1,0]],P.violet);
    updates.push(s=>{blocked.visible=s.variant==='inspect';probe.visible=s.variant==='inspect'||s.variant==='check';work.visible=s.variant==='work';check.visible=s.variant==='check';open.visible=s.variant!=='check';bearingFlag.visible=bearing.visible=true;});
  }

  if(id==='dependencies'){
    deck(23,13);
    for(const [name,at]of [['station-information-application',[-5,0,-2]],['power-supervision-application',[-5,0,2]],['station-field-interface',[8,0,-2]],['power-field-interface',[8,0,2]]])cabinet(part(root,'dependency-services',at),name,[0,0,0]);
    const fieldA=root.getObjectByName('station-field-interface'),fieldB=root.getObjectByName('power-field-interface');
    const power=part(root,'dependency-power',[0,0,-5]);box(power,[15,.2,.4],P.amber);cabinet(power,'shared-power-source',[-8,0,0]);
    const powerFail=crossed(power,'power-loss-marker',[0,.5,0]);
    for(const z of [-2,2])link(power,'power-feeder',[[-5,.15,0],[-5,.15,z+5]],P.amber,.035);
    const network=part(root,'dependency-network');
    for(const [x,z,name]of [[0,-2,'conduit-A'],[0,3.5,'conduit-B']]){box(network,[2,.25,.8],P.blue,[x,.2,z]);}
    // Zone boundary markers show grouping, without network or access settings.
    for(const x of [-2,5])for(const z of [-3,3])box(network,[.1,.15,2],M.edge,[x,.1,z]);
    const identity=part(root,'dependency-identity',[-8,0,0]);cabinet(identity,'identity-service',[0,0,0],.8,1.4);
    const identityFail=crossed(identity,'identity-unavailable',[0,1.8,0]);
    const config=part(root,'dependency-configuration',[2,0,-5]);card(config,'configuration-record',[0,.2,0]);
    const configMismatch=crossed(config,'configuration-unconfirmed',[0,.4,0]);const configCheck=mark(config,[0,.4,0]);
    const recording=part(root,'dependency-recording',[3,0,5]);cabinet(recording,'service-recorder',[0,0,0],.8,1.5);
    for(let n=0;n<7;n++)mark(recording,[-2+n*.55,.25,1],P.violet);
    const gap=group(recording,'historical-record-gap');box(gap,[.65,.13,.4],P.red,[-.35,.28,1]);
    const recovery=part(root,'dependency-recovery',[6,0,5]);card(recovery,'restoration-check-record',[0,.2,0]);
    const recoveryChecks=group(recovery,'separate-restoration-checks');mark(recoveryChecks,[-.45,.4,0]);mark(recoveryChecks,[.45,.4,0],P.violet);
    const powered=s=>s.variant!=='power-loss';const main=s=>powered(s)&&s.variant!=='network-loss';
    trace(network,'station-path-A',[[-5,1,-2],[0,.7,-2],[8,1,-2]],P.cyan,{active:main});
    trace(network,'station-path-B',[[-5,1,-2],[-3,.6,3.5],[3,.6,3.5],[6,.6,-2],[8,1,-2]],P.green,{active:powered});
    trace(network,'power-supervision-path-A',[[-5,1,2],[0,.7,-2],[5,.7,-2],[8,1,2]],P.violet,{active:main});
    trace(identity,'new-operator-request',[[0,1.2,0],[3,1.2,-2]],P.amber,{active:s=>powered(s)&&s.variant!=='identity-loss'});
    trace(recording,'recording-branch',[[-8,1,-7],[0,1,0]],P.violet,{active:s=>powered(s)&&s.variant!=='record-loss'});
    const pathFail=crossed(network,'path-A-loss',[0,.8,-2]);
    updates.push(s=>{powerFail.visible=s.variant==='power-loss';pathFail.visible=s.variant==='network-loss';identityFail.visible=s.variant==='identity-loss';configMismatch.visible=s.variant==='restored';configCheck.visible=s.variant==='checked';gap.visible=['record-loss','restored','checked'].includes(s.variant);recoveryChecks.visible=s.variant==='checked';
      // Equipment is retained even when its service is unavailable.
      fieldA.visible=fieldB.visible=true;
    });
  }

  if(id==='accessible-journey'){
    deck(22,13);const entrance=part(root,'access-entrance',[-8,0,2]);box(entrance,[4,.25,5],P.paper);for(const x of [-1.6,1.6])box(entrance,[.2,2.5,.2],P.blue,[x,1.2,1.5]);
    const gate=part(root,'access-gate',[-5,0,2]);for(const z of [-1.25,1.25])box(gate,[1.3,1.1,.5],P.blue,[0,.55,z]);for(const z of [-1,1])box(gate,[.6,.6,.08],P.green,[.4,.65,z]);
    // Street and platform are different levels, connected by lift cabins.
    box(root,[10,.3,5.5],mat(0x708b88),[3,3.3,0]);
    const lift=group(root,'lift-and-route-context');
    const lifts=[];for(const [x,z,name]of [[-1,2,'near-lift'],[4,-3,'alternate-lift']]){
      const shaft=group(part(lift,'access-lift',[x,0,z]),name);for(const dx of [-.85,.85])for(const dz of [-.85,.85])box(shaft,[.1,5.6,.1],M.aluminum,[dx,2.7,dz]);
      box(shaft,[1.7,.2,1.7],P.blue,[0,5.5,0]);box(shaft,[1.7,.2,1.7],P.blue,[0,.15,0]);
      const cabin=group(shaft,`${name}-cabin`);box(cabin,[1.5,.15,1.5],P.green,[0,.075,0]);for(const dx of [-.72,.72])box(cabin,[.08,2,1.5],P.blue,[dx,1.15,0]);
      lifts.push({shaft,cabin});
    }
    const outage=crossed(lifts[0].shaft,'near-lift-outage',[0,2.2,1],1.4);
    const stairs=group(root,'stairs-retained');for(let n=0;n<12;n++)box(stairs,[.4,.28*(n+1),1.3],M.edge,[-2+n*.4,.14*(n+1),-2]);
    const info=part(root,'access-information',[-6,0,-2]);cabinet(info,'route-information-display',[0,0,0],1.7,1.8);
    const message=box(info,[1.3,.35,.05],P.red,[0,1.2,.41]);
    for(let x=-8;x<7;x+=.6)box(info,[.35,.04,.4],P.amber,[x+6,.18,3]);
    const assistance=part(root,'access-assistance',[-6,0,4.5]);cabinet(assistance,'passenger-help-point',[0,0,0],.6,1.4);cabinet(assistance,'assistance-position',[13,0,0],1,1.6);
    const boarding=part(root,'access-boarding',[6,3.34,0]);
    // A doorway frame, threshold and floor expose the actual boarding opening.
    const doorway=group(boarding,'vehicle-doorway',[0,0,-3.6]);box(doorway,[3,.22,2],P.blue,[0,0,0]);
    for(const x of [-1.45,1.45]){box(doorway,[.12,2.7,2],P.paper,[x,1.4,0]);box(doorway,[.14,.65,1.1],M.glass,[x,1.7,-.15]);}
    box(doorway,[3,.12,2],P.paper,[0,2.8,0]);box(doorway,[3,2.7,.12],P.blue,[0,1.4,-1]);
    for(const x of [-1.1,1.1])box(doorway,[.18,2.7,.2],M.aluminum,[x,1.35,.8]);box(doorway,[2.4,.18,.2],M.aluminum,[0,2.7,.8]);
    const bridge=box(boarding,[1.9,.12,1.25],P.green,[0,.05,-3.35]);bridge.name='boarding-bridge-plate';
    const gap=crossed(boarding,'boarding-gap-marker',[0,.2,-3.35],.9);
    const available=s=>!['outage'].includes(s.variant);
    trace(entrance,'entrance-to-gate',[[0,.3,0],[3,.3,0]],P.green);
    trace(lift,'near-step-free-route',[[-5,.3,2],[-1,.3,2],[-1,3.65,2],[6,3.65,2],[6,3.65,-2.5]],P.green,{active:s=>available(s)&&s.variant!=='alternative'});
    trace(lift,'route-before-unavailable-lift',[[-5,.3,2],[-2.1,.3,2]],P.green,{active:s=>s.variant==='outage'});
    trace(lift,'alternate-step-free-route',[[-5,.3,2],[-3,.3,4.5],[7,.3,4.5],[8,.3,-3],[4,.3,-3],[4,3.65,-3],[4,3.65,1],[6,3.65,1],[6,3.65,-2.5]],P.green,{active:s=>s.variant==='alternative'});
    trace(boarding,'level-boarding-route',[[0,.25,-2.5],[0,.25,-3.7]],P.green,{active:s=>['available','alternative'].includes(s.variant)});
    trace(boarding,'assisted-boarding-route',[[0,.25,-2.5],[0,.25,-4.7]],P.green,{active:s=>s.variant==='aid-placed'});
    trace(assistance,'help-information-path',[[0,1,0],[13,1,0]],P.violet,{active:s=>['outage','aid-required'].includes(s.variant)});
    updates.push(s=>{const failed=['outage','alternative'].includes(s.variant),needsAid=['aid-required','aid-placed'].includes(s.variant);outage.visible=failed;message.visible=failed||needsAid;
      lifts[0].cabin.position.y=failed?0:3.3;lifts[1].cabin.position.y=s.variant==='alternative'?3.3:0;
      doorway.position.z=needsAid?-4.7:-3.7;bridge.visible=s.variant==='aid-placed';gap.visible=s.variant==='aid-required';
    });
  }

  if(id==='change-evidence'){
    deck(21,12);const item=part(root,'change-item',[-7,0,0]);
    box(item,[2.6,.25,2.5],M.edge,[0,.8,0]);for(const x of [-1,1])for(const z of [-1,1])box(item,[.12,.8,.12],M.steel,[x,.4,z]);
    const module=group(item,'installed-version-B',[0,1.1,0]);box(module,[2,.9,1.7],P.blue,[0,.4,0]);
    for(const z of [-.5,.5])cylinder(module,.16,.3,P.copper,[1.1,.4,z],[0,0,Math.PI/2]);
    explode(module,[0,1.7,0]);const cover=box(module,[2.1,.12,1.8],M.aluminum,[0,.95,0]);shell(cover);
    const baseline=part(root,'change-baseline',[-2.8,0,-3]);card(baseline,'baseline-subject-card',[0,.2,0],2.3,1.5);
    const baselineA=group(baseline,'baseline-version-A');mark(baselineA,[0,.4,0],P.red);
    const baselineB=group(baseline,'baseline-version-B');for(const x of [-.35,.35])mark(baselineB,[x,.4,0],P.green);
    letter(baselineA,'A',[-.7,.4,0]);letter(baselineB,'B',[-.7,.4,0]);
    const requirement=part(root,'change-requirement',[-2.8,0,3]);card(requirement,'two-channel-requirement',[0,.2,0],2.3,1.5);for(const z of [-.35,.35])box(requirement,[1.4,.08,.12],P.violet,[0,.4,z]);
    const iface=part(root,'change-interface',[.8,0,-3]);card(iface,'interface-definition',[0,.2,0],2.2,1.5);for(const z of [-.4,.4])mark(iface,[0,.4,z],P.copper);
    link(iface,'two-connector-interface',[[-6.7,1.5,2.5],[-3,.6,1],[-1,.6,0]],P.copper);
    const test=part(root,'change-test',[.8,0,3]);card(test,'test-subject-and-result',[0,.2,0],2.2,1.5);
    const oldTest=group(test,'test-subject-A');mark(oldTest,[0,.4,0],P.red);
    const newTest=group(test,'test-subject-B');for(const z of [-.35,.35])mark(newTest,[0,.4,z],P.green);
    letter(oldTest,'A',[-.7,.4,0]);letter(newTest,'B',[-.7,.4,0]);
    const testPaths=group(test,'two-channel-test-evidence');for(const z of [-.5,.5])link(testPaths,'channel-evidence',[[-6.7,1.5,z-3],[-4,.5,z],[-.6,.5,z]],P.violet);
    const issues=part(root,'change-issues',[4.5,0,0]);card(issues,'rams-question-board',[0,.2,0],2.6,3);
    for(let n=0;n<4;n++){box(issues,[1,.07,.1],M.dark,[.2,.4,-1+n*.65]);letter(issues,['R','A','M','S'][n],[-.9,.42,-1+n*.65],.35);}
    const openIssue=mark(issues,[.9,.45,.3],P.red);
    const disposition=group(issues,'issue-disposition-record');card(disposition,'disposition-entry',[.8,.55,1.2],1.2,.6);mark(disposition,[.8,.7,1.2],P.amber);
    const acceptance=part(root,'change-acceptance',[8,0,0]);card(acceptance,'handover-decision-record',[0,.2,0],2,2);
    const decision=group(acceptance,'reviewed-decision');for(const z of [-.4,.4])mark(decision,[0,.4,z],P.green);
    trace(baseline,'configuration-mismatch',[[-4.2,1,3],[-1,.5,0],[0,.4,0]],P.red,{active:s=>s.variant==='installed'});
    trace(baseline,'matched-configuration',[[-4.2,1,3],[-1,.5,0],[0,.4,0]],P.green,{active:s=>s.variant!=='installed'});
    trace(requirement,'requirement-to-test',[[0,.5,0],[3.6,.5,0]],P.violet);
    trace(acceptance,'reviewed-evidence-links',[[-7.2,.5,3],[-3.5,.5,0],[0,.5,0],[-3.5,.5,-3]],P.green,{active:s=>s.variant==='reviewed'});
    updates.push(s=>{const tested=['tested','reviewed'].includes(s.variant),reviewed=s.variant==='reviewed';baselineA.visible=s.variant==='installed';baselineB.visible=!baselineA.visible;oldTest.visible=!tested;newTest.visible=testPaths.visible=tested;decision.visible=disposition.visible=reviewed;openIssue.visible=true;});
  }
  registerAnimator(s=>updates.forEach(update=>update(s)));
  return root;
}
