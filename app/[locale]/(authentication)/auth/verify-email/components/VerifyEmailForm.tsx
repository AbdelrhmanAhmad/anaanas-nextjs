'use client'

import { useEffect, useState } from 'react'
import { Alert, Button, Collapse, Form, Spinner } from 'react-bootstrap'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import type { SupportedLocale } from '@/lib/localization'
import type { EmailVerifyPageCopy } from '@/lib/translations'

type VerifyEmailFormProps = {
  locale: SupportedLocale
  copy: EmailVerifyPageCopy
}

type EmailStatus = {
  email_verified?: boolean
  email?: string | null
  pending_email?: string | null
  verification_email?: string | null
}

const VerifyEmailForm = ({ locale, copy }: VerifyEmailFormProps) => {
  const router = useRouter()
  const { update } = useSession()
  const [status, setStatus] = useState<EmailStatus | null>(null)
  const [code, setCode] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [changingEmail, setChangingEmail] = useState(false)

  const loadStatus = async () => {
    setLoadingStatus(true)
    try {
      const res = await fetch(`/api/auth/email/status?land=${encodeURIComponent(locale)}`, { cache: 'no-store' })
      const json = await res.json().catch(() => ({}))
      if (json?.data) {
        setStatus(json.data)
        if (json.data.email_verified) {
          await update({ emailVerified: true, email: json.data.email })
          router.replace(`/${locale}`)
          return
        }

        if (!json.data.code_expires_at) {
          await fetch(`/api/auth/email/send?land=${encodeURIComponent(locale)}`, {
            method: 'POST',
            headers: { Accept: 'application/json' },
          })
            .then((r) => r.json())
            .then((sendJson) => {
              if (sendJson?.data) setStatus((prev) => ({ ...prev, ...sendJson.data }))
            })
            .catch(() => undefined)
        }
      }
    } finally {
      setLoadingStatus(false)
    }
  }

  useEffect(() => {
    void loadStatus()
  }, [locale])

  const verificationEmail = status?.verification_email || status?.pending_email || status?.email || ''

  const onVerify = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage(null)

    const trimmed = code.replace(/\D/g, '')
    if (!trimmed) {
      setMessage({ type: 'danger', text: copy.codeRequired })
      return
    }

    setVerifying(true)
    try {
      const res = await fetch(`/api/auth/email/verify?land=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      })
      const json = await res.json().catch(() => ({}))

      if (res.ok && json.success && json?.data?.email_verified) {
        const verifiedEmail = json?.data?.user?.email || json?.data?.email || verificationEmail
        await update({ emailVerified: true, email: verifiedEmail })
        window.dispatchEvent(new Event('profile:updated'))
        setMessage({ type: 'success', text: json.message || copy.success })
        router.replace(`/${locale}`)
        return
      }

      setMessage({ type: 'danger', text: json.message || copy.error })
    } catch {
      setMessage({ type: 'danger', text: copy.error })
    } finally {
      setVerifying(false)
    }
  }

  const onResend = async () => {
    setMessage(null)
    setResending(true)
    try {
      const res = await fetch(`/api/auth/email/send?land=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json.success) {
        setStatus((prev) => ({ ...prev, ...json.data }))
        setMessage({ type: 'success', text: json.message })
        return
      }
      setMessage({ type: 'danger', text: json.message || copy.error })
    } catch {
      setMessage({ type: 'danger', text: copy.error })
    } finally {
      setResending(false)
    }
  }

  const onChangeEmail = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage(null)

    const email = newEmail.trim()
    if (!email) {
      setMessage({ type: 'danger', text: copy.emailRequired })
      return
    }

    setChangingEmail(true)
    try {
      const res = await fetch(`/api/auth/email/change?land=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json().catch(() => ({}))

      if (res.ok && json.success) {
        setStatus((prev) => ({ ...prev, ...json.data }))
        setCode('')
        setShowChangeEmail(false)
        setMessage({ type: 'success', text: json.message })
        window.dispatchEvent(new Event('profile:updated'))
        return
      }

      setMessage({ type: 'danger', text: json.message || copy.error })
    } catch {
      setMessage({ type: 'danger', text: copy.error })
    } finally {
      setChangingEmail(false)
    }
  }

  if (loadingStatus) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" size="sm" className="me-2" />
      </div>
    )
  }

  return (
    <div className="mt-3">
      {message ? (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)} className="mb-3">
          {message.text}
        </Alert>
      ) : null}

      <p className="text-muted small mb-1">{copy.sentTo}</p>
      <p className="fw-bold mb-3 text-break" dir="ltr">
        {verificationEmail}
      </p>
      <p className="text-muted small mb-4">{copy.hint}</p>

      <Form onSubmit={onVerify} className="vstack gap-3">
        <Form.Group controlId="verifyCode">
          <Form.Label>{copy.codeLabel}</Form.Label>
          <Form.Control
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={copy.codePlaceholder}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            dir="ltr"
            className="text-center fs-4 letter-spacing-wide"
          />
        </Form.Group>

        <Button type="submit" className="btn-auth-primary" disabled={verifying}>
          {verifying ? (
            <>
              <Spinner size="sm" className="me-2" />
              {copy.verifying}
            </>
          ) : (
            copy.verify
          )}
        </Button>
      </Form>

      <div className="d-flex flex-wrap gap-2 mt-3">
        <Button variant="outline-secondary" size="sm" onClick={onResend} disabled={resending}>
          {resending ? copy.resending : copy.resend}
        </Button>
        <Button variant="outline-primary" size="sm" onClick={() => setShowChangeEmail((v) => !v)}>
          {copy.changeEmail}
        </Button>
        <Button
          variant="link"
          size="sm"
          className="ms-auto text-muted"
          onClick={() => signOut({ callbackUrl: `/${locale}/auth/sign-in` })}
        >
          {copy.signOut}
        </Button>
      </div>

      <Collapse in={showChangeEmail}>
        <div className="mt-3 pt-3 border-top">
          <Form onSubmit={onChangeEmail} className="vstack gap-3">
            <Form.Group controlId="newEmail">
              <Form.Label>{copy.newEmail}</Form.Label>
              <Form.Control
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@example.com"
                dir="ltr"
              />
            </Form.Group>
            <Button type="submit" variant="primary" size="sm" disabled={changingEmail}>
              {changingEmail ? copy.resending : copy.updateEmail}
            </Button>
          </Form>
        </div>
      </Collapse>
    </div>
  )
}

export default VerifyEmailForm
