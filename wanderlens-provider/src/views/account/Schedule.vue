<template>
  <el-card>
    <div class="schedule-toolbar">
      <div class="schedule-toolbar-left">
        <el-button @click="prevMonth">◀</el-button>
        <span class="month-title">{{ t('schedulePage.yearMonth', { year: currentYear, month: currentMonth }) }}</span>
        <el-button @click="nextMonth">▶</el-button>
        <el-button size="small" @click="goToday">{{ t('schedulePage.today') }}</el-button>
      </div>
      <div class="schedule-toolbar-right">
        <span class="select-mode-label">{{ t('schedulePage.multiSelect') }}</span>
        <el-switch v-model="multiSelectMode" @change="onMultiSelectToggle" />
        <el-button type="warning" @click="openDialog()">
          {{ t('schedulePage.setSlot') }}
        </el-button>
      </div>
    </div>

    <p class="schedule-hint">{{ t('schedulePage.clickHint') }}</p>

    <!-- 星期標頭（週一開始） -->
    <div class="cal-week-header">
      <div v-for="(w, idx) in weekDays" :key="idx" class="cal-week-day">{{ w }}</div>
    </div>

    <!-- 月曆格：可點選日期 -->
    <div class="cal-day-grid">
      <div
        v-for="d in calendarDays"
        :key="d.key"
        class="cal-day-cell"
        :class="{
          'cal-day-other': !d.isCurrentMonth,
          'cal-day-today': d.isToday,
          'cal-day-selected': d.isCurrentMonth && selectedDates.includes(d.dateStr),
          'cal-day-focused': d.dateStr === focusedDate,
        }"
        @click="onDayClick(d)"
      >
        <template v-if="d.isCurrentMonth">
          <div class="cal-day-num" :class="{ 'cal-day-num-today': d.isToday }">
            {{ currentMonth }}/{{ d.day }}
          </div>
          <div v-for="slot in d.slots" :key="slot.id" class="cal-slot" @click.stop>
            <el-popconfirm
              v-if="!slot.lockedByOrderId"
              :title="t('schedulePage.deleteConfirm')"
              @confirm="deleteSlot(slot.id)"
            >
              <template #reference>
                <el-tag size="small" type="success" class="slot-tag">
                  {{ formatSlotLabel(slot) }}
                  <span class="slot-x">×</span>
                </el-tag>
              </template>
            </el-popconfirm>
            <el-tag v-else size="small" type="warning">
              {{ formatSlotLabel(slot) }}
            </el-tag>
          </div>
        </template>
        <div v-else class="cal-day-num cal-day-num-other">{{ d.day }}</div>
      </div>
    </div>

    <!-- 單日詳情：快速加第二段、第三段時段 -->
    <div v-if="focusedDate" class="day-panel">
      <div class="day-panel-header">
        <span class="day-panel-title">
          {{ t('schedulePage.dayPanelTitle', { date: formatDisplayDate(focusedDate) }) }}
        </span>
        <el-button size="small" type="primary" link @click="openDialog([focusedDate])">
          {{ t('schedulePage.editDay') }}
        </el-button>
      </div>

      <div v-if="focusedDaySlots.length === 0" class="day-panel-empty">
        {{ t('schedulePage.noSlotsThisDay') }}
      </div>
      <div v-else class="day-panel-slots">
        <div v-for="slot in focusedDaySlots" :key="slot.id" class="day-panel-slot">
          <span>{{ formatSlotLabel(slot) }}</span>
          <el-tag v-if="slot.lockedByOrderId" size="small" type="warning">{{ t('schedulePage.booked') }}</el-tag>
          <el-button
            v-else
            size="small"
            type="danger"
            link
            @click="deleteSlot(slot.id)"
          >
            {{ t('schedulePage.remove') }}
          </el-button>
        </div>
      </div>

      <div class="quick-add">
        <span class="quick-add-label">{{ t('schedulePage.quickAdd') }}</span>
        <el-select v-model="quickAdd.start" size="small" style="width: 100px">
          <el-option v-for="h in hours" :key="'qs-' + h" :label="h" :value="h" />
        </el-select>
        <span>—</span>
        <el-select v-model="quickAdd.end" size="small" style="width: 100px">
          <el-option v-for="h in endHourOptions(quickAdd.start)" :key="'qe-' + h" :label="h" :value="h" />
        </el-select>
        <el-button size="small" type="primary" :loading="quickAddLoading" @click="saveQuickAdd">
          {{ t('schedulePage.quickAddBtn') }}
        </el-button>
      </div>
    </div>

    <!-- 設定對話框：多日 + 多時段 -->
    <el-dialog
      v-model="showDialog"
      :title="t('schedulePage.dialogTitle')"
      width="min(640px, 96vw)"
      @closed="dialogSaving = false"
    >
      <el-alert type="info" :closable="false" class="mb-4">
        {{ t('schedulePage.dialogHint') }}
      </el-alert>

      <div class="dialog-section">
        <div class="dialog-section-title">{{ t('schedulePage.timeRanges') }}</div>
        <div v-for="(range, idx) in dialogRanges" :key="idx" class="range-row">
          <el-select v-model="range.start" :placeholder="t('schedulePage.start')" style="width: 110px">
            <el-option v-for="h in hours" :key="'ds-' + idx + h" :label="h" :value="h" />
          </el-select>
          <span>—</span>
          <el-select v-model="range.end" :placeholder="t('schedulePage.end')" style="width: 110px">
            <el-option v-for="h in endHourOptions(range.start)" :key="'de-' + idx + h" :label="h" :value="h" />
          </el-select>
          <el-button
            v-if="dialogRanges.length > 1"
            type="danger"
            link
            @click="dialogRanges.splice(idx, 1)"
          >
            {{ t('schedulePage.removeRange') }}
          </el-button>
        </div>
        <el-button size="small" @click="dialogRanges.push({ start: '14:00', end: '18:00' })">
          ＋ {{ t('schedulePage.addRange') }}
        </el-button>
      </div>

      <div class="dialog-section">
        <div class="dialog-section-head">
          <span class="dialog-section-title">{{ t('schedulePage.pickDates') }}</span>
          <span class="selected-count">{{ t('schedulePage.selectedCount', { n: dialogDates.length }) }}</span>
        </div>
        <div class="dialog-quick-actions">
          <el-button size="small" @click="selectAllMonth">{{ t('schedulePage.selectAllMonth') }}</el-button>
          <el-button size="small" @click="selectWeekdays">{{ t('schedulePage.selectWeekdays') }}</el-button>
          <el-button size="small" @click="dialogDates = []">{{ t('schedulePage.clearDates') }}</el-button>
        </div>

        <div class="cal-week-header dialog-week">
          <div v-for="(w, idx) in weekDays" :key="'dw-' + idx" class="cal-week-day">{{ w }}</div>
        </div>
        <el-checkbox-group v-model="dialogDates" class="dialog-date-grid">
          <template v-for="cell in dialogCalendarCells" :key="cell.key">
            <div v-if="!cell.dateStr" class="dialog-date-empty" />
            <el-checkbox-button v-else :label="cell.dateStr" :disabled="!cell.isCurrentMonth">
              {{ cell.day }}
            </el-checkbox-button>
          </template>
        </el-checkbox-group>
      </div>

      <template #footer>
        <el-button @click="showDialog = false">{{ t('common.cancel', '取消') }}</el-button>
        <el-button type="primary" :loading="dialogSaving" @click="saveDialog">
          {{ t('schedulePage.save') }}
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'

