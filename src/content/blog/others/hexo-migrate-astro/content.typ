#set page(margin: (top: 2pt, bottom: 2em, left: 0pt, right: 0pt))
#set text(size: 16pt)
#set text(lang: "zh")

#import "../../../../components/typst-components.typ": *
#import "@preview/tablem:0.1.0": tablem
#import "@preview/mitex:0.2.4": *
#import "@preview/codly:1.0.0": *

#show: codly-init.with()

#codly(fill: white)

#outline(indent: 2em)

#set heading(numbering: "1.1.1 - ")

= 迁移史

还记得最初写博客的时候使用的还是 Jekyll，使用它的原因还很简单，只是 GitHub 的官方支持。大概是在 7 年前，我换到了 Hexo，目的只是为了贪图方便，毕竟 Hexo 的插件生态要比 Jekyll 丰富得多。当时在 #dead(hyperlink("https://github.com/zhangyubaka", "絢香的羽毛")) 的影响下选择了 #hyperlink("https://github.com/yscoder/hexo-theme-indigo", "yscoder/hexo-theme-indigo") 作为主题。

后来上了大学后换到了 #hyperlink("https://github.com/Molunerfinn/hexo-theme-melody")[Molunerfinn/hexo-theme-melody]，#strike[还有些许少女风hhh]。

两年前，听信 Hugo 速度快的宣传，用了一段时间 Hugo 搭配 PaperMod 主题，不过后来还是换了回来。Hugo 快确实是快，但是它的插件生态只能说是寥寥无几。再加上它采用 Go 语言开发，扩展性设计的并不强，要想在上面增加功能还要去修改 Hugo 的代码，于是后来又回到了 Hexo。在这过程中从 V2EX 上看到了 #friend("Seven-colored Magical Baka",url: "https://7cmb.com/") 的博客，对于我这种傻逼二次元来说还挺好看，于是换上了一样的主题。图为刚换下来的主题#footnote[背景图片出自游戏: Fox Hime Zero]：

#table(
  columns: 3,
  figure(image("landing.jpeg"), caption: "第一屏"),
  figure(image("auld_light.jpeg"), caption: "文章列表（亮）"),
  figure(image("auld_dark.jpeg"), caption: "文章列表（暗）")
)

== 通病

不管是 Jekyll、Hexo 还是 Hugo，它们都有一个共同的问题，那就是采用了不带语义的模板引擎。这使得博客的主题开发充满了诡异的感觉，大有一种 PHP 或者 JSP 时拼凑模板既视感。另外在 Jekyll 和 Hexo 中如果要在文章中插入一些特殊的内容（例如 SSG LaTex 公式）都需要使用特定的模版语言来书写，这使得在文章中插入一些特殊内容变得非常麻烦，在Markdown中插入 `<=%` 等标签也显得十分突兀。至于 Hugo，它好像就不支持这种拓展。

此外，Hexo 至今还不能使用 ESM Module，这使得使用 TypeScript 的开发体验变得非常糟糕。而我又不喜欢使用 JavaScript，毕竟书写这种弱类型的语言很难保证不出现一些奇奇怪怪的错误，正所谓：

#figure(image("js-eq.jpeg", width: 480pt), caption: "只有上帝懂的 JavaScript")

#box(
  width: 100%
)[
  #set align(right)
  #hyperlink("https://javascriptwtf.com/")[了解更多：JavaScript WTF]
]



== 选择

在迁移到新的博客渲染器之前，我其实考虑过给 Hexo 加上一套 WebPack 之类的奇奇怪怪的方案，类似 #friend(url: "https://github.com/SukkaW/", "Sukka") 的 #hyperlink("https://blog.skk.moe/post/use-nextjs-and-hexo-to-rebuild-my-blog/")[使用 Next.js + Hexo 重构我的博客]。使用 WebPack 确实能解决上面提到的问题，但是既然都用 WebPack 了，为什么不扔掉 Hexo 只用 WebPack 呢？不过后来出于懒的写 WebPack 插件，外加还有其他代替方案，我就放弃了这一选项。

其他多种方案有：

- Hakyll
- VitePress
- Next.js
- Nuxt.js
- Astro

