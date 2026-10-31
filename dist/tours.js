import {EXTRA_TOURS} from './expansion-data.js';
export const TOURS = [
  {
    "id": "station-context",
    "label": "01 · Read the whole station",
    "title": "A visible device has a supporting system",
    "domain": "station",
    "view": "station",
    "component": "station-pa",
    "explanation": "Start with the passenger space, then look behind it. A speaker needs an audio path and electrical power; a display needs information; plant equipment needs local controls. The cutaway places these relationships together without claiming that they share one controller.",
    "actionText": "Switch between the whole station and equipment emphasis.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "station",
      "component": "station-pa",
      "variant": "all",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Does a common supervisory screen mean every subsystem has the same local controller?",
    "choices": [
      "Yes",
      "No",
      "Only at the platform"
    ],
    "answer": 1,
    "feedback": [
      "A screen can combine information from different equipment.",
      "Correct. Shared supervision does not erase local system boundaries.",
      "Location does not determine the control architecture."
    ],
    "sourceConcepts": [
      "station-pa",
      "station-scada",
      "bas-controller"
    ]
  },
  {
    "id": "track-foundations",
    "label": "02 · Compare track support",
    "title": "Follow the wheel load into the foundation",
    "domain": "track",
    "view": "track-support",
    "component": "track-ballasted",
    "explanation": "The running rail is one part of a support assembly. Compare ballasted, direct-fixation and embedded examples. Watch how the intermediate layers change while the need to support and restrain the rail remains. The arrows illustrate a load path, not calculated stress.",
    "actionText": "Compare all three support presets, keeping the rail interface in view.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "track-support",
      "component": "track-ballasted",
      "variant": "ballasted",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Does a slab remove the need for a designed resilient rail interface?",
    "choices": [
      "Yes, concrete is enough",
      "No",
      "Only on curves"
    ],
    "answer": 1,
    "feedback": [
      "The rail interface still has support and restraint functions.",
      "Correct. The selected fastening and resilient interfaces remain part of the design.",
      "This distinction is not limited to curves."
    ],
    "sourceConcepts": [
      "track-ballasted",
      "track-slab",
      "track-direct-fixation",
      "track-embedded"
    ]
  },
  {
    "id": "rail-seat",
    "label": "03 · Open a rail fastening",
    "title": "One small assembly performs several jobs",
    "domain": "track",
    "view": "rail-fastening",
    "component": "track-rail-clip",
    "explanation": "A pad supports an interface, a clip provides restraint, and insulating pieces have their own role. Separate the assembly and identify the contacts instead of treating all hardware around the rail foot as interchangeable. The shown clip is an authored schematic.",
    "actionText": "Separate the stack, then reconnect each layer to the rail foot.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "rail-fastening",
      "component": "track-rail-clip",
      "variant": "sleeper",
      "exploded": 0.6,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Which illustrated part provides elastic rail restraint?",
    "choices": [
      "A loudspeaker",
      "A rail clip",
      "A balise"
    ],
    "answer": 1,
    "feedback": [
      "The speaker is an audio output device.",
      "Yes. The clip is part of the selected restraint arrangement.",
      "A balise exchanges information with passing equipment."
    ],
    "sourceConcepts": [
      "track-rail-clip",
      "track-rail-pad",
      "track-insulator",
      "track-baseplate"
    ]
  },
  {
    "id": "point-proof",
    "label": "04 · Separate movement from proof",
    "title": "A switch command is not a position indication",
    "domain": "track",
    "view": "switch-drive",
    "component": "track-point-detection",
    "explanation": "Trace the switch drive, mechanical linkage and position indication separately. In the unproved example, a movement command is present but the proof condition is incomplete. The control system cannot substitute the command for confirmation of the required state.",
    "actionText": "Compare proved and unproved indications while inspecting the linkage.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "switch-drive",
      "component": "track-point-detection",
      "variant": "unproved",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Which statement is supported by a command to move a switch?",
    "choices": [
      "The required position is proved",
      "A movement was requested",
      "The route is definitely clear"
    ],
    "answer": 1,
    "feedback": [
      "Proof comes from the selected feedback and checking arrangement.",
      "Correct. Request and confirmed state are different.",
      "A route needs more than a movement command."
    ],
    "sourceConcepts": [
      "track-point-machine",
      "track-stretcher",
      "track-point-detection",
      "interlocking"
    ]
  },
  {
    "id": "energy-journey",
    "label": "05 · Follow the energy",
    "title": "From supply to motion",
    "domain": "power",
    "view": "system",
    "component": "utility",
    "explanation": "Follow the illustrated circuit: AC supply, transformer, rectifier, DC conductors, onboard converter and motor. Energy changes form along the way; the return conductor completes the electrical path.",
    "actionText": "Trace the energized path from the substation to the train.",
    "actionLabel": "Follow power",
    "action": {
      "view": "system",
      "component": "utility",
      "mode": "motoring",
      "scenario": "nominal"
    },
    "question": "Which component converts incoming AC to DC?",
    "choices": [
      "A rectifier",
      "A balise",
      "A passenger display"
    ],
    "answer": 0,
    "feedback": [
      "Yes. Rectification supplies the DC side.",
      "A balise provides information, not traction power conversion.",
      "A display consumes auxiliary power."
    ],
    "sourceConcepts": [
      "utility",
      "transformer",
      "rectifier",
      "negative-rail",
      "traction-inverter"
    ]
  },
  {
    "id": "four-rail-roles",
    "label": "06 · Read the guideway",
    "title": "Similar shapes, different jobs",
    "domain": "track",
    "view": "guideway",
    "component": "reaction-rail",
    "explanation": "This example separates the outgoing conductor, return conductor, wheel-supporting rails and LIM reaction rail. Identify each by function. The reaction rail is the motor's secondary; it is not the illustrated normal traction-current return.",
    "actionText": "Compare the four labelled guideway functions.",
    "actionLabel": "Inspect the rails",
    "action": {
      "view": "guideway",
      "component": "reaction-rail",
      "mode": "motoring",
      "scenario": "nominal"
    },
    "question": "Which element interacts magnetically with the LIM primary?",
    "choices": [
      "The passenger antenna",
      "The reaction rail",
      "The HVAC duct"
    ],
    "answer": 1,
    "feedback": [
      "The antenna carries radio signals.",
      "Yes. Primary and reaction rail form the linear motor.",
      "The duct distributes air."
    ],
    "sourceConcepts": [
      "positive-rail",
      "negative-rail",
      "running-rail",
      "reaction-rail"
    ]
  },
  {
    "id": "linear-motor",
    "label": "07 · Make thrust",
    "title": "A motor stretched along the track",
    "domain": "vehicle",
    "view": "lim",
    "component": "lim-primary",
    "explanation": "The inverter energizes the primary to create a travelling magnetic field. Induced currents in the reaction rail interact with that field to produce thrust. Wheels support and guide this vehicle; the LIM produces force across its air gap.",
    "actionText": "Inspect the primary and secondary together. Use the phase slider to follow the field cue.",
    "actionLabel": "Follow the field",
    "action": {
      "view": "lim",
      "component": "lim-primary",
      "exploded": 0,
      "mode": "motoring",
      "scenario": "nominal"
    },
    "question": "Where does the LIM develop its propulsive interaction?",
    "choices": [
      "Inside the passenger display",
      "Across the primary–reaction-rail gap",
      "Through the radio antenna"
    ],
    "answer": 1,
    "feedback": [
      "Displays provide information.",
      "Yes. Electromagnetic interaction produces linear force.",
      "Radio carries information, not propulsion force."
    ],
    "sourceConcepts": [
      "traction-inverter",
      "lim-primary",
      "reaction-rail",
      "motor-slip"
    ]
  },
  {
    "id": "braking-destinations",
    "label": "08 · Slow the train",
    "title": "Braking energy needs somewhere to go",
    "domain": "vehicle",
    "view": "vehicle",
    "component": "regeneration",
    "explanation": "During regenerative braking, mechanical energy becomes electrical energy. Acceptance by the supply network is conditional. Explore the limited-receptivity example and its alternative energy paths. Electrical braking and friction braking are coordinated; their actual arrangements vary.",
    "actionText": "Limit regeneration and inspect the alternative braking paths.",
    "actionLabel": "Limit energy acceptance",
    "action": {
      "view": "vehicle",
      "component": "regeneration",
      "cutaway": true,
      "mode": "regeneration",
      "scenario": "regen-limited"
    },
    "question": "Is every unit of braking energy always returned to the grid?",
    "choices": [
      "Yes, automatically",
      "Only at stations",
      "No; acceptance and equipment matter"
    ],
    "answer": 2,
    "feedback": [
      "A usable receiving path is needed.",
      "Station location alone does not decide energy acceptance.",
      "Yes. Follow the available destinations in this example."
    ],
    "sourceConcepts": [
      "regeneration",
      "brakes",
      "wayside-resistor"
    ]
  },
  {
    "id": "control-responsibilities",
    "label": "09 · Separate the decisions",
    "title": "Protect, drive and supervise",
    "domain": "control",
    "view": "control",
    "component": "atp",
    "explanation": "Read three layers together: ATP supervises limits, ATO manages driving, and ATS coordinates the service. A request to improve punctuality cannot itself enlarge the permitted operating envelope.",
    "actionText": "Follow the request, limit and vehicle response together.",
    "actionLabel": "Trace control",
    "action": {
      "view": "control",
      "component": "atp",
      "cutaway": true,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Which role coordinates the overall service?",
    "choices": [
      "ATS",
      "The traction rectifier",
      "The antenna"
    ],
    "answer": 0,
    "feedback": [
      "Yes. Supervision concerns the service across the railway.",
      "The rectifier converts electrical power.",
      "The antenna supports communication."
    ],
    "sourceConcepts": [
      "atp",
      "ato",
      "ats",
      "train-control",
      "tcms"
    ]
  },
  {
    "id": "cbtc-layers",
    "label": "10 · Trace CBTC responsibilities",
    "title": "A radio link is not the whole control system",
    "domain": "control",
    "view": "cbtc-network",
    "component": "cbtc",
    "explanation": "Follow a position estimate into a train report, then follow returned movement information into onboard supervision. Compare this with the driving request and physical vehicle response. The model shows one allocation of responsibilities; CBTC suppliers may distribute them differently.",
    "actionText": "Trace the information exchange, protection function and driving function.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "cbtc-network",
      "component": "cbtc",
      "variant": "normal",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Does receiving a radio packet by itself explain every decision governing movement?",
    "choices": [
      "Yes",
      "No",
      "Only when the antenna is on the roof"
    ],
    "answer": 1,
    "feedback": [
      "Transporting information is one part of the architecture.",
      "Correct. Interpretation, protection, localization and driving still need explicit roles.",
      "Antenna location does not define those responsibilities."
    ],
    "sourceConcepts": [
      "cbtc",
      "odometry",
      "movement-authority",
      "atp",
      "ato",
      "train-radio"
    ]
  },
  {
    "id": "detect-reference",
    "label": "11 · Compare detection devices",
    "title": "Occupancy and location reference differ",
    "domain": "control",
    "view": "train-detection",
    "component": "balise",
    "explanation": "Compare a track circuit, an axle counter and a balise. The first two illustrate section-occupancy detection arrangements; a balise exchanges information at a passing location. Similar trackside placement does not make their information roles identical.",
    "actionText": "Switch through the three device views and identify each input and output.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "train-detection",
      "component": "balise",
      "variant": "balise",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Which device in this comparison provides a passing reference rather than an occupancy section?",
    "choices": [
      "The balise",
      "The selected track circuit",
      "The selected axle-counter section"
    ],
    "answer": 0,
    "feedback": [
      "Correct. It exchanges information at a passing point.",
      "The selected track circuit is used for section detection.",
      "The selected counter arrangement evaluates section entry and exit."
    ],
    "sourceConcepts": [
      "track-circuit",
      "axle-counter",
      "balise"
    ]
  },
  {
    "id": "odometry-error",
    "label": "12 · Check the estimate",
    "title": "Motion sensing includes uncertainty",
    "domain": "control",
    "view": "bogie",
    "component": "tachometer",
    "explanation": "Arithmetic example: a distance estimate biased 10% high reports 110 m for an actual 100 m. This is an invented error, not a vehicle specification. Sliding wheels can cause different errors; independent measurements and position references help reveal disagreement.",
    "actionText": "Compare the wheel estimate with the independent reference.",
    "actionLabel": "Inspect sensor disagreement",
    "action": {
      "view": "bogie",
      "component": "tachometer",
      "cutaway": true,
      "mode": "coasting",
      "scenario": "wheel-slip"
    },
    "question": "How much does this arithmetic example overestimate distance?",
    "choices": [
      "1 m",
      "10 m",
      "100 m"
    ],
    "answer": 1,
    "feedback": [
      "Subtract the actual 100 m from the reported 110 m.",
      "Correct: 110 − 100 = 10 m.",
      "100 m is the actual journey in this example."
    ],
    "sourceConcepts": [
      "tachometer",
      "accelerometer",
      "balise"
    ]
  },
  {
    "id": "seltrac-generations",
    "label": "13 · Read SelTrac in context",
    "title": "A product family changes across generations",
    "domain": "control",
    "view": "seltrac",
    "component": "seltrac",
    "explanation": "Compare the historical inductive-loop example with published radio communications and the 2026 SelTrac G9 description. The teaching view separates a communication medium, a control function and its hosting environment. It does not imply that every installed railway uses the latest architecture.",
    "actionText": "Inspect loop, radio and G9 views with their different source boundaries.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "seltrac",
      "component": "seltrac",
      "variant": "radio",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Does a current product announcement establish the architecture of every existing installation?",
    "choices": [
      "Yes",
      "No",
      "Only if the brand name is unchanged"
    ],
    "answer": 1,
    "feedback": [
      "Existing installations can differ in generation and configuration.",
      "Correct. Match a claim to its generation and evidence.",
      "A shared product name does not prove identical equipment."
    ],
    "sourceConcepts": [
      "seltrac",
      "seltrac-loop",
      "seltrac-g9"
    ]
  },
  {
    "id": "etcs-supervision",
    "label": "14 · Compare ETCS examples",
    "title": "Information updates and supervision are different",
    "domain": "control",
    "view": "etcs",
    "component": "etcs-level-1",
    "explanation": "In the selected Level 1 example, a balise telegram reaches the train at a passing point while onboard supervision continues. Level 2 introduces the illustrated RBC radio exchange. An ETCS level alone does not establish the block principle or automation grade.",
    "actionText": "Compare the LEU and balise path with the RBC and radio path.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "etcs",
      "component": "etcs-level-1",
      "variant": "level-1",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Does the selected Level 1 example stop supervising the train between balise passages?",
    "choices": [
      "Yes",
      "No",
      "Only when the display is off"
    ],
    "answer": 1,
    "feedback": [
      "A passing update is not the same as intermittent onboard supervision.",
      "Correct. Onboard supervision continues between the illustrated updates.",
      "Display state does not define this principle."
    ],
    "sourceConcepts": [
      "etcs-level-1",
      "etcs-level-2",
      "leu",
      "rbc",
      "etcs-onboard"
    ]
  },
  {
    "id": "communications-roles",
    "label": "15 · Follow the messages",
    "title": "One train, several information services",
    "domain": "communications",
    "view": "communications",
    "component": "train-radio",
    "explanation": "Compare control data, operational voice, announcements, intercom and video. They serve different purposes even where infrastructure is shared. In this authored radio-loss example, passenger-service activity cannot demonstrate current movement permission; real timeout and degraded-operation rules vary.",
    "actionText": "Hold control updates and compare the labelled information paths.",
    "actionLabel": "Compare communication roles",
    "action": {
      "view": "communications",
      "component": "train-radio",
      "cutaway": true,
      "mode": "coasting",
      "scenario": "radio-loss"
    },
    "question": "Does a working passenger display prove current movement permission?",
    "choices": [
      "Yes",
      "Only when the screen is bright",
      "No"
    ],
    "answer": 2,
    "feedback": [
      "These are different functions.",
      "Brightness says nothing about control-message validity.",
      "Correct. Service information and control permission have distinct roles."
    ],
    "sourceConcepts": [
      "train-radio",
      "train-network",
      "passenger-info",
      "pa-intercom",
      "cctv"
    ]
  },
  {
    "id": "onboard-services",
    "label": "16 · Keep the vehicle working",
    "title": "A train needs more than propulsion",
    "domain": "vehicle",
    "view": "services",
    "component": "apu",
    "explanation": "Explore auxiliary power, HVAC, lighting, doors, air supply and onboard electronics. Distinguish electrical supply from control commands. The battery supports selected functions according to the vehicle design; it does not automatically power every load indefinitely.",
    "actionText": "Open the equipment zones and trace their supporting systems.",
    "actionLabel": "Explore onboard services",
    "action": {
      "view": "services",
      "component": "apu",
      "cutaway": true,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Which component converts electrical supply for supporting loads?",
    "choices": [
      "The auxiliary power converter",
      "The balise",
      "The passenger speaker"
    ],
    "answer": 0,
    "feedback": [
      "Yes. The APU supplies auxiliary systems.",
      "A balise provides a position reference.",
      "A speaker is an auxiliary load."
    ],
    "sourceConcepts": [
      "apu",
      "vehicle-battery",
      "hvac",
      "compressor",
      "doors",
      "tcms"
    ]
  },
  {
    "id": "station-announcements",
    "label": "17 · Follow a station announcement",
    "title": "Audio needs more than a message",
    "domain": "station",
    "view": "station",
    "component": "station-pa",
    "explanation": "Follow audio from its source through routing, amplification and loudspeakers. Compare this with a passenger-information display and an emergency intercom. These devices may be coordinated, but they have distinct output, power and communication requirements.",
    "actionText": "Inspect the public devices, then jump to their equipment context.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "station",
      "component": "station-pa",
      "variant": "passenger",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "What does a speaker-driving amplifier add to the announcement path?",
    "choices": [
      "The mechanical train route",
      "Electrical power for the speaker circuit",
      "A new movement authority"
    ],
    "answer": 1,
    "feedback": [
      "The audio system does not set the railway route.",
      "Correct. Message routing and speaker-driving power are different functions.",
      "Passenger audio does not grant train movement permission."
    ],
    "sourceConcepts": [
      "station-pa",
      "station-pis",
      "emergency-intercom"
    ]
  },
  {
    "id": "supervisory-boundaries",
    "label": "18 · Compare SCADA and BAS",
    "title": "A dashboard is not the local control loop",
    "domain": "station",
    "view": "station-networks",
    "component": "station-scada",
    "explanation": "Compare electrical supervision, station supervision and building automation. A local protection device, plant controller and supervisory workstation have different responsibilities. The coloured lines show logical interfaces without claiming a mandatory physical network or a universal command priority.",
    "actionText": "Switch between power, station and building views.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "station-networks",
      "component": "station-scada",
      "variant": "station",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Where does the illustrated building-control loop connect a measurement to an actuator command?",
    "choices": [
      "Only in a passenger display",
      "Through the BAS controller",
      "In a rail clip"
    ],
    "answer": 1,
    "feedback": [
      "A display is not the selected plant controller.",
      "Correct. The local controller uses measurements to drive the selected plant interface.",
      "A rail clip is a mechanical restraint."
    ],
    "sourceConcepts": [
      "power-scada",
      "station-scada",
      "bas-controller",
      "bas-sensor",
      "bas-actuator"
    ]
  },
  {
    "id": "fire-functions",
    "label": "19 · Separate fire and life-safety functions",
    "title": "Related systems are not one automatic chain",
    "domain": "station",
    "view": "fire-systems",
    "component": "flss",
    "explanation": "Compare detection, notification, emergency communication, lighting, egress and water-based protection. The view shows their interfaces without creating a generic cause-and-effect sequence. In a conventional thermal sprinkler, heat operates the individual sprinkler element.",
    "actionText": "Compare detect, communicate and water-protection emphases.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "fire-systems",
      "component": "flss",
      "variant": "detect",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Does a fire detector universally open every conventional thermal sprinkler?",
    "choices": [
      "Yes",
      "No",
      "Only at underground stations"
    ],
    "answer": 1,
    "feedback": [
      "Detection and sprinkler thermal operation are different mechanisms.",
      "Correct. The individual thermal element operates with heat in this conventional example.",
      "Station location does not make that a universal control rule."
    ],
    "sourceConcepts": [
      "flss",
      "fire-detector",
      "fire-panel",
      "sprinkler-system",
      "fire-pump"
    ]
  },
  {
    "id": "ventilation-objectives",
    "label": "20 · Explore tunnel ventilation",
    "title": "Mechanism, objective and verified performance differ",
    "domain": "station",
    "view": "tunnel-ventilation",
    "component": "tunnel-fan",
    "explanation": "Inspect the fan, shaft and damper as one air path. Then compare normal environmental objectives with a smoke-management objective. The particles help explain the components; they do not demonstrate safe air conditions or prescribe an emergency fan sequence.",
    "actionText": "Move from the tunnel context to the fan and damper cutaways.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "tunnel-ventilation",
      "component": "tunnel-fan",
      "variant": "normal",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Can the rendered airflow particles establish smoke-control performance?",
    "choices": [
      "Yes, if the fan rotates",
      "No",
      "Only when they are coloured"
    ],
    "answer": 1,
    "feedback": [
      "Rotation does not validate the complete air system.",
      "Correct. Performance needs an engineered and verified design.",
      "Visual colour is not performance evidence."
    ],
    "sourceConcepts": [
      "tunnel-fan",
      "tunnel-shaft",
      "tunnel-damper",
      "smoke-control"
    ]
  }
];

TOURS.push(...EXTRA_TOURS);
