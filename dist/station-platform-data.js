import { normalizePlatformState } from './platform-config.js';

export const STATION_PLATFORM_SOURCES = [{
  id:'SP01',title:'Elevator and escalator glossary',publisher:'KONE',
  url:'https://www.kone.com.au/tools-downloads/glossary/',
  description:'Public definitions distinguish the car, landing, car and landing doors, traction equipment, and door-related interfaces.',
  scope:'Terminology and physical roles only. The atlas uses an invented two-landing mechanism; it adopts no product dimensions, code interpretation, door zone or operating instruction.',
}];

const concept=(id,label,summary,details,related)=>({id,label,summary,details,related,sources:['SP01'],domain:'station',primary:['station','passenger']});
export const STATION_PLATFORM_CONCEPTS = [
  concept('station-lift','Station passenger lift','The cabin connects two landings through a dedicated shaft.',[
    'The car travels within the shaft while separate landing doors remain at each floor. A clear opening in the concourse accommodates the moving assembly.',
    'The example starts at platform level. The phase control closes the doors, moves the cabin and then opens at the upper landing. Dimensions and timing are illustrative.'
  ],['station-lift-car','station-lift-landing-doors','station-lift-drive','station-egress']),
  concept('station-lift-car','Lift cabin and car doors','The cabin, its floor and its own doors move together.',[
    'The car is the moving passenger enclosure. Its doors travel with it; the landing doors belong to the building.',
    'Follow the cabin floor against the two landing sills. This example opens the car doors only when its floor is aligned with a landing. No levelling tolerance or access compliance is claimed.'
  ],['station-lift','station-lift-landing-doors']),
  concept('station-lift-landing-doors','Lift landing doors and contacts','A fixed door assembly bounds the shaft at each landing.',[
    'Landing doors are distinct from the doors on the car. Their position and locking interfaces belong to the lift system.',
    'In the model only the doors beside the aligned cabin open. Both landings stay closed during travel. The enlarged contact targets explain relative position, not a complete interlock circuit.'
  ],['station-lift','station-lift-car','access-controller']),
  concept('station-lift-drive','Lift traction machine and suspension','A selected traction arrangement moves the cabin and counterweight.',[
    'A traction sheave and suspension connect the drive with the moving masses. Other lift arrangements exist.',
    'The sheave turns with cabin travel and the counterweight moves in the opposite direction. Inspect the separate machine and sheave; the original geometry supplies no suspension, braking or load calculation.'
  ],['station-lift','station-lift-car','auxiliary-switchboard']),
];

