'use client'

import PasswordFormInput from '@/components/form/PasswordFormInput'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import { currentYear, developedBy, developedByLink } from '@/context/constants'
import { getApiUrl } from '@/lib/api/config'
import { t } from '@/lib/translations'
import type { SupportedLocale } from '@/lib/localization'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type FormData = { password: string; password_confirmation: string }

const ResetPassForm = ({ locale, token, email }: { locale: SupportedLocale; token: string; email: string }) => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')

  const schema = yup.object({
    password: yup
      .string()
      .required(t('auth.passwordRequired', locale))
      .min(8, t('auth.passwordMinLength', locale)),
    password_confirmation: yup
      .string()
      .required(t('auth.confirmPasswordRequired', locale))
      .oneOf([yup.ref('password')], t('auth.passwordMismatch', locale)),
  })

  const { control, handleSubmit, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { password: '', password_confirmation: '' },
  })

  useEffect(() => {
    const sub = watch((v) => setPassword(v.password || ''))
    return () => sub.unsubscribe()
  }, [watch])

  const onSubmit = async (data: FormData) => {
    if (!token || !email) {
      setError(t('auth.resetLinkExpired', locale))
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(getApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess(true)
      } else {
        setError(json.message || t('auth.resetLinkExpired', locale))
      }
    } catch {
      setError(t('post.pleaseTryAgain', locale))
    } finally {
      setLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="mt-4 auth-input-wrap">
        <div className="alert alert-warning">
          {t('auth.resetLinkExpired', locale)}
        </div>
        <Link href={`/${locale}/auth/forgot-pass`} className="auth-link d-block mb-3">
          {t('auth.forgotPassTitle', locale)}
        </Link>
        <Link href={`/${locale}/auth/sign-in`} className="auth-link d-block">
          {t('auth.backToSignIn', locale)}
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="mt-4 auth-input-wrap">
        <div className="alert alert-success mb-4">
          {t('auth.resetSuccess', locale)}
        </div>
        <div className="d-grid">
          <Link
            href={`/${locale}/auth/sign-in`}
            className="btn btn-auth-primary btn-lg text-white text-decoration-none d-flex align-items-center justify-content-center"
          >
            {t('auth.signIn', locale)}
          </Link>
        </div>
        <p className="auth-form-copyright mb-0 mt-3">
          ©{currentYear}{' '}
          <a target="_blank" href={developedByLink} rel="noreferrer">
            {developedBy}.
          </a>{' '}
          {t('auth.allRightsReserved', locale)}
        </p>
      </div>
    )
  }

  return (
    <form className="mt-4 auth-input-wrap" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <PasswordFormInput
          name="password"
          placeholder={t('auth.enterNewPassword', locale)}
          control={control}
          size="lg"
          containerClassName="w-100"
          disabled={loading}
        />
        <div className="mt-2">
          <PasswordStrengthMeter password={password} />
        </div>
      </div>
      <div className="mb-3">
        <PasswordFormInput
          name="password_confirmation"
          placeholder={t('auth.enterConfirmPassword', locale)}
          control={control}
          size="lg"
          containerClassName="w-100"
          disabled={loading}
        />
      </div>
      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {error}
        </div>
      )}
      <div className="d-grid">
        <Button className="btn-auth-primary" size="lg" type="submit" disabled={loading}>
          {loading ? t('auth.resetting', locale) : t('auth.resetPassword', locale)}
        </Button>
      </div>
      <p className="auth-form-copyright mb-0 mt-3">
        ©{currentYear}{' '}
        <a target="_blank" href={developedByLink} rel="noreferrer">
          {developedBy}.
        </a>{' '}
        {t('auth.allRightsReserved', locale)}
      </p>
    </form>
  )
}

export default ResetPassForm
