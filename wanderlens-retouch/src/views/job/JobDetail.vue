<template>
  <div v-if="job">
    <el-card class="mb-4">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="工單 #">{{ job.id }}</el-descriptions-item>
        <el-descriptions-item label="訂單 ID">{{ job.orderId }}</el-descriptions-item>
        <el-descriptions-item label="張數">{{ assetIds.length }}</el-descriptions-item>
        <el-descriptions-item label="費用">${{ job.fee }}</el-descriptions-item>
        <el-descriptions-item label="交期">{{ job.deliveryDeadline }}</el-descriptions-item>
        <el-descriptions-item label="狀態"><el-tag>{{ job.status }}</el-tag></el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 修圖規範 -->
    <el-card class="mb-4">
      <h3 class="font-semibold mb-2">修圖規範</h3>
      <p class="text-sm text-gray-600">{{ job.spec || '無特殊規範' }}</p>
    </el-card>

    <!-- RAW 下載 -->
    <el-card class="mb-4">
      <h3 class="font-semibold mb-3">RAW 下載</h3>
      <div v-for="assetId in assetIds" :key="assetId" class="flex items-center gap-2 mb-2">
        <span class="text-sm">{{ assetId }}</span>
        <el-button text type="primary" @click="downloadRaw(assetId)">下載 RAW</el-button>
      </div>
    </el-card>

    <!-- 成品上傳 -->
    <el-card class="mb-4">
      <h3 class="font-semibold mb-3">成品上傳</h3>
      <el-upload drag multiple accept="image/jpeg,image/png" :http-request="uploadResult" :show-file-list="false">
        <div class="text-sm text-gray-500">拖拽成品到此或點擊上傳</div>
      </el-upload>
    </el-card>

    <!-- 操作 -->
    <div class="flex gap-3">
      <el-button v-if="job.status === 'REQUESTED' || job.status === 'ASSIGNED'" type="primary" @click="start">開始處理</el-button>
      <el-button v-if="job.status === 'IN_PROGRESS'" type="success" :disabled="uploadedCount === 0" @click="deliver">交付成品</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

const route = useRoute()
const job = ref<any>(null)
const uploadedCount = ref(0)

const assetIds = computed(() => {
  if (!job.value?.mediaAssetIds) return []
  try { return JSON.parse(job.value.mediaAssetIds) } catch { return [] }
})

const downloadRaw = async (assetId: string) => {
  try {
    const res: any = await api.getRawUrl(assetId)
    if (res.data?.url) window.open(res.data.url, '_blank')
  } catch { ElMessage.error('下載失敗') }
}

const uploadResult = async (options: any) => {
  try {
    await api.uploadResult(job.value.id, options.file)
    uploadedCount.value++
    ElMessage.success('上傳成功')
  } catch { ElMessage.error('上傳失敗') }
}

const start = async () => {
  try { await api.startProcessing(job.value.id); ElMessage.success('已開始處理'); load() }
  catch { ElMessage.error('操作失敗') }
}

const deliver = async () => {
  if (uploadedCount.value === 0) {
    ElMessage.warning('請先上傳至少一張成品再交付')
    return
  }
  try {
    await ElMessageBox.confirm('確認交付成品？此操作不可復原。', '提示', { type: 'warning', confirmButtonText: '確認交付', cancelButtonText: '取消' })
    await api.deliver(job.value.id)
    ElMessage.success('已交付')
    await load()
  } catch (err: any) {
    if (err !== 'cancel') ElMessage.error('交付失敗')
  }
}

const load = async () => {
  try {
    const res: any = await api.getJob(Number(route.params.id))
    job.value = res.data
    // 從後端回傳的已上傳成品數初始化計數，避免重整後計數遺失
    uploadedCount.value = res.data?.resultCount ?? res.data?.resultFiles?.length ?? 0
  } catch { /* 靜默 */ }
}

onMounted(load)
</script>