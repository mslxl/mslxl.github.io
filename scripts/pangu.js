'use strict';
/* global hexo */

hexo.config.pangu = Object.assign({
    enable: true
}, hexo.config.pangu);

const log = hexo.log || console;
if (hexo.config.pangu.enable) {
    const pangu = require('pangu')
    
    hexo.extend.filter.register('after_post_render', function (data) {
        try {
            data.content = pangu.spacing(data.content);
            data.title = pangu.spacing(data.title);
            log['info']('Spaced %s', data.title);
        } catch (error) {
            log['info']('Can not space %s', data.title);
        }
        return data;
    });
} else {
    log['info']('Pangu has been disabled')
}
