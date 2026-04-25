'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  BsBoxArrowUpRight,
  BsCheckAll,
  BsEraser,
  BsFlag,
  BsLockFill,
  BsPersonDash,
  BsPersonFillSlash,
  BsThreeDotsVertical,
  BsTrash,
  BsUnlock,
} from 'react-icons/bs'

import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

import styles from '../messaging.module.css'

type ChatActionMenuProps = {
  locale: SupportedLocale
  isClosed: boolean
  iBlockedThem: boolean
  unread: number
  hasOtherUser: boolean
  hasPost: boolean
  onMarkRead: () => void
  onViewProfile: () => void
  onViewPost: () => void
  onClear: () => void
  onCloseChat: () => void
  onReopen: () => void
  onBlock: () => void
  onUnblock: () => void
  onReport: () => void
  onDelete: () => void
}

export default function ChatActionMenu({
  locale,
  isClosed,
  iBlockedThem,
  unread,
  hasOtherUser,
  hasPost,
  onMarkRead,
  onViewProfile,
  onViewPost,
  onClear,
  onCloseChat,
  onReopen,
  onBlock,
  onUnblock,
  onReport,
  onDelete,
}: ChatActionMenuProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const wrap = (cb: () => void) => () => {
    setOpen(false)
    cb()
  }

  return (
    <div className={styles.menuWrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.headerIconBtn}
        onClick={() => setOpen((v) => !v)}
        aria-label={t('messaging.menu', locale)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <BsThreeDotsVertical size={18} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className={styles.menu}
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            {unread > 0 ? (
              <button type="button" className={styles.menuItem} role="menuitem" onClick={wrap(onMarkRead)}>
                <span className={styles.menuItemIcon}><BsCheckAll /></span>
                {t('messaging.actions.markRead', locale)}
              </button>
            ) : null}

            {/* {hasOtherUser ? (
              <button type="button" className={styles.menuItem} role="menuitem" onClick={wrap(onViewProfile)}>
                <span className={styles.menuItemIcon}><BsPersonDash /></span>
                {t('messaging.actions.viewProfile', locale)}
              </button>
            ) : null} */}

            {hasPost ? (
              <button type="button" className={styles.menuItem} role="menuitem" onClick={wrap(onViewPost)}>
                <span className={styles.menuItemIcon}><BsBoxArrowUpRight /></span>
                {t('messaging.actions.viewPost', locale)}
              </button>
            ) : null}

            <div className={styles.menuDivider} aria-hidden="true" />

            <button type="button" className={styles.menuItem} role="menuitem" onClick={wrap(onClear)}>
              <span className={styles.menuItemIcon}><BsEraser /></span>
              {t('messaging.actions.clear', locale)}
            </button>

            {isClosed ? (
              <button type="button" className={styles.menuItem} role="menuitem" onClick={wrap(onReopen)}>
                <span className={styles.menuItemIcon}><BsUnlock /></span>
                {t('messaging.actions.reopen', locale)}
              </button>
            ) : (
              <button type="button" className={styles.menuItem} role="menuitem" onClick={wrap(onCloseChat)}>
                <span className={styles.menuItemIcon}><BsLockFill /></span>
                {t('messaging.actions.close', locale)}
              </button>
            )}

            {iBlockedThem ? (
              <button type="button" className={styles.menuItem} role="menuitem" onClick={wrap(onUnblock)}>
                <span className={styles.menuItemIcon}><BsPersonDash /></span>
                {t('messaging.actions.unblock', locale)}
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                role="menuitem"
                onClick={wrap(onBlock)}
              >
                <span className={styles.menuItemIcon}><BsPersonFillSlash /></span>
                {t('messaging.actions.block', locale)}
              </button>
            )}

            <button
              type="button"
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              role="menuitem"
              onClick={wrap(onReport)}
            >
              <span className={styles.menuItemIcon}><BsFlag /></span>
              {t('messaging.actions.report', locale)}
            </button>

            <div className={styles.menuDivider} aria-hidden="true" />

            <button
              type="button"
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              role="menuitem"
              onClick={wrap(onDelete)}
            >
              <span className={styles.menuItemIcon}><BsTrash /></span>
              {t('messaging.actions.delete', locale)}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
