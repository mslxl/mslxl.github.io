import { defineConfig, sharpImageService } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { typst } from 'astro-typst';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import expressiveCode from "astro-expressive-code";
import remarkMermaid from 'remark-mermaidjs'


import vue from '@astrojs/vue';


// https://astro.build/config
export default defineConfig({
  site: THEME_CONFIG.website,
  prefetch: true,
  image: {
    service: sharpImageService({ limitInputPixels: false }),
  },
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      langs: [],
      wrap: true,
    },
    remarkPlugins: [remarkMath, remarkMermaid],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [UnoCSS({
    injectReset: true
  }), robotsTxt(), sitemap(), expressiveCode(), typst(), mdx(), vue()],
  vite: {
    ssr: {
      external: ["@myriaddreamin/typst-ts-node-compiler"]
    }
  },
  server: {
    host: '0.0.0.0'
  }
});