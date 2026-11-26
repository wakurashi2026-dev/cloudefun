/* 和季づき「沼」案：季節で変わる入口と二皿目、いま何皿目かの表示 */
(function () {
  var root = document.documentElement;

  /* ---- 二十四節気：いまの季節を決める（日付で自動） ---- */
  var S = [[1,6,'小寒',3],[1,20,'大寒',3],[2,4,'立春',0],[2,19,'雨水',0],[3,6,'啓蟄',0],[3,21,'春分',0],[4,5,'清明',0],[4,20,'穀雨',0],[5,6,'立夏',1],[5,21,'小満',1],[6,6,'芒種',1],[6,21,'夏至',1],[7,7,'小暑',1],[7,23,'大暑',1],[8,8,'立秋',2],[8,23,'処暑',2],[9,8,'白露',2],[9,23,'秋分',2],[10,8,'寒露',2],[10,23,'霜降',2],[11,7,'立冬',3],[11,22,'小雪',3],[12,7,'大雪',3],[12,22,'冬至',3]];
  var d = new Date(), md = (d.getMonth() + 1) * 100 + d.getDate(), cur = S[S.length - 1];
  for (var i = 0; i < S.length; i++) { if (md >= S[i][0] * 100 + S[i][1]) cur = S[i]; }
  var season = cur[3];

  var SEASON_IMG = [
    ['sb-spring.webp', '春：桜の枝と花びらを添えた、色絵の麻の葉の白い楕円鉢', 1473, 1068],
    ['sb-summer.webp', '夏：青もみじを添えた、山と雁を描いた三日月形の鉢', 1080, 720],
    ['sb-autumn.webp', '秋：南天と銀杏をのせた、金の丸紋をつないだ白い大皿', 1470, 1070],
    ['sb-winter.webp', '冬：湯気の立つ、染付のマグカップ', 1429, 1101]
  ];
  /* 季節ごとに、二皿目で見せる食卓（しつらえ） */
  var FEAT = [
    { k: 'mushiki', no: '其の四', name: '彩づけ鉢とのしつらえ', sub: '身体が喜ぶ季づき', set: '7点セット', prod: 'gallery-04.webp', scene: 'mushiki-moments.webp', alt: 'だしポットme:に削り節を入れる、料理人 野﨑洋光さんの手元',
      text: '旬の野菜を浅く漬けたら、<span class="nw">なにと合わせましょうか。</span><br>出汁をかけて、鍋に添えて、そのままつまんで……。<br>彩りに心はずむ、身体がよろこぶ食卓。' },
    { k: 'sushi', no: '其の五', name: '寿司千代口・オイル千代口とのしつらえ', sub: 'あしらいで愉しむ季づき', set: '5点セット', prod: 'gallery-05.webp', scene: 'sushi-moments.webp', alt: '千代口を手に、季節のあしらいを箸でつまむ料理人 野﨑洋光さん',
      text: '丘と海のある、小さな千代口。<span class="nw">なにをのせましょうか。</span><br>柚子胡椒、塩とオリーブオイル、いつもの醤油……。<br>ひと皿のわきで迷う、遊びごころの食卓。' },
    { k: 'dashi', no: '其の一', name: 'だしポットme:とのしつらえ', sub: '出汁で愉しむ季づき', set: '4点セット', prod: 'gallery-01.webp', scene: 'dashi-moments.webp', alt: 'だしポットme:から出汁を注ぐ、料理人 野﨑洋光さん',
      text: '出汁がとれるのを待つあいだ、<span class="nw">今日はなににしましょうか。</span><br>お吸い物、温かいおひたし、出汁茶漬け……。<br>出汁を囲んで迷う、ちいさな贅沢の食卓。' },
    null /* 冬はHTMLに書いてあるもの（其の三 なんでん鍋）をそのまま使う */
  ];
  var NEXT = [['立春', 2, 4], ['立夏', 5, 6], ['立秋', 8, 8], ['立冬', 11, 7]];

  function q(sel) { return document.querySelector(sel); }
  var img = q('[data-season-img]');
  if (img) { var si = SEASON_IMG[season]; img.src = 'assets/img/' + si[0]; img.alt = si[1]; img.width = si[2]; img.height = si[3]; }
  var sk = q('[data-sekki]'); if (sk) sk.textContent = cur[2];
  var sd = q('[data-sekki-date]'); if (sd) sd.textContent = cur[0] + '月' + cur[1] + '日から';
  var f = FEAT[season];
  if (f) {
    q('[data-feat-sub]').textContent = f.sub;
    var a = q('[data-feat-scene]'); a.src = 'assets/img/' + f.scene; a.alt = f.alt;
    var b = q('[data-feat-prod]'); b.src = 'assets/img/' + f.prod; b.alt = f.name;
    q('[data-feat-text]').innerHTML = f.text;
    q('[data-feat-no]').textContent = f.no;
    q('[data-feat-name]').textContent = f.name;
    q('[data-feat-set]').textContent = f.set + '　11,000円（税込）';
    q('[data-feat-href]').href = 'gallery/' + f.k + '/index.html';
  }
  var nx = NEXT[(season + 1) % 4], nd = q('[data-next]');
  if (nd) nd.textContent = nx[0] + '（' + nx[1] + '月' + nx[2] + '日）';
  document.querySelectorAll('[data-seasons] li').forEach(function (li) {
    li.classList.toggle('is-now', +li.getAttribute('data-s') === season);
    if (+li.getAttribute('data-s') === season) li.querySelector('span').textContent = ['春', '夏', '秋', '冬'][season] + '・' + cur[2];
  });

  /* ---- いま何皿目か（スマホは上の帯、PCは左の献立） ---- */
  var KAN = '一二三四五六七八';
  var courses = Array.prototype.slice.call(document.querySelectorAll('[data-course]'));
  var names = Array.prototype.map.call(document.querySelectorAll('.n-menu-name'), function (n) { return n.textContent; });
  var barNo = q('[data-bar-no]'), barName = q('[data-bar-name]');
  var ticks = document.querySelectorAll('.n-bar-ticks li');
  var menuLinks = document.querySelectorAll('.n-menu a');
  var now = -1, ticking = false;


  function headH() { var h = q('.n-head'); return h ? h.offsetHeight : 0; }
  function update() {
    ticking = false;
    var line = headH() + window.innerHeight * 0.35, idx = 0;
    for (var n = 0; n < courses.length; n++) { if (courses[n].getBoundingClientRect().top <= line) idx = n; }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) idx = courses.length - 1;
    if (idx !== now) {
      now = idx;
      if (barNo) barNo.textContent = KAN[idx] + '皿目';
      if (barName) barName.textContent = names[idx] || '';
      Array.prototype.forEach.call(ticks, function (t, n) { t.className = n < idx ? 'is-done' : (n === idx ? 'is-now' : ''); });
      Array.prototype.forEach.call(menuLinks, function (a, n) { if (n === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }
    var c2 = courses[1];
    document.body.classList.toggle('at-top', !c2 || c2.getBoundingClientRect().top > window.innerHeight * 0.6);
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
