'use client'

import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'

import styles from './MobileAIDashboard.module.css'

type MobileAIDashboardProps = {
  locale: 'ar' | 'en'
  className?: string
}

function IconForecast({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 18V6M8 14v-5M12 16V9M16 11V7M20 15v-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M4 18h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.35}
      />
      <path d="M17 6l2-2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBoost({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 3s3 5 3 10c0 2-.5 4-1 5l-2-2h-3l-2 2c-.5-1-1-3-1-5 0-5 3-10 3-10"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.1}
      />
      <path d="M12 11v6M10 15h4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <path d="M11 7h2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" opacity={0.5} />
    </svg>
  )
}

function IconLive({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.08}
      />
      <circle cx="12" cy="11" r="2.25" fill="currentColor" />
    </svg>
  )
}

function IconAudience({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 19c0-2.2 1.8-4 4-4h2M13 19c0-1.7 1.3-3 3-3h1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 14v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={0.45} />
    </svg>
  )
}

function IconOptimize({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity={0.45}
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.65" fill="currentColor" fillOpacity={0.1} />
      <path d="M12 10v4l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity={0.06}
      />
      <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const MobileAIDashboard = ({ locale, className }: MobileAIDashboardProps) => {
  const isAr = locale === 'ar'
  const prefersReducedMotion = useReducedMotion() === true

  const headerVariants = useMemo<Variants>(
    () =>
      prefersReducedMotion
        ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
        : {
            hidden: { opacity: 0, y: -10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
            },
          },
    [prefersReducedMotion],
  )

  const listVariants = useMemo<Variants>(
    () =>
      prefersReducedMotion
        ? { hidden: {}, visible: {} }
        : {
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.072, delayChildren: 0.06 },
            },
          },
    [prefersReducedMotion],
  )

  const itemVariants = useMemo<Variants>(
    () =>
      prefersReducedMotion
        ? {
            hidden: { opacity: 1, y: 0, scale: 1 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }
        : {
            hidden: { opacity: 0, y: 18, scale: 0.94 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
            },
          },
    [prefersReducedMotion],
  )

  const cards = [
    {
      id: 'forecast',
      Icon: IconForecast,
      title: isAr ? 'توقعات الذكاء' : 'AI forecast',
      subtitle: isAr ? '+33% عائد مرتفع' : '+33% high ROI',
      tone: styles.toneBlue,
    },
    {
      id: 'boost',
      Icon: IconBoost,
      title: isAr ? 'تعزيز ذكي' : 'Smart boost',
      subtitle: isAr ? '14 حملة نشطة' : '14 campaigns live',
      tone: styles.toneGold,
    },
    {
      id: 'live',
      Icon: IconLive,
      title: isAr ? 'مزاد مباشر' : 'Live bidding',
      subtitle: isAr ? '82 عرضًا نشطًا' : '82 active bids',
      tone: styles.toneCoral,
    },
    {
      id: 'audience',
      Icon: IconAudience,
      title: isAr ? 'مطابقة الجمهور' : 'Audience match',
      subtitle: isAr ? '91% تطابق ممتاز' : '91% excellent fit',
      tone: styles.toneGreen,
    },
    {
      id: 'optimize',
      Icon: IconOptimize,
      title: isAr ? 'تحسين تلقائي' : 'Auto optimization',
      subtitle: isAr ? 'قيد التشغيل' : 'Running now',
      tone: styles.toneTeal,
    },
    {
      id: 'shield',
      Icon: IconShield,
      title: isAr ? 'درع موثوق' : 'Verified shield',
      subtitle: isAr ? 'موثق بالكامل' : 'Fully verified',
      tone: styles.tonePurple,
    },
  ]

  return (
    <motion.section
      className={`${styles.root} ${className ?? ''}`.trim()}
      dir={isAr ? 'rtl' : 'ltr'}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      aria-label={isAr ? 'لوحة الذكاء الاصطناعي' : 'AI dashboard'}
    >
      <div className={styles.mesh} aria-hidden />

      <div className={styles.inner}>
        <motion.header
          className={styles.head}
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className={styles.headline}>
            <span className={styles.kicker}>{isAr ? 'مركز القرار' : 'Insight hub'}</span>
            <span className={styles.title}>{isAr ? 'لوحة الذكاء الاصطناعي' : 'AI dashboard'}</span>
          </h2>
          <div className={styles.liveBadge}>
            <span className={styles.liveDot} aria-hidden />
            <span>{isAr ? 'مباشر' : 'Live'}</span>
          </div>
        </motion.header>

        <motion.ul
          className={styles.grid}
          role="list"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((item, index) => {
            const Icon = item.Icon
            return (
              <motion.li
                key={item.id}
                className={styles.cell}
                style={{ '--i': index } as CSSProperties}
                variants={itemVariants}
              >
                <div className={styles.tileShell}>
                  <article className={`${styles.tile} ${item.tone}`} tabIndex={0}>
                    <span className={styles.tileShine} aria-hidden />
                    <span className={styles.tileOrb} aria-hidden />
                    <div className={styles.tileBody}>
                      <div className={styles.iconRail}>
                        <span className={styles.iconRing} aria-hidden />
                        <span className={styles.iconFloat}>
                          <Icon className={styles.iconSvg} />
                        </span>
                      </div>
                      <div className={styles.copy}>
                        <h3 className={styles.tileTitle}>{item.title}</h3>
                        <p className={styles.tileSub}>{item.subtitle}</p>
                      </div>
                    </div>
                  </article>
                </div>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </motion.section>
  )
}

export default MobileAIDashboard
