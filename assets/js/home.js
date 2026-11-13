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
  {img:IMG.cafe,alt:'Akşam ışığında kafe'},
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
    <li><a href="${KF.storeUrl(s)}" aria-label="${esc(s.n)}"><img src="assets/brands/${s.l}" alt="${esc(s.n)}" loading="lazy" decoding="async" /></a></li>
  `).join('');
}

/* ========================================================
   2. ARCHITECTURAL FLOOR & BRAND EXPLORER (MULTI-CATEGORY)
   ======================================================== */
const FLOOR_DATA={
  'all':{
    id:'all',title:'Tüm katlarda 177 mağaza',badge:'Koru Florya katları',
    desc:'Dört katta mağazalar, yeme içme durakları ve hizmetler. Bir kat seç, kategoriye göre süz.',
    count:177
  },
  'C':{
    id:'C',title:'Cadde Katı (2. Kat)',badge:'Restoranlar & Teknoloji',
    desc:'Restoranlar, kafeler ve teknoloji markaları.',
    count:KF.stores.filter(s=>s.fl.includes('C')).length
  },
  'P':{
    id:'P',title:'Podyum Katı (1. Kat)',badge:'Moda & Giyim',
    desc:'Moda ve giyim katı; kadın, erkek ve aksesuar markaları.',
    count:KF.stores.filter(s=>s.fl.includes('P')).length
  },
  'K':{
    id:'K',title:'Koru Katı (Giriş Kat)',badge:'Giriş',
    desc:'Ana giriş, danışma, bankalar ve hızlı erişimli mağazalar.',
    count:KF.stores.filter(s=>s.fl.includes('K')).length
  },
  'O':{
    id:'O',title:'Otopark Katı (-1. Kat)',badge:'Hizmetler & Otopark',
    desc:'Otopark katı. Kuru temizleme, terzi, kuaför ve tatil danışmanlığı hizmetleri.',
    count:KF.stores.filter(s=>s.fl.includes('O')).length
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
const PIN_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="14" height="14"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
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
          <span class="sc-hours">AVM 10:00 – 22:00</span>
          <button class="sc-btn" type="button" data-open-store="${esc(s.n)}">Detay &amp; Konum <svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></button>
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

// Quick-pick suggestion & hero search focus
document.addEventListener('click',e=>{
  const sug=e.target.closest('.empty-chip');
  if(sug){
    const val=sug.dataset.suggest||'';
    st.f='all';st.cats.clear();st.q=val;st.lim=12;
    const qEl=$('#q'); if(qEl) qEl.value=val;
    document.querySelectorAll('.tower-card,.tower-all-btn').forEach(c=>c.classList.toggle('on',c.dataset.f==='all'));
    document.querySelectorAll('.stage-pills .pill').forEach(p=>p.classList.toggle('on',p.dataset.c==='all'));
    updateStageBanner('all');
    renderStores();
    return;
  }
  if(e.target.closest('#heroSearchBtn')){
    setTimeout(()=>{const qEl=$('#q'); if(qEl) qEl.focus({preventScroll:true});},420);
  }
});

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
  const smPage=$('#smPage');if(smPage)smPage.href=KF.storeUrl(store);
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
const TRAIN_ICON_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/></svg>';
const BUS_ICON_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 12h16M8 21l-1-4M16 21l1-4"/></svg>';
const CAR_ICON_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>';

// Route Configurations
// Route lines follow real roads and footpaths (OpenStreetMap routing, computed offline). Stop positions are approximate.
const ROUTES={
  'shuttle':{
    color:'#00B995',
    leg:'Marmaray Florya İstasyonu ↔ Koru Florya arka giriş',
    key:[['drive','Araç / servis yolu · ~1,9 km'],['walk','Yürüyüş yolu · ~2,0 km (~27 dk)']],
    path:[
      [40.97309, 28.787719],
      [40.973149, 28.787539],
      [40.973177, 28.787446],
      [40.973214, 28.78725],
      [40.973586, 28.786117],
      [40.973795, 28.785492],
      [40.974175, 28.784362],
      [40.974356, 28.783599],
      [40.974524, 28.783053],
      [40.974675, 28.782665],
      [40.974762, 28.782527],
      [40.974808, 28.782466],
      [40.974829, 28.782443],
      [40.974857, 28.782417],
      [40.974879, 28.782413],
      [40.974898, 28.782399],
      [40.974913, 28.782377],
      [40.975153, 28.782255],
      [40.975189, 28.782219],
      [40.975342, 28.782154],
      [40.975399, 28.782138],
      [40.975467, 28.782144],
      [40.975571, 28.782182],
      [40.975917, 28.782364],
      [40.975985, 28.782395],
      [40.976048, 28.782401],
      [40.976125, 28.782386],
      [40.976231, 28.782339],
      [40.97636, 28.782262],
      [40.976777, 28.782001],
      [40.977137, 28.78177],
      [40.977359, 28.781639],
      [40.977399, 28.781621],
      [40.977433, 28.781613],
      [40.977463, 28.781618],
      [40.977494, 28.781635],
      [40.977555, 28.781679],
      [40.977861, 28.781888],
      [40.978202, 28.78211],
      [40.978094, 28.781855],
      [40.978002, 28.78158],
      [40.977891, 28.781312],
      [40.977853, 28.780999],
      [40.978003, 28.780946],
      [40.978121, 28.78089],
      [40.978328, 28.780885],
      [40.979392, 28.780608],
      [40.979558, 28.78056],
      [40.979631, 28.780539],
      [40.980372, 28.780364],
      [40.980766, 28.780267],
      [40.981525, 28.780071],
      [40.981563, 28.78051],
      [40.981576, 28.780678],
      [40.981645, 28.780673],
      [40.981713, 28.78069],
      [40.981779, 28.780721],
      [40.982376, 28.78116],
      [40.982965, 28.781552],
      [40.98306, 28.781603],
      [40.983156, 28.781653],
      [40.98309, 28.781784],
      [40.983011, 28.781942],
      [40.982994, 28.781973],
      [40.983067, 28.782292],
      [40.983116, 28.782503],
      [40.983164, 28.782717],
      [40.983472, 28.784071],
      [40.983505, 28.784199]
    ],
    walk:[
      [40.9729, 28.78761],
      [40.972921, 28.787547],
      [40.972939, 28.787493],
      [40.97307, 28.787567],
      [40.973059, 28.7876],
      [40.972998, 28.787785],
      [40.972976, 28.787837],
      [40.972991, 28.787899],
      [40.973025, 28.787918],
      [40.972981, 28.788059],
      [40.972979, 28.788239],
      [40.972987, 28.78838],
      [40.972999, 28.788519],
      [40.973057, 28.788731],
      [40.973107, 28.788857],
      [40.973193, 28.789022],
      [40.973293, 28.789214],
      [40.973301, 28.789227],
      [40.973528, 28.789563],
      [40.973696, 28.789684],
      [40.974081, 28.789896],
      [40.974947, 28.790354],
      [40.975644, 28.790703],
      [40.975679, 28.790719],
      [40.975689, 28.790519],
      [40.975725, 28.790512],
      [40.975849, 28.790137],
      [40.977023, 28.790853],
      [40.977457, 28.791176],
      [40.977514, 28.791198],
      [40.977563, 28.791179],
      [40.977594, 28.791137],
      [40.978062, 28.789963],
      [40.978092, 28.789893],
      [40.978716, 28.788335],
      [40.978756, 28.788235],
      [40.979238, 28.787047],
      [40.97925, 28.787017],
      [40.979704, 28.785794],
      [40.979783, 28.785599],
      [40.979936, 28.78522],
      [40.980191, 28.785231],
      [40.980306, 28.785216],
      [40.980421, 28.78514],
      [40.980669, 28.784444],
      [40.980887, 28.78393],
      [40.980946, 28.783767],
      [40.981026, 28.783654],
      [40.98115, 28.7836],
      [40.981264, 28.783511],
      [40.981444, 28.783402],
      [40.981549, 28.783303],
      [40.981635, 28.783147],
      [40.981723, 28.782939],
      [40.981793, 28.782777],
      [40.981839, 28.782602],
      [40.981894, 28.782484],
      [40.981943, 28.78235],
      [40.982001, 28.782238],
      [40.982179, 28.782143],
      [40.98228, 28.782041],
      [40.982392, 28.781951],
      [40.982494, 28.781934],
      [40.982601, 28.781871],
      [40.982687, 28.781859],
      [40.982772, 28.781843],
      [40.982837, 28.781833],
      [40.98296, 28.781697],
      [40.983004, 28.78166],
      [40.983042, 28.781658],
      [40.983054, 28.78174],
      [40.98309, 28.781784],
      [40.98315, 28.781832],
      [40.983088, 28.78198],
      [40.983078, 28.782021],
      [40.983076, 28.782077],
      [40.983092, 28.782135],
      [40.983129, 28.782267],
      [40.983067, 28.782292],
      [40.983116, 28.782503],
      [40.983164, 28.782717],
      [40.983472, 28.784071],
      [40.983505, 28.784199]
    ],
    gm:'https://www.google.com/maps/dir/?api=1&origin=40.972898,28.787609&destination=40.9836,28.7841&travelmode=walking',
    markers:[
      {pos:[40.972898, 28.787609],title:'Marmaray Florya İstasyonu',color:'#00B995',icon:TRAIN_ICON_SVG},
      {pos:[40.9836, 28.7841],title:'Arka giriş (yaklaşık konum)',color:'#102B24',icon:MALL_ICON_SVG},
      {pos:[40.984926, 28.783356],title:'Ana giriş (yaklaşık konum)',color:'#2B423A',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9720, 28.7800], [40.9855, 28.7885]]
  },
  'metro':{
    color:'#102B24',
    leg:'Metrobüs durağı (yaklaşık konum) ↔ Koru Florya',
    key:[['walk','Yürüyüş yolu · ~330 m']],
    path:[
      [40.985607, 28.783188],
      [40.985588, 28.783032],
      [40.985548, 28.782445],
      [40.985533, 28.782025],
      [40.985619, 28.781901],
      [40.985606, 28.781947],
      [40.985589, 28.781886],
      [40.985334, 28.782091],
      [40.984898, 28.78244],
      [40.9849, 28.782812],
      [40.984892, 28.782866],
      [40.984926, 28.782887],
      [40.985015, 28.782853],
      [40.985121, 28.782782],
      [40.985125, 28.782842],
      [40.985052, 28.782902],
      [40.985027, 28.782918],
      [40.984998, 28.782945],
      [40.984969, 28.782974],
      [40.984951, 28.782993],
      [40.984945, 28.783032],
      [40.984941, 28.783084],
      [40.984938, 28.783139],
      [40.984931, 28.783253],
      [40.984926, 28.783356],
      [40.984926, 28.783356]
    ],
    gm:'https://www.google.com/maps/dir/?api=1&origin=40.985390,28.783233&destination=40.984268,28.783451&travelmode=walking',
    markers:[
      {pos:[40.985390, 28.783233],title:'Metrobüs durağı (yaklaşık konum)',color:'#102B24',icon:TRAIN_ICON_SVG},
      {pos:[40.984268, 28.783451],title:'Koru Florya',color:'#00B995',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9838, 28.7824], [40.9858, 28.7842]]
  },
  'bus':{
    color:'#2B423A',
    leg:'Otobüs durağı (73, 73F, 98, yaklaşık konum) ↔ Ana giriş',
    key:[['walk','Yürüyüş yolu · ~90 m']],
    path:[
      [40.985158, 28.783283],
      [40.985139, 28.78307],
      [40.985125, 28.782842],
      [40.985052, 28.782902],
      [40.985027, 28.782918],
      [40.984998, 28.782945],
      [40.984969, 28.782974],
      [40.984951, 28.782993],
      [40.984945, 28.783032],
      [40.984941, 28.783084],
      [40.984938, 28.783139],
      [40.984931, 28.783253],
      [40.984926, 28.783356],
      [40.984926, 28.783356]
    ],
    gm:'https://www.google.com/maps/dir/?api=1&origin=40.985050,28.783300&destination=40.984268,28.783451&travelmode=walking',
    markers:[
      {pos:[40.985050, 28.783300],title:'Otobüs durağı (yaklaşık konum)',color:'#2B423A',icon:BUS_ICON_SVG},
      {pos:[40.984268, 28.783451],title:'Koru Florya',color:'#00B995',icon:MALL_ICON_SVG}
    ],
    bounds:[[40.9840, 28.7828], [40.9854, 28.7840]]
  },
  'car':{
    color:'#102B24',
    leg:'Koru Florya · Otopark Katı (-1)',
    key:[['drive','Araçla yol tarifi için Google Maps düğmesini kullanın']],
    path:[],
    gm:'https://www.google.com/maps/dir/?api=1&destination=40.984268,28.783451&travelmode=driving',
    markers:[
      {pos:[40.984268, 28.783451],title:'Koru Florya · Otopark Katı (-1)',color:'#00B995',icon:CAR_ICON_SVG}
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

  const draw=(pts,dash)=>{
    if(!pts||pts.length<2) return;
    activeRouteLayers.push(L.polyline(pts,{color:'#FFFFFF',weight:7,opacity:0.8}).addTo(mapInstance));
    activeRouteLayers.push(L.polyline(pts,{color:cfg.color,weight:4.5,dashArray:dash,opacity:0.98}).addTo(mapInstance));
  };
  if(cfg.walk){ draw(cfg.walk,'6, 8'); draw(cfg.path,null); } else { draw(cfg.path,'6, 8'); }
  const gm=$('#routeGmaps'); if(gm) gm.href=cfg.gm;

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
  const legKey=$('#mapKey');
  if(legKey) legKey.innerHTML=(cfg.key||[]).map(k=>`<span class="mk mk-${k[0]}"><i></i>${esc(k[1])}</span>`).join('');
}

// Upcoming events strip
(function(){
  const box=$('#homeEvents'),sec=$('#etkinlikSeridi');
  if(!box||!KF.cardHtml||!KF.TABS) return;
  const list=KF.sortEv(KF.TABS[0][2]()).slice(0,3);
  if(!list.length){ if(sec) sec.hidden=true; return; }
  box.innerHTML=list.map(KF.cardHtml).join('');
})();

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

// Deep linking: ?kategori=Teknoloji selects the category pill
const wantCat=new URLSearchParams(location.search).get('kategori');
if(wantCat){const pill=[...document.querySelectorAll('#pills .pill')].find(p=>p.dataset.c===wantCat);if(pill){pill.click();setTimeout(()=>{const r=$('#rehber');if(r)r.scrollIntoView()},300)}}
const want=new URLSearchParams(location.search).get('magaza');
if(want&&byName[want]){
  setTimeout(()=>{
    openStoreModal(want);
  },400);
}
})();
