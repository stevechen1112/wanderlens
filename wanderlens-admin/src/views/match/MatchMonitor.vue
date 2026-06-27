<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold">即時媒合監控</h3>
      <el-button :loading="loading" @click="load">重新整理</el-button>
    </div>

    <el-row :gutter="16" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500">搜尋中</p>
            <p class="text-3xl font-bold" style="color: #FF9F40">{{ monitor.searchingCount ?? 0 }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500">已媒合待付款</p>
            <p class="text-3xl font-bold" style="color: #13CE66">{{ monitor.matchedCount ?? 0 }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500">30 日媒合率</p>
            <p class="text-3xl font-bold" style="color: #409EFF">{{ monitor.matchRate ?? 0 }}%</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500">更新時間</p>
            <p class="text-sm font-medium mt-2">{{ formatTime(monitor.timestamp) }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="mb-4">
      <template #header>
        <span class="font-semibold">媒合數據分析（S3-010 · 近 30 日）</span>
      </template>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="metric-box">
            <p class="metric-label">建立需求</p>
            <p class="metric-value">{{ monitor.requestsCreated30d ?? 0 }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-box">
            <p class="metric-label">成功接受</p>
            <p class="metric-value text-green-600">{{ monitor.requestsAccepted30d ?? 0 }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-box">
            <p class="metric-label">降級 fallback</p>
            <p class="metric-value text-orange-500">{{ monitor.fallback30d ?? 0 }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-box">
            <p class="metric-label">逾時</p>
            <p class="metric-value text-red-500">{{ monitor.timeout30d ?? 0 }}</p>
          </div>
        </el-col>
      </el-row>
      <el-divider />
      <el-row :gutter="16">
        <el-col :span="12">
          <p class="text-sm text-gray-500">累計媒合需求</p>
          <p class="text-xl font-bold">{{ monitor.totalRequestsAllTime ?? 0 }}</p>
        </el-col>
        <el-col :span="12">
          <p class="text-sm text-gray-500">累計成功媒合</p>
          <p class="text-xl font-bold">{{ monitor.matchedAllTime ?? 0 }}</p>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-semibold">對外開放開關（S3-009）</span>
          <el-button type="primary" size="small" :loading="savingFlags" @click="saveFlags">儲存設定</el-button>
        </div>
      </template>
      <el-form label-width="140px">
        <el-form-item label="即時媒合總開關">
          <el-switch v-model="flags.instantMatchEnabled" />
          <span class="ml-2 text-xs text-gray-400">關閉後消費者與攝影師 App 皆無法使用</span>
        </el-form-item>
        <el-form-item label="旅拍即時">
          <el-switch v-model="flags.travelInstantEnabled" :disabled="!flags.instantMatchEnabled" />
        </el-form-item>
        <el-form-item label="街拍隨行">
          <el-switch v-model="flags.streetInstantEnabled" :disabled="!flags.instantMatchEnabled" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="monitor.activeRequests || []" border stripe>
      <el-table-column prop="id" label="需求 ID" width="90" />
      <el-table-column prop="status" label="狀態" width="120">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="shootingLocation" label="地點" min-width="180" />
      <el-table-column prop="estimatedFee" label="預估費用" width="100">
        <template #default="{ row }">${{ row.estimatedFee?.toLocaleString() }}</template>
      </el-table-column>
      <el-table-column prop="radiusKm" label="半徑" width="80" />
      <el-table-column prop="createdAt" label="建立時間" width="170" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'

const loading = ref(false)
const savingFlags = ref(false)
const monitor = ref<any>({})
const flags = ref({
  instantMatchEnabled: false,
  travelInstantEnabled: true,
  streetInstantEnabled: true,
})
let timer: ReturnType<typeof setInterval> | null = null

const formatTime = (ts: string | undefined) => {
  if (!ts) return '—'
  return String(ts).replace('T', ' ').slice(0, 19)
}

const statusType = (status: string) => {
  if (status === 'SEARCHING') return 'warning'
  if (status === 'MATCH_FOUND') return 'success'
  return 'info'
}

const load = async () => {
  loading.value = true
  try {
    const [monitorRes, flagsRes]: any[] = await Promise.all([
      request.get('/admin/match/monitor'),
      request.get('/admin/match/feature-flags'),
    ])
    monitor.value = monitorRes.data || {}
    if (flagsRes.data) flags.value = { ...flags.value, ...flagsRes.data }
  } catch {
    ElMessage.error('無法載入媒合監控資料')
  } finally {
    loading.value = false
  }
}

const saveFlags = async () => {
  savingFlags.value = true
  try {
    await request.put('/admin/match/feature-flags', flags.value)
    ElMessage.success('開關設定已更新')
  } catch {
    ElMessage.error('儲存失敗')
  } finally {
    savingFlags.value = false
  }
}

onMounted(() => {
  load()
  timer = setInterval(load, 10000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.metric-box {
  text-align: center;
  padding: 8px 0;
}
.metric-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}
.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}
</style>
