'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation'
import clsx from 'clsx'
import Select from 'react-select'

import type { City } from '@/lib/api/cities'
import type { Field, SubField } from '@/lib/api/fields'
import { fetchSubFields } from '@/lib/api/fields'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import type { SupportedLocale } from '@/lib/localization'
import { t } from '@/lib/translations'

type AttrSelection = Record<number, number[]>
type AttrRange = Record<number, { from?: string; to?: string }>

function parseNumber(val: string | null | undefined): number | undefined {
  if (val == null || val === '') return undefined
  const n = Number(val)
  return Number.isFinite(n) ? n : undefined
}

function parseAttrSelections(sp: URLSearchParams): { options: AttrSelection; ranges: AttrRange } {
  const options: AttrSelection = {}
  const ranges: AttrRange = {}

  for (const [rawKey, value] of sp.entries()) {
    // Preferred format:
    // attr[795][]=11880&attr[795][]=11881
    // attr[900][from]=10&attr[900][to]=20
    const mList = rawKey.match(/^attr\[(\d+)\]\[\]$/)
    const mSingle = rawKey.match(/^attr\[(\d+)\]$/)
    const mFromTo = rawKey.match(/^attr\[(\d+)\]\[(from|to)\]$/)

    if (mList || mSingle) {
      const attrId = Number((mList ?? mSingle)![1])
      if (!attrId) continue
      const parts = value.split(',').map((x) => x.trim()).filter(Boolean)
      const nums = parts.map((p) => Number(p)).filter((n) => Number.isFinite(n)) as number[]
      if (!nums.length) continue
      options[attrId] = Array.from(new Set([...(options[attrId] ?? []), ...nums]))
      continue
    }

    if (mFromTo) {
      const attrId = Number(mFromTo[1])
      const kind = mFromTo[2] as 'from' | 'to'
      if (!attrId) continue
      const v = String(value ?? '').trim()
      if (!v) continue
      ranges[attrId] = { ...(ranges[attrId] ?? {}), [kind]: v }
      continue
    }

    // Backward compatibility: old a795=11880
    if (rawKey.startsWith('a')) {
      const keyWithoutBrackets = rawKey.replace(/\[\]$/, '')
      const attrId = Number(keyWithoutBrackets.slice(1))
      if (!attrId) continue
      const parts = value.split(',').map((x) => x.trim()).filter(Boolean)
      const nums = parts.map((p) => Number(p)).filter((n) => Number.isFinite(n)) as number[]
      if (!nums.length) continue
      options[attrId] = Array.from(new Set([...(options[attrId] ?? []), ...nums]))
    }
  }

  return { options, ranges }
}

