/**
 * Country filtering: middleware sets `x-country` from the host subdomain (e.g. jo.anaanas.com).
 * `Feeds` reads that header and resolves `country_id` for `/api/posts` — same pattern as the home page.
 */
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Col, Row } from 'react-bootstrap'

import Hero from './Hero'
import CreatePostCardLazyClient from '../../home/components/CreatePostCardLazyClient'
import { fetchSectionBySlug } from '@/lib/api/sections'
import { getCountryByCodeCached } from '@/lib/server/getCountryByCodeCached'
import { fetchCitiesByCountryId } from '@/lib/api/cities'
import ActiveFilterChips from './_components/ActiveFilterChips'
import ResultsSummaryBar from './_components/ResultsSummaryBar'
import SectionFiltersPanel from './_components/SectionFiltersPanel'
import BreadcrumbJsonLd from './_components/BreadcrumbJsonLd'
import SectionRouteFeeds from './_components/SectionRouteFeeds'
import SectionsResultsSkeleton from './_components/SectionsResultsSkeleton'
import { getSiteOrigin } from '@/lib/seo/origin'
import {
  buildSectionFilterParts,
  hasSectionSeoFilterNoise,
  parseNumber,
  recordToSearchParams,
} from '@/lib/sections/filterSummary'

type PageSearchParams = Record<string, string | string[] | undefined>

function firstValue(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0]
  return v
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
  const pageNum = parseNumber(firstValue(sp.page))
  const hasSeoFilters = hasSectionSeoFilterNoise(locale, sp)
  const filterParts = buildSectionFilterParts(locale, recordToSearchParams(sp))

  const baseTitle = sectionName
    ? locale === 'ar'
      ? `${sectionName} | المنشورات`
      : `${sectionName} listings`
    : locale === 'ar'
      ? 'المنشورات'
      : 'Listings'
  const title = pageNum && pageNum > 1 ? `${baseTitle} – ${locale === 'ar' ? 'صفحة' : 'Page'} ${pageNum}` : baseTitle

  const descBase = sectionName
    ? locale === 'ar'
      ? `تصفح أحدث المنشورات في قسم ${sectionName}`
      : `Browse latest listings under ${sectionName}`
    : locale === 'ar'
      ? 'تصفح أحدث المنشورات'
      : 'Browse latest listings'
  const description =
    filterParts.length > 0
      ? `${descBase} (${filterParts.join(locale === 'ar' ? '، ' : ', ')})`
      : descBase

  const basePath = `/${locale}/sections/${sectionSlug}`
  const keywords = [
    sectionName,
    locale === 'ar' ? 'إعلانات' : 'classifieds',
    locale === 'ar' ? 'اناناس' : 'ANANAS',
  ].filter(Boolean)

  return {
    title,
    description,
    keywords,
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
  const section = await fetchSectionBySlug(sectionSlug, locale)
  if (!section) {
    notFound()
  }

  const headersList = await headers()
  const countryCode = headersList.get('x-country')
  let cities: any[] = []
  if (countryCode) {
    try {
      const country = await getCountryByCodeCached(countryCode)
      if (country?.id) {
        cities = await fetchCitiesByCountryId(country.id)
      }
    } catch {
      // ignore
    }
  }

  const origin = getSiteOrigin(headersList)
  const uiLocale: 'ar' | 'en' = locale === 'en' ? 'en' : 'ar'

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

        <ResultsSummaryBar locale={uiLocale} />

        <Row className="g-4">
          <Col md={12} lg={8} className="vstack gap-4">
            <CreatePostCardLazyClient />
            <Suspense fallback={<SectionsResultsSkeleton />}>
              <SectionRouteFeeds
                searchParams={searchParams ?? Promise.resolve({})}
                sectionSlug={sectionSlug}
                uiLocale={uiLocale}
                sectionName={section.name}
              />
            </Suspense>
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
