<template>
  <el-card>
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <el-button @click="prevMonth">◀</el-button>
        <span class="font-semibold">{{ t('schedulePage.yearMonth', { year: currentYear, month: currentMonth }) }}</span>
        <el-button @click="nextMonth">▶</el-button>
        <el-button @click="goToday" size="small">{{ t('schedulePage.today') }}</el-button>
      </div>
      <el-button type="primary" @click="showDialog = true">{{ t('schedulePage.setSlot') }}</el-button>
      <el-button type="warning" @click="showBatchDialog = true">📅 {{ t('schedulePage.batchSet') }}</el-button>
    </div>

    <!-- 星期標頭 -->
    <div class="cal-week-header">
      <div v-for="(w, idx) in weekDays" :key="idx" class="cal-week-day">{{ w }}</div>
    </div>

    <!-- 日期格 -->
    <div class="cal-day-grid">
      <div
        v-for="d in calendarDays"
        :key="d.key"
        class="cal-day-cell"
        :class="{ 'cal-day-other': !d.isCurrentMonth, 'cal-day-today': d.isToday }"
      >
        <div v-if="d.isCurrentMonth">
          <div class="cal-day-num" :class="{ 'cal-day-num-today': d.isToday }">{{ d.day }}</div>
          <div v-for="slot in d.slots" :key="slot.id" class="cal-slot">
            <el-tag
              size="small"
              :type="slot.lockedByOrderId ? 'info' : 'success'"
              :closable="!slot.lockedByOrderId"
              @close="deleteSlot(slot.id)"
            >
              {{ slot.slotStart }}~{{ slot.slotEnd }}
            </el-tag>
          </div>
        </div>
        <div v-else class="cal-day-num cal-day-num-other">{{ d.day }}</div>
      </div>
    </div>

    <!-- 設定時段 Dialog -->
    <el-dialog v-model="showDialog" :title="t('schedulePage.dialogTitle')" width="min(400px, 92vw)">
      <el-form label-width="80px">
        <el-form-item :label="t('schedulePage.start')">
          <el-select v-model="newSlot.start">
            <el-option v-for="h in hours" :key="h" :label="h" :value="h" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('schedulePage.end')">
          <el-select v-model="newSlot.end">
            <el-option v-for="h in hours" :key="h" :label="h" :value="h" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('schedulePage.dates')">
          <el-checkbox-group v-model="newSlot.dates">
            <el-checkbox
              v-for="d in currentMonthDays"
              :key="d.key"
              :label="d.dateStr"
            >
              {{ d.day }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">{{ t('common.cancel', '取消') }}</el-button>
        <el-button type="primary" @click="saveSlot">{{ t('schedulePage.save') }}</el-button>
      </template>
    </el-dialog>

    <!-- 整月批次設定 Dialog -->
    <el-dialog v-model="showBatchDialog" :title="t('schedulePage.batchDialogTitle')" width="min(500px, 92vw)">
      <el-alert type="info" :closable="false" class="mb-4">
        {{ t('schedulePage.batchHint') }}
      </el-alert>
      <el-form label-width="100px">
        <el-form-item :label="t('schedulePage.start')">
          <el-select v-model="batchSlot.start">
            <el-option v-for="h in hours" :key="h" :label="h" :value="h" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('schedulePage.end')">
          <el-select v-model="batchSlot.end">
            <el-option v-for="h in hours" :key="h" :label="h" :value="h" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('schedulePage.excludeWeekend')">
          <el-switch v-model="batchSlot.excludeWeekend" />
          <span class="ml-2 text-xs text-gray-400">{{ t('schedulePage.excludeWeekendHint') }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchDialog = false">{{ t('common.cancel', '取消') }}</el-button>
        <el-button type="primary" :loading="batchLoading" @click="saveBatchSlot">{{ t('schedulePage.batchSave') }}</el-button>
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

const authStore = useAuthStore()
const { t } = useI18n()
const currentYear = ref(dayjs().year())
const currentMonth = ref(dayjs().month() + 1)
const showDialog = ref(false)
const showBatchDialog = ref(false)
const batchLoading = ref(false)
const slots = ref<any[]>([])

const batchSlot = reactive({ start: '10:00', end: '12:00', excludeWeekend: false })

const weekDays = computed(() => [
  t('schedulePage.weekSun'),
  t('schedulePage.weekMon'),
  t('schedulePage.weekTue'),
  t('schedulePage.weekWed'),
  t('schedulePage.weekThu'),
  t('schedulePage.weekFri'),
  t('schedulePage.weekSat'),
])
const hours = computed(() => {
  const result: string[] = []
  for (let h = 8; h <= 22; h++) result.push(`${String(h).padStart(2, '0')}:00`)
  return result
})

const newSlot = reactive({ start: '10:00', end: '12:00', dates: [] as string[] })

const calendarDays = computed(() => {
  const first = dayjs(`${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-01`)
  const startDay = first.day()
  const daysInMonth = first.daysInMonth()
  const prevMonthDays = first.subtract(1, 'month').daysInMonth()
  const days: any[] = []

  for (let i = 0; i < startDay; i++) {
    const d = prevMonthDays - startDay + i + 1
    days.push({ key: `prev-${d}`, day: d, isCurrentMonth: false, isToday: false, slots: [] })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      key: `cur-${i}`,
      day: i,
      isCurrentMonth: true,
      isToday: dateStr === dayjs().format('YYYY-MM-DD'),
      dateStr,
      slots: slots.value.filter(s => s.scheduleDate === dateStr),
    })
  }
  return days
})

