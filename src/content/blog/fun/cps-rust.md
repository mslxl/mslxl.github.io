---
title: "CPS 与 Rust Result"
pubDate: 2025-01-21
categories:
  - Rust
  - CPS
---

CPS([Continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style), 连续传递) 是一种编程风格。
CPS 中的 C 即 Continuation，它是一个作为参数的函数，表示计算后的下一个过程。它的主要作用就是接受函数的结果，
并控制下一步执行。

我们用一段 Kotlin 代码来表示。这是一个 Direct Style 的代码 mul 函数

```kt
fun mul(a: Int, b: Int): Int {
  return a + b
}
```

它的 CPS 大概是这样的

```kt
fun mul<R>(a: Int, b: Int, continuation: (Int)->R): R{
  return continuation(a+b)
}
```

如果用它来实现阶乘的话将会是这样

```kt
fun fact(a: Int, k: (Int)->Int): Int {
  return match(a){
    0 -> k(1)
    n -> fact(n-1) {
      mul(n, it, k)
    }
  }
}
```

它和经常见的 fact 函数有什么区别？~~如果有人给我看这代码我可能会直接丢给 AI~~

我们可以在 continuation（有时写做 k） 中控制征程程序的流程。比如上面的函数中，如果我们想在 x 的阶乘大于 k 时直接返回，
否则执行 taskB，代码会是这样

```kt
fun task(){
  fact(x){
    return if(it > k)  it
    else taskB(it)
  }
}

```

如果在 continuation 中没有调用其他函数，而是直接返回了某个值，那么这个值将会被看作是结果直接返回到顶层。

那么这东西有什么用呢？除了在 FP 语言中用于中间表示，或者是协程中的应用外，Rust 使用 CPS 来表示 Result 的 `?` 运算符。

比如代码

```kt

fun taskMayError(
  onSuccess: (()->Unit)->Unit,
  onError:(()->Unit)->Unit,
  k: ()->Unit
): Unit {
  // 仅使用 if 表示成功/失败
  if(doSomeOtherTask()){
    return onSuccess(k)
  }else{
    onError{
      return errorCode
    }
  }
}

fun main(){
  val onSuccessDo = { k->
    return k()
  }
  val onErrorDo = { k->
    eprintln("error")
    return k()
  }

  fact(4){ factResult->
    return taskMayError(onSuccessDo, onErrorDo){ // 控制流程
      return mul(2, 3) { mulResult ->
        return factResult + mulResult
      }
    }
  }
}
```

关注函数的实际调用代码，当任务失败时，函数会从 taskMayError 直接返回，而 `mul` 及后续过程不会被执行。
这其实就是 Rust 中 `?` 的原理。Rust 编译器将函数拆开重组，再进行 inline（此处感谢 C++ 大手推动 LLVM 相关功能），
即实现了 `?` 运算符的功能。

---

~~我试着在 Python 里搞这一套结果栈溢出了~~
