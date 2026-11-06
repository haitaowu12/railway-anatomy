# Content and navigation review

Reviewed 6 November 2026 against public version 10.1.0, commit `70aaac0ed190177e7907822b091ff2acbcf8669a`. The turnout work described below belongs to the local 10.2.0 increment.

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
| The point-machine guide's study action opened equipment rather than its described guided journey. | Point-machine and turnout guide actions now have explicit guided-tour destinations. Static destination checks cover both routes; final-build browser verification remains open. |
| Several related-topic targets were less useful than their local alternatives. | Station assistance points to the station help point; lift landing doors point to the lift drive; wayside point equipment points to interlocking. These are topic-target refinements, not corrections to a claimed physical connection. |
| An OCC explanation described migration history. | It now explains the reader's coordination task directly. |

The [turnout study](TURNOUT-STUDY.md) records the primary reference basis, geometry scope and route relationships. The field guide and generated reading page follow the same journey.

## Next targeted corrections

### 1. Preserve the reader's location across representations

| Location | Demonstrated issue or remaining candidate | Next action and acceptance |
|---|---|---|
| `app.js`, workspace view and inspector handlers | **Source-supported candidate:** `setView()` can redirect to a process or interface page, after which a follow-up component selection can reopen equipment. | Reproduce a workspace-to-process and workspace-to-interface transition. Only select the old component if the destination is still an equipment view. Each transition must retain a useful return destination. |
| `app.js`, `RELATED` and catalogue `related` fields | **Confirmed:** the physical `scada-rtu` inspector drops authored links to `local-plant-controller` and `interface-contract`. `station-scada` and `bas-controller` also have different lists, but their working interface redirects narrow the practical impact. | Define one maintained relationship policy, preserving useful equipment and responsibility links. Check the actual rendered destinations rather than merging every link indiscriminately. |
| `process-ui.js`, people and automation views | **Confirmed by rendering:** role `links` and the three authored continuing-responsibility blocks are omitted. The renderer asks for role interface/process fields that the role records do not supply. | Show connected equipment and derive relevant process stages from their recorded owners/contributors. Restore the authored continuing responsibilities with concise labels. |
| `app.js`, previous/next views | **Source-supported candidate:** a view sequence includes process/interface redirects; following “Next view” can change representation and remove that toolbar. | Make the destination type clear before the transition and retain an explicit return. Check station, track, maintenance and communications sequences. |
| `navigation-search.js`, global finder | **Confirmed index gap:** roles and reading guides have no direct result entries, although the finder promises broad railway discovery. | Add visibly typed role and guide results with direct destinations. Check “onboard driving” and a guide title alongside equipment queries. |
| `app.js`, physical guided studies | **Confirmed design gap:** point-machine studies replace the generic tour footer; the full tour picker remains available, but the local onward route is less obvious. | Choose the useful next task for each journey. Preserve the point → turnout connection; provide a clear way to resume the tour collection without repeating the page heading or explanatory copy. |
| Anatomy tree and navigation controls | **Observed usability gap:** repeated fastening instances and internal assembly names compete with the switch, drive and crossing. Workspace, system, view and component navigation also overlap. | Keep one primary hierarchy, a global finder and contextual part selection. Group repeated supports and name instances by location or function. Inspect a complete turnout-to-crossing action before changing other families. |
| `READING_GUIDES`, `app.js`, `process-ui.js` | **Source-supported candidate:** the infrastructure guide is associated with a redirect view; three process/people guides have no contextual entry from their working pages. | Open each guide from its relevant task and return to the same context. Distinguish inspecting the physical asset from examining its work/evidence process. |
| OCC information concepts, `chooseVisibleRepresentative()` | **Source-supported candidate:** information concepts can be replaced with an equipment representative when their view opens. | Reproduce “Read component details → Locate” for `telecom-scada` and another OCC information concept; retain the requested topic in a suitable representation. |

### 2. Correct the next track family before extending its story

