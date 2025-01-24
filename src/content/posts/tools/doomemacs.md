---
title: 使用 Doom Emacs 工作
categories:
  - 译
  - Emacs
date: 2021-08-30 00:00:00
---

# Table of Contents

- [Table of Contents](#table-of-contents)
- [安装](#安装)
- [项目与工作空间 (Projects and Workspaces)](#项目与工作空间-projects-and-workspaces)
- [常见任务 (Common Tasks)](#常见任务-common-tasks)
- [寻找文本 (Finding Text)](#寻找文本-finding-text)
- [在文本间移动 (Moving To Text)](#在文本间移动-moving-to-text)
- [扩大和缩小范围 (Narrowing and Widening Regions)](#扩大和缩小范围-narrowing-and-widening-regions)
- [多光标 (Multiple Cursors)](#多光标-multiple-cursors)
- [撤销与重做 (Undoing and Redoing)](#撤销与重做-undoing-and-redoing)
- [在编译输出间导航 (Navigating Compliation Output)](#在编译输出间导航-navigating-compliation-output)
- [杂项](#杂项)
- [了解更多 Doom](#了解更多-doom)

原文: [Doom Emacs Workflows](https://noelwelsh.com/posts/doom-emacs/) 发布于 2019 年 2 月 15日，部分功能可能已发生变化。

我最近放弃了 Spacemacs, 开始使用 [Doom Emacs](https://github.com/hlissner/doom-emacs). 目前为止，Doom Emacs 的文档仍十分简陋，所以我用 Doom Emacs 写了这篇个人笔记来介绍我的工作流（包含一些我认为比较重要但是缺少文档的功能）。

如果你有下面的情况，Doom 也许就很适合你：

- 喜欢 Emacs 又想使用 Vim 的按键绑定
- 没有时间配置像是 helm 之类的优秀插件
- 感觉 Spacemacs 太慢

这篇文章并不打算介绍 Emacs 的运行方式和基础的 Vim 按键绑定，而是把焦点放在我认为出类拔萃的地方

<a id="org6a62219"></a>

# 安装

一定要使用 `develop` 分支，不是 `master` ! 使用 `develop` 分支需要

    git clone https://github.com/hlissner/doom-emacs ~/.emacs.d
    cd ~/.emacs.d
    git checkout develop

然后运行 `bin/doom quickstart` 即可完成安装。之后您可以运行 `bin/doom help` 查看可用命令。

<a id="org8fec0f7"></a>

# 项目与工作空间 (Projects and Workspaces)

我发现使用项目与工作空间来管理工作十分有用。我从中得到了两点好处：从当前项目中寻找东西更快，还可以快速方便的通过保存和恢复 window 和 buffer 配置来回到工作。在 Doom 中，这些功能由 `projectile` 和 `persp-mode` 实现。

基本工作流程如下：

- 判断我自己要做什么。是单独的一个项目，还是涉及多个项目 (例如管理 Todo 列表)，亦或是不需要在项目中保存 (像是进行在 scratch buffer 中快速计算)？如果是单独的项目，就把它放到一个属于它的工作空间中，否则就把它放在默认工作空间中（main)
- 使用 `SPC TAB .` 切换到恰当的工作空间。如果这个工作空间并没有显示，那么就用 `SPC TAB l` 加载这个工作空间，或者使用 `SPC TAB n` 创建一个新工作空间。就我个人而言，我经常用 `SPC TAB r` 来使工作空间的命名中包含更多信息，然后用 `SPC TAB s` 保存。
- 当我切换到一个已存在的工作空间时，Emacs 会恢复到我上次在项目的工作状态，这样我可以直接开始工作。不然我会使用 `SPC p p` 来选择一个项目来继续工作。

有三个命令非常有用：

- `SPC SPC` 在当前项目中切换文件，支持模糊搜索
- `SPC ,` 在项目中切换 buffer, 同样支持模糊搜索
- `SPC f r` 打开最近浏览的文件

<a id="org7198548"></a>

# 常见任务 (Common Tasks)

我经常使用的有：

- `SPC :` 而非 `M x`
- `SPC g g` 打开 [Magit](https://magit.vc/), 这是我唯一使用 Git 的方式

我偶尔使用的有：

- `SPC .` 打开一个文件。值得一提的是使用 `SPC SPC` 比使用这个要快，只有当你要打开当前项目之外的文件时才会使用这个命令
- `SPC b B` 切换到当前项目外的 buffer

<a id="org747bd18"></a>

# 寻找文本 (Finding Text)

如果你知道有某个文本存在，却不知道它的位置，有两种方式可以找到它：

- `SPC s p` 搜索当前项目中的所有文件 （按下 `SPC s` 后等待弹窗出现可以了解其他选项)。您可以在搜索结果的 buffer 中使用 `Return` 跳转到该位置，或者使用 `C-c C-e` 来编辑所有的搜索结果。无论您修改了什么，您都可以使用 `C-c C-c` 来保存修改，或者使用 `C-c C-k` 放弃保存。这对于简单或者复杂的编辑多个文件中的内容都特别有用。
- `/` 在当前 buffer 中搜索。使用 `n` 和 `N` 分别跳转的下一个搜索结果和上一个搜索结果。 (使用 `?` 可以向上搜索)

<a id="orgdeef4b5"></a>

# 在文本间移动 (Moving To Text)

当您在屏幕上看到某个特定文字时，有很多方式可让您快速的将光标移动到那里：

- `s` 然后输入两个字符，您就能跳转的当前位置下方的最近的匹配项，用 `S` 则可以向上跳转。输入 `,` 可以继续跳转到该 buffer 中的上一项，=;= 则能跳转到下一项。通常配置下，这些功能只会跳转到当前行中的匹配结果，但是如果您多次输入 `,` 或 `;` ，您就可以在整个 buffer 中进行跳转操作。这是 [evil-snipe](https://github.com/hlissner/evil-snipe) 的功能。
- `g s SPC` ，然后键入你想找的文字。当没有歧义时，您可以直接跳转到那里，否则需要使用特定的字母组合来选择位置。如果您在 `config.el` 文件中配置了 `(seq avy-all-windows t)` ，则会在所有的可见窗口中进行匹配。我比较喜欢这个功能，因为他能让我在屏幕中快速跳转。该功能使用了 [Avy](https://github.com/abo-abo/avy)。
- `g s` 后等待弹窗出现可以了解其他选项，其实我并没有真正使用过这个，因为上面的两个方法完全可以满足我的需求，但是或许我在这里错过了什么。

当我想跳转到的位置和现在的位置比较近时，我会使用 evil-snipe (`s` 和 `S`)。如果位置较远或在另一个窗口，我会使用 Avy (`g s SPC`)。它们都能用来选择文本，假如我们有这样的一串文本：

    Just some example text

当光标位于 `J` 时，如果我们想选中 `Just some example` 。我们可以用 `v3e` ，但如果这样我们就需要去查单词的数量（还要记住 `e` 和 `w` 的区别），因此，我们可以用 `vsle` 。 `s` 表示使用 evil-snipe , `le` 则是我们找的两个字母。我们也可以用 `vgs SPC le` 来使用 Avy (然后我们需要把光标向右移动一个字母)。

使用 evil-snipe 有点复杂。它把选择命令绑定到了 `s` 键上，但是其他一些指令（例如 yank, 或者说 `y`) 被 [evil-surround](https://github.com/emacs-evil/evil-surround) 绑定到了 `s` 上。在这种情况下， evil-snipe 被绑定到了 `z` 键（ `Z` 来向后搜索）。如果我们不想在选中的文字中包含某个特定文本，我们可以使用 `x` ( `X` 键向后搜索 )

<a id="orgd28a4f0"></a>

# 扩大和缩小范围 (Narrowing and Widening Regions)

> 译者注：该部分在新版 Doom emacs 中有较大变化，故该部分存在少许调整与原文不同，如需查看旧版本操作请查看原文。

在 Emacs 中有一个叫 Narrowing 的功能，对于将 buffer 限制到一个选择的文本中十分有用，但它由于经常给初学者造成困扰，默认情况下被禁用，在初次使用时可以选择是否启用。它特别适合与多个光标（见下）同时使用。您可以用 `C-x n n` 来将范围缩小到当前选择的区域，使用 `C-x n w` 执行相反操作（即扩大范围）。用 `C-x n d` 来缩小范围到当前的函数也十分有用。

<a id="org806bc14"></a>

# 多光标 (Multiple Cursors)

多光标允许您同时编辑多个地方。Doom 提供了两种多光标的实现方式，它们分别是 [evil-multiedit](https://github.com/hlissner/evil-multiedit) 和 [evil-mc](https://github.com/gabesoft/evil-mc)。我各人感觉 evil-multiedit 更容易使用，但是功能比较局限。

有两种方式可以开始使用 evil-multiedit ：

- 选择您想编辑的文本，然后按 `R` 继续选择在当前 buffer 中您想要编辑的文本。
- 将光标移动到您想要编辑的单词旁，然后使用 `M-d` 和 `M-D` 来分别选中上一个或下一个相同的单词（可以先缩小范围）

当您选择了一些文本区域后，您可以使用 `C-n` (下一个) 和 `C-p` (上一个)。按下选中的文本上按回车键，该文本区域会被取消选中。使用这些按键，您可以随意地选中文本。

当您完成了选择后，对一个区域的修改将会影响所有的区域，大多数的 evil 命令都能够与 evil-multiedit 配合使用。

您也可以使用平时的取消按键（ `ESC` 或 `C-[` ）来退出 evil-multiedit 模式。

evil-mc 是另外一个多光标实现，它更加的灵活，但也更加难以使用。使用 evil-mc 创建多个光标有以下几种选择：

- `gzm` 在所有的匹配项创建一个光标（可以先缩小范围）
- `gzd` 创建光标，然后移动到下一个匹配项（ `gzd` 移动到上一项）
- `gzj` 创建光标，然后移动到下一行 ( `gzk` 移动到上一行 )
- `gzz` 在当前项创建光标。

这些创建光标会重复您在真正的光标上输入的命令。您可以用 `gzt` 来临时关闭多光标，从光标位置继续可以再次按相同的按键 `gzt`

大多数的命令都能与 evil-mc 配合使用，但是少数我使用的功能不能用：

- `DEL` (backspace) 在插入模式下不能在所有的光标进行重复操作
- `ysiw` 在所有模式下都不能在所有的光标下工作 (尽管 `ciw` 可以)

如果光标之间不同步，使用撤消一些命令通常可以解决问题。

当您完成了编辑操作后，按下 `gzu` 来移除所有光标

<a id="org35af536"></a>

# 撤销与重做 (Undoing and Redoing)

> 译者注：原文在这里标注了 TODO

_TODO_

`u` 键撤销。 `undo-tree` 系统比较复杂，但是您会慢慢习惯它。 `C-r` 和 `M-_` 执行重做操作， `C-x u` 显示撤销树（undo tree）

<a id="org4a475a3"></a>

# 在编译输出间导航 (Navigating Compliation Output)

_TODO_

按下 `SPC p c` 或 `M-b` 来进行编译。 `]e` 和 `[e` 查看下一个或上一个 flycheck (一种拼写检查) 错误。 `SPC c x` 来分别列出所有错误。

<a id="org2d0afb3"></a>

# 杂项

- `gcc` 注释或取消当前行的注释
- `SPC oA` 打开 Org agenda
- `SPC x` 为任意笔记打开临时 buffer (scratch buffer)
- 更改文字大小： `M-=+` 增加字号， `M--` 缩小字号， `M-+` 重置

<a id="orgdbc49a3"></a>

# 了解更多 Doom

我对 Doom 的了解大多数都是通过阅读[默认按键绑定](https://github.com/hlissner/doom-emacs/blob/develop/modules/config/default/+evil-bindings.el), 查看我不认识的命令获得的。在 scratch buffer 中实验每个命令的含义很容易。
