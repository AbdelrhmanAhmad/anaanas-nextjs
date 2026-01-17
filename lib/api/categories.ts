import { getApiUrl } from './config'

export type Category = {
  id: number
  name: string
  slug: string
  icon: string | null
}

type CategoriesResponse = {
  data: Category[]
}

export async function fetchCategoriesBySectionId(sectionId: number, locale?: string): Promise<Category[]> {
  const searchParams = new URLSearchParams()
  searchParams.set('section_id', String(sectionId))
  if (locale) {
    searchParams.set('land', locale)
  }
  const query = searchParams.toString()
  const url = getApiUrl(`/api/sections/categories?${query}`)

  const res = await fetch(url, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as CategoriesResponse

  if (!json || !Array.isArray(json.data)) {
    return []
  }

  return json.data
}


