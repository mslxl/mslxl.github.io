import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import swup from '@swup/astro'
import expressiveCode from 'astro-expressive-code'
import robotsTxt from 'astro-robots-txt'
import { typst } from 'astro-typst'
import { defineConfig, sharpImageService } from 'astro/config'
import { firefox } from 'playwright'
import rehypeKatex from 'rehype-katex'
import rehypeMermaid from 'rehype-mermaid'
import remarkMath from 'remark-math'
import UnoCSS from 'unocss/astro'
import { themeConfig } from './src/.config'

// https://astro.build/config
export default defineConfig({
  site: themeConfig.site.website,
  prefetch: true,
  base: '/',
  image: {
    service: sharpImageService({ limitInputPixels: false }),
  },
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, [rehypeMermaid, {
      browserType: firefox,
      strategy: 'inline-svg',
    }]],
  },
  integrations: [
    UnoCSS({
      injectReset: true,
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
      external: ['@myriaddreamin/typst-ts-node-compiler'],
    },
  },
  server: {
    host: '0.0.0.0',
  },
})
