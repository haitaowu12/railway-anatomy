// Original educational content. Public source descriptions are paraphrased;
// the facility, equipment positions and work examples are authored schematics.
export const DEPOT_SOURCES = [
  {id:'D01',title:'Rail Maintenance & Storage Facilities Standard, MX-RMF-STD-001, revision 00 (2023)',publisher:'Metrolinx',url:'https://assets.metrolinx.com/image/upload/v1738255786/Documents/Engineering/Rail_maintenance_and_storage_facilities_standard.pdf',description:'Public operator reference covering layover, maintenance buildings, utilities, access and workshops.',scope:'GO Rail requirements are examples, not universal depot requirements. No source diagrams, dimensions or specifications are reproduced.'},
  {id:'D02',title:'Entities in Charge of Maintenance: maintenance functions',publisher:'Office of Rail and Road',url:'https://www.orr.gov.uk/guide-rogs/8-entities-charge-maintenance-ecm',description:'Distinguishes maintenance management, development, fleet management and delivery, including release documentation.',scope:'UK regulatory explanation used to distinguish functions; the illustration is not a compliance process for another jurisdiction.'},
  {id:'D03',title:'Bogie and wheelset workshop equipment',publisher:'Mechan',url:'https://www.mechan.co.uk/rail/bogie-wheelset-workshop/',description:'Public equipment catalogue links bogie handling, workshop stands and specialist machinery.',scope:'Equipment families and interfaces, without lifting capacities, operating sequences or maintenance limits.'},
  {id:'D04',title:'Measurement and monitoring for rail systems',publisher:'Siemens Mobility',url:'https://www.mobility.siemens.com/global/en/portfolio/digital-solutions-software/digital-services/measurement-monitoring.html',description:'Trackside measurement modules connect wheel, brake and vehicle observations with maintenance information.',scope:'Supplier examples of condition evidence; no inspection threshold, detection performance or automatic release is reproduced.'},
  {id:'D05',title:'Stationary and mobile test systems',publisher:'Knorr-Bremse',url:'https://rail.knorr-bremse.com/en/us/portfolio/products-and-systems/stationary-and-mobile-test-systems/',description:'Workshop and mobile fixtures support functional tests of brake, pneumatic and hydraulic equipment.',scope:'Equipment functions and testing interfaces. The animation is not a manufacturer test instruction or acceptance criterion.'},
  {id:'D06',title:'Door maintenance, spare parts and diagnostic tools',publisher:'IFE / Knorr-Bremse',url:'https://www.ife-doors.com/en/railservices/maintenance-and-spare-parts/',description:'Door maintenance includes on-train and off-train work, preventive and corrective tasks, and diagnostic support.',scope:'Public service overview; the authored sliding-door rig is not an IFE product drawing.'},
  {id:'D07',title:'Air-conditioning unit maintenance and repair',publisher:'ÖBB Technical Services',url:'https://ts.oebb.at/en/products-services/komponenteninstandhaltung/klimaaggregate',description:'Connects on-train inspection, component overhaul and final functional testing of HVAC equipment.',scope:'Operator service example. No refrigerant handling, electrical test settings or maintenance procedure is reproduced.'},
  {id:'D08',title:'Vehicle electronics maintenance and testing',publisher:'ÖBB Technical Services',url:'https://ts.oebb.at/en/products-services/komponenteninstandhaltung/fahrzeugelektronik',description:'Includes traction electronics, inverter controls, onboard supplies and vehicle control components.',scope:'Maintenance scope and interfaces; the converter bench and diagnostic trace are original schematics.'},
  {id:'D09',title:'Yard Management System: depot coordination and handovers',publisher:'Siemens Mobility',url:'https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/mainline/yard-and-depot-solutions/yard-management-system.html',description:'Distinguishes vehicle location, work completion, track occupancy, staff registration and documented handovers.',scope:'One supplier architecture. The atlas does not copy its screens, safety chain or route-control logic.'},
  {id:'D10',title:'Wheelset maintenance and non-destructive inspection',publisher:'ÖBB Technical Services',url:'https://ts.oebb.at/en/products-services/komponenteninstandhaltung/radsaetze',description:'Describes wheelset overhaul, reprofiling, ultrasonic inspection and recorded results.',scope:'Public capability overview; the probe fixture does not simulate defect detection or specify an inspection technique.'},
  {id:'D11',title:'Electric motor and transformer maintenance',publisher:'ÖBB Technical Services',url:'https://ts.oebb.at/en/products-services/komponenteninstandhaltung/elektromotoren-und-transofrmatoren',description:'Electrical-machine work includes initial evaluation, mechanical and winding repairs, and final testing.',scope:'Public workshop capability reference, without test voltages, winding details or repair limits.'},
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
  concept('depot-work-handover','Yard allocation and work handover','A vehicle location, work status and protected work road describe different things.',[
    'Depot coordination connects the vehicle identity and location with the destination, required work and people involved. Public yard-management examples also distinguish track occupancy, staff registration and documented handovers.',
    'Choose Work handover to see the vehicle on a different road, a separate work boundary and the coordination link. The points change with the chosen destination; the train remains stationary beside the work record.',
    'The diagram illustrates an agreed work location. It does not infer movement authority, electrical isolation or permission to start work from a screen message.'
  ],['D09','O11'],['depot-controller','depot-yard-points','depot-personnel-protection','depot-work-planning']),
  concept('depot-condition-monitoring','Condition measurement and inspection','Measurements help identify work; they do not repair the train.',[
    'Trackside systems can measure wheel profiles and other vehicle features as a train passes. Onboard observations and maintenance records provide other views of condition.',
    'In this example the train moves through a fixed sensor portal. The measurement plane appears only while the vehicle is within the portal, and a separate link leads to the review position.',
    'A measured feature, its vehicle identity and its history must be interpreted against the applicable maintenance requirements. No fault threshold or automatic acceptance decision is modelled.'
  ],['D04'],['depot-diagnostics','depot-wheelset-inspection','depot-work-planning']),
  concept('depot-diagnostics','Stationary examination and diagnosis','A reported symptom needs evidence that locates the work.',[
    'Diagnostic tools support fault investigation; physical examination and measurement remain different sources of evidence. The required method depends on the equipment and the maintenance task.',
    'Compare the stationary vehicle, wheel-profile gauge and diagnostic connection with the roll-by portal. The moving marker shows where information travels from vehicle to review desk; it does not run a diagnostic algorithm.',
    'Diagnosis can lead to adjustment, component repair, replacement or further investigation. A clear diagnostic display alone is not a maintenance release.'
  ],['D04','D06','D08'],['depot-condition-monitoring','depot-work-planning','depot-functional-checks']),
  concept('depot-brake-test','Brake component test bench','A fixture makes a brake component’s response observable.',[
    'Stationary and mobile test equipment serve different locations and test scopes. Workshop rigs can examine brake calipers, control modules and pneumatic equipment after maintenance or overhaul.',
    'The illustrated disc stays stationary while opposing pads move into contact and release. The supply connection, fixture, response indicator and removable cover are separate parts of the bench.',
    'Pad travel is enlarged for visibility. The cycle demonstrates the mechanical relationship, without specifying force, pressure, leakage, timing or an acceptance result.'
  ],['D05'],['brakes','brake-control','depot-compressed-air','depot-functional-checks']),
  concept('depot-door-service','Door mechanism maintenance and checks','The door leaves, drive and position indication can be examined together.',[
    'Door maintenance can take place on a vehicle or on removed equipment. Preventive work, corrective repair and diagnostic support address different needs.',
    'Open the rig’s operator cover to inspect the guide, drive and moving carriages. The leaves separate to clear the doorway and return; the small position indicator appears only at the closed end of travel.',
    'Closed position is one observation. This animation does not test obstruction detection, emergency release, locking integrity or the vehicle’s complete traction interlock.'
  ],['D06'],['doors','depot-diagnostics','depot-functional-checks']),
  concept('depot-hvac-service','HVAC inspection and component work','Air circulation, heat exchange and controls meet in one serviceable unit.',[
    'HVAC work ranges from on-train inspection and cleaning to component overhaul and functional testing. Air-side condition, refrigerant-circuit condition and electrical response are different checks.',
    'The cutaway bench separates the filter, heat exchanger, supply fan, refrigeration equipment and control connection. The moving marker follows the supply-air path; component separation exposes the filter and covers.',
    'The illustration shows relationships inside a unit. It does not show maintenance being performed on running machinery or prescribe a refrigerant or electrical procedure.'
  ],['D07'],['hvac','depot-ventilation','depot-functional-checks']),
  concept('depot-traction-service','Traction electronics workshop','A removed converter links power modules, control electronics and test equipment.',[
    'Vehicle-electronics maintenance includes traction and inverter electronics as well as onboard supplies and controllers. Electrical machines have their own inspection, mechanical repair and test needs.',
    'This bench focuses on a converter rather than a particular motor type. Open its case or separate the modules to inspect the capacitor bank, power stacks and control board; the marker follows an illustrative diagnostic response to the test cabinet.',
    'The same teaching fixture is compatible with either propulsion selection. The marker represents information, not live current, a discharge indication or permission to touch the equipment.'
  ],['D08','D11'],['traction-inverter','depot-energy-isolation','depot-diagnostics','depot-functional-checks']),
  concept('depot-wheelset-inspection','Wheelset inspection and test evidence','Profile measurement and non-destructive inspection answer different questions.',[
    'Wheelset work can include dimensional measurement, reprofiling, replacement and non-destructive inspection. Public workshop examples describe ultrasonic inspection of wheels and axles and documentation of the results.',
    'The Non-destructive inspection arrangement adds an axial probe and a recording connection. The wheelset turns on supporting rollers while the probe fixture stays aligned with the axle.',
    'The schematic reveals the equipment relationship, not an inspection method: it contains no simulated crack, defect echo, acceptance limit or claim that one probe examines every part of a wheelset.'
  ],['D10'],['depot-wheelset','depot-wheel-lathe','depot-bogie-workshop','depot-functional-checks']),
  concept('depot-functional-checks','Functional checks and recorded results','Completed work needs evidence of the required function.',[
    'Depots can provide measuring equipment, stationary test arrangements and separate test tracks. The checks required after a task depend on the work performed and the applicable maintenance instructions.',
    'Compare a stationary vehicle connected to a test fixture with a vehicle moving on its own test road. The measurement link and record position remain distinct from the railway control boundary.',
    'An observed response is evidence for review. It is not an automatic release, and a maintenance check should not be confused with the wider commissioning or acceptance of a new or modified vehicle.'
  ],['O04','D02'],['depot-test-track','depot-maintenance-release','depot-diagnostics','depot-brake-test']),
  concept('depot-test-track','Separate test road','Some functional observations require the vehicle to move.',[
    'Public maintenance facilities include test-track capability alongside stationary workshop equipment. A test road provides a different environment from a work stand or an occupied maintenance road.',
    'The illustrated vehicle travels between two ends of a separate fenced road. The other arrangement holds the vehicle still beside a measurement fixture; no test speed, stopping distance or braking performance is calculated.',
    'Test results, maintenance release, fleet allocation and authority for a later railway movement remain separate matters.'
  ],['O04','D02'],['depot-functional-checks','depot-maintenance-release','depot-dispatch']),
];

