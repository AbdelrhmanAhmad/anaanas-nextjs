'use client'

import Image from 'next/image'
import Link from 'next/link'
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import type { SupportedLocale } from '@/lib/localization'
import styles from './postDetails.module.css'

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

  return (
    <Link href={href} className={styles.simpleCard}>
      <div className={styles.simpleThumb}>
        {img ? (
          <Image src={img} alt="" fill className={styles.simpleImg} sizes="(max-width: 576px) 45vw, 200px" unoptimized />
        ) : (
          <span className={styles.simplePlaceholder} aria-hidden>
            📷
          </span>
        )}
        {post.price != null && post.price !== '' && <span className={styles.simplePriceBadge}>{String(post.price)}</span>}
      </div>
      <div className={styles.simpleBody}>
        <div className={styles.simpleTitle}>{post.title || `#${post.id}`}</div>
        <div className={styles.simpleMeta}>
          {categoryName && <span className={styles.simpleChip}>{categoryName}</span>}
          {cityName && <span className={styles.simpleChip}>{cityName}</span>}
        </div>
        <div className={styles.simpleAction}>
          {locale === 'ar' ? 'عرض التفاصيل' : 'View details'}
          <span aria-hidden>{locale === 'ar' ? '←' : '→'}</span>
        </div>
      </div>
    </Link>
  )
}
