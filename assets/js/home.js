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
$('#heroSub').textContent=`${stores.length} mağaza, ${FOODN} yeme içme durağı ve ücretsiz Marmaray servisi. Her gün 10:00 ile 22:00 arası açığız.`;
$('#foodLead').textContent=`Sabah kahvesinden akşam yemeğine ${FOODN} durak, çoğu giriş kat olan Koru Katı'nda`;
const SLIDES=[{img:IMG.atrium,alt:'Koru Florya iç mekânı'},{img:IMG.fashion,alt:'Alışveriş poşetleriyle bir kadın'},{img:IMG.cafe,alt:'Akşam ışığında kafe'},{img:IMG.trees,alt:'Florya korusundan ağaçlar'}];
$('#slides').innerHTML=SLIDES.map((s,i)=>`<div class="slide${i?'':' on'}"><img src="${U(s.img,2000)}" alt="${s.alt}" width="2000" height="1125" ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async" /></div>`).join('');
$('#dots').innerHTML=SLIDES.map((s,i)=>`<button type="button" aria-label="Slayt ${i+1}" aria-current="${i===0}"></button>`).join('');
let cur=0,timer;
const go=i=>{cur=(i+SLIDES.length)%SLIDES.length;document.querySelectorAll('.slide').forEach((el,k)=>el.classList.toggle('on',k===cur));document.querySelectorAll('#dots button').forEach((b,k)=>b.setAttribute('aria-current',k===cur))};
const play=()=>{clearInterval(timer);if(!KF.reduce)timer=setInterval(()=>go(cur+1),7000)};
$('#dots').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;go([...b.parentNode.children].indexOf(b));play()});
$('#top').addEventListener('mouseenter',()=>clearInterval(timer));
$('#top').addEventListener('mouseleave',play);
play();

/* brand strip */
const BRANDS=['Zara','Mango','Beymen Club','Starbucks','LEGO Store','Pandora','MediaMarkt','Shake Shack','Lacoste','Swarovski','Boyner','Puma',"Levi's",'Samsung'];
$('#brandList').innerHTML=BRANDS.map(n=>byName[n]).filter(s=>s&&s.l).map(s=>`<li><img src="assets/brands/${s.l}" alt="${esc(s.n)}" loading="lazy" decoding="async" /></li>`).join('');

/* ---------- floor + store experience ---------- */
const st={f:'all',c:'all',q:'',sel:null,lim:20};
const count=f=>stores.filter(s=>s.fl.includes(f)).length;
const SEGS=[['all','Tüm katlar',''],['K','Koru Katı','Giriş'],['P','Podyum Katı','1. Kat'],['C','Cadde Katı','2. Kat'],['O','Otopark','-1']];
$('#seg').innerHTML=SEGS.map(([k,n,s])=>`<button type="button" data-f="${k}" aria-pressed="${k==='all'}">${n}${s?` <small>${s}</small>`:''}</button>`).join('');
$('#pills').innerHTML=`<button class="pill" type="button" data-c="all" aria-pressed="true">Tümü</button>`+CATS.map(c=>`<button class="pill" type="button" data-c="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('');
$('#kbd').textContent=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?'⌘ K':'Ctrl K';

/* building section: top to bottom C, P, K, then parking below the ground line */
const SC={C:{y:20},P:{y:100},K:{y:180},O:{y:262}};
function schemaBase(){
  let h=`<defs><pattern id="scHatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="rgba(28,31,29,.22)" stroke-width="1"/></pattern></defs>`;
  h+=`<line class="sc-gnd" x1="4" y1="256" x2="348" y2="256"/><line class="sc-win" x1="8" y1="11" x2="344" y2="11"/>`;
  ['C','P','K','O'].forEach(f=>{
    const y=SC[f].y,n=count(f);
    h+=`<g class="sc-fl" data-f="${f}" tabindex="0" role="button" aria-label="${FL[f].n}, ${n} mağaza"><rect class="sc-slab" x="16" y="${y}" width="320" height="72" rx="10"/>`;
    if(f==='O')h+=`<rect x="17" y="${y+1}" width="318" height="70" rx="9" fill="url(#scHatch)" style="pointer-events:none"/>`;
    else for(let i=0;i<5;i++)h+=`<line class="sc-win" x1="${112+i*24}" y1="${y+10}" x2="${112+i*24}" y2="${y+22}"/>`;
    h+=`<rect x="228" y="${y+16}" width="40" height="40" rx="5" fill="none" class="sc-win"/><path class="sc-win" d="M232 ${y+52}L264 ${y+20}M232 ${y+36}L248 ${y+20}M248 ${y+52}L264 ${y+36}"/>`;
    h+=`<text x="34" y="${y+46}" font-size="30" letter-spacing="-1">${FL[f].lv}</text><text x="80" y="${y+34}" font-size="15">${FL[f].n}</text><text class="t2" x="80" y="${y+54}" font-size="13">${FL[f].sub} · ${n} mağaza</text></g>`;
  });
  return h+'<g id="scPins"></g>';
}
$('#scSvg').setAttribute('viewBox','0 0 352 344');
$('#scSvg').innerHTML=schemaBase();
function renderSchema(){
  const sel=st.sel?byName[st.sel]:null;
  const active=st.f!=='all'?[st.f]:(sel?sel.fl:[]);
  document.querySelectorAll('.sc-fl').forEach(g=>{const f=g.dataset.f;g.classList.toggle('on',active.includes(f));g.classList.toggle('dim',active.length>0&&!active.includes(f))});
  $('#scPins').innerHTML=sel?sel.fl.map(f=>`<g class="pin on" transform="translate(302 ${SC[f].y+36})"><circle class="ring" r="9"/><circle r="9"/></g>`).join(''):'';
  const box=$('#scSel');
  if(sel){box.className='sc-sel';box.innerHTML=`<span class="lg">${KF.logoHtml(sel)}</span><span><b>${esc(sel.n)}</b><span>${esc(KF.floorShort(sel))}<br>${esc(sel.c.join(', '))}</span></span>`}
  else{box.className='sc-sel empty';box.innerHTML='Bir mağazada "Haritada göster"e bas, bulunduğu kat işaretlensin'}
}
$('#scSvg').addEventListener('click',e=>{const g=e.target.closest('.sc-fl');if(g)setFloor(st.f===g.dataset.f?'all':g.dataset.f)});
$('#scSvg').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const g=e.target.closest('.sc-fl');if(g){e.preventDefault();setFloor(st.f===g.dataset.f?'all':g.dataset.f)}}});

