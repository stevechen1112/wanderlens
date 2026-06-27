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

export async function registerPushNotifications(): Promise<string | null> {
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
    await secureStorage.setItemAsync('wl_provider_push_token', token)
    await notifyApi.registerDeviceToken(token, 'EXPO', 'PROVIDER').catch(() => {})
    return token
  } catch {
    return null
  }
}

export function usePushNotifications(enabled: boolean) {
  const [token, setToken] = useState<string | null>(null)
  const [permission, setPermission] = useState<'granted' | 'denied' | 'undetermined'>('undetermined')

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return
    registerPushNotifications().then((t) => {
      setToken(t)
      setPermission(t ? 'granted' : 'denied')
    })
  }, [enabled])

  return { token, permission, registerPushNotifications }
}
