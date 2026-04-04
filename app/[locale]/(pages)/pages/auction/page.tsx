
import type { Metadata } from 'next'
import styles from './auction.module.css'
import AuctionExperience from './components/AuctionExperience'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeRaw } = await params
  const locale: SupportedLocale = isSupportedLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE
  const title = locale === 'ar' ? 'سوق المزادات | ANANAS' : 'Auction Marketplace | ANANAS'
  const description =
    locale === 'ar'
      ? 'استعرض مزادات مباشرة، تابع العروض، وقدّم مزايدة لحظية على العناصر.'
      : 'Browse live auctions, track bids, and place real-time offers on items.'
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/pages/auction` },
    openGraph: { title, description, type: 'website', url: `/${locale}/pages/auction` },
    twitter: { card: 'summary_large_image', title, description },
  }
}

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
