import type { Metadata } from 'next'
import { Card, Col, Container, Row, Table } from 'react-bootstrap'
import Link from 'next/link'
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
import { getPublicSiteOrigin } from '@/lib/seo/siteUrl'
import { toAbsoluteUrl } from '@/lib/seo/absoluteUrl'

/** تحسين الأداء: إعادة توليد الصفحة كل 60ث مع بقاءها ثابتة قدر الإمكان */
export const revalidate = 60

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

function buildKeywords(post: any, locale: string): string[] {
  const parts = [
    'ANANAS',
    'أناناس',
    pickLocalizedName(post?.section?.name, locale),
    pickLocalizedName(post?.category?.name, locale),
    pickLocalizedName(post?.city?.name, locale),
    post?.title ? String(post.title).slice(0, 80) : '',
    post?.price != null && post?.price !== '' ? String(post.price) : '',
  ]
  return [...new Set(parts.map((s) => String(s || '').trim()).filter(Boolean))]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const origin = getPublicSiteOrigin()
  const canonicalPath = `/${locale}/post/${id}`

  try {
    const json = (await callLaravel(`/api/posts/${id}?land=${locale}`, { method: 'GET' })) as ApiPostDetailsResponse
    const post = json?.data ?? {}
    const rawImg = post?.post_images?.[0]?.image_full_url || post?.post_images?.[0]?.image || post?.image || ''
    const firstImage = resolveMediaUrl(rawImg)
    const ogImageUrl = firstImage ? toAbsoluteUrl(firstImage, origin) : undefined
    const price = post?.price != null && post?.price !== '' ? ` — ${post.price}` : ''
    const baseTitle = json?.data?.title
      ? `${json.data.title}${price}`
      : locale === 'ar'
        ? `إعلان #${id}`
        : `Listing #${id}`
    const title = `${baseTitle} | ANANAS`
    const descSource = json?.data?.description ? String(json.data.description) : ''
    const description =
      descSource.length > 0
        ? descSource.slice(0, 165) + (descSource.length > 165 ? '…' : '')
        : locale === 'ar'
          ? `إعلان رقم ${id} على أناناس — تفاصيل، صور، وتواصل مع المعلن.`
          : `Listing #${id} on ANANAS — details, photos, and contact.`
    const keywords = buildKeywords(post, locale)
    const sectionName = pickLocalizedName(post?.section?.name, locale)
    const published = post?.created_at ? String(post.created_at) : undefined
    const modified = post?.updated_at ? String(post.updated_at) : published

    return {
      title,
      description,
      keywords,
      authors: post?.user?.name ? [{ name: String(post.user.name) }] : undefined,
      alternates: {
        canonical: canonicalPath,
        languages: {
          ar: `${origin}/ar/post/${id}`,
          en: `${origin}/en/post/${id}`,
        },
      },
      openGraph: {
        title,
        description,
        type: 'article',
        url: canonicalPath,
        siteName: 'ANANAS',
        locale: locale === 'ar' ? 'ar_AR' : 'en_US',
        publishedTime: published,
        modifiedTime: modified,
        section: sectionName || undefined,
        images: ogImageUrl
          ? [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: post?.title ? String(post.title) : `ANANAS ${id}`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: ogImageUrl ? 'summary_large_image' : 'summary',
        title,
        description,
        images: ogImageUrl ? [ogImageUrl] : undefined,
      },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    }
  } catch {
    const fallbackTitle = locale === 'ar' ? `إعلان #${id} | ANANAS` : `Listing #${id} | ANANAS`
    const fallbackDescription =
      locale === 'ar'
        ? `صفحة إعلان على منصة أناناس (رقم ${id}).`
        : `Classified listing on ANANAS (#${id}).`
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: { canonical: canonicalPath },
      robots: { index: true, follow: true },
    }
  }
}

