'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, CardBody, Col, Form, Row } from 'react-bootstrap'
import { BsCheckCircleFill, BsChevronLeft, BsChevronRight, BsShieldCheck, BsStars } from 'react-icons/bs'
import styles from './storeOnboarding.module.css'
import type { SupportedLocale } from '@/lib/localization'
import { STORE_CATEGORIES } from '../mockStores'

type PackId = 'starter' | 'growth' | 'pro'

type Pack = {
  id: PackId
  name: { ar: string; en: string }
  price: { ar: string; en: string }
  ads_limit: number
  boosts: number
  highlights: string[]
  badge?: { ar: string; en: string }
}

const PACKS: Pack[] = [
  {
    id: 'starter',
    name: { ar: 'باقة البداية', en: 'Starter' },
    price: { ar: '10 د.أ / شهريًا', en: '$10 / month' },
    ads_limit: 15,
    boosts: 1,
    highlights: ['صفحة متجر', 'شارات ثقة', 'روابط تواصل'],
  },
  {
    id: 'growth',
    name: { ar: 'باقة النمو', en: 'Growth' },
    price: { ar: '25 د.أ / شهريًا', en: '$25 / month' },
    ads_limit: 50,
    boosts: 5,
    highlights: ['إعلانات أكثر', 'تمييزات متعددة', 'إحصائيات مبسطة'],
    badge: { ar: 'الأكثر اختيارًا', en: 'Most popular' },
  },
  {
    id: 'pro',
    name: { ar: 'باقة المحترفين', en: 'Pro' },
    price: { ar: '49 د.أ / شهريًا', en: '$49 / month' },
    ads_limit: 200,
    boosts: 20,
    highlights: ['تقارير متقدمة', 'أولوية ظهور', 'دعم مخصص'],
  },
]

function tr(v: { ar: string; en: string }, locale: SupportedLocale) {
  return locale === 'ar' ? v.ar : v.en
}

