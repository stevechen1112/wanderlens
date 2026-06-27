<template>
  <div class="flex flex-col items-center justify-center py-16 px-4" role="status">
    <svg class="animate-spin w-10 h-10 text-primary mb-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
    <p v-if="message" class="text-text-secondary text-sm">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>()
</script>
