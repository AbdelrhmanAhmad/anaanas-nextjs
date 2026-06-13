import Feeds from '../../../home/components/Feeds'
import { t } from '@/lib/translations'
import { parseHasImages, parseNumber, parseSort } from '@/lib/sections/filterSummary'

type PageSearchParams = Record<string, string | string[] | undefined>

function firstValue(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0]
  return v
}

export default async function SectionRouteFeeds({
  searchParams,
  sectionSlug,
  uiLocale,
  sectionName,
}: {
  searchParams: Promise<PageSearchParams | undefined>
  sectionSlug: string
  uiLocale: 'ar' | 'en'
  sectionName: string
}) {
  const sp = (await searchParams) ?? {}
  const pageNum = parseNumber(firstValue(sp.page))
  const cityId = parseNumber(firstValue(sp.city_id))
  const priceMin = parseNumber(firstValue(sp.price_min))
  const priceMax = parseNumber(firstValue(sp.price_max))
  const hasImages = parseHasImages(firstValue(sp.has_images))
  const sort = parseSort(firstValue(sp.sort))
  const q = firstValue(sp.q)?.trim()

  return (
    <Feeds
      listingsHeading={t('seo.section.listings', uiLocale).replace('{{name}}', sectionName)}
      filters={{
        sectionSlug,
        q: q || undefined,
        cityId: Number.isFinite(cityId as any) ? (cityId as number) : undefined,
        priceMin: Number.isFinite(priceMin as any) ? (priceMin as number) : undefined,
        priceMax: Number.isFinite(priceMax as any) ? (priceMax as number) : undefined,
        hasImages,
        sort,
        page: Number.isFinite(pageNum as any) && (pageNum as number) > 0 ? (pageNum as number) : undefined,
        basePath: `/${uiLocale}/sections/${sectionSlug}`,
      }}
    />
  )
}
