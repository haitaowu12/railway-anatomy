// Original educational content. Public source descriptions are paraphrased;
// the facility, equipment positions and work examples are authored schematics.
export const DEPOT_SOURCES = [
  {id:'D01',title:'Rail Maintenance & Storage Facilities Standard, MX-RMF-STD-001, revision 00 (2023)',publisher:'Metrolinx',url:'https://assets.metrolinx.com/image/upload/v1738255786/Documents/Engineering/Rail_maintenance_and_storage_facilities_standard.pdf',description:'Public operator reference covering layover, maintenance buildings, utilities, access and workshops.',scope:'A GO Rail facility standard used to identify workshop, utility and access functions.'},
  {id:'D02',title:'Entities in Charge of Maintenance: maintenance functions',publisher:'Office of Rail and Road',url:'https://www.orr.gov.uk/guide-rogs/8-entities-charge-maintenance-ecm',description:'Distinguishes maintenance management, development, fleet management and delivery, including release documentation.',scope:'A UK explanation of maintenance functions, release documentation and return to operation.'},
  {id:'D03',title:'Bogie and wheelset workshop equipment',publisher:'Mechan',url:'https://www.mechan.co.uk/rail/bogie-wheelset-workshop/',description:'Public equipment catalogue links bogie handling, workshop stands and specialist machinery.',scope:'Bogie and wheelset equipment families and their workshop interfaces.'},
  {id:'D04',title:'Measurement and monitoring for rail systems',publisher:'Siemens Mobility',url:'https://www.mobility.siemens.com/global/en/portfolio/digital-solutions-software/digital-services/measurement-monitoring.html',description:'Trackside measurement modules connect wheel, brake and vehicle observations with maintenance information.',scope:'Trackside measurement and the use of condition information in maintenance.'},
  {id:'D05',title:'Stationary and mobile test systems',publisher:'Knorr-Bremse',url:'https://rail.knorr-bremse.com/en/us/portfolio/products-and-systems/stationary-and-mobile-test-systems/',description:'Workshop and mobile fixtures support functional tests of brake, pneumatic and hydraulic equipment.',scope:'Functional testing interfaces for brake, pneumatic and hydraulic equipment.'},
  {id:'D06',title:'Door maintenance, spare parts and diagnostic tools',publisher:'IFE / Knorr-Bremse',url:'https://www.ife-doors.com/en/railservices/maintenance-and-spare-parts/',description:'Door maintenance includes on-train and off-train work, preventive and corrective tasks, and diagnostic support.',scope:'On-train and off-train door maintenance and diagnostic support.'},
  {id:'D07',title:'Air-conditioning unit maintenance and repair',publisher:'ÖBB Technical Services',url:'https://ts.oebb.at/en/products-services/komponenteninstandhaltung/klimaaggregate',description:'Connects on-train inspection, component overhaul and final functional testing of HVAC equipment.',scope:'An operator example of HVAC inspection, overhaul and functional testing.'},
  {id:'D08',title:'Vehicle electronics maintenance and testing',publisher:'ÖBB Technical Services',url:'https://ts.oebb.at/en/products-services/komponenteninstandhaltung/fahrzeugelektronik',description:'Includes traction electronics, inverter controls, onboard supplies and vehicle control components.',scope:'Vehicle-electronics maintenance scope and testing interfaces.'},
  {id:'D09',title:'Yard Management System: depot coordination and handovers',publisher:'Siemens Mobility',url:'https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/mainline/yard-and-depot-solutions/yard-management-system.html',description:'Distinguishes vehicle location, work completion, track occupancy, staff registration and documented handovers.',scope:'One depot-management example linking location, work status and handover.'},
  {id:'D10',title:'Wheelset maintenance and non-destructive inspection',publisher:'ÖBB Technical Services',url:'https://ts.oebb.at/en/products-services/komponenteninstandhaltung/radsaetze',description:'Describes wheelset overhaul, reprofiling, ultrasonic inspection and recorded results.',scope:'Wheelset overhaul, dimensional work, ultrasonic inspection and records.'},
  {id:'D11',title:'Electric motor and transformer maintenance',publisher:'ÖBB Technical Services',url:'https://ts.oebb.at/en/products-services/komponenteninstandhaltung/elektromotoren-und-transofrmatoren',description:'Electrical-machine work includes initial evaluation, mechanical and winding repairs, and final testing.',scope:'Electrical-machine evaluation, repairs and final testing.'},
];

const sourceUpdates = [
  {id:'O07',title:'Bogie Lowering System NBD',publisher:'Nencki',url:'https://www.nencki.ch/en/plant-engineering/lifting-and-lowering-system-1/bogie-lowering-system-nbd',description:'Bogie lowering and transfer below a supported carbody, with bridges and covers.',scope:'Bogie lowering beneath a supported vehicle and movement through a transfer channel.'},
  {id:'O11',title:'Depot Personnel Protection System',publisher:'Sentric Safety Group / Zonegreen',url:'https://www.sentricsafetygroup.com/us/applications/depot-personnel-protection-system/',description:'Personnel registration, movement protection, plant interlocks and separate electrical-access interfaces.',scope:'A supplier example of personnel registration, movement protection and plant interlocks.'},
  {id:'O13',title:'Rail Car Depot Infrastructure — The Dry Creek Experience (2011)',publisher:'IRSE Australasian Section',url:'https://irse.org.au/resource/2011-july-zhang-baulderstone-rail-car-depot-infrastructure-the-dry-creek-experience/',description:'Public technical-paper abstract covering depot/mainline control interfaces, power distribution, maintenance and washing.',scope:'A 2011 depot case-study abstract covering railway interfaces and supporting services.'},
];

