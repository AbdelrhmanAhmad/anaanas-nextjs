import { headers } from 'next/headers'

import TrendingAdsCardClient from './TrendingAdsCardClient'
import { fetchTrendingPosts } from '@/lib/api/homeInsights'
import { resolveCountryIdFromHeaders } from '@/lib/server/resolveCountryIdFromHeaders'
import { isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

export default async function TrendingAdsCard({ locale }: { locale: SupportedLocale }) {
  const headersList = await headers()
  const headerLocale = headersList.get('x-locale')
  const uiLocale: SupportedLocale =
    headerLocale && isSupportedLocale(headerLocale) ? headerLocale : locale

  const countryId = await resolveCountryIdFromHeaders()
  const items = await fetchTrendingPosts({ countryId, land: uiLocale, limit: 6 })

  return <TrendingAdsCardClient items={items} locale={uiLocale} />
}
