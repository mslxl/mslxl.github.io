---
title: 使用 ts 实现 Parser 组合子
date: 2022-10-07T20:00:00+08:00
---

Parser 组合子(Parser Combinator) 可用于实现词法分析器或者 LL 语法分析器，它的实现较为简单，但缺点是运行效率较低(尤其是在组合层数较多时)，在对性能要求不高时可采用 Parser 组合子来进行解析任务。

本文最终会实现这样的 Parser Combinator:

```ts
let input = "114514aabbcc"

let result = parser.digit1()(input)
console.log(result)

// { kind: 'Right', right: { first: 'aabbcc', second: '114514' } }
```

---

## 准备: `Either`
要表示 Parser Combinator，首先要先分别表示出 parse 成功和失败的两种状态。
本文采用了类似 `Either` 的概念，其 Left 储存错误信息，而 Right 储存匹配成功项和剩余项。

```ts
export interface Left<E> {
    readonly kind: 'Left',
    left: E
}

export interface Right<E> {
    readonly kind: 'Right',
    right: E
}

export type Either<L, R> = Left<L> | Right<R>

```

为了方便对 `Either` 的基本操作，我们添加以下代码:

```ts
export interface Pair<F,S>{
    first: F,
    second: S
}

export function left<L, R = never>(value: L): Either<L, R> {
    return {
        kind: 'Left',
        left: value
    }
}

export function right<R, L = never>(value: R): Either<L, R> {
    return {
        kind: 'Right',
        right: value
    }
}

export function is_left<L=never, R=never> (either: Either<L,R>): boolean{
    return either.kind == "Left"
}
export function is_right<L=never, R=never> (either: Either<L,R>): boolean{
    return either.kind == "Right"
}
```



其中 `left` 和 `right` 用于构造一个 `Either`

## 第一个 Parser 组合子: `text`

有了这些准备，我们就可以实现一个最简单的 Parser 组合子了。
```ts
type Parser<E, L> = (input: String) => either.Either<L, Pair<string, E>>

export function text(expect: string): Parser<string, string> {
    return function (input: string): either.Either<string, Pair<string, string>> {
        if (input.startsWith(expect)) {
            return either.right({ first: input.substring(expect.length), second: expect })
        } else {
            return either.left(expect)
        }
    }
}

```
如果 `input` 是以 `expect` 开头的字符串，则返回 `Right` 表示匹配成功，否则返回 `Left` 表示失败。这样我们就可以使用 text 来匹配特定的字符了
```ts
let input = "114514abababa"
let result = text("114")(input)
console.log(result)
// { kind: 'Right', right: { first: '514abababa', second: '114' } }
```

很明显这远远不够，因为有时我们不能确定要匹配的文本出现顺序，比方说我们要匹配一个数字，但是不能确定数字是什么，使用 `text` 就无能为力了，这时候我们就需要一个新的组合子来修饰旧组合子了。

## `oneOf` Parser 组合子

我们在下面实现一个 `oneOf` 组合子，它将从提供的所有 Parser 组合子中选择第一个匹配成功项并返回。

从一系列结果中选择成功项很容易让我们联想到 `Alternative` 的性质，所以让我们先让结果 `Either` 能进行 `Alternative` 的运算吧(即实现 `alt` 和 `map` 函数)

```ts

export function map<L, R, E>(either: Either<L, R>, block: (right: R) => E): Either<L, E> {
    if (either.kind == 'Right') {
        let value = block(either.right)
        return right(value)
    } else {
        return either as Either<L, E>
    }
}

export function alt<L, R>(...either: Either<L, R>[]): Either<L, R> {
    return either.reduce((p, c) => {
        if (p.kind == 'Right') return p
        else return c
    })
}
```
`map` 会对 `Right` 中的元素进行操作，原样返回 `Left` 中的元素，`alt` 则会选择第一个 `Right`，抛弃前面的所有 `Left`（放在 Haskell 上也就是使 `Either` 是 `Alternative` 的一个实现）


