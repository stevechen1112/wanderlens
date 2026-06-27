import { defineStore } from 'pinia'

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
  },

  actions: {
    setAuth(token: string, userId: number, empno: string, username: string, role: string, avatar: string) {
      this.token = token
      this.userId = userId
      this.empno = empno
      this.username = username
      this.role = role
      this.avatar = avatar
      localStorage.setItem('wl_provider_token', token)
      localStorage.setItem('wl_user_id', String(userId))
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
      localStorage.removeItem('wl_provider_type')
    },
  },
})