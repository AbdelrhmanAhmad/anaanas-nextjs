import 'server-only'

import { cache } from 'react'

import { fetchCountries, type Country } from '@/lib/api/countries'

/**
 * Per-request dedupe + short CDN cache via `fetchCountries({ revalidateSeconds })`.
 * Use from Server Components / generateMetadata instead of uncached country list fetches.
 */
export const getCountryByCodeCached = cache(async (code: string | null | undefined): Promise<Country | null> => {
  if (!code?.trim()) return null
  const normalized = code.trim().toLowerCase()
  const countries = await fetchCountries({ revalidateSeconds: 600 })
  return (
    countries.find((country) => (country.iso2 || country.iso_code || '').toLowerCase() === normalized) ?? null
  )
})
