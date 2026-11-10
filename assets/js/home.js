/* Home page logic */
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
   1. HERO SLIDESHOW
   ======================================================== */
const SLIDES=[
  {img:IMG.atrium,alt:'Koru Florya iç mekânı'},
  {img:IMG.fashion,alt:'Alışveriş deneyimi'},
  {img:IMG.cafe,alt:'Koru terasları ve kafeler'},
  {img:IMG.trees,alt:'Florya korusu ve doğa'}
];
const slidesEl=$('#slides'), dotsEl=$('#dots');
if(slidesEl){
  slidesEl.innerHTML=SLIDES.map((s,i)=>`<div class="slide${i?'':' on'}"><img src="${U(s.img,2000)}" alt="${s.alt}" width="2000" height="1125" ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async" /></div>`).join('');
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
  dotsEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;go([...b.parentNode.children].indexOf(b));play()});
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
  brandList.innerHTML=BRANDS.map(n=>byName[n]).filter(s=>s&&s.l).map(s=>`<li><img src="assets/brands/${s.l}" alt="${esc(s.n)}" loading="lazy" decoding="async" /></li>`).join('');
}

/* ========================================================
   2. ARCHITECTURAL FLOOR & BRAND EXPLORER
   ======================================================== */
const FLOOR_DATA={
  'all':{
    id:'all',title:'Tüm Katlarda 177 Seçkin Marka',badge:'Koru Florya Katları',
    desc:'Açık hava terasları, ferah botanik atriyum ve dünya markalarıyla alışverişin en keyifli hali.',
    count:177
  },
  'C':{
    id:'C',title:'Cadde Katı (2. Kat)',badge:'Açık Teras & Restoranlar',
    desc:'Geniş bahçe terasları, dünya mutfaklarından seçkin restoranlar, bistrolar ve açık hava ferahlığı.',
    count:34
  },
  'P':{
    id:'P',title:'Podyum Katı (1. Kat)',badge:'Moda & Kozmetik',
    desc:'Dünyaca ünlü hazır giyim markaları, tasarım butikleri, kozmetik ve mücevher mağazaları.',
    count:48
  },
  'K':{
    id:'K',title:'Koru Katı (Giriş Kat)',badge:'Giriş & Botanik Atriyum',
    desc:'Yüksek cam tavanlı botanik atriyum, artisan kahve noktaları, hızlı lezzetler ve teknoloji.',
    count:56
  },
  'O':{
    id:'O',title:'Otopark Katı (-1. Kat)',badge:'Hizmetler & Otopark',
    desc:'1.200 araçlık kapalı otopark, oto yıkama & vale, terzi, kuru temizleme ve günlük hizmetler.',
    count:39
  }
};

const st={f:'all',c:'all',q:'',lim:12};

