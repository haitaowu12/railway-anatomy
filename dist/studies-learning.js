// Reading guides and interactive study questions.
export const STUDY_GUIDES = [
  {
    "id": "electrification-chain",
    "domain": "power",
    "view": "electrification",
    "component": "study-collector",
    "title": "Follow the complete electrification chain",
    "summary": "Trace power from the substation to the train and back, then compare where the four supply arrangements differ.",
    "sections": [
      {
        "heading": "Compare collection and return",
        "text": "Start with Fourth rail · DC, then select Third rail · DC. Both collect power through a shoe touching a conductor rail. Fourth rail has a separate conductor and shoe for the normal return current. Third rail returns through wheel connections and the running rails. The side-by-side conductors in this teaching model make the two electrical paths visible.",
        "sources": [
          "EL01",
          "EL02",
          "P01"
        ]
      },
      {
        "heading": "A pantograph can collect AC or DC",
        "text": "Compare Overhead · DC with Overhead · AC. Both use a pantograph touching the contact wire and a return through the running rails. In the DC example, the substation rectifies AC into DC. In the conventional AC example, the train carries a transformer and line converter before the DC link and motor inverter.",
        "sources": [
          "EL03",
          "E01",
          "E02",
          "P01"
        ]
      },
      {
        "heading": "Follow the transformer’s two circuits",
        "text": "The pantograph connects to the transformer’s primary winding; wheelsets and running rails complete that supply circuit. Magnetic coupling transfers energy to the separate secondary winding, which feeds the line converter. The line converter converts the secondary AC to DC for the DC link. Amber traces the incoming supply and cyan marks its return. Copper traces the separate transformer secondary circuit. Open the converter enclosure to find the DC-link capacitor bank and motor inverter. The inverter feeds either the rotary motor or linear induction motor (LIM), according to your propulsion choice.",
        "sources": [
          "E02",
          "E03",
          "P04",
          "P02"
        ]
      },
      {
        "heading": "Move between the chain and its equipment",
        "text": "Use the complete chain to locate each electrical function, then open the substation, guideway, vehicle or equipment close-up. The selected supply arrangement follows you between those views. Collection, power conversion and propulsion are separate choices, so changing a pantograph to a shoe keeps the selected motor. The circuits show connections; the static traces do not show the alternating direction or waveform of AC current.",
        "sources": [
          "E02",
          "EL02",
          "EL03",
          "P04"
        ]
      }
    ],
    "sources": [
      "E01",
      "E02",
      "E03",
      "EL01",
      "EL02",
      "EL03",
      "P01",
      "P02",
      "P04"
    ]
  },
  {
    "id": "wheel-rail-response",
    "domain": "vehicle",
    "view": "adhesion",
    "component": "adhesion-contact",
    "title": "Compare wheel rotation with vehicle travel",
    "summary": "Adhesion is the grip at the wheel–rail contact. It links wheel torque to the force that moves or slows the vehicle.",
    "sections": [
      {
        "heading": "Start with rolling, spin and slide",
        "text": "Watch the rim marker and the wheel centre against the fixed stripes. During rolling, rotation follows the distance travelled. During spin, the wheel turns too much for that distance; during slide, it turns too little. The centre follows the same path in these comparisons so the difference is easy to see. The animation illustrates the relationship rather than calculating a stopping distance. It shows rotary traction and friction braking; LIM traction develops thrust through a separate reaction rail.",
        "sources": [
          "H01",
          "P02"
        ]
      },
      {
        "heading": "Compare brake control with sanding",
        "text": "Wheel-slide protection monitors wheel behaviour and changes applied braking effort. In Slide protection, the brake actuator and effort bar vary while the wheel turns. Sanding acts at a different place: the hopper, hose and nozzle deliver sand ahead of the wheel–rail contact to improve grip. Follow both mechanisms and compare their physical paths.",
        "sources": [
          "H01",
          "H02",
          "T08"
        ]
      },
      {
        "heading": "Separate a measurement from the motion it describes",
        "text": "An axle sensor measures rotation. Spin or slide can make a speed estimate based on that measurement differ from the vehicle’s actual speed. The separate travel marker makes that difference visible. Follow the connected localization concepts to see how motion evidence is combined, or open the depot wheelset study to examine the component itself.",
        "sources": [
          "T06",
          "T07",
          "H01"
        ]
      }
    ],
    "sources": [
      "H01",
      "H02",
      "T08",
      "T06",
      "T07",
      "P02"
    ]
  },
  {
    "id": "infrastructure-work",
    "domain": "track",
    "view": "infrastructure-care",
    "component": "route-inspection",
    "title": "Connect an observation with work and follow-up",
    "summary": "Track, ground, drainage and structures meet at the same location, but each observation needs evidence about the part it concerns.",
    "sections": [
      {
        "heading": "Follow support and water through the physical section",
        "text": "Open Structures & drainage. Follow track load through the bridge deck, girders, bearings and abutments. Then inspect the culvert passage beneath the earthwork. Ground condition and water affect the support around the track, while enclosed spaces may need inspection methods that reach beyond the view from track level.",
        "sources": [
          "I01",
          "I02",
          "I03"
        ]
      },
      {
        "heading": "Follow the observation through the process",
        "text": "The Infrastructure inspection & work evidence map begins with a recorded observation and its assessment question. It then connects planned work, the actual end state and follow-up evidence. Select a stage to see the inputs, contributing people and records it produces. The return arrow shows where incomplete work or unsupported claims need further attention.",
        "sources": [
          "I02",
          "Q01",
          "PR06"
        ]
      },
      {
        "heading": "Keep separate issues visible",
        "text": "A drainage check answers a question about the drainage at an identified location. A nearby bearing observation still needs its own review. Keep those continuing actions in the work record. Use the separate worksite handback map for the operational return of a worksite, and Configuration & change for the relationship between an installed item and its records.",
        "sources": [
          "I03",
          "Q01",
          "PR06"
        ]
      }
    ],
    "sources": [
      "I01",
      "I02",
      "I03",
      "Q01",
      "PR06"
    ]
  },
  {
    "id": "service-dependencies",
    "domain": "operations",
    "view": "dependencies",
    "component": "dependency-services",
    "title": "Find what a service needs to keep working",
    "summary": "A second communication path helps with a lost connection, but the service still needs its other dependencies.",
    "sections": [
      {
        "heading": "Trace one service at a time",
        "text": "Start with the station-information application. It has paths A and B. The power-supervision application has only path A in this example, and both applications share a power supply. Select Path A lost: station information retains path B while power supervision loses its connection. Then select Shared power lost to see both applications lose their required supply.",
        "sources": [
          "R01",
          "R02"
        ]
      },
      {
        "heading": "Separate access, live data and recording",
        "text": "Identity unavailable removes the connection needed for a new operator request while keeping field indications available. Recorder unavailable breaks the recording branch while live information remains connected. These selected conditions help distinguish the services. A security zone groups assets with related security needs; a conduit is a communication connection between zones.",
        "sources": [
          "R01",
          "R02"
        ]
      },
      {
        "heading": "Check the recovered state",
        "text": "Compare Restored, unchecked with Evidence checked. The connection returns first, while a configuration mismatch and recording gap remain. The later comparison adds checks of configuration and recording. Restoring recording can capture new events, but does not recreate the missed history. Open Configuration & change to follow how the observed state is compared with its records and supporting evidence.",
        "sources": [
          "R01",
          "Q01",
          "PR01"
        ]
      }
    ],
    "sources": [
      "R01",
      "R02",
      "Q01",
      "PR01"
    ]
  },
  {
    "id": "passenger-journey",
    "domain": "station",
    "view": "accessible-journey",
    "component": "access-entrance",
    "title": "Follow access through the whole journey",
    "summary": "Connect physical passage, usable information, assistance and the boarding interface from street to train.",
    "sections": [
      {
        "heading": "Read the connected route",
        "text": "Follow the entrance through the wide fare gate and near lift to the platform. Tactile surfaces, a display and an audible-information point support the journey. Violet communication links connect information and assistance; the teal line marks the selected step-free route. The example illustrates those connections with schematic dimensions.",
        "sources": [
          "A01"
        ]
      },
      {
        "heading": "Find another route when a lift is unavailable",
        "text": "Lift unavailable stops the highlighted route before the near lift and displays a service message and assistance connection. The stairs remain a separate route. Alternate lift follows a different approach to the second lift while retaining the first lift’s outage marker. The passenger needs both a usable route and information that helps them find it.",
        "sources": [
          "A02"
        ]
      },
      {
        "heading": "Continue through the train doorway",
        "text": "Boarding aid needed reaches the platform but stops at the gap beside the train. Aid in place adds a bridging plate and extends the path into the doorway. Reaching the platform and boarding the train are separate parts of the journey. Ticketing, information, station design, assistance and disruption can each affect whether the complete trip is usable.",
        "sources": [
          "A03",
          "A01"
        ]
      }
    ],
    "sources": [
      "A01",
      "A02",
      "A03"
    ]
  },
  {
    "id": "configuration-handover",
    "domain": "processes",
    "view": "change-evidence",
    "component": "change-test",
    "title": "Match a changed item with its evidence",
    "summary": "Follow the agreed reference, the observed configuration, applicable evidence and the information passed to the receiving team.",
    "sections": [
      {
        "heading": "Identify the item and the reference",
        "text": "Configuration includes hardware, software, settings and documents. A baseline is an agreed configuration used as the reference for controlled change; the installed item and its as-built record show what was actually fitted. The Configuration & change map keeps proposed, recorded and observed states separate. Select a stage to see the people, inputs, actions and outputs involved.",
        "sources": [
          "Q03",
          "PR01"
        ]
      },
      {
        "heading": "Check what the evidence covers",
        "text": "The verification stage connects the identified configuration with a question, results and exceptions. Ask whether the evidence applies to that item, its interfaces and its intended use. A report for version A may apply to B where that link is established; changing the report’s label cannot supply missing coverage. Follow the return arrow when a configuration or evidence mismatch needs more work.",
        "sources": [
          "PR02",
          "Q01"
        ]
      },
      {
        "heading": "Carry conditions into the next handover",
        "text": "Reconciliation brings the actual configuration, its records and the applicable evidence into agreement. It also records remaining issues and conditions. The receiving team needs that information for its decision. Asset handover, maintenance release, worksite handback and a duty handover concern different recipients and responsibilities, so each has a separate process map.",
        "sources": [
          "PR01",
          "PR03",
          "PR04",
          "Q02"
        ]
      }
    ],
    "sources": [
      "Q03",
      "PR01",
      "PR02",
      "PR03",
      "PR04",
      "Q01",
      "Q02"
    ]
  }
];

