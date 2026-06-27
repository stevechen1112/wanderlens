import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    userId: null as number | null,
    companyName: '' as string,
    username: '' as string,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setAuth(token: string, userId: number, companyName: string, username: string) {
      this.token = token
      this.userId = userId
      this.companyName = companyName
      this.username = username
      localStorage.setItem('wl_retouch_token', token)
      localStorage.setItem('wl_retouch_user_id', String(userId))
      localStorage.setItem('wl_retouch_company', companyName)
      localStorage.setItem('wl_retouch_username', username)
    },
    restoreAuth() {
      const token = localStorage.getItem('wl_retouch_token')
      const userId = localStorage.getItem('wl_retouch_user_id')
      const company = localStorage.getItem('wl_retouch_company')
      const username = localStorage.getItem('wl_retouch_username')
      if (token) {
        this.token = token
        this.userId = userId ? Number(userId) : null
        this.companyName = company || '修圖公司'
        this.username = username || ''
      }
    },
    clearAuth() {
      this.token = ''
      this.userId = null
      this.companyName = ''
      this.username = ''
      localStorage.removeItem('wl_retouch_token')
      localStorage.removeItem('wl_retouch_user_id')
      localStorage.removeItem('wl_retouch_company')
      localStorage.removeItem('wl_retouch_username')
    },
  },
})