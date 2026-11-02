# OCC and representation audit — revision 10

## Review basis

The requested task is to learn what an OCC contains, what its applications supervise, and how a specific field-device observation or request reaches its responsible system. The review began against published version 9, commit `ba3c3355f42ae1f5ed38f8a62103e7dd3eeb31a1`, after reloading the production page. Captures below are from this audit run at a 1348 × 926 viewport. The browser disables WebGL; physical scenes use the app's actual SVG geometry backend. They establish composition, geometry, labels and interaction behavior, not GPU material or shadow appearance.

## Observed baseline flow

| Step | User action and evidence | Observed behavior | Required correction |
|---|---|---|---|
| 1 | Open OCC & information → Control room. [Capture](audit-10/01-occ-room-before.jpg). | A small room sits low in a large viewing area. Screen graphics resemble tiny internal boards, but cannot explain which application, device or condition is represented. The main learning question asks about information while the visible scene offers furniture. | Frame the physical room around its equipment and connected workstations. Offer a separate, discoverable application-and-device view for supervisory meaning. |
| 2 | Choose Console anatomy. [Capture](audit-10/02-console-before.jpg). | The console opens with Section selected even though this audit did not request sectioning. The assembly panel includes raw names such as “occ console” and “occ workplace environment”. The narrative still refers to playback that the static physical view does not provide. | New physical contexts start assembled; requested inspection is explicit. Give assemblies human-readable labels, describe the actual controls, and keep circuit-board details subordinate to installed hardware. |
| 3 | Choose Information behaviour. [Complete capture](audit-10/03-information-before.jpg). | Traffic, Power and Station are the only application choices. The scene starts with an unspecified request and a separately returned traffic observation. A “Task display” explanation remains selected under the functional diagram. The long path mixes transport, hosting, application and field boundaries without a named point to anchor them. | Choose an application and a named device point. Distinguish the service payload, condition monitoring, command authority and returned evidence. Include telecommunications SCADA and native network management, with optional integration. |

The browser harness did not resolve the visible “Jump to a view” label through its exact label lookup; selecting the observed `view-choice` element worked. The DOM already contained an associated label. An explicit `aria-label` was added alongside it, and the revised selector was exercised through its accessible name. The keyboard focus outline on the destination heading was visible. No full accessibility-conformance claim is made. The room baseline was recaptured from the still-published version 9 before release, after returning from Information behaviour; its retained display selection is visible in the capture.

## Acceptance criteria

1. Physical room, console and technical equipment views contain physical hardware with readable assembly labels and explicit inspection. Software applications are not represented as small physical objects inside a screen.
2. An OCC application can be opened from navigation, search and relevant legacy routes. Application choice, point choice and information conditions survive a copied link.
3. Telecommunications SCADA is a distinct documented function. Its scope can include communications-device conditions and selected remote controls. A native NMS, application stream, field control interface and integrated presentation are not interchangeable.
4. A named example distinguishes observed value and quality, communications reachability, command transmission, acceptance and returned outcome. Losing one path does not invent an outcome on another.
5. Optional common integration can be absent while the native service still exists. A broad teaching pattern is not presented as an installed operator design.
6. The physical and functional views link to each other and return to the selected context. People, work allocation and operating processes remain in their dedicated workspace.

## Final browser acceptance

The revised build was exercised in the same desktop browser using its actual SVG geometry backend. These results describe observed journeys, rather than asserting that every device or renderer has been visually tested.

| Journey | Observed result | Evidence |
|---|---|---|
| Open Control room | The occupied room is framed around its hardware. Displays are neutral physical surfaces; hidden monitor electronics do not paint over their fronts. | [Room after](audit-10/04-occ-room-after.png) |
| Open Console & workstation | The new physical context starts assembled. Human-readable assembly labels, monitor mounts, cable routes, under-desk computer and power distribution belong to the installed workplace. | [Console after](audit-10/05-console-after.png) |
| Open OCC applications | Nine application scopes lead to named, fictional device points. Communications SCADA is directly discoverable and distinct from power supervision. | [Application overview](audit-10/06-occ-applications-after.png) |
| Remove the telecom SCADA link | The common supervisory point and request disappear. The native PA service remains a separate responsibility; the example does not invent a native-service outage. | Exercised with the actual interface selector. |
| Enable a named telecom request through the native manager / NMS, then remove outcome feedback | The point reports unavailable feedback and the request outcome remains unconfirmed. The returned-evidence stage explicitly distinguishes acceptance from completion. | [Request evidence](audit-10/07-request-evidence-after.png) |
| Select tunnel ventilation and Request not permitted | The requested engineered mode is rejected while the separately observed availability point can remain fresh. BAS and TVCS retain different responsible controllers and request scopes. | Exercised with the facilities device and condition selectors. |
| Lose a selected video-data path | The selected observation becomes stale; this does not establish camera failure or loss of every video payload path. | Exercised in the video application. |
| Return from application / information views to physical equipment | The physical scene becomes visible and frames after the explorer is shown; no manual Reset is required to recover a blank viewport. | Reproduced before the fix and retested after it. |

## Verification and source scope

The complete `npm run check` gate passes **37 outer checks with zero failures**, including all existing geometry, mechanics, navigation, content and learning suites. The application suite includes nine checks covering 360 configuration combinations and the actual UI handlers. Twelve OCC physical-model checks and ten control-interface checks also pass. The catalogue contains 330 concepts and 226 public source records, with 15 control responsibilities, 32 guided tours and 60 views.

The full gate now runs its geometry and behavior suites in isolated child processes. The previous single-process import chain retained large scenes and exhausted the default Node heap; the change preserves every suite and assertion without increasing the heap limit or removing a release check.

The research and scope qualifications are recorded in [OCC-REVISION-10.md](OCC-REVISION-10.md). Named points are illustrative, not a recovered operator point list. Source examples demonstrate possible integration patterns; they do not imply that every railway exposes the same remote controls or uses one common application. Public release identity is verified separately through the generated `release.json` on both hosts. Hardware WebGL appearance, GPU performance and unavailable device classes are outside this browser acceptance evidence.
