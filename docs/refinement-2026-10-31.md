# Railway Anatomy 5.0: contextual exploration and deeper operations

## Outcome

This release focuses comparisons on the current system, expands the control centre and maintenance journey, and adds finer control over model exploration. The atlas now contains **223 concepts, 128 public references, 44 model views, nine domains and 26 revised guided tours**. Two longer reading guides connect the component descriptions into system explanations.

The existing whole-railway view remains the entry point. Places and fleet sit alongside systems that cross those places; named parent views and interface links connect the levels. The new OCC and depot views extend that structure rather than adding another independent navigation scheme.

## Comparisons beside the equipment they change

The former global technology row appeared on unrelated scenes, including a station learning exercise. Its replacement is a single contextual comparison area.

| Current focus | Available comparison |
|---|---|
| Vehicle, bogie or guideway | LIM or rotary propulsion, plus the relevant energy condition |
| Control architecture | Loop or radio CBTC, fixed block, ETCS Level 1 or Level 2 |
| Track construction and fastenings | Existing support, rail-seat and fastening alternatives |
| Train detection | Existing detection and position-reference technologies |
| Platform interface | Existing intrusion sensing, platform barriers, interspace and end-access arrangements |
| Ventilation, station plant and networks | The current equipment, supervisory system or ventilation objective |
| Control centre | Activity, supervised system, event state, availability or operator task |
| Depot | Work location, maintenance equipment, inspection, test, washing or protection arrangement |

Stored propulsion and train-control choices remain independent. Their selectors are hidden and disabled outside relevant scenes. A visitor can compare the existing technology families without carrying unrelated controls through every part of the atlas. Changes continue to affect physical equipment, connections, explanations and available components.

## Five control-centre views

1. **Control room:** role positions, shared display, systems room, service supervision, incident coordination and duty handover.
2. **Requests & indications:** separate outbound and return information paths. Traffic, Power and Station replace the field equipment as well as the explanation.
3. **Events & coordination:** reported, acknowledged and coordinated states retain the same underlying condition. Field communications and passenger information are different destinations.
4. **Systems & availability:** desk, applications, network, field gateway, recording and power. Losing the display retains the other equipment; choosing an alternative service changes the connection path.
5. **Operator workplace:** task displays, input and communications equipment, shared context and two-way handover records with outstanding items retained.

Animations distinguish information exchange from physical response. A request token does not move a point, breaker or fan. Static alternatives hide animation controls. The longer guide, *Reading a control centre as a system*, connects responsibilities, evidence, availability and the operator's task.

## Maintenance beyond the building

The depot now has eleven views. Three new views and additional arrangements extend the existing hall, wheel shop, wash plant, utilities, planning and protection models:

- **Inspection & diagnosis:** a vehicle passes fixed sensors, or stays still for examination and a diagnostic connection. The measurement plane appears only when the vehicle occupies the sensor zone.
- **Component maintenance:** brake fixture, door rig, HVAC unit and traction-electronics bench. These are separate assemblies, with appropriate connections and motion.
- **Functional checks:** a stationary measurement arrangement or a separate fenced test road.
- **Wheelset inspection:** supported wheelset, rotating rollers, fixed axial probe and recording connection, distinct from profile machining.
- **Yard work handover:** destination, work status, movement route and work boundary remain separate concepts.

The brake illustration has opposing pads that contact and release without penetrating the disc. Door leaves clear the opening and their position indicator follows the physical state. The HVAC unit has a fan and airflow trace; the converter bench exposes removable modules. Work-area floors are sized to the fixtures so empty base geometry does not dominate the default camera frame.

The guide *What happens during a maintenance visit?* connects condition evidence, allocation, diagnosis, component work, test evidence, records and return to operational planning. Public equipment examples support the explanations; the application does not reproduce maintenance instructions or acceptance criteria.

## Finer model exploration

The model controls now support **Frame selection**, **Isolate assembly**, **Restore scene**, **Larger model**, and separation of either the whole view or the selected assembly. A bogie exposes its frame, wheelsets, braking, collection and propulsion relationships. A LIM primary has internal mounting, core and winding separations.

