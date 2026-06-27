import { useState, useCallback, useEffect } from 'react'
import * as Location from 'expo-location'

export interface LocationCoords {
  lat: number
  lng: number
  city?: string
}

/**
 * 取得攝影師目前 GPS 座標，供即時媒合 goOnline 使用。
 * 若權限未授予或取不到位置，回傳 null（呼叫端應 fallback）。
 */
export function useLocation() {
  const [coords, setCoords] = useState<LocationCoords | null>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync()
      if (status !== 'granted') {
        const req = await Location.requestForegroundPermissionsAsync()
        if (req.status !== 'granted') return
      }
      setPermissionGranted(true)
    })()
  }, [])

  const refresh = useCallback(async (): Promise<LocationCoords | null> => {
    if (!permissionGranted) {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return null
      setPermissionGranted(true)
    }
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      const result: LocationCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }
      // 反查城市名（best effort，失敗不阻斷）
      try {
        const rev = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        if (rev.length > 0) {
          result.city = rev[0].city || rev[0].region || undefined
        }
      } catch {
        // ignore
      }
      setCoords(result)
      return result
    } catch {
      return null
    }
  }, [permissionGranted])

  return { coords, permissionGranted, refresh }
}