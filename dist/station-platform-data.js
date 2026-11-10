import { normalizePlatformState } from './platform-config.js';

export const STATION_PLATFORM_SOURCES = [
  {
    "id": "SP01",
    "title": "Elevator and escalator glossary",
    "publisher": "KONE",
    "url": "https://www.kone.com.au/tools-downloads/glossary/",
    "description": "Defines the lift car, landing, car and landing doors, and traction-drive equipment.",
    "scope": "Lift terminology and component roles. The station model shows one two-level traction-lift arrangement."
  }
];

export const STATION_PLATFORM_CONCEPTS = [
  {
    "id": "station-lift",
    "label": "Station passenger lift",
    "summary": "A passenger lift connects the platform and concourse through a shaft.",
    "details": [
      "The car is the moving passenger cabin. A landing is the floor-level place where passengers enter or leave; its doors stay fixed to the building.",
      "Start at platform level and move the phase control. The doors close, the car travels through the shaft, and the doors beside the upper landing open."
    ],
    "related": [
      "station-lift-car",
      "station-lift-landing-doors",
      "station-lift-drive",
      "station-egress"
    ],
    "sources": [
      "SP01"
    ],
    "domain": "station",
    "primary": [
      "station",
      "passenger"
    ]
  },
  {
    "id": "station-lift-car",
    "label": "Lift cabin and car doors",
    "summary": "The cabin, its floor and its own doors travel together.",
    "details": [
      "The lift car carries passengers between levels. Its doors move with it, while a separate set of landing doors stays at each floor.",
      "Follow the cabin floor against the lower and upper landing sills. In the sequence, the car stops level with the landing before its doors open."
    ],
    "related": [
      "station-lift",
      "station-lift-landing-doors"
    ],
    "sources": [
      "SP01"
    ],
    "domain": "station",
    "primary": [
      "station",
      "passenger"
    ]
  },
  {
    "id": "station-lift-landing-doors",
    "label": "Lift landing doors and contacts",
    "summary": "Landing doors separate each floor from the lift shaft.",
    "details": [
      "These door assemblies stay in the building while the car moves. Their locks and position contacts are separate from the doors on the car.",
      "Only the landing doors beside the stopped cabin open in this sequence. During travel, both landing openings remain closed. Inspect the contact targets alongside the doors."
    ],
    "related": [
      "station-lift",
      "station-lift-car",
      "station-lift-drive"
    ],
    "sources": [
      "SP01"
    ],
    "domain": "station",
    "primary": [
      "station",
      "passenger"
    ]
  },
  {
    "id": "station-lift-drive",
    "label": "Lift traction machine and suspension",
    "summary": "A traction machine moves the cabin and counterweight through their suspension.",
    "details": [
      "The traction sheave is the grooved wheel driven by the lift machine. Friction between the sheave and suspension ropes or belts transmits the driving force.",
      "Watch the sheave turn as the cabin moves. The counterweight travels in the opposite direction; compare the moving suspension with the fixed machine mounting."
    ],
    "related": [
      "station-lift",
      "station-lift-car",
      "auxiliary-switchboard"
    ],
    "sources": [
      "SP01"
    ],
    "domain": "station",
    "primary": [
      "station",
      "passenger"
    ]
  }
];

