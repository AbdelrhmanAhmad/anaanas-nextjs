'use client'

import { Card, CardBody } from 'react-bootstrap'
import { BsGeoAlt, BsTagFill } from 'react-icons/bs'
import type { SupportedLocale } from '@/lib/localization'
import type { StoreMockPost } from './mockPosts'

function tr(v: { ar: string; en: string }, locale: SupportedLocale) {
  return locale === 'ar' ? v.ar : v.en
}

function money(n: number) {
  try {
    return new Intl.NumberFormat().format(n)
  } catch {
    return String(n)
  }
}

export default function StorePostCardMock({ locale, post }: { locale: SupportedLocale; post: StoreMockPost }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardBody>
        <div className="d-flex gap-3">
          <div
            style={{
              width: 92,
              height: 72,
              borderRadius: 14,
              background: 'rgba(23,125,193,0.08)',
              border: '1px solid rgba(23,125,193,0.18)',
              flex: '0 0 auto',
            }}
          />
          <div className="flex-grow-1">
            <div className="fw-bold text-dark">{tr(post.title, locale)}</div>
            <div className="text-muted small mt-1 d-flex flex-wrap gap-3 align-items-center">
              <span className="fw-semibold text-dark">{money(post.price)}</span>
              <span>
                <BsGeoAlt className="me-1" />
                {tr(post.city, locale)}
              </span>
              <span>
                <BsTagFill className="me-1" />
                {locale === 'ar' ? 'منشور تجريبي' : 'Mock post'}
              </span>
            </div>
            {post.tags?.length ? (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {post.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="badge"
                    style={{
                      border: '1px solid rgba(15,23,42,0.12)',
                      background: 'rgba(15,23,42,0.04)',
                      color: 'rgba(15,23,42,0.78)',
                      borderRadius: 999,
                      padding: '6px 10px',
                      fontWeight: 800,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

