import {EXTRA_VIEWS,EXTRA_PRIMARY,EXTRA_DOMAINS,EXTRA_CONCEPTS} from './expansion-data.js';
export const SYSTEMS = [
  {
    "id": "track",
    "number": "01",
    "label": "Track & guideway",
    "short": "Track",
    "description": "Structure, support and routing",
    "view": "track-support",
    "component": "track-ballasted",
    "views": [
      "track-support",
      "rail-fastening",
      "turnout",
      "switch-drive",
      "crossing",
      "guideway"
    ],
    "parts": [
      "running-rail",
      "track-ballasted",
      "track-ballast",
      "track-subballast",
      "track-formation",
      "track-sleeper",
      "track-rail-pad",
      "track-rail-clip",
      "track-insulator",
      "track-baseplate",
      "track-direct-fixation",
      "track-slab",
      "track-plinth",
      "track-embedded",
      "track-turnout",
      "track-stock-rail",
      "track-switch-rail",
      "track-closure-rail",
      "track-frog",
      "track-check-rail",
      "track-stretcher",
      "track-point-machine",
      "track-point-detection",
      "track-crossover",
      "track-diamond-crossing",
      "reaction-rail"
    ]
  },
  {
    "id": "power",
    "number": "02",
    "label": "Power supply",
    "short": "Power",
    "description": "Convert, distribute and protect",
    "view": "system",
    "component": "utility",
    "views": [
      "system",
      "substation",
      "guideway"
    ],
    "parts": [
      "utility",
      "ac-switchgear",
      "transformer",
      "rectifier",
      "dc-switchgear",
      "breaker",
      "wayside-resistor",
      "grounding",
      "facility-transformer",
      "disconnect",
      "substation-control",
      "control-battery",
      "positive-rail",
      "negative-rail",
      "collector"
    ]
  },
  {
    "id": "vehicle",
    "number": "03",
    "label": "Vehicle & LIM",
    "short": "Vehicle",
    "description": "Motion, braking and services",
    "view": "vehicle",
    "component": "carbody",
    "views": [
      "vehicle",
      "bogie",
      "lim",
      "services"
    ],
    "parts": [
      "carbody",
      "bogie",
      "traction-inverter",
      "lim-primary",
      "motor-slip",
      "brakes",
      "parking-brake",
      "regeneration",
      "apu",
      "vehicle-battery",
      "hvac",
      "compressor",
      "doors",
      "door-control"
    ]
  },
  {
    "id": "control",
    "number": "04",
    "label": "Train control",
    "short": "Control",
    "description": "Permission, position and operation",
    "view": "cbtc-network",
    "component": "cbtc",
    "views": [
      "cbtc-network",
      "control",
      "seltrac",
      "signalling",
      "etcs",
      "interlocking",
      "train-detection"
    ],
    "parts": [
      "atp",
      "ato",
      "ats",
      "train-control",
      "tcms",
      "zone-controller",
      "balise",
      "tachometer",
      "accelerometer",
      "brake-control",
      "cbtc",
      "movement-authority",
      "interlocking",
      "point-machine",
      "train-detection",
      "track-circuit",
      "axle-counter",
      "lineside-signal",
      "fixed-block",
      "moving-block",
      "odometry",
      "braking-curve",
      "train-integrity",
      "etcs-level-1",
      "etcs-level-2",
      "rbc",
      "etcs-onboard",
      "leu",
      "gsm-r-frmcs",
      "seltrac",
      "seltrac-loop",
      "seltrac-g9"
    ]
  },
  {
    "id": "communications",
    "number": "05",
    "label": "Communications",
    "short": "Communications",
    "description": "Radio and information networks",
    "view": "communications",
    "component": "train-radio",
    "views": [
      "communications",
      "station-networks",
      "vehicle"
    ],
    "parts": [
      "train-radio",
      "radio-antenna",
      "wayside-radio",
      "train-network",
      "passenger-info",
      "pa-intercom",
      "cctv"
    ]
  },
  {
    "id": "station",
    "number": "06",
    "label": "Stations & plant",
    "short": "Stations",
    "description": "Passenger spaces and infrastructure",
    "view": "station",
    "component": "station-pa",
    "views": [
      "station",
      "station-plant",
      "tunnel-ventilation",
      "ventilation-unit",
      "station-networks",
      "fire-systems"
    ],
    "parts": [
      "station-pa",
      "station-pis",
      "station-radio",
      "station-cctv",
      "access-controller",
      "flss",
      "fire-panel",
      "fire-detector",
      "fire-notification",
      "sprinkler-system",
      "fire-pump",
      "emergency-lighting",
      "emergency-intercom",
      "station-egress",
      "tunnel-fan",
      "tunnel-shaft",
      "tunnel-damper",
      "smoke-control",
      "station-hvac",
      "hvac-air-handler",
      "bas-controller",
      "bas-sensor",
      "bas-actuator",
      "plant-network",
      "power-scada",
      "station-scada",
      "occ-workstation",
      "station-transformer",
      "auxiliary-switchboard",
      "station-ups",
      "telecom-rack",
      "fiber-backbone",
      "network-switch"
    ]
  }
];
export const NEW_VIEWS = {
  "track-support": {
    "label": "Track support",
    "title": "Different foundations, the same wheel load",
    "component": "track-ballasted",
    "level": "Installation",
    "note": "Original track sections show mechanical support layers. Load cues are qualitative; dimensions, stiffness and drainage performance are not calculated.",
    "variants": [
      {
        "id": "ballasted",
        "label": "Ballasted",
        "title": "A distributed load path",
        "description": "The rail bridges supports; sleepers spread load into ballast and the layers below. Ballast also provides restraint and a drainage path. The moving cue illustrates load transfer, not a computed pressure field.",
        "nodes": [
          "Wheel / rail contact",
          "Rail seat + sleeper",
          "Ballast",
          "Substructure"
        ],
        "sources": [
          "K01",
          "K02",
          "K03",
          "K04"
        ],
        "component": "track-ballasted"
      },
      {
        "id": "slab",
        "label": "Slab / direct fixation",
        "title": "Resilience is still needed",
        "description": "A slab or plinth can replace the ballast support arrangement. The fastening system still controls the rail interface; direct fixation is not a rigid rail glued to concrete. The displayed assembly is one selected example.",
        "nodes": [
          "Rail",
          "Resilient seat + fastener",
          "Plinth / slab",
          "Supporting structure"
        ],
        "sources": [
          "K08",
          "K09",
          "K20"
        ],
        "component": "track-slab"
      },
      {
        "id": "embedded",
        "label": "Embedded",
        "title": "Support can surround the rail",
        "description": "Embedded track integrates the rail into a surrounding system. The selected continuous-support illustration differs from discrete embedded support blocks; neither should be treated as the definition of every slab track.",
        "nodes": [
          "Rail",
          "Resilient embedding",
          "Surrounding structure"
        ],
        "sources": [
          "K10"
        ],
        "component": "track-embedded"
      }
    ]
  },
  "rail-fastening": {
    "label": "Rail fastening",
    "title": "Small components, several interfaces",
    "component": "track-rail-clip",
    "level": "Component",
    "note": "Separate the stack to inspect contact, restraint and insulation. The clip shape and layer arrangement are original schematic geometry.",
    "variants": [
      {
        "id": "sleeper",
        "label": "Sleeper seat",
        "title": "Hold the rail, preserve resilience",
        "description": "The rail foot bears through a pad. Elastic clips restrain it through the selected shoulder and insulating interfaces. Different fastening families allocate these functions differently.",
        "nodes": [
          "Rail foot",
          "Pad / insulator",
          "Elastic restraint",
          "Sleeper"
        ],
        "sources": [
          "K05",
          "K06",
          "K07"
        ],
        "component": "track-rail-clip"
      },
      {
        "id": "direct",
        "label": "Direct fixation",
        "title": "A rail seat on a structural support",
        "description": "A direct-fixation assembly connects the rail to a slab or plinth through a designed baseplate and resilient interfaces. Anchor, pad and adjustment arrangements are system-dependent.",
        "nodes": [
          "Rail",
          "Rail pad + plate",
          "Resilient interface",
          "Structural support"
        ],
        "sources": [
          "K08",
          "K20"
        ],
        "component": "track-direct-fixation"
      }
    ]
  },
  "turnout": {
    "label": "Turnout / crossover",
    "title": "A route is a complete pair of rail paths",
    "component": "track-turnout",
    "level": "Installation",
    "note": "Moving blades, fixed rails, connecting rails and a crossing are distinct parts. Route colours illustrate geometry; they are not operating permission.",
    "variants": [
      {
        "id": "straight",
        "label": "Straight route",
        "title": "Follow both wheel paths",
        "description": "The selected switch blades lead toward the straight route, through the closure rails and crossing. Compare the complete pair of rails before inspecting a single blade.",
        "nodes": [
          "Switch",
          "Closure rails",
          "Crossing",
          "Selected path"
        ],
        "sources": [
          "K12",
          "K13",
          "K14"
        ],
        "component": "track-turnout"
      },
      {
        "id": "diverging",
        "label": "Diverging route",
        "title": "A branch changes wheel guidance",
        "description": "The alternate blade position connects the branch path. The crossing and check rails still guide the wheelset through their selected geometry. No speed or turnout number is inferred.",
        "nodes": [
          "Moved blades",
          "Branch closure rails",
          "Crossing + check rail"
        ],
        "sources": [
          "K12",
          "K13",
          "K14",
          "K15"
        ],
        "component": "track-switch-rail"
      },
      {
        "id": "crossover",
        "label": "Crossover",
        "title": "Two turnouts connect adjacent tracks",
        "description": "A crossover combines turnouts and a connecting track. It adds routes and interfaces; permission to use them is a separate interlocking question.",
        "nodes": [
          "First turnout",
          "Connecting track",
          "Second turnout"
        ],
        "sources": [
          "K19"
        ],
        "component": "track-crossover"
      }
    ]
  },
  "switch-drive": {
    "label": "Switch mechanism",
    "title": "Movement, retention and proof",
    "component": "track-point-machine",
    "level": "Assembly",
    "note": "The drive, linkage and indication are separate teaching objects. Their physical design and safety logic vary.",
    "variants": [
      {
        "id": "proved",
        "label": "Position proved",
        "title": "Movement alone is not proof",
        "description": "The drive moves the switch through a linkage. The selected indication represents a confirmed end condition, distinct from the command that asked for movement.",
        "nodes": [
          "Drive command",
          "Physical movement",
          "Position indication"
        ],
        "sources": [
          "K16",
          "K17"
        ],
        "component": "track-point-machine"
      },
      {
        "id": "unproved",
        "label": "Proof incomplete",
        "title": "A command cannot substitute for feedback",
        "description": "The selected example withholds proved indication. The graphic does not invent a fault diagnosis or a bypass; it distinguishes commanded position from confirmed state.",
        "nodes": [
          "Command present",
          "Proof incomplete",
          "No proved-route claim"
        ],
        "sources": [
          "K16",
          "K17"
        ],
        "component": "track-point-detection"
      }
    ]
  },
  "crossing": {
    "label": "Crossing detail",
    "title": "Guide a wheelset through the gap",
    "component": "track-frog",
    "level": "Component",
    "note": "The fixed crossing, wing rails and check rail are schematic. This is not a contact-stress or derailment simulation.",
    "variants": [
      {
        "id": "frog",
        "label": "Crossing + check rail",
        "title": "The opposite wheel matters",
        "description": "At a fixed crossing, the running surface includes a gap for the intersecting wheel flange. A check rail constrains the other wheel’s position so the wheelset follows the intended path.",
        "nodes": [
          "Wheelset",
          "Check-rail guidance",
          "Crossing nose / wing rails"
        ],
        "sources": [
          "K14",
          "K15"
        ],
        "component": "track-frog"
      },
      {
        "id": "diamond",
        "label": "Diamond crossing",
        "title": "Intersecting tracks do not automatically create a turnout",
        "description": "A diamond lets two tracks intersect. Compare the intersecting running paths and crossing regions; no moving switch is implied by the crossing alone.",
        "nodes": [
          "Intersecting track A",
          "Crossing regions",
          "Intersecting track B"
        ],
        "sources": [
          "K18",
          "K19"
        ],
        "component": "track-diamond-crossing"
      }
    ]
  },
  "cbtc-network": {
    "label": "ATC / CBTC",
    "title": "Estimate, communicate, protect, drive",
    "component": "cbtc",
    "level": "System",
    "note": "One radio-CBTC arrangement. Boxes represent functions; their physical allocation varies among suppliers and generations.",
    "variants": [
      {
        "id": "normal",
        "label": "Information flow",
        "title": "The radio is a transport path",
        "description": "Localization supports the train report. Wayside and onboard control functions exchange movement information; protection constrains driving. These functions are distinct from the traction converter that supplies motor energy.",
        "nodes": [
          "Localization",
          "Train–wayside exchange",
          "Protection limits",
          "Driving + vehicle response"
        ],
        "sources": [
          "S05",
          "S06",
          "S08",
          "S09"
        ],
        "component": "cbtc"
      }
    ]
  },
  "signalling": {
    "label": "Conventional",
    "title": "Detection and route protection",
    "component": "fixed-block",
    "level": "System",
    "note": "A conventional fixed-block example. Signal colours are abstract indications, not a national aspect code.",
    "variants": [
      {
        "id": "clear",
        "label": "Clear section",
        "title": "A section indication is one input",
        "description": "Track occupancy information and point proof support route protection. An apparently clear section alone is not a complete permission to proceed.",
        "nodes": [
          "Detection",
          "Interlocking + route proof",
          "Signal indication"
        ],
        "sources": [
          "S10",
          "S12",
          "S13",
          "S21"
        ],
        "component": "lineside-signal"
      },
      {
        "id": "occupied",
        "label": "Occupied section",
        "title": "Known occupancy changes the protected route",
        "description": "The occupied section is marked separately from the train’s geometric position. The demonstration illustrates a protection dependency, not a complete signalling rulebook.",
        "nodes": [
          "Occupied section",
          "Interlocking constraint",
          "Restrictive indication"
        ],
        "sources": [
          "S10",
          "S12",
          "S13",
          "S21"
        ],
        "component": "track-circuit"
      }
    ]
  },
  "etcs": {
    "label": "ETCS alternatives",
    "title": "Different communication paths, continuous supervision",
    "component": "etcs-level-1",
    "level": "System",
    "note": "ETCS level, block principle and automation grade are separate choices. These scenes are selected Level 1 and Level 2 examples.",
    "variants": [
      {
        "id": "level-1",
        "label": "Level 1",
        "title": "A passing telegram, continuing supervision",
        "description": "In this selected base arrangement, a lineside electronic unit connects signalling information to a switchable balise. The onboard equipment receives a telegram when passing and continues supervising the train between updates.",
        "nodes": [
          "Interlocking",
          "LEU + balise",
          "Passing reader",
          "Onboard supervision"
        ],
        "sources": [
          "S15",
          "S16"
        ],
        "component": "etcs-level-1"
      },
      {
        "id": "level-2",
        "label": "Level 2",
        "title": "Radio exchange with a Radio Block Centre",
        "description": "The RBC uses relevant infrastructure information and exchanges movement information with onboard equipment by radio. Balises support location reference. Detection and integrity arrangements still require an explicit design.",
        "nodes": [
          "Interlocking + RBC",
          "Radio exchange",
          "Onboard supervision",
          "Position reference"
        ],
        "sources": [
          "S15",
          "S17",
          "S18"
        ],
        "component": "etcs-level-2"
      }
    ]
  },
  "seltrac": {
    "label": "Hitachi SelTrac",
    "title": "One product family, different generations",
    "component": "seltrac",
    "level": "Architecture",
    "note": "Historical arrangements and current public product descriptions are shown separately. This is not an installed-system cabinet map.",
    "variants": [
      {
        "id": "loop",
        "label": "Legacy loop",
        "title": "An inductive communication example",
        "description": "The legacy loop view separates the train–wayside communication medium from the protection and operation functions. The drawn loop is an original functional illustration, not a cable-installation drawing.",
        "nodes": [
          "Onboard interface",
          "Inductive data loop",
          "Wayside control functions"
        ],
        "sources": [
          "S02",
          "S03"
        ],
        "component": "seltrac-loop"
      },
      {
        "id": "radio",
        "label": "Radio communications",
        "title": "Transport changes; responsibilities remain identifiable",
        "description": "Hitachi publishes radio-based SelTrac communications options. The antenna and radio carry information; they do not replace the need to explain localization, protection and driving responsibilities.",
        "nodes": [
          "Train radio",
          "Wayside communications",
          "Control functions"
        ],
        "sources": [
          "S01"
        ],
        "component": "seltrac"
      },
      {
        "id": "g9",
        "label": "G9 publication",
        "title": "Logical functions and their hosting environment",
        "description": "Hitachi’s 2026 publication describes virtualized signalling safety functions for SelTrac G9. The model separates function from hosting; it makes no claim about a particular deployment, interface or certification.",
        "nodes": [
          "Communication interface",
          "Hosted control functions",
          "Supervisory view"
        ],
        "sources": [
          "S04"
        ],
        "component": "seltrac-g9"
      }
    ]
  },
  "interlocking": {
    "label": "Interlocking",
    "title": "A route request needs proved conditions",
    "component": "interlocking",
    "level": "Assembly",
    "note": "A bounded relationship example connects physical points, detection and route logic. It does not implement a complete interlocking.",
    "variants": [
      {
        "id": "proved",
        "label": "Conditions proved",
        "title": "Command, feedback and permission are different",
        "description": "The point mechanism moves, position is indicated, and the relevant route inputs are shown together. Permission is represented as a separate output of the selected logic.",
        "nodes": [
          "Route request",
          "Point command",
          "Proved inputs",
          "Route output"
        ],
        "sources": [
          "S10",
          "S11"
        ],
        "component": "interlocking"
      },
      {
        "id": "unproved",
        "label": "Proof incomplete",
        "title": "Do not infer position from a command",
        "description": "With the proof condition incomplete, the model does not present the route as proved. A mechanism’s appearance is also not a substitute for the selected detection interface.",
        "nodes": [
          "Command",
          "Missing indication",
          "No proved route"
        ],
        "sources": [
          "S10",
          "S11"
        ],
        "component": "point-machine"
      }
    ]
  },
  "train-detection": {
    "label": "Detection",
    "title": "Three devices, three information roles",
    "component": "train-detection",
    "level": "Component",
    "note": "Occupancy detection and a location reference answer different questions. No detector availability or accuracy is calculated.",
    "variants": [
      {
        "id": "track-circuit",
        "label": "Track circuit",
        "title": "An electrical section detects occupancy",
        "description": "The rail circuit, its feed and its receiver form the selected detection example. A wheelset changes the circuit condition; this is separate from a traction return or a LIM secondary.",
        "nodes": [
          "Circuit feed",
          "Rail section",
          "Wheelset interaction",
          "Receiver indication"
        ],
        "sources": [
          "S13"
        ],
        "component": "track-circuit"
      },
      {
        "id": "axle-counter",
        "label": "Axle counter",
        "title": "Count at the section boundaries",
        "description": "Wheel sensors report axle passages to evaluation equipment. The selected model compares entry and exit counts; it does not show reset procedures or claim that a counter proves train integrity universally.",
        "nodes": [
          "Entry sensor",
          "Evaluation",
          "Exit sensor",
          "Section state"
        ],
        "sources": [
          "S14"
        ],
        "component": "axle-counter"
      },
      {
        "id": "balise",
        "label": "Balise",
        "title": "A passing reference is not an occupancy section",
        "description": "The onboard reader and track-mounted transponder exchange information at a passing point. A balise can support a location reference; it does not perform the same job as a track circuit.",
        "nodes": [
          "Track transponder",
          "Passing reader",
          "Onboard reference"
        ],
        "sources": [
          "S16",
          "S19"
        ],
        "component": "balise"
      }
    ]
  },
  "station": {
    "label": "Station overview",
    "title": "Public spaces, hidden supporting systems",
    "component": "station-pa",
    "level": "Installation",
    "note": "A fictional station cutaway connects concourse, platform, equipment spaces and tunnel interfaces. It is not a building or evacuation design.",
    "variants": [
      {
        "id": "all",
        "label": "Whole station",
        "title": "Several systems share one passenger environment",
        "description": "A station brings together passenger information, communications, fire and life safety, electrical supplies and building services. Follow a device to its supporting equipment before following the supervisory view.",
        "nodes": [
          "Passenger devices",
          "Local equipment",
          "Supporting power / networks",
          "Supervision"
        ],
        "sources": [
          "F01",
          "F03",
          "F04"
        ],
        "component": "station-pa"
      },
      {
        "id": "passenger",
        "label": "Passenger systems",
        "title": "Information, assistance and situational awareness",
        "description": "Displays, loudspeakers, help points, cameras and lighting serve different passenger and operational needs. Their co-location does not make them one control system.",
        "nodes": [
          "Displays + announcements",
          "Help points",
          "Video + lighting"
        ],
        "sources": [
          "F02",
          "F04",
          "F06",
          "F10"
        ],
        "component": "station-pis"
      },
      {
        "id": "equipment",
        "label": "Equipment spaces",
        "title": "Look behind the public-facing device",
        "description": "The equipment emphasis reveals the supply, network and control interfaces behind the platform devices. The illustrated rooms and mounting locations are compositional choices.",
        "nodes": [
          "Device",
          "Local equipment",
          "Power and data interfaces"
        ],
        "sources": [
          "F03",
          "F19",
          "F20"
        ],
        "component": "telecom-rack"
      }
    ]
  },
  "station-plant": {
    "label": "Plant rooms",
    "title": "What keeps the station operating",
    "component": "station-ups",
    "level": "Assembly",
    "note": "Electrical, air and fire-water equipment are separate cutaway bays; they are not a proposed shared plant-room arrangement.",
    "variants": [
      {
        "id": "electrical",
        "label": "Electrical",
        "title": "Convert, distribute and support selected loads",
        "description": "The station supply, switchboard and UPS are distinct parts of the auxiliary distribution. A UPS supports an engineered load set; it does not imply unlimited backup of every station system.",
        "nodes": [
          "Station supply",
          "Switchboard",
          "UPS + selected loads"
        ],
        "sources": [
          "F18",
          "F19"
        ],
        "component": "station-transformer"
      },
      {
        "id": "air",
        "label": "Air treatment",
        "title": "Move and condition air",
        "description": "The air handler separates the fan, filter, heating/cooling elements and air paths. Sensors and actuators connect physical plant operation to building controls.",
        "nodes": [
          "Air path",
          "Filter / coils",
          "Fan",
          "Sensors + control"
        ],
        "sources": [
          "F14",
          "F15",
          "F16"
        ],
        "component": "hvac-air-handler"
      },
      {
        "id": "water",
        "label": "Fire-water",
        "title": "Pressure and flow are physical requirements",
        "description": "The fire pump and pipework are physical plant serving a selected protection arrangement. A supervisory indication is distinct from the pump’s local control and the hydraulic performance of a system.",
        "nodes": [
          "Water supply",
          "Pump + local control",
          "Distribution pipework"
        ],
        "sources": [
          "F08",
          "F09"
        ],
        "component": "fire-pump"
      }
    ]
  },
  "tunnel-ventilation": {
    "label": "Tunnel ventilation",
    "title": "Fans, shafts and dampers form an air path",
    "component": "tunnel-fan",
    "level": "Installation",
    "note": "Air particles are qualitative cues. The model does not calculate flow, tenability, heat release, pressure or an emergency fan sequence.",
    "variants": [
      {
        "id": "normal",
        "label": "Normal objective",
        "title": "Exchange air and manage the environment",
        "description": "Normal ventilation addresses the selected environmental objectives. Fan, shaft and damper relationships must be understood together; visible rotation alone does not establish delivered airflow.",
        "nodes": [
          "Tunnel",
          "Fan / air path",
          "Shaft",
          "Outdoor boundary"
        ],
        "sources": [
          "F11",
          "F13"
        ],
        "component": "tunnel-fan"
      },
      {
        "id": "smoke-objective",
        "label": "Smoke-management objective",
        "title": "A different objective requires an engineered strategy",
        "description": "A smoke-management objective considers air movement and the protected environment. The graphic highlights the relevant interfaces only; it does not prescribe fan directions, damper positions or an evacuation response.",
        "nodes": [
          "Defined incident scenario",
          "Engineered ventilation objective",
          "Equipment interfaces",
          "Separate performance assessment required"
        ],
        "sources": [
          "F01",
          "F11",
          "F12",
          "F13"
        ],
        "component": "smoke-control"
      }
    ]
  },
  "ventilation-unit": {
    "label": "Fan / damper / AHU",
    "title": "Inspect the mechanism inside the enclosure",
    "component": "tunnel-fan",
    "level": "Component",
    "note": "Component cutaways explain mechanics. They do not substitute for a fan curve, damper rating, control design or fire-resistance qualification.",
    "variants": [
      {
        "id": "fan",
        "label": "Axial fan",
        "title": "A rotating impeller adds energy to the air",
        "description": "The motor, shaft, impeller and casing form a mechanical assembly. Actual duty depends on the fan characteristic and the connected air system, not just the direction of the rendered arrows.",
        "nodes": [
          "Motor",
          "Shaft + impeller",
          "Air path"
        ],
        "sources": [
          "F11"
        ],
        "component": "tunnel-fan"
      },
      {
        "id": "damper",
        "label": "Damper",
        "title": "An actuator changes a flow opening",
        "description": "The linkage turns the damper blades and the selected position indication reports state. Position feedback and an airflow measurement are different quantities.",
        "nodes": [
          "Actuator",
          "Linkage + blades",
          "Position indication"
        ],
        "sources": [
          "F12"
        ],
        "component": "tunnel-damper"
      },
      {
        "id": "air-handler",
        "label": "Air handler",
        "title": "Conditioning has several stages",
        "description": "The enlarged air handler exposes filtration, heat-transfer elements and a fan section. Electrical power, control messages and physical airflow remain separate paths.",
        "nodes": [
          "Filter",
          "Heating / cooling section",
          "Fan",
          "Duct"
        ],
        "sources": [
          "F14",
          "F16"
        ],
        "component": "hvac-air-handler"
      }
    ]
  },
  "station-networks": {
    "label": "SCADA / BAS / networks",
    "title": "Supervision connects systems without erasing their boundaries",
    "component": "station-scada",
    "level": "System",
    "note": "Coloured traces are logical interfaces. Shared visualization does not imply common controllers, network security zones or a universal command priority.",
    "variants": [
      {
        "id": "power",
        "label": "Power SCADA",
        "title": "Electrical equipment has its own local interfaces",
        "description": "Power SCADA presents measurements, equipment states and authorized control interfaces for electrical infrastructure. Protection and local equipment control remain distinct functions.",
        "nodes": [
          "Electrical equipment",
          "Local interface / RTU",
          "Power SCADA",
          "Operator view"
        ],
        "sources": [
          "F17"
        ],
        "component": "power-scada"
      },
      {
        "id": "station",
        "label": "Station supervision",
        "title": "A shared view can cover different subsystems",
        "description": "Station supervision can integrate status and permitted controls across infrastructure and communications. The detailed functions and authority boundaries are project-specific.",
        "nodes": [
          "Local subsystem",
          "Communications network",
          "Station supervision",
          "OCC view"
        ],
        "sources": [
          "F03",
          "F20"
        ],
        "component": "station-scada"
      },
      {
        "id": "building",
        "label": "Building automation",
        "title": "Sensors, controllers and actuators close local loops",
        "description": "BAS controls building plant using measurements, algorithms and actuator outputs. A supervisory screen is not the physical control loop or a substitute for a fire-system interface design.",
        "nodes": [
          "Sensor",
          "BAS controller",
          "Actuator + plant",
          "Supervisory status"
        ],
        "sources": [
          "F15",
          "F16"
        ],
        "component": "bas-controller"
      }
    ]
  },
  "fire-systems": {
    "label": "Fire & life safety",
    "title": "Detection, notification, protection and egress",
    "component": "flss",
    "level": "System",
    "note": "Related fire and life safety functions are shown together, without claiming a complete cause-and-effect matrix, standard compliance or emergency operating sequence.",
    "variants": [
      {
        "id": "detect",
        "label": "Detect and indicate",
        "title": "Separate a detector from the panel that supervises it",
        "description": "Detectors and monitored circuits provide inputs to the fire-alarm system. The panel processes and presents conditions; other equipment interfaces require an explicit design.",
        "nodes": [
          "Detector / circuit",
          "Fire panel",
          "Indication + designed interfaces"
        ],
        "sources": [
          "F01",
          "F07"
        ],
        "component": "fire-panel"
      },
      {
        "id": "notify",
        "label": "Communicate and support egress",
        "title": "People need information and usable routes",
        "description": "Notification, emergency communications, lighting and the physical escape route have different roles. Their relationship is an engineered station design, not a single generic alarm-output chain.",
        "nodes": [
          "Notification",
          "Emergency communication",
          "Lighting",
          "Egress route"
        ],
        "sources": [
          "F01",
          "F02",
          "F04",
          "F10"
        ],
        "component": "fire-notification",
        "parallel": true
      },
      {
        "id": "water",
        "label": "Water-based protection",
        "title": "Sprinklers and pumps are not generic alarm-operated taps",
        "description": "In a conventional thermal sprinkler, heat operates the individual sprinkler element. The water supply and pump arrangement provide separate supporting functions. The model does not imply that every detector opens every sprinkler.",
        "nodes": [
          "Thermal sprinkler element",
          "Pipework",
          "Water supply + pump"
        ],
        "sources": [
          "F08",
          "F09"
        ],
        "component": "sprinkler-system"
      }
    ]
  }
};
export const PART_VIEWS = {
  "running-rail": "rail-fastening",
  "track-rail-pad": "rail-fastening",
  "track-rail-clip": "rail-fastening",
  "track-insulator": "rail-fastening",
  "track-baseplate": "rail-fastening",
  "track-ballasted": "track-support",
  "track-ballast": "track-support",
  "track-subballast": "track-support",
  "track-formation": "track-support",
  "track-sleeper": "track-support",
  "track-direct-fixation": "rail-fastening",
  "track-slab": "track-support",
  "track-plinth": "track-support",
  "track-embedded": "track-support",
  "track-turnout": "turnout",
  "track-stock-rail": "turnout",
  "track-switch-rail": "turnout",
  "track-closure-rail": "turnout",
  "track-crossover": "turnout",
  "track-frog": "crossing",
  "track-check-rail": "crossing",
  "track-diamond-crossing": "crossing",
  "track-stretcher": "switch-drive",
  "track-point-machine": "switch-drive",
  "track-point-detection": "switch-drive",
  "cbtc": "cbtc-network",
  "zone-controller": "cbtc-network",
  "movement-authority": "cbtc-network",
  "moving-block": "cbtc-network",
  "odometry": "cbtc-network",
  "braking-curve": "cbtc-network",
  "train-integrity": "cbtc-network",
  "interlocking": "interlocking",
  "point-machine": "interlocking",
  "fixed-block": "signalling",
  "lineside-signal": "signalling",
  "train-detection": "train-detection",
  "track-circuit": "train-detection",
  "axle-counter": "train-detection",
  "etcs-level-1": "etcs",
  "leu": "etcs",
  "etcs-level-2": "etcs",
  "rbc": "etcs",
  "etcs-onboard": "etcs",
  "gsm-r-frmcs": "etcs",
  "balise": "train-detection",
  "seltrac": "seltrac",
  "seltrac-loop": "seltrac",
  "seltrac-g9": "seltrac",
  "station-pa": "station",
  "station-pis": "station",
  "station-radio": "station-networks",
  "station-cctv": "station",
  "access-controller": "station",
  "emergency-intercom": "station",
  "emergency-lighting": "station",
  "station-egress": "station",
  "flss": "fire-systems",
  "fire-panel": "fire-systems",
  "fire-detector": "fire-systems",
  "fire-notification": "fire-systems",
  "sprinkler-system": "fire-systems",
  "fire-pump": "fire-systems",
  "tunnel-fan": "ventilation-unit",
  "tunnel-damper": "ventilation-unit",
  "bas-actuator": "ventilation-unit",
  "tunnel-shaft": "tunnel-ventilation",
  "smoke-control": "tunnel-ventilation",
  "station-hvac": "ventilation-unit",
  "hvac-air-handler": "ventilation-unit",
  "bas-controller": "station-networks",
  "bas-sensor": "station-networks",
  "plant-network": "station-networks",
  "power-scada": "station-networks",
  "station-scada": "station-networks",
  "occ-workstation": "station-networks",
  "telecom-rack": "station-networks",
  "fiber-backbone": "station-networks",
  "network-switch": "station-networks",
  "station-transformer": "station-plant",
  "auxiliary-switchboard": "station-plant",
  "station-ups": "station-plant"
};
export const PART_VARIANTS = {
  "running-rail": "sleeper",
  "track-rail-pad": "sleeper",
  "track-rail-clip": "sleeper",
  "track-insulator": "sleeper",
  "track-baseplate": "direct",
  "track-ballasted": "ballasted",
  "track-ballast": "ballasted",
  "track-subballast": "ballasted",
  "track-formation": "ballasted",
  "track-sleeper": "ballasted",
  "track-direct-fixation": "direct",
  "track-slab": "slab",
  "track-plinth": "slab",
  "track-embedded": "embedded",
  "track-turnout": "straight",
  "track-stock-rail": "straight",
  "track-switch-rail": "straight",
  "track-closure-rail": "straight",
  "track-crossover": "crossover",
  "track-frog": "frog",
  "track-check-rail": "frog",
  "track-diamond-crossing": "diamond",
  "track-stretcher": "proved",
  "track-point-machine": "proved",
  "track-point-detection": "proved",
  "cbtc": "normal",
  "zone-controller": "normal",
  "movement-authority": "normal",
  "moving-block": "normal",
  "odometry": "normal",
  "braking-curve": "normal",
  "train-integrity": "normal",
  "interlocking": "proved",
  "point-machine": "proved",
  "fixed-block": "clear",
  "lineside-signal": "clear",
  "train-detection": "track-circuit",
  "track-circuit": "track-circuit",
  "axle-counter": "axle-counter",
  "etcs-level-1": "level-1",
  "leu": "level-1",
  "etcs-level-2": "level-2",
  "rbc": "level-2",
  "etcs-onboard": "level-2",
  "gsm-r-frmcs": "level-2",
  "balise": "balise",
  "seltrac": "radio",
  "seltrac-loop": "loop",
  "seltrac-g9": "g9",
  "station-pa": "all",
  "station-pis": "all",
  "station-radio": "station",
  "station-cctv": "all",
  "access-controller": "all",
  "emergency-intercom": "all",
  "emergency-lighting": "all",
  "station-egress": "all",
  "flss": "detect",
  "fire-panel": "detect",
  "fire-detector": "detect",
  "fire-notification": "notify",
  "sprinkler-system": "water",
  "fire-pump": "water",
  "tunnel-fan": "fan",
  "tunnel-damper": "damper",
  "bas-actuator": "damper",
  "tunnel-shaft": "normal",
  "smoke-control": "smoke-objective",
  "station-hvac": "air-handler",
  "hvac-air-handler": "air-handler",
  "bas-controller": "building",
  "bas-sensor": "building",
  "plant-network": "building",
  "power-scada": "power",
  "station-scada": "station",
  "occ-workstation": "station",
  "telecom-rack": "station",
  "fiber-backbone": "station",
  "network-switch": "station",
  "station-transformer": "electrical",
  "auxiliary-switchboard": "electrical",
  "station-ups": "electrical"
};
export const PART_CONTEXTS = {
  "running-rail": [
    "rail-fastening",
    "track-support"
  ],
  "zone-controller": [
    "cbtc-network",
    "control"
  ],
  "balise": [
    "train-detection",
    "etcs"
  ],
  "track-ballasted": [
    "track-support"
  ],
  "track-ballast": [
    "track-support",
    "rail-fastening"
  ],
  "track-subballast": [
    "track-support"
  ],
  "track-formation": [
    "track-support"
  ],
  "track-sleeper": [
    "track-support",
    "rail-fastening"
  ],
  "track-rail-pad": [
    "rail-fastening",
    "track-support"
  ],
  "track-rail-clip": [
    "rail-fastening",
    "track-support"
  ],
  "track-insulator": [
    "rail-fastening",
    "track-support"
  ],
  "track-baseplate": [
    "rail-fastening",
    "track-support"
  ],
  "track-direct-fixation": [
    "rail-fastening",
    "track-support"
  ],
  "track-slab": [
    "track-support",
    "rail-fastening"
  ],
  "track-plinth": [
    "track-support",
    "rail-fastening"
  ],
  "track-embedded": [
    "track-support"
  ],
  "track-turnout": [
    "turnout",
    "switch-drive"
  ],
  "track-stock-rail": [
    "turnout",
    "switch-drive"
  ],
  "track-switch-rail": [
    "turnout",
    "switch-drive"
  ],
  "track-closure-rail": [
    "turnout"
  ],
  "track-frog": [
    "crossing",
    "turnout"
  ],
  "track-check-rail": [
    "crossing",
    "turnout"
  ],
  "track-stretcher": [
    "switch-drive",
    "turnout"
  ],
  "track-point-machine": [
    "switch-drive",
    "turnout"
  ],
  "track-point-detection": [
    "switch-drive",
    "turnout"
  ],
  "track-crossover": [
    "turnout"
  ],
  "track-diamond-crossing": [
    "crossing"
  ],
  "cbtc": [
    "cbtc-network"
  ],
  "movement-authority": [
    "cbtc-network"
  ],
  "interlocking": [
    "interlocking",
    "signalling"
  ],
  "point-machine": [
    "interlocking"
  ],
  "train-detection": [
    "train-detection",
    "signalling"
  ],
  "track-circuit": [
    "train-detection",
    "signalling"
  ],
  "axle-counter": [
    "train-detection",
    "signalling"
  ],
  "lineside-signal": [
    "signalling",
    "interlocking"
  ],
  "fixed-block": [
    "signalling"
  ],
  "moving-block": [
    "cbtc-network"
  ],
  "odometry": [
    "cbtc-network"
  ],
  "braking-curve": [
    "cbtc-network",
    "control"
  ],
  "train-integrity": [
    "cbtc-network",
    "control"
  ],
  "etcs-level-1": [
    "etcs"
  ],
  "etcs-level-2": [
    "etcs"
  ],
  "rbc": [
    "etcs"
  ],
  "etcs-onboard": [
    "etcs"
  ],
  "leu": [
    "etcs"
  ],
  "gsm-r-frmcs": [
    "etcs"
  ],
  "seltrac": [
    "seltrac"
  ],
  "seltrac-loop": [
    "seltrac"
  ],
  "seltrac-g9": [
    "seltrac"
  ],
  "station-pa": [
    "station"
  ],
  "station-pis": [
    "station"
  ],
  "station-radio": [
    "station-networks"
  ],
  "station-cctv": [
    "station"
  ],
  "access-controller": [
    "station"
  ],
  "flss": [
    "fire-systems"
  ],
  "fire-panel": [
    "fire-systems",
    "station"
  ],
  "fire-detector": [
    "fire-systems",
    "station"
  ],
  "fire-notification": [
    "fire-systems"
  ],
  "sprinkler-system": [
    "fire-systems",
    "station-plant"
  ],
  "fire-pump": [
    "fire-systems",
    "station-plant"
  ],
  "emergency-lighting": [
    "station",
    "fire-systems"
  ],
  "emergency-intercom": [
    "station",
    "fire-systems"
  ],
  "station-egress": [
    "station",
    "fire-systems"
  ],
  "tunnel-fan": [
    "ventilation-unit",
    "tunnel-ventilation"
  ],
  "tunnel-shaft": [
    "tunnel-ventilation",
    "station"
  ],
  "tunnel-damper": [
    "ventilation-unit",
    "tunnel-ventilation"
  ],
  "smoke-control": [
    "tunnel-ventilation"
  ],
  "station-hvac": [
    "ventilation-unit",
    "station-plant"
  ],
  "hvac-air-handler": [
    "ventilation-unit",
    "station-plant"
  ],
  "bas-controller": [
    "station-networks",
    "station-plant"
  ],
  "bas-sensor": [
    "station-networks",
    "station-plant"
  ],
  "bas-actuator": [
    "ventilation-unit",
    "tunnel-ventilation"
  ],
  "plant-network": [
    "station-networks"
  ],
  "power-scada": [
    "station-networks"
  ],
  "station-scada": [
    "station-networks"
  ],
  "occ-workstation": [
    "station-networks"
  ],
  "station-transformer": [
    "station-plant"
  ],
  "auxiliary-switchboard": [
    "station-plant"
  ],
  "station-ups": [
    "station-plant"
  ],
  "telecom-rack": [
    "station-networks",
    "station-plant",
    "station"
  ],
  "fiber-backbone": [
    "station-networks",
    "station-plant",
    "station"
  ],
  "network-switch": [
    "station-networks",
    "station-plant",
    "station"
  ]
};
export const PART_VIEW_VARIANTS = {
  "utility": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "ac-switchgear": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "transformer": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "rectifier": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "dc-switchgear": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "breaker": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "wayside-resistor": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "grounding": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "facility-transformer": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "disconnect": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ],
    "guideway": [
      "default"
    ]
  },
  "positive-rail": {
    "system": [
      "default"
    ],
    "guideway": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ],
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ]
  },
  "negative-rail": {
    "system": [
      "default"
    ],
    "guideway": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ],
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ]
  },
  "running-rail": {
    "system": [
      "default"
    ],
    "guideway": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "track-support": [
      "ballasted",
      "slab",
      "embedded"
    ],
    "rail-fastening": [
      "sleeper",
      "direct"
    ],
    "crossing": [
      "frog",
      "diamond"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ],
    "train-detection": [
      "track-circuit",
      "axle-counter",
      "balise"
    ],
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ]
  },
  "reaction-rail": {
    "system": [
      "default"
    ],
    "guideway": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "lim": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ],
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ]
  },
  "collector": {
    "system": [
      "default"
    ],
    "guideway": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "carbody": {
    "system": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ],
    "station": [
      "all",
      "passenger",
      "equipment"
    ]
  },
  "bogie": {
    "system": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "track-support": [
      "ballasted",
      "slab",
      "embedded"
    ],
    "turnout": [
      "straight",
      "diverging"
    ],
    "crossing": [
      "frog",
      "diamond"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ],
    "train-detection": [
      "track-circuit",
      "axle-counter",
      "balise"
    ],
    "station": [
      "all",
      "passenger",
      "equipment"
    ]
  },
  "traction-inverter": {
    "system": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "lim-primary": {
    "system": [
      "default"
    ],
    "guideway": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "lim": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "motor-slip": {
    "system": [
      "default"
    ],
    "guideway": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "lim": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "apu": {
    "system": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "vehicle-battery": {
    "system": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "brakes": {
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ]
  },
  "parking-brake": {
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ]
  },
  "hvac": {
    "system": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "compressor": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ]
  },
  "doors": {
    "system": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "regeneration": {
    "system": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "substation-control": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "control-battery": {
    "system": [
      "default"
    ],
    "substation": [
      "default"
    ]
  },
  "atp": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "ato": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "ats": {
    "control": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "g9"
    ]
  },
  "train-control": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "tcms": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ]
  },
  "train-radio": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "radio"
    ]
  },
  "radio-antenna": {
    "system": [
      "default"
    ],
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "wayside-radio": {
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "etcs": [
      "level-2"
    ],
    "seltrac": [
      "radio",
      "g9"
    ]
  },
  "zone-controller": {
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio"
    ]
  },
  "balise": {
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "train-detection": [
      "balise"
    ]
  },
  "tachometer": {
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ]
  },
  "accelerometer": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ]
  },
  "door-control": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ]
  },
  "passenger-info": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ]
  },
  "pa-intercom": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ]
  },
  "cctv": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ]
  },
  "train-network": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ]
  },
  "brake-control": {
    "vehicle": [
      "default"
    ],
    "bogie": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ]
  },
  "track-ballasted": {
    "track-support": [
      "ballasted"
    ]
  },
  "track-ballast": {
    "track-support": [
      "ballasted"
    ],
    "rail-fastening": [
      "sleeper"
    ],
    "turnout": [
      "straight",
      "diverging",
      "crossover"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ],
    "crossing": [
      "frog"
    ]
  },
  "track-subballast": {
    "track-support": [
      "ballasted"
    ]
  },
  "track-formation": {
    "track-support": [
      "ballasted",
      "slab"
    ]
  },
  "track-sleeper": {
    "track-support": [
      "ballasted"
    ],
    "rail-fastening": [
      "sleeper"
    ],
    "turnout": [
      "straight",
      "diverging",
      "crossover"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ],
    "crossing": [
      "frog"
    ]
  },
  "track-rail-pad": {
    "track-support": [
      "ballasted",
      "slab"
    ],
    "rail-fastening": [
      "sleeper",
      "direct"
    ],
    "turnout": [
      "straight",
      "diverging"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ],
    "crossing": [
      "frog",
      "diamond"
    ]
  },
  "track-rail-clip": {
    "track-support": [
      "ballasted",
      "slab"
    ],
    "rail-fastening": [
      "sleeper",
      "direct"
    ],
    "turnout": [
      "straight",
      "diverging"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ],
    "crossing": [
      "frog",
      "diamond"
    ]
  },
  "track-insulator": {
    "track-support": [
      "ballasted",
      "slab"
    ],
    "rail-fastening": [
      "sleeper",
      "direct"
    ],
    "turnout": [
      "straight",
      "diverging"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ],
    "crossing": [
      "frog",
      "diamond"
    ]
  },
  "track-baseplate": {
    "track-support": [
      "slab"
    ],
    "rail-fastening": [
      "direct"
    ],
    "crossing": [
      "diamond"
    ]
  },
  "track-direct-fixation": {
    "track-support": [
      "slab"
    ],
    "rail-fastening": [
      "direct"
    ]
  },
  "track-slab": {
    "track-support": [
      "slab",
      "embedded"
    ],
    "rail-fastening": [
      "direct"
    ],
    "crossing": [
      "diamond"
    ]
  },
  "track-plinth": {
    "track-support": [
      "slab"
    ],
    "rail-fastening": [
      "direct"
    ],
    "crossing": [
      "diamond"
    ]
  },
  "track-embedded": {
    "track-support": [
      "embedded"
    ]
  },
  "track-turnout": {
    "turnout": [
      "straight",
      "diverging",
      "crossover"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ],
    "crossing": [
      "frog"
    ]
  },
  "track-stock-rail": {
    "turnout": [
      "straight",
      "diverging",
      "crossover"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ]
  },
  "track-switch-rail": {
    "turnout": [
      "straight",
      "diverging",
      "crossover"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "track-closure-rail": {
    "turnout": [
      "straight",
      "diverging",
      "crossover"
    ]
  },
  "track-frog": {
    "turnout": [
      "straight",
      "diverging",
      "crossover"
    ],
    "crossing": [
      "frog",
      "diamond"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "track-check-rail": {
    "turnout": [
      "straight",
      "diverging",
      "crossover"
    ],
    "crossing": [
      "frog",
      "diamond"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "track-stretcher": {
    "turnout": [
      "straight",
      "diverging",
      "crossover"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "track-point-machine": {
    "turnout": [
      "straight",
      "diverging"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ]
  },
  "track-point-detection": {
    "turnout": [
      "straight",
      "diverging"
    ],
    "switch-drive": [
      "proved",
      "unproved"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "track-crossover": {
    "turnout": [
      "crossover"
    ]
  },
  "track-diamond-crossing": {
    "crossing": [
      "diamond"
    ]
  },
  "cbtc": {
    "cbtc-network": [
      "normal"
    ]
  },
  "movement-authority": {
    "cbtc-network": [
      "normal"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "interlocking": {
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "point-machine": {
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "train-detection": {
    "cbtc-network": [
      "normal"
    ],
    "signalling": [
      "clear",
      "occupied"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ],
    "train-detection": [
      "track-circuit",
      "axle-counter"
    ]
  },
  "track-circuit": {
    "signalling": [
      "clear",
      "occupied"
    ],
    "train-detection": [
      "track-circuit"
    ]
  },
  "axle-counter": {
    "signalling": [
      "clear",
      "occupied"
    ],
    "train-detection": [
      "axle-counter"
    ]
  },
  "lineside-signal": {
    "signalling": [
      "clear",
      "occupied"
    ],
    "etcs": [
      "level-1"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "fixed-block": {
    "signalling": [
      "clear",
      "occupied"
    ]
  },
  "moving-block": {
    "cbtc-network": [
      "normal"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ],
    "interlocking": [
      "proved",
      "unproved"
    ]
  },
  "odometry": {
    "cbtc-network": [
      "normal"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "train-detection": [
      "balise"
    ]
  },
  "braking-curve": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "etcs": [
      "level-1",
      "level-2"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "train-integrity": {
    "vehicle": [
      "default"
    ],
    "control": [
      "default"
    ],
    "communications": [
      "default"
    ],
    "services": [
      "default"
    ],
    "cbtc-network": [
      "normal"
    ],
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "etcs-level-1": {
    "etcs": [
      "level-1"
    ]
  },
  "etcs-level-2": {
    "etcs": [
      "level-2"
    ]
  },
  "rbc": {
    "etcs": [
      "level-2"
    ]
  },
  "etcs-onboard": {
    "etcs": [
      "level-1",
      "level-2"
    ],
    "train-detection": [
      "balise"
    ]
  },
  "leu": {
    "etcs": [
      "level-1"
    ]
  },
  "gsm-r-frmcs": {
    "etcs": [
      "level-2"
    ]
  },
  "seltrac": {
    "seltrac": [
      "loop",
      "radio",
      "g9"
    ]
  },
  "seltrac-loop": {
    "seltrac": [
      "loop"
    ]
  },
  "seltrac-g9": {
    "seltrac": [
      "g9"
    ]
  },
  "station-pa": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "station-plant": [
      "electrical",
      "air",
      "water"
    ]
  },
  "station-pis": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ]
  },
  "station-radio": {
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "station-cctv": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ]
  },
  "access-controller": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ]
  },
  "flss": {
    "fire-systems": [
      "detect",
      "notify",
      "water"
    ]
  },
  "fire-panel": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "fire-systems": [
      "detect",
      "notify",
      "water"
    ]
  },
  "fire-detector": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "fire-systems": [
      "detect",
      "notify",
      "water"
    ]
  },
  "fire-notification": {
    "fire-systems": [
      "detect",
      "notify",
      "water"
    ]
  },
  "sprinkler-system": {
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "fire-systems": [
      "detect",
      "notify",
      "water"
    ]
  },
  "fire-pump": {
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "fire-systems": [
      "detect",
      "notify",
      "water"
    ]
  },
  "emergency-lighting": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "fire-systems": [
      "detect",
      "notify",
      "water"
    ]
  },
  "emergency-intercom": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "fire-systems": [
      "detect",
      "notify",
      "water"
    ]
  },
  "station-egress": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "fire-systems": [
      "detect",
      "notify",
      "water"
    ]
  },
  "tunnel-fan": {
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ],
    "ventilation-unit": [
      "fan"
    ]
  },
  "tunnel-shaft": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ]
  },
  "tunnel-damper": {
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ],
    "ventilation-unit": [
      "damper"
    ]
  },
  "smoke-control": {
    "tunnel-ventilation": [
      "smoke-objective"
    ]
  },
  "station-hvac": {
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "ventilation-unit": [
      "air-handler"
    ]
  },
  "hvac-air-handler": {
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "ventilation-unit": [
      "air-handler"
    ]
  },
  "bas-controller": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ],
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "bas-sensor": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ],
    "ventilation-unit": [
      "air-handler"
    ],
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "bas-actuator": {
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "tunnel-ventilation": [
      "normal",
      "smoke-objective"
    ],
    "ventilation-unit": [
      "damper",
      "air-handler"
    ],
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "plant-network": {
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "power-scada": {
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "station-scada": {
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "occ-workstation": {
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "station-transformer": {
    "station-plant": [
      "electrical",
      "air",
      "water"
    ]
  },
  "auxiliary-switchboard": {
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "station-ups": {
    "station-plant": [
      "electrical",
      "air",
      "water"
    ]
  },
  "telecom-rack": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "fiber-backbone": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  },
  "network-switch": {
    "station": [
      "all",
      "passenger",
      "equipment"
    ],
    "station-plant": [
      "electrical",
      "air",
      "water"
    ],
    "station-networks": [
      "power",
      "station",
      "building"
    ]
  }
};
export const PART_RELATIONS = {
  "running-rail": [
    "bogie",
    "track-rail-pad",
    "track-sleeper",
    "reaction-rail",
    "positive-rail",
    "negative-rail"
  ],
  "atp": [
    "ato",
    "braking-curve",
    "movement-authority",
    "brake-control"
  ],
  "ato": [
    "atp",
    "ats",
    "train-control",
    "etcs-onboard"
  ],
  "ats": [
    "ato",
    "interlocking",
    "zone-controller",
    "train-network"
  ],
  "train-control": [
    "atp",
    "ato",
    "odometry",
    "tcms",
    "train-radio",
    "brake-control"
  ],
  "train-radio": [
    "radio-antenna",
    "wayside-radio",
    "cbtc",
    "gsm-r-frmcs",
    "passenger-info"
  ],
  "zone-controller": [
    "cbtc",
    "train-control",
    "interlocking",
    "movement-authority",
    "wayside-radio"
  ],
  "balise": [
    "leu",
    "etcs-level-1",
    "etcs-level-2",
    "odometry"
  ],
  "track-ballasted": [
    "track-ballast",
    "track-subballast",
    "track-formation",
    "track-sleeper",
    "track-slab",
    "track-embedded"
  ],
  "track-ballast": [
    "track-ballasted",
    "track-sleeper",
    "track-subballast",
    "track-formation"
  ],
  "track-subballast": [
    "track-ballast",
    "track-formation",
    "track-ballasted"
  ],
  "track-formation": [
    "track-subballast",
    "track-ballasted",
    "track-slab"
  ],
  "track-sleeper": [
    "running-rail",
    "track-rail-pad",
    "track-rail-clip",
    "track-ballast",
    "track-slab"
  ],
  "track-rail-pad": [
    "running-rail",
    "track-sleeper",
    "track-baseplate",
    "track-direct-fixation"
  ],
  "track-rail-clip": [
    "track-rail-pad",
    "track-insulator",
    "track-baseplate",
    "track-sleeper"
  ],
  "track-insulator": [
    "track-rail-clip",
    "track-baseplate",
    "track-direct-fixation",
    "running-rail"
  ],
  "track-baseplate": [
    "track-rail-pad",
    "track-rail-clip",
    "track-insulator",
    "track-direct-fixation",
    "track-plinth"
  ],
  "track-direct-fixation": [
    "track-baseplate",
    "track-rail-pad",
    "track-insulator",
    "track-slab",
    "track-plinth"
  ],
  "track-slab": [
    "track-direct-fixation",
    "track-plinth",
    "track-sleeper",
    "track-formation",
    "track-ballasted"
  ],
  "track-plinth": [
    "track-direct-fixation",
    "track-baseplate",
    "track-slab"
  ],
  "track-embedded": [
    "running-rail",
    "track-ballasted",
    "track-slab",
    "track-insulator"
  ],
  "track-turnout": [
    "track-stock-rail",
    "track-switch-rail",
    "track-closure-rail",
    "track-frog",
    "track-check-rail",
    "track-point-machine"
  ],
  "track-stock-rail": [
    "track-switch-rail",
    "track-turnout",
    "running-rail"
  ],
  "track-switch-rail": [
    "track-stock-rail",
    "track-stretcher",
    "track-point-machine",
    "track-point-detection",
    "track-closure-rail"
  ],
  "track-closure-rail": [
    "track-turnout",
    "track-switch-rail",
    "track-frog",
    "running-rail"
  ],
  "track-frog": [
    "track-check-rail",
    "track-closure-rail",
    "track-turnout",
    "track-diamond-crossing",
    "bogie"
  ],
  "track-check-rail": [
    "track-frog",
    "bogie",
    "running-rail",
    "track-turnout"
  ],
  "track-stretcher": [
    "track-switch-rail",
    "track-point-machine",
    "track-point-detection",
    "track-sleeper"
  ],
  "track-point-machine": [
    "track-switch-rail",
    "track-stretcher",
    "track-point-detection",
    "train-control"
  ],
  "track-point-detection": [
    "track-point-machine",
    "track-switch-rail",
    "track-stretcher",
    "train-control",
    "atp"
  ],
  "track-crossover": [
    "track-turnout",
    "track-diamond-crossing",
    "track-point-detection"
  ],
  "track-diamond-crossing": [
    "track-frog",
    "track-check-rail",
    "track-crossover",
    "running-rail"
  ],
  "cbtc": [
    "train-control",
    "zone-controller",
    "moving-block",
    "fixed-block",
    "seltrac",
    "train-radio"
  ],
  "movement-authority": [
    "atp",
    "interlocking",
    "rbc",
    "zone-controller",
    "braking-curve"
  ],
  "interlocking": [
    "point-machine",
    "train-detection",
    "lineside-signal",
    "movement-authority",
    "rbc"
  ],
  "point-machine": [
    "interlocking",
    "train-detection",
    "lineside-signal"
  ],
  "train-detection": [
    "track-circuit",
    "axle-counter",
    "fixed-block",
    "interlocking",
    "train-integrity"
  ],
  "track-circuit": [
    "train-detection",
    "axle-counter",
    "running-rail",
    "interlocking"
  ],
  "axle-counter": [
    "train-detection",
    "track-circuit",
    "tachometer",
    "train-integrity"
  ],
  "lineside-signal": [
    "interlocking",
    "fixed-block",
    "etcs-onboard",
    "atp"
  ],
  "fixed-block": [
    "train-detection",
    "track-circuit",
    "axle-counter",
    "lineside-signal",
    "moving-block"
  ],
  "moving-block": [
    "fixed-block",
    "movement-authority",
    "odometry",
    "train-integrity",
    "braking-curve"
  ],
  "odometry": [
    "tachometer",
    "accelerometer",
    "balise",
    "train-control",
    "train-integrity"
  ],
  "braking-curve": [
    "atp",
    "movement-authority",
    "brake-control",
    "moving-block"
  ],
  "train-integrity": [
    "train-detection",
    "moving-block",
    "odometry",
    "etcs-level-2"
  ],
  "etcs-level-1": [
    "balise",
    "leu",
    "etcs-onboard",
    "lineside-signal",
    "interlocking"
  ],
  "etcs-level-2": [
    "rbc",
    "etcs-onboard",
    "balise",
    "gsm-r-frmcs",
    "train-integrity",
    "train-detection"
  ],
  "rbc": [
    "etcs-level-2",
    "interlocking",
    "movement-authority",
    "etcs-onboard",
    "train-radio"
  ],
  "etcs-onboard": [
    "rbc",
    "balise",
    "odometry",
    "atp",
    "brake-control"
  ],
  "leu": [
    "balise",
    "interlocking",
    "etcs-level-1"
  ],
  "gsm-r-frmcs": [
    "train-radio",
    "rbc",
    "etcs-level-2",
    "train-network"
  ],
  "seltrac": [
    "cbtc",
    "seltrac-loop",
    "seltrac-g9",
    "train-radio"
  ],
  "seltrac-loop": [
    "seltrac",
    "train-radio",
    "train-control",
    "zone-controller",
    "reaction-rail"
  ],
  "seltrac-g9": [
    "seltrac",
    "cbtc",
    "zone-controller",
    "ats",
    "interlocking"
  ],
  "station-pa": [
    "station-pis",
    "fire-notification",
    "emergency-intercom",
    "telecom-rack"
  ],
  "station-pis": [
    "station-pa",
    "network-switch",
    "station-scada"
  ],
  "station-radio": [
    "fiber-backbone",
    "telecom-rack",
    "occ-workstation"
  ],
  "station-cctv": [
    "access-controller",
    "network-switch",
    "occ-workstation"
  ],
  "access-controller": [
    "station-cctv",
    "flss",
    "station-scada"
  ],
  "flss": [
    "fire-panel",
    "fire-notification",
    "sprinkler-system",
    "emergency-lighting",
    "smoke-control",
    "station-egress"
  ],
  "fire-panel": [
    "fire-detector",
    "fire-notification",
    "flss",
    "station-scada"
  ],
  "fire-detector": [
    "fire-panel",
    "sprinkler-system",
    "bas-sensor"
  ],
  "fire-notification": [
    "station-pa",
    "fire-panel",
    "emergency-lighting"
  ],
  "sprinkler-system": [
    "fire-pump",
    "fire-detector",
    "flss"
  ],
  "fire-pump": [
    "sprinkler-system",
    "fire-panel",
    "auxiliary-switchboard"
  ],
  "emergency-lighting": [
    "station-ups",
    "station-egress",
    "flss"
  ],
  "emergency-intercom": [
    "station-pa",
    "station-radio",
    "occ-workstation",
    "station-egress"
  ],
  "station-egress": [
    "flss",
    "emergency-lighting",
    "emergency-intercom",
    "station-pis"
  ],
  "tunnel-fan": [
    "tunnel-shaft",
    "tunnel-damper",
    "smoke-control",
    "auxiliary-switchboard"
  ],
  "tunnel-shaft": [
    "tunnel-fan",
    "tunnel-damper",
    "station-hvac"
  ],
  "tunnel-damper": [
    "tunnel-fan",
    "smoke-control",
    "bas-actuator"
  ],
  "smoke-control": [
    "flss",
    "tunnel-fan",
    "tunnel-damper",
    "station-egress"
  ],
  "station-hvac": [
    "hvac-air-handler",
    "bas-controller",
    "tunnel-shaft"
  ],
  "hvac-air-handler": [
    "station-hvac",
    "bas-sensor",
    "bas-actuator"
  ],
  "bas-controller": [
    "bas-sensor",
    "bas-actuator",
    "plant-network",
    "station-scada"
  ],
  "bas-sensor": [
    "bas-controller",
    "hvac-air-handler",
    "fire-detector"
  ],
  "bas-actuator": [
    "bas-controller",
    "bas-sensor",
    "tunnel-damper"
  ],
  "plant-network": [
    "bas-controller",
    "network-switch",
    "station-scada"
  ],
  "power-scada": [
    "station-scada",
    "occ-workstation",
    "fiber-backbone"
  ],
  "station-scada": [
    "power-scada",
    "bas-controller",
    "fire-panel",
    "telecom-rack",
    "occ-workstation"
  ],
  "occ-workstation": [
    "station-scada",
    "power-scada",
    "station-radio",
    "emergency-intercom"
  ],
  "station-transformer": [
    "auxiliary-switchboard",
    "station-ups",
    "power-scada"
  ],
  "auxiliary-switchboard": [
    "station-transformer",
    "station-ups",
    "hvac-air-handler",
    "fire-pump"
  ],
  "station-ups": [
    "auxiliary-switchboard",
    "telecom-rack",
    "bas-controller",
    "emergency-lighting"
  ],
  "telecom-rack": [
    "network-switch",
    "fiber-backbone",
    "station-ups",
    "station-pa"
  ],
  "fiber-backbone": [
    "network-switch",
    "station-radio",
    "station-scada"
  ],
  "network-switch": [
    "telecom-rack",
    "fiber-backbone",
    "station-cctv",
    "station-pis",
    "plant-network"
  ]
};

Object.assign(NEW_VIEWS,EXTRA_VIEWS);
SYSTEMS.push(...EXTRA_DOMAINS);
const stationDomain=SYSTEMS.find(x=>x.id==='station');
stationDomain.views.splice(1,0,'platform-interface');
stationDomain.parts.push(...EXTRA_CONCEPTS.filter(x=>x.id.startsWith('platform-')).map(x=>x.id));
SYSTEMS.find(x=>x.id==='vehicle').parts.push('rotary-traction-motor','traction-gearbox');
SYSTEMS.find(x=>x.id==='control').parts.push('loop-pickup','loop-interface');
for(const [id,[view,variant]] of Object.entries(EXTRA_PRIMARY)) {
 PART_VIEWS[id]=view; PART_VARIANTS[id]=variant;
 PART_CONTEXTS[id]=[view]; PART_VIEW_VARIANTS[id]={[view]:[variant]};
}
for(const item of EXTRA_CONCEPTS)PART_RELATIONS[item.id]=item.related||[];
SYSTEMS.find(x=>x.id==='communications').component='train-network';
SYSTEMS.find(x=>x.id==='control').view='seltrac';
SYSTEMS.find(x=>x.id==='control').component='seltrac-loop';
PART_VIEWS.tcms='control';
PART_VARIANTS.tcms='default';
PART_CONTEXTS.tcms=['control','communications','services','vehicle'];
PART_VIEW_VARIANTS.tcms={control:['default'],communications:['default'],services:['default'],vehicle:['default']};
NEW_VIEWS.seltrac.variants[0].title='Inductive loops carry train-control messages';
NEW_VIEWS.seltrac.variants[0].description='This loop-based SelTrac example exchanges control messages through the track cable and under-car equipment. The cable is separate from traction conductors and the LIM reaction rail. Loop communication can accompany LIM or rotary traction; the boxes do not specify a universal cabinet allocation.';
NEW_VIEWS.seltrac.variants[0].sources=['S02','S03','X01'];

SYSTEMS.find(x=>x.id==='vehicle').label='Vehicles & propulsion';
SYSTEMS.find(x=>x.id==='vehicle').description='Drive, brake and support the train';
