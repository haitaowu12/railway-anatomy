# Control-centre and depot content review

Completed 7 November 2026. Reviewed the complete authored content of `dist/occ-data.js` and `dist/depot-data.js` after the core catalog, expansion and tour pass. Files were edited locally for the integration owner; no remote branch was moved by this reviewer.

## Coverage

OCC coverage includes all 35 concepts, 16 sources, four views with ten variants, six reading-guide sections, all 35 primary and context mappings, three process-context aliases and the equipment/information lists. Empty legacy concept-update and topology objects were inspected as part of the module structure.

Depot coverage includes all 29 added concepts, 11 updates to existing concepts, 11 added sources and three replacement source records, ten views with 28 variants, all 36 captions across nine animated variants, seven reading-guide sections, 43 primary mappings, ten navigation groups and the explicit context-expansion code. Existing depot concepts in `expansion-data.js` were reviewed in the core pass, so their content is covered alongside these updates.

The review read every explanation, qualification, source description and scope, guide paragraph, view label and variant description. IDs, state values, animation times, geometry and navigation structures were preserved. The integration owner separately owns the communications access-screen route to `occ-access-supervision`; these edits preserve that concept.

## Findings and changes

### Control centre

- The technical-room entry told readers to select “Connected”, “Display unavailable” and “Alternate host”, although the current interface offers a static Equipment arrangement. Replaced those stale directions with the available hardware inspection and Local computer / Remote computer comparison.
- Display-controller, shared-display and recorder entries described update or record animation stages no longer supplied by these static equipment views. Replaced them with explanations of source selection, screen distribution and storage.
- Removed the repeated general disclaimer attached to every concept. Replaced internal commentary about what a model must not claim with the positive role of the equipment.
- Expanded keyboard/video/mouse (KVM), building automation system (BAS), tunnel ventilation control system (TVCS), network management system (NMS) and human–machine interface (HMI) where the abbreviations otherwise interrupted beginner reading.
- Explained the local computer’s processing hardware, the remote interface’s direction of information flow, the switch’s role, the recorder’s source/time context and the UPS’s supported circuits and finite runtime.
- Retained the distinctions that change interpretation: request versus acceptance versus achieved condition; acknowledgement versus repair; current information versus stale or unavailable information; software application versus physical host; and an additional host versus configured failover.
- Replaced page-design commentary in incident and handover entries with the work itself: reports, responsibility, open actions and two-way exchange. Links to People & processes remain available.
- Kept the evidence boundary for the LRSSB public synopsis and IRSE lecture listing. The report does not claim access to the gated guidance or review of a lecture transcript.

### Depot

- Removed automatic insertion of the same caveat into all 29 new concepts. Specific explanations retain the distinction between a pictured mechanism and a maintenance acceptance decision where it matters.
- Explained component roles in compressed air, drainage, local extraction, building ventilation and fire/security monitoring.
- Clarified maintenance planning, work evidence, release, fleet allocation and later movement as related but separate responsibilities.
- Replaced outdated “phase slider” instructions with the visible “Sequence position” control, and described the finite illustrated passage without implying automatic playback restart.
- Replaced animation captions dominated by exclusions with the physical event the reader can see: pad separation, closed door position, diagnostic response or result reaching the review point.
- Clarified the supported-body/removed-bogie relationship and compared it with lifting the body above both bogies.
- Explained wheel reprofiling and non-destructive inspection in ordinary terms. Dimensional measurement and material-condition inspection retain different purposes.
- Rewrote the complete seven-section maintenance guide with shorter paragraphs that follow the visit from its reason for work through assessment, component tasks, evidence and handover.

## Source checks and reference scope

The source records already attached to the equipment remain the evidence for their stable mechanical functions. Source descriptions and scopes were reviewed for accurate attribution. Selected primary sources were retrieved to check the most consequential handoff and support distinctions:

