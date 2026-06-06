'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  fetchPostCreationLimit,
  submitAccountVerificationRequest,
  type PostCreationLimitData,
  type PostCreationLimitReason,
  type VerificationRequestStatus,
} from '@/lib/api/postCreationLimit'

const DEFAULT_LIMIT: PostCreationLimitData = {
  can_create: true,
  reason: null,
  retry_after_seconds: 0,
  posts_in_last_hour: 0,
  hourly_limit: 5,
  interval_minutes: 5,
}

export type UsePostCreationLimitResult = {
  loading: boolean
  hasChecked: boolean
  canCreate: boolean
  reason: PostCreationLimitReason
  retryAfterSeconds: number
  remainingSeconds: number
  postsInLastHour: number
  hourlyLimit: number
  intervalMinutes: number
  message: string | null
  isAccountVerified: boolean
  verificationRequestStatus: import('@/lib/api/postCreationLimit').VerificationRequestStatus
  submittingVerification: boolean
  refresh: () => Promise<void>
  requestVerification: () => Promise<string | null>
}

export function usePostCreationLimit(
  enabled: boolean,
  land?: string,
  accessToken?: string | null,
): UsePostCreationLimitResult {
  const [loading, setLoading] = useState(enabled)
  const [hasChecked, setHasChecked] = useState(false)
  const [status, setStatus] = useState<PostCreationLimitData>(DEFAULT_LIMIT)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [submittingVerification, setSubmittingVerification] = useState(false)

  const refresh = useCallback(async () => {
    if (!enabled || !accessToken) {
      setLoading(false)
      setHasChecked(false)
      setStatus(DEFAULT_LIMIT)
      setRemainingSeconds(0)
      return
    }

    setLoading(true)
    try {
      const data = await fetchPostCreationLimit({ land, accessToken })
      setStatus(data)
      setRemainingSeconds(data.can_create ? 0 : Math.max(0, data.retry_after_seconds))
      setHasChecked(true)
    } catch (error) {
      console.error('Post creation limit check failed:', error)
      setStatus(DEFAULT_LIMIT)
      setRemainingSeconds(0)
      setHasChecked(true)
    } finally {
      setLoading(false)
    }
  }, [enabled, land, accessToken])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!enabled || !hasChecked || status.can_create || status.retry_after_seconds <= 0) {
      return
    }

    setRemainingSeconds(Math.max(0, status.retry_after_seconds))

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          void refresh()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [enabled, hasChecked, status.can_create, status.retry_after_seconds, refresh])

  const requestVerification = useCallback(async (): Promise<string | null> => {
    if (!enabled || !accessToken || status.is_account_verified) {
      return null
    }

    setSubmittingVerification(true)
    try {
      const result = await submitAccountVerificationRequest({ land, accessToken })
      setStatus((prev) => ({
        ...prev,
        is_account_verified: Boolean(result.data.is_account_verified),
        verification_request_status: result.data.verification_request_status ?? 'pending',
      }))
      return result.message
    } finally {
      setSubmittingVerification(false)
    }
  }, [enabled, accessToken, land, status.is_account_verified])

  return {
    loading,
    hasChecked,
    canCreate: status.can_create,
    reason: status.reason,
    retryAfterSeconds: status.retry_after_seconds,
    remainingSeconds,
    postsInLastHour: status.posts_in_last_hour,
    hourlyLimit: status.hourly_limit,
    intervalMinutes: status.interval_minutes,
    message: status.message ?? null,
    isAccountVerified: Boolean(status.is_account_verified),
    verificationRequestStatus: (status.verification_request_status ?? 'none') as VerificationRequestStatus,
    submittingVerification,
    refresh,
    requestVerification,
  }
}
