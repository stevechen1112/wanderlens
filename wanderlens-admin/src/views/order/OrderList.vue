<template>
  <div>
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-4">
      <el-breadcrumb-item>{{ t('order.list.breadcrumbGroup') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ t('order.list.breadcrumb') }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row class="mb-4">
      <el-col :span="16">
        <el-input v-model="searchKeyword" :placeholder="t('order.list.searchPlaceholder')" style="width: 240px" clearable :prefix-icon="Search" class="mr-2" />
        <el-button type="primary" @click="reload">{{ t('order.list.search') }}</el-button>
      </el-col>
      <el-col :span="8" style="text-align: right">
        <el-button type="primary" :icon="Plus" @click="showAddDialog = true">{{ t('order.list.createOrder') }}</el-button>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab">
      <el-tab-pane :label="t('order.list.tabAll')" name="all" />
      <el-tab-pane :label="t('order.list.tabPending')" name="PendingPayment" />
      <el-tab-pane :label="t('order.list.tabPaid')" name="Paid" />
      <el-tab-pane :label="t('order.list.tabUploading')" name="UploadingRaw" />
      <el-tab-pane :label="t('order.list.tabClosed')" name="Closed" />
    </el-tabs>
    <el-table :data="filteredOrders" border @row-click="(row: any) => $router.push(`/orders/${row.id}`)">
      <el-table-column prop="orderNo" :label="t('order.list.orderNo')" width="180" />
      <el-table-column prop="customerName" :label="t('order.list.customer')" width="100" />
      <el-table-column prop="shootingDate" :label="t('order.list.shootDate')" width="120" />
      <el-table-column :label="t('order.list.status')" width="120">
        <template #default="{ row }"><el-tag size="small" :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag></template>
      </el-table-column>
      <el-table-column :label="t('order.list.amount')" width="100">
        <template #default="{ row }">${{ row.totalFee?.toLocaleString() || 0 }}</template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showAddDialog" :title="t('order.list.dialogTitle')" width="650px">
      <el-form :model="addForm" label-position="top">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="t('order.list.serviceType')" required>
              <el-select v-model="addForm.serviceTypeId" :placeholder="t('order.list.selectServiceType')" filterable>
                <el-option v-for="st in serviceTypes" :key="st.id" :label="st.name" :value="st.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('order.list.photographer')" required>
              <el-select v-model="addForm.providerId" :placeholder="t('order.list.searchPhotographer')" filterable remote :remote-method="searchPhotographer" :loading="searchingProvider">
                <el-option v-for="p in photographerOptions" :key="p.id" :label="`${p.name} (${p.nickName || ''})`" :value="p.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="t('order.list.customerName')" required>
              <el-input v-model="addForm.customerName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('order.list.customerPhone')" required>
              <el-input v-model="addForm.customerPhone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item :label="t('order.list.shootingDate')" required>
              <el-date-picker v-model="addForm.shootingDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="t('order.list.timeStart')">
              <el-input v-model="addForm.timeStart" placeholder="10:00" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="結束時間">
              <el-input v-model="addForm.timeEnd" placeholder="12:00" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="大人人數">
              <el-input-number v-model="addForm.adultNum" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="小孩人數">
              <el-input-number v-model="addForm.childNum" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金額">
              <el-input-number v-model="addForm.totalFee" :min="0" :step="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="備註">
          <el-input v-model="addForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="adding" @click="createOrder">確認建立</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Search, Plus, ArrowRight } from '@element-plus/icons-vue'
import api from '@/api'
import { useOrderStatus } from '@/composables/useOrderStatus'

const { t } = useI18n()
const { statusLabel, statusTagType } = useOrderStatus()

const activeTab = ref('all')
const orders = ref<any[]>([])
const searchKeyword = ref('')
const showAddDialog = ref(false)
const adding = ref(false)
const searchingProvider = ref(false)
const serviceTypes = ref<any[]>([])
const photographerOptions = ref<any[]>([])
const addForm = reactive<any>({
  serviceTypeId: '', providerId: '', customerName: '', customerPhone: '',
  shootingDate: '', timeStart: '10:00', timeEnd: '12:00',
  adultNum: 1, childNum: 0, totalFee: 1600, remark: '',
})

const filteredOrders = computed(() => {
  if (!searchKeyword.value) return orders.value
  const kw = searchKeyword.value.toLowerCase()
  return orders.value.filter(o => o.orderNo?.toLowerCase().includes(kw) || o.customerName?.toLowerCase().includes(kw))
})

const normalizeOrders = (res: any) => {
  const data = res?.data
  if (Array.isArray(data)) return data
  if (data?.records) return data.records
  return []
}

watch(activeTab, async (val) => {
  try {
    const res: any = val === 'all'
      ? await api.getOrders({ page: 1, size: 100 })
      : await api.getOrdersByStatus(val)
    orders.value = normalizeOrders(res)
  } catch { orders.value = [] }
})

const searchPhotographer = async (query: string) => {
  if (!query) { photographerOptions.value = []; return }
  searchingProvider.value = true
  try {
    const res: any = await api.getProviders({ keyword: query })
    photographerOptions.value = (res.data || []).filter((p: any) => p.providerType === 'PHOTOGRAPHER' || p.providerType === 'photographer')
  } catch { photographerOptions.value = [] }
  finally { searchingProvider.value = false }
}

const createOrder = async () => {
  if (!addForm.serviceTypeId || !addForm.providerId || !addForm.customerName || !addForm.customerPhone || !addForm.shootingDate) {
    ElMessage.warning(t('order.list.requiredFields')); return
  }
  adding.value = true
  try {
    await api.manualOrder(addForm)
    ElMessage.success(t('order.list.createSuccess'))
    showAddDialog.value = false
    Object.assign(addForm, { serviceTypeId: '', providerId: '', customerName: '', customerPhone: '', shootingDate: '', timeStart: '10:00', timeEnd: '12:00', adultNum: 1, childNum: 0, totalFee: 1600, remark: '' })
    await reload()
  } catch { ElMessage.error(t('order.list.createFailed')) }
  finally { adding.value = false }
}

const reload = async () => {
  try {
    const res: any = activeTab.value === 'all'
      ? await api.getOrders({ page: 1, size: 100 })
      : await api.getOrdersByStatus(activeTab.value)
    orders.value = normalizeOrders(res)
  } catch { orders.value = [] }
}

onMounted(async () => {
  await reload()
  try {
    const stRes: any = await api.getServiceTypes()
    serviceTypes.value = stRes.data || []
  } catch { /* 靜默 */ }
})
</script>