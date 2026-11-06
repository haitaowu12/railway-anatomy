# Content and navigation review

Reviewed 6 November 2026 against public version 10.1.0, commit `70aaac0ed190177e7907822b091ff2acbcf8669a`. The resulting corrections are included in version 10.2.0.

## Coverage and limits

The review covers the full authored catalogue, view descriptions and animation stages, tours, reading guides, control interfaces, people and process maps, specialist studies, labs, navigation and generated reader destinations. It includes 330 concept records, 233 source-scope records, six train-control architecture comparisons, 58 views, 31 tours, 13 guides, 12 roles and eight processes at the reviewed baseline. Final compiled configuration was reconciled with the underlying modules so overridden text was not treated as the active interface.

The broad passes checked internal consistency, engineering meaning, usefulness and access paths. Selected claims were checked against primary railway-owner and supplier references. This is not a full-text verification of all 233 references or a browser execution of every route. Findings below distinguish demonstrated behavior from candidates requiring a targeted reproduction or source check.

## Closed in the turnout increment

| Finding | Result |
|---|---|
| Point-machine setting and whole-turnout wheel travel were separate learning paths. | A connects to the straight route; B connects to the diverging route. Both wheels remain visible through the switch, closure rails and fixed crossing. |
| The single turnout lacked the diverging route's opposite check rail. | Each route now has an opposite check rail. The selected check rail, crossing wheel and checked wheel agree. |
| The crossing's tread-support and flange passages needed geometric inspection. | Wing-rail clearance, wheel tread width and flange position were corrected. Geometry probes follow both real wheel meshes through both routes and scales. |
| A two-wheel axle was labelled as a bogie. | It is now a wheelset with its own concept. The crossing nose and wing rails are separately inspectable. |
| The independent four-rod turnout also showed an extra stretcher bar. | The selected independent-drive arrangement omits that bar; the separate crossover representation remains a different layout. |
| Process navigation captured the origin after changing page, and role pages lacked a return action. | A process retains its originating study. A role returns to the selected process stage, then to the originating route, scale and position. This path was exercised in the browser. |
| Rounded sequence positions could restore just before a selected stage. | Turnout links retain the full normalized position. |
| The point-machine guide's study action opened equipment rather than its described guided journey. | Point-machine and turnout guide actions now have explicit guided-tour destinations. Both guide routes open their described journey; the turnout guide entry was exercised in the browser. |
| Several related-topic targets were less useful than their local alternatives. | Station assistance points to the station help point; lift landing doors point to the lift drive; wayside point equipment points to interlocking. These are topic-target refinements, not corrections to a claimed physical connection. |
| An OCC explanation described migration history. | It now explains the reader's coordination task directly. |

The [turnout study](TURNOUT-STUDY.md) records the primary reference basis, geometry scope and route relationships. The field guide and generated reading page follow the same journey.

## Review findings addressed in 10.2.0

| Finding | Final behavior |
|---|---|
| A workspace or inspector redirect could be cancelled by selecting the previous component afterward. | Follow-up selection runs only when the destination remains an equipment view. Process and interface actions retain their own representation. |
| Final related lists omitted curated PLC/RTU links and supplied unrelated default equipment. | The RTU retains its local-controller and interface-contract links. Missing curated lists fall back to the concept's own relations, rather than arbitrary intake equipment. |
| Role equipment links and continuing automation responsibilities were authored but never rendered. | Role pages show their connected concepts and derive related processes from actual stage ownership and contribution. The three continuing-responsibility sections are visible. |
| Previous/next equipment views included process/interface redirects. | Equipment sequences omit those redirect destinations. Explicit workspace actions still open them, with return context. |
| The global finder omitted roles and reading guides. | Typed role and guide results open their destinations directly. “Onboard driving” reaches the operating role; “both wheels” reaches the turnout guide and tour. |
| A physical journey lacked a local route back to other tours. | Point-machine and turnout journeys include “Find another tour”; their direct connection remains prominent. |
| Field-guide excursions lost the origin or inherited an unrelated filter. | Guide/concept entry clears irrelevant filters and shows a named return. A role → evidence → role → process → turnout walkthrough retains the selected stage. |
| The infrastructure guide targeted a redirect view; process/people guides had no contextual entries. | The infrastructure guide opens the physical asset view. Process and role pages link to their relevant reading guides. |
| OCC information concepts could be replaced by equipment representatives. | An explicitly selected information concept remains selected; physical equipment and optional interface actions remain separate. |
| The diamond repeated one nose at all four intersections and reused common-crossing motion. | The static layout marks two common and two obtuse crossing regions. Unverified nose/check-rail geometry and wheel travel are removed. The detailed fixed-common-crossing journey remains separate. |
| A stale electrical record changed as current resistance or boundary inputs changed. | The retained observation has a fixed, stated configuration: separated sections and fault resistance 0.12 p.u. Its values remain fixed while the current circuit changes. The current solution is unaffected by record freshness. |
| An observation inspector was gated by retired OCC view IDs. | It is available in the actual operations-centre, workplace and equipment contexts. |
| The maintenance study's first stage did not name its return view. | Observation → removed wheelset → inspection fixture → observation has explicit destinations. |
| Process/people field-guide filters showed an equipment “no match” message beneath useful guides. | These filters show their guides without the irrelevant equipment count and empty state. |
| Infrastructure rework could read as a records-only correction. | The branch explicitly includes completing or rectifying scoped work before recording the actual end state and matching evidence. |
| “Accelerate” was used as the motoring-mode name. | “Supply traction” describes the mode without asserting acceleration. |
| Optional BAS relationships combined status and requests under one direction label. | Pump and vertical-transport labels distinguish status toward BAS from permitted requests toward local control. |
| The generic parking-function view reused a pneumatic service-brake caption. | Its caption describes pad contact and leaves the applying/releasing input with the selected architecture. No universal spring-applied arrangement is inferred. |
| The discipline entry opened a named legacy supplier example. | Train control starts at the generic control architecture. SelTrac remains a separately named family example. |
| Several labels exposed internal names, migration history or a misplaced context. | CamelCase assembly names are split into readable words; legacy-link narration and the duplicated tour number are removed; the battery is identified as a substation example. |
| Crossing references were placed inconsistently. | The crossover uses its crossover reference. The diamond uses RAIB's common/obtuse anatomy; the tread-transfer explanation adds RISSB Appendix A, A.2.1 and Figure A7. |
| The selected AC/DC examples could suggest resistor location is determined by supply type. | The comparison explicitly allows either onboard or wayside sinks according to equipment and receptivity. |

