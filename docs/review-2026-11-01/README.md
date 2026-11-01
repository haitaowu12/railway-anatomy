# Railway Anatomy and Engine Anatomy: depth, rendering and inspection review

Review date: 1 November 2026

## Conclusion

Both projects have useful foundations. Railway Anatomy has broad, sourced subject coverage and many independent technology choices. Engine Anatomy has distinct numerical teaching models, explicit shaft relationships and causal trials. Their principal shortfall is the amount of authored anatomy behind those concepts, followed by the way the anatomy is exposed and presented.

Teardown does not supply detailed railway or turbine-engine models. Its strong examples combine reference-led geometry, mechanism-specific sections, coordinated motion and readouts, composed cameras, material/lighting work and repeated inspection of rendered frames. The projects have adopted parts of the interactive-explainer idea without consistently reaching that complete authoring standard.

This is an evidence-backed diagnosis of the current implementations, not a reconstruction of every historical prompt. In particular, Engine Anatomy's source credits a different initial visual reference and contains no Teardown runtime dependency. Teardown may still have been used during authoring; the repository cannot establish that history.

The accompanying changes repair specific geometry and inspection problems and demonstrate a small set of staged inspections. They do **not** claim that either project has reached the full detailed end state described below.

## Evidence and scope

| Project | Reviewed source baseline | Publication inspected |
| --- | --- | --- |
| Railway Anatomy | [`8cfd611274ca7e27281e7d798cc6f93901258719`](https://github.com/haitaowu12/railway-anatomy/tree/8cfd611274ca7e27281e7d798cc6f93901258719) | [GitHub Pages](https://haitaowu12.github.io/railway-anatomy/) |
| Engine Anatomy | [`67d8c962454dac1fa932d4c91cc6280e7d8d44b6`](https://github.com/haitaowu12/engine-anatomy/tree/67d8c962454dac1fa932d4c91cc6280e7d8d44b6) | [GitHub Pages](https://haitaowu12.github.io/engine-anatomy/) |
| Teardown reference | [`a91262ac1109051e014662d42ecb0b7bc1f113b1`](https://github.com/elvarofficial/teardown/tree/a91262ac1109051e014662d42ecb0b7bc1f113b1) | README examples and implementation |

The review combined source inspection, execution of the actual scene builders, regression checks, public primary references, live interface exploration and independent peer review. The domain reports contain more detailed evidence: [Railway content review](railway-content-review.md) and `docs/review-2026-11-01.md` in Engine Anatomy.

The cloud browser could not create a WebGL context. Railway used its SVG compatibility renderer, which projects the scene geometry; Engine used its more limited 2D schematic fallback. The review could inspect navigation, displayed content and available tasks, but could not qualify normal GPU lighting, shadows, clipping, frame rate or new inspection pixels. Session screenshots were inspected, but their file handoff was unavailable, so no screenshot artifact is presented as acceptance evidence. The code changes remain subject to a normal-WebGL visual gate.

Other hosted copies are separate publications. Their appearance should not be compared with a newer GitHub commit without identifying the release. Public material and original schematic geometry are the scope of this work.

## 1. Where the gap occurred

### Teardown is an authoring process and examples, not a detailed asset library

The inspected repository contains three worked simulators: a V8, Cessna landing gear and Strandbeest. The README's newer bee, scorpion and octopus GIFs are promotional examples; their scene implementations are not included in the inspected tree. They are useful aesthetic references, but are not three reusable source models waiting to be imported.

The donor's [authoring guide](https://github.com/elvarofficial/teardown/blob/a91262ac1109051e014662d42ecb0b7bc1f113b1/SKILL.md) calls for a real reference, coherent dimensions and state, meaningful exposure of the working part, mechanism-specific cameras, collision correction and rendered-frame review. Its [V8 geometry](https://github.com/elvarofficial/teardown/blob/a91262ac1109051e014662d42ecb0b7bc1f113b1/sims/v8-shared/engine.js), [stage](https://github.com/elvarofficial/teardown/blob/a91262ac1109051e014662d42ecb0b7bc1f113b1/sims/v8-shared/stage.js) and [landing-gear builder](https://github.com/elvarofficial/teardown/blob/a91262ac1109051e014662d42ecb0b7bc1f113b1/sims/cessna-shared/gear.js) show how much individual authoring sits behind that result.

Even the donor is not a general engineering-validation system. Its [V8 kinematics/pressure model](https://github.com/elvarofficial/teardown/blob/a91262ac1109051e014662d42ecb0b7bc1f113b1/sims/v8-shared/kin.js) includes an illustrative pressure construction. A readout can agree perfectly with an animation while both remain synthetic. Use its production discipline and selected techniques; validate subject claims separately.

### The current projects prioritize breadth and interaction before anatomy

| Layer | Railway baseline | Engine baseline | Result for the learner |
| --- | --- | --- | --- |
| Subject coverage | 322 concepts, 177 source records, 59 registry entries including redirects, 32 tours | Three engine architectures, semantic components, plant equations and guided trials | There is substantial material to explore. |
| Assembly hierarchy | Useful grouped assemblies, but selection commonly collects every instance of one concept | Mostly flat component groups in a common procedural core | A concept label often has more detail than the object behind it. |
| Inspectable internals | Real internals in selected studies; many missing names and few anatomical levels | Fixed cutaway and isolation; no exploded-view state | Opening a view soon reaches the limit of the authored geometry. |
| Separation | One scalar applied to displacement vectors | Absent | It does not explain an enclosure/support/mechanism sequence. |
| Rendering | Existing 3D/fallback infrastructure; scene detail varies widely | Narrow material/light vocabulary and coarse primitive substitutes | A theme change cannot supply missing structure. |
| Verification | Strong route, content, state and selected geometry checks | Useful model/topology checks | Passing tests does not establish readable cutaways or learned understanding. |

The likely development-process gap is that a view counted as complete when it was reachable, selectable, cited and animated. Those are useful requirements, but they do not establish that its shape, interfaces, exposure and explanation answer a specific learning question. This is an inference from the source and outcomes, not a claim about the intentions of previous contributors.

### Counts conceal important distinctions

At the railway baseline, a default-state sweep found 856 visible view–component combinations. Of those, 271 offered internal separation, and 75 returned at least one readable piece name. These are repeated view/component combinations, not unique manufactured parts or a completeness percentage.

For example, an OCC room's task-display selection collected 32 movable entries across eight monitors but no readable piece names. A dedicated LIM primary had three named groups. The former count is larger without being a deeper anatomical explanation. The full table and sweep method are in the [domain review](railway-content-review.md#measured-inspection-depth-at-the-baseline).

Engine had a different constraint: `docs/DESIGN.md` correctly protected continuous shafts, but the renderer supplied no independent shell-inspection layer. Maintaining shaft topology and exposing stationary casings are compatible; the implementation had not separated those concerns.

## 2. Concrete corrections in this review

### Railway

- Added **Inspect inside / Reassemble**, with selected-assembly framing, paused motion, readable part names and restored camera/context.
- Added named staged inspections for the **LIM primary, transformer and rectifier**. Earlier stages expose enclosure/support structure; later stages expose the working internals. Other models retain their existing separation behavior.
- Added physical names at **58 communications and 11 OCC registration sites**. These label existing hardware; they do not invent vendor-specific board internals.
- Corrected the schematic rotary gearbox to use **24/12 teeth** for its **0.22/0.11 pitch radii**, consistent with its opposed **1:2 speed relationship**. Tooth profiles remain schematic tapered extrusions, not verified involute gears or fleet-specific dimensions.
- Replaced the gearbox's solid body with a backplate and perimeter walls so the gears are actually exposed when its cover opens.
- Fixed scene restoration to reset separation as well as isolation/focus, and retained stage-button DOM nodes so changing stages does not discard keyboard focus.

The gear correction is grounded in a common module and tooth/speed relationship; see [ISCAR's gear-module definition](https://www.iscar.com/faq.aspx/countryid/11) and [Ohio University ME 3011 gear notes](https://people.ohio.edu/williams/html/PDF/Supplement3011.pdf). It is an internally coherent teaching reduction, not a validated production gearbox.

### Engine

The companion change adds staged radial casing and combustor-liner inspection, guide lines, separate casing identities, pause/restoration semantics and architecture/trial resets. It corrects solid hubs that crossed independent shafts, removes conflicting decorative details in their overlap, and fixes non-shaft isolation visibility. Mechanical spools, vanes and bearing locations remain assembled.

The shell sectors are declared instructional cuts. They do not assert actual manufacturer split lines or a maintenance removal sequence. The change also clears stale guided-event highlights after manual input and distinguishes a manual transient from equilibrium.

### Validation and limits

The complete railway `npm run check` suite passed after the changes. This includes route round trips, independent technology combinations, actual geometry construction, selected-assembly separation, stage thresholds, reverse scrubbing/reassembly, camera restoration, gearbox module/speed checks and a ray reaching a gear through the opened housing. Communications and OCC checks also validate their new names.

Engine's 34 explicit tests passed: five inspection tests, five scene/clearance tests, eighteen plant/manifest tests and six numerical regressions. Its final `npm test` and production build passed, producing build ID `46a8d7da04c0`. The scene tests use real pinned Three.js geometry with a substituted display and controls; the clearance tests inspect transformed triangles across the complete concentric overlap at several relative shaft rotations. Neither repository's source/scene tests establish normal-WebGL appearance, label readability, screen-reader behavior or hardware performance. No production deployment is part of this review.

## 3. Define the full end state before expanding the catalog

For a priority assembly to be complete, a learner should be able to:

1. Locate it in the larger installation and understand its boundary.
2. Select one physical instance, identify its named parts and see what supports or connects them.
3. Open a useful section or staged inspection without losing orientation.
4. Trace a complete mechanical, electrical, fluid or information path relevant to the lesson.
5. Change a meaningful input, pause at the consequential state and explain what changed and why.
6. Compare a genuine alternative while preserving the same learning question.
7. Reassemble deterministically and inspect the source, scope and fidelity of each important claim.

Completion should be measured against these tasks, not mesh counts, fastener counts, visual density or number of menu entries. A simple diagram may be the most complete explanation of a control loop; an axlebox section needs actual spatial anatomy.

### A model contract that can support this

Use shared concept definitions, separate physical instances and explicit parent assemblies. Each inspectable node needs a stable instance ID, concept ID, parent, assembled transform, mechanism role, useful anchors and source/fidelity metadata. References establish the claim; asset provenance separately establishes the right to use the geometry or image.

Keep three transforms distinct: the assembled position, the mechanism's pose, and the inspection displacement. Derive the displayed result from state each frame. Do not mutate a previously exploded position and accumulate displacement. A point drive's normal travel, a shell's instructional separation and a camera change are different operations.

Authored inspection recipes should specify target parts, a retained reference, visibility changes, ordered groups, displacement directions, section treatment, labels and a suitable camera. Record the relationships that must remain intact. This does not require inventing a general-purpose automatic CAD disassembly solver.

Research provides a useful direction: [Li et al., SIGGRAPH 2008](https://grail.cs.washington.edu/projects/exview3D/) organizes exploded views around part hierarchies and relationships, while [Li et al., SIGGRAPH 2007](https://grail.cs.washington.edu/projects/cutaways/) makes cuts respect the structures they expose. The proposal here is to start with a small set of authored recipes using those principles.

### Rendering that supports anatomy

Author geometry at three scales: recognizable silhouette, functional interfaces and close inspection detail. Add a feature when it explains construction, support, motion, flow or connection. Use actual thickness, cavities, bores, attachment surfaces and modest edge treatment where needed. A normal map cannot create a visible shaft passage or open a blocked cutaway.

Use a restrained family of materials: metal, copper, insulation, elastomer, glass and board surfaces should read differently where relevant. Add an environment light/reflection setup, soft contact cues and controlled shadows. The [Three.js material documentation](https://threejs.org/docs/pages/MeshStandardMaterial.html) specifically recommends environment maps for its standard metal/roughness material; the [color-management guide](https://threejs.org/manual/pages/color-management.html) explains why correct input/output color spaces must precede lighting adjustments.

Treat sections as authored illustrations with readable cut faces and retained context. Reserve highlight colors for selection or the quantity being explained. Avoid making transparent shells, thermal colors, selection glow and physical material color compete in the same frame.

Provide assembly-specific cameras, near/far clipping appropriate to scale, labels attached to the actual selected instance, and occlusion/collision handling. Orbit is an exploration tool; it is not a substitute for a useful first view. Reader-controlled inspection should remain stable while someone reads. The donor's fixed-size overlay and automatic idle-tour takeover should not be copied as universal interaction rules.

Benchmark the first detailed assemblies on a named desktop and a modest integrated GPU. Set frame-time, download and memory budgets from those measurements. Share geometry/materials, instance repeated static parts where appropriate, load deep detail on demand, and offer lower-cost shadows/AO. Preserve a useful, clearly identified fallback and test it separately.

## 4. Railway: deepen and consolidate

| Workspace | Consolidation | Priority anatomy | Learning proof |
| --- | --- | --- | --- |
| Vehicle | Vehicle → services/bogie → drive/brake; reuse depot assemblies | Axlebox bearing/housing/seal; primary/secondary suspension; rotary motor and reduction; LIM terminals, winding/core and reaction rail | Trace body load to rail, motor torque to axle where applicable, or LIM force across its air gap; identify rotating and stationary parts. |
| Traction energy | Supply profile → substation → transformer/rectifier/switchgear, linked to one circuit representation | Terminals, winding/core relationships, semiconductor/cooling/bus connections and protection boundaries | Selecting a physical part selects its circuit role and current/voltage relationship. |
| Track | Support/fastening → turnout/drive → crossing interfaces | Separate shoulder/clip/pad/insulators; drive, lock and detection interfaces | Explain which part supports, guides, moves, locks or reports position. |
| Station | Overview as installation locator; reusable platform/lift/plant/comms assemblies | Door mounting, pocket/lock/sensing, access and clearance; useful fan/pump sections | Keep location and chosen configuration while moving to a detail; distinguish physical position from reported state. |
| OCC and communications | Room → console/rack → device; linked information/application diagrams | Individual hardware instances, ports, power and network paths | Trace field observation to application/display/recording and explain a shared dependency or loss of one branch. |
| Maintenance | Reuse the same physical asset across inspection/repair/test | Existing detailed brake/HVAC equipment in its installed context; meaningful access geometry | Connect condition, physical inspection, test result and evidence without treating a process card as a machine part. |

Keep propulsion independent of train-control selection. Preserve the current separation of OCC equipment from people/processes. Retain stable deep links when consolidating presentation; a learner's bookmark should still open the intended component and configuration.

Manufacturer sources support the component categories: [SKF axlebox anatomy](https://evolution.skf.com/en/the-evolution-of-railway-axlebox-technology/), [Pandrol e-Clip](https://www.pandrol.com/en-us/products/fastening-systems/fasteners/e-clip), and [Knorr-Bremse actuators](https://rail.knorr-bremse.com/en/us/portfolio/products-and-systems/braking-systems/actuation/). Their product-specific ratings or maintenance instructions should not be generalized to the schematic railway.

## 5. Engine: deepen and consolidate

Use three coordinated representations of one selected concept: **anatomy**, **gas/heat/work**, and **control response**. Keep installation → module → assembly → part as the spatial hierarchy. A signal diagram explains the causal loop; 3D locates its physical sensor and actuator. Trials should stay alongside those representations.

| Priority | What to author | What to preserve or distinguish |
| --- | --- | --- |
| Core sequence | One complete compressor-stage, combustor and turbine/spool sequence: rotor/stator rows, blade shape/attachment, annular passage, casing support, liner/injection/air paths, guide vanes, bearings and seals | Independent spool routing, fixed vanes, supported shafts, explicit illustrative dimensions and stage counts |
| Output | Helicopter reduction/freewheel/main and tail paths; turboprop reduction/pitch hub/PCU; fan/core torque and bypass paths | Free turbine versus freewheel; engine governor versus propeller pitch control; useful shaft power versus jet thrust |
| Services | One coherent representative fuel path; oil pressure/scavenge/filter/cooler/breather; starter/generator/bus | Physical circuit, sensed quantity and controller role; architecture-specific choices |
| Comparative learning | Match architecture changes to a question: what turns, what is coupled, what regulates speed, where useful output appears | Shared explanations can be reused; genuinely different topology and numerical plants remain distinct. |

[NASA's axial-compressor reference](https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/caxial.html) supports rotor/stator and casing relationships while acknowledging the complexity of actual flow/performance. Its [two-spool turbofan explanation](https://www.grc.nasa.gov/www/k-12/airplane/Animation/turbtyp/etfh.html) provides a clear independent-shaft and core/bypass reference. Use the [Brayton-cycle material](https://www.grc.nasa.gov/www/k-12/airplane/brayton.html) to coordinate a thermodynamic lesson, and the [FAA helicopter handbook's systems chapter](https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook/hfh_ch04.pdf) for the distinct freewheeling function.

These sources support relationships and teaching boundaries. They do not calibrate the current plant equations to a real engine. More convincing materials must not change a synthetic reading into an apparently measured one.

## 6. Execution order and acceptance gates

| Stage | Deliverable | Gate before expanding |
| --- | --- | --- |
| 1. Review corrections | The two bounded inspection/geometry changes and reports | Existing regressions plus new consequential geometry/state checks pass; normal-WebGL visuals accepted before merge |
| 2. One complete study per project | Railway bogie/drive/brake/axlebox; Engine compressor/combustor/turbine | Reference sheet, declared scope, all promised parts selectable, one complete path, assembled/section/inspection views and a successful learner task |
| 3. Reusable authoring contract | Concept/instance/parent identity; deterministic transforms; exposure recipes; synchronized diagrams | A second assembly reuses the contract without duplicating its concept, source or simulation state |
| 4. Visual production pass | Material families, environment/contact lighting, cut faces, cameras and label placement | Current renders inspected at all inspection stages and key mechanism poses; performance measured on target devices |
| 5. Consolidation | The task workspaces above, using shared detailed assemblies | Existing bookmarks/configuration round trips retained; less duplicate content; users keep context across scales/views |
| 6. Expand depth | Remaining priority assemblies, service paths and comparisons | Each meets the same anatomical, source, causal, interaction and visual criteria |

For every accepted study, retain a compact evidence package: the learning question, primary references, declared configuration, component/instance list, topology and clearance invariants, representative rendered states, a learner task result and the tested browser/device. Label support as sourced, calculated, synthetic or explanatory where the distinction matters.

The next large investment should be detailed assembly authoring and its validation. A renderer replacement, another global theme change or a larger catalog would leave the central gap unresolved.
