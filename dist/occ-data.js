// Original public-source teaching material. The rooms, role allocation, equipment
// counts and interface examples are authored schematics, not an operator design.
export const OCC_SOURCES = [
  {id:'OC01',title:'ROCC and Role: Implementation of operational control centres for resilience — ASPECT 2019 abstract',publisher:'IRSE Netherlands',url:'https://www.irse.nl/post/aspect-2019-conference-day-2',description:'Read the Design Resilience section, “ROCC and Role”, for the relationship between operating responsibilities, people, processes and control-centre resilience.',scope:'Public conference abstract only. It informs the functional overview; no source layout, staffing or system architecture is reproduced.'},
  {id:'OC02',title:'Control room design',publisher:'Health and Safety Executive',url:'https://www.hse.gov.uk/comah/sragtech/techmeascontrol.htm',description:'Read the human-interface, control and alarm sections for task analysis, visible action feedback, readable displays and the effect of the room environment.',scope:'Industrial human-factors guidance, not a railway operating rule. Numerical limits and process-industry design prescriptions are not adopted.'},
  {id:'OC03',title:'Better alarm handling — Chemical Information Sheet 6',publisher:'Health and Safety Executive',url:'https://www.hse.gov.uk/pubns/chis6.pdf',description:'Read the discussion of nuisance alarms, standing alarms and operator understanding. It helps distinguish information volume from useful warning.',scope:'General alarm-management principles from process industry. No alarm-rate target, priority scheme or railway response sequence is implied.'},
  {id:'OC04',title:'Shift handover',publisher:'Health and Safety Executive',url:'https://www.hse.gov.uk/humanfactors/topics/shift-handover.htm',description:'Read the preparation, two-way exchange and incoming cross-check sections, then compare them with the illustrated outstanding-items record.',scope:'General communication guidance. This is not a railway transfer-of-control procedure or a prescribed form.'},
  {id:'OC05',title:'Incident and Crisis Management for rail operations',publisher:'Frequentis',url:'https://www.frequentis.com/en/public-transport/incident-and-crisis-management',description:'Read the workflow and mobile collaboration sections for links between control-room coordination, field reports and a shared incident record.',scope:'Supplier example of incident-management functions. Its performance claims, product workflow and automated response features are not reproduced.'},
  {id:'OC06',title:'LRG 29.0 Guidance for Human Factors in Operations Control Centres — public synopsis',publisher:'Light Rail Safety and Standards Board',url:'https://portal.lrssb.org/safety-hub/resources/83',description:'The public synopsis identifies ergonomics, workload, team dynamics and HMI as connected design concerns. The full guidance is offered behind a human-verification step.',scope:'Only the publicly accessible synopsis was reviewed; no claim relies on the gated document or treats its contents as implemented.'},
  {id:'OC07',title:'TMS and further automation in control centres — IRSE lecture',publisher:'Institution of Railway Signal Engineers',url:'https://vimeo.com/508536363',description:'Extended viewing on control-centre automation and the changing tasks of signallers, controllers and dispatchers.',scope:'Public lecture listing used as further reading, not evidence of a watched transcript or a universal automation architecture.'},
];

