# Railway Anatomy: processes, mechanics and learning-content review

Review cycle: 2026-11-06. Completed 2026-11-07 UTC.
Baseline: `e43f9fa5a0f49150be4ccaec90ed3dcf18adef74`.

## Scope and coverage

This part of the review read every active entry, caption, source description, source scope and functional-path label in the eight files below. Geometry and helper logic in the equipment factory were read alongside their descriptions. The entries were checked for technical consistency, beginner readability, source relevance, destination identity and consistency with the model or process they describe.

The OCC, depot, communications, control-interface and network modules were reassigned to the integration reviewer. Their coverage is recorded separately; they are not counted as completed by this part of the review. Imported guides retain their own module coverage.

| File | Full review coverage |
| --- | --- |
| `dist/process-data.js` | 12 roles; 6 base process maps and 31 steps; 4 GoA entries and 3 continuing-responsibility groups; 3 control families, 5 functions, 6 shared-device entries and 4 supplier examples; 2 reading guides with 11 sections; 11 base source records. |
| `dist/process-extensions.js` | 2 process maps and 11 steps, all edges/branches/outcomes, and source PR12. |
| `dist/depth-content.js` | 10 lessons and all 39 lesson steps; 2 dependency graphs, 17 nodes and 9 scenarios; all 4 point-record scenarios; sources DP01–DP07. |
| `dist/mechanical-content.js` | 4 mechanical lessons and sources MD01–MD09. |
| `dist/equipment-details.js` | Factory and all 14 helpers; every inspection label/function/interface; brake, air handler, compressor, rack services, transformer, rectifier and AC/DC switchgear paths; actuator/rotation relationships. |
| `dist/representation-guidance.js` | Every base view group, individual override, variant override and fallback; 142 resolved view/variant combinations checked during integration inventory. |
| `dist/reading-guides.js` | The 2 directly authored guides, 9 sections, source amendments, import wiring and infrastructure destination amendment. Imported guide text belongs to its authoring module’s review. |
| `dist/motion-guides.js` | All caption sequences, conditional captions, playback assignments and endpoint labels; imported turnout guide wiring checked. |

## Corrections

1. **Point-record quality and age:** `buildPointTrace()` used “Current example” as the quality for both prompt and delayed data. It now uses **Good** or **Uncertain** while retaining source time, arrival time and age as separate fields. The delayed explanation states that Good quality alone does not show whether a sample is recent enough. This follows the separation in OPC UA Part 4, section 7.11. The example uses a sample timestamp and elapsed seconds; it does not equate a generic sample time with every possible OPC UA timestamp usage.
2. **Work-protection flow:** movement protection and energy/access controls were chained as if one universally preceded the other. Both now branch from the defined work boundary and both feed the indication/evidence review. The diagram describes separate hazard responsibilities; the local procedure determines how protections are established or removed.
3. **Urgent infrastructure findings:** the assessment step now includes urgency, prompt notification and possible restrictions before planned work. The previous observation→assessment→planned-work flow omitted this consequence of an immediate concern. Network Rail’s structural-inspection account supports this distinction.
4. **Gear ratio:** the rotary lesson now identifies the 12-tooth motor pinion and 24-tooth axle gear. It states the 2:1 speed reduction and opposite rotation, eliminating the ambiguous “24:12 example” wording.
5. **LIM mechanism:** the lesson now explains that the travelling field induces currents in the reaction rail’s conducting layer and that their interaction creates thrust. It identifies the backing iron’s magnetic role and retains the wheels’ support/guidance role.
6. **Power-interface identity:** auxiliary supply and return terminals in the switchgear control strip were labelled as information interfaces because the entire strip shared one kind. The terminal helper now accepts a kind per terminal. Request and position remain information; auxiliary supply and return are power.
7. **AC phase count:** the equipment interface builder accepts `phasePoles`, supporting the integration reviewer’s single-phase traction-feeder correction. One-phase feeders get one termination and link; the existing three-phase supply close-up retains three. Functional-path labels distinguish those arrangements.
8. **ATO taxonomy:** ATO is linked to conventional/fixed-block arrangements as well as CBTC and ETCS. It is described as a driving function alongside protection, with onboard responsibilities determined by the automation grade. ATO remains separate from supplier, propulsion and communication technology.
9. **Plain-language mechanisms:** the compressor now explains inlet/delivery valve roles; the air handler distinguishes fan airflow from coil-fluid control; the announcement path connects the voice coil and cone to acoustic reception; the fastening lesson explains hold-down, support and electrical separation.
10. **Editorial revision:** repeated “original teaching,” implementation/builder references, non-access statements and lists of unrelated exclusions were replaced with direct explanations. Material distinctions remain where they change understanding: position versus locking, status versus isolation, work release versus movement permission, measurement conditions, model simplifications and architecture-specific limits.

