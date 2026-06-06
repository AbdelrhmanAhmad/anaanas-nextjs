'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import type { SupportedLocale } from '@/lib/localization'
import type { ContactPageCopy } from '@/lib/translations'
import styles from './contact.module.css'

type ContactFormProps = {
  locale: SupportedLocale
  copy: ContactPageCopy
}

type ContactFormValues = {
  name: string
  email: string
  subject: string
  message: string
}

const ContactForm = ({ locale, copy }: ContactFormProps) => {
  const { data: session } = useSession()
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)
  const formLoadedAtRef = useRef(Math.floor(Date.now() / 1000))
  const honeypotRef = useRef<HTMLInputElement>(null)

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required(copy.nameRequired),
        email: yup.string().email(copy.emailInvalid).required(copy.emailRequired),
        subject: yup.string().required(copy.subjectRequired),
        message: yup.string().required(copy.messageRequired),
      }),
    [copy],
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  useEffect(() => {
    if (!session?.user) return

    const userName = session.user.name?.trim()
    const userEmail = session.user.email?.trim()

    if (userName) setValue('name', userName)
    if (userEmail) setValue('email', userEmail)
  }, [session, setValue])

  const onSubmit = async (values: ContactFormValues) => {
    setMessage(null)

    try {
      const res = await fetch(`/api/contact?land=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...values,
          company_website: honeypotRef.current?.value ?? '',
          _form_ts: formLoadedAtRef.current,
        }),
      })

      const json = await res.json().catch(() => ({}))

      if (res.status === 429) {
        setMessage({ type: 'danger', text: json.message || copy.rateLimited })
        return
      }

      if (res.ok && json.success) {
        setMessage({ type: 'success', text: json.message || copy.success })
        formLoadedAtRef.current = Math.floor(Date.now() / 1000)
        reset({
          name: session?.user?.name?.trim() || '',
          email: session?.user?.email?.trim() || '',
          subject: '',
          message: '',
        })
        if (honeypotRef.current) honeypotRef.current.value = ''
        return
      }

      setMessage({ type: 'danger', text: json.message || copy.error })
    } catch {
      setMessage({ type: 'danger', text: copy.error })
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </div>

      <div className={styles.body}>
        {message ? (
          <Alert variant={message.type} dismissible onClose={() => setMessage(null)} className="mb-4">
            {message.text}
          </Alert>
        ) : null}

        <Form noValidate onSubmit={handleSubmit(onSubmit)} className="vstack gap-3">
          <div className={styles.hpField} aria-hidden="true">
            <label htmlFor="company_website">Company website</label>
            <input
              ref={honeypotRef}
              id="company_website"
              name="company_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <Form.Group controlId="contactName">
            <Form.Label>{copy.name}</Form.Label>
            <Form.Control type="text" isInvalid={!!errors.name} {...register('name')} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="contactEmail">
            <Form.Label>{copy.email}</Form.Label>
            <Form.Control type="email" isInvalid={!!errors.email} {...register('email')} />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="contactSubject">
            <Form.Label>{copy.subject}</Form.Label>
            <Form.Control type="text" isInvalid={!!errors.subject} {...register('subject')} />
            <Form.Control.Feedback type="invalid">{errors.subject?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="contactMessage">
            <Form.Label>{copy.message}</Form.Label>
            <Form.Control as="textarea" rows={6} isInvalid={!!errors.message} {...register('message')} />
            <Form.Control.Feedback type="invalid">{errors.message?.message}</Form.Control.Feedback>
          </Form.Group>

          <div className="text-end pt-1">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {copy.submitting}
                </>
              ) : (
                copy.submit
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default ContactForm
