'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { Modal } from 'react-bootstrap'
import {
  BsBellFill,
  BsCheck2Circle,
  BsMagic,
  BsRocketTakeoffFill,
  BsStars,
  BsXLg,
  BsVolumeMuteFill,
  BsVolumeUpFill,
} from 'react-icons/bs'

import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'
import { ANNOUNCEMENT_SHOW_DELAY_MS } from '@/lib/perf/week1HomePerf'

const STORAGE_KEY = 'ananas:announcement:daily-v2'
const LEGACY_STORAGE_KEY = 'ananas:announcement:daily-v1'

type Props = {
  /** Override the locale (defaults to reading from URL params). */
  locale?: SupportedLocale
}

const COPY: Record<SupportedLocale, {
  eyebrow: string
  title: string
  body: string
  motivation: string
  primary: string
  dismiss: string
  neverAgain: string
  muted: string
  unmuted: string
  close: string
}> = {
  ar: {
    eyebrow: 'ترقبوا',
    title: 'تغييرات يومية على منصة أناناس الجديدة',
    body: 'نعمل يوميًا على تحسين تجربتك: ميزات جديدة، سرعة أعلى، وتصاميم أجمل.',
    motivation: 'كن من أوائل من يكتشف كل جديد — انشر، تفاعل، وكوّن حضورك الرقمي معنا.',
    primary: 'يلّا، لنبدأ',
    dismiss: 'تذكيري لاحقًا',
    neverAgain: 'عدم الإظهار مرة أخرى',
    muted: 'الصوت مكتوم',
    unmuted: 'الصوت مفعّل',
    close: 'إغلاق',
  },
  en: {
    eyebrow: 'Heads up',
    title: 'Daily updates are landing on the new ANANAS',
    body: 'We ship improvements every day: fresh features, faster pages, and cleaner design.',
    motivation: 'Be the first to discover what’s new — post, engage, and grow your presence with us.',
    primary: 'Let’s go',
    dismiss: 'Remind me later',
    neverAgain: 'Don’t show again',
    muted: 'Muted',
    unmuted: 'Sound on',
    close: 'Close',
  },
}

/**
 * Gentle welcome chime rendered via Web Audio (no asset dependency).
 * Plays a short 3-note ascending arpeggio with an exponential decay envelope.
 */
function playChime() {
  try {
    const AC: typeof AudioContext | undefined =
      (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)

    const notes = [880, 1174.66, 1567.98]
    const now = ctx.currentTime

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.14)
      g.gain.setValueAtTime(0.0001, now + i * 0.14)
      g.gain.exponentialRampToValueAtTime(0.18, now + i * 0.14 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 0.42)
      osc.connect(g)
      g.connect(master)
      osc.start(now + i * 0.14)
      osc.stop(now + i * 0.14 + 0.5)
    })

    master.gain.exponentialRampToValueAtTime(0.8, now + 0.02)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)

    setTimeout(() => ctx.close().catch(() => {}), 1100)
  } catch {
    /* audio silently unavailable — not a blocker */
  }
}

