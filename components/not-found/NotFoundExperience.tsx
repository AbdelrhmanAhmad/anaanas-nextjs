'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import { HiOutlineHome } from 'react-icons/hi2'
import { motion, useReducedMotion } from 'motion/react'

import { currentYear } from '@/context/constants'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import { t, type SupportedLocale } from '@/lib/translations'

import styles from './NotFoundExperience.module.css'

function localeFromPathname(pathname: string | null): SupportedLocale {
  const first = pathname?.split('/').filter(Boolean)[0]
  if (isSupportedLocale(first)) return first
  return DEFAULT_LOCALE
}

/** Short error-style alert using Web Audio (no asset files). */
function playErrorAlert() {
  try {
    const AC =
      typeof window !== 'undefined' &&
      (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
    if (!AC) return
    const ctx = new AC()
    const t0 = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.14, t0)
    master.connect(ctx.destination)

    const beep = (freq: number, start: number, duration: number, type: OscillatorType = 'square') => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, t0 + start)
      g.gain.setValueAtTime(0.001, t0 + start)
      g.gain.exponentialRampToValueAtTime(0.35, t0 + start + 0.015)
      g.gain.exponentialRampToValueAtTime(0.001, t0 + start + duration)
      osc.connect(g)
      g.connect(master)
      osc.start(t0 + start)
      osc.stop(t0 + start + duration + 0.02)
    }

    beep(780, 0, 0.09)
    beep(520, 0.08, 0.11)
    beep(330, 0.18, 0.16)
    beep(220, 0.32, 0.22, 'triangle')

    ctx.resume().catch(() => {})
  } catch {
    /* autoplay or API blocked */
  }
}

const floatingOrbVariants = {
  animate: (i: number) => ({
    y: [0, -18, 0],
    x: [0, i % 2 === 0 ? 12 : -12, 0],
    scale: [1, 1.06, 1],
    transition: {
      duration: 5 + i * 0.4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: i * 0.35,
    },
  }),
}

export default function NotFoundExperience() {
  const pathname = usePathname()
  const locale = useMemo(() => localeFromPathname(pathname), [pathname])
  const reduceMotion = useReducedMotion()
  const playedRef = useRef(false)

  useEffect(() => {
    if (reduceMotion || playedRef.current) return
    playedRef.current = true
    const id = window.setTimeout(() => playErrorAlert(), 280)
    return () => window.clearTimeout(id)
  }, [reduceMotion])

  const spinSlow = reduceMotion
    ? {}
    : {
        rotate: 360,
        transition: { duration: 48, repeat: Infinity, ease: 'linear' as const },
      }

  const spinMed = reduceMotion
    ? {}
    : {
        rotate: -360,
        transition: { duration: 32, repeat: Infinity, ease: 'linear' as const },
      }

  const gradientShift = reduceMotion
    ? {}
    : {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        transition: { duration: 14, repeat: Infinity, ease: 'easeInOut' as const },
      }

  const shimmer404 = reduceMotion
    ? {}
    : {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        transition: { duration: 8, repeat: Infinity, ease: 'linear' as const },
      }

  const particlePositions = [
    { left: '12%', top: '22%' },
    { left: '78%', top: '18%' },
    { left: '88%', top: '62%' },
    { left: '8%', top: '58%' },
    { left: '48%', top: '8%' },
    { left: '62%', top: '78%' },
  ]

  return (
    <main className={styles.wrap} lang={locale}>
      <motion.div className={styles.bgMesh} aria-hidden animate={gradientShift} style={{ backgroundSize: '200% 200%' }} />
      <div className={styles.gridOverlay} aria-hidden />

      <div className={styles.main}>
        <div className={styles.inner}>
          <motion.div
            className={styles.visual}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {!reduceMotion &&
              particlePositions.map((pos, i) => (
                <motion.span
                  key={i}
                  className={styles.particle}
                  style={{ left: pos.left, top: pos.top }}
                  animate={{
                    opacity: [0.25, 0.85, 0.25],
                    scale: [0.85, 1.15, 0.85],
                  }}
                  transition={{
                    duration: 3.2 + i * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.25,
                  }}
                />
              ))}

            <motion.div
              className={`${styles.ring} ${styles.ringGlow}`}
              style={{ width: 'min(72vw, 260px)', height: 'min(72vw, 260px)' }}
              animate={spinSlow}
            />
            <motion.div
              className={styles.ring}
              style={{
                width: 'min(56vw, 200px)',
                height: 'min(56vw, 200px)',
                borderColor: 'rgba(233, 30, 99, 0.28)',
              }}
              animate={spinMed}
            />
            <motion.div
              style={{
                position: 'absolute',
                width: 'min(42vw, 150px)',
                height: 'min(42vw, 150px)',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 35% 35%, rgba(255,213,79,0.55), rgba(255,193,7,0.22) 52%, transparent 72%)',
                filter: 'blur(1px)',
              }}
              custom={0}
              variants={floatingOrbVariants}
              animate="animate"
            />
            <motion.div
              style={{
                position: 'absolute',
                width: 'min(28vw, 100px)',
                height: 'min(28vw, 100px)',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 40%, rgba(76,175,80,0.5), transparent 68%)',
              }}
              custom={1}
              variants={floatingOrbVariants}
              animate="animate"
            />
          </motion.div>

          <motion.div
            className={styles.contentCard}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.08 }}
          >
            <motion.span
              className={styles.badgeLost}
              animate={reduceMotion ? undefined : { opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span aria-hidden>⚠</span> {t('notFound.badge', locale)}
            </motion.span>

            <motion.h1
              className={styles.code404}
              animate={shimmer404}
              style={{ backgroundSize: reduceMotion ? undefined : '200% 200%' }}
            >
              404
            </motion.h1>

            <motion.h2 className={styles.title}>{t('notFound.title', locale)}</motion.h2>
            <p className={styles.lead}>{t('notFound.lead', locale)}</p>

            <div className={styles.actions}>
              <motion.div whileHover={reduceMotion ? undefined : { scale: 1.03 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                <Link href={`/${locale}`} className={styles.btnHome} prefetch={false}>
                  <HiOutlineHome size={20} aria-hidden />
                  {t('notFound.backHome', locale)}
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <p className={styles.footerNote}>
            {t('notFound.siteName', locale)} · {currentYear}
          </p>
        </div>
      </div>
    </main>
  )
}
