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
        <HomeBanner locale={uiLocale} />
        {/* <Stories />   */}
        <CreatePostCard />
        <AiInfrastructureCard locale={uiLocale} />
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
            <div className={sideStyles.sideCard}>
              <h5 className={sideStyles.cardTitle}>{t('home.marketPulse', uiLocale)}</h5>
              {[
                { icon: '🚗', label: t('home.cars', uiLocale), value: '+18%' },
                { icon: '🏠', label: t('home.realEstate', uiLocale), value: '+9%' },
                { icon: '📱', label: t('home.electronics', uiLocale), value: '+14%' },
                { icon: '💼', label: t('home.jobs', uiLocale), value: '+6%' },
              ].map((item) => (
                <div key={item.label} className={sideStyles.listRow}>
                  <div className={sideStyles.listLeft}>
                    <div className={sideStyles.listIcon}>{item.icon}</div>
                    <div className={sideStyles.listText}>{item.label}</div>
                  </div>
                  <div className={sideStyles.listValue}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className={sideStyles.sideCard}>
              <h5 className={sideStyles.cardTitle}>{t('home.topPerformingAds', uiLocale)}</h5>
              {[
                {
                  icon: '🍍',
                  title: t('home.ad.zamzam', uiLocale),
                  subtitle: t('home.ad.movingHouse', uiLocale),
                  badge: '🔥',
                },
                {
                  icon: '🏠',
                  title: t('home.ad.othman', uiLocale),
                  subtitle: t('home.ad.electronics', uiLocale),
                  badge: '⭐',
                },
                {
                  icon: '🛰️',
                  title: t('home.ad.elite', uiLocale),
                  subtitle: t('home.ad.tech', uiLocale),
                  badge: '🚀',
                },
              ].map((item) => (
                <div key={item.title} className={sideStyles.listRow}>
                  <div className={sideStyles.listLeft}>
                    <div className={sideStyles.listIcon}>{item.icon}</div>
                    <div>
                      <div className={sideStyles.listText}>{item.title}</div>
                      <div className={sideStyles.smallMuted}>{item.subtitle}</div>
                    </div>
                  </div>
                  <div>{item.badge}</div>
                </div>
              ))}
            </div>

            <div className={sideStyles.sideCard}>
              <h5 className={sideStyles.cardTitle}>{t('home.smartOpportunity', uiLocale)}</h5>
              <div className={`${sideStyles.pill} ${sideStyles.pillGreen}`}>
                {t('home.highRoi', uiLocale)}
              </div>
              <div className={sideStyles.smallMuted}>{t('home.detectedInAmman', uiLocale)}</div>
              <div className="mt-2">
                <button className={sideStyles.ctaBtn} type="button">
                  {t('home.activateOpportunity', uiLocale)} 🚀
                </button>
              </div>
            </div>

            <div className={sideStyles.sideCard}>
              <h5 className={sideStyles.cardTitle}>{t('home.ananasVsOthers', uiLocale)}</h5>
              <div className={sideStyles.compareRow}>
                <div>OLX = {t('home.listings', uiLocale)}</div>
                <span className={sideStyles.badgeNo}>✕</span>
              </div>
              <div className={sideStyles.compareRow}>
                <div>OpenSooq = {t('home.marketplace', uiLocale)}</div>
                <span className={sideStyles.badgeNo}>✕</span>
              </div>
              <div className={sideStyles.compareRow}>
                <div>Haraj = {t('home.classifieds', uiLocale)}</div>
                <span className={sideStyles.badgeWarn}>!</span>
              </div>
              <div className={sideStyles.compareRow}>
                <div>ANANAS = {t('home.aiEngine', uiLocale)}</div>
                <span className={sideStyles.badgeOk}>✓</span>
              </div>
            </div>

            <div className={sideStyles.sideCard}>
              <h5 className={sideStyles.cardTitle}>
                {t('home.futureRoadmap', uiLocale)}{' '}
                <span className={sideStyles.sectionSub}>({t('home.comingSoon', uiLocale)})</span>
              </h5>
              {[
                { icon: '🧠', text: t('home.roadmap.pro', uiLocale) },
                { icon: '🏆', text: t('home.roadmap.gold', uiLocale) },
                { icon: '🎁', text: t('home.roadmap.family', uiLocale) },
              ].map((item) => (
                <div key={item.text} className={sideStyles.roadmapRow}>
                  <span>{item.icon}</span>
                  <span className={sideStyles.listText}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <EliteCards locale={uiLocale} />
          {/* links Cards */}
          <div className={sideStyles.sideCard}>
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
          </div>

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
