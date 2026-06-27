<template>
  <WlSkipLink />
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main id="main-content" class="flex-1" tabindex="-1">
      <slot />
    </main>
    <AppFooter />
    <GoTop />
    <CookieConsent />
  </div>
</template>

<script setup lang="ts">
// 預設佈局：Header + Main + Footer + GoTop + CookieConsent
</script>