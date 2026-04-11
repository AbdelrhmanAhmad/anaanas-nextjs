'use client'

import Link from 'next/link'
import type { TrendingPostItem } from '@/lib/api/homeInsights'
import type { SupportedLocale } from '@/lib/localization'
import { t } from '@/lib/translations'
import styles from './TrendingAdsCardClient.module.css'

const RANK_BADGES = ['🔥', '⭐', '🚀', '💫', '✨', '📌']

export default function TrendingAdsCardClient({
  items,
  locale,
}: {
  items: TrendingPostItem[]
  locale: SupportedLocale
}) {
  return (
    <div className={styles.root}>
      <div className={styles.sparkles} aria-hidden>
        <span className={styles.spark} />
        <span className={styles.spark} />
        <span className={styles.spark} />
        <span className={styles.spark} />
        <span className={styles.spark} />
      </div>

      <div className={styles.header}>
        <h5 className={styles.title}>
          <span className={styles.flame} aria-hidden>
            🔥
          </span>
          {t('home.topPerformingAds', locale)}
        </h5>
        <p className={styles.hint}>{t('home.trendingEngagementHint', locale)}</p>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>{t('home.trendingEmpty', locale)}</p>
      ) : (
        <div className={styles.links}>
          {items.map((item, index) => {
            const subtitle =
              [item.category_name, item.section_name].filter(Boolean).join(' · ') ||
              t('home.trendingEngagementHint', locale)
            return (
              <Link
                key={item.post_id}
                href={`/${locale}/post/${item.post_id}`}
                className={styles.link}
              >
                <div className={styles.left}>
                  <div className={styles.rank} aria-hidden>
                    {RANK_BADGES[index % RANK_BADGES.length]}
                  </div>
                  <div className={styles.textCol}>
                    <div className={styles.postTitle}>{item.title}</div>
                    <div className={styles.sub}>
                      {subtitle} · {item.comments_count}+{item.reactions_count}
                    </div>
                  </div>
                </div>
                <div className={styles.score} title={`${item.comments_count} + ${item.reactions_count}`}>
                  {item.score}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
