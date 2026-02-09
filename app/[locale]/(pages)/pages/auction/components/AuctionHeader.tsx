 'use client'

import styles from '../auction.module.css'
import { BsSearch } from 'react-icons/bs'
import { t } from '@/lib/translations'

export default function AuctionHeader({
  locale,
  query,
  onQueryChange,
  onPostAd,
  onFocusSearch,
}: {
  locale: any
  query: string
  onQueryChange: (v: string) => void
  onPostAd: () => void
  onFocusSearch?: () => void
}) {
  const isArabic = String(locale) === 'ar'

  return (
    <div className={styles.topBar}>
      <div className={styles.logoDot} aria-hidden="true">
        <span style={{ fontWeight: 900, color: '#111827' }}>A</span>
      </div>

      <div className={styles.searchWrap}>
        <div className="position-relative">
          <span className={styles.searchIcon}>
            <BsSearch />
          </span>
          <input
            className={`form-control ${styles.search}`}
            placeholder={t('auction.searchPlaceholder', locale)}
            aria-label={isArabic ? 'بحث' : 'Search'}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => onFocusSearch?.()}
          />
        </div>
      </div>

      <button type="button" className={`btn ${styles.cta}`} onClick={onPostAd}>
        {t('auction.postAd', locale)}
      </button>
    </div>
  )
}

