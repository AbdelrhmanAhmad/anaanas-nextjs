'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { BsBellFill, BsBellSlashFill, BsXLg } from 'react-icons/bs'

import {
  broadcastDomEventName,
  ensureBroadcastSocket,
  subscribeToChannel,
  unsubscribeFromChannel,
} from '@/lib/realtime/broadcastSocket'
import { fetchPostById } from '@/lib/api/posts'
import { dispatchPostCreated } from '@/lib/postCreated'
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import { isSupportedLocale, type SupportedLocale, DEFAULT_LOCALE } from '@/lib/localization'
import { useCurrentUser } from '@/context/useCurrentUser'
import { t } from '@/lib/translations'
import styles from './NewPostAlert.module.css'

type NewPostPayload = {
  post_id: number | string
  section_id?: number
  category_id?: number
  country_id?: number
  country_code?: string | null
  title?: string
  author_id?: number
  author_name?: string | null
  url?: string
  created_at?: string
}

type DisplayPost = {
  id: number | string
  title: string
  authorName: string
  imageUrl: string | null
  url: string
}

const PREF_STORAGE_KEY = 'ananas_new_post_alerts_enabled'
const TOAST_AUTO_DISMISS_MS = 9_000
// Each toast hangs around for at most this many milliseconds in case the user
// has muted alerts but later wants to re-enable them — this is the small
// floating "alerts off" pill that lives in the corner.
const MUTED_PILL_HIDE_MS = 6_000

function readPreference(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const raw = window.localStorage.getItem(PREF_STORAGE_KEY)
    if (raw === null) return true
    return raw !== '0' && raw !== 'false'
  } catch {
    return true
  }
}

function writePreference(enabled: boolean) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREF_STORAGE_KEY, enabled ? '1' : '0')
  } catch {
    // ignore quota errors
  }
}

function pickPostImage(post: any): string | null {
  if (!post) return null
  const candidates: any[] = []
  if (Array.isArray(post.post_images)) candidates.push(...post.post_images)
  if (Array.isArray(post.postImages)) candidates.push(...post.postImages)
  if (post.main_image) candidates.push({ image: post.main_image })

  for (const c of candidates) {
    const raw = typeof c === 'string' ? c : c?.image || c?.url || c?.image_url || null
    if (raw) {
      const resolved = resolveMediaUrl(raw)
      if (resolved) return resolved
    }
  }
  return null
}

function pickAuthorName(post: any, fallback?: string | null): string {
  if (!post) return fallback || ''
  const candidate =
    post.user?.name ||
    post.user?.username ||
    post.author?.name ||
    post.author_name ||
    null
  return (candidate || fallback || '').toString()
}

function buildDisplayPost(payload: NewPostPayload, post: any, locale: SupportedLocale): DisplayPost {
  const id = post?.id ?? payload.post_id
  const title = (post?.title || payload.title || '').toString().trim()
  const authorName = pickAuthorName(post, payload.author_name)
  const imageUrl = pickPostImage(post)
  const url = `/${locale}${payload.url || `/post/${id}`}`
  return { id, title, authorName, imageUrl, url }
}

type ToastItem = {
  id: string
  post: DisplayPost
}