有了 `alt`， 我们很容易实现 `oneOf` 函数。只需要从所有匹配结果中选择第一个成功项即可（即 `Right`)

```ts

export function oneOf<E, L>(...parsers: Parser<E, L>[]): (input: string) => either.Either<L, Pair<string, E>> {
    return function (input: string): either.Either<L, Pair<string, E>> {
        return parsers
            .map((p) => p(input))
            .reduce((c, p) => either.alt(c, p))
    }
}
```

让我们来试着匹配任一个数字:
```ts
export function digit1(): Parser<string, string> {
    let digit = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let digitParser = digit.map(i => text(i.toString()))
    return oneOf(...digitParser)
}

digit1()("1145aa")
// { kind: 'Right', right: { first: '145aa', second: '1' } }
```

那么如果我们想要匹配一串数字怎么办？这时候就要借助 `many` 了

## `many` Parser 组合子

让我们先理一下 `many` 的行为。`many` 会不停的使用提供的组合子进行匹配，直到匹配失败为止，以数组的形式返回之前的匹配成功项。

下面是代码，~~写的有点摸鱼，但是能用~~
```ts
export function many0<E, L>(parser: Parser<E, L>): Parser<E[], L> {
    return function (input: string): either.Either<L, Pair<string, E[]>> {
        let result: E[] = []
        let err: L = null
        let success = false;
        while (true) {
            let v = parser(input);
            if (either.is_left(v)) {
                err = (v as either.Left<L>).left
                break;
            } else {
                success = true;
                let rv = v as either.Right<Pair<string, E>>
                input = rv.right.first
                result.push(rv.right.second)
            }
        }
        if (success) {
            return either.right({ first: input, second: result })
        } else {
            return either.left(err)
        }

    }
}
```


让我们用 `many` 和 `oneOf` 试着匹配一串数字，修改 `digit1` 函数如下:

```ts
export function digit1(): Parser<string, string> {
    let digit = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let digitParser = digit.map(i => text(i.toString()))
    return many0(oneOf(...digitParser))
}


digit1()("114aba")

// { kind: 'Right', right: { first: 'aba', second: ['1', '1', '4'] } }
```

似乎成功了，但是返回结果是 `['1', '1', '4']`，我们想要的是 `114`，怎么办？

很遗憾没有办法，parser 组合子就是从最小的单位开始匹配，匹配结果理所当然的是一个一个的最小单元，但是你可以在 `many` 中将这些元素拼起来(不推荐)，或者再创建一个用于处理匹配结果的组合子。

这里利用 `Either` 的 `map` 再写一个 `map` 组合子用于处理匹配结果：

```ts
export function map<E, L, R>(parser: Parser<E, L>, block: (e: E) => R): Parser<R, L> {
    return function (input: string): either.Either<L, Pair<string, R>> {
        return either.map(parser(input), (r) => {
            let result = block(r.second)
            return { first: r.first, second: result }
        })
    }
}
```

再改造一下 `digit1` 函数：

```ts
export function digit1(): Parser<string, string> {
    let digit = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let digitParser = digit.map(i => text(i.toString()))
    return map(many0(oneOf(...digitParser)), (e)=>{
        return e.reduce((p,c)=>p+c)
    })
}
```

现在我们已经可以用 `digit1` 来愉快的匹配数字了

```ts
digit1()("114514ababab")
// { kind: 'Right', right: { first: 'ababab', second: '114514' } }
digit1()("66ccff")
// { kind: 'Right', right: { first: 'ccff', second: '66' } }
```

当然， Parser 组合子还不仅如此，你还可以写出 `optional` 等等组合子，或者写出自己想要的组合子。Parser 组合子也不止可以处理字符串，只需改动少量代码，上述代码便可处理任意序列

这里有一份 Json 解析器是用 Haskell 写的 Parser 组合子，可共参考 [JsonParser.hs](https://github.com/mslxl/MeoAssistantArknightsCLI/blob/main/app/JsonParser.hs)
