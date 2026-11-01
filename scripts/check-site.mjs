#!/usr/bin/env node
/**
 * Dependency-free checks for the educational content contract and portable
 * static bundle. Browser rendering still requires a separate visual review.
 * Run from any directory with: node /path/to/repo/scripts/check-site.mjs
 */
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(repo, 'dist');
const failures = [];
let passed = 0;
const read = file => readFile(file, 'utf8');
const relative = file => path.relative(repo, file).split(path.sep).join('/');

async function check(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(name);
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function filesBelow(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(file));
    else if (entry.isFile()) files.push(file);
  }
  return files;
}

function unique(items, label) {
  assert.equal(new Set(items).size, items.length, `${label} must have unique IDs`);
}

function nonempty(value, label) {
  assert.equal(typeof value, 'string', `${label} must be text`);
  assert.ok(value.trim(), `${label} must not be empty`);
}

// Preserve strings (including URL slashes) while removing ordinary JS comments.
// This prevents vendor documentation examples from becoming fake dependencies.
function withoutComments(source) {
  let result = '', quote = null;
  for (let index = 0; index < source.length; index++) {
    const char = source[index], next = source[index + 1];
    if (quote) {
      result += char;
      if (char === '\\') result += source[++index] || '';
      else if (char === quote) quote = null;
    } else if (char === '"' || char === "'" || char === '`') {
      quote = char;
      result += char;
    } else if (char === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') index++;
      result += '\n';
    } else if (char === '/' && next === '*') {
      index += 2;
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        if (source[index] === '\n') result += '\n';
        index++;
      }
      index++;
      result += ' ';
    } else result += char;
  }
  return result;
}

const files = await filesBelow(dist);
const modules = files.filter(file => /\.(?:m?js)$/.test(file));
let catalog, model, tours, atlas;

await check('Published entry points and local runtime are present', async () => {
  for (const name of ['index.html', 'app.js', 'model.js', 'atlas-config.js', 'catalog.js', 'tours.js', 'viewer.js', 'track-models.js', 'signalling-models.js', 'station-models.js', 'style.css', 'reading.html', 'assets/mark.svg', 'vendor/three.module.js', 'vendor/three.core.js', 'vendor/OrbitControls.js', 'vendor/SVGRenderer.js', 'vendor/Projector.js', 'vendor/three-LICENSE.txt']) {
    assert.ok((await stat(path.join(dist, name))).isFile(), `Missing deployable file ${name}`);
  }
  for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
    assert.ok((await stat(path.join(repo, name))).isFile(), `Missing licence document ${name}`);
  }
});

