# Railway Anatomy: representation and mechanism audit

Reviewed on 1 November 2026 for the post-release correction. This report audits the authored geometry and learning representation; current browser screenshots and navigation findings are recorded separately under the release audit.

## Findings that changed the product

| Finding | Correction | What the learner can now establish |
|---|---|---|
| Workflow states were encoded as freestanding 3D record cards, markers or equipment arrangements. | Every route and comparison has an explicit representation classification. Work coordination, configuration evidence, service dependencies and passenger journeys are routed to dedicated views; physical context is optional only where it adds a spatial explanation. | The difference between an object, observation, required condition, record and accountable decision. |
| A rendered mechanism did not necessarily have an accessible, meaningful animation. | Vehicle and services selection now chooses the relevant door, HVAC, compressor, brake or wheelset guide. Component choice resets the illustrated phase. Static components retain section and interface study, without invented movement. | What actually moves, what stays fixed and which physical relationship is being illustrated. |
| Bearings spun an inner ring but left rollers and cages still; the mirrored bearing rotated in the wrong physical sense. | Roller orbit and self-spin now follow the selected radial no-slip geometry; mirrored local axes are handled correctly. | Inner-ring rotation, slower cage orbit and roller self-spin are distinct. |
| Vehicle cutaway removed the entire near-side door assembly, and the doorway had a solid backdrop. | The cutaway removes body skin while retaining installed machinery. The doorway has a real aperture, fixed guides, suspended leaves, motor, pulleys, opposite belt runs, controller, targets, contacts and separate lock evidence. | Leaf closure, lock engagement and returned evidence can be inspected separately. |
| Installed HVAC was much less detailed than the workshop unit. | The installed vehicle now uses the same authored filter/coil/fan/condensate module as the service bench, at an installation scale. | The working section stays consistent between installation and maintenance context. |
| The compressor was a few solid primitives. | An original piston-compressor section now exposes a constant-length connecting rod, crank, translating piston, bore, head interfaces, inlet filter, drying section and receiver. It fits between the underfloor equipment, clear of the alternative line converter. | Compression mechanism, air treatment and storage are different physical functions. |
| The lift had an unconnected counterweight and incomplete suspension routing. | Two car-side ropes join two counterweight-side ropes through the sheave wrap. Car and counterweight move oppositely and total rope length is retained. | Drive, suspension, guidance and landing-door interfaces form one coherent arrangement. |
| The pump's shaft did not reach the impeller and its existing rotor motion was not exposed by the player. | A continuous shaft and coupling now connect the drive and impeller; plant-water and fire-water views expose a clearly labeled pump mechanism study. | Pump rotation is a physical study, separate from a fire alarm, start request, pressure calculation or sprinkler release. |
| Depot vehicles and the travelling wash gantry moved while their wheels stayed still. | Rotation now follows travel and the actual scaled radius. Gantry wheel centres now meet their rails correctly. | Relative movement distinguishes a fixed brush portal, a moving train and a moving gantry. |
| The removed-door fixture lacked a meaningful belt transmission and supported hangers. | Added driver and return pulleys, belt runs and wraps, moving clamps, hanger links and guide rollers. | The removed assembly demonstrates the same transmission principle as an installed doorway. |
| Moving the infrastructure workflow out of 3D risked losing useful physical content. | A separate Structures & drainage scene retains rail profiles, approach support, bridge deck, girders, bearing layers, abutments and a real open culvert. Work boundaries and record symbols are absent. | A structural load path and a drainage passage are physical interfaces, independently of inspection or release claims. |

## Representation policy

The default representation follows the learning question. **Equipment** means actual spatial containment or a physical mechanism. **Connections** shows logical endpoints, transported information, responsible functions and distinct power or signal paths. **Process** shows people, prerequisites and decisions. **Evidence** keeps identity, conditions, results and interpretation together. **Dependencies** shows prerequisites and the scope of a failure. **Journey** follows a passenger route and its information or assistance needs.

