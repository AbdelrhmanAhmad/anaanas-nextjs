import { getApiUrl } from './config'

export type AuctionSort = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'ending_soon'

export type AuctionListParams = {
  land?: string
  page?: number
  perPage?: number
  q?: string
  sectionId?: number
  categoryId?: number
  cityId?: number
  countryId?: number
  priceMin?: number
  priceMax?: number
  hasImages?: boolean
  sort?: AuctionSort
  status?: 'draft' | 'live' | 'ended' | 'cancelled'
}

export type AuctionBidPayload = {
  amount: number
}

export type CreateAuctionData = {
  section_id: number
  category_id: number
  city_id: number
  country_id: number
  title: string
  description?: string
  start_price: number
  min_increment?: number
  reserve_price?: number
  start_at?: string
  end_at: string
  attributes?: Array<{ attributeId: number; optionId: number | number[] }>
}

function authHeaders(accessToken?: string): Record<string, string> {
  const h: Record<string, string> = { Accept: 'application/json' }
  if (accessToken) h.Authorization = `Bearer ${accessToken}`
  return h
}

export async function fetchAuctions(params: AuctionListParams = {}) {
  const sp = new URLSearchParams()
  if (params.land) sp.set('land', params.land)
  if (params.page) sp.set('page', String(params.page))
  if (params.perPage) sp.set('per_page', String(params.perPage))
  if (params.q?.trim()) sp.set('q', params.q.trim())
  if (params.sectionId) sp.set('section_id', String(params.sectionId))
  if (params.categoryId) sp.set('category_id', String(params.categoryId))
  if (params.cityId) sp.set('city_id', String(params.cityId))
  if (params.countryId) sp.set('country_id', String(params.countryId))
  if (params.priceMin != null) sp.set('price_min', String(params.priceMin))
  if (params.priceMax != null) sp.set('price_max', String(params.priceMax))
  if (params.hasImages === true) sp.set('has_images', '1')
  if (params.hasImages === false) sp.set('has_images', '0')
  if (params.sort) sp.set('sort', params.sort)
  if (params.status) sp.set('status', params.status)

  const url = getApiUrl(`/api/auctions${sp.toString() ? `?${sp.toString()}` : ''}`)
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to fetch auctions: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function createAuction(data: CreateAuctionData, accessToken?: string, images?: File[]) {
  const hasImages = Array.isArray(images) && images.length > 0
  const headers = authHeaders(accessToken)

  const body: BodyInit = hasImages
    ? (() => {
        const fd = new FormData()
        fd.append('section_id', String(data.section_id))
        fd.append('category_id', String(data.category_id))
        fd.append('city_id', String(data.city_id))
        fd.append('country_id', String(data.country_id))
        fd.append('title', data.title)
        if (data.description) fd.append('description', data.description)
        fd.append('start_price', String(data.start_price))
        if (data.min_increment != null) fd.append('min_increment', String(data.min_increment))
        if (data.reserve_price != null) fd.append('reserve_price', String(data.reserve_price))
        if (data.start_at) fd.append('start_at', data.start_at)
        fd.append('end_at', data.end_at)
        fd.append('attributes', JSON.stringify(data.attributes ?? []))
        images.forEach((img) => fd.append('images[]', img))
        return fd
      })()
    : JSON.stringify(data)

  if (!hasImages) headers['Content-Type'] = 'application/json'

  const res = await fetch(getApiUrl('/api/auctions'), {
    method: 'POST',
    headers,
    body,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || `Failed to create auction: ${res.status}`)
  return json
}

export async function updateAuction(
  postId: number | string,
  data: Partial<CreateAuctionData>,
  accessToken?: string,
  images?: File[],
) {
  const hasImages = Array.isArray(images) && images.length > 0
  const headers = authHeaders(accessToken)
  const body: BodyInit = hasImages
    ? (() => {
        const fd = new FormData()
        Object.entries(data).forEach(([k, v]) => {
          if (v == null) return
          if (k === 'attributes') fd.append(k, JSON.stringify(v))
          else fd.append(k, String(v))
        })
        images.forEach((img) => fd.append('images[]', img))
        return fd
      })()
    : JSON.stringify(data)

  if (!hasImages) headers['Content-Type'] = 'application/json'
  const res = await fetch(getApiUrl(`/api/auctions/${postId}`), {
    method: 'POST',
    headers,
    body,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || `Failed to update auction: ${res.status}`)
  return json
}

export async function deleteAuction(postId: number | string, accessToken?: string) {
  const res = await fetch(getApiUrl(`/api/auctions/${postId}`), {
    method: 'DELETE',
    headers: authHeaders(accessToken),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || `Failed to delete auction: ${res.status}`)
  return json
}

export async function placeAuctionBid(postId: number | string, payload: AuctionBidPayload, accessToken?: string) {
  const res = await fetch(getApiUrl(`/api/auctions/${postId}/bid`), {
    method: 'POST',
    headers: {
      ...authHeaders(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || `Failed to place bid: ${res.status}`)
  return json
}

export async function toggleAuctionWatch(postId: number | string, accessToken?: string) {
  const res = await fetch(getApiUrl(`/api/auctions/${postId}/watch`), {
    method: 'POST',
    headers: authHeaders(accessToken),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || `Failed to toggle watch: ${res.status}`)
  return json
}

export async function fetchAuctionStatistics(postId: number | string, accessToken?: string) {
  const res = await fetch(getApiUrl(`/api/auctions/${postId}/statistics`), {
    cache: 'no-store',
    headers: authHeaders(accessToken),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || `Failed to fetch statistics: ${res.status}`)
  return json
}

export async function fetchMyAuctions(accessToken?: string, page?: number) {
  const sp = new URLSearchParams()
  if (page) sp.set('page', String(page))
  const res = await fetch(getApiUrl(`/api/auctions/my-posts${sp.toString() ? `?${sp.toString()}` : ''}`), {
    cache: 'no-store',
    headers: authHeaders(accessToken),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || `Failed to fetch my auctions: ${res.status}`)
  return json
}

