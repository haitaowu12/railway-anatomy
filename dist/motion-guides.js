import {turnoutGuide} from './turnout-journey.js';
// Enable playback only where motion explains an authored mechanism. These
// captions describe the illustration, not a real railway operating sequence.
export function applyMotionGuides(views){
  const mechanism=(label,steps,{loop=false,duration=14}={})=>({label,duration,loop,steps:steps.map(([at,label,description])=>({at,label,description}))});
  const rolling=mechanism('Wheelset, bearing and drive relationships',[
    [0,'Retained frame','The bogie frame stays in place while the wheelset turns. Select an axlebox to inspect its bearing rings, rollers and cage.'],
    [.25,'Inner ring and rollers','The axle-side inner ring turns with the wheel. The outer ring and housing remain stationary; the rollers spin while their cage orbits more slowly.'],
    [.5,'Separate torque and support','With rotary propulsion selected, the 12-tooth pinion turns twice for each turn of the 24-tooth axle gear. With LIM selected, thrust acts through the reaction rail while the wheels roll.'],
    [.75,'Follow the rolling set','The cylindrical rollers both spin and travel around the bearing with the cage. This example assumes rolling contact without slip.'],
    [1,'One wheel revolution','The wheel completes one revolution while the slower cage completes only part of a turn.'],
  ]);
  const door=mechanism('Installed door: unlock, drive, close and observe',[
    [0,'Closed and locked','Inspect the door leaves, fixed guide, belt drive and local controller. In this arrangement, opposite sides of one belt move the two leaves.'],
    [.16,'Unlock first','The illustrative lock withdraws before leaf travel. A returned lock indication is distinct from a command.'],
    [.40,'Open leaves','Opposite belt runs move the two supported leaves in opposite directions. The vehicle and wheelsets stay still.'],
    [.55,'Return movement','The pulleys reverse as the leaves return. The position targets move with the leaves; contacts remain fixed.'],
    [.80,'Closed is not yet locked','The targets have returned to the closed position. The lock has not yet reached its illustrated engaged end.'],
    [.96,'Separate returned evidence','The lock engages, and the closed-and-locked feedback changes. This feedback is one input to the train’s departure controls.'],
    [1,'Inspect the endpoint','Use the physical paths to compare the motor-to-leaf transmission with the request, position and lock interfaces.'],
  ]);
  const air=mechanism('Installed air-treatment module: fan and stationary sections',[
    [0,'Locate the air path','Open one roof module. The inlet, filter, heat-exchanger coil, fan and condensate route are separate.'],
    [.25,'Half revolution','The impeller turns on its shaft while the motor casing, filter and coil remain stationary.'],
    [.50,'One revolution','Arrows follow the air through the filter and coil to the fan and outlet.'],
    [.75,'Separate fluid routes','Coil supply and return are separate from the air path and the condensate drain.'],
    [1,'Two revolutions','The rotor completes a second turn while the filter, coil and enclosure remain fixed.'],
  ],{loop:true,duration:12});
  const compressor=mechanism('Piston-compressor section: crank and constant-length rod',[
    [0,'Selected piston example','Open the crankcase and cylinder section to follow one piston. Railway air-supply units also use multi-cylinder and screw compressors.'],
    [.125,'Piston travel','The crankpin moves around the shaft. A constant-length connecting rod drives the piston along its bore.'],
    [.25,'Opposite dead centre','The piston reaches the other end of its geometric stroke. The casing, cylinder and head remain fixed.'],
    [.5,'One crank revolution','The piston completes an intake and compression cycle and returns to its starting position.'],
    [.75,'Treatment and storage','Follow the compressed-air path from the cylinder to the separate dryer and storage receiver.'],
    [1,'Two crank revolutions','The crank and piston return to their original positions. Use the mechanical and air-supply traces to compare different interfaces.'],
  ],{loop:true,duration:16});
  const brake=mechanism('Stationary brake: apply, hold and release',[
    [0,'Released pads','The wheel and disc stay still. Each pad has a visible running clearance to its own friction face.'],
    [.25,'Contact reached','The pneumatic actuator and linkage approach both pad carriers to the disc. The pads stop at contact.'],
    [.5,'Hold geometry','The pads remain in contact with the disc. Brake force depends on actuator force and the friction surfaces.'],
    [.8,'Release movement','The pads move away from the friction faces while the caliper carrier remains fixed to the frame.'],
    [1,'Clearance restored','The pads have moved clear of the disc. Compare the disc’s connection to the axle with the caliper’s connection to the frame.'],
  ]);
  const parking={...brake,label:'Parking function: pad contact and clearance',steps:brake.steps.map((s,i)=>i===1?{...s,description:'The carriers bring the pads to disc contact. The input that applies or releases the parking function depends on the brake architecture.'}:s)};
  const componentAnimations={doors:door,'door-control':door,hvac:air,compressor,brakes:brake,'parking-brake':parking,'brake-control':brake,bogie:rolling,tachometer:rolling,'rotary-traction-motor':rolling,'traction-gearbox':rolling};
  for(const id of ['vehicle','services','bogie'])views[id].componentAnimations={...componentAnimations};
  views.bogie.motion=true;views.bogie.animation=rolling;
  views.services.motion=true;views.services.animation=door;
  views.lim.motion=true;
  views.lim.animation={label:'Travelling field and the passive reaction rail',duration:12,loop:true,steps:[
    {at:0,label:'Primary & secondary',description:'The windings belong to the train-mounted primary. The reaction rail is the passive secondary across the air gap.'},
    {at:.3,label:'Travelling field',description:'The arches mark the travelling magnetic field produced by the primary windings.'},
    {at:.65,label:'Induced response',description:'The changing field induces currents in the conducting reaction rail. It needs no direct traction-power connection.'},
    {at:1,label:'Force interface',description:'Compare the field direction and thrust cue. Keep the air-gap force interface separate from wheel support and current collection.'},
  ]};
  const wash=views['depot-wash'];
  for(const variant of wash.variants){
    if(!['wash','mobile'].includes(variant.id)){variant.motion=false;continue;}
    const mobile=variant.id==='mobile';variant.motion=true;
    variant.animation={label:mobile?'Moving gantry around a stationary vehicle':'Vehicle moving through fixed brushes',duration:14,loop:true,steps:[
      {at:0,label:'Starting position',description:mobile?'The vehicle stays in place; the brush gantry begins at one end.':'The brush portal stays in place; the vehicle begins its illustrative movement.'},
      {at:.25,label:'Relative movement',description:'The brushes rotate while the selected moving assembly travels. Water collection and treatment are separate equipment.'},
      {at:.5,label:'Other end',description:mobile?'The gantry reaches the other end of the illustrated sweep; the train has not moved.':'The train reaches the other end of the illustrated travel; the portal has not moved.'},
      {at:.75,label:'Return sweep',description:'The moving assembly returns while the brushes continue to rotate.'},
      {at:1,label:'Cycle complete',description:'The illustration returns to its starting geometry. Inspect the brushes, drain, pumps and tanks separately.'},
    ]};
  }
  const enable=(view,id,label,steps,duration=12)=>{
    const option=views[view]?.variants?.find(v=>v.id===id);
    if(option){option.motion=true;option.animation={label,duration,loop:false,steps};}
  };
  const step=(at,label,description)=>({at,label,description});
  for(const id of ['straight','diverging','crossover']){
    const cross=id==='crossover',branch=id==='diverging';
    enable('turnout',id,cross?'A wheelset across two linked turnouts':'A wheelset along the selected route',[
      step(0,'Approach',cross?'The wheelset begins on the first track. Both turnout settings are fixed for this illustration.':'The wheelset approaches a fixed selected blade arrangement.'),
      step(.2,'Switch region','The rotating wheels follow the selected rail pair; the points do not move beneath them.'),
      step(.5,cross?'Connecting track':'Continue along the route',cross?'The wheelset passes into the connecting track between the two turnouts.':branch?'The wheelset turns along the branch centreline.':'The wheelset remains on the straight centreline.'),
      step(.85,cross?'Second turnout':'Beyond the crossing',cross?'The second fixed turnout leads onto the other track.':'The wheelset continues beyond the crossing region along the selected alignment.'),
      step(1,'Passage complete','The wheelset has followed the selected rail pair. The point setting stays fixed throughout its passage.')
    ],14);
  }
  for(const route of ['straight','diverging'])views.turnout.variants.find(v=>v.id===route).animation=turnoutGuide(route);
  for(const id of ['proved','unproved','detector-missing']){
    const incomplete=id==='unproved',missing=id==='detector-missing';
    enable('switch-drive',id,'Move, lock and detect both blades',[
      step(0,'Start at end A',missing?'The near blade is open and the far blade closed, with both locks engaged. The far detector input is unavailable, so neither end is indicated.':'The near (machine-side) blade is open and the far blade closed. Both locks are engaged and A is indicated.'),
      step(.15,'Release the locks','The locks withdraw before blade movement. Neither end is indicated while the locks are released.'),
      step(.45,'Move both blades','Two operating rods move the blades. Two separate detector rods follow them: one short connection to the near blade and one long connection to the far blade.'),
      step(.72,incomplete?'Stop short':'Reach end B',incomplete?'The blades stop between the ends. Both locks remain released and neither end is indicated.':'The near blade has closed against its stock rail; the far blade is open. The locks are still released.'),
      step(.9,incomplete?'Locks stay released':missing?'Locked, input missing':'Lock and detect B',incomplete?'The incomplete throw cannot establish either locked end.':missing?'Both locks engage at B, but the far-blade detector input is unavailable. B is not indicated.':'Both locks engage. With the closed blade, open blade and lock conditions satisfied, B is indicated.'),
      step(1,'Follow the indication',incomplete||missing?'Neither end is indicated. Follow the missing B input to the interlocking.':'B is indicated. Follow this input to the interlocking, alongside the other route conditions.')
    ],12);
  }
  enable('crossing','frog','Wheel support and flange guidance at a crossing',[
    step(0,'Approach','The wheelset starts before the crossing region and rolls along the selected through alignment.'),
    step(.35,'Entering the crossing','Inspect the running surface, intersecting flangeway and the wheel on the opposite rail.'),
    step(.5,'Crossing region','The tread and wheel-back cues identify different contact relationships around the fixed crossing and check rail.'),
    step(.75,'Leaving the crossing','The wheelset continues on the same selected rail pair.'),
    step(1,'Passage complete','The wheelset has passed the fixed crossing. Compare tread support at the crossing with flange guidance at the opposite check rail.')
  ],12);
  enable('train-detection','track-circuit','Wheelset shunt and track-circuit indication',[
    step(0,'Section clear','Both illustrated axles are outside the section. The relay is shown energized in this simplified unfailed circuit.'),
    step(.18,'First axle enters','A conductive wheelset bridges the rails within the section. The receiver and section indication change.'),
    step(.32,'Both axles inside','The section remains occupied while either illustrated axle provides the shunt.'),
    step(.72,'First axle leaves','The rear axle remains inside, so the occupied indication is retained.'),
    step(.86,'Last axle clears','Both axles are beyond the section. The circuit returns to its clear indication in this fault-free example.'),
    step(1,'Observe the distinction','The receiver responds to the electrical circuit. Rail contamination, circuit faults and wheel–rail contact can affect the indication.')
  ],14);
  enable('train-detection','axle-counter','Entry, exit and remaining axle counts',[
    step(0,'Zero entries and exits','The assumed valid example begins with no axle in the section. Amber marks are entries, cyan marks exits and pale marks the difference.'),
    step(.18,'First entry','The leading axle passes the entry head. The cumulative entry count increases to one.'),
    step(.32,'Two entries','Both axles have entered and neither has exited. The remaining count is two.'),
    step(.72,'First exit','One axle has passed the exit head. Entries remain two, exits become one and one axle remains.'),
    step(.86,'Counts balanced','Two entries and two exits leave a zero difference in this unfailed example. The cumulative counts remain visible.'),
    step(1,'Passage complete','A zero difference supports a clear indication only while the counting system remains valid. Faults and recovery require separate checks.')
  ],14);
  enable('train-detection','balise','A passing reference followed by odometry',[
    step(0,'Before the reference','The onboard reader approaches the track-mounted transponder. A balise is not a continuously broadcasting track-occupancy detector.'),
    step(.45,'Approach the coupling region','The reader nears the localized exchange region above the balise.'),
    step(.5,'Reference received','The passing point supplies a reference. The displayed reference marker is retained after the train moves away.'),
    step(.75,'Beyond the reference','The distance-estimate line grows from the retained reference as the wheelset travels onward.'),
    step(1,'Reference retained','The balise supplies a location reference at one point. Onboard motion measurements estimate travel between references.')
  ],14);
  enable('depot-maintenance','lifting','Lower one bogie, then transfer the carrier',[
    step(0,'Aligned below the body','One separated bogie is below its original position. The carbody rests on fixed supports and the other bogie remains attached.'),
    step(.2,'Deck lowered','The lift deck lowers while the base carrier remains on its transverse guides.'),
    step(.5,'Transverse transfer','Only after lowering, the carrier travels sideways through the open cutaway channel.'),
    step(.8,'Bogie clear of the vehicle','The carrier reaches the end of the illustrated outward transfer. The body has not moved.'),
    step(1,'Inspect the load paths','The carrier holds the bogie clear of the vehicle. Compare its load path with the supports holding the carbody.')
  ],14);
  enable('depot-maintenance','jacks','Synchronized saddles raise the body',[
    step(0,'Saddles in contact','Four illustrated saddles meet compatible points under the body. Both bogies remain on the rail.'),
    step(.25,'Shared upward movement','The body and all four saddles rise together; their contact is retained.'),
    step(.5,'Body above the bogies','The growing separation exposes the distinction between lifting the body and lowering a bogie.'),
    step(.85,'Continue the same lift','Every saddle follows the same illustrated displacement. Columns and bogies stay fixed.'),
    step(1,'Raised endpoint','The saddles support the raised body while the bogies remain on the rail. Their coordinated movement keeps the illustrated body level.')
  ],12);
  const latheSteps=[
    step(0,'Supported wheelset','The selected installed axle is aligned over the machine; the adjacent axle remains supported by rail.'),
    step(.15,'Tool approach','The tool carriers approach the wheel-profile region while the vehicle stays in place.'),
    step(.45,'Rotation and feed','Only the selected axle and contacting drive rollers rotate. The tool carriers make an illustrative axial feed.'),
    step(.85,'End of illustrated pass','The illustrated cutting pass ends. The wheel profile would then be measured against the required limits.'),
    step(1,'Tools withdrawn','The tool carriers withdraw while the wheelset remains supported by the machine.')
  ];
  enable('depot-maintenance','wheel-lathe','Installed wheelset and underfloor lathe',latheSteps,14);
  enable('depot-workshop','lathe','Installed wheelset and underfloor lathe',latheSteps,14);
  for(const id of ['fan','air-handler']){
    const axial=id==='fan';
    enable('ventilation-unit',id,axial?'Axial fan rotor and fixed air path':'Air-handler blower and treatment sections',[
      step(0,axial?'Rotor and housing':'Blower and air path',axial?'Inspect the rotor inside its fixed housing. The arrows identify the illustrated air path.':'Inspect the blower, filter and coil as different parts of the same air-handling unit.'),
      step(.25,'Half turn','The rotor turns while its supporting frame and enclosure stay fixed.'),
      step(.5,'One revolution',axial?'A complete turn relates the rotating blade assembly to the fixed axial air path.':'The blower has completed one turn; filters and coils remain stationary treatment sections along the air path.'),
      step(.75,'Continuing rotation','The rotor continues turning. Delivered airflow depends on the fan and the resistance of the connected air path.'),
      step(1,'Two revolutions','The rotor completes two turns and the animation repeats.')
    ],12);
    views['ventilation-unit'].variants.find(v=>v.id===id).animation.loop=true;
  }
  enable('ventilation-unit','damper','Actuator, common linkage and open-position indication',[
    step(0,'Closed blades','The parallel blades begin closed. No open-path arrows or open-position indication are shown.'),
    step(.25,'Linked movement','The actuator reduction gears and output crank move the common link, turning the blades together.'),
    step(.5,'Part-way open','The mechanism is between end positions. The open-position indication remains absent.'),
    step(.9,'Full opening','The blades reach the open end, creating an air passage. Airflow also requires a pressure difference.'),
    step(.98,'Open indication','The separate open-position contact changes after the mechanism reaches its open end.'),
    step(1,'Inspect the endpoint','Compare the actuator motion, blade position and separate position contact.')
  ],12);
  const pump=mechanism('Pump working section: shaft, impeller and fixed casing',[
    [0,'Open the hydraulic cover','The impeller, shaft sealing region, coupling and casing have separate physical roles.'],
    [.25,'Half revolution','The shaft, coupling and impeller rotate together. The motor housing, seal support and collecting casing remain fixed.'],
    [.50,'One revolution','Follow water from the axial inlet into the impeller eye, then outward through the vanes to the collecting casing.'],
    [.75,'Separate the control question','Pump starting and sprinkler operation have separate controls. A typical closed sprinkler opens locally when heat activates its thermal element.'],
    [1,'Two revolutions','The rotor returns to its starting orientation. Actual duties, start logic and supervision belong to the selected pump system.'],
  ],{loop:true,duration:12});
  for(const view of ['station-plant','fire-systems']){
    const option=views[view].variants.find(v=>v.id==='water');option.motion=true;option.animation=pump;
  }
  const plantAir=views['station-plant'].variants.find(v=>v.id==='air');plantAir.motion=true;plantAir.animation={...air,label:'Plant air-handler: fan and stationary sections',steps:air.steps.map((step,index)=>index?step:{...step,description:'Open the air-handler enclosure. The inlet, filter, heat-exchanger coil, fan and condensate route are separate.'})};
}
