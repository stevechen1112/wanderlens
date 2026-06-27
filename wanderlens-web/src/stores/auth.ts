import { defineStore } from 'pinia'

interface User {
  userId: number
  empno: string
  username: string
  role: string
  avatar: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isConsumer: (state) => state.user?.role === 'CONSUMER',
    isProvider: (state) => state.user?.role === 'PHOTOGRAPHER' || state.user?.role === 'STYLIST',
  },

  actions: {
    setAuth(token: string, user: User) {
      this.token = token
      this.user = user
      if (import.meta.client) {
        localStorage.setItem('wl_token', token)
        localStorage.setItem('wl_user_id', String(user.userId))
      }
    },

    setToken(token: string) {
      this.token = token
    },

    setUserId(userId: number) {
      if (!this.user) {
        this.user = { userId, empno: '', username: '', role: '', avatar: '' }
      } else {
        this.user.userId = userId
      }
    },

    clearAuth() {
      this.token = ''
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem('wl_token')
        localStorage.removeItem('wl_user_id')
      }
    },

    async fetchUser() {
      if (!this.token) return
      try {
        const { useAuthApi } = await import('~/api/auth-api')
        const authApi = useAuthApi()
        const res: any = await authApi.me()
        if (res.data) {
          this.user = res.data
        }
      } catch {
        this.clearAuth()
      }
    },
  },
})