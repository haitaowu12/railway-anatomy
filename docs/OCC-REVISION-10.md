# OCC applications, communications SCADA and physical context — revision 10

## What the earlier implementation got wrong

The earlier OCC experience mixed three different subjects: installed workplace equipment, software applications and operational activities. Small selectable traffic/power/status graphics on monitor assemblies made software appear to be physical components. The monitor teardown and an abstract request trace also received more emphasis than the equipment, point definitions and application boundaries a learner needed to understand.

The control-interface catalogue had no dedicated telecom SCADA responsibility. Generic acquisition equipment and unmatched contexts could fall back to traction power. The network-management explanation separated NMS and SCADA too categorically, even though public telecom SCADA examples acquire communications-device conditions directly or through native management systems. Some integration examples allowed only status sharing without making clear that this was the chosen example, rather than a universal restriction on communications controls.

Several physical OCC descriptions still promised receipt/rendering/history playback after that playback had been removed. The technical-equipment page also presented selected-host and display-availability comparisons whose green/red states could be mistaken for demonstrated redundancy or continuity. Opening another physical view could inherit inspection state, and returning from a functional page could fit the camera while its canvas was hidden.

## Replacement structure

There are now three linked surfaces:

1. **Control room, Console & workstation, Technical equipment:** installed physical assemblies and their connections. New contexts start assembled. Local client and remote client/KVM arrangements remain physical alternatives. Monitor graphics do not act as miniature railway systems. Technical equipment has one representative arrangement; a second host does not establish redundancy.
2. **OCC applications:** a readable inspector for an application, named asset and point. It distinguishes the observation source, device/controller or optional native manager, communications transport, supervisory application, presentation and retained evidence.
3. **People & processes:** responsibilities, coordination, handover and evidence workflows remain separate from physical anatomy and application points.

The OCC inspector contains nine application scopes and twelve named fictional points. These are representative interface definitions, not a complete installed point list.

| Application scope | Named examples | Primary distinction |
| --- | --- | --- |
| Communications SCADA | PA amplifier PA-01; camera CAM-03; radio equipment RADIO-02 | Device health and configured equipment-maintenance requests are separate from the service payload. |
| Train supervision | Track section T1 occupation | An indication is not a command to change occupation; ATS, interlocking and protection have distinct duties. |
| Power SCADA | Feeder breaker B1 position | A request, position indication and proof of electrical isolation are different evidence. |
| Facilities & environment | Comfort fan AHU-01; tunnel fan TVF-01 | BAS owns its comfort-control sequence; TVCS owns its engineered ventilation-mode logic. |
| Passenger information & PA | PA zone PA-Z1 | Destination selection, delivered audio and amplifier condition differ. |
| Video management | Camera CAM-03 video-source availability | A selected view, device response, useful image and retained recording differ. |
| Radio & operational voice | Dispatch terminal RAD-01 | Native call handling, terminal registration, equipment condition and understood speech differ. |
| Access & intrusion | Equipment-room door D1 contact | A credential decision, release output and door-contact state differ. |
| Network management | Switch SW-01 uplink 1 | Link state is separate from the freshness or success of a transported application. |

### Telecom SCADA is explicitly a supervisory application

Its selector has three named alternatives:

- **No telecom SCADA link:** no point or request is exchanged with telecom SCADA. Native service diagnostics retain their own paths and availability dependencies.
- **Telecom SCADA monitoring:** Communications SCADA acquires the named diagnostic point and quality. This selected interface has no request output.
- **Telecom SCADA monitoring + named request:** the example includes one explicitly configured equipment request. Other controls are not implied.

Device/subsystem acquisition and acquisition through a native equipment manager or NMS are separate choices where supported by the example. The NMS is neither a mandatory hop nor a synonym for every telecom SCADA function. Communications SCADA and its operator presentation are named separately; a presentation may share an HMI with other applications.

For the other application scopes, the selector explicitly describes an **additional common-HMI integration** beyond the native application. Native radio call handling remains available as a native-service example, without inventing a common-HMI radio command mapping from a source that only establishes native voice functions.

### Requests and their limits

The examples name representative request scopes: configured telecom equipment reset/restart, configured radio-site backup-device selection, PA destination selection, camera-view selection, a configured access-service request, a breaker-opening request, normal-service enable for the comfort AHU, and selection of a predefined ventilation mode. These are interface examples, not executable controls or operating sequences.

The AHU example asks the BAS to make the plant available to its normal sequence; it does not energize a motor directly. The ventilation example selects a mode already defined by an engineered design; the diagram does not supply an emergency fan sequence. Telecom maintenance examples are possible configured capabilities, not claims that every named railway or every manufacturer supplies them.

Fresh observation, changed equipment condition, lost selected data path, refused request and missing outcome feedback have different visible conclusions. A stale value is not refreshed as normal. Request acceptance is not completion. An equipment-health indication is not proof of end-to-end service performance.

## Primary evidence and scope

All diagram layout, named assets, values and trace states are original teaching material. No operator layout, private point list, actual network addresses or proprietary HMI screens are reproduced.

