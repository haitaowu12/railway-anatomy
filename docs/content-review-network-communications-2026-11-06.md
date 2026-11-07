# Network, communications and control-interface review — 6–7 November 2026

## Coverage

All prose, source notes, concept relationships, view and variant descriptions, topology nodes and edges, animation captions, reading-guide sections and navigation mappings in the three modules below were read. Unchanged entries were retained after review. Equipment and control behavior were compared with the corresponding model and interface code.

| Module | Reviewed coverage |
|---|---|
| Whole railway | 11 concepts; 1 source; 1 view; 3 overlays; 10 destinations |
| Communications | 21 concepts; 8 updates; 12 sources; 5 views; 11 topologies; 6 animations with 32 captions; all 5 guide sections |
| Control interfaces | 7 concepts plus 3 catalog patches; 13 sources; 15 responsibility domains; 3 architectures; 4 scenarios; 13 cross-system interfaces; 6 project examples |

### Whole-railway entries

`network-overview`, `network-route`, `network-station`, `network-turnback`, `network-train`, `network-depot`, `network-maintenance`, `network-stabling`, `network-control-centre`, `network-substation`, `network-telecommunications`.

- `railway`: `movement`, `power`, `information`

### Communications entries

`communications-system`, `fiber-patch-panel`, `optical-transceiver`, `communications-router`, `onboard-ethernet-gateway`, `communications-power`, `scada-rtu`, `scada-input-module`, `scada-output-module`, `scada-gateway`, `scada-head-end`, `scada-information-quality`, `help-point-electronics`, `voice-call-server`, `operational-cab-radio`, `pis-controller`, `pa-controller`, `pa-amplifier`, `camera-imager`, `cctv-recording`, `access-door-interface`.

Updates: `network-switch`, `telecom-rack`, `station-scada`, `emergency-intercom`, `station-pa`, `station-pis`, `station-cctv`, `access-controller`.

- `communications-network`: `station`, `onboard`
- `communications-scada`: `status`, `command`, `stale`
- `communications-telephony`: `help-point`, `operational-radio`
- `communications-passenger`: `information`, `announcement`
- `communications-security`: `video`, `access`

### Control-interface entries

`control-responsibilities`, `tvcs-controller`, `station-smoke-controller`, `local-plant-controller`, `interface-contract`, `network-management`, `drainage-controller`.

Catalog patches: station-scada, bas-controller, scada-rtu.

Domains: `telecom`, `traction`, `building`, `tunnel`, `station-smoke`, `fire`, `drainage`, `vertical`, `platform`, `signalling`, `passenger`, `radio`, `security`, `network`, `auxiliary`.

Architectures: `separate`, `summaries`, `integrated`. Scenarios: `normal`, `link-loss`, `local-mode`, `feedback-missing`.

Cross-system interfaces: `telecom-native`, `telecom-network`, `telecom-radio`, `fire-bas`, `fire-smoke`, `tunnel-signalling`, `platform-signalling`, `service-pis`, `video-event`, `drainage-bas`, `vertical-bas`, `auxiliary-building`, `network-common`.

The indication and request traces were reviewed in every scenario through their shared branch definitions. The existing executable matrix checks every domain, architecture, scenario and trace combination.

### Source ledger

`NET01`, `CM01`, `CM02`, `CM03`, `CM04`, `CM05`, `CM06`, `CM07`, `CM08`, `CM09`, `CM10`, `CM11`, `CM12`, `CI01`, `CI02`, `CI03`, `CI04`, `CI05`, `CI06`, `CI07`, `CI08`, `CI09`, `CI10`, `CI11`, `CI12`, `CI13`.

## Corrections and editorial decisions

- The access-control example previously labelled its security application as facility SCADA. Its 3D screen, topology node and selectable context now use occ-access-supervision, so following the control-interface link selects security. A regression checks both the rendered model component and its functional owner.
- The stale SCADA topology now labels the reverse request path unavailable as well as the lost indication path. This matches the stated loss of the supervisory connection. A regression prevents a live-looking reverse request from returning to this scenario.
- Door contacts are described as closed-state indications, rather than motion sensors or measurements of the leaf’s full position. Request, lock output, physical door state and returned indication remain separate.
- Link-up indicates the adjacent network connection; application reachability, permission and information age remain separate. Pump-running status is distinguished from whether pumping keeps up with incoming water. Signalling and operating rules are both named in the overview’s movement explanation.
- SCADA, PLC, RTU, I/O, HMI, NMS and consist networks are explained at their first relevant use. Repeated generic model disclaimers were removed from sourced concept cards. Source notes now state what each reference supports and retain material date, project and product scope.
- All five communications guide sections were rewritten around endpoints, physical equipment, information paths and the evidence an operator receives. Existing IDs, routes and configuration behavior are preserved.

## Supporting references

The existing primary-source register is retained. Targeted verification used [Westermo’s train-network inauguration explanation](https://www.westermo.com/se/industries/rail/applications/tcms/automatic-network-inauguration), [Zenitel’s SIP intercom documentation](https://wiki.zenitel.com/wiki/SIP_Intercom_-_Web_Interface) and [Axis A1210 interface documentation](https://help.axis.com/en-us/axis-a1210). These support the consist/backbone, call/audio and reader/relay/contact distinctions. The review does not imply that every external page was independently available or newly fetched.

## Validation

The communications suite exercises actual scene construction, selectable contexts, internal part separation, animation order and finite geometry. The control-interface suite exercises optional capabilities, degraded cases, context ownership and all trace combinations. Combined release results are recorded in [the integration review](content-review-integration-2026-11-06.md).
