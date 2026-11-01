import { Box3, Vector3, MathUtils } from './vendor/three.module.js';

// These helpers work on the same scene graph as the renderer. Visibility is
// never inferred from a catalogue entry: a hidden alternative stays hidden.
export function nodeVisible(node) {
  for (let current = node; current; current = current.parent) if (!current.visible) return false;
  return Boolean(node);
}

export function within(node, ancestor) {
  for (let current = node; current; current = current.parent) if (current === ancestor) return true;
  return false;
}

function renderable(node) {
  if (!node.geometry) return false;
  const materials = Array.isArray(node.material) ? node.material : [node.material];
  return materials.some(material => !material || (material.visible !== false && material.opacity !== 0));
}

function hasVisibleGeometry(root) {
  if (!nodeVisible(root)) return false;
  const pending = [root];
  while (pending.length) {
    const node = pending.pop();
    if (!node.visible) continue;
    if (renderable(node)) return true;
    pending.push(...node.children);
  }
  return false;
}

function includeGeometry(bounds, node, scratch) {
  if (!renderable(node)) return;
  if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
  if (node.geometry.boundingBox) bounds.union(scratch.copy(node.geometry.boundingBox).applyMatrix4(node.matrixWorld));
}

export function visibleBounds(nodes, target = new Box3()) {
  target.makeEmpty();
  const scratch = new Box3();
  for (const root of Array.isArray(nodes) ? nodes : [nodes]) {
    if (!nodeVisible(root)) continue;
    root.updateWorldMatrix(true, true);
    root.traverseVisible(node => includeGeometry(target, node, scratch));
  }
  return target;
}

// Prefer geometry owned by a component when positioning its tag. Fall back to
// its children for assembly-only concepts. Repeated instances retain separate
// bounds, so a label never lands in empty space halfway between two bogies.
export function componentBounds(record) {
  const owners = new Map(), direct = new Map(), aggregate = new Map();
  for (const [id, groups] of record.parts) for (const group of groups) owners.set(group, id);
  record.root.updateWorldMatrix(true, true);
  const scratch = new Box3();
  record.root.traverseVisible(node => {
    if (!renderable(node)) return;
    let first = true;
    for (let ancestor = node; ancestor && ancestor !== record.root.parent; ancestor = ancestor.parent) {
      if (!owners.has(ancestor)) continue;
      if (!aggregate.has(ancestor)) aggregate.set(ancestor, new Box3());
      includeGeometry(aggregate.get(ancestor), node, scratch);
      if (first) {
        if (!direct.has(ancestor)) direct.set(ancestor, new Box3());
        includeGeometry(direct.get(ancestor), node, scratch);
        first = false;
      }
    }
  });
  const result = new Map();
  for (const [node, id] of owners) {
    const bounds = direct.get(node) || aggregate.get(node);
    if (!bounds || bounds.isEmpty()) continue;
    if (!result.has(id)) result.set(id, []);
    result.get(id).push({ node, bounds });
  }
  return result;
}

export function assemblyRoots(record, componentId) {
  const roots = [];
  for (const part of record?.parts.get(componentId) || []) {
    if (!hasVisibleGeometry(part)) continue;
    let root = part;
    for (let ancestor = part; ancestor && ancestor !== record.root.parent; ancestor = ancestor.parent) {
      if (ancestor.userData.explorationAssembly === componentId) { root = ancestor; break; }
    }
    if (!roots.includes(root)) roots.push(root);
  }
  return roots.filter(root => !roots.some(other => other !== root && within(root, other)));
}

export function restoreIsolation(record) {
  for (const [node, visible] of record?.explorationMask || []) node.visible = visible;
  if (record) record.explorationMask = null;
}

export function applyIsolation(record, componentId) {
  restoreIsolation(record);
  if (!componentId) return true;
  const roots = assemblyRoots(record, componentId);
  if (!roots.length) return false;
  const mask = new Map();
  function visit(node) {
    if (roots.includes(node)) return;
    if (roots.some(root => within(root, node))) {
      for (const child of node.children) visit(child);
      return;
    }
    mask.set(node, node.visible);
    node.visible = false;
  }
  for (const child of record.root.children) visit(child);
  record.explorationMask = mask;
  return true;
}

