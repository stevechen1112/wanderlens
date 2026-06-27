<template>
  <div class="wl-container py-6" data-testid="album-detail-page">
    <WlStateView
      :status="viewStatus"
      :loading-message="$t('common.loading')"
      :empty-title="$t('album.notFound')"
      :error-message="loadError"
      @retry="loadAlbum"
    >
      <div v-if="album" class="mb-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold">{{ album.title }}</h1>
            <p class="text-text-secondary">{{ album.shootDate }} · {{ album.shootLocation }}</p>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button
              v-if="!selectMode"
              type="button"
              class="wl-btn-secondary text-sm"
              @click="selectMode = true"
            >
              ✨ {{ $t('album.retouchSelect') }}
            </button>
            <button
              v-else
              type="button"
              class="px-4 py-2 rounded-xl border border-border text-sm font-semibold"
              @click="cancelSelect"
            >
              {{ $t('album.retouchCancel') }}
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:border-primary"
              data-testid="album-consent-btn"
              @click="consentOpen = true"
            >
              {{ $t('album.consentManage') }}
            </button>
          </div>
        </div>

        <div v-if="selectMode && selectedPhotos.size > 0" class="mt-4">
          <button type="button" class="wl-btn-primary w-full md:w-auto" @click="submitRetouch">
            {{ $t('album.retouchSubmit') }}（{{ selectedPhotos.size }}）
          </button>
        </div>
      </div>

      <div v-if="photos.length === 0" class="wl-empty py-16">
        <div class="wl-empty-icon">📸</div>
        <div class="wl-empty-title">{{ $t('album.noPhotos') }}</div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="album-photo-grid">
        <div
          v-for="(photo, photoIndex) in photos"
          :key="photo.id"
          :data-testid="`album-photo-${photo.id}`"
          :class="[
            'aspect-square rounded-xl overflow-hidden cursor-pointer relative group transition-all',
            selectMode && selectedPhotos.has(photo.id) ? 'ring-4 ring-primary scale-[0.98]' : 'hover:ring-2 hover:ring-primary/40',
          ]"
          @click="handlePhotoClick(photo, photoIndex)"
        >
          <img :src="photo.previewUrl || photo.thumbnailUrl" class="w-full h-full object-cover" loading="lazy">
          <div v-if="selectMode && selectedPhotos.has(photo.id)" class="absolute inset-0 bg-primary/30 flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">✓</div>
          </div>
          <button
            v-if="!selectMode"
            type="button"
            class="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/45 flex items-center justify-center text-lg z-10"
            :data-testid="`album-favorite-${photo.id}`"
            :aria-label="favorites.has(photo.id) ? $t('album.unfavorite') : $t('album.favorite')"
            @click.stop="toggleFavorite(photo.id)"
          >
            {{ favorites.has(photo.id) ? '❤️' : '🤍' }}
          </button>
          <div v-if="!selectMode" class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-center opacity-0 group-hover:opacity-100 pb-3 pointer-events-none">
            <span class="text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">{{ $t('album.download') }}</span>
          </div>
        </div>
      </div>

      <div class="mt-8 wl-card p-6">
        <h3 class="font-bold mb-4 flex items-center gap-2">🔗 {{ $t('album.share') }}</h3>
        <div class="flex gap-3 flex-wrap">
          <button type="button" class="wl-btn-secondary" @click="share">{{ $t('album.share') }}</button>
          <button
            v-for="platform in sharePlatforms"
            :key="platform.key"
            type="button"
            :class="['px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-2 transition-transform hover:scale-105', platform.color]"
            @click="shareToSocial(platform.key)"
          >
            <span>{{ platform.icon }}</span> {{ platform.label }}
          </button>
        </div>
      </div>

      <PhotoViewer
        :visible="viewerOpen"
        :photos="photos"
        :index="viewerIndex"
        @close="viewerOpen = false"
        @update:index="viewerIndex = $event"
        @download="downloadFromViewer"
      />

      <AlbumConsentSheet
        :visible="consentOpen"
        :album-id="albumId"
        :current-level="consentLevel"
        :has-minor="hasMinor"
        @close="consentOpen = false"
        @saved="onConsentSaved"
        @revoke="revokeConsent"
      />

      <Teleport to="body">
        <div v-if="showRatingDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div class="wl-card p-6 md:p-8 max-w-md w-full wl-animate-in">
            <h3 class="text-xl font-extrabold mb-2">為本次拍攝評分</h3>
            <p class="text-sm text-text-secondary mb-6">照片已交付，請為攝影師的服務打分</p>
            <div class="flex justify-center gap-2 mb-6">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="text-3xl transition-transform hover:scale-110"
                :class="star <= ratingStars ? 'text-warning' : 'text-border'"
                @click="ratingStars = star"
              >
                ★
              </button>
            </div>
            <textarea v-model="ratingComment" rows="3" placeholder="分享您的拍攝體驗（選填）" class="wl-input w-full mb-4 text-sm" />
            <div class="flex gap-3">
              <button type="button" class="flex-1 py-3 border border-border rounded-xl font-semibold" @click="dismissRating">稍後再說</button>
              <button type="button" class="flex-1 wl-btn-primary disabled:opacity-50" :disabled="ratingStars === 0" @click="submitRating">提交評價</button>
            </div>
          </div>
        </div>
      </Teleport>
    </WlStateView>
  </div>
