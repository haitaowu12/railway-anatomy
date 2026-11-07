import { ELECTRIFICATION_CHOICES } from './electrification.js';

export const ELECTRIFICATION_SOURCES = [
  {
    "id": "EL01",
    "title": "Third rail",
    "publisher": "Network Rail",
    "url": "https://www.networkrail.co.uk/our-work/looking-after-the-railway/track/third-rail/",
    "description": "Public infrastructure explanation of conductor rails, collector shoes, substations and regenerated energy.",
    "scope": "Conductor-rail supply, collection and braking-energy use on the railway."
  },
  {
    "id": "EL02",
    "title": "Understanding Track Engineering — Chapter 3, section 3.12",
    "publisher": "Railway Engineering Institution (formerly PWI)",
    "url": "https://www.railei.org/wp-content/uploads/2022/04/UTE-Chapter-03.pdf",
    "description": "The electrification section distinguishes third-rail running-rail return from fourth-rail separate return, and describes alternative collector contact faces.",
    "scope": "Section 3.12 explains conductor-rail circuits. The atlas arranges the two fourth-rail conductors side by side to show the separate supply and return paths."
  },
  {
    "id": "EL03",
    "title": "Contact lines",
    "publisher": "Siemens Mobility",
    "url": "https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/electrification/contact-lines.html",
    "description": "Separate DC and AC overhead-line sections establish that overhead collection does not determine the electrical supply type.",
    "scope": "An overview of overhead equipment for both AC and DC electrification."
  },
  {
    "id": "EL04",
    "title": "Signalling considerations for electrification of the Auckland metropolitan rail network",
    "publisher": "IRSE Australasia",
    "url": "https://irse.org.au/resource/2008-nov-skilton-clendon-signalling-considerations-for-electrification-of-the-auckland-metropolitan-rail-network/",
    "description": "The public 2008 abstract introduces electrification interfaces with signalling, train detection and electromagnetic compatibility.",
    "scope": "The public abstract of a 2008 paper, used for the interface between electrification and signalling."
  },
  {
    "id": "EL06",
    "title": "High-speed DC circuit breakers for fixed installations — type UR",
    "publisher": "Sécheron",
    "url": "https://www.secheron.com/wp-content/uploads/2024/12/SG101001BEN_F27_Brochure_Circuit-breaker-DC_UR26-80S_12.24.pdf",
    "description": "Public supplier brochure identifies the DC interruption device, operating mechanism and removable arc-chute assembly.",
    "scope": "December 2024 brochure; the DC breaker, operating mechanism and removable arc chute illustrate distinct component roles."
  },
  {
    "id": "EL05",
    "title": "Traction Decarbonisation Network Strategy — interim programme business case",
    "publisher": "Network Rail",
    "url": "https://www.networkrail.co.uk/wp-content/uploads/2020/09/Traction-Decarbonisation-Network-Strategy-Interim-Programme-Business-Case.pdf",
    "description": "The public 2020 technical appendices explain overhead and conductor-rail traction architectures, including wheel and running-rail return.",
    "scope": "The 2020 technical appendices provide background on traction supply and return circuits."
  },
  {
    "id": "EL07",
    "title": "Electrical Modelling of a DC Railway System with Multiple Trains",
    "publisher": "Alnuman, Gladwin and Foster · Energies (2018)",
    "url": "https://www.mdpi.com/1996-1073/11/11/3211",
    "description": "The paper examines how train movement, power demand and regenerative braking interact with a DC railway network.",
    "scope": "A 2018 research paper explaining a multi-train DC electrical model and its braking-energy calculations."
  }
];

