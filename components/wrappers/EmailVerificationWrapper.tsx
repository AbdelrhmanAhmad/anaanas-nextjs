'use client'

import { useSession } from 'next-auth/react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

import type { ChildrenType } from '@/types/component'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'

const SPINNER_STYLE: React.CSSProperties = {
  minHeight: '40vh',
}

/**
 * Redirects authenticated users with unverified email to the verification page.
 * Old accounts (email_verified_at = null) are forced through this gate.
 */
const EmailVerificationWrapper = ({ children }: ChildrenType) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ locale?: string }>()
  const [checking, setChecking] = useState(false)

  const locale: SupportedLocale = useMemo(() => {
    const raw = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    return isSupportedLocale(raw) ? raw : DEFAULT_LOCALE
  }, [params?.locale])

  const isAllowedPath = useMemo(() => {
    if (!pathname) return false
    return (
      pathname.includes('/auth/verify-email') ||
      pathname.includes('/auth/sign-in') ||
      pathname.includes('/auth/sign-up') ||
      pathname.includes('/auth/forgot-pass') ||
      pathname.includes('/auth/reset-password')
    )
  }, [pathname])

  const sessionVerified = session?.user?.emailVerified === true

  useEffect(() => {
    if (status !== 'authenticated') return
    if (isAllowedPath) return
    if (sessionVerified) return

    let cancelled = false
    setChecking(true)

    ;(async () => {
      try {
        const res = await fetch(`/api/auth/email/status?land=${encodeURIComponent(locale)}`, {
          cache: 'no-store',
        })
        const json = await res.json().catch(() => ({}))
        if (cancelled) return

        if (json?.data?.email_verified) {
          return
        }

        router.replace(`/${locale}/auth/verify-email`)
      } catch {
        if (!cancelled) {
          router.replace(`/${locale}/auth/verify-email`)
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [status, isAllowedPath, sessionVerified, locale, router])

  if (status === 'loading' || (status === 'authenticated' && !sessionVerified && !isAllowedPath && checking)) {
    return (
      <div className="d-flex align-items-center justify-content-center w-100" style={SPINNER_STYLE}>
        <div className="spinner-border text-primary" role="status" aria-label="Loading" />
      </div>
    )
  }

  if (status === 'authenticated' && !sessionVerified && !isAllowedPath) {
    return null
  }

  return <Suspense>{children}</Suspense>
}

export default EmailVerificationWrapper
