<template>
  <div>
    <h3 class="font-semibold mb-4">AI 交付 SLA 監控</h3>
    <el-table :data="orders" border stripe>
      <el-table-column prop="orderNo" label="訂單編號" width="180" />
      <el-table-column label="狀態" width="140">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="媒體狀態" width="140">
        <template #default="{ row }">
          <span class="text-sm text-gray-600">{{ mediaStatus[row.id] || '—' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button text type="primary" @click="checkSla(row.id)">查看 SLA</el-button>
          <el-button text type="warning" @click="openIntervene(row)">介入</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="interveneVisible" title="營運介入" width="480px">
      <p class="text-sm text-gray-600 mb-3">訂單：{{ selectedOrder?.orderNo }}</p>
      <el-input v-model="interveneReason" type="textarea" :rows="3" placeholder="介入原因（將通知攝影師與消費者）" />
      <template #footer>
        <el-button @click="interveneVisible = false">取消</el-button>
        <el-button type="warning" :loading="interveneLoading" @click="confirmIntervene">確認介入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const orders = ref<any[]>([])
const mediaStatus = reactive<Record<number, string>>({})
const interveneVisible = ref(false)
const interveneReason = ref('')
const interveneLoading = ref(false)
const selectedOrder = ref<any>(null)

const statusType = (status: string) => {
  if (status === 'AiProcessing') return 'warning'
  if (status === 'Delivered') return 'success'
  return 'info'
}

const checkSla = async (orderId: number) => {
  try {
    const res: any = await api.getMediaStatus(orderId)
    mediaStatus[orderId] = res.data
    ElMessage.info(`媒體狀態: ${res.data}`)
  } catch {
    ElMessage.error('無法取得媒體狀態')
  }
}

const openIntervene = (row: any) => {
  selectedOrder.value = row
  interveneReason.value = ''
  interveneVisible.value = true
}

const confirmIntervene = async () => {
  if (!selectedOrder.value || !interveneReason.value.trim()) {
    ElMessage.warning('請填寫介入原因')
    return
  }
  interveneLoading.value = true
  try {
    await api.interveneMedia(selectedOrder.value.id, interveneReason.value.trim())
    ElMessage.success('已介入並通知相關人員')
    interveneVisible.value = false
  } catch {
    ElMessage.error('介入失敗')
  } finally {
    interveneLoading.value = false
  }
}

onMounted(async () => {
  try {
    const res: any = await api.getOrdersByStatus('AiProcessing')
    orders.value = res.data?.records || res.data || []
    for (const o of orders.value) {
      try {
        const st: any = await api.getMediaStatus(o.id)
        mediaStatus[o.id] = st.data
      } catch { /* 靜默 */ }
    }
  } catch {
    ElMessage.error('無法載入 AI 處理中訂單')
  }
})
</script>