const C=(id,label,summary,details,sources,related,caveat='Original functional schematic. Equipment, responsibility and permitted actions depend on the railway and its operating rules.')=>({id,label,summary,details,sources,related,caveat});
export const OCC_CONCEPTS = [
  C('occ-shared-display','Shared operational display','A common overview helps people discuss the same railway situation.',[
    'A control centre combines several roles and information needs. A shared overview is one possible means of supporting coordination.',
    'The wall in this example combines a route strip, power overview and event area. Select a role to continue into the detailed workstation or system interface.',
    'The wall is a presentation surface. Its size, colour or prominence does not grant control authority or establish that displayed information is current.'
  ],['OC01','OC02'],['occ-task-display','operations-traffic-supervision','occ-information-quality']),
  C('occ-incident-coordination','Incident coordination','A shared record connects responsibilities, evidence and outstanding actions.',[
    'Rail incident-management products connect control-room teams with field reports and structured records.',
    'The coordination table groups the report, assessment and communications paths. The coordinated alternative adds a record and separate outgoing links while retaining the reported condition.',
    'The illustration has no automatic emergency response. It does not prescribe which role acts first or make one subsystem’s acknowledgement a command to another.'
  ],['OC05'],['occ-alarm-queue','operations-radio-dispatch','occ-passenger-communications','operations-event-recording']),
  C('occ-duty-handover','Duty handover and outstanding items','Continuity requires an exchange of information, not just a change of seat.',[
    'HSE describes preparation, two-way exchange and incoming cross-checking of task-relevant information.',
    'The handover alternative shows two separate record surfaces joined by an exchange path. The outstanding-item marker remains visible on both sides.',
    'The visual does not transfer a control area or clear an event. A railway’s actual responsibilities, permissions and handover arrangements need their own defined process.'
  ],['OC04'],['occ-task-display','occ-incident-coordination','operations-event-recording']),
  C('occ-supervisory-request','Supervisory request path','An operator request passes through an application to the relevant field system.',[
    'A published traffic-management example sends route-setting requests to interlockings. Power and station supervision use their own application and field interfaces.',
    'In the interface view, the upper path runs from the workstation through the application and gateway to the field equipment. The phase control traces the message rather than the movement of a train, breaker or fan.',
    'Receipt of a request is not proof that the requested physical state has been achieved. The model leaves the field equipment unchanged throughout this information exchange.'
  ],['O01','F17','O02'],['occ-field-indication','occ-field-gateway','operations-signalling-workstation']),
  C('occ-field-indication','Returned field indication','The display needs evidence coming back from the supervised system.',[
    'Published traffic supervision uses indications from signalling and train-location systems; power supervision collects substation state.',
    'The lower return path is geometrically separate from the outgoing request. Its moving square reaches the workstation only in the feedback portion of the teaching cycle.',
    'This is an exchange of information, not proof of a particular safety function. The real meaning of an indication depends on its source, validity and interface definition.'
  ],['O01','F17'],['occ-supervisory-request','occ-information-quality','occ-task-display']),
  C('occ-information-quality','Information availability and quality','A visible screen and a trustworthy indication are different questions.',[
    'Control-room guidance calls for visible feedback about an action, including when that feedback is delayed.',
    'The crossed display in Display unavailable makes the missing presentation explicit. The normal and alternate-service arrangements retain distinct source and return paths.',
    'A lost display does not establish that the field device has failed, that train protection has stopped, or that a last-known indication remains valid.'
  ],['OC02'],['occ-field-indication','occ-task-display','occ-alternate-service']),
  C('occ-alarm-queue','Alarm and event presentation','The operator needs to identify the condition and its context.',[
    'Alarm-management guidance warns that nuisance and standing alarms can obscure information; a status indication is not automatically an alarm.',
    'The enlarged queue shows a condition marker beside a separate acknowledgement marker. A camera view, field call and incident record provide different kinds of context around it.',
    'The short queue is an explanatory selection, not an event-rate simulation, a priority scheme or a complete alarm philosophy.'
  ],['OC03'],['occ-alarm-acknowledgement','occ-cctv-assessment','occ-incident-coordination']),
  C('occ-alarm-acknowledgement','Acknowledgement state','Acknowledgement records attention to a presented event.',[
    'The demonstration separates three concepts: a reported condition, its acknowledgement and coordinated follow-up.',
    'Select Acknowledged: a small acknowledgement panel appears, while the condition symbol and field marker remain. Select Coordinated to add communications and a shared record.',
    'No alternative removes the condition. Acknowledgement alone is not evidence of repair, reset, incident closure or restored service.'
  ],['OC03','OC05'],['occ-alarm-queue','occ-incident-coordination','occ-field-indication']),
  C('occ-cctv-assessment','Video assessment','An image is one source of context for a reported situation.',[
    'Station management can bring CCTV, communications and supervisory systems into a coordinated operator interface.',
    'The camera, its video tile and the information link remain separately selectable. The tile depicts a schematic platform rather than real surveillance imagery.',
    'The camera view does not prove electrical isolation, track clearance or a safe route. Its coverage and availability are separate from other indications.'
  ],['O02'],['station-cctv','occ-alarm-queue','occ-information-quality']),
  C('occ-passenger-communications','Passenger information and public address','Information for passengers is a distinct output from operational instructions.',[
    'Public station-management examples integrate passenger information and public-address functions.',
    'A display board and loudspeaker share the passenger-information branch. Radio and field coordination use a separate branch, so the destinations remain legible.',
    'No announcement text, automatic trigger or emergency priority is prescribed. The illustration does not make a passenger display an authority for train movement.'
  ],['O02','F04'],['station-pa','station-pis','operations-radio-dispatch','occ-incident-coordination']),
  C('occ-access-supervision','Access and security supervision','Access events belong to a defined security context.',[
    'Public integrated station systems can include physical-security information alongside other station functions.',
    'The door contact and reader form a separate small installation, with their event path going to the incident workspace.',
    'Displayed access status is not permission to enter track, electrical or maintenance work areas. Those boundaries need their own controls.'
  ],['O02','F06'],['access-controller','occ-alarm-queue','occ-incident-coordination']),
  C('occ-application-service','Supervisory application service','Applications interpret and organize information between the desk and field interfaces.',[
    'A public rail-power control example uses a client–server arrangement with archiving and supervisory functions.',
    'The equipment view separates the desk, application unit, network, gateway and recorder. The two application positions illustrate an active path and an alternative path.',
    'These are logical roles represented as equipment. Rack count, software partitioning, redundancy design and deployment location are not specified.'
  ],['F17'],['occ-supervisory-network','occ-field-gateway','occ-alternate-service']),
  C('occ-field-gateway','Field communications interface','The control-centre application meets a different subsystem at an explicit boundary.',[
    'Rail power-control products distinguish central supervision from substation controllers with local control, protection and communications functions.',
    'The gateway stands between the application and the illustrated field cabinet. Traffic, power and station alternatives replace the field equipment and both message endpoints.',
    'The box is an interface marker, not a protocol specification. It does not merge local protection, interlocking logic or equipment control into the desk.'
  ],['F17','O01','O02'],['occ-supervisory-request','occ-field-indication','interlocking','power-scada']),
  C('occ-supervisory-network','Control-centre data network','Desks, applications and field communications depend on data connections.',[
    'Railway communications products provide network infrastructure for connected operational systems.',
    'The teaching view draws the desk-to-service route separately from the gateway-to-field route. A visible connection represents a dependency rather than a guaranteed available service.',
    'The drawing is not a cybersecurity zone plan, resilience topology or latency model. Network, application and display availability are examined separately.'
  ],['F20'],['fiber-backbone','network-switch','occ-application-service','occ-field-gateway']),
  C('occ-uninterruptible-power','Equipment power continuity','Operational IT also depends on electrical supply.',[
    'Public railway-building examples use uninterruptible power supplies for selected building and information-system loads.',
    'The UPS and its supply path sit below the information network. This keeps the power dependency physically distinct from the data flow.',
    'No battery duration, load capacity or surviving function is assigned. A UPS does not by itself provide application redundancy or an alternative control location.'
  ],['F19'],['station-ups','occ-application-service','occ-supervisory-network']),
  C('occ-alternate-service','Alternative supervisory service path','Resilience must be understood at the level of the function being retained.',[
    'Public rail-control products offer redundant service arrangements; their exact implementation is installation-specific.',
    'In Alternate service, the first application path is visibly disconnected and the second is connected to the same desk and field interface. This is a selected comparison, not a simulated automatic switchover.',
    'The model makes no claim about recovery time, seamless control, data synchronization or authority transfer. A lost desk remains a different failure from a lost application path.'
  ],['F17','OC01'],['occ-information-quality','occ-application-service','occ-duty-handover']),
  C('occ-record-timeline','Event and communications records','A record helps reconstruct what was reported, communicated and observed.',[
    'Railway communications products include recording for later review; incident platforms also hold structured reports.',
    'The recorder’s separate timeline contains event, acknowledgement and communication markers. They are positioned as teaching categories, without real timestamps or attributed operator actions.',
    'The animation does not claim that every system shares a clock or that recorded messages prove physical state. Record origin and context still matter.'
  ],['O14','OC05'],['operations-event-recording','occ-alarm-queue','occ-duty-handover']),
  C('occ-task-display','Task-focused operator display','An operator needs detail appropriate to the current task.',[
    'Human-factors guidance starts from the work being performed, and considers displays, workload and the surrounding environment together.',
    'The enlarged desk separates a task view, an event strip and communication controls. Task detail emphasizes one local diagram; Shared overview adds a wider wall view without removing the desk.',
    'This is a functional arrangement rather than an ergonomic dimensioning study. Screen counts and desk geometry are illustrative.'
  ],['OC02','OC06'],['occ-shared-display','occ-workstation-input','occ-information-quality']),
  C('occ-workstation-input','Workstation input and communications','The physical desk supports several kinds of interaction.',[
    'Input arrangements and feedback need to support the operator’s task rather than simply fit more controls onto a surface.',
    'The keyboard, pointing surface, handset and push-to-talk unit are separate objects beneath the displays. Select and separate the assembly to inspect how these differ from the application equipment.',
    'No button sequence, permission mechanism or universal emergency control is implemented.'
  ],['OC02'],['occ-task-display','operations-radio-dispatch','occ-supervisory-request']),
  C('occ-workplace-environment','Room environment and sightlines','The workplace affects how information is seen, heard and shared.',[
    'LRSSB’s public OCC guidance synopsis treats ergonomics, workload, teams and HMI as connected topics.',
    'An overhead light bar, acoustic panels and a clear view towards the shared display make the workplace visible as an assembly around the desk.',
    'There is no claim that this illustrative room meets a lighting, acoustic, reach or sightline standard. Those questions require actual users, tasks and measured design evidence.'
  ],['OC06','OC02'],['occ-task-display','occ-shared-display','occ-duty-handover']),
];

