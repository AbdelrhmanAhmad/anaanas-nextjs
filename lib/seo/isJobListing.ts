function pickLocalizedName(value: unknown, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    if (typeof obj[locale] === 'string') return obj[locale] as string
    if (typeof obj.en === 'string') return obj.en
    if (typeof obj.ar === 'string') return obj.ar
  }
  return ''
}

const JOB_SLUG_HINTS = ['job', 'jobs', 'wazayef', 'wazifa', 'employment', 'career', 'careers', 'وظائف', 'وظيفة']

/** True when section/category clearly indicates a job listing. */
export function isJobListing(post: Record<string, unknown> | null | undefined): boolean {
  if (!post) return false

  const section = post.section as Record<string, unknown> | undefined
  const category = post.category as Record<string, unknown> | undefined

  const slugParts = [
    String(section?.slug ?? '').toLowerCase(),
    String(category?.slug ?? '').toLowerCase(),
  ]

  for (const slug of slugParts) {
    if (!slug) continue
    if (JOB_SLUG_HINTS.some((hint) => slug.includes(hint))) return true
  }

  const nameParts = [
    pickLocalizedName(section?.name, 'ar'),
    pickLocalizedName(section?.name, 'en'),
    pickLocalizedName(category?.name, 'ar'),
    pickLocalizedName(category?.name, 'en'),
  ]

  for (const name of nameParts) {
    const lower = name.toLowerCase()
    if (JOB_SLUG_HINTS.some((hint) => lower.includes(hint))) return true
  }

  return false
}
