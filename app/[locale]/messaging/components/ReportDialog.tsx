'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

import styles from '../messaging.module.css'

type ReportCategory = 'spam' | 'harassment' | 'scam' | 'inappropriate' | 'other'

type ReportDialogProps = {
  open: boolean
  locale: SupportedLocale
  busy?: boolean
  onSubmit: (payload: { category: ReportCategory; reason: string; description?: string }) => Promise<void> | void
  onClose: () => void
}

const CATEGORIES: ReportCategory[] = ['spam', 'harassment', 'scam', 'inappropriate', 'other']

export default function ReportDialog({ open, locale, busy = false, onSubmit, onClose }: ReportDialogProps) {
  const [category, setCategory] = useState<ReportCategory>('spam')
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!open) return
    setCategory('spam')
    setReason('')
    setDescription('')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (!reason.trim()) return
    void onSubmit({ category, reason: reason.trim(), description: description.trim() || undefined })
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.modalBackdrop}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('messaging.report.title', locale)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <h3 className={styles.modalTitle}>{t('messaging.report.title', locale)}</h3>
            <p className={styles.modalBody}>{t('messaging.report.subtitle', locale)}</p>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="report-category">
                {t('messaging.report.categoryLabel', locale)}
              </label>
              <select
                id="report-category"
                className={styles.fieldSelect}
                value={category}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
                disabled={busy}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`messaging.report.category.${c}` as any, locale)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="report-reason">
                {t('messaging.report.reasonLabel', locale)}
              </label>
              <input
                id="report-reason"
                className={styles.fieldInput}
                type="text"
                placeholder={t('messaging.report.reasonPlaceholder', locale)}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={busy}
                maxLength={200}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="report-desc">
                {t('messaging.report.descriptionLabel', locale)}
              </label>
              <textarea
                id="report-desc"
                className={styles.fieldTextarea}
                placeholder={t('messaging.report.descriptionPlaceholder', locale)}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={busy}
                maxLength={1000}
                rows={3}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost}`}
                onClick={onClose}
                disabled={busy}
              >
                {t('messaging.confirm.cancel', locale)}
              </button>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnDanger}`}
                disabled={busy || !reason.trim()}
              >
                {busy ? t('messaging.report.submitting', locale) : t('messaging.report.submit', locale)}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
