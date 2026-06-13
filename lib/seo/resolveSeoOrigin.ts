import { headers } from 'next/headers'

import { getSiteOrigin } from '@/lib/seo/origin'

/** Request-aware absolute origin for canonicals, hreflang, OG, and sitemaps. */
export async function resolveSeoOrigin(): Promise<string> {
  const headersList = await headers()
  return getSiteOrigin(headersList)
}
