/* Shared header, footer, bespoke mobile drawer and mobile bottom dock - V3 Mobile-First Luxury */
(function(){
const $=s=>document.querySelector(s);
const pageType=document.body.dataset.page||'';
const home=pageType==='home';
const isAdmin=pageType==='admin';
const p=home?'':'index.html';

const nav=[
  ['Markalar & Katlar',p+'#rehber'],
  ['Kat Planları','kat-planlari.html'],
  ['Etkinlikler','etkinlikler.html'],
  ['Hizmetler','hizmetler.html'],
  ['Ulaşım',p+'#ulasim']
];

const mobileCards=[
  {
    title:'Markalar & Katlar',
    sub:'Mağaza, restoran ve kafe rehberi',
    href:p+'#rehber',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
  },
  {
    title:'Kat Planları',
    sub:'Koru, Podyum, Cadde ve Otopark katları',
    href:'kat-planlari.html',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/></svg>'
  },
  {
    title:'Etkinlikler & Kampanyalar',
    sub:'Güncel etkinlik takvimi ve mağaza fırsatları',
    href:'etkinlikler.html',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'
  },
  {
    title:'Ziyaretçi Hizmetleri',
    sub:'Vale, elektrikli şarj, bebek odası ve danışma',
    href:'hizmetler.html',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>'
  },
  {
    title:'Kayıp Eşya & Başvuru Sorgula',
    sub:'Online kayıp bildirimi ve danışma yanıt takibi',
    href:'kayip-esya.html',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.5-4.5"/></svg>'
  },
  {
    title:'Ulaşım & Marmaray Ring',
    sub:'Ücretsiz servis saatleri ve interaktif harita',
    href:p+'#ulasim',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 12h16M8 21l-1-4M16 21l1-4"/></svg>'
  }
];

const header=document.createElement('header');
header.className='nav'+(home?'':' solid');
header.id='nav';
header.innerHTML=`<div class="wrap">
  <a class="brand" href="${home?'#top':'index.html'}" aria-label="Koru Florya ana sayfa">
    <img class="logo-w" src="assets/logo/koruflorya-white.svg" alt="Koru Florya" width="156" height="48" />
    <img class="logo-d" src="assets/logo/koruflorya.svg" alt="" width="156" height="48" />
  </a>
  <nav class="links" id="links" aria-label="Ana menü">
    ${nav.map(([t,h])=>`<a href="${h}">${t}</a>`).join('')}
  </nav>
  <div class="nav-r">
    <div class="live" role="status" title="Çalışma saatleri: Her gün 10:00 - 22:00">
      <span class="dot" id="navDot"></span>
      <span id="navStatus">Şu an açık</span>
    </div>
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="mobileDrawer" aria-label="Menüyü aç">
      <span class="menu-bars" aria-hidden="true"><i></i><i></i></span>
      <span class="menu-btn-text">Menü</span>
    </button>
  </div>
</div>`;
document.body.prepend(header);

/* Bespoke Mobile Menu Drawer */
const drawer=document.createElement('aside');
drawer.className='mobile-drawer';
drawer.id='mobileDrawer';
drawer.setAttribute('aria-hidden','true');
drawer.innerHTML=`
  <div class="md-backdrop" id="mdBackdrop"></div>
  <div class="md-sheet">
    <div class="md-status-bar">
      <div class="md-live">
        <span class="dot" id="mdDot"></span>
        <div>
          <b id="mdStatusText">Şu an açık</b>
          <span>Her gün 10:00 – 22:00</span>
        </div>
      </div>
      <a href="${p}#ulasim" class="md-ring-pill" data-close-drawer>🚌 Ücretsiz Ring</a>
    </div>

    <form class="md-search" id="mdSearchForm" action="index.html" method="get">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" width="18" height="18"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
      <input type="search" id="mdSearchInput" placeholder="Mağaza, restoran veya kategori ara..." autocomplete="off" />
      <button type="submit">Ara</button>
    </form>

    <nav class="md-nav" aria-label="Mobil menü">
      ${mobileCards.map(c=>`
        <a href="${c.href}" class="md-card" data-close-drawer>
          <span class="md-ic">${c.icon}</span>
          <span class="md-txt">
            <b>${c.title}</b>
            <small>${c.sub}</small>
          </span>
          <svg class="md-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="m9 18 6-6-6-6"/></svg>
        </a>
      `).join('')}
    </nav>

    <div class="md-foot">
      <div class="md-cta-grid">
        <a href="${(window.KF&&KF.MAPS)||'https://maps.google.com'}" target="_blank" rel="noopener" class="btn btn-dark btn-sm">📍 Yol Tarifi Al</a>
        <a href="kayip-esya.html" class="btn btn-outline btn-sm" data-close-drawer>🔍 Kayıp Eşya</a>
      </div>
      <div class="md-socials">
        <a href="https://www.instagram.com/koruflorya.avm/" target="_blank" rel="noopener">Instagram</a>
        <span>•</span>
        <a href="https://www.facebook.com/korufloryaavm" target="_blank" rel="noopener">Facebook</a>
        <span>•</span>
        <a href="https://www.tiktok.com/@korufloryaavm" target="_blank" rel="noopener">TikTok</a>
      </div>
    </div>
  </div>
`;
document.body.appendChild(drawer);

/* Native-App Floating Mobile Bottom Navigation Bar */
if(!isAdmin){
  const curPath=location.pathname.split('/').pop()||'index.html';
  const dock=document.createElement('nav');
  dock.className='mobile-dock';
  dock.id='mobileDock';
  dock.setAttribute('aria-label','Hızlı mobil gezinme');
  dock.innerHTML=`
    <a href="${home?'#top':'index.html'}" class="mdk-item${home?' on':''}" data-dock="home">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Keşfet</span>
    </a>
    <a href="${p}#rehber" class="mdk-item${pageType==='store'?' on':''}" data-dock="rehber">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
      <span>Mağazalar</span>
    </a>
    <a href="kat-planlari.html" class="mdk-item${curPath==='kat-planlari.html'?' on':''}" data-dock="floors">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/></svg>
      <span>Kat Planı</span>
    </a>
    <a href="etkinlikler.html" class="mdk-item${curPath==='etkinlikler.html'||curPath==='etkinlik.html'?' on':''}" data-dock="events">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
      <span>Etkinlikler</span>
    </a>
    <a href="${p}#ulasim" class="mdk-item" data-dock="ulasim">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 12h16M8 21l-1-4M16 21l1-4"/></svg>
      <span>Ulaşım</span>
    </a>
  `;
  document.body.appendChild(dock);
}

const skip=document.createElement('a');
skip.className='skip';
skip.href='#main';
skip.textContent='İçeriğe geç';
document.body.prepend(skip);

/* Premium Corporate Footer with Kanyon-Style Compact E-Bülten Capsule */
const footer=document.createElement('footer');
footer.innerHTML=`<div class="wrap">
  <div class="foot">
    <div class="foot-col foot-brand-col">
      <a class="brand" href="${home?'#top':'index.html'}" aria-label="Koru Florya ana sayfa">
        <img src="assets/logo/koruflorya-white.svg" alt="Koru Florya" width="160" height="50" />
      </a>
      <p class="foot-desc">Açık hava bahçe terasları, seçkin dünya markaları ve doğayla iç içe mimarisiyle Florya’nın yaşam merkezi.</p>
      <div class="foot-schedule">
        <span class="fs-title">Ziyaret saatleri:</span>
        <span class="fs-hours">Her gün 10:00 – 22:00</span>
      </div>
    </div>

    <div class="foot-col">
      <h3>Keşfet</h3>
      <a href="${p}#rehber">Markalar ve Katlar</a>
      <a href="kat-planlari.html">Kat Planları</a>
      <a href="etkinlikler.html">Etkinlik Takvimi</a>
      <a href="hizmetler.html">Ziyaretçi Hizmetleri</a>
      <a href="${p}#ulasim">Ulaşım ve Harita</a>
    </div>

    <div class="foot-col">
      <h3>Hizmetler</h3>
      <a href="hizmetler.html">Danışma</a>
      <a href="hizmetler.html#otopark">Otopark ve şarj</a>
      <a href="kayip-esya.html">Kayıp eşya bildirimi</a>
      <a href="hizmetler.html#ziyaretci">Bebek bakım odası</a>
    </div>

    <div class="foot-col">
      <h3>İletişim</h3>
      <a href="mailto:info@koruflorya.com">info@koruflorya.com</a>
      <a href="mailto:info@koruflorya.com?subject=Kiralama%20Talebi">Kiralama Ofisi</a>
      <span class="foot-addr">Şenlikköy Mah. Ekşinar Sok. No: 46/1, Florya / İstanbul</span>
    </div>

    <div class="foot-col">
      <h3>Takip Edin</h3>
      <div class="foot-socials">
        <a href="https://www.instagram.com/koruflorya.avm/" target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          <span>Instagram</span>
        </a>
        <a href="https://www.facebook.com/korufloryaavm" target="_blank" rel="noopener" aria-label="Facebook">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          <span>Facebook</span>
        </a>
        <a href="https://www.tiktok.com/@korufloryaavm" target="_blank" rel="noopener" aria-label="TikTok">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
          <span>TikTok</span>
        </a>
      </div>
    </div>
  </div>

  <div class="nl-kanyon-wrap" id="ebulten">
    <form class="nl-capsule" id="kfNewsletterForm" novalidate>
      <input type="email" name="email" id="nlEmail" required placeholder="E-BÜLTENİMİZE ABONE OLUN" aria-label="E-Bültenimize abone olmak için e-posta adresiniz" autocomplete="email" />
      <button type="submit" class="nl-capsule-btn" id="nlSubmitBtn">
        <span>Kayıt Ol</span>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
    </form>
    <span class="nl-msg" id="nlFeedbackMsg" hidden></span>
  </div>

  <div class="legal">
    <div class="legal-left">
      <span>© 2026 Koru Gayrimenkul Yatırım A.Ş. Tüm hakları saklıdır.</span>
    </div>
    <div class="legal-links">
      <a href="kvkk.html">KVKK Aydınlatma Metni</a>
      <span>•</span>
      <a href="kvkk.html#cerezler">Çerez Politikası</a>
      <span>•</span>
      <a href="sartlar.html">Kullanım Şartları</a>
      <span>•</span>
      <a href="admin.html">Yönetim Paneli</a>
    </div>
  </div>
</div>`;
document.body.appendChild(footer);

/* Wire Compact Kanyon-Style E-Bülten Capsule to localStorage (kf_cms_newsletter) */
const nlForm=footer.querySelector('#kfNewsletterForm');
if(nlForm){
  const emailEl=footer.querySelector('#nlEmail');
  const msgEl=footer.querySelector('#nlFeedbackMsg');
  const btnEl=footer.querySelector('#nlSubmitBtn');

  emailEl.addEventListener('focus',()=>{
    emailEl.placeholder='E-posta adresinizi yazın...';
  });
  emailEl.addEventListener('blur',()=>{
    if(!emailEl.value.trim()) emailEl.placeholder='E-BÜLTENİMİZE ABONE OLUN';
  });

  nlForm.addEventListener('submit',e=>{
    e.preventDefault();
    const email=(emailEl.value||'').trim().toLowerCase();
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      emailEl.focus();
      emailEl.placeholder='E-posta adresinizi yazın...';
      return;
    }

    const NL_KEY='kf_cms_newsletter';
    let list=[];
    try{
      const raw=localStorage.getItem(NL_KEY);
      if(raw) list=JSON.parse(raw);
    }catch{}

    const existing=list.find(x=>(x.email||'').toLowerCase()===email);
    if(existing){
      existing.status='Aktif';
    }else{
      const namePart=email.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
      list.unshift({
        id:'nl-'+Date.now(),
        email,
        name:namePart||'Ziyaretçi',
        interests:['Etkinlik & Kültür','Mağaza Kampanyaları'],
        status:'Aktif',
        source:location.pathname.split('/').pop()||'Anasayfa E-Bülten',
        createdAt:new Date().toLocaleString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})
      });
    }
    try{localStorage.setItem(NL_KEY,JSON.stringify(list));}catch{}

    nlForm.reset();
    emailEl.placeholder='E-BÜLTENİMİZE ABONE OLUN';
    emailEl.blur();
    if(btnEl){
      btnEl.innerHTML=`<span>Kaydınız Alındı</span><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(()=>{
        btnEl.innerHTML=`<span>Kayıt Ol</span><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
      },3500);
    }
    if(msgEl){
      msgEl.textContent='✓ E-bülten aboneliğiniz başarıyla kaydedildi.';
      msgEl.hidden=false;
      setTimeout(()=>{msgEl.hidden=true;},5000);
    }
  });
}

