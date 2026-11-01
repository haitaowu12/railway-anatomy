# Frontend follow-up after 5.0.0

Status: source changes and rendered Chrome review complete; the release review tracks publication and the remaining native-picker keyboard evidence limit.

## Design scope

Retain the railway explorer's dark model stage, green interaction accent, left-hand hierarchy and contextual comparisons. The model carries the subject's detail; the surrounding interface should help visitors choose a view, inspect equipment and follow an interface.

The retained [OCC desktop capture](evidence-r2/occ-power-supervision.jpg) and [390px maintenance capture](evidence-r2/narrow-maintenance.jpg) establish the baseline. They support a focused refinement rather than a new visual identity:

| Location | Observed issue | Source change |
|---|---|---|
| Narrow view navigation | A clipped horizontal tab strip exposes only some of the eleven depot views. | A labelled native view picker lists all views and uses the existing navigation/history path. Desktop retains the sidebar view list. |
| Navigation and explanation | Instructions repeat across the sidebar, location area and model footer. | Remove the sidebar instruction, retain the introductory prompt for the network and tours, and remove the redundant “Selected arrangement” label. |
| Narrow model controls | Small labels and short button targets make dense controls harder to use. | Increase comparison and assembly targets, give camera controls a dedicated row, and remove the repeated selected-component name below the narrow selection summary. |
| Component explanation | Small body text sits inside a fully bordered inspector. | Increase body text to 15px and use a separating rule. |
| Field guide and reading directory | Repeated article borders and small source text compete with the reading hierarchy. | Use separators and spacing, constrain long text, and give the static directory a dedicated stylesheet with 16px reading text. |

No concepts, source claims, model geometry, quiz answers or stored progress keys changed. The generated reading directory was refreshed from its maintained generator.

## Verification and selected result

The focused refinement is retained: the matched 1200×900 captures show the native picker replacing clipped tabs while preserving the OCC model. The 390×844 view keeps readable controls and has no page-level horizontal overflow. The static reading directory is readable at desktop and narrow widths. See [the before capture](evidence-r3/occ-before-1200.png), [the after capture](evidence-r3/occ-after-1200.png) and [the narrow result](evidence-r3/occ-phone-390.png).

Node 24.18.1 checks pass. Browser review exercised model comparisons, six new guided questions, guide search, source links, phase/animation controls, reduced motion and picker/history state. Chrome used hardware-backed WebGL on the Apple M2 Pro Mac. The new infrastructure scene initially exposed a GPU-only clipping defect: a backdrop above the model's negative datum concealed earthwork and culvert geometry. Its per-view backdrop offset now keeps that geometry visible, and a production-viewer regression protects clearance and restoration when leaving the view.

Physical keyboard selection of the native picker remains unverified. The connector's key sequence also failed on a plain native select; option selection, URL updates and Back/Forward restoration passed. No browser or runtime repair was introduced for that automation limitation.

The continuation scope includes all six roadmap areas. The 5.1.0 source implements those studies, their public-source explanations, six guides and six questions. The [release review](release-5.1.0.md) records the coverage, final captures and verification.

## Browser-route continuity

The CUA bridge returned “Local browser use is disabled in Work settings” for both IAB and Chrome. That was not proof of a Codex-wide permission restriction. The native Codex Playwright connector connected to Chrome successfully without a settings change. Use that authorized connection for this task; do not ask the user to change Work settings based solely on the CUA error. Use fresh browser contexts when changing static modules during review: navigation alone retained stale module code in an earlier context.
