import type { Metadata } from 'next'

import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'
import { fetchSections } from '@/lib/api/sections'
import FeedLayoutClient from '@/components/layout/FeedLayoutClient'
import SideBar from '@/components/layout/SideBar'
import SearchClient from './SearchClient'

type PageSearchParams = Record<string, string | string[] | undefined>

function firstValue(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0]
  return v
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<PageSearchParams>
}): Promise<Metadata> {
  const { locale } = await params
  const sp = await searchParams
  const uiLocale: SupportedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE

  const q = (firstValue(sp.q) ?? '').trim()
  const sectionSlug = (firstValue(sp.section_slug) ?? '').trim()
  const categorySlug = (firstValue(sp.category_slug) ?? '').trim()

  const baseTitle = uiLocale === 'ar' ? 'البحث في المنشورات | ANANAS' : 'Search Listings | ANANAS'
  const title =
    q !== ''
      ? uiLocale === 'ar'
        ? `بحث: ${q} | ANANAS`
        : `Search: ${q} | ANANAS`
      : sectionSlug || categorySlug
        ? uiLocale === 'ar'
          ? `تصفية المنشورات | ANANAS`
          : `Filtered listings | ANANAS`
        : baseTitle

  let description =
    uiLocale === 'ar'
      ? 'ابحث في كل المنشورات على ANANAS مع فلاتر ذكية للسعر والقسم والفئة والصور.'
      : 'Search all listings on ANANAS with smart filters for price, section, category, and images.'

  if (q !== '') {
    description =
      uiLocale === 'ar'
        ? `نتائج البحث عن «${q}» على ANANAS. استخدم الفلاتر لتضييق النتائج.`
        : `Search results for “${q}” on ANANAS. Use filters to narrow results.`
  }

  const canonicalPath = `/${uiLocale}/search`
  const keywords = [
    uiLocale === 'ar' ? 'بحث' : 'search',
    uiLocale === 'ar' ? 'إعلانات' : 'classifieds',
    'ANANAS',
    q || undefined,
    sectionSlug || undefined,
    categorySlug || undefined,
  ].filter(Boolean) as string[]

  return {
    title,
    description,
    keywords,
    robots: { index: false, follow: true },
    alternates: { canonical: canonicalPath },
    openGraph: { title, description, type: 'website', url: canonicalPath },
    twitter: { card: 'summary', title, description },
  }
}

const SearchPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  const uiLocale: SupportedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE

  const sections = await fetchSections(uiLocale)

  return (
    <FeedLayoutClient locale={uiLocale} sidebar={<SideBar sections={sections} locale={uiLocale} />}>
      <SearchClient locale={uiLocale} sections={sections} />
    </FeedLayoutClient>
  )
}

export default SearchPage
