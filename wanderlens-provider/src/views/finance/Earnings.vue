<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">{{ t('earnings.title') }}</h2>

    <el-row :gutter="16" class="mb-6">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500 mb-1">{{ t('earnings.monthly') }}</p>
            <p class="text-2xl font-bold" style="color: #13CE66">${{ monthlyEarnings.toLocaleString() }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500 mb-1">{{ t('earnings.pendingPayout') }}</p>
            <p class="text-2xl font-bold" style="color: #FF9F40">${{ pendingPayout.toLocaleString() }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500 mb-1">{{ t('earnings.paidOut') }}</p>
            <p class="text-2xl font-bold" style="color: #52B6CC">${{ totalPayout.toLocaleString() }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="text-center">
            <p class="text-sm text-gray-500 mb-1">{{ t('earnings.total') }}</p>
            <p class="text-2xl font-bold" style="color: #F37A69">${{ totalEarnings.toLocaleString() }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 收益紀錄表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <span>{{ t('earnings.records') }}</span>
          <el-radio-group v-model="filterStatus" size="small">
            <el-radio-button label="">{{ t('earnings.filterAll') }}</el-radio-button>
            <el-radio-button label="PENDING">{{ t('earnings.filterPending') }}</el-radio-button>
            <el-radio-button label="PAID">{{ t('earnings.filterPaid') }}</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <el-table :data="filteredRecords" stripe style="width: 100%">
        <el-table-column prop="orderId" :label="t('earnings.orderNo')" width="120" />
        <el-table-column prop="customerName" :label="t('earnings.customer')" width="120" />
        <el-table-column prop="shootingDate" :label="t('earnings.shootDate')" width="120" />
        <el-table-column prop="amount" :label="t('earnings.amount')" width="120">
          <template #default="{ row }">
            ${{ row.amount?.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="platformFee" label="平台抽成" width="120">
          <template #default="{ row }">
            ${{ row.platformFee?.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="netAmount" label="實得金額" width="120">
          <template #default="{ row }">
            <span style="color: #13CE66; font-weight: bold">${{ row.netAmount?.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('earnings.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'PAID' ? 'success' : 'warning'" size="small">
              {{ row.status === 'PAID' ? t('earnings.filterPaid') : t('earnings.filterPending') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payoutDate" :label="t('earnings.payoutDate')" width="120" />
      </el-table>

      <el-empty v-if="filteredRecords.length === 0" description="目前沒有收益紀錄" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import request from '@/api/request'

const { t } = useI18n()

const filterStatus = ref('')
const records = ref<any[]>([])

const filteredRecords = computed(() => {
  if (!filterStatus.value) return records.value
  return records.value.filter(r => r.status === filterStatus.value)
})

const monthlyEarnings = computed(() => {
  const now = new Date()
  return records.value
    .filter(r => {
      const d = new Date(r.shootingDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, r) => sum + (r.netAmount || 0), 0)
})

const pendingPayout = computed(() =>
  records.value.filter(r => r.status === 'PENDING').reduce((s, r) => s + (r.netAmount || 0), 0)
)

const totalPayout = computed(() =>
  records.value.filter(r => r.status === 'PAID').reduce((s, r) => s + (r.netAmount || 0), 0)
)

const totalEarnings = computed(() =>
  records.value.reduce((s, r) => s + (r.netAmount || 0), 0)
)

onMounted(async () => {
  try {
    const res = await request.get('/orders/my/earnings')
    records.value = (res as any)?.data || []
  } catch {
    records.value = []
  }
})
</script>