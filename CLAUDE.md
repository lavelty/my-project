# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Project

Koru Florya: a Turkish-language site for a shopping mall in Bakırköy, Istanbul, published as a static site on GitHub Pages (https://lavelty.github.io/my-project/). There is no bundler, package manager for the site, linter or test suite. Plain HTML, CSS and JavaScript.

## Commands

- Run locally: serve the folder, for example `npx http-server . -p 4173 -c-1`, then open http://localhost:4173. Opening `index.html` directly also works.
- After editing `assets/data/stores.json` or `assets/data/events.json`: `node tools/build-data.mjs`. It validates the data, regenerates `assets/js/stores.js` and `assets/js/events.js`, then refreshes `sitemap.xml`, `robots.txt` and the SEO block in every page.
- Only the SEO files: `node tools/build-seo.mjs`. Change `SITE` at the top of that file if the domain changes.
- Compare the store list with the official site: `node tools/sync-from-koruflorya.mjs` (report only; `--write` applies). The official terms require permission for automated access.
- Deploy: push to `main`. `.github/workflows/deploy-pages.yml` publishes the whole repo root, so every tracked file is public.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, brand strip, floor and store explorer, services, transport map |
| `etkinlikler.html` | Events list with tabs: upcoming, this week, this month, past, campaigns |
| `etkinlik.html?e=<id>` | Event or campaign detail, calendar links |
| `magaza.html?s=<slug>` | Store detail (slug comes from the name, see `KF.slugify`) |
| `kat-planlari.html?kat=0\|1\|2\|-1` | Floor plans by floor, store cards, hook for real plan drawings |
| `kvkk.html`, `sartlar.html` | Legal reader pages, text copied from the official site |

## Architecture

- `assets/css/site.css`: shared styles and design tokens (`:root` variables). `assets/css/store-pages.css`: styles for the store and floor pages, mapped to the same tokens.
- `assets/js/data.js`: the `KF` namespace with floors, categories, shuttle timetable, date and calendar helpers, URL helpers. It reads `window.KF_STORES` and `window.KF_EVENTS`.
- `assets/js/stores.js` and `assets/js/events.js` are GENERATED. Edit `assets/data/*.json`, never these two files.
- `assets/js/chrome.js`: injects the header and footer on every page, handles the transparent-to-solid header (IntersectionObserver on `#heroEnd`) and the live open/closed status.
- `assets/js/home.js` (home page), `cards.js` (event card markup), `legal.js` (table of contents), `seo.js` (runtime JSON-LD for store and event pages).
- Script order on every page: `stores.js`, `events.js`, `data.js`, then page scripts, `chrome.js` last of the shared ones.
- Images: `assets/brands/*.webp` (store logos), `assets/events/*.webp` (posters, which contain baked-in text), `assets/logo/` (official logo SVGs; the SVG files carry no colors, the favicon colors were assigned by hand). Unsplash photos are hotlinked for the hero and category images.
- The map on the home page uses Leaflet from a CDN with OpenStreetMap tiles. Route paths and stop positions are approximate.

## Content rules

- Facts come from koruflorya.com or from the stores list. Do not invent amenities, distances, capacities or brand names. Services confirmed by the official site: information desk, banks and ATM, lost property (Koru Katı), baby care room (Podyum Katı). Vale parking and EV charging are NOT confirmed.
- Floors: Koru Katı (ground, 0), Podyum Katı (1), Cadde Katı (2), Otopark Katı (-1). Zara, LC Waikiki and Boyner are on two floors (`f: "PC"`).
- The free shuttle timetable is in `KF.SHUTTLE` (read from the official visual). It is not strictly every 30 minutes.
- A real floor plan drawing does not exist yet. When one arrives, set `KF.PLAN_FILES.K = 'assets/plans/…svg'` in `data.js`; units need `data-store="<slug>"`.
- No emojis in the UI. Tabular figures for numbers. Sentence case.

## Working with others

More than one person or tool commits to this repo. Run `git pull` before starting, and commit small. Never force-push.

## Antigravity agent workflow

`.github/workflows/antigravity-agent.yml` and the tracked `.antigravity/` directory support a remote agent on GitHub Actions. Do not hand-edit `.antigravity/` files. The legacy `pair`/`token` workflow inputs print into public run logs, so do not use them. Because Pages publishes the repo root, anything under `.antigravity/` is publicly downloadable.
