/** Shared filter summary helpers for section/category SEO metadata and client UI. */

export type SearchParamsLike = { get(name: string): string | null }

export function recordToSearchParams(record: Record<string, string | string[] | undefined>): URLSearchParams {
  const u = new URLSearchParams()
  for (const [k, v] of Object.entries(record)) {
    if (v == null) continue
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item != null && item !== '') u.append(k, String(item))
      }
    } else if (v !== '') {
      u.set(k, String(v))
    }
  }
  return u
}

function firstFromRecord(record: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = record[key]
  if (Array.isArray(v)) return v[0]
  return v
}

export function parseNumber(v: string | undefined): number | undefined {
  if (!v) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export function parseHasImages(v: string | undefined): boolean | undefined {
  if (!v) return undefined
  const norm = v.trim().toLowerCase()
  if (norm === '1' || norm === 'true' || norm === 'yes') return true
  if (norm === '0' || norm === 'false' || norm === 'no') return false
  return undefined
}

export function parseSort(v: string | undefined): 'newest' | 'oldest' | 'price_asc' | 'price_desc' {
  if (v === 'oldest' || v === 'price_asc' || v === 'price_desc') return v
  return 'newest'
}

export function buildSectionFilterParts(locale: string, sp: SearchParamsLike): string[] {
  const ar = locale === 'ar'
  const q = (sp.get('q') ?? '').trim()
  const cityId = parseNumber(sp.get('city_id') ?? undefined)
  const priceMin = parseNumber(sp.get('price_min') ?? undefined)
  const priceMax = parseNumber(sp.get('price_max') ?? undefined)
  const hasImages = parseHasImages(sp.get('has_images') ?? undefined)
  const sort = parseSort(sp.get('sort') ?? undefined)

  const parts: string[] = []
  if (q) parts.push(ar ? `بحث "${q}"` : `search "${q}"`)
  if (cityId) parts.push(ar ? 'مدينة محددة' : 'specific city')
  if (priceMin != null || priceMax != null) parts.push(ar ? 'نطاق سعر' : 'price range')
  if (hasImages === true) parts.push(ar ? 'بصور' : 'with images')
  if (hasImages === false) parts.push(ar ? 'بدون صور' : 'without images')
  if (sort !== 'newest') {
    parts.push(
      sort === 'oldest'
        ? (ar ? 'الأقدم أولًا' : 'oldest first')
        : sort === 'price_asc'
          ? (ar ? 'السعر تصاعدي' : 'price low to high')
          : (ar ? 'السعر تنازلي' : 'price high to low'),
    )
  }
  return parts
}

export function formatSectionResultsSubtitle(locale: string, sp: SearchParamsLike): string {
  const ui = locale === 'en' ? 'en' : 'ar'
  const parts = buildSectionFilterParts(locale, sp)
  if (parts.length === 0) {
    return ui === 'ar' ? 'تصفح أحدث المنشورات' : 'Browse latest listings'
  }
  return ui === 'ar' ? `تصفية: ${parts.join('، ')}` : `Filtered by: ${parts.join(', ')}`
}

export function buildCategoryFilterParts(locale: string, sp: SearchParamsLike): string[] {
  const ar = locale === 'ar'
  const cityId = parseNumber(sp.get('city_id') ?? undefined)
  const priceMin = parseNumber(sp.get('price_min') ?? undefined)
  const priceMax = parseNumber(sp.get('price_max') ?? undefined)
  const hasImages = parseHasImages(sp.get('has_images') ?? undefined)
  const sort = parseSort(sp.get('sort') ?? undefined)

  const parts: string[] = []
  if (cityId) parts.push(ar ? 'مدينة محددة' : 'specific city')
  if (priceMin != null || priceMax != null) parts.push(ar ? 'نطاق سعر' : 'price range')
  if (hasImages === true) parts.push(ar ? 'بصور' : 'with images')
  if (hasImages === false) parts.push(ar ? 'بدون صور' : 'without images')
  if (sort !== 'newest') {
    parts.push(
      sort === 'oldest'
        ? (ar ? 'الأقدم أولًا' : 'oldest first')
        : sort === 'price_asc'
          ? (ar ? 'السعر تصاعدي' : 'price low to high')
          : (ar ? 'السعر تنازلي' : 'price high to low'),
    )
  }
  return parts
}

export function formatCategoryResultsSubtitle(locale: string, sp: SearchParamsLike, categoryName: string): string {
  const ui = locale === 'en' ? 'en' : 'ar'
  const parts = buildCategoryFilterParts(locale, sp)
  if (parts.length === 0) {
    return ui === 'ar' ? `تصفح أحدث المنشورات في ${categoryName}` : `Browse latest posts in ${categoryName}`
  }
  return ui === 'ar' ? `تصفية: ${parts.join('، ')}` : `Filtered by: ${parts.join(', ')}`
}

export function parseAttrFiltersFromRecord(searchParams: Record<string, string | string[] | undefined>): {
  options: Record<number, number[]>
  ranges: Record<number, { from?: string; to?: string }>
} {
  const options: Record<number, number[]> = {}
  const ranges: Record<number, { from?: string; to?: string }> = {}

  for (const [k, v] of Object.entries(searchParams)) {
    const mList = k.match(/^attr\[(\d+)\]\[\]$/)
    const mSingle = k.match(/^attr\[(\d+)\]$/)
    const mFromTo = k.match(/^attr\[(\d+)\]\[(from|to)\]$/)

    if (mList || mSingle) {
      const attrId = Number((mList ?? mSingle)![1])
      if (!attrId) continue
      const vals = Array.isArray(v) ? v : v != null ? [v] : []
      const optionIds = vals
        .flatMap((x) => String(x).split(','))
        .map((x) => Number(String(x).trim()))
        .filter((n) => Number.isFinite(n)) as number[]
      if (!optionIds.length) continue
      options[attrId] = Array.from(new Set([...(options[attrId] ?? []), ...optionIds]))
      continue
    }

    if (mFromTo) {
      const attrId = Number(mFromTo[1])
      const kind = mFromTo[2] as 'from' | 'to'
      if (!attrId) continue
      const val = Array.isArray(v) ? v[0] : v
      if (val == null) continue
      const s = String(val).trim()
      if (!s) continue
      ranges[attrId] = { ...(ranges[attrId] ?? {}), [kind]: s }
      continue
    }

    if (k.startsWith('a')) {
      const keyWithoutBrackets = k.replace(/\[\]$/, '')
      const attrId = Number(keyWithoutBrackets.slice(1))
      if (!attrId) continue
      const vals = Array.isArray(v) ? v : v != null ? [v] : []
      const optionIds = vals
        .flatMap((x) => String(x).split(','))
        .map((x) => Number(String(x).trim()))
        .filter((n) => Number.isFinite(n)) as number[]
      if (!optionIds.length) continue
      options[attrId] = Array.from(new Set([...(options[attrId] ?? []), ...optionIds]))
    }
  }

  return { options, ranges }
}

export function hasCategorySeoFilterNoise(
  locale: string,
  record: Record<string, string | string[] | undefined>,
): boolean {
  const sp = recordToSearchParams(record)
  const parts = buildCategoryFilterParts(locale, sp)
  const parsed = parseAttrFiltersFromRecord(record)
  const page = parseNumber(firstFromRecord(record, 'page'))
  return (
    parts.length > 0 ||
    Object.keys(parsed.options).length > 0 ||
    Object.keys(parsed.ranges).length > 0 ||
    (page != null && page > 1)
  )
}

export function hasSectionSeoFilterNoise(
  locale: string,
  record: Record<string, string | string[] | undefined>,
): boolean {
  const sp = recordToSearchParams(record)
  const parts = buildSectionFilterParts(locale, sp)
  const pageNum = parseNumber(firstFromRecord(record, 'page'))
  return parts.length > 0 || (pageNum != null && pageNum > 1)
}
