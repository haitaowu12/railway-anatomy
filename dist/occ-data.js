// Original public-source workplace equipment and retained interface explanations.
// Deferred application/device-point studies remain in Git history (c292f20).
export const OCC_SOURCES = [
  {
    "id": "OC01",
    "title": "ROCC and Role: Implementation of operational control centres for resilience — ASPECT 2019 abstract",
    "publisher": "IRSE Netherlands",
    "url": "https://www.irse.nl/post/aspect-2019-conference-day-2",
    "description": "Read the Design Resilience section, “ROCC and Role”, for the relationship between operating responsibilities, people, processes and control-centre resilience.",
    "scope": "Public conference abstract only. It informs the functional overview; no source layout, staffing or system architecture is reproduced."
  },
  {
    "id": "OC02",
    "title": "Control room design",
    "publisher": "Health and Safety Executive",
    "url": "https://www.hse.gov.uk/comah/sragtech/techmeascontrol.htm",
    "description": "Read the human-interface, control and alarm sections for task analysis, visible action feedback, readable displays and the effect of the room environment.",
    "scope": "Industrial human-factors guidance, not a railway operating rule. Numerical limits and process-industry design prescriptions are not adopted."
  },
  {
    "id": "OC03",
    "title": "Better alarm handling — Chemical Information Sheet 6",
    "publisher": "Health and Safety Executive",
    "url": "https://www.hse.gov.uk/pubns/chis6.pdf",
    "description": "Read the discussion of nuisance alarms, standing alarms and operator understanding. It helps distinguish information volume from useful warning.",
    "scope": "General alarm-management principles from process industry. No alarm-rate target, priority scheme or railway response sequence is implied."
  },
  {
    "id": "OC04",
    "title": "Shift handover",
    "publisher": "Health and Safety Executive",
    "url": "https://www.hse.gov.uk/humanfactors/topics/shift-handover.htm",
    "description": "Read the preparation, two-way exchange and incoming cross-check sections, then compare them with the illustrated outstanding-items record.",
    "scope": "General communication guidance. This is not a railway transfer-of-control procedure or a prescribed form."
  },
  {
    "id": "OC05",
    "title": "Incident and Crisis Management for rail operations",
    "publisher": "Frequentis",
    "url": "https://www.frequentis.com/en/public-transport/incident-and-crisis-management",
    "description": "Read the workflow and mobile collaboration sections for links between control-room coordination, field reports and a shared incident record.",
    "scope": "Supplier example of incident-management functions. Its performance claims, product workflow and automated response features are not reproduced."
  },
  {
    "id": "OC06",
    "title": "LRG 29.0 Guidance for Human Factors in Operations Control Centres — public synopsis",
    "publisher": "Light Rail Safety and Standards Board",
    "url": "https://portal.lrssb.org/safety-hub/resources/83",
    "description": "The public synopsis identifies ergonomics, workload, team dynamics and HMI as connected design concerns. The full guidance is offered behind a human-verification step.",
    "scope": "Only the publicly accessible synopsis was reviewed; no claim relies on the gated document or treats its contents as implemented."
  },
  {
    "id": "OC07",
    "title": "TMS and further automation in control centres — IRSE lecture",
    "publisher": "Institution of Railway Signal Engineers",
    "url": "https://vimeo.com/508536363",
    "description": "Extended viewing on control-centre automation and the changing tasks of signallers, controllers and dispatchers.",
    "scope": "Public lecture listing used as further reading, not evidence of a watched transcript or a universal automation architecture."
  },
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
  },
  {
    "id": "OC10",
    "publisher": "Metrolinx",
    "title": "LRT Design Criteria Manual — C2.2.14 SCADA",
    "url": "https://assets.metrolinx.com/image/upload/Documents/Engineering/LRT_Design_Criteria_Manual_DCM_LRT-001_REV01.pdf",
    "description": "C2.2.14 includes communications equipment at stations, maintenance facilities and OCC within SCADA monitoring, alongside remote electronic equipment and facility control interfaces.",
    "scope": "Published 2016 design criteria, used as an example of scope. Its hardware, timing and capacity requirements are not adopted as a current universal railway specification."
  },
  {
    "id": "OC11",
    "publisher": "Racomm",
    "title": "Telecom SCADA — SANGAM",
    "url": "https://www.racomm.in/resource/Our-Offerings/Solutions/T-SCADA.aspx",
    "description": "Telecom SCADA can acquire status, alarms and events from telecom devices or their NMS: PA, PIDS, clocks, telephony, CCTV, transmission, access, recording, radio, UPS and BMS interfaces.",
    "scope": "Supplier architecture example. The public interface list mainly establishes health monitoring; it does not establish a permission or command list for each connected device."
  },
  {
    "id": "OC12",
    "publisher": "Siemens Mobility",
    "title": "Digital station solutions and railway communication",
    "url": "https://www.mobility.siemens.com/global/en/portfolio/digital-solutions-software/infrastructure/digital-station-solutions-and-railway-communication.html",
    "description": "Digital Station Manager combines SCADA, PIS/PA and CCTV functions with a common operator interface; the wider platform distinguishes Power SCADA, Facility SCADA and other services.",
    "scope": "Product capability example supporting integrated monitoring and controls. It does not establish that every railway uses integration or grants every function the same command rights."
  },
  {
    "id": "OC13",
    "publisher": "Zenitel",
    "title": "Public Address System for Scotland’s Railways",
    "url": "https://www.zenitel.com/news/scotlands-railway",
    "description": "Published supplier case study describes central remote fault monitoring, event logs, live and scheduled announcements and station/group selection for ScotRail PA.",
    "scope": "2024 supplier case study. Native PA service controls and diagnostics are evidenced; a separate SCADA command mapping is an explicit teaching option, not an asserted feature of that installation."
  },
  {
    "id": "OC14",
    "publisher": "Davicom",
    "title": "LMR site management for telecom and public safety",
    "url": "https://davicom.com/telecom-public-safety/",
    "description": "Remote telecom RTUs can combine dry contacts, analog values and device protocols, and can expose reset, power-cycle or backup-device control functions.",
    "scope": "Telecom equipment capability example, not evidence of installation on a named railway. The teaching reset request is available only when its specific interface is enabled; it is not an operating instruction."
  },
  {
    "id": "OC15",
    "publisher": "Los Angeles Metro",
    "title": "Public Transportation Agency Safety Plan — version 1.4, January 2025",
    "url": "https://libraryarchives.metro.net/dpgtl/planning/2025-01-lacmta-public-transportation-agency-safety-plan-version-1.4.pdf",
    "description": "Section E.1.1.2 identifies ROC train, power, communications and fire/life-safety responsibilities and a broad SCADA monitoring/control scope.",
    "scope": "One operator’s published scope. It does not provide the point list, control allocation or procedures for another railway."
  },
  {
    "id": "OC16",
    "publisher": "California High-Speed Rail Authority",
    "title": "Communications Systems Site Requirements — TM 3.4.2, revision 0",
    "url": "https://hsr.ca.gov/wp-content/uploads/docs/programs/eir_memos/Proj_Guidelines_TM3_4_2R00.pdf",
    "description": "Section 3.2.2 distinguishes physical OCC equipment including switches, NMS servers, radio equipment, CCTV storage, application servers, voice systems and their supporting facilities.",
    "scope": "2010 project planning memorandum. Used to distinguish equipment from hosted functions; quantities, layouts and deployment requirements are not reproduced."
  }
];

