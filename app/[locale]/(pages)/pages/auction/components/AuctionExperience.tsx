'use client'

import { useMemo, useRef, useState } from 'react'
import styles from '../auction.module.css'
import AuctionHeader from './AuctionHeader'
import AuctionQuickChips, { type QuickChipId } from './AuctionQuickChips'
import MascotsRow from './MascotsRow'
import AuctionCategoryTabs, { type CategoryTabId } from './AuctionCategoryTabs'
import TrendingAds, { type TrendingItem } from './TrendingAds'
import LiveAuctions, { type AuctionItem } from './LiveAuctions'
import LottieIconsPanel from './LottieIconsPanel'
import { t } from '@/lib/translations'

export default function AuctionExperience({ locale }: { locale: any }) {
  const [activeChip, setActiveChip] = useState<QuickChipId>('updates')
  const [activeTab, setActiveTab] = useState<CategoryTabId>('real_estate')
  const [query, setQuery] = useState('')

  const trendingRef = useRef<HTMLDivElement>(null)
  const publishRef = useRef<HTMLDivElement>(null)

  const trendingItems: TrendingItem[] = useMemo(() => {
    const base: TrendingItem[] = [
      { title: t('auction.trending.cars', locale), meta: t('auction.trending.metaNew', locale), price: '$34' },
      { title: t('auction.trending.villa', locale), meta: t('auction.trending.metaHot', locale), price: '$3' },
      { title: t('auction.trending.brand', locale), meta: t('auction.trending.metaNow', locale), price: '$10' },
      { title: t('auction.trending.boost', locale), meta: t('auction.trending.metaPromo', locale), price: t('auction.boost', locale) },
    ]

    // Simulate category effect (visual + filtering)
    const tabBoost =
      activeTab === 'electronics' ? '⚡' : activeTab === 'furniture' ? '🪑' : activeTab === 'auctions' ? '🔨' : '🏠'

    const withTab = base.map((x) => ({ ...x, meta: `${tabBoost} ${x.meta}` }))
    if (!query.trim()) return withTab
    const q = query.trim().toLowerCase()
    return withTab.filter((x) => String(x.title).toLowerCase().includes(q))
  }, [activeTab, locale, query])

  const auctions: AuctionItem[] = useMemo(() => {
    const base: AuctionItem[] = [
      { title: t('auction.live.showcase', locale), endsIn: '18:10', price: '$120', bids: 9 },
      { title: t('auction.live.tires', locale), endsIn: '19:25', price: '$225', bids: 12 },
      { title: t('auction.live.shoes', locale), endsIn: '06:01', price: '$60', bids: 5 },
      { title: t('auction.live.tools', locale), endsIn: '11:12', price: '$95', bids: 7 },
    ]
    // Chip affects ordering (adds “life”)
    if (activeChip === 'hot_deals') return [...base].sort((a, b) => b.bids - a.bids)
    if (activeChip === 'lives') return [...base].sort((a, b) => a.bids - b.bids)
    return base
  }, [activeChip, locale])

  const onPostAd = () => {
    publishRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={styles.cardSurface}>
      <AuctionHeader
        locale={locale}
        query={query}
        onQueryChange={setQuery}
        onPostAd={onPostAd}
        onFocusSearch={() => trendingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      />

      <AuctionQuickChips active={activeChip} onChange={setActiveChip} locale={locale} />
      <MascotsRow />
      <AuctionCategoryTabs active={activeTab} onChange={setActiveTab} locale={locale} />

      <div className="mt-4" ref={trendingRef}>
        <TrendingAds locale={locale} items={trendingItems} />
      </div>

      <div className="mt-4">
        <LiveAuctions locale={locale} items={auctions} />
      </div>

      <div className="mt-4" ref={publishRef}>
        <LottieIconsPanel locale={locale} />
      </div>
    </div>
  )
}

