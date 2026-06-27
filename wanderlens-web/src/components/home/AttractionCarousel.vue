<template>
  <section class="py-12 bg-bg">
    <div class="wl-container-wide">
      <h2 class="text-2xl font-bold text-center mb-8">{{ $t('home.attractions') }}</h2>
      <Swiper :modules="[SwiperAutoplay]" :autoplay="{ delay: 4000 }" :slides-per-view="4" :space-between="16">
        <SwiperSlide v-for="attr in attractions" :key="attr.id">
          <div class="wl-card overflow-hidden">
            <div class="aspect-square bg-bg">
              <img v-if="attr.imageUrl" :src="attr.imageUrl" class="w-full h-full object-cover" />
            </div>
            <div class="p-2">
              <p class="text-sm font-semibold truncate">{{ attr.name }}</p>
              <p class="text-xs text-text-secondary">{{ attr.area }}</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay as SwiperAutoplay } from 'swiper/modules'
import 'swiper/css'
import { useContentApi } from '~/api/content-api'

const contentApi = useContentApi()
const attractions = ref<any[]>([])

onMounted(async () => {
  try {
    const res: any = await contentApi.attractions()
    attractions.value = res.data || []
  } catch {
    attractions.value = []
  }
})
</script>