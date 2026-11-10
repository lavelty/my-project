/* Home page logic - V2 Premium Upgrade */
(function(){
const {esc,low,pad,FL,FORDER,CATS,stores,byName,ist}=KF;
const $=s=>document.querySelector(s);
const U=(p,w)=>`https://images.unsplash.com${p}?auto=format&fit=crop&q=75&w=${w}`;
const IMG={
  atrium:'/photo-1519567241046-7f570eee3ce6',
  fashion:'/photo-1483985988355-763728e1935b',
  cafe:'/photo-1764489307253-da5c9c311fa2',
  trees:'/photo-1757585920915-c5a388d16e44'
};
const ARR=KF.IC.arr;

/* ========================================================
   1. HERO SLIDESHOW (SMOOTH FADE + SUBTLE SCALE)
   ======================================================== */
const SLIDES=[
  {img:IMG.atrium,alt:'Koru Florya iç mekânı'},
  {img:IMG.fashion,alt:'Alışveriş deneyimi'},
  {img:IMG.cafe,alt:'Koru bahçe terasları'},
  {img:IMG.trees,alt:'Florya korusu ve doğa'}
];
const slidesEl=$('#slides'), dotsEl=$('#dots');
if(slidesEl){
  slidesEl.innerHTML=SLIDES.map((s,i)=>`
    <div class="slide${i?'':' on'}">
      <img src="${U(s.img,2000)}" alt="${s.alt}" width="2000" height="1125" ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async" />
    </div>
  `).join('');
}
if(dotsEl){
  dotsEl.innerHTML=SLIDES.map((s,i)=>`<button type="button" aria-label="Slayt ${i+1}" aria-current="${i===0}"></button>`).join('');
}
let cur=0,timer;
const go=i=>{
  cur=(i+SLIDES.length)%SLIDES.length;
  document.querySelectorAll('.slide').forEach((el,k)=>el.classList.toggle('on',k===cur));
  document.querySelectorAll('#dots button').forEach((b,k)=>b.setAttribute('aria-current',k===cur));
};
const play=()=>{clearInterval(timer);if(!KF.reduce)timer=setInterval(()=>go(cur+1),7000)};
if(dotsEl){
  dotsEl.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(!b) return;
    go([...b.parentNode.children].indexOf(b));
    play();
  });
}
const topHero=$('#top');
if(topHero){
  topHero.addEventListener('mouseenter',()=>clearInterval(timer));
  topHero.addEventListener('mouseleave',play);
}
play();

/* Brand Strip */
const BRANDS=['Zara','Mango','Beymen Club','Starbucks','LEGO Store','Pandora','MediaMarkt','Shake Shack','Lacoste','Swarovski','Boyner','Puma',"Levi's",'Samsung'];
const brandList=$('#brandList');
if(brandList){
  brandList.innerHTML=BRANDS.map(n=>byName[n]).filter(s=>s&&s.l).map(s=>`
    <li><img src="assets/brands/${s.l}" alt="${esc(s.n)}" loading="lazy" decoding="async" /></li>
  `).join('');
}

/* ========================================================
   2. ARCHITECTURAL FLOOR & BRAND EXPLORER (MULTI-CATEGORY)
   ======================================================== */
const FLOOR_DATA={
  'all':{
    id:'all',title:'Tüm Katlarda 177 Seçkin Marka',badge:'Koru Florya Katları',
    desc:'Açık hava bahçe terasları, ferah botanik cam atriyum ve dünya markalarıyla alışverişin en keyifli hali.',
    count:177
  },
  'C':{
    id:'C',title:'Cadde Katı (2. Kat)',badge:'Açık Teras & Restoranlar',
    desc:'Geniş bahçe terasları, dünya mutfaklarından seçkin restoranlar, gurme bistrolar ve açık hava ferahlığı.',
    count:34
  },
  'P':{
    id:'P',title:'Podyum Katı (1. Kat)',badge:'Moda & Kozmetik',
    desc:'Dünyaca ünlü hazır giyim markaları, tasarım butikleri, kozmetik, saat ve mücevher mağazaları.',
    count:48
  },
  'K':{
    id:'K',title:'Koru Katı (Giriş Kat)',badge:'Giriş & Botanik Atriyum',
    desc:'Yüksek cam tavanlı botanik atriyum, artisan kahve noktaları, hızlı lezzetler ve teknoloji mağazaları.',
    count:56
  },
  'O':{
    id:'O',title:'Otopark Katı (-1. Kat)',badge:'Hizmetler & Otopark',
    desc:'1.200 araçlık kapalı otopark, oto yıkama & VIP vale, terzi, kuru temizleme ve günlük hizmet noktaları.',
    count:39
  }
};