// Render Category Pills
const pillsEl=$('#pills');
if(pillsEl){
  pillsEl.innerHTML=`<button class="pill" type="button" data-c="all" aria-pressed="true">Tümü</button>`+
    CATS.slice(0,8).map(c=>`<button class="pill" type="button" data-c="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');
}

// Update Stage Banner
function updateStageBanner(fKey){
  const d=FLOOR_DATA[fKey]||FLOOR_DATA['all'];
  if($('#sbBadge')) $('#sbBadge').textContent=d.badge;
  if($('#sbTitle')) $('#sbTitle').textContent=d.title;
  if($('#sbDesc')) $('#sbDesc').textContent=d.desc;
  if($('#sbStoreCount')) $('#sbStoreCount').textContent=d.count;
}

// Search Highlight
const PIN_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="14" height="14"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
function hl(name){
  if(!st.q) return esc(name);
  const i=low(name).indexOf(st.q);
  if(i<0) return esc(name);
  return esc(name.slice(0,i))+'<mark>'+esc(name.slice(i,i+st.q.length))+'</mark>'+esc(name.slice(i+st.q.length));
}

// Render Stores
function renderStores(){
  const list=stores.filter(s=>{
    const matchFloor=(st.f==='all'||s.fl.includes(st.f));
    const matchCat=(st.c==='all'||s.c.includes(st.c));
    const matchQuery=(!st.q||low(s.n).includes(st.q)||s.c.some(c=>low(c).includes(st.q)));
    return matchFloor && matchCat && matchQuery;
  });

  const clearBtn=$('#clearBtn');
  const isFiltered=(st.f!=='all'||st.c!=='all'||st.q);
  if(clearBtn) clearBtn.hidden=!isFiltered;

  const resText=$('#resText');
  if(resText){
    const floorLabel=FLOOR_DATA[st.f]?FLOOR_DATA[st.f].title:'Tüm Katlar';
    resText.innerHTML=`<b>${list.length}</b> mağaza bulundu · ${floorLabel}${st.c!=='all'?' · '+esc(st.c):''}`;
  }

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
          <span class="sc-hours">10:00 - 22:00</span>
          <button class="btn btn-outline btn-sm sc-btn" type="button" data-open-store="${esc(s.n)}">Detay &amp; Konum <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></button>
        </div>
      </article>
    `).join(''):`
      <div class="empty" style="grid-column:1/-1">
        <p>${st.q?'“'+esc(st.q)+'” ile eşleşen mağaza bulunamadı':'Seçilen filtrelerle eşleşen mağaza bulunamadı'}</p>
        <button class="btn btn-dark" type="button" id="emptyClear">Filtreleri Temizle</button>
      </div>
    `;
  }

  const moreBtn=$('#moreBtn');
  const rest=list.length-show.length;
  if(moreBtn){
    moreBtn.hidden=rest<=0;
    moreBtn.textContent=`Daha fazla mağaza göster (${rest})`;
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

// Category Pills Listener
if(pillsEl){
  pillsEl.addEventListener('click',e=>{
    const b=e.target.closest('.pill');
    if(!b) return;
    st.c=b.dataset.c;
    document.querySelectorAll('#pills .pill').forEach(p=>p.setAttribute('aria-pressed',p.dataset.c===st.c));
    st.lim=12;
    renderStores();
  });
}

// Search Input
const qInput=$('#q');
if(qInput){
  qInput.addEventListener('input',e=>{
    st.q=low(e.target.value.trim());
    st.lim=12;
    renderStores();
  });
}

// Clear Button
const clearBtn=$('#clearBtn');
if(clearBtn){
  clearBtn.addEventListener('click',()=>{
    if(qInput) qInput.value='';
    st.q='';
    st.c='all';
    st.f='all';
    st.lim=12;
    document.querySelectorAll('.tower-card').forEach(c=>c.classList.remove('on'));
    const allBtn=$('.tower-all-btn');
    if(allBtn) allBtn.classList.add('on');
    document.querySelectorAll('#pills .pill').forEach(p=>p.setAttribute('aria-pressed',p.dataset.c==='all'));
    updateStageBanner('all');
    renderStores();
  });
}

// More Button
const moreBtn=$('#moreBtn');
if(moreBtn){
  moreBtn.addEventListener('click',()=>{
    st.lim+=12;
    renderStores();
  });
}

// Keyboard shortcut (Ctrl+K)
document.addEventListener('keydown',e=>{
  const isK=(e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey);
  const slash=e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if(isK||slash){
    e.preventDefault();
    $('#rehber').scrollIntoView({behavior:KF.reduce?'auto':'smooth'});
    setTimeout(()=>{if(qInput)qInput.focus({preventScroll:true})},450);
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
  $('#smLoc').textContent=`${KF.floorLabel(store)} (Ana koridor üzerinde)`;
  $('#smDesc').textContent=store.d||`${store.n}, en güncel koleksiyonları ve kaliteli hizmet anlayışıyla Koru Florya'da sizleri bekliyor.`;
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
    if(clearBtn) clearBtn.click();
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
   4. DİNAMİK ULAŞIM TERMİNALİ & YERİ KAYMAYAN HARİTA
   ======================================================== */
let mapInstance=null;
let activeRouteLayers=[];

// Fixed Pin Factory: Anchor point [18, 38] is the absolute bottom tip of the pin!
// The label is positioned above the pin with NO vertical transform, preventing any zoom drift!
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
const ROUTES={
  'shuttle':{
    color:'#00AB84',
    leg:'Marmaray Florya İstasyonu ↔ Koru Florya (Ücretsiz Ring Servis)',
    path:[
      [40.9728979, 28.7876092],
      [40.9745, 28.7865],
      [40.9780, 28.7845],
      [40.9820, 28.7838],
      [40.9842677, 28.7834510]
    ],
    markers:[
      {pos:[40.9728979, 28.7876092],title:'Marmaray Florya',color:'#00AB84',icon:TRAIN_ICON_SVG},
      {pos:[40.9842677, 28.7834510],title:'Koru Florya AVM',color:'#E53935',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9728979, 28.7876092], [40.9842677, 28.7834510]]
  },
  'metro':{
    color:'#FF7F41',
    leg:'Cennet Metrobüs Durağı ↔ Koru Florya Yürüyüş Yolu (350 m · 2 dk)',
    path:[
      [40.9882, 28.7855],
      [40.9868, 28.7846],
      [40.9850, 28.7838]
    ],
    markers:[
      {pos:[40.9882, 28.7855],title:'Cennet Metrobüs Durağı',color:'#FF7F41',icon:TRAIN_ICON_SVG},
      {pos:[40.9850, 28.7838],title:'Koru Florya Yaya Girişi',color:'#E53935',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9845, 28.7830], [40.9888, 28.7862]]
  },
  'bus':{
    color:'#2563EB',
    leg:'Koru Florya İETT Otobüs Durağı ↔ Ana Giriş Kapısı (60 m · 1 dk)',
    path:[
      [40.9855, 28.7845],
      [40.9848, 28.7839],
      [40.9843, 28.7835]
    ],
    markers:[
      {pos:[40.9855, 28.7845],title:'Koru Florya Durağı (73, 73F, 98)',color:'#2563EB',icon:BUS_ICON_SVG},
      {pos:[40.9843, 28.7835],title:'Koru Florya Ana Giriş',color:'#E53935',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9838, 28.7828], [40.9860, 28.7852]]
  },
  'car':{
    color:'#1C1F1D',
    leg:'Ekşinar Sokak ↔ 1.200 Araçlık Kapalı Otopark & Vale Girişi',
    path:[
      [40.9825, 28.7818],
      [40.9836, 28.7828],
      [40.9842, 28.7834]
    ],
    markers:[
      {pos:[40.9836, 28.7828],title:'P Kapalı Otopark Girişi',color:'#1C1F1D',icon:CAR_ICON_SVG},
      {pos:[40.9842, 28.7834],title:'Koru Florya Vale Noktası',color:'#E53935',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9820, 28.7812], [40.9848, 28.7842]]
  }
};

function switchTransitRoute(routeKey){
  if(!mapInstance) return;
  const cfg=ROUTES[routeKey]||ROUTES['shuttle'];

  // Clear previous layers
  activeRouteLayers.forEach(l=>mapInstance.removeLayer(l));
  activeRouteLayers=[];

  // Draw polyline
  const poly=L.polyline(cfg.path, {
    color: cfg.color,
    weight: 4.5,
    dashArray: '6, 8',
    opacity: 0.95
  }).addTo(mapInstance);
  activeRouteLayers.push(poly);

  // Add markers
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

// Leaflet Map Init with Free OpenStreetMap Tiles
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

  // Standard OpenStreetMap tiles: free, reliable, no watermark
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
