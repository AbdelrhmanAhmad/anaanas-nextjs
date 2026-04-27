import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Col, Row } from 'react-bootstrap'

import CreatePostCard from '@/components/cards/CreatePostCard'
import PostsFilterPanel from './PostsFilterPanel'
import MobileFiltersModal from './MobileFiltersModal'
import { fetchSectionBySlug } from '@/lib/api/sections'
import { fetchCategoriesBySectionId } from '@/lib/api/categories'
import { fetchFields } from '@/lib/api/fields'
import { getCountryByCodeCached } from '@/lib/server/getCountryByCodeCached'
import { fetchCitiesByCountryId } from '@/lib/api/cities'
import ActiveFilterChips from '../_components/ActiveFilterChips'
import ResultsSummaryBar from '../_components/ResultsSummaryBar'
import CategoryHero from '../_components/CategoryHero'
import BreadcrumbJsonLd from '../_components/BreadcrumbJsonLd'
import CategoryRouteFeeds from './_components/CategoryRouteFeeds'
import SectionsResultsSkeleton from '../_components/SectionsResultsSkeleton'
import { getSiteOrigin } from '@/lib/seo/origin'
import {
  buildCategoryFilterParts,
  hasCategorySeoFilterNoise,
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

  const baseTitle =
    sectionName && categoryName
      ? `${categoryName} | ${sectionName}`
      : categoryName || sectionName || (locale === 'ar' ? 'المنشورات' : 'Listings')

  const page = parseNumber(firstValue(sp.page))
  const filterParts = buildCategoryFilterParts(locale, recordToSearchParams(sp))
  const hasSeoFilters = hasCategorySeoFilterNoise(locale, sp)

  const title = page && page > 1 ? `${baseTitle} – ${locale === 'ar' ? 'صفحة' : 'Page'} ${page}` : baseTitle

  const basePath = `/${locale}/sections/${sectionSlug}/${categorySlug}`
  const descriptionBase =
    sectionName && categoryName
      ? locale === 'ar'
        ? `تصفح أحدث المنشورات في ${categoryName} ضمن قسم ${sectionName}`
        : `Browse latest posts in ${categoryName} under ${sectionName}`
      : locale === 'ar'
        ? 'تصفح أحدث المنشورات'
        : 'Browse latest posts'
  const description =
    filterParts.length > 0
      ? `${descriptionBase} (${filterParts.join(locale === 'ar' ? '، ' : ', ')})`
      : descriptionBase

  const keywords = [categoryName, sectionName, locale === 'ar' ? 'إعلانات' : 'classifieds', 'ANANAS'].filter(Boolean)

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
    robots: { index: !hasSeoFilters, follow: true },
  }
}

const Section = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string; category: string }>
  searchParams: Promise<PageSearchParams>
}) => {
  const { locale, section: sectionSlug, category: categorySlug } = await params

  const section = await fetchSectionBySlug(sectionSlug, locale)
  const categories = section ? await fetchCategoriesBySectionId(section.id, locale) : []
  const category = categories.find((c) => c.slug === categorySlug) ?? null
  if (!section || !category) {
    notFound()
  }

  const fields = await fetchFields(section.id, category.id, locale)

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
    <Col md={8} lg={8} className="vstack gap-3">
      <BreadcrumbJsonLd
        items={[
          { name: uiLocale === 'ar' ? 'الرئيسية' : 'Home', url: `${origin}/${uiLocale}` },
          { name: section.name, url: `${origin}/${uiLocale}/sections/${sectionSlug}` },
          { name: category.name, url: `${origin}/${uiLocale}/sections/${sectionSlug}/${categorySlug}` },
        ]}
      />

      <CategoryHero
        locale={uiLocale}
        section={{ id: section.id, name: section.name, slug: section.slug, image: section.image ?? null }}
        category={{ id: category.id, name: category.name, slug: category.slug, icon: category.icon ?? null }}
        categoriesInSection={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon ?? null }))}
      />

      <ActiveFilterChips locale={uiLocale} cities={cities} fields={fields} />

      <ResultsSummaryBar
        locale={uiLocale}
        heading={category.name}
        categoryName={category.name}
        trailing={
          <div className="d-lg-none w-100">
            <MobileFiltersModal fields={fields} cities={cities} />
          </div>
        }
      />

      <Row className="g-4">
        <Col md={12} lg={8} className="vstack gap-4">
          <CreatePostCard />
          <Suspense fallback={<SectionsResultsSkeleton />}>
            <CategoryRouteFeeds
              searchParams={searchParams}
              sectionSlug={sectionSlug}
              categorySlug={categorySlug}
              uiLocale={uiLocale}
            />
          </Suspense>
        </Col>

        <Col lg={4} className="mb-4 mb-lg-0 d-none d-lg-block">
          <PostsFilterPanel fields={fields} cities={cities} />
        </Col>
      </Row>
    </Col>
  )
}

export default Section
