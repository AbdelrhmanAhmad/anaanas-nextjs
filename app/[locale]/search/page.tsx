import type { Metadata } from 'next'

import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'
import { fetchSections } from '@/lib/api/sections'
import FeedLayoutClient from '@/components/layout/FeedLayoutClient'
import SideBar from '@/components/layout/SideBar'
import SearchClient from './SearchClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uiLocale: SupportedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE

  const title = uiLocale === 'ar' ? 'البحث في المنشورات | ANANAS' : 'Search Listings | ANANAS'
  const description =
    uiLocale === 'ar'
      ? 'ابحث في كل المنشورات على ANANAS مع فلاتر ذكية للسعر والقسم والفئة والصور.'
      : 'Search all listings on ANANAS with smart filters for price, section, category, and images.'

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: `/${uiLocale}/search` },
    openGraph: { title, description, type: 'website', url: `/${uiLocale}/search` },
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