/* Header: 100% transparent over hero top, then softly transitions to frosted ivory/white on scroll */
if(home){
  const updateNav=()=>{
    if(drawer.classList.contains('open')) return;
    header.classList.toggle('solid', scrollY > 48);
  };
  addEventListener('scroll',updateNav,{passive:true});
  updateNav();

  /* ScrollSpy for active nav & mobile dock item indicator */
  const sections=['top','rehber','hizmetler','ulasim'].map(id=>document.getElementById(id)).filter(Boolean);
  if(sections.length && 'IntersectionObserver' in window){
    const spyObs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id = entry.target.id;
          document.querySelectorAll('#links a').forEach(a=>{
            const isMatch = a.getAttribute('href').includes('#'+id);
            a.classList.toggle('active', isMatch);
          });
          document.querySelectorAll('#mobileDock .mdk-item').forEach(a=>{
            const dk=a.dataset.dock;
            const match=(id==='top'&&dk==='home')||(id==='rehber'&&dk==='rehber')||(id==='ulasim'&&dk==='ulasim');
            if(id==='top'||id==='rehber'||id==='ulasim') a.classList.toggle('on',match);
          });
        }
      });
    }, { rootMargin: '-25% 0px -55% 0px' });
    sections.forEach(s=>spyObs.observe(s));
  }
}

