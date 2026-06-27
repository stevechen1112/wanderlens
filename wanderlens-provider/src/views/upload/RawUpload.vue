<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">{{ t('rawUploadPage.title') }}</h2>
    <el-alert type="info" :closable="false" class="mb-4">
      <template #title>{{ t('rawUploadPage.alert') }}</template>
    </el-alert>

    <el-form :model="form" label-width="100px" class="mb-6">
      <el-form-item :label="t('rawUploadPage.selectOrder')">
        <el-select
          v-model="form.orderId"
          :placeholder="t('rawUploadPage.orderPlaceholder')"
          style="width: 100%"
          @change="onOrderChange"
        >
          <el-option
            v-for="o in pendingOrders"
            :key="o.id"
            :label="orderLabel(o)"
            :value="o.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div v-if="form.orderId" class="upload-area">
      <el-upload
        drag
        multiple
        :auto-upload="false"
        :file-list="fileList"
        accept=".raw,.cr2,.nef,.arw,.dng,.jpg,.jpeg"
        :on-change="onFileChange"
        :on-remove="onFileRemove"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          {{ t('rawUploadPage.dragText') }}<em>{{ t('rawUploadPage.dragEm') }}</em>
        </div>
        <template #tip>
          <div class="el-upload__tip text-gray-400">{{ t('rawUploadPage.tip') }}</div>
        </template>
      </el-upload>

      <div class="mt-4 flex items-center justify-between">
        <span class="text-sm text-gray-500">{{ t('rawUploadPage.selectedCount', { count: fileList.length }) }}</span>
        <el-button type="primary" :loading="uploading" :disabled="fileList.length === 0" @click="startUpload">
          {{ t('rawUploadPage.startUpload') }}
        </el-button>
      </div>

      <div v-if="uploading" class="mt-4">
        <el-progress :percentage="uploadProgress" :status="uploadProgress === 100 ? 'success' : ''" />
      </div>

      <div v-if="uploadResult" class="mt-4">
        <el-alert :type="uploadResult.success ? 'success' : 'error'" :title="uploadResult.message" :closable="false" />
      </div>
    </div>

    <el-empty v-else-if="pendingOrders.length === 0" :description="t('rawUploadPage.emptyOrders')" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import request from '@/api/request'

const { t } = useI18n()
const form = reactive({ orderId: '' })
const fileList = ref<any[]>([])
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadResult = ref<any>(null)
const orders = ref<any[]>([])

const pendingOrders = computed(() =>
  orders.value.filter((o) => o.status === 'PAID' || o.status === 'SHOOTING' || o.status === 'SHOT'),
)

const orderLabel = (o: any) =>
  `#${o.id} — ${o.customerName || t('rawUploadPage.customerFallback')} (${o.shootingDate || t('rawUploadPage.dateTbd')})`

const onOrderChange = () => {
  fileList.value = []
  uploadResult.value = null
}

const onFileChange = (file: any) => {
  fileList.value.push(file)
}

const onFileRemove = (file: any) => {
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
}

const startUpload = async () => {
  if (fileList.value.length === 0) return
  uploading.value = true
  uploadProgress.value = 0
  uploadResult.value = null

  try {
    for (let i = 0; i < fileList.value.length; i++) {
      const file = fileList.value[i].raw
      const formData = new FormData()
      formData.append('file', file)
      formData.append('orderId', form.orderId)

      await request.post('/media/upload/raw', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e: any) => {
          uploadProgress.value = Math.round(((i + e.loaded / e.total) / fileList.value.length) * 100)
        },
      })
    }

    uploadProgress.value = 100
    uploadResult.value = {
      success: true,
      message: t('rawUploadPage.uploadSuccessCount', { count: fileList.value.length }),
    }
    ElMessage.success(t('rawUploadPage.uploadComplete'))
    fileList.value = []
  } catch (err: any) {
    uploadResult.value = {
      success: false,
      message: err?.response?.data?.message || t('rawUploadPage.uploadFailedRetry'),
    }
    ElMessage.error(t('rawUploadPage.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await request.get('/orders/provider')
    orders.value = (res as any)?.data || []
  } catch {
    orders.value = []
  }
})
</script>
