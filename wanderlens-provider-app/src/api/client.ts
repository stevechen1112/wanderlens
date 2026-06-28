import axios, { type AxiosInstance } from 'axios'
import * as secureStorage from '@/utils/secureStorage'
import { useAuthStore, isClearingAuth } from '@/stores/authStore'

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:8080/api'

const client: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

client.interceptors.request.use(async (config) => {
  const token = await secureStorage.getItemAsync(secureStorage.TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => {
    // 先檢查 HTTP status，非 2xx 一律視為錯誤（防止 proxy/502 回 HTML 被靜默吞掉）
    if (response.status < 200 || response.status >= 300) {
      const err: Error & { response?: { data: unknown; status: number } } = new Error('請求失敗')
      err.response = { data: response.data, status: response.status }
      return Promise.reject(err)
    }
    const data = response.data
    if (data && typeof data === 'object' && 'code' in data && data.code !== '200' && data.code !== 200) {
      const err: Error & { response?: { data: unknown; status: number } } = new Error(
        (data as { message?: string }).message || '請求失敗',
      )
      err.response = { data, status: Number((data as { code?: string }).code) || 400 }
      return Promise.reject(err)
    }
    return data
  },
  async (error) => {
    if (error.response?.status === 401 && !isClearingAuth()) {
      const url = String(error.config?.url || '')
      if (url.includes('/match/offline')) {
        return Promise.reject(error)
      }
      try {
        const authStore = useAuthStore.getState()
        if (!authStore.isAuthenticated) {
          return Promise.reject(error)
        }
        await authStore.clearAuth()
      } catch {
        // store 可能未初始化
      }
    }
    return Promise.reject(error)
  },
)

export default client
