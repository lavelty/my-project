/*
  Source of truth for the content:
    assets/data/stores.json   stores (name, floor, categories, logo)
    assets/data/events.json   events and campaigns

  The site reads generated scripts, so after editing a JSON file run:

    node tools/build-data.mjs

  It writes assets/js/stores.js and assets/js/events.js, then refreshes the SEO files.
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

const stores = read('assets/data/stores.json');
const events = read('assets/data/events.json');

/* basic validation, so a typo does not break the live site */
const errors = [];
const floors = new Set(['K', 'P', 'C', 'O', 'PC']);
const names = new Set();
for (const s of stores) {
  if (!s.n) errors.push('store without name');
  if (names.has(s.n)) errors.push(`duplicate store: ${s.n}`);
  names.add(s.n);
  if (!floors.has(s.f)) errors.push(`${s.n}: unknown floor "${s.f}"`);
  if (!Array.isArray(s.c) || !s.c.length) errors.push(`${s.n}: needs at least one category`);
  if (s.l && !fs.existsSync(path.join(ROOT, 'assets/brands', s.l))) errors.push(`${s.n}: missing logo file ${s.l}`);
}
const ids = new Set();
for (const e of events) {
  if (!e.id || !e.title) errors.push('event needs id and title');
  if (ids.has(e.id)) errors.push(`duplicate event id: ${e.id}`);
  ids.add(e.id);
  if (!['event', 'campaign'].includes(e.type)) errors.push(`${e.id}: type must be event or campaign`);
  if (e.start && Number.isNaN(Date.parse(e.start))) errors.push(`${e.id}: bad start date`);
  if (e.img && !fs.existsSync(path.join(ROOT, 'assets/events', e.img))) errors.push(`${e.id}: missing image ${e.img}`);
  if (e.store && !names.has(e.store)) errors.push(`${e.id}: store "${e.store}" is not in stores.json`);
}
if (errors.length) {
  console.error('Not written. Fix these first:\n - ' + errors.join('\n - '));
  process.exit(1);
}

fs.writeFileSync(path.join(ROOT, 'assets/js/stores.js'), 'window.KF_STORES=' + JSON.stringify(stores) + ';\n');
fs.writeFileSync(path.join(ROOT, 'assets/js/events.js'), 'window.KF_EVENTS=' + JSON.stringify(events) + ';\n');
console.log(`stores.js (${stores.length} stores) and events.js (${events.length} events) written`);

const r = spawnSync(process.execPath, [path.join(ROOT, 'tools/build-seo.mjs')], { stdio: 'inherit' });
process.exit(r.status ?? 0);