export const STUDY_TOURS = [
  {
    "id": "electrification-chain",
    "label": "26 · Compare the whole energy chain",
    "title": "Compare the whole energy chain",
    "domain": "power",
    "view": "electrification",
    "component": "study-onboard-transformer",
    "explanation": "Both overhead examples use a pantograph. The conventional AC train adds a transformer and line converter before the DC link; the motor inverter supplies the selected propulsion in both arrangements.",
    "actionText": "Inspect the transformer’s separate primary and secondary circuits in Overhead · AC. Then compare Overhead · DC to see which conversion stages change.",
    "actionLabel": "Show overhead AC",
    "action": {
      "view": "electrification",
      "component": "study-onboard-transformer",
      "variant": "chain",
      "mode": "motoring",
      "scenario": "nominal",
      "exploded": 0,
      "cutaway": true,
      "electrification": "overhead-ac"
    },
    "question": "Both selected overhead examples use a pantograph. Which conversion stages distinguish the conventional AC vehicle shown here from its DC comparison?",
    "choices": [
      "A wayside DC rectifier with no change to onboard conversion",
      "An onboard transformer and line converter before the DC link and motor inverter",
      "Direct contact-wire supply to the traction motor without a motor inverter"
    ],
    "answer": 1,
    "feedback": [
      "The wayside diode rectifier belongs to the DC supply examples. The conventional AC train instead carries the transformer and line converter.",
      "The transformer and line converter distinguish this AC chain. The primary and secondary windings remain separate electrical circuits.",
      "The motor inverter produces controlled motor power. Collected supply AC has a different role."
    ],
    "sourceConcepts": [
      "supply-conversion",
      "study-onboard-transformer",
      "study-return"
    ]
  },
  {
    "id": "wheel-rail-response",
    "label": "27 · Compare wheel rotation and travel",
    "title": "Compare wheel rotation and travel",
    "domain": "vehicle",
    "view": "adhesion",
    "component": "adhesion-contact",
    "explanation": "A brake applies torque to the wheel, while available adhesion limits the force at the rail. The wheel can slow its rotation even while the vehicle keeps moving.",
    "actionText": "Play Wheel slide or move the phase slider. Compare the rim marker with the wheel centre and fixed stripes.",
    "actionLabel": "Show wheel slide",
    "action": {
      "view": "adhesion",
      "component": "adhesion-contact",
      "variant": "slide",
      "mode": "coasting",
      "scenario": "nominal",
      "exploded": 0,
      "cutaway": true
    },
    "question": "The wheel rotates slowly while its centre continues along the rail. What does that establish in this illustration?",
    "choices": [
      "The vehicle is stationary because the wheel is turning slowly",
      "The applied brake effort has been removed",
      "Wheel rotation alone does not establish vehicle travel"
    ],
    "answer": 2,
    "feedback": [
      "The centre and travel marker keep moving along the rail while wheel rotation slows.",
      "The brake remains applied in this comparison.",
      "The separate travel marker shows why rotation alone can give a misleading picture of vehicle movement."
    ],
    "sourceConcepts": [
      "adhesion-contact",
      "adhesion-brake",
      "adhesion-reference"
    ]
  },
  {
    "id": "infrastructure-follow-up",
    "label": "28 · Read the repair evidence",
    "title": "Read the repair evidence",
    "domain": "track",
    "view": "infrastructure-care",
    "component": "route-record",
    "explanation": "A drainage repair, its follow-up check and a nearby bearing observation concern different evidence. The maintenance process connects the work record to review and continuing actions.",
    "actionText": "Compare the work-record stage with the review stage. Follow the return arrow for incomplete evidence, then open the separate worksite handback process.",
    "actionLabel": "Review the work evidence",
    "action": {
      "view": "infrastructure-care",
      "component": "route-record",
      "variant": "check",
      "mode": "coasting",
      "scenario": "nominal",
      "exploded": 0,
      "cutaway": true,
      "processStep": "review"
    },
    "question": "A record identifies a drainage check after cleaning. Which conclusion follows without further evidence?",
    "choices": [
      "The record concerns that drainage check; separate structural and release questions remain",
      "The bridge condition is accepted because the nearby drainage work is complete",
      "The work boundary can be removed because the cleaning tool has gone"
    ],
    "answer": 0,
    "feedback": [
      "The record identifies the drainage check. The bearing observation and worksite handback still need their own evidence and decisions.",
      "A drainage check cannot establish the condition of a separate bearing or bridge.",
      "The worksite handback decision needs the required records and checks; tool removal is only one observation."
    ],
    "sourceConcepts": [
      "route-record",
      "route-bridge",
      "route-work-boundary"
    ]
  },
  {
    "id": "shared-dependencies",
    "label": "29 · Find the shared dependency",
    "title": "Find the shared dependency",
    "domain": "operations",
    "view": "dependencies",
    "component": "dependency-power",
    "explanation": "A second communication path can retain a data connection while another path is lost. Both applications in this example still need the same electrical supply.",
    "actionText": "Compare Path A lost with Shared power lost. Trace the station-information and power-supervision applications separately.",
    "actionLabel": "Show shared power loss",
    "action": {
      "view": "dependencies",
      "component": "dependency-power",
      "variant": "power-loss",
      "mode": "coasting",
      "scenario": "nominal",
      "exploded": 0,
      "cutaway": true
    },
    "question": "Why does the alternate data path fail to retain service after shared power is lost in this example?",
    "choices": [
      "The alternate conduit still passes through the interrupted path A equipment",
      "Both applications still depend on the same electrical supply",
      "The alternate conduit reaches the recorder instead of the station interface"
    ],
    "answer": 1,
    "feedback": [
      "The network paths are separate in this example. Their shared dependency is the electrical supply to the applications.",
      "Both applications share that supply, so the second communication path cannot provide their missing electrical power.",
      "The alternate path serves the station application. The shared application supply remains the limitation here."
    ],
    "sourceConcepts": [
      "dependency-power",
      "dependency-network",
      "dependency-services"
    ]
  },
  {
    "id": "accessible-journey",
    "label": "30 · Continue through the boarding interface",
    "title": "Continue through the boarding interface",
    "domain": "station",
    "view": "accessible-journey",
    "component": "access-boarding",
    "explanation": "A step-free route can reach the platform while a gap still interrupts boarding. Follow the journey through the train doorway as well as through the station.",
    "actionText": "Compare Boarding aid needed with Aid in place, then inspect the plate between the platform and doorway.",
    "actionLabel": "Show the boarding gap",
    "action": {
      "view": "accessible-journey",
      "component": "access-boarding",
      "variant": "aid-required",
      "mode": "coasting",
      "scenario": "nominal",
      "exploded": 0,
      "cutaway": true
    },
    "question": "Which change makes the illustrated boarding connection continuous?",
    "choices": [
      "The information display changes while the physical gap remains",
      "The highlighted route moves to the second lift while the boarding gap remains",
      "A bridging plate connects the platform and doorway, and the route extends into the vehicle"
    ],
    "answer": 2,
    "feedback": [
      "Information helps the passenger find or request assistance, but the physical gap remains.",
      "The second lift changes access to the platform. The gap at the train is a separate part of the journey.",
      "The plate bridges the surfaces and the highlighted route continues into the train."
    ],
    "sourceConcepts": [
      "access-boarding",
      "access-assistance",
      "access-information"
    ]
  },
  {
    "id": "configuration-evidence",
    "label": "31 · Match the evidence to the changed item",
    "title": "Match the evidence to the changed item",
    "domain": "depot",
    "view": "change-evidence",
    "component": "change-test",
    "explanation": "The Configuration & change map links the observed item with a verification question, results and exceptions. At the evidence stage, establish which results apply to the changed configuration.",
    "actionText": "Open the evidence stage and compare its inputs with its outputs. Follow the return to implementation when the configuration or evidence does not match.",
    "actionLabel": "Inspect the evidence step",
    "action": {
      "view": "change-evidence",
      "component": "change-test",
      "mode": "coasting",
      "scenario": "nominal",
      "exploded": 0,
      "cutaway": false
    },
    "question": "A test report identifies version A, while the item presented for verification is version B. What needs to be established before using that report as evidence for B?",
    "choices": [
      "Whether the evidence applies to B, with any coverage gaps or discrepancies kept explicit",
      "Whether the A report has been renamed B after updating the baseline record",
      "Whether A and B have the same external appearance"
    ],
    "answer": 0,
    "feedback": [
      "Establish the report’s applicability to B and the verification question. Keep any uncovered changes or unresolved results visible.",
      "A new label does not change what the test examined.",
      "Similar appearance cannot establish identical configuration, interface behaviour or test coverage."
    ],
    "sourceConcepts": [
      "change-test",
      "change-baseline",
      "change-issues"
    ]
  }
];
