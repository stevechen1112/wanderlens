<template>
  <WlSkipLink />
  <el-container class="h-screen">
    <!-- Header -->
    <el-header class="flex items-center justify-between bg-white border-b" style="height: 50px" role="banner">
      <div class="flex items-center gap-3">
        <el-button :icon="Fold" text :aria-label="t('a11y.toggleSidebar')" data-testid="sidebar-toggle" @click="toggleSidebar" />
        <span class="text-lg font-bold" style="color: var(--wl-primary)">WanderLens</span>
        <span class="text-sm text-gray-500">{{ workspaceLabel }}</span>
      </div>
      <div class="flex items-center gap-3">
        <WlLangSwitcher />
        <el-dropdown trigger="click">
        <button type="button" class="flex items-center gap-2 cursor-pointer border-0 bg-transparent p-0" :aria-label="t('a11y.userMenu')">
          <el-avatar :size="32" :src="authStore.avatar" />
          <span class="text-sm">{{ authStore.username }}</span>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$router.push('/profile')">{{ t('nav.profile') }}</el-dropdown-item>
            <el-dropdown-item @click="$router.push('/change-password')">{{ t('nav.changePassword') }}</el-dropdown-item>
            <el-dropdown-item divided @click="logout">{{ t('nav.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- Sidebar -->
      <el-aside :width="sidebarWidth" class="sidebar" role="navigation" :aria-label="t('a11y.mainNav')">
        <el-menu :default-active="$route.path" router :collapse="isCollapse">
          <el-menu-item index="/account">
            <el-icon><User /></el-icon>
            <template #title>{{ authStore.isStylist ? t('nav.stylistAccount') : t('nav.account') }}</template>
          </el-menu-item>
          <el-menu-item index="/my-order">
            <el-icon><List /></el-icon>
            <template #title>{{ t('nav.myOrder') }}</template>
          </el-menu-item>
          <el-menu-item v-if="authStore.isPhotographer" index="/raw-upload">
            <el-icon><Upload /></el-icon>
            <template #title>{{ t('nav.rawUpload') }}</template>
          </el-menu-item>
          <el-menu-item v-if="authStore.isStylist" index="/stylist-schedule">
            <el-icon><Calendar /></el-icon>
            <template #title>{{ t('nav.stylistSchedule') }}</template>
          </el-menu-item>
          <el-menu-item index="/earnings">
            <el-icon><Money /></el-icon>
            <template #title>{{ t('nav.earnings') }}</template>
          </el-menu-item>
          <el-menu-item index="/conversations">
            <el-icon><ChatDotRound /></el-icon>
            <template #title>{{ t('nav.conversations') }}</template>
          </el-menu-item>
          <el-menu-item index="/notifications">
            <el-icon><Bell /></el-icon>
            <template #title>{{ t('nav.notifications') }}</template>
          </el-menu-item>
          <el-menu-item index="/terms">
            <el-icon><Document /></el-icon>
            <template #title>{{ t('nav.terms') }}</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Main -->
      <el-container>
        <el-main id="main-content" class="bg-gray-50" role="main" tabindex="-1">
          <!-- 麵包屑導航 -->
          <el-breadcrumb :separator-icon="ArrowRight" class="mb-4">
            <el-breadcrumb-item :to="{ path: '/account' }">{{ t('nav.home') }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>

          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
        <el-footer class="text-center text-xs text-gray-400" style="height: 50px; background: var(--wl-footer-bg); color: white; line-height: 50px">
          WanderLens Copyright © 2026
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Fold, User, List, ChatDotRound, Bell, Upload, Money, Calendar, Document, ArrowRight } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import WlLangSwitcher from '@/components/WlLangSwitcher.vue'
import WlSkipLink from '@/components/WlSkipLink.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

const sidebarWidth = computed(() => (isCollapse.value ? '64px' : '200px'))
const workspaceLabel = computed(() =>
  authStore.isStylist ? t('workspace.stylist') : t('workspace.photographer'),
)

const PAGE_TITLES: Record<string, string> = {
  '/account': 'nav.account',
  '/my-order': 'nav.myOrder',
  '/raw-upload': 'nav.rawUpload',
  '/stylist-schedule': 'nav.stylistSchedule',
  '/earnings': 'nav.earnings',
  '/conversations': 'nav.conversations',
  '/notifications': 'nav.notifications',
  '/terms': 'nav.terms',
  '/profile': 'nav.profile',
  '/change-password': 'nav.changePassword',
}

const currentPageTitle = computed(() => {
  const path = route.path
  const key = PAGE_TITLES[path]
  if (key) return t(key)
  if (path.startsWith('/my-order/')) return t('nav.orderDetail')
  if (path.startsWith('/conversations/')) return t('nav.conversationRoom')
  return ''
})

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const syncSidebarForViewport = () => {
  if (typeof window !== 'undefined') {
    isCollapse.value = window.innerWidth < 768
  }
}

onMounted(() => {
  syncSidebarForViewport()
  window.addEventListener('resize', syncSidebarForViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', syncSidebarForViewport)
})

const logout = () => {
  authStore.clearAuth()
  router.push('/login')
}
</script>