import { create } from 'zustand'
import * as secureStorage from '@/utils/secureStorage'
import { unregisterPushNotifications } from '@/hooks/usePushNotifications'
import { authApi } from '@/api'

interface User {
  userId: number
  empno: string
  username: string
  role: string
  avatar: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (token: string, user: User) => Promise<void>
  clearAuth: () => Promise<void>
  restoreAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (token, user) => {
    await secureStorage.setItemAsync('wl_app_token', token)
    await secureStorage.setItemAsync('wl_app_user', JSON.stringify(user))
    await secureStorage.setItemAsync('wl_user_id', String(user.userId))
    set({ token, user, isAuthenticated: true, isLoading: false })
  },

  clearAuth: async () => {
    await unregisterPushNotifications('CONSUMER').catch(() => {})
    await secureStorage.deleteItemAsync('wl_app_token')
    await secureStorage.deleteItemAsync('wl_app_user')
    await secureStorage.deleteItemAsync('wl_user_id')
    set({ token: null, user: null, isAuthenticated: false, isLoading: false })
  },

  restoreAuth: async () => {
    try {
      const token = await secureStorage.getItemAsync('wl_app_token')
      const userStr = await secureStorage.getItemAsync('wl_app_user')
      if (!token) {
        set({ isLoading: false })
        return
      }

      // 向後端驗證 token 有效性，避免帶著過期 token 進入 App 後閃退
      let user: User | null = userStr ? (JSON.parse(userStr) as User) : null
      try {
        const res: { data?: { userId: number; empno?: string; username: string; role: string; avatar?: string } } = await authApi.me()
        if (res.data) {
          user = {
            userId: res.data.userId,
            empno: res.data.empno ?? user?.empno ?? '',
            username: res.data.username,
            role: res.data.role,
            avatar: res.data.avatar ?? '',
          }
          await secureStorage.setItemAsync('wl_app_user', JSON.stringify(user))
        }
      } catch {
        // token 無效，清除並登出
        await secureStorage.deleteItemAsync('wl_app_token')
        await secureStorage.deleteItemAsync('wl_app_user')
        await secureStorage.deleteItemAsync('wl_user_id')
        set({ token: null, user: null, isAuthenticated: false, isLoading: false })
        return
      }

      if (user) {
        set({ token, user, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch {
      set({ isLoading: false })
    }
  },
}))