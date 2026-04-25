'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { POST_CREATED_EVENT, type PostCreatedDetail, type PostCreatedSource } from '@/lib/postCreated'
import type { PostRecord } from '@/lib/api/posts'

/**
 * Active filters that determine whether a freshly-broadcast post should be
 * prepended to the visible feed.  Mirrors the shape used by the home/section
 * pages so each list component decides locally whether the post is relevant.
 */
export type FeedFilters = {
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc'
  sectionSlug?: string
  categorySlug?: string
  cityId?: number
  priceMin?: number
  priceMax?: number
  hasImages?: boolean
}

export type RealtimeInsertionResult = {
  /** Latest post list, with newly-arrived posts prepended. */
  posts: PostRecord[]
  /** Direct setter to support pagination/load-more flows. */
  setPosts: React.Dispatch<React.SetStateAction<PostRecord[]>>
  /** IDs that arrived via the websocket broadcast since this component mounted. */
  realtimePostIds: Set<string>
  /** Helper to remove a post (e.g. on delete). */
  removePost: (postId: number | string) => void
  /** Returns true if the post id was added by the realtime path. */
  isPushedPost: (postId: number | string | null | undefined) => boolean
}

const REALTIME_HIGHLIGHT_MS = 60_000

function getPostId(post: PostRecord | null | undefined): string | null {
  if (!post || post.id == null) return null
  return String(post.id)
}

function matchesActiveFilters(post: PostRecord, filters: FeedFilters): boolean {
  if (filters.sort && filters.sort !== 'newest') return false

  const sectionSlug = post?.section?.slug ?? (post as any)?.section_slug ?? null
  const categorySlug = post?.category?.slug ?? (post as any)?.category_slug ?? null
  const cityId = (post as any)?.city_id ?? post?.city?.id ?? null
  const priceRaw = (post as any)?.price
  const price = priceRaw == null ? Number.NaN : Number(priceRaw)
  const hasImages = Array.isArray((post as any)?.post_images)
    ? (post as any).post_images.length > 0
    : Array.isArray((post as any)?.postImages)
      ? (post as any).postImages.length > 0
      : Boolean((post as any)?.main_image)

  if (filters.sectionSlug && String(sectionSlug ?? '') !== String(filters.sectionSlug)) return false
  if (filters.categorySlug && String(categorySlug ?? '') !== String(filters.categorySlug)) return false
  if (filters.cityId != null && Number(cityId) !== Number(filters.cityId)) return false
  if (filters.priceMin != null && Number.isFinite(price) && price < Number(filters.priceMin)) return false
  if (filters.priceMax != null && Number.isFinite(price) && price > Number(filters.priceMax)) return false
  if (filters.hasImages === true && !hasImages) return false
  if (filters.hasImages === false && hasImages) return false
  return true
}

/**
 * Subscribes the host component to the global "post created" event and
 * prepends matching posts to the local list, marking realtime arrivals so the
 * UI can display a "just pushed" badge briefly.
 */
export function useRealtimePostInsertion(
  initialPosts: PostRecord[],
  filters: FeedFilters = {},
): RealtimeInsertionResult {
  const [posts, setPosts] = useState<PostRecord[]>(initialPosts)
  const [realtimePostIds, setRealtimePostIds] = useState<Set<string>>(() => new Set())
  const filtersRef = useRef(filters)
  const fadeTimersRef = useRef<Map<string, number>>(new Map())

  // Keep latest filters in a ref so we don't have to re-bind the listener on
  // every URL/search-param change (which would also re-run effects elsewhere).
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  const removePost = useCallback((postId: number | string) => {
    const id = String(postId)
    setPosts((prev) => prev.filter((p) => String(p?.id) !== id))
    setRealtimePostIds((prev) => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const scheduleHighlightRemoval = useCallback((id: string) => {
    if (typeof window === 'undefined') return
    const existing = fadeTimersRef.current.get(id)
    if (existing != null) window.clearTimeout(existing)
    const timer = window.setTimeout(() => {
      setRealtimePostIds((prev) => {
        if (!prev.has(id)) return prev
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      fadeTimersRef.current.delete(id)
    }, REALTIME_HIGHLIGHT_MS)
    fadeTimersRef.current.set(id, timer)
  }, [])

  const handlePostCreated = useCallback(
    (ev: Event) => {
      const e = ev as CustomEvent<PostCreatedDetail>
      const post = e.detail?.post
      const source: PostCreatedSource = e.detail?.source ?? 'self'
      const id = getPostId(post)
      if (!post || !id) return

      const activeFilters = filtersRef.current
      // Self-created posts use a slightly looser rule (legacy behaviour) — they
      // were prepended only when no section/category filter was active and
      // sort was newest.  For realtime arrivals we apply the full filter set.
      if (source === 'self') {
        if (activeFilters.sort && activeFilters.sort !== 'newest') return
        if (activeFilters.sectionSlug || activeFilters.categorySlug) return
      } else {
        if (!matchesActiveFilters(post, activeFilters)) return
      }

      setPosts((prev) => {
        if (prev.some((p) => String(p?.id) === id)) return prev
        return [post, ...prev]
      })

      if (source === 'realtime') {
        setRealtimePostIds((prev) => {
          if (prev.has(id)) return prev
          const next = new Set(prev)
          next.add(id)
          return next
        })
        scheduleHighlightRemoval(id)
      }
    },
    [scheduleHighlightRemoval],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener(POST_CREATED_EVENT, handlePostCreated as EventListener)
    return () => {
      window.removeEventListener(POST_CREATED_EVENT, handlePostCreated as EventListener)
    }
  }, [handlePostCreated])

  // Cleanup any pending highlight timers on unmount.
  useEffect(() => {
    const timers = fadeTimersRef.current
    return () => {
      timers.forEach((t) => {
        if (typeof window !== 'undefined') window.clearTimeout(t)
      })
      timers.clear()
    }
  }, [])

  const isPushedPost = useCallback(
    (postId: number | string | null | undefined) => {
      if (postId == null) return false
      return realtimePostIds.has(String(postId))
    },
    [realtimePostIds],
  )

  return {
    posts,
    setPosts,
    realtimePostIds,
    removePost,
    isPushedPost,
  }
}