## Process entry ledger

Every step’s title, owner, participants, inputs, action, outputs, check, links and sources was reviewed, together with the edges, rework branches and outcome.

- **configuration-change** (6 steps): `identify`, `assess`, `decision`, `implement`, `verify`, `reconcile`.
- **asset-handover** (5 steps): `boundary`, `package`, `readiness`, `acceptance`, `receive`.
- **worksite-handback** (5 steps): `scope`, `condition`, `interfaces`, `communicate`, `retain`.
- **maintenance-release** (5 steps): `need`, `deliver`, `release`, `return`, `allocate`.
- **duty-handover** (4 steps): `prepare`, `exchange`, `cross-check`, `continue`.
- **incident-coordination** (6 steps): `report`, `context`, `operational`, `passengers`, `technical`, `review`.
- **infrastructure-maintenance** (6 steps): `observe`, `assess`, `plan`, `record`, `review`, `handover`.
- **work-protection** (5 steps): `boundary`, `movement`, `energy`, `indication`, `communication`.

### Roles

`traffic-coordinator`, `signalling-controller`, `power-controller`, `station-team`, `incident-coordinator`, `depot-coordinator`, `fleet-maintenance`, `maintenance-work`, `verification-team`, `asset-responsibility`, `configuration-engineer`, `onboard-operator`.

### Automation and control taxonomy

- **GoA:** `goa1`, `goa2`, `goa3`, `goa4`.
- **Families:** `conventional`, `cbtc`, `etcs`.
- **Functions:** `protection`, `operation`, `supervision`, `route`, `detection`.
- **Shared devices:** `track-circuit`, `axle-counter`, `balise`, `interlocking`, `odometry`, `train-radio`.
- **Supplier examples:** `hitachi-seltrac`, `siemens-trainguard`, `alstom-urbalis`, `mermec-etcs`.

### Reading guides

- **understanding-railway-handovers:** Start with the subject; Configuration and change; Asset handover is a lifecycle interface; Worksite handback concerns a different boundary; Maintenance delivery, fleet readiness and duty continuity; Coordination continues while evidence develops.
- **people-automation-and-control:** Begin with responsibilities; GoA describes train-operating allocation; Passenger and field responsibilities remain visible; Keep families, functions and suppliers separate; A device can belong in several explanations.
- **point-machine:** Four rods, four connections; One arrangement among several; Read A, neither and B; Compare missing conditions.
- **turnout-wheels:** Set the route before passage; Follow the pair of rails; Separate support from guidance; Recognise different crossing families; Read the illustration at its intended scale.

## Depth and mechanism ledger

- **named-supervisory-point:** Field source; Acquisition; Record; Presentation.
- **shared-service-dependencies:** Supply; Delivery; Application; Retained evidence.
- **console-physical-path:** Input; Compute or remote interface; Display; Operator meaning.
- **air-treatment-path:** Air inlet and filtering; Heat exchange; Fan and measurement; Drainage.
- **station-door-evidence:** Mounting; Motion; Closed contact; Lock and sensing.
- **pump-working-section:** Inlet; Impeller and casing; Seal and support; System outlet.
- **electrical-physical-chain:** AC main bus; Interrupter poles; Outgoing terminations; Mechanism and observation.
- **brake-unit-to-test:** Rotating assembly; Reaction path; Application; Evidence.
- **maintenance-condition-evidence:** Observe on the vehicle; Compare with a removed wheelset; Inspect the evidence fixture.
- **announcement-service-path:** Delivery; Amplification; Output; Reception.
- **bogie-load-path:** Follow load through two suspension levels.
- **rotary-torque-path:** Separate torque from support.
- **lim-force-path:** Trace electrical input to direct thrust.
- **fastening-load-path:** Distinguish fastening and support.
- **station-information-service:** all nodes/edges; scenarios `normal`, `network-loss`, `recording-loss`, `application-loss`, `supply-loss`.
- **station-air-treatment:** all nodes/edges; scenarios `normal`, `fan-loss`, `coil-loss`, `drain-loss`.
- **Point records:** current, delayed, mismatched and uncertain.

