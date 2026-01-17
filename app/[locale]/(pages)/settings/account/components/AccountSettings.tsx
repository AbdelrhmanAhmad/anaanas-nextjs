'use client'
import DateFormInput from '@/components/form/DateFormInput'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import TextAreaFormInput from '@/components/form/TextAreaFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, CardBody, CardHeader, CardTitle, Col, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { BsPlusCircleDotted } from 'react-icons/bs'
import * as yup from 'yup'
import { useSession } from 'next-auth/react'

const ChangePassword = () => {
  const [firstPassword, setFirstPassword] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)

  const resetPasswordSchema = yup.object().shape({
    current_password: yup.string().required('يرجى إدخال كلمة المرور الحالية'),
    new_password: yup.string().min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل').required('يرجى إدخال كلمة المرور'),
    confirm_password: yup.string().oneOf([yup.ref('new_password')], 'يجب أن تتطابق كلمتا المرور').required('يرجى تأكيد كلمة المرور'),
  })

  const { control, handleSubmit, getValues, watch, reset } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  })

  useEffect(() => {
    setFirstPassword(getValues().new_password || '')
  }, [watch('new_password'), getValues])

  const onSubmit = async (data: any) => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          current_password: data.current_password,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        }),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setMessage({ type: 'success', text: 'تم تحديث كلمة المرور بنجاح' })
        reset()
        setFirstPassword('')
      } else {
        setMessage({ type: 'danger', text: json.message || 'فشل تحديث كلمة المرور' })
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'حدث خطأ أثناء تحديث كلمة المرور' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <CardTitle>تغيير كلمة المرور</CardTitle>
        <p className="mb-0">قم بتحديث كلمة المرور الخاصة بك للحفاظ على أمان حسابك.</p>
      </CardHeader>
      <CardBody>
        {message && (
          <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
          <PasswordFormInput name="current_password" label="كلمة المرور الحالية" control={control} containerClassName="col-12" />
          <Col xs={12}>
            <PasswordFormInput name="new_password" label="كلمة المرور الجديدة" control={control} />
            <div className="mt-2">
              <PasswordStrengthMeter password={firstPassword} />
            </div>
          </Col>
          <PasswordFormInput name="confirm_password" label="تأكيد كلمة المرور" control={control} containerClassName="col-12" />
          <Col xs={12} className="text-end">
            <Button variant="primary" type="submit" className="mb-0" disabled={loading}>
              {loading ? <><Spinner size="sm" className="me-2" /> جاري التحديث...</> : 'تحديث كلمة المرور'}
            </Button>
          </Col>
        </form>
      </CardBody>
    </Card>
  )
}

const AccountSettings = () => {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [allowTeamInvites, setAllowTeamInvites] = useState(false)

  const createFormSchema = yup.object({
    first_name: yup.string().required('يرجى إدخال الاسم الأول'),
    last_name: yup.string().required('يرجى إدخال اسم العائلة'),
    username: yup.string().required('يرجى إدخال اسم المستخدم'),
    mobile: yup.string().required('يرجى إدخال رقم الهاتف'),
    email: yup.string().email('البريد الإلكتروني غير صحيح').required('يرجى إدخال البريد الإلكتروني'),
    bio: yup.string().max(300, 'الحد الأقصى 300 حرف'),
  })

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(createFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      mobile: '',
      bio: '',
    },
  })

  useEffect(() => {
    const loadProfile = async () => {
      if (status !== 'authenticated') {
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })

        const json = await res.json()
        if (res.ok && json.success && json.data?.user) {
          const user = json.data.user
          
          // Parse name into first_name and last_name
          const nameParts = (user.name || '').split(' ')
          const firstName = nameParts[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''

          reset({
            first_name: user.first_name || firstName,
            last_name: user.last_name || lastName,
            username: user.username || '',
            email: user.email || '',
            mobile: user.mobile || '',
            bio: user.bio || '',
          })

          setDateOfBirth(user.date_of_birth || '')
          setAllowTeamInvites(user.allow_team_invites ?? true)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    void loadProfile()
  }, [status, reset])

  const onSubmit = async (data: any) => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          email: data.email,
          mobile: data.mobile,
          bio: data.bio,
          date_of_birth: dateOfBirth || null,
          allow_team_invites: allowTeamInvites,
        }),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        setMessage({ type: 'success', text: 'تم تحديث الملف الشخصي بنجاح' })
      } else {
        setMessage({ type: 'danger', text: json.message || 'فشل تحديث الملف الشخصي' })
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'حدث خطأ أثناء تحديث الملف الشخصي' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <Spinner />
          <p className="mt-3">جاري تحميل البيانات...</p>
        </CardBody>
      </Card>
    )
  }

  if (status !== 'authenticated') {
    return (
      <Card>
        <CardBody>
          <Alert variant="warning">يجب تسجيل الدخول لعرض إعدادات الحساب</Alert>
        </CardBody>
      </Card>
    )
  }
  return (
    <>
      <Card className="mb-4">
        <CardHeader className="border-0 pb-0">
          <h1 className="h5 card-title">إعدادات الحساب</h1>
          <p className="mb-0">حدّث معلومات حسابك الشخصية وتأكد من دقتها.</p>
        </CardHeader>
        <CardBody>
          {message && (
            <Alert variant={message.type} dismissible onClose={() => setMessage(null)} className="mb-3">
              {message.text}
            </Alert>
          )}
          <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
            <TextFormInput name="first_name" label="الاسم الأول" control={control} containerClassName="col-sm-6 col-lg-4" />
            <TextFormInput name="last_name" label="اسم العائلة" control={control} containerClassName="col-sm-6 col-lg-4" />
            <TextFormInput name="username" label="اسم المستخدم" control={control} containerClassName="col-sm-6" />
            <Col lg={6}>
              <label className="form-label">تاريخ الميلاد</label>
              <DateFormInput 
                placeholder="12/12/1990" 
                className="form-control" 
                value={dateOfBirth ? new Date(dateOfBirth) : undefined}
                options={{ dateFormat: 'Y-m-d' }}
                getValue={(date) => {
                  if (date instanceof Date) {
                    setDateOfBirth(date.toISOString().split('T')[0])
                  } else if (Array.isArray(date) && date[0] instanceof Date) {
                    setDateOfBirth(date[0].toISOString().split('T')[0])
                  }
                }}
              />
            </Col>
            <Col xs={12}>
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="allowChecked" 
                  checked={allowTeamInvites}
                  onChange={(e) => setAllowTeamInvites(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="allowChecked">
                  السماح لأي شخص بإضافتك إلى فريقه
                </label>
              </div>
            </Col>
            <Col sm={6}>
              <TextFormInput name="mobile" label="رقم الهاتف" control={control} />
            </Col>
            <Col sm={6}>
              <TextFormInput name="email" label="البريد الإلكتروني" control={control} />
            </Col>
            <Col xs={12}>
              <TextAreaFormInput name="bio" label="نبذة" rows={4} placeholder="الوصف (اختياري)" control={control} />
              <small>الحد الأقصى للأحرف: 300</small>
            </Col>
            <Col xs={12} className="text-end">
              <Button variant="primary" type="submit" size="sm" className="mb-0" disabled={saving}>
                {saving ? <><Spinner size="sm" className="me-2" /> جاري الحفظ...</> : 'حفظ التغييرات'}
              </Button>
            </Col>
          </form>
        </CardBody>
      </Card>
      <ChangePassword />
    </>
  )
}
export default AccountSettings
