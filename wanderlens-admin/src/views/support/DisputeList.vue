<template>
  <div>
    <h3 class="font-semibold mb-4">爭議列表</h3>
    <el-table :data="disputes" border>
      <el-table-column prop="orderNo" label="訂單編號" width="180" />
      <el-table-column prop="customerName" label="客戶" width="100" />
      <el-table-column prop="status" label="狀態" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button text type="primary" @click="$router.push(`/orders/${row.id}`)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const disputes = ref<any[]>([])

onMounted(async () => {
  try { const res: any = await api.getOrdersByStatus('Disputed'); const raw = res.data || res || []; disputes.value = Array.isArray(raw) ? raw : (raw.records || []) }
  catch { /* 靜默 */ }
})
</script>