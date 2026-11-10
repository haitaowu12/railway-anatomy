import {pointIndicationDiagram} from './point-machine.js';
import {CONTROL_INTERFACE_CONCEPTS} from './control-interfaces-data.js';
import {applyDepotConfig} from './depot-data.js';
import {applyOccConfig} from './occ-data.js';
import {applyStudyConfig} from './studies-data.js';
import {applyElectrificationConfig} from './electrification-data.js';
import {applyStationPlatformConfig} from './station-platform-data.js';
import {applyCommsConfig} from './communications-data.js';
import {NETWORK_VIEWS,NETWORK_CONCEPTS,NETWORK_PRIMARY,NETWORK_DOMAIN} from './network-data.js';
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
    "note": "Follow the load from the wheels through rails, supports and the ground. Compare ballasted, slab and embedded track.",
    "variants": [
      {
        "id": "ballasted",
        "label": "Ballasted",
        "title": "A distributed load path",
        "description": "Rails spread wheel loads along the track. Sleepers transfer them into the ballast and formation below. Ballast also holds the sleepers in position and lets water drain.",
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
        "description": "A concrete slab or plinth supports the rail instead of ballast. Resilient pads in the fastening system cushion the rail and control how loads enter that support.",
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
        "description": "In this example, resilient material supports the rail continuously within the surrounding structure. Other embedded systems use discrete supports; compare where each arrangement carries the load.",
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
    "note": "Open the rail seat to find the parts that hold the rail, cushion its load and provide electrical insulation.",
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
    "note": "Find the moving switch blades, fixed stock rails, connecting rails and crossing. The colours trace routes through the track.",
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
        "description": "The alternative blade position leads the wheelset onto the branch. Follow both rails through the connecting section and crossing to see how the wheels remain guided.",
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
    "label": "Point machine",
    "searchTerms": [
      "point drive",
      "switch machine",
      "turnout motor",
      "switch mechanism"
    ],
    "title": "How a point machine moves a turnout",
    "component": "track-point-machine",
    "level": "Assembly",
    "note": "Four-rod arrangement: two operating rods and two detector rods. The internal actuator, locks and contacts are shown functionally.",
    "variants": [
      {
        "id": "proved",
        "label": "Complete throw",
        "title": "Move, lock and indicate B",
        "description": "Each blade has its own operating and detector rod. At B, the near blade is closed, the far blade is open and both locks engage. The B indication requires all of these conditions.",
        "nodes": [
          "Drive command",
          "Physical movement",
          "Position indication"
        ],
        "sources": [
          "PM01",
          "PM02",
          "PM03",
          "PM04"
        ],
        "component": "track-point-machine"
      },
      {
        "id": "unproved",
        "label": "Stopped short",
        "title": "Travel stops before setting B",
        "description": "The blades stop between the ends. Both locks stay released; neither A nor B is indicated.",
        "nodes": [
          "Command present",
          "Proof incomplete",
          "End-B indication missing"
        ],
        "sources": [
          "PM01",
          "PM03"
        ],
        "component": "track-point-detection"
      },
      {
        "id": "detector-missing",
        "label": "One detector missing",
        "title": "Locked at B, indication unavailable",
        "description": "Both blades reach B and both locks engage, but the far-blade detector input is unavailable. Neither end is indicated.",
        "nodes": [
          "Blades in setting B",
          "Locks engaged",
          "Detector input missing",
          "No B indication"
        ],
        "sources": [
          "PM01",
          "PM03"
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
    "note": "Follow a wheelset across a fixed crossing. The wing and check rails help guide it past the gap in the running surface.",
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
        "title": "Where two tracks cross",
        "description": "A diamond crossing lets two tracks intersect. Its running rails and crossing gaps provide intersecting paths; a turnout adds movable switches to choose between routes.",
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
    "note": "Follow a radio-based communications-based train control (CBTC) system. The boxes group functions; suppliers may combine them in different equipment.",
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
    "note": "Explore a conventional railway divided into fixed detection sections. Signal colours show the example’s states rather than a country’s aspect code.",
    "variants": [
      {
        "id": "clear",
        "label": "Clear section",
        "title": "A section indication is one input",
        "description": "Track detection reports whether a section is occupied. The interlocking combines that information with point position, locking and other route conditions before allowing the relevant signal indication.",
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
        "description": "The occupied section changes which route can be protected. The highlighted detection section represents the reported state; its boundary can extend beyond the visible train.",
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
    "note": "Compare European Train Control System (ETCS) Levels 1 and 2. A level describes how track and train exchange information; it does not set the degree of automation.",
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
        "description": "The Radio Block Centre (RBC) uses signalling information to send movement authorities to the train by radio. Balises provide position references. Current Level 2 includes arrangements with different trackside detection and train-integrity provisions, including those formerly called Level 3.",
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
    "note": "Compare the older inductive-loop arrangement with radio communication and the newer G9 computing architecture.",
    "variants": [
      {
        "id": "loop",
        "label": "Legacy loop",
        "title": "An inductive communication example",
        "description": "An inductive loop carries information between the train and wayside equipment. Follow the loop pickup to the train-control functions that use those messages.",
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
        "title": "Radio carries the control messages",
        "description": "Radio carries information between the train and wayside equipment in this SelTrac arrangement. Location estimation, train protection and automatic driving remain separate functions that use the information.",
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
        "description": "Hitachi’s 2026 description of SelTrac G9 places virtualized signalling safety functions in a private-cloud environment. Compare the logical functions with the computing equipment that hosts them.",
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
    "note": "An interlocking checks route conditions and prevents conflicting permissions. Compare the point movement, returned indication and route logic.",
    "variants": [
      {
        "id": "proved",
        "label": "Conditions proved",
        "title": "Command, feedback and permission are different",
        "description": "The point machine moves the blades, locks them and returns an indication. The interlocking combines that indication with the other route conditions before permitting the route.",
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
        "title": "A command still needs a returned indication",
        "description": "The movement command has been issued, but the required position and locking indication is incomplete. The route therefore remains unproved in this example.",
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
      },
      {
        "id": "detector-missing",
        "label": "One detector missing",
        "title": "Locked at B, indication unavailable",
        "description": "Both blades reach B and both locks engage, but the far-blade detector input is unavailable. Neither end is indicated.",
        "nodes": [
          "Blades in setting B",
          "Locks engaged",
          "Detector input missing",
          "No B indication"
        ],
        "sources": [
          "PM01",
          "PM03"
        ],
        "component": "interlocking"
      }
    ]
  },
  "train-detection": {
    "label": "Detection",
    "title": "Three devices, three information roles",
    "component": "train-detection",
    "level": "Component",
    "note": "Compare detection of a train within a section with a position reference received as the train passes a known point.",
    "variants": [
      {
        "id": "track-circuit",
        "label": "Track circuit",
        "title": "An electrical section detects occupancy",
        "description": "A feed and receiver use the running rails as an electrical detection circuit. A wheelset bridges the rails and changes what the receiver detects. The same running rails may also carry traction return current; detection and power return have different functions and must be electrically compatible.",
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
        "description": "Wheel sensors count axles entering and leaving a section. Evaluation equipment uses those counts and system status to report occupation. Matching axle counts and a healthy system support a clear section indication. If axles enter and remain inside the section, the counts differ. A clear indication applies to the section, while train integrity concerns whether the train remains complete.",
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
        "description": "A track-mounted balise sends a telegram to an onboard reader as the train passes. Its known location can provide a position reference. Track circuits and axle counters instead report section occupation.",
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
    "note": "Explore a station cutaway, from the concourse and platform to equipment rooms and tunnel connections.",
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
        "description": "Displays give journey information, loudspeakers carry announcements, help points connect passengers to assistance, and cameras support observation. Each device depends on its own power, communication and control connections.",
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
        "description": "Look behind the platform devices to find their power supplies, network links and control equipment. Select a device to follow those connections into the equipment spaces.",
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
    "note": "Inspect electrical supply, air handling and fire-water equipment in separate cutaway views.",
    "variants": [
      {
        "id": "electrical",
        "label": "Electrical",
        "title": "Convert, distribute and support selected loads",
        "description": "Switchboards distribute power to station loads. An uninterruptible power supply (UPS) keeps selected equipment supplied during a supply interruption, for the duration supported by its stored energy.",
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
        "description": "The pump and pipework deliver water at the flow and pressure needed by the protection system. Local controls operate the pump; supervisory equipment reports its condition and any alarms.",
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
    "note": "Follow fans, shafts and dampers through a tunnel ventilation system. The moving markers show air paths qualitatively.",
    "variants": [
      {
        "id": "normal",
        "label": "Normal objective",
        "title": "Exchange air and manage the environment",
        "description": "Fans move air through the tunnel and shafts, while dampers open or restrict paths. Delivered airflow depends on the fans and resistance of the complete route.",
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
        "description": "Smoke management uses planned airflow to support the fire strategy. Fan direction, damper positions and operating sequences depend on the tunnel, fire location and protected routes; this view locates the equipment involved.",
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
    "note": "Open a fan, damper or air-handling unit to connect moving parts with the air path.",
    "variants": [
      {
        "id": "fan",
        "label": "Axial fan",
        "title": "A rotating impeller adds energy to the air",
        "description": "The motor turns a shaft and impeller, adding energy to the air. The fan characteristic and resistance of the connected ductwork determine the resulting airflow.",
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
    "note": "Follow measurements and commands between local equipment and supervisory systems. The coloured lines show logical connections.",
    "variants": [
      {
        "id": "power",
        "label": "Power SCADA",
        "title": "Electrical equipment has its own local interfaces",
        "description": "Power supervisory control and data acquisition (SCADA) brings electrical measurements, equipment status and permitted controls to operators. Local protection still detects faults and trips the relevant equipment.",
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
        "description": "Station supervision brings selected status, alarms and controls from several systems into one view. Each connected subsystem retains its defined responsibilities and permissions.",
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
        "description": "A building automation system (BAS) reads sensors, compares conditions with targets and commands plant actuators. A supervisory display lets operators monitor and adjust those local control loops.",
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
    "note": "Explore detection, notification, escape-route support and water supply as related parts of fire and life safety.",
    "variants": [
      {
        "id": "detect",
        "label": "Detect and indicate",
        "title": "Separate a detector from the panel that supervises it",
        "description": "Detectors send conditions over monitored circuits to a fire-alarm panel. The panel identifies and presents alarm and fault states, then communicates with other systems through the designed interfaces.",
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
        "description": "Alarms and announcements inform people; emergency lighting and usable escape routes help them leave. A station’s fire strategy coordinates these functions for the building and its occupants.",
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
        "title": "Heat opens a conventional sprinkler",
        "description": "Heat opens the thermal element in an individual conventional sprinkler. The water supply and pump arrangement support the required flow and pressure. Detection and alarm equipment monitor and coordinate related functions.",
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
    "interlocking"
  ],
  "track-point-detection": [
    "track-point-machine",
    "track-switch-rail",
    "track-stretcher",
    "interlocking",
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
NEW_VIEWS.seltrac.variants[0].description='This loop-based SelTrac example exchanges control messages through the track cable and under-car pickup. The cable carries information, while separate conductors carry traction power. Either a LIM or rotary motor can propel the train.';
NEW_VIEWS.seltrac.variants[0].sources=['S02','S03','X01'];

SYSTEMS.find(x=>x.id==='vehicle').label='Vehicles & propulsion';
SYSTEMS.find(x=>x.id==='vehicle').description='Drive, brake and support the train';


Object.assign(NEW_VIEWS,NETWORK_VIEWS);
SYSTEMS.unshift(NETWORK_DOMAIN);
for(const [id,[view,variant]] of Object.entries(NETWORK_PRIMARY)) {
 PART_VIEWS[id]=view;PART_VARIANTS[id]=variant;PART_CONTEXTS[id]=[view];
 PART_VIEW_VARIANTS[id]={[view]:NETWORK_VIEWS[view].variants.map(x=>x.id)};
}
for(const item of NETWORK_CONCEPTS)PART_RELATIONS[item.id]=item.related||[];

applyDepotConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS});
applyOccConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS});
applyStudyConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS});
applyCommsConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS});

applyElectrificationConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS});
applyStationPlatformConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS});

// Functional interfaces are discovered alongside the relevant systems; their
// explanations open in the separate responsibility explorer.
for(const item of CONTROL_INTERFACE_CONCEPTS){
 PART_VIEWS[item.id]='station-networks'; PART_VARIANTS[item.id]='station';
 PART_CONTEXTS[item.id]=['station-networks'];PART_VIEW_VARIANTS[item.id]={'station-networks':['station']};
 PART_RELATIONS[item.id]=item.related||[];
 const domain=SYSTEMS.find(d=>d.id==='communications');if(!domain.parts.includes(item.id))domain.parts.push(item.id);
}
NEW_VIEWS['station-networks'].label='Plant control interfaces';
NEW_VIEWS['station-networks'].title='Separate local control from supervisory interfaces';
NEW_VIEWS['station-networks'].note='Open the interface explorer to compare power SCADA, station building automation and tunnel-ventilation responsibilities. Connections and command rights are explicit choices.';

NEW_VIEWS['infrastructure-assets']={label:'Structures & drainage',title:'Follow structural support and the drainage opening',component:'route-formation',domain:'track',parent:'track-support',motion:false,note:'Follow the load through the bridge deck, girders, bearings and abutments. Then inspect the culvert that carries water beneath the railway.',variants:[{id:'assets',label:'Physical section',title:'Structures and drainage',description:'Inspect the support and passage interfaces, then open the separate maintenance process for observations and decisions.',component:'route-formation',nodes:['Rail and sleeper','Formation / bridge deck','Bearings and abutments','Culvert and outfall'],sources:['I01','I02','I03']}]};
const trackDomain=SYSTEMS.find(d=>d.id==='track');trackDomain.views.splice(trackDomain.views.indexOf('infrastructure-care'),0,'infrastructure-assets');
for(const id of ['route-formation','route-drainage','route-bridge']){PART_VIEWS[id]='infrastructure-assets';PART_VARIANTS[id]='assets';PART_CONTEXTS[id]=['infrastructure-assets'];PART_VIEW_VARIANTS[id]={'infrastructure-assets':['assets']};}

PART_VIEWS['track-stretcher']='turnout';PART_VARIANTS['track-stretcher']='straight';
PART_CONTEXTS['track-stretcher']=PART_CONTEXTS['track-stretcher'].filter(view=>view!=='switch-drive');
delete PART_VIEW_VARIANTS['track-stretcher']['switch-drive'];
for(const contexts of Object.values(PART_VIEW_VARIANTS))for(const view of ['switch-drive','interlocking']){
 const variants=contexts[view];if(variants?.includes('proved')&&variants.includes('unproved'))variants.push('detector-missing');
}
Object.assign(NEW_VIEWS.interlocking.variants.find(v=>v.id==='detector-missing'),{defaultPresentation:'connections',topology:pointIndicationDiagram('detector-missing')});

SYSTEMS.find(d=>d.id==='track').parts.push('track-wheelset');
PART_VIEWS['track-wheelset']='turnout';PART_VARIANTS['track-wheelset']='straight';
PART_CONTEXTS['track-wheelset']=['track-support','turnout','crossing'];
PART_VIEW_VARIANTS['track-wheelset']={'track-support':['ballasted','slab','embedded'],turnout:['straight','diverging','crossover'],crossing:['frog','diamond']};
PART_RELATIONS['track-wheelset']=['track-turnout','track-frog','track-check-rail','bogie'];

PART_VIEWS['track-stretcher']='turnout';PART_VARIANTS['track-stretcher']='crossover';PART_VIEW_VARIANTS['track-stretcher']={turnout:['crossover']};

for(const id of ['track-crossing-nose','track-wing-rail']){
 SYSTEMS.find(d=>d.id==='track').parts.push(id);PART_VIEWS[id]='crossing';PART_VARIANTS[id]='frog';
 PART_CONTEXTS[id]=['turnout','crossing'];PART_VIEW_VARIANTS[id]={turnout:['straight','diverging','crossover'],crossing:['frog']};
 PART_RELATIONS[id]=['track-frog','track-wheelset','track-check-rail'];
}

PART_RELATIONS['scada-rtu']=[...new Set([...PART_RELATIONS['scada-rtu'],'local-plant-controller','interface-contract'])];

const diamondLayout=NEW_VIEWS.crossing.variants.find(v=>v.id==='diamond');
Object.assign(diamondLayout,{title:'Two through tracks, four crossing regions',description:'A diamond has two common crossings and two obtuse crossings. The coloured regions locate them in this layout; they do not reproduce local wheel-contact geometry.',motion:false});
delete diamondLayout.animation;

Object.assign(SYSTEMS.find(d=>d.id==='control'),{view:'control',component:'atp'});

diamondLayout.sources=['TW04','K19'];
NEW_VIEWS.turnout.variants.find(v=>v.id==='crossover').sources=['K18'];
