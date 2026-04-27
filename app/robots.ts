import type { MetadataRoute } from 'next'

import { getPublicSiteOrigin } from '@/lib/seo/siteUrl'

/**
 * Served at `/robots.txt`. Keeps crawlers out of API and build internals.
 * `host` + `sitemap` use the same origin as `metadataBase` / `NEXT_PUBLIC_SITE_URL`.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = getPublicSiteOrigin()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin.replace(/^https?:\/\//, ''),
  }
}
