<template>
  <div class="market-dashboard">
    <div class="page-header">
      <div>
        <h2 class="page-title">跨境市場訊號儀表板</h2>
        <p class="page-desc">來源國、訊號類型與流量趨勢 — Phase 4/5 數據營運</p>
      </div>
      <el-radio-group v-model="days" @change="loadData">
        <el-radio-button :value="7">7 天</el-radio-button>
        <el-radio-button :value="30">30 天</el-radio-button>
        <el-radio-button :value="90">90 天</el-radio-button>
      </el-radio-group>
    </div>

    <div v-if="loading" class="loading-wrap">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <template v-else>
      <el-row :gutter="16" class="mb-4">
        <el-col :span="6" v-for="card in summaryCards" :key="card.key">
          <el-card shadow="hover" class="stat-card">
            <p class="stat-label">{{ card.label }}</p>
            <p class="stat-value" :style="{ color: card.color }">{{ card.value }}</p>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16" class="mb-4">
        <el-col :span="14">
          <el-card shadow="hover">
            <template #header><span>來源國 × 訊號類型（堆疊長條）</span></template>
            <v-chart :option="countryBarOption" style="height: 360px" autoresize />
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card shadow="hover">
            <template #header><span>訊號類型分布</span></template>
            <v-chart :option="typePieOption" style="height: 360px" autoresize />
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header><span>聯盟行銷成效</span></template>
            <v-chart :option="affiliateBarOption" style="height: 280px" autoresize />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="flex justify-between items-center">
                <span>訊號明細</span>
                <el-tag size="small">{{ rows.length }} 筆聚合</el-tag>
              </div>
            </template>
            <el-table :data="rows" border stripe max-height="280" size="small">
              <el-table-column prop="sourceCountry" label="來源國" width="90" />
              <el-table-column prop="signalType" label="訊號類型" width="140" />
              <el-table-column prop="total" label="累計" width="80" align="right" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import api from '@/api'

use([CanvasRenderer, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const COLORS = ['#F37A69', '#52B6CC', '#13CE66', '#FF9F40', '#9B59B6', '#3498DB']

const loading = ref(true)
const days = ref(30)
const rows = ref<any[]>([])
const affiliates = ref<any[]>([])

const countryBarOption = ref<any>({
  color: COLORS,
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0 },
  grid: { left: 48, right: 16, top: 24, bottom: 48 },
  xAxis: { type: 'category', data: [] as string[] },
  yAxis: { type: 'value' },
  series: [] as any[],
})

const typePieOption = ref<any>({
  color: COLORS,
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [{ type: 'pie', radius: ['42%', '68%'], data: [] as any[] }],
})

const affiliateBarOption = ref<any>({
  color: COLORS,
  tooltip: { trigger: 'axis' },
  grid: { left: 48, right: 16, top: 24, bottom: 32 },
  xAxis: { type: 'category', data: [] as string[], axisLabel: { rotate: 30 } },
  yAxis: { type: 'value' },
  series: [
    { name: '點擊', type: 'bar', data: [] as number[] },
    { name: '轉換', type: 'bar', data: [] as number[] },
  ],
})

const totalSignals = computed(() =>
  rows.value.reduce((s, r) => s + (r.total || 0), 0),
)

const uniqueCountries = computed(() =>
  new Set(rows.value.map(r => r.sourceCountry)).size,
)

const summaryCards = computed(() => [
  { key: 'signals', label: '訊號總量', value: totalSignals.value, color: '#F37A69' },
  { key: 'countries', label: '來源國數', value: uniqueCountries.value, color: '#52B6CC' },
  { key: 'affiliates', label: '推廣夥伴', value: affiliates.value.length, color: '#13CE66' },
  {
    key: 'clicks',
    label: '聯盟點擊',
    value: affiliates.value.reduce((s, a) => s + (a.clickCount || 0), 0),
    color: '#FF9F40',
  },
])

function buildCharts(data: any[]) {
  rows.value = data

  const countries = [...new Set(data.map(d => d.sourceCountry))].sort()
  const types = [...new Set(data.map(d => d.signalType))].sort()

  const matrix: Record<string, Record<string, number>> = {}
  const typeTotals: Record<string, number> = {}

  for (const row of data) {
    const c = row.sourceCountry || 'UNKNOWN'
    const t = row.signalType || 'UNKNOWN'
    matrix[c] = matrix[c] || {}
    matrix[c][t] = (matrix[c][t] || 0) + (row.total || 0)
    typeTotals[t] = (typeTotals[t] || 0) + (row.total || 0)
  }

  countryBarOption.value = {
    ...countryBarOption.value,
    xAxis: { type: 'category', data: countries },
    series: types.map(t => ({
      name: t,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      data: countries.map(c => matrix[c]?.[t] || 0),
    })),
  }

  typePieOption.value = {
    ...typePieOption.value,
    series: [{
      type: 'pie',
      radius: ['42%', '68%'],
      data: Object.entries(typeTotals).map(([name, value]) => ({ name, value })),
    }],
  }
}

function buildAffiliateChart(list: any[]) {
  const top = [...list]
    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    .slice(0, 8)

  affiliateBarOption.value = {
    ...affiliateBarOption.value,
    xAxis: {
      type: 'category',
      data: top.map(a => a.name || a.referralCode),
      axisLabel: { rotate: 30, interval: 0 },
    },
    series: [
      { name: '點擊', type: 'bar', data: top.map(a => a.clickCount || 0) },
      { name: '轉換', type: 'bar', data: top.map(a => a.conversionCount || 0) },
    ],
  }
}

async function loadData() {
  loading.value = true
  try {
    const [signalRes, affRes]: any[] = await Promise.all([
      api.getMarketSignalDashboard(days.value),
      api.getAffiliates(),
    ])
    affiliates.value = affRes?.data || []
    buildCharts(signalRes?.data || [])
    buildAffiliateChart(affiliates.value)
  } catch {
    ElMessage.error('載入市場訊號失敗')
    rows.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title { font-size: 22px; font-weight: 800; color: #1a1a2e; }
.page-desc { font-size: 13px; color: #888; margin-top: 4px; }
.loading-wrap { display: flex; justify-content: center; padding: 48px; }
.stat-card { text-align: center; }
.stat-label { font-size: 13px; color: #888; margin-bottom: 4px; }
.stat-value { font-size: 28px; font-weight: 800; }
</style>
