'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'

import type { City } from '@/lib/api/cities'
import styles from './filters.module.css'

type Locale = 'ar' | 'en'
type ImagesChoice = 'all' | 'with' | 'without'

type Props = {
  locale: Locale
  cities: City[]
  /** If true the panel applies on every change without needing "Apply". */
  instant?: boolean
  /** Called after apply so callers can e.g. close a modal. */
  onApply?: () => void
}

function parseNumber(v: string | null | undefined): string {
  if (!v) return ''
  return v
}

export default function SectionFiltersPanel({ locale, cities, instant = false, onApply }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initial = useMemo(() => {
    const hasImagesRaw = searchParams.get('has_images')
    const images: ImagesChoice =
      hasImagesRaw === '1' || hasImagesRaw === 'true'
        ? 'with'
        : hasImagesRaw === '0' || hasImagesRaw === 'false'
          ? 'without'
          : 'all'
    return {
      cityId: parseNumber(searchParams.get('city_id')),
      priceMin: parseNumber(searchParams.get('price_min')),
      priceMax: parseNumber(searchParams.get('price_max')),
      images,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [cityId, setCityId] = useState<string>(initial.cityId)
  const [priceMin, setPriceMin] = useState<string>(initial.priceMin)
  const [priceMax, setPriceMax] = useState<string>(initial.priceMax)
  const [images, setImages] = useState<ImagesChoice>(initial.images)

  const text = useMemo(
    () =>
      locale === 'ar'
        ? {
            title: 'فلترة النتائج',
            sub: 'المدينة، نطاق السعر، وحالة الصور',
            city: 'المدينة',
            allCities: 'كل المدن',
            price: 'نطاق السعر',
            from: 'من',
            to: 'إلى',
            images: 'صور المنشور',
            all: 'الكل',
            withImages: 'بصور',
            withoutImages: 'بدون صور',
            apply: 'تطبيق',
            reset: 'إعادة تعيين',
          }
        : {
            title: 'Filter results',
            sub: 'City, price range, and image state',
            city: 'City',
            allCities: 'All cities',
            price: 'Price range',
            from: 'From',
            to: 'To',
            images: 'Post images',
            all: 'All',
            withImages: 'With images',
            withoutImages: 'Without images',
            apply: 'Apply',
            reset: 'Reset',
          },
    [locale],
  )

  const apply = (overrides?: {
    cityId?: string
    priceMin?: string
    priceMax?: string
    images?: ImagesChoice
  }) => {
    const sp = new URLSearchParams(searchParams.toString())
    const nextCity = overrides?.cityId ?? cityId
    const nextMin = overrides?.priceMin ?? priceMin
    const nextMax = overrides?.priceMax ?? priceMax
    const nextImages = overrides?.images ?? images

    // City
    if (nextCity.trim()) sp.set('city_id', nextCity.trim())
    else sp.delete('city_id')

    // Price
    if (nextMin.trim()) sp.set('price_min', nextMin.trim())
    else sp.delete('price_min')
    if (nextMax.trim()) sp.set('price_max', nextMax.trim())
    else sp.delete('price_max')

    // Images
    if (nextImages === 'with') sp.set('has_images', '1')
    else if (nextImages === 'without') sp.set('has_images', '0')
    else sp.delete('has_images')

    sp.delete('page')
    const qs = sp.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    onApply?.()
  }

  const resetAll = () => {
    setCityId('')
    setPriceMin('')
    setPriceMax('')
    setImages('all')
    const sp = new URLSearchParams(searchParams.toString())
    sp.delete('city_id')
    sp.delete('price_min')
    sp.delete('price_max')
    sp.delete('has_images')
    sp.delete('page')
    const qs = sp.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    onApply?.()
  }

  const onImagesClick = (next: ImagesChoice) => {
    setImages(next)
    if (instant) apply({ images: next })
  }

  return (
    <motion.div
      className={styles.sectionFiltersCard}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
    >
      <div className={styles.sectionFiltersHeader}>
        <div>
          <h2 className={styles.sectionFiltersTitle}>{text.title}</h2>
          <p className={styles.sectionFiltersSub}>{text.sub}</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          apply()
        }}
      >
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="city_id">
            {text.city}
          </label>
          <select
            id="city_id"
            className={styles.fieldSelect}
            value={cityId}
            onChange={(e) => {
              setCityId(e.target.value)
              if (instant) apply({ cityId: e.target.value })
            }}
          >
            <option value="">{text.allCities}</option>
            {cities.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>{text.price}</label>
          <div className={styles.fieldRow}>
            <input
              type="text"
              inputMode="numeric"
              className={styles.fieldInput}
              placeholder={text.from}
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              onBlur={() => {
                if (instant) apply()
              }}
            />
            <input
              type="text"
              inputMode="numeric"
              className={styles.fieldInput}
              placeholder={text.to}
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              onBlur={() => {
                if (instant) apply()
              }}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>{text.images}</label>
          <div className={styles.imagesToggleGroup}>
            <button
              type="button"
              className={[styles.imagesToggleBtn, images === 'all' ? styles.imagesToggleBtnActive : ''].filter(Boolean).join(' ')}
              onClick={() => onImagesClick('all')}
            >
              {text.all}
            </button>
            <button
              type="button"
              className={[styles.imagesToggleBtn, images === 'with' ? styles.imagesToggleBtnActive : ''].filter(Boolean).join(' ')}
              onClick={() => onImagesClick('with')}
            >
              {text.withImages}
            </button>
            <button
              type="button"
              className={[styles.imagesToggleBtn, images === 'without' ? styles.imagesToggleBtnActive : ''].filter(Boolean).join(' ')}
              onClick={() => onImagesClick('without')}
            >
              {text.withoutImages}
            </button>
          </div>
        </div>

        <div className={styles.filtersActions}>
          <button type="submit" className={styles.applyBtn}>
            {text.apply}
          </button>
          <button type="button" className={styles.resetBtn} onClick={resetAll}>
            {text.reset}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
