import { withBasePath } from '~/utils/path'

export async function GET() {
  // https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
  const manifest = {
    id: withBasePath('/'),
    name: 'Integrate Life - Blog of Mslxl',
    short_name: 'Integrate Life',
    description:
      'Integrate my thoughts and experiences on programming, technology, and more.',
    icons: [
      {
        src: withBasePath('favicon.png'),
        type: 'image/png',
        sizes: '80x80',
      },
    ],
    scope: withBasePath('/'),
    start_url: withBasePath('/'),
    display: 'standalone',
    theme_color: '#fff',
    background_color: '#fff',
  }

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  })
}
