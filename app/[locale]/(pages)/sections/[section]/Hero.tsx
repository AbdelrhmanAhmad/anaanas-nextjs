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
import { Autoplay } from 'swiper/modules'
import FollowToggleButton from '@/components/follows/FollowToggleButton'
import styles from './Hero.module.css'
import 'swiper/css'

const Hero = () => {
  const params = useParams<{ locale?: string }>()
  const localeParam = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
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
        <Row className="position-relative">
          <Col xl={12} lg={12} className="mx-auto">
            <Swiper
              modules={[Autoplay]}
              className={styles.categoriesSwiper}
              slidesPerView={2.35}
              spaceBetween={12}
              speed={650}
              loop={categories.length > 5}
              autoplay={{
                delay: 2100,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                576: { slidesPerView: 3.1, spaceBetween: 14 },
                768: { slidesPerView: 4.1, spaceBetween: 14 },
                992: { slidesPerView: 5.1, spaceBetween: 16 },
                1200: { slidesPerView: 6.2, spaceBetween: 16 },
              }}
            >
              {categories.map((category, index) => {
                const src = categoryIconSrc(category.icon)
                return (
                  <SwiperSlide key={category.id} className={styles.slideItem}>
                    <motion.div
                      role="listitem"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.04, 0.4), type: 'spring', stiffness: 380, damping: 28 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={localeParam ? `/${localeParam}/sections/${section.slug}/${category.slug}` : `sections/${section.slug}/${category.slug}`}
                        className={styles.categoryCard}
                      >
                        <div className={styles.categoryCardTop}>
                          {src ? (
                            <Image
                              className={styles.categoryIcon}
                              src={src}
                              alt=""
                              width={44}
                              height={44}
                              unoptimized
                            />
                          ) : (
                            <span className={styles.categoryFallback} aria-hidden="true">
                              🎨
                            </span>
                          )}
                        </div>
                        <span className={styles.categoryLabel}>{category.name}</span>
                      </Link>
                    </motion.div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </Col>
        </Row>
      </div>
    </div>
  )
}
export default Hero
