import sideStyles from '../../homeSideCards.module.css'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

export default function FutureRoadmapCard({ locale }: { locale: SupportedLocale }) {
  return (
    <div className={sideStyles.sideCard}>
      <h5 className={sideStyles.cardTitle}>
        {t('home.futureRoadmap', locale)}{' '}
        <span className={sideStyles.sectionSub}>({t('home.comingSoon', locale)})</span>
      </h5>
      {[
        { icon: '🧠', text: t('home.roadmap.pro', locale) },
        { icon: '🏆', text: t('home.roadmap.gold', locale) },
        { icon: '🎁', text: t('home.roadmap.family', locale) },
      ].map((item) => (
        <div key={item.text} className={sideStyles.roadmapRow}>
          <span>{item.icon}</span>
          <span className={sideStyles.listText}>{item.text}</span>
        </div>
      ))}
    </div>
  )
}
