'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BsEmojiSmile, BsLockFill, BsPersonFillSlash, BsSendFill } from 'react-icons/bs'

import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

import styles from '../messaging.module.css'

// Emoji picker is heavy; load on demand.
const EmojiPicker = dynamic(() => import('@emoji-mart/react'), { ssr: false })

type ComposerProps = {
  locale: SupportedLocale
  disabled: boolean
  disabledReason?: 'closed' | 'blocked' | null
  onSend: (text: string) => void | Promise<void>
  onTyping?: () => void
}

export default function Composer({ locale, disabled, disabledReason, onSend, onTyping }: ComposerProps) {
  const [value, setValue] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [emojiData, setEmojiData] = useState<unknown>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const emojiWrapRef = useRef<HTMLDivElement | null>(null)
  const lastTypingRef = useRef<number>(0)

  useEffect(() => {
    if (!showEmoji) return
    let cancelled = false
    void import('@emoji-mart/data').then((mod) => {
      if (!cancelled) setEmojiData(mod.default ?? mod)
    })
    return () => {
      cancelled = true
    }
  }, [showEmoji])

  useEffect(() => {
    if (!showEmoji) return
    const onClick = (e: MouseEvent) => {
      if (emojiWrapRef.current && !emojiWrapRef.current.contains(e.target as Node)) {
        setShowEmoji(false)
      }
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [showEmoji])

  // Auto-grow textarea height
  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`
  }, [value])

  const submit = () => {
    const text = value.trim()
    if (!text || disabled) return
    void onSend(text)
    setValue('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    if (onTyping) {
      const now = Date.now()
      if (now - lastTypingRef.current > 2000) {
        lastTypingRef.current = now
        onTyping()
      }
    }
  }

  if (disabled) {
    return (
      <div className={styles.composerDisabled}>
        {disabledReason === 'closed' ? (
          <>
            <BsLockFill aria-hidden /> {t('messaging.composerDisabledClosed', locale)}
          </>
        ) : (
          <>
            <BsPersonFillSlash aria-hidden /> {t('messaging.composerDisabledBlocked', locale)}
          </>
        )}
      </div>
    )
  }

  return (
    <div className={styles.composer}>
      <div className={styles.composerInputWrap}>
        <div className={styles.menuWrap} ref={emojiWrapRef}>
          <button
            type="button"
            className={styles.composerIconBtn}
            aria-label={t('messaging.emoji', locale)}
            onClick={() => setShowEmoji((v) => !v)}
          >
            <BsEmojiSmile size={18} />
          </button>
          <AnimatePresence>
            {showEmoji ? (
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  insetInlineStart: 0,
                  zIndex: 60,
                }}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
              >
                {emojiData ? (
                  <EmojiPicker
                    data={emojiData}
                    onEmojiSelect={(e: { native: string }) => {
                      setValue((cur) => cur + (e.native || ''))
                      inputRef.current?.focus()
                    }}
                    locale={locale === 'ar' ? 'ar' : 'en'}
                    previewPosition="none"
                  />
                ) : (
                  <div
                    style={{
                      padding: 18,
                      background: '#fff',
                      borderRadius: 12,
                      boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                      fontSize: 13,
                    }}
                  >
                    …
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <textarea
          ref={inputRef}
          className={styles.composerInput}
          placeholder={t('messaging.composerPlaceholder', locale)}
          value={value}
          rows={1}
          onChange={handleChange}
          onKeyDown={handleKey}
          aria-label={t('messaging.composerPlaceholder', locale)}
        />
      </div>

      <button
        type="button"
        className={styles.composerSendBtn}
        onClick={submit}
        disabled={!value.trim()}
        aria-label={t('messaging.send', locale)}
      >
        <BsSendFill size={16} />
      </button>
    </div>
  )
}
