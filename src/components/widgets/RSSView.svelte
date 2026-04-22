<script lang="ts">
  import { onMount } from 'svelte'
  import { FEED_ACCEPT, formatFeedDate, parseFeedXml, type FeedItem } from '~/utils/rss-view'

  const MAX_RETRY_COUNT = 3
  const RETRY_DELAY_MS = 500
  const STATUS = {
    loading: 'Loading RSS...',
    misconfigured: 'RSS feed URL is not configured.',
    empty: 'No posts yet.',
    failed: 'Failed to load RSS. Please try again later.',
  } as const

  export let feedUrl: string
  export let viewMoreUrl: string | undefined = undefined
  export let viewMoreText = 'View more'

  let items: FeedItem[] = []
  let loadingState: 'loading' | 'idle' | 'error' = 'loading'
  let statusText: string | null = STATUS.loading
  let statusError = false
  let abortController: AbortController | null = null
  let resolvedViewMoreUrl = viewMoreUrl || feedUrl

  $: resolvedViewMoreUrl = viewMoreUrl || feedUrl

  const delay = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms)
    })

  const setStatus = (text: string | null, isError = false) => {
    statusText = text
    statusError = isError
  }

  const fetchFeedText = async (signal: AbortSignal) => {
    for (let attempt = 0; attempt <= MAX_RETRY_COUNT; attempt += 1) {
      try {
        const response = await fetch(feedUrl, {
          cache: 'no-store',
          headers: { accept: FEED_ACCEPT },
          signal,
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return await response.text()
      } catch (error) {
        if (signal.aborted) throw error
        if (attempt === MAX_RETRY_COUNT) throw error
        await delay(RETRY_DELAY_MS * (attempt + 1))
      }
    }

    throw new Error('Failed to load RSS.')
  }

  const loadFeed = async () => {
    if (!feedUrl.trim()) {
      setStatus(STATUS.misconfigured, true)
      loadingState = 'error'
      return
    }

    setStatus(STATUS.loading)
    loadingState = 'loading'

    abortController?.abort()
    const controller = new AbortController()
    abortController = controller

    try {
      items = parseFeedXml(await fetchFeedText(controller.signal), feedUrl)

      if (!items.length) {
        setStatus(STATUS.empty)
      } else {
        setStatus(null)
      }

      loadingState = 'idle'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return

      setStatus(STATUS.failed, true)
      loadingState = 'error'
    }
  }

  onMount(() => {
    void loadFeed()

    return () => {
      abortController?.abort()
    }
  })
</script>

<div class="rss-view-root" data-loading-state={loadingState}>
  <div class="rss-view-loading-bar" aria-hidden="true"></div>

  {#if statusText}
    <div class="rss-view-status" data-error={String(statusError)}>
      {statusText}
    </div>
  {/if}

  <div class="rss-view-list" aria-live="polite">
    {#each items as item (item.link)}
      {@const date = formatFeedDate(item.dateRaw)}
      <article class="rss-view-item">
        <div class="rss-view-time-box">
          <div class="rss-view-time-dot" aria-hidden="true"></div>
          <div class="rss-view-time">
            <a href={item.link} rel="noopener noreferrer">
              {#if date}
                <time datetime={date.iso}>{date.text}</time>
              {:else}
                Open post
              {/if}
            </a>
          </div>
        </div>

        {#if item.contentHtml}
          <div class="rss-view-entry-content">
            {@html item.contentHtml}
          </div>
        {:else}
          <div class="rss-view-entry-content">
            <a href={item.link} rel="noopener noreferrer">Open post</a>
          </div>
        {/if}
      </article>
    {/each}
  </div>

  <div class="rss-view-more">
    <a
      class="btn-orange inline-flex items-center gap-1.5"
      href={resolvedViewMoreUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span>{viewMoreText}</span>
      <span class="i-ri-arrow-right-up-line" aria-hidden="true"></span>
    </a>
  </div>
</div>

<style>
  :global(.rss-view-root) {
    --rss-highlight: #f97316;
    --rss-border-color: rgba(15, 23, 42, 0.11);
    --rss-secondary-color: rgba(15, 23, 42, 0.52);
    --rss-cell-background: rgba(255, 255, 255, 0.8);
    --rss-code-background: rgba(255, 255, 255, 0.64);
    --rss-shadow:
      0 1px 2px rgba(15, 23, 42, 0.04),
      0 4px 12px rgba(15, 23, 42, 0.06);
    display: block;
  }

  :global(.dark .rss-view-root) {
    --rss-border-color: rgba(226, 232, 240, 0.12);
    --rss-secondary-color: rgba(226, 232, 240, 0.58);
    --rss-cell-background: rgba(15, 23, 42, 0.32);
    --rss-code-background: rgba(15, 23, 42, 0.46);
    --rss-shadow:
      0 1px 2px rgba(0, 0, 0, 0.18),
      0 8px 24px rgba(0, 0, 0, 0.16);
  }

  :global(.rss-view-root .rss-view-loading-bar) {
    position: relative;
    height: 2px;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.22s ease,
      visibility 0s linear 0.22s;
  }

  :global(.rss-view-root .rss-view-loading-bar::before) {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 35%;
    background: var(--rss-highlight);
    transform: translateX(0);
    animation: rss-loading-slide 1s ease-in-out infinite alternate;
    will-change: transform;
  }

  :global(.rss-view-root[data-loading-state='loading'] .rss-view-loading-bar),
  :global(.rss-view-root[data-loading-state='error'] .rss-view-loading-bar) {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s;
  }

  :global(.rss-view-root[data-loading-state='error'] .rss-view-loading-bar) {
    background: #e11d48;
  }

  :global(.rss-view-root[data-loading-state='error'] .rss-view-loading-bar::before) {
    display: none;
  }

  :global(.rss-view-root .rss-view-status) {
    padding: 0.75rem 0;
    text-align: center;
    color: var(--rss-secondary-color);
  }

  :global(.rss-view-root .rss-view-status[data-error='true']) {
    color: #e11d48;
  }

  :global(.rss-view-root .rss-view-list) {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;
  }

  :global(.rss-view-root .rss-view-time-box) {
    display: flex;
    align-items: center;
    line-height: 1;
  }

  :global(.rss-view-root .rss-view-time-dot) {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999px;
    background: var(--rss-highlight);
    flex: none;
  }

  :global(.rss-view-root .rss-view-time) {
    flex: 1;
    padding-left: 0.75rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--rss-highlight);
  }

  :global(.rss-view-root .rss-view-time a) {
    color: inherit;
    text-decoration: none;
  }

  :global(.rss-view-root .rss-view-time a:hover) {
    text-decoration: underline;
    text-underline-offset: 0.2rem;
  }

  :global(.rss-view-root .rss-view-entry-content) {
    border-left: 2px solid var(--rss-border-color);
    margin-left: 0.19rem;
    padding: 1.35rem 0 1.5rem 1.5rem;
    font-size: 0.97rem;
    line-height: 1.7;
    word-break: break-word;
  }

  :global(.rss-view-root .rss-view-entry-content > * + *) {
    margin-top: 1rem;
  }

  :global(.rss-view-root .rss-view-entry-content > :first-child) {
    margin-top: 0;
  }

  :global(.rss-view-root .rss-view-entry-content > :last-child) {
    margin-bottom: 0;
  }

  :global(.rss-view-root .rss-view-entry-content a) {
    word-break: break-all;
  }

  :global(.rss-view-root .rss-view-entry-content img) {
    display: block;
    max-width: calc(100% - 1px);
    height: auto;
    border: 1px solid var(--rss-border-color);
    border-radius: 0.8rem;
    box-shadow: var(--rss-shadow);
    background: var(--rss-cell-background);
  }

  :global(.rss-view-root .rss-view-entry-content .rss-image-list) {
    width: min(100%, 28.5rem);
    margin-bottom: 1rem;
  }

  :global(.rss-view-root .rss-view-entry-content .rss-image-list:not(.rss-image-list-single)) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  :global(.rss-view-root .rss-view-entry-content .rss-image-list-single) {
    display: block;
  }

  :global(.rss-view-root .rss-view-entry-content .rss-image-list > img) {
    width: 100%;
    margin: 0;
  }

  :global(.rss-view-root .rss-view-entry-content .rss-image-list-odd > :first-child) {
    grid-column: 1 / -1;
  }

  :global(.rss-view-root .rss-view-entry-content .tg-emoji) {
    display: inline-block;
    width: 1.15em;
    height: 1.15em;
    max-width: none;
    margin: 0 0.08em;
    vertical-align: -0.15em;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: none;
  }

  :global(.rss-view-root .rss-view-entry-content .sticker) {
    width: min(16rem, 100%);
    border: none;
    box-shadow: none;
    background: none;
  }

  :global(.rss-view-root .rss-view-entry-content .emoji) {
    font-style: normal;
    margin-right: 2px;
  }

  :global(.rss-view-root .rss-view-entry-content .tg-expandable),
  :global(.rss-view-root .rss-view-entry-content blockquote) {
    background: var(--rss-cell-background);
    border-left: 3px solid var(--rss-highlight);
    border-radius: 0.4rem;
    font-size: 0.88em;
    margin: 1rem 0;
  }

  :global(.rss-view-root .rss-view-entry-content blockquote) {
    padding: 0.5rem 0.7rem 0.5rem 0.85rem;
  }

  :global(.rss-view-root .rss-view-entry-content .tg-expandable) {
    position: relative;
    min-height: 3.6em;
    padding: 0.55rem 2rem 0.55rem 0.85rem;
  }

  :global(.rss-view-root .rss-view-entry-content .tg-expandable__checkbox) {
    display: none;
  }

  :global(.rss-view-root .rss-view-entry-content .tg-expandable__content) {
    display: block;
    user-select: text;
  }

  @supports selector(:has(*)) {
    :global(.rss-view-root .rss-view-entry-content .tg-expandable__content) {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      line-clamp: 3;
    }

    :global(.rss-view-root .rss-view-entry-content .tg-expandable:has(.tg-expandable__checkbox:checked) .tg-expandable__content) {
      display: block;
      overflow: visible;
      -webkit-box-orient: unset;
      -webkit-line-clamp: unset;
      line-clamp: unset;
      padding-bottom: 1.5rem;
    }

    :global(.rss-view-root .rss-view-entry-content .tg-expandable__toggle) {
      position: absolute;
      right: 0.5rem;
      bottom: 0.35rem;
      display: block;
      width: 1.4rem;
      height: 1.4rem;
      cursor: pointer;
      user-select: none;
      z-index: 1;
    }

    :global(.rss-view-root .rss-view-entry-content .tg-expandable__toggle::after) {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-top: 0.35rem solid transparent;
      border-bottom: 0.35rem solid transparent;
      border-left: 0.35rem solid var(--rss-secondary-color);
      transform: translate(-50%, -50%);
      transition: transform 0.2s ease;
    }

    :global(.rss-view-root .rss-view-entry-content .tg-expandable:has(.tg-expandable__checkbox:checked) .tg-expandable__toggle::after) {
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }

  :global(.rss-view-root .rss-view-entry-content pre),
  :global(.rss-view-root .rss-view-entry-content code) {
    word-break: break-word;
  }

  :global(.rss-view-root .rss-view-entry-content pre) {
    overflow-x: auto;
    padding: 0.75rem 0.9rem;
    border: 1px solid var(--rss-border-color);
    border-radius: 0.8rem;
    background: var(--rss-code-background);
    box-shadow: var(--rss-shadow);
  }

  :global(.rss-view-root .rss-view-entry-content table) {
    width: 100%;
    border-collapse: collapse;
  }

  :global(.rss-view-root .rss-view-entry-content th),
  :global(.rss-view-root .rss-view-entry-content td) {
    border: 1px solid var(--rss-border-color);
    padding: 0.45rem 0.7rem;
  }

  :global(.rss-view-root .rss-view-more) {
    display: flex;
    justify-content: center;
    margin-top: 1.75rem;
  }

  @media (max-width: 640px) {
    :global(.rss-view-root .rss-view-list) {
      margin-top: 1.1rem;
    }

    :global(.rss-view-root .rss-view-entry-content) {
      padding-left: 1rem;
      font-size: 0.94rem;
    }

    :global(.rss-view-root .rss-view-entry-content .rss-image-list) {
      width: min(100%, 22rem);
    }

    :global(.rss-view-root .rss-view-entry-content .rss-image-list:not(.rss-image-list-single)) {
      gap: 0.55rem;
    }
  }

  @keyframes rss-loading-slide {
    from {
      transform: translateX(0);
    }

    to {
      transform: translateX(185%);
    }
  }
</style>
