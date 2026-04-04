import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Col, Row } from 'react-bootstrap'

import CreatePostCard from '@/components/cards/CreatePostCard'
import Feeds from '../../home/components/Feeds'
import PostsFilterPanel from './PostsFilterPanel'
import MobileFiltersModal from './MobileFiltersModal'
import { fetchSectionBySlug } from '@/lib/api/sections'
import { fetchCategoriesBySectionId } from '@/lib/api/categories'
import { fetchFields } from '@/lib/api/fields'
import { getCountryByCode } from '@/lib/api/countries'
import { fetchCitiesByCountryId } from '@/lib/api/cities'

type PageSearchParams = Record<string, string | string[] | undefined>

function firstValue(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0]
  return v
}

function parseNumber(v: string | undefined): number | undefined {
  if (!v) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function parseHasImages(v: string | undefined): boolean | undefined {
  if (!v) return undefined
  const normalized = v.trim().toLowerCase()
  if (normalized === '1' || normalized === 'true' || normalized === 'yes') return true
  if (normalized === '0' || normalized === 'false' || normalized === 'no') return false
  return undefined
}

function parseSort(v: string | undefined): 'newest' | 'oldest' | 'price_asc' | 'price_desc' {
  if (v === 'oldest' || v === 'price_asc' || v === 'price_desc') return v
  return 'newest'
}

function buildFilterSummary(
  locale: string,
  hasImages: boolean | undefined,
  sort: 'newest' | 'oldest' | 'price_asc' | 'price_desc',
  cityId?: number,
  priceMin?: number,
  priceMax?: number,
) {
  const ar = locale === 'ar'
  const parts: string[] = []
  if (cityId) parts.push(ar ? 'مدينة محددة' : 'specific city')
  if (priceMin != null || priceMax != null) parts.push(ar ? 'نطاق سعر' : 'price range')
  if (hasImages === true) parts.push(ar ? 'بصور' : 'with images')
  if (hasImages === false) parts.push(ar ? 'بدون صور' : 'without images')
  if (sort !== 'newest') {
    parts.push(
      sort === 'oldest'
        ? ar
          ? 'الأقدم أولًا'
          : 'oldest first'
        : sort === 'price_asc'
          ? ar
            ? 'السعر تصاعدي'
            : 'price low to high'
          : ar
            ? 'السعر تنازلي'
            : 'price high to low',
    )
  }
  return parts
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string; category: string }>
  searchParams: Promise<PageSearchParams>
}): Promise<Metadata> {
  const { locale, section: sectionSlug, category: categorySlug } = await params
  const sp = await searchParams
  const section = await fetchSectionBySlug(sectionSlug, locale)
  const categories = section ? await fetchCategoriesBySectionId(section.id, locale) : []
  const category = categories.find((c) => c.slug === categorySlug) ?? null

  const sectionName = section?.name ?? ''
  const categoryName = category?.name ?? ''

  const title =
    sectionName && categoryName
      ? `${categoryName} | ${sectionName}`
      : categoryName || sectionName || 'المنشورات'

  const cityId = parseNumber(firstValue(sp.city_id))
  const priceMin = parseNumber(firstValue(sp.price_min))
  const priceMax = parseNumber(firstValue(sp.price_max))
  const hasImages = parseHasImages(firstValue(sp.has_images))
  const sort = parseSort(firstValue(sp.sort))
  const page = parseNumber(firstValue(sp.page))
  const parsedAttrs = parseAttrFilters(sp)

  const filterSummary = buildFilterSummary(locale, hasImages, sort, cityId, priceMin, priceMax)
  const hasSeoFilters =
    filterSummary.length > 0 ||
    Object.keys(parsedAttrs.options).length > 0 ||
    Object.keys(parsedAttrs.ranges).length > 0 ||
    (page != null && page > 1)

  const basePath = `/${locale}/${sectionSlug}/${categorySlug}`
  const descriptionBase =
    sectionName && categoryName
      ? locale === 'ar'
        ? `تصفح أحدث المنشورات في ${categoryName} ضمن قسم ${sectionName}`
        : `Browse latest posts in ${categoryName} under ${sectionName}`
      : locale === 'ar'
        ? 'تصفح أحدث المنشورات'
        : 'Browse latest posts'
  const description =
    filterSummary.length > 0
      ? `${descriptionBase} (${filterSummary.join(locale === 'ar' ? '، ' : ', ')})`
      : descriptionBase

  return {
    title,
    description,
    alternates: {
      canonical: basePath,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      url: basePath,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: !hasSeoFilters,
      follow: true,
    },
  }
}

