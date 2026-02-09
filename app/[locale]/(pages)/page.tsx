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
import { BsArrowUpRight, BsHammer, BsStars } from 'react-icons/bs'
import linksStyles from './homeLinks.module.css'

export const metadata: Metadata = { title: 'Default Home' }

const Home = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) => {
  const { locale } = await params
  const uiLocale: SupportedLocale = isSupportedLocale(locale) ? locale : 'ar'
  const sections = await fetchSections(locale)
  const sp = (await searchParams) ?? {}
  const pageRaw = sp.page ? (Array.isArray(sp.page) ? sp.page[0] : sp.page) : undefined
  const page = pageRaw ? Number(pageRaw) : undefined

  return (
    <FeedLayoutClient locale={locale} sidebar={<SideBar sections={sections} locale={locale} />}>
      <Col md={8} lg={6} className=" gap-4">
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

      <Col lg={3} md={3}>
        <div className="vstack gap-4">
          {/* links Cards */}
          <Card className={linksStyles.card}>
            <CardHeader className="pb-0 border-0">
              <CardTitle className="mb-0">{uiLocale === 'ar' ? 'روابط سريعة' : 'Quick links'}</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="d-grid gap-3">
                <Link
                  href={`/${uiLocale}/pages/auction`}
                  className={`${linksStyles.link} d-flex align-items-center justify-content-between p-3 text-decoration-none`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className={linksStyles.icon}>
                      <BsHammer />
                    </div>
                    <div>
                      <div className={linksStyles.title}>{uiLocale === 'ar' ? 'تجربة المزادات' : 'Auction experience'}</div>
                      <div className={linksStyles.hint}>
                        {uiLocale === 'ar' ? 'واجهة تفاعلية بتصميم حديث' : 'Interactive, modern UI'}
                      </div>
                    </div>
                  </div>
                  <BsArrowUpRight className={linksStyles.arrow} />
                </Link>

                <Link
                  href={`/${uiLocale}/pages/auction-posts`}
                  className={`${linksStyles.link} ${linksStyles.linkAlt} d-flex align-items-center justify-content-between p-3 text-decoration-none`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className={`${linksStyles.icon} ${linksStyles.iconAlt}`}>
                      <BsStars />
                    </div>
                    <div>
                      <div className={linksStyles.title}>
                        {uiLocale === 'ar' ? 'تجربة إعلانات المزاد' : 'Auction posts experience'}
                      </div>
                      <div className={linksStyles.hint}>
                        {uiLocale === 'ar' ? 'عرض بطاقات وإضافات جميلة' : 'Cards, badges & highlights'}
                      </div>
                    </div>
                  </div>
                  <BsArrowUpRight className={linksStyles.arrow} />
                </Link>
              </div>
            </CardBody>
          </Card>

          {/* Keep these disabled as before */}
          <div className="d-none">
            <Followers />
          </div>

          <div className="d-none">
            <Card>
              <CardHeader className="pb-0 border-0">
                <CardTitle className="mb-0">{t('home.todaysNews', uiLocale)}</CardTitle>
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
                <LoadContentButton name={t('home.viewAllLatestNews', uiLocale)} />
              </CardBody>
            </Card>
          </div>
        </div>
      </Col>
    </FeedLayoutClient>
  )
}

export default Home
