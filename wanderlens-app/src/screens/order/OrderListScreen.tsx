import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { shadows, useColors, type AppColors } from '@/theme'
import { bookingApi } from '@/api'
import StateView from '@/components/StateView'
import { t } from '@/i18n'

const STATUS_LABELS: Record<string, string> = {
  Draft: '草稿', PendingPayment: '待付款', Paid: '已付款',
  WaitingProviderContact: '等待聯繫', Confirmed: '已確認',
  ReadyToShoot: '待拍攝', ShootingStarted: '拍攝中', ShootingEnded: '拍攝結束',
  UploadingRaw: '上傳中', AiProcessing: 'AI處理中', Delivered: '已交付',
  Cancelled: '已取消', Closed: '已結案', Refunded: '已退款', Disputed: '爭議中',
}

const makeStatusColors = (colors: AppColors): Record<string, string> => ({
  PendingPayment: colors.warning, Paid: colors.success, Confirmed: colors.secondary,
  ReadyToShoot: colors.primary, ShootingStarted: colors.primary, Delivered: colors.success,
  Cancelled: colors.textSecondary, Refunded: colors.textSecondary, Disputed: colors.danger,
})

export default function OrderListScreen({ navigation }: any) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const STATUS_COLORS = React.useMemo(() => makeStatusColors(colors), [colors])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const loadOrders = useCallback(async () => {
    setError(false)
    try {
      const res: any = await bookingApi.myOrders()
      setOrders(res.data || [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { loadOrders() }, [loadOrders])

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const filterTabs = [
    { key: 'all', label: '全部' },
    { key: 'PendingPayment', label: '待付款' },
    { key: 'Paid', label: '已付款' },
    { key: 'Delivered', label: '已交付' },
    { key: 'Closed', label: '已結案' },
  ]

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      accessibilityRole="button"
      accessibilityLabel={`訂單 ${item.orderNo}`}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>{item.orderNo}</Text>
        <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[item.status] || colors.textSecondary) + '20' }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || colors.textSecondary }]}>
            {STATUS_LABELS[item.status] || item.status}
          </Text>
        </View>
      </View>
      <View style={styles.orderBody}>
        <View style={styles.orderRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.orderInfo}>{item.shootingDate} {item.timeStart}-{item.timeEnd}</Text>
        </View>
        {item.photographerName ? (
          <View style={styles.orderRow}>
            <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.orderInfo}>{item.photographerName}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.priceLabel}>訂單金額</Text>
        <Text style={styles.priceValue}>$ {item.totalFee?.toLocaleString() || 0}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {filterTabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, filter === tab.key && styles.filterTabActive]}
            onPress={() => setFilter(tab.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === tab.key }}
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.filterTabText, filter === tab.key && styles.filterTabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <StateView type="skeleton" />
      ) : error ? (
        <StateView type="error" onRetry={() => { setLoading(true); loadOrders() }} />
      ) : filteredOrders.length === 0 ? (
        <StateView
          type="empty"
          message={t('order.empty')}
          subMessage="開始預約拍攝，您的訂單將顯示在這裡"
          icon="receipt-outline"
          actionLabel="立即預約拍攝"
          onAction={() => navigation.navigate('Booking')}
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOrders() }} tintColor={colors.primary} />}
        />
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterBar: { paddingVertical: 10, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, maxHeight: 52 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.background, marginRight: 8 },
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: 13, color: colors.textSecondary },
  filterTabTextActive: { color: colors.white, fontWeight: '600' },
  orderCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12,
    ...shadows.sm,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderNo: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  orderBody: { gap: 6, marginBottom: 12 },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  orderInfo: { fontSize: 14, color: colors.textSecondary },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
})
