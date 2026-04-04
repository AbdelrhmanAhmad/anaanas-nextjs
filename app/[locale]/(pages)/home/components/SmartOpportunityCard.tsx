import sideStyles from '../../homeSideCards.module.css'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

export default function SmartOpportunityCard({ locale }: { locale: SupportedLocale }) {
  return (
    <div className={sideStyles.sideCard}>
      <h5 className={sideStyles.cardTitle}>{t('home.smartOpportunity', locale)}</h5>
      <div className={`${sideStyles.pill} ${sideStyles.pillGreen}`}>
        {t('home.highRoi', locale)}
      </div>
      <div className={sideStyles.smallMuted}>{t('home.detectedInAmman', locale)}</div>
      <div className="mt-2">
        <button className={sideStyles.ctaBtn} type="button">
          {t('home.activateOpportunity', locale)} 🚀
        </button>
      </div>
    </div>
  )
}
