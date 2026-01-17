'use client'

import { useEffect, useState } from 'react'

import { fetchPosts, type PostRecord } from '@/lib/api/posts'
import PostCard from '@/components/cards/PostCard'
import LoadMoreButton from './LoadMoreButton'

type FetchParams = {
  countryId?: number
  land?: string
  sectionSlug?: string
  categorySlug?: string
  cityId?: number
  priceMin?: number
  priceMax?: number
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
    <>
      {posts.map((post, idx) => (
        <PostCard post={post} key={post?.id ?? idx} onDelete={handleDelete} />
      ))}
      {canLoadMore && (
        <div className="mt-3 d-flex justify-content-center">
          <LoadMoreButton onClick={handleLoadMore} loading={loading} disabled={!canLoadMore || loading} />
        </div>
      )}
    </>
  )
}


