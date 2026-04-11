import CreatePostCard from '@/components/cards/CreatePostCard'
import ProfilePostsFeed from './components/ProfilePostsFeed'
import { loadMyPostsForFeed } from './data'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'

export const metadata: Metadata = { title: 'Feed' }

const Feed = async () => {
  const headersList = await headers()
  const headerLocale = headersList.get('x-locale') || 'ar'
  const locale = isSupportedLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE

  const { posts, error } = await loadMyPostsForFeed(locale)

  return (
    <>
      <CreatePostCard />
      <ProfilePostsFeed initialPosts={posts} initialError={error} locale={locale} />
    </>
  )
}

export default Feed
