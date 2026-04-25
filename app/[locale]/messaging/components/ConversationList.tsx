'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { BsChatLeftDots, BsLockFill, BsPersonFillSlash, BsSearch } from 'react-icons/bs'

import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'
import type { ChatType } from '@/types/data'

import styles from '../messaging.module.css'
import Avatar from './Avatar'
import { formatConvoTime } from './messagingHelpers'

type ConversationListProps = {
  chats: ChatType[]
  loading: boolean
  activeChatId: string | null
  currentUserId: number | string | null | undefined
  locale: SupportedLocale
  onSelect: (chatId: string) => void
}

const SkeletonRow = () => (
  <div className={styles.skeletonRow}>
    <div className={styles.skeletonCircle} />
    <div className={styles.skeletonLines}>
      <div className={`${styles.skeletonLine} ${styles.skeletonLineLong}`} />
      <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
    </div>
  </div>
)

export default function ConversationList({
  chats,
  loading,
  activeChatId,
  currentUserId,
  locale,
  onSelect,
}: ConversationListProps) {
  const [query, setQuery] = useState('')

  const totalUnread = useMemo(
    () => chats.reduce((acc, c) => acc + (c.unread_count || 0), 0),
    [chats],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return chats
    return chats.filter((c) => {
      const name = c.other_user?.name?.toLowerCase() || ''
      const username = c.other_user?.username?.toLowerCase() || ''
      const post = c.post?.title?.toLowerCase() || ''
      const last = c.last_message?.body?.toLowerCase() || ''
      return name.includes(q) || username.includes(q) || post.includes(q) || last.includes(q)
    })
  }, [chats, query])

  return (
    <>
      <div className={styles.asideHeader}>
        <div className={styles.asideTitleRow}>
          <h2 className={styles.asideTitle}>
            <BsChatLeftDots aria-hidden />
            {t('messaging.title', locale)}
            {totalUnread > 0 ? (
              <span className={styles.asideTitleBadge}>{totalUnread}</span>
            ) : null}
          </h2>
        </div>
        <div className={styles.searchBox}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={t('messaging.searchPlaceholder', locale)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('messaging.searchPlaceholder', locale)}
          />
          <span className={styles.searchIcon} aria-hidden>
            <BsSearch />
          </span>
        </div>
      </div>

      <div className={styles.asideScroller}>
        {loading ? (
          <div className={styles.convoListSkeleton}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.convoEmpty}>
            <div className={styles.convoEmptyIcon}>
              <BsChatLeftDots />
            </div>
            <div>
              {query ? t('messaging.noConversations', locale) : t('messaging.empty', locale)}
            </div>
            {!query ? (
              <div style={{ marginTop: 6, fontSize: 12 }}>{t('messaging.emptyHint', locale)}</div>
            ) : null}
          </div>
        ) : (
          filtered.map((chat) => {
            const id = String(chat.id)
            const isActive = activeChatId === id
            const last = chat.last_message
            const isMine = last?.sender_id != null && String(last.sender_id) === String(currentUserId)
            const snippetPrefix = last?.body && isMine ? `${t('messaging.you', locale)}: ` : ''
            const snippet = last?.body
              ? `${snippetPrefix}${last.body}`
              : ''

            return (
              <motion.button
                key={id}
                type="button"
                className={`${styles.convo} ${isActive ? styles.convoActive : ''}`}
                onClick={() => onSelect(id)}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <span className={styles.convoAvatarWrap}>
                  <Avatar
                    src={chat.other_user?.avatar}
                    name={chat.other_user?.name}
                    size={46}
                  />
                  {chat.is_blocked ? (
                    <span
                      className={`${styles.convoAvatarBadge} ${styles.convoAvatarBadgeBlocked}`}
                      aria-hidden
                    >
                      <BsPersonFillSlash />
                    </span>
                  ) : chat.is_closed ? (
                    <span
                      className={`${styles.convoAvatarBadge} ${styles.convoAvatarBadgeClosed}`}
                      aria-hidden
                    >
                      <BsLockFill />
                    </span>
                  ) : null}
                </span>

                <span className={styles.convoBody}>
                  <span className={styles.convoTopRow}>
                    <span className={styles.convoName}>
                      {chat.other_user?.name || t('messaging.you', locale)}
                    </span>
                    <span className={styles.convoTime}>
                      {formatConvoTime(chat.last_message_at || chat.last_message?.sent_at, locale)}
                    </span>
                  </span>
                  <span className={styles.convoBottomRow}>
                    <span
                      className={`${styles.convoSnippet} ${chat.unread_count > 0 ? styles.convoSnippetBold : ''}`}
                    >
                      {snippet || (
                        <span style={{ color: 'var(--msg-text-subtle)' }}>
                          {chat.post?.title || ''}
                        </span>
                      )}
                    </span>
                    {chat.unread_count > 0 ? (
                      <span className={styles.convoUnread}>{chat.unread_count}</span>
                    ) : null}
                  </span>
                  {chat.post?.title ? (
                    <span className={styles.convoPostMeta}>· {chat.post.title}</span>
                  ) : null}
                </span>
              </motion.button>
            )
          })
        )}
      </div>
    </>
  )
}
