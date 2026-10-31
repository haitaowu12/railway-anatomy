# Railway Anatomy

An interactive public educational guide to the railway as a connected system. Start with the network, enter a place or vehicle, then inspect its systems, equipment and interfaces through original 3D schematics and optional guided learning.

Version **4.0.0** contains **193 concepts, 113 public reading references, 37 model views and 26 guided tours across nine domains**. The complete application is a buildless static website in `dist/`.

[Open Railway Anatomy](https://haitaowu12.github.io/railway-anatomy/).

## Explore the railway

| Domain | What to explore |
|---|---|
| Whole railway | Three passenger stops, running line and turnback, depot connection, fleet facilities, control centre, traction substation and information links |
| Track & guideway | Ballasted, slab and direct-fixation support; rail fastenings; turnouts, point mechanisms, crossings and the LIM reaction rail |
| Power supply | Incoming AC, transformer and rectifier conversion, DC distribution, protection, current collection and braking-energy destinations |
| Vehicles & propulsion | LIM or rotary drives, carbody, bogies, inverter, braking, auxiliary power, HVAC, doors and compressed air |
| Train control | Protection, automatic operation, supervision, train detection, interlocking, movement authority and selected signalling architectures |
| Communications | Train–wayside radio, onboard networks, passenger information, audio, CCTV and station network connections |
| Stations & plant | Passenger spaces, trainway intrusion sensing and platform doors, electrical and mechanical plant, fire and life safety, ventilation, building automation and supervision |
| Control centre | Traffic supervision, signalling, power, station systems, operational radio and event recording |
| Depot, yard & maintenance | Network interface, reception and stabling, inspection and component work, washing, protection, facility services, materials and work records |

The **37 views** move from a whole railway or station to a rail clip, point drive, linear motor, fan or damper. Visitors can select equipment, orbit and zoom, use camera presets, open enclosures, separate parts and compare arrangements. Components link to related concepts and other useful model scales. Search and the field guide provide direct access without requiring a learning sequence.

### Start with the connected railway

The whole-railway view keeps the same physical places visible while three overlays explain different relationships:

- **Train movements:** teal paths connect passenger stops, the turnback and depot facilities.
- **Traction power:** amber and cyan distinguish outgoing and return relationships in the selected DC example.
- **Information links:** violet paths connect station, power and depot equipment with the control centre.

Select a place or asset, then use its destination action to enter the relevant model. The overview's train silhouettes locate vehicles within the railway; detailed propulsion and control hardware appears in the lower-level views.

Navigation separates **Places & fleet** from **Systems across the railway**. Breadcrumbs and named parent destinations expose the current level. Cross-system links describe interfaces instead of forcing every system into one physical containment tree. A return action restores the invoking view; browser history and deep links retain the selected location, component, alternative and technology choices. Search and the field guide provide direct entry to equipment.

The **26 guided tours** use the same explorer, with an explanation, an action to try and an optional self-check with answer-specific feedback. Learning completion, choices and attempt counts are stored in the visitor's browser using `localStorage`. They are not uploaded or synchronized: another browser, device or hosting domain has separate progress. The interface includes a local progress reset.

The [reading directory](dist/reading.html) provides publisher links, descriptions and scope notes and remains readable without JavaScript.

## What the models represent

All geometry is an **original schematic teaching composition**, generated in code. Equipment positions, dimensions, shapes and groupings are illustrative. Overview scenes compress distances; mechanism views enlarge details. Views do not share a survey scale or describe an installed railway.

The vehicle example uses a train-mounted short-primary linear induction motor and a passive reaction rail. The chosen power arrangement separates outgoing and return DC conductors from the wheel-running rails and the reaction rail. It is one arrangement used to make their different functions visible.

Train-control views distinguish conventional signalling, selected radio CBTC arrangements, historical SelTrac loop communication, radio-based SelTrac examples, the supplier's published SelTrac G9 description, and ETCS Level 1 and Level 2 examples. These are alternatives with different responsibilities and interfaces. Functional boxes and dashed information paths do not prescribe the number of computers, actual cable routes or a universal architecture.

Station views distinguish **fire and life safety systems (FLSS)**, normal ventilation and smoke-management objectives, local plant controls, **building automation / building management systems (BAS/BMS)**, traction-power **supervisory control and data acquisition (SCADA)**, station supervision and operations-control workstations. A supervisory connection is not automatically a direct control or safety authority. The illustrations do not prescribe control priorities, emergency sequences or a universally shared network.

Animations explain relationships, not quantitative performance. They are not electrical, braking, aerodynamic, fire or hydraulic simulations, operating procedures, or evidence of code compliance. Motion-sensing arithmetic is explicitly synthetic. Public references support the explanations; supplier examples and dated product generations retain their stated scope.


## Select technologies independently

The initial fictional train uses **LIM propulsion and loop-based SelTrac control**. Propulsion and train control are separate choices. Changing one preserves the other.

| Choice | Visible equipment change |
|---|---|
| LIM propulsion | Train-mounted primary and passive reaction rail |
| Rotary propulsion | Rotary motors, couplings and axle gearboxes replace the LIM arrangement; the reaction rail is removed |
| Loop CBTC | Insulated data loop, undercar pickup and wayside interface |
| Radio CBTC | Wayside radios and onboard radio equipment replace the loop path |
| Conventional fixed block | Lineside signals, detected track sections and their control interfaces |
| ETCS Level 1 | Balises, a lineside electronic unit and onboard reading equipment |
| ETCS Level 2 | Radio block centre, train radio and balise references |

The general railway-equipment scenes replace the relevant hardware instead of changing only a label. Named signalling studies preserve the selected propulsion and the DC power context. Operational voice and passenger communications retain their separate functions. ATO is not presented as an automatic feature of the conventional or ETCS examples.

When a technology change concerns equipment outside the current view, the explorer opens a relevant model and provides a return to the previous context. The change summary names the equipment affected. Choices persist in the URL and browser-local storage; explicit URL choices take precedence.

Specialist studies name their scope: the standalone LIM view is a mechanism close-up, and selecting ETCS does not convert the example into a mainline electrification design. A selected combination is not a claim that a commercial configuration exists or has been commissioned. SelTrac generations and other supplier examples retain their stated source scope.

## Platform protection, control centre and depot

The platform view compares open-trainway intrusion sensing, platform screen doors, train–door interspace sensing and platform-end access. Detection reports, physical barriers, closing-edge obstruction and closed/locked feedback are different concepts. The models do not calculate stopping response or simulate independent detector-health and lock-failure states.

The control-centre view separates traffic supervision, signalling workstations, power control, station supervision, radio dispatch and event records.

The depot is a connected set of work locations, services and information interfaces. Eight views make its different functions accessible:

| View | Equipment and alternatives |
|---|---|
| Whole depot | Network boundary, reception, yard throat, stabling, maintenance, washing and support buildings; facility and stabling emphases |
| Arrival & yard | Reception and departure roads, yard points, movement indications, local control and the mainline–depot interface |
| Maintenance hall | Recessed inspection pit and roof access; a bogie drop below an ordinary-height supported body; separate vehicle lifting with both bogies at floor level; an installed-wheelset lathe context |
| Wheel & bogie shop | Underfloor machining with the vehicle present; a removed wheelset on supports; bogie work stands, a spare assembly and a transfer trolley |
| Wash plant | A moving train through fixed brushes; travelling wash equipment around a stationary train; collection, treatment, reuse, make-up and residual-water paths |
| Facility services | Electrical distribution, compressed-air plant, ventilation, drainage, fire and security equipment; service and water-path alternatives |
| Stores & work planning | Receiving, racks, transfer aisle and workbench; separate planning, completed-work and release information |
| Work protection | Personnel protection, physical work boundaries, local indications and vehicle-energy isolation interfaces |

Alternatives change the represented mechanism. In the bogie-drop view, one bogie is removed from the train assembly and shown below its original position. In the lifting view, the raised body and floor-level bogies show a different load path. The wash alternatives change which equipment moves. A stored vehicle, a completed maintenance record, movement permission and verified energy isolation remain distinct concepts.

Public reading includes the [IRSE Australasian Section's Dry Creek depot case](https://irse.org.au/resource/2011-july-zhang-baulderstone-rail-car-depot-infrastructure-the-dry-creek-experience/), public facility guidance, and equipment descriptions from their publishers. The depot geometry is an original teaching composition, not a reproduction of a source layout or a set of work procedures.

## Run and check locally

From the repository root:

```bash
python -m http.server --directory dist
```

Open [http://localhost:8000](http://localhost:8000). Serve over HTTP so browser ES modules load consistently.

Use **Node.js 24** for the repository checks:

```bash
npm run check
```

The suite runs static/content checks and the model, technology, navigation and depot regressions. Individual checks can also run directly:

```bash
node scripts/check-models.mjs
node scripts/check-technology.mjs
node scripts/check-navigation.mjs
node scripts/check-depot.mjs
```

Checks cover the static bundle, content and source references, navigation and tour targets, module syntax, model construction, component availability, finite geometry, independent technology combinations, alternative geometry, route-state handling and depot mechanisms. Railway overlays are compared using actual vertex buffers and transforms; labels alone cannot satisfy that check. No package installation is needed for these checks or for running the site.

Headless checks do not replace browser inspection or validate real railway safety logic. **The latest browser QA used the SVG compatibility renderer; hardware-WebGL browser rendering remains unverified.** Keep those evidence limits separate when reporting a release.

## Runtime and access

The site has no application server, account system or runtime CDN dependency. Three.js and its supporting modules are included in `dist/vendor/`. WebGL renders the procedural scenes where available; a software SVG renderer uses the same scene and camera when WebGL initialization is unavailable. SVG fallback shading and performance can differ, particularly in larger views. Additional model scenes are constructed when first requested.

Explanatory text, search, component controls and source links complement the models. Labelled controls, keyboard focus styling, camera presets and reduced-motion handling support navigation. Without JavaScript, the main page retains an introductory overview and a link to the static reading directory. Reading links open the publisher's site; the atlas does not load those publications into its runtime.

## Architecture and maintenance

| Path | Responsibility |
|---|---|
| `dist/index.html`, `dist/style.css` | Application structure and responsive presentation |
| `dist/app.js` | Explorer, inspection, search, field guide, tours, URL/browser-history integration and local learning progress |
| `dist/navigation.js` | Navigation groups, view parents, route-state snapshots and technology-change descriptions |
| `dist/catalog.js` | Concepts, public-source records and architecture descriptions |
| `dist/atlas-config.js` | Combined nine-domain configuration, view descriptions and variants, preferred component routes, contexts and relationships |
| `dist/model.js` | Combined view registry, conceptual-to-physical model anchors, defaults and pure experiment/state helpers |
| `dist/network-data.js` | Whole-railway concepts, overlays, domain and explicit drilldown destinations |
| `dist/network-model.js` | Stable network composition and separate movement, power and information path geometry |
| `dist/depot-data.js` | Depot concepts, sources, grouped views, variants, routes and context updates |
| `dist/tours.js` | Guided-tour explanations, model actions, questions, feedback and supporting concepts |
| `dist/viewer.js` | Three.js/SVG rendering, shared geometry primitives, base scenes, lazy scene dispatch, selection, cameras and animation |
| `dist/track-models.js` | Track support, fastening, turnout, point-drive and crossing geometry |
| `dist/signalling-models.js` | CBTC, conventional signalling, ETCS, SelTrac, interlocking and detection geometry |
| `dist/station-models.js` | Station, plant, ventilation, network and fire-system geometry |
| `dist/platform-models.js` | Trainway intrusion sensing, platform doors, interspace and end-gate models |
| `dist/operations-models.js` | Control centre and all eight depot/facility model views |
| `dist/technology.js` | Independent technology choices, routing and corresponding narratives |
| `dist/expansion-data.js` | Public-source concepts and bounded narratives for the expansion |
| `dist/reading.html` | Static copy of the complete public reading directory |
| `dist/assets/`, `dist/vendor/` | Original visual assets and vendored runtime with its licence |
| `scripts/check-site.mjs` | Static/content checks and entry point for the full repository suite |
| `scripts/check-models.mjs` | Actual scene construction, finite geometry, anchors, railway overlays and drilldowns |
| `scripts/check-technology.mjs` | Independent propulsion/control geometry and alternative-rendering regressions |
| `scripts/check-navigation.mjs` | URL/state handling and navigation recovery regressions |
| `scripts/check-depot.mjs` | Depot alternatives, physical mechanisms and geometry regressions |
| `scripts/generate-reading.mjs` | Builds the static reading directory from the combined catalog |
| `.github/workflows/pages.yml` | Node 24 checks and publication of `dist/` through GitHub Pages |

Regenerate the static reading directory with `npm run reading` after changing the catalog; the checks reject stale component text.

For a new concept, add its explanation and public evidence to the owning content module; assign it to a domain, a usable view/variant and any cross-system relationships through the combined configuration. Keep the source record and `reading.html` synchronized. If the concept is a function rather than a separately modelled object, give it an explicit equipment anchor in `model.js` and explain that relationship in the content.

For a new view, add its UI description and variants, then implement its geometry in the appropriate model module. Expanded modules export camera configurations and a `build…View(id, api)` function that constructs only the requested scene. Register selectable geometry with the existing concept IDs; use the shared cutaway, separation and per-scene animation helpers. Keep energy, mechanical motion, information and fluid paths distinguishable. Add the builder to the headless scene registry. Update navigation parents, preferred routes, alternate contexts and any tour actions together, then run the checks and inspect the affected journey and alternatives in an available browser. State which renderer was exercised.

Keep free exploration useful on its own. Add teaching activities only where they clarify a relationship. Preserve the boundary between public evidence, selected architecture examples and authored modelling assumptions; do not add unlabelled numerical specifications or imply that one supplier's example applies to every railway.

## Deployment

**GitHub Pages is the primary published destination:** [haitaowu12.github.io/railway-anatomy](https://haitaowu12.github.io/railway-anatomy/).

The included **Publish Railway Anatomy** workflow runs on pushes to `main` or a manual dispatch. It checks the site with Node 24, uploads `dist/` and deploys through the `github-pages` environment. The deployment job receives Pages-write and OIDC-token permissions. GitHub Pages must be configured to use GitHub Actions as its source. The public repository is [haitaowu12/railway-anatomy](https://github.com/haitaowu12/railway-anatomy).

The static `dist/` bundle can also be published to a separate host, including a GPT Site. Preserve relative asset paths and the vendor directory so it works at a domain root or repository subpath. **Separate hosts have separate deployments:** publishing this repository or updating GitHub Pages does not synchronize a previously published GPT Site. Verify the deployed revision and affected journeys on each host being claimed as current.

Before publication, run the checks. After publication, verify model loading, hierarchy and return navigation, representative alternatives, guided-tour feedback and reading links at the destination. A source commit or passing check alone is not evidence of deployment.

## Licence

Copyright 2026 Railway Anatomy contributors.

Original application code, schematic geometry and authored documentation are available under the [MIT License](LICENSE). Third-party software retains its own copyright and licence; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Linked publications remain subject to their publishers' terms.

