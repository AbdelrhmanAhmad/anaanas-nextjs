'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BsArrowLeftShort, BsBoxArrowUpRight, BsImage, BsLockFill, BsPersonFillSlash } from 'react-icons/bs'

import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'
import type { ChatType } from '@/types/data'

import styles from '../messaging.module.css'
import Avatar from './Avatar'
import ChatActionMenu from './ChatActionMenu'
import { resolvePostImage } from './messagingHelpers'

type ChatHeaderProps = {
  chat: ChatType
  locale: SupportedLocale
  isTyping: boolean
  onBack: () => void
  onMarkRead: () => void
  onClear: () => void
  onCloseChat: () => void
  onReopen: () => void
  onBlock: () => void
  onUnblock: () => void
  onReport: () => void
  onDelete: () => void
}

export default function ChatHeader({
  chat,
  locale,
  isTyping,
  onBack,
  onMarkRead,
  onClear,
  onCloseChat,
  onReopen,
  onBlock,
  onUnblock,
  onReport,
  onDelete,
}: ChatHeaderProps) {
  const otherUser = chat.other_user
  const post = chat.post
  const postImage = resolvePostImage(post?.image)
  const postHref = post?.id ? `/${locale}/post/${post.id}` : null

  const isClosed = Boolean(chat.is_closed)
  const iBlockedThem = Boolean(chat.i_blocked_them)
  const subText = isTyping
    ? t('messaging.typing', locale)
    : iBlockedThem
      ? t('messaging.banner.blockedByYou', locale)
      : isClosed
        ? t('messaging.banner.closed', locale)
        : (otherUser?.username ? `@${otherUser.username}` : '')

  const profileHref = otherUser?.username
    ? `/${locale}/profile/${otherUser.username}`
    : otherUser?.id
      ? `/${locale}/profile/${otherUser.id}`
      : `/${locale}/profile`

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={`${styles.headerIconBtn} ${styles.mobileToggle}`}
            onClick={onBack}
            aria-label="Back"
          >
            <BsArrowLeftShort size={24} />
          </button>
          <Avatar src={otherUser?.avatar} name={otherUser?.name} size={44} className={styles.headerAvatar} />
          <div className={styles.headerInfo}>
            <h1 className={styles.headerName}>
              {otherUser?.name || t('messaging.you', locale)}
            </h1>
            <span className={styles.headerSub}>
              <span
                className={`${styles.headerSubDot} ${isTyping ? styles.headerSubDotTyping : ''}`}
                aria-hidden
              />
              {subText}
            </span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <ChatActionMenu
            locale={locale}
            isClosed={isClosed}
            iBlockedThem={iBlockedThem}
            unread={chat.unread_count}
            hasOtherUser={Boolean(otherUser?.id)}
            hasPost={Boolean(post?.id)}
            onMarkRead={onMarkRead}
            onViewProfile={() => {
              if (typeof window !== 'undefined') window.location.href = profileHref
            }}
            onViewPost={() => {
              if (postHref && typeof window !== 'undefined') window.location.href = postHref
            }}
            onClear={onClear}
            onCloseChat={onCloseChat}
            onReopen={onReopen}
            onBlock={onBlock}
            onUnblock={onUnblock}
            onReport={onReport}
            onDelete={onDelete}
          />
        </div>
      </div>

      {post?.id && postHref ? (
        <Link href={postHref} className={styles.postStrip} prefetch={false}>
          {postImage ? (
            <Image
              src={postImage}
              alt={post.title}
              width={44}
              height={44}
              className={styles.postStripImg}
              unoptimized
            />
          ) : (
            <div className={styles.postStripImgPlaceholder} aria-hidden>
              <BsImage size={20} />
            </div>
          )}
          <div className={styles.postStripBody}>
            <span className={styles.postStripLabel}>
              {t('messaging.linkedPost', locale)} · {t('messaging.postId', locale)}
              {post.id}
            </span>
            <span className={styles.postStripTitle}>{post.title}</span>
          </div>
          <span className={styles.postStripCta}>
            <BsBoxArrowUpRight size={12} aria-hidden />
            {t('messaging.viewPost', locale)}
          </span>
        </Link>
      ) : null}

      {isClosed ? (
        <div className={`${styles.banner} ${styles.bannerWarn}`} role="status">
          <BsLockFill aria-hidden />
          {t('messaging.banner.closed', locale)}
        </div>
      ) : null}
      {chat.they_blocked_me && !iBlockedThem ? (
        <div className={`${styles.banner} ${styles.bannerDanger}`} role="status">
          <BsPersonFillSlash aria-hidden />
          {t('messaging.banner.blockedByOther', locale)}
        </div>
      ) : null}
      {iBlockedThem ? (
        <div className={`${styles.banner} ${styles.bannerDanger}`} role="status">
          <BsPersonFillSlash aria-hidden />
          {t('messaging.banner.blockedByYou', locale)}
        </div>
      ) : null}
    </>
  )
}
