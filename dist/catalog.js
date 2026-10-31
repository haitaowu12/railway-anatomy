import {EXTRA_SOURCES, EXTRA_CONCEPTS} from './expansion-data.js';
// Public-source educational content. Geometry and selected arrangements are illustrative.
export const SOURCES = [
  {
    "id": "P01",
    "title": "DC traction power supply system",
    "publisher": "Siemens Mobility",
    "url": "https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/electrification/dc-traction-power-supply.html",
    "description": "Substation conversion, distribution and protection.",
    "scope": "General DC traction architecture."
  },
  {
    "id": "P02",
    "title": "Short-primary Type Linear Induction Motors (IEC 62520)",
    "publisher": "Railway Technical Research Institute",
    "url": "https://risc.rtri.or.jp/risc/en/aboutStandards/proposedIEC62520.jsp",
    "description": "Train-mounted primary and track-mounted secondary.",
    "scope": "Short-primary LIM architecture; no fleet-specific details are adopted."
  },
  {
    "id": "P03",
    "title": "Electric Machines: Electromagnetic Forces, section 4.3",
    "publisher": "Massachusetts Institute of Technology — James L. Kirtley Jr.",
    "url": "https://web.mit.edu/course/6/6.685/www/chapter1.pdf",
    "description": "An idealized single-sided linear induction machine.",
    "scope": "Travelling field, induced currents, air gap and relative motion; the idealization omits finite-length effects."
  },
  {
    "id": "P04",
    "title": "MoComp Traction Converters",
    "publisher": "Siemens Mobility",
    "url": "https://www.mobility.siemens.com/global/en/portfolio/rolling-stock-components/traction-converters.html",
    "description": "Traction power electronics and regeneration.",
    "scope": "Converter functions and design-dependent cooling; product ratings are not adopted."
  },
  {
    "id": "P05",
    "title": "Auxiliary Converter",
    "publisher": "ABB",
    "url": "https://www.abb.com/global/en/areas/motion/traction/auxiliary-converter",
    "description": "Onboard auxiliary supplies and optional battery charging.",
    "scope": "Auxiliary conversion; particular output circuits and emergency endurance are model choices."
  },
  {
    "id": "P06",
    "title": "Brake Control Functions",
    "publisher": "Knorr-Bremse",
    "url": "https://rail.knorr-bremse.com/en/hu/about-us/knorr-bremse-in-hungary/local-activities/content-page-brake-control-functions/",
    "description": "Brake blending, wheel-slide protection and parking functions.",
    "scope": "Principles and available architectures; source-specific speed thresholds are not generalized."
  },
  {
    "id": "P07",
    "title": "Efficient compressors for rail vehicles",
    "publisher": "Knorr-Bremse",
    "url": "https://rail.knorr-bremse.com/en/se/portfolio/products-and-systems/braking-systems/supply/",
    "description": "Compressed-air generation, drying and demand control.",
    "scope": "An example of pneumatic onboard services; not every vehicle uses pneumatic brake actuation."
  },
  {
    "id": "P08",
    "title": "Climate Control Systems (HVAC)",
    "publisher": "Knorr-Bremse",
    "url": "https://rail.knorr-bremse.com/en/at/portfolio/products-and-systems/climate-control-systems-hvac/",
    "description": "Heating, cooling, ventilation, filtration and control.",
    "scope": "Passenger comfort functions; unit locations and thermal capacities vary."
  },
  {
    "id": "P09",
    "title": "Subways and Metros — Entrance Systems",
    "publisher": "Knorr-Bremse",
    "url": "https://rail.knorr-bremse.com/en/ca/portfolio/vehicle-types/metros/",
    "description": "Passenger doors, obstacle detection and access aids.",
    "scope": "Generic passenger access; no proprietary door logic is reproduced."
  },
  {
    "id": "P10",
    "title": "Flexx bogies: Safety, reliability and comfort for all trains",
    "publisher": "Alstom",
    "url": "https://www.alstom.com/solutions/components/flexx-bogies-safety-reliability-and-comfort-all-trains",
    "description": "Bogies, vehicle dynamics and wheel–rail interfaces.",
    "scope": "Background reading for bogie roles; geometry shown is original and illustrative."
  },
  {
    "id": "P11",
    "title": "3rd Rail Current Collector",
    "publisher": "Stemmann-Technik",
    "url": "https://www.stemmann.com/en/products/3rd_rail_current_collector",
    "description": "Shoegear and top, side or bottom contact arrangements.",
    "scope": "Current collection; selected positive/negative conductor layout is an illustrative circuit, not this product specification."
  },
  {
    "id": "P12",
    "title": "Resistors for rail traction",
    "publisher": "Cressall",
    "url": "https://www.cressall.com/applications/rail-traction-dynamic-braking/",
    "description": "Regeneration and onboard or trackside energy dissipation.",
    "scope": "Energy destinations and resistor thermal considerations; no product sizing is implied."
  },
  {
    "id": "T01",
    "title": "FAQ and glossary: ATC, ATP and ATO",
    "publisher": "Prover",
    "url": "https://www.prover.com/faq/",
    "description": "Rail signalling supplier definitions of protection, operation and supervision responsibilities.",
    "scope": "Use the ATP, ATO and ATC entries only; supplier terminology is not a universal architecture."
  },
  {
    "id": "T02",
    "title": "Train Operation Systems",
    "publisher": "Mitsubishi Electric",
    "url": "https://www.mitsubishielectric.com/traffic/products/operation/",
    "description": "An example of train–wayside position and control exchanges, radio units and zone controllers.",
    "scope": "One manufacturer's conceptual radio-control arrangement; no equipment specifications or configurations reproduced."
  },
  {
    "id": "T03",
    "title": "Advanced urban network control with automatic train supervision",
    "publisher": "Alstom",
    "url": "https://www.alstom.com/advanced-urban-network-control-automatic-train-supervision",
    "description": "Traffic supervision, regulation, operations decision support and configurable control-centre functions.",
    "scope": "A commercial ATS example, used for functional explanation rather than claimed performance."
  },
  {
    "id": "T04",
    "title": "TCMS master control system",
    "publisher": "Škoda Group",
    "url": "https://www.skodagroup.com/reference/tcms-master-control-system",
    "description": "Vehicle subsystem coordination, communications and diagnostics, including traction, brakes, doors and HVAC.",
    "scope": "A configurable supplier implementation; the educational model separates responsibilities without claiming separate physical computers."
  },
  {
    "id": "T05",
    "title": "Introducing Cisco Rail Communications-Based Train Control and Safety Solution",
    "publisher": "Cisco",
    "url": "https://blogs.cisco.com/industrial-iot/introducing-cisco-rail-communications-based-train-control-cbtc-and-safety-solution",
    "description": "Onboard, wayside wireless, access, backbone and control-centre communication modules.",
    "scope": "Conceptual data transport only; no addresses, frequencies, security settings or deployment instructions."
  },
  {
    "id": "T06",
    "title": "Sensors for Relative and Total Localization",
    "publisher": "Deutsche Bahn — Digitale Schiene Deutschland",
    "url": "https://digitale-schiene-deutschland.de/en/sensors-for-relative-and-total-localisation",
    "description": "Relative motion measurements, absolute position references and complementary localization sensors.",
    "scope": "General sensor roles; research developments described by the source are not asserted to be standard on all trains."
  },
  {
    "id": "T07",
    "title": "Onboard Train Localization with Track Signatures: Towards GNSS Redundancy",
    "publisher": "German Aerospace Center (DLR), Oliver Heirich and Benjamin Siebler",
    "url": "https://elib.dlr.de/112282/1/Heirich_ION_2017.pdf",
    "description": "Research on wheel-slip and inertial estimation errors.",
    "scope": "Introductory principles; experimental methods are not universal installations."
  },
  {
    "id": "T08",
    "title": "Brake Control",
    "publisher": "Knorr-Bremse",
    "url": "https://www.knorr-bremse.us/en/products/braking-systems/brake-control/",
    "description": "Coordination of brake types, load-dependent braking and wheel-slide protection.",
    "scope": "Brake-control roles; braking assurance and emergency behaviour depend on the engineered system."
  },
  {
    "id": "T09",
    "title": "Detection Systems",
    "publisher": "IFE, Knorr-Bremse Group",
    "url": "https://www.ife-doors.com/en/products/detection-systems/content-page-2600/",
    "description": "Door obstruction and anti-drag detection, including departure inhibition after a door appears closed.",
    "scope": "A supplier example; sensing technology and departure permissives vary by vehicle."
  },
  {
    "id": "T10",
    "title": "Passenger Information System",
    "publisher": "AMiT Transportation",
    "url": "https://amit-transportation.com/en/systems/pis/",
    "description": "Passenger displays, announcements and emergency intercom functions.",
    "scope": "Modular passenger-service examples; intercom connections and automatic responses are project-specific."
  },
  {
    "id": "T11",
    "title": "Intelligent CCTV",
    "publisher": "Siemens Mobility",
    "url": "https://www.mobility.siemens.com/global/en/portfolio/digital-solutions-software/digital-train-solutions/intelligent-cctv.html",
    "description": "Onboard video processing and information for crew and operational monitoring.",
    "scope": "Use generic camera and monitoring roles, without personal data or biometric analytics."
  },
  {
    "id": "T12",
    "title": "TSN — Rolling Towards Safer Train Networks",
    "publisher": "Moxa",
    "url": "https://moxa.com/en/articles/tsn-rolling-towards-safer-train-networks",
    "description": "Separate railway networks and research into shared infrastructure with controlled traffic separation.",
    "scope": "Explains architectural alternatives; shared Ethernet alone does not make an application safety-certified."
  },
  {
    "id": "K01",
    "title": "Track",
    "publisher": "Network Rail",
    "url": "https://www.networkrail.co.uk/our-work/looking-after-the-railway/track/",
    "description": "The rail, sleeper and ballast assembly, including switches and crossings.",
    "scope": "Basic track functions; network statistics and maintenance procedures are excluded."
  },
  {
    "id": "K02",
    "title": "Ballast and Subgrade Requirements Study: Railroad Track Substructure—Materials Evaluation and Stabilization Practices",
    "publisher": "Federal Railroad Administration / US Department of Transportation",
    "url": "https://rosap.ntl.bts.gov/view/dot/11483",
    "description": "Subballast, foundation materials, drainage and layer separation.",
    "scope": "Historical engineering principles from the public report; not a current design specification."
  },
  {
    "id": "K03",
    "title": "Properties of Fouled Railroad Ballast (Phase 1)",
    "publisher": "Mid-America Transportation Center / University of Kansas",
    "url": "https://rosap.ntl.bts.gov/view/dot/25427",
    "description": "Laboratory research on ballast load distribution, drainage and fouling.",
    "scope": "Qualitative mechanisms; numerical laboratory results are not used as site design values."
  },
  {
    "id": "K04",
    "title": "Sleepers",
    "publisher": "Vossloh",
    "url": "https://www.vossloh.com/en-us/sleepers",
    "description": "Sleeper force transfer, rail anchorage and alternative support materials.",
    "scope": "General functions, including the distinction between rail pads and under-sleeper pads."
  },
  {
    "id": "K05",
    "title": "e-Clip",
    "publisher": "Pandrol",
    "url": "https://www.pandrol.com/en-us/products/fastening-systems/fasteners/e-clip",
    "description": "Elastic clips, shoulders, pads and insulators in a fastening assembly.",
    "scope": "One example of elastic rail restraint; no product forces or installation procedures."
  },
  {
    "id": "K06",
    "title": "System W 21",
    "publisher": "Vossloh",
    "url": "https://www.vossloh.com/en/products/system-w-21",
    "description": "Resilient rail fastening and elastomeric rail-pad functions.",
    "scope": "Load transfer and vibration principles; no universal pad stiffness is implied."
  },
  {
    "id": "K07",
    "title": "Fastclip",
    "publisher": "Pandrol",
    "url": "https://www.pandrol.com/products/fastening-systems/fasteners/fastclip",
    "description": "Insulators, support interfaces and baseplate variants.",
    "scope": "Assembly choices and component roles; adjustment ranges and installation details are omitted."
  },
  {
    "id": "K08",
    "title": "System DFF 100",
    "publisher": "Vossloh",
    "url": "https://www.vossloh.com/en/products/system-dff-100",
    "description": "Direct rail fastening with anchors, insulation and resilient intermediate layers.",
    "scope": "An example of discrete direct-fixation supports on concrete."
  },
  {
    "id": "K09",
    "title": "RHEDA 2000",
    "publisher": "RAILONE",
    "url": "https://railone.com/services/rheda-2000/",
    "description": "A slab-track construction using precast rail-support blocks and cast-in-place concrete.",
    "scope": "One slab-track architecture; its particular geometry and performance figures are not adopted."
  },
  {
    "id": "K10",
    "title": "QTrack",
    "publisher": "Pandrol",
    "url": "https://www.pandrol.com/products/fastening-systems/embedded-solutions/qtrack",
    "description": "Continuous elastic support and insulation around an embedded rail.",
    "scope": "Embedded-track construction principles; street paving is an illustrative context."
  },
  {
    "id": "K11",
    "title": "Steel Products for Rail Applications: Profiles and Grades",
    "publisher": "British Steel",
    "url": "https://www.britishsteel.co.uk/wp-content/uploads/2026/02/british-steel-rail-profiles-and-grades-datasheet.pdf",
    "description": "Different rail cross-sections and their section properties.",
    "scope": "Profile anatomy only; the model does not reproduce a dimensioned commercial profile."
  },
  {
    "id": "K12",
    "title": "Turnout Systems",
    "publisher": "voestalpine Railway Systems / Nortrak-Damy",
    "url": "https://www.voestalpine.com/nortrak_damy/en/products/turnout-systems/",
    "description": "The relationship between a switch, closure rails and a frog.",
    "scope": "Turnout component vocabulary; no particular turnout geometry is adopted."
  },
  {
    "id": "K13",
    "title": "Optimized Switch Device TOZ",
    "publisher": "voestalpine Railway Systems",
    "url": "https://www.voestalpine.com/railway-systems/en/products/optimized-switch-device-toz/",
    "description": "The coordinated contact geometry of stock and switch rails.",
    "scope": "Wheel-guidance relationships; the proprietary optimized profile is not reproduced."
  },
  {
    "id": "K14",
    "title": "Common Built-up Crossing EHZ COMPOUND Mn13",
    "publisher": "voestalpine Railway Systems",
    "url": "https://www.voestalpine.com/railway-systems/en/products/ehz-compound-mn13/",
    "description": "A fixed crossing assembled from a vee and wing rails.",
    "scope": "Crossing anatomy and flangeways; casting details and dimensions are omitted."
  },
  {
    "id": "K15",
    "title": "Guard Rails — AREMA Style",
    "publisher": "voestalpine Railway Systems Nortrak",
    "url": "https://www.voestalpine.com/nortrak/en/products/Guard-Rails-AREMA-Style/",
    "description": "The guide rail opposite a frog and its wheelset-guidance role.",
    "scope": "Check-rail function in a conventional fixed crossing; other guard-rail functions are distinct."
  },
  {
    "id": "K16",
    "title": "Report 20/2008: Grayrigg — Appendix B Glossary",
    "publisher": "Rail Accident Investigation Branch",
    "url": "https://assets.publishing.service.gov.uk/media/547c9037ed915d4c0d000199/R202008_081023_Grayrigg_v5.pdf",
    "description": "Public glossary definitions of stretcher bars and their assemblies.",
    "scope": "Terminology only; the incident, installed equipment and operating procedures are not modeled."
  },
  {
    "id": "K17",
    "title": "Point Operating Systems",
    "publisher": "Siemens Mobility",
    "url": "https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/components/wayside-components/point-operating-systems.html",
    "description": "Point drives, locking arrangements and point-position detection.",
    "scope": "Functional boundaries; no wiring, setpoints, bypasses or operating instructions."
  },
  {
    "id": "K18",
    "title": "Report 04/2008: Ruscombe Junction — Glossary",
    "publisher": "Rail Accident Investigation Branch",
    "url": "https://assets.publishing.service.gov.uk/media/5a818464e5274a2e87dbe0dd/080228_R042008_Ruscombe.pdf",
    "description": "Public glossary definition of a crossover.",
    "scope": "Terminology only; the incident and its actual track layout are not reproduced."
  },
  {
    "id": "K19",
    "title": "Trackwork",
    "publisher": "Progress Rail",
    "url": "https://www.progressrail.com/en/segments/infrastructure/trackwork",
    "description": "Crossing, frog and diamond products, including alternative wheel-support arrangements.",
    "scope": "A comparison of special-trackwork functions; product performance claims are not generalized."
  },
  {
    "id": "K20",
    "title": "Post-Construction Alignment Revision in Direct-Fixation Railroad Tracks",
    "publisher": "Eungcheol Kim, Myungseob Kim, Gabrielle Delos and Tyler Clark / Sustainability",
    "url": "https://www.mdpi.com/2071-1050/11/21/6166",
    "description": "Research describing the relationship between plinths, direct fasteners and supporting decks.",
    "scope": "Plinth anatomy only; the case-study dimensions, tolerances and repair methods are excluded."
  },
  {
    "id": "S01",
    "title": "SelTrac and 5G train-to-ground communications",
    "publisher": "Hitachi Rail",
    "url": "https://www.hitachi.com/en/press/articles/2024/09/0919a/",
    "description": "2024 announcement of radio options and the former Thales GTS acquisition.",
    "scope": "Supplier example; deployment choices differ."
  },
  {
    "id": "S02",
    "title": "Archived 2009 train-control upgrade planning",
    "publisher": "San Francisco Municipal Transportation Agency",
    "url": "https://archives.sfmta.com/cms/cmta/documents/4-21-09calendaritems1013-15.pdf",
    "description": "Public board material explicitly distinguishes inductive-loop and radio SelTrac.",
    "scope": "Historical planning evidence, not current installation status."
  },
  {
    "id": "S03",
    "title": "Computers and Cables: The Tech Behind Train Control",
    "publisher": "San Francisco Municipal Transportation Agency",
    "url": "https://www.sfmta.com/project-updates/computers-and-cables-tech-behind-train-control",
    "description": "Archived explanation of short-range communication through a track loop.",
    "scope": "Legacy example; page is marked older content."
  },
  {
    "id": "S04",
    "title": "Signaling: Hitachi Rail at InnoTrans 2026",
    "publisher": "Hitachi Rail",
    "url": "https://www.hitachirail.com/blog/signaling-hitachi-rail-at-innotrans-2026/",
    "description": "Published G9 virtualization and supervision product description.",
    "scope": "2026 product announcement, not every SelTrac installation."
  },
  {
    "id": "S05",
    "title": "Communications-Based Train Control: Urbalis range",
    "publisher": "Alstom",
    "url": "https://www.alstom.com/solutions/signalling/urban-signalling/communications-based-train-control-world-leading-high-capacity-signalling",
    "description": "Radio CBTC, block principles, automation grades and alternative functional allocations.",
    "scope": "Supplier portfolio; avoid universalizing its layout."
  },
  {
    "id": "S06",
    "title": "Train Operation Systems",
    "publisher": "Mitsubishi Electric",
    "url": "https://www.mitsubishielectric.com/traffic/products/operation/",
    "description": "Onboard and wayside position/control exchanges.",
    "scope": "Example zone-controller architecture."
  },
  {
    "id": "S07",
    "title": "Braking curves",
    "publisher": "European Union Agency for Railways",
    "url": "https://www.era.europa.eu/domains/european-rail-traffic-management-system/braking-curves",
    "description": "ETCS supervision, brake intervention and predicted stopping behavior.",
    "scope": "Conceptual explanation; certified algorithms are outside this model."
  },
  {
    "id": "S08",
    "title": "Automatic Train Operation",
    "publisher": "ERTMS Users Group",
    "url": "https://ertms.be/activities/automatic-train-operation",
    "description": "ATO, ETCS protection, timetable inputs and automation grades.",
    "scope": "ATO-over-ETCS example and development context."
  },
  {
    "id": "S09",
    "title": "Advanced urban network control with automatic train supervision",
    "publisher": "Alstom",
    "url": "https://www.alstom.com/advanced-urban-network-control-automatic-train-supervision",
    "description": "Traffic regulation, supervision, incident management and separate SCADA functions.",
    "scope": "Published urban control-centre example."
  },
  {
    "id": "S10",
    "title": "Electronic interlocking",
    "publisher": "Siemens Mobility",
    "url": "https://www.mobility.siemens.com/uk/en/portfolio/rail-infrastructure/mainline/interlocking-systems.html",
    "description": "Route checks and interfaces to points, signals and detection.",
    "scope": "Electronic implementation of interlocking responsibilities."
  },
  {
    "id": "S11",
    "title": "Point operating systems",
    "publisher": "Siemens Mobility",
    "url": "https://www.mobility.siemens.com/uk/en/portfolio/rail-infrastructure/components/point-operating-systems.html",
    "description": "Actuation, locks, detector rods and end-position detectors.",
    "scope": "Examples of alternative point-equipment arrangements."
  },
  {
    "id": "S12",
    "title": "The railway is full: How can we increase its capacity?",
    "publisher": "University of Birmingham, Birmingham Centre for Railway Research and Education",
    "url": "https://blog.bham.ac.uk/bcrre/2020/07/27/the-railway-is-full-how-can-we-increase-its-capacity/",
    "description": "Research explanation of fixed and moving separation limits.",
    "scope": "Block principles only; newer ETCS classification is sourced separately."
  },
  {
    "id": "S13",
    "title": "Track circuits explained",
    "publisher": "Network Rail",
    "url": "https://www.networkrail.co.uk/stories/track-circuits-explained/",
    "description": "A basic track circuit and restrictive responses to detection faults.",
    "scope": "Illustrative circuit; actual designs vary."
  },
  {
    "id": "S14",
    "title": "UNIAC[1] axle counter",
    "publisher": "voestalpine Railway Systems",
    "url": "https://www.voestalpine.com/railway-systems/en/products/uniac1-axle-counter/",
    "description": "Directional wheel sensing and section-clear evaluation.",
    "scope": "Product example, without reset or maintenance procedures."
  },
  {
    "id": "S15",
    "title": "ETCS Levels and Modes",
    "publisher": "European Commission, Directorate-General for Mobility and Transport",
    "url": "https://transport.ec.europa.eu/transport-modes/rail/ertms/what-ertms-and-how-does-it-work/etcs-levels-and-modes_en",
    "description": "Current Level 1/2 distinctions, including the 2023 merger of former Level 3.",
    "scope": "Architecture overview, not an operating rulebook."
  },
  {
    "id": "S16",
    "title": "Subsystems and Constituents of the ERTMS",
    "publisher": "European Commission, Directorate-General for Mobility and Transport",
    "url": "https://transport.ec.europa.eu/transport-modes/rail/ertms/what-ertms-and-how-does-it-work/subsystems-and-constituents-ertms_en",
    "description": "Eurobalise, LEU and interfaces between train and wayside equipment.",
    "scope": "Named ETCS constituents; other systems use different transponders."
  },
  {
    "id": "S17",
    "title": "ERTMS/ETCS Level 2",
    "publisher": "MERMEC Group",
    "url": "https://www.mermecgroup.com/protect/atpatc-systems/630/ertmsetcs-level-2.php",
    "description": "RBC, onboard EVC, DMI and train interfaces.",
    "scope": "Supplier example; no processor or performance claims are adopted."
  },
  {
    "id": "S18",
    "title": "FRMCS System Requirements Specification 2.1.0",
    "publisher": "International Union of Railways",
    "url": "https://uic.org/media-files/spip/documents/uic_frmcs_srs_at-7800_v2.1_0.pdf",
    "description": "Public April 2025 specification covering communications architecture and migration.",
    "scope": "Sections 4 and 9; no universal rollout date."
  },
  {
    "id": "S19",
    "title": "Sensors for Relative and Total Localization",
    "publisher": "Deutsche Bahn, Digitale Schiene Deutschland",
    "url": "https://digitale-schiene-deutschland.de/en/sensors-for-relative-and-total-localisation",
    "description": "Relative sensing, absolute references and combined localization measurements.",
    "scope": "Separates established sensors from research demonstrations."
  },
  {
    "id": "S20",
    "title": "SUBSET-023: Glossary of Terms and Abbreviations, version 4.0.0",
    "publisher": "ERA, UNISIG and ERTMS Users Group",
    "url": "https://www.era.europa.eu/system/files/2023-09/index003_-_SUBSET-023_v400.pdf",
    "description": "Movement authority, train integrity and related signalling definitions.",
    "scope": "Terminology, not implementation instructions."
  },
  {
    "id": "S21",
    "title": "Signals explained",
    "publisher": "Network Rail",
    "url": "https://www.networkrail.co.uk/stories/signals-explained/",
    "description": "Signals, route indications, cab displays and the broader signalling system.",
    "scope": "British examples; indication meanings are jurisdiction-specific."
  },
  {
    "id": "F01",
    "title": "NFPA 130: Standard for Fixed Guideway Transit and Passenger Rail Systems",
    "publisher": "National Fire Protection Association",
    "url": "https://www.nfpa.org/product/nfpa-130-standard/p0130code",
    "description": "Public description of the rail fire-protection and life-safety standard.",
    "scope": "Scope and further reading only; no reproduced standard clauses or compliance certification."
  },
  {
    "id": "F02",
    "title": "PRAESENSA public address and voice alarm system",
    "publisher": "Bosch / Keenfinity Group",
    "url": "https://www.keenfinity-group.com/us/en/solutions/public-address-systems/mass-notification-systems/ip-pa-system-praesensa/",
    "description": "Manufacturer overview of networked audio, amplifiers, supervision and backup power.",
    "scope": "An example PA/VA architecture, not a universal rail product selection."
  },
  {
    "id": "F03",
    "title": "Controlguide Digital Station and Power Manager",
    "publisher": "Siemens Mobility",
    "url": "https://www.mobility.siemens.com/global/en/portfolio/digital-solutions-software/infrastructure/digital-station-solutions-and-railway-communication.html",
    "description": "Station integration, passenger information and facility/power supervisory functions.",
    "scope": "Supports integration boundaries; advertised performance figures are not adopted."
  },
  {
    "id": "F04",
    "title": "Transportation solutions: rail infrastructure",
    "publisher": "Zenitel",
    "url": "https://www.zenitel.com/transportation-solutions-rail-infrastructure",
    "description": "Rail help points, audio communications and integrated operator interfaces.",
    "scope": "Function-level examples; no real station locations or response procedures are reused."
  },
  {
    "id": "F05",
    "title": "Rail transportation communications",
    "publisher": "Motorola Solutions",
    "url": "https://www.motorolasolutions.com/en_xu/solutions/transportation-logistics/rail-transportation.html",
    "description": "Operational radio devices, voice dispatch and communications applications.",
    "scope": "Technology examples, without frequencies, coverage maps or radio-channel plans."
  },
  {
    "id": "F06",
    "title": "Unified video surveillance and access control",
    "publisher": "Axis Communications",
    "url": "https://newsroom.axis.com/en-us/article/video-surveillance-access-control",
    "description": "Video management, credentials, door events and unified operator interfaces.",
    "scope": "General security functions; no actual camera coverage, access policy or retention policy."
  },
  {
    "id": "F07",
    "title": "Desigo Fire Safety modular control panel: introduction",
    "publisher": "Siemens",
    "url": "https://sid.siemens.com/r/A6V11231620/21774530443_31188591243__en-US_25009479563?contentId=vpXFyswYRet3y4BSWA2lCg",
    "description": "Public manufacturer description of initiating devices, panels and notification interfaces.",
    "scope": "Component roles only; operating steps and product capacity limits are omitted."
  },
  {
    "id": "F08",
    "title": "Basics of sprinkler thermal characteristics",
    "publisher": "National Fire Protection Association",
    "url": "https://www.nfpa.org/news-blogs-and-articles/blogs/2021/06/22/the-basics-of-sprinkler-thermal-characteristics",
    "description": "Explanation of heat-responsive sprinkler characteristics.",
    "scope": "Supports the thermal activation distinction, not a station sprinkler design."
  },
  {
    "id": "F09",
    "title": "Fire pumps",
    "publisher": "Grundfos",
    "url": "https://www.grundfos.com/solutions/learn/research-and-insights/fire-pumps",
    "description": "Water supply, pump drivers and pressure-related fire-pump functions.",
    "scope": "Functional description; no setpoints, sizing, starting or stopping instructions."
  },
  {
    "id": "F10",
    "title": "Battery approaches for emergency lighting systems",
    "publisher": "Eaton",
    "url": "https://www.eaton.com/gb/en-gb/markets/buildings/how-we-drive-building-efficiency-and-safety/safe-evacuation/evacuate/basics-emergency-lighting-systems/testing-and-battery-options-for-emergency-lighting.html",
    "description": "Self-contained and central-battery emergency lighting arrangements.",
    "scope": "Shows alternative architectures; durations and jurisdictional obligations are omitted."
  },
  {
    "id": "F11",
    "title": "Tunnel and metro ventilation",
    "publisher": "FläktGroup",
    "url": "https://www.flaktgroup.com/en/solutions/tunnel-and-metro-ventilation/",
    "description": "Rail tunnel heat removal, powered ventilation and ventilation equipment.",
    "scope": "Rail portions only; road-exhaust assumptions, fan ratings and universal sequences are excluded."
  },
  {
    "id": "F12",
    "title": "Tunnel dampers: components and applications",
    "publisher": "TROX Group",
    "url": "https://www.trox-northamerica.com/downloads/29d5b7d83c086583/tunnel_damper.pdf",
    "description": "Manufacturer brochure covering blades, actuators and independent position indication.",
    "scope": "Physical function only; manufacturer temperature/time ratings are not generalized."
  },
  {
    "id": "F13",
    "title": "ASHRAE Handbook: Enclosed Vehicular Facilities",
    "publisher": "ASHRAE",
    "url": "https://handbook.ashrae.org/Handbooks/A19/IP/A19_Ch16/a19_ch16_ip.aspx",
    "description": "Public technical overview of ventilation, rail stations and smoke-management objectives.",
    "scope": "Conceptual distinctions from a dated handbook chapter; not current code advice or a design calculation."
  },
  {
    "id": "F14",
    "title": "What is a commercial air handler?",
    "publisher": "Trane",
    "url": "https://www.trane.com/commercial/north-america/us/en/about-us/newsroom/glossary/air-handler.html",
    "description": "AHU fans, filters, coils, dampers and building-control relationships.",
    "scope": "Generic equipment mechanics, adapted illustratively to station rooms and passenger spaces."
  },
  {
    "id": "F15",
    "title": "Desigo PXC7 modular automation station: features",
    "publisher": "Siemens",
    "url": "https://sid.siemens.com/r/A6V12957866/19996096395_21457181323__en-US_20031916171",
    "description": "Building controllers, I/O, alarming, trends and multiple automation-network interfaces.",
    "scope": "An example implementation; no universal protocol, controller count or network topology."
  },
  {
    "id": "F16",
    "title": "HVAC sensors and meters",
    "publisher": "Belimo",
    "url": "https://www.belimo.com/us/en_US/products/sensors/",
    "description": "Room, duct and pipe measurements used by building automation.",
    "scope": "Explains measured quantities; no calibration values or control thresholds."
  },
  {
    "id": "F17",
    "title": "Network control for rail electrification",
    "publisher": "Siemens Mobility",
    "url": "https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/electrification/network-control-for-rail-electrification.html",
    "description": "Traction network supervision and local substation control/protection interfaces.",
    "scope": "Separates supervisory presentation from local equipment functions; no operating commands."
  },
  {
    "id": "F18",
    "title": "Functions of a substation with LV metering",
    "publisher": "Schneider Electric, Electrical Installation Guide",
    "url": "https://www.electrical-installation.org/enwiki/Functions_of_a_substation_with_LV_metering",
    "description": "MV/LV transformers, main distribution switchboards and essential-load supply alternatives.",
    "scope": "General building supply principles; no adopted voltage, protection coordination or real station topology."
  },
  {
    "id": "F19",
    "title": "UPS solutions for railway buildings and stations",
    "publisher": "ABB",
    "url": "https://new.abb.com/ups/ups-and-power-conditioning/industries/railway/administrative-buildings-and-stations",
    "description": "Backup power for station controllers, interfaces and other sensitive electronics.",
    "scope": "Does not imply that every station load, fan or traction circuit is UPS-backed."
  },
  {
    "id": "F20",
    "title": "Building partnerships for smart rail success",
    "publisher": "Moxa",
    "url": "https://www.moxa.com/en/spotlight/integrated-solutions/rail/railway-ethernet/index",
    "description": "Rail Ethernet, fiber connectivity, radio backhaul and managed networks.",
    "scope": "Generic network roles; no commercial latency claims, addresses or actual network configuration."
  }
];