const concept = (id,label,summary,details,sources,related, caveat='') => ({id,label,summary,details,sources,related,...caveat?{caveat}:{}});
export const DEPOT_CONCEPTS = [
  concept('depot-network-boundary','Mainline–depot control boundary','The operating railway and depot meet at an explicit control interface.',[
    'The IRSE Dry Creek case describes interfaces between mainline interlocking and depot control. Responsibility and information cross this boundary.',
    'The dashed line marks where the operating railway meets the arrival roads. Information and responsibility pass across this control boundary.'
  ],['O13'],['depot-throat','depot-reception','interlocking','operations-signalling-workstation']),
  concept('depot-reception','Reception road','An arriving train reaches a defined place before onward allocation.',[
    'Arrival needs to connect with the depot’s available destinations and control arrangements.',
    'In the illustrated yard, the reception road sits between the network connection and the track fan. Follow the highlighted arrival to see that relationship.'
  ],['O13'],['depot-network-boundary','depot-controller','depot-stabling']),
  concept('depot-dispatch','Departure and return to service','Vehicle readiness and the route back to the railway are separate matters.',[
    'Maintenance release records completed work; fleet management deals with returning a vehicle to operation.',
    'The departure view connects a prepared train to the network boundary. Vehicle readiness and permission for that movement are checked through separate arrangements.'
  ],['D02'],['depot-maintenance-release','depot-network-boundary','depot-controller']),
  concept('depot-yard-points','Yard points and route connections','Switches connect one approach to several depot roads.',[
    'Points are part of the depot’s train-control and track interfaces.',
    'Each branch includes movable switch rails, connecting rails and a drive. The highlighted path identifies the selected destination; signalling establishes whether the route may be used.'
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
    'The beam and hoist lift components, a trolley carries them, and the transfer aisle provides space for movement between work areas.'
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
    'The compressor produces pressurized air, the dryer removes moisture, the receiver stores air and smooths demand, and the header distributes it to workshop users.'
  ],['D01'],['compressor','depot-maintenance-road','depot-facility-power']),
  concept('depot-drainage','Drainage, collection and discharge','Water and process waste need defined collection paths.',[
    'Depot servicing and washing require drainage and waste-handling arrangements.',
    'Follow separate paths for surface drainage, recovered wash water and residual discharge. Water suitable for reuse passes through its treatment circuit.'
  ],['D01','O10'],['depot-water-recovery','depot-wash-pump']),
  concept('depot-ventilation','Workshop ventilation and extraction','Air systems serve the building and selected workshop processes.',[
    'Maintenance facilities can include local extraction and building ventilation.',
    'A local hood captures air near a process and directs it into a duct. Building ventilation exchanges air across the wider workshop. Each serves a different area.'
  ],['D01'],['depot-maintenance-road','depot-wheel-lathe','depot-facility-power']),
  concept('depot-fire-security','Fire, security and facility monitoring','Depot buildings need protective and monitoring systems.',[
    'Public facility guidance covers fire and security provision alongside workshop services.',
    'The fire panel receives fire-system inputs, the detector reports a local condition, and the camera supplies video. These devices support different protective and monitoring functions.'
  ],['D01'],['fire-panel','station-cctv','access-controller','depot-staff-access']),
  concept('depot-staff-access','Staff routes and work-area access','People need routes between the yard, building and work locations.',[
    'Facility access and workshop protection form part of depot design.',
    'Marked walkways connect the reception point, stores and work area. Access to the work zone remains a separate controlled boundary.'
  ],['D01','O11'],['depot-personnel-protection','depot-maintenance-road','depot-stabling']),
  concept('depot-work-planning','Maintenance planning and work records','Work connects vehicle condition, resources and the required task.',[
    'Maintenance management and development organize the work and its documentation; delivery performs the technical task.',
    'A work package connects the vehicle, required task, workshop location, staff, tools and replacement parts. Records retain what was found and completed.'
  ],['D02'],['depot-controller','depot-stores','depot-maintenance-release','depot-bogie-workshop']),
  concept('depot-maintenance-release','Maintenance release and fleet availability','Completed work needs a recorded handover before operational allocation.',[
    'ORR distinguishes maintenance delivery and its release documentation from fleet management’s return-to-operation function.',
    'Completed work and its checks support the maintenance release. Fleet allocation connects the vehicle with a service requirement, while signalling governs its later movement.'
  ],['D02'],['depot-work-planning','depot-dispatch','operations-traffic-supervision']),
  concept('depot-work-handover','Yard allocation and work handover','A vehicle location, work status and protected work road describe different things.',[
    'Depot coordination connects the vehicle identity and location with the destination, required work and people involved. Public yard-management examples also distinguish track occupancy, staff registration and documented handovers.',
    'Choose Work handover to see the vehicle on a different road, a separate work boundary and the coordination link. The points change with the chosen destination; the train remains stationary beside the work record.',
    'A work handover identifies the vehicle, assigned location, required tasks and continuing responsibilities. Movement protection and energy isolation need their own confirmed conditions.'
  ],['D09','O11'],['depot-controller','depot-yard-points','depot-personnel-protection','depot-work-planning']),
  concept('depot-condition-monitoring','Condition measurement and inspection','Measurements help identify maintenance needs.',[
    'Trackside systems can measure wheel profiles and other vehicle features as a train passes. Onboard observations and maintenance records provide other views of condition.',
    'In this example the train moves through a fixed sensor portal. The measurement plane appears only while the vehicle is within the portal, and a separate link leads to the review position.',
    'The measurement is linked to a vehicle and its history, then assessed against the relevant maintenance requirements. A change in condition can lead to further inspection or planned work.'
  ],['D04'],['depot-diagnostics','depot-wheelset-inspection','depot-work-planning']),
  concept('depot-diagnostics','Stationary examination and diagnosis','A reported symptom needs evidence that locates the work.',[
    'Diagnostic tools support fault investigation; physical examination and measurement remain different sources of evidence. The required method depends on the equipment and the maintenance task.',
    'Compare the stationary vehicle, wheel-profile gauge and diagnostic connection with the roll-by portal. The moving marker follows information from the vehicle to the review desk.',
    'Diagnosis can lead to adjustment, component repair, replacement or further investigation. A clear diagnostic display alone is not a maintenance release.'
  ],['D04','D06','D08'],['depot-condition-monitoring','depot-work-planning','depot-functional-checks']),
  concept('depot-brake-test','Brake component test bench','A fixture makes a brake component’s response observable.',[
    'Stationary and mobile test equipment serve different locations and test scopes. Workshop rigs can examine brake calipers, control modules and pneumatic equipment after maintenance or overhaul.',
    'The illustrated disc stays stationary while opposing pads move into contact and release. The supply connection, fixture, response indicator and removable cover are separate parts of the bench.',
    'Follow the actuator as it brings the pads into contact, then releases them. The animation enlarges their travel so this movement is visible; a real test also measures the required response.'
  ],['D05'],['brakes','brake-control','depot-compressed-air','depot-functional-checks']),
  concept('depot-door-service','Door mechanism maintenance and checks','The door leaves, drive and position indication can be examined together.',[
    'Door maintenance can take place on a vehicle or on removed equipment. Preventive work, corrective repair and diagnostic support address different needs.',
    'Open the rig’s operator cover to inspect the guide, drive and moving carriages. The leaves separate to clear the doorway and return; the small position indicator appears only at the closed end of travel.',
    'Closed position confirms where the leaves are. Locking, obstruction detection, emergency release and the vehicle’s departure interlock require additional checks.'
  ],['D06'],['doors','depot-diagnostics','depot-functional-checks']),
  concept('depot-hvac-service','HVAC inspection and component work','Air circulation, heat exchange and controls meet in one serviceable unit.',[
    'HVAC work ranges from on-train inspection and cleaning to component overhaul and functional testing. Air-side condition, refrigerant-circuit condition and electrical response are different checks.',
    'The cutaway bench separates the filter, heat exchanger, supply fan, refrigeration equipment and control connection. The moving marker follows the supply-air path; component separation exposes the filter and covers.',
    'The fan moves air, the filter removes particles, and the heat exchanger transfers heat. Testing after maintenance checks the required airflow, thermal and control functions.'
  ],['D07'],['hvac','depot-ventilation','depot-functional-checks']),
  concept('depot-traction-service','Traction electronics workshop','A removed converter links power modules, control electronics and test equipment.',[
    'Vehicle-electronics maintenance includes traction and inverter electronics as well as onboard supplies and controllers. Electrical machines have their own inspection, mechanical repair and test needs.',
    'This bench focuses on a converter rather than a particular motor type. Open its case or separate the modules to inspect the capacitor bank, power stacks and control board; the marker follows an illustrative diagnostic response to the test cabinet.',
    'Both rotary and linear-motor trains use traction power electronics. The moving marker follows diagnostic information between the converter and test equipment; it is separate from the power circuit.'
  ],['D08','D11'],['traction-inverter','depot-energy-isolation','depot-diagnostics','depot-functional-checks']),
  concept('depot-wheelset-inspection','Wheelset inspection and test evidence','Profile measurement and non-destructive inspection answer different questions.',[
    'Wheelset work can include dimensional measurement, reprofiling, replacement and non-destructive inspection. Public workshop examples describe ultrasonic inspection of wheels and axles and documentation of the results.',
    'The Non-destructive inspection arrangement adds an axial probe and a recording connection. The wheelset turns on supporting rollers while the probe fixture stays aligned with the axle.',
    'Dimensional checks measure size and profile. Non-destructive inspection examines material condition without cutting the component apart. The appropriate inspection coverage and acceptance criteria depend on the wheelset and task.'
  ],['D10'],['depot-wheelset','depot-wheel-lathe','depot-bogie-workshop','depot-functional-checks']),
  concept('depot-functional-checks','Functional checks and recorded results','Completed work needs evidence of the required function.',[
    'Depots can provide measuring equipment, stationary test arrangements and separate test tracks. The checks required after a task depend on the work performed and the applicable maintenance instructions.',
    'Compare a stationary vehicle connected to a test fixture with a vehicle moving on its own test road. The measurement link and record position remain distinct from the railway control boundary.',
    'An observed response is evidence for review. It is not an automatic release, and a maintenance check should not be confused with the wider commissioning or acceptance of a new or modified vehicle.'
  ],['O04','D02'],['depot-test-track','depot-maintenance-release','depot-diagnostics','depot-brake-test']),
  concept('depot-test-track','Separate test road','Some functional observations require the vehicle to move.',[
    'Public maintenance facilities include test-track capability alongside stationary workshop equipment. A test road provides a different environment from a work stand or an occupied maintenance road.',
    'The vehicle travels on a separate fenced road. Compare it with the stationary arrangement, where the train remains beside a measurement fixture.',
    'Test results, maintenance release, fleet allocation and authority for a later railway movement remain separate matters.'
  ],['O04','D02'],['depot-functional-checks','depot-maintenance-release','depot-dispatch']),
];

