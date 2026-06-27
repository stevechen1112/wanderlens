<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">撥款管理</h3>
      <div class="flex items-center gap-3">
        <el-select v-model="statusFilter" placeholder="篩選狀態" clearable style="width: 160px" @change="loadData">
          <el-option label="待撥款" value="Delivered" />
          <el-option label="已撥款" value="Closed" />
        </el-select>
        <el-input v-model="searchKeyword" placeholder="搜尋訂單號" :prefix-icon="Search" style="width: 240px" clearable />
      </div>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex justify-center py-12">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <!-- 空狀態 -->
    <el-empty v-else-if="filteredOrders.length === 0" description="無待撥款訂單" />

    <!-- 訂單表格 -->
    <el-table v-else :data="filteredOrders" border stripe>
      <el-table-column prop="orderNo" label="訂單號" width="160" />
      <el-table-column prop="consumerName" label="客戶" width="100" />
      <el-table-column prop="photographerName" label="攝影師" width="100" />
      <el-table-column prop="shootingDate" label="拍攝日期" width="120" />
      <el-table-column prop="totalFee" label="訂單金額" width="100" align="right">
        <template #default="{ row }">$ {{ row.totalFee?.toLocaleString() }}</template>
      </el-table-column>
      <el-table-column prop="photographerProfit" label="攝影師應得" width="120" align="right">
        <template #default="{ row }">
          <span class="text-green-600 font-semibold">$ {{ row.photographerProfit?.toLocaleString() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="platformFee" label="平台抽成" width="100" align="right">
        <template #default="{ row }">$ {{ (row.totalFee - row.photographerProfit)?.toLocaleString() }}</template>
      </el-table-column>
      <el-table-column prop="status" label="狀態" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'Delivered' ? 'warning' : 'success'">
            {{ row.status === 'Delivered' ? '待撥款' : '已撥款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-popconfirm
            v-if="row.status === 'Delivered'"
            title="確認撥款？此操作將通知攝影師。"
            confirm-button-text="確認撥款"
            cancel-button-text="取消"
            @confirm="handlePayout(row)"
          >
            <template #reference>
              <el-button type="primary" size="small">撥款</el-button>
            </template>
          </el-popconfirm>
          <span v-else class="text-gray-400 text-sm">已完成</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁 -->
    <div v-if="filteredOrders.length > pageSize" class="flex justify-center mt-4">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredOrders.length"
        layout="prev, pager, next, total"
        background
      />
    </div>
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
const statusFilter = ref('Delivered')
const currentPage = ref(1)
const pageSize = 20

const filteredOrders = computed(() => {
  let result = orders.value
  if (statusFilter.value) {
    result = result.filter(o => o.status === statusFilter.value)
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(o => o.orderNo?.toLowerCase().includes(kw))
  }
  return result
})

const loadData = async () => {
  loading.value = true
  try {
    const res: any = await api.getOrders({ status: 'Delivered' })
    const delivered = res.data || []
    // 也載入已撥款（Closed）的訂單
    const res2: any = await api.getOrders({ status: 'Closed' })
    const closed = res2.data || []
    orders.value = [...delivered, ...closed]
  } catch {
    ElMessage.error('載入撥款列表失敗')
    orders.value = []
  } finally {
    loading.value = false
  }
}

const handlePayout = async (row: any) => {
  try {
    await api.payout(row.id, row.photographerId)
    ElMessage.success(`訂單 ${row.orderNo} 撥款成功`)
    await loadData()
  } catch {
    ElMessage.error('撥款失敗')
  }
}

onMounted(loadData)
</script>