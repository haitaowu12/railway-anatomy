// Public sources and original teaching arrangements only. No operator layout,
// address plan, security configuration or project interface is reproduced.
export const COMMUNICATIONS_SOURCES = [
  {
    "id": "CM01",
    "title": "Electrical SCADA Interface Requirements — TS 03865",
    "publisher": "Transport for NSW",
    "url": "https://standards.transport.nsw.gov.au/_entity/annotation/9b648150-ce31-542c-9e35-9f042bbe5826",
    "description": "Defines field-equipment, RTU, communications-network and master-station interfaces, with separate analogue inputs, digital indications and control outputs.",
    "scope": "Transport for NSW requirements used to explain interface roles in one railway context."
  },
  {
    "id": "CM02",
    "title": "Substation Automation — SICAM RTU modules",
    "publisher": "Siemens",
    "url": "https://cache.industry.siemens.com/dl/files/152/109801152/att_1077756/v1/SIDG-C10072-00-7600_Substation_Automation_Catalog.pdf",
    "description": "Shows how modular RTUs separate processor, supply, communications and input/output functions.",
    "scope": "Product catalogue used for component roles. The cabinet is a simplified arrangement."
  },
  {
    "id": "CM03",
    "title": "Automatic network inauguration to IEC standards",
    "publisher": "Westermo",
    "url": "https://www.westermo.com/se/industries/rail/applications/tcms/automatic-network-inauguration",
    "description": "Explains train backbones, consist networks and automatic network inauguration when consists are joined.",
    "scope": "Supplier example of the relationship between local consist networks and the train backbone."
  },
  {
    "id": "CM04",
    "title": "Lynx 5512 industrial Ethernet switch",
    "publisher": "Westermo",
    "url": "https://www.westermo.com/-/media/Files/Data-sheets/Lynx/westermo_ds_lynx-5512_2501_en_revm.pdf?hash=2E34976BB7FF565EE1DFC37DBBF48927&rev=4f4779d5c48049bb9b340413f3aaa35c",
    "description": "Shows copper Ethernet ports, pluggable optical interfaces, a protective enclosure and a separate DC supply.",
    "scope": "A hardware reference for the physical functions shown in the switch close-up."
  },
  {
    "id": "CM05",
    "title": "SIP intercom — system and interface functions",
    "publisher": "Zenitel",
    "url": "https://wiki.zenitel.com/wiki/SIP_Intercom_-_Web_Interface",
    "description": "Describes SIP intercom call management, buttons, audio settings and device status.",
    "scope": "Product documentation used to distinguish call setup, conversation and device monitoring."
  },
  {
    "id": "CM06",
    "title": "GSM-R for drivers, signallers and maintainers",
    "publisher": "Network Rail",
    "url": "https://www.networkrail.co.uk/industry-and-commercial/gsm-r-communicating-on-the-railway/gsm-r-for-drivers-and-signallers/",
    "description": "Explains cab radios, fixed terminals and the roles of drivers, signallers and maintainers.",
    "scope": "A British GSM-R example. Operational radio arrangements vary between railways."
  },
  {
    "id": "CM07",
    "title": "Passenger information systems",
    "publisher": "Televic Rail",
    "url": "https://www.televic.com/en/rail/solutions/passenger-information-systems",
    "description": "Connects the onboard computer, displays, audio units, crew interfaces and supporting software.",
    "scope": "Supplier examples of passenger-information functions and their equipment."
  },
  {
    "id": "CM08",
    "title": "PRAESENSA networked public address — product overview",
    "publisher": "Bosch Building Technologies",
    "url": "https://www.boschbuildingtechnologies.com/de/de/loesungen-und-services/brandschutz/sprachalarmierung/praesensa/",
    "description": "Separates the network, call stations, amplifiers, loudspeaker circuits and backup supply.",
    "scope": "A German-language product overview used to explain audio and electrical interfaces."
  },
  {
    "id": "CM09",
    "title": "AXIS P1378-LE network camera — product documentation",
    "publisher": "Axis Communications",
    "url": "https://www.axis.com/en-ca/products/axis-p1378-le/support",
    "description": "Identifies the lens, CMOS sensor, video processing, network interface and local storage.",
    "scope": "A component reference for the camera close-up. Coverage depends on the camera and its installation."
  },
  {
    "id": "CM10",
    "title": "AXIS Companion Recorder — technical documentation",
    "publisher": "Axis Communications",
    "url": "https://help.axis.com/en-us/axis-companion-recorder-4ch",
    "description": "Separates camera connections, electrical supply, recording storage and viewing software.",
    "scope": "A small recorder example used to explain recording and live-viewing functions."
  },
  {
    "id": "CM11",
    "title": "AXIS A1210 network door controller — technical documentation",
    "publisher": "Axis Communications",
    "url": "https://help.axis.com/en-us/axis-a1210",
    "description": "Identifies separate reader connections, lock relay outputs and door-monitor inputs.",
    "scope": "A product interface example used to distinguish access decisions, lock outputs and door position."
  },
  {
    "id": "CM12",
    "title": "Communications for rolling stock",
    "publisher": "Zenitel",
    "url": "https://www.zenitel.com/transportation-solutions-rolling-stock",
    "description": "Shows relationships between onboard help points, PA, crew communications and wayside call handling.",
    "scope": "Supplier examples of communications services spanning train and wayside equipment."
  }
];

