import { getApiUrl } from './config'

export type CreatePostData = {
  section_id: number
  category_id: number
  city_id: number
  country_id: number
  price: number
  title?: string
  description?: string
  attributes: Array<{ attributeId: number; optionId: number | number[] }>
}

export type PostRecord = Record<string, any>

type CreatePostResponse = {
  success: boolean
  data?: PostRecord
  message?: string
}

export type PostsListResponse<T = PostRecord> = {
  current_page?: number
  current_page_url?: string
  data?: T[]
  first_page_url?: string
  from?: number
  next_page_url?: string | null
  path?: string
  per_page?: number | string
  prev_page_url?: string | null
  to?: number
}

export type FetchPostsParams = {
  countryId?: number
  land?: string
  page?: number
  sectionSlug?: string
  categorySlug?: string
  cityId?: number
  priceMin?: number
  priceMax?: number
  /** Free-text search across post title and description. */
  q?: string
  /**
   * Map of attributeId -> selected optionIds
   * This includes nested sub-attributes as well.
   */
  attributes?: Record<number, Array<number>>
  /**
   * For non-select attributes: attr[ID][from]/attr[ID][to]
   * (Backend support depends on stored data; kept for API parity with UI.)
   */
  attributeRanges?: Record<number, { from?: string | number; to?: string | number }>
  hasImages?: boolean
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc'
}

/**
 * Create a post - Client Side version (requires accessToken)
 * Option 1: Direct call to Laravel with token from client
 */
export async function createPost(data: CreatePostData, accessToken?: string, images?: File[]): Promise<CreatePostResponse> {
  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  const hasImages = Array.isArray(images) && images.length > 0

  const body: BodyInit =
    hasImages
      ? (() => {
          const formData = new FormData()
          formData.append('section_id', String(data.section_id))
          formData.append('category_id', String(data.category_id))
          formData.append('city_id', String(data.city_id))
          formData.append('country_id', String(data.country_id))
          formData.append('price', String(data.price))
          if (data.title) formData.append('title', data.title)
          if (data.description) formData.append('description', data.description)

          // إرسال الخصائص كـ JSON لتبسيط التعامل في الـ backend
          formData.append('attributes', JSON.stringify(data.attributes ?? []))

          images?.forEach((file) => {
            formData.append('images[]', file)
          })

          return formData
        })()
      : JSON.stringify(data)

  // إضافة التوكن إذا كان متوفراً
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  if (!hasImages) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(getApiUrl('/api/post'), {
    method: 'POST',
    headers,
    body,
  })

  console.log('res', res)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to create post: ${res.status} ${res.statusText}`)
  }


  return (await res.json()) as CreatePostResponse
}

/**
 * Create a post - Server Side version (via Next.js API route)
 * Option 2: Call Next.js API route which handles authentication server-side
 */
export async function createPostViaServer(data: CreatePostData): Promise<CreatePostResponse> {
  const res = await fetch('/api/posts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to create post: ${res.status} ${res.statusText}`)
  }

  return (await res.json()) as CreatePostResponse
}

/**
 * Update a post - Client Side version (requires accessToken)
 * NOTE: section_id and category_id are intentionally sent (for compatibility) but backend should ignore changes.
 */
export async function updatePost(
  postId: number | string,
  data: CreatePostData,
  accessToken?: string,
  images?: File[]
): Promise<CreatePostResponse> {
  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  const hasImages = Array.isArray(images) && images.length > 0

  const body: BodyInit =
    hasImages
      ? (() => {
          const formData = new FormData()
          // Keep these for backend validation/consistency (backend must not allow changing them)
          formData.append('section_id', String(data.section_id))
          formData.append('category_id', String(data.category_id))

          formData.append('city_id', String(data.city_id))
          formData.append('country_id', String(data.country_id))
          formData.append('price', String(data.price))
          if (data.title) formData.append('title', data.title)
          if (data.description) formData.append('description', data.description)
          formData.append('attributes', JSON.stringify(data.attributes ?? []))

          images?.forEach((file) => {
            formData.append('images[]', file)
          })

          return formData
        })()
      : JSON.stringify(data)

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  if (!hasImages) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(getApiUrl(`/api/posts/${postId}`), {
    method: 'POST',
    headers,
    body,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to update post: ${res.status} ${res.statusText}`)
  }

  return (await res.json()) as CreatePostResponse
}

export async function deletePost(
  postId: number | string,
  accessToken?: string
): Promise<CreatePostResponse> {
  const headers: HeadersInit = {
    Accept: 'application/json',
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const res = await fetch(`/api/posts/${postId}`, {
    method: 'DELETE',
    headers,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to delete post: ${res.status} ${res.statusText}`)
  }

  return (await res.json()) as CreatePostResponse
}

