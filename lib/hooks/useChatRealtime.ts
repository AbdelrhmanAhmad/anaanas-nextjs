'use client'

import { useEffect, useRef } from 'react'

import {
  BROADCAST_DOM_EVENT,
  type BroadcastEnvelope,
  broadcastDomEventName,
  ensureBroadcastSocket,
  subscribeToChannel,
  unsubscribeFromChannel,
} from '@/lib/realtime/broadcastSocket'

/**
 * Subscribe to a chat's broadcast channel and react to inbound events.
 *
 * Works with the Node.js websocket-server (`server.js`). Backend Laravel
 * controllers publish on `chat:{chatId}` after writing to MongoDB so every
 * connected participant receives the same payload in real time. When the
 * socket cannot be established (network down, dev environment without
 * websocket-server running, blocked by corporate firewall, etc.), the page
 * automatically falls back to polling — see `useChatPollingFallback` below.
 *
 * Event names emitted by the backend (and matched here):
 *  - `chat.message.created`  — a new message was sent
 *  - `chat.read`             — the other side read messages
 *  - `chat.typing`           — typing indicator
 *  - `chat.closed` / `chat.reopened` / `chat.blocked` / `chat.unblocked`
 */
export type ChatRealtimeHandlers = {
  onMessage?: (payload: any) => void
  onRead?: (payload: any) => void
  onTyping?: (payload: any) => void
  onClosed?: (payload: any) => void
  onReopened?: (payload: any) => void
  onBlocked?: (payload: any) => void
  onUnblocked?: (payload: any) => void
}

export function useChatRealtime(chatId: string | null | undefined, handlers: ChatRealtimeHandlers): {
  isConnected: () => boolean
} {
  const handlersRef = useRef<ChatRealtimeHandlers>(handlers)
  handlersRef.current = handlers

  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!chatId) return
    const channel = `chat:${chatId}`

    socketRef.current = ensureBroadcastSocket()
    subscribeToChannel(channel)

    const bind = (eventName: string, handlerKey: keyof ChatRealtimeHandlers) => {
      const domEvent = broadcastDomEventName(eventName)
      const listener = (ev: Event) => {
        const detail = (ev as CustomEvent).detail
        if (!detail || detail.channel !== channel) return
        const cb = handlersRef.current[handlerKey]
        if (cb) cb(detail.payload)
      }
      window.addEventListener(domEvent, listener)
      return () => window.removeEventListener(domEvent, listener)
    }

    const offMessage = bind('chat.message.created', 'onMessage')
    const offRead = bind('chat.read', 'onRead')
    const offTyping = bind('chat.typing', 'onTyping')
    const offClosed = bind('chat.closed', 'onClosed')
    const offReopened = bind('chat.reopened', 'onReopened')
    const offBlocked = bind('chat.blocked', 'onBlocked')
    const offUnblocked = bind('chat.unblocked', 'onUnblocked')

    return () => {
      offMessage()
      offRead()
      offTyping()
      offClosed()
      offReopened()
      offBlocked()
      offUnblocked()
      unsubscribeFromChannel(channel)
    }
  }, [chatId])

  return {
    isConnected: () => {
      try {
        return Boolean(socketRef.current && socketRef.current.readyState === 1)
      } catch {
        return false
      }
    },
  }
}

/**
 * Subscribe to the per-user inbox channel so the conversation list stays
 * fresh (last_message + unread_count) without polling.
 *
 * **Important:** pass `session.user.id` (NextAuth) as soon as it exists, not
 * only `currentUser.id` from `/api/auth/profile` — the profile request can
 * finish *after* the first inbox events, which would mean we never subscribed
 * to `user:{id}` in time, so `chat.inbox.updated` would be dropped on the
 * client even though the WebSocket already delivered the frame.
 *
 * We listen on `BROADCAST_DOM_EVENT` (`anaanas:broadcast`) and filter by
 * `event` + `channel` so a single, robust path handles every broadcast
 * (avoids any edge case with `addEventListener` + long event names that
 * contain several `:` characters).
 */
export function useInboxRealtime(userId: string | number | null | undefined, onUpdate: (payload: any) => void) {
  const cbRef = useRef(onUpdate)
  cbRef.current = onUpdate

  useEffect(() => {
    if (userId == null || userId === '') return
    const channel = `user:${String(userId)}`

    ensureBroadcastSocket()
    subscribeToChannel(channel)

    const onInbox = (ev: Event) => {
      const detail = (ev as CustomEvent<BroadcastEnvelope>).detail
      if (!detail || detail.type !== 'broadcast') return
      if (detail.event !== 'chat.inbox.updated') return
      if (String(detail.channel) !== channel) return
      cbRef.current(detail.payload)
    }
    window.addEventListener(BROADCAST_DOM_EVENT, onInbox as EventListener)

    return () => {
      window.removeEventListener(BROADCAST_DOM_EVENT, onInbox as EventListener)
      unsubscribeFromChannel(channel)
    }
  }, [userId])
}
