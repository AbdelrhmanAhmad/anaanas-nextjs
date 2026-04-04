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
    let timer: ReturnType<typeof setTimeout> | undefined
    if (show) {
      // Trigger animation after modal is shown
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
      aria-labelledby="login-required-title"
    >
      <Modal.Body className="p-0">
        <div className={clsx('login-required-dialog__wrapper', { 'animate-in': isAnimating })}>
          <div className="login-required-dialog__hero">
            <div className="login-required-dialog__icon-wrapper">
              <div className="login-required-dialog__icon">
                <BsShieldLock />
              </div>
              <div className="login-required-dialog__icon-glow"></div>
            </div>
            <div className="login-required-dialog__text-block">
              <h4 id="login-required-title" className="login-required-dialog__title">
                {finalTitle}
              </h4>
              <p className="login-required-dialog__message">{finalMessage}</p>
            </div>
          </div>

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
          max-width: 520px;
        }

        .login-required-dialog__content {
          border: none;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 22px 54px rgba(21, 21, 21, 0.2);
        }

        .login-required-dialog__wrapper {
          --brand-yellow: #fecb01;
          --brand-soft: #f3edef;
          --brand-dark: #151515;
          --brand-white: #fff;
          position: relative;
          padding: 2rem;
          background: linear-gradient(180deg, rgba(243, 237, 239, 0.9) 0%, #fff 100%);
          opacity: 0;
          transform: translateY(16px) scale(0.98);
          transition:
            opacity 0.28s ease,
            transform 0.34s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .login-required-dialog__wrapper::before {
          content: '';
          position: absolute;
          inset-inline: 0;
          top: 0;
          height: 6px;
          background: linear-gradient(90deg, #151515 0%, #fecb01 65%, #151515 100%);
        }

        .login-required-dialog__wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          border: 1px solid rgba(21, 21, 21, 0.1);
          border-radius: 22px;
        }

        .login-required-dialog__wrapper.animate-in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .login-required-dialog__hero {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1.25rem;
          text-align: start;
        }

        .login-required-dialog__icon-wrapper {
          position: relative;
          width: 74px;
          height: 74px;
          flex-shrink: 0;
        }

        .login-required-dialog__icon {
          width: 74px;
          height: 74px;
          border-radius: 50%;
          background: #151515;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.9rem;
          color: #fecb01;
          position: relative;
          z-index: 2;
          box-shadow: 0 10px 24px rgba(21, 21, 21, 0.28);
          animation: iconPulse 2.4s ease-in-out infinite;
        }

        .login-required-dialog__icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 94px;
          height: 94px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(254, 203, 1, 0.34) 0%, rgba(254, 203, 1, 0.08) 68%, transparent 100%);
          animation: iconGlow 2.4s ease-in-out infinite;
          z-index: 1;
        }

        .login-required-dialog__icon-wrapper::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 1.5px dashed rgba(21, 21, 21, 0.22);
          animation: spinRing 8s linear infinite;
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
            opacity: 0.34;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.72;
            transform: translate(-50%, -50%) scale(1.12);
          }
        }

        @keyframes spinRing {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .login-required-dialog__text-block {
          min-width: 0;
        }

        .login-required-dialog__title {
          font-size: 1.32rem;
          font-weight: 800;
          color: #151515;
          margin-bottom: 0.45rem;
          line-height: 1.35;
          transform: translateY(8px);
          opacity: 0;
          transition: transform 0.3s ease 0.08s, opacity 0.3s ease 0.08s;
        }

        .login-required-dialog__message {
          color: rgba(21, 21, 21, 0.82);
          font-size: 0.96rem;
          line-height: 1.65;
          margin: 0;
          transform: translateY(8px);
          opacity: 0;
          transition: transform 0.3s ease 0.14s, opacity 0.3s ease 0.14s;
        }

        .login-required-dialog__actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 1.35rem;
          transform: translateY(8px);
          opacity: 0;
          transition: transform 0.3s ease 0.2s, opacity 0.3s ease 0.2s;
        }

        .login-required-dialog__wrapper.animate-in .login-required-dialog__title,
        .login-required-dialog__wrapper.animate-in .login-required-dialog__message,
        .login-required-dialog__wrapper.animate-in .login-required-dialog__actions {
          transform: translateY(0);
          opacity: 1;
        }

        .login-required-dialog__cancel-btn,
        .login-required-dialog__login-btn {
          min-width: 0;
          width: 100%;
          padding: 0.75rem 1rem;
          font-weight: 700;
          border-radius: 12px;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background-color 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-required-dialog__cancel-btn {
          background: #f3edef;
          border-color: rgba(21, 21, 21, 0.2);
          color: #151515;
        }

        .login-required-dialog__cancel-btn:hover {
          background: #151515;
          border-color: #151515;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(21, 21, 21, 0.22);
        }

        .login-required-dialog__login-btn {
          background: #fecb01;
          border-color: #fecb01;
          color: #151515;
          box-shadow: 0 8px 18px rgba(254, 203, 1, 0.35);
        }

        .login-required-dialog__login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 34%, rgba(255, 255, 255, 0.5) 50%, transparent 66%);
          transform: translateX(-130%);
          transition: transform 0.46s ease;
          pointer-events: none;
        }

        .login-required-dialog__login-btn:hover {
          background: #f6c400;
          border-color: #f6c400;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(254, 203, 1, 0.42);
          color: #151515;
        }

        .login-required-dialog__login-btn:hover::before {
          transform: translateX(140%);
        }

        .login-required-dialog__login-btn :global(svg) {
          transition: transform 0.3s ease;
        }

        .login-required-dialog__login-btn:hover :global(svg) {
          transform: translateX(3px);
        }

        .login-required-dialog__login-btn:active {
          transform: translateY(0) scale(0.99);
        }

        .login-required-dialog__cancel-btn:focus-visible,
        .login-required-dialog__login-btn:focus-visible {
          outline: 2px solid #151515;
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .login-required-dialog__wrapper,
          .login-required-dialog__title,
          .login-required-dialog__message,
          .login-required-dialog__actions,
          .login-required-dialog__cancel-btn,
          .login-required-dialog__login-btn,
          .login-required-dialog__login-btn :global(svg),
          .login-required-dialog__icon,
          .login-required-dialog__icon-glow,
          .login-required-dialog__icon-wrapper::before {
            transition-duration: 0.01ms !important;
            animation: none !important;
          }

          .login-required-dialog__login-btn::before {
            display: none;
          }
        }

        /* Responsive */
        @media (max-width: 576px) {
          .login-required-dialog__wrapper {
            padding: 1.6rem 1.25rem 1.25rem;
          }

          .login-required-dialog__hero {
            grid-template-columns: 1fr;
            text-align: center;
            justify-items: center;
            gap: 0.8rem;
          }

          .login-required-dialog__title {
            font-size: 1.18rem;
          }

          .login-required-dialog__actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Modal>
  )
}

export default LoginRequiredDialog

