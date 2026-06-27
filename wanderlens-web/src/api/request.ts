import axios, { type AxiosInstance } from 'axios'

let apiInstance: AxiosInstance | null = null

function getAcceptLanguage(): string {
  if (import.meta.client) {
    return localStorage.getItem('wl_lang') || 'zh'
  }
  return 'zh'
}

function createApiInstance(): AxiosInstance {
  const config = useRuntimeConfig()

  const instance = axios.create({
    baseURL: config.public.apiBase,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use(
    (request) => {
      if (import.meta.client) {
        const token = localStorage.getItem('wl_token')
        if (token) {
          request.headers.Authorization = `Bearer ${token}`
        }
      }
      request.headers['Accept-Language'] = getAcceptLanguage()
      return request
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response) => {
      const body = response.data
      if (body && typeof body === 'object' && 'code' in body && body.code !== '200') {
        const err = new Error(body.message || '請求失敗') as Error & { code?: string; data?: unknown }
        err.code = body.code
        err.data = body.data
        return Promise.reject(err)
      }
      return body
    },
    async (error) => {
      if (error.response?.status === 401) {
        if (import.meta.client) {
          localStorage.removeItem('wl_token')
          localStorage.removeItem('wl_user_id')
          try {
            const { useAuthStore } = await import('~/stores/auth')
            const authStore = useAuthStore()
            authStore.clearAuth()
          } catch {
            // store 尚未初始化時忽略
          }
          navigateTo('/login?redirect=' + encodeURIComponent(window.location.pathname))
        }
      }
      return Promise.reject(error)
    },
  )

  return instance
}

export const useApi = (): AxiosInstance => {
  if (!apiInstance) {
    apiInstance = createApiInstance()
  }
  return apiInstance
}