export const OCC_CONCEPT_UPDATES = [
  {id:'operations-centre',label:'Operations control centre',summary:'People, applications and field interfaces work together to supervise the railway.',details:['An OCC brings operational responsibilities together; its functions extend beyond the physical desks and video wall. Public IRSE material considers both the railway’s resilience and the ability of the control centre itself to keep performing.','Explore the room, then follow a request and returned indication, examine an incident workspace, enter the systems room or inspect the operator’s workplace. Each view separates the equipment from the responsibility it supports.','The layout and role groupings are original teaching choices. They do not describe a specific railway, staffing model or emergency procedure.'],sources:['OC01','OC06'],related:['operations-traffic-supervision','operations-power-control','operations-station-supervision','occ-incident-coordination','operations-equipment-room','occ-task-display']},
  {id:'operations-traffic-supervision',label:'Traffic and service supervision',summary:'The service picture links the operating plan with reported train progress.',details:['Traffic-management examples combine train tracking, timetable information and dispatching functions.','This role’s desk shows a route diagram beside a service strip. Its input is the available operational picture; its output can include a revised plan or a request through the relevant control interface.','The simplified display does not calculate capacity, generate a safe route or replace the signalling system.'],sources:['O01'],related:['ats','operations-signalling-workstation','occ-shared-display','occ-supervisory-request']},
  {id:'operations-signalling-workstation',label:'Signalling control interface',summary:'The control interface exchanges requests and indications with signalling.',details:['In a published OCS example, route setting is requested from the interlocking, while train tracking uses received signalling or train-position information.','Open Requests & indications and choose Traffic to trace the outgoing request and the separately drawn return path. The field-side point and signal remain stationary during the message animation.','The workstation is not depicted as the interlocking, and a message arriving is not depicted as permission for a train to move.'],sources:['O01','S10'],related:['interlocking','ats','occ-supervisory-request','occ-field-indication']},
  {id:'operations-power-control',label:'Traction-power supervision',summary:'Power SCADA presents the electrical network and interfaces with substation systems.',details:['A rail-power supervision example includes monitoring, control, archiving and evaluation; its local substation controller has separate control, protection and communications functions.','Choose Power in Requests & indications to replace the signalling plant with a substation cabinet and breaker symbol. Follow the command path and returned indication as separate information flows.','This teaching view does not switch real energy, prove isolation, issue an electrical permit or simulate protection response.'],sources:['F17'],related:['power-scada','breaker','occ-field-gateway','occ-field-indication']},
  {id:'operations-station-supervision',label:'Station and facility supervision',summary:'Station information combines building services, security and passenger systems.',details:['Public station-management products bring SCADA, CCTV, public address and passenger information into an operator interface, with integration options for other systems.','Choose Station in Requests & indications to inspect a local controller and fan. The incident workspace separately exposes video, passenger communications and access information.','Integration does not mean that every system shares one controller, response priority or safety function.'],sources:['O02'],related:['station-scada','occ-cctv-assessment','occ-passenger-communications','occ-access-supervision']},
  {id:'operations-radio-dispatch',label:'Operational communications',summary:'Operational voice connects the control centre with people working on the railway.',details:['Railway communications products support dispatcher links to field users and include recording functions.','The desk contains a handset and communication panel. A separate illustrated path connects it to a field radio, while passenger information has its own destination.','The visual shows a relationship, not an approved phraseology, channel plan or transfer of operating authority.'],sources:['O14'],related:['station-radio','occ-incident-coordination','occ-passenger-communications','occ-record-timeline']},
  {id:'operations-event-recording',label:'Events and communications recording',summary:'Review needs records with their source and context.',details:['Railway voice recording and incident-reporting products support later examination of communications and operational events.','The recorder sits in the equipment room, with an enlarged timeline in Systems & availability. Distinct markers represent reported information, operator acknowledgement and communications.','The order shown is a teaching arrangement. It does not assert synchronized clocks, a legally complete record or proof that a commanded action occurred.'],sources:['O14','OC05'],related:['occ-record-timeline','occ-duty-handover','occ-alarm-queue']},
  {id:'operations-equipment-room',label:'Systems and equipment room',summary:'The workstation depends on applications, networks, field interfaces and power.',details:['The physical desk and the infrastructure serving it are different assemblies. Public control-system examples use clients, services and field communications, with optional redundancy.','Enter Systems & availability to inspect the full dependency path. Compare a lost display with a selected alternative application path; the field plant remains present in both cases.','Equipment quantities and positions are authored for legibility. No recovery performance or continuity of a safety function is implied.'],sources:['F17','F19','F20'],related:['occ-application-service','occ-field-gateway','occ-supervisory-network','occ-uninterruptible-power','occ-alternate-service']},
];

