/* Original, generic teaching geometry. Positions, proportions and service routes
 * are illustrative. These scenes are neither a station design nor an operating
 * sequence, fire simulation, hydraulic calculation or electrical single-line. */
import { createCommunicationsAssemblies } from './communications-models.js';

export const STATION_VIEWS = {
  station: { camera: [23, 18, 25], target: [0, 2.8, 0], distance: 48 },
  'station-plant': { camera: [18, 13, 21], target: [0, 1.4, 0], distance: 36 },
  'tunnel-ventilation': { camera: [15, 12, 18], target: [0, 2.1, 0], distance: 34 },
  'ventilation-unit': { camera: [8, 6, 9], target: [0, 1.65, 0], distance: 18 },
  'station-networks': { camera: [18, 13, 22], target: [0, 1.3, .7], distance: 38 },
  'fire-systems': { camera: [17, 11, 20], target: [0, 1.3, 0], distance: 34 },
};

const VARIANTS = {
  station: ['all', 'passenger', 'equipment'],
  'station-plant': ['electrical', 'air', 'water'],
  'tunnel-ventilation': ['normal', 'smoke-objective'],
  'ventilation-unit': ['fan', 'damper', 'air-handler'],
  'station-networks': ['power', 'station', 'building'],
  'fire-systems': ['detect', 'notify', 'water'],
};

