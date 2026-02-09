 'use client'

import styles from '../auction.module.css'
import { t } from '@/lib/translations'

export type TrendingItem = { title: string; meta: string; price: string }

export default function TrendingAds({ locale, items }: { locale: any; items: TrendingItem[] }) {
  return (
    <section>
      <div className={styles.sectionTitleRow}>
        <h3 className={styles.sectionTitle}>{t('auction.trending.title', locale)}</h3>
        <div className={styles.sectionHint}>{t('auction.trending.hint', locale)}</div>
      </div>

      <div className={`${styles.hScroll} ${styles.fadeIn}`} aria-label="Trending ads">
        {items.map((it, idx) => (
          <div key={idx} className={styles.miniCard}>
            <div className={styles.miniHead}>
              <div className={styles.avatar} aria-hidden="true">
                {it.title.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <p className={styles.miniTitle}>{it.title}</p>
                <div className={styles.miniMeta}>{it.meta}</div>
              </div>
              <button type="button" className={`btn btn-sm btn-outline-primary ${styles.miniCta}`}>
                {it.price}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

