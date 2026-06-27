<template>
  <div class="wl-container-wide py-8">
    <!-- 搜尋條件摘要 -->
    <div class="wl-card p-5 mb-6">
      <div class="flex flex-wrap items-center gap-3 text-sm">
        <span class="font-bold text-text-primary flex items-center gap-1.5">
          <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          {{ $t('search.results') }}
        </span>
        <span class="wl-badge wl-badge-primary">{{ searchStore.condition.shootingDate }}</span>
        <span class="wl-badge wl-badge-primary">{{ searchStore.condition.timeStart }}~{{ searchStore.condition.timeEnd }}</span>
        <span class="wl-badge wl-badge-primary">{{ searchStore.condition.shootingDuration }}{{ $t('search.hours') }}</span>
        <span v-if="searchStore.condition.city" class="wl-badge wl-badge-primary">{{ searchStore.condition.city }}</span>
        <NuxtLink to="/" class="ml-auto text-primary text-sm font-semibold hover:underline">
          {{ $t('search.adjustSearch') }}
        </NuxtLink>
      </div>
    </div>

    <!-- 載入骨架 -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="n in 8" :key="n" class="wl-skeleton-card">
        <div class="wl-skeleton wl-skeleton-image" />
        <div class="p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="wl-skeleton wl-skeleton-avatar" />
            <div class="flex-1">
              <div class="wl-skeleton wl-skeleton-text" />
              <div class="wl-skeleton wl-skeleton-text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else-if="results.length === 0" class="wl-empty">
      <div class="wl-empty-icon">🔍</div>
      <div class="wl-empty-title">{{ $t('search.noResults') }}</div>
      <div class="wl-empty-desc">{{ $t('search.noResultsDesc') }}</div>
      <NuxtLink to="/" class="wl-btn-primary inline-block">{{ $t('search.adjustSearch') }}</NuxtLink>
    </div>

    <!-- 結果列表（真實資料） -->
    <div v-else>
      <p class="text-text-secondary text-sm mb-4">{{ $t('search.foundResults', { count: results.length }) }}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="(p, idx) in results" :key="p.providerId" :class="'wl-animate-in wl-stagger-' + Math.min(idx + 1, 4)">
          <NuxtLink :to="`/photographer/${p.providerUuid || p.providerId}`" class="provider-card block">
            <div class="card-image">
              <img :src="getCardPhoto(idx)" :alt="p.nickName" class="card-img" loading="lazy" />
              <div class="card-price">${{ p.totalFee || p.unitPrice || 800 }}<span class="price-unit">/hr</span></div>
            </div>
            <div class="card-info">
              <div class="card-rating">
                <svg class="w-3.5 h-3.5 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span>{{ p.rating || '5.0' }}</span>
              </div>
              <h3 class="card-name">{{ p.nickName }}</h3>
              <p class="card-city">{{ p.city }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search'
import { useBookingApi } from '~/api/booking-api'
import { getCategoryPhoto } from '~/utils/photos'

const searchStore = useSearchStore()
const bookingApi = useBookingApi()
const results = ref<any[]>([])
const loading = ref(true)

const getCardPhoto = (idx: number) => getCategoryPhoto((idx % 13) + 1, 0, 600)

onMounted(async () => {
  try {
    // 確保 serviceTypeId 有預設值
    const condition = { ...searchStore.condition }
    if (!condition.serviceTypeId) condition.serviceTypeId = 1
    const res: any = await bookingApi.searchProviders(condition)
    results.value = res.data || []
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
})
</script>