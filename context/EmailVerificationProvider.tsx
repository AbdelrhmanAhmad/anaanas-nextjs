'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useSession } from 'next-auth/react'
import { useParams, usePathname } from 'next/navigation'

import EmailVerificationRequiredDialog from '@/components/dialogs/EmailVerificationRequiredDialog'
import {
  installEmailVerificationFetchInterceptor,
  isOnEmailVerificationPage,
} from '@/lib/auth/emailVerification'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'

type EmailVerificationGateContextValue = {
  isEmailVerified: boolean
  ensureEmailVerified: () => Promise<boolean>
  promptEmailVerification: (message?: string) => void
}

const EmailVerificationGateContext = createContext<EmailVerificationGateContextValue | null>(null)

export function EmailVerificationProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const params = useParams<{ locale?: string }>()
  const pathname = usePathname()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState<string | undefined>(undefined)
  const promptOnceRef = useRef(false)

  const locale: SupportedLocale = useMemo(() => {
    const raw = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    return isSupportedLocale(raw) ? raw : DEFAULT_LOCALE
  }, [params?.locale])

  const sessionVerified = session?.user?.emailVerified === true

  const promptEmailVerification = useCallback((message?: string) => {
    if (promptOnceRef.current) return
    promptOnceRef.current = true
    setDialogMessage(message)
    setDialogOpen(true)
  }, [])

  const handleDialogHide = useCallback(() => {
    setDialogOpen(false)
    promptOnceRef.current = false
  }, [])

  const ensureEmailVerified = useCallback(async () => {
    if (status !== 'authenticated') return false
    if (sessionVerified) return true
    if (isOnEmailVerificationPage(pathname)) return false

    try {
      const res = await fetch(`/api/auth/email/status?land=${encodeURIComponent(locale)}`, { cache: 'no-store' })
      const json = await res.json().catch(() => ({}))
      if (json?.data?.email_verified) return true
    } catch {
      /* fall through */
    }

    promptEmailVerification()
    return false
  }, [status, sessionVerified, locale, pathname, promptEmailVerification])

  useEffect(() => {
    if (isOnEmailVerificationPage(pathname)) {
      setDialogOpen(false)
      promptOnceRef.current = false
    }
  }, [pathname])

  useEffect(() => {
    installEmailVerificationFetchInterceptor((payload) => {
      promptEmailVerification(typeof payload?.message === 'string' ? payload.message : undefined)
    })
  }, [promptEmailVerification])

  return (
    <EmailVerificationGateContext.Provider
      value={{
        isEmailVerified: sessionVerified,
        ensureEmailVerified,
        promptEmailVerification,
      }}
    >
      {children}
      <EmailVerificationRequiredDialog
        show={dialogOpen && !isOnEmailVerificationPage(pathname)}
        onHide={handleDialogHide}
        locale={locale}
        message={dialogMessage}
      />
    </EmailVerificationGateContext.Provider>
  )
}

export function useEmailVerificationGate() {
  const ctx = useContext(EmailVerificationGateContext)
  if (!ctx) {
    throw new Error('useEmailVerificationGate must be used within EmailVerificationProvider')
  }
  return ctx
}

export function useEmailVerificationGateOptional() {
  return useContext(EmailVerificationGateContext)
}
