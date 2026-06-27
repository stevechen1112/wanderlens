<template>
  <button
    type="button"
    class="text-sm border border-border rounded-lg px-3 py-1.5 bg-white dark:bg-[#171F27] dark:border-[#2C353F] dark:text-[#F3F4F6] hover:border-primary transition-colors"
    :aria-label="isDark ? $t('theme.light') : $t('theme.dark')"
    @click="toggle"
  >
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>

<script setup lang="ts">
import { useColorScheme } from '~/composables/useColorScheme'

const { isDark, toggle } = useColorScheme()
</script>
