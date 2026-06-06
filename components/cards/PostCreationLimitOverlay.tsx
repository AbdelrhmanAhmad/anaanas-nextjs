'use client'

import clsx from 'clsx'
import { BsClockHistory, BsPatchCheck } from 'react-icons/bs'

import {
  formatCountdownClock,
  type PostCreationLimitReason,
  type VerificationRequestStatus,
} from '@/lib/api/postCreationLimit'
import { t } from '@/lib/translations'

import styles from './CreatePostCard.module.css'

type PostCreationLimitOverlayProps = {
  visible: boolean
  loading?: boolean
  locale: string
  reason: PostCreationLimitReason
  remainingSeconds: number
  postsInLastHour: number
  hourlyLimit: number
  intervalMinutes: number
  message?: string | null
  verificationRequestStatus?: VerificationRequestStatus
  submittingVerification?: boolean
  onRequestVerification?: () => void
}

export default function PostCreationLimitOverlay({
  visible,
  loading = false,
  locale,
  reason,
  remainingSeconds,
  postsInLastHour,
  hourlyLimit,
  intervalMinutes,
  message,
  verificationRequestStatus = 'none',
  submittingVerification = false,
  onRequestVerification,
}: PostCreationLimitOverlayProps) {
  if (!visible) return null

  if (loading) {
    return (
      <div className={styles.composerLimitOverlay} role="status" aria-live="polite">
        <div className={styles.composerLimitPanel}>
          <span className={styles.composerLimitIcon} aria-hidden>
            <BsClockHistory size={28} />
          </span>
          <p className={styles.composerLimitHint}>{t('createPost.rateLimit.checking', locale as any)}</p>
        </div>
      </div>
    )
  }

  const hintTemplate =
    reason === 'hourly'
      ? t('createPost.rateLimit.hourlyHint', locale as any)
      : t('createPost.rateLimit.intervalHint', locale as any)

  const hint = hintTemplate
    .replace('{count}', String(postsInLastHour))
    .replace('{max}', String(hourlyLimit))
    .replace('{minutes}', String(intervalMinutes))

  const verificationPending = verificationRequestStatus === 'pending'
  const verificationRejected = verificationRequestStatus === 'rejected'

  let verificationButtonLabel = t('createPost.rateLimit.requestVerification', locale as any)
  if (submittingVerification) {
    verificationButtonLabel = t('createPost.rateLimit.requestVerificationSubmitting', locale as any)
  } else if (verificationPending) {
    verificationButtonLabel = t('createPost.rateLimit.requestVerificationPending', locale as any)
  } else if (verificationRejected) {
    verificationButtonLabel = t('createPost.rateLimit.requestVerificationRetry', locale as any)
  }

  return (
    <div className={styles.composerLimitOverlay} role="alert" aria-live="polite">
      <div className={styles.composerLimitPanel}>
        <span className={styles.composerLimitIcon} aria-hidden>
          <BsClockHistory size={28} />
        </span>
        <h3 className={styles.composerLimitTitle}>
          {t('createPost.rateLimit.title', locale as any)}
        </h3>
        <p className={styles.composerLimitHint}>{message || hint}</p>
        <div className={styles.composerLimitCountdownWrap}>
          <span className={styles.composerLimitCountdownLabel}>
            {t('createPost.rateLimit.countdownLabel', locale as any)}
          </span>
          <span className={clsx(styles.composerLimitCountdown, remainingSeconds <= 30 && styles.composerLimitCountdownSoon)}>
            {formatCountdownClock(remainingSeconds)}
          </span>
        </div>

        <div className={styles.composerLimitVerifyBlock}>
          <p className={styles.composerLimitVerifyHint}>
            {t('createPost.rateLimit.verificationHint', locale as any)}
          </p>
          <button
            type="button"
            className={clsx(
              styles.composerLimitVerifyBtn,
              verificationPending && styles.composerLimitVerifyBtnPending,
            )}
            onClick={onRequestVerification}
            disabled={submittingVerification || verificationPending || !onRequestVerification}
          >
            <BsPatchCheck size={16} aria-hidden />
            <span>{verificationButtonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
