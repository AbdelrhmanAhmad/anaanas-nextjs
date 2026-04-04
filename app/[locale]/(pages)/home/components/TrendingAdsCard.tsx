import Link from 'next/link'
import { headers } from 'next/headers'

import sideStyles from '../../homeSideCards.module.css'
import { fetchTrendingPosts } from '@/lib/api/homeInsights'
import { resolveCountryIdFromHeaders } from '@/lib/server/resolveCountryIdFromHeaders'
import { t } from '@/lib/translations'
import { isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

const RANK_BADGES = ['🔥', '⭐', '🚀', '💫', '✨', '📌']

export default async function TrendingAdsCard({ locale }: { locale: SupportedLocale }) {
  const headersList = await headers()
  const headerLocale = headersList.get('x-locale')
  const uiLocale: SupportedLocale =
    headerLocale && isSupportedLocale(headerLocale) ? headerLocale : locale

  const countryId = await resolveCountryIdFromHeaders()
  const items = await fetchTrendingPosts({ countryId, land: uiLocale, limit: 6 })

  return (
    <div className={sideStyles.sideCard}>
      <h5 className={sideStyles.cardTitle}>{t('home.topPerformingAds', uiLocale)}</h5>
      <p className={`${sideStyles.smallMuted} mb-2`}>{t('home.trendingEngagementHint', uiLocale)}</p>
      {items.length === 0 ? (
        <p className={`${sideStyles.smallMuted} mb-0`}>{t('home.trendingEmpty', uiLocale)}</p>
      ) : (
        items.map((item, index) => {
          const subtitle =
            [item.category_name, item.section_name].filter(Boolean).join(' · ') ||
            t('home.trendingEngagementHint', uiLocale)

          return (
            <Link
              key={item.post_id}
              href={`/${uiLocale}/post/${item.post_id}`}
              className={`${sideStyles.listRow} ${sideStyles.trendingLink}`}
            >
              <div className={sideStyles.listLeft}>
                <div className={sideStyles.listIcon}>
                  <span aria-hidden>{RANK_BADGES[index % RANK_BADGES.length]}</span>
                </div>
                <div>
                  <div className={sideStyles.listText}>{item.title}</div>
                  <div className={sideStyles.smallMuted}>
                    {subtitle} · {item.comments_count}+{item.reactions_count}
                  </div>
                </div>
              </div>
              <div className={sideStyles.listValue} title={`${item.comments_count} + ${item.reactions_count}`}>
                {item.score}
              </div>
            </Link>
          )
        })
      )}
    </div>
  )
}
