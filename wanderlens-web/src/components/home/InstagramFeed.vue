<template>
  <section class="py-12 wl-container">
    <h2 class="text-2xl font-bold text-center mb-8">{{ $t('home.instagram') }}</h2>
    <Swiper :modules="[SwiperAutoplay]" :autoplay="{ delay: 4000 }" :slides-per-view="6" :space-between="12">
      <SwiperSlide v-for="post in posts" :key="post.id">
        <a :href="post.igUrl" target="_blank" class="block aspect-square rounded-lg overflow-hidden">
          <img v-if="post.imageUrl" :src="post.imageUrl" class="w-full h-full object-cover" />
        </a>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay as SwiperAutoplay } from 'swiper/modules'
import 'swiper/css'
import { useContentApi } from '~/api/content-api'

const contentApi = useContentApi()
const posts = ref<any[]>([])

onMounted(async () => {
  try {
    const res: any = await contentApi.instagram()
    posts.value = res.data || []
  } catch {
    posts.value = []
  }
})
</script>