'use client'
import { currentYear, developedBy, developedByLink } from '@/context/constants'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button, FormCheck } from 'react-bootstrap'
import useSignIn from './useSignIn'
import TextFormInput from '@/components/form/TextFormInput'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

const LoginForm = ({ locale: localeProp }: { locale?: SupportedLocale }) => {
  const params = useParams<{ locale?: string }>()
  
  const locale: SupportedLocale = (() => {
    if (localeProp && isSupportedLocale(localeProp)) return localeProp
    const localeFromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    if (localeFromParams && isSupportedLocale(localeFromParams)) return localeFromParams
    return DEFAULT_LOCALE
  })()

  const { loading, login, control } = useSignIn(locale)

  return (
    <form className="mt-4 auth-input-wrap" onSubmit={login}>
      <TextFormInput name="email" type="email" placeholder={t('auth.enterEmailOrPhone', locale)} control={control} containerClassName="mb-3 input-group-lg" />
      <div className="mb-3">
        <PasswordFormInput name="password" placeholder={t('auth.enterPassword', locale)} control={control} size="lg" containerClassName="w-100" />
      </div>
      <div className="mb-3 d-sm-flex justify-content-between">
        <div>
          <FormCheck type="checkbox" label={t('auth.rememberMe', locale)} id="rememberCheck" />
        </div>
        <Link href={`/${locale}/auth/forgot-pass`} className="auth-link">{t('auth.forgotPassword', locale)}</Link>
      </div>
      <div className="d-grid">
        <Button className="btn-auth-primary" size="lg" type="submit" disabled={loading}>
          {loading ? t('auth.signingIn', locale) : t('auth.submit', locale)}
        </Button>
      </div>
      <p className="auth-form-copyright mb-0">
        ©{currentYear}{' '}
        <a target="_blank" href={developedByLink}>
          {developedBy}.
        </a>{' '}
        {t('auth.allRightsReserved', locale)}
      </p>
    </form>
  )
}
export default LoginForm
