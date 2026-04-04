'use client'

import {
  BsChatDots,
  BsChatFill,
  BsGraphUp,
  BsHandThumbsUpFill,
  BsShare,
  BsTelephoneFill,
} from 'react-icons/bs'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'
import styles from './PostActions.module.css'

type PostActionsProps = {
  locale?: SupportedLocale
  isOwner?: boolean
  // Like button props
  postLikedByMe: boolean
  postLikesCount: number
  onToggleLikePost: () => void | Promise<void>
  likeTooltipTitle?: string

  // Comment button props
  commentsCount: number
  onShowComments: () => void

  // Share button props
  onShowShare: () => void

  // Chat button props
  onOpenChat: () => void | Promise<void>
  isAuthenticated: boolean
  postId?: number | string

  // Contact button props
  onContact: () => void | Promise<void>
  contactHref: string | null
  contactLabel: string
  userMobile?: string | null
}

export default function PostActions({
  postLikedByMe,
  postLikesCount,
  onToggleLikePost,
  likeTooltipTitle,
  commentsCount,
  onShowComments,
  onShowShare,
  onOpenChat,
  isAuthenticated,
  postId,
  onContact,
  contactHref,
  contactLabel,
  userMobile,
  locale = 'ar',
  isOwner = false,
}: PostActionsProps) {
  const statisticsHref = postId ? `/${locale}/post/${String(postId)}/statistics` : null
  const chatReady = Boolean(isAuthenticated && postId)

  return (
    <div className={styles.bar}>
      <button
        type="button"
        className={`${styles.action} ${postLikedByMe ? styles.likeActive : styles.like}`}
        onClick={() => void onToggleLikePost()}
        data-bs-container="body"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-html="true"
        data-bs-custom-class="tooltip-text-start"
        data-bs-title={
          likeTooltipTitle ||
          'Frances Guerrero<br> Lori Stevens<br> Billy Vasquez<br> Judy Nguyen<br> Larry Lawson<br> Amanda Reed<br> Louis Crawford'
        }
      >
        <span className={styles.iconWrap} key={postLikedByMe ? 'liked' : 'not'}>
          <BsHandThumbsUpFill size={18} aria-hidden />
        </span>
        <span className={styles.label}>
          {postLikedByMe ? t('post.liked', locale) : t('post.like', locale)} ({postLikesCount})
        </span>
      </button>

      <button type="button" className={`${styles.action} ${styles.comment}`} onClick={onShowComments}>
        <span className={styles.iconWrap}>
          <BsChatFill size={18} aria-hidden />
        </span>
        <span className={styles.label}>
          {t('post.comment', locale)} ({commentsCount})
        </span>
      </button>

      <button
        type="button"
        className={`${styles.action} ${styles.share}`}
        onClick={onShowShare}
        title={t('post.share', locale)}
      >
        <span className={styles.iconWrap}>
          <BsShare size={18} aria-hidden />
        </span>
        <span className={styles.label}>{t('post.share', locale)}</span>
      </button>

      {isOwner ? (
        <a
          href={statisticsHref || '#'}
          className={`${styles.action} ${styles.stats} ${!statisticsHref ? styles.actionDisabled : ''}`}
          title={t('post.statistics', locale)}
          aria-disabled={!statisticsHref}
          onClick={(e) => {
            if (!statisticsHref) e.preventDefault()
          }}
        >
          <span className={styles.iconWrap}>
            <BsGraphUp size={18} aria-hidden />
          </span>
          <span className={styles.label}>{t('post.statistics', locale)}</span>
        </a>
      ) : (
        <>
          <button
            type="button"
            className={`${styles.action} ${chatReady ? styles.chat : styles.chatMuted}`}
            onClick={() => void onOpenChat()}
            disabled={!chatReady}
            title={isAuthenticated ? t('post.openChat', locale) : t('post.loginToChat', locale)}
          >
            <span className={styles.iconWrap}>
              <BsChatDots size={18} aria-hidden />
            </span>
            <span className={styles.label}>{t('post.chat', locale)}</span>
          </button>

          <button
            type="button"
            className={`${styles.action} ${contactHref ? styles.contact : styles.contactMuted}`}
            onClick={() => void onContact()}
            disabled={!contactHref}
            title={contactLabel}
          >
            <span className={styles.iconWrap}>
              <BsTelephoneFill size={18} aria-hidden />
            </span>
            <span className={styles.label}>{t('post.contact', locale)}</span>
          </button>
        </>
      )}
    </div>
  )
}
