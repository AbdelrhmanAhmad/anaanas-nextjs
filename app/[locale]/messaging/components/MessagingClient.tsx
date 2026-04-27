'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'

import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'
import type { ChatType } from '@/types/data'
import { useChatRealtime, useInboxRealtime } from '@/lib/hooks/useChatRealtime'
import { useCurrentUser } from '@/context/useCurrentUser'

import styles from '../messaging.module.css'
import ChatHeader from './ChatHeader'
import Composer from './Composer'
import ConfirmDialog from './ConfirmDialog'
import ConversationList from './ConversationList'
import EmptyState from './EmptyState'
import MessageList, { type UiMessage } from './MessageList'
import ReportDialog from './ReportDialog'
import { generateClientId } from './messagingHelpers'
import {
  playActionSound,
  playReceiveSound,
  playSendSound,
  playTypingSound,
  unlockMessagingAudio,
} from '@/lib/messaging/messagingSounds'

type ApiMessage = {
  id: string
  client_id?: string | null
  chat_id: string
  sender_id: number | string
  sender?: {
    id: number | string
    name?: string | null
    username?: string | null
    avatar?: string | null
  } | null
  body: string
  type?: string
  file_url?: string | null
  is_read?: boolean
  is_mine?: boolean
  read_by?: number[]
  read_at?: string | null
  created_at: string
}

type ConfirmKind = 'clear' | 'close' | 'block' | 'delete' | null

type ToastState = { kind: 'success' | 'danger' | 'info'; text: string } | null

type Props = {
  locale: SupportedLocale
}

const POLL_INTERVAL_MS = 6000

function toUi(m: ApiMessage, currentUserId: number | string | null | undefined): UiMessage {
  // Always derive from sender_id when we know the session user. For REST before profile loads, `is_mine`
  // is correct. WebSocket `is_mine` is stripped server-side; never use it for fan-out.
  const isMine =
    currentUserId != null
      ? String(m.sender_id) === String(currentUserId)
      : Boolean(m.is_mine)
  return {
    id: String(m.id),
    client_id: m.client_id ?? null,
    body: m.body,
    type: m.type ?? 'text',
    file_url: m.file_url ?? null,
    created_at: m.created_at,
    is_mine: isMine,
    is_read: Boolean(m.is_read),
    sender: m.sender
      ? {
          id: m.sender.id,
          name: m.sender.name ?? '',
          avatar: m.sender.avatar ?? null,
        }
      : null,
    status: 'sent',
  }
}

