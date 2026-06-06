import { getApiUrl } from './config'

export type SectionMomentumItem = {
  section_id: number
  slug: string
  name: string
  icon: string | null
  icon_full_path: string | null
  current_count: number
  previous_count: number
  growth_percent: number
}

export type TrendingPostItem = {
  post_id: number
  title: string
  score: number
  comments_count: number
  reactions_count: number
  section_slug?: string | null
  section_name?: string | null
  category_slug?: string | null
  category_name?: string | null
}

const HOME_INSIGHTS_REVALIDATE_SEC = 120

async function fetchJson<T>(path: string): Promise<T | null> {
  const url = getApiUrl(path)
  const res = await fetch(url, { next: { revalidate: HOME_INSIGHTS_REVALIDATE_SEC } })
  if (!res.ok) return null
  return (await res.json()) as T
}

export async function fetchSectionMomentum(params: {
  countryId?: number
  land?: string
}): Promise<SectionMomentumItem[]> {
  const sp = new URLSearchParams()
  if (params.countryId != null) sp.set('country_id', String(params.countryId))
  if (params.land) sp.set('land', params.land)
  const qs = sp.toString()
  const json = await fetchJson<{ success?: boolean; data?: SectionMomentumItem[] }>(
    `/api/home/section-momentum${qs ? `?${qs}` : ''}`,
  )
  if (!json?.data || !Array.isArray(json.data)) return []
  return json.data
}

export async function fetchTrendingPosts(params: {
  countryId?: number
  land?: string
  limit?: number
}): Promise<TrendingPostItem[]> {
  const sp = new URLSearchParams()
  if (params.countryId != null && params.countryId > 0) sp.set('country_id', String(params.countryId))
  if (params.land) sp.set('land', params.land)
  if (params.limit != null) sp.set('limit', String(params.limit))
  const qs = sp.toString()
  const json = await fetchJson<{ success?: boolean; data?: TrendingPostItem[] }>(
    `/api/home/trending-posts${qs ? `?${qs}` : ''}`,
  )
  if (!json?.data || !Array.isArray(json.data)) return []
  return json.data
}
