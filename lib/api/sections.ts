import { getApiUrl } from './config'

export type Section = {
  id: number
  slug: string
  name: string
  icon: string | null
  image: string | null
}

type SectionsResponse = {
  data: Section[]
}

export const SECTIONS_ENDPOINT = '/api/sections'

export type FetchSectionsOptions = {
  /** Next.js `revalidate` (seconds). When omitted, uses `no-store`. */
  revalidateSeconds?: number
}

export async function fetchSections(locale?: string, options?: FetchSectionsOptions): Promise<Section[]> {
  const searchParams = new URLSearchParams()
  if (locale) {
    searchParams.set('land', locale)
  }
  const query = searchParams.toString()
  const url = getApiUrl(`${SECTIONS_ENDPOINT}${query ? `?${query}` : ''}`)

  const res = await fetch(
    url,
    options?.revalidateSeconds != null
      ? { next: { revalidate: options.revalidateSeconds } }
      : { cache: 'no-store' },
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch sections: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as SectionsResponse
  if (!json || !Array.isArray(json.data)) {
    return []
  }

  return json.data
}

export async function fetchSectionBySlug(slug: string, locale?: string): Promise<Section | null> {
  const sections = await fetchSections(locale)

  const found = sections.find((section) => section.slug === slug)

  return found ?? null
}


