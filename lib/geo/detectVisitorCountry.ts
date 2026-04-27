import type { NextRequest } from 'next/server'

const INVALID_CF = new Set(['XX', 'T1'])

function normalizeIso2(v: string | null | undefined): string | null {
  if (v == null) return null
  const c = v.trim().toUpperCase()
  if (c.length !== 2 || !/^[A-Z]{2}$/.test(c) || INVALID_CF.has(c)) return null
  return c.toLowerCase()
}

function getClientIp(req: NextRequest): string | null {
  const cf = req.headers.get('cf-connecting-ip')
  if (cf) return cf.trim()
  const tci = req.headers.get('true-client-ip')
  if (tci) return tci.trim()
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() || null
  const xr = req.headers.get('x-real-ip')
  if (xr) return xr.trim()
  return null
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { ...init, signal: ctrl.signal })
  } finally {
    clearTimeout(t)
  }
}

/**
 * Secondary lookup when Cloudflare does not send a country (or sends XX).
 * Uses `COUNTRY_GEO_IP_LOOKUP_URL` if set (`{ip}` placeholder), else ipapi.co (HTTPS).
 */
async function fetchCountryFromIpLookup(ip: string): Promise<string | null> {
  const custom = process.env.COUNTRY_GEO_IP_LOOKUP_URL?.trim()
  if (custom) {
    try {
      const url = custom.includes('{ip}')
        ? custom.replace(/\{ip\}/g, encodeURIComponent(ip))
        : `${custom}${encodeURIComponent(ip)}`
      const res = await fetchWithTimeout(
        url,
        { headers: { Accept: 'application/json' } },
        2800,
      )
      if (!res.ok) return null
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        const j = (await res.json()) as { country_code?: string; countryCode?: string }
        return normalizeIso2(j.country_code || j.countryCode || null)
      }
      const text = (await res.text()).trim()
      return normalizeIso2(text.length === 2 ? text : null)
    } catch {
      return null
    }
  }

  try {
    const res = await fetchWithTimeout(
      `https://ipapi.co/${encodeURIComponent(ip)}/country/`,
      { headers: { Accept: 'text/plain' } },
      2800,
    )
    if (!res.ok) return null
    const text = (await res.text()).trim().toUpperCase()
    return normalizeIso2(text.length === 2 ? text : null)
  } catch {
    return null
  }
}

export type VisitorCountrySource = 'cf-ipcountry' | 'ip-lookup' | null

/**
 * 1) Cloudflare `CF-IPCountry` when present and valid.
 * 2) IP geolocation API using `CF-Connecting-IP` / `X-Forwarded-For` when needed.
 */
export async function detectVisitorCountryIso2(
  req: NextRequest,
): Promise<{ code: string | null; source: VisitorCountrySource }> {
  const fromCf = normalizeIso2(req.headers.get('cf-ipcountry'))
  if (fromCf) {
    return { code: fromCf, source: 'cf-ipcountry' }
  }

  const ip = getClientIp(req)
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return { code: null, source: null }
  }

  const fromApi = await fetchCountryFromIpLookup(ip)
  if (fromApi) {
    return { code: fromApi, source: 'ip-lookup' }
  }

  return { code: null, source: null }
}
