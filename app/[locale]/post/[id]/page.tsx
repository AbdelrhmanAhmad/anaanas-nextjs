import type { Metadata } from 'next'
import { Card, Col, Container, Row, Table } from 'react-bootstrap'
import PostCard from '@/components/cards/PostCard'
import { callLaravel } from '@/lib/laravelClient'
import PostImagesGallery from './PostImagesGallery'
import PostViewTracker from './PostViewTracker'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import SimpleListingCard from './SimpleListingCard'
import styles from './postDetails.module.css'
import { resolveMediaUrl } from '@/lib/media/resolveMediaUrl'
import FeedLayoutClient from '@/components/layout/FeedLayoutClient'
import SideBar from '@/components/layout/SideBar'
import { fetchSections } from '@/lib/api/sections'
type ApiPostDetailsResponse = {
  success?: boolean
  data?: any
  message?: string
}

async function fetchSimilarPosts(postId: string, locale: string): Promise<any[]> {
  try {
    const json = (await callLaravel(`/api/posts/${postId}/similar?land=${encodeURIComponent(locale)}&limit=6`, {
      method: 'GET',
    })) as { success?: boolean; data?: any[] }
    return json?.success && Array.isArray(json.data) ? json.data : []
  } catch {
    return []
  }
}

async function fetchMoreFromSection(postId: string, locale: string): Promise<any[]> {
  try {
    const json = (await callLaravel(
      `/api/posts/${postId}/more-from-section?land=${encodeURIComponent(locale)}&limit=8`,
      { method: 'GET' },
    )) as { success?: boolean; data?: any[] }
    return json?.success && Array.isArray(json.data) ? json.data : []
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  try {
    const json = (await callLaravel(`/api/posts/${id}?land=${locale}`, { method: 'GET' })) as ApiPostDetailsResponse
    const post = json?.data ?? {}
    const firstImage = resolveMediaUrl(post?.post_images?.[0]?.image_full_url || post?.post_images?.[0]?.image || post?.image || '')
    const price = post?.price != null && post?.price !== '' ? ` - ${post.price}` : ''
    const title = json?.data?.title
      ? `${json.data.title}${price} | ANANAS`
      : locale === 'ar'
        ? 'تفاصيل المنشور | ANANAS'
        : 'Post details | ANANAS'
    const description = json?.data?.description
      ? String(json.data.description).slice(0, 160)
      : locale === 'ar'
        ? 'استعرض تفاصيل المنشور وخصائصه وتواصل مع صاحب الإعلان.'
        : 'View post details, attributes, and connect with the publisher.'
    const canonical = `/${locale}/post/${id}`
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'article',
        url: canonical,
        images: firstImage ? [{ url: firstImage, alt: post?.title || 'ANANAS post image' }] : undefined,
      },
      twitter: {
        card: firstImage ? 'summary_large_image' : 'summary',
        title,
        description,
        images: firstImage ? [firstImage] : undefined,
      },
    }
  } catch {
    const fallbackTitle = locale === 'ar' ? 'تفاصيل المنشور | ANANAS' : 'Post details | ANANAS'
    const fallbackDescription =
      locale === 'ar'
        ? 'استعرض تفاصيل المنشور وخصائصه وتواصل مع صاحب الإعلان.'
        : 'View post details, attributes, and connect with the publisher.'
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: { canonical: `/${locale}/post/${id}` },
    }
  }
}

function pickLocalizedName(value: any, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    if (typeof value[locale] === 'string') return value[locale]
    if (typeof value.en === 'string') return value.en
    if (typeof value.ar === 'string') return value.ar
  }
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export default async function PostDetailsPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params

  const json = (await callLaravel(`/api/posts/${id}?land=${locale}`, { method: 'GET' })) as ApiPostDetailsResponse
  if (!json?.success || !json?.data) {
    return (
      <main>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="alert alert-danger mb-0">Failed to load post details</div>
            </Col>
          </Row>
        </Container>
      </main>
    )
  }

  const [similarPosts, morePosts] = await Promise.all([fetchSimilarPosts(id, locale), fetchMoreFromSection(id, locale)])

  const post = json.data
  const postImages: Array<{ url: string; alt?: string }> = Array.isArray(post?.post_images)
    ? post.post_images
        .map((img: any) => ({
          url: img?.image_full_url || img?.image,
          alt: post?.title,
        }))
        .filter((x: any) => Boolean(x.url))
    : []

  const postData = post?.post_data
  const attributesAndOptions = Array.isArray(postData?.attributes_and_options) ? postData.attributes_and_options : []

  const postForCard = { ...post, post_images: [] }

  const safeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE
  const isRtl = safeLocale === 'ar'
  const cityName = pickLocalizedName(post?.city?.name, safeLocale)
  const sectionName = pickLocalizedName(post?.section?.name, safeLocale)
  const categoryName = pickLocalizedName(post?.category?.name, safeLocale)
  const userName = post?.user?.name || (safeLocale === 'ar' ? 'صاحب الإعلان' : 'Publisher')
  const userPhone = post?.user?.mobile ? String(post.user.mobile) : ''
  const userEmail = post?.user?.email ? String(post.user.email) : ''
  const hasPrice = post?.price != null && post?.price !== ''
  const sections = await fetchSections(locale)
