import type { MetadataRoute } from 'next'

import { getPublicSiteOrigin } from '@/lib/seo/siteUrl'
import { SUPPORTED_LOCALES } from '@/lib/localization'

/** Core indexable routes (extend when you add more public marketing pages). */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getPublicSiteOrigin()
  const now = new Date()

  const urls: MetadataRoute.Sitemap = []

  for (const locale of SUPPORTED_LOCALES) {
    urls.push({
      url: `${origin}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    })
    urls.push({
      url: `${origin}/${locale}/select-country`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  return urls
}