Isolation preserves the selected architecture: hidden alternative equipment cannot reappear. Selecting a child retains its surrounding isolated assembly; selecting outside it restores the scene. Changing the technology or arrangement clears stale isolation and selected separation. History and contextual return restore saved separation scope and label mode, including the case where the previous scene had a different cutaway state.

Camera fitting uses visible transformed bounds, and repeated components anchor labels to an actual visible instance. Labels use short names while preserving full accessible names and inspector titles. Their measured dimensions, title/footer clearance and spacing govern placement. Visitors can show key parts, only the selection, or no tags.

Authored phase guides connect named stages to animation positions. The slider, phase buttons and playback use the same sequence; a manually selected final phase remains at the endpoint. Separation composes with motion instead of accumulating displacement.

## Guided learning

All 26 self-checks were rewritten around mechanisms, interfaces and evidence. Distractors refer to plausible nearby functions, and feedback explains the selected answer. Examples include audio routing versus a supervisory display, a point command versus position evidence, acknowledgement versus condition clearance, and maintenance release versus movement permission.

Every question was independently reviewed for its keyed answer and model action. One review correction moved the braking-energy lesson to the full energy-path scene so the referenced resistor is visible. Another replaced an unrelated rail-seat distractor with plausible pad and baseplate roles. Revised progress uses a new local storage key because an earlier completion is not evidence of answering the new questions.

## Verification and evidence

Node.js 24 checks cover the shipping model geometry and application navigation. The release gate includes 13 site/content checks, 11 core geometry checks, technology architecture combinations, 206 view/variant/mode route round trips, 40 independent vehicle configurations, 19 depot checks and 10 OCC checks. Exploration tests execute the actual viewer and production synchronization function with renderer/DOM substitutes; they verify isolation, separation, cutaway restoration, finite geometry and 12 perspective fits. Comparison tests check contextual controls, authored phases and label clearance across 12 viewport sizes.

Browser inspection exercised the actual application at desktop width and in a 390px frame. It checked contextual selectors; selected bogie isolation and separation; child selection; propulsion replacement and reset; brake, door, condition-monitoring, wheelset and test-road views; OCC request/indication, acknowledgement and display-loss arrangements; the longer guide and its search; and incorrect/correct quiz feedback. The narrow frame had no page-level horizontal overflow and exposed the explanation below the model.

**Evidence limit:** this browser used the SVG compatibility renderer because hardware WebGL was unavailable. The same scene geometry is used by both renderers, but hardware-WebGL browser appearance and performance remain unverified. These are schematic educational models, not validated physical or operational simulations.

| Evidence | What it records |
|---|---|
| [Previous station tour](evidence-r2/previous-station-tour.jpg) | The earlier global technology controls and learning presentation |
| [Selected bogie](evidence-r2/selected-bogie.jpg) | Isolated assembly, selected separation and larger model presentation |
| [OCC power supervision](evidence-r2/occ-power-supervision.jpg) | Contextual Power choice, separate message paths and component explanation |
| [Brake fixture](evidence-r2/brake-contact.jpg) | Contact phase and improved default model framing |
| [Narrow maintenance view](evidence-r2/narrow-maintenance.jpg) | Door rig, contextual controls and labels in a 390px frame |

## Public source boundary and next coverage

The public artifact contains authored geometry and public-source explanations. No internal layouts, project identifiers, record paths, equipment quantities or procedures were exported. Source cards distinguish full public material from an abstract, public synopsis or lecture listing; supplier architectures retain their scope.

The [coverage roadmap](coverage-roadmap-2026-10-31.md) identifies six future priorities: electrification beyond the present DC example; adhesion and vehicle response; infrastructure maintenance; cross-system resilience and cyber dependencies; accessibility and the passenger journey; and configuration, assurance and change handover. Each names a learner question, the missing interfaces and the public evidence needed. These are proposals, not implemented features.

GitHub Pages is the primary deployment. Earlier separately hosted copies require their own publication and are not updated by this repository's Pages workflow.
