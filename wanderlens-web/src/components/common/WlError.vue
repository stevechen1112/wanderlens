<template>
  <div class="bg-danger/10 border border-danger/20 text-danger rounded-xl px-5 py-4 flex items-start gap-3">
    <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    <div>
      <p v-if="title" class="font-bold text-sm mb-1">{{ title }}</p>
      <p class="text-sm">{{ message }}</p>
      <button v-if="retry" @click="$emit('retry')" class="mt-3 text-sm font-semibold underline hover:no-underline">
        {{ $t('common.retry') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string; message: string; retry?: boolean }>()
defineEmits<{ retry: [] }>()
</script>
