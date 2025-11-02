import { glob, file } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import { githubReleasesLoader } from 'astro-loader-github-releases'
import { githubPrsLoader } from 'astro-loader-github-prs'

import {
  friendSchema,
  pageSchema,
  postSchema,
  projectSchema,
} from '~/content/schema'

const pages = defineCollection({
  loader: glob({ base: './src/pages', pattern: '**/*.mdx' }),
  schema: pageSchema,
})

const home = defineCollection({
  loader: glob({ base: './src/content/home', pattern: 'index.{md,mdx}' }),
})

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  schema: postSchema,
})

const projects = defineCollection({
  loader: file('./src/content/projects/data.json'),
  schema: projectSchema,
})

const friends = defineCollection({
  loader: file('./src/content/friends/data.json'),
  schema: friendSchema,
})

const releases = defineCollection({
  loader: githubReleasesLoader({
    mode: 'repoList',
    repos: ['mslxl/algorimejo'],
    monthsBack: 2,
    entryReturnType: 'byRelease',
    clearStore: true,
  }),
})

const prs = defineCollection({
  loader: githubPrsLoader({
    search: 'author:mslxl',
    monthsBack: 12,
    clearStore: true,
  }),
})

export const collections = {
  pages,
  home,
  blog,
  projects,
  releases,
  prs,
  friends,
}
