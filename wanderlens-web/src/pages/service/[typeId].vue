<template>
  <div class="wl-container-wide py-6">
    <h1 class="text-3xl font-bold mb-2">{{ serviceType?.name || '拍攝類型' }} 作品</h1>
    <p class="text-text-secondary mb-6">{{ serviceType?.name }} 的精選公開作品</p>

    <div v-if="loading" class="text-center py-12 text-text-secondary">載入中...</div>
    <div v-else-if="albums.length === 0" class="text-center py-12">
      <p class="text-4xl mb-4">📷</p>
      <p class="text-text-secondary">此類型尚無公開作品</p>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <NuxtLink v-for="album in albums" :key="album.id" :to="`/albums/${album.id}`" class="wl-card block">
        <div class="aspect-square bg-bg">
          <img v-if="album.coverUrl" :src="album.coverUrl" class="w-full h-full object-cover" />
        </div>
        <div class="p-2">
          <p class="text-sm font-semibold truncate">{{ album.title }}</p>
          <p class="text-xs text-text-secondary">{{ album.shootLocation }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const serviceTypeId = computed(() => Number(route.params.typeId))
const serviceType = ref<any>(null)
const albums = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [typesResp, albumsResp] = await Promise.all([
      fetch(`${config.public.apiBase}/search/service-types`).then(r => r.json()),
      fetch(`${config.public.apiBase}/albums/public/type/${serviceTypeId.value}`).then(r => r.json()),
    ])
    const types = typesResp.data || []
    serviceType.value = types.find((t: any) => t.id === serviceTypeId.value)
    albums.value = albumsResp.data || []
  } catch {
    albums.value = []
  } finally {
    loading.value = false
  }
})
</script>