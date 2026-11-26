/* ページ間のナビ：いまのページが見える位置までスクロールしておく */
(function () {
  var t = document.querySelector('[data-pagenav]'); if (!t) return;
  var a = t.querySelector('a[aria-current="page"]'); if (!a) return;
  t.scrollLeft = Math.max(0, a.offsetLeft - (t.clientWidth - a.offsetWidth) / 2);
})();
