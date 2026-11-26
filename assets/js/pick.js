/* 紹介ページ：写真の番号を押すと、下にうつわの説明が浮かび上がる */
(function () {
  document.querySelectorAll('[data-pick]').forEach(function (root) {
    var dots = root.querySelectorAll('.pk-dot');
    var panels = root.querySelectorAll('.pd');
    var marks = root.querySelectorAll('.pk-m, .pk-r');
    function show(i) {
      i = String(i);
      dots.forEach(function (d) { d.setAttribute('aria-pressed', d.getAttribute('data-i') === i ? 'true' : 'false'); });
      marks.forEach(function (m) { m.classList.toggle('on', m.getAttribute('data-i') === i); });
      panels.forEach(function (p) {
        var on = p.getAttribute('data-i') === i;
        p.hidden = !on;
        if (on) { p.classList.remove('pd-in'); void p.offsetWidth; p.classList.add('pd-in'); }
      });
    }
    dots.forEach(function (d) { d.addEventListener('click', function () { show(d.getAttribute('data-i')); }); });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-go]');
      if (b) { show(b.getAttribute('data-go')); }
    });
    root.classList.add('is-ready');
    show(0);
  });
})();
