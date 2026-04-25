'use client'

import Link from 'next/link'
import type { SectionMomentumItem } from '@/lib/api/homeInsights'
import type { SupportedLocale } from '@/lib/localization'
import { t } from '@/lib/translations'
import styles from './MarketPulseCardClient.module.css'

const RANK_BADGES = ['🚗', '🏠', '📱', '💼', '📦', '⭐']

 
export default function MarketPulseCardClient({
  items,
  locale,
}: {
  items: SectionMomentumItem[]
  locale: SupportedLocale
}) {
  return (
    <div className={styles.root}>
      <div className={styles.glowOrbs} aria-hidden>
        <span className={`${styles.orb} ${styles.orb1}`} />
        <span className={`${styles.orb} ${styles.orb2}`} />
        <span className={`${styles.orb} ${styles.orb3}`} />
      </div>

      <div className={styles.header}>
        <h5 className={styles.title}>
          <span className={styles.liveDot} aria-hidden />
          {t('home.marketPulse', locale)}
        </h5>
        <div className={styles.pulseStrip} aria-hidden>
          <span className={styles.pulseBar} />
          <span className={styles.pulseBar} />
          <span className={styles.pulseBar} />
          <span className={styles.pulseBar} />
        </div>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>{t('home.marketPulseEmpty', locale)}</p>
      ) : (
        <div className={styles.rows}>
          {items.map((item, index) => {
            const barPct = Math.min(100, Math.max(0, item.growth_percent))
            const src =item.icon_full_path || null ;
            return (
              <div key={item.section_id} className={styles.row}>
                <div className={styles.left}>
                  <div className={styles.iconWrap}>
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt="" className={styles.iconImg} loading="lazy" />
                    ) : (
                      <span aria-hidden>{RANK_BADGES[index % RANK_BADGES.length]}</span>
                    )}
                  </div>
                  <div className={styles.textBlock}>
                    <Link href={`/${locale}/${item.slug}`} className={styles.name}>
                      {item.name}
                    </Link>
                    <div className={styles.meta}>
                      {item.current_count} · {t('home.marketPulseGrowth', locale)}
                    </div>
                    <div className={styles.barTrack} role="presentation">
                      <div className={styles.barFill} style={{ width: `${barPct}%` }} />
                    </div>
                  </div>
                </div>
                <div className={styles.growth}>+{item.growth_percent}%</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
