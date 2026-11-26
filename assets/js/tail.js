/* 段落の最後の数文字をひとまとめにして、最後の行に1〜2文字だけ残るのを防ぐ（文字は変えない） */
(function () {
  var NG = /[ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮー、。，．・：；！？）」』】］〕〉》”’　 ]/;
  var OPEN = /[（「『【［〔〈《“‘]/;
  var els = document.querySelectorAll('main p, main li, main dd, main h2, main h3, footer p');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    if (el.querySelector('p, li, div, dl, ul, img, br') || el.textContent.trim().length < 12) continue;
    if (getComputedStyle(el).writingMode.indexOf('vertical') === 0) continue;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, last = null;
    while ((n = w.nextNode())) { if (n.textContent.trim()) last = n; }
    if (!last || (last.parentNode.closest && last.parentNode.closest('.nw, .nb, a, b, button'))) continue;
    var t = last.textContent.replace(/\s+$/, ''), k = 4;
    while (k < 8 && k < t.length && (NG.test(t.charAt(t.length - k)) || OPEN.test(t.charAt(t.length - k - 1)))) k++;
    if (t.length <= k + 2) continue;
    var s = document.createElement('span'); s.className = 'nw'; s.textContent = t.slice(-k);
    last.textContent = t.slice(0, -k); last.parentNode.insertBefore(s, last.nextSibling);
  }
})();
