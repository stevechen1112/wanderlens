<template>
  <div class="wl-container py-8 max-w-4xl">
    <!-- 載入中 -->
    <div v-if="loading" class="text-center py-12 text-text-secondary">
      {{ $t('common.loading') }}
    </div>

    <template v-else-if="album">
      <!-- SEO 麵包屑 -->
      <nav class="text-sm text-text-secondary mb-4">
        <NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink> /
        <NuxtLink :to="`/location/${album.location}`" class="hover:text-primary">{{ album.location }}</NuxtLink> /
        <span class="text-text-primary">{{ album.title }}</span>
      </nav>

      <!-- 故事標題 -->
      <h1 class="text-3xl font-bold mb-2">{{ album.title || album.location + ' 拍攝故事' }}</h1>
      <p class="text-text-secondary mb-6">
        {{ album.shootingDate }} · {{ album.photographerName }} · {{ album.serviceTypeName }}
      </p>

      <!-- 封面圖 -->
      <div v-if="album.coverUrl" class="rounded-lg overflow-hidden mb-8">
        <img :src="album.coverUrl" :alt="album.title" class="w-full max-h-[400px] object-cover" />
      </div>

      <!-- 故事內容 -->
      <div v-if="album.story" class="prose max-w-none mb-8">
        <p class="text-text-primary leading-relaxed whitespace-pre-line">{{ album.story }}</p>
      </div>

      <!-- 照片輪播 -->
      <h2 class="text-xl font-bold mb-4">精選照片</h2>
      <div v-if="photos.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          @click="openPhoto(photo)"
        >
          <img :src="photo.thumbnailUrl || photo.fileUrl" :alt="photo.name" class="w-full h-48 object-cover" />
        </div>
      </div>
      <div v-else class="text-text-secondary text-sm mb-8">暫無照片</div>

      <!-- 攝影師資訊 -->
      <div v-if="album.photographerName" class="wl-surface rounded-lg p-6 mb-8">
        <h2 class="font-semibold mb-4">攝影師</h2>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {{ album.photographerName.charAt(0) }}
          </div>
          <div>
            <p class="font-semibold">{{ album.photographerName }}</p>
            <NuxtLink :to="`/photographer/${album.photographerUuid}`" class="text-primary text-sm">
              查看作品集 →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="bg-gradient-to-r from-primary to-blue-500 rounded-lg p-8 text-center text-white mb-8">
        <h2 class="text-xl font-bold mb-2">想在這裡拍攝嗎？</h2>
        <p class="mb-4 opacity-90">找到適合的攝影師，預約你的拍攝體驗</p>
        <NuxtLink
          :to="`/search?location=${album.location}&serviceTypeId=${album.serviceTypeId}`"
          class="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          立即預約
        </NuxtLink>
      </div>

      <!-- 相關故事 -->
      <h2 class="text-xl font-bold mb-4">更多 {{ album.location }} 故事</h2>
      <div v-if="relatedLoading" class="text-text-secondary text-sm">載入中...</div>
      <div v-else-if="relatedAlbums.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="rel in relatedAlbums"
          :key="rel.id"
          :to="`/story/${rel.id}`"
          class="rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <img v-if="rel.coverUrl" :src="rel.coverUrl" :alt="rel.title" class="w-full h-32 object-cover" />
          <div class="p-2">
            <p class="text-sm font-medium truncate">{{ rel.title || rel.location }}</p>
            <p class="text-xs text-text-secondary">{{ rel.shootingDate }}</p>
          </div>
        </NuxtLink>
      </div>
      <p v-else class="text-text-secondary text-sm">暫無相關故事</p>
    </template>

    <!-- 不存在 -->
    <div v-else class="text-center py-12">
      <p class="text-text-secondary">故事不存在或已下架</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlbumApi } from '~/api/album-api'

const route = useRoute()
const albumApi = useAlbumApi()

const loading = ref(true)
const relatedLoading = ref(false)
const album = ref<any>(null)
const photos = ref<any[]>([])
const relatedAlbums = ref<any[]>([])

const openPhoto = (photo: any) => {
  if (import.meta.client && photo.fileUrl) {
    window.open(photo.fileUrl, '_blank')
  }
}

onMounted(async () => {
  try {
    const res: any = await albumApi.getAlbum(Number(route.params.id))
    album.value = res.data

    if (album.value) {
      // 載入照片
      try {
        const photosRes: any = await albumApi.getPhotos(Number(route.params.id))
        photos.value = photosRes.data || []
      } catch {
        photos.value = []
      }

      // 載入相關故事
      if (album.value.location) {
        relatedLoading.value = true
        try {
          const relRes: any = await albumApi.publicAlbumsByLocation(album.value.location)
          relatedAlbums.value = (relRes.data || []).filter((a: any) => a.id !== album.value.id).slice(0, 4)
        } catch {
          relatedAlbums.value = []
        } finally {
          relatedLoading.value = false
        }
      }
    }
  } catch {
    album.value = null
  } finally {
    loading.value = false
  }
})
</script>