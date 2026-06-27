<template>
  <section class="py-12 bg-primary-light">
    <div class="wl-container">
      <h2 class="text-2xl font-bold text-center mb-8">{{ $t('home.howItWorks') }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div v-for="(step, i) in steps" :key="i" class="text-center">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {{ i + 1 }}
          </div>
          <h3 class="text-sm font-semibold">{{ $t(`home.steps.${step}`) }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = ['selectType', 'configure', 'timeLocation', 'selectProvider', 'checkout']
</script>