<template>
  <section class="py-12 wl-container">
    <h2 class="text-2xl font-bold text-center mb-8">{{ $t('home.about') }}</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div v-for="feature in features" :key="feature.key" class="text-center">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary-light flex items-center justify-center">
          <span class="text-2xl">{{ feature.icon }}</span>
        </div>
        <h3 class="font-semibold mb-1">{{ $t(`home.features.${feature.key}`) }}</h3>
        <p class="text-sm text-text-secondary">{{ $t(`home.features.${feature.key}Desc`) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  { key: 'value', icon: '💰' },
  { key: 'flexible', icon: '📅' },
  { key: 'efficient', icon: '⚡' },
  { key: 'fast', icon: '🚀' },
]
</script>