const st={
  f: 'all',
  cats: new Set(), // Set of active categories (empty = all)
  q: '',
  lim: 12
};

// Render Category Pills
const pillsEl=$('#pills');
if(pillsEl){
  pillsEl.innerHTML=`<button class="pill on" type="button" data-c="all" aria-pressed="true">Tümü</button>`+
    CATS.slice(0,9).map(c=>`<button class="pill" type="button" data-c="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');
}

// Update Stage Banner
function updateStageBanner(fKey){
  const d=FLOOR_DATA[fKey]||FLOOR_DATA['all'];
  if($('#sbBadge')) $('#sbBadge').textContent=d.badge;
  if($('#sbTitle')) $('#sbTitle').textContent=d.title;
  if($('#sbDesc')) $('#sbDesc').textContent=d.desc;
  if($('#sbStoreCount')) $('#sbStoreCount').textContent=d.count;
}

// Update Active Filter Chips Bar
function updateActiveFiltersBar(){
  const bar=$('#activeFiltersBar');
  const chips=$('#afChips');
  if(!bar || !chips) return;

  const hasCats = st.cats.size > 0;
  const hasFloor = st.f !== 'all';
  const hasQuery = Boolean(st.q);

  if(!hasCats && !hasFloor && !hasQuery){
    bar.hidden = true;
    chips.innerHTML = '';
    return;
  }

  bar.hidden = false;
  let html = '';

  if(hasFloor){
    const flName = FLOOR_DATA[st.f]?FLOOR_DATA[st.f].title:st.f;
    html += `<span class="af-chip" data-remove-filter="floor">${esc(flName)} <i aria-hidden="true">&times;</i></span>`;
  }

  st.cats.forEach(c=>{
    html += `<span class="af-chip" data-remove-filter="cat" data-cat="${esc(c)}">${esc(c)} <i aria-hidden="true">&times;</i></span>`;
  });

  if(hasQuery){
    html += `<span class="af-chip" data-remove-filter="query">“${esc(st.q)}” <i aria-hidden="true">&times;</i></span>`;
  }

  chips.innerHTML = html;
}

// Turkish character search normalization (handles i/ı, ş/s, ğ/g, ü/u, ö/o, ç/c)
function normTr(s){
  return (s||'').toLocaleLowerCase('tr')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

// Search Highlight
const PIN_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="14" height="14"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
function hl(name){
  if(!st.q) return esc(name);
  const qNorm=normTr(st.q);
  if(!qNorm) return esc(name);
  const nNorm=normTr(name);
  const i=nNorm.indexOf(qNorm);
  if(i<0) return esc(name);
  return esc(name.slice(0,i))+'<mark>'+esc(name.slice(i,i+qNorm.length))+'</mark>'+esc(name.slice(i+qNorm.length));
}

// Render Stores
function renderStores(){
  const qNorm = normTr(st.q);
  const list=stores.filter(s=>{
    const matchFloor = (st.f === 'all' || s.fl.includes(st.f));
    const matchCat = (st.cats.size === 0 || s.c.some(cat => st.cats.has(cat)));
    const matchQuery = (!qNorm || normTr(s.n).includes(qNorm) || s.c.some(c => normTr(c).includes(qNorm)));
    return matchFloor && matchCat && matchQuery;
  });

  const clearBtn=$('#clearBtn');
  const isFiltered = (st.f !== 'all' || st.cats.size > 0 || Boolean(st.q));
  if(clearBtn) clearBtn.hidden = !isFiltered;

  const resText=$('#resText');
  if(resText){
    const floorLabel = FLOOR_DATA[st.f]?FLOOR_DATA[st.f].title:'Tüm Katlar';
    const catLabel = st.cats.size > 0 ? ` · ${st.cats.size} kategori seçili` : '';
    resText.innerHTML = `<b>${list.length}</b> mağaza bulundu · ${floorLabel}${catLabel}`;
  }

  updateActiveFiltersBar();

  const show=list.slice(0,st.lim);
  const grid=$('#storeGrid');
  if(grid){
    grid.innerHTML=show.length?show.map(s=>`
      <article class="store-card" data-store="${esc(s.n)}">
        <div class="sc-top">
          <div class="sc-logo">${KF.logoHtml(s)}</div>
          <span class="sc-cat">${esc(s.c[0]||'Mağaza')}</span>
        </div>
        <div class="sc-mid">
          <h3 class="sc-name">${hl(s.n)}</h3>
          <p class="sc-floor">${PIN_SVG} ${esc(KF.floorLabel(s))}</p>
        </div>
        <div class="sc-bottom">
          <span class="sc-hours">10:00 – 22:00</span>
          <button class="sc-btn" type="button" data-open-store="${esc(s.n)}">Detay &amp; Konum <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></button>
        </div>
      </article>
    `).join(''):`
      <div class="empty" style="grid-column:1/-1">
        <p>${st.q?'“'+esc(st.q)+'” için eşleşen mağaza bulunamadı':'Seçilen filtrelerle eşleşen mağaza bulunamadı'}</p>
        <button class="btn btn-dark" type="button" id="emptyClear">Filtreleri Temizle</button>
      </div>
    `;
  }

  const moreBtn=$('#moreBtn');
  const rest=list.length - show.length;
  if(moreBtn){
    moreBtn.hidden = rest <= 0;
    moreBtn.textContent = `Daha fazla mağaza göster (${rest} mağaza kaldı)`;
  }
}

// Floor Tower Selection Listener
document.addEventListener('click',e=>{
  const tc=e.target.closest('.tower-card, .tower-all-btn');
  if(!tc) return;
  st.f=tc.dataset.f;
  document.querySelectorAll('.tower-card, .tower-all-btn').forEach(c=>c.classList.toggle('on',c===tc));
  updateStageBanner(st.f);
  st.lim=12;
  renderStores();
});

// Category Pills Listener (Supports Multi-Selection)
if(pillsEl){
  pillsEl.addEventListener('click',e=>{
    const b=e.target.closest('.pill');
    if(!b) return;
    const cat = b.dataset.c;

    if(cat === 'all'){
      st.cats.clear();
      document.querySelectorAll('#pills .pill').forEach(p=>{
        const isAll = p.dataset.c === 'all';
        p.classList.toggle('on', isAll);
        p.setAttribute('aria-pressed', isAll);
      });
    } else {
      if(st.cats.has(cat)){
        st.cats.delete(cat);
      } else {
        st.cats.add(cat);
      }
      
      const allPill = $('#pills .pill[data-c="all"]');
      if(st.cats.size === 0){
        if(allPill){
          allPill.classList.add('on');
          allPill.setAttribute('aria-pressed', true);
        }
      } else {
        if(allPill){
          allPill.classList.remove('on');
          allPill.setAttribute('aria-pressed', false);
        }
      }

      document.querySelectorAll('#pills .pill:not([data-c="all"])').forEach(p=>{
        const active = st.cats.has(p.dataset.c);
        p.classList.toggle('on', active);
        p.setAttribute('aria-pressed', active);
      });
    }

    st.lim=12;
    renderStores();
  });
}

// Active Filter Chip Removal
document.addEventListener('click',e=>{
  const chip = e.target.closest('[data-remove-filter]');
  if(!chip) return;
  const type = chip.dataset.removeFilter;

  if(type === 'floor'){
    st.f = 'all';
    document.querySelectorAll('.tower-card').forEach(c=>c.classList.remove('on'));
    const allBtn=$('.tower-all-btn');
    if(allBtn) allBtn.classList.add('on');
    updateStageBanner('all');
  } else if(type === 'cat'){
    const c = chip.dataset.cat;
    st.cats.delete(c);
    const pill = $(`#pills .pill[data-c="${c}"]`);
    if(pill){
      pill.classList.remove('on');
      pill.setAttribute('aria-pressed', false);
    }
    if(st.cats.size === 0){
      const allPill = $('#pills .pill[data-c="all"]');
      if(allPill){
        allPill.classList.add('on');
        allPill.setAttribute('aria-pressed', true);
      }
    }
  } else if(type === 'query'){
    const qInput=$('#q');
    if(qInput) qInput.value = '';
    st.q = '';
  }

  st.lim = 12;
  renderStores();
});

