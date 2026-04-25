'use client'

import { useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  BsCheck,
  BsCheck2All,
  BsExclamationCircle,
  BsFileEarmarkText,
  BsHourglassSplit,
} from 'react-icons/bs'

import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

import styles from '../messaging.module.css'
import Avatar from './Avatar'
import TypingIndicator from './TypingIndicator'
import { dayKey, formatDayLabel, formatMessageTime } from './messagingHelpers'

export type UiMessage = {
  id: string
  client_id?: string | null
  body: string
  type?: string
  file_url?: string | null
  created_at: string
  is_mine: boolean
  is_read?: boolean
  sender?: {
    id: number | string
    name?: string | null
    avatar?: string | null
  } | null
  status?: 'sending' | 'sent' | 'failed'
}

type MessageListProps = {
  messages: UiMessage[]
  loading: boolean
  showTyping: boolean
  locale: SupportedLocale
  onRetry?: (clientId: string) => void
}

export default function MessageList({
  messages,
  loading,
  showTyping,
  locale,
  onRetry,
}: MessageListProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const lastIdRef = useRef<string | null>(null)

  /** Auto-scroll to bottom on new message or first load. */
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const last = messages[messages.length - 1]
    const lastKey = last ? `${last.id}|${last.status || ''}` : null

    if (lastKey !== lastIdRef.current) {
      lastIdRef.current = lastKey
      requestAnimationFrame(() => {
        scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' })
      })
    }
  }, [messages, showTyping])

  const groups = useMemo(() => {
    const out: Array<{ key: string; iso: string; items: UiMessage[] }> = []
    let currentKey = ''
    for (const m of messages) {
      const k = dayKey(m.created_at)
      if (k !== currentKey) {
        currentKey = k
        out.push({ key: k, iso: m.created_at, items: [] })
      }
      out[out.length - 1].items.push(m)
    }
    return out
  }, [messages])

  if (loading && messages.length === 0) {
    return (
      <div className={styles.thread} ref={scrollerRef}>
        <div className={styles.threadEmpty}>
          <span className={styles.threadEmptyIcon} aria-hidden>
            ⌛
          </span>
        </div>
      </div>
    )
  }

  if (!loading && messages.length === 0) {
    return (
      <div className={styles.thread} ref={scrollerRef}>
        <div className={styles.threadEmpty}>
          <span className={styles.threadEmptyIcon} aria-hidden>
            💬
          </span>
          <p className={styles.threadEmptyTitle}>{t('messaging.empty', locale)}</p>
          <p className={styles.threadEmptyHint}>{t('messaging.emptyHint', locale)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.thread} ref={scrollerRef}>
      {groups.map((g) => (
        <div key={g.key}>
          <div className={styles.daySep} aria-hidden>
            <span className={styles.daySepLabel}>{formatDayLabel(g.iso, locale)}</span>
          </div>
          <AnimatePresence initial={false}>
            {g.items.map((m, i) => {
              const prev = g.items[i - 1]
              const showAvatar =
                !m.is_mine && (!prev || prev.is_mine || (prev.sender?.id ?? null) !== (m.sender?.id ?? null))
              return (
                <motion.div
                  key={m.id}
                  className={`${styles.row} ${m.is_mine ? styles.rowMine : ''}`}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  layout
                >
                  {!m.is_mine ? (
                    showAvatar ? (
                      <Avatar
                        src={m.sender?.avatar}
                        name={m.sender?.name}
                        size={28}
                        className={styles.rowAvatar}
                      />
                    ) : (
                      <span className={styles.rowAvatarSpacer} aria-hidden />
                    )
                  ) : null}

                  <div className={styles.bubbleStack}>
                    <div className={`${styles.bubble} ${m.is_mine ? styles.bubbleMine : styles.bubbleThem}`}>
                      {m.body}
                      {m.type === 'file' && m.file_url ? (
                        <a
                          href={m.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.bubbleFile}
                        >
                          <BsFileEarmarkText size={16} aria-hidden />
                          {m.file_url.split('/').pop() || 'attachment'}
                        </a>
                      ) : null}
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaTime}>{formatMessageTime(m.created_at, locale)}</span>
                      {m.is_mine ? (
                        m.status === 'sending' ? (
                          <span className={styles.metaPending} aria-label={t('messaging.sending', locale)}>
                            <BsHourglassSplit size={11} />
                          </span>
                        ) : m.status === 'failed' ? (
                          <span
                            className={styles.metaFailed}
                            role="button"
                            tabIndex={0}
                            onClick={() => onRetry && m.client_id && onRetry(m.client_id)}
                            onKeyDown={(e) => {
                              if ((e.key === 'Enter' || e.key === ' ') && onRetry && m.client_id) {
                                e.preventDefault()
                                onRetry(m.client_id)
                              }
                            }}
                            aria-label={t('messaging.retry', locale)}
                          >
                            <BsExclamationCircle size={11} /> {t('messaging.retry', locale)}
                          </span>
                        ) : m.is_read ? (
                          <span className={styles.metaTickRead} aria-label={t('messaging.seen', locale)}>
                            <BsCheck2All size={13} />
                          </span>
                        ) : (
                          <span className={styles.metaTickSent} aria-label={t('messaging.sent', locale)}>
                            <BsCheck size={13} />
                          </span>
                        )
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ))}

      {showTyping ? <TypingIndicator /> : null}
    </div>
  )
}
