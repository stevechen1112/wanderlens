<template>
  <section class="relative h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden">
    <!-- ?�設?�景（無 banner ?�顯示�? -->
    <div v-if="banners.length === 0" class="absolute inset-0 wl-gradient-warm flex items-center justify-center">
      <div class="text-center text-white px-4">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">WanderLens</h1>
        <p class="text-xl md:text-2xl font-light mb-8 opacity-90">精彩時刻，攝影隨行</p>
                <div class="flex gap-3">
                  <NuxtLink to="/booking" class="wl-btn-primary !px-8 !py-3.5 !text-base">
                    {{ $t('home.bookNow') }}
                  </NuxtLink>
                  <NuxtLink to="/photographer-list" class="px-8 py-3.5 rounded-xl text-base font-semibold border-2 border-white text-white hover:bg-white hover:text-primary transition-all">
                    {{ $t('home.explore') }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- 向下滾動提示 -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
      <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay as SwiperAutoplay, Pagination as SwiperPagination, EffectFade as SwiperEffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { useContentApi } from '~/api/content-api'

const contentApi = useContentApi()
const banners = ref<any[]>([])

onMounted(async () => {
  try {
    const res: any = await contentApi.bannersByType('homepage_hero')
    banners.value = res.data || []
  } catch {
    banners.value = []
  }
})
</script>

<style scoped>
:deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.5;
}
:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #F37A69;
}
</style>