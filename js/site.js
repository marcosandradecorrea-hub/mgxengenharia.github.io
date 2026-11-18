/* MGX Engenharia: scripts compartilhados (lightbox, menu, e-mail, animação). */
/* ---- Lightbox ---- */
(function(){
  const thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-src]'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  if(!thumbs.length || !lightbox) return;

  let idx = 0;
  const items = thumbs.map(t => ({ src: t.dataset.src, alt: t.dataset.alt || 'Imagem' }));

  function openAt(i){
    idx = (i + items.length) % items.length;
    lbImg.src = items[idx].src;
    lbImg.alt = items[idx].alt;
    lbCaption.textContent = (idx+1) + ' / ' + items.length + ' — ' + items[idx].alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function close(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    lbImg.src = '';
  }
  thumbs.forEach((t,i) => t.addEventListener('click', () => openAt(i)));
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', e => { e.stopPropagation(); openAt(idx-1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); openAt(idx+1); });
  lightbox.addEventListener('click', e => { if(e.target === lightbox) close(); });
  window.addEventListener('keydown', e => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') openAt(idx-1);
    if(e.key === 'ArrowRight') openAt(idx+1);
  });
})();

/* ---- Menu mobile ---- */
function toggleMenu(){
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('navMobile');
  btn.classList.toggle('open');
  nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', btn.classList.contains('open') ? 'true' : 'false');
}
function closeMenu(){
  const btn = document.getElementById('menuToggle');
  document.getElementById('navMobile').classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded','false');
}
document.addEventListener('click', function(e){
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('navMobile');
  if(!btn.contains(e.target) && !nav.contains(e.target)) closeMenu();
});

/* ---- E-mail montado no cliente (evita coleta automática por robôs de spam) ---- */
(function(){
  const addr = 'contato' + '@' + 'mgxengenhariasi.com.br';
  document.querySelectorAll('.js-mail').forEach(function(a){ a.href = 'mailto:' + addr; });
  document.querySelectorAll('.js-mail-txt').forEach(function(t){ t.textContent = addr; });
})();

var anoEl=document.getElementById('ano'); if(anoEl) anoEl.textContent = new Date().getFullYear();

/* ---- Animação de entrada ---- */
(function(){
  const els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  window.__revealReady = true;

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    els.forEach(el => el.classList.add('in'));
    return;
  }
  els.forEach((el,i) => { el.style.transitionDelay = Math.min(i % 6, 5) * 50 + 'ms'; });

  // Revela tudo que já passou da borda inferior da tela. Uma varredura (em vez de
  // IntersectionObserver) garante que nada fique invisível quando a página pula
  // direto para uma âncora — nesse caso as seções acima nunca "entram" na tela.
  let pending = [].concat(els), queued = false;
  function sweep(){
    queued = false;
    const limit = window.innerHeight * 0.94;
    pending = pending.filter(el => {
      if(el.getBoundingClientRect().top < limit){ el.classList.add('in'); return false; }
      return true;
    });
    if(!pending.length){
      window.removeEventListener('scroll', onChange);
      window.removeEventListener('resize', onChange);
    }
  }
  function onChange(){ if(!queued){ queued = true; requestAnimationFrame(sweep); } }
  window.addEventListener('scroll', onChange, { passive:true });
  window.addEventListener('resize', onChange);
  window.addEventListener('load', onChange);
  sweep();
})();
