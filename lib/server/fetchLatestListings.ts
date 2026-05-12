import { callLaravel } from '@/lib/laravelClient'

export type LatestListingItem = {
  id: number
  title: string
  image_url: string | null
  is_new: boolean
  location: string
  price: number | null
  currency: string
  price_suffix?: string | null
  is_favorited: boolean
}

/**
 * Latest listings for the mobile home strip. Uses `callLaravel` so an
 * authenticated session forwards the bearer token and `is_favorited` is accurate.
 */
export async function fetchLatestListings(params: {
  countryId?: number
  land?: string
  limit?: number
}): Promise<LatestListingItem[]> {
  const sp = new URLSearchParams()
  if (params.countryId != null) sp.set('country_id', String(params.countryId))
  if (params.land) sp.set('land', params.land)
  if (params.limit != null) sp.set('limit', String(params.limit))
  const qs = sp.toString()
  try {
    const json = (await callLaravel(`/api/home/latest-listings${qs ? `?${qs}` : ''}`)) as {
      success?: boolean
      data?: LatestListingItem[]
    }
    if (!json?.data || !Array.isArray(json.data)) return []
    return json.data
  } catch {
    return []
  }
}
