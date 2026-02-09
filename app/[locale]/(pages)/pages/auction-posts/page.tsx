
import type { Metadata } from 'next'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'
import styles from './auction-posts.module.css'
import AuctionPostsExperience from './components/AuctionPostsExperience'

export const metadata: Metadata = { title: 'Auctions' }
const AuctionPsts = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) => {
  const { locale: localeRaw } = await params
  const locale: SupportedLocale = isSupportedLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className="container py-4 py-md-5  mt-5">
          <AuctionPostsExperience locale={locale} />
        </div>
      </div>
    </div>
  )
}

export default AuctionPsts
