# Revision 9: representation, control boundaries and usable anatomy

1 November 2026

## Release status and baseline

This correction starts from Railway Anatomy **8.0.0**, Git commit [`a1bafe2a3e5a1ffde7dfb10a97fbd70172e410de`](https://github.com/haitaowu12/railway-anatomy/commit/a1bafe2a3e5a1ffde7dfb10a97fbd70172e410de), and prepares **9.0.0**. It responds to the review of inappropriate 3D process illustrations, uneven mechanism detail, difficult navigation and unclear boundaries between SCADA, BAS, ventilation control and other railway systems.

**Implementation and release-candidate verification are complete.** The final source passes the full repository check and deterministic release gate. The browser observations below are limited to the environments and journeys actually inspected. Publishing is a separate step: source changes alone do not establish that either public host has been updated.

## What changed for the learner

### Choose the representation that answers the question

The complete authored inventory now identifies **60 view routes and 148 comparison entries**. Each has an explicit representation and explanation: equipment, connections, process, evidence, dependencies or passenger journey. The inventory includes compatibility scenes retained in the code; its classification determines the appropriate learning surface rather than the mere existence of a 3D scene.

Process and information studies no longer depend on an arrangement of 3D boxes or record markers to explain a decision. Native diagrams separate roles, prerequisites, information, requests and observed results. The new **Structures & drainage** physical view preserves bridge load-transfer interfaces, bearings, abutments and an open culvert independently of inspection evidence or worksite authorization.

| Learning question | Revised destination and boundary |
|---|---|
| How are an inspection finding, work scope, observation and review related? | The infrastructure inspection process, with six stages and explicit evidence questions. Bridge and drainage anatomy remains separately inspectable. |
| What do depot movement restrictions, energy boundaries and displayed indications establish? | The work-protection process keeps their meanings and responsible contributions separate. Selecting a stage establishes no protection or permission. |
| What is needed for maintenance release, dispatch and handover? | Existing process maps retain the identified asset, unresolved matters, reviewed evidence and relevant allocation. Yard geometry supplies spatial context. |
| How do protection, driving, supervision and interlocking relate? | Control-family diagrams distinguish those functions, the selected communication medium and the train interfaces. A generic TCMS is not assumed to host every interface. |
| What changes when a dependency or accessible route is unavailable? | Available, unavailable and unknown states appear on the relevant nodes and paths, with text and symbols as well as colour. A lost main lift does not automatically make an alternative route usable. |
| What is the electrical supply and return path? | Architecture-specific diagrams retain the separate fourth-rail return or running-rail return and distinguish an AC primary return from an isolated secondary circuit. |

There are now **eight process studies with 42 stages**. The two additions cover infrastructure inspection/work evidence and work protection/energy boundaries. Existing configuration, acceptance, handback, maintenance release, duty handover and incident-coordination studies remain available. These are conceptual responsibility and evidence maps, not operating or maintenance procedures.

The full classification and mechanism findings are in [the representation audit](REPRESENTATION-AUDIT.md).

### Separate control functions and make optional interfaces explicit

The first-class **Interfaces** workspace covers 14 functions: traction power; building services; tunnel ventilation; station smoke control; fire detection and alarm; drainage; lifts and escalators; platform doors; signalling; passenger information and announcements; operational radio; security; network management; and auxiliary power.

Each function distinguishes field equipment, its local controller or protective logic, its native supervisory application, the transport path, the responsible role and an optional common station view. An RTU acquires or exchanges information; its presence does not make it the owner of every local control function. BAS/BMS and TVCS retain distinct responsibilities even when a project integrates their displays or hosts applications on a shared platform.

Three declared teaching arrangements allow separate supervision, shared status summaries or selected supervisory requests. A learner can then change an individual function to **not connected**, **monitoring only** or **selected requests plus monitoring**, where the example permits that capability. Functions that provide summaries to the common station view do not acquire unrelated command rights by changing a URL or selecting the integrated pattern. Their native applications retain their separate responsibilities.

Indication and request traces distinguish normal communication, a lost link, local control and missing returned feedback. A request, receipt, acceptance and observed equipment state remain different claims. An absent common interface does not imply that local control or the native application has disappeared. Cross-system examples describe both a possible interface and a credible arrangement in which that interface is absent.

The data includes 13 new public source records, ten cross-system examples and four bounded project comparisons. For example, the [Crossrail HVAC narrative](https://learninglegacy.crossrail.co.uk/documents/control-narratives-heating-ventilation-air-conditioning-system-stations-shafts-portals/) describes a particular BMS boundary, the [MTR ECS replacement procurement](https://www.mtr.com.hk/en/corporate/tenders/C4929-25E.html) describes a declared environmental-control scope, and the [Melbourne TVCS/BMS account](https://www.synertec.com.au/case-studies/melbourne-metro-tunnel-tvcs-bms/) describes interim design. These sources support the explanation that allocations vary. The explorer does not reproduce their complete installations, infer undisclosed interface permissions or treat planned procurement as completed work.

The detailed source rationale, conceptual corrections and implementation boundaries are in [the control-interface review](CONTROL-INTERFACES.md).

### Make physical motion meaningful and discoverable

Component selection exposes the relevant mechanism and resets its illustrated phase. Fixed structures, electronics and information records retain inspection and explanation without invented mechanical movement. Information-only 3D context does not offer unrelated mechanism playback, and the held-open door fault is distinguished from the normal door sequence.

| Assembly | Correction and its learning purpose |
|---|---|
| Installed vehicle doorway | A real opening, supported leaves, fixed guides, pulley/belt transmission, separate lock state and returned indication remain visible through the body cutaway. Closure alone does not establish locked proof. |
| Bogie bearing | Inner-ring rotation, cage orbit and roller spin satisfy the two no-slip contacts in the authored radial example. Mirrored assemblies rotate in the correct physical sense. |
| Vehicle HVAC | The installed unit shares the detailed filter, coil, fan and condensate assembly used in the service context. |
| Compressed-air supply | The original piston-compressor section has a constant-length rod, translating piston, clear bore and head interfaces, separate drying and receiver equipment, and an installation envelope clear of nearby equipment. |
| Disc brake | Opposed pads apply and release with a visible clearance; the study does not spin unrelated wheelsets. |
| Plant pump | The shaft and coupling reach the impeller and rotate together. This mechanism study does not start a fire-water system or establish a hydraulic result. |
| Lift | Car and counterweight suspension reaches the sheave through explicit wraps; opposing travel retains the total rope length. |
| Depot vehicle and wash gantry | Wheel rotation follows travel and the actual scaled contact radius. A moving gantry remains distinct from a stationary train. |
| Removed-door fixture | Pulleys, belt runs, clamps, hangers and guide rollers explain the same transmission relationship as the installed doorway. |

These are original schematic mechanisms. Their dimensions and illustrative timing are not supplier ratings, measured dynamics or evidence of operational suitability.

### Reduce navigation and reading friction

**Find anything** searches views, components, interfaces, processes and tours. Functional queries such as BMS, TVCS, pump level, ATP and duty handover resolve to the relevant destination. The sidebar groups the current workspace, while Jump to view and adjacent-view controls use the same destination rules. Contextual transitions preserve independent propulsion, control and electrification choices.

Interfaces bookmarks retain the selected function, pattern, individual connection overrides, information condition, trace and step. History restoration copies the settings rather than sharing a mutable connection object. Legacy station-control and process links resolve into the new learning surfaces. Guided process tasks and the control-interface tour use those surfaces while retaining the learning URL and progress context.

The regenerated static reading directory contains **329 concepts and 219 public references**. It resolves process owner identifiers to readable role names. Control concepts link to their specific Interfaces function; bridge and drainage concepts open physical anatomy; work and release concepts open processes. Source descriptions and public-use scopes accompany the source links. The review checks those recorded scopes, not the current availability or full text of all 219 external publications.

## Verification completed during implementation

The following records describe actual checks and their limits. They are not interchangeable with an integrated release or a rendered review.

| Evidence | Verified scope | What it does not establish |
|---|---|---|
| Full representation inventory | All 60 routes and 148 comparison entries have an explicit classification. Each comparison was instantiated at phases 0, 2.5 and 5: **444 finite-transform states**. | GPU rendering, visual legibility, performance or the suitability of legacy 3D proxies as a default. |
| `check-component-motion.mjs` | **14** new contracts execute shipping geometry, including both bearing contacts, door opening and transmission, compressor rod geometry, brake clearance, pump shaft, lift suspension, bridge contacts, culvert opening and depot wheel travel. | Loaded contact mechanics, flow, stress, fatigue, supplier design compliance or measured motion. |
| Existing focused geometry suites | **19** depth-mechanics, **8** motion, **11** domain-depth, **20** depot and **16** station/platform checks passed during the mechanical review. | A screenshot review of every route on every device. |
| `check-control-interfaces.mjs` | **9** checks cover function/source integrity, connection capabilities, local/native boundaries, degraded information, distinct concepts and event/timer lifecycle. | An industrial control implementation, fieldbus interoperability or railway authorization. |
| `check-system-diagrams.mjs` | **8** checks cover graph endpoints, source references, selected architecture and return paths, dependency consequences and accessible-journey availability. | A verified signalling design or an accessibility assessment of an installed railway. |
| `check-navigation.mjs` | **336** custom Interfaces URL round trips, plus **6** independent absent/link-loss/local/feedback/command-boundary cases; malformed settings, canonical cleanup, legacy redirects and immutable history restoration. Also retains 296 view/variant/mode cases, 40 vehicle combinations, 8 electrical bookmarks, 42 process stages and five functional finder regressions. | Browser layout, keyboard focus behaviour or persisted history across every browser engine. |
| `check-processes.mjs` | **7** checks cover process structure, accountable roles, references, branching and distinct outcome boundaries across eight studies and 42 stages. | Approval, safe work, acceptance or a universal sequence of activities. |
| `check-reading.mjs` | **6** checks read the generated artifact without regenerating it. They validate **347** app destinations, all 329 concept destinations, all 219 recorded source scopes, current process role labels, unique anchors and repository-subpath links. | Live publisher availability or a full-text review of all publications. |
| Limited desktop browser review | Actual app rendering in the managed browser at **1348 × 926**, using the **SVG compatibility renderer**. The Interfaces review caught the initial contrast/spacing defect and confirmed the corrected light, compact presentation. Its absent tunnel-to-common-view example displayed the disconnected path. | A WebGL/GPU rendering pass, mobile or tablet review, comprehensive screen-reader assessment or performance certification. |

The browser review also identified missing accessible labels on four Interfaces selects and ambiguous received-information wording. Those were corrected in source with explicit labels and **Native supervision** wording. The final rendered pass confirmed the accessible selectors, native-supervision wording and separated arrow labels. A guided-tour pass also verified its Interfaces surface, self-check and retained progress; the held-open door comparison hides the contradictory normal-motion controls.

## Final release-candidate verification

- `npm run check` passed with exit 0 against the final application source. All physical, data, navigation, tour lifecycle, interface and reading gates remained enabled.
- `npm run build` produced **9.0.0 / `24bf91cd44ca559c`**. `npm run check:release` verified all **135** version-consistent local dependencies and identity metadata.
- Browser checks exercised global search; immediate return context; the infrastructure and work-protection process maps; normal and lost-path dependency consequences; the separate structure/culvert model; installed-door framing, isolation and manual stages; and the static held-open fault case.
- Interfaces checks exercised an absent tunnel-to-common-view integration, selected supervisory requests with missing returned feedback, trace conclusion, context return and shared URL state. The SCADA/BAS tour remained a 2D Interfaces study and retained its optional self-check and progress.
- No application JavaScript exception was observed in the inspected routes. The managed browser reports WebGL unavailable and uses the SVG compatibility renderer; extension-generated metadata errors and the expected WebGL initialization failure are not represented as application failures.
- The current run did not exercise a hardware GPU, a mobile viewport or a screen reader. CSS breakpoints and semantic controls are present, but those facts do not establish visual acceptance on an untested device.

### Rendered evidence

| Evidence | What it records |
|---|---|
| [Optional control interface](audit-9/after-control-interfaces.jpg) | Local control, communications and native ventilation supervision remain visible while the optional common station connection is absent. |
| [Infrastructure evidence process](audit-9/after-infrastructure-process.jpg) | A 2D evidence/review map replaces the earlier 3D work and record markers. |
| [Installed door anatomy](audit-9/after-installed-door.jpg) | A selected installed mechanism is isolated, with the leaves open and the finite illustrated sequence retained. |

The existing public destinations are [GitHub Pages](https://haitaowu12.github.io/railway-anatomy/) and [GPT Sites](https://rail-systems-atlas.techiesea.chatgpt.site). Deployment verification compares each host’s `release.json` with the version and build above; the Pages workflow and the corresponding Sites saved-version deployment provide publication evidence separately from these source checks.
