---
title: "训练之余有没有空? 来写个记事本吧(一)"
date: 2023-06-28T11:08:26+08:00
draft: true
tags:
  - Provegisto
  - 编辑器
---

很久以前有过写代码编辑器的经历, 不过当时是用的易语言, 直接用的里面的富文件框, 高亮就全局搜索关键字, 加行号就直接画在文本框上, 一番折腾下来竟然能跑() 不过这还是存在很多问题的, 首先就是没考虑局部更新的问题, 每次输入都会重新渲染, 代码一长直接窗口未响应. 第二就是太依赖 WINDOWS 的富文本控件, 自由度太低, 不能进行深度定制。

~~事实证明瞎搞还是有用处的，上面那些代码不仅污染了我当时的心灵，还让我对代码编辑器埋下了不小的阴影。~~

<hr/>

这次因为要重写 provegisto 成一个面向算法竞赛的 IDE， 需要自己实现不少功能，趁这个机会也系统研究一下这些到底是怎么实现的吧


实际上记事本完全不像那么简单， 如果我们不依赖现有的框架，有很多许多东西需要我们自己去实现，比如文字渲染，Buffer，感知，布局等。

由于该项目的目标是实现一个代码编辑器，在开发技术上选择了 [Tauri](https://tauri.app)，很多东西不需要自己实现。我们只需要借助 WebView ，专注于实现代码编辑框本身的功能即可，不需要去重复实现和渲染有关的功能，极大的减少了工程量。

如果要在浏览器中实现支持高亮的编辑器，很明显很难基于 `<textarea>` 改造，因为它显示的是纯文本。如果使用 `<canvas>` 绘图，则在工程难度上又大了不少。结合
目前网络上能见到的富文本编辑器，这里决定令 div 的 `contentEditable` 为 `true` 来进行改造。
```html
<div contentEditable="true">点我可以编辑</div>
```

它的效果如下
> <div contentEditable="true"> 点我可以编辑 </div>


如果你按下 <kbd>F12</kbd>，可以发现它只是一个 `div` 标签。不过现在它还有些问题，不如它会在你的单词下面画红线（SpellCheck），而我们不需要这种功能，因此我们需要通过设置相应属性该关掉这些功能。

```html
<div contentEditable="true"
  spellCheck="false"
  autoCorrect="false"
  autoCapitalize="falsa"
  translate="no"
  role="textbox"
  aria-multiline="true"
  aria-autocomplete="list">

</div>
```

<!-- ### 参考资料

- [知乎：怎么去实现一个简单文本编辑器](https://www.zhihu.com/question/24328297/answer/108235629)
- [The Craft of Text Editing](http://www.finseth.com/craft/)
- [Visual Studio Code Blog](https://code.visualstudio.com/blogs) -->
















>
