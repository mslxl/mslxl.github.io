export interface FeedItem {
  link: string
  dateRaw: string
  contentHtml: string
}

const CONTENT_ATTR_PATTERN = /\b(src|href)\s*=\s*(["'])(.*?)\2/gi
const CLASS_ATTR_PATTERN = /\bclass\s*=\s*(["'])(.*?)\1/i
const IMAGE_TAG_PATTERN = /<img\b[^>]*>/gi
const LEADING_IMAGE_SEQUENCE_PATTERN = /^\s*((?:<img\b[^>]*>\s*)+)/i
const LEADING_IMAGE_WRAPPER_PATTERN =
  /^\s*(<(div|figure|p)\b[^>]*>)\s*((?:<img\b[^>]*>\s*)+)<\/\2>/i
const LINK_SELECTORS = ['link', 'guid[isPermaLink="true"]'] as const
const CONTENT_SELECTORS = ['description', 'content\\:encoded'] as const
const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})
type FeedImageListKind = 'single' | 'even' | 'odd' | null

export const FEED_ACCEPT =
  'application/rss+xml, application/xml, text/xml;q=0.9,*/*;q=0.8'

const firstText = (node: ParentNode, selectors: readonly string[]) => {
  for (const selector of selectors) {
    const value = node.querySelector(selector)?.textContent?.trim()
    if (value) return value
  }
  return ''
}

export const toHttpUrl = (value: string, baseUrl: string, fallback = '') => {
  try {
    const url = new URL(value, baseUrl)
    return ['http:', 'https:'].includes(url.protocol)
      ? url.toString()
      : fallback
  } catch {
    return fallback
  }
}

export const normalizeUrl = (value: string, baseUrl: string) => {
  const raw = value.trim()
  if (!raw || raw.startsWith('data:') || raw.startsWith('blob:')) return raw
  return toHttpUrl(raw, baseUrl, raw)
}

const appendClassNames = (tagHtml: string, ...classNames: string[]) => {
  const extras = classNames.flatMap((value) => value.split(/\s+/)).filter(Boolean)
  if (!extras.length) return tagHtml

  const classMatch = tagHtml.match(CLASS_ATTR_PATTERN)
  if (!classMatch) {
    return tagHtml.replace(
      /\s*\/?>$/,
      (ending) => ` class="${extras.join(' ')}"${ending}`
    )
  }

  const existing = classMatch[2].split(/\s+/).filter(Boolean)
  const merged = [...new Set([...existing, ...extras])]
  return tagHtml.replace(
    CLASS_ATTR_PATTERN,
    `class=${classMatch[1]}${merged.join(' ')}${classMatch[1]}`
  )
}

const normalizeImageTag = (tagHtml: string) => {
  const classMatch = tagHtml.match(CLASS_ATTR_PATTERN)
  if (!classMatch) return tagHtml
  if (!/\b(?:tg-emoji|sticker)\b/.test(classMatch[2])) return tagHtml
  return appendClassNames(tagHtml, 'no-zoom')
}

const countLeadingImages = (html: string) => {
  const trimmed = html.trim()
  if (!trimmed) return 0

  const wrapperMatch = trimmed.match(LEADING_IMAGE_WRAPPER_PATTERN)
  if (wrapperMatch?.[3]) {
    return wrapperMatch[3].match(IMAGE_TAG_PATTERN)?.length || 0
  }

  const sequenceMatch = trimmed.match(LEADING_IMAGE_SEQUENCE_PATTERN)
  if (sequenceMatch?.[1]) {
    return sequenceMatch[1].match(IMAGE_TAG_PATTERN)?.length || 0
  }

  return 0
}

const getLeadingImageListKind = (imageCount: number): FeedImageListKind => {
  if (imageCount < 1) return null
  if (imageCount === 1) return 'single'
  return imageCount % 2 === 0 ? 'even' : 'odd'
}

export const normalizeContentHtml = (html: string, baseUrl: string) => {
  if (!html) return ''

  const normalized = html
    .replace(CONTENT_ATTR_PATTERN, (_match, attr, quote, value) => {
      return `${attr}=${quote}${normalizeUrl(value, baseUrl)}${quote}`
    })
    .replace(IMAGE_TAG_PATTERN, normalizeImageTag)
    .trim()

  const imageListKind = getLeadingImageListKind(countLeadingImages(normalized))
  if (!imageListKind) return normalized

  const wrapperMatch = normalized.match(LEADING_IMAGE_WRAPPER_PATTERN)
  if (wrapperMatch?.[1]) {
    return normalized.replace(
      wrapperMatch[1],
      appendClassNames(
        wrapperMatch[1],
        'rss-image-list',
        `rss-image-list-${imageListKind}`
      )
    )
  }

  const sequenceMatch = normalized.match(LEADING_IMAGE_SEQUENCE_PATTERN)
  if (!sequenceMatch?.[1]) return normalized

  const imageGroup = sequenceMatch[1].trim()
  const wrappedImageGroup = `<div class="rss-image-list rss-image-list-${imageListKind}">${imageGroup}</div>`
  return normalized.replace(sequenceMatch[1], wrappedImageGroup)
}

export const formatFeedDate = (dateRaw: string) => {
  const date = new Date(dateRaw)
  if (Number.isNaN(date.getTime())) return null

  return {
    iso: date.toISOString(),
    text: DATE_FORMATTER.format(date),
  }
}

export const parseFeedXml = (
  xmlText: string,
  sourceUrl: string
): FeedItem[] => {
  const xml = new DOMParser().parseFromString(xmlText, 'application/xml')
  if (xml.querySelector('parsererror')) throw new Error('Invalid XML')

  const items: FeedItem[] = []
  for (const item of xml.querySelectorAll('item')) {
    const link = toHttpUrl(firstText(item, LINK_SELECTORS), sourceUrl)
    if (!link) continue

    const rawHtml =
      firstText(item, CONTENT_SELECTORS) ||
      item.getElementsByTagName('content:encoded')[0]?.textContent?.trim() ||
      ''
    const contentHtml = normalizeContentHtml(rawHtml, link)

    items.push({
      link,
      dateRaw: item.querySelector('pubDate')?.textContent?.trim() || '',
      contentHtml,
    })
  }

  return items
}
