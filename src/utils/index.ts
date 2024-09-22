import { getCollection } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
import { pinyin } from '@napi-rs/pinyin'

export async function getCategories() {
  const posts = await getPosts()

  const categories = new Map<string, Post[]>()

  posts.forEach((post:Post) => {
    if (post.data.categories) {
      post.data.categories.forEach((c: string) => {
        const posts = categories.get(c) || []
        posts.push(post)
        categories.set(c, posts)
      })
    }
  })

  return categories
}

export async function getPosts() {
  const posts = await getCollection('posts')
  posts.sort((a: Post, b: Post) => {
    const aDate = a.data.date || new Date()
    const bDate = b.data.date || new Date()
    return bDate.getTime() - aDate.getTime()
  })
  return posts
}

const parser = new MarkdownIt()

export function getPostDescription(post: Post) {
  if (post.data.description) {
    return post.data.description
  }

  const html = parser.render(post.body)
  const sanitized = sanitizeHtml(html, { allowedTags: [] })
  return sanitized.slice(0, 400)
}

export function formatDate(date?: Date) {
  if(!date) return '--'
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getPathFromCategory(category: string) {
  return pinyin(category, {
    segment: false,
    style: 0,
  }).join('')
}
