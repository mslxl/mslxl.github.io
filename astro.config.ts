import { defineConfig, sharpImageService } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'
import unocss from 'unocss/astro'
import astroExpressiveCode from 'astro-expressive-code'
import mdx from '@astrojs/mdx'
import { typst } from 'astro-typst'
import { remarkPlugins, rehypePlugins } from './plugins'
import { SITE } from './src/config'

import svelte from '@astrojs/svelte';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: SITE.website,
  base: SITE.base,
  integrations: [sitemap(), robotsTxt(), unocss({ injectReset: true }), astroExpressiveCode(), typst({
    options: {
      remPx: 14,
    },
    target: (id: string) => {
      console.debug(`Detecting ${id}`)
      if (id.endsWith('.html.typ') || id.includes('/html/')) return 'html'
      return 'svg'
    },
  }), mdx(), svelte()],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins,
    rehypePlugins,
  },
  image: {
    domains: SITE.imageDomains,
    // https://docs.astro.build/en/guides/images/#responsive-image-behavior
    // Used for all local (except `/public`) and authorized remote images using `![]()` syntax; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with `layout` prop
    layout: 'constrained',
    responsiveStyles: true,
    service: sharpImageService({
      limitInputPixels: false,
    }),
  },
  vite: {
    ssr: {
      external: ['@myriaddreamin/typst-ts-node-compiler'],
    },
    server: {
      headers: {
        // Enable CORS for dev: allow Giscus iframe to load local styles
        'Access-Control-Allow-Origin': '*',
      },
    },
    build: { chunkSizeWarningLimit: 1200 },
  },
  // https://docs.astro.build/en/reference/experimental-flags/
  experimental: {
    contentIntellisense: true,
    preserveScriptOrder: true,
    headingIdCompat: true,
    chromeDevtoolsWorkspace: true,
    failOnPrerenderConflict: true,
  },
})