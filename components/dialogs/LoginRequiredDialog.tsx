'use client'
import { Modal, Button } from 'react-bootstrap'
import Link from 'next/link'
import { BsShieldLock, BsArrowRight } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useParams } from 'next/navigation'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'

interface LoginRequiredDialogProps {
  show: boolean
  onHide: () => void
  title?: string
  message?: string
  loginButtonText?: string
  loginUrl?: string
  locale?: SupportedLocale
}

const LoginRequiredDialog = ({
  show,
  onHide,
  title,
  message,
  loginButtonText,
  loginUrl,
  locale: localeProp,
}: LoginRequiredDialogProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const params = useParams<{ locale?: string }>()
  const localeFromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
  const locale: SupportedLocale = localeProp || (localeFromParams && isSupportedLocale(localeFromParams) ? localeFromParams : DEFAULT_LOCALE)
  
  // Build login URL with locale prefix
  const finalLoginUrl = localeFromParams ? `/${localeFromParams}/auth/sign-in` : (loginUrl || '/auth/sign-in')
  
  // Use provided props or fallback to translated defaults
  const finalTitle = title ?? t('dialog.loginRequired.title', locale)
  const finalMessage = message ?? t('dialog.loginRequired.message', locale)
  const finalLoginButtonText = loginButtonText ?? t('dialog.loginRequired.loginButton', locale)

  useEffect(() => {
    if (show) {
      // Trigger animation after modal is shown
      setTimeout(() => setIsAnimating(true), 50)
    } else {
      setIsAnimating(false)
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
      aria-labelledby="login-required-title"
    >
      <Modal.Body className="p-0">
        <div className={clsx('login-required-dialog__wrapper', { 'animate-in': isAnimating })}>
          <div className="login-required-dialog__icon-wrapper">
            <div className="login-required-dialog__icon">
              <BsShieldLock />
            </div>
            <div className="login-required-dialog__icon-glow"></div>
          </div>

          <h4 id="login-required-title" className="login-required-dialog__title">
            {finalTitle}
          </h4>

          <p className="login-required-dialog__message">{finalMessage}</p>

          <div className="login-required-dialog__actions">
            <Button
              variant="secondary"
              onClick={onHide}
              className="login-required-dialog__cancel-btn"
            >
              {t('dialog.loginRequired.cancelButton', locale)}
            </Button>
            <Link href={finalLoginUrl} passHref legacyBehavior>
              <Button
                as="a"
                variant="primary"
                className="login-required-dialog__login-btn"
              >
                {finalLoginButtonText}
                <BsArrowRight className="ms-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Modal.Body>

      <style jsx global>{`
        .login-required-dialog__dialog {
          max-width: 450px;
        }

        .login-required-dialog__content {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .login-required-dialog__wrapper {
          padding: 3rem 2rem 2rem;
          text-align: center;
          background: linear-gradient(145deg, #f6fbff 0%, #ffffff 100%);
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .login-required-dialog__wrapper.animate-in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .login-required-dialog__icon-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .login-required-dialog__icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #177dc1 0%, #fbbe55 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: white;
          position: relative;
          z-index: 2;
          box-shadow: 0 10px 30px rgba(23, 125, 193, 0.35);
          animation: iconPulse 2s ease-in-out infinite;
        }

        .login-required-dialog__icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(23, 125, 193, 0.25) 0%, rgba(214, 140, 55, 0.2) 60%, rgba(251, 190, 85, 0.2) 100%);
          animation: iconGlow 2s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes iconGlow {
          0%, 100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .login-required-dialog__title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #177dc1;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .login-required-dialog__message {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .login-required-dialog__actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .login-required-dialog__cancel-btn,
        .login-required-dialog__login-btn {
          min-width: 120px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 10px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .login-required-dialog__cancel-btn {
          background-color: #fbbe55;
          border-color: #fbbe55;
          color: #1f2937;
        }

        .login-required-dialog__cancel-btn:hover {
          background-color: #d68c37;
          border-color: #d68c37;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(214, 140, 55, 0.35);
        }

        .login-required-dialog__login-btn {
          background: linear-gradient(135deg, #177dc1 0%, #0f5f93 100%);
          border: none;
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(23, 125, 193, 0.35);
        }

        .login-required-dialog__login-btn:hover {
          background: linear-gradient(135deg, #0f5f93 0%, #0b4a74 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 95, 147, 0.4);
          color: #ffffff;
        }

        .login-required-dialog__login-btn:active {
          transform: translateY(0);
        }

        /* Fade in animation for modal backdrop */
        .modal-backdrop {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.5;
          }
        }

        /* Responsive */
        @media (max-width: 576px) {
          .login-required-dialog__wrapper {
            padding: 2rem 1.5rem 1.5rem;
          }

          .login-required-dialog__icon {
            width: 70px;
            height: 70px;
            font-size: 2rem;
          }

          .login-required-dialog__title {
            font-size: 1.25rem;
          }

          .login-required-dialog__actions {
            flex-direction: column;
            width: 100%;
          }

          .login-required-dialog__cancel-btn,
          .login-required-dialog__login-btn {
            width: 100%;
          }
        }
      `}</style>
    </Modal>
  )
}

export default LoginRequiredDialog

