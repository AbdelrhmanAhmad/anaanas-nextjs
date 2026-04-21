'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { BsChevronLeft, BsChevronRight, BsTag } from 'react-icons/bs'

import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import { API_BASE_URL } from '@/lib/api/config'
import FollowToggleButton from '@/components/follows/FollowToggleButton'
import styles from './categoryHero.module.css'

type Locale = 'ar' | 'en'

type HeroCategory = {
  id: number
  name: string
  slug: string
  icon?: string | null
}

type Props = {
  locale: Locale
  section: {
    id: number
    name: string
    slug: string
    image?: string | null
  }
  category: HeroCategory
  categoriesInSection: HeroCategory[]
}

function resolveIcon(icon?: string | null) {
  if (!icon) return null
  if (icon.startsWith('http') || icon.startsWith('//')) return resolveMediaUrl(icon)
  if (icon.startsWith('/')) return resolveMediaUrl(icon)
  return `https://eg.anaanas.com/content/uploads/${String(icon).replace(/^\//, '')}`
}

function resolveSectionBg(image?: string | null) {
  if (!image) return null
  const v = image.trim()
  if (!v) return null
  if (v.startsWith('http')) return v
  return `${API_BASE_URL}${v.startsWith('/') ? v : `/${v}`}`
}

export default function CategoryHero({ locale, section, category, categoriesInSection }: Props) {
  const Arrow = locale === 'ar' ? BsChevronLeft : BsChevronRight
  const bg = resolveSectionBg(section.image)
  const iconSrc = resolveIcon(category.icon)

  const otherCategories = categoriesInSection.filter((c) => c.id !== category.id).slice(0, 10)

  return (
    <motion.div
      className={styles.hero}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
    >
      <div
        className={styles.heroBg}
        style={bg ? { backgroundImage: `url(${bg})` } : undefined}
        aria-hidden="true"
      />
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={styles.heroAccent} aria-hidden="true" />

      <div className={styles.heroContent}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link href={`/${locale}`} className={styles.crumbLink}>
            {locale === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <Arrow className={styles.crumbSep} aria-hidden="true" />
          <Link href={`/${locale}/sections/${section.slug}`} className={styles.crumbLink}>
            {section.name}
          </Link>
          <Arrow className={styles.crumbSep} aria-hidden="true" />
          <span className={styles.crumbCurrent}>{category.name}</span>
        </nav>

        <div className={styles.titleRow}>
          <motion.div
            className={styles.iconCircle}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.08 }}
          >
            {iconSrc ? (
              <Image src={iconSrc} alt="" width={44} height={44} className={styles.iconImg} unoptimized />
            ) : (
              <BsTag className={styles.iconFallback} aria-hidden="true" />
            )}
          </motion.div>
          <div className={styles.titleStack}>
            <motion.span
              className={styles.sectionKicker}
              initial={{ opacity: 0, x: locale === 'ar' ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {section.name}
            </motion.span>
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
            >
              {category.name}
            </motion.h1>
          </div>
          <div className={styles.followSlot}>
            <FollowToggleButton
              target="category"
              targetId={category.id}
              locale={locale}
              variant="hero"
              followLabel={locale === 'ar' ? 'متابعة الفئة' : 'Follow category'}
              followingLabel={locale === 'ar' ? 'تتابع الفئة' : 'Following'}
            />
          </div>
        </div>

        {otherCategories.length > 0 && (
          <motion.div
            className={styles.chipsRow}
            role="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.35 }}
          >
            <span className={styles.chipsKicker}>
              {locale === 'ar' ? 'فئات أخرى في ' : 'Other in '}
              {section.name}
            </span>
            <div className={styles.chipsList}>
              {otherCategories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  role="listitem"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + Math.min(i * 0.03, 0.3) }}
                >
                  <Link href={`/${locale}/sections/${section.slug}/${cat.slug}`} className={styles.chip}>
                    {cat.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
