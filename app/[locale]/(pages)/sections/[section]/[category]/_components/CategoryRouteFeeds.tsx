import Feeds from '../../../../home/components/Feeds'
import { parseAttrFiltersFromRecord, parseHasImages, parseNumber, parseSort } from '@/lib/sections/filterSummary'

type PageSearchParams = Record<string, string | string[] | undefined>

function firstValue(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0]
  return v
}

export default async function CategoryRouteFeeds({
  searchParams,
  sectionSlug,
  categorySlug,
  uiLocale,
}: {
  searchParams: Promise<PageSearchParams | undefined>
  sectionSlug: string
  categorySlug: string
  uiLocale: 'ar' | 'en'
}) {
  const sp = (await searchParams) ?? {}
  const cityId = parseNumber(firstValue(sp.city_id))
  const priceMin = parseNumber(firstValue(sp.price_min))
  const priceMax = parseNumber(firstValue(sp.price_max))
  const hasImages = parseHasImages(firstValue(sp.has_images))
  const sort = parseSort(firstValue(sp.sort))
  const page = parseNumber(firstValue(sp.page))
  const parsedAttrs = parseAttrFiltersFromRecord(sp)

  return (
    <Feeds
      filters={{
        sectionSlug,
        categorySlug,
        cityId: Number.isFinite(cityId as any) ? (cityId as number) : undefined,
        priceMin: Number.isFinite(priceMin as any) ? (priceMin as number) : undefined,
        priceMax: Number.isFinite(priceMax as any) ? (priceMax as number) : undefined,
        hasImages,
        sort,
        attributes: parsedAttrs.options,
        attributeRanges: parsedAttrs.ranges,
        page: Number.isFinite(page as any) && (page as number) > 0 ? (page as number) : undefined,
        basePath: `/${uiLocale}/sections/${sectionSlug}/${categorySlug}`,
      }}
    />
  )
}
