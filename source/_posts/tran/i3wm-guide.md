---
title: i3 User's Guide 操作篇
tags:
  - i3
  - translation
abbrlink: 4937fd9b
date: 2018-08-23 00:00:00
---



[原页面](https://i3wm.org/docs/userguide.html)

该文档包含了配置和使用 i3 的所有信息。如果没有您所需要的信息，请先检查[<https://www.reddit.com/r/i3wm/>](<https://www.reddit.com/r/i3wm/>) 是否已包含您所需要的内容，然后再通过 IRC （推荐）或者电子邮件咨询。



## 1.默认键位

这是为那些“太长，不读”的用户准备的默认键位的一览

*按下 $mod 键 ( Alt 键 )*

![keyboard-layer1](/assets/i3/keyboard-layer1.png)

*按下 Shift + $mod 键*

![keyboard-layer2](/assets/i3/keyboard-layer2.png)



注意在启动 i3 时如果没有配置文件，i3-config-wizard 将会为你提供一份像上图一样的键位，不管你使用什么键盘布局，如果你想使用自己的配置文件，那么只需要取消掉 i3-config-wizard 的提示，然后配置 `/etc/i3/config`。



## 2. 使用 i3

整篇导航中的 `$mod` 都指的是配置文件中配置的修饰键。默认是 Alt 键 (`Mod1`)，不过 Windows 键 (`Mod4`) 也是一个十分流行的`$mod`键，可以有效的防止与应用程序之间的快捷键发生冲突。



### 2.1. 打开终端并四处移动

打开一个新终端窗口是非常基础的操作，默认快捷键下为 `$mod + Enter`，也就是说在使用默认配置文件时的 `Mod1 + Enter`，通过按下 `$mod + Enter` 打开一个新终端，他将会占据屏幕上所有可用空间。

![POI](/assets/i3/single_terminal.png)

如果再打开另一个终端，i3 会把它放到当前窗口之后，把屏幕一分为二，分割方向依赖于显示器，I3 将创建的窗口放在现有窗口旁（在宽显示器上）或现有窗口之下（旋转显示）。

![Nanodesu](/assets/i3/two_terminals.png)

你可以使用像 `vi` 上的方式移动焦点，但是在 i3 中你需要按住 `$mod` 键再按这些按键（在`vi`中，这些按键为了兼容大多数键盘布局都被向左移动了一个键）。因此，`$mod + j`是向左，`$mod + k` 是向下，`$mod + l`是向上，`$mod + ;`是向右，所以，在两个终端之前切换只需要 `$mod + k` 和 `$mod + l`，当然，你也可以使用方向键。

此时，你包含两个终端的工作空间是被指定的方向分割的（默认为横向），每个窗口都可以像工作空间一样重新横向或纵向分割。术语是 “window”，用于包含 X11 窗口（如终端或浏览器）的容器，以及“split container” 用于由一个或多个窗口组成的容器。

>  TODO: picture of the tree 
>
> 原文中就是 TODO 我也很绝望啊



要垂直分割窗口，请在创建新窗口之前按 `$mod+v`。要水平拆分，按 `$mod+h`。

### 2.2. 改变容器布局

split container 可以有一下几种布局：

* splith/splitv
  * 相同容器内的每个窗口获得相等的空间
  * splith ：横向布局
  * splitv ：纵向布局
* stacking：堆叠
  * 只显示容器内具有焦点的窗口，在容器的顶部会显示所有窗口的列表
* tabbed：选项卡
  * 与 stacking 相同，但是容器顶部的窗口列表是横向显示

使用 `$mod + e` 切换 splith 和 splitv 模式，按`$mod + s` 切换到 stacking 模式，按 `$mod + w` 切换到 tabbed 模式

![up white ze smart voice](/assets/i3/modes.png)

### 2.3. 窗口全屏

对当前窗口开关全屏模式，请按 `$mod+f` 键。

在 I3 中还有一个全局全屏模式，命令为 `fullscreen toggle global`

### 2.4. 打开其他应用程序

除了打开终端外，默认也可以按 `$mod + d` 来打开 `dmenu` 的菜单。只需要键入你要打开的程序名称就可以打开该应用。`dmenu` 将在  `$PATH` 中寻找应用程序。

此外，如果您的应用程序非常频繁地打开，则可以创建用于直接启动应用程序的键绑定。详情请参阅章节 [配置](https://i3wm.org/docs/userguide.html#configuring)。



### 2.5. 关闭窗口

如果一个应用程序不提供关闭机制（大多数应用提供一个菜单或者像是 `Control + w ` 的快捷键），你可以按 `$mod + Shift + q` 来关闭窗口。对于支持 WM_DELETE 协议的应用程序，这将正确地关闭应用程序（保存或执行其他清理操作）。如果应用程序不支持 WM_DELETE 协议，则 X 服务器将关闭窗口，并且之后的行为取决于应用程序。



### 2.6. 使用工作空间

工作空间是一个可以把窗口组合起来的简单方式。默认情况下你位于第一工作空间，在左下角的指示条上会显示。若要切换到其他工作空间，请按 `$mod + num`，`num`是要打开的工作空间的序号，如果这个工作空间不存在将会被创建。



### 2.7. 在工作空间中移动窗口

要将窗口移动到另一个工作区，只需按 `$mod+Shift+num`，其中 `num` 是目标工作区的序号。和切换工作空间相似，目标工作空间如果不存在将会被创建。



### 2.8. 调整大小

调整容器大小的最最最简单方法是使用鼠标：拖住边框并将其移动到所需大小。

你也可以使用 [模式绑定](https://i3wm.org/docs/userguide.html#binding_modes)来定义一个模式，以供使用键盘移动和调整大小。举个栗子，由 i3 提供的[默认配置](https://github.com/i3/i3/blob/next/etc/config.keycodes)



### 2.9. 重启 i3

如果你遇到了什么 bug 或者要升级高版本，没有必要重启电脑，只需要`$mod + Shift + r`。



### 2.10. 退出 i3

使用 `$mod + Shift + e`可以不关闭 X 服务退出 i3。默认会有一个弹窗来讯问你是否退出。



### 2.11. 浮动模式

 浮动模式和平铺模式是两个截然相反的模式。窗口的位置和大小不是由 i3 自动管理，而是由您手动管理。使用此模式违反了平铺标准，但对于某些特殊情况（如 “另存为” 对话框窗口或工具栏窗口（GIMP 等））非常有用。这些窗口通常设置适当的提示，默认情况下以浮动模式打开。

你可以通过 `$mod + Shift + Space` 来开关浮动模式。使用你的鼠标拖动窗口的标题可以任意移动该窗口。拖动窗口边框可以重设大小。你也可以使用 [floating_modifier](https://i3wm.org/docs/userguide.html#floating_modifier)。右键标题并拖动也是调整窗口大小的另一种方式。

使用键盘在浮动模式调整窗口大小可以参见 [i3 默认配置](https://github.com/i3/i3/blob/next/etc/config.keycodes)

浮动窗口始终位于平铺窗口上。