const variant=(id,label,title,description,nodes,sources,component)=>({id,label,title,description,nodes,sources,component});
const view=(label,title,component,level,note,variants,animation)=>({label,title,component,level,note,variants,...animation?{animation}:{}});
export const OCC_VIEW_DATA = {
  'operations-centre':view('Control room','Connect the roles with the railway','operations-centre','Facility','Original room composition. Roles, desks and applications are different layers; none of the illustrated counts is a staffing requirement.',[
    variant('service','Service supervision','Read the operational picture across roles','The route, power and station desks face a common overview. Open a role’s focused view to inspect what it receives and what it can pass onwards.',['Service plan','Reported state','Role interface','Shared overview'],['OC01','O01'],'operations-traffic-supervision'),
    variant('incident','Incident coordination','Connect evidence, communications and responsibilities','A coordination table and separate links to the station, radio and recording positions appear. They explain collaboration without prescribing an automatic response.',['Report','Assessment','Communications','Record'],['OC05'],'occ-incident-coordination'),
    variant('handover','Duty handover','Carry outstanding information between duties','Two record surfaces and an exchange link appear at the coordination desk. The visible outstanding-item marker remains on both records.',['Prepare','Exchange','Cross-check','Outstanding items'],['OC04'],'occ-duty-handover'),
  ]),
  'occ-supervision':view('Requests & indications','Follow the interface in both directions','occ-supervisory-request','Subsystem','The animated tokens are messages. Field equipment does not move and the sequence does not grant authority or prove a safety function.',[
    variant('traffic','Traffic','A route request meets a signalling interface','The desk and supervisory application connect to an interlocking-side cabinet, point assembly and signal. The lower path brings an indication back separately.',['Workstation','Supervision','Field interface','Indication'],['O01','S10'],'operations-signalling-workstation'),
    variant('power','Power','A supervisory request meets substation control','The field equipment changes to a substation cabinet and breaker assembly. The information return is distinct from the request and from the electrical circuit.',['Power desk','SCADA','Local controller','Indication'],['F17'],'operations-power-control'),
    variant('station','Station','A supervisory request meets a local station controller','The field equipment changes to a fan and local control cabinet. The message trace does not start the fan or select an emergency operating mode.',['Station desk','Application','Local controller','Indication'],['O02'],'operations-station-supervision'),
  ],{label:'Illustrative information exchange',steps:[{at:0,label:'Request',description:'A request leaves the workstation. This is information, not evidence of field action.'},{at:.34,label:'Received at interface',description:'The outgoing token reaches the field interface. Receipt remains separate from the returned state.'},{at:.68,label:'Returned indication',description:'A different token travels back on the separate indication path.'},{at:1,label:'Display updated',description:'The return reaches the display. Its meaning still depends on the source and validity of the indication.'}]}),
  'occ-incident':view('Events & coordination','Distinguish a report, acknowledgement and response','occ-alarm-queue','Subsystem','Alternatives retain the same reported condition. They add attention and coordination; none depicts incident resolution.',[
    variant('reported','Reported','Make the source and context visible','The event queue, camera assessment, field communications and access installation offer different sources of information. A condition marker remains at the field end.',['Condition','Source','Presentation','Context'],['OC03','O02'],'occ-alarm-queue'),
    variant('acknowledged','Acknowledged','Record attention without clearing the condition','An acknowledgement panel appears beside the event queue. The condition marker and equipment remain unchanged, so acknowledgement cannot be mistaken for repair.',['Condition','Attention','Acknowledgement','Still present'],['OC03'],'occ-alarm-acknowledgement'),
    variant('coordinated','Coordinated','Connect a shared record with separate recipients','A coordination record and links to field radio and passenger information are added. They illustrate related communications without imposing a priority or a response procedure.',['Evidence','Coordination','Recipients','Record'],['OC05','O14'],'occ-incident-coordination'),
  ],{label:'Illustrative report and communication paths',steps:[{at:0,label:'Field information',description:'Follow a report from the field source towards the displayed event.'},{at:.34,label:'Operator context',description:'The report reaches the event workspace; video and communications remain separate evidence.'},{at:.68,label:'Coordination links',description:'In Coordinated, the distinct outgoing links connect the record with field and passenger recipients.'},{at:1,label:'Recorded exchange',description:'The illustrated exchange is complete. The reported condition remains visible; closure is not inferred.'}]}),
  'occ-equipment':view('Systems & availability','Separate display, service, communications and power','operations-equipment-room','Assembly','Original logical arrangement. The alternatives illustrate different dependencies, not a specified redundancy topology or an automatic recovery guarantee.',[
    variant('normal','Connected','Trace the equipment serving the desk','The display links to one application path, then the network and field gateway. Power and the event recorder have their own visibly separate connections.',['Desk','Application','Network','Field interface'],['F17','F19','F20'],'occ-application-service'),
    variant('display-loss','Display unavailable','Lose a presentation surface without changing the field','The operator screen becomes crossed and its incoming presentation path is interrupted. The application, field gateway and field equipment remain in place.',['Presentation lost','Service present','Field interface','Unknown to this desk'],['OC02','F17'],'occ-information-quality'),
    variant('alternate','Alternate service','Compare a different application path','The first application connection is removed and the second is connected. This is a selected teaching configuration; there is no failover timer or implied transfer of control.',['Alternative service','Same interface','Separate record','Defined responsibility'],['F17','OC01'],'occ-alternate-service'),
  ]),
  'occ-workplace':view('Operator workplace','See the task, the interface and the room together','occ-task-display','Assembly','Illustrative workplace, without ergonomic dimensions, staffing assumptions or an operating sequence.',[
    variant('task','Task detail','Bring the current task close to the operator','The near display presents an enlarged local diagram and separate event strip. Keyboard, pointing surface and communications controls can be inspected independently.',['Task view','Input','Feedback','Communications'],['OC02','OC06'],'occ-task-display'),
    variant('shared','Shared overview','Relate local detail to a wider picture','The wall overview appears beyond the desk, while the local display remains. It supports discussion of context without replacing the task interface.',['Local detail','Shared picture','Team context','Role boundary'],['OC01','OC02'],'occ-shared-display'),
    variant('handover','Handover','Exchange records and retain outstanding items','Two record surfaces flank the desk. A visible item is copied across the exchange, while neither desk input nor field equipment is operated.',['Prepare','Exchange','Cross-check','Continuity'],['OC04'],'occ-duty-handover'),
  ]),
};

