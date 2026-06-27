import React, { useCallback, useMemo, useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
  Modal, Alert, Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import ScreenHeader from '@/components/ScreenHeader'
import StateView from '@/components/StateView'
import { providerApi, type ScheduleSlot } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'
import { haptics } from '@/utils/haptics'
import { formatSlotTime } from '@/utils/format'

type SlotStatus = 'available' | 'booked' | 'blocked'

function getSlotStatus(slot: ScheduleSlot): SlotStatus {
  if (slot.active === 'N') return 'blocked'
  if (slot.lockedByOrderId) return 'booked'
  return 'available'
}

const makeStatusConfig = (colors: AppColors): Record<SlotStatus, { color: string; bg: string }> => ({
  available: { color: colors.success, bg: colors.success + '18' },
  booked: { color: colors.primary, bg: colors.primaryLight },
  blocked: { color: colors.textSecondary, bg: colors.background },
})

const COL_WIDTH = `${100 / 7}%` as const

const HOURS = Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`)

export default function ScheduleScreen() {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const STATUS_CONFIG = useMemo(() => makeStatusConfig(colors), [colors])
  const { t } = useLocale()
  const WEEKDAYS = t('schedule.weekdaysShort').split(',')
  const { providerId } = useAuthStore()
  const [slots, setSlots] = useState<ScheduleSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(false)
  const [viewMonth, setViewMonth] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [selectMode, setSelectMode] = useState(false)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [batchVisible, setBatchVisible] = useState(false)
  const [batchStart, setBatchStart] = useState('10:00')
  const [batchEnd, setBatchEnd] = useState('12:00')
  const [batchMode, setBatchMode] = useState<'available' | 'block'>('available')
  const [excludeWeekend, setExcludeWeekend] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadSchedule = useCallback(async () => {
    if (!providerId) return
    setError(false)
    try {
      const res: { data?: ScheduleSlot[] } = await providerApi.getSchedule(providerId)
      setSlots(res.data || [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [providerId])

  React.useEffect(() => { loadSchedule() }, [loadSchedule])

  const calendarDays = useMemo(() => {
    const start = viewMonth.startOf('month')
    const end = viewMonth.endOf('month')
    const days: Array<{ date: string; day: number; inMonth: boolean }> = []
    const startPad = start.day()
    for (let i = startPad - 1; i >= 0; i--) {
      const d = start.subtract(i + 1, 'day')
      days.push({ date: d.format('YYYY-MM-DD'), day: d.date(), inMonth: false })
    }
    for (let d = 1; d <= end.date(); d++) {
      const date = viewMonth.date(d).format('YYYY-MM-DD')
      days.push({ date, day: d, inMonth: true })
    }
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const d = end.add(i, 'day')
      days.push({ date: d.format('YYYY-MM-DD'), day: d.date(), inMonth: false })
    }
    return days
  }, [viewMonth])

  const slotsByDate = useMemo(() => {
    const map: Record<string, ScheduleSlot[]> = {}
    slots.forEach((s) => {
      const key = s.scheduleDate
      if (!map[key]) map[key] = []
      map[key].push(s)
    })
    return map
  }, [slots])

  const dayIndicators = useMemo(() => {
    const indicators: Record<string, SlotStatus[]> = {}
    Object.entries(slotsByDate).forEach(([date, daySlots]) => {
      indicators[date] = [...new Set(daySlots.map(getSlotStatus))]
    })
    return indicators
  }, [slotsByDate])

  const selectedSlots = (slotsByDate[selectedDate] || []).sort((a, b) =>
    (a.slotStart || '').localeCompare(b.slotStart || ''))

  const prevMonth = () => setViewMonth(viewMonth.subtract(1, 'month'))
  const nextMonth = () => setViewMonth(viewMonth.add(1, 'month'))

  const toggleDateSelection = (date: string, inMonth: boolean) => {
    if (!inMonth) return
    if (!selectMode) {
      setSelectedDate(date)
      return
    }
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date])
  }

  const selectWholeMonth = () => {
    const days = calendarDays.filter((d) => d.inMonth).map((d) => d.date)
    const filtered = excludeWeekend
      ? days.filter((d) => {
          const wd = dayjs(d).day()
          return wd !== 0 && wd !== 6
        })
      : days
    setSelectedDates(filtered)
  }

  const saveBatchSlots = async () => {
    if (!providerId) return
    const dates = selectedDates.length > 0
      ? selectedDates
      : calendarDays.filter((d) => d.inMonth).map((d) => d.date)
    const filtered = excludeWeekend
      ? dates.filter((d) => {
          const wd = dayjs(d).day()
          return wd !== 0 && wd !== 6
        })
      : dates
    if (filtered.length === 0) {
      Alert.alert(t('schedule.pickDate'), t('schedule.pickDateDesc'))
      return
    }
    if (batchStart >= batchEnd) {
      Alert.alert(t('schedule.timeError'), t('schedule.timeErrorDesc'))
      return
    }
    setSaving(true)
    try {
      const payload = {
        providerId,
        dates: filtered,
        slotStart: batchStart,
        slotEnd: batchEnd,
      }
      if (batchMode === 'block') {
        const res: { data?: { blocked?: number } } = await providerApi.blockSchedule(payload)
        const blocked = res.data?.blocked ?? 0
        Alert.alert(t('schedule.blockSuccess'), blocked > 0 ? t('schedule.blockedCount', { n: blocked }) : t('schedule.blockedNone'))
      } else {
        const res: { data?: { created?: number } } = await providerApi.setSchedule(payload)
        const created = res.data?.created ?? 0
        Alert.alert(t('schedule.setSuccess'), created > 0 ? t('schedule.createdCount', { n: created }) : t('schedule.createdNone'))
      }
      haptics.success()
      setBatchVisible(false)
      setSelectedDates([])
      setSelectMode(false)
      await loadSchedule()
    } catch {
      Alert.alert(t('schedule.saveFailed'), t('schedule.saveFailedDesc'))
    } finally {
      setSaving(false)
    }
  }

  const deleteSlot = (slot: ScheduleSlot) => {
    if (!providerId || slot.lockedByOrderId) return
    Alert.alert(t('schedule.deleteSlot'), t('schedule.deleteSlotConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await providerApi.deleteSchedule(slot.id, providerId)
            await loadSchedule()
          } catch {
            Alert.alert(t('schedule.deleteFailed'), t('schedule.deleteFailedDesc'))
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('schedule.title')} subtitle={t('schedule.subtitle')} large />
        <StateView type="loading" />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('schedule.title')} large />
        <StateView type="error" onRetry={() => { setLoading(true); loadSchedule() }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('schedule.title')} subtitle={t('schedule.subtitle')} large />
      <View style={styles.toolbar}>
        <View style={styles.toolbarRow}>
          <Text style={styles.toolbarLabel}>{t('schedule.batchSelect')}</Text>
          <Switch
            value={selectMode}
            onValueChange={(v) => {
              setSelectMode(v)
              if (!v) setSelectedDates([])
            }}
            trackColor={{ true: colors.primary }}
            accessibilityRole="switch"
            accessibilityLabel={t('schedule.batchSelect')}
          />
        </View>
        <View style={styles.toolbarActions}>
          <TouchableOpacity style={styles.toolBtn} onPress={() => setBatchVisible(true)} accessibilityRole="button" accessibilityLabel={t('schedule.batchConfig')}>
            <Ionicons name="copy-outline" size={16} color={colors.primary} />
            <Text style={styles.toolBtnText}>{t('schedule.batchConfig')}</Text>
          </TouchableOpacity>
          {selectMode ? (
            <TouchableOpacity style={styles.toolBtn} onPress={selectWholeMonth} accessibilityRole="button" accessibilityLabel={t('schedule.selectMonth')}>
              <Ionicons name="calendar-outline" size={16} color={colors.secondary} />
              <Text style={styles.toolBtnText}>{t('schedule.selectMonth')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadSchedule() }} colors={[colors.primary]} />}
      >
        {/* 月曆 */}
        <View style={styles.calendarCard}>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{viewMonth.format(t('schedule.monthFormat'))}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAYS.map((w) => (
              <Text key={w} style={styles.weekLabel}>{w}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calendarDays.map((cell) => {
              const isSelected = cell.date === selectedDate
              const isMultiSelected = selectedDates.includes(cell.date)
              const isToday = cell.date === dayjs().format('YYYY-MM-DD')
              const indicators = dayIndicators[cell.date] || []
              return (
                <TouchableOpacity
                  key={cell.date}
                  style={[
                    styles.dayCell,
                    !cell.inMonth && styles.dayCellMuted,
                    isSelected && !selectMode && styles.dayCellSelected,
                    isMultiSelected && styles.dayCellMultiSelected,
                    isToday && !isSelected && !isMultiSelected && styles.dayCellToday,
                  ]}
                  onPress={() => toggleDateSelection(cell.date, cell.inMonth)}
                  onLongPress={() => {
                    if (!selectMode) setSelectMode(true)
                    toggleDateSelection(cell.date, cell.inMonth)
                  }}
                >
                  <Text style={[
                    styles.dayNum,
                    !cell.inMonth && styles.dayNumMuted,
                    isSelected && styles.dayNumSelected,
                    isMultiSelected && styles.dayNumMultiSelected,
                  ]}>
                    {cell.day}
                  </Text>
                  {indicators.length > 0 && (
                    <View style={styles.dotRow}>
                      {indicators.slice(0, 3).map((st) => (
                        <View key={st} style={[styles.dot, { backgroundColor: STATUS_CONFIG[st].color }]} />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>

          {/* 圖例 */}
          <View style={styles.legend}>
            {(Object.keys(STATUS_CONFIG) as SlotStatus[]).map((key) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: STATUS_CONFIG[key].color }]} />
                <Text style={styles.legendText}>{t(`schedule.${key}`)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 當日時段 */}
        <View style={styles.slotsSection}>
          <Text style={styles.slotsTitle}>
            {t('schedule.slotsTitle', { date: dayjs(selectedDate).format(t('schedule.dayFormat')) })}
          </Text>
          {selectedSlots.length === 0 ? (
            <View style={styles.emptySlots}>
              <Ionicons name="time-outline" size={36} color={colors.textSecondary} />
              <Text style={styles.emptySlotsText}>{t('schedule.noSlotsConfigured')}</Text>
            </View>
          ) : (
            selectedSlots.map((slot) => {
              const status = getSlotStatus(slot)
              const cfg = STATUS_CONFIG[status]
              return (
                <View key={slot.id} style={[styles.slotCard, { borderLeftColor: cfg.color }]}>
                  <View style={[styles.slotBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.slotBadgeText, { color: cfg.color }]}>{t(`schedule.${status}`)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.slotTime}>
                      {formatSlotTime(slot.slotStart, slot.slotEnd)}
                    </Text>
                    {slot.lockedByOrderId ? (
                      <Text style={styles.slotOrder}>{t('schedule.slotBooked', { id: slot.lockedByOrderId })}</Text>
                    ) : (
                      <Text style={styles.slotOrder}>{t('schedule.slotOpenHint')}</Text>
                    )}
                  </View>
                  {!slot.lockedByOrderId ? (
                    <TouchableOpacity onPress={() => deleteSlot(slot)} hitSlop={8} accessibilityRole="button" accessibilityLabel={t('schedule.deleteSlot')}>
                      <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  ) : (
                    <Ionicons name="ellipse" size={10} color={cfg.color} />
                  )}
                </View>
              )
            })
          )}
        </View>
      </ScrollView>

      <Modal visible={batchVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{batchMode === 'block' ? t('schedule.batchBlockTitle') : t('schedule.batchConfigTitle')}</Text>
            <View style={styles.modeRow}>
              <TouchableOpacity
                style={[styles.modeChip, batchMode === 'available' && styles.modeChipActive]}
                onPress={() => setBatchMode('available')}
                accessibilityRole="button"
                accessibilityLabel={t('schedule.open')}
              >
                <Text style={[styles.modeChipText, batchMode === 'available' && styles.modeChipTextActive]}>{t('schedule.open')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeChip, batchMode === 'block' && styles.modeChipActiveBlock]}
                onPress={() => setBatchMode('block')}
                accessibilityRole="button"
                accessibilityLabel={t('schedule.blockOption')}
              >
                <Text style={[styles.modeChipText, batchMode === 'block' && styles.modeChipTextActive]}>{t('schedule.blockOption')}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalHint}>
              {selectedDates.length > 0
                ? t('schedule.selectedDays', { n: selectedDates.length })
                : t('schedule.applyAllMonth')}
            </Text>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>{t('schedule.startTime')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {HOURS.map((h) => (
                  <TouchableOpacity
                    key={`s-${h}`}
                    style={[styles.timeChip, batchStart === h && styles.timeChipActive]}
                    onPress={() => setBatchStart(h)}
                  >
                    <Text style={[styles.timeChipText, batchStart === h && styles.timeChipTextActive]}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>{t('schedule.endTime')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {HOURS.map((h) => (
                  <TouchableOpacity
                    key={`e-${h}`}
                    style={[styles.timeChip, batchEnd === h && styles.timeChipActive]}
                    onPress={() => setBatchEnd(h)}
                  >
                    <Text style={[styles.timeChipText, batchEnd === h && styles.timeChipTextActive]}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.toolbarRow}>
              <Text style={styles.toolbarLabel}>{t('schedule.excludeWeekend')}</Text>
              <Switch value={excludeWeekend} onValueChange={setExcludeWeekend} trackColor={{ true: colors.primary }} accessibilityRole="switch" accessibilityLabel={t('schedule.excludeWeekend')} />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setBatchVisible(false)} accessibilityRole="button" accessibilityLabel={t('common.cancel')}>
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={saveBatchSlots} disabled={saving} accessibilityRole="button" accessibilityLabel={t('common.save')}>
                <Text style={styles.modalConfirmText}>{saving ? t('common.saving') : t('common.save')}</Text>
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
  toolbar: {
    paddingHorizontal: spacing.lg, paddingBottom: spacing.sm,
    flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm,
  },
  toolbarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  toolbarLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  toolbarActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  toolBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.md,
  },
  toolBtnText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  calendarCard: {
    backgroundColor: colors.surface, marginHorizontal: spacing.lg, marginBottom: spacing.lg,
    borderRadius: radius.lg, padding: spacing.lg,
    width: 'auto', maxWidth: '100%', alignSelf: 'stretch', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  navBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  monthTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, flex: 1, textAlign: 'center' },
  weekRow: { flexDirection: 'row', width: '100%', marginBottom: spacing.sm },
  weekLabel: { width: COL_WIDTH, textAlign: 'center', fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  dayCell: {
    width: COL_WIDTH,
    aspectRatio: 1,
    maxHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  dayCellMuted: { opacity: 0.35 },
  dayCellSelected: { backgroundColor: colors.primary },
  dayCellMultiSelected: { backgroundColor: colors.secondary + '55', borderWidth: 1.5, borderColor: colors.secondary },
  dayCellToday: { borderWidth: 1.5, borderColor: colors.primary },
  dayNum: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  dayNumMuted: { color: colors.textSecondary },
  dayNumSelected: { color: colors.white, fontWeight: '800' },
  dayNumMultiSelected: { color: colors.secondary, fontWeight: '800' },
  dotRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md, marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.textSecondary },
  slotsSection: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  slotsTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  emptySlots: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xxxl,
    alignItems: 'center', gap: spacing.sm,
  },
  emptySlotsText: { fontSize: 14, color: colors.textSecondary },
  slotCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm,
    borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  slotBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm },
  slotBadgeText: { fontSize: 11, fontWeight: '700' },
  slotTime: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  slotOrder: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    padding: spacing.lg, paddingBottom: spacing.xxxl,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  modeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  modeChip: {
    flex: 1, paddingVertical: 10, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center',
  },
  modeChipActive: { backgroundColor: colors.primary },
  modeChipActiveBlock: { backgroundColor: colors.textSecondary },
  modeChipText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  modeChipTextActive: { color: colors.white },
  modalHint: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.lg },
  timeRow: { marginBottom: spacing.md },
  timeLabel: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  timeChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md,
    backgroundColor: colors.background, marginRight: spacing.sm,
  },
  timeChipActive: { backgroundColor: colors.primary },
  timeChipText: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  timeChipTextActive: { color: colors.white },
  modalActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  modalCancel: {
    flex: 1, paddingVertical: 14, borderRadius: radius.lg, backgroundColor: colors.background, alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
  modalConfirm: {
    flex: 1, paddingVertical: 14, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center',
  },
  modalConfirmText: { fontSize: 15, fontWeight: '700', color: colors.white },
})
