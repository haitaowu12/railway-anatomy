# Preserve inspection framing during synchronization

Base: Railway Anatomy 5.1.0, main `a1c20b930a9ffc82c401ed58d6bda2052add08da`.
Finding: [PR #2 camera-state regression](https://github.com/haitaowu12/railway-anatomy/pull/2#discussion_r4433755087).

`syncViewer()` calls `setExplodeScope()` during ordinary selection and operating-scenario renders. The setter previously fitted the camera every time, even when its effective scope remained `all` and separation was zero. It now compares the normalized, available scope with the current scope and fits only when that value changes. Animation and render requests still run. Explicit framing, separation-amount changes, structural changes, presets and reset keep their existing paths.

## Verification

- The new production-synchronization regression failed on the original viewer: selecting the already-selected bogie reset the custom camera position, panned target and distance limits. It passes with the fix.
- The existing actual-geometry harness now checks 25 selection/scenario combinations, unchanged selected scope with nonzero separation, whole-scene scope, unavailable selected scope, actual scope/geometry changes, reset, three presets, component frame/restore and scene navigation. It executes the shipping viewer and application synchronization code, with substituted DOM, renderer and orbit controls. It is deterministic camera/geometry evidence, not a browser or GPU test.
- Full `npm run check` passed under Node 24.18.1, including 13 site checks, 11 geometry checks, technology combinations, 260 route round trips, 40 vehicle configurations, 19 depot checks, 10 OCC checks, exploration, label checks and 12 studies. `git diff --check` passed. The static site has no separate build step.
- Desktop in-app-browser verification used the isolated checkout on localhost. Before the fix, zooming into the railway then selecting the train visibly snapped to a full-scene fit. After reloading the fix, zoom/orbit remained through repeated selection; six common projected label anchors changed by less than 0.001 CSS pixels after orbit damping. Bogie energy-condition changes retained zoom (maximum projected-anchor change below 0.000001 CSS pixels). In Communication paths, switching Messages flowing to Hold loop update retained all six common visible anchor coordinates exactly; recovery was also exercised.
- Browser checks also exercised selected/whole separation, changing its amount, Side/Top/Reset, Frame selection/Restore scene, navigation to Linear motor and browser Back to Bogie & sensors. No browser error/warning entries were reported during these checks.

## Limits and ownership

The browser displayed `Schematic · 3D` with a real canvas and no SVG in the viewer, so these checks used the WebGL path. Hardware acceleration/GPU identity was not verified. SVG fallback rendering and a narrow browser viewport were not rerun for this patch. Panned-target preservation is covered by the deterministic camera assertions; a browser pan gesture was not exercised. The browser screenshots and DOM checks are author verification; no independent review of this final patch is claimed.

The original release checkout was clean and left untouched. Its release task was idle, no other active rail-writing process was found, and no open repair PR existed when this work began. Work is isolated on `fix/preserve-camera-on-sync`. No release, deployment, settings, credentials or content changes are included.
