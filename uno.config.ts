import presetAttributify from '@unocss/preset-attributify'
import transformerDirectives from '@unocss/transformer-directives'
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerVariantGroup,
} from 'unocss'
import { themeConfig } from './src/.config'

const { theme, colorsDark, colorsLight, fonts } = themeConfig.appearance

const colors = theme === 'dark' ? colorsDark : colorsLight

const cssExtend = {
  ':root': {
    '--prose-borders': '#eee',
  },

  'code::before,code::after': {
    content: 'none',
  },

  ':where(:not(pre):not(a) > code)': {
    'padding': '2px 4px',
    'color': '#c7254e',
    'font-size': '90%',
    'background-color': '#f9f2f4',
    'border-radius': '4px',
  },
}

export default defineConfig({
  rules: [
    [
      /^row-(\d+)-(\d)$/,
      ([, start, end]) => ({ 'grid-row': `${start}/${end}` }),
    ],
    [
      /^col-(\d+)-(\d)$/,
      ([, start, end]) => ({ 'grid-column': `${start}/${end}` }),
    ],
    [
      /^scrollbar-hide$/,
      ([_]) => `.scrollbar-hide { scrollbar-width:none;-ms-overflow-style: none; }
      .scrollbar-hide::-webkit-scrollbar {display:none;}`,
    ],
  ],
  presets: [
    presetUno(),
    presetTypography({ cssExtend }),
    presetAttributify(),
    presetIcons({ scale: 1.2, warn: true }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        Noto: [
          {
            name: 'Noto Sans HK',
            weights: ['400', '600'],
            italic: true,
          },
          {
            name: 'Noto Sans SC',
            weights: ['400', '600'],
            italic: true,
          },
          {
            name: 'Noto Serif HK',
            weights: ['400', '700'],
            italic: true,
          },
          {
            name: 'Noto Serif SC',
            weights: ['400', '700'],
            italic: true,
          },
        ],
      },
    }),
  ],
  theme: {
    colors,
    fontFamily: fonts,
  },
  shortcuts: [
    ['post-title', 'text-5 font-bold lh-7.5 m-0'],
    ['underline-hover', 'p-0.5 underline decoration-2 underline-offset-4 hover:decoration-none hover:color-background hover:bg-foreground'],
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: [
    ...themeConfig.site.socialLinks.map(social => `i-mdi-${social.name}`),
    'i-mdi-content-copy',
    'i-mdi-check',
  ],
})
