'use client'

import TextFormInput from '@/components/form/TextFormInput'
import { currentYear, developedBy, developedByLink } from '@/context/constants'
import { getApiUrl } from '@/lib/api/config'
import { t } from '@/lib/translations'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import type { SupportedLocale } from '@/lib/localization'
import * as yup from 'yup'

type FormData = { email: string }

const ForgotPassForm = ({ locale }: { locale: SupportedLocale }) => {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const schema = yup.object({
    email: yup.string().required(t('auth.emailRequired', locale)).email(t('auth.invalidEmail', locale)),
  })

  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(getApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', lang: locale },
        body: JSON.stringify({ email: data.email }),
      })
      const json = await res.json()
      if (json.success) {
        setSent(true)
      } else {
        setError(json.message || 'Something went wrong')
      }
    } catch {
      setError(t('post.pleaseTryAgain', locale))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="mt-4 auth-input-wrap">
        <div className="alert alert-success mb-4">
          <strong>{t('auth.checkEmail', locale)}</strong>
          <p className="mb-0 mt-2 small">{t('auth.checkEmailDesc', locale)}</p>
        </div>
        <Link href={`/${locale}/auth/sign-in`} className="auth-link d-block mb-3">
          {t('auth.backToSignIn', locale)}
        </Link>
        <p className="auth-form-copyright mb-0">
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
      <TextFormInput
        name="email"
        type="email"
        placeholder={t('auth.enterEmail', locale)}
        control={control}
        containerClassName="mb-3 input-group-lg"
        disabled={loading}
      />
      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {error}
        </div>
      )}
      <div className="d-grid">
        <Button className="btn-auth-primary" size="lg" type="submit" disabled={loading}>
          {loading ? t('auth.sending', locale) : t('auth.sendResetLink', locale)}
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

export default ForgotPassForm
