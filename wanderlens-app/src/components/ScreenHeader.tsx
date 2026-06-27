import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors, spacing } from '@/theme'

interface Props {
  title: string
  subtitle?: string
  onBack?: () => void
  rightAction?: React.ReactNode
  large?: boolean
}

export default function ScreenHeader({ title, subtitle, onBack, rightAction, large }: Props) {
  const insets = useSafeAreaInsets()
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const topPad = Platform.OS === 'web' ? 12 : insets.top

  return (
    <View style={[styles.wrap, { paddingTop: topPad + (large ? 8 : 4) }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="返回"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        {!large && (
          <View style={styles.center}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
          </View>
        )}
        <View style={styles.right}>{rightAction || <View style={styles.backPlaceholder} />}</View>
      </View>
      {large && (
        <View style={styles.largeBlock}>
          <Text style={styles.largeTitle}>{title}</Text>
          {subtitle ? <Text style={styles.largeSubtitle}>{subtitle}</Text> : null}
        </View>
      )}
    </View>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm + 4,
    paddingHorizontal: spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  backPlaceholder: { width: 44 },
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  right: { minWidth: 44, alignItems: 'flex-end' },
  largeBlock: { paddingHorizontal: 12, paddingTop: 4, paddingBottom: 4 },
  largeTitle: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
  largeSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
})
