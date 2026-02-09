 'use client'

import styles from '../auction.module.css'
import { t } from '@/lib/translations'

export type QuickChipId = 'updates' | 'lives' | 'hot_deals' | 'auctions'

export default function AuctionQuickChips({
  active,
  onChange,
  locale,
}: {
  active: QuickChipId
  onChange: (id: QuickChipId) => void
  locale: any
}) {
  return (
    <div className={styles.chipTabs}>
      <button
        type="button"
        className={`${styles.chip} ${active === 'updates' ? styles.chipDark : ''}`}
        onClick={() => onChange('updates')}
      >
        {t('auction.chip.updates', locale)}
      </button>
      <button
        type="button"
        className={`${styles.chip} ${active === 'lives' ? styles.chipDark : ''}`}
        onClick={() => onChange('lives')}
      >
        {t('auction.chip.lives', locale)}
      </button>
      <button
        type="button"
        className={`${styles.chip} ${styles.chipGreen} ${active === 'hot_deals' ? styles.chipDark : ''}`}
        onClick={() => onChange('hot_deals')}
      >
        {t('auction.chip.hotDeals', locale)}
      </button>
      <button
        type="button"
        className={`${styles.chip} ${styles.chipMint} ${active === 'auctions' ? styles.chipDark : ''}`}
        onClick={() => onChange('auctions')}
      >
        {t('auction.chip.auctions', locale)}
      </button>
    </div>
  )
}

