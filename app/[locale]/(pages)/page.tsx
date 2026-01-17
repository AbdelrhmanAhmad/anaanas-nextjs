import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import Stories from './home/components/Stories'
import Feeds from './home/components/Feeds'
import Followers from './home/components/Followers'
import CreatePostCard from '@/components/cards/CreatePostCard'
import Link from 'next/link'
import LoadContentButton from '@/components/LoadContentButton'
import type { Metadata } from 'next'
import FeedLayoutClient from '@/components/layout/FeedLayoutClient'
import SideBar from '@/components/layout/SideBar'
import { fetchSections } from '@/lib/api/sections'
import { t } from '@/lib/translations'
import { isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

export const metadata: Metadata = { title: 'Default Home' }

const Home = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) => {
  const { locale } = await params
  const sections = await fetchSections(locale)
  const sp = (await searchParams) ?? {}
  const pageRaw = sp.page ? (Array.isArray(sp.page) ? sp.page[0] : sp.page) : undefined
  const page = pageRaw ? Number(pageRaw) : undefined

  return (
    <FeedLayoutClient locale={locale} sidebar={<SideBar sections={sections} locale={locale} />}>
      <Col md={8} lg={7} className=" gap-4">
        {/* <Stories />   */}
        <CreatePostCard />
        <div className="vstack mt-5  gap-4">
          <Feeds
            filters={{
              page: Number.isFinite(page as any) && (page as number) > 0 ? (page as number) : undefined,
              basePath: `/${locale}`,
            }}
          />
        </div>
      </Col>

      <Col lg={5} >
        <Row className="g-4 d-none">
          <Col sm={6} lg={12}>
            <Followers />
          </Col>

          <Col sm={6} lg={12} >
            <Card>
              <CardHeader className="pb-0 border-0">
                <CardTitle className="mb-0">{t('home.todaysNews', isSupportedLocale(locale) ? locale : 'ar')}</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <h6 className="mb-0">
                    <Link href="/blogs/details">Ten questions you should answer truthfully</Link>
                  </h6>
                  <small>2hr</small>
                </div>

                <div className="mb-3">
                  <h6 className="mb-0">
                    <Link href="/blogs/details">Five unbelievable facts about money</Link>
                  </h6>
                  <small>3hr</small>
                </div>

                <div className="mb-3">
                  <h6 className="mb-0">
                    <Link href="/blogs/details">Best Pinterest Boards for learning about business</Link>
                  </h6>
                  <small>4hr</small>
                </div>

                <div className="mb-3">
                  <h6 className="mb-0">
                    <Link href="/blogs/details">Skills that you can learn from business</Link>
                  </h6>
                  <small>6hr</small>
                </div>

                <LoadContentButton name={t('home.viewAllLatestNews', isSupportedLocale(locale) ? locale : 'ar')} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    </FeedLayoutClient>
  )
}

export default Home