export default function MessagingClient({ locale }: Props) {
  const router = useRouter()
  const search = useSearchParams()
  const initialChatId = search.get('chat')
  const { data: session, status: sessionStatus } = useSession()
  const { user: currentUser } = useCurrentUser()
  const currentUserId = currentUser?.id ?? (session as { user?: { id?: string } })?.user?.id
  /** Use NextAuth id immediately for WS `user:{id}`; profile `/api/auth/profile` can load later. */
  const inboxUserId =
    (session as { user?: { id?: string } })?.user?.id ?? currentUser?.id

  // ─── Chat list ────────────────────────────────────────────────────────
  const [chats, setChats] = useState<ChatType[]>([])
  const [chatsLoading, setChatsLoading] = useState(true)

  // ─── Active chat ──────────────────────────────────────────────────────
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId)
  const [activeChat, setActiveChat] = useState<ChatType | null>(null)
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const typingTimerRef = useRef<number | null>(null)

  // ─── Connection state for the banner ──────────────────────────────────
  const [connection, setConnection] = useState<'connecting' | 'live' | 'polling'>('connecting')

  // ─── Mobile pane toggle ───────────────────────────────────────────────
  const [mobileShowConvo, setMobileShowConvo] = useState(!initialChatId)

  // ─── Action dialogs ───────────────────────────────────────────────────
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null)
  const [confirmBusy, setConfirmBusy] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportBusy, setReportBusy] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)

  const showToast = useCallback((s: NonNullable<ToastState>) => {
    setToast(s)
    window.setTimeout(() => setToast(null), 3000)
  }, [])

  // ─── Load chat list ───────────────────────────────────────────────────
  const refreshChats = useCallback(async () => {
    if (sessionStatus !== 'authenticated') {
      setChatsLoading(false)
      return
    }
    try {
      const res = await fetch('/api/chats?per_page=100', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      const json = await res.json()
      if (json?.success && Array.isArray(json.data)) {
        setChats(json.data)
      }
    } catch (err) {
      console.error('messaging: refreshChats failed', err)
    } finally {
      setChatsLoading(false)
    }
  }, [sessionStatus])

  useEffect(() => {
    if (sessionStatus === 'loading') return
    if (sessionStatus !== 'authenticated') {
      setChatsLoading(false)
      setChats([])
      return
    }
    void refreshChats()
  }, [sessionStatus, refreshChats])

  // When the session user id becomes available, realign sides (stale `is_mine` from early REST/WS).
  useEffect(() => {
    if (currentUserId == null) return
    setMessages((prev) =>
      prev.map((m) => {
        const sid = m.sender?.id
        if (sid == null) return m
        const mine = String(sid) === String(currentUserId)
        if (m.is_mine === mine) return m
        return { ...m, is_mine: mine }
      }),
    )
  }, [currentUserId])

  // Allow Web Audio beeps after the user interacts once (browser autoplay policy).
  useEffect(() => {
    const onGesture = () => {
      unlockMessagingAudio()
    }
    window.addEventListener('pointerdown', onGesture, { passive: true })
    window.addEventListener('keydown', onGesture, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('keydown', onGesture)
    }
  }, [])

  // ─── Load a single chat's metadata + messages ─────────────────────────
  const loadChat = useCallback(
    async (chatId: string) => {
      try {
        setMessagesLoading(true)
        const [chatRes, msgsRes] = await Promise.all([
          fetch(`/api/chats/${encodeURIComponent(chatId)}`, {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
          }),
          fetch(`/api/chats/${encodeURIComponent(chatId)}/messages?per_page=80`, {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
          }),
        ])

        const chatJson = await chatRes.json().catch(() => null)
        const msgsJson = await msgsRes.json().catch(() => null)

        if (chatJson?.success && chatJson.data) {
          setActiveChat(chatJson.data as ChatType)
        }
        if (msgsJson?.success && Array.isArray(msgsJson.data)) {
          const list = (msgsJson.data as ApiMessage[]).map((m) => toUi(m, currentUserId))
          setMessages(list)
        } else {
          setMessages([])
        }

        // Mark as read (best-effort)
        void fetch(`/api/chats/${encodeURIComponent(chatId)}/read`, { method: 'POST' }).catch(() => {})
      } catch (err) {
        console.error('messaging: loadChat failed', err)
      } finally {
        setMessagesLoading(false)
      }
    },
    [currentUserId],
  )

  useEffect(() => {
    if (!activeChatId) {
      setActiveChat(null)
      setMessages([])
      return
    }
    void loadChat(activeChatId)
  }, [activeChatId, loadChat])

  // ─── Realtime subscription (chat channel) ─────────────────────────────
  const messagesRef = useRef<UiMessage[]>([])
  messagesRef.current = messages

  const handleIncomingMessage = useCallback(
    (payload: any) => {
      // Laravel publishes: { chat_id, message: serialized } — not a flat ApiMessage at the root.
      const m = (payload?.message ?? payload) as ApiMessage
      if (!m || m.id == null) return
      const eventChatId = String(payload?.chat_id ?? m.chat_id ?? '')
      if (activeChatId && eventChatId && eventChatId !== String(activeChatId)) return

      const mId = String(m.id)
      const isMine = currentUserId != null && String(m.sender_id) === String(currentUserId)
      const prevSnap = messagesRef.current
      const withReplace = m.client_id
        ? prevSnap.map((x) => (x.client_id && x.client_id === m.client_id ? toUi(m, currentUserId) : x))
        : prevSnap
      const isNew = !withReplace.some((x) => x.id === mId)
      if (isNew && !isMine) {
        playReceiveSound()
      }

      setMessages((prev) => {
        const list = m.client_id
          ? prev.map((x) => (x.client_id && x.client_id === m.client_id ? toUi(m, currentUserId) : x))
          : prev
        if (list.some((x) => x.id === mId)) return list
        return [...list, toUi(m, currentUserId)]
      })

      if (!isMine && activeChatId) {
        void fetch(`/api/chats/${encodeURIComponent(activeChatId)}/read`, { method: 'POST' }).catch(() => {})
      }
    },
    [activeChatId, currentUserId],
  )

  const handleReadEvent = useCallback(
    (payload: any) => {
      const otherId = payload?.user_id
      if (!otherId) return
      setMessages((prev) =>
        prev.map((m) =>
          m.is_mine && m.status === 'sent' ? { ...m, is_read: true } : m,
        ),
      )
    },
    [],
  )

  const handleTypingEvent = useCallback(
    (payload: any) => {
      if (!payload?.user_id) return
      if (currentUserId != null && String(payload.user_id) === String(currentUserId)) return
      playTypingSound()
      setShowTyping(true)
      if (typingTimerRef.current != null) window.clearTimeout(typingTimerRef.current)
      typingTimerRef.current = window.setTimeout(() => setShowTyping(false), 3500)
    },
    [currentUserId],
  )

  const handleClosed = useCallback(() => {
    setActiveChat((prev) => (prev ? { ...prev, is_closed: true } : prev))
  }, [])

  const handleReopened = useCallback(() => {
    setActiveChat((prev) => (prev ? { ...prev, is_closed: false } : prev))
  }, [])

  const handleBlocked = useCallback(
    (payload: any) => {
      if (!payload?.blocker_id) return
      if (currentUserId != null && String(payload.blocker_id) === String(currentUserId)) {
        setActiveChat((prev) => (prev ? { ...prev, i_blocked_them: true, is_blocked: true } : prev))
      } else {
        setActiveChat((prev) => (prev ? { ...prev, they_blocked_me: true, is_blocked: true } : prev))
      }
    },
    [currentUserId],
  )

  const handleUnblocked = useCallback(
    (payload: any) => {
      if (!payload?.blocker_id) return
      if (currentUserId != null && String(payload.blocker_id) === String(currentUserId)) {
        setActiveChat((prev) => (prev ? { ...prev, i_blocked_them: false } : prev))
      } else {
        setActiveChat((prev) => (prev ? { ...prev, they_blocked_me: false } : prev))
      }
    },
    [currentUserId],
  )

  const realtime = useChatRealtime(activeChatId, {
    onMessage: handleIncomingMessage,
    onRead: handleReadEvent,
    onTyping: handleTypingEvent,
    onClosed: handleClosed,
    onReopened: handleReopened,
    onBlocked: handleBlocked,
    onUnblocked: handleUnblocked,
  })

  // ─── Inbox subscription (update list in real time on user:{id} channel) ─
  const handleInboxUpdated = useCallback(
    (payload: {
      chat_id?: string
      last_message?: { id?: string; body?: string; sender_id?: number; sent_at?: string }
      unread_count?: number
    }) => {
      if (!payload?.chat_id) {
        void refreshChats()
        return
      }
      const chatId = String(payload.chat_id)
      setChats((prev) => {
        const idx = prev.findIndex((c) => String(c.id) === chatId)
        if (idx < 0) {
          queueMicrotask(() => {
            void refreshChats()
          })
          return prev
        }
        const row = prev[idx]
        const lm = payload.last_message
        const updated: ChatType = {
          ...row,
          last_message: lm
            ? {
                id: lm.id as string,
                body: String(lm.body ?? ''),
                sender_id: lm.sender_id,
                sent_at: lm.sent_at,
              }
            : row.last_message,
          last_message_at: lm?.sent_at ?? row.last_message_at,
        }
        if (typeof payload.unread_count === 'number') {
          updated.unread_count = payload.unread_count
        }
        const next = [...prev]
        next.splice(idx, 1)
        return [updated, ...next]
      })
    },
    [refreshChats],
  )

  useInboxRealtime(inboxUserId, handleInboxUpdated)

  // ─── Connection status banner ─────────────────────────────────────────
  useEffect(() => {
    if (!activeChatId) return
    let cancelled = false
    const tick = () => {
      if (cancelled) return
      const c = realtime.isConnected()
      setConnection(c ? 'live' : 'polling')
    }
    tick()
    const id = window.setInterval(tick, 3000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [activeChatId, realtime])

  // ─── Polling fallback for messages when WS isn't connected ────────────
  useEffect(() => {
    if (!activeChatId) return
    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      // Only poll when not live
      if (realtime.isConnected()) return
      const lastIso = messagesRef.current[messagesRef.current.length - 1]?.created_at || ''
      try {
        const url = `/api/chats/${encodeURIComponent(activeChatId)}/messages?per_page=30${lastIso ? `&after_at=${encodeURIComponent(lastIso)}` : ''}`
        const res = await fetch(url, { cache: 'no-store' })
        const json = await res.json().catch(() => null)
        if (cancelled) return
        if (json?.success && Array.isArray(json.data)) {
          const list = (json.data as ApiMessage[]).map((m) => toUi(m, currentUserId))
          if (list.length === 0) return
          setMessages((prev) => {
            const seen = new Set(prev.map((x) => x.id))
            const additions = list.filter((m) => !seen.has(m.id))
            if (additions.length === 0) return prev
            return [...prev, ...additions]
          })
        }
      } catch {
        /* network blip */
      }
    }

    const id = window.setInterval(poll, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [activeChatId, currentUserId, realtime])

  // Polling fallback for chat list
  useEffect(() => {
    if (sessionStatus !== 'authenticated') return
    let cancelled = false
    const id = window.setInterval(() => {
      if (cancelled) return
      void refreshChats()
    }, 25_000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [sessionStatus, refreshChats])

  // ─── Selecting a chat (also updates the URL) ──────────────────────────
  const selectChat = useCallback(
    (chatId: string) => {
      setActiveChatId(chatId)
      setMobileShowConvo(false)
      router.replace(`/${locale}/messaging?chat=${encodeURIComponent(chatId)}`, { scroll: false })
    },
    [locale, router],
  )

  // ─── Sending a message (optimistic + WS reconciliation) ───────────────
  const sendMessage = useCallback(
    async (body: string) => {
      if (!activeChatId) return
      const clientId = generateClientId()
      const now = new Date().toISOString()
      const optimistic: UiMessage = {
        id: `pending_${clientId}`,
        client_id: clientId,
        body,
        type: 'text',
        file_url: null,
        created_at: now,
        is_mine: true,
        is_read: false,
        sender: currentUser
          ? {
              id: currentUser.id ?? '',
              name: currentUser.name ?? '',
              avatar: currentUser.avatar_url ?? currentUser.avatar ?? null,
            }
          : null,
        status: 'sending',
      }
      setMessages((prev) => [...prev, optimistic])

      try {
        const res = await fetch(`/api/chats/${encodeURIComponent(activeChatId)}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ body, client_id: clientId }),
        })
        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.success || !json?.data) {
          throw new Error(json?.message || `HTTP ${res.status}`)
        }
        const persisted = json.data as ApiMessage
        setMessages((prev) =>
          prev.map((m) =>
            m.client_id === clientId ? toUi({ ...persisted, client_id: clientId }, currentUserId) : m,
          ),
        )
        playSendSound()
        // Also refresh chat list so the snippet/last_message_at update.
        void refreshChats()
      } catch (err) {
        console.error('messaging: send failed', err)
        setMessages((prev) =>
          prev.map((m) => (m.client_id === clientId ? { ...m, status: 'failed' } : m)),
        )
        showToast({ kind: 'danger', text: t('messaging.errors.send', locale) })
      }
    },
    [activeChatId, currentUser, currentUserId, locale, refreshChats, showToast],
  )

  const retryMessage = useCallback(
    (clientId: string) => {
      const failed = messages.find((m) => m.client_id === clientId && m.status === 'failed')
      if (!failed) return
      // Drop the failed bubble, then resend the same body
      setMessages((prev) => prev.filter((m) => m.client_id !== clientId))
      void sendMessage(failed.body)
    },
    [messages, sendMessage],
  )

  // Notify backend that the user is typing (best-effort, throttled).
  const notifyTyping = useCallback(() => {
    if (!activeChatId) return
    void fetch(`/api/chats/${encodeURIComponent(activeChatId)}/typing`, { method: 'POST' }).catch(() => {})
  }, [activeChatId])

  // ─── Action handlers (wrapped in confirm dialogs) ─────────────────────
  const performAction = useCallback(
    async (path: string, body?: unknown) => {
      if (!activeChatId) return null
      const res = await fetch(`/api/chats/${encodeURIComponent(activeChatId)}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || `HTTP ${res.status}`)
      }
      return json.data ?? null
    },
    [activeChatId],
  )

  const onConfirmClear = useCallback(async () => {
    if (!activeChatId) return
    setConfirmBusy(true)
    try {
      const updated = (await performAction('clear')) as ChatType | null
      setMessages([])
      if (updated) setActiveChat(updated)
      void refreshChats()
      playActionSound()
      showToast({ kind: 'success', text: t('messaging.banner.cleared', locale) })
    } catch (err) {
      console.error(err)
      showToast({ kind: 'danger', text: t('messaging.errors.send', locale) })
    } finally {
      setConfirmBusy(false)
      setConfirmKind(null)
    }
  }, [activeChatId, locale, performAction, refreshChats, showToast])

  const onConfirmClose = useCallback(async () => {
    if (!activeChatId) return
    setConfirmBusy(true)
    try {
      const updated = (await performAction('close')) as ChatType | null
      if (updated) setActiveChat(updated)
      void refreshChats()
      playActionSound()
      showToast({ kind: 'success', text: t('messaging.banner.closed', locale) })
    } catch (err) {
      console.error(err)
      showToast({ kind: 'danger', text: t('messaging.errors.send', locale) })
    } finally {
      setConfirmBusy(false)
      setConfirmKind(null)
    }
  }, [activeChatId, locale, performAction, refreshChats, showToast])

  const onReopen = useCallback(async () => {
    try {
      const updated = (await performAction('reopen')) as ChatType | null
      if (updated) setActiveChat(updated)
      void refreshChats()
    } catch (err) {
      console.error(err)
    }
  }, [performAction, refreshChats])

  const onConfirmBlock = useCallback(async () => {
    if (!activeChatId) return
    setConfirmBusy(true)
    try {
      const updated = (await performAction('block')) as ChatType | null
      if (updated) setActiveChat(updated)
      void refreshChats()
      playActionSound()
      showToast({ kind: 'success', text: t('messaging.banner.blockedByYou', locale) })
    } catch (err) {
      console.error(err)
      showToast({ kind: 'danger', text: t('messaging.errors.send', locale) })
    } finally {
      setConfirmBusy(false)
      setConfirmKind(null)
    }
  }, [activeChatId, locale, performAction, refreshChats, showToast])

  const onUnblock = useCallback(async () => {
    try {
      const updated = (await performAction('unblock')) as ChatType | null
      if (updated) setActiveChat(updated)
      void refreshChats()
    } catch (err) {
      console.error(err)
    }
  }, [performAction, refreshChats])

  const onConfirmDelete = useCallback(async () => {
    if (!activeChatId) return
    setConfirmBusy(true)
    try {
      const res = await fetch(`/api/chats/${encodeURIComponent(activeChatId)}`, { method: 'DELETE' })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || `HTTP ${res.status}`)
      setActiveChat(null)
      setActiveChatId(null)
      setMessages([])
      void refreshChats()
      playActionSound()
      router.replace(`/${locale}/messaging`, { scroll: false })
    } catch (err) {
      console.error(err)
      showToast({ kind: 'danger', text: t('messaging.errors.send', locale) })
    } finally {
      setConfirmBusy(false)
      setConfirmKind(null)
    }
  }, [activeChatId, locale, refreshChats, router, showToast])

  const onMarkRead = useCallback(async () => {
    if (!activeChatId) return
    void fetch(`/api/chats/${encodeURIComponent(activeChatId)}/read`, { method: 'POST' }).catch(() => {})
    setActiveChat((prev) => (prev ? { ...prev, unread_count: 0 } : prev))
    setChats((prev) =>
      prev.map((c) => (String(c.id) === activeChatId ? { ...c, unread_count: 0 } : c)),
    )
  }, [activeChatId])

  const onSubmitReport = useCallback(
    async (payload: { category: string; reason: string; description?: string }) => {
      if (!activeChatId) return
      setReportBusy(true)
      try {
        const res = await fetch(`/api/chats/${encodeURIComponent(activeChatId)}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.success) throw new Error(json?.message || `HTTP ${res.status}`)
        setReportOpen(false)
        playActionSound()
        showToast({ kind: 'success', text: t('messaging.report.success', locale) })
      } catch (err) {
        console.error(err)
        showToast({ kind: 'danger', text: t('messaging.report.error', locale) })
      } finally {
        setReportBusy(false)
      }
    },
    [activeChatId, locale, showToast],
  )

  // ─── Composer disabled state ──────────────────────────────────────────
  const composerDisabled = useMemo(() => {
    if (!activeChat) return true
    return Boolean(activeChat.is_closed) || Boolean(activeChat.is_blocked)
  }, [activeChat])

  const composerDisabledReason: 'closed' | 'blocked' | null = useMemo(() => {
    if (!activeChat) return null
    if (activeChat.is_closed) return 'closed'
    if (activeChat.is_blocked) return 'blocked'
    return null
  }, [activeChat])

  // ─── Confirm dialog content lookup ────────────────────────────────────
  const confirmConfig = useMemo(() => {
    switch (confirmKind) {
      case 'clear':
        return {
          title: t('messaging.confirm.clearTitle', locale),
          body: t('messaging.confirm.clearBody', locale),
          variant: 'primary' as const,
          onConfirm: onConfirmClear,
        }
      case 'close':
        return {
          title: t('messaging.confirm.closeTitle', locale),
          body: t('messaging.confirm.closeBody', locale),
          variant: 'danger' as const,
          onConfirm: onConfirmClose,
        }
      case 'block':
        return {
          title: t('messaging.confirm.blockTitle', locale),
          body: t('messaging.confirm.blockBody', locale),
          variant: 'danger' as const,
          onConfirm: onConfirmBlock,
        }
      case 'delete':
        return {
          title: t('messaging.confirm.deleteTitle', locale),
          body: t('messaging.confirm.deleteBody', locale),
          variant: 'danger' as const,
          onConfirm: onConfirmDelete,
        }
      default:
        return null
    }
  }, [confirmKind, locale, onConfirmBlock, onConfirmClear, onConfirmClose, onConfirmDelete])

  return (
    <main className={styles.shell}>
      <div className={styles.frame}>
        <aside
          className={styles.aside}
          data-collapsed={!mobileShowConvo && Boolean(activeChatId)}
        >
          <ConversationList
            chats={chats}
            loading={chatsLoading}
            activeChatId={activeChatId}
            currentUserId={currentUserId}
            locale={locale}
            onSelect={selectChat}
          />
        </aside>

        <section className={styles.main} data-hidden={mobileShowConvo}>
          {!activeChat ? (
            <EmptyState locale={locale} />
          ) : (
            <div className={styles.activeChatColumn}>
              <ChatHeader
                chat={activeChat}
                locale={locale}
                isTyping={showTyping}
                onBack={() => setMobileShowConvo(true)}
                onMarkRead={onMarkRead}
                onClear={() => setConfirmKind('clear')}
                onCloseChat={() => setConfirmKind('close')}
                onReopen={onReopen}
                onBlock={() => setConfirmKind('block')}
                onUnblock={onUnblock}
                onReport={() => setReportOpen(true)}
                onDelete={() => setConfirmKind('delete')}
              />

              {connection !== 'live' && activeChatId ? (
                <div className={`${styles.banner} ${styles.bannerInfo}`} role="status">
                  <span>
                    {connection === 'connecting'
                      ? t('messaging.banner.connecting', locale)
                      : t('messaging.banner.polling', locale)}
                  </span>
                </div>
              ) : (
                <div className={`${styles.banner} ${styles.bannerLive}`} role="status">
                  <span className={styles.bannerLiveDot} aria-hidden />
                  <span>{t('messaging.banner.live', locale)}</span>
                </div>
              )}

              <MessageList
                messages={messages}
                loading={messagesLoading}
                showTyping={showTyping}
                locale={locale}
                onRetry={retryMessage}
              />

              <Composer
                locale={locale}
                disabled={composerDisabled}
                disabledReason={composerDisabledReason}
                onSend={sendMessage}
                onTyping={notifyTyping}
              />
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(confirmConfig)}
        title={confirmConfig?.title || ''}
        body={confirmConfig?.body}
        variant={confirmConfig?.variant}
        busy={confirmBusy}
        locale={locale}
        onConfirm={() => confirmConfig?.onConfirm()}
        onClose={() => setConfirmKind(null)}
      />

      <ReportDialog
        open={reportOpen}
        locale={locale}
        busy={reportBusy}
        onSubmit={onSubmitReport}
        onClose={() => setReportOpen(false)}
      />

      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.text}
            className={`${styles.toast} ${toast.kind === 'success' ? styles.toastSuccess : ''} ${toast.kind === 'danger' ? styles.toastDanger : ''}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            role="status"
          >
            {toast.text}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
