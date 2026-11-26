/* ヘッダーのナビ：いま読んでいる場所に合わせて、下線が右へ（左へ）動く */
(function () {
  var track = document.querySelector('[data-scrollnav]');
  if (!track) return;
  var head = document.querySelector('.site-head');
  var links = Array.prototype.slice.call(track.querySelectorAll('a[href^="#"]'));
  var bar = track.querySelector('.sn-bar');
  var items = links.map(function (a) { return { a: a, el: document.querySelector(a.getAttribute('href')) }; }).filter(function (i) { return i.el; });
  if (!items.length || !bar) return;
  var current = -2, ticking = false;
  function setHeadH() { document.documentElement.style.setProperty('--head-h', (head.offsetHeight + 4) + 'px'); }
  function place(i) {
    if (i < 0) { bar.style.opacity = '0'; return; }
    var a = items[i].a;
    bar.style.width = a.offsetWidth + 'px';
    bar.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    bar.style.opacity = '1';
    var left = a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }
  function update() {
    ticking = false;
    var line = head.offsetHeight + window.innerHeight * 0.3;
    var idx = -1;
    for (var n = 0; n < items.length; n++) { if (items[n].el.getBoundingClientRect().top <= line) idx = n; }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) idx = items.length - 1;
    if (idx !== current) {
      current = idx;
      items.forEach(function (it, n) { if (n === idx) it.a.setAttribute('aria-current', 'true'); else it.a.removeAttribute('aria-current'); });
      place(idx);
    }
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { setHeadH(); current = -2; update(); });
  setHeadH();
  update();
})();

/* 二十四節気：いまの季節の写真に、節気の名前を小さく添える（日付で自動） */
(function () {
  var S = [[1,6,'小寒',3],[1,20,'大寒',3],[2,4,'立春',0],[2,19,'雨水',0],[3,6,'啓蟄',0],[3,21,'春分',0],[4,5,'清明',0],[4,20,'穀雨',0],[5,6,'立夏',1],[5,21,'小満',1],[6,6,'芒種',1],[6,21,'夏至',1],[7,7,'小暑',1],[7,23,'大暑',1],[8,8,'立秋',2],[8,23,'処暑',2],[9,8,'白露',2],[9,23,'秋分',2],[10,8,'寒露',2],[10,23,'霜降',2],[11,7,'立冬',3],[11,22,'小雪',3],[12,7,'大雪',3],[12,22,'冬至',3]];
  var d = new Date(), md = (d.getMonth() + 1) * 100 + d.getDate(), cur = S[S.length - 1];
  for (var i = 0; i < S.length; i++) { if (md >= S[i][0] * 100 + S[i][1]) cur = S[i]; }
  var tiles = document.querySelectorAll('[data-seasons] .sb-tile'), t = tiles[cur[3]];
  if (!t) return;
  var s = document.createElement('span'); s.className = 'sb-sekki'; s.textContent = cur[2];
  t.appendChild(s);
  t.setAttribute('aria-label', t.getAttribute('aria-label') + '　いまの二十四節気：' + cur[2]);
})();

(function () {
  /* ストーリーボタン：ストーリーの案内が画面に出ている間は隠す */
  var fab = document.querySelector('[data-fab]'), cta = document.getElementById('story-cta');
  if (fab && cta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { fab.classList.toggle('is-off', es[0].isIntersecting); }, { threshold: 0.3 }).observe(cta);
  }
})();

/* トップ写真：自動で入れ替え＋点を押しても切り替え */
(function () {
  var box = document.querySelector('[data-tp]');
  if (!box) return;
  var imgs = box.querySelectorAll('.tp-img'), dots = box.querySelectorAll('.tp-dot');
  if (imgs.length < 2) return;
  var cur = 0, timer = null, WAIT = 6000;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    for (var k = 0; k < imgs.length; k++) {
      imgs[k].classList.toggle('is-off', k !== cur);
      if (dots[k]) dots[k].setAttribute('aria-pressed', k === cur ? 'true' : 'false');
    }
  }
  function start() { if (still) return; stop(); timer = setInterval(function () { show(cur + 1); }, WAIT); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  for (var d = 0; d < dots.length; d++) {
    (function (i) { dots[i].addEventListener('click', function () { show(i); start(); }); })(d);
  }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  imgs[1].loading = 'eager';
  start();
})();