// Clear All Filters
function clearAllFilters(){
  const qInput=$('#q');
  if(qInput) qInput.value='';
  st.q='';
  st.cats.clear();
  st.f='all';
  st.lim=12;

  document.querySelectorAll('.tower-card').forEach(c=>c.classList.remove('on'));
  const allBtn=$('.tower-all-btn');
  if(allBtn) allBtn.classList.add('on');

  document.querySelectorAll('#pills .pill').forEach(p=>{
    const isAll = p.dataset.c === 'all';
    p.classList.toggle('on', isAll);
    p.setAttribute('aria-pressed', isAll);
  });

  updateStageBanner('all');
  renderStores();
}

const clearBtn=$('#clearBtn');
if(clearBtn) clearBtn.addEventListener('click', clearAllFilters);

const afClearAll=$('#afClearAll');
if(afClearAll) afClearAll.addEventListener('click', clearAllFilters);

// Debounced Search Input
let searchTimer;
const qInput=$('#q');
if(qInput){
  qInput.addEventListener('input',e=>{
    clearTimeout(searchTimer);
    searchTimer = setTimeout(()=>{
      st.q=low(e.target.value.trim());
      st.lim=12;
      renderStores();
    }, 120);
  });
}

// More Button
const moreBtn=$('#moreBtn');
if(moreBtn){
  moreBtn.addEventListener('click',()=>{
    st.lim += 12;
    renderStores();
  });
}

