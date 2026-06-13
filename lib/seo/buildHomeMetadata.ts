import type { Metadata } from 'next'

import type { Country } from '@/lib/api/countries'
import type { SupportedLocale } from '@/lib/localization'
import { t } from '@/lib/translations'

import { getSiteOrigin } from '@/lib/seo/origin'

type HeaderGetter = { get(name: string): string | null }

function regionLabel(iso2: string | undefined, locale: SupportedLocale): string {
  if (!iso2) return ''
  const region = iso2.toUpperCase()
  try {
    const loc = locale === 'en' ? 'en' : 'ar'
    return new Intl.DisplayNames([loc], { type: 'region' }).of(region) ?? region
  } catch {
    return region
  }
}

function interpolate(template: string, vars: Record<string, string>): string {
  let s = template
  for (const [k, v] of Object.entries(vars)) {
    s = s.split(`{{${k}}}`).join(v)
  }
  return s
}

export function resolveHomeCountryLabel(
  uiLocale: SupportedLocale,
  country: Country | null,
  countryCode: string | null,
): string {
  const code = (country?.iso2 || country?.iso_code || countryCode || '').trim()
  if (uiLocale === 'ar') {
    const fromDb = country?.name?.trim()
    if (fromDb) return fromDb
    return regionLabel(code, 'ar') || t('home.seo.regionFallback', uiLocale)
  }
  return regionLabel(code, 'en') || country?.name?.trim() || t('home.seo.regionFallback', uiLocale)
}

export function buildHomeMetadata({
  uiLocale,
  country,
  countryCode,
  canonicalPath,
  headersList,
}: {
  uiLocale: SupportedLocale
  country: Country | null
  countryCode: string | null
  canonicalPath: string
  headersList: HeaderGetter
}): Metadata {
  const origin = getSiteOrigin(headersList)
  const path = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`
  const canonical = `${origin}${path}`

  const countryLabel = resolveHomeCountryLabel(uiLocale, country, countryCode)

  const title = interpolate(t('home.seo.title', uiLocale), { country: countryLabel })
  const description = interpolate(t('home.seo.description', uiLocale), { country: countryLabel })

  const absoluteTitle = `${title} | ANANAS`

  return {
    title: { absolute: absoluteTitle },
    description,
    alternates: {
      canonical,
      languages: {
        ar: `${origin}/ar`,
        en: `${origin}/en`,
        'x-default': `${origin}/ar`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      locale: uiLocale === 'ar' ? 'ar_SA' : 'en_US',
      siteName: 'ANANAS',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
    keywords: interpolate(t('home.seo.keywords', uiLocale), { country: countryLabel }).split(',').map((k) => k.trim()),
  }
}

export function buildHomeWebSiteJsonLd({
  origin,
  uiLocale,
  countryLabel,
  path,
}: {
  origin: string
  uiLocale: SupportedLocale
  countryLabel: string
  path: string
}) {
  const url = `${origin}${path.startsWith('/') ? path : `/${path}`}`
  const name =
    uiLocale === 'ar'
      ? `أناناس — ${countryLabel}`
      : `ANANAS — ${countryLabel}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    inLanguage: uiLocale === 'ar' ? 'ar' : 'en',
    publisher: {
      '@type': 'Organization',
      name: 'ANANAS',
      url: origin,
    },
  }
}