An enclosure, rail clip, filter, duct, circuit board, rectifier or record does not need fictional mechanical animation. A fixed component can still be inspected, sectioned, traced and compared. Information-only sequences are available in their two-dimensional connection diagrams; physical electronics inspection remains static. Electrical Play opens the circuit principle diagram. The door-closure fault comparison holds the door open and therefore does not offer the normal close-and-prove mechanism sequence. A visible lamp, request or animation endpoint does not prove safe operation or acceptance.

## Full route and comparison inventory

The inventory covers **60 view routes and 148 comparison entries**. Geometry was instantiated at three authored phases per entry (**444 finite-transform states**), including legacy scenes retained for compatibility. This construction check is not a claim that every old 3D proxy remains an appropriate default: the representation column controls that decision. It also is not a GPU, visual-accessibility or performance test.

Default classifications: equipment 84; connections 31; process 15; evidence 6; dependencies 7; journey 5. The physical-context column describes appropriate spatial inspection, which can be reached through a related equipment view; it does not promise an Equipment tab on process pages. Service dependencies deliberately have no 3D proxy.

The first-class Interfaces page separately covers 14 functional domains and three integration patterns. Eight process maps contain 42 selectable steps. The SCADA/BAS guided tour mounts the real interface explorer while retaining its learn URL, comparison state, self-check and Previous/Next navigation. Work-protection and infrastructure tours use the corresponding two-dimensional process steps. These learning routes do not load their legacy 3D proxies.

