'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Grid, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/grid'

import type { Section } from '@/lib/api/sections'
import { API_BASE_URL } from '@/lib/api/config'
import type { SupportedLocale } from '@/lib/localization'
import styles from './MobileSectionsSwiper.module.css'

type MobileSectionsSwiperProps = {
  sections: Section[]
  locale: SupportedLocale
}

const normalizeIconUrl = (icon?: string | null) => {
  if (!icon) return null
  if (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('//') || icon.startsWith('/')) {
    return icon
  }
  return `${API_BASE_URL}/${icon}`
}

const MobileSectionsSwiper = ({ sections, locale }: MobileSectionsSwiperProps) => {
  if (!sections.length) return null

  return (
    <div className={styles.wrapper}>
      <Swiper
        modules={[Grid, Autoplay]}
        className={styles.swiper}
        slidesPerView={1.2}
        spaceBetween={12}
        grid={{ rows: 2, fill: 'row' }}
        speed={550}
        autoplay={{
          delay: 2300,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
      >
        {sections.map((section) => {
          const iconSrc = normalizeIconUrl(section.icon)
          return (
            <SwiperSlide key={section.id} className={styles.slide}>
              <Link href={`/${locale}/${section.slug}`} className={styles.card}>
                <span className={styles.iconWrap}>
                  {iconSrc ? (
                    <Image src={iconSrc} alt={section.name} width={34} height={34} unoptimized />
                  ) : (
                    <span className={styles.fallback} aria-hidden="true">
                      ✨
                    </span>
                  )}
                </span>
                <span className={styles.label}>{section.name}</span>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default MobileSectionsSwiper
