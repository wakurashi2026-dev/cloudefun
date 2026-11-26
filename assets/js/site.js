(function () {
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var track = root.querySelector('.slides');
    var slides = Array.prototype.slice.call(track.children);
    var ctl = root.querySelector('.slider-ctl');
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var cur = root.querySelector('[data-cur]');
    var dots = root.querySelector('[data-dots]');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var idx = 0;
    ctl.hidden = false;
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', (i + 1) + '枚目へ');
      b.addEventListener('click', function () { go(i); });
      dots.appendChild(b);
    });
    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
    }
    function update() {
      idx = Math.round(track.scrollLeft / track.clientWidth);
      idx = Math.max(0, Math.min(slides.length - 1, idx));
      cur.textContent = idx + 1;
      prev.disabled = idx === 0;
      next.disabled = idx === slides.length - 1;
      Array.prototype.forEach.call(dots.children, function (d, i) {
        if (i === idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
    });
    window.addEventListener('resize', function () { track.scrollTo({ left: slides[idx].offsetLeft, behavior: 'auto' }); });
    update();
  });
})();

/* トップの写真：2枚がゆっくり入れ替わる */
(function () {
  document.querySelectorAll('[data-fader]').forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.fader-slide'));
    var dots = root.querySelector('[data-fader-dots]');
    if (slides.length < 2 || !dots) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var idx = 0, timer = null;
    dots.hidden = false;
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', slides[i].getAttribute('aria-label') + 'を表示');
      b.addEventListener('click', function () { show(i); play(); });
      dots.appendChild(b);
    });
    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle('is-active', n === idx);
        if (n === idx) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
      Array.prototype.forEach.call(dots.children, function (d, n) {
        if (n === idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function play() { stop(); if (!reduce && !document.hidden) timer = setInterval(function () { show(idx + 1); }, 6500); }
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });
    /* 白黒 ⇔ フルカラーの切り替えボタン（スマホでは写真のタップも同じ動き） */
    var tg = document.createElement('button');
    tg.type = 'button';
    tg.className = 'fader-toggle';
    tg.setAttribute('aria-pressed', 'false');
    tg.setAttribute('aria-label', 'フルカラーで見る');
    tg.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 2a8 8 0 0 1 0 16z" fill="currentColor"/></svg>';
    function setColor(on) {
      root.classList.toggle('is-pinned', on);
      tg.setAttribute('aria-pressed', on ? 'true' : 'false');
      tg.setAttribute('aria-label', on ? '白黒にもどす' : 'フルカラーで見る');
    }
    tg.addEventListener('click', function (e) { e.stopPropagation(); setColor(!root.classList.contains('is-pinned')); });
    root.appendChild(tg);
    var touchOnly = window.matchMedia && window.matchMedia('(hover: none)').matches;
    if (touchOnly) {
      root.querySelector('.fader-stage').addEventListener('click', function () { setColor(!root.classList.contains('is-pinned')); });
    }
    show(0);
    play();
  });
})();

/* ストーリー導入：画面に入ったら、ひとことずつゆっくり現れる */
(function () {
  var el = document.querySelector('.story-lead');
  if (!el || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  Array.prototype.forEach.call(el.querySelectorAll('.nb'), function (n, i) { n.style.transitionDelay = (i * 0.22) + 's'; });
  el.classList.add('js-reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } });
  }, { threshold: 0.3 });
  io.observe(el);
})();
