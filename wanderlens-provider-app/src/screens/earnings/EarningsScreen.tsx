import React, { useCallback, useState } from 'react'
import {
  View, Text, FlatList, StyleSheet, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import ScreenHeader from '@/components/ScreenHeader'
import StatCard from '@/components/StatCard'
import StateView from '@/components/StateView'
import { providerApi, type ProviderEarnings } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'
import { formatCurrency } from '@/utils/format'
import { STATUS_LABELS } from '@/utils/orderStatus'

export default function EarningsScreen() {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const { providerId } = useAuthStore()
  const [earnings, setEarnings] = useState<ProviderEarnings | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    if (!providerId) return
    setError(false)
    try {
      const res: { data?: ProviderEarnings } = await providerApi.getEarnings(providerId)
      setEarnings(res.data || null)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [providerId])

  React.useEffect(() => { load() }, [load])

  const items = earnings?.items ?? []

  const renderItem = ({ item }: { item: ProviderEarnings['items'][0] }) => (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: item.settled ? colors.success + '18' : colors.warning + '18' }]}>
        <Ionicons
          name={item.settled ? 'checkmark-circle' : 'time'}
          size={20}
          color={item.settled ? colors.success : colors.warning}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{item.orderNo}</Text>
        <Text style={styles.rowSub}>
          {item.shootingDate || '—'} · {STATUS_LABELS[item.status] || item.status}
        </Text>
      </View>
      <Text style={styles.rowAmount}>{formatCurrency(item.amount)}</Text>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('earnings.title')} subtitle={t('earnings.subtitle')} large />
        <StateView type="skeleton" />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('earnings.title')} large />
        <StateView type="error" onRetry={() => { setLoading(true); load() }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('earnings.title')} subtitle={`${dayjs().format(t('earnings.monthFormat'))}`} large />

      <View style={styles.statsRow}>
        <StatCard label={t('earnings.month')} value={formatCurrency(earnings?.monthlyEarnings ?? 0)} icon="calendar-outline" accent={colors.primary} />
        <View style={{ width: spacing.md }} />
        <StatCard label={t('earnings.total')} value={formatCurrency(earnings?.totalEarnings ?? 0)} icon="stats-chart-outline" accent={colors.secondary} />
      </View>
      <View style={[styles.statsRow, { paddingHorizontal: spacing.lg, marginTop: -spacing.sm }]}>
        <StatCard label={t('earnings.pending')} value={formatCurrency(earnings?.pendingSettlement ?? 0)} icon="hourglass-outline" accent={colors.warning} style={{ flex: 1 }} />
        <View style={{ width: spacing.md }} />
        <StatCard label={t('earnings.withdrawable')} value={formatCurrency(earnings?.withdrawable ?? 0)} icon="wallet-outline" accent={colors.success} style={{ flex: 1 }} />
      </View>

      <Text style={styles.listTitle}>{t('earnings.detail')}</Text>

      {items.length === 0 ? (
        <StateView type="empty" message={t('earnings.noRecords')} icon="wallet-outline" />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.orderId)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} colors={[colors.primary]} />}
        />
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  listTitle: {
    fontSize: 17, fontWeight: '700', color: colors.textPrimary,
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  rowIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  rowSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  rowAmount: { fontSize: 16, fontWeight: '800', color: colors.secondary },
})
