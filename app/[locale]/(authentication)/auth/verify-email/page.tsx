import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import type { Metadata } from 'next'

import logo from '@/assets/images/logo/logo_svg.svg'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'
import { getEmailVerifyPageCopy, t } from '@/lib/translations'

import VerifyEmailForm from './components/VerifyEmailForm'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const locale = (headersList.get('x-locale') || DEFAULT_LOCALE) as SupportedLocale
  return { title: t('emailVerify.title', locale) }
}

const VerifyEmailPage = async () => {
  const headersList = await headers()
  const localeFromHeader = headersList.get('x-locale')
  const locale: SupportedLocale =
    localeFromHeader && isSupportedLocale(localeFromHeader) ? localeFromHeader : DEFAULT_LOCALE
  const copy = getEmailVerifyPageCopy(locale)

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-card-header">
          <Link href={`/${locale}`}>
            <Image src={logo} alt="ANANAS" className="auth-logo" width={120} height={48} priority />
          </Link>
          <h1 className="auth-form-title">{copy.title}</h1>
          <p className="auth-form-subtitle">{copy.subtitle}</p>
        </div>
        <VerifyEmailForm locale={locale} copy={copy} />
      </div>
    </div>
  )
}

export default VerifyEmailPage
