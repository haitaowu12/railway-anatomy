# Control responsibilities and optional railway interfaces

## What the correction addresses

The previous `SCADA / BAS / networks` destination grouped three different ideas under one navigation label. Although the text included caveats, the visual structure still encouraged a single combined controller interpretation. A generic SCADA I/O lesson also used a component identified as a tunnel damper together with a building-services sensor. That made an elementary request/feedback demonstration look like a tunnel ventilation control architecture.

The corrected Interfaces destination is a two-dimensional functional explanation. It separates physical equipment, local control and acquisition, communications transport, native supervisory applications and an optional common station display. An operator-visible point, a transmitted request, local acceptance, a physical result and returned evidence are distinct observations.

The original equipment scenes remain useful for cabinets, mechanisms and physical connections. A server, desk or coloured 3D marker is not used as the primary explanation of a command lifecycle or a system-allocation decision.

## Coverage and review disposition

| Area reviewed | Finding | Correction / retained boundary |
|---|---|---|
| Traction power SCADA | Supervision needed to be distinguished from protection and local switchgear control. | Dedicated allocation, example point contract, request/feedback trace and independent electrical responsibilities. |
| Building automation | Shared label implied that BAS and station SCADA were one function. | Own domain, local building loops, optional status or permitted supervisory integration. |
| Tunnel ventilation | Generic SCADA damper imagery could imply a complete TVCS. | Dedicated TVCS concept and domain; system coordination, plant control and wider interfaces are separated. |
| Station smoke extraction / pressurisation | Scope could be lost inside “ventilation.” | Separate function and fire/motor/control boundaries; no invented emergency priority or smoke mode. |
| Fire detection and alarm | Shared supervision could imply common acknowledgement resets local equipment. | Monitoring-only example; fire-system actions and common-display acknowledgement remain distinct. |
| Drainage | Monitoring could be mistaken for the pump's level-control loop. | Local pump-control domain, optional BAS/SCADA integration, level and outfall evidence distinguished. |
| Lifts / escalators | A generic network interface could imply arbitrary remote control. | Status-only and explicitly authorized service-switching examples contrasted; equipment safety and motion remain separate. |
| Platform doors | Common status could be confused with signalling door proof. | Monitoring-only common integration; native door/train interface and its evidence remain separate. |
| Signalling / ATS / ATP | Common HMI or transport could imply shared movement authority. | No generic station SCADA route/point/movement-authority output; native signalling requests retained. |
| PIS / PA / help points | Application acceptance could be confused with delivered/audible information. | Distinct content/audio/call services, selected requests, delivery evidence and physical audio-output boundary. |
| Operational radio | Voice content and radio equipment diagnostics have different meanings. | Independent voice/dispatch domain; station summary has no voice-command or movement-authority function. |
| CCTV / access security | Network availability could be equated to recording or door security. | Separate native applications and observations; common example carries status, not video media or access authority. |
| Network management | A link-up indication could be used as proof of an application or field action. | Transport and NMS domain, with plant application and network-health evidence separated. |
| Auxiliary electrical / UPS | Supply, protection, distribution and status reporting could collapse into one “available” symbol. | Optional reporting owner with independent local supply/protection duties and bounded UPS interpretation. |
| OCC station application | Existing fan indication was appropriately observational but the scope was too implicit. | Text now points to explicit subsystem owners and optional allocations. |
| Legacy communications I/O | Tunnel-damper identity was inappropriate for a generic I/O teaching example. | Building actuator identity and an explicit local-control node between request output and plant. |
| Platform mechanics and lift motion | Existing animations describe physical relationships, not a universal controller design. | Retained with the Interfaces distinction; this correction does not change their mechanical timing into an operational rule. |

## Three teaching patterns

1. **Separate supervision:** each function retains its native operator/maintenance interface; no common station integration is included.
2. **Shared status summaries:** selected points and alarms are passed to a common station display. This creates no generic command output.
3. **Selected supervisory requests:** explicitly listed functions can receive permitted service-level requests through the common interface. The local function still evaluates the request and returns independent evidence.