const currentMonthDays = computed(() => calendarDays.value.filter(d => d.isCurrentMonth))

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
  loadSlots()
}

const loadSlots = async () => {
  if (!authStore.userId) return
  try {
    const res: any = await api.getSchedule(authStore.userId)
    slots.value = res.data || []
  } catch {
    slots.value = []
  }
}

const saveSlot = async () => {
  if (!newSlot.start || !newSlot.end) {
    ElMessage.warning(t('schedulePage.warnTimeRequired'))
    return
  }
  if (newSlot.start >= newSlot.end) {
    ElMessage.warning(t('schedulePage.warnEndAfterStart'))
    return
  }
  if (newSlot.dates.length === 0) {
    ElMessage.warning(t('schedulePage.warnSelectDate'))
    return
  }

  try {
    await api.setSchedule({
      providerId: authStore.userId,
      dates: newSlot.dates,
      slotStart: newSlot.start,
      slotEnd: newSlot.end,
    })
    ElMessage.success(t('schedulePage.saveSuccess'))
    showDialog.value = false
    newSlot.dates = []
    await loadSlots()
  } catch {
    ElMessage.error(t('schedulePage.saveFailed'))
  }
}

const deleteSlot = async (id: number) => {
  try {
    await api.deleteSchedule(id)
    ElMessage.success(t('schedulePage.deleteSuccess'))
    await loadSlots()
  } catch {
    ElMessage.error(t('schedulePage.deleteFailed'))
  }
}

const saveBatchSlot = async () => {
  if (batchSlot.start >= batchSlot.end) {
    ElMessage.warning(t('schedulePage.warnEndAfterStart'))
    return
  }
  // 產生整月所有日期
  const allDays = currentMonthDays.value
  const dates = allDays
    .filter(d => {
      if (!batchSlot.excludeWeekend) return true
      const day = dayjs(d.dateStr).day()
      return day !== 0 && day !== 6 // 排除週六日
    })
    .map(d => d.dateStr)

  if (dates.length === 0) {
    ElMessage.warning(t('schedulePage.warnNoDates'))
    return
  }

  batchLoading.value = true
  try {
    await api.setSchedule({
      providerId: authStore.userId,
      dates,
      slotStart: batchSlot.start,
      slotEnd: batchSlot.end,
    })
    ElMessage.success(t('schedulePage.batchSuccess'))
    showBatchDialog.value = false
    await loadSlots()
  } catch {
    ElMessage.error(t('schedulePage.batchFailed'))
  } finally {
    batchLoading.value = false
  }
}

onMounted(() => {
  loadSlots()
})
</script>

<style scoped>
/* 日曆樣式 */
.cal-week-header {
  display: flex;
  flex-wrap: wrap;
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
  min-height: 80px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 4px;
  background: #fff;
  box-sizing: border-box;
  transition: box-shadow 0.2s;
}
.cal-day-cell:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.cal-day-other {
  background: #f9f9f9;
  opacity: 0.4;
}
.cal-day-today {
  border-color: var(--wl-primary, #F37A69);
  border-width: 2px;
}
.cal-day-num {
  text-align: right;
  font-size: 13px;
  color: #666;
}
.cal-day-num-today {
  font-weight: bold;
  color: var(--wl-primary, #F37A69);
}
.cal-day-num-other {
  font-size: 12px;
  color: #ccc;
}
.cal-slot {
  margin-top: 4px;
  text-align: center;
}
</style>