| Source | Supported use | Limit carried into the product |
| --- | --- | --- |
| [Metrolinx LRT Design Criteria Manual, revision 01, 31 March 2016, C2.2.14](https://assets.metrolinx.com/image/upload/Documents/Engineering/LRT_Design_Criteria_Manual_DCM_LRT-001_REV01.pdf) | SCADA scope includes communications-equipment monitoring at stations/stops, maintenance facilities and OCC, alongside wider remote equipment and facility interfaces. | This is a published authority example of scope. Old hardware, timing and capacity prescriptions are not treated as universal current requirements. |
| [Racomm, Telecom SCADA](https://www.racomm.in/resource/Our-Offerings/Solutions/T-SCADA.aspx) | Telecom SCADA can acquire conditions, alarms and events from several communications subsystems directly or from native managers/NMS. | Its public list chiefly establishes diagnostics. It does not supply per-device deployed command permissions. |
| [Siemens Mobility, Digital station solutions and railway communication](https://www.mobility.siemens.com/global/en/portfolio/digital-solutions-software/infrastructure/digital-station-solutions-and-railway-communication.html) | Distinguishes Power SCADA, Facility SCADA and other services; describes common-HMI integration of SCADA, PIS/PA and CCTV monitoring/control. | A product capability, not a universal installed railway architecture or permission list. |
| [Zenitel, Public Address System for Scotland’s Railways, 2 September 2024](https://www.zenitel.com/news/scotlands-railway) | Native PA fault monitoring, logs, live/scheduled announcements and station/group destination selection. | Does not establish a separate SCADA command mapping at ScotRail. Such integration is explicitly optional in the teaching model. |
| [Davicom, LMR site management for telecom and public safety](https://davicom.com/telecom-public-safety/) | Telecom RTU diagnostic acquisition and possible reset, power-cycle, backup-device and network-element controls. | A telecom equipment capability example, not evidence of a named railway installation or universal availability on the illustrated devices. |
| [Los Angeles Metro, Public Transportation Agency Safety Plan, version 1.4, January 2025](https://libraryarchives.metro.net/dpgtl/planning/2025-01-lacmta-public-transportation-agency-safety-plan-version-1.4.pdf) | ROC responsibilities include train, power, communications and fire/life-safety functions, with a broad SCADA remit. | One operator’s published scope; not another railway’s point list or procedures. |
| [California High-Speed Rail Authority, TM 3.4.2 R0, Communications Systems Site Requirements, 2010](https://hsr.ca.gov/wp-content/uploads/docs/programs/eir_memos/Proj_Guidelines_TM3_4_2R00.pdf) | Physical OCC planning distinguishes communications, application, recording, network and support equipment. | A historical planning example; quantities, layouts and deployment prescriptions are not copied. |

Existing public Crossrail, MTR, Melbourne Metro, Network Rail, Axis and other references remain attached to their respective BAS/TVCS, native radio, camera and access-controller concepts. Their original scope limitations remain visible. Sources and scope can be expanded within the inspector instead of being hidden behind a generic site-wide bibliography.

## Routes and navigation

- Default application route: `#occ/telecom/pa-health`.
- Other examples: `#occ/facilities/tunnel-fan`, `#occ/video/video-view`.
- Optional state: `occIntegration`, `occAcquisition`, `occCondition`, `occTrace`, `occStep`.
- The OCC guided tour retains `#learn/operations-roles`, with its selected application and point stored as `occApp` and `occPoint` when needed.
- Existing `occ-supervision` routes and app-only concept links resolve to the inspector. Explicit incident/handover legacy routes still resolve to People & processes.
- Physical radio-terminal selection remains physical. The application inspector links to the actual equipment concept for each point.
- Control-interface cross-links are offered only where an exact named OCC example exists. An unrelated responsibility never silently opens a comfort-fan or traction example.
- The finder indexes application scopes, assets and points. The top navigation provides a direct OCC entry.
- The skip link targets the visible surface without changing the SPA route. Selectors have explicit accessible labels.
- New physical contexts clear stale inspection state. Default selection does not automatically create a large instance URL.
- Returning from functional/reference pages exposes the physical viewport before synchronization and performs a guarded fit after layout. The renderer also protects against zero-size camera fitting.

## Verification

The bounded semantic and interaction checks cover:

- All point/source/component relationships and nonphysical application routes.
- All twelve point examples across integration, condition and trace alternatives: 360 rendered semantic combinations.
- No inferred command for an indication-only point, including malformed external state.
- Telecom SCADA absent/monitor/control distinctions, optional native-manager acquisition, and named payload/diagnostic/request separation.
- Distinct stale, rejected and unconfirmed outcomes.
- Actual explorer event ownership, app/point selection, history intent and teardown.
- Production URL read/write, legacy route handling, guided-tour state and search destination integrity.
- Actual tour-surface mount/teardown and a single active self-check.
- Physical OCC assembled defaults and removal of obsolete playback metadata.
- Hardware dependency diagrams without invented service-availability annotations.
- Actual geometry contracts that require physical anchors for equipment and real application destinations for software concepts, rather than restoring fake glyph meshes to satisfy a test.

Browser review additionally checks visual hierarchy, responsive presentation, keyboard labels and focus, real navigation, link-loss/feedback conditions, and functional-to-physical viewport recovery. Automated semantic tests do not establish visual quality or an installed railway’s engineering correctness.
