'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { BsXLg } from 'react-icons/bs'

import type { City } from '@/lib/api/cities'
import type { Field, SubField } from '@/lib/api/fields'
import styles from './filters.module.css'

type Locale = 'ar' | 'en'

type Chip = {
  id: string
  label: string
  /** Keys (and optional values) to remove from the URL when the chip is dismissed. */
  remove: Array<{ key: string; value?: string }>
}

function flattenFields(fields: Field[] | SubField[] | undefined | null): (Field | SubField)[] {
  // We cannot traverse sub-fields without loading them. This keeps labels simple.
  return Array.isArray(fields) ? (fields as (Field | SubField)[]) : []
}

type Props = {
  locale: Locale
  cities?: City[]
  fields?: Field[]
  /** Show sort chip when sort !== 'newest'. Defaults to true. */
  showSortChip?: boolean
  /** Show query chip when q is set. Defaults to true. */
  showQueryChip?: boolean
}

const SORT_LABELS_AR: Record<string, string> = {
  oldest: 'الأقدم أولًا',
  price_asc: 'السعر تصاعديًا',
  price_desc: 'السعر تنازليًا',
}
const SORT_LABELS_EN: Record<string, string> = {
  oldest: 'Oldest first',
  price_asc: 'Price: low to high',
  price_desc: 'Price: high to low',
}

