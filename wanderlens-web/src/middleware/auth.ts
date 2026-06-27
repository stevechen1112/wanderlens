/**
 * 認證中介層 — 保護需要登入的頁面
 *
 * 使用方式：在頁面元件中加入 definePageMeta({ middleware: 'auth' })
 * 使用 useCookie 確保 SSR 也能讀取 token，避免受保護內容在 SSR HTML 中洩漏
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 使用 useCookie 讓 SSR 和客戶端都能讀取
  const token = useCookie('wl_token')
  if (!token.value) {
    return navigateTo('/login?redirect=' + encodeURIComponent(to.path))
  }
})