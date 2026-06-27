import React from 'react'
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, View, StyleProp,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors, radius, typography } from '@/theme'
import { haptics } from '@/utils/haptics'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props {
  label: string
  onPress: () => void
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: keyof typeof Ionicons.glyphMap
  haptic?: false | 'light' | 'medium' | 'success'
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
  testID?: string
}

const makeSolid = (colors: AppColors): Record<string, string> => ({
  primary: colors.primary,
  secondary: colors.secondary,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
})

const SIZES: Record<Size, { padV: number; padH: number; font: number; icon: number }> = {
  sm: { padV: 9, padH: 14, font: 14, icon: 16 },
  md: { padV: 14, padH: 18, font: 16, icon: 18 },
  lg: { padV: 17, padH: 22, font: 17, icon: 20 },
}

export default function Button({
  label, onPress, variant = 'primary', size = 'md', disabled, loading, fullWidth,
  leftIcon, haptic = 'light', style, accessibilityLabel, testID,
}: Props) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const SOLID = React.useMemo(() => makeSolid(colors), [colors])
  const isOutline = variant === 'outline'
  const isGhost = variant === 'ghost'
  const isHollow = isOutline || isGhost
  const bg = isHollow ? 'transparent' : (SOLID[variant] ?? colors.primary)
  const fg = isHollow ? colors.primary : colors.white
  const dims = SIZES[size]

  const handlePress = () => {
    if (disabled || loading) return
    if (haptic) haptics[haptic]()
    onPress()
  }

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: bg, paddingVertical: dims.padV, paddingHorizontal: dims.padH },
        !isHollow && styles.shadow,
        isOutline && styles.outline,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <Ionicons name={leftIcon} size={dims.icon} color={fg} /> : null}
          <Text style={[typography.button, { color: fg, fontSize: dims.font }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  btn: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  outline: { borderWidth: 1.5, borderColor: colors.primary },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },
})
