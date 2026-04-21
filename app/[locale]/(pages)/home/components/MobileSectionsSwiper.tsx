'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Grid } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/grid'

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

const MobileSectionsSwiper = ({ sections, locale }: MobileSectionsSwiperProps) => {
  if (!sections.length) return null

  return (
    <div className={styles.wrapper}>
      <Swiper
        modules={[Grid, Autoplay]}
        className={styles.swiper}
        slidesPerView={2.2}
        spaceBetween={10}
        grid={{ rows: 2, fill: 'row' }}
        speed={650}
        loop={sections.length > 6}
        autoplay={{
          delay: 2200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          420: { slidesPerView: 2.6, spaceBetween: 12, grid: { rows: 2, fill: 'row' } },
          576: { slidesPerView: 3.2, spaceBetween: 12, grid: { rows: 2, fill: 'row' } },
          768: { slidesPerView: 4.2, spaceBetween: 14, grid: { rows: 2, fill: 'row' } },
          992: { slidesPerView: 4.8, spaceBetween: 14, grid: { rows: 2, fill: 'row' } },
          1200: { slidesPerView: 5.8, spaceBetween: 16, grid: { rows: 2, fill: 'row' } },
        }}
      >
        {sections.map((section, index) => {
          const iconSrc = sectionIconUrl(section.icon)
          return (
            <SwiperSlide key={section.id} className={styles.slide}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(index * 0.03, 0.35),
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={`/${locale}/sections/${section.slug}`} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.iconWrap}>
                      {iconSrc ? (
                        <Image src={iconSrc} alt="" width={34} height={34} unoptimized />
                      ) : (
                        <span className={styles.fallback} aria-hidden="true">
                          ✨
                        </span>
                      )}
                    </span>
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
