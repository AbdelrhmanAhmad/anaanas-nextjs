'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'

import { useLayoutContext } from '@/context/useLayoutContext'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

import logo from '@/assets/images/logo/logo500.png'

const LogoBox = () => {
  const { theme } = useLayoutContext()
  const params = useParams<{ locale?: string }>()
  
  // Get locale from params or default
  const locale: SupportedLocale = (() => {
    const localeFromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    if (localeFromParams && isSupportedLocale(localeFromParams)) {
      return localeFromParams
    }
    return DEFAULT_LOCALE
  })()

  return (
    <Link className="navbar-brand" href={`/${locale}`}>
      {theme === 'dark' ? (
        <Image src={logo} alt="logo"  className="navbar-brand-item" />
      ) : (
        <Image src={logo} alt="logo"  className="navbar-brand-item" />
      )}
    </Link>
  )
}

export default LogoBox
