import type { PostRecord } from '@/lib/api/posts'

export const POST_CREATED_EVENT = 'anaanas:post-created'
export const POST_CREATED_REMOTE_EVENT = 'anaanas:post-created-remote'

export type PostCreatedSource = 'self' | 'realtime'

export type PostCreatedDetail = {
  post: PostRecord
  /** "self" when the current user just created the post, "realtime" when received via websocket */
  source?: PostCreatedSource
}

export function dispatchPostCreated(post: PostRecord, source: PostCreatedSource = 'self') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<PostCreatedDetail>(POST_CREATED_EVENT, { detail: { post, source } }),
  )
  if (source === 'realtime') {
    window.dispatchEvent(
      new CustomEvent<PostCreatedDetail>(POST_CREATED_REMOTE_EVENT, { detail: { post, source } }),
    )
  }
}
