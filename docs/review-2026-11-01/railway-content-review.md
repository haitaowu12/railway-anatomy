# Railway Anatomy — content and assembly-depth review

Review date: 1 November 2026  
Source baseline: [8cfd611274ca7e27281e7d798cc6f93901258719](https://github.com/haitaowu12/railway-anatomy/tree/8cfd611274ca7e27281e7d798cc6f93901258719)

## Evidence and limits

This review inspected the shipping source, catalog, navigation, assembly builders and tests. It executed the production scene builders and inspection helpers with a substituted renderer; it is not a practitioner trial or a claim of visual quality. The coordinating review captured the current Pages interface through its SVG compatibility renderer after WebGL context creation failed. Hardware WebGL appearance and performance require a separate check.

The inventory below describes the baseline commit, before this review's code changes. Public source material and original schematic geometry remain the content boundary. GitHub Pages is the primary publication according to [README.md](https://github.com/haitaowu12/railway-anatomy/blob/8cfd611274ca7e27281e7d798cc6f93901258719/README.md); other hosted copies are separate deployments.

## Finding: broad coverage has outpaced assembly-level teaching

The baseline exports **322 concepts, 177 source records, 59 view-registry entries and 32 tours**. The view registry includes legacy routes that now redirect into process diagrams; these numbers are not a count of 59 equally developed anatomical models.

The latest revision has already corrected several earlier complaints. It separates platform-edge configuration from the mechanism being studied, puts OCC roles/processes in their own presentation, exposes transformer/rectifier/switchgear internals, and supplies named finite animation stages. The existing tests exercise these distinctions. Repeating those features under new names would add little.

The remaining gap is depth and inspectability. A scene can contain many meshes while exposing only a few learnable assemblies. A concept can be present, selectable and cited without allowing the learner to inspect the mechanism needed to understand it.

### Measured inspection depth at the baseline

For each registered view, the review selected its first listed variant, kept the exterior assembled and used the viewer's default technology choices. It enumerated visible component IDs through the shipping viewer and queried the shipping exploration capability API. Counts below are **registered movable entries**, not manufactured-part totals or a completeness score.

| View / selected concept | Movable entries | Distinct learner-facing piece names | Interpretation |
| --- | ---: | ---: | --- |
| Linear motor / primary | 3 | 3 | Mounting frame, core and winding groups; detailed winding topology and terminals are not separate learning objects. |
| Bogie / bogie | 13 | 9 | Includes repeated wheelsets, brake equipment, primary and collectors. Frame and suspension are still one group. |
| Vehicle / bogie | 26 | 9 | Two bogie instances increase the count without adding new anatomical categories. |
| Transformer / transformer | 7 | 5 | Real internal separation exists; covers were not named in the capability output. |
| Rectifier / rectifier | 6 | 3 | Repeated heat sinks/device stacks increase entries; functional categories remain few. |
| Communications network / rack | 13 | 0 | Removable hardware exists, but the inspection API supplied no readable piece names. |
| Communications SCADA / RTU | 7 | 0 | Processor, I/O, power and terminals exist but were unnamed in inspection metadata. |
| OCC console / task displays | 8 | 0 | Two monitors share one concept ID; each has four movable pieces. |
| OCC room / task displays | 32 | 0 | Eight monitor instances inflate the count while retaining one concept identity. |

Across this deliberately narrow sweep, 856 view–component combinations were visible, 271 offered internal separation, and 75 of those returned at least one readable piece name. These totals include repeated concepts and instances. They identify an inspection-metadata gap; they do not establish that every unseparable leaf needs an exploded view.

Evidence: [exploration.js](https://github.com/haitaowu12/railway-anatomy/blob/8cfd611274ca7e27281e7d798cc6f93901258719/dist/exploration.js), [viewer.js](https://github.com/haitaowu12/railway-anatomy/blob/8cfd611274ca7e27281e7d798cc6f93901258719/dist/viewer.js), [communications-models.js](https://github.com/haitaowu12/railway-anatomy/blob/8cfd611274ca7e27281e7d798cc6f93901258719/dist/communications-models.js), [occ-models.js](https://github.com/haitaowu12/railway-anatomy/blob/8cfd611274ca7e27281e7d798cc6f93901258719/dist/occ-models.js).

## Confirmed limits and corrections

### 1. Unnamed removable parts

The communications and OCC builders registered displacement vectors but omitted the existing `explorationLabel` metadata. The application could report how many pieces moved while offering no names for them.

This review adds explicit physical names at **58 communications registration sites and 11 OCC registration sites**. Names describe the rendered hardware: a circuit board, power module, optical transceiver, battery cassette, display panel, microphone, terminal strip or enclosure. They do not imply a vendor's actual board layout.

Focused checks now verify that all visible removable parts in those families have labels, the switch lists its five represented pieces, RTU input cards remain distinguishable, and local-computer labels do not appear in the remote KVM arrangement. Naming an optical transceiver does not incorrectly make the transceiver itself internally explodable.

Validation: `node scripts/check-communications.mjs` — 18 checks passed; `node scripts/check-occ.mjs` — 13 checks passed. The coordinating change surfaces these names in the inspection UI.

### 2. Concept identity is not physical instance identity

`assemblyRoots(record, componentId)` collects every visible instance of a concept. A selection of “task display” in the control room therefore refers to multiple monitors, and a bogie selection can collect multiple bogies. This is useful for explaining a category, but it limits precision during inspection.

The next model contract needs separate `conceptId`, `instanceId` and `parentAssemblyId`. Selecting one physical instance should preserve its place, camera and parent chain; “show all instances” should be an explicit alternative. Source-backed component definitions can remain shared.

### 3. Displacement alone does not author a teardown

At the baseline, `applySeparation` applies each authored vector multiplied by one global fraction. There is no authored dependency between removing an enclosure, revealing the support structure and exposing the mechanism. A useful next step is a small set of staged study sequences with a retained reference part, named stages and restored final/initial states.

Those stages are explanatory inspection steps. They must not be described as disassembly or maintenance instructions unless a source actually establishes such a sequence.

### 4. The rotary gearbox shows inconsistent tooth geometry

The baseline `makeBogie` draws the same twelve tooth blocks on both the 0.22-radius gear and the 0.11-radius pinion, while rotating them in a 1:2 speed relationship. Equal tooth counts do not support that relationship. This is a concrete example of extra visual detail creating a technical inconsistency.

The coordinating correction uses 24/12 teeth with a common module for the 0.22/0.11 pitch radii and retains the opposed 1:2 speed relationship. It also replaces the solid housing with a backplate and perimeter walls, so opening the cover actually exposes the gears. Geometry checks verify the module and speed relationship and that a ray through the open cover can reach a gear. The teeth remain schematic tapered extrusions, not verified involute profiles or fleet-specific geometry. [KHK's spur-gear technical information](https://khkgears.net/pdf/2025/spur-gears.pdf) explains compatible module and pressure angle; its [gear-ratio explanation](https://khkgears.net/new/gear_knowledge/gear-nomenclature/idler-gear.html) relates speed ratio to tooth counts.

### 5. Existing tests protect consistency more than learned understanding

The current checks verify finite geometry, valid concept/source links, routed alternatives, selected mechanisms and several causal distinctions. They do not establish that a learner can identify each physical part from its shape, that a cutaway exposes the intended interface, or that an animation teaches a new relationship.

Preserve these checks. Add acceptance evidence for each developed assembly: the learning question, physical parts needed to answer it, source scope, captured assembled/sectioned/exploded states, and an observable task outcome. Do not replace this with a mesh-count target.

## Where to deepen the subject

| Study | Existing basis | Detail that adds understanding | Completion evidence |
| --- | --- | --- | --- |
| Bogie and wheelset | Frame, wheels, simple suspension, brake equipment, sensors and chosen propulsion | Separate primary/secondary suspension paths; one axlebox with housing, bearing and seal; mounting and load transfer; distinguish wheel rotation from stationary housing | Learner traces body load to rail and identifies which bearing parts rotate. [SKF axlebox anatomy](https://evolution.skf.com/en/the-evolution-of-railway-axlebox-technology/) supports the distinct bearing/housing/sensor categories. |
| Rotary drive | Motor housing, coupling, gearbox and animated gears | Stator, rotor, shaft, bearings, cooling path and gear output; compatible mesh; one coherent torque path | Paused states show an uninterrupted shaft/gear/axle path; rotation and tooth ratios agree. |
| LIM | Mounting, core, winding groups and qualitative field cues | Named supply terminals, winding/slot relationship, reaction-rail conductor and backing, air-gap interface; explicit separation of magnetic, mechanical and electrical roles | Learner distinguishes traction-power rail, LIM secondary and running rail and explains the force interface. Keep current source limits on finite-length effects and avoid implying a solved field. |
| Rail fastening | Clip/shoulder group, insulators, pad and baseplate variants | Separate retained shoulder from removable spring clip; show contact interfaces and load paths; compare one complete named fastening family at a time | Assembled and exploded views preserve the same parts and attachment relationships. [Pandrol e-Clip](https://www.pandrol.com/en-us/products/fastening-systems/fasteners/e-clip) identifies clips, shoulders, pad and insulators as distinct elements. |
| Brake system | Bogie brake shapes and a more developed depot caliper study | Reuse the detailed caliper in the vehicle context; expose actuator, lever, pads, disc and mounting; connect pneumatic/electrical command to force separately | Learner distinguishes demand, actuator travel, pad contact, wheel response and available adhesion. [Knorr-Bremse actuator examples](https://rail.knorr-bremse.com/en/us/portfolio/products-and-systems/braking-systems/actuation/) provide relevant physical families without making their ratings universal. |
| Traction supply | Dedicated transformer, rectifier and switchgear studies | Connect inspectable internals to the existing electrical diagram; label which circuit, terminal and current path each part belongs to | Selecting a winding or diode links the physical part to the relevant circuit; diagrams and geometry use the same phase/terminal identities. |
| Platform and station | Independent edge selection, door mechanism, lift and station equipment | Reuse one station/platform coordinate model; add mounting, doorway, clearance and access context where they explain installation; keep sensing evidence separate from control response | Cross-view selection retains edge type and chosen equipment; a close-up identifies its location in the overview without adding unrelated subsystems. |
| OCC and communications | Room, console, racks, devices and information diagrams | Individual instance inspection; named ports/connections; shared component geometry at room/rack/device scales; link a physical path to its information quality/history | Learner traces field input to application to display and recording, and explains why a lost display does not prove a lost field function. |
| HVAC and water plant | Fans, dampers, AHUs and pumps | Meaningful sections through flow paths; bearings/drive/impeller where useful; distinguish ordinary HVAC from smoke-control objectives | At each paused state, the learner identifies the air/water path and the physical consequence of the selected mechanism. No invented compliance or emergency-operating rule. |

These are depth targets, not requests to model every fastener or print every manufacturer's specification. The geometry should be detailed enough for the learning question, with technical relationships preserved when cosmetic features are simplified.

## Consolidate around tasks while preserving deep links

1. **Vehicle inspection:** connect `vehicle`, `services`, `bogie`, `lim` and `adhesion` through a common vehicle context and explicit scale changes. Reuse the detailed depot brake and HVAC assemblies in the vehicle when appropriate. Keep LIM versus rotary as a technology choice independent of train control.
2. **Traction energy:** treat `system`, `electrification`, `substation` and the three equipment studies as one energy-chain workspace with drill-down. A circuit mode and an equipment mode should select the same concept/instance rather than display unrelated labels.
3. **Track assembly:** connect support, fastening, turnout, point drive and crossing by their interfaces. Put supplier examples inside the relevant comparison. Preserve the distinctions between support, guidance, drive, lock and detection.
4. **Station installation:** keep the station overview as the physical locator, with reusable platform, lift, plant and communications assemblies. Show functional diagrams as another representation of selected equipment.
5. **OCC information:** room → console/rack → device is a physical hierarchy. Traffic/power/station information are applications across that hardware. Retain the separate People & processes destination for coordination and handover; do not repopulate the room with process cards.
6. **Maintenance:** equipment condition, inspection, repair and test can reuse the same physical asset. Keep evidence and return-to-service responsibilities in linked process views. Avoid creating a new near-identical 3D scene merely to label another process stage.

The route inventory and current redirects already provide much of this foundation. Consolidation should reduce repeated presentation and retain existing bookmarks, concept IDs and source links.

## Evidence needed for the end state

For each priority study, require one inspectable assembly with a declared boundary; named component instances and parent relationships; assembled, section and staged separation states; one mechanism that answers a stated question; synchronized physical and schematic representations where needed; and public evidence attached to the claims it supports.

Validate concrete invariants such as common shaft axes, compatible gear ratios, retained attachment points, door apertures and lock/contact timing. Then capture the learning task on hardware WebGL at the intended desktop viewport and on a supported narrow layout. Record renderer, browser and actual outcomes. A passing source check or an attractive still image alone does not establish this end state.

