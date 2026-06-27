import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import * as secureStorage from '@/utils/secureStorage'
import { notifyApi } from '@/api'

function resolveProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as { easConfig?: { projectId?: string } }).easConfig?.projectId
  )
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export async function registerPushNotifications(appType: 'CONSUMER' | 'PROVIDER' = 'CONSUMER'): Promise<string | null> {
  if (Platform.OS === 'web') return null

  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') return null

  try {
    const projectId = resolveProjectId()
    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    )
    const token = tokenData.data
    const storageKey = appType === 'PROVIDER' ? 'wl_provider_push_token' : 'wl_push_token'
    await secureStorage.setItemAsync(storageKey, token)
    await notifyApi.registerDeviceToken(token, 'EXPO', appType).catch(() => {})
    return token
  } catch {
    return null
  }
}

export async function unregisterPushNotifications(appType: 'CONSUMER' | 'PROVIDER' = 'CONSUMER'): Promise<void> {
  const storageKey = appType === 'PROVIDER' ? 'wl_provider_push_token' : 'wl_push_token'
  const token = await secureStorage.getItemAsync(storageKey)
  if (token) {
    await notifyApi.removeDeviceToken(token).catch(() => {})
    await secureStorage.deleteItemAsync(storageKey)
  }
}

export function usePushNotifications(enabled: boolean, appType: 'CONSUMER' | 'PROVIDER' = 'CONSUMER') {
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<'granted' | 'denied' | 'undetermined'>('undetermined')

  useEffect(() => {
    if (Platform.OS === 'web') return

    if (!enabled) {
      unregisterPushNotifications(appType).then(() => {
        setToken(null)
        setPermission('denied')
      })
      return
    }

    registerPushNotifications(appType).then((t) => {
      setToken(t)
      setPermission(t ? 'granted' : 'denied')
    })
  }, [enabled, appType])

  return { token, permission, registerPushNotifications, unregisterPushNotifications }
}
