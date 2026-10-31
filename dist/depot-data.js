// Original educational content. Public source descriptions are paraphrased;
// the facility, equipment positions and work examples are authored schematics.
export const DEPOT_SOURCES = [
  {id:'D01',title:'Rail Maintenance & Storage Facilities Standard, MX-RMF-STD-001, revision 00 (2023)',publisher:'Metrolinx',url:'https://assets.metrolinx.com/image/upload/v1738255786/Documents/Engineering/Rail_maintenance_and_storage_facilities_standard.pdf',description:'Public operator reference covering layover, maintenance buildings, utilities, access and workshops.',scope:'GO Rail requirements are examples, not universal depot requirements. No source diagrams, dimensions or specifications are reproduced.'},
  {id:'D02',title:'Entities in Charge of Maintenance: maintenance functions',publisher:'Office of Rail and Road',url:'https://www.orr.gov.uk/guide-rogs/8-entities-charge-maintenance-ecm',description:'Distinguishes maintenance management, development, fleet management and delivery, including release documentation.',scope:'UK regulatory explanation used to distinguish functions; the illustration is not a compliance process for another jurisdiction.'},
  {id:'D03',title:'Bogie and wheelset workshop equipment',publisher:'Mechan',url:'https://www.mechan.co.uk/rail/bogie-wheelset-workshop/',description:'Public equipment catalogue links bogie handling, workshop stands and specialist machinery.',scope:'Equipment families and interfaces, without lifting capacities, operating sequences or maintenance limits.'},
];

const sourceUpdates = [
  {id:'O07',title:'Bogie Lowering System NBD',publisher:'Nencki',url:'https://www.nencki.ch/en/plant-engineering/lifting-and-lowering-system-1/bogie-lowering-system-nbd',description:'Bogie lowering and transfer below a supported carbody, with bridges and covers.',scope:'Supplier example. The atlas depicts the mechanism, not a support design or removal procedure.'},
  {id:'O11',title:'Depot Personnel Protection System',publisher:'Sentric Safety Group / Zonegreen',url:'https://www.sentricsafetygroup.com/us/applications/depot-personnel-protection-system/',description:'Personnel registration, movement protection, plant interlocks and separate electrical-access interfaces.',scope:'A supplier arrangement, not a universal protection architecture, signal convention or safety-integrity claim.'},
  {id:'O13',title:'Rail Car Depot Infrastructure — The Dry Creek Experience (2011)',publisher:'IRSE Australasian Section',url:'https://irse.org.au/resource/2011-july-zhang-baulderstone-rail-car-depot-infrastructure-the-dry-creek-experience/',description:'Public technical-paper abstract covering depot/mainline control interfaces, power distribution, maintenance and washing.',scope:'A dated case study and public abstract. No private drawings or source-specific layout are reproduced.'},
];