export async function deletePostImage(
  postId: number | string,
  imageId: number | string,
  accessToken?: string
): Promise<CreatePostResponse> {
  const headers: HeadersInit = {
    Accept: 'application/json',
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const res = await fetch(getApiUrl(`/api/posts/${postId}/images/${imageId}`), {
    method: 'DELETE',
    headers,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to delete image: ${res.status} ${res.statusText}`)
  }

  return (await res.json()) as CreatePostResponse
}

export async function fetchPosts(params: FetchPostsParams = {}): Promise<PostsListResponse> {
  const searchParams = new URLSearchParams()

  if (params.countryId) {
    searchParams.set('country_id', String(params.countryId))
  }
  if (params.land) {
    searchParams.set('land', params.land)
  }
  if (params.page) {
    searchParams.set('page', String(params.page))
  }
  if (params.q && params.q.trim() !== '') {
    searchParams.set('q', params.q.trim())
  }
  if (params.sectionSlug) {
    searchParams.set('section_slug', params.sectionSlug)
  }
  if (params.categorySlug) {
    searchParams.set('category_slug', params.categorySlug)
  }
  if (params.cityId) {
    searchParams.set('city_id', String(params.cityId))
  }
  if (params.priceMin != null && !Number.isNaN(params.priceMin)) {
    searchParams.set('price_min', String(params.priceMin))
  }
  if (params.priceMax != null && !Number.isNaN(params.priceMax)) {
    searchParams.set('price_max', String(params.priceMax))
  }
  if (params.hasImages === true) {
    searchParams.set('has_images', '1')
  } else if (params.hasImages === false) {
    searchParams.set('has_images', '0')
  }
  if (params.sort) {
    searchParams.set('sort', params.sort)
  }
  if (params.attributes) {
    for (const [attrIdRaw, optionIds] of Object.entries(params.attributes)) {
      const attrId = Number(attrIdRaw)
      if (!attrId || !Array.isArray(optionIds) || optionIds.length === 0) continue
      // Preferred Laravel-friendly format:
      // attr[795][]=11880&attr[795][]=11881
      optionIds.forEach((optId) => {
        if (optId != null) searchParams.append(`attr[${attrId}][]`, String(optId))
      })
    }
  }

  if (params.attributeRanges) {
    for (const [attrIdRaw, r] of Object.entries(params.attributeRanges)) {
      const attrId = Number(attrIdRaw)
      if (!attrId || !r) continue
      if (r.from != null && String(r.from).trim() !== '') {
        searchParams.set(`attr[${attrId}][from]`, String(r.from).trim())
      }
      if (r.to != null && String(r.to).trim() !== '') {
        searchParams.set(`attr[${attrId}][to]`, String(r.to).trim())
      }
    }
  }

  const query = searchParams.toString()
  const url = getApiUrl(`/api/posts${query ? `?${query}` : ''}`)

  const res = await fetch(url, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as PostsListResponse
  const posts = Array.isArray(json?.data) ? json.data : []

  return {
    ...json,
    data: posts,
  }
}

/**
 * Fetch authenticated user's posts
 */
export async function fetchMyPosts(params: { page?: number; perPage?: number; locale?: string } = {}): Promise<PostsListResponse> {
  const searchParams = new URLSearchParams()
  
  if (params.page) {
    searchParams.set('page', String(params.page))
  }
  if (params.perPage) {
    searchParams.set('per_page', String(params.perPage))
  }
  if (params.locale) {
    searchParams.set('land', params.locale)
  }

  const query = searchParams.toString()
  const url = `/api/posts/my-posts${query ? `?${query}` : ''}`

  const res = await fetch(url, {
    cache: 'no-store',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch my posts: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as PostsListResponse
  const posts = Array.isArray(json?.data) ? json.data : []

  return {
    ...json,
    data: posts,
  }
}

/**
 * Fetch authenticated user's post images
 */
export async function fetchMyImages(params: { page?: number; perPage?: number } = {}): Promise<PostsListResponse> {
  const searchParams = new URLSearchParams()
  
  if (params.page) {
    searchParams.set('page', String(params.page))
  }
  if (params.perPage) {
    searchParams.set('per_page', String(params.perPage))
  }

  const query = searchParams.toString()
  const url = `/api/posts/my-images${query ? `?${query}` : ''}`

  const res = await fetch(url, {
    cache: 'no-store',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch my images: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as PostsListResponse
  const images = Array.isArray(json?.data) ? json.data : []

  return {
    ...json,
    data: images,
  }
}