export const OCC_CONCEPTS = [
  {
    "id": "operations-centre",
    "label": "Operations control centre",
    "summary": "A control-room workplace connects people with applications whose equipment and field sources are distributed across the railway.",
    "details": [
      "Inspect the installed consoles, displays, input devices, voice terminals, cable routes and adjacent technical equipment. One workstation can access several applications, while one application can span several hosts.",
      "Use Interfaces to compare functional responsibilities and permitted exchanges.",
      "People, responsibilities, incident coordination and duty handover have their own People & processes pages. Room dimensions, staffing and system deployment are illustrative."
    ],
    "sources": [
      "OC01",
      "OC02",
      "OC10",
      "OC15",
      "OC16"
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
      "The desk supports displays, keyboard and pointing devices, an operational voice terminal and their connections. A screen is a physical output surface; the applications seen on it are separate functions.",
      "The local-computer example places a client near its peripherals. The remote-computer example uses a console-side interface to computing equipment elsewhere. The detailed model retains their installed relationship before a chosen assembly is opened.",
      "Computing, native service applications and field equipment remain separate dependencies. Use Interfaces to compare functional responsibilities and permitted exchanges."
    ],
    "sources": [
      "OC02",
      "OC08",
      "OC09",
      "OC16"
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
      "A local client can render application information near the console and connect to its displays and input devices. A remote client or KVM arrangement is another possible allocation.",
      "Its enclosure, connectors and computing hardware are physical anatomy. The model does not claim that receipt of a data packet makes a workstation mechanically move.",
      "An application can share hardware with other functions or run on several hosts. No specific manufacturer or railway deployment is reproduced."
    ],
    "sources": [
      "OC08",
      "OC09",
      "OC16"
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
      "The monitor is a physical display panel, enclosure, stand and connected electronics. Its decorative image is not a selectable railway system or an authoritative live status.",
      "Inspect the installed screen and its connections in the console context. Use Interfaces to examine the source, quality and permitted request.",
      "A picture alone does not establish that its underlying information is current, complete or authoritative."
    ],
    "sources": [
      "OC02",
      "OC09",
      "OC16"
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
    "label": "Application host",
    "summary": "Computing hardware provides one possible host for supervisory software.",
    "details": [
      "The physical model exposes a representative server enclosure, compute board, storage and connectors. A host is hardware; an application is a software function with an assigned scope.",
      "Several applications may share infrastructure, and one application can use multiple hosts. No one-rack-per-function deployment is implied.",
      "Host power, storage, transport and application state have separate dependencies. The model does not establish redundancy or failover."
    ],
    "sources": [
      "OC16",
      "OC09",
      "F17"
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
    "label": "Additional application host",
    "summary": "A second host illustrates a possible deployment choice, not proven redundancy.",
    "details": [
      "A second physical host can support another application or a configured redundant arrangement. Its presence alone establishes neither automatic failover nor synchronized state.",
      "Availability depends on software, data, networks, power and engineered switching between services. Power, transport and application dependencies must be assessed together."
    ],
    "sources": [
      "OC16",
      "OC09"
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
    "label": "Supervisory interface / gateway module",
    "summary": "An example hardware module connects or adapts defined system interfaces.",
    "details": [
      "A field-facing interface can be embedded in equipment, hosted by a controller or implemented as a separate gateway. This cabinet shows one physical allocation, not a mandatory gateway rack for every application.",
      "The acquisition boundary may be a device, PLC/RTU, signalling interface or native service application. Direct and management-mediated acquisition are distinct possibilities.",
      "Receiving a request does not establish permission, physical completion or restoration of a service."
    ],
    "sources": [
      "OC10",
      "OC11",
      "OC14",
      "F17"
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
    "label": "Traffic information at the OCC",
    "summary": "The displayed service picture is derived from reported railway information.",
    "details": [
      "Train supervision can use interlocking and other defined train-position information. Its exact inputs depend on the signalling architecture.",
      "A reported train-detection state does not itself establish movement authority."
    ],
    "sources": [
      "O01",
      "S10"
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
    "label": "Train supervision application",
    "summary": "An ATS or traffic-management application presents train and route information through its defined signalling interfaces.",
    "details": [
      "The workstation is the physical access point; train supervision is a software function that can use shared or dedicated computing infrastructure.",
      "A track-section indication does not provide a command to change reported occupation.",
      "Service or route requests, interlocking decisions and train-protection duties remain different functions."
    ],
    "sources": [
      "O01",
      "S10",
      "OC16"
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
    "label": "Facilities and environmental applications",
    "summary": "Present plant through its allocated facility SCADA, BAS or ventilation-control interfaces.",
    "details": [
      "An integrated display can contain selected BAS, TVCS and other facility points without assigning one controller ownership of all plant.",
      "Comfort fan AHU-01 is a BAS example; tunnel fan TVF-01 belongs to a ventilation-control example. Their source, native application, requested service and returned evidence are named separately.",
      "Communications-equipment SCADA is another application scope. Its device health and configured controls must not disappear into a traction-only or generic building-services explanation."
    ],
    "sources": [
      "CI01",
      "CI02",
      "CI03",
      "OC10",
      "OC11",
      "OC12"
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
    "summary": "A named request is available only through an explicitly configured and permitted interface.",
    "details": [
      "Power, facility and telecom supervisory applications can expose different requests. The word SCADA does not by itself define the permitted command list.",
      "A permitted telecom maintenance request is distinct from selecting a PA destination or handling a call in the native service application.",
      "Request delivery, permission, acceptance, returned condition and service performance are separate evidence. Compare these boundaries in Interfaces."
    ],
    "sources": [
      "OC10",
      "OC11",
      "OC12",
      "OC14"
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
    "summary": "A source reports a defined equipment or application condition with its identity and quality.",
    "details": [
      "A PA amplifier fault, camera response, breaker position and tunnel-fan condition have different meanings and owners. Name the actual source rather than treating every item as an anonymous field status.",
      "Some conditions arrive directly; others pass through a controller, native manager or NMS. An aggregation can change detail and meaning, so its point definition matters.",
      "A fresh returned observation is separate from evidence that a previous supervisory request caused a change."
    ],
    "sources": [
      "OC10",
      "OC11",
      "OC14"
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
    "summary": "Interpret point identity, validity, freshness and the defined time basis together.",
    "details": [
      "A link failure can make a value stale while the originating device continues operating; device failure and communications failure are distinct conditions.",
      "Compare current, unavailable and unconfirmed information in Interfaces. Unavailable data must not become a fresh normal state.",
      "Source time, receipt time, display time and record time can differ. Their meaning and clock basis belong in the actual interface definition."
    ],
    "sources": [
      "OC02",
      "OC11",
      "CM01"
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
    "summary": "Retain the source, event meaning, quality and relevant time with an observation or request.",
    "details": [
      "A retained record is a software/data function. Its storage can share a host or use separate equipment; the history is not a freestanding room object.",
      "Acknowledgement, request acceptance and a returned field condition are different records. An acknowledged alarm is not a repaired device.",
      "Retain the evidence with its quality; event order, clock accuracy and retention depend on the design."
    ],
    "sources": [
      "OC03",
      "OC11",
      "OC16"
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
      "Incident coordination is examined in People & processes. The equipment view connects the console tile with the camera, network and recorder.",
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
      "Passenger information and PA service applications select content and destinations, with configured routing and priority. A common HMI can integrate selected functions.",
      "Equipment-health monitoring can be shared independently with telecom SCADA. An amplifier condition point is not the audio carried to a loudspeaker.",
      "The native PA case study supports central fault monitoring and station/group announcement selection; a separate SCADA command mapping remains a project-specific option."
    ],
    "sources": [
      "OC12",
      "OC13"
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
  },
  {
    "id": "telecom-scada",
    "label": "Communications / telecom SCADA",
    "summary": "Supervise selected communications-equipment conditions and explicitly configured remote requests.",
    "details": [
      "A railway can allocate SCADA to telecom equipment as well as electrical and facility systems. The Metrolinx LRT criteria explicitly include communications-equipment monitoring; the Racomm example includes multiple telecom services and native-manager interfaces.",
      "Device condition, native service payload and equipment-maintenance requests are different exchanges. PA audio, CCTV video, radio calls and switch management do not become one generic SCADA payload.",
      "Native managers can supply diagnostic points; a separate NMS is not mandatory for direct acquisition. Exact point lists, command permissions and hosting vary by project."
    ],
    "sources": [
      "OC10",
      "OC11",
      "OC12",
      "OC14"
    ],
    "related": [
      "network-management",
      "pa-amplifier",
      "station-cctv",
      "station-radio",
      "interface-contract"
    ],
    "kind": "information",
    "caveat": "The named assets and trace states are fictional teaching examples, not an installed command list or operating procedure."
  }
];

export const OCC_CONCEPT_UPDATES = [];

export const OCC_TOPOLOGIES = {};

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
        "description": "Locate consoles, shared displays, cable routes and the adjacent technical equipment. Open an assembly to inspect physical connections; use Interfaces for functional responsibilities and information boundaries.",
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
        "motion": false
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
    "label": "Console & workstation",
    "title": "Inspect installed workplace equipment and its connections",
    "component": "occ-console",
    "level": "Assembly",
    "note": "A local client and a remote client/KVM arrangement are representative alternatives. Monitors are physical surfaces, not separate railway applications.",
    "variants": [
      {
        "id": "task",
        "label": "Local computer",
        "title": "A computer beside its display and input devices",
        "description": "Inspect the installed displays, keyboard, pointing device, voice terminal and local client. Cable routes connect these items while the application data is explored separately.",
        "nodes": [
          "Display connections",
          "Local client",
          "Input devices",
          "Voice terminal"
        ],
        "sources": [
          "OC02",
          "OC08"
        ],
        "component": "occ-task-display",
        "motion": false
      },
      {
        "id": "shared",
        "label": "Remote computer",
        "title": "A workplace connected to computing elsewhere",
        "description": "The console-side interface connects workplace displays and input devices to computing equipment elsewhere. Shared presentation uses a separate display-distribution function. This physical alternative does not establish service availability.",
        "nodes": [
          "Console peripherals",
          "KVM / client interface",
          "Remote host",
          "Shared display distribution"
        ],
        "sources": [
          "OC08",
          "OC09"
        ],
        "component": "occ-kvm-interface",
        "motion": false
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
        "label": "Equipment arrangement",
        "title": "Locate computing, network, storage and power dependencies",
        "description": "Inspect representative cabinets containing compute hosts, switching and interface equipment, storage, distribution and UPS hardware. Applications may share or span hosts. Extra hardware alone establishes neither redundancy nor failover.",
        "nodes": [
          "Compute hosts",
          "Network / interface hardware",
          "Storage",
          "Power support"
        ],
        "sources": [
          "OC16",
          "OC08",
          "OC09"
        ],
        "component": "occ-application-service",
        "motion": false
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
    "normal"
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
    "station-networks",
    "building"
  ],
  "operations-signalling-workstation": [
    "station-networks",
    "building"
  ],
  "operations-power-control": [
    "station-networks",
    "building"
  ],
  "operations-station-supervision": [
    "station-networks",
    "building"
  ],
  "occ-supervisory-request": [
    "station-networks",
    "building"
  ],
  "occ-field-indication": [
    "station-networks",
    "building"
  ],
  "occ-information-quality": [
    "station-networks",
    "building"
  ],
  "occ-record-timeline": [
    "station-networks",
    "building"
  ],
  "occ-alarm-queue": [
    "station-networks",
    "building"
  ],
  "occ-cctv-assessment": [
    "station-networks",
    "building"
  ],
  "occ-passenger-communications": [
    "station-networks",
    "building"
  ],
  "occ-access-supervision": [
    "station-networks",
    "building"
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
  ],
  "telecom-scada": [
    "station-networks",
    "building"
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
      "normal"
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
      "normal"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-equipment-cabinet": {
    "occ-equipment": [
      "normal"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "operations-equipment-room": {
    "occ-equipment": [
      "normal"
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
      "normal"
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
      "normal"
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
      "normal"
    ],
    "occ-incident": [
      "reported",
      "acknowledged",
      "coordinated"
    ]
  },
  "occ-application-service": {
    "occ-equipment": [
      "normal"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-alternate-service": {
    "occ-equipment": [
      "normal"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-supervisory-network": {
    "occ-equipment": [
      "normal"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-field-gateway": {
    "occ-equipment": [
      "normal"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "occ-uninterruptible-power": {
    "occ-equipment": [
      "normal"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "operations-event-recording": {
    "occ-equipment": [
      "normal"
    ],
    "operations-centre": [
      "service",
      "incident",
      "handover"
    ]
  },
  "operations-traffic-supervision": {
    "station-networks": [
      "building"
    ]
  },
  "operations-signalling-workstation": {
    "station-networks": [
      "building"
    ]
  },
  "operations-power-control": {
    "station-networks": [
      "building"
    ]
  },
  "operations-station-supervision": {
    "station-networks": [
      "building"
    ]
  },
  "occ-supervisory-request": {
    "station-networks": [
      "building"
    ]
  },
  "occ-field-indication": {
    "station-networks": [
      "building"
    ]
  },
  "occ-information-quality": {
    "station-networks": [
      "building"
    ]
  },
  "occ-record-timeline": {
    "station-networks": [
      "building"
    ]
  },
  "occ-alarm-queue": {
    "station-networks": [
      "building"
    ]
  },
  "occ-cctv-assessment": {
    "station-networks": [
      "building"
    ]
  },
  "occ-passenger-communications": {
    "station-networks": [
      "building"
    ]
  },
  "occ-access-supervision": {
    "station-networks": [
      "building"
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
  },
  "telecom-scada": {
    "station-networks": [
      "building"
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
    "occ-record-timeline",
    "telecom-scada"
  ],
  "occ-workplace": [
    "occ-information-quality",
    "occ-record-timeline",
    "occ-alarm-queue",
    "telecom-scada"
  ],
  "occ-equipment": [
    "occ-information-quality",
    "occ-record-timeline",
    "telecom-scada"
  ],
  "occ-incident": [
    "occ-alarm-queue",
    "occ-cctv-assessment",
    "occ-passenger-communications",
    "occ-access-supervision",
    "telecom-scada"
  ]
};

export const OCC_READING_GUIDES = [
  {
    "id": "control-centre-guide",
    "title": "From the control-room console to a railway observation",
    "summary": "Inspect the control room, workplace equipment and technical-room dependencies.",
    "sections": [
      {
        "heading": "Start with what occupies the room",
        "text": "A control centre contains consoles, displays, input devices, voice terminals, cabling and supporting technical equipment. A physical host and its software applications are different subjects. The model shows an original room arrangement, not an operator facility or staffing plan.",
        "sources": [
          "OC02",
          "OC16"
        ]
      },
      {
        "heading": "Follow the installed workplace connections",
        "text": "Local computing can sit near the keyboard and displays. A remote arrangement can use an interface carrying display and input information to computing equipment elsewhere. KVM is one possible technology family. One workstation can reach several applications, and one application can be distributed across hosts.",
        "sources": [
          "OC08",
          "OC09",
          "OC16"
        ]
      },
      {
        "heading": "Give communications SCADA its own scope",
        "text": "SCADA is not limited to traction power. The Metrolinx LRT design criteria include communications-equipment monitoring. Racomm publishes telecom SCADA acquisition from devices or native managers across several communications systems. PA audio, CCTV video and radio calls remain service payloads distinct from equipment-health points.",
        "sources": [
          "OC10",
          "OC11"
        ]
      },
      {
        "heading": "Name the point before drawing a connection",
        "text": "Name the asset, observed condition, originating device or controller, native service and selected supervisory interface. Telecom SCADA can be absent, monitoring only or configured for a named request. Other applications can remain native or share selected information and requests through a common HMI. Neither integration nor a particular NMS hop is universal.",
        "sources": [
          "OC11",
          "OC12",
          "OC13",
          "OC14"
        ]
      },
      {
        "heading": "Keep requests, outcomes and service performance separate",
        "text": "A received request is not an accepted request; an accepted request is not a completed change. Fresh returned equipment information is separate again from the performance of its service. A responding camera does not prove an appropriate view or recording; a healthy amplifier does not prove station-wide audibility. Interfaces compares unavailable feedback and refused requests without operating equipment.",
        "sources": [
          "OC02",
          "OC11",
          "OC13",
          "OC14"
        ]
      },
      {
        "heading": "Continue into the human work",
        "text": "Equipment and application views supply context for the separate People & processes studies. Alarm acknowledgement, incident coordination, resolution and duty handover are human activities with their own responsibilities and evidence. A stored record alone does not establish a repaired condition.",
        "sources": [
          "OC03",
          "OC04",
          "OC05",
          "OC15"
        ]
      }
    ],
    "sources": [
      "OC02",
      "OC03",
      "OC04",
      "OC05",
      "OC08",
      "OC09",
      "OC10",
      "OC11",
      "OC12",
      "OC13",
      "OC14",
      "OC15",
      "OC16"
    ]
  }
];

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
  ]});
  for(const [id,[view,variant]]of Object.entries(OCC_PRIMARY)){
    PART_VIEWS[id]=view;PART_VARIANTS[id]=variant;
    PART_CONTEXTS[id]=Object.keys(OCC_CONTEXTS[id]);
    PART_VIEW_VARIANTS[id]=Object.fromEntries(Object.entries(OCC_CONTEXTS[id]).map(([v,variants])=>[v,[...variants]]));
  }
  for(const item of OCC_CONCEPTS)PART_RELATIONS[item.id]=item.related||[];
}