/* Mobile Drawer Toggle & Search */
const mb=$('#menuBtn');
function setDrawerOpen(open){
  drawer.classList.toggle('open',open);
  drawer.setAttribute('aria-hidden',!open);
  if(mb){
    mb.setAttribute('aria-expanded',open);
    mb.classList.toggle('active',open);
    const textEl=mb.querySelector('.menu-btn-text');
    if(textEl) textEl.textContent=open?'Kapat':'Menü';
  }
  if(open){
    header.classList.add('solid');
    document.body.style.overflow='hidden';
  }else{
    document.body.style.overflow='';
    if(home) header.classList.toggle('solid', scrollY > 48);
  }
}
if(mb){
  mb.addEventListener('click',()=>setDrawerOpen(!drawer.classList.contains('open')));
}
$('#mdBackdrop').addEventListener('click',()=>setDrawerOpen(false));
drawer.querySelectorAll('[data-close-drawer]').forEach(el=>el.addEventListener('click',()=>setDrawerOpen(false)));

const mdSearchForm=$('#mdSearchForm'), mdSearchInput=$('#mdSearchInput');
if(mdSearchForm && mdSearchInput){
  mdSearchForm.addEventListener('submit',e=>{
    e.preventDefault();
    const val=mdSearchInput.value.trim();
    setDrawerOpen(false);
    if(home && $('#q')){
      const qEl=$('#q');
      qEl.value=val;
      qEl.dispatchEvent(new Event('input',{bubbles:true}));
      const r=$('#rehber');
      if(r) r.scrollIntoView({behavior:'smooth'});
    }else{
      location.href='index.html'+(val?'?ara='+encodeURIComponent(val):'')+'#rehber';
    }
  });
}

/* Live status ticker */
function tick(){
  if(!window.KF || !KF.status) return;
  const s=KF.status();
  const navDot=$('#navDot'), navStatus=$('#navStatus');
  if(navDot) navDot.classList.toggle('off',!s.open);
  if(navStatus) navStatus.textContent=s.open?'Şu an açık':'Şu an kapalı';
  const mdDot=$('#mdDot'), mdStatus=$('#mdStatusText');
  if(mdDot) mdDot.classList.toggle('off',!s.open);
  if(mdStatus) mdStatus.textContent=s.open?'AVM Şu An Açık':'AVM Şu An Kapalı';
  document.dispatchEvent(new CustomEvent('kf:tick'));
}
tick();
setInterval(tick,15000);
})();
