import { BsClockHistory, BsXCircle } from 'react-icons/bs'
import { t, type SupportedLocale } from '@/lib/translations'
import { isPendingReviewStatus, isRejectedStatus } from '@/lib/postStatus'
import styles from './PostStatusBanner.module.css'

type Props = {
  locale: SupportedLocale
  status?: unknown
}

export default function PostStatusBanner({ locale, status }: Props) {
  if (isPendingReviewStatus(status)) {
    return (
      <div className={`${styles.banner} ${styles.pending}`} role="status">
        <BsClockHistory className={styles.icon} aria-hidden />
        <div className={styles.text}>
          <strong className={styles.title}>{t('post.statusBanner.pendingReview.title', locale)}</strong>
          <p className={styles.message}>{t('post.statusBanner.pendingReview.message', locale)}</p>
        </div>
      </div>
    )
  }

  if (isRejectedStatus(status)) {
    return (
      <div className={`${styles.banner} ${styles.rejected}`} role="status">
        <BsXCircle className={styles.icon} aria-hidden />
        <div className={styles.text}>
          <strong className={styles.title}>{t('post.statusBanner.rejected.title', locale)}</strong>
          <p className={styles.message}>{t('post.statusBanner.rejected.message', locale)}</p>
        </div>
      </div>
    )
  }

  return null
}
