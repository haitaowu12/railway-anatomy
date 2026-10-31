/*
 * Original public educational signalling geometry. These are functional
 * illustrations, not supplier cabinets, route plans, operating procedures,
 * certified braking models or radio installations. Variant names select
 * architectures; animation time has no relationship to real safety timers.
 */
export const SIGNALLING_VIEWS = {
  'cbtc-network': { camera: [18, 18, 23], target: [0, 1.3, .7], distance: 48 },
  signalling: { camera: [18, 17, 24], target: [0, 1.1, 0], distance: 48 },
  etcs: { camera: [15, 14, 21], target: [0, 1.2, .7], distance: 42 },
  seltrac: { camera: [17, 15, 22], target: [0, 1.25, .7], distance: 44 },
  interlocking: { camera: [12, 11, 16], target: [.4, .6, .8], distance: 32 },
  'train-detection': { camera: [10.5, 9, 13.5], target: [0, .8, .7], distance: 28 },
};

export function buildSignallingView(id, api) {
  if (!Object.hasOwn(SIGNALLING_VIEWS, id)) return null;
  const { THREE, C, M, mat, startModel, group, part, mesh, box, cylinder, torus,
    tube, roundedPanel, explode, shell, foot, makeTrack, makeTrain, registerAnimator } = api;
  const root = startModel(id);
  root.userData.illustration = 'Original generic geometry; logical connections and proportions are explanatory.';
  const tint = { report: 0x8dbde7, permit: C.signal, request: C.service,
    alert: C.warning, off: 0x344751, red: 0xf28075, green: 0x92dbc0 };
  const basic = color => new THREE.MeshBasicMaterial({ color });
  const animations = [];
  const onFrame = fn => animations.push(fn);
  const phase = s => Number(s.phase) || 0;
  const variant = (s, values) => values.includes(s.variant) ? s.variant : values[0];
  const signals = s => s.signals !== false;
  const radioLost = s => s.scenario === 'radio-loss';
  const v3 = p => new THREE.Vector3(...p);

  function bolts(parent, positions, radius = .027) {
    for (const p of positions) cylinder(parent, radius, .025, M.steel, p, null, 6);
  }
  function plate(parent, size, position, material = M.edge) {
    box(parent, size, material, position);
    const [w, h, d] = size;
    bolts(parent, [-1, 1].flatMap(x => [-1, 1].map(z => [position[0] + x * (w / 2 - .08), position[1] + h / 2 + .01, position[2] + z * (d / 2 - .08)])));
  }
  function lamp(parent, position, color = tint.green, radius = .05) {
    const material = basic(color);
    cylinder(parent, radius * 1.35, .04, M.core, position, [Math.PI / 2, 0, 0], 10);
    const led = cylinder(parent, radius, .048, material, [position[0], position[1], position[2] + .015], [Math.PI / 2, 0, 0], 10);
    return { led, set(color) { material.color.setHex(color); } };
  }
  function arrow(parent, start, end, color, radius = .025) {
    const a = v3(start), b = v3(end), d = b.clone().sub(a), length = d.length();
    const g = group(parent, 'explanatory-direction-arrow');
    const shaft = mesh(g, new THREE.CylinderGeometry(radius, radius, Math.max(.02, length - .15), 6), basic(color), a.clone().addScaledVector(d, .45).toArray());
    shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    const head = mesh(g, new THREE.ConeGeometry(radius * 3, .17, 8), basic(color), b.clone().addScaledVector(d.clone().normalize(), -.065).toArray());
    head.quaternion.copy(shaft.quaternion);
    return g;
  }
  // Connections are attached to a named semantic group so they are pickable,
  // while the physical component's selection bounds stay around its hardware.
  function connection(parent, component, points, { color = tint.permit, enabled = () => true, held = () => false, direction = 1, speed = .18, radius = .018, count = 3 } = {}) {
    const g = group(parent, `${component}-information-path`);
    g.userData.component = component;
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .56 });
    const { m: line, curve } = tube(g, points, radius, material, { segments: 22 });
    line.castShadow = false;
    const beads = Array.from({ length: count }, () => mesh(g, new THREE.SphereGeometry(radius * 2.8, 7, 5), basic(color)));
    const cue = arrow(g, curve.getPoint(.48).toArray(), curve.getPoint(.58).toArray(), color, radius * .8);
    onFrame(s => {
      g.visible = signals(s) && enabled(s);
      const stale = held(s);
      material.color.setHex(stale ? tint.alert : color);
      material.opacity = stale ? .4 : .56;
      cue.visible = !stale;
      beads.forEach((bead, i) => {
        bead.visible = !stale;
        let t = (phase(s) * speed + i / count) % 1;
        if (direction < 0) t = 1 - t;
        bead.position.copy(curve.getPointAt(t));
      });
    });
    return g;
  }
  function board(parent, component, position, width = .8, depth = .55) {
    const g = part(parent, component, position);
    box(g, [width, .045, depth], mat(0x386e66), [0, 0, 0]);
    for (const [x, z, w] of [[-.2, -.1, .22], [.16, .08, .18], [.25, -.14, .12]]) {
      box(g, [w, .065, .13], M.dark, [x * width, .055, z]);
      for (const side of [-1, 1]) for (let k = 0; k < 3; k++) box(g, [.015, .02, .025], M.steel, [x * width - w * .35 + k * w * .35, .04, z + side * .08]);
    }
    for (let i = 0; i < 4; i++) cylinder(g, .025, .1, M.aluminum, [-width * .35 + i * width * .23, .075, depth * .32], null, 8);
    box(g, [width * .7, .07, .045], M.copper, [0, .045, -depth * .48]);
    return g;
  }
  function rack(parent, component, at, moduleIds = [component, component, component], size = [1.35, 2.45, .9]) {
    const p = part(parent, component, at), [w, h, d] = size;
    plate(p, [w + .12, .12, d + .12], [0, .06, 0]);
    for (const x of [-w / 2, w / 2]) box(p, [.065, h, d], M.steel, [x, h / 2, 0]);
    box(p, [w, .065, d], M.aluminum, [0, h, 0]);
    box(p, [w, h, .05], M.core, [0, h / 2, -d / 2]);
    const enclosure = group(p, 'removable-control-rack-skin');
    box(enclosure, [w - .1, h - .12, .045], M.white, [0, h / 2, d / 2 + .05]);
    box(enclosure, [.035, .25, .035], M.dark, [w * .37, h * .5, d / 2 + .08]);
    roundedPanel(enclosure, w * .56, .23, .03, M.dark, [0, h * .79, d / 2 + .08], .025);
    for (let i = 0; i < 4; i++) box(enclosure, [w * .55, .014, .015], M.core, [0, .2 + i * .06, d / 2 + .08]);
    shell(enclosure); explode(enclosure, [.12, .1, .9]);
    const indicators = [];
    moduleIds.forEach((moduleId, i) => {
      const y = .3 + (h - .65) * (i + .45) / moduleIds.length;
      const module = part(p, moduleId, [0, y, .015]);
      box(module, [w * .86, .055, d * .82], M.aluminum, [0, -.12, 0]);
      board(module, moduleId, [0, -.07, 0], w * .76, d * .68);
      box(module, [w * .88, .25, .045], moduleId === 'ato' ? M.service : M.signal, [0, 0, d * .43]);
      box(module, [w * .33, .13, .02], M.dark, [-w * .16, .01, d * .46]);
      for (let k = 0; k < 3; k++) box(module, [.05, .045, .025], M.steel, [-w * .23 + k * .1, .01, d * .49]);
      indicators.push(lamp(module, [w * .32, 0, d * .48], tint.green, .025));
      explode(module, [0, i * .06, .22 + i * .12]);
    });
    // Cable management is illustrative; no port or redundancy counts are claims.
    for (const x of [-w * .38, w * .38]) tube(p, [[x, .2, -.18], [x, h * .6, -.18], [x * .7, h * .86, -.16]], .025, M.dark, { segments: 10 });
    return { node: p, indicators };
  }
  function screen(parent, component, at, size = [1.35, .75]) {
    const p = part(parent, component, at), [w, h] = size;
    roundedPanel(p, w, h, .11, M.dark, [0, 0, 0], .045);
    box(p, [w - .13, h - .12, .025], M.glass, [0, 0, .067]);
    for (let row = 0; row < 3; row++) {
      box(p, [w * .69, .017, .012], M.signal, [0, h * .25 - row * h * .24, .087]);
      for (let j = 0; j < 3; j++) box(p, [.07, .05, .018], j === row ? M.service : M.steel, [-w * .24 + j * w * .23, h * .25 - row * h * .24, .098]);
    }
    return p;
  }
  function desk(parent, component, at) {
    const p = part(parent, component, at);
    box(p, [2.55, .12, 1.08], M.edge, [0, .85, 0]);
    for (const x of [-1.05, 1.05]) box(p, [.09, .8, .65], M.steel, [x, .4, 0]);
    for (const x of [-.65, .65]) {
      box(p, [.08, .28, .09], M.steel, [x, 1.03, -.17]);
      screen(p, component, [x, 1.42, -.17], [1.18, .68]);
    }
    const keyboard = group(p, 'illustrative-keyboard');
    box(keyboard, [.8, .045, .26], M.dark, [0, .95, .22]);
    for (let j = 0; j < 3; j++) box(keyboard, [.68, .014, .025], M.steel, [0, .985, .145 + j * .06]);
    return p;
  }
  function antenna(parent, at, component = 'radio-antenna') {
    const p = part(parent, component, at);
    roundedPanel(p, .7, .08, .45, M.white, [0, 0, 0], .04);
    for (const x of [-.23, .23]) {
      cylinder(p, .06, .08, M.core, [x, .07, 0], null, 8);
      cylinder(p, .026, .28, M.dark, [x, .24, 0], null, 8);
    }
    bolts(p, [[-.27, .055, -.12], [.27, .055, -.12], [-.27, .055, .12], [.27, .055, .12]]);
    return p;
  }
  function mast(parent, at) {
    const p = part(parent, 'wayside-radio', at);
    plate(p, [.8, .14, .8], [0, .07, 0]);
    cylinder(p, .065, 3.75, M.steel, [0, 1.97, 0], null, 12);
    for (const y of [2.8, 3.45]) box(p, [.62, .06, .08], M.core, [0, y, 0]);
    for (const side of [-1, 1]) roundedPanel(p, .18, .75, .16, M.white, [side * .25, 3.18, .04], .035);
    box(p, [.46, .62, .3], M.core, [0, .75, .14]);
    const cover = group(p, 'radio-enclosure-cover');
    box(cover, [.43, .57, .04], M.white, [0, .75, .31]); shell(cover); explode(cover, [0, .1, .4]);
    const pcb = board(p, 'wayside-radio', [0, .75, .23], .35, .4); pcb.rotation.x = Math.PI / 2;
    tube(p, [[0, .8, -.1], [0, 2.5, -.1], [.24, 3.2, -.08]], .019, M.dark, { segments: 12 });
    const status = lamp(p, [.14, 1.02, .34], tint.green, .028);
    onFrame(s => status.set(radioLost(s) ? tint.alert : tint.green));
    return p;
  }
  function railbed(parent, length = 14, { z = 0, joints = [], sleepers = true } = {}) {
    const p = part(parent, 'running-rail');
    box(parent, [length + .35, .2, 2.75], M.deck, [0, -.12, z]);
    if (sleepers) for (let x = -length / 2 + .35; x < length / 2; x += .65) {
      box(p, [.19, .12, 2.08], M.core, [x, -.015, z]);
      for (const dz of [-.72, .72]) box(p, [.23, .027, .3], M.aluminum, [x, .065, z + dz]);
    }
    const ends = [-length / 2, ...joints, length / 2];
    for (let j = 0; j < ends.length - 1; j++) {
      const a = ends[j] + .015, b = ends[j + 1] - .015;
      for (const dz of [-.72, .72]) {
        box(p, [b - a, .04, .16], M.steel, [(a + b) / 2, .095, z + dz]);
        box(p, [b - a, .075, .05], M.core, [(a + b) / 2, .145, z + dz]);
        box(p, [b - a, .045, .1], M.aluminum, [(a + b) / 2, .205, z + dz]);
      }
    }
    for (const x of joints) for (const dz of [-.72, .72]) box(p, [.025, .12, .19], M.white, [x, .155, z + dz]);
    return p;
  }
  function wheels(parent, at, component = 'bogie') {
    const p = part(parent, component, at);
    const sets = [];
    for (const x of [-.65, .65]) {
      const set = group(p, 'illustrative-wheelset', [x, .64, 0]);
      cylinder(set, .075, 1.7, M.steel, [0, 0, 0], [Math.PI / 2, 0, 0], 10);
      for (const z of [-.72, .72]) {
        cylinder(set, .415, .13, M.steel, [0, 0, z], [Math.PI / 2, 0, 0], 14);
        cylinder(set, .44, .035, M.core, [0, 0, z - Math.sign(z) * .08], [Math.PI / 2, 0, 0], 14);
        cylinder(set, .14, .17, M.aluminum, [0, 0, z], [Math.PI / 2, 0, 0], 10);
        box(set, [.045, .55, .02], M.core, [0, 0, z + Math.sign(z) * .09]);
      }
      sets.push(set);
    }
    box(p, [2.1, .16, 1.22], M.core, [0, 1.04, 0]);
    for (const x of [-.65, .65]) for (const z of [-.5, .5]) {
      cylinder(p, .12, .22, M.steel, [x, .88, z], null, 10);
      for (let i = 0; i < 4; i++) mesh(p, torus(.12, .017, 4, 12), M.dark, [x, .82 + i * .045, z], [Math.PI / 2, 0, 0]);
    }
    return { node: p, sets };
  }
  function odometry(parent, at) {
    const p = part(parent, 'odometry', at);
    plate(p, [2.2, .1, 1.25], [0, .05, 0]);
    const encoder = part(p, 'tachometer', [-.62, .6, 0]);
    cylinder(encoder, .36, .09, M.steel, [0, 0, 0], [Math.PI / 2, 0, 0], 18);
    cylinder(encoder, .16, .16, M.core, [0, 0, .02], [Math.PI / 2, 0, 0], 12);
    const teeth = group(encoder, 'wheel-motion-markers');
    for (let i = 0; i < 12; i++) box(teeth, [.035, .065, .024], M.aluminum, [Math.cos(i * Math.PI / 6) * .31, Math.sin(i * Math.PI / 6) * .31, .07]);
    box(encoder, [.17, .19, .19], M.signal, [.4, .15, .04]);
    tube(encoder, [[.4, .2, .04], [.47, .55, .04], [.85, .55, .04]], .017, M.dark, { segments: 8 });
    const imu = part(p, 'accelerometer', [.55, .23, 0]);
    box(imu, [.52, .22, .46], M.signal);
    const cap = group(imu, 'inertial-unit-cover');
    box(cap, [.52, .04, .46], M.aluminum, [0, .13, 0]); shell(cap); explode(cap, [0, .35, 0]);
    board(imu, 'accelerometer', [0, .04, 0], .4, .32);
    for (const [end, color] of [[[.43, .2, 0], tint.red], [[0, .65, 0], tint.green], [[0, .2, .43], tint.report]]) arrow(imu, [0, .2, 0], end, color, .012);
    onFrame(s => { teeth.rotation.z = -phase(s) * .7; });
    return p;
  }
  function balise(parent, at, { reader = false, component = 'balise' } = {}) {
    const p = part(parent, component, at);
    plate(p, [.73, .045, .4], [0, 0, 0], M.steel);
    roundedPanel(p, .58, .1, .3, M.yellow, [0, .07, 0], .045);
    const casing = group(p, 'transponder-top-cover');
    box(casing, [.48, .025, .23], M.dark, [0, .137, 0]); shell(casing); explode(casing, [0, .3, 0]);
    for (let i = 0; i < 4; i++) {
      const loop = mesh(p, torus(.075 + i * .017, .006, 4, 14), M.copper, [0, .128, 0], [Math.PI / 2, 0, 0]); loop.scale.x = 1.7;
    }
    box(p, [.1, .025, .075], M.core, [.13, .13, 0]);
    if (reader) {
      const readerPart = part(parent, 'etcs-onboard', [at[0], at[1] + .66, at[2]]);
      roundedPanel(readerPart, .75, .11, .48, M.white, [0, 0, 0], .04);
      box(readerPart, [.58, .035, .34], M.dark, [0, -.08, 0]);
      for (const x of [-.27, .27]) box(readerPart, [.06, .25, .06], M.steel, [x, .15, 0]);
      explode(readerPart, [0, .35, 0]);
      return { node: p, reader: readerPart };
    }
    return { node: p };
  }
  function signalHead(parent, at) {
    const p = part(parent, 'lineside-signal', at);
    plate(p, [.65, .12, .65], [0, .06, 0]);
    cylinder(p, .055, 2.5, M.steel, [0, 1.35, 0], null, 10);
    roundedPanel(p, .48, .95, .18, M.dark, [0, 2.55, 0], .08);
    const stop = lamp(p, [0, 2.79, .12], tint.red, .105);
    const proceed = lamp(p, [0, 2.38, .12], tint.off, .105);
    for (const y of [2.79, 2.38]) box(p, [.31, .045, .24], M.core, [0, y + .15, .17]);
    return { node: p, show(isProved) { stop.set(isProved ? tint.off : tint.red); proceed.set(isProved ? tint.green : tint.off); } };
  }
  function authority(parent, at, length) {
    const p = part(parent, 'movement-authority', at);
    const material = new THREE.MeshBasicMaterial({ color: tint.permit, transparent: true, opacity: .22 });
    const ribbon = box(p, [length, .025, .28], material, [length / 2, 0, 0]);
    const endMaterial = basic(tint.permit);
    box(p, [.07, .8, .07], endMaterial, [length, .4, 0]);
    box(p, [.5, .06, .07], endMaterial, [length, .8, 0]);
    const pointer = arrow(p, [.2, .05, 0], [Math.min(length - .25, 1.2), .05, 0], tint.permit, .02);
    return { node: p, show(proved = true, stale = false) {
      material.color.setHex(stale || !proved ? tint.alert : tint.permit);
      endMaterial.color.setHex(stale || !proved ? tint.alert : tint.permit);
      ribbon.visible = proved; pointer.visible = proved && !stale;
    } };
  }
  function blockStrip(parent, from, to, z, component = 'fixed-block') {
    const p = part(parent, component);
    const material = new THREE.MeshBasicMaterial({ color: tint.report, transparent: true, opacity: .2 });
    box(p, [to - from - .1, .024, 1.17], material, [(from + to) / 2, .27, z]);
    for (const x of [from, to]) box(p, [.04, .08, 1.55], M.signal, [x, .31, z]);
    return { node: p, set(occupied) { material.color.setHex(occupied ? tint.alert : tint.report); material.opacity = occupied ? .36 : .13; } };
  }

  function cbtcNetwork() {
    const railway = group(root, 'matched-train-and-track-scale'); railway.scale.setScalar(.8);
    makeTrack(railway, 27.5, { detail: false, section: true });
    const train = makeTrain(railway, { full: false, at: [-3.25, 0, 0] });
    train.userData.context = 'Vehicle context; control architecture is shown in separate functional insets.';
    rack(root, 'train-control', [-5.3, 0, 4.6], ['atp', 'ato', 'tcms'], [1.65, 2.6, 1]);
    rack(root, 'train-radio', [-2.4, 0, 4.6], ['train-radio', 'train-network'], [1.05, 1.8, .8]);
    odometry(root, [-8, 0, 4.4]);
    const zc = rack(root, 'zone-controller', [3.8, 0, -4.1]);
    rack(root, 'interlocking', [6.2, 0, -4.1], ['interlocking', 'train-detection']);
    desk(root, 'ats', [-4.4, 0, -4.1]);
    mast(root, [.5, 0, -3.3]);
    const atpMarker = part(root, 'atp', [-4.2, .4, 2.3]);
    plate(atpMarker, [2.4, .07, .5], [0, 0, 0]);
    const permission = authority(root, [-7, .34, 1.85], 12.2);
    const request = part(root, 'ato');
    const requestArrow = arrow(request, [-6, .65, 2.35], [-2.6, .65, 2.35], tint.request, .028);
    connection(root, 'odometry', [[-7, .9, 4.35], [-6.3, 1.8, 4.8], [-5.3, 1.75, 5.1]], { color: tint.report });
    connection(root, 'train-radio', [[-2.4, 1.4, 4.75], [-1, 3.3, 3.2], [1.96, 3.016, -.2]], { color: tint.report, held: radioLost });
    connection(root, 'wayside-radio', [[1.96, 3.016, -.2], [1, 5, -1.4], [.5, 3.35, -3.3]], { color: tint.report, held: radioLost });
    connection(root, 'zone-controller', [[.5, 1, -3.3], [1.8, 1.1, -2.7], [3.8, 1.6, -3.6]], { color: tint.report, held: radioLost });
    connection(root, 'movement-authority', [[3.8, 2, -3.6], [2.2, 4.6, -1.6], [-1.4, 4.4, 2.7], [-5.3, 2.1, 5.1]], { held: radioLost });
    connection(root, 'interlocking', [[6.2, 1.4, -3.6], [5, 1.4, -3.1], [3.8, 1.4, -3.6]], { color: tint.report });
    connection(root, 'ats', [[-3.4, 1.5, -4], [-1, 2.3, -5], [2.8, 2, -4.2], [3.8, 1.8, -3.6]], { color: tint.request });
    connection(root, 'ato', [[-5.3, 1.1, 5.1], [-4.2, .9, 3.4], [-3.1, .8, .8]], { color: tint.request, enabled: s => s.scenario !== 'door-open' });
    const boundary = part(root, 'cbtc');
    for (const x of [-9.5, 8.4]) box(boundary, [.06, .18, 10.4], M.edge, [x, -.13, .5]);
    onFrame(s => {
      permission.node.visible = signals(s); permission.show(true, radioLost(s));
      requestArrow.visible = signals(s) && s.scenario !== 'door-open';
      zc.indicators.forEach(x => x.set(radioLost(s) ? tint.alert : tint.green));
    });
  }

  function conventional() {
    const railway = group(root, 'matched-train-and-track-scale'); railway.scale.setScalar(.6);
    // The control choice does not silently replace the selected propulsion or
    // DC supply. Block markers overlay that same physical vehicle context.
    makeTrack(railway,45,{detail:false,section:true});
    const fixed = [[-22.5, -5 / .6], [-5 / .6, 5], [5, 22.5]].map(([a, b]) => blockStrip(railway, a, b, 0));
    const train = makeTrain(railway, { full: false, at: [7.5, 0, 0] });
    rack(root, 'interlocking', [-3.2, 0, -3.4], ['interlocking', 'train-detection']);
    const signalsAt = [-5.25, 2.75].map(x => signalHead(root, [x, 0, 1.85]));
    const relay = rack(root, 'track-circuit', [-7.2, 0, -3.4], ['track-circuit', 'track-circuit'], [1.1, 1.7, .75]);
    axleHead(root, 3, -.432);
    const indication = part(root, 'train-detection', [.4, .1, -3.6]);
    box(indication, [2.1, .9, .2], M.core, [0, .45, 0]);
    const occupiedLamp = lamp(indication, [-.55, .46, .15], tint.alert, .12);
    const clearLamp = lamp(indication, [.55, .46, .15], tint.off, .12);
    connection(root, 'train-detection', [[3, .42, -.9], [2.3, .55, -2], [.4, .55, -3.3], [-3.2, 1.3, -3]], { color: tint.report });
    connection(root, 'track-circuit', [[-5.1, .24, .72], [-5.6, .4, -.6], [-7.2, .9, -3]], { color: tint.report });
    connection(root, 'interlocking', [[-3.2, 1.5, -3], [-1.6, 1.7, -1.6], [2.75, 2.4, 2]], { enabled: s => variant(s, ['clear', 'occupied']) === 'clear' });
    onFrame(s => {
      const occupied = variant(s, ['clear', 'occupied']) === 'occupied';
      train.position.x = occupied ? 7.5 : 14.4;
      const rear = (train.position.x - 8) * .6, front = (train.position.x + 8) * .6;
      [[-13.5, -5], [-5, 3], [3, 13.5]].forEach(([a, b], i) => fixed[i].set(front > a && rear < b));
      signalsAt[0].show(!occupied); signalsAt[1].show(false);
      occupiedLamp.set(occupied ? tint.alert : tint.off); clearLamp.set(occupied ? tint.off : tint.green);
      relay.indicators.forEach(x => x.set(occupied ? tint.alert : tint.green));
    });
  }

  function etcs() {
    const railway = group(root, 'matched-train-and-track-scale'); railway.scale.setScalar(.72);
    makeTrack(railway,25,{detail:false,section:true});
    const vehicle = makeTrain(railway, { full: false, at: [-3.47, 0, 0] });
    rack(root, 'etcs-onboard', [-4.7, 0, 4.1], ['etcs-onboard', 'atp'], [1.5, 2.45, .95]);
    const cab = part(root, 'etcs-onboard', [-1.5, 0, 4.2]);
    box(cab, [2.1, .15, 1.15], M.edge, [0, .78, 0]);
    box(cab, [1.85, .9, .2], M.white, [0, .35, -.35]);
    const dmi = screen(cab, 'etcs-onboard', [0, 1.33, -.2], [1.55, .9]);
    dmi.rotation.x = -.12;
    box(cab, [.48, .04, .25], M.dark, [.45, .91, .2]);
    odometry(root, [-7.7, 0, 4.1]);
    const tag = balise(root, [1.9, .3, 0], { reader: true });
    const supervision = authority(root, [-7.2, .35, 1.5], 12.3);
    const level1 = group(root, 'variant-level-1');
    rack(level1, 'leu', [4.4, 0, -2.8], ['leu', 'leu'], [.95, 1.5, .72]);
    rack(level1, 'interlocking', [7, 0, -2.8], ['interlocking']);
    const sig = signalHead(level1, [3.2, 0, 1.9]); sig.show(true);
    connection(level1, 'leu', [[7, .9, -2.3], [5.5, .8, -2.2], [4.4, .8, -2.3]], { color: tint.report });
    connection(level1, 'balise', [[4.4, .5, -2.3], [2.6, .5, -1.6], [1.9, .4, 0]], { speed: .1 });
    const level2 = group(root, 'variant-level-2');
    rack(level2, 'rbc', [4.6, 0, -3.2], ['rbc', 'rbc'], [1.5, 2.65, .95]);
    rack(level2, 'interlocking', [7.1, 0, -3.2], ['interlocking']);
    mast(level2, [.5, 0, -3]);
    antenna(level2, [.3, 2.2, -.2]);
    connection(level2, 'rbc', [[7.1, 1.5, -2.7], [6, 1.2, -2.4], [4.6, 1.5, -2.7]], { color: tint.report });
    connection(level2, 'train-radio', [[4.6, 2.1, -2.7], [2.3, 3.7, -2.7], [.3, 3.7, -1], [.3, 2.4, -.2]], { held: radioLost });
    connection(level2, 'rbc', [[.4, 2.3, .1], [.8, 4.3, -1.6], [3, 3.5, -3.1], [4.6, 1.1, -2.7]], { color: tint.report, held: radioLost });
    const transport = part(level2, 'gsm-r-frmcs', [2.3, .1, -3.8]);
    box(transport, [1, .07, .6], M.edge);
    box(transport, [.75, .35, .4], M.signal, [0, .22, 0]);
    for (const x of [-.2, .2]) cylinder(transport, .035, .25, M.dark, [x, .5, 0], null, 8);
    connection(root, 'odometry', [[-6.9, .6, 4.1], [-5.9, .8, 4.8], [-4.7, 1.2, 4.6]], { color: tint.report });
    connection(root, 'etcs-onboard', [[-4.7, 1.7, 4.6], [-3.1, 1.7, 4.7], [-1.5, 1.33, 4.1]], { color: tint.report });
    connection(root, 'balise', [[1.9, .45, 0], [1.9, .88, 0]], { count: 1, speed: .5, enabled: s => phase(s) % 4 < .8 });
    const activeSupervision = part(root, 'atp', [-4.7, 2.7, 4.1]);
    const superviseLamp = lamp(activeSupervision, [0, 0, 0], tint.green, .08);
    onFrame(s => {
      const selected = variant(s, ['level-1', 'level-2']);
      level1.visible = selected === 'level-1'; level2.visible = selected === 'level-2';
      tag.reader.visible = true;
      supervision.node.visible = signals(s); supervision.show(true, selected === 'level-2' && radioLost(s));
      superviseLamp.set(tint.green); // Passing a balise does not switch onboard supervision off.
    });
  }

  function seltrac() {
    const railway = group(root, 'matched-train-and-track-scale'); railway.scale.setScalar(.7);
    makeTrack(railway, 20 / .7, { detail: false, section: true });
    makeTrain(railway, { full: false, at: [-3 / .7, 0, 0] });
    rack(root, 'train-control', [-4.8, 0, 4], ['atp', 'ato'], [1.5, 2.3, .95]);
    const family = part(root, 'seltrac', [-.4, .1, 4]);
    plate(family, [1.4, .13, .9], [0, 0, 0]);
    for (let i = 0; i < 3; i++) box(family, [.22, .18 + i * .12, .45], M.signal, [-.42 + i * .42, .13 + i * .06, 0]);
    const loop = group(root, 'variant-loop');
    const loopPart = part(loop, 'seltrac-loop');
    // A stylized data pair is offset from the centre reaction rail. No real
    // cable-crossing pattern or segment dimensions are represented.
    for (const z of [-.31, -.36]) tube(loopPart, [[-9.2, .28, z], [-4, .28, z], [2, .28, z], [8.9, .28, z]], .018, M.signal, { segments: 14 });
    tube(loopPart, [[-9.2, .28, -.31], [-9.35, .28, -.335], [-9.2, .28, -.36]], .018, M.signal, { segments: 6 });
    const pickup = part(loopPart, 'seltrac-loop', [-2, .61, -.335]);
    roundedPanel(pickup, .62, .09, .25, M.core);
    mesh(pickup, torus(.09, .014, 5, 16), M.copper, [0, -.04, 0], [Math.PI / 2, 0, 0]).scale.x = 2.1;
    rack(loop, 'zone-controller', [5.5, 0, -3.2], ['zone-controller', 'zone-controller']);
    rack(loop, 'seltrac-loop', [2.3, 0, -3.2], ['seltrac-loop'], [.9, 1.2, .75]);
    connection(loop, 'seltrac-loop', [[-2, .37, -.335], [-2, .6, -.335]], { count: 1, speed: .6 });
    connection(loop, 'zone-controller', [[8.9, .3, -.335], [8.3, .6, -2], [5.5, 1.3, -2.7]], { color: tint.report });
    connection(loop, 'train-control', [[-2, .75, -.335], [-3, 1.7, 2], [-4.8, 1.7, 4.5]], { color: tint.report });
    const radio = group(root, 'variant-radio');
    mast(radio, [2, 0, -3.1]);
    rack(radio, 'zone-controller', [5.5, 0, -3.1], ['zone-controller', 'zone-controller']);
    rack(radio, 'train-radio', [-1.8, 0, 4.1], ['train-radio'], [1, 1.4, .8]);
    connection(radio, 'train-radio', [[.99, 2.64, -.175], [1, 4.5, -1.5], [2, 3.35, -3.1]], { held: radioLost, color: tint.report });
    connection(radio, 'zone-controller', [[2, 1, -2.9], [4, 1, -2.6], [5.5, 1.3, -2.6]], { held: radioLost });
    const g9 = group(root, 'variant-g9');
    const hosting = part(g9, 'seltrac-g9', [4.9, 0, -2.8]);
    box(hosting, [5.2, .17, 3.05], M.deck, [0, .03, 0]);
    for (const x of [-2.55, 2.55]) box(hosting, [.055, 3.4, 3.05], M.edge, [x, 1.7, 0]);
    box(hosting, [5.2, .055, 3.05], M.edge, [0, 3.4, 0]);
    for (const x of [-1.42, 0, 1.42]) rack(hosting, 'seltrac-g9', [x, .13, 0], ['seltrac-g9', 'seltrac-g9', 'seltrac-g9'], [1.1, 2.7, .9]);
    desk(g9, 'ats', [-5.5, 0, -3.4]);
    mast(g9, [.7, 0, -3.3]);
    connection(g9, 'seltrac-g9', [[.7, 1, -3], [2, 1, -2], [3.2, 1.4, -2.2]], { held: radioLost });
    connection(g9, 'train-radio', [[.99, 2.64, -.175], [.5, 4.4, -1.5], [.7, 3.35, -3.3]], { held: radioLost });
    connection(g9, 'ats', [[-4.4, 1.4, -3.2], [-2, 2.3, -4.1], [2.5, 2.8, -4.1], [4.9, 2.6, -2.8]], { color: tint.request });
    const permission = authority(root, [-7.6, .35, 1.7], 12.6);
    onFrame(s => {
      const chosen = variant(s, ['loop', 'radio', 'g9']);
      loop.visible = chosen === 'loop'; radio.visible = chosen === 'radio'; g9.visible = chosen === 'g9';
      permission.node.visible = signals(s); permission.show(true, chosen !== 'loop' && radioLost(s));
    });
  }

  function turnout(parent) {
    const p = part(parent, 'running-rail');
    box(p, [14.5, .18, 8], M.deck, [0, -.12, 1]);
    for (let x = -6.6; x < 6.7; x += .62) box(p, [.18, .12, x < -2 ? 2.2 : 2.2 + (x + 2) * .48], M.core, [x, -.01, x < -2 ? 0 : (x + 2) * .24]);
    for (const z of [-.72, .72]) {
      box(p, [13.4, .045, .16], M.steel, [0, .09, z]);
      box(p, [13.4, .08, .055], M.core, [0, .15, z]);
      box(p, [13.4, .045, .105], M.aluminum, [0, .21, z]);
      const points = [[-3, .21, z], [-.8, .21, z + .18], [2.2, .21, z + 1.35], [6.7, .21, z + 3.5]];
      tube(p, points.map(q => [q[0], q[1] - .07, q[2]]), .042, M.core, { segments: 25 });
      tube(p, points, .052, M.aluminum, { segments: 25 });
    }
    const frog = part(parent, 'track-frog', [2.4, .24, .76]);
    const nose = new THREE.Shape(); nose.moveTo(-.5, -.04); nose.lineTo(.6, -.04); nose.lineTo(.6, .17); nose.closePath();
    const geometry = new THREE.ExtrudeGeometry(nose, { depth: .08, bevelEnabled: false });
    const crossing = mesh(frog, geometry, M.steel); crossing.rotation.x = Math.PI / 2;
    const blades = group(parent, 'movable-switch-blades', [-2.9, 0, 0]);
    for (const z of [-.61, .61]) {
      const blade = part(blades, 'track-switch-rail', [0, .22, z]);
      box(blade, [2.3, .065, .065], M.steel, [1.15, 0, 0], [0, z > 0 ? -.055 : .055, 0]);
    }
    const stretcher = part(parent, 'track-stretcher', [-.85, .28, 0]);
    box(stretcher, [.13, .07, 1.3], M.steel);
    const guards = part(parent, 'track-check-rail');
    for (const z of [-.5, 1.72]) box(guards, [1.65, .08, .075], M.core, [2.5, .2, z]);
    return blades;
  }
  function pointDrive(parent, at) {
    const p = part(parent, 'point-machine', at);
    plate(p, [2.1, .12, 1], [0, .06, 0]);
    box(p, [1.96, .09, .86], M.core, [0, .16, 0]);
    const lid = group(p, 'point-machine-removable-cover');
    roundedPanel(lid, 2.03, .45, .94, M.white, [0, .43, 0], .06); shell(lid); explode(lid, [0, .85, 0]);
    cylinder(p, .19, .6, M.teal, [-.55, .37, 0], [0, 0, Math.PI / 2], 12);
    cylinder(p, .075, .38, M.steel, [-.1, .37, 0], [0, 0, Math.PI / 2], 10);
    const gear = group(p, 'illustrative-drive-gear', [.2, .3, 0]);
    cylinder(gear, .22, .09, M.steel, [0, 0, 0], null, 14);
    for (let i = 0; i < 10; i++) box(gear, [.07, .08, .07], M.core, [Math.cos(i * Math.PI / 5) * .22, 0, Math.sin(i * Math.PI / 5) * .22]);
    const drive = group(p, 'actuation-rod');
    cylinder(drive, .039, 2.08, M.steel, [.45, .32, 1.05], [Math.PI / 2, 0, 0], 10);
    box(drive, [.3, .11, .22], M.core, [.45, .32, 1.98]);
    const detection = part(p, 'track-point-detection');
    cylinder(detection, .024, 1.8, M.copper, [.75, .27, 1.0], [Math.PI / 2, 0, 0], 8);
    box(detection, [.21, .12, .25], M.signal, [.75, .28, .08]);
    box(p, [.16, .25, .22], M.core, [.45, .34, .46]);
    const proof = lamp(p, [.76, .57, .23], tint.green, .055);
    return { node: p, gear, drive, detection, proof };
  }
  function interlocking() {
    const blades = turnout(root);
    const machine = pointDrive(root, [-1.3, .1, -1.9]);
    const interlock = rack(root, 'interlocking', [4.4, 0, -2.9], ['interlocking', 'train-detection'], [1.55, 2.5, .95]);
    const signal = signalHead(root, [-4.4, 0, 1.65]);
    const panel = part(root, 'interlocking', [-3.4, .1, 4.6]);
    box(panel, [2.6, .17, 1.15], M.edge, [0, .45, 0]);
    box(panel, [2.6, .95, .15], M.core, [0, 1, -.3]);
    const requested = lamp(panel, [-.8, 1, -.18], tint.report, .12);
    const detected = lamp(panel, [0, 1, -.18], tint.green, .12);
    const proved = lamp(panel, [.8, 1, -.18], tint.green, .12);
    const permission = authority(root, [-5.7, .34, 1.06], 10.8);
    connection(root, 'point-machine', [[4.4, 1.5, -2.4], [1.6, 1.1, -2.7], [-1.3, .52, -1.6]], { color: tint.request });
    connection(root, 'interlocking', [[-.55, .4, -1.72], [.7, .72, -2.1], [3.8, .9, -2.4], [4.4, 1.1, -2.4]], { color: tint.report, held: s => variant(s, ['proved', 'unproved']) === 'unproved' });
    connection(root, 'movement-authority', [[4.4, 1.8, -2.4], [1, 2.5, -.4], [-4.4, 2.6, 1.8]], { enabled: s => variant(s, ['proved', 'unproved']) === 'proved' });
    onFrame(s => {
      const ok = variant(s, ['proved', 'unproved']) === 'proved';
      // Missing proof never turns into permission, even with a visibly moved rod.
      blades.rotation.y = ok ? 0 : .012;
      machine.drive.position.z = ok ? 0 : .08;
      machine.detection.position.z = ok ? 0 : .035;
      machine.gear.rotation.y = ok ? 0 : .2;
      machine.proof.set(ok ? tint.green : tint.alert);
      requested.set(tint.report); detected.set(ok ? tint.green : tint.alert); proved.set(ok ? tint.green : tint.off);
      interlock.indicators.forEach(x => x.set(ok ? tint.green : tint.alert));
      signal.show(ok); permission.node.visible = signals(s); permission.show(ok);
    });
  }

  function axleHead(parent, x, z) {
    const p = part(parent, 'axle-counter', [x, .16, z]);
    box(p, [.47, .055, .42], M.core, [0, -.06, -.16]);
    for (const dx of [-.12, .12]) {
      roundedPanel(p, .13, .2, .18, M.signal, [dx, .08, -.17], .025);
      box(p, [.06, .045, .12], M.dark, [dx, .19, -.17]);
    }
    tube(p, [[-.18, -.01, -.23], [-.3, -.01, -.5], [-.4, .02, -.75]], .018, M.dark, { segments: 8 });
    const cue = mesh(p, torus(.3, .017, 5, 20), basic(tint.report), [0, .2, -.17]);
    cue.rotation.x = Math.PI / 2;
    return { node: p, cue };
  }
  function trainDetection() {
    railbed(root, 11, { joints: [-2.5, 2.5] });
    const wagon = wheels(root, [0, 0, 0]);
    const extent = part(wagon.node, 'train-integrity');
    box(extent, [2.28, .1, 1.4], M.white, [0, 1.18, 0]);
    for (const x of [-1.18, 1.18]) box(extent, [.035, .38, 1.5], M.signal, [x, 1.35, 0]);
    const section = blockStrip(root, -2.5, 2.5, 0, 'train-detection');
    const circuit = group(root, 'variant-track-circuit');
    const feed = part(circuit, 'track-circuit', [-4, .1, 2.5]);
    plate(feed, [1.4, .08, .9], [0, .04, 0]);
    box(feed, [.65, .55, .5], M.core, [0, .35, 0]);
    for (const x of [-.2, .2]) cylinder(feed, .045, .1, M.steel, [x, .68, 0], null, 8);
    const feedCap = group(feed, 'detector-supply-cover');
    box(feedCap, [.7, .6, .04], M.white, [0, .35, .3]); shell(feedCap); explode(feedCap, [0, .1, .45]);
    board(feed, 'track-circuit', [0, .4, .08], .5, .33);
    const receiver = part(circuit, 'track-circuit', [4, .1, 2.5]);
    plate(receiver, [1.55, .08, 1.1], [0, .04, 0]);
    for (const x of [-.3, .3]) {
      cylinder(receiver, .15, .45, M.copper, [x, .43, -.1], null, 12);
      cylinder(receiver, .07, .57, M.core, [x, .46, -.1], null, 10);
      for (let i = 0; i < 4; i++) mesh(receiver, torus(.15, .014, 4, 12), M.dark, [x, .3 + i * .085, -.1], [Math.PI / 2, 0, 0]);
    }
    const armature = group(receiver, 'relay-armature', [-.5, .78, -.1]);
    box(armature, [1.03, .055, .18], M.steel, [.5, 0, 0]);
    box(receiver, [.12, .45, .12], M.core, [.5, .4, .28]);
    box(receiver, [.35, .04, .08], M.copper, [.35, .65, .28]);
    const relayLid = group(receiver, 'relay-case');
    for (const x of [-.66, .66]) box(relayLid, [.04, .95, .82], M.white, [x, .55, 0]);
    box(relayLid, [1.35, .045, .85], M.white, [0, 1.05, 0]); shell(relayLid); explode(relayLid, [0, .7, 0]);
    const relayLight = lamp(receiver, [0, .32, .48], tint.alert, .08);
    for (const z of [-.72, .72]) {
      tube(feed, [[z < 0 ? -.2 : .2, .68, 0], [0, .08, -1], [1.55, .12, z - 2.5]], .018, M.dark, { segments: 10 });
      tube(receiver, [[z < 0 ? -.3 : .3, .2, 0], [0, .04, -1], [-1.55, .12, z - 2.5]], .018, M.dark, { segments: 10 });
    }
    const counters = group(root, 'variant-axle-counter');
    const entry = axleHead(counters, -2.5, -.72), exit = axleHead(counters, 2.5, -.72);
    rack(counters, 'axle-counter', [3.7, 0, 2.8], ['axle-counter', 'train-detection'], [1.2, 1.75, .8]);
    const countPanel = part(counters, 'train-detection', [-3.7, .1, 2.7]);
    box(countPanel, [1.9, .9, .18], M.core, [0, .55, 0]);
    const countBars = [0, 1].map(i => box(countPanel, [.18, .45, .035], M.signal, [-.32 + i * .6, .57, .13]));
    const valid = lamp(countPanel, [.7, .88, .13], tint.green, .06);
    connection(counters, 'axle-counter', [[-2.5, .38, -1], [-1.5, .65, -2.1], [2.9, .65, -2.1], [3.7, 1, 3.2]], { color: tint.report });
    connection(counters, 'axle-counter', [[2.5, .38, -1], [3.5, .7, -.8], [3.7, 1.4, 3.2]], { color: tint.report });
    const tags = group(root, 'variant-balise');
    balise(tags, [0, .29, 0]);
    const reader = part(wagon.node, 'balise', [0, .91, 0]);
    roundedPanel(reader, .8, .11, .45, M.white);
    box(reader, [.62, .045, .33], M.dark, [0, -.08, 0]);
    rack(tags, 'etcs-onboard', [3.7, 0, 2.8], ['etcs-onboard', 'odometry'], [1.2, 1.75, .8]);
    const reference = part(tags, 'odometry', [-3.7, .1, 2.7]);
    box(reference, [2, .95, .18], M.core, [0, .55, 0]);
    const estimate = box(reference, [.8, .035, .025], M.signal, [0, .65, .12]);
    const known = box(reference, [.025, .45, .035], M.yellow, [0, .54, .15]);
    const passRing = mesh(tags, torus(.32, .025, 5, 20), basic(tint.permit), [0, .58, 0], [Math.PI / 2, 0, 0]);
    onFrame(s => {
      const selected = variant(s, ['track-circuit', 'axle-counter', 'balise']);
      circuit.visible = selected === 'track-circuit'; counters.visible = selected === 'axle-counter'; tags.visible = selected === 'balise'; reader.visible = selected === 'balise';
      const x = Math.sin(phase(s) * .24) * 4.65;
      wagon.node.position.x = x;
      const axles = [x - .65, x + .65];
      const inside = axles.filter(axle => axle > -2.5 && axle < 2.5).length;
      const trainPresent = inside > 0;
      section.node.visible = selected !== 'balise'; section.set(trainPresent);
      for (const set of wagon.sets) set.rotation.z = -x / .415;
      armature.rotation.z = trainPresent ? -.12 : 0;
      relayLight.set(trainPresent ? tint.alert : tint.green);
      countBars.forEach((bar, i) => { bar.visible = i < inside; }); valid.set(tint.green);
      entry.cue.visible = signals(s) && axles.some(axle => Math.abs(axle + 2.5) < .18);
      exit.cue.visible = signals(s) && axles.some(axle => Math.abs(axle - 2.5) < .18);
      passRing.visible = signals(s) && Math.abs(x) < .55;
      estimate.scale.x = .35 + Math.min(1, Math.abs(x) / 3.5);
      known.visible = Math.abs(x) < .55;
    });
  }

  ({ 'cbtc-network': cbtcNetwork, signalling: conventional, etcs, seltrac,
    interlocking, 'train-detection': trainDetection })[id]();
  registerAnimator(s => { for (const fn of animations) fn(s); });
  return root;
}

