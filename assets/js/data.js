/* Shared data and helpers. Store list: assets/js/stores.js (from koruflorya.com) */
(function(){
const KF=window.KF={};
const pad=n=>String(n).padStart(2,'0');
KF.pad=pad;
KF.DAYS=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
KF.MONTHS=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
KF.ist=()=>new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Istanbul'}));
KF.esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
KF.low=s=>s.toLocaleLowerCase('tr');
KF.reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
KF.MAPS_Q='Koru Florya Alışveriş ve Yaşam Merkezi, Ekşinar Sokak No:46/1, Şenlikköy, Bakırköy, İstanbul';
KF.MAPS='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(KF.MAPS_Q);
KF.APPLE_MAPS='https://maps.apple.com/?q='+encodeURIComponent('Koru Florya')+'&ll=40.9842677,28.7834510';
KF.GOOGLE_PLACE='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(KF.MAPS_Q);
KF.COORD={mall:{lat:40.9842677,lon:28.7834510},station:{lat:40.9728979,lon:28.7876092}};

/* floors: K ground, P first, C second, O parking */
KF.FL={
  K:{lv:'0',n:'Koru Katı',sub:'Giriş',d:'Ana giriş, danışma, bankalar ve hızlı erişimli mağazalar'},
  P:{lv:'1',n:'Podyum Katı',sub:'1. Kat',d:'Moda ve giyim katı; kadın, erkek ve aksesuar markaları'},
  C:{lv:'2',n:'Cadde Katı',sub:'2. Kat',d:'Restoranlar, kafeler ve teknoloji markaları'},
  O:{lv:'-1',n:'Otopark Katı',sub:'-1',d:'Kapalı otopark ve hizmetler'}
};
KF.FORDER=['K','P','C','O'];
KF.CATS=['Moda & Giyim','Yeme & İçme','Kozmetik & Bakım','Saat & Mücevher','Teknoloji','Çocuk','Ev & Yaşam','Spor & Outdoor','Aksesuar & Takı','Hizmet & Banka','Sağlık & Optik','Market & Gıda','Kırtasiye & Kitap'];

/* stores */
KF.stores=(window.KF_STORES||[]).map(s=>Object.assign({},s,{fl:s.f==='PC'?['P','C']:[s.f]})).sort((a,b)=>a.n.localeCompare(b.n,'tr'));
KF.byName=Object.fromEntries(KF.stores.map(s=>[s.n,s]));
KF.floorLabel=s=>s.fl.map(k=>KF.FL[k].n).join(' ve ');
KF.floorShort=s=>s.fl.map(k=>KF.FL[k].n+' · '+KF.FL[k].sub).join(', ');
KF.initials=n=>{const w=n.replace(/[^\p{L}\p{N} ]/gu,'').split(' ').filter(Boolean);return(w.length>1?w[0][0]+w[1][0]:w[0].slice(0,2)).toLocaleUpperCase('tr')};
KF.logoHtml=s=>s.l?`<img src="assets/brands/${s.l}" alt="" loading="lazy" decoding="async" />`:`<i>${KF.esc(KF.initials(s.n))}</i>`;

/* store slugs and floor pages */
KF.slugify=n=>n.toLocaleLowerCase('tr').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c').replace(/['’]/g,'-').replace(/&/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
KF.stores.forEach(s=>{s.slug=KF.slugify(s.n)});
KF.bySlug=Object.fromEntries(KF.stores.map(s=>[s.slug,s]));
KF.storeUrl=s=>'magaza.html?s='+s.slug;
KF.catUrl=c=>'index.html?kategori='+encodeURIComponent(c)+'#rehber';
KF.floorUrl=(f,s)=>'kat-planlari.html?kat='+({K:0,P:1,C:2,O:-1}[f])+(s?'&magaza='+s.slug:'');
KF.floorFromParam=v=>({'0':'K','1':'P','2':'C','-1':'O'}[v]||null);
KF.FLOOR_INFO={
  K:{services:['Danışma','Bankalar & ATM','Kayıp eşya']},
  P:{services:['Moda & Giyim','Kozmetik & Bakım','Bebek bakım odası']},
  C:{services:['Restoranlar','Kafeler','Teknoloji']},
  O:{services:[]}
};
/* Real plan drawings: KF.PLAN_FILES.K='assets/plans/koru-kati.svg' (units carry data-store="slug") */
KF.PLAN_FILES={};
KF.storeDirections=s=>'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(KF.MAPS_Q+' '+s.n);

/* free shuttle timetable, from the official "Ücretsiz Servis Saatleri" visual */
KF.SHUTTLE={
  MF:['10:30','11:00','11:30','12:00','12:30','13:00','13:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'],
  KF:['11:00','11:30','12:00','12:30','13:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30']
};
KF.secs=t=>{const[h,m]=t.split(':').map(Number);return h*3600+m*60};
KF.nowSecs=()=>{const d=KF.ist();return d.getHours()*3600+d.getMinutes()*60+d.getSeconds()};
KF.nextShuttle=(dir,now=KF.nowSecs())=>{const t=KF.SHUTTLE[dir].find(x=>KF.secs(x)>now);return t?{t,min:Math.ceil((KF.secs(t)-now)/60)}:null};
KF.status=()=>{const d=KF.ist(),h=d.getHours()+d.getMinutes()/60,open=h>=10&&h<22;return{open,text:open?'Açık · 22:00\'ye kadar':(h<10?'Kapalı · 10:00\'da açılır':'Kapalı · Yarın 10:00')}};

/* events and campaigns. Dates are Istanbul local time. Source: koruflorya.com */
KF.EVENTS=[
  {id:'kitap-fuari',type:'event',title:'Kitap Fuarı KoruFlorya’da',kicker:'Kültür · Sanat',short:'4–22 Kasım tarihleri arasında kitapseverleri KoruFlorya’ya bekliyoruz.',
   about:['Kitap Fuarı boyunca pek çok yayınevinin kitapları KoruFlorya’da.','Fuar kapsamında 8 Kasım’da Ahmet Ümit, 15 Kasım’da Celal Şengör imza günleriyle okurlarıyla buluşuyor.'],
   start:'2026-11-04',end:'2026-11-22',allDay:true,time:'AVM açılış saatleri içinde',venue:'KoruFlorya',place:'Koru Katı (Giriş Kat)',audience:'Herkese açık',free:true,img:'hero-kitap-fuari.jpg',
   schedule:[{t:'4 Kasım',d:'Kitap Fuarı başlıyor',hot:true},{t:'8 Kasım',d:'Ahmet Ümit imza günü'},{t:'15 Kasım, 14.00',d:'Celal Şengör imza günü',hot:true},{t:'22 Kasım',d:'Fuarın son günü'}],
   related:['celal-sengor-imza-gunu','ahmet-umit-imza-gunu']},
  {id:'celal-sengor-imza-gunu',type:'event',title:'Celal Şengör İmza Günü',kicker:'İmza günü',short:'Prof. Dr. Celal Şengör, KoruFlorya Kitap Fuarı’nda okurlarıyla buluşuyor.',
   about:['Celal Şengör, Kitap Fuarı kapsamında kitaplarını imzalayacak ve okurlarıyla bir araya gelecek.'],
   start:'2026-11-15T14:00',end:'2026-11-15T15:00',time:'14.00',venue:'Kitap Fuarı alanı',place:'Koru Katı (Giriş Kat)',audience:'Herkese açık',free:true,img:'hero-celal-sengor.jpg',
   who:{name:'Prof. Dr. Celal Şengör',bio:'Jeolog ve İstanbul Teknik Üniversitesi öğretim üyesi. Tektonik ve Türkiye jeolojisi üzerine çalışmalarıyla, bilim ve düşünce alanındaki kitaplarıyla geniş bir okur kitlesine ulaşıyor.'},
   schedule:[{t:'14.00',d:'Celal Şengör, Kitap Fuarı alanında okurlarıyla buluşuyor ve kitaplarını imzalıyor',hot:true}],
   related:['kitap-fuari','ahmet-umit-imza-gunu']},
  {id:'ahmet-umit-imza-gunu',type:'event',title:'Ahmet Ümit İmza Günü',kicker:'İmza günü',short:'Kitap Fuarı kapsamında okurlarıyla buluştu.',
   about:['Kitap Fuarı kapsamında 8 Kasım’da düzenlenen imza günü.'],
   start:'2026-11-08',end:'2026-11-08',allDay:true,time:null,venue:'Kitap Fuarı',place:'Koru Katı (Giriş Kat)',audience:'Herkese açık',free:true,img:'hero-kitap-fuari.jpg',
   who:{name:'Ahmet Ümit',bio:'Polisiye romanlarıyla tanınan yazar.'},
   schedule:[{t:'8 Kasım',d:'Ahmet Ümit, Kitap Fuarı kapsamında okurlarıyla buluştu'}],
   related:['kitap-fuari','celal-sengor-imza-gunu']},
  {id:'altinbas-halk-gunleri',type:'campaign',title:'Altınbaş Halk Günleri',kicker:'Kampanya',short:'Seçili pırlanta ürünlerinde %50’ye varan indirim',
   about:['Seçili pırlanta ürünlerinde %50’ye varan indirim. Kaçırılmayacak fırsatlar.'],start:'2026-11-01',end:'2026-11-11',allDay:true,store:'Altınbaş',place:'Podyum Katı (1. Kat)',img:'hero-altinbas-halk-gunleri.jpg',badge:'%50’ye varan'},
  {id:'pierre-cardin-sale',type:'campaign',title:'The Cardin Sale',kicker:'Kampanya',short:'Pierre Cardin’de ikonik Kasım indirimi, net %50',
   about:['Pierre Cardin The Cardin Sale: İkonik Kasım indirimi, net %50 indirim.','Smokin, aksesuar ve basic ürün grupları kampanyaya dahil değildir.'],start:'2026-11-05',end:'2026-12-01',allDay:true,store:'Pierre Cardin',place:'Podyum Katı (1. Kat)',img:'hero-pierre-cardin.jpg',badge:'Net %50'},
  {id:'dry-clean-express',type:'campaign',title:'Dry Clean Express açıldı',kicker:'Yeni mağaza',short:'Açılışa özel %20 indirim, organik kuru temizleme',
   about:['Açılışa özel %20 indirim.','Organik kuru temizleme: kokusuz, kimyasal içermez, hassas ciltlere özel.','Konum: -1 Otopark çıkışı, MediaMarkt alt katı. Telefon: 0554 585 10 37, 0212 424 10 37.'],start:null,end:null,store:'Dry Clean Express',place:'-1 Otopark Katı',img:'hero-dry-clean-express.jpg',badge:'%20'},
  {id:'happy-moons',type:'campaign',title:'Happy Moon’s',kicker:'Mekân',short:'Koccaman lezzetler sizi bekliyor',about:['Koccaman lezzetler sizi bekliyor.'],start:null,end:null,store:"Happy Moon's",place:'Cadde Katı (2. Kat)',img:'hero-happy-moons.jpg'},
  {id:'shake-shack',type:'campaign',title:'Shake Shack',kicker:'Mekân',short:'KoruFlorya’da buluşmanın tadı başka',about:['KoruFlorya’da buluşmanın tadı başka.'],start:null,end:null,store:'Shake Shack',place:'Koru Katı (Giriş Kat)',img:'hero-shake-shack.jpg'}
];
KF.evById=id=>KF.EVENTS.find(e=>e.id===id);
KF.P=s=>{if(!s)return null;const[a,b]=s.split('T');const[y,m,d]=a.split('-').map(Number);const[hh,mm]=(b||'00:00').split(':').map(Number);return new Date(y,m-1,d,hh,mm)};
KF.startOfDay=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate());
KF.evStart=e=>{const x=KF.P(e.start);return e.allDay||!e.start.includes('T')?KF.startOfDay(x):x};
KF.evEnd=e=>{const k=e.end||e.start,x=KF.P(k);return e.allDay||!k.includes('T')?new Date(x.getFullYear(),x.getMonth(),x.getDate(),23,59,59):x};
KF.isPast=e=>!!e.start&&KF.evEnd(e)<KF.ist();
KF.isLive=e=>{if(!e.start)return false;const n=KF.ist();return KF.evStart(e)<=n&&KF.evEnd(e)>=n};
KF.fmtDay=d=>`${d.getDate()} ${KF.MONTHS[d.getMonth()]}`;
KF.dateText=e=>{if(!e.start)return null;const a=KF.evStart(e),b=KF.evEnd(e);return a.toDateString()===b.toDateString()?`${KF.fmtDay(a)} ${a.getFullYear()}, ${KF.DAYS[a.getDay()]}`:`${KF.fmtDay(a)} – ${KF.fmtDay(b)} ${b.getFullYear()}`};
KF.dateShort=e=>{if(!e.start)return'';const a=KF.evStart(e),b=KF.evEnd(e);return a.toDateString()===b.toDateString()?`${a.getDate()} ${KF.MONTHS[a.getMonth()]}`:`${a.getDate()}–${b.getDate()} ${KF.MONTHS[b.getMonth()]}`};
KF.sortEv=list=>list.slice().sort((a,b)=>(a.start?KF.evStart(a):new Date(8.64e15))-(b.start?KF.evStart(b):new Date(8.64e15)));
KF.weekBounds=()=>{const n=KF.startOfDay(KF.ist());const dow=(n.getDay()+6)%7;const a=new Date(n);a.setDate(n.getDate()-dow);const b=new Date(a);b.setDate(a.getDate()+6);b.setHours(23,59,59);return[a,b]};
KF.monthBounds=()=>{const n=KF.startOfDay(KF.ist());return[new Date(n.getFullYear(),n.getMonth(),1),new Date(n.getFullYear(),n.getMonth()+1,0,23,59,59)]};
KF.overlaps=(e,a,b)=>KF.evStart(e)<=b&&KF.evEnd(e)>=a;
KF.TABS=[
  ['upcoming','Yaklaşan',()=>KF.EVENTS.filter(e=>e.type==='event'&&!KF.isPast(e))],
  ['week','Bu hafta',()=>{const[a,b]=KF.weekBounds();return KF.EVENTS.filter(e=>e.type==='event'&&!KF.isPast(e)&&KF.overlaps(e,a,b))}],
  ['month','Bu ay',()=>{const[a,b]=KF.monthBounds();return KF.EVENTS.filter(e=>e.type==='event'&&!KF.isPast(e)&&KF.overlaps(e,a,b))}],
  ['past','Geçmiş',()=>KF.EVENTS.filter(e=>e.type==='event'&&KF.isPast(e))],
  ['campaigns','Kampanyalar',()=>KF.EVENTS.filter(e=>e.type==='campaign'&&!KF.isPast(e))]
];

