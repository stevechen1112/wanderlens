<template>
  <div>
    <h3 class="font-semibold mb-4">{{ t('media.rawVerify.title') }}</h3>
    <el-table v-loading="loading" :data="orders" border :empty-text="t('media.rawVerify.empty')">
      <el-table-column prop="orderNo" :label="t('media.rawVerify.orderNo')" width="180" />
      <el-table-column prop="photographerId" :label="t('media.rawVerify.photographerId')" width="100" />
      <el-table-column :label="t('media.rawVerify.fileCount')" width="80">
        <template #default="{ row }">{{ row.picNum || '—' }}</template>
      </el-table-column>
      <el-table-column :label="t('media.rawVerify.status')" width="140">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('media.rawVerify.actions')" width="220" fixed="right">
        <template #default="{ row }">
          <el-button type="success" size="small" :loading="acting === row.id" @click="approve(row)">{{ t('media.rawVerify.approve') }}</el-button>
          <el-button type="danger" size="small" plain @click="openReject(row)">{{ t('media.rawVerify.reject') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="rejectVisible" :title="t('media.rawVerify.rejectTitle')" width="420px">
      <el-input v-model="rejectReason" type="textarea" :rows="3" :placeholder="t('media.rawVerify.rejectPlaceholder')" />
      <template #footer>
        <el-button @click="rejectVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="danger" :loading="!!acting" @click="confirmReject">{{ t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import api from '@/api'
import { useOrderStatus } from '@/composables/useOrderStatus'

const { t } = useI18n()
const { statusLabel, statusTagType } = useOrderStatus()

const orders = ref<any[]>([])
const loading = ref(false)
const acting = ref<number | null>(null)
const rejectVisible = ref(false)
const rejectReason = ref('')
const rejectTarget = ref<any>(null)

const fetchOrders = async () => {
  loading.value = true
  try {
    const res: any = await api.getOrdersByStatus('UploadingRaw')
    orders.value = res.data?.records || res.data || []
  } catch {
    ElMessage.error(t('media.rawVerify.loadFailed'))
  } finally {
    loading.value = false
  }
}

const approve = async (row: any) => {
  acting.value = row.id
  try {
    await api.approveRawVerify(row.id, row.picNum || 0, 0)
    ElMessage.success(t('media.rawVerify.approveSuccess'))
    await fetchOrders()
  } catch {
    ElMessage.error(t('media.rawVerify.actionFailed'))
  } finally {
    acting.value = null
  }
}

const openReject = (row: any) => {
  rejectTarget.value = row
  rejectReason.value = ''
  rejectVisible.value = true
}

const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    ElMessage.warning(t('media.rawVerify.rejectReasonRequired'))
    return
  }
  acting.value = rejectTarget.value.id
  try {
    await api.rejectRawVerify(rejectTarget.value.id, rejectReason.value)
    ElMessage.success(t('media.rawVerify.rejectSuccess'))
    rejectVisible.value = false
    await fetchOrders()
  } catch {
    ElMessage.error(t('media.rawVerify.actionFailed'))
  } finally {
    acting.value = null
  }
}

onMounted(fetchOrders)
</script>
