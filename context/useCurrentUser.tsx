'use client'

import { useSession } from 'next-auth/react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import defaultUserAvatar from '@/assets/images/avatar/user-default.svg'

/**
 * Shared "current user" store.
 *
 * Purpose: deduplicate `/api/auth/profile` calls across the app. Previously each
 * <PostCard>, <CreatePostCard>, <ProfileDropdown>, <ProfileLayout>, etc. fetched
 * the same endpoint in its own `useEffect`, which hammered the server when
 * multiple cards rendered on one page (20 posts → 20 identical requests).
 *
 * The provider fetches once on auth, caches the user in context, listens for
 * the `profile:updated` window event to refresh instantly after edits, and
 * exposes `refresh()` + `setUser()` for imperative updates.
 */
export type CurrentUser = {
  id?: number | string
  name?: string
  email?: string
  mobile?: string
  username?: string
  bio?: string
  avatar?: string | null
  avatar_url?: string | null
  cover_image?: string | null
  cover_image_url?: string | null
  [key: string]: any
}

type CurrentUserContextValue = {
  user: CurrentUser | null
  /** Fully resolved avatar URL or the default avatar. Never empty. */
  avatarUrl: string
  /** Resolved cover URL, or empty string if none. */
  coverUrl: string
  loading: boolean
  /** Force a fresh `/api/auth/profile` fetch (bypasses cache). */
  refresh: () => Promise<void>
  /** Apply an optimistic user update (used by edit forms / image uploads). */
  setUser: (user: CurrentUser | null) => void
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession()
  const [user, setUserState] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const inflightRef = useRef<Promise<void> | null>(null)
  const cancelledRef = useRef(false)

  const doFetch = useCallback(async (): Promise<void> => {
    // Share a single in-flight request across concurrent callers.
    if (inflightRef.current) return inflightRef.current

    const promise = (async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/auth/profile', { cache: 'no-store' })
        if (!res.ok) return
        const json = await res.json().catch(() => ({}))
        const nextUser = json?.data?.user ?? null
        if (!cancelledRef.current) setUserState(nextUser)
      } catch {
        /* network/parse errors are silent — hooks fall back to defaults */
      } finally {
        setLoading(false)
        inflightRef.current = null
      }
    })()

    inflightRef.current = promise
    return promise
  }, [])

  // Fetch when the user becomes authenticated; clear on logout.
  useEffect(() => {
    cancelledRef.current = false
    if (status === 'authenticated') {
      void doFetch()
    } else if (status === 'unauthenticated') {
      setUserState(null)
    }
    return () => {
      cancelledRef.current = true
    }
  }, [status, session?.user?.email, doFetch])

  // Listen for profile-edit events dispatched by EditProfileModal / ProfileImageEditor.
  useEffect(() => {
    const onProfileUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.user) {
        setUserState(detail.user as CurrentUser)
      } else {
        void doFetch()
      }
    }
    window.addEventListener('profile:updated', onProfileUpdated)
    return () => window.removeEventListener('profile:updated', onProfileUpdated)
  }, [doFetch])

  const value = useMemo<CurrentUserContextValue>(() => {
    const avatarCandidate = user?.avatar_url || user?.avatar || ''
    const coverCandidate = user?.cover_image_url || user?.cover_image || ''
    const avatarResolved = avatarCandidate ? resolveMediaUrl(avatarCandidate) : ''
    const coverResolved = coverCandidate ? resolveMediaUrl(coverCandidate) : ''
    return {
      user,
      avatarUrl: avatarResolved || defaultUserAvatar.src,
      coverUrl: coverResolved,
      loading,
      refresh: doFetch,
      setUser: setUserState,
    }
  }, [user, loading, doFetch])

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>
}

/**
 * Access the currently logged-in user's profile (deduplicated across the app).
 * Safe to call outside the provider — returns the default avatar + nulls.
 */
export const useCurrentUser = (): CurrentUserContextValue => {
  const ctx = useContext(CurrentUserContext)
  if (ctx) return ctx
  return {
    user: null,
    avatarUrl: defaultUserAvatar.src,
    coverUrl: '',
    loading: false,
    refresh: async () => {},
    setUser: () => {},
  }
}
