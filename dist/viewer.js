import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { SVGRenderer } from './vendor/SVGRenderer.js';
import { TRACK_VIEWS, buildTrackView } from './track-models.js';
import { SIGNALLING_VIEWS, buildSignallingView } from './signalling-models.js';
import { STATION_VIEWS, STATION_FOCUS, buildStationView } from './station-models.js';
import { OPERATIONS_VIEWS, buildOperationsView } from './operations-models.js';
import { PLATFORM_VIEWS, PLATFORM_FOCUS, buildPlatformView } from './platform-models.js';
import { NETWORK_VIEWS, buildNetworkView } from './network-model.js';
import { OCC_VIEWS, buildOccView } from './occ-models.js';
import { STUDY_CAMERAS, buildStudyView } from './studies-models.js';
import { POWER_CAMERAS, buildPowerView } from './electrification-models.js';
import { DEFAULT_ELECTRIFICATION, normalizeElectrification } from './electrification.js';
import { normalizePlatformEdge, normalizePlatformSensor } from './platform-config.js';
import { advancePlayback } from './interaction-state.js';
import { COMMUNICATIONS_VIEWS, buildCommunicationsView } from './communications-models.js';
import { buildAssemblyIndex, instanceNode, instanceMetadata, assemblyTree, instanceAncestors, assemblyFunctionalPaths } from './assembly-contract.js';
import { createEquipmentDetails } from './equipment-details.js';
import { createMechanicalDetails } from './mechanical-details.js';
import { installStudioEnvironment } from './studio-lighting.js';
import { drawWithEnclosureOcclusion } from './precision-geometry.js';
import { nodeVisible, within, visibleBounds, componentBounds, assemblyRoots, restoreIsolation, applyIsolation,
  separationEntries, viewSeparationCapabilities, explorationCapabilities, restoreSeparation, applySeparation, fitPerspectiveBounds, screenPositions } from './exploration.js';

/*
 * Original procedural explanatory models. Geometry is a teaching composition,
 * not survey/CAD data. This selected example uses paired side-contact DC
 * conductors, wheel-running rails, and a separate passive reaction rail.
 * Alternative traction supplies and rail arrangements exist. All proportions,
 * component positions and fields are illustrative; there are no asset ratings.
 */
