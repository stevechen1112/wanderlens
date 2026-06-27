import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { shadows, useColors, type AppColors } from '@/theme'
import { bookingApi, matchApi, paymentApi } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import ScreenHeader from '@/components/ScreenHeader'
import Button from '@/components/Button'
import LocationPicker from '@/components/LocationPicker'
import { useMatchStream } from '@/hooks/useMatchStream'

type Step = 1 | 2 | 3 | 'searching' | 'found' | 'fallback'

const DURATIONS = [0.5, 1, 1.5, 2]
const OFFSETS = [
  { label: '現在', minutes: 0 },
  { label: '30 分鐘後', minutes: 30 },
  { label: '1 小時後', minutes: 60 },
]

export default function InstantShootScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { user } = useAuthStore()
  const [step, setStep] = useState<Step>(1)
  const [serviceTypes, setServiceTypes] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<any>(null)
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('')
  const [lat, setLat] = useState<number | undefined>()
  const [lng, setLng] = useState<number | undefined>()
  const [duration, setDuration] = useState(1)
  const [offsetMinutes, setOffsetMinutes] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [requestId, setRequestId] = useState<number | null>(null)
  const [matchData, setMatchData] = useState<any>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    bookingApi.getServiceTypes().then((res: any) => setServiceTypes(res.data || [])).catch(() => {})
    matchApi.getPublicStatus().then((res: any) => {
      if (!res.data?.instantMatchEnabled) {
        Alert.alert('尚未開放', '即時媒合功能目前尚未對外開放', [
          { text: '返回', onPress: () => navigation.goBack() },
        ])
      }
    }).catch(() => {})
  }, [navigation])

  useEffect(() => {
    if (step !== 'searching') return
    const timer = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(timer)
  }, [step])

  useMatchStream(requestId, (event, data) => {
    if (event === 'MATCH_FOUND') {
      setMatchData(data)
      setStep('found')
    } else if (event === 'FALLBACK_TO_SEARCH') {
      setMatchData(data)
      setStep('fallback')
    } else if (event === 'CANCELLED') {
      Alert.alert('已取消', '媒合需求已取消')
      navigation.goBack()
    }
  })

  const estimatedFee = useMemo(() => Math.round(duration * 1200), [duration])

  const submitRequest = async () => {
    if (!selectedType) { Alert.alert('請選擇拍攝類型'); return }
    if (!location) { Alert.alert('請選擇拍攝地點'); return }
    setSubmitting(true)
    try {
      const res: any = await matchApi.createRequest({
        serviceTypeId: selectedType.id,
        shootingLocation: location,
        shootingLat: lat,
        shootingLng: lng,
        city,
        durationHours: duration,
        startOffsetMinutes: offsetMinutes,
        customerName: user?.username,
      })
      setRequestId(res.data.id)
      setStep('searching')
      setElapsed(0)
    } catch (err: any) {
      Alert.alert('發送失敗', err?.message || '請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  const cancelSearch = async () => {
    if (requestId) await matchApi.cancelRequest(requestId).catch(() => {})
    navigation.goBack()
  }

  const payNow = async () => {
    if (!requestId || !matchData?.orderId) return
    setSubmitting(true)
    try {
      await matchApi.payAfterMatch(requestId)
      const payRes: any = await paymentApi.ecpayCheckout(matchData.orderId)
      navigation.getParent()?.navigate('PaymentWebView', {
        paymentForm: payRes.data,
        orderId: matchData.orderId,
        amount: matchData.estimatedFee || estimatedFee,
        title: '即時拍攝付款',
      })
    } catch (err: any) {
      Alert.alert('付款失敗', err?.message || '請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
      <Text style={styles.stepTitle}>選擇拍攝類型</Text>
      {serviceTypes.slice(0, 8).map(type => (
        <TouchableOpacity
          key={type.id}
          style={[styles.optionCard, selectedType?.id === type.id && styles.optionCardActive]}
          onPress={() => setSelectedType(type)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ selected: selectedType?.id === type.id }}
          accessibilityLabel={type.name}
        >
          <Ionicons name="camera-outline" size={22} color={selectedType?.id === type.id ? colors.primary : colors.textSecondary} />
          <Text style={[styles.optionLabel, selectedType?.id === type.id && styles.optionLabelActive]}>{type.name}</Text>
          {selectedType?.id === type.id && <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={{ marginLeft: 'auto' }} />}
        </TouchableOpacity>
      ))}
      <Button label="下一步" onPress={() => selectedType ? setStep(2) : Alert.alert('請選擇拍攝類型')} style={{ marginTop: 24 }} />
    </ScrollView>
  )

  const renderStep2 = () => (
    <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
      <Text style={styles.stepTitle}>確認地點與時間</Text>
      <LocationPicker
        label="拍攝地點"
        location={location}
        city={city}
        onLocationChange={setLocation}
        onCityChange={setCity}
        onCoordsChange={(coords) => {
          setLat(coords?.lat)
          setLng(coords?.lng)
        }}
      />
      <Text style={styles.fieldLabel}>開始時間</Text>
      <View style={styles.chipRow}>
        {OFFSETS.map(o => (
          <TouchableOpacity
            key={o.minutes}
            style={[styles.chip, offsetMinutes === o.minutes && styles.chipActive]}
            onPress={() => setOffsetMinutes(o.minutes)}
            accessibilityRole="button"
            accessibilityState={{ selected: offsetMinutes === o.minutes }}
            accessibilityLabel={o.label}
          >
            <Text style={[styles.chipText, offsetMinutes === o.minutes && styles.chipTextActive]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.fieldLabel}>拍攝時長</Text>
      <View style={styles.chipRow}>
        {DURATIONS.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, duration === d && styles.chipActive]}
            onPress={() => setDuration(d)}
            accessibilityRole="button"
            accessibilityState={{ selected: duration === d }}
            accessibilityLabel={`${d} 小時`}
          >
            <Text style={[styles.chipText, duration === d && styles.chipTextActive]}>{d} hr</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.feeBox}>
        <Text style={styles.feeLabel}>預估費用</Text>
        <Text style={styles.feeValue}>NT$ {estimatedFee.toLocaleString()}</Text>
      </View>
      <View style={styles.btnRow}>
        <Button label="上一步" variant="outline" onPress={() => setStep(1)} style={{ flex: 1 }} />
        <View style={{ width: 12 }} />
        <Button label="立即尋找攝影師" onPress={() => setStep(3)} style={{ flex: 1.4 }} />
      </View>
    </ScrollView>
  )

  const renderStep3 = () => (
    <View style={styles.body}>
      <View style={styles.confirmCard}>
        <Text style={styles.confirmTitle}>確認需求</Text>
        <Text style={styles.confirmRow}>類型：{selectedType?.name}</Text>
        <Text style={styles.confirmRow}>地點：{location}</Text>
        <Text style={styles.confirmRow}>時長：{duration} 小時</Text>
        <Text style={styles.confirmRow}>費用：NT$ {estimatedFee.toLocaleString()}</Text>
      </View>
      <Button label="🔍 立即尋找攝影師" onPress={submitRequest} loading={submitting} style={{ marginHorizontal: 16 }} />
      <Button label="返回修改" variant="outline" onPress={() => setStep(2)} style={{ marginHorizontal: 16, marginTop: 12 }} />
    </View>
  )

  const renderSearching = () => (
    <View style={styles.centerPanel}>
      <View style={styles.pulseRing}>
        <Ionicons name="search" size={48} color={colors.primary} />
      </View>
      <Text style={styles.searchTitle}>正在為您尋找攝影師…</Text>
      <Text style={styles.searchSub}>正在廣播給附近 5 位攝影師</Text>
      <Text style={styles.elapsed}>已過 {elapsed} 秒</Text>
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
      <Button label="取消需求" variant="outline" onPress={cancelSearch} style={{ marginTop: 32, alignSelf: 'stretch' }} />
    </View>
  )

  const renderFound = () => (
    <View style={styles.centerPanel}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={64} color={colors.success} />
      </View>
      <Text style={styles.searchTitle}>找到攝影師！</Text>
      <View style={styles.providerCard}>
        <Ionicons name="person-circle-outline" size={48} color={colors.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.providerName}>{matchData?.matchedProvider?.nickName || '攝影師'}</Text>
          {matchData?.matchedProvider?.rating ? (
            <Text style={styles.providerMeta}>⭐ {matchData.matchedProvider.rating} · {matchData.matchedProvider.distanceKm?.toFixed(1)} km</Text>
          ) : null}
          <Text style={styles.providerFee}>NT$ {(matchData?.estimatedFee || estimatedFee).toLocaleString()} / {duration}hr</Text>
        </View>
      </View>
      <Text style={styles.payHint}>請在 5 分鐘內完成付款</Text>
      <Button label="💳 立即付款" onPress={payNow} loading={submitting} style={{ alignSelf: 'stretch' }} />
    </View>
  )

  const renderFallback = () => (
    <View style={styles.centerPanel}>
      <Ionicons name="sad-outline" size={56} color={colors.textSecondary} />
      <Text style={styles.searchTitle}>暫無攝影師回應</Text>
      <Text style={styles.searchSub}>已為您轉為搜尋模式，可從以下攝影師中挑選</Text>
      <ScrollView style={{ maxHeight: 240, alignSelf: 'stretch', marginTop: 16 }}>
        {(matchData?.fallbackProviders || []).map((p: any) => (
          <View key={p.providerId} style={styles.fallbackItem}>
            <Text style={styles.providerName}>{p.nickName}</Text>
            <Text style={styles.providerMeta}>⭐ {p.rating} · ${p.unitPrice}/hr</Text>
          </View>
        ))}
      </ScrollView>
      <Button label="前往預約拍攝" onPress={() => navigation.navigate('Booking')} style={{ marginTop: 16, alignSelf: 'stretch' }} />
      <Button label="返回首頁" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: 12, alignSelf: 'stretch' }} />
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="⚡ 即時拍攝" onBack={() => step === 'searching' ? cancelSearch() : navigation.goBack()} />
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 'searching' && renderSearching()}
      {step === 'found' && renderFound()}
      {step === 'fallback' && renderFallback()}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 32 },
  stepTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1.5, borderColor: colors.border,
  },
  optionCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, flex: 1 },
  optionLabelActive: { color: colors.primaryDark },
  fieldLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginTop: 16, marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  chipTextActive: { color: colors.white },
  feeBox: { marginTop: 24, backgroundColor: colors.primaryLight, borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feeLabel: { fontSize: 15, color: colors.textRegular },
  feeValue: { fontSize: 22, fontWeight: '800', color: colors.primaryDark },
  btnRow: { flexDirection: 'row', marginTop: 24 },
  confirmCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, margin: 16, marginBottom: 24 },
  confirmTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12, color: colors.textPrimary },
  confirmRow: { fontSize: 15, color: colors.textRegular, marginBottom: 6 },
  centerPanel: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  pulseRing: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  searchTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  searchSub: { fontSize: 15, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
  elapsed: { fontSize: 14, color: colors.primary, marginTop: 12, fontWeight: '600' },
  successIcon: { marginBottom: 16 },
  providerCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 16, padding: 16, marginVertical: 20, alignSelf: 'stretch',
    ...shadows.sm,
  },
  providerName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  providerMeta: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  providerFee: { fontSize: 16, fontWeight: '700', color: colors.primary, marginTop: 6 },
  payHint: { fontSize: 14, color: colors.warning, marginBottom: 16, fontWeight: '600' },
  fallbackItem: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 8 },
})