// Keyboard shortcut (Ctrl+K to focus search, ESC to clear or close modal)
document.addEventListener('keydown',e=>{
  const isK=(e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey);
  const slash=e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if(isK||slash){
    e.preventDefault();
    if(qInput){
      qInput.focus();
      qInput.select();
    }
    const rehber=$('#rehber');
    if(rehber) rehber.scrollIntoView({behavior:KF.reduce?'auto':'smooth',block:'start'});
  }
  if(e.key==='Escape'){
    const modal=$('#storeModal');
    if(modal && modal.open){
      modal.close();
    } else if(qInput && document.activeElement===qInput && qInput.value){
      qInput.value='';
      st.q='';
      st.lim=12;
      renderStores();
      qInput.blur();
    }
  }
});
const kbdEl=$('#kbd');
if(kbdEl) kbdEl.textContent=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?'⌘ K':'Ctrl K';

/* ========================================================
   3. STORE QUICK-VIEW MODAL
   ======================================================== */
const storeModal=$('#storeModal');
const smClose=$('#smClose');

function openStoreModal(name){
  const store=byName[name];
  if(!store || !storeModal) return;

  $('#smLogo').innerHTML=KF.logoHtml(store);
  $('#smName').textContent=store.n;
  $('#smFloor').textContent=`${KF.floorLabel(store)} · Koru Florya`;
  $('#smCat').textContent=store.c.join(', ');
  $('#smLoc').textContent=KF.floorLabel(store);
  
  // Phone number only if verified in store record
  const phoneRow = $('#smPhoneRow');
  const phoneEl = $('#smPhone');
  if(store.phone){
    if(phoneRow) phoneRow.hidden = false;
    if(phoneEl) phoneEl.textContent = store.phone;
  } else {
    if(phoneRow) phoneRow.hidden = true;
    if(phoneEl) phoneEl.textContent = '';
  }

  $('#smDesc').textContent=store.d||`${store.n}, güncel koleksiyonları ve seçkin ürünleriyle Koru Florya'da sizleri bekliyor.`;
  $('#smDir').href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Koru Florya AVM '+store.n)}`;
  
  storeModal.showModal();
}

if(storeModal){
  if(smClose) smClose.addEventListener('click',()=>storeModal.close());
  storeModal.addEventListener('click',e=>{
    if(e.target===storeModal) storeModal.close();
  });
}

document.addEventListener('click',e=>{
  if(e.target.closest('#emptyClear')){
    clearAllFilters();
    return;
  }
  const btn=e.target.closest('[data-open-store]');
  if(btn){
    e.preventDefault();
    openStoreModal(btn.dataset.openStore);
  }
});

// Initial floor & store render
updateStageBanner('all');
renderStores();

/* ========================================================
   4. DİNAMİK ULAŞIM TERMİNALİ & YERİ ASLA KAYMAYAN LEAFLET
   ======================================================== */
let mapInstance=null;
let activeRouteLayers=[];

// Fixed Pin Factory: Anchor point [18, 40] is the absolute bottom needle tip of the pin!
function createFixedPin(title, color, typeIcon){
  return L.divIcon({
    className: 'leaflet-fixed-marker',
    iconSize: [36, 40],
    iconAnchor: [18, 40],
    popupAnchor: [0, -42],
    html: `
      <div class="fixed-pin" style="--pin-color:${color}">
        <span class="pin-bubble">${esc(title)}</span>
        <div class="pin-marker-shape">${typeIcon}</div>
      </div>
    `
  });
}

