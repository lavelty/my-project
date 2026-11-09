/* Home page */
(function(){
const {esc,low,pad,FL,FORDER,CATS,stores,byName,ist}=KF;
const $=s=>document.querySelector(s);
const U=(p,w)=>`https://images.unsplash.com${p}?auto=format&fit=crop&q=75&w=${w}`;
const IMG={
  atrium:'/photo-1772760224872-db7c8f49404a',fashion:'/photo-1483985988355-763728e1935b',cafe:'/photo-1764489307253-da5c9c311fa2',
  barista:'/photo-1604552914267-90a8d81a4254',food:'/photo-1600891964599-f61ba0e24092',food2:'/photo-1755811248324-c70c1f10a7fd',trees:'/photo-1757585920915-c5a388d16e44'
};
const ARR=KF.IC.arr;

/* hero */
const FOODN=stores.filter(s=>s.c.includes('Yeme & İçme')).length;
if($('#heroSub')) $('#heroSub').textContent=`${stores.length} mağaza, ${FOODN} yeme içme durağı ve ücretsiz Marmaray servisi. Her gün 10:00 ile 22:00 arası açığız.`;
if($('#foodLead')) $('#foodLead').textContent=`Sabah kahvesinden akşam yemeğine ${FOODN} durak, çoğu giriş kat olan Koru Katı'nda`;

const SLIDES=[{img:IMG.atrium,alt:'Koru Florya iç mekânı'},{img:IMG.fashion,alt:'Alışveriş poşetleriyle bir kadın'},{img:IMG.cafe,alt:'Akşam ışığında kafe'},{img:IMG.trees,alt:'Florya korusundan ağaçlar'}];
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

/* brand strip */
const BRANDS=['Zara','Mango','Beymen Club','Starbucks','LEGO Store','Pandora','MediaMarkt','Shake Shack','Lacoste','Swarovski','Boyner','Puma',"Levi's",'Samsung'];
const brandList=$('#brandList');
if(brandList){
  brandList.innerHTML=BRANDS.map(n=>byName[n]).filter(s=>s&&s.l).map(s=>`<li><img src="assets/brands/${s.l}" alt="${esc(s.n)}" loading="lazy" decoding="async" /></li>`).join('');
}

/* ========================================================
   KANYON STYLE ARCHITECTURAL 2D FLOOR PLAN
   ======================================================== */
const st={f:'K',c:'all',q:'',sel:null,lim:20}; // default to K (Koru Katı - Giriş)
const FLOOR_KEYS=['C','P','K','O'];
const FLOOR_DEFS={
  'C':{id:'C',num:'2',title:'Cadde Katı',sub:'2. Kat'},
  'P':{id:'P',num:'1',title:'Podyum Katı',sub:'1. Kat'},
  'K':{id:'K',num:'0',title:'Koru Katı',sub:'Giriş'},
  'O':{id:'O',num:'-1',title:'Otopark',sub:'-1. Kat'}
};

// Floor shops layout definitions (Kanyon curved architectural geometry)
const FLOOR_PLANS={
  'C':[ // Cadde Katı (2. Kat): Lüks & Açık Teras & Restoranlar
    {id:'Happy Moon\'s',p:'140,240 250,220 280,310 160,330',tx:210,ty:275,lbl:'Happy Moon\'s'},
    {id:'Vakko',p:'260,215 370,195 385,285 285,305',tx:325,ty:250,lbl:'Vakko'},
    {id:'Beymen Club',p:'380,190 490,175 495,265 395,280',tx:440,ty:230,lbl:'Beymen Club'},
    {id:'Boyner',p:'505,175 615,190 605,280 505,265',tx:560,ty:230,lbl:'Boyner'},
    {id:'ADL',p:'625,195 735,215 710,305 615,285',tx:675,ty:250,lbl:'ADL'},
    {id:'Asuman',p:'745,220 855,240 835,330 720,310',tx:790,ty:275,lbl:'Asuman'},
    {id:'Network',p:'130,120 230,105 245,190 140,205',tx:185,ty:155,lbl:'Network'},
    {id:'Barbour',p:'240,100 340,90 350,175 250,185',tx:295,ty:140,lbl:'Barbour'},
    {id:'Divan Pub',p:'350,85 450,80 450,165 360,170',tx:400,ty:125,lbl:'Divan Pub'},
    {id:'Quick China',p:'550,80 650,85 640,170 550,165',tx:600,ty:125,lbl:'Quick China'},
    {id:'Atasay',p:'660,90 760,100 750,185 650,175',tx:705,ty:140,lbl:'Atasay'},
    {id:'Yargıcı',p:'770,105 870,120 860,205 760,190',tx:815,ty:155,lbl:'Yargıcı'}
  ],
  'P':[ // Podyum Katı (1. Kat): Kozmetik, Saat, Moda
    {id:'Zara',p:'140,240 250,220 280,310 160,330',tx:210,ty:275,lbl:'Zara'},
    {id:'Mango',p:'260,215 370,195 385,285 285,305',tx:325,ty:250,lbl:'Mango'},
    {id:'Sephora',p:'380,190 490,175 495,265 395,280',tx:440,ty:230,lbl:'Sephora'},
    {id:'Massimo Dutti',p:'505,175 615,190 605,280 505,265',tx:560,ty:230,lbl:'Massimo Dutti'},
    {id:'Altınbaş',p:'625,195 735,215 710,305 615,285',tx:675,ty:250,lbl:'Altınbaş'},
    {id:'Bershka',p:'745,220 855,240 835,330 720,310',tx:790,ty:275,lbl:'Bershka'},
    {id:'Stradivarius',p:'130,120 230,105 245,190 140,205',tx:185,ty:155,lbl:'Stradivarius'},
    {id:'Pull&Bear',p:'240,100 340,90 350,175 250,185',tx:295,ty:140,lbl:'Pull&Bear'},
    {id:'Swarovski',p:'350,85 450,80 450,165 360,170',tx:400,ty:125,lbl:'Swarovski'},
    {id:'Pandora',p:'550,80 650,85 640,170 550,165',tx:600,ty:125,lbl:'Pandora'},
    {id:'AJA',p:'660,90 760,100 750,185 650,175',tx:705,ty:140,lbl:'AJA'},
    {id:'Alix Avien',p:'770,105 870,120 860,205 760,190',tx:815,ty:155,lbl:'Alix Avien'}
  ],
  'K':[ // Koru Katı (Giriş): Yeme-İçme, Teknoloji, Koru Bahçe
    {id:'Shake Shack',p:'140,240 250,220 280,310 160,330',tx:210,ty:275,lbl:'Shake Shack'},
    {id:'Starbucks',p:'260,215 370,195 385,285 285,305',tx:325,ty:250,lbl:'Starbucks'},
    {id:'LEGO Store',p:'380,190 490,175 495,265 395,280',tx:440,ty:230,lbl:'LEGO Store'},
    {id:'Samsung',p:'505,175 615,190 605,280 505,265',tx:560,ty:230,lbl:'Samsung'},
    {id:'MediaMarkt',p:'625,195 735,215 710,305 615,285',tx:675,ty:250,lbl:'MediaMarkt'},
    {id:'Bang & Olufsen',p:'745,220 855,240 835,330 720,310',tx:790,ty:275,lbl:'B&O'},
    {id:'Tchibo',p:'130,120 230,105 245,190 140,205',tx:185,ty:155,lbl:'Tchibo'},
    {id:'Espressolab',p:'240,100 340,90 350,175 250,185',tx:295,ty:140,lbl:'Espressolab'},
    {id:'D&R',p:'350,85 450,80 450,165 360,170',tx:400,ty:125,lbl:'D&R'},
    {id:'Lacoste',p:'550,80 650,85 640,170 550,165',tx:600,ty:125,lbl:'Lacoste'},
    {id:'Puma',p:'660,90 760,100 750,185 650,175',tx:705,ty:140,lbl:'Puma'},
    {id:'Kitap Fuarı',p:'770,105 870,120 860,205 760,190',tx:815,ty:155,lbl:'Kitap Fuarı'}
  ],
  'O':[ // Otopark (-1. Kat): Hizmetler, Terzi, Kuru Temizleme
    {id:'Altın İğne Terzi',p:'220,180 360,170 380,270 240,280',tx:300,ty:225,lbl:'Terzi'},
    {id:'Dry Clean Express',p:'380,170 520,165 520,265 390,270',tx:450,ty:220,lbl:'Kuru Temizleme'},
    {id:'Bağdat Döviz',p:'540,165 680,170 670,270 540,265',tx:610,ty:220,lbl:'Bağdat Döviz'},
    {id:'Oto Yıkama & Vale',p:'700,175 840,190 820,290 690,275',tx:760,ty:235,lbl:'Oto Yıkama & Vale'}
  ]
};

// Render Kanyon Floor Buttons (2, 1, 0, -1)
const segEl=$('#seg');
if(segEl){
  segEl.innerHTML=FLOOR_KEYS.map(k=>{
    const d=FLOOR_DEFS[k];
    return `<button type="button" data-f="${k}" aria-pressed="${st.f===k}"><b>${d.num}</b><small>${d.sub}</small></button>`;
  }).join('');
}

// Render Category Pills
const pillsEl=$('#pills');
if(pillsEl){
  pillsEl.innerHTML=`<button class="pill" type="button" data-c="all" aria-pressed="true">Tümü</button>`+
    CATS.slice(0,6).map(c=>`<button class="pill" type="button" data-c="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');
}
const kbdEl=$('#kbd');
if(kbdEl) kbdEl.textContent=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?'⌘ K':'Ctrl K';

// SVG Kat Planı Çizici
const kpSvg=$('#kpSvg');
let zoomLevel=1;

function drawKanyonFloor(floorKey){
  if(!kpSvg) return;
  const shops=FLOOR_PLANS[floorKey]||FLOOR_PLANS['K'];
  const curStore=st.sel?byName[st.sel]:null;

  let h=`<g id="kpMainGroup" style="transform-origin: 500px 260px; transform: scale(${zoomLevel})">`;
  
  // 1. Zemin ve Kavisli Mimari Koridor
  h+=`<path class="kp-atrium" d="M 100,50 L 900,50 L 890,440 L 110,440 Z" rx="20"/>`;
  h+=`<path class="kp-corridor" d="M 120,80 Q 500,50 880,80 L 870,380 Q 500,430 130,380 Z"/>`;
  h+=`<path class="kp-walkway" d="M 240,160 Q 500,140 760,160 Q 750,290 500,290 Q 250,290 240,160 Z"/>`;

  // 2. Ortada Açık Galeri / Atrium Boşluğu (Kanyon oval kavis)
  h+=`<ellipse cx="500" cy="225" rx="140" ry="48" fill="#EDECE8" stroke="#D0CDC4" stroke-width="2"/>`;
  h+=`<text x="500" y="222" font-family="var(--font-h)" font-size="13" font-weight="600" fill="#8E9398" text-anchor="middle">GALERİ BOŞLUĞU</text>`;
  h+=`<text x="500" y="238" font-family="var(--font-b)" font-size="10" fill="#A8ADB2" text-anchor="middle">${FLOOR_DEFS[floorKey].title} · ${FLOOR_DEFS[floorKey].sub}</text>`;

  // 3. Mimari İkonlar (Asansör, Yürüyen Merdiven)
  h+=`<g class="kp-icon" transform="translate(485, 120)"><rect width="30" height="24" rx="4" fill="none" stroke="#8E9398" stroke-width="1.5"/><line x1="492" y1="126" x2="492" y2="138" stroke="#8E9398" stroke-width="1.5"/><line x1="508" y1="126" x2="508" y2="138" stroke="#8E9398" stroke-width="1.5"/></g>`;
  h+=`<g class="kp-escalator"><line x1="360" y1="210" x2="420" y2="240"/><line x1="580" y1="240" x2="640" y2="210"/></g>`;

  // 4. Mağaza Blokları
  shops.forEach(s=>{
    const isSelected = (curStore && curStore.n === s.id);
    const isHighlight = st.q && low(s.id).includes(st.q);
    const cls = `kp-shop${isSelected?' active':(isHighlight?' highlight':'')}`;
    h+=`<polygon class="${cls}" data-name="${esc(s.id)}" points="${s.p}"/>`;
    h+=`<text class="kp-shop-text" x="${s.tx}" y="${s.ty}">${esc(s.lbl)}</text>`;
  });

  h+=`</g>`;
  kpSvg.innerHTML=h;

  // Alt Kart Güncelleme (image_3.png'deki Kanyon alt kartı)
  updateBottomCard(curStore);
}

function updateBottomCard(store){
  const card=$('#kpBottomCard');
  if(!card) return;
  if(store){
    const logoHtml = KF.logoHtml(store);
    $('#kpCardLogo').innerHTML=logoHtml;
    $('#kpCardName').textContent=store.n;
    $('#kpCardFloor').textContent=`${KF.floorLabel(store)} · ${store.c.join(', ')}`;
    $('#kpCardDir').href=`https://maps.google.com/?q=Koru+Florya+AVM+${encodeURIComponent(store.n)}`;
  } else {
    $('#kpCardLogo').innerHTML='<i>KF</i>';
    $('#kpCardName').textContent='Bir dükkan seçin';
    $('#kpCardFloor').textContent='Kat planındaki dükkanlara tıklayarak konumunu görebilirsiniz';
    $('#kpCardDir').href='https://maps.google.com/?q=Koru+Florya+AVM';
  }
}

// Kat Değiştirme
function setFloor(f){
  st.f=f;
  document.querySelectorAll('#seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===f));
  drawKanyonFloor(f);
  renderStoreList();
}

// Kategori Değiştirme
function setCat(c){
  st.c=c;
  document.querySelectorAll('#pills .pill').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===c));
  renderStoreList();
  drawKanyonFloor(st.f);
}

// Haritadaki Dükkana Tıklama
if(kpSvg){
  kpSvg.addEventListener('click',e=>{
    const p=e.target.closest('.kp-shop');
    if(!p) return;
    const name=p.dataset.name;
    st.sel=name;
    const store=byName[name];
    if(store && store.fl && !store.fl.includes(st.f)){
      st.f=store.fl[0];
      document.querySelectorAll('#seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===st.f));
    }
    drawKanyonFloor(st.f);
    renderStoreList();
  });
}

// Zoom Kontrolleri
const zoomIn=$('#zoomIn'), zoomOut=$('#zoomOut'), zoomReset=$('#zoomReset');
if(zoomIn) zoomIn.addEventListener('click',()=>{zoomLevel=Math.min(zoomLevel+0.2, 1.8);drawKanyonFloor(st.f)});
if(zoomOut) zoomOut.addEventListener('click',()=>{zoomLevel=Math.max(zoomLevel-0.2, 0.8);drawKanyonFloor(st.f)});
if(zoomReset) zoomReset.addEventListener('click',()=>{zoomLevel=1;drawKanyonFloor(st.f)});

// Kontroller Dinleyicileri
if(segEl) segEl.addEventListener('click',e=>{const b=e.target.closest('button');if(b)setFloor(b.dataset.f)});
if(pillsEl) pillsEl.addEventListener('click',e=>{const b=e.target.closest('.pill');if(b)setCat(b.dataset.c)});

const qInput=$('#q');
if(qInput) qInput.addEventListener('input',e=>{st.q=low(e.target.value.trim());st.lim=20;drawKanyonFloor(st.f);renderStoreList()});
const clearBtn=$('#clearBtn');
if(clearBtn) clearBtn.addEventListener('click',()=>{if(qInput)qInput.value='';st.q='';st.sel=null;setCat('all');setFloor('K')});
const moreBtn=$('#moreBtn');
if(moreBtn) moreBtn.addEventListener('click',()=>{st.lim+=20;renderStoreList()});

// Klavye Kısayolları (Ctrl+K)
document.addEventListener('keydown',e=>{
  const k=(e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey);
  const slash=e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if(k||slash){e.preventDefault();$('#rehber').scrollIntoView({behavior:KF.reduce?'auto':'smooth'});setTimeout(()=>{if(qInput)qInput.focus({preventScroll:true})},450)}
});
const findBtn=$('#findBtn');
if(findBtn) findBtn.addEventListener('click',()=>setTimeout(()=>{if(qInput)qInput.focus({preventScroll:true})},700));

// Mağaza Listesi Filtreleme ve Çizimi
const PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
function hl(name){if(!st.q)return esc(name);const i=low(name).indexOf(st.q);if(i<0)return esc(name);return esc(name.slice(0,i))+'<mark>'+esc(name.slice(i,i+st.q.length))+'</mark>'+esc(name.slice(i+st.q.length))}

function renderStoreList(){
  const list=stores.filter(s=>(st.f==='all'||s.fl.includes(st.f))&&(st.c==='all'||s.c.includes(st.c))&&(!st.q||low(s.n).includes(st.q)||s.c.some(c=>low(c).includes(st.q))));
  const filtered=st.f!=='all'||st.c!=='all'||st.q;
  if(clearBtn) clearBtn.hidden=!(filtered||st.sel);
  const resText=$('#resText');
  if(resText) resText.innerHTML=`<b>${list.length}</b> mağaza · ${FLOOR_DEFS[st.f]?FLOOR_DEFS[st.f].title:''}${st.c!=='all'?' · '+esc(st.c):''}`;
  
  const show=list.slice(0,st.lim);
  const bgrid=$('#bgrid');
  if(bgrid){
    bgrid.innerHTML=show.length?show.map(s=>`<article class="bc${s.n===st.sel?' sel':''}"><div class="bc-top"><span class="lg">${KF.logoHtml(s)}</span><span class="tag">${esc(s.c[0]||'')}</span></div><div><h3>${hl(s.n)}</h3><p>${esc(KF.floorShort(s))}</p></div><div class="bc-act"><button class="btn btn-outline btn-sm" type="button" data-n="${esc(s.n)}">${PIN} Kat planında gör</button></div></article>`).join(''):`<div class="empty" style="grid-column:1/-1"><p>${st.q?'“'+esc(st.q)+'” için mağaza bulunamadı':'Bu filtrelerle eşleşen mağaza yok'}</p><button class="btn btn-dark" type="button" id="emptyClear">Filtreleri temizle</button></div>`;
  }
  const rest=list.length-show.length;
  if(moreBtn){moreBtn.hidden=rest<=0;moreBtn.textContent=`Daha fazla göster (${rest})`}
}

const bgridEl=$('#bgrid');
if(bgridEl){
  bgridEl.addEventListener('click',e=>{
    if(e.target.closest('#emptyClear')){if(clearBtn)clearBtn.click();return}
    const b=e.target.closest('[data-n]');if(!b)return;
    const name=b.dataset.n;
    st.sel=name;
    const store=byName[name];
    if(store && store.fl && !store.fl.includes(st.f)){
      st.f=store.fl[0];
      document.querySelectorAll('#seg button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.f===st.f));
    }
    drawKanyonFloor(st.f);
    renderStoreList();
    $('#kanyonWidget').scrollIntoView({behavior:KF.reduce?'auto':'smooth',block:'center'});
  });
}

// İlk çizim
drawKanyonFloor('K');
renderStoreList();

/* ---------- food ---------- */
const FOODG={'Kahve':['Caffè Nero','Coffee Crafters','Cups and Clouds','Elle Cafe','Espressolab','Starbucks','The Co Coffee Company'],'Sofra':["Happy Moon's",'Kayseri Mutfağı','Pastofino','Green Salads','Quick China'],'Hızlı lezzet':["Arby's",'Burger King','Burger Yiyelim','Dürümle','KFC','Popeyes','Sbarro','Shake Shack','Subway','Tavuk Dünyası','Usta Dönerci','White Burger'],'Tatlı ve fırın':['Marlet Pastaneleri','Michetta']};
const FOODIMG={'Kahve':IMG.barista,'Sofra':IMG.food,'Hızlı lezzet':IMG.food2,'Tatlı ve fırın':IMG.cafe,'Diğer':IMG.cafe};
const fg={};Object.entries(FOODG).forEach(([k,a])=>fg[k]=a.filter(n=>byName[n]));
const known=new Set(Object.values(fg).flat());
const other=stores.filter(s=>s.c.includes('Yeme & İçme')&&!known.has(s.n)).map(s=>s.n);
if(other.length)fg['Diğer']=other;
const fk=Object.keys(fg);
const foodPhoto=$('#foodPhoto');
if(foodPhoto) foodPhoto.innerHTML=fk.map((k,i)=>`<img data-k="${i}" class="${i?'':'on'}" src="${U(FOODIMG[k]||IMG.cafe,1000)}" alt="" width="1000" height="1250" loading="lazy" decoding="async" />`).join('');
const ftabs=$('#ftabs');
if(ftabs) ftabs.innerHTML=fk.map((k,i)=>`<button class="ftab" role="tab" type="button" data-i="${i}" aria-selected="${i===0}"><b>${k}</b><em>${fg[k].length} mekân</em></button><div class="fpanel${i?'':' on'}" data-i="${i}"><ul>${fg[k].map(n=>`<li>${esc(n)}<span>${esc(KF.floorLabel(byName[n]))}</span></li>`).join('')}</ul></div>`).join('');
if(ftabs) ftabs.addEventListener('click',e=>{
  const b=e.target.closest('.ftab');if(!b)return;const i=b.dataset.i;
  document.querySelectorAll('.ftab').forEach(t=>t.setAttribute('aria-selected',t===b));
  document.querySelectorAll('.fpanel').forEach(p=>p.classList.toggle('on',p.dataset.i===i));
  document.querySelectorAll('#foodPhoto img').forEach(im=>im.classList.toggle('on',im.dataset.k===i));
});
const allFood=$('#allFood');
if(allFood) allFood.addEventListener('click',()=>{setCat('Yeme & İçme');setFloor('K');$('#rehber').scrollIntoView({behavior:KF.reduce?'auto':'smooth'})});

/* ---------- culture & life ---------- */
(function(){
  const live=KF.EVENTS.filter(e=>e.type==='event'&&!KF.isPast(e));
  const feat=KF.evById('kitap-fuari');
  const F=feat&&!KF.isPast(feat)?feat:KF.sortEv(live)[0];
  const events=KF.sortEv(live.filter(e=>e!==F));
  const camps=KF.EVENTS.filter(e=>e.type==='campaign'&&e.end&&!KF.isPast(e)).sort((a,b)=>KF.evEnd(a)-KF.evEnd(b));
  const rows=[...events,...camps].slice(0,4);
  const box=$('#cul');
  if(!box) return;
  if(!F&&!rows.length){box.innerHTML='<div class="eempty"><p>Şu an planlanmış etkinlik yok</p><a class="btn btn-dark" href="etkinlikler.html">Geçmiş etkinliklere bak</a></div>';return}
  const PHOTO={'kitap-fuari':U('/photo-1566131807516-e3b3cd1a89d1',1600)};
  const feature=F?`<a class="feature" href="etkinlik.html?e=${F.id}"><img src="${PHOTO[F.id]||'assets/events/'+F.img}" alt="" width="1600" height="1067" loading="lazy" decoding="async" /><span class="fdate">${esc(KF.dateShort(F))}</span><span class="eyebrow">${esc(F.kicker||'')}</span><h3>${esc(F.title)}</h3><p>${esc(F.short)}</p><span class="btn btn-light">Etkinliği incele ${ARR}</span></a>`:'';
  const row=e=>{
    const camp=e.type==='campaign',d=camp?KF.evEnd(e):KF.evStart(e);
    const sub=camp?`${KF.fmtDay(KF.evEnd(e))}'e kadar · ${e.place}`:`${e.time?e.time+' · ':''}${e.venue}, ${e.place}`;
    return `<li class="ag"><div class="ag-d"><b>${d.getDate()}</b><small>${KF.MONTHS[d.getMonth()].slice(0,3)}</small></div><div><h4>${esc(e.title)}</h4><p>${esc(sub)}</p></div><a class="btn btn-outline" href="etkinlik.html?e=${e.id}${camp?'':'#takvim'}">${camp?'İncele':'Takvime ekle'}</a></li>`;
  };
  box.innerHTML=feature+`<aside class="agenda"><h3>Ajanda <a href="etkinlikler.html">Tümü</a></h3><ul class="ag-list">${rows.map(row).join('')||'<li style="padding:24px 0;color:var(--ink3)">Yaklaşan başka etkinlik yok</li>'}</ul></aside>`;
})();

/* ---------- visit: LEAFLET INTERACTIVE MAP + SHUTTLE ---------- */
if($('#gmaps')) $('#gmaps').href=KF.MAPS;
if($('#amaps')) $('#amaps').href=KF.APPLE_MAPS;
let sdir='MF';
function shuttle(){
  const now=KF.nowSecs(),nx=KF.nextShuttle(sdir,now),nm=KF.nextShuttle('MF',now);
  if($('#tShuttle')) $('#tShuttle').textContent=nm?`Sıradaki ${nm.t} (${nm.min} dk sonra)`:`Yarın ${KF.SHUTTLE.MF[0]}`;
  if($('#shBadge')) $('#shBadge').textContent=nx?`Sıradaki sefer ${nx.t} · kalkışa ${nx.min} dk`:`Bugünkü seferler bitti · yarın ${KF.SHUTTLE[sdir][0]}`;
  if($('#shDot')) $('#shDot').classList.toggle('off',!nx);
  if($('#shTimes')) $('#shTimes').innerHTML=KF.SHUTTLE[sdir].map(t=>`<span class="${nx&&t===nx.t?'next':(KF.secs(t)<=now?'past':'')}">${t}</span>`).join('');
}
document.querySelectorAll('.sw button').forEach(b=>b.addEventListener('click',()=>{
  sdir=b.dataset.d;
  document.querySelectorAll('.sw button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  shuttle();
}));

function status(){
  const s=KF.status();
  if($('#tDot')) $('#tDot').classList.toggle('off',!s.open);
  if($('#tStatus')) $('#tStatus').textContent=s.text;
}
document.addEventListener('kf:tick',()=>{status();shuttle()});
status();
shuttle();

// Leaflet Sürüklenebilir & Yakınlaştırılabilir İnteraktif Harita
function buildInteractiveMap(){
  const canvas=$('#mapCanvas');
  if(!canvas || !window.L) return;
  canvas.innerHTML=''; // reset

  const {mall, station}=KF.COORD;
  const centerLat=(mall.lat+station.lat)/2;
  const centerLon=(mall.lon+station.lon)/2;

  const map = L.map('mapCanvas', {
    center: [centerLat, centerLon],
    zoom: 15,
    scrollWheelZoom: true,
    zoomControl: true
  });

  // Modern açık tonlu CartoDB Voyager harita katmanı
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap, © CARTO'
  }).addTo(map);

  // Marmaray ile AVM arasındaki kesikli rota çizgisi
  L.polyline([[station.lat, station.lon], [mall.lat, mall.lon]], {
    color: '#1C1F1D',
    weight: 3.5,
    dashArray: '5, 8',
    opacity: 0.85
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
  if(leg) leg.innerHTML=`<span class="dot" style="animation:none;background:#00AB84"></span>İstasyondan yaklaşık ${km} km · 20 dk yürüyüş (Haritayı sürükleyip gezebilirsiniz)`;
}

if(window.L){
  buildInteractiveMap();
} else {
  window.addEventListener('load', buildInteractiveMap);
}

/* deep link: index.html?magaza=Altınbaş#rehber */
const want=new URLSearchParams(location.search).get('magaza');
if(want&&byName[want]){
  st.sel=want;
  const store=byName[want];
  if(store.fl) setFloor(store.fl[0]);
  setTimeout(()=>{
    $('#kanyonWidget').scrollIntoView({block:'center',behavior:'smooth'});
  },400);
}
})();
