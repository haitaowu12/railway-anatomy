import { nodeVisible, within } from './exploration.js';

// A catalogue concept is reusable; an instance is one physical occurrence in
// one authored scene. Paths are stable across reloads and never use THREE.uuid.
const slug = value => String(value || 'part').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'part';
const readable = value => String(value || 'Assembly').replace(/^view-/, '').split('-').map(word => word ? word[0].toUpperCase() + word.slice(1) : '').join(' ');

export function buildAssemblyIndex(record) {
  if (!record) return new Map();
  const owners = new Set([...record.parts.values()].flat());
  const instances = new Map();
  const visit = (node, parent, inheritedConcept, path, depth) => {
    const ownConcept = node.userData.conceptId || node.userData.explorationAssembly || (owners.has(node) ? node.userData.component : null);
    const conceptId = ownConcept || inheritedConcept || null;
    const candidate = node === record.root || owners.has(node) || node.userData.inspectionPart || node.userData.explorationLabel || node.userData.explorationAssembly;
    let current = parent, nextDepth = depth;
    if (candidate) {
      node.userData.instanceId = path;
      node.userData.conceptId = conceptId;
      node.userData.parentAssemblyId = parent?.userData.instanceId || null;
      node.userData.inspectionDepth = depth;
      instances.set(path, node);
      current = node; nextDepth++;
    }
    // A picked primitive belongs to its nearest authored physical part.
    if (node.geometry && current) node.userData.pickInstanceId = current.userData.instanceId;
    const names = new Map();
    for (const child of node.children) {
      const name = slug(child.name || child.type);
      const ordinal = (names.get(name) || 0) + 1; names.set(name, ordinal);
      visit(child, current, conceptId, `${path}/${name}:${ordinal}`, nextDepth);
    }
  };
  visit(record.root, null, null, slug(record.root.name), 0);
  record.instances = instances;
  return instances;
}

export function instanceNode(record, id) { return id ? record?.instances?.get(id) || null : null; }

function inherited(node, key, fallback) {
  for (let current = node; current; current = current.parent) if (current.userData[key] != null) return current.userData[key];
  return fallback;
}

export function instanceMetadata(node) {
  if (!node) return null;
  return {
    instanceId: node.userData.instanceId,
    parentAssemblyId: node.userData.parentAssemblyId || null,
    conceptId: node.userData.conceptId || null,
    label: node.userData.explorationLabel || readable(node.name),
    depth: node.userData.inspectionDepth || 0,
    fidelity: inherited(node, 'fidelity', 'Original schematic geometry; proportions are illustrative'),
    sources: inherited(node, 'inspectionSources', []),
    function: node.userData.inspectionFunction || '',
    interfaces: node.userData.inspectionInterfaces || [],
    role: node.userData.inspectionRole || '',
  };
}

export function assemblyTree(record, { selectedInstanceId = null, conceptId = null, allInstances = false } = {}) {
  if (!record?.instances) buildAssemblyIndex(record);
  const visible = new Set(), inspectable = new Set();
  const selected=instanceNode(record,selectedInstanceId),kind=selected&&(selected.userData.inspectionKind||selected.userData.explorationLabel||selected.name);
  if (nodeVisible(record?.root)) record.root.traverseVisible(node => {
    if (!node.geometry || node.material?.visible === false || node.material?.opacity === 0) return;
    for (let ancestor=node;ancestor;ancestor=ancestor.parent) if(ancestor.userData.instanceId)visible.add(ancestor.userData.instanceId);
  });
  for(const entry of record?.exploded || [])if(entry.delta.lengthSq()>0)for(let ancestor=entry.node.parent;ancestor;ancestor=ancestor.parent)if(ancestor.userData.instanceId)inspectable.add(ancestor.userData.instanceId);
  return [...(record?.instances || [])].map(([instanceId, node]) => ({
    ...instanceMetadata(node),
    selected: allInstances ? Boolean(conceptId && node.userData.conceptId === conceptId && (!kind||(node.userData.inspectionKind||node.userData.explorationLabel||node.name)===kind)) : instanceId === selectedInstanceId,
    visible: visible.has(instanceId),
    available: record.inspectionAvailability ? record.inspectionAvailability.has(instanceId) : nodeVisible(node),
    canInspect: inspectable.has(instanceId),
  }));
}

export function instanceAncestors(record, id) {
  const result = [];
  for (let node = instanceNode(record, id); node; node = instanceNode(record, node.userData.parentAssemblyId)) result.unshift(instanceMetadata(node));
  return result;
}

export function assemblyFunctionalPaths(record, selectedInstanceId = null) {
  const selected = instanceNode(record, selectedInstanceId);
  const paths = [];
  for (const [ownerId, owner] of record?.instances || []) {
    if (!nodeVisible(owner)) continue;
    for (const authored of owner.userData.functionalPaths || []) {
      const steps = (authored.steps || []).map(step => {
        let node = step.node || (step.nodeName ? owner.getObjectByName(step.nodeName) : null);
        if(!node&&step.nodePath){node=owner;for(const name of step.nodePath)node=node?.getObjectByName(name);}
        if (!node && step.instanceId) node = instanceNode(record, step.instanceId);
        if (!node && step.conceptId) {
          const candidates=(record.parts.get(step.conceptId)||[]).filter(nodeVisible);
          for(let scope=owner;scope&&!node;scope=scope.parent)node=candidates.find(candidate=>within(candidate,scope));
        }
        while (node && !node.userData.instanceId) node = node.parent;
        return { label: step.label, description: step.description || '',
          ...(node ? { instanceId: node.userData.instanceId, conceptId: node.userData.conceptId || step.conceptId || null } : step.conceptId ? { conceptId: step.conceptId } : {}) };
      });
      // A path may cross an assembly boundary (for example the final rail
      // contact of a bogie load path). Keep it available when the learner
      // selects that explicit physical interface, not only owner descendants.
      if (selected && !within(selected, owner) && !within(owner, selected) && !steps.some(step=>{
        const target=instanceNode(record,step.instanceId);return target&&(within(selected,target)||within(target,selected));
      })) continue;
      paths.push({ id: `${ownerId}::${authored.id}`, label: authored.label, description: authored.description || '', steps,
        sources: authored.sources || inherited(owner, 'inspectionSources', []) });
    }
  }
  return paths;
}
