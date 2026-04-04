import sideStyles from '../../homeSideCards.module.css'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

export default function AnanasVsOthersCard({ locale }: { locale: SupportedLocale }) {
  return (
    <div className={sideStyles.sideCard}>
      <h5 className={sideStyles.cardTitle}>{t('home.ananasVsOthers', locale)}</h5>
      <div className={sideStyles.compareRow}>
        <div>OLX = {t('home.listings', locale)}</div>
        <span className={sideStyles.badgeNo}>✕</span>
      </div>
      <div className={sideStyles.compareRow}>
        <div>OpenSooq = {t('home.marketplace', locale)}</div>
        <span className={sideStyles.badgeNo}>✕</span>
      </div>
      <div className={sideStyles.compareRow}>
        <div>Haraj = {t('home.classifieds', locale)}</div>
        <span className={sideStyles.badgeWarn}>!</span>
      </div>
      <div className={sideStyles.compareRow}>
        <div>ANANAS = {t('home.aiEngine', locale)}</div>
        <span className={sideStyles.badgeOk}>✓</span>
      </div>
    </div>
  )
}
