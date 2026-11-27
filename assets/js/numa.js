/* 和季づき「沼」案：いま何品目かの帯と、二十四節気（今の季節・次の節気） */
(function () {
  function q(sel) { return document.querySelector(sel); }

  /* ---- 何品目か：六つの食卓を見ているあいだだけ、ヘッダーの下に出す ---- */
  var courses = Array.prototype.slice.call(document.querySelectorAll('.n-course'));
  var bar = q('[data-now]'), bNo = q('[data-now-no]'), bName = q('[data-now-name]'), bCount = q('[data-now-count]');
  var head = q('.n-head'), now = -1, ticking = false;
  function update() {
    ticking = false;
    if (!bar || !courses.length) return;
    var line = (head ? head.offsetHeight : 0) + 48, idx = -1;
    for (var i = 0; i < courses.length; i++) { if (courses[i].getBoundingClientRect().top <= line) idx = i; }
    var last = courses[courses.length - 1].getBoundingClientRect();
    var inside = idx >= 0 && last.bottom > line;
    bar.classList.toggle('is-on', inside);
    if (inside && idx !== now) {
      now = idx;
      var c = courses[idx];
      bNo.textContent = c.getAttribute('data-no');
      bName.textContent = c.getAttribute('data-name');
      bCount.textContent = c.getAttribute('data-count');
    }
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---- 二十四節気：今の季節の写真だけ明るく、次の節気の日を添える（日付で自動） ---- */
  var S = [[1,6,'小寒',3],[1,20,'大寒',3],[2,4,'立春',0],[2,19,'雨水',0],[3,6,'啓蟄',0],[3,21,'春分',0],[4,5,'清明',0],[4,20,'穀雨',0],[5,6,'立夏',1],[5,21,'小満',1],[6,6,'芒種',1],[6,21,'夏至',1],[7,7,'小暑',1],[7,23,'大暑',1],[8,8,'立秋',2],[8,23,'処暑',2],[9,8,'白露',2],[9,23,'秋分',2],[10,8,'寒露',2],[10,23,'霜降',2],[11,7,'立冬',3],[11,22,'小雪',3],[12,7,'大雪',3],[12,22,'冬至',3]];
  var d = new Date(), md = (d.getMonth() + 1) * 100 + d.getDate(), cur = S[S.length - 1];
  for (var k = 0; k < S.length; k++) { if (md >= S[k][0] * 100 + S[k][1]) cur = S[k]; }
  var nx = S[(S.indexOf(cur) + 1) % S.length];
  var list = q('[data-seasons]');
  if (list) {
    list.classList.add('has-now');
    Array.prototype.forEach.call(list.querySelectorAll('li'), function (li) {
      if (+li.getAttribute('data-s') === cur[3]) {
        li.classList.add('is-now');
        li.querySelector('span').textContent += '・' + cur[2];
      }
    });
  }
  var line2 = q('[data-next-line]'), nd = q('[data-next]');
  if (line2 && nd) { nd.textContent = nx[2] + '（' + nx[0] + '月' + nx[1] + '日）'; line2.hidden = false; }
})();