Each function can be changed individually to **not connected**, **monitoring only**, or, where the teaching contract permits it, **selected requests plus monitoring**. Switching the overall pattern resets these individual overrides. This is intentional: an architectural comparison must not silently retain hidden exceptions from a different pattern.

An absent optional integration is a valid alternative in the teaching model. This does not authorize omission of a required duty or interface in an actual railway. The cross-system section states that distinction explicitly for fire, ventilation, PSD/signalling and other engineered functions.

## Four information conditions

The explorer offers available interfaces, a lost supervisory link, local control selected, and missing feedback. These produce different conclusions:

- A lost path prevents the application from establishing fresh information or request delivery through that path.
- In the selected local-mode case, remote requests are rejected while status communication can continue.
- A missing feedback point can leave a request outcome unconfirmed even when transport and application acceptance are available.
- An absent integration remains absent in all conditions. A degraded scenario cannot create a command capability that the interface never had.

The five-step trace supports direct step selection and optional playback. It changes highlighted functional actors and explanatory state; it does not animate a physical actuator and imply that a requested action succeeded. Reduced-motion users use the numbered steps; the automatic trace is disabled for that preference.

## Point and interface contract

The expanded contract identifies the originating function, recipient, direction, example point, meaning, unit/state vocabulary, quality and time basis, request authority, returned evidence and transport boundary. No update rate, equipment count, protocol setting or safety classification is invented.

A command interface is not inferred from a monitoring interface. In particular, the common-display examples do not offer fire-panel reset, platform-door opening, signalling route setting, access unlocking or network configuration. Native applications still retain their separately described functions. This is a declared teaching allocation, not a claim that integrated products can never provide additional approved capabilities.

## Public evidence and limits

The catalog adds source IDs `CI01`–`CI13`; existing sources such as `CM01`, `F03`, `F15` and the communications hardware documents remain linked alongside them.

