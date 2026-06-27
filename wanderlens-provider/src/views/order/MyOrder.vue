<template>
  <div>
    <el-row :gutter="16" class="mb-4">
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="text-sm text-gray-500 mb-1">{{ t('order.myOrder.totalOrders') }}</div>
          <div class="text-2xl font-bold" style="color: #F37A69">{{ orders.length }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="text-sm text-gray-500 mb-1">{{ t('order.myOrder.pendingContact') }}</div>
          <div class="text-2xl font-bold" style="color: #E6A23C">{{ pendingContact }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="text-sm text-gray-500 mb-1">{{ t('order.myOrder.shooting') }}</div>
          <div class="text-2xl font-bold" style="color: #409EFF">{{ shootingCount }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card shadow="hover" class="stat-card">
          <div class="text-sm text-gray-500 mb-1">{{ t('order.myOrder.pendingUpload') }}</div>
          <div class="text-2xl font-bold" style="color: #F56C6C">{{ pendingUpload }}</div>
        </el-card>
      </el-col>
    </el-row>

    <div class="flex items-center gap-3 mb-4">
      <el-select v-model="statusFilter" :placeholder="t('order.myOrder.allStatus')" clearable style="width: 180px">
        <el-option
          v-for="code in STATUS_FILTER_CODES"
          :key="code"
          :label="statusLabel(code)"
          :value="code"
        />
      </el-select>
      <el-button @click="loadOrders">{{ t('order.myOrder.refresh') }}</el-button>
    </div>

    <div v-loading="tableLoading" class="wl-table-scroll">
      <el-table :data="pagedOrders" border stripe>
      <el-table-column prop="orderNo" :label="t('order.myOrder.orderNo')" width="170" />
      <el-table-column :label="t('order.myOrder.customer')" width="160">
        <template #default="{ row }">
          <div>{{ row.customerName }}</div>
          <div class="text-xs text-gray-400">TEL: {{ row.customerPhone }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="t('order.myOrder.shootTime')" width="180">
        <template #default="{ row }">
          <div>{{ row.shootingDate }}</div>
          <div class="text-xs text-gray-400">{{ row.shootingTime }} ({{ row.shootingDuration }}h)</div>
        </template>
      </el-table-column>
      <el-table-column :label="t('order.myOrder.status')" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('order.myOrder.contacted')" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.status !== 'WaitingProviderContact'" type="success" size="small">{{ t('order.myOrder.yes') }}</el-tag>
          <el-tag v-else type="warning" size="small">{{ t('order.myOrder.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('order.myOrder.photoCount')" width="80">
        <template #default="{ row }">
          <span v-if="row.picNum > 0" class="text-green-600 font-semibold">{{ row.picNum }}</span>
          <span v-else class="text-gray-400">—</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('order.myOrder.profit')" width="100">
        <template #default="{ row }">${{ row.photographerProfit?.toLocaleString() || 0 }}</template>
      </el-table-column>
      <el-table-column :label="t('order.myOrder.payDate')" width="120">
        <template #default="{ row }">
          <span v-if="row.payDate" class="text-xs">{{ row.payDate }}</span>
          <span v-else class="text-gray-400">—</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('order.myOrder.actions')" width="240" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" @click="$router.push(`/my-order/${row.id}`)">{{ t('order.myOrder.detail') }}</el-button>
          <el-popconfirm
            v-if="row.status === 'WaitingProviderContact'"
            :title="t('order.myOrder.confirmContact')"
            :confirm-button-text="t('common.confirm', '確認')"
            :cancel-button-text="t('common.cancel')"
            @confirm="quickContact(row.id)"
          >
            <template #reference>
              <el-button text type="warning" size="small">{{ t('order.myOrder.reportContacted') }}</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            v-if="row.status === 'Confirmed'"
            :title="t('order.myOrder.confirmReadyPrompt')"
            :confirm-button-text="t('common.confirm', '確認')"
            :cancel-button-text="t('common.cancel')"
            @confirm="quickConfirmReady(row.id)"
          >
            <template #reference>
              <el-button text type="primary" size="small">{{ t('order.myOrder.confirmReady') }}</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="row.status === 'ShootingEnded' || row.status === 'UploadingRaw'"
            text
            type="success"
            size="small"
            @click="$router.push(`/my-order/${row.id}`)"
          >
            {{ t('order.myOrder.uploadRaw') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <div class="flex justify-center mt-4" v-if="filteredOrders.length > pageSize">
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
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import api from '@/api'
import { useOrderStatus } from '@/composables/useOrderStatus'

const { t } = useI18n()
const { statusLabel, statusTagType } = useOrderStatus()

const STATUS_FILTER_CODES = [
  'WaitingProviderContact', 'Confirmed', 'ReadyToShoot', 'ShootingStarted',
  'ShootingEnded', 'UploadingRaw', 'AiProcessing', 'Delivered', 'Closed',
]

const orders = ref<any[]>([])
const tableLoading = ref(false)
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 10

const filteredOrders = computed(() => {
  if (!statusFilter.value) return orders.value
  return orders.value.filter(o => o.status === statusFilter.value)
})

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})

const pendingContact = computed(() => orders.value.filter(o => o.status === 'WaitingProviderContact').length)
const shootingCount = computed(() => orders.value.filter(o => o.status === 'ShootingStarted').length)
const pendingUpload = computed(() => orders.value.filter(o => o.status === 'ShootingEnded' || o.status === 'UploadingRaw').length)

const quickContact = async (orderId: number) => {
  try {
    await api.contactCustomer(orderId)
    ElMessage.success(t('order.myOrder.contactSuccess'))
    await loadOrders()
  } catch {
    ElMessage.error(t('common.failed', '失敗'))
  }
}

const quickConfirmReady = async (orderId: number) => {
  try {
    await api.confirmReadyToShoot(orderId)
    ElMessage.success(t('order.myOrder.confirmReadySuccess'))
    await loadOrders()
  } catch {
    ElMessage.error(t('common.failed', '失敗'))
  }
}

const loadOrders = async () => {
  tableLoading.value = true
  try {
    const res: any = await api.getMyOrders()
    orders.value = res.data || []
  } catch {
    orders.value = []
    ElMessage.error(t('order.myOrder.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

onMounted(loadOrders)
</script>
