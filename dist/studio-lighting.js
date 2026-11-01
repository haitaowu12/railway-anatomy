// An original neutral studio is generated locally: no photographic texture,
// network request or third-party environment is needed for metal reflections.
export function installStudioEnvironment({ THREE, renderer, scene }) {
  if (!renderer?.isWebGLRenderer || !THREE.PMREMGenerator) return { enabled: false, dispose() {} };
  let target, generator;
  const environment = new THREE.Scene();
  const geometry = new Set(), materials = new Set();
  function plane(width, height, position, targetPoint, color, intensity) {
    const geo = new THREE.PlaneGeometry(width, height); geometry.add(geo);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }); materials.add(material);
    const panel = new THREE.Mesh(geo, material); panel.position.set(...position); panel.lookAt(...targetPoint); environment.add(panel);
  }
  try {
    environment.background = new THREE.Color(0x89939c).multiplyScalar(.65);
    plane(8, 5, [-5, 6, 4], [0,0,0], 0xfff8ed, 3.4);
    plane(3, 7, [6, 3, -3], [0,0,0], 0xe5f2ff, 2.2);
    plane(7, 4, [0, 8, -3], [0,0,0], 0xffffff, 2.6);
    plane(18, 18, [0, -3, 0], [0,0,0], 0x303b45, .7);
    generator = new THREE.PMREMGenerator(renderer);
    target = generator.fromScene(environment, .07, .1, 50);
    scene.environment = target.texture; scene.environmentIntensity = .55;
  } catch (_) {
    target?.dispose(); target = null;
  } finally {
    generator?.dispose(); for (const geo of geometry) geo.dispose(); for (const material of materials) material.dispose();
  }
  return { enabled: Boolean(target), dispose() { if (scene.environment === target?.texture) scene.environment = null; target?.dispose(); } };
}
