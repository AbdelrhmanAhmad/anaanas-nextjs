import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'
import { MOCK_STORES } from '../mockStores'
import StoreDetailsClient from './StoreDetailsClient'

export const metadata: Metadata = { title: 'Store' }

export default async function StoreDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: localeRaw, slug } = await params
  const locale: SupportedLocale = isSupportedLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE

  const store = MOCK_STORES.find((s) => s.slug === slug)
  if (!store) notFound()

  return <StoreDetailsClient locale={locale} store={store} />
}

