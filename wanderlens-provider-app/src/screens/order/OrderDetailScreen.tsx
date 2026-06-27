import React, { useCallback, useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, Alert, Modal, TextInput, Linking,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ScreenHeader from '@/components/ScreenHeader'
import Button from '@/components/Button'
import StateView from '@/components/StateView'
import { orderApi, type ProviderOrder, type ShootEvent } from '@/api'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'
import { haptics } from '@/utils/haptics'
import { formatCurrency, formatSlotTime, formatTime } from '@/utils/format'
import { STATUS_COLORS, STATUS_LABELS } from '@/utils/orderStatus'

const TIMELINE_EVENTS: Record<string, { labelKey: string; icon: keyof typeof Ionicons.glyphMap }> = {
  CONTACT_REPORTED: { labelKey: 'order.evtContact', icon: 'call' },
  SHOOT_STARTED: { labelKey: 'order.evtStart', icon: 'camera' },
  SHOOT_ENDED: { labelKey: 'order.evtEnd', icon: 'stop-circle' },
  EXTRA_TIME_REQUEST: { labelKey: 'order.evtExtraReq', icon: 'time' },
  EXTRA_TIME_CONFIRMED: { labelKey: 'order.evtExtraConfirmed', icon: 'checkmark-circle' },
}

export default function OrderDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const orderId = route?.params?.orderId as number
  const [order, setOrder] = useState<ProviderOrder | null>(null)
  const [events, setEvents] = useState<ShootEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [extraModal, setExtraModal] = useState(false)
  const [extraMinutes, setExtraMinutes] = useState('30')
  const [extraFee, setExtraFee] = useState('500')

  const loadOrder = useCallback(async () => {
    if (!orderId) return
    setLoading(true)
    try {
      const [orderRes, eventsRes]: [{ data?: ProviderOrder }, { data?: ShootEvent[] }] = await Promise.all([
        orderApi.getOrder(orderId),
        orderApi.getShootEvents(orderId).catch(() => ({ data: [] })),
      ])
      setOrder(orderRes.data || null)
      setEvents(eventsRes.data || [])
    } catch {
      setOrder(null)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [orderId])

  React.useEffect(() => { loadOrder() }, [loadOrder])

  const runAction = async (key: string, fn: () => Promise<unknown>, successMsg: string) => {
    setActionLoading(key)
    try {
      await fn()
      haptics.success()
      Alert.alert(t('common.successTitle'), successMsg)
      loadOrder()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || t('common.failed')
      Alert.alert(t('common.errorTitle'), msg)
    } finally {
      setActionLoading(null)
    }
  }

  const handleContact = () => {
    Alert.alert(t('order.contactTitle'), t('order.contactConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.confirm'),
        onPress: () => runAction('contact', () => orderApi.contactCustomer(orderId), t('order.contactSuccess')),
      },
    ])
  }

  const handleStartShoot = () => {
    Alert.alert(t('order.startTitle'), t('order.startConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('order.startConfirmBtn'),
        onPress: () => runAction('start', () => orderApi.startShoot(orderId), t('order.startSuccess')),
      },
    ])
  }

  const handleEndShoot = () => {
    Alert.alert(t('order.endTitle'), t('order.endConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('order.endConfirmBtn'),
        onPress: () => runAction('end', () => orderApi.endShoot(orderId), t('order.endSuccess')),
      },
    ])
  }

  const handleExtraTime = async () => {
    const minutes = parseInt(extraMinutes, 10)
    const fee = parseInt(extraFee, 10)
    if (!minutes || !fee) {
      Alert.alert(t('order.extraInvalidTitle'), t('order.extraInvalid'))
      return
    }
    setExtraModal(false)
    await runAction(
      'extra',
      () => orderApi.requestExtraTime(orderId, minutes, fee),
      t('order.extraSuccess', { minutes }),
    )
  }

  const canContact = order?.status === 'WaitingProviderContact' || order?.status === 'Paid' || order?.status === 'Confirmed'
  const canStart = order?.status === 'ReadyToShoot' || order?.status === 'Confirmed'
  const canEnd = order?.status === 'ShootingStarted'
  const canExtra = order?.status === 'ShootingStarted'

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('order.detail')} onBack={() => navigation.goBack()} />
        <StateView type="skeleton" />
      </SafeAreaView>
    )
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('order.detail')} onBack={() => navigation.goBack()} />
        <StateView type="error" message={t('order.notFound')} onRetry={loadOrder} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('order.detail')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 狀態卡片 */}
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[order.status] || colors.info) + '25' }]}>
            <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] || colors.info }]}>
              {STATUS_LABELS[order.status] || order.status}
            </Text>
          </View>
          <Text style={styles.orderNo}>{order.orderNo}</Text>
          <Text style={styles.profit}>{formatCurrency(order.photographerProfit)}</Text>
          <Text style={styles.profitLabel}>{t('order.providerProfit')}</Text>
        </View>

        {/* 訂單資訊 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('order.shootInfo')}</Text>
          <InfoRow icon="calendar-outline" label={t('order.date')} value={order.shootingDate || '-'} />
          <InfoRow icon="time-outline" label={t('order.time')} value={formatSlotTime(order.timeStart, order.timeEnd)} />
          <InfoRow icon="location-outline" label={t('order.location')} value={order.location || '-'} />
          <InfoRow icon="person-outline" label={t('order.customer')} value={order.consumerName || '-'} />
          {order.consumerPhone ? (
            <InfoRow
              icon="call-outline"
              label={t('order.phone')}
              value={order.consumerPhone}
              onPress={() => Linking.openURL(`tel:${order.consumerPhone}`)}
            />
          ) : null}
          <InfoRow icon="pricetag-outline" label={t('order.serviceType')} value={order.serviceType || '-'} />
        </View>

        {/* 狀態時間軸 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('order.timeline')}</Text>
          {events.length === 0 ? (
            <Text style={styles.noEvents}>{t('order.noEvents')}</Text>
          ) : (
            events.map((ev, idx) => {
              const cfg = TIMELINE_EVENTS[ev.eventType] || { labelKey: '', icon: 'ellipse' as const }
              const isLast = idx === events.length - 1
              return (
                <View key={ev.id} style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, isLast && styles.timelineDotActive]}>
                      <Ionicons name={cfg.icon} size={14} color={isLast ? colors.white : colors.primary} />
                    </View>
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>{cfg.labelKey ? t(cfg.labelKey) : ev.eventType}</Text>
                    <Text style={styles.timelineTime}>{formatTime(ev.eventTime)}</Text>
                    {ev.eventType === 'EXTRA_TIME_REQUEST' && (
                      <Text style={styles.timelineExtra}>
                        {t('order.extraTimeDetail', { minutes: ev.extraTimeMinutes ?? 0, fee: formatCurrency(ev.extraTimeFee) })}
                      </Text>
                    )}
                  </View>
                </View>
              )
            })
          )}
        </View>

        {/* 操作按鈕 */}
        <View style={styles.actions}>
          {canContact && (
            <Button
              label={t('order.contactBtn')}
              onPress={handleContact}
              loading={actionLoading === 'contact'}
              variant="secondary"
              haptic="medium"
              style={styles.actionBtn}
            />
          )}
          {canStart && (
            <Button
              label={t('order.startShoot')}
              onPress={handleStartShoot}
              loading={actionLoading === 'start'}
              haptic="medium"
              style={styles.actionBtn}
            />
          )}
          {canEnd && (
            <Button
              label={t('order.endShoot')}
              onPress={handleEndShoot}
              loading={actionLoading === 'end'}
              variant="success"
              haptic="medium"
              style={styles.actionBtn}
            />
          )}
          {canExtra && (
            <Button
              label={t('order.requestExtra')}
              onPress={() => setExtraModal(true)}
              variant="warning"
              style={styles.actionBtn}
            />
          )}
        </View>
      </ScrollView>

      {/* 加時 Modal */}
      <Modal visible={extraModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('order.requestExtra')}</Text>
            <Text style={styles.modalDesc}>{t('order.extraDesc')}</Text>
            <Text style={styles.inputLabel}>{t('order.extraMinutes')}</Text>
            <TextInput
              style={styles.modalInput}
              value={extraMinutes}
              onChangeText={setExtraMinutes}
              keyboardType="number-pad"
              placeholder="30"
            />
            <Text style={styles.inputLabel}>{t('order.extraFee')}</Text>
            <TextInput
              style={styles.modalInput}
              value={extraFee}
              onChangeText={setExtraFee}
              keyboardType="number-pad"
              placeholder="500"
            />
            <View style={styles.modalActions}>
              <Button label={t('common.cancel')} onPress={() => setExtraModal(false)} variant="outline" style={{ flex: 1 }} />
              <View style={{ width: spacing.md }} />
              <Button label={t('order.submitRequest')} onPress={handleExtraTime} haptic="medium" style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

