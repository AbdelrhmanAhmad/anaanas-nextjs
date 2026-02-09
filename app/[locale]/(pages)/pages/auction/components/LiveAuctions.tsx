'use client'

import styles from '../auction.module.css'
import { t } from '@/lib/translations'

export type AuctionItem = { title: string; endsIn: string; price: string; bids: number }

export default function LiveAuctions({ locale, items }: { locale: any; items: AuctionItem[] }) {
  return (
    <section>
      <div className={styles.sectionTitleRow}>
        <h3 className={styles.sectionTitle}>{t('auction.live.title', locale)}</h3>
        <div className={styles.sectionHint}>{t('auction.live.hint', locale)}</div>
      </div>

      <div className={`${styles.hScroll} ${styles.fadeIn}`} aria-label="Live auctions">
        {items.map((a, idx) => (
          <div key={idx} className={styles.auctionCard}>
            <div className={styles.auctionTop}>
              <div style={{ minWidth: 0 }}>
                <div className="d-flex align-items-center gap-2">
                  <div className={styles.avatar} aria-hidden="true">
                    ⏱️
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-bold text-truncate">{a.title}</div>
                    <div className={styles.subtle}>
                      {t('auction.live.endsIn', locale)} {a.endsIn}
                    </div>
                  </div>
                </div>
              </div>
              <span className={styles.auctionBadge}>
                {a.bids} {t('auction.live.bids', locale)}
              </span>
            </div>

            <div className="mt-3">
              <div className={styles.price}>{a.price}</div>
              <div className={styles.subtle}>{t('auction.live.currentPrice', locale)}</div>
            </div>

            <div className={styles.auctionFooter}>
              <div className={styles.subtle}>{t('auction.live.secure', locale)}</div>
              <button type="button" className={`btn btn-sm ${styles.bidBtn}`}>
                {t('auction.live.bidNow', locale)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

