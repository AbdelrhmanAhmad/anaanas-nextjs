import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { t } from '@/lib/translations'
import { DEFAULT_LOCALE, isSupportedLocale } from '@/lib/localization'
import { callLaravel } from '@/lib/laravelClient'

export const metadata: Metadata = { title: 'About' }

function pickName(value: any, locale: 'ar' | 'en') {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    if (typeof value[locale] === 'string') return value[locale]
    if (typeof value.ar === 'string') return value.ar
    if (typeof value.en === 'string') return value.en
  }
  return String(value)
}

const FollowsBlock = async () => {
  const headersList = await headers()
  const headerLocale = headersList.get('x-locale') || 'ar'
  const locale = (isSupportedLocale(headerLocale) ? headerLocale : DEFAULT_LOCALE) as 'ar' | 'en'
  let sections: any[] = []
  let categories: any[] = []
  try {
    const res = await callLaravel('/api/follows', { method: 'GET' })
    sections = Array.isArray(res?.data?.sections) ? res.data.sections : []
    categories = Array.isArray(res?.data?.categories) ? res.data.categories : []
  } catch {
    sections = []
    categories = []
  }

  return (
    <Card>
      <CardHeader className="d-sm-flex justify-content-between border-0 pb-0">
        <CardTitle>{t('profile.followsTitle', locale)}</CardTitle>
      </CardHeader>
      <CardBody>
        {sections.length === 0 && categories.length === 0 ? (
          <p className="text-muted small mb-0">{t('profile.followsHint', locale)}</p>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {sections.map((s) => (
              <Link key={`sec-${s.id}`} href={`/${locale}/${s.slug}`} className="badge bg-light text-dark text-decoration-none px-3 py-2">
                #{pickName(s.name, locale)}
              </Link>
            ))}
            {categories.map((c) => (
              <Link
                key={`cat-${c.id}`}
                href={`/${locale}/${c.section?.slug || ''}/${c.slug}`}
                className="badge bg-warning-subtle text-dark text-decoration-none px-3 py-2"
              >
                {pickName(c.name, locale)}
              </Link>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}

const About = async () => {
  return (
    <>
      <FollowsBlock />
    </>
  )
}
export default About
