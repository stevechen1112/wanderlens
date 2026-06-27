<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">聯盟行銷成效報表</h3>
      <div class="flex items-center gap-2">
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" value-format="YYYY-MM-DD" @change="loadData" />
        <el-button @click="loadData">重新整理</el-button>
      </div>
    </div>

    <!-- 統計卡片 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500">總點擊數</p>
            <p class="text-2xl font-bold mt-1" style="color: #F37A69">{{ summary.totalClicks }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500">轉換數</p>
            <p class="text-2xl font-bold mt-1" style="color: #52B6CC">{{ summary.totalConversions }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500">轉換率</p>
            <p class="text-2xl font-bold mt-1" style="color: #13CE66">{{ summary.conversionRate }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500">總佣金</p>
            <p class="text-2xl font-bold mt-1" style="color: #FF9F40">${{ summary.totalCommission }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 報表表格 -->
    <el-table :data="reportData" border stripe>
      <el-table-column prop="orderNo" label="訂單編號" width="180" />
      <el-table-column prop="customerName" label="客戶" width="100" />
      <el-table-column prop="affiliateName" label="推廣員" width="120" />
      <el-table-column prop="clickDate" label="點擊日期" width="120" />
      <el-table-column prop="convertDate" label="轉換日期" width="120" />
      <el-table-column label="金額" width="100">
        <template #default="{ row }">${{ row.orderAmount?.toLocaleString() || 0 }}</template>
      </el-table-column>
      <el-table-column label="佣金" width="100">
        <template #default="{ row }">${{ row.commission?.toLocaleString() || 0 }}</template>
      </el-table-column>
      <el-table-column prop="status" label="狀態" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'CONVERTED' ? 'success' : 'info'" size="small">
            {{ row.status === 'CONVERTED' ? '已轉換' : '點擊' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="reportData.length === 0" class="text-center text-gray-400 py-8">暫無資料</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import api from '@/api'

const dateRange = ref<string[]>([])
const reportData = ref<any[]>([])
const summary = reactive({
  totalClicks: 0,
  totalConversions: 0,
  conversionRate: '0',
  totalCommission: '0',
})

const loadData = async () => {
  try {
    const params: any = {}
    if (dateRange.value?.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    const res: any = await api.getAffiliates(params)
    const data = res.data || []
    reportData.value = Array.isArray(data) ? data : (data.records || [])

    // 計算統計
    const clicks = reportData.value.filter(r => r.status === 'CLICKED' || r.status === 'CONVERTED').length
    const conversions = reportData.value.filter(r => r.status === 'CONVERTED').length
    summary.totalClicks = clicks
    summary.totalConversions = conversions
    summary.conversionRate = clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0'
    summary.totalCommission = reportData.value.reduce((sum, r) => sum + (r.commission || 0), 0).toLocaleString()
  } catch {
    reportData.value = []
  }
}

onMounted(loadData)
</script>