<template>
  <div class="wl-container py-6" data-testid="album-list-page">
    <h1 class="text-2xl font-bold mb-6">{{ $t('album.myAlbums') }}</h1>
    <WlStateView
      :status="viewStatus"
      :loading-message="$t('common.loading')"
      :empty-title="$t('album.empty')"
      :error-message="loadError"
      @retry="loadAlbums"
    >
      <template #empty-action>
        <NuxtLink to="/booking" class="wl-btn-primary inline-block mt-4">{{ $t('album.bookNow') }}</NuxtLink>
      </template>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink v-for="album in albums" :key="album.id" :to="`/albums/${album.id}`" class="wl-card block">
          <div class="aspect-video bg-bg">
            <img v-if="album.coverUrl" :src="album.coverUrl" class="w-full h-full object-cover" />
          </div>
          <div class="p-3">
            <h3 class="font-semibold text-sm">{{ album.title }}</h3>
            <p class="text-xs text-text-secondary">{{ album.shootDate }} · {{ album.shootLocation }}</p>
          </div>
        </NuxtLink>
      </div>
    </WlStateView>
  </div>
</template>

<script setup lang="ts">
import { useAlbumApi } from '~/api/album-api'

definePageMeta({ middleware: 'auth' })

const albumApi = useAlbumApi()
const { t } = useI18n()
const albums = ref<any[]>([])
const loading = ref(true)
const loadError = ref('')

const viewStatus = computed(() => {
  if (loading.value) return 'loading'
  if (loadError.value) return 'error'
  if (albums.value.length === 0) return 'empty'
  return 'ready'
})

const loadAlbums = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const res: any = await albumApi.myAlbums()
    albums.value = res.data || []
  } catch (err: any) {
    albums.value = []
    loadError.value = err?.message || t('common.loadError')
  } finally {
    loading.value = false
  }
}

onMounted(loadAlbums)
</script>
