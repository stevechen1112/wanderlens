import React, { useState, useEffect, useMemo } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Alert, Platform, KeyboardAvoidingView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { shadows, useColors, type AppColors } from '@/theme'
import { bookingApi, paymentApi } from '@/api'
import { navigationRef } from '@/navigation/RootNavigator'
import { useAuthStore } from '@/stores/authStore'
import ScreenHeader from '@/components/ScreenHeader'
import DateTimeField from '@/components/DateTimeField'
import LocationPicker from '@/components/LocationPicker'
import Button from '@/components/Button'
import StateView from '@/components/StateView'
import { useLocale } from '@/i18n'

interface ServiceType {
  id: number
  name: string
  nameEn?: string
  basePrice?: number
  price?: number
  duration?: number
}

interface Configuration {
  id: number
  shootLocation: string
  label?: string
  photographerCount?: number
  needStylist?: boolean
}

interface SearchResult {
  providerId: number
  providerUuid: string
  nickName: string
  city: string
  avatar?: string
  rating?: number
  unitPrice: number
  transportationFee: number
  totalFee: number
  available: boolean
  availabilityId?: number
}

interface Studio {
  id: number
  name: string
  city?: string
}

interface MultiPoolResult {
  configurationId?: number
  shootLocation?: string
  photographers?: SearchResult[]
  studios?: Studio[]
  stylists?: SearchResult[]
  needStudio?: boolean
  needStylist?: boolean
  photographerCount?: number
}

function calcDurationHours(timeStart: string, timeEnd: string): number {
  const [sh, sm] = timeStart.split(':').map(Number)
  const [eh, em] = timeEnd.split(':').map(Number)
  if (Number.isNaN(sh) || Number.isNaN(eh)) return 2
  const mins = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0))
  return Math.max(1, Math.round(mins / 60))
}

