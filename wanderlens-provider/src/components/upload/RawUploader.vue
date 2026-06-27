<template>
  <div>
    <!-- 上傳區 -->
    <el-upload drag multiple :show-file-list="false" :http-request="handleUpload" accept=".cr2,.nef,.arw,.raf,.dng,.jpg,.jpeg">
      <el-icon class="text-4xl text-gray-400"><UploadFilled /></el-icon>
      <div class="text-sm text-gray-500">拖拽 RAW / JPEG 檔案到此或點擊選擇</div>
    </el-upload>

    <!-- JPEG 快路徑狀態 -->
    <div v-if="jpegFiles.length > 0" class="mt-4">
      <h4 class="text-sm font-semibold mb-2">⚡ JPEG 快路徑</h4>
      <div v-for="f in jpegFiles" :key="f.name" class="flex items-center gap-2 text-sm mb-1">
        <el-icon v-if="f.status === 'done'" class="text-green-500"><CircleCheck /></el-icon>
        <el-icon v-else-if="f.status === 'uploading'" class="text-blue-500 loading"><Loading /></el-icon>
        <span>{{ f.name }}</span>
        <span v-if="f.status === 'done'" class="text-green-500">✅ 已上傳</span>
      </div>
    </div>

    <!-- RAW 上傳隊列 -->
    <div v-if="rawFiles.length > 0" class="mt-4">
      <h4 class="text-sm font-semibold mb-2">📸 RAW 上傳隊列</h4>
      <div v-for="f in rawFiles" :key="f.name" class="mb-2">
        <div class="flex items-center justify-between text-sm mb-1">
          <span>{{ f.name }}</span>
          <span :class="f.status === 'done' ? 'text-green-500' : f.status === 'failed' ? 'text-red-500' : 'text-gray-500'">
            {{ f.status === 'done' ? '✅' : f.status === 'failed' ? '❌' : `${f.progress}%` }}
          </span>
        </div>
        <el-progress :percentage="f.progress" :status="f.status === 'done' ? 'success' : f.status === 'failed' ? 'exception' : ''" :stroke-width="4" />
      </div>
    </div>

    <!-- 統計 -->
    <div v-if="rawFiles.length > 0 || jpegFiles.length > 0" class="mt-4 text-sm text-gray-500">
      共 {{ rawFiles.length + jpegFiles.length }} 個檔案 ·
      JPEG 已上傳 {{ jpegFiles.filter(f => f.status === 'done').length }} ·
      RAW 已上傳 {{ rawFiles.filter(f => f.status === 'done').length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UploadFilled, CircleCheck, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const props = defineProps<{ orderId: number }>()
const emit = defineEmits<{ complete: [] }>()

const rawFiles = ref<any[]>([])
const jpegFiles = ref<any[]>([])

// 允許的副檔名
const ALLOWED_RAW = ['.cr2', '.nef', '.arw', '.raf', '.dng']
const ALLOWED_JPEG = ['.jpg', '.jpeg']
// 單檔大小限制：RAW 200MB, JPEG 50MB
const MAX_RAW_SIZE = 200 * 1024 * 1024
const MAX_JPEG_SIZE = 50 * 1024 * 1024

// 最大重試次數
const MAX_RETRIES = 3

/**
 * 取得 media 服務上傳 URL（從 api 服務核發的 token 換取實際上傳端點）
 */
const getMediaUploadUrl = (): string => {
  // media 服務的上傳端點，由環境變數配置
  return import.meta.env.VITE_MEDIA_UPLOAD_URL || 'http://localhost:8001/upload'
}

/**
 * 上傳單一檔案到 media 服務（含進度追蹤與重試）
 */
const uploadToMedia = async (
  token: string,
  file: File,
  assetType: string,
  onProgress: (pct: number) => void
): Promise<void> => {
  const uploadUrl = getMediaUploadUrl()
  const formData = new FormData()
  formData.append('file', file)
  formData.append('token', token)
  formData.append('asset_type', assetType)
  formData.append('order_id', String(props.orderId))

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uploadUrl)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`))
      }
    }

    xhr.onerror = () => reject(new Error('網路錯誤'))
    xhr.send(formData)
  })
}

/**
 * 帶重試的上傳
 */
const uploadWithRetry = async (
  token: string,
  file: File,
  assetType: string,
  onProgress: (pct: number) => void
): Promise<void> => {
  let lastError: Error | null = null
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await uploadToMedia(token, file, assetType, onProgress)
      return
    } catch (err: any) {
      lastError = err
      if (attempt < MAX_RETRIES) {
        ElMessage.warning(`${file.name} 上傳失敗，正在重試 (${attempt}/${MAX_RETRIES})...`)
        await new Promise(r => setTimeout(r, 1000 * attempt)) // 指數退避
      }
    }
  }
  throw lastError
}

const handleUpload = async (options: any) => {
  const file = options.file as File
  const lowerName = file.name.toLowerCase()

  // 判斷檔案類型
  const isJpeg = ALLOWED_JPEG.some(ext => lowerName.endsWith(ext))
  const isRaw = ALLOWED_RAW.some(ext => lowerName.endsWith(ext))

  if (!isJpeg && !isRaw) {
    ElMessage.error(`${file.name} 不支援的檔案格式`)
    return
  }

  // 檔案大小驗證
  const maxSize = isJpeg ? MAX_JPEG_SIZE : MAX_RAW_SIZE
  if (file.size > maxSize) {
    ElMessage.error(`${file.name} 超過大小限制 (${isJpeg ? '50MB' : '200MB'})`)
    return
  }

  const assetType = isJpeg ? 'JPEG' : 'RAW'

  if (isJpeg) {
    // JPEG 快路徑：優先上傳
    const entry = reactive({ name: file.name, status: 'uploading', progress: 0 })
    jpegFiles.value.push(entry)
    try {
      // 取得上傳 token
      const tokenRes: any = await api.getUploadToken(props.orderId, assetType)
      const token = tokenRes.data
      // 實際上傳到 media 服務
      await uploadWithRetry(token, file, assetType, (pct) => { entry.progress = pct })
      entry.status = 'done'
      entry.progress = 100
    } catch {
      entry.status = 'failed'
      ElMessage.error(`${file.name} 上傳失敗`)
    }
  } else {
    // RAW：背景上傳
    const entry = reactive({ name: file.name, status: 'uploading', progress: 0 })
    rawFiles.value.push(entry)
    try {
      const tokenRes: any = await api.getUploadToken(props.orderId, assetType)
      const token = tokenRes.data
      // 分段上傳到 media 服務（大檔案使用 FormData，瀏覽器會自動處理）
      await uploadWithRetry(token, file, assetType, (pct) => { entry.progress = pct })
      entry.status = 'done'
      entry.progress = 100
    } catch {
      entry.status = 'failed'
      ElMessage.error(`${file.name} 上傳失敗`)
    }
  }

  // 檢查是否全部完成
  const allDone = [...rawFiles.value, ...jpegFiles.value].every(f => f.status === 'done' || f.status === 'failed')
  if (allDone && rawFiles.value.length > 0) {
    emit('complete')
  }
}
</script>