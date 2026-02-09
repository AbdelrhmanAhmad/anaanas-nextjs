'use client'

import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Tab, Tabs } from 'react-bootstrap'
import { BsBadgeAdFill, BsBarChartLineFill, BsGearFill, BsMegaphoneFill, BsStars } from 'react-icons/bs'
import type { SupportedLocale } from '@/lib/localization'

export default function MyStoreClient({ locale }: { locale: SupportedLocale }) {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div>
          <h4 className="mb-0" style={{ fontWeight: 900 }}>
            {locale === 'ar' ? 'متجري' : 'My Store'}
          </h4>
          <div className="text-muted small">
            {locale === 'ar'
              ? 'لوحة إدارة المحتوى والمنشورات وأدوات التسويق (واجهة فقط).'
              : 'Manage your content, posts, and marketing tools (UI only).'}
          </div>
        </div>
        <Link className="btn btn-outline-secondary btn-sm" href={`/${locale}/stores`}>
          {locale === 'ar' ? 'استعراض المتاجر' : 'Browse stores'}
        </Link>
      </div>

      <Card className="border-0 shadow-sm">
        <CardBody>
          <Tabs defaultActiveKey="overview" className="mb-3">
            <Tab eventKey="overview" title={locale === 'ar' ? 'نظرة عامة' : 'Overview'}>
              <Row className="g-3">
                <Col md={4}>
                  <Kpi title={locale === 'ar' ? 'إعلاناتي' : 'My ads'} value="24" icon={<BsBadgeAdFill />} />
                </Col>
                <Col md={4}>
                  <Kpi title={locale === 'ar' ? 'تميز الإعلانات' : 'Boosts'} value="3" icon={<BsStars />} />
                </Col>
                <Col md={4}>
                  <Kpi title={locale === 'ar' ? 'أداء الحملة' : 'Campaign performance'} value="+18%" icon={<BsBarChartLineFill />} />
                </Col>
              </Row>

              <Row className="g-3 mt-1">
                <Col lg={7}>
                  <Card className="border-0" style={{ background: 'rgba(23,125,193,0.05)', border: '1px solid rgba(23,125,193,0.12)' }}>
                    <CardBody>
                      <div className="fw-bold mb-2">{locale === 'ar' ? 'مهام سريعة' : 'Quick actions'}</div>
                      <div className="d-flex flex-wrap gap-2">
                        <button className="btn btn-sm btn-primary" style={{ backgroundColor: '#177dc1', borderColor: '#177dc1' }}>
                          {locale === 'ar' ? 'إنشاء إعلان' : 'Create ad'}
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">{locale === 'ar' ? 'جدولة نشر' : 'Schedule'}</button>
                        <button className="btn btn-sm btn-outline-secondary">{locale === 'ar' ? 'حزمة تمييز' : 'Boost package'}</button>
                      </div>
                      <div className="text-muted small mt-2">
                        {locale === 'ar'
                          ? 'هذه أزرار واجهة فقط (لا توجد API).'
                          : 'These are UI-only buttons (no API).'}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={5}>
                  <Card className="border-0 shadow-sm">
                    <CardBody>
                      <div className="fw-bold mb-2">{locale === 'ar' ? 'حالة المتجر' : 'Store status'}</div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted">{locale === 'ar' ? 'التوثيق' : 'Verification'}</span>
                        <span className="fw-bold" style={{ color: '#177dc1' }}>
                          {locale === 'ar' ? 'قيد المراجعة' : 'Pending'}
                        </span>
                      </div>
                      <hr />
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted">{locale === 'ar' ? 'الاشتراك' : 'Subscription'}</span>
                        <span className="fw-bold">{locale === 'ar' ? 'أساسي' : 'Basic'}</span>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="content" title={locale === 'ar' ? 'إدارة المحتوى' : 'Content'}>
              <Row className="g-3">
                <Col lg={7}>
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-0 pb-0">
                      <CardTitle className="mb-0">{locale === 'ar' ? 'بيانات المتجر' : 'Store profile'}</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div className="text-muted small mb-2">{locale === 'ar' ? 'واجهة تحرير تجريبية.' : 'Mock editor UI.'}</div>
                      <div className="vstack gap-2">
                        <input className="form-control" placeholder={locale === 'ar' ? 'اسم المتجر' : 'Store name'} defaultValue={locale === 'ar' ? 'متجري التجريبي' : 'My Demo Store'} />
                        <input className="form-control" placeholder={locale === 'ar' ? 'المدينة' : 'City'} defaultValue={locale === 'ar' ? 'عمّان' : 'Amman'} />
                        <input className="form-control" placeholder={locale === 'ar' ? 'رقم الهاتف' : 'Phone'} defaultValue="+96279xxxxxxx" />
                        <textarea className="form-control" rows={4} placeholder={locale === 'ar' ? 'وصف المتجر' : 'Description'} defaultValue={locale === 'ar' ? 'وصف تجريبي للمتجر.' : 'Mock store description.'} />
                        <button className="btn btn-primary" style={{ backgroundColor: '#177dc1', borderColor: '#177dc1' }}>
                          {locale === 'ar' ? 'حفظ' : 'Save'}
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={5}>
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-0 pb-0">
                      <CardTitle className="mb-0">{locale === 'ar' ? 'الإعدادات' : 'Settings'}</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <BsGearFill style={{ color: '#177dc1' }} />
                        <span>{locale === 'ar' ? 'خيارات العرض والتواصل' : 'Display & contact options'}</span>
                      </div>
                      <div className="mt-3 vstack gap-2">
                        <label className="form-check">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <span className="form-check-label">{locale === 'ar' ? 'إظهار واتساب' : 'Show WhatsApp'}</span>
                        </label>
                        <label className="form-check">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <span className="form-check-label">{locale === 'ar' ? 'إظهار البريد' : 'Show email'}</span>
                        </label>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="posts" title={locale === 'ar' ? 'إدارة منشوراتي' : 'My posts'}>
              <Card className="border-0 shadow-sm">
                <CardBody>
                  <div className="fw-bold mb-1">{locale === 'ar' ? 'قائمة منشوراتي' : 'My posts list'}</div>
                  <div className="text-muted small mb-3">
                    {locale === 'ar' ? 'هنا سيتم عرض PostCard لاحقًا (واجهة فقط).' : 'PostCard will be shown here later (UI only).'}
                  </div>
                  <div className="alert alert-secondary mb-0">
                    {locale === 'ar'
                      ? 'تم تجهيز تبويب “منشوراتي” كواجهة. سنربطه ببيانات فعلية لاحقًا.'
                      : '“My posts” tab is prepared as UI. We will connect real data later.'}
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab eventKey="marketing" title={locale === 'ar' ? 'أدوات تسويقية' : 'Marketing tools'}>
              <Row className="g-3">
                <Col lg={6}>
                  <MarketingCard
                    icon={<BsMegaphoneFill />}
                    title={locale === 'ar' ? 'حملات وترويج' : 'Campaigns & promotion'}
                    items={[
                      locale === 'ar' ? 'تمييز إعلان (Featured badge)' : 'Feature ad badge',
                      locale === 'ar' ? 'رفع إعلان للأعلى (Bump)' : 'Bump to top',
                      locale === 'ar' ? 'حزم ظهور إضافي' : 'Extra impressions packages',
                    ]}
                  />
                </Col>
                <Col lg={6}>
                  <MarketingCard
                    icon={<BsBarChartLineFill />}
                    title={locale === 'ar' ? 'تقارير وأداء' : 'Reports & performance'}
                    items={[
                      locale === 'ar' ? 'متابعة الأداء حسب الفترة' : 'Track performance by date range',
                      locale === 'ar' ? 'مقارنة الحملات' : 'Compare campaigns',
                      locale === 'ar' ? 'اقتراحات تحسين تلقائية' : 'Auto optimization suggestions',
                    ]}
                  />
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  )
}

function Kpi({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="text-muted small">{title}</div>
            <div className="fw-bold" style={{ fontSize: 24 }}>
              {value}
            </div>
          </div>
          <div
            className="d-grid place-items-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(23,125,193,0.10)',
              border: '1px solid rgba(23,125,193,0.18)',
              color: '#177dc1',
            }}
          >
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function MarketingCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <CardHeader className="border-0 pb-0">
        <CardTitle className="mb-0">{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="d-flex align-items-center gap-2 text-muted mb-2">
          <span style={{ color: '#e0903d' }}>{icon}</span>
          <span className="fw-semibold">Tools</span>
        </div>
        <ul className="mb-0">
          {items.map((x) => (
            <li key={x} className="text-muted">
              {x}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  )
}

