<template>
  <section class="py-16 bg-gradient-to-b from-white to-secondary-light/30">
    <div class="wl-container-wide">
      <div class="text-center mb-10">
        <span class="wl-badge wl-badge-primary mb-3">{{ $t('home.serviceTypes') }}</span>
        <h2 class="text-3xl font-extrabold text-text-primary">{{ $t('home.findYourShoot') }}</h2>
        <p class="text-text-secondary mt-2">{{ $t('home.serviceTypesDesc') }}</p>
      </div>

      <!-- 載入骨架 -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="n in 6" :key="n" class="wl-skeleton-card">
          <div class="wl-skeleton wl-skeleton-image mb-3" />
          <div class="wl-skeleton wl-skeleton-text" />
          <div class="wl-skeleton wl-skeleton-text-sm" />
        </div>
      </div>

      <!-- 類型卡片 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="(st, idx) in serviceTypes"
          :key="st.id"
          to="/booking"
          class="wl-card p-5 text-center cursor-pointer wl-hover-lift wl-tap-active group"
          :class="'wl-animate-in wl-stagger-' + Math.min(idx + 1, 6)"
          @click="selectType(st.id)"
        >
          <div class="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
            :style="{ background: iconBgColors[idx % iconBgColors.length] }">
            <img v-if="st.iconUrl" :src="st.iconUrl" class="w-7 h-7" :alt="st.name" />
            <span v-else>{{ typeIcons[idx % typeIcons.length] || '📷' }}</span>
          </div>
          <h3 class="text-sm font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">{{ st.name }}</h3>
          <p class="text-xs text-text-secondary">{{ $t('home.from') }} <span class="text-primary font-bold">${{ st.price || 800 }}</span></p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useBookingApi } from '~/api/booking-api'
import { useSearchStore } from '~/stores/search'

const bookingApi = useBookingApi()
const searchStore = useSearchStore()
const serviceTypes = ref<any[]>([])
const loading = ref(true)

const typeIcons = ['📷', '💒', '👨‍👩‍👧‍👦', '🎓', '👶', '🐾', '🏢', '🎨', '🌸', '✈️', '🍽️', '🎉', '🏃']
const iconBgColors = [
  '#E8F6F3', '#E8F7FA', '#F0FFF4', '#FFF7E6',
  '#F3E8FF', '#FCE4EC', '#E0F2F1', '#FFF3E0',
  '#E8EAF6', '#F1F8E9', '#FBE9E7', '#E1F5FE',
]

const selectType = (id: number) => {
  searchStore.setCondition({ serviceTypeId: id })
}

onMounted(async () => {
  try {
    const res: any = await bookingApi.getServiceTypes()
    serviceTypes.value = res.data || []
  } catch {
    serviceTypes.value = []
  } finally {
    loading.value = false
  }
})
</script>