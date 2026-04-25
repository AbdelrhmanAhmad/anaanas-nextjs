'use client'

import { useParams } from 'next/navigation'
import { motion } from 'motion/react'

import { isSupportedLocale, type SupportedLocale, DEFAULT_LOCALE } from '@/lib/localization'
import { t } from '@/lib/translations'

import styles from '../../app/[locale]/(pages)/home/components/PostsList.module.css'

type Props = {
  className?: string
  label?: string
}

/**
 * Small floating badge displayed on a post that just arrived through the
 * realtime websocket channel.  Designed to be visually distinct from the
 * static "today" NEW badge so users notice live insertions immediately.
 */
export default function PushedBadge({ className, label }: Props) {
  const params = useParams<{ locale?: string }>()
  const localeParam = (params?.locale as string | undefined)?.toLowerCase()
  const locale: SupportedLocale = isSupportedLocale(localeParam || '')
    ? (localeParam as SupportedLocale)
    : DEFAULT_LOCALE

  const text = label ?? t('realtime.newPost.pushedBadge', locale)

  return (
    <motion.span
      className={[styles.pushedBadge, className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: -8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      <span className={styles.pushedDot} aria-hidden />
      <span>{text}</span>
    </motion.span>
  )
}