</template>

<script setup lang="ts">
import { useAlbumApi } from '~/api/album-api'
import { useRetouchApi } from '~/api/retouch-api'
import { useProviderApi } from '~/api/provider-api'
import { useOrderApi } from '~/api/order-api'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const albumApi = useAlbumApi()
const retouchApi = useRetouchApi()
const providerApi = useProviderApi()
const orderApi = useOrderApi()
const authStore = useAuthStore()

const album = ref<any>(null)
const photos = ref<any[]>([])
const order = ref<any>(null)
const loading = ref(true)
const loadError = ref('')
const selectMode = ref(false)
const selectedPhotos = ref(new Set<number>())
const favorites = ref(new Set<number>())
const viewerIndex = ref(0)
const viewerOpen = ref(false)
const consentOpen = ref(false)
const consentLevel = ref('PRIVATE')
const hasMinor = ref(false)
const showRatingDialog = ref(false)
const ratingStars = ref(0)
const ratingComment = ref('')

const sharePlatforms = [
  { key: 'line', label: 'LINE', icon: '💬', color: 'bg-green-500' },
  { key: 'facebook', label: 'Facebook', icon: 'f', color: 'bg-blue-600' },
  { key: 'instagram', label: 'Instagram', icon: '📷', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { key: 'twitter', label: 'X', icon: '𝕏', color: 'bg-black' },
]

const albumId = computed(() => Number(route.params.id))

const viewStatus = computed(() => {
  if (loading.value) return 'loading'
  if (loadError.value) return 'error'
  if (!album.value) return 'empty'
  return 'ready'
})

function handlePhotoClick(photo: any, photoIndex: number) {
  if (selectMode.value) {
    const next = new Set(selectedPhotos.value)
    if (next.has(photo.id)) next.delete(photo.id)
    else next.add(photo.id)
    selectedPhotos.value = next
  } else {
    viewerIndex.value = photoIndex
    viewerOpen.value = true
  }
}

function cancelSelect() {
  selectMode.value = false
  selectedPhotos.value = new Set()
}

async function toggleFavorite(photoId: number) {
  const next = new Set(favorites.value)
  try {
    if (next.has(photoId)) {
      await albumApi.unfavorite(albumId.value, photoId)
      next.delete(photoId)
    } else {
      await albumApi.favorite(albumId.value, photoId)
      next.add(photoId)
    }
    favorites.value = next
  } catch (err: any) {
    toast.error(err?.message || t('common.loadError'))
  }
}

async function downloadFromViewer(photo: any) {
  try {
    await albumApi.download(albumId.value, photo.id)
    const url = photo.fileUrl || photo.previewUrl
    if (url) window.open(url, '_blank')
  } catch (err: any) {
    toast.error(err?.message || t('common.loadError'))
  }
}

async function submitRetouch() {
  if (!authStore.user?.userId || !album.value?.orderId) {
    toast.warning(t('album.retouchNoOrder'))
    return
  }
  if (selectedPhotos.value.size === 0) {
    toast.warning(t('album.retouchNeedPhotos'))
    return
  }
  try {
    await retouchApi.createJob(
      album.value.orderId,
      authStore.user.userId,
      JSON.stringify([...selectedPhotos.value]),
    )
    toast.success(t('album.retouchSuccess', { count: selectedPhotos.value.size }))
    cancelSelect()
  } catch (err: any) {
    toast.error(err?.message || t('album.retouchFailed'))
  }
}

async function share() {
  try {
    const res: any = await albumApi.share(albumId.value)
    const url = window.location.origin + (res?.data || '')
    const shareData = {
      title: album.value?.title || 'WanderLens 相簿',
      text: '與您分享我的 WanderLens 拍攝相簿',
      url,
    }
    if (typeof navigator.share === 'function') {
      await navigator.share(shareData)
      return
    }
    await navigator.clipboard.writeText(url)
    toast.success(t('album.shareCopied'))
  } catch (e: any) {
    if (e?.name !== 'AbortError') toast.error(e?.message || t('album.shareFailed'))
  }
}

async function shareToSocial(platform: string) {
  try {
    const res: any = await albumApi.socialShare(albumId.value, platform)
    if (res?.data) window.open(res.data, '_blank')
  } catch (err: any) {
    toast.error(err?.message || t('album.shareFailed'))
  }
}

function onConsentSaved(level: string) {
  consentLevel.value = level
  if (album.value) album.value.albumType = level === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC'
}

async function revokeConsent() {
  try {
    await albumApi.revokeConsent(albumId.value)
    consentLevel.value = 'PRIVATE'
    hasMinor.value = false
    consentOpen.value = false
    if (album.value) album.value.albumType = 'PRIVATE'
    toast.success(t('album.consentRevoked'))
  } catch (err: any) {
    toast.error(err?.message || t('album.consentRevokeFailed'))
  }
}

function dismissRating() {
  sessionStorage.setItem(`rating_dismissed_${albumId.value}`, '1')
  showRatingDialog.value = false
}

async function submitRating() {
  if (!order.value?.id || !album.value?.photographerId || ratingStars.value === 0) return
  try {
    await providerApi.submitRating({
      orderId: order.value.id,
      providerId: album.value.photographerId,
      stars: ratingStars.value,
      comments: ratingComment.value,
    })
    showRatingDialog.value = false
    toast.success(t('album.ratingThanks'))
  } catch (err: any) {
    toast.error(err?.message || t('album.ratingFailed'))
  }
}

function checkRatingPrompt() {
  const deliveredStatuses = ['DELIVERED', 'RETOUCH_DELIVERED', 'CLOSED']
  if (order.value && deliveredStatuses.includes(order.value.status) && photos.value.length > 0) {
    const dismissed = sessionStorage.getItem(`rating_dismissed_${albumId.value}`)
    if (!dismissed) showRatingDialog.value = true
  }
}

onMounted(loadAlbum)

async function loadAlbum() {
  loading.value = true
  loadError.value = ''
  try {
    const [albumRes, photosRes, favRes, consentRes]: any[] = await Promise.all([
      albumApi.getAlbum(albumId.value),
      albumApi.getPhotos(albumId.value),
      albumApi.getFavorites().catch(() => ({ data: [] })),
      albumApi.getConsent(albumId.value).catch(() => ({ data: null })),
    ])
    album.value = albumRes?.data
    photos.value = photosRes?.data || []
    favorites.value = new Set((favRes?.data || []).map((f: any) => f.mediaAssetId ?? f.id))
    const consent = consentRes?.data
    if (consent) {
      consentLevel.value = consent.consumerConsent || consent.level || 'PRIVATE'
      hasMinor.value = !!consent.hasMinor
    }

    if (album.value?.orderId) {
      try {
        const orderRes: any = await orderApi.getById(album.value.orderId)
        order.value = orderRes?.data
        checkRatingPrompt()
      } catch { /* silent */ }
    }
  } catch (err: any) {
    album.value = null
    photos.value = []
    loadError.value = err?.message || t('common.loadError')
  } finally {
    loading.value = false
  }
}
</script>
