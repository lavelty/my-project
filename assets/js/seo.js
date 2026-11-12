/* Runtime SEO for pages whose content is picked by the URL (store and event pages). */
(function(){
const SITE='https://lavelty.github.io/my-project/';
function ld(obj){
  const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(obj);document.head.appendChild(s);
}
function meta(sel,attr,val){const el=document.querySelector(sel);if(el)el.setAttribute(attr,val)}
function page(title,desc,url,image){
  meta('link[rel=canonical]','href',url);
  meta('meta[property="og:title"]','content',title);meta('meta[name="twitter:title"]','content',title);
  meta('meta[property="og:description"]','content',desc);meta('meta[name="twitter:description"]','content',desc);
  meta('meta[property="og:url"]','content',url);
  if(image){meta('meta[property="og:image"]','content',image);meta('meta[name="twitter:image"]','content',image)}
}
const place={'@type':'Place',name:'Koru Florya',address:{'@type':'PostalAddress',streetAddress:'Şenlikköy Mahallesi, Ekşinar Sokak No: 46/1',addressLocality:'Bakırköy',addressRegion:'İstanbul',postalCode:'34153',addressCountry:'TR'}};
const iso=(d,allDay)=>{const p=n=>String(n).padStart(2,'0');const day=`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;return allDay?day:`${day}T${p(d.getHours())}:${p(d.getMinutes())}:00+03:00`};
window.KFSeo={
  event(e){
    const url=SITE+'etkinlik.html?e='+e.id,img=SITE+'assets/events/'+e.img;
    page(e.title+' | Koru Florya',e.short,url,img);
    if(e.type!=='event'||!e.start)return;
    const allDay=e.allDay||!e.start.includes('T');
    ld({'@context':'https://schema.org','@type':'Event',name:e.title,description:e.short,image:[img],
      startDate:iso(KF.evStart(e),allDay),endDate:iso(KF.evEnd(e),allDay),
      eventStatus:'https://schema.org/EventScheduled',eventAttendanceMode:'https://schema.org/OfflineEventAttendanceMode',
      isAccessibleForFree:!!e.free,location:Object.assign({},place,{name:'Koru Florya, '+(e.place||'')}),
      organizer:{'@type':'Organization',name:'Koru Florya',url:SITE}});
  },
  store(s){
    const url=SITE+'magaza.html?s='+s.slug,desc=`${s.n}, ${KF.floorShort(s)}. ${s.c.join(', ')}. Koru Florya her gün 10:00 - 22:00 açıktır.`;
    page(s.n+' | Koru Florya',desc,url,s.l?SITE+'assets/brands/'+s.l:null);
    ld({'@context':'https://schema.org','@type':'Store',name:s.n,url,
      image:s.l?SITE+'assets/brands/'+s.l:undefined,
      address:place.address,
      containedInPlace:{'@type':'ShoppingCenter',name:'Koru Florya',url:SITE}});
  }
};
})();
