'use client'

import { getClientId } from './clientId'

type AnalyticsMessage = {
  post_id: number | string
  event: string
  meta?: Record<string, any>
  user_id?: number | string | null
}

type PersistedEnvelope = {
  postId: number | string
  event: string
  payload: AnalyticsMessage
  serialized: string
  tries: number
}

let socket: WebSocket | null = null
let socketState: 'idle' | 'connecting' | 'open' | 'closed' = 'idle'
let queue: PersistedEnvelope[] = []
let reconnectTimer: number | null = null
let reconnectAttempts = 0
let shouldReconnect = true

/**
 * Availability tristate:
 *  - `null`   : we haven't observed the socket state yet (first boot)
 *  - `true`   : we have seen the socket OPEN at least once during this session
 *  - `false`  : connection attempts keep failing → prefer HTTP fallback right away
 */
let wsAvailable: boolean | null = null

const MAX_QUEUE_SIZE = 300
const QUEUE_STORAGE_KEY = 'ananas_analytics_queue_v2'
const MAX_RECONNECT_DELAY_MS = 15000
const WS_FAILURE_THRESHOLD = 2
const WS_CONNECT_WAIT_MS = 400
const MAX_HTTP_RETRIES = 2

function getWsUrl() {
  if (typeof window === 'undefined') return null
  const explicit = process.env.NEXT_PUBLIC_ANALYTICS_WS_URL
  if (explicit && explicit.trim()) return explicit.trim()
  const host = window.location.hostname
  const port = Number(process.env.NEXT_PUBLIC_WS_PORT ?? '6001')
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${host}/ws`
  return `${proto}://${host}:${port}`
}

/* ------------------------------------------------------------------
   Persistent queue (used ONLY when both WS and HTTP failed — e.g. offline)
   ------------------------------------------------------------------ */

function loadQueueFromStorage(): PersistedEnvelope[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(QUEUE_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is PersistedEnvelope =>
        x && typeof x === 'object' && typeof (x as any).serialized === 'string',
    )
  } catch {
    return []
  }
}

function saveQueueToStorage(next: PersistedEnvelope[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(next.slice(-MAX_QUEUE_SIZE)))
  } catch {
    // ignore (quota exceeded / private mode)
  }
}

function enqueue(envelope: PersistedEnvelope) {
  queue.push(envelope)
  if (queue.length > MAX_QUEUE_SIZE) queue = queue.slice(-MAX_QUEUE_SIZE)

  const persisted = loadQueueFromStorage()
  persisted.push(envelope)
  saveQueueToStorage(persisted.slice(-MAX_QUEUE_SIZE))
}

function removeFromPersistedQueue(predicate: (env: PersistedEnvelope) => boolean) {
  const persisted = loadQueueFromStorage()
  saveQueueToStorage(persisted.filter((env) => !predicate(env)))
}

/* ------------------------------------------------------------------
   Reconnect handling
   ------------------------------------------------------------------ */

function clearReconnectTimer() {
  if (reconnectTimer != null && typeof window !== 'undefined') {
    window.clearTimeout(reconnectTimer)
  }
  reconnectTimer = null
}

function scheduleReconnect() {
  if (typeof window === 'undefined' || !shouldReconnect) return
  clearReconnectTimer()

  reconnectAttempts += 1
  const delay = Math.min(800 * Math.pow(1.7, reconnectAttempts), MAX_RECONNECT_DELAY_MS)
  reconnectTimer = window.setTimeout(() => {
    ensureAnalyticsSocket()
  }, delay)
}

/* ------------------------------------------------------------------
   HTTP fallback: POST /api/posts/{postId}/events (same-origin proxy
   that forwards to Laravel's PostEventController::store).
   ------------------------------------------------------------------ */