export const ELECTRIFICATION_CONCEPTS = [
  {
    "id": "transformer-core",
    "label": "Transformer magnetic core",
    "summary": "A magnetic core links the primary and secondary windings.",
    "details": [
      "Alternating magnetic flux in the core transfers energy between the two winding circuits. The thin layers of a laminated core reduce losses caused by currents circulating within the core material.",
      "Separate the core, winding groups, tank and terminals. Follow each winding to its own terminals: the shared magnetic path does not join the two electrical circuits."
    ],
    "sources": [
      "P01",
      "E02"
    ],
    "related": [
      "transformer",
      "transformer-primary-winding",
      "transformer-secondary-winding"
    ],
    "primary": [
      "power-transformer",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "transformer-primary-winding",
    "label": "Transformer primary winding",
    "summary": "The primary winding receives the alternating supply.",
    "details": [
      "An AC voltage across the primary establishes changing magnetic flux in the core. That flux induces a voltage in the secondary winding.",
      "Amber identifies the primary winding groups. Compare them with the copper secondary groups and their separate terminals."
    ],
    "sources": [
      "P01",
      "E02"
    ],
    "related": [
      "transformer-core",
      "transformer-secondary-winding",
      "transformer-bushing"
    ],
    "primary": [
      "power-transformer",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "transformer-secondary-winding",
    "label": "Transformer secondary winding",
    "summary": "The secondary winding supplies the next electrical stage.",
    "details": [
      "Magnetic coupling induces a voltage in this winding. In the DC substation it supplies the rectifier; on the conventional AC train it supplies the line converter.",
      "Trace the secondary terminals to the downstream equipment. The separate winding circuit is electrically isolated from the primary in this two-winding transformer."
    ],
    "sources": [
      "P01",
      "E02"
    ],
    "related": [
      "transformer-primary-winding",
      "rectifier",
      "line-converter"
    ],
    "primary": [
      "power-transformer",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "transformer-tank",
    "label": "Transformer tank and cooling surfaces",
    "summary": "The tank surrounds the active assembly and supports its cooling arrangement.",
    "details": [
      "The enclosure contains the core and windings. Cooling carries away heat produced by electrical and magnetic losses; the fins provide more surface area for heat transfer.",
      "Open the cover or separate the tank from the core and windings to see how the enclosure fits around them."
    ],
    "sources": [
      "P01",
      "E02"
    ],
    "related": [
      "transformer-core",
      "transformer-bushing"
    ],
    "primary": [
      "power-transformer",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "transformer-bushing",
    "label": "Transformer bushings and terminals",
    "summary": "An insulated terminal carries a winding connection through the enclosure.",
    "details": [
      "A bushing allows a conductor to pass through the tank while insulating it from the surrounding metal.",
      "The two terminal rows connect to different winding groups. Follow the primary and secondary connections separately."
    ],
    "sources": [
      "P01",
      "E02"
    ],
    "related": [
      "transformer-primary-winding",
      "transformer-secondary-winding"
    ],
    "primary": [
      "power-transformer",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "rectifier-diode-stack",
    "label": "Rectifier semiconductor stack",
    "summary": "Diodes direct current to produce a DC output from an AC input.",
    "details": [
      "The wayside diode rectifier supplies the DC traction network. Its one-way arrangement does not return regenerated energy to the AC supply grid.",
      "Separate the clamped disc-shaped devices, heat sinks and busbars. These parts provide the conversion, cooling and electrical connections."
    ],
    "sources": [
      "P01"
    ],
    "related": [
      "rectifier",
      "rectifier-cooling",
      "rectifier-busbar",
      "regeneration"
    ],
    "primary": [
      "power-rectifier",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "rectifier-cooling",
    "label": "Rectifier heat sinks",
    "summary": "Heat sinks carry losses from the rectifier devices into the cooling path.",
    "details": [
      "Conducting diodes produce heat. Their cooling assembly transfers it away, and fins increase the area available for heat exchange.",
      "Separate the heat-sink banks to see the device packages and clamping structure. Compare that thermal path with the current path through the busbars."
    ],
    "sources": [
      "P01"
    ],
    "related": [
      "rectifier-diode-stack",
      "rectifier-busbar"
    ],
    "primary": [
      "power-rectifier",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "rectifier-busbar",
    "label": "Rectifier terminals and busbars",
    "summary": "Busbars are conductors that connect the rectifier devices and external circuits.",
    "details": [
      "The rectifier receives AC at one set of terminals and supplies DC at another. The busbars carry current between those interfaces and the semiconductor devices.",
      "Amber and cyan distinguish the two DC poles. Inspect the connections alongside the heat sinks to separate the electrical and cooling functions."
    ],
    "sources": [
      "P01"
    ],
    "related": [
      "rectifier",
      "dc-switchgear",
      "supply-return-terminal"
    ],
    "primary": [
      "power-rectifier",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "switchgear-pole",
    "label": "Switchgear interrupter pole",
    "summary": "A pole is the part of a switch or breaker that controls one circuit conductor.",
    "details": [
      "Moving contacts make or interrupt the current path. Their interruption method and insulation depend on the type of circuit and equipment.",
      "The DC feeder close-up has one pole and an arc chute. The AC close-up shows three-phase supply-side switchgear with three poles. The single-phase traction feeder shown in the AC substation is a different arrangement."
    ],
    "sources": [
      "P01",
      "E01"
    ],
    "related": [
      "switchgear-drive",
      "switchgear-busbar",
      "breaker-arc-chute"
    ],
    "primary": [
      "power-switchgear",
      "dc"
    ],
    "domain": "power"
  },
  {
    "id": "switchgear-busbar",
    "label": "Switchgear main busbars",
    "summary": "Busbars distribute incoming power to the switching poles.",
    "details": [
      "A busbar is a substantial conductor that connects several parts of a power circuit. Its electrical role is separate from the mechanism that moves the contacts.",
      "Separate the main busbar, pole assembly and operating drive. Follow the electrical connections and the mechanical links as two different paths."
    ],
    "sources": [
      "P01",
      "E01"
    ],
    "related": [
      "switchgear-pole",
      "switchgear-drive"
    ],
    "primary": [
      "power-switchgear",
      "dc"
    ],
    "domain": "power"
  },
  {
    "id": "switchgear-drive",
    "label": "Switchgear operating mechanism",
    "summary": "The operating mechanism moves the switching contacts.",
    "details": [
      "A drive and its links transmit mechanical force to the moving contacts. A command starts that action; position feedback reports the resulting state.",
      "Separate the shaft and links from the interrupter poles to see how one mechanism operates the selected contacts."
    ],
    "sources": [
      "P01",
      "E01"
    ],
    "related": [
      "switchgear-pole",
      "substation-control"
    ],
    "primary": [
      "power-switchgear",
      "dc"
    ],
    "domain": "power"
  },
  {
    "id": "breaker-arc-chute",
    "label": "DC breaker arc chute",
    "summary": "The arc chute helps interrupt current when the DC contacts separate.",
    "details": [
      "An electric arc can continue carrying current across opening contacts. The selected air-break DC breaker uses an arc chute above the contact to help control and extinguish that arc.",
      "Separate the plate stack, switching pole and drive. Their positions show the relationship between the current path and the mechanism that opens it."
    ],
    "sources": [
      "EL06",
      "P01"
    ],
    "related": [
      "breaker",
      "switchgear-pole",
      "switchgear-drive"
    ],
    "primary": [
      "power-switchgear",
      "dc"
    ],
    "domain": "power"
  },
  {
    "id": "overhead-contact-wire",
    "label": "Overhead contact wire and catenary",
    "summary": "The contact wire provides the sliding surface for the pantograph.",
    "details": [
      "In this catenary arrangement, short vertical droppers suspend the lower contact wire from the upper supporting wire. Masts and insulated supports hold the assembly above the track.",
      "The same collection method appears in the overhead DC and AC examples. The supply and conversion equipment determines which electrical arrangement is selected."
    ],
    "sources": [
      "EL03"
    ],
    "related": [
      "pantograph",
      "overhead-support",
      "running-rail-return"
    ],
    "primary": [
      "guideway",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "overhead-support",
    "label": "Overhead supports and insulation",
    "summary": "The supports hold the wires; the insulators separate live parts from the structure.",
    "details": [
      "Masts and cantilevers support the overhead line. Droppers suspend the contact wire from the supporting wire, while insulators interrupt unwanted conducting paths to the structure.",
      "Inspect the supports alongside the pantograph to see how the contact surface is held in position above the vehicle."
    ],
    "sources": [
      "EL03"
    ],
    "related": [
      "overhead-contact-wire",
      "pantograph",
      "grounding"
    ],
    "primary": [
      "guideway",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "pantograph",
    "label": "Pantograph",
    "summary": "A roof-mounted collector maintains sliding contact with the overhead wire.",
    "details": [
      "The base supports articulated arms and a contact head. Together they provide a moving electrical connection between the train and the contact wire.",
      "Separate the base, arms and head. Both overhead DC and AC use a pantograph here; the conventional AC example also carries a transformer and line converter."
    ],
    "sources": [
      "EL03",
      "E02"
    ],
    "related": [
      "pantograph-base",
      "pantograph-arms",
      "pantograph-head",
      "onboard-transformer"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "pantograph-base",
    "label": "Pantograph base and insulators",
    "summary": "The base anchors the collector and insulates it from the roof.",
    "details": [
      "The base provides the mounting points for the mechanism. Its insulators separate the current-carrying assembly from the vehicle structure.",
      "Inspect the base below the articulated arms, then follow the collector up to the contact strips."
    ],
    "sources": [
      "EL03"
    ],
    "related": [
      "pantograph",
      "pantograph-arms"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "pantograph-arms",
    "label": "Pantograph articulated arms",
    "summary": "Jointed arms let the contact head move vertically above the roof.",
    "details": [
      "The arms support the head while accommodating changes in wire height and vehicle position. The complete collector controls contact force so the strips can remain against the wire.",
      "Separate the arm assembly from the base and head to identify its pivots and supporting links. The close-up shows their arrangement in a fixed position."
    ],
    "sources": [
      "EL03"
    ],
    "related": [
      "pantograph-base",
      "pantograph-head"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "pantograph-head",
    "label": "Pantograph head and contact strips",
    "summary": "The contact strips slide along the underside of the wire.",
    "details": [
      "The head supports the strips that collect current from the moving contact. Their surface and condition affect the electrical and mechanical contact with the wire.",
      "Separate the head from the arms and inspect the contact surface at the top of the collector."
    ],
    "sources": [
      "EL03"
    ],
    "related": [
      "pantograph",
      "overhead-contact-wire"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "collector-positive-shoe",
    "label": "Supply collector shoe",
    "summary": "A collector shoe provides sliding contact with the supply rail.",
    "details": [
      "Conductor-rail systems can use top, side or bottom contact. This model uses side contact so the shoe and its conductor are visible together.",
      "Third rail has a supply shoe. Fourth rail adds a separate return shoe. Overhead collection replaces the supply shoe with a pantograph."
    ],
    "sources": [
      "P11",
      "EL02"
    ],
    "related": [
      "collector",
      "positive-rail",
      "collector-return-shoe"
    ],
    "primary": [
      "bogie",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "collector-return-shoe",
    "label": "Separate-return collector shoe",
    "summary": "A fourth-rail train has a separate shoe for the normal traction return.",
    "details": [
      "The return shoe contacts a second conductor rail, completing the traction circuit separately from the running rails.",
      "The model places the supply and return conductors together on one side, leaving the centre available for the LIM reaction rail. This teaching layout shows the circuit distinction; rail positions vary between installations."
    ],
    "sources": [
      "EL02"
    ],
    "related": [
      "collector",
      "negative-rail",
      "grounding"
    ],
    "primary": [
      "bogie",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "wheel-return",
    "label": "Wheelset traction-return connection",
    "summary": "An electrical connection carries return current from the train to its wheelsets.",
    "details": [
      "The third-rail and both overhead examples use the wheelsets and running rails in the return circuit. Designed return connections provide that path instead of relying on incidental contact through bearings.",
      "Find the axle-end return marker, then follow the running rails toward the supply-side return terminal."
    ],
    "sources": [
      "EL02",
      "EL05",
      "E03"
    ],
    "related": [
      "running-rail-return",
      "study-return",
      "bogie"
    ],
    "primary": [
      "bogie",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "running-rail-return",
    "label": "Running-rail traction return",
    "summary": "Running rails can support the train and carry traction return current.",
    "details": [
      "The third-rail and overhead examples use electrically connected running rails in the return circuit. The fourth-rail example has a separate normal return conductor.",
      "Follow the cyan connection toward the supply. Traction return also has interfaces with train-detection circuits, protective bonding and control of stray current."
    ],
    "sources": [
      "EL02",
      "EL04",
      "EL05"
    ],
    "related": [
      "wheel-return",
      "grounding",
      "track-circuit",
      "supply-return-terminal"
    ],
    "primary": [
      "guideway",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "onboard-transformer",
    "label": "Onboard traction transformer",
    "summary": "The conventional AC train transforms the collected supply before line conversion.",
    "details": [
      "The pantograph feeds the primary winding, whose return uses wheelsets and running rails. The secondary winding feeds the separate line-converter circuit.",
      "The transformer appears under the vehicle in this teaching layout. It is omitted from all three DC supply examples."
    ],
    "sources": [
      "E02",
      "E03"
    ],
    "related": [
      "pantograph",
      "line-converter",
      "transformer-core"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "line-converter",
    "label": "Onboard AC line converter",
    "summary": "The AC line converter controls power between the transformer and the DC link.",
    "details": [
      "In the conventional AC chain, it converts the transformer’s AC output for the DC intermediate circuit. The motor inverter is a separate stage that supplies the motor.",
      "Overhead DC changes the collection method without adding this AC conversion stage. Returning braking energy through the line converter also requires the supply network to accept it."
    ],
    "sources": [
      "E02",
      "P04"
    ],
    "related": [
      "onboard-transformer",
      "dc-link",
      "traction-inverter"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "line-converter-module",
    "label": "Line-converter semiconductor modules",
    "summary": "Semiconductor modules perform the line converter’s power switching.",
    "details": [
      "The modules control the exchange of energy between the transformer’s AC circuit and the DC link.",
      "Remove the cover or separate the modules. Compare their place in the chain with the motor-inverter modules downstream."
    ],
    "sources": [
      "E02",
      "P04"
    ],
    "related": [
      "line-converter",
      "inverter-power-module"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "dc-link",
    "label": "Onboard DC link",
    "summary": "The DC link is the intermediate circuit feeding the motor inverter.",
    "details": [
      "All four supply examples include a DC link. AC reaches it through the transformer and line converter; the DC examples feed it from the collected DC supply.",
      "The capacitor bank stores electrical energy and helps smooth voltage changes. Inspect it separately from the power modules that switch current in the converters."
    ],
    "sources": [
      "E02",
      "P04"
    ],
    "related": [
      "traction-inverter",
      "line-converter",
      "inverter-power-module"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "inverter-power-module",
    "label": "Motor-inverter power modules",
    "summary": "The motor inverter turns DC-link power into controlled motor power.",
    "details": [
      "Its switching modules produce the electrical output needed by the selected rotary motor or LIM. The inverter’s motor-side role is the same whether the train collects power from a rail or an overhead wire.",
      "Separate the modules from the capacitor bank and enclosure to follow the DC input and motor output."
    ],
    "sources": [
      "P04",
      "E02"
    ],
    "related": [
      "traction-inverter",
      "dc-link",
      "lim-primary",
      "rotary-traction-motor"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "onboard-braking-resistor",
    "label": "Onboard braking resistor",
    "summary": "A braking resistor turns electrical braking energy into heat on the train.",
    "details": [
      "When the network cannot accept the available braking energy, a chopper can direct DC-link energy into the resistor. The chopper controls that connection.",
      "The selected AC comparison places the resistor on the train; the selected DC comparison uses a wayside resistor. Location is a feature of these examples, not a rule that separates AC and DC trains."
    ],
    "sources": [
      "P12",
      "P04"
    ],
    "related": [
      "regeneration",
      "dc-link",
      "wayside-resistor"
    ],
    "primary": [
      "vehicle",
      "default"
    ],
    "domain": "vehicle"
  },
  {
    "id": "ac-feeder-switchgear",
    "label": "AC traction feeder switchgear",
    "summary": "The traction feeder connects the AC substation to the overhead line.",
    "details": [
      "This conventional single-phase arrangement uses a single feeder pole between the traction transformer and contact line. Other systems, including autotransformer arrangements, can use two-pole equipment.",
      "The three-pole AC equipment close-up illustrates three-phase supply-side switchgear. At the traction feeder, follow the outgoing line and the separate return to see the single-phase circuit."
    ],
    "sources": [
      "E01"
    ],
    "related": [
      "transformer",
      "switchgear-pole",
      "supply-return-terminal"
    ],
    "primary": [
      "substation",
      "default"
    ],
    "domain": "power"
  },
  {
    "id": "supply-return-terminal",
    "label": "Traction return terminal",
    "summary": "The return terminal connects the traction circuit back to its source.",
    "details": [
      "The chosen profile brings return current from either a separate conductor rail or the running-rail network.",
      "Follow the cyan return connection alongside the outgoing feeder. Normal traction return and protective earthing have different functions, even where their engineered bonding arrangements meet."
    ],
    "sources": [
      "P01",
      "E01",
      "EL02"
    ],
    "related": [
      "running-rail-return",
      "negative-rail",
      "grounding"
    ],
    "primary": [
      "substation",
      "default"
    ],
    "domain": "power"
  }
];

export const ELECTRIFICATION_VIEW_DATA = {
  "electrification": {
    "label": "Electrification chain",
    "title": "Collection, conversion and return",
    "component": "supply-conversion",
    "domain": "power",
    "parent": "system",
    "motion": false,
    "note": "Four supply arrangements share the independently selected propulsion. Amber marks the supply, cyan the return and copper the transformer secondary. These static traces show connections, not the changing direction of AC current.",
    "variants": [
      {
        "id": "chain",
        "label": "Complete chain",
        "title": "Trace the selected collection and return",
        "description": "Choose the supply arrangement to change the substation, collector, onboard conversion and return together. Your propulsion choice stays selected.",
        "nodes": [
          "Wayside supply",
          "Current collection",
          "Onboard conversion",
          "Traction return"
        ],
        "sources": [
          "EL01",
          "EL02",
          "EL03",
          "E01",
          "E02"
        ],
        "component": "supply-conversion"
      }
    ]
  },
  "power-transformer": {
    "label": "Transformer assembly",
    "title": "Inspect the magnetic and electrical interfaces",
    "component": "transformer",
    "domain": "power",
    "parent": "substation",
    "motion": false,
    "note": "Separate the core, primary and secondary windings, tank, cover and insulated terminals. Magnetic coupling links the two winding circuits; the dimensions and winding counts are schematic.",
    "variants": [
      {
        "id": "default",
        "label": "Assembly",
        "title": "Inspect the magnetic and electrical interfaces",
        "description": "Separate the core, primary and secondary windings, tank, cover and insulated terminals. Magnetic coupling links the two winding circuits; the dimensions and winding counts are schematic.",
        "nodes": [
          "Enclosure",
          "Internal assembly",
          "Electrical / mechanical interfaces"
        ],
        "sources": [
          "P01",
          "E02"
        ],
        "component": "transformer"
      }
    ]
  },
  "power-rectifier": {
    "label": "Rectifier assembly",
    "title": "Inspect a diode rectifier",
    "component": "rectifier",
    "domain": "power",
    "parent": "substation",
    "motion": false,
    "note": "Separate the semiconductor stacks, heat sinks, busbars and enclosure. The close-up shows how conversion, cooling and electrical connections fit together.",
    "variants": [
      {
        "id": "default",
        "label": "Assembly",
        "title": "Inspect a diode rectifier",
        "description": "Separate the semiconductor stacks, heat sinks, busbars and enclosure. The close-up shows how conversion, cooling and electrical connections fit together.",
        "nodes": [
          "Enclosure",
          "Internal assembly",
          "Electrical / mechanical interfaces"
        ],
        "sources": [
          "P01"
        ],
        "component": "rectifier"
      }
    ]
  },
  "power-switchgear": {
    "label": "Switchgear assembly",
    "title": "Inspect the interruption mechanism",
    "component": "dc-switchgear",
    "domain": "power",
    "parent": "substation",
    "motion": false,
    "note": "Separate the current path from the mechanism that moves the contacts. The AC close-up shows three-phase supply-side equipment; the AC traction feeder is single-phase. Open contacts alone do not establish an isolated worksite.",
    "variants": [
      {
        "id": "dc",
        "label": "DC feeder",
        "title": "Separate the DC interruption assembly",
        "description": "The DC feeder has one switching pole, an operating mechanism and an arc chute that helps extinguish the arc when the contacts open.",
        "nodes": [
          "Main busbar",
          "DC pole",
          "Arc chute",
          "Operating mechanism"
        ],
        "sources": [
          "P01"
        ],
        "component": "dc-switchgear"
      },
      {
        "id": "ac",
        "label": "Three-phase AC",
        "title": "Inspect three-phase supply-side switchgear",
        "description": "Three interrupter poles share an operating drive, one pole for each phase. This supply-side close-up differs from the single-phase traction feeder shown in the AC substation.",
        "nodes": [
          "Three-phase busbars",
          "Three AC poles",
          "Insulation",
          "Operating mechanism"
        ],
        "sources": [
          "E01"
        ],
        "component": "ac-switchgear"
      }
    ]
  }
};

export function applyElectrificationCatalog(sources,concepts){
  for(const source of ELECTRIFICATION_SOURCES)if(!sources.some(item=>item.id===source.id))sources.push(source);
  for(const {primary,domain,...concept}of ELECTRIFICATION_CONCEPTS){const existing=concepts.find(item=>item.id===concept.id);if(existing)Object.assign(existing,concept);else concepts.push(concept);}
  const patches={
  "supply-conversion": {
    "label": "Supply conversion",
    "summary": "Compare where four supply arrangements collect, convert and return electrical power.",
    "details": [
      "Third rail DC uses a supply shoe and running-rail return. Fourth rail DC adds a separate return conductor and shoe. Overhead DC and AC use a pantograph and running-rail return.",
      "The DC examples rectify AC at the substation. The conventional overhead AC example adds an onboard transformer and line converter. The motor inverter then supplies the independently selected propulsion."
    ],
    "sources": [
      "EL01",
      "EL02",
      "EL03",
      "E01",
      "E02"
    ]
  },
  "study-collector": {
    "label": "Current collection interface",
    "summary": "Shoes contact conductor rails; a pantograph contacts overhead wire.",
    "details": [
      "The collector provides a moving electrical contact between the train and its supply. Either AC or DC can be collected overhead.",
      "Fourth rail adds a separate return shoe. The other three examples return traction current through the wheelsets and running rails."
    ],
    "sources": [
      "EL02",
      "EL03",
      "P11"
    ]
  },
  "study-onboard-transformer": {
    "label": "Onboard traction transformer",
    "summary": "The conventional AC train changes voltage through two separate winding circuits.",
    "details": [
      "The pantograph supplies the primary winding. Magnetic coupling transfers energy to the secondary winding, which feeds the line converter.",
      "The primary return runs through wheelsets and rails. Copper traces show the separate secondary circuit. This transformer appears only in the overhead AC example."
    ],
    "sources": [
      "E02",
      "E03"
    ]
  },
  "study-converter": {
    "label": "Line converter and DC link",
    "summary": "A DC link connects the supply conversion to the motor inverter.",
    "details": [
      "In the conventional AC example, the transformer and line converter feed the DC link. The three DC examples feed the onboard DC circuit without those AC stages.",
      "The capacitor bank stores electrical energy and helps smooth the DC-link voltage. Open the enclosure to distinguish it from the line-converter and motor-inverter modules."
    ],
    "sources": [
      "E02",
      "P04"
    ]
  },
  "study-drive": {
    "label": "Motor conversion and propulsion",
    "summary": "The motor inverter supplies the selected propulsion in every supply arrangement.",
    "details": [
      "Rotary motors turn wheelsets through a mechanical drive. A linear induction motor (LIM) instead develops thrust by interacting with a reaction rail.",
      "Changing between conductor rail and overhead collection keeps the propulsion choice. Follow the inverter output to see which motor receives the controlled electrical power."
    ],
    "sources": [
      "P04",
      "P02",
      "P03"
    ]
  },
  "study-return": {
    "label": "Traction return path",
    "summary": "The traction circuit needs a return connection to its source.",
    "details": [
      "Fourth rail uses a separate return conductor and shoe in this model. Third rail, overhead DC and overhead AC use wheelsets and running rails as part of their return circuit.",
      "Cyan traces identify the normal traction return. Protective earthing and bonding address electrical hazards; the two functions must be coordinated in the railway’s electrical design."
    ],
    "sources": [
      "EL02",
      "EL04",
      "EL05",
      "E02"
    ]
  },
  "transformer": {
    "summary": "A transformer transfers energy between separate winding circuits through a magnetic core.",
    "details": [
      "The DC substation transformer supplies the rectifier. The conventional AC chain has a source-side traction transformer and a separate transformer on the train before the line converter.",
      "Open the assembly to identify the core, primary and secondary windings, tank and insulated terminals. Follow each winding to its own electrical connections."
    ],
    "sources": [
      "P01",
      "E01",
      "E02"
    ]
  },
  "rectifier": {
    "summary": "The wayside diode rectifier supplies the DC traction network.",
    "details": [
      "The rectifier changes the substation transformer’s AC output into DC. Its diode arrangement is one-way, so it cannot export regenerated energy to the AC grid. A receiving train or another available energy sink is needed on the DC side.",
      "Open the assembly to inspect the clamped semiconductor devices, heat sinks, busbars and enclosure. The conventional AC supply chain omits this wayside rectifier."
    ],
    "sources": [
      "P01",
      "P12"
    ]
  }
};
  for(const [id,patch]of Object.entries(patches)){const concept=concepts.find(item=>item.id===id);if(concept)Object.assign(concept,patch);}
}

export function applyElectrificationConfig({SYSTEMS,NEW_VIEWS,PART_VIEWS,PART_VARIANTS,PART_CONTEXTS,PART_VIEW_VARIANTS,PART_RELATIONS}){
  Object.assign(NEW_VIEWS,ELECTRIFICATION_VIEW_DATA);
  const power=SYSTEMS.find(item=>item.id==='power');
  for(const id of Object.keys(ELECTRIFICATION_VIEW_DATA))if(!power.views.includes(id))power.views.push(id);
  for(const concept of ELECTRIFICATION_CONCEPTS){
    const [view,variant]=concept.primary;
    const domain=SYSTEMS.find(item=>item.id===concept.domain)||power;
    if(!domain.parts.includes(concept.id))domain.parts.push(concept.id);
    PART_VIEWS[concept.id]=view;PART_VARIANTS[concept.id]=variant;
    const contexts=view.startsWith('power-')?[view,'substation','system','electrification']:view==='substation'?['substation','system','electrification']:view==='guideway'?['guideway','vehicle','bogie','system','electrification']:view==='bogie'?['bogie','vehicle','system','electrification']:['vehicle','system','electrification'];
    PART_CONTEXTS[concept.id]=contexts;
    PART_VIEW_VARIANTS[concept.id]=Object.fromEntries(contexts.map(context=>[context,context==='electrification'?['chain']:context==='power-switchgear'?(concept.id==='breaker-arc-chute'?['dc']:['dc','ac']):['default']]));
    PART_RELATIONS[concept.id]=concept.related;
    for(const related of concept.related)PART_RELATIONS[related]=[...new Set([...(PART_RELATIONS[related]||[]),concept.id])];
  }
  for(const id of ['supply-conversion','study-collector','study-onboard-transformer','study-converter','study-drive','study-return']){PART_VARIANTS[id]='chain';PART_VIEW_VARIANTS[id]={electrification:['chain']};}
  for(const [id,view,variant]of [['transformer','power-transformer','default'],['rectifier','power-rectifier','default'],['dc-switchgear','power-switchgear','dc'],['ac-switchgear','power-switchgear','ac'],['breaker','power-switchgear','dc']]){
    PART_VIEWS[id]=view;PART_VARIANTS[id]=variant;
    PART_CONTEXTS[id]=[...new Set([view,'substation','system','electrification',...(PART_CONTEXTS[id]||[])])];
    PART_VIEW_VARIANTS[id]={...(PART_VIEW_VARIANTS[id]||{}),[view]:[variant],electrification:['chain']};
  }
}

export const ELECTRIFICATION_PROFILE_IDS=ELECTRIFICATION_CHOICES.map(item=>item.id);