const concept = (id,label,summary,details,sources,related, caveat='Original schematic. Equipment provision and operating arrangements depend on the fleet and facility.') => ({id,label,summary,details,sources,related,caveat});
export const DEPOT_CONCEPTS = [
  concept('depot-network-boundary','Mainline–depot control boundary','The operating railway and depot meet at an explicit control interface.',[
    'The IRSE Dry Creek case describes interfaces between mainline interlocking and depot control. Responsibility and information cross this boundary.',
    'Here, a dashed boundary separates the operating line from the arrival roads. It marks a relationship, not a prescribed physical installation.'
  ],['O13'],['depot-throat','depot-reception','interlocking','operations-signalling-workstation']),
  concept('depot-reception','Reception road','An arriving train reaches a defined place before onward allocation.',[
    'Arrival needs to connect with the depot’s available destinations and control arrangements.',
    'In the illustrated yard, the reception road sits between the network connection and the track fan. Follow the highlighted arrival to see that relationship.'
  ],['O13'],['depot-network-boundary','depot-controller','depot-stabling']),
  concept('depot-dispatch','Departure and return to service','Vehicle readiness and the route back to the railway are separate matters.',[
    'Maintenance release records completed work; fleet management deals with returning a vehicle to operation.',
    'The departure illustration links the prepared train to the network boundary. It does not infer movement permission from a maintenance record.'
  ],['D02'],['depot-maintenance-release','depot-network-boundary','depot-controller']),
  concept('depot-yard-points','Yard points and route connections','Switches connect one approach to several depot roads.',[
    'Points are part of the depot’s train-control and track interfaces.',
    'Each illustrated branch has a switch end, diverging rails and a drive box. The selected path identifies a destination; it is not a route-proving simulation.'
  ],['O13'],['track-turnout','track-point-machine','depot-throat','depot-shunt-signal']),
  concept('depot-shunt-signal','Depot movement indication','A local indication communicates a defined movement condition.',[
    'Depot protection can interface with shunt signals and local control panels. The exact arrangement depends on the installation.',
    'The model keeps the signal separate from the work-zone device and from the electrical cabinet.'
  ],['O11'],['depot-controller','depot-personnel-protection','depot-network-boundary']),
  concept('depot-maintenance-road','Maintenance road and access levels','One work location brings floor, underframe and roof access together.',[
    'Public depot examples include inspection tracks, roof platforms and movable track or overhead-line arrangements.',
    'The cutaway lets you inspect the pit below, the vehicle at rail level and the access platforms above. Select a level to follow its equipment interfaces.'
  ],['O04'],['depot-inspection-pit','depot-roof-access','depot-personnel-protection']),
  concept('depot-wheelset','Removed wheelset and measurement','A removed axle-and-wheel assembly can be handled as a workshop item.',[
    'Wheelset machinery can work on mounted or removed wheelsets. Reprofiling and removing a wheelset are different operations.',
    'The workshop alternative shows a wheelset on supports beside a measurement fixture, with no vehicle body above it.'
  ],['O08'],['depot-wheel-lathe','bogie','running-rail','depot-stores']),
  concept('depot-bogie-workshop','Bogie repair and exchange workshop','Removed running gear moves through a separate workshop space.',[
    'Bogie workshop equipment includes handling, support and inspection equipment.',
    'The illustrated repair area separates the bogie work stand, a spare assembly and the transfer aisle. It connects back to the vehicle exchange road.'
  ],['D03'],['depot-bogie-drop','depot-lifting-jacks','bogie','depot-material-handling']),
  concept('depot-material-handling','Component handling and transfer','Workshop access includes moving heavy components as well as people.',[
    'Lifting and bogie-handling equipment support component exchange.',
    'The overhead beam, hoist, marked transfer aisle and wheeled trolley show four different interfaces. They are not a lifting plan or a prescribed combination.'
  ],['D03'],['depot-bogie-workshop','depot-stores','depot-lifting-jacks']),
  concept('depot-wash-gantry','Moving wash gantry','The washing equipment travels while the train remains stationary.',[
    'Aquafrisch describes moving side gantries as an alternative to a fixed plant through which the train passes.',
    'Switch between the two arrangements: the moving gantry has a travel track, while the fixed installation keeps its brushes in place.'
  ],['O09'],['depot-wash-plant','depot-water-recovery']),
  concept('depot-wash-pump','Wash supply and dosing skid','Water reaches the spray equipment through a local plant circuit.',[
    'Washing and water treatment are connected services; recovered water can feed selected washing stages.',
    'The model separates the supply pump, fresh-water connection and return circuit. Pipe colours identify these different paths.'
  ],['O09','O10'],['depot-water-recovery','depot-drainage','depot-facility-power']),
  concept('depot-facility-power','Depot electrical distribution','Buildings and workshop equipment need electrical services.',[
    'The IRSE depot example includes transformers, generators, switchboards and power monitoring.',
    'The illustrated distribution room feeds plant and lighting. Its cabinet is separate from the workshop’s vehicle-energy isolation interface.'
  ],['O13'],['facility-transformer','depot-energy-isolation','depot-wash-pump']),
  concept('depot-compressed-air','Workshop compressed air','A facility air system supplies suitable tools and equipment.',[
    'The public Metrolinx reference includes workshop compressed-air services.',
    'Follow the receiver, compressor, dryer and distribution header. The drawing assigns no pressure or air-quality class.'
  ],['D01'],['compressor','depot-maintenance-road','depot-facility-power']),
  concept('depot-drainage','Drainage, collection and discharge','Water and process waste need defined collection paths.',[
    'Depot servicing and washing require drainage and waste-handling arrangements.',
    'The teaching section separates surface collection, recovered wash water and residual discharge; they do not all return to one tank.'
  ],['D01','O10'],['depot-water-recovery','depot-wash-pump']),
  concept('depot-ventilation','Workshop ventilation and extraction','Air systems serve the building and selected workshop processes.',[
    'Maintenance facilities can include local extraction and building ventilation.',
    'A hood and duct mark a local source; a separate fan represents building air movement. No airflow or exposure limit is implied.'
  ],['D01'],['depot-maintenance-road','depot-wheel-lathe','depot-facility-power']),
  concept('depot-fire-security','Fire, security and facility monitoring','Depot buildings need protective and monitoring systems.',[
    'Public facility guidance covers fire and security provision alongside workshop services.',
    'The wall panel, detector and camera are distinct items in this example. Their presence does not establish a compliant system design.'
  ],['D01'],['fire-panel','station-cctv','access-controller','depot-staff-access']),
  concept('depot-staff-access','Staff routes and work-area access','People need routes between the yard, building and work locations.',[
    'Facility access and workshop protection form part of depot design.',
    'Marked walkways connect the reception point, stores and work area. Access to the work zone remains a separate controlled boundary.'
  ],['D01','O11'],['depot-personnel-protection','depot-maintenance-road','depot-stabling']),
  concept('depot-work-planning','Maintenance planning and work records','Work connects vehicle condition, resources and the required task.',[
    'Maintenance management and development organize the work and its documentation; delivery performs the technical task.',
    'The example desk links a work package with a workshop location and parts store. It illustrates information relationships rather than live fleet data.'
  ],['D02'],['depot-controller','depot-stores','depot-maintenance-release','depot-bogie-workshop']),
  concept('depot-maintenance-release','Maintenance release and fleet availability','Completed work needs a recorded handover before operational allocation.',[
    'ORR distinguishes maintenance delivery and its release documentation from fleet management’s return-to-operation function.',
    'The separate record stands show work evidence and operational allocation. Neither is depicted as an interlocking command.'
  ],['D02'],['depot-work-planning','depot-dispatch','operations-traffic-supervision']),
];