const AnnouncementModal = ({ locale: localeOverride }: Props) => {
  const params = useParams<{ locale?: string }>()
  const locale: SupportedLocale = (() => {
    if (localeOverride) return localeOverride
    const fromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    return fromParams && isSupportedLocale(fromParams) ? fromParams : DEFAULT_LOCALE
  })()
  const t = COPY[locale]

  const [show, setShow] = useState(false)
  const [muted, setMuted] = useState(false)
  // Opt-in: user must explicitly tick "Don't show again" for a permanent dismissal.
  const [neverAgain, setNeverAgain] = useState(false)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      // Clean up the legacy v1 key so users who silently got "dismissed-forever"
      // from the old default-on checkbox see the new modal at least once.
      try {
        localStorage.removeItem(LEGACY_STORAGE_KEY)
        sessionStorage.removeItem(LEGACY_STORAGE_KEY)
      } catch {
        /* ignore */
      }

      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'dismissed-forever') return

      // Show once per session unless forever-dismissed.
      const shownThisSession = sessionStorage.getItem(STORAGE_KEY) === '1'
      if (shownThisSession) return

      const openModal = () => {
        setShow(true)
        sessionStorage.setItem(STORAGE_KEY, '1')
      }

      let timer: number | undefined

      const armTimer = () => {
        timer = window.setTimeout(openModal, ANNOUNCEMENT_SHOW_DELAY_MS)
      }

      if (document.readyState === 'complete') {
        armTimer()
      } else {
        const onLoad = () => armTimer()
        window.addEventListener('load', onLoad, { once: true })
        return () => {
          window.removeEventListener('load', onLoad)
          if (timer !== undefined) window.clearTimeout(timer)
        }
      }

      return () => {
        if (timer !== undefined) window.clearTimeout(timer)
      }
    } catch {
      /* localStorage unavailable → silently skip */
    }
  }, [])

  // Play chime when the modal becomes visible.
  useEffect(() => {
    if (!show || hasPlayedRef.current) return
    if (!muted) playChime()
    hasPlayedRef.current = true
  }, [show, muted])

  const persistDismiss = () => {
    try {
      if (neverAgain) localStorage.setItem(STORAGE_KEY, 'dismissed-forever')
    } catch {
      /* ignore */
    }
  }

  const handleClose = () => {
    persistDismiss()
    setShow(false)
  }

  const isArabic = locale === 'ar'

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      contentClassName="announcementModal__content"
      backdropClassName="announcementModal__backdrop"
      aria-labelledby="announcementModalTitle"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="announcementModal__wrap">
        {/* Animated background layers */}
        <div className="announcementModal__aurora" aria-hidden />
        <div className="announcementModal__grid" aria-hidden />
        <div className="announcementModal__orb announcementModal__orb--a" aria-hidden />
        <div className="announcementModal__orb announcementModal__orb--b" aria-hidden />
        <div className="announcementModal__spark announcementModal__spark--1" aria-hidden />
        <div className="announcementModal__spark announcementModal__spark--2" aria-hidden />
        <div className="announcementModal__spark announcementModal__spark--3" aria-hidden />
        <div className="announcementModal__spark announcementModal__spark--4" aria-hidden />

        <button
          type="button"
          className="announcementModal__close"
          onClick={handleClose}
          aria-label={t.close}
        >
          <BsXLg size={14} />
        </button>

        <button
          type="button"
          className="announcementModal__mute"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? t.muted : t.unmuted}
          title={muted ? t.muted : t.unmuted}
        >
          {muted ? <BsVolumeMuteFill size={14} /> : <BsVolumeUpFill size={14} />}
        </button>

        <div className="announcementModal__body">
          <div className="announcementModal__iconWrap" aria-hidden>
            <span className="announcementModal__iconHalo" />
            <span className="announcementModal__iconHalo announcementModal__iconHalo--2" />
            <span className="announcementModal__iconCore">
              <BsBellFill size={28} />
            </span>
            <span className="announcementModal__iconStar announcementModal__iconStar--tl">
              <BsStars size={12} />
            </span>
            <span className="announcementModal__iconStar announcementModal__iconStar--br">
              <BsMagic size={10} />
            </span>
          </div>

          <span className="announcementModal__eyebrow">
            <BsMagic size={12} />
            {t.eyebrow}
          </span>

          <h2 id="announcementModalTitle" className="announcementModal__title">
            {t.title}
          </h2>

          <p className="announcementModal__body__text">{t.body}</p>

          <p className="announcementModal__motivation">
            <BsRocketTakeoffFill className="announcementModal__motivationIcon" />
            {t.motivation}
          </p>

          <div className="announcementModal__actions">
            <button
              type="button"
              className="announcementModal__primary"
              onClick={handleClose}
            >
              <BsCheck2Circle size={16} />
              <span>{t.primary}</span>
            </button>

            <label className="announcementModal__never">
              <input
                type="checkbox"
                checked={neverAgain}
                onChange={(e) => setNeverAgain(e.target.checked)}
              />
              <span>{t.neverAgain}</span>
            </label>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .announcementModal__backdrop {
          background: radial-gradient(
            ellipse at 50% 0%,
            rgba(255, 122, 24, 0.25),
            rgba(10, 8, 30, 0.78) 60%
          ) !important;
          backdrop-filter: blur(10px);
        }
        .announcementModal__content {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          overflow: visible !important;
        }
        .announcementModal__wrap {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          padding: clamp(28px, 4vw, 44px) clamp(22px, 3.5vw, 40px);
          color: #fff;
          background: linear-gradient(
            140deg,
            #120a2a 0%,
            #1f1140 40%,
            #3b0a57 70%,
            #5a0c63 100%
          );
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.06) inset;
          animation: annModalIn 0.7s cubic-bezier(0.2, 0.9, 0.2, 1.05) both;
        }
        @keyframes annModalIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .announcementModal__aurora {
          position: absolute;
          inset: -30%;
          background: conic-gradient(
            from 0deg at 50% 50%,
            rgba(255, 122, 24, 0.55),
            rgba(255, 0, 110, 0.35),
            rgba(106, 0, 255, 0.45),
            rgba(0, 200, 255, 0.25),
            rgba(255, 122, 24, 0.55)
          );
          filter: blur(60px);
          opacity: 0.35;
          animation: annAurora 18s linear infinite;
        }
        @keyframes annAurora {
          to {
            transform: rotate(360deg);
          }
        }
        .announcementModal__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.9),
            transparent 70%
          );
          pointer-events: none;
        }
        .announcementModal__orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(30px);
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .announcementModal__orb--a {
          top: -40px;
          left: -40px;
          width: 220px;
          height: 220px;
          background: radial-gradient(
            circle,
            rgba(255, 122, 24, 0.55),
            transparent 70%
          );
          animation: annFloat 11s ease-in-out infinite;
        }
        .announcementModal__orb--b {
          bottom: -60px;
          right: -30px;
          width: 260px;
          height: 260px;
          background: radial-gradient(
            circle,
            rgba(106, 0, 255, 0.55),
            transparent 70%
          );
          animation: annFloat 13s ease-in-out -3s infinite reverse;
        }
        @keyframes annFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(12px, -18px, 0) scale(1.06);
          }
        }
        .announcementModal__spark {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 0 12px #fff, 0 0 24px rgba(255, 255, 255, 0.6);
          animation: annSpark 3s ease-in-out infinite;
          pointer-events: none;
        }
        .announcementModal__spark--1 {
          top: 18%;
          left: 14%;
        }
        .announcementModal__spark--2 {
          top: 30%;
          right: 18%;
          animation-delay: 0.7s;
        }
        .announcementModal__spark--3 {
          bottom: 22%;
          left: 26%;
          animation-delay: 1.1s;
        }
        .announcementModal__spark--4 {
          bottom: 14%;
          right: 10%;
          animation-delay: 1.8s;
        }
        @keyframes annSpark {
          0%,
          100% {
            transform: scale(0.6);
            opacity: 0.35;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        .announcementModal__close,
        .announcementModal__mute {
          position: absolute;
          top: 14px;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          transition: background 0.2s, transform 0.2s;
          z-index: 3;
        }
        .announcementModal__close:hover,
        .announcementModal__mute:hover {
          background: rgba(255, 255, 255, 0.18);
          transform: translateY(-1px);
        }
        [dir='rtl'] .announcementModal__close {
          left: 14px;
        }
        [dir='rtl'] .announcementModal__mute {
          left: 52px;
        }
        [dir='ltr'] .announcementModal__close {
          right: 14px;
        }
        [dir='ltr'] .announcementModal__mute {
          right: 52px;
        }
        .announcementModal__body {
          position: relative;
          z-index: 2;
          text-align: center;
        }
        .announcementModal__iconWrap {
          position: relative;
          display: inline-flex;
          width: 88px;
          height: 88px;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .announcementModal__iconHalo {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(255, 122, 24, 0.55),
            transparent 70%
          );
          animation: annHalo 2.6s ease-out infinite;
        }
        .announcementModal__iconHalo--2 {
          animation-delay: 1.3s;
        }
        @keyframes annHalo {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .announcementModal__iconCore {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 999px;
          background: linear-gradient(135deg, #ffb36b, #ff4d7e);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow:
            0 10px 30px rgba(255, 77, 126, 0.45),
            inset 0 0 0 2px rgba(255, 255, 255, 0.22);
          animation: annBell 2.4s ease-in-out infinite;
        }
        @keyframes annBell {
          0%,
          60%,
          100% {
            transform: rotate(0);
          }
          70% {
            transform: rotate(14deg);
          }
          80% {
            transform: rotate(-10deg);
          }
          90% {
            transform: rotate(6deg);
          }
        }
        .announcementModal__iconStar {
          position: absolute;
          color: #fff;
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
          animation: annTwinkle 2s ease-in-out infinite;
        }
        .announcementModal__iconStar--tl {
          top: -4px;
          left: -2px;
        }
        .announcementModal__iconStar--br {
          bottom: -2px;
          right: -2px;
          animation-delay: 0.9s;
        }
        @keyframes annTwinkle {
          0%,
          100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        .announcementModal__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #ffd5b8;
          border: 1px solid rgba(255, 255, 255, 0.12);
          margin-bottom: 10px;
        }
        .announcementModal__title {
          font-size: clamp(1.3rem, 2.6vw, 1.85rem);
          font-weight: 800;
          line-height: 1.35;
          margin: 0 0 10px;
          background: linear-gradient(120deg, #ffffff 0%, #ffd5b8 50%, #ff9eaa 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .announcementModal__body__text {
          font-size: clamp(0.93rem, 1.4vw, 1.02rem);
          color: rgba(255, 255, 255, 0.84);
          margin: 0 0 14px;
          line-height: 1.7;
        }
        .announcementModal__motivation {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
          font-size: 0.92rem;
          margin: 0 0 22px;
        }
        .announcementModal__motivationIcon {
          color: #ffc56b;
          filter: drop-shadow(0 0 6px rgba(255, 197, 107, 0.55));
          flex-shrink: 0;
        }
        .announcementModal__actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .announcementModal__primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 999px;
          font-weight: 700;
          color: #120a2a;
          background: linear-gradient(120deg, #fff, #ffe8d6);
          border: 0;
          box-shadow:
            0 10px 26px rgba(255, 122, 24, 0.35),
            inset 0 0 0 2px rgba(255, 255, 255, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .announcementModal__primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(255, 122, 24, 0.45);
        }
        .announcementModal__never {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          user-select: none;
        }
        .announcementModal__never input[type='checkbox'] {
          accent-color: #ff7a18;
          width: 16px;
          height: 16px;
        }
        @media (max-width: 480px) {
          .announcementModal__wrap {
            border-radius: 20px;
          }
          .announcementModal__iconWrap {
            width: 72px;
            height: 72px;
          }
          .announcementModal__iconCore {
            width: 54px;
            height: 54px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .announcementModal__wrap,
          .announcementModal__aurora,
          .announcementModal__orb,
          .announcementModal__spark,
          .announcementModal__iconHalo,
          .announcementModal__iconCore,
          .announcementModal__iconStar {
            animation: none !important;
          }
        }
      `}</style>
    </Modal>
  )
}

export default AnnouncementModal