export const STATION_PLATFORM_CONCEPT_UPDATES = [
  {
    "id": "platform-screen-door",
    "summary": "Platform doors form a barrier between the waiting area and the trainway.",
    "details": [
      "Compare an open edge with half-height and full-height barriers. Door openings align with the train’s boarding doors. Sensing and end access are separate choices that can be studied with the selected edge.",
      "The full-height example places the drive above the opening. The half-height example uses side-post drives. Open their covers to follow how each mechanism moves the leaves."
    ],
    "sources": [
      "N03",
      "N09"
    ],
    "related": [
      "platform-door-drive",
      "platform-door-proof",
      "platform-gap-detector",
      "platform-intrusion",
      "doors"
    ]
  },
  {
    "id": "platform-door-drive",
    "summary": "A door drive turns an opening or closing request into movement.",
    "details": [
      "A local controller operates the drive and returns status information. The drive, moving leaves and feedback contacts have separate jobs.",
      "In the full-height example, pulleys move a belt connected to the paired leaves. In the half-height example, pinions drive racks from the side posts. Separate the covers, transmission and controller to follow the motion."
    ],
    "sources": [
      "N04",
      "N05"
    ],
    "caveat": ""
  },
  {
    "id": "platform-door-proof",
    "summary": "A closed door, an engaged lock and a returned indication describe different states.",
    "details": [
      "The closed contact reports leaf position. The lock holds the door against opening, and a separate signal reports the locking condition.",
      "Pause after closing: the target has reached the closed contact while the bolt is still withdrawn. Continue to see the bolt engage and the locking indication update. This sequence separates the physical condition from the information returned about it."
    ],
    "sources": [
      "N05"
    ],
    "caveat": ""
  },
  {
    "id": "platform-response",
    "summary": "A local processor turns sensor evidence into a report at the railway interface.",
    "details": [
      "LiDAR uses laser light to measure distance; radar uses radio waves. Select one trainway sensing example and follow its connection to the local processor.",
      "The processor sits in the rear service area. In the sequence, sensing is followed by a report and an associated camera view. Reporting the object provides information; the object remains in the monitored area."
    ],
    "sources": [
      "N01",
      "N02"
    ],
    "caveat": ""
  },
  {
    "id": "platform-alarm-video",
    "label": "Associated platform camera and video",
    "summary": "The camera gives the operator another view of the reported location.",
    "details": [
      "The cited Siemens track-intrusion example links the alarm to live and recorded video from the relevant location. That helps the operator examine the event in context.",
      "The camera is mounted behind the passenger area. Its event marker identifies the video connection; the operator workstation is shown in the control-centre study."
    ],
    "sources": [
      "N02"
    ],
    "related": [
      "platform-intrusion",
      "platform-response",
      "station-cctv",
      "occ-cctv-assessment",
      "cctv-recording"
    ]
  },
  {
    "id": "platform-gap-detector",
    "summary": "Interspace sensing monitors the gap between the train body and the platform barrier.",
    "details": [
      "A person or object can occupy the space between those two boundaries. This is a different sensing area from the trainway or the closing edge of a door.",
      "The lesson requires a fitted barrier. Locate the object inside the marked space, then follow the sensing evidence to its report. The object remains in place after reporting."
    ],
    "sources": [
      "N04",
      "N06"
    ],
    "caveat": ""
  },
  {
    "id": "platform-end-gate",
    "summary": "An end gate controls a separate opening at the end of the platform area.",
    "details": [
      "The gate has its own leaf, hinge, latch and position contact. Its condition is monitored separately from the boarding doors.",
      "The latch releases while the gate is still closed. The leaf then turns, separating its target from the frame contact, and the report follows. Changing the boarding-edge arrangement keeps this end-access interface."
    ],
    "sources": [
      "N05",
      "N07"
    ],
    "caveat": ""
  },
  {
    "id": "station-egress",
    "details": [
      "Passenger circulation connects the platform, concourse, stairs, lift landings, information and assistance. Equipment rooms and service access support the station alongside those public areas.",
      "Follow the boarding strips and the stairs and lift between levels. These are the normal circulation connections shown in the model; emergency egress depends on the station’s designated evacuation routes and arrangements."
    ],
    "related": [
      "station-lift",
      "emergency-lighting",
      "emergency-intercom",
      "station-pis",
      "flss"
    ]
  }
];

