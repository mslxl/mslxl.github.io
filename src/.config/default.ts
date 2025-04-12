import type { ThemeConfig } from '~/types'

// This is the default configuration for the template, please do not modify it directly.
// You can override this configuration in the `.config/user.ts` file.

export const defaultConfig: ThemeConfig = {
  site: {
    title: 'Integrate Life',
    subtitle: 'Mslxl\'s Blog',
    author: 'Mslxl',
    description: 'My story of discovery',
    website: 'https://blog.mslxl.com',
    pageSize: 10,
    socialLinks: [
      {
        name: 'github',
        href: 'https://github.com/mslxl/',
      },
      {
        name: 'rss',
        href: '/atom.xml',
      },
      {
        name: 'twitter',
        href: 'https://x.com/mslxl_bak/',
      },
      {
        name: 'mastodon',
        href: 'https://mastodon.social/@mslxl',
      },
    ],
    navLinks: [
      {
        name: 'Posts',
        href: '/',
      },
      {
        name: 'Archive',
        href: '/archive',
      },
      {
        name: 'Categories',
        href: '/categories',
      },
      {
        name: 'Friends',
        href: '/tomodachi',
      },
      {
        name: 'About',
        href: '/about',
      },
    ],

    categoryMap: [],
  },
  appearance: {
    theme: 'light',
    locale: 'zh-cn',
    colorsLight: {
      primary: '#2e405b',
      background: '#ffffff',
    },
    colorsDark: {
      primary: '#ffffff',
      background: '#232222',
    },
    fonts: {
      header: '"Noto Serif HK","Noto Serif SC",HiraMinProN-W6,"Source Han Serif CN","Source Han Serif SC","Source Han Serif TC",serif',
      ui: 'Noto Sans HK,Noto Sans SC,PingFang SC,PingFang HK,PingFang TC,Source Sans Pro,Roboto,Helvetica,Helvetica Neue,Source Han Sans SC,Source Han Sans TC,sans-serif',
    },
  },
  seo: {
    twitter: '@mslxl_bak',
    meta: [],
    link: [],
  },
  rss: {
    fullText: true,
  },
  comment: {
    giscus: {
      repo: 'mslxl/mslxl.github.io',
      repoId: 'MDEwOlJlcG9zaXRvcnkxMjcwMTEwMjI=',
      category: 'Show and tell',
      categoryId: 'DIC_kwDOB5IIzs4CfW4f',
      mapping: 'title',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '1',
      inputPosition: 'top',
      theme: 'light',
      lang: 'zh-CN',
      loading: 'lazy',
    },
  },
  analytics: {
    googleAnalyticsId: 'G-Q6N8MGDECT',
  },
}
