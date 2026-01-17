import LoadContentButton from '@/components/LoadContentButton'
import type { CommentType } from '@/types/data'
import { timeSince } from '@/utils/date'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from 'react-bootstrap'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'

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
  return (
    <li className="comment-item">
      {socialUser && (
        <>
          <div className="d-flex position-relative">
            <div className={clsx('avatar avatar-xs', { 'avatar-story': socialUser.isStory })}>
              <span role="button">
                <Image className="avatar-img rounded-circle" src={socialUser.avatar} alt={socialUser.name + '-avatar'} />
              </span>
            </div>
            <div className="ms-2">
              <div className="bg-light rounded-start-top-0 p-3 rounded">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-1">
                    {' '}
                    <Link href="#"> {socialUser.name} </Link>
                  </h6>
                  <small className="ms-2">{timeSince(createdAt)}</small>
                </div>
                <p className="small mb-0">{comment}</p>
                {image && (
                  <Card className="p-2 border border-2 rounded mt-2 shadow-none">
                    <Image width={172} height={277} src={image} alt="" />
                  </Card>
                )}
              </div>

              <ul className="nav nav-divider py-2 small">
                <li className="nav-item">
                  <button
                    type="button"
                    className="nav-link btn btn-link p-0"
                    onClick={() => onToggleLike?.(String(id))}
                  >
                    {' '}
                    {likedByMe ? t('post.unlike', locale) : t('post.likeComment', locale)} ({likesCount})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="nav-link btn btn-link p-0"
                    onClick={() => onReplyClick?.(String(id))}
                  >
                    {' '}
                    {t('post.reply', locale)}
                  </button>
                </li>
                {((repliesCount ?? 0) > 0 || (children?.length ?? 0) > 0) && (
                  <li className="nav-item">
                    <button
                      type="button"
                      className="nav-link btn btn-link p-0"
                      onClick={() => onViewRepliesClick?.(String(id))}
                      disabled={loadingReplies}
                    >
                      {' '}
                      {t('post.viewReplies', locale)} ({repliesCount ?? children?.length ?? 0})
                    </button>
                  </li>
                )}
              </ul>

              {showReplyBox && (
                <div className="mb-2">
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

          <ul className="comment-item-nested list-unstyled">
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
