'use client'

import type { SupportedLocale } from '@/lib/localization'

type Props = {
  locale?: SupportedLocale
  className?: string
}

/**
 * Small animated "Beta" badge rendered next to the brand logo.
 * Gradient fill + subtle shine animation so it reads as intentional, not an error.
 */
const BetaBadge = ({ locale = 'ar', className = '' }: Props) => {
  const label = locale === 'ar' ? 'إصدار تجريبي' : 'Beta'
  return (
    <>
      <span
        className={`betaBadge d-inline-flex align-items-center gap-1 ${className}`}
        role="status"
        aria-label={label}
        title={label}
      >
        <span className="betaBadge__dot" />
        <span className="betaBadge__text">{label}</span>
      </span>

      <style jsx>{`
        .betaBadge {
          position: relative;
          overflow: hidden;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          color: #fff;
          background: linear-gradient(
            120deg,
            #ff7a18 0%,
            #ff006e 45%,
            #6a00ff 100%
          );
          box-shadow: 0 4px 12px rgba(255, 0, 110, 0.25);
          text-transform: uppercase;
          white-space: nowrap;
          line-height: 1;
        }
        .betaBadge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 20%,
            rgba(255, 255, 255, 0.45) 50%,
            transparent 80%
          );
          transform: translateX(-100%);
          animation: betaShine 3.2s ease-in-out infinite;
        }
        .betaBadge__dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.65);
          animation: betaPulse 1.8s ease-out infinite;
          position: relative;
          z-index: 1;
        }
        .betaBadge__text {
          position: relative;
          z-index: 1;
        }
        @keyframes betaShine {
          0% {
            transform: translateX(-100%);
          }
          60%,
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes betaPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.55);
          }
          70% {
            box-shadow: 0 0 0 7px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .betaBadge::before,
          .betaBadge__dot {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}

export default BetaBadge
