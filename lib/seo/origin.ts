/**
 * Derive the current absolute origin from request headers so structured data
 * (BreadcrumbList, etc.) emits valid `item` URLs in both dev and production.
 * Falls back to NEXT_PUBLIC_SITE_URL, then a safe localhost default.
 *
 * Accepts any object with a `.get(name)` method that returns a string or null,
 * which covers both `Headers` and Next.js' `ReadonlyHeaders`.
 */
type HeaderGetter = { get(name: string): string | null }

export function getSiteOrigin(headersList: HeaderGetter): string {
  const headerOrigin = headersList.get('origin')
  if (headerOrigin) return headerOrigin.replace(/\/$/, '')

  const host = headersList.get('x-forwarded-host') || headersList.get('host')
  if (host) {
    const proto =
      headersList.get('x-forwarded-proto') ||
      (host.startsWith('localhost') || /\.localhost(?::\d+)?$/.test(host) ? 'http' : 'https')
    return `${proto}://${host}`.replace(/\/$/, '')
  }

  const env = process.env.NEXT_PUBLIC_SITE_URL
  if (env) return env.replace(/\/$/, '')

  return 'http://localhost:3000'
}
