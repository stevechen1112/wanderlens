<template>
  <section class="py-12 wl-container">
    <h2 class="text-2xl font-bold text-center mb-8">{{ $t('home.ratings') }}</h2>
    <Swiper :modules="[SwiperAutoplay]" :autoplay="{ delay: 4000 }" :loop="true" :slides-per-view="3" :space-between="16">
      <SwiperSlide v-for="rating in ratings" :key="rating.id" class="pb-4">
        <div class="wl-card p-4">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs">
              {{ rating.author?.charAt(0) }}
            </div>
            <span class="text-sm font-semibold">{{ rating.author }}</span>
            <span class="text-xs text-warning">★ {{ rating.stars }}</span>
          </div>
          <p class="text-sm text-text-regular">{{ rating.comments }}</p>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay as SwiperAutoplay } from 'swiper/modules'
import 'swiper/css'
import { useProviderApi } from '~/api/provider-api'

const providerApi = useProviderApi()
const ratings = ref<any[]>([])

onMounted(async () => {
  try {
    const res: any = await providerApi.getRatings()
    ratings.value = res.data || []
  } catch {
    ratings.value = []
  }
})
</script>