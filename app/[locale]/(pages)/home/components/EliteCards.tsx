'use client'

import Image from 'next/image'
import styles from '../eliteCards.module.css'
import { t } from '@/lib/translations'
import eliteImg from '@/assets/images/image.png'

type Props = { locale: string }

export default function EliteCards({ locale }: Props) {
  return (
    <div className={styles.stack}>
      {/* Elite card */}
      <div className={styles.card}>
        <div className={styles.hero}>
          <Image src={eliteImg} alt="Elite" fill className={styles.heroImg} />
          <div className={styles.heroTitle}>Elite</div>
        </div>

        <div className={styles.body}>
          <div className={styles.title}>
            {t('home.elite.title', locale as any)}
          </div>
          <ul className={styles.list}>
            <li>⚡ {t('home.elite.b1', locale as any)}</li>
            <li>✅ {t('home.elite.b2', locale as any)}</li>
            <li>✨ {t('home.elite.b3', locale as any)}</li>
          </ul>
          <button className={styles.cta} type="button">
            {t('home.elite.cta', locale as any)} 🚀
          </button>
          <div className={styles.coming}>{t('home.elite.coming', locale as any)} »»</div>
        </div>
      </div>

      {/* Pro card */}
      <div className={styles.card}>
        <div className={styles.hero}>
          <Image src={eliteImg} alt="Ananas Pro" fill className={styles.heroImg} />
          <div className={styles.heroTitle}>Ananas Pro</div>
        </div>

        <div className={styles.body}>
          <div className={styles.title}>
            {t('home.pro.title', locale as any)}
          </div>
          <ul className={styles.list}>
            <li>🧠 {t('home.pro.b1', locale as any)}</li>
            <li>🏆 {t('home.pro.b2', locale as any)}</li>
            <li>👥 {t('home.pro.b3', locale as any)}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

