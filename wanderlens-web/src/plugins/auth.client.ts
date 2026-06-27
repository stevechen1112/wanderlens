/**
 * Auth 初始化 plugin — 在客戶端啟動時從 cookie/localStorage 還原認證狀態
 */
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const authStore = useAuthStore()
    // 優先從 cookie 讀取（SSR 也用 cookie）
    const tokenCookie = useCookie('wl_token')
    const token = tokenCookie.value || localStorage.getItem('wl_token')
    const userId = localStorage.getItem('wl_user_id')

    if (token && userId) {
      authStore.setToken(token)
      authStore.setUserId(Number(userId))
      // 非同步載入使用者資訊
      authStore.fetchUser().catch(() => {
        // token 可能已過期，清除
        localStorage.removeItem('wl_token')
        localStorage.removeItem('wl_user_id')
        tokenCookie.value = null
        authStore.clearAuth()
      })
    }
  }
})