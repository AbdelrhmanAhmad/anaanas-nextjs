import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { getApiUrl } from './api/config'

export async function callLaravel(path: string, options?: RequestInit) {
  // Get session - getServerSession automatically reads cookies in App Router
  const session = await getServerSession(authOptions)
  const accessToken = (session as any)?.accessToken

  // Build headers
  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(options?.headers && typeof options.headers === 'object' && !Array.isArray(options.headers) && !(options.headers instanceof Headers)
      ? options.headers as Record<string, string>
      : {}),
  }

  // Only add Authorization header if we have an access token
  if (accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`
  }

  // Add Content-Type only if there's a body
  if (options?.body) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  const res = await fetch(getApiUrl(path), {
    ...options,
    headers: requestHeaders,
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    
    // If we get a 401 and don't have a session, provide a clearer error
    if (res.status === 401 && !accessToken) {
      throw new Error('Unauthenticated. Please sign in to continue.')
    }
    
    throw new Error(errorData.message || `Failed to fetch: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

