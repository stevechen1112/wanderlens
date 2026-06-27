import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Appearance } from 'react-native'
import * as secureStorage from '@/utils/secureStorage'
import { AppColors, ColorScheme, getColors } from './colors'

export type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'wl_theme'

interface ThemeContextValue {
  mode: ThemeMode
  scheme: ColorScheme
  colors: AppColors
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function resolveScheme(mode: ThemeMode): ColorScheme {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
  }
  return mode
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system')
  const [scheme, setScheme] = useState<ColorScheme>(resolveScheme('system'))

  useEffect(() => {
    secureStorage.getItemAsync(STORAGE_KEY).then((v) => {
      if (v === 'light' || v === 'dark' || v === 'system') {
        setModeState(v)
        setScheme(resolveScheme(v))
      }
    })
  }, [])

  useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      if (mode === 'system') {
        setScheme(resolveScheme('system'))
      }
    })
    return () => sub.remove()
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    setScheme(resolveScheme(next))
    secureStorage.setItemAsync(STORAGE_KEY, next).catch(() => {})
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, scheme, colors: getColors(scheme), setMode }),
    [mode, scheme, setMode]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    // Provider 尚未掛載時的安全回退（亮色）
    return { mode: 'system', scheme: 'light', colors: getColors('light'), setMode: () => {} }
  }
  return ctx
}

export function useColors(): AppColors {
  return useTheme().colors
}
