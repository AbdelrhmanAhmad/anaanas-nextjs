/**
 * Country filtering: middleware sets `x-country` from the host subdomain (e.g. jo.anaanas.com).
 * `Feeds` reads that header and resolves `country_id` for `/api/posts` — same pattern as the home page.
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
  const basePath = `/${locale}/${sectionSlug}`
  const description = section?.name
    ? `تصفح أحدث المنشورات في قسم ${section.name}`
    : 'تصفح أحدث المنشورات'
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
  const section = await fetchSectionBySlug(sectionSlug, locale)
  if (!section) {
    notFound()
  }
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
