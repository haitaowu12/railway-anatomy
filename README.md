# Railway Anatomy

A growing public reference for understanding how a railway fits together: its places, vehicles, equipment, interfaces and the people who operate and maintain it.

Railway Anatomy is intended especially for graduates, newcomers and people moving into another railway discipline. It connects familiar things—a train, a platform, a control room—with the less visible systems behind them. The aim is to make those relationships easier to explore, discuss and learn, and to point readers toward useful public material for further study.

**[Explore Railway Anatomy](https://haitaowu12.github.io/railway-anatomy/)** · [GPT Sites](https://rail-systems-atlas.techiesea.chatgpt.site) · [Read the guides and sources](https://haitaowu12.github.io/railway-anatomy/reading.html) · [Suggest a correction or addition](https://github.com/haitaowu12/railway-anatomy/issues/new/choose)

This is a young project. Some topics are developed further than others, and railway practice varies between systems. Feedback from learners and practitioners is welcome: a confusing explanation, a missing interface, a misleading model or a better public reference is a useful contribution. You do not need to write code to help.

## Why I am building this

This project grew out of the experience of bringing graduates into railway work in Canada. People can arrive with strong engineering fundamentals and little exposure to the systems that make a metro or railway run. I want to make that first step easier: an approachable place to see the equipment, ask questions about its interfaces and find public material for the next stage of learning.

It is also a way to share more railway systems knowledge beyond the people already working in the industry. The models and guided journeys are an introduction and an invitation to explore further. Additions, corrections and feedback from both newcomers and experienced practitioners are welcome.

## Explore from the railway to its parts

Begin with the whole railway, then enter a station, train, depot or control centre. Movement, power and information overlays connect those places. From there, inspect an assembly, compare an arrangement or follow an interface into another system. Breadcrumbs, related-component links and return navigation help retain the surrounding context.

Different questions need different representations:

| Representation | What it helps explain | Examples |
|---|---|---|
| **3D equipment and places** | Where equipment sits, how parts fit together and what changes physically | Track fastenings, point drives, bogies, collection equipment, component benches, ventilation plant and communications cabinets |
| **2D information and electrical relationships** | What connects to what, which way information travels and where functions are located | OCC requests and returned indications, field input/output to SCADA, networks, voice and video paths, transformer waveforms and rectifier conduction |
| **2D people and processes** | Who contributes, which information crosses a boundary and what remains unresolved | Configuration change, asset handover, worksite handback, maintenance release, duty handover and incident coordination |
| **Reading and guided exploration** | Why an interface matters and where to investigate further | Component explanations, system guides, public sources and optional learning questions |

In a model, select equipment to inspect it, frame it or isolate its visible assembly. Authored cutaways and separation expose parts where that helps explain construction. Comparisons change the represented equipment or relationship; phase controls explain selected mechanisms and information exchanges. Sequences have named steps, manual previous/next controls and a finite end state; repeating is optional. Numbered pins remain attached to visible equipment and correspond to a fixed parts key. The complete explanation and public references open below the workspace.

Use the six **Connected studies** workspaces to follow vehicle, energy, track, station, information or maintenance questions. The **Assembly anatomy** panel keeps an individual part, its parent assembly, inspection recipe, physical path and sources together. Expand a branch or search for a covered bearing, terminal or casing; technology alternatives stay outside the current configuration. **Study & check** pairs anatomy questions with applied calculations and evidence cases.

Use **Find anything** (or `/` / `Ctrl+K`) to jump directly to a view, component, process, interface or tour. The sidebar groups the current study into visible sections, and **Jump to view** plus previous/next controls make adjacent topics reachable. **Find a railway view** filters the local hierarchy; **Browse by system** retains the original area navigation. On a phone, **Browse railway** opens that same hierarchy. The inspection dock keeps a numbered part selector, equipment search and the selected explanation together; **Show parts list** opens the complete key.

The railway also has systems that cross physical boundaries. Power supply reaches trains and stations; communications connect endpoints in several locations; train control combines onboard, trackside and control-centre functions. The navigation and cross-links preserve these relationships instead of giving each component only one place in a rigid tree.

## Learn through selected examples

The models cover track and guideway, vehicles and propulsion, traction power, train control, communications, station plant, control-centre equipment, and depot and maintenance facilities. Connected studies explore wheel–rail behaviour, infrastructure maintenance, accessibility and shared system dependencies.

### Collection, supply and return

Four electrification examples distinguish the collection equipment, conversion stages and normal traction return path:

| Teaching example | Collection | Conversion and return shown |
|---|---|---|
| Fourth-rail DC | Supply and return conductor rails with separate shoes | Wayside rectification; a separate return conductor |
| Third-rail DC | Conductor rail and shoe | Wayside rectification; return through wheel connections and running rails |
| Overhead DC | Contact wire and pantograph | Wayside rectification; return through running rails |
| Overhead AC | Contact wire and pantograph | Onboard transformer and line converter; primary-circuit return through running rails |

These are selected schematic arrangements. Their public references and assumptions appear with the explanations. Collection, propulsion and train control remain distinct choices; selecting them together does not establish that a particular commercial combination exists.

### Train control and shared equipment

Conventional signalling, CBTC/urban ATC and ETCS are explained as related families with different purposes and implementations. Protection, automatic operation, supervision, interlocking and train detection are distinguishable functions. Devices such as balises, axle counters or radio equipment can appear in more than one architecture. Supplier examples keep their generation and source scope, rather than defining the whole subject around a product name.

### Stations and control centres

At a platform, choose the **physical edge** independently of the mechanism being studied. Open, half-height and full-height arrangements remain in place when switching between applicable studies; interspace sensing requires a fitted barrier. The boarding illustration separates leaf movement, the closed contact, the lock mechanism and the returned indication. A two-landing lift study shows the relationship between the moving cabin and the fixed landing doors.

The OCC equipment views cover the **room, console and technical room**, with mounted displays, accessible computing equipment, cabinet modules and physical cable routes. The separate **OCC applications** workspace follows named device points across nine application scopes: communications SCADA, train supervision, power SCADA, facilities, passenger information, video, radio, access control and network management. Choose a point, compare a condition and trace an observation or a permitted request. Roles, incident coordination and duty handover remain in People & processes.

### Control, supervision and optional integration

The **Interfaces** workspace separates 15 responsibilities, including communications SCADA, power SCADA, BAS/BMS, tunnel ventilation, station smoke control, fire detection, drainage, platform doors, signalling and communications. A local controller, its native supervisory application, the transport path and an optional common supervisory view have distinct roles. Sharing a software platform does not make them one control function.

Communications SCADA can acquire selected device conditions directly or through native managers. The OCC study compares no telecom SCADA link, monitoring only and a specifically configured request interface. Native PA audio, CCTV video, radio calls and network administration retain their own functions. Published operator and supplier examples support these possibilities without assigning one universal railway architecture.

Compare separate supervision, shared status summaries and selected supervisory requests. Change each function’s common-view connection independently: **not connected**, **monitoring only**, or **selected requests plus monitoring** where the declared function allows it. Follow an indication or a request through normal, lost-link, local-control and missing-feedback conditions. The outcome keeps a command request, its receipt, its acceptance and the observed equipment state separate.

Public project examples show why these allocations vary. Crossrail’s published BMS narrative, MTR’s environmental-control scope and Melbourne’s TVCS/BMS interim-design scope describe different boundaries. The explorer’s patterns are original teaching examples; they do not claim to reproduce these installations.

### People and responsibilities

Eight process studies cover configuration, acceptance, worksite handback, maintenance release, duty handover, event coordination, infrastructure inspection and work-protection interfaces. These use 2D maps; structural assets remain in a separate physical inspection view. Accessible journeys, shared dependencies and test evidence use diagrams that show missing paths or evidence explicitly.

Representative roles connect control-centre, station, onboard, depot, engineering and maintenance work. Process maps show inputs, contributions, outputs, review questions and possible rework. They distinguish, for example, a completed maintenance activity from a decision about returning a vehicle to operation.

The automation comparison explains why GoA4 does not by itself determine station staffing or remove passenger assistance, maintenance and incident-management responsibilities. Role descriptions illustrate contributions, not a staffing plan or a universal allocation of authority. Follow the linked public sources for the relevant context.

## Sources and model scope

Explanations use public references from railway bodies, infrastructure managers, operators, researchers and equipment suppliers, including IRSE material. Source cards describe **what to read** and **how the source is used**. A public abstract, publisher listing or product overview is identified as such; it is not represented as access to the full paper or standard. Supplier examples and jurisdiction-specific guidance retain those limits.

The geometry is original and schematic. Positions, proportions, room arrangements and connections are chosen to explain a relationship, and do not reproduce an installed railway. Animations are teaching illustrations rather than measured simulations. A diagram can show an information exchange or a review boundary without establishing an operating procedure, safety authority or approval sequence.

The public site contains public-source explanations and original educational material. Contributions must also be suitable for public release. Please use public links and remove confidential project information, personal details and restricted material before opening an issue or pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for practical guidance.

## Help improve the project

Useful contributions include clearer explanations, corrected terminology, missing equipment or interfaces, stronger public references, more legible diagrams, accessible interactions and working model improvements. A concise issue describing the page, the difficulty and a suggested change is enough to start a discussion. A public source is helpful when available; newcomers are welcome to report what they cannot understand.

For a larger addition, explain the learner's question and how it connects to existing content before building a new view. Choose a physical model for equipment relationships and a diagram for information or process relationships. The [next learning studies](docs/LEARNING-ROADMAP.md) identify specific questions beyond the current baseline, with suggested representations and public research starting points. The dated [earlier coverage roadmap](docs/coverage-roadmap-2026-10-31.md) remains as a historical record.

## Run locally

The authored application is a dependency-free static website in `dist/`. For source development, serve it from the repository root:

```bash
python3 -m http.server --directory dist
```

Open [http://localhost:8000](http://localhost:8000). Serving over HTTP allows the browser's JavaScript modules to load consistently. The runtime is included in `dist/vendor/`; no package installation is needed to serve the site.

Use Node.js 24 for the repository checks:

```bash
npm run check
```

Create the same deterministic release artifact used by both hosts with `npm run build`. Serve `build/` to inspect the content-versioned production result; `build/release.json` identifies the artifact.

After changing catalog explanations, guides or sources, regenerate the static reading directory:

```bash
npm run reading
```

Automated checks cover content references, routes, model construction and selected behavioural invariants. Changes to presentation or interaction also need inspection in a browser. Record the viewport, renderer and journeys actually checked; a passing script does not establish visual quality on every device. The [revision 10 OCC correction record](docs/OCC-REVISION-10.md) and [browser audit](docs/AUDIT-10.md) describe the current changes and evidence. The [revision 9 correction record](docs/REVISION-9.md), [representation inventory](docs/REPRESENTATION-AUDIT.md) and [control-interface review](docs/CONTROL-INTERFACES.md) retain their earlier review context. The [revision 8 release record](docs/REVISION-8.md) maps the assembly, rendering, consolidation and applied-study work to its verification scope. The [revision 7 review](docs/REVISION-7.md) retains its earlier layout comparison and screenshots. The [revision 6 review](docs/REVISION-6.md) remains available for its earlier baseline. Historical review records in `docs/` describe their own revisions and scope.

## Where the code lives

| Area | Files |
|---|---|
| Application and navigation | `dist/index.html`, `style.css`, `depth.css`, `app.js`, `navigation.js`, `navigation-search.js`, `navigation.css`, `learning-workspaces.js` |
| Physical identity and connected study UI | `dist/assembly-contract.js`, `depth-ui.js`, `labs-ui.js` |
| Detailed shared construction and applied cases | `dist/mechanical-details.js`, `equipment-details.js`, `depth-content.js`, `physical-labs.js`, `evidence-labs.js` |
| Concepts, sources and view configuration | `dist/catalog.js`, `atlas-config.js`, domain-specific `*-data.js` modules |
| Equipment models and interaction | `dist/viewer.js`, `model.js`, `*-models.js`, `network-model.js`, `exploration.js` |
| Technology comparisons | `dist/technology.js`, `electrification.js`, `platform-config.js`, `comparisons.js` |
| Control responsibilities and optional connections | `dist/control-interfaces-data.js`, `control-interfaces-ui.js`, `control-interfaces.css` |
| Representation choices and dependency diagrams | `dist/representation-guidance.js`, `system-diagrams.js`, `topology-status.css` |
| Information and electrical diagrams | `dist/communications-data.js`, `topology-ui.js`, `electrical-explainers.js` |
| Playback and pins | `dist/interaction-state.js`, `motion-guides.js` |
| People and process diagrams | `dist/process-data.js`, `process-extensions.js`, `process-ui.js` |
| Learning and reading | `dist/tours.js`, `reading-guides.js`, `reading.html`, `scripts/generate-reading.mjs` |
| Checks | `scripts/check-site.mjs` and the focused `scripts/check-*.mjs` suites |

The site uses WebGL for 3D rendering where available, with an SVG compatibility renderer when WebGL initialization is unavailable. There is no application account or backend. Saved exploration choices and learning progress remain in the visitor's browser. External reading links open their publishers' sites.

## Publication and licence

[GitHub Pages](https://haitaowu12.github.io/railway-anatomy/) is the primary published destination. The repository's Pages workflow checks the source, builds and deploys `build/`. The existing [GPT Site](https://rail-systems-atlas.techiesea.chatgpt.site) receives the same application build through its separate source/version workflow. Both hosts expose `release.json` so matching application versions can be verified; a GitHub commit alone does not update the second host.

Project code and original content are provided under the [MIT licence](LICENSE). Referenced publications and vendored dependencies retain their own licences and rights.

Built by [Tony Wu](https://haitaowu12.github.io/tony-wu-home/) · [More projects](https://haitaowu12.github.io/tony-wu-home/#work).
