'use client'

import clsx from 'clsx'
import { motion, useReducedMotion } from 'motion/react'
import type { IconType } from 'react-icons'
import {
  BsCheckLg,
  BsFileEarmarkText,
  BsFolder2,
  BsGeoAlt,
  BsImages,
  BsSliders,
  BsTag,
} from 'react-icons/bs'
import styles from './CreatePostWizardUI.module.css'

const STEP_ICONS: IconType[] = [
  BsFileEarmarkText,
  BsImages,
  BsFolder2,
  BsTag,
  BsSliders,
  BsGeoAlt,
]

export type CreatePostWizardStepperProps = {
  currentStep: number
  stepLabels: string[]
  /** عنوان فرعي يظهر فوق الشريط (مثلاً اسم الخطوة الحالية) */
  activeStepTitle?: string
  subStep?: number
  subStepTotal?: number
  subStepPartLabel?: string
  dir?: 'rtl' | 'ltr'
}

export function CreatePostWizardStepper({
  currentStep,
  stepLabels,
  activeStepTitle,
  subStep = 1,
  subStepTotal = 1,
  subStepPartLabel,
  dir = 'rtl',
}: CreatePostWizardStepperProps) {
  const reduceMotion = useReducedMotion()
  const totalMain = 6
  const safeStep = Math.min(Math.max(currentStep, 1), totalMain)
  const labels = stepLabels.slice(0, totalMain)
  const progressPct = (safeStep / totalMain) * 100
  const showSub = safeStep === 5 && subStepTotal > 1
  const subProgress = subStepTotal > 0 ? (subStep / subStepTotal) * 100 : 0

  const currentLabel = labels[safeStep - 1] ?? ''

  return (
    <div className={styles.stepper} dir={dir}>
      <div className={styles.stepperMeta}>
        <span className={styles.stepperTitle}>
          {activeStepTitle ?? currentLabel}
        </span>
        <span className={styles.stepperCount}>
          {safeStep} / {totalMain}
        </span>
      </div>

      <div className={styles.track} aria-hidden>
        <motion.div
          className={styles.trackFill}
          initial={false}
          animate={{
            width: `${progressPct}%`,
            scaleY: 1,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 140, damping: 24, mass: 0.8 }
          }
        />
      </div>

      <div className={styles.nodes} role="list" aria-label="خطوات إنشاء الإعلان">
        {labels.map((label, i) => {
          const n = i + 1
          const state =
            n < safeStep ? 'done' : n === safeStep ? 'current' : 'upcoming'
          const Icon = STEP_ICONS[i] ?? BsFileEarmarkText
          return (
            <div
              key={n}
              className={clsx(styles.node, styles[`node_${state}`])}
              role="listitem"
            >
              <motion.span
                className={styles.nodeCircle}
                initial={false}
                animate={
                  reduceMotion
                    ? {}
                    : state === 'current'
                      ? { scale: 1.06 }
                      : { scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                {state === 'done' ? <BsCheckLg size={15} aria-hidden /> : <Icon aria-hidden />}
              </motion.span>
              <span className={styles.nodeLabel}>{label}</span>
            </div>
          )
        })}
      </div>

      {showSub && (
        <motion.div
          className={styles.subRail}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className={styles.subRailHead}>
            <span className={styles.subRailTitle}>
              {subStepPartLabel ?? `${subStep} / ${subStepTotal}`}
            </span>
          </div>
          <div className={styles.subTrack} aria-hidden>
            <motion.div
              className={styles.subTrackFill}
              initial={false}
              animate={{ width: `${subProgress}%` }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 120, damping: 22 }
              }
              style={{
                transformOrigin: dir === 'rtl' ? '100% 50%' : '0% 50%',
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}

export const wizardStepMotion = (reduceMotion: boolean | null) => ({
  initial: reduceMotion ? false : { opacity: 0, y: 14, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: reduceMotion ? undefined : { opacity: 0, y: -10, filter: 'blur(4px)' },
  transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const },
})
