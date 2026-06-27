import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as secureStorage from '@/utils/secureStorage'
import { getLocaleModule, setLocaleModule, translate, type Locale } from './core'
interface LocaleContextValue {
  locale: Locale
  setLocale: (next: Locale) => Promise<void>
  t: (key: string, params?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getLocaleModule())

  const setLocale = useCallback(async (next: Locale) => {
    setLocaleModule(next)
    setLocaleState(next)
    await secureStorage.setItemAsync('wl_locale', next)
  }, [])

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    t: (key, params) => translate(locale, key, params),
  }), [locale, setLocale])

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    return {
      locale: getLocaleModule(),
      setLocale: async (next: Locale) => { setLocaleModule(next) },
      t: (key: string, params?: Record<string, string | number>) => translate(getLocaleModule(), key, params),
    }
  }
  return ctx
}
