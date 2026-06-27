<template>
  <div class="wl-container py-20 text-center">
    <p class="text-6xl mb-4">🔍</p>
    <h1 class="text-2xl font-bold mb-2">404</h1>
    <p class="text-text-secondary mb-6">{{ $t('error.notFound') }}</p>
    <NuxtLink to="/" class="wl-btn-primary inline-block">{{ $t('common.backHome') }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
</script>