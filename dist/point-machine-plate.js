import { createViewer } from './viewer.js';
import { POINT_PLATE_FRAME } from './point-machine-model.js';

const svgNS = 'http://www.w3.org/2000/svg';
const model = document.querySelector('#plate-model');
const overlay = document.querySelector('#plate-anchors');
const caption = document.querySelector('#plate-state');
const buttons = [...document.querySelectorAll('.plate-views button')];
const anchorGroups = [
  { prefix: 'point-operating-rod', category: 'operating', number: 1, offsets: [[31, 15], [30, -23]] },
  { prefix: 'point-detector-rod', category: 'detector', number: 2, offsets: [[-31, 15], [-30, -23]] },
  { prefix: 'point-lock', category: 'lock', number: 3, offsets: [[30, 22], [-30, 22]] },
];
const markers = anchorGroups.flatMap(({prefix, category, number, offsets}) =>
  ['near','far'].map((side, index) => ({
    name: `${prefix}-${side}`, category, label: `${number}${index ? 'F' : 'N'}`, offset: offsets[index],
  })));
let view = 'assembled';

function svg(tag, attributes, content = '') {
  const element = document.createElementNS(svgNS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  if (content) element.textContent = content;
  return element;
}

function drawMarkers() {
  const width = model.clientWidth, height = model.clientHeight;
  const active = markers.filter(marker => marker.category !== 'lock' || view === 'exploded');
  const positions = new Map(viewer.projectPartAnchors(active.map(marker => marker.name)).map(point => [point.name, point]));
  overlay.setAttribute('viewBox', `0 0 ${width} ${height}`);
  overlay.replaceChildren(...active.flatMap(({ name, category, label, offset }) => {
    const point = positions.get(name);
    if (!point) return [];
    const x = point.x * width, y = point.y * height;
    const mx = x + offset[0], my = y + offset[1];
    const group = svg('g', {class: category, 'data-part': name});
    group.append(
      svg('line', {class: 'plate-leader', x1:x, y1:y, x2:mx, y2:my}),
      svg('circle', {class: 'plate-pin', cx:x, cy:y, r:3}),
      svg('circle', {class: 'plate-pin', cx:mx, cy:my, r:13}),
      svg('text', {class: 'plate-pin-text', x:mx, y:my}, label),
    );
    return [group];
  }));
}

let viewer;
try {
  viewer = createViewer(model, { initialView: 'switch-drive', inspectionPlate: true, onRender: drawMarkers });
  model.querySelector('canvas').setAttribute('aria-label', 'Point-machine assembly at end A. The numbered parts are described in the key.');
  viewer.setExploded(1, {refit:false});
  if (!viewer.frameParts(POINT_PLATE_FRAME.parts, POINT_PLATE_FRAME.direction)) {
    throw new Error('The point-machine parts could not be framed.');
  }
  viewer.setExploded(0, {refit:false});
  for (const button of buttons) {
    button.disabled = false;
    button.addEventListener('click', () => {
      view = button.dataset.view;
      const exploded = view === 'exploded';
      viewer.setExploded(Number(exploded), {refit:false});
      for (const option of buttons) option.setAttribute('aria-pressed', String(option === button));
      caption.textContent = exploded
        ? 'The enclosure moves aside for inspection. Both blades and locks stay at end A.'
        : 'The enclosure is fitted. Both blade positions are held at end A.';
    });
  }
} catch (error) {
  viewer?.dispose();
  document.querySelector('#plate-error').hidden = false;
  console.error('Unable to show the point-machine assembly.', error);
}
