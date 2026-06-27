<template>
  <header class="sticky top-0 z-50 wl-glass shadow-sm" role="banner">
    <div class="wl-container-wide flex items-center justify-between h-16">
      <div class="flex items-center gap-2 shrink-0 min-w-0">
        <button
          type="button"
          class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-white dark:bg-[#171F27] dark:border-[#2C353F] text-text-secondary"
          :aria-label="mobileNavOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
          :aria-expanded="mobileNavOpen"
          :aria-controls="mobileNavOpen ? 'mobile-nav-panel' : undefined"
          data-testid="mobile-nav-toggle"
          @click="toggleMobileNav"
        >
          <svg v-if="!mobileNavOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <WlLogo size="md" />
        <NuxtLink
          v-if="isPhotographerDetail"
          to="/photographer-list"
          class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary transition-colors whitespace-nowrap"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          {{ $t('nav.backToList') }}
        </NuxtLink>
      </div>

      <div v-if="showHeaderSearch" class="hidden lg:flex flex-1 max-w-2xl mx-8">
        <CompactSearchBar />
      </div>

      <button
        v-if="showHeaderSearch"
        class="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-white dark:bg-[#171F27] dark:border-[#2C353F] text-sm text-text-secondary"
        @click="mobileSearchOpen = !mobileSearchOpen"
        :aria-label="$t('search.searchBtn')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <span class="hidden xs:inline">{{ $t('search.searchShort') }}</span>
      </button>

      <div class="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
        <nav class="hidden md:flex items-center gap-1" :aria-label="$t('nav.mainNav')">
          <NuxtLink to="/photographer-list" class="wl-btn-ghost text-sm">{{ $t('nav.photographers') }}</NuxtLink>
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/albums" class="wl-btn-ghost text-sm">{{ $t('nav.albums') }}</NuxtLink>
            <NuxtLink to="/conversations" class="wl-btn-ghost text-sm relative" :aria-label="unreadCount > 0 ? $t('nav.unreadMessages', { count: unreadCount }) : undefined">
              {{ $t('nav.conversations') }}
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold" aria-hidden="true">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </NuxtLink>
            <div class="relative" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
              <button
                type="button"
                class="flex items-center gap-2 wl-btn-ghost text-sm"
                :aria-expanded="showMenu"
                :aria-label="$t('nav.userMenu')"
                aria-haspopup="true"
              >
                <div class="w-7 h-7 rounded-full wl-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {{ authStore.user?.username?.charAt(0) || '?' }}
                </div>
                <span class="hidden xl:inline">{{ authStore.user?.username }}</span>
                <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <Transition name="fade">
                <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-[#171F27] rounded-xl shadow-xl border border-border overflow-hidden z-50">
                  <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-bg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    {{ $t('nav.profile') }}
                  </NuxtLink>
                  <NuxtLink to="/orders" class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-bg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    {{ $t('nav.orders') }}
                  </NuxtLink>
                  <NuxtLink to="/albums" class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-bg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    {{ $t('nav.albums') }}
                  </NuxtLink>
                  <div class="border-t border-border" />
                  <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-bg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    {{ $t('nav.logout') }}
                  </button>
                </div>
              </Transition>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="wl-btn-ghost text-sm">{{ $t('nav.login') }}</NuxtLink>
            <NuxtLink to="/register" class="wl-btn-primary text-sm !py-2 !px-4">{{ $t('auth.register') }}</NuxtLink>
          </template>
        </nav>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showHeaderSearch && mobileSearchOpen" class="lg:hidden px-4 pb-3 border-t border-border pt-3">
        <CompactSearchBar @searched="mobileSearchOpen = false" />
      </div>
    </Transition>

  </header>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="mobileNavOpen"
        class="md:hidden fixed inset-0 z-[60] flex"
        data-testid="mobile-nav-drawer"
      >
        <button
          type="button"
          class="flex-1 bg-black/40"
          :aria-label="$t('nav.closeMenu')"
          @click="closeMobileNav"
        />
        <nav
          id="mobile-nav-panel"
          class="w-[min(20rem,85vw)] h-full bg-white dark:bg-[#171F27] border-l border-border shadow-xl flex flex-col p-4 overflow-y-auto"
          :aria-label="$t('nav.mainNav')"
        >
          <div class="flex items-center justify-between mb-6">
            <span class="text-sm font-semibold text-text-secondary">{{ $t('nav.menuTitle') }}</span>
            <button type="button" class="wl-btn-ghost !p-2" :aria-label="$t('nav.closeMenu')" @click="closeMobileNav">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <NuxtLink to="/photographer-list" class="mobile-nav-link" @click="closeMobileNav">
            {{ $t('nav.photographers') }}
          </NuxtLink>

          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/orders" class="mobile-nav-link" @click="closeMobileNav">
              {{ $t('nav.orders') }}
            </NuxtLink>
            <NuxtLink to="/albums" class="mobile-nav-link" @click="closeMobileNav">
              {{ $t('nav.albums') }}
            </NuxtLink>
            <NuxtLink to="/conversations" class="mobile-nav-link flex items-center justify-between" @click="closeMobileNav">
              <span>{{ $t('nav.conversations') }}</span>
              <span v-if="unreadCount > 0" class="min-w-[1.25rem] h-5 px-1 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </NuxtLink>
            <NuxtLink to="/profile" class="mobile-nav-link" @click="closeMobileNav">
              {{ $t('nav.profile') }}
            </NuxtLink>
            <div class="border-t border-border my-3" />
            <button type="button" class="mobile-nav-link text-danger text-left w-full" @click="handleLogoutMobile">
              {{ $t('nav.logout') }}
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="mobile-nav-link" @click="closeMobileNav">
              {{ $t('nav.login') }}
            </NuxtLink>
            <NuxtLink to="/register" class="mobile-nav-link wl-btn-primary text-center mt-2" @click="closeMobileNav">
              {{ $t('auth.register') }}
            </NuxtLink>
          </template>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useHomeHeader } from '~/composables/useHomeHeader'

const authStore = useAuthStore()
const route = useRoute()
const { heroPassed } = useHomeHeader()
const showMenu = ref(false)
const unreadCount = ref(0)
const mobileSearchOpen = ref(false)
const mobileNavOpen = ref(false)

const isHome = computed(() => route.path === '/')
const isPhotographerDetail = computed(() => /^\/photographer\/.+/.test(route.path))
const isPhotographerList = computed(() => route.path === '/photographer-list')
const showHeaderSearch = computed(() => {
  if (isPhotographerDetail.value || isPhotographerList.value) return false
  return !isHome.value || heroPassed.value
})

const closeMobileNav = () => {
  mobileNavOpen.value = false
}

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value
  if (mobileNavOpen.value) {
    mobileSearchOpen.value = false
  }
}

watch(() => route.path, () => {
  mobileSearchOpen.value = false
  mobileNavOpen.value = false
})

const onGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  mobileNavOpen.value = false
  showMenu.value = false
  mobileSearchOpen.value = false
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})

const handleLogout = () => {
  authStore.clearAuth()
  const tokenCookie = useCookie('wl_token')
  tokenCookie.value = null
  navigateTo('/')
}

const handleLogoutMobile = () => {
  closeMobileNav()
  handleLogout()
}
</script>

<style scoped>
.mobile-nav-link {
  @apply block px-4 py-3 rounded-xl text-sm font-medium text-text-primary hover:bg-bg dark:hover:bg-[#1E2730] transition-colors;
}
</style>
