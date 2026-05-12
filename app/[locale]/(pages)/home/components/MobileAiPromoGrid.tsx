'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

import type { SupportedLocale } from '@/lib/localization'

import styles from './MobileAiPromoGrid.module.css'

/** Inline vector — no raster mascot; matches smart-ads tile greens */
function SmartAdsAiIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20 4l1.2 3.7h3.9l-3.1 2.3 1.2 3.7L20 11.4l-3.2 2.3 1.2-3.7-3.1-2.3h3.9L20 4z"
        fill="currentColor"
        opacity={0.35}
      />
      <path
        d="M9 8.5l.8 2.4h2.5l-2 1.5.8 2.4L9 15.3l-2.1 1.5.8-2.4-2-1.5h2.5L9 8.5z"
        fill="currentColor"
        opacity={0.22}
      />
      <rect x="9" y="16" width="22" height="18" rx="5" stroke="currentColor" strokeWidth="1.35" fill="rgba(255,255,255,0.35)" />
      <path
        d="M14 23h5M21 23h5M14 27h12"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity={0.85}
      />
      <circle cx="16" cy="21" r="1.35" fill="currentColor" opacity={0.5} />
      <circle cx="24" cy="21" r="1.35" fill="currentColor" opacity={0.45} />
      <path
        d="M31 11l.6 1.7h1.8l-1.4 1 .5 1.7L31 15l-1.5 1.1.5-1.7-1.4-1h1.8L31 11z"
        fill="currentColor"
        opacity={0.28}
      />
    </svg>
  )
}

type Props = {
  locale: SupportedLocale
  className?: string
}

const MobileAiPromoGrid = ({ locale, className = '' }: Props) => {
  const isAr = locale === 'ar'

  const [clock, setClock] = useState({ h: 2, m: 18, s: 45 })

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock((prev) => {
        let { h, m, s } = prev
        if (s > 0) s -= 1
        else if (m > 0) {
          m -= 1
          s = 59
        } else if (h > 0) {
          h -= 1
          m = 59
          s = 59
        } else {
          h = 23
          m = 59
          s = 59
        }
        return { h, m, s }
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  const tops = isAr
    ? [
        { emoji: '🔥', emojiClass: styles.topEmojiFire, title: 'الأكثر تفاعلاً اليوم', sub: 'إعلانات عليها تفاعل عالي' },
        { emoji: '🎯', emojiClass: styles.topEmojiTarget, title: 'فرص مخصصة لك', sub: 'بناءً على اهتمامك' },
        { emoji: '⚡', emojiClass: styles.topEmojiBolt, title: 'إعلانات ذكية مضافة', sub: 'إعلانات ذكية قريبة منك' },
      ]
    : [
        { emoji: '🔥', emojiClass: styles.topEmojiFire, title: 'Most active today', sub: 'Ads with high engagement' },
        { emoji: '🎯', emojiClass: styles.topEmojiTarget, title: 'Opportunities for you', sub: 'Based on your interests' },
        { emoji: '⚡', emojiClass: styles.topEmojiBolt, title: 'Smart ads added', sub: 'Smart ads near you now' },
      ]

  return (
    <motion.section
      className={`${styles.root} ${className}`.trim()}
      dir={isAr ? 'rtl' : 'ltr'}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      aria-label={isAr ? 'عروض وميزات' : 'Promos and features'}
    >
      {/* ===== Top: three compact info pills ===== */}
      <div className={styles.topRow}>
        {tops.map((item) => (
          <Link key={item.title} href={`/${locale}`} className={styles.topCard} prefetch={false}>
            <span className={styles.topHead}>
              <span className={`${styles.topEmoji} ${item.emojiClass}`} aria-hidden>
                {item.emoji}
              </span>
              <span className={styles.topTitle}>{item.title}</span>
            </span>
            <span className={styles.topSub}>{item.sub}</span>
          </Link>
        ))}
      </div>

      {/* ===== Bottom: 2 cards + 1 wide strip (better use of horizontal space) ===== */}
      <div className={styles.bottomStack}>
        <div className={styles.bottomPair}>
          {/* HOT DEALS — pink */}
          <Link href={`/${locale}`} className={`${styles.fCard} ${styles.fHot}`} prefetch={false}>
            <span className={styles.fGift} aria-hidden>
              🎁
            </span>
            <span className={styles.fHead}>
              <span className={`${styles.fHeadIcon} ${styles.fHeadIconFire}`} aria-hidden>
                🔥
              </span>
              <span className={styles.fHeadTitle}>{isAr ? 'عروض نار' : 'Hot deals'}</span>
            </span>
            <p className={styles.fSub}>
              {isAr ? 'خصومات لفترة محدودة لا تفوتها!' : "Limited-time discounts — don't miss out!"}
            </p>
            <div className={styles.timer} aria-live="polite">
              <span className={styles.timerCell}>{pad(clock.h)}</span>
              <span className={styles.timerSep}>:</span>
              <span className={styles.timerCell}>{pad(clock.m)}</span>
              <span className={styles.timerSep}>:</span>
              <span className={styles.timerCell}>{pad(clock.s)}</span>
            </div>
          </Link>

          {/* AUCTIONS — cream */}
          <Link href={`/${locale}/pages/auction`} className={`${styles.fCard} ${styles.fAuction}`} prefetch={false}>
            <span className={styles.fHammerBig} aria-hidden>
              🔨
            </span>
            <span className={styles.fHead}>
              <span className={`${styles.fHeadIcon} ${styles.fHeadIconHammer}`} aria-hidden>
                🔨
              </span>
              <span className={styles.fHeadTitle}>{isAr ? 'مزادات' : 'Auctions'}</span>
            </span>
            <p className={styles.fSub}>
              {isAr ? 'شارك في المزادات واربح' : 'Join auctions and win'}
            </p>
            <span className={styles.auctionCta}>{isAr ? 'استكشف المزادات' : 'Explore auctions'}</span>
          </Link>
        </div>

        {/* SMART ADS — green, full-width banner */}
        <Link href={`/${locale}`} className={`${styles.fCard} ${styles.fSmart} ${styles.fSmartWide}`} prefetch={false}>
          <div className={styles.smartWideInner}>
            <div className={styles.smartWideCopy}>
              <span className={styles.fHead}>
                <span className={styles.fHeadTitle}>{isAr ? 'إعلانات ذكي' : 'Smart ads'}</span>
              </span>
              <p className={styles.fSub}>
                {isAr ? 'أنشئ إعلانك بمساعدة AI' : 'Create your ad with AI'}
              </p>
            </div>
            <span className={styles.smartIconWrap} aria-hidden>
              <SmartAdsAiIcon className={styles.smartSvg} />
            </span>
          </div>
        </Link>
      </div>
    </motion.section>
  )
}

export default MobileAiPromoGrid
