<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <p class="text-6xl font-extrabold text-primary mb-2">{{ statusCode }}</p>
      <h1 class="text-2xl font-bold mb-2">{{ title }}</h1>
      <p class="text-text-secondary mb-6">{{ description }}</p>
      <NuxtLink to="/" class="wl-btn-primary inline-block">{{ $t('common.backHome') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; message?: string } }>()
const { t } = useI18n()

const statusCode = computed(() => props.error?.statusCode || 500)
const title = computed(() =>
  statusCode.value === 404 ? t('error.notFound') : t('error.serverError')
)
const description = computed(() => props.error?.message || t('error.defaultDesc'))
</script>
