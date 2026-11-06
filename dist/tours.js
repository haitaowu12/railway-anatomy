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
    "explanation": "A passenger hears an announcement and reads a display, but the equipment that supports each service may be elsewhere in the station. The speaker needs an audio path and electrical power; the display needs its own information and supply. This station cutaway places them in context without claiming that they share one controller.",
    "actionText": "Start with Whole station. Under Station area in focus, compare Passenger circulation and Equipment room, then return to the PA / voice alarm selection.",
    "actionLabel": "Open the station overview",
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
    "explanation": "Below the train, the running rail is one part of the assembly that supports and guides its wheels. Compare ballasted, direct-fixation and embedded examples. The intermediate layers change, but the rail still needs support and restraint. The arrows illustrate a load path, not calculated stress.",
    "actionText": "Compare Ballasted, Slab / direct fixation and Embedded. In each view, look for the layers and restraints that support the rail.",
    "actionLabel": "Open the track support view",
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
    "label": "04 \u00b7 Follow a point machine",
    "title": "How a point machine moves and proves a turnout",
    "domain": "track",
    "view": "switch-drive",
    "component": "track-point-machine",
    "explanation": "Follow two operating rods, two blade detector rods and positive locking. Compare a complete throw, stopped travel and a missing detector input, then trace the B indication to the interlocking.",
    "actionText": "Step through the mechanism, then follow the returned indication to the interlocking.",
    "actionLabel": "Restart the point-machine journey",
    "action": {
      "view": "switch-drive",
      "component": "track-point-machine",
      "variant": "proved",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true
    },
    "question": "A switch drive has received a movement command, but the required position indication is absent. What has been established?",
    "choices": [
      "The required position has been proved",
      "Movement has been requested; the required position is not yet proved",
      "The route is clear because the drive received the command"
    ],
    "answer": 1,
    "feedback": [
      "The required end-position indication is missing, so that position has not been proved.",
      "Movement has been requested. The required position still needs its returned indication.",
      "A movement command alone does not establish the route conditions."
    ],
    "sourceConcepts": [
      "track-point-machine",
      "track-stretcher",
      "track-point-detection",
      "interlocking"
    ],
    "searchTerms": [
      "point drive",
      "switch machine",
      "turnout motor",
      "point motor"
    ]
  },
  {
    "id": "energy-journey",
    "label": "05 · Follow the energy",
    "title": "From supply to motion",
    "domain": "power",
    "view": "system",
    "component": "utility",
    "explanation": "A supported and guided train also needs energy to move. This lesson selects the fourth-rail DC example. Follow the AC supply through the wayside transformer and rectifier, then through the supply conductor to the onboard inverter and selected motor. Trace the return from the vehicle back to the substation through the separate return conductor. This is one teaching arrangement; it does not define every railway.",
    "actionText": "Follow the selected fourth-rail DC path from the substation to the vehicle and back through the separate return conductor.",
    "actionLabel": "Follow power",
    "action": {
      "view": "system",
      "component": "utility",
      "mode": "motoring",
      "scenario": "nominal",
      "electrification": "fourth-rail-dc",
      "cutaway": true
    },
    "question": "The vehicle collects power from the supply conductor. In this fourth-rail example, what completes its normal traction circuit back to the substation?",
    "choices": [
      "The train-control radio link",
      "The LIM reaction rail",
      "The separate return shoe and conductor"
    ],
    "answer": 2,
    "feedback": [
      "The radio carries information; it is not the normal traction-current return path.",
      "In the LIM arrangement the reaction rail is the motor secondary, not this circuit's separate return conductor.",
      "The second shoe connects the vehicle to the separate conductor, which returns the normal traction current toward the substation."
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
    "explanation": "This lesson selects LIM propulsion with fourth-rail DC supply. The outgoing conductor, separate return conductor, wheel-running rails and LIM reaction rail have different jobs. The reaction rail is the motor secondary, while the separate return conductor completes the normal traction circuit in this arrangement.",
    "actionText": "Inspect the four labelled functions in the selected fourth-rail DC and LIM arrangement.",
    "actionLabel": "Inspect the rails",
    "action": {
      "view": "guideway",
      "component": "reaction-rail",
      "mode": "motoring",
      "scenario": "nominal",
      "electrification": "fourth-rail-dc",
      "technology": {
        "propulsion": "lim"
      }
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
    "explanation": "This lesson selects the fourth-rail DC example with limited network receptivity. During electrical braking the converter can return energy to the DC network; the selected wayside resistor provides a surplus-energy destination. Friction braking remains a separate mechanism. The illustration does not calculate how braking effort is blended.",
    "actionText": "Inspect the selected wayside resistor and the separate friction-brake mechanism in this limited-receptivity DC example.",
    "actionLabel": "Limit energy acceptance",
    "action": {
      "view": "system",
      "component": "wayside-resistor",
      "cutaway": true,
      "mode": "regeneration",
      "scenario": "regen-limited",
      "electrification": "fourth-rail-dc"
    },
    "question": "In the selected fourth-rail DC example, which other braking paths are shown when the network cannot accept all regenerated energy?",
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
    "explanation": "Alongside the equipment that moves a train, different functions protect, drive and coordinate its movement. In this example, ATP supervises limits, ATO manages driving, and ATS coordinates the service. A request to improve punctuality cannot itself enlarge the permitted operating envelope.",
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
    "view": "communications-network",
    "component": "communications-system",
    "explanation": "Follow passenger information, operational voice and supervision between their endpoints. These services have different functions even when they share infrastructure or locations. The connection diagram labels those relationships; a working passenger service does not by itself establish current train-control information or movement permission.",
    "actionText": "Inspect the station rack, then compare its onboard alternative. Follow a specific service in the SCADA, voice or passenger-information study.",
    "actionLabel": "Compare communication roles",
    "action": {
      "view": "communications-network",
      "component": "communications-system",
      "variant": "station",
      "cutaway": true,
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "Suppose a passenger display receives new content. What does that observation establish about train-control permission?",
    "choices": [
      "The display update establishes that the current movement authority remains valid",
      "The successful passenger service does not establish the validity of control information or protection conditions",
      "The display controller can issue movement permission while other information is unavailable"
    ],
    "answer": 1,
    "feedback": [
      "The observed update concerns passenger information. Movement authority needs evidence from the relevant control functions.",
      "The diagram separates service roles. A working display is not evidence that every other information path or protection condition is valid.",
      "Passenger-information delivery does not give the display controller the protection or authority-generating role."
    ],
    "sourceConcepts": [
      "communications-system",
      "pis-controller",
      "passenger-info",
      "operational-cab-radio",
      "station-scada",
      "train-radio"
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
    "domain": "communications",
    "view": "communications-passenger",
    "component": "pa-amplifier",
    "explanation": "Follow the call station and PA controller into the amplifier and loudspeaker circuit. The connection diagram distinguishes network audio and control from the powered output to the speaker. The equipment view exposes the amplifier and speaker parts; its exaggerated cone motion illustrates a mechanism without predicting audibility or speech quality.",
    "actionText": "Open Announcement. Inspect the amplifier and loudspeaker, then open Responsibilities & connections to identify the amplified-audio output and separate electrical supply.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "communications-passenger",
      "component": "pa-amplifier",
      "variant": "announcement",
      "exploded": 0,
      "cutaway": true,
      "mode": "coasting",
      "scenario": "nominal"
    },
    "question": "An announcement reaches the PA controller, but the speaker is silent. What does that observation establish about the path in this example?",
    "choices": [
      "The speaker must be faulty because the message reached the controller",
      "The message reached one stage; the amplifier, its supply and the speaker path need separate consideration",
      "The controller receiving a message proves that amplified audio reached the speaker"
    ],
    "answer": 1,
    "feedback": [
      "A silent speaker can have different causes. Reaching the controller alone does not identify the fault.",
      "The amplifier, electrical supply and speaker circuit are distinct parts of the path; the observation alone does not identify the cause.",
      "Message receipt and speaker-driving output are different stages, so one does not prove the other."
    ],
    "sourceConcepts": [
      "pa-amplifier",
      "pa-controller",
      "station-pa",
      "communications-power"
    ]
  },
  {
    "id": "supervisory-boundaries",
    "label": "18 · Compare SCADA and BAS",
    "title": "A dashboard is not the local control loop",
    "domain": "station",
    "view": "station-networks",
    "component": "bas-controller",
    "explanation": "Compare power supervision, BAS/BMS, tunnel ventilation and station smoke control as different responsibilities. The interface map separates field equipment, local logic, native supervision, shared displays and communications. A railway can integrate selected information or permitted requests without combining those functions into one controller.",
    "actionText": "Start with Building services and Shared status summaries. Compare Separate supervision and Selected supervisory requests, then inspect Tunnel ventilation. Trace a measured indication and a permitted request separately; compare the returned feedback with the request acknowledgement.",
    "actionLabel": "Return to the BAS interface example",
    "action": {
      "view": "station-networks",
      "component": "bas-controller",
      "variant": "building",
      "exploded": 0,
      "mode": "coasting",
      "scenario": "nominal",
      "interfaces": {
        "domain": "building",
        "architecture": "summaries",
        "trace": "indication"
      }
    },
    "question": "A supervisory request is acknowledged in the illustrated building-control loop. What does that acknowledgement establish about the actuator?",
    "choices": [
      "The request was acknowledged; the actuator's actual state still needs its own feedback",
      "The actuator has reached the requested position",
      "The measured condition has necessarily reached its target"
    ],
    "answer": 0,
    "feedback": [
      "An acknowledgement and returned field feedback answer different questions; neither alone proves that the measured condition has reached its target.",
      "A request acknowledgement is not the same as a returned indication of actuator position.",
      "The process condition and the actuator's actual state need their own evidence."
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
    "component": "sprinkler-system",
    "explanation": "Compare detection, notification, emergency communication, lighting, egress and water-based protection. The view shows their interfaces without creating a generic cause-and-effect sequence. In a conventional thermal sprinkler, heat operates the individual sprinkler element.",
    "actionText": "Inspect Water-based protection and its individual sprinkler head, then compare the separate detection and communication functions.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "fire-systems",
      "component": "sprinkler-system",
      "variant": "water",
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
      "The view separates the driving mechanism from the adjustable path; it does not calculate airflow performance.",
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
    "actionText": "Keep Trainway sensing in focus. Change Platform edge from Open edge to Half-height doors or Full-height doors, then compare the same location.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "platform-interface",
      "component": "platform-intrusion",
      "variant": "open-platform",
      "platformEdge": "open",
      "platformSensor": "lidar",
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true,
      "exploded": 0
    },
    "question": "Which change adds a physical barrier at the platform edge in these examples?",
    "choices": [
      "Selecting half-height or full-height doors in Platform edge",
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
    "title": "Read door feedback",
    "domain": "station",
    "view": "platform-interface",
    "component": "platform-door-proof",
    "explanation": "Follow a door command to the drive, then inspect closed and locked feedback. These are separate facts at the train–platform interface.",
    "actionText": "Step through Leaves moving, Closed contact, Bolt engaged and Locking indication. Inspect the drive and contacts to see why a request, a closed leaf and a returned locking state are different.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "platform-interface",
      "component": "platform-door-proof",
      "variant": "platform-doors",
      "platformEdge": "full-height",
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true,
      "exploded": 0
    },
    "question": "The animation shows the bolt engaged, but the locking indication has not yet returned. What remains unestablished at the receiving interface?",
    "choices": [
      "Whether a close request was issued",
      "Whether the illustration shows the bolt engaged",
      "Whether the applicable locking indication has been received"
    ],
    "answer": 2,
    "feedback": [
      "The scenario already describes the later bolt-engagement stage. A request does not establish the returned indication.",
      "The bolt is shown engaged in this stage. The receiving interface still needs its separate indication.",
      "The physical stage and the returned indication are distinct in this illustration; actual proof requirements are design-specific."
    ],
    "sourceConcepts": [
      "platform-door-proof",
      "platform-door-drive",
      "platform-gap-detector"
    ]
  },
  {
    "id": "depot-journey",
    "label": "23 · Follow the depot journey",
    "title": "Follow one maintenance visit",
    "domain": "depot",
    "view": "depot-overview",
    "component": "depot-layout",
    "explanation": "A train can leave passenger service for inspection, maintenance or cleaning. In this example, it crosses the network boundary, reaches reception and is assigned to the work it needs. Inspection may lead to the maintenance hall or wheel and bogie shop; cleaning and stabling are other destinations. The work record then connects maintenance release with the fleet plan for departure.",
    "actionText": "Start at the whole depot. Open Arrival & yard and a maintenance area, then use People & processes to examine Maintenance release & return.",
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
    "label": "24 · Separate work-zone protections",
    "title": "Separate work-zone protections",
    "domain": "depot",
    "view": "depot-protection",
    "component": "depot-personnel-protection",
    "explanation": "The work-protection map separates movement protection, hazardous-energy controls, returned indications and responsibility. Select each question to examine its inputs and evidence; the map is not the sequence for establishing a protected worksite.",
    "actionText": "Compare Examine the movement-protection interface with Examine the energy and access interfaces. Then select Relate displayed state to its evidence and identify what a displayed indication does not establish.",
    "actionLabel": "Examine the movement-protection interface",
    "action": {
      "view": "depot-protection",
      "component": "depot-personnel-protection",
      "variant": "work-zone",
      "processStep": "movement",
      "mode": "coasting",
      "scenario": "nominal",
      "cutaway": true,
      "exploded": 0
    },
    "question": "An indication reports movement inhibition on a work road. Which boundary still requires its own evidence?",
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
    "label": "25 · Follow washing and water",
    "title": "Movement and water supply have different roles",
    "domain": "depot",
    "view": "depot-wash",
    "component": "depot-wash-gantry",
    "explanation": "Begin with the travelling gantry around a stationary train, then compare the drive-through arrangement, where the train moves past fixed equipment. The phase control makes the difference visible. Water circuit shows the separate collection, treatment, reuse, make-up and residual-water paths.",
    "actionText": "Animate Travelling gantry and Drive-through to compare relative movement. Then select Water circuit to inspect the supporting water paths.",
    "actionLabel": "Show this arrangement",
    "action": {
      "view": "depot-wash",
      "component": "depot-wash-gantry",
      "variant": "mobile",
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

TOURS.push({
  id:'turnout-wheels',label:'32 · Follow wheels through a turnout',title:'Both wheels explain the crossing',domain:'track',view:'turnout',component:'track-wheelset',
  explanation:'Follow the two wheel paths through a selected, locked turnout, then inspect the fixed crossing and its opposite check rail.',
  actionText:'Compare the straight and diverging routes. Open Crossing close-up to keep the crossing wheel and its opposite check rail together.',actionLabel:'Follow the wheelset',
  action:{view:'turnout',component:'track-wheelset',variant:'straight',exploded:0,mode:'coasting',scenario:'nominal'},
  question:'At this fixed, tread-bearing crossing, what does the opposite check rail guide?',
  choices:['The back of the other wheel flange, helping position the wheelset','The underside of the crossing wheel tread, carrying its normal load','The point-machine operating rod'],answer:0,
  feedback:['The check rail can act on the back of the opposite wheel flange. The axle connects that guidance to the wheel passing the crossing nose.','The wheel tread carries vertical load on the wing rail and crossing nose. The opposite check rail provides lateral guidance.','The operating rod moves the blade before passage. The check rail guides a wheel flange’s back face.'],
  sourceConcepts:['track-turnout','track-wheelset','track-frog','track-check-rail']
});
