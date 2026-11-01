import {STUDY_TOURS} from './studies-learning.js';
// Guided questions test the mechanism or interface introduced by each lesson.
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
    "question": "A platform loudspeaker is silent while the passenger display is working. Which supporting path belongs to the loudspeaker?",
    "choices": [
      "The display data feed and display screen only",
      "The audio source, routing, amplifier and speaker circuit",
      "The station supervisory screen alone"
    ],
    "answer": 1,
    "feedback": [
      "The display has its own information and power path; its operation does not establish the audio path.",
      "The announcement needs both an audio path and electrical power at the speaker-driving stage.",
      "Supervision can report status, but it does not replace the equipment that carries and amplifies the audio."
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
    "question": "In the direct-fixation example, which functions remain at the rail seat after the ballast and sleeper arrangement changes?",
    "choices": [
      "Designed support, resilience and restraint of the rail",
      "Support by concrete alone, with no rail fastening",
      "The same ballast bed directly beneath the rail foot"
    ],
    "answer": 0,
    "feedback": [
      "The supporting structure changes, while the rail still needs its designed mechanical interfaces.",
      "The illustrated concrete structure does not replace the fastening and resilient interface.",
      "Ballast belongs to the ballasted example; follow the baseplate and resilient layers in the direct-fixation view."
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
    "question": "Which pairing matches the roles in the illustrated rail seat?",
    "choices": [
      "Rail pad: elastic restraint above the foot; clip: foundation below the sleeper",
      "Baseplate: spreads fastening loads; pad: locks the rail foot against uplift",
      "Clip: rail restraint; pad: resilient interface beneath the rail"
    ],
    "answer": 2,
    "feedback": [
      "The pad lies beneath the rail; the clip acts on the rail foot as part of its restraint.",
      "The baseplate can spread loads, but the pad provides the resilient support interface; the clip provides the illustrated restraint.",
      "The parts meet at the rail seat but perform different functions."
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
    "question": "A switch drive has received a movement command, but the required position indication is absent. What has been established?",
    "choices": [
      "The required position has been proved",
      "Movement has been requested; the required position is not yet proved",
      "The route is clear because the drive received the command"
    ],
    "answer": 1,
    "feedback": [
      "The command and returned position indication are separate information.",
      "The model deliberately keeps a request separate from the evidence of the resulting state.",
      "A route depends on more conditions than receipt of a switch command."
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
    "question": "Which conversion belongs to the rectifier in this DC traction example?",
    "choices": [
      "AC at one voltage to AC at another voltage",
      "DC supply to controlled AC for the traction motor",
      "AC supply to DC for traction distribution"
    ],
    "answer": 2,
    "feedback": [
      "That is the transformer role in this example.",
      "That is the onboard traction-inverter role.",
      "The rectifier supplies the DC side; the transformer and onboard inverter have different conversions."
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
    "question": "In this separated-conductor LIM example, which guideway element is the motor secondary?",
    "choices": [
      "The reaction rail",
      "The normal traction-current return conductor",
      "The wheel-running rails"
    ],
    "answer": 0,
    "feedback": [
      "The primary interacts electromagnetically with the reaction rail across the air gap.",
      "The illustrated return conductor completes the normal DC supply circuit.",
      "The running rails support and guide the wheels in this example."
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
    "question": "What directly produces the illustrated LIM thrust?",
    "choices": [
      "Motor-shaft torque transmitted through an axle gearbox",
      "Electromagnetic interaction between the primary and reaction rail across their gap",
      "Driving-wheel torque transferred through wheel–rail adhesion"
    ],
    "answer": 1,
    "feedback": [
      "An axle gearbox belongs to the rotary-drive comparison.",
      "The linear motor develops longitudinal force through the primary–secondary interaction.",
      "The wheels support and guide this LIM vehicle; the motor produces its propulsive interaction across the gap."
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
    "domain": "power",
    "view": "system",
    "component": "wayside-resistor",
    "explanation": "During regenerative braking, mechanical energy becomes electrical energy. Acceptance by the supply network is conditional. Explore the limited-receptivity example and its alternative energy paths. Electrical braking and friction braking are coordinated; their actual arrangements vary.",
    "actionText": "Limit regeneration and inspect the alternative braking paths.",
    "actionLabel": "Limit energy acceptance",
    "action": {
      "view": "system",
      "component": "wayside-resistor",
      "cutaway": true,
      "mode": "regeneration",
      "scenario": "regen-limited"
    },
    "question": "If the illustrated DC network cannot accept all regenerated energy, which other braking paths are shown?",
    "choices": [
      "Resistive energy dissipation and friction braking, according to the selected arrangement",
      "Automatic export of all surplus energy through the diode rectifier to the AC utility",
      "Regeneration alone, with friction braking unavailable"
    ],
    "answer": 0,
    "feedback": [
      "The model separates the energy destination from the friction-brake contribution; actual blending depends on the vehicle design.",
      "The chosen diode-rectifier example does not provide that AC export path.",
      "Friction braking remains a separate available mechanism in the teaching example."
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
      "scenario": "nominal",
      "technology": {
        "control": "radio"
      }
    },
    "question": "ATS requests a service adjustment. Which role still supervises the permitted operating limits in this example?",
    "choices": [
      "ATS replaces the protection limits with the timetable target",
      "ATO enlarges the permitted envelope to meet the request",
      "ATP supervises the permitted limits while ATO manages driving within them"
    ],
    "answer": 2,
    "feedback": [
      "Service coordination does not itself enlarge the protection envelope.",
      "A driving request does not establish new permission.",
      "Service supervision, driving and protection have different responsibilities."
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
    "question": "After movement information reaches the train, which role remains in the illustrated CBTC chain?",
    "choices": [
      "Receipt of the packet alone establishes that every route condition is satisfied",
      "Onboard protection interprets the applicable limits with the train’s position information",
      "The passenger-information controller sets the train’s protection limits"
    ],
    "answer": 1,
    "feedback": [
      "Communication transports information; the protection and route-condition responsibilities remain separate.",
      "Follow the information exchange into the onboard supervision function rather than ending the explanation at the radio.",
      "Passenger information is a different service from train protection."
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
    "question": "Which illustrated device exchanges information at a passing point rather than establishing a section-occupancy state?",
    "choices": [
      "The balise",
      "The track circuit",
      "The axle-counter section"
    ],
    "answer": 0,
    "feedback": [
      "The balise provides a passing reference or data update in this comparison.",
      "The selected track circuit is used for section-occupancy detection.",
      "The selected axle-counter arrangement evaluates entries and exits to determine section state."
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
    "actionText": "Use the stated 100 m / 110 m example for the question, then vary the wheel-distance error to explore other cases.",
    "actionLabel": "Inspect sensor disagreement",
    "action": {
      "view": "bogie",
      "component": "tachometer",
      "cutaway": true,
      "mode": "coasting",
      "scenario": "wheel-slip"
    },
    "question": "In the stated example, the actual distance is 100 m and the estimate is 110 m. What is the estimation error?",
    "choices": [
      "10 m high",
      "10 m low",
      "110 m high"
    ],
    "answer": 0,
    "feedback": [
      "110 − 100 = +10 m. The example states a positive distance-estimation bias.",
      "The estimate exceeds the actual distance, so the error is positive.",
      "110 m is the estimated distance; subtract the actual distance to find the error."
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
    "question": "When switching from the legacy-loop to the radio example, which distinction is directly illustrated?",
    "choices": [
      "A required change from LIM to rotary propulsion",
      "A different train–wayside communication arrangement",
      "Proof that every installed generation uses the same computer allocation"
    ],
    "answer": 1,
    "feedback": [
      "Propulsion is an independent choice; a communication change does not require that motor change.",
      "The information transport changes. Function allocation and product-generation claims still need their own evidence.",
      "The common product-family name does not establish identical installed architectures."
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
    "question": "In the selected ETCS Level 1 example, what continues between the illustrated balise passages?",
    "choices": [
      "A continuous new telegram from each passed balise",
      "No protection until the next balise is reached",
      "Onboard supervision using the applicable received information"
    ],
    "answer": 2,
    "feedback": [
      "The illustrated balise update occurs at a passing point.",
      "Spot information updates do not mean that onboard supervision stops between them.",
      "The timing of a data update and the continuity of onboard supervision are different."
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
    "question": "The passenger display still updates while the illustrated control-data path is interrupted. Which evidence is relevant to train-control permission?",
    "choices": [
      "The freshness of the passenger timetable display",
      "Successful passenger audio playback",
      "The validity of the applicable control information and protection conditions"
    ],
    "answer": 2,
    "feedback": [
      "A passenger-information update establishes something about that service, not the control-data path.",
      "Audio playback does not establish movement-authority data or protection conditions.",
      "Follow the control path and its governing functions separately from passenger services."
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
    "question": "Which role belongs to the auxiliary power converter in this vehicle example?",
    "choices": [
      "Converting the incoming electrical supply for supporting loads",
      "Estimating train location from wheel rotation",
      "Turning motor torque into axle torque through a gearbox"
    ],
    "answer": 0,
    "feedback": [
      "The auxiliary supply supports selected vehicle systems; battery storage and each load’s controller remain distinct.",
      "That is a sensing and estimation function.",
      "That is a mechanical transmission function in the rotary-drive example."
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
    "question": "Which job belongs to the speaker-driving amplifier, rather than message storage or zone selection?",
    "choices": [
      "Choosing which platform zone receives the message",
      "Supplying the electrical audio output that drives the speaker circuit",
      "Storing the announcement recording for later playback"
    ],
    "answer": 1,
    "feedback": [
      "Zone selection is an audio routing/control responsibility.",
      "Routing a message and providing speaker-driving power are different parts of the announcement path.",
      "Storage supplies recorded content; amplification supplies the speaker-driving output."
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
      "component": "bas-controller",
      "variant": "building",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "In the illustrated building-control loop, which element uses a measured value to determine an actuator command?",
    "choices": [
      "The local BAS controller",
      "The supervisory display by itself",
      "The network switch forwarding the messages"
    ],
    "answer": 0,
    "feedback": [
      "The local controller closes the illustrated control loop; the workstation and network support other roles.",
      "Displaying a measurement does not make the screen the local controller.",
      "Forwarding messages does not by itself implement the plant-control logic."
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
    "question": "What operates the individual conventional thermal sprinkler shown in this example?",
    "choices": [
      "A smoke detector automatically opens every sprinkler on the system",
      "Starting the fire pump mechanically opens each sprinkler head",
      "Heat acts on the sprinkler’s local thermal element"
    ],
    "answer": 2,
    "feedback": [
      "Detection and individual thermal-sprinkler operation are different mechanisms.",
      "The pump supplies water pressure; it does not mechanically open every thermal element.",
      "This describes the conventional thermal sprinkler shown; other water-protection arrangements have different control designs."
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
    "question": "How do the fan and damper contribute to the illustrated air path?",
    "choices": [
      "Fan rotation fixes the airflow regardless of the connected duct and damper state",
      "The fan creates a pressure difference; the damper changes the available opening or path",
      "The damper creates the driving pressure and the fan only isolates a branch"
    ],
    "answer": 1,
    "feedback": [
      "The complete air path, resistance and equipment state affect airflow.",
      "The view separates the driving mechanism from the adjustable path; the animation does not calculate airflow performance.",
      "Those roles are reversed in the illustrated arrangement."
    ],
    "sourceConcepts": [
      "tunnel-fan",
      "tunnel-shaft",
      "tunnel-damper",
      "smoke-control"
    ]
  },
  {
    "id": "platform-zones",
    "label": "21 · Compare platform protection",
    "title": "21 · Compare platform protection",
    "domain": "station",
    "view": "platform-interface",
    "component": "platform-intrusion",
    "explanation": "Compare an observed track area with a physical platform-door boundary. Then inspect the separate interspace between train and platform facade.",
    "actionText": "Compare the arrangements and inspect the highlighted equipment.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "platform-interface",
      "component": "platform-intrusion",
      "variant": "open-platform",
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true,
      "exploded": 0
    },
    "question": "Which change adds a physical barrier at the platform edge in these examples?",
    "choices": [
      "The platform-door arrangement",
      "A larger intrusion-detection coverage area alone",
      "An additional camera view alone"
    ],
    "answer": 0,
    "feedback": [
      "The door arrangement introduces a barrier, with opening control and status feedback as separate functions.",
      "Detection can report intrusion; sensing coverage is not a physical barrier.",
      "A camera provides observation rather than a physical barrier."
    ],
    "sourceConcepts": [
      "platform-intrusion",
      "platform-screen-door",
      "platform-gap-detector"
    ]
  },
  {
    "id": "platform-feedback",
    "label": "22 · Read door feedback",
    "title": "22 · Read door feedback",
    "domain": "station",
    "view": "platform-interface",
    "component": "platform-door-proof",
    "explanation": "Follow a door command to the drive, then inspect closed and locked feedback. These are separate facts at the train–platform interface.",
    "actionText": "Compare the arrangements and inspect the highlighted equipment.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "platform-interface",
      "component": "platform-door-proof",
      "variant": "platform-doors",
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true,
      "exploded": 0
    },
    "question": "A close request has been issued to the platform doors. Which additional information addresses the closed-and-locked state?",
    "choices": [
      "The command appears in the operator’s event list",
      "The door controller has received the request",
      "The applicable closed-and-locked feedback from the door arrangement"
    ],
    "answer": 2,
    "feedback": [
      "The event list records the request, not necessarily the resulting physical state.",
      "Receipt of a command is separate from confirmation of the required door state.",
      "The teaching view distinguishes request, mechanism and returned status; actual proof requirements are design-specific."
    ],
    "sourceConcepts": [
      "platform-door-proof",
      "platform-door-drive",
      "platform-gap-detector"
    ]
  },
  {
    "id": "operations-roles",
    "label": "23 · Follow an event across the OCC",
    "title": "Follow request, indication and coordination",
    "domain": "operations",
    "view": "occ-supervision",
    "component": "operations-signalling-workstation",
    "explanation": "An operator task can involve a control request, acknowledgement, returned equipment indication and communication with other roles. These are different pieces of information. Follow the supervisory path and compare it with the operational event record; acknowledging a request or alarm does not establish the resulting field state or resolve the event.",
    "actionText": "Open the supervision view, follow the request and returned-indication stages, then compare event coordination.",
    "actionLabel": "Trace supervision",
    "action": {
      "view": "occ-supervision",
      "component": "operations-signalling-workstation",
      "variant": "traffic",
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true,
      "exploded": 0
    },
    "question": "A control request is acknowledged, but the returned field indication is still absent. What is known at this point?",
    "choices": [
      "The request was received; the resulting field state has not been confirmed",
      "The field equipment has completed the requested change",
      "The associated operational event has been resolved"
    ],
    "answer": 0,
    "feedback": [
      "Acknowledgement, returned indication and event resolution are different evidence.",
      "A received request does not establish the field equipment’s completed state.",
      "An event can remain open after a request or alarm has been acknowledged."
    ],
    "sourceConcepts": [
      "operations-centre",
      "operations-signalling-workstation",
      "operations-traffic-supervision"
    ]
  },
  {
    "id": "depot-journey",
    "label": "24 · Follow the depot journey",
    "title": "Follow one maintenance visit",
    "domain": "depot",
    "view": "depot-overview",
    "component": "depot-layout",
    "explanation": "In this example, a train crosses the network boundary, reaches reception, and is assigned to the work it needs. Inspection may lead to the maintenance hall or wheel and bogie shop; cleaning and stabling are other destinations. The work record then connects maintenance release with the fleet plan for departure.",
    "actionText": "Start at the whole depot. Open Arrival & yard, inspect a maintenance area, then open Stores & work planning to follow the handover.",
    "actionLabel": "Explore the connected depot",
    "action": {
      "view": "depot-overview",
      "component": "depot-layout",
      "variant": "layout",
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true,
      "exploded": 0
    },
    "question": "Which distinction matters when a maintained vehicle is prepared for departure?",
    "choices": [
      "A free departure road automatically completes maintenance release",
      "Maintenance release concerns the vehicle and work evidence; a departure movement has separate route and operating arrangements",
      "Completing the work record automatically establishes every yard movement condition"
    ],
    "answer": 1,
    "feedback": [
      "Available track space does not establish completion of the required work or release evidence.",
      "The depot connects the maintenance and operations responsibilities without treating them as one approval.",
      "A work record and a movement arrangement have different inputs and responsibilities."
    ],
    "sourceConcepts": [
      "depot-layout",
      "depot-network-boundary",
      "depot-reception",
      "depot-work-planning",
      "depot-maintenance-release",
      "depot-dispatch"
    ]
  },
  {
    "id": "depot-energy",
    "label": "25 · Separate work-zone protections",
    "title": "25 · Separate work-zone protections",
    "domain": "depot",
    "view": "depot-protection",
    "component": "depot-personnel-protection",
    "explanation": "Inspect the movement-protection device and the energy-control context. They address different hazards. This is not an isolation procedure.",
    "actionText": "Compare the arrangements and inspect the highlighted equipment.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "depot-protection",
      "component": "depot-personnel-protection",
      "variant": "work-zone",
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true,
      "exploded": 0
    },
    "question": "The model shows movement inhibition on a protected work road. Which boundary remains separate from that indication?",
    "choices": [
      "The verified energy-isolation state relevant to the work",
      "The location of the train within the depot",
      "The existence of a recorded movement request"
    ],
    "answer": 0,
    "feedback": [
      "Movement protection and energy isolation are different concepts; the illustration is not an isolation procedure.",
      "Location does not establish the relevant energy state.",
      "A recorded request does not establish the relevant energy state."
    ],
    "sourceConcepts": [
      "depot-personnel-protection",
      "depot-energy-isolation"
    ]
  },
  {
    "id": "depot-water",
    "label": "26 · Follow wash water",
    "title": "26 · Follow wash water",
    "domain": "depot",
    "view": "depot-wash",
    "component": "depot-water-recovery",
    "explanation": "Select Water circuit to open the tanks and trace collection, treatment and reuse. The fresh-water supply and residual discharge have separate connections. Then compare Drive-through with Travelling gantry to see which object moves during washing.",
    "actionText": "Trace the coloured water paths, then compare the two washing arrangements.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "depot-wash",
      "component": "depot-water-recovery",
      "variant": "recovery",
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true,
      "exploded": 0
    },
    "question": "In these two washing examples, how does the travelling-gantry arrangement differ from the fixed drive-through plant?",
    "choices": [
      "Both examples require the train and brushes to stay fixed",
      "The gantry moves with the train at the same speed in both examples",
      "The train stays stationary while the gantry travels; the drive-through example moves the train past fixed equipment"
    ],
    "answer": 2,
    "feedback": [
      "The relative movement needed for washing is supplied by different objects in the two examples.",
      "The examples deliberately show different movement arrangements.",
      "The change is visible in the equipment and animation, while water supply and treatment retain their supporting roles."
    ],
    "sourceConcepts": [
      "depot-water-recovery",
      "depot-wash-plant",
      "depot-wash-gantry",
      "depot-wash-pump"
    ]
  }
];
TOURS.push(...STUDY_TOURS);