export const STATION_PLATFORM_CONCEPT_UPDATES = [
  {id:'platform-screen-door',summary:'Half-height and full-height facades provide different physical boarding boundaries.',details:[
    'ST Engineering publishes half-height, semi-full-height and full-height forms. The atlas compares an open edge with two original barrier geometries; selecting a sensing or end-access lesson preserves that physical choice.',
    'The openings line up with the parked teaching vehicle. The full-height example has a header drive; the half-height example uses side-post drives. These invented mechanisms do not reproduce a supplier design or prescribe a ventilation arrangement.'
  ],sources:['N03','N09'],related:['platform-door-drive','platform-door-proof','platform-gap-detector','platform-intrusion','doors']},
  {id:'platform-door-drive',summary:'A drive converts a request into leaf movement; feedback comes from separate equipment.',details:[
    'Nippon Signal describes individual door controllers that act on commands and return status. Portalp distinguishes drive control from closed and locking information.',
    'The full-height teaching mechanism turns pulleys as the paired leaves travel. The half-height mechanism moves racks through side-post pinions, leaving the boarding opening clear. Open or separate the covers, transmission and controller to inspect their roles.'
  ],sources:['N04','N05'],caveat:'The chosen transmissions and phase timing are authored illustrations, not supplier geometry or an operating sequence.'},
  {id:'platform-door-proof',summary:'The closed contact, lock mechanism and returned indication describe different conditions.',details:[
    'A command, a closed leaf and locking information are separate interfaces in the Portalp example.',
    'Pause after closing: the leaf target has returned to its contact while the bolt remains withdrawn. The bolt then engages, followed by the separate locking indication. The demonstration never derives train departure permission.'
  ],sources:['N05'],caveat:'The contacts and lock are explanatory geometry, not a safety circuit, failure analysis or universal departure rule.'},
  {id:'platform-response',summary:'A local processor reports sensor evidence through a defined railway interface.',details:[
    'The Siemens example separates perception processing, railway interfaces and associated video. The selected LiDAR and paired-radar examples are alternatives; the scene does not imply both are always installed.',
    'The local processor sits in a rear service alcove. The phase sequence changes sensor evidence before the report marker. The object remains in place after reporting; acknowledging or viewing a report cannot remove it.'
  ],sources:['N01','N02'],caveat:'The model illustrates ordering with invented delays. It does not implement object classification, health logic, a railway protocol or a prescribed response.'},
  {id:'platform-alarm-video',label:'Associated platform camera and video',summary:'An associated camera supplies a separate view of the reported location.',details:[
    'Siemens describes an operator seeing live and historical video associated with an intrusion alarm location.',
    'The selectable hardware here is the platform camera, mounted at the rear of the passenger area. Its event marker identifies an associated video relationship; the operator workstation belongs in the control-centre study. The camera image is not used as proof of track clearance.'
  ],sources:['N02'],related:['platform-intrusion','platform-response','station-cctv','occ-cctv-assessment','cctv-recording']},
  {id:'platform-gap-detector',summary:'The monitored interspace lies between the train body and a fitted platform facade.',details:[
    'Wabtec describes residual risk in the space between a train and platform-door facade. Nippon Signal gives an example of an optional ranging sensor on the train side of the barrier.',
    'The model marks that volume separately from the trainway and fits the object within it. This lesson requires a barrier; an open edge has no train–facade interspace. A report does not make the object disappear.'
  ],sources:['N04','N06'],caveat:'This is neither closing-edge obstacle sensing nor a validated coverage envelope.'},
  {id:'platform-end-gate',summary:'End access is a separate boundary that can accompany any selected platform edge.',details:[
    'Portalp describes end doors with their own control units. Restricted end and tunnel zones are separate monitoring applications in the Molinari examples.',
    'The end-gate leaf turns around its hinge. The latch releases while the gate is still closed; opening then separates the contact target and the frame contact. The end-access report follows. Selecting this lesson preserves the open, half-height or full-height boarding edge.'
  ],sources:['N05','N07'],caveat:'The phase sequence explains hardware relationships. It supplies no access permission, emergency-release or track-entry procedure.'},
  {id:'station-egress',details:[
    'Passenger circulation connects platform, concourse, stairs, lift landings, information and assistance. The broader station environment also contains equipment rooms and service access.',
    'The model leaves clear boarding strips, lands its stairs at the concourse and cuts a shaft opening around the lift. These spatial relationships support explanation; they do not establish evacuation capacity, accessibility compliance or an approved route.'
  ],related:['station-lift','emergency-lighting','emergency-intercom','station-pis','flss']},
];

