'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

import type { Section } from '@/lib/api/sections'
import { getApiUrl } from '@/lib/api/config'
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import type { SupportedLocale } from '@/lib/localization'
import styles from './MobileSectionsSwiper.module.css'

type MobileSectionsSwiperProps = {
  sections: Section[]
  locale: SupportedLocale
}

function sectionIconUrl(icon?: string | null) {
  if (!icon) return null
  if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('//')) {
    return resolveMediaUrl(icon)
  }
  const path = icon.startsWith('/') ? icon : `/${icon}`
  return resolveMediaUrl(getApiUrl(path))
}

/**
 * Stable per-section accent color. Picking by id (and not by index) keeps the
 * tint consistent if the section list is ever re-ordered.
 */
const ACCENTS: Array<{ from: string; to: string; ring: string }> = [
  { from: '#fff7da', to: '#ffe79e', ring: 'rgba(254, 203, 1, 0.32)' }, // amber
  { from: '#e8f1ff', to: '#cfe2ff', ring: 'rgba(59, 130, 246, 0.32)' }, // blue
  { from: '#eafff3', to: '#c8f5dc', ring: 'rgba(34, 197, 94, 0.32)' }, // green
  { from: '#ffe9ef', to: '#ffc6d4', ring: 'rgba(244, 63, 94, 0.32)' }, // rose
  { from: '#f4ecff', to: '#dec9ff', ring: 'rgba(147, 51, 234, 0.32)' }, // violet
  { from: '#e7faff', to: '#c4eefc', ring: 'rgba(14, 165, 233, 0.32)' }, // sky
  { from: '#fff1e6', to: '#ffd6b3', ring: 'rgba(249, 115, 22, 0.32)' }, // orange
]

function pickAccent(seed: number) {
  const i = ((seed % ACCENTS.length) + ACCENTS.length) % ACCENTS.length
  return ACCENTS[i]
}

const MobileSectionsSwiper = ({ sections, locale }: MobileSectionsSwiperProps) => {
  if (!sections.length) return null

  return (
    <div className={styles.wrapper}>
      <Swiper
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        modules={[FreeMode, Mousewheel]}
        className={styles.swiper}
        /* Breakpoints react to the swiper's container width, not the window —
           the swiper lives inside a narrow Bootstrap column on this page. */
        breakpointsBase="container"
        slidesPerView={2.5}
        spaceBetween={10}
        breakpoints={{
          320: { slidesPerView: 3, spaceBetween: 10 },
          420: { slidesPerView: 3.5, spaceBetween: 10 },
          520: { slidesPerView: 4, spaceBetween: 12 },
          640: { slidesPerView: 5, spaceBetween: 12 },
          780: { slidesPerView: 6, spaceBetween: 14 },
          920: { slidesPerView: 7, spaceBetween: 14 },
        }}
        observer
        observeParents
        resizeObserver
        freeMode={{ enabled: true, momentum: true, momentumRatio: 0.6 }}
        mousewheel={{ forceToAxis: true, sensitivity: 0.6 }}
        grabCursor
      >
        {sections.map((section, index) => {
          const iconSrc = sectionIconUrl(section.icon)
          const accent = pickAccent(section.id)
          const initial = (section.name || '?').trim().charAt(0).toUpperCase()

          return (
            <SwiperSlide key={section.id} className={styles.slide}>
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: Math.min(index * 0.035, 0.3),
                  type: 'spring',
                  stiffness: 380,
                  damping: 28,
                }}
                whileTap={{ scale: 0.96 }}
                className={styles.cardWrap}
              >
                <Link
                  href={`/${locale}/sections/${section.slug}`}
                  className={styles.card}
                  aria-label={section.name}
                >
                  <div
                    className={styles.iconBubble}
                    style={
                      {
                        '--accent-from': accent.from,
                        '--accent-to': accent.to,
                        '--accent-ring': accent.ring,
                      } as React.CSSProperties
                    }
                  >
                    {iconSrc ? (
                      <Image
                        src={iconSrc}
                        alt=""
                        width={64}
                        height={64}
                        unoptimized
                        className={styles.iconImg}
                      />
                    ) : (
                      <span className={styles.iconFallback} aria-hidden>
                        {initial}
                      </span>
                    )}
                    <span className={styles.iconShine} aria-hidden />
                  </div>

                  <span className={styles.label}>{section.name}</span>
                </Link>
              </motion.div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default MobileSectionsSwiper
