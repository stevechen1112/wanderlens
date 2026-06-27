<template>
  <el-config-provider :locale="elementLocale">
    <router-view v-slot="{ Component }">
      <component :is="Component" :key="$route.fullPath" />
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getElementLocale } from '@/i18n'

const { locale } = useI18n()
const elementLocale = computed(() => getElementLocale(locale.value))
</script>