export default function StoreOnboardingClient({ locale }: { locale: SupportedLocale }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // form (UI only)
  const [name, setName] = useState(locale === 'ar' ? 'متجري الجديد' : 'My new store')
  const [category, setCategory] = useState(STORE_CATEGORIES[0]?.id ?? 'services')
  const [city, setCity] = useState(locale === 'ar' ? 'عمّان' : 'Amman')
  const [address, setAddress] = useState(locale === 'ar' ? 'أدخل العنوان...' : 'Enter address...')
  const [phone, setPhone] = useState('+96279')
  const [services, setServices] = useState<string[]>([])
  const [bizCats, setBizCats] = useState<string[]>([])
  const [pack, setPack] = useState<PackId>('growth')

  const servicesOptions = useMemo(
    () =>
      locale === 'ar'
        ? ['بيع', 'تأجير', 'صيانة', 'تمويل', 'استشارات', 'توصيل', 'تركيب']
        : ['Sales', 'Rentals', 'Repair', 'Financing', 'Consulting', 'Delivery', 'Setup'],
    [locale]
  )
  const bizOptions = useMemo(
    () =>
      locale === 'ar'
        ? ['سيارات', 'عقارات', 'إلكترونيات', 'أثاث', 'خدمات']
        : ['Cars', 'Real estate', 'Electronics', 'Furniture', 'Services'],
    [locale]
  )

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(name.trim()) && Boolean(city.trim()) && Boolean(address.trim())
    if (step === 2) return services.length > 0 && bizCats.length > 0
    if (step === 3) return Boolean(pack)
    return true
  }, [step, name, city, address, services, bizCats, pack])

  const selectedPack = PACKS.find((p) => p.id === pack) || PACKS[0]

  return (
    <div className={styles.shell}>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <h4 className="mb-0" style={{ fontWeight: 900 }}>
            {locale === 'ar' ? 'تسجيل متجر جديد' : 'Register a new store'}
          </h4>
          <div className="text-muted small">
            {locale === 'ar'
              ? 'واجهة خطوات عصرية — بدون API في هذه المرحلة.'
              : 'Modern step wizard — UI only for now.'}
          </div>
        </div>
        <Link href={`/${locale}/stores`} className="btn btn-outline-secondary btn-sm">
          {locale === 'ar' ? 'رجوع للمتاجر' : 'Back to stores'}
        </Link>
      </div>

      <div className={styles.stepper}>
        <StepItem locale={locale} index={1} active={step === 1} title={{ ar: 'بيانات المتجر', en: 'Basics' }} hint={{ ar: 'اسم/فئة/عنوان', en: 'Name/category/address' }} />
        <StepItem locale={locale} index={2} active={step === 2} title={{ ar: 'الخدمات والفئات', en: 'Services' }} hint={{ ar: 'ماذا تقدم؟', en: 'What you offer' }} />
        <StepItem locale={locale} index={3} active={step === 3} title={{ ar: 'اختيار باقة', en: 'Package' }} hint={{ ar: '3 باقات', en: '3 plans' }} />
        <StepItem locale={locale} index={4} active={step === 4} title={{ ar: 'مراجعة', en: 'Review' }} hint={{ ar: 'تأكيد نهائي', en: 'Final check' }} />
      </div>

      <Card className="border-0 shadow-sm mt-3">
        <CardBody>
          {step === 1 && (
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="small text-muted mb-1">{locale === 'ar' ? 'اسم المتجر' : 'Store name'}</Form.Label>
                <Form.Control value={name} onChange={(e) => setName(e.target.value)} style={{ borderRadius: 14 }} />
              </Col>
              <Col md={6}>
                <Form.Label className="small text-muted mb-1">{locale === 'ar' ? 'فئة المتجر' : 'Store category'}</Form.Label>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value as any)} style={{ borderRadius: 14 }}>
                  {STORE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {tr(c.name, locale)}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="small text-muted mb-1">{locale === 'ar' ? 'المدينة' : 'City'}</Form.Label>
                <Form.Control value={city} onChange={(e) => setCity(e.target.value)} style={{ borderRadius: 14 }} />
              </Col>
              <Col md={6}>
                <Form.Label className="small text-muted mb-1">{locale === 'ar' ? 'رقم الهاتف' : 'Phone'}</Form.Label>
                <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} style={{ borderRadius: 14 }} />
              </Col>
              <Col xs={12}>
                <Form.Label className="small text-muted mb-1">{locale === 'ar' ? 'العنوان' : 'Address'}</Form.Label>
                <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} style={{ borderRadius: 14 }} />
              </Col>
            </Row>
          )}

          {step === 2 && (
            <Row className="g-3">
              <Col lg={6}>
                <div className="fw-bold mb-2">{locale === 'ar' ? 'الخدمات المقدمة' : 'Services offered'}</div>
                <div className="d-flex flex-wrap gap-2">
                  {servicesOptions.map((x) => (
                    <button
                      key={x}
                      type="button"
                      className="btn btn-sm"
                      onClick={() => setServices((p) => (p.includes(x) ? p.filter((v) => v !== x) : [...p, x]))}
                      style={{
                        borderRadius: 999,
                        border: '1px solid rgba(15,23,42,0.12)',
                        background: services.includes(x) ? 'rgba(23,125,193,0.08)' : '#fff',
                        color: services.includes(x) ? '#177dc1' : 'rgba(15,23,42,0.80)',
                        fontWeight: 800,
                      }}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </Col>
              <Col lg={6}>
                <div className="fw-bold mb-2">{locale === 'ar' ? 'فئات عمل الشركة' : 'Business categories'}</div>
                <div className="d-flex flex-wrap gap-2">
                  {bizOptions.map((x) => (
                    <button
                      key={x}
                      type="button"
                      className="btn btn-sm"
                      onClick={() => setBizCats((p) => (p.includes(x) ? p.filter((v) => v !== x) : [...p, x]))}
                      style={{
                        borderRadius: 999,
                        border: '1px solid rgba(15,23,42,0.12)',
                        background: bizCats.includes(x) ? 'rgba(224,144,61,0.10)' : '#fff',
                        color: bizCats.includes(x) ? '#8c5019' : 'rgba(15,23,42,0.80)',
                        fontWeight: 800,
                      }}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </Col>
              <Col xs={12}>
                <div className="text-muted small">
                  {locale === 'ar'
                    ? 'اختر على الأقل خدمة واحدة وفئة واحدة.'
                    : 'Select at least 1 service and 1 category.'}
                </div>
              </Col>
            </Row>
          )}

          {step === 3 && (
            <div>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                <div>
                  <div className="fw-bold">{locale === 'ar' ? 'اختر باقة متجرك' : 'Choose your package'}</div>
                  <div className="text-muted small">
                    {locale === 'ar'
                      ? 'تختلف بعدد الإعلانات ووحدات التمييز وبعض المميزات.'
                      : 'Different ad limits, boosts, and features.'}
                  </div>
                </div>
                <span className={styles.badgeAccent}>
                  <BsShieldCheck className="me-1" />
                  {locale === 'ar' ? 'دفع آمن (واجهة)' : 'Secure payment (UI)'}
                </span>
              </div>

              <Row className="g-3 mt-1">
                {PACKS.map((p) => (
                  <Col key={p.id} md={4}>
                    <button
                      type="button"
                      className={`${styles.packCard} ${pack === p.id ? styles.packSelected : ''}`}
                      onClick={() => setPack(p.id)}
                      style={{ width: '100%', textAlign: 'start' }}
                    >
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <div className="fw-bold">{tr(p.name, locale)}</div>
                        {p.badge ? <span className={styles.badgeAccent}>{tr(p.badge, locale)}</span> : null}
                      </div>
                      <div className={`${styles.packPrice} mt-1`}>{tr(p.price, locale)}</div>
                      <div className="text-muted small mt-2">
                        {locale === 'ar' ? 'إعلانات' : 'Ads'}: <span className="fw-bold text-dark">{p.ads_limit}</span>
                        <span className="mx-2">•</span>
                        {locale === 'ar' ? 'تمييز' : 'Boosts'}: <span className="fw-bold" style={{ color: '#e0903d' }}>{p.boosts}</span>
                      </div>
                      <ul className="mt-2 mb-0">
                        {p.highlights.map((x) => (
                          <li key={x} className="text-muted small">
                            {x}
                          </li>
                        ))}
                      </ul>
                    </button>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="fw-bold mb-2">{locale === 'ar' ? 'مراجعة البيانات' : 'Review'}</div>
              <Row className="g-3">
                <Col lg={7}>
                  <Card className="border-0" style={{ background: 'rgba(15,23,42,0.03)' }}>
                    <CardBody>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">{locale === 'ar' ? 'اسم المتجر' : 'Name'}</span>
                        <span className="fw-bold">{name}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">{locale === 'ar' ? 'المدينة' : 'City'}</span>
                        <span className="fw-bold">{city}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">{locale === 'ar' ? 'الخدمات' : 'Services'}</span>
                        <span className="fw-bold">{services.length}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">{locale === 'ar' ? 'الفئات' : 'Categories'}</span>
                        <span className="fw-bold">{bizCats.length}</span>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={5}>
                  <Card className="border-0 shadow-sm">
                    <CardBody>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="fw-bold">{locale === 'ar' ? 'الباقة المختارة' : 'Selected plan'}</div>
                        <span className={styles.badgeAccent}>
                          <BsStars className="me-1" />
                          {locale === 'ar' ? 'تمييز' : 'Boost'}
                        </span>
                      </div>
                      <div className="fw-bold">{tr(selectedPack.name, locale)}</div>
                      <div className="text-muted small">{tr(selectedPack.price, locale)}</div>
                      <hr />
                      <div className="text-muted small">
                        {locale === 'ar' ? 'عدد الإعلانات' : 'Ads'}: <span className="fw-bold text-dark">{selectedPack.ads_limit}</span>
                      </div>
                      <div className="text-muted small">
                        {locale === 'ar' ? 'وحدات التمييز' : 'Boosts'}: <span className="fw-bold" style={{ color: '#e0903d' }}>{selectedPack.boosts}</span>
                      </div>
                      <button
                        className="btn btn-primary w-100 mt-3"
                        style={{ backgroundColor: '#177dc1', borderColor: '#177dc1', borderRadius: 14, fontWeight: 900 }}
                        onClick={() => alert(locale === 'ar' ? 'تم إرسال الطلب (واجهة فقط).' : 'Submitted (UI only).')}
                      >
                        <BsCheckCircleFill className="me-2" />
                        {locale === 'ar' ? 'تأكيد التسجيل' : 'Confirm registration'}
                      </button>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn btn-outline-secondary"
              style={{ borderRadius: 14 }}
              disabled={step === 1}
              onClick={() => setStep((s) => (s === 1 ? 1 : ((s - 1) as any)))}
            >
              <BsChevronLeft className="me-1" />
              {locale === 'ar' ? 'السابق' : 'Back'}
            </button>

            <button
              className="btn btn-primary"
              style={{ backgroundColor: '#177dc1', borderColor: '#177dc1', borderRadius: 14, fontWeight: 900 }}
              disabled={!canNext}
              onClick={() => setStep((s) => (s === 4 ? 4 : ((s + 1) as any)))}
            >
              {locale === 'ar' ? 'التالي' : 'Next'}
              <BsChevronRight className="ms-1" />
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function StepItem({
  locale,
  index,
  active,
  title,
  hint,
}: {
  locale: SupportedLocale
  index: number
  active: boolean
  title: { ar: string; en: string }
  hint: { ar: string; en: string }
}) {
  return (
    <div className={`${styles.step} ${active ? styles.stepActive : ''}`}>
      <div className={styles.stepDot}>{index}</div>
      <div style={{ minWidth: 0 }}>
        <div className={styles.stepTitle}>{tr(title, locale)}</div>
        <div className={styles.stepHint}>{tr(hint, locale)}</div>
      </div>
    </div>
  )
}

