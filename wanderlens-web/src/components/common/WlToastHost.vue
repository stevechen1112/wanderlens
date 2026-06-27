<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-[10000] flex flex-col gap-2 pointer-events-none">
      <div
        v-for="item in toasts"
        :key="item.id"
        :class="['wl-toast pointer-events-auto', `wl-toast-${item.type}`]"
        role="status"
      >
        <span>{{ toastIcon(item.type) }}</span>
        <span>{{ item.message }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '~/composables/useToast'

const { toasts } = useToast()

function toastIcon(type: ToastType) {
  if (type === 'success') return '✓'
  if (type === 'error') return '✕'
  if (type === 'warning') return '⚠'
  return 'ℹ'
}
</script>
