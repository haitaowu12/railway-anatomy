// Public-source learning studies. Every arrangement is an authored schematic.
export const STUDY_SOURCES = [
  {id:'E01',title:'AC traction power supply',publisher:'Siemens Mobility',url:'https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/electrification/ac-traction-power-supply.html',description:'Compare AC substation transformers, switchgear and overhead-line supply with the atlas’s DC example.',scope:'Public supplier overview. No equipment rating, protection setting or installed layout is adopted.'},
  {id:'E02',title:'Traction transformation — ABB Review 1/2012',publisher:'ABB',url:'https://library.e.abb.com/public/fc192d38056fa3b3c12579f20055483b/11-17%201m211_EN_72dpi.pdf',description:'Figure 2 and its explanation show a conventional AC train’s transformer, line converter, DC link and motor inverter, with rail return.',scope:'The conventional chain is the reference here. The article’s experimental power-electronic transformer, ratings and performance claims are not modeled.'},
  {id:'E03',title:'Traction Motor and Gear Box of Train Set — December 2019',publisher:'Indian Railways — CAMTECH',url:'https://indianrailways.gov.in/railwayboard/uploads/directorate/eff_res/camtech/ElectricalEngineering/YearWise/Booklet%20on%20Traction%20Motor%20and%20Gear%20Box%20of%20Train%20Set.pdf',description:'Chapter 2, Figure 8 and sections 2.1–2.2 provide an operator-side trainset example of overhead collection, transformer, converters and return through wheels and running rails.',scope:'Public railway training publication reviewed for the power architecture only. Fleet quantities, ratings, circuit details, maintenance and safety procedures are not adopted.'},
  {id:'H01',title:'Adhesion research',publisher:'RSSB',url:'https://www.rssb.co.uk/research/flagship-research-activities/adhesion/',description:'Read about low-adhesion conditions, wheel–rail response and research into sanding.',scope:'Qualitative principles only. No experimental stopping distance, friction coefficient or universal sanding outcome is transferred to this illustration.'},
  {id:'H02',title:'Adhesion and anti-skid systems',publisher:'Knorr-Bremse',url:'https://rail.knorr-bremse.com/en/us/portfolio/products-and-systems/braking-systems/adhesion/',description:'Public descriptions distinguish wheel-slide protection from equipment that delivers sand into the wheel–rail interface.',scope:'Supplier examples of mechanisms. Product performance figures, delivery rates and control algorithms are not adopted.'},
  {id:'I01',title:'Landslips',publisher:'Network Rail',url:'https://www.networkrail.co.uk/rail-travel/delays-explained/landslips/',description:'Relate slope observation, drainage and repair choices to the track supported above them.',scope:'Public infrastructure-manager explanation. No failure threshold or repair design is inferred.'},
  {id:'I02',title:'Inspecting our railway with the help of robots',publisher:'Network Rail',url:'https://www.networkrail.co.uk/stories/inspecting-our-railway-with-the-help-of-robots/',description:'A public example of examining difficult-to-reach infrastructure, including culverts under the track.',scope:'Inspection context, not an inspection procedure, completeness guarantee or prescribed robot arrangement.'},
  {id:'I03',title:'Bridges, tunnels and viaducts',publisher:'Network Rail',url:'https://www.networkrail.co.uk/our-work/looking-after-the-railway/bridges-tunnels-and-viaducts/',description:'Connect structures and their inspection with the surrounding railway infrastructure.',scope:'Public asset overview. The atlas bridge, bearings and watercourse are fictional and have no structural assessment.'},
  {id:'R01',title:'Guide to Operational Technology Security — NIST SP 800-82 Revision 3',publisher:'NIST',url:'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-82r3.pdf',description:'Sections on availability, contingency planning, backup and recovery support examining dependencies and restoration evidence.',scope:'September 2023 published revision; Revision 4 was listed as a draft at review. Generic OT guidance, not a railway security configuration or recovery guarantee.'},
  {id:'R02',title:'Zoning and Conduits for Railways',publisher:'ENISA',url:'https://www.enisa.europa.eu/publications/zoning-and-conduits-for-railways',description:'The 2022 report explains grouping railway assets into security zones and examining their connecting conduits.',scope:'Public report reviewed for system boundaries and interfaces. No real network, address, access rule or attack path is reproduced.'},
  {id:'A01',title:'Guide for the application of the PRM TSI — version 2.0, 2023',publisher:'European Union Agency for Railways',url:'https://www.era.europa.eu/system/files/2023-12/PRM_TSI_Guide.pdf',description:'Sections 3.2.2–3.2.4 connect obstacle-free routes, changes of level and route identification; other sections address information and boarding aids.',scope:'EU application guidance, not a universal accessibility standard. No dimensions or compliance result are inferred from schematic geometry.'},
  {id:'A02',title:'How to Use Accessible Transit',publisher:'TransLink',url:'https://www.translink.ca/rider-guide/transit-accessibility/how-to-use-accessible-transit',description:'The SkyTrain section connects elevator availability, passenger information and station assistance.',scope:'Public operator guidance used for interface questions. The fictional two-lift station is not a TransLink layout, current outage notice or passenger instruction.'},
  {id:'A03',title:'Platform for Change: Making rail journeys more accessible',publisher:'RNIB',url:'https://www.rnib.org.uk/professionals/research-and-data/reports-and-insight/platform-for-change-making-rail-journeys-more-accessible/',description:'The public research summary identifies barriers involving information, ticketing, station design, assistance and disruption.',scope:'Research summary concerning blind and partially sighted passengers. It does not represent every disabled passenger or validate this schematic route.'},
  {id:'Q01',title:'Certification Package Compilation Process — Revision 2.0',publisher:'Crossrail Learning Legacy',url:'https://learninglegacy.crossrail.co.uk/wp-content/uploads/2023/05/CRL1-XRL-O4-GUI-CR001-50009-Rev-2.0-Certification-Package-Compilation-Process.pdf',description:'The public record-package definition links design, construction, test, as-built, operational and maintenance records for an element of works.',scope:'Published project example, dated August 2017. The atlas uses fictional item versions and records, with no copied forms, identifiers or approval workflow.'},
  {id:'Q02',title:'Managing safety when investing in the rail network',publisher:'Office of Rail and Road',url:'https://www.orr.gov.uk/monitoring-regulation/rail/investing-rail-network/managing-safety',description:'Read how a proposed change is assessed for safety impact and significance, and when independent assessment is involved.',scope:'Great Britain mainline regulatory context. The atlas does not decide significance, perform an assessment or authorize a change.'},
];

