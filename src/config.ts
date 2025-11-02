import type { Site, Ui, Features } from './types'

export const SITE: Site = {
  website: 'https://blog.mslxl.com/',
  base: '/',
  title: 'Integrate Life',
  description: "Mslxl's blog - Integrate subtle to life",
  author: 'Mslxl',
  lang: 'zh',
  ogLocale: 'zh_CN',
  imageDomains: [],
}

export const UI: Ui = {
  internalNavs: [
    {
      path: '/blog',
      title: 'Blog',
      displayMode: 'alwaysText',
      text: 'Blog',
    },
    {
      path: '/projects',
      title: 'Projects',
      displayMode: 'alwaysText',
      text: 'Projects',
    },
    {
      path: '/shorts',
      title: 'Shorts',
      displayMode: 'iconToTextOnMobile',
      text: 'Shorts',
      icon: 'i-meteor-icons-grid',
    },
    {
      path: '/friends',
      title: 'Friends',
      displayMode: 'iconToTextOnMobile',
      text: 'Friends',
      icon: 'i-ri-group-line',
    },
  ],
  socialLinks: [
    {
      link: 'https://github.com/mslxl',
      title: 'Github',
      displayMode: 'alwaysIcon',
      icon: 'i-uil-github-alt',
    },
  ],
  navBarLayout: {
    left: [],
    right: [
      'internalNavs',
      'hr',
      'socialLinks',
      'hr',
      'searchButton',
      'themeButton',
      'rssLink',
    ],
    mergeOnMobile: true,
  },
  tabbedLayoutTabs: false,
  groupView: {
    maxGroupColumns: 3,
    showGroupItemColorOnHover: true,
  },
  githubView: {
    monorepos: ['mslxl/algorimejo', 'Memorilo/memorilo'],
    mainLogoOverrides: [
      [/starlight/, 'https://starlight.astro.build/favicon.svg'],
    ],
    subLogoMatches: [
      [/theme/, 'i-unjs-theme-colors'],
      [/github/, 'https://github.githubassets.com/favicons/favicon.svg'],
      [/tweet/, 'i-logos-twitter'],
      [/bluesky/, 'i-logos-bluesky'],
    ],
  },
  externalLink: {
    newTab: false,
    cursorType: '',
    showNewTabIcon: false,
  },
  postMetaStyle: 'minimal',
}

/**
 * Configures whether to enable special features:
 *  - Set to `false` or `[false, {...}]` to disable the feature.
 *  - Set to `[true, {...}]` to enable and configure the feature.
 */
export const FEATURES: Features = {
  slideEnterAnim: [true, { enterStep: 60 }],
  ogImage: [
    true,
    {
      authorOrBrand: `${SITE.title}`,
      fallbackTitle: `${SITE.description}`,
      fallbackBgType: 'plum',
    },
  ],
  toc: [
    true,
    {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
      displayPosition: 'left',
      displayMode: 'content',
    },
  ],
  share: [
    true,
    {
      twitter: [true, '@mslxl_bak'],
      bluesky: [true, '@mslxl.bsky.social'],
      mastodon: [true, '@mslxl'],
      facebook: false,
      pinterest: false,
      reddit: false,
      telegram: true,
      whatsapp: false,
      email: false,
    },
  ],
  giscus: [
    true,
    {
      'data-repo': 'mslxl/mslxl.github.io',
      'data-repo-id': 'MDEwOlJlcG9zaXRvcnkxMjcwMTEwMjI=',
      'data-category': 'Show and tell',
      'data-category-id': 'DIC_kwDOB5IIzs4CfW4f',
      'data-mapping': 'title',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-lang': 'en',
    },
  ],
  search: [
    true,
    {
      includes: ['blog', 'projects'],
      filter: true,
      navHighlight: true,
      batchLoadSize: [true, 5],
      maxItemsPerPage: [true, 3],
    },
  ],
}
