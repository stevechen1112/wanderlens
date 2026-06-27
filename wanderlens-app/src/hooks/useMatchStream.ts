import { useEffect, useRef } from 'react'
import client from '@/api/client'

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:8080/api'

type MatchEventHandler = (event: string, data: unknown) => void

export function useMatchStream(requestId: number | null, onEvent: MatchEventHandler) {
  const handlerRef = useRef(onEvent)
  handlerRef.current = onEvent

  useEffect(() => {
    if (!requestId) return

    let disposed = false
    let xhr: XMLHttpRequest | null = null
    let readOffset = 0

    async function connect() {
      const token = await import('@/utils/secureStorage').then(m => m.getItemAsync('wl_app_token'))
      if (!token || disposed) return

      readOffset = 0
      xhr = new XMLHttpRequest()
      xhr.open('GET', `${API_BASE}/match/request/${requestId}/stream?token=${encodeURIComponent(token)}`)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.setRequestHeader('Accept', 'text/event-stream')

      xhr.onprogress = () => {
        if (!xhr || disposed) return
        const chunk = xhr.responseText.slice(readOffset)
        readOffset = xhr.responseText.length
        parseSse(chunk).forEach(({ event, data }) => handlerRef.current(event, data))
      }

      xhr.onerror = () => {}
      xhr.send()
    }

    connect()
    return () => {
      disposed = true
      xhr?.abort()
    }
  }, [requestId])
}

function parseSse(chunk: string): { event: string; data: unknown }[] {
  const results: { event: string; data: unknown }[] = []
  const blocks = chunk.split('\n\n')
  for (const block of blocks) {
    let event = 'message'
    let dataStr = ''
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim()
      if (line.startsWith('data:')) dataStr += line.slice(5).trim()
    }
    if (dataStr) {
      try {
        results.push({ event, data: JSON.parse(dataStr) })
      } catch {
        results.push({ event, data: dataStr })
      }
    }
  }
  return results
}