function setFloor(f){st.f=f;st.lim=20;document.querySelectorAll('#seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===f));render()}
function setCat(c){st.c=c;st.lim=20;document.querySelectorAll('#pills .pill').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===c));render()}
$('#seg').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setFloor(b.dataset.f)});
$('#pills').addEventListener('click',e=>{const b=e.target.closest('.pill');if(b)setCat(b.dataset.c)});
$('#q').addEventListener('input',e=>{st.q=low(e.target.value.trim());st.lim=20;render()});
$('#clearBtn').addEventListener('click',()=>{$('#q').value='';st.q='';st.sel=null;setCat('all');setFloor('all')});
$('#moreBtn').addEventListener('click',()=>{st.lim+=20;render()});
document.addEventListener('keydown',e=>{
  const k=(e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey);
  const slash=e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if(k||slash){e.preventDefault();$('#rehber').scrollIntoView({behavior:KF.reduce?'auto':'smooth'});setTimeout(()=>$('#q').focus({preventScroll:true}),KF.reduce?0:450)}
});
$('#findBtn').addEventListener('click',()=>setTimeout(()=>$('#q').focus({preventScroll:true}),700));
const PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
function hl(name){if(!st.q)return esc(name);const i=low(name).indexOf(st.q);if(i<0)return esc(name);return esc(name.slice(0,i))+'<mark>'+esc(name.slice(i,i+st.q.length))+'</mark>'+esc(name.slice(i+st.q.length))}
function render(){
  const list=stores.filter(s=>(st.f==='all'||s.fl.includes(st.f))&&(st.c==='all'||s.c.includes(st.c))&&(!st.q||low(s.n).includes(st.q)||s.c.some(c=>low(c).includes(st.q))));
  const filtered=st.f!=='all'||st.c!=='all'||st.q;
  $('#clearBtn').hidden=!(filtered||st.sel);
  $('#resText').innerHTML=`<b>${list.length}</b> mağaza${st.f!=='all'?' · '+FL[st.f].n:''}${st.c!=='all'?' · '+esc(st.c):''}`;
  const show=list.slice(0,st.lim);
  $('#bgrid').innerHTML=show.length?show.map(s=>`<article class="bc${s.n===st.sel?' sel':''}"><div class="bc-top"><span class="lg">${KF.logoHtml(s)}</span><span class="tag">${esc(s.c[0]||'')}</span></div><div><h3>${hl(s.n)}</h3><p>${esc(KF.floorShort(s))}</p></div><div class="bc-act"><button class="btn btn-outline btn-sm" type="button" data-n="${esc(s.n)}">${PIN} Haritada göster</button></div></article>`).join(''):`<div class="empty" style="grid-column:1/-1"><p>${st.q?'“'+esc(st.q)+'” için mağaza bulunamadı':'Bu filtrelerle eşleşen mağaza yok'}</p><button class="btn btn-dark" type="button" id="emptyClear">Filtreleri temizle</button></div>`;
  const rest=list.length-show.length;$('#moreBtn').hidden=rest<=0;$('#moreBtn').textContent=`Daha fazla göster (${rest})`;
  renderSchema();
}
$('#bgrid').addEventListener('click',e=>{
  if(e.target.closest('#emptyClear')){$('#clearBtn').click();return}
  const b=e.target.closest('[data-n]');if(!b)return;
  st.sel=b.dataset.n;render();
  if(innerWidth<=1100)$('#schema').scrollIntoView({behavior:KF.reduce?'auto':'smooth',block:'center'});
});
render();

