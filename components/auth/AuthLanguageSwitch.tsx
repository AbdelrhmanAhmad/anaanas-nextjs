'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { SUPPORTED_LOCALES, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

const localeLabels: Record<SupportedLocale, string> = {
  ar: 'العربية',
  en: 'English',
}

const AuthLanguageSwitch = () => {
  const params = useParams<{ locale?: string }>()
  const pathname = usePathname()
  const currentLocale = (Array.isArray(params?.locale) ? params.locale[0] : params?.locale) as string | undefined

  const buildPath = (locale: SupportedLocale) => {
    if (!pathname) return `/${locale}/auth/sign-in`
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 0 && isSupportedLocale(segments[0])) {
      segments[0] = locale
      return `/${segments.join('/')}`
    }
    return `/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
  }

  return (
    <div className="auth-lang-switch">
      {SUPPORTED_LOCALES.map((locale) => {
        const isActive = locale === currentLocale
        const path = buildPath(locale)
        return (
          <span key={locale}>
            {SUPPORTED_LOCALES.indexOf(locale) > 0 && (
              <span className="auth-lang-sep">|</span>
            )}
            {isActive ? (
              <span className="auth-lang-current">{localeLabels[locale]}</span>
            ) : (
              <Link href={path} className="auth-lang-link">
                {localeLabels[locale]}
              </Link>
            )}
          </span>
        )
      })}
    </div>
  )
}

export default AuthLanguageSwitch
