'use client'

import { getClientId } from './clientId'

type AnalyticsMessage = {
  post_id: number | string
  event: string
  meta?: Record<string, any>
}

let socket: WebSocket | null = null
let socketState: 'idle' | 'connecting' | 'open' | 'closed' = 'idle'
let queue: string[] = []
let flushTimer: any = null

function getWsUrl() {
  if (typeof window === 'undefined') return null
  const host = window.location.hostname
  const port = Number(process.env.NEXT_PUBLIC_WS_PORT ?? '6001')
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${host}:${port}`
}

export function ensureAnalyticsSocket() {
  if (typeof window === 'undefined') return null
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return socket

  const url = getWsUrl()
  if (!url) return null

  try {
    socketState = 'connecting'
    socket = new WebSocket(url)
    socket.addEventListener('open', () => {
      socketState = 'open'
      // flush queue
      const pending = queue
      queue = []
      for (const msg of pending) {
        try {
          socket?.send(msg)
        } catch {
          // ignore
        }
      }
    })
    socket.addEventListener('close', () => {
      socketState = 'closed'
    })
    socket.addEventListener('error', () => {
      socketState = 'closed'
    })
    return socket
  } catch {
    socketState = 'closed'
    socket = null
    return null
  }
}

export async function sendAnalyticsEvent(msg: AnalyticsMessage) {
  const client_id = getClientId()
  const payload: AnalyticsMessage = {
    ...msg,
    meta: { ...(msg.meta ?? {}), client_id, client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null },
  }

  const serialized = JSON.stringify(payload)
  const ws = ensureAnalyticsSocket()
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(serialized)
      return { via: 'ws' as const }
    } catch {
      // fallthrough
    }
  }

  // If WS is connecting/closed, queue a bit (avoid hammering Laravel/Next)
  if (ws && ws.readyState === WebSocket.CONNECTING) {
    queue.push(serialized)
    if (queue.length > 200) queue = queue.slice(-200)
    return { via: 'ws-queued' as const }
  }

  // fallback to existing Next API proxy (best-effort)
  try {
    await fetch(`/api/posts/${encodeURIComponent(String(msg.post_id))}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // ignore
  }
  return { via: 'http' as const, state: socketState }
}

