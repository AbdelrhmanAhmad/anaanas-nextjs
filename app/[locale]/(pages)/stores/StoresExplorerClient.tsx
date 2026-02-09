'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody, Col, Form, Row } from 'react-bootstrap'
import { BsCheckCircleFill, BsGeoAlt, BsGlobe2, BsSearch, BsStarFill } from 'react-icons/bs'
import { BsFacebook, BsInstagram, BsYoutube } from 'react-icons/bs'
import { SiTiktok } from 'react-icons/si'
import styles from './stores.module.css'
import { MOCK_STORES, STORE_CATEGORIES, type StoreCategoryId, type StoreRecord } from './mockStores'
import type { SupportedLocale } from '@/lib/localization'

function tr<T extends { ar: string; en: string }>(v: T | undefined, locale: SupportedLocale) {
  if (!v) return ''
  return locale === 'ar' ? v.ar : v.en
}

function categoryLabel(id: StoreCategoryId, locale: SupportedLocale) {
  return tr(STORE_CATEGORIES.find((c) => c.id === id)?.name, locale) || id
}

function num(n?: number) {
  try {
    return new Intl.NumberFormat().format(Number(n ?? 0))
  } catch {
    return String(n ?? 0)
  }
}

export default function StoresExplorerClient({ locale }: { locale: SupportedLocale }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<StoreCategoryId | 'all'>('all')
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [onlyOpen, setOnlyOpen] = useState(false)

  const categories = useMemo(() => [{ id: 'all' as const, name: { ar: 'الكل', en: 'All' } }, ...STORE_CATEGORIES], [])

  const stores = useMemo(() => {
    const query = q.trim().toLowerCase()
    return MOCK_STORES.filter((s) => {
      if (cat !== 'all' && s.category !== cat) return false
      if (onlyVerified && !s.is_verified) return false
      if (onlyOpen && !s.is_open_now) return false
      if (!query) return true
      const hay = `${tr(s.name, locale)} ${tr(s.city, locale)} ${tr(s.address, locale)} ${categoryLabel(s.category, locale)}`
      return hay.toLowerCase().includes(query)
    })
  }, [q, cat, onlyVerified, onlyOpen, locale])

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="d-flex align-items-center gap-3">
          <div className={styles.brandDot} aria-hidden="true">
            S
          </div>
          <div className="flex-grow-1">
            <div className="fw-black" style={{ fontWeight: 900 }}>
              {locale === 'ar' ? 'استعراض المتاجر' : 'Browse stores'}
            </div>
            <div className="text-muted small">
              {locale === 'ar'
                ? 'فلترة حسب فئة المتجر، حالة التوثيق، وفتح/إغلاق.'
                : 'Filter by category, verification, and open status.'}
            </div>
          </div>
        </div>

        <Row className="g-2 align-items-end mt-2">
          <Col xs={12} md={6}>
            <div className="position-relative">
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(15,23,42,0.55)' }}>
                <BsSearch />
              </span>
              <Form.Control
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={locale === 'ar' ? 'ابحث عن متجر (اسم/مدينة/فئة)…' : 'Search stores (name/city/category)…'}
                style={{ paddingLeft: 38, borderRadius: 14 }}
              />
            </div>
          </Col>
          <Col xs={12} md={6} className="d-flex gap-2 flex-wrap justify-content-md-end align-items-center">
            <Form.Check
              type="switch"
              id="verified"
              label={locale === 'ar' ? 'الموثّقة فقط' : 'Verified only'}
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
            />
            <Form.Check
              type="switch"
              id="open"
              label={locale === 'ar' ? 'المفتوحة الآن' : 'Open now'}
              checked={onlyOpen}
              onChange={(e) => setOnlyOpen(e.target.checked)}
            />
            <Link
              href={`/${locale}/stores/new`}
              className="btn btn-sm"
              style={{ backgroundColor: '#177dc1', borderColor: '#177dc1', color: '#fff', borderRadius: 12 }}
            >
              {locale === 'ar' ? 'سجّل متجرك' : 'Register store'}
            </Link>
          </Col>
        </Row>

        <div className="d-flex flex-wrap gap-2 mt-3">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.filterPill} ${cat === c.id ? styles.filterPillActive : ''}`}
              onClick={() => setCat(c.id)}
            >
              {tr(c.name, locale)}
            </button>
          ))}
        </div>
      </div>

      <Row className="g-3 mt-1">
        {stores.map((s) => (
          <Col key={s.slug} xs={12} md={6} lg={4}>
            <StoreCard locale={locale} store={s} />
          </Col>
        ))}
        {stores.length === 0 && (
          <Col xs={12}>
            <div className="text-muted text-center py-5">{locale === 'ar' ? 'لا توجد متاجر مطابقة.' : 'No stores match your filters.'}</div>
          </Col>
        )}
      </Row>
    </div>
  )
}

function StoreCard({ locale, store }: { locale: SupportedLocale; store: StoreRecord }) {
  const name = tr(store.name, locale)
  const city = tr(store.city, locale)
  const address = tr(store.address, locale)
  const catLabel = categoryLabel(store.category, locale)
  const services = (store.services_offered ? (locale === 'ar' ? store.services_offered.ar : store.services_offered.en) : []).slice(0, 3)
  const socials = store.socials ?? {}

  return (
    <Card className={styles.storeCard}>
      <div className={styles.cover}>
        {store.cover_image_url ? (
          <Image
            src={store.cover_image_url}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            style={{ objectFit: 'cover' }}
          />
        ) : null}
      </div>
      <CardBody>
          <div className="d-flex align-items-start justify-content-between gap-2">
            <div className="d-flex align-items-center gap-3">
              <div className={styles.logo} aria-hidden="true">
                {store.logo_image_url ? (
                  <Image src={store.logo_image_url} alt="" width={54} height={54} />
                ) : (
                  <span style={{ color: '#177dc1', fontWeight: 900 }}>{name?.slice(0, 1) || 'S'}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <Link href={`/${locale}/stores/${store.slug}`} className="fw-bold text-dark text-truncate text-decoration-none" style={{ maxWidth: 190 }}>
                    {name}
                  </Link>
                  {store.is_verified && (
                    <span className={`${styles.badge} ${styles.badgeBrand}`}>
                      <BsCheckCircleFill className="me-1" />
                      {locale === 'ar' ? 'موثّق' : 'Verified'}
                    </span>
                  )}
                </div>
                <div className="text-muted small text-truncate" style={{ maxWidth: 240 }}>
                  <BsGeoAlt className="me-1" />
                  {city} • {address}
                </div>
              </div>
            </div>

            <span className={`${styles.badge} ${store.is_open_now ? styles.badgeBrand : styles.badgeWarn}`}>
              {store.is_open_now ? (locale === 'ar' ? 'مفتوح' : 'Open') : locale === 'ar' ? 'مغلق' : 'Closed'}
            </span>
          </div>

          {services.length ? (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {services.map((s) => (
                <span key={s} className={styles.serviceChip}>
                  {s}
                </span>
              ))}
            </div>
          ) : null}

          <div className="d-flex align-items-center justify-content-between mt-3">
            <span className={styles.badge}>{catLabel}</span>
            <div className="d-flex align-items-center gap-2 text-muted small">
              <BsStarFill style={{ color: '#edc66e' }} />
              <span className="fw-semibold text-dark">{Number(store.rating ?? 0).toFixed(1)}</span>
              <span>({num(store.reviews_count)})</span>
              <span className="mx-1">•</span>
              <span>{locale === 'ar' ? 'متابع' : 'followers'}: {num(store.followers_count)}</span>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex gap-2">
              {store.website ? (
                <a className={styles.socialBtn} href={store.website} target="_blank" rel="noreferrer" title="Website">
                  <BsGlobe2 />
                </a>
              ) : null}
              {socials.facebook ? (
                <a className={styles.socialBtn} href={socials.facebook} target="_blank" rel="noreferrer" title="Facebook">
                  <BsFacebook />
                </a>
              ) : null}
              {socials.instagram ? (
                <a className={styles.socialBtn} href={socials.instagram} target="_blank" rel="noreferrer" title="Instagram">
                  <BsInstagram />
                </a>
              ) : null}
              {socials.tiktok ? (
                <a className={styles.socialBtn} href={socials.tiktok} target="_blank" rel="noreferrer" title="TikTok">
                  <SiTiktok />
                </a>
              ) : null}
              {socials.youtube ? (
                <a className={styles.socialBtn} href={socials.youtube} target="_blank" rel="noreferrer" title="YouTube">
                  <BsYoutube />
                </a>
              ) : null}
            </div>
            <Link href={`/${locale}/stores/${store.slug}`} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 12 }}>
              {locale === 'ar' ? 'عرض' : 'View'}
            </Link>
          </div>
      </CardBody>
    </Card>
  )
}

