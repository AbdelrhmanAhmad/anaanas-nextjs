'use client'

/**
 * Persistent WebSocket connection used for *receiving* server-pushed
 * broadcasts (e.g. "a new post was just published on this country channel").
 *
 * Kept separate from `lib/analytics/socket.ts` because:
 *  - the analytics socket is fire-and-forget (with HTTP fallback) and tuned
 *    for very high write volume during scrolling.
 *  - this one is a long-lived listener that subscribes to channels and
 *    dispatches `CustomEvent`s on `window` for components to consume.
 */

export type BroadcastEnvelope<T = unknown> = {
  type: 'broadcast'
  channel: string
  event: string
  payload: T
  ts?: number
}

export const BROADCAST_DOM_EVENT = 'anaanas:broadcast'
export function broadcastDomEventName(event: string) {
  return `anaanas:broadcast:${event}`
}

let socket: WebSocket | null = null
let connecting = false
let reconnectAttempts = 0
let reconnectTimer: number | null = null
const subscribed = new Set<string>()

const MAX_RECONNECT_DELAY_MS = 15_000
const PING_INTERVAL_MS = 25_000
let pingTimer: number | null = null

function getWsUrl(): string | null {
  if (typeof window === 'undefined') return null
  const explicit = process.env.NEXT_PUBLIC_ANALYTICS_WS_URL
  if (explicit && explicit.trim()) return explicit.trim()
  const host = window.location.hostname
  const port = Number(process.env.NEXT_PUBLIC_WS_PORT ?? '6001')
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${host}/ws`
  return `${proto}://${host}:${port}`
}

function clearReconnectTimer() {
  if (reconnectTimer != null && typeof window !== 'undefined') {
    window.clearTimeout(reconnectTimer)
  }
  reconnectTimer = null
}

function scheduleReconnect() {
  if (typeof window === 'undefined') return
  clearReconnectTimer()
  reconnectAttempts += 1
  const delay = Math.min(800 * Math.pow(1.7, reconnectAttempts), MAX_RECONNECT_DELAY_MS)
  reconnectTimer = window.setTimeout(() => {
    connect()
  }, delay)
}

function clearPingTimer() {
  if (pingTimer != null && typeof window !== 'undefined') {
    window.clearInterval(pingTimer)
  }
  pingTimer = null
}

function startPing() {
  clearPingTimer()
  if (typeof window === 'undefined') return
  pingTimer = window.setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({ action: 'ping' }))
      } catch {
        // ignore
      }
    }
  }, PING_INTERVAL_MS)
}

function dispatchBroadcast(envelope: BroadcastEnvelope) {
  if (typeof window === 'undefined') return
  try {
    window.dispatchEvent(
      new CustomEvent<BroadcastEnvelope>(BROADCAST_DOM_EVENT, { detail: envelope }),
    )
    window.dispatchEvent(
      new CustomEvent<BroadcastEnvelope>(broadcastDomEventName(envelope.event), { detail: envelope }),
    )
  } catch {
    // ignore
  }
}

function flushSubscriptions() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return
  for (const channel of subscribed) {
    try {
      socket.send(JSON.stringify({ action: 'subscribe', channel }))
    } catch {
      // best-effort; will retry on next reconnect
    }
  }
}

function connect(): WebSocket | null {
  if (typeof window === 'undefined') return null
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return socket
  }
  if (connecting) return socket
  connecting = true

  const url = getWsUrl()
  if (!url) {
    connecting = false
    return null
  }

  try {
    socket = new WebSocket(url)
  } catch {
    connecting = false
    socket = null
    scheduleReconnect()
    return null
  }

  socket.addEventListener('open', () => {
    connecting = false
    reconnectAttempts = 0
    clearReconnectTimer()
    flushSubscriptions()
    startPing()
  })

  socket.addEventListener('message', (ev) => {
    let msg: unknown
    try {
      msg = JSON.parse(typeof ev.data === 'string' ? ev.data : '')
    } catch {
      return
    }
    if (!msg || typeof msg !== 'object') return
    const obj = msg as { type?: string; channel?: string; event?: string; payload?: unknown }
    if (obj.type === 'broadcast' && obj.channel && obj.event) {
      dispatchBroadcast({
        type: 'broadcast',
        channel: obj.channel,
        event: obj.event,
        payload: obj.payload,
      })
    }
  })

  socket.addEventListener('close', () => {
    connecting = false
    socket = null
    clearPingTimer()
    scheduleReconnect()
  })

  socket.addEventListener('error', () => {
    // 'close' will fire right after; nothing to do here
  })

  return socket
}

export function ensureBroadcastSocket(): WebSocket | null {
  return connect()
}

export function subscribeToChannel(channel: string) {
  if (!channel) return
  subscribed.add(channel)
  const ws = ensureBroadcastSocket()
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify({ action: 'subscribe', channel }))
    } catch {
      // ignore — flushSubscriptions will retry on reconnect
    }
  }
}

export function unsubscribeFromChannel(channel: string) {
  if (!channel) return
  subscribed.delete(channel)
  if (socket && socket.readyState === WebSocket.OPEN) {
    try {
      socket.send(JSON.stringify({ action: 'unsubscribe', channel }))
    } catch {
      // ignore
    }
  }
}
