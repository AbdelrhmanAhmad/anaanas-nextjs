'use client'

import { useState } from 'react'
import PostCard from '@/components/cards/PostCard'
import type { PostRecord } from '@/lib/api/posts'
import styles from './PostsList.module.css'

type PostsListProps = {
  initialPosts: PostRecord[]
}

export default function PostsList({ initialPosts }: PostsListProps) {
  const [posts, setPosts] = useState<PostRecord[]>(initialPosts)

  const isTodayPost = (post: PostRecord) => {
    const raw = post?.created_at
    if (!raw) return false
    const createdAt = new Date(String(raw))
    if (Number.isNaN(createdAt.getTime())) return false
    const now = new Date()
    return createdAt.toDateString() === now.toDateString()
  }

  const handleDelete = (postId: number | string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => String(post?.id) !== String(postId)))
  }

  return (
    <>
      {posts.map((post, idx) => (
        <div key={post?.id ?? idx} className={styles.postWrap}>
          {isTodayPost(post) ? <span className={styles.newBadge}>NEW</span> : null}
          <PostCard post={post} onDelete={handleDelete} />
        </div>
      ))}
    </>
  )
}

