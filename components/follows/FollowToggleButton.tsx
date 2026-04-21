'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'motion/react'
import { BsBellFill, BsCheckLg, BsPlusLg } from 'react-icons/bs'

import styles from './FollowToggleButton.module.css'

type Variant = 'default' | 'hero' | 'chip' | 'dark'

type Props = {
  target: 'section' | 'category'
  targetId: number | string
  locale?: 'ar' | 'en'
  className?: string
  /** Visual variant. `hero` is tuned for use on top of hero banners. */
  variant?: Variant
  /** Show follower count next to label (default: true). */
  showCount?: boolean
  /** Optional label override (e.g. "متابعة القسم"). */
  followLabel?: string
  followingLabel?: string
}

type StatusPayload = {
  is_following: boolean
  followers_count: number
  authenticated: boolean
}

/** Format follower counts like 12, 1.2K, 3.4M. */
function formatCount(n: number, locale: 'ar' | 'en') {
  if (!Number.isFinite(n) || n < 0) return '0'
  if (n < 1000) return locale === 'ar' ? n.toLocaleString('ar-EG') : String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, '')}K`
  return `${(n / 1_000_000).toFixed(n < 10_000_000 ? 1 : 0).replace(/\.0$/, '')}M`
}

export default function FollowToggleButton({
  target,
  targetId,
  locale = 'ar',
  className,
  variant = 'default',
  showCount = true,
  followLabel,
  followingLabel,
}: Props) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState<number>(0)
  const [ready, setReady] = useState(false)

  const basePath = useMemo(
    () => (target === 'section' ? `/api/sections/${targetId}/follow` : `/api/categories/${targetId}/follow`),
    [target, targetId],
  )

  const text = useMemo(
    () =>
      locale === 'ar'
        ? {
            follow: followLabel ?? 'متابعة',
            following: followingLabel ?? 'تتابع الآن',
            followers: 'متابع',
            signIn: 'سجّل الدخول للمتابعة',
          }
        : {
            follow: followLabel ?? 'Follow',
            following: followingLabel ?? 'Following',
            followers: 'followers',
            signIn: 'Sign in to follow',
          },
    [locale, followLabel, followingLabel],
  )

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch(basePath, { method: 'GET', headers: { Accept: 'application/json' }, cache: 'no-store' })
      const json = await res.json().catch(() => ({}))
      if (json?.success) {
        const data = json.data as Partial<StatusPayload>
        setIsFollowing(Boolean(data?.is_following))
        setFollowersCount(Number.isFinite(Number(data?.followers_count)) ? Number(data?.followers_count) : 0)
      }
    } catch {
      // ignore
    } finally {
      setReady(true)
    }
  }, [basePath])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      if (cancelled) return
      await loadStatus()
    })()
    return () => {
      cancelled = true
    }
  }, [loadStatus])

  const toggle = useCallback(async () => {
    if (status !== 'authenticated') {
      // Redirect to sign-in and return back
      const next = encodeURIComponent(pathname || `/${locale}`)
      router.push(`/${locale}/auth/sign-in?callbackUrl=${next}`)
      return
    }
    if (loading) return
    setLoading(true)

    // Optimistic update
    const previous = isFollowing
    setIsFollowing(!previous)
    setFollowersCount((c) => Math.max(0, c + (previous ? -1 : 1)))

    try {
      const res = await fetch(basePath, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const json = await res.json().catch(() => ({}))
      if (json?.success) {
        const data = json.data as Partial<StatusPayload>
        if (data) {
          if (typeof data.is_following === 'boolean') setIsFollowing(data.is_following)
          if (Number.isFinite(Number(data.followers_count))) setFollowersCount(Number(data.followers_count))
        }
      } else {
        // revert
        setIsFollowing(previous)
        setFollowersCount((c) => Math.max(0, c + (previous ? 1 : -1)))
      }
    } catch {
      setIsFollowing(previous)
      setFollowersCount((c) => Math.max(0, c + (previous ? 1 : -1)))
    } finally {
      setLoading(false)
    }
  }, [basePath, isFollowing, loading, locale, pathname, router, status])

  const variantClass =
    variant === 'hero' ? styles.hero : variant === 'chip' ? styles.chip : variant === 'dark' ? styles.dark : styles.default

  const label = isFollowing ? text.following : text.follow
  const disabled = !ready || loading
  const isGuest = status === 'unauthenticated'

  return (
    <motion.button
      type="button"
      onClick={() => void toggle()}
      disabled={disabled}
      className={[styles.followBtn, variantClass, isFollowing ? styles.isFollowing : '', className ?? ''].filter(Boolean).join(' ')}
      aria-pressed={isFollowing}
      aria-label={isGuest ? text.signIn : label}
      title={isGuest ? text.signIn : undefined}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      <span className={styles.iconWrap} aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          {isFollowing ? (
            <motion.span
              key="on"
              initial={{ scale: 0.4, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, rotate: 45, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className={styles.iconInner}
            >
              <BsCheckLg />
            </motion.span>
          ) : (
            <motion.span
              key="off"
              initial={{ scale: 0.4, rotate: 45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, rotate: -45, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className={styles.iconInner}
            >
              <BsPlusLg />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <span className={styles.labelText}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={label}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={styles.labelInner}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>

      {showCount && (
        <span className={styles.count} aria-live="polite">
          <BsBellFill className={styles.countIcon} aria-hidden="true" />
          <span className={styles.countNumber}>{formatCount(followersCount, locale)}</span>
        </span>
      )}

      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </motion.button>
  )
}
