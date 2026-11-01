// Infrastructure, sensing technology and the lesson in focus are independent.
// Legacy URLs without a physical arrangement retain their original meaning.
export const DEFAULT_PLATFORM_EDGE = 'open';
export const DEFAULT_PLATFORM_SENSOR = 'lidar';
export const PLATFORM_EDGES = [
  { id: 'open', label: 'Open edge', description: 'An open boarding edge, with no platform-door facade.' },
  { id: 'half-height', label: 'Half-height doors', description: 'A lower barrier with sliding boarding openings.' },
  { id: 'full-height', label: 'Full-height doors', description: 'A tall facade with sliding boarding openings.' },
];
export const PLATFORM_SENSORS = [
  { id: 'lidar', label: 'LiDAR', description: 'An illustrative ranging sensor and sampled track volume.' },
  { id: 'radar', label: 'Paired radar', description: 'An illustrative transmitter and receiver across the track.' },
];
export const PLATFORM_VARIANTS = ['open-platform', 'platform-doors', 'interspace', 'platform-end'];
export const normalizePlatformEdge = value => PLATFORM_EDGES.some(x => x.id === value) ? value : DEFAULT_PLATFORM_EDGE;
export const normalizePlatformSensor = value => PLATFORM_SENSORS.some(x => x.id === value) ? value : DEFAULT_PLATFORM_SENSOR;
export const platformVariantAvailable = (variant, edge) => variant !== 'interspace' || normalizePlatformEdge(edge) !== 'open';

export function normalizePlatformState(input = {}) {
  let variant = PLATFORM_VARIANTS.includes(input.variant) ? input.variant : PLATFORM_VARIANTS[0];
  const explicitEdge = PLATFORM_EDGES.some(x => x.id === input.platformEdge);
  const platformEdge = explicitEdge ? input.platformEdge : ['platform-doors', 'interspace'].includes(variant) ? 'full-height' : DEFAULT_PLATFORM_EDGE;
  let notice = '';
  if (!platformVariantAvailable(variant, platformEdge)) {
    variant = 'open-platform';
    notice = 'The open edge has no space between a train and platform doors. The view now shows trainway sensing.';
  }
  return { platformEdge, platformSensor: normalizePlatformSensor(input.platformSensor), variant, notice };
}

// Use for an intentional visit to a component, not for a generic focus change.
export function platformForComponent(component, input = {}) {
  const next = normalizePlatformState(input);
  if (component === 'platform-lidar' || component === 'platform-radar') {
    next.platformSensor = component === 'platform-radar' ? 'radar' : 'lidar';
    next.variant = 'open-platform';
  } else if (component === 'platform-gap-detector') {
    next.variant = 'interspace';
    if (next.platformEdge === 'open') next.platformEdge = 'full-height';
  } else if (['platform-screen-door', 'platform-door-drive', 'platform-door-proof'].includes(component)) {
    next.variant = 'platform-doors';
    if (next.platformEdge === 'open') next.platformEdge = 'full-height';
  } else if (component === 'platform-end-gate') next.variant = 'platform-end';
  else if (['platform-intrusion', 'platform-response', 'platform-alarm-video'].includes(component)) next.variant = 'open-platform';
  next.notice = '';
  return next;
}

export const platformProgress = state => Math.max(0, Math.min(1, (Number.isFinite(state.phase) ? state.phase : 0) / 5));
const ramp = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const smooth = x => x * x * (3 - 2 * x);

// An authored explanatory cycle, not a railway command or safety function.
export function platformDoorPose(state) {
  let p = platformProgress(state);
  if (state.scenario === 'door-open' && p === 0) p = .46;
  const opening = p < .52 ? smooth(ramp(p, .20, .42)) : 1 - smooth(ramp(p, .52, .76));
  const lock = p < .2 ? 1 - ramp(p, .12, .20) : ramp(p, .86, .94);
  const closed = opening < .0001;
  return { opening, lock, closed, locked: closed && lock >= .999, request: p >= .12 && p < .76,
    lockedReported: closed && lock >= .999 && (p < .12 || p >= .97) };
}

export function platformDetectionPose(state) {
  const p = platformProgress(state), unavailable = state.scenario === 'sensor-unavailable';
  return { entry: smooth(ramp(p, .08, .25)), occupied: p >= .25, evidence: !unavailable && p >= .38,
    report: !unavailable && p >= .63, associatedVideo: !unavailable && p >= .83, unavailable };
}

export function platformGatePose(state) {
  const p = platformProgress(state), opening = smooth(ramp(p, .24, .61));
  return { opening, latch: 1 - ramp(p, .12, .22), closed: opening < .0001, report: p >= .77 };
}

export function stationLiftPose(state) {
  const p = platformProgress(state);
  const height = smooth(ramp(p, .26, .70));
  const lowerOpening = 1 - smooth(ramp(p, .08, .22));
  const upperOpening = smooth(ramp(p, .78, .94));
  return { height, lowerOpening, upperOpening, carOpening: height === 0 ? lowerOpening : height === 1 ? upperOpening : 0 };
}