// Static comparisons do not expose a phase control that would leave the scene unchanged.
OCC_VIEW_DATA['operations-centre'].variants.find(v=>v.id==='service').motion=false;
OCC_VIEW_DATA['occ-equipment'].motion=false;
for(const v of OCC_VIEW_DATA['occ-workplace'].variants)v.motion=v.id==='handover';

export const OCC_PRIMARY = {
  'operations-centre':['operations-centre','service'],
  'operations-traffic-supervision':['operations-centre','service'],
  'operations-signalling-workstation':['occ-supervision','traffic'],
  'operations-power-control':['occ-supervision','power'],
  'operations-station-supervision':['occ-supervision','station'],
  'operations-radio-dispatch':['occ-incident','coordinated'],
  'operations-event-recording':['occ-equipment','normal'],
  'operations-equipment-room':['occ-equipment','normal'],
  'occ-shared-display':['occ-workplace','shared'],
  'occ-incident-coordination':['occ-incident','coordinated'],
  'occ-duty-handover':['occ-workplace','handover'],
  'occ-supervisory-request':['occ-supervision','traffic'],
  'occ-field-indication':['occ-supervision','traffic'],
  'occ-information-quality':['occ-equipment','display-loss'],
  'occ-alarm-queue':['occ-incident','reported'],
  'occ-alarm-acknowledgement':['occ-incident','acknowledged'],
  'occ-cctv-assessment':['occ-incident','reported'],
  'occ-passenger-communications':['occ-incident','coordinated'],
  'occ-access-supervision':['occ-incident','reported'],
  'occ-application-service':['occ-equipment','normal'],
  'occ-field-gateway':['occ-equipment','normal'],
  'occ-supervisory-network':['occ-equipment','normal'],
  'occ-uninterruptible-power':['occ-equipment','normal'],
  'occ-alternate-service':['occ-equipment','alternate'],
  'occ-record-timeline':['occ-equipment','normal'],
  'occ-task-display':['occ-workplace','task'],
  'occ-workstation-input':['occ-workplace','task'],
  'occ-workplace-environment':['occ-workplace','task'],
};

