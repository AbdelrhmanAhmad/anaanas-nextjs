'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import {
  BsBellFill,
  BsBellSlash,
  BsBoxArrowInRight,
  BsBoxArrowRight,
  BsChatLeftTextFill,
  BsCheck2All,
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
import { t } from '@/lib/translations'

import styles from './NotificationsBell.module.css'

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
}

// ─────────────────────────────────────────────────────────────────────────────
// Type → icon + accent gradient mapping (kept in sync with the full
// /notifications page for a unified visual language).
// ─────────────────────────────────────────────────────────────────────────────

type AccentTuple = { icon: IconType; from: string; to: string; ring: string }

const TYPE_ACCENT: Record<string, AccentTuple> = {
  'auth.welcome':                  { icon: BsStarFill,        from: '#FFC371', to: '#FF5F6D', ring: 'rgba(255, 95, 109, 0.35)' },
  'auth.login':                    { icon: BsBoxArrowInRight, from: '#43E97B', to: '#38F9D7', ring: 'rgba(56, 249, 215, 0.35)' },
  'auth.logout':                   { icon: BsBoxArrowRight,   from: '#9CA3AF', to: '#4B5563', ring: 'rgba(75, 85, 99, 0.30)'  },
  'auth.password_reset_requested': { icon: BsKeyFill,         from: '#F6D365', to: '#FDA085', ring: 'rgba(253, 160, 133, 0.35)' },
  'auth.password_changed':         { icon: BsShieldLockFill,  from: '#667EEA', to: '#764BA2', ring: 'rgba(118, 75, 162, 0.35)'  },
  'post.comment':                  { icon: BsChatLeftTextFill, from: '#4FACFE', to: '#00F2FE', ring: 'rgba(79, 172, 254, 0.35)' },
  'post.reaction':                 { icon: BsHeartFill,        from: '#FF6B6B', to: '#FFC371', ring: 'rgba(255, 107, 107, 0.35)' },
  'chat.message':                  { icon: BsChatLeftTextFill, from: '#5EE7DF', to: '#B490CA', ring: 'rgba(180, 144, 202, 0.35)' },
  'follow.new_post':               { icon: BsMegaphoneFill,    from: '#FAD961', to: '#F76B1C', ring: 'rgba(247, 107, 28, 0.35)'  },
  'follow.new_user':               { icon: BsPersonPlusFill,   from: '#A18CD1', to: '#FBC2EB', ring: 'rgba(161, 140, 209, 0.35)' },
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
  const namespace = type.split('.')[0]
  const fallback = Object.entries(TYPE_ACCENT).find(([k]) => k.startsWith(namespace + '.'))
  return fallback ? fallback[1] : DEFAULT_ACCENT
}

// ─────────────────────────────────────────────────────────────────────────────
// Locale-aware relative time using Intl.RelativeTimeFormat.
// ─────────────────────────────────────────────────────────────────────────────

const formatRelativeTime = (input: string | null | undefined, locale: SupportedLocale, justNowLabel: string): string => {
  if (!input) return ''
  const ts = Date.parse(input)
  if (Number.isNaN(ts)) return ''
  const diffSec = Math.round((ts - Date.now()) / 1000)
  const absSec = Math.abs(diffSec)
  if (absSec < 30) return justNowLabel

  try {
    const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar' : 'en', { numeric: 'auto' })
    const STEPS: Array<{ unit: Intl.RelativeTimeFormatUnit; secs: number; div: number }> = [
      { unit: 'minute', secs: 60 * 60, div: 60 },
      { unit: 'hour',   secs: 60 * 60 * 24, div: 3600 },
      { unit: 'day',    secs: 60 * 60 * 24 * 7, div: 86400 },
      { unit: 'week',   secs: 60 * 60 * 24 * 30, div: 86400 * 7 },
      { unit: 'month',  secs: 60 * 60 * 24 * 365, div: 86400 * 30 },
    ]
    for (const { unit, secs, div } of STEPS) {
      if (absSec < secs) return rtf.format(Math.round(diffSec / div), unit)
    }
    return rtf.format(Math.round(diffSec / (86400 * 365)), 'year')
  } catch {
    return new Date(ts).toLocaleString(locale === 'ar' ? 'ar' : 'en')
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────

const dropdownVariants = {
  hidden:  { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 360, damping: 28 } },
  exit:    { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.12 } },
}

