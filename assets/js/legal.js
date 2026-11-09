/* Legal reader: highlight the current section in the table of contents */
(function(){
const links=[...document.querySelectorAll('.toc a')];
if(!links.length||!('IntersectionObserver' in window))return;
const map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.remove('on'));const a=map.get(e.target.id);if(a)a.classList.add('on')}});
},{rootMargin:'-96px 0px -70% 0px',threshold:0});
document.querySelectorAll('.doc h2[id]').forEach(h=>io.observe(h));
})();