function InfoRow({
  icon, label, value, onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  value: string
  onPress?: () => void
}) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const content = (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.secondary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, onPress && styles.infoLink]} numberOfLines={2}>{value}</Text>
    </View>
  )
  if (onPress) {
    return (
      <Text onPress={onPress} style={{ marginBottom: spacing.sm }}>
        {content}
      </Text>
    )
  }
  return content
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  statusCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xxl,
    alignItems: 'center', marginBottom: spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full, marginBottom: spacing.sm },
  statusText: { fontSize: 13, fontWeight: '700' },
  orderNo: { fontSize: 14, color: colors.textSecondary },
  profit: { fontSize: 32, fontWeight: '800', color: colors.secondary, marginTop: spacing.sm },
  profitLabel: { fontSize: 13, color: colors.textSecondary },
  section: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  infoLabel: { width: 56, fontSize: 13, color: colors.textSecondary },
  infoValue: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '500', textAlign: 'right' },
  infoLink: { color: colors.secondary, textDecorationLine: 'underline' },
  noEvents: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.lg },
  timelineRow: { flexDirection: 'row', marginBottom: spacing.sm },
  timelineLeft: { width: 32, alignItems: 'center' },
  timelineDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.primary,
  },
  timelineDotActive: { backgroundColor: colors.primary },
  timelineLine: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 4 },
  timelineContent: { flex: 1, paddingBottom: spacing.md },
  timelineLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  timelineTime: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  timelineExtra: { fontSize: 13, color: colors.warning, marginTop: 2, fontWeight: '600' },
  actions: { gap: spacing.sm },
  actionBtn: { marginBottom: spacing.xs },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    padding: spacing.xxl,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  modalDesc: { fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.textRegular, marginBottom: spacing.xs },
  modalInput: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    padding: spacing.md, fontSize: 16, marginBottom: spacing.md, backgroundColor: colors.background,
  },
  modalActions: { flexDirection: 'row', marginTop: spacing.md },
})