### Motion sequences

All steps were read in the following authored sequences: wheelset/bearing/rotary drive; sliding doors; air handling; piston compressor; service brake; parking-brake variant; LIM field/current/thrust; fixed wash portal; mobile wash gantry; turnout/crossover passage; three point-machine cases; fixed crossing; track circuit; axle counter; balise and odometry; bogie drop; synchronized lifting jacks; underfloor wheel lathe; axial fan; air-handler fan; linked damper; centrifugal pump; station-plant air-handler override. Component-animation mappings on vehicle, services and bogie were checked. Straight/diverging turnout captions are imported from `turnout-journey.js`; their wiring was checked here and their content is covered by the core review.

### Representation mappings

- **Equipment and spatial context:** `system`, `substation`, `guideway`, `vehicle`, `track-support`, `rail-fastening`, `depot-overview`, `depot-maintenance`, `depot-workshop`, `depot-utilities`, `depot-support`, `railway`, `station`, `station-plant`, `fire-systems`, `power-switchgear`, `communications-network`.
- **Mechanical or physical illustration:** `bogie`, `lim`, `turnout`, `switch-drive`, `crossing`, `train-detection`, `ventilation-unit`, `platform-interface`, `adhesion`, `depot-wash`, `depot-components`, `services`.
- **Responsibilities and interfaces:** `control`, `communications`, `signalling`, `cbtc-network`, `etcs`, `seltrac`, `interlocking`, `station-networks`, `communications-overview`, `occ-supervision`, `communications-scada`.
- **Hardware and its information interfaces:** `communications-telephony`, `communications-passenger`, `communications-security`, `operations-centre`, `occ-workplace`, `occ-equipment`.
- **Ventilation equipment and air paths:** `tunnel-ventilation`.
- **Depot entry and spatial boundary:** `depot-yard`.
- **Measurement arrangement:** `depot-condition`.
- **Test conditions and evidence:** `depot-testing`.
- **People, conditions and decisions:** `depot-protection`, `infrastructure-care`, `occ-incident`.
- **Configuration and evidence:** `change-evidence`.
- **Service dependencies:** `dependencies`.
- **Passenger journey and assistance:** `accessible-journey`.
- **Supply and return architecture:** `electrification`.
- **Electrical principle:** `power-transformer`, `power-rectifier`.
- **Structures and drainage anatomy:** `infrastructure-assets`.
- **Dedicated override:** `occ-equipment`; logical views with equipment context disabled.
- **Variant overrides:** `crossing/diamond`, `station/passenger`, `station-plant/air`, `station-plant/water`, `fire-systems/water`, `tunnel-ventilation/smoke-objective`, `depot-yard/handover`, `depot-yard/dispatch`, `depot-support/planning`, `operations-centre/incident`, `operations-centre/handover`, `occ-workplace/handover`, `occ-equipment/display-loss`, `occ-equipment/alternate`, `depot-workshop/lathe`, `depot-workshop/ndt`, `depot-condition/roll-by`, `depot-components/traction`, `depot-maintenance/lifting`, `depot-maintenance/jacks`, `depot-maintenance/wheel-lathe`, `depot-wash/recovery`, `communications-telephony/operational-radio`, `communications-security/video`, `communications-scada/stale`.

## Source checks and provenance

The review retained the primary references attached to each entry and checked the sources below against the specific changed claims. Source checks were targeted at uncertainties and corrections; this report does not claim a new independent examination of every complete referenced manual or standard.