await check('All browser JavaScript modules parse', async () => {
  for (const file of modules) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${relative(file)}: ${result.stderr || result.error?.message || 'syntax check failed'}`);
  }
});

await check('Content and pure model modules load without browser globals', async () => {
  [catalog, model, { TOURS: tours }, atlas] = await Promise.all([
    import(pathToFileURL(path.join(dist, 'catalog.js')).href),
    import(pathToFileURL(path.join(dist, 'model.js')).href),
    import(pathToFileURL(path.join(dist, 'tours.js')).href),
    import(pathToFileURL(path.join(dist, 'atlas-config.js')).href),
  ]);
});

if (catalog && model && tours && atlas) {
  const { SOURCES, CONCEPTS, ARCHITECTURES } = catalog;
  const { DOMAINS, VIEWS, MODES, RELATED, MODEL_TARGETS, domainFor, viewFor, targetFor, variantFor, defaultVariant, applyExperiment, describeFlow, wheelEstimate } = model;
  const { PART_VIEWS, PART_VARIANTS, PART_CONTEXTS, PART_RELATIONS } = atlas;
  const concepts = new Map(CONCEPTS.map(item => [item.id, item]));
  const sourceIds = new Set(SOURCES.map(item => item.id));
  const domains = new Set(DOMAINS.map(item => item.id));
  const views = new Set(Object.keys(VIEWS));
  const modes = new Set(MODES.map(item => item.id));
  const scenarios = new Set(['nominal', 'radio-loss', 'door-open', 'wheel-slip', 'regen-limited']);
  const referencesResolve = (ids, label) => {
    assert.ok(Array.isArray(ids) && ids.length, `${label} needs public source references`);
    for (const id of ids) assert.ok(sourceIds.has(id), `${label} refers to unknown source ${id}`);
  };

  await check('Expanded concepts and source records have complete, public content', async () => {
    assert.equal(CONCEPTS.length, 261, 'Update the published content count when the release scope changes');
    assert.equal(SOURCES.length, 143, 'Update the published source count when the release scope changes');
    unique(CONCEPTS.map(item => item.id), 'Concepts');
    unique(SOURCES.map(item => item.id), 'Sources');
    for (const source of SOURCES) {
      for (const field of ['id', 'title', 'publisher', 'description', 'scope']) nonempty(source[field], `${source.id}.${field}`);
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:', `${source.id} must use an HTTPS reading link`);
      assert.equal(url.username + url.password, '', `${source.id} must not embed credentials`);
      assert.ok(!/^(localhost|127\.|\[?::1\]?$)/i.test(url.hostname), `${source.id} must be a public reading link`);
    }
    for (const concept of CONCEPTS) {
      for (const field of ['id', 'label', 'summary']) nonempty(concept[field], `${concept.id}.${field}`);
      assert.ok(Array.isArray(concept.details) && concept.details.length >= 2, `${concept.id} needs its substantive explanation`);
      concept.details.forEach((text, index) => nonempty(text, `${concept.id}.details[${index}]`));
      assert.ok(Array.isArray(concept.sources), `${concept.id} needs a source list`);
      if (concept.sources.length) referencesResolve(concept.sources, concept.id);
      else {
        nonempty(concept.caveat, `${concept.id} needs an explicit authored-model boundary`);
        assert.match(concept.caveat, /\b(?:illustrative|conceptual|teaching|schematic)\b/i, `${concept.id} is unsourced without a declared model assumption`);
      }
    }
  });

  await check('Every concept is reachable through one domain and a valid view', async () => {
    assert.equal(DOMAINS.length, 9);
    assert.equal(views.size, 50);
    unique(DOMAINS.map(item => item.id), 'Domains');
    const assigned = DOMAINS.flatMap(item => item.parts);
    unique(assigned, 'Domain assignments');
    assert.deepEqual([...assigned].sort(), [...concepts.keys()].sort(), 'A concept is missing from navigation or assigned more than once');
    for (const domain of DOMAINS) {
      assert.ok(views.has(domain.view), `${domain.id} has an unknown initial view`);
      assert.ok(domain.parts.includes(domain.component), `${domain.id} has an unreachable initial component`);
      for (const view of domain.views) assert.ok(views.has(view), `${domain.id} lists an unknown view ${view}`);
    }
    for (const [id, view] of Object.entries(VIEWS)) assert.ok(concepts.has(view.component), `${id} has an unknown initial component`);
    for (const id of concepts.keys()) {
      assert.ok(domains.has(domainFor(id)?.id), `${id} has no domain`);
      assert.ok(views.has(viewFor(id)), `${id} has no valid target view`);
      assert.ok(concepts.has(targetFor(id)), `${id} has a dangling model target`);
    }
    for (const [id, target] of Object.entries(MODEL_TARGETS)) {
      assert.ok(concepts.has(id) && concepts.has(target), `Unknown model alias ${id} → ${target}`);
    }
    for (const [id, related] of Object.entries(RELATED)) {
      assert.ok(concepts.has(id), `Unknown related-concept group ${id}`);
      for (const target of related) assert.ok(concepts.has(target), `Broken related link ${id} → ${target}`);
    }
  });

  await check('Architecture variants, aliases and context links resolve consistently', async () => {
    const allDomainViews = new Set(DOMAINS.flatMap(domain => domain.views));
    assert.deepEqual([...allDomainViews].sort(), [...views].sort(), 'A renderer view is absent from system navigation');
    for (const [id, config] of Object.entries(VIEWS)) {
      for (const field of ['label', 'title', 'note']) nonempty(config[field], `${id}.${field}`);
      if (!config.variants) continue;
      assert.ok(config.variants.length, `${id} has an empty variant selector`);
      unique(config.variants.map(item => item.id), `${id} variants`);
      for (const variant of config.variants) {
        for (const field of ['id', 'label', 'title', 'description']) nonempty(variant[field], `${id}/${variant.id}.${field}`);
        assert.ok(Array.isArray(variant.nodes) && variant.nodes.length >= 2, `${id}/${variant.id} needs an explanatory path`);
        variant.nodes.forEach(node => nonempty(node, `${id}/${variant.id} path label`));
        referencesResolve(variant.sources, `${id}/${variant.id}`);
        const flow = describeFlow({ view: id, variant: variant.id, domain: domainFor(config.component).id, mode: 'coasting', scenario: 'nominal' });
        assert.equal(flow.id, variant.id, `${id} does not select its requested narrative`);
      }
    }
    for (const [id, target] of Object.entries(MODEL_TARGETS)) {
      assert.notEqual(id, target, `Self-referential model alias ${id}`);
      const seen = new Set([id]);
      let cursor = target;
      while (MODEL_TARGETS[cursor]) {
        assert.ok(!seen.has(cursor), `Model alias cycle through ${cursor}`);
        seen.add(cursor); cursor = MODEL_TARGETS[cursor];
      }
      assert.equal(targetFor(id), cursor, `${id} needs a fully resolved model target`);
    }
    for (const [id, view] of Object.entries(PART_VIEWS)) {
      assert.ok(concepts.has(id) && views.has(view), `Invalid preferred view ${id} → ${view}`);
      assert.equal(viewFor(id), view, `${id} preferred view is overridden unexpectedly`);
    }
    for (const [id, variant] of Object.entries(PART_VARIANTS)) {
      assert.ok(concepts.has(id), `Unknown variant-mapped component ${id}`);
      const view = viewFor(id), allowed = VIEWS[view].variants?.map(item => item.id) || ['default'];
      assert.ok(allowed.includes(variant), `${id} points to invalid ${view}/${variant}`);
      assert.equal(variantFor(id), variant);
    }
    for (const [id, contexts] of Object.entries(PART_CONTEXTS)) {
      assert.ok(concepts.has(id), `Unknown context component ${id}`);
      assert.ok(Array.isArray(contexts), `${id} needs a context array`);
      unique(contexts, `${id} context links`);
      for (const view of contexts) assert.ok(views.has(view), `Invalid context ${id} → ${view}`);
    }
    for (const [id, related] of Object.entries(PART_RELATIONS)) {
      assert.ok(concepts.has(id), `Unknown relationship origin ${id}`);
      assert.ok(Array.isArray(related), `${id} needs a relationship array`);
      unique(related, `${id} relationship targets`);
      for (const target of related) assert.ok(concepts.has(target), `Invalid relationship ${id} → ${target}`);
    }
    for (const concept of CONCEPTS) for (const target of concept.related || []) assert.ok(concepts.has(target), `Invalid catalog relationship ${concept.id} → ${target}`);
    unique(ARCHITECTURES.map(item => item.id), 'Architecture graphs');
    for (const architecture of ARCHITECTURES) {
      for (const field of ['id', 'label', 'description', 'limits']) nonempty(architecture[field], `${architecture.id}.${field}`);
      assert.ok(architecture.components.length && architecture.flow.length, `${architecture.id} has an empty graph`);
      unique(architecture.components, `${architecture.id} components`);
      for (const id of architecture.components) assert.ok(concepts.has(id), `Invalid graph node ${architecture.id} → ${id}`);
      architecture.flow.forEach(step => nonempty(step, `${architecture.id} flow`));
      referencesResolve(architecture.sources, architecture.id);
    }
  });

  await check('Guided tours have valid domains, actions, evidence and answer feedback', async () => {
    assert.equal(tours.length, 32);
    unique(tours.map(item => item.id), 'Lessons');
    for (const tour of tours) {
      for (const field of ['id', 'label', 'title', 'explanation', 'actionText', 'actionLabel', 'question']) nonempty(tour[field], `${tour.id}.${field}`);
      assert.ok(domains.has(tour.domain), `${tour.id} has an unknown domain`);
      assert.equal(domainFor(tour.component)?.id, tour.domain, `${tour.id} lesson domain does not match its component`);
      assert.equal(domainFor(tour.action.component)?.id, tour.domain, `${tour.id} action domain does not match its component`);
      assert.ok(views.has(tour.view) && views.has(tour.action.view), `${tour.id} has an unknown model view`);
      assert.ok(concepts.has(tour.component) && concepts.has(tour.action.component), `${tour.id} targets a missing component`);
      assert.ok(modes.has(tour.action.mode), `${tour.id} has an unsupported mode`);
      assert.ok(scenarios.has(tour.action.scenario), `${tour.id} has an unsupported scenario`);
      const actionVariants = VIEWS[tour.action.view].variants?.map(item => item.id) || ['default'];
      assert.ok(actionVariants.includes(tour.action.variant || defaultVariant(tour.action.view)), `${tour.id} has an unsupported action variant`);
      if ('cutaway' in tour.action) assert.equal(typeof tour.action.cutaway, 'boolean', `${tour.id} cutaway must be boolean`);
      if ('exploded' in tour.action) {
        const separation = Number(tour.action.exploded);
        assert.ok(Number.isFinite(separation) && separation >= 0 && separation <= 1, `${tour.id} has invalid part separation`);
      }
      assert.equal(tour.choices.length, 3, `${tour.id} needs three answer choices`);
      assert.equal(tour.feedback.length, 3, `${tour.id} needs answer-specific feedback`);
      assert.ok(Number.isInteger(tour.answer) && tour.answer >= 0 && tour.answer < 3, `${tour.id} has an invalid answer index`);
      [...tour.choices, ...tour.feedback].forEach(value => nonempty(value, `${tour.id} answer text`));
      assert.ok(tour.sourceConcepts.length, `${tour.id} needs supporting concepts`);
      unique(tour.sourceConcepts, `${tour.id} supporting concepts`);
      for (const id of tour.sourceConcepts) assert.ok(concepts.has(id), `${tour.id} cites an unknown concept ${id}`);
      assert.ok(tour.sourceConcepts.includes(tour.component), `${tour.id} omits its focal concept from the supporting evidence`);
      assert.ok(tour.sourceConcepts.includes(tour.action.component), `${tour.id} omits the action component from its supporting evidence`);
    }
  });

  const baseline = Object.freeze({ domain: 'power', mode: 'motoring', scenario: 'nominal', sink: 'train' });
  await check('Experiments preserve state and inhibit the appropriate demands', async () => {
    for (const scenario of ['door-open', 'radio-loss', 'wheel-slip']) {
      const next = applyExperiment(baseline, scenario);
      assert.notEqual(next, baseline, 'Experiments must return a new state');
      assert.equal(next.scenario, scenario);
      assert.equal(next.mode, 'coasting', `${scenario} must not leave a motoring cue active`);
      assert.equal(baseline.mode, 'motoring', 'Experiments mutated their input');
      const restored = applyExperiment(next, 'nominal');
      assert.equal(restored.mode, 'coasting', 'Clearing an information fault must not itself request acceleration');
    }
    const limited = applyExperiment(baseline, 'regen-limited');
    assert.equal(limited.mode, 'regeneration');
    assert.equal(limited.sink, 'resistor');
    assert.deepEqual(applyExperiment(baseline, 'unsupported'), baseline, 'Unsupported input changed operating state');
    for (const mode of modes) {
      const next = applyExperiment({ ...baseline, scenario: 'door-open' }, mode);
      assert.equal(next.mode, mode);
      assert.equal(next.scenario, 'nominal');
    }
  });

  await check('Energy narratives keep regeneration on the selected DC network', async () => {
    for (const domain of ['power', 'vehicle']) {
      for (const sink of ['train', 'resistor']) {
        const flow = describeFlow({ ...baseline, domain, mode: 'regeneration', sink });
        const destination = flow.nodes.at(-1);
        assert.match(destination, sink === 'train' ? /train/i : /resistor|heat/i, `Regeneration lost its ${sink} destination`);
        assert.ok(!flow.nodes.some(node => /\b(?:utility|grid|rectifier|AC supply)\b/i.test(node)), 'The diode example routes regenerative energy to its AC source');
      }
      const isolated = describeFlow(applyExperiment({ ...baseline, domain }, 'isolated'));
      assert.equal(isolated.kind, 'idle', 'Removed line supply still has an energized energy narrative');
      const coasting = describeFlow(applyExperiment({ ...baseline, domain }, 'coasting'));
      assert.ok(coasting.nodes.some(node => /auxiliary/i.test(node)), 'Coasting lost the supporting-load path');
      assert.ok(!coasting.nodes.some(node => /LIM|thrust/i.test(node)), 'Coasting shows a motor-thrust energy path');
    }
    for (const domain of ['power', 'vehicle', 'control', 'communications']) for (const scenario of scenarios) for (const mode of modes) {
      const flow = describeFlow({ ...baseline, domain, scenario, mode });
      nonempty(flow.title, 'Scenario title');
      nonempty(flow.description, 'Scenario explanation');
      assert.ok(Array.isArray(flow.nodes) && flow.nodes.length >= 2, 'Scenario has no useful path');
      flow.nodes.forEach(node => nonempty(node, 'Path label'));
      referencesResolve(flow.sources, `${domain}/${mode}/${scenario}`);
      if (['door-open', 'radio-loss', 'wheel-slip'].includes(scenario)) assert.equal(flow.kind, 'signal', `${scenario} lost its information/condition explanation`);
    }
  });

  await check('Synthetic odometry arithmetic handles signed error and slider strings', async () => {
    for (const [error, expected] of [[-20, 80], [-10, 90], [0, 100], [10, 110], [20, 120], ['10', 110]]) {
      assert.ok(Math.abs(wheelEstimate(error) - expected) < 1e-9, `Incorrect 100 m example for ${error}%`);
    }
    for (let error = -20; error < 20; error++) assert.ok(wheelEstimate(error + 1) > wheelEstimate(error), 'The signed error control is not monotonic');
  });

  await check('The static reading directory includes every source', async () => {
    const reading = await read(path.join(dist, 'reading.html'));
    for (const source of SOURCES) {
      assert.ok(reading.includes(source.url) || reading.includes(source.url.replaceAll('&', '&amp;')), `Static reading page omits ${source.id}`);
    }
    const escapeText=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll(String.fromCharCode(34),'&quot;').replaceAll(String.fromCharCode(39),'&#39;');
    for(const c of CONCEPTS) {
      assert.ok(reading.includes(`id=\"concept-${c.id}\"`), `Static reading page omits concept ${c.id}`);
      for(const detail of c.details)assert.ok(reading.includes(escapeText(detail)), `Static reading is stale for ${c.id}`);
    }
  });
}

