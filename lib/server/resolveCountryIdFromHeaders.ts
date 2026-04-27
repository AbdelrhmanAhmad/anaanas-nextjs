import { headers } from 'next/headers'

import { getCountryByCodeCached } from '@/lib/server/getCountryByCodeCached'

/**
 * Same country resolution as Feeds: middleware sets `x-country` (e.g. jo),
 * we map to DB `countries.id` for API query params.
 */
export async function resolveCountryIdFromHeaders(): Promise<number | undefined> {
  const headersList = await headers()
  const code = headersList.get('x-country')
  if (!code) return undefined
  try {
    const country = await getCountryByCodeCached(code)
    return country?.id
  } catch {
    return undefined
  }
}