export const DEPOT_CONCEPT_UPDATES = [
  {id:'depot-layout',label:'Depot, yard and maintenance facility',summary:'A connected set of places for storing, servicing and maintaining the fleet.',details:['A depot combines railway connections with work locations and supporting services. Different sites provide different maintenance capabilities.','Explore the whole site, then enter the yard, maintenance hall, wheel shop, wash plant or support areas. The layout is an authored teaching composition.'],sources:['O04','O13'],related:['depot-network-boundary','depot-stabling','depot-maintenance-road','depot-bogie-workshop','depot-wash-plant','depot-work-planning']},
  {id:'depot-throat',label:'Depot throat',summary:'The shared approach connects the network with the yard roads.',details:['The throat concentrates the connections to depot destinations. It is where track layout and control interfaces meet.','Follow the visible rail branches to stabling, servicing and the workshop; the coloured path is an explanatory trace.'],sources:['O13'],related:['depot-network-boundary','depot-yard-points','depot-controller']},
  {id:'depot-controller',label:'Depot control and coordination',summary:'The local control position coordinates yard destinations and the network interface.',details:['The IRSE example distinguishes depot control from mainline control.','This workstation represents that local role. Work planning and maintenance release have their own information views.'],sources:['O13'],related:['depot-network-boundary','depot-shunt-signal','depot-work-planning','depot-personnel-protection']},
  {id:'depot-stabling',related:['depot-reception','depot-dispatch','depot-staff-access','depot-maintenance-release']},
  {id:'depot-lifting-jacks',details:['Synchronized jacks raise a supported vehicle body at compatible lifting points.','Select Vehicle lifting to see the body above two bogies at rail level. Select Bogie drop to compare a different mechanism, with one bogie below a supported body.'],related:['carbody','bogie','depot-bogie-drop','depot-material-handling']},
  {id:'depot-bogie-drop',details:['A drop table lowers a bogie below the supported body and provides a transfer route.','The model retains one attached bogie. Use the phase slider to lower the separated bogie into the channel and transfer it sideways while the body stays on its supports.'],sources:['O07'],related:['bogie','depot-lifting-jacks','depot-bogie-workshop']},
  {id:'depot-wheel-lathe',related:['depot-wheelset','depot-wheelset-inspection','bogie','running-rail','depot-material-handling']},
  {id:'depot-stores',label:'Spares store and materials',details:['The store holds components and supplies for planned or corrective work.','Racks, a receiving pallet and a transfer aisle connect the store with the workshop. Work information appears separately at the planning desk.'],related:['depot-work-planning','depot-material-handling','depot-bogie-workshop']},
  {id:'depot-personnel-protection',details:['A published protection arrangement links personnel registration, local panels, movement indications and protective devices. Equipment can have additional interlocks.','The illustration distinguishes the physical work boundary from displayed information. It does not calculate or grant access permission.'],sources:['O11'],related:['depot-shunt-signal','depot-controller','depot-energy-isolation','depot-staff-access']},
  {id:'depot-wash-plant',related:['depot-wash-gantry','depot-wash-pump','depot-water-recovery']},
  {id:'depot-water-recovery',related:['depot-wash-plant','depot-wash-pump','depot-drainage']},
];

