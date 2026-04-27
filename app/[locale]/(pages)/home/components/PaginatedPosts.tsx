'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { fetchPosts, type PostRecord } from '@/lib/api/posts'
import PostCard from '@/components/cards/PostCard'
import LoadMoreButton from './LoadMoreButton'
import { POST_CREATED_EVENT, type PostCreatedDetail } from '@/lib/postCreated'
import PushedBadge from '@/components/realtime/PushedBadge'
import styles from './PostsList.module.css'

type FetchParams = {
  countryId?: number
  land?: string
  sectionSlug?: string
  categorySlug?: string
  q?: string
  cityId?: number
  priceMin?: number
  priceMax?: number
  hasImages?: boolean
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc'
  attributes?: Record<number, Array<number>>
  attributeRanges?: Record<number, { from?: string | number; to?: string | number }>
}

export default function PaginatedPosts({
  initialPosts,
  initialNextPageUrl,
  fetchParams,
  resetKey,
}: {
  initialPosts: PostRecord[]
  initialNextPageUrl?: string | null
  fetchParams: FetchParams
  resetKey: string
}) {
  const [posts, setPosts] = useState<PostRecord[]>(initialPosts)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(initialNextPageUrl ?? null)
  const [realtimeIds, setRealtimeIds] = useState<Set<string>>(() => new Set())
  const realtimeTimersRef = useRef<Map<string, number>>(new Map())

  // When filters (URL/search params) change, this component receives new initial props
  // but useState won't update automatically. resetKey forces a controlled reset.
  useEffect(() => {
    setPosts(initialPosts)
    setPage(1)
    setNextPageUrl(initialNextPageUrl ?? null)
    setLoading(false)
    setRealtimeIds(new Set())
    realtimeTimersRef.current.forEach((t) => window.clearTimeout(t))
    realtimeTimersRef.current.clear()
  }, [resetKey, initialPosts, initialNextPageUrl])

  /**
   * إدراج إعلان جديد في أعلى التغذية:
   *  - عند إنشاء المستخدم لمنشور بنفسه (source === 'self') نتبع السلوك السابق
   *    (إدراج فقط مع ترتيب «الأحدث» وبدون فلتر قسم/فئة).
   *  - عند استلام منشور جديد عبر السوكت من نفس قناة الدولة (source === 'realtime')
   *    نطبّق فلاتر العرض الحالية بدقّة — section/category/city/price/has-images —
   *    حتى لا يظهر منشور لا ينتمي للنتائج المعروضة.
   */
  const matchesActiveFilters = useCallback(
    (post: PostRecord): boolean => {
      // newest sort is the only one that makes sense for prepend
      if (fetchParams.sort && fetchParams.sort !== 'newest') return false
      if (fetchParams.q && fetchParams.q.trim() !== '') return false

      const sectionSlug = post?.section?.slug ?? post?.section_slug ?? null
      const categorySlug = post?.category?.slug ?? post?.category_slug ?? null
      const cityId = post?.city_id ?? post?.city?.id ?? null
      const price = Number(post?.price ?? 0)
      const hasImages =
        Array.isArray(post?.post_images) ? post.post_images.length > 0 :
        Array.isArray(post?.postImages) ? post.postImages.length > 0 :
        Boolean(post?.main_image)

      if (fetchParams.sectionSlug && String(sectionSlug ?? '') !== String(fetchParams.sectionSlug)) {
        return false
      }
      if (fetchParams.categorySlug && String(categorySlug ?? '') !== String(fetchParams.categorySlug)) {
        return false
      }
      if (fetchParams.cityId != null && Number(cityId) !== Number(fetchParams.cityId)) {
        return false
      }
      if (fetchParams.priceMin != null && Number.isFinite(price) && price < Number(fetchParams.priceMin)) {
        return false
      }
      if (fetchParams.priceMax != null && Number.isFinite(price) && price > Number(fetchParams.priceMax)) {
        return false
      }
      if (fetchParams.hasImages === true && !hasImages) return false
      if (fetchParams.hasImages === false && hasImages) return false
      return true
    },
    [
      fetchParams.sort,
      fetchParams.q,
      fetchParams.sectionSlug,
      fetchParams.categorySlug,
      fetchParams.cityId,
      fetchParams.priceMin,
      fetchParams.priceMax,
      fetchParams.hasImages,
    ],
  )

  // Self-created posts keep the legacy guard (newest, no section/category filter).
  const shouldPrependSelfCreated =
    (fetchParams.sort === undefined || fetchParams.sort === 'newest') &&
    !fetchParams.sectionSlug &&
    !fetchParams.categorySlug &&
    !(fetchParams.q && fetchParams.q.trim() !== '')

  const onPostCreated = useCallback(
    (ev: Event) => {
      const e = ev as CustomEvent<PostCreatedDetail>
      const post = e.detail?.post
      const source = e.detail?.source ?? 'self'
      if (!post || post.id == null) return

      if (source === 'realtime') {
        if (!matchesActiveFilters(post)) return
      } else if (!shouldPrependSelfCreated) {
        return
      }

      const id = String(post.id)
      setPosts((prev) => {
        if (prev.some((p) => String(p?.id) === id)) return prev
        return [post, ...prev]
      })

      if (source === 'realtime') {
        setRealtimeIds((prev) => {
          if (prev.has(id)) return prev
          const next = new Set(prev)
          next.add(id)
          return next
        })
        const existing = realtimeTimersRef.current.get(id)
        if (existing != null) window.clearTimeout(existing)
        const timer = window.setTimeout(() => {
          setRealtimeIds((prev) => {
            if (!prev.has(id)) return prev
            const next = new Set(prev)
            next.delete(id)
            return next
          })
          realtimeTimersRef.current.delete(id)
        }, 60_000)
        realtimeTimersRef.current.set(id, timer)
      }
    },
    [matchesActiveFilters, shouldPrependSelfCreated],
  )

  useEffect(() => {
    window.addEventListener(POST_CREATED_EVENT, onPostCreated as EventListener)
    return () => window.removeEventListener(POST_CREATED_EVENT, onPostCreated as EventListener)
  }, [onPostCreated])

  useEffect(() => {
    const timers = realtimeTimersRef.current
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      timers.clear()
    }
  }, [])

  const canLoadMore = Boolean(nextPageUrl)

  const handleDelete = (postId: number | string) => {
    setPosts((prev) => prev.filter((p) => String(p?.id) !== String(postId)))
  }

  const handleLoadMore = async () => {
    if (!canLoadMore || loading) return
    setLoading(true)
    try {
      const res = await fetchPosts({
        ...fetchParams,
        page: page + 1,
      })
      const newPosts = Array.isArray(res?.data) ? (res.data as PostRecord[]) : []
      setPosts((prev) => [...prev, ...newPosts])
      setPage((p) => p + 1)
      setNextPageUrl((res as any)?.next_page_url ?? null)
    } catch (e) {
      console.error('Load more failed:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="home-feed-posts" className="vstack gap-4">
      {posts.map((post, idx) => {
        const idStr = String(post?.id ?? idx)
        const pushed = post?.id != null && realtimeIds.has(idStr)
        return (
          <div
            key={post?.id ?? idx}
            className={`${styles.postWrap} ${pushed ? styles.realtimeRing : ''}`.trim()}
          >
            {pushed ? <PushedBadge /> : null}
            <PostCard post={post} onDelete={handleDelete} />
          </div>
        )
      })}
      {canLoadMore && (
        <div className="mt-3 d-flex justify-content-center">
          <LoadMoreButton onClick={handleLoadMore} loading={loading} disabled={!canLoadMore || loading} />
        </div>
      )}
    </div>
  )
}


