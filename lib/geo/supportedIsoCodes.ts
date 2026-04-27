import { getApiUrl } from '@/lib/api/config'

function extractCountriesArray(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) return json as Record<string, unknown>[]
  if (json && typeof json === 'object') {
    const o = json as Record<string, unknown>
    if (Array.isArray(o.data)) return o.data as Record<string, unknown>[]
    if (o.status && Array.isArray(o.data)) return o.data as Record<string, unknown>[]
    if (Array.isArray(o.countries)) return o.countries as Record<string, unknown>[]
  }
  return []
}

/**
 * ISO2 codes the backend exposes as active tenants (cached for middleware).
 */
export async function fetchSupportedCountryIso2Set(): Promise<Set<string>> {
  const url = getApiUrl('/api/countries')
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 600 },
    })
    if (!res.ok) return new Set()

    const json: unknown = await res.json()
    const rows = extractCountriesArray(json)
    const set = new Set<string>()
    for (const row of rows) {
      const iso2 = row.iso2 ?? row.iso_code
      if (typeof iso2 === 'string') {
        const c = iso2.trim().toLowerCase()
        if (/^[a-z]{2}$/.test(c)) set.add(c)
      }
    }
    return set
  } catch {
    return new Set()
  }
}
