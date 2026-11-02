import {OCC_APPLICATION_SOURCES,occContextFor} from './occ-applications-data.js';
// Original public-source equipment and information studies. No site-specific
// room layout, staffing, deployment or operating procedure is reproduced.
export const OCC_SOURCES = [
  {id:'OC01',title:'ROCC and Role: Implementation of operational control centres for resilience — ASPECT 2019 abstract',publisher:'IRSE Netherlands',url:'https://www.irse.nl/post/aspect-2019-conference-day-2',description:'Read the Design Resilience section, “ROCC and Role”, for the relationship between operating responsibilities, people, processes and control-centre resilience.',scope:'Public conference abstract only. It informs the functional overview; no source layout, staffing or system architecture is reproduced.'},
  {id:'OC02',title:'Control room design',publisher:'Health and Safety Executive',url:'https://www.hse.gov.uk/comah/sragtech/techmeascontrol.htm',description:'Read the human-interface, control and alarm sections for task analysis, visible action feedback, readable displays and the effect of the room environment.',scope:'Industrial human-factors guidance, not a railway operating rule. Numerical limits and process-industry design prescriptions are not adopted.'},
  {id:'OC03',title:'Better alarm handling — Chemical Information Sheet 6',publisher:'Health and Safety Executive',url:'https://www.hse.gov.uk/pubns/chis6.pdf',description:'Read the discussion of nuisance alarms, standing alarms and operator understanding. It helps distinguish information volume from useful warning.',scope:'General alarm-management principles from process industry. No alarm-rate target, priority scheme or railway response sequence is implied.'},
  {id:'OC04',title:'Shift handover',publisher:'Health and Safety Executive',url:'https://www.hse.gov.uk/humanfactors/topics/shift-handover.htm',description:'Read the preparation, two-way exchange and incoming cross-check sections, then compare them with the illustrated outstanding-items record.',scope:'General communication guidance. This is not a railway transfer-of-control procedure or a prescribed form.'},
  {id:'OC05',title:'Incident and Crisis Management for rail operations',publisher:'Frequentis',url:'https://www.frequentis.com/en/public-transport/incident-and-crisis-management',description:'Read the workflow and mobile collaboration sections for links between control-room coordination, field reports and a shared incident record.',scope:'Supplier example of incident-management functions. Its performance claims, product workflow and automated response features are not reproduced.'},
  {id:'OC06',title:'LRG 29.0 Guidance for Human Factors in Operations Control Centres — public synopsis',publisher:'Light Rail Safety and Standards Board',url:'https://portal.lrssb.org/safety-hub/resources/83',description:'The public synopsis identifies ergonomics, workload, team dynamics and HMI as connected design concerns. The full guidance is offered behind a human-verification step.',scope:'Only the publicly accessible synopsis was reviewed; no claim relies on the gated document or treats its contents as implemented.'},
  {id:'OC07',title:'TMS and further automation in control centres — IRSE lecture',publisher:'Institution of Railway Signal Engineers',url:'https://vimeo.com/508536363',description:'Extended viewing on control-centre automation and the changing tasks of signallers, controllers and dispatchers.',scope:'Public lecture listing used as further reading, not evidence of a watched transcript or a universal automation architecture.'},
];

OCC_SOURCES.push(...[
  {
    "id": "OC08",
    "title": "KVM extenders: computer and remote workplace interfaces",
    "publisher": "G&D / Panoptec Europe",
    "url": "https://www.gdsys.com/en/products/kvm-extenders",
    "description": "Public manufacturer explanation of separating a computer from its workplace using computer and console interfaces, including video and input-device connections.",
    "scope": "One technology family, not a required railway architecture. No range, latency, security or compatibility specification is adopted."
  },
  {
    "id": "OC09",
    "title": "Barco CTRL: operator workspace and shared display distribution",
    "publisher": "Barco",
    "url": "https://www.barco.com/en/products/control-room-software/barco-ctrl",
    "description": "Public example of distributing information sources to operator desks and video walls through presentation interfaces.",
    "scope": "Supplier example only. The atlas does not reproduce product screens, security claims or a railway deployment."
  }
]);

