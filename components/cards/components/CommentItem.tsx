import LoadContentButton from '@/components/LoadContentButton'
import type { CommentType } from '@/types/data'
import { timeSince } from '@/utils/date'
import Image from 'next/image'
import Link from 'next/link'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import defaultUserAvatar from '@/assets/images/avatar/user-default.svg'
import styles from './CommentItem.module.css'

type CommentItemProps = CommentType & {
  locale?: SupportedLocale
  onToggleLike?: (commentId: string) => void
  onReplyClick?: (commentId: string) => void
  onViewRepliesClick?: (commentId: string) => void
  showReplyBox?: boolean
  replyValue?: string
  onReplyValueChange?: (commentId: string, value: string) => void
  onSubmitReply?: (commentId: string) => void
  loadingReplies?: boolean
  hasMoreReplies?: boolean
  onLoadMoreReplies?: (commentId: string) => void
}

const CommentItem = ({
  id,
  comment,
  likesCount,
  likedByMe,
  repliesCount,
  children,
  socialUser,
  createdAt,
  image,
  onToggleLike,
  onReplyClick,
  onViewRepliesClick,
  showReplyBox,
  replyValue,
  onReplyValueChange,
  onSubmitReply,
  loadingReplies,
  hasMoreReplies,
  onLoadMoreReplies,
  locale = 'ar',
}: CommentItemProps) => {
  // Raw backend paths (e.g. "upload/profiles/...webp") must be normalized before
  // hitting next/image — otherwise `new URL(src)` throws "Invalid URL".
  const avatarSrc = (socialUser?.avatar && resolveMediaUrl(socialUser.avatar)) || defaultUserAvatar.src
  const attachmentSrc = image ? resolveMediaUrl(image) : ''
  return (
    <li className={styles.item}>
      {socialUser && (
        <>
          <div className={styles.row}>
            <div>
              <span role="button">
                <Image
                  className={styles.avatar}
                  src={avatarSrc}
                  alt={(socialUser?.name || 'user') + '-avatar'}
                  width={30}
                  height={30}
                  unoptimized
                />
              </span>
            </div>
            <div className="w-100">
              <div className={styles.bubble}>
                <h6 className={styles.name}>
                  <Link href="#" className="text-decoration-none text-reset">
                    {socialUser.name}
                  </Link>
                </h6>
                <p className={styles.comment}>{comment}</p>
                {attachmentSrc && (
                  <Image
                    width={172}
                    height={277}
                    src={attachmentSrc}
                    alt=""
                    className="rounded mt-2 border"
                    unoptimized
                  />
                )}
              </div>

              <div className={styles.actions}>
                <small>{timeSince(createdAt)}</small>
                <span>·</span>
                <span>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => onToggleLike?.(String(id))}
                  >
                    {likedByMe ? t('post.unlike', locale) : t('post.likeComment', locale)} ({likesCount})
                  </button>
                </span>
                <span>·</span>
                <span>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => onReplyClick?.(String(id))}
                  >
                    {t('post.reply', locale)}
                  </button>
                </span>
                {((repliesCount ?? 0) > 0 || (children?.length ?? 0) > 0) && (
                  <>
                    <span>·</span>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => onViewRepliesClick?.(String(id))}
                      disabled={loadingReplies}
                    >
                      {t('post.viewReplies', locale)} ({repliesCount ?? children?.length ?? 0})
                    </button>
                  </>
                )}
              </div>

              {showReplyBox && (
                <div className={styles.replyWrap}>
                  <div className="d-flex gap-2">
                    <input
                      className="form-control form-control-sm"
                      placeholder={t('post.writeReply', locale)}
                      value={replyValue ?? ''}
                      onChange={(e) => onReplyValueChange?.(String(id), e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      disabled={!replyValue?.trim()}
                      onClick={() => onSubmitReply?.(String(id))}
                    >
                      {t('post.send', locale)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <ul className={styles.nested}>
            {children?.map((childComment) => (
              <CommentItem
                key={childComment.id}
                {...(childComment as any)}
                onToggleLike={onToggleLike}
                onReplyClick={onReplyClick}
                onViewRepliesClick={onViewRepliesClick}
                onLoadMoreReplies={onLoadMoreReplies}
                locale={locale}
              />
            ))}
          </ul>
          {(hasMoreReplies || children?.length === 2) && (
            <LoadContentButton
              name={loadingReplies ? t('post.loadingReplies', locale) : t('post.loadMoreReplies', locale)}
              className="mb-3 ms-5"
              onClick={() => onLoadMoreReplies?.(String(id))}
            />
          )}
        </>
      )}
    </li>
  )
}

export default CommentItem