function parseAttrFilters(searchParams: Record<string, string | string[] | undefined>): {
  options: Record<number, number[]>
  ranges: Record<number, { from?: string; to?: string }>
} {
  const options: Record<number, number[]> = {}
  const ranges: Record<number, { from?: string; to?: string }> = {}

  for (const [k, v] of Object.entries(searchParams)) {
    // Preferred:
    // attr[795][]=11880
    // attr[900][from]=10
    const mList = k.match(/^attr\[(\d+)\]\[\]$/)
    const mSingle = k.match(/^attr\[(\d+)\]$/)
    const mFromTo = k.match(/^attr\[(\d+)\]\[(from|to)\]$/)

    if (mList || mSingle) {
      const attrId = Number((mList ?? mSingle)![1])
      if (!attrId) continue
      const vals = Array.isArray(v) ? v : v != null ? [v] : []
      const optionIds = vals
        .flatMap((x) => String(x).split(','))
        .map((x) => Number(String(x).trim()))
        .filter((n) => Number.isFinite(n)) as number[]
      if (!optionIds.length) continue
      options[attrId] = Array.from(new Set([...(options[attrId] ?? []), ...optionIds]))
      continue
    }

    if (mFromTo) {
      const attrId = Number(mFromTo[1])
      const kind = mFromTo[2] as 'from' | 'to'
      if (!attrId) continue
      const val = Array.isArray(v) ? v[0] : v
      if (val == null) continue
      const s = String(val).trim()
      if (!s) continue
      ranges[attrId] = { ...(ranges[attrId] ?? {}), [kind]: s }
      continue
    }

    // Backward compatibility: a795 / a795[]
    if (k.startsWith('a')) {
      const keyWithoutBrackets = k.replace(/\[\]$/, '')
      const attrId = Number(keyWithoutBrackets.slice(1))
      if (!attrId) continue
      const vals = Array.isArray(v) ? v : v != null ? [v] : []
      const optionIds = vals
        .flatMap((x) => String(x).split(','))
        .map((x) => Number(String(x).trim()))
        .filter((n) => Number.isFinite(n)) as number[]
      if (!optionIds.length) continue
      options[attrId] = Array.from(new Set([...(options[attrId] ?? []), ...optionIds]))
    }
  }

  return { options, ranges }
}

const Section = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string; category: string }>
  searchParams: Promise<PageSearchParams>
}) => {
  const { locale, section: sectionSlug, category: categorySlug } = await params
  const sp = await searchParams

  const section = await fetchSectionBySlug(sectionSlug, locale)
  const categories = section ? await fetchCategoriesBySectionId(section.id, locale) : []
  const category = categories.find((c) => c.slug === categorySlug) ?? null
  if (!section || !category) {
    notFound()
  }

  const fields = section && category ? await fetchFields(section.id, category.id, locale) : []

  // Cities for current country (subdomain)
  const headersList = await headers()
  const countryCode = headersList.get('x-country')
  let cities: any[] = []
  if (countryCode) {
    try {
      const country = await getCountryByCode(countryCode)
      if (country?.id) {
        cities = await fetchCitiesByCountryId(country.id)
      }
    } catch {
      // ignore
    }
  }

  const cityId = parseNumber(firstValue(sp.city_id))
  const priceMin = parseNumber(firstValue(sp.price_min))
  const priceMax = parseNumber(firstValue(sp.price_max))
  const hasImages = parseHasImages(firstValue(sp.has_images))
  const sort = parseSort(firstValue(sp.sort))
  const page = parseNumber(firstValue(sp.page))
  const parsedAttrs = parseAttrFilters(sp)

  return (
    <Col md={8} lg={8} className="vstack gap-3">
      <div className="mb-0">
        <MobileFiltersModal fields={fields} cities={cities} />
      </div>

      <Row className="g-4">
        <Col md={12} lg={8} className="vstack gap-4">
          <CreatePostCard />
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
              basePath: `/${locale}/${sectionSlug}/${categorySlug}`,
            }}
          />
        </Col>

        <Col lg={4} className="mb-4 mb-lg-0 d-none d-lg-block">
          <PostsFilterPanel fields={fields} cities={cities} />
        </Col>
      </Row>
    </Col>
  )
}

export default Section
