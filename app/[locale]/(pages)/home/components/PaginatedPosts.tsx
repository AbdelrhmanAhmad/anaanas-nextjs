'use client'

import { useCallback, useEffect, useState } from 'react'

import { fetchPosts, type PostRecord } from '@/lib/api/posts'
import PostCard from '@/components/cards/PostCard'
import LoadMoreButton from './LoadMoreButton'
import { POST_CREATED_EVENT, type PostCreatedDetail } from '@/lib/postCreated'

type FetchParams = {
  countryId?: number
  land?: string
  sectionSlug?: string
  categorySlug?: string
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

  // When filters (URL/search params) change, this component receives new initial props
  // but useState won't update automatically. resetKey forces a controlled reset.
  useEffect(() => {
    setPosts(initialPosts)
    setPage(1)
    setNextPageUrl(initialNextPageUrl ?? null)
    setLoading(false)
  }, [resetKey, initialPosts, initialNextPageUrl])

  /** إدراج إعلان جديد في أعلى التغذية (نفس حدث صفحة الملف الشخصي) — عند الترتيب «الأحدث» وبدون فلتر قسم/فئة */
  const shouldPrependCreatedPost =
    (fetchParams.sort === undefined || fetchParams.sort === 'newest') &&
    !fetchParams.sectionSlug &&
    !fetchParams.categorySlug

  const onPostCreated = useCallback(
    (ev: Event) => {
      if (!shouldPrependCreatedPost) return
      const e = ev as CustomEvent<PostCreatedDetail>
      const post = e.detail?.post
      if (!post || post.id == null) return
      setPosts((prev) => {
        const id = post.id
        if (prev.some((p) => String(p?.id) === String(id))) return prev
        return [post, ...prev]
      })
    },
    [shouldPrependCreatedPost],
  )

  useEffect(() => {
    window.addEventListener(POST_CREATED_EVENT, onPostCreated as EventListener)
    return () => window.removeEventListener(POST_CREATED_EVENT, onPostCreated as EventListener)
  }, [onPostCreated])

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
      {posts.map((post, idx) => (
        <PostCard post={post} key={post?.id ?? idx} onDelete={handleDelete} />
      ))}
      {canLoadMore && (
        <div className="mt-3 d-flex justify-content-center">
          <LoadMoreButton onClick={handleLoadMore} loading={loading} disabled={!canLoadMore || loading} />
        </div>
      )}
    </div>
  )
}