/* calendar links */
const ymd=d=>`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
const ymdhms=d=>`${ymd(d)}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
KF.calLinks=e=>{
  if(!e.start)return null;
  const a=KF.evStart(e),b=KF.evEnd(e),allDay=e.allDay||!e.start.includes('T');
  const loc=`Koru Florya Alışveriş ve Yaşam Merkezi, ${e.place||''}, Ekşinar Sokak No: 46/1, Şenlikköy, Bakırköy, İstanbul`;
  const det=[e.short,e.venue?`Mekân: ${e.venue}`:''].filter(Boolean).join('\n');
  let g,os,oe,s1,s2;
  if(allDay){const n=new Date(b.getFullYear(),b.getMonth(),b.getDate()+1);g=`${ymd(a)}/${ymd(n)}`;os=iso(a).slice(0,10);oe=iso(n).slice(0,10);s1=`DTSTART;VALUE=DATE:${ymd(a)}`;s2=`DTEND;VALUE=DATE:${ymd(n)}`}
  else{g=`${ymdhms(a)}/${ymdhms(b)}`;os=iso(a);oe=iso(b);s1=`DTSTART;TZID=Europe/Istanbul:${ymdhms(a)}`;s2=`DTEND;TZID=Europe/Istanbul:${ymdhms(b)}`}
  const q=encodeURIComponent;
  const ie=s=>s.replace(/[\\,;]/g,m=>'\\'+m).replace(/\n/g,'\\n');
  return{
    google:`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${q(e.title)}&dates=${g}&ctz=Europe/Istanbul&details=${q(det)}&location=${q(loc)}`,
    outlook:`https://outlook.live.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&subject=${q(e.title)}&startdt=${q(os)}&enddt=${q(oe)}${allDay?'&allday=true':''}&location=${q(loc)}&body=${q(det)}`,
    ics:'data:text/calendar;charset=utf-8,'+q(['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Koru Florya//TR','BEGIN:VEVENT',`UID:${e.id}@koruflorya`,`DTSTAMP:${ymdhms(new Date())}Z`,s1,s2,`SUMMARY:${ie(e.title)}`,`DESCRIPTION:${ie(det)}`,`LOCATION:${ie(loc)}`,'END:VEVENT','END:VCALENDAR'].join('\r\n'))
  };
};
KF.IC={
  cal:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  clock:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  pin:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  arr:'<svg class="arr" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  back:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  bus:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 12h16M8 21l-1-4M16 21l1-4"/></svg>'
};
})();