async function sendViaHttp(envelope: PersistedEnvelope): Promise<boolean> {
  const { postId, event, payload } = envelope
  try {
    const res = await fetch(`/api/posts/${encodeURIComponent(String(postId))}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      keepalive: true,
      body: JSON.stringify({
        event,
        meta: payload.meta ?? {},
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

async function flushPersistedQueueViaHttp() {
  const persisted = loadQueueFromStorage()
  if (persisted.length === 0) return

  // Drain sequentially so we can stop early on failure and keep the rest queued.
  const remaining: PersistedEnvelope[] = []
  for (const env of persisted) {
    if (env.tries >= MAX_HTTP_RETRIES) continue
    const ok = await sendViaHttp(env)
    if (!ok) {
      remaining.push({ ...env, tries: env.tries + 1 })
    }
  }
  saveQueueToStorage(remaining)
}

/* ------------------------------------------------------------------
   WebSocket lifecycle
   ------------------------------------------------------------------ */

function flushQueueViaWs() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return

  const persisted = loadQueueFromStorage()
  const pending = [...persisted, ...queue]
  queue = []
  saveQueueToStorage([])

  for (const env of pending) {
    try {
      socket.send(env.serialized)
    } catch {
      enqueue(env)
    }
  }
}

export function ensureAnalyticsSocket() {
  if (typeof window === 'undefined') return null
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return socket

  const url = getWsUrl()
  if (!url) return null

  try {
    shouldReconnect = true
    socketState = 'connecting'
    socket = new WebSocket(url)
    socket.addEventListener('open', () => {
      socketState = 'open'
      wsAvailable = true
      reconnectAttempts = 0
      clearReconnectTimer()
      flushQueueViaWs()
    })
    socket.addEventListener('close', () => {
      socketState = 'closed'
      socket = null
      if (reconnectAttempts + 1 >= WS_FAILURE_THRESHOLD && wsAvailable !== true) {
        wsAvailable = false
      }
      scheduleReconnect()
      // WS is down — flush any persisted events via HTTP so we don't lose data.
      void flushPersistedQueueViaHttp()
    })
    socket.addEventListener('error', () => {
      socketState = 'closed'
      // Note: browsers fire 'error' right before 'close'; no need to reconnect here.
    })
    return socket
  } catch {
    socketState = 'closed'
    socket = null
    wsAvailable = false
    scheduleReconnect()
    return null
  }
}

/* ------------------------------------------------------------------
   Public API
   ------------------------------------------------------------------ */

function waitForSocketOpen(ws: WebSocket, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (ws.readyState === WebSocket.OPEN) {
      resolve(true)
      return
    }
    let settled = false
    const onOpen = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve(true)
    }
    const onFail = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve(false)
    }
    const cleanup = () => {
      ws.removeEventListener('open', onOpen)
      ws.removeEventListener('error', onFail)
      ws.removeEventListener('close', onFail)
    }
    ws.addEventListener('open', onOpen, { once: true })
    ws.addEventListener('error', onFail, { once: true })
    ws.addEventListener('close', onFail, { once: true })
    window.setTimeout(onFail, timeoutMs)
  })
}

export async function sendAnalyticsEvent(msg: AnalyticsMessage) {
  const client_id = getClientId()
  const payload: AnalyticsMessage = {
    ...msg,
    meta: {
      ...(msg.meta ?? {}),
      client_id,
      client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    },
  }

  const serialized = JSON.stringify(payload)
  const envelope: PersistedEnvelope = {
    postId: msg.post_id,
    event: msg.event,
    payload,
    serialized,
    tries: 0,
  }

  const ws = ensureAnalyticsSocket()

  // 1) Fast path: WS is open → send and we're done.
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(serialized)
      return { via: 'ws' as const }
    } catch {
      // fall through to HTTP fallback
    }
  }

  // 2) WS is trying to connect → give it a short chance before falling back.
  //    Only wait if we have not already decided WS is unavailable this session.
  if (ws && ws.readyState === WebSocket.CONNECTING && wsAvailable !== false) {
    const opened = await waitForSocketOpen(ws, WS_CONNECT_WAIT_MS)
    if (opened && socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(serialized)
        return { via: 'ws' as const }
      } catch {
        // fall through
      }
    }
  }

  // 3) HTTP fallback — same schema as Laravel's PostEventController.
  const httpOk = await sendViaHttp(envelope)
  if (httpOk) {
    // Also try to reconnect the socket for future events (cheap, no-op if already up).
    scheduleReconnect()
    return { via: 'http' as const }
  }

  // 4) Both transports failed — queue and retry on next reconnect / next send.
  enqueue(envelope)
  scheduleReconnect()
  return { via: 'queued' as const, state: socketState }
}
