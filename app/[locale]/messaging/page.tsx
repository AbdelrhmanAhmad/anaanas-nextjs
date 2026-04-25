'use client'

import { Suspense, useMemo } from 'react'
import { useParams } from 'next/navigation'

import AuthProtectionWrapper from '@/components/wrappers/AuthProtectionWrapper'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'

import MessagingClient from './components/MessagingClient'

const Messaging = () => {
  const params = useParams<{ locale?: string }>()
  const locale: SupportedLocale = useMemo(() => {
    const raw = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    return isSupportedLocale(raw) ? raw : DEFAULT_LOCALE
  }, [params?.locale])

  return (
    <AuthProtectionWrapper>
      <Suspense fallback={null}>
        <MessagingClient locale={locale} />
      </Suspense>
    </AuthProtectionWrapper>
  )
}

export default Messaging