const Banner2 = () => {
  return (
   <>
     {postImages.length > 0 ? (
              <Card className={styles.galleryCard}>
                <PostImagesGallery images={postImages} title={post?.title} isRtl={isRtl} />
              </Card>
            ) : null}
   
   </>
  )
}
  return (
    <main>
      <FeedLayoutClient locale={locale} sidebar={<SideBar sections={sections} locale={locale} />}>
      <Col lg={9}>

      <PostViewTracker postId={id} postUserId={post?.user_id} />
          <Row className="g-3 align-items-stretch">
            <Col lg={8}>
              <Card className={styles.heroCard}>
                <div className="card-body">
                  <div className={styles.heroTopRow}>
                    <div>
                      <h1 className={styles.heroTitle}>{post?.title || `#${id}`}</h1>
                      <p className={styles.heroDesc}>{post?.description || (safeLocale === 'ar' ? 'لا يوجد وصف' : 'No description')}</p>
                    </div>
                    {hasPrice && (
                      <div className={styles.priceBadge}>
                        <span className={styles.priceLabel}>{safeLocale === 'ar' ? 'السعر' : 'Price'}</span>
                        <span className={styles.priceValue}>{String(post.price)}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.metaPills}>
                    {sectionName && <span className={styles.metaPill}>{sectionName}</span>}
                    {categoryName && <span className={styles.metaPill}>{categoryName}</span>}
                    {cityName && <span className={styles.metaPill}>{cityName}</span>}
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className={styles.contactCard}>
                <div className="card-body">
                  <div className={styles.contactTitle}>{safeLocale === 'ar' ? 'معلومات المعلن' : 'Publisher Details'}</div>
                  <div className={styles.contactName}>{userName}</div>
                  <div className={styles.contactGrid}>
                    <div className={styles.contactItem}>
                      <span className={styles.contactItemLabel}>{safeLocale === 'ar' ? 'المدينة' : 'City'}</span>
                      <span className={styles.contactItemValue}>{cityName || '-'}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactItemLabel}>{safeLocale === 'ar' ? 'الهاتف' : 'Phone'}</span>
                      <span className={styles.contactItemValue}>{userPhone || '-'}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactItemLabel}>{safeLocale === 'ar' ? 'البريد' : 'Email'}</span>
                      <span className={styles.contactItemValue}>{userEmail || '-'}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactItemLabel}>{safeLocale === 'ar' ? 'السعر' : 'Price'}</span>
                      <span className={styles.contactItemValue}>{hasPrice ? String(post.price) : '-'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

        <Row className={`g-4 ${styles.layoutRow}`}>
          <Col lg={8} xl={8}>
        

            <PostCard
              post={postForCard}
              banner={<Banner2/>}
              attributesAndOptions={
                <Card className={styles.detailsCard}>
                  <div className="card-body">
                  <h5 className={styles.detailsTitle}>{t('post.detailsTitle', safeLocale)}</h5>

                  {attributesAndOptions.length === 0 ? (
                    <div className="text-muted">{t('post.noAttributes', safeLocale)}</div>
                  ) : (
                    <div className="table-responsive">
                      <Table striped bordered hover size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: '40%' }}>{t('post.attribute', safeLocale)}</th>
                            <th>{t('post.value', safeLocale)}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attributesAndOptions.map((row: any, idx: number) => {
                            const attrName =
                              pickLocalizedName(row?.attribute?.name, locale) || row?.attribute?.slug || `#${idx + 1}`

                            const singleOptName = pickLocalizedName(row?.option?.name, locale)
                            const multiOptNames = Array.isArray(row?.options)
                              ? row.options.map((o: any) => pickLocalizedName(o?.name, locale)).filter(Boolean)
                              : []

                            const value = singleOptName || (multiOptNames.length ? multiOptNames.join('، ') : '')

                            return (
                              <tr key={idx}>
                                <td>{attrName}</td>
                                <td>{value || '-'}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    </div>
                  )}
                  </div>
                </Card>
              }
            />
          </Col>

          <Col lg={4} xl={4} className={`d-none d-lg-block ${styles.sidebarCol}`}>
            <div className={styles.sidebarTitle}>{t('post.similarTitle', safeLocale)}</div>
            {similarPosts.length === 0 ? (
              <p className="text-muted small mb-0">{t('post.noSimilar', safeLocale)}</p>
            ) : (
              <div className={styles.sidebarStack}>
                {similarPosts.map((p: any) => (
                  <SimpleListingCard key={p.id} post={p} locale={safeLocale} />
                ))}
              </div>
            )}
          </Col>
        </Row>

        <div className={`d-lg-none ${styles.moreSection}`}>
          <h5 className={styles.moreTitle}>{t('post.similarTitle', safeLocale)}</h5>
          {similarPosts.length === 0 ? (
            <p className="text-muted small">{t('post.noSimilar', safeLocale)}</p>
          ) : (
            <div className={styles.moreGrid}>
              {similarPosts.map((p: any) => (
                <SimpleListingCard key={p.id} post={p} locale={safeLocale} />
              ))}
            </div>
          )}
        </div>

        <section className={styles.moreSection} aria-label={t('post.moreFromSection', safeLocale)}>
          <h5 className={styles.moreTitle}>{t('post.moreFromSection', safeLocale)}</h5>
          {morePosts.length === 0 ? (
            <p className="text-muted small mb-0">{t('post.noSimilar', safeLocale)}</p>
          ) : (
            <div className={styles.moreGrid}>
              {morePosts.map((p: any) => (
                <SimpleListingCard key={p.id} post={p} locale={safeLocale} />
              ))}
            </div>
          )}
        </section>
        </Col>

    </FeedLayoutClient>

    </main>
  )
}
