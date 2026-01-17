'use client'

import { useState } from 'react'
import PostCard from '@/components/cards/PostCard'
import type { PostRecord } from '@/lib/api/posts'

type PostsListProps = {
  initialPosts: PostRecord[]
}

export default function PostsList({ initialPosts }: PostsListProps) {
  const [posts, setPosts] = useState<PostRecord[]>(initialPosts)

  const handleDelete = (postId: number | string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => String(post?.id) !== String(postId)))
  }

  return (
    <>
      {posts.map((post, idx) => (
        <PostCard 
          post={post} 
          key={post?.id ?? idx} 
          onDelete={handleDelete}
        />
      ))}
    </>
  )
}