export const CONCEPTS = [
  {
    "id": "utility",
    "label": "Incoming AC supply",
    "summary": "Energy enters the substation.",
    "details": [
      "Upstream supply feeds AC switchgear.",
      "The diagram shows one incoming connection."
    ],
    "sources": [
      "P01"
    ]
  },
  {
    "id": "ac-switchgear",
    "label": "AC switchgear",
    "summary": "Distributes incoming AC.",
    "details": [
      "Switchgear connects supply to conversion equipment.",
      "Protection supervises the electrical supply."
    ],
    "sources": [
      "P01"
    ]
  },
  {
    "id": "transformer",
    "label": "Traction transformer",
    "summary": "Changes AC voltage.",
    "details": [
      "The transformer changes the incoming AC voltage before the rectifier.",
      "Magnetic coupling transfers energy between windings; rectification is a separate function."
    ],
    "sources": [
      "P01"
    ]
  },
  {
    "id": "rectifier",
    "label": "Traction rectifier",
    "summary": "Converts AC into DC.",
    "details": [
      "The selected example uses diode rectification.",
      "Grid regeneration requires additional reversible equipment."
    ],
    "sources": [
      "P01"
    ]
  },
  {
    "id": "dc-switchgear",
    "label": "DC switchgear",
    "summary": "Distributes the DC output.",
    "details": [
      "Feeder circuits supply track sections.",
      "Protection separates abnormal circuits."
    ],
    "sources": [
      "P01"
    ]
  },
  {
    "id": "breaker",
    "label": "DC circuit breaker",
    "summary": "Interrupts a protected circuit.",
    "details": [
      "Fault detection initiates interruption.",
      "Trip thresholds are deliberately unspecified."
    ],
    "sources": [
      "P01"
    ]
  },
  {
    "id": "wayside-resistor",
    "label": "Wayside braking resistor",
    "summary": "Turns surplus electrical energy into heat.",
    "details": [
      "During electrical braking, the train can deliver energy back to the DC network. If receptive loads are unavailable, suitably controlled resistors can absorb energy instead.",
      "Resistors may be onboard or trackside. The enclosure and cooling path matter because the removed kinetic energy becomes heat; a resistor is not an energy store."
    ],
    "sources": [
      "P12"
    ],
    "caveat": "The model selects a wayside resistor as one possible receptivity arrangement, not a universal installation."
  },
  {
    "id": "grounding",
    "label": "Protective bonding and return",
    "summary": "Separate safety and energy paths.",
    "details": [
      "Return voltage and stray current need coordination. A voltage-limiting device is one available protection measure.",
      "Earth is not the illustrated normal return. Bonding and return connections must not be treated as interchangeable paths."
    ],
    "sources": [
      "P01"
    ]
  },
  {
    "id": "facility-transformer",
    "label": "Facility supply",
    "summary": "Supports the substation building.",
    "details": [
      "Shown separately from traction conversion.",
      "Lighting and service loads are illustrative."
    ],
    "sources": [],
    "caveat": "A conceptual model element; no actual facility arrangement or supply rating is asserted."
  },
  {
    "id": "disconnect",
    "label": "Section isolation",
    "summary": "Marks an isolation boundary.",
    "details": [
      "Separate it visually from fault interruption.",
      "The scene does not prescribe switching procedures."
    ],
    "sources": [],
    "caveat": "Schematic function only. A real disconnector’s load-breaking capability and interlocks require its design documentation."
  },
  {
    "id": "positive-rail",
    "label": "Positive conductor rail",
    "summary": "Carries the outgoing DC path in this example.",
    "details": [
      "The collector provides a moving electrical contact with the conductor. The drawn polarity identifies circuit connections, not a separate propulsion principle.",
      "This model selects a dedicated outgoing conductor alongside a dedicated return conductor. Their positions are an explanatory layout."
    ],
    "sources": [
      "P11"
    ],
    "caveat": "Conductor arrangements vary across railways; this is not a universal third-rail layout."
  },
  {
    "id": "negative-rail",
    "label": "Dedicated return conductor",
    "summary": "Completes the illustrated DC circuit.",
    "details": [
      "Follow the return from onboard equipment back toward the substation. The return conductor is drawn separately from the wheel-supporting rails.",
      "A return path is part of the circuit. The word “negative” does not mean the conductor is safe to touch."
    ],
    "sources": [],
    "caveat": "This dedicated-return topology is a deliberate teaching choice, not a claim that all DC railways use it."
  },
  {
    "id": "running-rail",
    "label": "Running rail: head, web and foot",
    "summary": "A shaped steel beam carries the wheel contact and passes its load into the track supports.",
    "details": [
      "In a flat-bottom rail, the head provides the running surface, the web connects the section, and the broad foot meets the rail seat and restraints. Commercial profiles have different shapes and section properties.",
      "The rail bridges adjacent supports. A wheel load therefore reaches several support points through bending, rather than dropping only into the sleeper directly beneath it. This is the load-path interpretation used in the model.",
      "Wheel guidance also depends on the wheel and rail profiles together. The running rail is mechanically distinct from a traction conductor or a LIM reaction rail, even where they appear alongside it."
    ],
    "sources": [
      "K11"
    ],
    "caveat": "The stylized section, rail spacing and wheel profile are explanatory geometry, not a selected rail standard or a contact-stress calculation.",
    "related": [
      "bogie",
      "track-rail-pad",
      "track-sleeper",
      "reaction-rail",
      "positive-rail",
      "negative-rail"
    ]
  },
  {
    "id": "reaction-rail",
    "label": "LIM reaction rail",
    "summary": "The track-mounted secondary of the linear motor.",
    "details": [
      "A short-primary arrangement puts the energized primary on the vehicle and the reaction plate along the track. The secondary is not the supply conductor.",
      "In this model the reaction rail sits between the running rails. Its location and dimensions illustrate the coupling, without reproducing a railway design."
    ],
    "sources": [
      "P02"
    ]
  },
  {
    "id": "collector",
    "label": "Current-collection shoe",
    "summary": "Maintains electrical contact while the train moves.",
    "details": [
      "Shoegear couples the vehicle circuit to a conductor rail. Real products support top, bottom or side contact, so the contact face is a design choice.",
      "The model exposes the contact interface. Shoe mounting, deployment and sensing vary with the selected equipment."
    ],
    "sources": [
      "P11"
    ]
  },
  {
    "id": "carbody",
    "label": "Carbody and equipment zones",
    "summary": "Houses people and the vehicle systems.",
    "details": [
      "The cutaway separates the passenger volume, underframe equipment and roof-mounted services. These positions are illustrative.",
      "The vehicle body and bogies form a coupled mechanical system; clearances and mounting arrangements are deliberately not presented as production drawings."
    ],
    "sources": [
      "P10"
    ]
  },
  {
    "id": "bogie",
    "label": "Bogie and wheelsets",
    "summary": "Connect the carbody to the track.",
    "details": [
      "The model groups the wheelsets, frame, suspension and friction-brake hardware so their mechanical relationships can be inspected together.",
      "Bogie design influences vehicle dynamics and ride comfort. A LIM primary can provide thrust while the wheels continue to support and guide the vehicle."
    ],
    "sources": [
      "P10",
      "P02"
    ]
  },
  {
    "id": "traction-inverter",
    "label": "Traction inverter / propulsion converter",
    "summary": "Controls electrical power delivered to the motor.",
    "details": [
      "A traction converter uses controlled power electronics to supply an AC motor. In the selected DC examples, it connects the conductor-rail supply to either the LIM primary or the rotary traction motors.",
      "Its control, thermal management and protection work together. During electrical braking, compatible conversion equipment transfers generated energy back toward the DC supply."
    ],
    "sources": [
      "P04"
    ],
    "caveat": "“PCU” is a broad propulsion-control label, not a promise of identical hardware or naming across manufacturers."
  },
  {
    "id": "lim-primary",
    "label": "LIM primary",
    "summary": "Produces the motor’s travelling magnetic field.",
    "details": [
      "The train-mounted primary carries the energized windings. Magnetic coupling across the air gap induces current in the conducting secondary; their interaction produces longitudinal force.",
      "Direct electromagnetic thrust does not require the wheels to transmit propulsion torque. In this illustrated wheel-supported train, the LIM is not a levitation system."
    ],
    "sources": [
      "P02",
      "P03"
    ]
  },
  {
    "id": "motor-slip",
    "label": "Travelling field, slip and air gap",
    "summary": "Relative motion makes induction possible.",
    "details": [
      "The travelling field and secondary move relative to one another. In an idealized induction model, that relative speed sets the induced-current frequency; synchronous motion gives zero slip.",
      "The air gap participates in the magnetic circuit. Changing gap or relative motion changes the interaction, but this visual model does not calculate a real motor’s force or efficiency."
    ],
    "sources": [
      "P03"
    ],
    "caveat": "Finite-length effects, saturation and thermal limits require a more complete machine model; no quantitative performance is inferred."
  },
  {
    "id": "apu",
    "label": "Auxiliary power converter",
    "summary": "Supplies the train’s supporting electrical systems.",
    "details": [
      "Auxiliary conversion provides suitable power for onboard applications separately from traction-motor conversion. A battery charger may be integrated with the auxiliary converter.",
      "The scene connects this branch to comfort and service equipment to make the power split visible. Actual output voltages, redundancy and load allocations depend on the vehicle."
    ],
    "sources": [
      "P05"
    ]
  },
  {
    "id": "vehicle-battery",
    "label": "Auxiliary battery and charger",
    "summary": "Stores energy for selected low-voltage functions.",
    "details": [
      "The charger and battery form a distinct branch of the illustrative auxiliary supply. This battery is not depicted as the train’s main propulsion energy source.",
      "The loads retained after loss of line supply depend on the vehicle design. No emergency operating duration, capacity or guaranteed HVAC backup is claimed."
    ],
    "sources": [
      "P05"
    ],
    "caveat": "Battery-backed loads are a teaching example; the public auxiliary-converter source establishes optional charging, not a particular emergency power architecture."
  },
  {
    "id": "brakes",
    "label": "Blended braking and friction brakes",
    "summary": "Several brake mechanisms cooperate to slow the train.",
    "details": [
      "Brake control allocates the requested braking effort among available mechanisms. Electrical braking can recover energy; friction braking supplies additional or replacement effort when needed.",
      "Wheel-slide protection monitors axle behaviour and adjusts braking effort when adhesion is limited. Braking performance depends on equipment, operating conditions and the selected control strategy."
    ],
    "sources": [
      "P06"
    ],
    "caveat": "Regenerative capability and brake blending vary across designs and operating conditions."
  },
  {
    "id": "parking-brake",
    "label": "Parking brake",
    "summary": "Holds a stationary vehicle.",
    "details": [
      "Parking is a distinct function from continuous electrical braking. A spring-applied brake is one available implementation.",
      "The model shows a generic parking function without specifying release pressure, gradients, holding force or operating procedures."
    ],
    "sources": [
      "P06"
    ]
  },
  {
    "id": "hvac",
    "label": "Heating, ventilation and air conditioning",
    "summary": "Conditions the passenger environment.",
    "details": [
      "HVAC combines heating and cooling with managed airflow and filtration. Sensors and controllers adjust operation as passenger and environmental conditions change.",
      "Roof or underfloor installations are possible. The cutaway separates the air-conditioning unit and airflow from the electrical feed, showing that power conversion and cabin conditioning perform different jobs."
    ],
    "sources": [
      "P08"
    ]
  },
  {
    "id": "compressor",
    "label": "Compressor and air treatment",
    "summary": "Creates a usable compressed-air supply.",
    "details": [
      "A rail air-supply installation can combine a compressor, dryer and monitoring. Drying and cleaning help make the air suitable for downstream equipment.",
      "Pneumatic friction-brake actuation and suspension are possible users. The model shows an air-service branch separately from electrical wiring so the two energy paths remain understandable."
    ],
    "sources": [
      "P07"
    ],
    "caveat": "Pneumatic actuation is a selected example; railway brake and suspension architectures vary."
  },
  {
    "id": "doors",
    "label": "Passenger doors and access systems",
    "summary": "Manage the interface between vehicle and platform.",
    "details": [
      "Door drives open and close the entrances. Obstacle detection and optional access aids, such as steps or gap bridges, support passenger access.",
      "The model places doors in the carbody and keeps their control function distinct from their mechanical motion. Exact locking, proving and departure logic is not reconstructed from a fleet."
    ],
    "sources": [
      "P09"
    ]
  },
  {
    "id": "regeneration",
    "label": "Where braking energy goes",
    "summary": "Energy needs a destination.",
    "details": [
      "Electrical braking converts some motion into electrical energy. A receptive network can use it elsewhere; otherwise suitable resistors can dissipate it as heat.",
      "Compare a receptive train with wayside resistor dissipation. The animation shows energy destinations, not a recovery percentage or stopping-distance prediction."
    ],
    "sources": [
      "P12"
    ],
    "caveat": "The selected diode rectifier cannot send energy backward into the AC utility. Grid regeneration needs suitable reversible equipment."
  },
  {
    "id": "substation-control",
    "label": "Substation monitoring and control",
    "summary": "Connects electrical equipment to supervision.",
    "details": [
      "Measurements and equipment states support network supervision.",
      "SCADA provides an operator-facing view of the traction supply."
    ],
    "sources": [
      "P01"
    ]
  },
  {
    "id": "control-battery",
    "label": "Illustrative station control battery",
    "summary": "A separate stored-energy branch for the model.",
    "details": [
      "This model includes a station auxiliary battery to distinguish control power from traction power.",
      "Its actual loads, charger arrangement, capacity and endurance are deliberately unspecified."
    ],
    "sources": [],
    "caveat": "A conceptual teaching choice. No particular substation auxiliary-power architecture is specified."
  },
  {
    "id": "atp",
    "label": "Automatic train protection · ATP",
    "summary": "Supervises movement limits and can demand braking.",
    "details": [
      "ATP checks whether train movement remains inside its permitted envelope. ETCS provides one public example: onboard supervision compares position and speed with applicable limits, predicts the approach to a target, and can command brake intervention.",
      "The protection computer issues a command; the vehicle braking equipment produces the physical force. In the teaching model, increasing an ATO driving request cannot raise the protection limit."
    ],
    "sources": [
      "S07"
    ],
    "caveat": "Specific supervision functions, margins and intervention rules depend on the system.",
    "related": [
      "ato",
      "braking-curve",
      "movement-authority",
      "brake-control"
    ]
  },
  {
    "id": "ato",
    "label": "Automatic train operation · ATO",
    "summary": "Drives toward operational targets within protection constraints.",
    "details": [
      "ATO calculates driving actions such as acceleration, coasting and braking from the journey target and the information available to it. In the published ATO-over-ETCS arrangement, timetable information arrives from an ATO trackside function, while onboard ATO interfaces with traction and brakes.",
      "ETCS retains the protection responsibility and determines when ATO may operate. Automation grade also describes who performs tasks: automatic driving can coexist with a driver in the cab. Driverless operation brings additional operational and supervision requirements; selecting ATO alone does not establish them."
    ],
    "sources": [
      "S08"
    ],
    "caveat": "The example explains ATO over ETCS; metro implementations allocate interfaces differently.",
    "related": [
      "atp",
      "ats",
      "train-control",
      "etcs-onboard"
    ]
  },
  {
    "id": "ats",
    "label": "Automatic train supervision · ATS",
    "summary": "Coordinates the service across a line or network.",
    "details": [
      "ATS gives controllers a network view and supports traffic regulation, timetable recovery, incident handling and service changes. A regulation decision might hold a train, adjust a departure or request a different service pattern. These are operating objectives that still pass through the applicable route and protection functions.",
      "A control centre can also display traction-power SCADA, communications and security systems. Integration in one room or screen does not make those functions identical. Alstom publishes separate modules for these responsibilities, alongside its traffic-supervision and regulation tools."
    ],
    "sources": [
      "S09"
    ],
    "caveat": "Control-centre architecture and the scope of ATS vary by project.",
    "related": [
      "ato",
      "interlocking",
      "zone-controller",
      "train-network"
    ]
  },
  {
    "id": "train-control",
    "label": "Onboard train-control computer",
    "summary": "Connects train information, protection and driving functions.",
    "details": [
      "An onboard control function reports train position and receives information governing movement. Mitsubishi Electric describes an arrangement exchanging these messages with a wayside zone controller, enabling automatic driving within the applicable speed restriction.",
      "Our cabinet view separates localization, protection and driving responsibilities. Lines to the traction and brake systems represent commands and feedback, not the high-power path that supplies a motor."
    ],
    "sources": [
      "S06"
    ],
    "caveat": "Functional boxes do not specify the number of computers or their physical allocation.",
    "related": [
      "atp",
      "ato",
      "odometry",
      "tcms",
      "train-radio",
      "brake-control"
    ]
  },
  {
    "id": "tcms",
    "label": "Train control and management system · TCMS",
    "summary": "Coordinates vehicle equipment and reports its condition.",
    "details": [
      "A TCMS connects commands, status and diagnostics across subsystems such as traction, braking, doors, lighting and HVAC.",
      "Follow a driving request to the propulsion controller, then follow the status response back. This is a vehicle-management role; the diagram gives movement permission its own clearly labelled function."
    ],
    "sources": [
      "T04"
    ],
    "caveat": "Hardware integration and the TCMS boundary are supplier- and project-dependent."
  },
  {
    "id": "train-radio",
    "label": "Train-to-wayside radio",
    "summary": "Carries control information across the air gap.",
    "details": [
      "Radio carries reports and responses between onboard equipment and the wayside communication network. The bearer and the signalling application are different layers. Hitachi’s 2024 SelTrac announcement describes Wi-Fi-era arrangements and 5G options using public or private networks.",
      "The model separates communication status from authority and power. Holding message updates does not make the train’s sensors disappear, nor does receiving a packet directly energize traction."
    ],
    "sources": [
      "S01"
    ],
    "caveat": "Radio choice and loss responses are project-specific; no universal timeout is implied.",
    "related": [
      "radio-antenna",
      "wayside-radio",
      "cbtc",
      "gsm-r-frmcs",
      "passenger-info"
    ]
  },
  {
    "id": "radio-antenna",
    "label": "Roof antenna and radio unit",
    "summary": "Connect the onboard data network to a wireless path.",
    "details": [
      "The antenna provides the radio-frequency interface; the radio connects to onboard equipment.",
      "Train-control data, operational voice and passenger connectivity need not share one radio. Their roles differ."
    ],
    "sources": [
      "T05"
    ],
    "caveat": "Antenna location and service allocation are illustrative."
  },
  {
    "id": "wayside-radio",
    "label": "Wayside radio and data network",
    "summary": "Carry information between a moving train and fixed systems.",
    "details": [
      "Wayside radios connect trains to the fixed network and its control equipment.",
      "An antenna or network switch carries messages; the control function interprets permission. Highlight transport and decision-making separately."
    ],
    "sources": [
      "T05"
    ],
    "caveat": "Logical path only; installation varies."
  },
  {
    "id": "zone-controller",
    "label": "Wayside zone controller",
    "summary": "Uses train reports to support control within an area.",
    "details": [
      "In the example architecture, the zone controller receives train position reports and returns movement-related control information. The published Mitsubishi Electric arrangement addresses separation, speed and route control through exchanges between onboard and wayside equipment.",
      "The model shows a report arriving before a response is delivered. A message contains information, not traction energy. Cabinet location, controller boundaries and the division of functions are implementation choices."
    ],
    "sources": [
      "S06"
    ],
    "caveat": "A zone-controller box is one architecture, not a universal CBTC requirement.",
    "related": [
      "cbtc",
      "train-control",
      "interlocking",
      "movement-authority",
      "wayside-radio"
    ]
  },
  {
    "id": "balise",
    "label": "Balise and onboard reader",
    "summary": "Transfers localized track information as the train passes.",
    "details": [
      "A Eurobalise is a track-mounted transponder energized by a passing train’s reader antenna. It provides a data telegram containing fixed or switchable information, such as a location reference or infrastructure data. The onboard balise transmission module processes the received message.",
      "The train moves beyond the brief contact region and continues onboard supervision. A balise therefore is not a continuous radio access point, a wheel counter or a traction power source."
    ],
    "sources": [
      "S16"
    ],
    "caveat": "Eurobalise is the ETCS example; metro transponder functions and formats differ.",
    "related": [
      "leu",
      "etcs-level-1",
      "etcs-level-2",
      "odometry"
    ]
  },
  {
    "id": "tachometer",
    "label": "Wheel-speed sensor · tachometer",
    "summary": "Measures wheel rotation for motion estimation.",
    "details": [
      "Wheel rotation estimates speed and distance using a wheel-size assumption.",
      "A sliding wheel can misrepresent vehicle speed. Compare its estimate with independent information."
    ],
    "sources": [
      "T07"
    ],
    "caveat": "This wheel-supported LIM example demonstrates friction-braking wheel slide; propulsion force is developed by the linear motor."
  },
  {
    "id": "accelerometer",
    "label": "Accelerometer and inertial measurement unit",
    "summary": "Add an independent view of vehicle motion.",
    "details": [
      "Acceleration and rotational measurements complement wheel-based odometry.",
      "Integration accumulates error. Combining complementary measurements and position references can constrain drift; localization still retains uncertainty."
    ],
    "sources": [
      "T06",
      "T07"
    ],
    "caveat": "Sensor selection and estimation algorithms vary."
  },
  {
    "id": "door-control",
    "label": "Door controller and departure interlock",
    "summary": "Relate door condition to permission to depart.",
    "details": [
      "Door sensing can detect obstructions and trapped objects. Some anti-drag systems prevent departure even after the door has apparently closed.",
      "In this teaching model, departure waits for closed-and-locked proof and a clear obstruction condition. A passenger display showing 'ready' is not the door safety check."
    ],
    "sources": [
      "T09"
    ],
    "caveat": "The selected departure rule illustrates a principle; actual interlocks are system-specific."
  },
  {
    "id": "passenger-info",
    "label": "Passenger information system · PIS",
    "summary": "Turns service information into useful passenger guidance.",
    "details": [
      "Displays can show the next station, route, connections and service changes. Content may update from vehicle location and operational information.",
      "Trace a station announcement to the display and speaker. Passenger-facing information is distinct from the train-control message that governs movement."
    ],
    "sources": [
      "T10"
    ],
    "caveat": "Content sources and update methods depend on the implementation."
  },
  {
    "id": "pa-intercom",
    "label": "Public address and passenger intercom",
    "summary": "Support announcements and two-way requests for assistance.",
    "details": [
      "Public address distributes automatic or live announcements. An intercom gives passengers a voice connection to the responsible staff.",
      "These are different audio paths: one-to-many information and a two-way conversation. An intercom call is not universally an automatic braking command."
    ],
    "sources": [
      "T10"
    ],
    "caveat": "Call routing and emergency responses are configured for each railway."
  },
  {
    "id": "cctv",
    "label": "Onboard video and CCTV",
    "summary": "Help authorized staff understand conditions onboard.",
    "details": [
      "Cameras and onboard processing can support situational awareness and operational monitoring. Information may be presented to crew or wayside staff.",
      "The video path is distinct from movement permission. Access and retention are deliberate system-design choices."
    ],
    "sources": [
      "T11"
    ],
    "caveat": "Video functions, access rights and privacy requirements depend on the deployment."
  },
  {
    "id": "train-network",
    "label": "Onboard communication networks",
    "summary": "Connect many functions while preserving their different responsibilities.",
    "details": [
      "Train control, signalling, passenger information, video and passenger connectivity can use separate networks. Some architectures share infrastructure with engineered traffic separation and timing controls.",
      "Colours distinguish logical services. Shared cabling does not make a passenger device part of the safety-control function, and separate colours do not imply separate physical cables."
    ],
    "sources": [
      "T12"
    ],
    "caveat": "The diagram describes function and information flow, not a network configuration."
  },
  {
    "id": "brake-control",
    "label": "Brake controller and wheel-slide protection",
    "summary": "Translate braking demand into coordinated braking action.",
    "details": [
      "Brake control coordinates available brake systems and can account for vehicle load. Wheel-slide protection is one of its supporting functions.",
      "A braking command and the resulting deceleration are different quantities. Sensors provide feedback; a command alone is not proof that the train has slowed."
    ],
    "sources": [
      "T08"
    ],
    "caveat": "Brake blending, assurance and emergency arrangements are system-specific."
  },
  {
    "id": "track-ballasted",
    "label": "Ballasted track",
    "summary": "Rails and sleepers sit in a granular support bed, forming a layered mechanical system.",
    "details": [
      "Ballasted track combines running rails, their fastenings, sleepers and a bed of stone. The ballast supports the sleepers and helps preserve the track's geometry.",
      "The model follows the load through this assembly: wheel to rail, rail seat to sleeper, then through the stone bed into the prepared foundation. Each layer has a different role; ballast is not a replacement for the fastening that holds the rail.",
      "A cutaway makes the distinction visible: the rail is restrained locally at repeated seats, while the granular bed supports and surrounds the sleeper."
    ],
    "sources": [
      "K01"
    ],
    "caveat": "Layer depths, sleeper spacing and ballast shoulders are illustrative. This comparison does not select a track design for a particular railway.",
    "related": [
      "track-ballast",
      "track-subballast",
      "track-formation",
      "track-sleeper",
      "track-slab",
      "track-embedded"
    ]
  },
  {
    "id": "track-ballast",
    "label": "Ballast: support and drainage",
    "summary": "The stone bed distributes load, restrains sleepers and provides connected spaces for drainage.",
    "details": [
      "Ballast transfers sleeper loads through contacts between particles. Material around the sleeper also contributes lateral restraint, so the bed's function extends beyond vertical cushioning.",
      "The spaces between particles provide drainage paths. Research on fouled ballast shows that fine material can fill these spaces, retain water and reduce the bed's ability to pass water.",
      "Load transmission and drainage therefore use the same physical layer in different ways: forces travel through the particle contacts, while water travels through the connected voids. The model separates these two paths visually."
    ],
    "sources": [
      "K03"
    ],
    "caveat": "Particle size, fouling level and water animation are qualitative; the scene does not predict drainage capacity or track settlement.",
    "related": [
      "track-ballasted",
      "track-sleeper",
      "track-subballast",
      "track-formation"
    ]
  },
  {
    "id": "track-subballast",
    "label": "Subballast and separation layer",
    "summary": "An intermediate layer separates ballast from the foundation and spreads load.",
    "details": [
      "Subballast sits between ballast and subgrade. Its functions include distributing load, limiting the mixing of adjacent materials and directing water toward drainage.",
      "Its role differs from the open stone bed above. The model uses a finer layer and lateral drainage path to make that distinction visible."
    ],
    "sources": [
      "K02"
    ],
    "caveat": "Materials and drainage arrangements vary; the historical reference is not a current design specification.",
    "related": [
      "track-ballast",
      "track-formation",
      "track-ballasted"
    ]
  },
  {
    "id": "track-formation",
    "label": "Formation and subgrade",
    "summary": "The prepared foundation forms the largely hidden end of the track's load path.",
    "details": [
      "The subgrade is the soil or other foundation material beneath the track layers. Its support and drainage behavior affect the structure built above it.",
      "In this model, formation means the prepared upper foundation surface. A simplified soft-support animation demonstrates why sound rails alone cannot ensure stable geometry when their underlying support deforms."
    ],
    "sources": [
      "K02"
    ],
    "caveat": "Terminology varies. Deformation is illustrative, without a soil or settlement calculation.",
    "related": [
      "track-subballast",
      "track-ballasted",
      "track-slab"
    ]
  },
  {
    "id": "track-sleeper",
    "label": "Sleeper or tie",
    "summary": "A sleeper carries repeated rail seats, maintains their relationship and spreads forces into the support below.",
    "details": [
      "Sleepers anchor the rails through their fastenings and transfer forces to the track substructure. Their geometry and materials are selected for the loading and environment.",
      "The concrete sleeper shown here has two rail seats. These seats and their fastenings keep the rails in the intended lateral relationship while the sleeper distributes their loads over a larger supporting area.",
      "An optional under-sleeper pad lies beneath the sleeper and changes its contact with ballast. It is a different component from the rail pad directly beneath a rail foot."
    ],
    "sources": [
      "K04"
    ],
    "caveat": "Concrete is one sleeper material, not a universal choice. The model does not reproduce prestressing details or a structural reinforcement design.",
    "related": [
      "running-rail",
      "track-rail-pad",
      "track-rail-clip",
      "track-ballast",
      "track-slab"
    ]
  },
  {
    "id": "track-rail-pad",
    "label": "Rail pad and resilient layer",
    "summary": "An elastic layer between rail and support changes how wheel forces and vibration enter the track structure.",
    "details": [
      "A rail pad sits beneath the rail foot at the support. In resilient fastenings, elastomeric pads allow controlled deflection and influence how vertical forces reach the supporting structure.",
      "Changing the pad changes the support's force–deflection behavior. It can also change vibration transmission; the rail, fasteners and structure still act as a connected system.",
      "The model exaggerates a small pad compression so its role becomes visible. It does not treat stiffness and damping as the same quantity or imply that the softest pad is automatically the best choice."
    ],
    "sources": [
      "K06"
    ],
    "caveat": "No pad stiffness, damping coefficient or predicted noise reduction is assigned. The animation is qualitative.",
    "related": [
      "running-rail",
      "track-sleeper",
      "track-baseplate",
      "track-direct-fixation"
    ]
  },
  {
    "id": "track-rail-clip",
    "label": "Elastic rail clip and shoulder",
    "summary": "A spring element presses the rail into its seat while its anchor transfers restraint to the support.",
    "details": [
      "An elastic rail fastening combines a spring clip with anchorage and contact components. The clip's elastic deflection produces a retaining force on the rail foot.",
      "In the selected example, a shoulder anchors the clip, an insulator separates a contact interface, and a pad supports the rail. These components cooperate to restrain the rail while permitting the fastening's intended elastic movement.",
      "The clip is therefore more than a decorative curved bracket. Its shape and constrained contact points make it a spring, while the shoulder gives that spring a mechanical reaction point."
    ],
    "sources": [
      "K05"
    ],
    "caveat": "Clip shapes, anchors and assembly arrangements differ. This is a functional model, without tightening, insertion or inspection instructions.",
    "related": [
      "track-rail-pad",
      "track-insulator",
      "track-baseplate",
      "track-sleeper"
    ]
  },
  {
    "id": "track-insulator",
    "label": "Rail-seat insulator",
    "summary": "A small interface component can contribute both electrical separation and lateral positioning.",
    "details": [
      "Rail fastenings can include insulating components at restraint interfaces. These separate conducting parts while transmitting mechanical contact forces.",
      "Insulator geometry also matters mechanically: in some fastening families, changing the side component changes the rail's lateral position. The model shows that such a piece is part of the rail-seat geometry, not simply a colored electrical symbol."
    ],
    "sources": [
      "K07"
    ],
    "caveat": "One insulating piece does not establish whole-track insulation or define traction return.",
    "related": [
      "track-rail-clip",
      "track-baseplate",
      "track-direct-fixation",
      "running-rail"
    ]
  },
  {
    "id": "track-baseplate",
    "label": "Baseplate and rail seat",
    "summary": "A plate organizes the rail support, restraints and attachment to the structure beneath it.",
    "details": [
      "A baseplate can carry the rail pad and fastening components on timber, composite or concrete supports. Different plate arrangements connect the same basic rail-seat functions to different foundations.",
      "Some assemblies add resilience below the plate as well as below the rail. Separating those two levels explains why a fastening can have several layers without each layer being another rail pad."
    ],
    "sources": [
      "K07"
    ],
    "caveat": "Plate count, resilience and attachment vary; this stack is illustrative.",
    "related": [
      "track-rail-pad",
      "track-rail-clip",
      "track-insulator",
      "track-direct-fixation",
      "track-plinth"
    ]
  },
  {
    "id": "track-direct-fixation",
    "label": "Direct-fixation track",
    "summary": "Individual rail supports attach to a structural base while retaining engineered resilience and restraint.",
    "details": [
      "Direct fixation attaches rail-support assemblies to a slab or other structural support without an intervening ballast bed. The assembly can include a baseplate, anchors, resilient intermediate layers and electrical insulation.",
      "The word direct describes the support arrangement. It does not mean that the rail must be rigidly fastened against bare concrete: the rail and plate can still deflect through their resilient layers.",
      "In this model, wheel forces pass through the rail seat and fastening into the concrete support. The distinct mechanical and electrical interfaces remain visible in the cutaway."
    ],
    "sources": [
      "K08"
    ],
    "caveat": "Anchor layout, embedment and layer thickness are schematic. The scene is not a fastening selection or an anchorage design.",
    "related": [
      "track-baseplate",
      "track-rail-pad",
      "track-insulator",
      "track-slab",
      "track-plinth"
    ]
  },
  {
    "id": "track-slab",
    "label": "Slab track",
    "summary": "A concrete structural layer supports the rail system in place of the conventional ballast bed.",
    "details": [
      "Slab track is a family of constructions rather than one universal stack. One established approach combines precast rail-support blocks with a cast-in-place concrete track slab.",
      "The structural slab and the rail support are different levels of the assembly. Concrete provides the supporting structure; the selected rail fastening supplies the local restraint and resilience.",
      "The comparison model offers separate construction presets: embedded support blocks in a slab, or individual direct-fixation seats on concrete. Showing them separately avoids presenting components from different systems as one mandatory design."
    ],
    "sources": [
      "K09"
    ],
    "caveat": "Slab reinforcement, joints, foundations and durability provisions require project-specific design. No maintenance-free claim is made.",
    "related": [
      "track-direct-fixation",
      "track-plinth",
      "track-sleeper",
      "track-formation",
      "track-ballasted"
    ]
  },
  {
    "id": "track-plinth",
    "label": "Concrete plinth",
    "summary": "A raised concrete support places direct fasteners above the underlying slab or deck.",
    "details": [
      "A plinth can take the form of a longitudinal concrete block supporting direct rail fasteners. It transfers forces into the underlying structure and establishes a support level above it.",
      "The rail's final position follows the combined geometry of the structural support, plinth and fastening assembly. The plinth is therefore distinct from the small baseplate immediately below the rail seat.",
      "In the section model, the plinth connects a close-up fastening assembly to the much larger guideway deck. This makes the change in structural scale visible without adopting a real installation's dimensions."
    ],
    "sources": [
      "K20"
    ],
    "caveat": "Plinth form and attachment depend on the structure and track design. No tolerances, repair method or construction sequence is provided.",
    "related": [
      "track-direct-fixation",
      "track-baseplate",
      "track-slab"
    ]
  },
  {
    "id": "track-embedded",
    "label": "Embedded rail",
    "summary": "A rail can receive continuous elastic support inside a channel rather than repeated exposed rail seats.",
    "details": [
      "Embedded systems can surround the rail with resilient profiles or compounds that provide continuous vertical and lateral support. This differs from a rail held at widely separated sleeper seats.",
      "The surrounding elastic system can also contribute vibration isolation and electrical separation. Embedded construction is therefore more than placing bare steel directly in concrete.",
      "The street-context model removes a slice of paving to reveal the rail, resilient surround and supporting channel. The running surface and the wheel-flange path remain open; the exact exposed profile depends on the selected construction."
    ],
    "sources": [
      "K10"
    ],
    "caveat": "The street scene is a support-system comparison, not an exposed conductor-rail or LIM street-running design.",
    "related": [
      "running-rail",
      "track-ballasted",
      "track-slab",
      "track-insulator"
    ]
  },
  {
    "id": "track-turnout",
    "label": "Turnout: one track to two routes",
    "summary": "A turnout combines a movable switch, connecting rails and a crossing into one route-changing assembly.",
    "details": [
      "The switch selects the entry path; closure rails connect that region to the crossing, or frog, where the rail paths intersect. These are distinct parts of the complete turnout.",
      "The model follows a wheelset along either route. Route selection changes the switch geometry at the entry; it does not rotate every rail or move the fixed frog."
    ],
    "sources": [
      "K12"
    ],
    "caveat": "Geometry is illustrative; no permitted speed or route authorization is implied.",
    "related": [
      "track-stock-rail",
      "track-switch-rail",
      "track-closure-rail",
      "track-frog",
      "track-check-rail",
      "track-point-machine"
    ]
  },
  {
    "id": "track-stock-rail",
    "label": "Stock rail",
    "summary": "The fixed rail provides the mating surface beside a movable switch rail.",
    "details": [
      "At a switch, the stock rail and the tapered switch rail have coordinated contact geometry. Their relationship guides the wheel through the transition into the selected path.",
      "In this model the stock rail stays fixed. A closing blade approaches its mating face, making the distinction between the stationary rail and the moving route-selection component explicit."
    ],
    "sources": [
      "K13"
    ],
    "caveat": "Simplified mating profiles are not a manufacturer's geometry or machining drawing.",
    "related": [
      "track-switch-rail",
      "track-turnout",
      "running-rail"
    ]
  },
  {
    "id": "track-switch-rail",
    "label": "Switch rail or blade",
    "summary": "A tapered movable rail changes which continuous wheel path is available through the switch.",
    "details": [
      "A switch rail narrows toward its tip so its contact geometry can meet the stock rail and guide the wheel onto the chosen path.",
      "The selected model uses flexible blades: one closes toward a stock rail as the other opens away. The animation emphasizes the changing contact relationship rather than treating the complete rail as a short rigid door hinge."
    ],
    "sources": [
      "K13"
    ],
    "caveat": "Flexible blades are one example; actual movement and locking architectures differ.",
    "related": [
      "track-stock-rail",
      "track-stretcher",
      "track-point-machine",
      "track-point-detection",
      "track-closure-rail"
    ]
  },
  {
    "id": "track-closure-rail",
    "label": "Closure rail",
    "summary": "Connecting rails carry the running paths from the switch region toward the crossing.",
    "details": [
      "Closure rails join the switch and frog within the turnout. They complete the connecting geometry between the route-selection region and the crossing.",
      "In the model these rails remain fixed while the blades move. Their curvature and alignment make the selected wheel path continuous; they are not additional switch blades simply because they lie inside the turnout."
    ],
    "sources": [
      "K12"
    ],
    "caveat": "Joins and curvature are schematic, without fabrication dimensions.",
    "related": [
      "track-turnout",
      "track-switch-rail",
      "track-frog",
      "running-rail"
    ]
  },
  {
    "id": "track-frog",
    "label": "Crossing or frog",
    "summary": "A crossing lets one rail path pass through another while leaving space for wheel flanges.",
    "details": [
      "A conventional fixed crossing includes a pointed vee, or nose, and wing rails around it. Flangeways provide passages through the intersecting rail geometry.",
      "The wheel must pass from one supporting running surface to the next near this interruption. The model makes the nose, wing rails and flange passages visible instead of hiding them beneath a solid X-shaped block.",
      "This is a fixed, tread-bearing example. Other crossing arrangements change the moving elements or the way the wheel is supported, so the same contact animation should not be applied to every frog type."
    ],
    "sources": [
      "K14"
    ],
    "caveat": "Flangeway dimensions and wheel-contact transitions are schematic. The scene does not calculate impact loads or wear.",
    "related": [
      "track-check-rail",
      "track-closure-rail",
      "track-turnout",
      "track-diamond-crossing",
      "bogie"
    ]
  },
  {
    "id": "track-check-rail",
    "label": "Check rail or crossing guard rail",
    "summary": "A guide beside the opposite running rail helps position the wheelset as the other wheel passes the frog.",
    "details": [
      "A conventional crossing guard rail lies on the gauge side of the running rail opposite the frog. Its guiding action helps keep the wheelset aligned and protects the crossing nose.",
      "The key relationship spans the axle: guiding one wheel helps position the wheel at the crossing on the other side. A single-wheel animation would hide this relationship.",
      "The illustrated guide works against the inner back face of the wheel when contact is needed. It is not an extra normal tread-support rail, an electrical conductor or a LIM reaction rail."
    ],
    "sources": [
      "K15"
    ],
    "caveat": "Check-rail and guard-rail terminology varies. Derailment-containment rails elsewhere on the railway can serve a different purpose.",
    "related": [
      "track-frog",
      "bogie",
      "running-rail",
      "track-turnout"
    ]
  },
  {
    "id": "track-stretcher",
    "label": "Stretcher bar and blade linkage",
    "summary": "A mechanical link coordinates the relationship between the two switch rails.",
    "details": [
      "A stretcher bar connects switch rails so their positions remain related: one side can be closed while the other is open. The assembly includes the bar and its connecting parts.",
      "Some arrangements include electrical insulation in the connection. That electrical separation does not remove the mechanical job of transmitting movement and maintaining the intended blade relationship.",
      "In the model the linkage is distinct from a sleeper, which supports the rails, and from a detector, which reports their position. Linking, supporting and sensing are different functions."
    ],
    "sources": [
      "K16"
    ],
    "caveat": "Bar count, attachment positions and joint construction are illustrative; the cited glossary supplies terminology rather than a design to reproduce.",
    "related": [
      "track-switch-rail",
      "track-point-machine",
      "track-point-detection",
      "track-sleeper"
    ]
  },
  {
    "id": "track-point-machine",
    "label": "Point machine and lock",
    "summary": "A point-operating system moves the switch rails and provides the required locking function.",
    "details": [
      "Point systems combine a drive with a locking arrangement; detection may be integrated or separate. Movement, retention and position reporting remain distinct functions.",
      "The model uses a generic electromechanical example: a motor and transmission move a drive rod linked to the blades. A separate lock indicator explains why reaching a position and securing it are not the same action."
    ],
    "sources": [
      "K17"
    ],
    "caveat": "The cutaway is original illustrative geometry, without operating instructions.",
    "related": [
      "track-switch-rail",
      "track-stretcher",
      "track-point-detection",
      "train-control"
    ]
  },
  {
    "id": "track-point-detection",
    "label": "Point-position detection",
    "summary": "Feedback reports the physical switch state rather than merely repeating the requested route.",
    "details": [
      "Point detectors check switch-rail positions and can form part of the locking and proving arrangement. Their task differs from the drive that moves the rails.",
      "The teaching model separates a requested route from confirmed position. A command or a stopped motor alone is not treated as proof that the blades and locking arrangement have reached the required state."
    ],
    "sources": [
      "K17"
    ],
    "caveat": "This functional explanation supplies no signalling circuit, bypass or recovery sequence.",
    "related": [
      "track-point-machine",
      "track-switch-rail",
      "track-stretcher",
      "train-control",
      "atp"
    ]
  },
  {
    "id": "track-crossover",
    "label": "Crossover",
    "summary": "Two connected turnouts allow a train to transfer between parallel tracks.",
    "details": [
      "A crossover consists of a pair of turnouts joined between parallel tracks. The connection provides a route from one track to the other.",
      "The model expands the single-turnout view to show both ends of that connecting route. A wheelset must follow compatible geometry through both turnouts, not merely cross a colored line between the tracks.",
      "This differs from a diamond crossing: a plain diamond lets two alignments intersect but does not, by itself, provide a transfer between them."
    ],
    "sources": [
      "K18"
    ],
    "caveat": "The layout is schematic. It does not state a railway's permitted direction of travel, operating rules or signalling authorization.",
    "related": [
      "track-turnout",
      "track-diamond-crossing",
      "track-point-detection"
    ]
  },
  {
    "id": "track-diamond-crossing",
    "label": "Diamond crossing",
    "summary": "Two tracks intersect at the same level while each continues along its own alignment.",
    "details": [
      "A diamond places the rail intersections of two crossing tracks within one special-trackwork assembly. In a plain fixed diamond, the geometry does not select a transfer between the two alignments.",
      "The wheel-support details matter at each intersection. Crossing products include different support arrangements, including flange-bearing alternatives, so there is no single contact animation that accurately describes every diamond.",
      "The baseline model is a schematic fixed, tread-bearing example. It exposes the crossing gaps and guidance features while keeping the two through routes distinct."
    ],
    "sources": [
      "K19"
    ],
    "caveat": "The example is not a turnout, a road level crossing or a universal diamond design. No crossing angle or load capacity is specified.",
    "related": [
      "track-frog",
      "track-check-rail",
      "track-crossover",
      "running-rail"
    ]
  },
  {
    "id": "cbtc",
    "label": "Communications-based train control · CBTC",
    "summary": "Uses frequent train information to support movement control.",
    "details": [
      "A contemporary radio CBTC arrangement combines onboard localization, train-to-wayside communication and control functions that supervise movements. The useful information is the train state and movement permission carried by the messages; the radio link is the transport mechanism.",
      "CBTC is a family of architectures. Alstom explicitly describes moving-block and optimized fixed-block approaches, different automation grades and newer train-centric allocations. This site uses a wayside-controller example to make the responsibilities visible, then lets you compare alternatives without implying that every installation uses the same boxes."
    ],
    "sources": [
      "S05"
    ],
    "caveat": "CBTC is neither a propulsion type nor a synonym for unattended operation.",
    "related": [
      "train-control",
      "zone-controller",
      "moving-block",
      "fixed-block",
      "seltrac",
      "train-radio"
    ]
  },
  {
    "id": "movement-authority",
    "label": "Movement authority",
    "summary": "Defines permission to move within stated limits.",
    "details": [
      "A movement authority permits a train to proceed to a specified location subject to infrastructure constraints. It must be interpreted with the applicable speed and track information. In ETCS, an end of authority is a location associated with a zero target speed.",
      "The teaching display uses an endpoint and a permitted-speed ribbon. A driving request cannot extend either one. Authority, actual train position and the requested timetable are therefore three separate objects."
    ],
    "sources": [
      "S20"
    ],
    "caveat": "The ribbon is conceptual and does not reproduce a protocol or certified calculation.",
    "related": [
      "atp",
      "interlocking",
      "rbc",
      "zone-controller",
      "braking-curve"
    ]
  },
  {
    "id": "interlocking",
    "label": "Interlocking",
    "summary": "Checks and secures compatible routes through the railway.",
    "details": [
      "An interlocking evaluates the information needed before a route can be used: track-section status, point position and the required signalling conditions. It coordinates points and signals so a route request becomes a controlled movement rather than merely a command to move switch blades.",
      "Electronic interlockings exchange commands and indications with field equipment, sometimes through object controllers. The model separates a requested route, a proved route and a released route. A missing point indication or uncertain section state leaves the route unproved in this example."
    ],
    "sources": [
      "S10"
    ],
    "caveat": "Route locking and release rules are project-specific; the sequence is illustrative.",
    "related": [
      "point-machine",
      "train-detection",
      "lineside-signal",
      "movement-authority",
      "rbc"
    ]
  },
  {
    "id": "point-machine",
    "label": "Point machine, lock and detector",
    "summary": "Moves switch blades and reports the resulting condition.",
    "details": [
      "A point operating system changes the route through a turnout. Its drive moves the switch blades, locking equipment restrains the required position, and detection checks the resulting blade or lock condition. Siemens publishes arrangements with separate locks, detector rods and end-position detectors.",
      "These functions may occupy different housings or be combined. An animation of a moving rod only demonstrates actuation. The route model should wait for a separate proved indication before showing the switch as available for a train movement."
    ],
    "sources": [
      "S11"
    ],
    "caveat": "The geometry is a generic teaching arrangement, not an installation or adjustment guide.",
    "related": [
      "interlocking",
      "train-detection",
      "lineside-signal"
    ]
  },
  {
    "id": "train-detection",
    "label": "Track-section detection",
    "summary": "Determines whether a defined section can be treated as clear.",
    "details": [
      "A section detector supplies occupancy information to signalling. A basic track circuit uses an electrical condition of the running rails; an axle counter instead evaluates wheels passing section boundaries. Neither display should be confused with a continuously measured position for the front of a train.",
      "The model distinguishes clear, occupied and unavailable information. When the nose crosses a boundary, the old section remains occupied while part of the train is still inside it."
    ],
    "sources": [
      "S13",
      "S14"
    ],
    "caveat": "Detector type, proving conditions and degraded procedures vary.",
    "related": [
      "track-circuit",
      "axle-counter",
      "fixed-block",
      "interlocking",
      "train-integrity"
    ]
  },
  {
    "id": "track-circuit",
    "label": "Track circuit",
    "summary": "Uses the running rails in a section-detection circuit.",
    "details": [
      "In a basic track circuit, a supply and receiver are connected through the rails. A wheelset electrically links the rails and changes the receiver condition, indicating occupation. The educational circuit therefore follows the running rails rather than the separate traction supply rail or LIM reaction rail.",
      "Network Rail explains that faults can produce an occupied indication and restrict traffic. Real track circuits use different electrical arrangements; this simple relay sketch demonstrates the detection principle."
    ],
    "sources": [
      "S13"
    ],
    "caveat": "This diagram does not establish broken-rail detection capability or immunity to every failure.",
    "related": [
      "train-detection",
      "axle-counter",
      "running-rail",
      "interlocking"
    ]
  },
  {
    "id": "axle-counter",
    "label": "Axle counter",
    "summary": "Counts wheel passages at the edges of a section.",
    "details": [
      "Trackside wheel sensors detect axle passages and direction. Evaluation equipment compares the events at the boundaries of the protected section to determine its occupancy state. The published voestalpine example includes monitored sensors and evaluation equipment for tracks and turnouts.",
      "A balanced count is meaningful only within a valid evaluation state. The teaching model therefore shows count balance and information validity separately. It also distinguishes the wayside counter from an onboard tachometer: one supports section occupancy, while the other supplies wheel-motion information."
    ],
    "sources": [
      "S14"
    ],
    "caveat": "Counts in the demonstration are invented for teaching and are not recovery instructions.",
    "related": [
      "train-detection",
      "track-circuit",
      "tachometer",
      "train-integrity"
    ]
  },
  {
    "id": "lineside-signal",
    "label": "Lineside signal and route indication",
    "summary": "Presents movement instructions to a driver.",
    "details": [
      "A lineside signal communicates an instruction or permission at a particular point. Colour-light signals may also have a route indication, helping a driver understand which path has been established. Network Rail distinguishes these visible signals from the broader system that detects trains, operates points and protects movements.",
      "Some signalling arrangements present information inside the cab instead. A green-looking lamp alone is therefore an incomplete explanation of the railway: route establishment, detection and the applicable operating rules also matter. This model uses explicitly labelled stop and proceed indications rather than teaching a national aspect code."
    ],
    "sources": [
      "S21"
    ],
    "caveat": "Aspect meanings and driver obligations depend on the railway and its rulebook.",
    "related": [
      "interlocking",
      "fixed-block",
      "etcs-onboard",
      "atp"
    ]
  },
  {
    "id": "fixed-block",
    "label": "Fixed-block separation",
    "summary": "Divides track into predetermined detection or signalling sections.",
    "details": [
      "A fixed-block model uses boundaries that stay at defined places on the railway. The condition of the sections ahead constrains a following movement. When the leading train occupies part of a section, that section cannot simply be treated as empty space behind its front.",
      "Stopping distance, observation or supervision, train length and margins all affect separation. Shortening a drawn block is not by itself proof that a real railway can safely run closer together."
    ],
    "sources": [
      "S12"
    ],
    "caveat": "The comparison omits operating exceptions and must not be used to determine headway.",
    "related": [
      "train-detection",
      "track-circuit",
      "axle-counter",
      "lineside-signal",
      "moving-block"
    ]
  },
  {
    "id": "moving-block",
    "label": "Moving-block separation",
    "summary": "Relates a following limit to the protected position of the train ahead.",
    "details": [
      "A moving-block illustration lets the separation boundary change with the leading train rather than tying every limit to fixed section endpoints. Knowledge of train position and extent supports this approach; the following train still needs sufficient protected stopping space.",
      "The benefit comes from using movement information differently, not from removing braking distance. The display retains a position-uncertainty region and a braking envelope while the leading train moves."
    ],
    "sources": [
      "S12"
    ],
    "caveat": "This is a conceptual comparison, not a capacity or certified-separation calculation.",
    "related": [
      "fixed-block",
      "movement-authority",
      "odometry",
      "train-integrity",
      "braking-curve"
    ]
  },
  {
    "id": "odometry",
    "label": "Odometry and position estimation",
    "summary": "Combines measured motion with known position references.",
    "details": [
      "Odometry estimates speed and distance from motion sensors. Deutsche Bahn identifies pulse generators, radar and accelerometers as established examples; independent measurements can be combined. A known passing reference such as a balise supplies a different kind of information from the motion measured between references.",
      "Our experiment labels the true distance as a known example reference and deliberately biases a synthetic wheel measurement. A second sensor and a reference update help explain why information is combined. They do not make every estimate exact or establish the performance of a real train. Newer localization research also investigates landmark and satellite measurements."
    ],
    "sources": [
      "S19"
    ],
    "caveat": "Sensor combinations and assurance methods differ; research demonstrations are not universal installed equipment.",
    "related": [
      "tachometer",
      "accelerometer",
      "balise",
      "train-control",
      "train-integrity"
    ]
  },
  {
    "id": "braking-curve",
    "label": "Braking curve and target supervision",
    "summary": "Predicts the speed reduction needed before a target.",
    "details": [
      "A braking curve relates allowable or predicted speed to the distance remaining toward a target. ERA explains that ETCS builds its prediction from train braking dynamics and the track ahead, then uses that prediction in onboard supervision.",
      "A toy slider can show why a poorer assumed deceleration needs more space. The resulting curve is an explanatory calculation only; certified braking models include detailed inputs and supervision rules that this site does not reproduce."
    ],
    "sources": [
      "S07"
    ],
    "caveat": "A service-braking animation is not evidence of an emergency-stop guarantee.",
    "related": [
      "atp",
      "movement-authority",
      "brake-control",
      "moving-block"
    ]
  },
  {
    "id": "train-integrity",
    "label": "Train integrity and protected rear position",
    "summary": "Asks whether the complete train remains together.",
    "details": [
      "Train integrity concerns confidence that the train is complete and has not left vehicles behind. A report of the leading end’s position answers a different question. To reason about the space occupied by a whole train, its extent and completeness also matter.",
      "The illustration places separate markers on the front and rear and a distinct integrity-status badge. Changing the front position does not automatically clear the previous section or prove that the rear has followed."
    ],
    "sources": [
      "S20"
    ],
    "caveat": "Integrity assurance and trackside detection depend on the chosen architecture.",
    "related": [
      "train-detection",
      "moving-block",
      "odometry",
      "etcs-level-2"
    ]
  },
  {
    "id": "etcs-level-1",
    "label": "ETCS Level 1",
    "summary": "Combines spot transmission with continuing onboard supervision.",
    "details": [
      "Level 1 typically transfers trackside information through Eurobalises as the train passes. Onboard supervision continues between those transmissions, checking permitted speed and the approach to the end of movement authority.",
      "In the basic view, interlocking information reaches a switchable balise through an LEU, while lineside signals and separate train detection remain visible. Infill arrangements can supply information before the next balise; the displayed base case omits them."
    ],
    "sources": [
      "S15"
    ],
    "caveat": "Intermittent communication does not mean intermittent protection.",
    "related": [
      "balise",
      "leu",
      "etcs-onboard",
      "lineside-signal",
      "interlocking"
    ]
  },
  {
    "id": "etcs-level-2",
    "label": "ETCS Level 2",
    "summary": "Uses radio for continuing train–trackside exchanges.",
    "details": [
      "Level 2 combines continuous onboard supervision with radio communication. The radio block centre and onboard equipment exchange movement information; balises still provide references. Lineside signals are optional in the architecture.",
      "The Commission’s current overview incorporates the former Level 3 category into Level 2 under the 2023 CCS TSI. Detection and integrity may therefore be supplied by trackside equipment or managed within ERTMS, depending on the configuration."
    ],
    "sources": [
      "S15"
    ],
    "caveat": "Level 2 alone does not specify moving block, absence of signals or automation grade.",
    "related": [
      "rbc",
      "etcs-onboard",
      "balise",
      "gsm-r-frmcs",
      "train-integrity",
      "train-detection"
    ]
  },
  {
    "id": "rbc",
    "label": "Radio block centre · RBC",
    "summary": "Provides ETCS movement information over radio.",
    "details": [
      "An RBC receives reports from trains and sends movement authority and associated information. It interfaces with the interlocking and other ground functions; a radio tower by itself does not make the route-control decisions.",
      "The model distinguishes the logical RBC, its communication path and the onboard receiver. The train’s EVC checks the received data and supervises movement locally. The response is therefore part of a distributed control arrangement, not remote steering of a traction inverter."
    ],
    "sources": [
      "S17"
    ],
    "caveat": "Physical hosting, interfaces and boundaries differ between implementations.",
    "related": [
      "etcs-level-2",
      "interlocking",
      "movement-authority",
      "etcs-onboard",
      "train-radio"
    ]
  },
  {
    "id": "etcs-onboard",
    "label": "ETCS onboard equipment · EVC and DMI",
    "summary": "Processes movement data, supervises the train and informs the driver.",
    "details": [
      "The European Vital Computer applies the onboard protection logic using received information and train inputs such as odometry. Interfaces connect the protection function to relevant vehicle systems. A driver-machine interface presents indications and supports driver interaction.",
      "These roles should remain visually distinct: the display is not the entire protection computer, and the computer is not the physical brake. The cutaway links reader, radio and motion inputs to the EVC, then separates its driver display from its train-control interface."
    ],
    "sources": [
      "S17"
    ],
    "caveat": "The diagram explains functions without reproducing a certified cab display or wiring arrangement.",
    "related": [
      "rbc",
      "balise",
      "odometry",
      "atp",
      "brake-control"
    ]
  },
  {
    "id": "leu",
    "label": "Lineside electronic unit · LEU",
    "summary": "Connects signalling information to a switchable Eurobalise.",
    "details": [
      "An LEU receives information from the interlocking and supplies an appropriate telegram to a switchable Eurobalise. The balise then communicates that information to the passing train. A fixed-data balise illustrates a different use: its information is not being selected from the current route state.",
      "The model places the LEU between the interlocking and the balise, making the source of the message visible instead of treating every track transponder as an isolated position marker."
    ],
    "sources": [
      "S16"
    ],
    "caveat": "This is an ETCS constituent, not a generic name for every wayside radio controller.",
    "related": [
      "balise",
      "interlocking",
      "etcs-level-1"
    ]
  },
  {
    "id": "gsm-r-frmcs",
    "label": "Railway radio · GSM-R and FRMCS",
    "summary": "Separates communication technology from the train-control application.",
    "details": [
      "GSM-R adapted GSM technology for railway needs. FRMCS is its specified successor; UIC’s public 2025 system requirements describe a 5G-based system and interfaces through which railway applications use communications services. The radio system transports information for applications rather than replacing their signalling logic.",
      "Migration is a coordinated change to equipment, networks and applications. UIC explicitly describes scenarios in which users attach to GSM-R, FRMCS or temporarily both. The comparison therefore shows coexistence, not a universal switchover date. A generic 5G metro deployment should not automatically be labelled FRMCS."
    ],
    "sources": [
      "S18"
    ],
    "caveat": "This educational view makes no claim about a particular network’s rollout schedule.",
    "related": [
      "train-radio",
      "rbc",
      "etcs-level-2",
      "train-network"
    ]
  },
  {
    "id": "seltrac",
    "label": "SelTrac · a published CBTC family",
    "summary": "A supplier example with several generations and communication arrangements.",
    "details": [
      "SelTrac belongs to Hitachi Rail’s urban signalling portfolio. Hitachi completed its acquisition of Thales’ Ground Transportation Systems business on 31 May 2024; older documents therefore carry a different supplier name.",
      "Treat the family as a case study, with separately labelled historical and contemporary examples. The comparison does not assign one cabinet arrangement, radio bearer or propulsion system to every SelTrac deployment."
    ],
    "sources": [
      "S01"
    ],
    "caveat": "Brand and generation labels do not establish any particular installation’s configuration.",
    "related": [
      "cbtc",
      "seltrac-loop",
      "seltrac-g9",
      "train-radio"
    ]
  },
  {
    "id": "seltrac-loop",
    "label": "Legacy SelTrac inductive-loop example",
    "summary": "Uses a track loop as the local train–wayside communication medium.",
    "details": [
      "Public 2009 planning material explicitly distinguishes an inductive-loop system from a proposed wayside-radio SelTrac upgrade. This is evidence of different communication arrangements, not a claim about when any particular migration was completed.",
      "An archived public explanation describes very short-range wireless communication through a loop cable between the rails. The model uses inductive coupling across the train–track gap. The loop is a data conductor, separate from running rails, traction supply and return conductors, and the LIM reaction rail."
    ],
    "sources": [
      "S02",
      "S03"
    ],
    "caveat": "Historical communication example; it is not the definition of all modern CBTC.",
    "related": [
      "seltrac",
      "train-radio",
      "train-control",
      "zone-controller",
      "reaction-rail"
    ]
  },
  {
    "id": "seltrac-g9",
    "label": "SelTrac G9 · published virtualization example",
    "summary": "Changes where selected control functions are hosted.",
    "details": [
      "Hitachi’s InnoTrans 2026 publication describes SelTrac G9 with safety-critical functions hosted on a secure private cloud rather than dedicated wayside hardware. It also identifies integration with ATS Next and Green CBTC.",
      "For teaching, the useful change is the hosting boundary: logical control responsibilities can be shown separately from the cabinet or computing platform containing them. The publication’s AI-enabled supervision and energy features should not be turned into a claim that an AI model grants movement authority. Nor does the announcement establish that existing SelTrac lines use G9."
    ],
    "sources": [
      "S04"
    ],
    "caveat": "A product publication is not a complete architecture specification or deployment inventory.",
    "related": [
      "seltrac",
      "cbtc",
      "zone-controller",
      "ats",
      "interlocking"
    ]
  },
  {
    "id": "station-pa",
    "label": "Station public address and voice alarm",
    "summary": "Microphones, audio controllers, amplifiers and speakers deliver announcements to selected areas.",
    "details": [
      "An announcement begins as live or recorded audio. A controller routes it to a zone, amplifiers provide the speaker-driving power, and distributed loudspeakers turn the electrical signal into sound.",
      "A voice-alarm implementation adds supervised paths and appropriate power resilience. Network health, amplifier availability and speaker-line condition matter as well as audibility. A passenger-information display and a loudspeaker may share a message source while remaining different output devices."
    ],
    "sources": [
      "F02"
    ],
    "related": [
      "station-pis",
      "fire-notification",
      "emergency-intercom",
      "telecom-rack"
    ]
  },
  {
    "id": "station-pis",
    "label": "Passenger information displays",
    "summary": "A display presents service information supplied by passenger-information applications.",
    "details": [
      "A passenger information system connects information sources to station displays. It can present arrivals, service changes and other journey information; an integrated station platform can coordinate this with audio announcements.",
      "The display is the visible endpoint. Its controller, data connection and information source belong to the same chain. Showing the age or availability of information is more informative than continuing a normal-looking countdown when updates are missing."
    ],
    "sources": [
      "F03"
    ],
    "related": [
      "station-pa",
      "network-switch",
      "station-scada"
    ]
  },
  {
    "id": "station-radio",
    "label": "Operational radio communications",
    "summary": "Staff and dispatch communicate through a radio service distinct from passenger Wi-Fi.",
    "details": [
      "Operational radio supports conversations between field staff and dispatch. Portable or vehicle radios, radio infrastructure and dispatch interfaces form different parts of that service; technologies such as TETRA and DMR are examples rather than universal choices.",
      "The radio air interface covers one part of the journey. Communications infrastructure carries traffic onward to the appropriate service or operator. A radio symbol therefore does not mean that every station subsystem shares the same channel or the same train-control function."
    ],
    "sources": [
      "F05"
    ],
    "related": [
      "fiber-backbone",
      "telecom-rack",
      "occ-workstation"
    ]
  },
  {
    "id": "station-cctv",
    "label": "Station CCTV and video management",
    "summary": "Cameras provide video; management software organizes live views and recordings.",
    "details": [
      "A camera is an endpoint within a video system. Video management software brings device views and recordings into an operator interface and may associate them with other security events.",
      "Linking a door event to a relevant camera view can help an operator understand the event. The image itself does not prove a door is locked, and a video server is not the access controller. The model should preserve those separate roles."
    ],
    "sources": [
      "F06"
    ],
    "related": [
      "access-controller",
      "network-switch",
      "occ-workstation"
    ]
  },
  {
    "id": "access-controller",
    "label": "Access control for staff and equipment areas",
    "summary": "Credentials, door-state inputs and locking hardware support controlled access.",
    "details": [
      "Access management uses credentials and configured permissions to decide who may enter a controlled area. Door controllers connect the software decision to field equipment and return door-related status.",
      "In the teaching model, a reader, door contact and lock are separate objects: identity request, observed position and physical restraint are different information. Their connection to a shared security interface does not erase the distinction between access policy and life-safety arrangements."
    ],
    "sources": [
      "F06"
    ],
    "caveat": "Do not prescribe a universal lock-release rule or imply that controlled access can prevent required egress.",
    "related": [
      "station-cctv",
      "flss",
      "station-scada"
    ]
  },
  {
    "id": "flss",
    "label": "Fire and life safety systems (FLSS)",
    "summary": "FLSS describes coordinated protective functions across the station and trainway.",
    "details": [
      "Fire and life safety systems (FLSS) encompass several functions: recognizing a hazardous condition, notifying people, supporting escape and managing fire-related effects. Rail guidance addresses stations and trainways together with ventilation, communications and control systems.",
      "These functions are distributed across equipment and physical spaces. A fire panel, a pump, an illuminated exit route and a ventilation plant are not interchangeable parts of one box. Their interfaces and design objectives must be understood together."
    ],
    "sources": [
      "F01"
    ],
    "caveat": "This educational grouping is not a code-compliant station design or a declaration of control authority.",
    "related": [
      "fire-panel",
      "fire-notification",
      "sprinkler-system",
      "emergency-lighting",
      "smoke-control",
      "station-egress"
    ]
  },
  {
    "id": "fire-panel",
    "label": "Fire detection and alarm control panel",
    "summary": "The panel organizes initiating-device information and configured outputs.",
    "details": [
      "A fire control panel contains processing, interface and power-supply functions. It receives initiating-device information and distinguishes alarm, supervisory and trouble events.",
      "Output interfaces can connect notification and other configured functions. A station supervisory screen may display panel information, but the display is not the detector loop or the fire panel itself."
    ],
    "sources": [
      "F07"
    ],
    "related": [
      "fire-detector",
      "fire-notification",
      "flss",
      "station-scada"
    ]
  },
  {
    "id": "fire-detector",
    "label": "Fire initiating devices",
    "summary": "Smoke, heat, manual and waterflow inputs report different kinds of evidence.",
    "details": [
      "Detection devices and other initiating inputs supply information to a fire alarm system. A reported smoke or heat condition, a manual input and a waterflow indication describe different events.",
      "An address or zone helps locate the report. The device is a measurement or initiating point; it does not by itself constitute the full station response. Its message should be visually distinct from an equipment command."
    ],
    "sources": [
      "F07"
    ],
    "related": [
      "fire-panel",
      "sprinkler-system",
      "bas-sensor"
    ]
  },
  {
    "id": "fire-notification",
    "label": "Audible, visual and voice notification",
    "summary": "Notification translates a system event into information people can perceive.",
    "details": [
      "Notification may use audible devices, visual appliances or voice messages. A control interface links the event logic to the selected notification outputs; a speaker and a strobe perform different communication tasks.",
      "Voice-alarm equipment can supervise audio paths and power availability. Sharing speakers with routine announcements is an implementation choice that needs an engineered priority arrangement; ordinary PA capability alone does not establish an emergency communication design."
    ],
    "sources": [
      "F07",
      "F02"
    ],
    "related": [
      "station-pa",
      "fire-panel",
      "emergency-lighting"
    ]
  },
  {
    "id": "sprinkler-system",
    "label": "Sprinkler piping and heat-responsive heads",
    "summary": "A conventional sprinkler head responds locally to heat.",
    "details": [
      "A closed, heat-responsive sprinkler contains a thermal element that releases when its designed thermal conditions are reached. Heat response and water-distribution characteristics are part of selecting the sprinkler for its application.",
      "This is different from a smoke detector sending an electronic alarm message. The illustrated piping supplies water to individual heads; it should not show every head opening simply because a detector reports smoke. Other suppression arrangements exist and are outside this simplified example."
    ],
    "sources": [
      "F08"
    ],
    "related": [
      "fire-pump",
      "fire-detector",
      "flss"
    ]
  },
  {
    "id": "fire-pump",
    "label": "Fire-water supply and pump equipment",
    "summary": "A pump supplies pressure and flow to an engineered fire-water network.",
    "details": [
      "Fire pumps move water through piping to the suppression system. A pump assembly includes the hydraulic machine, a driver and a dedicated control arrangement; water availability and electrical or other driving energy are separate dependencies.",
      "Pressure-related signals can form part of automatic pump control. The pump controller has a different job from a general station dashboard: monitoring a pump status does not make that dashboard the complete pump-control system."
    ],
    "sources": [
      "F09"
    ],
    "caveat": "No water-storage volume, pressure setpoint, pump sequence or operating instruction is specified.",
    "related": [
      "sprinkler-system",
      "fire-panel",
      "auxiliary-switchboard"
    ]
  },
  {
    "id": "emergency-lighting",
    "label": "Emergency lighting and illuminated wayfinding",
    "summary": "Lighting can retain a designated supply when normal lighting power is unavailable.",
    "details": [
      "A self-contained emergency luminaire has its own battery and charging arrangement. A central-battery system supplies remote luminaires from a separate battery installation. Both are real architectures, so the model should identify which example is being shown.",
      "The illuminated fitting is only the visible endpoint of its supply and monitoring arrangement. Its purpose and circuit classification differ from ordinary decorative lighting; a generic electronics UPS should not automatically be portrayed as the approved source for every emergency luminaire."
    ],
    "sources": [
      "F10"
    ],
    "related": [
      "station-ups",
      "station-egress",
      "flss"
    ]
  },
  {
    "id": "emergency-intercom",
    "label": "Passenger help points and emergency communications",
    "summary": "A help point creates a two-way conversation with an appropriate operator.",
    "details": [
      "A passenger help point combines a call interface, microphone and loudspeaker; some implementations add video. Its communications service connects the caller to an operator rather than merely broadcasting an announcement.",
      "Noisy transport spaces make intelligibility important. Audio processing, suitable transducers and operator integration contribute different parts of the conversation. The model can trace the request and the returning audio separately without implying that a call automatically controls train movement or ventilation."
    ],
    "sources": [
      "F04"
    ],
    "related": [
      "station-pa",
      "station-radio",
      "occ-workstation",
      "station-egress"
    ]
  },
  {
    "id": "station-egress",
    "label": "Passenger circulation and egress context",
    "summary": "Levels, routes and information belong in the station systems picture.",
    "details": [
      "Rail fire and life-safety guidance includes the means by which occupants can reach a place of safety. That makes passenger movement a spatial consideration alongside equipment, communications and ventilation.",
      "The educational station has a concourse, platform, stairs and an accessible circulation connection to help explain where devices serve people. These illustrative routes do not demonstrate capacity, travel-time performance, protected construction or an approved emergency route."
    ],
    "sources": [
      "F01"
    ],
    "caveat": "Do not present the model as evacuation guidance for any real station.",
    "related": [
      "flss",
      "emergency-lighting",
      "emergency-intercom",
      "station-pis"
    ]
  },
  {
    "id": "tunnel-fan",
    "label": "Tunnel ventilation fan",
    "summary": "A fan adds mechanical energy to air and helps establish a designed airflow.",
    "details": [
      "Rail tunnels receive heat from trains and electrical equipment. Powered ventilation can supplement natural effects and train-induced air movement; large axial fans and other arrangements are used according to the tunnel design.",
      "A rotating impeller produces a pressure rise, while the connected tunnel, shaft and fittings resist the flow. Motor rotation alone is therefore not a measured airflow. In an explanatory model, the air arrows represent an intended path rather than a calculated fan duty."
    ],
    "sources": [
      "F11"
    ],
    "related": [
      "tunnel-shaft",
      "tunnel-damper",
      "smoke-control",
      "auxiliary-switchboard"
    ]
  },
  {
    "id": "tunnel-shaft",
    "label": "Ventilation shafts and air paths",
    "summary": "A shaft connects the tunnel ventilation arrangement to another air volume or outdoors.",
    "details": [
      "A ventilation shaft and its connected ductwork provide a physical route for supply or exhaust air. Fan rooms, dampers and openings become part of that route; the arrangement depends on station and tunnel geometry.",
      "A moving train can also displace air. The shaft should therefore be understood as part of a pressure-connected environment, not as a guaranteed one-way chimney. The illustrated route is one selected mechanical arrangement, not a universal station cross-section."
    ],
    "sources": [
      "F11",
      "F13"
    ],
    "related": [
      "tunnel-fan",
      "tunnel-damper",
      "station-hvac"
    ]
  },
  {
    "id": "tunnel-damper",
    "label": "Tunnel ventilation and smoke-control damper",
    "summary": "Movable blades change the available air path.",
    "details": [
      "A tunnel damper uses a frame and moving blades to open, restrict or isolate an air passage. Dampers intended for smoke-control duties have application-specific performance requirements; an ordinary comfort-air damper is not automatically equivalent.",
      "The mechanical blade position, its actuator command and any reported position are separate ideas. A model can show these together without implying that a commanded position proves airflow or that every damper must take the same position during a fire."
    ],
    "sources": [
      "F12"
    ],
    "related": [
      "tunnel-fan",
      "smoke-control",
      "bas-actuator"
    ]
  },
  {
    "id": "smoke-control",
    "label": "Smoke-management objectives",
    "summary": "Emergency ventilation is designed around conditions and routes, not simply maximum fan speed.",
    "details": [
      "Normal ventilation addresses everyday heat and air-quality conditions. Emergency smoke management has different objectives, including conditions that support escape and emergency response. Fire location, geometry and the connected air paths affect what a useful ventilation strategy looks like.",
      "Colored air or smoke traces explain objectives. They cannot establish tenability, smoke-layer height, exposure or evacuation performance, and should not prescribe a universal fan direction."
    ],
    "sources": [
      "F13"
    ],
    "caveat": "This model performs no CFD, fire-growth calculation or life-safety performance assessment.",
    "related": [
      "flss",
      "tunnel-fan",
      "tunnel-damper",
      "station-egress"
    ]
  },
  {
    "id": "station-hvac",
    "label": "Station HVAC and environmental zones",
    "summary": "Passenger spaces and equipment rooms can have different environmental needs.",
    "details": [
      "Station heating, ventilation and air conditioning manages occupied spaces and the environments required by equipment. A station can combine conditioned rooms with platform areas influenced by tunnel airflow; one room thermostat does not describe the whole station.",
      "The useful teaching distinction is the service boundary: a local air-handling system treats and distributes air for its zones, while tunnel ventilation addresses a different connected space. Some equipment can have more than one duty, but its approved operating strategy remains project-specific."
    ],
    "sources": [
      "F13",
      "F14"
    ],
    "related": [
      "hvac-air-handler",
      "bas-controller",
      "tunnel-shaft"
    ]
  },
  {
    "id": "hvac-air-handler",
    "label": "Air-handling unit cutaway",
    "summary": "Filters, coils, dampers and a fan perform different parts of air treatment.",
    "details": [
      "An air-handling unit moves air through treatment components and into distribution ductwork. Filters remove particles; coils exchange heat with another medium; dampers regulate air paths; the fan supplies the energy needed to move the air.",
      "Heating or cooling energy is supplied through the wider plant, such as a water or refrigerant circuit. The fan does not create cooling by itself. Component order, outside-air mixing and return-air arrangements vary, so the cutaway is one functional example."
    ],
    "sources": [
      "F14"
    ],
    "related": [
      "station-hvac",
      "bas-sensor",
      "bas-actuator"
    ]
  },
  {
    "id": "bas-controller",
    "label": "Building automation controller",
    "summary": "A controller connects field measurements to configured equipment actions and status.",
    "details": [
      "A building automation system (BAS), also called a building management system (BMS) in many contexts, can include distributed controllers, input/output interfaces and supervisory software. Controllers can support schedules, alarms, trends and connections to HVAC or other building-service equipment.",
      "Local control logic and the supervisory presentation occupy different roles. A screen can show a temperature and request a change, while the controller and its equipment interfaces implement the configured behavior. The model should show both levels rather than making a workstation the direct actuator."
    ],
    "sources": [
      "F15",
      "F19"
    ],
    "related": [
      "bas-sensor",
      "bas-actuator",
      "plant-network",
      "station-scada"
    ]
  },
  {
    "id": "bas-sensor",
    "label": "Building-services sensors",
    "summary": "Sensors turn physical conditions into information for monitoring and control.",
    "details": [
      "Room, duct and pipe sensors can measure different quantities, including temperature, humidity, pressure, air quality and flow. Their physical placement determines what part of the building system a reading describes.",
      "A duct-pressure reading is not a room-temperature reading, and neither is a fire alarm by definition. In the model, selecting a sensor should highlight its measured medium and the controller input that receives its signal, rather than suggesting that all sensor symbols are interchangeable."
    ],
    "sources": [
      "F16"
    ],
    "related": [
      "bas-controller",
      "hvac-air-handler",
      "fire-detector"
    ]
  },
  {
    "id": "bas-actuator",
    "label": "Building-services actuators",
    "summary": "An actuator turns a control request into a physical change.",
    "details": [
      "Building control can adjust dampers, valves and fan operation to change air treatment and distribution. The physical actuator is the link between a control signal and equipment movement or modulation.",
      "A command to move and feedback about the achieved condition are different signals. The model can expose a damper linkage or valve stem to make that distinction visible. Comfort-control equipment should not acquire a fire/smoke-control role simply because the graphics use a similar symbol."
    ],
    "sources": [
      "F14",
      "F15"
    ],
    "related": [
      "bas-controller",
      "bas-sensor",
      "tunnel-damper"
    ]
  },
  {
    "id": "plant-network",
    "label": "Building automation network",
    "summary": "Field and supervisory communications connect different levels of building control.",
    "details": [
      "Automation controllers can exchange data through several interface families. BACnet and Modbus are examples supported by commercial controllers; a plant can also include direct I/O connections to sensors and actuators.",
      "The protocol name describes a communications arrangement, not a physical cable route or a universal safety classification. A useful diagram distinguishes local field connections from the station-wide supervisory link and labels both as information paths."
    ],
    "sources": [
      "F15"
    ],
    "related": [
      "bas-controller",
      "network-switch",
      "station-scada"
    ]
  },
  {
    "id": "power-scada",
    "label": "Traction power SCADA",
    "summary": "Supervisory control and data acquisition provides a system-level view of traction power equipment.",
    "details": [
      "Power SCADA collects and presents traction-supply states, measurements and alarms, and supports authorized supervisory control functions. Its field interfaces connect the network-level view with substation equipment and local control systems.",
      "Local protection and equipment control remain distinct engineering functions even when one vendor integrates them. A breaker symbol on an operator screen represents equipment information and an interface; it is not the interrupting device, the measurement sensor or the complete protection chain."
    ],
    "sources": [
      "F17"
    ],
    "caveat": "Do not infer a universal RTU/IED partition, trip path or remote/local command priority.",
    "related": [
      "station-scada",
      "occ-workstation",
      "fiber-backbone"
    ]
  },
  {
    "id": "station-scada",
    "label": "Station and communications supervisory systems",
    "summary": "A supervisory application brings selected facility and communications states into an operator view.",
    "details": [
      "Facility SCADA and integrated station platforms can bring together building-service information, security, passenger information and other subsystem interfaces. Their scope differs from the electrical focus of traction power SCADA, although an integrated platform may present both.",
      "The shared display does not imply shared field controllers, identical reliability requirements or unrestricted control rights. Communications supervision can indicate device or network health while the associated radio, video or audio system continues to have its own service functions."
    ],
    "sources": [
      "F03",
      "F04"
    ],
    "caveat": "Naming and system boundaries vary by project; station SCADA is not a universal replacement for fire controls or BAS logic.",
    "related": [
      "power-scada",
      "bas-controller",
      "fire-panel",
      "telecom-rack",
      "occ-workstation"
    ]
  },
  {
    "id": "occ-workstation",
    "label": "Operations control centre supervisory workstation",
    "summary": "An operator interface presents selected systems, events and communications.",
    "details": [
      "A control-centre workstation provides a human interface to supervisory applications and communications. Different views can present equipment state, events, history or conversations, while servers and field equipment perform other parts of the system.",
      "Combining information helps an operator relate events across subsystems. It does not make every indication equally current or give every user the same authority. The teaching view should distinguish observed state, unavailable data and a request whose completion has not yet been confirmed."
    ],
    "sources": [
      "F17",
      "F04"
    ],
    "related": [
      "station-scada",
      "power-scada",
      "station-radio",
      "emergency-intercom"
    ]
  },
  {
    "id": "station-transformer",
    "label": "Station auxiliary transformer",
    "summary": "A building-supply transformer serves auxiliary distribution in this selected example.",
    "details": [
      "A medium-to-low-voltage transformer can supply the building-services distribution system. Its input supply, magnetic conversion and output distribution are distinct parts of the power path.",
      "This example separates auxiliary supply from the traction rectifier branch. That helps explain why station lighting and electronics need their own distribution arrangements. Real projects can use different supply topologies, transformer locations and redundancy schemes."
    ],
    "sources": [
      "F18"
    ],
    "related": [
      "auxiliary-switchboard",
      "station-ups",
      "power-scada"
    ]
  },
  {
    "id": "auxiliary-switchboard",
    "label": "Auxiliary electrical distribution",
    "summary": "Busbars and protective outgoing circuits distribute power to station loads.",
    "details": [
      "A low-voltage main switchboard receives the transformer output and distributes electrical supply through protected circuits. Main and branch equipment serve different parts of the installation.",
      "Essential loads may be organized separately, and an alternative supply or UPS can be included where the design requires it. In the model, selected electronics, lighting and mechanical plant should have visibly distinct branches rather than all appearing to run through one small backup battery."
    ],
    "sources": [
      "F18"
    ],
    "related": [
      "station-transformer",
      "station-ups",
      "hvac-air-handler",
      "fire-pump"
    ]
  },
  {
    "id": "station-ups",
    "label": "Uninterruptible power supply for selected electronics",
    "summary": "Backup power can keep designated control and communications electronics available.",
    "details": [
      "A station UPS can support sensitive electronics such as controllers, I/O equipment and user interfaces when the normal supply is disturbed. Its protected load boundary is part of the design.",
      "Keeping a supervisory screen alive does not prove that every associated motor, fan or field device still has power. The teaching model should trace the selected backed-up circuits separately from the larger auxiliary loads and avoid implying unlimited battery endurance."
    ],
    "sources": [
      "F19"
    ],
    "related": [
      "auxiliary-switchboard",
      "telecom-rack",
      "bas-controller",
      "emergency-lighting"
    ]
  },
  {
    "id": "telecom-rack",
    "label": "Station telecommunications rack",
    "summary": "The rack houses network and service equipment; it is not itself a protocol.",
    "details": [
      "A station communications enclosure can hold switches, service equipment, power modules and patch connections. Different modules have different roles even when mounted together.",
      "The model uses a rack to make those interfaces visible. A nearby fiber panel is a termination point; an adjacent switch is an active network device."
    ],
    "sources": [
      "F20",
      "F02"
    ],
    "related": [
      "network-switch",
      "fiber-backbone",
      "station-ups",
      "station-pa"
    ]
  },
  {
    "id": "fiber-backbone",
    "label": "Fiber-optic backhaul and backbone",
    "summary": "Fiber carries information between network nodes and distant system locations.",
    "details": [
      "Fiber links connect communications equipment over the wider rail network. Backhaul links can carry station or radio-node traffic toward shared services and control-centre applications.",
      "A fiber route is a physical path. The services using it are logical traffic relationships; drawing several services together does not specify their segregation or resilience."
    ],
    "sources": [
      "F20"
    ],
    "related": [
      "network-switch",
      "station-radio",
      "station-scada"
    ]
  },
  {
    "id": "network-switch",
    "label": "Station network switch",
    "summary": "An active network device connects local endpoints and upstream links.",
    "details": [
      "Managed rail networks use Ethernet switches and fiber-capable interfaces to connect equipment. Some devices can also provide power over suitable Ethernet links.",
      "Physical connectivity and application function remain separate. A camera and an information display can use network infrastructure while belonging to different services; a link light alone is not proof that either service is working."
    ],
    "sources": [
      "F20"
    ],
    "related": [
      "telecom-rack",
      "fiber-backbone",
      "station-cctv",
      "station-pis",
      "plant-network"
    ]
  }
];

