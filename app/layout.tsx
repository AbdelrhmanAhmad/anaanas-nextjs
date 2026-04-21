import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import type { ReactNode } from 'react'

import { DEFAULT_PAGE_TITLE } from '@/context/constants'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

import logo from '@/assets/images/logo/logo500.png'

import '@/assets/scss/style.scss'

const AppProvidersWrapper = dynamic(() => import('@/components/wrappers/AppProvidersWrapper'))

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | منصه اناناس للاعلانات الرقمية والتسويق والتجارة الاولى في الوطن العربي',
    default: DEFAULT_PAGE_TITLE,
  },
  description: 'منصه اناناس للاعلانات الرقمية والتسويق والتجارة الاولى في الوطن العربي',
}


const resolveLocaleFromHeaders = async (): Promise<SupportedLocale> => {
  const headersList = await headers()
  const localeFromHeader = headersList.get('x-locale')
  if (localeFromHeader && isSupportedLocale(localeFromHeader)) {
    return localeFromHeader
  }
  return DEFAULT_LOCALE
}

const localeStylesheetMap: Record<SupportedLocale, string> = {
  ar: '/styles/lang-ar.css',
  en: '/styles/lang-en.css',
}

const RootLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const locale = await resolveLocaleFromHeaders()
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const localeStylesheet = localeStylesheetMap[locale]
  const localeClassName = direction === 'rtl' ? 'is-rtl' : 'is-ltr'

  return (
    <html lang={locale} dir={direction} data-locale={locale} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="stylesheet" href={localeStylesheet} />
      </head>
      <body className={`${inter.className} ${localeClassName}`} data-locale={locale} data-dir={direction} suppressHydrationWarning>
        <div id="splash-screen" aria-hidden="true">
          <div className="splash-gradient" />
          <div className="splash-orb splash-orb--a" />
          <div className="splash-orb splash-orb--b" />
          <div className="splash-orb splash-orb--c" />

          <span className="splash-spark splash-spark--1" />
          <span className="splash-spark splash-spark--2" />
          <span className="splash-spark splash-spark--3" />
          <span className="splash-spark splash-spark--4" />
          <span className="splash-spark splash-spark--5" />
          <span className="splash-spark splash-spark--6" />

          <div className="splash-stage">
            <svg className="splash-ring splash-ring--outer" viewBox="0 0 240 240" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="splashRingGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFD166" />
                  <stop offset="50%" stopColor="#F4A261" />
                  <stop offset="100%" stopColor="#E76F51" />
                </linearGradient>
                <linearGradient id="splashArcGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F4A261" stopOpacity="0" />
                  <stop offset="50%" stopColor="#E76F51" stopOpacity="1" />
                  <stop offset="100%" stopColor="#BA7BFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="120" cy="120" r="110" stroke="url(#splashRingGrad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 10" />
              <circle cx="120" cy="120" r="110" stroke="url(#splashArcGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="110 580" />
            </svg>
            <svg className="splash-ring splash-ring--inner" viewBox="0 0 240 240" fill="none" aria-hidden="true">
              <circle cx="120" cy="120" r="92" stroke="rgba(244,162,97,.55)" strokeWidth="1.25" strokeLinecap="round" strokeDasharray="3 14" />
            </svg>
            <div className="splash-pulse splash-pulse--1" />
            <div className="splash-pulse splash-pulse--2" />
            <div className="splash-pulse splash-pulse--3" />

            <div className="splash-logoWrap">
              <div className="splash-logoHalo" />
              <img
                alt="ANANAS"
                src={typeof logo === 'string' ? logo : (logo as { src: string }).src}
                className="splash-logo"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="splash-brand">
            <span className="splash-brand__bar">
              <span className="splash-brand__barFill" />
            </span>
            <span className="splash-brand__meta">
              <span className="splash-brand__dot" />
              <span className="splash-brand__dot" />
              <span className="splash-brand__dot" />
            </span>
          </div>
        </div>
        <NextTopLoader color="#F4A261" showSpinner={false} height={3} shadow="0 0 10px #F4A261,0 0 5px #FFD166" />
        <div id="__next_splash">
          <AppProvidersWrapper>{children}</AppProvidersWrapper>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