const C=(id,label,summary,details,sources,related=[])=>({id,label,summary,details,sources,related,caveat:''});
export const COMMUNICATIONS_CONCEPTS = [
  C('communications-system','Railway communications','Connect people, applications and equipment across railway locations.',[
    'Communications link the train, equipment beside the track, stations and central facilities. Each service has its own endpoints and requirements, even when services share part of a network.',
    'Choose a study on network equipment, SCADA interfaces, calls and radio, information and audio, or video and access. Where available, Connections shows what each path carries and who uses it. Equipment shows the physical interfaces.',
    'The supervision examples use SCADA: supervisory control and data acquisition. SCADA collects equipment information and can send permitted requests. Train-control messages are covered in the signalling studies.'
  ],['F20','CM03','CM12','CM01'],['train-network','station-scada','operational-cab-radio','station-pa','station-cctv']),
  C('fiber-patch-panel','Fibre termination and patch panel','A passive termination makes the installed fibre accessible to equipment.',[
    'The panel groups cable entry, fibre management and connector positions. A patch lead reaches a separate optical transceiver; the panel does not switch packets.',
    'Open the rack and separate the fibre tray from its front adapter plate. The curved loops show spare fibre stored inside the tray.',
    'Trace the passive optical route first, then inspect the powered switch. The link also needs compatible optical modules and a working service configuration.'
  ],['F20','CM04'],['fiber-backbone','optical-transceiver','network-switch']),
  C('optical-transceiver','Pluggable optical transceiver','Convert between the switch electronics and an optical link.',[
    'A pluggable optical interface is a distinct module at a network port. The schematic separates its metal body, electrical edge and optical connector face.',
    'Separation pulls the module along the port axis, leaving the switch circuit board and passive patch panel in place. Follow the optical lead to see why these three objects have different jobs.',
    'Both ends of an optical link need compatible modules and fibre. Connector fit alone does not establish compatibility.'
  ],['CM04'],['network-switch','fiber-patch-panel']),
  C('communications-router','Routing and service boundary','An interface between networks is distinct from a local access switch.',[
    'Railway network products include switching and routing roles. A gateway may connect a local equipment network to a wider backbone or another application interface.',
    'In the station rack, the routing unit has its own chassis, circuit board and interfaces below the access switch. In Connections, its boundary is explicit rather than hidden inside a cable.',
    'Routing determines how traffic moves between networks. Addressing and security rules define which communications are allowed.'
  ],['F20','CM03'],['network-switch','onboard-ethernet-gateway','fiber-backbone']),
  C('onboard-ethernet-gateway','Onboard Ethernet and backbone interface','Relate vehicle devices, a consist network and the train backbone.',[
    'Published train-network examples distinguish a consist network from the backbone between consists. Applications such as passenger information and video can require a train-wide view.',
    'The onboard alternative replaces the station rack with rugged modules and circular connectors in two illustrative vehicle sections. An inter-consist connection has different endpoints from a display or camera spur.',
    'Open the module to inspect its circuit board, connectors and supply. When vehicles are coupled, network inauguration identifies the train configuration so applications can communicate with the intended devices.'
  ],['CM03','CM07'],['train-network','communications-router','passenger-info','cctv']),
  C('communications-power','Communications equipment power','The information path also depends on a power path.',[
    'Railway-building UPS examples support selected sensitive electronics. Equipment supply and data connectivity are separate dependencies.',
    'The bottom rack assembly contains a removable battery cassette and conversion board. Its supply lead is drawn separately from fibre and copper data connections.',
    'Battery capacity and equipment load determine backup duration. The application and network path must also remain available for the service to continue.'
  ],['F19'],['station-ups','network-switch','scada-rtu']),
  C('scada-rtu','PLC / RTU and field cabinet','Bring local measurements and control interfaces into supervisory communication.',[
    'A remote terminal unit (RTU) collects equipment signals and connects them to a central supervisory system. A programmable logic controller (PLC) can also run local control logic. Modular units separate the processor, supply, communications and input/output (I/O) functions.',
    'The opened cabinet separates the processor, terminal strip, input modules and output module. Each physical module can move out of its mounted position while the backplate remains.',
    'PLC, RTU and gateway functions may share a device or use separate devices. The system design defines which unit carries out each control duty.'
  ],['CM01','CM02'],['scada-input-module','scada-output-module','scada-gateway','bas-controller']),
  C('scada-input-module','Measurements and digital inputs','Read a field value or a discrete equipment condition.',[
    'Analogue measurements and digital indications are different kinds of input. Their meaning also depends on the sensor, wiring and the point definition.',
    'In Field indication, the damper position changes first. The local contact then changes, and the displayed state updates afterwards. This makes the physical condition, acquired input and presented value separately visible.',
    'The animation slows the stages down so you can compare them. A real indication also needs a defined meaning, quality and time of measurement.'
  ],['CM01','CM02'],['bas-sensor','scada-rtu','scada-information-quality']),
  C('scada-output-module','Supervisory control output','A command interface is separate from the evidence of its outcome.',[
    'SCADA examples distinguish control outputs from input indications. Local equipment may have its own control and protection functions.',
    'In Request and feedback, an operator request reaches the output relay, then the illustrative local actuator moves. A separate contact changes only with the resulting position; the HMI indication follows that contact.',
    'Local controls decide whether to act on the request. Relay operation shows an output change; a separate position signal provides evidence of movement.'
  ],['CM01','F17'],['scada-input-module','scada-rtu','occ-supervisory-request','occ-field-indication']),
  C('scada-gateway','Field communications gateway','Carry interpreted field information to the supervisory application.',[
    'The field cabinet and master system meet through a communications interface. Published systems may use several protocols and may place gateway functions inside other equipment.',
    'The standalone gateway in this teaching view makes the boundary inspectable. Its network ports are distinct from the local I/O terminals; Connections names the request and indication directions.',
    'The gateway connects two defined interfaces. Which data and requests can cross it depends on the configured protocols and access rules.'
  ],['CM01','CM02'],['scada-rtu','communications-router','scada-head-end']),
  C('scada-head-end','SCADA application, HMI and historian','Turn received points into a usable picture and a retained record.',[
    'Rail-power supervision examples include central presentation, archiving and evaluation. The application, operator interface and history therefore have related but distinct roles.',
    'The server unit, HMI and record stack are separate in this assembly. A returned indication changes the HMI marker and adds a record marker; it does not change the earlier request marker into proof of success.',
    'These logical services can run together or on separate computers. The model places them apart so their roles are easier to follow.'
  ],['F17','CM01'],['station-scada','power-scada','scada-information-quality','occ-application-service']),
  C('scada-information-quality','Current, stale and unavailable information','Read a displayed value together with its source, quality and age.',[
    'A supervisory display is downstream of acquisition, communications and presentation. Losing one interface need not change the physical equipment.',
    'In Stale indication, the field damper is open while the HMI retains a crossed, muted last-known marker. The link is interrupted and the local cabinet remains in place.',
    'The old value remains useful as a record, but its age and quality must be visible. A new field observation is needed to establish the current position.'
  ],['CM01','OC02'],['scada-input-module','scada-head-end','occ-information-quality']),
  C('help-point-electronics','Help-point audio and call electronics','A button, microphone, loudspeaker and network interface perform different jobs.',[
    'IP intercom products combine a call button with audio and device-status functions. The call service connects the user to an answering point.',
    'Open the help point to separate its front panel, button contact, microphone, loudspeaker and audio board. The example press changes call state before the answering terminal shows an established conversation.',
    'The sequence separates call request, answer and conversation. The railway assigns the answering role and response arrangements.'
  ],['CM05','CM12'],['emergency-intercom','voice-call-server','station-pa']),
  C('voice-call-server','Call management and answering terminal','Connect a call request with the intended answering service.',[
    'An IP intercom can use a SIP call manager or IP telephone exchange. Call setup and the audio conversation are different aspects of the service.',
    'The server and operator terminal appear beyond the local switch. The help-point variant changes the button, request indication and answering display in sequence, then exposes a two-way audio relationship.',
    'The call manager handles call setup. Once the call is established, audio routing depends on the system configuration and may use a different path.'
  ],['CM05','CM12'],['emergency-intercom','help-point-electronics','operations-radio-dispatch']),
  C('operational-cab-radio','Operational cab voice radio','Connect train crew with railway operational communications.',[
    'Network Rail provides a public example of cab mobile radios, fixed terminals and the roles that operate or maintain them. Other railways may use different radio arrangements.',
    'The radio alternative replaces the help point with a cab control head, handset, transceiver, antenna and a fixed answering terminal. The RF access and the fixed network are shown as separate spans.',
    'Operational voice connects people. Open the signalling system to examine the separate data messages used for train control.'
  ],['CM06'],['station-radio','operations-radio-dispatch','train-radio']),
  C('pis-controller','Passenger information controller','Prepare content for display at a station or on a train.',[
    'Public passenger-information products include an onboard computer, displays, audio and crew interfaces. A content source and the passenger-facing output are distinct.',
    'In Information delivery, a changed source pattern reaches the player before the endpoint display changes. Open the player to inspect its board and supply, then separate the display panel from its back electronics.',
    'The changing symbols make delivery order visible. A real passenger-information service also needs an accurate, current source of service information.'
  ],['CM07'],['station-pis','passenger-info','train-network','pa-controller']),
  C('pa-controller','PA call station and controller','Select and manage an audio service before it reaches an amplifier.',[
    'A public networked PA example distinguishes the microphone call station, system controller, amplifier and loudspeaker circuits.',
    'The announcement alternative exposes a microphone and controller at the source end. An active channel marker appears at the amplifier before the selected loudspeaker cone moves.',
    'The enlarged cone movement shows how the loudspeaker produces sound. Announcement priorities, coverage and speech intelligibility are separate parts of the audio-system design.'
  ],['CM08','CM12'],['pa-amplifier','station-pa','fire-notification','pis-controller']),
  C('pa-amplifier','Audio power amplifier','Turn an audio signal into electrical power for loudspeakers.',[
    'Network audio and amplified loudspeaker outputs are separate interfaces. A PA amplifier also depends on a suitable power supply.',
    'Open the chassis to separate its input/control board, power stage, heat sink and terminal block. The loudspeaker line leaves the output terminals, not the network socket.',
    'The amplifier and connected loudspeakers must have compatible ratings. The model shows their functional parts and the power-output connection.'
  ],['CM08'],['pa-controller','station-pa','communications-power']),
  C('camera-imager','Camera optics and image electronics','A lens forms an image that the sensor and electronics turn into video.',[
    'A network camera can combine a lens, CMOS image sensor, video processing, network output and optional local storage.',
    'Separate the protective cover, lens barrel and sensor board along the optical axis. The network lead leaves the electronics at the rear; it is not the optical path.',
    'Lens choice, lighting and camera position affect the image. This close-up explains the optical and electronic parts.'
  ],['CM09'],['station-cctv','cctv','cctv-recording']),
  C('cctv-recording','Video recording and viewing','Stored video and an operator’s live display are separate destinations.',[
    'A network recorder combines camera connectivity with recording storage and viewing software. A live picture and a retained recording need not have the same availability.',
    'The video alternative shows the camera, switch, recorder and viewing screen. Open the recorder and pull out the disk carrier while its network board stays in the chassis.',
    'The display uses a sample image. In a working system, recording capacity, retention settings and timestamps determine what can be retrieved later.'
  ],['CM10','CM09'],['station-cctv','camera-imager','occ-cctv-assessment']),
  C('access-door-interface','Door reader, lock output and contact','An access decision and a measured door state use different interfaces.',[
    'Public door-controller documentation separates reader connections, lock relays and door-monitor inputs. The controller can be located close to the door.',
    'The illustrative cycle first changes the relay and retracts the bolt while the leaf remains closed. When the leaf later opens, the door contact separates and the presented door-state marker changes.',
    'A released lock allows the leaf to move; the door contact reports whether the leaf is closed. Access permission and work-area protection are separate decisions.'
  ],['CM11'],['access-controller','station-scada','occ-access-supervision']),
];

