'use client'

import { Col, Row } from 'react-bootstrap'
import backgroundImg7 from '@/assets/images/bg/07.jpg'
import Link from 'next/link'
import Image from 'next/image'
import { useSectionContext } from '@/context/SectionContext'
import { API_BASE_URL } from '@/lib/api/config'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import styles from './Hero.module.css'
import 'swiper/css'

const Hero = () => {
  const { section, categories } = useSectionContext()
  const sectionImage = section.image?.trim()
  const heroImage = sectionImage
    ? sectionImage.startsWith('http')
      ? sectionImage
      : `${API_BASE_URL}${sectionImage.startsWith('/') ? sectionImage : `/${sectionImage}`}`
    : backgroundImg7.src

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
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <div className={styles.ringsSection}>
        <Row className="position-relative">
          <Col xl={12} lg={12} className="mx-auto">
            <Swiper
              modules={[Autoplay]}
              className={styles.ringsSwiper}
              slidesPerView={2.35}
              spaceBetween={14}
              loop={categories.length > 4}
              speed={650}
              autoplay={{
                delay: 1800,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                576: { slidesPerView: 3.2, spaceBetween: 16 },
                768: { slidesPerView: 4.2, spaceBetween: 18 },
                992: { slidesPerView: 5.4, spaceBetween: 20 },
              }}
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id}>
                  <Link href={section.slug + '/' + category.slug} className={styles.ringCard}>
                    <div className={styles.ringOuter}>
                      <div className={styles.ringInner}>
                        {category.icon ? (
                          <Image
                            className={styles.ringIcon}
                            src={category.icon}
                            alt={category.name}
                            width={42}
                            height={42}
                            unoptimized
                          />
                        ) : (
                          <span className={styles.ringFallback} aria-hidden="true">
                            🎨
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={styles.ringLabel}>{category.name}</span>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </div>
    </div>
  )
}
export default Hero