const C=(id,label,summary,details,sources,related,primary)=>({id,label,summary,details,sources,related,primary});
export const STUDY_CONCEPTS = [
  C('supply-conversion','Supply conversion','Compare the complete wayside-to-vehicle energy chain.',[
    'AC and DC electrification allocate conversion differently. A conventional AC train carries a transformer and line converter; the selected DC example rectifies the supply at the wayside.',
    'Choose AC overhead or DC conductor to replace the supply equipment, collectors, onboard chain and return connections together. Both use a rotary drive in this self-contained study; your propulsion and train-control choices elsewhere stay stored independently.'
  ],['E01','E02','P01'],['transformer','rectifier','study-collector','study-return'],['electrification','dc']),
  C('study-collector','Current collection interface','The collector must match the supply arrangement.',[
    'A pantograph contacts the overhead wire in the AC example. The DC alternative uses a shoe contacting a separate conductor at track level.',
    'The roof collector and contact wire disappear together when DC is selected. This is an architectural comparison; it does not depict electrical clearances, section transitions or a switching procedure.'
  ],['E02','P01'],['collector','study-onboard-transformer','study-return'],['electrification','ac']),
  C('study-onboard-transformer','Onboard traction transformer','The conventional AC chain transforms voltage on the vehicle.',[
    'In the referenced conventional AC architecture, the onboard transformer feeds the line converter. It is separate from the supply transformer at the substation.',
    'The large core and winding assembly is present only in AC. In DC its place is left empty rather than retaining an incompatible transformer in the supply path.'
  ],['E02'],['study-collector','study-converter','transformer'],['electrification','ac']),
  C('study-converter','Line converter and DC link','An AC input can feed a DC intermediate link before the motor inverter.',[
    'The referenced conventional AC chain has a line converter, DC link and motor inverter. DC supply enters the illustrated onboard DC path without that AC line-conversion stage.',
    'Open the enclosure to examine the capacitor bank and separate converter module. Amber traces show supply-side connections and copper traces show the transformed secondary circuit; neither is a wiring design.'
  ],['E02','P04'],['study-onboard-transformer','study-drive','traction-inverter'],['electrification','ac']),
  C('study-drive','Motor inverter and axle drive','The final conversion and mechanical drive remain visible in both examples.',[
    'A motor inverter provides controlled electrical power to the rotary motor, which transmits torque to the wheelset.',
    'The motor, shaft and wheelset remain in both study arrangements while the upstream equipment changes. Trace the mechanical connection separately from the high-voltage supply loop.'
  ],['P04','E02'],['rotary-traction-motor','traction-gearbox','adhesion-contact'],['electrification','dc']),
  C('study-return','Traction return path','Follow the return to the source as carefully as the outgoing supply.',[
    'The conventional AC example uses wheel-to-running-rail return. The chosen DC comparison retains the atlas’s separate return conductor and collector, rather than implying that every DC railway uses the same arrangement.',
    'Cyan traces connect the appropriate return interface back to its supply equipment. The transformer’s primary return and secondary circuit remain separate. No neutral section, bonding design or touch-safe condition is modeled.'
  ],['E02','E03','P01'],['negative-rail','grounding','study-collector'],['electrification','ac']),

  C('adhesion-contact','Wheel–rail contact','Wheel rotation and vehicle travel can disagree.',[
    'Longitudinal force at a driven or braked wheel depends on the wheel–rail interface. A requested torque alone does not establish the force available at the rail.',
    'Compare rolling, wheel spin and wheel slide. The wheel centre advances in all three illustrations, but its rim marker turns at a different rate. These authored rates teach the distinction and predict no acceleration or stopping distance.'
  ],['H01','H02'],['bogie','rotary-traction-motor','adhesion-demand','depot-wheelset'],['adhesion','rolling']),
  C('adhesion-demand','Traction and brake demand','A demand is an input, while motion is an observed response.',[
    'Traction and braking request effort from equipment; available adhesion constrains how wheel torque becomes longitudinal contact force.',
    'The demand indicator is separate from the wheel rim and travel marker. Choosing slide retains a brake demand while reducing wheel rotation. The illustration concerns a wheel-driven vehicle and friction braking, not LIM thrust.'
  ],['H01','T08'],['adhesion-contact','brake-control','lim-primary'],['adhesion','slide']),
  C('adhesion-reference','Rotation and travel reference','Compare wheel speed with an independent motion cue.',[
    'Axle rotation supplies one measurement of motion. Sliding or spinning can make it disagree with vehicle travel; a real estimator needs appropriate evidence and uncertainty handling.',
    'The striped fixed reference and axle sensor remain separate. The travel marker follows the wheel centre, while the rim marker follows rotation. No measured speed or positioning algorithm is represented.'
  ],['T06','T07'],['tachometer','accelerometer','adhesion-contact'],['adhesion','slide']),
  C('adhesion-wsp','Wheel-slide protection','Brake modulation addresses wheel slide without commanding adhesion.',[
    'Wheel-slide protection monitors wheel behaviour and adjusts braking effort. Sanding is a different intervention at the contact interface.',
    'In the protection comparison, the brake actuator and demand indicator modulate while the wheel resumes rotation. This fixed teaching sequence is not a controller, an emergency response or proof of recovered braking performance.'
  ],['H02','T08'],['adhesion-brake','adhesion-sander','brake-control'],['adhesion','protection']),
  C('adhesion-sander','Sanding equipment','A reservoir and nozzle deliver material to the contact area.',[
    'Sanding equipment introduces sand between wheel and rail to help manage low adhesion. Delivery depends on the engineered installation and its controls.',
    'The sanding alternative exposes a reservoir, hose and nozzle. Grains move from that nozzle toward the rail ahead of the contact; the wheel response does not turn into a guaranteed normal state merely because grains appear.'
  ],['H01','H02'],['adhesion-contact','adhesion-wsp','depot-condition-monitoring'],['adhesion','sanding']),
  C('adhesion-brake','Disc brake and wheel response','Brake torque and wheel–rail force act at different interfaces.',[
    'The friction brake applies torque at its disc; the contact with the rail transmits longitudinal force to the vehicle.',
    'The caliper is mounted beside the wheel and remains connected to its actuator. Slide and protection change the wheel and brake cues without moving the fixed rail or the independent reference.'
  ],['T08','H02'],['brakes','adhesion-contact','depot-brake-test'],['adhesion','slide']),

  C('route-formation','Track formation and earthwork','Track support depends on the ground and its water conditions.',[
    'Earthworks and drainage form part of the infrastructure supporting the running railway. A visible track surface alone does not establish the condition of the supporting ground.',
    'The section exposes ballast, formation and an embankment beside a culvert and bridge. The same asset remains through inspection, work and recorded-check comparisons; no slope-stability calculation or restriction threshold is implied.'
  ],['I01'],['track-formation','route-drainage','route-bridge'],['infrastructure-care','inspect']),
  C('route-drainage','Drainage and outfall','Water needs a connected path beneath and away from the route.',[
    'Culverts carry water through the railway earthwork; inspecting difficult-to-reach sections is a distinct task from seeing the surface drain.',
    'The inspection view reveals a deposit obstructing the pipe. Work removes the deposit and adds a cleaning tool, while the outfall remains visible. Removing the visible obstruction alone does not verify the whole drainage system.'
  ],['I02','I01'],['route-inspection','route-record','route-formation'],['infrastructure-care','inspect']),
  C('route-bridge','Bridge and support interfaces','A structure connects the track load path with its supports.',[
    'Bridges, tunnels and viaducts need their own examination and maintenance alongside track and earthworks.',
    'The small bridge shows a deck, bearings, abutments and the watercourse below. An observation marker identifies a bearing location; drainage work does not erase that separate structural observation.'
  ],['I03'],['route-formation','route-inspection','route-record'],['infrastructure-care','inspect']),
  C('route-inspection','Inspection location and evidence','A recorded observation needs an identifiable asset and location.',[
    'Infrastructure inspection can require access to spaces that are hard to observe from the track. Measurement and visual evidence have a scope and a location.',
    'Select inspection to see a probe at the culvert and a separate bearing observation. The camera and record are linked by an information trace, distinct from the water path.'
  ],['I02','I03'],['route-drainage','route-bridge','route-record'],['infrastructure-care','inspect']),
  C('route-work-boundary','Infrastructure work boundary','The work area and the asset being repaired are separate objects.',[
    'Maintenance changes infrastructure within a defined work context. The atlas’s fixed boundary distinguishes the work location from its inspection and completion records.',
    'Work adds a cleaning hose and a bounded access area. The illustrated boundary is retained when a later check is recorded; it is not permission to enter the track or evidence of traffic protection.'
  ],['I01','I02'],['depot-personnel-protection','route-drainage','route-record'],['infrastructure-care','work']),
  C('route-record','Repair and follow-up record','Completed work and recorded verification answer different questions.',[
    'An inspection observation, a repair action and evidence from a follow-up check need to remain distinguishable.',
    'Work complete removes the cleaning tool but leaves an open record. Check recorded adds a separate inspection entry, while the bridge observation remains outstanding. Neither state clears a real restriction or releases a work boundary.'
  ],['I02','Q01'],['route-inspection','change-test','change-issues'],['infrastructure-care','check']),

  C('dependency-services','Shared-service dependencies','Two applications can lose a common dependency together.',[
    'Availability depends on supporting services as well as the application. A second path provides no independence from a dependency that both paths still share.',
    'Trace a station-information service and power-supervision service through different communication paths to one shared power bus. Losing that bus removes both traces; the field equipment remains in place.'
  ],['R01','R02'],['occ-application-service','dependency-power','dependency-network'],['dependencies','normal']),
  C('dependency-power','Shared electrical supply','Redundant data paths can still share electrical power.',[
    'OT availability planning includes power continuity and the dependencies behind redundant equipment.',
    'A single power bus feeds both application positions in this example. Power loss crosses out that bus and extinguishes both live service paths. The illustration assigns no backup duration or automatic failover.'
  ],['R01'],['occ-uninterruptible-power','dependency-services'],['dependencies','power-loss']),
  C('dependency-network','Communications paths and boundary','Independent paths need identifiable connections and boundaries.',[
    'Railway security zoning examines assets and the conduits between groups. A communications connection is only one part of the service dependency.',
    'Path A loss interrupts the upper conduit and retains the alternate path to the station interface. The power-supervision path shares the lost conduit and remains interrupted. Selecting an alternative does not imply it is automatically authorized.'
  ],['R02','R01'],['fiber-backbone','dependency-services','dependency-identity'],['dependencies','network-loss']),
  C('dependency-identity','Operator identity service','A working application does not establish permission to act.',[
    'Identity and access functions are separate dependencies from data transport and application execution.',
    'Identity unavailable retains the field-indication path but removes the illustrated operator-request connection. The selected example concerns a new request; it makes no claim about existing sessions or train movement authority.'
  ],['R01'],['dependency-network','occ-supervisory-request'],['dependencies','identity-loss']),
  C('dependency-configuration','Configuration consistency','A restored connection can carry information from an unconfirmed configuration.',[
    'Recovery includes system state, data, programs and configuration. Connectivity alone does not establish their consistency.',
    'Restored, unchecked reconnects the conduit while keeping a configuration mismatch and recording gap visible. Evidence checked adds separate configuration and record checks. This is a comparison, not an executed recovery procedure.'
  ],['R01'],['change-baseline','dependency-recovery','dependency-recording'],['dependencies','restored']),
  C('dependency-recording','Recording continuity','A working live display can coexist with a gap in the record.',[
    'Recording and recovery of data are distinct concerns from the availability of a live interface.',
    'Recorder unavailable interrupts only the record branch. A gap remains on the timeline after connectivity returns and after the selected checks; the model never fills missing history with invented events.'
  ],['R01'],['occ-record-timeline','dependency-configuration'],['dependencies','record-loss']),
  C('dependency-recovery','Restoration evidence','Recovering a service and checking its evidence are separate steps.',[
    'OT contingency planning includes recovery of relevant state and coordination of restoration activities.',
    'Compare restored connection with checked evidence. Field equipment never disappears, and recorded gaps remain. There is no recovery timer, cyberattack demonstration or claim of operational readiness.'
  ],['R01','R02'],['dependency-configuration','dependency-recording','change-acceptance'],['dependencies','checked']),

  C('access-entrance','Street-to-station entrance','The passenger journey begins before the platform.',[
    'An accessible station journey connects public areas and their interfaces. Step-free access is one need among several.',
    'The fictional station links its street entrance to a wide fare gate, lift, platform and boarding point. A tactile strip and information equipment remain visible alongside the step-free path.'
  ],['A01','A03'],['access-gate','access-information','station-egress'],['accessible-journey','available']),
  C('access-gate','Fare-gate passage','Ticketing and physical passage meet at the gate.',[
    'Ticketing, information and the physical station environment can each create a barrier to the journey.',
    'The wide passage is a distinct assembly with reader, gate leaves and a clear route through it. Its schematic width does not demonstrate accessibility compliance or replace a passenger’s need for assistance.'
  ],['A03','A01'],['access-entrance','access-assistance','access-information'],['accessible-journey','available']),
  C('access-lift','Lift and alternative route','An unavailable lift changes which route is usable.',[
    'Operators provide information about elevator availability because a passenger may depend on that connection.',
    'Lift unavailable breaks the near lift route and reveals the service message while retaining the stairs. Alternate lift highlights a different step-free path through the fictional station; it does not route a wheelchair user onto the stairs.'
  ],['A02','A01'],['access-information','access-assistance','access-entrance'],['accessible-journey','outage']),
  C('access-information','Wayfinding and journey information','Physical access and understandable information work together.',[
    'Route identification, readable information and consistent assistance matter through the journey. Research with blind and partially sighted passengers identifies barriers beyond changes of level.',
    'Tactile surfaces, an audible-information point and display are separately selectable equipment. An outage changes the route message and assistance link; those information paths do not become physical passenger routes.'
  ],['A01','A03'],['station-pis','station-pa','access-lift','access-assistance'],['accessible-journey','outage']),
  C('access-assistance','Passenger assistance interface','A help point connects a passenger need with a person or service.',[
    'Operator guidance connects station assistance with information about the facilities available for a journey.',
    'The help point has a distinct communications path to an assistance position. Choosing lift outage exposes that path without pretending that a displayed message or button press guarantees assistance has arrived.'
  ],['A02','A03'],['pa-intercom','access-lift','access-boarding'],['accessible-journey','outage']),
  C('access-boarding','Platform-to-vehicle boarding','Reaching the platform does not finish the boarding interface.',[
    'The platform edge, vehicle doorway and any boarding aid form another interface in the journey.',
    'Compare the available route with boarding aid required. The latter retains a visible gap and stops the route at the platform. Aid in place adds a bridging plate and extends the path into the doorway. No slope, gap tolerance, capacity or evacuation result is calculated.'
  ],['A01'],['platform-screen-door','doors','access-assistance'],['accessible-journey','aid-required']),

  C('change-item','Changed equipment item','Installed equipment has a configuration identity.',[
    'An assurance package connects the physical element with its design, test and as-built records.',
    'The fictional installed version B has two connectors. The earlier A configuration is identified by a single mark on its baseline and test records. Installation alone does not update the separate baseline and test record.'
  ],['Q01'],['change-baseline','change-interface','depot-maintenance-release'],['change-evidence','installed']),
  C('change-baseline','Configuration baseline','The record must identify the version actually installed.',[
    'Design, as-built and test information need an identifiable subject if they are to support a changed asset.',
    'Installed, unmatched leaves version A on the baseline while the physical module is B. Baseline matched changes the record to B but retains the old test subject. Matching records and successful testing remain separate comparisons.'
  ],['Q01'],['change-item','change-test','dependency-configuration'],['change-evidence','installed']),
  C('change-requirement','Requirement and verification question','Evidence needs a question that it can answer.',[
    'Change assessment considers the defined system and the safety implications of the change within its applicable context.',
    'The fictional requirement asks whether the replacement reports both input channels. It connects to a test record rather than directly to the acceptance record. No safety classification or formal requirement approval is performed.'
  ],['Q02','Q01'],['change-interface','change-test'],['change-evidence','baseline']),
  C('change-interface','Changed interface definition','A changed connector can affect more than the replaceable module.',[
    'A change can affect interfaces and supporting records as well as the component being replaced.',
    'The second connector and cable appear with version B. The interface sheet shows two connection points, while the old test record still refers to the earlier one-channel subject until the test comparison changes.'
  ],['Q01','Q02'],['change-item','change-requirement','change-test'],['change-evidence','baseline']),
  C('change-test','Test subject and result','A passing result for version A is not a result for version B.',[
    'The public record-package example includes test information alongside design, construction and as-built records.',
    'Test recorded replaces the old subject card and connects two channel traces to the version B record. An open issue remains. The illustrated pass marker concerns this fictional check alone, not all reliability, availability, maintainability or safety evidence.'
  ],['Q01'],['change-requirement','change-issues','depot-functional-checks'],['change-evidence','tested']),
  C('change-issues','Outstanding issues and RAMS questions','Different assurance questions can remain open after a functional check.',[
    'Evidence for a change can include unresolved issues and limits that must be considered by the responsible parties.',
    'The issue board separates reliability, availability, maintainability and safety questions. A maintainability-access issue remains in the tested comparison. Reviewed handover adds an explicit disposition record rather than erasing that history.'
  ],['Q01','Q02'],['change-test','change-acceptance','route-record'],['change-evidence','tested']),
  C('change-acceptance','Reviewed handover record','Evidence review and acceptance are accountable decisions.',[
    'Regulatory change assessment and project handover have defined responsibilities. Their exact process depends on the jurisdiction and project.',
    'Reviewed handover adds a fictional decision record connected to the B baseline, B test and issue disposition. It does not approve a real change, decide regulatory significance or grant movement permission.'
  ],['Q02','Q01'],['change-baseline','change-test','depot-maintenance-release','dependency-recovery'],['change-evidence','reviewed']),
];

