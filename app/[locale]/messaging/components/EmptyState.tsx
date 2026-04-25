'use client'

import { motion } from 'motion/react'
import { BsChatLeftText } from 'react-icons/bs'

import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

import styles from '../messaging.module.css'

export default function EmptyState({ locale }: { locale: SupportedLocale }) {
  return (
    <div className={styles.placeholder}>
      <motion.div
        className={styles.placeholderIcon}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BsChatLeftText />
      </motion.div>
      <h2 className={styles.placeholderTitle}>{t('messaging.selectConversation', locale)}</h2>
      <p className={styles.placeholderHint}>{t('messaging.selectConversationHint', locale)}</p>
    </div>
  )
}