Hakyll 是使用 Haskell 开发的静态博客渲染器，我是从 #friend(url: "https://rqy.moe/", "清芷") 和 #friend(url: "https://ice1000.org/", "千里冰封") 两位的博客#strike[和后宫群]中了解到的。Hakyll 的配置文件是使用 Haskell 编写的 DSL，这种DSL 类似 XMonad 的配置，使得它的可配置性非常强大，基本上能实现任何功能。但是它和 Hugo 有相同的问题——第三方生态较差。Stackage 上的一些库曾经挺全面，但现在大多已经不再维护。

对于 VitePress, 我曾经在写 Provlegisto 的官网时用过，个人感觉写文档或者产品落地页还算可以。但如果是拿来写博客的，目前可用的主题和插件还是有点难受的。此外，VitePress 更新博客稍微有点问题，它需要手动修改索引文件和整理目录，这点非常不方便。不过 VitePress 还是一个不错的静态文档生成器（参考用例 #hyperlink("https://github.com/nolebase/nolebase", "Nólëbase")），只是它和我的口味不搭而已。

Next.js 和 Nuxt.js 算是同类型的框架，因为支持 SSG 所以可以用来整一些静态站点。但是很多对于博客来说的基础的功能在Next.js和Nuxt.js的 SSG 模式中并不支持，比较典型的是资源管理。以 Next.js 为例：Next.js 并不能直接渲染 Markdown，而是要通过一个 Page 去渲染它的内容，也就是说我要在 `app` 文件夹下有这样的一个页面来渲染 Markdown 文件：

```typescript
import "github-markdown-css/github-markdown-light.css"
export default async function MarkdownRender({
  content,
  styled = true,
  withHtml = true,
}: MarkdownRenderProps) {
  const processedContent = await remark().use(html).process(content)
  let htmlContent = processedContent.toString()
  if (!withHtml)
    htmlContent = htmlContent.replace(/<[^>]*>?/gm, "")
  return (
    <div
      className={clsx({
        "markdown-body": styled,
      })}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    ></div>
  )
}
```

对于采用 SSG 的博客来说，还需要通过 #hyperlink("https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params", "dynamic routes") 提供一个索引来告诉 Next.js 需要对哪些内容生成静态页面。这样就暴露了一个问题：对于生成的页面来说，它的图片等静态资源的路径在哪？大概只能统一放在 public 文件夹下了。对于 Markdown 文件，它的路径是由上面的页面文件决定的，如果将 Markdown 和它对应的静态文件放在一起，非 public 文件夹下的静态资源又默认不会被处理。因此，管理 Markdown 文件和它对应的静态资源是一个非常麻烦的问题。


= 实验田

综合种种因素，我最终选择了 Astro，并修改了 astro-theme-typography 主题。新博客起名为 Integrate Life，即为

$ integral^("Alive")_("Dead") "Life" dif("time") $

这个其实是修改自网图 $integral^("生")_("死") "学习" dif("time") = "卷" $，也算自己的一些恶趣味吧。

== Astro

Astro 的组件、路由已经老生常谈了，就不多做缀述。

但当我将旧博客的内容迁移过来时，遇到了以下问题：

```
00:35:39 [ERROR] [postcss] C:/Users/lnslf/sources/astro-theme-typography/__uno.css:156:55: Missed semicolon
  Stack trace:
    at C:/Users/lnslf/sources/astro-theme-typography/__uno.css:156:54
    [...] See full stack trace in the browser, or rerun with --verbose.
```

同问对文件的二分，结果发现是 Epub 的 Post 中的一段代码片段导致的

```xml
<meta content="COAY.COM [http://www.coay.com]" name="dtb:generator" />
```

虽然这段代码在 markdown 文件中已经被放在了代码段中，但不知道为什么 astro 的 unocss 插件却识别了它并生成了一段错误的 css 代码。我是完全无法理解这种情况，也没能成功定位导致该问题的代码。However 这段代码不是很重要，去掉它也不会对博客的内容造成什么影响。


== Nix

