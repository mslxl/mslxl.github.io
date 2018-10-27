---
layout: post
title: Katex 大法好！
tags:
  - Misc
  - Katex
  - Hexo
abbrlink: d330a755
katex: true
mermaid: true
date: 2018-10-27 00:00:00
---

{% katex %}
c = \pm\sqrt{a^2 + b^2}
{% endkatex %}

{% katex %}
\sin\theta \qquad \cos\theta \qquad \tan\theta \qquad \cot \theta
{% endkatex %}

{% katex %}
\lg ^{a*b} = \lg ^a + \lg ^b

\ln ^{e} = 1

\log _{a}^{1} = 0
{% endkatex %}

## 静态渲染

其实我本来是想用 {%katexline \LaTeX %} 的，结果发现了 {%katexline \KaTeX %} ,根据它的介绍 {%katexline \KaTeX %} 竟然提供了一套不依赖于浏览器的 API ，这就为静态渲染提供了可能，在使用的时候只需要引入对应的 CSS 就可以正常显示，不需要引入新的 JavaScript 代码。

于是就有了下面的一段代码


```javascript
'use strict';
/* global hexo */

const log = hexo.log || console;
const katex = require('katex');
const util = require('hexo-util');

hexo.config.katex = Object.assign({
    enable: true,
    css: 'https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.css'
}, hexo.config.katex);

if (hexo.config.katex.enable) {
    hexo.extend.tag.register('katex', function (args, content) {
        return katex.renderToString(content, {
            displayMode: true,
            throwOnError: false
        });
    }, { ends: true });

    hexo.extend.tag.register('katexline', function (args) {
        return katex.renderToString(args[0], {
            throwOnError: false
        });
    });

    hexo.extend.filter.register('after_post_render', function (data) {
        if (data.katex) {
            data.content = util.htmlTag('link', {
                rel: 'stylesheet',
                type: 'text/css',
                href: hexo.config.katex.css
            }) + data.content;
        }
        return data;
    });
}
```