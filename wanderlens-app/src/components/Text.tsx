import React from 'react'
import { Text as RNText, TextProps as RNTextProps, TextStyle, StyleProp } from 'react-native'
import { typography, useColors, AppColors, TypographyVariant } from '@/theme'

type ColorToken = keyof AppColors

interface Props extends RNTextProps {
  variant?: TypographyVariant
  color?: ColorToken | string
  align?: TextStyle['textAlign']
  weight?: TextStyle['fontWeight']
  muted?: boolean
  style?: StyleProp<TextStyle>
  children?: React.ReactNode
}

function resolveColor(colors: AppColors, color?: ColorToken | string, muted?: boolean): string {
  if (color) return (colors as Record<string, string>)[color] ?? color
  if (muted) return colors.textSecondary
  return colors.textPrimary
}

export default function Text({
  variant = 'body', color, align, weight, muted, style, children, ...rest
}: Props) {
  const colors = useColors()
  return (
    <RNText
      style={[
        typography[variant],
        { color: resolveColor(colors, color, muted) },
        align ? { textAlign: align } : null,
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  )
}