export const PLATFORM_ANIMATIONS = {
  "sensing": {
    "label": "Object, evidence and reported location",
    "steps": [
      {
        "at": 0,
        "label": "Defined zone",
        "description": "The marked area identifies the part of the trainway being observed. The object starts outside it."
      },
      {
        "at": 0.25,
        "label": "Object in the zone",
        "description": "The object enters the marked trainway area before the sensing and report cues change."
      },
      {
        "at": 0.4,
        "label": "Sensor evidence",
        "description": "The chosen LiDAR or paired-radar sensing path highlights the object’s location."
      },
      {
        "at": 0.66,
        "label": "Local report",
        "description": "The processor’s report marker and its connection change after the sensing cue."
      },
      {
        "at": 0.85,
        "label": "Associated video",
        "description": "The camera marker identifies a related view for the operator. The object remains in place."
      }
    ]
  },
  "boarding": {
    "label": "Request, movement, closed contact and lock",
    "steps": [
      {
        "at": 0,
        "label": "Closed and locked",
        "description": "The leaves are together, the closed contact is made and the lock indication is present."
      },
      {
        "at": 0.19,
        "label": "Lock released",
        "description": "The opening request is present and the bolt has withdrawn while the leaves are still together."
      },
      {
        "at": 0.34,
        "label": "Leaves moving",
        "description": "The drive moves the platform leaves while the aligned train doors open on the platform side."
      },
      {
        "at": 0.46,
        "label": "Boarding opening",
        "description": "The train and platform openings align; the train doors on the opposite side stay closed."
      },
      {
        "at": 0.78,
        "label": "Closed contact",
        "description": "The leaves have returned and the closed contact is made. The lock is still withdrawn."
      },
      {
        "at": 0.94,
        "label": "Bolt engaged",
        "description": "The bolt reaches its engaged position before the separate locking indication updates."
      },
      {
        "at": 0.98,
        "label": "Locking indication",
        "description": "The returned indication now reports the engaged lock. Door status is one input to the wider train-departure controls."
      }
    ]
  },
  "openBoarding": {
    "label": "Platform-side train-door movement",
    "steps": [
      {
        "at": 0,
        "label": "Parked at the open edge",
        "description": "The train is aligned with an open platform edge, without a platform-door barrier."
      },
      {
        "at": 0.34,
        "label": "Train doors opening",
        "description": "Only the train doors facing the platform move. The opposite side stays closed."
      },
      {
        "at": 0.46,
        "label": "Open boarding doorway",
        "description": "The doorway is open on the platform side. The platform and train threshold align in this schematic."
      },
      {
        "at": 0.64,
        "label": "Train doors closing",
        "description": "The platform-side leaves move back toward the closed position."
      },
      {
        "at": 0.78,
        "label": "Leaves together",
        "description": "The leaves have reached the closed position. The close-up shows door movement; lock status belongs to the train’s separate door-control system."
      }
    ]
  },
  "interspace": {
    "label": "Interspace evidence and report",
    "steps": [
      {
        "at": 0,
        "label": "Object between boundaries",
        "description": "The object lies in the space between the train body and the fitted platform barrier."
      },
      {
        "at": 0.4,
        "label": "Sensing evidence",
        "description": "The interspace sensing path highlights the occupied volume. The boarding doors remain closed."
      },
      {
        "at": 0.66,
        "label": "Interspace report",
        "description": "The separate report marker changes. The object remains in the same physical position."
      },
      {
        "at": 1,
        "label": "Review the reported condition",
        "description": "The report tells the operator which space is occupied so they can assess the next response."
      }
    ]
  },
  "end": {
    "label": "End-gate latch, hinge and position contact",
    "steps": [
      {
        "at": 0,
        "label": "Gate closed",
        "description": "The leaf rests at the latch post; the frame contact and leaf target are adjacent."
      },
      {
        "at": 0.22,
        "label": "Latch withdrawn",
        "description": "The latch has retracted while the leaf remains closed."
      },
      {
        "at": 0.48,
        "label": "Leaf turns",
        "description": "The leaf turns around its hinge and the target separates from the frame contact."
      },
      {
        "at": 0.8,
        "label": "Open state reported",
        "description": "The end-access marker changes after the gate opens. The selected boarding edge remains in place."
      }
    ]
  }
};

export const STATION_LIFT_ANIMATION = {
  "label": "Cabin movement between two landings",
  "steps": [
    {
      "at": 0,
      "label": "At platform level",
      "description": "The cabin floor meets the lower landing; the cabin and lower landing doors are open."
    },
    {
      "at": 0.22,
      "label": "Doors closed",
      "description": "The cabin and lower landing doors close before travel. The upper landing stays closed."
    },
    {
      "at": 0.48,
      "label": "Between levels",
      "description": "The cabin rises through the shaft towards the concourse. Both sets of landing doors and the cabin doors stay closed."
    },
    {
      "at": 0.7,
      "label": "Upper landing reached",
      "description": "The cabin floor meets the upper sill; the doors have not opened yet."
    },
    {
      "at": 0.94,
      "label": "Upper doors open",
      "description": "Only the doors beside the aligned cabin open. The lower landing remains closed."
    }
  ]
};

export function platformAnimationFor(state) {
  const {variant,platformEdge}=normalizePlatformState(state);
  if(variant==='platform-doors')return PLATFORM_ANIMATIONS[platformEdge==='open'?'openBoarding':'boarding'];
  return PLATFORM_ANIMATIONS[variant==='interspace'?'interspace':variant==='platform-end'?'end':'sensing'];
}

