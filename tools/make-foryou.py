#!/usr/bin/env python3
"""「お手元に届いた方へ」用の、価格なしのページを作り直す。

gallery/<しつらえ>/ と、その making/ を元に、foryou/<しつらえ>/ を自動で作る。
元のページを直したら、必ずこれを回す：  python3 tools/make-foryou.py
foryou/<しつらえ>/ 以下は手で直さない（次に回したときに上書きされる）。
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SETS = ['dashi', 'takujo', 'nabe', 'mushiki', 'sushi', 'mukozuke']
SETS_RE = '|'.join(SETS)

def convert(h):
    # しつらえ同士のリンクは、価格なしのページ同士でつなぐ
    h = re.sub(r'(href="(?:\.\./)*)gallery/(%s)/' % SETS_RE, r'\1foryou/\2/', h)
    # 単品・ショップへの案内を外す
    h = re.sub(r'<li><a href="[^"]*tanpin/index\.html">単品販売</a></li>', '', h)
    h = re.sub(r'\s*<a class="head-shop"[^>]*>.*?</a>', '', h, flags=re.S)
    h = re.sub(r'<li><a href="https://[^"]*"[^>]*>ショップ ↗</a></li>', '', h)
    h = re.sub(r'<a class="pd-tan"[^>]*>.*?</a>', '', h, flags=re.S)
    h = re.sub(r'<a class="tan-link"[^>]*>.*?</a>', '', h, flags=re.S)
    # 価格と購入ボタンを外す
    h = re.sub(r'<section class="gp-buy".*?</section>\s*', '', h, flags=re.S)
    h = re.sub(r'\s*<p class="tile-price">.*?</p>', '', h, flags=re.S)
    h = re.sub(r'\s*<a class="btn[^"]*"[^>]*>ショップで購入する</a>', '', h)
    # 比較ページ（価格あり）への案内は、「お手元に届いた方へ」に戻る案内に替える
    h = re.sub(r'<p class="cmp-link cmp-link--page">.*?</p>',
               '<p class="cmp-link cmp-link--page"><a href="../index.html">「お手元に届いた方へ」に戻る</a></p>', h, flags=re.S)
    # 検索には出さない（同じ内容のページが二つになるため）
    h = h.replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n<meta name="viewport"', 1)
    h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- 自動生成：tools/make-foryou.py。このファイルは手で直さない -->', 1)
    return h

def main():
    bad = []
    for k in SETS:
        for sub in ['', 'making/']:
            src = os.path.join(ROOT, 'gallery', k, sub, 'index.html')
            dst = os.path.join(ROOT, 'foryou', k, sub, 'index.html')
            h = convert(open(src, encoding='utf-8').read())
            for word in ['円', 'ショップで購入', '単品販売', 'tanpin', 'head-shop', 'gallery/index.html']:
                if word in h: bad.append((os.path.relpath(dst, ROOT), word))
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            open(dst, 'w', encoding='utf-8').write(h)
            print('作成', os.path.relpath(dst, ROOT))
    if bad:
        print('確認が必要（価格や購入の案内が残っているかもしれません）:', bad); sys.exit(1)

if __name__ == '__main__':
    main()
