/*
  Generates sitemap.xml, robots.txt and the SEO block (canonical, Open Graph, Twitter,
  JSON-LD) inside the <head> of every page. Safe to run repeatedly.

    node tools/build-seo.mjs

  Change SITE below if the site moves to a custom domain, then run it again.
*/
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const SITE = 'https://lavelty.github.io/my-project/';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OG_IMAGE = SITE + 'assets/og/og-default.jpg';

/* load the same data the browser uses */
const ctx = { window: {}, matchMedia: () => ({ matches: false }), console };
vm.createContext(ctx);
for (const f of ['assets/js/stores.js', 'assets/js/events.js', 'assets/js/data.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const KF = ctx.window.KF;

const pages = ['index.html', 'etkinlikler.html', 'etkinlik.html', 'kat-planlari.html', 'magaza.html', 'kvkk.html', 'sartlar.html'];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const today = new Date().toISOString().slice(0, 10);

const shoppingCenter = {
  '@context': 'https://schema.org',
  '@type': 'ShoppingCenter',
  name: 'Koru Florya',
  url: SITE,
  logo: SITE + 'assets/logo/koruflorya-icon-hq.png',
  image: OG_IMAGE,
  description: 'Florya’da alışveriş ve yaşam merkezi: mağazalar, yeme içme durakları, etkinlikler ve ücretsiz Marmaray ring servisi.',
  address: { '@type': 'PostalAddress', streetAddress: 'Şenlikköy Mahallesi, Ekşinar Sokak No: 46/1', addressLocality: 'Bakırköy', addressRegion: 'İstanbul', postalCode: '34153', addressCountry: 'TR' },
  geo: { '@type': 'GeoCoordinates', latitude: KF.COORD.mall.lat, longitude: KF.COORD.mall.lon },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '10:00', closes: '22:00' }],
  email: 'info@koruflorya.com',
  sameAs: ['https://www.instagram.com/koruflorya.avm/', 'https://www.facebook.com/korufloryaavm', 'https://www.tiktok.com/@korufloryaavm']
};

const START = '<!-- seo:start -->';
const END = '<!-- seo:end -->';

for (const file of pages) {
  const p = path.join(ROOT, file);
  let html = fs.readFileSync(p, 'utf8');
  const crlf = html.includes('\r\n');
  html = html.replace(/\r\n/g, '\n');
  html = html.replace(new RegExp(`\\n?${START}[\\s\\S]*?${END}\\n?`), '\n');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || 'Koru Florya';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const url = SITE + (file === 'index.html' ? '' : file);
  const lines = [
    START,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="Koru Florya" />`,
    `<meta property="og:locale" content="tr_TR" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`
  ];
  if (file === 'index.html') lines.push(`<script type="application/ld+json">${JSON.stringify(shoppingCenter)}</script>`);
  lines.push(END);
  html = html.replace('</head>', lines.join('\n') + '\n</head>');
  fs.writeFileSync(p, crlf ? html.replace(/\n/g, '\r\n') : html);
}

/* sitemap */
const urls = [
  '', 'etkinlikler.html', 'kat-planlari.html', 'kvkk.html', 'sartlar.html',
  ...[0, 1, 2, -1].map((k) => `kat-planlari.html?kat=${k}`),
  ...KF.EVENTS.map((e) => `etkinlik.html?e=${e.id}`),
  ...KF.stores.map((s) => `magaza.html?s=${s.slug}`)
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${esc(SITE + u)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
console.log(`SEO block added to ${pages.length} pages, sitemap.xml with ${urls.length} URLs, robots.txt written`);