The fixed diamond in `track-models.js` repeats one tapered nose at all four rail intersections. It does not distinguish the common and obtuse crossing regions. Its animation also reuses the single-common-crossing stage descriptions. Correct geometry and sequence together before presenting a wheel passage through the diamond. [RAIB's Epsom report, Appendix B, page 32](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/411913/070913_R342007_Epsom.pdf) identifies two common and two obtuse crossings; the historical report supplies anatomy, not current inspection or operating requirements. Use the [Bane NOR turnout/crossing reference](https://oppslagsverk.banenor.no/jernbanekompetanse/overbygning/sporets-komponenter/sporveksler/) to compare the arrangements and inspect the wheel paths in both intersecting routes.

The crossover retains a separate simplified blade/stretcher arrangement. Inspect its connections and both turnouts together before expanding it into another guided journey. The corrected single turnout does not qualify that separate model.

### 3. Keep observations and physical states distinct in labs and studies

| Location | Finding | Next action and acceptance |
|---|---|---|
| `physical-labs.js`, `electrical-sections` | **Confirmed by execution:** under `condition:'fault', telemetry:'stale'`, changing resistance from 0.04 to 0.8 changes the supposedly stale reported voltage from 0.344 to 0.894 p.u. The retained record is recomputed from current inputs. | Define the earlier observation explicitly, retain its value/time/configuration separately and show how it differs from the current physical solution. Test observation retention while resistance and boundary state change. |
| `depth-ui.js`, `showPoint` | **Confirmed source mismatch:** the observation-record inspector is gated by retired `occ-supervision` and redirect `station-networks` IDs. The OCC equipment diagram directs readers towards that inspector. | Bind the inspector to the actual relevant OCC views and verify the diagram-to-record path. |
| `depth-content.js`, `maintenance-condition-evidence` | **Source-supported candidate:** the study crosses from `depot-condition` to `depot-workshop`, while component selection can clear `studyId`; its first stage has no explicit return view. | Exercise observation → removed wheelset → inspection fixture → observation. Preserve the study and use explicit stage destinations. |
| `app.js`, field-guide filters | **Confirmed source mismatch:** process/people filters have guides but no equipment-domain entries, leaving an equipment “0 concepts / no match” message below useful guides. | Render the relevant process/role results or omit the irrelevant equipment empty state. |

### 4. Resolve family scope and process wording with evidence

These are targeted review questions, not established universal corrections:

- **Legacy loop train control:** reconcile the named SelTrac loop family, its pickup/interface components and the generic wayside-controller concept. Verify the position-reference role of cable transpositions against a primary family-specific source before extending the explanation.
- **ETCS comparisons:** distinguish a list of information relationships from a temporal process. If presented as a sequence, establish the relationship between balise references, odometry, position reports, movement authority and onboard supervision using the applicable ETCS sources.
- **Braking-energy destinations:** confirm that the selected AC/onboard and DC/wayside examples cannot be read as a rule assigning resistor location by supply type. Keep any clarification beside the comparison.
- **Parking-brake animation:** its reused pneumatic service-brake caption needs to match the selected spring-applied mechanism before that journey is expanded.
- **Process rework:** when work or tests remain incomplete, show the return to physical rectification or further verification as well as record reconciliation. Keep maintenance release, fleet readiness, worksite handback, asset acceptance and duty handover distinct.
- **Train-control orientation and duplicate labels:** make the family overview easy to reach from the selected legacy example, and distinguish equipment inspection from a system comparison when two records share a label.
- **Reference usability:** verify suspect or language-specific URLs before changing them. A misspelling in a live publisher URL is not by itself a broken link; repeated URLs can legitimately have distinct use scopes.
- **Motoring label:** `MODES/motoring` says “Accelerate.” Motoring can also balance resistance at constant speed; use “Supply traction” for the mode and reserve acceleration for a calculated motion result.
- **Interface arrow labels:** `drainage-bas` and `vertical-bas` combine status and permitted requests under a single upward arrow. Show the two information directions explicitly, following the existing main interface model.
- **Historical source status:** `OC10` identifies the 2016 Metrolinx LRT manual but omits its archived/reference-only status. The [Metrolinx amendment bulletin](https://assets.metrolinx.com/image/upload/v1743532269/Documents/Engineering/LRT_Design_Criteria_Manual_DCM_Bulletin_LRT-001_REV00.pdf) is the source to reconcile before using that reference for a new example.
- **Crossing support source:** [RISSB, Wheel and Rail Profile Development, Appendix A §A.2.1, Figure A7](https://www.ariso.org.au/wp-content/uploads/2019/03/GL_Wheel-and-Rail-Profile-Development_Final.pdf) supports wing-to-nose tread transfer. Use it in the next contact/profile study; an authored cue is not a calculated contact patch.

## Findings not carried forward

The ideal six-diode electrical bridge and generic mechanical diode stack are separately scoped representations. The final runtime supports four supply arrangements; it is not restricted to the older default scene. Missing caveat fields, background references without direct concept citations and repeated source URLs are not errors by themselves. Related-topic links do not assert wiring or mechanical coupling. Supplier-specific emergency-brake, isolation, platform-egress and locking arrangements must not become universal statements.

## Working order

Finish the turnout's final browser check, then address the location/relationship defects as one connected journey: equipment → interface or process → responsible role → original equipment. Correct the diamond before adding a diamond wheel-path lesson. Use the lab/state and family-scope findings when their respective models are next updated. Each update should close its own finding with a source or reproduced behavior and a usable return path.