export function separationEntries(record, { componentId = null, isolation = null } = {}) {
  if (!record) return [];
  const roots = componentId ? assemblyRoots(record, componentId) : [record.root];
  const isolatedRoots = isolation ? assemblyRoots(record, isolation) : [];
  return record.exploded.filter(entry => entry.delta.lengthSq() > 0 &&
    roots.some(root => within(entry.node, root)) &&
    !isolatedRoots.includes(entry.node) &&
    hasVisibleGeometry(entry.node));
}

// Moving a whole top-level context object is not an internal assembly study.
// A real internal separator has an owning component/assembly above it. Study
// aliases group references to equipment and do not turn context into internals.
export function viewSeparationCapabilities(record, options = {}) {
  const entries=separationEntries(record,options);
  const internal=entries.filter(({node})=>{
    for(let parent=node.parent;parent&&parent!==record.root;parent=parent.parent){
      const id=parent.userData.component;
      if(parent.userData.explorationAssembly || id && id!=='supply-conversion'&&!id.startsWith('study-'))return true;
    }
    return false;
  });
  return {explode:internal.length>0,internalParts:internal.length,contextParts:entries.length-internal.length};
}

export function explorationCapabilities(record, componentId, { isolation = null } = {}) {
  const roots = assemblyRoots(record, componentId);
  const entries = roots.length ? separationEntries(record, { componentId, isolation }) : [];
  const visible = roots.length > 0;
  let outside = false;
  if (visible) record.root.traverseVisible(node => {
    if (renderable(node) && !roots.some(root => within(node, root))) outside = true;
  });
  const internal = entries.filter(entry => !roots.includes(entry.node));
  const stages = new Map();
  for (const { node } of internal) {
    const range = node.userData.inspectionRange, label = node.userData.inspectionStage;
    if (label && validInspectionRange(range)) stages.set(`${range[0]}:${range[1]}:${label}`, { label, start: range[0], end: range[1] });
  }
  return {
    componentId: componentId || null,
    anchorId: componentId || null,
    assemblyComponentId: roots.find(root => root.userData.explorationAssembly)?.userData.explorationAssembly || componentId || null,
    canFocus: visible,
    canIsolate: visible && (outside || Boolean(isolation)),
    canExplodeSelected: internal.length > 0,
    separatedPartCount: internal.length,
    internalSeparationCount: internal.length,
    contextSeparationCount: entries.length - internal.length,
    instanceCount: roots.length,
    pieceNames: [...new Set(internal.map(entry => entry.node.userData.explorationLabel).filter(Boolean))],
    inspectionStages: [...stages.values()].sort((a, b) => a.start - b.start || a.end - b.end),
  };
}

function validInspectionRange(range) {
  return Array.isArray(range) && range.length === 2 && range.every(Number.isFinite) &&
    range[0] >= 0 && range[1] <= 1 && range[1] > range[0];
}

// A selected-assembly recipe is an authored teaching layout, not a maintenance
// removal procedure. Unauthored parts and whole-view separation retain their
// existing linear movement. Each range interpolates from the assembled state.
export function separationProgress(entry, amount, staged = true) {
  const fraction = MathUtils.clamp(Number(amount) || 0, 0, 1);
  const range = entry.node.userData.inspectionRange;
  if (!staged || !validInspectionRange(range)) return fraction;
  const local = MathUtils.clamp((fraction - range[0]) / (range[1] - range[0]), 0, 1);
  return local * local * (3 - 2 * local);
}

// Remove only the displacement we applied. Animators and builder-authored
// offsets retain ownership of the assembled position; repeated scrubbing does
// not accumulate movement, and moving equipment can still be separated.
export function restoreSeparation(record) {
  for (const entry of record?.exploded || []) {
    if (!entry.explorationOffset) continue;
    entry.node.position.sub(entry.explorationOffset);
    entry.explorationOffset.set(0, 0, 0);
  }
}

