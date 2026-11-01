/* Original schematic assemblies. Geometry encodes interfaces and clearances,
 * not manufacturer dimensions, maintenance instructions or rated performance. */
export function createEquipmentDetails(api){
  const {THREE,M,mat,group,part,mesh,box,cylinder,tube,explode,shell}=api;
  const P={metal:mat(0x9aabb0,.42,.65),dark:mat(0x263b45,.72,.15),blue:mat(0x4f7b86,.65,.2),board:mat(0x417b66,.8,.08),copper:mat(0xbe9569,.48,.5),air:mat(0x80c3cb,.65,.05),water:mat(0x648bb7,.55,.1),rubber:mat(0x303739,.92,.02),pale:mat(0xcbd6d1,.72,.1)};
  const colors={power:P.copper,data:P.air,information:P.air,fluid:P.water,mechanical:P.metal,earth:mat(0x8aa66c,.75,.05)};
  function inspect(node,label,{stage='Working parts',range=[.35,.8],sources=[],description='',interfaces=[]}={}){
    Object.assign(node.userData,{inspectionPart:true,explorationLabel:label,inspectionStage:stage,inspectionRange:range,inspectionSources:sources,inspectionFunction:description,inspectionInterfaces:interfaces,fidelity:'Original schematic mechanism'});return node;
  }
  function separate(node,label,delta,options={}){inspect(node,label,options);explode(node,delta);return node;}
  function assembly(parent,component,at,scale,label,sources){const node=part(parent,component,at);node.scale.setScalar(scale);node.userData.explorationAssembly=component;inspect(node,label,{sources,description:'Inspect physical parts and their named interfaces. Proportions and separation distances are illustrative.'});return node;}
  function annulus(parent,name,inner,outer,depth,material,at=[0,0,0]){
    const profile=[[inner,-depth/2],[outer,-depth/2],[outer,depth/2],[inner,depth/2],[inner,-depth/2]].map(p=>new THREE.Vector2(...p));
    const m=mesh(parent,new THREE.LatheGeometry(profile,40),material,at,[Math.PI/2,0,0]);m.name=name;return m;
  }
  function port(parent,{name,label,at=[0,0,0],kind='data',pins=2,scale=1,description='',sources=[]}){
    const p=inspect(group(parent,name,at),label,{stage:'Interfaces',range:[.2,.55],sources,description,interfaces:[{kind,label}]});p.scale.setScalar(scale);p.userData.interfaceKind=kind;
    box(p,[.21,.16,.085],P.dark);for(let i=0;i<pins;i++){const x=(i-(pins-1)/2)*.14/Math.max(1,pins-1);box(p,[.025,.052,.022],colors[kind]||P.metal,[x,0,.052]);}
    return p;
  }
  function route(parent,{name,label,points,kind='data',from,to,sources=[],radius=.018}){
    const p=inspect(group(parent,name),label,{stage:'Interfaces',range:[.2,.55],sources,description:`${from||'Upstream interface'} → ${to||'downstream interface'}. ${kind==='information'?'Information route, not a physical power conductor.':'Physical route shown schematically.'}`});
    tube(p,points,radius,colors[kind]||P.air,{segments:16});p.userData.interfaceRoute={kind,from,to,points:points.map(p=>p.slice())};return p;
  }
  function paths(node,entries){node.userData.functionalPaths=entries;for(const entry of entries)for(const step of entry.steps||[])if(step.nodeName)node.traverse(n=>{if(n.name===step.nodeName)n.userData.functionalPathIds=[...(n.userData.functionalPathIds||[]),entry.id];});}
  function annotate(node,sources=[]){node.traverse(n=>{if(!n.userData.explorationLabel)return;const label=n.userData.explorationLabel;const outer=/cover|enclosure|roof/i.test(label),interfaces=/terminal|connector|port|cable|tray/i.test(label);inspect(n,label,{sources:n.userData.inspectionSources?.length?n.userData.inspectionSources:sources,stage:n.userData.inspectionStage||(outer?'Open enclosure':interfaces?'Expose interfaces':'Working parts'),range:n.userData.inspectionRange||(outer?[0,.3]:interfaces?[.2,.6]:[.4,1]),description:n.userData.inspectionFunction||label+' — a distinct physical piece in this original generic assembly.'});});return node;}
  function terminalStrip(parent,{name='field-terminals',at=[0,0,0],labels=['Supply +','Supply return','Input','Common'],kind='power',sources=[]}={}){
    const p=inspect(group(parent,name,at),'Named field terminal strip',{stage:'Interfaces',sources,description:'Separate terminals preserve source and destination identity; this is not a wiring schedule.'});
    box(p,[labels.length*.25+.13,.055,.2],P.metal,[0,-.13,-.03]);
    labels.forEach((label,i)=>{const x=(i-(labels.length-1)/2)*.25;port(p,{name:name+'-'+i,label,at:[x,0,0],kind,sources});});return p;
  }
  function rackServices(parent,{width=3,height=5,depth=1.6,sources=['DP03']}={}){
    const pdu=inspect(group(parent,'rack-power-distribution',[width*.43,height*.46,-depth*.35]),'Rack power distribution',{sources,description:'Power reaches each device independently of its data connection.'});
    box(pdu,[.16,height*.68,.13],P.dark);for(let i=0;i<6;i++)port(pdu,{name:'rack-power-outlet-'+i,label:'Equipment power outlet '+(i+1),at:[0,-height*.26+i*height*.1,.08],kind:'power',scale:.55,sources});
    const earth=inspect(group(parent,'rack-bonding-bar',[-width*.4,.25,-depth*.35]),'Protective bonding bar',{sources,description:'Bonding is distinct from data signaling and the equipment supply return.'});box(earth,[.6,.08,.06],P.copper);for(let i=0;i<4;i++)cylinder(earth,.025,.03,P.metal,[-.22+i*.15,0,.05],[Math.PI/2,0,0],8);
    route(parent,{name:'rack-frame-bond',label:'Frame bonding connection',points:[[-width*.4,.25,-depth*.3],[-width*.46,.25,-depth*.3],[-width*.46,.65,-depth*.3]],kind:'earth',from:'Bonding bar',to:'Rack frame',sources});
    for(const side of [-1,1]){const organizer=inspect(group(parent,'rack-cable-manager-'+side,[side*width*.42,height*.6,depth*.42]),'Vertical cable manager',{sources,description:'Cable support keeps the routes visible without specifying installation clearances.'});for(let i=0;i<7;i++)box(organizer,[.17,.055,.13],P.metal,[0,-height*.25+i*height*.08,0]);}
    return {pdu,earth};
  }
  function discBrake(parent,{component='brakes',at=[0,0,0],scale=1,discRadius=.26,discThickness=.055,axleRadius=.065,context='vehicle',rotor:withRotor=true}={}){
    const sources=['DP01'],g=assembly(parent,component,at,scale,'Disc brake assembly',sources),r=discRadius,d=discThickness,padDepth=d*.55,gap=r*.045;
    g.name='shared-disc-brake';g.userData.detailContext=context;g.userData.brakeDimensions={discRadius:r,discThickness:d,axleRadius,padDepth,releasedGap:gap};
    const rotor=inspect(group(g,'brake-disc-rotor'),'Ventilated brake disc',{stage:'Friction pair',range:[.6,1],sources,description:'The rotor follows the axle; the caliper and actuator remain on the frame.'});
    if(withRotor){
      annulus(rotor,'disc-mounting-hub',axleRadius*1.08,r*.43,d*1.3,P.metal);
      for(const sign of [-1,1])annulus(rotor,'disc-friction-ring-'+sign,r*.38,r,d*.24,P.metal,[0,0,sign*d*.38]);
      for(let i=0;i<18;i++){const vane=group(rotor,'disc-ventilation-vane');vane.rotation.z=i*Math.PI/9;box(vane,[r*.59,r*.035,d*.52],P.dark,[r*.68,0,0]);}
    }
    const frame=inspect(group(g,'brake-caliper-carrier'),'Stationary caliper carrier',{sources,description:'Carries brake reaction into the bogie or test fixture, independent of axle rotation.'});
    box(frame,[r*1.05,r*.2,d*4.8],P.blue,[0,r*1.12,0]);for(const sign of [-1,1])box(frame,[r*1.05,r*.7,d*.8],P.blue,[0,r*.82,sign*d*2]);
    const pads=[],rods=[];for(const sign of [-1,1]){
      const carrier=group(g,'brake-pad-carrier-'+sign,[0,r*.68,sign*(d/2+padDepth/2+gap)]);carrier.userData.side=sign;
      inspect(carrier,sign>0?'Near brake pad and backing plate':'Far brake pad and backing plate',{stage:'Friction pair',range:[.55,.9],sources,description:'The pad approaches one friction face and stops at contact; it does not pass through the disc.'});
      const pad=box(carrier,[r*.72,r*.46,padDepth],P.rubber);pad.name='brake-friction-pad';box(carrier,[r*.8,r*.5,d*.22],P.metal,[0,0,sign*(padDepth/2+d*.11)]);pads.push(carrier);separate(carrier,carrier.userData.explorationLabel,[0,0,sign*r*1.4],{stage:'Friction pair',range:[.55,.9],sources});
      const lever=inspect(group(frame,'brake-lever-'+sign,[0,r*.86,sign*d*1.9]),'Caliper lever',{sources,description:'A generic linkage distributes actuator motion to the opposed pad carriers.'});box(lever,[r*.19,r*.65,d*.42],P.metal);cylinder(lever,r*.07,d*.8,P.copper,[0,r*.22,0],[Math.PI/2,0,0],12);
      const rod=cylinder(g,r*.055,1,P.metal,[0,r*.68,sign*d*1.7],[Math.PI/2,0,0],12);rod.name='brake-pad-pushrod';rod.userData.side=sign;rods.push(rod);
    }
    const actuator=inspect(group(g,'brake-actuator',[0,r*1.52,0]),'Pneumatic actuator section',{stage:'Actuator',range:[.3,.7],sources,description:'Compressed air acts on the actuator; mechanical linkage applies the opposed pads. No pressure-to-force law is supplied.'});
    const body=group(actuator,'brake-actuator-cover');mesh(body,new THREE.CylinderGeometry(r*.22,r*.22,r*.8,20,1,true),P.blue,[0,0,0],[0,0,Math.PI/2]);shell(body);separate(body,'Actuator cylinder cover',[0,r*.6,0],{stage:'Open enclosure',range:[0,.3],sources});
    const piston=inspect(group(actuator,'brake-actuator-piston'),'Actuator piston and pushrod',{sources});cylinder(piston,r*.19,r*.07,P.metal,[0,0,0],[0,0,Math.PI/2],20);cylinder(piston,r*.045,r*.62,P.metal,[r*.3,0,0],[0,0,Math.PI/2],12);
    port(actuator,{name:'brake-air-inlet',label:'Actuator compressed-air inlet',at:[-r*.35,0,r*.18],kind:'fluid',scale:r*.8,sources});
    paths(g,[{id:'brake-force',label:'Air to friction force',description:'Supply → actuator → linkage → pads → disc; frame reaction is separate from wheel rotation.',steps:[{label:'Air inlet',nodeName:'brake-air-inlet'},{label:'Piston',nodeName:'brake-actuator-piston'},{label:'Caliper',nodeName:'brake-caliper-carrier'},{label:'Pad',nodeName:'brake-pad-carrier-1'},{label:'Disc',nodeName:'brake-disc-rotor'}],sources}]);
    const apply=amount=>{const a=Math.max(0,Math.min(1,Number(amount)||0));for(const pad of pads)pad.position.z=pad.userData.side*(d/2+padDepth/2+gap*(1-a));for(const rod of rods){const back=d/2+padDepth+gap*(1-a)+d*.22,anchor=d*2;rod.scale.y=anchor-back;rod.position.z=rod.userData.side*(anchor+back)/2;}piston.position.x=r*.12*a;g.userData.applicationFraction=a;};apply(0);
    return {node:g,rotor,pads,rods,piston,apply,rotate(angle){rotor.rotation.z=Number.isFinite(angle)?angle:0;}};
  }
  function hvac(parent,{component='hvac',at=[0,0,0],scale=1,context='vehicle'}={}){
    const sources=['DP02'],g=assembly(parent,component,at,scale,'Supply-air treatment module',sources);g.name='shared-hvac-module';g.userData.detailContext=context;
    box(g,[6.4,.1,2.4],P.metal,[0,.05,0]);for(const x of [-3.1,3.1])for(const z of [-1.15,1.15])box(g,[.08,1.6,.08],P.metal,[x,.86,z]);
    const cover=group(g,'hvac-unit-cover');box(cover,[6.4,.07,2.4],P.blue,[0,1.7,0]);box(cover,[6.4,1.6,.04],P.blue,[0,.85,-1.2]);box(cover,[6.4,1.6,.04],P.blue,[0,.85,1.2]);shell(cover);separate(cover,'HVAC access panels',[0,1.3,0],{stage:'Open enclosure',range:[0,.25],sources});
    const inlet=inspect(group(g,'hvac-inlet-damper',[-2.95,.85,0]),'Inlet damper blades',{sources,description:'Controls the inlet passage; no smoke-control duty is inferred.'});for(let y=-.55;y<=.56;y+=.28)box(inlet,[.06,.24,1.9],P.metal,[0,y,0],[0,0,-.35]);
    const filter=group(g,'hvac-removable-filter',[-2.35,.85,0]);for(const y of [-.7,.7])box(filter,[.14,.07,2],P.metal,[0,y,0]);for(const z of [-1,1])box(filter,[.14,1.4,.06],P.metal,[0,0,z]);for(let z=-.9;z<=.91;z+=.12)box(filter,[.12,1.3,.025],P.pale,[0,0,z],[0,(Math.round((z+.9)/.12)%2?1:-1)*.55,0]);separate(filter,'Pleated air filter',[0,.35,1.65],{stage:'Air treatment',range:[.25,.55],sources});
    const coil=group(g,'hvac-heat-exchanger',[-.6,.85,0]);for(let x=-.25;x<=.26;x+=.08)box(coil,[.018,1.35,2],P.metal,[x,0,0]);
    const coilPoints=[];for(let i=0;i<6;i++){const y=-.55+i*.22;coilPoints.push([-.08,y,i%2?1.04:-1.04],[.08,y,i%2?-1.04:1.04]);}tube(coil,coilPoints,.035,P.copper,{segments:32});separate(coil,'Finned heat-exchanger coil',[0,.3,-1.7],{stage:'Air treatment',range:[.4,.7],sources});
    const tray=inspect(group(g,'hvac-condensate-tray',[-.6,.17,0]),'Condensate pan and drain',{sources,description:'Collected liquid leaves through a drain independently of the supply-air path.'});box(tray,[1.2,.035,2.12],P.water);for(const z of [-1.05,1.05])box(tray,[1.2,.13,.025],P.metal,[0,.065,z]);route(g,{name:'hvac-condensate-drain',label:'Condensate drain',points:[[-.6,.17,1.05],[-.6,-.12,1.05],[-.6,-.12,1.55]],kind:'fluid',from:'Condensate pan',to:'Drain connection',sources,radius:.04});
    const fan=inspect(group(g,'hvac-supply-fan',[1.65,.85,0]),'Supply-air fan impeller',{sources,description:'The rotating impeller moves air through the treatment path; arrows show direction, not solved flow.'});
    for(const x of [-.32,.32])annulus(fan,'fan-side-ring',.58,.62,.045,P.metal,[x,0,0]).rotation.set(0,0,Math.PI/2);
    // A selected axial-flow teaching fan: blades join the hub and leave an
    // open annular passage; thin shroud rings do not fill the working area.
    for(let i=0;i<12;i++){const vane=group(fan,'hvac-fan-vane');vane.rotation.x=i*Math.PI/6;box(vane,[.055,.43,.17],P.metal,[0,.355,0],[0,.35,0]);}
    cylinder(fan,.14,.8,P.blue,[0,0,0],[0,0,Math.PI/2],16);separate(fan,'Supply-air impeller',[0,.3,1.7],{stage:'Fan and drive',range:[.6,1],sources});
    const motor=inspect(group(g,'hvac-fan-motor',[2.2,.85,0]),'Fan drive motor',{sources});cylinder(motor,.28,.45,P.blue,[0,0,0],[0,0,Math.PI/2],20);box(g,[.55,.48,.45],P.metal,[2.2,.33,0]);
    for(const [name,label,y]of [['hvac-coil-supply','Coil fluid supply',1.35],['hvac-coil-return','Coil fluid return',.35]]){port(g,{name,label,at:[-.6,y,-1.24],kind:'fluid',sources});route(g,{name:name+'-pipe',label,points:[[-.6,y,-1.24],[-.6,y,-1.04]],kind:'fluid',from:label,to:'Coil manifold',sources,radius:.035});}
    const flow=inspect(group(g,'hvac-supply-air'),'Supply air through filter, coil and fan',{sources,description:'A selected draw-through teaching arrangement; other component orders exist.'});for(const x of [-2.7,-1.5,.4,2.8]){const arrow=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(x,.85,.82),.45,0x86bdca,.13,.08);flow.add(arrow);}
    paths(g,[{id:'supply-air',label:'Supply-air path',description:'Inlet damper → filter → coil → fan → supply duct.',steps:[{label:'Inlet',nodeName:'hvac-inlet-damper'},{label:'Filter',nodeName:'hvac-removable-filter'},{label:'Coil',nodeName:'hvac-heat-exchanger'},{label:'Fan',nodeName:'hvac-supply-fan'},{label:'Supply air',nodeName:'hvac-supply-air'}],sources},{id:'coil-fluid',label:'Thermal and condensate interfaces',description:'The fluid circuit exchanges heat with air. Condensate drainage is a third path.',steps:[{label:'Supply',nodeName:'hvac-coil-supply'},{label:'Coil',nodeName:'hvac-heat-exchanger'},{label:'Return',nodeName:'hvac-coil-return'},{label:'Drain pan',nodeName:'hvac-condensate-tray'}],sources}]);
    return {node:g,fan,filter,coil,cover,animate(phase){fan.rotation.x=(Number(phase)||0)*Math.PI*2;}};
  }
  function reciprocatingCompressor(parent,{at=[0,0,0],scale=1}={}){
    const sources=['P07'],g=assembly(parent,'compressor',at,scale,'Air-supply module — piston example',sources);
    g.userData.inspectionFunction='An original single-cylinder teaching section separates the motor, crank, rod, piston, air treatment and receiver. Rail air-supply units also use multi-cylinder or screw arrangements.';
    box(g,[1.65,.10,.85],P.metal,[0,.05,0]);
    for(const x of [-.65,.65])for(const z of [-.3,.3])cylinder(g,.055,.09,P.rubber,[x,-.045,z],null,10);
    const motor=inspect(group(g,'compressor-drive-motor',[0,.30,-.36]),'Compressor motor',{sources,description:'The motor drives the crankshaft; its enclosure is stationary.'});
    cylinder(motor,.20,.38,P.blue,[0,0,0],[Math.PI/2,0,0],18);
    cylinder(g,.055,.35,P.metal,[0,.30,-.15],[Math.PI/2,0,0],12);
    const crank=inspect(group(g,'compressor-crankshaft',[0,.30,.10]),'Crankshaft and offset crankpin',{sources,description:'The offset crankpin drives the connecting rod through one revolution.'});
    cylinder(crank,.185,.055,P.metal,[0,0,0],[Math.PI/2,0,0],20);
    cylinder(crank,.035,.09,P.copper,[0,.12,.055],[Math.PI/2,0,0],12);
    const crankCover=group(g,'compressor-crankcase-cover',[0,.30,.10]);
    box(crankCover,[.46,.46,.045],P.blue,[0,0,.15]);shell(crankCover);separate(crankCover,'Crankcase access cover',[0,0,.45],{stage:'Open enclosure',range:[0,.3],sources});
    const barrel=inspect(group(g,'compressor-cylinder-wall',[0,.83,.16]),'Cylinder bore section',{sources,description:'The piston translates within the fixed bore; the section exposes its travel.'});
    mesh(barrel,new THREE.CylinderGeometry(.18,.18,.50,20,1,true,Math.PI*.20,Math.PI*1.4),P.metal);
    const barrelSection=group(barrel,'compressor-cylinder-section');mesh(barrelSection,new THREE.CylinderGeometry(.18,.18,.50,12,1,true,Math.PI*1.6,Math.PI*.6),P.blue);shell(barrelSection);separate(barrelSection,'Removable cylinder section',[.38,.1,.35],{stage:'Expose the working chamber',range:[.3,.6],sources});
    const head=inspect(group(g,'compressor-cylinder-head',[0,1.10,.16]),'Head with inlet and delivery interfaces',{sources,description:'Inlet and delivery valves are distinct interfaces. Valve response and pressure are not calculated by this kinematic model.'});
    cylinder(head,.22,.08,P.metal,[0,0,0],null,20);for(const x of [-.12,.12])cylinder(head,.035,.04,P.dark,[x,.06,0],null,10);
    separate(head,'Cylinder head',[0,.4,0],{stage:'Expose the working chamber',range:[.45,.8],sources});
    const piston=inspect(group(g,'compressor-piston',[0,.76,.16]),'Piston and wrist pin',{sources,description:'The wrist pin follows the slider-crank relation, retaining a constant rod length throughout the cycle.'});
    cylinder(piston,.167,.12,P.metal,[0,0,0],null,20);for(const y of [-.03,.03])mesh(piston,new THREE.TorusGeometry(.167,.006,4,20),P.dark,[0,y,0],[Math.PI/2,0,0]);
    cylinder(piston,.035,.15,P.copper,[0,0,0],[Math.PI/2,0,0],10);
    const rod=inspect(cylinder(g,.027,.46,P.metal,[0,.53,.16]),'Connecting rod',{sources,description:'A constant-length rod joins the crankpin to the piston pin.'});rod.name='compressor-connecting-rod';
    const filter=inspect(group(g,'compressor-inlet-filter',[-.47,1.10,.16]),'Air inlet filter',{sources});cylinder(filter,.13,.24,P.pale,[0,0,0],[0,0,Math.PI/2],14);
    route(g,{name:'compressor-inlet-passage',label:'Ambient-air inlet',points:[[-.35,1.10,.16],[-.12,1.10,.16]],kind:'fluid',from:'Inlet filter',to:'Cylinder head inlet',sources,radius:.035});
    const dryer=inspect(group(g,'compressor-dryer',[.59,.77,.16]),'Separate air-drying section',{sources,description:'Air treatment and condensate management are separate from mechanical compression.'});cylinder(dryer,.13,.43,P.blue,[0,0,0],null,16);
    const receiver=inspect(group(g,'compressor-receiver',[.55,.31,.10]),'Compressed-air receiver',{sources});cylinder(receiver,.19,.72,P.metal,[0,0,0],[Math.PI/2,0,0],18);
    route(g,{name:'compressor-delivery-passage',label:'Compression to treatment and storage',points:[[.12,1.10,.16],[.59,1.10,.16],[.59,.97,.16]],kind:'fluid',from:'Cylinder head delivery',to:'Air treatment',sources,radius:.035});
    route(g,{name:'compressor-receiver-passage',label:'Treatment to receiver',points:[[.59,.55,.16],[.59,.40,.16]],kind:'fluid',from:'Air treatment',to:'Receiver',sources,radius:.035});
    port(g,{name:'compressor-supply-outlet',label:'Downstream pneumatic supply',at:[.55,.31,.50],kind:'fluid',sources});
    port(g,{name:'compressor-motor-supply',label:'Motor electrical supply',at:[0,.30,-.61],kind:'power',sources});
    paths(g,[{id:'compressor-mechanical',label:'Motor to piston motion',description:'The motor turns the crank; the rod drives a translating piston. The geometric cycle does not calculate pressure or delivered flow.',steps:[{label:'Motor',nodeName:'compressor-drive-motor'},{label:'Crank',nodeName:'compressor-crankshaft'},{label:'Rod',nodeName:'compressor-connecting-rod'},{label:'Piston',nodeName:'compressor-piston'}],sources},{id:'compressed-air',label:'Air supply and treatment',description:'Compression, drying and storage perform different jobs. The route is a simplified functional arrangement.',steps:[{label:'Filter',nodeName:'compressor-inlet-filter'},{label:'Head',nodeName:'compressor-cylinder-head'},{label:'Dryer',nodeName:'compressor-dryer'},{label:'Receiver',nodeName:'compressor-receiver'},{label:'Supply',nodeName:'compressor-supply-outlet'}],sources}]);
    const radius=.12,length=.46,axis=new THREE.Vector3(0,1,0);
    g.userData.sliderCrank={radius,rodLength:length,boreRadius:.18,pistonRadius:.167};
    const animate=angle=>{
      angle=Number(angle)||0;crank.rotation.z=angle;
      const crankPin=new THREE.Vector3(-radius*Math.sin(angle),.30+radius*Math.cos(angle),.16);
      const height=.30+radius*Math.cos(angle)+Math.sqrt(length*length-radius*radius*Math.sin(angle)**2);
      piston.position.y=height;const pistonPin=new THREE.Vector3(0,height,.16),vector=pistonPin.clone().sub(crankPin);
      rod.position.copy(crankPin).add(pistonPin).multiplyScalar(.5);rod.quaternion.setFromUnitVectors(axis,vector.clone().normalize());
      g.userData.crankAngle=angle;g.userData.rodEndpoints=[crankPin.toArray(),pistonPin.toArray()];
    };animate(0);
    return {node:g,crank,piston,rod,animate};
  }
  function powerInterfaces(g,{kind='transformer',dc=false}={}){
    if(g.userData.powerInterfaces)return g;g.userData.powerInterfaces=true;
    const find=name=>g.getObjectByName(name);
    const sources=kind==='transformer'?['EM01','E02']:kind==='rectifier'?['EM02','P12']:dc?['P01','CM01']:['DP07','CM01'];
    annotate(g,sources);
    if(kind==='transformer'){
      for(const [row,z,radius]of [['primary',-.55,.29],['secondary',.55,.195]])for(const [index,x]of [-.74,0,.74].entries()){
        const end=inspect(group(find('transformer-'+row+'-terminal-row')||g,`transformer-${row}-terminal-${index}`,[x,2.77,z]),`${row==='primary'?'Primary':'Secondary'} terminal ${index+1}`,{stage:'Locate core and terminals',range:[.35,.65],sources,description:'A named phase connection to this winding group. Terminal labels are illustrative.'});cylinder(end,.05,.04,P.copper,[0,0,0],null,10);
        route(find('transformer-'+row+'-winding')||g,{name:`transformer-${row}-lead-${index}`,label:`${row==='primary'?'Primary':'Secondary'} winding lead ${index+1}`,points:[[x+radius,1.76,0],[x+radius,1.96,z],[x,2.12,z],[x,2.3,z]],kind:'power',from:`${row} winding ${index+1}`,to:`${row} terminal ${index+1}`,sources,radius:.022});
      }
      const clamp=inspect(group(g,'transformer-core-clamps'),'Core support and clamping frame',{sources,description:'Mechanical supports retain the core independently of the insulated winding terminals.'});for(const y of [.29,2.06]){box(clamp,[2.25,.065,.28],P.metal,[0,y,0]);for(const x of [-.97,.97])cylinder(clamp,.045,.1,P.dark,[x,y,0],null,8);}
      terminalStrip(g,{name:'transformer-instrument-terminals',at:[-.84,.43,.99],labels:['Thermal observation','Reference'],kind:'information',sources:['CM01']}).scale.setScalar(.65);
      paths(g,[{id:'transformer-primary-path',label:'Primary connection and winding',description:'The primary and secondary remain insulated circuits coupled by the magnetic core; no conducting lead joins them.',steps:[{label:'Primary terminal',nodeName:'transformer-primary-terminal-0'},{label:'Primary lead',nodeName:'transformer-primary-lead-0'},{label:'Primary winding',conceptId:'transformer-primary-winding',nodeName:'transformer-primary-winding'},{label:'Core',conceptId:'transformer-core',nodeName:'transformer-core'}],sources},{id:'transformer-secondary-path',label:'Secondary winding and connection',description:'Trace the separate secondary lead to its own terminals.',steps:[{label:'Core',conceptId:'transformer-core',nodeName:'transformer-core'},{label:'Secondary winding',conceptId:'transformer-secondary-winding',nodeName:'transformer-secondary-winding'},{label:'Secondary lead',nodeName:'transformer-secondary-lead-0'},{label:'Secondary terminal',nodeName:'transformer-secondary-terminal-0'}],sources}]);
    }else if(kind==='rectifier'){
      for(const [i,x]of [-.65,0,.65].entries())port(find('rectifier-busbar')||g,{name:'rectifier-ac-terminal-'+i,label:'AC input '+(i+1),at:[x,2.3,-.64],kind:'power',scale:.65,sources});
      for(const [name,label,y,z]of [['positive','DC positive output',1.88,.9],['return','DC return connection',.47,-.65]])port(find('rectifier-busbar')||g,{name:'rectifier-'+name+'-terminal',label,at:[.95,y,z],kind:'power',scale:.8,sources});
      const observation=terminalStrip(g,{name:'rectifier-observation-terminals',at:[0,.32,.91],labels:['Thermal observation','Reference','Local status'],kind:'information',sources:['CM01']});observation.scale.setScalar(.8);
      const sensor=inspect(group(g,'rectifier-thermal-pickup',[-.86,1.66,.43]),'Heat-sink temperature pickup',{sources:['CM01'],description:'An illustrative observation interface; it does not implement thermal protection.'});box(sensor,[.09,.13,.07],P.dark);
      route(g,{name:'rectifier-observation-route',label:'Thermal observation lead',points:[[-.86,1.66,.43],[-.98,1.66,.76],[-.98,.32,.76],[0,.32,.91]],kind:'information',from:'Heat-sink pickup',to:'Observation terminals',sources:['CM01'],radius:.012});
      paths(g,[{id:'rectifier-main-path',label:'AC input and separate DC outputs',description:'Named terminals, semiconductor stacks and busbars remain distinct from the observation circuit.',steps:[{label:'AC terminals',nodeName:'rectifier-ac-terminal-0'},{label:'Device stacks',conceptId:'rectifier-diode-stack',nodeName:'rectifier-diode-stack'},{label:'Busbars',conceptId:'rectifier-busbar',nodeName:'rectifier-busbar'},{label:'DC positive',nodeName:'rectifier-positive-terminal'},{label:'Return',nodeName:'rectifier-return-terminal'}],sources},{id:'rectifier-thermal-path',label:'Heat and observation',description:'Heat-sink structure and its illustrative temperature observation do not form the main current path.',steps:[{label:'Cooling',conceptId:'rectifier-cooling',nodeName:'rectifier-cooling'},{label:'Pickup',nodeName:'rectifier-thermal-pickup'},{label:'Observation terminals',nodeName:'rectifier-observation-terminals'}],sources:['CM01','EM02']}]);
    }else{
      const xs=dc?[0]:[-.29,0,.29];
      const door=find('switchgear-removable-front');if(door)inspect(door,'Switchgear front enclosure',{stage:'Open enclosure',range:[0,.3],sources});
      xs.forEach((x,i)=>{
        const support=inspect(group(g,'switchgear-cable-termination-'+i,[x,.31,-.36]),dc?'DC feeder termination':'AC cable termination '+(i+1),{stage:'Connection compartment',range:[.3,.6],sources});cylinder(support,.065,.22,P.pale,[0,0,0],null,12);cylinder(support,.03,.17,P.copper,[0,.18,0],null,10);
        route(g,{name:'switchgear-incoming-link-'+i,label:'Bus to upper pole connection '+(i+1),points:[[x,1.96,-.28],[x,1.96,.06]],kind:'power',from:'Main bus',to:'Upper pole terminal',sources,radius:.026});
        route(g,{name:'switchgear-feeder-link-'+i,label:'Lower pole to cable termination '+(i+1),points:[[x,1.06,.06],[x,1.0,-.4],[x,.49,-.4],[x,.49,-.36]],kind:'power',from:'Lower pole terminal',to:'Cable termination',sources,radius:.024});
      });
      terminalStrip(g,{name:'switchgear-control-terminals',at:[0,2.27,.4],labels:['Request','Position','Auxiliary supply','Return'],kind:'information',sources:['CM01']}).scale.setScalar(.64);
      route(g,{name:'switchgear-position-feedback',label:'Mechanism position observation',points:[[.28,.55,.25],[.43,.55,.36],[.43,2.27,.36],[.08,2.27,.4]],kind:'information',from:'Mechanism auxiliary position contact',to:'Position terminal',sources:['CM01'],radius:.009});
      const aux=inspect(group(g,'switchgear-auxiliary-contact',[.28,.55,.25]),'Auxiliary mechanism contact',{sources:['CM01'],description:'Mechanism position is separate from a command and from proof of electrical isolation.'});box(aux,[.11,.13,.07],P.dark);
      const bond=inspect(group(g,'switchgear-frame-bond',[-.41,.18,.42]),'Enclosure bonding point',{sources,description:'A mechanical/electrical interface to the enclosure; it is not a supply return conductor.'});cylinder(bond,.035,.035,P.copper,[0,0,0],[Math.PI/2,0,0],8);
      paths(g,[{id:'switchgear-power',label:dc?'DC feeder power path':'AC feeder power path',description:'Bus → pole → outgoing termination. Separate phases remain distinct in the AC variant.',steps:[{label:'Bus',conceptId:'switchgear-busbar',nodeName:'switchgear-busbar'},{label:'Incoming link',nodeName:'switchgear-incoming-link-0'},{label:'Pole',conceptId:'switchgear-pole',nodeName:'switchgear-pole'},{label:'Outgoing link',nodeName:'switchgear-feeder-link-0'},{label:'Termination',nodeName:'switchgear-cable-termination-0'}],sources},{id:'switchgear-supervision',label:'Supervisory interface',description:'Control terminals and an auxiliary observation are distinct from power conductors and local protection.',steps:[{label:'Auxiliary contact',nodeName:'switchgear-auxiliary-contact'},{label:'Feedback lead',nodeName:'switchgear-position-feedback'},{label:'Terminals',nodeName:'switchgear-control-terminals'}],sources:['CM01']}]);
    }
    return g;
  }
  return {P,inspect,separate,assembly,annulus,port,route,paths,annotate,terminalStrip,rackServices,discBrake,hvac,reciprocatingCompressor,powerInterfaces};
}
