#set page(margin: 0em)
#set text(size: 16pt)

#import "@preview/tablem:0.1.0": tablem
#import "@preview/mitex:0.2.4": *
#import "@preview/codly:1.0.0": *

#show: codly-init.with()

#codly(fill: white)


#linebreak()

还记得最初写博客的时候使用的还是 Jekyll，使用它的原因还很简单，只是 GitHub 的官方支持。大概是在 


$ integral^("Future")_("Past") "Life" dif "Time" $

```
00:35:39 [ERROR] [postcss] C:/Users/lnslf/sources/astro-theme-typography/__uno.css:156:55: Missed semicolon
  Stack trace:
    at C:/Users/lnslf/sources/astro-theme-typography/__uno.css:156:54
    [...] See full stack trace in the browser, or rerun with --verbose.
```


```xml
<meta content="COAY.COM [http://www.coay.com]" name="dtb:generator" />
```

```
[CouldNotTransformImage] Could not transform image `/_astro/recording-1723657217223-6.D3AMUxZg.gif`. See the stack trace for more information.
  Hint:
    This is often caused by a corrupted or malformed image. Re-exporting the image from your image editor may fix this issue.
  Error reference:
    https://docs.astro.build/en/reference/errors/could-not-transform-image/
  Stack trace:
    at generateImageInternal (file:///C:/Users/lnslf/sources/astro-theme-typography/node_modules/.pnpm/astro@4.15.2_@types+node@20.12.7_rollup@4.21.2_typescript@5.4.5/node_modules/astro/dist/assets/build/generate.js:131:21)
    at async file:///C:/Users/lnslf/sources/astro-theme-typography/node_modules/.pnpm/p-queue@8.0.1/node_modules/p-queue/dist/index.js:187:36
  Caused by:
  Input image exceeds pixel limit
    at Sharp.toBuffer (C:\Users\lnslf\sources\astro-theme-typography\node_modules\.pnpm\sharp@0.33.5\node_modules\sharp\lib\output.js:163:17)
    at generateImageInternal (file:///C:/Users/lnslf/sources/astro-theme-typography/node_modules/.pnpm/astro@4.15.2_@types+node@20.12.7_rollup@4.21.2_typescript@5.4.5/node_modules/astro/dist/assets/build/generate.js:125:45)
    at async file:///C:/Users/lnslf/sources/astro-theme-typography/node_modules/.pnpm/p-queue@8.0.1/node_modules/p-queue/dist/index.js:187:36
 ELIFECYCLE  Command failed with exit code 1.
```

#underline(
link("https://github.com/withastro/astro/issues/9351")[astro\#9351: Input image exceeds pixel limit error is too vague]
)

```typescript
import { defineConfig, sharpImageService } from "astro/config";

export default defineConfig({
  image: {
    service: sharpImageService({ limitInputPixels: false }),
  },
});
```

$cases(
dot(x) = A x + B u = mat(delim: "[", 0, 0, dots.h.c, 0, - a_n; 1, 0, dots.h.c, 0, - a_(n - 1); 0, 1, dots.h.c, 0, - a_(n - 2); dots.v, dots.v, dots.down, dots.v, dots.v; 0, 0, dots.h.c, 1, - a_1) x + mat(delim: "[", b_n; b_(n - 1); b_(n - 2); dots.v; b_1) u,

y = C x = mat(delim: "[", 0, 0, dots.h.c, 1) x
)$


#tablem[
  | *English* | *German* | *Chinese* | *Japanese* |
  | --------- | -------- | --------- | ---------- |
  | Cat       | Katze    | 猫        | 猫         |
  | Fish      | Fisch    | 鱼        | 魚         |
]

#codly(
  annotations: (
    (
      start: 0,
      end: 1,
      content: block(
        width: 2em,
        // Rotate the element to make it look nice
        rotate(
          -90deg,
          align(center, box(width: 100pt)[
            #rect(fill: rgb("#fa5355"), inset: 0.5em, radius: 0.5em)[
              #set text(fill: white)
              代价
            ]
          ])
        )
      )
    ), 
  ),
)


```
08:32:16 ▶ src/pages/posts/[...slug].astro
08:32:16   ├─ /posts/others/hexo-migrate-astro/index.html (+737ms)
08:32:17   ├─ /posts/fun/ce-gtutor/index.html (+15ms)
```