export default function NewPostRealtime() {
  const params = useParams<{ locale?: string }>()
  const localeParam = (params?.locale as string | undefined)?.toLowerCase()
  const locale: SupportedLocale = isSupportedLocale(localeParam || '')
    ? (localeParam as SupportedLocale)
    : DEFAULT_LOCALE

  const { user } = useCurrentUser()
  const currentUserId = user?.id != null ? String(user.id) : null

  const [enabled, setEnabled] = useState<boolean>(true)
  const enabledRef = useRef<boolean>(true)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const seenPostIdsRef = useRef<Set<string>>(new Set())
  const dismissTimersRef = useRef<Map<string, number>>(new Map())
  const [showMutedPill, setShowMutedPill] = useState<boolean>(false)
  const mutedPillTimerRef = useRef<number | null>(null)

  // Load preference on mount
  useEffect(() => {
    const initial = readPreference()
    setEnabled(initial)
    enabledRef.current = initial
  }, [])

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  // Subscribe to country + global channels based on the current subdomain
  useEffect(() => {
    if (typeof window === 'undefined') return
    const host = window.location.hostname
    const labels = host.split('.').filter(Boolean)
    const subdomain = labels.length > 1 ? labels[0]!.toLowerCase() : null

    const channels = ['global']
    if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      channels.push(`country:${subdomain}`)
    }

    ensureBroadcastSocket()
    for (const ch of channels) subscribeToChannel(ch)

    return () => {
      for (const ch of channels) unsubscribeFromChannel(ch)
    }
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = dismissTimersRef.current.get(id)
    if (timer != null) {
      window.clearTimeout(timer)
      dismissTimersRef.current.delete(id)
    }
  }, [])

  const handleNewPostBroadcast = useCallback(
    async (ev: Event) => {
      const detail = (ev as CustomEvent<{ payload?: NewPostPayload }>).detail
      const payload = detail?.payload
      if (!payload || payload.post_id == null) return

      const postIdStr = String(payload.post_id)

      // Whether the current user authored the post. We still want to push it
      // into other open feeds for the same user (e.g. another tab), but we
      // never show them a self-toast since they obviously know they posted.
      const isOwnPost = Boolean(
        currentUserId && payload.author_id != null && String(payload.author_id) === currentUserId,
      )

      // De-dupe in the same session so a republish doesn't spam the user.
      if (seenPostIdsRef.current.has(postIdStr)) return
      seenPostIdsRef.current.add(postIdStr)

      const fullPost = await fetchPostById(postIdStr, { land: locale })
      if (!fullPost) return

      // Always dispatch to local listeners (PostsList, PaginatedPosts,
      // ProfilePostsFeed) so the post appears in the active feed if any.
      // The hosts decide whether the post matches their active filters.
      dispatchPostCreated(fullPost as any, 'realtime')

      // Suppress visual toast for own-posts and when alerts are off; the feed
      // insertion above already handles updating the visible list.
      if (isOwnPost) return

      if (!enabledRef.current) {
        setShowMutedPill(true)
        if (mutedPillTimerRef.current != null) window.clearTimeout(mutedPillTimerRef.current)
        mutedPillTimerRef.current = window.setTimeout(() => setShowMutedPill(false), MUTED_PILL_HIDE_MS)
        return
      }

      const display = buildDisplayPost(payload, fullPost, locale)
      const id = `${postIdStr}-${Date.now()}`
      setToasts((prev) => [{ id, post: display }, ...prev].slice(0, 3))

      const timer = window.setTimeout(() => dismissToast(id), TOAST_AUTO_DISMISS_MS)
      dismissTimersRef.current.set(id, timer)
    },
    [currentUserId, locale, dismissToast],
  )

  // Bind once per component lifecycle; the handler refs stay stable via refs.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const eventName = broadcastDomEventName('post.created')
    window.addEventListener(eventName, handleNewPostBroadcast as EventListener)
    return () => {
      window.removeEventListener(eventName, handleNewPostBroadcast as EventListener)
      // Clean up dismiss timers on unmount.
      dismissTimersRef.current.forEach((timer) => window.clearTimeout(timer))
      dismissTimersRef.current.clear()
      if (mutedPillTimerRef.current != null) {
        window.clearTimeout(mutedPillTimerRef.current)
        mutedPillTimerRef.current = null
      }
    }
  }, [handleNewPostBroadcast])

  const turnOff = () => {
    setEnabled(false)
    writePreference(false)
    setToasts([])
    setShowMutedPill(true)
    if (mutedPillTimerRef.current != null) window.clearTimeout(mutedPillTimerRef.current)
    mutedPillTimerRef.current = window.setTimeout(() => setShowMutedPill(false), MUTED_PILL_HIDE_MS)
  }

  const turnOn = () => {
    setEnabled(true)
    writePreference(true)
    setShowMutedPill(false)
    if (mutedPillTimerRef.current != null) {
      window.clearTimeout(mutedPillTimerRef.current)
      mutedPillTimerRef.current = null
    }
  }

  return (
    <div className={styles.host} aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.article
            key={toast.id}
            className={styles.toast}
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <button
              type="button"
              className={styles.closeIcon}
              onClick={() => dismissToast(toast.id)}
              aria-label={t('realtime.newPost.dismiss', locale)}
            >
              <BsXLg aria-hidden />
            </button>
            <div className={styles.body}>
              <div className={styles.thumb}>
                {toast.post.imageUrl ? (
                  // Plain <img> avoids the next/image domain config friction
                  // for arbitrary S3/CDN hosts in this floating UI.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={toast.post.imageUrl} alt="" />
                ) : (
                  <span aria-hidden>🍍</span>
                )}
                <span className={styles.thumbBadge} aria-hidden>
                  <BsBellFill />
                </span>
              </div>
              <div className={styles.content}>
                <h6 className={styles.title}>
                  <span className={styles.live} aria-hidden>
                    {t('realtime.newPost.title', locale)}
                  </span>
                </h6>
                <p className={styles.subtitle}>
                  {toast.post.title || t('realtime.newPost.subtitle', locale)}
                </p>
                {toast.post.authorName ? (
                  <div className={styles.meta}>
                    <span className={styles.metaItem}>
                      {t('realtime.newPost.byAuthor', locale)} <strong>{toast.post.authorName}</strong>
                    </span>
                    <span className={styles.metaItem}>· {t('realtime.newPost.justNow', locale)}</span>
                  </div>
                ) : null}
                <div className={styles.actions}>
                  <Link
                    href={toast.post.url}
                    className={styles.viewBtn}
                    onClick={() => dismissToast(toast.id)}
                  >
                    {t('realtime.newPost.viewNow', locale)}
                  </Link>
                  <button
                    type="button"
                    className={styles.dismissBtn}
                    onClick={() => dismissToast(toast.id)}
                  >
                    {t('realtime.newPost.dismiss', locale)}
                  </button>
                  <button
                    type="button"
                    className={styles.disableBtn}
                    onClick={turnOff}
                  >
                    <BsBellSlashFill aria-hidden /> {t('realtime.newPost.disable', locale)}
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {!enabled && showMutedPill && (
          <motion.button
            type="button"
            className={styles.muted}
            onClick={turnOn}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
          >
            <span className={styles.liveIcon} />
            {t('realtime.newPost.disabledHint', locale)} · {t('realtime.newPost.enable', locale)}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
