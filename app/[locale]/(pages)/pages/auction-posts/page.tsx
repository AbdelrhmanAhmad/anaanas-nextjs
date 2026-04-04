
import type { Metadata } from 'next'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'
import styles from './auction-posts.module.css'
import AuctionPostsExperience from './components/AuctionPostsExperience'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeRaw } = await params
  const locale: SupportedLocale = isSupportedLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE
  const title = locale === 'ar' ? 'لوحة إدارة المزادات | ANANAS' : 'Auction Seller Dashboard | ANANAS'
  const description =
    locale === 'ar'
      ? 'أنشئ مزادك، عدّل بياناته، تابع العروض، وراجع الإحصائيات.'
      : 'Create auctions, edit details, monitor bids, and review statistics.'
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/pages/auction-posts` },
    openGraph: { title, description, type: 'website', url: `/${locale}/pages/auction-posts` },
    twitter: { card: 'summary_large_image', title, description },
  }
}
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
