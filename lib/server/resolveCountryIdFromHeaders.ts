import { cookies, headers } from 'next/headers'

import { parseHost } from '@/lib/domain'
import {
  PREFERRED_COUNTRY_COOKIE,
  normalizePreferredCountryIso2,
} from '@/lib/geo/preferredCountryCookie'
import { getCountryByCodeCached } from '@/lib/server/getCountryByCodeCached'

/**
 * Resolve ISO2 country code: middleware `x-country`, preferred cookie, then host subdomain.
 */
async function resolveCountryCodeFromRequest(): Promise<string | undefined> {
  const headersList = await headers()

  const fromHeader = headersList.get('x-country')?.trim().toLowerCase()
  if (fromHeader) return fromHeader

  const cookieStore = await cookies()
  const fromCookie = normalizePreferredCountryIso2(cookieStore.get(PREFERRED_COUNTRY_COOKIE)?.value)
  if (fromCookie) return fromCookie

  const hostCtx = parseHost(headersList.get('host'))
  if (hostCtx.hasCountrySubdomain && hostCtx.countrySubdomain) {
    return hostCtx.countrySubdomain.toLowerCase()
  }

  return undefined
}

/**
 * Same country resolution as Feeds: map portal ISO2 to DB `countries.id` for API query params.
 */
export async function resolveCountryIdFromHeaders(): Promise<number | undefined> {
  const code = await resolveCountryCodeFromRequest()
  if (!code) return undefined
  try {
    const country = await getCountryByCodeCached(code)
    const id = country?.id
    return id != null && id > 0 ? id : undefined
  } catch {
    return undefined
  }
}
