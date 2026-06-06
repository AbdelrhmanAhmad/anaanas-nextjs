import { getApiUrl } from './config'

export type PostCreationLimitReason = 'interval' | 'hourly' | null

export type VerificationRequestStatus = 'none' | 'pending' | 'approved' | 'rejected'

export type PostCreationLimitData = {
  can_create: boolean
  reason: PostCreationLimitReason
  retry_after_seconds: number
  posts_in_last_hour: number
  hourly_limit: number
  interval_minutes: number
  message?: string | null
  next_allowed_at?: string | null
  is_account_verified?: boolean
  verification_request_status?: VerificationRequestStatus
}

export type PostCreationLimitResponse = {
  success?: boolean
  data?: PostCreationLimitData
  message?: string
}

function normalizeLimitPayload(json: unknown): PostCreationLimitData {
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid post limit response')
  }

  const root = json as PostCreationLimitResponse & PostCreationLimitData
  const payload =
    root.data && typeof root.data === 'object' && 'can_create' in root.data
      ? root.data
      : 'can_create' in root
        ? (root as PostCreationLimitData)
        : null

  if (!payload) {
    throw new Error((root as PostCreationLimitResponse).message || 'Invalid post limit response')
  }

  return {
    can_create: Boolean(payload.can_create),
    reason: payload.reason ?? null,
    retry_after_seconds: Number(payload.retry_after_seconds) || 0,
    posts_in_last_hour: Number(payload.posts_in_last_hour) || 0,
    hourly_limit: Number(payload.hourly_limit) || 5,
    interval_minutes: Number(payload.interval_minutes) || 5,
    message: payload.message ?? null,
    next_allowed_at: payload.next_allowed_at ?? null,
    is_account_verified: Boolean(payload.is_account_verified),
    verification_request_status: (payload.verification_request_status as VerificationRequestStatus) ?? 'none',
  }
}

/**
 * Check whether the authenticated user may create a new listing.
 * Prefer direct Laravel call with bearer token (same as createPost).
 */
export async function fetchPostCreationLimit(params: {
  land?: string
  accessToken?: string | null
} = {}): Promise<PostCreationLimitData> {
  const searchParams = new URLSearchParams()
  if (params.land) searchParams.set('land', params.land)
  const query = searchParams.toString()
  const path = `/api/post/creation-limit${query ? `?${query}` : ''}`

  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  if (params.accessToken) {
    headers.Authorization = `Bearer ${params.accessToken}`
  }

  const url = params.accessToken ? getApiUrl(path) : `/api/posts/creation-limit${query ? `?${query}` : ''}`

  const res = await fetch(url, {
    cache: 'no-store',
    headers,
    credentials: params.accessToken ? 'omit' : 'include',
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(err.message || `Failed to check post limit: ${res.status}`)
  }

  const json = (await res.json()) as unknown
  return normalizeLimitPayload(json)
}

export function formatCountdownClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export async function submitAccountVerificationRequest(params: {
  land?: string
  accessToken?: string | null
  message?: string
}): Promise<{ message: string; data: Pick<PostCreationLimitData, 'is_account_verified' | 'verification_request_status'> }> {
  const searchParams = new URLSearchParams()
  if (params.land) searchParams.set('land', params.land)
  const query = searchParams.toString()
  const path = `/api/account/verification-request${query ? `?${query}` : ''}`

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (params.accessToken) {
    headers.Authorization = `Bearer ${params.accessToken}`
  }

  const url = params.accessToken ? getApiUrl(path) : `/api/account/verification-request${query ? `?${query}` : ''}`

  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers,
    credentials: params.accessToken ? 'omit' : 'include',
    body: JSON.stringify({ message: params.message ?? null }),
  })

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean
    message?: string
    data?: Pick<PostCreationLimitData, 'is_account_verified' | 'verification_request_status'>
  }

  if (!res.ok) {
    throw new Error(json.message || `Failed to submit verification request: ${res.status}`)
  }

  return {
    message: json.message || 'Verification request submitted',
    data: json.data ?? {
      is_account_verified: false,
      verification_request_status: 'pending',
    },
  }
}
