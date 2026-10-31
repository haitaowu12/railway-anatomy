import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { SVGRenderer } from './vendor/SVGRenderer.js';
import { TRACK_VIEWS, buildTrackView } from './track-models.js';
import { SIGNALLING_VIEWS, buildSignallingView } from './signalling-models.js';
import { STATION_VIEWS, buildStationView } from './station-models.js';
import { OPERATIONS_VIEWS, buildOperationsView } from './operations-models.js';
import { PLATFORM_VIEWS, buildPlatformView } from './platform-models.js';

/*
 * Original procedural explanatory models. Geometry is a teaching composition,
 * not survey/CAD data. This selected example uses paired side-contact DC
 * conductors, wheel-running rails, and a separate passive reaction rail.
 * Alternative traction supplies and rail arrangements exist. All proportions,
 * component positions and fields are illustrative; there are no asset ratings.
 */
const C = {
  background: 0x10202b, deck: 0x263744, edge: 0x38505c,
  white: 0xe9e9df, teal: 0x1d8684, yellow: 0xd7b949,
  dark: 0x1b2b35, glass: 0x254551, steel: 0x9aaab2,
  aluminum: 0xcbd5d9, copper: 0xb77447, core: 0x4a5963,
  positive: 0xffc45b, negative: 0x66d4e5, field: 0xa5ead5,
  brake: 0xe49268, accent: 0xd4ede1, signal: 0xb3a6f6, service: 0x7fcea5, warning: 0xff936c,
};
const VIEW = {
  ...TRACK_VIEWS, ...SIGNALLING_VIEWS, ...STATION_VIEWS, ...OPERATIONS_VIEWS, ...PLATFORM_VIEWS,
  system: { camera: [25, 26, 32], target: [0, .9, 1], distance: 55 },
  substation: { camera: [12.5, 12, 16], target: [0, 1, 0], distance: 31 },
  guideway: { camera: [7, 5.7, 7.6], target: [0, .3, .15], distance: 19 },
  vehicle: { camera: [13, 8.7, 17], target: [0, 1.6, 0], distance: 34 },
  bogie: { camera: [4.4, 3.3, 4.7], target: [0, .7, 0], distance: 12 },
  lim: { camera: [5, 3.4, 5.4], target: [0, .75, 0], distance: 13 },
  control: { camera: [13, 12, 17], target: [0, 1.5, .8], distance: 34 },
  communications: { camera: [14, 11, 19], target: [0, 1.6, .6], distance: 36 },
  services: { camera: [12, 11, 17], target: [0, 1.8, 0], distance: 34 },
};
export function createViewer(container, callbacks = {}) {
  const { onSelect = () => {}, onReady = () => {}, onError = () => {} } = callbacks;
  let renderer, rendererKind = 'webgl';
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (webglError) {
    // CPU projection retains these actual three-dimensional meshes, the camera,
    // raycaster and controls when a browser does not expose a graphics context.
    try {
      renderer = new SVGRenderer();
      rendererKind = 'svg';
      renderer.overdraw = .3;
      renderer.setQuality('high');
      renderer.setPrecision(2);
      renderer.shadowMap = {};
      renderer.dispose = () => {};
    } catch (error) {
      onError(error);
      throw error;
    }
  }
  const compatibility = rendererKind === 'svg';
  renderer.setClearColor(C.background);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.23;
  renderer.shadowMap.enabled = !compatibility;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label', 'Interactive three-dimensional model. Use the component list for keyboard selection, and the view buttons to change the camera. Drag to orbit and scroll to zoom.');
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline:none';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.background);
  const camera = new THREE.PerspectiveCamera(36, 1, .03, 250);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !compatibility;
  controls.dampingFactor = .085;
  controls.minPolarAngle = .08;
  controls.maxPolarAngle = Math.PI * .49;
  controls.enablePan = true;
  controls.screenSpacePanning = false;
  controls.minDistance = 2;
  controls.maxDistance = 70;
  controls.target.set(0, 1, 0);

  if (compatibility) scene.add(new THREE.AmbientLight(0xdce8ec, .42));
  else scene.add(new THREE.HemisphereLight(0xc5e7f0, 0x26313b, 2.5));
  const key = new THREE.DirectionalLight(0xfff0d9, compatibility ? .68 : 3.1);
  key.position.set(-12, 23, 14);
  key.castShadow = !compatibility;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -25; key.shadow.camera.right = 25;
  key.shadow.camera.top = 25; key.shadow.camera.bottom = -25;
  key.shadow.camera.near = .5; key.shadow.camera.far = 80;
  key.shadow.bias = -.0005;
  key.shadow.normalBias = .03;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7abacb, compatibility ? .23 : 1.8);
  rim.position.set(8, 9, -18); scene.add(rim);

  const materials = new Map();
  function mat(color, roughness = .55, metalness = .2) {
    const key = `${color}:${roughness}:${metalness}`;
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
    return materials.get(key);
  }
  const M = {
    deck: mat(C.deck, .95, .05), edge: mat(C.edge, .7), white: mat(C.white, .38),
    teal: mat(C.teal, .4), yellow: mat(C.yellow, .42), dark: mat(C.dark, .65),
    glass: mat(C.glass, .18, .6), steel: mat(C.steel, .34, .76),
    aluminum: mat(C.aluminum, .27, .85), copper: mat(C.copper, .35, .65),
    core: mat(C.core, .46, .7), positive: mat(C.positive, .4, .35),
    negative: mat(C.negative, .4, .35), brake: mat(C.brake, .6),
    signal: mat(C.signal, .5), service: mat(C.service, .5),
  };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), mat(0x13232e, .96, 0));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.27; ground.receiveShadow = true; ground.renderOrder = -1000; scene.add(ground);
  const grid = new THREE.GridHelper(80, 40, 0x182b36, 0x182b36);
  grid.position.y = -.255; grid.renderOrder = -900;
  grid.material.transparent = true; grid.material.opacity = .1;
  grid.visible = !compatibility; scene.add(grid);

  const models = new Map();
  let building;
  const state = { view: 'system', selected: null, mode: 'motoring', exploded: 0, cutaway: false, playing: false, phase: 0, receptivity: 'train', scenario: 'nominal', variant: 'default', signals: true, technology: { propulsion: 'lim', control: 'loop' } };
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selectionBounds = new THREE.Box3();
  const selectionBox = new THREE.Box3Helper(selectionBounds, 0xf6d17a);
  selectionBox.material.transparent = true; selectionBox.material.opacity = .85;
  selectionBox.material.depthTest = false; selectionBox.renderOrder = 20; selectionBox.visible = false;
  scene.add(selectionBox);

  function startModel(id) {
    const root = new THREE.Group(); root.name = `view-${id}`;
    const record = { root, parts: new Map(), picks: [], exploded: [], shells: [], flows: [], fields: [], arrows: [], contacts: [], signals: [], indicators: [], doorLeaves: [], fans: [], sensorCues: [], heat: [], animators: [] };
    models.set(id, record); scene.add(root); root.visible = false; building = record;
    return root;
  }
  function group(parent, name, position = [0, 0, 0]) {
    const g = new THREE.Group(); g.name = name; g.position.set(...position); parent.add(g); return g;
  }
  function part(parent, id, position = [0, 0, 0]) {
    const p = group(parent, id, position); p.userData.component = id;
    if (!building.parts.has(id)) building.parts.set(id, []);
    building.parts.get(id).push(p); return p;
  }
  function identify(mesh, parent) {
    let p = parent;
    while (p && !p.userData.component) p = p.parent;
    if (p) { mesh.userData.component = p.userData.component; building.picks.push(mesh); }
  }
  function mesh(parent, geometry, material, position = [0, 0, 0], rotation = null) {
    const m = new THREE.Mesh(geometry, material); m.position.set(...position);
    if (rotation) m.rotation.set(...rotation);
    // The CPU painter has no depth buffer. Large foundation polygons belong
    // behind the machinery, regardless of a triangle centroid's depth.
    if (compatibility && material === M.deck) m.renderOrder = -100;
    m.castShadow = true; m.receiveShadow = true; parent.add(m); identify(m, parent); return m;
  }
  function box(parent, size, material, position = [0, 0, 0], rotation = null) {
    return mesh(parent, new THREE.BoxGeometry(...size), material, position, rotation);
  }
  function cylinder(parent, radius, height, material, position, rotation = null, segments = 24) {
    return mesh(parent, new THREE.CylinderGeometry(radius, radius, height, compatibility ? Math.max(6, Math.ceil(segments * .5)) : segments), material, position, rotation);
  }
  function torus(radius, thickness, radial, tubular) {
    return new THREE.TorusGeometry(radius, thickness, compatibility ? Math.max(3, Math.ceil(radial * .5)) : radial, compatibility ? Math.max(8, Math.ceil(tubular * .5)) : tubular);
  }
  function tube(parent, points, radius, material, options = {}) {
    const vectors = points.map(p => new THREE.Vector3(...p));
    const curve = options.straight ? new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', .01) : new THREE.CatmullRomCurve3(vectors);
    const m = mesh(parent, new THREE.TubeGeometry(curve, options.segments || (compatibility ? 18 : 40), radius, compatibility ? 4 : 7, false), material);
    return { m, curve };
  }
  function roundedPanel(parent, w, h, depth, material, position = [0, 0, 0], radius = .08) {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2, r = Math.min(radius, w / 4, h / 4);
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: compatibility ? 2 : 5 });
    geo.translate(0, 0, -depth / 2);
    return mesh(parent, geo, material, position);
  }
  function explode(node, delta) {
    building.exploded.push({ node, base: node.position.clone(), delta: new THREE.Vector3(...delta) });
  }
  function shell(node) { building.shells.push(node); }
  function foot(parent, x, z) {
    cylinder(parent, .11, .09, M.steel, [x, .02, z], null, 6);
  }
  function arrow(parent, start, end, color, kind = 'thrust') {
    const a = new THREE.ArrowHelper(new THREE.Vector3(...end).sub(new THREE.Vector3(...start)).normalize(), new THREE.Vector3(...start), new THREE.Vector3(...start).distanceTo(new THREE.Vector3(...end)), color, .25, .13);
    a.line.material.depthTest = false; a.cone.material.depthTest = false;
    a.renderOrder = 15; parent.add(a); building.arrows.push({ node: a, kind, start, end }); return a;
  }
  function flow(parent, points, color, tag, radius = .025) {
    const lineMaterial = new THREE.MeshStandardMaterial({ color, roughness: .35, emissive: color, emissiveIntensity: .2, transparent: true, opacity: .75 });
    const { m, curve } = tube(parent, points, radius, lineMaterial);
    m.castShadow = false;
    const dots = [];
    for (let i = 0; i < 5; i++) {
      const bead = new THREE.Mesh(new THREE.SphereGeometry(radius * 2.2, compatibility ? 6 : 8, compatibility ? 4 : 6), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 }));
      parent.add(bead); dots.push(bead);
    }
    building.flows.push({ m, curve, dots, tag, material: lineMaterial });
  }

  // Propulsion and control are independent selections. Specialist control
  // studies retain their named architecture while the surrounding vehicle can
  // still compare LIM and rotary propulsion. No real installation is prescribed.
  function controlTechnology(s, context) {
    const view = context || s.view;
    if (view === 'seltrac') return s.variant === 'loop' ? 'loop' : 'radio';
    if (view === 'cbtc-network') return 'radio';
    if (view === 'signalling' || view === 'interlocking' || view === 'train-detection') return 'fixed';
    if (view === 'etcs') return s.variant === 'level-1' ? 'etcs1' : 'etcs2';
    return s.technology?.control || 'loop';
  }
  function makeLoopEquipment(parent, length, context) {
    const g = group(parent, 'selected-loop-control-equipment');
    const loop = part(g, 'seltrac-loop');
    // Separate violet insulated conductors flank the central LIM reaction rail.
    // Their cable path is an authored arrangement, not supplier installation CAD.
    const from = -length / 2 + .12, to = length / 2 - .12;
    for (const z of [-.43, .43]) {
      tube(loop, [[from,.25,z],[to,.25,z]], .016, M.signal, {straight:true,segments:2});
      for(let x=from+.25;x<to;x+=1.5) box(loop,[.075,.045,.09],M.dark,[x,.225,z]);
    }
    tube(loop, [[to,.25,-.43],[to,.25,.43]], .016, M.signal, {straight:true,segments:2});
    const controller = part(g, 'loop-interface', [from+.45,0,-2]);
    box(controller,[.65,1.25,.45],M.core,[0,.68,0]);
    for(let y=.35;y<1.1;y+=.25){box(controller,[.48,.15,.04],M.signal,[0,y,.25]);box(controller,[.3,.05,.012],M.dark,[0,y,.277]);}
    const lid=group(controller,'removable-loop-interface-door');
    box(lid,[.6,1.15,.035],M.white,[0,.68,.31]);shell(lid);explode(lid,[0,0,.6]);
    tube(g,[[from+.45,.35,-1.8],[from+.45,.26,-1.15],[from,.25,-.43]],.018,M.dark,{segments:5});
    registerAnimator(s=>{g.visible=controlTechnology(s,context)==='loop';});
    g.visible = !['cbtc-network','etcs','signalling','interlocking','train-detection'].includes(context);
    return g;
  }

  // Rails: conductor rails are paired vertically on ONE side of the guideway.
  function makeTrack(parent, length = 12, { detail = true, section = false } = {}) {
    const g = group(parent, 'guideway-assembly');
    box(g, [length + .35, .22, 3.15], M.deck, [0, -.12, 0]);
    box(g, [length + .42, .06, 3.23], M.edge, [0, -.24, 0]);
    const run = part(g, 'running-rail');
    for (const z of [-.72, .72]) {
      box(run, [length, .07, .17], M.steel, [0, .015, z]);
      box(run, [length, .1, .055], M.core, [0, .095, z]);
      box(run, [length, .05, .095], M.aluminum, [0, .17, z]);
    }
    const reaction = part(g, 'reaction-rail');
    const trackContext = building.root.name.slice(5);
    registerAnimator(s=>{reaction.visible=(s.technology?.propulsion || 'lim')==='lim';});
    const moduleLength = 3;
    const modules = Math.ceil(length / moduleLength);
    for (let i = 0; i < modules; i++) {
      const from = -length / 2 + i * moduleLength;
      const to = Math.min(length / 2, from + moduleLength - .04);
      const len = to - from, cx = (from + to) / 2;
      if (len <= 0) continue;
      box(reaction, [len, .1, .4], M.core, [cx, .12, 0]);
      box(reaction, [len, .025, .43], M.aluminum, [cx, .1825, 0]);
      // A solid steel backing and conductive cap indicate the secondary layers.
      // The segmentation and supports are illustrative modelling choices.
      for (let x = from + .28; x < to; x += .8) {
        box(reaction, [.13, .07, .67], M.core, [x, .035, 0]);
        if (detail) for (const z of [-.27, .27]) foot(reaction, x, z);
      }
    }
    const pos = part(g, 'positive-rail'), neg = part(g, 'negative-rail');
    for (const [p, y, color] of [[pos, .63, M.positive], [neg, .37, M.negative]]) {
      // Aluminum conductor body and a separate stainless side-contact cap.
      box(p, [length, .11, .11], M.aluminum, [0, y, 1.18]);
      box(p, [length, .11, .025], M.steel, [0, y, 1.112]);
      box(p, [length, .018, .018], color, [0, y + .062, 1.12]);
    }
    const covers = group(g, 'power-rail-coverboards');
    box(covers, [length, .045, .31], M.white, [0, .79, 1.22]);
    box(covers, [length, .56, .035], M.white, [0, .505, 1.385]);
    if (section) shell(covers);
    for (let x = -length / 2 + .4; x < length / 2; x += detail ? 1.2 : 2.4) {
      box(g, [.1, .65, .1], M.core, [x, .28, 1.43]);
      for (const y of [.37, .63]) cylinder(g, .06, .16, M.white, [x, y, 1.34], [Math.PI / 2, 0, 0], 12);
      if (detail) for (const z of [-.72, .72]) {
        box(run, [.24, .035, .31], M.core, [x, -.01, z]);
        for (const dz of [-.13, .13]) cylinder(run, .026, .04, M.steel, [x, .028, z + dz], null, 6);
      }
    }
    if (!['seltrac','cbtc-network','etcs','signalling','interlocking','train-detection'].includes(trackContext)) makeLoopEquipment(g,length,trackContext);
    return g;
  }

  function makeCollector(parent, at = [0, 0, 0]) {
    const g = part(parent, 'collector', at);
    for (const y of [.37, .63]) {
      tube(g, [[-.2, .9, .77], [-.2, y + .08, .93], [.03, y, 1.035]], .035, M.core);
      box(g, [.34, .08, .065], M.dark, [.03, y, 1.078]);
      box(g, [.29, .07, .018], M.copper, [.03, y, 1.117]);
      cylinder(g, .068, .1, M.white, [-.2, .9, .77], [Math.PI / 2, 0, 0]);
    }
    return g;
  }

  function makePrimary(parent, position = [0, .5, 0], length = 1.75, detailed = false) {
    const g = part(parent, 'lim-primary', position);
    const primaryContext = building.root.name.slice(5);
    registerAnimator(s=>{g.visible=primaryContext==='lim'||(s.technology?.propulsion || 'lim')==='lim';});
    const width = .57;
    box(g, [length + .14, .09, width + .18], M.steel, [0, .2, 0]);
    for (const z of [-.34, .34]) box(g, [length + .22, .07, .045], M.core, [0, .24, z]);
    // Lamination lines make the iron core recognisable without implying a winding drawing.
    for (let z = -.26; z <= .27; z += detailed ? .025 : .05) box(g, [length, .2, .015], M.core, [0, .075, z]);
    const coils = 8;
    for (let i = 0; i < coils; i++) {
      const x = -length / 2 + .13 + i * (length - .26) / (coils - 1);
      box(g, [.09, .12, width], M.core, [x, -.045, 0]);
      for (const z of [-.27, .27]) {
        const coil = mesh(g, torus(.115, .035, 6, 14), M.copper, [x, .07, z], [0, Math.PI / 2, 0]);
        coil.scale.set(1, 1.15, 1);
      }
    }
    for (const x of [-length / 2 + .13, length / 2 - .13]) {
      box(g, [.14, .23, .12], M.steel, [x, .36, 0]);
      cylinder(g, .06, .2, M.steel, [x, .48, 0], [Math.PI / 2, 0, 0]);
    }
    tube(g, [[length / 2, .14, -.18], [length / 2 + .22, .3, -.2], [length / 2 + .3, .5, -.32]], .035, M.dark);
    return g;
  }

  function makeBogie(parent, position = [0, 0, 0], detailed = true) {
    const frame = group(parent, 'bogie-assembly', position);
    const g = part(frame, 'bogie');
    for (const x of [-1.02, 1.02]) {
      cylinder(g, .075, 1.72, M.steel, [x, .56, 0], [Math.PI / 2, 0, 0]);
      for (const z of [-.72, .72]) {
        cylinder(g, .365, .19, M.steel, [x, .56, z], [Math.PI / 2, 0, 0], 32);
        cylinder(g, .4, .035, M.core, [x, .56, z + (z > 0 ? -.105 : .105)], [Math.PI / 2, 0, 0], 32);
        cylinder(g, .14, .215, M.core, [x, .56, z], [Math.PI / 2, 0, 0]);
        box(g, [.35, .25, .27], M.core, [x, .76, z]);
        if (detailed) {
          const brake = part(frame, 'brakes');
          mesh(brake, torus(.29, .045, 7, 30), M.brake, [x, .56, z + (z > 0 ? .12 : -.12)]);
          box(brake, [.19, .2, .21], M.dark, [x + .24, .69, z]);
        }
      }
    }
    for (const z of [-.55, .55]) box(g, [2.65, .17, .18], M.teal, [0, .96, z]);
    for (const x of [-.83, .83]) box(g, [.2, .16, 1.25], M.teal, [x, .97, 0]);
    for (const z of [-.55, .55]) {
      cylinder(g, .23, .16, M.dark, [0, 1.15, z]);
      cylinder(g, .26, .055, M.steel, [0, 1.25, z]);
      for (let y = .82; y < 1.15; y += .055) mesh(g, torus(.12, .018, 6, 16), M.steel, [.75, y, z], [Math.PI / 2, 0, 0]);
    }
    makePrimary(frame, [0, .37, 0], 1.68, detailed);
    const rotary=group(frame,'selected-rotary-drive');
    const motor=part(rotary,'rotary-traction-motor',[-.72,.6975,-.45]);
    cylinder(motor,.235,.68,M.teal,[0,0,0],[Math.PI/2,0,0],20);
    for(const z of [-.33,.33])cylinder(motor,.25,.045,M.steel,[0,0,z],[Math.PI/2,0,0],18);
    for(let z=-.27;z<.3;z+=.09)mesh(motor,torus(.242,.013,5,18),M.steel,[0,0,z]);
    box(motor,[.27,.15,.2],M.dark,[0,.24,.1]);
    // The motor and gearbox pinion share one straight z-axis. A separate
    // coupling spans the space between their housings; this is not a bent shaft.
    const shaft=group(motor,'straight-motor-pinion-shaft',[0,0,.585]);
    cylinder(shaft,.055,.49,M.aluminum,[0,0,0],[Math.PI/2,0,0],12);
    cylinder(shaft,.105,.13,M.steel,[0,0,-.08],[Math.PI/2,0,0],12);
    for(let i=0;i<4;i++){const a=i*Math.PI/2;cylinder(shaft,.017,.15,M.dark,[Math.cos(a)*.075,Math.sin(a)*.075,-.08],[Math.PI/2,0,0],6);}
    const gear=part(rotary,'traction-gearbox',[-1.02,.56,.36]);
    roundedPanel(gear,.9,.7,.28,M.core,[0,0,0],.08);
    const gearCover=group(gear,'removable-gearbox-cover');roundedPanel(gearCover,.88,.68,.035,M.teal,[0,0,.17],.07);shell(gearCover);explode(gearCover,[0,0,.4]);
    // The axle gear is centred on the wheelset axle. The pinion is offset
    // radially by approximately the sum of the two illustrative pitch radii.
    for(const [x,y,r] of [[0,0,.22],[.30,.1375,.11]]){
      const wheel=group(gear,'illustrative-gear',[x,y,.02]);
      cylinder(wheel,r,.07,M.steel,[0,0,0],[Math.PI/2,0,0],16);
      for(let i=0;i<12;i++){const a=i*Math.PI/6;box(wheel,[r*.27,r*.22,.085],M.aluminum,[Math.cos(a)*r,Math.sin(a)*r,0],[0,0,a]);}
      registerAnimator(s=>{wheel.rotation.z=Number(s.phase||0)*(r>.15?.35:-.7);});
    }
    registerAnimator(s=>{rotary.visible=s.technology?.propulsion==='rotary';shaft.rotation.z=-Number(s.phase||0)*.7;});rotary.visible=false;
    const pickup=part(frame,'loop-pickup',[.38,.65,-.43]);
    box(pickup,[.45,.12,.24],M.dark);
    for(let x=-.15;x<.2;x+=.07)box(pickup,[.025,.018,.2],M.copper,[x,-.068,0]);
    tube(pickup,[[.12,.06,0],[.3,.19,0],[.3,.35,.2]],.022,M.dark,{segments:5});
    const pickupContext=building.root.name.slice(5);
    registerAnimator(s=>{pickup.visible=pickupContext!=='seltrac'&&controlTechnology(s,pickupContext)==='loop';});
    pickup.visible=!['seltrac','cbtc-network','etcs','signalling','interlocking','train-detection'].includes(pickupContext);

    makeCollector(frame, [.5, 0, 0]);
    if (detailed) makeWheelSensor(frame);
    return frame;
  }

  // Signals use violet dashed lines. They are message relationships, not
  // traction-current paths, protocols, frequencies or physical cable routes.
  function signal(parent, points, kind = 'wired') {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
    const material = new THREE.LineDashedMaterial({ color:C.signal, dashSize:.12, gapSize:.09, transparent:true, opacity:.7, depthTest:false });
    const line = new THREE.Line(geometry,material); line.computeLineDistances(); line.renderOrder=18; parent.add(line);
    const packets=[];
    for(let i=0;i<3;i++) {
      const packet = new THREE.Mesh(new THREE.OctahedronGeometry(.065),new THREE.MeshBasicMaterial({color:C.signal,depthTest:false}));
      packet.renderOrder=19;parent.add(packet);packets.push(packet);
    }
    const faultMarker=new THREE.Group();faultMarker.position.copy(curve.getPointAt(.5));
    for(const sign of [-1,1]){
      const geometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.16,-.16*sign,0),new THREE.Vector3(.16,.16*sign,0)]);
      const stroke=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:C.warning,depthTest:false}));stroke.renderOrder=20;faultMarker.add(stroke);
    }
    faultMarker.visible=false;parent.add(faultMarker);
    building.signals.push({line,material,curve,packets,kind,faultMarker});
  }
  function indicator(parent,position,tag='normal') {
    const light=cylinder(parent,.035,.022,new THREE.MeshBasicMaterial({color:C.service}),position,[Math.PI/2,0,0],8);
    building.indicators.push({light,tag});return light;
  }
  function makeAntenna(parent,position) {
    const g=part(parent,'radio-antenna',position);
    roundedPanel(g,.65,.1,.45,M.white,[0,0,0],.06);
    cylinder(g,.045,.38,M.dark,[0,.22,0],null,10);
    cylinder(g,.085,.08,M.white,[0,.06,0],null,10);
    for(const x of [-.22,.22]) cylinder(g,.055,.18,M.white,[x,.14,0],null,10);
    return g;
  }
  function makeHVAC(parent,position,detailed=true) {
    const g=part(parent,'hvac',position);
    box(g,[2.35,.13,1.65],M.core,[0,.03,0]);
    for(const z of [-.8,.8])box(g,[2.35,.42,.055],M.white,[0,.26,z]);
    for(const x of [-1.14,1.14])box(g,[.055,.42,1.6],M.steel,[x,.26,0]);
    for(const x of [-.65,.65]) {
      cylinder(g,.31,.055,M.dark,[x,.36,0],null,16);
      const rotor=group(g,'ventilation-fan',[x,.4,0]);
      cylinder(rotor,.07,.06,M.aluminum,[0,0,0],null,12);
      for(let i=0;i<5;i++) {
        const blade=box(rotor,[.25,.028,.08],M.service,[Math.cos(i*Math.PI*2/5)*.15,0,Math.sin(i*Math.PI*2/5)*.15]);
        blade.rotation.y=-i*Math.PI*2/5;
      }
      building.fans.push(rotor);
    }
    if(detailed) {
      for(let i=0;i<10;i++)box(g,[.025,.22,1.4],M.copper,[-.25+i*.05,.2,0]);
      tube(g,[[-.9,.18,.55],[-.9,.15,-.55],[.9,.15,-.55],[.9,.18,.55]],.035,M.copper);
      const lid=group(g,'hvac-grille');
      for(let x=-1;x<=1;x+=.15)box(lid,[.035,.025,1.55],M.aluminum,[x,.5,0]);
      shell(lid);explode(lid,[0,.5,0]);
    }
    explode(g,[0,.6,0]);return g;
  }
  function makeWheelSensor(parent) {
    const g=part(parent,'tachometer',[1.02,.56,.88]);
    cylinder(g,.17,.035,M.signal,[0,0,0],[Math.PI/2,0,0],16);
    cylinder(g,.1,.065,M.dark,[0,0,.04],[Math.PI/2,0,0],12);
    for(let i=0;i<12;i++)box(g,[.035,.04,.025],M.aluminum,[Math.cos(i*Math.PI/6)*.15,Math.sin(i*Math.PI/6)*.15,.025]);
    box(g,[.13,.13,.15],M.signal,[.19,.13,.04]);
    tube(g,[[.19,.16,.04],[.25,.3,.03],[.1,.42,-.12]],.018,M.dark);
    const cue=mesh(g,torus(.23,.015,5,24),new THREE.MeshBasicMaterial({color:C.warning,transparent:true,opacity:.75}),[0,0,.08]);
    cue.visible=false;building.sensorCues.push(cue);
    return g;
  }
  function makeOnboardSystems(train,body) {
    makeHVAC(body,[-4.2,3.72,0]);makeHVAC(body,[4.2,3.72,0]);
    makeAntenna(body,[6.3,3.8,-.45]);
    const controlAntenna=makeAntenna(body,[-.7,3.8,.45]);
    const communicationsContext=building.root.name.slice(5);
    registerAnimator(s=>{controlAntenna.visible=['radio','etcs2'].includes(controlTechnology(s,communicationsContext));});
    controlAntenna.visible=false;
    // Separate logical functions are represented as coloured modules inside one
    // illustrative rack. This is not a vendor hardware partition or redundancy claim.
    const control=part(body,'train-control',[6.6,1.58,-.55]);
    box(control,[.9,1.55,.08],M.core,[0,.77,-.32]);
    for(const x of [-.47,.47])box(control,[.055,1.65,.7],M.steel,[x,.78,0]);
    for(const y of [0,1.57])box(control,[.98,.055,.7],M.aluminum,[0,y,0]);
    for(const [id,y] of [['atp',1.1],['ato',.73],['tcms',.36]]) {
      const module=part(control,id,[0,y,.02]);
      box(module,[.82,.26,.55],M.signal);
      box(module,[.58,.14,.03],M.dark,[0,0,.3]);
      for(let i=0;i<4;i++)box(module,[.07,.04,.025],M.steel,[-.2+i*.13,0,.325]);
      indicator(module,[.34,.015,.32],id);
    }
    const rackDoor=group(control,'control-rack-door');
    box(rackDoor,[.9,1.48,.04],M.white,[0,.78,.39]);shell(rackDoor);explode(rackDoor,[0,0,.65]);
    const radio=part(body,'train-radio',[-6.45,1.62,-.56]);
    box(radio,[.9,1.18,.1],M.core,[0,.58,-.25]);
    for(const y of [.2,.55,.9]){
      box(radio,[.82,.23,.55],M.dark,[0,y,0]);
      box(radio,[.63,.12,.025],M.signal,[-.04,y,.3]);indicator(radio,[.32,y,.32],'radio');
      for(const x of [-.22,-.08,.06])cylinder(radio,.022,.035,M.steel,[x,y,.32],[Math.PI/2,0,0],6);
    }
    registerAnimator(s=>{radio.visible=['radio','etcs2'].includes(controlTechnology(s,communicationsContext));});radio.visible=false;
    const network=part(body,'train-network',[0,1.65,-.92]);
    box(network,[1.1,.13,.38],M.signal);
    for(let x=-.42;x<.5;x+=.14)box(network,[.09,.055,.03],M.dark,[x,0,.21]);
    const imu=part(body,'accelerometer',[2.2,1.68,-.86]);
    box(imu,[.38,.2,.35],M.signal);
    for(const [end,col] of [[[.33,.13,0],0xfa9679],[[0,.46,0],0x8dd4b2],[[0,.13,.33],0x8fc5e4]])tube(imu,[[0,.13,0],end],.014,new THREE.MeshBasicMaterial({color:col}));
    for(const x of [-3.15,3.15])for(const z of [-1.21,1.21]){
      const doorControl=part(body,'door-control',[x,3.22,z]);
      box(doorControl,[1.52,.15,.18],M.core);
      box(doorControl,[.32,.19,.22],M.signal,[-.5,0,0]);
      cylinder(doorControl,.06,1.18,M.steel,[.1,0,0],[0,0,Math.PI/2],8);
      for(const dx of [-.4,.4])box(doorControl,[.12,.17,.16],M.aluminum,[dx,-.08,0]);
      indicator(doorControl,[.53,0,.12],'doors');
    }
    const display=part(body,'passenger-info',[.8,2.97,-.35]);
    roundedPanel(display,1.35,.39,.1,M.dark,[0,0,0],.04);
    box(display,[1.17,.25,.025],M.glass,[0,0,.07]);
    for(let i=0;i<3;i++)box(display,[.82-i*.18,.025,.014],M.service,[-.12,.07-i*.065,.087]);
    for(const x of [-3.9,3.9]) {
      const pa=part(body,'pa-intercom',[x,2.43,-1.19]);
      box(pa,[.22,.35,.055],M.white);
      for(let i=0;i<4;i++)box(pa,[.12,.014,.01],M.dark,[0,.09-i*.035,.034]);
      cylinder(pa,.035,.02,M.service,[0,-.1,.04],[Math.PI/2,0,0],12);
      const speaker=part(body,'pa-intercom',[x,3.07,-.65]);
      cylinder(speaker,.12,.06,M.white,[0,0,0],null,12);
      cylinder(speaker,.085,.068,M.dark,[0,0,0],null,12);
    }
    for(const x of [-5.9,5.9]) {
      const cctv=part(body,'cctv',[x,3.18,-.75]);
      cylinder(cctv,.1,.08,M.white,[0,0,0],null,12);
      const dome=mesh(cctv,new THREE.SphereGeometry(.1,compatibility?8:12,compatibility?6:8),M.glass,[0,-.07,0]);dome.scale.y=.7;
      cylinder(cctv,.04,.035,M.dark,[0,-.1,.07],[Math.PI/2,0,0],8);
    }
    const compressor=part(train,'compressor',[-.1,.84,0]);
    box(compressor,[.65,.12,1.1],M.core,[0,-.08,0]);
    cylinder(compressor,.17,.8,M.steel,[0,.1,0],[Math.PI/2,0,0],16);
    box(compressor,[.28,.25,.35],M.service,[-.17,.16,.35]);
    tube(compressor,[[.2,.15,.35],[.3,.32,.35],[.3,.32,-.4]],.025,M.copper);
    explode(compressor,[0,.15,-1.6]);
    const duct=part(body,'hvac');
    for(const z of [-.73,.73])box(duct,[11,.12,.3],M.service,[0,3.16,z]);
    for(let x=-5;x<=5;x+=1)for(const z of [-.73,.73])box(duct,[.3,.035,.2],M.aluminum,[x,3.07,z]);
    signal(train,[[5.5,.95,.8],[5.4,1.6,.75],[3,1.82,.7],[6.6,2.35,-.15]],'odometry');
    signal(body,[[2.2,1.8,-.86],[3.5,1.9,-.75],[6.6,2.1,-.15]],'odometry');
    signal(body,[[-6.45,2.3,-.2],[-2,3.33,-.6],[3,3.33,-.6],[6.6,2.7,-.15]],'control-link');
    signal(body,[[-6.45,2.6,-.2],[-6,3.45,-.2],[-.7,3.85,.45]],'antenna-link');
    signal(train,[[-4.62,.75,-.43],[-5,1.2,-.5],[5.3,1.3,-.5],[6.6,2.1,-.15]],'loop-link');
    signal(body,[[0,1.78,-.92],[0,2.5,-.6],[.8,2.97,-.28]],'passenger-link');
    signal(body,[[0,1.78,-.92],[-3.3,2.2,-.75],[-3.9,2.43,-1.12]],'passenger-link');
    signal(body,[[6.6,2.1,-.15],[4,2.9,.6],[3.15,3.25,1.21]],'door-link');
    return control;
  }
  function makeWaysideDigital(parent,{at=[-6,0,4],radio=true,controller=true}={}) {
    const g=group(parent,'wayside-digital',at);
    box(g,[3,.18,2.5],M.deck,[0,0,0]);
    if(controller) {
      const zc=part(g,'zone-controller',[-.65,.1,0]);
      box(zc,[.9,1.6,.7],M.core,[0,.8,0]);
      for(const y of [.4,.8,1.2])box(zc,[.7,.23,.07],M.signal,[0,y,.4]);
      const door=group(zc,'wayside-control-door');box(door,[.85,1.5,.035],M.white,[0,.8,.46]);shell(door);
      indicator(zc,[.3,1.4,.44],'atp');
    }
    if(radio) {
      const wireless=part(g,'wayside-radio',[.65,.1,0]);
      cylinder(wireless,.06,3.7,M.steel,[0,1.85,0],null,12);
      box(wireless,[.36,.7,.28],M.white,[0,3.4,.05]);
      for(const z of [-.3,.3])box(wireless,[.15,.55,.07],M.signal,[0,3.4,z]);
      box(wireless,[.4,.46,.28],M.core,[0,.8,.1]);indicator(wireless,[.14,.85,.27],'radio');
      const waysideContext=building.root.name.slice(5);
      registerAnimator(s=>{wireless.visible=['radio','etcs2'].includes(controlTechnology(s,waysideContext));});wireless.visible=false;
    }
    return g;
  }
  function makeSupervision(parent,position=[4.7,.1,4.2]) {
    const g=part(parent,'ats',position);
    // This separate scene vignette represents supervision, not a location or
    // hardware specification for a particular control centre.
    box(g,[2,.12,1.15],M.edge,[0,.95,0]);
    for(const x of [-.8,.8])box(g,[.08,.9,.08],M.steel,[x,.45,0]);
    for(const x of [-.51,.51]){
      box(g,[.88,.57,.08],M.dark,[x,1.42,-.2]);
      box(g,[.76,.44,.015],M.glass,[x,1.42,-.15]);
      for(let row=0;row<3;row++)box(g,[.58,.014,.01],M.signal,[x,1.54-row*.12,-.136]);
      for(let col=0;col<3;col++)box(g,[.05,.05,.015],M.service,[x-.2+col*.2,1.44,-.13]);
      box(g,[.06,.19,.06],M.core,[x,1.06,-.2]);
    }
    box(g,[.65,.025,.24],M.core,[0,1.03,.24]);
    return g;
  }
  function makeBalise(parent,position=[-.7,.24,-.43]) {
    const p=part(parent,'balise',position);
    roundedPanel(p,.5,.09,.28,M.yellow,[0,0,0],.04);
    box(p,[.38,.015,.18],M.dark,[0,.055,0]);
    for(const x of [-.22,.22])cylinder(p,.025,.035,M.steel,[x,.04,0],null,6);
    const baliseContext=building.root.name.slice(5);
    if(['control','communications'].includes(baliseContext)){registerAnimator(s=>{p.visible=['radio','etcs1','etcs2'].includes(controlTechnology(s,baliseContext));});p.visible=false;}
    return p;
  }

  function makeTrain(parent, { scale = 1, at = [0, 0, 0], full = true, energyRole = 'subject' } = {}) {
    const train = group(parent, 'train', at); train.scale.setScalar(scale);
    const body = part(train, 'carbody');
    const L = 16, W = 2.6;
    box(body, [L, .18, W], M.core, [0, 1.39, 0]);
    box(body, [L - .4, .055, W - .12], M.white, [0, 1.51, 0]);
    for (const side of [-1, 1]) {
      const sideGroup = group(body, `body-side-${side}`);
      roundedPanel(sideGroup, L, .72, .09, M.white, [0, 1.94, side * W / 2], .12);
      box(sideGroup, [L - .25, .17, .055], M.teal, [0, 1.74, side * (W / 2 + .05)]);
      box(sideGroup, [L - .3, .04, .06], M.yellow, [0, 1.84, side * (W / 2 + .055)]);
      roundedPanel(sideGroup, L - .13, .72, .075, M.white, [0, 3.17, side * W / 2], .15);
      for (const x of [-6.4, -4.75, -1.65, 0, 1.65, 4.75, 6.4]) {
        roundedPanel(sideGroup, 1.33, .84, .052, M.glass, [x, 2.68, side * (W / 2 + .05)], .07);
        box(sideGroup, [1.18, .025, .015], M.steel, [x, 2.85, side * (W / 2 + .084)]);
      }
      for (const x of [-3.15, 3.15]) {
        const doorway = part(sideGroup, 'doors', [x, 2.45, side * (W / 2 + .06)]);
        roundedPanel(doorway, 1.4, 1.74, .055, M.edge, [0, 0, 0], .06);
        for (const dx of [-.35, .35]) {
          const leaf = group(doorway, 'sliding-door-leaf', [dx, 0, .04 * side]);
          roundedPanel(leaf, .65, 1.65, .06, M.white, [0, 0, 0], .04);
          roundedPanel(leaf, .48, .78, .025, M.glass, [0, .33, .04 * side], .03);
          building.doorLeaves.push({node:leaf,base:leaf.position.clone(),direction:Math.sign(dx)});
        }
        box(sideGroup, [1.4, .08, .15], M.steel, [x, 1.57, side * (W / 2 + .04)]);
      }
      if (side === 1) shell(sideGroup);
      explode(sideGroup, [0, 0, side * .8]);
    }
    const roof = group(body, 'roof');
    roundedPanel(roof, L - .3, .34, W, M.white, [0, 3.55, 0], .15);
    // Roof-mounted services are separate from the removable carbody shell.
    shell(roof); explode(roof, [0, 1.2, 0]);
    for (const sign of [-1, 1]) {
      const end = group(body, `train-end-${sign}`, [sign * L / 2, 0, 0]);
      box(end, [.11, 1.78, W], M.white, [0, 2.48, 0]);
      roundedPanel(end, 1.9, .83, .045, M.glass, [sign * .075, 2.83, 0], .14).rotation.y = Math.PI / 2;
      box(end, [.14, .36, W - .08], M.teal, [sign * .055, 1.93, 0]);
      for (const z of [-.8, .8]) {
        cylinder(end, .105, .035, M.white, [sign * .1, 2.08, z], [0, 0, Math.PI / 2]);
        cylinder(end, .05, .045, M.yellow, [sign * .13, 1.96, z], [0, 0, Math.PI / 2]);
      }
      box(end, [.48, .14, .25], M.dark, [sign * .22, 1.36, 0]);
    }
    if (full) {
      for (const x of [-5.4, -.4, .4, 5.4]) for (const z of [-.78, .78]) {
        box(body, [1.4, .13, .46], M.teal, [x, 1.87, z]);
        box(body, [1.4, .55, .07], M.teal, [x, 2.16, z + Math.sign(z) * .22]);
      }
      for (const x of [-3.1, 3.1]) cylinder(body, .026, 1.9, M.steel, [x, 2.47, .55]);
    }
    explode(body, [0, 1.65, 0]);
    makeBogie(train, [-5, 0, 0], full); makeBogie(train, [5, 0, 0], full);
    if (full) makeOnboardSystems(train, body);
    else { makeAntenna(body, [5.7, 3.77, -.25]); makeHVAC(body, [-3.7, 3.72, 0], false); }
    const pcu = part(train, 'traction-inverter', [-1.8, .96, 0]);
    box(pcu, [2.3, .45, 1.45], M.core);
    for (let x = -.94; x <= .95; x += .12) box(pcu, [.055, .4, 1.53], M.steel, [x, 0, 0]);
    box(pcu, [.42, .3, .04], M.teal, [-.58, 0, .8]);
    const apu = part(train, 'apu', [1.1, .95, 0]);
    box(apu, [1.5, .48, 1.35], M.white);
    for (let x = -.5; x <= .5; x += .12) box(apu, [.055, .25, .04], M.core, [x, 0, .69]);
    const battery = part(train, 'vehicle-battery', [2.7, .98, -.15]);
    box(battery, [.95, .4, 1.1], M.dark);
    for (const x of [-.3, 0, .3]) box(battery, [.2, .28, .8], M.steel, [x, .08, 0]);
    explode(pcu, [0, .2, -1.6]); explode(apu, [0, .2, 1.5]); explode(battery, [0, .2, 1.5]);
    // Distinct DC input and DC return meet at the inverter. The mint paths
    // represent aggregate electrical-energy transfer between inverter and LIM,
    // not instantaneous alternating phase currents or a wiring specification.
    const tractionPositive = [[-4.47, .63, 1.117], [-4.2, 1.08, 1], [-3.1, 1.24, .86], [-1.8, 1.24, .6]];
    const tractionNegative = [[-1.8, .89, .72], [-3.2, .76, .9], [-4.25, .69, 1], [-4.47, .37, 1.117]];
    const motorPaths = [
      [[-1.8, 1.2, -.6], [-3.25, 1.2, -.6], [-3.86, .87, -.32], [-4.16, .51, -.18], [-4.55, .48, -.27]],
      [[-1.8, 1.2, -.6], [3.6, 1.2, -.6], [6.14, .87, -.32], [5.84, .51, -.18], [5.45, .48, -.27]],
    ];
    const tractionTag = energyRole === 'receiver' ? 'receiving-traction' : 'traction';
    tube(train, tractionPositive, .028, M.dark);
    tube(train, tractionNegative, .028, M.dark);
    flow(train, tractionPositive, C.positive, `${tractionTag}-positive`, .034);
    flow(train, tractionNegative, C.negative, `${tractionTag}-negative`, .034);
    const limFeed=group(train,'lim-motor-power-paths'), rotaryFeed=group(train,'rotary-motor-power-paths');
    for (const points of motorPaths) {
      tube(limFeed, points, .028, M.dark);
      flow(limFeed, points, C.field, `${tractionTag}-motor`, .034);
    }
    for(const x of [-5,5]){
      const points=[[-1.8,1.2,-.6],[x,1.2,-.6],[x-.72,1.05,-.55],[x-.72,.9375,-.35]];
      tube(rotaryFeed,points,.028,M.dark);flow(rotaryFeed,points,C.field,`${tractionTag}-motor`,.034);
    }
    registerAnimator(s=>{const rotary=s.technology?.propulsion==='rotary';limFeed.visible=!rotary;rotaryFeed.visible=rotary;});rotaryFeed.visible=false;
    // The auxiliary branch remains supplied during coasting. It bypasses the
    // traction inverter/LIM; line brightness is explanatory, not amperage.
    flow(train, [[-4.47, .63, 1.117], [-4.3, .98, .94], [.35, 1.22, .77], [1.1, 1.22, .6]], C.positive, 'auxiliary-positive', .021);
    flow(train, [[1.1, .95, .7], [.3, .84, .85], [-4.3, .78, .94], [-4.47, .37, 1.117]], C.negative, 'auxiliary-negative', .021);
    return train;
  }

  function cabinet(parent, position, size, id, options = {}) {
    const p = part(parent, id, position), [w, h, d] = size;
    box(p, [w, h, d], M.core, [0, h / 2, 0]);
    const door = group(p, 'cabinet-door');
    box(door, [w - .07, h - .07, .045], options.dark ? M.teal : M.white, [0, h / 2, d / 2 + .025]);
    box(door, [.035, .24, .035], M.dark, [w * .34, h * .47, d / 2 + .065]);
    box(door, [w * .48, .27, .045], M.dark, [0, h * .78, d / 2 + .065]);
    box(door, [w * .35, .12, .018], mat(0x70cfc3, .5, .1), [0, h * .79, d / 2 + .095]);
    for (let i = 0; i < 3; i++) cylinder(door, .026, .018, i ? M.white : M.positive, [-w * .2 + i * w * .2, h * .58, d / 2 + .08], [Math.PI / 2, 0, 0], 10);
    for (let y = .15; y < .4; y += .06) box(door, [w * .7, .018, .015], M.core, [0, y, d / 2 + .057]);
    shell(door); explode(door, [0, 0, .8]);
    // Inside panel is exposed by cutaway; three busbars and switching contacts.
    for (const x of id === 'dc-switchgear' ? [-w * .24, w * .24] : [-w * .24, 0, w * .24]) {
      box(p, [.045, h * .65, .045], M.copper, [x, h * .52, d / 2 - .08]);
      for (const y of [h * .35, h * .6]) {
        cylinder(p, .06, .09, M.white, [x, y, d / 2 - .05], [Math.PI / 2, 0, 0], 12);
        box(p, [.055, .16, .08], M.dark, [x, y + .06, d / 2 + .01]);
      }
    }
    return p;
  }

  function makeDisconnect(parent, position) {
    const g = part(parent, 'disconnect', position);
    box(g, [.9, .12, .85], M.edge, [0, .02, 0]);
    for (const z of [-.22, .22]) {
      for (const x of [-.27, .27]) {
        cylinder(g, .08, .43, M.white, [x, .28, z], null, 12);
        cylinder(g, .12, .045, M.steel, [x, .5, z], null, 12);
      }
      const contact = group(g, 'isolating-contact', [-.27, .55, z]);
      box(contact, [.55, .045, .07], z < 0 ? M.positive : M.negative, [.275, 0, 0]);
      // This no-load isolator is an inspection object, not the device used by
      // the operating-mode animation to interrupt current.
    }
    box(g, [.035, .3, .035], M.steel, [0, .72, .43]);
    box(g, [.35, .04, .055], M.dark, [0, .89, .43]);
    return g;
  }

  function makeSubstation(parent, scale = 1, at = [0, 0, 0]) {
    const g = group(parent, 'substation-assembly', at); g.scale.setScalar(scale);
    box(g, [15.8, .18, 8.7], M.deck, [0, -.02, 0]);
    box(g, [16, .05, 8.9], M.edge, [0, -.13, 0]);
    // A low cutaway wall frames the indoor switchgear without obscuring it.
    const wall = group(g, 'substation-cutaway-wall');
    box(wall, [13.2, .8, .15], M.edge, [-.3, .45, -3.65]);
    box(wall, [.15, .8, 4], M.edge, [-6.83, .45, -1.72]);
    const utility = part(g, 'utility');
    for (const z of [-2.6, -2.1, -1.6]) {
      tube(utility, [[-7.9, 2.6, z], [-7, 2.6, z], [-6.5, 2.5, z], [-6.3, 1.4, z]], .04, M.dark);
      for (let x = -7.5; x < -7.1; x += .08) cylinder(utility, .095, .04, M.white, [x, 2.6, z], [0, 0, Math.PI / 2], 14);
    }
    for (let i = 0; i < 3; i++) cabinet(g, [-5.75 + i * .82, .08, -2.1], [.78, 2.3, 1.3], 'ac-switchgear');
    const tx = part(g, 'transformer', [-1.7, .1, -1.85]);
    box(tx, [2.8, .16, 2.4], M.steel, [0, .1, 0]);
    box(tx, [2.25, .2, 1.55], M.core, [0, .38, 0]);
    box(tx, [2.25, .2, 1.55], M.core, [0, 2.04, 0]);
    for (const x of [-.75, 0, .75]) {
      box(tx, [.28, 1.55, 1.2], M.core, [x, 1.2, 0]);
      for (const z of [-.44, .44]) {
        for (let y = .62; y < 1.87; y += .075) mesh(tx, torus(.31, .027, 6, 22), z > 0 ? M.copper : M.positive, [x, y, z], [Math.PI / 2, 0, 0]);
        cylinder(tx, .075, .35, M.white, [x, 2.3, z], null, 12);
      }
    }
    for (const x of [-1.28, 1.28]) box(tx, [.08, 1.98, 2.1], M.steel, [x, 1.15, 0]);
    explode(tx, [0, .8, 0]);
    const rec = part(g, 'rectifier', [1.85, .1, -1.85]);
    box(rec, [2, .15, 2.1], M.steel, [0, .1, 0]);
    for (const z of [-.46, .46]) {
      box(rec, [1.7, 1.9, .1], M.core, [0, 1.1, z]);
      for (let x = -.76; x <= .77; x += .13) box(rec, [.035, 1.7, .26], M.aluminum, [x, 1.1, z]);
      for (const y of [.65, 1.45]) for (const x of [-.56, 0, .56]) {
        cylinder(rec, .105, .2, M.dark, [x, y, z + .21], [Math.PI / 2, 0, 0], 18);
        for (const dy of [-.15, .15]) box(rec, [.08, .18, .07], M.copper, [x, y + dy, z + .21]);
      }
    }
    tube(rec, [[-.8, 1.9, .8], [0, 2.1, .8], [.8, 1.9, .8]], .04, M.positive);
    tube(rec, [[-.8, .4, .8], [0, .25, .8], [.8, .4, .8]], .04, M.negative);
    explode(rec, [0, .8, 0]);
    for (let i = 0; i < 3; i++) {
      const cb = cabinet(g, [4.5 + i * .87, .08, -2.1], [.82, 2.25, 1.3], 'dc-switchgear', { dark: true });
      const br = part(cb, 'breaker', [0, .85, .7]);
      box(br, [.48, .57, .17], M.dark);
      box(br, [.17, .22, .09], M.brake, [0, .01, .12]);
      for (const x of [-.13, .13]) cylinder(br, .035, .06, M.steel, [x, .17, .14], [Math.PI / 2, 0, 0], 6);
      const breakerContact = group(br, 'dc-feeder-breaker-contact', [-.14, -.13, .18]);
      box(breakerContact, [.28, .035, .045], M.copper, [.14, 0, 0]);
      building.contacts.push(breakerContact);
    }
    cabinet(g, [-5.55, .08, 2], [1.3, 1.88, .8], 'substation-control');
    const control = part(g, 'control-battery', [-3.95, .15, 2]);
    for (const z of [-.37, .37]) box(control, [1.3, .07, .06], M.steel, [0, .2, z]);
    for (const x of [-.45, -.15, .15, .45]) {
      box(control, [.24, .47, .58], M.dark, [x, .48, 0]);
      cylinder(control, .018, .035, M.positive, [x - .06, .74, .15], null, 8);
      cylinder(control, .018, .035, M.negative, [x + .06, .74, .15], null, 8);
    }
    const grounding = part(g, 'grounding', [-1.8, .1, 2]);
    // Protective bonds join exposed metal enclosures to an earth bar. Neither
    // traction pole is drawn connected here: earth is not the normal DC return.
    box(grounding, [1.1, 1.55, .18], M.core, [0, .85, -.25]);
    box(grounding, [1.16, .09, .78], M.white, [0, 1.66, 0]);
    box(grounding, [.88, .11, .07], M.copper, [0, .57, .11]);
    for (const x of [-.33, .33]) {
      box(grounding, [.28, .4, .21], M.steel, [x, 1.24, .01]);
      cylinder(grounding, .04, .04, M.copper, [x, 1.07, .14], [Math.PI / 2, 0, 0], 8);
      tube(grounding, [[x, 1.07, .16], [x, .83, .19], [x, .57, .15]], .025, M.service);
      box(grounding, [.055, .07, .055], M.yellow, [x, .83, .19]);
      cylinder(grounding, .045, .04, M.steel, [x, .57, .17], [Math.PI / 2, 0, 0], 6);
    }
    tube(grounding, [[0, .57, .15], [0, .38, .15], [0, .24, .15]], .025, M.service);
    for (let i = 0; i < 3; i++) box(grounding, [.34 - i * .1, .02, .025], M.steel, [0, .2 - i * .07, .15]);
    const facility = part(g, 'facility-transformer', [.3, .1, 2.2]);
    box(facility, [1.6, .14, 1.6], M.steel, [0, .12, 0]);
    box(facility, [1.3, 1.3, 1.2], M.white, [0, .87, 0]);
    for (let x = -.52; x <= .53; x += .1) box(facility, [.045, .9, .065], M.core, [x, .86, .635]);
    for (const x of [-.38, 0, .38]) cylinder(facility, .06, .2, M.white, [x, 1.62, -.16], null, 12);
    explode(facility, [0, .8, 0]);
    makeDisconnect(g, [7.1, .12, .5]);
    const resistorBank = part(g, 'wayside-resistor', [4.2, .12, 2.1]);
    box(resistorBank, [4.5, .13, 2.05], M.steel, [0, .12, 0]);
    for (const x of [-1.95, 1.95]) for (const z of [-.8, .8]) box(resistorBank, [.08, 1.7, .08], M.core, [x, .9, z]);
    for (const y of [.42, .82, 1.22]) {
      box(resistorBank, [4.1, .055, 1.6], M.core, [0, y, 0]);
      for (let x = -1.8; x <= 1.8; x += .32) {
        const resistor = cylinder(resistorBank, .07, 1.38, M.brake, [x, y + .12, 0], [Math.PI / 2, 0, 0], 12);
        for (const z of [-.73, .73]) cylinder(resistorBank, .09, .09, M.white, [x, y + .12, z], [Math.PI / 2, 0, 0], 10);
      }
    }
    for (const z of [-1.13, 1.13]) {
      for (let x = -2.35; x <= 2.36; x += .47) box(resistorBank, [.026, 1.7, .026], M.steel, [x, .95, z]);
      box(resistorBank, [4.75, .035, .035], M.steel, [0, 1.8, z]);
    }
    for(const x of [-1.2,0,1.2]) {
      const material=new THREE.LineDashedMaterial({color:C.brake,dashSize:.09,gapSize:.08,transparent:true,opacity:.3});
      const points=[new THREE.Vector3(x,1.5,0),new THREE.Vector3(x-.12,1.8,0),new THREE.Vector3(x+.12,2.1,0),new THREE.Vector3(x,2.4,0)];
      const node=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material);node.computeLineDistances();resistorBank.add(node);building.heat.push({node,material,offset:x});
    }
    flow(g, [[-6.3, .25, -.95], [-3.8, .25, -.9], [-3.25, .55, -1.7]], C.accent, 'supply');
    flow(g, [[-.1, .35, -1.1], [.65, .35, -1.1]], C.accent, 'supply');
    // Diode rectification is one-way. These TRU-to-bus links must never reverse
    // under regeneration: regenerated energy remains on the DC network.
    flow(g, [[2.85, .45, -1.1], [3.7, .45, -1.1], [3.9, .38, -.55], [7, .38, -.55]], C.positive, 'tru-output');
    flow(g, [[7, .25, .03], [3.7, .25, .03], [3.15, .26, -.2], [2.85, .28, -1]], C.negative, 'tru-return');
    flow(g, [[7, .38, -.55], [7.3, .45, .5], [6.5, .45, 1.3], [4.2, .7, 1.3]], C.brake, 'wayside-resistor');
    flow(g, [[4.2, .45, 1.45], [6.6, .25, 1.5], [7.45, .25, .55], [7, .25, .03]], C.negative, 'wayside-resistor');
    return g;
  }

  // The whole-system composition separates the foreground substation from the rail
  // corridor behind it. The rail and BOTH vehicles scale together, preserving
  // wheel/rail and collector/contact alignment in this schematic overview.
  {
    const root = startModel('system');
    const railway = group(root, 'rail-corridor', [0, 0, -4]);
    railway.scale.setScalar(.78);
    makeTrack(railway, 40, { detail: false });
    makeTrain(railway, { at: [7.5, 0, 0], full: false });
    const station = makeSubstation(root, .78, [-3.2, .04, 5.7]);
    railway.updateWorldMatrix(true, false); station.updateWorldMatrix(true, false);
    const railPoint = p => railway.localToWorld(new THREE.Vector3(...p)).toArray();
    const stationPoint = p => station.localToWorld(new THREE.Vector3(...p)).toArray();
    // Endpoints are calculated from the same transformed assemblies used for
    // the meshes, rather than visually approximated feeder destinations.
    flow(root, [stationPoint([7, .38, -.55]), [3.5, .36, 4], [4, .49, 0], railPoint([3.03, .63, 1.117])], C.positive, 'feeder-positive', .045);
    flow(root, [railPoint([3.03, .37, 1.117]), [3.7, .29, .2], [3, .24, 4.5], stationPoint([7, .25, .03])], C.negative, 'feeder-negative', .04);
    flow(railway, [[3.03, .63, 1.117], [-4, .63, 1.117], [-10, .63, 1.117], [-14.97, .63, 1.117]], C.field, 'receiving-train', .04);
    flow(railway, [[-14.97, .37, 1.117], [-10, .37, 1.117], [-4, .37, 1.117], [3.03, .37, 1.117]], C.negative, 'receiving-train', .035);
    const receiver = makeTrain(railway, { at: [-10.5, 0, 0], full: false, energyRole: 'receiver' });
    receiver.name = 'other-train';
    arrow(railway, [4.7, .15, -1.8], [8.8, .15, -1.8], C.field);
  }
  {
    const root = startModel('substation'); makeSubstation(root);
  }
  {
    const root = startModel('guideway'); makeTrack(root, 9, { detail: true, section: true });
    makeDisconnect(root, [-3.3, -.06, 2.05]);
    const primary = makePrimary(root, [0, .48, 0], 2.1, true); explode(primary, [0, .8, 0]);
    makeCollector(root, [.6, 0, 0]);
    flow(root, [[-4.4, .635, 1.12], [-2, .635, 1.12], [.65, .635, 1.12], [.4, .9, .8]], C.positive, 'positive');
    flow(root, [[.4, .9, .7], [.65, .37, 1.12], [-2, .37, 1.12], [-4.4, .37, 1.12]], C.negative, 'negative');
    arrow(root, [-.9, .23, -1.2], [1.7, .23, -1.2], C.field);
  }
  {
    const root = startModel('vehicle'); makeTrack(root, 21, { detail: false }); makeTrain(root);
    arrow(root, [3.5, .15, -2.25], [7, .15, -2.25], C.field);
  }
  {
    const root = startModel('bogie'); makeTrack(root, 5.7, { detail: true, section: true });
    const bogie = makeBogie(root); explode(bogie, [0, .6, 0]);
    arrow(root, [-1.2, .24, -1.25], [1.5, .24, -1.25], C.field);
  }
  {
    const root = startModel('lim');
    box(root, [6.4, .18, 3], M.deck, [0, -.12, 0]);
    const secondary = part(root, 'reaction-rail');
    const iron = group(secondary, 'back-iron');
    box(iron, [5.5, .14, .7], M.core, [0, .08, 0]);
    for (let i = 0; i < 6; i++) box(iron, [5.5, .008, .7], M.steel, [0, .025 + i * .025, 0]);
    const cap = group(secondary, 'aluminum-cap');
    box(cap, [5.55, .035, .78], M.aluminum, [0, .1675, 0]);
    explode(cap, [0, .23, 0]);
    for (const x of [-2.3, -1.55, -.8, -.05, .7, 1.45, 2.2]) {
      box(secondary, [.14, .1, 1.07], M.core, [x, -.005, 0]);
      for (const z of [-.46, .46]) foot(secondary, x, z);
    }
    const primary = makePrimary(root, [0, .92, 0], 3.5, true);
    explode(primary, [0, .85, 0]);
    // Field arches and induced-current loops are illustrative, not a solved field.
    for (let i = 0; i < 9; i++) {
      const x = (i - 4) * .37;
      const fieldMat = new THREE.MeshBasicMaterial({ color: C.field, transparent: true, opacity: .45, depthWrite: false });
      const points = [[x, .85, -.3], [x, .58, -.44], [x, .29, -.27], [x, .23, 0], [x, .29, .27], [x, .58, .44], [x, .85, .3]];
      const { m } = tube(root, points, .014, fieldMat);
      m.castShadow = false;
      building.fields.push({ m, material: fieldMat, index: i, kind: 'field' });
      const loop = new THREE.Mesh(torus(.18, .009, 5, 26), new THREE.MeshBasicMaterial({ color: i % 2 ? C.positive : C.negative, transparent: true, opacity: .65, depthWrite: false }));
      loop.rotation.x = Math.PI / 2; loop.scale.set(1, .67, 1); loop.position.set(x, .203, i % 2 ? .1 : -.1); root.add(loop);
      building.fields.push({ m: loop, material: loop.material, index: i, kind: 'eddy' });
    }
    arrow(root, [-1.1, 1.8, -.1], [1.35, 1.8, -.1], C.field, 'thrust');
    arrow(root, [1.35, .58, .85], [-1.1, .58, .85], C.positive, 'field');
  }

  for (const view of ['control','communications','services']) {
    const root=startModel(view);
    makeTrack(root,20,{detail:false,section:true});
    makeTrain(root,{full:true});
    if(view!=='services') {
      makeWaysideDigital(root,{at:[-5.5,0,4.2]});
      if(view==='control'){
        makeSupervision(root);
        signal(root,[[4.7,1.5,4.2],[2,2.2,4.8],[-2,2.2,4.8],[-6.15,1.5,4.6]],'wayside-link');
      }
      makeBalise(root,[.2,.24,-.43]);
      signal(root,[[-4.85,3.75,4.2],[-3,5.2,3],[-1,5,1],[-.7,4.18,.45]],'radio');
      signal(root,[[-6.15,1.2,4.6],[-5.5,1.3,4.9],[-4.85,.95,4.45]],'wayside-link');
      signal(root,[[.2,.32,-.43],[.2,.8,-.43],[.6,1.65,-.43],[3,1.9,-.4],[6.6,2.45,-.15]],'balise-link');
    }
  }

  function registerAnimator(fn) { building.animators.push(fn); }
  const modelApi={THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,torus,tube,roundedPanel,explode,shell,foot,makeTrack,makeTrain,makePrimary,makeBogie,cabinet,registerAnimator};
  function ensureModel(id) {
    if(models.has(id))return true;
    if(Object.hasOwn(TRACK_VIEWS,id))buildTrackView(id,modelApi);
    else if(Object.hasOwn(SIGNALLING_VIEWS,id))buildSignallingView(id,modelApi);
    else if(Object.hasOwn(STATION_VIEWS,id))buildStationView(id,modelApi);
    else if(Object.hasOwn(OPERATIONS_VIEWS,id))buildOperationsView(id,modelApi);
    else if(Object.hasOwn(PLATFORM_VIEWS,id))buildPlatformView(id,modelApi);
    return models.has(id);
  }
  function nodeVisible(node) { for(let p=node;p;p=p.parent)if(!p.visible)return false;return true; }
  function updateAssembly() {
    for (const record of models.values()) {
      for (const e of record.exploded) e.node.position.copy(e.base).addScaledVector(e.delta, state.exploded);
      for (const node of record.shells) node.visible = !state.cutaway;
    }
    updateSelection();
  }
  function activeFlow(tag) {
    if (state.mode === 'isolated') return false;
    // The door-open lesson inhibits traction; it can still retain auxiliaries.
    // A braking circuit cannot export energy with its traction branch inhibited.
    if (state.mode === 'regeneration' && state.scenario === 'door-open') return false;
    if (['traction-positive', 'traction-negative', 'traction-motor'].includes(tag)) return state.scenario !== 'door-open' && (state.mode === 'motoring' || state.mode === 'regeneration');
    if (tag.startsWith('receiving-traction-')) return state.mode === 'regeneration' && state.receptivity === 'train';
    if (tag === 'supply') return state.mode === 'motoring' || state.mode === 'coasting';
    if (tag === 'tru-output' || tag === 'tru-return') return state.mode === 'motoring' || state.mode === 'coasting';
    if (tag === 'auxiliary-positive' || tag === 'auxiliary-negative') return state.mode === 'coasting' || state.mode === 'motoring';
    if (tag === 'feeder-positive' || tag === 'feeder-negative') return state.mode === 'motoring' || state.mode === 'coasting' || (state.mode === 'regeneration' && state.receptivity === 'resistor');
    if (tag === 'wayside-resistor') return state.mode === 'regeneration' && state.receptivity === 'resistor';
    if (tag === 'receiving-train') return state.mode === 'regeneration' && state.receptivity === 'train';
    if (tag === 'positive' || tag === 'negative') return state.mode === 'motoring' || state.mode === 'regeneration' || state.mode === 'coasting';
    return false;
  }
  function animateModel() {
    const r = models.get(state.view);
    for (const contact of r.contacts) contact.rotation.z = state.mode === 'isolated' ? .72 : 0;
    for (const f of r.flows) {
      const active = activeFlow(f.tag) && !['control','communications'].includes(state.view) && !Object.hasOwn(SIGNALLING_VIEWS,state.view) && !Object.hasOwn(STATION_VIEWS,state.view);
      f.m.visible = active;
      f.material.opacity = state.mode === 'coasting' ? .32 : .75;
      for (let i = 0; i < f.dots.length; i++) {
        const bead = f.dots[i]; bead.visible = active;
        bead.material.opacity = state.mode === 'coasting' ? .48 : 1;
        let p = ((state.phase / 5) + i / f.dots.length) % 1;
        // The braking vehicle reverses all power-conversion legs. The separate
        // receiving train keeps its collector-to-inverter-to-motor direction.
        if (state.mode === 'regeneration' && ['positive', 'negative', 'feeder-positive', 'feeder-negative', 'traction-positive', 'traction-negative', 'traction-motor'].includes(f.tag)) p = 1 - p;
        bead.position.copy(f.curve.getPointAt(p));
      }
    }
    const tractionPermitted=state.scenario!=='door-open';
    const energized = (state.mode === 'motoring' || state.mode === 'regeneration') && tractionPermitted;
    const viewSignalKinds={control:['loop-link','radio','wayside-link','balise-link','odometry','control-link','door-link'],communications:['loop-link','radio','wayside-link','antenna-link','control-link','passenger-link'],services:['passenger-link','door-link']};
    const focusedDigital=['train-control','atp','ato','tcms','train-radio','radio-antenna','train-network','accelerometer','tachometer','door-control','passenger-info','pa-intercom','cctv'].includes(state.selected);
    for(const connection of r.signals){
      const controlType=controlTechnology(state);
      const controlRadioPath=['radio','antenna-link','control-link','wayside-link'].includes(connection.kind);
      const technologyPath=connection.kind==='loop-link'?controlType==='loop':controlRadioPath?['radio','etcs2'].includes(controlType):true;
      const visible=technologyPath&&state.signals&&state.exploded<.5&&((viewSignalKinds[state.view]||[]).includes(connection.kind)||(state.view==='vehicle'&&focusedDigital));
      const failed=['radio','loop-link'].includes(connection.kind)&&state.scenario==='radio-loss';
      // These paths specifically forward external control updates. Hold their
      // packets after radio loss; the internal wiring itself has not failed.
      // Local odometry, door-status and passenger-network messages can continue.
      const held=state.scenario==='radio-loss'&&['antenna-link','control-link'].includes(connection.kind);
      connection.line.visible=visible;connection.faultMarker.visible=visible&&failed;connection.faultMarker.quaternion.copy(camera.quaternion);
      connection.material.color.set(failed||held?C.warning:C.signal);
      connection.material.opacity=failed?.3:held?.45:.62;
      connection.packets.forEach((packet,i)=>{
        packet.visible=visible&&!failed&&!held;
        let phase=(state.phase/4+i/connection.packets.length)%1;
        if(connection.kind==='radio'&&i%2)phase=1-phase;
        packet.position.copy(connection.curve.getPointAt(phase));
      });
    }
    for(const {light,tag} of r.indicators){
      const fault=(state.scenario==='radio-loss'&&['radio','atp'].includes(tag))||(state.scenario==='door-open'&&['doors','ato'].includes(tag));
      light.material.color.set(fault?C.warning:C.service);
    }
    for(const door of r.doorLeaves){door.node.position.copy(door.base);if(state.scenario==='door-open')door.node.position.x+=door.direction*.58;}
    for(const fan of r.fans)fan.rotation.y=state.mode==='isolated'?0:state.phase*1.4;
    for(const cue of r.sensorCues){cue.visible=state.scenario==='wheel-slip';cue.material.opacity=.45+.3*Math.sin(state.phase*2);}
    for(const plume of r.heat){
      plume.node.visible=state.mode==='regeneration'&&state.receptivity==='resistor'&&tractionPermitted;
      plume.material.opacity=.2+.2*(.5+.5*Math.sin(state.phase*1.5+plume.offset));
    }

    for (const f of r.fields) {
      f.m.visible = energized && state.exploded < .65;
      // x increases with index. Keeping the phase constant as time increases
      // therefore moves a crest toward decreasing x, opposite motoring thrust.
      const wave = .5 + .5 * Math.sin(f.index * .72 + state.phase * 2.2);
      f.material.opacity = f.kind === 'field' ? .13 + wave * .63 : .2 + (1 - wave) * .65;
    }
    for(const animate of r.animators)animate(state);
    for (const a of r.arrows) {
      a.node.visible = energized;
      if (a.kind === 'thrust') {
        a.node.position.set(...(state.mode === 'regeneration' ? a.end : a.start));
        a.node.setDirection(new THREE.Vector3(state.mode === 'regeneration' ? -1 : 1, 0, 0));
        a.node.setColor(state.mode === 'regeneration' ? C.brake : C.field);
      }
    }
  }
  function updateSelection() {
    const r = models.get(state.view), parts = state.selected && r.parts.get(state.selected)?.filter(nodeVisible);
    selectionBox.visible = Boolean(parts?.length);
    if (!parts?.length) return;
    r.root.updateWorldMatrix(true, true);
    selectionBounds.makeEmpty();
    for (const p of parts) selectionBounds.expandByObject(p);
    selectionBounds.expandByScalar(.06);
    selectionBox.updateMatrixWorld(true);
  }
  function setView(id) {
    if (!ensureModel(id)) return;
    state.view = id;
    for (const [key, value] of models) value.root.visible = key === id;
    resetCamera(); updateAssembly(); animateModel(); requestRender();
  }
  function resetCamera() {
    const config = VIEW[state.view];
    camera.position.set(...config.camera); controls.target.set(...config.target);
    controls.maxDistance = config.distance * 1.65; controls.minDistance = state.view === 'system' ? 8 : 2;
    fitToView(); controls.update(); requestRender();
  }
  function fitToView() {
    const record = models.get(state.view);
    record.root.updateWorldMatrix(true, true);
    const bounds = new THREE.Box3();
    record.root.traverseVisible(o=>{if(o.geometry){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();if(o.geometry.boundingBox)bounds.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));}});
    if(bounds.isEmpty())return;
    const direction = camera.position.clone().sub(controls.target).normalize();
    const right = new THREE.Vector3().crossVectors(camera.up, direction).normalize();
    const up = new THREE.Vector3().crossVectors(direction, right).normalize();
    const tangentY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const tangentX = tangentY * Math.max(camera.aspect, .15);
    let distance = 2;
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      const delta = new THREE.Vector3(x, y, z).sub(controls.target);
      const depth = delta.dot(direction);
      distance = Math.max(distance, depth + Math.abs(delta.dot(right)) / tangentX, depth + Math.abs(delta.dot(up)) / tangentY);
    }
    distance *= 1.12;
    camera.position.copy(controls.target).addScaledVector(direction, distance);
    controls.maxDistance = Math.max(VIEW[state.view].distance * 1.65, distance * 2);
  }
  function setCameraPreset(id = 'isometric') {
    if (id === 'isometric') return resetCamera();
    const config = VIEW[state.view], target = new THREE.Vector3(...config.target);
    const d = new THREE.Vector3(...config.camera).distanceTo(target);
    controls.target.copy(target);
    camera.position.copy(target).add(id === 'top' ? new THREE.Vector3(.001, d, .001) : new THREE.Vector3(0, d * .17, d));
    fitToView(); controls.update(); requestRender();
  }
  function resize() {
    const width = Math.max(container.clientWidth, 1), height = Math.max(container.clientHeight, 1);
    const changed = Math.abs(camera.aspect - width / height) > .01;
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    if (changed) { fitToView(); controls.update(); }
    requestRender();
  }
  let pointerDown = null;
  function down(event) { pointerDown = { x: event.clientX, y: event.clientY }; }
  function up(event) {
    if (!pointerDown || Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 5) return;
    pointerDown = null;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const visible = models.get(state.view).picks.filter(m => {
      for (let p = m; p; p = p.parent) if (!p.visible) return false;
      return true;
    });
    const hit = raycaster.intersectObjects(visible, false)[0];
    if (hit?.object.userData.component) {
      const id = hit.object.userData.component; state.selected = id; updateSelection(); animateModel(); requestRender(); onSelect(id);
    }
  }
  renderer.domElement.addEventListener('pointerdown', down);
  renderer.domElement.addEventListener('pointerup', up);
  renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());

  let disposed = false, frame = 0, lastTime = 0, lastDraw = -Infinity, renderPending = true, settleFrames = 0;
  function requestRender() { renderPending = true; settleFrames = compatibility ? 0 : 18; }
  controls.addEventListener('change', requestRender);
  function loop(time) {
    if (disposed) return;
    frame = requestAnimationFrame(loop);
    const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0; lastTime = time;
    const moving = state.playing && !document.hidden && !reducedMotion.matches;
    if (moving) { state.phase += dt; animateModel(); renderPending = true; }
    if (settleFrames > 0) { controls.update(); settleFrames--; }
    if ((renderPending || moving || settleFrames > 0) && (!compatibility || time - lastDraw > 90)) {
      renderer.render(scene, camera); renderPending = false; lastDraw = time;
    }
  }
  function visibility() { if (document.hidden) state.playing = false; lastTime = 0; requestRender(); }
  function motionPreference() { if (reducedMotion.matches) state.playing = false; requestRender(); }
  document.addEventListener('visibilitychange', visibility);
  reducedMotion.addEventListener('change', motionPreference);
  const observer = new ResizeObserver(resize); observer.observe(container);

  function dispose() {
    if (disposed) return;
    disposed = true; cancelAnimationFrame(frame); observer.disconnect(); controls.dispose();
    document.removeEventListener('visibilitychange', visibility); reducedMotion.removeEventListener('change', motionPreference);
    renderer.domElement.removeEventListener('pointerdown', down); renderer.domElement.removeEventListener('pointerup', up);
    const geos = new Set(), mats = new Set();
    scene.traverse(o => { if (o.geometry) geos.add(o.geometry); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => mats.add(m)); });
    for (const g of geos) g.dispose(); for (const m of mats) m.dispose();
    renderer.dispose(); renderer.domElement.remove();
  }

  setView('system'); resize(); animateModel(); frame = requestAnimationFrame(loop);
  onReady({ view: state.view, components: [...models.get(state.view).parts.keys()], renderer: rendererKind });
  return {
    setView,
    setTechnology(value={}) {
      const propulsion=['lim','rotary'].includes(value.propulsion)?value.propulsion:state.technology.propulsion;
      const control=['loop','radio','fixed','etcs1','etcs2'].includes(value.control)?value.control:state.technology.control;
      const changed=propulsion!==state.technology.propulsion||control!==state.technology.control;
      state.technology={propulsion,control};
      animateModel();updateSelection();if(changed){fitToView();controls.update();}requestRender();
    },
    getTechnology(){return {...state.technology};},
    setSelected(id) { state.selected = id || null; updateSelection(); animateModel(); requestRender(); },
    setMode(mode) { if (!['motoring', 'regeneration', 'coasting', 'isolated'].includes(mode)) return; state.mode = mode; animateModel(); requestRender(); },
    setExploded(value) { state.exploded = THREE.MathUtils.clamp(Number(value) || 0, 0, 1); updateAssembly(); animateModel(); requestRender(); },
    setCutaway(value) { state.cutaway = Boolean(value); updateAssembly(); requestRender(); },
    setPlaying(value) { state.playing = Boolean(value) && !reducedMotion.matches && !document.hidden; lastTime = 0; requestRender(); return state.playing; },
    setPhase(value) { state.phase = Math.max(0, Number(value) || 0); animateModel(); requestRender(); },
    setReceptivity(value) { state.receptivity = value === 'resistor' ? 'resistor' : 'train'; animateModel(); requestRender(); },
    setVariant(value) { const changed=state.variant!==value;state.variant=typeof value==='string'?value:'default'; animateModel(); updateSelection();if(changed){fitToView();controls.update();}requestRender(); },
    setScenario(value) { state.scenario=typeof value==='string'?value:'nominal'; animateModel(); updateSelection(); requestRender(); },
    setSignals(value) { state.signals=Boolean(value);animateModel();requestRender(); },
    focusComponent(id) {
      const parts=models.get(state.view).parts.get(id)?.filter(nodeVisible);if(!parts?.length)return false;
      models.get(state.view).root.updateWorldMatrix(true,true);
      const bounds=new THREE.Box3();for(const p of parts)bounds.expandByObject(p);
      const center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
      const direction=camera.position.clone().sub(controls.target).normalize();
      const distance=Math.max(2.8,Math.max(size.x,size.y,size.z)*2.2/Math.min(1,camera.aspect));
      controls.target.copy(center);camera.position.copy(center).addScaledVector(direction,distance);controls.update();requestRender();return true;
    },
    setCameraPreset,
    resetCamera,
    resize,
    dispose,
    getComponentScreenPositions() {
      const r = models.get(state.view), result = [];
      r.root.updateWorldMatrix(true, true);
      for (const [id, groups] of r.parts) {
        const visibleGroups=groups.filter(nodeVisible);if(!visibleGroups.length)continue;
        const box = new THREE.Box3(); visibleGroups.forEach(g => box.expandByObject(g));
        const point = box.getCenter(new THREE.Vector3()).project(camera);
        if (point.z < 1 && Math.abs(point.x) < 1 && Math.abs(point.y) < 1) result.push({ id, x: (point.x + 1) * .5, y: (1 - point.y) * .5 });
      }
      return result;
    },
    getVisibleComponentIds() {return [...models.get(state.view).parts].filter(([,groups])=>groups.some(nodeVisible)).map(([id])=>id);},
    getComponentIds(view = state.view) { ensureModel(view);return [...(models.get(view)?.parts.keys() || [])]; },
  };
}
