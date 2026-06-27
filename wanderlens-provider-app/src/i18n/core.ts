import zh from '@/locales/zh.json'
import en from '@/locales/en.json'
import * as secureStorage from '@/utils/secureStorage'

export type Locale = 'zh' | 'en'
type Dict = Record<string, unknown>

const dicts: Record<Locale, Dict> = { zh, en }

let moduleLocale: Locale = 'zh'

export function getLocaleModule(): Locale {
  return moduleLocale
}

export function setLocaleModule(next: Locale) {
  moduleLocale = next
}

export async function restoreLocale(): Promise<Locale> {
  try {
    const saved = await secureStorage.getItemAsync('wl_provider_locale')
    if (saved === 'en' || saved === 'zh') {
      moduleLocale = saved
      return saved
    }
  } catch {
    // ignore
  }
  return moduleLocale
}

export function translate(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const parts = key.split('.')
  let node: unknown = dicts[locale]
  for (const part of parts) {
    if (node && typeof node === 'object' && part in (node as Dict)) {
      node = (node as Dict)[part]
    } else {
      return key
    }
  }
  if (typeof node !== 'string') return key
  if (!params) return node
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
    node,
  )
}

export function t(key: string, params?: Record<string, string | number>): string {
  return translate(moduleLocale, key, params)
}
