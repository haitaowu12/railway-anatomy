// Playback uses the same bounded timeline for scrubbing and real-time motion.
// Five model units are one authored sequence, independent of its real duration.
export const phaseFraction = phase => Math.max(0, Math.min(1, (Number(phase) || 0) / 5));
export function motionStep(steps = [], fraction = 0) {
  return steps.reduce((best, step, index) => fraction + .00001 >= step.at ? index : best, 0);
}
export function advancePlayback(phase, elapsed, { duration = 12, loop = false } = {}) {
  const next = Math.max(0, phase) + Math.max(0, elapsed) * 5 / Math.max(1, duration);
  return next >= 5 ? { phase: loop ? next % 5 : 5, playing: loop } : { phase: next, playing: true };
}

// Pins stay on their actual projected equipment. A crowded or offscreen pin
// rests in the fixed key; it is never sent to a distant gutter or viewport edge.
export function placeModelPins(points, { width, height, radius = 15, gap = 9, top = 12, bottom = 52, limit = 12 } = {}) {
  const placed = [];
  for (const point of points) {
    if (placed.length >= limit) break;
    const x = point.x * width, y = point.y * height;
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < radius + 8 || x > width - radius - 8 || y < top + radius || y > height - bottom - radius) continue;
    if (point.occluded) continue;
    if (placed.some(p => Math.hypot(p.x - x, p.y - y) < radius * 2 + gap)) continue;
    placed.push({ ...point, x, y });
  }
  return placed;
}