export default function ActiveFilterChips({
  locale,
  cities = [],
  fields = [],
  showSortChip = true,
  showQueryChip = true,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const chips = useMemo<Chip[]>(() => {
    const list: Chip[] = []
    const sp = searchParams

    if (showQueryChip) {
      const q = (sp.get('q') ?? '').trim()
      if (q) {
        list.push({
          id: 'q',
          label: locale === 'ar' ? `بحث: "${q}"` : `Search: "${q}"`,
          remove: [{ key: 'q' }],
        })
      }
    }

    const cityId = sp.get('city_id')
    if (cityId) {
      const city = cities.find((c) => String(c.id) === String(cityId))
      if (city) {
        list.push({
          id: 'city_id',
          label: (locale === 'ar' ? 'المدينة: ' : 'City: ') + city.name,
          remove: [{ key: 'city_id' }],
        })
      }
    }

    const priceMin = sp.get('price_min')
    const priceMax = sp.get('price_max')
    if (priceMin || priceMax) {
      const from = priceMin?.trim()
      const to = priceMax?.trim()
      const label =
        from && to
          ? (locale === 'ar' ? `السعر: ${from} - ${to}` : `Price: ${from} – ${to}`)
          : from
            ? (locale === 'ar' ? `السعر من ${from}` : `Price from ${from}`)
            : (locale === 'ar' ? `السعر حتى ${to}` : `Price up to ${to}`)
      list.push({
        id: 'price',
        label,
        remove: [{ key: 'price_min' }, { key: 'price_max' }],
      })
    }

    const hasImages = sp.get('has_images')
    if (hasImages === '1' || hasImages === 'true') {
      list.push({
        id: 'has_images',
        label: locale === 'ar' ? 'بصور فقط' : 'With images only',
        remove: [{ key: 'has_images' }],
      })
    } else if (hasImages === '0' || hasImages === 'false') {
      list.push({
        id: 'has_images',
        label: locale === 'ar' ? 'بدون صور' : 'Without images',
        remove: [{ key: 'has_images' }],
      })
    }

    if (showSortChip) {
      const sort = sp.get('sort') ?? 'newest'
      if (sort && sort !== 'newest') {
        const map = locale === 'ar' ? SORT_LABELS_AR : SORT_LABELS_EN
        const lab = map[sort]
        if (lab) {
          list.push({
            id: 'sort',
            label: (locale === 'ar' ? 'ترتيب: ' : 'Sort: ') + lab,
            remove: [{ key: 'sort' }],
          })
        }
      }
    }

    // Attribute option selections: attr[<id>][]=<optId>
    const fieldMap = new Map<number, Field | SubField>()
    flattenFields(fields).forEach((f) => fieldMap.set(Number(f.id), f))

    const attrOptionsAccum: Record<string, { attrId: number; optionId: number }[]> = {}
    for (const [rawKey, value] of sp.entries()) {
      const mList = rawKey.match(/^attr\[(\d+)\]\[\]$/)
      const mSingle = rawKey.match(/^attr\[(\d+)\]$/)
      if (mList || mSingle) {
        const attrId = Number((mList ?? mSingle)![1])
        if (!attrId) continue
        const vals = value.split(',').map((x) => x.trim()).filter(Boolean)
        vals.forEach((v) => {
          const optionId = Number(v)
          if (!Number.isFinite(optionId)) return
          const k = String(attrId)
          ;(attrOptionsAccum[k] ||= []).push({ attrId, optionId })
        })
      }
    }

    for (const groupKey of Object.keys(attrOptionsAccum)) {
      const entries = attrOptionsAccum[groupKey]
      const attrId = entries[0]?.attrId
      const field = fieldMap.get(attrId)
      if (!field) continue
      const opts = field.attributeOptions ?? []
      entries.forEach(({ optionId }) => {
        const opt = opts.find((o) => Number(o.id) === optionId)
        if (!opt) return
        list.push({
          id: `attr-${attrId}-${optionId}`,
          label: `${field.name}: ${opt.name}`,
          remove: [{ key: `attr[${attrId}][]`, value: String(optionId) }],
        })
      })
    }

    // Attribute range values: attr[<id>][from] / [to]
    const attrRangeAccum: Record<
      string,
      { attrId: number; from?: string; to?: string }
    > = {}
    for (const [rawKey, value] of sp.entries()) {
      const mFromTo = rawKey.match(/^attr\[(\d+)\]\[(from|to)\]$/)
      if (!mFromTo) continue
      const attrId = Number(mFromTo[1])
      const kind = mFromTo[2] as 'from' | 'to'
      if (!attrId) continue
      const k = String(attrId)
      attrRangeAccum[k] ||= { attrId }
      if (kind === 'from') attrRangeAccum[k].from = String(value).trim()
      else attrRangeAccum[k].to = String(value).trim()
    }
    for (const groupKey of Object.keys(attrRangeAccum)) {
      const { attrId, from, to } = attrRangeAccum[groupKey]
      if (!from && !to) continue
      const field = fieldMap.get(attrId)
      const name = field?.name ?? (locale === 'ar' ? 'خاصية' : 'Attribute')
      let label = ''
      if (from && to) label = `${name}: ${from} - ${to}`
      else if (from) label = locale === 'ar' ? `${name}: من ${from}` : `${name}: from ${from}`
      else if (to) label = locale === 'ar' ? `${name}: حتى ${to}` : `${name}: up to ${to}`
      list.push({
        id: `range-${attrId}`,
        label,
        remove: [
          { key: `attr[${attrId}][from]` },
          { key: `attr[${attrId}][to]` },
        ],
      })
    }

    return list
  }, [cities, fields, locale, searchParams, showQueryChip, showSortChip])

  const removeAll = () => {
    router.replace(pathname, { scroll: false })
  }

  const removeChip = (chip: Chip) => {
    const sp = new URLSearchParams(searchParams.toString())
    chip.remove.forEach(({ key, value }) => {
      if (value == null) {
        // delete all entries with this key
        // URLSearchParams.delete removes all occurrences of the key
        sp.delete(key)
      } else {
        // delete only one specific value (preserve others)
        const remaining = sp.getAll(key).filter((v) => v !== value)
        sp.delete(key)
        remaining.forEach((v) => sp.append(key, v))
      }
    })
    // Reset pagination after filter change
    sp.delete('page')
    const qs = sp.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  if (chips.length === 0) return null

  return (
    <div className={styles.activeChipsWrap} role="group" aria-label={locale === 'ar' ? 'الفلاتر النشطة' : 'Active filters'}>
      <span className={styles.activeChipsTitle}>
        {locale === 'ar' ? 'الفلاتر النشطة' : 'Active filters'}
      </span>
      <div className={styles.activeChipsList}>
        <AnimatePresence initial={false}>
          {chips.map((chip) => (
            <motion.button
              key={chip.id}
              type="button"
              className={styles.activeChip}
              onClick={() => removeChip(chip)}
              initial={{ opacity: 0, scale: 0.85, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -4 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              aria-label={(locale === 'ar' ? 'إزالة: ' : 'Remove: ') + chip.label}
            >
              <span className={styles.activeChipLabel}>{chip.label}</span>
              <BsXLg className={styles.activeChipClose} aria-hidden="true" />
            </motion.button>
          ))}
          {chips.length > 1 && (
            <motion.button
              key="__clear_all__"
              type="button"
              className={styles.clearAllBtn}
              onClick={removeAll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {locale === 'ar' ? 'مسح الكل' : 'Clear all'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
