import type { PostRecord } from '@/lib/api/posts'

export const POST_CREATED_EVENT = 'anaanas:post-created'

export type PostCreatedDetail = { post: PostRecord }

export function dispatchPostCreated(post: PostRecord) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(POST_CREATED_EVENT, { detail: { post } as PostCreatedDetail }))
}
