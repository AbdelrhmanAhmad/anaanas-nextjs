import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import NextTopLoader from 'nextjs-toploader'
import type { ReactNode } from 'react'

import { DEFAULT_PAGE_TITLE } from '@/context/constants'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

import logo from '@/assets/images/logo.svg'

import '@/assets/scss/style.scss'

const AppProvidersWrapper = dynamic(() => import('@/components/wrappers/AppProvidersWrapper'))

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Social Nextjs - Network, Community and Event Theme',
    default: DEFAULT_PAGE_TITLE,
  },
  description: 'Bootstrap 5 based Social Media Network and Community Theme',
}

const splashScreenStyles = `
#splash-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  background: white;
  display: flex;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: all 15s linear;
  overflow: hidden;
}

#splash-screen.remove {
  animation: fadeout 0.7s forwards;
  z-index: 0;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
`

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
    <html lang={locale} dir={direction} data-locale={locale}>
      <head>
        <style>{splashScreenStyles}</style>
        <link rel="stylesheet" href={localeStylesheet} />
      </head>
      <body className={`${inter.className} ${localeClassName}`} data-locale={locale} data-dir={direction}>
        <div id="splash-screen">
          <Image alt="Logo" width={355} height={83} src={logo} style={{ height: '10%', width: 'auto' }} priority />
        </div>
        <NextTopLoader color="#1c84ee" showSpinner={false} />
        <div id="__next_splash">
          <AppProvidersWrapper>{children}</AppProvidersWrapper>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