- [Office of Rail and Road, Entities in Charge of Maintenance, section 8.10](https://www.orr.gov.uk/guide-rogs/8-entities-charge-maintenance-ecm): separates maintenance delivery and release documentation from fleet-maintenance management and return to operation. The content uses this as a UK example of function allocation; it does not prescribe a regulatory process elsewhere.
- [Nencki, Bogie Lowering System NBD](https://www.nencki.ch/en/plant-engineering/lifting-and-lowering-system-1/bogie-lowering-system-nbd): describes removal beneath the body, alternative workshop arrangements, track bridges and covers.

Other reviewed primary references include [HSE control-room design](https://www.hse.gov.uk/comah/sragtech/techmeascontrol.htm), [HSE shift handover](https://www.hse.gov.uk/humanfactors/topics/shift-handover.htm), [Metrolinx LRT criteria](https://assets.metrolinx.com/image/upload/Documents/Engineering/LRT_Design_Criteria_Manual_DCM_LRT-001_REV01.pdf), [G&D KVM interfaces](https://www.gdsys.com/en/products/kvm-extenders), [Mechan workshop equipment](https://www.mechan.co.uk/rail/bogie-wheelset-workshop/), and [ÖBB wheelset maintenance](https://ts.oebb.at/en/products-services/komponenteninstandhaltung/radsaetze). Existing references were checked against their recorded scope; every linked document was not independently downloaded in this pass.

## Validation

Both edited modules pass `node --check`. An import-level validation confirms that every owned concept source, related concept and guide source resolves in the composed catalog. `git diff --check` passes for the five edited content modules.

The earlier site run passed the concept, source, navigation, tour, scene, depot, OCC and related geometry contracts, before the final OCC/depot text edits. It reported generated-reading staleness and a separate exact-caption assertion in `check-component-motion.mjs` against the integration owner’s revised sprinkler text; both were sent to the integration owner. That earlier run is not reported as a clean full release pass. The integration owner regenerates reading content and runs the final suite on the combined revision. These data edits do not claim browser or GPU verification.

## OCC concepts reviewed

- `operations-centre`
- `occ-console`
- `occ-client-computer`
- `occ-kvm-interface`
- `occ-display-controller`
- `occ-cable-route`
- `occ-equipment-cabinet`
- `operations-equipment-room`
- `occ-task-display`
- `occ-workstation-input`
- `occ-shared-display`
- `occ-workplace-environment`
- `operations-radio-dispatch`
- `occ-application-service`
- `occ-alternate-service`
- `occ-supervisory-network`
- `occ-field-gateway`
- `occ-uninterruptible-power`
- `operations-event-recording`
- `operations-traffic-supervision`
- `operations-signalling-workstation`
- `operations-power-control`
- `operations-station-supervision`
- `occ-supervisory-request`
- `occ-field-indication`
- `occ-information-quality`
- `occ-record-timeline`
- `occ-alarm-queue`
- `occ-cctv-assessment`
- `occ-passenger-communications`
- `occ-access-supervision`
- `occ-incident-coordination`
- `occ-duty-handover`
- `occ-alarm-acknowledgement`
- `telecom-scada`

## OCC source records reviewed

- `OC01`
- `OC02`
- `OC03`
- `OC04`
- `OC05`
- `OC06`
- `OC07`
- `OC08`
- `OC09`
- `OC10`
- `OC11`
- `OC12`
- `OC13`
- `OC14`
- `OC15`
- `OC16`

## OCC views and variants reviewed

- `operations-centre`: `service`, `incident`, `handover`
- `occ-workplace`: `task`, `shared`, `handover`
- `occ-equipment`: `normal`
- `occ-incident`: `reported`, `acknowledged`, `coordinated`

## OCC reading guide reviewed

`control-centre-guide`:

- Start with what occupies the room
- Follow the installed workplace connections
- Give communications SCADA its own scope
- Name the point before drawing a connection
- Keep requests, outcomes and service performance separate
- Continue into the human work

All 35 OCC primary/context IDs are the concept IDs enumerated above. The process-context aliases are `occ-duty-handover`, `occ-incident-coordination` and `occ-alarm-acknowledgement`.

## Depot concepts reviewed

- `depot-network-boundary`
- `depot-reception`
- `depot-dispatch`
- `depot-yard-points`
- `depot-shunt-signal`
- `depot-maintenance-road`
- `depot-wheelset`
- `depot-bogie-workshop`
- `depot-material-handling`
- `depot-wash-gantry`
- `depot-wash-pump`
- `depot-facility-power`
- `depot-compressed-air`
- `depot-drainage`
- `depot-ventilation`
- `depot-fire-security`
- `depot-staff-access`
- `depot-work-planning`
- `depot-maintenance-release`
- `depot-work-handover`
- `depot-condition-monitoring`
- `depot-diagnostics`
- `depot-brake-test`
- `depot-door-service`
- `depot-hvac-service`
- `depot-traction-service`
- `depot-wheelset-inspection`
- `depot-functional-checks`
- `depot-test-track`

## Depot concept updates reviewed

- `depot-layout`
- `depot-throat`
- `depot-controller`
- `depot-stabling`
- `depot-lifting-jacks`
- `depot-bogie-drop`
- `depot-wheel-lathe`
- `depot-stores`
- `depot-personnel-protection`
- `depot-wash-plant`
- `depot-water-recovery`

## Depot source records reviewed

- `D01`
- `D02`
- `D03`
- `D04`
- `D05`
- `D06`
- `D07`
- `D08`
- `D09`
- `D10`
- `D11`
- `O07`
- `O11`
- `O13`

## Depot views and variants reviewed

- `depot-overview`: `layout`, `night`
- `depot-yard`: `reception`, `handover`, `dispatch`
- `depot-condition`: `roll-by`, `stationary`
- `depot-components`: `brakes`, `doors`, `hvac`, `traction`
- `depot-testing`: `stationary`, `movement`
- `depot-maintenance`: `inspection`, `lifting`, `jacks`, `wheel-lathe`
- `depot-workshop`: `lathe`, `wheelset`, `ndt`, `bogie`
- `depot-wash`: `wash`, `mobile`, `recovery`
- `depot-utilities`: `services`, `water`
- `depot-support`: `materials`, `planning`

## Depot animation captions reviewed

- `depot-condition/roll-by`: Approach, Enter measurement zone, Pass the sensors, Clear the portal, Review the record
- `depot-condition/stationary`: Vehicle evidence, Diagnostic link, Review evidence
- `depot-components/brakes`: Released, Approach, Contact, Release, Released again
- `depot-components/doors`: Closed position, Opening, Clear doorway, Closing, Closed position restored
- `depot-components/hvac`: Air entry, Heat-exchange section, Fan section, Supply outlet
- `depot-components/traction`: Equipment connection, Test harness, Test equipment
- `depot-testing/stationary`: Vehicle connection, Measurement link, Evidence for review
- `depot-testing/movement`: Near end, Along the test road, Far end, Return movement, Cycle complete
- `depot-workshop/ndt`: Wheelset on rollers, Wheelset turns, One illustrated turn

## Depot reading guide reviewed

`understanding-a-maintenance-visit`:

- A visit begins with a reason for work
- Location and readiness are different information
- Inspection produces evidence; diagnosis interprets it
- Running-gear work changes both access and support
- Doors, climate equipment and traction need their own work
- A completed repair needs the appropriate evidence
- The handover connects work with operation

## Depot primary destinations reviewed

- `depot-layout`
- `depot-stabling`
- `depot-throat`
- `depot-controller`
- `depot-network-boundary`
- `depot-reception`
- `depot-dispatch`
- `depot-yard-points`
- `depot-shunt-signal`
- `depot-work-handover`
- `depot-condition-monitoring`
- `depot-diagnostics`
- `depot-brake-test`
- `depot-door-service`
- `depot-hvac-service`
- `depot-traction-service`
- `depot-functional-checks`
- `depot-test-track`
- `depot-maintenance-road`
- `depot-inspection-pit`
- `depot-roof-access`
- `depot-lifting-jacks`
- `depot-bogie-drop`
- `depot-wheel-lathe`
- `depot-wheelset`
- `depot-wheelset-inspection`
- `depot-bogie-workshop`
- `depot-material-handling`
- `depot-wash-plant`
- `depot-wash-gantry`
- `depot-wash-pump`
- `depot-water-recovery`
- `depot-facility-power`
- `depot-compressed-air`
- `depot-drainage`
- `depot-ventilation`
- `depot-fire-security`
- `depot-stores`
- `depot-staff-access`
- `depot-work-planning`
- `depot-maintenance-release`
- `depot-personnel-protection`
- `depot-energy-isolation`

## Depot groups reviewed

- `depot-context`
- `depot-yard-group`
- `depot-assessment-group`
- `depot-hall-group`
- `depot-workshop-group`
- `depot-component-group`
- `depot-test-group`
- `depot-wash-group`
- `depot-services-group`
- `depot-support-group`

## Inspection metadata in model builders

The final pass read every authored inspection label, function description, interface name, stage label and functional-path caption in `dist/communications-models.js`, `dist/occ-models.js`, `dist/operations-models.js` and `dist/track-models.js`. It also checked names supplied by the separation wrappers and the source-selection rules. This was a prose/metadata review, not a new numerical audit of all vertex positions.

Communications coverage includes console terminals; station/onboard switch hardware; copper and optical ports; fibre patching; routers; UPS; racks; RTU processor, digital/analogue input and output cards; eight named field-terminal roles; speakers; passenger displays; cameras; help points; application/recording hosts; amplifiers; cab radios; access readers/controllers/locks; local actuators; radio-access interfaces; and the PA microphone. Functional paths reviewed: `switch-data`, `switch-power`, `field-input`, `field-output`, `server-data-storage` in application and recorder forms, and `announcement-output`, including every step and endpoint.

OCC coverage includes all 15 physical-name mappings; display, supply and input hardware; local and remote computing alternatives; console cable routes; equipment racks; room enclosure and lighting; and the separation-stage labels. Functional paths reviewed: `display-frame`, `display-supply`, `workplace-computing` in local and remote forms, and `console-input-to-frame` in local and remote forms.

Depot-model coverage includes the generic separation wrapper and every explicitly named removable cover, roof, enclosure, converter module and control board; the brake-fixture air route and `brake-test-evidence` path; and door guide, motor, pulleys, belt clamps and their captions. Track-model coverage includes sleeper/direct-fixation support, pad, clip, retained shoulder, insulator and separation labels; the `rail-seat-load` path in both support forms; and the labelled crossing/check-rail/wheelset parts.

Corrections: recorder inspection metadata previously matched the camera source rule first; passenger displays and players fell back to a network-switch source; application-host hardware cited the KVM source. The source rules now select recorder, passenger-information and host-equipment references. OCC sources follow equipment roles. The brake-fixture path now cites test-equipment source D05 in place of bogie-workshop source D03. Removed internal caveats from connector and terminal captions, explained the amplifier output and belt drive in ordinary language, and named the application hosts as hardware. The integration owner’s `occ-access-supervision` screen mapping was preserved. Track metadata required no correction.

After the inspector metadata changes, `node scripts/check-communications.mjs` passed all 18 checks and `node scripts/check-occ.mjs` passed all 12 checks. Syntax and whitespace checks also passed.