1 年前，我将自己的主力系统#hyperlink("/posts/os/convert-nix/")[从 Arch Linux 换到了 NixOS]。自那以后我写的所有玩具基本上都是直接过间接通过 flake 构建的。这次趁着迁移博客的机会，我打算将博客也做成一个 flake，这样我就可以将博客的构建完全放到 Nixpkgs 中进行管理。

和一些相当复杂的应用对比，Astro 的构建可以说是相当简单了。 Astro 并没有什么复杂的外部依赖，也就是说只需要引入 nodejs, esbuild 和包管理器（pnpm）就可以满足最小要求。其中 esbuild 是 vite 所使用的打包工具，使用 go 语言开发，因此需要引入 buildGoModule 来构建。

```nix
{
  lib,
  stdenv,
  buildGoModule,
  fetchFromGitHub,
  esbuild,
  nodejs,
  pkg-config,
  pnpm
}:
stdenv.mkDerivation rec {
  pname = "blog";
  version = "0.0.0";
  src = builtins.path {
    name = "source";
    path = ./.;
  };

  pnpmDeps = pnpm.fetchDeps {
    pname = "${pname}-pnpm-deps";
    inherit src version;
    hash = "sha256-23Eph8mPnfKjKioytrAZ1tVAG6kbYx/LVMU+tL66ym0=";
  };
  pnpmRoot = ".";

  nativeBuildInputs = [
    nodejs
    pnpm.configHook
    pkg-config
  ];

  ESBUILD_BINARY_PATH = "${lib.getExe (esbuild.override {
    buildGoModule = args:
      buildGoModule (args
        // rec {
          version = "0.20.2";
          src = fetchFromGitHub {
            owner = "evanw";
            repo = "esbuild";
            rev = "v${version}";
            hash = "sha256-h/Vqwax4B4nehRP9TaYbdixAZdb1hx373dNxNHvDrtY=";
          };
          vendorHash = "sha256-+BfxCyg0KkDQpHt/wycy/8CTG6YBA/VJvJFhhzUnSiQ=";
        });
  })}";

  preBuild = ''
    pnpm build
  '';

  preInstall = ''
    mv dist $out
  '';
}
```

由于个人需求，我需要使用 playwright 在服务器端渲染 mermaid 的图表，因此需要引入 playwright-driver 和它的 browsers。

```nix
{
  # ...,
  playwright-driver,
}: {
  # ...
  nativeBuildInputs = [
    playwright-driver.browsers
  ];
  preBuild = ''
     export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
     export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
     ...
  '';
}
```

那么它的 devShell 配置就更简单了：

```nix
outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEachSupportedSystem = f: nixpkgs.lib.genAttrs supportedSystems (system: f rec {
        pkgs = import nixpkgs { inherit system; };
      });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }:
        {
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.nixpkgs-fmt
            ];
            nativeBuildInputs = with pkgs; [
              playwright-driver.browsers
            ];
            packages = (with pkgs; [
              typst-lsp

              pkgs.shellcheck
             
              nodejs
              nodejs.pkgs.pnpm

              just
            ]);
            shellHook = ''
              if [ ! -d "node_modules" ]; then pnpm install; fi
              export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
              export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
            '';
          };
      });
    };
```

不过这个位置需要对齐 nix 中的 playwright-driver 和 packages.json 中 playwright 的版本。对于 nix 来说它的版本号稍微有点滞后，因此在升级 packages.json 中的依赖项时步子不能迈的太大。

通过上述配置即可使用 `nix build` 命令来构建博客，其构建内容会存放在 `./result` 文件夹中。也就是说，即使是在 GitHub Actions 中，也可以通过使用 nix 来完成构建，再也不用调整 GitHub Actions 中容器安装的依赖项了。

== Typst

Typst 是一个新兴的排版工具，它的语法和 Markdown 比较类似，但功能却要强大很多。Typst 的语法和 Markdown 的语法非常类似，因此上手难度很低。此外，Typst 的编译器设计非常优秀，只需要为 AST 编写少量的代码（Adapter）就可以输出到另外一种格式。

除了排版外，Typst 还支持插入数学公式，它的功能可谓是非常强大。