export const COMMUNICATIONS_CONCEPT_UPDATES = [
  {id:'network-switch',details:['The local switch connects equipment ports to an Ethernet network. Copper ports, optical transceivers, the circuit board and power input are distinct physical parts.','Open Network equipment to separate the switch lid, board and transceiver. Follow the patch lead to the passive fibre panel and the wider network boundary.','Port capacity, addressing and traffic rules are configured for the services the network carries.'],sources:['CM04','F20'],related:['optical-transceiver','fiber-patch-panel','communications-router','communications-power']},
  {id:'telecom-rack',details:['A rack provides a physical mounting context for equipment whose functions remain distinct: fibre termination, switching, routing, application interfaces and power.','The station alternative contains separate passive and powered assemblies with removable trays, boards, modules and supply components. Enclosures can be opened without treating the whole rack as one opaque box.','This example brings the equipment into one rack so you can compare its roles.'],sources:['F20','CM04','F19'],related:['fiber-patch-panel','network-switch','communications-router','communications-power']},
  {id:'station-scada',details:['Station supervision presents information from local controllers and other integrated station systems. A field measurement, supervisory request, returned indication and historical record are distinct objects.','Open SCADA interfaces to follow a local position contact into an input module, RTU, gateway and HMI. Compare a command with its feedback and a stale last-known display with the current field position.','Local controls and protection retain their own duties. The diagram shows how their information reaches the supervisory application.'],sources:['CM01','CM02','F17','O02'],related:['scada-rtu','scada-input-module','scada-output-module','scada-head-end','scada-information-quality']},
  {id:'emergency-intercom',details:['A passenger help point connects someone at a known location with an assigned answering service. Its button, microphone, loudspeaker and call electronics have different functions.','In Calls and radio, open the front panel to inspect the audio board and transducers. The illustrative call cycle distinguishes a pressed button, a pending request and an established two-way conversation.','The railway assigns the answering service, call priorities and response arrangements.'],sources:['CM05','CM12'],related:['help-point-electronics','voice-call-server','station-pa']},
  {id:'station-pa',details:['Public address combines an audio source and control functions with amplifiers and loudspeakers serving defined areas. Audio on a network and power on a loudspeaker circuit are different interfaces.','Open Passenger information and choose Announcement to inspect the microphone, controller, amplifier board and speaker cone. Separation removes the grille and exposes the driver and magnet.','Speaker placement, background noise and room acoustics determine how well passengers hear and understand an announcement.'],sources:['CM08'],related:['pa-controller','pa-amplifier','station-pis','fire-notification']},
  {id:'station-pis',details:['The display presents information prepared by a passenger-information application or local player. The source, transmission and passenger-facing output are separate stages.','The Information delivery example changes a source pattern, then the player, then the endpoint. Open the display to separate its panel and controller board from the enclosure.','The changing symbols show the delivery sequence. The passenger-facing service also depends on accurate and current source information.'],sources:['CM07'],related:['pis-controller','passenger-info','station-pa']},
  {id:'station-cctv',details:['A camera turns light into a video stream. Network transport, recording and operator viewing are additional functions with their own dependencies.','Open Video and access to inspect the camera lens and sensor board, then the recorder disk and viewing terminal. Connections distinguishes the live and stored-video relationships.','A sample image represents the viewing output. Camera coverage and recording availability depend on the installed system.'],sources:['CM09','CM10'],related:['camera-imager','cctv-recording','occ-cctv-assessment']},
  {id:'access-controller',details:['An access controller interfaces with a reader, lock control and door monitoring. A relay output and a door contact provide different information.','In Door state, the lock releases before the leaf moves. The contact then changes with the leaf, followed by the presented door indication. Open the local controller to inspect the relay board and terminal strips.','The controller applies the configured access rules. Door-state feedback reports whether the leaf is closed, separately from the access decision.'],sources:['CM11'],related:['access-door-interface','occ-access-supervision','station-scada']},
];