- [OPC Foundation, Part 4 §7.11](https://reference.opcfoundation.org/specs/OPC-10000-4/7.11): status quality, source timestamp and server timestamp are separate information. Used for the point-record correction.
- [Network Rail, structural inspections](https://www.networkrail.co.uk/stories/how-structural-inspections-improve-asset-management/): observation, engineering assessment, urgent escalation, work and follow-up.
- [ORR, Entities in Charge of Maintenance](https://www.orr.gov.uk/guide-rogs/8-entities-charge-maintenance-ecm): maintenance delivery/release and fleet-management return-to-operation distinctions.
- [Trane, commercial air handlers](https://www.trane.com/commercial/north-america/us/en/about-us/newsroom/glossary/air-handler.html): component roles and alternative arrangements.
- [KSB, volute casing pumps](https://www.ksb.com/en-global/centrifugal-pump-lexicon/article/volute-casing-pump-1117514): casing, impeller and support relationships.
- [Siemens Mobility, Trainguard MT](https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/mass-transit/communications-based-train-control-system.html): selectable train-control and automation arrangements; no numerical marketing claims were adopted.
- [Hitachi, acquisition announcement](https://www.hitachi.com/en/press/articles/2024/05/0603a/): completion of the Thales GTS acquisition on 31 May 2024. PR11 now points to this dated announcement.
- [TfL, historical rolling-stock data sheet](https://foi.tfl.gov.uk/FOI-1591-2425/2132-2021-Rolling_Stock_Data_Sheet_2nd_Edition%20protected.pdf): search-indexed equipment data identifies automatic operation of 1967 stock. Full PDF retrieval exceeded the research tool’s size limit; no detail beyond the indexed historical description was adopted.

### Source-record inventory

- **PR01** — [Systems Engineering Competency Framework — configuration management](https://www.incose.org/docs/default-source/professional-development-portal/isecf.pdf?sfvrsn=dad06bc7_4).
- **PR02** — [On-board Configuration Management for Testing and Commissioning Over a Large Fleet — public abstract](https://irse.org.au/resource/202410-zhu-fang-gonzalez-a-case-study-on-board-configuration-management-for-testing-and-commissioning-over-a-large-fleet/).
- **PR03** — [Operational Readiness](https://www.artc.com.au/work/contractors/operational-readiness/).
- **PR04** — [Rail Corridor Asset Handover — public overview](https://www.metrolinx.com/en/metrolinx-technical-standards/engineering-and-architectural-standards/rail-corridor-asset-handover).
- **PR05** — [The Investment Pathway — testing, handover and entry into service](https://www.orr.gov.uk/investment-pathway).
- **PR06** — [Network Access Manual Volume 2 — possession handback](https://railsafe.org.au/__data/assets/pdf_file/0006/54348/Network-Access-Manual-Volume-2.pdf).
- **PR07** — [AS 7704 Train Control Systems Change Management — public scope](https://www.ariso.org.au/products/as-7704-train-control-systems-change-management/).
- **PR08** — [Goal-setting Principles: additional factors for unattended passenger train operation (GoA4)](https://www.orr.gov.uk/sites/default/files/2024-07/railway-safety-principles-factors-for-safe-operation-of-goa4-uto.pdf).
- **PR09** — [Research: Unattended Train Operation](https://communityofmetros.org/research-unattended-train-operation/).
- **PR10** — [Trainguard MT — communications-based train control](https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/mass-transit/communications-based-train-control-system.html).
- **PR11** — [Acquisition of Thales’ Ground Transportation Systems](https://www.hitachi.com/en/press/articles/2024/05/0603a/).
- **PR12** — [How structural inspections improve asset management](https://www.networkrail.co.uk/stories/how-structural-inspections-improve-asset-management/).
- **DP01** — [Rail vehicle brake actuation](https://rail.knorr-bremse.com/en/gb/portfolio/products-and-systems/braking-systems/actuation/).
- **DP02** — [What is a commercial air handler?](https://www.trane.com/commercial/north-america/us/en/about-us/newsroom/glossary/air-handler.html).
- **DP03** — [Power Distribution Unit: technical system catalogue](https://www.rittal.com/imf/none/3_6070/7955311_Technical_system_catalogue_EN/).
- **DP04** — [Volute casing pump](https://www.ksb.com/en-global/centrifugal-pump-lexicon/article/volute-casing-pump-1117514).
- **DP05** — [OPC UA Part 4: DataValue](https://reference.opcfoundation.org/specs/OPC-10000-4/7.11).
- **DP06** — [Guide to Operational Technology Security, SP 800-82 Revision 3](https://csrc.nist.gov/pubs/sp/800/82/r3/final).
- **DP07** — [NXAIR medium-voltage switchgear: general technical requirements](https://ausschreibungstexte.siemens.com/tiplv/Data/E/Electrical_Distribution%2C_Industrial_Controls%2C_Building_Techn/Medium-Voltage_Switchgear_and_Protection/Air-Insulated_Medium-Voltage_Switchgear_up_to_24_kV%2C_/NXAIR_M_singl/General_technical_requirements_fo/%28LV_S8XFM1ZFVSZ4X0FH27G2ZSS5YC%29).
- **MD01** — [Railway technical handbook, Volume 1: axleboxes and wheelset bearings](https://cdn.skfmediahub.skf.com/api/public/0901d196801410ca/pdf_preview_medium/0901d196801410ca_pdf_preview_medium.pdf).
- **MD02** — [MoComp gear units](https://www.mobility.siemens.com/global/en/portfolio/rolling-stock-components/gear-units.html).
- **MD03** — [Spur gears: technical catalogue](https://khkgears.net/pdf/2025/spur-gears.pdf).
- **MD04** — [Railway technical handbook, Volume 2: drive systems](https://cdn.skfmediahub.skf.com/api/public/0901d1968020b9ca/pdf_preview_medium/0901d1968020b9ca_pdf_preview_medium.pdf).
- **MD05** — [e-Clip rail fastening system](https://www.pandrol.com/en-us/products/fastening-systems/fasteners/e-clip).
- **MD06** — [Rolling bearings for industrial machinery — 5.4.1 rotation and revolution of rolling elements](https://www.nsk.com/content/dam/nsk/common/catalogs/ctrgPdf/bearings/e1103c_parta.pdf).
- **MD07** — [Belt Drive Side Door Operator](https://door-spec.com/wp-content/uploads/2015/05/DOORspec_Belt_Drive_Side_Door_Operator_Product_Sheet.pdf).
- **MD08** — [LIFEDrive and S4 urban sliding-door architectures](https://www.ife-doors.com/en/products/door-drives-urban/).
- **MD09** — [LASTO BLOCK elastomeric structural bearings](https://www.mageba-group.com/ch/data/docs/en_US/2625/BROCHURE-LASTO-BLOCK-us-en.pdf?v=1.13).

## Verification

- `node scripts/check-processes.mjs` — 8 checks passed, covering 8 processes and 42 steps, references, reachable branches, roles, GoA and control taxonomy. Re-run after the ATO and role-text changes.
- `node scripts/check-depth-mechanics.mjs` — 19 contracts passed, including gear ratio, bearing motion, LIM clearances, brakes, point rods and functional-path identities.
- `node scripts/check-motion.mjs` — 9 checks passed, including finite captions, endpoint behaviour, crossing/turnout motion, point detection, track-circuit occupation, axle counts and balise reference retention.
- `node scripts/check-domain-depth.mjs` — 11 contracts passed, covering lessons, dependency cases, point records, physical paths, hardware identities and phase counts.
- Direct assertions passed for Good/Uncertain quality independent of age; both work-protection branches feeding evidence; one- and three-phase termination counts; auxiliary-supply terminal kinds.
- JavaScript syntax checks passed for the rewritten process and depth modules. The integration reviewer runs the full site, reading-generation, build and release checks after all modules are saved.

The checks exercise the authored data and model relationships. Browser layout/accessibility and final release verification belong to the integration review. No remote ref or deployment was changed by this review workstream.

## Additional mechanical-detail coverage

The full `mechanical-details.js` module was also reviewed, including `mark`, `piece`, `move`, `ring`, `spring`, `bearing`, `axlebox`, `suspension`, `primaryDetail`, `rotaryMotor` and `gearboxSupports`; all labels, inspection stages, interface descriptions and the LIM coupling path; compact and detailed geometry branches; bearing rotation formulas; and the 12-tooth/24-tooth gear relationship. The emergency spring now explains its backup load path when air-spring pressure is lost. The shared model note was shortened to a statement about simplified proportions and clearances.

## Additional model-metadata coverage

The final coverage reconciliation added four model modules. Every authored public inspection label, function description, functional-path caption, interface label and inspection-stage string in these files was read. Helper calls and the corresponding mechanisms were inspected to check what the text actually describes. This was a review of the complete public metadata in these modules, rather than a second audit of every numerical vertex.

| Module | Reviewed metadata and destinations |
| --- | --- |
| `platform-models.js` | `createPlatformAssemblies` and `buildPlatformView`; full-height belt drive and half-height side-post rack drive; supply/request/position/lock terminals; fixed guides, leaf hangers, mounting bases, closed contact, moving target, lock and keeper; processor modules/cover and platform-end gate/contact. Functional paths: `door-actuation`, `door-evidence`. |
| `point-machine-model.js` | `buildPointMachine`; enclosure and drive; A/B indication contacts; near/far operating and detector rods, clevis attachments and positive locks; all interface and inspection-stage descriptions. Functional path: `point-drive`. |
| `station-models.js` | Shared inspection helper and all authored annotations for UPS modules/battery trays/terminals; pump motor/coupling/shaft/seal/impeller/casing/inlet/outlet; axial fan; damper blades/common linkage; air-handler coil/fluid/condensate; lift machine/sheave/car/guide shoes/counterweight/ropes/car doors/landing doors and contacts. Functional paths: `station-ups-hardware`, `pump-fluid`, `pump-drive`, `fan-work`, `station-supply-air`, `station-coil-services`, `lift-mechanical`, `lift-landing-evidence`. |
| `studies-models.js` | All authored model metadata across the study branches, including infrastructure formation, rail section, sleepers, bridge deck/girders/bearings/abutments and culvert apron/invert/sidewalls/crown/passage. Functional paths: `bridge-load`, `culvert-passage`. Other study branches use component definitions reviewed in their authoring data modules. |

### Additional corrections

- Platform-door supply terminals had inherited the information type assigned to request and feedback terminals. Supply now uses `power`; the request, position and lock terminals remain `information`.
- The final air-handler annotation loop erased the condensate-pan function description. It now preserves the existing description when adding inspection stages and source references.
- Removed public text about a “solid primitive,” “functional actuator envelope,” an “original spiral,” and a generic “teaching assembly.” Replacements explain the part’s purpose or the relationship visible in the view.
- Explained the half-height rack-and-pinion drive, the pump’s motor-to-pump coupling and shaft seal, battery storage versus UPS conversion, and lift car doors versus each floor’s landing doors.
- Clarified how a laminated elastomeric bearing carries load while allowing limited deformation, and how its bonded reinforcement restrains rubber bulging. The culvert descriptions now define its bottom slab, sidewalls, top slab and end apron in plain language.

The changes retain the attached primary references: N03–N05 for platform hardware, PM01–PM04 for point mechanisms, DP02/DP04 for air treatment and pumping, F19/DP03 for supply equipment, SP01 for lifts, and I01–I03/MD09 for infrastructure and bearings.

### Additional verification

- JavaScript syntax checks passed for all four modules.
- `node scripts/check-station-platform.mjs` — 16 contracts passed.
- `node scripts/check-studies.mjs` — 12 checks passed.
- `node scripts/check-domain-depth.mjs` — 11 contracts passed after these changes.
- A direct model-harness check confirmed that all 4 constructed platform-door supply terminals use power metadata while requests remain information, and that the condensate-pan description survives the final annotation pass.

All four file saves were reported to the integration reviewer so the final release checks can use the updated files.