export const DEPOT_CONCEPT_UPDATES = [
  {id:'depot-layout',label:'Depot, yard and maintenance facility',summary:'A connected set of places for storing, servicing and maintaining the fleet.',details:['A depot combines railway connections with work locations and supporting services. Different sites provide different maintenance capabilities.','Explore the whole site, then enter the yard, maintenance hall, wheel shop, wash plant or support areas. The layout is an authored teaching composition.'],sources:['O04','O13'],related:['depot-network-boundary','depot-stabling','depot-maintenance-road','depot-bogie-workshop','depot-wash-plant','depot-work-planning']},
  {id:'depot-throat',label:'Depot throat',summary:'The shared approach connects the network with the yard roads.',details:['The throat concentrates the connections to depot destinations. It is where track layout and control interfaces meet.','Follow the visible rail branches to stabling, servicing and the workshop; the coloured path is an explanatory trace.'],sources:['O13'],related:['depot-network-boundary','depot-yard-points','depot-controller']},
  {id:'depot-controller',label:'Depot control and coordination',summary:'The local control position coordinates yard destinations and the network interface.',details:['The IRSE example distinguishes depot control from mainline control.','This workstation represents that local role. Work planning and maintenance release have their own information views.'],sources:['O13'],related:['depot-network-boundary','depot-shunt-signal','depot-work-planning','depot-personnel-protection']},
  {id:'depot-stabling',related:['depot-reception','depot-dispatch','depot-staff-access','depot-maintenance-release']},
  {id:'depot-lifting-jacks',details:['Synchronized jacks raise a supported vehicle body at compatible lifting points.','Select Vehicle lifting to see the body above two bogies at rail level. Select Bogie drop to compare a different mechanism, with one bogie below a supported body.'],related:['carbody','bogie','depot-bogie-drop','depot-material-handling']},
  {id:'depot-bogie-drop',details:['A drop table lowers a bogie below the supported body and provides a transfer route.','The model retains one attached bogie. Use the phase slider to lower the separated bogie into the channel and transfer it sideways while the body stays on its supports.'],sources:['O07'],related:['bogie','depot-lifting-jacks','depot-bogie-workshop']},
  {id:'depot-wheel-lathe',related:['depot-wheelset','bogie','running-rail','depot-material-handling']},
  {id:'depot-stores',label:'Spares store and materials',details:['The store holds components and supplies for planned or corrective work.','Racks, a receiving pallet and a transfer aisle connect the store with the workshop. Work information appears separately at the planning desk.'],related:['depot-work-planning','depot-material-handling','depot-bogie-workshop']},
  {id:'depot-personnel-protection',details:['A published protection arrangement links personnel registration, local panels, movement indications and protective devices. Equipment can have additional interlocks.','The illustration distinguishes the physical work boundary from displayed information. It does not calculate or grant access permission.'],sources:['O11'],related:['depot-shunt-signal','depot-controller','depot-energy-isolation','depot-staff-access']},
  {id:'depot-wash-plant',related:['depot-wash-gantry','depot-wash-pump','depot-water-recovery']},
  {id:'depot-water-recovery',related:['depot-wash-plant','depot-wash-pump','depot-drainage']},
];

