<template>
  <el-select
    :model-value="locale"
    size="small"
    style="width: 96px"
    :aria-label="t('a11y.language')"
    @change="onChange"
  >
    <el-option label="中文" value="zh" />
    <el-option label="EN" value="en" />
  </el-select>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

const { locale, t } = useI18n()

function onChange(val: 'zh' | 'en') {
  setLocale(val)
}
</script>
