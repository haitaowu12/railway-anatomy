# Railway studies, electrification and station-platform review

Review date: 6–7 November 2026. This report covers the four content modules below. It complements the core catalog, process, UI and integration reviews; it is not a claim that these four files contain the entire railway project.

## Reviewed scope

| Module | Coverage |
| --- | --- |
| `dist/studies-data.js` | All 38 concepts, 16 source notes after adding Q03, six view definitions, their 27 raw variants and both four-stage animation descriptions |
| `dist/studies-learning.js` | All six guides and 19 sections; all six tours, including explanations, actions, questions, 18 choices and 18 feedback entries |
| `dist/electrification-data.js` | All 30 concepts, seven source notes, four view definitions and five variants; all eight final-catalog patches |
| `dist/station-platform-data.js` | All four lift concepts, eight existing-concept updates, one source note, two views and seven variants, five platform animations plus the lift sequence, and one four-section guide |

The four modules declare **80 concept records**. The eight electrical patches overlap six of those records and also update `transformer` and `rectifier`, for **82 distinct final concept IDs reviewed**. There are **24 source notes**, **seven guides with 23 sections**, and **six tours** in this workstream.

There are 12 raw view definitions and 11 unique resolved views. `ELECTRIFICATION_VIEW_DATA.electrification` replaces the older two-variant definition with the shared four-profile chain. The resolved catalog has 37 variant records in this scope, including eight retained under the infrastructure and configuration process redirects. Those process routes open the corresponding process map, not the older physical comparison. The platform/lift animations contain 30 unique stages; the active adhesion sequence adds four. The older four-stage electrification animation was also read but is replaced in the shipping view.

The final combined catalog imported during verification contains 333 concepts and 239 sources. Q03 is the only source added by this workstream.

## Corrections

### AC feeder and switchgear arrangement

The former text and installed feeder geometry treated the three-pole AC close-up as a conventional contact-line feeder. Siemens distinguishes single- and two-pole traction switchgear from the three-pole distribution equipment on which some products are based. The revised content identifies the standalone three-pole close-up as **three-phase supply-side switchgear** and identifies the modeled contact-line feeder as **single-phase, with one switched pole**. The text also notes that autotransformer arrangements can use two-pole equipment.

The coordinating integration change in `dist/viewer.js` adds `phasePoles: 1` for installed AC traction feeders while preserving three poles in the standalone supply-side close-up. This report’s owner did not edit the viewer. The revised pole, feeder and variant descriptions match that distinction.

Primary source: [Siemens Mobility — AC traction power supply](https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/electrification/ac-traction-power-supply.html), especially the descriptions of Sitras 8DA11/8DA12 and their three-pole distribution origins.

### Configuration baseline and applicable evidence

The former baseline summary described it as the record of the version actually installed. A baseline is an agreed reference for controlled change; the observed installation and its as-built record are separate states to compare with it. The concept, guide and example now preserve those distinctions. A result from version A may support B where its applicability is established; neither changing a label nor matching a baseline automatically establishes test coverage.