const animation=(label,rows)=>({label,steps:rows.map(([at,label,description])=>({at,label,description}))});
export const PLATFORM_ANIMATIONS = {
  sensing:animation('Object, evidence and reported location',[
    [0,'Defined zone','The sensor and marked track area are separate from the parked train. The object starts outside the marked zone.'],
    [.25,'Object in the zone','The object has entered the marked trainway area. Physical occupation is not yet a received report.'],
    [.40,'Sensor evidence','The selected sensing path is highlighted. LiDAR and paired radar are separate examples.'],
    [.66,'Local report','The processor report marker and its interface trace change after the sensor evidence.'],
    [.85,'Associated video','The camera event marker identifies an associated view for the operator. The physical object remains.'],
  ]),
  boarding:animation('Request, movement, closed contact and lock',[
    [0,'Closed and locked','The initial leaf position, contact and illustrated locking indication agree.'],
    [.19,'Lock released','The opening request is present and the bolt has withdrawn while the leaves are still together.'],
    [.34,'Leaves moving','The transmission and platform-side train leaves move together in this coordinated example.'],
    [.46,'Boarding opening','The openings align. Opposite-side train doors remain closed.'],
    [.78,'Closed contact','The leaves have returned and the closed contact is made. The lock is still withdrawn.'],
    [.94,'Bolt engaged','The bolt has reached its illustrated engagement. The returned locking marker has not yet updated.'],
    [.98,'Locking indication','The separate indication now reflects the engaged lock. No train movement permission is calculated.'],
  ]),
  openBoarding:animation('Platform-side train-door movement',[
    [0,'Parked at the open edge','The train is aligned with the platform. There is no platform-door facade or platform-door lock.'],
    [.34,'Train doors opening','Only the platform-facing leaves move; the opposite side remains closed.'],
    [.46,'Open boarding doorway','The train threshold and platform share the illustrated boarding datum.'],
    [.64,'Train doors closing','The leaves return to their closed position in this authored mechanism example.'],
    [.78,'Leaves together','The leaves are closed. Train door locking and departure logic are outside this contextual model.'],
  ]),
  interspace:animation('Interspace evidence and report',[
    [0,'Object between boundaries','The small object lies between the train body and fitted platform facade.'],
    [.40,'Sensing evidence','The interspace sensing path highlights the occupied volume. The boarding doors remain closed.'],
    [.66,'Interspace report','The separate report marker changes. The object remains in the same physical position.'],
    [1,'Information needs a response','This depiction supplies neither a clearance decision nor permission to depart.'],
  ]),
  end:animation('End-gate latch, hinge and position contact',[
    [0,'Gate closed','The leaf rests at the latch post; the frame contact and leaf target are adjacent.'],
    [.22,'Latch withdrawn','The latch has retracted while the leaf remains closed.'],
    [.48,'Leaf turns','The hinge moves the gate and separates its target from the frame contact.'],
    [.80,'Open state reported','The end-access marker changes after the physical opening. The boarding-edge arrangement is preserved.'],
  ]),
};
export const STATION_LIFT_ANIMATION=animation('Cabin movement between two landings',[
  [0,'At platform level','The cabin floor meets the lower landing; the cabin and lower landing doors are open.'],
  [.22,'Doors closed','The cabin and lower landing doors close before travel. The upper landing stays closed.'],
  [.48,'Between levels','The cabin moves through the concourse opening. Both landing doors and the cabin doors remain closed.'],
  [.70,'Upper landing reached','The cabin floor meets the upper sill; the doors have not opened yet.'],
  [.94,'Upper doors open','Only the doors beside the aligned cabin open. The lower landing remains closed.'],
]);
export function platformAnimationFor(state) {
  const {variant,platformEdge}=normalizePlatformState(state);
  if(variant==='platform-doors')return PLATFORM_ANIMATIONS[platformEdge==='open'?'openBoarding':'boarding'];
  return PLATFORM_ANIMATIONS[variant==='interspace'?'interspace':variant==='platform-end'?'end':'sensing'];
}
const variant=(id,label,title,description,nodes,sources,component,guide)=>({id,label,title,description,nodes,sources,component,motion:Boolean(guide),...(guide?{animation:guide}:{})});
export const STATION_PLATFORM_VIEW_DATA={
  'platform-interface':{
    label:'Platform & boarding edge',title:'Locate the boundary, then follow the mechanism',component:'platform-intrusion',level:'Interface',
    note:'The boarding height and door centres share one datum. Edge arrangement, trainway sensing example and lesson focus are separate choices. Phase timing and monitored volumes are illustrative.',
    variants:[
      variant('open-platform','Trainway sensing','Follow an object into a reported location','Choose one sensing example. Its evidence, the local processor report and associated camera relationship appear in sequence; the object remains present. The selected physical edge stays in place.',['Defined zone','Sensor evidence','Local report','Associated video'],['N01','N02'],'platform-intrusion',PLATFORM_ANIMATIONS.sensing),
      variant('platform-doors','Boarding mechanism','Separate movement from the reported condition','At an open edge, inspect the platform-side train doors. With a barrier, inspect the transmission, separate closed contact, lock bolt and returned indication alongside the matching train doorway.',['Request','Drive and leaves','Closed contact','Lock and indication'],['N03','N04','N05','N09'],'doors',PLATFORM_ANIMATIONS.boarding),
      variant('interspace','Interspace sensing','Inspect the space between train and facade','A fitted barrier creates this distinct monitored volume. The small object, sensing evidence and report remain separate; this is not a closing-edge detector or a clearance decision.',['Train side','Interspace','Facade','Report'],['N04','N06'],'platform-gap-detector',PLATFORM_ANIMATIONS.interspace),
      variant('platform-end','End access','Follow the hinge and contact at a different boundary','The latch withdraws, the gate turns about its hinge, the contact target separates and the report follows. End access preserves the selected boarding-edge arrangement.',['Latch','Hinge and leaf','Position contact','Report'],['N05','N07'],'platform-end-gate',PLATFORM_ANIMATIONS.end),
    ],
  },
  station:{
    label:'Station overview',title:'Passenger levels and supporting equipment',component:'station-egress',level:'Installation',
    note:'An original station section with clear boarding strips, a two-landing lift, supported equipment room and mounted passenger devices. The layout is explanatory, not a building or evacuation design.',
    variants:[
      variant('all','Whole station','Read the station as connected places','The island platform, vertical circulation, concourse and service room provide context for passenger devices and their supporting systems. The edge choice applies on both sides of the platform.',['Boarding edge','Passenger circulation','Equipment room','Supporting systems'],['F01','F03','F04'],'station-egress'),
      variant('passenger','Passenger circulation','Follow the lift between platform and concourse','The cabin, car doors and landing doors occupy different moving and fixed assemblies. Play the sequence to follow a complete one-way trip while the stairs, displays and help points remain spatial context.',['Platform landing','Closed doors','Cabin travel','Upper landing'],['SP01','F01','F04'],'station-lift',STATION_LIFT_ANIMATION),
      variant('equipment','Equipment room','Locate the hardware behind the public devices','The room is supported by the concourse and has a real access opening. Network, fire and building-control equipment are separately inspectable; their shared location does not merge their responsibilities.',['Local equipment','Service access','Physical connections','Passenger endpoints'],['F03','F17','F20'],'telecom-rack'),
    ],
  },
};

