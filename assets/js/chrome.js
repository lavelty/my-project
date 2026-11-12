/* Shared header, footer and header behavior - V2 Premium */
(function(){
const $=s=>document.querySelector(s);
const home=document.body.dataset.page==='home';
const p=home?'':'index.html';

const nav=[
  ['Markalar & Katlar',p+'#rehber'],
  ['Kat Planları','kat-planlari.html'],
  ['Etkinlikler','etkinlikler.html'],
  ['Hizmetler',p+'#hizmetler'],
  ['Ulaşım',p+'#ulasim']
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
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="links" aria-label="Menüyü aç">
      <span class="menu-btn-icon"></span>
      <span class="menu-btn-text">Menü</span>
    </button>
  </div>
</div>`;
document.body.prepend(header);

const skip=document.createElement('a');
skip.className='skip';
skip.href='#main';
skip.textContent='İçeriğe geç';
document.body.prepend(skip);

/* Premium Corporate Footer */
const footer=document.createElement('footer');
footer.innerHTML=`<div class="wrap">
  <div class="foot">
    <div class="foot-col foot-brand-col">
      <a class="brand" href="${home?'#top':'index.html'}" aria-label="Koru Florya ana sayfa">
        <img src="assets/logo/koruflorya-white.svg" alt="Koru Florya" width="160" height="50" />
      </a>
      <p class="foot-desc">177 seçkin mağaza, açık hava bahçe terasları ve doğrudan Marmaray/Metrobüs ulaşımı ile Florya'nın alışveriş ve yaşam merkezi.</p>
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
      <a href="${p}#hizmetler">Ziyaretçi Hizmetleri</a>
      <a href="${p}#ulasim">Ulaşım ve Harita</a>
    </div>

    <div class="foot-col">
      <h3>Hizmetler</h3>
      <a href="${p}#hizmetler">Vale &amp; Kapalı Otopark</a>
      <a href="${p}#hizmetler">Misafir Danışma</a>
      <a href="${p}#hizmetler">Elektrikli Araç Şarjı</a>
      <a href="${p}#hizmetler">Bebek Bakım Odaları</a>
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
    </div>
  </div>
</div>`;
document.body.appendChild(footer);

/* Header: 100% transparent over hero, then smoothly transitions to solid white */
if(home){
  const hero=$('#top');
  const updateNav=()=>{
    if($('#links')&&$('#links').classList.contains('open')) return;
    const heroRect=hero?hero.getBoundingClientRect():null;
    const pastHero=heroRect?(heroRect.bottom<=76):(scrollY>innerHeight*.85);
    header.classList.toggle('solid',pastHero);
  };
  addEventListener('scroll',updateNav,{passive:true});
  updateNav();

  /* ScrollSpy for active nav item indicator */
  const sections=['rehber','hizmetler','ulasim'].map(id=>document.getElementById(id)).filter(Boolean);
  if(sections.length && 'IntersectionObserver' in window){
    const spyObs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id = entry.target.id;
          document.querySelectorAll('#links a').forEach(a=>{
            const isMatch = a.getAttribute('href').includes('#'+id);
            a.classList.toggle('active', isMatch);
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    sections.forEach(s=>spyObs.observe(s));
  }
}

/* Mobile Menu Toggle */
const links=$('#links'), mb=$('#menuBtn');
if(mb && links){
  mb.addEventListener('click',()=>{
    const isOpen=links.classList.toggle('open');
    mb.setAttribute('aria-expanded',isOpen);
    const textEl = mb.querySelector('.menu-btn-text');
    if(textEl) textEl.textContent = isOpen?'Kapat':'Menü';
    mb.classList.toggle('active', isOpen);
    if(isOpen){
      header.classList.add('solid');
      document.body.style.overflow='hidden';
    } else {
      document.body.style.overflow='';
      if(home){
        const hero=$('#top');
        const heroRect=hero?hero.getBoundingClientRect():null;
        header.classList.toggle('solid',heroRect?(heroRect.bottom<=76):(scrollY>innerHeight*.85));
      }
    }
  });

  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    links.classList.remove('open');
    mb.setAttribute('aria-expanded',false);
    mb.classList.remove('active');
    const textEl = mb.querySelector('.menu-btn-text');
    if(textEl) textEl.textContent = 'Menü';
    document.body.style.overflow='';
  }));
}

/* Live status ticker */
function tick(){
  if(!window.KF || !KF.status) return;
  const s=KF.status();
  const navDot=$('#navDot'), navStatus=$('#navStatus');
  if(navDot) navDot.classList.toggle('off',!s.open);
  if(navStatus) navStatus.textContent=s.open?'Şu an açık':'Şu an kapalı';
  document.dispatchEvent(new CustomEvent('kf:tick'));
}
tick();
setInterval(tick,15000);
})();
