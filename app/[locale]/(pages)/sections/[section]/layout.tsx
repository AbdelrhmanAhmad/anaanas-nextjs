import type { ChildrenType } from '@/types/component'
import { fetchSectionBySlug } from '@/lib/api/sections'
import { fetchCategoriesBySectionId } from '@/lib/api/categories'
import FeedLayoutClient from '@/components/layout/FeedLayoutClient'
import SectionSidebar from '@/components/layout/SectionSidebar'
import { SectionProvider } from '@/context/SectionContext'
import { headers } from 'next/headers'

type SectionLayoutProps = ChildrenType & {
  params: Promise<{
    locale: string
    section: string
  }>
}

const SectionLayout = async ({ children, params }: SectionLayoutProps) => {
  const resolvedParams = await params
  const headersList = await headers()
  const locale = headersList.get('x-locale') || resolvedParams.locale || 'ar'
  const section = await fetchSectionBySlug(resolvedParams.section, locale)
  const categories = section ? await fetchCategoriesBySectionId(section.id, locale) : []

  if (!section) {
    return <FeedLayoutClient sidebar={<SectionSidebar categories={categories} />}>{children}</FeedLayoutClient>
  }

  return (
    <FeedLayoutClient sidebar={<SectionSidebar categories={categories} />}>
      <SectionProvider value={{ section, categories }}>{children}</SectionProvider>
    </FeedLayoutClient>
  )
}

export default SectionLayout

