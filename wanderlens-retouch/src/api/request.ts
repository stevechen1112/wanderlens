import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const request = axios.create({ baseURL: '/api', timeout: 10000 })

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('wl_retouch_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 清除 Pinia auth store 與 localStorage，避免殘留過期認證狀態
      try {
        const authStore = useAuthStore()
        authStore.clearAuth()
      } catch {
        // Pinia 尚未初始化時 fallback 手動清除
        localStorage.removeItem('wl_retouch_token')
        localStorage.removeItem('wl_retouch_user_id')
        localStorage.removeItem('wl_retouch_company')
        localStorage.removeItem('wl_retouch_username')
      }
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request