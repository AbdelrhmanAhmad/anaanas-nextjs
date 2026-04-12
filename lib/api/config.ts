/** Laravel `php artisan serve` default; override with NEXT_PUBLIC_API_BASE_URL or API_BASE_URL */
const DEFAULT_API_BASE_URL = 'http://localhost:8000'

function resolveApiBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    process.env.API_BASE_URL?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }
  return DEFAULT_API_BASE_URL
}

/**
 * Base URL for Laravel API (same on server + client).
 * Use NEXT_PUBLIC_API_BASE_URL so RSC fetches resolve to Laravel, not relative `/api/*` on Next (404).
 */
export const API_BASE_URL = resolveApiBaseUrl()

export const getApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}