export function applySeparation(record, { amount = 0, scope = 'all', componentId = null, isolation = null } = {}) {
  restoreSeparation(record);
  const fraction = MathUtils.clamp(Number(amount) || 0, 0, 1);
  if (!fraction) return;
  const fixedRoots=scope==='selected'?assemblyRoots(record,componentId):[];
  for (const entry of separationEntries(record, { componentId: scope === 'selected' ? componentId : null, isolation })) {
    if(fixedRoots.includes(entry.node))continue;
    if (!entry.explorationOffset) entry.explorationOffset = new Vector3();
    entry.explorationOffset.copy(entry.delta).multiplyScalar(separationProgress(entry, fraction, scope === 'selected'));
    entry.node.position.add(entry.explorationOffset);
  }
}

export function fitPerspectiveBounds(bounds, { direction = new Vector3(1, 1, 1), up = new Vector3(0, 1, 0), fov = 36, aspect = 1, padding = 1.16, minimumDistance = .45 } = {}) {
  if (!bounds || bounds.isEmpty()) return null;
  const target = bounds.getCenter(new Vector3());
  const viewDirection = direction.clone();
  if (viewDirection.lengthSq() < 1e-10) viewDirection.set(1, 1, 1);
  viewDirection.normalize();
  const cameraUp = up.clone().normalize();
  if (new Vector3().crossVectors(cameraUp, viewDirection).lengthSq() < 1e-12) cameraUp.set(0, 0, -1);
  const right = new Vector3().crossVectors(cameraUp, viewDirection).normalize();
  const vertical = new Vector3().crossVectors(viewDirection, right).normalize();
  const tangentY = Math.tan(MathUtils.degToRad(fov / 2));
  const tangentX = tangentY * Math.max(Number(aspect) || 1, .05);
  let distance = minimumDistance;
  for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
    const delta = new Vector3(x, y, z).sub(target), depth = delta.dot(viewDirection);
    distance = Math.max(distance, depth + Math.abs(delta.dot(right)) * padding / tangentX,
      depth + Math.abs(delta.dot(vertical)) * padding / tangentY, depth + .06);
  }
  return { target, position: target.clone().addScaledVector(viewDirection, distance), distance,
    minimumDistance: Math.max(.08, Math.min(2, distance * .22)),
    far: Math.max(250, distance + bounds.getSize(new Vector3()).length() * 3) };
}

export function screenPositions(boundsByComponent, camera, anchorInstances = null) {
  camera.updateMatrixWorld(true);
  const result = [];
  for (const [id, instances] of boundsByComponent) {
    const candidates = [];
    for (const { node, bounds } of instances) {
      const localAnchor = node.userData?.labelAnchor;
      const world = localAnchor ? node.localToWorld(Array.isArray(localAnchor) ? new Vector3(...localAnchor) : localAnchor.clone()) : bounds.getCenter(new Vector3());
      const point = world.clone().project(camera);
      if (point.z <= -1 || point.z >= 1 || Math.abs(point.x) >= 1 || Math.abs(point.y) >= 1) continue;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
        const p = new Vector3(x, y, z).project(camera);
        minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
      }
      const width = (maxX - minX) * .5, height = (maxY - minY) * .5;
      candidates.push({ id, node, world: world.toArray(), x: (point.x + 1) * .5, y: (1 - point.y) * .5, depth: point.z,
        width, height, instanceCount: instances.length, area: width * height });
    }
    candidates.sort((a, b) => b.area - a.area || a.depth - b.depth);
    if (candidates.length) {
      const retained=anchorInstances?.get(id);
      const stillVisible=retained&&instances.some(instance=>instance.node===retained);
      const chosen=stillVisible?candidates.find(candidate=>candidate.node===retained):candidates[0];
      // Retain a physical instance across camera rotation. If that instance is
      // offscreen the label rests, rather than jumping to another wheelset.
      if(!chosen)continue;
      anchorInstances?.set(id,chosen.node);
      const { area, node, ...position } = chosen;
      position.instanceId=node?.uuid;
      result.push(position);
    }
  }
  return result;
}