export const DEPOT_CONCEPT_UPDATES = [
  {id:'depot-layout',label:'Depot, yard and maintenance facility',summary:'A connected set of places for storing, servicing and maintaining the fleet.',details:['A depot combines railway connections with work locations and supporting services. Different sites provide different maintenance capabilities.','Explore the whole site, then enter the yard, maintenance hall, wheel shop, wash plant or support areas. Each destination serves a different part of a maintenance visit.'],sources:['O04','O13'],related:['depot-network-boundary','depot-stabling','depot-maintenance-road','depot-bogie-workshop','depot-wash-plant','depot-work-planning']},
  {id:'depot-throat',label:'Depot throat',summary:'The shared approach connects the network with the yard roads.',details:['The throat concentrates the connections to depot destinations. It is where track layout and control interfaces meet.','Follow the visible rail branches to stabling, servicing and the workshop; the coloured path is an explanatory trace.'],sources:['O13'],related:['depot-network-boundary','depot-yard-points','depot-controller']},
  {id:'depot-controller',label:'Depot control and coordination',summary:'The local control position coordinates yard destinations and the network interface.',details:['The IRSE example distinguishes depot control from mainline control.','This workstation represents that local role. Work planning and maintenance release have their own information views.'],sources:['O13'],related:['depot-network-boundary','depot-shunt-signal','depot-work-planning','depot-personnel-protection']},
  {id:'depot-stabling',related:['depot-reception','depot-dispatch','depot-staff-access','depot-maintenance-release']},
  {id:'depot-lifting-jacks',details:['Synchronized jacks raise a supported vehicle body at compatible lifting points.','Select Vehicle lifting to see the body above two bogies at rail level. Select Bogie drop to compare a different mechanism, with one bogie below a supported body.'],related:['carbody','bogie','depot-bogie-drop','depot-material-handling']},
  {id:'depot-bogie-drop',details:['A drop table lowers a bogie below the supported body and provides a transfer route.','One bogie stays attached while the other is removed. Use Sequence position to lower the removed bogie into the channel and transfer it sideways while the body stays on its supports.'],sources:['O07'],related:['bogie','depot-lifting-jacks','depot-bogie-workshop']},
  {id:'depot-wheel-lathe',related:['depot-wheelset','depot-wheelset-inspection','bogie','running-rail','depot-material-handling']},
  {id:'depot-stores',label:'Spares store and materials',details:['The store holds components and supplies for planned or corrective work.','Racks, a receiving pallet and a transfer aisle connect the store with the workshop. Work information appears separately at the planning desk.'],related:['depot-work-planning','depot-material-handling','depot-bogie-workshop']},
  {id:'depot-personnel-protection',details:['A published protection arrangement links personnel registration, local panels, movement indications and protective devices. Equipment can have additional interlocks.','The physical work boundary and its reported state are separate parts of the protection arrangement. Access depends on the required protections being established.'],sources:['O11'],related:['depot-shunt-signal','depot-controller','depot-energy-isolation','depot-staff-access']},
  {id:'depot-wash-plant',related:['depot-wash-gantry','depot-wash-pump','depot-water-recovery']},
  {id:'depot-water-recovery',related:['depot-wash-plant','depot-wash-pump','depot-drainage']},
];

