import Link from 'next/link'
import { HiOutlineHome } from 'react-icons/hi2'
import { t, type SupportedLocale } from '@/lib/translations'
import styles from './PostNotFoundBlock.module.css'

type Props = {
  locale: SupportedLocale
  postId?: string
}

export default function PostNotFoundBlock({ locale, postId }: Props) {
  const homeHref = `/${locale}`

  return (
    <section className={styles.wrap} aria-labelledby="post-not-found-title">
      <span className={styles.badge}>
        <span aria-hidden>⚠</span> {t('notFound.badge', locale)}
      </span>
      <p className={styles.code} aria-hidden>
        404
      </p>
      <h1 id="post-not-found-title" className={styles.title}>
        {t('post.notFound.title', locale)}
      </h1>
      <p className={styles.lead}>
        {postId
          ? t('post.notFound.leadWithId', locale, { id: postId })
          : t('post.notFound.lead', locale)}
      </p>
      <Link href={homeHref} className={styles.homeBtn}>
        <HiOutlineHome size={18} aria-hidden />
        {t('notFound.backHome', locale)}
      </Link>
    </section>
  )
}
