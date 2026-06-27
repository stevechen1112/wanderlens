<template>
  <div class="wl-container py-8 max-w-3xl">
    <div class="text-center mb-10">
      <span class="wl-badge wl-badge-primary mb-3">幫助中心</span>
      <h1 class="text-3xl font-extrabold text-text-primary">{{ $t('faq.title') }}</h1>
      <p class="text-text-secondary mt-2">以下是常見問題，若無法解決您的疑問，歡迎聯繫客服</p>
    </div>

    <!-- 載入骨架 -->
    <div v-if="loading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="wl-card p-5">
        <div class="wl-skeleton wl-skeleton-text !w-3/4" />
        <div class="wl-skeleton wl-skeleton-text-sm !w-full mt-2" />
      </div>
    </div>

    <!-- FAQ 列表 -->
    <div v-else class="space-y-3">
      <details v-for="(faq, idx) in faqs" :key="faq.id" class="wl-card group" :class="'wl-animate-in wl-stagger-' + Math.min(idx + 1, 4)">
        <summary class="p-5 font-bold cursor-pointer flex items-center justify-between gap-3 select-none">
          <span class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center text-sm font-extrabold shrink-0">Q</span>
            {{ faq.question }}
          </span>
          <svg class="w-5 h-5 text-text-secondary shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </summary>
        <div class="px-5 pb-5 pl-16 text-text-regular text-sm leading-relaxed">
          {{ faq.answer }}
        </div>
      </details>
    </div>

    <!-- 空狀態 -->
    <div v-if="!loading && faqs.length === 0" class="wl-empty">
      <div class="wl-empty-icon">❓</div>
      <div class="wl-empty-title">尚無常見問題</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContentApi } from '~/api/content-api'

const contentApi = useContentApi()
const faqs = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res: any = await contentApi.faqs()
    faqs.value = res.data || []
  } catch {
    faqs.value = []
  } finally {
    loading.value = false
  }
})
</script>