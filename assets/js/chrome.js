/* Shared header, footer and header behavior */
(function(){
const $=s=>document.querySelector(s);
const home=document.body.dataset.page==='home';
const p=home?'':'index.html';
const nav=[
  ['Mağazalar',p+'#rehber'],['Yeme içme',p+'#yeme-icme'],['Etkinlikler',home?'#etkinlikler':'etkinlikler.html'],['Ulaşım',p+'#ulasim']
];
const header=document.createElement('header');
header.className='nav'+(home?'':' solid');header.id='nav';
header.innerHTML=`<div class="wrap">
  <a class="brand" href="${home?'#top':'index.html'}" aria-label="Koru Florya ana sayfa">
    <img class="logo-w" src="assets/logo/koruflorya-white.svg" alt="Koru Florya" width="133" height="44" />
    <img class="logo-d" src="assets/logo/koruflorya.svg" alt="" width="133" height="44" />
  </a>
  <nav class="links" id="links" aria-label="Ana menü">${nav.map(([t,h])=>`<a href="${h}">${t}</a>`).join('')}</nav>
  <div class="nav-r">
    <div class="live" role="status"><span class="dot" id="navDot"></span><span id="navStatus">Açık</span></div>
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="links">Menü</button>
  </div>
</div>`;
document.body.prepend(header);
const skip=document.createElement('a');skip.className='skip';skip.href='#main';skip.textContent='İçeriğe geç';document.body.prepend(skip);

const footer=document.createElement('footer');
footer.innerHTML=`<div class="wrap">
  <div class="foot">
    <div>
      <a class="brand" href="${home?'#top':'index.html'}" aria-label="Koru Florya ana sayfa"><img src="assets/logo/koruflorya-white.svg" alt="Koru Florya" width="192" height="64" /></a>
      <p>Florya'nın alışveriş ve yaşam merkezi. Her gün 10:00 - 22:00</p>
    </div>
    <div><h3>Gezin</h3><a href="${p}#rehber">Kat ve mağazalar</a><a href="${p}#yeme-icme">Yeme içme</a><a href="etkinlikler.html">Etkinlikler</a><a href="${p}#ulasim">Ulaşım</a></div>
    <div><h3>İletişim</h3><a href="mailto:info@koruflorya.com">info@koruflorya.com</a><a href="mailto:info@koruflorya.com?subject=Kiralama">Kiralama</a></div>
    <div><h3>Takip edin</h3><a href="https://www.instagram.com/koruflorya.avm/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/korufloryaavm" target="_blank" rel="noopener">Facebook</a><a href="https://www.tiktok.com/@korufloryaavm" target="_blank" rel="noopener">TikTok</a></div>
    <div><h3>Yasal</h3><a href="kvkk.html">KVKK aydınlatma metni</a><a href="kvkk.html#cerezler">Çerez bilgisi</a><a href="sartlar.html">Kullanım şartları</a></div>
  </div>
  <div class="legal"><span>Koru Florya için hazırlanmış bir tasarım çalışması</span><span>2026</span></div>
</div>`;
document.body.appendChild(footer);

/* header: smooth transition once 80% of the hero has passed */
const sentinel=$('#heroEnd');
const setSolid=v=>{if(!$('#links').classList.contains('open'))header.classList.toggle('solid',v)};
if(home&&sentinel&&'IntersectionObserver' in window){
  new IntersectionObserver(([e])=>{setSolid(!e.isIntersecting&&e.boundingClientRect.top<(e.rootBounds?e.rootBounds.top:0))},{rootMargin:'-80px 0px 0px 0px',threshold:0}).observe(sentinel);
}else if(home){
  const f=()=>setSolid(scrollY>innerHeight*.8);addEventListener('scroll',f,{passive:true});f();
}
const links=$('#links'),mb=$('#menuBtn');
mb.addEventListener('click',()=>{
  const o=links.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'Kapat':'Menü';
  if(o)header.classList.add('solid');else if(home&&sentinel){const r=sentinel.getBoundingClientRect();header.classList.toggle('solid',r.top<80)}
});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');mb.setAttribute('aria-expanded',false);mb.textContent='Menü'}));

/* live status */
function tick(){
  const s=KF.status();
  $('#navDot').classList.toggle('off',!s.open);
  $('#navStatus').textContent=s.open?'Şu an açık':'Şu an kapalı';
  document.dispatchEvent(new CustomEvent('kf:tick'));
}
tick();setInterval(tick,15000);
})();
