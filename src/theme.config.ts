export const THEME_CONFIG: App.Locals['config'] = {
  /** blog title */
  title: "Integrate Life",
  /** your name */
  author: "Mslxl",
  /** website description */
  desc: "My story of discovering",
  /** your deployed domain */
  website: "https://blog.mslxl.com",
  /** your locale */
  locale: "en-us",
  /** theme style */
  themeStyle: "light",
  /** your socials */
  socials: [
    {
      name: "github",
      href: "https://github.com/mslxl",
    },
    {
      name: "rss",
      href: "/atom.xml",
    },
    // {
    //   name: "twitter",
    //   href: "https://github.com/moeyua/astro-theme-typography",
    // },
    // {
    //   name: "mastodon",
    //   href: "https://github.com/moeyua/astro-theme-typography",
    // }
  ],
  /** your header info */
  header: {
    // twitter: "@moeyua13",
  },
  /** your navigation links */
  navs: [
    {
      name: "Posts",
      href: "/posts/page/1",
    },
    {
      name: "Archive",
      href: "/archive",
    },
    {
      name: "Categories",
      href: "/categories"
    },
    {
      name: "Friends",
      href: "/tomodachi",
    },
    {
      name: "About",
      href: "/about",
    },
  ],
  /** your comment provider */
  comments: {
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
  }
}