The diamond correction follows [RAIB's Epsom report, Appendix B, page 32](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/411913/070913_R342007_Epsom.pdf). Its incident findings and historical operating practices are not transferred. The support relationship follows [RISSB, Wheel and Rail Profile Development, Appendix A A.2.1 and Figure A7](https://www.ariso.org.au/wp-content/uploads/2019/03/GL_Wheel-and-Rail-Profile-Development_Final.pdf). Neither source turns the original geometry into a contact-force calculation.

## Remaining model and evidence work

- **Diamond contact and movable-nose mechanisms:** the diamond is now explicitly a layout. A contact passage or movable-nose alternative requires its own geometry, selected state, checking arrangement and verification. The fixed turnout does not imply a crossing actuator.
- **Crossover linkage and repeated supports:** inspect the two-turnout linkage before extending its mechanism story. Further grouping of repeated physical instances should preserve existing instance bookmarks. The guided turnout already uses a concise contextual part list; the broader anatomy tree remains available for detailed inspection.
- **Legacy loop localization:** verify the cable-transposition position-reference role against a primary family-specific source before adding it. The named legacy architecture must not borrow another supplier's implementation without qualification.
- **ETCS information relationships:** the catalogue architecture lists are not a temporal process shown by the current application. A future sequence must distinguish balise references, odometry, reports, movement authority and supervision using its applicable sources.
- **Reference status and access:** the 2016 Metrolinx manual remains a historical example. The review identified its [later amendment bulletin](https://assets.metrolinx.com/image/upload/v1743532269/Documents/Engineering/LRT_Design_Criteria_Manual_DCM_Bulletin_LRT-001_REV00.pdf) for current-status reconciliation. Publisher full-text access limits and a disclosed P80 brochure mirror remain evidence limitations; no supplier mechanism is invented to fill them. Suspect URL spelling and language paths need publisher confirmation before substitution.
- **Source granularity:** shared URLs can support distinct scopes. Guide-level references remain valid where section-level references are absent; additions should identify the actual supported passage rather than copy a bibliography into every section.

## Findings not carried forward

The ideal six-diode electrical bridge and generic mechanical diode stack are separately scoped representations. The final runtime supports four supply arrangements; it is not restricted to the older default scene. Missing caveat fields, background references without direct concept citations and repeated source URLs are not errors by themselves. Related-topic links do not assert wiring or mechanical coupling. Supplier-specific emergency-brake, isolation, platform-egress and locking arrangements must not become universal statements.

## Verification and next use

Source, geometry, navigation, role rendering, static reading and release-artifact checks cover the changed behavior. Browser walkthroughs exercise both turnout routes and scales, point-to-route continuity, missing detector input, guide entry, role discovery, nested returns and phone layout. A passing synthetic geometry check does not establish vehicle dynamics or dimensional design validity.

Use the remaining questions when the relevant model is next extended. Reproduce a reported access problem before changing navigation again; retain the working point → turnout → crossing and evidence → role → process → original study paths.
