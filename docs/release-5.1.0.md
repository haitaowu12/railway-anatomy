# Railway Anatomy 5.1.0 release review

**Status: published to GitHub Pages; source checks, rendered Chrome review and live smoke verification passed.**

The candidate adds all six teaching layers from the 5.0.0 coverage roadmap and carries the focused frontend refinement forward. Totals are **261 concepts, 143 public references, 50 model views, 32 guided tours and eight system guides** across the existing nine domains. Published through [PR #3](https://github.com/haitaowu12/railway-anatomy/pull/3), merge `2e2fd5366224082692bd0b5d4154632c601d1902`. The [GitHub Pages workflow](https://github.com/haitaowu12/railway-anatomy/actions/runs/41259702114) passed both packaging/checks and deployment. [Open the live atlas](https://haitaowu12.github.io/railway-anatomy/).

## Six connected studies

| Study | Visible change and teaching distinction |
|---|---|
| Electrification chain | DC conductor shoes, wayside rectification and separate return are replaced together by overhead collection, AC supply, onboard transformation/line conversion and rail return. The transformer’s primary and secondary circuits remain separate. |
| Wheel–rail response | A marked wheel and independent travel reference show rolling, spin and slide. Opposing brake pads contact the disc without penetration, protection modulates their movement, and a separate sand nozzle delivers grains ahead of the contact. |
| Infrastructure maintenance | A sloped earthwork, open culvert and small bridge connect track support with drainage and structural interfaces. Inspection, cleaning, completed work and a recorded check retain the independent bearing observation and fixed boundary. |
| Shared dependencies | Actual service traces distinguish conduit, common power, identity and recorder loss. Field equipment remains in place. Restored connectivity does not remove a configuration mismatch or fill a recording gap. |
| Accessible journey | A fictional street/gate/two-lift/platform/doorway composition changes its selected route for lift outage, an alternate lift and boarding-aid states. Stairs remain separate from the selected step-free route; the bridging plate spans the actual gap. |
| Configuration & handover | Installed B equipment, A/B baseline and test subjects, two-channel evidence, separate RAMS questions, issue disposition and a reviewed decision are represented separately. |

Each study has an explanatory guide and one new guided question with answer-specific feedback. New content links to the original component and maintenance contexts. The power and adhesion studies are self-contained rotary-drive examples; stored propulsion and control choices elsewhere cannot overwrite their narratives or change their equipment.

## Frontend refinement

The existing dark model stage, restrained palette and hierarchy remain. A labelled native view picker replaces the clipped horizontal tab strip below desktop width. The sidebar retains its view list on desktop. Repeated navigation instructions and selected-component labels were reduced; comparison and assembly targets grew; inspector body text increased; the field guide and static reading directory use simpler separators and more readable text. Static reading presentation now has its own maintained stylesheet.

The [frontend follow-up](frontend-follow-up-2026-10-31.md) identifies the retained baseline captures, observed issues and intended corrections. Matched 1200×900 before/after captures confirm the focused change, with narrow review at 390×844. The model remains dominant; control labels and explanation text are readable. No broader visual identity change was needed.

## Public sources and content review

Fifteen added public references cover conventional AC supply/conversion, adhesion and mitigation, infrastructure inspection, OT/railway dependencies, passenger access and research, and configuration evidence. Source cards name their scope. The AC vehicle explanation uses ABB’s conventional Figure 2 rather than its experimental transformer. NIST Revision 3 is treated as published guidance, while Revision 4 was listed as a draft at review. ERA and ORR material retains its jurisdiction; the RNIB entry is explicitly a public research summary.

The six new questions received a bounded independent text crosscheck using the installed Gemini helper. It exited zero, reported `helper_status=SUCCESS`, contained no tool attempts and returned a usable answer. Its independently derived zero-based answer key was **1, 2, 0, 1, 2, 0**, matching all six questions. A second crosscheck of three refined distractor sets retained their keys. Its component-mapping concerns were checked against the actual contract: a variant’s default representative is not its only visible component, and `sourceConcepts` refers to catalog concepts. The configuration lesson intentionally selects the old test record in the baseline-matched state. No supported text defect remained. This is a review signal; the source inspection and geometry checks remain the evidence for the actual implementation.

All geometry, item versions, records, layouts and scenarios are authored examples. No private project identifiers, source assets, real security settings or operating procedures were introduced.

## Local verification

Node 24.18.1 runs `npm run reading`, `npm run check` and `git diff --check`. The regenerated directory contains all 261 concepts, 143 sources and eight guides.

The existing suite covers site/content integrity, actual model geometry, independent technology combinations, **260 navigation round trips**, 40 independent vehicle configurations, 19 depot checks, 10 OCC checks, assembly isolation/separation/restoration, camera fitting and measured label placement. Twelve added checks execute the shipping study geometry and animation to verify:

- All arrangement geometry is finite and every advertised component context contains visible selectable equipment.
- AC/DC collection, conversion and primary return change together.
- Rolling rotation matches the illustrated travel and radius; spin/slide differ; the brake disc stays aligned to its axle.
- Protection modulates the pads; sanding remains a separate mechanism; opposing pads contact and release at the actual disc faces.
- The formation leaves a real culvert opening; work and follow-up states retain the bearing observation and boundary.
- Communications, shared power, identity and recording loss affect different service paths; a historical gap survives restoration checks.
- Lift outage interrupts the route; an alternate lift provides a different path; the boarding plate aligns with the platform and spans to the doorway.
- Baseline identity, test subject, issue disposition and reviewed decision change separately.
- Stored propulsion/control combinations cannot replace a study explanation.

Model-only exports from the shipping SVG renderer were inspected for all six representative scenes. They informed geometry/framing corrections, including the culvert opening, sloped formation, repeated lift/service anchors and the visible vehicle boarding interface. These exports are geometry review artifacts, not screenshots of the application or evidence of browser interaction.

## Browser verification

The native Codex Chrome connection rendered the application in Chrome 156. The existing canvas reported **Schematic · 3D** and **ANGLE Metal Renderer: Apple M2 Pro**. This supplies hardware-backed WebGL evidence for the tested views on this Mac; it does not qualify other hardware or measure performance across devices.

Matched OCC baseline/candidate captures used **1200×900** CSS viewports. Study captures used **1440×900**; narrow review used **390×844**. The OCC, five new study views and static reading directory had no page-level horizontal overflow in the narrow checks. Review exercised the six studies and representative alternatives, all six new quiz feedback paths, an incorrect-answer retry, searches for all six new guides, a public source destination, phase/animation controls, reduced-motion loading and picker/history restoration.

GPU review found that the studio backdrop concealed the below-datum earthwork and culvert. The infrastructure view now places its backdrop below that geometry and restores the normal backdrop when leaving. The production-viewer regression failed before that fix and passes afterward. Fresh-context Chrome captures confirm the corrected earthwork and bridge supports; switching back to the OCC was checked in the same app instance.

**Remaining limits:** physical keyboard selection of the native picker was not established through the connector. Its key sequence also failed on a plain native select, so this is not evidence of an app-specific defect. Option selection, hash updates and Back/Forward restoration passed. Mobile Safari, other GPU/device combinations and quantitative performance are unverified. The diagrams remain schematic explanations rather than qualified physical, operating or accessibility simulations.

## Live verification

A fresh Chrome context checked the published site after deployment. All six new study routes loaded with their intended titles, variants and 3D canvases. The header showed 32 tours, and the static directory showed 261 concepts and 143 references. The corrected infrastructure geometry was visible in hardware-backed WebGL. At 390×844, the picker changed the live OCC view and hash without page-level overflow; the reading page also had no horizontal overflow. The shared-dependencies question returned its refined distractor feedback and then accepted the correct answer. Chrome reported no console errors or warnings. The native-picker physical-keyboard evidence limit above remains.

The publication receipt updates documentation and screenshots only; it does not change the deployed `dist/` artifact.

## Captures

These are actual browser screenshots. Final study captures use fresh contexts after the backdrop correction.

| Evidence | View |
|---|---|
| [OCC before](evidence-r3/occ-before-1200.png) / [OCC after](evidence-r3/occ-after-1200.png) | Matched 1200×900 baseline and refined picker/type/layout |
| [Narrow OCC](evidence-r3/occ-phone-390.png) | 390×844 controls, model and labels |
| [AC electrification](evidence-r3/electrification-ac.png) | Conventional overhead collection and onboard chain |
| [Wheel slide](evidence-r3/adhesion-slide.png) | Wheel, brake, demand and independent travel reference |
| [Infrastructure check](evidence-r3/infrastructure-check.png) | Corrected GPU earthwork, culvert, bridge and retained observation |
| [Shared power loss](evidence-r3/shared-power-loss.png) | Applications and field equipment retained while service paths disappear |
| [Boarding aid](evidence-r3/passenger-boarding.png) | Platform-to-doorway connection and distinct passenger interfaces |
| [Reviewed handover](evidence-r3/configuration-handover.png) | Installed item, evidence subjects, RAMS questions and decision record |
| [Reading desktop](evidence-r3/reading-desktop.png) / [reading narrow](evidence-r3/reading-phone-390.png) | Simplified source/guide presentation and 261-concept, 143-source totals |

[Live infrastructure after deployment](evidence-r3/live-infrastructure.png) records the corrected model on GitHub Pages.
