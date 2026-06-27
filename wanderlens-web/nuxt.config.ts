// wanderlens-web Nuxt 3 配置
export default defineNuxtConfig({
  compatibilityDate: '2024-06-24',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
  ],

  // 靜態資源目錄（明確指向專案根目錄 public/）
  dir: {
    public: 'public',
  },

  // 原始碼目錄
  srcDir: 'src/',

  // 元件自動註冊：子目錄不加前綴
  components: [
    { path: '~/components/', pathPrefix: false },
  ],

  // SSR
  ssr: true,

  // 全域 CSS
  css: [
    '~/assets/css/main.css',
  ],

  // Tailwind
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },

  // i18n
  i18n: {
    locales: [
      { code: 'zh', name: '中文', file: 'zh.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'jp', name: '日本語', file: 'jp.json' },
      { code: 'ka', name: '한국어', file: 'ka.json' },
    ],
    defaultLocale: 'zh',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'wl_lang',
      redirectOn: 'root',
    },
    compilation: {
      strictMessage: false,
    },
  },

  // 環境變數
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api',
      mediaBase: process.env.NUXT_PUBLIC_MEDIA_BASE || 'http://localhost:3004',
      gaId: process.env.NUXT_PUBLIC_GA_ID || '',
      pixelId: process.env.NUXT_PUBLIC_PIXEL_ID || '',
    },
  },

  // SEO
  app: {
    head: {
      title: 'WanderLens — 在地隨選攝影平台',
      htmlAttrs: { lang: 'zh-TW' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
        { name: 'description', content: 'WanderLens 是一個在地隨選攝影平台，媒合消費者與專業攝影師，提供線上預約、AI 快速交付、相簿留存的完整體驗。' },
        { name: 'keywords', content: '攝影,預約攝影,個人寫真,情侶寫真,全家福,婚禮攝影,旅拍,活動紀錄' },
        { property: 'og:title', content: 'WanderLens — 在地隨選攝影平台' },
        { property: 'og:description', content: '精彩時刻，攝影隨行' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
      ],
    },
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // 頁面載入進度條
  pageTransition: { name: 'page', mode: 'out-in' },

  // Vite alias：修正 unhead v2 將 getActiveHead 移至 legacy 子路徑，
  // 但 @nuxtjs/i18n 仍從主路徑 import 的相容性問題
  // 使用 $ 精確匹配，避免影響 unhead/client、unhead/plugins 等子路徑
  vite: {
    resolve: {
      alias: {
        // @nuxtjs/i18n 仍從 unhead 主路徑 import getActiveHead（已移至 legacy 子路徑）
        'unhead$': 'unhead/dist/legacy.mjs',
      },
    },
  },
})