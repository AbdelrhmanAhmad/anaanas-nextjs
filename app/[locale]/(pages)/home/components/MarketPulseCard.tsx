import Link from 'next/link'
import { headers } from 'next/headers'

import sideStyles from '../../homeSideCards.module.css'
import { fetchSectionMomentum } from '@/lib/api/homeInsights'
import { resolveCountryIdFromHeaders } from '@/lib/server/resolveCountryIdFromHeaders'
import { t } from '@/lib/translations'
import { isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

const RANK_BADGES = ['🚗', '🏠', '📱', '💼', '📦', '⭐']

export default async function MarketPulseCard({ locale }: { locale: SupportedLocale }) {
  const headersList = await headers()
  const headerLocale = headersList.get('x-locale')
  const uiLocale: SupportedLocale =
    headerLocale && isSupportedLocale(headerLocale) ? headerLocale : locale

  const countryId = await resolveCountryIdFromHeaders()
  const items = await fetchSectionMomentum({ countryId, land: uiLocale })

  return (
    <div className={sideStyles.sideCard}>
      <h5 className={sideStyles.cardTitle}>{t('home.marketPulse', uiLocale)}</h5>
      {items.length === 0 ? (
        <p className={`${sideStyles.smallMuted} mb-0`}>{t('home.marketPulseEmpty', uiLocale)}</p>
      ) : (
        items.map((item, index) => {
          const barPct = Math.min(100, Math.max(0, item.growth_percent))
          const iconSrc =
            item.icon && (item.icon.startsWith('http') || item.icon.startsWith('//'))
              ? item.icon
              : item.icon
                ? `https://eg.anaanas.com/content/uploads/${String(item.icon).replace(/^\//, '')}`
                : null

          return (
            <div key={item.section_id} className={sideStyles.listRow}>
              <div className={`${sideStyles.listLeft} ${sideStyles.momentumRowBlock}`}>
                <div className={sideStyles.listIcon}>
                  {iconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={iconSrc} alt="" className={sideStyles.sectionIconImg} loading="lazy" />
                  ) : (
                    <span aria-hidden>{RANK_BADGES[index % RANK_BADGES.length]}</span>
                  )}
                </div>
                <div className={sideStyles.momentumRowBlock}>
                  <Link
                    href={`/${uiLocale}/${item.slug}`}
                    className={`${sideStyles.listText} text-decoration-none text-reset`}
                  >
                    {item.name}
                  </Link>
                  <div className={sideStyles.momentumMeta}>
                    <span>
                      {item.current_count} · {t('home.marketPulseGrowth', uiLocale)}
                    </span>
                  </div>
                  <div className={sideStyles.momentumBar} role="presentation">
                    <div className={sideStyles.momentumFill} style={{ width: `${barPct}%` }} />
                  </div>
                </div>
              </div>
              <div className={sideStyles.listValue}>+{item.growth_percent}%</div>
            </div>
          )
        })
      )}
    </div>
  )
}