export default function BookingScreen({ navigation, route }: { navigation: any; route?: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const { user } = useAuthStore()
  const prefillLocation = route?.params?.prefillLocation as string | undefined

  const STEP_LABELS = useMemo(() => [
    t('booking.steps.type'),
    t('booking.steps.config'),
    t('booking.steps.datetime'),
    t('booking.steps.services'),
    t('booking.steps.summary'),
    t('booking.steps.checkout'),
  ], [t])

  const LOCATION_OPTIONS = useMemo(() => [
    { key: 'OUTDOOR', label: t('booking.locationType.outdoor'), icon: 'sunny-outline' as const },
    { key: 'STUDIO', label: t('booking.locationType.studio'), icon: 'business-outline' as const },
    { key: 'BOTH', label: t('booking.locationType.both'), icon: 'swap-horizontal-outline' as const },
  ], [t])

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initError, setInitError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | null>(null)
  const [selectedConfigurationId, setSelectedConfigurationId] = useState<number | null>(null)
  const [shootLocation, setShootLocation] = useState('OUTDOOR')

  const [shootingDate, setShootingDate] = useState('')
  const [timeStart, setTimeStart] = useState('')
  const [timeEnd, setTimeEnd] = useState('')
  const [shootingLocation, setShootingLocation] = useState('')
  const [city, setCity] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [adultNum, setAdultNum] = useState(1)
  const [childNum, setChildNum] = useState(0)

  const [multiPoolResult, setMultiPoolResult] = useState<MultiPoolResult | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<SearchResult | null>(null)
  const [selectedSecondProvider, setSelectedSecondProvider] = useState<SearchResult | null>(null)
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<SearchResult | null>(null)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [email, setEmail] = useState('')
  const [remark, setRemark] = useState('')

  useEffect(() => {
    loadInitialData()
    if (user?.username) setCustomerName(user.username)
  }, [])

  useEffect(() => {
    if (prefillLocation) {
      setShootingLocation(prefillLocation)
      setCity(prefillLocation)
      setStep(3)
    }
  }, [prefillLocation])

  const loadInitialData = async () => {
    setLoading(true)
    setInitError(false)
    try {
      const [typesRes, configsRes]: any[] = await Promise.all([
        bookingApi.getServiceTypes(),
        bookingApi.getConfigurations(),
      ])
      setServiceTypes(typesRes.data || [])
      setConfigurations(configsRes.data || [])
    } catch {
      setInitError(true)
    } finally {
      setLoading(false)
    }
  }

  const getConfigIdForLocation = (loc: string) => {
    const config = configurations.find(c => c.shootLocation === loc)
    return config?.id ?? null
  }

  const selectLocation = (loc: string) => {
    setShootLocation(loc)
    setSelectedConfigurationId(getConfigIdForLocation(loc))
  }

  const handleSearchMultiPool = async () => {
    if (!selectedServiceType || !shootingDate || !timeStart || !timeEnd) {
      Alert.alert(t('common.hint'), t('booking.alertIncomplete'))
      return false
    }
    setLoading(true)
    try {
      const res: any = await bookingApi.searchMultiPool({
        serviceTypeId: selectedServiceType.id,
        configurationId: selectedConfigurationId || getConfigIdForLocation(shootLocation),
        shootingDate,
        timeStart,
        timeEnd,
        city: city || shootingLocation || undefined,
        lat: coords?.lat,
        lng: coords?.lng,
        adultNum,
        childNum,
      })
      setMultiPoolResult(res.data || null)
      setSelectedProvider(null)
      setSelectedStudio(null)
      setSelectedStylist(null)
      return true
    } catch {
      Alert.alert(t('common.errorTitle'), t('booking.alertSearchFailed'))
      return false
    } finally {
      setLoading(false)
    }
  }

  const goNextFromStep3 = async () => {
    const ok = await handleSearchMultiPool()
    if (ok) setStep(4)
  }

  const photographers = multiPoolResult?.photographers || []
  const studios = multiPoolResult?.studios || []
  const stylists = multiPoolResult?.stylists || []
  const needStudio = multiPoolResult?.needStudio
  const needStylist = multiPoolResult?.needStylist
  const photographerCount = multiPoolResult?.photographerCount || 1

  const canProceedStep4 = () => {
    if (!selectedProvider) return false
    if (photographerCount >= 2 && !selectedSecondProvider) return false
    if (photographerCount >= 2 && selectedSecondProvider?.providerId === selectedProvider.providerId) return false
    if (needStudio && studios.length > 0 && !selectedStudio) return false
    if (needStylist && stylists.length > 0 && !selectedStylist) return false
    return true
  }

  const shootingDuration = calcDurationHours(timeStart, timeEnd)
  const secondFee =
    photographerCount >= 2 && selectedSecondProvider ? (selectedSecondProvider.totalFee || 0) : 0
  const totalFee = (selectedProvider?.totalFee || 0) + secondFee

  const handleCreateOrder = async () => {
    if (!selectedProvider || !selectedServiceType) return
    if (!customerName.trim() || !customerPhone.trim()) {
      Alert.alert(t('common.hint'), t('booking.alertContactRequired'))
      return
    }
    const configurationId = selectedConfigurationId || getConfigIdForLocation(shootLocation)
    if (!configurationId) {
      Alert.alert(t('common.hint'), t('booking.alertConfigRequired'))
      return
    }
    setSubmitting(true)

    let orderId: number | undefined
    try {
      const res: any = await bookingApi.createOrder({
        photographerId: selectedProvider.providerId,
        secondPhotographerId: selectedSecondProvider?.providerId,
        stylistId: selectedStylist?.providerId,
        studioId: selectedStudio?.id,
        serviceTypeId: selectedServiceType.id,
        configurationId,
        shootingDate,
        shootingTime: `${timeStart}-${timeEnd}`,
        shootingDuration,
        shootingLocation: shootingLocation || city || '待確認',
        adultNum,
        childNum,
        customerName,
        customerPhone,
        email: email || undefined,
        remark: remark || undefined,
        availabilityId: selectedProvider.availabilityId,
        secondAvailabilityId: selectedSecondProvider?.availabilityId,
      })
      orderId = res.data?.id
      if (!orderId) {
        Alert.alert(t('common.errorTitle'), res.message || t('booking.alertCreateFailed'))
        return
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('booking.alertCreateFailed')
      Alert.alert(t('common.errorTitle'), msg)
      return
    } finally {
      setSubmitting(false)
    }

    setSubmitting(true)
    try {
      const payRes: any = await paymentApi.ecpayCheckout(orderId!)
      const paymentForm = payRes.data
      if (!paymentForm) {
        Alert.alert(t('common.hint'), t('booking.alertNoPaymentForm'))
        navigation.navigate('Profile', { screen: 'OrderDetail', params: { orderId } })
        return
      }
      navigation.getParent()?.navigate('PaymentWebView', {
        paymentForm,
        orderId,
        amount: totalFee,
        title: t('payment.title'),
      })
      resetForm()
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('payment.noForm')
      Alert.alert(t('booking.alertOrderCreatedTitle'), `${msg}\n${t('booking.alertOrderCreatedBody')}`)
      navigation.navigate('Profile', { screen: 'OrderDetail', params: { orderId } })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedServiceType(null)
    setSelectedConfigurationId(null)
    setShootLocation('OUTDOOR')
    setShootingDate('')
    setTimeStart('')
    setTimeEnd('')
    setShootingLocation('')
    setCity('')
    setCoords(null)
    setAdultNum(1)
    setChildNum(0)
    setMultiPoolResult(null)
    setSelectedProvider(null)
    setSelectedSecondProvider(null)
    setSelectedStudio(null)
    setSelectedStylist(null)
    setCustomerName('')
    setCustomerPhone('')
    setEmail('')
    setRemark('')
  }

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEP_LABELS.map((label, index) => {
        const stepNum = index + 1
        const isActive = step === stepNum
        const isDone = step > stepNum
        return (
          <View key={label} style={styles.stepItem}>
            <View style={styles.stepItemInner}>
              <View style={[
                styles.stepCircle,
                isDone && styles.stepCircleDone,
                isActive && styles.stepCircleActive,
              ]}>
                {isDone ? (
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                ) : (
                  <Text style={[styles.stepCircleText, isActive && styles.stepCircleTextActive]}>
                    {stepNum}
                  </Text>
                )}
              </View>
              {index < STEP_LABELS.length - 1 && (
                <View style={[styles.stepLine, step > stepNum && styles.stepLineDone]} />
              )}
            </View>
            <Text style={[styles.stepLabel, (isActive || isDone) && styles.stepLabelActive]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        )
      })}
    </View>
  )

  const renderNavButtons = (opts: {
    onBack?: () => void
    onNext?: () => void
    nextLabel?: string
    nextDisabled?: boolean
    nextLoading?: boolean
  }) => (
    <View style={styles.row}>
      {opts.onBack ? (
        <Button
          label="上一步"
          variant="outline"
          onPress={opts.onBack}
          style={{ flex: 1, marginRight: 8 }}
        />
      ) : (
        <View style={{ flex: 1, marginRight: 8 }} />
      )}
      {opts.onNext ? (
        <Button
          label={opts.nextLabel || '下一步'}
          onPress={opts.onNext}
          disabled={opts.nextDisabled}
          loading={opts.nextLoading}
          style={{ flex: 1, marginLeft: 8 }}
        />
      ) : null}
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('booking.title')} large />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.stepBar}>
          {renderStepIndicator()}
        </View>

        {loading && step !== 3 ? (
          <StateView type="loading" />
        ) : initError ? (
          <StateView type="error" onRetry={loadInitialData} />
        ) : (
          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            {/* Step 1: 服務類型 */}
            {step === 1 && (
              <View>
                <Text style={styles.sectionTitle}>選擇拍攝類型</Text>
                <Text style={styles.sectionDesc}>選擇您想要的拍攝風格</Text>
                {serviceTypes.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.optionCard,
                      selectedServiceType?.id === type.id && styles.optionCardSelected,
                    ]}
                    onPress={() => setSelectedServiceType(type)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: selectedServiceType?.id === type.id }}
                    accessibilityLabel={type.name}
                  >
                    <View style={styles.optionIcon}>
                      <Ionicons name="camera-outline" size={24} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.optionTitle}>{type.name}</Text>
                      {(type.basePrice || type.price) ? (
                        <Text style={styles.optionSubtitle}>
                          $ {(type.basePrice || type.price)?.toLocaleString()} 起
                        </Text>
                      ) : null}
                    </View>
                    {selectedServiceType?.id === type.id && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
                {renderNavButtons({
                  onNext: () => selectedServiceType && setStep(2),
                  nextDisabled: !selectedServiceType,
                })}
              </View>
            )}

            {/* Step 2: 拍攝配置 */}
            {step === 2 && (
              <View>
                <Text style={styles.sectionTitle}>拍攝配置</Text>
                <Text style={styles.sectionDesc}>選擇拍攝場景類型</Text>
                <View style={styles.configGrid}>
                  {LOCATION_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt.key}
                      style={[
                        styles.configCard,
                        shootLocation === opt.key && styles.configCardSelected,
                      ]}
                      onPress={() => selectLocation(opt.key)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: shootLocation === opt.key }}
                      accessibilityLabel={opt.label}
                    >
                      <Ionicons
                        name={opt.icon}
                        size={28}
                        color={shootLocation === opt.key ? colors.primary : colors.textSecondary}
                      />
                      <Text style={[
                        styles.configLabel,
                        shootLocation === opt.key && styles.configLabelSelected,
                      ]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {renderNavButtons({
                  onBack: () => setStep(1),
                  onNext: () => setStep(3),
                  nextDisabled: !selectedConfigurationId && !getConfigIdForLocation(shootLocation),
                })}
              </View>
            )}

            {/* Step 3: 時間與地點 */}
            {step === 3 && (
              <View>
                <Text style={styles.sectionTitle}>時間與地點</Text>
                <Text style={styles.sectionDesc}>設定拍攝日期、時間與地點</Text>
                <DateTimeField
                  label={t('booking.shootDate')}
                  mode="date"
                  value={shootingDate}
                  onChange={setShootingDate}
                  minimumDate={new Date()}
                />
                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <DateTimeField label={t('booking.timeStart')} mode="time" value={timeStart} onChange={setTimeStart} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <DateTimeField label={t('booking.timeEnd')} mode="time" value={timeEnd} onChange={setTimeEnd} />
                  </View>
                </View>
                <LocationPicker
                  label={t('booking.shootLocation')}
                  city={city}
                  location={shootingLocation}
                  onCityChange={setCity}
                  onLocationChange={setShootingLocation}
                  onCoordsChange={setCoords}
                />
                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.label}>{t('booking.adults')}</Text>
                    <TextInput
                      style={styles.input}
                      value={String(adultNum)}
                      onChangeText={(t) => setAdultNum(Math.max(1, parseInt(t) || 1))}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.label}>{t('booking.children')}</Text>
                    <TextInput
                      style={styles.input}
                      value={String(childNum)}
                      onChangeText={(t) => setChildNum(Math.max(0, parseInt(t) || 0))}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                {renderNavButtons({
                  onBack: () => setStep(2),
                  onNext: goNextFromStep3,
                  nextLabel: '搜尋媒合',
                  nextDisabled: !shootingDate || !timeStart || !timeEnd,
                  nextLoading: loading,
                })}
              </View>
            )}

            {/* Step 4: 三池媒合選擇 */}
            {step === 4 && (
              <View>
                <Text style={styles.sectionTitle}>選擇服務人員</Text>
                <Text style={styles.sectionDesc}>從媒合結果中選擇攝影師{needStudio ? '、攝影棚' : ''}{needStylist ? '、造型師' : ''}</Text>

                <Text style={styles.poolTitle}>攝影師 ({photographers.length})</Text>
                {photographers.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="sad-outline" size={40} color={colors.textSecondary} />
                    <Text style={styles.emptyText}>目前時段無可預約攝影師</Text>
                  </View>
                ) : (
                  photographers.map(provider => (
                    <TouchableOpacity
                      key={provider.providerId}
                      style={[
                        styles.optionCard,
                        selectedProvider?.providerId === provider.providerId && styles.optionCardSelected,
                      ]}
                      onPress={() => setSelectedProvider(provider)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.optionTitle}>{provider.nickName}</Text>
                        <Text style={styles.optionSubtitle}>{provider.city}</Text>
                        {provider.rating ? (
                          <Text style={styles.ratingText}>★ {Number(provider.rating).toFixed(1)}</Text>
                        ) : null}
                        <Text style={styles.priceText}>$ {provider.totalFee.toLocaleString()}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.profileBtn}
                        onPress={(e) => {
                          e.stopPropagation?.()
                          if (provider.providerUuid) {
                            navigationRef.navigate('ProviderDetail', { providerUuid: provider.providerUuid })
                          }
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="查看攝影師介紹"
                      >
                        <Ionicons name="person-circle-outline" size={22} color={colors.primary} />
                      </TouchableOpacity>
                      {selectedProvider?.providerId === provider.providerId && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))
                )}

                {photographerCount >= 2 ? (
                  <>
                    <Text style={styles.poolTitle}>第二位攝影師（雙機）</Text>
                    {photographers.filter(p => p.providerId !== selectedProvider?.providerId).map(provider => (
                      <TouchableOpacity
                        key={`second-${provider.providerId}`}
                        style={[
                          styles.optionCard,
                          selectedSecondProvider?.providerId === provider.providerId && styles.optionCardSelected,
                        ]}
                        onPress={() => setSelectedSecondProvider(provider)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.optionTitle}>{provider.nickName}</Text>
                          <Text style={styles.optionSubtitle}>{provider.city}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.profileBtn}
                          onPress={(e) => {
                            e.stopPropagation?.()
                            if (provider.providerUuid) {
                              navigationRef.navigate('ProviderDetail', { providerUuid: provider.providerUuid })
                            }
                          }}
                          accessibilityRole="button"
                          accessibilityLabel="查看攝影師介紹"
                        >
                          <Ionicons name="person-circle-outline" size={22} color={colors.primary} />
                        </TouchableOpacity>
                        {selectedSecondProvider?.providerId === provider.providerId && (
                          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </>
                ) : null}

                {needStudio && studios.length > 0 ? (
                  <>
                    <Text style={styles.poolTitle}>攝影棚 ({studios.length})</Text>
                    {studios.map(studio => (
                      <TouchableOpacity
                        key={studio.id}
                        style={[
                          styles.optionCard,
                          selectedStudio?.id === studio.id && styles.optionCardSelected,
                        ]}
                        onPress={() => setSelectedStudio(studio)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.optionTitle}>{studio.name}</Text>
                          {studio.city ? (
                            <Text style={styles.optionSubtitle}>{studio.city}</Text>
                          ) : null}
                        </View>
                        {selectedStudio?.id === studio.id && (
                          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </>
                ) : null}

                {needStylist && stylists.length > 0 ? (
                  <>
                    <Text style={styles.poolTitle}>造型師 ({stylists.length})</Text>
                    {stylists.map(stylist => (
                      <TouchableOpacity
                        key={stylist.providerId}
                        style={[
                          styles.optionCard,
                          selectedStylist?.providerId === stylist.providerId && styles.optionCardSelected,
                        ]}
                        onPress={() => setSelectedStylist(stylist)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.optionTitle}>{stylist.nickName}</Text>
                          <Text style={styles.optionSubtitle}>{stylist.city}</Text>
                        </View>
                        {selectedStylist?.providerId === stylist.providerId && (
                          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </>
                ) : null}

                {renderNavButtons({
                  onBack: () => setStep(3),
                  onNext: () => canProceedStep4() && setStep(5),
                  nextDisabled: !canProceedStep4(),
                })}
              </View>
            )}

            {/* Step 5: 確認總覽 */}
            {step === 5 && selectedProvider && selectedServiceType && (
              <View>
                <Text style={styles.sectionTitle}>確認總覽</Text>
                <Text style={styles.sectionDesc}>請確認以下預約資訊</Text>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>拍攝類型</Text>
                    <Text style={styles.summaryValue}>{selectedServiceType.name}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>拍攝配置</Text>
                    <Text style={styles.summaryValue}>
                      {LOCATION_OPTIONS.find(o => o.key === shootLocation)?.label || shootLocation}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>拍攝日期</Text>
                    <Text style={styles.summaryValue}>{shootingDate}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>拍攝時間</Text>
                    <Text style={styles.summaryValue}>{timeStart} - {timeEnd}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>拍攝地點</Text>
                    <Text style={styles.summaryValue}>{shootingLocation || '待確認'}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>攝影師</Text>
                    <Text style={styles.summaryValue}>{selectedProvider.nickName}</Text>
                  </View>
                  {selectedStudio ? (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>攝影棚</Text>
                      <Text style={styles.summaryValue}>{selectedStudio.name}</Text>
                    </View>
                  ) : null}
                  {selectedStylist ? (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>造型師</Text>
                      <Text style={styles.summaryValue}>{selectedStylist.nickName}</Text>
                    </View>
                  ) : null}
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>人數</Text>
                    <Text style={styles.summaryValue}>大人 {adultNum}，小孩 {childNum}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotal]}>
                    <Text style={styles.summaryLabel}>總金額</Text>
                    <Text style={styles.summaryTotalValue}>$ {totalFee.toLocaleString()}</Text>
                  </View>
                </View>
                {renderNavButtons({
                  onBack: () => setStep(4),
                  onNext: () => setStep(6),
                  nextLabel: '前往結帳',
                })}
              </View>
            )}

            {/* Step 6: 結帳 placeholder */}
            {step === 6 && selectedProvider && selectedServiceType && (
              <View>
                <Text style={styles.sectionTitle}>結帳付款</Text>
                <Text style={styles.sectionDesc}>填寫聯絡資訊並完成線上付款</Text>

                <View style={styles.checkoutNotice}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={colors.secondary} />
                  <Text style={styles.checkoutNoticeText}>{t('booking.payNotice')}</Text>
                </View>

                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>應付金額</Text>
                    <Text style={styles.summaryTotalValue}>$ {totalFee.toLocaleString()}</Text>
                  </View>
                </View>

                <Text style={styles.formSectionTitle}>聯絡資訊</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t('booking.customerName')} *</Text>
                  <TextInput
                    style={styles.input}
                    value={customerName}
                    onChangeText={setCustomerName}
                    placeholder="請輸入姓名"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t('booking.customerPhone')} *</Text>
                  <TextInput
                    style={styles.input}
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                    placeholder="請輸入電話"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email（選填）</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="example@email.com"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>備註（選填）</Text>
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={remark}
                    onChangeText={setRemark}
                    placeholder="特殊需求或備註"
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                </View>

                <View style={styles.row}>
                  <Button
                    label={t('common.prev')}
                    onPress={() => setStep(5)}
                    variant="outline"
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button
                    label={t('booking.payNow')}
                    onPress={handleCreateOrder}
                    loading={submitting}
                    style={{ flex: 1, marginLeft: 8 }}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  stepBar: {
    paddingHorizontal: 12, paddingVertical: 12, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  stepIndicator: { flexDirection: 'row', justifyContent: 'space-between' },
  stepItem: { flex: 1, alignItems: 'center' },
  stepItemInner: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.borderStrong,
  },
  stepCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepCircleDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepCircleText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  stepCircleTextActive: { color: colors.white },
  stepLine: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: 2 },
  stepLineDone: { backgroundColor: colors.primary },
  stepLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
  stepLabelActive: { color: colors.primary, fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  sectionDesc: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  formSectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 12, marginTop: 8 },
  poolTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginTop: 12, marginBottom: 8 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 2, borderColor: 'transparent',
    ...shadows.sm,
  },
  optionCardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  optionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  optionSubtitle: { fontSize: 14, color: colors.textSecondary },
  ratingText: { fontSize: 13, color: colors.warning, marginTop: 2 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginTop: 4 },
  profileBtn: { padding: 6, marginRight: 4 },
  configGrid: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  configCard: {
    flex: 1, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12,
    paddingVertical: 20, borderWidth: 2, borderColor: 'transparent',
  },
  configCardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  configLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginTop: 8 },
  configLabelSelected: { color: colors.primary },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: colors.textSecondary, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  row: { flexDirection: 'row', marginTop: 8 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 15, color: colors.textSecondary, marginTop: 8 },
  summaryCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, flexShrink: 1, textAlign: 'right', marginLeft: 12 },
  summaryTotal: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 8, paddingTop: 12 },
  summaryTotalValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  checkoutNotice: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: colors.secondaryLight, borderRadius: 10, padding: 14, marginBottom: 16,
  },
  checkoutNoticeText: { flex: 1, fontSize: 13, color: colors.textRegular, lineHeight: 20 },
})
