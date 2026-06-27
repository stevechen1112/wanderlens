<template>
  <section class="py-12 bg-bg">
    <div class="wl-container text-center">
      <h2 class="text-2xl font-bold mb-4">{{ $t('home.recruitTitle') }}</h2>
      <p class="text-text-regular mb-6">{{ $t('home.recruitDesc') }}</p>
      <NuxtLink to="/providers/apply" class="wl-btn-secondary inline-block">
        {{ $t('home.joinUs') }}
      </NuxtLink>
      <div class="mt-6">
        <NuxtLink to="/faq" class="text-sm text-secondary hover:underline">{{ $t('nav.faq') }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>