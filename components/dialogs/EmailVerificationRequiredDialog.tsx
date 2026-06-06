'use client'

import { Modal, Button } from 'react-bootstrap'
import Link from 'next/link'
import { BsEnvelopeCheck, BsArrowRight, BsArrowLeft } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'
import GateDialogGlobalStyles from './GateDialogGlobalStyles'

type EmailVerificationRequiredDialogProps = {
  show: boolean
  onHide: () => void
  locale?: SupportedLocale
  message?: string
}

const EmailVerificationRequiredDialog = ({
  show,
  onHide,
  locale: localeProp,
  message,
}: EmailVerificationRequiredDialogProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const params = useParams<{ locale?: string }>()
  const localeFromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
  const locale: SupportedLocale =
    localeProp || (localeFromParams && isSupportedLocale(localeFromParams) ? localeFromParams : DEFAULT_LOCALE)

  const verifyUrl = `/${locale}/auth/verify-email`
  const finalTitle = t('dialog.emailVerify.title', locale)
  const finalMessage = message ?? t('dialog.emailVerify.message', locale)
  const verifyButtonText = t('dialog.emailVerify.verifyButton', locale)
  const ArrowIcon = locale === 'ar' ? BsArrowLeft : BsArrowRight
  const arrowClass = locale === 'ar' ? 'me-2' : 'ms-2'

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (show) {
      timer = setTimeout(() => setIsAnimating(true), 40)
    } else {
      setIsAnimating(false)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [show])

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      className="login-required-dialog"
      dialogClassName="login-required-dialog__dialog"
      contentClassName="login-required-dialog__content"
      aria-labelledby="email-verify-required-title"
    >
      <Modal.Body className="p-0">
        <div className={clsx('login-required-dialog__wrapper', { 'animate-in': isAnimating })}>
          <div className="login-required-dialog__hero">
            <div className="login-required-dialog__icon-wrapper">
              <div className="login-required-dialog__icon">
                <BsEnvelopeCheck />
              </div>
              <div className="login-required-dialog__icon-glow" />
            </div>
            <div className="login-required-dialog__text-block">
              <h4 id="email-verify-required-title" className="login-required-dialog__title">
                {finalTitle}
              </h4>
              <p className="login-required-dialog__message">{finalMessage}</p>
            </div>
          </div>

          <div className="login-required-dialog__actions">
            <Button variant="secondary" onClick={onHide} className="login-required-dialog__cancel-btn">
              {t('dialog.emailVerify.cancelButton', locale)}
            </Button>
            <Link href={verifyUrl} passHref legacyBehavior>
              <Button as="a" variant="primary" className="login-required-dialog__login-btn">
                {verifyButtonText}
                <ArrowIcon className={arrowClass} />
              </Button>
            </Link>
          </div>
        </div>
      </Modal.Body>

      <GateDialogGlobalStyles />
    </Modal>
  )
}

export default EmailVerificationRequiredDialog
