<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">攝影師檔期總覽</h3>
      <div class="flex items-center gap-2">
        <el-date-picker
          v-model="selectedMonth"
          type="month"
          value-format="YYYY-MM"
          placeholder="選擇月份"
          @change="loadData"
        />
        <el-select v-model="selectedPhotographer" placeholder="選擇攝影師" clearable filterable style="width: 200px" @change="loadData">
          <el-option
            v-for="p in photographers"
            :key="p.id"
            :label="p.nickName || p.empno"
            :value="p.id"
          />
        </el-select>
      </div>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <template v-else>
      <!-- 統計卡片 -->
      <el-row :gutter="16" class="mb-6">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="text-center">
              <p class="text-sm text-gray-500">總預約數</p>
              <p class="text-2xl font-bold mt-1">{{ stats.totalBookings }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="text-center">
              <p class="text-sm text-gray-500">活躍攝影師</p>
              <p class="text-2xl font-bold mt-1">{{ stats.activePhotographers }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="text-center">
              <p class="text-sm text-gray-500">待拍攝</p>
              <p class="text-2xl font-bold mt-1 text-orange-500">{{ stats.pendingShoots }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="text-center">
              <p class="text-sm text-gray-500">拍攝中</p>
              <p class="text-2xl font-bold mt-1 text-blue-500">{{ stats.shooting }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <!-- 左側地區分組 -->
        <el-col :span="5">
          <el-card>
            <div class="text-sm font-semibold mb-3">依地區分組</div>
            <div
              v-for="group in areaGroups"
              :key="group.city"
              class="mb-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
              @click="filterByArea(group.city)"
            >
              <span class="text-sm">{{ group.city }}: {{ group.count }} 筆</span>
            </div>
            <el-button v-if="areaFilter" text type="primary" size="small" @click="areaFilter = ''" class="mt-2">清除篩選</el-button>
          </el-card>
        </el-col>

        <!-- 右側月曆 + 明細 -->
        <el-col :span="19">
          <!-- 月曆視圖 -->
          <el-card shadow="hover" class="mb-4">
            <template #header>
              <span>{{ selectedMonth || '本月' }} 檔期總覽</span>
            </template>
            <div class="cal-week-header">
              <div v-for="day in ['日','一','二','三','四','五','六']" :key="day" class="cal-week-day">{{ day }}</div>
            </div>
            <div class="cal-day-grid">
              <div
                v-for="day in calendarDays"
                :key="day.date || day.dayNumber"
                class="cal-day-cell"
                :class="{ 'cal-day-other': !day.isCurrentMonth, 'cal-day-has-booking': day.bookings > 0 }"
              >
                <div class="cal-day-num" :class="{ 'cal-day-num-other': !day.isCurrentMonth }">{{ day.dayNumber }}</div>
                <div v-if="day.bookings > 0" class="cal-booking-badge">
                  <el-badge :value="day.bookings" type="primary" />
                </div>
              </div>
            </div>
          </el-card>

          <!-- 詳細列表 -->
          <el-card shadow="hover">
            <template #header><span>預約明細</span></template>
            <el-table :data="filteredBookingList" border stripe>
              <el-table-column prop="date" label="日期" width="120" />
              <el-table-column prop="timeStart" label="開始" width="80" />
              <el-table-column prop="timeEnd" label="結束" width="80" />
              <el-table-column prop="photographerName" label="攝影師" width="100" />
              <el-table-column prop="consumerName" label="客戶" width="100" />
              <el-table-column prop="serviceType" label="類型" width="100" />
              <el-table-column prop="location" label="地點" min-width="120" show-overflow-tooltip />
              <el-table-column prop="status" label="狀態" width="100">
                <template #default="{ row }">
                  <el-tag :type="bookingStatusType(row.status)">{{ bookingStatusLabel(row.status) }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const loading = ref(false)
const selectedMonth = ref('')
const selectedPhotographer = ref<number | undefined>(undefined)
const photographers = ref<any[]>([])
const bookingList = ref<any[]>([])
const areaFilter = ref('')

const stats = reactive({
  totalBookings: 0,
  activePhotographers: 0,
  pendingShoots: 0,
  shooting: 0,
})

// 地區分組
const areaGroups = computed((): { city: string; count: number }[] => {
  const groups: Record<string, { city: string; count: number }> = {}
  bookingList.value.forEach(b => {
    const city = b.location || b.city || '未設定'
    if (!groups[city]) groups[city] = { city, count: 0 }
    groups[city].count++
  })
  return Object.values(groups)
})

const filteredBookingList = computed(() => {
  if (!areaFilter.value) return bookingList.value
  return bookingList.value.filter(b => (b.location || b.city || '') === areaFilter.value)
})

const filterByArea = (city: string) => { areaFilter.value = city }

// 月曆日期
const calendarDays = computed(() => {
  const now = new Date()
  const year = selectedMonth.value ? parseInt(selectedMonth.value.split('-')[0]) : now.getFullYear()
  const month = selectedMonth.value ? parseInt(selectedMonth.value.split('-')[1]) - 1 : now.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const days: any[] = []
  // 上月填充
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    days.push({ date: '', label: '', dayNumber: prevMonthLastDay - i, isCurrentMonth: false, bookings: 0 })
  }
  // 本月
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const bookings = bookingList.value.filter(b => b.date === dateStr).length
    days.push({ date: dateStr, label: ['日','一','二','三','四','五','六'][new Date(year, month, d).getDay()], dayNumber: d, isCurrentMonth: true, bookings })
  }
  // 下月填充
  while (days.length % 7 !== 0) {
    days.push({ date: '', label: '', dayNumber: days.length - startWeekday - daysInMonth + 1, isCurrentMonth: false, bookings: 0 })
  }
  return days
})

const bookingStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    PendingPayment: '待付款', Paid: '已付款', Confirmed: '已確認',
    ReadyToShoot: '待拍攝', ShootingStarted: '拍攝中', ShootingEnded: '拍攝結束',
    UploadingRaw: '上傳中', AiProcessing: 'AI處理中', Delivered: '已交付',
    Cancelled: '已取消', Closed: '已結案',
  }
  return map[status] || status
}

const bookingStatusType = (status: string) => {
  if (['Cancelled'].includes(status)) return 'danger'
  if (['Delivered', 'Closed'].includes(status)) return 'success'
  if (['ShootingStarted', 'AiProcessing'].includes(status)) return 'warning'
  return 'info'
}

const loadData = async () => {
  loading.value = true
  try {
    // 載入攝影師列表
    const provRes: any = await api.getProviders()
    photographers.value = (provRes.data || []).filter((p: any) => p.providerType === 'PHOTOGRAPHER' || p.providerType === 'photographer')

    // 載入檔期資料
    const res: any = await api.getAllSchedules(selectedMonth.value || undefined)
    const data = res.data || []
    bookingList.value = selectedPhotographer.value
      ? data.filter((b: any) => b.photographerId === selectedPhotographer.value)
      : data

    // 統計
    stats.totalBookings = bookingList.value.length
    stats.activePhotographers = new Set(bookingList.value.map((b: any) => b.photographerId)).size
    stats.pendingShoots = bookingList.value.filter((b: any) => b.status === 'ReadyToShoot').length
    stats.shooting = bookingList.value.filter((b: any) => b.status === 'ShootingStarted').length
  } catch {
    ElMessage.error('載入檔期資料失敗')
    bookingList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.cal-week-header { display: flex; flex-wrap: wrap; gap: 2px; margin-bottom: 2px; }
.cal-week-day {
  width: calc(100% / 7 - 2px); text-align: center; padding: 8px 0;
  background: #f5f7fa; border-radius: 4px; font-weight: bold; font-size: 14px;
}
.cal-day-grid { display: flex; flex-wrap: wrap; gap: 2px; }
.cal-day-cell {
  width: calc(100% / 7 - 2px); min-height: 70px; border: 1px solid #ebeef5;
  border-radius: 4px; padding: 4px; background: #fff; box-sizing: border-box;
}
.cal-day-other { background: #f9f9f9; opacity: 0.4; }
.cal-day-has-booking { border-color: #409eff; background: #ecf5ff; }
.cal-day-num { text-align: right; font-size: 13px; color: #666; }
.cal-day-num-other { color: #ccc; }
.cal-booking-badge { margin-top: 4px; }
</style>