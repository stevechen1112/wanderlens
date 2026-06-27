import { create } from 'zustand'
import * as secureStorage from '@/utils/secureStorage'
import { authApi, type ApiUser } from '@/api'
import { notifyApi, matchApi } from '@/api'

interface AuthState {
  token: string | null
  user: ApiUser | null
  providerId: number | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (token: string, user: ApiUser) => Promise<void>
  clearAuth: () => Promise<void>
  restoreAuth: () => Promise<void>
  refreshMe: () => Promise<void>
}

async function fetchMe(): Promise<ApiUser | null> {
  try {
    const res: { data?: ApiUser } = await authApi.me()
    return res.data ?? null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  providerId: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (token, user) => {
    await secureStorage.setItemAsync(secureStorage.TOKEN_KEY, token)
    await secureStorage.setItemAsync(secureStorage.USER_KEY, JSON.stringify(user))
    set({
      token,
      user,
      providerId: user.providerId ?? user.userId,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  clearAuth: async () => {
    await matchApi.goOffline().catch(() => {})
    const token = await secureStorage.getItemAsync('wl_provider_push_token')
    if (token) await notifyApi.removeDeviceToken(token).catch(() => {})
    await secureStorage.deleteItemAsync('wl_provider_push_token').catch(() => {})
    await secureStorage.deleteItemAsync(secureStorage.TOKEN_KEY)
    await secureStorage.deleteItemAsync(secureStorage.USER_KEY)
    set({
      token: null,
      user: null,
      providerId: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

  restoreAuth: async () => {
    try {
      const token = await secureStorage.getItemAsync(secureStorage.TOKEN_KEY)
      const userStr = await secureStorage.getItemAsync(secureStorage.USER_KEY)
      if (!token) {
        set({ isLoading: false })
        return
      }

      let user: ApiUser | null = userStr ? JSON.parse(userStr) as ApiUser : null
      const me = await fetchMe()
      if (me) {
        user = me
        await secureStorage.setItemAsync(secureStorage.USER_KEY, JSON.stringify(me))
      }

      if (user) {
        set({
          token,
          user,
          providerId: user.providerId ?? user.userId,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        await get().clearAuth()
      }
    } catch {
      set({ isLoading: false })
    }
  },

  refreshMe: async () => {
    const me = await fetchMe()
    if (me) {
      await secureStorage.setItemAsync(secureStorage.USER_KEY, JSON.stringify(me))
      set({ user: me, providerId: me.providerId ?? me.userId })
    }
  },
}))