const N=(id,label,location,component,role)=>({id,label,location,component,...role?{role}:{}});
const E=(from,to,label,direction='forward')=>({from,to,label,direction});
const T=(title,description,nodes,edges)=>({title,description,nodes,edges});
export const COMMUNICATION_TOPOLOGIES = {
  'communications-network/station':T('A station network cabinet','Follow the fibre, powered equipment and supply connections through the rack.',[
    N('route','Route fibre','Wayside / cable route','fiber-backbone','Backbone link'),N('patch','Fibre panel','Station rack','fiber-patch-panel','Passive termination'),N('sfp','Optical transceiver','Switch port','optical-transceiver','Optical / electrical interface'),N('switch','Access switch','Station rack','network-switch','Equipment connectivity'),N('router','Routing boundary','Station rack / head end','communications-router','Network interface'),N('supply','Equipment supply / UPS','Station rack','communications-power','Power dependency')
  ],[E('route','patch','Optical cable','both'),E('patch','sfp','Fibre patch lead','both'),E('sfp','switch','Port interface','both'),E('switch','router','Service traffic','both'),E('supply','switch','Electrical supply'),E('supply','router','Electrical supply')]),
  'communications-network/onboard':T('Vehicle devices, consist network and train backbone','A generic passenger-service example. Coupling and network inauguration are separate engineered functions.',[
    N('display','Passenger display','Vehicle A','passenger-info','Passenger output'),N('camera','Onboard camera','Vehicle A','cctv','Video source'),N('consistA','Consist network A','Vehicle equipment space','train-network','Local connectivity'),N('gatewayA','Backbone interface A','Consist boundary','onboard-ethernet-gateway','Inter-consist interface'),N('gatewayB','Backbone interface B','Adjacent consist','onboard-ethernet-gateway','Inter-consist interface'),N('consistB','Consist network B','Adjacent vehicle','train-network','Local connectivity')
  ],[E('consistA','display','Display information'),E('camera','consistA','Video stream'),E('consistA','gatewayA','Consist traffic','both'),E('gatewayA','gatewayB','Train backbone','both'),E('gatewayB','consistB','Consist traffic','both')]),
};
const scadaTopology=quality=>T('A selected plant interface: request, local control and evidence',quality?'The interrupted supervisory path leaves a last-known display; it does not establish the current field condition. The local plant has its own control responsibility.':'A building-plant damper illustrates input and output signals. Its local controller decides whether to act; the supervisory system sends requests and receives indications.',[
  N('plant','Building-plant actuator and contact','Local plant','bas-actuator','Physical equipment'),N('input','Input module','Field cabinet','scada-input-module','Acquired indication'),N('output','Output module','Field cabinet','scada-output-module','Request interface'),N('local-control','Local plant controller','Local plant','local-plant-controller','Own logic / permitted response'),N('rtu','PLC / RTU','Field cabinet','scada-rtu','Local acquisition / communications'),N('gateway','Gateway / network','Station / wayside','scada-gateway','Field-to-head-end interface'),N('head','Application / history','Head end','scada-head-end','Processing and record'),N('hmi','HMI','Control centre','station-scada','Supervisory role')
],[E('plant','input','Position indication'),E('input','rtu','Input value'),E('rtu','gateway',quality?'Unavailable / last known':'Points and quality'),E('gateway','head','Received information'),E('head','hmi','Value, state and quality'),E('hmi','head','Operator request'),E('head','gateway','Control message'),E('gateway','rtu',quality?'Request delivery unavailable':'Request'),E('rtu','output','Output selection'),E('output','local-control','Request to local control boundary'),E('local-control','plant','Permitted equipment action; separate from supervision')]);
for(const id of ['status','command','stale'])COMMUNICATION_TOPOLOGIES[`communications-scada/${id}`]=scadaTopology(id==='stale');
COMMUNICATION_TOPOLOGIES['communications-telephony/help-point']=T('Passenger help-point call','Call management is a logical function. Media routing and the answering location depend on deployment.',[
  N('user','Button / microphone / speaker','Passenger area','emergency-intercom','Passenger'),N('audio','Audio and call electronics','Inside help point','help-point-electronics','Local interface'),N('network','Equipment network','Station / train','network-switch','Transport'),N('manager','Call manager','Head end / local service','voice-call-server','Call routing and state'),N('answer','Answering terminal','Station / control room','voice-call-server','Assigned answering role')
],[E('user','audio','Call request / audio','both'),E('audio','network','Network service','both'),E('network','manager','Call signalling','both'),E('manager','answer','Incoming call and answer','both'),E('audio','answer','Established audio (logical path)','both')]);
COMMUNICATION_TOPOLOGIES['communications-telephony/operational-radio']=T('Operational radio from cab to fixed terminal','Follow the voice service from cab equipment through radio access to the fixed terminal.',[
  N('head','Handset and control head','Train cab','operational-cab-radio','Driver / crew'),N('radio','Transceiver and antenna','Train equipment space / roof','operational-cab-radio','RF interface'),N('site','Radio access equipment','Wayside','station-radio','Radio infrastructure'),N('fixed','Fixed communications service','Route / head end','fiber-backbone','Voice-service transport'),N('terminal','Fixed terminal','Control room / station','operations-radio-dispatch','Assigned operational role')
],[E('head','radio','Call control and audio','both'),E('radio','site','Radio bearer','both'),E('site','fixed','Radio service interconnection','both'),E('fixed','terminal','Operational voice and call state','both')]);
COMMUNICATION_TOPOLOGIES['communications-passenger/information']=T('Information source, player and display','Changing symbols show content moving from its source to the local player and passenger display.',[
  N('editor','Content application','Head end','pis-controller','Passenger-information role'),N('network','Communications network','Station / wayside','network-switch','Distribution'),N('player','Local / onboard player','Station / train','pis-controller','Endpoint preparation'),N('display','Display electronics and panel','Passenger area','station-pis','Passenger output')
],[E('editor','network','Selected content'),E('network','player','Delivered content'),E('player','display','Rendered display data'),E('player','editor','Available device / service status')]);
COMMUNICATION_TOPOLOGIES['communications-passenger/announcement']=T('Audio control and loudspeaker power','The amplifier output is a powered loudspeaker circuit, not another Ethernet spur.',[
  N('call','Microphone call station','Station / control room','pa-controller','Authorized announcing role'),N('controller','PA controller','Equipment room','pa-controller','Service / area selection'),N('amplifier','Audio amplifier','Equipment room','pa-amplifier','Power stage'),N('speakers','Loudspeaker circuit','Passenger area','station-pa','Passenger audio'),N('power','Equipment power','Equipment room','communications-power','Electrical dependency')
],[E('call','controller','Call control and audio'),E('controller','amplifier','Audio and channel control'),E('amplifier','speakers','Amplified audio power'),E('power','amplifier','Electrical supply'),E('amplifier','controller','Available device / line status')]);
COMMUNICATION_TOPOLOGIES['communications-security/video']=T('Image capture, recording and viewing','Follow separate paths for a live view and a recording that can be retrieved later.',[
  N('optics','Lens and sensor','Station / onboard camera','camera-imager','Image source'),N('camera','Camera electronics','Camera housing','station-cctv','Encoding and network'),N('network','Equipment network','Station / train','network-switch','Video transport'),N('recorder','Recorder and storage','Local / head-end room','cctv-recording','Retained video'),N('viewer','Viewing client','Station / control room','occ-cctv-assessment','Authorized viewer')
],[E('optics','camera','Image signal'),E('camera','network','Encoded video'),E('network','recorder','Recording stream'),E('network','viewer','Live viewing'),E('recorder','viewer','Retrieved recording')]);
COMMUNICATION_TOPOLOGIES['communications-security/access']=T('Request, lock control and door state','A relay command, bolt position and door contact answer different questions.',[
  N('reader','Reader','Door approach','access-door-interface','Credential presentation'),N('control','Local controller','Near door','access-controller','Access decision / interface'),N('lock','Lock','Door frame','access-door-interface','Physical restraint'),N('contact','Door contact','Leaf and frame','access-door-interface','Measured door state'),N('supervision','Security application','Station / head end','occ-access-supervision','Authorized security role')
],[E('reader','control','Reader data'),E('control','lock','Lock output'),E('contact','control','Door-state input'),E('control','supervision','Access events and door state'),E('supervision','control','Configured supervision interface')]);