/* ---------- food ---------- */
const FOODG={'Kahve':['Caffè Nero','Coffee Crafters','Cups and Clouds','Elle Cafe','Espressolab','Starbucks','The Co Coffee Company'],'Sofra':["Happy Moon's",'Kayseri Mutfağı','Pastofino','Green Salads','Quick China'],'Hızlı lezzet':["Arby's",'Burger King','Burger Yiyelim','Dürümle','KFC','Popeyes','Sbarro','Shake Shack','Subway','Tavuk Dünyası','Usta Dönerci','White Burger'],'Tatlı ve fırın':['Marlet Pastaneleri','Michetta']};
const FOODIMG={'Kahve':IMG.barista,'Sofra':IMG.food,'Hızlı lezzet':IMG.food2,'Tatlı ve fırın':IMG.cafe,'Diğer':IMG.cafe};
const fg={};Object.entries(FOODG).forEach(([k,a])=>fg[k]=a.filter(n=>byName[n]));
const known=new Set(Object.values(fg).flat());
const other=stores.filter(s=>s.c.includes('Yeme & İçme')&&!known.has(s.n)).map(s=>s.n);
if(other.length)fg['Diğer']=other;
const fk=Object.keys(fg);
$('#foodPhoto').innerHTML=fk.map((k,i)=>`<img data-k="${i}" class="${i?'':'on'}" src="${U(FOODIMG[k]||IMG.cafe,1000)}" alt="" width="1000" height="1250" loading="lazy" decoding="async" />`).join('');
$('#ftabs').innerHTML=fk.map((k,i)=>`<button class="ftab" role="tab" type="button" data-i="${i}" aria-selected="${i===0}"><b>${k}</b><em>${fg[k].length} mekân</em></button><div class="fpanel${i?'':' on'}" data-i="${i}"><ul>${fg[k].map(n=>`<li>${esc(n)}<span>${esc(KF.floorLabel(byName[n]))}</span></li>`).join('')}</ul></div>`).join('');
$('#ftabs').addEventListener('click',e=>{const b=e.target.closest('.ftab');if(!b)return;const i=b.dataset.i;
  document.querySelectorAll('.ftab').forEach(t=>t.setAttribute('aria-selected',t===b));
  document.querySelectorAll('.fpanel').forEach(p=>p.classList.toggle('on',p.dataset.i===i));
  document.querySelectorAll('#foodPhoto img').forEach(im=>im.classList.toggle('on',im.dataset.k===i));
});
$('#allFood').addEventListener('click',()=>{setCat('Yeme & İçme');setFloor('all');$('#rehber').scrollIntoView({behavior:KF.reduce?'auto':'smooth'})});