| Public example | What it establishes here | What is not inferred |
|---|---|---|
| [Crossrail HVAC control narratives](https://learninglegacy.crossrail.co.uk/documents/control-narratives-heating-ventilation-air-conditioning-system-stations-shafts-portals/) | Its BMS scope separates building services from life-safety ventilation; selected building alarms can reach wider supervision. | A universal allocation, present-day configuration of every station, or an operating sequence. |
| [Crossrail VCS supplier account](https://applied.co.uk/products/wincc-oa-scada-for-infrastructure/) | A dedicated ventilation control function can interface with site-wide SCADA and signalling. | Source safety-integrity or availability claims as properties of the atlas. |
| [MTR ECS RTU replacement scope](https://www.mtr.com.hk/en/corporate/tenders/C4929-25E.html) | A railway can allocate both station and tunnel environmental equipment to a central ECS scope. | Completion of planned replacement works or an exact installed topology. |
| [Melbourne TVCS/BMS interim-design account](https://www.synertec.com.au/case-studies/melbourne-metro-tunnel-tvcs-bms/) | Project allocations and named interfaces differ. | The command direction or permission set of every listed interface, or final as-built scope. |
| [Crossrail mechanical-control account](https://learninglegacy.crossrail.co.uk/documents/enhance-service-reliability-safety-critical-mechanical-installations/) | Incoming commands, logic/interlocking, motor control and feedback are distinct engineering responsibilities. | A universal emergency/manual priority matrix. |
| [Crossrail integrated testing account](https://learninglegacy.crossrail.co.uk/documents/integration-tests-crossrail-station-services/) | Interface evidence must include interactions across systems, not isolated equipment alone. | A commissioning or acceptance result from this teaching application. |
| [Siemens Elizabeth line reference](https://www.mobility.siemens.com/uk/en/portfolio/references/elizabethline.html) | A specific train/wayside/PSD-controller coordination example exists. | A universal PSD release mechanism. |
| [Schindler status API](https://developer.schindler.com/apis/onSite/bacnet/introduction) and [Lobby Vision](https://www.jardineschindler.com/en/services/digital/lobby-vision.html) | Status-only interfaces and optional authorized service-switching functions both exist. | Remote motor access or bypass of equipment safety controls. |
| [Grundfos level controllers](https://api.grundfos.com/literature/Grundfosliterature-6206157.pdf) | Local level control and optional SCADA integration are separable. | Railway drainage capacity, pump selection or an approved operating mode. |
| [Westermo management documentation](https://docs.westermo.com/weos/5/General/Management-Overview/) | Monitoring support and general management writes are separate product capabilities. | Network segmentation, addresses or a railway cyber design. |
| [European Commission ERTMS constituents](https://transport.ec.europa.eu/transport-modes/rail/ertms/what-ertms-and-how-does-it-work/subsystems-and-constituents-ertms_en) | Control-centre, interlocking and train-protection responsibilities are distinct. | Replacing a CBTC architecture with an ERTMS implementation. |

The diagrams, point definitions, connection patterns and scenario outcomes are original fictional teaching arrangements. The sources support the distinctions and examples of variation. None is presented as an operator's confidential architecture or complete installed railway.

## Implementation and verification

- `dist/control-interfaces-data.js` holds the domains, examples, connection capability rules, context mapping and deterministic scenario evaluation.
- `dist/control-interfaces-ui.js` renders an accessible HTML/SVG explorer and owns its event listeners and trace timer. `destroy()` stops playback and removes listeners when the view is left.
- `dist/control-interfaces.css` provides responsive controls, readable diagrams, horizontally scrollable tables, visible keyboard focus and reduced-motion handling.
- `scripts/check-control-interfaces.mjs` checks catalog/source integrity, optional connection capability, command restrictions, distinct degraded outcomes, all domain/pattern/scenario combinations, contextual routing and the repaired legacy local-control boundary.

Browser review of the integrated destination is recorded with the overall release evidence. These data and DOM-string checks do not establish real railway correctness, GPU rendering quality or a full accessibility audit.


## Independent diagram review

The new system diagrams were checked independently against their selectable concept IDs, variants, sources and the meaning of their directed relationships. The review corrected:

- Supply-collector and overhead-contact-wire references that did not resolve to actual catalog concepts, and the omitted return collector in the fourth-rail example.
- A universal-looking TCMS route for both driving and protection. The corrected diagram identifies defined traction/brake interfaces and an independent protection intervention relationship. The [ERTMS Users Group operational principles hosted by ERA](https://www.era.europa.eu/sites/default/files/2024-12/index64_12e108_2_ato_operational_principles.pdf) and the existing Commission constituents source provide bounded examples; the graph does not prescribe the same interface for CBTC.
- An implied bridge between train-control radio and the onboard service network. The generic diagram now shows no undeclared bridge.
- A combined “new request” conclusion that ignored the power service's missing path A while the station retained path B. Requests and fresh source data are now evaluated separately for each application.
- An available recorder being mistaken for complete/current information from an unavailable source. Recorder availability, fresh source paths and earlier record gaps remain distinct.
- An OCC fallback graph that omitted the separate recording branch. The corrected selected-host graph preserves recording during task-picture loss and makes host B a preselected alternative, not automatic failover.
- Case comparisons that changed only explanatory prose. The dependency and accessible-journey diagrams now carry explicit node/edge states. Unavailable relationships are dashed and marked with a cross; unestablished alternatives use a question mark. The same state text is available in compact and connection-list presentations.

Eight focused checks in `scripts/check-system-diagrams.mjs` cover every diagram variant and supply profile, source/endpoint integrity, the independent protection interface, per-service request and recording consequences, lift versus boarding interruption, and text/symbol state rendering. These checks do not replace the release's browser visual review.
