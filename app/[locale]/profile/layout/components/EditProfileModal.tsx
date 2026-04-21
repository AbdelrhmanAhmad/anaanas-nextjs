'use client'

import { useEffect, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'motion/react'
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs'
import type { SupportedLocale } from '@/lib/localization'

type UserPayload = {
  id?: number | string
  name?: string
  first_name?: string
  last_name?: string
  username?: string
  email?: string
  mobile?: string
  bio?: string
  date_of_birth?: string
}

type Props = {
  show: boolean
  onHide: () => void
  locale: SupportedLocale
  user: UserPayload | null
  onUpdated?: (updatedUser: any) => void
}

const TEXT = {
  ar: {
    title: 'تعديل الملف الشخصي',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    username: 'اسم المستخدم',
    email: 'البريد الإلكتروني',
    mobile: 'رقم الجوال',
    dob: 'تاريخ الميلاد',
    bio: 'نبذة عنك',
    bioPlaceholder: 'اكتب نبذة قصيرة عنك',
    cancel: 'إلغاء',
    save: 'حفظ التغييرات',
    saving: 'جاري الحفظ...',
    saved: 'تم حفظ التعديلات بنجاح',
    error: 'تعذّر حفظ التعديلات، حاول مجددًا',
    required: 'هذا الحقل مطلوب',
  },
  en: {
    title: 'Edit profile',
    firstName: 'First name',
    lastName: 'Last name',
    username: 'Username',
    email: 'Email',
    mobile: 'Mobile',
    dob: 'Date of birth',
    bio: 'Bio',
    bioPlaceholder: 'Write a short bio about yourself',
    cancel: 'Cancel',
    save: 'Save changes',
    saving: 'Saving...',
    saved: 'Changes saved successfully',
    error: 'Could not save changes, please try again',
    required: 'This field is required',
  },
} as const

function splitName(name?: string): { first: string; last: string } {
  if (!name) return { first: '', last: '' }
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return { first: parts[0], last: '' }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

function formatDobForInput(value?: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function EditProfileModal({ show, onHide, locale, user, onUpdated }: Props) {
  const { data: session } = useSession()
  const t = TEXT[locale]

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [dob, setDob] = useState('')
  const [bio, setBio] = useState('')

  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<null | 'success' | 'error'>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')

  useEffect(() => {
    if (!show) return
    const { first, last } = splitName(user?.name)
    setFirstName(user?.first_name || first)
    setLastName(user?.last_name || last)
    setUsername(user?.username || '')
    setEmail(user?.email || '')
    setMobile(user?.mobile || '')
    setDob(formatDobForInput(user?.date_of_birth))
    setBio(user?.bio || '')
    setStatus(null)
    setErrorMsg('')
  }, [show, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setStatus(null)
    setErrorMsg('')
    try {
      const formData = new FormData()
      if (firstName.trim()) formData.append('first_name', firstName.trim())
      if (lastName.trim()) formData.append('last_name', lastName.trim())
      if (username.trim()) formData.append('username', username.trim())
      if (email.trim()) formData.append('email', email.trim())
      if (mobile.trim()) formData.append('mobile', mobile.trim())
      if (dob) formData.append('date_of_birth', dob)
      formData.append('bio', bio ?? '')

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        body: formData,
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data?.success) {
        setStatus('success')
        onUpdated?.(data?.data?.user)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('profile:updated', { detail: { user: data?.data?.user } })
          )
        }
        setTimeout(() => {
          onHide()
        }, 700)
      } else {
        setStatus('error')
        setErrorMsg(data?.message || t.error)
      }
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err?.message || t.error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      show={show}
      onHide={saving ? undefined : onHide}
      centered
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      backdrop={saving ? 'static' : true}
    >
      <Modal.Header closeButton={!saving}>
        <Modal.Title className="h5 m-0">{t.title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Label>{t.firstName}</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={saving}
                autoComplete="given-name"
              />
            </div>
            <div className="col-md-6">
              <Form.Label>{t.lastName}</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={saving}
                autoComplete="family-name"
              />
            </div>
            <div className="col-md-6">
              <Form.Label>{t.username}</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={saving}
                autoComplete="username"
              />
            </div>
            <div className="col-md-6">
              <Form.Label>{t.email}</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={saving}
                autoComplete="email"
              />
            </div>
            <div className="col-md-6">
              <Form.Label>{t.mobile}</Form.Label>
              <Form.Control
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={saving}
                autoComplete="tel"
                dir="ltr"
              />
            </div>
            <div className="col-md-6">
              <Form.Label>{t.dob}</Form.Label>
              <Form.Control
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="col-12">
              <Form.Label>{t.bio}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t.bioPlaceholder}
                disabled={saving}
              />
              <div className="text-end small text-muted mt-1">{bio.length}/300</div>
            </div>
          </div>

          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                className="alert alert-success d-flex align-items-center gap-2 mt-3 mb-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <BsCheckCircleFill />
                <span>{t.saved}</span>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                className="alert alert-danger d-flex align-items-center gap-2 mt-3 mb-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <BsXCircleFill />
                <span>{errorMsg || t.error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide} disabled={saving}>
            {t.cancel}
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? (
              <span className="d-inline-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" />
                {t.saving}
              </span>
            ) : (
              t.save
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
