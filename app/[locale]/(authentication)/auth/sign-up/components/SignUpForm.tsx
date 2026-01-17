'use client'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import { currentYear, developedBy, developedByLink } from '@/context/constants'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, FormCheck } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { getApiUrl } from '@/lib/api/config'
import { useNotificationContext } from '@/context/useNotificationContext'
import { signIn } from 'next-auth/react'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

const SignUpForm = ({ locale: localeProp }: { locale?: SupportedLocale }) => {
  const params = useParams<{ locale?: string }>()
  
  const locale: SupportedLocale = (() => {
    if (localeProp && isSupportedLocale(localeProp)) return localeProp
    const localeFromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    if (localeFromParams && isSupportedLocale(localeFromParams)) return localeFromParams
    return DEFAULT_LOCALE
  })()
  const [firstPassword, setFirstPassword] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()
  const { showNotification } = useNotificationContext()

  const signUpSchema = yup.object({
    name: yup.string().optional(),
    mobile: yup.string().optional(),
    email: yup.string().email(t('auth.invalidEmail', locale)).optional(),
    password: yup.string().required(t('auth.passwordRequired', locale)),
    confirmPassword: yup
      .string()
      .required(t('auth.confirmPasswordRequired', locale))
      .oneOf([yup.ref('password')], t('auth.passwordMismatch', locale)),
  })
  type SignUpValues = yup.InferType<typeof signUpSchema>
  const { control, handleSubmit, watch, getValues } = useForm<SignUpValues>({
    resolver: yupResolver(signUpSchema),
  })

  useEffect(() => {
    setFirstPassword(getValues().password)
  }, [watch('password')])

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true)
    try {
      const body: Record<string, string> = {
        password: values.password,
        password_confirmation: values.confirmPassword,
      }

      if (values.name) body.name = values.name
      if (values.email) body.email = values.email
      if (values.mobile) body.mobile = values.mobile

      const res = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        showNotification({ 
          message: locale === 'ar' 
            ? 'تم إنشاء الحساب بنجاح. جاري تسجيل الدخول...' 
            : 'Account created successfully. Signing in...', 
          variant: 'success' 
        })
        
        // Auto login after registration
        const loginResult = await signIn('credentials', {
          redirect: false,
          email: values.email || undefined,
          mobile: values.mobile || undefined,
          password: values.password,
        })

        if (loginResult?.ok) {
          push(`/${locale}`)
        } else {
          push(`/${locale}/auth/sign-in`)
        }
      } else {
        showNotification({ 
          message: data.message || (locale === 'ar' ? 'حدث خطأ أثناء إنشاء الحساب' : 'An error occurred while creating the account'), 
          variant: 'danger' 
        })
      }
    } catch (error) {
      showNotification({ 
        message: error instanceof Error 
          ? error.message 
          : (locale === 'ar' ? 'حدث خطأ' : 'An error occurred'), 
        variant: 'danger' 
      })
    } finally {
      setLoading(false)
    }
  })

  return (
    <form className="mt-4" onSubmit={onSubmit}>
      <div className="mb-3 text-start">
        <label htmlFor="name" className="form-label">{t('auth.nameOptional', locale)}</label>
        <TextFormInput name="name" control={control} 
        containerClassName="input-group-lg" placeholder={t('auth.enterName', locale)} />
      </div>

      <div className="mb-3 text-start">
        <label htmlFor="mobile" className="form-label">{t('auth.mobileOptional', locale)}</label>
        <TextFormInput name="mobile" control={control} 
        containerClassName="input-group-lg" placeholder={t('auth.enterMobile', locale)} />
      </div>

      <div className="mb-3 text-start">
        <label htmlFor="email" className="form-label">{t('auth.emailOptional', locale)}</label>
        <TextFormInput name="email" type="email" control={control} 
        containerClassName="input-group-lg" placeholder={t('auth.enterEmail', locale)} />
      </div>

      <div className="mb-3 text-start">
        <label htmlFor="password" className="form-label">{t('auth.password', locale)}</label>
        <PasswordFormInput name="password" control={control} size="lg" 
        placeholder={t('auth.enterPassword', locale)} />
        <div className="mt-2">
          <PasswordStrengthMeter password={firstPassword} />
        </div>
      </div>

      <div className="mb-3 text-start">
        <label htmlFor="confirmPassword" className="form-label">{t('auth.confirmPassword', locale)}</label>
        <PasswordFormInput name="confirmPassword" 
      control={control} size="lg" containerClassName="mb-3" 
      placeholder={t('auth.enterConfirmPassword', locale)} />
      </div>
   
      <div className="mb-3 text-start">
        <FormCheck label={t('auth.rememberMe', locale)} id="termAndCondition" />
      </div>
      <div className="d-grid">
        <Button variant="primary" size="lg" type="submit" disabled={loading}>
          {loading ? t('auth.creating', locale) : t('auth.createAccount', locale)}
        </Button>
      </div>
      <p className="mb-0 mt-3 text-center">
        ©{currentYear}{' '}
        <Link target="_blank" href={developedByLink}>
          {developedBy}.
        </Link>{' '}
        {t('auth.allRightsReserved', locale)}
      </p>
    </form>
  )
}
export default SignUpForm