| View | Comparison | Default representation | Motion offered in this view | Physical context |
|---|---|---|---|---|
| Whole system (system) | default (default) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Substation (substation) | default (default) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Guideway (guideway) | default (default) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Vehicle (vehicle) | default (default) | Equipment and spatial context — equipment | Selected component only | Available where useful |
| Bogie & sensors (bogie) | default (default) | Mechanical or physical illustration — equipment | Wheelset, bearing and drive relationships | Available where useful |
| Linear motor (lim) | default (default) | Mechanical or physical illustration — equipment | Travelling field and the passive reaction rail | Available where useful |
| Control architecture (control) | default (default) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| Communication paths (communications) | default (default) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| Inside the vehicle (services) | default (default) | Mechanical or physical illustration — equipment | Installed door: unlock, drive, close and observe | Available where useful |
| Track support (track-support) | Ballasted (ballasted) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Track support (track-support) | Slab / direct fixation (slab) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Track support (track-support) | Embedded (embedded) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Rail fastening (rail-fastening) | Sleeper seat (sleeper) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Rail fastening (rail-fastening) | Direct fixation (direct) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Turnout / crossover (turnout) | Straight route (straight) | Mechanical or physical illustration — equipment | A wheelset along the selected route | Available where useful |
| Turnout / crossover (turnout) | Diverging route (diverging) | Mechanical or physical illustration — equipment | A wheelset along the selected route | Available where useful |
| Turnout / crossover (turnout) | Crossover (crossover) | Mechanical or physical illustration — equipment | A wheelset across two linked turnouts | Available where useful |
| Switch mechanism (switch-drive) | Position proved (proved) | Mechanical or physical illustration — equipment | Drive, lock and separate position indication | Available where useful |
| Switch mechanism (switch-drive) | Proof incomplete (unproved) | Mechanical or physical illustration — equipment | A throw without the target end indication | Available where useful |
| Crossing detail (crossing) | Crossing + check rail (frog) | Mechanical or physical illustration — equipment | Wheel support and flange guidance at a crossing | Available where useful |
| Crossing detail (crossing) | Diamond crossing (diamond) | Mechanical or physical illustration — equipment | Wheel support and flange guidance at a crossing | Available where useful |
| ATC / CBTC (cbtc-network) | Information flow (normal) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| Conventional (signalling) | Clear section (clear) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| Conventional (signalling) | Occupied section (occupied) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| ETCS alternatives (etcs) | Level 1 (level-1) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| ETCS alternatives (etcs) | Level 2 (level-2) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| Hitachi SelTrac (seltrac) | Legacy loop (loop) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| Hitachi SelTrac (seltrac) | Radio communications (radio) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| Hitachi SelTrac (seltrac) | G9 publication (g9) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | No 3D proxy |
| Interlocking (interlocking) | Conditions proved (proved) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | Available where useful |
| Interlocking (interlocking) | Proof incomplete (unproved) | Responsibilities and interfaces — connections | Static relationship / selected-case comparison | Available where useful |
| Detection (train-detection) | Track circuit (track-circuit) | Mechanical or physical illustration — equipment | Wheelset shunt and track-circuit indication | Available where useful |
| Detection (train-detection) | Axle counter (axle-counter) | Mechanical or physical illustration — equipment | Entry, exit and remaining axle counts | Available where useful |
| Detection (train-detection) | Balise (balise) | Mechanical or physical illustration — equipment | A passing reference followed by odometry | Available where useful |
| Station overview (station) | Whole station (all) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Station overview (station) | Passenger circulation (passenger) | Equipment and spatial context — equipment | Cabin movement between two landings | Available where useful |
| Station overview (station) | Equipment room (equipment) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Plant rooms (station-plant) | Electrical (electrical) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Plant rooms (station-plant) | Air treatment (air) | Equipment and spatial context — equipment | Plant air-handler: fan and stationary sections | Available where useful |
| Plant rooms (station-plant) | Fire-water (water) | Equipment and spatial context — equipment | Pump working section: shaft, impeller and fixed casing | Available where useful |
| Tunnel ventilation (tunnel-ventilation) | Normal objective (normal) | Ventilation equipment and air paths — equipment | Static inspection / comparison | Available where useful |
| Tunnel ventilation (tunnel-ventilation) | Smoke-management objective (smoke-objective) | Ventilation objective and control boundary — connections | Static relationship / selected-case comparison | Available where useful |
| Fan / damper / AHU (ventilation-unit) | Axial fan (fan) | Mechanical or physical illustration — equipment | Axial fan rotor and fixed air path | Available where useful |
| Fan / damper / AHU (ventilation-unit) | Damper (damper) | Mechanical or physical illustration — equipment | Actuator, common linkage and open-position indication | Available where useful |
| Fan / damper / AHU (ventilation-unit) | Air handler (air-handler) | Mechanical or physical illustration — equipment | Air-handler blower and treatment sections | Available where useful |
| Plant control interfaces (station-networks) | Power SCADA (power) | Responsibilities and interfaces — connections | User-stepped interface traces; no 3D proxy | No 3D proxy |
| Plant control interfaces (station-networks) | Station supervision (station) | Responsibilities and interfaces — connections | User-stepped interface traces; no 3D proxy | No 3D proxy |
| Plant control interfaces (station-networks) | Building automation (building) | Responsibilities and interfaces — connections | User-stepped interface traces; no 3D proxy | No 3D proxy |
| Fire & life safety (fire-systems) | Detect and indicate (detect) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Fire & life safety (fire-systems) | Communicate and support egress (notify) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Fire & life safety (fire-systems) | Water-based protection (water) | Equipment and spatial context — equipment | Pump working section: shaft, impeller and fixed casing | Available where useful |
| Platform & boarding edge (platform-interface) | Trainway sensing (open-platform) | Mechanical or physical illustration — equipment | Object, evidence and reported location | Available where useful |
| Platform & boarding edge (platform-interface) | Boarding mechanism (platform-doors) | Mechanical or physical illustration — equipment | Request, movement, closed contact and lock | Available where useful |
| Platform & boarding edge (platform-interface) | Interspace sensing (interspace) | Mechanical or physical illustration — equipment | Interspace evidence and report | Available where useful |
| Platform & boarding edge (platform-interface) | End access (platform-end) | Mechanical or physical illustration — equipment | End-gate latch, hinge and position contact | Available where useful |
| Control room (operations-centre) | Room layout (service) | Hardware and its information interfaces — equipment | Static hardware / selected information comparison | Available where useful |
| Control room (operations-centre) | Incident coordination (incident) | Event coordination — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Control room (operations-centre) | Duty handover (handover) | Operational handover — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Whole depot (depot-overview) | Facility layout (layout) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Whole depot (depot-overview) | Stabling (night) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Maintenance hall (depot-maintenance) | Inspection (inspection) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Maintenance hall (depot-maintenance) | Bogie drop (lifting) | Equipment and spatial context — equipment | Lower one bogie, then transfer the carrier | Available where useful |
| Maintenance hall (depot-maintenance) | Vehicle lifting (jacks) | Equipment and spatial context — equipment | Synchronized saddles raise the body | Available where useful |
| Maintenance hall (depot-maintenance) | Wheel lathe (wheel-lathe) | Equipment and spatial context — equipment | Installed wheelset and underfloor lathe | Available where useful |
| Wash plant (depot-wash) | Drive-through (wash) | Mechanical or physical illustration — equipment | Vehicle moving through fixed brushes | Available where useful |
| Wash plant (depot-wash) | Travelling gantry (mobile) | Mechanical or physical illustration — equipment | Moving gantry around a stationary vehicle | Available where useful |
| Wash plant (depot-wash) | Water circuit (recovery) | Mechanical or physical illustration — equipment | Static inspection / comparison | Available where useful |
| Work zones & energy (depot-protection) | Work-zone protection (work-zone) | People, conditions and decisions — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Work zones & energy (depot-protection) | Indication limits (indication) | People, conditions and decisions — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Railway overview (railway) | Train movements (movement) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Railway overview (railway) | Traction power (power) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Railway overview (railway) | Information links (information) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Arrival & yard (depot-yard) | Arrival (reception) | Depot entry and spatial boundary — equipment | Static inspection / comparison | Available where useful |
| Arrival & yard (depot-yard) | Work handover (handover) | Yard handover — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Arrival & yard (depot-yard) | Departure (dispatch) | Dispatch readiness — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Inspection & diagnosis (depot-condition) | Roll-by inspection (roll-by) | Measurement arrangement — equipment | Illustrated passage through fixed sensors | Available where useful |
| Inspection & diagnosis (depot-condition) | Stationary diagnosis (stationary) | Measurement arrangement — equipment | Static hardware / selected information comparison | Available where useful |
| Component maintenance (depot-components) | Brake bench (brakes) | Mechanical or physical illustration — equipment | Illustrative brake application and release | Available where useful |
| Component maintenance (depot-components) | Door rig (doors) | Mechanical or physical illustration — equipment | Illustrative sliding-door cycle | Available where useful |
| Component maintenance (depot-components) | HVAC unit (hvac) | Mechanical or physical illustration — equipment | Supply-air path through the cutaway unit | Available where useful |
| Component maintenance (depot-components) | Traction electronics (traction) | Mechanical or physical illustration — equipment | Static hardware / selected information comparison | Available where useful |
| Functional checks (depot-testing) | Stationary checks (stationary) | Test conditions and evidence — evidence | Static fixture and evidence interpretation | Available where useful |
| Functional checks (depot-testing) | Test road (movement) | Test conditions and evidence — evidence | Evidence diagram static; optional physical train passage | Available where useful |
| Wheel & bogie shop (depot-workshop) | Installed wheelset (lathe) | Equipment and spatial context — equipment | Installed wheelset and underfloor lathe | Available where useful |
| Wheel & bogie shop (depot-workshop) | Removed wheelset (wheelset) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Wheel & bogie shop (depot-workshop) | Non-destructive inspection (ndt) | Equipment and spatial context — equipment | Wheelset and fixed inspection fixture | Available where useful |
| Wheel & bogie shop (depot-workshop) | Bogie workshop (bogie) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Facility services (depot-utilities) | Power & air (services) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Facility services (depot-utilities) | Water & drainage (water) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Stores & work planning (depot-support) | Materials (materials) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Stores & work planning (depot-support) | Work & release (planning) | Planning and release evidence — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Console anatomy (occ-workplace) | Local computer (task) | Hardware and its information interfaces — equipment | Static hardware / selected information comparison | Available where useful |
| Console anatomy (occ-workplace) | Remote computer (shared) | Hardware and its information interfaces — equipment | Static hardware / selected information comparison | Available where useful |
| Console anatomy (occ-workplace) | Duty handover (handover) | Workplace handover — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Technical equipment (occ-equipment) | Connected (normal) | Equipment and display dependencies — connections | Static relationship / selected-case comparison | Available where useful |
| Technical equipment (occ-equipment) | Display unavailable (display-loss) | Display dependency — connections | Static relationship / selected-case comparison | Available where useful |
| Technical equipment (occ-equipment) | Alternate host (alternate) | Alternative workplace dependency — connections | Static relationship / selected-case comparison | Available where useful |
| Information behaviour (occ-supervision) | Traffic (traffic) | Responsibilities and interfaces — connections | Information sequence in Connections; hardware static | No 3D proxy |
| Information behaviour (occ-supervision) | Power (power) | Responsibilities and interfaces — connections | Information sequence in Connections; hardware static | No 3D proxy |
| Information behaviour (occ-supervision) | Station (station) | Responsibilities and interfaces — connections | Information sequence in Connections; hardware static | No 3D proxy |
| Incident coordination (occ-incident) | Reported (reported) | People, conditions and decisions — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Incident coordination (occ-incident) | Acknowledged (acknowledged) | People, conditions and decisions — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Incident coordination (occ-incident) | Coordinated (coordinated) | People, conditions and decisions — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Electrification chain (electrification) | Complete chain (chain) | Supply and return architecture — connections | Static relationship / selected-case comparison | Available where useful |
| Wheel–rail response (adhesion) | Rolling (rolling) | Mechanical or physical illustration — equipment | Read rotation against travel | Available where useful |
| Wheel–rail response (adhesion) | Wheel spin (spin) | Mechanical or physical illustration — equipment | Read rotation against travel | Available where useful |
| Wheel–rail response (adhesion) | Wheel slide (slide) | Mechanical or physical illustration — equipment | Read rotation against travel | Available where useful |
| Wheel–rail response (adhesion) | Slide protection (protection) | Mechanical or physical illustration — equipment | Read rotation against travel | Available where useful |
| Wheel–rail response (adhesion) | Sanding (sanding) | Mechanical or physical illustration — equipment | Read rotation against travel | Available where useful |
| Infrastructure maintenance (infrastructure-care) | Inspect (inspect) | People, conditions and decisions — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Infrastructure maintenance (infrastructure-care) | Work in progress (work) | People, conditions and decisions — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Infrastructure maintenance (infrastructure-care) | Work complete (complete) | People, conditions and decisions — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Infrastructure maintenance (infrastructure-care) | Check recorded (check) | People, conditions and decisions — process | Selected process/evidence steps; no timed 3D workflow | Available where useful |
| Shared dependencies (dependencies) | Connected (normal) | Service dependencies — dependencies | Static relationship / selected-case comparison | No 3D proxy |
| Shared dependencies (dependencies) | Path A lost (network-loss) | Service dependencies — dependencies | Static relationship / selected-case comparison | No 3D proxy |
| Shared dependencies (dependencies) | Shared power lost (power-loss) | Service dependencies — dependencies | Static relationship / selected-case comparison | No 3D proxy |
| Shared dependencies (dependencies) | Identity unavailable (identity-loss) | Service dependencies — dependencies | Static relationship / selected-case comparison | No 3D proxy |
| Shared dependencies (dependencies) | Recorder unavailable (record-loss) | Service dependencies — dependencies | Static relationship / selected-case comparison | No 3D proxy |
| Shared dependencies (dependencies) | Restored, unchecked (restored) | Service dependencies — dependencies | Static relationship / selected-case comparison | No 3D proxy |
| Shared dependencies (dependencies) | Evidence checked (checked) | Service dependencies — dependencies | Static relationship / selected-case comparison | No 3D proxy |
| Accessible journey (accessible-journey) | Route available (available) | Passenger journey and assistance — journey | Static relationship / selected-case comparison | Available where useful |
| Accessible journey (accessible-journey) | Lift unavailable (outage) | Passenger journey and assistance — journey | Static relationship / selected-case comparison | Available where useful |
| Accessible journey (accessible-journey) | Alternate lift (alternative) | Passenger journey and assistance — journey | Static relationship / selected-case comparison | Available where useful |
| Accessible journey (accessible-journey) | Boarding aid needed (aid-required) | Passenger journey and assistance — journey | Static relationship / selected-case comparison | Available where useful |
| Accessible journey (accessible-journey) | Aid in place (aid-placed) | Passenger journey and assistance — journey | Static relationship / selected-case comparison | Available where useful |
| Configuration & handover (change-evidence) | Installed, unmatched (installed) | Configuration and evidence — evidence | Selected process/evidence steps; no timed 3D workflow | No 3D proxy |
| Configuration & handover (change-evidence) | Baseline matched (baseline) | Configuration and evidence — evidence | Selected process/evidence steps; no timed 3D workflow | No 3D proxy |
| Configuration & handover (change-evidence) | Test recorded (tested) | Configuration and evidence — evidence | Selected process/evidence steps; no timed 3D workflow | No 3D proxy |
| Configuration & handover (change-evidence) | Reviewed handover (reviewed) | Configuration and evidence — evidence | Selected process/evidence steps; no timed 3D workflow | No 3D proxy |
| Locations & connections (communications-overview) | Supervision (supervision) | Responsibilities and interfaces — connections | Static hardware / selected information comparison | Available where useful |
| Locations & connections (communications-overview) | Passenger services (passenger) | Responsibilities and interfaces — connections | Static hardware / selected information comparison | Available where useful |
| Locations & connections (communications-overview) | Operational voice (voice) | Responsibilities and interfaces — connections | Static hardware / selected information comparison | Available where useful |
| Network equipment (communications-network) | Station rack (station) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Network equipment (communications-network) | Onboard network (onboard) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| SCADA interfaces (communications-scada) | Field indication (status) | Responsibilities and interfaces — connections | Information sequence in Connections; hardware static | No 3D proxy |
| SCADA interfaces (communications-scada) | Request and feedback (command) | Responsibilities and interfaces — connections | Information sequence in Connections; hardware static | No 3D proxy |
| SCADA interfaces (communications-scada) | Stale indication (stale) | Responsibilities and interfaces — connections | Static inspection / comparison | No 3D proxy |
| Calls & radio (communications-telephony) | Passenger help point (help-point) | Hardware and its information interfaces — equipment | Information sequence in Connections; hardware static | Available where useful |
| Calls & radio (communications-telephony) | Operational radio (operational-radio) | Hardware and its information interfaces — equipment | Static inspection / comparison | Available where useful |
| Information & audio (communications-passenger) | Information delivery (information) | Hardware and its information interfaces — equipment | Information sequence in Connections; hardware static | Available where useful |
| Information & audio (communications-passenger) | Announcement (announcement) | Hardware and its information interfaces — equipment | Information sequence in Connections; hardware static | Available where useful |
| Video & access (communications-security) | Video chain (video) | Hardware and its information interfaces — equipment | Static inspection / comparison | Available where useful |
| Video & access (communications-security) | Door state (access) | Hardware and its information interfaces — equipment | Information sequence in Connections; hardware static | Available where useful |
| Transformer assembly (power-transformer) | Assembly (default) | Electrical principle — connections | One AC cycle through an ideal transformer | Available where useful |
| Rectifier assembly (power-rectifier) | Assembly (default) | Electrical principle — connections | One three-phase cycle through a diode bridge | Available where useful |
| Switchgear assembly (power-switchgear) | DC feeder (dc) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Switchgear assembly (power-switchgear) | AC switchgear (ac) | Equipment and spatial context — equipment | Static inspection / comparison | Available where useful |
| Structures & drainage (infrastructure-assets) | Physical section (assets) | Structures and drainage anatomy — equipment | Static inspection / comparison | Available where useful |