export const STATION_PLATFORM_VIEW_DATA = {
  "platform-interface": {
    "label": "Platform & boarding edge",
    "title": "Locate the boundary, then follow the mechanism",
    "component": "platform-intrusion",
    "level": "Interface",
    "note": "Choose the boarding edge, sensing method and lesson separately. Train and platform door openings align in this schematic. The sequence slows events to show movement, sensing and returned status; its timing and sensing volumes are illustrative.",
    "variants": [
      {
        "id": "open-platform",
        "label": "Trainway sensing",
        "title": "Follow an object from sensing to report",
        "description": "Choose LiDAR or paired radar. Follow the object, sensing evidence, local report and related camera view in sequence.",
        "nodes": [
          "Monitored area",
          "Sensor evidence",
          "Local report",
          "Associated video"
        ],
        "sources": [
          "N01",
          "N02"
        ],
        "component": "platform-intrusion",
        "motion": true,
        "animation": PLATFORM_ANIMATIONS.sensing
      },
      {
        "id": "platform-doors",
        "label": "Boarding mechanism",
        "title": "Separate movement from the reported condition",
        "description": "At an open edge, follow the train’s platform-side doors. With a barrier, inspect the drive, closed contact, lock bolt and returned indication alongside the aligned train doorway.",
        "nodes": [
          "Request",
          "Drive and leaves",
          "Closed contact",
          "Lock and indication"
        ],
        "sources": [
          "N03",
          "N04",
          "N05",
          "N09"
        ],
        "component": "doors",
        "motion": true,
        "animation": PLATFORM_ANIMATIONS.boarding
      },
      {
        "id": "interspace",
        "label": "Interspace sensing",
        "title": "Inspect the space between train and barrier",
        "description": "A fitted barrier creates this space beside the train. Locate the object, then follow the sensing evidence and report.",
        "nodes": [
          "Train body",
          "Interspace",
          "Platform barrier",
          "Report"
        ],
        "sources": [
          "N04",
          "N06"
        ],
        "component": "platform-gap-detector",
        "motion": true,
        "animation": PLATFORM_ANIMATIONS.interspace
      },
      {
        "id": "platform-end",
        "label": "End access",
        "title": "Follow the hinge and contact at a different boundary",
        "description": "The latch withdraws, the gate turns, the contact target separates and the report follows. The boarding-edge choice stays selected.",
        "nodes": [
          "Latch",
          "Hinge and leaf",
          "Position contact",
          "Report"
        ],
        "sources": [
          "N05",
          "N07"
        ],
        "component": "platform-end-gate",
        "motion": true,
        "animation": PLATFORM_ANIMATIONS.end
      }
    ]
  },
  "station": {
    "label": "Station overview",
    "title": "Passenger levels and supporting equipment",
    "component": "station-egress",
    "level": "Installation",
    "note": "A station section connects the platform and concourse with stairs and a two-level lift. Passenger devices and an equipment room show the systems that support those spaces. Dimensions and travel timing are schematic.",
    "variants": [
      {
        "id": "all",
        "label": "Whole station",
        "title": "Read the station as connected places",
        "description": "Read the island platform, routes between levels, concourse and equipment room as connected places. The selected boarding edge appears on both sides of the platform.",
        "nodes": [
          "Boarding edge",
          "Routes between levels",
          "Equipment room",
          "Supporting systems"
        ],
        "sources": [
          "F01",
          "F03",
          "F04"
        ],
        "component": "station-egress",
        "motion": false
      },
      {
        "id": "passenger",
        "label": "Passenger circulation",
        "title": "Follow the lift between platform and concourse",
        "description": "Follow a one-way lift trip. The cabin carries its doors with it. Each set of landing doors stays at its floor. Stairs, displays and help points show the surrounding passenger route.",
        "nodes": [
          "Platform landing",
          "Closed doors",
          "Cabin travel",
          "Upper landing"
        ],
        "sources": [
          "SP01",
          "F01",
          "F04"
        ],
        "component": "station-lift",
        "motion": true,
        "animation": STATION_LIFT_ANIMATION
      },
      {
        "id": "equipment",
        "label": "Equipment room",
        "title": "Locate the hardware behind the public devices",
        "description": "The equipment room opens from the concourse. Inspect its network, fire and building-control equipment, then follow the connections to devices in passenger areas.",
        "nodes": [
          "Local equipment",
          "Service access",
          "Physical connections",
          "Passenger endpoints"
        ],
        "sources": [
          "F03",
          "F17",
          "F20"
        ],
        "component": "telecom-rack",
        "motion": false
      }
    ]
  }
};

