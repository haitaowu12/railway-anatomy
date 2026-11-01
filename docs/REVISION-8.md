# Revision 8: assembly depth and connected learning

1 November 2026

## Release purpose

The previous review found that the catalog and navigation were much deeper than many of the physical models. This release adds inspectable construction, individual part identity, authored inspection views, shared equipment and applied learning cases. The public scope remains an original, schematic educational atlas.

The starting implementation is the review branch at `03ebbe90e717409e8a1177dd59e2a1d056b3cd7c`, based on main `8cfd611274ca7e27281e7d798cc6f93901258719`. The [dated review](review-2026-11-01/README.md) records that baseline; its statements about unimplemented work and draft publication describe that earlier point in time.

## What a learner can do

Six connected workspaces preserve the existing catalog, system navigation, deep links and independent technology choices. They organize the physical models and diagrams around a question rather than treating every view as a separate destination.

| Workspace | Implemented construction and relationships | Representative task |
| --- | --- | --- |
| Vehicle and running gear | Axlebox housing, cover, bearing races, rolling elements, cage and seal; primary and secondary suspension; rotary motor and reduction; LIM slots, phase groups, terminals and reaction-rail layers; shared detailed disc brake and HVAC assemblies | Follow body load to rail; distinguish rotating and fixed bearing parts; compare rotary torque with the LIM air-gap interface. |
| Energy and conversion | Named transformer winding/terminal identities, rectifier connections/cooling, AC/DC switching compartments, power terminals and separate supervisory interfaces | Move between the equipment and electrical representation without confusing the power path with a status or request. |
| Track and movement | Separate fastening clips, retained shoulders, insulators and pads; point-drive rack and pinion, supports, output linkage and distinct position evidence | Explain support, retention, motion, locking and detection as different relationships. |
| Stations and plant | Door mounting and guided hangers, separate drive and proof; open fan passages, filter/coil/drain paths, pump impeller and shaft seal; independent platform configuration | Inspect a working section and identify the chosen physical configuration and its sensing interfaces. |
| OCC and information | Individual console/device instances, named power/data/feedback ports, rack distribution/bonding/cable management, local versus remote workstation cabling | Trace an observation through acquisition, application, display and retained evidence; compare failures of separate prerequisites. |
| Maintenance and evidence | Reused vehicle/depot brake and HVAC builders, component/fixture contexts, measurement and change-evidence cases | Connect the same asset to an inspection or test while keeping observation, diagnosis and release separate. |

The **Assembly anatomy** panel provides a progressive physical hierarchy, search through collapsed assemblies, selected-part function/interfaces, sources and fidelity, parent navigation, and assembled/section/inspection controls. A physical instance has its own identity even when several instances reuse one catalog concept. Unavailable technology alternatives are omitted from the active hierarchy; covered internal parts remain discoverable.

Selected inspection is specific to the chosen occurrence. An explicit all-instances control selects equivalent physical parts. Inspection uses retained reference geometry and authored stages; local recipes remain local rather than merging every nested part into a long list of unrelated stages. Inspection-facing cameras and context restoration support close study. The displacement is a teaching arrangement, not a maintenance removal procedure.

Fifteen sourced anatomy studies connect questions, physical selections, explanations and self-review. Their steps can move between an installation and its detailed equipment while retaining the learning context. Existing guided tours and their answer feedback remain available.

## Applied studies from the learning roadmap

The ten questions in the [learning roadmap](LEARNING-ROADMAP.md) now have bounded interactive implementations. These are deliberately specific teaching cases, with their assumptions displayed alongside the controls. They do not claim the general numerical or operational capabilities excluded below.

| Roadmap question | Implemented interaction | Explicit boundary |
| --- | --- | --- |
| Named supervisory point | Compare matching, delayed, mismatched and qualified observations; carry source identity, units, source time, receipt time and quality | Invented records and times; no deployed point database or prescribed freshness threshold. |
| Shared dependencies | Propagate declared power/network/application/recording losses through a fictional graph and inspect what remains available | No automatic recovery, data backfill, redundant-network availability or battery-duration solver. |
| Condition evidence | Compare repeat measurements, repeatability, calibration relation and contextual evidence | An uncertainty/evidence example; no defect acceptance value, diagnosis or return-to-service decision. |
| Announcement acoustics | Vary speech/noise levels and an idealized decay/gap example | No predicted room coverage, measured intelligibility, STI or compliance result. |
| Moving radio service | Inspect a declared access/transport/transfer timeline with distinct prerequisite states | No propagation/coverage prediction, handover optimization or movement authority. |
| Electrical sections | Compare a declared two-section DC circuit, section boundary, local opening and independent supervisory snapshot | Synthetic per-unit circuit solution; no protection setting or switching/isolation procedure. |
| Fan and plant | Compare fan speed and plant resistance against a synthetic fan/system intersection | No manufacturer fan curve, CFD, cooling-load or smoke-management calculation. |
| Wheel and rail | Compare dimensionless vehicle/wheel speed, slip, brake demand and a declared saturation law | No real adhesion classification, operational stopping distance or validated wheel-slide protection algorithm. |
| Drainage and observations | Balance an invented water store and keep independent structural/survey observations visible | No geotechnical stress, pore-pressure, settlement or failure prediction. |
| Change impact | Propagate a fictional revision through interfaces and evidence; distinguish current/old test evidence and outstanding issues | No approval or certification decision. |

