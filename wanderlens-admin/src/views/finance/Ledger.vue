<template>
  <div>
    <h3 class="font-semibold mb-4">清算帳本</h3>
    <el-input v-model="orderId" placeholder="輸入訂單 ID" style="width: 200px" class="mb-4" />
    <el-button type="primary" @click="load">查詢</el-button>
    <el-table :data="entries" border class="mt-4">
      <el-table-column prop="entryType" label="分錄類型" width="150" />
      <el-table-column prop="amount" label="金額" width="100" />
      <el-table-column prop="providerId" label="供給方" width="100" />
      <el-table-column prop="status" label="狀態" width="100" />
      <el-table-column prop="settledAt" label="撥款時間" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'

const orderId = ref('')
const entries = ref<any[]>([])

const load = async () => {
  if (!orderId.value) return
  try { const res: any = await api.getLedger(Number(orderId.value)); entries.value = res.data || [] }
  catch { /* 靜默 */ }
}
</script>