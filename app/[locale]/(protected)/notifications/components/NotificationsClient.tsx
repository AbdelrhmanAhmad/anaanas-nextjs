'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BsArrowRepeat,
  BsBellFill,
  BsBellSlash,
  BsBoxArrowInRight,
  BsBoxArrowRight,
  BsChatLeftTextFill,
  BsCheckAll,
  BsCheckCircleFill,
  BsHeartFill,
  BsKeyFill,
  BsMegaphoneFill,
  BsPersonPlusFill,
  BsShieldLockFill,
  BsStarFill,
} from 'react-icons/bs'
import type { IconType } from 'react-icons'

import type { SupportedLocale } from '@/lib/localization'

import styles from './notifications.module.css'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type NotificationItem = {
  id: number | string
  type?: string
  title: string
  body?: string
  url?: string | null
  is_read?: boolean
  created_at?: string | null
  data?: Record<string, unknown>
}

type Filter = 'all' | 'unread' | 'read'

type Meta = {
  current_page?: number | null
  next_page_url?: string | null
  prev_page_url?: string | null
}

type ApiResponse = {
  success?: boolean
  data?: NotificationItem[]
  meta?: Meta
  unread_count?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Type → icon + accent gradient mapping (mirrors the "category accents" in
// home/sections swipers so the visual language stays consistent).
// ─────────────────────────────────────────────────────────────────────────────

type AccentTuple = { icon: IconType; from: string; to: string; ring: string }

const TYPE_ACCENT: Record<string, AccentTuple> = {
  'auth.welcome':    { icon: BsStarFill,        from: '#FFC371', to: '#FF5F6D', ring: 'rgba(255, 95, 109, 0.35)' },
  'auth.login':      { icon: BsBoxArrowInRight, from: '#43E97B', to: '#38F9D7', ring: 'rgba(56, 249, 215, 0.35)' },
  'auth.logout':     { icon: BsBoxArrowRight,   from: '#9CA3AF', to: '#4B5563', ring: 'rgba(75, 85, 99, 0.30)'  },
  'auth.password_reset_requested': { icon: BsKeyFill,        from: '#F6D365', to: '#FDA085', ring: 'rgba(253, 160, 133, 0.35)' },
  'auth.password_changed':         { icon: BsShieldLockFill, from: '#667EEA', to: '#764BA2', ring: 'rgba(118, 75, 162, 0.35)'  },
  'post.comment':    { icon: BsChatLeftTextFill, from: '#4FACFE', to: '#00F2FE', ring: 'rgba(79, 172, 254, 0.35)' },
  'post.reaction':   { icon: BsHeartFill,        from: '#FF6B6B', to: '#FFC371', ring: 'rgba(255, 107, 107, 0.35)' },
  'chat.message':    { icon: BsChatLeftTextFill, from: '#5EE7DF', to: '#B490CA', ring: 'rgba(180, 144, 202, 0.35)' },
  'follow.new_post': { icon: BsMegaphoneFill,    from: '#FAD961', to: '#F76B1C', ring: 'rgba(247, 107, 28, 0.35)'  },
  'follow.new_user': { icon: BsPersonPlusFill,   from: '#A18CD1', to: '#FBC2EB', ring: 'rgba(161, 140, 209, 0.35)' },
}

const DEFAULT_ACCENT: AccentTuple = {
  icon: BsBellFill,
  from: '#FFE259',
  to: '#FFA751',
  ring: 'rgba(255, 167, 81, 0.35)',
}

const accentFor = (type?: string): AccentTuple => {
  if (!type) return DEFAULT_ACCENT
  if (TYPE_ACCENT[type]) return TYPE_ACCENT[type]
  // Bucket by namespace prefix as a fallback ("post.x" → post.comment accent, etc.)
  const namespace = type.split('.')[0]
  const fallback = Object.entries(TYPE_ACCENT).find(([k]) => k.startsWith(namespace + '.'))
  return fallback ? fallback[1] : DEFAULT_ACCENT
}

// ─────────────────────────────────────────────────────────────────────────────
// Localized helpers
// ─────────────────────────────────────────────────────────────────────────────

const buildCopy = (locale: SupportedLocale) =>
  locale === 'ar'
    ? {
        title: 'الإشعارات',
        subtitle: 'كل ما يخصّك في مكان واحد',
        filterAll: 'الكل',
        filterUnread: 'غير مقروءة',
        filterRead: 'مقروءة',
        markAll: 'تحديد الكل كمقروء',
        refresh: 'تحديث',
        emptyTitle: 'لا توجد إشعارات بعد',
        emptyBody: 'سنخبرك هنا بأي تفاعل، رسالة، أو تحديث مهم على حسابك.',
        loadMore: 'تحميل المزيد',
        loadingMore: 'جارٍ التحميل...',
        unreadBadge: 'جديد',
        unreadOne: 'إشعار واحد غير مقروء',
        unreadFew: 'إشعارات غير مقروءة',
        noMore: 'لقد وصلت إلى النهاية',
      }
    : {
        title: 'Notifications',
        subtitle: 'Everything that matters, in one place',
        filterAll: 'All',
        filterUnread: 'Unread',
        filterRead: 'Read',
        markAll: 'Mark all as read',
        refresh: 'Refresh',
        emptyTitle: 'No notifications yet',
        emptyBody: 'We’ll let you know here whenever someone interacts with you or your account.',
        loadMore: 'Load more',
        loadingMore: 'Loading...',
        unreadBadge: 'New',
        unreadOne: '1 unread notification',
        unreadFew: 'unread notifications',
        noMore: 'You’re all caught up',
      }

// Localized relative time. Falls back to a short ISO-ish string if Intl is
// unavailable (very rare in modern browsers).
const formatRelativeTime = (input: string | null | undefined, locale: SupportedLocale): string => {
  if (!input) return ''
  const ts = Date.parse(input)
  if (Number.isNaN(ts)) return ''

  const now = Date.now()
  const diffSec = Math.round((ts - now) / 1000)
  const absSec = Math.abs(diffSec)

  try {
    const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar' : 'en', { numeric: 'auto' })
    const STEPS: Array<{ unit: Intl.RelativeTimeFormatUnit; secs: number }> = [
      { unit: 'second', secs: 60 },
      { unit: 'minute', secs: 60 * 60 },
      { unit: 'hour', secs: 60 * 60 * 24 },
      { unit: 'day', secs: 60 * 60 * 24 * 7 },
      { unit: 'week', secs: 60 * 60 * 24 * 30 },
      { unit: 'month', secs: 60 * 60 * 24 * 365 },
    ]
    for (const { unit, secs } of STEPS) {
      if (absSec < secs) {
        const div =
          unit === 'second' ? 1
          : unit === 'minute' ? 60
          : unit === 'hour' ? 3600
          : unit === 'day' ? 86400
          : unit === 'week' ? 86400 * 7
          : 86400 * 30
        return rtf.format(Math.round(diffSec / div), unit)
      }
    }
    return rtf.format(Math.round(diffSec / (86400 * 365)), 'year')
  } catch {
    return new Date(ts).toLocaleString(locale === 'ar' ? 'ar' : 'en')
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const PER_PAGE = 20
const POLL_MS = 30_000

export default function NotificationsClient({ locale }: { locale: SupportedLocale }) {
  const isArabic = locale === 'ar'
  const copy = useMemo(() => buildCopy(locale), [locale])

  const [items, setItems] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true) // initial load
  const [appending, setAppending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Used to dedupe items across paginated fetches and prevent the same row
  // appearing twice if the polling fetch overlaps with a "load more".
  const idIndexRef = useRef<Set<string>>(new Set())

  const visibleItems = useMemo(() => {
    if (filter === 'all') return items
    if (filter === 'unread') return items.filter((n) => !n.is_read)
    return items.filter((n) => n.is_read)
  }, [items, filter])

  // ─── data loading ─────────────────────────────────────────────────────────

  const fetchPage = useCallback(
    async (
      targetPage: number,
      mode: 'replace' | 'append' | 'refresh',
    ): Promise<void> => {
      if (mode === 'replace') setLoading(true)
      if (mode === 'append') setAppending(true)
      if (mode === 'refresh') setRefreshing(true)
      setError(null)

      try {
        const res = await fetch(
          `/api/notifications?per_page=${PER_PAGE}&page=${targetPage}&land=${locale}`,
          { method: 'GET', headers: { Accept: 'application/json' }, cache: 'no-store' },
        )
        const json = (await res.json().catch(() => ({}))) as ApiResponse
        if (!res.ok || !json?.success) {
          throw new Error('REQUEST_FAILED')
        }

        const incoming = Array.isArray(json.data) ? json.data : []
        const meta = json.meta ?? {}
        const nextHasMore = Boolean(meta.next_page_url)

        if (mode === 'replace' || mode === 'refresh') {
          idIndexRef.current = new Set(incoming.map((n) => String(n.id)))
          setItems(incoming)
        } else {
          // append, but skip duplicates
          const fresh = incoming.filter((n) => !idIndexRef.current.has(String(n.id)))
          fresh.forEach((n) => idIndexRef.current.add(String(n.id)))
          setItems((prev) => [...prev, ...fresh])
        }

        setHasMore(nextHasMore)
        setUnread(Number(json.unread_count ?? 0))
        setPage(targetPage)
      } catch {
        setError('LOAD_ERROR')
      } finally {
        setLoading(false)
        setAppending(false)
        setRefreshing(false)
      }
    },
    [locale],
  )

  // Initial load + reload on locale change.
  useEffect(() => {
    void fetchPage(1, 'replace')
  }, [fetchPage])

  // Background refresh every POLL_MS to surface new rows. We only refresh page
  // 1 to keep the list stable for users currently scrolling.
  useEffect(() => {
    const id = window.setInterval(() => {
      void fetchPage(1, 'refresh')
    }, POLL_MS)
    return () => window.clearInterval(id)
  }, [fetchPage])

  // ─── mutations ────────────────────────────────────────────────────────────

  const markRead = useCallback(async (id: NotificationItem['id']) => {
    // optimistic
    setItems((prev) =>
      prev.map((n) => (String(n.id) === String(id) && !n.is_read ? { ...n, is_read: true } : n)),
    )
    setUnread((u) => Math.max(0, u - 1))
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({}),
      })
    } catch {
      /* swallow — next poll will resync */
    }
  }, [])

  const markAllRead = useCallback(async () => {
    if (unread === 0) return
    // optimistic
    setItems((prev) => prev.map((n) => (n.is_read ? n : { ...n, is_read: true })))
    setUnread(0)
    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({}),
      })
    } catch {
      /* next poll will resync */
    }
  }, [unread])

  const handleRefresh = useCallback(() => {
    void fetchPage(1, 'refresh')
  }, [fetchPage])

  const handleLoadMore = useCallback(() => {
    if (appending || !hasMore) return
    void fetchPage(page + 1, 'append')
  }, [appending, hasMore, page, fetchPage])

  // ─── render helpers ───────────────────────────────────────────────────────

  const Skeleton = (
    <div className={styles.list}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`${styles.row} ${styles.skeletonRow}`}>
          <div className={styles.skeletonCircle} />
          <div className={styles.skeletonBody}>
            <div className={`${styles.skeletonBar} ${styles.skeletonBarLg}`} />
            <div className={`${styles.skeletonBar} ${styles.skeletonBarMd}`} />
            <div className={`${styles.skeletonBar} ${styles.skeletonBarSm}`} />
          </div>
        </div>
      ))}
    </div>
  )

  const Empty = (
    <motion.div
      key="empty"
      className={styles.emptyState}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.emptyIcon}>
        <BsBellSlash aria-hidden />
      </div>
      <h3 className={styles.emptyTitle}>{copy.emptyTitle}</h3>
      <p className={styles.emptyBody}>{copy.emptyBody}</p>
    </motion.div>
  )

  // ─── render ───────────────────────────────────────────────────────────────

  return (
    <main className={styles.page} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className={styles.container}>
        <motion.section
          className={styles.shell}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* ───── Header ───── */}
          <header className={styles.header}>
            <div className={styles.headerMain}>
              <div className={styles.headerIcon} aria-hidden>
                <BsBellFill />
                {unread > 0 && <span className={styles.headerIconPulse} />}
              </div>
              <div className={styles.headerText}>
                <h1 className={styles.headerTitle}>{copy.title}</h1>
                <p className={styles.headerSubtitle}>
                  {unread > 0
                    ? unread === 1
                      ? copy.unreadOne
                      : `${unread} ${copy.unreadFew}`
                    : copy.subtitle}
                </p>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={handleRefresh}
                disabled={refreshing || loading}
                aria-label={copy.refresh}
                title={copy.refresh}
              >
                <BsArrowRepeat className={refreshing ? styles.spin : undefined} />
              </button>
              <button
                type="button"
                className={styles.markAllButton}
                onClick={markAllRead}
                disabled={unread === 0}
              >
                <BsCheckAll aria-hidden />
                <span>{copy.markAll}</span>
              </button>
            </div>
          </header>

          {/* ───── Filters ───── */}
          <div role="tablist" className={styles.tabs}>
            {(['all', 'unread', 'read'] as const).map((f) => {
              const isActive = filter === f
              const label = f === 'all' ? copy.filterAll : f === 'unread' ? copy.filterUnread : copy.filterRead
              const count = f === 'all' ? items.length : f === 'unread' ? unread : items.length - unread
              return (
                <button
                  key={f}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                  onClick={() => setFilter(f)}
                >
                  <span>{label}</span>
                  {Number.isFinite(count) && count > 0 && (
                    <span className={styles.tabCount}>{count > 99 ? '99+' : count}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ───── Body ───── */}
          <div className={styles.body}>
            {loading && items.length === 0 ? (
              Skeleton
            ) : visibleItems.length === 0 ? (
              <AnimatePresence mode="wait">{Empty}</AnimatePresence>
            ) : (
              <ul className={styles.list}>
                <AnimatePresence initial={false}>
                  {visibleItems.map((n) => {
                    const accent = accentFor(n.type)
                    const Icon = accent.icon
                    const href = n.url
                      ? n.url.startsWith('/')
                        ? `/${locale}${n.url}`
                        : n.url
                      : undefined
                    const time = formatRelativeTime(n.created_at, locale)

                    const cardInner = (
                      <>
                        <span
                          className={styles.iconBubble}
                          style={
                            {
                              '--accent-from': accent.from,
                              '--accent-to': accent.to,
                              '--accent-ring': accent.ring,
                            } as React.CSSProperties
                          }
                          aria-hidden
                        >
                          <Icon />
                          <span className={styles.iconShine} />
                        </span>

                        <div className={styles.rowBody}>
                          <div className={styles.rowTop}>
                            <h3 className={styles.rowTitle}>{n.title}</h3>
                            {!n.is_read && <span className={styles.unreadDot} aria-hidden />}
                          </div>
                          {n.body ? <p className={styles.rowText}>{n.body}</p> : null}
                          <div className={styles.rowFoot}>
                            {time && <span className={styles.rowTime}>{time}</span>}
                            {!n.is_read && (
                              <span className={styles.rowNewBadge}>{copy.unreadBadge}</span>
                            )}
                          </div>
                        </div>
                      </>
                    )

                    const commonClassName = `${styles.row} ${n.is_read ? '' : styles.rowUnread}`

                    return (
                      <motion.li
                        key={String(n.id)}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {href ? (
                          <Link
                            href={href}
                            className={commonClassName}
                            onClick={() => void markRead(n.id)}
                          >
                            {cardInner}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className={`${commonClassName} ${styles.rowAsButton}`}
                            onClick={() => void markRead(n.id)}
                          >
                            {cardInner}
                          </button>
                        )}
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            )}

            {/* ───── Footer ───── */}
            {visibleItems.length > 0 && (
              <div className={styles.footer}>
                {hasMore ? (
                  <button
                    type="button"
                    className={styles.loadMoreBtn}
                    onClick={handleLoadMore}
                    disabled={appending}
                  >
                    {appending ? (
                      <>
                        <BsArrowRepeat className={styles.spin} aria-hidden />
                        <span>{copy.loadingMore}</span>
                      </>
                    ) : (
                      <>
                        <span>{copy.loadMore}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <p className={styles.endOfList}>
                    <BsCheckCircleFill aria-hidden />
                    <span>{copy.noMore}</span>
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className={styles.errorBanner} role="alert">
                {isArabic
                  ? 'حدث خطأ أثناء تحميل الإشعارات. حاول مرة أخرى.'
                  : 'Could not load notifications. Please try again.'}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </main>
  )
}