export default async function PostDetailsPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params

  const json = (await callLaravel(`/api/posts/${id}?land=${locale}`, { method: 'GET' })) as ApiPostDetailsResponse
  if (!json?.success || !json?.data) {
    return (
      <main className={styles.pageMain}>
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

  const [similarPosts, morePosts, sections] = await Promise.all([
    fetchSimilarPosts(id, locale),
    fetchMoreFromSection(id, locale),
    fetchSections(locale),
  ])

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

  /** منع تكرار صورة الغلاف داخل PostCard بعد عرض المعرض */
  const postForCard = { ...post, post_images: [], image: undefined }

  const safeLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE
  const isRtl = safeLocale === 'ar'
  const cityName = pickLocalizedName(post?.city?.name, safeLocale)
  const sectionName = pickLocalizedName(post?.section?.name, safeLocale)
  const categoryName = pickLocalizedName(post?.category?.name, safeLocale)
  const sectionSlug = post?.section?.slug ? String(post.section.slug) : ''
  const categorySlug = post?.category?.slug ? String(post.category.slug) : ''
  const userName = post?.user?.name || (safeLocale === 'ar' ? 'صاحب الإعلان' : 'Publisher')
  const userPhone = post?.user?.mobile ? String(post.user.mobile) : ''
  const userEmail = post?.user?.email ? String(post.user.email) : ''
  const hasPrice = post?.price != null && post?.price !== ''

  const origin = getPublicSiteOrigin()
  const homePath = `/${safeLocale}`
  const sectionPath = sectionSlug ? `/${safeLocale}/sections/${sectionSlug}` : homePath
  const categoryPath =
    sectionSlug && categorySlug ? `/${safeLocale}/sections/${sectionSlug}/${categorySlug}` : sectionPath

  const postUrl = `${origin}/${safeLocale}/post/${id}`
  const breadcrumbLabelHome = safeLocale === 'ar' ? 'الرئيسية' : 'Home'
  const breadcrumbLabelAd = safeLocale === 'ar' ? `إعلان ${id}` : `Ad ${id}`

  const crumbItems: Array<{ name: string; item: string }> = [
    { name: breadcrumbLabelHome, item: `${origin}${homePath}` },
  ]
  if (sectionSlug && sectionName) crumbItems.push({ name: sectionName, item: `${origin}${sectionPath}` })
  if (sectionSlug && categorySlug && categoryName) {
    crumbItems.push({ name: categoryName, item: `${origin}${categoryPath}` })
  }
  crumbItems.push({
    name: post?.title ? String(post.title) : breadcrumbLabelAd,
    item: postUrl,
  })

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbItems.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  }

  const firstImageAbs = postImages[0]?.url
    ? toAbsoluteUrl(resolveMediaUrl(String(postImages[0].url)), origin)
    : undefined

  const jsonLdProduct: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: post?.title ? String(post.title) : `Listing ${id}`,
    description: post?.description ? String(post.description).slice(0, 5000) : undefined,
    sku: String(id),
    url: postUrl,
    image: firstImageAbs ? [firstImageAbs] : undefined,
    category: categoryName || sectionName || undefined,
  }
  if (hasPrice) {
    jsonLdProduct.offers = {
      '@type': 'Offer',
      price: String(post.price),
      priceCurrency: 'JOD',
      availability: 'https://schema.org/InStock',
      url: postUrl,
    }
  }

  const structuredData = JSON.stringify([jsonLdBreadcrumb, jsonLdProduct])

  return (
    <div className={styles.pageMain} lang={safeLocale} dir={isRtl ? 'rtl' : 'ltr'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />

      <FeedLayoutClient locale={locale} sidebar={<SideBar sections={sections} locale={locale} />}>
        <Col lg={9} className={styles.feedCol}>
          <PostViewTracker postId={id} postUserId={post?.user_id} />

          <Container fluid className={styles.shell}>
            <nav className={styles.breadcrumbNav} aria-label={safeLocale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
              <ol className={styles.breadcrumbList}>
                <li className={styles.breadcrumbItem}>
                  <Link href={homePath} className={styles.breadcrumbLink}>
                    {breadcrumbLabelHome}
                  </Link>
                </li>
                {sectionSlug && sectionName ? (
                  <li className={styles.breadcrumbItem}>
                    <span className={styles.breadcrumbSep} aria-hidden>
                      /
                    </span>
                    <Link href={sectionPath} className={styles.breadcrumbLink}>
                      {sectionName}
                    </Link>
                  </li>
                ) : null}
                {sectionSlug && categorySlug && categoryName ? (
                  <li className={styles.breadcrumbItem}>
                    <span className={styles.breadcrumbSep} aria-hidden>
                      /
                    </span>
                    <Link href={categoryPath} className={styles.breadcrumbLink}>
                      {categoryName}
                    </Link>
                  </li>
                ) : null}
                <li className={styles.breadcrumbItem}>
                  <span className={styles.breadcrumbSep} aria-hidden>
                    /
                  </span>
                  <span className={styles.breadcrumbCurrent}>{breadcrumbLabelAd}</span>
                </li>
              </ol>
            </nav>

            <div className={styles.listingTopBar}>
              <span className={styles.adIdBadge}>
                {safeLocale === 'ar' ? `إعلان رقم ${id}` : `Ad #${id}`}
              </span>
              {hasPrice ? (
                <div className={styles.pricePill}>
                  <span className={styles.pricePillLabel}>{safeLocale === 'ar' ? 'السعر' : 'Price'}</span>
                  <span className={styles.pricePillValue}>{String(post.price)}</span>
                </div>
              ) : null}
            </div>

            <article itemScope itemType="https://schema.org/Product" className={styles.article}>
              <meta itemProp="sku" content={String(id)} />

              <Row className={`g-3 g-lg-4 ${styles.contentRow}`}>
                <Col lg={8} xl={8} className={styles.primaryCol}>
                  <div className={styles.listingStack}>
                    {postImages.length > 0 ? (
                      <Card className={styles.galleryCard}>
                        <PostImagesGallery images={postImages} title={post?.title} isRtl={isRtl} />
                      </Card>
                    ) : null}

                    <PostCard
                    post={postForCard}
                    attributesAndOptions={
                      <Card className={styles.detailsCard}>
                        <div className="card-body">
                          <h2 className={styles.detailsTitle}>{t('post.detailsTitle', safeLocale)}</h2>

                          {attributesAndOptions.length === 0 ? (
                            <div className="text-muted">{t('post.noAttributes', safeLocale)}</div>
                          ) : (
                            <div className="table-responsive">
                              <Table striped bordered hover size="sm" className={`mb-0 ${styles.attrTable}`}>
                                <thead>
                                  <tr>
                                    <th style={{ width: '40%' }}>{t('post.attribute', safeLocale)}</th>
                                    <th>{t('post.value', safeLocale)}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {attributesAndOptions.map((row: any, idx: number) => {
                                    const attrName =
                                      pickLocalizedName(row?.attribute?.name, locale) ||
                                      row?.attribute?.slug ||
                                      `#${idx + 1}`

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
                  </div>
                </Col>

                <Col lg={4} xl={4} className={styles.asideCol}>
                  <aside className={styles.asideSticky} aria-label={safeLocale === 'ar' ? 'الجانب' : 'Sidebar'}>
                    <Card className={styles.contactCard}>
                      <div className={`card-body ${styles.contactBody}`}>
                        <div className={styles.contactTitle}>
                          {safeLocale === 'ar' ? 'معلومات المعلن' : 'Publisher'}
                        </div>
                        <div className={styles.contactName}>{userName}</div>
                        <div className={styles.contactGrid}>
                          <div className={styles.contactItem}>
                            <span className={styles.contactItemLabel}>{safeLocale === 'ar' ? 'المدينة' : 'City'}</span>
                            <span className={styles.contactItemValue}>{cityName || '—'}</span>
                          </div>
                          <div className={styles.contactItem}>
                            <span className={styles.contactItemLabel}>{safeLocale === 'ar' ? 'الهاتف' : 'Phone'}</span>
                            <span className={styles.contactItemValue}>{userPhone || '—'}</span>
                          </div>
                          <div className={styles.contactItem}>
                            <span className={styles.contactItemLabel}>{safeLocale === 'ar' ? 'البريد' : 'Email'}</span>
                            <span className={styles.contactItemValue}>{userEmail || '—'}</span>
                          </div>
                          <div className={styles.contactItem}>
                            <span className={styles.contactItemLabel}>{safeLocale === 'ar' ? 'السعر' : 'Price'}</span>
                            <span className={styles.contactItemValue}>{hasPrice ? String(post.price) : '—'}</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className={`${styles.sidebarTitle} d-none d-lg-block`}>{t('post.similarTitle', safeLocale)}</div>
                    {similarPosts.length === 0 ? (
                      <p className={`${styles.emptyRelated} d-none d-lg-block mb-0`}>{t('post.noSimilar', safeLocale)}</p>
                    ) : (
                      <div className={`${styles.sidebarStack} d-none d-lg-flex flex-column`}>
                        {similarPosts.map((p: any) => (
                          <SimpleListingCard key={p.id} post={p} locale={safeLocale} />
                        ))}
                      </div>
                    )}
                  </aside>
                </Col>
              </Row>
            </article>

            <div className={`d-lg-none ${styles.moreSection}`}>
              <h2 className={styles.moreTitle}>{t('post.similarTitle', safeLocale)}</h2>
              {similarPosts.length === 0 ? (
                <p className={styles.emptyRelated}>{t('post.noSimilar', safeLocale)}</p>
              ) : (
                <div className={styles.moreGrid}>
                  {similarPosts.map((p: any) => (
                    <SimpleListingCard key={p.id} post={p} locale={safeLocale} />
                  ))}
                </div>
              )}
            </div>

            <section className={styles.moreSection} aria-label={t('post.moreFromSection', safeLocale)}>
              <h2 className={styles.moreTitle}>{t('post.moreFromSection', safeLocale)}</h2>
              {morePosts.length === 0 ? (
                <p className={`${styles.emptyRelated} mb-0`}>{t('post.noSimilar', safeLocale)}</p>
              ) : (
                <div className={styles.moreGrid}>
                  {morePosts.map((p: any) => (
                    <SimpleListingCard key={p.id} post={p} locale={safeLocale} />
                  ))}
                </div>
              )}
            </section>
          </Container>
        </Col>
      </FeedLayoutClient>
    </div>
  )
}
