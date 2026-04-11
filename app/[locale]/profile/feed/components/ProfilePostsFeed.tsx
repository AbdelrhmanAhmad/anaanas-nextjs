'use client'

import { useCallback, useEffect, useState } from 'react'
import PostCard from '@/components/cards/PostCard'
import { POST_CREATED_EVENT, type PostCreatedDetail } from '@/lib/postCreated'
import type { PostRecord } from '@/lib/api/posts'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

type Props = {
  initialPosts: PostRecord[]
  initialError: string | null
  locale: SupportedLocale
}

export default function ProfilePostsFeed({ initialPosts, initialError, locale }: Props) {
  const [posts, setPosts] = useState<PostRecord[]>(initialPosts)
  const [error] = useState<string | null>(initialError)

  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  const onCreated = useCallback((ev: Event) => {
    const e = ev as CustomEvent<PostCreatedDetail>
    const post = e.detail?.post
    if (!post || post.id == null) return
    setPosts((prev) => {
      const id = post.id
      if (prev.some((p) => String(p.id) === String(id))) return prev
      return [post, ...prev]
    })
  }, [])

  useEffect(() => {
    window.addEventListener(POST_CREATED_EVENT, onCreated as EventListener)
    return () => window.removeEventListener(POST_CREATED_EVENT, onCreated as EventListener)
  }, [onCreated])

  if (error) {
    return (
      <div className="alert alert-danger">
        {error || t('profile.postsError', locale)}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="card" id="my-posts-list">
        <div className="card-body text-center py-5">
          <p className="text-muted mb-0">{t('profile.noPosts', locale)}</p>
        </div>
      </div>
    )
  }

  return (
    <div id="my-posts-list" className="vstack gap-3">
      {posts.map((post) => (
        <PostCard post={post} key={String(post.id)} />
      ))}
    </div>
  )
}
