'use client'

import styles from '../aiInfrastructure.module.css'
import { t } from '@/lib/translations'

type Props = { locale: string }

const features = [
  {
    titleKey: 'home.aiInfra.feature1.title',
    descKey: 'home.aiInfra.feature1.desc',
    icon: '🍍',
  },
  {
    titleKey: 'home.aiInfra.feature2.title',
    descKey: 'home.aiInfra.feature2.desc',
    icon: '🍍',
  },
  {
    titleKey: 'home.aiInfra.feature3.title',
    descKey: 'home.aiInfra.feature3.desc',
    icon: '🍍',
  },
  {
    titleKey: 'home.aiInfra.feature4.title',
    descKey: 'home.aiInfra.feature4.desc',
    icon: '🍍',
  },
]

const categories = [
  { icon: '🚗', labelKey: 'home.aiInfra.cars' },
  { icon: '🏠', labelKey: 'home.aiInfra.realEstate' },
  { icon: '💼', labelKey: 'home.aiInfra.jobs' },
  { icon: '📱', labelKey: 'home.aiInfra.electronics' },
  { icon: '📌', labelKey: 'home.aiInfra.trending' },
]

export default function AiInfrastructureCard({ locale }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.title}>{t('home.aiInfra.title', locale as any)}</div>
        <div className={styles.headerPill}>
          {t('home.aiInfra.headerPill', locale as any)}
        </div>
      </div>

      <div className={styles.featureRow}>
        {features.map((item) => (
          <div key={item.titleKey} className={styles.featureCard}>
            <div className={styles.featureIcon}>{item.icon}</div>
            <div>
              <div className={styles.featureTitle}>{t(item.titleKey as any, locale as any)}</div>
              <div className={styles.featureDesc}>{t(item.descKey as any, locale as any)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.categoryPill}>
          {categories.map((c) => (
            <span key={c.labelKey} className={styles.categoryItem}>
              <span className={styles.categoryIcon}>{c.icon}</span>
              {t(c.labelKey as any, locale as any)}
            </span>
          ))}
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricIcon}>★</span>
            <span className={styles.metricValue}>8237</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricIcon}>👥</span>
            <span className={styles.metricValue}>243K</span>
          </div>
        </div>
      </div>
    </div>
  )
}

