'use client'

import GlightBox from '@/components/GlightBox'
import TinySlider from '@/components/TinySlider'
import Image from 'next/image'
import { renderToString } from 'react-dom/server'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import type { TinySliderSettings } from 'tiny-slider'

export default function PostImagesGallery({
  images,
  title,
}: {
  images: Array<{ url: string; alt?: string }>
  title?: string
}) {
  if (!Array.isArray(images) || images.length === 0) return null

  if (images.length === 1) {
    const img = images[0]
    return (
      <GlightBox href={img.url} data-gallery="post-images" data-glightbox="description: .post-desc; descPosition: bottom;">
        <Image unoptimized className="card-img rounded" src={img.url} alt={img.alt ?? title ?? 'post image'} width={1400} height={900} />
      </GlightBox>
    )
  }

  const settings: TinySliderSettings = {
    items: 1,
    nav: true,
    controls: true,
    arrowKeys: true,
    mouseDrag: true,
    gutter: 12,
    autoplay: false,
    autoplayButton: false,
    autoplayButtonOutput: false,
    controlsText: [renderToString(<FaChevronLeft size={16} />), renderToString(<FaChevronRight size={16} />)],
  }

  return (
    <div className="tiny-slider arrow-hover">
      <TinySlider settings={settings}>
        {images.map((img, idx) => (
          <div key={`${img.url}-${idx}`}>
            <GlightBox href={img.url} data-gallery="post-images" data-glightbox="description: .post-desc; descPosition: bottom;">
              <Image unoptimized className="card-img rounded" src={img.url} alt={img.alt ?? title ?? 'post image'} width={1400} height={900} />
            </GlightBox>
          </div>
        ))}
      </TinySlider>
    </div>
  )
}


