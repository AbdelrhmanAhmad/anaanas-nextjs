'use client'

import { useSession } from 'next-auth/react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Suspense, useEffect, useMemo } from 'react'

import type { ChildrenType } from '@/types/component'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'

const SPINNER_STYLE: React.CSSProperties = {
  minHeight: '60vh',
}

/**
 * Auth gate for `/[locale]/(protected)/...` routes.
 *
 * Behaviour:
 *  - While the NextAuth session is `loading`, render a lightweight skeleton
 *    instead of the children to prevent a flash of protected content.
 *  - When `unauthenticated`, redirect to the localized sign-in page and
 *    keep the original target (with locale) as `redirectTo` so the user
 *    lands back where they started after login.
 *  - When `authenticated`, render the children normally inside `Suspense`
 *    so child segments can stream as needed.
 *
 *  This wrapper is mounted from `app/[locale]/(protected)/layout.tsx` and is
 *  the single source of truth for client-side protection.
 */
const AuthProtectionWrapper = ({ children }: ChildrenType) => {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ locale?: string }>()

  const locale: SupportedLocale = useMemo(() => {
    const raw = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    return isSupportedLocale(raw) ? raw : DEFAULT_LOCALE
  }, [params?.locale])

  const isArabic = locale === 'ar'

  // Don't loop the redirect if we're already on an auth page.
  const isAuthPage = useMemo(() => {
    if (!pathname) return false
    return (
      pathname.includes('/auth/sign-in') ||
      pathname.includes('/auth/sign-up') ||
      pathname.includes('/auth/forgot-pass') ||
      pathname.includes('/auth/reset-password')
    )
  }, [pathname])

  useEffect(() => {
    if (status !== 'unauthenticated') return
    if (isAuthPage) return

    // Preserve the *current* path (already locale-prefixed) as redirectTo so
    // the user returns to the protected page after a successful sign-in.
    const target = pathname || `/${locale}`
    const redirectTo = encodeURIComponent(target)
    router.replace(`/${locale}/auth/sign-in?redirectTo=${redirectTo}`)
  }, [status, isAuthPage, pathname, locale, router])

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  // While we don't yet know who the user is, do NOT render protected
  // children: that prevents a flash of authenticated UI.
  if (status === 'loading') {
    return (
      <div
        className="d-flex align-items-center justify-content-center w-100"
        style={SPINNER_STYLE}
        role="status"
        aria-live="polite"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" aria-hidden="true" />
          <div className="small text-muted mt-3">
            {isArabic ? 'جارٍ التحقق من الجلسة...' : 'Verifying your session...'}
          </div>
        </div>
      </div>
    )
  }

  // Redirect is in-flight (or we're already on an auth page) — render nothing
  // protected to avoid leaking content to anonymous users.
  if (status === 'unauthenticated') {
    if (isAuthPage) {
      return <Suspense>{children}</Suspense>
    }
    return null
  }

  return <Suspense>{children}</Suspense>
}

export default AuthProtectionWrapper
