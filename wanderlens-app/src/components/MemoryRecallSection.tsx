import React from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { spacing } from '@/theme/typography'
import { shadows, useColors, AppColors } from '@/theme'

export interface RecallItem {
  type: 'ANNIVERSARY' | 'BABY_MONTH' | 'TRAVEL' | string
  title: string
  subtitle: string
  orderId?: number
  albumId?: number
  shootingDate?: string
  shootingLocation?: string
  actionLabel?: string
}

const makeTypeMeta = (colors: AppColors): Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> => ({
  ANNIVERSARY: { icon: 'heart', color: colors.primary, bg: colors.primaryLight },
  BABY_MONTH: { icon: 'happy-outline', color: colors.warning, bg: colors.warningLight },
  TRAVEL: { icon: 'airplane-outline', color: colors.secondary, bg: colors.secondaryLight },
})

interface Props {
  items: RecallItem[]
  loading?: boolean
  onPressItem: (item: RecallItem) => void
  onPressViewAll?: () => void
}

export default function MemoryRecallSection({ items, loading, onPressItem, onPressViewAll }: Props) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const TYPE_META = React.useMemo(() => makeTypeMeta(colors), [colors])
  if (loading) {
    return (
      <View style={styles.section}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  if (items.length === 0) return null

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>回憶召回</Text>
        {onPressViewAll ? (
          <TouchableOpacity onPress={onPressViewAll}>
            <Text style={styles.more}>拍攝足跡</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {items.map((item, index) => {
          const meta = TYPE_META[item.type] || TYPE_META.ANNIVERSARY
          return (
            <TouchableOpacity
              key={`${item.type}-${item.orderId || index}`}
              style={[styles.card, { backgroundColor: meta.bg }]}
              activeOpacity={0.9}
              onPress={() => onPressItem(item)}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
                <Ionicons name={meta.icon} size={22} color={meta.color} />
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardSubtitle} numberOfLines={2}>{item.subtitle}</Text>
              <View style={styles.actionRow}>
                <Text style={[styles.actionText, { color: meta.color }]}>
                  {item.actionLabel || '查看'}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={meta.color} />
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  section: { marginBottom: spacing.lg, paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  more: { fontSize: 13, fontWeight: '600', color: colors.secondary },
  scroll: { gap: spacing.md, paddingRight: spacing.lg },
  card: {
    width: 220,
    borderRadius: 16,
    padding: spacing.lg,
    ...shadows.sm,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: colors.textRegular, lineHeight: 18, minHeight: 36 },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: 2 },
  actionText: { fontSize: 13, fontWeight: '700' },
})
