import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import swup from '@swup/astro'
import { defineConfig, sharpImageService } from 'astro/config'
import robotsTxt from 'astro-robots-txt'
import UnoCSS from 'unocss/astro'
import { themeConfig } from './src/.config'
import { typst } from 'astro-typst';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import expressiveCode from "astro-expressive-code";
import remarkMermaid from 'remark-mermaidjs'
import vue from '@astrojs/vue';
import react from '@astrojs/react';


// https://astro.build/config
export default defineConfig({
  site: themeConfig.site.website,
  prefetch: true,
  image: {
    service: sharpImageService({ limitInputPixels: false }),
  },
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
    remarkPlugins: [remarkMath, remarkMermaid],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    UnoCSS({
      injectReset: true
    }),
    robotsTxt(),
    sitemap(),
    expressiveCode(),
    typst(),
    mdx(),
    vue(),
    react(),
    swup({
      theme: false,
      animationClass: 'transition-swup-',
      cache: true,
      preload: true,
      accessibility: true,
      smoothScrolling: true,
      updateHead: true,
      updateBodyClass: true,
    }),
  ],
  vite: {
    ssr: {
      external: ["@myriaddreamin/typst-ts-node-compiler"]
    }
  },
  server: {
    host: '0.0.0.0'
  }
})
