'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { BsSortDown } from 'react-icons/bs'

import styles from './filters.module.css'

type SortKey = 'newest' | 'oldest' | 'price_asc' | 'price_desc'

type Locale = 'ar' | 'en'

type Props = {
  locale: Locale
  /** Optional label above the bar (e.g. category name or filtered summary). */
  heading?: string
  /** Optional subtitle rendered next to the heading. */
  subtitle?: string
  /** Trailing action slot (e.g. mobile filters toggle). */
  trailing?: React.ReactNode
}

const SORTS: ReadonlyArray<SortKey> = ['newest', 'oldest', 'price_asc', 'price_desc']

export default function ResultsSummaryBar({ locale, heading, subtitle, trailing }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortLabels: Record<SortKey, string> = useMemo(
    () =>
      locale === 'ar'
        ? {
            newest: 'الأحدث',
            oldest: 'الأقدم',
            price_asc: 'السعر ↑',
            price_desc: 'السعر ↓',
          }
        : {
            newest: 'Newest',
            oldest: 'Oldest',
            price_asc: 'Price ↑',
            price_desc: 'Price ↓',
          },
    [locale],
  )

  const currentSort: SortKey = useMemo(() => {
    const v = searchParams.get('sort') ?? 'newest'
    return (SORTS as readonly string[]).includes(v) ? (v as SortKey) : 'newest'
  }, [searchParams])

  const onSortChange = useCallback(
    (next: SortKey) => {
      if (next === currentSort) return
      const sp = new URLSearchParams(searchParams.toString())
      if (next === 'newest') sp.delete('sort')
      else sp.set('sort', next)
      sp.delete('page')
      const qs = sp.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [currentSort, pathname, router, searchParams],
  )

  return (
    <motion.div
      className={styles.summaryBar}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      <div className={styles.summaryBarLeft}>
        {heading && <div className={styles.summaryHeading}>{heading}</div>}
        {subtitle && <div className={styles.summarySubtitle}>{subtitle}</div>}
      </div>
      <div className={styles.summaryBarRight}>
        <div className={styles.sortGroup} role="group" aria-label={locale === 'ar' ? 'ترتيب النتائج' : 'Sort results'}>
          <BsSortDown className={styles.sortIcon} aria-hidden="true" />
          {SORTS.map((key) => (
            <button
              key={key}
              type="button"
              className={[styles.sortPill, key === currentSort ? styles.sortPillActive : ''].filter(Boolean).join(' ')}
              onClick={() => onSortChange(key)}
              aria-pressed={key === currentSort}
            >
              {sortLabels[key]}
            </button>
          ))}
        </div>
        {trailing && <div className={styles.summaryTrailing}>{trailing}</div>}
      </div>
    </motion.div>
  )
}
