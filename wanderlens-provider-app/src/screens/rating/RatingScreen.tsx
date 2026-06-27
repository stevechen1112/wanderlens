import React, { useCallback, useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { providerApi, type RatingSummary } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'
import { formatRelativeTime } from '@/utils/format'

function StarRow({ stars, size = 18 }: { stars: number; size?: number }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= stars ? 'star' : 'star-outline'}
          size={size}
          color={colors.warning}
        />
      ))}
    </View>
  )
}

export default function RatingScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const { providerId } = useAuthStore()
  const [rating, setRating] = useState<RatingSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    if (!providerId) return
    setError(false)
    try {
      const res: { data?: RatingSummary } = await providerApi.getRating(providerId)
      setRating(res.data || null)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [providerId])

  React.useEffect(() => { load() }, [load])

  const avg = rating?.averageRating ?? 0
  const total = rating?.totalCount ?? 0
  const distribution = rating?.distribution ?? {}
  const maxCount = Math.max(...Object.values(distribution).map(Number), 1)

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('rating.myRating')} onBack={() => navigation.goBack()} />
        <StateView type="skeleton" />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('rating.myRating')} onBack={() => navigation.goBack()} />
        <StateView type="error" onRetry={() => { setLoading(true); load() }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('rating.myRating')} onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} colors={[colors.primary]} />}
      >
        {/* 評分摘要 */}
        <View style={styles.summaryCard}>
          <Text style={styles.avgScore}>{avg.toFixed(1)}</Text>
          <StarRow stars={Math.round(avg)} size={24} />
          <Text style={styles.totalCount}>{t('rating.totalCount', { n: total })}</Text>
        </View>

        {/* 分布圖 */}
        {total > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('rating.distribution')}</Text>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = Number(distribution[String(star)] ?? distribution[star] ?? 0)
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
              return (
                <View key={star} style={styles.distRow}>
                  <Text style={styles.distLabel}>{t('rating.starLabel', { n: star })}</Text>
                  <View style={styles.distBarBg}>
                    <View style={[styles.distBarFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.distCount}>{count}</Text>
                </View>
              )
            })}
          </View>
        )}

        {/* 近期評價 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('rating.feedback')}</Text>
          {(rating?.recentRatings ?? []).length === 0 ? (
            <View style={styles.emptyFeedback}>
              <Ionicons name="star-outline" size={36} color={colors.textSecondary} />
              <Text style={styles.emptyText}>{t('rating.noConsumerFeedback')}</Text>
            </View>
          ) : (
            (rating?.recentRatings ?? []).map((r) => (
              <View key={r.id} style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <View style={styles.feedbackAvatar}>
                    <Text style={styles.feedbackAvatarText}>
                      {(r.consumerName || t('common.customer')).charAt(0)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.feedbackName}>{r.consumerName || t('rating.anonymous')}</Text>
                    <StarRow stars={r.stars} size={14} />
                  </View>
                  <Text style={styles.feedbackTime}>{formatRelativeTime(r.createdAt)}</Text>
                </View>
                {r.comments ? (
                  <Text style={styles.feedbackComment}>{r.comments}</Text>
                ) : (
                  <Text style={styles.feedbackNoComment}>{t('rating.noComment')}</Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  summaryCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xxxl,
    alignItems: 'center', marginBottom: spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  avgScore: { fontSize: 56, fontWeight: '800', color: colors.primary },
  starRow: { flexDirection: 'row', gap: 2, marginTop: spacing.sm },
  totalCount: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm },
  section: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  distLabel: { width: 36, fontSize: 13, color: colors.textRegular },
  distBarBg: { flex: 1, height: 8, backgroundColor: colors.background, borderRadius: 4, overflow: 'hidden' },
  distBarFill: { height: '100%', backgroundColor: colors.warning, borderRadius: 4 },
  distCount: { width: 28, fontSize: 12, color: colors.textSecondary, textAlign: 'right' },
  emptyFeedback: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
  emptyText: { fontSize: 14, color: colors.textSecondary },
  feedbackCard: {
    borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.md, marginBottom: spacing.md,
  },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  feedbackAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.secondaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  feedbackAvatarText: { fontSize: 16, fontWeight: '700', color: colors.secondary },
  feedbackName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  feedbackTime: { fontSize: 11, color: colors.textSecondary },
  feedbackComment: { fontSize: 14, color: colors.textRegular, lineHeight: 20, marginTop: spacing.sm },
  feedbackNoComment: { fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', marginTop: spacing.sm },
})
