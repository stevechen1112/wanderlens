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
import {
  buildMondayFirstCalendar,
  endHourOptions,
  normalizeScheduleSlot,
  SCHEDULE_HOURS,
  type TimeRange,
} from '@/utils/schedule'

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

function TimeChipRow({
  label,
  value,
  options,
  onChange,
  colors,
  styles,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  colors: AppColors
  styles: ReturnType<typeof makeStyles>
}) {
  return (
    <View style={styles.timeRow}>
      <Text style={styles.timeLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((h) => (
          <TouchableOpacity
            key={`${label}-${h}`}
            style={[styles.timeChip, value === h && styles.timeChipActive]}
            onPress={() => onChange(h)}
          >
            <Text style={[styles.timeChipText, value === h && styles.timeChipTextActive]}>{h}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

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
  const [setupVisible, setSetupVisible] = useState(false)
  const [setupDates, setSetupDates] = useState<string[]>([])
  const [setupRanges, setSetupRanges] = useState<TimeRange[]>([{ start: '09:00', end: '12:00' }])
  const [setupMode, setSetupMode] = useState<'available' | 'block'>('available')
  const [excludeWeekend, setExcludeWeekend] = useState(false)
  const [saving, setSaving] = useState(false)
  const [quickStart, setQuickStart] = useState('09:00')
  const [quickEnd, setQuickEnd] = useState('12:00')
  const [quickSaving, setQuickSaving] = useState(false)

  const loadSchedule = useCallback(async () => {
    if (!providerId) return
    setError(false)
    try {
      const res: { data?: Record<string, unknown>[] } = await providerApi.getSchedule(providerId)
      setSlots((res.data || []).map((row) => normalizeScheduleSlot(row)))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [providerId])

  React.useEffect(() => { loadSchedule() }, [loadSchedule])

  const calendarDays = useMemo(() => buildMondayFirstCalendar(viewMonth), [viewMonth])

  const slotsByDate = useMemo(() => {
    const map: Record<string, ScheduleSlot[]> = {}
    slots.forEach((s) => {
      if (!s.scheduleDate) return
      if (!map[s.scheduleDate]) map[s.scheduleDate] = []
      map[s.scheduleDate].push(s)
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

  const selectedSlots = (slotsByDate[selectedDate] || [])
    .filter((s) => s.active !== 'N')
    .sort((a, b) => (a.slotStart || '').localeCompare(b.slotStart || ''))

  const prevMonth = () => setViewMonth(viewMonth.subtract(1, 'month'))
  const nextMonth = () => setViewMonth(viewMonth.add(1, 'month'))

  const toggleDateSelection = (date: string, inMonth: boolean) => {
    if (!inMonth) return
    setSelectedDate(date)
    if (!selectMode) {
      setSelectedDates([date])
      return
    }
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    )
  }

  const selectWeekdaysInMonth = () => {
    const days = calendarDays
      .filter((d) => {
        if (!d.inMonth) return false
        const wd = dayjs(d.date).day()
        return wd !== 0 && wd !== 6
      })
      .map((d) => d.date)
    setSelectedDates(days)
    setSelectMode(true)
  }

  const resolveSetupDates = (): string[] => {
    let dates = setupDates.length > 0
      ? setupDates
      : selectedDates.length > 0
        ? selectedDates
        : selectMode
          ? []
          : [selectedDate]
    if (dates.length === 0) {
      dates = calendarDays.filter((d) => d.inMonth).map((d) => d.date)
    }
    if (excludeWeekend) {
      dates = dates.filter((d) => {
        const wd = dayjs(d).day()
        return wd !== 0 && wd !== 6
      })
    }
    return dates
  }

  const openSetupModal = () => {
    const preset = selectedDates.length > 0
      ? [...selectedDates]
      : selectMode
        ? []
        : [selectedDate]
    setSetupDates(preset)
    setSetupRanges([{ start: '09:00', end: '12:00' }])
    setSetupMode('available')
    setExcludeWeekend(false)
    setSetupVisible(true)
  }

  const validateRanges = (ranges: TimeRange[]): boolean => {
    for (const range of ranges) {
      if (!range.start || !range.end || range.start >= range.end) {
        Alert.alert(t('schedule.timeError'), t('schedule.timeErrorDesc'))
        return false
      }
    }
    return true
  }

  const saveSlotsForDates = async (
    dates: string[],
    ranges: TimeRange[],
    mode: 'available' | 'block',
  ): Promise<number> => {
    if (!providerId) return 0
    let total = 0
    for (const range of ranges) {
      const payload = {
        providerId,
        dates,
        slotStart: range.start,
        slotEnd: range.end,
      }
      if (mode === 'block') {
        const res: { data?: { blocked?: number } } = await providerApi.blockSchedule(payload)
        total += res.data?.blocked ?? 0
      } else {
        const res: { data?: { created?: number } } = await providerApi.setSchedule(payload)
        total += res.data?.created ?? 0
      }
    }
    return total
  }

  const saveSetup = async () => {
    const dates = resolveSetupDates()
    if (dates.length === 0) {
      Alert.alert(t('schedule.pickDate'), t('schedule.pickDateDesc'))
      return
    }
    if (!validateRanges(setupRanges)) return

    setSaving(true)
    try {
      const total = await saveSlotsForDates(dates, setupRanges, setupMode)
      haptics.success()
      setSetupVisible(false)
      setSelectedDates([])
      setSelectMode(false)
      if (setupMode === 'block') {
        Alert.alert(
          t('schedule.blockSuccess'),
          total > 0 ? t('schedule.blockedCount', { n: total }) : t('schedule.blockedNone'),
        )
      } else {
        Alert.alert(
          t('schedule.setSuccess'),
          total > 0 ? t('schedule.createdCount', { n: total }) : t('schedule.createdNone'),
        )
      }
      await loadSchedule()
    } catch {
      Alert.alert(t('schedule.saveFailed'), t('schedule.saveFailedDesc'))
    } finally {
      setSaving(false)
    }
  }

  const saveQuickAdd = async () => {
    if (!providerId || !selectedDate) return
    if (quickStart >= quickEnd) {
      Alert.alert(t('schedule.timeError'), t('schedule.timeErrorDesc'))
      return
    }
    setQuickSaving(true)
    try {
      const total = await saveSlotsForDates(
        [selectedDate],
        [{ start: quickStart, end: quickEnd }],
        'available',
      )
      haptics.success()
      if (total === 0) {
        Alert.alert(t('schedule.setSuccess'), t('schedule.createdNone'))
      } else {
        Alert.alert(t('schedule.setSuccess'), t('schedule.createdCount', { n: total }))
      }
      await loadSchedule()
    } catch {
      Alert.alert(t('schedule.saveFailed'), t('schedule.saveFailedDesc'))
    } finally {
      setQuickSaving(false)
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
            haptics.success()
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
          <Text style={styles.toolbarLabel}>{t('schedule.multiSelect')}</Text>
          <Switch
            value={selectMode}
            onValueChange={(v) => {
              setSelectMode(v)
              if (!v) setSelectedDates([])
              else if (selectedDate) setSelectedDates([selectedDate])
            }}
            trackColor={{ true: colors.primary }}
            accessibilityRole="switch"
            accessibilityLabel={t('schedule.multiSelect')}
          />
        </View>
        <View style={styles.toolbarActions}>
          <TouchableOpacity style={styles.toolBtnPrimary} onPress={openSetupModal}>
            <Ionicons name="add-circle-outline" size={16} color={colors.white} />
            <Text style={styles.toolBtnPrimaryText}>{t('schedule.setSlots')}</Text>
          </TouchableOpacity>
          {selectMode ? (
            <TouchableOpacity style={styles.toolBtn} onPress={selectWeekdaysInMonth}>
              <Ionicons name="calendar-outline" size={16} color={colors.secondary} />
              <Text style={styles.toolBtnText}>{t('schedule.selectWeekdays')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Text style={styles.hint}>{t('schedule.hint')}</Text>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadSchedule() }}
            colors={[colors.primary]}
          />
        }
      >
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
              const isFocused = cell.date === selectedDate && cell.inMonth
              const isMultiSelected = selectedDates.includes(cell.date)
              const isToday = cell.date === dayjs().format('YYYY-MM-DD')
              const indicators = dayIndicators[cell.date] || []
              return (
                <TouchableOpacity
                  key={cell.date}
                  style={[
                    styles.dayCell,
                    !cell.inMonth && styles.dayCellMuted,
                    isFocused && styles.dayCellSelected,
                    isMultiSelected && selectMode && styles.dayCellMultiSelected,
                    isToday && !isFocused && !isMultiSelected && styles.dayCellToday,
                  ]}
                  onPress={() => toggleDateSelection(cell.date, cell.inMonth)}
                  onLongPress={() => {
                    if (!selectMode) {
                      setSelectMode(true)
                      setSelectedDates([cell.date])
                    }
                    toggleDateSelection(cell.date, cell.inMonth)
                  }}
                >
                  <Text style={[
                    styles.dayNum,
                    !cell.inMonth && styles.dayNumMuted,
                    isFocused && styles.dayNumSelected,
                    isMultiSelected && selectMode && styles.dayNumMultiSelected,
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

          <View style={styles.legend}>
            {(Object.keys(STATUS_CONFIG) as SlotStatus[]).map((key) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: STATUS_CONFIG[key].color }]} />
                <Text style={styles.legendText}>{t(`schedule.${key}`)}</Text>
              </View>
            ))}
          </View>
        </View>

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
                    <Text style={styles.slotTime}>{formatSlotTime(slot.slotStart, slot.slotEnd)}</Text>
                    {slot.lockedByOrderId ? (
                      <Text style={styles.slotOrder}>{t('schedule.slotBooked', { id: slot.lockedByOrderId })}</Text>
                    ) : (
                      <Text style={styles.slotOrder}>{t('schedule.slotOpenHint')}</Text>
                    )}
                  </View>
                  {!slot.lockedByOrderId ? (
                    <TouchableOpacity onPress={() => deleteSlot(slot)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  ) : (
                    <Ionicons name="ellipse" size={10} color={cfg.color} />
                  )}
                </View>
              )
            })
          )}

          <View style={styles.quickAddCard}>
            <Text style={styles.quickAddTitle}>{t('schedule.quickAddTitle')}</Text>
            <Text style={styles.quickAddHint}>{t('schedule.quickAddHint')}</Text>
            <TimeChipRow
              label={t('schedule.startTime')}
              value={quickStart}
              options={SCHEDULE_HOURS}
              onChange={(v) => {
                setQuickStart(v)
                if (quickEnd <= v) setQuickEnd(endHourOptions(v)[0] || '22:00')
              }}
              colors={colors}
              styles={styles}
            />
            <TimeChipRow
              label={t('schedule.endTime')}
              value={quickEnd}
              options={endHourOptions(quickStart)}
              onChange={setQuickEnd}
              colors={colors}
              styles={styles}
            />
            <TouchableOpacity
              style={[styles.quickAddBtn, quickSaving && styles.quickAddBtnDisabled]}
              onPress={saveQuickAdd}
              disabled={quickSaving}
            >
              <Text style={styles.quickAddBtnText}>
                {quickSaving ? t('common.saving') : t('schedule.quickAddBtn')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={setupVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{t('schedule.setupTitle')}</Text>
              <Text style={styles.modalHint}>
                {setupDates.length > 0 || selectedDates.length > 0
                  ? t('schedule.selectedDays', {
                      n: setupDates.length || selectedDates.length,
                    })
                  : t('schedule.applyFocusedOrMonth')}
              </Text>

              <View style={styles.modeRow}>
                <TouchableOpacity
                  style={[styles.modeChip, setupMode === 'available' && styles.modeChipActive]}
                  onPress={() => setSetupMode('available')}
                >
                  <Text style={[styles.modeChipText, setupMode === 'available' && styles.modeChipTextActive]}>
                    {t('schedule.open')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeChip, setupMode === 'block' && styles.modeChipActiveBlock]}
                  onPress={() => setSetupMode('block')}
                >
                  <Text style={[styles.modeChipText, setupMode === 'block' && styles.modeChipTextActive]}>
                    {t('schedule.blockOption')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionLabel}>{t('schedule.timeRanges')}</Text>
              {setupRanges.map((range, idx) => (
                <View key={`range-${idx}`} style={styles.rangeBlock}>
                  <View style={styles.rangeHeader}>
                    <Text style={styles.rangeTitle}>{t('schedule.rangeLabel', { n: idx + 1 })}</Text>
                    {setupRanges.length > 1 ? (
                      <TouchableOpacity onPress={() => setSetupRanges(setupRanges.filter((_, i) => i !== idx))}>
                        <Text style={styles.rangeRemove}>{t('schedule.removeRange')}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <TimeChipRow
                    label={t('schedule.startTime')}
                    value={range.start}
                    options={SCHEDULE_HOURS}
                    onChange={(v) => {
                      const next = [...setupRanges]
                      next[idx] = {
                        start: v,
                        end: next[idx].end <= v ? (endHourOptions(v)[0] || '22:00') : next[idx].end,
                      }
                      setSetupRanges(next)
                    }}
                    colors={colors}
                    styles={styles}
                  />
                  <TimeChipRow
                    label={t('schedule.endTime')}
                    value={range.end}
                    options={endHourOptions(range.start)}
                    onChange={(v) => {
                      const next = [...setupRanges]
                      next[idx] = { ...next[idx], end: v }
                      setSetupRanges(next)
                    }}
                    colors={colors}
                    styles={styles}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addRangeBtn}
                onPress={() => setSetupRanges([...setupRanges, { start: '14:00', end: '18:00' }])}
              >
                <Ionicons name="add" size={18} color={colors.primary} />
                <Text style={styles.addRangeText}>{t('schedule.addRange')}</Text>
              </TouchableOpacity>

              <View style={styles.toolbarRow}>
                <Text style={styles.toolbarLabel}>{t('schedule.excludeWeekend')}</Text>
                <Switch
                  value={excludeWeekend}
                  onValueChange={setExcludeWeekend}
                  trackColor={{ true: colors.primary }}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setSetupVisible(false)}>
                  <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirm} onPress={saveSetup} disabled={saving}>
                  <Text style={styles.modalConfirmText}>{saving ? t('common.saving') : t('common.save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  toolbar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  toolbarRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  toolbarLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  toolbarActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  toolBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.md,
  },
  toolBtnText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  toolBtnPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md,
  },
  toolBtnPrimaryText: { fontSize: 13, fontWeight: '700', color: colors.white },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    lineHeight: 18,
  },
  calendarCard: {
    backgroundColor: colors.surface, marginHorizontal: spacing.lg, marginBottom: spacing.lg,
    borderRadius: radius.lg, padding: spacing.lg,
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
  legend: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md,
    marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.textSecondary },
  slotsSection: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  slotsTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  emptySlots: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl,
    alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md,
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
  quickAddCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickAddTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  quickAddHint: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 18 },
  quickAddBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickAddBtnDisabled: { opacity: 0.6 },
  quickAddBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalScroll: { maxHeight: '92%' },
  modalScrollContent: { flexGrow: 1, justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.xs },
  modalHint: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  modeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  modeChip: {
    flex: 1, paddingVertical: 10, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center',
  },
  modeChipActive: { backgroundColor: colors.primary },
  modeChipActiveBlock: { backgroundColor: colors.textSecondary },
  modeChipText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  modeChipTextActive: { color: colors.white },
  rangeBlock: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rangeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  rangeTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  rangeRemove: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  addRangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  addRangeText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  timeRow: { marginBottom: spacing.sm },
  timeLabel: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  timeChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.md,
    backgroundColor: colors.surface, marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
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