const variant=(id,label,title,description,nodes,sources,component)=>({id,label,title,description,nodes,sources,...component?{component}:{}});
const view=(label,title,component,level,note,variants)=>({label,title,component,level,note,variants});
export const DEPOT_VIEWS = {
  'depot-overview':view('Whole depot','The facilities that return a train to service','depot-layout','Facility','Original depot schematic. Select a place to see its equipment and links.',[
    variant('layout','Facility layout','Follow the connections across the depot','The site joins a network boundary, reception, stabling, maintenance, washing and support buildings. Select each destination to inspect its role.',['Network','Reception','Work or stabling','Departure'],['O04','O13'],'depot-layout'),
    variant('night','Stabling','Location and availability answer different questions','The stabling emphasis marks where trains wait. It does not mark every stored train as ready for service.',['Berth','Vehicle condition','Work record','Allocation'],['O04','D02'],'depot-stabling'),
  ]),
  'depot-yard':view('Arrival & yard','Connect the railway to the depot roads','depot-reception','Area','Rail paths are schematic. The highlighted trace is a destination, not a movement authority.',[
    variant('reception','Arrival','From network boundary to reception','The arrival illustration shows the train before its allocation to a depot destination. Inspect the boundary, points and local control position.',['Mainline','Boundary','Reception','Yard roads'],['O13'],'depot-reception'),
    variant('dispatch','Departure','From stabling back to the railway','The departure train is shown on a different road, with the path traced toward the boundary. Maintenance release and movement permission remain separate.',['Stabling','Allocation','Departure','Boundary'],['O13','D02'],'depot-dispatch'),
  ]),
  'depot-maintenance':view('Maintenance hall','Reach the underframe, roof and running gear','depot-inspection-pit','Assembly','Open the hall to inspect the access levels. Alternatives depict equipment relationships, not maintenance procedures.',[
    variant('inspection','Inspection','Three working levels around one vehicle','A recessed pit, side access and roof platforms expose different parts of the same train.',['Pit','Rail level','Roof access','Protection'],['O04','O12'],'depot-inspection-pit'),
    variant('lifting','Bogie drop','Lower one bogie below the supported body','The selected bogie is absent from the train assembly and appears once in the drop aperture. The body remains at its ordinary height.',['Body support','Bogie','Drop table','Transfer space'],['O07'],'depot-bogie-drop'),
    variant('jacks','Vehicle lifting','Raise the body above the running gear','Four synchronized columns support the raised body; both bogies remain on the floor-level track. This changes the load path and access arrangement.',['Lifting points','Columns','Raised body','Bogies'],['O06'],'depot-lifting-jacks'),
    variant('wheel-lathe','Wheel lathe','Machine the wheel while installed','This legacy hall view locates the underfloor machine below the installed wheelset. Open Wheel & bogie shop for the removed-wheelset comparison.',['Wheelset','Machine support','Tool','Profile'],['O08'],'depot-wheel-lathe'),
  ]),
  'depot-workshop':view('Wheel & bogie shop','Inspect the equipment beneath the train','depot-wheel-lathe','Assembly','Each alternative changes the equipment present. The model does not provide machining, lifting or acceptance settings.',[
    variant('lathe','Installed wheelset','Underfloor wheel reprofiling','The train remains above the machine while its wheelset is supported at the machining position.',['Vehicle','Wheelset','Rollers and tool','Measurement'],['O08'],'depot-wheel-lathe'),
    variant('wheelset','Removed wheelset','Work on a separate axle-and-wheel assembly','The vehicle is absent. A wheelset is supported beside its inspection fixture and handling route.',['Removed assembly','Support','Measurement','Storage'],['O08','D03'],'depot-wheelset'),
    variant('bogie','Bogie workshop','Exchange and repair the running-gear assembly','Bogie work stands, a spare assembly and a transfer trolley occupy the shop. Follow the link back to the vehicle exchange road.',['Bogie','Work stand','Components','Exchange road'],['D03','O07'],'depot-bogie-workshop'),
  ]),
  'depot-wash':view('Wash plant','Change what moves through the wash','depot-wash-plant','Assembly','Play animates the selected arrangement. Water paths show relationships, not operating settings.',[
    variant('wash','Drive-through','Fixed brushes; moving train','The wash plant stays in one place and the train moves through it. Compare this with travelling gantries around a stationary train.',['Supply','Fixed brushes','Moving train','Drain'],['O09'],'depot-wash-plant'),
    variant('mobile','Travelling gantry','Stationary train; moving equipment','The gantry moves along its own rails beside the train. Its travel envelope replaces the fixed brush bank.',['Stationary train','Travel rails','Moving gantry','Water supply'],['O09'],'depot-wash-gantry'),
    variant('recovery','Water circuit','Follow collection, treatment and reuse','The model opens the process tanks and shows separate recovered, make-up and residual-water paths.',['Collection','Treatment','Reuse','Residual discharge'],['O09','O10'],'depot-water-recovery'),
  ]),
  'depot-utilities':view('Facility services','Keep the workshop supplied','depot-facility-power','Subsystem','Utility examples are schematic; actual services depend on the fleet and work.',[
    variant('services','Power & air','Trace supplies to the work area','Electrical distribution, workshop air and ventilation appear as separate plant groups.',['Power','Air receiver','Distribution','Work area'],['O13','D01'],'depot-facility-power'),
    variant('water','Water & drainage','Keep supply and waste paths distinct','The section reveals the collection channel and a separate discharge route alongside the service plant.',['Supply','Use','Collection','Discharge'],['D01','O10'],'depot-drainage'),
  ]),
  'depot-support':view('Stores & work planning','Connect materials, work and fleet availability','depot-stores','Interface','Fictional work records and stock. A record shown here does not authorize a train movement.',[
    variant('materials','Materials','Move parts between store and workshop','Racks, a receiving pallet, a transfer aisle and a component workbench show the material path.',['Receipt','Store','Transfer','Workshop'],['O05','D03'],'depot-stores'),
    variant('planning','Work & release','Follow the information behind a completed task','Separate work-planning and release positions distinguish the task record from operational allocation.',['Work package','Resources','Completed work','Release record'],['D02'],'depot-work-planning'),
  ]),
};

