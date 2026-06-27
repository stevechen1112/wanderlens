import { useEffect, useRef, useState, useCallback } from 'react'
import * as secureStorage from '@/utils/secureStorage'
import { TOKEN_KEY } from '@/utils/secureStorage'
import type { MatchBroadcastPayload } from '@/api/matchTypes'

const WS_BASE = (process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:8080/api')
  .replace(/^http/, 'ws')

export function useMatchWebSocket(enabled: boolean, onRequest: (payload: MatchBroadcastPayload) => void) {
  const [connected, setConnected] = useState(false)
  const handlerRef = useRef(onRequest)
  handlerRef.current = onRequest
  const wsRef = useRef<WebSocket | null>(null)
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const disconnect = useCallback(() => {
    if (pingRef.current) clearInterval(pingRef.current)
    wsRef.current?.close()
    wsRef.current = null
    setConnected(false)
  }, [])

  useEffect(() => {
    if (!enabled) {
      disconnect()
      return
    }

    let disposed = false
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let retryCount = 0
    const BASE_DELAY = 3000
    const MAX_DELAY = 30000
    const MAX_RETRIES = 10

    async function connect() {
      const token = await secureStorage.getItemAsync(TOKEN_KEY)
      if (!token || disposed) return

      const ws = new WebSocket(`${WS_BASE}/ws/match?token=${encodeURIComponent(token)}`)
      wsRef.current = ws

      ws.onopen = () => {
        if (disposed) return
        retryCount = 0
        setConnected(true)
        pingRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send('ping')
        }, 15000)
      }

      ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data) as MatchBroadcastPayload
          if (payload.type === 'NEW_REQUEST') handlerRef.current(payload)
        } catch {
          // ignore
        }
      }

      ws.onclose = () => {
        setConnected(false)
        if (!disposed && enabled) {
          if (retryCount >= MAX_RETRIES) return
          const delay = Math.min(BASE_DELAY * Math.pow(2, retryCount), MAX_DELAY)
          retryCount++
          reconnectTimer = setTimeout(connect, delay)
        }
      }

      ws.onerror = () => ws.close()
    }

    connect()
    return () => {
      disposed = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      disconnect()
    }
  }, [enabled, disconnect])

  return { connected, disconnect }
}
