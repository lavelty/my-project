/*
  Compares assets/data/stores.json with the official store list on koruflorya.com and
  reports what is new, removed or moved. By default it only reports.

    node tools/sync-from-koruflorya.mjs            report only
    node tools/sync-from-koruflorya.mjs --write    update stores.json and download new logos

  New logos are saved as .webp when the optional "sharp" package is installed
  (npm i sharp in this folder), otherwise as .png.

  It also lists official events that are missing from assets/data/events.json.
  Events are written by hand because they carry extra text, so add the ones it lists.

  Note: the official terms of use require prior permission for automated access.
  Only run this with the site owner's consent, and keep the pause between requests.
*/
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://www.koruflorya.com';
const WRITE = process.argv.includes('--write');
const UA = { 'User-Agent': 'Mozilla/5.0 (Koru Florya site sync)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (u) => { await sleep(250); const r = await fetch(u.startsWith('http') ? u : BASE + u, { headers: UA }); if (!r.ok) throw new Error(u + ' ' + r.status); return r; };

const CATS = { 'moda-giyim': 'Moda & Giyim', 'yeme-icme': 'Yeme & İçme', 'saat-mucevher': 'Saat & Mücevher', 'cocuk': 'Çocuk', 'ev-yasam': 'Ev & Yaşam', 'spor-outdoor': 'Spor & Outdoor', 'kozmetik-bakim': 'Kozmetik & Bakım', 'teknoloji': 'Teknoloji', 'hizmet-banka': 'Hizmet & Banka', 'aksesuar-taki': 'Aksesuar & Takı', 'saglik-optik': 'Sağlık & Optik', 'market-gida': 'Market & Gıda', 'kirtasiye-kitap': 'Kırtasiye & Kitap' };
const FLOOR = { 'Koru Katı (Giriş Kat)': 'K', 'Podyum Katı (1. Kat)': 'P', 'Cadde Katı (2. Kat)': 'C', '-1 Otopark Katı': 'O', 'Podyum Katı (1. Kat) · Cadde Katı (2. Kat)': 'PC' };
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const parseCards = (html) => [...html.matchAll(/<article class="store-card[^"]*">([\s\S]*?)<\/article>/g)].map((m) => {
  const b = m[1];
  return {
    name: dec((b.match(/<h3 class="name">([^<]+)</) || [])[1] || '').trim(),
    logo: ((b.match(/<img src="([^"?]+)/) || [])[1] || '').replace('/assets/brands/', ''),
    floor: dec((b.match(/<p class="cat">[\s\S]*?<\/svg>\s*([^<]+)</) || [])[1] || '').trim()
  };
}).filter((x) => x.name);

const official = new Map();
for (const [slug, label] of Object.entries(CATS)) {
  for (let p = 1; p <= 15; p++) {
    let html; try { html = await (await get(`/magazalar.php?kategori=${slug}&sayfa=${p}`)).text(); } catch { break; }
    const cards = parseCards(html); if (!cards.length) break;
    for (const c of cards) {
      const s = official.get(c.name) || { n: c.name, f: FLOOR[c.floor] || c.floor, c: [], l: c.logo };
      if (!s.c.includes(label)) s.c.push(label);
      if (!s.l && c.logo) s.l = c.logo;
      official.set(c.name, s);
    }
    if (!new RegExp(`sayfa=${p + 1}`).test(html)) break;
  }
}

const file = path.join(ROOT, 'assets/data/stores.json');
const mine = JSON.parse(await fs.readFile(file, 'utf8'));
const mineBy = new Map(mine.map((s) => [s.n, s]));
const added = [...official.values()].filter((s) => !mineBy.has(s.n));
const removed = mine.filter((s) => !official.has(s.n));
const changed = mine.filter((s) => official.has(s.n)).filter((s) => { const o = official.get(s.n); return o.f !== s.f || [...o.c].sort().join('|') !== [...s.c].sort().join('|'); });

console.log(`Official: ${official.size} stores. Local: ${mine.length}.`);
console.log('New on the official site:', added.map((s) => s.n).join(', ') || 'none');
console.log('Missing from the official site:', removed.map((s) => s.n).join(', ') || 'none');
for (const s of changed) { const o = official.get(s.n); console.log(`Changed: ${s.n}: ${s.f} ${s.c.join('/')} -> ${o.f} ${o.c.join('/')}`); }

/* official events not yet in events.json */
try {
  const html = await (await get('/etkinlikler.php')).text();
  const slugs = [...new Set([...html.matchAll(/etkinlik\.php\?slug=([a-z0-9-]+)/g)].map((m) => m[1]))];
  const events = JSON.parse(await fs.readFile(path.join(ROOT, 'assets/data/events.json'), 'utf8'));
  const have = new Set(events.map((e) => e.id));
  const missing = slugs.filter((s) => !have.has(s));
  console.log('Official events not in events.json:', missing.length ? missing.map((s) => `${s} (${BASE}/etkinlik.php?slug=${s})`).join(', ') : 'none');
} catch (e) { console.log('Events check skipped:', e.message); }

if (!WRITE) { console.log('\nReport only. Run with --write to apply the store changes.'); process.exit(0); }

let sharp = null; try { sharp = (await import('sharp')).default; } catch { /* optional */ }
const logoDir = path.join(ROOT, 'assets/brands');
const saveLogo = async (name) => {
  const buf = Buffer.from(await (await get('/assets/brands/' + name)).arrayBuffer());
  if (sharp) { const out = name.replace(/\.[a-z]+$/, '.webp'); await sharp(buf).resize({ width: 320, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(logoDir, out)); return out; }
  await fs.writeFile(path.join(logoDir, name), buf); return name;
};
const next = mine.filter((s) => official.has(s.n)).map((s) => { const o = official.get(s.n); return { ...s, f: o.f, c: o.c }; });
for (const s of added) next.push({ n: s.n, f: s.f, c: s.c, l: s.l ? await saveLogo(s.l) : '' });
next.sort((a, b) => a.n.localeCompare(b.n, 'tr'));
await fs.writeFile(file, JSON.stringify(next, null, 1));
console.log('stores.json updated. Now run: node tools/build-data.mjs');
