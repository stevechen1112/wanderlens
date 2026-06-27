import { defineStore } from 'pinia'
import api from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    userId: null as number | null,
    empno: '' as string,
    username: '' as string,
    role: '' as string,
    avatar: '' as string,
    providerId: null as number | null,
    providerType: 'PHOTOGRAPHER' as string,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isStylist: (state) => state.providerType === 'STYLIST',
    isPhotographer: (state) => state.providerType === 'PHOTOGRAPHER' || !state.providerType,
    /** 供給方 API 應使用 provider.id，非 user.id */
    resolvedProviderId: (state) => state.providerId ?? state.userId,
  },

  actions: {
    setAuth(
      token: string,
      userId: number,
      empno: string,
      username: string,
      role: string,
      avatar: string,
      providerId?: number | null,
    ) {
      this.token = token
      this.userId = userId
      this.empno = empno
      this.username = username
      this.role = role
      this.avatar = avatar
      this.providerId = providerId ?? null
      localStorage.setItem('wl_provider_token', token)
      localStorage.setItem('wl_user_id', String(userId))
      if (providerId != null) {
        localStorage.setItem('wl_provider_id', String(providerId))
      } else {
        localStorage.removeItem('wl_provider_id')
      }
    },

    restoreFromStorage() {
      this.token = localStorage.getItem('wl_provider_token') || ''
      const uid = localStorage.getItem('wl_user_id')
      const pid = localStorage.getItem('wl_provider_id')
      this.userId = uid ? Number(uid) : null
      this.providerId = pid ? Number(pid) : null
      this.providerType = localStorage.getItem('wl_provider_type') || 'PHOTOGRAPHER'
    },

    async refreshSession() {
      if (!this.token) return
      try {
        const res: any = await api.me()
        if (res.data?.userId) {
          this.setAuth(
            this.token,
            res.data.userId,
            res.data.empno,
            res.data.username,
            res.data.role,
            res.data.avatar,
            res.data.providerId,
          )
        }
      } catch {
        /* 靜默 */
      }
    },

    setUsername(username: string) {
      this.username = username
    },

    setAvatar(avatar: string) {
      this.avatar = avatar
    },

    setProviderType(providerType: string) {
      this.providerType = providerType || 'PHOTOGRAPHER'
      localStorage.setItem('wl_provider_type', this.providerType)
    },

    clearAuth() {
      this.token = ''
      this.userId = null
      this.empno = ''
      this.username = ''
      this.role = ''
      this.avatar = ''
      this.providerId = null
      localStorage.removeItem('wl_provider_token')
      localStorage.removeItem('wl_user_id')
      localStorage.removeItem('wl_provider_id')
      localStorage.removeItem('wl_provider_type')
    },
  },
})
