<template>
  <el-card>
    <el-upload drag multiple accept="image/jpeg,image/png" :http-request="uploadWork" :show-file-list="false">
      <el-icon class="text-4xl text-gray-400"><UploadFilled /></el-icon>
      <div class="text-sm text-gray-500">{{ t('photoWorksPage.uploadHint') }}</div>
    </el-upload>

    <div class="grid grid-cols-4 md:grid-cols-6 gap-3 mt-4">
      <div v-for="work in works" :key="work.id" class="relative group">
        <el-image :src="work.imageUrl" class="w-full aspect-square rounded-lg" fit="cover" />
        <el-button
          class="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
          type="danger"
          :icon="Delete"
          circle
          size="small"
          :aria-label="t('common.delete')"
          @click="remove(work.id)"
        />
      </div>
    </div>

    <el-divider />
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-semibold text-sm">{{ t('photoWorksPage.consentTitle') }}</h3>
        <p class="text-xs text-gray-500 mt-1">{{ t('photoWorksPage.consentDesc') }}</p>
      </div>
      <el-button type="primary" size="small" @click="loadPublicAlbums">{{ t('photoWorksPage.viewPublic') }}</el-button>
    </div>

    <div v-if="publicAlbums.length > 0" class="grid grid-cols-4 md:grid-cols-6 gap-3 mt-4">
      <div v-for="album in publicAlbums" :key="album.id" class="relative">
        <el-image :src="album.coverUrl || ''" class="w-full aspect-square rounded-lg" fit="cover" :alt="album.title">
          <template #error>
            <div class="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
              {{ t('photoWorksPage.noImage') }}
            </div>
          </template>
        </el-image>
        <p class="text-xs text-gray-500 mt-1 truncate">{{ album.title }}</p>
        <el-button text type="primary" size="small" @click="requestConsent(album.id)">
          {{ t('photoWorksPage.requestConsent') }}
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UploadFilled, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const works = ref<any[]>([])
const publicAlbums = ref<any[]>([])

const providerId = () => authStore.resolvedProviderId!

const loadPublicAlbums = async () => {
  if (!providerId()) return
  try {
    const res: any = await api.getPublicAlbums(providerId())
    publicAlbums.value = res.data || []
  } catch {
    publicAlbums.value = []
  }
}

const requestConsent = async (albumId: number) => {
  try {
    await api.requestPortfolioConsent(albumId)
    ElMessage.success(t('photoWorksPage.consentSent'))
  } catch {
    ElMessage.error(t('photoWorksPage.consentFailed'))
  }
}

const uploadWork = async (options: any) => {
  if (works.value.length >= 50) {
    ElMessage.warning(t('photoWorksPage.maxWorks'))
    return
  }
  if (options.file.size > 2 * 1024 * 1024) {
    ElMessage.error(t('photoWorksPage.fileTooLarge'))
    return
  }
  try {
    const res: any = await api.uploadFile('provider_works', options.file)
    const fileUuid = res.data?.uuid
    if (!fileUuid) {
      throw new Error('missing uuid')
    }
    const workRes: any = await api.addWork({ providerId: providerId(), fileUuid })
    works.value.push(workRes.data)
    ElMessage.success(t('photoWorksPage.uploadSuccess'))
  } catch {
    ElMessage.error(t('photoWorksPage.uploadFailed'))
  }
}

const remove = async (id: number) => {
  try {
    await api.deleteWork(id, providerId())
    works.value = works.value.filter((w) => w.id !== id)
  } catch {
    ElMessage.error(t('photoWorksPage.uploadFailed'))
  }
}

const loadWorks = async () => {
  if (!providerId()) return
  try {
    const res: any = await api.getWorks(providerId())
    works.value = res.data || []
  } catch {
    // silent
  }
}

onMounted(loadWorks)
</script>
