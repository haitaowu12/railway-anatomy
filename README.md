# Railway Anatomy

An interactive public educational guide to the components of a railway: track, power, vehicles, train control, communications and station systems. Original 3D cutaways connect visible equipment with explanations, architecture comparisons and optional guided learning.

The site contains **163 concepts, 110 public reading references, 32 model views and 26 guided tours across eight domains**. The complete application is a buildless static website in `dist/`.

[Open Railway Anatomy on the GPT Site](https://rail-systems-atlas.techiesea.chatgpt.site/).

## Explore the railway

| Domain | What to explore |
|---|---|
| Track & guideway | Ballasted, slab and direct-fixation support; rail fastenings; turnouts, point mechanisms, crossings and the LIM reaction rail |
| Power supply | Incoming AC, transformer and rectifier conversion, DC distribution, protection, current collection and braking-energy destinations |
| Vehicles & propulsion | LIM or rotary drives, carbody, bogies, inverter, braking, auxiliary power, HVAC, doors and compressed air |
| Train control | Protection, automatic operation, supervision, train detection, interlocking, movement authority and selected signalling architectures |
| Communications | Train–wayside radio, onboard networks, passenger information, audio, CCTV and station network connections |
| Stations & plant | Passenger spaces, trainway intrusion sensing and platform doors, electrical and mechanical plant, fire and life safety, ventilation, building automation and supervision |
| Control centre | Traffic supervision, signalling, power, station systems, operational radio and event recording |
| Depot & maintenance | Stabling, yard throat, inspection pits, roof access, lifting, bogie work, wheel lathe, wash plant, stores and work-zone protection |

The **32 views** move from a whole railway or station to a rail clip, point drive, linear motor, fan or damper. Visitors can select equipment, orbit and zoom, use camera presets, open enclosures, separate parts and compare arrangements. Components link to related concepts and other useful model scales. Search and the field guide provide direct access without requiring a learning sequence.

The **26 guided tours** use the same explorer, with an explanation, an action to try and an optional self-check with answer-specific feedback. Learning completion, choices and attempt counts are stored in the visitor's browser using `localStorage`. They are not uploaded or synchronized: another browser, device or hosting domain has separate progress. The interface includes a local progress reset.

The [reading directory](dist/reading.html) provides publisher links, descriptions and scope notes and remains readable without JavaScript.

## What the models represent

All geometry is an **original schematic teaching composition**, generated in code. Equipment positions, dimensions, shapes and groupings are illustrative. Overview scenes compress distances; mechanism views enlarge details. Views do not share a survey scale or describe an installed railway.

The vehicle example uses a train-mounted short-primary linear induction motor and a passive reaction rail. The chosen power arrangement separates outgoing and return DC conductors from the wheel-running rails and the reaction rail. It is one arrangement used to make their different functions visible.

Train-control views distinguish conventional signalling, selected radio CBTC arrangements, historical SelTrac loop communication, radio-based SelTrac examples, the supplier's published SelTrac G9 description, and ETCS Level 1 and Level 2 examples. These are alternatives with different responsibilities and interfaces. Functional boxes and dashed information paths do not prescribe the number of computers, actual cable routes or a universal architecture.

Station views distinguish **fire and life safety systems (FLSS)**, normal ventilation and smoke-management objectives, local plant controls, **building automation / building management systems (BAS/BMS)**, traction-power **supervisory control and data acquisition (SCADA)**, station supervision and operations-control workstations. A supervisory connection is not automatically a direct control or safety authority. The illustrations do not prescribe control priorities, emergency sequences or a universally shared network.

Animations explain relationships, not quantitative performance. They are not electrical, braking, aerodynamic, fire or hydraulic simulations, operating procedures, or evidence of code compliance. Motion-sensing arithmetic is explicitly synthetic. Public references support the explanations; supplier examples and dated product generations retain their stated scope.


## Select technologies independently

The initial fictional train uses **LIM propulsion and loop-based SelTrac control**. Propulsion and train control are independent selectors: both LIM and rotary drive can be compared with loop or radio control without one changing the other. Rotary selection changes the model to motors, straight couplings and axle gearboxes; LIM selection restores the primary and passive reaction rail. The separate inductive data loop, undercar pickup and interface cabinet follow the control choice. Operational voice and passenger communications retain their different roles.

The train-control selector also opens conventional fixed-block and ETCS Level 1/2 studies. These are named architecture studies; selecting ETCS does not change the DC metro supply to a mainline electrification system. Specialist views synchronize the control choice, while the standalone LIM close-up remains an explicit mechanism study. A selected combination is not a claim that a commercial configuration exists or has been commissioned. Choices persist in the URL and browser-local storage; explicit URL choices take precedence.

## Platform protection, control centre and depot

The platform view compares open-trainway intrusion sensing, platform screen doors, train–door interspace sensing and platform-end access. Detection reports, physical barriers, closing-edge obstruction and closed/locked feedback are different concepts. The models do not calculate stopping response or simulate independent detector-health and lock-failure states.

The control-centre view separates traffic supervision, signalling workstations, power control, station supervision, radio dispatch and event records. The depot adds stabling, the yard throat, inspection pits, roof access, lifting jacks, a separate bogie-drop vignette, underfloor wheel machining, wash equipment, water collection/reuse, stores, personnel protection and energy-control context. Screen indications, movement protection and verified energy isolation are distinct. These are equipment illustrations, not work procedures.

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

This runs `scripts/check-site.mjs`, including the headless model checks. The model checks can also run independently:

```bash
node scripts/check-models.mjs
```

Checks cover the static bundle, content and source references, navigation and tour targets, module syntax, model construction, component availability and finite geometry. They do not replace visual review in a browser or validate real railway safety logic. No package installation is needed for these checks or for running the site.

## Runtime and access

The site has no application server, account system or runtime CDN dependency. Three.js and its supporting modules are included in `dist/vendor/`. WebGL renders the procedural scenes where available; a software SVG renderer uses the same scene and camera when WebGL initialization is unavailable. SVG fallback shading and performance can differ, particularly in larger views. Additional model scenes are constructed when first requested.

Explanatory text, search, component controls and source links complement the models. Labelled controls, keyboard focus styling, camera presets and reduced-motion handling support navigation. Without JavaScript, the main page retains an introductory overview and a link to the static reading directory. Reading links open the publisher's site; the atlas does not load those publications into its runtime.

## Architecture and maintenance

| Path | Responsibility |
|---|---|
| `dist/index.html`, `dist/style.css` | Application structure and responsive presentation |
| `dist/app.js` | Explorer, search, field guide, tour interaction, navigation state and local learning progress |
| `dist/catalog.js` | Concepts, public-source records and architecture descriptions |
| `dist/atlas-config.js` | Six-domain navigation, expanded view descriptions and variants, preferred component routes, alternate contexts and related concepts |
| `dist/model.js` | Combined view registry, conceptual-to-physical model anchors, defaults and pure experiment/state helpers |
| `dist/tours.js` | Guided-tour explanations, model actions, questions, feedback and supporting concepts |
| `dist/viewer.js` | Three.js/SVG rendering, shared geometry primitives, base scenes, lazy scene dispatch, selection, cameras and animation |
| `dist/track-models.js` | Track support, fastening, turnout, point-drive and crossing geometry |
| `dist/signalling-models.js` | CBTC, conventional signalling, ETCS, SelTrac, interlocking and detection geometry |
| `dist/station-models.js` | Station, plant, ventilation, network and fire-system geometry |
| `dist/platform-models.js` | Trainway intrusion sensing, platform doors, interspace and end-gate models |
| `dist/operations-models.js` | Control centre, depot, maintenance, washing and work-zone models |
| `dist/technology.js` | Independent technology choices, routing and corresponding narratives |
| `dist/expansion-data.js` | Public-source concepts and bounded narratives for the expansion |
| `dist/reading.html` | Static copy of the complete public reading directory |
| `dist/assets/`, `dist/vendor/` | Original visual assets and vendored runtime with its licence |
| `scripts/check-site.mjs`, `scripts/check-models.mjs` | Static/content checks and headless geometry/navigation checks |
| `.github/workflows/pages.yml` | Node 24 checks and publication of `dist/` through GitHub Pages |

Regenerate the static reading directory with `npm run reading` after changing the catalog; the checks reject stale component text.

For a new concept, add its explanation and public evidence to `catalog.js`; assign it to a domain and a usable view/variant in `atlas-config.js`. Keep the source record and `reading.html` synchronized. If the concept is a function rather than a separately modelled object, give it an explicit equipment anchor in `model.js` and explain that relationship in the content.

For a new view, add its UI description and variants, then implement its geometry in the appropriate model module. Expanded modules export camera configurations and a `build…View(id, api)` function that constructs only the requested scene. Register selectable geometry with the existing concept IDs; use the shared cutaway, separation and per-scene animation helpers. Keep energy, mechanical motion, information and fluid paths distinguishable. Update preferred routes, alternate contexts and any tour actions together, then run the checks and review framing, selection and each variant in both renderers.

Keep free exploration useful on its own. Add teaching activities only where they clarify a relationship. Preserve the boundary between public evidence, selected architecture examples and authored modelling assumptions; do not add unlabelled numerical specifications or imply that one supplier's example applies to every railway.

## Deploy the same bundle to two hosts

The same `dist/` directory supplies the GPT Site and GitHub Pages; no host-specific content fork or build is required. Preserve relative asset paths and the vendor directory so the bundle works at a domain root or repository subpath.

For a GPT Site, publish `dist/` as the static site root. For GitHub Pages, first create or select a GitHub repository and push this project to `main`. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The included **Publish Railway Anatomy** workflow runs on pushes to `main` or a manual workflow dispatch. It checks the site with Node 24, uploads `dist/` and deploys through the `github-pages` environment; only the deployment job receives Pages-write and OIDC-token permissions. The public repository is [haitaowu12/railway-anatomy](https://github.com/haitaowu12/railway-anatomy). Its Pages workflow publishes the same static bundle as the GPT Site.

Before publication, run the checks. After publication, verify model loading, component navigation, representative variants, guided-tour feedback and reading links on each host.

## Licence

Copyright 2026 Railway Anatomy contributors.

Original application code, schematic geometry and authored documentation are available under the [MIT License](LICENSE). Third-party software retains its own copyright and licence; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Linked publications remain subject to their publishers' terms.