const variant=(id,label,title,description,nodes,sources,component,animation)=>({id,label,title,description,nodes,sources,...component?{component}:{},...animation?{animation}:{}});
const view=(label,title,component,level,note,variants)=>({label,title,component,level,note,variants});
const motion=(label,steps)=>({label,steps:steps.map(([at,label,description])=>({at,label,description}))});
export const DEPOT_VIEWS = {
  'depot-overview':view('Whole depot','The facilities that return a train to service','depot-layout','Facility','Select a place to inspect its equipment and connections to the rest of the depot.',[
    variant('layout','Facility layout','Follow the connections across the depot','The site joins a network boundary, reception, stabling, maintenance, washing and support buildings. Select each destination to inspect its role.',['Network','Reception','Work or stabling','Departure'],['O04','O13'],'depot-layout'),
    variant('night','Stabling','Location and availability answer different questions','The stabling emphasis marks where trains wait. It does not mark every stored train as ready for service.',['Berth','Vehicle condition','Work record','Allocation'],['O04','D02'],'depot-stabling'),
  ]),
  'depot-yard':view('Arrival & yard','Connect the railway to the depot roads','depot-reception','Area','Rail paths are schematic. The highlighted trace is a destination, not a movement authority.',[
    variant('reception','Arrival','From network boundary to reception','The arrival illustration shows the train before its allocation to a depot destination. Inspect the boundary, points and local control position.',['Mainline','Boundary','Reception','Yard roads'],['O13'],'depot-reception'),
    variant('handover','Work handover','Allocate a road and hand over the work','A different vehicle occupies the work road, the selected points change, and a coordination link joins the work record to depot control. The work boundary is a separate physical element.',['Vehicle location','Destination','Work boundary','Handover'],['D09','O11'],'depot-work-handover'),
    variant('dispatch','Departure','From stabling back to the railway','The departure train is shown on a different road, with the path traced toward the boundary. Maintenance release and movement permission remain separate.',['Stabling','Allocation','Departure','Boundary'],['O13','D02'],'depot-dispatch'),
  ]),
  'depot-condition':view('Inspection & diagnosis','Find the work before choosing the repair','depot-condition-monitoring','Activity','Measurements and diagnostic information inform the maintenance decision. Compare observation during movement with examination at a standstill.',[
    variant('roll-by','Roll-by inspection','Fixed sensors observe a passing vehicle','The portal remains fixed while the train passes; its measurement plane appears only during the passage. The data link leads to review rather than an automatic release.',['Vehicle identity','Measurement','Condition history','Work decision'],['D04'],'depot-condition-monitoring',motion('Illustrated passage through fixed sensors',[
      [0,'Approach','The vehicle is before the fixed measurement portal.'],[.32,'Enter measurement zone','The vehicle overlaps the sensor plane; the portal stays fixed.'],[.5,'Pass the sensors','Different parts of the vehicle pass the same measuring position.'],[.7,'Clear the portal','The vehicle has cleared this measurement position.'],[1,'Review the record','The information trace reaches the review position after the vehicle has passed.']
    ])),
    variant('stationary','Stationary diagnosis','Combine physical examination and diagnostic evidence','The train remains still beside a wheel gauge and diagnostic connection. Follow how physical measurements and vehicle reports reach the review desk.',['Symptom','Examination','Diagnostic evidence','Work package'],['D04','D06','D08'],'depot-diagnostics',motion('Vehicle-to-diagnosis information path',[
      [0,'Vehicle evidence','The marker starts at the vehicle connection.'],[.5,'Diagnostic link','The marker follows the illustrated connection while the vehicle stays still.'],[1,'Review evidence','The marker reaches the diagnostic position where the evidence can be reviewed.']
    ])),
  ]),
  'depot-components':view('Component maintenance','Follow the work inside a removed subsystem','depot-brake-test','Activity','Compare the mechanisms and test connections inside four removed subsystems. Each fixture makes a different response visible.',[
    variant('brakes','Brake bench','Observe application and release at a test fixture','Opposing pads approach a stationary disc and retract. The test connection and qualitative response indicator stay attached to the fixture.',['Supply','Actuator','Pad contact','Recorded response'],['D05'],'depot-brake-test',motion('Illustrative brake application and release',[
      [0,'Released','A visible gap separates both pads from the disc.'],[.25,'Approach','The pads move inward; travel is enlarged for clarity.'],[.5,'Contact','Both pads meet the stationary disc without crossing it.'],[.75,'Release','The pads move away from the disc.'],[1,'Released again','The pads return to their starting positions, leaving a gap on each side of the disc.']
    ])),
    variant('doors','Door rig','Inspect the drive, leaves and position feedback','Opening the operator cover exposes the guide and drive. The leaves open and close while a separate indicator marks closed position.',['Drive','Carriages','Doorway','Position observation'],['D06'],'depot-door-service',motion('Illustrative sliding-door cycle',[
      [0,'Closed position','The leaves meet and the small position indicator is visible.'],[.25,'Opening','The leaves and their carriages move apart.'],[.5,'Clear doorway','Both leaves clear the opening.'],[.75,'Closing','The leaves return toward the centre.'],[1,'Closed position restored','The leaves reach the closed position and the separate position indicator returns.']
    ])),
    variant('hvac','HVAC unit','Separate the air path from the service tasks','Open the unit to inspect the filter, heat exchanger, fan and refrigeration equipment. Follow the air path through the assembled unit.',['Filter','Heat exchange','Fan','Supply air'],['D07'],'depot-hvac-service',motion('Supply-air path through the cutaway unit',[
      [0,'Air entry','The marker is at the inlet beside the filter.'],[.4,'Heat-exchange section','The marker follows the air passage toward the heat exchanger.'],[.7,'Fan section','The supply fan turns within its fixed housing.'],[1,'Supply outlet','The marker leaves the unit through the supply duct.']
    ])),
    variant('traction','Traction electronics','Inspect a converter and its diagnostic interface','The removed converter contains capacitors, power modules and a control board. The test connection carries an illustrative response to a separate cabinet.',['Control board','Power modules','Test connection','Response record'],['D08','D11'],'depot-traction-service',motion('Illustrative converter diagnostic response',[
      [0,'Equipment connection','The marker starts beside the converter control connection.'],[.5,'Test harness','The marker follows the diagnostic information connection to the test fixture.'],[1,'Test equipment','The response reaches the test cabinet for assessment.']
    ])),
  ]),
  'depot-testing':view('Functional checks','Distinguish test evidence from return to operation','depot-functional-checks','Activity','Stationary checks and a test road provide different ways to observe a vehicle function. Results feed into the maintenance review.',[
    variant('stationary','Stationary checks','Observe a function with the vehicle held in place','The vehicle is connected to a measurement fixture. A separate record position shows where the evidence is reviewed.',['Vehicle function','Measurement fixture','Result','Review'],['O04','D02'],'depot-functional-checks',motion('Illustrative measurement-to-record connection',[
      [0,'Vehicle connection','The marker starts at the stationary vehicle.'],[.5,'Measurement link','The marker follows the test connection while the train stays in place.'],[1,'Evidence for review','The marker reaches the test fixture, where the result becomes available for review.']
    ])),
    variant('movement','Test road','Use a separate place for observations during movement','The train moves on a separate fenced road, with a place beside it to collect and review test information.',['Test road','Vehicle movement','Observation','Recorded result'],['O04','D02'],'depot-test-track',motion('Illustrative movement on a separate test road',[
      [0,'Near end','The vehicle is at one end of the illustrated movement range.'],[.25,'Along the test road','The vehicle moves through the middle of its separate road.'],[.5,'Far end','The vehicle reaches the other end of the illustrated range.'],[.75,'Return movement','The vehicle returns through the middle of the road.'],[1,'Cycle complete','The vehicle returns to the starting position of the illustrated cycle.']
    ])),
  ]),
  'depot-maintenance':view('Maintenance hall','Reach the underframe, roof and running gear','depot-inspection-pit','Assembly','Open the hall to compare underframe, side and roof access. Then inspect how lifting or a bogie drop changes the vehicle support.',[
    variant('inspection','Inspection','Three working levels around one vehicle','A recessed pit, side access and roof platforms expose different parts of the same train.',['Pit','Rail level','Roof access','Protection'],['O04','O12'],'depot-inspection-pit'),
    variant('lifting','Bogie drop','Lower one bogie below the supported body','One detached bogie rests on the drop table beneath the body. The remaining bogie and fixed body supports carry the vehicle while the removed assembly is lowered and transferred.',['Body support','Bogie','Drop table','Transfer space'],['O07'],'depot-bogie-drop'),
    variant('jacks','Vehicle lifting','Raise the body above the running gear','Four synchronized columns support the raised body; both bogies remain on the floor-level track. This changes the load path and access arrangement.',['Lifting points','Columns','Raised body','Bogies'],['O06'],'depot-lifting-jacks'),
    variant('wheel-lathe','Wheel lathe','Machine the wheel while installed','This hall view locates the underfloor machine below the installed wheelset. Open Wheel & bogie shop for the removed-wheelset comparison.',['Wheelset','Machine support','Tool','Profile'],['O08'],'depot-wheel-lathe'),
  ]),
  'depot-workshop':view('Wheel & bogie shop','Inspect the equipment beneath the train','depot-wheel-lathe','Assembly','Compare an installed wheelset, a removed wheelset, an inspection fixture and a bogie workshop. Each provides a different working arrangement.',[
    variant('lathe','Installed wheelset','Underfloor wheel reprofiling','The train remains above the machine while its wheelset is supported at the machining position.',['Vehicle','Wheelset','Rollers and tool','Measurement'],['O08'],'depot-wheel-lathe'),
    variant('wheelset','Removed wheelset','Work on a separate axle-and-wheel assembly','The vehicle is absent. A wheelset is supported beside its inspection fixture and handling route.',['Removed assembly','Support','Measurement','Storage'],['O08','D03'],'depot-wheelset'),
    variant('ndt','Non-destructive inspection','Inspect material condition as well as dimensions','A supported wheelset, axial probe and recording connection show an inspection arrangement. The fixture keeps the probe aligned while the wheelset turns.',['Wheelset identity','Probe fixture','Inspection evidence','Record'],['D10'],'depot-wheelset-inspection',motion('Wheelset and fixed inspection fixture',[
      [0,'Wheelset on rollers','The axle is aligned with the fixed probe fixture.'],[.5,'Wheelset turns','The wheelset turns while the probe remains on its axis; supporting rollers turn in the opposite sense.'],[1,'One illustrated turn','The wheelset returns to its initial orientation and the record trace reaches the display.']
    ])),
    variant('bogie','Bogie workshop','Exchange and repair the running-gear assembly','Bogie work stands, a spare assembly and a transfer trolley occupy the shop. Follow the link back to the vehicle exchange road.',['Bogie','Work stand','Components','Exchange road'],['D03','O07'],'depot-bogie-workshop'),
  ]),
  'depot-wash':view('Wash plant','Change what moves through the wash','depot-wash-plant','Assembly','Use Play sequence to compare what moves. Water circuit traces the separate supply, collection and treatment paths.',[
    variant('wash','Drive-through','Fixed brushes; moving train','The wash plant stays in one place and the train moves through it. Compare this with travelling gantries around a stationary train.',['Supply','Fixed brushes','Moving train','Drain'],['O09'],'depot-wash-plant'),
    variant('mobile','Travelling gantry','Stationary train; moving equipment','The gantry moves along its own rails beside the train. Its travel envelope replaces the fixed brush bank.',['Stationary train','Travel rails','Moving gantry','Water supply'],['O09'],'depot-wash-gantry'),
    variant('recovery','Water circuit','Follow collection, treatment and reuse','The model opens the process tanks and shows separate recovered, make-up and residual-water paths.',['Collection','Treatment','Reuse','Residual discharge'],['O09','O10'],'depot-water-recovery'),
  ]),
  'depot-utilities':view('Facility services','Keep the workshop supplied','depot-facility-power','Subsystem','Utility examples are schematic; actual services depend on the fleet and work.',[
    variant('services','Power & air','Trace supplies to the work area','Electrical distribution, workshop air and ventilation appear as separate plant groups.',['Power','Air receiver','Distribution','Work area'],['O13','D01'],'depot-facility-power'),
    variant('water','Water & drainage','Keep supply and waste paths distinct','The section reveals the collection channel and a separate discharge route alongside the service plant.',['Supply','Use','Collection','Discharge'],['D01','O10'],'depot-drainage'),
  ]),
  'depot-support':view('Stores & work planning','Connect materials, work and fleet availability','depot-stores','Interface','Follow parts from the store and information from the planning desk. Work completion, fleet allocation and permission to move are separate decisions.',[
    variant('materials','Materials','Move parts between store and workshop','Racks, a receiving pallet, a transfer aisle and a component workbench show the material path.',['Receipt','Store','Transfer','Workshop'],['O05','D03'],'depot-stores'),
    variant('planning','Work & release','Follow the information behind a completed task','Separate work-planning and release positions distinguish the task record from operational allocation.',['Work package','Resources','Completed work','Release record'],['D02'],'depot-work-planning'),
  ]),
};