const animation=(label,steps)=>({label,steps:steps.map(([at,label,description])=>({at,label,description}))});
const V=(view,id,label,title,description,nodes,sources,component,motion=false,anim)=>({id,label,title,description,nodes,sources,component,motion,topology:COMMUNICATION_TOPOLOGIES[`${view}/${id}`],...anim?{animation:anim}:{}});
const W=(label,title,component,level,variants,extra={})=>({label,title,component,level,note:'Simplified equipment arrangements. Use Connections to follow the service between its endpoints.',variants,motion:false,...extra});
export const COMMUNICATIONS_VIEW_DATA = {
  'communications-network':W('Network equipment','Open the passive, active and power assemblies','telecom-rack','Assembly',[
    V('communications-network','station','Station rack','Separate fibre termination from switching and routing','Open the enclosure, then separate the patch tray, optical module, switch board, router and UPS cassette. Each remains a different dependency in Connections.',['Fibre panel','Transceiver','Switch / router','Power'],['CM04','F20','F19'],'telecom-rack'),
    V('communications-network','onboard','Onboard network','Relate local devices to the train backbone','Rugged onboard modules and vehicle sections replace the station rack. The backbone links consist interfaces while the display and camera connect to a local network.',['End device','Consist','Backbone interface','Next consist'],['CM03','CM07'],'onboard-ethernet-gateway'),
  ]),
  'communications-scada':W('SCADA interfaces','Separate the field condition, request and returned indication','scada-rtu','Subsystem',[
    V('communications-scada','status','Field indication','Observe a condition before presenting it','A selected building-plant damper illustrates a returned indication. Local control owns its movement; a position contact, acquired input and HMI state are different observations. Open Interfaces to compare BAS, TVCS and other allocations.',['Field position','Contact','Input','Presented state'],['CM01','CM02'],'scada-input-module',true,animation('Illustrative indication path',[[0,'Field condition','The starting position and presented indication agree.'],[.18,'Physical position changes','The actuator and damper move locally; the HMI still holds the earlier indication.'],[.46,'Input acquired','The position contact and input marker change.'],[.78,'Presentation and record','The HMI and record marker update from the acquired indication.'],[1,'New indication shown','The returned indication now matches the new field position.']])),
    V('communications-scada','command','Request and feedback','Keep output operation distinct from returned state','A supervisory request reaches an interface before local control can act. The selected example then returns position feedback. The local controller decides whether the request can be carried out.',['Request','Output','Local action','Feedback'],['CM01','F17'],'scada-output-module',true,animation('Illustrative request and returned state',[[0,'Initial condition','The field position and HMI indication start unchanged.'],[.16,'Request presented','An operator request marker appears separately from the state indication.'],[.32,'Output interface','The output relay changes; the damper has not yet completed any movement.'],[.48,'Local equipment action','The example assumes local controls accept the request, and the actuator moves the damper.'],[.76,'Position feedback','The independent position contact and input marker change.'],[.9,'Returned indication','The HMI and record update from feedback, not from the request alone.']])),
    V('communications-scada','stale','Stale indication','Compare current plant with last-known information','The example retains a last-known field indication across a lost supervisory link. The physical plant can remain in a different state from the old indication retained on screen.',['Field remains','Link unavailable','Last known','Quality visible'],['CM01','OC02'],'scada-information-quality'),
  ]),
  'communications-telephony':W('Calls & radio','Follow a call from the user to its answering service','emergency-intercom','Subsystem',[
    V('communications-telephony','help-point','Passenger help point','Inspect the call and audio chain','The physical button, contact, audio board and transducers are inspectable. The cycle changes request and answer states before indicating a two-way audio relationship.',['Button','Call electronics','Call manager','Answering terminal'],['CM05','CM12'],'emergency-intercom',true,animation('Illustrative help-point call states',[[0,'Ready','Button and answering terminal are idle.'],[.16,'Button pressed','The physical button moves and its contact closes.'],[.32,'Call pending','A request indication appears at the help point and answering terminal.'],[.62,'Answered example','The terminal shows an established call; both audio endpoints are highlighted.'],[1,'Conversation relationship','The highlighted endpoints show an established two-way conversation.']])),
    V('communications-telephony','operational-radio','Operational radio','Inspect cab equipment and fixed-network access','A control head, handset, transceiver and antenna replace the help point. A radio access site connects to a fixed terminal through a communications service.',['Cab','RF access','Fixed network','Operational role'],['CM06'],'operational-cab-radio'),
  ]),
  'communications-passenger':W('Information & audio','Separate the content path from the powered output','pis-controller','Subsystem',[
    V('communications-passenger','information','Information delivery','Trace content into the passenger display','A changed source pattern is delivered to the local player, then the screen. Open the endpoint to separate its display panel, controller board and housing.',['Source','Network','Player','Display'],['CM07'],'pis-controller',true,animation('Illustrative content delivery',[[0,'Existing content','The source, player and endpoint show the earlier pattern.'],[.18,'Source changed','Only the source pattern changes.'],[.48,'Player updated','The local player receives the changed pattern.'],[.78,'Endpoint updated','The passenger display changes after its source and player.'],[1,'Displayed result','The source, player and screen now show the same sample content.']])),
    V('communications-passenger','announcement','Announcement','Follow audio control into loudspeaker power','The microphone and controller feed a separate amplifier. Its output terminals connect to the loudspeaker driver, whose cone movement is deliberately enlarged for inspection.',['Microphone','Controller','Amplifier','Loudspeaker'],['CM08'],'pa-amplifier',true,animation('Illustrative audio relationship',[[0,'Idle example','The call station, amplifier channel and cone start inactive.'],[.2,'Call station selected','The source marker changes at the microphone station.'],[.42,'Amplifier channel active','The amplifier level marker appears on its output path.'],[.62,'Driver motion','The selected cone oscillates; the line carries amplified audio power.'],[1,'Audio relationship','Cone movement is enlarged to show the driver working. The model illustrates the signal chain rather than room acoustics.']])),
  ]),
  'communications-security':W('Video & access','Separate observation, recording, control and indication','camera-imager','Subsystem',[
    V('communications-security','video','Video chain','Open image capture and recording assemblies','Lens, sensor board, network interface and recording disk have separate physical roles. Connections distinguishes live viewing from retrieved recordings.',['Optics','Video stream','Storage','Viewing'],['CM09','CM10'],'camera-imager'),
    V('communications-security','access','Door state','See why a released lock is not an open door','The relay and bolt change first while the door remains closed. The leaf then moves and the contact changes before the displayed door-state marker.',['Reader','Relay / lock','Leaf','Contact / display'],['CM11'],'access-door-interface',true,animation('Illustrative door-state distinction',[[0,'Closed example','The leaf, bolt and contact begin in their depicted initial positions.'],[.2,'Reader event','The reader marker changes; the door stays closed.'],[.38,'Lock released','The output relay changes and bolt retracts while the leaf remains closed.'],[.6,'Leaf opens','The leaf moves and its magnet separates from the frame contact.'],[.84,'Door state presented','A separate state marker updates from the contact.'],[1,'Observed open state','The contact and display now report the open leaf separately from the lock-release output.']])),
  ]),
};

