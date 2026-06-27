import React from 'react'
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors, radius, spacing, typography } from '@/theme'
import { SkeletonList } from '@/components/Skeleton'
import Text from '@/components/Text'
import { t } from '@/i18n'

interface Props {
  type: 'loading' | 'skeleton' | 'empty' | 'error'
  message?: string
  subMessage?: string
  icon?: keyof typeof Ionicons.glyphMap
  onRetry?: () => void
  actionLabel?: string
  onAction?: () => void
  skeletonCount?: number
}

export default function StateView({
  type, message, subMessage, icon, onRetry, actionLabel, onAction, skeletonCount,
}: Props) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  if (type === 'skeleton') {
    return <SkeletonList count={skeletonCount ?? 5} />
  }

  if (type === 'loading') {
    return (
      <View style={styles.center} accessibilityRole="progressbar" accessibilityLabel={message || t('common.loading')}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="bodySmall" muted style={styles.hint}>{message || t('common.loading')}</Text>
      </View>
    )
  }

  const defaultIcon = type === 'error' ? 'cloud-offline-outline' : 'file-tray-outline'
  const defaultMsg = type === 'error' ? t('common.error') : t('common.empty')

  return (
    <View style={styles.center}>
      <View style={styles.iconWrap}>
        <View style={styles.iconBg} />
        <Ionicons name={icon || defaultIcon} size={48} color={colors.primary} />
      </View>
      <Text variant="h3" align="center">{message || defaultMsg}</Text>
      {subMessage ? <Text variant="bodySmall" muted align="center" style={styles.subMsg}>{subMessage}</Text> : null}

      {type === 'error' && onRetry ? (
        <TouchableOpacity
          style={styles.btn}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={t('common.retry')}
        >
          <Ionicons name="refresh-outline" size={18} color={colors.white} />
          <Text style={[typography.button, { color: colors.white }]}>{t('common.retry')}</Text>
        </TouchableOpacity>
      ) : null}

      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.btn} onPress={onAction} accessibilityRole="button" accessibilityLabel={actionLabel}>
          <Text style={[typography.button, { color: colors.white }]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  iconWrap: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  iconBg: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.primaryLight,
  },
  hint: { marginTop: spacing.sm },
  subMsg: { marginTop: spacing.sm, maxWidth: 260 },
  btn: {
    marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, paddingHorizontal: 28,
    paddingVertical: 14, borderRadius: radius.lg, shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
})
