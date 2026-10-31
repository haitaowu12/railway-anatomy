/*
 * Original, dimensionless teaching geometry for Railway Anatomy.
 * Rail profiles and mechanism proportions are illustrative, not product CAD.
 * Only the requested view is constructed. No private or installed-system data.
 */

export const TRACK_VIEWS = {
  'track-support': { camera: [9.5, 7.8, 10.5], target: [0, .9, 0], distance: 22 },
  'rail-fastening': { camera: [4.8, 4.4, 5.4], target: [0, 1, 0], distance: 12 },
  turnout: { camera: [13, 15, 17], target: [0, .65, 1.2], distance: 34 },
  'switch-drive': { camera: [6.5, 6.8, 7.6], target: [-.3, .8, -.25], distance: 19 },
  crossing: { camera: [8.2, 8.6, 10], target: [0, .85, .7], distance: 23 },
};

export function buildTrackView(id, api) {
  if (!Object.hasOwn(TRACK_VIEWS, id)) return null;
  const {
    THREE, C, M, mat, startModel, group, part, mesh, box, cylinder,
    torus, tube, explode, shell, registerAnimator,
  } = api;
  const root = startModel(id);
  const concrete = mat(0x89958e, .96, .015);
  const concreteEdge = mat(0x6a7976, .98, .01);
  const rubber = mat(0x244346, .92, .015);
  const insulator = mat(0xd8b87b, .76, .015);
  const aggregate = [mat(0x6f7979, .99, .01), mat(0x85908b, .99, .01), mat(0x586866, .99, .01)];
  const earth = mat(0x46524f, 1, 0);
  const fineStone = mat(0x68746b, 1, 0);
  const paving = mat(0xa6ada4, .98, .01);
  const cueMaterial = mat(C.field, .45, .05);
  const warningMaterial = mat(C.warning, .5, .05);
  const gauge = .9;
  const railHeight = .303;
  const profile = [
    [-.13, 0], [.13, 0], [.13, .052], [.036, .064],
    [.036, .205], [.07, .224], [.07, .281], [.05, .303],
    [-.05, .303], [-.07, .281], [-.07, .224], [-.036, .205],
    [-.036, .064], [-.13, .052],
  ];
  // An illustrative one-sided foot avoids occupying the neighboring running
  // rail's foot space at a close crossing guard. This is not a stock profile.
  const checkSection = profile.map(([z, y]) => [y < .065 ? Math.max(0, z * .60) : z * .60, y * .94]);
  const mix = (a, b, t) => a + (b - a) * t;
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };

  function seeded(seed = 47) {
    return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  }
  function points(x0, x1, z, y, count = 18) {
    return Array.from({ length: count + 1 }, (_, i) => {
      const x = mix(x0, x1, i / count);
      return [x, y, typeof z === 'function' ? z(x) : z];
    });
  }
  function offsetPoint(x, centerline, offset, y) {
    const slope = (centerline(x + .001) - centerline(x - .001)) / .002;
    const n = Math.hypot(1, slope);
    return [x - offset * slope / n, y, centerline(x) + offset / n];
  }
  function offsetPoints(x0, x1, centerline, offset, y, count = 24) {
    return Array.from({ length: count + 1 }, (_, i) => offsetPoint(mix(x0, x1, i / count), centerline, offset, y));
  }
  function offsetAtWorldX(x, centerline, offset, y, x0, x1) {
    let lo = x0, hi = x1;
    for (let i = 0; i < 23; i++) {
      const middle = (lo + hi) / 2;
      if (offsetPoint(middle, centerline, offset, y)[0] < x) lo = middle; else hi = middle;
    }
    const parameter = (lo + hi) / 2;
    return { point: offsetPoint(parameter, centerline, offset, y), parameter };
  }

  // Sweep a real head/web/foot section along a plan path. Unlike a rectangular
  // bar this remains recognizable at rail-seat and wheel-contact scale.
  function rail(parent, path, { taper = null, section = profile, material = null } = {}) {
    const n = section.length;
    const geo = new THREE.BufferGeometry();
    const array = new Float32Array(path.length * n * 3);
    const buckets = [[], [], []];
    const caps = THREE.ShapeUtils.triangulateShape(section.map(p => new THREE.Vector2(...p)), []);
    for (const t of caps) buckets[0].push(t[0], t[1], t[2]);
    for (let i = 0; i < path.length - 1; i++) {
      for (let j = 0; j < n; j++) {
        const a = i * n + j, b = i * n + (j + 1) % n;
        const averageY = (section[j][1] + section[(j + 1) % n][1]) / 2;
        const materialIndex = material ? 0 : averageY > .22 ? 1 : averageY < .065 ? 2 : 0;
        buckets[materialIndex].push(a, a + n, b, b, a + n, b + n);
      }
    }
    const last = (path.length - 1) * n;
    for (const t of caps) buckets[0].push(last + t[2], last + t[1], last + t[0]);
    geo.setAttribute('position', new THREE.BufferAttribute(array, 3));
    geo.setIndex(buckets.flat());
    if (!material) {
      let cursor = 0;
      buckets.forEach((indices, i) => { geo.addGroup(cursor, indices.length, i); cursor += indices.length; });
    }
    function update(nextPath) {
      for (let i = 0; i < nextPath.length; i++) {
        const a = nextPath[Math.max(0, i - 1)], b = nextPath[Math.min(nextPath.length - 1, i + 1)];
        const dx = b[0] - a[0], dz = b[2] - a[2], len = Math.hypot(dx, dz) || 1;
        const nx = -dz / len, nz = dx / len;
        const width = taper ? taper(i / (nextPath.length - 1)) : 1;
        for (let j = 0; j < n; j++) {
          const k = (i * n + j) * 3, w = section[j][0] * width;
          array[k] = nextPath[i][0] + nx * w;
          array[k + 1] = nextPath[i][1] + section[j][1];
          array[k + 2] = nextPath[i][2] + nz * w;
        }
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals(); geo.computeBoundingBox(); geo.computeBoundingSphere();
    }
    update(path);
    const node = mesh(parent, geo, material || [M.steel, M.aluminum, M.core]);
    node.name = 'profiled-rail';
    return { node, update };
  }

  function bolt(parent, position, radius = .046, long = false) {
    const [x, y, z] = position;
    cylinder(parent, radius * 1.45, .022, M.steel, [x, y, z], null, 12);
    cylinder(parent, radius, .055, M.aluminum, [x, y + .036, z], null, 6);
    if (long) cylinder(parent, radius * .52, .28, M.core, [x, y - .14, z], null, 8);
  }

  // The SVG fallback sorts triangles without a depth buffer. Subdivide broad
  // support faces so a distant triangle centroid cannot paint ballast across
  // the rails above it. Each support remains one mesh with unchanged bounds.
  function supportBox(parent, dimensions, material, position = [0, 0, 0]) {
    const [x, y, z] = dimensions;
    const geometry = new THREE.BoxGeometry(x, y, z,
      Math.max(1, Math.ceil(x / .6)), 1, Math.max(1, Math.ceil(z / .6)));
    return mesh(parent, geometry, material, position);
  }

  function layer(parent, component, dimensions, position, material, { cut = false, lift = 0 } = {}) {
    const p = part(parent, component, position);
    if (cut) {
      const [x, y, z] = dimensions;
      supportBox(p, [x, y, z * .68], material, [0, 0, -z * .16]);
      const front = group(p, 'removable-front-section');
      supportBox(front, [x, y, z * .32], material, [0, 0, z * .34]);
      shell(front);
    } else supportBox(p, dimensions, material);
    if (lift) explode(p, [0, lift, 0]);
    return p;
  }

  function seat(parent, x, z, y, { direct = false, detailed = true, lifted = true } = {}) {
    const assembly = group(parent, 'rail-seat', [x, y, z]);
    if (direct) {
      const plate = part(assembly, 'track-baseplate');
      box(plate, [.54, .06, .72], M.core, [0, -.075, 0]);
      box(plate, [.57, .035, .76], rubber, [0, -.123, 0]);
      for (const sx of [-.19, .19]) for (const sz of [-.30, .30]) bolt(plate, [sx, -.035, sz], .035, detailed);
      if (lifted) explode(plate, [0, .14, 0]);
    }
    const pad = part(assembly, 'track-rail-pad');
    box(pad, [.39, .04, .34], rubber, [0, -.02, 0]);
    if (detailed) for (const dx of [-.12, -.04, .04, .12]) box(pad, [.018, .008, .34], concreteEdge, [dx, -.044, 0]);
    const clips = part(assembly, 'track-rail-clip');
    const insulation = part(assembly, 'track-insulator');
    for (const side of [-1, 1]) {
      box(clips, [.15, .095, .12], M.core, [-.025, .005, side * .25]);
      box(insulation, [.21, .029, .078], insulator, [.018, .069, side * .116]);
      box(insulation, [.22, .08, .026], insulator, [0, .025, side * .157]);
      if (detailed) {
        tube(clips, [
          [-.11, .045, side * .255], [-.13, .135, side * .285],
          [-.025, .166, side * .31], [.105, .139, side * .268],
          [.117, .107, side * .18], [.047, .099, side * .111],
          [-.06, .095, side * .11],
        ], .024, M.teal, { segments: 14 });
        cylinder(clips, .032, .17, M.steel, [-.025, .027, side * .25], [0, 0, Math.PI / 2], 10);
      } else {
        tube(clips, [[-.10, .045, side * .25], [-.08, .13, side * .29], [.10, .13, side * .23], [.04, .095, side * .11]], .026, M.teal, { segments: 6 });
      }
    }
    if (lifted) { explode(pad, [0, .30, 0]); explode(clips, [0, .60, 0]); explode(insulation, [0, .43, 0]); }
    return assembly;
  }

  function sleeper(parent, x, top, length = 2.75, centerZ = 0, detailed = false) {
    const s = part(parent, 'track-sleeper', [x, top - .105, centerZ]);
    const shape = new THREE.Shape();
    shape.moveTo(-length / 2, -.105); shape.lineTo(length / 2, -.105);
    shape.lineTo(length / 2 - .10, .075); shape.lineTo(length / 2 - .27, .105);
    shape.lineTo(-length / 2 + .27, .105); shape.lineTo(-length / 2 + .10, .075); shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: .36, bevelEnabled: false, curveSegments: 1 });
    geometry.translate(0, 0, -.18); geometry.rotateY(Math.PI / 2);
    mesh(s, geometry, concrete);
    if (detailed) {
      box(s, [.36, .025, length - .12], rubber, [0, -.118, 0]);
      for (const z of [-length * .36, length * .36]) box(s, [.22, .008, .15], concreteEdge, [0, .107, z]);
    }
    return s;
  }

  function wheelset(parent, position, { radius = .42, halfGauge = gauge, detail = true } = {}) {
    const p = part(parent, 'bogie', position);
    cylinder(p, .075, halfGauge * 2 + .31, M.core, [0, 0, 0], [Math.PI / 2, 0, 0], 12);
    const wheels = [];
    for (const side of [-1, 1]) {
      const w = group(p, 'wheel', [0, 0, side * halfGauge]);
      cylinder(w, radius, .145, M.steel, [0, 0, 0], [Math.PI / 2, 0, 0], 24);
      cylinder(w, radius + .045, .026, M.aluminum, [0, 0, -side * .076], [Math.PI / 2, 0, 0], 24);
      cylinder(w, radius * .70, .151, M.core, [0, 0, 0], [Math.PI / 2, 0, 0], 18);
      cylinder(w, .12, .22, M.aluminum, [0, 0, side * .04], [Math.PI / 2, 0, 0], 12);
      if (detail) for (let a = 0; a < 6; a++) {
        const angle = a * Math.PI / 3;
        cylinder(w, .021, .018, M.steel, [Math.cos(angle) * .21, Math.sin(angle) * .21, side * .084], [Math.PI / 2, 0, 0], 6);
      }
      wheels.push(w);
    }
    return { root: p, wheels, radius };
  }

  function cueArrow(parent, from, to, color = C.field, width = .075) {
    const start = new THREE.Vector3(...from), end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start), length = direction.length();
    const a = new THREE.ArrowHelper(direction.normalize(), start, length, color, width * 2.4, width);
    parent.add(a); return a;
  }
  function animatedPath(parent, path, color, { radius = .019, beads = 3 } = {}) {
    const material = mat(color, .5, .05);
    const { curve } = tube(parent, path, radius, material, { segments: 18 });
    const balls = [];
    const geometry = new THREE.SphereGeometry(radius * 2.1, 7, 5);
    for (let i = 0; i < beads; i++) balls.push(mesh(parent, geometry, material));
    return phase => balls.forEach((ball, i) => ball.position.copy(curve.getPointAt((phase / 4 + i / beads) % 1)));
  }
  function applyVariants(groups, selected, fallback) {
    const active = Object.hasOwn(groups, selected) ? selected : fallback;
    for (const [name, node] of Object.entries(groups)) node.visible = name === active;
    return active;
  }

  function supportView() {
    const variants = {};
    const length = 8.5, y = 1.08;
    const supportXs = [-3.75, -2.5, -1.25, 0, 1.25, 2.5, 3.75];
    const railPart = part(root, 'running-rail');
    for (const z of [-gauge, gauge]) rail(railPart, points(-length / 2, length / 2, z, y, 2));
    explode(railPart, [0, .85, 0]);

    const ballasted = variants.ballasted = group(root, 'ballasted-support');
    layer(ballasted, 'track-formation', [9, .42, 3.7], [0, .07, 0], earth, { cut: true });
    layer(ballasted, 'track-subballast', [8.9, .23, 3.55], [0, .395, 0], fineStone, { cut: true, lift: .10 });
    const ballast = part(ballasted, 'track-ballast');
    const front = group(ballast, 'removable-ballast-shoulder');
    supportBox(ballast, [8.75, .31, 3.22 * .68], aggregate[2], [0, .67, -3.22 * .16]);
    supportBox(front, [8.75, .31, 3.22 * .32], aggregate[2], [0, .67, 3.22 * .34]);
    shell(front);
    const random = seeded();
    const stone = new THREE.OctahedronGeometry(.13, 0);
    for (let i = 0; i < 210; i++) {
      const x = (random() - .5) * 8.6, z = (random() - .5) * 3.2;
      if (Math.abs(z) < 1.35 && supportXs.some(s => Math.abs(x - s) < .25)) continue;
      const m = mesh(z > .58 ? front : ballast, stone, aggregate[i % 3], [x, .84 + random() * .045, z]);
      m.rotation.set(random(), random(), random());
      m.scale.set(.72 + random() * .7, .55 + random() * .4, .75 + random() * .6);
    }
    explode(ballast, [0, .18, 0]);
    const assembly = part(ballasted, 'track-ballasted');
    for (const x of supportXs) {
      const s = sleeper(assembly, x, 1.04, 2.75, 0, true); explode(s, [0, .30, 0]);
      for (const z of [-gauge, gauge]) seat(assembly, x, z, y, { detailed: x === 0 });
    }

    const slab = variants.slab = group(root, 'slab-support');
    layer(slab, 'track-formation', [9, .34, 3.7], [0, .03, 0], earth, { cut: true });
    layer(slab, 'track-slab', [8.9, .26, 3.55], [0, .33, 0], concreteEdge, { cut: true, lift: .10 });
    const direct = part(slab, 'track-direct-fixation');
    for (const z of [-gauge, gauge]) {
      layer(direct, 'track-plinth', [8.6, .48, .94], [0, .70, z], concrete, { cut: true, lift: .24 });
      for (const x of supportXs) seat(direct, x, z, y, { direct: true, detailed: x === 0 });
    }

    const embedded = variants.embedded = group(root, 'embedded-support');
    layer(embedded, 'track-slab', [8.9, .34, 3.5], [0, .70, 0], concreteEdge, { cut: true });
    const channel = part(embedded, 'track-embedded');
    for (const z of [-gauge, gauge]) {
      supportBox(channel, [8.65, .18, .52], concrete, [0, .96, z]);
      supportBox(channel, [8.6, .055, .44], rubber, [0, 1.0525, z]);
      for (const side of [-1, 1]) supportBox(channel, [8.6, .25, .11], rubber, [0, 1.205, z + side * .205]);
    }
    const surface = group(channel, 'removable-street-surface'); shell(surface);
    supportBox(surface, [8.7, .42, 1.27], paving, [0, 1.14, 0]);
    for (const side of [-1, 1]) supportBox(surface, [8.7, .42, .51], paving, [0, 1.14, side * 1.425]);
    for (let x = -3.75; x < 4; x += 1.25) for (const z of [0, -1.425, 1.425]) box(surface, [.012, .006, z === 0 ? 1.26 : .50], concreteEdge, [x, 1.353, z]);
    explode(surface, [0, .37, 0]);

    const wheel = wheelset(root, [-.1, y + railHeight + .42, 0]);
    explode(wheel.root, [0, 1.3, 0]);
    const cues = group(root, 'qualitative-load-path');
    cueArrow(cues, [-.1, 2.70, gauge], [-.1, y + railHeight + .06, gauge], C.field, .09);
    for (const z of [-gauge, gauge]) for (const dx of [-.75, .75]) cueArrow(cues, [0, 1.00, z], [dx, .42, z * 1.25], C.field, .06);
    const drainage = group(ballasted, 'illustrative-drainage');
    const moveWater = animatedPath(drainage, [[-2.0, .85, .15], [-2.05, .56, .7], [-2.2, .48, 1.7]], C.negative);
    registerAnimator(state => {
      const selected = applyVariants(variants, state.variant, 'ballasted');
      cues.visible = Boolean(state.signals) && state.exploded < .25;
      drainage.visible = Boolean(state.signals) && selected === 'ballasted' && state.exploded < .25;
      moveWater(state.phase || 0);
    });
  }

  function fasteningView() {
    const variants = {};
    for (const variant of ['sleeper', 'direct']) {
      const v = variants[variant] = group(root, `${variant}-rail-seat`);
      const isDirect = variant === 'direct';
      layer(v, isDirect ? 'track-slab' : 'track-ballast', [3.7, isDirect ? .28 : .82, 3.25], [0, isDirect ? .06 : .38, 0], isDirect ? concreteEdge : aggregate[2], { cut: true });
      if (isDirect) {
        const plinth = layer(v, 'track-plinth', [2.9, .65, 1.7], [0, .525, 0], concrete, { cut: true, lift: .10 });
        // Generic reinforcement is visible only when the front concrete slice is removed.
        for (const z of [-.40, .40]) cylinder(plinth, .025, 2.65, M.core, [0, -.08, z], [0, 0, Math.PI / 2], 8);
      } else {
        const s = sleeper(v, 0, 1.00, 2.8, 0, true); s.scale.x = 2.7;
        explode(s, [0, .12, 0]);
      }
      const carrier = part(v, isDirect ? 'track-direct-fixation' : 'track-sleeper');
      const footY = isDirect ? .99 : 1.04;
      seat(carrier, 0, 0, footY, { direct: isDirect, detailed: true });
      const r = part(v, 'running-rail'); rail(r, points(-1.6, 1.6, 0, footY, 2)); explode(r, [0, 1.05, 0]);
      if (isDirect) for (const x of [-1.0, 1.0]) seat(carrier, x, 0, footY, { direct: true, detailed: false });
    }
    const cues = group(root, 'fastening-force-path');
    cueArrow(cues, [0, 2.18, 0], [0, 1.43, 0], C.field, .08);
    for (const side of [-1, 1]) cueArrow(cues, [.07, 1.36, side * .23], [.07, 1.16, side * .13], C.yellow, .045);
    registerAnimator(state => {
      applyVariants(variants, state.variant, 'sleeper');
      cues.visible = Boolean(state.signals) && state.exploded < .20;
    });
  }

  function nose(parent, length = .83, slope = .24) {
    const shape = new THREE.Shape();
    shape.moveTo(.04, 0); shape.lineTo(length, -length * slope); shape.lineTo(length, length * slope); shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: .095, bevelEnabled: false, curveSegments: 1 });
    // Shape x/y become plan x/z; extrusion rises vertically after rotation.
    geo.rotateX(Math.PI / 2); geo.translate(0, railHeight, 0);
    mesh(parent, geo, M.aluminum);
    box(parent, [length * .65, .18, .095], M.core, [length * .58, .14, 0]);
  }

  function crossingCore(parent, at, { angle = .38, span = 1.1 } = {}) {
    const g = part(parent, 'track-frog', at);
    const slope = Math.tan(Math.atan(angle) / 2);
    g.rotation.y = -Math.atan(slope);
    const n = group(g, 'tapered-vee');
    nose(n, .65, slope);
    for (const side of [-1, 1]) {
      rail(g, points(.56, span, x => side * slope * x, 0, 3));
      rail(g, [
        [-span, 0, side * slope * span], [-.40, 0, side * (.40 * slope + .07)],
        [-.05, 0, side * .14], [.47, 0, side * (.47 * slope + .13)],
        [.83, 0, side * (.83 * slope + .13)],
      ]);
    }
    box(g, [span * 1.9, .045, .79], M.core, [0, -.026, 0]);
    for (const x of [-.8, .65]) for (const z of [-.31, .31]) bolt(g, [x, .024, z], .030);
    return g;
  }

  function makeSwitch(parent, { small = false, drive = false } = {}) {
    const railY = .72, x0 = -6.8, x1 = 6.8, toe = -4.4, heel = -.8, offset = 3.1;
    const diverge = x => offset * smooth((x - toe) / (x1 - toe));
    let lo = toe, hi = x1;
    for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (offsetPoint(m, diverge, -gauge, railY)[2] < gauge) lo = m; else hi = m; }
    const crossingParameter = (lo + hi) / 2;
    const crossingX = offsetPoint(crossingParameter, diverge, -gauge, railY)[0];
    const slope = (diverge(crossingParameter + .02) - diverge(crossingParameter - .02)) / .04;
    const halfAngle = Math.atan(slope) / 2, frogSpan = .94;
    const straightGap = frogSpan / Math.cos(halfAngle);
    const branchDx = (offsetPoint(crossingParameter + .01, diverge, -gauge, railY)[0] - offsetPoint(crossingParameter - .01, diverge, -gauge, railY)[0]) / .02;
    const branchGap = frogSpan * Math.cos(2 * halfAngle) / Math.cos(halfAngle) / branchDx;
    const turnout = part(parent, 'track-turnout');
    supportBox(turnout, [14.1, .24, drive ? 7.3 : 6.2], M.deck, [0, .14, drive ? .95 : 1.4]);
    layer(turnout, 'track-ballast', [13.95, .28, 6.0], [0, .40, 1.4], aggregate[2]);
    const stock = part(turnout, 'track-stock-rail');
    rail(stock, points(x0, x1, -gauge, railY));
    rail(stock, offsetPoints(x0, x1, diverge, gauge, railY, 38));
    const closure = part(turnout, 'track-closure-rail');
    rail(closure, points(heel, crossingX - straightGap, gauge, railY, 8));
    rail(closure, points(crossingX + straightGap, x1, gauge, railY, 8));
    rail(closure, offsetPoints(heel, crossingParameter - branchGap, diverge, -gauge, railY, 12));
    rail(closure, offsetPoints(crossingParameter + branchGap, x1, diverge, -gauge, railY, 12));
    const bladeGroup = part(turnout, 'track-switch-rail');
    const bladePath = (side, movement) => Array.from({ length: 23 }, (_, i) => {
      const t = i / 22, x = mix(toe, heel, t), fade = (1 - t) ** 2;
      if (side < 0) {
        const p = offsetPoint(x, diverge, -gauge, railY);
        p[2] += mix(.29, .078, movement) * fade;
        return p;
      }
      return [x, railY, gauge - mix(.078, .29, movement) * fade];
    });
    const taper = t => .07 + .93 * Math.min(1, t * 3.2);
    const blades = [-1, 1].map(side => rail(bladeGroup, bladePath(side, 0), { taper }));
    for (let x = -6.4; x < 6.7; x += small ? 1.05 : .8) {
      const upper = offsetAtWorldX(x, diverge, gauge, railY, x0, x1);
      const d = upper.point[2] - gauge, length = d + 2.72, middle = d / 2;
      sleeper(turnout, x, railY - .04, length, middle, false);
      if (!small && Math.round((x + 6.4) / .8) % 2 === 0) {
        seat(turnout, x, -gauge, railY, { detailed: false, lifted: false });
        const upperSeat = seat(turnout, x, upper.point[2], railY, { detailed: false, lifted: false });
        upperSeat.rotation.y = -Math.atan((diverge(upper.parameter + .01) - diverge(upper.parameter - .01)) / .02);
      }
    }
    crossingCore(turnout, [crossingX, railY, gauge], { angle: slope, span: frogSpan });
    const guard = part(turnout, 'track-check-rail');
    rail(guard, [
      [crossingX - 1.3, railY, -gauge + .25], [crossingX - .9, railY, -gauge + .144],
      [crossingX + .9, railY, -gauge + .144], [crossingX + 1.3, railY, -gauge + .25],
    ], { section: checkSection });
    const stretch = part(turnout, 'track-stretcher', [-3.92, railY + .015, 0]);
    box(stretch, [.095, .055, 1.53], M.core, [0, -.025, 0]);
    box(stretch, [.12, .07, .16], insulator, [0, -.025, 0]);
    for (const side of [-1, 1]) {
      box(stretch, [.15, .11, .10], M.steel, [0, .002, side * .72]);
      bolt(stretch, [0, .066, side * .72], .025);
    }
    let mechanism = null;
    if (drive) {
      layer(turnout, 'track-plinth', [1.3, .10, .95], [-3.92, .29, -2.0], concrete);
      mechanism = pointMachine(turnout, [-3.92, .47, -2.0]);
    }
    let lastMovement = -1;
    function update(movement, state) {
      if (Math.abs(lastMovement - movement) > .0001) {
        blades.forEach((b, i) => b.update(bladePath(i ? 1 : -1, movement)));
        const fade = (1 - (-3.92 - toe) / (heel - toe)) ** 2;
        stretch.position.z = mix(.106, -.106, movement) * fade;
        lastMovement = movement;
      }
      if (mechanism) mechanism.update(movement, state, stretch.position.z);
    }
    return { root: turnout, update, railY, diverge, crossingX, x0, x1, toe, heel };
  }

  function pointMachine(parent, position) {
    const machine = part(parent, 'track-point-machine', position);
    box(machine, [1.25, .12, .87], concreteEdge, [0, -.12, 0]);
    box(machine, [1.12, .055, .75], M.core, [0, -.035, 0]);
    for (const x of [-.48, .48]) for (const z of [-.30, .30]) bolt(machine, [x, .012, z], .032, true);
    const housing = group(machine, 'removable-machine-housing'); shell(housing);
    explode(housing, [0, .85, 0]);
    box(housing, [1.12, .045, .76], M.teal, [0, .39, 0]);
    for (const side of [-1, 1]) box(housing, [1.12, .37, .04], M.teal, [0, .195, side * .36]);
    box(housing, [.04, .37, .72], M.teal, [-.54, .195, 0]);
    box(housing, [.04, .37, .72], M.teal, [.54, .195, 0]);
    box(housing, [.58, .018, .30], M.white, [0, .424, 0]);
    cylinder(machine, .145, .43, M.aluminum, [-.27, .19, -.08], [0, 0, Math.PI / 2], 20);
    for (const x of [-.43, -.33, -.23, -.13]) cylinder(machine, .157, .017, M.core, [x, .19, -.08], [0, 0, Math.PI / 2], 16);
    const gear = group(machine, 'illustrative-drive-gear', [.24, .20, -.08]);
    cylinder(gear, .17, .065, M.copper, [0, 0, 0], [0, 0, Math.PI / 2], 18);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      box(gear, [.078, .055, .055], M.steel, [0, Math.cos(a) * .18, Math.sin(a) * .18], [a, 0, 0]);
    }
    cylinder(machine, .025, .50, M.steel, [0, .19, -.08], [0, 0, Math.PI / 2], 10);
    const output = group(machine, 'linear-output-rod', [0, .23, .25]);
    cylinder(output, .038, 2.45, M.aluminum, [0, 0, 1.06], [Math.PI / 2, 0, 0], 10);
    box(output, [.16, .10, .18], M.core, [0, 0, .08]);
    const lock = group(machine, 'illustrative-lock');
    box(lock, [.20, .12, .11], M.yellow, [.12, .24, .26]);
    const detection = part(parent, 'track-point-detection', [position[0] + .43, position[1] + .15, position[2] + .49]);
    box(detection, [.28, .19, .35], M.signal, [0, 0, 0]);
    const detectorRod = group(detection, 'blade-reference-link');
    cylinder(detectorRod, .019, .72, M.steel, [0, .02, .48], [Math.PI / 2, 0, 0], 8);
    box(detectorRod, [.10, .16, .08], M.core, [0, .07, .84]);
    const indicator = mesh(detection, new THREE.SphereGeometry(.064, 10, 6), cueMaterial, [0, .15, 0]);
    const cues = group(parent, 'request-and-position-feedback');
    const request = animatedPath(cues, [[position[0] - .9, .36, position[2] - .75], [position[0] -.5, .36, position[2] -.55], [position[0], .57, position[2] -.4]], C.signal, { radius: .018, beads: 2 });
    const feedback = animatedPath(cues, [[position[0] + .43, .78, position[2] + .49], [position[0] + .85, .45, position[2] + .12], [position[0] + .9, .36, position[2] -.75]], C.service, { radius: .018, beads: 2 });
    return {
      update(movement, state, shift) {
        const proved = state.variant !== 'unproved';
        output.position.z = .25 + shift;
        detectorRod.position.z = .75 * shift - .03;
        gear.rotation.x = proved ? movement * 1.4 : (state.phase || 0) * .7;
        lock.position.x = proved ? 0 : .12;
        indicator.material = proved ? cueMaterial : warningMaterial;
        cues.visible = Boolean(state.signals) && state.exploded < .15;
        request(state.phase || 0); feedback(proved ? state.phase || 0 : 0);
      },
    };
  }

  function turnoutView() {
    const single = group(root, 'single-turnout');
    const assembly = makeSwitch(single, { drive: true });
    const train = wheelset(single, [-2.7, assembly.railY + railHeight + .42, 0], { detail: false });
    const routes = group(single, 'illustrative-running-path');
    const straightCue = group(routes, 'straight-path');
    const divergingCue = group(routes, 'diverging-path');
    tube(straightCue, points(-6.35, 6.35, 0, 1.075, 2), .025, cueMaterial, { segments: 10 });
    tube(divergingCue, points(-6.35, 6.35, assembly.diverge, 1.075, 35), .025, M.yellow, { segments: 32 });
    const crossover = part(root, 'track-crossover'); crossover.scale.setScalar(.49); crossover.position.z = 1.25;
    supportBox(crossover, [29, .23, 9], M.deck, [0, -.01, 0]);
    layer(crossover, 'track-ballast', [28.8, .42, 8.7], [0, .31, 0], aggregate[2]);
    const left = group(crossover, 'first-turnout', [-7.3, 0, -3.1]);
    const right = group(crossover, 'second-turnout', [7.3, 0, 3.1]); right.rotation.y = Math.PI;
    const a = makeSwitch(left, { small: true }), b = makeSwitch(right, { small: true });
    const connecting = part(crossover, 'track-closure-rail');
    for (const side of [-1, 1]) {
      rail(connecting, points(-.50, .50, side * gauge, .72, 2));
      rail(connecting, points(-14.1, .50, 3.1 + side * gauge, .72, 2));
      rail(connecting, points(-.50, 14.1, -3.1 + side * gauge, .72, 2));
    }
    for (let x = -13.5; x < 14; x += 1.1) {
      if (x > -.1) sleeper(crossover, x, .68, 2.72, -3.1);
      if (x < .1) sleeper(crossover, x, .68, 2.72, 3.1);
    }
    const linkCue = group(crossover, 'complete-crossover-path');
    const linkPoints = [...points(-6.3, 6.8, a.diverge, 1.10, 28).map(p => [p[0] - 7.3, p[1], p[2] - 3.1]),
      ...points(6.8, -6.3, b.diverge, 1.10, 28).map(p => [7.3 - p[0], p[1], 3.1 - p[2]])];
    tube(linkCue, linkPoints, .05, cueMaterial, { segments: 52 });
    registerAnimator(state => {
      const cross = state.variant === 'crossover', divergent = state.variant === 'diverging';
      single.visible = !cross; crossover.visible = cross;
      assembly.update(divergent ? 1 : 0, state); a.update(1, state); b.update(1, state);
      routes.visible = Boolean(state.signals) && state.exploded < .2;
      straightCue.visible = !divergent; divergingCue.visible = divergent;
      linkCue.visible = Boolean(state.signals);
      const x = -5.7 + ((state.phase || 0) / 9 + .28) % 1 * 11.4;
      train.root.position.x = x; train.root.position.z = divergent ? assembly.diverge(x) : 0;
      const tangent = divergent ? (assembly.diverge(x + .015) - assembly.diverge(x - .015)) / .03 : 0;
      train.root.rotation.y = -Math.atan(tangent);
      train.wheels.forEach(w => { w.rotation.z = -x / train.radius; });
    });
  }

  function driveView() {
    // The shortened view shares the switch's rail-contact relationships but
    // does not construct the distant crossing or a second full scene.
    const railY = .84, toe = -2.75, heel = 2.25;
    layer(root, 'track-turnout', [7.2, .25, 5.0], [0, .19, -.65], concreteEdge, { cut: true });
    layer(root, 'track-ballast', [7.05, .30, 4.8], [0, .46, -.65], aggregate[2], { cut: true });
    const stock = part(root, 'track-stock-rail');
    rail(stock, points(-3.3, 3.3, -gauge, railY, 2));
    const centerline = x => .57 * smooth((x - toe) / (heel - toe));
    const outer = x => offsetAtWorldX(x, centerline, gauge, railY, -3.3, 3.3);
    rail(stock, offsetPoints(-3.3, 3.3, centerline, gauge, railY, 28));
    for (let x = -3.05; x < 3.3; x += .75) {
      const upper = outer(x), d = upper.point[2] - gauge;
      sleeper(root, x, .80, 2.8 + d, d / 2, false);
      if (x > -.4) {
        seat(root, x, -gauge, railY, { detailed: false, lifted: false });
        const upperSeat = seat(root, x, upper.point[2], railY, { detailed: false, lifted: false });
        upperSeat.rotation.y = -Math.atan((centerline(upper.parameter + .01) - centerline(upper.parameter - .01)) / .02);
      }
    }
    const blades = part(root, 'track-switch-rail');
    const bladePath = (side, movement) => Array.from({ length: 29 }, (_, i) => {
      const x = mix(toe, 3.3, i / 28);
      const t = clamp((x - toe) / (heel - toe)), f = (1 - t) ** 2;
      if (side < 0) {
        const p = offsetPoint(x, centerline, -gauge, railY); p[2] += mix(.29, .078, movement) * f;
        return p;
      }
      return [x, railY, gauge - mix(.078, .29, movement) * f];
    });
    const taper = t => .065 + .935 * Math.min(1, t * 3);
    const bladeMeshes = [-1, 1].map(side => rail(blades, bladePath(side, 1), { taper }));
    const bar = part(root, 'track-stretcher', [-2.35, railY + .005, 0]);
    box(bar, [.11, .065, 1.5], M.core, [0, -.035, 0]);
    box(bar, [.145, .08, .18], insulator, [0, -.035, 0]);
    for (const side of [-1, 1]) {
      box(bar, [.18, .12, .14], M.steel, [0, -.005, side * .73]);
      bolt(bar, [0, .072, side * .73], .033);
    }
    const machine = pointMachine(root, [-2.35, .59, -2.05]);
    const contactCue = group(root, 'blade-contact-markers');
    const closedDot = mesh(contactCue, new THREE.SphereGeometry(.055, 10, 6), cueMaterial, [-2.64, 1.20, -.82]);
    const openDot = mesh(contactCue, new THREE.SphereGeometry(.055, 10, 6), warningMaterial, [-2.64, 1.20, .68]);
    let last = -1;
    registerAnimator(state => {
      const unproved = state.variant === 'unproved';
      const movement = unproved ? .50 + .045 * Math.sin((state.phase || 0) * .8) : 1;
      if (Math.abs(movement - last) > .0001) {
        bladeMeshes.forEach((b, i) => b.update(bladePath(i ? 1 : -1, movement)));
        bar.position.z = mix(.106, -.106, movement) * .8464; last = movement;
      }
      machine.update(movement, state, bar.position.z);
      contactCue.visible = Boolean(state.signals);
      closedDot.material = unproved ? warningMaterial : cueMaterial;
      closedDot.position.z = -gauge + mix(.29, .078, movement);
      openDot.position.z = gauge - mix(.078, .29, movement);
    });
  }

  function interruptedRail(parent, x0, x1, zFn, railY, breaks, clearance = .16) {
    let from = x0;
    for (const center of [...breaks].sort((a, b) => a - b)) {
      const until = center - clearance;
      if (until > from) rail(parent, points(from, until, zFn, railY, 6));
      from = center + clearance;
    }
    if (from < x1) rail(parent, points(from, x1, zFn, railY, 6));
  }

  function crossingView() {
    const variants = {}, railY = .86;
    const frog = variants.frog = group(root, 'frog-and-opposite-check-rail');
    layer(frog, 'track-turnout', [8.1, .28, 6.7], [0, .21, 1.23], concreteEdge, { cut: true });
    layer(frog, 'track-ballast', [7.95, .30, 6.5], [0, .48, 1.23], aggregate[2], { cut: true });
    const running = part(frog, 'running-rail');
    rail(running, points(-3.75, 3.75, -gauge, railY, 2));
    const k = .40;
    const branchSpacing = 2 * gauge * Math.hypot(1, k);
    const theta = Math.atan(k) / 2, span = 1.35;
    interruptedRail(running, -3.75, 3.75, gauge, railY, [0], span / Math.cos(theta));
    interruptedRail(running, -3.75, 3.75, x => gauge + k * x, railY, [0], span * Math.cos(2 * theta) / Math.cos(theta));
    rail(running, points(-3.75, 3.75, x => gauge + branchSpacing + k * x, railY, 2));
    const core = crossingCore(frog, [0, railY, gauge], { angle: k, span });
    explode(core, [0, .50, 0]);
    const check = part(frog, 'track-check-rail');
    rail(check, [[-1.62, railY, -.65], [-1.17, railY, -.756], [1.17, railY, -.756], [1.62, railY, -.65]], { section: checkSection });
    for (const x of [-1.08, 0, 1.08]) {
      box(check, [.18, .09, .23], M.core, [x, railY + .035, -.79]);
      bolt(check, [x, railY + .10, -.70], .03);
    }
    explode(check, [0, .35, -.20]);
    for (let x = -3.4; x < 3.6; x += .85) {
      const high = gauge + branchSpacing + k * x;
      sleeper(frog, x, railY - .04, high + gauge + .8, (high - gauge) / 2, false);
      if (Math.abs(x) > 1.25) {
        seat(frog, x, -gauge, railY, { detailed: false, lifted: false });
        seat(frog, x, gauge, railY, { detailed: false, lifted: false });
      }
    }
    const train = wheelset(frog, [-.24, railY + railHeight + .42, 0]);
    explode(train.root, [0, .85, 0]);
    const contact = group(frog, 'paired-wheel-contact-markers');
    const tread = mesh(contact, new THREE.SphereGeometry(.065, 10, 6), cueMaterial, [-.24, railY + railHeight + .015, gauge]);
    const back = mesh(contact, new THREE.SphereGeometry(.055, 10, 6), M.yellow, [-.24, railY + .24, -.80]);
    cueArrow(contact, [-.24, railY + .57, -.43], [-.24, railY + .25, -.80], C.yellow, .06);

    const diamond = variants.diamond = part(root, 'track-diamond-crossing');
    layer(diamond, 'track-slab', [8.4, .32, 7.7], [0, .19, 0], concreteEdge, { cut: true });
    const main = part(diamond, 'running-rail');
    const angle = .76, slope = Math.tan(angle), normal = Math.sqrt(1 + slope * slope);
    const intersections = [];
    for (const sideA of [-1, 1]) {
      const za = sideA * gauge;
      const xs = [-1, 1].map(sideB => (za - sideB * gauge * normal) / slope);
      interruptedRail(main, -3.75, 3.75, za, railY, xs);
      for (let i = 0; i < xs.length; i++) intersections.push([xs[i], za]);
    }
    for (const side of [-1, 1]) {
      const z = x => slope * x + side * gauge * normal;
      const ends = [-gauge, gauge].map(za => (za - side * gauge * normal) / slope);
      interruptedRail(main, -2.35, 2.35, z, railY, ends);
    }
    const frogs = part(diamond, 'track-frog');
    const guards = part(diamond, 'track-check-rail');
    explode(frogs, [0, .50, 0]); explode(guards, [0, .35, 0]);
    for (const [x, z] of intersections) {
      box(frogs, [.70, .07, .68], M.core, [x, railY - .02, z]);
      // Small tapered noses expose four distinct rail-intersection regions.
      // The gaps remain real voids rather than overlapping solid rail meshes.
      const n = group(frogs, 'diamond-crossing-nose', [x + .09, railY, z]);
      n.scale.set(.36, 1, .65); nose(n, .60, .35);
      for (const side of [-1, 1]) {
        rail(guards, [[x - .48, railY, z + side * .25], [x - .26, railY, z + side * .19], [x + .36, railY, z + side * .19]], { section: profile.map(([a, b]) => [a * .45, b * .92]) });
      }
    }
    for (let x = -3.4; x < 3.5; x += .85) for (const z of [-gauge, gauge]) {
      if (intersections.some(([ix, iz]) => Math.abs(x - ix) < .55 && Math.abs(z - iz) < .1)) continue;
      layer(diamond, 'track-plinth', [.60, .37, .84], [x, .535, z], concrete);
      seat(diamond, x, z, railY, { direct: true, detailed: false, lifted: false });
    }
    for (let x = -2.05; x < 2.2; x += .64) for (const side of [-1, 1]) {
      const z = slope * x + side * gauge * normal;
      if (intersections.some(([ix, iz]) => Math.hypot(x - ix, z - iz) < .58)) continue;
      const support = group(diamond, 'diagonal-direct-support', [x, 0, z]); support.rotation.y = -angle;
      layer(support, 'track-plinth', [.60, .37, .84], [0, .535, 0], concrete);
      seat(support, 0, 0, railY, { direct: true, detailed: false, lifted: false });
    }
    const diamondWheel = wheelset(diamond, [-.24, railY + railHeight + .42, 0], { detail: false });
    explode(diamondWheel.root, [0, .85, 0]);
    const through = group(diamond, 'separate-through-alignments');
    tube(through, points(-3.5, 3.5, 0, railY + .37, 2), .023, cueMaterial, { segments: 10 });
    tube(through, points(-2.35, 2.35, x => slope * x, railY + .37, 2), .023, M.signal, { segments: 10 });
    registerAnimator(state => {
      const active = applyVariants(variants, state.variant, 'frog');
      const x = -2.8 + (((state.phase || 0) / 8 + .457) % 1) * 5.6;
      train.root.position.x = x; diamondWheel.root.position.x = x;
      for (const w of [...train.wheels, ...diamondWheel.wheels]) w.rotation.z = -x / .42;
      tread.position.x = x; back.position.x = x;
      contact.visible = Boolean(state.signals) && active === 'frog' && Math.abs(x) < 1.3 && state.exploded < .15;
      through.visible = Boolean(state.signals) && state.exploded < .15;
      core.visible = true;
    });
  }

  if (id === 'track-support') supportView();
  else if (id === 'rail-fastening') fasteningView();
  else if (id === 'turnout') turnoutView();
  else if (id === 'switch-drive') driveView();
  else if (id === 'crossing') crossingView();
  return root;
}
