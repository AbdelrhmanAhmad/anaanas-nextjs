'use client'

import Image from 'next/image'
import glightbox from 'glightbox'
import { useEffect, useId } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'glightbox/dist/css/glightbox.min.css'

const normalizeImageUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('/')) {
    return url
  }
  return `/${url}`
}

export default function PostImagesGallery({
  images,
  title,
  isRtl = false,
}: {
  images: Array<{ url: string; alt?: string }>
  title?: string
  isRtl?: boolean
}) {
  if (!Array.isArray(images) || images.length === 0) return null
  const galleryId = useId().replace(/:/g, '-')

  useEffect(() => {
    if (typeof window === 'undefined') return
    let instance: any = null
    try {
      instance = glightbox({
        selector: `[data-glightbox-gallery="${galleryId}"]`,
        openEffect: 'fade',
        closeEffect: 'fade',
      })
    } catch (e) {
      console.error('Failed to init glightbox', e)
    }
    return () => {
      try {
        instance?.destroy?.()
      } catch {
        // ignore
      }
    }
  }, [galleryId])

  if (images.length === 1) {
    const img = images[0]
    const src = normalizeImageUrl(img.url)
    return (
      <a
        href={src}
        className="glightbox"
        data-glightbox-gallery={galleryId}
        data-gallery="post-images"
      >
        <Image unoptimized className="card-img rounded" src={src} alt={img.alt ?? title ?? 'post image'} width={1400} height={900} />
      </a>
    )
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="post-images-swiper">
      <Swiper
        modules={[Navigation, Pagination, Keyboard]}
        navigation
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        spaceBetween={12}
        slidesPerView={1}
        loop={images.length > 1}
      >
        {images.map((img, idx) => {
          const src = normalizeImageUrl(img.url)
          return (
            <SwiperSlide key={`${img.url}-${idx}`}>
              <a
                href={src}
                className="glightbox"
                data-glightbox-gallery={galleryId}
                data-gallery="post-images"
              >
                <Image unoptimized className="card-img rounded" src={src} alt={img.alt ?? title ?? 'post image'} width={1400} height={900} />
              </a>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}


