import { API_BASE_URL, getApiUrl } from '@/lib/api/config'

/**
 * Normalizes media URLs from the API for Next/Image and <img>.
 * Rewrites `http://localhost/storage/...` (wrong origin/port) to `API_BASE_URL`.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (url == null || typeof url !== 'string') return ''
  const u = url.trim()
  if (!u) return ''

  if (u.startsWith('/storage/')) {
    return getApiUrl(u)
  }
  if (u.startsWith('storage/')) {
    return getApiUrl(`/${u}`)
  }

  try {
    const parsed = new URL(u, API_BASE_URL)
    const isLocalStorage =
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') &&
      parsed.pathname.startsWith('/storage/')
    if (isLocalStorage) {
      const api = new URL(API_BASE_URL)
      parsed.protocol = api.protocol
      parsed.hostname = api.hostname
      parsed.port = api.port
      return parsed.toString()
    }
  } catch {
    /* ignore */
  }

  if (u.startsWith('http://') || u.startsWith('https://')) {
    return u
  }
  if (u.startsWith('//')) {
    return `https:${u}`
  }
  if (u.startsWith('/')) {
    return getApiUrl(u)
  }

  return getApiUrl(`/storage/${u.replace(/^\/+/, '')}`)
}
