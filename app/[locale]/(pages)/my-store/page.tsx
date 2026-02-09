import type { Metadata } from 'next'
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '@/lib/localization'
import MyStoreClient from './storeClient'

export const metadata: Metadata = { title: 'My Store' }

export default async function MyStorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeRaw } = await params
  const locale: SupportedLocale = isSupportedLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE

  return (
    <main className="container py-4 py-md-5 mt-5">
      <MyStoreClient locale={locale} />
    </main>
  )
}

