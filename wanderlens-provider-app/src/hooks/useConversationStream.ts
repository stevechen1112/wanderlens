import { useEffect, useRef } from 'react'

import { Platform } from 'react-native'

import { API_BASE } from '@/api/client'

import * as secureStorage from '@/utils/secureStorage'

import { TOKEN_KEY } from '@/utils/secureStorage'



type StreamHandler = (payload: unknown) => void



function parseSseChunk(chunk: string): unknown[] {

  const events: unknown[] = []

  const lines = chunk.split('\n')

  let data = ''

  for (const line of lines) {

    if (line.startsWith('data:')) {

      data += line.slice(5).trim()

    } else if (line === '' && data) {

      try {

        events.push(JSON.parse(data))

      } catch {

        events.push(data)

      }

      data = ''

    }

  }

  if (data) {

    try {

      events.push(JSON.parse(data))

    } catch {

      events.push(data)

    }

  }

  return events

}



export function useConversationStream(

  conversationId: number | undefined,

  onEvent: StreamHandler,

  pollFallbackMs = 8000,

) {

  const onEventRef = useRef(onEvent)

  onEventRef.current = onEvent



  useEffect(() => {

    if (!conversationId) return



    let disposed = false

    let xhr: XMLHttpRequest | null = null

    let pollTimer: ReturnType<typeof setInterval> | null = null

    let buffer = ''

    let sseConnected = false



    const handlePayload = (payload: unknown) => {

      if (!disposed) onEventRef.current(payload)

    }



    const startPolling = () => {

      if (pollTimer || disposed) return

      pollTimer = setInterval(() => handlePayload({ type: 'poll' }), pollFallbackMs)

    }



    async function connectSse(): Promise<boolean> {

      const token = await secureStorage.getItemAsync(TOKEN_KEY)

      if (!token || disposed) return false



      return new Promise<boolean>((resolve) => {

        xhr = new XMLHttpRequest()

        const url = `${API_BASE}/conversations/${conversationId}/stream`

        xhr.open('GET', url, true)

        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        xhr.setRequestHeader('Accept', 'text/event-stream')

        xhr.setRequestHeader('Cache-Control', 'no-cache')



        let settled = false

        const finish = (ok: boolean) => {

          if (settled) return

          settled = true

          resolve(ok)

        }



        xhr.onreadystatechange = () => {

          if (!xhr || disposed) return

          if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {

            if (xhr.status >= 200 && xhr.status < 300) {

              sseConnected = true

              finish(true)

            } else {

              finish(false)

            }

          }

        }



        xhr.onprogress = () => {

          if (!xhr || disposed) return

          sseConnected = true

          const text = xhr.responseText.slice(buffer.length)

          buffer = xhr.responseText

          const events = parseSseChunk(text)

          events.forEach(handlePayload)

        }



        xhr.onload = () => finish(sseConnected)

        xhr.onerror = () => finish(false)

        xhr.onabort = () => finish(sseConnected)



        try {

          xhr.send()

          setTimeout(() => finish(sseConnected), 5000)

        } catch {

          finish(false)

        }

      })

    }



    async function start() {

      const ok = await connectSse()

      if (!ok && !disposed) {

        startPolling()

      }

    }



    start()



    return () => {

      disposed = true

      xhr?.abort()

      if (pollTimer) clearInterval(pollTimer)

    }

  }, [conversationId, pollFallbackMs])

}

