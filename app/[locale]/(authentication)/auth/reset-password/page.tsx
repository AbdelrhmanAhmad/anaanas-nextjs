import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import ResetPassForm from './ResetPassForm'
import type { Metadata } from 'next'
import { t } from '@/lib/translations'
import logo from '@/assets/images/logo/logo_svg.svg'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const locale = (headersList.get('x-locale') || DEFAULT_LOCALE) as SupportedLocale
  return { title: t('auth.resetPassTitle', locale) }
}

type Props = { searchParams: Promise<{ token?: string; email?: string }> }

const ResetPasswordPage = async ({ searchParams }: Props) => {
  const headersList = await headers()
  const localeFromHeader = headersList.get('x-locale')
  const locale: SupportedLocale = (localeFromHeader && isSupportedLocale(localeFromHeader)) ? localeFromHeader : DEFAULT_LOCALE

  const params = await searchParams
  const token = params.token || ''
  const email = params.email || ''

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-card-header">
          <Link href={`/${locale}`}>
            <Image src={logo} alt="ANANAS" className="auth-logo" width={120} height={48} priority />
          </Link>
          <h1 className="auth-form-title">{t('auth.resetPassTitle', locale)}</h1>
          <p className="auth-form-subtitle">
            {t('auth.resetPassDesc', locale)}
          </p>
        </div>
        <ResetPassForm locale={locale} token={token} email={email} />
      </div>
      <div className="auth-mascot">
        <Image
          src="/assets/uiux/mascot_sitting.png"
          alt="ANANAS"
          width={100}
          height={100}
        />
      </div>
    </div>
  )
}

export default ResetPasswordPage
