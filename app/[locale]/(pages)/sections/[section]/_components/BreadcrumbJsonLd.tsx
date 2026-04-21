type Item = { name: string; url: string }

/**
 * Emits `BreadcrumbList` structured data for SEO. Works inside Server Components.
 * URLs should include a site origin or be absolute paths — Google tolerates both.
 */
export default function BreadcrumbJsonLd({ items }: { items: Item[] }) {
  if (!Array.isArray(items) || items.length === 0) return null

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
