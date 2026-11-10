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
   2. ARCHITECTURAL FLOOR & BRAND EXPERIENCE
   ======================================================== */
const FLOOR_DATA={
  'all':{
    id:'all',title:'Tüm Katlarda 177 Marka',badge:'Koru Florya Katları',
    desc:'Geniş açık terasları, ferah botanik atriyumu ve dünya markalarıyla alışverişin en keyifli hali.',
    tags:['Açık Bahçe Terasları','177 Butik & Mağaza','29 Gurme Restoran']
  },
  'C':{
    id:'C',title:'Cadde Katı (2. Kat)',badge:'Açık Teras & Restoranlar',
    desc:'Geniş bahçe terasları, dünya mutfaklarından seçkin restoranlar, bistrolar ve açık hava ferahlığı.',
    tags:['34 Restoran & Mağaza','Happy Moon\'s · Divan Pub','Açık Bahçe Terasları']
  },
  'P':{
    id:'P',title:'Podyum Katı (1. Kat)',badge:'Moda & Kozmetik',
    desc:'Dünyaca ünlü hazır giyim markaları, tasarım butikleri, kozmetik ve mücevher mağazaları.',
    tags:['48 Seçkin Marka','Zara · Mango · Sephora','Moda & Mücevher']
  },
  'K':{
    id:'K',title:'Koru Katı (Giriş Kat)',badge:'Ana Atriyum & Kafe',
    desc:'Yüksek cam tavanlı botanik atriyum, artisan kahve noktaları, hızlı lezzetler ve teknoloji.',
    tags:['56 Mağaza & Kafe','Shake Shack · Starbucks','Buluşma Noktası']
  },
  'O':{
    id:'O',title:'Otopark Katı (-1. Kat)',badge:'Hizmetler & Otopark',
    desc:'1.200 araçlık kapalı otopark, oto yıkama & vale, terzi, kuru temizleme ve günlük hizmetler.',
    tags:['39 Hizmet & Mağaza','MediaMarkt · Migros','Vale & Hızlı Hizmet']
  }
};

const st={f:'all',c:'all',q:'',lim:12};

