<template>
  <div class="wl-container py-6 max-w-3xl">
    <h1 class="text-2xl font-bold mb-6">{{ $t('privacy.title') }}</h1>
    <div class="prose prose-sm max-w-none text-text-regular" v-html="$t('privacy.content')"></div>
  </div>
</template>

<script setup lang="ts">
</script>