import { createI18n } from 'vue-i18n'
import zh from '@/locales/zh.json'
import en from '@/locales/en.json'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import enEl from 'element-plus/es/locale/lang/en'

const savedLang = typeof localStorage !== 'undefined'
  ? localStorage.getItem('wl_lang') || 'zh'
  : 'zh'

export const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'zh',
  messages: { zh, en },
})

export function getElementLocale(lang: string) {
  return lang === 'en' ? enEl : zhTw
}

export function setLocale(lang: 'zh' | 'en') {
  i18n.global.locale.value = lang
  localStorage.setItem('wl_lang', lang)
}
