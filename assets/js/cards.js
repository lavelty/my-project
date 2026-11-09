/* Event card renderer shared by the events list and the detail page */
(function(){
const {esc,IC}=KF;
KF.cardHtml=function(e){
  const past=KF.isPast(e),a=e.start?KF.evStart(e):null;
  const badge=e.type==='campaign'?(e.badge?`<div class="ebadge">${esc(e.badge)}</div>`:''):(a?`<div class="edate"><b>${a.getDate()}</b><small>${KF.MONTHS[a.getMonth()].slice(0,3)}</small></div>`:'');
  const tags=[];
  if(e.type==='event'&&e.free)tags.push('<span class="tag">Ücretsiz</span>');
  if(e.type==='event'&&e.audience)tags.push(`<span class="tag g">${esc(e.audience)}</span>`);
  if(e.type==='campaign')tags.push(`<span class="tag ${e.badge?'o':'y'}">${esc(e.kicker||'Kampanya')}</span>`);
  if(past)tags.push('<span class="tag g">Sona erdi</span>');
  const dt=KF.dateText(e);
  const meta=[dt?`<div>${IC.cal}<span>${esc(dt)}</span></div>`:'',e.time?`<div>${IC.clock}<span>${esc(e.time)}</span></div>`:'',`<div>${IC.pin}<span>${esc(e.venue?e.venue+', ':'')}${esc(e.place||'')}</span></div>`].join('');
  return `<a class="ecard${past?' past':''}" href="etkinlik.html?e=${e.id}"><div class="eimg"><img src="assets/events/${e.img}" alt="" width="1920" height="1080" loading="lazy" decoding="async" />${badge}</div><div class="ebody"><div class="etags">${tags.join('')}</div><h3>${esc(e.title)}</h3><p>${esc(e.short)}</p><div class="emeta">${meta}</div><span class="btn btn-dark btn-sm" style="align-self:flex-start;margin-top:8px">Detaylar ${IC.arr}</span></div></a>`;
};
})();