## Verification

- `scripts/check-component-motion.mjs`: 14 new contracts execute shipping geometry. They check representation coverage, component-specific motion, both bearing contacts, mirrored bearings, stationary wheelsets during information timelines, door aperture/guide/lock proof, compressor rod and installed envelope, opposed brake pads, pump coupling, lift suspension length, infrastructure load contacts and culvert opening, moving depot wheels and removed-door transmission.
- `scripts/check-learning-surfaces.mjs` executes the production tour/render dispatch: interface explorer mounting and teardown, retained lesson identity and progress, one active self-check, intended process steps and absence of a 3D proxy. Navigation checks additionally cover interface-tour comparison URLs and return context.
- Actual model-anchor checks retain physical coverage and execute the production functional route for the seven new interface-only concepts rather than inventing meshes. The exploration harness executes the current component-aware guide/animation policy, resets the phase when the selected mechanism changes and rejects information pulses as physical movement.
- Existing mechanical inspection checks retain physical-instance identity, repeated-instance isolation, real ray picking, gearbox ratios and motor clearances, the local bearing inspection recipe and camera fit.
- Existing depot and station/platform checks retain lifting support, lathe/roller contact, passive measurement, facade opening, independently observed door lock, landing alignment and damper-linkage geometry.
- Every view/variant was instantiated with finite transforms at phase 0, 2.5 and 5. Source references remain separate from original illustrative dimensions.
- Browser interaction, deployment parity and current rendered screenshots are verified in the release workflow; they are not inferred from these headless checks.

