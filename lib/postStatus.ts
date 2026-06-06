export const POST_STATUS_ACTIVE = 'active'
export const POST_STATUS_PENDING_REVIEW = 'pending_review'
export const POST_STATUS_LEGACY_PENDING = 'pending'
export const POST_STATUS_REJECTED = 'rejected'

export function isPendingReviewStatus(status: unknown): boolean {
  return status === POST_STATUS_PENDING_REVIEW || status === POST_STATUS_LEGACY_PENDING
}

export function isRejectedStatus(status: unknown): boolean {
  return status === POST_STATUS_REJECTED
}

export function isOwnerOnlyStatus(status: unknown): boolean {
  return isPendingReviewStatus(status) || isRejectedStatus(status)
}

export function isPubliclyPublishedStatus(status: unknown): boolean {
  return status === POST_STATUS_ACTIVE || status == null || status === ''
}