export const COMMUNICATIONS_PRIMARY = {
  'communications-system':['communications-network','station'],
  'fiber-patch-panel':['communications-network','station'],'optical-transceiver':['communications-network','station'],'communications-router':['communications-network','station'],'onboard-ethernet-gateway':['communications-network','onboard'],'communications-power':['communications-network','station'],
  'scada-rtu':['communications-scada','status'],'scada-input-module':['communications-scada','status'],'scada-output-module':['communications-scada','command'],'scada-gateway':['communications-scada','status'],'scada-head-end':['communications-scada','status'],'scada-information-quality':['communications-scada','stale'],
  'help-point-electronics':['communications-telephony','help-point'],'voice-call-server':['communications-telephony','help-point'],'operational-cab-radio':['communications-telephony','operational-radio'],
  'pis-controller':['communications-passenger','information'],'pa-controller':['communications-passenger','announcement'],'pa-amplifier':['communications-passenger','announcement'],
  'camera-imager':['communications-security','video'],'cctv-recording':['communications-security','video'],'access-door-interface':['communications-security','access'],
};

// The list is also the explicit selectable-geometry contract exercised by tests.
export const COMMUNICATIONS_SCENE_PARTS = {
  'communications-network/station':['telecom-rack','fiber-patch-panel','fiber-backbone','optical-transceiver','network-switch','communications-router','communications-power'],
  'communications-network/onboard':['onboard-ethernet-gateway','train-network','passenger-info','cctv','camera-imager'],
  'communications-scada/status':['bas-actuator','bas-sensor','scada-rtu','scada-input-module','scada-output-module','scada-gateway','scada-head-end','station-scada','scada-information-quality'],
  'communications-scada/command':['bas-actuator','bas-sensor','scada-rtu','scada-input-module','scada-output-module','scada-gateway','scada-head-end','station-scada','scada-information-quality'],
  'communications-scada/stale':['bas-actuator','bas-sensor','scada-rtu','scada-input-module','scada-output-module','scada-gateway','scada-head-end','station-scada','scada-information-quality'],
  'communications-telephony/help-point':['emergency-intercom','help-point-electronics','voice-call-server','network-switch'],
  'communications-telephony/operational-radio':['operational-cab-radio','station-radio','operations-radio-dispatch','fiber-backbone'],
  'communications-passenger/information':['pis-controller','station-pis','network-switch'],
  'communications-passenger/announcement':['pa-controller','pa-amplifier','station-pa','communications-power'],
  'communications-security/video':['station-cctv','camera-imager','network-switch','cctv-recording','occ-cctv-assessment'],
  'communications-security/access':['access-controller','access-door-interface','occ-access-supervision'],
};
export const COMMUNICATIONS_CONTEXTS={};
for(const [key,ids]of Object.entries(COMMUNICATIONS_SCENE_PARTS)){
  const [view,variant]=key.split('/');
  for(const id of ids){const contexts=COMMUNICATIONS_CONTEXTS[id]||={};(contexts[view]||=[]).push(variant);}
}
export function applyCommsCatalog(SOURCES,CONCEPTS){
  for(const item of COMMUNICATIONS_SOURCES){const old=SOURCES.find(s=>s.id===item.id);if(old)Object.assign(old,item);else SOURCES.push(item);}
  for(const item of COMMUNICATIONS_CONCEPTS){const old=CONCEPTS.find(c=>c.id===item.id);if(old)Object.assign(old,item);else CONCEPTS.push(item);}
  for(const item of COMMUNICATIONS_CONCEPT_UPDATES){const old=CONCEPTS.find(c=>c.id===item.id);if(old)Object.assign(old,item);}
}
export function applyCommsConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS}){
  Object.assign(NEW_VIEWS,COMMUNICATIONS_VIEW_DATA);
  const comms=SYSTEMS.find(s=>s.id==='communications');
  if(comms){const oldViews=comms.views||[];Object.assign(comms,{label:'Communications',short:'Communications',description:'Locations, networks, SCADA, operational voice, passenger information and security interfaces.',view:'communications-network',component:'communications-system',views:[...Object.keys(COMMUNICATIONS_VIEW_DATA),...oldViews.filter(v=>!Object.hasOwn(COMMUNICATIONS_VIEW_DATA,v))],parts:[...new Set([...(comms.parts||[]),...Object.keys(COMMUNICATIONS_PRIMARY)])],groups:[
    {id:'communications-map',label:'Network transport',views:['communications-network'],parts:['communications-system','fiber-backbone','fiber-patch-panel','optical-transceiver','network-switch','communications-router','onboard-ethernet-gateway','communications-power']},
    {id:'communications-supervision',label:'Supervisory interfaces',views:['communications-scada'],parts:['station-scada','scada-rtu','scada-input-module','scada-output-module','scada-gateway','scada-head-end','scada-information-quality']},
    {id:'communications-services',label:'Voice & passenger services',views:['communications-telephony','communications-passenger','communications-security'],parts:['emergency-intercom','help-point-electronics','voice-call-server','operational-cab-radio','pis-controller','pa-controller','pa-amplifier','station-pa','station-pis','camera-imager','cctv-recording','access-door-interface']},
  ]});}
  for(const [id,[view,variant]]of Object.entries(COMMUNICATIONS_PRIMARY)){PART_VIEWS[id]=view;PART_VARIANTS[id]=variant;}
  // These existing onboard concepts previously inherited the domain's original
  // overview. Retain their real primary anchors when the domain gains a new map.
  for(const id of ['train-radio','radio-antenna','passenger-info','pa-intercom','cctv','train-network']){
    PART_VIEWS[id]='communications';PART_VARIANTS[id]='default';
  }
  for(const [id,contexts]of Object.entries(COMMUNICATIONS_CONTEXTS)){
    // Earlier catalog modules may retain these objects as their own published
    // context contracts. Extend navigation without mutating another module.
    PART_CONTEXTS[id]=[...(PART_CONTEXTS[id]||[])];PART_VIEW_VARIANTS[id]={...(PART_VIEW_VARIANTS[id]||{})};
    for(const [view,variants]of Object.entries(contexts)){if(!PART_CONTEXTS[id].includes(view))PART_CONTEXTS[id].push(view);PART_VIEW_VARIANTS[id][view]=variants;}
  }
  for(const item of [...COMMUNICATIONS_CONCEPTS,...COMMUNICATIONS_CONCEPT_UPDATES])if(item.related)PART_RELATIONS[item.id]=item.related;
}

