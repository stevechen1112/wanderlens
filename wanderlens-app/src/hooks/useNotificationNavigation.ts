import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import { CommonActions } from '@react-navigation/native'
import type { NavigationContainerRef } from '@react-navigation/native'

export type PushNavigationData = {
  flowType?: string
  url?: string
  albumId?: string
  orderId?: string
}

const RECALL_TYPES = new Set(['anniversary_recall', 'baby_month_recall', 'travel_recall'])

export function parsePushData(raw: Record<string, unknown> | undefined): PushNavigationData {
  if (!raw) return {}
  return {
    flowType: raw.flowType != null ? String(raw.flowType) : undefined,
    url: raw.url != null ? String(raw.url) : undefined,
    albumId: raw.albumId != null ? String(raw.albumId) : undefined,
    orderId: raw.orderId != null ? String(raw.orderId) : undefined,
  }
}

export function navigateFromPushData(
  navigationRef: NavigationContainerRef<any>,
  data: PushNavigationData,
) {
  if (!navigationRef.isReady()) return

  const albumId = data.albumId ? Number(data.albumId) : undefined
  if (albumId && !Number.isNaN(albumId)) {
    navigationRef.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: {
          screen: 'Albums',
          params: { screen: 'AlbumDetail', params: { albumId } },
        },
      }),
    )
    return
  }

  if (data.url?.startsWith('wanderlens://album/')) {
    const id = Number(data.url.replace('wanderlens://album/', ''))
    if (!Number.isNaN(id)) {
      navigationRef.dispatch(
        CommonActions.navigate({
          name: 'MainTabs',
          params: {
            screen: 'Albums',
            params: { screen: 'AlbumDetail', params: { albumId: id } },
          },
        }),
      )
      return
    }
  }

  if (data.flowType && RECALL_TYPES.has(data.flowType)) {
    navigationRef.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: {
          screen: 'Profile',
          params: { screen: 'ShootingHistory' },
        },
      }),
    )
  }
}

export function useNotificationNavigation(
  navigationRef: React.RefObject<NavigationContainerRef<any> | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return

    const handleResponse = (response: Notifications.NotificationResponse) => {
      const data = parsePushData(response.notification.request.content.data as Record<string, unknown>)
      if (navigationRef.current) {
        navigateFromPushData(navigationRef.current, data)
      }
    }

    const sub = Notifications.addNotificationResponseReceivedListener(handleResponse)

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response && navigationRef.current) {
        const data = parsePushData(response.notification.request.content.data as Record<string, unknown>)
        navigateFromPushData(navigationRef.current, data)
      }
    })

    return () => sub.remove()
  }, [enabled, navigationRef])
}
