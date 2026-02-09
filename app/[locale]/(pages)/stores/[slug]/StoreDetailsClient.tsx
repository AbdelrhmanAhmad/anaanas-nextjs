'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardBody, Col, Row, Tab, Tabs } from 'react-bootstrap'
import { BsCheckCircleFill, BsEnvelope, BsFacebook, BsGeoAlt, BsGlobe2, BsInstagram, BsPhone, BsWhatsapp, BsYoutube } from 'react-icons/bs'
import { SiTiktok } from 'react-icons/si'
import type { SupportedLocale } from '@/lib/localization'
import styles from '../stores.module.css'
import type { StoreRecord } from '../mockStores'
import { buildMockPosts } from './mockPosts'
import StorePostCardMock from './StorePostCardMock'

function tr(v: { ar: string; en: string } | undefined, locale: SupportedLocale) {
  if (!v) return ''
  return locale === 'ar' ? v.ar : v.en
}

export default function StoreDetailsClient({ locale, store }: { locale: SupportedLocale; store: StoreRecord }) {
  const name = tr(store.name, locale)
  const city = tr(store.city, locale)
  const address = tr(store.address, locale)
  const desc = tr(store.description, locale)
  const posts = buildMockPosts(store.slug)
  const services = store.services_offered ? (locale === 'ar' ? store.services_offered.ar : store.services_offered.en) : []
  const categories = store.business_categories ? (locale === 'ar' ? store.business_categories.ar : store.business_categories.en) : []
  const socials = store.socials ?? {}

  return (
    <div className="container py-4 py-md-5 mt-5">
      <Card className="border-0 shadow-sm mb-3" style={{ overflow: 'hidden', borderRadius: 16 }}>
        <div style={{ position: 'relative', height: 180, background: 'rgba(23,125,193,0.06)', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
          {store.cover_image_url ? (
            <Image src={store.cover_image_url} alt={name} fill sizes="100vw" style={{ objectFit: 'cover' }} />
          ) : null}
        </div>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <div className={styles.logo} aria-hidden="true">
                {store.logo_image_url ? (
                  <Image src={store.logo_image_url} alt="" width={54} height={54} />
                ) : (
                  <span style={{ color: '#177dc1', fontWeight: 900 }}>{name?.slice(0, 1) || 'S'}</span>
                )}
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h4 className="mb-0" style={{ fontWeight: 900 }}>
                    {name}
                  </h4>
                  {store.is_verified && (
                    <span className={`${styles.badge} ${styles.badgeBrand}`}>
                      <BsCheckCircleFill className="me-1" />
                      {locale === 'ar' ? 'موثّق' : 'Verified'}
                    </span>
                  )}
                  <span className={`${styles.badge} ${store.is_open_now ? styles.badgeBrand : styles.badgeWarn}`}>
                    {store.is_open_now ? (locale === 'ar' ? 'مفتوح' : 'Open') : locale === 'ar' ? 'مغلق' : 'Closed'}
                  </span>
                </div>
                <div className="text-muted small">
                  <BsGeoAlt className="me-1" />
                  {city} • {address}
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 flex-wrap align-items-center">
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
              <Link className="btn btn-outline-secondary btn-sm" href={`/${locale}/stores`}>
                {locale === 'ar' ? 'كل المتاجر' : 'All stores'}
              </Link>
              <button className="btn btn-primary btn-sm" style={{ backgroundColor: '#177dc1', borderColor: '#177dc1' }}>
                {locale === 'ar' ? 'متابعة المتجر' : 'Follow store'}
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Row className="g-3">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <Tabs defaultActiveKey="posts" className="mb-3">
                <Tab eventKey="posts" title={locale === 'ar' ? 'المنشورات' : 'Posts'}>
                  <div className="vstack gap-3">
                    {posts.map((p) => (
                      <StorePostCardMock key={p.id} locale={locale} post={p} />
                    ))}
                  </div>
                </Tab>
                <Tab eventKey="about" title={locale === 'ar' ? 'عن المتجر' : 'About'}>
                  <Card className="border-0" style={{ background: 'rgba(15,23,42,0.03)' }}>
                    <CardBody>
                      <div className="fw-bold mb-2">{locale === 'ar' ? 'نبذة' : 'Overview'}</div>
                      <div className="text-muted">{desc || (locale === 'ar' ? 'وصف تجريبي للمتجر.' : 'Mock store description.')}</div>

                      {services.length ? (
                        <>
                          <hr />
                          <div className="fw-bold mb-2">{locale === 'ar' ? 'الخدمات المقدمة' : 'Services'}</div>
                          <div className="d-flex flex-wrap gap-2">
                            {services.map((x) => (
                              <span key={x} className={styles.serviceChip}>
                                {x}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : null}

                      {categories.length ? (
                        <>
                          <hr />
                          <div className="fw-bold mb-2">{locale === 'ar' ? 'فئات عمل المتجر' : 'Business categories'}</div>
                          <div className="d-flex flex-wrap gap-2">
                            {categories.map((x) => (
                              <span key={x} className={styles.badge}>
                                {x}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : null}
                      {store.tags?.length ? (
                        <div className="d-flex flex-wrap gap-2 mt-3">
                          {store.tags.map((t) => (
                            <span key={t} className={styles.badge}>
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </CardBody>
                  </Card>
                </Tab>
                <Tab eventKey="contact" title={locale === 'ar' ? 'التواصل' : 'Contact'}>
                  <div className="vstack gap-3">
                    <ContactRow icon={<BsPhone />} label={locale === 'ar' ? 'هاتف' : 'Phone'} value={store.phone || '-'} />
                    <ContactRow icon={<BsWhatsapp />} label="WhatsApp" value={store.whatsapp || '-'} />
                    <ContactRow icon={<BsEnvelope />} label={locale === 'ar' ? 'بريد' : 'Email'} value={store.email || '-'} />
                    <ContactRow icon={<BsGlobe2 />} label={locale === 'ar' ? 'الموقع' : 'Website'} value={store.website || '-'} />
                    <ContactRow icon={<BsGeoAlt />} label={locale === 'ar' ? 'العنوان' : 'Address'} value={`${city} • ${address}`} />
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </Col>

        <Col lg={4}>
          <div className="vstack gap-3">
            <div className={styles.kpi}>
              <div className="text-muted small">{locale === 'ar' ? 'التقييم' : 'Rating'}</div>
              <div className="fw-bold" style={{ fontSize: 22 }}>
                {Number(store.rating ?? 0).toFixed(1)}
              </div>
              <div className="text-muted small">{locale === 'ar' ? 'عدد المراجعات' : 'Reviews'}: {store.reviews_count ?? 0}</div>
            </div>

            <div className={styles.kpi}>
              <div className="text-muted small">{locale === 'ar' ? 'المتابعون' : 'Followers'}</div>
              <div className="fw-bold" style={{ fontSize: 22 }}>
                {store.followers_count ?? 0}
              </div>
              <div className="text-muted small">{store.is_open_now ? (locale === 'ar' ? 'مفتوح الآن' : 'Open now') : locale === 'ar' ? 'مغلق الآن' : 'Closed now'}</div>
            </div>

            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="fw-bold mb-2">{locale === 'ar' ? 'أقسام المتجر' : 'Store sections'}</div>
                <div className="vstack gap-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">{locale === 'ar' ? 'منشورات' : 'Posts'}</span>
                    <span className="fw-bold">3</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">{locale === 'ar' ? 'عروض' : 'Offers'}</span>
                    <span className="fw-bold">1</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">{locale === 'ar' ? 'خدمات' : 'Services'}</span>
                    <span className="fw-bold">2</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  )
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="d-flex align-items-center justify-content-between gap-3">
      <div className="d-flex align-items-center gap-2 text-muted">
        <span style={{ color: '#177dc1' }}>{icon}</span>
        <span className="fw-semibold">{label}</span>
      </div>
      <div className="text-dark text-end" style={{ maxWidth: 240 }}>
        {value}
      </div>
    </div>
  )
}