export function buildStationView(id, api) {
  if (!STATION_VIEWS[id]) return null;
  const { THREE, C, M, mat, startModel, group, part, mesh, box,
    cylinder, torus, tube, roundedPanel, explode, shell, makeTrack,
    registerAnimator } = api;
  const root = startModel(id);
  const comms = createCommunicationsAssemblies(api);
  const animations = [], routes = [], alternatives = [];
  const paint = {
    concrete: mat(0x6c7b81, .9, .02), floor: mat(0xb8c2bf, .85, .02),
    wall: mat(0xd8dcd2, .75, .05), trim: mat(0x607887, .55, .3),
    black: mat(0x142733, .65, .15), green: mat(0x76c6a3, .5, .15),
    fire: mat(0xd87b63, .5, .15), water: mat(0x519ada, .5, .3),
    air: mat(0x96c9d8, .65, .1), pale: mat(0xe4e8dd, .5, .1),
  };
  const routeColors = { power: C.positive, data: C.signal, air: 0xa8def0, water: 0x5aa9ef, event: 0xf39e87 };
  const metalInside = new THREE.MeshStandardMaterial({ color: 0x8a9ba4, roughness: .45, metalness: .65, side: THREE.DoubleSide });
  const variant = state => VARIANTS[id].includes(state.variant) ? state.variant : VARIANTS[id][0];
  const slab = (parent, w, d, at = [0, 0, 0]) => {
    const g = group(parent, 'equipment-plinth', at);
    box(g, [w, .14, d], M.deck, [0, -.02, 0]);
    const edge = box(g, [w + .1, .04, d + .1], M.edge, [0, -.12, 0]);
    // The SVG renderer has no depth buffer. All foundation polygons must be
    // behind equipment, including the thin edge plate of this plinth.
    edge.renderOrder = -110;
    return g;
  };
  const diode = (parent, at, color = C.service) => cylinder(parent, .027, .02,
    new THREE.MeshBasicMaterial({ color }), at, [Math.PI / 2, 0, 0], 8);
  function screen(parent, w, h, at, color = C.signal, pattern = 'rows') {
    const g = group(parent, 'abstract-status-display', at);
    roundedPanel(g, w, h, .055, paint.black, [0, 0, 0], .045);
    box(g, [w * .87, h * .78, .014], M.glass, [0, 0, .035]);
    const ink = new THREE.MeshBasicMaterial({ color });
    if (pattern === 'power') {
      box(g, [w * .7, .018, .009], ink, [0, .02, .05]);
      for (const x of [-.27, 0, .27]) {
        box(g, [.018, h * .48, .009], ink, [x * w, -.06, .05]);
        box(g, [.075, .075, .014], paint.pale, [x * w, -.02, .057]);
      }
    } else {
      for (let row = 0; row < 3; row++) {
        box(g, [w * (.65 - row * .13), .022, .014], ink, [-w * row * .065, h * .23 - row * h * .22, .05]);
        box(g, [.035, .035, .014], paint.green, [w * .33, h * .23 - row * h * .22, .052]);
      }
    }
    return g;
  }
  function route(parent, points, kind, showFor = null, options = {}) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const color = routeColors[kind], isAir = kind === 'air';
    const vertices = [];
    // Explicit segments remain dashed in both WebGL and SVG projection.
    for (let i = 0; i < 36; i++) {
      if ((kind === 'data' || kind === 'event') && i % 2) continue;
      vertices.push(curve.getPoint(i / 36), curve.getPoint((i + 1) / 36));
    }
    const line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(vertices),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: isAir ? .42 : .62, depthTest: false }));
    line.renderOrder = 15; parent.add(line);
    const marks = [];
    for (let i = 0; i < (isAir ? 3 : 4); i++) {
      const geometry = isAir ? new THREE.ConeGeometry(.075, .25, 6) :
        kind === 'data' || kind === 'event' ? new THREE.OctahedronGeometry(.06) : new THREE.SphereGeometry(.06, 6, 4);
      const mark = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, depthTest: false }));
      mark.renderOrder = 16; parent.add(mark); marks.push(mark);
    }
    routes.push({ curve, line, marks, kind, showFor, options });
    return line;
  }
  function pipes(parent, points, radius = .065, material = paint.water) {
    tube(parent, points, radius, material, { segments: 14 });
    for (const p of [points[0], points.at(-1)]) cylinder(parent, radius * 1.45, .04, M.steel, p, [Math.PI / 2, 0, 0], 12);
  }
  function room(parent, at, width, depth, height = 2.8) {
    const g = group(parent, 'illustrative-equipment-bay', at);
    box(g, [width, .13, depth], paint.floor, [0, .02, 0]);
    box(g, [width, .26, .12], paint.trim, [0, .18, -depth / 2]);
    box(g, [.13, height, depth], paint.wall, [-width / 2, height / 2, 0]);
    const cover = group(g, 'removable-room-shell');
    box(cover, [width, height, .12], paint.wall, [0, height / 2, -depth / 2]);
    box(cover, [width + .1, .1, depth + .1], paint.wall, [0, height, 0]);
    shell(cover); explode(cover, [0, 1.1, -.4]);
    return g;
  }
  function speaker(parent, at, scale = 1, component = 'station-pa') {
    return comms.speaker(parent, at, scale * .57, component).node;
  }
  function display(parent, at, scale = 1) {
    return comms.display(parent, at, scale * .69).node;
  }
  function cameraDevice(parent, at) {
    return comms.cameraDevice(parent, at, .43).node;
  }
  function helpPoint(parent, at) {
    return comms.helpPoint(parent, at, .59).node;
  }
  function accessDoor(parent, at) {
    const g = part(parent, 'access-controller', at);
    box(g, [1.23, 2.3, .12], paint.trim, [0, 1.15, 0]);
    box(g, [1.08, 2.15, .08], paint.pale, [0, 1.15, .075]);
    box(g, [.07, .28, .09], M.steel, [.37, 1.08, .16]);
    box(g, [.2, .34, .11], paint.black, [.83, 1.14, .09]);
    diode(g, [.83, 1.25, .15]);
    box(g, [.23, .08, .1], paint.black, [.37, 2.23, .12]);
    box(g, [.11, .08, .1], M.steel, [.13, 2.23, .12]);
    return g;
  }
  function emergencyLight(parent, at) {
    const g = part(parent, 'emergency-lighting', at);
    box(g, [.65, .24, .18], paint.pale);
    box(g, [.54, .15, .015], paint.green, [0, 0, .1]);
    // Neutral geometric wayfinding mark: this is not a real evacuation direction.
    box(g, [.12, .09, .014], paint.pale, [0, 0, .112]);
    for (const x of [-.24, .24]) cylinder(g, .09, .07, paint.pale, [x, -.21, .04], [Math.PI / 2, 0, 0], 10);
    return g;
  }
  function detector(parent, at) {
    const g = part(parent, 'fire-detector', at);
    cylinder(g, .17, .065, paint.pale, [0, 0, 0], null, 12);
    cylinder(g, .12, .07, M.edge, [0, -.055, 0], null, 12);
    for (let i = 0; i < 6; i++) box(g, [.025, .055, .025], paint.pale, [Math.cos(i * Math.PI / 3) * .12, -.05, Math.sin(i * Math.PI / 3) * .12]);
    return g;
  }
  function sensor(parent, at, duct = false) {
    const g = part(parent, 'bas-sensor', at);
    box(g, [.24, .32, .13], paint.pale);
    for (let i = 0; i < 3; i++) box(g, [.14, .015, .015], paint.black, [0, .06 - i * .045, .075]);
    if (duct) cylinder(g, .02, .55, M.steel, [0, -.35, 0], null, 8);
    return g;
  }
  function firePanel(parent, at = [0, 0, 0], scale = 1) {
    const g = part(parent, 'fire-panel', at); g.scale.setScalar(scale);
    g.userData.explorationAssembly = 'fire-panel';
    // Backplate and sides leave the modules visible after removing the door.
    box(g, [1.1, 1.65, .045], M.core, [0, .9, -.22]);
    for (const x of [-.55, .55]) box(g, [.045, 1.65, .46], M.core, [x, .9, 0]);
    const door = group(g, 'fire-panel-cover');
    box(door, [1.05, 1.59, .045], paint.fire, [0, .9, .27]);
    screen(door, .68, .43, [0, 1.25, .31], 0xedd4ab);
    for (const x of [-.27, -.09, .09, .27]) diode(door, [x, .87, .3], C.service);
    for (const x of [-.3, 0, .3]) box(door, [.12, .1, .025], paint.pale, [x, .61, .3]);
    shell(door); explode(door, [.9, .2, .7]);
    for (const x of [-.32, 0, .32]) {
      const module = group(g, x === 0 ? 'fire-panel-processor-module' : x < 0 ? 'fire-panel-input-module' : 'fire-panel-output-module', [x, 1.16, .05]);
      box(module, [.23, .64, .06], M.teal);
      for (let y = -.23; y < .28; y += .13) box(module, [.15, .05, .035], M.core, [0, y, .05]);
      explode(module, [x * .8, .2, .6]);
    }
    for (const x of [-.25, .25]) {
      const battery = group(g, 'fire-panel-battery', [x, .4, .03]);
      box(battery, [.37, .29, .25], paint.black);
      for (const bx of [-.11, .11]) box(battery, [.04, .035, .06], M.copper, [bx, .17, .02]);
      explode(battery, [x * .6, -.14, .65]);
    }
    tube(g, [[-.25, .59, .05], [0, .67, .12], [.25, .59, .05]], .018, M.copper, { segments: 8 });
    return g;
  }
  function basController(parent, at = [0, 0, 0], scale = 1) {
    const g = comms.rtuPanel(parent, at, 1, 'bas-controller').node;
    g.scale.set(.52 * scale, .44 * scale, .64 * scale);
    return g;
  }
  function networkSwitch(parent, at = [0, 0, 0], width = 1.38) {
    return comms.networkSwitch(parent, at, width).node;
  }
  function telecomRack(parent, at = [0, 0, 0], scale = 1, includeAudio = true) {
    const g = part(parent, 'telecom-rack', at); g.scale.setScalar(scale);
    for (const x of [-.8, .8]) for (const z of [-.42, .42]) box(g, [.06, 2.7, .07], M.steel, [x, 1.42, z]);
    for (const y of [.1, 2.78]) box(g, [1.67, .08, .95], M.core, [0, y, 0]);
    box(g, [1.52, .32, .77], paint.black, [0, .36, 0]);
    for (let x = -.61; x < .63; x += .18) box(g, [.105, .11, .025], M.steel, [x, .36, .405]);
    networkSwitch(g, [0, 1.94, 0]);
    const patch = part(g, 'fiber-backbone', [0, 2.42, 0]);
    box(patch, [1.38, .18, .7], paint.pale);
    for (let i = 0; i < 6; i++) {
      const x = -.52 + i * .21;
      box(patch, [.1, .06, .04], M.teal, [x, 0, .38]);
      tube(g, [[x, 2.4, .4], [x, 2.25, .65], [x + .06, 2.03, .42]], .014, M.signal, { segments: 8 });
    }
    const service = part(g, includeAudio ? 'station-pa' : 'station-scada');
    for (const y of [.82, 1.25, 1.6]) {
      box(service, [1.39, .27, .73], M.core, [0, y, 0]);
      for (let x = -.54; x < .3; x += .12) box(service, [.035, .17, .025], paint.black, [x, y, .385]);
      screen(service, .29, .13, [.44, y, .405], includeAudio ? C.positive : C.signal);
    }
    const side = group(g, 'rack-cover'); box(side, [.055, 2.65, .94], M.edge, [-.84, 1.43, 0]);
    box(side, [1.64, 2.65, .035], paint.black, [0, 1.43, -.49]);
    shell(side); explode(side, [-.6, .1, -.4]);
    return g;
  }
  function transformer(parent, at = [0, 0, 0], scale = 1) {
    const g = part(parent, 'station-transformer', at); g.scale.setScalar(scale);
    box(g, [2.35, .17, 1.65], M.steel, [0, .18, 0]);
    for (const y of [.43, 1.85]) box(g, [1.93, .22, .7], M.core, [0, y, 0]);
    for (const x of [-.65, 0, .65]) {
      box(g, [.23, 1.25, .47], M.core, [x, 1.14, 0]);
      for (let y = .63; y <= 1.71; y += .12) {
        const winding = mesh(g, torus(.29, .042, 5, 14), M.copper, [x, y, 0], [Math.PI / 2, 0, 0]); winding.scale.z = .84;
      }
      for (const z of [-.42, .42]) {
        cylinder(g, .075, .28, paint.pale, [x, 2.09, z], null, 10);
        cylinder(g, .095, .045, M.steel, [x, 2.25, z], null, 10);
      }
    }
    for (const x of [-.95, .95]) box(g, [.12, 1.88, .11], M.steel, [x, 1.12, .5]);
    const cover = group(g, 'transformer-enclosure');
    box(cover, [2.5, .08, 1.83], paint.pale, [0, 2.48, 0]);
    for (const x of [-1.23, 1.23]) box(cover, [.055, 2.24, 1.8], paint.pale, [x, 1.32, 0]);
    for (let x = -1.05; x < 1.1; x += .15) box(cover, [.035, 1.9, .04], M.steel, [x, 1.33, -.91]);
    shell(cover); explode(cover, [0, 1.25, 0]);
    return g;
  }
  function switchboard(parent, at = [0, 0, 0], scale = 1) {
    const g = part(parent, 'auxiliary-switchboard', at); g.scale.setScalar(scale);
    for (let i = 0; i < 3; i++) {
      const x = -1 + i;
      box(g, [.93, 2.1, .68], M.core, [x, 1.13, 0]);
      for (const bx of [-.22, 0, .22]) box(g, [.045, 1.65, .035], M.copper, [x + bx, 1.18, .36]);
      for (const y of [.62, 1.19, 1.72]) {
        box(g, [.65, .3, .15], paint.black, [x, y, .43]);
        box(g, [.1, .16, .045], paint.trim, [x, y, .53]);
      }
      const door = group(g, 'distribution-panel-cover');
      box(door, [.89, 2.04, .045], paint.pale, [x, 1.13, .57]);
      screen(door, .48, .25, [x, 1.76, .61], C.positive, 'power');
      box(door, [.035, .21, .045], paint.black, [x + .34, 1.05, .62]);
      shell(door); explode(door, [0, 0, .75]);
    }
    box(g, [2.76, .055, .045], M.copper, [0, 2.02, .39]);
    box(g, [2.76, .045, .035], paint.green, [0, .25, .39]);
    return g;
  }
  function ups(parent, at = [0, 0, 0], scale = 1) {
    const g = part(parent, 'station-ups', at); g.scale.setScalar(scale);
    for (const x of [-.58, .58]) box(g, [1.05, 1.9, .86], M.core, [x, 1.02, 0]);
    for (let i = 0; i < 3; i++) {
      const y = .52 + i * .48;
      box(g, [.82, .31, .57], paint.pale, [-.58, y, .2]);
      for (let x = -.86; x < -.3; x += .1) box(g, [.035, .24, .04], M.steel, [x, y, .51]);
      for (let j = 0; j < 3; j++) {
        box(g, [.25, .3, .56], paint.black, [.28 + j * .3, y, .19]);
        box(g, [.15, .06, .025], paint.air, [.28 + j * .3, y + .04, .49]);
      }
    }
    const doors = group(g, 'ups-covers');
    for (const x of [-.58, .58]) { box(doors, [1.01, 1.84, .035], paint.pale, [x, 1.02, .56]); screen(doors, .49, .3, [x, 1.64, .6], C.service); }
    shell(doors); explode(doors, [0, .15, .75]);
    return g;
  }
  function pump(parent, at = [0, 0, 0], scale = 1) {
    const g = part(parent, 'fire-pump', at); g.scale.setScalar(scale);
    box(g, [2.8, .17, 1.45], M.steel, [0, .15, 0]);
    for (const x of [-1.1, .95]) for (const z of [-.5, .5]) box(g, [.25, .26, .22], M.core, [x, .25, z]);
    const motor = group(g, 'pump-motor', [-.72, .69, 0]);
    cylinder(motor, .36, .95, M.teal, [0, 0, 0], [0, 0, Math.PI / 2], 16);
    for (let i = 0; i < 10; i++) {
      const theta = i * Math.PI / 5;
      box(motor, [.85, .045, .14], M.steel, [0, Math.cos(theta) * .34, Math.sin(theta) * .34], [theta, 0, 0]);
    }
    cylinder(g, .08, .65, M.steel, [.08, .69, 0], [0, 0, Math.PI / 2], 10);
    const hydraulic = group(g, 'pump-hydraulic-section', [.65, .69, 0]);
    cylinder(hydraulic, .48, .32, paint.fire, [0, 0, 0], [0, 0, Math.PI / 2], 18);
    const front = group(hydraulic, 'pump-cover'); cylinder(front, .46, .08, paint.fire, [.23, 0, 0], [0, 0, Math.PI / 2], 18);
    shell(front); explode(front, [.65, .1, .2]);
    const impeller = group(hydraulic, 'pump-impeller', [.22, 0, 0]);
    cylinder(impeller, .31, .025, M.copper, [0, 0, 0], [0, 0, Math.PI / 2], 16);
    for (let i = 0; i < 6; i++) box(impeller, [.035, .21, .055], M.steel, [.03, Math.cos(i * Math.PI / 3) * .18, Math.sin(i * Math.PI / 3) * .18], [i * Math.PI / 3, 0, 0]);
    // Mechanical motion is a cutaway demonstration, never an alarm-driven start.
    animations.push(state => { impeller.rotation.x = id === 'station-plant' && variant(state) !== 'water' ? 0 : state.phase * .7; });
    pipes(g, [[1.18, .69, 0], [1.7, .69, 0], [1.9, .7, .8]], .11);
    pipes(g, [[.65, 1.05, 0], [.65, 1.65, 0], [1.5, 1.68, 0]], .11);
    cylinder(g, .17, .07, paint.pale, [.98, 1.83, .05], [Math.PI / 2, 0, 0], 12);
    box(g, [.016, .11, .013], paint.black, [.98, 1.83, .1], [0, 0, -.6]);
    const valve = group(g, 'fire-water-valve', [1.48, 1.68, 0]);
    box(valve, [.2, .24, .24], M.steel); cylinder(valve, .025, .3, M.steel, [0, .24, 0], null, 8);
    mesh(valve, torus(.16, .025, 4, 12), paint.fire, [0, .42, 0], [Math.PI / 2, 0, 0]);
    box(g, [.52, 1.03, .32], paint.fire, [-1.72, .61, -.23]);
    screen(g, .34, .22, [-1.72, .86, -.05], C.service);
    return g;
  }
  function sprinkler(parent, at = [0, 0, 0], scale = 1) {
    const g = part(parent, 'sprinkler-system', at); g.scale.setScalar(scale);
    cylinder(g, .065, .16, M.steel, [0, 0, 0], null, 10);
    for (const x of [-.1, .1]) box(g, [.028, .22, .035], M.copper, [x, -.16, 0]);
    cylinder(g, .027, .16, paint.fire, [0, -.15, 0], null, 8);
    cylinder(g, .15, .025, M.copper, [0, -.3, 0], null, 12);
    for (let i = 0; i < 6; i++) box(g, [.022, .025, .11], M.steel, [Math.cos(i * Math.PI / 3) * .105, -.3, Math.sin(i * Math.PI / 3) * .105], [0, -i * Math.PI / 3, 0]);
    return g;
  }
  function axialFan(parent, at = [0, 0, 0], scale = 1, rotation = [0, 0, 0]) {
    const g = part(parent, 'tunnel-fan', at); g.scale.setScalar(scale); g.rotation.set(...rotation);
    g.userData.explorationAssembly = 'tunnel-fan';
    const radius = .95, depth = 1.2;
    for (const z of [-depth / 2, depth / 2]) mesh(g, torus(radius, .075, 5, 20), M.steel, [0, 0, z]);
    const housing = group(g, 'fan-casing');
    mesh(housing, new THREE.CylinderGeometry(radius, radius, depth, 20, 1, true), metalInside, [0, 0, 0], [Math.PI / 2, 0, 0]);
    shell(housing); explode(housing, [0, 1.1, .25]);
    for (const x of [-.73, .73]) box(g, [.12, 1.16, .13], M.core, [x, -.59, -.25]);
    box(g, [2.1, .14, 1.8], M.steel, [0, -1.13, -.3]);
    cylinder(g, .08, 1.9, M.steel, [0, 0, -.52], [Math.PI / 2, 0, 0], 10);
    const rotor = group(g, 'axial-impeller', [0, 0, .25]);
    cylinder(rotor, .24, .29, M.steel, [0, 0, 0], [Math.PI / 2, 0, 0], 16);
    const shape = new THREE.Shape();
    shape.moveTo(.18, -.07); shape.lineTo(.8, -.14); shape.lineTo(.86, .16); shape.lineTo(.27, .14); shape.closePath();
    const bladeGeometry = new THREE.ExtrudeGeometry(shape, { depth: .045, bevelEnabled: false });
    for (let i = 0; i < 7; i++) mesh(rotor, bladeGeometry, paint.air, [0, 0, 0], [.18, 0, i * Math.PI * 2 / 7]);
    explode(rotor, [0, 0, 1.0]);
    animations.push(state => { rotor.rotation.z = state.phase * .85; });
    const motor = group(g, 'fan-drive-motor', [0, 0, -1.22]);
    cylinder(motor, .37, .8, M.teal, [0, 0, 0], [Math.PI / 2, 0, 0], 16);
    for (let i = 0; i < 10; i++) {
      const theta = i * Math.PI / 5;
      box(motor, [.06, .13, .72], M.steel, [Math.cos(theta) * .35, Math.sin(theta) * .35, 0], [0, 0, theta]);
    }
    for (const z of [-.68, -.92]) {
      cylinder(g, .18, .16, paint.pale, [0, 0, z], [Math.PI / 2, 0, 0], 12);
      box(g, [.4, .52, .22], M.core, [0, -.36, z]);
    }
    explode(motor, [0, 0, -.7]);
    return g;
  }
  function damper(parent, at = [0, 0, 0], scale = 1, rotation = [0, 0, 0]) {
    const g = part(parent, 'tunnel-damper', at); g.scale.setScalar(scale); g.rotation.set(...rotation);
    g.userData.explorationAssembly = 'tunnel-damper';
    for (const x of [-1.2, 1.2]) box(g, [.13, 1.8, .53], M.steel, [x, 0, 0]);
    for (const y of [-.85, .85]) box(g, [2.5, .13, .53], M.steel, [0, y, 0]);
    const blades = [];
    for (let i = 0; i < 6; i++) {
      const y = -.68 + i * .27;
      const blade = group(g, 'damper-blade', [0, y, 0]);
      box(blade, [2.27, .265, .05], paint.air);
      cylinder(blade, .035, 2.48, M.steel, [0, 0, 0], [0, 0, Math.PI / 2], 8);
      box(blade, [.07, .21, .045], M.core, [1.28, .06, 0]);
      explode(blade, [0, 0, .55 + i * .13]);
      blades.push(blade);
    }
    box(g, [.055, 1.6, .07], M.copper, [1.35, 0, .12]);
    const actuator = part(g, 'bas-actuator', [1.55, -.1, 0]);
    actuator.userData.explorationAssembly = 'bas-actuator';
    const casework = group(actuator, 'damper-actuator-cover');
    box(casework, [.45, .57, .4], paint.fire); shell(casework); explode(casework, [.55, .35, 0]);
    const reduction = group(actuator, 'damper-actuator-reduction');
    for (const [y, r] of [[-.08, .13], [.12, .075]]) {
      cylinder(reduction, r, .09, M.copper, [0, y, 0], [0, 0, Math.PI / 2], 14);
      cylinder(reduction, .025, .2, M.steel, [0, y, 0], [0, 0, Math.PI / 2], 8);
    }
    explode(reduction, [.6, 0, .4]);
    cylinder(actuator, .08, .3, M.steel, [-.3, 0, 0], [0, 0, Math.PI / 2], 10);
    box(g, [.28, .22, .2], paint.pale, [1.49, .59, .07]);
    diode(g, [1.49, .61, .185]);
    animations.push(state => {
      // A mechanism demonstration only. Smoke-objective never prescribes a
      // different damper position or an emergency command hierarchy.
      const opening = id === 'ventilation-unit' ? .65 + .25 * Math.sin(state.phase * .4) : .95;
      blades.forEach((blade, i) => { blade.rotation.x = opening * (i % 2 ? -1 : 1); });
    });
    return g;
  }
  function airHandler(parent, at = [0, 0, 0], scale = 1) {
    const g = part(parent, 'hvac-air-handler', at); g.scale.setScalar(scale);
    g.userData.explorationAssembly = 'hvac-air-handler';
    box(g, [5.6, .13, 1.75], M.steel, [0, .2, 0]);
    for (const x of [-2.7, -1.38, -.15, 1.3, 2.7]) {
      for (const z of [-.82, .82]) box(g, [.055, 1.85, .06], M.steel, [x, 1.18, z]);
      box(g, [.06, .06, 1.68], M.steel, [x, 2.1, 0]);
    }
    const panels = group(g, 'air-handler-covers');
    box(panels, [5.5, .07, 1.7], paint.pale, [0, 2.14, 0]);
    box(panels, [5.5, 1.82, .055], paint.pale, [0, 1.18, -.85]);
    box(panels, [5.5, 1.82, .055], paint.pale, [0, 1.18, .85]);
    shell(panels); explode(panels, [0, 1.2, -.25]);
    const inlet = group(g, 'air-handler-inlet-damper', [-2.43, 1.2, 0]);
    for (let y = -.6; y <= .61; y += .3) box(inlet, [.075, .23, 1.4], paint.trim, [0, y, 0], [0, 0, -.45]);
    const filter = group(g, 'air-filter-section', [-.91, 1.2, 0]);
    box(filter, [.16, 1.5, 1.44], paint.pale);
    for (let z = -.65; z < .67; z += .13) box(filter, [.18, 1.33, .035], paint.air, [0, 0, z]);
    explode(filter, [0, .2, 1.5]);
    const coil = group(g, 'air-handler-coil', [.49, 1.2, 0]);
    for (let x = -.28; x < .29; x += .08) box(coil, [.025, 1.45, 1.4], M.aluminum, [x, 0, 0]);
    for (const y of [-.55, -.18, .18, .55]) cylinder(coil, .045, 1.48, M.copper, [0, y, 0], [Math.PI / 2, 0, 0], 8);
    explode(coil, [0, .2, -1.55]);
    pipes(g, [[.5, .62, .72], [.5, .62, 1.2], [1.4, .62, 1.2]], .055);
    pipes(g, [[.5, 1.77, .72], [.5, 1.77, 1.2], [1.4, 1.77, 1.2]], .055, M.copper);
    const actuator = part(g, 'bas-actuator', [1.05, 1.77, 1.2]);
    box(actuator, [.3, .27, .3], paint.fire, [0, .17, 0]);
    const rotor = group(g, 'supply-air-impeller', [1.98, 1.18, 0]);
    cylinder(rotor, .52, .7, M.core, [0, 0, 0], [0, 0, Math.PI / 2], 16);
    for (let i = 0; i < 10; i++) {
      const t = i * Math.PI / 5;
      box(rotor, [.78, .1, .12], M.steel, [0, Math.cos(t) * .47, Math.sin(t) * .47], [t, 0, 0]);
    }
    cylinder(rotor, .13, .86, paint.air, [0, 0, 0], [0, 0, Math.PI / 2], 12);
    explode(rotor, [.65, .3, 1.1]);
    animations.push(state => { rotor.rotation.x = state.phase * .7; });
    sensor(g, [.56, 2.31, 0], true);
    return g;
  }
  function duct(parent, at, size, component = 'station-hvac') {
    const g = part(parent, component, at), [w, h, d] = size;
    // Three-sided duct makes the air volume legible in an unsectioned scene.
    box(g, [w, h, .045], paint.air, [0, 0, -d / 2]);
    box(g, [w, .045, d], M.steel, [0, -h / 2, 0]);
    const lid = group(g, 'duct-cover');
    box(lid, [w, .045, d], M.steel, [0, h / 2, 0]);
    box(lid, [w, h, .045], paint.air, [0, 0, d / 2]); shell(lid);
    return g;
  }
  function arch(parent, at, radius = 2, length = 1.4) {
    const g = group(parent, 'tunnel-portal', at), shape = new THREE.Shape();
    shape.moveTo(-radius, 0); shape.absarc(0, 0, radius, Math.PI, 0, true);
    shape.lineTo(radius - .2, 0); shape.absarc(0, 0, radius - .2, 0, Math.PI, false); shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false, curveSegments: 10 }); geo.translate(0, 0, -length / 2);
    mesh(g, geo, paint.concrete, [0, 0, 0], [0, Math.PI / 2, 0]);
    return g;
  }
  function stairFlight(parent, at, direction = -1, rise = 3.8, run = 6.4, width = 1.45) {
    const g = part(parent, 'station-egress', at), count = 16;
    for (let i = 0; i < count; i++) {
      const h = rise * (i + 1) / count, x = direction * (i + .5) * run / count;
      box(g, [run / count, h, width], paint.concrete, [x, h / 2, 0]);
      box(g, [run / count * .9, .035, width], paint.pale, [x, h + .02, 0]);
      if (i % 3 === 0) for (const z of [-width / 2, width / 2]) cylinder(g, .025, .9, M.steel, [x, h + .47, z], null, 8);
    }
    for (const z of [-width / 2, width / 2]) tube(g, [[0, .95, z], [direction * run, rise + .95, z]], .035, M.steel, { segments: 8, straight: true });
    return g;
  }
  function liftContext(parent, at) {
    const g = part(parent, 'station-egress', at);
    for (const x of [-.7, .7]) for (const z of [-.6, .6]) box(g, [.075, 5.4, .075], M.steel, [x, 2.7, z]);
    for (const y of [.12, 4.1, 5.4]) box(g, [1.6, .09, 1.38], M.core, [0, y, 0]);
    box(g, [1.2, .13, 1.08], paint.pale, [0, 1.85, 0]);
    box(g, [1.2, 1.95, .055], M.glass, [0, 2.86, -.53]);
    for (const x of [-.31, .31]) box(g, [.58, 1.9, .055], paint.pale, [x, 2.85, .56]);
    for (const x of [-.17, .17]) cylinder(g, .015, 1.45, M.steel, [x, 4.6, 0], null, 6);
    return g;
  }
  function contextTrain(parent, at = [0, 0, 0]) {
    const g = part(parent, 'carbody', at);
    box(g, [12, .17, 2.2], M.core, [0, 1.38, 0]);
    box(g, [11.9, .5, 2.2], paint.pale, [0, 1.72, 0]);
    const roof = group(g, 'context-car-roof'); box(roof, [11.8, .22, 2.2], paint.pale, [0, 3.45, 0]);
    shell(roof); explode(roof, [0, .9, 0]);
    for (const z of [-1.11, 1.11]) {
      box(g, [11.7, .11, .06], M.teal, [0, 1.95, z]);
      for (let i = 0; i < 7; i++) box(g, [.95, .86, .045], M.glass, [-4.9 + i * 1.63, 2.72, z]);
      for (const x of [-2.7, 2.7]) for (const dx of [-.3, .3]) {
        box(g, [.56, 1.66, .045], paint.pale, [x + dx, 2.37, z + .035 * Math.sign(z)]);
        box(g, [.37, .67, .02], M.glass, [x + dx, 2.73, z + .07 * Math.sign(z)]);
      }
    }
    for (const x of [-6, 6]) box(g, [.13, 1.85, 2.2], paint.pale, [x, 2.43, 0]);
    const bogies = part(g, 'bogie');
    for (const bx of [-4, 4]) {
      box(bogies, [2.4, .21, 1.25], M.teal, [bx, .93, 0]);
      for (const x of [-.8, .8]) for (const z of [-.72, .72]) cylinder(bogies, .365, .19, M.steel, [bx + x, .56, z], [Math.PI / 2, 0, 0], 18);
    }
    return g;
  }
  function operatorDesk(parent, at = [0, 0, 0], scale = 1) {
    const g = part(parent, 'occ-workstation', at); g.scale.setScalar(scale);
    box(g, [4.65, .13, 1.6], paint.pale, [0, 1.05, 0]);
    for (const x of [-1.9, 1.9]) box(g, [.13, 1, 1.24], M.core, [x, .52, 0]);
    for (const [i, concept] of ['power-scada', 'station-scada', 'plant-network'].entries()) {
      const x = -1.48 + i * 1.48, monitor = part(g, concept, [x, 1.77, -.35]);
      screen(monitor, 1.33, .85, [0, 0, 0], i === 0 ? C.positive : i === 1 ? C.signal : C.service, i === 0 ? 'power' : 'rows');
      box(monitor, [.07, .3, .07], M.core, [0, -.52, 0]);
      box(monitor, [.45, .04, .3], M.core, [0, -.66, .05]);
      box(g, [.7, .035, .28], paint.black, [x, 1.14, .37]);
    }
    box(g, [.48, .075, .38], M.core, [1.92, 1.17, .24]);
    tube(g, [[1.75, 1.25, .24], [1.65, 1.68, .24], [1.5, 1.75, .24]], .025, paint.black, { segments: 8 });
    box(g, [.9, .13, .85], M.teal, [0, .62, 1.25]);
    box(g, [.85, .85, .1], M.teal, [0, 1.1, 1.65]);
    cylinder(g, .06, .6, M.steel, [0, .3, 1.25], null, 10);
    return g;
  }

  if (id === 'station') {
    slab(root, 25.3, 12.5);
    for (const z of [-3.15, 3.15]) {
      const corridor = group(root, 'station-track-context', [0, .08, z]); corridor.scale.setScalar(.75);
      makeTrack(corridor, 32, { detail: false });
      if (z > 0) contextTrain(corridor, [-8, 0, 0]);
    }
    const platformBase = box(root, [23.6, 1.02, 4.6], paint.concrete, [0, .56, 0]); platformBase.renderOrder = -75;
    const platformTop = box(root, [23.6, .08, 4.6], paint.floor, [0, 1.11, 0]); platformTop.renderOrder = -70;
    for (const z of [-2.15, 2.15]) {
      box(root, [23.3, .018, .13], M.yellow, [0, 1.16, z]);
      for (let x = -11; x <= 11; x += .85) box(root, [.48, .022, .19], paint.pale, [x, 1.17, z - Math.sign(z) * .22]);
    }
    // Partial mezzanine leaves a central void and an open foreground platform.
    for (const x of [-7.9, 8.05]) {
      box(root, [7.4, .23, 3.9], paint.floor, [x, 5.06, -.25]);
      for (const dx of [-2.8, 2.8]) cylinder(root, .14, 3.78, paint.trim, [x + dx, 3.07, -1.55], null, 10);
      for (let dx = -3.5; dx <= 3.6; dx += 1) cylinder(root, .025, .91, M.steel, [x + dx, 5.64, 1.7], null, 8);
      tube(root, [[x - 3.7, 6.1, 1.7], [x + 3.7, 6.1, 1.7]], .035, M.steel, { straight: true, segments: 8 });
    }
    box(root, [9, .23, 1], paint.floor, [.2, 5.06, -1.75]);
    stairFlight(root, [2.2, 1.15, .82], -1, 3.81, 6.4, 1.4);
    liftContext(root, [4.4, 1.15, -.17]);
    const upperRooms = room(root, [8.3, 5.18, -1.55], 5.6, 2.5, 2.65);
    telecomRack(upperRooms, [-1.7, .13, -.25], .66);
    firePanel(upperRooms, [.2, .13, -.28], .75);
    basController(upperRooms, [1.6, .13, -.3], .68);
    accessDoor(root, [5.38, 5.2, -.3]).rotation.y = Math.PI / 2;
    duct(root, [1.25, 6.4, -1.3], [9.1, .43, .65]);
    for (const x of [-7.5, -.4, 7.4]) {
      speaker(root, [x, 3.7, -.1], .82);
      cameraDevice(root, [x + .55, 4.4, -.32]);
      emergencyLight(root, [x, 4.15, .43]);
      detector(root, [x - .4, 4.27, -.5]);
    }
    display(root, [-6.8, 3.6, .75]); display(root, [6.3, 3.6, .75]);
    display(root, [-8.5, 6.78, .7], .85);
    helpPoint(root, [-9.1, 1.15, 1.65]); helpPoint(root, [8.8, 1.15, 1.65]);
    sensor(root, [6, 6.45, -.15]);
    for (const x of [-7.5, 7.3]) {
      box(root, [2.1, .12, .52], M.teal, [x, 1.7, -.52]);
      box(root, [2.1, .49, .06], M.teal, [x, 1.97, -.77]);
      for (const dx of [-.7, .7]) box(root, [.06, .5, .4], M.steel, [x + dx, 1.4, -.52]);
    }
    const egress = part(root, 'station-egress');
    for (const x of [-10.2, -9.25, -8.3]) {
      box(egress, [.25, .95, 1.15], paint.pale, [x, 5.68, -.2]);
      box(egress, [.29, .06, 1.18], M.teal, [x, 6.17, -.2]);
    }
    arch(root, [11.9, .08, -3.15], 1.98, 1.3);
    const shaft = part(root, 'tunnel-shaft', [10.6, 0, -5.4]);
    for (const x of [-.7, .7]) box(shaft, [.13, 7.5, 1.2], paint.concrete, [x, 3.75, 0]);
    box(shaft, [1.53, 7.5, .13], paint.concrete, [0, 3.75, -.6]);
    for (let y = 6.8; y < 7.45; y += .16) box(shaft, [1.25, .055, .16], paint.trim, [0, y, .61], [-.35, 0, 0]);
    const canopy = group(root, 'removable-station-canopy');
    for (const x of [-8.1, -.2, 7.7]) {
      box(canopy, [.12, .14, 6.1], M.steel, [x, 8.05, -.1]);
      for (const z of [-2.8, 2.8]) cylinder(canopy, .09, 2.9, M.steel, [x, 6.6, z], null, 10);
    }
    box(canopy, [23.7, .1, 2.1], paint.pale, [0, 8.22, -1.9]);
    shell(canopy); explode(canopy, [0, 1.2, 0]);
    route(root, [[6.7, 6.6, -1.25], [3, 6.6, -.75], [1, 4.4, .4], [-6.8, 3.7, .8]], 'data', ['all', 'passenger']);
    route(root, [[6.7, 6.2, -1.25], [9.7, 4.4, 1.7], [8.8, 2.4, 1.78]], 'data', ['all', 'passenger']);
    route(root, [[10.6, 7.2, -5.4], [10.6, 3.5, -5.4], [9.2, 2.5, -3.15]], 'air', ['all', 'equipment']);
    route(root, [[9.8, 6.2, -1.6], [7, 6.45, -1.2], [2, 6.4, -1.2], [-3, 6.4, -1.2]], 'air', ['equipment']);
  } else if (id === 'station-plant') {
    for (const x of [-6.8, 0, 6.8]) slab(root, 6.05, 5.9, [x, 0, 0]);
    transformer(root, [-8.25, .1, -1.2], .78);
    switchboard(root, [-5.5, .1, -1.35], .72);
    ups(root, [-7.55, .1, 1.3], .75);
    telecomRack(root, [-5.15, .1, 1.1], .72);
    const hvac = part(root, 'station-hvac');
    airHandler(hvac, [0, .1, -.25], .94);
    duct(hvac, [0, 2.6, -1.7], [4.8, .5, .73]);
    basController(root, [-1.65, .1, 1.85], .72);
    sensor(root, [.3, 2.97, -1.7], true);
    pump(root, [6.4, .1, -.2], .95);
    firePanel(root, [8.75, .12, -1.35], .8);
    const pipe = part(root, 'sprinkler-system');
    pipes(pipe, [[7.8, 1.7, -.2], [8, 2.35, -.2], [8, 3.45, -.2], [5, 3.45, -.2]], .07);
    for (const x of [5.2, 6.4, 7.6]) sprinkler(pipe, [x, 3.35, -.2]);
    route(root, [[-8.1, 1.95, -.85], [-6.85, 2.25, -.8], [-5.5, 1.8, -.8]], 'power', ['electrical']);
    route(root, [[-5.5, .6, -.7], [-6.7, .35, .6], [-7.55, 1.5, 1.85]], 'power', ['electrical']);
    route(root, [[-7.1, 1.3, 1.9], [-6.4, 1.9, 2.1], [-5.15, 1.9, 1.6]], 'power', ['electrical']);
    route(root, [[-2.8, 1.2, -.25], [-1.4, 1.2, -.25], [.5, 1.2, -.25], [2.8, 1.2, -.25]], 'air', ['air']);
    route(root, [[.3, 2.95, -1.7], [-.8, 3.1, .4], [-1.65, 1.2, 2]], 'data', ['air']);
    route(root, [[8.2, .8, .6], [7.3, .8, .05], [7.05, 1.5, -.2], [8, 3.4, -.2], [5.2, 3.4, -.2]], 'water', ['water'], { moving: false });
  } else if (id === 'tunnel-ventilation') {
    slab(root, 22, 12, [0, 0, 1.4]);
    makeTrack(root, 20, { detail: false });
    arch(root, [-9.1, .04, 0], 2.25, 1.1); arch(root, [9.1, .04, 0], 2.25, 1.1);
    for (const z of [-2.25, 2.25]) box(root, [18, .6, .16], paint.concrete, [0, .3, z]);
    const tunnelShell = group(root, 'tunnel-section-shell');
    box(tunnelShell, [17.7, .15, 3.8], paint.concrete, [0, 3.35, 0]); shell(tunnelShell); explode(tunnelShell, [0, 1.2, 0]);
    const shaft = part(root, 'tunnel-shaft', [3.25, 0, 5.1]);
    box(shaft, [.15, 7.1, 2.35], paint.concrete, [-1.1, 3.55, 0]);
    // An actual opening in the rear wall admits the branch duct. The near
    // side and front become removable faces, exposing the connected air volume.
    box(shaft, [2.35, 1.2, .15], paint.concrete, [0, .6, -1.18]);
    box(shaft, [2.35, 3.55, .15], paint.concrete, [0, 5.325, -1.18]);
    const shaftFace = group(shaft, 'shaft-front-cutaway');
    box(shaftFace, [2.35, 7.1, .15], paint.concrete, [0, 3.55, 1.18]);
    box(shaftFace, [.15, 7.1, 2.35], paint.concrete, [1.1, 3.55, 0]); shell(shaftFace);
    for (const z of [-1.18, 1.18]) box(shaft, [.07, 7.1, .07], M.steel, [1.1, 3.55, z]);
    for (let y = 6.2; y < 7.05; y += .19) box(shaft, [2.15, .06, .26], M.steel, [0, y, 1.26], [-.25, 0, 0]);
    slab(root, 4.3, 4.2, [3.25, 1.12, 3.4]);
    const branch = duct(root, [3.25, 2.42, 2.5], [5.25, 2.2, 2.2], 'tunnel-shaft'); branch.rotation.y = Math.PI / 2;
    axialFan(root, [3.25, 2.42, 3.1], 1.05);
    damper(root, [3.25, 2.42, 1.4], .85);
    sensor(root, [1.9, 3.7, 3.35], true);
    basController(root, [6.5, .15, 4], .85);
    const objective = part(root, 'smoke-control');
    const boundary = new THREE.Box3Helper(new THREE.Box3(new THREE.Vector3(-8, .4, -1.6), new THREE.Vector3(-4.1, 2.7, 1.6)), C.warning);
    boundary.material.depthTest = false; boundary.renderOrder = 14; objective.add(boundary);
    animations.push(state => { objective.visible = variant(state) === 'smoke-objective'; });
    route(root, [[-8.5, 1.4, .25], [-2, 1.7, .25], [3.25, 2.42, .35], [3.25, 2.42, 3.1], [3.25, 3.3, 5.1], [3.25, 7.5, 5.1]], 'air');
    route(root, [[1.9, 3.72, 3.3], [5.3, 4.2, 4.5], [6.5, 1.5, 4.2]], 'data', ['normal']);
    // No smoke propagation or changed fan command is generated by the objective overlay.
  } else if (id === 'ventilation-unit') {
    const fan = group(root, 'fan-mechanism-alternative'); slab(fan, 5.2, 5.6); axialFan(fan, [0, 1.8, .2], 1.45);
    const blades = group(root, 'damper-mechanism-alternative'); slab(blades, 6, 4.5); damper(blades, [-.35, 1.85, 0], 1.75);
    const ahu = group(root, 'air-handler-alternative'); slab(ahu, 7.2, 4.3); airHandler(ahu, [0, .12, 0], 1.15);
    alternatives.push({ node: fan, name: 'fan' }, { node: blades, name: 'damper' }, { node: ahu, name: 'air-handler' });
    for (const x of [-.6, .6]) route(fan, [[x, 1.9, -3.1], [x, 1.9, -.8], [x, 1.9, 1.6], [x, 1.9, 2.8]], 'air', ['fan']);
    route(blades, [[-.35, 1.85, -2.6], [-.35, 1.85, 0], [-.35, 1.85, 2.6]], 'air', ['damper']);
    route(ahu, [[-3.7, 1.5, 0], [-1.5, 1.5, 0], [1, 1.5, 0], [3.7, 1.5, 0]], 'air', ['air-handler']);
  } else if (id === 'station-networks') {
    slab(root, 22, 11, [0, 0, .5]);
    // The rear strip is physical equipment. The forward desk is an explicitly
    // remote operator vignette; these spacings are not an installed cable route.
    const leftBay = slab(root, 5.4, 3.7, [-7, .1, -2]);
    switchboard(leftBay, [-.9, .1, -.2], .65);
    const gateway = part(leftBay, 'power-scada', [1.55, .12, .15]);
    box(gateway, [.76, 1.35, .54], M.core, [0, .72, 0]);
    for (const y of [.4, .73, 1.06]) { box(gateway, [.62, .2, .12], paint.pale, [0, y, .3]); diode(gateway, [.21, y, .38], C.positive); }
    const middleBay = slab(root, 5.6, 3.7, [0, .1, -2]);
    telecomRack(middleBay, [-1.15, .1, 0], .85, false);
    const radio = part(middleBay, 'station-radio', [1.25, .1, 0]);
    box(radio, [.9, .85, .6], M.core, [0, .46, 0]);
    screen(radio, .58, .2, [0, .58, .33], C.service);
    cylinder(radio, .035, 1.3, M.steel, [0, 1.5, 0], null, 8);
    box(radio, [.17, .65, .12], paint.pale, [0, 1.85, .02]);
    const buildingBay = slab(root, 5.4, 3.7, [7, .1, -2]);
    basController(buildingBay, [-.8, .1, 0], .9);
    sensor(buildingBay, [1.35, 1.4, .15]);
    const actuator = part(buildingBay, 'bas-actuator', [1.35, .62, .15]);
    box(actuator, [.4, .32, .33], paint.fire); cylinder(actuator, .035, .48, M.steel, [0, -.31, 0], null, 8);
    const plant = part(buildingBay, 'plant-network');
    tube(plant, [[1.35, 1.4, .3], [.7, 1.6, .55], [-.8, 1.35, .3]], .016, M.signal, { segments: 12 });
    const fiber = part(root, 'fiber-backbone');
    tube(fiber, [[-7, .32, -.1], [0, .32, .25], [7, .32, -.1]], .045, paint.black, { segments: 18 });
    tube(fiber, [[0, .32, .25], [0, .32, 1.4], [0, .32, 2.3]], .04, M.signal, { segments: 10 });
    for (const x of [-.2, 0, .2]) cylinder(fiber, .045, .9, x ? paint.pale : M.signal, [x, .65, 1.15], [Math.PI / 2, 0, 0], 8);
    operatorDesk(root, [0, .12, 3.35], 1.16);
    route(root, [[-5.45, 1.15, -1.8], [-4.6, 2.25, 0], [-2.5, 2.55, 2], [-1.72, 2.15, 3]], 'data', ['power']);
    route(root, [[-1.15, 2.1, -1.7], [-.6, 2.6, .7], [0, 2.15, 3]], 'data', ['station']);
    route(root, [[1.25, 1.9, -2], [2.5, 2.7, .7], [0, 2.15, 3]], 'data', ['station']);
    route(root, [[8.35, 1.5, -1.7], [7, 1.9, -1.4], [6.2, 1.4, -1.7]], 'data', ['building']);
    route(root, [[6.2, 1.4, -1.7], [4.4, 2.6, .5], [1.72, 2.15, 3]], 'data', ['building']);
  } else if (id === 'fire-systems') {
    const flss = part(root, 'flss');
    for (const x of [-6.2, 0, 6.2]) slab(flss, 5.5, 5.7, [x, 0, 0]);
    firePanel(flss, [-6.9, .15, -.2], 1.2);
    const wall = group(flss, 'detection-room-section', [-4.85, 0, -.8]);
    box(wall, [.1, 3.4, 2.2], paint.wall, [-.3, 1.7, 0]);
    box(wall, [2.2, .1, 2.2], paint.wall, [-1.35, 3.4, 0]);
    detector(flss, [-5.7, 3.32, -.5]);
    const manual = part(flss, 'fire-detector', [-5.12, 1.45, .15]);
    box(manual, [.15, .4, .38], paint.fire); box(manual, [.02, .19, .22], paint.pale, [.09, 0, 0]);
    speaker(flss, [-.8, 2.5, -.4], 1.25, 'fire-notification');
    const visual = part(flss, 'fire-notification', [.45, 2.5, -.25]);
    box(visual, [.36, .43, .16], paint.fire); roundedPanel(visual, .25, .18, .06, paint.pale, [0, 0, .11], .03);
    helpPoint(flss, [1.2, .12, .35]); emergencyLight(flss, [-.2, 3.05, .3]);
    const support = group(flss, 'notification-post');
    for (const x of [-.8, 1.2]) box(support, [.09, 3.3, .09], M.steel, [x, 1.65, -.62]);
    box(support, [2.8, .08, .1], M.steel, [.1, 3.25, -.62]);
    pump(flss, [6, .15, -.2], 1.05);
    const sprinklerPipe = part(flss, 'sprinkler-system');
    pipes(sprinklerPipe, [[7.55, 1.9, -.2], [8, 2.1, -.2], [8, 3.6, -.2], [4.2, 3.6, -.2]], .085);
    for (const x of [4.5, 6, 7.5]) sprinkler(sprinklerPipe, [x, 3.48, -.2], 1.2);
    // Enlarged, closed thermal head makes the mechanism inspectable without
    // opening every head or implying that detection electrically trips it.
    sprinkler(flss, [5.2, 1.8, 1.85], 2.3);
    const egress = part(flss, 'station-egress');
    box(egress, [4.4, .045, .72], paint.floor, [0, .17, 1.85]);
    for (const x of [-1.75, 1.75]) cylinder(egress, .025, .85, M.steel, [x, .6, 2.21], null, 8);
    tube(egress, [[-1.75, 1.03, 2.21], [1.75, 1.03, 2.21]], .027, M.steel, { segments: 8 });
    route(flss, [[-5.7, 3.25, -.5], [-6.7, 3, .3], [-6.9, 1.6, .3]], 'event', ['detect']);
    route(flss, [[-5.03, 1.45, .17], [-6, 1.2, .7], [-6.9, 1.6, .3]], 'event', ['detect']);
    route(flss, [[-6.9, 1.6, .3], [-3.8, 2.5, .8], [-.8, 2.5, -.2]], 'event', ['notify']);
    route(flss, [[1.2, 1.5, .5], [2.1, 2.3, 1.2], [2.4, 2.8, 1.6]], 'data', ['notify']);
    route(flss, [[8, .9, .7], [6.65, .85, -.2], [6.65, 1.9, -.2], [8, 3.6, -.2], [4.5, 3.6, -.2]], 'water', ['water'], { moving: false });
  }

  // Give the viewer's first camera fit the same alternative that the initial
  // animation state will show, instead of fitting three superimposed mechanisms.
  alternatives.forEach(item => { item.node.visible = item.name === VARIANTS[id][0]; });
  registerAnimator(state => {
    const chosen = variant(state), phase = Number.isFinite(state.phase) ? state.phase : 0;
    const safeState = { ...state, phase };
    alternatives.forEach(item => { item.node.visible = item.name === chosen; });
    for (const animate of animations) animate(safeState);
    for (const connection of routes) {
      const visible = state.signals !== false && (state.exploded || 0) < .2 && (!connection.showFor || connection.showFor.includes(chosen));
      connection.line.visible = visible;
      connection.marks.forEach((mark, index) => {
        // Water traces show connectivity with stationary markers, not a running
        // pump, an opened sprinkler or an inferred pressure/flow result.
        const p = ((connection.options.moving === false ? 0 : phase / 7) + index / connection.marks.length) % 1;
        mark.visible = visible; mark.position.copy(connection.curve.getPointAt(p));
        if (connection.kind === 'air') mark.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), connection.curve.getTangentAt(p).normalize());
      });
    }
  });
  return root;
}