export const OCC_CONTEXTS = {
  'operations-centre':{'operations-centre':['service','incident','handover']},
  'operations-traffic-supervision':{'operations-centre':['service','incident','handover']},
  'operations-signalling-workstation':{'operations-centre':['service','incident','handover'],'occ-supervision':['traffic']},
  'operations-power-control':{'operations-centre':['service','incident','handover'],'occ-supervision':['power']},
  'operations-station-supervision':{'operations-centre':['service','incident','handover'],'occ-supervision':['station']},
  'operations-radio-dispatch':{'operations-centre':['service','incident','handover'],'occ-incident':['reported','acknowledged','coordinated']},
  'operations-event-recording':{'operations-centre':['service','incident','handover'],'occ-equipment':['normal','display-loss','alternate']},
  'operations-equipment-room':{'operations-centre':['service','incident','handover'],'occ-equipment':['normal','display-loss','alternate']},
  'occ-shared-display':{'operations-centre':['service','incident','handover'],'occ-workplace':['shared']},
  'occ-incident-coordination':{'operations-centre':['incident'],'occ-incident':['coordinated']},
  'occ-duty-handover':{'operations-centre':['handover'],'occ-workplace':['handover']},
  'occ-supervisory-request':{'occ-supervision':['traffic','power','station']},
  'occ-field-indication':{'occ-supervision':['traffic','power','station']},
  'occ-information-quality':{'occ-equipment':['normal','display-loss','alternate']},
  'occ-alarm-queue':{'occ-incident':['reported','acknowledged','coordinated']},
  'occ-alarm-acknowledgement':{'occ-incident':['acknowledged','coordinated']},
  'occ-cctv-assessment':{'occ-incident':['reported','acknowledged','coordinated']},
  'occ-passenger-communications':{'occ-incident':['reported','acknowledged','coordinated']},
  'occ-access-supervision':{'occ-incident':['reported','acknowledged','coordinated']},
  'occ-application-service':{'occ-supervision':['traffic','power','station'],'occ-equipment':['normal','display-loss','alternate']},
  'occ-field-gateway':{'occ-supervision':['traffic','power','station'],'occ-equipment':['normal','display-loss','alternate']},
  'occ-supervisory-network':{'occ-equipment':['normal','display-loss','alternate']},
  'occ-uninterruptible-power':{'occ-equipment':['normal','display-loss','alternate']},
  'occ-alternate-service':{'occ-equipment':['normal','display-loss','alternate']},
  'occ-record-timeline':{'occ-equipment':['normal','display-loss','alternate']},
  'occ-task-display':{'occ-workplace':['task','shared','handover']},
  'occ-workstation-input':{'occ-workplace':['task','shared','handover']},
  'occ-workplace-environment':{'occ-workplace':['task','shared','handover']},
};

