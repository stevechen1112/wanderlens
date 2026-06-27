import React, { useCallback, useState } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { orderApi, type ProviderOrder } from '@/api'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'
import { formatCurrency, formatSlotTime } from '@/utils/format'
import { STATUS_COLORS, STATUS_LABELS } from '@/utils/orderStatus'
import type { OrderStackParamList } from '@/navigation/types'

type Nav = NativeStackNavigationProp<OrderStackParamList, 'OrderList'>

const FILTER_TABS = [
  { key: 'all', labelKey: 'order.filterAll' },
  { key: 'WaitingProviderContact', labelKey: 'order.filterContact' },
  { key: 'ReadyToShoot', labelKey: 'order.filterReady' },
  { key: 'ShootingStarted', labelKey: 'order.filterShooting' },
  { key: 'Delivered', labelKey: 'order.filterDelivered' },
  { key: 'Closed', labelKey: 'order.filterClosed' },
]

export default function OrderListScreen() {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const navigation = useNavigation<Nav>()
  const { t } = useLocale()
  const [orders, setOrders] = useState<ProviderOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState('all')

  const loadOrders = useCallback(async () => {
    setError(false)
    try {
      const res: { data?: ProviderOrder[] } = await orderApi.providerOrders()
      setOrders(res.data || [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  React.useEffect(() => { loadOrders() }, [loadOrders])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const renderItem = ({ item }: { item: ProviderOrder }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      accessibilityRole="button"
      accessibilityLabel={`${item.orderNo} ${STATUS_LABELS[item.status] || item.status}`}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderNo}>{item.orderNo}</Text>
        <View style={[styles.badge, { backgroundColor: (STATUS_COLORS[item.status] || colors.info) + '20' }]}>
          <Text style={[styles.badgeText, { color: STATUS_COLORS[item.status] || colors.info }]}>
            {STATUS_LABELS[item.status] || item.status}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.meta}>
          {item.shootingDate} {formatSlotTime(item.timeStart, item.timeEnd)}
        </Text>
      </View>
      {item.consumerName ? (
        <View style={styles.row}>
          <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.meta}>{item.consumerName}</Text>
        </View>
      ) : null}
      {item.location ? (
        <View style={styles.row}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.meta} numberOfLines={1}>{item.location}</Text>
        </View>
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.profitLabel}>{t('order.estProfit')}</Text>
        <Text style={styles.profitValue}>{formatCurrency(item.photographerProfit)}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('order.myOrders')} subtitle={t('order.count', { n: orders.length })} large />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, filter === tab.key && styles.filterTabActive]}
            onPress={() => setFilter(tab.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === tab.key }}
            accessibilityLabel={t(tab.labelKey)}
          >
            <Text style={[styles.filterText, filter === tab.key && styles.filterTextActive]}>{t(tab.labelKey)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <StateView type="skeleton" />
      ) : error ? (
        <StateView type="error" onRetry={() => { setLoading(true); loadOrders() }} />
      ) : filtered.length === 0 ? (
        <StateView type="empty" message={t('order.noMatch')} icon="receipt-outline" />
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrders() }} colors={[colors.primary]} />}
        />
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterBar: { maxHeight: 48, marginBottom: spacing.sm },
  filterContent: { paddingHorizontal: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  filterTab: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textRegular },
  filterTextActive: { color: colors.white },
  list: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  orderNo: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  meta: { fontSize: 13, color: colors.textRegular, flex: 1 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border,
  },
  profitLabel: { fontSize: 13, color: colors.textSecondary },
  profitValue: { fontSize: 18, fontWeight: '800', color: colors.secondary },
})
