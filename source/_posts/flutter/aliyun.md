---
layout: post
title: flutter 使用 Aliyun google 仓库
date: '2017-12-29 19:57:00 +0800'
tags:
  - Android
  - Google
  - Flutter
abbrlink: de1ebb9b
---

Flutter 在编译时依赖 `com.android.tools.build:gradle`，而这个依赖的下载的仓库是不受项目的影响的，也就是说你在一个项目里无论怎么改动 `repositories` 段，它使用的仓库始终是 [https://maven.google.com/com/android/tools/build/gradle/](https://maven.google.com/com/android/tools/build/gradle/) ，这个仓库吧...ummmm....要爱国才能访问。

Flutter 使用的仓库配置在 SDK 的 `flutter/packages/flutter_tools/gradle/flutter.gradle` 文件里，只需要在 `repositories` 加入 aliyun-google 仓库即可。

```groovy
maven {
    name "aliyun-google"
    url 'http://maven.aliyun.com/nexus/content/repositories/google/'
}
```

WGF kcuf