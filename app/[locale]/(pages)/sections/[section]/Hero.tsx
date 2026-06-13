'use client'

import { Col, Row } from 'react-bootstrap'
import backgroundImg7 from '@/assets/images/bg/07.jpg'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useParams } from 'next/navigation'
import { useSectionContext } from '@/context/SectionContext'
import { API_BASE_URL } from '@/lib/api/config'
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import FollowToggleButton from '@/components/follows/FollowToggleButton'
import { t } from '@/lib/translations'
import styles from './Hero.module.css'
import 'swiper/css'
import 'swiper/css/free-mode'

/** Stable per-category accent — picking by id keeps the tint consistent if the list ever re-orders. */
const CATEGORY_ACCENTS: Array<{ from: string; to: string; ring: string }> = [
  { from: '#fff7da', to: '#ffe79e', ring: 'rgba(254, 203, 1, 0.32)' },
  { from: '#e8f1ff', to: '#cfe2ff', ring: 'rgba(59, 130, 246, 0.32)' },
  { from: '#eafff3', to: '#c8f5dc', ring: 'rgba(34, 197, 94, 0.32)' },
  { from: '#ffe9ef', to: '#ffc6d4', ring: 'rgba(244, 63, 94, 0.32)' },
  { from: '#f4ecff', to: '#dec9ff', ring: 'rgba(147, 51, 234, 0.32)' },
  { from: '#e7faff', to: '#c4eefc', ring: 'rgba(14, 165, 233, 0.32)' },
  { from: '#fff1e6', to: '#ffd6b3', ring: 'rgba(249, 115, 22, 0.32)' },
]

function pickAccent(seed: number) {
  const i = ((seed % CATEGORY_ACCENTS.length) + CATEGORY_ACCENTS.length) % CATEGORY_ACCENTS.length
  return CATEGORY_ACCENTS[i]
}

const Hero = () => {
  const params = useParams<{ locale?: string }>()
  const localeParam = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
  const isArabic = localeParam !== 'en'
  const { section, categories } = useSectionContext()
  const sectionImage = section.image?.trim()
  const heroImage = sectionImage
    ? sectionImage.startsWith('http')
      ? sectionImage
      : `${API_BASE_URL}${sectionImage.startsWith('/') ? sectionImage : `/${sectionImage}`}`
    : backgroundImg7.src

  function categoryIconSrc(icon?: string | null) {
    if (!icon) return null
    if (icon.startsWith('http') || icon.startsWith('//')) return resolveMediaUrl(icon)
    if (icon.startsWith('/')) return resolveMediaUrl(icon)
    return `https://eg.anaanas.com/content/uploads/${String(icon).replace(/^\//, '')}`
  }
  return (
    <div>
      <div className={styles.heroWrap}>
        <div
          className={styles.heroBanner}
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <Row className="position-relative w-100">
              <Col lg={9} className="mx-auto">
                <h1 className={styles.heroTitle}>{section.name}</h1>
                <div className="mt-3 d-flex justify-content-center">
                  <FollowToggleButton
                    target="section"
                    targetId={section.id}
                    locale={localeParam === 'en' ? 'en' : 'ar'}
                    variant="hero"
                    followLabel={localeParam === 'en' ? 'Follow section' : 'متابعة القسم'}
                    followingLabel={localeParam === 'en' ? 'Following' : 'تتابع القسم'}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className={styles.categoriesSection}>
        <h2 className="visually-hidden">{t('seo.section.categories', localeParam === 'en' ? 'en' : 'ar')}</h2>
        <Row className="position-relative g-0">
          <Col xs={12}>
            <div className={styles.categoriesWrapper}>
              <Swiper
                dir={isArabic ? 'rtl' : 'ltr'}
                modules={[FreeMode, Mousewheel]}
                className={styles.categoriesSwiper}
                /* Breakpoints react to the swiper's *own* width (not the window),
                   which is critical because the swiper sits inside a constrained
                   Bootstrap column. The trailing .5 hints at scrollable content. */
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
                {categories.map((category, index) => {
                  const src = categoryIconSrc(category.icon)
                  const accent = pickAccent(category.id)
                  const initial = (category.name || '?').trim().charAt(0).toUpperCase()
                  const href = localeParam
                    ? `/${localeParam}/sections/${section.slug}/${category.slug}`
                    : `sections/${section.slug}/${category.slug}`

                  return (
                    <SwiperSlide key={category.id} className={styles.slideItem}>
                      <motion.div
                        role="listitem"
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
                        <Link href={href} className={styles.categoryCard} aria-label={category.name}>
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
                            {src ? (
                              <Image
                                className={styles.categoryIcon}
                                src={src}
                                alt=""
                                width={64}
                                height={64}
                                unoptimized
                              />
                            ) : (
                              <span className={styles.iconFallback} aria-hidden>
                                {initial}
                              </span>
                            )}
                            <span className={styles.iconShine} aria-hidden />
                          </div>
                          <span className={styles.categoryLabel}>{category.name}</span>
                        </Link>
                      </motion.div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
export default Hero
