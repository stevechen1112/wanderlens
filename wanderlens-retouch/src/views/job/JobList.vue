<template>
  <div>
    <el-tabs v-model="activeTab" @tab-change="loadJobs">
      <el-tab-pane label="待處理" name="REQUESTED" />
      <el-tab-pane label="處理中" name="IN_PROGRESS" />
      <el-tab-pane label="已交付" name="DELIVERED" />
      <el-tab-pane label="退修" name="REJECTED" />
    </el-tabs>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <!-- 空狀態 -->
    <el-empty v-else-if="jobs.length === 0" description="無工單" />

    <!-- 工單列表 -->
    <el-table v-else :data="jobs" border @row-click="(row: any) => $router.push(`/jobs/${row.id}`)">
      <el-table-column prop="id" label="工單 #" width="80" />
      <el-table-column prop="orderId" label="訂單 ID" width="100" />
      <el-table-column label="張數" width="80">
        <template #default="{ row }">{{ row.mediaAssetIds ? JSON.parse(row.mediaAssetIds).length : 0 }}</template>
      </el-table-column>
      <el-table-column prop="fee" label="費用" width="80" />
      <el-table-column prop="deliveryDeadline" label="交期" width="180" />
      <el-table-column prop="status" label="狀態" width="100" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import api from '@/api'

const activeTab = ref('REQUESTED')
const jobs = ref<any[]>([])
const loading = ref(false)

const loadJobs = async () => {
  loading.value = true
  try {
    const res: any = await api.getJobs(activeTab.value)
    jobs.value = res.data || []
  } catch {
    jobs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadJobs)
</script>