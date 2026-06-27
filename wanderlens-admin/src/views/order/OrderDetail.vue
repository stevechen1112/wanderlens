<template>
  <div v-if="order">
    <el-card class="mb-4">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="訂單編號">{{ order.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="客戶">{{ order.customerName }}</el-descriptions-item>
        <el-descriptions-item label="攝影師">{{ order.photographerId }}</el-descriptions-item>
        <el-descriptions-item label="拍攝日期">{{ order.shootingDate }}</el-descriptions-item>
        <el-descriptions-item label="狀態"><el-tag>{{ order.status }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="金額">${{ order.totalFee }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="mb-4">
      <h3 class="font-semibold mb-3">訂單歷程</h3>
      <el-timeline>
        <el-timeline-item v-for="h in history" :key="h.id" :timestamp="h.createdAt" placement="top">
          <p class="font-semibold">{{ h.action }}</p>
          <p class="text-sm text-gray-500">{{ h.fromStatus }} → {{ h.toStatus }}</p>
          <p v-if="h.actionDetail" class="text-sm">{{ h.actionDetail }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <el-card class="mb-4">
      <h3 class="font-semibold mb-3">操作</h3>
      <div class="flex gap-3">
        <el-popconfirm title="確認退款？此操作將通知消費者。" confirm-button-text="確認退款" cancel-button-text="取消" confirm-button-type="danger" @confirm="refund">
          <template #reference><el-button type="danger">退款</el-button></template>
        </el-popconfirm>
        <el-popconfirm title="確認撥款？此操作將通知攝影師且不可復原。" confirm-button-text="確認撥款" cancel-button-text="取消" confirm-button-type="primary" @confirm="payout">
          <template #reference><el-button type="primary">撥款</el-button></template>
        </el-popconfirm>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api'

const route = useRoute()
const order = ref<any>(null)
const history = ref<any[]>([])

const refund = async () => {
  try { await api.refund(order.value.id, '後台退款'); ElMessage.success('退款已處理') }
  catch { ElMessage.error('退款失敗') }
}

const payout = async () => {
  try { await api.payout(order.value.id, order.value.photographerId); ElMessage.success('撥款已處理') }
  catch { ElMessage.error('撥款失敗') }
}

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const [orderRes, historyRes]: any[] = await Promise.all([
      api.getOrder(id), api.getOrderHistory(id),
    ])
    order.value = orderRes.data
    history.value = historyRes.data || []
  } catch { /* 靜默 */ }
})
</script>