export const DEPOT_PRIMARY = {
  'depot-layout':['depot-overview','layout'], 'depot-stabling':['depot-yard','reception'],
  'depot-throat':['depot-yard','reception'], 'depot-controller':['depot-yard','reception'],
  'depot-network-boundary':['depot-yard','reception'], 'depot-reception':['depot-yard','reception'],
  'depot-dispatch':['depot-yard','dispatch'], 'depot-yard-points':['depot-yard','reception'],
  'depot-shunt-signal':['depot-yard','reception'],
  'depot-maintenance-road':['depot-maintenance','inspection'], 'depot-inspection-pit':['depot-maintenance','inspection'],
  'depot-roof-access':['depot-maintenance','inspection'], 'depot-lifting-jacks':['depot-maintenance','jacks'],
  'depot-bogie-drop':['depot-maintenance','lifting'], 'depot-wheel-lathe':['depot-workshop','lathe'],
  'depot-wheelset':['depot-workshop','wheelset'], 'depot-bogie-workshop':['depot-workshop','bogie'],
  'depot-material-handling':['depot-workshop','bogie'], 'depot-wash-plant':['depot-wash','wash'],
  'depot-wash-gantry':['depot-wash','mobile'], 'depot-wash-pump':['depot-wash','wash'],
  'depot-water-recovery':['depot-wash','recovery'], 'depot-facility-power':['depot-utilities','services'],
  'depot-compressed-air':['depot-utilities','services'], 'depot-drainage':['depot-utilities','water'],
  'depot-ventilation':['depot-utilities','services'], 'depot-fire-security':['depot-utilities','services'],
  'depot-stores':['depot-support','materials'], 'depot-staff-access':['depot-support','materials'],
  'depot-work-planning':['depot-support','planning'], 'depot-maintenance-release':['depot-support','planning'],
  'depot-personnel-protection':['depot-protection','work-zone'], 'depot-energy-isolation':['depot-protection','work-zone'],
};