export const ARCHITECTURES = [
  {
    "id": "conventional-fixed-block",
    "label": "Conventional fixed-block example",
    "description": "Follow occupancy and route proof before interpreting the signal.",
    "components": [
      "fixed-block",
      "train-detection",
      "track-circuit",
      "axle-counter",
      "interlocking",
      "point-machine",
      "lineside-signal",
      "atp"
    ],
    "flow": [
      "Section detection → interlocking",
      "Route request → point command and proved indication",
      "Interlocking → signal indication",
      "Driver or onboard protection → vehicle response"
    ],
    "sources": [
      "S10",
      "S11",
      "S12",
      "S13",
      "S14",
      "S21"
    ],
    "limits": "Alternative detector types are choices, not a requirement to install both. National aspect codes are omitted."
  },
  {
    "id": "legacy-loop-atc",
    "label": "Legacy SelTrac loop example",
    "description": "Isolate the communication medium from the control responsibilities.",
    "components": [
      "seltrac",
      "seltrac-loop",
      "train-control",
      "zone-controller",
      "atp",
      "ato"
    ],
    "flow": [
      "Onboard equipment ↔ local inductive data loop",
      "Loop interface ↔ wayside control functions",
      "Movement information → onboard supervision"
    ],
    "sources": [
      "S02",
      "S03",
      "S06"
    ],
    "limits": "Historical, schematic arrangement; no universal cabinet map, cable geometry or present-day installation claim."
  },
  {
    "id": "radio-cbtc",
    "label": "Radio CBTC with wayside control",
    "description": "Trace a report, the returned limit and the onboard driving response.",
    "components": [
      "cbtc",
      "odometry",
      "train-control",
      "train-radio",
      "wayside-radio",
      "zone-controller",
      "interlocking",
      "movement-authority",
      "atp",
      "ato",
      "ats"
    ],
    "flow": [
      "Localization → train report",
      "Train radio ↔ wayside communication",
      "Control functions → movement-related response",
      "Onboard protection constrains driving"
    ],
    "sources": [
      "S05",
      "S06",
      "S08",
      "S09"
    ],
    "limits": "An example functional allocation. Other CBTC systems distribute or combine responsibilities differently."
  },
  {
    "id": "seltrac-virtualized",
    "label": "SelTrac G9 publication · 2026",
    "description": "Compare logical functions with their hosting environment.",
    "components": [
      "seltrac-g9",
      "seltrac",
      "train-control",
      "train-radio",
      "ats"
    ],
    "flow": [
      "Illustrative communication interface → hosted control functions",
      "Hosted functions → movement-related information",
      "Supervision remains a separately labelled responsibility"
    ],
    "sources": [
      "S04"
    ],
    "limits": "Public product-level description only. The graphic does not assert topology, certification, interfaces or a real deployment."
  },
  {
    "id": "etcs-balise",
    "label": "ETCS Level 1 base example",
    "description": "A passing telegram updates a continuously supervised train.",
    "components": [
      "etcs-level-1",
      "interlocking",
      "leu",
      "balise",
      "etcs-onboard",
      "lineside-signal",
      "train-detection",
      "odometry"
    ],
    "flow": [
      "Interlocking → LEU",
      "LEU → switchable balise",
      "Balise → passing reader",
      "Onboard equipment → continuing supervision"
    ],
    "sources": [
      "S15",
      "S16"
    ],
    "limits": "The selected base case omits infill and other operational variants."
  },
  {
    "id": "etcs-radio",
    "label": "ETCS Level 2 example",
    "description": "Compare radio exchange with detection and integrity choices.",
    "components": [
      "etcs-level-2",
      "rbc",
      "interlocking",
      "train-radio",
      "gsm-r-frmcs",
      "balise",
      "etcs-onboard",
      "odometry",
      "train-detection",
      "train-integrity"
    ],
    "flow": [
      "Interlocking information → RBC",
      "Train report ↔ radio exchange with RBC",
      "Movement information → onboard equipment",
      "Balise reference → position estimation"
    ],
    "sources": [
      "S15",
      "S17",
      "S18"
    ],
    "limits": "Detection configuration is selectable. A level label alone does not determine block principle or automation grade."
  }
];

SOURCES.push(...EXTRA_SOURCES);
CONCEPTS.push(...EXTRA_CONCEPTS);
