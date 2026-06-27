<template>
  <div class="wl-container-wide py-6">
    <h1 class="text-3xl font-bold mb-2">{{ location }} 攝影靈感</h1>
    <p class="text-text-secondary mb-6">在 {{ location }} 拍攝的精彩作品</p>

    <!-- 拍攝類型篩選 -->
    <div class="flex gap-2 mb-6 overflow-x-auto">
      <button @click="selectedType = null" :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap', !selectedType ? 'bg-primary text-white' : 'bg-white border border-border dark:bg-[var(--wl-bg-card)] dark:border-[var(--wl-border)]']">
        全部
      </button>
      <button v-for="st in serviceTypes" :key="st.id" @click="selectedType = st.id"
        :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap', selectedType === st.id ? 'bg-primary text-white' : 'bg-white border border-border dark:bg-[var(--wl-bg-card)] dark:border-[var(--wl-border)]']">
        {{ st.name }}
      </button>
    </div>

    <!-- 公開相簿網格 -->
    <div v-if="loading" class="text-center py-12 text-text-secondary">載入中...</div>
    <div v-else-if="albums.length === 0" class="text-center py-12">
      <p class="text-4xl mb-4">📷</p>
      <p class="text-text-secondary">此地點尚無公開作品</p>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <NuxtLink v-for="album in albums" :key="album.id" :to="`/albums/${album.id}`" class="wl-card block">
        <div class="aspect-square bg-bg">
          <img v-if="album.coverUrl" :src="album.coverUrl" class="w-full h-full object-cover" />
        </div>
        <div class="p-2">
          <p class="text-sm font-semibold truncate">{{ album.title }}</p>
          <p class="text-xs text-text-secondary">{{ album.shootDate }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildLocalBusinessSchema, useJsonLd } from '~/composables/useJsonLd'

const route = useRoute()
const config = useRuntimeConfig()

const location = computed(() => decodeURIComponent(route.params.location as string))
const selectedType = ref<number | null>(null)
const albums = ref<any[]>([])
const serviceTypes = ref<any[]>([])
const loading = ref(true)

watch(selectedType, async () => { await loadAlbums() })

const loadAlbums = async () => {
  loading.value = true
  try {
    const url = selectedType.value
      ? `${config.public.apiBase}/albums/public/location/${encodeURIComponent(location.value)}/type/${selectedType.value}`
      : `${config.public.apiBase}/albums/location/${encodeURIComponent(location.value)}`
    const resp = await fetch(url)
    const res = await resp.json()
    albums.value = res.data || []
  } catch {
    albums.value = []
  } finally {
    loading.value = false
  }
}

const loadServiceTypes = async () => {
  try {
    const resp = await fetch(`${config.public.apiBase}/search/service-types`)
    const res = await resp.json()
    serviceTypes.value = res.data || []
  } catch {}
}

onMounted(async () => {
  useJsonLd(buildLocalBusinessSchema(
    `${location.value} 攝影`,
    location.value,
    `https://wanderlens.app/location/${encodeURIComponent(location.value)}`,
  ))
  await Promise.all([loadAlbums(), loadServiceTypes()])
})
</script>