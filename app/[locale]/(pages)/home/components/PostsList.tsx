'use client'

import PostCard from '@/components/cards/PostCard'
import type { PostRecord } from '@/lib/api/posts'
import PushedBadge from '@/components/realtime/PushedBadge'
import { useRealtimePostInsertion, type FeedFilters } from '@/lib/hooks/useRealtimePostInsertion'
import styles from './PostsList.module.css'

type PostsListProps = {
  initialPosts: PostRecord[]
  /**
   * Active feed filters used to decide whether realtime-broadcast posts
   * should be inserted into this view.  Optional for backward compatibility;
   * when omitted the home (no filters) behaviour is assumed.
   */
  filters?: FeedFilters
}

export default function PostsList({ initialPosts, filters }: PostsListProps) {
  const { posts, removePost, isPushedPost } = useRealtimePostInsertion(initialPosts, filters)

  const isTodayPost = (post: PostRecord) => {
    const raw = post?.created_at
    if (!raw) return false
    const createdAt = new Date(String(raw))
    if (Number.isNaN(createdAt.getTime())) return false
    const now = new Date()
    return createdAt.toDateString() === now.toDateString()
  }

  const handleDelete = (postId: number | string) => {
    removePost(postId)
  }

  return (
    <>
      {posts.map((post, idx) => {
        const pushed = isPushedPost(post?.id)
        return (
          <div
            key={post?.id ?? idx}
            className={`${styles.postWrap} ${pushed ? styles.realtimeRing : ''}`.trim()}
          >
            {pushed ? <PushedBadge /> : null}
            {!pushed && isTodayPost(post) ? <span className={styles.newBadge}>NEW</span> : null}
            <PostCard post={post} onDelete={handleDelete} />
          </div>
        )
      })}
    </>
  )
}
