import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getApiUrl } from '@/lib/api/config'
import AuctionDetailActions from './AuctionDetailActions'
import styles from './page.module.css'

async function fetchAuction(postId: string, locale: string) {
  const res = await fetch(getApiUrl(`/api/auctions/${postId}?land=${locale}`), { cache: 'no-store' })
  if (!res.ok) return null
  const json = await res.json().catch(() => null)
  return json?.data ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const lot = await fetchAuction(id, locale)
  const title = lot?.post?.title
    ? `${lot.post.title} | ANANAS Auction`
    : locale === 'ar'
      ? 'تفاصيل المزاد | ANANAS'
      : 'Auction details | ANANAS'
  const description =
    lot?.post?.description?.slice?.(0, 160) ||
    (locale === 'ar' ? 'صفحة تفاصيل مزاد احترافية مع العروض الحالية والمزايدة.' : 'Professional auction detail with current bids and actions.')
  const canonical = `/${locale}/pages/auction/${id}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'article', url: canonical },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function AuctionDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const lot = await fetchAuction(id, locale)
  if (!lot) notFound()

  const images: Array<{ url: string }> = Array.isArray(lot?.post?.post_images)
    ? lot.post.post_images
        .map((img: any) => ({ url: img?.image_full_url || img?.image }))
        .filter((x: any) => Boolean(x.url))
    : []

  const recentBids = Array.isArray(lot?.bids) ? lot.bids.slice(0, 20) : []

  return (
    <main className={styles.page}>
      <div className="container py-4 py-md-5 mt-4">
        <div className={styles.hero}>
          <div className="row g-3 align-items-center">
            <div className="col-lg-8">
              <h1 className={styles.title}>{lot?.post?.title}</h1>
              <p className="mb-2 text-white">{lot?.post?.description || (locale === 'ar' ? 'لا يوجد وصف' : 'No description')}</p>
              <AuctionDetailActions
                locale={locale}
                postId={Number(lot?.post_id || id)}
                currentPrice={Number(lot?.current_price ?? 0)}
                minIncrement={Number(lot?.min_increment ?? 1)}
                watchedByMe={Boolean(lot?.watched_by_me)}
              />
            </div>
            <div className="col-lg-4">
              <div className={styles.price}>${Number(lot?.current_price ?? 0).toLocaleString()}</div>
              <div className="text-white">{locale === 'ar' ? 'السعر الحالي' : 'Current price'}</div>
            </div>
          </div>
        </div>

        {images.length > 0 ? (
          <div className={styles.gallery}>
            <div className={styles.galleryMain}>
              <Image src={images[0].url} alt={lot?.post?.title || 'Auction'} width={960} height={560} className="w-100 h-100 object-fit-cover" unoptimized />
            </div>
            <div className={styles.gallerySide}>
              {images.slice(1, 3).map((img, i) => (
                <div className={styles.thumb} key={i}>
                  <Image src={img.url} alt={`${lot?.post?.title || 'Auction'}-${i}`} width={420} height={240} className="w-100 h-100 object-fit-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className={styles.metrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>{locale === 'ar' ? 'عدد العروض' : 'Bids'}</div>
            <div className={styles.metricValue}>{lot?.bids_count ?? 0}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>{locale === 'ar' ? 'المتابعون' : 'Watchers'}</div>
            <div className={styles.metricValue}>{lot?.watchers_count ?? 0}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>{locale === 'ar' ? 'الحد الأدنى للزيادة' : 'Min increment'}</div>
            <div className={styles.metricValue}>${Number(lot?.min_increment ?? 1).toLocaleString()}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>{locale === 'ar' ? 'الحالة' : 'Status'}</div>
            <div className={styles.metricValue}>{lot?.status || '-'}</div>
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3">{locale === 'ar' ? 'آخر المزايدات' : 'Recent bids'}</h5>
                {recentBids.length === 0 ? (
                  <div className="text-muted">{locale === 'ar' ? 'لا توجد مزايدات بعد' : 'No bids yet'}</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-sm mb-0">
                      <thead>
                        <tr>
                          <th>{locale === 'ar' ? 'المستخدم' : 'User'}</th>
                          <th>{locale === 'ar' ? 'القيمة' : 'Amount'}</th>
                          <th>{locale === 'ar' ? 'الوقت' : 'Time'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBids.map((b: any) => (
                          <tr key={b.id}>
                            <td>{b?.user?.name || '-'}</td>
                            <td>${Number(b?.amount ?? 0).toLocaleString()}</td>
                            <td>{b?.created_at ? new Date(b.created_at).toLocaleString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h6>{locale === 'ar' ? 'معلومات البائع' : 'Seller info'}</h6>
                <div className="small text-muted mb-2">{lot?.post?.user?.name || '-'}</div>
                <div className="small">{locale === 'ar' ? 'ينتهي في' : 'Ends at'}: {lot?.end_at ? new Date(lot.end_at).toLocaleString() : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

