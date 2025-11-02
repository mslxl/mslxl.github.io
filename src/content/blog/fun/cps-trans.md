---
title: "CPS 变换"
date: 2025-02-08
categories:
  - CPS
---

大多数语言都是通过编译器实现 CPS 变换。尤其是 FP 语言将 CPS 作为一种中间代码。

CPS 变换的过程非常简单

对于一个函数 $f: t1 \to t2$，它的 CPS 版本应该是 $f\_cps: t1 \to (t2 \to a) \to a$，
其中 $f\_cps\ x\ k \cong k\ (f\ x)$

其变换过程如下:

1. 对返回值是 $t$ 的函数，添加一个 $t \to a$ 类型的 Continuation 参数，并将返回值将变为 $a$
2. 在每个函数的 return 处调用 Continuation
3. 如果有函数的递归调用表达式 $e$，将$e$的结果绑定到新的变量 $rec_ans$ 上
4. 将原递归部分更改为 $e (rec\_ans \to <body>)$，其中 $<body>$ 是原本函数的其他部分

以以下 Haskell 代码 map 为例：

```hs
map :: (a -> b) -> [a] -> [b]
map f [] = []
map f (x:xs) = f x : map f xs
```

首先添加 Continuation，并更改类型

```hs
map :: (a -> b) -> [a] -> ([b] -> c) -> c
map f [] k = k []
map f (x:xs) k = k (f x : map f xs)
```

这里递归部分为 `map f xs`，提取这部分，并转化为 `map f xs (\ans -> <body>)`，其中 `<body>` 为后续操作

```hs
map :: (a -> b) -> [a] -> ([b] -> c) -> c
map f [] k = k []
map f (x:xs) k = map f xs (\rec -> k (f x: rec))
```

手动模 `map (*2) [1,2] id` 一下

```hs
map (*2) [1,2] id
= map (*2) [2] (\rec -> id ((*2) 1 : rec))
= map (*2) [] (\rec' -> (\rec -> id ((*2) 1 : rec)) ((*2) 2 : rec'))
= (\rec' -> (\rec -> id ((*2) 1 : rec)) ((*2) 2 : rec')) []
= (\rec -> id ((*2) 1 : rec)) ((*2) 2 : [])
= (\rec -> id ((*2) 1 : rec)) (4 : [])
= (\rec -> id ((*2) 1 : rec)) [4]
= id ((*2) 1 : [4])
= id (2 : [4])
= id [2, 4]
```