const V=(id,label,title,description,nodes,sources,component)=>({id,label,title,description,nodes,sources,component});
const phases=(label,steps)=>({label,steps:steps.map(([at,label,description])=>({at,label,description}))});
export const STUDY_VIEWS = {
  electrification:{label:'Electrification chain',title:'Change the complete supply chain',component:'supply-conversion',domain:'power',parent:'system',motion:true,note:'Two self-contained rotary-drive examples. AC uses a conventional onboard transformer and rail return; the selected DC example uses separate outgoing and return conductors. No neutral sections, protection coordination or energized-work arrangements are modeled.',animation:phases('Trace the two electrical circuits',[[0,'Wayside supply','Begin at the supply transformer and selected distribution equipment.'],[.3,'Current collection','Follow the overhead pantograph or conductor-rail shoe.'],[.6,'Onboard conversion','AC adds an onboard transformer and line converter; the motor inverter remains in both examples.'],[1,'Return to source','Cyan follows the supply return. The AC transformer’s primary and secondary circuits remain separate.']]),variants:[
    V('dc','DC conductor','Rectify at the wayside','The selected DC example supplies an onboard DC path through a shoe. A separate return conductor completes this arrangement. The whole-chain study does not change stored technologies elsewhere.',['AC supply','Wayside transformer + rectifier','Conductor + shoe','DC link → inverter → axle drive','Separate DC return'],['P01','P04'],'supply-conversion'),
    V('ac','AC overhead','Transform and convert onboard','This conventional AC example pairs overhead collection and running-rail return with an onboard transformer, line converter, DC link and motor inverter. Both supply and vehicle equipment change together.',['Supply transformer','Overhead line + pantograph','Onboard transformer','Line converter → DC link → drive','Wheel + rail return'],['E01','E02'],'study-collector'),
  ]},
  adhesion:{label:'Wheel–rail response',title:'Compare demand with response',component:'adhesion-contact',domain:'vehicle',parent:'bogie',motion:true,note:'Qualitative wheel-driven and friction-braking examples. Wheel and travel rates are authored for explanation, not solved dynamics. LIM thrust, stopping distances, friction coefficients and controller thresholds are outside this study.',animation:phases('Read rotation against travel',[[0,'Start comparison','The wheel marker and fixed reference start from the same illustrative position.'],[.35,'Compare motion','The wheel centre travels while the rim follows the selected rolling, spin or slide cue.'],[.7,'Inspect the intervention','Protection modulates the brake cue; sanding delivers grains at a separate contact interface.'],[1,'Keep the evidence separate','A demand, wheel rotation and vehicle travel are three different observations.']]),variants:[
    V('rolling','Rolling','Rotation follows travel','The marker turns as the wheel centre advances along a fixed rail. This is the reference illustration, without a numerical speed.',['Demand','Wheel torque','Contact','Vehicle travel'],['H01'],'adhesion-contact'),
    V('spin','Wheel spin','More rotation is not more travel','The rim turns faster than the rolling comparison while the centre follows the same authored travel path. No traction coefficient is calculated.',['Traction demand','Fast wheel rotation','Limited contact response','Travel remains distinct'],['H01'],'adhesion-demand'),
    V('slide','Wheel slide','A slowing wheel can still be travelling','The brake remains applied while wheel rotation slows relative to travel. A wheel-distance estimate alone would not establish vehicle motion.',['Brake demand','Reduced wheel rotation','Vehicle still travels','Compare independent evidence'],['H01','T08'],'adhesion-brake'),
    V('protection','Slide protection','Modulate the brake effort','The actuator and brake cue modulate while wheel rotation resumes in an authored sequence. This is not a validated wheel-slide controller.',['Wheel observation','Brake modulation','Rotation response','Further evidence needed'],['H02','T08'],'adhesion-wsp'),
    V('sanding','Sanding','Treat the contact interface','The nozzle delivers grains ahead of the contact. Sanding and brake modulation are different mechanisms; the illustration does not guarantee restored adhesion.',['Reservoir','Hose + nozzle','Sand at contact','Observe response'],['H01','H02'],'adhesion-sander'),
  ]},
  'infrastructure-care':{label:'Infrastructure maintenance',title:'Connect condition, work and evidence',component:'route-formation',domain:'track',parent:'track-support',motion:false,note:'Fictional track, earthwork, culvert and bridge section. The comparisons retain separate drainage and bearing observations. No structural capacity, inspection interval, work protection or return-to-service decision is supplied.',variants:[
    V('inspect','Inspect','Locate the observed condition','A culvert probe and bearing marker identify different observations. A deposit obstructs the drain. Seeing one location does not establish the condition of the whole asset.',['Asset location','Observation','Inspection record','Open questions'],['I01','I02','I03'],'route-inspection'),
    V('work','Work in progress','Change the affected assembly','Cleaning equipment and a fixed work boundary appear; the visible drain obstruction is removed. The independent bearing observation remains.',['Work boundary','Drainage intervention','Changed condition','Check still needed'],['I01','I02'],'route-work-boundary'),
    V('complete','Work complete','Completion leaves verification open','The cleaning tool is removed. An open follow-up record remains beside the repaired drain and unchanged bridge observation.',['Work recorded','Tool removed','Check outstanding','Boundary retained'],['I02','Q01'],'route-record'),
    V('check','Check recorded','Record what was checked','A separate drainage inspection entry is added. The bearing observation and work boundary remain; this does not release the route.',['Drainage check','Recorded location','Other issue remains','Separate release decision'],['I02','I03','Q01'],'route-record'),
  ]},
  dependencies:{label:'Shared dependencies',title:'Find what the second path still shares',component:'dependency-services',domain:'operations',parent:'occ-equipment',motion:false,note:'Fictional station-information and power-supervision dependencies. Lines are logical service paths, not cable routes or security settings. Failures and restoration are chosen comparisons, with no timed failover or operational recovery claim.',variants:[
    V('normal','Connected','Two services, several dependencies','Trace application, communications, operator identity, configuration and recording separately. Both applications still share the power bus.',['Power + applications','Communications paths','Identity + configuration','Live service + record'],['R01','R02'],'dependency-services'),
    V('network-loss','Path A lost','An alternate path has a limited scope','The station-information service retains path B. Power supervision loses its path A connection. Shared power, identity and recording remain separate.',['Path A interrupted','Station path B retained','Power link lost','Field equipment remains'],['R01','R02'],'dependency-network'),
    V('power-loss','Shared power lost','Two paths can fail together','Both applications lose their shared supply and neither service trace remains live. The field interfaces remain physically present.',['Common power lost','Applications unavailable','Both service traces lost','Field equipment remains'],['R01'],'dependency-power'),
    V('identity-loss','Identity unavailable','Indications and a new request are different','The live indication path remains while the new operator-request path is disconnected. The example makes no statement about existing sessions.',['Indication retained','Identity unavailable','New request withheld','No movement-authority claim'],['R01'],'dependency-identity'),
    V('record-loss','Recorder unavailable','Live information can outlast recording','Live service paths remain while the recording branch is interrupted. A gap is visible in the record timeline.',['Live interface','Recorder disconnected','Record gap','Separate recovery evidence'],['R01'],'dependency-recording'),
    V('restored','Restored, unchecked','Connectivity is only one recovery condition','The conduit returns, but configuration consistency remains unconfirmed and the recording gap persists.',['Connection restored','Configuration mismatch','Record gap retained','Verification outstanding'],['R01'],'dependency-configuration'),
    V('checked','Evidence checked','Check the recovered state without inventing history','Separate configuration and recording checks appear. The earlier record gap remains visible, and this teaching selection does not authorize service.',['Connection present','Configuration checked','Recording checked','Historical gap retained'],['R01','R02'],'dependency-recovery'),
  ]},
  'accessible-journey':{label:'Accessible journey',title:'Follow the passenger’s complete route',component:'access-entrance',domain:'station',parent:'station',motion:false,note:'Fictional two-lift station. The teal path is a selected step-free route, violet links carry information or assistance, and the tactile strip is separate. Geometry proves no accessibility compliance, capacity or evacuation performance.',variants:[
    V('available','Route available','Connect the street, station and train','Follow the wide gate and near lift to the platform and doorway. Tactile, visual and audible information remain distinct from the step-free path.',['Street','Gate','Lift','Platform','Boarding'],['A01','A02'],'access-entrance'),
    V('outage','Lift unavailable','An outage breaks this route','The near lift is unavailable and the route stops before it. Stairs remain in place, with a separate service message and help connection. No accessible detour is assumed.',['Street + gate','Lift unavailable','Route interrupted','Information + assistance'],['A02','A03'],'access-lift'),
    V('alternative','Alternate lift','A different usable route needs information','The fictional second lift and the route to it become the selected connection. The failed near lift and outage message remain visible.',['Gate','Alternative approach','Second lift','Platform + train'],['A01','A02'],'access-information'),
    V('aid-required','Boarding aid needed','A platform route can stop at the vehicle interface','The lift route reaches the platform, but a visible gap interrupts boarding. A separate assistance connection identifies the next interface.',['Street → platform','Boarding gap','Assistance interface','Boarding unresolved'],['A01','A03'],'access-boarding'),
    V('aid-placed','Aid in place','Connect the platform and doorway','A bridging plate appears across the illustrative gap and the path extends into the doorway. This is an arrangement comparison, not a ramp-deployment procedure.',['Platform','Bridging plate','Doorway','Vehicle interior'],['A01'],'access-boarding'),
  ]},
  'change-evidence':{label:'Configuration & handover',title:'Match the evidence to the changed item',component:'change-item',domain:'depot',parent:'depot-testing',motion:false,note:'Fictional module versions A and B, requirement, interfaces, test and issue records. No real equipment identifiers, project forms or approval responsibilities are reproduced. A selected comparison does not perform assurance or authorize use.',variants:[
    V('installed','Installed, unmatched','The module changed; its evidence did not','Version B has two connectors, while the baseline and test still identify version A. A visible installed item is not a complete handover.',['B installed','A baseline','A test subject','Mismatch'],['Q01'],'change-baseline'),
    V('baseline','Baseline matched','A matching baseline does not retest the equipment','The baseline and interface record now identify B. The old A test and open issue remain.',['B installed','B baseline + interface','A test subject','Check still needed'],['Q01','Q02'],'change-interface'),
    V('tested','Test recorded','A test result has a specific subject','The two channel traces connect to the B test record. The maintainability issue remains open, alongside separate reliability, availability and safety questions.',['B configuration','Two-channel check','B test record','Open issue retained'],['Q01'],'change-test'),
    V('reviewed','Reviewed handover','Connect the decision with its evidence','A fictional reviewed decision links the B baseline and B test to an explicit issue disposition. The issue history remains; no general compliance or movement permission is implied.',['B baseline','B test','Issue disposition','Reviewed decision'],['Q01','Q02'],'change-acceptance'),
  ]},
};

export function applyStudyCatalog(sources,concepts){
  sources.push(...STUDY_SOURCES);
  concepts.push(...STUDY_CONCEPTS.map(({primary,...c})=>c));
}
export function applyStudyConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS}){
  Object.assign(NEW_VIEWS,STUDY_VIEWS);
  for(const [id,v]of Object.entries(STUDY_VIEWS))SYSTEMS.find(d=>d.id===v.domain).views.push(id);
  for(const c of STUDY_CONCEPTS){
    const [view,variant]=c.primary;
    SYSTEMS.find(d=>d.id===STUDY_VIEWS[view].domain).parts.push(c.id);
    PART_VIEWS[c.id]=view;PART_VARIANTS[c.id]=variant;PART_CONTEXTS[c.id]=[view];
    PART_VIEW_VARIANTS[c.id]={[view]:STUDY_VIEWS[view].variants.map(v=>v.id)};
    // Only the AC-only transformer has a restricted visible context.
    if(c.id==='study-onboard-transformer')PART_VIEW_VARIANTS[c.id][view]=['ac'];
    PART_RELATIONS[c.id]=c.related;
    for(const related of c.related)PART_RELATIONS[related]=[...new Set([...(PART_RELATIONS[related]||[]),c.id])];
  }
}
