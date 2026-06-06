type BreadcrumbItem = { name: string; item: string }

type BuildPostStructuredDataInput = {
  postId: string
  title: string
  description?: string
  postUrl: string
  locale: string
  imageUrl?: string
  price?: string | number | null
  categoryName?: string
  sectionName?: string
  sellerName?: string
  breadcrumbItems: BreadcrumbItem[]
}

function parsePositivePrice(raw: string | number | null | undefined): number | null {
  if (raw == null || raw === '') return null
  const n = typeof raw === 'number' ? raw : Number(String(raw).replace(/,/g, ''))
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}

/**
 * Classified-ad listings: emit Product JSON-LD only when Google-required fields exist
 * (image + offers). Otherwise WebPage + BreadcrumbList — avoids Merchant/Product errors
 * for ads without photos, zero price, or missing reviews.
 */
export function buildPostStructuredData(input: BuildPostStructuredDataInput): object[] {
  const {
    postId,
    title,
    description,
    postUrl,
    locale,
    imageUrl,
    price,
    categoryName,
    sectionName,
    sellerName,
    breadcrumbItems,
  } = input

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  }

  const webPage: Record<string, unknown> = {
    '@type': 'WebPage',
    name: title,
    url: postUrl,
    inLanguage: locale === 'ar' ? 'ar' : 'en',
  }
  if (description) {
    webPage.description = description.slice(0, 5000)
  }

  const graph: object[] = [
    { '@context': 'https://schema.org', ...breadcrumb },
    { '@context': 'https://schema.org', ...webPage },
  ]

  const numericPrice = parsePositivePrice(price)
  const canEmitProduct = Boolean(imageUrl && numericPrice != null)

  if (canEmitProduct) {
    const product: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      sku: postId,
      url: postUrl,
      image: [imageUrl],
      offers: {
        '@type': 'Offer',
        url: postUrl,
        price: numericPrice!.toFixed(2),
        priceCurrency: 'JOD',
        availability: 'https://schema.org/InStock',
        ...(sellerName
          ? {
              seller: {
                '@type': 'Person',
                name: sellerName,
              },
            }
          : {}),
      },
    }
    if (description) product.description = description.slice(0, 5000)
    const cat = categoryName || sectionName
    if (cat) product.category = cat
    graph.push(product)
  }

  return graph
}