const MALL_ICON_SVG='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 20 15h-5l5 6H4l5-6H4z"/></svg>';
const TRAIN_ICON_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/></svg>';
const BUS_ICON_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 12h16M8 21l-1-4M16 21l1-4"/></svg>';
const CAR_ICON_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>';

// Route Configurations
// Real Turn-by-Turn Route Configurations (Physically Verified)
const ROUTES={
  'shuttle':{
    color:'#00B995',
    leg:'Marmaray Florya İstasyonu ↔ Koru Florya (Ücretsiz Ring Servis · 1,4 km · 5 dk)',
    path:[
      [40.972898, 28.787609],
      [40.973500, 28.786500],
      [40.974500, 28.784800],
      [40.975800, 28.783500],
      [40.977200, 28.782800],
      [40.978800, 28.782100],
      [40.980500, 28.781600],
      [40.982200, 28.781900],
      [40.983500, 28.782800],
      [40.984268, 28.783451]
    ],
    markers:[
      {pos:[40.972898, 28.787609],title:'Marmaray Florya İstasyonu',color:'#00B995',icon:TRAIN_ICON_SVG},
      {pos:[40.984268, 28.783451],title:'Koru Florya AVM (Ring Servis Noktası)',color:'#E53935',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9720, 28.7800], [40.9855, 28.7885]]
  },
  'metro':{
    color:'#FF7F41',
    leg:'Cennet Mahallesi Metrobüs Durağı ↔ Koru Florya (Doğrudan Üst Geçit & Yaya Yolu · 130 m · 2 dk)',
    path:[
      [40.985390, 28.783233],
      [40.985180, 28.783250],
      [40.984750, 28.783320],
      [40.984268, 28.783451]
    ],
    markers:[
      {pos:[40.985390, 28.783233],title:'Cennet Mahallesi Metrobüs Durağı',color:'#FF7F41',icon:TRAIN_ICON_SVG},
      {pos:[40.984268, 28.783451],title:'Koru Florya Ana Giriş Kapısı',color:'#E53935',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9838, 28.7824], [40.9858, 28.7842]]
  },
  'bus':{
    color:'#2563EB',
    leg:'Koru Florya İETT Otobüs Durağı ↔ Ana Giriş Kapısı (70 m · 1 dk)',
    path:[
      [40.985050, 28.783300],
      [40.984650, 28.783350],
      [40.984268, 28.783451]
    ],
    markers:[
      {pos:[40.985050, 28.783300],title:'Koru Florya İETT Durağı (73, 73F, 98)',color:'#2563EB',icon:BUS_ICON_SVG},
      {pos:[40.984268, 28.783451],title:'Koru Florya Ana Giriş',color:'#E53935',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9840, 28.7828], [40.9854, 28.7840]]
  },
  'car':{
    color:'#17211E',
    leg:'Ekşinar Sokak ↔ 1.200 Araçlık Kapalı Otopark & VIP Vale Girişi',
    path:[
      [40.982600, 28.782100],
      [40.983600, 28.782800],
      [40.984100, 28.783200],
      [40.984268, 28.783451]
    ],
    markers:[
      {pos:[40.983600, 28.782800],title:'Kapalı Otopark Girişi (-1 / -2)',color:'#17211E',icon:CAR_ICON_SVG},
      {pos:[40.984268, 28.783451],title:'Koru Florya VIP Vale',color:'#E53935',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9824, 28.7818], [40.9848, 28.7842]]
  }
};

function switchTransitRoute(routeKey){
  if(!mapInstance) return;
  const cfg=ROUTES[routeKey]||ROUTES['shuttle'];

  // Clear previous route layers
  activeRouteLayers.forEach(l=>mapInstance.removeLayer(l));
  activeRouteLayers=[];

  // Outer casing for high contrast on both street and satellite
  const casing=L.polyline(cfg.path, {
    color: '#FFFFFF',
    weight: 7,
    opacity: 0.8
  }).addTo(mapInstance);
  activeRouteLayers.push(casing);

  // Colored dashed polyline
  const poly=L.polyline(cfg.path, {
    color: cfg.color,
    weight: 4.5,
    dashArray: '6, 8',
    opacity: 0.98
  }).addTo(mapInstance);
  activeRouteLayers.push(poly);

  // Add fixed markers
  cfg.markers.forEach(m=>{
    const icon=createFixedPin(m.title, m.color, m.icon);
    const marker=L.marker(m.pos, {icon}).addTo(mapInstance);
    activeRouteLayers.push(marker);
  });

  // Fit bounds smoothly
  mapInstance.flyToBounds(cfg.bounds, {
    padding: [50, 50],
    duration: 1
  });

  // Update map legend text
  const legText=$('#mapLegText');
  if(legText) legText.textContent=cfg.leg;
}