The calculation plots include axes and units, exact plotted-value tables and source/scope notes. Source records distinguish evidence supporting a relationship from synthetic parameter choices. Reference material does not turn an invented measurement into a real one.

## Rendering and authoring changes

The WebGL renderer has a locally generated studio reflection environment, distinct material families, controlled shadows and a camera-fit shadow volume. Geometry depth comes from actual cavities, bearing passages, sections, supports, separate interfaces and reusable mechanisms. No generated bitmap is used as evidence of an exact mechanical structure.

The original SVG geometry renderer remains available when WebGL cannot initialize. It projects the authored scene but has limited material/shadow fidelity. The interface identifies this mode. Runtime diagnostics distinguish renderer, environment, shadows, visible mesh/triangle counts and pixel ratio; they are engineering observations rather than a device performance certification.

The authoring contract separates reusable concepts from stable physical instance paths and parent assemblies. Displayed transforms derive from assembled state, mechanism pose and inspection displacement. Tests check reverse scrubbing and restoration to prevent accumulated displacement. Functional paths resolve to actual nodes in the selected assembly.

## Verification

Run the complete gate with `npm run check`. It includes the earlier catalog, navigation, technology, geometry, platform, electrical, communications, OCC, depot and playback contracts, plus:

- Physical identity, repeated-instance selection/isolation, deterministic reassembly, hierarchy availability and selected inspection recipes.
- Bearing/shaft clearance, gear relationship, brake/frame envelope, retained datum and point-rack displacement/rotation checks.
- Actual physical port/connection ownership, ray access into an opened pump, open fan passage, station mounting and domain source references.
- All six workspace routes and all fifteen anatomy studies resolving to known content and actual starting geometry; search through covered parts.
- Bookmarks for a selected instance, functional trace, workspace, study and inspection exposure preserving independent technology choices.
- Dependency propagation, point identity/time semantics, uncertainty/calibration behavior, conservation, revision impact and finite deterministic calculations.

Browser review in this release used the managed Chromium preview on a desktop viewport. WebGL creation was unavailable in that environment, so the inspected pixels came from the SVG renderer. The review exercised physical part search, individual selection, inspection, staged exposure and reassembly; study and scenario controls; and publication identity. Browser findings led to concrete fixes for inspection occlusion and selection/context synchronization.

**Verification limit:** no result here is a hardware-WebGL visual sign-off or a measured desktop/mobile GPU performance benchmark. Responsive layout and keyboard-accessible native controls are implemented; source tests and a desktop SVG review do not establish every screen-reader/mobile-device outcome. Normal hardware WebGL should be assessed against the same study tasks when that environment is available.

## Publication and reproducibility

`dist/` is the authored source. `npm run build` creates a deterministic `build/` artifact with one content-derived asset version, a build meta tag and `release.json`. Internal module, stylesheet and entry-point references use that version to reduce stale-cache mixing and make the intended release explicit. GitHub Pages and GPT Sites publish that same application artifact. Each hosting system retains its own source-commit provenance.

The Pages workflow runs the complete checks and builds before deployment. The existing public GPT Site is updated through its source repository and saved-version workflow. No new Site or access-policy change is required.

Canonical publications:

- [GitHub Pages](https://haitaowu12.github.io/railway-anatomy/)
- [Railway Anatomy on GPT Sites](https://rail-systems-atlas.techiesea.chatgpt.site)
- [Companion Engine Anatomy](https://haitaowu12.github.io/engine-anatomy/)

## Source and geometry rights

New references are public primary material from equipment manufacturers, engineering institutions, transport organizations and research/publication bodies. Their catalog scopes state the supported claim and limits. All added model geometry, graphs and fictional cases are original educational work. Existing dependency licenses and source notices remain in the repository.