Added Q03: [NIST — baseline configuration glossary](https://csrc.nist.gov/glossary/term/baseline_configuration). Existing Crossrail and INCOSE references continue to support record traceability and configuration-management context.

### Descriptions now match the current routes

Three physical asset cards now describe the active Structures & drainage section: formation, culvert and bridge. The inspection, work-boundary and follow-up cards now explain the infrastructure process rather than instructing the reader to inspect obsolete camera, hose or record-card geometry. All seven change concepts now describe the current configuration or handover process instead of referring to objects in the superseded A/B scene. The reading guides follow the same navigation.

The resolved guide composition already changes `infrastructure-work` to `infrastructure-assets` / `route-formation`; that existing integration behavior was retained. The process mappings for the ten affected concept cards were checked against `PROCESS_COMPONENTS`.

### Requested effort, applied braking and wheel motion

The adhesion animation scales its bar with applied effort during wheel-slide protection. Its former label called that bar a demand, which could imply that the controller changes the driver’s request. The label now says **Applied traction and brake effort**. The explanation distinguishes the requested effort, the torque actually applied and the resulting motion.

The sequence defines adhesion as available wheel–rail grip, explains spin and slide by comparing rotation with travel, and distinguishes wheel-slide protection from sanding. It retains one scope statement about illustrative rates rather than repeating performance disclaimers in each card.

Primary checks: [Knorr-Bremse — adhesion equipment](https://rail.knorr-bremse.com/en/us/portfolio/products-and-systems/braking-systems/adhesion/) and [wheel-slide protection technical article](https://rail.knorr-bremse.com/en/us/stories/technical-articles/content-page-wheel-slide-protection/). The existing RSSB and braking references remain attached to the entries.

### Electrical functions explained before details

The four supply arrangements now use one consistent account of collection, conversion and return. The transformer descriptions explain its separate winding circuits and magnetic coupling. The DC-link capacitor’s storage and smoothing roles are stated. The diode rectifier’s one-way behavior is connected to the need for a receiving train or other available braking-energy sink. Onboard and wayside resistor locations are identified as choices in these examples, not as a universal distinction between AC and DC trains.

Pantograph, shoe, running-rail return, bushing, busbar, switching pole and arc-chute entries start with the component’s function. Normal traction return is distinguished from protective earthing without implying that all railway bonding arrangements are identical. The three-phase close-up remains reachable independently of the selected traction supply.

### Station and passenger journey

The lift entries define car, landing, landing doors and traction sheave, then connect each term to the visible mechanism. The platform entries separate a closed contact, engaged lock and returned indication. The sensing text distinguishes trainway, train–barrier interspace, door closing edge and end gate. It defines LiDAR and radar briefly and follows the object from presence to evidence, report and related video.

The accessible-journey descriptions follow the trip from street to train. A lift outage, alternate lift and boarding aid now each answer a concrete route question. The guide keeps information and assistance alongside the physical route. The station overview distinguishes ordinary circulation from the station’s designated emergency-egress arrangements.

Primary terminology/mechanism checks: [KONE glossary](https://www.kone.com.au/tools-downloads/glossary/) and [Portalp electronic door control board](https://www.portalp-railway.com/en/our-solutions/platform-screen-doors/electronic-door-control-board/). The existing ERA, TransLink, RNIB, FTA, Siemens, Nippon Signal, Wabtec and platform-door references remain attached to their relevant content.

### Language and interaction clarity

Removed repeated claims about what the atlas did not copy, certify, authorize or reproduce, along with phrases about authored illustrations, invented history and internal source-review decisions. Source notes now state the document’s subject, edition and applicable context. Useful limits remain at the view or guide level where they change interpretation: schematic dimensions, illustrative timing, static AC traces, selected dependency behavior and electrical isolation.

The six tours retain their IDs, actions, answer indices and learning objectives. Three generic action labels now name the state they open: **Show wheel slide**, **Show shared power loss** and **Show the boarding gap**. Questions and feedback refer to the condition actually shown.

## Verification

- `node scripts/check-studies.mjs`: **12 checks passed**, including selected-supply geometry, wheel rotation/travel, WSP and sanding separation, lift outage and alternate route, boarding aid, and evidence-state separation.
- `node scripts/check-electrification.mjs`: **passed 48 profile/propulsion/view cases**, plus collector alignment, separated AC circuits, braking destinations, component separation, profile resets and stable anchors.
- `node scripts/check-station-platform.mjs`: **16 physical, configuration and mechanism contracts passed**, including door, contact, lock and indication sequencing, platform-state normalization, sensing alternatives, lift motion and component separation.
- Fresh imports of the three rewritten data exports matched the reviewed records. The final catalog contains all 82 scoped concept IDs and all their referenced sources.
- `git diff --check` passed for the four content modules after removing the extra trailing blank line in the learning module.

The checks exercise the shipping geometry and module composition. The coordinating agent owns the complete site, generated-reading, build, release and browser gates. No numerical performance or compliance model was added by this workstream.

## Exact coverage inventory

### Study concepts — 38

- `supply-conversion`
- `study-collector`
- `study-onboard-transformer`
- `study-converter`
- `study-drive`
- `study-return`
- `adhesion-contact`
- `adhesion-demand`
- `adhesion-reference`
- `adhesion-wsp`
- `adhesion-sander`
- `adhesion-brake`
- `route-formation`
- `route-drainage`
- `route-bridge`
- `route-inspection`
- `route-work-boundary`
- `route-record`
- `dependency-services`
- `dependency-power`
- `dependency-network`
- `dependency-identity`
- `dependency-configuration`
- `dependency-recording`
- `dependency-recovery`
- `access-entrance`
- `access-gate`
- `access-lift`
- `access-information`
- `access-assistance`
- `access-boarding`
- `change-item`
- `change-baseline`
- `change-requirement`
- `change-interface`
- `change-test`
- `change-issues`
- `change-acceptance`

### Electrical concepts — 30

- `transformer-core`
- `transformer-primary-winding`
- `transformer-secondary-winding`
- `transformer-tank`
- `transformer-bushing`
- `rectifier-diode-stack`
- `rectifier-cooling`
- `rectifier-busbar`
- `switchgear-pole`
- `switchgear-busbar`
- `switchgear-drive`
- `breaker-arc-chute`
- `overhead-contact-wire`
- `overhead-support`
- `pantograph`
- `pantograph-base`
- `pantograph-arms`
- `pantograph-head`
- `collector-positive-shoe`
- `collector-return-shoe`
- `wheel-return`
- `running-rail-return`
- `onboard-transformer`
- `line-converter`
- `line-converter-module`
- `dc-link`
- `inverter-power-module`
- `onboard-braking-resistor`
- `ac-feeder-switchgear`
- `supply-return-terminal`

### Lift concepts — 4

- `station-lift`
- `station-lift-car`
- `station-lift-landing-doors`
- `station-lift-drive`

### Station/platform updates — 8

- `platform-screen-door`
- `platform-door-drive`
- `platform-door-proof`
- `platform-response`
- `platform-alarm-video`
- `platform-gap-detector`
- `platform-end-gate`
- `station-egress`

### Electrical final-catalog patches — 8

- `supply-conversion`
- `study-collector`
- `study-onboard-transformer`
- `study-converter`
- `study-drive`
- `study-return`
- `transformer`
- `rectifier`

### Guides — 7

- `electrification-chain` — 4 sections
- `wheel-rail-response` — 3 sections
- `infrastructure-work` — 3 sections
- `service-dependencies` — 3 sections
- `passenger-journey` — 3 sections
- `configuration-handover` — 3 sections
- `station-platform-guide` — 4 sections

### Tours — 6

- `electrification-chain`
- `wheel-rail-response`
- `infrastructure-follow-up`
- `shared-dependencies`
- `accessible-journey`
- `configuration-evidence`

### Resolved views and variants

| View ID | Variant IDs | Current route |
| --- | --- | --- |
| `electrification` | `chain` | Model view |
| `adhesion` | `rolling`, `spin`, `slide`, `protection`, `sanding` | Model view |
| `infrastructure-care` | `inspect`, `work`, `complete`, `check` | Process: `infrastructure-maintenance` |
| `dependencies` | `normal`, `network-loss`, `power-loss`, `identity-loss`, `record-loss`, `restored`, `checked` | Model view |
| `accessible-journey` | `available`, `outage`, `alternative`, `aid-required`, `aid-placed` | Model view |
| `change-evidence` | `installed`, `baseline`, `tested`, `reviewed` | Process: `configuration-change` |
| `power-transformer` | `default` | Model view |
| `power-rectifier` | `default` | Model view |
| `power-switchgear` | `dc`, `ac` | Model view |
| `platform-interface` | `open-platform`, `platform-doors`, `interspace`, `platform-end` | Model view |
| `station` | `all`, `passenger`, `equipment` | Model view |

The raw study electrification variants `dc` and `ac`, including their four animation stages, were also reviewed. The final electrification module replaces them with `chain`.

### Animation coverage

| Animation ID | Stage count | Stage labels |
| --- | --- | --- |
| `sensing` | 5 | Defined zone → Object in the zone → Sensor evidence → Local report → Associated video |
| `boarding` | 7 | Closed and locked → Lock released → Leaves moving → Boarding opening → Closed contact → Bolt engaged → Locking indication |
| `openBoarding` | 5 | Parked at the open edge → Train doors opening → Open boarding doorway → Train doors closing → Leaves together |
| `interspace` | 4 | Object between boundaries → Sensing evidence → Interspace report → Review the reported condition |
| `end` | 4 | Gate closed → Latch withdrawn → Leaf turns → Open state reported |
| `station-lift` | 5 | At platform level → Doors closed → Between levels → Upper landing reached → Upper doors open |
| `adhesion` | 4 | Start comparison → Compare motion → Inspect the intervention → Compare effort and motion |

### Source notes — 24

Each source’s title, publisher, URL, description and scope was read. Existing stable source documents were reused; uncertain claims behind the substantive corrections were checked against the primary sources identified above. A source being listed here does not mean its entire publication was re-read in this pass.

- **E01** — [AC traction power supply](https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/electrification/ac-traction-power-supply.html) · Siemens Mobility
- **E02** — [Traction transformation — ABB Review 1/2012](https://library.e.abb.com/public/fc192d38056fa3b3c12579f20055483b/11-17%201m211_EN_72dpi.pdf) · ABB
- **E03** — [Traction Motor and Gear Box of Train Set — December 2019](https://indianrailways.gov.in/railwayboard/uploads/directorate/eff_res/camtech/ElectricalEngineering/YearWise/Booklet%20on%20Traction%20Motor%20and%20Gear%20Box%20of%20Train%20Set.pdf) · Indian Railways — CAMTECH
- **H01** — [Adhesion research](https://www.rssb.co.uk/research/flagship-research-activities/adhesion/) · RSSB
- **H02** — [Adhesion and anti-skid systems](https://rail.knorr-bremse.com/en/us/portfolio/products-and-systems/braking-systems/adhesion/) · Knorr-Bremse
- **I01** — [Landslips](https://www.networkrail.co.uk/rail-travel/delays-explained/landslips/) · Network Rail
- **I02** — [Inspecting our railway with the help of robots](https://www.networkrail.co.uk/stories/inspecting-our-railway-with-the-help-of-robots/) · Network Rail
- **I03** — [Bridges, tunnels and viaducts](https://www.networkrail.co.uk/our-work/looking-after-the-railway/bridges-tunnels-and-viaducts/) · Network Rail
- **R01** — [Guide to Operational Technology Security — NIST SP 800-82 Revision 3](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-82r3.pdf) · NIST
- **R02** — [Zoning and Conduits for Railways](https://www.enisa.europa.eu/publications/zoning-and-conduits-for-railways) · ENISA
- **A01** — [Guide for the application of the PRM TSI — version 2.0, 2023](https://www.era.europa.eu/system/files/2023-12/PRM_TSI_Guide.pdf) · European Union Agency for Railways
- **A02** — [How to Use Accessible Transit](https://www.translink.ca/rider-guide/transit-accessibility/how-to-use-accessible-transit) · TransLink
- **A03** — [Platform for Change: Making rail journeys more accessible](https://www.rnib.org.uk/professionals/research-and-data/reports-and-insight/platform-for-change-making-rail-journeys-more-accessible/) · RNIB
- **Q01** — [Certification Package Compilation Process — Revision 2.0](https://learninglegacy.crossrail.co.uk/wp-content/uploads/2023/05/CRL1-XRL-O4-GUI-CR001-50009-Rev-2.0-Certification-Package-Compilation-Process.pdf) · Crossrail Learning Legacy
- **Q02** — [Managing safety when investing in the rail network](https://www.orr.gov.uk/monitoring-regulation/rail/investing-rail-network/managing-safety) · Office of Rail and Road
- **Q03** — [Baseline configuration — glossary](https://csrc.nist.gov/glossary/term/baseline_configuration) · NIST
- **EL01** — [Third rail](https://www.networkrail.co.uk/our-work/looking-after-the-railway/track/third-rail/) · Network Rail
- **EL02** — [Understanding Track Engineering — Chapter 3, section 3.12](https://www.railei.org/wp-content/uploads/2022/04/UTE-Chapter-03.pdf) · Railway Engineering Institution (formerly PWI)
- **EL03** — [Contact lines](https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/electrification/contact-lines.html) · Siemens Mobility
- **EL04** — [Signalling considerations for electrification of the Auckland metropolitan rail network](https://irse.org.au/resource/2008-nov-skilton-clendon-signalling-considerations-for-electrification-of-the-auckland-metropolitan-rail-network/) · IRSE Australasia
- **EL06** — [High-speed DC circuit breakers for fixed installations — type UR](https://www.secheron.com/wp-content/uploads/2024/12/SG101001BEN_F27_Brochure_Circuit-breaker-DC_UR26-80S_12.24.pdf) · Sécheron
- **EL05** — [Traction Decarbonisation Network Strategy — interim programme business case](https://www.networkrail.co.uk/wp-content/uploads/2020/09/Traction-Decarbonisation-Network-Strategy-Interim-Programme-Business-Case.pdf) · Network Rail
- **EL07** — [Electrical Modelling of a DC Railway System with Multiple Trains](https://www.mdpi.com/1996-1073/11/11/3211) · Alnuman, Gladwin and Foster · Energies (2018)
- **SP01** — [Elevator and escalator glossary](https://www.kone.com.au/tools-downloads/glossary/) · KONE

## Remaining scope boundaries

No unresolved content defect was found within these four modules after the corrections and focused checks. The models remain qualitative teaching examples: they do not calculate adhesion, braking distance, electrical protection settings, station capacity or accessibility compliance. Those limits are stated once where they affect how to read a comparison. Source applicability is retained for the EU accessibility guide, the Great Britain change-assessment page and the dated NIST and project publications.
