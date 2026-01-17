import type { Metadata } from 'next'
import { Col } from 'react-bootstrap'

import Hero from './Hero'
import CreatePostCard from '@/components/cards/CreatePostCard'
import Feeds from '../home/components/Feeds'
import { fetchSectionBySlug } from '@/lib/api/sections'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string }>
}): Promise<Metadata> {
  const { locale, section: sectionSlug } = await params
  const section = await fetchSectionBySlug(sectionSlug, locale)

  const title = section?.name ? `${section.name} | المنشورات` : 'المنشورات'
  return {
    title,
    description: section?.name ? `تصفح أحدث المنشورات في قسم ${section.name}` : 'تصفح أحدث المنشورات',
  }
}

const Section = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) => {
  const { locale, section: sectionSlug } = await params
  const sp = (await searchParams) ?? {}
  const pageRaw = sp.page ? (Array.isArray(sp.page) ? sp.page[0] : sp.page) : undefined
  const page = pageRaw ? Number(pageRaw) : undefined

  return (
    <>
      <Col md={8} lg={6} className="vstack gap-4">
        <Hero />
        <CreatePostCard />
        <Feeds
          filters={{
            sectionSlug,
            basePath: `/${locale}/${sectionSlug}`,
            page: Number.isFinite(page as any) && (page as number) > 0 ? (page as number) : undefined,
          }}
        />
      </Col>
    </>
  )
}

export default Section
