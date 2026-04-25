'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

import styles from '../messaging.module.css'

type ConfirmDialogProps = {
  open: boolean
  title: string
  body?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'primary' | 'danger'
  busy?: boolean
  locale: SupportedLocale
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  variant = 'primary',
  busy = false,
  locale,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.modalBackdrop}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <h3 className={styles.modalTitle}>{title}</h3>
            {body ? <p className={styles.modalBody}>{body}</p> : null}
            <div className={styles.modalActions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost}`}
                onClick={onClose}
                disabled={busy}
              >
                {cancelLabel ?? t('messaging.confirm.cancel', locale)}
              </button>
              <button
                type="button"
                className={`${styles.btn} ${variant === 'danger' ? styles.btnDanger : styles.btnPrimary}`}
                onClick={onConfirm}
                disabled={busy}
              >
                {busy
                  ? t('messaging.report.submitting', locale)
                  : confirmLabel ?? t('messaging.confirm.confirm', locale)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