## Sources and limits of the new mechanisms

- [NSK rolling-bearing technical data, §5.4.1](https://www.nsk.com/content/dam/nsk/common/catalogs/ctrgPdf/bearings/e1103c_parta.pdf) supports distinguishing ring rotation, cage revolution and rolling-element spin. The model uses its own radial race dimensions with no slip; no loaded contact, cage-slip or life prediction is supplied.
- [DOORspec belt-drive door operator](https://door-spec.com/wp-content/uploads/2015/05/DOORspec_Belt_Drive_Side_Door_Operator_Product_Sheet.pdf) supports the selected motor/belt/guide/locking architecture. [IFE urban door families](https://www.ife-doors.com/en/products/door-drives-urban/) show why independent-leaf and spindle/plug architectures must not be treated as identical. The model's sizes, phase timings and proof sequence are original explanatory values.
- [Knorr-Bremse air supply](https://rail.knorr-bremse.com/en/se/portfolio/products-and-systems/braking-systems/supply/) documents piston and screw arrangements and separate drying/monitoring functions. The original single-cylinder section teaches geometry, not a supplier's multi-cylinder package, delivery rate or pressure response.
- [mageba structural-bearing overview](https://www.mageba-group.com/ch/data/docs/en_US/2625/BROCHURE-LASTO-BLOCK-us-en.pdf?v=1.13) supports laminated elastomeric bearing anatomy. [Network Rail structures](https://www.networkrail.co.uk/our-work/looking-after-the-railway/bridges-tunnels-and-viaducts/) supplies railway asset context. Neither is used to claim that the teaching bridge has adequate capacity.
- Existing references MD01–MD05, DP01–DP04, SP01 and I01–I03 continue to support the bogie, brake, fan/pump, lift, formation and drainage distinctions. All geometry remains an original generic teaching composition.
