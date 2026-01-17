import CreatePostCard from '@/components/cards/CreatePostCard'
import Posts from './components/Posts'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Feed' }

const Feed = () => {
  return (
    <>
      <CreatePostCard />
      <Posts />
    </>
  )
}
export default Feed
