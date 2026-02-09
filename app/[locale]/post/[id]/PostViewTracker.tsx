'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { sendAnalyticsEvent } from '@/lib/analytics/socket'

export default function PostViewTracker({
  postId,
  postUserId,
}: {
  postId: string | number
  postUserId: string | number | null | undefined
}) {
  const sentRef = useRef(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (sentRef.current) return
    const pid = String(postId || '')
    if (!pid) return

    sentRef.current = true

    const meta = {
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      path: typeof window !== 'undefined' ? window.location.pathname : null,
    }

    void sendAnalyticsEvent({ post_id: pid, event: 'post_view', meta })
  }, [postId, session])

  return null
}

