'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'

/**
 * Auto-login wrapper for development mode only.
 * Automatically logs in using default credentials when:
 * - NEXT_PUBLIC_AUTO_LOGIN_DEFAULT_USER is set to "true"
 * - No active session exists
 */
export default function AutoLoginWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  useEffect(() => {
    const shouldAutoLogin =
      process.env.NEXT_PUBLIC_AUTO_LOGIN_DEFAULT_USER === 'true' &&
      status === 'unauthenticated'

    if (shouldAutoLogin) {
      const defaultEmail = process.env.NEXT_PUBLIC_DEFAULT_EMAIL
      const defaultPassword = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD

      if (defaultEmail && defaultPassword) {
        signIn('credentials', {
          redirect: false,
          email: defaultEmail,
          password: defaultPassword,
        }).catch((error) => {
          console.error('Auto-login failed:', error)
        })
      }
    }
  }, [status])

  return <>{children}</>
}

