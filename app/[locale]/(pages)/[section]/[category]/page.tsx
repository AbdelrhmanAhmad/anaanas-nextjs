import type { Metadata } from 'next'
import { headers } from 'next/headers'
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string; category: string }>
}): Promise<Metadata> {
  const { locale, section: sectionSlug, category: categorySlug } = await params
  const section = await fetchSectionBySlug(sectionSlug, locale)
  const categories = section ? await fetchCategoriesBySectionId(section.id, locale) : []
  const category = categories.find((c) => c.slug === categorySlug) ?? null

  const sectionName = section?.name ?? ''
  const categoryName = category?.name ?? ''

  const title =
    sectionName && categoryName
      ? `${categoryName} | ${sectionName}`
      : categoryName || sectionName || 'المنشورات'

  return {
    title,
    description:
      sectionName && categoryName
        ? `تصفح أحدث المنشورات في ${categoryName} ضمن قسم ${sectionName}`
        : 'تصفح أحدث المنشورات',
    robots: {
      index: true,
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
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) => {
  const { locale, section: sectionSlug, category: categorySlug } = await params
  const sp = await searchParams

  const section = await fetchSectionBySlug(sectionSlug, locale)
  const categories = section ? await fetchCategoriesBySectionId(section.id, locale) : []
  const category = categories.find((c) => c.slug === categorySlug) ?? null

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

  const cityId = sp.city_id ? Number(Array.isArray(sp.city_id) ? sp.city_id[0] : sp.city_id) : undefined
  const priceMin = sp.price_min ? Number(Array.isArray(sp.price_min) ? sp.price_min[0] : sp.price_min) : undefined
  const priceMax = sp.price_max ? Number(Array.isArray(sp.price_max) ? sp.price_max[0] : sp.price_max) : undefined
  const pageRaw = sp.page ? (Array.isArray(sp.page) ? sp.page[0] : sp.page) : undefined
  const page = pageRaw ? Number(pageRaw) : undefined
  const parsedAttrs = parseAttrFilters(sp)

  return (
    <>
          <Col md={8} lg={8} className="vstack gap-4">
          <Row >

      <Col xs={12} className="mb-3">
        <MobileFiltersModal fields={fields} cities={cities} />
      </Col>
   

      <Col md={8} lg={8} className="vstack gap-4">
        <CreatePostCard />
        <Feeds
          filters={{
            sectionSlug,
            categorySlug,
            cityId: Number.isFinite(cityId as any) ? (cityId as number) : undefined,
            priceMin: Number.isFinite(priceMin as any) ? (priceMin as number) : undefined,
            priceMax: Number.isFinite(priceMax as any) ? (priceMax as number) : undefined,
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
    </>
  )
}

export default Section