export default function PostsFilterPanel({
  fields,
  cities,
  onClick,
}: {
  fields: Field[]
  cities: City[]
  onClick?: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams<{ locale?: string }>()
  
  // Get locale from params
  const locale: SupportedLocale = useMemo(() => {
    const localeFromParams = Array.isArray(params?.locale) ? params.locale[0] : params?.locale
    if (localeFromParams && isSupportedLocale(localeFromParams)) {
      return localeFromParams
    }
    if (pathname) {
      const segments = pathname.split('/').filter(Boolean)
      const maybeLocale = segments[0]
      if (isSupportedLocale(maybeLocale)) {
        return maybeLocale
      }
    }
    return DEFAULT_LOCALE
  }, [params?.locale, pathname])

  const initial = useMemo(() => {
    const sp = new URLSearchParams(searchParams.toString())
    const hasImagesRaw = sp.get('has_images')
    const hasImages: 'all' | 'with' | 'without' =
      hasImagesRaw === '1' || hasImagesRaw === 'true'
        ? 'with'
        : hasImagesRaw === '0' || hasImagesRaw === 'false'
          ? 'without'
          : 'all'
    const sort = (sp.get('sort') as 'newest' | 'oldest' | 'price_asc' | 'price_desc' | null) ?? 'newest'
    return {
      cityId: parseNumber(sp.get('city_id')),
      priceMin: sp.get('price_min') ?? '',
      priceMax: sp.get('price_max') ?? '',
      hasImages,
      sort: ['newest', 'oldest', 'price_asc', 'price_desc'].includes(sort) ? sort : 'newest',
      parsed: parseAttrSelections(sp),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [cityId, setCityId] = useState<number | undefined>(initial.cityId)
  const [priceMin, setPriceMin] = useState<string>(initial.priceMin)
  const [priceMax, setPriceMax] = useState<string>(initial.priceMax)
  const [hasImages, setHasImages] = useState<'all' | 'with' | 'without'>(initial.hasImages)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_asc' | 'price_desc'>(initial.sort)
  const [attrs, setAttrs] = useState<AttrSelection>(initial.parsed.options)
  const [ranges, setRanges] = useState<AttrRange>(initial.parsed.ranges)

  // Nested sub-fields keyed by `${parentAttrId}_${optionId}`
  const [nestedFields, setNestedFields] = useState<Record<string, SubField[]>>({})

  const clearNestedSubtree = (currentPath: string) => {
    // Remove nested fields under this path and clear their selected values from attrs
    const keysToRemove = Object.keys(nestedFields).filter(
      (k) => k.startsWith(`${currentPath}_`) || k.startsWith(`${currentPath}.`)
    )
    if (keysToRemove.length === 0) return

    const subAttrIds = new Set<number>()
    keysToRemove.forEach((k) => {
      const arr = nestedFields[k]
      if (Array.isArray(arr)) {
        arr.forEach((sf) => {
          if (sf?.id) subAttrIds.add(Number(sf.id))
        })
      }
    })

    setNestedFields((prev) => {
      const next = { ...prev }
      keysToRemove.forEach((k) => delete next[k])
      return next
    })

    if (subAttrIds.size > 0) {
      setAttrs((prev) => {
        const next = { ...prev }
        for (const id of subAttrIds) {
          delete next[id]
        }
        return next
      })
    }
  }

  // Load nested sub-fields based on current selections (single-select only)
  useEffect(() => {
    let cancelled = false

    async function ensureNestedForField(field: Field | SubField, parentPath: string) {
      const selected = attrs[field.id]
      if (!selected || selected.length === 0) {
        // nothing selected -> clear any previously loaded subtree
        const currentPath = parentPath ? `${parentPath}.${field.key_name}` : field.key_name
        clearNestedSubtree(currentPath)
        return
      }

      // Rule: if multi selected, do NOT fetch nested and remove nested subtree from filter
      if (selected.length > 1) {
        const currentPath = parentPath ? `${parentPath}.${field.key_name}` : field.key_name
        clearNestedSubtree(currentPath)
        return
      }

      const selectedOptId = selected[0]

      const opt = field.attributeOptions?.find((o) => Number(o.id) === Number(selectedOptId))
      if (!opt || !opt.children_count || opt.children_count <= 0) return

      const currentPath = parentPath ? `${parentPath}.${field.key_name}` : field.key_name
      const nestedKey = `${currentPath}_${field.id}_${selectedOptId}`

      if (nestedFields[nestedKey]) return

      try {
        const sub = await fetchSubFields(selectedOptId, field.id, locale)
        if (cancelled) return
        setNestedFields((prev) => ({ ...prev, [nestedKey]: sub }))
      } catch (e) {
        // ignore
      }
    }

    ;(async () => {
      for (const f of fields) {
        await ensureNestedForField(f, '')
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, attrs])

  const hasAnyFilter = useMemo(() => {
    if (cityId) return true
    if (priceMin.trim() || priceMax.trim()) return true
    if (hasImages !== 'all') return true
    if (sortBy !== 'newest') return true
    return Object.values(attrs).some((arr) => Array.isArray(arr) && arr.length > 0)
      || Object.values(ranges).some((r) => Boolean(r?.from?.trim() || r?.to?.trim()))
  }, [cityId, priceMin, priceMax, hasImages, sortBy, attrs, ranges])

  const applyToUrl = () => {
    const sp = new URLSearchParams()

    if (cityId) sp.set('city_id', String(cityId))
    if (priceMin.trim()) sp.set('price_min', priceMin.trim())
    if (priceMax.trim()) sp.set('price_max', priceMax.trim())
    if (hasImages === 'with') sp.set('has_images', '1')
    if (hasImages === 'without') sp.set('has_images', '0')
    if (sortBy !== 'newest') sp.set('sort', sortBy)

    for (const [attrIdRaw, optionIds] of Object.entries(attrs)) {
      const attrId = Number(attrIdRaw)
      if (!attrId || !Array.isArray(optionIds) || optionIds.length === 0) continue
      // Preferred format (Laravel parses this into $request->query('attr')):
      // attr[795][]=11880&attr[795][]=11881
      optionIds.forEach((optId) => sp.append(`attr[${attrId}][]`, String(optId)))
    }

    for (const [attrIdRaw, r] of Object.entries(ranges)) {
      const attrId = Number(attrIdRaw)
      if (!attrId || !r) continue
      if (r.from?.trim()) sp.set(`attr[${attrId}][from]`, r.from.trim())
      if (r.to?.trim()) sp.set(`attr[${attrId}][to]`, r.to.trim())
    }

    const qs = sp.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    onClick?.()
  }

  const toggleOption = (attrId: number, optionId: number, multi: boolean) => {
    setAttrs((prev) => {
      const current = prev[attrId] ?? []
      if (!multi) {
        const next = current.includes(optionId) ? [] : [optionId]
        return { ...prev, [attrId]: next }
      }
      const next = current.includes(optionId) ? current.filter((x) => x !== optionId) : [...current, optionId]
      return { ...prev, [attrId]: next }
    })
  }

  const renderField = (field: Field | SubField, parentPath: string) => {
    const selected = attrs[field.id] ?? []
    const currentPath = parentPath ? `${parentPath}.${field.key_name}` : field.key_name
    const selectedSingle = selected.length === 1 ? selected[0] : undefined
    const nestedKey = selectedSingle ? `${currentPath}_${field.id}_${selectedSingle}` : null
    const children = nestedKey ? nestedFields[nestedKey] : undefined

    const hasOptions = Array.isArray(field.attributeOptions) && field.attributeOptions.length > 0
    const options =
      hasOptions
        ? (field.attributeOptions ?? []).map((opt) => ({
            value: Number(opt.id),
            label: opt.name,
            childrenCount: Number(opt.children_count ?? 0),
          }))
        : []

    const value = options.filter((o) => selected.includes(o.value))

    return (
      <div key={`${field.id}-${currentPath}`} className="mb-3">
        <div className="fw-semibold mb-2">{field.name}</div>
        {hasOptions ? (
          <Select
            isMulti
            isSearchable
            isClearable
            options={options as any}
            value={value as any}
            onChange={(items) => {
              const next = Array.isArray(items) ? items.map((x: any) => Number(x.value)).filter((n) => Number.isFinite(n)) : []
              // If multiple selected: clear subtree immediately and do not fetch nested
              if (next.length > 1) {
                clearNestedSubtree(currentPath)
              }
              // Clear any range values for this field
              setRanges((prev) => {
                const copy = { ...prev }
                delete copy[field.id]
                return copy
              })
              setAttrs((prev) => ({ ...prev, [field.id]: next }))
            }}
            placeholder={`${t('filter.selectField', locale)} ${field.name}`}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: 12,
                minHeight: 42,
                borderColor: state.isFocused ? '#0d6efd' : base.borderColor,
                boxShadow: state.isFocused ? '0 0 0 0.15rem rgba(13,110,253,.15)' : 'none',
              }),
              multiValue: (base) => ({
                ...base,
                borderRadius: 10,
              }),
              menu: (base) => ({
                ...base,
                zIndex: 20,
              }),
            }}
          />
        ) : (
          <div className="d-flex gap-2">
            <input
              className="form-control"
              placeholder={t('filter.from', locale)}
              value={ranges[field.id]?.from ?? ''}
              onChange={(e) => {
                const v = e.target.value
                setRanges((prev) => ({ ...prev, [field.id]: { ...(prev[field.id] ?? {}), from: v } }))
                // Clear option selections for this field
                setAttrs((prev) => {
                  const copy = { ...prev }
                  delete copy[field.id]
                  return copy
                })
                clearNestedSubtree(currentPath)
              }}
            />
            <input
              className="form-control"
              placeholder={t('filter.to', locale)}
              value={ranges[field.id]?.to ?? ''}
              onChange={(e) => {
                const v = e.target.value
                setRanges((prev) => ({ ...prev, [field.id]: { ...(prev[field.id] ?? {}), to: v } }))
                setAttrs((prev) => {
                  const copy = { ...prev }
                  delete copy[field.id]
                  return copy
                })
                clearNestedSubtree(currentPath)
              }}
            />
          </div>
        )}

        {/* Nested sub-fields appear ONLY when exactly 1 option is selected */}
        {hasOptions && selected.length === 1 && Array.isArray(children) && children.length > 0 && (
          <div className="mt-3 ps-3 border-start border-2 border-primary">
            {children.map((sf) => renderField(sf, currentPath))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        position: 'sticky',
        top: 90,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          height: 3,
          background: 'linear-gradient(90deg, #151515 0%, #fecb01 55%, #151515 100%)',
        }}
      />
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <div className="h6 mb-0 fw-bold">{t('filter.filterResults', locale)}</div>
            <div className="text-muted small">{t('filter.filterDescription', locale)}</div>
          </div>
          {hasAnyFilter && (
            <a
              className="btn btn-sm btn-outline-dark rounded-pill px-3"
              href={pathname}
              style={{ fontWeight: 700 }}
            >
              {t('filter.reset', locale)}
            </a>
          )}
        </div>

        <form
          method="GET"
          action={pathname}
          onSubmit={(e) => {
            e.preventDefault()
            applyToUrl()
          }}
        >
          <div className="mb-3">
            <label className="form-label fw-semibold">{t('filter.city', locale)}</label>
            <select
              className="form-select"
              name="city_id"
              value={cityId ? String(cityId) : ''}
              onChange={(e) => setCityId(parseNumber(e.target.value))}
            >
              <option value="">{t('filter.allCities', locale)}</option>
              {cities.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">{t('filter.priceRange', locale)}</label>
            <div className="d-flex gap-2">
              <input
                className="form-control"
                inputMode="numeric"
                name="price_min"
                placeholder={t('filter.from', locale)}
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <input
                className="form-control"
                inputMode="numeric"
                name="price_max"
                placeholder={t('filter.to', locale)}
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">{t('filter.postImages', locale)}</label>
            <select
              className="form-select"
              value={hasImages}
              onChange={(e) => setHasImages(e.target.value as 'all' | 'with' | 'without')}
            >
              <option value="all">{t('filter.allPosts', locale)}</option>
              <option value="with">{t('filter.withImages', locale)}</option>
              <option value="without">{t('filter.withoutImages', locale)}</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">{t('filter.sortBy', locale)}</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'newest' | 'oldest' | 'price_asc' | 'price_desc')
              }
            >
              <option value="newest">{t('filter.sortNewest', locale)}</option>
              <option value="oldest">{t('filter.sortOldest', locale)}</option>
              <option value="price_asc">{t('filter.sortPriceLowToHigh', locale)}</option>
              <option value="price_desc">{t('filter.sortPriceHighToLow', locale)}</option>
            </select>
          </div>

          <div className="mt-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-label fw-semibold mb-0">{t('filter.postAttributes', locale)}</div>
              <button
                type="button"
                className="btn btn-sm rounded-pill px-3"
                onClick={applyToUrl}
                style={{
                  background: '#177dc1',
                  color: '#fff',
                  fontWeight: 800,
                  border: 'none',
                }}
              >
                {t('filter.apply', locale)}
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="text-muted small">{t('filter.noAttributesAvailable', locale)}</div>
            ) : (
              <div style={{ maxHeight: 520, overflow: 'auto' }} className="pe-2">
                {fields
                  .slice()
                  .sort((a, b) => a.sort - b.sort)
                  .map((f) => renderField(f, ''))}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}