interface ScheduleSlot {
  id: number
  scheduleDate: string
  slotStart: string
  slotEnd: string
  lockedByOrderId?: number | null
  active?: string
}

interface TimeRange {
  start: string
  end: string
}

const authStore = useAuthStore()
const { t } = useI18n()
const currentYear = ref(dayjs().year())
const currentMonth = ref(dayjs().month() + 1)
const showDialog = ref(false)
const dialogSaving = ref(false)
const quickAddLoading = ref(false)
const multiSelectMode = ref(false)
const selectedDates = ref<string[]>([])
const focusedDate = ref('')
const dialogDates = ref<string[]>([])
const dialogRanges = ref<TimeRange[]>([{ start: '09:00', end: '12:00' }])
const slots = ref<ScheduleSlot[]>([])

const quickAdd = reactive({ start: '09:00', end: '12:00' })

const weekDays = computed(() => [
  t('schedulePage.weekMon'),
  t('schedulePage.weekTue'),
  t('schedulePage.weekWed'),
  t('schedulePage.weekThu'),
  t('schedulePage.weekFri'),
  t('schedulePage.weekSat'),
  t('schedulePage.weekSun'),
])

const hours = computed(() => {
  const result: string[] = []
  for (let h = 8; h <= 22; h++) result.push(`${String(h).padStart(2, '0')}:00`)
  return result
})

function normalizeDate(value: unknown): string {
  if (typeof value === 'string') return value.slice(0, 10)
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d] = value
    return dayjs(`${y}-${m}-${d}`).format('YYYY-MM-DD')
  }
  return ''
}

function formatTime(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.slice(0, 5)
}

function normalizeSlot(raw: Record<string, unknown>): ScheduleSlot {
  return {
    id: Number(raw.id),
    scheduleDate: normalizeDate(raw.scheduleDate),
    slotStart: formatTime(raw.slotStart),
    slotEnd: formatTime(raw.slotEnd),
    lockedByOrderId: raw.lockedByOrderId as number | null | undefined,
    active: raw.active as string | undefined,
  }
}