export const COMMUNICATIONS_READING_GUIDES=[
  {
    "id": "communications-guide",
    "domain": "communications",
    "component": "communications-system",
    "title": "Read a communications system from endpoint to endpoint",
    "summary": "Begin with a person or a physical condition, locate the equipment, and distinguish the information from the action it may support.",
    "sections": [
      {
        "heading": "Start with a service and its locations",
        "text": "A communications drawing is easier to read when you start with its endpoints. A passenger using a help point, a position contact in a plant room, a crew member using a cab radio and a camera producing video are different sources. Their recipients differ too: an answering operator, a supervisory application, a fixed radio terminal or a video recorder. Follow one service through the focused studies. The locations—train, trackside equipment, station and central facilities—help you place its equipment within the railway.",
        "sources": [
          "F20",
          "CM01",
          "CM06",
          "CM12"
        ]
      },
      {
        "heading": "Separate passive connections, active equipment and supply",
        "text": "Installed fibre ends at a passive patch panel. A patch lead connects it to an optical transceiver in a powered switch. A router connects network scopes, while a separate power supply or UPS supports the electronics. Open and separate the equipment to see these parts; use Connections to follow the information they carry. In the onboard alternative, local devices connect within a consist, a group of vehicles treated as one network unit. A train backbone connects those consists.",
        "sources": [
          "CM03",
          "CM04",
          "F20",
          "F19"
        ]
      },
      {
        "heading": "Read SCADA in both directions",
        "text": "Supervisory control and data acquisition (SCADA) collects information from equipment and can send permitted requests. In the status example, follow the damper position through its contact, input module, local controller and operator display. The command example adds a separate output path. Request, relay operation, physical movement and returned indication are different events. The animation slows their sequence down so you can compare them. In Stale indication, the display retains an old value after its link is lost, while the field equipment has a different position. Read the value together with its age and quality.",
        "sources": [
          "CM01",
          "CM02",
          "F17",
          "OC02"
        ]
      },
      {
        "heading": "Keep voice and passenger outputs purposeful",
        "text": "A help point combines a button, microphone, loudspeaker and call electronics. Its assigned answering service receives the request, answers it and establishes a conversation. Operational radio uses a different access path: cab equipment and an antenna connect through radio infrastructure to a fixed terminal. Passenger information follows another chain, from content source through a local player to a screen. Public address (PA) adds an amplifier that supplies electrical power to loudspeakers. The enlarged cone movement shows how the driver works; speaker placement and room acoustics determine the listening result.",
        "sources": [
          "CM05",
          "CM06",
          "CM07",
          "CM08",
          "CM12"
        ]
      },
      {
        "heading": "Distinguish observation from control and proof",
        "text": "A camera captures an image, a network carries its video, a recorder stores it and a viewing client displays it. An available live image does not establish that a recording exists. Access control separates a decision from a physical condition: the relay releases the lock while the door can remain closed; the contact changes when the leaf leaves its closed position. That contact then supplies the displayed door state. At each step, ask what was observed, which device supplied the information and what the receiving application can conclude from it.",
        "sources": [
          "CM09",
          "CM10",
          "CM11"
        ]
      }
    ],
    "sources": [
      "F20",
      "CM01",
      "CM02",
      "CM03",
      "CM04",
      "F19",
      "F17",
      "OC02",
      "CM05",
      "CM06",
      "CM07",
      "CM08",
      "CM09",
      "CM10",
      "CM11",
      "CM12"
    ]
  }
];
