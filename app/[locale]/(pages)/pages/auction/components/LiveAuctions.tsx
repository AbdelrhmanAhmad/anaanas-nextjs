'use client'

import styles from '../auction.module.css'
import { t } from '@/lib/translations'
import Link from 'next/link'

type AuctionRow = {
  id: number
  end_at?: string
  current_price?: number
  min_increment?: number
  bids_count?: number
  status?: string
  watchers_count?: number
  watched_by_me?: boolean
  post?: {
    id?: number
    title?: string
  }
}

function timeLeft(endAt?: string, locale: string = 'ar') {
  if (!endAt) return locale === 'ar' ? '—' : '--'
  const end = new Date(endAt).getTime()
  const now = Date.now()
  const diff = Math.max(0, end - now)
  const h = Math.floor(diff / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${h}h ${m}m`
}

export default function LiveAuctions({
  locale,
  items,
  onBid,
  onWatch,
  loading,
}: {
  locale: any
  items: AuctionRow[]
  onBid: (item: AuctionRow) => void
  onWatch: (item: AuctionRow) => void
  loading?: boolean
}) {
  return (
    <section>
      <div className={styles.sectionTitleRow}>
        <h3 className={styles.sectionTitle}>{t('auction.live.title', locale)}</h3>
        <div className={styles.sectionHint}>{t('auction.live.hint', locale)}</div>
      </div>

      <div className={`${styles.hScroll} ${styles.fadeIn}`} aria-label="Live auctions">
        {loading ? (
          <div className="text-muted p-3">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : items.length === 0 ? (
          <div className="text-muted p-3">{locale === 'ar' ? 'لا توجد مزادات حالياً' : 'No auctions found'}</div>
        ) : (
          items.map((a) => (
          <div key={a.id} className={styles.auctionCard}>
            <div className={styles.auctionTop}>
              <div style={{ minWidth: 0 }}>
                <div className="d-flex align-items-center gap-2">
                  <div className={styles.avatar} aria-hidden="true">
                    ⏱️
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-bold text-truncate">{a.post?.title || (locale === 'ar' ? 'مزاد' : 'Auction')}</div>
                    <div className={styles.subtle}>
                      {t('auction.live.endsIn', locale)} {timeLeft(a.end_at, String(locale))}
                    </div>
                  </div>
                </div>
              </div>
              <span className={styles.auctionBadge}>
                {a.bids_count ?? 0} {t('auction.live.bids', locale)}
              </span>
            </div>

            <div className="mt-3">
              <div className={styles.price}>${Number(a.current_price ?? 0).toLocaleString()}</div>
              <div className={styles.subtle}>{t('auction.live.currentPrice', locale)}</div>
            </div>

            <div className={`${styles.auctionFooter} d-flex gap-2 flex-wrap`}>
              <div className={styles.subtle}>{t('auction.live.secure', locale)}</div>
              <button type="button" className={`btn btn-sm ${styles.bidBtn}`} onClick={() => onBid(a)}>
                {t('auction.live.bidNow', locale)}
              </button>
              <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => onWatch(a)}>
                {locale === 'ar' ? 'متابعة' : 'Watch'} ({a.watchers_count ?? 0})
              </button>
              <Link href={`/${locale}/pages/auction/${a.post?.id || a.id}`} className="btn btn-sm btn-outline-secondary">
                {locale === 'ar' ? 'التفاصيل' : 'Details'}
              </Link>
            </div>
          </div>
        )))}
      </div>
    </section>
  )
}

