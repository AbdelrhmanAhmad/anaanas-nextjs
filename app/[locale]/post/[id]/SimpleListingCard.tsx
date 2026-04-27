'use client'

import Image from 'next/image'
import Link from 'next/link'
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import type { SupportedLocale } from '@/lib/localization'
import styles from './SimpleListingCard.module.css'

export type SimpleListing = {
  id: number | string
  title?: string
  price?: number | string | null
  city?: { name?: string | { ar?: string; en?: string } } | null
  category?: { name?: string | { ar?: string; en?: string } } | null
  post_images?: Array<{ image_full_url?: string; image?: string }>
  main_image?: string | null
}

export default function SimpleListingCard({ post, locale }: { post: SimpleListing; locale: SupportedLocale }) {
  const img =
    resolveMediaUrl(post?.post_images?.[0]?.image_full_url || post?.post_images?.[0]?.image) ||
    resolveMediaUrl(post?.main_image || '') ||
    ''

  const href = `/${locale}/post/${post.id}`
  const cityName =
    typeof post?.city?.name === 'string'
      ? post.city.name
      : locale === 'ar'
        ? post?.city?.name?.ar || post?.city?.name?.en || ''
        : post?.city?.name?.en || post?.city?.name?.ar || ''
  const categoryName =
    typeof post?.category?.name === 'string'
      ? post.category.name
      : locale === 'ar'
        ? post?.category?.name?.ar || post?.category?.name?.en || ''
        : post?.category?.name?.en || post?.category?.name?.ar || ''

  const cta = locale === 'ar' ? 'عرض التفاصيل' : 'View details'
  const arrow = locale === 'ar' ? '←' : '→'

  return (
    <Link href={href} className={styles.card}>
      <div className={styles.thumb}>
        {img ? (
          <Image src={img} alt="" fill className={styles.img} sizes="(max-width: 576px) 46vw, 220px" unoptimized />
        ) : (
          <span className={styles.placeholder} aria-hidden>
            📷
          </span>
        )}
        {post.price != null && post.price !== '' ? (
          <span className={styles.priceBadge}>{String(post.price)}</span>
        ) : null}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{post.title || `#${post.id}`}</h3>
        <div className={styles.meta}>
          {categoryName ? <span className={styles.chip}>{categoryName}</span> : null}
          {cityName ? <span className={styles.chipAccent}>{cityName}</span> : null}
        </div>
        <div className={styles.cta}>
          <span>{cta}</span>
          <span className={styles.ctaIcon} aria-hidden>
            {arrow}
          </span>
        </div>
      </div>
    </Link>
  )
}
