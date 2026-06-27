<template>
  <section class="py-16 wl-container-wide">
    <div class="flex items-end justify-between mb-10">
      <div>
        <span class="wl-badge wl-badge-primary mb-3">{{ $t('home.photographers') }}</span>
        <h2 class="text-3xl font-extrabold text-text-primary">{{ $t('home.topPhotographers') }}</h2>
        <p class="text-text-secondary mt-2">{{ $t('home.photographersDesc') }}</p>
      </div>
      <NuxtLink to="/photographer-list" class="hidden sm:flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all">
        {{ $t('home.viewAll') }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </NuxtLink>
    </div>

    <!-- 載入骨架 -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="n in 4" :key="n" class="wl-skeleton-card">
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

    <!-- ?�影師網??-->
    <div v-else-if="photographers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="(p, idx) in photographers" :key="p.providerId" :class="'wl-animate-in wl-stagger-' + Math.min(idx + 1, 4)">
        <PhotographerCard :photographer="p" />
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else class="wl-empty">
      <div class="wl-empty-icon">📷</div>
      <div class="wl-empty-title">{{ $t('home.noPhotographers') }}</div>
      <div class="wl-empty-desc">{{ $t('home.noPhotographersDesc') }}</div>
    </div>

    <!-- 行�??�查?�全??-->
    <div class="text-center mt-8 sm:hidden">
      <NuxtLink to="/photographer-list" class="wl-btn-secondary">
        {{ $t('home.viewAll') }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useBookingApi } from '~/api/booking-api'

const bookingApi = useBookingApi()
const photographers = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res: any = await bookingApi.searchProviders({
      serviceTypeId: 1,
      shootingDate: new Date().toISOString().split('T')[0],
      timeStart: '10:00',
      timeEnd: '12:00',
    })
    photographers.value = (res.data || []).slice(0, 8)
  } catch {
    photographers.value = []
  } finally {
    loading.value = false
  }
})
</script>