/* ---------- culture & life ---------- */
(function(){
  const live=KF.EVENTS.filter(e=>e.type==='event'&&!KF.isPast(e));
  const feat=KF.evById('kitap-fuari');
  const F=feat&&!KF.isPast(feat)?feat:KF.sortEv(live)[0];
  const events=KF.sortEv(live.filter(e=>e!==F));
  const camps=KF.EVENTS.filter(e=>e.type==='campaign'&&e.end&&!KF.isPast(e)).sort((a,b)=>KF.evEnd(a)-KF.evEnd(b));
  const rows=[...events,...camps].slice(0,4);
  const box=$('#cul');
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

/* ---------- visit: map + shuttle ---------- */
$('#gmaps').href=KF.MAPS;$('#amaps').href=KF.APPLE_MAPS;
let sdir='MF';
function shuttle(){
  const now=KF.nowSecs(),nx=KF.nextShuttle(sdir,now),nm=KF.nextShuttle('MF',now);
  $('#tShuttle').textContent=nm?`Sıradaki ${nm.t} (${nm.min} dk sonra)`:`Yarın ${KF.SHUTTLE.MF[0]}`;
  $('#shBadge').textContent=nx?`Sıradaki sefer ${nx.t} · kalkışa ${nx.min} dk`:`Bugünkü seferler bitti · yarın ${KF.SHUTTLE[sdir][0]}`;
  $('#shDot').classList.toggle('off',!nx);
  $('#shTimes').innerHTML=KF.SHUTTLE[sdir].map(t=>`<span class="${nx&&t===nx.t?'next':(KF.secs(t)<=now?'past':'')}">${t}</span>`).join('');
}
document.querySelectorAll('.sw button').forEach(b=>b.addEventListener('click',()=>{sdir=b.dataset.d;document.querySelectorAll('.sw button').forEach(x=>x.setAttribute('aria-pressed',x===b));shuttle()}));
function status(){const s=KF.status();$('#tDot').classList.toggle('off',!s.open);$('#tStatus').textContent=s.text}
document.addEventListener('kf:tick',()=>{status();shuttle()});
status();shuttle();

function buildMap(){
  const el=$('#map'),W=el.clientWidth,H=el.clientHeight;if(!W||!H)return;
  const z=15,n=2**z,{mall,station}=KF.COORD;
  const pr=(lat,lon)=>{const r=lat*Math.PI/180;return[(lon+180)/360*n*256,(1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*n*256]};
  const m=pr(mall.lat,mall.lon),s=pr(station.lat,station.lon);
  const cx=(m[0]+s[0])/2,cy=(m[1]+s[1])/2+(H>600?8:0);
  const x0=Math.floor((cx-W/2)/256),x1=Math.floor((cx+W/2)/256),y0=Math.floor((cy-H/2)/256),y1=Math.floor((cy+H/2)/256);
  let t='';for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)t+=`<img src="https://tile.openstreetmap.org/${z}/${x}/${y}.png" style="left:${x*256-cx}px;top:${y*256-cy}px" alt="" width="256" height="256" decoding="async" />`;
  $('#mapCanvas').innerHTML=t;
  const P=pt=>[W/2+pt[0]-cx,H/2+pt[1]-cy],mp=P(m),sp=P(s);
  $('#mapSvg').setAttribute('viewBox',`0 0 ${W} ${H}`);
  $('#mapSvg').innerHTML=`<line x1="${sp[0]}" y1="${sp[1]}" x2="${mp[0]}" y2="${mp[1]}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9"/><line x1="${sp[0]}" y1="${sp[1]}" x2="${mp[0]}" y2="${mp[1]}" stroke="#1C1F1D" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 9"/>`;
  el.querySelectorAll('.mpin').forEach(x=>x.remove());
  const leaf='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 20 15h-5l5 6H4l5-6H4z"/></svg>';
  const train='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/></svg>';
  const pin=(p,cls,lbl,sub,ic)=>`<div class="mpin ${cls}" style="left:${p[0]}px;top:${p[1]}px"><span class="lbl">${lbl}${sub?`<small>${sub}</small>`:''}</span><span class="pt">${ic}</span></div>`;
  el.insertAdjacentHTML('beforeend',pin(sp,'st','Marmaray Florya','istasyon',train)+pin(mp,'ml','Koru Florya','',leaf));
  const R=6371,dLat=(mall.lat-station.lat)*Math.PI/180,dLon=(mall.lon-station.lon)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(station.lat*Math.PI/180)*Math.cos(mall.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  const km=(2*R*Math.asin(Math.sqrt(a))).toFixed(1).replace('.',',');
  $('#mapLeg').innerHTML=`<span class="dot" style="animation:none"></span>İstasyondan yaklaşık ${km} km · 20 dk yürüyüş`;
}
let rt;buildMap();addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(buildMap,150)});

/* deep link: index.html?magaza=Altınbaş#rehber */
const want=new URLSearchParams(location.search).get('magaza');
if(want&&byName[want]){st.sel=want;st.q='';render();setTimeout(()=>{const el=document.querySelector('.bc.sel');(el||$('#rehber')).scrollIntoView({block:'center'})},400)}
})();