const listVariants = {
  visible: { transition: { staggerChildren: 0.04 } },
  hidden:  {},
}

const itemVariants = {
  hidden:  { opacity: 0, x: 0, y: 6 },
  visible: { opacity: 1, x: 0, y: 0, transition: { type: 'spring' as const, stiffness: 380, damping: 30 } },
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const POLL_MS = 15_000
const PER_PAGE = 8

export default function NotificationsBell({ locale }: { locale: SupportedLocale }) {
  const isArabic = locale === 'ar'

  const [items, setItems] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  // Track previous unread count to know when a *new* notification just arrived
  // → trigger a one-shot bell shake.
  const previousUnreadRef = useRef(0)
  const [shake, setShake] = useState(false)

  // ─── data ────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/notifications?per_page=${PER_PAGE}&land=${locale}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      if (json?.success) {
        setItems(Array.isArray(json.data) ? json.data : [])
        const nextUnread = Number(json.unread_count ?? 0)

        // If the unread count *grew*, we've received something new.
        if (nextUnread > previousUnreadRef.current) {
          setShake(true)
          window.setTimeout(() => setShake(false), 900)
        }
        previousUnreadRef.current = nextUnread
        setUnread(nextUnread)
      }
    } finally {
      setLoading(false)
    }
  }, [locale])

  useEffect(() => {
    void load()
    const id = window.setInterval(() => void load(), POLL_MS)
    return () => window.clearInterval(id)
  }, [load])

  // ─── mutations ────────────────────────────────────────────────────────────

  const markRead = useCallback(async (id: NotificationItem['id']) => {
    setItems((prev) => prev.map((n) => (String(n.id) === String(id) && !n.is_read ? { ...n, is_read: true } : n)))
    setUnread((u) => Math.max(0, u - 1))
    previousUnreadRef.current = Math.max(0, previousUnreadRef.current - 1)
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({}),
      })
    } catch { /* polling will resync */ }
  }, [])

  const markAll = useCallback(async () => {
    if (unread === 0) return
    setItems((prev) => prev.map((n) => (n.is_read ? n : { ...n, is_read: true })))
    setUnread(0)
    previousUnreadRef.current = 0
    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({}),
      })
    } catch { /* polling will resync */ }
  }, [unread])

  // ─── localized strings (centralised i18n) ─────────────────────────────────

  const labels = useMemo(
    () => ({
      title:        t('notifications.title', locale),
      empty:        t('notifications.empty', locale),
      emptyHint:    t('notifications.emptyHint', locale),
      viewAll:      t('notifications.viewAll', locale),
      markAll:      t('notifications.markAll', locale),
      markAllShort: t('notifications.markAllShort', locale),
      unreadOne:    t('notifications.unreadOne', locale),
      unreadFew:    t('notifications.unreadFew', locale),
      allCaughtUp:  t('notifications.allCaughtUp', locale),
      loading:      t('notifications.loading', locale),
      justNow:      t('notifications.justNow', locale),
      openBell:     t('notifications.openBell', locale),
      closeBell:    t('notifications.closeBell', locale),
      newBadge:     t('notifications.newBadge', locale),
    }),
    [locale],
  )

  const unreadLabel = unread === 1 ? labels.unreadOne : `${unread} ${labels.unreadFew}`

  // ─── render ──────────────────────────────────────────────────────────────

  return (
    <Dropdown
      as="li"
      autoClose="outside"
      className={`nav-item ms-2 ${styles.bellRoot}`}
      align="end"
      onToggle={(next) => setOpen(Boolean(next))}
      show={open}
    >
      <DropdownToggle
        className={`content-none nav-link bg-light icon-md btn btn-light p-0 ${styles.toggle}`}
        aria-label={open ? labels.closeBell : labels.openBell}
      >
        <motion.span
          className={styles.bellWrap}
          animate={shake ? { rotate: [0, -16, 14, -10, 8, -4, 0] } : { rotate: 0 }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
        >
          <BsBellFill size={15} aria-hidden />
        </motion.span>

        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              className={styles.badge}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring' as const, stiffness: 600, damping: 20 }}
            >
              {unread > 99 ? '99+' : unread}
            </motion.span>
          )}
        </AnimatePresence>

        {unread > 0 && <span className={styles.bellHalo} aria-hidden />}
      </DropdownToggle>

      <DropdownMenu
        renderOnMount
        className={`p-0 border-0 shadow-none ${styles.menu}`}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              key="menu"
              dir={isArabic ? 'rtl' : 'ltr'}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.menuInner}
            >
              {/* Header */}
              <div className={styles.menuHeader}>
                <div className={styles.menuHeaderLeft}>
                  <span className={styles.menuHeaderIcon} aria-hidden>
                    <BsBellFill />
                  </span>
                  <div className={styles.menuHeaderText}>
                    <strong className={styles.menuTitle}>{labels.title}</strong>
                    <span className={styles.menuSubtitle}>
                      {unread > 0 ? unreadLabel : labels.allCaughtUp}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.markAllBtn}
                  onClick={() => void markAll()}
                  disabled={unread === 0}
                  title={labels.markAll}
                >
                  <BsCheck2All aria-hidden />
                  <span>{labels.markAllShort}</span>
                </button>
              </div>

              {/* Body */}
              <div className={styles.menuBody}>
                {loading && items.length === 0 && (
                  <div className={styles.skeletonStack}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={styles.skeletonRow}>
                        <div className={styles.skeletonCircle} />
                        <div className={styles.skeletonText}>
                          <div className={`${styles.skeletonBar} ${styles.skeletonBarLg}`} />
                          <div className={`${styles.skeletonBar} ${styles.skeletonBarSm}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && items.length === 0 && (
                  <motion.div
                    className={styles.emptyState}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className={styles.emptyIcon} aria-hidden>
                      <BsBellSlash />
                    </span>
                    <strong className={styles.emptyTitle}>{labels.empty}</strong>
                    <span className={styles.emptyHint}>{labels.emptyHint}</span>
                  </motion.div>
                )}

                {items.length > 0 && (
                  <motion.ul
                    className={styles.list}
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {items.map((n) => {
                      const accent = accentFor(n.type)
                      const Icon = accent.icon
                      const href = n.url
                        ? n.url.startsWith('/')
                          ? `/${locale}${n.url}`
                          : n.url
                        : `/${locale}/notifications`
                      const time = formatRelativeTime(n.created_at, locale, labels.justNow)
                      const isUnread = !n.is_read

                      return (
                        <motion.li
                          key={String(n.id)}
                          variants={itemVariants}
                          className={isUnread ? styles.rowUnread : ''}
                        >
                          <Link
                            href={href}
                            className={styles.row}
                            onClick={() => void markRead(n.id)}
                          >
                            <span
                              className={styles.rowIcon}
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
                              <span className={styles.rowIconShine} />
                            </span>

                            <span className={styles.rowBody}>
                              <span className={styles.rowTitle}>{n.title}</span>
                              {n.body && <span className={styles.rowText}>{n.body}</span>}
                              <span className={styles.rowFoot}>
                                {time && <span className={styles.rowTime}>{time}</span>}
                                {isUnread && <span className={styles.rowNew}>{labels.newBadge}</span>}
                              </span>
                            </span>

                            {isUnread && <span className={styles.unreadDot} aria-hidden />}
                          </Link>
                        </motion.li>
                      )
                    })}
                  </motion.ul>
                )}

                {!loading && items.length > 0 && unread === 0 && (
                  <div className={styles.allReadFooter}>
                    <BsCheckCircleFill aria-hidden />
                    <span>{labels.allCaughtUp}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={styles.menuFooter}>
                <Link href={`/${locale}/notifications`} className={styles.viewAllLink} onClick={() => setOpen(false)}>
                  {labels.viewAll}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenu>
    </Dropdown>
  )
}
