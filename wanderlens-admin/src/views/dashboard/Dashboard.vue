<template>
  <div>
    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <template v-else>
    <!-- 統計卡片 -->
    <el-row :gutter="16" class="mb-6">
      <el-col :xs="12" :sm="12" :md="6" :lg="6" v-for="stat in stats" :key="stat.key">
        <el-card shadow="hover" class="stat-card cursor-pointer">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">{{ stat.label }}</p>
              <p class="text-3xl font-extrabold" :style="{ color: stat.color }">{{ stat.value }}</p>
              <p class="text-xs text-gray-400 mt-1">
                <span :class="stat.trend > 0 ? 'text-success' : stat.trend < 0 ? 'text-danger' : 'text-gray-400'">
                  {{ stat.trend > 0 ? '↑' : stat.trend < 0 ? '↓' : '—' }} {{ stat.trend !== 0 ? Math.abs(stat.trend) + '%' : '' }}
                </span>
                {{ t('dashboard.vsLastWeek') }}
              </p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ background: stat.color + '15' }">
              <el-icon :size="24" :style="{ color: stat.color }">
                <component :is="stat.icon" />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 圖表 -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :md="16">
        <el-card shadow="hover">
          <template #header><span>{{ t('dashboard.orderTrend') }}</span></template>
          <v-chart :option="orderChartOption" style="height: 300px" autoresize />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" class="mt-4 md:mt-0">
        <el-card shadow="hover">
          <template #header><span>{{ t('dashboard.areaDist') }}</span></template>
          <v-chart :option="areaChartOption" style="height: 300px" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="mt-4">
      <template #header><span>{{ t('dashboard.recentLogs') }}</span></template>
      <div class="wl-table-scroll">
      <el-table :data="actionLogs" border size="small" max-height="250">
        <el-table-column prop="createdAt" :label="t('dashboard.logTime')" width="160" />
        <el-table-column prop="username" :label="t('dashboard.logUser')" width="100" />
        <el-table-column prop="action" :label="t('dashboard.logAction')" />
      </el-table>
      </div>
    </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Document, User, Money, Camera, Loading } from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { ElMessage } from 'element-plus'
import api from '@/api'

const { t } = useI18n()

use([CanvasRenderer, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const loading = ref(true)
const actionLogs = ref<any[]>([])

const stats = ref([
  { key: 'orders', label: '訂單數', value: 0, trend: 0, icon: Document, color: '#F37A69' },
  { key: 'customers', label: '客戶數', value: 0, trend: 0, icon: User, color: '#52B6CC' },
  { key: 'revenue', label: '總金額', value: 0, trend: 0, icon: Money, color: '#13CE66' },
  { key: 'photographers', label: '攝影師數', value: 0, trend: 0, icon: Camera, color: '#FF9F40' },
])

const orderChartOption = ref({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: [] as string[] },
  yAxis: { type: 'value' },
  series: [{ data: [] as number[], type: 'line', smooth: true, areaStyle: {} }],
})

const areaChartOption = ref({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [] as any[],
  }],
})

const loadDashboard = async () => {
  loading.value = true
  try {
    // 載入訂單統計
    const ordersRes: any = await api.getOrders()
    const orders = ordersRes.data || []
    stats.value[0].value = orders.length

    // 計算總金額
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalFee || 0), 0)
    stats.value[2].value = totalRevenue.toLocaleString()

    // 載入客戶數
    const customersRes: any = await api.getCustomers()
    stats.value[1].value = (customersRes.data || []).length

    // 載入攝影師數
    const provRes: any = await api.getProviders()
    const photographers = (provRes.data || []).filter((p: any) =>
      p.providerType === 'PHOTOGRAPHER' || p.providerType === 'photographer'
    )
    stats.value[3].value = photographers.length

    // 訂單趨勢圖（依月份分組）
    const monthlyData: Record<string, number> = {}
    orders.forEach((o: any) => {
      const month = o.shootingDate?.substring(0, 7) || o.createdAt?.substring(0, 7) || '未知'
      monthlyData[month] = (monthlyData[month] || 0) + 1
    })
    const sortedMonths = Object.keys(monthlyData).sort()
    orderChartOption.value.xAxis.data = sortedMonths
    orderChartOption.value.series[0].data = sortedMonths.map(m => monthlyData[m])

    // 地區分布圖
    const areaData: Record<string, number> = {}
    orders.forEach((o: any) => {
      const city = o.city || '未知'
      areaData[city] = (areaData[city] || 0) + 1
    })
    areaChartOption.value.series[0].data = Object.entries(areaData).map(([name, value]) => ({ name, value }))

    // 載入最近通知作為操作日誌
    try {
      const notifyRes: any = await api.getNotifications(1, 10)
      actionLogs.value = (notifyRes.data?.records || notifyRes.data || []).map((n: any) => ({
        createdAt: n.createdAt,
        username: n.targetName || '系統',
        action: n.message || n.title || '',
      }))
    } catch { actionLogs.value = [] }
  } catch {
    ElMessage.error(t('dashboard.loadFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>