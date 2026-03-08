import PostCard from '@/components/cards/PostCard'
import { callLaravel } from '@/lib/laravelClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'

const Posts = async () => {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/sign-in')
  }

  // Get locale from headers
  const headersList = await headers()
  const headerLocale = headersList.get('x-locale') || 'ar'
  const locale = isSupportedLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE

  // Fetch user's posts
  let posts: any[] = []
  let error: string | null = null
  
  try {
    const query = new URLSearchParams({
      page: '1',
      per_page: '15',
      land: locale,
    }).toString()
    const response = await callLaravel(`/api/posts/my-posts?${query}`, { method: 'GET' })
    posts = Array.isArray(response?.data) ? response.data : []
  } catch (e) {
    error = e instanceof Error ? e.message : t('profile.postsError', locale)
    console.error('Error fetching posts:', e)
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error || t('profile.postsError', locale)}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <p className="text-muted mb-0">{t('profile.noPosts', locale)}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </>
  )
}
export default Posts
