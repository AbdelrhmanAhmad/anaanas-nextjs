import { getApiUrl } from '@/lib/api/config'

const REVALIDATE_SECONDS = 86_400

type SitemapCountry = { id: number; iso2: string; updated_at?: string }

type SitemapSectionRow = {
  section_slug: string
  category_slug?: string
  updated_at?: string
}

type SitemapCityRow = {
  city_id: number
  updated_at?: string
}

type SitemapPostRow = {
  id: number
  section_slug?: string
  category_slug?: string
  updated_at?: string
  publish_date?: string
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(getApiUrl(path), {
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function fetchSitemapCountries(): Promise<SitemapCountry[]> {
  const json = await fetchJson<{ success?: boolean; data?: SitemapCountry[] }>('/api/sitemap/countries')
  return json?.success && Array.isArray(json.data) ? json.data : []
}

export async function fetchSitemapSections(countryIso2: string): Promise<SitemapSectionRow[]> {
  const json = await fetchJson<{ success?: boolean; data?: SitemapSectionRow[] }>(
    `/api/sitemap/sections?country_iso2=${encodeURIComponent(countryIso2)}`,
  )
  return json?.success && Array.isArray(json.data) ? json.data : []
}

export async function fetchSitemapCities(countryIso2: string): Promise<SitemapCityRow[]> {
  const json = await fetchJson<{ success?: boolean; data?: SitemapCityRow[] }>(
    `/api/sitemap/cities?country_iso2=${encodeURIComponent(countryIso2)}`,
  )
  return json?.success && Array.isArray(json.data) ? json.data : []
}

export async function fetchAllSitemapPosts(countryIso2: string): Promise<SitemapPostRow[]> {
  const all: SitemapPostRow[] = []
  let page = 1
  let lastPage = 1

  do {
    const json = await fetchJson<{
      success?: boolean
      data?: SitemapPostRow[]
      meta?: { last_page?: number }
    }>(
      `/api/sitemap/posts?country_iso2=${encodeURIComponent(countryIso2)}&page=${page}&per_page=1000`,
    )

    if (!json?.success || !Array.isArray(json.data)) break

    all.push(...json.data)
    lastPage = json.meta?.last_page ?? 1
    page += 1
  } while (page <= lastPage)

  return all
}

export type { SitemapCountry, SitemapSectionRow, SitemapCityRow, SitemapPostRow }
