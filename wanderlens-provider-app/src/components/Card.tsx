import React from 'react'
import { View, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { radius, shadows, spacing, useColors, AppColors } from '@/theme'

interface Props {
  children: React.ReactNode
  onPress?: () => void
  elevation?: 'none' | 'sm' | 'md' | 'lg'
  padded?: boolean
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
  testID?: string
}

export default function Card({
  children, onPress, elevation = 'sm', padded = true, style, accessibilityLabel, testID,
}: Props) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const content = (
    <View
      style={[
        styles.card,
        shadows[elevation],
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        {content}
      </TouchableOpacity>
    )
  }
  return content
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  padded: {
    padding: spacing.lg,
  },
})
