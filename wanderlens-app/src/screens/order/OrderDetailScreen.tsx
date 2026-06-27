import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
  Modal, TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColors, type AppColors } from '@/theme'
import { orderApi, paymentApi } from '@/api'
import Button from '@/components/Button'
import StateView from '@/components/StateView'
import { t } from '@/i18n'

const STATUS_LABELS: Record<string, string> = {
  Draft: '草稿', PendingPayment: '待付款', Paid: '已付款',
  WaitingProviderContact: '等待聯繫', Confirmed: '已確認',
  ReadyToShoot: '待拍攝', ShootingStarted: '拍攝中', ShootingEnded: '拍攝結束',
  UploadingRaw: '上傳中', AiProcessing: 'AI處理中', Delivered: '已交付',
  Cancelled: '已取消', Closed: '已結案', Refunded: '已退款', Disputed: '爭議中',
}

interface ShootEvent {
  id: number
  eventType: string
  eventTime: string
  extraTimeMinutes?: number
  extraTimeFee?: number
}

function getPendingExtraRequest(events: ShootEvent[]): ShootEvent | null {
  const requests = events.filter(e => e.eventType === 'EXTRA_TIME_REQUEST')
  if (!requests.length) return null
  const latest = [...requests].sort(
    (a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime(),
  )[0]
  const confirmedAfter = events.some(
    e => e.eventType === 'EXTRA_TIME_CONFIRMED'
      && new Date(e.eventTime).getTime() >= new Date(latest.eventTime).getTime(),
  )
  return confirmedAfter ? null : latest
}

export default function OrderDetailScreen({ route, navigation }: any) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const orderId = route?.params?.orderId
  const [order, setOrder] = useState<any>(null)
  const [shootEvents, setShootEvents] = useState<ShootEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmingExtra, setConfirmingExtra] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingStars, setRatingStars] = useState(5)
  const [ratingComments, setRatingComments] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)

  const loadOrder = useCallback(async () => {
    if (!orderId) return
    setLoading(true)
    try {
      const [orderRes, eventsRes]: any[] = await Promise.all([
        orderApi.getOrder(orderId),
        orderApi.getShootEvents(orderId).catch(() => ({ data: [] })),
      ])
      setOrder(orderRes.data || null)
      setShootEvents(eventsRes.data || [])
    } catch {
      setOrder(null)
      setShootEvents([])
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    loadOrder()
  }, [loadOrder])

  useEffect(() => {
    if (!order || ratingSubmitted) return
    if (order.status === 'Delivered' || order.status === 'Closed') {
      setShowRatingModal(true)
    }
  }, [order, ratingSubmitted])

  const pendingExtra = getPendingExtraRequest(shootEvents)
  const showConfirmExtra = order?.status === 'ShootingStarted' && pendingExtra != null

  const handleConfirmExtraTime = async () => {
    if (!pendingExtra) return
    Alert.alert(
      '確認加時',
      `攝影師申請加時 ${pendingExtra.extraTimeMinutes || 0} 分鐘，費用 $${(pendingExtra.extraTimeFee || 0).toLocaleString()}，是否同意？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '確認加時',
          onPress: async () => {
            setConfirmingExtra(true)
            try {
              const res: any = await orderApi.confirmExtraTime(orderId)
              const extraFee = res?.data?.extraFee ?? pendingExtra.extraTimeFee
              const paymentForm = res?.data?.paymentForm
              if (paymentForm) {
                navigation.getParent()?.navigate('PaymentWebView', {
                  paymentForm,
                  orderId,
                  amount: extraFee,
                  title: t('payment.extraTitle'),
                })
              } else {
                Alert.alert('加時已確認', `請完成加時付款 NT$${(extraFee || 0).toLocaleString()}`)
              }
              loadOrder()
            } catch (err: any) {
              const msg = err?.response?.data?.message || '確認加時失敗'
              Alert.alert('錯誤', msg)
            } finally {
              setConfirmingExtra(false)
            }
          },
        },
      ],
    )
  }

  const handleSubmitRating = async () => {
    if (!order?.photographerId) {
      Alert.alert('錯誤', '無法取得攝影師資訊')
      return
    }
    setSubmittingRating(true)
    try {
      await orderApi.submitRating({
        orderId: order.id,
        providerId: order.photographerId,
        stars: ratingStars,
        comments: ratingComments.trim() || undefined,
      })
      setRatingSubmitted(true)
      setShowRatingModal(false)
      Alert.alert('感謝您', '評價已送出')
    } catch (err: any) {
      const msg = err?.response?.data?.message || '評價送出失敗'
      if (msg.includes('已評價')) {
        setRatingSubmitted(true)
        setShowRatingModal(false)
      }
      Alert.alert('提示', msg)
    } finally {
      setSubmittingRating(false)
    }
  }

  const handlePayOrder = async () => {
    if (!orderId) return
    try {
      const payRes: any = await paymentApi.ecpayCheckout(orderId)
      const paymentForm = payRes.data
      if (!paymentForm) {
        Alert.alert('錯誤', '無法取得付款表單')
        return
      }
      navigation.getParent()?.navigate('PaymentWebView', {
        paymentForm,
        orderId,
        amount: order.totalFee,
        title: t('payment.title'),
      })
    } catch (err: any) {
      Alert.alert('錯誤', err?.response?.data?.message || '付款失敗')
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StateView type="skeleton" />
      </SafeAreaView>
    )
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <StateView
          type="error"
          message="訂單不存在"
          onRetry={() => { setLoading(true); loadOrder() }}
        />
      </SafeAreaView>
    )
  }

  const statusLabel = STATUS_LABELS[order.status] || order.status
  const shootingTimeDisplay = order.shootingTime
    || (order.timeStart && order.timeEnd ? `${order.timeStart} - ${order.timeEnd}` : '-')
  const locationDisplay = order.shootingLocation || order.city || '-'

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>訂單狀態</Text>
          <Text style={styles.statusValue}>{statusLabel}</Text>
          <Text style={styles.orderNo}>訂單號：{order.orderNo}</Text>
        </View>

        {showConfirmExtra && pendingExtra ? (
          <View style={styles.extraTimeCard}>
            <View style={styles.extraTimeHeader}>
              <Ionicons name="time-outline" size={22} color={colors.warning} />
              <Text style={styles.extraTimeTitle}>加時待確認</Text>
            </View>
            <Text style={styles.extraTimeDesc}>
              攝影師申請加時 {pendingExtra.extraTimeMinutes || 0} 分鐘，加時費用 $
              {(pendingExtra.extraTimeFee || 0).toLocaleString()}
            </Text>
            <Button
              label="確認加時"
              variant="warning"
              onPress={handleConfirmExtraTime}
              loading={confirmingExtra}
              fullWidth
              style={styles.actionButton}
            />
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>拍攝資訊</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>日期</Text>
            <Text style={styles.infoValue}>{order.shootingDate || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>時間</Text>
            <Text style={styles.infoValue}>{shootingTimeDisplay}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>地點</Text>
            <Text style={styles.infoValue}>{locationDisplay}</Text>
          </View>
          {order.photographerName ? (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>攝影師</Text>
              <Text style={styles.infoValue}>{order.photographerName}</Text>
            </View>
          ) : null}
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoLabel}>人數</Text>
            <Text style={styles.infoValue}>大人 {order.adultNum || 0}，小孩 {order.childNum || 0}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>金額資訊</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>訂單金額</Text>
            <Text style={styles.priceValue}>$ {order.totalFee?.toLocaleString() || 0}</Text>
          </View>
          {order.extraTimeFee ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>加時費用</Text>
              <Text style={styles.priceValue}>$ {order.extraTimeFee?.toLocaleString()}</Text>
            </View>
          ) : null}
          {order.photographerProfit ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>攝影師應得</Text>
              <Text style={styles.priceValue}>$ {order.photographerProfit?.toLocaleString()}</Text>
            </View>
          ) : null}
        </View>

        {order.customerName ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>聯絡資訊</Text>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>姓名</Text>
              <Text style={styles.infoValue}>{order.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>電話</Text>
              <Text style={styles.infoValue}>{order.customerPhone}</Text>
            </View>
          </View>
        ) : null}

        {order.remark ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>備註</Text>
            <Text style={styles.remarkText}>{order.remark}</Text>
          </View>
        ) : null}

        {order.status === 'PendingPayment' && (
          <Button label={t('order.pay')} onPress={handlePayOrder} style={{ marginTop: 8 }} />
        )}
        {order.status === 'Delivered' && order.albumId && (
          <Button
            label="查看相簿"
            onPress={() => navigation.getParent()?.navigate('Albums', {
              screen: 'AlbumDetail',
              params: { id: order.albumId },
            })}
            fullWidth
            style={styles.actionButton}
          />
        )}
        {(order.status === 'Delivered' || order.status === 'Closed') && !ratingSubmitted ? (
          <Button
            label="評價攝影師"
            variant="secondary"
            onPress={() => setShowRatingModal(true)}
            fullWidth
            style={styles.actionButton}
          />
        ) : null}
      </ScrollView>

      <Modal visible={showRatingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>為攝影師評分</Text>
            <Text style={styles.modalSubtitle}>您的評價將幫助其他消費者選擇服務</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRatingStars(star)}>
                  <Ionicons
                    name={star <= ratingStars ? 'star' : 'star-outline'}
                    size={36}
                    color={colors.warning}
                    style={{ marginHorizontal: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.ratingInput}
              value={ratingComments}
              onChangeText={setRatingComments}
              placeholder="分享您的拍攝體驗（選填）"
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowRatingModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>稍後再說</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSubmit]}
                onPress={handleSubmitRating}
                disabled={submittingRating}
              >
                {submittingRating ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.modalBtnSubmitText}>送出評價</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  statusCard: {
    backgroundColor: colors.primary, borderRadius: 12, padding: 20,
    alignItems: 'center', marginBottom: 16,
  },
  statusLabel: { fontSize: 14, color: colors.white, opacity: 0.8, marginBottom: 4 },
  statusValue: { fontSize: 24, fontWeight: 'bold', color: colors.white, marginBottom: 8 },
  orderNo: { fontSize: 13, color: colors.white, opacity: 0.7 },
  extraTimeCard: {
    backgroundColor: colors.warningLight, borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: colors.warning,
  },
  extraTimeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  extraTimeTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  extraTimeDesc: { fontSize: 14, color: colors.textRegular, marginBottom: 12, lineHeight: 20 },
  section: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8 },
  infoLabel: { fontSize: 14, color: colors.textSecondary, minWidth: 60 },
  infoValue: { fontSize: 14, color: colors.textPrimary, fontWeight: '500', flex: 1 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  priceValue: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  remarkText: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  actionButton: { marginTop: 8, marginBottom: 8 },
  modalOverlay: {
    flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 24,
  },
  modalContent: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  ratingInput: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 8,
    padding: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top',
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalBtnCancel: { backgroundColor: colors.background },
  modalBtnCancelText: { color: colors.textRegular, fontWeight: '600' },
  modalBtnSubmit: { backgroundColor: colors.primary },
  modalBtnSubmitText: { color: colors.white, fontWeight: '600' },
})