export function applyStationPlatformCatalog(SOURCES,CONCEPTS){
  for(const item of STATION_PLATFORM_SOURCES){const old=SOURCES.find(x=>x.id===item.id);if(old)Object.assign(old,item);else SOURCES.push(item);}
  for(const item of STATION_PLATFORM_CONCEPTS){const old=CONCEPTS.find(x=>x.id===item.id);if(old)Object.assign(old,item);else CONCEPTS.push(item);}
  for(const item of STATION_PLATFORM_CONCEPT_UPDATES){const old=CONCEPTS.find(x=>x.id===item.id);if(old)Object.assign(old,item);}
}
export function applyStationPlatformConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS}){
  Object.assign(NEW_VIEWS,STATION_PLATFORM_VIEW_DATA);
  const station=SYSTEMS.find(x=>x.id==='station');
  if(station)station.parts=[...new Set([...station.parts,...STATION_PLATFORM_CONCEPTS.map(x=>x.id)])];
  for(const item of STATION_PLATFORM_CONCEPTS){PART_VIEWS[item.id]='station';PART_VARIANTS[item.id]='passenger';}
  const contexts={
    ...Object.fromEntries(STATION_PLATFORM_CONCEPTS.map(x=>[x.id,{station:['all','passenger','equipment']}])),
    'platform-screen-door':{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    'platform-door-drive':{'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    'platform-door-proof':{'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    'platform-intrusion':{'platform-interface':['open-platform','platform-end']},
    carbody:{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    bogie:{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    doors:{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
    'running-rail':{station:['all','passenger','equipment'],'platform-interface':['open-platform','platform-doors','interspace','platform-end']},
  };
  for(const[id,views]of Object.entries(contexts)){
    PART_CONTEXTS[id]=[...(PART_CONTEXTS[id]||[])];PART_VIEW_VARIANTS[id]={...(PART_VIEW_VARIANTS[id]||{})};
    for(const[view,variants]of Object.entries(views)){if(!PART_CONTEXTS[id].includes(view))PART_CONTEXTS[id].push(view);PART_VIEW_VARIANTS[id][view]=variants;}
  }
  for(const item of [...STATION_PLATFORM_CONCEPTS,...STATION_PLATFORM_CONCEPT_UPDATES])if(item.related)PART_RELATIONS[item.id]=item.related;
}


export const STATION_PLATFORM_READING_GUIDES = [
  {
    "id": "station-platform-guide",
    "domain": "station",
    "component": "platform-intrusion",
    "title": "Read a station from boarding edge to equipment room",
    "summary": "Explore the station’s spaces, then follow door movement, sensing and the information returned to control equipment.",
    "sections": [
      {
        "heading": "Choose the physical edge",
        "text": "Compare the open platform with half-height and full-height barriers. A barrier separates the passenger area from the trainway; its doors provide openings for boarding. Trainway sensing is another layer, with LiDAR or paired radar as alternatives in this model. Changing to an end-access lesson keeps the selected boarding edge.",
        "sources": [
          "N01",
          "N02",
          "N03"
        ]
      },
      {
        "heading": "Follow movement before reading status",
        "text": "Play the boarding sequence. The platform-facing train doors move while those on the opposite side remain closed. With a barrier fitted, follow its drive and leaves. Pause after closing: the closed contact is made, but the lock bolt has not engaged yet. Continue to see the bolt engage and the returned locking indication update. Command, physical movement and reported condition are separate steps.",
        "sources": [
          "N04",
          "N05",
          "N09"
        ]
      },
      {
        "heading": "Locate the sensing area",
        "text": "The trainway, the space between the train and barrier, a door’s closing edge and the end-gate opening are different areas. The interspace lesson requires a fitted barrier. The gate lesson shows a separate hinge, latch and position contact. After an object or open gate is reported, its physical state remains visible. The associated camera provides another view for assessment.",
        "sources": [
          "N02",
          "N05",
          "N06",
          "N07"
        ]
      },
      {
        "heading": "Connect the passenger levels",
        "text": "Follow the stairs and lift between the platform and concourse. The lift car carries its own doors, while landing doors stay with the building. During the trip, the doors close, the cabin travels, and the doors beside the upper landing open. On the concourse, inspect the equipment room and follow its services to displays, help points and other passenger devices.",
        "sources": [
          "SP01",
          "F01",
          "F03",
          "F04"
        ]
      }
    ],
    "sources": [
      "N01",
      "N02",
      "N03",
      "N04",
      "N05",
      "N06",
      "N07",
      "N09",
      "SP01",
      "F01",
      "F03",
      "F04"
    ]
  }
];