export const DEPOT_PRIMARY = {
  'depot-layout':['depot-overview','layout'], 'depot-stabling':['depot-yard','reception'],
  'depot-throat':['depot-yard','reception'], 'depot-controller':['depot-yard','reception'],
  'depot-network-boundary':['depot-yard','reception'], 'depot-reception':['depot-yard','reception'],
  'depot-dispatch':['depot-yard','dispatch'], 'depot-yard-points':['depot-yard','reception'],
  'depot-shunt-signal':['depot-yard','reception'], 'depot-work-handover':['depot-yard','handover'],
  'depot-condition-monitoring':['depot-condition','roll-by'], 'depot-diagnostics':['depot-condition','stationary'],
  'depot-brake-test':['depot-components','brakes'], 'depot-door-service':['depot-components','doors'],
  'depot-hvac-service':['depot-components','hvac'], 'depot-traction-service':['depot-components','traction'],
  'depot-functional-checks':['depot-testing','stationary'], 'depot-test-track':['depot-testing','movement'],
  'depot-maintenance-road':['depot-maintenance','inspection'], 'depot-inspection-pit':['depot-maintenance','inspection'],
  'depot-roof-access':['depot-maintenance','inspection'], 'depot-lifting-jacks':['depot-maintenance','jacks'],
  'depot-bogie-drop':['depot-maintenance','lifting'], 'depot-wheel-lathe':['depot-workshop','lathe'],
  'depot-wheelset':['depot-workshop','wheelset'], 'depot-wheelset-inspection':['depot-workshop','ndt'], 'depot-bogie-workshop':['depot-workshop','bogie'],
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
  {id:'depot-yard-group',label:'Arrival, yard & stabling',views:['depot-yard'],parts:['depot-network-boundary','depot-reception','depot-throat','depot-yard-points','depot-shunt-signal','depot-controller','depot-stabling','depot-work-handover','depot-dispatch']},
  {id:'depot-assessment-group',label:'Inspection & diagnosis',views:['depot-condition'],parts:['depot-condition-monitoring','depot-diagnostics']},
  {id:'depot-hall-group',label:'Maintenance hall',views:['depot-maintenance','depot-protection'],parts:['depot-maintenance-road','depot-inspection-pit','depot-roof-access','depot-lifting-jacks','depot-bogie-drop','depot-personnel-protection','depot-energy-isolation']},
  {id:'depot-workshop-group',label:'Wheel & bogie shop',views:['depot-workshop'],parts:['depot-wheel-lathe','depot-wheelset','depot-wheelset-inspection','depot-bogie-workshop','depot-material-handling']},
  {id:'depot-component-group',label:'Component maintenance',views:['depot-components'],parts:['depot-brake-test','depot-door-service','depot-hvac-service','depot-traction-service']},
  {id:'depot-test-group',label:'Functional checks',views:['depot-testing'],parts:['depot-functional-checks','depot-test-track']},
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
  Object.assign(depot,{label:'Depot, yard & maintenance',description:'Assess, maintain, test and return to use',views:['depot-overview','depot-yard','depot-condition','depot-maintenance','depot-workshop','depot-components','depot-testing','depot-wash','depot-utilities','depot-support','depot-protection'],parts:Object.keys(DEPOT_PRIMARY),groups:DEPOT_GROUPS});
  for(const [id,[view,variant]]of Object.entries(DEPOT_PRIMARY)) {
    PART_VIEWS[id]=view;PART_VARIANTS[id]=variant;PART_CONTEXTS[id]=[view];PART_VIEW_VARIANTS[id]={[view]:[variant]};
  }
  for(const item of [...DEPOT_CONCEPTS,...DEPOT_CONCEPT_UPDATES])if(item.related)PART_RELATIONS[item.id]=item.related;
  // The context map is deliberately explicit: no link advertises hidden geometry.
  const context=(id,view,variants)=>{if(!PART_CONTEXTS[id].includes(view))PART_CONTEXTS[id].push(view);PART_VIEW_VARIANTS[id][view]=variants;};
  for(const id of ['depot-layout','depot-stabling','depot-throat','depot-controller','depot-network-boundary','depot-reception','depot-maintenance-road','depot-wash-plant','depot-stores','depot-work-planning','depot-facility-power'])context(id,'depot-overview',['layout','night']);
  for(const id of ['depot-reception','depot-throat','depot-controller','depot-network-boundary','depot-yard-points','depot-shunt-signal','depot-stabling'])context(id,'depot-yard',['reception','handover','dispatch']);
  context('depot-personnel-protection','depot-yard',['handover']);
  context('depot-diagnostics','depot-condition',['roll-by','stationary']);
  context('depot-work-planning','depot-condition',['stationary']);
  context('depot-functional-checks','depot-testing',['stationary','movement']);
  context('depot-maintenance-release','depot-testing',['stationary','movement']);
  for(const id of ['depot-maintenance-road','depot-roof-access'])context(id,'depot-maintenance',['inspection','lifting','jacks','wheel-lathe']);
  context('depot-wheel-lathe','depot-maintenance',['wheel-lathe']);
  for(const id of ['depot-material-handling'])context(id,'depot-workshop',['lathe','wheelset','ndt','bogie']);
  context('depot-wheelset','depot-workshop',['wheelset','ndt']);
  for(const id of ['depot-wash-plant','depot-wash-pump','depot-water-recovery'])context(id,'depot-wash',['wash','mobile','recovery']);
  for(const id of ['depot-facility-power','depot-compressed-air','depot-ventilation','depot-fire-security','depot-drainage'])context(id,'depot-utilities',['services','water']);
  for(const id of ['depot-stores','depot-staff-access','depot-work-planning','depot-maintenance-release'])context(id,'depot-support',['materials','planning']);
}

