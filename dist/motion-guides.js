// Enable playback only where motion explains an authored mechanism. These
// captions describe the illustration, not a real railway operating sequence.
export function applyMotionGuides(views){
  views.lim.motion=true;
  views.lim.animation={label:'Travelling field and the passive reaction rail',duration:12,loop:true,steps:[
    {at:0,label:'Primary & secondary',description:'The windings belong to the train-mounted primary. The reaction rail is the passive secondary across the air gap.'},
    {at:.3,label:'Travelling field',description:'The field arches progress along the primary. They are an explanatory pattern, not a solved electromagnetic field.'},
    {at:.65,label:'Induced response',description:'The current-loop cues sit in the passive reaction rail. No traction-power connection is attached to that rail.'},
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
      {at:.75,label:'Return sweep',description:'The animation returns to show the relative motion again. It does not prescribe a washing procedure, speed or clearance.'},
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
      step(1,'Passage complete','This illustrates wheel guidance and geometry. It does not grant a route, set a permitted speed or simulate an interlocking.')
    ],14);
  }
  for(const id of ['proved','unproved']){
    const incomplete=id==='unproved';
    enable('switch-drive',id,incomplete?'A throw without the target end indication':'Drive, lock and separate position indication',[
      step(0,'Initial end','The drive begins at one end. The phase control illustrates a mechanism, not a point-operating instruction.'),
      step(.15,'Lock withdrawn','The illustrative lock withdraws before the output linkage moves.'),
      step(.45,'Linked movement','The gear, output rod, stretcher and switch blades move together; the position-reference link follows the blades.'),
      step(.72,incomplete?'Incomplete travel':'Target end reached',incomplete?'The illustrated throw stops part-way. No fault cause or bypass is inferred.':'The blades reach the target end before the target indication is shown.'),
      step(.9,incomplete?'No target proof':'Lock and indication',incomplete?'The lock remains withdrawn and the target-end indication remains absent.':'The lock is engaged and the separate target-end indication appears. A command alone did not create that evidence.'),
      step(1,'Compare the result',incomplete?'Inspect the remaining blade gap and absent target proof. The mechanism does not hunt indefinitely.':'Inspect the final blade position, linkage and detector as distinct parts of the arrangement.')
    ],12);
  }
  for(const id of ['frog','diamond'])enable('crossing',id,'Wheel support and flange guidance at a crossing',[
    step(0,'Approach','The wheelset starts before the crossing region and rolls along the selected through alignment.'),
    step(.35,'Entering the crossing','Inspect the running surface, intersecting flangeway and the wheel on the opposite rail.'),
    step(.5,'Crossing region',id==='frog'?'The tread and wheel-back cues identify different contact relationships around the fixed crossing and check rail.':'The wheelset follows one through alignment across the fixed diamond. There is no moving switch in this example.'),
    step(.75,'Leaving the crossing','The wheelset continues on the same selected rail pair.'),
    step(1,'Passage complete','The animation illustrates geometry and guidance, without calculating impact force, wear, permissible speed or flange-clearance limits.')
  ],12);
  enable('train-detection','track-circuit','Wheelset shunt and track-circuit indication',[
    step(0,'Section clear','Both illustrated axles are outside the section. The relay is shown energized in this simplified unfailed circuit.'),
    step(.18,'First axle enters','A conductive wheelset bridges the rails within the section. The receiver and section indication change.'),
    step(.32,'Both axles inside','The section remains occupied while either illustrated axle provides the shunt.'),
    step(.72,'First axle leaves','The rear axle remains inside, so the occupied indication is retained.'),
    step(.86,'Last axle clears','Both axles are beyond the section. The unfailed teaching circuit returns to its clear condition.'),
    step(1,'Observe the distinction','The illustration is a detection example, not a test of shunt reliability or proof of a complete railway safety function.')
  ],14);
  enable('train-detection','axle-counter','Entry, exit and remaining axle counts',[
    step(0,'Zero entries and exits','The assumed valid example begins with no axle in the section. Amber marks are entries, cyan marks exits and pale marks the difference.'),
    step(.18,'First entry','The leading axle passes the entry head. The cumulative entry count increases to one.'),
    step(.32,'Two entries','Both axles have entered and neither has exited. The remaining count is two.'),
    step(.72,'First exit','One axle has passed the exit head. Entries remain two, exits become one and one axle remains.'),
    step(.86,'Counts balanced','Two entries and two exits leave a zero difference in this unfailed example. The cumulative counts remain visible.'),
    step(1,'Passage complete','This trace contains no reset, recovery procedure or assertion that an axle counter independently proves every train-integrity question.')
  ],14);
  enable('train-detection','balise','A passing reference followed by odometry',[
    step(0,'Before the reference','The onboard reader approaches the track-mounted transponder. A balise is not a continuously broadcasting track-occupancy detector.'),
    step(.45,'Approach the coupling region','The reader nears the localized exchange region above the balise.'),
    step(.5,'Reference received','The passing point supplies a reference. The displayed reference marker is retained after the train moves away.'),
    step(.75,'Beyond the reference','The distance-estimate line grows from the retained reference as the wheelset travels onward.'),
    step(1,'Reference retained','The example distinguishes a localized reference from the continuing position estimate; no accuracy or integrity calculation is represented.')
  ],14);
  enable('depot-maintenance','lifting','Lower one bogie, then transfer the carrier',[
    step(0,'Aligned below the body','One separated bogie is below its original position. The carbody rests on fixed supports and the other bogie remains attached.'),
    step(.2,'Deck lowered','The lift deck lowers while the base carrier remains on its transverse guides.'),
    step(.5,'Transverse transfer','Only after lowering, the carrier travels sideways through the open cutaway channel.'),
    step(.8,'Bogie clear of the vehicle','The carrier reaches the end of the illustrated outward transfer. The body has not moved.'),
    step(1,'Inspect the load paths','The endpoint is retained for inspection. This is a mechanism illustration, not a bogie-removal or support procedure.')
  ],14);
  enable('depot-maintenance','jacks','Synchronized saddles raise the body',[
    step(0,'Saddles in contact','Four illustrated saddles meet compatible points under the body. Both bogies remain on the rail.'),
    step(.25,'Shared upward movement','The body and all four saddles rise together; their contact is retained.'),
    step(.5,'Body above the bogies','The growing separation exposes the distinction between lifting the body and lowering a bogie.'),
    step(.85,'Continue the same lift','Every saddle follows the same illustrated displacement. Columns and bogies stay fixed.'),
    step(1,'Raised endpoint','The body remains supported at the endpoint. The animation does not prescribe preparation, capacity, control logic or a lifting procedure.')
  ],12);
  const latheSteps=[
    step(0,'Supported wheelset','The selected installed axle is aligned over the machine; the adjacent axle remains supported by rail.'),
    step(.15,'Tool approach','The tool carriers approach the wheel-profile region while the vehicle stays in place.'),
    step(.45,'Rotation and feed','Only the selected axle and contacting drive rollers rotate. The tool carriers make an illustrative axial feed.'),
    step(.85,'End of illustrated pass','The limited rotation ends. No material-removal depth, profile limit or acceptance result is calculated.'),
    step(1,'Tools withdrawn','The tool carriers withdraw and the wheelset remains supported. This is a mechanism study, not a machining instruction.')
  ];
  enable('depot-maintenance','wheel-lathe','Installed wheelset and underfloor lathe',latheSteps,14);
  enable('depot-workshop','lathe','Installed wheelset and underfloor lathe',latheSteps,14);
  for(const id of ['fan','air-handler']){
    const axial=id==='fan';
    enable('ventilation-unit',id,axial?'Axial fan rotor and fixed air path':'Air-handler blower and treatment sections',[
      step(0,axial?'Rotor and housing':'Blower and air path',axial?'Inspect the rotor inside its fixed housing. The arrows identify the illustrated air path.':'Inspect the blower, filter and coil as different parts of the same air-handling unit.'),
      step(.25,'Half turn','The rotor turns while its supporting frame and enclosure stay fixed. The drawing does not specify a real shaft speed.'),
      step(.5,'One revolution',axial?'A complete turn relates the rotating blade assembly to the fixed axial air path.':'The blower has completed one turn; filters and coils remain stationary treatment sections along the air path.'),
      step(.75,'Continuing rotation','The same mechanical relationship continues. No pressure, airflow rate or fan-duty calculation is represented.'),
      step(1,'Two revolutions','The rotor returns to its starting orientation, allowing a continuous visual loop. This is not a fan-start or emergency ventilation sequence.')
    ],12);
    views['ventilation-unit'].variants.find(v=>v.id===id).animation.loop=true;
  }
  enable('ventilation-unit','damper','Actuator, common linkage and open-position indication',[
    step(0,'Closed blades','The parallel blades begin closed. No open-path arrows or open-position indication are shown.'),
    step(.25,'Linked movement','The actuator reduction gears and output crank move the common link, turning the blades together.'),
    step(.5,'Part-way open','The mechanism is between end positions. The open-position indication remains absent.'),
    step(.9,'Full opening','The blades reach the illustrated open end and the potential air-path arrows become visible. This does not establish actual airflow.'),
    step(.98,'Open indication','The separate open-position contact changes after the mechanism reaches its open end.'),
    step(1,'Inspect the endpoint','Compare actuator motion, blade position and indication. No smoke-control mode or emergency operating procedure is simulated.')
  ],12);
}
