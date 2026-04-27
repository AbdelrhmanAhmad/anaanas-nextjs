import { getPublicSiteOrigin } from '@/lib/seo/siteUrl'

/** يحوّل مساراً نسبياً أو مطلقاً إلى URL مطلق لـ Open Graph / JSON-LD */
export function toAbsoluteUrl(href: string, origin?: string): string {
  const base = (origin ?? getPublicSiteOrigin()).replace(/\/$/, '')
  const u = href.trim()
  if (!u) return base
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  if (u.startsWith('//')) return `https:${u}`
  const path = u.startsWith('/') ? u : `/${u}`
  return `${base}${path}`
}
