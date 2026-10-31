/* Original teaching geometry for three distinct platform hazard zones. The
 * selected arrangements are illustrative; sensor envelopes, door pitch and
 * interface states are not installation specifications or movement permission. */
export const PLATFORM_VIEWS = {
  'platform-interface': { camera: [23, 15, 24], target: [0, 1.7, 1.8], distance: 43 },
};

const VARIANTS = ['open-platform', 'platform-doors', 'interspace', 'platform-end'];

export function buildPlatformView(id, api) {
  if (!PLATFORM_VIEWS[id]) return null;
  const { THREE, C, M, mat, startModel, group, part, mesh, box, cylinder,
    torus, tube, roundedPanel, explode, shell, makeTrack, makeTrain,
    registerAnimator } = api;
  const root = startModel(id);
  const pale = mat(0xdce2d9, .75, .08), concrete = mat(0x788c90, .85, .02);
  const yellow = mat(0xe3be67, .65, .04), black = mat(0x142733, .6, .2);
  const amber = new THREE.MeshBasicMaterial({ color: 0xeead5d });
  const violet = new THREE.MeshBasicMaterial({ color: C.signal });
  const cyan = new THREE.MeshBasicMaterial({ color: 0x78cbd4 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x93b9bd, roughness: .2,
    metalness: .1, transparent: true, opacity: .30, side: THREE.DoubleSide });
  const faint = new THREE.MeshBasicMaterial({ color: 0xe6af67, transparent: true,
    opacity: .10, depthWrite: false, side: THREE.DoubleSide });
  const datum = group(root, 'platform-context');
  makeTrack(datum, 20, { detail: false, section: true });
  // Small tiles keep the SVG painter from drawing a single platform face over
  // equipment; the explicit deck material also gives its foundation ordering.
  for (let x = -9.6; x < 10; x += .8) {
    box(datum, [.8, 1.18, 3.7], M.deck, [x, .63, 3.52]);
    box(datum, [.8, .12, 3.7], concrete, [x, 1.28, 3.52]);
    box(datum, [.8, .025, .36], yellow, [x, 1.355, 1.89]);
  }
  for (let x = -9.5; x < 10; x += .35) for (let z = 1.78; z < 2.06; z += .1)
    cylinder(datum, .016, .013, M.dark, [x, 1.378, z], null, 6);
  const train = makeTrain(datum, { full: false, at: [0, 0, 0] });
  const open = group(root, 'open-platform-sensing-example');
  const doors = group(root, 'platform-door-example');
  const end = group(root, 'platform-end-example');
  const interspace = group(root, 'interspace-sensing-example');
  const paths = [];
  const doorLeaves = [];
  const pulses = [];

  function path(parent, points, color) {
    const vertices = [];
    for (let j = 1; j < points.length; j++) {
      const a = new THREE.Vector3(...points[j - 1]), b = new THREE.Vector3(...points[j]);
      const length = a.distanceTo(b), count = Math.max(2, Math.ceil(length / .2));
      for (let i = 0; i < count; i += 2) vertices.push(a.clone().lerp(b, i / count), a.clone().lerp(b, Math.min(1, (i + 1) / count)));
    }
    const line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(vertices),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: .7, depthTest: false }));
    line.renderOrder = 15; parent.add(line); paths.push(line); return line;
  }
  function monitor(parent, at, color = C.signal) {
    const g = group(parent, 'operator-display', at);
    roundedPanel(g, 1.3, .75, .08, black, [0, 0, 0], .05);
    box(g, [1.14, .59, .015], M.glass, [0, 0, .05]);
    box(g, [1.02, .035, .012], new THREE.MeshBasicMaterial({ color }), [0, .12, .065]);
    for (const x of [-.32, .32]) {
      box(g, [.035, .32, .012], pale, [x, -.02, .066]);
      box(g, [.16, .1, .014], amber, [x, -.02, .073]);
    }
    box(g, [.08, .35, .1], M.steel, [0, -.52, 0]);
    box(g, [.8, .08, .35], black, [0, -.72, 0]);
    return g;
  }
  function cabinet(parent, component, at) {
    const g = part(parent, component, at);
    box(g, [1.0, .12, .72], M.edge, [0, .06, 0]);
    box(g, [.94, 1.2, .66], black, [0, .72, 0]);
    for (let row = 0; row < 4; row++) {
      box(g, [.76, .15, .4], M.steel, [0, .3 + row * .24, .05]);
      for (const x of [-.28, -.08, .12]) box(g, [.055, .035, .02], cyan, [x, .3 + row * .24, .26]);
    }
    const cover = group(g, 'removable-processor-cabinet');
    box(cover, [1.0, 1.26, .05], pale, [0, .72, .38]);
    box(cover, [.045, .22, .04], black, [.35, .73, .42]);
    shell(cover); explode(cover, [0, .4, .6]);
    return g;
  }
  function zoneOutline(parent, component, size, at, material = amber) {
    const g = part(parent, component, at), [w, h, d] = size;
    for (const y of [0, h]) {
      tube(g, [[-w / 2, y, -d / 2], [w / 2, y, -d / 2],
        [w / 2, y, d / 2], [-w / 2, y, d / 2], [-w / 2, y, -d / 2]], .018, material, { straight: true, segments: 8 });
    }
    for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2])
      box(g, [.018, h, .018], material, [x, h / 2, z]);
    return g;
  }
  function objectProxy(parent, at, material = yellow) {
    const g = group(parent, 'illustrative-object-not-a-person', at);
    roundedPanel(g, .40, .42, .32, material, [0, .25, 0], .06);
    tube(g, [[-.11, .43, 0], [-.11, .61, 0], [.11, .61, 0], [.11, .43, 0]], .025, black, { straight: true, segments: 8 });
    return g;
  }

  // OPEN TRACK ZONE. The train is kept visible: actual train discrimination is
  // an engineered function, not achieved here by hiding the train from sensors.
  const trackZone = zoneOutline(open, 'platform-intrusion', [18, .42, 2.95], [0, .28, 0]);
  const plane = mesh(trackZone, new THREE.PlaneGeometry(18, 2.95, 18, 3), faint,
    [0, .14, 0], [-Math.PI / 2, 0, 0]); plane.renderOrder = 3;
  const intrudingObject = objectProxy(open, [-8.6, .4, .15]);
  for (const x of [-8.4, 8.4]) {
    const sensor = part(open, 'platform-lidar', [x, 1.34, 2.18]);
    cylinder(sensor, .06, .8, M.steel, [0, .4, 0], null, 10);
    cylinder(sensor, .17, .24, black, [0, .93, 0], null, 12);
    cylinder(sensor, .18, .05, cyan, [0, .96, 0], null, 12);
    box(sensor, [.31, .06, .29], pale, [0, 1.08, 0]);
    // Five rays identify a sampled volume without claiming precise coverage.
    for (let i = 0; i < 5; i++) {
      const targetX = x > 0 ? -7 + i * 3.2 : 7 - i * 3.2;
      path(sensor, [[0, .92, -.05], [targetX - x, -.68, -2.3]], 0x78cbd4);
    }
  }
  for (const x of [-7.5, 7.5]) {
    const radar = part(open, 'platform-radar');
    for (const z of [-1.47, 1.47]) {
      box(radar, [.3, .3, .16], pale, [x, .73, z]);
      box(radar, [.23, .22, .02], black, [x, .73, z + (z < 0 ? .09 : -.09)]);
      box(radar, [.06, .48, .06], M.steel, [x, .42, z]);
    }
    path(radar, [[x, .72, -1.38], [x, .72, 1.38]], 0xe6ad68);
  }
  const processor = cabinet(open, 'platform-response', [8.6, 1.34, 4.0]);
  const alarm = part(open, 'platform-alarm-video', [5.5, 1.34, 4.1]);
  monitor(alarm, [0, 1.12, 0], 0xe6ad68);
  box(alarm, [1.75, .1, .65], pale, [0, .36, 0]);
  for (const x of [-.65, .65]) box(alarm, [.06, .4, .06], M.steel, [x, .15, 0]);
  const camera = group(alarm, 'associated-video-camera', [-.35, 2.25, -.1]);
  cylinder(camera, .12, .22, pale, [0, 0, 0], [Math.PI / 2, 0, 0], 12);
  cylinder(camera, .065, .025, black, [0, 0, .13], [Math.PI / 2, 0, 0], 10);
  const alarmLight = cylinder(alarm, .065, .05, amber, [.53, 1.49, .02], [Math.PI / 2, 0, 0], 10);
  pulses.push(alarmLight);
  path(open, [[8.4, 2.29, 2.18], [8.8, 1.55, 3.3], [8.6, 2.05, 4.1]], C.signal);
  path(open, [[8.6, 2.05, 4.1], [7.3, 2.6, 4.1], [5.5, 2.46, 4.1]], C.signal);

  // PLATFORM DOORS. Fixed facade, moving leaves, actuator and feedback are
  // separately selectable parts. Doors stay closed unless the parked-train
  // door-open teaching scenario is explicitly requested.
  const facade = part(doors, 'platform-screen-door');
  for (const x of [-9.8, -7.8, -5.8, -4.08, -2.22, -.5, 1.8, 2.22, 4.08, 5.8, 7.8, 9.8]) {
    box(facade, [.075, 2.22, .09], M.steel, [x, 2.46, 1.66]);
    box(facade, [.2, .075, .2], M.edge, [x, 1.38, 1.66]);
  }
  const segments = [[-9.75,-4.08],[-2.22,2.22],[4.08,9.75]];
  for (const [a,b] of segments) {
    box(facade, [b-a, .1, .12], M.steel, [(a+b)/2, 3.51, 1.66]);
    box(facade, [b-a, 1.93, .035], glass, [(a+b)/2, 2.4, 1.66]);
    box(facade, [b-a, .075, .1], M.steel, [(a+b)/2, 1.47, 1.66]);
  }
  for (const cx of [-3.15, 3.15]) {
    box(facade, [1.86, .2, .23], pale, [cx, 3.54, 1.67]);
    const drive = part(doors, 'platform-door-drive', [cx, 3.55, 1.67]);
    box(drive, [1.72, .14, .12], black);
    for (const dx of [-.73,.73]) {
      cylinder(drive, .10, .06, M.steel, [dx, .035, .09], [Math.PI / 2, 0, 0], 14);
      mesh(drive, torus(.075,.015,5,14), M.dark, [dx,.035,.132]);
    }
    for (const y of [-.035,.105]) box(drive, [1.46, .018, .025], M.dark, [0,y,.11]);
    cylinder(drive, .12, .32, M.core, [-.63,.11,-.025], [0,0,Math.PI/2],12);
    box(drive, [.38,.1,.14], M.core, [.26,.17,0]);
    const driveCover = group(drive, 'removable-door-drive-cover');
    box(driveCover, [1.86, .26, .035], pale, [0, .04, .22]);
    shell(driveCover); explode(driveCover, [0,.5,.45]);
    const proof = part(doors, 'platform-door-proof', [cx, 3.36, 1.69]);
    box(proof, [.13,.14,.15], M.steel, [0,0,0]);
    box(proof, [.045,.22,.06], M.dark, [.11,-.08,0]);
    for (const [dx,ink] of [[-.15,cyan],[.17,amber]])
      cylinder(proof,.035,.025,ink,[dx,.02,.10],[Math.PI/2,0,0],8);
    for (const direction of [-1,1]) {
      const leaf = group(facade, 'platform-sliding-leaf', [cx+direction*.445, 2.4, 1.68]);
      box(leaf,[.84,1.9,.04],glass);
      for (const dx of [-.42,.42]) box(leaf,[.035,1.94,.08],M.steel,[dx,0,0]);
      for (const y of [-.95,.95]) box(leaf,[.86,.05,.08],M.steel,[0,y,0]);
      box(leaf,[.05,1.92,.07],M.dark,[-direction*.42,0,.035]);
      doorLeaves.push({node:leaf,x:cx+direction*.445,direction});
    }
    explode(drive,[0,.35,0]);
  }
  // INTERSPACE: narrow facade/train volume, separate from the trainway plane.
  const gap = zoneOutline(interspace,'platform-gap-detector',[13.5,1.65,.23],[0,1.45,1.5],cyan);
  for (const x of [-6.5,6.5]) {
    box(gap,[.16,.25,.10],black,[x,1.62,0]);
    cylinder(gap,.045,.035,cyan,[x,1.60,-.07],[Math.PI/2,0,0],8);
  }
  path(gap,[[-6.5,1.6,0],[0,.35,0],[6.5,1.6,0]],0x78cbd4);
  objectProxy(interspace,[.3,1.4,1.49],yellow);

  // END GATE: a different boundary; repeated passenger boarding doors remain
  // visible as context so end access is not confused with the boarding edge.
  const gate = part(end,'platform-end-gate',[9.25,1.35,3.35]);
  for (const z of [-1.45,1.45]) {
    box(gate,[.12,2.0,.12],M.steel,[0,1,z]);
    box(gate,[.28,.08,.28],M.edge,[0,.03,z]);
  }
  const leaf = group(gate,'platform-end-gate-leaf');
  box(leaf,[.08,1.86,2.7],M.edge,[0,.96,0]);
  box(leaf,[.1,1.59,2.4],glass,[.015,1.0,0]);
  box(leaf,[.13,.09,.5],yellow,[.09,.95,.78]);
  box(gate,[.18,.21,.19],black,[.08,1.76,1.32]);
  for (const x of [8.8,9.5]) box(end,[.32,.035,.6],yellow,[x,1.37,4.0]);
  zoneOutline(end,'platform-intrusion',[1.2,1.0,2.6],[10.0,1.4,3.4],amber);
  const endSensor=part(end,'platform-end-gate',[9.1,3.0,4.75]);
  box(endSensor,[.24,.3,.18],black);
  path(endSensor,[[0,0,0],[.9,-.6,-1.4]],0xe6ad68);

  open.visible=true; doors.visible=false; interspace.visible=false; end.visible=false;
  registerAnimator(state=>{
    const variant=VARIANTS.includes(state.variant)?state.variant:VARIANTS[0];
    const phase=Number.isFinite(state.phase)?state.phase:0;
    open.visible=variant==='open-platform';
    doors.visible=variant!=='open-platform';
    interspace.visible=variant==='interspace';
    end.visible=variant==='platform-end';
    // No acknowledgement control deletes a hazard proxy. These proxies remain
    // present throughout the chosen demonstration, independent of animation.
    intrudingObject.visible=true;
    for(const item of doorLeaves) item.node.position.x=item.x+
      (variant==='platform-doors'&&state.scenario==='door-open'?item.direction*.64:0);
    for(const light of pulses) light.scale.setScalar(.85+.15*Math.sin(phase*2));
    for(const line of paths) line.visible=state.signals!==false&&(state.exploded||0)<.2;
  });
  return root;
}
