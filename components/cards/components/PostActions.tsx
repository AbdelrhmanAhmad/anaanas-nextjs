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
  return (
    <div className="d-flex flex-wrap gap-2 py-3 px-2 border-top   justify-content-between ">
      {/* Like Button */}
      <button
        type="button"
        className={`btn btn-sm flex-fill w-0  d-flex 
          
          align-items-center justify-content-center 
          gap-2 position-relative overflow-hidden ${
          postLikedByMe 
            ? 'btn-primary text-white shadow-sm' 
            : 'btn-outline-primary text-primary'
        }`}
        onClick={() => void onToggleLikePost()}
        data-bs-container="body"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-html="true"
        data-bs-custom-class="tooltip-text-start"
        data-bs-title={likeTooltipTitle || "Frances Guerrero<br> Lori Stevens<br> Billy Vasquez<br> Judy Nguyen<br> Larry Lawson<br> Amanda Reed<br> Louis Crawford"}
        style={{ 
          minWidth: '100px',
          transition: 'all 0.3s ease',
          borderRadius: '8px',
          fontWeight: '500',
        }}
        onMouseEnter={(e) => {
          if (!postLikedByMe) {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(13, 110, 253, 0.2)'
          }
        }}
        onMouseLeave={(e) => {
          if (!postLikedByMe) {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        <BsHandThumbsUpFill size={18} style={{ transition: 'transform 0.2s ease' }} />
        <span className="small fw-semibold">
          {postLikedByMe ? t('post.liked', locale) : t('post.like', locale)} ({postLikesCount})
        </span>
      </button>

      {/* Comment Button */}
      <button
        type="button"
        className="btn btn-sm btn-outline-success flex-fill w-0  d-flex align-items-center justify-content-center gap-2 text-success"
        onClick={onShowComments}
        style={{ 
          minWidth: '100px',
          transition: 'all 0.3s ease',
          borderRadius: '8px',
          fontWeight: '500',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(25, 135, 84, 0.2)'
          e.currentTarget.style.backgroundColor = 'rgba(25, 135, 84, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <BsChatFill size={18} style={{ transition: 'transform 0.2s ease' }} />
        <span className="small fw-semibold">{t('post.comment', locale)} ({commentsCount})</span>
      </button>

      {/* Share Button */}
      <button
        type="button"
        className="btn btn-sm btn-outline-info flex-fill w-0  d-flex align-items-center justify-content-center gap-2 text-info"
        onClick={onShowShare}
        title={t('post.share', locale)}
        style={{ 
          minWidth: '100px',
          transition: 'all 0.3s ease',
          borderRadius: '8px',
          fontWeight: '500',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(13, 202, 240, 0.2)'
          e.currentTarget.style.backgroundColor = 'rgba(13, 202, 240, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <BsShare size={18} style={{ transition: 'transform 0.2s ease' }} />
        <span className="small fw-semibold">{t('post.share', locale)}</span>
      </button>

      {isOwner ? (
        <a
          href={statisticsHref || '#'}
          className={`btn btn-sm flex-fill w-0 d-flex align-items-center justify-content-center gap-2 text-white ${
            !statisticsHref ? 'disabled' : ''
          }`}
          style={{
            minWidth: '100px',
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            fontWeight: '600',
            backgroundColor: '#0b1f3a',
            borderColor: '#0b1f3a',
            opacity: !statisticsHref ? 0.6 : 1,
            textDecoration: 'none',
          }}
          title={t('post.statistics', locale)}
          onMouseEnter={(e) => {
            if (statisticsHref) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(11, 31, 58, 0.25)'
            }
          }}
          onMouseLeave={(e) => {
            if (statisticsHref) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
        >
          <BsGraphUp size={18} />
          <span className="small">{t('post.statistics', locale)}</span>
        </a>
      ) : (
        <>
          {/* Chat Button */}
          <button
            type="button"
            className={`btn btn-sm flex-fill w-0  d-flex align-items-center justify-content-center gap-2 ${
              !isAuthenticated || !postId
                ? 'btn-outline-secondary text-secondary'
                : 'btn-outline-warning text-warning'
            }`}
            onClick={() => void onOpenChat()}
            disabled={!isAuthenticated || !postId}
            title={isAuthenticated ? t('post.openChat', locale) : t('post.loginToChat', locale)}
            style={{
              minWidth: '100px',
              transition: 'all 0.3s ease',
              borderRadius: '8px',
              fontWeight: '500',
              opacity: !isAuthenticated || !postId ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (isAuthenticated && postId) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 193, 7, 0.2)'
                e.currentTarget.style.backgroundColor = 'rgba(255, 193, 7, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (isAuthenticated && postId) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <BsChatDots size={18} style={{ transition: 'transform 0.2s ease' }} />
            <span className="small fw-semibold">{t('post.chat', locale)}</span>
          </button>

          {/* Contact Button */}
          <button
            type="button"
            className={`btn btn-sm flex-fill w-0  d-flex align-items-center justify-content-center gap-2 ${
              !contactHref ? 'btn-outline-secondary text-secondary' : 'btn-outline-danger text-danger'
            }`}
            onClick={() => void onContact()}
            disabled={!contactHref}
            title={contactLabel}
            style={{
              minWidth: '100px',
              transition: 'all 0.3s ease',
              borderRadius: '8px',
              fontWeight: '500',
              opacity: !contactHref ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (contactHref) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.2)'
                e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (contactHref) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <BsTelephoneFill size={18} style={{ transition: 'transform 0.2s ease' }} />
            <span className="small fw-semibold">
              {userMobile ? t('post.contact', locale) : t('post.contact', locale)}
            </span>
          </button>
        </>
      )}
    </div>
  )
}

