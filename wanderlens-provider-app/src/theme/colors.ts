// WanderLens Design Token（與消費者 App 共用同一套色彩）
//
// 支援亮色 / 深色雙調色盤。亮色色值與導入深色模式前完全相同。

export const lightColors = {
  primary: '#F37A69',
  primaryDark: '#D85A49',
  primaryLight: '#FFF0EE',
  secondary: '#52B6CC',
  secondaryDark: '#3A9BB0',
  secondaryLight: '#E8F7FA',
  success: '#13CE66',
  successLight: '#E7FBF0',
  warning: '#FF9F40',
  warningLight: '#FFF4E6',
  danger: '#FF4D4F',
  dangerLight: '#FFECEC',
  info: '#909399',
  textPrimary: '#1F2937',
  text: '#1F2937',
  textRegular: '#4B5563',
  textSecondary: '#9CA3AF',
  textInverse: '#FFFFFF',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  background: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFBFC',
  overlay: 'rgba(17, 24, 39, 0.55)',
  white: '#FFFFFF',
  black: '#000000',
}

export const darkColors: AppColors = {
  primary: '#F37A69',
  primaryDark: '#D85A49',
  primaryLight: '#3A2420',
  secondary: '#52B6CC',
  secondaryDark: '#3A9BB0',
  secondaryLight: '#16323A',
  success: '#2BD675',
  successLight: '#12301F',
  warning: '#FFB05E',
  warningLight: '#352714',
  danger: '#FF6B6D',
  dangerLight: '#3A1E1F',
  info: '#A1A6AE',
  textPrimary: '#F3F4F6',
  text: '#F3F4F6',
  textRegular: '#CBD2DA',
  textSecondary: '#8A93A0',
  textInverse: '#1F2937',
  border: '#2C353F',
  borderStrong: '#3C4754',
  background: '#0E1318',
  surface: '#171F27',
  surfaceAlt: '#1F2932',
  overlay: 'rgba(0, 0, 0, 0.62)',
  white: '#FFFFFF',
  black: '#000000',
} as const

export type AppColors = { [K in keyof typeof lightColors]: string }
export type ColorScheme = 'light' | 'dark'

export function getColors(scheme: ColorScheme): AppColors {
  return scheme === 'dark' ? darkColors : lightColors
}

// 向後相容：未遷移到 useColors() 的程式碼仍可 import 靜態 colors（亮色）。
export const colors = lightColors