export const OCC_CONCEPTS = [
  {
    "id": "operations-centre",
    "label": "Operations control centre",
    "summary": "A physical workplace presents information from systems distributed across the railway.",
    "details": [
      "Begin with the room, its consoles, shared display, cable routes and adjacent technical equipment. The same furniture remains in place when different information is presented.",
      "Select a console or cabinet to inspect its physical parts. Information behaviour follows a request and a separately returned observation through labelled system boundaries.",
      "People, responsibilities, incident coordination and duty handover have their own People & processes pages. No staffing quantities or operator facility layout are reproduced."
    ],
    "sources": [
      "OC01",
      "OC02"
    ],
    "related": [
      "occ-console",
      "occ-shared-display",
      "operations-equipment-room",
      "occ-supervisory-request"
    ],
    "kind": "place",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-console",
    "label": "Control-room console",
    "summary": "The console physically supports displays, input devices, communications and their connections.",
    "details": [
      "The desk is a workplace assembly. Its monitors, computer interface, keyboard, pointing device and communications terminal serve different functions.",
      "The close view separates monitor panels, controller boards, enclosure, keyboard and interface board. The room view uses the same console without assigning a job role to its furniture.",
      "Local computer and Remote computer compare two illustrated presentation arrangements. Moving the compute equipment does not transfer an operating responsibility."
    ],
    "sources": [
      "OC02",
      "OC08"
    ],
    "related": [
      "occ-task-display",
      "occ-workstation-input",
      "occ-client-computer",
      "occ-kvm-interface",
      "operations-radio-dispatch"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-client-computer",
    "label": "Local client computer",
    "summary": "A local computer renders the application view used at the console.",
    "details": [
      "In the local arrangement, the computer sits near its display and input devices. The screen is an output; the computer, application and information source are separate dependencies.",
      "Remove the cover to see the original interface-board schematic and connector face. During the example, receipt and rendering precede the changed display pattern.",
      "This is generic computing anatomy, not a particular workstation specification or prescribed railway architecture."
    ],
    "sources": [
      "OC08",
      "OC09"
    ],
    "related": [
      "occ-console",
      "occ-kvm-interface",
      "occ-task-display"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-kvm-interface",
    "label": "Remote computer interface",
    "summary": "Keyboard, video and pointing-device connections can link a workplace to computing equipment elsewhere.",
    "details": [
      "Public KVM products place computers in a technical room while the display and input devices remain at a remote workplace. Other thin-client arrangements use different protocols and deployment choices.",
      "Remote computer replaces the local computer with an interface module. Open its cover to inspect the connector board; follow the logical source and recipient in Connections.",
      "The drawing is one possible arrangement. It does not specify access control, latency, network isolation or exclusive control."
    ],
    "sources": [
      "OC08",
      "OC09"
    ],
    "related": [
      "occ-client-computer",
      "occ-task-display",
      "occ-supervisory-network",
      "occ-application-service"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-display-controller",
    "label": "Display distribution controller",
    "summary": "A presentation controller connects selected information sources with display surfaces.",
    "details": [
      "Control-room visualization products can supply both a workstation and a shared video wall. The presentation system distributes views; it is not the field controller being viewed.",
      "The controller is drawn as a small hardware interface beneath the wall and in the technical cabinet. A received update appears locally before the shared-display stage.",
      "Source selection and display availability are separate from the validity of the underlying railway information."
    ],
    "sources": [
      "OC09",
      "OC02"
    ],
    "related": [
      "occ-shared-display",
      "occ-task-display",
      "occ-kvm-interface",
      "occ-information-quality"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-cable-route",
    "label": "Data and power cable routes",
    "summary": "Physical connections carry data and power between the workplace and technical equipment.",
    "details": [
      "Consoles and cabinets need connections as well as floor space. Cable trays organize those physical routes; their position is part of the room anatomy.",
      "The model shows a tray, separate cable runs and connections behind equipment. It does not turn a tray into an abstract message-flow chart.",
      "Data routes and electrical supply are different dependencies. The geometry does not specify segregation distances, fire performance or an installed cable design."
    ],
    "sources": [
      "OC08",
      "F19",
      "F20"
    ],
    "related": [
      "occ-console",
      "occ-equipment-cabinet",
      "occ-supervisory-network",
      "occ-uninterruptible-power"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-equipment-cabinet",
    "label": "Technical equipment cabinet",
    "summary": "A cabinet supports replaceable computing, network and power modules.",
    "details": [
      "The physical cabinet is distinct from the application services hosted by its equipment. The original arrangement groups host computers, network interfaces, recording and power for inspection.",
      "Open the enclosure and separate the circuit boards, storage carriers, switch interfaces and battery cassette. These are internal equipment parts, not separate responsibilities.",
      "The number of cabinets and hardware modules is illustrative. A software function need not occupy its own rack."
    ],
    "sources": [
      "OC08",
      "F17",
      "F19"
    ],
    "related": [
      "occ-application-service",
      "occ-supervisory-network",
      "operations-event-recording",
      "occ-uninterruptible-power"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "operations-equipment-room",
    "label": "Technical equipment room",
    "summary": "The console depends on computing, communications, recording and electrical supply.",
    "details": [
      "The technical-room view contains cabinets with identifiable hardware rather than one box for every logical function. The console at the front is a small contextual recipient.",
      "Compare Connected, Display unavailable and Alternate host. The same hardware remains present; the selected host and the delivery outcome change.",
      "Logical deployment and remote field equipment are shown in Connections. Wayside plant is not drawn as if it were installed beside the control-room servers."
    ],
    "sources": [
      "F17",
      "F19",
      "OC08"
    ],
    "related": [
      "occ-equipment-cabinet",
      "occ-application-service",
      "occ-supervisory-network",
      "occ-field-gateway"
    ],
    "kind": "place",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-task-display",
    "label": "Console display",
    "summary": "A monitor presents an application view; its picture depends on the source and its delivery.",
    "details": [
      "The display is a physical panel, controller board, supply board, enclosure and stand. The screen picture is a separate information layer.",
      "Separate the panel and boards, then play the information example. The old placeholder remains until the received indication is presented; a new history entry appears later.",
      "A visible picture alone does not establish that it is current, complete or authoritative."
    ],
    "sources": [
      "OC02",
      "OC09"
    ],
    "related": [
      "occ-information-quality",
      "occ-field-indication",
      "occ-client-computer",
      "occ-shared-display"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-workstation-input",
    "label": "Keyboard and pointing device",
    "summary": "Input devices select and interact with application information.",
    "details": [
      "Control-room guidance connects input arrangements with readable feedback and the work being supported.",
      "The keyboard and pointing device are independently removable parts. Their connection to the client is separate from the monitor and communications handset.",
      "The model does not prescribe a button sequence, railway command permission or emergency control."
    ],
    "sources": [
      "OC02",
      "OC08"
    ],
    "related": [
      "occ-console",
      "occ-task-display",
      "occ-kvm-interface"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-shared-display",
    "label": "Shared display wall",
    "summary": "A common display presents selected information beyond an individual console.",
    "details": [
      "Public visualization systems distinguish the local workspace from a shared overview and can serve both through a presentation platform.",
      "The wall contains actual panel assemblies and a display interface. In the update example, a received observation becomes visible at the console and then on the wall.",
      "Screen size or prominence does not grant authority or establish data freshness. The geometry is not a sightline or ergonomic certification."
    ],
    "sources": [
      "OC09",
      "OC02"
    ],
    "related": [
      "occ-task-display",
      "occ-display-controller",
      "occ-information-quality"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-workplace-environment",
    "label": "Workplace setting",
    "summary": "Lighting, sightlines and the surrounding room affect how a display is used.",
    "details": [
      "General human-factors guidance considers the task, display arrangement and physical environment together. LRSSB’s public synopsis includes HMI, ergonomics and workload.",
      "The close view contains an empty chair, a light support and acoustic-panel proxies around the console. They supply physical context without modelling staff roles.",
      "No reach, illumination, acoustic or sightline performance has been calculated."
    ],
    "sources": [
      "OC02",
      "OC06"
    ],
    "related": [
      "occ-console",
      "occ-task-display",
      "occ-shared-display"
    ],
    "kind": "place",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "operations-radio-dispatch",
    "label": "Communications terminal and handset",
    "summary": "A console terminal connects operational voice services with a physical user interface.",
    "details": [
      "Railway communications products provide control-centre voice interfaces and recording functions. The terminal is different from the radio bearer and the remote recipient.",
      "The desk contains a handset, terminal face and connecting cable. The handset separates physically; the communications architecture can be explored in the communications area.",
      "The equipment view contains no message wording, channel plan or transfer-of-control procedure."
    ],
    "sources": [
      "O14"
    ],
    "related": [
      "station-radio",
      "voice-call-server",
      "operations-event-recording"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-application-service",
    "label": "Application host computer",
    "summary": "Host hardware runs software that receives and organizes supervisory information.",
    "details": [
      "Public rail supervision products use client, service and field-interface arrangements. The application service is software; this selectable assembly is the illustrated host hardware.",
      "The cabinet contains a main board and a storage carrier. The example marks the chosen host when an observation reaches the application, before it updates a client or record.",
      "Software partitioning, virtualization and deployment vary. One illustrated host is not one mandatory software function."
    ],
    "sources": [
      "F17",
      "OC08"
    ],
    "related": [
      "occ-alternate-service",
      "occ-supervisory-network",
      "occ-task-display"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-alternate-service",
    "label": "Second application host",
    "summary": "A second host provides a comparison of a different selected application path.",
    "details": [
      "Public control products can use redundant service arrangements. Their implementation and retained functions are specific to a system design.",
      "Alternate host selects B before playback. Information reaches the same client and recorder through that selected host while A remains physically present.",
      "This comparison does not simulate automatic failover, a recovery time, synchronized databases or transfer of operating responsibility."
    ],
    "sources": [
      "F17",
      "OC01"
    ],
    "related": [
      "occ-application-service",
      "occ-information-quality",
      "operations-event-recording"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-supervisory-network",
    "label": "Technical-room network switch",
    "summary": "Physical switching equipment connects clients, application hosts and communications interfaces.",
    "details": [
      "The network carries information between endpoints. Its physical switch, optical interface and patching are different from the application messages using them.",
      "Open the module to inspect the circuit board, connector bank and removable optical interface. In Connections, requests and returned observations have separate directions.",
      "The drawing is not a resilience, cybersecurity zoning or packet-timing specification."
    ],
    "sources": [
      "F20",
      "CM04"
    ],
    "related": [
      "network-switch",
      "fiber-patch-panel",
      "occ-field-gateway",
      "occ-application-service"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-field-gateway",
    "label": "Field communications gateway",
    "summary": "A communications interface connects supervisory services with a distinct field system.",
    "details": [
      "Public rail-power architecture distinguishes central supervision from local substation functions. Traffic and station systems have their own receiving interfaces.",
      "The hardware is a removable gateway module in the technical cabinet. Connections locates the field system separately and shows request receipt before any returned observation.",
      "Message receipt does not establish physical action, interlocking acceptance or electrical isolation."
    ],
    "sources": [
      "F17",
      "O01",
      "O02"
    ],
    "related": [
      "occ-supervisory-request",
      "occ-field-indication",
      "interlocking",
      "power-scada"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-uninterruptible-power",
    "label": "Equipment UPS",
    "summary": "Selected equipment can have a power-conversion and stored-energy dependency.",
    "details": [
      "Railway-building examples use UPS equipment for selected information and building loads.",
      "Separate the enclosure, conversion board and battery cassette. The supply route remains physically distinct from the data cables.",
      "No runtime, transfer performance or surviving railway function is inferred. Electrical continuity alone does not establish application availability."
    ],
    "sources": [
      "F19"
    ],
    "related": [
      "communications-power",
      "occ-equipment-cabinet",
      "occ-application-service"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "operations-event-recording",
    "label": "Event and communications recorder",
    "summary": "Recording hardware stores information for later review.",
    "details": [
      "Public railway communications products include recording. An event record needs its source and context as well as stored data.",
      "The cabinet contains a recorder board and removable storage carrier. At the record stage its indicator changes and the console gains a history entry.",
      "The illustration does not prove common clock synchronization, a complete audit record or the physical outcome of a request."
    ],
    "sources": [
      "O14",
      "OC05"
    ],
    "related": [
      "occ-record-timeline",
      "occ-application-service",
      "occ-information-quality"
    ],
    "kind": "equipment",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "operations-traffic-supervision",
    "label": "Traffic display information",
    "summary": "The displayed service picture is derived from reported railway information.",
    "details": [
      "Siemens’s public OCS example uses interlocking indications and other train-position information for train tracking.",
      "The traffic screen uses an original route strip. A returned observation replaces the previous placeholder at the delivery stage; the furniture does not change.",
      "The displayed picture is not the interlocking and does not itself create a safe route or permission for train movement."
    ],
    "sources": [
      "O01"
    ],
    "related": [
      "operations-signalling-workstation",
      "occ-field-indication",
      "occ-information-quality"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "operations-signalling-workstation",
    "label": "Signalling application display",
    "summary": "A signalling interface presents requests and received indications.",
    "details": [
      "A published traffic-management example sends route-setting requests to interlockings and uses separately received signalling information.",
      "Connections shows client, network, application, gateway and field boundaries. The example returns the reported occupancy of section T1; it does not move points or clear a signal.",
      "The 3D view shows the console carrying that application, while the logical sequence is presented in two dimensions."
    ],
    "sources": [
      "O01",
      "S10"
    ],
    "related": [
      "occ-supervisory-request",
      "occ-field-indication",
      "interlocking"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "operations-power-control",
    "label": "Power application display",
    "summary": "A power-supervision application presents the state reported by local systems.",
    "details": [
      "Public rail-power supervision includes monitoring, control and archiving, while local substation equipment performs its own control and protection functions.",
      "The example returns the reported open indication of breaker B1. Receiving and displaying that observation is separate from issuing a request.",
      "No animation switches traction energy, proves isolation or grants access."
    ],
    "sources": [
      "F17"
    ],
    "related": [
      "power-scada",
      "occ-field-indication",
      "occ-field-gateway"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "operations-station-supervision",
    "label": "Station application display",
    "summary": "A station application presents information from local facility systems.",
    "details": [
      "Public station-management products can integrate selected information from building services, communications and security systems; each interface can also be omitted or monitoring-only.",
      "The example returns a reported running indication for fan F1 through the local-system boundary, application and display.",
      "The sequence does not start a fan or select a smoke-control mode. BAS, tunnel ventilation control, station smoke controls and fire systems retain their allocated duties. Use Interfaces to compare their owners and optional connections."
    ],
    "sources": [
      "O02"
    ],
    "related": [
      "station-scada",
      "occ-field-indication",
      "occ-field-gateway"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-supervisory-request",
    "label": "Request information",
    "summary": "A request can reach a field interface before any resulting observation is available.",
    "details": [
      "The outgoing request and returned indication are separate information exchanges.",
      "Play Request, Received at interface and Returned indication. Each stage highlights the relevant topology nodes and changes their visible state labels.",
      "The field node represents an independently functioning receiving system. Receipt is not acceptance, completion or movement authority."
    ],
    "sources": [
      "O01",
      "F17",
      "O02"
    ],
    "related": [
      "occ-field-indication",
      "occ-field-gateway",
      "occ-task-display"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-field-indication",
    "label": "Returned indication",
    "summary": "A reported state travels back from its source to a presentation surface.",
    "details": [
      "The meaning of an indication depends on its source, interface and validity.",
      "Traffic, Power and Station return different named observations. The client retains its previous placeholder until that observation reaches the display stage.",
      "The example shows delivery and presentation, not proof that a supervisory request caused a physical change."
    ],
    "sources": [
      "O01",
      "F17",
      "O02"
    ],
    "related": [
      "occ-supervisory-request",
      "occ-information-quality",
      "occ-record-timeline"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-information-quality",
    "label": "Display and data availability",
    "summary": "A working source, a working application and an available picture are different states.",
    "details": [
      "Control-room guidance calls for understandable feedback associated with controls and displays.",
      "Display unavailable removes the task picture while host and recorder stages continue. A last-known placeholder is distinct from a newly delivered observation.",
      "Loss of a display does not prove that the field system has failed or that a previous indication remains valid."
    ],
    "sources": [
      "OC02",
      "F17"
    ],
    "related": [
      "occ-task-display",
      "occ-field-indication",
      "occ-alternate-service"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-record-timeline",
    "label": "On-screen event history",
    "summary": "A history view presents stored entries with their source and context.",
    "details": [
      "The record is information displayed by an application. The physical recorder is separately inspectable hardware in the technical room.",
      "History entries appear on the monitor surface, with the last entry added at the record stage. There is no freestanding timeline table in the room.",
      "The ordering is an illustrative information trace, not an incident response order or evidence of synchronized clocks."
    ],
    "sources": [
      "O14",
      "OC05"
    ],
    "related": [
      "operations-event-recording",
      "occ-field-indication"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-alarm-queue",
    "label": "Event and alarm display",
    "summary": "A display organizes reported conditions and associated context.",
    "details": [
      "HSE’s alarm guidance distinguishes useful warning from nuisance and standing alarms.",
      "The console’s second monitor is a presentation surface. Any operational assessment, acknowledgement or coordination belongs to the separate People & processes study.",
      "A status change is not automatically an alarm, and an acknowledgement does not establish repair."
    ],
    "sources": [
      "OC03"
    ],
    "related": [
      "occ-task-display",
      "occ-incident-coordination",
      "occ-information-quality"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-cctv-assessment",
    "label": "Video information at the console",
    "summary": "A video view is one source of contextual information.",
    "details": [
      "Station-management products can integrate video with other operator information.",
      "The legacy incident link now opens a process study. Its equipment context is an on-screen tile and the physical camera, network and recorder in the communications area.",
      "A camera view is not proof of isolation, track clearance or a safe route."
    ],
    "sources": [
      "O02"
    ],
    "related": [
      "station-cctv",
      "cctv-recording",
      "occ-information-quality"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-passenger-communications",
    "label": "Passenger-system interface",
    "summary": "A console can access passenger information and public-address services.",
    "details": [
      "Public station-integration examples connect PIS and PA with operator interfaces.",
      "The physical display, amplifier and loudspeaker are examined in Communications. The console tile represents their application interface.",
      "Message preparation, responsibility and coordination are separate process topics."
    ],
    "sources": [
      "O02",
      "F04"
    ],
    "related": [
      "station-pis",
      "pa-amplifier",
      "station-pa"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-access-supervision",
    "label": "Access-system information",
    "summary": "Access events and door state belong to a defined security interface.",
    "details": [
      "Public integrated station systems can present security information alongside other services.",
      "The equipment study links to the reader, controller, lock and door contact in Communications. Its console context is an information tile.",
      "Displayed access state is not permission to enter track, electrical or maintenance work areas."
    ],
    "sources": [
      "O02",
      "CM11"
    ],
    "related": [
      "access-controller",
      "access-door-interface",
      "occ-information-quality"
    ],
    "kind": "information",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-incident-coordination",
    "label": "Incident coordination",
    "summary": "Responsible teams bring reports, evidence and continuing actions together.",
    "details": [
      "Incident coordination is presented as a two-dimensional People & processes study.",
      "Follow reports, distinct recipients, responsibilities and updates there. The physical control-room console remains its contextual equipment link.",
      "The equipment page contains no incident stages, paper forms or automated emergency-response procedure."
    ],
    "sources": [
      "OC05",
      "OC01"
    ],
    "related": [
      "occ-alarm-queue",
      "operations-radio-dispatch",
      "operations-event-recording"
    ],
    "kind": "process",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-duty-handover",
    "label": "Duty handover",
    "summary": "A change of duty needs an exchange of relevant information.",
    "details": [
      "HSE describes preparation, two-way exchange and incoming cross-checking of task-relevant information.",
      "The handover link opens People & processes. A console supplies the equipment context without representing the exchange as a paper model.",
      "The atlas does not transfer an operating area, change permissions or prescribe a railway handover form."
    ],
    "sources": [
      "OC04"
    ],
    "related": [
      "occ-console",
      "occ-record-timeline",
      "occ-incident-coordination"
    ],
    "kind": "process",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  },
  {
    "id": "occ-alarm-acknowledgement",
    "label": "Acknowledgement state",
    "summary": "Attention to a presented event is distinct from its underlying condition.",
    "details": [
      "The People & processes study separates a report, attention and continuing coordination.",
      "Acknowledgement does not clear the physical condition or establish that repair or verification has occurred.",
      "Its equipment context is the task display, not a new physical object in the room."
    ],
    "sources": [
      "OC03",
      "OC05"
    ],
    "related": [
      "occ-alarm-queue",
      "occ-incident-coordination"
    ],
    "kind": "process",
    "caveat": "Original public-source teaching model. Layout, quantities and deployment are illustrative; the sequence is not an operating instruction."
  }
];
export const OCC_CONCEPT_UPDATES = [];
export const OCC_TOPOLOGIES = {
  "occ-supervision/traffic": {
    "title": "Request, returned indication and record",
    "description": "An illustrative delivery trace across located system boundaries. The field observation is independent evidence; it does not demonstrate that the request caused a physical change.",
    "nodes": [
      {
        "id": "client",
        "label": "Console application",
        "location": "Control room",
        "component": "operations-signalling-workstation",
        "role": "Request and displayed indication"
      },
      {
        "id": "network",
        "label": "Network interfaces",
        "location": "Technical room",
        "component": "occ-supervisory-network",
        "role": "Carries messages between endpoints"
      },
      {
        "id": "application",
        "label": "Supervisory application",
        "location": "Technical room",
        "component": "occ-application-service",
        "role": "Organizes received information"
      },
      {
        "id": "gateway",
        "label": "Field gateway",
        "location": "Technical room",
        "component": "occ-field-gateway",
        "role": "Boundary with the field system"
      },
      {
        "id": "field",
        "label": "Interlocking-side interface",
        "location": "Wayside",
        "component": "interlocking",
        "role": "Independent local functions and reported state"
      },
      {
        "id": "record",
        "label": "Event record",
        "location": "Technical room",
        "component": "operations-event-recording",
        "role": "Stores information with its source"
      }
    ],
    "edges": [
      {
        "from": "client",
        "to": "network",
        "label": "Selected request enters the network interface."
      },
      {
        "from": "network",
        "to": "application",
        "label": "The application receives the client request."
      },
      {
        "from": "application",
        "to": "gateway",
        "label": "The application passes the request to the defined field interface."
      },
      {
        "from": "gateway",
        "to": "field",
        "label": "Request delivery does not establish acceptance or physical completion."
      },
      {
        "from": "field",
        "to": "gateway",
        "label": "Section T1: reported occupied. This is separately returned information."
      },
      {
        "from": "gateway",
        "to": "application",
        "label": "The received observation reaches the supervisory application."
      },
      {
        "from": "application",
        "to": "client",
        "label": "The client replaces its previous placeholder with the received observation."
      },
      {
        "from": "application",
        "to": "record",
        "label": "The information is appended to the record; storage is distinct from presentation."
      }
    ]
  },
  "occ-supervision/power": {
    "title": "Request, returned indication and record",
    "description": "An illustrative delivery trace across located system boundaries. The field observation is independent evidence; it does not demonstrate that the request caused a physical change.",
    "nodes": [
      {
        "id": "client",
        "label": "Console application",
        "location": "Control room",
        "component": "operations-power-control",
        "role": "Request and displayed indication"
      },
      {
        "id": "network",
        "label": "Network interfaces",
        "location": "Technical room",
        "component": "occ-supervisory-network",
        "role": "Carries messages between endpoints"
      },
      {
        "id": "application",
        "label": "Supervisory application",
        "location": "Technical room",
        "component": "occ-application-service",
        "role": "Organizes received information"
      },
      {
        "id": "gateway",
        "label": "Field gateway",
        "location": "Technical room",
        "component": "occ-field-gateway",
        "role": "Boundary with the field system"
      },
      {
        "id": "field",
        "label": "Local substation interface",
        "location": "Substation",
        "component": "power-scada",
        "role": "Independent local functions and reported state"
      },
      {
        "id": "record",
        "label": "Event record",
        "location": "Technical room",
        "component": "operations-event-recording",
        "role": "Stores information with its source"
      }
    ],
    "edges": [
      {
        "from": "client",
        "to": "network",
        "label": "Selected request enters the network interface."
      },
      {
        "from": "network",
        "to": "application",
        "label": "The application receives the client request."
      },
      {
        "from": "application",
        "to": "gateway",
        "label": "The application passes the request to the defined field interface."
      },
      {
        "from": "gateway",
        "to": "field",
        "label": "Request delivery does not establish acceptance or physical completion."
      },
      {
        "from": "field",
        "to": "gateway",
        "label": "Breaker B1: reported open. This is separately returned information."
      },
      {
        "from": "gateway",
        "to": "application",
        "label": "The received observation reaches the supervisory application."
      },
      {
        "from": "application",
        "to": "client",
        "label": "The client replaces its previous placeholder with the received observation."
      },
      {
        "from": "application",
        "to": "record",
        "label": "The information is appended to the record; storage is distinct from presentation."
      }
    ]
  },
  "occ-supervision/station": {
    "title": "Request, returned indication and record",
    "description": "An illustrative delivery trace across located system boundaries. The field observation is independent evidence; it does not demonstrate that the request caused a physical change.",
    "nodes": [
      {
        "id": "client",
        "label": "Console application",
        "location": "Control room",
        "component": "operations-station-supervision",
        "role": "Request and displayed indication"
      },
      {
        "id": "network",
        "label": "Network interfaces",
        "location": "Technical room",
        "component": "occ-supervisory-network",
        "role": "Carries messages between endpoints"
      },
      {
        "id": "application",
        "label": "Supervisory application",
        "location": "Technical room",
        "component": "occ-application-service",
        "role": "Organizes received information"
      },
      {
        "id": "gateway",
        "label": "Field gateway",
        "location": "Technical room",
        "component": "occ-field-gateway",
        "role": "Boundary with the field system"
      },
      {
        "id": "field",
        "label": "Local facility controller",
        "location": "Station plant",
        "component": "station-scada",
        "role": "Independent local functions and reported state"
      },
      {
        "id": "record",
        "label": "Event record",
        "location": "Technical room",
        "component": "operations-event-recording",
        "role": "Stores information with its source"
      }
    ],
    "edges": [
      {
        "from": "client",
        "to": "network",
        "label": "Selected request enters the network interface."
      },
      {
        "from": "network",
        "to": "application",
        "label": "The application receives the client request."
      },
      {
        "from": "application",
        "to": "gateway",
        "label": "The application passes the request to the defined field interface."
      },
      {
        "from": "gateway",
        "to": "field",
        "label": "Request delivery does not establish acceptance or physical completion."
      },
      {
        "from": "field",
        "to": "gateway",
        "label": "Fan F1: reported running. This is separately returned information."
      },
      {
        "from": "gateway",
        "to": "application",
        "label": "The received observation reaches the supervisory application."
      },
      {
        "from": "application",
        "to": "client",
        "label": "The client replaces its previous placeholder with the received observation."
      },
      {
        "from": "application",
        "to": "record",
        "label": "The information is appended to the record; storage is distinct from presentation."
      }
    ]
  }
};
export const OCC_VIEW_DATA = {
  "operations-centre": {
    "label": "Control room",
    "title": "Connect the room with its equipment",
    "component": "operations-centre",
    "level": "Facility",
    "note": "Original public-source teaching model. The equipment, information behaviour and people/process studies have separate purposes.",
    "variants": [
      {
        "id": "service",
        "label": "Room layout",
        "title": "Locate the console, shared displays and technical room",
        "description": "Inspect fixed equipment and follow one received observation onto the console and shared display. Furniture stays in place throughout.",
        "nodes": [
          "Room",
          "Console",
          "Display distribution",
          "Technical equipment"
        ],
        "sources": [
          "OC02",
          "OC08",
          "OC09"
        ],
        "component": "occ-console",
        "motion": true,
        "animation": {
          "label": "Information reaches displays and a record",
          "duration": 12,
          "loop": false,
          "steps": [
            {
              "at": 0,
              "label": "Previous picture",
              "description": "The physical room stays fixed. The console still shows its previous placeholder."
            },
            {
              "at": 0.45,
              "label": "Host receives",
              "description": "The selected application host has received the illustrative information."
            },
            {
              "at": 0.72,
              "label": "Console updated",
              "description": "The task display replaces the placeholder with the received state."
            },
            {
              "at": 0.86,
              "label": "Shared view updated",
              "description": "Where present, the shared display receives the same observation through its presentation interface."
            },
            {
              "at": 0.92,
              "label": "Record appended",
              "description": "The recorder receives an entry and the console history gains a marker."
            },
            {
              "at": 1,
              "label": "Delivery complete",
              "description": "Compare hardware, displayed information and stored information as separate dependencies."
            }
          ]
        }
      },
      {
        "id": "incident",
        "label": "Incident coordination",
        "title": "Open the coordination study",
        "description": "This legacy link opens People & processes. The room remains a physical context.",
        "nodes": [
          "People & processes"
        ],
        "sources": [
          "OC05"
        ],
        "component": "occ-incident-coordination",
        "motion": false,
        "presentation": "process"
      },
      {
        "id": "handover",
        "label": "Duty handover",
        "title": "Open the handover study",
        "description": "This legacy link opens People & processes without adding records or role figures to the room.",
        "nodes": [
          "People & processes"
        ],
        "sources": [
          "OC04"
        ],
        "component": "occ-duty-handover",
        "motion": false,
        "presentation": "process"
      }
    ],
    "equipment": [
      "operations-centre",
      "occ-console",
      "occ-task-display",
      "occ-workstation-input",
      "operations-radio-dispatch",
      "occ-shared-display",
      "occ-display-controller",
      "occ-cable-route",
      "operations-equipment-room",
      "occ-equipment-cabinet"
    ],
    "information": [
      "operations-traffic-supervision",
      "operations-signalling-workstation",
      "operations-power-control",
      "operations-station-supervision",
      "occ-information-quality",
      "occ-record-timeline"
    ]
  },
  "occ-workplace": {
    "label": "Console anatomy",
    "title": "Inspect the physical workplace and its display path",
    "component": "occ-console",
    "level": "Assembly",
    "note": "Original public-source teaching model. The equipment, information behaviour and people/process studies have separate purposes.",
    "variants": [
      {
        "id": "task",
        "label": "Local computer",
        "title": "A computer beside its display and input devices",
        "description": "Open the display panel, controller board, input devices and local computer. Playback demonstrates receipt, rendering and history presentation.",
        "nodes": [
          "Input",
          "Local computer",
          "Display",
          "Record"
        ],
        "sources": [
          "OC02",
          "OC08"
        ],
        "component": "occ-task-display",
        "motion": true,
        "animation": {
          "label": "Information reaches displays and a record",
          "duration": 12,
          "loop": false,
          "steps": [
            {
              "at": 0,
              "label": "Previous picture",
              "description": "The physical room stays fixed. The console still shows its previous placeholder."
            },
            {
              "at": 0.45,
              "label": "Host receives",
              "description": "The selected application host has received the illustrative information."
            },
            {
              "at": 0.72,
              "label": "Console updated",
              "description": "The task display replaces the placeholder with the received state."
            },
            {
              "at": 0.86,
              "label": "Shared view updated",
              "description": "Where present, the shared display receives the same observation through its presentation interface."
            },
            {
              "at": 0.92,
              "label": "Record appended",
              "description": "The recorder receives an entry and the console history gains a marker."
            },
            {
              "at": 1,
              "label": "Delivery complete",
              "description": "Compare hardware, displayed information and stored information as separate dependencies."
            }
          ]
        }
      },
      {
        "id": "shared",
        "label": "Remote computer",
        "title": "A workplace connected to computing elsewhere",
        "description": "A remote interface replaces the local computer; a shared wall makes the separate presentation surface visible. Hardware and information destinations both change.",
        "nodes": [
          "Input interface",
          "Remote computer",
          "Local display",
          "Shared view"
        ],
        "sources": [
          "OC08",
          "OC09"
        ],
        "component": "occ-kvm-interface",
        "motion": true,
        "animation": {
          "label": "Information reaches displays and a record",
          "duration": 12,
          "loop": false,
          "steps": [
            {
              "at": 0,
              "label": "Previous picture",
              "description": "The physical room stays fixed. The console still shows its previous placeholder."
            },
            {
              "at": 0.45,
              "label": "Host receives",
              "description": "The selected application host has received the illustrative information."
            },
            {
              "at": 0.72,
              "label": "Console updated",
              "description": "The task display replaces the placeholder with the received state."
            },
            {
              "at": 0.86,
              "label": "Shared view updated",
              "description": "Where present, the shared display receives the same observation through its presentation interface."
            },
            {
              "at": 0.92,
              "label": "Record appended",
              "description": "The recorder receives an entry and the console history gains a marker."
            },
            {
              "at": 1,
              "label": "Delivery complete",
              "description": "Compare hardware, displayed information and stored information as separate dependencies."
            }
          ]
        }
      },
      {
        "id": "handover",
        "label": "Duty handover",
        "title": "Open the separate handover study",
        "description": "The physical console supplies context. Preparation, exchange and cross-checking are examined in People & processes.",
        "nodes": [
          "People & processes"
        ],
        "sources": [
          "OC04"
        ],
        "component": "occ-duty-handover",
        "motion": false,
        "presentation": "process"
      }
    ],
    "equipment": [
      "occ-console",
      "occ-task-display",
      "occ-workstation-input",
      "operations-radio-dispatch",
      "occ-client-computer",
      "occ-kvm-interface",
      "occ-shared-display",
      "occ-display-controller",
      "occ-workplace-environment"
    ],
    "information": [
      "occ-information-quality",
      "occ-record-timeline",
      "occ-alarm-queue"
    ]
  },
  "occ-equipment": {
    "label": "Technical equipment",
    "title": "Follow the hardware behind a working screen",
    "component": "operations-equipment-room",
    "level": "Assembly",
    "note": "Original public-source teaching model. The equipment, information behaviour and people/process studies have separate purposes.",
    "variants": [
      {
        "id": "normal",
        "label": "Connected",
        "title": "A selected host serves a console and recorder",
        "description": "Open cabinets to inspect computing, switching, gateway, storage and UPS parts. A received observation reaches the display and is recorded.",
        "nodes": [
          "Host A",
          "Network",
          "Display",
          "Recorder"
        ],
        "sources": [
          "F17",
          "F19",
          "OC08"
        ],
        "component": "occ-application-service",
        "motion": true,
        "animation": {
          "label": "Information reaches displays and a record",
          "duration": 12,
          "loop": false,
          "steps": [
            {
              "at": 0,
              "label": "Previous picture",
              "description": "The physical room stays fixed. The console still shows its previous placeholder."
            },
            {
              "at": 0.45,
              "label": "Host receives",
              "description": "The selected application host has received the illustrative information."
            },
            {
              "at": 0.72,
              "label": "Console updated",
              "description": "The task display replaces the placeholder with the received state."
            },
            {
              "at": 0.86,
              "label": "Shared view updated",
              "description": "Where present, the shared display receives the same observation through its presentation interface."
            },
            {
              "at": 0.92,
              "label": "Record appended",
              "description": "The recorder receives an entry and the console history gains a marker."
            },
            {
              "at": 1,
              "label": "Delivery complete",
              "description": "Compare hardware, displayed information and stored information as separate dependencies."
            }
          ]
        }
      },
      {
        "id": "display-loss",
        "label": "Display unavailable",
        "title": "Lose a picture while the host and recorder continue",
        "description": "The task monitor loses its picture. Playback still updates the host and recorder; this does not infer the state of the remote plant.",
        "nodes": [
          "Display unavailable",
          "Host present",
          "Network present",
          "Recording"
        ],
        "sources": [
          "OC02",
          "F17"
        ],
        "component": "occ-task-display",
        "motion": true,
        "animation": {
          "label": "Information without an available task picture",
          "duration": 12,
          "loop": false,
          "steps": [
            {
              "at": 0,
              "label": "Picture unavailable",
              "description": "The crossed task display is unavailable before the trace begins."
            },
            {
              "at": 0.45,
              "label": "Host receives",
              "description": "The application host receives information despite the unavailable picture."
            },
            {
              "at": 0.72,
              "label": "Presentation missing",
              "description": "No received picture appears at the task monitor; the field state cannot be inferred from this loss."
            },
            {
              "at": 0.92,
              "label": "Record appended",
              "description": "The recorder still receives an entry. Storage and presentation are different functions."
            },
            {
              "at": 1,
              "label": "Compare dependencies",
              "description": "The task picture remains unavailable while the hardware and record remain present."
            }
          ]
        }
      },
      {
        "id": "alternate",
        "label": "Alternate host",
        "title": "Use a different selected application host",
        "description": "Host B is selected before the trace. Delivery and recording use that configuration; the animation does not claim automatic failover.",
        "nodes": [
          "Host B selected",
          "Same client",
          "Same interface",
          "Record"
        ],
        "sources": [
          "F17",
          "OC01"
        ],
        "component": "occ-alternate-service",
        "motion": true,
        "animation": {
          "label": "Information reaches displays and a record",
          "duration": 12,
          "loop": false,
          "steps": [
            {
              "at": 0,
              "label": "Previous picture",
              "description": "The physical room stays fixed. The console still shows its previous placeholder."
            },
            {
              "at": 0.45,
              "label": "Host receives",
              "description": "The selected application host has received the illustrative information."
            },
            {
              "at": 0.72,
              "label": "Console updated",
              "description": "The task display replaces the placeholder with the received state."
            },
            {
              "at": 0.86,
              "label": "Shared view updated",
              "description": "Where present, the shared display receives the same observation through its presentation interface."
            },
            {
              "at": 0.92,
              "label": "Record appended",
              "description": "The recorder receives an entry and the console history gains a marker."
            },
            {
              "at": 1,
              "label": "Delivery complete",
              "description": "Compare hardware, displayed information and stored information as separate dependencies."
            }
          ]
        }
      }
    ],
    "equipment": [
      "operations-equipment-room",
      "occ-equipment-cabinet",
      "occ-application-service",
      "occ-alternate-service",
      "occ-supervisory-network",
      "occ-field-gateway",
      "operations-event-recording",
      "occ-uninterruptible-power",
      "occ-display-controller",
      "occ-cable-route",
      "occ-task-display",
      "occ-kvm-interface"
    ],
    "information": [
      "occ-information-quality",
      "occ-record-timeline"
    ]
  },
  "occ-supervision": {
    "label": "Information behaviour",
    "title": "Separate request receipt, indication and record",
    "component": "occ-task-display",
    "level": "Interface",
    "note": "Original public-source teaching model. The equipment, information behaviour and people/process studies have separate purposes.",
    "variants": [
      {
        "id": "traffic",
        "label": "Traffic",
        "title": "Follow a traffic information exchange",
        "description": "A request reaches the interface, then a separately reported observation returns to the client and record. Open Equipment to inspect the physical console.",
        "nodes": [
          "Client",
          "Application",
          "Field system",
          "Display & record"
        ],
        "sources": [
          "O01"
        ],
        "component": "operations-signalling-workstation",
        "motion": true,
        "defaultPresentation": "connections",
        "topology": {
          "title": "Request, returned indication and record",
          "description": "An illustrative delivery trace across located system boundaries. The field observation is independent evidence; it does not demonstrate that the request caused a physical change.",
          "nodes": [
            {
              "id": "client",
              "label": "Console application",
              "location": "Control room",
              "component": "operations-signalling-workstation",
              "role": "Request and displayed indication"
            },
            {
              "id": "network",
              "label": "Network interfaces",
              "location": "Technical room",
              "component": "occ-supervisory-network",
              "role": "Carries messages between endpoints"
            },
            {
              "id": "application",
              "label": "Supervisory application",
              "location": "Technical room",
              "component": "occ-application-service",
              "role": "Organizes received information"
            },
            {
              "id": "gateway",
              "label": "Field gateway",
              "location": "Technical room",
              "component": "occ-field-gateway",
              "role": "Boundary with the field system"
            },
            {
              "id": "field",
              "label": "Interlocking-side interface",
              "location": "Wayside",
              "component": "interlocking",
              "role": "Independent local functions and reported state"
            },
            {
              "id": "record",
              "label": "Event record",
              "location": "Technical room",
              "component": "operations-event-recording",
              "role": "Stores information with its source"
            }
          ],
          "edges": [
            {
              "from": "client",
              "to": "network",
              "label": "Selected request enters the network interface."
            },
            {
              "from": "network",
              "to": "application",
              "label": "The application receives the client request."
            },
            {
              "from": "application",
              "to": "gateway",
              "label": "The application passes the request to the defined field interface."
            },
            {
              "from": "gateway",
              "to": "field",
              "label": "Request delivery does not establish acceptance or physical completion."
            },
            {
              "from": "field",
              "to": "gateway",
              "label": "Section T1: reported occupied. This is separately returned information."
            },
            {
              "from": "gateway",
              "to": "application",
              "label": "The received observation reaches the supervisory application."
            },
            {
              "from": "application",
              "to": "client",
              "label": "The client replaces its previous placeholder with the received observation."
            },
            {
              "from": "application",
              "to": "record",
              "label": "The information is appended to the record; storage is distinct from presentation."
            }
          ]
        },
        "animation": {
          "label": "Illustrative request and returned information",
          "duration": 14,
          "loop": false,
          "steps": [
            {
              "at": 0,
              "label": "Request",
              "description": "A selected request is at the console. The displayed field value has not been refreshed.",
              "activeNodes": [
                "client"
              ],
              "activeEdges": [],
              "states": {
                "client": "Request selected · previous display",
                "field": "Independent field system",
                "record": "Earlier entries"
              }
            },
            {
              "at": 0.18,
              "label": "Application receives",
              "description": "Network delivery makes the client request available to the application.",
              "activeNodes": [
                "network",
                "application"
              ],
              "activeEdges": [
                0,
                1
              ],
              "states": {
                "client": "Request sent",
                "application": "Request received",
                "field": "No returned observation yet"
              }
            },
            {
              "at": 0.34,
              "label": "Received at interface",
              "description": "The request reaches the field-system interface. Receipt does not establish acceptance or physical action.",
              "activeNodes": [
                "gateway",
                "field"
              ],
              "activeEdges": [
                2,
                3
              ],
              "states": {
                "field": "Request received · outcome unconfirmed",
                "client": "Waiting for an indication"
              }
            },
            {
              "at": 0.55,
              "label": "Returned indication",
              "description": "A separately reported field observation reaches the gateway and application.",
              "activeNodes": [
                "field",
                "gateway",
                "application"
              ],
              "activeEdges": [
                4,
                5
              ],
              "states": {
                "field": "Section T1: reported occupied",
                "application": "Received observation",
                "client": "Previous display retained"
              }
            },
            {
              "at": 0.72,
              "label": "Display updated",
              "description": "The observation reaches the console. The named state is now presented on its screen.",
              "activeNodes": [
                "client"
              ],
              "activeEdges": [
                6
              ],
              "states": {
                "client": "Section T1: reported occupied",
                "application": "Observation delivered",
                "record": "Earlier entries"
              }
            },
            {
              "at": 0.92,
              "label": "Record appended",
              "description": "A source-associated entry is added to the record. A record of information does not prove a physical outcome.",
              "activeNodes": [
                "record"
              ],
              "activeEdges": [
                7
              ],
              "states": {
                "client": "Section T1: reported occupied",
                "record": "New observation stored"
              }
            },
            {
              "at": 1,
              "label": "Trace complete",
              "description": "Inspect the displayed observation, its origin and the separate record. No field mechanism was operated by this illustration.",
              "activeNodes": [
                "client",
                "record"
              ],
              "activeEdges": [],
              "states": {
                "client": "Section T1: reported occupied",
                "record": "Entry retained",
                "field": "Local functions remain separate"
              }
            }
          ]
        }
      },
      {
        "id": "power",
        "label": "Power",
        "title": "Follow a power information exchange",
        "description": "A request reaches the interface, then a separately reported observation returns to the client and record. Open Equipment to inspect the physical console.",
        "nodes": [
          "Client",
          "Application",
          "Field system",
          "Display & record"
        ],
        "sources": [
          "F17"
        ],
        "component": "operations-power-control",
        "motion": true,
        "defaultPresentation": "connections",
        "topology": {
          "title": "Request, returned indication and record",
          "description": "An illustrative delivery trace across located system boundaries. The field observation is independent evidence; it does not demonstrate that the request caused a physical change.",
          "nodes": [
            {
              "id": "client",
              "label": "Console application",
              "location": "Control room",
              "component": "operations-power-control",
              "role": "Request and displayed indication"
            },
            {
              "id": "network",
              "label": "Network interfaces",
              "location": "Technical room",
              "component": "occ-supervisory-network",
              "role": "Carries messages between endpoints"
            },
            {
              "id": "application",
              "label": "Supervisory application",
              "location": "Technical room",
              "component": "occ-application-service",
              "role": "Organizes received information"
            },
            {
              "id": "gateway",
              "label": "Field gateway",
              "location": "Technical room",
              "component": "occ-field-gateway",
              "role": "Boundary with the field system"
            },
            {
              "id": "field",
              "label": "Local substation interface",
              "location": "Substation",
              "component": "power-scada",
              "role": "Independent local functions and reported state"
            },
            {
              "id": "record",
              "label": "Event record",
              "location": "Technical room",
              "component": "operations-event-recording",
              "role": "Stores information with its source"
            }
          ],
          "edges": [
            {
              "from": "client",
              "to": "network",
              "label": "Selected request enters the network interface."
            },
            {
              "from": "network",
              "to": "application",
              "label": "The application receives the client request."
            },
            {
              "from": "application",
              "to": "gateway",
              "label": "The application passes the request to the defined field interface."
            },
            {
              "from": "gateway",
              "to": "field",
              "label": "Request delivery does not establish acceptance or physical completion."
            },
            {
              "from": "field",
              "to": "gateway",
              "label": "Breaker B1: reported open. This is separately returned information."
            },
            {
              "from": "gateway",
              "to": "application",
              "label": "The received observation reaches the supervisory application."
            },
            {
              "from": "application",
              "to": "client",
              "label": "The client replaces its previous placeholder with the received observation."
            },
            {
              "from": "application",
              "to": "record",
              "label": "The information is appended to the record; storage is distinct from presentation."
            }
          ]
        },
        "animation": {
          "label": "Illustrative request and returned information",
          "duration": 14,
          "loop": false,
          "steps": [
            {
              "at": 0,
              "label": "Request",
              "description": "A selected request is at the console. The displayed field value has not been refreshed.",
              "activeNodes": [
                "client"
              ],
              "activeEdges": [],
              "states": {
                "client": "Request selected · previous display",
                "field": "Independent field system",
                "record": "Earlier entries"
              }
            },
            {
              "at": 0.18,
              "label": "Application receives",
              "description": "Network delivery makes the client request available to the application.",
              "activeNodes": [
                "network",
                "application"
              ],
              "activeEdges": [
                0,
                1
              ],
              "states": {
                "client": "Request sent",
                "application": "Request received",
                "field": "No returned observation yet"
              }
            },
            {
              "at": 0.34,
              "label": "Received at interface",
              "description": "The request reaches the field-system interface. Receipt does not establish acceptance or physical action.",
              "activeNodes": [
                "gateway",
                "field"
              ],
              "activeEdges": [
                2,
                3
              ],
              "states": {
                "field": "Request received · outcome unconfirmed",
                "client": "Waiting for an indication"
              }
            },
            {
              "at": 0.55,
              "label": "Returned indication",
              "description": "A separately reported field observation reaches the gateway and application.",
              "activeNodes": [
                "field",
                "gateway",
                "application"
              ],
              "activeEdges": [
                4,
                5
              ],
              "states": {
                "field": "Breaker B1: reported open",
                "application": "Received observation",
                "client": "Previous display retained"
              }
            },
            {
              "at": 0.72,
              "label": "Display updated",
              "description": "The observation reaches the console. The named state is now presented on its screen.",
              "activeNodes": [
                "client"
              ],
              "activeEdges": [
                6
              ],
              "states": {
                "client": "Breaker B1: reported open",
                "application": "Observation delivered",
                "record": "Earlier entries"
              }
            },
            {
              "at": 0.92,
              "label": "Record appended",
              "description": "A source-associated entry is added to the record. A record of information does not prove a physical outcome.",
              "activeNodes": [
                "record"
              ],
              "activeEdges": [
                7
              ],
              "states": {
                "client": "Breaker B1: reported open",
                "record": "New observation stored"
              }
            },
            {
              "at": 1,
              "label": "Trace complete",
              "description": "Inspect the displayed observation, its origin and the separate record. No field mechanism was operated by this illustration.",
              "activeNodes": [
                "client",
                "record"
              ],
              "activeEdges": [],
              "states": {
                "client": "Breaker B1: reported open",
                "record": "Entry retained",
                "field": "Local functions remain separate"
              }
            }
          ]
        }
      },
      {
        "id": "station",
        "label": "Station",
        "title": "Follow a station information exchange",
        "description": "A request reaches the interface, then a separately reported observation returns to the client and record. Open Equipment to inspect the physical console.",
        "nodes": [
          "Client",
          "Application",
          "Field system",
          "Display & record"
        ],
        "sources": [
          "O02"
        ],
        "component": "operations-station-supervision",
        "motion": true,
        "defaultPresentation": "connections",
        "topology": {
          "title": "Request, returned indication and record",
          "description": "An illustrative delivery trace across located system boundaries. The field observation is independent evidence; it does not demonstrate that the request caused a physical change.",
          "nodes": [
            {
              "id": "client",
              "label": "Console application",
              "location": "Control room",
              "component": "operations-station-supervision",
              "role": "Request and displayed indication"
            },
            {
              "id": "network",
              "label": "Network interfaces",
              "location": "Technical room",
              "component": "occ-supervisory-network",
              "role": "Carries messages between endpoints"
            },
            {
              "id": "application",
              "label": "Supervisory application",
              "location": "Technical room",
              "component": "occ-application-service",
              "role": "Organizes received information"
            },
            {
              "id": "gateway",
              "label": "Field gateway",
              "location": "Technical room",
              "component": "occ-field-gateway",
              "role": "Boundary with the field system"
            },
            {
              "id": "field",
              "label": "Local facility controller",
              "location": "Station plant",
              "component": "station-scada",
              "role": "Independent local functions and reported state"
            },
            {
              "id": "record",
              "label": "Event record",
              "location": "Technical room",
              "component": "operations-event-recording",
              "role": "Stores information with its source"
            }
          ],
          "edges": [
            {
              "from": "client",
              "to": "network",
              "label": "Selected request enters the network interface."
            },
            {
              "from": "network",
              "to": "application",
              "label": "The application receives the client request."
            },
            {
              "from": "application",
              "to": "gateway",
              "label": "The application passes the request to the defined field interface."
            },
            {
              "from": "gateway",
              "to": "field",
              "label": "Request delivery does not establish acceptance or physical completion."
            },
            {
              "from": "field",
              "to": "gateway",
              "label": "Fan F1: reported running. This is separately returned information."
            },
            {
              "from": "gateway",
              "to": "application",
              "label": "The received observation reaches the supervisory application."
            },
            {
              "from": "application",
              "to": "client",
              "label": "The client replaces its previous placeholder with the received observation."
            },
            {
              "from": "application",
              "to": "record",
              "label": "The information is appended to the record; storage is distinct from presentation."
            }
          ]
        },
        "animation": {
          "label": "Illustrative request and returned information",
          "duration": 14,
          "loop": false,
          "steps": [
            {
              "at": 0,
              "label": "Request",
              "description": "A selected request is at the console. The displayed field value has not been refreshed.",
              "activeNodes": [
                "client"
              ],
              "activeEdges": [],
              "states": {
                "client": "Request selected · previous display",
                "field": "Independent field system",
                "record": "Earlier entries"
              }
            },
            {
              "at": 0.18,
              "label": "Application receives",
              "description": "Network delivery makes the client request available to the application.",
              "activeNodes": [
                "network",
                "application"
              ],
              "activeEdges": [
                0,
                1
              ],
              "states": {
                "client": "Request sent",
                "application": "Request received",
                "field": "No returned observation yet"
              }
            },
            {
              "at": 0.34,
              "label": "Received at interface",
              "description": "The request reaches the field-system interface. Receipt does not establish acceptance or physical action.",
              "activeNodes": [
                "gateway",
                "field"
              ],
              "activeEdges": [
                2,
                3
              ],
              "states": {
                "field": "Request received · outcome unconfirmed",
                "client": "Waiting for an indication"
              }
            },
            {
              "at": 0.55,
              "label": "Returned indication",
              "description": "A separately reported field observation reaches the gateway and application.",
              "activeNodes": [
                "field",
                "gateway",
                "application"
              ],
              "activeEdges": [
                4,
                5
              ],
              "states": {
                "field": "Fan F1: reported running",
                "application": "Received observation",
                "client": "Previous display retained"
              }
            },
            {
              "at": 0.72,
              "label": "Display updated",
              "description": "The observation reaches the console. The named state is now presented on its screen.",
              "activeNodes": [
                "client"
              ],
              "activeEdges": [
                6
              ],
              "states": {
                "client": "Fan F1: reported running",
                "application": "Observation delivered",
                "record": "Earlier entries"
              }
            },
            {
              "at": 0.92,
              "label": "Record appended",
              "description": "A source-associated entry is added to the record. A record of information does not prove a physical outcome.",
              "activeNodes": [
                "record"
              ],
              "activeEdges": [
                7
              ],
              "states": {
                "client": "Fan F1: reported running",
                "record": "New observation stored"
              }
            },
            {
              "at": 1,
              "label": "Trace complete",
              "description": "Inspect the displayed observation, its origin and the separate record. No field mechanism was operated by this illustration.",
              "activeNodes": [
                "client",
                "record"
              ],
              "activeEdges": [],
              "states": {
                "client": "Fan F1: reported running",
                "record": "Entry retained",
                "field": "Local functions remain separate"
              }
            }
          ]
        }
      }
    ],
    "defaultPresentation": "connections",
    "equipment": [
      "occ-console",
      "occ-task-display",
      "occ-workstation-input",
      "operations-radio-dispatch",
      "occ-kvm-interface"
    ],
    "information": [
      "operations-signalling-workstation",
      "operations-power-control",
      "operations-station-supervision",
      "occ-supervisory-request",
      "occ-field-indication",
      "occ-information-quality",
      "occ-record-timeline"
    ]
  },
  "occ-incident": {
    "label": "Incident coordination",
    "title": "Open People & processes",
    "component": "occ-console",
    "level": "Context",
    "note": "Original public-source teaching model. The equipment, information behaviour and people/process studies have separate purposes.",
    "variants": [
      {
        "id": "reported",
        "label": "Reported",
        "title": "Read the report in its process context",
        "description": "A physical console remains the equipment context. Reports and responsibilities are explained in the process diagram.",
        "nodes": [
          "People & processes"
        ],
        "sources": [
          "OC03"
        ],
        "component": "occ-alarm-queue",
        "motion": false,
        "presentation": "process"
      },
      {
        "id": "acknowledged",
        "label": "Acknowledged",
        "title": "Distinguish attention from condition",
        "description": "The People & processes page keeps acknowledgement separate from repair and resolution.",
        "nodes": [
          "People & processes"
        ],
        "sources": [
          "OC03"
        ],
        "component": "occ-alarm-acknowledgement",
        "motion": false,
        "presentation": "process"
      },
      {
        "id": "coordinated",
        "label": "Coordinated",
        "title": "Follow separate responsibilities and updates",
        "description": "The People & processes diagram connects reports, communications and continuing records.",
        "nodes": [
          "People & processes"
        ],
        "sources": [
          "OC05"
        ],
        "component": "occ-incident-coordination",
        "motion": false,
        "presentation": "process"
      }
    ],
    "presentation": "process",
    "equipment": [
      "occ-console",
      "occ-task-display",
      "occ-workstation-input",
      "operations-radio-dispatch"
    ],
    "information": [
      "occ-alarm-queue",
      "occ-cctv-assessment",
      "occ-passenger-communications",
      "occ-access-supervision"
    ]
  }
};
export const OCC_PRIMARY = {
  "operations-centre": [
    "operations-centre",
    "service"
  ],
  "occ-console": [
    "occ-workplace",
    "task"
  ],
  "occ-client-computer": [
    "occ-workplace",
    "task"
  ],
  "occ-kvm-interface": [
    "occ-workplace",
    "shared"
  ],
  "occ-display-controller": [
    "occ-workplace",
    "shared"
  ],
  "occ-cable-route": [
    "occ-equipment",
    "normal"
  ],
  "occ-equipment-cabinet": [
    "occ-equipment",
    "normal"
  ],
  "operations-equipment-room": [
    "occ-equipment",
    "normal"
  ],
  "occ-task-display": [
    "occ-workplace",
    "task"
  ],
  "occ-workstation-input": [
    "occ-workplace",
    "task"
  ],
  "occ-shared-display": [
    "occ-workplace",
    "shared"
  ],
  "occ-workplace-environment": [
    "occ-workplace",
    "task"
  ],
  "operations-radio-dispatch": [
    "occ-workplace",
    "task"
  ],
  "occ-application-service": [
    "occ-equipment",
    "normal"
  ],
  "occ-alternate-service": [
    "occ-equipment",
    "alternate"
  ],
  "occ-supervisory-network": [
    "occ-equipment",
    "normal"
  ],
  "occ-field-gateway": [
    "occ-equipment",
    "normal"
  ],
  "occ-uninterruptible-power": [
    "occ-equipment",
    "normal"
  ],
  "operations-event-recording": [
    "occ-equipment",
    "normal"
  ],
  "operations-traffic-supervision": [
    "operations-centre",
    "service"
  ],
  "operations-signalling-workstation": [
    "occ-supervision",
    "traffic"
  ],
  "operations-power-control": [
    "occ-supervision",
    "power"
  ],
  "operations-station-supervision": [
    "occ-supervision",
    "station"
  ],
  "occ-supervisory-request": [
    "occ-supervision",
    "traffic"
  ],
  "occ-field-indication": [
    "occ-supervision",
    "traffic"
  ],
  "occ-information-quality": [
    "occ-equipment",
    "display-loss"
  ],
  "occ-record-timeline": [
    "occ-workplace",
    "task"
  ],
  "occ-alarm-queue": [
    "occ-workplace",
    "task"
  ],
  "occ-cctv-assessment": [
    "occ-incident",
    "reported"
  ],
  "occ-passenger-communications": [
    "occ-incident",
    "coordinated"
  ],
  "occ-access-supervision": [
    "occ-incident",
    "reported"
  ],
  "occ-incident-coordination": [
    "occ-incident",
    "coordinated"
  ],
  "occ-duty-handover": [
    "occ-workplace",
    "handover"
  ],
  "occ-alarm-acknowledgement": [
    "occ-incident",
    "acknowledged"
  ]
};
export const OCC_CONTEXTS = {
  "operations-centre": {
    "operations-centre": [
      "service"
    ]
  },
  "occ-console": {
    "occ-workplace": [
      "task",
      "shared",
      "handover"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ],
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "occ-supervision": [
      "traffic",
      "power",
      "station"
    ],
    "occ-incident": [
      "reported",
      "acknowledged",
      "coordinated"
    ]
  },
  "occ-client-computer": {
    "occ-workplace": [
      "task"
    ]
  },
  "occ-kvm-interface": {
    "occ-workplace": [
      "shared"
    ]
  },
  "occ-display-controller": {
    "occ-workplace": [
      "shared"
    ]
  },
  "occ-cable-route": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-equipment-cabinet": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "operations-equipment-room": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-task-display": {
    "occ-workplace": [
      "task",
      "shared",
      "handover"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ],
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "occ-supervision": [
      "traffic",
      "power",
      "station"
    ],
    "occ-incident": [
      "reported",
      "acknowledged",
      "coordinated"
    ]
  },
  "occ-workstation-input": {
    "occ-workplace": [
      "task",
      "shared",
      "handover"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ],
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "occ-supervision": [
      "traffic",
      "power",
      "station"
    ],
    "occ-incident": [
      "reported",
      "acknowledged",
      "coordinated"
    ]
  },
  "occ-shared-display": {
    "occ-workplace": [
      "shared"
    ]
  },
  "occ-workplace-environment": {
    "occ-workplace": [
      "task"
    ]
  },
  "operations-radio-dispatch": {
    "occ-workplace": [
      "task",
      "shared",
      "handover"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ],
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "occ-supervision": [
      "traffic",
      "power",
      "station"
    ],
    "occ-incident": [
      "reported",
      "acknowledged",
      "coordinated"
    ]
  },
  "occ-application-service": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-alternate-service": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-supervisory-network": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-field-gateway": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-uninterruptible-power": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "operations-event-recording": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "operations-traffic-supervision": {
    "operations-centre": [
      "service"
    ]
  },
  "operations-signalling-workstation": {
    "occ-supervision": [
      "traffic"
    ]
  },
  "operations-power-control": {
    "occ-supervision": [
      "power"
    ]
  },
  "operations-station-supervision": {
    "occ-supervision": [
      "station"
    ]
  },
  "occ-supervisory-request": {
    "occ-supervision": [
      "traffic"
    ]
  },
  "occ-field-indication": {
    "occ-supervision": [
      "traffic"
    ]
  },
  "occ-information-quality": {
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ],
    "occ-workplace": [
      "task",
      "shared",
      "handover"
    ],
    "occ-supervision": [
      "traffic",
      "power",
      "station"
    ],
    "occ-incident": [
      "reported",
      "acknowledged",
      "coordinated"
    ]
  },
  "occ-record-timeline": {
    "occ-workplace": [
      "task",
      "shared",
      "handover"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ],
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "occ-supervision": [
      "traffic",
      "power",
      "station"
    ],
    "occ-incident": [
      "reported",
      "acknowledged",
      "coordinated"
    ]
  },
  "occ-alarm-queue": {
    "occ-workplace": [
      "task",
      "shared",
      "handover"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ],
    "occ-equipment": [
      "normal",
      "display-loss",
      "alternate"
    ],
    "occ-supervision": [
      "traffic",
      "power",
      "station"
    ],
    "occ-incident": [
      "reported",
      "acknowledged",
      "coordinated"
    ]
  },
  "occ-cctv-assessment": {
    "occ-incident": [
      "reported"
    ]
  },
  "occ-passenger-communications": {
    "occ-incident": [
      "coordinated"
    ]
  },
  "occ-access-supervision": {
    "occ-incident": [
      "reported"
    ]
  },
  "occ-incident-coordination": {
    "occ-incident": [
      "coordinated"
    ]
  },
  "occ-duty-handover": {
    "occ-workplace": [
      "handover"
    ]
  },
  "occ-alarm-acknowledgement": {
    "occ-incident": [
      "acknowledged"
    ]
  }
};
export const OCC_SHARED_CONTEXTS = {};
export const OCC_CONTEXT_TARGETS = {
  "occ-duty-handover": "occ-console",
  "occ-incident-coordination": "occ-console",
  "occ-alarm-acknowledgement": "occ-task-display"
};
export const OCC_EQUIPMENT_BY_VIEW = {
  "operations-centre": [
    "operations-centre",
    "occ-console",
    "occ-task-display",
    "occ-workstation-input",
    "operations-radio-dispatch",
    "occ-shared-display",
    "occ-display-controller",
    "occ-cable-route",
    "operations-equipment-room",
    "occ-equipment-cabinet"
  ],
  "occ-workplace": [
    "occ-console",
    "occ-task-display",
    "occ-workstation-input",
    "operations-radio-dispatch",
    "occ-client-computer",
    "occ-kvm-interface",
    "occ-shared-display",
    "occ-display-controller",
    "occ-workplace-environment"
  ],
  "occ-equipment": [
    "operations-equipment-room",
    "occ-equipment-cabinet",
    "occ-application-service",
    "occ-alternate-service",
    "occ-supervisory-network",
    "occ-field-gateway",
    "operations-event-recording",
    "occ-uninterruptible-power",
    "occ-display-controller",
    "occ-cable-route",
    "occ-task-display",
    "occ-kvm-interface"
  ],
  "occ-supervision": [
    "occ-console",
    "occ-task-display",
    "occ-workstation-input",
    "operations-radio-dispatch",
    "occ-kvm-interface"
  ],
  "occ-incident": [
    "occ-console",
    "occ-task-display",
    "occ-workstation-input",
    "operations-radio-dispatch"
  ]
};
export const OCC_INFORMATION_BY_VIEW = {
  "operations-centre": [
    "operations-traffic-supervision",
    "operations-signalling-workstation",
    "operations-power-control",
    "operations-station-supervision",
    "occ-information-quality",
    "occ-record-timeline"
  ],
  "occ-workplace": [
    "occ-information-quality",
    "occ-record-timeline",
    "occ-alarm-queue"
  ],
  "occ-equipment": [
    "occ-information-quality",
    "occ-record-timeline"
  ],
  "occ-supervision": [
    "operations-signalling-workstation",
    "operations-power-control",
    "operations-station-supervision",
    "occ-supervisory-request",
    "occ-field-indication",
    "occ-information-quality",
    "occ-record-timeline"
  ],
  "occ-incident": [
    "occ-alarm-queue",
    "occ-cctv-assessment",
    "occ-passenger-communications",
    "occ-access-supervision"
  ]
};
export const OCC_READING_GUIDES = [
  {
    "id": "control-centre-guide",
    "title": "From the control-room console to a railway observation",
    "summary": "Inspect the physical equipment, then separate the source, delivery, presentation and record of information.",
    "sections": [
      {
        "heading": "Start with what occupies the room",
        "text": "A control centre contains workstations, display surfaces, communications terminals, cable routes and the technical equipment serving them. These are useful physical subjects for an anatomy model. A desk is not a responsibility, and a hardware cabinet is not the software function it hosts. The room in this atlas is an original composition with empty consoles and fixed furniture. Open a console or cabinet to inspect its construction. People, task allocation, incident coordination and duty handover belong to the separate People & processes pages. This separation lets the equipment view answer where things are and how they connect without pretending to reproduce an operator’s facility.",
        "sources": [
          "OC01",
          "OC02"
        ]
      },
      {
        "heading": "Separate the monitor from its information",
        "text": "The console view contains a display panel, controller and supply boards, enclosure, keyboard, pointing device, communications handset and computer interface. A local computer can sit near its peripherals. A remote arrangement can place computing equipment elsewhere and connect it through an interface that carries display and input information. Public KVM products illustrate this distinction; they are one possible technology family. The atlas’s alternatives change the physical hardware and add a shared presentation surface. They do not establish a universal network architecture or transfer operating responsibility. Play the example and watch the picture change only when the delivery stage reaches it.",
        "sources": [
          "OC08",
          "OC09",
          "OC02"
        ]
      },
      {
        "heading": "Locate the host, network, gateway and recorder",
        "text": "The technical-room cabinets expose main boards, storage carriers, switching interfaces, patching and a UPS battery cassette. Their functions differ. A network carries information between endpoints; an application organizes it; a gateway meets a different system’s interface; a recorder stores information; a presentation controller supplies a display. Software functions may share hardware or be distributed. The cabinet counts and module arrangement here are teaching choices. The UPS provides a separate power dependency, without assigning a runtime or proving that an application survives every interruption. There is no freestanding physical table for an event timeline: history appears on a monitor, and its storage hardware is separately selectable.",
        "sources": [
          "F17",
          "F19",
          "F20",
          "OC09"
        ]
      },
      {
        "heading": "Follow a request and a separately returned observation",
        "text": "Information behaviour uses a two-dimensional topology because locations, direction and state matter more than the shape of a rack. A selected request passes from the console through network, application and gateway boundaries to the field interface. Receipt does not establish acceptance or physical completion. A separately reported observation then returns: an occupied section in Traffic, an open breaker indication in Power, or a running-fan indication in Station. The display retains its previous placeholder until delivery reaches it. The final stage appends a source-associated record. This trace does not move points, switch electrical energy or select a station emergency mode. It explains what each receiving endpoint knows at that stage.",
        "sources": [
          "O01",
          "F17",
          "O02"
        ]
      },
      {
        "heading": "Compare the function that is available",
        "text": "Display unavailable removes the task picture while the host and recorder still receive information. This demonstrates a presentation dependency; it does not tell the reader whether remote equipment has failed. Alternate host selects a different application host before playback and delivers information using that selected configuration. It is a comparison, not an automatic failover simulation. No recovery time, synchronized state or continued control authority is assumed. HSE’s control-room guidance supports making relationships between controls, displays and feedback understandable. Apply that question here: what originated the information, which endpoint has received it, and which presentation or record is actually available?",
        "sources": [
          "OC02",
          "F17",
          "OC01"
        ]
      },
      {
        "heading": "Continue into the human work",
        "text": "Equipment and information behaviour provide context for the separate process studies. Acknowledgement, coordination and resolution are different states; a stored record alone does not establish a repaired condition. Duty handover involves relevant information and two-way checking, not a change in furniture. Use the source cards to distinguish an operator or authority example from a supplier product, a public conference abstract or general industrial guidance. None supplies a universal control-room layout or a railway operating procedure.",
        "sources": [
          "OC03",
          "OC04",
          "OC05",
          "OC01"
        ]
      }
    ],
    "sources": [
      "OC01",
      "OC02",
      "OC03",
      "OC04",
      "OC05",
      "OC08",
      "OC09",
      "O01",
      "O02",
      "F17",
      "F19",
      "F20"
    ]
  }
];


// Revision 10: room anatomy and application semantics have separate surfaces.
OCC_SOURCES.push(...OCC_APPLICATION_SOURCES);
OCC_CONCEPTS.push({id:'telecom-scada',label:'Communications / telecom SCADA',summary:'Supervise selected communications-equipment conditions and explicitly configured remote requests.',details:[
  'A railway can allocate SCADA to telecom equipment as well as electrical and facility systems. The Metrolinx LRT criteria explicitly include communications-equipment monitoring; the Racomm example includes multiple telecom services and native-manager interfaces.',
  'Device condition, native service payload and equipment-maintenance requests are different exchanges. PA audio, CCTV video, radio calls and switch management do not become one generic SCADA payload.',
  'The OCC application explorer compares no telecom SCADA link, selected monitoring and one named permitted request. Native managers can supply diagnostic points, but a separate NMS is not mandatory for direct acquisition. Exact point lists, command permissions and hosting vary by project.'
],sources:['OC10','OC11','OC12','OC14'],related:['network-management','pa-amplifier','station-cctv','station-radio','interface-contract'],kind:'information',caveat:'The named assets and trace states are fictional teaching examples, not an installed command list or operating procedure.'});
OCC_PRIMARY['telecom-scada']=['occ-supervision','traffic'];
OCC_CONTEXTS['telecom-scada']={'occ-supervision':['traffic','power','station']};
for(const concept of OCC_CONCEPTS){
  if(occContextFor(concept.id)){
    OCC_PRIMARY[concept.id]=['occ-supervision',concept.id==='operations-power-control'?'power':concept.id==='operations-station-supervision'?'station':'traffic'];
    OCC_CONTEXTS[concept.id]={'occ-supervision':['traffic','power','station']};
  }
}
for(const [view,ids] of Object.entries(OCC_INFORMATION_BY_VIEW))OCC_INFORMATION_BY_VIEW[view]=[...new Set([...ids,'telecom-scada'])];
const corrections={
  'operations-centre':{summary:'A control-room workplace connects people with applications whose equipment and field sources are distributed across the railway.',details:['Inspect the installed consoles, displays, input devices, voice terminals, cable routes and adjacent technical equipment. One workstation can access several applications, while one application can span several hosts.','Open OCC applications to inspect train, power, facility, telecom and passenger-service points. The physical model does not make software duties into separate pieces of furniture.','People, responsibilities, incident coordination and duty handover have their own People & processes pages. Room dimensions, staffing and system deployment are illustrative.'],sources:['OC01','OC02','OC10','OC15','OC16']},
  'occ-console':{details:['The desk supports displays, keyboard and pointing devices, an operational voice terminal and their connections. A screen is a physical output surface; the applications seen on it are separate functions.','The local-computer example places a client near its peripherals. The remote-computer example uses a console-side interface to computing equipment elsewhere. The detailed model retains their installed relationship before a chosen assembly is opened.','Computing, native service applications and field equipment remain separate dependencies. Open OCC applications to examine their points and interfaces.'],sources:['OC02','OC08','OC09','OC16']},
  'occ-client-computer':{details:['A local client can render application information near the console and connect to its displays and input devices. A remote client or KVM arrangement is another possible allocation.','Its enclosure, connectors and computing hardware are physical anatomy. The model does not claim that receipt of a data packet makes a workstation mechanically move.','An application can share hardware with other functions or run on several hosts. No specific manufacturer or railway deployment is reproduced.'],sources:['OC08','OC09','OC16']},
  'occ-task-display':{details:['The monitor is a physical display panel, enclosure, stand and connected electronics. Its decorative image is not a selectable railway system or an authoritative live status.','Inspect the installed screen and its connections in the console context. Use OCC applications for a readable named point, source, condition, optional interface and returned evidence.','A picture alone does not establish that its underlying information is current, complete or authoritative.'],sources:['OC02','OC09','OC16']},
  'occ-field-gateway':{label:'Supervisory interface / gateway module',summary:'An example hardware module connects or adapts defined system interfaces.',details:['A field-facing interface can be embedded in equipment, hosted by a controller or implemented as a separate gateway. This cabinet shows one physical allocation, not a mandatory gateway rack for every application.','The new OCC explorer names the selected acquisition boundary: device, PLC/RTU, signalling interface, service application or optional native equipment manager. Direct device acquisition and management-mediated acquisition are distinct possibilities.','Receiving a request does not establish permission, physical completion or restoration of a service.'],sources:['OC10','OC11','OC14','F17']},
  'operations-station-supervision':{label:'Facilities and environmental applications',summary:'Present plant through its allocated facility SCADA, BAS or ventilation-control interfaces.',details:['An integrated display can contain selected BAS, TVCS and other facility points without assigning one controller ownership of all plant.','Comfort fan AHU-01 is a BAS example; tunnel fan TVF-01 belongs to a ventilation-control example. Their source, native application, requested service and returned evidence are named separately.','Communications-equipment SCADA is another application scope. Its device health and configured controls must not disappear into a traction-only or generic building-services explanation.'],sources:['CI01','CI02','CI03','OC10','OC11','OC12']},
  'occ-application-service':{label:'Application host',summary:'Computing hardware provides one possible host for supervisory software.',details:['The physical model exposes a representative server enclosure, compute board, storage and connectors. A host is hardware; an application is a software function with an assigned scope.','Several applications may share infrastructure, and one application can use multiple hosts. No one-rack-per-function deployment is implied.','Host power, storage, transport and application state have separate dependencies. The model does not establish redundancy or failover.'],sources:['OC16','OC09','F17']},
  'occ-alternate-service':{label:'Additional application host',summary:'A second host illustrates a possible deployment choice, not proven redundancy.',details:['A second physical host can support another application or a configured redundant arrangement. Its presence alone establishes neither automatic failover nor synchronized state.','Availability depends on software, data, networks, power and engineered switching between services. Compare data-path and feedback conditions in the OCC application inspector.'],sources:['OC16','OC09']}
};
for(const [id,patch] of Object.entries(corrections)){const c=OCC_CONCEPTS.find(x=>x.id===id);if(c)Object.assign(c,patch);}
Object.assign(OCC_VIEW_DATA['occ-supervision'],{label:'OCC applications',title:'Inspect named equipment points and application interfaces',component:'telecom-scada',note:'Readable application inspector. Equipment, native management, supervisory functions and presentation remain distinct; project allocations vary.'});
Object.assign(OCC_VIEW_DATA['occ-workplace'],{label:'Console & workstation',title:'Inspect installed workplace equipment and its connections',note:'A local client and a remote client/KVM arrangement are representative alternatives. Monitors are physical surfaces, not separate railway applications.'});
OCC_READING_GUIDES[0]={...OCC_READING_GUIDES[0],summary:'Connect room equipment with named railway applications and device points, while keeping the scope of each interface explicit.',sections:[
  {heading:'Start with what occupies the room',text:'A control centre contains consoles, displays, input devices, voice terminals, cabling and supporting technical equipment. A physical host and its software applications are different subjects. The model shows an original room arrangement, not an operator facility or staffing plan.',sources:['OC02','OC16']},
  {heading:'Follow the installed workplace connections',text:'Local computing can sit near the keyboard and displays. A remote arrangement can use an interface carrying display and input information to computing equipment elsewhere. KVM is one possible technology family. One workstation can reach several applications, and one application can be distributed across hosts.',sources:['OC08','OC09','OC16']},
  {heading:'Give communications SCADA its own scope',text:'SCADA is not limited to traction power. The Metrolinx LRT design criteria include communications-equipment monitoring. Racomm publishes telecom SCADA acquisition from devices or native managers across several communications systems. PA audio, CCTV video and radio calls remain service payloads distinct from equipment-health points.',sources:['OC10','OC11']},
  {heading:'Name the point before drawing a connection',text:'The OCC applications page identifies an example asset, its observed condition, the originating device or controller, the native service and the selected supervisory interface. Telecom SCADA can be absent, monitoring only or configured for a named request. Other applications can remain native or share selected information and requests through a common HMI. Neither integration nor a particular NMS hop is universal.',sources:['OC11','OC12','OC13','OC14']},
  {heading:'Keep requests, outcomes and service performance separate',text:'A received request is not an accepted request; an accepted request is not a completed change. Fresh returned equipment information is separate again from the performance of its service. A responding camera does not prove an appropriate view or recording; a healthy amplifier does not prove station-wide audibility. The trace compares stale data, unavailable feedback and refused requests without operating equipment.',sources:['OC02','OC11','OC13','OC14']},
  {heading:'Continue into the human work',text:'Equipment and application views supply context for the separate People & processes studies. Alarm acknowledgement, incident coordination, resolution and duty handover are human activities with their own responsibilities and evidence. A stored record alone does not establish a repaired condition.',sources:['OC03','OC04','OC05','OC15']}
],sources:['OC02','OC03','OC04','OC05','OC08','OC09','OC10','OC11','OC12','OC13','OC14','OC15','OC16']};


for(const id of ['operations-centre','occ-workplace','occ-equipment'])for(const variant of OCC_VIEW_DATA[id].variants){delete variant.animation;variant.motion=false;}
Object.assign(OCC_VIEW_DATA['operations-centre'].variants[0],{description:'Locate consoles, shared displays, cable routes and the adjacent technical equipment. Open an assembly to inspect physical connections; use OCC applications for readable points, permissions and returned evidence.'});
Object.assign(OCC_VIEW_DATA['occ-workplace'].variants.find(v=>v.id==='task'),{description:'Inspect the installed displays, keyboard, pointing device, voice terminal and local client. Cable routes connect these items while the application data is explored separately.',nodes:['Display connections','Local client','Input devices','Voice terminal']});
Object.assign(OCC_VIEW_DATA['occ-workplace'].variants.find(v=>v.id==='shared'),{description:'The console-side interface connects workplace displays and input devices to computing equipment elsewhere. Shared presentation uses a separate display-distribution function. This physical alternative does not establish service availability.',nodes:['Console peripherals','KVM / client interface','Remote host','Shared display distribution']});
const technicalArrangement=OCC_VIEW_DATA['occ-equipment'].variants.find(v=>v.id==='normal');
Object.assign(technicalArrangement,{label:'Equipment arrangement',title:'Locate computing, network, storage and power dependencies',description:'Inspect representative cabinets containing compute hosts, switching and interface equipment, storage, distribution and UPS hardware. Applications may share or span hosts. Extra hardware alone establishes neither redundancy nor failover.',nodes:['Compute hosts','Network / interface hardware','Storage','Power support'],sources:['OC16','OC08','OC09']});
OCC_VIEW_DATA['occ-equipment'].variants=[technicalArrangement];
for(const [id,contexts]of Object.entries(OCC_CONTEXTS))if(contexts['occ-equipment'])contexts['occ-equipment']=['normal'];
for(const [id,value]of Object.entries(OCC_PRIMARY))if(value[0]==='occ-equipment')value[1]='normal';
const applicationCopy={
 'operations-signalling-workstation':{label:'Train supervision application',summary:'An ATS or traffic-management application presents train and route information through its defined signalling interfaces.',details:['The workstation is the physical access point; train supervision is a software function that can use shared or dedicated computing infrastructure.','The OCC application example follows track-section T1 occupation as an indication. It does not provide a command that changes the reported occupation state.','Service or route requests, interlocking decisions and train-protection duties remain different functions.'],sources:['O01','S10','OC16']},
 'operations-traffic-supervision':{label:'Traffic information at the OCC',details:['Train supervision can use interlocking and other defined train-position information. Its exact inputs depend on the signalling architecture.','Open Train supervision in OCC applications for a named track-section indication, its source and quality. A view of a reported state does not itself establish movement authority.'],sources:['O01','S10']},
 'occ-supervisory-request':{summary:'A named request is available only through an explicitly configured and permitted interface.',details:['Power, facility and telecom supervisory applications can expose different requests. The word SCADA does not by itself define the allowed command list.','The named telecom example is a configured equipment reset request. It is distinct from selecting a PA destination or handling a radio call in the service application.','Request delivery, permission, acceptance, returned condition and service performance are separate evidence. The trace compares them without operating any equipment.'],sources:['OC10','OC11','OC12','OC14']},
 'occ-field-indication':{summary:'A source reports a defined equipment or application condition with its identity and quality.',details:['A PA amplifier fault, camera response, breaker position and tunnel-fan condition have different meanings and owners. Name the actual source rather than treating every item as an anonymous field status.','Some conditions arrive directly; others pass through a controller, native manager or NMS. An aggregation can change detail and meaning, so its point definition matters.','A fresh returned observation is separate from evidence that a previous supervisory request caused a change.'],sources:['OC10','OC11','OC14']},
 'occ-information-quality':{summary:'Interpret point identity, validity, freshness and the defined time basis together.',details:['A link failure can make a value stale while the originating device continues operating; device failure and communications failure are distinct conditions.','The OCC inspector compares a fresh observation, unavailable path and missing feedback. It never replaces unavailable information with a fresh normal state.','Source time, receipt time, display time and record time can differ. Their meaning and clock basis belong in the actual interface definition.'],sources:['OC02','OC11','CM01']},
 'occ-record-timeline':{summary:'Retain the source, event meaning, quality and relevant time with an observation or request.',details:['A retained record is a software/data function. Its storage can share a host or use separate equipment; the history is not a freestanding room object.','Acknowledgement, request acceptance and a returned field condition are different records. An acknowledged alarm is not a repaired device.','The application trace retains the selected evidence or its unconfirmed quality. It claims no universal event order, clock accuracy or retention period.'],sources:['OC03','OC11','OC16']},
 'occ-passenger-communications':{details:['Passenger information and PA service applications select content and destinations, with configured routing and priority. A common HMI can integrate selected functions.','Equipment-health monitoring can be shared independently with telecom SCADA. An amplifier condition point is not the audio carried to a loudspeaker.','The native PA case study supports central fault monitoring and station/group announcement selection; a separate SCADA command mapping remains a project-specific option.'],sources:['OC12','OC13']}
};
for(const [id,patch]of Object.entries(applicationCopy)){const c=OCC_CONCEPTS.find(x=>x.id===id);if(c)Object.assign(c,patch);}

export function applyOccCatalog(SOURCES,CONCEPTS){
  for(const item of OCC_SOURCES){const found=SOURCES.find(s=>s.id===item.id);if(found)Object.assign(found,item);else SOURCES.push(item);}
  for(const item of OCC_CONCEPTS){const found=CONCEPTS.find(c=>c.id===item.id);if(found)Object.assign(found,item);else CONCEPTS.push(item);}
}
export function applyOccConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS}){
  Object.assign(NEW_VIEWS,OCC_VIEW_DATA);
  const operations=SYSTEMS.find(s=>s.id==='operations');
  if(operations)Object.assign(operations,{label:'Control centre',short:'Control centre',description:'The room, console and technical equipment, followed by the information they receive and display.',view:'operations-centre',component:'operations-centre',views:Object.keys(OCC_VIEW_DATA),parts:Object.keys(OCC_PRIMARY),groups:[
    {id:'occ-room',label:'Room & console',views:['operations-centre','occ-workplace'],parts:OCC_EQUIPMENT_BY_VIEW['operations-centre']},
    {id:'occ-equipment',label:'Technical equipment',views:['occ-equipment'],parts:OCC_EQUIPMENT_BY_VIEW['occ-equipment']},
    {id:'occ-information',label:'Applications & device points',views:['occ-supervision'],parts:OCC_INFORMATION_BY_VIEW['occ-supervision']}
  ]});
  for(const [id,[view,variant]]of Object.entries(OCC_PRIMARY)){
    PART_VIEWS[id]=view;PART_VARIANTS[id]=variant;
    PART_CONTEXTS[id]=Object.keys(OCC_CONTEXTS[id]);
    PART_VIEW_VARIANTS[id]=Object.fromEntries(Object.entries(OCC_CONTEXTS[id]).map(([v,variants])=>[v,[...variants]]));
  }
  for(const item of OCC_CONCEPTS)PART_RELATIONS[item.id]=item.related||[];
}
