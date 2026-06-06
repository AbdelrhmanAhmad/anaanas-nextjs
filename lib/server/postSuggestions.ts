import { fetchPosts } from '@/lib/api/posts'

type JsonEnvelope = { success?: boolean; data?: unknown }

async function fetchJsonSafe(path: string): Promise<JsonEnvelope | null> {
  try {
    const { callLaravel } = await import('@/lib/laravelClient')
    const json = (await callLaravel(path, { method: 'GET' })) as JsonEnvelope
    if (!json?.success) return null
    return json
  } catch {
    return null
  }
}

/**
 * When a post detail request fails (404 / hidden), try category-based similar listings
 * for the same post id, then fall back to the country-scoped home feed (same as Feeds).
 */
export async function fetchSuggestedPostsForMissingPost(params: {
  postId: string
  locale: string
  countryId?: number
  limit?: number
}): Promise<any[]> {
  const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 24) : 8
  const land = encodeURIComponent(params.locale)
  const countryQs =
    params.countryId != null && params.countryId > 0
      ? `&country_id=${encodeURIComponent(String(params.countryId))}`
      : ''

  const similarPath = `/api/posts/${encodeURIComponent(params.postId)}/similar?land=${land}&limit=${limit}${countryQs}`
  const similarJson = await fetchJsonSafe(similarPath)
  const similar = Array.isArray(similarJson?.data) ? similarJson.data : []
  if (similar.length > 0) {
    return similar.slice(0, limit)
  }

  const feed = await fetchPosts({
    countryId: params.countryId,
    land: params.locale,
    page: 1,
  })
  const items = Array.isArray(feed?.data) ? feed.data : []
  return items.slice(0, limit)
}

export async function fetchPostDetailsSafe(
  postId: string,
  locale: string,
): Promise<Record<string, unknown> | null> {
  const json = await fetchJsonSafe(
    `/api/posts/${encodeURIComponent(postId)}?land=${encodeURIComponent(locale)}`,
  )
  if (!json?.success || !json.data || typeof json.data !== 'object') {
    return null
  }
  return json.data as Record<string, unknown>
}
