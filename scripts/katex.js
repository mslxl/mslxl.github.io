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