#table(
  columns: 1,
  inset: 1em,
  ```typst
  $cases(
  dot(x) = A x + B u = mat(delim: "[", 0, 0, dots.h.c, 0, - a_n; 1, 0, dots.h.c, 0, - a_(n - 1); 0, 1, dots.h.c, 0, - a_(n - 2); dots.v, dots.v, dots.down, dots.v, dots.v; 0, 0, dots.h.c, 1, - a_1) x + mat(delim: "[", b_n; b_(n - 1); b_(n - 2); dots.v; b_1) u,

  y = C x = mat(delim: "[", 0, 0, dots.h.c, 1) x
  )$
  ```,
  $cases(
  dot(x) = A x + B u = mat(delim: "[", 0, 0, dots.h.c, 0, - a_n; 1, 0, dots.h.c, 0, - a_(n - 1); 0, 1, dots.h.c, 0, - a_(n - 2); dots.v, dots.v, dots.down, dots.v, dots.v; 0, 0, dots.h.c, 1, - a_1) x + mat(delim: "[", b_n; b_(n - 1); b_(n - 2); dots.v; b_1) u,

  y = C x = mat(delim: "[", 0, 0, dots.h.c, 1) x
  )$
)


或者说是从 mitex 中借助 LaTex 的力量

#table(
  columns: 1,
  inset: 1em,
  ```typst
  #import "@preview/mitex:0.2.4": *

  #mitex(`\frac{\Gamma \vdash \phi \; true}{\Gamma \vdash \phi \vee \psi \; true} \qquad \frac{\Gamma \vdash \psi \; true}{\Gamma \vdash \phi \vee \psi \; true} \qquad \frac{\Gamma \vdash \phi \vee \psi \; true \quad \Gamma, \phi \vdash \chi \; true \quad \Gamma, \psi \vdash \chi \; true}{\Gamma \vdash \chi \; true}`)
  ```,
  mitex(`\frac{\Gamma \vdash \phi \; true}{\Gamma \vdash \phi \vee \psi \; true} \qquad \frac{\Gamma \vdash \psi \; true}{\Gamma \vdash \phi \vee \psi \; true} \qquad \frac{\Gamma \vdash \phi \vee \psi \; true \quad \Gamma, \phi \vdash \chi \; true \quad \Gamma, \psi \vdash \chi \; true}{\Gamma \vdash \chi \; true}`)
)



而代价也是相当震撼——渲染这个页面用时 737ms，而渲染其他静态页面只用 15ms。

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

#figure([
```
08:32:16 ▶ src/pages/posts/[...slug].astro
08:32:16   ├─ /posts/others/hexo-migrate-astro/index.html (+737ms)
08:32:17   ├─ /posts/fun/ce-gtutor/index.html (+15ms)
```
], caption: "渲染时间对比")

此处的 Typst 将最终渲染到 svg 文件并插入到网页中。该功能由 #hyperlink("https://github.com/OverflowCat/astro-typst")[OverflowCat/astro-typst] 提供。说起来事情也挺巧，我在最初计划迁移博客的时候，正规划着写一个渲染 astro 的插件，但因为考研的原因一直在拖，却没想到被 #friend(url: "https://blog.xinshijiededa.men/", "OverflowCat") 捷足先登了。#strike[这下可以躺平摆烂拿来就用了]

== Islands

#quote[JOJO，我正在做贪得无厌的事情]

依托于 Astro 的 Islands 架构，用户其实可以将 Vue 组件作为 Astro 的 Islands 组件使用。只需要在 astro 文件中导入 vue 的组件即可使用。
我在博客的 #hyperlink("/projects")[Projects] 页面使用了 Vue 组件，并进行了 Hydration。

#figure(```astro
import Project from "~/components/Project.vue"

<Project />
```, caption: "使用 Vue 组件")

根据 Astro 的官方文档，通过 Intergration 的方式，Astro 可以集成 alpinejs, lit, preact, react, solidjs, svelte, vue 等框架。可谓是相当齐全。如果大胆一点，甚至可以在页面里面再嵌入一个 SPA。

不过这个功能大概也有点伪需求的意思，毕竟在很少有人 Astro 中嵌入客户端组件。Astro 是内容驱动的框架，对这些 UI 库/框架的需求并不大——毕竟，很少见过有人在 Hexo 中加入 Vue.js。


= 总结

好用。

以上。
