# Content and interface integration review — 6 November 2026

## Coverage

This report covers the base view definitions, supply and control configuration explanations, numerical exercises and shared interface behavior. Separate entry ledgers cover [the core catalog and tours](content-review-core-2026-11-06.md), [mechanisms, processes and motion](content-review-operations-2026-11-06.md), [OCC and depot equipment](content-review-occ-depot-2026-11-06.md), [studies, electrical equipment and station interfaces](content-review-studies-2026-11-06.md), and [the whole railway, communications and control interfaces](content-review-network-communications-2026-11-06.md). The composed catalog contains 333 concepts and 239 source records. The generated reading guide is rebuilt from this reviewed canonical data.

Base explorer views reviewed: `system`, `substation`, `guideway`, `vehicle`, `bogie`, `lim`, `control`, `communications`, `services`.

Base atlas views and every variant reviewed: `track-support`, `rail-fastening`, `turnout`, `switch-drive`, `crossing`, `cbtc-network`, `signalling`, `etcs`, `seltrac`, `interlocking`, `train-detection`, `station`, `station-plant`, `tunnel-ventilation`, `ventilation-unit`, `station-networks`, `fire-systems`. The later `infrastructure-assets` and SelTrac overrides were included.

All four electrification profiles were reviewed: `fourth-rail-dc`, `third-rail-dc`, `overhead-dc`, `overhead-ac`. Both propulsion choices and all five train-control choices were reviewed with their configuration-dependent explanations.

The six workspace introductions and all five foundation studies were reviewed: `bogie-load-path`, `rotary-torque-path`, `lim-force-interface`, `fastening-interface`, `turnout-motion-evidence`.

All calculation and evidence exercises were reviewed, including their controls, states, results, units, assumptions and source notes:

| Exercise | Main relationship checked |
|---|---|
| `electrical-sections` | Current and energy balance; another source can feed a section through a closed tie; stale telemetry is independent of the circuit |
| `fan-working-point` | Fan/system curve intersection; component losses; speed similarity; air power versus electrical input |
| `wheel-rail-response` | Translating and rotating balances; slip definition; bounded contact force; release response |
| `measurement-evidence` | Independent repeatability and shared calibration covariance; coverage factor and comparability |
| `announcement-acoustics` | 60 dB decay definition; level difference and reverberation as separate effects |
| `radio-moving-timeline` | Independent access, association and fixed-transport records; exact event boundaries |
| `drainage-observations` | Conservation of water volume and independent movement observations |
| `change-impact-evidence` | Dependency reachability, evidence revision and unresolved issues |

Both electrical-principle sequences were reviewed: the ideal transformer’s five stages and the six-pulse bridge’s seven displayed positions. All native system diagrams, dependency comparisons and accessible-journey variants were reviewed through their shared definitions and endpoint checks.

## Corrections

The track-circuit description now explains that running rails can serve both detection and traction return. These are different functions and require electrical compatibility. The previous wording could be read as saying they always used separate physical conductors. Supporting references: [Network Rail’s track-circuit explanation](https://www.networkrail.co.uk/stories/track-circuits-explained/) and [Network Rail’s hosted paper on AC traction earthing and bonding](https://safety.networkrail.co.uk/wp-content/uploads/2022/05/Journal-2022-01-Vol140-Pt1_Earthing-and-Bonding-on-ac-Electrified-Railways.pdf), especially the description of traction-return running rails.

The ETCS Level 2 description includes the current grouping of arrangements formerly called Level 3, while retaining the distinction between level, detection/integrity provisions and automation. Reference: [European Commission — ETCS levels and modes](https://transport.ec.europa.eu/transport-modes/rail/ertms/what-ertms-and-how-does-it-work/etcs-levels-and-modes_en).

The general interlocking diagram now treats `detector-missing` as incomplete proof. It withholds the permissive output even when the physical blades and locks have reached their end positions. A regression covers this case alongside the stopped, unproved throw and normal proved case.

The fan, electrical, uncertainty, acoustic and wheel–rail equations were retained after checking their stated assumptions. Their accompanying language now explains the mechanism before its scope. Repeated lists of omitted phenomena were shortened without converting the examples into equipment performance claims or operating procedures. Sources include [DOE/AMCA’s fan sourcebook](https://www.energy.gov/sites/prod/files/2014/05/f16/fan_sourcebook.pdf), [NIST’s combined uncertainty guidance](https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-5-combined-standard-uncertainty), [NIST’s expanded uncertainty guidance](https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-6-expanded-uncertainty) and [Plexim’s three-phase bridge explanation](https://docs.plexim.com/plecs-demos/basic-topologies/three-phase-diode-bridge-rectifier/).

The selected conventional AC overhead feeder now has one breaker pole and one outgoing termination. The incoming three-phase supply retains three. Previously the shared geometry gave both arrangements three poles, contradicting the single-phase traction explanation. The close-up descriptions now distinguish the two. The actual scene-geometry test checks both pole counts and termination counts. Supporting reference: [Siemens AC traction supply and its one-/two-pole switchgear](https://www.mobility.siemens.com/global/en/portfolio/rail-infrastructure/electrification/ac-traction-power-supply.html).

## Reading and navigation

Shared UI text now uses direct labels such as “About this arrangement” and “Example observation record.” Explanation text uses 16 px type and 1.65 line height; secondary text and source links have been enlarged. Controls updated in this review use 44 px minimum targets, and search/select fields use 16 px text. Small-screen cards and process navigation reflow without forcing the entire page into a horizontal layout. Wide data tables scroll within their own containers.

Equipment and view search results support arrow keys, Home, End and Escape. Enter no longer activates a hidden equipment-search result after Escape. Existing deep links, browser history, configuration persistence and separate process/interface routes are preserved and covered by the navigation and learning-surface checks. Canonical and cross-project links use the primary Firebase hosts.

The unlinked `qa/layout.html` development fixture displays the real pages at 320, 375, 768 and 1280 CSS px. It is marked `noindex`. The visual checks target reflow, reading order, usable controls and local table scrolling, following the concerns described in [WCAG 2.2](https://www.w3.org/TR/WCAG22/). This review does not assert full WCAG conformance.

## Release checks

The repository gates remain `npm run check`, `npm run reading`, `npm run build` and `npm run check:release`. They cover data/source references, all view variants, model targets, configurations, process roles and edges, tours, hierarchy, numerical relationships, semantic diagrams, navigation, static reading parity and versioned release dependencies. Test assertions tied to revised labels were updated to the new labels while retaining their numerical and behavioral checks.

## Shared viewer inspection text

All public inspection labels and stage names, equipment descriptions and functional-path captions in `viewer.js` were read. This includes transformer windings/core, rectifier stacks, supply and traction switchgear, pantograph, LIM primary/secondary, bogie load path, rotary drive, speed sensing, sliding doors and onboard converters. The torque-path description now states its 12-tooth/24-tooth 2:1 reduction and distinguishes fixed stator/casing from supported rotating shafts. Other builder metadata is covered in the core and operations ledgers.

The previous depot-guide test required 600–900 words. That editorial length constraint was removed after the guide was shortened; source references, section headings and nonempty explanations remain checked. Tour-caption assertions now use the revised action labels while retaining exact process/step and single-surface assertions.

## Integrated release result

Railway Anatomy 10.3.0 passes the full `npm run check` gate: 39 top-level checks and all invoked model, route, process, numerical and reading suites, with zero failures. The final reading directory contains 333 concepts, 239 source records and 353 application destinations. `npm run build` and `npm run check:release` pass for build `8b086b50436fdb83`, including 150 version-consistent local dependencies and release identity metadata.