export const OCC_SHARED_CONTEXTS={
  'interlocking':{'occ-supervision':['traffic']},
  'track-point-machine':{'occ-supervision':['traffic']},
  'power-scada':{'occ-supervision':['power']},
  'breaker':{'occ-supervision':['power']},
  'station-scada':{'occ-supervision':['station']},
  'tunnel-fan':{'occ-supervision':['station']},
};

export function applyOccCatalog(SOURCES,CONCEPTS) {
  for(const item of OCC_SOURCES) {const found=SOURCES.find(s=>s.id===item.id);if(found)Object.assign(found,item);else SOURCES.push(item);}
  for(const item of OCC_CONCEPTS) {const found=CONCEPTS.find(c=>c.id===item.id);if(found)Object.assign(found,item);else CONCEPTS.push(item);}
  for(const item of OCC_CONCEPT_UPDATES) {const found=CONCEPTS.find(c=>c.id===item.id);if(found)Object.assign(found,item);}
}

export function applyOccConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS}) {
  Object.assign(NEW_VIEWS,OCC_VIEW_DATA);
  const operations=SYSTEMS.find(s=>s.id==='operations');
  if(operations)Object.assign(operations,{label:'Control centre',short:'Control centre',description:'Roles, system interfaces, incident coordination and the equipment behind the operator’s desk.',view:'operations-centre',component:'operations-centre',views:Object.keys(OCC_VIEW_DATA),parts:Object.keys(OCC_PRIMARY),groups:[
    {id:'occ-room',label:'Room & responsibilities',views:['operations-centre'],parts:['operations-centre','operations-traffic-supervision','occ-shared-display']},
    {id:'occ-interfaces',label:'Supervision & coordination',views:['occ-supervision','occ-incident'],parts:['operations-signalling-workstation','operations-power-control','operations-station-supervision','occ-supervisory-request','occ-field-indication','occ-alarm-queue','occ-alarm-acknowledgement','occ-incident-coordination','occ-cctv-assessment','occ-passenger-communications','occ-access-supervision','operations-radio-dispatch']},
    {id:'occ-infrastructure',label:'Systems & workplace',views:['occ-equipment','occ-workplace'],parts:['operations-equipment-room','occ-application-service','occ-field-gateway','occ-supervisory-network','occ-uninterruptible-power','occ-alternate-service','occ-information-quality','operations-event-recording','occ-record-timeline','occ-task-display','occ-workstation-input','occ-workplace-environment','occ-duty-handover']},
  ]});
  for(const [id,[view,variant]]of Object.entries(OCC_PRIMARY)){PART_VIEWS[id]=view;PART_VARIANTS[id]=variant;PART_CONTEXTS[id]=Object.keys(OCC_CONTEXTS[id]);PART_VIEW_VARIANTS[id]=OCC_CONTEXTS[id];}
  for(const [id,contexts]of Object.entries(OCC_SHARED_CONTEXTS)){
    PART_CONTEXTS[id]||=[];PART_VIEW_VARIANTS[id]||={};
    for(const [view,variants]of Object.entries(contexts)){if(!PART_CONTEXTS[id].includes(view))PART_CONTEXTS[id].push(view);PART_VIEW_VARIANTS[id][view]=variants;}
  }
  for(const item of [...OCC_CONCEPTS,...OCC_CONCEPT_UPDATES])if(item.related)PART_RELATIONS[item.id]=item.related;
}

