import React, { useCallback, useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Switch, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import dayjs from 'dayjs'
import ScreenHeader from '@/components/ScreenHeader'
import StatCard from '@/components/StatCard'
import StateView from '@/components/StateView'
import { orderApi, matchApi, providerApi, type ProviderOrder, type MatchStats } from '@/api'
import MatchRequestModal from '@/components/MatchRequestModal'
import { useMatchWebSocket } from '@/hooks/useMatchWebSocket'
import { useLocation } from '@/hooks/useLocation'
import type { MatchBroadcastPayload } from '@/api/matchTypes'
import { useAuthStore } from '@/stores/authStore'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'
import { formatCurrency, formatSlotTime } from '@/utils/format'
import { STATUS_COLORS, STATUS_LABELS, PENDING_TASK_STATUSES, ACTIVE_ORDER_STATUSES } from '@/utils/orderStatus'
import type { HomeStackParamList } from '@/navigation/types'

type Nav = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>

export default function HomeScreen() {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const navigation = useNavigation<Nav>()
  const { t } = useLocale()
  const { user, providerId } = useAuthStore()
  const [orders, setOrders] = useState<ProviderOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)
  const [onlineMode, setOnlineMode] = useState(false)
  const [matchEnabled, setMatchEnabled] = useState(false)
  const [matchStats, setMatchStats] = useState<MatchStats>({})
  const [monthlyEarnings, setMonthlyEarnings] = useState(0)
  const [incomingRequest, setIncomingRequest] = useState<MatchBroadcastPayload | null>(null)
  const { refresh: refreshLocation } = useLocation()

  const { connected } = useMatchWebSocket(onlineMode, (payload) => {
    setIncomingRequest(payload)
  })

  const toggleOnline = async (value: boolean) => {
    if (value && !matchEnabled) {
      Alert.alert(t('home.matchClosed'), t('home.matchClosedDesc'))
      return
    }
    try {
      if (value) {
        // 取得 GPS 座標，供即時媒合距離計算；取不到則 fallback 不傳座標
        const coords = await refreshLocation()
        await matchApi.goOnline({
          lat: coords?.lat,
          lng: coords?.lng,
          city: coords?.city,
        })
      } else {
        await matchApi.goOffline()
      }
      setOnlineMode(value)
    } catch {
      Alert.alert(t('common.failed'), t('home.toggleFailed'))
    }
  }

  React.useEffect(() => {
    matchApi.getPublicStatus().then((res: any) => {
      setMatchEnabled(!!res.data?.instantMatchEnabled)
    }).catch(() => {})
    matchApi.onlineStatus().then((res: any) => {
      if (res.data?.online) setOnlineMode(true)
    }).catch(() => {})
  }, [])

  const loadData = useCallback(async () => {
    setError(false)
    try {
      const res: { data?: ProviderOrder[] } = await orderApi.providerOrders()
      setOrders(res.data || [])
      if (providerId) {
        const [statsRes, earningsRes]: any[] = await Promise.all([
          matchApi.getStats().catch(() => ({ data: {} })),
          providerApi.getEarnings(providerId).catch(() => ({ data: {} })),
        ])
        setMatchStats(statsRes.data || {})
        setMonthlyEarnings(earningsRes.data?.monthlyEarnings ?? 0)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [providerId])

  React.useEffect(() => { loadData() }, [loadData])

  const today = dayjs().format('YYYY-MM-DD')

  const todayOrders = orders.filter((o) => o.shootingDate === today)

  const pendingTasks = orders.filter((o) => PENDING_TASK_STATUSES.includes(o.status))
  const upcoming = orders
    .filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status) && o.shootingDate && o.shootingDate >= today)
    .sort((a, b) => `${a.shootingDate}${a.timeStart}`.localeCompare(`${b.shootingDate}${b.timeStart}`))
    .slice(0, 5)

  const todoCount = pendingTasks.length + todayOrders.filter((o) => o.status === 'ReadyToShoot').length

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('nav.home')} subtitle={`${t('home.greeting')}，${user?.username || t('home.photographer')}`} large />
        <StateView type="loading" message={t('home.loadingDashboard')} />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('nav.home')} large />
        <StateView type="error" onRetry={() => { setLoading(true); loadData() }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('nav.home')} subtitle={`${t('home.greeting')}，${user?.username || t('home.photographer')}`} large />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData() }} colors={[colors.primary]} />}
      >
        {/* 接單模式 */}
        <View style={styles.onlineCard}>
          <View style={styles.onlineLeft}>
            <View style={[styles.onlineDot, onlineMode && styles.onlineDotActive]} />
            <View>
              <Text style={styles.onlineTitle}>{onlineMode ? t('home.onlineOn') : t('home.onlineOff')}</Text>
              <Text style={styles.onlineDesc}>
                {onlineMode ? t('home.onlineOnDesc') : t('home.onlineOffDesc')}
              </Text>
              {onlineMode ? (
                <View style={styles.wsStatusRow}>
                  <View style={[styles.wsDot, connected ? styles.wsDotConnected : styles.wsDotConnecting]} />
                  <Text style={styles.wsStatusText}>
                    {connected ? t('home.wsConnected') : t('home.wsConnecting')}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <Switch
            value={onlineMode}
            onValueChange={toggleOnline}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={onlineMode ? colors.primary : colors.white}
            accessibilityRole="switch"
            accessibilityLabel={onlineMode ? t('home.onlineOn') : t('home.onlineOff')}
          />
        </View>

        {matchEnabled ? (
          <View style={styles.matchStatsCard}>
            <View style={styles.matchStatsLeft}>
              <Ionicons name="flash-outline" size={20} color={colors.primary} />
              <Text style={styles.matchStatsTitle}>{t('home.instantMatch')}</Text>
            </View>
            <Text style={styles.matchStatsValue}>
              {t('home.matchStatsValue', { today: matchStats.todayAccepted ?? 0, month: matchStats.monthAccepted ?? 0 })}
            </Text>
          </View>
        ) : null}

        {/* 統計卡片 */}
        <View style={styles.statsRow}>
          <StatCard label={t('home.todayOrders')} value={todayOrders.length} icon="today-outline" accent={colors.primary} />
          <View style={{ width: spacing.md }} />
          <StatCard label={t('home.monthEarnings')} value={formatCurrency(monthlyEarnings)} icon="trending-up-outline" accent={colors.secondary} />
          <View style={{ width: spacing.md }} />
          <StatCard label={t('home.todo')} value={todoCount} icon="checkbox-outline" accent={colors.warning} />
        </View>

        {/* 即將拍攝 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.upcomingShoots')}</Text>
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate('Orders')}
              accessibilityRole="button"
              accessibilityLabel={t('common.viewAll')}
            >
              <Text style={styles.sectionLink}>{t('common.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {upcoming.length === 0 ? (
            <View style={styles.emptySection}>
              <Ionicons name="calendar-outline" size={32} color={colors.textSecondary} />
              <Text style={styles.emptyText}>{t('home.noUpcoming')}</Text>
            </View>
          ) : (
            upcoming.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                accessibilityRole="button"
                accessibilityLabel={`${order.orderNo} ${STATUS_LABELS[order.status] || order.status}`}
              >
                <View style={styles.orderDateBox}>
                  <Text style={styles.orderDateDay}>{dayjs(order.shootingDate).format('DD')}</Text>
                  <Text style={styles.orderDateMonth}>{dayjs(order.shootingDate).format('MMM')}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderNo}>{order.orderNo}</Text>
                  <Text style={styles.orderMeta}>
                    {formatSlotTime(order.timeStart, order.timeEnd)} · {order.consumerName || t('common.customer')}
                  </Text>
                  {order.location ? (
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                      <Text style={styles.locationText} numberOfLines={1}>{order.location}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={[styles.statusPill, { backgroundColor: (STATUS_COLORS[order.status] || colors.info) + '20' }]}>
                  <Text style={[styles.statusPillText, { color: STATUS_COLORS[order.status] || colors.info }]}>
                    {STATUS_LABELS[order.status] || order.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* 待處理任務 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.pendingTitle')}</Text>
          {pendingTasks.length === 0 ? (
            <View style={styles.emptySection}>
              <Ionicons name="checkmark-circle-outline" size={32} color={colors.success} />
              <Text style={styles.emptyText}>{t('home.allDone')}</Text>
            </View>
          ) : (
            pendingTasks.slice(0, 4).map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.taskCard}
                onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                accessibilityRole="button"
                accessibilityLabel={order.status === 'WaitingProviderContact' ? t('home.taskContact') : t('home.taskPrepare')}
              >
                <View style={[styles.taskIcon, { backgroundColor: colors.warning + '18' }]}>
                  <Ionicons
                    name={order.status === 'WaitingProviderContact' ? 'call-outline' : 'camera-outline'}
                    size={20}
                    color={colors.warning}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle}>
                    {order.status === 'WaitingProviderContact' ? t('home.taskContact') : t('home.taskPrepare')}
                  </Text>
                  <Text style={styles.taskSub}>{order.orderNo} · {order.shootingDate}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <MatchRequestModal
        payload={incomingRequest}
        onClose={() => setIncomingRequest(null)}
        onAccepted={() => loadData()}
      />
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  onlineCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  onlineLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1, marginRight: spacing.md },
  onlineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.textSecondary },
  onlineDotActive: { backgroundColor: colors.success },
  onlineTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  onlineDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2, maxWidth: 220 },
  wsStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  wsDot: { width: 8, height: 8, borderRadius: 4 },
  wsDotConnected: { backgroundColor: colors.success },
  wsDotConnecting: { backgroundColor: colors.textSecondary },
  wsStatusText: { fontSize: 11, color: colors.textSecondary },
  matchStatsCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg,
  },
  matchStatsLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  matchStatsTitle: { fontSize: 14, fontWeight: '700', color: colors.primary },
  matchStatsValue: { fontSize: 13, color: colors.textRegular, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginBottom: spacing.lg },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  sectionLink: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  emptySection: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xxl,
    alignItems: 'center', gap: spacing.sm,
  },
  emptyText: { fontSize: 14, color: colors.textSecondary },
  orderCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  orderDateBox: {
    width: 48, height: 52, borderRadius: radius.md, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  orderDateDay: { fontSize: 18, fontWeight: '800', color: colors.primary },
  orderDateMonth: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  orderNo: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  orderMeta: { fontSize: 13, color: colors.textRegular, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  taskCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm,
  },
  taskIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  taskTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  taskSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
})
