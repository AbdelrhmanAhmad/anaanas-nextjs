import { headers } from 'next/headers'
import { getCountryByCode } from '@/lib/api/countries'

/**
 * Same country resolution as Feeds: middleware sets `x-country` (e.g. jo),
 * we map to DB `countries.id` for API query params.
 */
export async function resolveCountryIdFromHeaders(): Promise<number | undefined> {
  const headersList = await headers()
  const code = headersList.get('x-country')
  if (!code) return undefined
  try {
    const country = await getCountryByCode(code)
    return country?.id
  } catch {
    return undefined
  }
}
