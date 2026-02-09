
import type { Metadata } from 'next'
import styles from './auction.module.css'
import AuctionExperience from './components/AuctionExperience'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'

export const metadata: Metadata = { title: 'Auctions' }

const Auction = async ({
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
        <div className="container py-4 py-md-5 mt-5">
          <AuctionExperience locale={locale} />
        </div>
      </div>
    </div>
  )
}

export default Auction