export const DEPOT_READING_GUIDES = [{
  id:'understanding-a-maintenance-visit',
  title:'What happens during a maintenance visit?',
  summary:'Follow the relationship between vehicle condition, yard allocation, technical work, test evidence and the handover back to operations.',
  sections:[
    {heading:'A visit begins with a reason for work',text:'A maintenance visit may follow a scheduled interval, a reported fault or measurements collected in service. The reason for the work determines the required road, equipment, parts and time. Some tasks can be completed beside the vehicle; others require a component to be removed and sent to a workshop. Start with the whole depot to locate reception, inspection, maintenance, washing and stabling, then follow the areas needed for the task.'},
    {heading:'Location and readiness are different information',text:'Yard coordination connects vehicle identity, location, available destinations and assigned work. A train may wait in stabling for attention or occupy a maintenance road while work continues. Its location alone does not establish readiness for service. The Work handover view changes the destination, point arrangement and vehicle position, while a separate work boundary shows where protection is needed. The handover identifies the work and responsibility; signalling and work protection establish their own conditions.'},
    {heading:'Inspection produces evidence; diagnosis interprets it',text:'Roll-by sensors measure selected features as the train passes, such as wheel shape or visible vehicle equipment. Stationary examination adds close inspection, gauges and diagnostic reports. These observations help locate a problem: a symptom may originate in a sensor, wire, controller, actuator or mechanical part. Compare the moving train and fixed portal with the stationary train and diagnostic connection. Both feed evidence into the maintenance decision.'},
    {heading:'Running-gear work changes both access and support',text:'An inspection pit gives access below a vehicle while its wheels remain on the rails. Lifting jacks raise the body above the bogies; a bogie drop lowers a detached bogie while the body stays supported. A removed wheelset can then be measured, reprofiled or inspected for material defects. Reprofiling cuts material from the wheel to restore its running shape. Non-destructive inspection examines material condition without cutting the component apart. The brake bench shows another mechanism: a caliper bringing pads into contact with a stationary disc.'},
    {heading:'Doors, climate equipment and traction need their own work',text:'A door combines leaves, guides, a drive, locking and position sensing. Heating, ventilation and air-conditioning equipment combines airflow, heat exchange, refrigeration and controls. Traction equipment includes motors, mechanical drives and power electronics. Each needs checks suited to its function. Open the component covers to compare their parts, then use Sequence position to follow movement or diagnostic information. The converter bench is relevant to both rotary and linear-motor propulsion.'},
    {heading:'A completed repair needs the appropriate evidence',text:'Component fixtures, stationary vehicle checks and a test road make different responses observable. Required checks follow the work performed and the applicable maintenance instructions. The result needs the equipment identity, test conditions and maintenance context to be useful. Demonstrating one repaired function is one part of maintenance release; commissioning a new or modified vehicle has a wider scope.'},
    {heading:'The handover connects work with operation',text:'ORR distinguishes maintenance delivery and its release documentation from fleet-maintenance management’s return-to-operation role. The handover brings together the completed work, supporting checks and any remaining restrictions. Fleet allocation then connects the vehicle with an operational requirement, while railway control deals with its movement. Follow the links between the test fixture, work record, planning desk and departure road to see those responsibilities.'}
  ],
  sources:['O04','O07','O13','D02','D04','D05','D06','D07','D08','D09','D10','D11']
}];