const C = {
  background: 0xf8faff, deck: 0x263744, edge: 0x38505c,
  white: 0xe9e9df, teal: 0x1d8684, yellow: 0xd7b949,
  dark: 0x1b2b35, glass: 0x254551, steel: 0x9aaab2,
  aluminum: 0xcbd5d9, copper: 0xb77447, core: 0x4a5963,
  positive: 0xffc45b, negative: 0x66d4e5, field: 0xa5ead5,
  brake: 0xe49268, accent: 0xd4ede1, signal: 0xb3a6f6, service: 0x7fcea5, warning: 0xff936c,
};
const VIEW = {
  ...TRACK_VIEWS, ...SIGNALLING_VIEWS, ...STATION_VIEWS, ...OPERATIONS_VIEWS, ...PLATFORM_VIEWS, ...NETWORK_VIEWS, ...OCC_VIEWS, ...STUDY_CAMERAS, ...POWER_CAMERAS, ...COMMUNICATIONS_VIEWS,
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
  renderer.toneMappingExposure = compatibility ? 1.23 : 1.08;
  renderer.shadowMap.enabled = !compatibility;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label', 'Interactive three-dimensional model. Use the component list for keyboard selection, and the view buttons to change the camera. Drag to orbit and scroll to zoom.');
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline:none';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.background);
  const studioEnvironment = installStudioEnvironment({ THREE, renderer, scene });
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
  else scene.add(new THREE.HemisphereLight(0xc5e7f0, 0x26313b, studioEnvironment.enabled ? 1.45 : 2.5));
  const key = new THREE.DirectionalLight(0xfff0d9, compatibility ? .68 : 2.8);
  key.position.set(-12, 23, 14);
  key.castShadow = !compatibility;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -25; key.shadow.camera.right = 25;
  key.shadow.camera.top = 25; key.shadow.camera.bottom = -25;
  key.shadow.camera.near = .5; key.shadow.camera.far = 80;
  key.shadow.bias = -.0005;
  key.shadow.normalBias = .03;
  scene.add(key); scene.add(key.target);
  const rim = new THREE.DirectionalLight(0x7abacb, compatibility ? .23 : 1.8);
  rim.position.set(8, 9, -18); scene.add(rim);

  const materials = new Map();
  function mat(color, roughness = .55, metalness = .2) {
    const key = `${color}:${roughness}:${metalness}`;
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness }));
    return materials.get(key);
  }
  const M = {
    deck: mat(C.deck, .95, .02), edge: mat(C.edge, .7, .08), white: mat(C.white, .42, .06),
    teal: mat(C.teal, .43, .08), yellow: mat(C.yellow, .46, .06), dark: mat(C.dark, .78, .06),
    glass: mat(C.glass, .18, .02), steel: mat(C.steel, .38, .8),
    aluminum: mat(C.aluminum, .32, .85), copper: mat(C.copper, .35, .82),
    core: mat(C.core, .46, .7), positive: mat(C.positive, .4, .35),
    negative: mat(C.negative, .4, .35), brake: mat(C.brake, .6),
    signal: mat(C.signal, .5), service: mat(C.service, .5),
  };
  const groundMaterial = compatibility ? new THREE.MeshBasicMaterial({color:C.background, toneMapped:false}) : new THREE.ShadowMaterial({color:0x142344, opacity:.18});
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), groundMaterial);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.27; ground.receiveShadow = true; ground.renderOrder = -1000; scene.add(ground);
  const grid = new THREE.GridHelper(80, 40, 0xdde4f1, 0xdde4f1);
  grid.position.y = -.255; grid.renderOrder = -900;
  grid.material.transparent = true; grid.material.opacity = .06;
  grid.visible = !compatibility; scene.add(grid);

  const models = new Map();
  let building;
  const state = { view: 'system', selected: null, mode: 'motoring', exploded: 0, explodeScope: 'all', isolation: null, focused: null, cutaway: false, playing: false, phase: 0, duration: 12, loop: false, receptivity: 'train', scenario: 'nominal', variant: 'default', signals: true, platformEdge: 'open', platformSensor: 'lidar', electrification: DEFAULT_ELECTRIFICATION, technology: { propulsion: 'lim', control: 'loop' } };
  Object.assign(state, { selectedInstanceId: null, isolationInstanceId: null, focusedInstanceId: null, allInstances: false, functionalPath: null });
  let frameBeforeExploration = null, cachedComponentBounds = null;
  const labelAnchorInstances = new Map();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const selectionBounds = new THREE.Box3();
  const selectionGeometry = new THREE.BufferGeometry();
  const selectionCorners = new THREE.LineSegments(selectionGeometry, new THREE.LineBasicMaterial({ color: 0x244acb, transparent: true, opacity: .9, depthTest: false }));
  selectionCorners.renderOrder = 20; selectionCorners.visible = false; scene.add(selectionCorners);
  const functionalGeometry = new THREE.BufferGeometry();
  const functionalLine = new THREE.Line(functionalGeometry, new THREE.LineDashedMaterial({ color: 0xbd6d22, dashSize: .12, gapSize: .07, transparent: true, opacity: .9, depthTest: false }));
  functionalLine.renderOrder = 19; functionalLine.visible = false; scene.add(functionalLine);

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
    // Manufactured enclosures have an edge radius; thin shims, rails, teeth and
    // contact faces retain their exact rectangular construction. The panel
    // helper keeps the same outer dimensions, including its bevel.
    if(Math.min(...size)>=.1&&Math.max(...size)<9){
      const m=roundedPanel(parent,size[0],size[1],size[2],material,position,Math.min(.045,Math.min(...size)*.16));
      if(rotation)m.rotation.set(...rotation);m.userData.manufacturedEdge=true;return m;
    }
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
    const b=Math.min(.014,depth*.14,w*.04,h*.04),iw=w-2*b,ih=h-2*b;
    const s = new THREE.Shape(), x = -iw / 2, y = -ih / 2, r = Math.max(.001,Math.min(radius-b, iw / 4, ih / 4));
    s.moveTo(x + r, y); s.lineTo(x + iw - r, y); s.quadraticCurveTo(x + iw, y, x + iw, y + r);
    s.lineTo(x + iw, y + ih - r); s.quadraticCurveTo(x + iw, y + ih, x + iw - r, y + ih);
    s.lineTo(x + r, y + ih); s.quadraticCurveTo(x, y + ih, x, y + ih - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const geo = new THREE.ExtrudeGeometry(s, { depth:depth-2*b, bevelEnabled:true, bevelThickness:b,bevelSize:b,bevelSegments:1,curveSegments: compatibility ? 2 : 5 });
    geo.translate(0, 0, -depth / 2+b);geo.userData.outerDimensions=[w,h,depth];
    return mesh(parent, geo, material, position);
  }
  function explode(node, delta) {
    building.exploded.push({ node, base: node.position.clone(), delta: new THREE.Vector3(...delta) });
  }
  function inspectionStage(node, label, start, end) {
    node.userData.inspectionStage = label;
    node.userData.inspectionRange = [start, end];
  }
  function mechanicalDetails() { return createMechanicalDetails({ THREE, C, M, mat, group, part, mesh, box, cylinder, tube, explode, shell }); }
  function equipmentDetails() { return createEquipmentDetails({ THREE, C, M, mat, group, part, mesh, box, cylinder, tube, explode, shell }); }
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

  // Kept within the shared geometry contract so headless model checks exercise
  // exactly the same physical substitutions as the browser renderer.
  function electricMode(s) {
    const value=s.electrification || (s.view==='electrification'?s.variant:null);
    if(value==='ac')return 'overhead-ac';
    return ['fourth-rail-dc','third-rail-dc','overhead-dc','overhead-ac'].includes(value)?value:'fourth-rail-dc';
  }
  function powerTrace(parent,name,points,material,predicate=()=>true) {
    const g=group(parent,name);g.userData.circuitPath=points.map(point=>point.slice());
    tube(g,points,.027,material,{straight:true,segments:Math.max(2,points.length*3)});
    // Static topology: there are no decorative travelling current particles.
    registerAnimator(s=>{g.visible=predicate(s)&&s.mode!=='isolated'&&(s.exploded||0)<.15;});
    return g;
  }
  function powerPiece(parent,id,label,delta,at=[0,0,0]) {
    const p=part(parent,id,at);p.userData.explorationLabel=label;
    if(delta)explode(p,delta);return p;
  }
  function makePowerTransformer(parent,id='transformer',at=[0,0,0],scale=1) {
    const g=part(parent,id,at);g.scale.setScalar(scale);g.userData.explorationAssembly=id;
    box(g,[2.8,.15,2.15],M.steel,[0,.1,0]);
    const tank=powerPiece(g,'transformer-tank','Tank and cooling surfaces',[0,0,-1.9]);
    box(tank,[2.55,1.95,.09],M.teal,[0,1.14,-.91]);
    for(const x of [-1.28,1.28]){
      box(tank,[.08,1.95,1.9],M.teal,[x,1.14,0]);
      for(let z=-.8;z<=.8;z+=.2)box(tank,[.32,1.45,.035],M.steel,[x+Math.sign(x)*.15,1.12,z]);
    }
    const cover=group(g,'transformer-removable-front-cover');
    cover.userData.explorationLabel='Front cover';
    box(cover,[2.55,1.95,.065],M.teal,[0,1.14,.95]);shell(cover);explode(cover,[0,0,2.1]);
    const lid=group(g,'transformer-removable-tank-lid');box(lid,[2.7,.085,2.02],M.steel,[0,2.15,0]);shell(lid);explode(lid,[0,1.65,0]);
    lid.userData.explorationLabel='Tank lid';
    const core=powerPiece(g,'transformer-core','Laminated magnetic core',[0,.25,-.6]);
    for(const y of [.42,1.94])for(let z=-.06;z<=.06;z+=.06)box(core,[2.15,.22,.05],M.core,[0,y,z]);
    for(const x of [-.74,0,.74])for(let z=-.06;z<=.06;z+=.06)box(core,[.24,1.45,.05],M.core,[x,1.18,z]);
    const primary=powerPiece(g,'transformer-primary-winding','Primary winding groups',[-1.5,.55,1.0]);
    const secondary=powerPiece(g,'transformer-secondary-winding','Secondary winding groups',[1.5,.55,1.0]);
    for(const x of [-.74,0,.74])for(let y=.57;y<1.82;y+=.125){
      mesh(primary,torus(.29,.035,5,18),M.positive,[x,y,0],[Math.PI/2,0,0]);
      mesh(secondary,torus(.195,.03,5,18),M.copper,[x,y,0],[Math.PI/2,0,0]);
    }
    const terminals=powerPiece(g,'transformer-bushing','Insulated terminals',[0,1.8,0]);
    for(const z of [-.55,.55]){
      const row=group(terminals,z<0?'transformer-primary-terminal-row':'transformer-secondary-terminal-row');
      for(const x of [-.74,0,.74]){
        cylinder(row,.085,.45,M.white,[x,2.4,z],null,12);
        for(let y=2.24;y<2.56;y+=.09)cylinder(row,.12,.035,M.white,[x,y,z],null,12);
        cylinder(row,.035,.17,M.copper,[x,2.69,z],null,10);
      }
    }
    for (const node of [cover,lid,tank]) inspectionStage(node,'Expose the enclosure',0,.35);
    for (const node of [core,terminals]) inspectionStage(node,'Locate core and terminals',.35,.65);
    for (const node of [primary,secondary]) inspectionStage(node,'Compare the winding groups',.65,1);
    equipmentDetails().powerInterfaces(g,{kind:'transformer'});
    return g;
  }
  function makePowerRectifier(parent,id='rectifier',at=[0,0,0],scale=1) {
    const g=part(parent,id,at);g.scale.setScalar(scale);g.userData.explorationAssembly=id;
    box(g,[2.35,.15,2.05],M.steel,[0,.1,0]);
    for(const x of [-1.05,1.05])for(const z of [-.85,.85])box(g,[.07,2.15,.07],M.core,[x,1.2,z]);
    const cover=group(g,'rectifier-removable-front');box(cover,[2.2,2.05,.06],M.white,[0,1.2,1.0]);shell(cover);explode(cover,[0,0,1.9]);
    cover.userData.explorationLabel='Front cover';inspectionStage(cover,'Expose the enclosure',0,.3);
    for(const z of [-.42,.42]){
      const cooling=powerPiece(g,'rectifier-cooling','Heat-sink bank',[0,.15,Math.sign(z)*1.3]);
      inspectionStage(cooling,'Locate cooling and connections',.3,.65);
      for(let x=-.88;x<=.88;x+=.14)box(cooling,[.035,1.7,.3],M.aluminum,[x,1.15,z]);
      const stack=powerPiece(g,'rectifier-diode-stack','Clamped semiconductor devices',[0,.65,Math.sign(z)*.62]);
      inspectionStage(stack,'Inspect the device stacks',.65,1);
      for(const x of [-.65,0,.65]){
        cylinder(stack,.135,.12,M.dark,[x,1.15,z+.2],[Math.PI/2,0,0],16);
        for(const dz of [-.1,.1])cylinder(stack,.17,.045,M.copper,[x,1.15,z+.2+dz],[Math.PI/2,0,0],16);
        for(const dx of [-.19,.19])box(stack,[.035,.44,.3],M.steel,[x+dx,1.15,z+.2]);
      }
    }
    const buses=powerPiece(g,'rectifier-busbar','AC terminals and DC busbars',[0,1.4,0]);
    inspectionStage(buses,'Locate cooling and connections',.3,.65);
    for(const [y,z,face,material]of [[1.88,.9,.72,M.positive],[.47,-.65,-.32,M.negative]]){
      box(buses,[1.85,.07,.07],material,[0,y,z]);
      for(const x of [-.65,0,.65])tube(buses,[[x,y,z],[x,y,face],[x,1.15,face]],.022,M.copper,{straight:true,segments:5});
    }
    for(const x of [-.65,0,.65]){
      box(buses,[.075,.55,.075],M.copper,[x,2.0,-.64]);
      tube(buses,[[x,1.73,-.64],[x,1.4,-.12],[x,1.15,-.12]],.022,M.copper,{straight:true,segments:5});
      tube(buses,[[x,1.4,-.12],[x,1.4,.52],[x,1.15,.52]],.022,M.copper,{straight:true,segments:5});
    }
    equipmentDetails().powerInterfaces(g,{kind:'rectifier'});
    return g;
  }
  function makePowerSwitchgear(parent,id='ac-switchgear',at=[0,0,0],{dc=false,scale=1}={}) {
    const g=part(parent,id,at);g.scale.setScalar(scale);g.userData.explorationAssembly=id;
    box(g,[1.05,.12,1.15],M.steel,[0,.08,0]);
    for(const x of [-.51,.51])box(g,[.055,2.32,1.1],M.core,[x,1.25,0]);
    box(g,[1.05,2.3,.055],M.core,[0,1.25,-.55]);box(g,[1.05,.07,1.15],M.steel,[0,2.43,0]);
    const door=group(g,'switchgear-removable-front');box(door,[.98,2.25,.05],dc?M.teal:M.white,[0,1.25,.6]);
    box(door,[.43,.25,.035],M.dark,[0,1.94,.64]);box(door,[.045,.25,.035],M.dark,[.37,1.2,.64]);shell(door);explode(door,[0,0,1.5]);
    const bus=powerPiece(g,'switchgear-busbar','Main busbars',[0,1.15,-.2]);
    const xs=dc?[0]:[-.29,0,.29];
    for(const x of xs)box(bus,[.07,1.8,.075],M.copper,[x,1.32,-.28]);
    const poles=powerPiece(g,'switchgear-pole',dc?'DC breaker pole':'AC interrupter poles',[0,.15,.8]);
    for(const x of xs){
      cylinder(poles,dc?.16:.11,.75,M.white,[x,1.52,.04],null,12);
      for(const y of [1.06,1.96])box(poles,[.14,.09,.24],M.copper,[x,y,.06]);
      const contact=group(poles,'feeder-breaker-moving-contact',[x,1.05,.15]);
      box(contact,[.045,.39,.045],M.copper,[0,.195,0]);building.contacts.push(contact);
    }
    const drive=powerPiece(g,'switchgear-drive','Operating mechanism',[0,-.05,1.45]);
    box(drive,[.72,.34,.36],M.dark,[0,.55,.08]);cylinder(drive,.13,.65,M.steel,[0,.55,.18],[0,0,Math.PI/2],12);
    for(const x of xs)box(drive,[.04,.47,.04],M.steel,[x,.89,.1]);
    if(dc){
      const breaker=part(g,'breaker');
      const chute=powerPiece(breaker,'breaker-arc-chute','DC arc-chute plates',[0,.8,.8]);
      for(let y=1.61;y<2.25;y+=.08)box(chute,[.65,.035,.48],M.steel,[0,y,.25]);
    }
    equipmentDetails().powerInterfaces(g,{kind:'switchgear',dc});
    return g;
  }
  function makePantograph(parent,at=[0,3.78,0]) {
    const g=part(parent,'pantograph',at);g.userData.explorationAssembly='pantograph';
    for(const x of [-.6,.6])for(const z of [-.42,.42])cylinder(g,.07,.14,M.white,[x,0,z],null,10);
    const base=powerPiece(g,'pantograph-base','Roof insulators and base',[0,0,-.65]);
    box(base,[1.5,.08,1.05],M.core,[0,.1,0]);
    const arms=powerPiece(g,'pantograph-arms','Articulated arms',[0,.6,0]);
    for(const z of [-.24,.24])tube(arms,[[-.5,.16,z],[.6,.72,z],[-.15,1.32,z]],.035,M.steel,{straight:true,segments:4});
    const head=powerPiece(g,'pantograph-head','Contact strips and head',[0,1.1,0]);
    box(head,[.4,.065,1.45],M.core,[-.15,1.35,0]);
    for(const x of [-.27,-.03])box(head,[.07,.035,1.3],M.copper,[x,1.4025,0]);
    registerAnimator(s=>{g.visible=electricMode(s).startsWith('overhead');});g.visible=false;
    return g;
  }
  function makeWheelReturn(parent,at=[0,0,0]) {
    const g=part(parent,'wheel-return',at);
    cylinder(g,.085,.12,M.copper,[-1.02,.56,.88],[Math.PI/2,0,0],12);
    tube(g,[[-1.02,.56,.94],[-.72,.86,.93],[.0,1.1,.9]],.023,M.negative,{straight:true,segments:5});
    registerAnimator(s=>{g.visible=electricMode(s)!=='fourth-rail-dc';});g.visible=false;return g;
  }

  // Propulsion and control are independent selections. Specialist control
  // studies retain their named architecture while the surrounding vehicle can
  // still compare LIM and rotary propulsion. No real installation is prescribed.
  function controlTechnology(s, context) {
    const view = context || s.view;
    if (view === 'seltrac') return ['radio','g9'].includes(s.variant) ? 'radio' : 'loop';
    if (view === 'cbtc-network') return 'radio';
    if (view === 'signalling' || view === 'interlocking' || view === 'train-detection') return 'fixed';
    if (view === 'etcs') return s.variant === 'level-2' ? 'etcs2' : 'etcs1';
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

  // Each control alternative has replacement equipment, not just hidden loop
  // wires. These small arrangements are schematic context for the selected
  // vehicle; the dedicated architecture views explain their responsibilities.
  function makeSelectedControlEquipment(parent, length, context) {
    if (!['system','guideway','bogie','vehicle','control','communications'].includes(context)) return;
    const arrangements = {};
    const x = -length / 2 + .7, z = -2.05;
    const hasSeparateWayside = ['control','communications'].includes(context);
    function equipmentBox(host, component, at, height = 1.25) {
      const p = part(host, component, at);
      box(p, [.72,.1,.65], M.edge, [0,.05,0]);
      box(p, [.58,height,.46], M.core, [0,height/2+.1,0]);
      for (let y=.3;y<height;y+=.28) box(p,[.44,.13,.035],M.signal,[0,y,.25]);
      const door=group(p, 'control-equipment-cover');
      box(door,[.59,height-.07,.035],M.white,[0,height/2+.1,.3]);
      box(door,[.3,.12,.02],M.dark,[0,height*.75,.33]);
      shell(door);explode(door,[0,.1,.5]);
      return p;
    }
    function radioMast(host) {
      const p=part(host,'wayside-radio',[x,0,z]);
      box(p,[.64,.12,.64],M.edge,[0,.06,0]);
      cylinder(p,.05,2.7,M.steel,[0,1.47,0],null,10);
      for(const side of [-1,1])box(p,[.17,.63,.14],M.white,[side*.2,2.55,.04]);
      box(p,[.36,.4,.28],M.core,[0,.7,.1]);
      return p;
    }
    function signalPost(host, sx) {
      const p=part(host,'lineside-signal',[sx,0,z]);
      box(p,[.56,.1,.55],M.edge,[0,.05,0]);
      cylinder(p,.045,1.8,M.steel,[0,1,0],null,10);
      roundedPanel(p,.38,1.0,.19,M.dark,[0,2.17,0],.06);
      // Unlit aspects identify the equipment without issuing a route indication.
      for(const y of [1.88,2.17,2.46])cylinder(p,.105,.025,M.glass,[0,y,.11],[Math.PI/2,0,0],12);
      return p;
    }
    function transponders(host) {
      const tags=part(host,'balise');
      // Offset for legibility beside the reaction rail in the LIM example.
      for(const sx of [-.5,.5]) {
        roundedPanel(tags,.54,.085,.27,M.yellow,[sx,.29,-.43],.035);
        box(tags,[.38,.018,.17],M.dark,[sx,.345,-.43]);
      }
      return tags;
    }
    function informationPath(host, points) {
      const p=group(host,'selected-control-information-path');
      const line=tube(p,points,.013,M.signal,{segments:8});
      registerAnimator(s=>{p.visible=s.signals!==false&&(s.exploded||0)<.5;});
      return line;
    }
    const radio=arrangements.radio=group(parent,'selected-radio-control-equipment');
    if(!hasSeparateWayside){radioMast(radio);equipmentBox(radio,'zone-controller',[x+1.05,0,z],1.3);}
    transponders(radio);
    const fixed=arrangements.fixed=group(parent,'selected-fixed-block-equipment');
    signalPost(fixed,x+.15);
    const section=part(fixed,'fixed-block');
    for(const sx of [-length*.27,length*.27])box(section,[.055,.04,1.65],M.signal,[sx,.24,0]);
    const circuit=equipmentBox(fixed,'track-circuit',[x+1.05,0,z],.75);
    for(const rz of [-.72,.72])tube(circuit,[[0,.35,0],[.2,.12,.6],[-x-1.05,.12,rz-z]],.015,M.dark,{segments:6});
    const level1=arrangements.etcs1=group(parent,'selected-etcs-level-1-equipment');
    signalPost(level1,x+.15);transponders(level1);
    equipmentBox(level1,'leu',[x+1.05,0,z],1.0);
    informationPath(level1,[[x+1.05,.55,z+.25],[x+1.1,.35,-1.4],[.5,.35,-.43]]);
    const level2=arrangements.etcs2=group(parent,'selected-etcs-level-2-equipment');
    if(!hasSeparateWayside)radioMast(level2);
    transponders(level2);equipmentBox(level2,'rbc',[x+1.1,0,z],1.75);
    informationPath(level2,[[x+1.1,1.1,z+.25],[x+.4,1.25,z+.5],[x,1.45,z+.1]]);
    registerAnimator(s=>{
      const selected=controlTechnology(s,context);
      for(const [name,node]of Object.entries(arrangements))node.visible=name===selected;
    });
    for(const node of Object.values(arrangements))node.visible=false;
  }

  // Rails: conductor rails are paired vertically on ONE side of the guideway.
  function makeTrack(parent, length = 12, { detail = true, section = false } = {}) {
    const D = mechanicalDetails();
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
    D.mark(reaction,'LIM secondary reaction rail',{sources:['P02','P03'],function:'A passive conducting layer and backing iron form the selected track-side secondary. This is separate from supply and communication conductors.'});
    const trackContext = building.root.name.slice(5);
    registerAnimator(s=>{reaction.visible=(s.technology?.propulsion || 'lim')==='lim';});
    const moduleLength = 3;
    const modules = Math.ceil(length / moduleLength);
    for (let i = 0; i < modules; i++) {
      const from = -length / 2 + i * moduleLength;
      const to = Math.min(length / 2, from + moduleLength - .04);
      const len = to - from, cx = (from + to) / 2;
      if (len <= 0) continue;
      const segment=D.piece(reaction,'reaction-module-'+i,'Reaction-rail segment '+(i+1),undefined,{sources:['P02','P03']});
      const iron=D.piece(segment,'reaction-backing-iron','Backing iron',undefined,{sources:['P03'],function:'Provides the ferromagnetic backing in the selected single-sided secondary.'});
      const cap=D.piece(segment,'reaction-conducting-cap','Conducting secondary layer',undefined,{sources:['P03'],function:'Induced currents flow in the passive conducting layer; it is not a supplied traction conductor.'});
      const supports=D.piece(segment,'reaction-support-brackets','Reaction-rail support brackets',undefined,{sources:['P02'],function:'Fix the passive secondary to the guideway and carry its reaction into the support.'});
      box(iron, [len, .1, .4], M.core, [cx, .12, 0]);
      box(cap, [len, .025, .43], M.aluminum, [cx, .1825, 0]);
      if(detail)D.move(cap,[0,.23,0],'Separate secondary layers',[.45,1]);
      // A solid steel backing and conductive cap indicate the secondary layers.
      // The segmentation and supports are illustrative modelling choices.
      for (let x = from + .28; x < to; x += .8) {
        box(supports, [.13, .07, .67], M.core, [x, .035, 0]);
        if (detail) for (const z of [-.27, .27]) foot(supports, x, z);
      }
    }
    reaction.userData.functionalPaths=[{id:'secondary-reaction',label:'Secondary current and reaction support',description:'The primary field induces currents in the passive layer; the backing and brackets belong to the magnetic and mechanical interfaces. No supply lead is attached to this secondary.',steps:[{label:'Conducting layer',nodeName:'reaction-conducting-cap'},{label:'Backing iron',nodeName:'reaction-backing-iron'},{label:'Support brackets',nodeName:'reaction-support-brackets'}],sources:['P02','P03']}];
    const pos = part(g, 'positive-rail'), neg = part(g, 'negative-rail');
    for (const [p, y, color] of [[pos, .63, M.positive], [neg, .37, M.negative]]) {
      // Aluminum conductor body and a separate stainless side-contact cap.
      box(p, [length, .11, .11], M.aluminum, [0, y, 1.18]);
      box(p, [length, .11, .025], M.steel, [0, y, 1.112]);
      box(p, [length, .018, .018], color, [0, y + .062, 1.12]);
    }
    const supports = group(g, 'conductor-rail-supports');
    const returnSupports=group(supports,'separate-return-insulators');
    const covers = group(supports, 'power-rail-coverboards');
    box(covers, [length, .045, .31], M.white, [0, .79, 1.22]);
    box(covers, [length, .56, .035], M.white, [0, .505, 1.385]);
    if (section) shell(covers);
    for (let x = -length / 2 + .4; x < length / 2; x += detail ? 1.2 : 2.4) {
      box(supports, [.1, .65, .1], M.core, [x, .28, 1.43]);
      cylinder(supports,.06,.16,M.white,[x,.63,1.34],[Math.PI/2,0,0],12);
      cylinder(returnSupports,.06,.16,M.white,[x,.37,1.34],[Math.PI/2,0,0],12);
      if (detail) for (const z of [-.72, .72]) {
        box(run, [.24, .035, .31], M.core, [x, -.01, z]);
        for (const dz of [-.13, .13]) cylinder(run, .026, .04, M.steel, [x, .028, z + dz], null, 6);
      }
    }
    const overhead=group(g,'overhead-line-arrangement');
    const wire=part(overhead,'overhead-contact-wire');
    tube(wire,[[-length/2,5.2,0],[length/2,5.2,0]],.025,M.copper,{straight:true,segments:2});
    tube(wire,[[-length/2,5.95,0],[0,5.65,0],[length/2,5.95,0]],.025,M.steel,{segments:10});
    for(let x=-length/2+.5;x<length/2;x+=1.6)tube(wire,[[x,5.2,0],[x,5.68+Math.abs(x)/(length/2)*.25,0]],.012,M.steel,{straight:true,segments:2});
    const poles=part(overhead,'overhead-support');
    for(const x of [-length/2+.5,length/2-.5]){
      box(poles,[.65,.16,.65],M.edge,[x,-.05,-2.15]);
      box(poles,[.12,6.2,.12],M.steel,[x,3.1,-2.15]);
      tube(poles,[[x,5.85,-2.15],[x,5.85,.35]],.045,M.steel,{straight:true,segments:2});
      tube(poles,[[x,5.25,-2.15],[x,5.85,-.8]],.035,M.steel,{straight:true,segments:2});
      for(const z of [-1.6,-1.42,-1.24])cylinder(poles,.09,.055,M.white,[x,5.85,z],[Math.PI/2,0,0],10);
    }
    const returnBond=part(g,'running-rail-return');
    for(const z of [-.72,.72])tube(returnBond,[[-length/2+.25,.1,z],[-length/2+.25,.1,1.6]],.025,M.negative,{straight:true,segments:2});
    box(returnBond,[.35,.22,.36],M.core,[-length/2+.25,.11,1.65]);
    registerAnimator(s=>{const mode=electricMode(s),over=mode.startsWith('overhead');pos.visible=supports.visible=!over;neg.visible=returnSupports.visible=mode==='fourth-rail-dc';overhead.visible=over;returnBond.visible=mode!=='fourth-rail-dc';});
    overhead.visible=returnBond.visible=false;
    if (!['seltrac','cbtc-network','etcs','signalling','interlocking','train-detection'].includes(trackContext)) makeLoopEquipment(g,length,trackContext);
    makeSelectedControlEquipment(g,length,trackContext);
    return g;
  }

  function makeCollector(parent, at = [0, 0, 0]) {
    const g = part(parent, 'collector', at);g.userData.explorationAssembly='collector';
    const shoes=[];
    for (const y of [.37, .63]) {
      const shoe=powerPiece(g,y<.5?'collector-return-shoe':'collector-positive-shoe',y<.5?'Separate-return shoe':'Supply shoe',[0,y<.5?-.15:.2,.5]);shoes.push(shoe);
      tube(shoe, [[-.2, .9, .77], [-.2, y + .08, .93], [.03, y, 1.035]], .035, M.core);
      box(shoe, [.34, .08, .065], M.dark, [.03, y, 1.078]);
      box(shoe, [.29, .07, .018], M.copper, [.03, y, 1.117]);
      cylinder(shoe, .068, .1, M.white, [-.2, .9, .77], [Math.PI / 2, 0, 0]);
    }
    registerAnimator(s=>{const mode=electricMode(s);g.visible=!mode.startsWith('overhead');shoes[0].visible=mode==='fourth-rail-dc';});
    return g;
  }

  function makePrimary(parent, position = [0, .5, 0], length = 1.75, detailed = false) {
    const g = part(parent, 'lim-primary', position);
    const primaryContext = building.root.name.slice(5);
    registerAnimator(s=>{g.visible=primaryContext==='lim'||(s.technology?.propulsion || 'lim')==='lim';});
    mechanicalDetails().primaryDetail(g, { length, detailed });
    return g;
  }

  function selectedMechanism(s) {
    if(!['vehicle','services','bogie'].includes(s.view))return null;
    if(['doors','door-control'].includes(s.selected))return 'doors';
    if(s.selected==='compressor')return 'compressor';
    if(s.selected==='hvac')return 'air';
    if(['brakes','parking-brake','brake-control'].includes(s.selected))return 'brakes';
    if(s.view==='bogie'||['bogie','tachometer','rotary-traction-motor','traction-gearbox'].includes(s.selected))return 'wheelset';
    return s.view==='services'?'doors':null;
  }
  function mechanismProgress(s) { return Math.max(0,Math.min(1,Number(s.phase||0)/5)); }
  function wheelsetAngle(s) { return selectedMechanism(s)==='wheelset'?mechanismProgress(s)*Math.PI*2:0; }
  function vehicleDoorPose(s) {
    const p=selectedMechanism(s)==='doors'?mechanismProgress(s):0,ramp=(a,b)=>Math.max(0,Math.min(1,(p-a)/(b-a))),smooth=x=>x*x*(3-2*x);
    let opening=p<.52?smooth(ramp(.2,.40)):1-smooth(ramp(.55,.78));
    let lock=p<.2?1-ramp(.08,.16):ramp(.82,.90);
    if(s.scenario==='door-open'){opening=1;lock=0;}
    const closed=opening<1e-6,locked=closed&&lock>=.999;
    return {opening,lock,closed,locked,reported:locked&&(p<.08||p>=.96),phase:p};
  }
  function makeBogie(parent, position = [0, 0, 0], detailed = true) {
    const frame = group(parent, 'bogie-assembly', position);
    frame.userData.explorationAssembly = 'bogie';
    const D = mechanicalDetails(), E = equipmentDetails();
    D.mark(frame, 'Bogie assembly', { function: 'Two suspension levels carry the vehicle load to wheelsets while propulsion, braking and collection retain separate roles.' });
    const g = part(frame, 'bogie');
    const chassis = D.piece(g, 'bogie-frame-and-suspension', 'Frame and suspension');
    const wheelsets = [];
    for (const x of [-1.02, 1.02]) {
      const wheelset = D.piece(g, `wheelset-${x < 0 ? 'rear' : 'front'}`, x < 0 ? 'Rear wheelset' : 'Front wheelset'); wheelsets.push(wheelset);
      const axle = D.piece(wheelset, 'wheelset-axle', 'Axle', [x, .56, 0], { function: 'Carries both wheels and bearing journals on one axis.', interfaces: ['Wheel hubs', 'Bearing inner races', 'Axle gear when rotary propulsion is selected'] });
      cylinder(axle, .075, 2.12, M.steel, [0, 0, 0], [Math.PI / 2, 0, 0]);
      registerAnimator(s=>{axle.rotation.z=wheelsetAngle(s);});
      for (const z of [-.72, .72]) {
        const wheel = D.piece(wheelset, 'wheel-'+(z>0?'near':'far'), 'Wheel tread, flange and hub', [x,.56,z], { function: 'The tread supports the vehicle on the rail; the flange provides a guidance interface. This is not a contact-profile specification.' });
        cylinder(wheel, .365, .19, M.steel, [0,0,0], [Math.PI / 2, 0, 0], 32);
        cylinder(wheel, .4, .035, M.core, [0,0,z > 0 ? -.105 : .105], [Math.PI / 2, 0, 0], 32);
        cylinder(wheel, .14, .215, M.core, [0,0,0], [Math.PI / 2, 0, 0]);
        for(let i=0;i<6;i++){const angle=i*Math.PI/3;cylinder(wheel,.018,.014,M.aluminum,[Math.cos(angle)*.2,Math.sin(angle)*.2,Math.sign(z)*.103],[Math.PI/2,0,0],6);}
        const axlebox = D.axlebox(wheelset,{at:[x,.56,Math.sign(z)*.99],side:Math.sign(z),detailed});
        registerAnimator(s=>{const angle=wheelsetAngle(s);wheel.rotation.z=angle;axlebox.bearing.animate(angle*Math.sign(z));});
        if (detailed) {
          const brake = E.discBrake(frame, { component:'brakes', at:[x,.56,Math.sign(z)*.47], discRadius:.245, discThickness:.055, axleRadius:.075, context:'vehicle' });
          // Orient the actuator toward the bogie end: an upright actuator at
          // this disc plane would occupy the longitudinal frame beam.
          brake.node.rotation.z=-Math.sign(x)*Math.PI/2;
          const bracket=D.piece(brake.node,'brake-frame-reaction-bracket','Caliper-to-frame reaction bracket',undefined,{sources:['DP01','MD01'],function:'The stationary caliper reacts into the frame through a separate bracket; the rotating disc remains coaxial with the wheelset.'});
          box(bracket,[.4,.05,.06],M.core,[-Math.sign(x)*.2,.27,Math.sign(z)*.13]);
          D.move(brake.node,[0,0,Math.sign(z)*.55],'Locate brake interfaces',[.2,.5]);
          registerAnimator(s=>{const p=mechanismProgress(s),application=selectedMechanism(s)==='brakes'?p<.5?Math.min(1,p/.25):Math.max(0,1-(p-.65)/.3):0;brake.rotate(wheelsetAngle(s));brake.apply(application);});
        }
      }
      explode(wheelset, [Math.sign(x) * .38, -.08, 0]);
      inspectionStage(wheelset,'Locate the wheelsets',.55,.85);
    }
    for (const z of [-.55, .55]) box(chassis, [2.65, .17, .18], M.teal, [0, .96, z]);
    for (const x of [-.83, .83]) box(chassis, [.2, .16, 1.25], M.teal, [x, .97, 0]);
    D.suspension(chassis,{detailed});
    explode(chassis, [0, .85, 0]);
    inspectionStage(chassis,'Expose the supporting frame',0,.3);
    frame.userData.functionalPaths=[{id:'vertical-load',label:'Body to rail load path',description:'Body support → secondary air spring → frame → primary spring → axlebox bearing → axle and wheel → running rail. Lines show load relationships, not a stress solution.',steps:[{label:'Body interface',nodeName:'air-spring-body-interface'},{label:'Secondary spring',nodeName:'secondary-air-spring-near'},{label:'Frame',nodeName:'bogie-frame-and-suspension'},{label:'Primary spring',nodeName:'primary-spring-front-near'},{label:'Axlebox',nodePath:['wheelset-front','axlebox-near']},{label:'Bearing',nodePath:['wheelset-front','axlebox-near','axle-bearing']},{label:'Wheel',nodePath:['wheelset-front','wheel-near']},{label:'Running rail',conceptId:'running-rail'}],sources:['MD01','P10']}];
    makePrimary(frame, [0, .37, 0], 1.68, detailed);
    const rotary=group(frame,'selected-rotary-drive');
    const motor=part(rotary,'rotary-traction-motor',[-.72,.6975,-.45]);
    motor.userData.explorationLabel = 'Traction motor';
    const motorDetails=D.rotaryMotor(motor,{detailed});
    // The motor and gearbox pinion share one straight z-axis. A separate
    // coupling spans the space between their housings; this is not a bent shaft.
    const shaft=group(motor,'straight-motor-pinion-shaft',[0,0,.585]);
    D.mark(shaft,'Motor-to-pinion coupling',{sources:['MD02','MD04'],function:'A coaxial mechanical coupling transfers rotor torque to the gearbox pinion.'});
    cylinder(shaft,.055,.49,M.aluminum,[0,0,0],[Math.PI/2,0,0],12);
    cylinder(shaft,.105,.13,M.steel,[0,0,-.08],[Math.PI/2,0,0],12);
    for(let i=0;i<4;i++){const a=i*Math.PI/2;cylinder(shaft,.017,.15,M.dark,[Math.cos(a)*.075,Math.sin(a)*.075,-.08],[Math.PI/2,0,0],6);}
    const gear=part(rotary,'traction-gearbox',[-1.02,.56,.36]);
    gear.userData.explorationLabel = 'Gearbox';
    D.gearboxSupports(gear);
    // A hollow teaching housing: a solid block would conceal the gears even
    // after its removable front was opened.
    roundedPanel(gear,1.05,.7,.045,M.core,[0,0,-.16],.08);
    for(const x of [-.50,.50])box(gear,[.045,.66,.3],M.core,[x,0,0]);
    for(const y of [-.3275,.3275])box(gear,[1.05,.045,.3],M.core,[0,y,0]);
    const gearCover=group(gear,'removable-gearbox-cover');gearCover.userData.explorationLabel='Gearbox cover';roundedPanel(gearCover,1.03,.68,.035,M.teal,[0,0,.17],.07);shell(gearCover);explode(gearCover,[0,0,.4]);
    // The axle gear is centred on the wheelset axle. The pinion is offset
    // radially by approximately the sum of the two illustrative pitch radii.
    const contactAngle=Math.atan2(.1375,.30),gearModule=.22*2/24;
    for(const [x,y,r,teeth] of [[0,0,.22,24],[.30,.1375,.11,12]]){
      const wheel=group(gear,'illustrative-gear',[x,y,.02]);
      D.mark(wheel,r>.15?'24-tooth axle gear':'12-tooth pinion',{sources:['MD02','MD03'],function:r>.15?'The axle gear turns at half the pinion speed in this original two-to-one example.':'The input pinion meshes with the axle gear using the same illustrative module.'});
      wheel.userData.gearPitchRadius=r;wheel.userData.gearToothCount=teeth;
      wheel.userData.gearModule=gearModule;wheel.userData.gearProfile='schematic, not involute';
      cylinder(wheel,r-gearModule*1.25,.07,M.steel,[0,0,0],[Math.PI/2,0,0],Math.max(24,teeth*2));
      // Common pitch and 24:12 teeth agree with the illustrated 1:2 speed
      // ratio. These tapered teeth are schematic, not a manufactured profile.
      for(let i=0;i<teeth;i++){
        const a=i*Math.PI*2/teeth,root=r-gearModule*1.25,tip=r+gearModule;
        const halfWidth=Math.PI*gearModule*.24,shape=new THREE.Shape();
        shape.moveTo(root,-halfWidth);shape.lineTo(tip,-halfWidth*.65);
        shape.lineTo(tip,halfWidth*.65);shape.lineTo(root,halfWidth);shape.closePath();
        const tooth=new THREE.ExtrudeGeometry(shape,{depth:.085,bevelEnabled:false});tooth.translate(0,0,-.0425);
        mesh(wheel,tooth,M.aluminum,[0,0,0],[0,0,a]);
      }
      const phaseOffset=r>.15?contactAngle:contactAngle+Math.PI-Math.PI/teeth;
      registerAnimator(s=>{wheel.rotation.z=phaseOffset+wheelsetAngle(s)*(r>.15?1:-2);});
    }
    D.mark(rotary,'Selected rotary drive',{sources:['MD02','MD04']});
    rotary.userData.functionalPaths=[{id:'torque-path',label:'Rotor to wheelset torque path',description:'The rotating drive is separate from stationary stator, bearing and casing support. The illustrated ratio follows the authored 12:24 tooth counts.',steps:[{label:'Stator input',nodeName:'motor-terminal-box'},{label:'Rotor',nodeName:'motor-rotor'},{label:'Coupling',nodeName:'straight-motor-pinion-shaft'},{label:'Pinion and axle gear',conceptId:'traction-gearbox'},{label:'Driven wheelset',conceptId:'bogie'}],sources:['MD02','MD03','MD04']}];
    registerAnimator(s=>{rotary.visible=s.technology?.propulsion==='rotary';shaft.rotation.z=motorDetails.rotor.rotation.z=-wheelsetAngle(s)*2;});rotary.visible=false;
    explode(motor, [0, .3, -.65]); explode(gear, [0, .1, .65]);
    const pickup=part(frame,'loop-pickup',[.38,.65,-.43]);
    box(pickup,[.45,.12,.24],M.dark);
    for(let x=-.15;x<.2;x+=.07)box(pickup,[.025,.018,.2],M.copper,[x,-.068,0]);
    tube(pickup,[[.12,.06,0],[.3,.19,0],[.3,.35,.2]],.022,M.dark,{segments:5});
    const pickupContext=building.root.name.slice(5);
    registerAnimator(s=>{pickup.visible=pickupContext!=='seltrac'&&controlTechnology(s,pickupContext)==='loop';});
    pickup.visible=!['seltrac','cbtc-network','etcs','signalling','interlocking','train-detection'].includes(pickupContext);

    const baliseReader=part(frame,'etcs-onboard',[.48,.66,-.42]);
    roundedPanel(baliseReader,.58,.10,.34,M.white);
    box(baliseReader,[.44,.03,.24],M.dark,[0,-.065,0]);
    tube(baliseReader,[[.22,.035,0],[.32,.19,0],[.32,.33,.2]],.018,M.dark,{segments:5});
    registerAnimator(s=>{baliseReader.visible=['etcs1','etcs2'].includes(controlTechnology(s,pickupContext));});
    baliseReader.visible=false;

    makeWheelReturn(frame);
    const collector = makeCollector(frame, [.5, 0, 0]);
    collector.userData.explorationLabel = 'Current collector'; explode(collector, [0, .25, .55]);
    if (detailed) makeWheelSensor(wheelsets[1]);
    frame.userData.inspectionRecipe=[
      {label:'Open covers and locate the frame',start:0,end:.3},
      {label:'Separate support and interface groups',start:.3,end:.65},
      {label:'Reveal the working interiors',start:.65,end:1},
    ];
    for(const entry of building.exploded){
      let owner=entry.node;while(owner&&owner!==frame)owner=owner.parent;if(owner!==frame)continue;
      const label=entry.node.userData.inspectionStage||'',name=entry.node.name;
      const stage=/Open|Expose the supporting frame|Locate the mounting frame|Expose the motor interior/.test(label)||/cover|lid|enclosure/.test(name)?0:/rolling elements|winding groups|rotor and stator|Friction pair/i.test(label)?2:1;
      const recipe=frame.userData.inspectionRecipe[stage];entry.inspectionOwnerRanges=new Map([[frame,[recipe.start,recipe.end]]]);
    }
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
    const detail=equipmentDetails().hvac(parent,{component:'hvac',at:position,scale:.36,context:'vehicle'});
    detail.node.userData.explorationLabel='Installed roof air-treatment module';
    registerAnimator(s=>detail.animate(selectedMechanism(s)==='air'?mechanismProgress(s)*2:0));
    explode(detail.node,[0,.6,0]);return detail.node;
  }
  function makeWheelSensor(parent) {
    const g=part(parent,'tachometer',[1.02,.56,.88]);
    const E=equipmentDetails(),encoder=E.inspect(group(g,'axle-speed-target-wheel'),'Rotating speed target',{sources:['T06','MD01'],description:'The target rotates with the axle while the sensing head stays with the support. Twelve visual marks are illustrative, not a specified encoder count.'});
    cylinder(encoder,.17,.035,M.signal,[0,0,0],[Math.PI/2,0,0],16);
    cylinder(encoder,.1,.065,M.dark,[0,0,.04],[Math.PI/2,0,0],12);
    for(let i=0;i<12;i++)box(encoder,[.035,.04,.025],M.aluminum,[Math.cos(i*Math.PI/6)*.15,Math.sin(i*Math.PI/6)*.15,.025]);
    const sensor=E.inspect(group(g,'fixed-axle-speed-sensor',[.19,.13,.04]),'Fixed axle-speed sensing head',{sources:['T06','MD01'],description:'A stationary sensing head observes the passing target; wheel rotation is not the same as vehicle ground speed.'});box(sensor,[.13,.13,.15],M.signal);
    registerAnimator(s=>{encoder.rotation.z=wheelsetAngle(s);});
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
      registerAnimator(s=>{
        const selected=controlTechnology(s,communicationsContext);
        module.visible=id==='tcms'||(id==='atp'&&selected!=='fixed')||(id==='ato'&&['loop','radio'].includes(selected));
      });
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
    const compressor=equipmentDetails().reciprocatingCompressor(train,{at:[-.15,.62,1.0],scale:.42});
    registerAnimator(s=>compressor.animate(selectedMechanism(s)==='compressor'?mechanismProgress(s)*Math.PI*4:0));
    explode(compressor.node,[0,.15,1.25]);
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
      const waysideContext=building.root.name.slice(5);
      registerAnimator(s=>{zc.visible=['loop','radio'].includes(controlTechnology(s,waysideContext));});
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

  function makeVehicleDoor(parent,x,side,{detailed=true}={}) {
    const E=equipmentDetails(),sources=['MD07','MD08'],g=part(parent,'doors',[x,2.45,side*1.36]);
    E.inspect(g,'Installed two-leaf sliding doorway',{sources,description:'A coupled external-sliding belt-drive example. Pocket, spindle, independent-leaf and plug-door arrangements differ.'});
    g.userData.explorationAssembly='doors';g.userData.inspectionDirection=[.35,.2,side];
    for(const direction of [-1,1])box(g,[.065,1.78,.12],M.edge,[direction*.735,0,0]);
    for(const y of [-.88,.88])box(g,[1.54,.065,.12],M.edge,[0,y,0]);
    const leaves=[];
    for(const direction of [-1,1]){
      const leaf=E.inspect(group(g,'sliding-door-leaf',[direction*.35,0,side*.045]),direction>0?'Right sliding leaf':'Left sliding leaf',{sources,description:'The leaf translates along its guides. Its target travels with it; the fixed contact does not.'});
      roundedPanel(leaf,.65,1.65,.06,M.white,[0,0,0],.04);
      roundedPanel(leaf,.48,.78,.025,M.glass,[0,.33,side*.04],.03);
      box(leaf,[.025,1.62,.075],M.dark,[-direction*.31,0,0]);
      const target=E.inspect(group(leaf,'vehicle-door-closed-target',[0,.80,side*.12]),'Moving closed-position target',{sources});box(target,[.07,.06,.06],M.copper);
      const keeper=E.inspect(group(leaf,'vehicle-door-lock-keeper',[direction*.08,.82,side*.015]),'Leaf lock keeper',{sources});box(keeper,[.09,.06,.08],M.steel);
      leaves.push({node:leaf,direction});
      if(detailed)E.separate(leaf,leaf.userData.explorationLabel,[direction*.2,0,side*.55],{stage:'Expose leaves and guides',range:[.6,1],sources});
    }
    const control=part(g,'door-control',[0,.95,0]);
    E.inspect(control,'Door operator, controller and evidence interfaces',{sources,description:'A belt transmits motor motion to the leaves. Local position and lock observations remain separate from a supervisory request.'});
    control.userData.explorationAssembly='door-control';
    const rail=E.inspect(group(control,'vehicle-door-guide-rail'),'Fixed hanger rail',{sources});box(rail,[2.78,.065,.14],M.steel,[0,.095,0]);
    const motor=E.inspect(group(control,'vehicle-door-drive-motor',[-1.12,0,-side*.12]),'Door drive motor and reduction',{sources});cylinder(motor,.095,.23,M.teal,[0,0,0],[Math.PI/2,0,0],14);
    const pulleys=[];
    for(const direction of [-1,1]){
      const pulley=E.inspect(group(control,'vehicle-door-drive-pulley',[direction*1.10,0,side*.12]),direction<0?'Driven belt pulley':'Return belt pulley',{sources});
      cylinder(pulley,.063,.055,M.steel,[0,0,0],[Math.PI/2,0,0],16);box(pulley,[.10,.012,.012],M.copper,[0,0,side*.034]);pulley.userData.pitchRadius=.075;pulleys.push(pulley);
    }
    const belt=E.inspect(group(control,'vehicle-door-drive-belt'),'Opposed runs of the endless belt',{sources,description:'The two leaves attach to opposite belt runs and travel in opposite directions. Belt geometry and speed are illustrative.'});
    for(const y of [-.075,.075])box(belt,[2.2,.024,.024],M.dark,[0,y,side*.12]);
    for(const direction of [-1,1])mesh(belt,new THREE.TorusGeometry(.075,.012,6,18,Math.PI),M.dark,[direction*1.1,0,side*.12],[0,0,-direction*Math.PI/2]);
    const carriers=[],bolts=[],contacts=[];
    for(const direction of [-1,1]){
      const carrier=E.inspect(group(control,'vehicle-door-hanger',[direction*.35,0,0]),direction>0?'Right leaf hanger and belt clamp':'Left leaf hanger and belt clamp',{sources,description:'The hanger translates with the leaf while the rail stays fixed.'});
      box(carrier,[.11,.09,.11],M.aluminum,[0,.06,0]);box(carrier,[.055,.16,.055],M.steel,[0,-.08,0]);
      box(carrier,[.07,.035,.04],M.copper,[0,-direction*.075,side*.12]);
      box(carrier,[.025,.16,.12],M.steel,[0,-direction*.02,side*.06]);carriers.push({node:carrier,direction});
      const contact=E.inspect(group(control,'vehicle-door-closed-contact',[direction*.35,-.15,side*.19]),direction>0?'Right closed-position contact':'Left closed-position contact',{sources});box(contact,[.11,.08,.055],M.dark);
      const led=cylinder(contact,.023,.015,new THREE.MeshBasicMaterial({color:C.service}),[0,0,side*.035],[Math.PI/2,0,0],8);contacts.push(led);
      const lock=E.inspect(group(control,'vehicle-door-lock-bolt',[direction*.43,-.09,side*.015]),direction>0?'Right leaf lock bolt':'Left leaf lock bolt',{sources,description:'The lock engages after closure in this authored example. Its position is independent of the closed-position target.'});box(lock,[.035,.11,.04],M.steel);bolts.push(lock);
    }
    const controller=E.inspect(group(control,'vehicle-door-controller-board',[.48,.21,-side*.05]),'Local door controller',{sources});box(controller,[.49,.045,.20],M.service);box(controller,[.13,.035,.13],M.core,[0,.04,0]);
    const terminal=E.terminalStrip(control,{name:'vehicle-door-interface-terminals',at:[-.24,.20,-side*.05],labels:['Supply','Request','Closed return','Locked return'],kind:'information',sources});terminal.scale.setScalar(.43);
    const lockIndication=E.inspect(group(control,'vehicle-door-locked-proof',[.90,.20,side*.12]),'Separate returned locked indication',{sources,description:'Returned closed-and-locked evidence follows the mechanism; a request alone is not evidence.'});
    const proofLight=cylinder(lockIndication,.03,.02,new THREE.MeshBasicMaterial({color:C.service}),[0,0,0],[Math.PI/2,0,0],10);
    const cover=group(control,'vehicle-door-header-cover');box(cover,[2.85,.32,.045],M.white,[0,.075,side*.245]);box(cover,[2.85,.035,.38],M.white,[0,.25,0]);shell(cover);
    if(detailed){E.separate(cover,'Door header cover',[0,.55,side*.55],{stage:'Open enclosure',range:[0,.3],sources});E.separate(controller,'Local controller',[0,.35,-side*.3],{stage:'Locate command and evidence interfaces',range:[.3,.6],sources});}
    E.paths(g,[{id:'vehicle-door-drive',label:'Drive to leaf travel',description:'The local drive turns a pulley. Opposite belt runs move two supported leaves in opposite directions.',steps:[{label:'Motor',nodeName:'vehicle-door-drive-motor'},{label:'Pulley',nodeName:'vehicle-door-drive-pulley'},{label:'Belt',nodeName:'vehicle-door-drive-belt'},{label:'Hanger',nodeName:'vehicle-door-hanger'},{label:'Leaf',nodeName:'sliding-door-leaf'}],sources},{id:'vehicle-door-evidence',label:'Request, position and lock evidence',description:'Input terminals, controller, moving position target, lock and returned indication are separate interfaces.',steps:[{label:'Terminals',nodeName:'vehicle-door-interface-terminals'},{label:'Controller',nodeName:'vehicle-door-controller-board'},{label:'Target',nodeName:'vehicle-door-closed-target'},{label:'Contact',nodeName:'vehicle-door-closed-contact'},{label:'Lock',nodeName:'vehicle-door-lock-bolt'},{label:'Return',nodeName:'vehicle-door-locked-proof'}],sources}]);
    registerAnimator(s=>{
      const pose=vehicleDoorPose(s),travel=.66*pose.opening;g.userData.doorPose=pose;
      for(const leaf of leaves)leaf.node.position.x=leaf.direction*(.35+travel);
      for(const carrier of carriers)carrier.node.position.x=carrier.direction*(.35+travel);
      for(const pulley of pulleys)pulley.rotation.z=travel/.075;
      for(const bolt of bolts)bolt.position.y=-.09+(1-pose.lock)*.11;
      for(const led of contacts)led.material.color.set(pose.closed?C.service:C.warning);
      proofLight.material.color.set(pose.reported?C.service:C.warning);
    });
    return g;
  }
  function makeTrain(parent, { scale = 1, at = [0, 0, 0], full = true, energyRole = 'subject' } = {}) {
    const train = group(parent, 'train', at); train.scale.setScalar(scale);
    const body = part(train, 'carbody');
    const L = 16, W = 2.6;
    box(body, [L, .18, W], M.core, [0, 1.39, 0]);
    box(body, [L - .4, .055, W - .12], M.white, [0, 1.51, 0]);
    for (const side of [-1, 1]) {
      const sideGroup = group(body, `body-side-${side}`);
      const skin=group(sideGroup,'carbody-side-skin');
      for(const [left,right]of [[-8,-3.92],[-2.38,2.38],[3.92,8]]){
        const width=right-left,cx=(right+left)/2;
        roundedPanel(skin,width,.72,.09,M.white,[cx,1.94,side*W/2],.05);
        box(skin,[width,.17,.055],M.teal,[cx,1.74,side*(W/2+.05)]);
        box(skin,[width,.04,.06],M.yellow,[cx,1.84,side*(W/2+.055)]);
        roundedPanel(skin,width,.72,.075,M.white,[cx,3.17,side*W/2],.05);
      }
      box(skin,[L,.14,.08],M.white,[0,3.48,side*W/2]);
      for (const x of [-6.4, -4.75, -1.65, 0, 1.65, 4.75, 6.4]) {
        roundedPanel(skin, 1.33, .84, .052, M.glass, [x, 2.68, side * (W / 2 + .05)], .07);
        box(skin, [1.18, .025, .015], M.steel, [x, 2.85, side * (W / 2 + .084)]);
      }
      for (const x of [-3.15, 3.15]) {
        makeVehicleDoor(sideGroup,x,side,{detailed:full});
        box(sideGroup, [1.4, .08, .15], M.steel, [x, 1.57, side * (W / 2 + .04)]);
      }
      // A body section removes skin; it must retain the door machinery being
      // taught. Hiding the complete side used to hide the near-side doors too.
      if (side === 1) shell(skin);
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
    box(pcu,[2.3,.08,1.45],M.core,[0,-.22,0]);
    const converterCover=group(pcu,'traction-converter-removable-cover');box(converterCover,[2.3,.07,1.45],M.steel,[0,.24,0]);shell(converterCover);explode(converterCover,[0,.8,0]);
    const dcLink=powerPiece(pcu,'dc-link','DC-link capacitors',[0,.55,-.65]);
    for(const x of [-.8,-.35,.1])cylinder(dcLink,.15,.3,M.negative,[x,0,.25],null,12);
    const modules=powerPiece(pcu,'inverter-power-module','Motor-inverter power modules',[0,.55,.65]);
    for(const x of [.42,.73,1.04])box(modules,[.21,.29,.85],M.teal,[x,0,-.1]);
    for (let x = -.94; x <= .95; x += .16) box(pcu, [.045,.35,.08],M.steel,[x,0,-.77]);
    box(pcu, [.42, .3, .04], M.teal, [-.58, 0, .8]);
    const apu = part(train, 'apu', [1.1, .95, 0]);
    box(apu, [1.5, .48, 1.35], M.white);
    for (let x = -.5; x <= .5; x += .12) box(apu, [.055, .25, .04], M.core, [x, 0, .69]);
    const battery = part(train, 'vehicle-battery', [2.7, .98, -.15]);
    box(battery, [.95, .4, 1.1], M.dark);
    for (const x of [-.3, 0, .3]) box(battery, [.2, .28, .8], M.steel, [x, .08, 0]);
    explode(pcu, [0, .2, -1.6]); explode(apu, [0, .2, 1.5]); explode(battery, [0, .2, 1.5]);
    const pantograph=makePantograph(train);
    const onboard=makePowerTransformer(train,'onboard-transformer',[1.15,.15,0],.4);
    const line=part(train,'line-converter',[-.05,.96,0]);
    box(line,[1.05,.08,1.3],M.core,[0,-.22,0]);
    const lineModules=powerPiece(line,'line-converter-module','Line-converter semiconductor modules',[0,.6,0]);
    for(const x of [-.33,0,.33])box(lineModules,[.22,.32,1.0],M.teal,[x,0,0]);
    const lineCover=group(line,'line-converter-removable-cover');box(lineCover,[1.05,.06,1.3],M.steel,[0,.23,0]);shell(lineCover);explode(lineCover,[0,.8,0]);
    const braking=part(train,'onboard-braking-resistor',[2.1,3.78,0]);
    box(braking,[1.5,.08,1.2],M.core);
    for(let x=-.6;x<=.6;x+=.15)box(braking,[.055,.28,1.05],M.brake,[x,.18,0]);
    const brakeCover=group(braking,'onboard-resistor-guard');for(const z of [-.62,.62])box(brakeCover,[1.5,.38,.035],M.steel,[0,.18,z]);shell(brakeCover);explode(brakeCover,[0,.65,0]);
    registerAnimator(s=>{const ac=electricMode(s)==='overhead-ac';onboard.visible=line.visible=braking.visible=ac;apu.position.x=ac?2.6:1.1;battery.position.set(ac?-1.8:2.7,ac?.435:.98,ac?0:-.15);});
    onboard.visible=line.visible=braking.visible=false;
    const fourth=s=>electricMode(s)==='fourth-rail-dc',third=s=>electricMode(s)==='third-rail-dc',overDC=s=>electricMode(s)==='overhead-dc',overAC=s=>electricMode(s)==='overhead-ac';
    const traction=s=>s.mode!=='coasting'&&s.scenario!=='door-open'&&(energyRole!=='receiver'||s.mode==='regeneration'&&s.receptivity==='train');
    const railFeed=[[-4.47,.63,1.117],[-4.2,1.08,1],[-3.1,1.24,.86],[-1.8,1.24,.6]];
    powerTrace(train,'conductor-shoe-to-dc-link',railFeed,M.positive,s=>fourth(s)||third(s));
    powerTrace(train,'separate-return-shoe-path',[[-1.8,.89,.72],[-3.2,.76,.9],[-4.25,.69,1],[-4.47,.37,1.117]],M.negative,fourth);
    powerTrace(train,'dc-running-rail-return-path',[[-1.8,.89,.72],[-4.2,1.1,.9],[-6.02,.56,.94],[-6.02,.56,.72],[-6.02,.195,.72]],M.negative,s=>third(s)||overDC(s));
    powerTrace(train,'overhead-dc-roof-to-dc-link',[[-.15,5.2,0],[-.15,3.9,.8],[-.5,3.75,1.27],[-.5,1.24,1.27],[-1.8,1.24,.6]],M.positive,overDC);
    // Two separate AC circuits: no line joins a transformer primary terminal to
    // its secondary terminal. The magnetic core is their energy interface.
    powerTrace(train,'pantograph-to-transformer-primary',[[-.15,5.2,0],[-.15,3.9,.8],[1.0,3.75,1.27],[1.0,1.8,1.27],[.854,1.266,-.22]],M.positive,overAC);
    powerTrace(train,'ac-primary-wheel-return',[[1.446,1.266,-.22],[1.5,1.12,.9],[-4.2,1.1,.9],[-6.02,.56,.94],[-6.02,.56,.72],[-6.02,.195,.72]],M.negative,overAC);
    powerTrace(train,'transformer-secondary-to-line-converter',[[.854,1.266,.22],[.4,1.25,.5],[-.05,1.14,.5]],M.copper,overAC);
    powerTrace(train,'transformer-secondary-return',[[-.05,1.14,-.5],[.4,1.25,-.5],[1.446,1.266,.22]],M.copper,overAC);
    powerTrace(train,'line-converter-to-dc-link',[[-.55,.98,.45],[-1.8,1.12,.45]],M.positive,overAC);
    powerTrace(train,'line-converter-dc-link-return',[[-1.8,.84,-.45],[-.55,.84,-.45]],M.negative,overAC);
    for(const x of [-5,5]){
      powerTrace(train,'lim-motor-power-path',[[-1.8,1.2,-.6],[x,1.2,-.6],[x+.55,.48,-.27]],M.service,s=>traction(s)&&s.technology?.propulsion!=='rotary');
      powerTrace(train,'rotary-motor-power-path',[[-1.8,1.2,-.6],[x,1.2,-.6],[x-.72,1.05,-.55],[x-.72,.9375,-.35]],M.service,s=>traction(s)&&s.technology?.propulsion==='rotary');
    }
    powerTrace(train,'dc-link-auxiliary-feed',[[-1.8,1.12,.6],[.35,1.22,.77],[1.1,1.22,.6]],M.positive,s=>!overAC(s));
    powerTrace(train,'dc-link-auxiliary-return',[[1.1,.95,.7],[.3,.84,.85],[-1.8,.84,.72]],M.negative,s=>!overAC(s));
    powerTrace(train,'ac-auxiliary-dc-feed',[[-1.8,1.12,.6],[2.6,1.22,.77]],M.positive,overAC);
    powerTrace(train,'ac-auxiliary-dc-return',[[2.6,.95,.7],[-1.8,.84,.72]],M.negative,overAC);
    const resistorActive=s=>overAC(s)&&s.mode==='regeneration'&&s.receptivity==='resistor'&&energyRole!=='receiver'&&s.scenario!=='door-open';
    powerTrace(train,'onboard-chopper-resistor-feed',[[-1.8,1.12,.6],[-1.0,1.2,1.28],[-1.0,3.8,1.28],[2.1,3.98,.5]],M.brake,resistorActive);
    powerTrace(train,'onboard-resistor-return',[[2.1,3.98,-.5],[-.9,3.8,-1.28],[-.9,.84,-1.28],[-1.8,.84,-.6]],M.negative,resistorActive);
    const heat=group(braking,'resistor-heat-destination');
    for(const x of [-.45,0,.45])tube(heat,[[x,.4,0],[x-.08,.6,0],[x+.08,.8,0]],.02,M.brake,{segments:6});
    registerAnimator(s=>{heat.visible=resistorActive(s);});heat.visible=false;
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
      const pole=group(g,z<0?'supply-isolator-pole':'separate-return-isolator-pole');
      if(z>0)registerAnimator(s=>{pole.visible=electricMode(s)==='fourth-rail-dc';});
      for (const x of [-.27, .27]) {
        cylinder(pole, .08, .43, M.white, [x, .28, z], null, 12);
        cylinder(pole, .12, .045, M.steel, [x, .5, z], null, 12);
      }
      const contact = group(pole, 'isolating-contact', [-.27, .55, z]);
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
    for(let i=0;i<3;i++)makePowerSwitchgear(g,'ac-switchgear',[-5.8+i*.88,.08,-2.1],{scale:.8});
    const tx=makePowerTransformer(g,'transformer',[-1.7,.1,-1.85]);
    const rec=makePowerRectifier(g,'rectifier',[1.85,.1,-1.85]);
    const dcFeeders=group(g,'dc-feeder-switchgear-arrangement');
    for(let i=0;i<3;i++)makePowerSwitchgear(dcFeeders,'dc-switchgear',[4.5+i*.87,.08,-2.1],{dc:true,scale:.8});
    const acFeeders=group(g,'ac-feeder-switchgear-arrangement');
    for(let i=0;i<2;i++)makePowerSwitchgear(acFeeders,'ac-feeder-switchgear',[3.7+i*1.5,.08,-2.1],{scale:1});
    const returnTerminal=part(g,'supply-return-terminal',[6.8,.1,.03]);
    box(returnTerminal,[.6,.5,.5],M.core,[0,.25,0]);box(returnTerminal,[.65,.07,.12],M.negative,[0,.53,.12]);
    registerAnimator(s=>{const ac=electricMode(s)==='overhead-ac';rec.visible=dcFeeders.visible=!ac;acFeeders.visible=ac;});acFeeders.visible=false;
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
    registerAnimator(s=>{resistorBank.visible=electricMode(s)!=='overhead-ac';});
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
    powerTrace(g,'incoming-supply-connection',[[-6.3,.25,-.95],[-3.8,.25,-.9],[-2.44,2.79,-2.4]],M.copper);
    const dcOnly=s=>electricMode(s)!=='overhead-ac',acOnly=s=>electricMode(s)==='overhead-ac';
    powerTrace(g,'transformer-to-rectifier',[[-.96,2.79,-1.3],[.2,2.5,-1.3],[1.2,2.1,-2.49]],M.copper,dcOnly);
    powerTrace(g,'rectifier-positive-bus',[[2.8,1.98,-.95],[3.7,1.98,-.95],[3.9,.38,-.55],[7,.38,-.55]],M.positive,dcOnly);
    powerTrace(g,'rectifier-return-bus',[[7,.25,.03],[3.7,.25,.03],[3.15,.57,-2.5],[2.8,.57,-2.5]],M.negative,dcOnly);
    powerTrace(g,'ac-transformer-to-feeder',[[-.96,2.79,-1.3],[.3,2.6,-1.3],[3.7,2.1,-2.38]],M.copper,acOnly);
    powerTrace(g,'ac-feeder-output',[[5.2,2.0,-2.04],[6.1,1,-1.0],[7,.38,-.55]],M.positive,acOnly);
    powerTrace(g,'ac-transformer-return',[[7,.25,.03],[.2,.25,.03],[-2.44,2.79,-1.3]],M.negative,acOnly);
    powerTrace(g,'wayside-resistor-feed',[[7,.38,-.55],[7.3,.45,.5],[6.5,.45,1.3],[4.2,.7,1.3]],M.brake,s=>dcOnly(s)&&s.mode==='regeneration'&&s.receptivity==='resistor');
    powerTrace(g,'wayside-resistor-return',[[4.2,.45,1.45],[6.6,.25,1.5],[7.45,.25,.55],[7,.25,.03]],M.negative,s=>dcOnly(s)&&s.mode==='regeneration'&&s.receptivity==='resistor');
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
    for(const profile of ['fourth-rail-dc','third-rail-dc','overhead-dc','overhead-ac']){
      const overhead=profile.startsWith('overhead'),feed=overhead?[3.03,5.2,0]:[3.03,.63,1.117],ret=profile==='fourth-rail-dc'?[3.03,.37,1.117]:[3.03,.195,.72];
      const active=s=>electricMode(s)===profile;
      powerTrace(root,`${profile}-supply-feeder`,[stationPoint([7,.38,-.55]),[3.5,.36,4],[4,overhead?3.5:.49,0],railPoint(feed)],M.positive,active);
      powerTrace(root,`${profile}-return-feeder`,[railPoint(ret),[3.7,.29,.2],[3,.24,4.5],stationPoint([7,.25,.03])],M.negative,active);
      const receiverPath=s=>active(s)&&s.mode==='regeneration'&&s.receptivity==='train';
      powerTrace(railway,`${profile}-receiving-train-supply`,[feed,[-14.97,feed[1],feed[2]]],M.service,receiverPath);
      powerTrace(railway,`${profile}-receiving-train-return`,[[-14.97,ret[1],ret[2]],ret],M.negative,receiverPath);
    }
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
    const roofContext=group(root,'roof-collection-context');
    box(roofContext,[2,.08,1.6],M.edge,[0,3.65,0]);makePantograph(roofContext);
    const wheelContext=group(root,'wheel-return-context');
    for(const z of [-.72,.72])cylinder(wheelContext,.365,.12,M.steel,[-1.02,.56,z],[Math.PI/2,0,0],20);
    cylinder(wheelContext,.065,1.6,M.steel,[-1.02,.56,0],[Math.PI/2,0,0],12);makeWheelReturn(wheelContext);
    registerAnimator(s=>{roofContext.visible=electricMode(s).startsWith('overhead');wheelContext.visible=electricMode(s)!=='fourth-rail-dc';});roofContext.visible=wheelContext.visible=false;
    powerTrace(root,'guideway-conductor-supply',[[-4.4,.63,1.117],[.63,.63,1.117],[.4,.9,.8]],M.positive,s=>!electricMode(s).startsWith('overhead'));
    powerTrace(root,'guideway-separate-return',[[.4,.9,.7],[.63,.37,1.117],[-4.4,.37,1.117]],M.negative,s=>electricMode(s)==='fourth-rail-dc');
    powerTrace(root,'guideway-overhead-collection',[[-4.4,5.2,0],[-.15,5.2,0],[-.15,3.9,.3]],M.positive,s=>electricMode(s).startsWith('overhead'));
    arrow(root, [-.9, .23, -1.2], [1.7, .23, -1.2], C.field);
  }
  {
    const root = startModel('vehicle'); makeTrack(root, 21, { detail: false }); makeTrain(root);
    arrow(root, [3.5, .15, -2.25], [7, .15, -2.25], C.field);
  }
  {
    const root = startModel('bogie'); makeTrack(root, 5.7, { detail: true, section: true });
    const bogie = makeBogie(root); explode(bogie, [0, .6, 0]);
    const roofContext=group(root,'roof-collection-context');box(roofContext,[2,.08,1.6],M.edge,[0,3.65,0]);makePantograph(roofContext);
    registerAnimator(s=>{roofContext.visible=electricMode(s).startsWith('overhead');});roofContext.visible=false;
    arrow(root, [-1.2, .24, -1.25], [1.5, .24, -1.25], C.field);
  }
  {
    const root = startModel('lim');
    const D=mechanicalDetails();
    box(root, [6.4, .18, 3], M.deck, [0, -.12, 0]);
    const secondary = part(root, 'reaction-rail');
    D.mark(secondary,'Passive LIM secondary',{sources:['P02','P03']});
    const iron = D.piece(secondary, 'back-iron','Backing iron',undefined,{sources:['P03'],function:'Ferromagnetic backing of the selected single-sided secondary.'});
    box(iron, [5.5, .14, .7], M.core, [0, .08, 0]);
    const cap = D.piece(secondary, 'aluminum-cap','Conducting aluminium layer',undefined,{sources:['P03'],function:'The selected conductive plate carries induced currents without a direct supply connection.'});
    box(cap, [5.55, .035, .78], M.aluminum, [0, .1675, 0]);
    D.move(cap, [0, .23, 0],'Separate secondary layers',[.45,1]);
    const brackets=D.piece(secondary,'secondary-support-brackets','Secondary support brackets',undefined,{sources:['P02'],function:'Fix the reaction rail to the guideway. The visible motor air gap remains free of any mechanical connection.'});
    for (const x of [-2.3, -1.55, -.8, -.05, .7, 1.45, 2.2]) {
      box(brackets, [.14, .1, 1.07], M.core, [x, -.005, 0]);
      for (const z of [-.46, .46]) foot(brackets, x, z);
    }
    secondary.userData.functionalPaths=[{id:'secondary-force',label:'Field coupling and secondary support',description:'Conductive layer → backing iron → support brackets. This mechanical and magnetic relationship is separate from the train supply circuit.',steps:[{label:'Conducting layer',nodeName:'aluminum-cap'},{label:'Backing iron',nodeName:'back-iron'},{label:'Guideway brackets',nodeName:'secondary-support-brackets'}],sources:['P02','P03']}];
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
      signal(root,[[-4.85,3.75,4.2],[-3,5.2,3],[-1,5,1],[-.7,4.18,.45]],'radio');
      signal(root,[[-6.15,1.2,4.6],[-5.5,1.3,4.9],[-4.85,.95,4.45]],'wayside-link');
      signal(root,[[.2,.32,-.43],[.2,.8,-.43],[.6,1.65,-.43],[3,1.9,-.4],[6.6,2.45,-.15]],'balise-link');
    }
  }

  function registerAnimator(fn) { building.animators.push(fn); }
  const modelApi={THREE,C,M,mat,startModel,group,part,mesh,box,cylinder,torus,tube,roundedPanel,explode,shell,foot,makeTrack,makeTrain,makePrimary,makeBogie,cabinet,makeSubstation,makePowerTransformer,makePowerRectifier,makePowerSwitchgear,powerTrace,registerAnimator};
  function ensureModel(id) {
    if(models.has(id)){if(!models.get(id).instances)buildAssemblyIndex(models.get(id));return true;}
    if(Object.hasOwn(TRACK_VIEWS,id))buildTrackView(id,modelApi);
    else if(Object.hasOwn(SIGNALLING_VIEWS,id))buildSignallingView(id,modelApi);
    else if(Object.hasOwn(STATION_VIEWS,id))buildStationView(id,modelApi);
    else if(Object.hasOwn(OCC_VIEWS,id))buildOccView(id,modelApi);
    else if(Object.hasOwn(COMMUNICATIONS_VIEWS,id))buildCommunicationsView(id,modelApi);
    else if(Object.hasOwn(POWER_CAMERAS,id))buildPowerView(id,modelApi);
    else if(Object.hasOwn(STUDY_CAMERAS,id))buildStudyView(id,modelApi);
    else if(Object.hasOwn(OPERATIONS_VIEWS,id))buildOperationsView(id,modelApi);
    else if(Object.hasOwn(PLATFORM_VIEWS,id))buildPlatformView(id,modelApi);
    else if(Object.hasOwn(NETWORK_VIEWS,id))buildNetworkView(id,modelApi);
    if(models.has(id))buildAssemblyIndex(models.get(id));
    return models.has(id);
  }
  function updateAssembly() {
    for (const record of models.values()) {
      restoreIsolation(record); restoreSeparation(record);
      for (const node of record.shells) node.visible = !state.cutaway;
    }
    cachedComponentBounds = null;
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
    if (!r) return;
    // A mask never becomes an animator's input. Re-evaluate the real variant
    // visibility before masking it again, and compose separation after motion.
    restoreIsolation(r); restoreSeparation(r);
    for (const node of r.shells) node.visible = !state.cutaway;
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
      const technologyPath=connection.kind==='loop-link'?controlType==='loop':connection.kind==='balise-link'?['radio','etcs1','etcs2'].includes(controlType):controlRadioPath?['radio','etcs2'].includes(controlType):true;
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
    // Record architecture/variant availability before any exploration mask.
    // A removed cover remains an available part of the active assembly.
    const shellSet=new Set(r.shells),available=new Set();
    function availability(node,parentAvailable){const active=parentAvailable&&(node.visible||(state.cutaway&&shellSet.has(node)));if(active&&node.userData.instanceId)available.add(node.userData.instanceId);for(const child of node.children)availability(child,active);}
    availability(r.root,true);r.inspectionAvailability=available;
    applySeparation(r, { ...state, amount: state.exploded, scope: state.explodeScope, componentId: state.selected });
    if (state.isolation && !applyIsolation(r, state.isolation, { instanceId: state.isolationInstanceId, allInstances: state.allInstances })) { state.isolation = null; state.isolationInstanceId = null; }
    cachedComponentBounds = null;
    updateSelection();
    updateFunctionalPath();
  }
  function updateSelection() {
    const r = models.get(state.view);
    visibleBounds(state.selected ? assemblyRoots(r, state.selected, state) : [], selectionBounds);
    selectionCorners.visible = !selectionBounds.isEmpty();
    if (!selectionCorners.visible) return;
    selectionBounds.expandByScalar(.06);
    const size = selectionBounds.getSize(new THREE.Vector3()), length = Math.min(.34, Math.max(.055, Math.min(size.x, size.y, size.z) * .23)), vertices = [];
    for (const x of [selectionBounds.min.x, selectionBounds.max.x]) for (const y of [selectionBounds.min.y, selectionBounds.max.y]) for (const z of [selectionBounds.min.z, selectionBounds.max.z]) {
      const corner = [x, y, z], directions = [x === selectionBounds.min.x ? 1 : -1, y === selectionBounds.min.y ? 1 : -1, z === selectionBounds.min.z ? 1 : -1];
      for (let axis = 0; axis < 3; axis++) { const end = [...corner]; end[axis] += directions[axis] * length; vertices.push(...corner, ...end); }
    }
    selectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    selectionGeometry.computeBoundingSphere();
  }
  function updateFunctionalPath() {
    const record = models.get(state.view);
    const path = state.functionalPath && assemblyFunctionalPaths(record, state.selectedInstanceId).find(item => item.id === state.functionalPath);
    const points = [];
    for (const step of path?.steps || []) {
      const node = instanceNode(record, step.instanceId), bounds = node && visibleBounds(node);
      if (bounds && !bounds.isEmpty()) points.push(bounds.getCenter(new THREE.Vector3()));
    }
    functionalLine.visible = points.length > 1;
    if (!functionalLine.visible) return;
    functionalGeometry.setFromPoints(points); functionalLine.computeLineDistances();
    functionalGeometry.computeBoundingSphere();
  }
  function clearStructuralExploration() {
    labelAnchorInstances.clear();
    for (const record of models.values()) { restoreIsolation(record); restoreSeparation(record); }
    if (state.explodeScope === 'selected') state.exploded = 0;
    state.explodeScope = 'all'; state.isolation = null; state.focused = null;
    state.selectedInstanceId = null; state.isolationInstanceId = null; state.focusedInstanceId = null; state.functionalPath = null;
    frameBeforeExploration = null; cachedComponentBounds = null;
  }
  function setView(id) {
    if (!ensureModel(id)) return;
    if (state.view !== id) { clearStructuralExploration(); state.phase = 0; state.playing = false; }
    state.view = id;
    ground.position.y=VIEW[id].groundY??-.27;
    grid.position.y=ground.position.y+.015;
    for (const [key, value] of models) value.root.visible = key === id;
    updateAssembly(); animateModel(); resetCamera(); requestRender();
  }
  function rememberFrame() {
    if (frameBeforeExploration) return;
    frameBeforeExploration = { view: state.view, position: camera.position.clone(), target: controls.target.clone(),
      minDistance: controls.minDistance, maxDistance: controls.maxDistance, far: camera.far, zoom:camera.zoom, projectionView:camera.view?{...camera.view}:null };
  }
  function restoreFrame() {
    if (!frameBeforeExploration || frameBeforeExploration.view !== state.view) return false;
    const previous = frameBeforeExploration; frameBeforeExploration = null;
    camera.position.copy(previous.position); controls.target.copy(previous.target);
    controls.minDistance = previous.minDistance; controls.maxDistance = previous.maxDistance;
    camera.far = previous.far; camera.zoom=previous.zoom;
    if(previous.projectionView?.enabled){const v=previous.projectionView;camera.setViewOffset(v.fullWidth,v.fullHeight,v.offsetX,v.offsetY,v.width,v.height);}else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    state.focused = null; state.focusedInstanceId = null; controls.update(); requestRender(); return true;
  }
  function viewFocus(){return (state.view === 'station' ? STATION_FOCUS : state.view === 'platform-interface' ? PLATFORM_FOCUS : null)?.[state.variant];}
  function frameRoots() {
    const record = models.get(state.view);
    const focused = state.focused && assemblyRoots(record, state.focused, { instanceId: state.focusedInstanceId, allInstances: state.allInstances });
    const groupName = viewFocus()?.group;
    const focusGroup = groupName && record.root.getObjectByName(groupName);
    return focused?.length ? focused : focusGroup && nodeVisible(focusGroup) ? [focusGroup] : [record.root];
  }
  function resetCamera() {
    const config = viewFocus() || VIEW[state.view];
    state.focused = null;
    if (!state.isolation) frameBeforeExploration = null;
    camera.position.set(...config.camera); controls.target.set(...config.target);
    fitToView(); controls.update(); requestRender();
  }
  function fitToView(nodes = null) {
    if(container.clientWidth<=0||container.clientHeight<=0)return false;
    camera.clearViewOffset(); camera.zoom=1; camera.updateProjectionMatrix();
    const authored = !nodes && !state.focused && !state.isolation && viewFocus()?.bounds;
    const bounds = authored ? new THREE.Box3(new THREE.Vector3(...authored.min),new THREE.Vector3(...authored.max)) : visibleBounds(nodes||frameRoots());
    const fit = fitPerspectiveBounds(bounds, { direction: camera.position.clone().sub(controls.target),
      up: camera.up, fov: camera.fov, aspect: camera.aspect, padding:state.view==='railway'?1.05:1.16 });
    if (!fit) return false;
    if (!compatibility) {
      const center=bounds.getCenter(new THREE.Vector3()),span=Math.max(2,bounds.getSize(new THREE.Vector3()).length()*.62);
      key.target.position.copy(center);key.position.copy(center).add(new THREE.Vector3(-.48,.92,.56).normalize().multiplyScalar(span*2.8));
      Object.assign(key.shadow.camera,{left:-span,right:span,top:span,bottom:-span,near:.1,far:span*6});
      key.shadow.normalBias=Math.min(.035,span*.002);key.shadow.camera.updateProjectionMatrix();
    }
    controls.target.copy(fit.target); camera.position.copy(fit.position);
    controls.minDistance = fit.minimumDistance;
    controls.maxDistance = Math.max(VIEW[state.view].distance * 1.65, fit.distance * 2);
    camera.far = fit.far; camera.updateProjectionMatrix();
    // A shallow overview is asymmetric in perspective. Explicit assembly
    // framing also reserves the measured toolbar overlay, so an exposed part
    // cannot be fitted underneath the controls. Orbiting does not call this fit.
    const overview=state.view==='railway'&&!state.focused&&!state.isolation;
    const workplace=['operations-centre','occ-workplace','occ-equipment'].includes(state.view);
    const width=container.clientWidth,height=container.clientHeight;
    const footer=container.parentElement?.querySelector('.stage-footer');
    const footerHeight=footer&&getComputedStyle(footer).position==='absolute'?footer.offsetHeight:0;
    if(overview||workplace||footerHeight>0&&(nodes||state.focused||state.isolation)){
      camera.lookAt(controls.target);camera.updateMatrixWorld(true);
      const points=[];
      if(workplace){
        // Fit the occupied mesh silhouette, not the empty upper corners of the
        // room AABB. This is why an otherwise large room used to sit at the
        // bottom of a mostly blank stage. The floor still contributes bounds.
        for(const root of nodes||frameRoots())root.traverseVisible(o=>{
          if(!o.isMesh)return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;
          if(!b)return;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])points.push(new THREE.Vector3(x,y,z).applyMatrix4(o.matrixWorld).project(camera));
        });
      }else for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])points.push(new THREE.Vector3(x,y,z).project(camera));
      const left=Math.min(...points.map(p=>p.x)),right=Math.max(...points.map(p=>p.x)),bottom=Math.min(...points.map(p=>p.y)),top=Math.max(...points.map(p=>p.y));
      const bottomEdge=-1+2*(footerHeight+12)/height,topEdge=.92;
      camera.zoom=Math.min(overview?1.35:workplace?1.55:1,1.88/(right-left),(topEdge-bottomEdge)/(top-bottom));
      const center=(topEdge+bottomEdge)/2;
      camera.setViewOffset(width,height,(left+right)*camera.zoom*width/4,(center-(top+bottom)*camera.zoom/2)*height/2,width,height);
      camera.updateProjectionMatrix();
    }
    return true;
  }
  function frameSelection(id = state.selected) {
    const roots = assemblyRoots(models.get(state.view), id, state);
    if (!roots.length) return false;
    rememberFrame(); state.focused = id; state.focusedInstanceId = state.selectedInstanceId;
    fitToView(roots); controls.update(); requestRender(); return true;
  }
  function frameModel() {
    state.focused = null; state.focusedInstanceId = null;
    if (!state.isolation) frameBeforeExploration = null;
    const fitted = fitToView(); controls.update(); requestRender(); return fitted;
  }
  function inspectAssembly(id = state.selected) {
    const record = models.get(state.view);
    if (!explorationCapabilities(record, id, state).canExplodeSelected) return false;
    setSelected(id);
    rememberFrame();
    state.playing = false;
    state.cutaway = false;
    state.explodeScope = 'selected'; state.exploded = 1; state.focused = id;
    state.focusedInstanceId = state.selectedInstanceId;
    state.isolation=id;state.isolationInstanceId=state.selectedInstanceId;
    const inspected=instanceNode(record,state.selectedInstanceId);
    for(let owner=inspected;owner;owner=owner.parent)if(owner.userData.inspectionDirection){
      const direction=new THREE.Vector3(...owner.userData.inspectionDirection).applyQuaternion(owner.getWorldQuaternion(new THREE.Quaternion())).normalize();
      camera.position.copy(controls.target).addScaledVector(direction,Math.max(2,camera.position.distanceTo(controls.target)));break;
    }
    updateAssembly(); animateModel(); fitToView(); controls.update(); requestRender();
    return true;
  }
  function restoreExploration() {
    state.exploded = 0; state.explodeScope = 'all'; state.cutaway = false;
    state.isolation = null; state.focused = null;
    state.isolationInstanceId = null; state.focusedInstanceId = null; state.functionalPath = null;
    restoreIsolation(models.get(state.view));
    updateAssembly(); animateModel();
    if (!restoreFrame()) { fitToView(); controls.update(); }
    requestRender();
  }
  function setSelected(id, { instanceId = null } = {}) {
    const record = models.get(state.view), next = id || null;
    const requested = instanceNode(record, instanceId);
    const retained = state.selected === next && instanceNode(record, state.selectedInstanceId);
    // Restore the mask for target resolution, then compose it again below. A
    // repeated catalogue synchronization preserves the specific clicked part.
    restoreIsolation(record);
    const target = requested?.userData.conceptId === next ? requested : retained || assemblyRoots(record, next)[0];
    const nextInstanceId = next ? target?.userData.instanceId || null : null;
    const changed = state.selected !== next || state.selectedInstanceId !== nextInstanceId;
    let restoreSurroundings = false;
    if (changed) {
      // Drilling into a child of an isolated assembly retains that assembly.
      // Selecting equipment elsewhere restores its surroundings first.
      if (state.isolation) {
        restoreIsolation(record);
        const isolated = assemblyRoots(record, state.isolation, { instanceId: state.isolationInstanceId, allInstances: state.allInstances });
        const selected = assemblyRoots(record, next, { instanceId: nextInstanceId, allInstances: state.allInstances });
        if (!selected.length || !selected.every(node => isolated.some(root => within(node, root)))) {
          state.isolation = null; state.isolationInstanceId = null; restoreSurroundings = true;
        }
      }
      if (state.explodeScope === 'selected') { state.explodeScope = 'all'; state.exploded = 0; }
      if (state.focused !== next || state.focusedInstanceId !== nextInstanceId) { state.focused = null; state.focusedInstanceId = null; }
      state.functionalPath = null;
    }
    state.selected = next; state.selectedInstanceId = nextInstanceId;
    animateModel();
    if (restoreSurroundings && !restoreFrame()) frameModel();
    requestRender();
    return { explodeScope: state.explodeScope, isolation: state.isolation, focused: state.focused, exploded: state.exploded };
  }
  function setIsolation(id = null) {
    const record = models.get(state.view), previous = state.isolation;
    const nextInstanceId = id === state.selected ? state.selectedInstanceId : null;
    if (id === previous && state.isolationInstanceId === nextInstanceId) return true;
    restoreIsolation(record);
    if (id && !assemblyRoots(record, id, { instanceId: nextInstanceId, allInstances: state.allInstances }).length) {
      if (previous) applyIsolation(record, previous, { instanceId: state.isolationInstanceId, allInstances: state.allInstances });
      return false;
    }
    if (id) rememberFrame();
    state.isolation = id || null; state.focused = id || null;
    state.isolationInstanceId = id ? nextInstanceId : null; state.focusedInstanceId = state.isolationInstanceId;
    animateModel();
    if (id) { fitToView(); controls.update(); }
    else if (!restoreFrame()) frameModel();
    requestRender(); return true;
  }
  function selectInstance(instanceId, { notify = true } = {}) {
    const record = models.get(state.view), node = instanceNode(record, instanceId);
    // Availability is recorded before section and isolation masks. A covered
    // active part is selectable; hardware belonging to another arrangement is not.
    if (!node?.userData.conceptId || record.inspectionAvailability && !record.inspectionAvailability.has(instanceId)) return false;
    if (state.selectedInstanceId === instanceId && state.selected === node.userData.conceptId && !state.allInstances) return true;
    state.allInstances = false;
    setSelected(node.userData.conceptId, { instanceId });
    if (notify) onSelect(node.userData.conceptId, { instanceId });
    return true;
  }
  function setAllInstances(value) {
    if (state.allInstances === Boolean(value)) return state.allInstances;
    state.allInstances = Boolean(value);
    animateModel(); if (state.focused || state.isolation) { fitToView(); controls.update(); }
    requestRender(); return state.allInstances;
  }
  function setInspectionMode(mode) {
    if (!['assembled', 'section', 'inspection'].includes(mode)) return false;
    if (mode === 'inspection') return inspectAssembly();
    state.playing = false; state.exploded = 0; state.explodeScope = 'all'; state.cutaway = mode === 'section';
    updateAssembly(); animateModel(); fitToView(); controls.update(); requestRender(); return true;
  }
  function getInspectionState() {
    const record = models.get(state.view);
    if (!record?.instances) buildAssemblyIndex(record);
    const selected = instanceNode(record, state.selectedInstanceId);
    return { selectedInstanceId: state.selectedInstanceId, conceptId: state.selected, allInstances: state.allInstances,
      mode: state.exploded > 0 ? 'inspection' : state.cutaway ? 'section' : 'assembled', functionalPath: state.functionalPath,
      selected: instanceMetadata(selected),
      tree: assemblyTree(record, { selectedInstanceId: state.selectedInstanceId, conceptId: state.selected, allInstances: state.allInstances }),
      ancestors: instanceAncestors(record, state.selectedInstanceId),
      stages: explorationCapabilities(record, state.selected, state).inspectionStages,
      functionalPaths: assemblyFunctionalPaths(record, state.selectedInstanceId) };
  }
  function setFunctionalPath(id = null) {
    const paths = assemblyFunctionalPaths(models.get(state.view), state.selectedInstanceId);
    state.functionalPath = paths.some(path => path.id === id) ? id : null;
    updateFunctionalPath(); requestRender(); return state.functionalPath;
  }
  function setExplodeScope(scope) {
    const selected = scope === 'selected' && explorationCapabilities(models.get(state.view), state.selected, state).canExplodeSelected;
    const next = selected ? 'selected' : 'all';
    if (next === state.explodeScope) return next;
    state.explodeScope = next;
    animateModel(); fitToView(); controls.update(); requestRender(); return state.explodeScope;
  }
  function setCameraPreset(id = 'isometric') {
    if (id === 'isometric') return resetCamera();
    const config = VIEW[state.view], target = new THREE.Vector3(...config.target);
    const d = new THREE.Vector3(...config.camera).distanceTo(target);
    controls.target.copy(target);
    camera.position.copy(target).add(id === 'top' ? new THREE.Vector3(.001, d, .001) : new THREE.Vector3(0, d * .17, d));
    fitToView(); controls.update(); requestRender();
  }
  function frameVariant() {
    if (!['station', 'platform-interface'].includes(state.view)) return false;
    resetCamera(); return true;
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
      const id = hit.object.userData.component, instanceId = hit.object.userData.pickInstanceId;
      state.allInstances = false; setSelected(id, { instanceId }); onSelect(id, { instanceId: state.selectedInstanceId });
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
    // Poses are evaluated from absolute phase, so use elapsed time even when
    // the compatibility renderer draws slowly. Visibility changes reset time.
    const dt = lastTime ? Math.max(0, (time - lastTime) / 1000) : 0; lastTime = time;
    const moving = state.playing && !document.hidden && !reducedMotion.matches;
    if (moving) { Object.assign(state, advancePlayback(state.phase, dt, state)); animateModel(); renderPending = true; }
    if (settleFrames > 0) { controls.update(); settleFrames--; }
    if ((renderPending || moving || settleFrames > 0) && (!compatibility || time - lastDraw > 90)) {
      if(compatibility)drawWithEnclosureOcclusion(scene,state,()=>renderer.render(scene,camera));else renderer.render(scene,camera);
      renderPending = false; lastDraw = time;
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
    studioEnvironment.dispose(); renderer.dispose(); renderer.domElement.remove();
  }

  setView('system'); resize(); animateModel(); frame = requestAnimationFrame(loop);
  onReady({ view: state.view, components: [...models.get(state.view).parts.keys()], renderer: rendererKind });
  return {
    setView,
    getInspectionState, selectInstance, setAllInstances, setInspectionMode, setFunctionalPath,
    getRenderDiagnostics() {
      let visibleMeshes=0,triangles=0;models.get(state.view)?.root.traverseVisible(node=>{if(!node.isMesh)return;visibleMeshes++;triangles+=(node.geometry.index?.count||node.geometry.attributes.position?.count||0)/3;});
      return {renderer:rendererKind,environment:studioEnvironment.enabled,shadows:!compatibility,visibleMeshes,triangles:Math.round(triangles),pixelRatio:Math.min(window.devicePixelRatio||1,2)};
    },
    setTechnology(value={}) {
      const propulsion=['lim','rotary'].includes(value.propulsion)?value.propulsion:state.technology.propulsion;
      const control=['loop','radio','fixed','etcs1','etcs2'].includes(value.control)?value.control:state.technology.control;
      const changed=propulsion!==state.technology.propulsion||control!==state.technology.control;
      if(changed)clearStructuralExploration();
      state.technology={propulsion,control};
      animateModel();if(changed){fitToView();controls.update();}requestRender();
    },
    getTechnology(){return {...state.technology};},
    setElectrification(value) {
      const next=normalizeElectrification(value),changed=next!==state.electrification;
      if(changed)clearStructuralExploration();state.electrification=next;
      animateModel();if(changed){fitToView();controls.update();}requestRender();return next;
    },
    getElectrification(){return state.electrification;},
    setPlatform(value = {}) {
      const platformEdge = normalizePlatformEdge(value.platformEdge), platformSensor = normalizePlatformSensor(value.platformSensor);
      const changed = platformEdge !== state.platformEdge || platformSensor !== state.platformSensor;
      if (!changed) return;
      clearStructuralExploration(); Object.assign(state, { platformEdge, platformSensor });
      animateModel(); if (state.view === 'platform-interface') { fitToView(); controls.update(); } requestRender();
    },
    getViewCapabilities() {
      const record=models.get(state.view);
      return {cutaway:Boolean(record?.shells.length),...viewSeparationCapabilities(record,{isolation:state.isolation})};
    },
    getExplorationCapabilities(id = state.selected) { return explorationCapabilities(models.get(state.view), id, state); },
    getExplorationState() { return { explodeScope: state.explodeScope, isolation: state.isolation, focused: state.focused,
      exploded: state.exploded, canRestoreFrame: Boolean(frameBeforeExploration) }; },
    setExplodeScope,
    setIsolation,
    inspectAssembly,
    restoreExploration,
    getCutaway() { return state.cutaway; },
    frameSelection,
    restoreFrame,
    frameModel,
    frameVariant,
    setSelected,
    setMode(mode) { if (!['motoring', 'regeneration', 'coasting', 'isolated'].includes(mode)) return; state.mode = mode; animateModel(); requestRender(); },
    setExploded(value) {
      const amount = THREE.MathUtils.clamp(Number(value) || 0, 0, 1), changed = state.exploded !== amount;
      state.exploded = amount; updateAssembly(); animateModel();
      if (changed) { fitToView(); controls.update(); }
      requestRender(); return state.exploded;
    },
    setCutaway(value) {
      const changed = state.cutaway !== Boolean(value); state.cutaway = Boolean(value); updateAssembly(); animateModel();
      if (state.explodeScope === 'selected' && !explorationCapabilities(models.get(state.view), state.selected, state).canExplodeSelected) {
        state.explodeScope = 'all'; state.exploded = 0; animateModel();
      }
      if (changed) { fitToView(); controls.update(); }
      requestRender();
    },
    setPlayback({ duration = 12, loop = false } = {}) { state.duration = Math.max(1, Number(duration) || 12); state.loop = Boolean(loop); },
    setPlaying(value) { state.playing = Boolean(value) && !reducedMotion.matches && !document.hidden; if (state.playing && state.phase >= 5) { state.phase = 0; animateModel(); } lastTime = 0; requestRender(); return state.playing; },
    getPlaying() { return state.playing; },
    setPhase(value) { state.phase = Math.max(0, Math.min(5, Number(value) || 0)); animateModel(); requestRender(); },
    getPhase() { return state.phase; },
    getView() { return state.view; },
    setReceptivity(value) { state.receptivity = value === 'resistor' ? 'resistor' : 'train'; animateModel(); requestRender(); },
    setVariant(value) {
      const variant = typeof value === 'string' ? value : 'default', changed = state.variant !== variant;
      if (changed) { clearStructuralExploration(); state.phase = 0; state.playing = false; }
      state.variant = variant; animateModel(); if (changed) { if (!frameVariant()) { fitToView(); controls.update(); } } requestRender();
    },
    setScenario(value) { state.scenario=typeof value==='string'?value:'nominal'; animateModel(); updateSelection(); requestRender(); },
    setSignals(value) { state.signals=Boolean(value);animateModel();requestRender(); },
    focusComponent: frameSelection,
    setCameraPreset,
    resetCamera,
    resize,
    dispose,
    getComponentScreenPositions() {
      if (!cachedComponentBounds) cachedComponentBounds = componentBounds(models.get(state.view));
      const record = models.get(state.view), positions = screenPositions(cachedComponentBounds, camera, labelAnchorInstances);
      const visible = [];record.root.traverse(node => { if (node.isMesh && nodeVisible(node) && (!node.material?.transparent || node.material.opacity > .4)) visible.push(node); });
      for (const p of positions) {
        raycaster.setFromCamera(new THREE.Vector2(p.x * 2 - 1, 1 - p.y * 2), camera);
        const hit = raycaster.intersectObjects(visible, false)[0];
        // A rear component has a key entry, but no pin drawn through equipment
        // in front of it. Ancestors of the first hit belong to that assembly.
        p.occluded = Boolean(hit && !assemblyRoots(record, p.id).some(root => within(hit.object, root)));
      }
      return positions;
    },
    getVisibleComponentIds() {
      if (!cachedComponentBounds) cachedComponentBounds = componentBounds(models.get(state.view));
      return [...cachedComponentBounds.keys()];
    },
    getComponentIds(view = state.view) { ensureModel(view);return [...(models.get(view)?.parts.keys() || [])]; },
  };
}


