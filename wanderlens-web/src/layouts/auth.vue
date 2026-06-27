<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <header class="sticky top-0 z-50 wl-surface border-b border-border">
      <div class="wl-container-wide flex items-center justify-between h-14">
        <WlLogo size="sm" />
        <nav class="flex items-center gap-3 text-sm">
          <LanguageSwitcher />
          <NuxtLink to="/login" class="wl-btn-ghost">{{ $t('nav.login') }}</NuxtLink>
          <NuxtLink to="/register" class="wl-btn-primary !py-2 !px-4">{{ $t('auth.register') }}</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <CookieConsent />
  </div>
</template>

<script setup lang="ts">
// 無 Header / Footer 的登入佈局
</script>
