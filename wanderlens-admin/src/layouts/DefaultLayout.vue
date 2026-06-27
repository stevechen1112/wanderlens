<template>
  <WlSkipLink />
  <el-container class="h-screen">
    <el-header class="flex items-center justify-between bg-white border-b" style="height: 50px" role="banner">
      <div class="flex items-center gap-3">
        <el-button :icon="Fold" text :aria-label="t('a11y.toggleSidebar')" data-testid="sidebar-toggle" @click="isCollapse = !isCollapse" />
        <span class="text-lg font-bold" style="color: var(--wl-primary)">WanderLens Admin</span>
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
      <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar" role="navigation" :aria-label="t('a11y.mainNav')">
        <el-menu :default-active="$route.path" router :collapse="isCollapse">
          <el-menu-item index="/dashboard"><el-icon><DataAnalysis /></el-icon><template #title>{{ t('nav.dashboard') }}</template></el-menu-item>
          <el-sub-menu index="users-group">
            <template #title><el-icon><User /></el-icon><span>{{ t('nav.usersGroup') }}</span></template>
            <el-menu-item index="/users">{{ t('nav.users') }}</el-menu-item>
            <el-menu-item index="/roles">{{ t('nav.roles') }}</el-menu-item>
            <el-menu-item index="/menus">{{ t('nav.menus') }}</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="provider-group">
            <template #title><el-icon><Camera /></el-icon><span>{{ t('nav.providerGroup') }}</span></template>
            <el-menu-item index="/photographers">{{ t('nav.photographers') }}</el-menu-item>
            <el-menu-item index="/photographers/dashboard">{{ t('nav.scheduleDashboard') }}</el-menu-item>
            <el-menu-item index="/photographers/broadcast">{{ t('nav.lineBroadcast') }}</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/customers"><el-icon><UserFilled /></el-icon><template #title>{{ t('nav.customers') }}</template></el-menu-item>
          <el-sub-menu index="order-group">
            <template #title><el-icon><Document /></el-icon><span>{{ t('nav.orderGroup') }}</span></template>
            <el-menu-item index="/orders">{{ t('nav.orders') }}</el-menu-item>
            <el-menu-item index="/match/monitor">{{ t('nav.matchMonitor') }}</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="media-group">
            <template #title><el-icon><Picture /></el-icon><span>{{ t('nav.mediaGroup') }}</span></template>
            <el-menu-item index="/media/verify">{{ t('nav.rawVerify') }}</el-menu-item>
            <el-menu-item index="/media/ai-monitor">{{ t('nav.aiMonitor') }}</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="finance-group">
            <template #title><el-icon><Money /></el-icon><span>{{ t('nav.financeGroup') }}</span></template>
            <el-menu-item index="/finance/ledger">{{ t('nav.ledger') }}</el-menu-item>
            <el-menu-item index="/finance/payout">{{ t('nav.payout') }}</el-menu-item>
            <el-menu-item index="/finance/refund">{{ t('nav.refund') }}</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="support-group">
            <template #title><el-icon><Service /></el-icon><span>{{ t('nav.supportGroup') }}</span></template>
            <el-menu-item index="/support/dispute">{{ t('nav.disputes') }}</el-menu-item>
            <el-menu-item index="/support/chat">{{ t('nav.supportChat') }}</el-menu-item>
            <el-menu-item index="/support/conversation">{{ t('nav.conversationAudit') }}</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/campaign/coupons"><el-icon><Ticket /></el-icon><template #title>{{ t('nav.coupons') }}</template></el-menu-item>
          <el-menu-item index="/affiliate"><el-icon><UserFilled /></el-icon><template #title>{{ t('nav.affiliate') }}</template></el-menu-item>
          <el-menu-item index="/affiliate/report"><el-icon><TrendCharts /></el-icon><template #title>{{ t('nav.affiliateReport') }}</template></el-menu-item>
          <el-menu-item index="/analytics/market-signals"><el-icon><TrendCharts /></el-icon><template #title>{{ t('nav.marketSignals') }}</template></el-menu-item>
          <el-menu-item index="/notifications"><el-icon><Bell /></el-icon><template #title>{{ t('nav.notifications') }}</template></el-menu-item>
          <el-sub-menu index="content-group">
            <template #title><el-icon><Files /></el-icon><span>{{ t('nav.contentGroup') }}</span></template>
            <el-menu-item index="/content/banners">{{ t('nav.banners') }}</el-menu-item>
            <el-menu-item index="/content/news">{{ t('nav.news') }}</el-menu-item>
            <el-menu-item index="/content/faqs">{{ t('nav.faqs') }}</el-menu-item>
            <el-menu-item index="/content/attractions">{{ t('nav.attractions') }}</el-menu-item>
            <el-menu-item index="/content/instagram">{{ t('nav.instagram') }}</el-menu-item>
            <el-menu-item index="/content/public-consent">{{ t('nav.publicConsent') }}</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="settings-group">
            <template #title><el-icon><Setting /></el-icon><span>{{ t('nav.settingsGroup') }}</span></template>
            <el-menu-item index="/settings/areas">{{ t('nav.areas') }}</el-menu-item>
            <el-menu-item index="/settings/services">{{ t('nav.services') }}</el-menu-item>
            <el-menu-item index="/dic">{{ t('nav.dictionary') }}</el-menu-item>
            <el-menu-item index="/flows">{{ t('nav.appFlows') }}</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main id="main-content" class="bg-gray-50" role="main" tabindex="-1">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
        <el-footer style="height: 40px; background: var(--wl-footer-bg); color: white; line-height: 40px; text-align: center; font-size: 12px">
          WanderLens Admin © 2026
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Fold, DataAnalysis, User, Camera, UserFilled, Document, Picture, Money, Service, Ticket, Files, Setting, TrendCharts, Bell } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import WlLangSwitcher from '@/components/WlLangSwitcher.vue'
import WlSkipLink from '@/components/WlSkipLink.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const isCollapse = ref(false)

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
