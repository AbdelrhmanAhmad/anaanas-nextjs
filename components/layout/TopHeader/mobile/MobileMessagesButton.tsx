'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { BsChatDots } from 'react-icons/bs'

import { useChatContext } from '@/context/useChatContext'
import type { SupportedLocale } from '@/lib/localization'

import styles from './MobileMessagesButton.module.css'

type Props = {
  locale: SupportedLocale
}

/**
 * Mobile-styled messaging trigger.
 *
 * Mirrors the desktop TopHeader's messaging affordance (a link to
 * `/messaging`) but adds a numeric unread badge — sourced from `ChatProvider`,
 * which already refreshes the chat list whenever the session changes. We just
 * sum each chat's `unread_count` to derive the total.
 */
const MobileMessagesButton = ({ locale }: Props) => {
  const isArabic = locale === 'ar'
  const { chats } = useChatContext()

  const unread = useMemo(
    () => chats.reduce((sum, c) => sum + (Number(c.unread_count) || 0), 0),
    [chats],
  )

  const label = isArabic ? 'المراسلة' : 'Messaging'

  return (
    <Link
      href={`/${locale}/messaging`}
      className={styles.btn}
      aria-label={label}
      title={label}
    >
      <span className={styles.iconWrap}>
        <BsChatDots aria-hidden />
      </span>

      {unread > 0 && (
        <span className={styles.badge} aria-label={`${unread}`}>
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  )
}

export default MobileMessagesButton