await check('All local links and module dependencies work at a repository subpath', async () => {
  const importMap = new Map();
  const references = [];
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const html = await read(file);
    assert.ok(!/<base\b/i.test(html), `${relative(file)} has a host-dependent base URL`);
    for (const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']importmap["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      for (const [name, location] of Object.entries(JSON.parse(match[1]).imports || {})) {
        importMap.set(name, { file, location });
        references.push({ from: file, value: location, runtime: true });
      }
    }
    for (const match of html.matchAll(/<(script|link|img|a|source)\b[^>]*?\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
      references.push({ from: file, value: match[2], runtime: match[1].toLowerCase() !== 'a' });
    }
  }
  for (const file of modules) {
    const text = withoutComments(await read(file));
    const imports = [
      ...text.matchAll(/\b(?:import|export)\s+(?:[^;"']+?\s+from\s*)?["']([^"'\n]+)["']/g),
      ...text.matchAll(/\bimport\s*\(\s*["']([^"'\n]+)["']\s*\)/g),
    ];
    for (const [, location] of imports) {
      if (location.startsWith('.') || location.startsWith('/') || /^[a-z]+:/i.test(location)) {
        references.push({ from: file, value: location, runtime: true });
      } else {
        assert.ok(importMap.has(location), `${relative(file)} has an unmapped browser import ${location}`);
      }
    }
  }
  for (const file of files.filter(file => file.endsWith('.css'))) {
    for (const match of (await read(file)).matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) {
      references.push({ from: file, value: match[1], runtime: true });
    }
  }
  for (const { from, value, runtime } of references) {
    if (value.startsWith('#') || value.startsWith('data:')) continue;
    if (/^https?:\/\//i.test(value)) {
      assert.ok(!runtime, `${relative(from)} requires a remote runtime asset: ${value}`);
      continue;
    }
    if (/^(mailto:|tel:)/i.test(value) && !runtime) continue;
    assert.ok(!value.startsWith('/'), `${relative(from)} uses a root-absolute path that breaks repository hosting: ${value}`);
    assert.ok(!/^[a-z][a-z\d+.-]*:/i.test(value), `${relative(from)} has an unsupported asset URL: ${value}`);
    const pathname = decodeURIComponent(value.split(/[?#]/)[0].replaceAll('&amp;', '&'));
    if (!pathname) continue;
    const target = path.resolve(path.dirname(from), pathname);
    assert.ok(target === dist || target.startsWith(dist + path.sep), `${relative(from)} references a file outside the published directory: ${value}`);
    const info = await stat(target);
    assert.ok(info.isFile() || (info.isDirectory() && (await stat(path.join(target, 'index.html'))).isFile()), `${relative(from)} has a broken local link: ${value}`);
  }
  assert.ok(references.length > 10, 'The dependency scan did not find the expected bundle links');
});

await check('Actual 3D geometry agrees with navigation, lessons and architecture boundaries', async () => {
  const { GEOMETRY_CHECK_RESULT } = await import(pathToFileURL(path.join(repo, 'scripts/check-models.mjs')).href);
  assert.deepEqual(GEOMETRY_CHECK_RESULT.failures, [], 'See the geometry contract failures above');
});

console.log(`\n${passed} checks passed; ${failures.length} failed.`);
if (failures.length) process.exitCode = 1;

await import('./check-technology.mjs');


await import('./check-navigation.mjs');
await import('./check-depot.mjs');
await import('./check-occ.mjs');
await import('./check-exploration.mjs');
await import('./check-comparisons.mjs');

await import('./check-studies.mjs');
