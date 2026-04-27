import type { NextRequest } from 'next/server'

/**
 * Skip automatic geo routing in dev / when disabled (middleware stays on locale + manual country only).
 */
export function shouldSkipCountryGeoRouting(req: NextRequest): boolean {
  if (process.env.DISABLE_COUNTRY_GEO === '1') return true

  const host = (req.headers.get('host') || '').toLowerCase().split(':')[0] || ''
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.localhost') ||
    host.startsWith('192.168.') ||
    host.startsWith('10.')
  ) {
    return true
  }

  return false
}
