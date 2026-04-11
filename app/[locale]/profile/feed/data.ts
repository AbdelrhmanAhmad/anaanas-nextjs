import { callLaravel } from '@/lib/laravelClient'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

export async function loadMyPostsForFeed(locale: SupportedLocale) {
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

  return { posts, error }
}
