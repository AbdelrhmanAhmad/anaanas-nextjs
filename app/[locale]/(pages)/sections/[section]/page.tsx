/**
 * Country filtering: middleware sets `x-country` from the host subdomain (e.g. jo.anaanas.com).
 * `Feeds` reads that header and resolves `country_id` for `/api/posts` — same pattern as the home page.
 */
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Col, Row } from 'react-bootstrap'

import Hero from './Hero'
import CreatePostCard from '@/components/cards/CreatePostCard'
import Feeds from '../../home/components/Feeds'
import { fetchSectionBySlug } from '@/lib/api/sections'
import { getCountryByCode } from '@/lib/api/countries'
import { fetchCitiesByCountryId } from '@/lib/api/cities'
import ActiveFilterChips from './_components/ActiveFilterChips'
import ResultsSummaryBar from './_components/ResultsSummaryBar'
import SectionFiltersPanel from './_components/SectionFiltersPanel'
import BreadcrumbJsonLd from './_components/BreadcrumbJsonLd'
import { getSiteOrigin } from '@/lib/seo/origin'

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
  const norm = v.trim().toLowerCase()
  if (norm === '1' || norm === 'true' || norm === 'yes') return true
  if (norm === '0' || norm === 'false' || norm === 'no') return false
  return undefined
}

function parseSort(v: string | undefined): 'newest' | 'oldest' | 'price_asc' | 'price_desc' {
  if (v === 'oldest' || v === 'price_asc' || v === 'price_desc') return v
  return 'newest'
}

function buildFilterSummary(
  locale: string,
  q: string | undefined,
  hasImages: boolean | undefined,
  sort: 'newest' | 'oldest' | 'price_asc' | 'price_desc',
  cityId?: number,
  priceMin?: number,
  priceMax?: number,
) {
  const ar = locale === 'ar'
  const parts: string[] = []
  if (q && q.trim()) parts.push(ar ? `بحث "${q.trim()}"` : `search "${q.trim()}"`)
  if (cityId) parts.push(ar ? 'مدينة محددة' : 'specific city')
  if (priceMin != null || priceMax != null) parts.push(ar ? 'نطاق سعر' : 'price range')
  if (hasImages === true) parts.push(ar ? 'بصور' : 'with images')
  if (hasImages === false) parts.push(ar ? 'بدون صور' : 'without images')
  if (sort !== 'newest') {
    parts.push(
      sort === 'oldest'
        ? (ar ? 'الأقدم أولًا' : 'oldest first')
        : sort === 'price_asc'
          ? (ar ? 'السعر تصاعدي' : 'price low to high')
          : (ar ? 'السعر تنازلي' : 'price high to low'),
    )
  }
  return parts
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string }>
  searchParams?: Promise<PageSearchParams>
}): Promise<Metadata> {
  const { locale, section: sectionSlug } = await params
  const sp = (await searchParams) ?? {}
  const section = await fetchSectionBySlug(sectionSlug, locale)

  const sectionName = section?.name ?? ''
  const cityId = parseNumber(firstValue(sp.city_id))
  const priceMin = parseNumber(firstValue(sp.price_min))
  const priceMax = parseNumber(firstValue(sp.price_max))
  const hasImages = parseHasImages(firstValue(sp.has_images))
  const sort = parseSort(firstValue(sp.sort))
  const pageNum = parseNumber(firstValue(sp.page))
  const q = firstValue(sp.q)?.trim() ?? ''

  const summary = buildFilterSummary(locale, q, hasImages, sort, cityId, priceMin, priceMax)
  const hasSeoFilters = summary.length > 0 || (pageNum != null && pageNum > 1)

  const baseTitle = sectionName
    ? (locale === 'ar' ? `${sectionName} | المنشورات` : `${sectionName} listings`)
    : (locale === 'ar' ? 'المنشورات' : 'Listings')
  const title = pageNum && pageNum > 1 ? `${baseTitle} – ${locale === 'ar' ? 'صفحة' : 'Page'} ${pageNum}` : baseTitle

  const descBase = sectionName
    ? (locale === 'ar' ? `تصفح أحدث المنشورات في قسم ${sectionName}` : `Browse latest listings under ${sectionName}`)
    : (locale === 'ar' ? 'تصفح أحدث المنشورات' : 'Browse latest listings')
  const description = summary.length > 0
    ? `${descBase} (${summary.join(locale === 'ar' ? '، ' : ', ')})`
    : descBase

  const basePath = `/${locale}/sections/${sectionSlug}`

  return {
    title,
    description,
    alternates: { canonical: basePath },
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

const Section = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string }>
  searchParams?: Promise<PageSearchParams>
}) => {
  const { locale, section: sectionSlug } = await params
  const sp = (await searchParams) ?? {}
  const section = await fetchSectionBySlug(sectionSlug, locale)
  if (!section) {
    notFound()
  }

  const pageNum = parseNumber(firstValue(sp.page))
  const cityId = parseNumber(firstValue(sp.city_id))
  const priceMin = parseNumber(firstValue(sp.price_min))
  const priceMax = parseNumber(firstValue(sp.price_max))
  const hasImages = parseHasImages(firstValue(sp.has_images))
  const sort = parseSort(firstValue(sp.sort))
  const q = firstValue(sp.q)?.trim()

  // Resolve cities for the active country subdomain.
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

  const origin = getSiteOrigin(headersList)
  const uiLocale: 'ar' | 'en' = locale === 'en' ? 'en' : 'ar'

  const summary = buildFilterSummary(locale, q, hasImages, sort, cityId, priceMin, priceMax)
  const summaryText =
    summary.length > 0
      ? (uiLocale === 'ar' ? `تصفية: ${summary.join('، ')}` : `Filtered by: ${summary.join(', ')}`)
      : uiLocale === 'ar'
        ? 'تصفح أحدث المنشورات'
        : 'Browse latest listings'

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: uiLocale === 'ar' ? 'الرئيسية' : 'Home', url: `${origin}/${uiLocale}` },
          { name: section.name, url: `${origin}/${uiLocale}/sections/${sectionSlug}` },
        ]}
      />

      <Col md={8} lg={8} className="vstack gap-3">
        <Hero />

        <ActiveFilterChips locale={uiLocale} cities={cities} />

        <ResultsSummaryBar
          locale={uiLocale}
          heading={section.name}
          subtitle={summaryText}
        />

        <Row className="g-4">
          <Col md={12} lg={8} className="vstack gap-4">
            <CreatePostCard />
            <Feeds
              filters={{
                sectionSlug,
                cityId: Number.isFinite(cityId as any) ? (cityId as number) : undefined,
                priceMin: Number.isFinite(priceMin as any) ? (priceMin as number) : undefined,
                priceMax: Number.isFinite(priceMax as any) ? (priceMax as number) : undefined,
                hasImages,
                sort,
                page: Number.isFinite(pageNum as any) && (pageNum as number) > 0 ? (pageNum as number) : undefined,
                basePath: `/${uiLocale}/sections/${sectionSlug}`,
              }}
            />
          </Col>

          <Col lg={4} className="mb-4 mb-lg-0 d-none d-lg-block">
            <SectionFiltersPanel locale={uiLocale} cities={cities} />
          </Col>
        </Row>
      </Col>
    </>
  )
}

export default Section
