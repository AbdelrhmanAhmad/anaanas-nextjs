import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import Stories from './home/components/Stories'
import Feeds from './home/components/Feeds'
import Followers from './home/components/Followers'
import CreatePostCard from '@/components/cards/CreatePostCard'
import AiInfrastructureCard from './home/components/AiInfrastructureCard'
import EliteCards from './home/components/EliteCards'
import HomeBanner from './home/components/HomeBanner'
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
import sideStyles from './homeSideCards.module.css'
import MarketPulseCard from './home/components/MarketPulseCard'
import TrendingAdsCard from './home/components/TrendingAdsCard'
import SmartOpportunityCard from './home/components/SmartOpportunityCard'
import AnanasVsOthersCard from './home/components/AnanasVsOthersCard'
import FutureRoadmapCard from './home/components/FutureRoadmapCard'
import MobileSectionsSwiper from './home/components/MobileSectionsSwiper'
import MobileAIDashboard from './home/components/MobileAIDashboard'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uiLocale: SupportedLocale = isSupportedLocale(locale) ? locale : 'ar'
  const title = uiLocale === 'ar' ? 'الرئيسية | ANANAS' : 'Home | ANANAS'
  const description =
    uiLocale === 'ar'
      ? 'اكتشف أحدث المنشورات، الفرص الذكية، وتحليلات السوق في منصة ANANAS.'
      : 'Discover latest posts, smart opportunities, and market insights on ANANAS.'

  return {
    title,
    description,
    alternates: { canonical: `/${uiLocale}` },
    openGraph: { title, description, type: 'website', url: `/${uiLocale}` },
    twitter: { card: 'summary_large_image', title, description },
  }
}

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
      <HomeBanner locale={uiLocale} />
        
        <div className="d-lg-none">
          <MobileAIDashboard locale={uiLocale} />
        </div>

        <div className="d-lg-none">
          <MobileSectionsSwiper sections={sections} locale={uiLocale} />
        </div>
        {/* <Stories />   */}
        <CreatePostCard />
        {/* <AiInfrastructureCard locale={uiLocale} /> */}
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
          <div className={sideStyles.sideStack}>
             
            <MarketPulseCard locale={uiLocale} />
            <TrendingAdsCard locale={uiLocale} />

            {/* <SmartOpportunityCard locale={uiLocale} /> */}
            {/* <AnanasVsOthersCard locale={uiLocale} /> */}
            <FutureRoadmapCard locale={uiLocale} />
          </div>

          {/* <EliteCards locale={uiLocale} /> */}
          {/* links Cards */}
          {/* <div className={sideStyles.sideCard}>
            <h5 className={sideStyles.cardTitle}>{t('home.quickLinks', uiLocale)}</h5>
            <div className={sideStyles.sideStack}>
              <Link
                href={`/${uiLocale}/pages/auction`}
                className={`${sideStyles.listRow} text-decoration-none`}
              >
                <div className={sideStyles.listLeft}>
                  <div className={sideStyles.listIcon}>
                    <BsHammer />
                  </div>
                  <div>
                    <div className={sideStyles.listText}>{t('home.quick.auction.title', uiLocale)}</div>
                    <div className={sideStyles.smallMuted}>{t('home.quick.auction.hint', uiLocale)}</div>
                  </div>
                </div>
                <BsArrowUpRight />
              </Link>

              <Link
                href={`/${uiLocale}/pages/auction-posts`}
                className={`${sideStyles.listRow} text-decoration-none`}
              >
                <div className={sideStyles.listLeft}>
                  <div className={sideStyles.listIcon}>
                    <BsStars />
                  </div>
                  <div>
                    <div className={sideStyles.listText}>{t('home.quick.auctionPosts.title', uiLocale)}</div>
                    <div className={sideStyles.smallMuted}>{t('home.quick.auctionPosts.hint', uiLocale)}</div>
                  </div>
                </div>
                <BsArrowUpRight />
              </Link>
            </div>
          </div> */}

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