export const OCC_READING_GUIDES = [{
  id:'control-centre-guide',title:'Reading a control centre as a system',summary:'Start with responsibilities, follow the information, then examine what remains available when an interface is lost.',
  sections:[
    {heading:'Begin with the railway task',text:'An operations control centre brings people and technical systems together around the running railway. IRSE’s public ASPECT abstract describes operational planning, delivery, incident response and the resilience of the control centre itself. This makes the room only one useful starting point. In this atlas, traffic, signalling, power, station and communications positions are teaching roles, not a staffing prescription. A real railway may combine or distribute them differently. Select the whole room to see the relationships, then open a focused view to inspect one interface. The depicted desks, equipment counts and spatial arrangement were composed for explanation and do not represent an operator facility.',sources:['OC01']},
    {heading:'Follow the request and the evidence separately',text:'The Requests & indications view uses two visibly different paths. The outgoing path shows a supervisory request reaching a field interface; the return path shows information arriving back. Siemens’s public traffic-management example distinguishes route-setting requests to an interlocking from received signalling information. The model preserves that distinction: a moving token is a message, while the point, signal, breaker or fan stays physically unchanged. Traffic, Power and Station replace the equipment at the far end, so the interface is more than a new label. None of these traces demonstrates an interlocking decision, electrical isolation or a commanded physical outcome. Ask what the receiving system does, what evidence returns, and whether that evidence is available to this operator.',sources:['O01','F17','O02']},
    {heading:'Keep attention, condition and coordination distinct',text:'The incident workspace holds the field condition constant through all three alternatives. Reported introduces the presentation and its sources. Acknowledged adds a record of attention. Coordinated adds a shared record and separate links to field communications and passenger information. This arrangement deliberately leaves the condition visible: it supplies no evidence that the underlying issue has been repaired or that the incident can close. HSE’s alarm guidance discusses the problem of nuisance and standing alarms, while the public Frequentis incident-management example connects structured records with field collaboration. These sources support examining useful information and responsibilities; they do not prescribe the response order shown by a railway’s operating rules. A camera image, a voice report and an equipment indication answer different questions.',sources:['OC03','OC05','O02']},
    {heading:'Trace the dependencies behind a working screen',text:'Systems & availability separates a desk from application services, network connections, field interfaces, recording and power. Connected shows one illustrative service path. Display unavailable crosses out the presentation and interrupts its connection while retaining the application and field equipment. Alternate service connects a different application position to the same interfaces. These are comparisons selected by the reader, not a timed failure-and-recovery simulation. Public products offer redundant arrangements, but the model does not infer recovery time, data synchronization or continued control authority. The UPS is also a separate dependency: it represents electrical continuity for selected equipment, without assigning capacity or duration. Availability needs to be discussed in terms of the function lost or retained.',sources:['F17','F19','F20']},
    {heading:'Examine the operator’s task and the next duty',text:'The workplace view brings the display, input devices, communications controls and surrounding room into one inspectable assembly. LRSSB’s publicly accessible synopsis treats human factors, workload, teams and HMI together; its full gated guidance was not used as design evidence here. The illustration contains no verified ergonomic dimensions. Shared overview keeps the local task display while adding wider context. Handover shows two record surfaces with an outstanding item retained on both sides. HSE describes preparation, two-way exchange and incoming cross-checking, which explain why a seat change alone cannot represent a complete handover. The model stops at that information relationship and does not perform a transfer of operational responsibility.',sources:['OC06','OC04','OC02']},
    {heading:'Use the sources to ask better questions',text:'Open each source card for its reading scope. Supplier pages are concrete examples of functions and interfaces, not universal railway architectures. The IRSE abstract gives a wider frame for roles and resilience; the IRSE lecture listing offers extended viewing on automation and operator tasks. Industrial HSE material supplies general human-factors principles rather than railway rules. As you explore, ask: which role owns this task, where does the information originate, what does acknowledgement actually mean, and what evidence would still be needed? The atlas makes those boundaries visible while leaving site-specific operating procedures to their proper context.',sources:['OC01','OC07','OC02']},
  ],sources:['OC01','O01','F17','O02','OC03','OC05','F19','F20','OC06','OC04','OC02','OC07'],
}];