export function applyStationPlatformCatalog(SOURCES,CONCEPTS){
  for(const item of STATION_PLATFORM_SOURCES){const old=SOURCES.find(x=>x.id===item.id);if(old)Object.assign(old,item);else SOURCES.push(item);}
  for(const item of STATION_PLATFORM_CONCEPTS){const old=CONCEPTS.find(x=>x.id===item.id);if(old)Object.assign(old,item);else CONCEPTS.push(item);}
  for(const item of STATION_PLATFORM_CONCEPT_UPDATES){const old=CONCEPTS.find(x=>x.id===item.id);if(old)Object.assign(old,item);}
}
export function applyStationPlatformConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS}){
  Object.assign(NEW_VIEWS,STATION_PLATFORM_VIEW_DATA);
  const station=SYSTEMS.find(x=>x.id==='station');
  if(station)station.parts=[...new Set([...station.parts,...STATION_PLATFORM_CONCEPTS.map(x=>x.id)])];
  for(const item of STATION_PLATFORM_CONCEPTS){PART_VIEWS[item.id]='station';PART_VARIANTS[item.id]='passenger';}
  const contexts={
    ...Object.fromEntries(STATION_PLATFORM_CONCEPTS.map(x=>[x.id,{station:['all','passenger','equipment']}])),
    'platform-screen-door':{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    'platform-door-drive':{'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    'platform-door-proof':{'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    'platform-intrusion':{'platform-interface':['open-platform','platform-end']},
    carbody:{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    bogie:{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    doors:{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    'running-rail':{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
  };
  for(const[id,views]of Object.entries(contexts)){
    PART_CONTEXTS[id]=[...(PART_CONTEXTS[id]||[])];PART_VIEW_VARIANTS[id]={...(PART_VIEW_VARIANTS[id]||{})};
    for(const[view,variants]of Object.entries(views)){if(!PART_CONTEXTS[id].includes(view))PART_CONTEXTS[id].push(view);PART_VIEW_VARIANTS[id][view]=variants;}
  }
  for(const item of [...STATION_PLATFORM_CONCEPTS,...STATION_PLATFORM_CONCEPT_UPDATES])if(item.related)PART_RELATIONS[item.id]=item.related;
}

export const STATION_PLATFORM_READING_GUIDES=[{
  id:'station-platform-guide',domain:'station',component:'platform-intrusion',title:'Read a station from boarding edge to equipment room',
  summary:'Start with physical places, then distinguish motion, sensing and returned information.',
  sections:[
    {heading:'Keep the physical boundary explicit',text:'An open edge, a lower barrier and a tall facade have visibly different geometry. A lesson about end access should preserve that choice. ST Engineering supplies examples of several barrier heights; the atlas selects two original forms for comparison. Trainway sensing is a separate choice: the LiDAR and paired-radar examples replace one another. A sensor is not a physical barrier, and neither the rendered volume nor its dimensions validate coverage.',sources:['N01','N02','N03']},
    {heading:'Watch the mechanism before reading the indication',text:'The boarding sequence connects the drive to the leaves and keeps the platform-facing and opposite-side train doors distinct. With a barrier fitted, pause after the leaves return. The contact target is back at the frame, but the lock bolt remains withdrawn. The bolt and returned marker then change separately. This authors a useful distinction between command, movement and reported condition without recreating a supplier controller or calculating departure permission.',sources:['N04','N05','N09']},
    {heading:'Locate different sensing areas',text:'An object on the trainway, an object between train and facade, a closing-edge obstruction and access past an end gate occupy different spaces. The interspace example requires a facade. The gate example keeps the edge unchanged and shows its own hinge, latch and position contact. A report leaves the physical object or open gate in place; a camera supplies additional information at a separate interface.',sources:['N02','N05','N06','N07']},
    {heading:'Connect the passenger levels',text:'The station study places stairs and the lift between a platform and concourse. The moving cabin has its own doors; separate landing assemblies stay with the building. In the authored trip, the car closes, travels through an opening in the concourse, aligns with the upper floor and opens there. The equipment room sits on that concourse with an access opening and service aisle, while brackets connect passenger devices to supporting structure. These choices make the scene legible without claiming a usable station design.',sources:['SP01','F01','F03','F04']},
  ],sources:['N01','N02','N03','N04','N05','N06','N07','N09','SP01','F01','F03','F04'],
}];