function formatSlotLabel(slot: ScheduleSlot): string {
  return `${slot.slotStart}–${slot.slotEnd}`
}

function formatDisplayDate(dateStr: string): string {
  return dayjs(dateStr).format('YYYY/MM/DD')
}

function endHourOptions(start: string): string[] {
  return hours.value.filter((h) => h > start)
}

function buildCalendarCells(year: number, month: number) {
  const first = dayjs(`${year}-${String(month).padStart(2, '0')}-01`)
  const daysInMonth = first.daysInMonth()
  const mondayOffset = (first.day() + 6) % 7
  const prevMonthDays = first.subtract(1, 'month').daysInMonth()
  const cells: Array<{
    key: string
    day: number
    dateStr: string
    isCurrentMonth: boolean
    isToday: boolean
    slots: ScheduleSlot[]
  }> = []

  for (let i = 0; i < mondayOffset; i++) {
    const day = prevMonthDays - mondayOffset + i + 1
    cells.push({
      key: `prev-${day}-${i}`,
      day,
      dateStr: '',
      isCurrentMonth: false,
      isToday: false,
      slots: [],
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    cells.push({
      key: `cur-${i}`,
      day: i,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === dayjs().format('YYYY-MM-DD'),
      slots: slots.value.filter((s) => s.scheduleDate === dateStr && s.active !== 'N'),
    })
  }

  let nextDay = 1
  while (cells.length % 7 !== 0) {
    cells.push({
      key: `next-${nextDay}`,
      day: nextDay,
      dateStr: '',
      isCurrentMonth: false,
      isToday: false,
      slots: [],
    })
    nextDay++
  }

  return cells
}

const calendarDays = computed(() => buildCalendarCells(currentYear.value, currentMonth.value))
const dialogCalendarCells = computed(() => buildCalendarCells(currentYear.value, currentMonth.value))

const focusedDaySlots = computed(() =>
  slots.value
    .filter((s) => s.scheduleDate === focusedDate.value && s.active !== 'N')
    .sort((a, b) => a.slotStart.localeCompare(b.slotStart)),
)

const onMultiSelectToggle = (enabled: string | number | boolean) => {
  if (!enabled) selectedDates.value = []
}

const onDayClick = (d: { dateStr: string; isCurrentMonth: boolean }) => {
  if (!d.isCurrentMonth || !d.dateStr) return
  focusedDate.value = d.dateStr

  if (multiSelectMode.value) {
    const idx = selectedDates.value.indexOf(d.dateStr)
    if (idx >= 0) selectedDates.value.splice(idx, 1)
    else selectedDates.value.push(d.dateStr)
    return
  }

  selectedDates.value = [d.dateStr]
}

const openDialog = (presetDates?: string[]) => {
  dialogDates.value = presetDates?.length
    ? [...presetDates]
    : selectedDates.value.length
      ? [...selectedDates.value]
      : focusedDate.value
        ? [focusedDate.value]
        : []
  dialogRanges.value = [{ start: '09:00', end: '12:00' }]
  showDialog.value = true
}

const selectAllMonth = () => {
  dialogDates.value = calendarDays.value
    .filter((d) => d.isCurrentMonth && d.dateStr)
    .map((d) => d.dateStr)
}

const selectWeekdays = () => {
  dialogDates.value = calendarDays.value
    .filter((d) => {
      if (!d.isCurrentMonth || !d.dateStr) return false
      const wd = dayjs(d.dateStr).day()
      return wd !== 0 && wd !== 6
    })
    .map((d) => d.dateStr)
}

const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
  loadSlots()
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
  loadSlots()
}

const goToday = () => {
  currentYear.value = dayjs().year()
  currentMonth.value = dayjs().month() + 1
  focusedDate.value = dayjs().format('YYYY-MM-DD')
  selectedDates.value = [focusedDate.value]
  loadSlots()
}

const loadSlots = async () => {
  const providerId = authStore.resolvedProviderId
  if (!providerId) return
  try {
    const res: any = await api.getSchedule(providerId)
    slots.value = (res.data || []).map((row: Record<string, unknown>) => normalizeSlot(row))
  } catch {
    slots.value = []
  }
}

const validateRanges = (ranges: TimeRange[]): boolean => {
  for (const range of ranges) {
    if (!range.start || !range.end) {
      ElMessage.warning(t('schedulePage.warnTimeRequired'))
      return false
    }
    if (range.start >= range.end) {
      ElMessage.warning(t('schedulePage.warnEndAfterStart'))
      return false
    }
  }
  return true
}

const saveSlotsForDates = async (dates: string[], ranges: TimeRange[]) => {
  const providerId = authStore.resolvedProviderId
  if (!providerId) return 0
  let created = 0
  for (const range of ranges) {
    const res: any = await api.setSchedule({
      providerId,
      dates,
      slotStart: range.start,
      slotEnd: range.end,
    })
    created += res.data?.created ?? 0
  }
  return created
}

const saveDialog = async () => {
  if (dialogDates.value.length === 0) {
    ElMessage.warning(t('schedulePage.warnSelectDate'))
    return
  }
  if (!validateRanges(dialogRanges.value)) return

  dialogSaving.value = true
  try {
    const created = await saveSlotsForDates(dialogDates.value, dialogRanges.value)
    ElMessage.success(
      created > 0
        ? t('schedulePage.saveSuccessCount', { n: created })
        : t('schedulePage.saveSuccess'),
    )
    showDialog.value = false
    selectedDates.value = [...dialogDates.value]
    await loadSlots()
  } catch {
    ElMessage.error(t('schedulePage.saveFailed'))
  } finally {
    dialogSaving.value = false
  }
}

const saveQuickAdd = async () => {
  if (!focusedDate.value) return
  if (!validateRanges([{ start: quickAdd.start, end: quickAdd.end }])) return

  quickAddLoading.value = true
  try {
    const created = await saveSlotsForDates([focusedDate.value], [{ start: quickAdd.start, end: quickAdd.end }])
    if (created === 0) {
      ElMessage.info(t('schedulePage.slotExists'))
    } else {
      ElMessage.success(t('schedulePage.saveSuccess'))
    }
    await loadSlots()
  } catch {
    ElMessage.error(t('schedulePage.saveFailed'))
  } finally {
    quickAddLoading.value = false
  }
}

const deleteSlot = async (id: number) => {
  const providerId = authStore.resolvedProviderId
  if (!providerId) return
  try {
    await api.deleteSchedule(id, providerId)
    ElMessage.success(t('schedulePage.deleteSuccess'))
    await loadSlots()
  } catch {
    ElMessage.error(t('schedulePage.deleteFailed'))
  }
}

onMounted(() => {
  focusedDate.value = dayjs().format('YYYY-MM-DD')
  loadSlots()
})
</script>

<style scoped>
.schedule-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.schedule-toolbar-left,
.schedule-toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.month-title {
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}
.select-mode-label {
  font-size: 13px;
  color: #666;
}
.schedule-hint {
  font-size: 12px;
  color: #909399;
  margin: 0 0 12px;
}

.cal-week-header {
  display: flex;
  gap: 2px;
  margin-bottom: 2px;
}
.cal-week-day {
  width: calc(100% / 7 - 2px);
  text-align: center;
  padding: 8px 0;
  background: #f5f7fa;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
}
.cal-day-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
.cal-day-cell {
  width: calc(100% / 7 - 2px);
  min-height: 88px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 4px;
  background: #fff;
  box-sizing: border-box;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.cal-day-cell:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.cal-day-other {
  background: #f9f9f9;
  opacity: 0.45;
  cursor: default;
}
.cal-day-today {
  border-color: var(--wl-primary, #f37a69);
}
.cal-day-selected {
  background: #fff7f5;
  border-color: var(--wl-primary, #f37a69);
  box-shadow: inset 0 0 0 1px var(--wl-primary, #f37a69);
}
.cal-day-focused {
  background: #fff3ef;
}
.cal-day-num {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}
.cal-day-num-today {
  display: inline-block;
  float: right;
  font-weight: bold;
  color: #fff;
  background: var(--wl-primary, #f37a69);
  border-radius: 6px;
  padding: 2px 6px;
}
.cal-day-num-other {
  font-size: 12px;
  color: #ccc;
  text-align: right;
}
.cal-slot {
  margin-top: 2px;
  text-align: center;
}
.slot-tag {
  cursor: pointer;
}
.slot-x {
  margin-left: 4px;
  font-size: 10px;
}

.day-panel {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fafafa;
}
.day-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.day-panel-title {
  font-weight: 600;
}
.day-panel-empty {
  color: #909399;
  font-size: 13px;
  margin-bottom: 12px;
}
.day-panel-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.day-panel-slot {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}
.quick-add {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px dashed #dcdfe6;
}
.quick-add-label {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.dialog-section {
  margin-bottom: 20px;
}
.dialog-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.dialog-section-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.selected-count {
  font-size: 13px;
  color: #909399;
}
.dialog-quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.range-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.dialog-date-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
.dialog-date-grid :deep(.el-checkbox-button) {
  width: calc(100% / 7 - 2px);
  margin: 0;
}
.dialog-date-grid :deep(.el-checkbox-button__inner) {
  width: 100%;
  padding: 10px 0;
  border-radius: 4px;
}
.dialog-date-empty {
  width: calc(100% / 7 - 2px);
  min-height: 40px;
}
.dialog-week {
  margin-bottom: 4px;
}
</style>
