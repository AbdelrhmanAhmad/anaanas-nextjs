import type { ChildrenType } from '@/types/component'
import { fetchSectionBySlug } from '@/lib/api/sections'
import { fetchCategoriesBySectionId } from '@/lib/api/categories'
import { CategoryProvider } from '@/context/CategoryContext'
import { headers } from 'next/headers'

type CategoryLayoutProps = ChildrenType & {
  params: Promise<{
    locale: string
    section: string
    category: string
  }>
}

const CategoryLayout = async ({ children, params }: CategoryLayoutProps) => {
  const resolvedParams = await params
  const headersList = await headers()
  const locale = headersList.get('x-locale') || resolvedParams.locale || 'ar'
  const section = await fetchSectionBySlug(resolvedParams.section, locale)
  const categories = section ? await fetchCategoriesBySectionId(section.id, locale) : []

  const category = categories.find((item) => item.slug === resolvedParams.category)

  if (!category) {
    return children
  }

  return <CategoryProvider value={category}>{children}</CategoryProvider>
}

export default CategoryLayout


