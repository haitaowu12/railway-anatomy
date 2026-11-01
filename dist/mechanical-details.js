export { MECHANICAL_SOURCES } from './mechanical-content.js';

// Original, dimensionless explanatory geometry. Each named part represents a
// mechanical role or interface; decorative repetition is kept out of the tree.
export function createMechanicalDetails(api) {
  const { THREE, M, mat, group, mesh, box, cylinder, tube, explode, shell } = api;
  const rubber = mat(0x27383b, .94, .02), insulation = mat(0xc9c6a9, .82, .02);
  const phaseMaterials = [M.copper, mat(0xc89960, .4, .65), mat(0x9f694f, .45, .6)];
  function mark(node, label, { sources = ['MD01'], function: purpose = '', interfaces = [], stage = null, range = null } = {}) {
    Object.assign(node.userData, { inspectionPart: true, explorationLabel: label, inspectionSources: sources, inspectionFunction: purpose, inspectionInterfaces: interfaces, fidelity: 'Original schematic mechanism; dimensions and clearances illustrative' });
    if (stage && range) Object.assign(node.userData, { inspectionStage: stage, inspectionRange: range });
    return node;
  }
  function piece(parent, name, label, at = [0, 0, 0], options = {}) { return mark(group(parent, name, at), label, options); }
  function move(node, delta, label = 'Inspect the working parts', range = [.35, 1]) { explode(node, delta); Object.assign(node.userData, { inspectionStage: label, inspectionRange: range }); return node; }
  function ring(parent, inner, outer, depth, material, at = [0, 0, 0], arc = Math.PI * 2) {
    const p = [[inner, -depth/2], [outer, -depth/2], [outer, depth/2], [inner, depth/2], [inner, -depth/2]].map(([x,y]) => new THREE.Vector2(x,y));
    return mesh(parent, new THREE.LatheGeometry(p, 32, 0, arc), material, at, [Math.PI/2,0,0]);
  }
  function spring(parent, { at, radius = .1, height = .22, turns = 4, wire = .016, name = 'primary-coil-spring' }) {
    const g = piece(parent, name, 'Primary coil spring', at, { function: 'Carries load between an axlebox spring seat and the bogie frame.', interfaces: ['Axlebox seat', 'Frame seat'] });
    const points = Array.from({length:73}, (_,i) => { const t=i/72,a=t*Math.PI*2*turns;return [Math.cos(a)*radius,t*height,Math.sin(a)*radius]; });
    tube(g, points, wire, M.steel, {segments:72});
    for (const y of [0,height]) cylinder(g,radius*1.22,.028,M.core,[0,y,0],null,18);
    move(g,[0,.32,0],'Separate the suspension levels',[.25,.55]); return g;
  }
  function bearing(parent, { at = [0,0,0], scale = 1, name = 'axle-bearing', label = 'Roller bearing unit', sources = ['MD01'], detailed = true } = {}) {
    const g = piece(parent,name,label,at,{sources,function:'Rolling elements transmit shaft load between the inner and outer raceways.',interfaces:['Rotating shaft seat','Stationary housing bore']});g.scale.setScalar(scale);
    if(!detailed){
      mark(g,'Bearing unit envelope',{sources,function:'Compact context representation; the dedicated bogie view exposes races, rollers, cage and seals.'});
      const inner=piece(g,'bearing-inner-race','Schematic inner bearing ring',undefined,{sources});ring(inner,.077,.095,.14,M.steel);
      const outer=piece(g,'bearing-outer-race','Schematic outer bearing ring',undefined,{sources});ring(outer,.126,.145,.14,M.core);
      const seal=piece(g,'bearing-end-seal','Bearing seal',[0,0,.083],{sources});ring(seal,.078,.142,.018,rubber);
      return {node:g,inner,outer,rollers:null,seal,animate(angle){inner.rotation.z=Number(angle)||0;}};
    }
    const inner=piece(g,'bearing-inner-race','Inner race',undefined,{sources,function:'The inner race seats on the axle journal.'});ring(inner,.077,.095,.14,M.steel);
    const outer=piece(g,'bearing-outer-race','Outer race',undefined,{sources,function:'The outer race transfers bearing load into the housing.'});
    ring(outer,.126,.145,.14,M.steel,undefined,Math.PI*1.45); // authored open sector for inspection
    const outerSector=piece(g,'bearing-race-section','Outer-race section',undefined,{sources});
    const sector=ring(outerSector,.126,.145,.14,M.steel,undefined,Math.PI*.55);sector.rotation.y=Math.PI*1.45;shell(outerSector);move(outerSector,[.18,.13,0],'Expose bearing races',[.35,.65]);
    const rollers=piece(g,'bearing-roller-and-cage-set','Rollers and cage',undefined,{sources:[...sources,'MD06'],function:'The rollers spin while the cage carries them around the shaft more slowly than the inner ring. The outer ring remains fixed. Radial contact and no slip are assumed.'});
    const innerRadius=.095,outerRadius=.126,orbitRadius=(innerRadius+outerRadius)/2,rollerRadius=(outerRadius-innerRadius)/2;
    const rollingElements=[],axis=new THREE.Vector3(0,0,1),axial=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6,roller=cylinder(rollers,rollerRadius,.108,M.aluminum,[Math.cos(a)*orbitRadius,Math.sin(a)*orbitRadius,0],[Math.PI/2,0,0],12);
      roller.name='bearing-rolling-element';rollingElements.push(roller);
      // The small stripe makes self-spin visible on a circular roller without
      // changing its cylindrical contact surface or its physical identity.
      box(roller,[rollerRadius*1.45,.0015,rollerRadius*.22],M.core,[0,.0548,0]);
      const cageAngle=a+Math.PI/12;
      box(rollers,[.009,.009,.115],M.copper,[Math.cos(cageAngle)*orbitRadius,Math.sin(cageAngle)*orbitRadius,0]);
    }
    for(const z of [-.06,.06])ring(rollers,.101,.121,.009,M.copper,[0,0,z]);
    move(rollers,[.18,-.22,.24],'Expose rolling elements',[.65,1]);
    const seal=piece(g,'bearing-end-seal','Bearing seal', [0,0,.083],{sources,function:'Keeps lubricant within and contamination outside the bearing enclosure.',interfaces:['Shaft seal track','Housing seat']});ring(seal,.078,.142,.018,rubber);move(seal,[0,0,.35],'Expose bearing races',[.35,.65]);
    const cageRatio=innerRadius/(innerRadius+outerRadius),spinRatio=-innerRadius/(outerRadius-innerRadius);
    g.userData.bearingKinematics={innerRadius,outerRadius,orbitRadius,rollerRadius,cageRatio,spinRatio,assumption:'Radial cylindrical rollers; stationary outer ring; no slip'};
    const animate=angle=>{
      angle=Number(angle)||0;inner.rotation.z=angle;rollers.rotation.z=angle*cageRatio;
      for(const roller of rollingElements)roller.quaternion.setFromAxisAngle(axis,angle*(spinRatio-cageRatio)).multiply(axial);
    };
    animate(0);
    return { node:g, inner, outer, rollers, seal, animate };
  }
  function axlebox(parent,{at=[0,0,0],side=1,detailed=true}={}) {
    const g=piece(parent,'axlebox-'+(side>0?'near':'far'),'Axlebox housing and bearing',at,{function:'Holds the bearing outer ring and transfers wheelset load to the primary suspension.'});
    g.userData.inspectionDirection=[side*.8,.6,side];
    const housing=piece(g,'axlebox-housing','Axlebox housing');
    for(const x of [-.176,.176])box(housing,[.045,.31,.28],M.core,[x,0,0]);
    for(const y of [-.168,.168])box(housing,[.39,.045,.28],M.core,[0,y,0]);
    const cover=piece(g,'axlebox-end-cover','Axlebox end cover',[0,0,side*.165],{function:'Closes the stationary axlebox end and exposes the bearing when removed.'});ring(cover,.078,.183,.035,M.teal);for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;cylinder(cover,.024,.04,M.steel,[Math.cos(a)*.159,Math.sin(a)*.159,0],[Math.PI/2,0,0],6);}shell(cover);move(cover,[-side*.38,.12,side*.33],'Open axlebox covers',[0,.3]);
    const b=bearing(g,{detailed});if(side<0)b.node.rotation.y=Math.PI;
    return {node:g,bearing:b,housing};
  }
  function suspension(chassis,{detailed=true}={}) {
    const primary=[],secondary=[];
    for(const x of [-1.02,1.02])for(const z of [-.99,.99]){
      const springNode=spring(chassis,{at:[x,.76,z],height:.20,turns:detailed?4:3,name:'primary-spring-'+(x<0?'rear':'front')+'-'+(z<0?'far':'near')});primary.push(springNode);
      box(chassis,[.24,.07,.94],M.teal,[x,.99,z/2]);
    }
    for(const z of [-.55,.55]){
      const g=piece(chassis,'secondary-air-spring-'+(z<0?'far':'near'),'Secondary air spring',[0,1.055,z],{function:'Separates the vehicle body from the bogie frame through an air-spring and emergency-spring arrangement.',interfaces:['Frame lower plate','Body upper plate']});
      const lower=piece(g,'air-spring-lower-plate','Air-spring lower plate');cylinder(lower,.255,.04,M.steel,[0,0,0],null,24);
      const bellows=piece(g,'air-spring-bellows','Flexible air-spring bellows',[0,.1,0]);
      const points=[[.11,-.09],[.21,-.09],[.255,-.045],[.26,.025],[.225,.085],[.11,.085]].map(p=>new THREE.Vector2(...p));mesh(bellows,new THREE.LatheGeometry(points,24,0,Math.PI*1.4),rubber);
      const section=piece(bellows,'air-spring-bellows-section','Bellows section');mesh(section,new THREE.LatheGeometry(points,14,Math.PI*1.4,Math.PI*.6),rubber);shell(section);
      const internal=piece(g,'air-spring-emergency-spring','Rubber emergency spring',[0,.085,0],{function:'Supports the assembly within the bellows in the selected generic arrangement.'});cylinder(internal,.12,.12,rubber,[0,0,0],null,16);
      const cap=piece(g,'air-spring-body-interface','Body support interface',[0,.2,0]);cylinder(cap,.26,.04,M.steel,[0,0,0],null,24);
      const inlet=piece(g,'air-spring-air-connection','Air-spring supply connection',[0,.025,-.26],{function:'A separate pneumatic connection supplies the bellows; levelling-control dynamics are not simulated.',interfaces:['Bellows air volume','Air-supply connection']});cylinder(inlet,.027,.1,M.copper,[0,0,0],[Math.PI/2,0,0],10);
      move(cap,[0,.38,0],'Separate the suspension levels',[.25,.55]);move(bellows,[0,.17,Math.sign(z)*.3],'Separate the suspension levels',[.25,.55]);secondary.push(g);
      const damper=piece(chassis,'secondary-damper-'+(z<0?'far':'near'),'Secondary damper',[.42,1.1,z],{function:'Dissipates relative-motion energy; it is a separate element from the spring.'});
      cylinder(damper,.042,.20,M.dark,[0,0,0],null,12);cylinder(damper,.018,.20,M.steel,[0,.13,0],null,10);for(const y of [-.12,.25])ring(damper,.026,.042,.04,M.core,[0,y,0]);
    }
    return {primary,secondary};
  }
  function primaryDetail(g,{length=1.75,detailed=false}={}) {
    mark(g,'LIM primary',{sources:['P02','P03'],function:'An energized short primary interacts with the track-mounted passive secondary across an air gap.'});
    const mounting=piece(g,'primary-mounting-frame','Mounting frame',undefined,{sources:['P02'],function:'Transfers the primary reaction into the bogie; it does not contact the reaction rail.'});
    box(mounting,[length+.14,.09,.75],M.steel,[0,.2,0]);
    for(const z of [-.34,.34])box(mounting,[length+.22,.07,.045],M.core,[0,.24,z]);
    for(const x of [-length/2+.13,length/2-.13]){box(mounting,[.14,.23,.12],M.steel,[x,.36,0]);cylinder(mounting,.06,.2,M.steel,[x,.48,0],[Math.PI/2,0,0]);}
    const core=piece(g,'primary-laminated-core','Laminated core',undefined,{sources:['P02','P03'],function:'The back iron and teeth guide the primary magnetic field; slots provide space for insulated conductors.'});
    for(let z=-.26;z<=.27;z+=detailed?.026:.052)box(core,[length,.13,.018],M.core,[0,.09,z]);
    const slotCount=8,pitch=(length-.18)/slotCount;
    for(let i=0;i<=slotCount;i++)box(core,[pitch*.50,.12,.57],M.core,[-length/2+.09+i*pitch,-.035,0]);
    const lining=piece(core,'primary-slot-insulation','Slot insulation',undefined,{sources:['P02','P03'],function:'Insulation separates the conductors from the iron slot faces; thickness is exaggerated for legibility.'});
    for(let i=0;i<slotCount;i++){const x=-length/2+.09+(i+.5)*pitch;for(const dx of [-pitch*.23,pitch*.23])box(lining,[.012,.09,.57],insulation,[x+dx,-.023,0]);}
    const winding=piece(g,'primary-winding-groups','Winding groups',undefined,{sources:['P02','P03'],function:'Abbreviated coil paths occupy separate slots and end turns. Their sequence is an explanatory three-phase grouping, not a manufacturing winding schedule.'});
    const phases=[];
    for(let p=0;p<3;p++)phases.push(piece(winding,'primary-phase-'+p,'Winding phase '+String.fromCharCode(65+p),undefined,{sources:['P02','P03'],function:'One illustrative phase group; the real coil pitch, turns and connections are design-specific.'}));
    for(let i=0;i<6;i++){
      const x=-length/2+.09+(i+.5)*pitch,x2=x+pitch*2,y=-.025+(i%2)*.026;
      tube(phases[i%3],[[x,y,-.32],[x,y,.32],[x+pitch*.25,y,.37],[x2-pitch*.25,y,.37],[x2,y,.32],[x2,y,-.32],[x2-pitch*.25,y,-.37],[x+pitch*.25,y,-.37],[x,y,-.32]],.018,phaseMaterials[i%3],{segments:detailed?40:24});
    }
    const terminals=piece(mounting,'primary-input-terminals','Three-phase input terminals',[length/2+.04,.3,0],{sources:['P02','P03'],function:'Three separate electrical input interfaces feed the winding groups; no neutral or supply-rail connection is inferred.'});
    box(terminals,[.18,.12,.42],M.dark);
    for(let i=0;i<3;i++){const z=(i-1)*.12;const p=piece(terminals,'primary-terminal-'+i,'Input phase '+String.fromCharCode(65+i),[.1,.01,z],{sources:['P02','P03'],interfaces:['Inverter output','Winding phase '+String.fromCharCode(65+i)]});cylinder(p,.028,.07,M.copper,[0,0,0],[0,0,Math.PI/2],8);tube(winding,[[length/2+.12,.3,z],[length/2+.19,.08,z],[length/2-.12,-.025,z]],.014,phaseMaterials[i],{segments:8});}
    move(mounting,[0,.7,0],'Locate the mounting frame',[0,.3]);move(core,[0,.2,0],'Inspect the laminated core',[.3,.65]);move(winding,[0,.2,.8],'Reveal the winding groups',[.65,1]);
    g.userData.functionalPaths=[{id:'lim-coupling',label:'Input, magnetic circuit and thrust',description:'Electrical input → winding → primary magnetic circuit → air gap → passive reaction rail. The line is a relationship, not a physical wire or solved field.',steps:[{label:'Input terminals',nodeName:'primary-input-terminals'},{label:'Winding groups',nodeName:'primary-winding-groups'},{label:'Laminated core',nodeName:'primary-laminated-core'},{label:'Air gap',conceptId:'motor-slip',description:'Non-contact magnetic coupling; no mechanical link spans the gap.'},{label:'Reaction rail',conceptId:'reaction-rail'}],sources:['P02','P03']}];
    return {mounting,core,winding,terminals};
  }
  function rotaryMotor(motor,{detailed=true}={}) {
    mark(motor,'Traction motor',{sources:['MD02','MD04'],function:'A stationary stator surrounds a rotating rotor; torque exits through a coaxial shaft.'});
    motor.userData.inspectionDirection=[.35,.25,-1];
    if(!detailed){
      const housing=piece(motor,'motor-sectioned-housing','Motor housing',undefined,{sources:['MD04']});ring(housing,.218,.248,.63,M.teal);shell(housing);
      const stator=piece(motor,'motor-stator-core','Stator envelope',undefined,{sources:['MD04'],function:'Context model; the detailed bogie view separates conductors, rotor and end supports.'});ring(stator,.166,.215,.5,M.core);
      const rotor=piece(motor,'motor-rotor','Rotor envelope',undefined,{sources:['MD04']});cylinder(rotor,.145,.48,M.core,[0,0,0],[Math.PI/2,0,0],16);
      const shaft=piece(rotor,'motor-internal-shaft','Rotor shaft',undefined,{sources:['MD04']});cylinder(shaft,.055,.84,M.steel,[0,0,.05],[Math.PI/2,0,0],12);
      const terminal=piece(motor,'motor-terminal-box','Motor terminal box',[0,.275,.1],{sources:['MD04']});box(terminal,[.25,.12,.22],M.dark);
      return {rotor,stator,winding:null,housing,shaft};
    }
    const housing=piece(motor,'motor-sectioned-housing','Motor housing',undefined,{sources:['MD04'],function:'Carries the stator and end bearings into the mounting interface.'});
    const sectionArc=Math.PI*4/3,axis=new THREE.Vector3(0,0,1);
    const turn=(node,angle)=>{node.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(axis,angle));return node;};
    ring(housing,.218,.248,.63,M.teal,undefined,sectionArc);
    const cover=piece(motor,'motor-removable-housing-sector','Motor housing section',undefined,{sources:['MD04']});turn(ring(cover,.218,.248,.63,M.teal,undefined,Math.PI*2-sectionArc),sectionArc);shell(cover);move(cover,[.2,.32,0],'Expose the motor interior',[0,.3]);
    const stator=piece(motor,'motor-stator-core','Stator laminated core',undefined,{sources:['MD04'],function:'The stationary back iron and teeth define slots for the conductor groups and surround the rotor with an air gap.'});ring(stator,.202,.215,.5,M.core,undefined,sectionArc);
    const statorSector=piece(motor,'motor-stator-section','Stator section',undefined,{sources:['MD04']});turn(ring(statorSector,.202,.215,.5,M.core,undefined,Math.PI*2-sectionArc),sectionArc);shell(statorSector);move(statorSector,[.3,.18,0],'Expose the motor interior',[0,.3]);
    const pitch=Math.PI/6,slotAngle=.18;
    for(let i=0;i<12;i++)turn(ring(i<8?stator:statorSector,.166,.202,.5,M.core,undefined,pitch-slotAngle),i*pitch+slotAngle/2);
    const winding=piece(motor,'motor-stator-windings','Stator conductors and end turns',undefined,{sources:['MD04'],function:'Six abbreviated conductor loops occupy twelve open stator slots. End turns join the axial sides outside the iron stack; pole count and electrical winding connections are not specified.'});
    // Straight slot conductors and controlled end turns avoid an interpolating
    // spline bending through the rotor. The turns also clear both end shields.
    const point=(angle,z)=>new THREE.Vector3(Math.cos(angle)*.185,Math.sin(angle)*.185,z);
    for(let i=0;i<6;i++){
      const a=-Math.PI/2+i*2*pitch,b=a+pitch,path=new THREE.CurvePath();
      path.add(new THREE.LineCurve3(point(a,-.245),point(a,.245)));
      path.add(new THREE.CubicBezierCurve3(point(a,.245),point(a,.3),point(b,.3),point(b,.245)));
      path.add(new THREE.LineCurve3(point(b,.245),point(b,-.245)));
      path.add(new THREE.CubicBezierCurve3(point(b,-.245),point(b,-.3),point(a,-.3),point(a,-.245)));
      mesh(winding,new THREE.TubeGeometry(path,40,.009,7,true),phaseMaterials[i%3]);
    }
    const rotor=piece(motor,'motor-rotor','Rotor and cage',undefined,{sources:['MD04'],function:'The rotor rotates within a visible radial clearance; a qualitative induction-cage example is shown.'});cylinder(rotor,.145,.48,M.core,[0,0,0],[Math.PI/2,0,0],24);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;cylinder(rotor,.009,.48,M.aluminum,[Math.cos(a)*.144,Math.sin(a)*.144,0],[Math.PI/2,0,0],8);}for(const z of [-.25,.25])ring(rotor,.129,.153,.025,M.aluminum,[0,0,z]);
    const shaft=piece(rotor,'motor-internal-shaft','Rotor shaft',undefined,{sources:['MD04'],interfaces:['Rotor hub','Drive-end bearing','Coupling']});cylinder(shaft,.055,.84,M.steel,[0,0,.05],[Math.PI/2,0,0],16);
    for(const z of [-.32,.32]){const end=piece(motor,'motor-end-bearing-'+(z<0?'rear':'drive'),'Motor end bearing',[0,0,z],{sources:['MD04'],function:'Supports the rotating shaft within the stationary end shield.'});ring(end,.058,.098,.055,M.steel);ring(end,.102,.122,.055,M.core);for(let i=0;i<8;i++){const a=i*Math.PI/4;mesh(end,new THREE.SphereGeometry(.012,8,6),M.aluminum,[Math.cos(a)*.1,Math.sin(a)*.1,0]);}const shield=piece(motor,'motor-end-shield-'+(z<0?'rear':'drive'),'Motor end shield',[0,0,z],{sources:['MD04']});ring(shield,.125,.25,.035,M.steel);move(shield,[0,0,Math.sign(z)*.25],'Separate shaft supports',[.3,.65]);}
    const terminal=piece(motor,'motor-terminal-box','Motor terminal box',[0,.275,.1],{sources:['MD04'],function:'Stationary electrical input is separate from the rotating torque output.'});box(terminal,[.25,.12,.22],M.dark);for(let i=0;i<3;i++)cylinder(terminal,.021,.06,M.copper,[(i-1)*.065,.075,0],null,8);
    move(rotor,[0,0,-.65],'Inspect rotor and stator',[.65,1]);
    return {rotor,stator,winding,housing,shaft};
  }
  function gearboxSupports(gear) {
    mark(gear,'Gearbox',{sources:['MD02','MD03','MD04'],function:'A 12-tooth pinion drives a 24-tooth axle gear. Support bearings keep the shafts on their authored axes.'});
    gear.userData.inspectionDirection=[.15,.25,1];
    for(const [name,x,y,r]of [['axle',0,0,.075],['pinion',.30,.1375,.055]]){
      const support=piece(gear,'gearbox-'+name+'-bearing',name==='axle'?'Axle-gear bearing support':'Pinion bearing support',[x,y,-.105],{sources:['MD04'],interfaces:['Rotating '+name+' shaft','Gearbox rear housing']});ring(support,r+.003,r+.027,.045,M.steel);ring(support,r+.034,r+.06,.045,M.core);
      cylinder(support,r,.24,M.steel,[0,0,0],[Math.PI/2,0,0],16);
    }
    const mount=piece(gear,'gearbox-torque-reaction-mount','Gearbox reaction mount',[.39,.39,-.05],{sources:['MD02'],function:'Reaction from the stationary casing is carried toward the bogie support. This schematic mount does not prescribe a suspension arrangement.'});box(mount,[.16,.15,.2],M.teal);ring(mount,.028,.055,.22,rubber);
    return gear;
  }
  return {mark,piece,move,ring,bearing,axlebox,suspension,primaryDetail,rotaryMotor,gearboxSupports};
}