const variant=(id,label,title,description,nodes,sources,component,animation)=>({id,label,title,description,nodes,sources,...component?{component}:{},...animation?{animation}:{}});
const view=(label,title,component,level,note,variants)=>({label,title,component,level,note,variants});
const motion=(label,steps)=>({label,steps:steps.map(([at,label,description])=>({at,label,description}))});
export const DEPOT_VIEWS = {
  'depot-overview':view('Whole depot','The facilities that return a train to service','depot-layout','Facility','Original depot schematic. Select a place to see its equipment and links.',[
    variant('layout','Facility layout','Follow the connections across the depot','The site joins a network boundary, reception, stabling, maintenance, washing and support buildings. Select each destination to inspect its role.',['Network','Reception','Work or stabling','Departure'],['O04','O13'],'depot-layout'),
    variant('night','Stabling','Location and availability answer different questions','The stabling emphasis marks where trains wait. It does not mark every stored train as ready for service.',['Berth','Vehicle condition','Work record','Allocation'],['O04','D02'],'depot-stabling'),
  ]),
  'depot-yard':view('Arrival & yard','Connect the railway to the depot roads','depot-reception','Area','Rail paths are schematic. The highlighted trace is a destination, not a movement authority.',[
    variant('reception','Arrival','From network boundary to reception','The arrival illustration shows the train before its allocation to a depot destination. Inspect the boundary, points and local control position.',['Mainline','Boundary','Reception','Yard roads'],['O13'],'depot-reception'),
    variant('handover','Work handover','Allocate a road and hand over the work','A different vehicle occupies the work road, the selected points change, and a coordination link joins the work record to depot control. The work boundary is a separate physical element.',['Vehicle location','Destination','Work boundary','Handover'],['D09','O11'],'depot-work-handover'),
    variant('dispatch','Departure','From stabling back to the railway','The departure train is shown on a different road, with the path traced toward the boundary. Maintenance release and movement permission remain separate.',['Stabling','Allocation','Departure','Boundary'],['O13','D02'],'depot-dispatch'),
  ]),
  'depot-condition':view('Inspection & diagnosis','Find the work before choosing the repair','depot-condition-monitoring','Activity','Original examples of condition evidence. Measurements and diagnostic information are inputs to a maintenance decision.',[
    variant('roll-by','Roll-by inspection','Fixed sensors observe a passing vehicle','The portal remains fixed while the train passes; its measurement plane appears only during the passage. The data link leads to review rather than an automatic release.',['Vehicle identity','Measurement','Condition history','Work decision'],['D04'],'depot-condition-monitoring',motion('Illustrated passage through fixed sensors',[
      [0,'Approach','The vehicle is before the fixed measurement portal.'],[.32,'Enter measurement zone','The vehicle overlaps the sensor plane; the portal stays fixed.'],[.5,'Pass the sensors','Different parts of the vehicle pass the same measuring position.'],[.7,'Clear the portal','The vehicle has cleared this measurement position.'],[1,'Review the record','The information trace reaches the review position. Playback restarts the illustrated passage.']
    ])),
    variant('stationary','Stationary diagnosis','Combine physical examination and diagnostic evidence','The train remains still beside a wheel gauge and a diagnostic connection. The trace locates the information path, without executing a fault-finding procedure.',['Symptom','Examination','Diagnostic evidence','Work package'],['D04','D06','D08'],'depot-diagnostics',motion('Vehicle-to-diagnosis information path',[
      [0,'Vehicle evidence','The marker starts at the vehicle connection.'],[.5,'Diagnostic link','The marker follows the illustrated connection while the vehicle stays still.'],[1,'Review evidence','The marker reaches the diagnostic position; no acceptance result is generated.']
    ])),
  ]),
  'depot-components':view('Component maintenance','Follow the work inside a removed subsystem','depot-brake-test','Activity','These fixtures explain equipment relationships. The cycles are illustrative, with no maintenance sequence, test setting or pass/fail result.',[
    variant('brakes','Brake bench','Observe application and release at a test fixture','Opposing pads approach a stationary disc and retract. The test connection and qualitative response indicator stay attached to the fixture.',['Supply','Actuator','Pad contact','Recorded response'],['D05'],'depot-brake-test',motion('Illustrative brake application and release',[
      [0,'Released','A visible gap separates both pads from the disc.'],[.25,'Approach','The pads move inward; travel is enlarged for clarity.'],[.5,'Contact','Both pads meet the stationary disc without crossing it.'],[.75,'Release','The pads move away from the disc.'],[1,'Released again','The original gap is restored; this is not a brake acceptance result.']
    ])),
    variant('doors','Door rig','Inspect the drive, leaves and position feedback','Opening the operator cover exposes the guide and drive. The leaves open and close while a separate indicator marks closed position.',['Drive','Carriages','Doorway','Position observation'],['D06'],'depot-door-service',motion('Illustrative sliding-door cycle',[
      [0,'Closed position','The leaves meet and the small position indicator is visible.'],[.25,'Opening','The leaves and their carriages move apart.'],[.5,'Clear doorway','Both leaves clear the opening.'],[.75,'Closing','The leaves return toward the centre.'],[1,'Closed position restored','The indicator shows position only; it does not certify the door system or permit movement.']
    ])),
    variant('hvac','HVAC unit','Separate the air path from the service tasks','Open the unit to inspect the filter, heat exchanger, fan and separate refrigeration equipment. The airflow trace describes operation; it does not show work on running equipment.',['Filter','Heat exchange','Fan','Supply air'],['D07'],'depot-hvac-service',motion('Supply-air path through the cutaway unit',[
      [0,'Air entry','The marker is at the inlet beside the filter.'],[.4,'Heat-exchange section','The marker follows the air passage toward the heat exchanger.'],[.7,'Fan section','The supply fan turns within its fixed housing.'],[1,'Supply outlet','The marker leaves the unit through the supply duct.']
    ])),
    variant('traction','Traction electronics','Inspect a converter and its diagnostic interface','The removed converter contains capacitors, power modules and a control board. The test connection carries an illustrative response to a separate cabinet.',['Control board','Power modules','Test connection','Response record'],['D08','D11'],'depot-traction-service',motion('Illustrative converter diagnostic response',[
      [0,'Equipment connection','The marker starts beside the converter control connection.'],[.5,'Test harness','The marker follows the fixture connection; it represents information, not live power.'],[1,'Test equipment','The marker reaches the cabinet, without creating a pass/fail or safe-to-touch indication.']
    ])),
  ]),
  'depot-testing':view('Functional checks','Distinguish test evidence from return to operation','depot-functional-checks','Activity','Stationary and moving test arrangements are different examples. Their animations do not prescribe commissioning, release or movement procedures.',[
    variant('stationary','Stationary checks','Observe a function with the vehicle held in place','The vehicle is connected to a measurement fixture. A separate record position shows where the evidence is reviewed.',['Vehicle function','Measurement fixture','Result','Review'],['O04','D02'],'depot-functional-checks',motion('Illustrative measurement-to-record connection',[
      [0,'Vehicle connection','The marker starts at the stationary vehicle.'],[.5,'Measurement link','The marker follows the test connection while the train stays in place.'],[1,'Evidence for review','The marker reaches the fixture; no maintenance release is issued by the model.']
    ])),
    variant('movement','Test road','Use a separate place for observations during movement','The train moves on its own fenced road, with a test-record position beside it. The motion does not calculate speed, braking distance or vehicle acceptance.',['Test road','Vehicle movement','Observation','Recorded result'],['O04','D02'],'depot-test-track',motion('Illustrative movement on a separate test road',[
      [0,'Near end','The vehicle is at one end of the illustrated movement range.'],[.25,'Along the test road','The vehicle moves through the middle of its separate road.'],[.5,'Far end','The vehicle reaches the other end of the illustrated range.'],[.75,'Return movement','The vehicle returns through the middle of the road.'],[1,'Cycle complete','The illustration returns to its starting position; it is not a test procedure.']
    ])),
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
    variant('ndt','Non-destructive inspection','Inspect material condition as well as dimensions','A supported wheelset, axial probe and recording connection illustrate another inspection capability. The model generates no defect indications or acceptance results.',['Wheelset identity','Probe fixture','Inspection evidence','Record'],['D10'],'depot-wheelset-inspection',motion('Wheelset and fixed inspection fixture',[
      [0,'Wheelset on rollers','The axle is aligned with the fixed probe fixture.'],[.5,'Wheelset turns','The wheelset turns while the probe remains on its axis; supporting rollers turn in the opposite sense.'],[1,'One illustrated turn','The wheelset returns to its initial orientation and the record trace reaches the display.']
    ])),
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
    {heading:'A visit begins with a reason for work',text:'A depot combines railway routes with places to inspect, service, repair and test vehicles. A visit may respond to a scheduled interval, a reported fault or condition evidence collected in service. Those starting points do not necessarily require the same road, equipment or duration. Public maintenance facilities combine light servicing with selected overhaul capabilities; other work may go to a specialist component workshop. The useful question is what needs to be established or restored, and what resources the task requires. The depot overview shows the physical destinations; the activity views explain the work that connects them.'},
    {heading:'Location and readiness are different information',text:'Yard coordination needs to know which vehicle is present, where it is, what destination is available and what work has been assigned. A train can occupy a stabling road while awaiting attention, or be on a maintenance road with work in progress. A location marker therefore says little about readiness by itself. Public yard-management systems bring together occupancy, work status and communication between the people involved. In the yard comparison, changing the destination also changes the point arrangement, vehicle position and work boundary. The highlighted connections explain coordination; they do not prove a route or grant movement authority.'},
    {heading:'Inspection produces evidence; diagnosis interprets it',text:'A roll-by measurement system observes selected features as a vehicle passes fixed sensors. The measurements may concern wheel profiles, brakes or other visible equipment. Stationary examination can add close inspection, a physical gauge and diagnostic information from the vehicle. These are complementary kinds of evidence. A symptom may belong to a sensor, wiring, controller, actuator or the mechanical equipment itself, so an indication does not automatically identify a replacement part. Compare the two assessment arrangements: one moves the train through a measuring position; the other holds it still beside tools and a diagnostic connection. The model produces no actual defect or acceptance decision.'},
    {heading:'Running-gear work changes both access and support',text:'An inspection pit provides access beneath a vehicle without removing its running gear. Vehicle lifting and a bogie drop change the support arrangement in different ways; compare the body, attached bogies and fixed supports before following their motion. Once removed, a wheelset can be measured, reprofiled or examined for material condition using an appropriate inspection method. Dimensional measurement and non-destructive inspection answer different questions. The wheelset study adds a probe fixture and a recorded-information connection, while the brake bench shows a caliper applying to a stationary disc. Neither animation supplies a machining limit, inspection technique or brake test instruction.'},
    {heading:'Doors, climate equipment and traction need their own work',text:'Maintenance extends beyond the wheels and bogies. A door has moving leaves, a drive, guides and observations of its position; on-train servicing and off-train repair address different work scopes. HVAC combines air circulation, heat exchange, refrigeration equipment and controls, with functional testing after relevant work. Traction work can involve electrical machines, bearings and windings, or converter modules and control electronics. The component view uses a converter bench so the equipment study does not depend on which propulsion arrangement is selected elsewhere. Opening covers and separating modules exposes the equipment relationships, while the phase control explains motion or information flow.'},
    {heading:'A completed repair needs the appropriate evidence',text:'A component test fixture, a stationary vehicle check and a test road offer different ways to observe a function. The required checks follow the task and the applicable instructions; the atlas does not make every vehicle visit follow one sequence. A recorded response must be assessed in its proper context, including the equipment identity and the work performed. Commissioning or accepting a new or modified vehicle is a wider question than demonstrating one repaired function. Use the functional-check comparison to distinguish the physical arrangements, without reading its movement as a speed profile, braking assessment or complete commissioning programme.'},
    {heading:'The handover connects work with operation',text:'ORR’s public explanation distinguishes maintenance delivery and its release documentation from fleet-maintenance management’s return-to-operation role. That is a useful boundary for this teaching model, even where another jurisdiction uses different terms. The finished task, the supporting evidence and any relevant restrictions belong in the handover. Fleet allocation then connects the vehicle with an operational need, while railway control deals with the movement itself. Follow the links from a test fixture to the maintenance record, work-planning desk and departure road to see these different responsibilities. None of the atlas’s animations issues a release or authorizes a railway movement.'}
  ],
  sources:['O04','O07','O13','D02','D04','D05','D06','D07','D08','D09','D10','D11']
}];
