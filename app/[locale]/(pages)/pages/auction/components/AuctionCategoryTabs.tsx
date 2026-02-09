 'use client'

import styles from '../auction.module.css'
import { t } from '@/lib/translations'

export type CategoryTabId = 'real_estate' | 'furniture' | 'electronics' | 'auctions'

export default function AuctionCategoryTabs({
  active,
  onChange,
  locale,
}: {
  active: CategoryTabId
  onChange: (id: CategoryTabId) => void
  locale: any
}) {
  return (
    <div className={styles.tabsRow}>
      <button
        type="button"
        className={`${styles.tab} ${active === 'real_estate' ? styles.tabActive : ''}`}
        onClick={() => onChange('real_estate')}
      >
        {t('auction.tab.realEstate', locale)}
      </button>
      <button
        type="button"
        className={`${styles.tab} ${active === 'furniture' ? styles.tabActive : ''}`}
        onClick={() => onChange('furniture')}
      >
        {t('auction.tab.furniture', locale)}
      </button>
      <button
        type="button"
        className={`${styles.tab} ${active === 'electronics' ? styles.tabActive : ''}`}
        onClick={() => onChange('electronics')}
      >
        {t('auction.tab.electronics', locale)}
      </button>
      <button
        type="button"
        className={`${styles.tab} ${active === 'auctions' ? styles.tabActive : ''}`}
        onClick={() => onChange('auctions')}
      >
        {t('auction.tab.auctions', locale)}
      </button>
    </div>
  )
}