export const DEPOT_GROUPS = [
  {id:'depot-context',label:'Whole facility',views:['depot-overview'],parts:['depot-layout']},
  {id:'depot-yard-group',label:'Arrival, yard & stabling',views:['depot-yard'],parts:['depot-network-boundary','depot-reception','depot-throat','depot-yard-points','depot-shunt-signal','depot-controller','depot-stabling','depot-dispatch']},
  {id:'depot-hall-group',label:'Maintenance hall',views:['depot-maintenance','depot-protection'],parts:['depot-maintenance-road','depot-inspection-pit','depot-roof-access','depot-lifting-jacks','depot-bogie-drop','depot-personnel-protection','depot-energy-isolation']},
  {id:'depot-workshop-group',label:'Wheel & bogie shop',views:['depot-workshop'],parts:['depot-wheel-lathe','depot-wheelset','depot-bogie-workshop','depot-material-handling']},
  {id:'depot-wash-group',label:'Wash & water',views:['depot-wash'],parts:['depot-wash-plant','depot-wash-gantry','depot-wash-pump','depot-water-recovery']},
  {id:'depot-services-group',label:'Facility services',views:['depot-utilities'],parts:['depot-facility-power','depot-compressed-air','depot-drainage','depot-ventilation','depot-fire-security']},
  {id:'depot-support-group',label:'Stores, people & work',views:['depot-support'],parts:['depot-stores','depot-staff-access','depot-work-planning','depot-maintenance-release']},
];

export function applyDepotCatalog(SOURCES,CONCEPTS) {
  for(const item of [...DEPOT_SOURCES,...sourceUpdates]) {
    const existing=SOURCES.find(x=>x.id===item.id);
    if(existing)Object.assign(existing,item);else SOURCES.push(item);
  }
  for(const item of DEPOT_CONCEPTS)if(!CONCEPTS.some(x=>x.id===item.id))CONCEPTS.push(item);
  for(const item of DEPOT_CONCEPT_UPDATES)Object.assign(CONCEPTS.find(x=>x.id===item.id)||{},item);
}

export function applyDepotConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS}) {
  Object.assign(NEW_VIEWS,DEPOT_VIEWS);
  const depot=SYSTEMS.find(x=>x.id==='depot');
  Object.assign(depot,{label:'Depot, yard & maintenance',description:'Arrive, stable, service and return to use',views:['depot-overview','depot-yard','depot-maintenance','depot-workshop','depot-wash','depot-utilities','depot-support','depot-protection'],parts:Object.keys(DEPOT_PRIMARY),groups:DEPOT_GROUPS});
  for(const [id,[view,variant]]of Object.entries(DEPOT_PRIMARY)) {
    PART_VIEWS[id]=view;PART_VARIANTS[id]=variant;PART_CONTEXTS[id]=[view];PART_VIEW_VARIANTS[id]={[view]:[variant]};
  }
  for(const item of [...DEPOT_CONCEPTS,...DEPOT_CONCEPT_UPDATES])if(item.related)PART_RELATIONS[item.id]=item.related;
  // The context map is deliberately explicit: no link advertises hidden geometry.
  const context=(id,view,variants)=>{if(!PART_CONTEXTS[id].includes(view))PART_CONTEXTS[id].push(view);PART_VIEW_VARIANTS[id][view]=variants;};
  for(const id of ['depot-layout','depot-stabling','depot-throat','depot-controller','depot-network-boundary','depot-reception','depot-maintenance-road','depot-wash-plant','depot-stores','depot-work-planning','depot-facility-power'])context(id,'depot-overview',['layout','night']);
  for(const id of ['depot-reception','depot-throat','depot-controller','depot-network-boundary','depot-yard-points','depot-shunt-signal','depot-stabling'])context(id,'depot-yard',['reception','dispatch']);
  for(const id of ['depot-maintenance-road','depot-roof-access'])context(id,'depot-maintenance',['inspection','lifting','jacks','wheel-lathe']);
  context('depot-wheel-lathe','depot-maintenance',['wheel-lathe']);
  for(const id of ['depot-material-handling'])context(id,'depot-workshop',['lathe','wheelset','bogie']);
  for(const id of ['depot-wash-plant','depot-wash-pump','depot-water-recovery'])context(id,'depot-wash',['wash','mobile','recovery']);
  for(const id of ['depot-facility-power','depot-compressed-air','depot-ventilation','depot-fire-security','depot-drainage'])context(id,'depot-utilities',['services','water']);
  for(const id of ['depot-stores','depot-staff-access','depot-work-planning','depot-maintenance-release'])context(id,'depot-support',['materials','planning']);
}
