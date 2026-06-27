<template>
  <el-container class="h-screen">
    <el-header class="flex items-center justify-between bg-white border-b" style="height: 50px">
      <div class="flex items-center gap-3">
        <el-button :icon="Fold" text @click="isCollapse = !isCollapse" />
        <span class="text-lg font-bold" style="color: var(--wl-primary)">WanderLens</span>
        <span class="text-sm text-gray-500">修圖</span>
      </div>
      <el-dropdown>
        <span class="flex items-center gap-2 cursor-pointer">
          <span class="text-sm">{{ authStore.username || '修圖公司' }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
        <el-menu :default-active="$route.path" router :collapse="isCollapse">
          <el-menu-item index="/jobs">
            <el-icon><List /></el-icon>
            <template #title>工單列表</template>
          </el-menu-item>
          <el-menu-item index="/spec">
            <el-icon><Document /></el-icon>
            <template #title>修圖規範</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main class="bg-gray-50">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
        <el-footer class="text-center text-xs" style="height: 40px; line-height: 40px; color: #999">
          WanderLens 修圖工單 © 2026
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Fold, List, Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isCollapse = ref(false)

const logout = () => {
  authStore.clearAuth()
  router.push('/login')
}
</script>