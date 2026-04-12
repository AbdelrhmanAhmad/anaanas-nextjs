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
  post_images?: Array<{ image_full_url?: string; image?: string }>
  main_image?: string | null
}

export default function SimpleListingCard({ post, locale }: { post: SimpleListing; locale: SupportedLocale }) {
  const img =
    resolveMediaUrl(post?.post_images?.[0]?.image_full_url || post?.post_images?.[0]?.image) ||
    resolveMediaUrl(post?.main_image || '') ||
    ''

  const href = `/${locale}/post/${post.id}`

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
      </div>
      <div className={styles.simpleBody}>
        <div className={styles.simpleTitle}>{post.title || `#${post.id}`}</div>
        {post.price != null && post.price !== '' && (
          <div className={styles.simplePrice}>{String(post.price)}</div>
        )}
      </div>
    </Link>
  )
}