// Render Category Pills
const pillsEl=$('#pills');
if(pillsEl){
  pillsEl.innerHTML=`<button class="pill" type="button" data-c="all" aria-pressed="true">Tümü</button>`+
    CATS.slice(0,8).map(c=>`<button class="pill" type="button" data-c="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');
}

// Update Floor Hero Highlight Banner
function updateFloorHero(fKey){
  const d=FLOOR_DATA[fKey]||FLOOR_DATA['all'];
  if($('#fhBadge')) $('#fhBadge').textContent=d.badge;
  if($('#fhTitle')) $('#fhTitle').textContent=d.title;
  if($('#fhDesc')) $('#fhDesc').textContent=d.desc;
  if($('#fhTags')) $('#fhTags').innerHTML=d.tags.map(t=>`<span class="fh-tag">${esc(t)}</span>`).join('');
}

// Search Highlight
const PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="15" height="15"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
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
          <p class="sc-floor">${PIN} ${esc(KF.floorLabel(s))}</p>
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
    moreBtn.textContent=`Daha fazla göster (${rest} mağaza)`;
  }
}

// Floor Card Click
const floorStrip=$('#floorStrip');
if(floorStrip){
  floorStrip.addEventListener('click',e=>{
    const b=e.target.closest('.f-card');
    if(!b) return;
    st.f=b.dataset.f;
    document.querySelectorAll('.f-card').forEach(c=>c.classList.toggle('on',c===b));
    updateFloorHero(st.f);
    st.lim=12;
    renderStores();
  });
}

// Category Pill Click
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
    document.querySelectorAll('.f-card').forEach(c=>c.classList.toggle('on',c.dataset.f==='all'));
    document.querySelectorAll('#pills .pill').forEach(p=>p.setAttribute('aria-pressed',p.dataset.c==='all'));
    updateFloorHero('all');
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

// Keyboard shortcuts (Ctrl+K)
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

// Delegate store clicks
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
updateFloorHero('all');
renderStores();

/* ========================================================
   4. KORU FLORYA'DA NELER OLUYOR (3'LÜ EDITORIAL SHOWCASE)
   ======================================================== */
(function(){
  const culBox=$('#cul');
  if(!culBox) return;

  const EDITORIAL_EVENTS=[
    {
      id:'kitap-fuari',
      title:'Kitap Fuarı KoruFlorya’da',
      date:'4 - 22 KASIM',
      cat:'Kültür & Sanat',
      venue:'Koru Katı · Ana Atriyum',
      desc:'Türkiye’nin önde gelen yayınevleri, binlerce seçkin eser ve ünlü yazarların katılımıyla kitap şöleni.',
      img:'https://images.unsplash.com/photo-1566131807516-e3b3cd1a89d1?auto=format&fit=crop&q=80&w=900'
    },
    {
      id:'celal-sengor-imza-gunu',
      title:'Celal Şengör İmza Günü & Söyleşi',
      date:'15 KASIM · 14:00',
      cat:'Söyleşi & İmza',
      venue:'D&R Etkinlik Alanı · Koru Katı',
      desc:'Prof. Dr. Celal Şengör yeni kitabının tanıtımı ve imza gününde Koru Florya kitapseverleriyle buluşuyor.',
      img:'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=900'
    },
    {
      id:'koru-akustik-caz',
      title:'Koru Akustik Sahne: Jazz & Coffee',
      date:'20 KASIM · 19:30',
      cat:'Müzik & Sahne',
      venue:'Podyum Katı · Açık Teras',
      desc:'Sonbahar esintisinde sıcak artisan kahveler eşliğinde canlı akustik caz triosu ile keyifli bir akşam.',
      img:'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=900'
    }
  ];

  culBox.innerHTML=EDITORIAL_EVENTS.map(ev=>`
    <article class="ev-card">
      <div class="ev-img">
        <img src="${ev.img}" alt="${esc(ev.title)}" loading="lazy" width="900" height="600" />
        <span class="ev-date-pill">${esc(ev.date)}</span>
        <span class="ev-cat-pill">${esc(ev.cat)}</span>
      </div>
      <div class="ev-body">
        <div class="ev-venue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg> ${esc(ev.venue)}</div>
        <h3 class="ev-title">${esc(ev.title)}</h3>
        <p class="ev-desc">${esc(ev.desc)}</p>
        <a class="btn btn-outline btn-sm ev-btn" href="etkinlik.html?e=${ev.id}">Etkinliği İncele <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>
      </div>
    </article>
  `).join('');
})();

/* ========================================================
   5. NASIL GELİRİM: HARİTA & ULAŞIM TERMİNALİ
   ======================================================== */
// Shuttle Timetable & Direction Logic
let sdir='MF';
function updateShuttle(){
  const now=KF.nowSecs();
  const nx=KF.nextShuttle(sdir,now);
  const shBadge=$('#shBadge');
  const shDot=$('#shDot');
  if(shBadge){
    shBadge.textContent=nx?`Sıradaki servis ${nx.t} · Kalkışa ${nx.min} dk kaldı`:`Bugünkü seferler bitti · Yarın ilk sefer ${KF.SHUTTLE[sdir][0]}`;
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

// Direction switcher
document.querySelectorAll('.sw button').forEach(b=>b.addEventListener('click',()=>{
  sdir=b.dataset.d;
  document.querySelectorAll('.sw button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  updateShuttle();
}));

// Transit Tabs
const transitTabs=document.querySelectorAll('.t-tab');
transitTabs.forEach(tab=>{
  tab.addEventListener('click',()=>{
    transitTabs.forEach(t=>t.classList.remove('on'));
    tab.classList.add('on');
    const targetId='tp-'+tab.dataset.tab;
    document.querySelectorAll('.t-pane').forEach(p=>p.classList.toggle('on',p.id===targetId));
  });
});

document.addEventListener('kf:tick',updateShuttle);
updateShuttle();

// Leaflet Map with OpenStreetMap Standard Tiles (NO API KEY REQUIRED!)
function initLeafletMap(){
  const canvas=$('#mapCanvas');
  if(!canvas || !window.L) return;
  canvas.innerHTML='';

  const {mall, station}=KF.COORD;
  const centerLat=(mall.lat+station.lat)/2;
  const centerLon=(mall.lon+station.lon)/2;

  const map = L.map('mapCanvas', {
    center: [centerLat, centerLon],
    zoom: 15,
    scrollWheelZoom: true,
    zoomControl: true
  });

  // OpenStreetMap standard tile server: 100% free, reliable, no API key needed
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Marmaray - Koru Florya Kesikli Rota Çizgisi
  L.polyline([[station.lat, station.lon], [mall.lat, mall.lon]], {
    color: '#00AB84',
    weight: 4,
    dashArray: '6, 8',
    opacity: 0.9
  }).addTo(map);

  // Koru Florya Özel Pin İkonu
  const mallIcon = L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="custom-pin"><span class="custom-pin-bubble">Koru Florya</span><span class="custom-pin-icon ml"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 20 15h-5l5 6H4l5-6H4z"/></svg></span></div>`,
    iconSize: [44, 64],
    iconAnchor: [22, 64]
  });
  L.marker([mall.lat, mall.lon], {icon: mallIcon}).addTo(map).bindPopup('<b>Koru Florya AVM</b><br>Her gün 10:00 - 22:00');

  // Marmaray Florya İstasyonu Özel Pin İkonu
  const stationIcon = L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="custom-pin"><span class="custom-pin-bubble">Marmaray Florya</span><span class="custom-pin-icon st"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/></svg></span></div>`,
    iconSize: [44, 64],
    iconAnchor: [22, 64]
  });
  L.marker([station.lat, station.lon], {icon: stationIcon}).addTo(map).bindPopup('<b>Marmaray Florya İstasyonu</b><br>Ücretsiz servis kalkış noktası');

  const R=6371,dLat=(mall.lat-station.lat)*Math.PI/180,dLon=(mall.lon-station.lon)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(station.lat*Math.PI/180)*Math.cos(mall.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  const km=(2*R*Math.asin(Math.sqrt(a))).toFixed(1).replace('.',',');
  const leg=$('#mapLeg');
  if(leg) leg.innerHTML=`<span class="dot" style="animation:none;background:#00AB84"></span>Marmaray istasyonundan ${km} km · 18-20 dk koru yürüyüşü`;
}

if(window.L){
  initLeafletMap();
} else {
  window.addEventListener('load',initLeafletMap);
}

// Deep linking support: index.html?magaza=Zara
const want=new URLSearchParams(location.search).get('magaza');
if(want&&byName[want]){
  setTimeout(()=>{
    openStoreModal(want);
  },400);
}
})();
