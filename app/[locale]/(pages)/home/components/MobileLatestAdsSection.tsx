import { headers } from 'next/headers'

import { fetchLatestListings } from '@/lib/server/fetchLatestListings'
import { getCountryByCodeCached } from '@/lib/server/getCountryByCodeCached'
import { isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

import MobileLatestAdsSectionClient from './MobileLatestAdsSectionClient'

/** Mobile-only horizontal strip; hidden from md breakpoint up via CSS. */
export default async function MobileLatestAdsSection({ locale }: { locale: SupportedLocale }) {
  const headersList = await headers()
  const headerLocale = headersList.get('x-locale')
  const uiLocale: SupportedLocale =
    headerLocale && isSupportedLocale(headerLocale) ? headerLocale : locale

  const countryCode = headersList.get('x-country')
  let countryId: number | undefined
  if (countryCode) {
    try {
      const country = await getCountryByCodeCached(countryCode)
      countryId = country?.id
    } catch {
      countryId = undefined
    }
  }

  const items = await fetchLatestListings({
    countryId,
    land: uiLocale,
    limit: 12,
  })

  return (
    <div className="d-md-none">
      <MobileLatestAdsSectionClient items={items} locale={uiLocale} />
    </div>
  )
}
