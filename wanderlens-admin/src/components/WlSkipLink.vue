<template>
  <a href="#main-content" class="wl-skip-link" data-testid="skip-to-main">
    {{ t('a11y.skipToMain') }}
  </a>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
