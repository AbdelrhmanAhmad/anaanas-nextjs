import { resolveCurrencyForCountry } from '@/lib/seo/countryCurrency'
import { isJobListing } from '@/lib/seo/isJobListing'

type BreadcrumbItem = { name: string; item: string }

type BuildPostStructuredDataInput = {
  post: Record<string, unknown>
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
  cityName?: string
  countryName?: string
  countryIso2?: string | null
  datePosted?: string | null
  employmentType?: string | null
  breadcrumbItems: BreadcrumbItem[]
}

function parsePositivePrice(raw: string | number | null | undefined): number | null {
  if (raw == null || raw === '') return null
  const n = typeof raw === 'number' ? raw : Number(String(raw).replace(/,/g, ''))
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}

function pickAttributeValue(post: Record<string, unknown>, hints: string[]): string | null {
  const postData = post.post_data as Record<string, unknown> | undefined
  const rows = postData?.attributes_and_options
  if (!Array.isArray(rows)) return null

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const attribute = (row as Record<string, unknown>).attribute as Record<string, unknown> | undefined
    const slug = String(attribute?.slug ?? '').toLowerCase()
    const name = String(attribute?.name ?? '').toLowerCase()
    const matches = hints.some((hint) => slug.includes(hint) || name.includes(hint))
    if (!matches) continue

    const option = (row as Record<string, unknown>).option as Record<string, unknown> | undefined
    const options = (row as Record<string, unknown>).options as Array<Record<string, unknown>> | undefined
    const value = (row as Record<string, unknown>).value ?? option?.name ?? options?.[0]?.name
    if (value != null && String(value).trim() !== '') {
      return String(value).trim()
    }
  }

  return null
}

function buildAreaServed(cityName?: string, countryName?: string): Record<string, unknown> | undefined {
  const parts = [cityName, countryName].filter(Boolean)
  if (parts.length === 0) return undefined

  return {
    '@type': 'Place',
    name: parts.join(', '),
    ...(cityName
      ? {
          address: {
            '@type': 'PostalAddress',
            addressLocality: cityName,
            ...(countryName ? { addressCountry: countryName } : {}),
          },
        }
      : countryName
        ? { address: { '@type': 'PostalAddress', addressCountry: countryName } }
        : {}),
  }
}

/**
 * Classified listings: Product+Offer when image and price exist.
 * Job listings: JobPosting when section/category indicates jobs.
 * Otherwise WebPage + BreadcrumbList only.
 */
export function buildPostStructuredData(input: BuildPostStructuredDataInput): object[] {
  const {
    post,
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
    cityName,
    countryName,
    countryIso2,
    datePosted,
    employmentType,
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

  const areaServed = buildAreaServed(cityName, countryName)
  const resolvedEmploymentType =
    employmentType ||
    pickAttributeValue(post, ['employment', 'job_type', 'employment_type', 'نوع', 'دوام'])

  if (isJobListing(post)) {
    const jobPosting: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title,
      url: postUrl,
      description: description ? description.slice(0, 5000) : undefined,
      datePosted: datePosted || undefined,
      employmentType: resolvedEmploymentType || undefined,
      hiringOrganization: {
        '@type': 'Organization',
        name: sellerName || 'ANANAS',
      },
      ...(areaServed ? { jobLocation: areaServed } : {}),
    }

    graph.push(jobPosting)
    return graph
  }

  const numericPrice = parsePositivePrice(price)
  const currency = resolveCurrencyForCountry(countryIso2)
  const canEmitProduct = Boolean(imageUrl && numericPrice != null && currency)

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
        priceCurrency: currency,
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
    if (areaServed) product.areaServed = areaServed
    graph.push(product)
  }

  return graph
}
