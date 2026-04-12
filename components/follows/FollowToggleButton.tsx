'use client'

import { useEffect, useState } from 'react'

type Props = {
  target: 'section' | 'category'
  targetId: number | string
  locale?: 'ar' | 'en'
  className?: string
}

export default function FollowToggleButton({ target, targetId, locale = 'ar', className }: Props) {
  const [loading, setLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [ready, setReady] = useState(false)

  const basePath = target === 'section' ? `/api/sections/${targetId}/follow` : `/api/categories/${targetId}/follow`
  const text = locale === 'ar'
    ? { follow: 'متابعة', following: 'تتابع الآن' }
    : { follow: 'Follow', following: 'Following' }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(basePath, { method: 'GET', headers: { Accept: 'application/json' } })
        const json = await res.json().catch(() => ({}))
        if (!cancelled && json?.success) {
          setIsFollowing(Boolean(json?.data?.is_following))
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [basePath])

  const toggle = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(basePath, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const json = await res.json().catch(() => ({}))
      if (json?.success) {
        setIsFollowing(Boolean(json?.data?.is_following))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={!ready || loading}
      className={className || 'btn btn-outline-dark btn-sm'}
      aria-pressed={isFollowing}
    >
      {isFollowing ? text.following : text.follow}
    </button>
  )
}
