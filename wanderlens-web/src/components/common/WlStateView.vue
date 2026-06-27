<template>
  <WlLoading v-if="status === 'loading'" :message="loadingMessage" />
  <WlError
    v-else-if="status === 'error'"
    :title="errorTitle"
    :message="errorMessage || $t('common.loadError')"
    retry
    @retry="$emit('retry')"
  />
  <WlEmpty v-else-if="status === 'empty'" :title="emptyTitle" :description="emptyDescription">
    <slot name="empty-action" />
  </WlEmpty>
  <slot v-else />
</template>

<script setup lang="ts">
defineProps<{
  status: 'loading' | 'error' | 'empty' | 'ready'
  loadingMessage?: string
  errorTitle?: string
  errorMessage?: string
  emptyTitle: string
  emptyDescription?: string
}>()

defineEmits<{ retry: [] }>()
</script>
