 'use client'

import styles from '../auction.module.css'
import { t } from '@/lib/translations'

export default function LottieIconsPanel({ locale }: { locale: any }) {
  return (
    <section>
      <div className={styles.sectionTitleRow}>
        <h3 className={styles.sectionTitle}>{t('auction.panel.title', locale)}</h3>
        <div className={styles.sectionHint}>{t('auction.panel.hint', locale)}</div>
      </div>

      <div className={`${styles.panelGrid} mt-3`}>
        <div className={styles.softBox}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="fw-bold">{t('auction.panel.chooseCategory', locale)}</div>
            <span className={styles.auctionBadge}>New</span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-3">
            <div className={styles.avatar} aria-hidden="true">
              🍍
            </div>
            <div className="flex-grow-1">
              <input className="form-control" placeholder={t('auction.panel.typeCategory', locale)} />
            </div>
            <button type="button" className={`btn ${styles.ctaSecondary}`}>
              {t('auction.panel.go', locale)}
            </button>
          </div>

          <div className="fw-bold mb-2">{t('auction.panel.uploadMedia', locale)}</div>
          <div className="p-3 rounded-3 border" style={{ borderColor: 'rgba(15,23,42,0.10)', background: 'rgba(255,255,255,0.7)' }}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="text-muted">{t('auction.panel.dragDrop', locale)}</div>
              <button type="button" className={`btn btn-sm ${styles.ctaSecondary}`}>
                {t('auction.panel.upload', locale)}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.softBox}>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepLeft}>
                <div className={styles.stepNum}>1</div>
                <div style={{ minWidth: 0 }}>
                  <p className={styles.stepTitle}>{t('auction.step1.title', locale)}</p>
                  <p className={styles.stepDesc}>{t('auction.step1.desc', locale)}</p>
                </div>
              </div>
              <span className={styles.stepTag}>{t('auction.step.start', locale)}</span>
            </div>

            <div className={styles.step}>
              <div className={styles.stepLeft}>
                <div className={styles.stepNum}>2</div>
                <div style={{ minWidth: 0 }}>
                  <p className={styles.stepTitle}>{t('auction.step2.title', locale)}</p>
                  <p className={styles.stepDesc}>{t('auction.step2.desc', locale)}</p>
                </div>
              </div>
              <span className={styles.stepTag}>{t('auction.step.next', locale)}</span>
            </div>

            <div className={styles.step}>
              <div className={styles.stepLeft}>
                <div className={styles.stepNum}>3</div>
                <div style={{ minWidth: 0 }}>
                  <p className={styles.stepTitle}>{t('auction.step3.title', locale)}</p>
                  <p className={styles.stepDesc}>{t('auction.step3.desc', locale)}</p>
                </div>
              </div>
              <span className={styles.stepTag}>$30</span>
            </div>

            <div className={styles.step}>
              <div className={styles.stepLeft}>
                <div className={styles.stepNum}>4</div>
                <div style={{ minWidth: 0 }}>
                  <p className={styles.stepTitle}>{t('auction.step4.title', locale)}</p>
                  <p className={styles.stepDesc}>{t('auction.step4.desc', locale)}</p>
                </div>
              </div>
              <span className={styles.stepTag}>{t('auction.step.done', locale)}</span>
            </div>
          </div>

          <div className="mt-3">
            <button type="button" className={`btn ${styles.publishBtn}`}>
              {t('auction.publish', locale)}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

