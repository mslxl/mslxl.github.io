---
layout: post
title: 换了一个模板
date: '2017-05-16 20:00:00 +0800'
author: Mslxl
subtitle: ''
tags:
  - Misc
abbrlink: b6404640
---

宝宝不想说话

就是换一个模板我已经不知道踩了多少坑了

## 坑1

大概说一下吧，我没学过 Liquid ， jekyll 报错信息如下

> Liquid Warning: Liquid syntax error (line 161): Unexpected character { in "tag[1].size > {{site.featured-condition-size}}" in /_layouts/post.html

我按照他的报错去翻代码，却发现错误提示错误在161行，但是这行代码在200多行，
不过我看不懂，考虑到这个模板比较出名，于是出动谷歌大法搜索这行错误，然后就找到了[这里](http://stackoverflow.com/questions/39688902/liquid-warning-liquid-syntax-error-unexpected-character-when-i-jekyll-serve)。

按照回答修改后再运行，代码不报错了，不过文章内容却没了，我以为我菜，有地方改错了，
不信邪的又试了几次，结果都不显示。

没办法，只好加回来，加回来后有错误但是内容正常显示，不管了，就这样了吧。

## 坑2

还是在post.html和page.html中，只要删掉评论框，内容立马跪掉，算了，不动了。