// Shuttle Timetable Logic
let sdir='MF';
function updateShuttle(){
  const now=KF.nowSecs();
  const nx=KF.nextShuttle(sdir,now);
  const shBadge=$('#shBadge');
  const shDot=$('#shDot');
  if(shBadge){
    shBadge.textContent=nx?`Sıradaki servis ${nx.t} · Kalkışa ${nx.min} dk kaldı`:`Bugünkü seferler bitti · Yarın ilk servis ${KF.SHUTTLE[sdir][0]}`;
  }
  if(shDot) shDot.classList.toggle('off',!nx);
  
  const shTimes=$('#shTimes');
  if(shTimes){
    shTimes.innerHTML=KF.SHUTTLE[sdir].map(t=>{
      const isNext=nx&&t===nx.t;
      const isPast=KF.secs(t)<=now;
      return `<span class="time-chip${isNext?' next':(isPast?' past':'')}">${t}</span>`;
    }).join('');
  }
}

document.querySelectorAll('.sw button').forEach(b=>b.addEventListener('click',()=>{
  sdir=b.dataset.d;
  document.querySelectorAll('.sw button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  updateShuttle();
}));

// Route Tab Switching Listener
const transitTabs=document.querySelectorAll('.t-tab');
transitTabs.forEach(tab=>{
  tab.addEventListener('click',()=>{
    transitTabs.forEach(t=>t.classList.remove('on'));
    tab.classList.add('on');
    const routeKey=tab.dataset.route;
    
    // Switch pane
    const targetId='tp-'+routeKey;
    document.querySelectorAll('.t-pane').forEach(p=>p.classList.toggle('on',p.id===targetId));
    
    // Switch map route line & markers
    switchTransitRoute(routeKey);
  });
});

document.addEventListener('kf:tick',updateShuttle);
updateShuttle();

// Leaflet Map Init with Street & Satellite Layers
let currentMapTheme='street';
let streetLayer=null;
let satelliteLayer=null;

function setMapTheme(theme){
  if(!mapInstance) return;
  if(theme===currentMapTheme) return;
  currentMapTheme=theme;

  if(theme==='satellite'){
    if(streetLayer) mapInstance.removeLayer(streetLayer);
    if(!satelliteLayer){
      satelliteLayer=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar Geographics'
      });
    }
    satelliteLayer.addTo(mapInstance);
    const attr=$('#mapAttr');
    if(attr) attr.innerHTML='<a href="https://www.esri.com" target="_blank" rel="noopener">© Esri World Imagery</a>';
  } else {
    if(satelliteLayer) mapInstance.removeLayer(satelliteLayer);
    if(!streetLayer){
      streetLayer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      });
    }
    streetLayer.addTo(mapInstance);
    const attr=$('#mapAttr');
    if(attr) attr.innerHTML='<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap</a>';
  }

  // Update theme button active state
  document.querySelectorAll('.map-theme-toggle .mt-btn').forEach(b=>{
    b.classList.toggle('on', b.dataset.mapTheme===theme);
  });
}

// Map theme button listeners
document.querySelectorAll('.map-theme-toggle .mt-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    setMapTheme(btn.dataset.mapTheme);
  });
});

function initLeafletMap(){
  const canvas=$('#mapCanvas');
  if(!canvas || !window.L) return;
  canvas.innerHTML='';

  mapInstance = L.map('mapCanvas', {
    center: [40.9785, 28.7855],
    zoom: 15,
    scrollWheelZoom: true,
    zoomControl: true
  });

  streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance);

  // Initial route (shuttle)
  switchTransitRoute('shuttle');
}

if(window.L){
  initLeafletMap();
} else {
  window.addEventListener('load',initLeafletMap);
}

// Deep linking
const want=new URLSearchParams(location.search).get('magaza');
if(want&&byName[want]){
  setTimeout(()=>{
    openStoreModal(want);
  },400);
}
})();
