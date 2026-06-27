<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">退款管理</h3>
      <el-input v-model="searchKeyword" placeholder="搜尋訂單號" :prefix-icon="Search" style="width: 240px" clearable />
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <!-- 空狀態 -->
    <el-empty v-else-if="filteredOrders.length === 0" description="無退款申請" />

    <!-- 退款表格 -->
    <el-table v-else :data="filteredOrders" border stripe>
      <el-table-column prop="orderNo" label="訂單號" width="160" />
      <el-table-column prop="consumerName" label="客戶" width="100" />
      <el-table-column prop="photographerName" label="攝影師" width="100" />
      <el-table-column prop="shootingDate" label="拍攝日期" width="120" />
      <el-table-column prop="totalFee" label="訂單金額" width="100" align="right">
        <template #default="{ row }">$ {{ row.totalFee?.toLocaleString() }}</template>
      </el-table-column>
      <el-table-column prop="status" label="狀態" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cancelReason" label="取消原因" min-width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-popconfirm
            v-if="canRefund(row.status)"
            title="確認退款？退款後訂單狀態將變更為已退款。"
            confirm-button-text="確認退款"
            cancel-button-text="取消"
            confirm-button-type="danger"
            @confirm="handleRefund(row)"
          >
            <template #reference>
              <el-button type="danger" size="small">退款</el-button>
            </template>
          </el-popconfirm>
          <span v-else class="text-gray-400 text-sm">無法退款</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 退款對話框 -->
    <el-dialog v-model="refundDialogVisible" title="退款" width="500px">
      <el-form label-width="100px">
        <el-form-item label="訂單號">
          <span>{{ refundTarget?.orderNo }}</span>
        </el-form-item>
        <el-form-item label="訂單金額">
          <span>$ {{ refundTarget?.totalFee?.toLocaleString() }}</span>
        </el-form-item>
        <el-form-item label="退款原因" required>
          <el-input v-model="refundReason" type="textarea" :rows="3" placeholder="請輸入退款原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="refunding" @click="confirmRefund">確認退款</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const loading = ref(false)
const orders = ref<any[]>([])
const searchKeyword = ref('')
const refundDialogVisible = ref(false)
const refundTarget = ref<any>(null)
const refundReason = ref('')
const refunding = ref(false)

const filteredOrders = computed(() => {
  if (!searchKeyword.value) return orders.value
  const kw = searchKeyword.value.toLowerCase()
  return orders.value.filter(o => o.orderNo?.toLowerCase().includes(kw))
})

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    Paid: '已付款', Confirmed: '已確認', ReadyToShoot: '待拍攝',
    ShootingStarted: '拍攝中', ShootingEnded: '拍攝結束',
    UploadingRaw: '上傳中', AiProcessing: 'AI處理中', Delivered: '已交付',
    Cancelled: '已取消', Refunded: '已退款', Disputed: '爭議中',
  }
  return map[status] || status
}

const statusTagType = (status: string) => {
  if (status === 'Refunded') return 'info'
  if (status === 'Disputed') return 'danger'
  if (status === 'Cancelled') return 'warning'
  return 'success'
}

const canRefund = (status: string) => {
  return ['Paid', 'Confirmed', 'ReadyToShoot', 'ShootingStarted', 'Disputed'].includes(status)
}

const loadData = async () => {
  loading.value = true
  try {
    // 載入可退款的訂單（已付款但未交付）
    const res: any = await api.getOrders()
    orders.value = (res.data || []).filter((o: any) => canRefund(o.status) || o.status === 'Refunded')
  } catch {
    ElMessage.error('載入退款列表失敗')
    orders.value = []
  } finally {
    loading.value = false
  }
}

const handleRefund = (row: any) => {
  refundTarget.value = row
  refundReason.value = row.cancelReason || ''
  refundDialogVisible.value = true
}

const confirmRefund = async () => {
  if (!refundReason.value.trim()) {
    ElMessage.warning('請輸入退款原因')
    return
  }
  refunding.value = true
  try {
    await api.refund(refundTarget.value.id, refundReason.value)
    ElMessage.success('退款成功')
    refundDialogVisible.value = false
    await loadData()
  } catch {
    ElMessage.error('退款失敗')
  } finally {
    refunding.value = false
  }
}

onMounted(loadData)
</script>